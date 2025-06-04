<template>
  <div class="this_page">
    <div ref="searchRef">
      <!-- 表头title -->
      <div class="search_title margin_b_20">
        <i class="search_icon"></i>
        <el-text>充电可视化</el-text>
      </div>
      <!-- 统计维度 -->
      <el-form inline :model="formData" class="custom_form" label-width="120px" style="padding: 0 20px"
        label-position="right" label-suffix=":">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="统计维度" label-width="80px" class="form_item">
              <el-radio-group v-model="formData.selectTimeType" @change="selectTimeTypeChange()">
                <el-radio-button v-for="(item, index) in selectTimeTypeList" :key="index" :label="item.code">
                  {{ item.name }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="!formData.selectTimeType"> </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '0'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker style="width: 100%" v-model="formData.time" type="date" placeholder="请选择日期"
                format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" @change="selectTimeChange" />
            </el-form-item>
          </el-col>
          <el-col :span="7" v-if="formData.selectTimeType == '1'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker style="width: 100%" v-model="formData.time" type="week" placeholder="请选择周"
                :format="weekFormat" valueFormat="YYYY-MM-DD" @change="weekChange(formData.time)" />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '2'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker style="width: 100%" v-model="formData.time" type="month" placeholder="请选择月"
                format="YYYY-MM" valueFormat="YYYY-MM" @change="selectTimeChange" />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '3'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <DateQuarter style="width: 100%" ref="seasonSelect" placeholder="请选择季度" @chooseSeason="seasonChange" />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '4'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker style="width: 100%" v-model="formData.time" type="year" placeholder="请选择年" format="YYYY"
                valueFormat="YYYY" @change="refresh" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="formData.selectTimeType == '5'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker style="width: 100%" v-model="formData.timeList" type="daterange" range-separator="~"
                start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD"
                @change="refresh" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="12" v-loading="loading1">
          <div class="service_ranking">
            <div class="service_ranking_title">
              <div class="search_title">
                <i class="search_icon"></i>
                <el-text>充电总览</el-text>
              </div>
            </div>
            <div class="service_ranking_overview_title">
              <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                <span>全路网</span>
                <input type="checkbox" class="ui-checkbox" v-model="formData.isOverviewWholeRoadNetwork"
                  @change="handleOverviewWholeRoadNetworkChange" />
              </div>
              <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                <span>服务区</span>
                <input type="checkbox" class="ui-checkbox" v-model="formData.isOverviewServiceArea"
                  @change="handleOverviewServiceAreaChange" />
              </div>
              <!-- 整体/单侧显示 -->
              <div v-if="formData.isOverviewServiceArea"
                class="service_ranking_overview_title_right_item margin_overview_right_10">
                <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                  <span class="text-button" :class="{ active: formData.isOverviewWhole }"
                    @click="onWholeChange">整体</span>
                </div>
                <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                  <span class="text-button" :class="{ active: formData.isOverviewUnilateral }"
                    @click="onUnilateralChange">单侧</span>
                </div>
              </div>
              <!-- 整体显示 -->
              <el-form-item v-if="formData.isOverviewWhole" label-width="auto" label="服务区名称"
                class="service_ranking_overview_title_form_item_inline">
                <el-select v-model="formData.serviceOverviewWholeSelects" placeholder="请选择服务区名称"
                  class="service_ranking_overview_title_form_select" @change="handleServiceAreaNameChange">
                  <el-option v-for="(item, index) in listOptions.serviceAreaList" :key="index" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
              <!-- 单侧显示 -->
              <el-form-item v-if="formData.isOverviewUnilateral" label-width="auto" label="服务区名称"
                class="service_ranking_overview_title_form_item_inline">
                <el-select v-model="formData.serviceSelects" placeholder="请选择服务区名称"
                  class="service_ranking_overview_title_form_select" @change="handleInOutServiceAreaNameChange">
                  <el-option v-for="(item, index) in listOptions.serviceArea" :key="index" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </div>
            <div class="service_ranking_overview_echars_flex">
              <!-- 为0时显示 -->
              <div class="top-part" v-if="formData.selectTimeType === '0'">
                <div class="progress-item" v-for="(item, index) in topCharts" :key="'top-' + index">
                  <el-progress type="circle" :percentage="100" :width="110" :stroke-width="8" :color="item.color"
                    :format="() => item.value" />
                  <div class="progress-label">{{ item.name }}</div>
                </div>
              </div>
              <div class="bottom-part" v-if="formData.selectTimeType === '0'">
                <div class="progress-item" v-for="(item, index) in bottomCharts" :key="'bottom-' + index">
                  <el-progress type="circle" :percentage="100" :width="110" :stroke-width="8" :color="item.color"
                    :format="() => item.value" />
                  <div class="progress-label">{{ item.name }}</div>
                </div>
              </div>
              <!-- 不为0时显示 -->
              <div class="top-part" v-if="formData.selectTimeType !== '0'">
                <div class="progress-item" v-for="(item, index) in topCharts" :key="'top-nz-' + index">
                  <el-progress type="circle" :percentage="100" :width="110" :stroke-width="8" :color="item.color"
                    :format="() => item.value" />
                  <div class="progress-label">{{ item.name }}</div>
                </div>
              </div>
              <div class="bottom-part" v-if="formData.selectTimeType !== '0'">
                <div class="progress-item" v-for="(item, index) in bottomCharts" :key="'bottom-nz-' + index">
                  <el-progress type="circle" :percentage="100" :width="110" :stroke-width="8" :color="item.color"
                    :format="() => item.value" />
                  <div class="progress-label">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" v-loading="loading2">
          <div class="service_ranking">
            <div class="service_ranking_title">
              <div class="search_title">
                <i class="search_icon"></i>
                <el-text>充电排名前十</el-text>
              </div>
            </div>
            <div class="service_ranking_overview_title">
              <!-- 以充电次数排名 -->
              <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                <span class="text-button" :class="{ active: fromChargingRankingData.isChargingFrequency }"
                  @click="onFrequencyChange">以充电次数排名</span>
              </div>
              <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                <span class="text-button" :class="{ active: fromChargingRankingData.isChargingQuantity }"
                  @click="onElectricQuantityChange">以充电量排名</span>
              </div>
              <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                <span>整体</span>
                <input type="checkbox" class="ui-checkbox" v-model="fromChargingRankingData.isChargingRankingWhole"
                  @change="onOverallChargingRankingChange" />
              </div>
              <div class="service_ranking_overview_title_right_item">
                <span>单侧</span>
                <input type="checkbox" class="ui-checkbox" v-model="fromChargingRankingData.isChargingRankingUnilateral"
                  @change="onSingleSideChargingankingChange" />
              </div>
            </div>
            <div id="charging_ranking_echarts" style="width: 100%; height: 400px"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" v-loading="loading3">
          <div class="service_ranking">
            <div class="service_ranking_title">
              <div class="search_title">
                <i class="search_icon"></i>
                <el-text>充电服务区利用率排名前十</el-text>
              </div>
            </div>
            <div class="service_ranking_overview_title">
              <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                <span>整体</span>
                <input type="checkbox" class="ui-checkbox" v-model="fromUtilizationRateData.isUtilizationRateWhole"
                  @change="onUtilizationRateChange" />
              </div>
              <div class="service_ranking_overview_title_right_item">
                <span>单侧</span>
                <input type="checkbox" class="ui-checkbox" v-model="fromUtilizationRateData.isUtilizationRateUnilateral"
                  @change="onUtilizationRateUnilateralChange" />
              </div>
            </div>
            <div id="utilization_rate_echarts" style="width: 100%; height: 435px"></div>
          </div>
        </el-col>
        <el-col :span="12" v-loading="loading4">
          <div class="service_ranking">
            <div class="service_ranking_title">
              <div class="search_title">
                <i class="search_icon"></i>
                <el-text>时段利用率趋势</el-text>
              </div>
            </div>
            <div class="service_ranking_overview_title">
              <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                <span>全路网</span>
                <input type="checkbox" class="ui-checkbox" v-model="formPeriodTimeData.isPeriodTimeNetwork"
                  @change="handlePeriodTimeChange" />
              </div>
              <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                <span>服务区</span>
                <input type="checkbox" class="ui-checkbox" v-model="formPeriodTimeData.isPeriodTimeArea"
                  @change="handlePeriodTimeAreaChange" />
              </div>
              <!-- 整体/单侧显示 -->
              <div v-if="formPeriodTimeData.isPeriodTimeArea"
                class="service_ranking_overview_title_right_item margin_overview_right_10">
                <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                  <span class="text-button" :class="{ active: formPeriodTimeData.isPeriodTimeWhole }"
                    @click="onPeriodTimeWholeChange">整体</span>
                </div>
                <div class="service_ranking_overview_title_right_item margin_overview_right_10">
                  <span class="text-button" :class="{ active: formPeriodTimeData.isPeriodTimeUnilateral }"
                    @click="onPeriodTimeUnilateralChange">单侧</span>
                </div>
              </div>
              <!-- 整体显示 -->
              <el-form-item v-if="formPeriodTimeData.isPeriodTimeWhole" label-width="auto" label="服务区名称"
                class="service_ranking_overview_title_form_item_inline">
                <el-select v-model="formPeriodTimeData.servicePeriodTimeWholeSelects" placeholder="请选择服务区名称"
                  class="service_ranking_overview_title_form_select" @change="handlePeriodTimeNameChange">
                  <el-option v-for="(item, index) in listOptions.serviceAreaList" :key="index" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
              <!-- 单侧显示 -->
              <el-form-item v-if="formPeriodTimeData.isPeriodTimeUnilateral" label-width="auto" label="服务区名称"
                class="service_ranking_overview_title_form_item_inline">
                <el-select v-model="formPeriodTimeData.servicePeriodTimeSelects" placeholder="请选择服务区名称"
                  class="service_ranking_overview_title_form_select" @change="handleInOutPeriodTimeNameChange">
                  <el-option v-for="(item, index) in listOptions.serviceArea" :key="index" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </div>
            <div id="period_time_echarts" style="width: 100%; height: 435px"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup>
import * as echarts from 'echarts';
import {
  nextTick,
  onActivated,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  useTemplateRef,
  getCurrentInstance,
  watch,
  computed,
} from "vue";
import { DateQuarter } from "mam-base-ui";
import moment from "moment";
import { getServiceArea } from "@/api/dictionaryApi.js";
// import { getServiceAreaList } from "@/api/peopleFlowApi.js";
import { getChargeReport, getServiceChargeRanking, getServiceChargeUsage, getUseRatioByTimeFrame, getChargeVisualizationServiceArea } from "@/api/chargeVisualization/index.js";
const page = ref(1); // 当前页
const seasonSelect = ref();
const selectTimeTypeList = [
  {
    name: "日",
    code: "0",
  },
  {
    name: "周",
    code: "1",
  },
  {
    name: "月",
    code: "2",
  },
  {
    name: "季",
    code: "3",
  },
  {
    name: "年",
    code: "4",
  },
  {
    name: "其他",
    code: "5",
  },
];
const isInitWeekChange = ref(false);
const { proxy } = getCurrentInstance();
const listOptions = reactive({
  serviceAreaList: [], // 服务区列表
  serviceArea: [], // 进出场服务区
  statusList: [
    { label: "正常", value: "2" },
    { label: "异常", value: "1" },
  ],
  periodList: [],
}); // 服务区列表
async function selectTimeTypeChange() {
  formData.time = "";
  formData.timeList = [];
  if (formData.selectTimeType == "0") {
    formData.time = moment().subtract(1, "day").format("YYYY-MM-DD");
  } else if (formData.selectTimeType == "1") {
    isInitWeekChange.value = true;
    formData.time = moment().format("YYYY-MM-DD");
    // weekChange(formData.time);
    let startDate = moment(formData.time)
      .clone()
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    let weekEnd = moment(formData.time)
      .clone()
      .endOf("isoWeek")
      .format("YYYY-MM-DD");
    weekChange(startDate);
    formData.timeList = [startDate, weekEnd];
  } else if (formData.selectTimeType == "2") {
    formData.time = moment().format("YYYY-MM");
  } else if (formData.selectTimeType == "3") {
    await nextTick(() => {
      let nowYear = moment().year();
      let nowQuarter = moment().quarter();
      seasonSelect.value.getDefaultTimeNow();
      seasonChange(nowYear, nowQuarter, "");
    });
  } else if (formData.selectTimeType == "4") {
    formData.time = moment().format("YYYY");
  } else if (formData.selectTimeType == "5") {
    formData.timeList = [
      moment().subtract(1, "day").format("YYYY-MM-DD"),
      moment().subtract(1, "day").format("YYYY-MM-DD"),
    ];
  }
  page.value = 1;
  refresh();
}

// 选择季度赋值
function seasonChange(year, season, dataValue) {
  let value = [];
  if (season == 1) {
    value = [`${year}-01`, `${year}-03`];
  } else if (season == 2) {
    value = [`${year}-04`, `${year}-06`];
  } else if (season == 3) {
    value = [`${year}-07`, `${year}-09`];
  } else if (season == 4) {
    value = [`${year}-10`, `${year}-12`];
  }
  formData["timeList"] = value;
  refresh();
}
// 获取指定日期的那一周的开始、结束日期
function getWeekStartAndEnd(val) {
  let weekStart = val;
  let weekEnd = moment(val).add(6, "days").format("YYYY-MM-DD");
  return [weekStart, weekEnd];
}
// 选择周
const weekFormat = ref("YYYY [年 第] ww [周]");
function weekChange(data) {
  let curDate = moment(data).clone().endOf("isoWeek").format("YYYY-MM-DD");

  let week = getWeekInMonth(curDate);
  let weekRange = getWeekStartAndEnd(data);
  // let curDate =weekRange[1]
  weekFormat.value =
    new Date(curDate).getFullYear() +
    " 年 " +
    String(Number(new Date(curDate).getMonth()) + 1) +
    " 月 第 " +
    week +
    " 周 ";
  formData.timeList = weekRange;
  if (isInitWeekChange.value) {
    isInitWeekChange.value = false;
    return; // 阻止初始化时的重复请求
  }
  refresh();
}
// 根据日期判断是月的第几周
function getWeekInMonth(t) {
  if (t == undefined || t == "" || t == null) {
    t = new Date();
  } else {
    var _t = new Date();
    t = new Date(t);
    _t.setYear(t.getFullYear());
    _t.setMonth(t.getMonth());
    _t.setDate(t.getDate());

    var date = _t.getDate(); //给定的日期是几号

    _t.setDate(1);
    var d = _t.getDay(); //1. 得到当前的1号是星期几。
    var fisrtWeekend = d;
    if (d == 0) {
      fisrtWeekend = 1;
      //1号就是星期天
    } else {
      fisrtWeekend = 7 - d + 1; //第一周的周未是几号
    }
    if (date <= fisrtWeekend) {
      return 1;
    } else {
      return 1 + Math.ceil((date - fisrtWeekend) / 7);
    }
  }
}

const selectTimeChange = (val) => {
  refresh();
};

/**
 * 充电总览
 */

const formData = reactive({
  selectTimeType: "0",
  time: "",
  timeList: [],
  isOverviewWholeRoadNetwork: true,
  isOverviewServiceArea: false,
  isOverviewWhole: false,
  isOverviewUnilateral: false,
  serviceOverviewWholeSelects: undefined,
  serviceSelects: undefined
});
const loading1 = ref(false);
// echarts服务区
const serviceRankingOverviewData = ref([]);
const rankingChartOverview = ref(null);
// 定义指标配置
const metrics0 = [
  { key: 'chargeElec', name: '总充电量（万千瓦时）', color: '#6093ff' },
  { key: 'chargeNum', name: '总充电次数（次）', color: '#ff7e7e' },
  { key: 'chargeTimeAvg', name: '平均充电时长（分钟）', color: '#6ce06c' },
  { key: 'chargeFeeAvg', name: '平均电费单价（元/度）', color: '#6093ff' },
  { key: 'chargeServiceFeeAvg', name: '平均服务费单价（元/度）', color: '#6ce06c' },
  { key: 'chargeTotalFeeAvg', name: '平均充电总价（元/度）', color: '#6093ff' }
];

const metricsNot0 = [
  ...metrics0,
  { key: 'chargeElecDayAvg', name: '日均充电量（万千瓦时）', color: '#ffe360' },
  { key: 'chargeNumDayAvg', name: '日均充电次数（次）', color: '#ff8484' },
  { key: 'chargeTimeDayAvg', name: '日均充电时长（分钟）', color: '#6093ff' }
];

const maxValueMap = {
  chargeElec: 100,           // 总充电量最大值，比如50000万千万时
  chargeNum: 100,              // 充电次数最大值
  chargeTimeAvg: 100,            // 平均充电时长最大值（分钟）
  chargeFeeAvg: 100,             // 平均电费单价最大值（元/度）
  chargeServiceFeeAvg: 100,      // 平均服务费单价最大值（元/度）
  chargeTotalAvg: 100,           // 平均充电总价最大值
  chargeElecDayAvg: 100,       // 日均充电量最大值
  chargeNumDayAvg: 100,          // 日均充电次数最大值
  chargeTimeDayAvg: 100,         // 日均充电时长最大值
};

// 修改计算属性，直接使用后端数据
const topCharts = computed(() => {
  const data = serviceRankingOverviewData.value[0] || {};
  const metrics = formData.selectTimeType === "0" ? metrics0 : metricsNot0;
  const length = formData.selectTimeType === "0" ? 3 : 4;
  return metrics.slice(0, length).map(m => {
    const value = data[m.key] || 0;
    const max = maxValueMap[m.key] || 100;
    const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return {
      ...m,
      value,
      percentage
    };
  });
});

const bottomCharts = computed(() => {
  const data = serviceRankingOverviewData.value[0] || {};
  const metrics = formData.selectTimeType === "0" ? metrics0 : metricsNot0;
  const start = formData.selectTimeType === "0" ? 3 : 4;
  const end = formData.selectTimeType === "0" ? 6 : 9;
  const slicedMetrics = metrics.slice(start, end);

  return (formData.selectTimeType === "0" ? slicedMetrics : slicedMetrics.slice(0, 5))
    .map(m => {
      const value = data[m.key] || 0;
      const max = maxValueMap[m.key] || 100;
      const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
      return {
        ...m,
        value,
        percentage
      };
    });
});


// 更新图表
const rankingEcharts = async (isOverviewWholeRoadNetwork, isOverviewUnilateral) => {
  await handleChargingOverview(isOverviewWholeRoadNetwork, isOverviewUnilateral);
};

// 获取充电总览数据
const handleChargingOverview = async () => {
  const timeList = normalizeTimeList(formData);
  const serviceOverviewWholeSelects = listOptions.serviceAreaList?.find(item => item.serviceName === formData.serviceOverviewWholeSelects)?.serviceAreaIdList;
  const params = {
    timeList,
    selectTimeType: formData.selectTimeType ?? "", // 日期格式
    singleOrNot: formData.isOverviewWhole ? '2' : '1',
    serviceAreaIdList: formData.isOverviewWholeRoadNetwork
      ? []
      : formData.isOverviewWhole
        ? serviceOverviewWholeSelects
        : [formData.serviceSelects],
  };

  try {
    loading1.value = true;
    const res = await getChargeReport(params);
    if (res.code === 200) {
      serviceRankingOverviewData.value = res.data.records;
    }
  } catch (error) {
    console.error('获取充电总览数据失败:', error);
  } finally {
    loading1.value = false;
  }
};

// 选择全路网
const handleOverviewWholeRoadNetworkChange = (event) => {
  if (event.target.checked) {
    formData.isOverviewWholeRoadNetwork = true;
    formData.isOverviewServiceArea = false;
    formData.isOverviewWhole = false;
    formData.isOverviewUnilateral = false;
    formData.serviceOverviewWholeSelects = undefined;
    formData.serviceSelects = undefined;
  } else {
    event.target.checked = formData.isOverviewWholeRoadNetwork = true;
  }

  rankingEcharts(formData.isOverviewWholeRoadNetwork, formData.isOverviewUnilateral);
};

// 选择服务区
const handleOverviewServiceAreaChange = (event) => {
  if (event.target.checked) {
    formData.isOverviewServiceArea = true;
    formData.isOverviewWholeRoadNetwork = false;
    formData.isOverviewWhole = true;
    formData.isOverviewUnilateral = false;

    // 默认选中第一个服务区
    if (listOptions.serviceAreaList?.length > 0) {
      formData.serviceOverviewWholeSelects = listOptions.serviceAreaList[0].value;
    }
  } else {
    // 强制保持勾选状态
    event.target.checked = true;
    formData.isOverviewServiceArea = true;
  }

  rankingEcharts(formData.isOverviewWholeRoadNetwork, formData.isOverviewUnilateral);
};

// 选择整体
const onWholeChange = () => {
  if (formData.isOverviewWhole) return;
  formData.isOverviewWhole = true;
  formData.isOverviewUnilateral = false;
  rankingEcharts(formData.isOverviewWhole, formData.isOverviewUnilateral);
};

// 选择单侧
const onUnilateralChange = () => {
  if (formData.isOverviewUnilateral) return;
  formData.isOverviewUnilateral = true;
  formData.isOverviewWhole = false;
  if (listOptions.serviceArea?.length > 0) {
    formData.serviceSelects = listOptions.serviceArea[0].value;
  }
  rankingEcharts(formData.isOverviewUnilateral, formData.isOverviewWhole);
};

// 服务区名称变更
const handleServiceAreaNameChange = (val) => {

  rankingEcharts(formData.isOverviewUnilateral, formData.isOverviewWhole);
};

// 进出场服务区名称变更
const handleInOutServiceAreaNameChange = (val) => {
  rankingEcharts(formData.isOverviewUnilateral, formData.isOverviewWhole);
};

/**
 * 充电排名前十
 */
const fromChargingRankingData = reactive({
  time: "",
  timeList: [],
  isChargingRankingWhole: true,
  isChargingRankingUnilateral: false,
  isChargingFrequency: true, // 充电次数
  isChargingQuantity: false, // 充电量
})

const loading2 = ref(false);
const chargingRankingData = ref([]);
const chargingRankingChart = ref(null);
// ECharts图表
const chargingRankingEcharts = async () => {
  await handleChargingRanking();
  // 先销毁旧的实例
  if (chargingRankingChart.value) {
    chargingRankingChart.value.dispose();
  }
  // 创建新实例
  chargingRankingChart.value = echarts.init(
    document.getElementById("charging_ranking_echarts")
  );

  const chart = echarts.init(document.getElementById('charging_ranking_echarts'));

  // 跳转传参
  chart.on("click", (params) => {
    let data = {
      name: params.name,
      value: params.value,
      time: formData.time,
      timeList: formData.timeList,
      selectTimeType: formData.selectTimeType,
      serviceAreaIdList: params.data.serviceAreaIdList,
      startTime: params.data.startTime,
      endTime: params.data.endTime,
    };
    proxy.$Bus.emit("jumpAgency", { url: "/rmt/chargeReportServiceArea", data: data });
  });
  // 处理数据
  var data = chargingRankingData.value;
  var option;
  if (!chargingRankingData.value || chargingRankingData.value.length === 0) {
    option = {
      title: {
        text: "暂无数据",
        x: "center",
        y: "center",
        textStyle: {
          color: "#ccc",
          fontSize: 16,
        },
      },
      legend: { show: false },
      tooltip: { show: false },

      // 网格配置
      grid: {
        show: true,
        borderWidth: 1,
        borderColor: "#ccc",
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: '3%',
        containLabel: true,
      },

      // X轴配置
      xAxis: {
        type: "value",
        show: true,
        axisLine: { show: true },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      // Y轴配置
      yAxis: {
        type: "category",
        show: true,
        data: [],
        axisLine: { show: true },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },

      // 空系列
      series: [],
    };
  } else {
    option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },

        formatter: function (params) {
          const index = params[0].dataIndex; // 所有 series 共用同一个 dataIndex
          const dataItem = data[index]; // 从原始数据数组中取出完整对象
          return `
    <div style="font-size: 14px; color: #666;">
      <div>${dataItem.serviceName || '未知服务区'}</div>
      <div style="margin-top: 8px;">
        <span style="color: #5aa0ff;">●</span> 充电量：${(dataItem.chargeElec || 0).toLocaleString()} kW·h
      </div>
      <div>
        <span style="color: #96f7d2;">●</span> 充电次数：${(dataItem.chargeNum || 0).toLocaleString()} 次
      </div>
    </div>
  `;
        }
      },
      legend: {
        data: ['充电量', '充电次数'],
        itemGap: 5,
        // selectedMode: false
      },
      grid: {
        top: '14%',
        left: '2%',
        right: '10%',
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: data.map(item => item.serviceName),
          axisLabel: {
            interval: 0,
            fontSize: 10,
            rotate: 45,
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '充电量(kW·h)',
          position: 'left',
          nameGap: 35,
          axisLabel: {
            fontSize: 12
          },
          nameTextStyle: {
            fontSize: 12
          }
        },
        {
          type: 'value',
          name: '充电次数(次)',
          position: 'right',
          axisLabel: {
            fontSize: 12
          },
          nameTextStyle: {
            fontSize: 12
          }
        }
      ],
      series: [
        {
          name: '充电量',
          type: 'bar',
          barWidth: '25%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#1a457b' },
              { offset: 1, color: '#5aa0ff' }
            ]),
            borderRadius: [10, 10, 0, 0]
          },
          data: data.map(item => ({
            // ...item,
            name: item.serviceName,  // 关键点
            value: item.chargeElec,
            ...item,
          }))
        },
        {
          name: '充电次数',
          type: 'bar',
          barWidth: '25%',
          yAxisIndex: 1,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#00c292' },
              { offset: 1, color: '#96f7d2' }
            ]),
            borderRadius: [10, 10, 0, 0]
          },
          data: data.map(item => ({
            name: item.serviceName,  // 关键点
            value: item.chargeNum,
            ...item,
          }))
        }
      ]
    };
  }
  // chargingRankingChart.value.setOption(option, true);
  option && chart.setOption(option);
  chart.on("legendselectchanged", function (params) {
    const selected = params.selected;

    const newYAxis = [
      {
        type: 'value',
        name: selected['充电量'] ? '充电量(kW·h)' : '',
        position: 'left',
        axisLabel: { fontSize: 12 },
        nameTextStyle: { fontSize: 12 }
      },
      {
        type: 'value',
        name: selected['充电次数'] ? '充电次数(次)' : '',
        position: 'right',
        axisLabel: { fontSize: 12 },
        nameTextStyle: { fontSize: 12 }
      }
    ];

    chart.setOption({ yAxis: newYAxis }, false);
  });
}


// 获取充电排名前十数据
const handleChargingRanking = async () => {
  try {
    const timeList = normalizeTimeList(formData);
    const params = {
      selectTimeType: formData.selectTimeType ?? "", // 日期格式
      timeList,
      column: fromChargingRankingData.isChargingFrequency ? "CHARGE_NUM" : "charge_elec",
      singleOrNot: fromChargingRankingData.isChargingRankingWhole ? "2" : "1"
    };
    loading2.value = true;
    const res = await getServiceChargeRanking(params);
    if (res.code === 200) {
      chargingRankingData.value = res.data.records;
    }
  } catch (error) {
    console.error('获取充电排名数据失败:', error);
  } finally {
    loading2.value = false;
  }
};

// 以充电次数排名
const onFrequencyChange = (e) => {
  fromChargingRankingData.isChargingFrequency = true;
  fromChargingRankingData.isChargingQuantity = false;
  chargingRankingEcharts()
}

// 以充电量排名
const onElectricQuantityChange = () => {
  fromChargingRankingData.isChargingFrequency = false;
  fromChargingRankingData.isChargingQuantity = true;
  chargingRankingEcharts()
}

// 整体
const onOverallChargingRankingChange = (event) => {
  if (event.target.checked) {
    fromChargingRankingData.isChargingRankingWhole = true;
    fromChargingRankingData.isChargingRankingUnilateral = false;
  }
  if (!event.target.checked) {
    event.target.checked = fromChargingRankingData.isChargingRankingWhole = true;
  }
  chargingRankingEcharts()
}

// 单侧
const onSingleSideChargingankingChange = (event) => {
  if (event.target.checked) {
    fromChargingRankingData.isChargingRankingWhole = false;
    fromChargingRankingData.isChargingRankingUnilateral = true;
  }
  if (!event.target.checked) {
    event.target.checked = fromChargingRankingData.isChargingRankingUnilateral = true;
  }
  chargingRankingEcharts()
}


/**
 * 充电服务区利用率排名前十
 * 以 UtilizationRate(利用率)
 */
const fromUtilizationRateData = reactive({
  isUtilizationRateWhole: true, // 整体
  isUtilizationRateUnilateral: false, // 单侧
})
const loading3 = ref(false)
const utilizationRateData = ref([]);
const UtilizationRateChart = ref(null);

const utilizationRateEcharts = async () => {
  await handleUtilizationRate()
  // 先销毁旧的实例
  if (UtilizationRateChart.value) {
    UtilizationRateChart.value.dispose();
  }
  UtilizationRateChart.value = echarts.init(
    document.getElementById("utilization_rate_echarts")
  );
  const chart = echarts.init(document.getElementById('utilization_rate_echarts'));
  // 点击跳转
  UtilizationRateChart.value.on("click", (params) => {
    let dataParam = {
      name: params.name,
      value: params.value,
      time: formData.time,
      timeList: formData.timeList,
      selectTimeType: formData.selectTimeType,
      serviceAreaIdList: params.data.serviceAreaIdList,
    };
    proxy.$Bus.emit("jumpAgency", {
      url: "/rmt/chargeReportServiceArea",
      data: dataParam,
    });
  });
  var data = utilizationRateData.value;

  var attackSourcesColor = [
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "rgb(69,115,179)" },
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "rgb(110,170,244)" },
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "rgb(69,115,179)" },
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "rgb(110,170,244)" },
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "rgb(69,115,179)" },
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "rgb(110,170,244)" },
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "rgb(69,115,179)" },
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "rgb(110,170,244)" },
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "rgb(69,115,179)" },
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "rgb(110,170,244)" },
    ]),
  ];

  var attaData = [];
  var attaName = [];
  var topName = [];

  data.forEach((it, index) => {
    attaData[index] = parseFloat(it.chargeTimeRate);
    attaName[index] = it.stock;
    topName[index] = `${it.serviceName}`;
    if (index == 0) {
      //金牌
      topName[index] = `🥇 ${it.serviceName}`;
    } else if (index == 1) {
      //银牌
      topName[index] = `🥈 ${it.serviceName}`;
    } else if (index == 2) {
      //铜牌
      topName[index] = `🥉 ${it.serviceName}`;
    } else if (index == 3) {
      //铁牌
      topName[index] = `🏅 ${it.serviceName}`;
    } else {
      topName[index] = ` ${index < 9 ? "0" : ""}${index + 1} ${it.serviceName}`;
    }
  });

  var salvProMax = []; //背景按最大值
  for (let i = 0; i < attaData.length; i++) {
    salvProMax.push(attaData[0]);
  }

  function attackSourcesDataFmt(sData) {
    var sss = [];
    sData.forEach(function (item, i) {
      let itemStyle = {
        color: attackSourcesColor[i],
      };
      sss.push({
        value: item,
        itemStyle: itemStyle,
      });
    });
    utilizationRateData.value.forEach((itm, idx) => {
      sss[idx].serviceAreaIdList = itm.serviceAreaIdList;
      sss[idx].startTime = itm.startTime;
      sss[idx].endTime = itm.endTime;
    });
    return sss;
  }
  if (utilizationRateData.value.length > 0) {
    var option = {
      tooltip: {
        show: true,
        textStyle: {
          fontSize: 16,
        },
        formatter: function (params) {
          return (
            params.name + "<br/>" + "利用率：" + params.value + '%'
          );
        },
      },
      grid: {
        left: fromUtilizationRateData.isUtilizationRateUnilateral ? '-15%' : '-8%', // 或 '50px'
        right: '4%',
        bottom: '2%',
        top: '2%',
        containLabel: true,
      },
      xAxis: {
        type: "value",

        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: [
        {
          type: "category",
          inverse: true,
          offset: -10,
          position: "left",
          axisLine: {
            show: false,
            onZero: false // 轴线不强制在零值位置
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            color: ["#000"],
            align: "left",
            verticalAlign: "bottom",
            overflow: "truncate",
            lineHeight: 32,
            fontSize: 12,
          },
          data: topName,
        },
        {
          type: "category",
          inverse: true,
          offset: -60,
          position: "right",
          axisLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisTick: "none",
          axisLine: "none",
          axisLabel: {
            formatter: (value) => `${value}%`, // 加百分号
            textStyle: {
              interval: 0,
              color: "rgb(69,115,179)",
              align: "left",
              verticalAlign: "bottom",
              lineHeight: 32,
              fontSize: 12,
            },
          },
          data: attackSourcesDataFmt(attaData),
        },
      ],
      series: [
        {
          zlevel: 1,
          type: "bar",
          barWidth: 8,
          barCategoryGap: "40%",
          showBackground: true,
          backgroundStyle: {
            color: "rgb(229,236,255)",
            borderRadius: [0, 30, 30, 0], // 横向柱子：右端圆角
          },
          animationDuration: 1500,
          data: attackSourcesDataFmt(attaData),
          align: "center",
          itemStyle: {
            normal: {
              barBorderRadius: 30,
            },
          },
          label: {
            show: false,
            fontSize: 10,
            color: "#fff",
            textBorderWidth: 2,
            padding: [2, 0, 0, 0],
          },
        },
      ],
    };
  } else {
    var option = {
      title: {
        text: "暂无数据",
        x: "center",
        y: "center",
        textStyle: {
          color: "#ccc",
          fontSize: 16,
        },
      },
      legend: { show: false },
      tooltip: { show: false },

      // 网格配置
      grid: {
        show: true,
        borderWidth: 1,
        borderColor: "#ccc",
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: '2%',
        containLabel: true,
      },

      // X轴配置
      xAxis: {
        type: "value",
        show: true,
        axisLine: { show: true },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      // Y轴配置
      yAxis: {
        type: "category",
        show: true,
        data: [],
        axisLine: { show: true },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },

      // 空系列
      series: [],
    };
  }

  // option && UtilizationRateChart.value.setOption(option, true);
  chart.setOption(option);
}

//  获取充电服务区利用率排名前十数据
const handleUtilizationRate = async () => {
  try {
    const timeList = normalizeTimeList(formData);
    const params = {
      timeList,
      selectTimeType: formData.selectTimeType ?? "", // 日期格式
      singleOrNot: fromUtilizationRateData.isUtilizationRateWhole ? '2' : '1'
    }
    loading3.value = true;
    const res = await getServiceChargeUsage(params);
    if (res.code === 200) {

      utilizationRateData.value = res.data.records;
    }
  } catch (error) {
    console.error('获取充电排名数据失败:', error);
  } finally {
    loading3.value = false;
  }
}

// 整体按钮
const onUtilizationRateChange = (event) => {
  if (event.target.checked) {
    fromUtilizationRateData.isUtilizationRateWhole = true;
    fromUtilizationRateData.isUtilizationRateUnilateral = false;
  }
  if (!event.target.checked) {
    event.target.checked = fromUtilizationRateData.isUtilizationRateWhole = true;
  }
  utilizationRateEcharts()
}

// 单侧按钮
const onUtilizationRateUnilateralChange = (event) => {
  if (event.target.checked) {
    fromUtilizationRateData.isUtilizationRateWhole = false;
    fromUtilizationRateData.isUtilizationRateUnilateral = true;
  }
  if (!event.target.checked) {
    event.target.checked = fromUtilizationRateData.isUtilizationRateUnilateral = true;
  }
  utilizationRateEcharts()
}


/**
 * 时段利用率趋势
 * PeriodTime
 */
const formPeriodTimeData = reactive({
  isPeriodTimeNetwork: true,
  isPeriodTimeArea: false,
  isPeriodTimeWhole: false,
  isPeriodTimeUnilateral: false,
  servicePeriodTimeWholeSelects: undefined,
  servicePeriodTimeSelects: undefined
})
const loading4 = ref(false);
const periodTimeData = ref([])

const periodTimeEcharts = async () => {
  await handlePeriodTime();
  // 先销毁旧的实例
  if (myRankingEcharts) {
    myRankingEcharts.dispose();
  }
  var myRankingEcharts = echarts.init(
    document.getElementById("period_time_echarts")
  );
  const wholeSelectData = listOptions.serviceAreaList?.find(item => item.serviceName === formPeriodTimeData.servicePeriodTimeWholeSelects)?.serviceAreaIdList;
  myRankingEcharts.on("click", (params) => {
    let dataParam = {
      name: params.name,
      value: params.value,
      time: formData.time,
      timeList: formData.timeList,
      selectTimeType: formData.selectTimeType,
      serviceAreaIdList: wholeSelectData,
    };
    proxy.$Bus.emit("jumpAgency", {
      url: "/rmt/chargeStationBusy",
      data: dataParam,
    });
  });
  const rawData = periodTimeData.value;

  const xData = rawData.map(item => item.timeFrame);
  const yData = rawData.map(item => ({
    value: item.useRatio,
    serviceAreaIdList: item.serviceAreaIdList,
  }))

  let option = {
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        const param = params[0];
        return `${param.name} <br />利用率：${param.value}%`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: periodTimeData.value.length > 0 ? '4%' : '10%',
      top: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xData,
      axisLabel: {
        interval: 0,
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 10,
      axisLabel: {
        formatter: '{value}%',
        fontSize: 10,
        color: '#000',
      },
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee',
        },
      },
    },
    series: [
      {
        name: "利用率",
        type: "line",
        data: yData,
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: {
          color: "#4573B3",
          width: 2,
        },
        itemStyle: {
          color: "#4573B3",
        },
        areaStyle: {
          color: "rgba(69,115,179,0.2)",
        },
      },
    ],
  };
  option && myRankingEcharts.setOption(option);
};


// 获取数据
const handlePeriodTime = async () => {
  try {
    const timeList = normalizeTimeList(formData);

    // 选择整体获取数据
    const wholeSelectData = listOptions.serviceAreaList?.find(item => item.serviceName === formPeriodTimeData.servicePeriodTimeWholeSelects)?.serviceAreaIdList;

    const params = {
      timeList,
      selectTimeType: formData.selectTimeType ?? "", // 日期格式
      singleOrNot: formPeriodTimeData.isPeriodTimeWhole ? '2' : '1',
      serviceAreaIdList: formPeriodTimeData.isPeriodTimeNetwork
        ? []
        : formPeriodTimeData.isPeriodTimeWhole
          ? wholeSelectData
          : [formPeriodTimeData.servicePeriodTimeSelects],
    }

    loading4.value = true;
    const res = await getUseRatioByTimeFrame(params);
    if (res.code === 200) {
      periodTimeData.value = res.data.records;
    }
  } catch (error) {

  } finally {
    loading4.value = false;
  }
}

// 选择全路网
const handlePeriodTimeChange = (event) => {
  if (!event.target.checked) {
    event.target.checked = true;
    formData.isPeriodTimeNetwork = true;
  }
  if (event.target.checked) {
    formPeriodTimeData.isPeriodTimeNetwork = true;
    formPeriodTimeData.isPeriodTimeArea = false;
    formPeriodTimeData.isPeriodTimeWhole = false;
    formPeriodTimeData.isPeriodTimeUnilateral = false;
    formPeriodTimeData.servicePeriodTimeWholeSelects = undefined;
    formPeriodTimeData.servicePeriodTimeSelects = undefined;
  }
  periodTimeEcharts()
};

// 选择服务区
const handlePeriodTimeAreaChange = (event) => {
  if (event.target.checked) {
    formPeriodTimeData.isPeriodTimeArea = true;
    formPeriodTimeData.isPeriodTimeNetwork = false;
    formPeriodTimeData.isPeriodTimeWhole = true;
    formPeriodTimeData.isPeriodTimeUnilateral = false;
    if (!formPeriodTimeData.servicePeriodTimeWholeSelects && listOptions.serviceAreaList?.length > 0) {
      formPeriodTimeData.servicePeriodTimeWholeSelects = listOptions.serviceAreaList[0].value;
    }
  } else {
    event.target.checked = formPeriodTimeData.isPeriodTimeArea = true;
  }

  periodTimeEcharts();
};

// 选择整体
const onPeriodTimeWholeChange = () => {
  formPeriodTimeData.isPeriodTimeWhole = true;
  formPeriodTimeData.isPeriodTimeUnilateral = false;
  if (listOptions.serviceAreaList?.length > 0) {
    formPeriodTimeData.servicePeriodTimeWholeSelects = listOptions.serviceAreaList[0].value;
  }
  periodTimeEcharts()
};

// 选择单侧
const onPeriodTimeUnilateralChange = () => {
  formPeriodTimeData.isPeriodTimeUnilateral = true;
  formPeriodTimeData.isPeriodTimeWhole = false;
  if (listOptions.serviceArea?.length > 0) {
    formPeriodTimeData.servicePeriodTimeSelects = listOptions.serviceArea[0].value;
  }
  periodTimeEcharts()
};

// 服务区整体名称选择
const handlePeriodTimeNameChange = (val) => {
  // handlePeriodTime()
  periodTimeEcharts()
};

// 服务区单侧名称选择
const handleInOutPeriodTimeNameChange = (val) => {
  periodTimeEcharts()
};

// 获取顶部时间公用方法
function normalizeTimeList(formData) {
  let timeList = formData.timeList;
  if (formData.time && (!timeList || timeList.length === 0)) {
    timeList = [formData.time];
  }
  return timeList;
}

onActivated(() => {
  refresh();
});

onMounted(async () => {
  formData.time = moment().subtract(1, "day").format("YYYY-MM-DD");

  // 获取服务区列表数据
  try {
    const res = await getChargeVisualizationServiceArea();
    if (res.code === 200) {
      listOptions.serviceAreaList = res.data.records.map(item => ({
        label: item.serviceName,
        value: item.serviceName,
        ...item
      }));
    }
  } catch (error) {
    console.error('获取服务区列表失败:', error);
  }
  // 获取进出服务区列表数据
  try {
    const res = await getServiceArea();
    if (res.code === 200) {
      listOptions.serviceArea = res.data.records.map(item => ({
        label: item.label,
        value: item.value
      }));
    }
  } catch (error) {
    console.error('获取进出服务区列表失败:', error);
  }
});

// 刷新
const refresh = () => {
  Promise.all([
    rankingEcharts(formData.isOverviewWholeRoadNetwork, formData.isOverviewServiceArea),
    chargingRankingEcharts(),
    utilizationRateEcharts(),
    periodTimeEcharts()
  ]).catch((err) => {
    console.error('刷新图表出错：', err);
    ElMessage.error('获取数据失败，请稍后重试');
  });
};

watch(
  () => listOptions.serviceArea,
  (newVal) => {
    if (
      formData.isOverviewUnilateral &&
      newVal &&
      newVal.length > 0 &&
      !formData.serviceSelects
    ) {
      formData.serviceSelects = newVal[0].value;
    }
    if (formPeriodTimeData.isPeriodTimeUnilateral &&
      newVal &&
      newVal.length > 0 &&
      !formData.serviceSelects) {
      formPeriodTimeData.servicePeriodTimeSelects = newVal[0].value;
    }
  }
);
</script>

<style scoped lang="less">
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.this_page {
  .service_ranking {
    .service_ranking_title {
      width: 600px;
      display: flex;
      justify-content: space-between;

      .service_ranking_title_right {
        .el-radio-group {
          .el-radio__input {
            .el-radio__inner {
              width: 16px;
            }
          }
        }

        display: flex;

        .service_ranking_title_right_item {
          display: flex;
          align-items: center;
        }
      }
    }

    .service_ranking_overview_title {
      display: flex;
      margin-left: 20px;

      .service_ranking_overview_title_right_item {
        display: flex;
        align-items: center;
      }

      .service_ranking_overview_title_form_item_inline {
        margin-bottom: 0;
      }

      .service_ranking_overview_title_form_select {
        width: 220px;
      }
    }

    .margin_overview_right_10 {
      margin-right: 10px;
    }

    .margin_right_10 {
      margin-right: 20px;
    }

    .service_ranking_overview_echars_flex {
      width: 100%;
      max-width: 830px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 10px;
      box-sizing: border-box;
      /* 保险 */

      .top-part,
      .bottom-part {
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 10px;
      }

      .top-part el-progress,
      .bottom-part el-progress {
        flex-shrink: 0;
        /* 防止缩小 */
        width: 110px !important;
        height: 110px !important;
      }

      .progress-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 110px;
      }

      .progress-label {
        margin-top: 8px;
        font-size: 14px;
        color: #333;
        text-align: center;
        white-space: normal;
        line-height: 1.2;
      }

    }

    .ui-checkbox {
      --primary-color: #1a457b;
      --secondary-color: #fff;
      --primary-hover-color: #1a457b;
      /* checkbox */
      --checkbox-diameter: 20px;
      --checkbox-border-radius: 5px;
      --checkbox-border-color: #d9d9d9;
      --checkbox-border-width: 1px;
      --checkbox-border-style: solid;
      /* checkmark */
      --checkmark-size: 1.2;
    }

    .ui-checkbox,
    .ui-checkbox *,
    .ui-checkbox *::before,
    .ui-checkbox *::after {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }

    .ui-checkbox {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      width: var(--checkbox-diameter);
      height: var(--checkbox-diameter);
      border-radius: var(--checkbox-border-radius);
      background: var(--secondary-color);
      border: var(--checkbox-border-width) var(--checkbox-border-style) var(--checkbox-border-color);
      -webkit-transition: all 0.3s;
      -o-transition: all 0.3s;
      transition: all 0.3s;
      cursor: pointer;
      position: relative;
    }

    .ui-checkbox::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      -webkit-box-shadow: 0 0 0 calc(var(--checkbox-diameter) / 2.5) var(--primary-color);
      box-shadow: 0 0 0 calc(var(--checkbox-diameter) / 2.5) var(--primary-color);
      border-radius: inherit;
      opacity: 0;
      -webkit-transition: all 0.5s cubic-bezier(0.12, 0.4, 0.29, 1.46);
      -o-transition: all 0.5s cubic-bezier(0.12, 0.4, 0.29, 1.46);
      transition: all 0.5s cubic-bezier(0.12, 0.4, 0.29, 1.46);
    }

    .ui-checkbox::before {
      top: 40%;
      left: 50%;
      content: "";
      position: absolute;
      width: 4px;
      height: 7px;
      border-right: 2px solid var(--secondary-color);
      border-bottom: 2px solid var(--secondary-color);
      -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(0);
      -ms-transform: translate(-50%, -50%) rotate(45deg) scale(0);
      transform: translate(-50%, -50%) rotate(45deg) scale(0);
      opacity: 0;
      -webkit-transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6),
        opacity 0.1s;
      -o-transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6), opacity 0.1s;
      transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6), opacity 0.1s;
    }

    /* actions */

    .ui-checkbox:hover {
      border-color: var(--primary-color);
    }

    .ui-checkbox:checked {
      background: var(--primary-color);
      border-color: transparent;
    }

    .ui-checkbox:checked::before {
      opacity: 1;
      -webkit-transform: translate(-50%, -50%) rotate(45deg) scale(var(--checkmark-size));
      -ms-transform: translate(-50%, -50%) rotate(45deg) scale(var(--checkmark-size));
      transform: translate(-50%, -50%) rotate(45deg) scale(var(--checkmark-size));
      -webkit-transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
      -o-transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
      transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    }

    .ui-checkbox:active:not(:checked)::after {
      -webkit-transition: none;
      -o-transition: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      transition: none;
      opacity: 1;
    }
  }

  .search_title {
    margin-left: 20px;
    display: flex;
    align-items: center;

    .search_icon {
      display: inline-block;
      width: 5px;
      height: 20px;
      background: #1a457b;
      margin-right: 5px;
    }

    .el-text {
      font-size: 20px;
      color: #1a457b;
      font-weight: 600;
    }
  }

  .custom_form {
    margin-bottom: 20px;

    :deep(.form_item) {
      width: 100%;

      .el-radio-group {
        .el-radio-button {
          .el-radio-button__inner {
            border: none !important;
            padding: 5px 2px;
            margin: 0 10px;
          }
        }

        .el-radio-button.is-active {
          .el-radio-button__inner {
            border: none !important;
            outline: none !important;
            background-color: #1a457b !important;
            padding: 5px 2px;
            border-radius: 5px;
          }
        }
      }

      .el-cascader {
        width: 100%;
      }

      .separator {
        margin: 0 10px;
      }
    }
  }

  .func_btn_box {
    margin-bottom: 10px;
  }

  .tips_box {
    display: flex;
    align-items: baseline;
    height: 40px;
    margin: 10px 0;
    padding: 10px;

    .tips {
      position: relative;
      font-size: var(--fontSize16);
      font-weight: bold;

      &::before {
        position: absolute;
        content: "";
        width: 5px;
        height: 15px;
        left: -10px;
        top: 4px;
        background-color: #114484;
      }

      .tips_num {
        color: blue;
      }
    }

    .tips_num_close {
      margin-left: 10px;
      color: blue;
    }
  }

  :deep(.custom_table) {
    margin-bottom: 20px;

    .pic_box {
      display: flex;

      .el-image {
        width: 50px;
        height: 50px;
        object-fit: cover;

        &:not(:last-child) {
          margin-right: 10px;
        }
      }
    }

    .no_file {
      font-style: italic;
      color: #5d5d5d;
    }

    .accessory_box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      // overflow-x: auto;

      // &::-webkit-scrollbar {
      //     // width: 100px;
      //     height: 10px;
      // }

      // &::-webkit-scrollbar-thumb {
      //     background-color: #5d5d5d;
      // }

      // &::-webkit-scrollbar-track {
      //     background-color: aliceblue;
      // }
    }

    .action_sheet {
      display: flex;
      align-items: center;
      justify-content: center;

      .el-dropdown {
        margin-left: 12px;
      }
    }
  }

  .pagination_box {
    float: right;
  }
}

::v-deep(.season > span > .el-input) {
  width: 100% !important;
}

.top-part,
.progress-item ::v-deep(.el-progress__text) {
  font-size: 23px !important;
}

.margin_b_20 {
  margin-bottom: 20px;
}

.text-button {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    color: #1a457b;
  }

  &.active {
    color: #ffffff;
    background-color: #1a457b;
  }
}
</style>