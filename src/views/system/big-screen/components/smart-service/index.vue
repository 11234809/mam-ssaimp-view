<!--
 * @Descripttion: 
 * @version: 
 * @Author: lkr
 * @Date: 2025-05-28 15:55:53
 * @LastEditors: lkr
 * @LastEditTime: 2025-06-06 10:34:46
-->
<template>
  <keep-alive>
    <div class="smart-service">
      <div class="smart-service-left">
        <!-- 充电信息 -->
        <div class="smart-service-left-item">
          <div class="item-top">客流量排名</div>
          <div class="time-selector">
            <TimeTypeSelector v-model="timeSelector.perRankTimeType" @select="(payload) => handleSelect(payload, 'perRank')" />
          </div>
          <div class="item-bottom">
            <div ref="footfallRankingRef" style="width: 90%; height: 30vh;overflow-y: hidden;"></div>
          </div>
        </div>
        <!-- 服务区充电排名 -->
        <div class="smart-service-left-item">
          <div class="item-top">客流量年龄分析</div>
          <div class="time-selector">
            <TimeTypeSelector v-model="timeSelector.perAgeTimeType" @select="(payload) => handleSelect(payload, 'age')" />
          </div>
          <div class="item-bottom">
            <div ref="PassengerFlow_age_echarts" style="width: 100%; height: 30vh"></div>
          </div>
        </div>
        <div class="smart-service-left-item">
          <div class="item-top">满意度评价</div>
          <div class="time-selector">
            <SatisfyTab v-model="timeSelector.satisfyTimeType" @select="(payload) => handleSelect(payload, 'satisfy')" />
          </div>
          <div class="item-bottom">
            <div ref="satisfy_echartsRef" style="width: 100%; height: 30vh"></div>
          </div>
        </div>
      </div>
      <div class="smart-service-center">
        <div class="smart-service-center-header">
          <div v-for="(item, index) in screenDataList" :key="index">
            <ScreenIconInfo :number="item.value" :title="item.title">
              <template #icon><img :src="item.icon" width="100px" /></template>
            </ScreenIconInfo>
 
          </div>
        </div>
        <div style="padding: 10px;">
          <div class="search-box">
            <div class="area-btn" @click="openSearchALert">
						服务区筛选
					</div>
					
					<div class="search-input-box">
						<input type="text" class="input" placeholder="服务区搜索" />
						<div class="box-btn"></div>
					</div>
				</div>
          <!-- <el-button style="width: 100px;background: transparent;border-radius: 2px;border: 1px #5BC7FC dashed;">服务区筛选</el-button>
          <el-input v-model="input1" style="width: 278px;border-radius: 2px; margin-left: 10px ;border: 1px #5BC7FC dashed;"
            placeholder="服务区搜索" suffix-icon="Search" /> -->
        </div>
        <div style="height: 75vh;">
          <CQMap @markerClick="markerClick" />
        </div>
      </div>
      <div class="smart-service-right">
        <div class="smart-service-right-item">
          <div class="item-top">车流量排名</div>
          <div class="time-selector">
            <TimeTypeSelector v-model="timeSelector.carRankTimeType" @select="(payload) => handleSelect(payload, 'sacarRanktisfy')" />
          </div>
          <div class="item-bottom">
            <div ref="carfallRankingRef" style="width: 90%; height: 30vh;"></div>
          </div>
        </div>
        <div class="smart-service-right-item">
          <div class="item-top">近七日车流量趋势</div>
          <div class="time-selector" style="margin: auto;">
            <el-date-picker v-model="timeSelector.car7dayTimeRange" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间"
              :default-time="defaultTime1" popper-class="custom-date-range" :picker-options="pickerOptions"
              :style="{ background: 'transparent', border: '1px solid #fff'}" @change="handleSelect(_, '7day')"/>
          </div>
          <div ref="carfallTrendRef" style="width: 100%; height: 30vh"></div>
        </div>
        <div class="smart-service-right-item">
          <div class="item-top">新能源车排名</div>
          <div class="time-selector">
            <TimeTypeSelector v-model="timeSelector.newEnergyTrafficTimeType"  @select="(payload) => handleSelect(payload, 'newEnergyPer')"/>
          </div>
          <div ref="enerenergyRef" style="width: 100%; height: 30vh"></div>
        </div>
      </div>
      <searchAlert ref='searchRef' :from-data="searchAreaArr" @ok="chooseSearch"></searchAlert>
    </div>
  </keep-alive>
</template>
<script setup>
import {
  ref,
  reactive,
  onActivated,
  defineExpose,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  nextTick,
  computed,
} from "vue";
import ChongQingMap from "../map/index.vue";
import TimeTypeSelector from "../time-type-selector/index.vue";
import SatisfyTab from "./satisfy-tab/index.vue";
import * as echarts from "echarts";
import ScreenIconInfo from "../screen-icon-info/index.vue";
import CQMap from '@/components/map/index.vue'
import moment from "moment";
import { bigScreen } from "@/store/bigScreen";
import {
  getQueryPage,
} from "@/api/guestFlow/index.js";
import { getRowBarOption, getPie3D, getLineChartOption, getRadar,get3DBarOption } from '../../service'
import {
  getTotalPeopleInfoBySa,getTotalPeopleInfoByAge,getTotalCardInfoBySa,getTotalCardInfoByTime,getTotalIndex,getScreenInquireStat,getTotalNewEnergy
} from "@/api/bigScreen/index.js";
import searchAlert from '../service-search-alert/index';

const { proxy } = getCurrentInstance();
const store = bigScreen();
const value1 = ref([]);
const pickerOptions = {
  onPick(date) {
    const now = new Date();
    const selectedDate = date.maxDate ? date.maxDate : date.minDate;

    // 如果是开始时间，则限制结束时间不能超过开始时间 + 7 天
    if (!date.maxDate) {
      this.startDate = selectedDate;
    }

    // 如果选择了开始时间和结束时间
    if (date.minDate && date.maxDate) {
      this.startDate = null;
    }
  },
  disabledDate(time) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 6 * 24 * 3600 * 1000); // 最早可选日期为今天前6天（含今天）

    // 只允许选择过去7天
    return time.getTime() < sevenDaysAgo.getTime() || time.getTime() > now.getTime();
  }
};
function markerClick(item){
  console.log(item,'markerClick')
}
const timeSelector = reactive({
  perRankTimeType: '1',
  perAgeTimeType: '1',
  carRankTimeType: '0',
  car7dayTimeRange: [
    new Date(new Date().getTime() - 6 * 24 * 3600 * 1000), // 开始时间为当前时间减去6天（因为包括今天）
    new Date() // 结束时间为当前时间
  ],
  satisfyTimeType: '0',
  newEnergyTrafficTimeType: '1'
})
const validateDateRange = () => {
  if (!value1.value || value1.value.length !== 2) return;

  const [startDate, endDate] = value1.value;
  const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  if (diffDays > 7) {
    alert('请选择不超过7天的时间范围');
    value1.value = [];
  }
};
const defaultTime1 = ref([
  new Date(new Date().getTime() - 6 * 24 * 3600 * 1000), // 开始时间为当前时间减去6天（因为包括今天）
  new Date() // 结束时间为当前时间
]);
const handleSelect =async (payload,type) => {
  console.log(type)
  switch (type) {
    case 'perRank':
      await getPersonalData(payload)
      getfootfallEcharts()
      break;
    case 'age':
      await getPersonalAgeByTime(payload)
      get3DpieChart()
      break;
    case 'satisfy':
      await getSatisfyData()
      getSatisfyEcharts()
      break;
    case 'carRank':
      await getCarRankData(payload)
      getcarfallEcharts()
      break;
    case '7day':
      await getCar7dayData()
      getLineChart()
      break;
    case 'newEnergyPer':
      await getTotalNewEnergyData(payload)
      getEnerenergyEcharts()
      break;
  }
};
// 地图数据
const mapData = ref([]);
const input1 = ref("");
const screenDataList = ref([{
  title: "车流量",
  value: '0',
  icon: require('../../images/smartService/car.png')
},
//  {
//   title: "饱和度",
//   value: '0%',
//   icon: require('../../images/smartService/pie.png')
// }, 
{
  title: "新能源车占比",
  value: '0%',
  icon: require('../../images/smartService/light.png')
}, {
  title: "客流量",
  value: '0',
  icon: require('../../images/smartService/people.png')
},]);


let carScrollTimer = ref(null);
let footScrollTimer = ref(null);

// 生成ECharts
let footFallChart = null;
let carFallChart = null;
let pie3DChart = null;
let carfallTrendCahrt = null;
let enerenergyChart = null
let satisfy_echarts = null
let PassengerFlow_age_echarts = ref('')
let footfallRankingRef = ref('');
let carfallRankingRef = ref('');
let carfallTrendRef = ref('');
let satisfy_echartsRef = ref('');
let enerenergyRef = ref('')

const PersonalData = ref([])
const PersonalAgeData = ref([])
const carRankData = ref([])
const car7dayData = ref([])
const satisfyData = ref([])
const TotalNewEnergyData = ref([])
//获取客流量排名数据
const getPersonalData = async (payload = {}) => {
  let params = {
    selectTimeType: timeSelector.perRankTimeType,
    timeList:payload.code=='6'&&payload.dateRange.length==2? payload.dateRange:null
  };

  let res = await getTotalPeopleInfoBySa(params);
  if (res.code == 200) {
    PersonalData.value = res.data.records
  }
};
//获取客流量年龄分析数据
const getPersonalAgeByTime = async (payload = {}) => { 
  let params = {
    selectTimeType: timeSelector.perAgeTimeType,
    timeList:payload.code=='6'&&payload.dateRange.length==2? payload.dateRange:null
  };
  let res = await getTotalPeopleInfoByAge(params);
  if (res.code == 200) {
    PersonalAgeData.value = res.data.records
  }
};
//获取车流量排名
const getCarRankData = async (payload = {}) => {
  let params = {
    selectTimeType: timeSelector.carRankTimeType,
    timeList:payload.code=='6'&&payload.dateRange.length==2? payload.dateRange:null
  };

  let res = await getTotalCardInfoBySa(params);
  if (res.code == 200) {
    carRankData.value = res.data.records
  }
};
let Day7time = computed(()=>{
  return (timeSelector.car7dayTimeRange).map(x=>moment(x).format('YYYY-MM-DD'))
})
//获取车流量7天
const getCar7dayData = async () => {
  let params = {
    selectTimeType: '6',
    queryStart: moment(timeSelector.car7dayTimeRange[0]).format('YYYY-MM-DD'),
    queryEnd: moment(timeSelector.car7dayTimeRange[1]).format('YYYY-MM-DD'),
    timeList:Day7time.value
  };
  let res = await getTotalCardInfoByTime(params);
  if (res.code == 200) {
    car7dayData.value = res.data.records
  }
};
// 获取中间顶部信息数据
const getTotalInfo = async () => {
  let params = {
    selectTimeType: '0',
  };
  let res = await getTotalIndex(params);
  if (res.code == 200) {
    screenDataList.value.find(x=>x.title == '车流量').value = res.data.records[0].carTraffic || 0
    screenDataList.value.find(x=>x.title == '新能源车占比').value = res.data.records[0].newEnergyPer || 0
    screenDataList.value.find(x=>x.title == '客流量').value = res.data.records[0].totalFlow || 0
  }
};
//获取满意度评价数据
const getSatisfyData = async () => {
  let res = await getScreenInquireStat();
  if (res.code == 200) {
    satisfyData.value = res.data
  }
};
//获取新能源车排名数据
const getTotalNewEnergyData = async (payload) => {
  let params = {
    selectTimeType: timeSelector.newEnergyTrafficTimeType,
    timeList:payload && payload.code=='6'&&payload.dateRange.length==2? payload.dateRange:null
  };
  let res = await getTotalNewEnergy(params);
  if (res.code == 200) {
    TotalNewEnergyData.value = res.data.records
  }
};
const getfootfallEcharts = async () => {
  let chartData = reactive({});
  console.log(PersonalData.value)
  nextTick(() => {
    if(PersonalData.value.length>0){
    chartData.data = PersonalData.value.map(item => item.totalFlow);
    chartData.yData = PersonalData.value.map(item => item.serviceName);
    footFallChart = echarts.init(footfallRankingRef.value);

    const barColor = [
      { offset: 0, color: "#0d488d" },
      { offset: 0.5, color: "#38a7c7" },
      { offset: 1, color: "#5DF7F8" },
    ];

    const option = getRowBarOption(chartData, { barColor });

    // footFallChart.setOption(option);
    // 启动自动滚动
    startScroll(chartData, barColor, footFallChart, 'foot');

    // 绑定鼠标事件
    const chartDom = footfallRankingRef.value;
    // 监听点击事件
    footFallChart.on('click', (params) => {
      const data = { name:params.name,time:timeSelector.perRankTimeType };
      store.setData(data);
      proxy.$Bus.emit("jumpAgency", {
        url: "/bas/guestFlow",
      });
    });
    chartDom.addEventListener('mouseenter', () => stopScroll('foot'));
    chartDom.addEventListener('mouseleave', () => startScroll(chartData, barColor, footFallChart, 'foot'));
    // chartDom.addEventListener('wheel', (e) => {
    //   if (wheelTimeout) clearTimeout(wheelTimeout);
    //   wheelTimeout = setTimeout(() => {
    //     if(footFallChart){
    //       handleWheel(e, chartData, barColor, footFallChart, 'foot')
    //     }
    //   }, 150);
    // });
  }
  });
};

const getcarfallEcharts = () => {
  nextTick(() => {

    carFallChart = echarts.init(carfallRankingRef.value);

    const chartData = {
      data: carRankData.value.map(x => x.carTraffic) || [],
      yData: carRankData.value.map(x => x.serviceName) || [],
    };

    const barColor = [
      { offset: 0, color: "#652B06" },
      { offset: 1, color: "#EB8C04" },
    ];

    const option = getRowBarOption(chartData, { barColor });
    // carFallChart.setOption(option);
    carFallChart.on('click', (params) => {
      const data = { name:params.name,time:timeSelector.carRankTimeType };
      store.setData(data);
      proxy.$Bus.emit("jumpAgency", {
        url: "/statisticalForm/dailyRecord",
      });
    });
    // 启动自动滚动
    startScroll(chartData, barColor, carFallChart, 'car');

    // 绑定鼠标事件
    const chartDom = carfallRankingRef.value;
    let wheelTimeout;
    chartDom.addEventListener('mouseenter', () => stopScroll('car'));
    chartDom.addEventListener('mouseleave', () => startScroll(chartData, barColor, carFallChart, 'car'));
    // chartDom.addEventListener('wheel', (e) => {
    //   if (wheelTimeout) clearTimeout(wheelTimeout);
    //   wheelTimeout = setTimeout(() => {
    //     if(carFallChart){
    //       handleWheel(e, chartData, barColor, carFallChart, 'car')
    //     }
    //   }, 150);
    // });

  });
};
// 生成扇形的曲面参数方程
function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
  // 计算
  const midRatio = (startRatio + endRatio) / 2;

  const startRadian = startRatio * Math.PI * 2;
  const endRadian = endRatio * Math.PI * 2;
  const midRadian = midRatio * Math.PI * 2;

  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    // eslint-disable-next-line no-param-reassign
    isSelected = false;
  }

  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  // eslint-disable-next-line no-param-reassign
  k = typeof k !== 'undefined' ? k : 1 / 3;

  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
  const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  const hoverRate = isHovered ? 1.05 : 1;

  // 返回曲面参数方程
  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32,
    },

    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20,
    },

    x(u, v) {
      if (u < startRadian) {
        return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      if (u > endRadian) {
        return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
    },

    y(u, v) {
      if (u < startRadian) {
        return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      if (u > endRadian) {
        return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
    },

    z(u, v) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u);
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u) * h * 0.1;
      }
      // 当前图形的高度是Z根据h（每个value的值决定的）
      return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
    },
  };
}
const get3DpieChart = () => {
  let obj = [
    { key: 'ageChild', color: '#f77b66', name: '小孩' },
    { key: 'ageYoung', color: '#3edce0', name: '青年' },
    { key: 'ageMiddle', color: '#f94e76', name: '中年' },
    { key: 'ageOld', color: '#018ef1', name: '老年' },
    { key: 'ageOther', color: '#9e60f9', name: '其他' }
  ];
  let data = obj.map(item => {
    const name = item.name;
    const key = item.key;
    const total = PersonalAgeData.value.length > 0 && PersonalAgeData.value[0] && PersonalAgeData.value[0][key] ? PersonalAgeData.value[0][key]:0;
    return {
      name: name,
      value: total,
      itemStyle: { color: item.color }
    };
  });
  nextTick(() => {
    pie3DChart = echarts.init(PassengerFlow_age_echarts.value);
    let option = getPie3D(data, 0.59)
    let hoveredIndex = ""
    //  修正取消高亮失败的 bug
    // 监听 mouseover，近似实现高亮（放大）效果
    pie3DChart.on('mouseover', function (params) {
      // 准备重新渲染扇形所需的参数
      let isSelected;
      let isHovered;
      let startRatio;
      let endRatio;
      let k;
      let i;

      // 如果触发 mouseover 的扇形当前已高亮，则不做操作
      if (hoveredIndex === params.seriesIndex) {
        return;

        // 否则进行高亮及必要的取消高亮操作
      } else {
        // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
        if (hoveredIndex !== '') {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
          isSelected = false;
          isHovered = false;
          startRatio = option.series[hoveredIndex].pieData.startRatio;
          endRatio = option.series[hoveredIndex].pieData.endRatio;
          k = option.series[hoveredIndex].pieStatus.k;
          i = option.series[hoveredIndex].pieData.value === option.series[0].pieData.value ? 35 : 10;
          // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
          option.series[hoveredIndex].parametricEquation = getParametricEquation(
            startRatio,
            endRatio,
            isSelected,
            isHovered,
            k,
            i
          );
          option.series[hoveredIndex].pieStatus.hovered = isHovered;

          // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
          hoveredIndex = '';
        }

        // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
        if (params.seriesName !== 'mouseoutSeries') {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
          isSelected = false;
          isHovered = true;
          startRatio = option.series[params.seriesIndex].pieData.startRatio;
          endRatio = option.series[params.seriesIndex].pieData.endRatio;
          k = option.series[params.seriesIndex].pieStatus.k;

          // 对当前点击的扇形，执行高亮操作（对 option 更新）
          option.series[params.seriesIndex].parametricEquation = getParametricEquation(
            startRatio,
            endRatio,
            isSelected,
            isHovered,
            k,
            option.series[params.seriesIndex].pieData.value + 5
          );
          option.series[params.seriesIndex].pieStatus.hovered = isHovered;

          // 记录上次高亮的扇形对应的系列号 seriesIndex
          hoveredIndex = params.seriesIndex;
        }

        // 使用更新后的 option，渲染图表
        pie3DChart.setOption(option);
      }
    });
    // 修正取消高亮失败的 bug
    pie3DChart.on('globalout', function () {
      if (hoveredIndex !== '') {
        // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
        let isSelected = true;
        let isHovered = false;
        let k = option.series[hoveredIndex].pieStatus.k;
        let startRatio = option.series[hoveredIndex].pieData.startRatio;
        let endRatio = option.series[hoveredIndex].pieData.endRatio;
        // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
        let i = option.series[hoveredIndex].pieData.value === option.series[0].pieData.value ? 35 : 10;
        option.series[hoveredIndex].parametricEquation = getParametricEquation(
          startRatio,
          endRatio,
          isSelected,
          isHovered,
          k,
          i
        );
        option.series[hoveredIndex].pieStatus.hovered = isHovered;

        // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
        hoveredIndex = '';
      }
      // 使用更新后的 option，渲染图表
    });
    if (option && typeof option === 'object') {
      pie3DChart.setOption(option);
      pie3DChart.on('click', (params) => {
        const data = { name: params.name, time: timeSelector.perAgeTimeType };
        store.setData(data);
        proxy.$Bus.emit("jumpAgency", {
          url: "/bas/guestFlow",
        });
      });
    }
    window.addEventListener('resize', pie3DChart.resize);
  })
};
const getLineChart = () => {
  nextTick(() => {
    carfallTrendCahrt = echarts.init(carfallTrendRef.value);
    const startDate = moment(Day7time.value[0]);
    const endDate = moment(Day7time.value[1]);

    const dateArray = [];

    let currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate, 'day')) {
      dateArray.push(currentDate.format('YYYY-MM-DD'));
      currentDate.add(1, 'day');
    }
    const dateMap = new Map(car7dayData.value.map(item => [item.day, item]));
    const fields = ['newEnergyTraffic', 'freightTraffic', 'passengerTraffic', 'carTraffic', 'dangerFreightTraffic'];

    let data = {
      seriesData: fields.reduce((acc, field) => {
        acc[field] = dateArray.map(date => {
          return dateMap.get(date)?.[field] || 0;
        });
        return acc;
      }, {}),
      xAxis: dateArray,
    }
    console.log(data)
    let LineChartOption = getLineChartOption(data, {})
    if (LineChartOption && typeof LineChartOption === 'object') {
        carfallTrendCahrt.setOption(LineChartOption);
        carfallTrendCahrt.on('click', (params) => {
          const data = { name: params.name, time: timeSelector.car7dayTimeRange };
          store.setData(data);
          proxy.$Bus.emit("jumpAgency", {
            url: "/statisticalForm/dailyRecord",
          });
        });
      }
      window.addEventListener('resize', carfallTrendCahrt.resize);

  })
};
const getSatisfyEcharts = () => {
  nextTick(() =>{
      satisfy_echarts = echarts.init(satisfy_echartsRef.value);
      let arr = ['generalStat','cqxmStat','foodStat']
    let obj = {
      generalStat: {
        basicRatio: '基础设施',
        environRatio: '环境卫生',
        serviceRatio: '文明服务',
        safetyRatio: '道路安全',
        parkingServiceRatio: '停车服务',
        foodBeveragesRatio: '餐饮服务',
        civilizedServiceRatio: '文明服务',
        toiletServiceRatio: '如厕服务',
        impressionRatio: '总体印象'
      },
      foodStat: {
        qualityRatio: '饭口质量',
        tasteRatio: '饭菜口味',
        tablewareRatio: '饭菜餐具',
        typeRatio: '饭菜种类',
        quantityRatio: '饭菜份量',
        speedRatio: '上菜速度',
        environmentRatio: '就餐区环境',
        hygieneRatio: '就餐区卫生情况',
        attitudeRatio: '服务态度',
        personalHygieneRatio: '个人卫生'
      },
      cqxmStat: {
        odorRatio: '小面色泽',
        aromaRatio: '小面香味',
        xmTasteRatio: '小面味道',
        finesseRatio: '小面劲道',
        xmAttitudeRatio: '小面服务',
        overallEvuationRatio: '小面总体',
      }
    }
    let keys = Object.keys(obj[arr[timeSelector.satisfyTimeType]])
    let data = keys.map(x => {
      return {
        name: obj[arr[timeSelector.satisfyTimeType]][x],
        value: satisfyData.value[(arr[timeSelector.satisfyTimeType])][x]
      }
    })
    let option = getRadar(data, {});
    if (option && typeof option === 'object') {
      satisfy_echarts.setOption(option);
      satisfy_echarts.on('click', (params) => {
          const data = { name: params.name, time: timeSelector.satisfyTimeType };
          store.setData(data);
          proxy.$Bus.emit("jumpAgency", {
            url: "/statisticalForm/dailyRecord",
          });
        });
      }
      window.addEventListener('resize', satisfy_echarts.resize);
  })
};
const getEnerenergyEcharts = () => {
  nextTick(() =>{
      enerenergyChart = echarts.init(enerenergyRef.value);
      let data = TotalNewEnergyData.value
       console.log(data)
      let option = get3DBarOption(data, { 
      });
      if (option && typeof option === 'object') {
        enerenergyChart.setOption(option);
        enerenergyChart.on('click', (params) => {
          const data = { name: params.name, time: timeSelector.newEnergyTrafficTimeType };
          store.setData(data);
          proxy.$Bus.emit("jumpAgency", {
            url: "/statisticalForm/dailyRecord",
          });
        });
      }
      window.addEventListener('resize', enerenergyChart.resize);
  })
};
// 切换日期时间
const handleSelectComeOn = (payload) => {
  // comeOnStatement.selectTimeType = payload.code;
  // if (payload.code === "6") {
  //   comeOnStatement.dateRange = payload.dateRange || [];
  // }
  // getfootfallEcharts();
};
// 手动翻页函数
const handleWheel = (event, data, barColor, chartInstance, key) => {
  stopScroll(key); // 停止自动滚动

  const total = data.data.length;
  const displayCount = 4;
  let index = scrollIndices[key];

  if (event.deltaY < 0) {
    // 向上滚动
    index = Math.max(0, index - 1);
  } else {
    // 向下滚动
    index = Math.min(total - displayCount, index + 1);
  }

  scrollIndices[key] = index;

  const visibleData = data.data.slice(index, index + displayCount);
  const visibleNames = data.yData.slice(index, index + displayCount);

  const options = getRowBarOption(
    { data: visibleData, yData: visibleNames },
    { barColor }
  );

  chartInstance.setOption(options);
};
const stopScroll = (key) => {
  if (key === 'car' && carScrollTimer.value) {
    clearInterval(carScrollTimer.value);
    carScrollTimer.value = null;
  }
  if (key === 'foot' && footScrollTimer.value) {
    clearInterval(footScrollTimer.value);
    footScrollTimer.value = null;
  }
};
const jumpToPerFlowRank = (e) => {
  console.log(e)
};
onMounted(async () => {
  await getPersonalData()
  await getPersonalAgeByTime()
  await getCarRankData()
  await getCar7dayData()
  await getTotalInfo()
  await getSatisfyData()
  await getTotalNewEnergyData()
  getfootfallEcharts()
  get3DpieChart()
  getcarfallEcharts()
  getLineChart()
  getSatisfyEcharts()
  getEnerenergyEcharts()
})
// 独立的 currentIndex
const scrollIndices = {
  car: 0,
  foot: 0
};

const startScroll = (data, barColor, chartInstance, key) => {
  stopScroll(key); // 停止当前图表的滚动

  const updateChart = () => {
    const total = data.data.length;
    const displayCount = 4; // 每页显示条目数

    let index = scrollIndices[key];
    let endIndex = index + displayCount;

    if (endIndex > total) {
      index = 0;
      endIndex = index + displayCount;
    }

    const visibleData = data.data.slice(index, endIndex);
    const visibleNames = data.yData.slice(index, endIndex);

    const options = getRowBarOption(
      { data: visibleData, yData: visibleNames },
      { barColor }
    );

    chartInstance.setOption(options);
    scrollIndices[key] = (index + 1) % (total - displayCount + 1);
  };

  // 设置对应图表的定时器
  if (key === 'car') {
    carScrollTimer.value = setInterval(updateChart, 1500);
  } else if (key === 'foot') {
    footScrollTimer.value = setInterval(updateChart, 1500);
  }
};


	//服务区筛选数据
	let searchRef = ref('');
	const openSearchALert=()=>{
		searchRef.value.open();
	}
	const searchAreaArr=ref([]);
	
	let areaArr=[];
	
	areaArr.push({
		title:'星级',
		field:'star',
		children:[
			{
				id:1,
				title:'5级'
			},
			{
				id:2,
				title:'4级'
			},
			{
				id:3,
				title:'3级'
			},
			{
				id:4,
				title:'达标'
			}
		]
	})
	
	areaArr.push({
		title:'路线',
		field:'route',
		children:[
			{
				id:1,
				title:'G75兰海高速'
			},
			{
				id:2,
				title:'G75兰海高速级'
			},
			{
				id:3,
				title:'G75兰海高速级'
			},
			{
				id:4,
				title:'G75兰海高速'
			}
		]
	})
	
	areaArr.push({
		title:'服务区状态',
		field:'status',
		children:[
			{
				id:1,
				title:'在建'
			},
			{
				id:2,
				title:'建成运营'
			},
			{
				id:3,
				title:'建成未运营'
			},
			{
				id:4,
				title:'关闭'
			}
		]
	})
	
	areaArr.push({
		title:'其他',
		field:'other',
		children:[
			{
				id:1,
				title:'司机之家'
			},
			{
				id:2,
				title:'特色服务区'
			},
			{
				id:3,
				title:'同心驿站'
			}
		]
	})
	searchAreaArr.value=areaArr;
	
	//搜索回调
	const chooseSearch=(res)=>{
		console.log(res)
	}


// 暴露给父组件
</script>
<style scoped lang="less">
.smart-service {
  display: flex;
  height: calc(100% - 108px);
  width: 100%;
  color: #fff;
  margin-top: -100px;
  padding: 0px 2px;
}

.smart-service-left,
.smart-service-right {
  flex: 1;
  height: 100%;
  background-color: #16283a;
  /* 各占1份 */
  /* background-color: pink; */
  /* 方便区分颜色 */
}

.smart-service-left-item,
.smart-service-right-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 33.3vh;
  background: url("../../images/smartEnergy/组12398.png") no-repeat;
  background-position: center 0;
  position: relative;
}

.item-top {
  height: auto;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  height: 69px !important;
  margin-top: 8px;
  margin-left: 6.75rem;
  > .time-selector{
    margin-top: 20px !important;
  }
}

.item-bottom {
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  color: #fff;
  gap: 2px;
  /* 可以加点间距，看效果 */
}

.item-bottom-one {
  flex: 1;
  background: url("../../images/smartEnergy/item603(1).png") no-repeat center center;
  position: relative;
  /* background-size: contain; */
}

.item-bottom-one-left {
  position: absolute;
  left: 185px;
  top: 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-bottom-one-left-top {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #fff;
}

.item-bottom-one-left-bottom {
  font-weight: 500;
  color: #40abd8;
}

.item-bottom-one-center {
  position: absolute;
  left: 288px;
  top: 36px;
  width: 2px;
  height: 45px;
  background-color: #91d0d6;
}

.item-bottom-one-right {
  position: absolute;
  right: 97px;
  top: 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-bottom-one-right-top {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #fff;
}

.item-bottom-one-right-bottom {
  font-weight: 500;
  color: #40abd8;
}

.item-bottom-two {
  flex: 1;
  background: url("../../images/smartEnergy/item603.png") no-repeat center center;
}

.item-bottom-two-left {
  position: absolute;
  left: 185px;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-bottom-two-left-top {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #fff;
}

.item-bottom-two-left-bottom {
  font-weight: 500;
  color: #40abd8;
}

.item-bottom-two-center {
  position: absolute;
  left: 288px;
  bottom: 30px;
  width: 2px;
  height: 45px;
  background-color: #91d0d6;
}

.item-bottom-two-right {
  position: absolute;
  right: 97px;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-bottom-two-right-top {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #fff;
}

.item-bottom-two-right-bottom {
  font-weight: 500;
  color: #40abd8;
}

.custom-dark-table {
  background-color: #142234;
  color: #d5e2f1;
}

.smart-service-center {
  flex: 2;
  /* 占2份 */
  /* background-color: red; */
  justify-content: center;
  align-items: center;
  height: 100%;
}

.smart-service-center-header {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 10px 20px;
  justify-content: space-around;
}

.smart-service-center-header>div {
  color: #fff;
}
.search-box{
		width: 100%;
		height: 45px;
		display: flex;
		align-items: center;
		margin-top: 26px;
		
		.area-btn{
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
		
		.search-input-box{
			width:190px;
			height: 41px;
			box-sizing: border-box;
			border: 1px solid #5BC7FC;
			margin-left: 19px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.input{
				height: 41px;
				width: 143px;
				padding: 5px 10px;
				box-sizing: border-box;
				font-size: 14px;
				color: #fff;
				background: transparent;
				border: 0;
				
				&::placeholder{
					color: #FFF;
				}
			}
			
			.box-btn{
				width: 40px;
				height: 41px;
				background: url('../../images/manage/search.png') 4px center no-repeat;
				background-size: 18px 18px;
				cursor: pointer;
			}
		}
	}
</style>
<style lang="less">
.smart-service-right-item {
  ::-webkit-scrollbar {
    display: none; /* 隐藏 Chrome/Safari 滚动条 */
  }

  -ms-overflow-style: none;  /* 隐藏 IE 滚动条 */
  scrollbar-width: none;  /* 隐藏 Firefox 滚动条 */
}
</style>
