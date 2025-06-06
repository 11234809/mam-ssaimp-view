<template>
  <keep-alive>
    <div class="smart-energy">
      <!-- left -->
      <div class="smart-energy-left">
        <!-- 巡检信息 -->
        <div class="smart-energy-left-item">
          <div class="item-top">服务区设施</div>
          <div class="item-bottom">
            <div class="service-title">
              <div class="item active">基础服务设施</div>
              <div class="item">能源服务设施</div>
            </div>

            <div class="service-box">
              <div class="box-item">
                <!-- 定义渐变色 -->
                <svg width="0" height="0">
                  <defs>
                    <!-- 渐变色ID需唯一 -->
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#B8F88C" />  <!-- 起点颜色 -->
                      <stop offset="100%" stop-color="#21A9BF" /> <!-- 终点颜色 -->
                    </linearGradient>
                  </defs>
                </svg>
                <el-progress type="circle" class="gradient-progress" :percentage="serveceInfo?.toiletRate" stroke-width="5" width="50"
                             color="#1DA7C0" />
                <div class="txt-box">
                  <div class="txt">卫生间</div>
                  <div class="num">{{ serveceInfo?.toiletNum }}</div>
                </div>
              </div>
              <div class="box-item">
                <el-progress type="circle" :percentage="serveceInfo?.babyRoomRate" stroke-width="5" width="50"
                             color="#1DA7C0"/>
                <div class="txt-box">
                  <div class="txt">母婴室</div>
                  <div class="num">{{ serveceInfo?.babyRoomNum }}</div>
                </div>
              </div>
              <div class="box-item">
                <el-progress type="circle" :percentage="serveceInfo?.superMarketRate" stroke-width="5" width="50"
                             color="#1DA7C0"/>
                <div class="txt-box">
                  <div class="txt">商超</div>
                  <div class="num">{{ serveceInfo?.superMarketNum }}</div>
                </div>
              </div>
              <div class="box-item">
                <el-progress type="circle" :percentage="serveceInfo?.superMarketRate" stroke-width="5" width="50"
                             color="#1DA7C0"/>
                <div class="txt-box">
                  <div class="txt">停车</div>
                  <div class="num">{{ serveceInfo?.parkingRate }}</div>
                </div>
              </div>
              <div class="box-item">
                <el-progress type="circle" :percentage="serveceInfo?.driverHomeRate" stroke-width="5" width="50"
                             color="#1DA7C0"/>
                <div class="txt-box">
                  <div class="txt">司机之家</div>
                  <div class="num">{{ serveceInfo?.driverHomeNum }}</div>
                </div>
              </div>
              <div class="box-item">
                <el-progress type="circle" :percentage="serveceInfo?.carRepairRate" stroke-width="5" width="50"
                             color="#1DA7C0"/>
                <div class="txt-box">
                  <div class="txt">汽修</div>
                  <div class="num">{{ serveceInfo?.carRepairNum }}</div>
                </div>
              </div>
              <div class="box-item">
                <el-progress type="circle" :percentage="serveceInfo?.roomRate" stroke-width="5" width="50"
                             color="#1DA7C0"/>
                <div class="txt-box">
                  <div class="txt">客房</div>
                  <div class="num">{{ serveceInfo?.roomNum }}</div>
                </div>
              </div>
              <div class="box-item">
                <el-progress type="circle" :percentage="serveceInfo?.showerRate" stroke-width="5" width="50"
                             color="#1DA7C0"/>
                <div class="txt-box">
                  <div class="txt">淋浴</div>
                  <div class="num">{{ serveceInfo?.showerNum }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 车流量占比信息 -->
        <div class="smart-energy-left-item">
          <div class="item-top">车流量占比信息</div>
          <TimeTypeSelector v-model="dangerCar.selectTimeType"
                            @select="(event)=>handleSelectDangerCarRanking(event,'1')"/>
          <div class="item-bottom1">
            <div ref="dangerCarRef" style="width: 250px; height: 250px"></div>
            <div class="tips">
              <div class="tps-item" @click="toUrl('1')">
                <div class="hr"></div>
                <div class="tit">客车</div>
                <div class="num">{{ carInfo?.passengerCarTraffic || 0 }}</div>
                <div class="num">{{ carInfo?.passengerCarTrafficRate || 0 }}%</div>
              </div>
              <div class="tps-item m2" @click="toUrl('1')">
                <div class="hr bg1"></div>
                <div class="tit">货车</div>
                <div class="num">{{ carInfo?.truckCarTraffic || 0 }}</div>
                <div class="num">{{ carInfo?.truckCarTrafficRate || 0 }}%</div>
              </div>
              <div class="tps-item" @click="toUrl('1')">
                <div class="hr bg2"></div>
                <div class="tit">新能源车</div>
                <div class="num">{{ carInfo?.newEnergyCarTraffic || 0 }}</div>
                <div class="num">{{ carInfo?.newEnergyCarTrafficRate || 0 }}%</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 客流量占比信息 -->
        <div class="smart-energy-left-item">
          <div class="item-top">客流量占比信息</div>
          <TimeTypeSelector v-model="people.selectTimeType"
                            @select="(event)=>handleSelectDangerCarRanking(event,'2')"/>
          <div class="item-bottom1">
            <div ref="dangerCarNetRef" style="width: 250px; height: 250px"></div>
            <div class="tips">
              <div class="tps-item">
                <div class="hr"></div>
                <div class="tit">男客</div>
                <div class="num">{{ personInfo?.manTraffic || 0 }}</div>
                <div class="num">{{ personInfo?.manTrafficRate || 0 }}%</div>
              </div>
              <div class="tps-item m2">
                <div class="hr bg1"></div>
                <div class="tit">女客</div>
                <div class="num">{{ personInfo?.womanTraffic || 0 }}</div>
                <div class="num">{{ personInfo?.womanTrafficRate || 0 }}%</div>
              </div>
              <div class="tps-item">
                <div class="hr bg2"></div>
                <div class="tit">其他</div>
                <div class="num">{{ personInfo?.otherTraffic || 0 }}</div>
                <div class="num">{{ personInfo?.otherTrafficRate || 0 }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- left end -->

      <!-- center -->
      <div class="smart-energy-center">
        <div class="smart-energy-center-header">
          <!-- 服务区数 -->
          <div class="center-header-item">
            <img src="../../images/manage/i1.png" class="icon"/>
            <div class="center-header-item-bottom">
              <div class="center-header-item-bottom-time">
                <span class="center-header-item-bottom-time-num">{{ centerHeaderData.dangerCount }}</span>
                <span class="center-header-item-bottom-time-unit">%</span>
              </div>
              <div class="center-header-item-bottom-label">服务区数(侧)</div>
            </div>
          </div>
          <!-- 车流量 -->
          <div class="center-header-item">
            <img src="../../images/smartService/car.png" class="icon"/>
            <div class="center-header-item-bottom">
              <div class="center-header-item-bottom-time">
                <span class="center-header-item-bottom-time-num">{{ centerHeaderData.serviceCount }}</span>
              </div>
              <div class="center-header-item-bottom-label">车流量</div>
            </div>
          </div>
          <!-- 货车 -->
          <div class="center-header-item">
            <img src="../../images/manage/i3.png" class="icon"/>
            <div class="center-header-item-bottom">
              <div class="center-header-item-bottom-time">
                <span class="center-header-item-bottom-time-num">{{ centerHeaderData.suddenCount }}</span>
              </div>
              <div class="center-header-item-bottom-label">货车</div>
            </div>
          </div>
          <!-- 新能源车 -->
          <div class="center-header-item">
            <img src="../../images/manage/i4.png" class="icon"/>
            <div class="center-header-item-bottom">
              <div class="center-header-item-bottom-time">
                <span class="center-header-item-bottom-time-num">{{ centerHeaderData.suddenCount }}</span>
              </div>
              <div class="center-header-item-bottom-label">新能源车</div>
            </div>
          </div>

          <!-- 驶入率 -->
          <div class="center-header-item">
            <img src="../../images/smartService/pie.png" class="icon"/>
            <div class="center-header-item-bottom">
              <div class="center-header-item-bottom-time">
                <span class="center-header-item-bottom-time-num">{{ centerHeaderData.dangerCount }}</span>
                <span class="center-header-item-bottom-time-unit">%</span>
              </div>
              <div class="center-header-item-bottom-label">驶入率</div>
            </div>
          </div>
          <!-- 饱和度 -->
          <div class="center-header-item">
            <img src="../../images/smartService/pie.png" class="icon"/>
            <div class="center-header-item-bottom">
              <div class="center-header-item-bottom-time">
                <span class="center-header-item-bottom-time-num">{{ centerHeaderData.serviceCount }}</span>
                <span class="center-header-item-bottom-time-unit">%</span>
              </div>
              <div class="center-header-item-bottom-label">饱和度</div>
            </div>
          </div>
          <!-- 客流量 -->
          <div class="center-header-item">
            <img src="../../images/smartService/people.png" class="icon"/>
            <div class="center-header-item-bottom">
              <div class="center-header-item-bottom-time">
                <span class="center-header-item-bottom-time-num">{{ centerHeaderData.suddenCount }}</span>
              </div>
              <div class="center-header-item-bottom-label">客流量</div>
            </div>
          </div>
          <!-- 充电站 -->
          <div class="center-header-item">
            <img src="../../images/manage/i8.png" class="icon"/>
            <div class="center-header-item-bottom">
              <div class="center-header-item-bottom-time">
                <span class="center-header-item-bottom-time-num">{{ centerHeaderData.suddenCount }}</span>
              </div>
              <div class="center-header-item-bottom-label">充电站</div>
            </div>
          </div>

          <!-- 充电枪 -->
          <div class="center-header-item">
            <img src="../../images/manage/i9.png" class="icon"/>
            <div class="center-header-item-bottom">
              <div class="center-header-item-bottom-time">
                <span class="center-header-item-bottom-time-num">{{ centerHeaderData.suddenCount }}</span>
              </div>
              <div class="center-header-item-bottom-label">充电枪</div>
            </div>
          </div>
          <!-- 充电枪占用率 -->
          <div class="center-header-item">
            <img src="../../images/smartService/light.png" class="icon"/>
            <div class="center-header-item-bottom">
              <div class="center-header-item-bottom-time">
                <span class="center-header-item-bottom-time-num">{{ centerHeaderData.serviceCount }}</span>
                <span class="center-header-item-bottom-time-unit">%</span>
              </div>
              <div class="center-header-item-bottom-label">充电枪占用率</div>
            </div>
          </div>

        </div>
        <div class="search-box">
          <div class="area-btn" @click="openSearchALert">
            服务区筛选
          </div>

          <div class="search-input-box">
            <input type="text" class="input" placeholder="服务区搜索"/>
            <div class="box-btn"></div>
          </div>
        </div>
        <div class="center-bottom">
          <Map/>
        </div>


      </div>
      <!-- center end -->


      <!-- right -->
      <div class="smart-energy-right">
        <div class="smart-energy-right-item">
          <div class="item-top">充电繁忙度排名</div>
          <TimeTypeSelector v-model="carUse.selectTimeType" @select="handleSelectCarUseRanking"/>
          <div class="item-bottom">
            <div class="item-table">
              <!-- 表头 -->
              <table class="item-table-content table-header">
                <thead>
                <tr>
                  <th v-for="(col, index) in carUseColumns" :key="index">{{ col.label }}</th>
                </tr>
                </thead>
              </table>

              <!-- 表体-->
              <div class="table-body">
                <table class="item-table-content">
                  <tbody ref="scrollContent">
                  <tr class="" v-for="(item, index) in carUseData">
                    <td v-for="(col, i) in carUseColumns" :key="i">
                      <div class="io" :class="'b'+index" v-if="i==0">TOP{{ index + 1 }}</div>
                      <span v-else>{{ item[col.prop] }}</span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        <!-- 经营信息 -->
        <div class="smart-energy-left-item">
          <div class="item-top">经营信息</div>
          <TimeTypeSelector v-model="dangerCar.selectTimeType"
                            @select="handleSelectDangerCarRanking"/>
          <div class="item-bottom" style="position: relative;">
            <div class="income-txt">
              <div class="tit">总收入</div>
              <div class="num">1315.97</div>
              <div class="num-txt">万元</div>
            </div>
            <div ref="incomeInfoRef" style="width: 450px; height: 200px"></div>

            <div class="income-tps-box">
              <div class="tit">油品收入</div>
              <div class="num">
                <div class="num-n">2172</div>
                <div class="num-d">万元</div>
              </div>
              <div class="hr"></div>
            </div>

            <div class="income-tps-box box-r">
              <div class="tit">非油品收费</div>
              <div class="num">
                <div class="num-n">2172</div>
                <div class="num-d">万元</div>
              </div>
              <div class="hr"></div>
            </div>
          </div>
        </div>

        <!-- 经营收入排名 -->
        <div class="smart-energy-left-item">
          <div class="item-top">经营收入排名</div>
          <TimeTypeSelector v-model="dangerCar.selectTimeType"
                            @select="handleSelectDangerCarRanking"/>
          <div class="item-bottom">
            <div ref="incomeRef" style="width: 450px; height: 260px"></div>
          </div>
        </div>


      </div>
      <!-- right end -->

      <!-- 服务器筛选 -->
      <searchAlert ref='searchRef' :from-data="searchAreaArr" @ok="chooseSearch"></searchAlert>
      <!-- 服务器筛选 end -->

      <!-- 服务区详情 -->
      <searchAreaAlert></searchAreaAlert>

    </div>
  </keep-alive>
</template>
<script setup>
import {computed, getCurrentInstance, nextTick, onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import TimeTypeSelector from "../time-type-selector/index.vue";
import * as echarts from "echarts";
import {getRowBarOption} from './pie'
import {getPie3D} from './pie3d'
import {getRowXBarOption} from '../../service_xbar'
import searchAlert from '../service-search-alert/index';
import Map from '@/components/map/index.vue';
import {getServiceCar, getServiceEquipment, getServicePerson} from "@/api/bigScreen/service-devices";
import {dayjs} from "element-plus";
import {bigScreen} from "@/store/bigScreen";


const {
  proxy
} = getCurrentInstance();
const router = useRouter();

const components = {
  searchAlert
}

//顶部数据
const centerHeaderData = reactive({
  dangerCount: 0, //危化品车辆
  serviceCount: 0, //司机之家服务人次
  suddenCount: 0, //突发事件
});

/* 危化品车辆排名: DangerCarRanking */
const dangerCar = reactive({
  selectTimeType: "0",
  dateRange: [],
});

const people = reactive({
  selectTimeType: "0",
  dateRange: [],
});

// 获取当前季度的开始和结束月份
function getCurrentQuarterRange() {
  const currentMonth = dayjs().month(); // 0-11 (0=一月, 11=十二月)
  const currentYear = dayjs().year();

  // 计算季度
  const quarter = Math.floor(currentMonth / 3) + 1; // 1-4

  // 计算季度开始和结束月份
  const startMonth = (quarter - 1) * 3; // 0, 3, 6, 9
  const endMonth = startMonth + 2;      // 2, 5, 8, 11

  // 返回季度开始和结束的日期（格式：YYYY-MM-DD）
  return {
    start: dayjs().month(startMonth).startOf('month').format('YYYY-MM'),
    end: dayjs().month(endMonth).endOf('month').format('YYYY-MM'),
    // 如果需要月份数字（1-12）：
    startMonth: startMonth + 1, // 转换为1-12
    endMonth: endMonth + 1,
  };
}


const carParams = ref()

function handleSelectDangerCarRanking(payload, type) {
  // dangerCar.selectTimeType = payload.code;
  console.log(payload);
  let params = {
    selectTimeType: '0',
    timeList: [],
    time: null,
    startDate: null,
    endDate: null,
    type:null,
  }
  // 昨日
  if (payload.code === '0') {
    params.selectTimeType = '0'
    params.type = '1'
    params.time = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    params.startDate = dayjs().subtract(2, 'day').format('YYYY-MM-DD');
    params.endDate = params.time
  } else if (payload.code === '1') {
    params.selectTimeType = '0'
    params.type = '0'
    params.time = dayjs().format('YYYY-MM-DD');

    params.startDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    params.endDate = params.time
  } else if (payload.code === '2') {
    const weekStart = dayjs().startOf('week').format('YYYY-MM-DD');
    const weekEnd = dayjs().endOf('week').format('YYYY-MM-DD');
    params.selectTimeType = '1'
    params.type = '2'
    params.timeList = [weekStart, weekEnd]

    params.startDate = weekStart
    params.endDate = weekEnd
  } else if (payload.code === '3') { // 月
    params.selectTimeType = '2'
    params.type = '3'
    params.time = dayjs().format('YYYY-MM');

    params.startDate = dayjs().startOf('month').format('YYYY-MM-DD');
    params.endDate = dayjs().endOf('month').format('YYYY-MM-DD');
  } else if (payload.code === '4') {//季度
    params.selectTimeType = '3'
    params.type = '4'
    let {start, end} = getCurrentQuarterRange()
    params.timeList = [start, end]

    params.startDate = dayjs(start).startOf('month').format('YYYY-MM-DD');
    params.endDate = dayjs(end).endOf('month').format('YYYY-MM-DD');
  } else if (payload.code === '5') {
    params.selectTimeType = '4'
    params.type = '5'
    params.time = dayjs().format('YYYY');

    params.startDate = dayjs().startOf('year').format('YYYY-MM-DD');
    params.endDate = dayjs().endOf('year').format('YYYY-MM-DD');
  } else if (payload.code === "6") {
    params.timeList = payload.dateRange || [];
    params.selectTimeType = '5'
    params.startDate = payload.dateRange[0];
    params.endDate = payload.dateRange[1];
  }

  if (type === '1') {
    getCarData(params)

  } else if (type === '2') {
    getPeopleData(params)
  }

  // chargingRankingEcharts(payload);
}

let dangerCarChart = null
let dangerCarRef = ref('');
const dangerCarEcharts = () => {
  let chartData = [
    {value: 0, name: '客车', itemStyle: {color: '#1DA7C0'}},
    {value: 0, name: '货车', itemStyle: {color: '#E28E61'}},
    {value: 0, name: '新能源车', itemStyle: {color: '#CECE41'}}
  ]
  nextTick(() => {
    if (!dangerCarChart) {
      dangerCarChart = echarts.init(dangerCarRef.value);
      let option = getRowBarOption(chartData, {})
      dangerCarChart && dangerCarChart.setOption(option);
      dangerCarChart.on('click', function (params) {
        console.log(params);
        toUrl('1')
      })
    }
  })
};
dangerCarEcharts()

//危化品车辆分布
let dangerCarNetChart = null
let dangerCarNetRef = ref('');
const dangerCarNetEcharts = () => {
  let chartData = [
    {value: 0, name: '男客', itemStyle: {color: '#1DA7C0'}},
    {value: 0, name: '女客', itemStyle: {color: '#E28E61'}},
    {value: 0, name: '其他', itemStyle: {color: '#CECE41'}}
  ]
  nextTick(() => {
    if (!dangerCarNetChart) {
      dangerCarNetChart = echarts.init(dangerCarNetRef.value);
      let option = getRowBarOption(chartData, {})
      dangerCarNetChart && dangerCarNetChart.setOption(option);
    }
  })
};
dangerCarNetEcharts()

/* 充电繁忙度排名: carUseRanking */
const carUse = reactive({
  selectTimeType: "0",
  dateRange: [],
});

function handleSelectCarUseRanking(payload) {
  carUse.selectTimeType = payload.code;
  if (payload.code === "6") {
    carUse.dateRange = payload.dateRange || [];
  }
  // chargingRankingEcharts(payload);
}

const carUseData = ref([]);
const carUseColumns = [
  {label: "排名", prop: "serviceAreaName"},
  {label: "服务区名称", prop: "exPassengerNumber"},
  {label: "繁忙度", prop: "exTruckNumber"},
];

let arr = [];
for (let i = 0; i < 5; i++) {
  arr.push({
    serviceAreaName: 'TOP' + i,
    exPassengerNumber: 'xxx服务区',
    exTruckNumber: '7.25'
  })
}
carUseData.value = arr;

//经营信息
let incomeInfoChart = null
let incomeInfoRef = ref('');
const incomeInfoEcharts = () => {
  let chartData = {
    data: [100, 200, 1, 150, 180],
    yData: [],
    xData: ['xxx服务区', 'xxx服务区', 'xxx服务区', 'xxx服务区', 'xxx服务区'],
  }
  nextTick(() => {
    if (!incomeInfoChart) {
      incomeInfoChart = echarts.init(incomeInfoRef.value);
      let option = getPie3D([{
        name: '已消除',
        value: 3,
        itemStyle: {
          opacity: 0.5,
          color: 'rgba(0, 138, 255, 0.8)',
        }
      }

        , {
          name: '未消除',
          value: 1,
          itemStyle: {
            opacity: 0.5,
            color: 'rgba(255, 138, 0, 0.8)',
          }
        }

      ], 2);
      incomeInfoChart && incomeInfoChart.setOption(option);
    }
  })
};
incomeInfoEcharts()

//经营收入排名
let incomeChart = null
let incomeRef = ref('');
const incomeEcharts = () => {
  let chartData = {
    data: [100, 200, 1, 150, 180],
    yData: [],
    xData: ['xxx服务区', 'xxx服务区', 'xxx服务区', 'xxx服务区', 'xxx服务区'],
  }
  nextTick(() => {
    if (!incomeChart) {
      incomeChart = echarts.init(incomeRef.value);
      let option = getRowXBarOption(chartData, {
        barColor: [
          {offset: 0, color: "#0d488d"},
          {offset: 0.5, color: "#38a7c7"},
          {offset: 1, color: "#5DF7F8"},
        ]
      })
      incomeChart && incomeChart.setOption(option);
    }
  })
};
incomeEcharts()


//服务区筛选数据
let searchRef = ref('');
const openSearchALert = () => {
  searchRef.value.open();
}
const searchAreaArr = ref([]);

let areaArr = [];

areaArr.push({
  title: '星级',
  field: 'star',
  children: [
    {
      id: 1,
      title: '5级'
    },
    {
      id: 2,
      title: '4级'
    },
    {
      id: 3,
      title: '3级'
    },
    {
      id: 4,
      title: '达标'
    }
  ]
})

areaArr.push({
  title: '路线',
  field: 'route',
  children: [
    {
      id: 1,
      title: 'G75兰海高速'
    },
    {
      id: 2,
      title: 'G75兰海高速级'
    },
    {
      id: 3,
      title: 'G75兰海高速级'
    },
    {
      id: 4,
      title: 'G75兰海高速'
    }
  ]
})

areaArr.push({
  title: '服务区状态',
  field: 'status',
  children: [
    {
      id: 1,
      title: '在建'
    },
    {
      id: 2,
      title: '建成运营'
    },
    {
      id: 3,
      title: '建成未运营'
    },
    {
      id: 4,
      title: '关闭'
    }
  ]
})

areaArr.push({
  title: '其他',
  field: 'other',
  children: [
    {
      id: 1,
      title: '司机之家'
    },
    {
      id: 2,
      title: '特色服务区'
    },
    {
      id: 3,
      title: '同心驿站'
    }
  ]
})
searchAreaArr.value = areaArr;

//搜索回调
const chooseSearch = (res) => {
  console.log(res)
}

const serveceInfo = ref()
const carInfo = ref()
const personInfo = ref()

function getData() {
  getServiceEquipment().then(res => {
    serveceInfo.value = res.data.records[0]
  })

  getCarData()
  getPeopleData()
}

function getCarData(params) {
  let _params = {
    selectTimeType: 0,
    time: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    startDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  }
  if (params) {
    _params = params
  }
  carParams.value = _params
  getServiceCar(_params).then(res => {
    console.log(res, 'getData')
    carInfo.value = res.data.records[0]

    let chartData = [
      {value: carInfo.value?.passengerCarTraffic || 0, name: '客车', itemStyle: {color: '#1DA7C0'}},
      {value: carInfo.value?.truckCarTraffic || 0, name: '货车', itemStyle: {color: '#E28E61'}},
      {value: carInfo.value?.newEnergyCarTraffic || 0, name: '新能源车', itemStyle: {color: '#CECE41'}}
    ]
    console.log(chartData, '22')
    let option = getRowBarOption(chartData, {})
    dangerCarChart && dangerCarChart.setOption(option);
  })
}

function getPeopleData(params) {
  let _params = {
    selectTimeType: 0,
    time: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    startDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  }
  if (params) {
    _params = params
  }
  getServicePerson(_params).then(res => {
    personInfo.value = res.data.records[0]

    let chartData = [
      {value: personInfo.value?.manTraffic || 0, name: '男客', itemStyle: {color: '#1DA7C0'}},
      {value: personInfo.value?.womanTraffic || 0, name: '女客', itemStyle: {color: '#E28E61'}},
      {value: personInfo.value?.otherTraffic || 0, name: '其他', itemStyle: {color: '#CECE41'}}
    ]
    let option = getRowBarOption(chartData, {})
    dangerCarNetChart && dangerCarNetChart.setOption(option);

  })
}


function toUrl(tag) {
  // 车流量
  if (tag === '1') {
    const store = bigScreen();
    console.log(carParams.value,'carParams.value')
    store.setData({...carParams.value,selectTimeType:carParams.value.type});
    proxy.$Bus.emit("jumpAgency", {
      url: "/daily/dailyIncome",
      // data: data,
    });
  }
}
// 动态计算渐变色（根据百分比）
const gradientColor = computed(() => {
  return `url(#progress-gradient)`; // 绑定SVG渐变
});
onMounted(() => {
  getData()
})

</script>
<style lang="less" scoped>

.gradient-progress-container {
  position: relative;
}

/* 覆盖Element默认样式 */
:deep(.el-progress-circle__path) {
  stroke: v-bind(gradientColor); /* 动态绑定渐变色 */
  stroke-linecap: round; /* 圆角端点 */
}

::v-deep(.el-progress-circle__track) {
  stroke: #507190;
}

.mt24 {
  margin-top: 24px;
}

.mt30 {
  margin-top: 30px;
}

.smart-energy {
  display: flex;
  height: calc(100% - 108px);
  width: 100%;
  color: #fff;
  margin-top: -100px;
  padding: 0px 2px;
}

.smart-energy-left,
.smart-energy-right {
  flex: 1;
  height: 100%;
  background-color: #16283a;
  /* 各占1份 */
  /* background-color: pink; */
  /* 方便区分颜色 */
}

.smart-energy-left-item,
.smart-energy-right-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 319px;
  background-position: center 0;
  position: relative;
}

.item-top {
  flex: 1;
  width: 412px;
  height: 40px;
  line-height: 40px;
  padding-left: 34px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  margin-top: 8px;
  margin-left: 2.2rem;
  background: url("../../images/manage/tit_bg.png") left no-repeat;
  background-size: auto 100%;
  margin-bottom: 22px;
}

.item-bottom {
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #fff;
  gap: 2px;
  /* 可以加点间距，看效果 */

  .income-txt {
    width: 100%;
    display: flex;
    height: 24px;
    align-items: center;
    justify-content: center;
    margin-top: 15px;

    .tit {
      font-size: 18px;
      color: #D1D6DF;
      font-style: italic;
      background: linear-gradient(0deg, #ACDDFF 0%, #FFFFFF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .num {
      font-size: 24px;
      color: #B2D76A;
      line-height: 32px;
      margin-left: 15px;
    }

    .num-txt {
      font-size: 16px;
      color: #B2D76A;
    }

  }

  .income-tps-box {
    position: absolute;
    left: 49px;
    top: 49px;
    z-index: 999;

    &.box-r {
      left: auto;
      right: 49px;
      top: 59px;

      .num {
        .num-n {
          color: rgba(215, 101, 36, 0.75);
          text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
        }

        .num-d {
          color: rgba(215, 101, 36, 0.75);
          text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
        }
      }

      .hr {
        background: rgba(215, 101, 36, 1);
      }
    }


    .tit {
      height: 20px;
      color: #fff;
      line-height: 20px;
      opacity: 0.6;
    }

    .num {
      height: 19px;
      margin-top: 12px;
      display: flex;
      align-items: center;

      .num-n {
        font-size: 26px;
        height: 19px;
        line-height: 19px;
        color: rgba(111, 236, 255, 0.75);
        text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
      }

      .num-d {
        font-size: 12px;
        color: rgba(111, 236, 255, 0.75);
        text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
        margin-left: 10px;
        height: 19px;
        line-height: 29px;
      }
    }

    .hr {
      width: 62px;
      height: 2px;
      background: #00CCFF;
      margin-top: 11px;
    }
  }

  .service-title {
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: center;
    margin-bottom: 30px;

    .item {
      width: 163px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-size: 16px;
      color: #D1D6DF;
      cursor: pointer;

      &.active {
        background-image: linear-gradient(to right, transparent 0%, RGBA(30, 90, 121, 1) 50%, transparent 100%);
      }

    }
  }

  .service-box {
    display: grid;
    grid-template-columns: repeat(4, auto);
    gap: 10px 5px;
    justify-content: space-around;
    padding: 0 30px;

    .box-item {
      width: 84px;
      min-height: 74;
      background: url('../../images/sc.png') top center no-repeat;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      padding-top: 12px;

      /deep/ .el-progress .el-progress__text {
        color: #50E0FF;

        span {
          font-size: 14px
        }
      }

      .txt-box {
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 5px;

        .txt {
          font-size: 14px;
          color: #D4DBE4;
        }

        .num {
          font-size: 18px;
          color: #0BE1D9;
          margin-left: 7px;
        }
      }
    }
  }

}

.item-bottom1 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fff;

  .tips {
    margin-left: -20px;

    .tps-item {
      display: flex;
      align-items: center;

      &.m2 {
        margin: 15px 0;
      }

      .hr {
        width: 6px;
        height: 6px;
        background: #1DA7C0;

        &.bg1 {
          background: #F67B44;
        }

        &.bg2 {
          background: #CECE41;
        }
      }

      .tit {
        width: 60px;
        font-size: 14px;
        color: #A4B3C5;
        margin-left: 6px;
      }

      .num {
        font-size: 16px;
        margin-left: 14px;

      }
    }
  }
}

.item-info-box {
  width: 100%;
  height: 296px;

  .box-title {
    padding-left: 28px;
    display: flex;
    align-items: center;
    font-size: 16px;

    .li {
      width: 24px;
      height: 24px;
      background: url('../../images/manage/li.png');
      margin-right: 3px;
    }

    .txt {
      min-width: 90px;
      line-height: 24px;
      height: 24px;
    }

    .hr {
      width: 200px;
      height: 2px;
      margin-left: 17px;
      background: url('../../images/manage/line.png');
      background-size: 100% auto;
    }
  }

  .box-item {
    height: 64rpx;
    display: flex;
    align-items: center;
    padding-left: 34px;
    margin-top: 16px;

    .icon {
      object-fit: cover;
      width: 65px;
      height: 65px
    }

    .item-ul {
      height: 34px;
      width: 328px;
      margin-left: 16px;
      display: flex;
      align-items: center;
      background-image: linear-gradient(to right, transparent 0%, rgba(27, 59, 90, 0.8) 50%, transparent 100%);

      .ul-item {
        width: 115px;
        height: 18px;
        line-height: 18px;
        display: flex;
        align-items: flex-end;

        &.w2 {
          width: 105px;
        }

        .tit {
          font-size: 18px;
          color: #D1D6DF;
        }

        .number1 {
          font-size: 34px;
          height: 30px;
          line-height: 34px;
          color: #FFE04D;
          margin-left: 5px;
          background: linear-gradient(0deg, RGBA(255, 234, 102, 1) 0%, rgba(255, 224, 77, 1) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .number2 {
          font-size: 26px;
          height: 18px;
          line-height: 14px;
          color: #89C96A;
          margin-left: 5px;

        }
      }

    }
  }
}

.item-table {
  justify-content: flex-start;
  width: 90%;
  margin-left: 28px;

  .table-header {
    table-layout: fixed;
  }

  .item-table-content {
    width: 100%;
    margin: 0 auto;
    border-collapse: collapse;
    text-align: center;
    color: #d5e2f1;
    table-layout: fixed;

    th, td {
      height: 34px;
      border-bottom: 1px solid rgba(216, 227, 238, 0.1);
    }


  }

  .table-body {
    &.nd {
      tr:nth-child(even) {
        background: RGBA(17, 39, 57, 1);
      }
    }

    tr {
      background: rgba(27, 130, 183, 0.12);

      &:hover {
        background: rgba(27, 130, 183, 0.22);
      }

      td {
        text-align: center;
      }

      .io {
        width: 54px;
        height: 22px;
        line-height: 26px;
        background: url('../../images/manage/t4.png');
        color: #fff;
        padding-left: 0px;
        font-size: 12px;
        margin-left: 43px;

        &.b0 {
          background: url('../../images/manage/t1.png');
        }

        &.b1 {
          background: url('../../images/manage/t2.png');
        }

        &.b2 {
          background: url('../../images/manage/t3.png');
        }
      }
    }
  }
}

.custom-dark-table {
  background-color: #142234;
  color: #d5e2f1;
}

.smart-energy-center {
  flex: 2;
  /* 占2份 */
  /* background-color: red; */
  justify-content: center;
  align-items: center;
  position: relative;
}

.search-box {
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  margin-top: 26px;

  .area-btn {
    width: 114px;
    height: 45px;
    background: url('../../images/manage/btn_bg.png');
    text-align: center;
    line-height: 45px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    margin-left: 32px;
  }

  .search-input-box {
    width: 190px;
    height: 41px;
    box-sizing: border-box;
    border: 1px solid #5BC7FC;
    margin-left: 19px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .input {
      height: 41px;
      width: 143px;
      padding: 5px 10px;
      box-sizing: border-box;
      font-size: 14px;
      color: #fff;
      background: transparent;
      border: 0;

      &::placeholder {
        color: #FFF;
      }
    }

    .box-btn {
      width: 40px;
      height: 41px;
      background: url('../../images/manage/search.png') 4px center no-repeat;
      background-size: 18px 18px;
      cursor: pointer;
    }
  }
}

.center-bottom {
  flex: 1;
  /* 剩余空间全给它 */
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  width: 100%;
  height: 600px;

}

.tps-box {
  position: absolute;
  right: 11px;
  bottom: 20px;
  width: 120px;

  .item {
    height: 44px;
    display: flex;
    align-items: center;
    font-size: 14px;

    .icon {
      object-fit: cover;
      width: 43px;
      height: 44px;
      margin-right: 6px;
    }
  }
}

.smart-energy-center-header {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 10px 20px;
  justify-content: space-around;
}

.smart-energy-center-header > div {
  /* background: #1d7bbf; */
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  text-align: center;
}

.center-header-item {
  display: flex;
  align-items: center;

  .icon {
    object-fit: cover;
    width: 86px;
    height: 71px
  }
}

.center-header-item-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  /* 上下贴靠 */
  margin-top: 8px;
  margin-left: 12px;
}

.center-header-item-bottom-time {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
  /* 控制和下方文字的间距 */
}

.center-header-item-bottom-time-num {
  font-size: 30px;
  color: #e2eaf4;
  font-weight: bold;
}

.center-header-item-bottom-time-unit {
  font-size: 12px;
  color: #fff;
  font-weight: normal;
}

.center-header-item-bottom-label {
  font-size: 16px;
  color: #fff;
  font-weight: normal;
}

.area-alert-box {
  width: 671px;
  height: 371px;
  background: url('../../images/manage/alert_bg.png');
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -335px;
  margin-top: -185px;
  z-index: 888;
  display: flex;
  justify-content: center;
  align-items: center;

  .alert-box {
    width: 614px;
    height: 313px;

    .title {
      width: 100%;
      height: 42px;
      border-bottom: 2px solid #55b3cd;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(to right, rgba(8, 131, 177, 1), rgba(8, 131, 177, 0));

      font-family: Source Han Sans CN;
      font-size: 18px;
      color: #ECF4FF;
      padding: 0 10px 0 25px;
      margin-bottom: 25px;

      .close {
        width: 42px;
        height: 42px;
        background: url('../../images/manage/cha.png') center no-repeat;
        cursor: pointer;
      }
    }

    .alert-item {
      display: flex;

      .item-tit {
        width: 120px;
        height: 32px;
        line-height: 32px;
        text-align: right;
        color: #fff;
        font-size: 14px
      }

      .item-checkbox {
        width: 490px;

        .image-checkbox {
          .diy-box {
            display: flex;
            align-items: center;
            color: rgba(206, 220, 230, 1);
          }
        }

        /deep/ .image-checkbox .el-checkbox__input {
          display: none;
        }

        .el-checkbox {
          .off {
            display: block;
          }

          .on {
            display: none;
          }

          &.is-checked {
            .off {
              display: none;
            }

            .on {
              display: block;
            }
          }
        }


      }
    }

    .alert-footer {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;

      .footer-btn {
        width: 103px;
        height: 47px;
        margin-left: 30px;
        background: url('../../images/manage/btn_bg1.png');
        text-align: center;
        line-height: 47px;
        cursor: pointer;

        .txt {
          font-size: 14px;
          color: rgba(248, 252, 255, 0);
          text-shadow: 0px 3px 0px rgba(0, 103, 156, 0.33), 0px 3px 5px rgba(6, 13, 16, 0.7);
          background: linear-gradient(0deg, #7CD0FF 0%, #FEFFFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }


  }
}

input {
  outline: none;
}

</style>
