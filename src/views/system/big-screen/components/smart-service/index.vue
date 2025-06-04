<!--
<<<<<<< HEAD
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2025-05-28 15:55:53
 * @LastEditors: ysl
 * @LastEditTime: 2025-06-04 16:18:02
=======
 * @Description: 
 * @Version: 
 * @Autor: lkr
 * @Date: 2025-05-30 13:35:25
 * @LastEditors: lkr
 * @LastEditTime: 2025-06-04 18:13:56
>>>>>>> 7c510477f5c5635a6f834942a8e26480affbb68c
-->
<template>
  <keep-alive>
    <div class="smart-service">
      <div class="smart-service-left">
        <!-- 充电信息 -->
        <div class="smart-service-left-item">
          <div class="item-top">客流量排名</div>
          <div class="time-selector">
            <TimeTypeSelector v-model="timeSelector.perRankTimeType" @select="handleSelectInformation" />
          </div>
          <div class="item-bottom">
            <div ref="footfallRankingRef" style="width: 90%; height: 30vh"></div>
          </div>
        </div>
        <!-- 服务区充电排名 -->
        <div class="smart-service-left-item">
          <div class="item-top">客流量年龄分析</div>
          <div class="time-selector">
            <TimeTypeSelector v-model="timeSelector.perAgeTimeType" @select="handleSelectChargingRanking" />
          </div>
          <div class="item-bottom">
            <div ref="PassengerFlow_age_echarts" style="width: 100%; height: 30vh"></div>
          </div>
        </div>
        <div class="smart-service-left-item">
          <div class="item-top">满意度评价</div>
          <div class="time-selector">
            <TimeTypeSelector v-model="timeSelector.satisfyTimeType" @select="handleSelectChargingRanking" />
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
          <el-button style="width: 100px;background: transparent;border-radius: 2px;border: 1px #5BC7FC dashed;">服务区筛选</el-button>
          <el-input v-model="input1" style="width: 278px;border-radius: 2px; margin-left: 10px ;border: 1px #5BC7FC dashed;"
            placeholder="服务区搜索" suffix-icon="Search" />
        </div>
        <div style="height: 75vh;">
          <Map @markerClick="markerClick" />
        </div>
      </div>
      <div class="smart-service-right">
        <div class="smart-service-right-item">
          <div class="item-top">车流量排名</div>
          <div class="time-selector">
            <TimeTypeSelector v-model="timeSelector.carRankTimeType" @select="handleSelectComeOn" />
          </div>
          <div class="item-bottom">
            <div ref="carfallRankingRef" style="width: 90%; height: 30vh"></div>
          </div>
        </div>
        <div class="smart-service-right-item">
          <div class="item-top">近七日车流量趋势</div>
          <div class="time-selector" style="">
            <el-date-picker v-model="timeSelector.car7dayTimeRange" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间"
              :default-time="defaultTime1" popper-class="custom-date-range" :picker-options="pickerOptions"
              :style="{ background: 'transparent', border: '1px solid #fff', color: '#ff0000'}" @change="validateDateRange" />
          </div>
          <div ref="carfallTrendRef" style="width: 100%; height: 30vh"></div>
        </div>
        <div class="smart-service-right-item">
          <div class="item-top">新能源车排名</div>
          <div class="time-selector">
            <TimeTypeSelector v-model="timeSelector.newEnergyTrafficTimeType" @select="handleSelectComeOn" />
          </div>
          <div ref="enerenergyRef" style="width: 100%; height: 30vh"></div>
        </div>
      </div>
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
} from "vue";
import ChongQingMap from "../map/index.vue";
import TimeTypeSelector from "../time-type-selector/index.vue";
import * as echarts from "echarts";
import ScreenIconInfo from "../screen-icon-info/index.vue";
import Map from '@/components/map/index.vue'
import moment from "moment";
import { bigScreen } from "@/store/bigScreen";
import {
  getQueryPage,
} from "@/api/guestFlow/index.js";
import { queryPage } from "@/api/statisticalForm/dailyRecord.js";
import { getRowBarOption, getPie3D, getLineChartOption, handleWheel,getRadar,get3DBarOption } from '../../service'
const { proxy } = getCurrentInstance();
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
  car7dayTimeRange: '',
  satisfyTimeType:'',
  newEnergyTrafficTimeType:''
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
const carFlowData = ref([])
const getPersonalData = async () => {
  let params = {
    selectTimeType: '5',
    time: moment().subtract(0, "day").format("YYYY-MM-DD"),
    order: 'desc'
  };

  let res = await getQueryPage(params);
  if (res.code == 200) {
    screenDataList.value[2].value = (res.data.records)[0].totalPassFlow
    PersonalData.value = res.data.records.filter(x => x.companyName !== '全路网')
  }
};
const getCarFlowData = async () => {
  let params = {
    selectTimeType: '5',
    time: moment().subtract(0, "day").format("YYYY-MM-DD"),
    order: 'desc'
  };

  let res = await queryPage({
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    order: 'desc'
  });
  let chewei = 1000
  if (res.code == 200) {
    screenDataList.value[0].value = (res.data.records)[0].carTraffic
    // screenDataList.value[1].value = (((res.data.records)[0].carTraffic / chewei) * 100).toFixed(2) + '%'
    screenDataList.value[1].value = ((res.data.records)[0].newEnergyTraffic / (res.data.records)[0].carTraffic * 100).toFixed(2) + '%'
    carFlowData.value = res.data.records.filter(x => x.companyName !== '全路网合计')
  }
};
const store = bigScreen();
const getfootfallEcharts = async () => {
  let chartData = reactive({});

  nextTick(() => {
    chartData.data = PersonalData.value.map(item => item.totalPassFlow);
    chartData.yData = PersonalData.value.map(item => item.serviceAreaName);
    if (!footFallChart) {
      footFallChart = echarts.init(footfallRankingRef.value);
    }

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
    chartDom.addEventListener('wheel', (e) => {
      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        handleWheel(e, chartData, barColor, footFallChart, 'foot')
      }, 150);
    }
    );
  });
};

const getcarfallEcharts = () => {
  nextTick(() => {
    if (!carFallChart) {
      carFallChart = echarts.init(carfallRankingRef.value);
    }

    const chartData = {
      data: carFlowData.value.map(x => x.carTraffic) || [],
      yData: carFlowData.value.map(x => x.serviceAreaName) || [],
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
    chartDom.addEventListener('wheel', (e) => {
      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        handleWheel(e, chartData, barColor, footFallChart, 'car')
      }, 150);
    }
    );

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
const get3DpieChart = async () => {
  let obj = [
    { key: 'kidNum', color: '#f77b66', name: '小孩' },
    { key: 'adultNum', color: '#3edce0', name: '青年' },
    { key: 'midNum', color: '#f94e76', name: '中年' },
    { key: 'oldNum', color: '#018ef1', name: '老年' },
    { key: 'otherNum', color: '#9e60f9', name: '其他' }
  ];
  let data = obj.map(item => {
    const name = item.name;
    const key = item.key;
    const total = PersonalData.value.reduce((sum, entry) => sum + (entry[key] || 0), 0);
    return {
      name: name,
      value: total,
      itemStyle: { color: item.color }
    };
  });
  nextTick(() => {
    if (!pie3DChart)
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
          isSelected = option.series[hoveredIndex].pieStatus.selected || false;
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
          isSelected = option.series[params.seriesIndex].pieStatus.selected;
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
        isSelected = option.series[hoveredIndex].pieStatus.selected || false;
        isHovered = false;
        k = option.series[hoveredIndex].pieStatus.k;
        startRatio = option.series[hoveredIndex].pieData.startRatio;
        endRatio = option.series[hoveredIndex].pieData.endRatio;
        // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
        i = option.series[hoveredIndex].pieData.value === option.series[0].pieData.value ? 35 : 10;
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
    if (!carfallTrendCahrt) {
      carfallTrendCahrt = echarts.init(carfallTrendRef.value);
      let data = {
        seriesData: ['newEnergyTraffic', 'freightTraffic', 'guestTraffic', 'carTraffic', 'DangerousTraffic'].reduce((acc, key) => {
          acc[key] = carFlowData.value.map(item => item[key] || 0);
          return acc;
        }, {}),
        xAxis: ['2025-01-02', '2025-01-2', '2025-01-03', '2025-01-04', '2025-01-5', '2025-01-06', '2025-01-07'],
      }
      console.log(carFlowData.value)
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
    }

  })
};
const getSatisfyEcharts = () => {
  nextTick(() =>{
    if(!satisfy_echarts){
      satisfy_echarts = echarts.init(satisfy_echartsRef.value);
      let option = getRadar([], { 
      });
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
    }
  })
};
const getEnerenergyEcharts = () => {
  nextTick(() =>{
    if(!enerenergyChart){
      enerenergyChart = echarts.init(enerenergyRef.value);
      let option = get3DBarOption([], { 
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
    }
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
  await getCarFlowData()
  await getfootfallEcharts()
  await get3DpieChart()
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


onActivated(() => {
});

// 暴露给父组件
</script>
<style scoped>
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
  background: url("../../images/组12398.png") no-repeat;
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
}

.item-bottom {
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
</style>
