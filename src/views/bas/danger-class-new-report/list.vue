<!-- 危化品车辆排名 -->
<template>
  <div class="this_page">
    <!-- 筛选项 -->
    <div ref="searchRef">
      <div class="search_title margin_b_20">
        <i class="search_icon"></i>
        <el-text>危化品车辆分类统计</el-text>
      </div>
      <el-form
        inline
        :model="formData"
        class="custom_form"
        label-width="120px"
        style="padding: 0 20px"
        label-position="right"
        label-suffix=":"
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="统计维度" label-width="auto" class="form_item">
              <el-radio-group
                v-model="formData.selectTimeType"
                @change="selectTimeTypeChange()"
              >
                <el-radio-button
                  v-for="(item, index) in selectTimeTypeList"
                  :key="index"
                  :label="item.code"
                >
                  {{ item.name }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="!formData.selectTimeType"> </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '0'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker
                style="width: 100%"
                v-model="formData.time"
                type="date"
                placeholder="请选择日期"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                @change="selectTimeChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7" v-if="formData.selectTimeType == '1'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker
                style="width: 100%"
                v-model="formData.time"
                type="week"
                placeholder="请选择周"
                :format="weekFormat"
                valueFormat="YYYY-MM-DD"
                @change="weekChange(formData.time)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '2'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker
                style="width: 100%"
                v-model="formData.time"
                type="month"
                placeholder="请选择月"
                format="YYYY-MM"
                valueFormat="YYYY-MM"
                @change="selectTimeChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '3'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <DateQuarter
                style="width: 100%"
                ref="seasonSelect"
                placeholder="请选择季度"
                @chooseSeason="seasonChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '4'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker
                style="width: 100%"
                v-model="formData.time"
                type="year"
                placeholder="请选择年"
                format="YYYY"
                valueFormat="YYYY"
                @change="selectTimeChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="formData.selectTimeType == '5'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker
                style="width: 100%"
                v-model="formData.timeList"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                @change="selectTimeChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="0" class="form_item">
              <div class="service_ranking_title_right">
                <div class="service_ranking_title_right_item margin_right_10">
                  <span>全路网</span>
                  <input
                    type="checkbox"
                    class="ui-checkbox"
                    v-model="formData.isRoadAll"
                    @change="handleRoadAllChange"
                  />
                </div>
                <div class="service_ranking_title_right_item margin_right_10">
                  <span>公司</span>
                  <input
                    type="checkbox"
                    class="ui-checkbox"
                    v-model="formData.isCompany"
                    @change="handleCompanyChange"
                  />
                </div>
                <div class="service_ranking_title_right_item">
                  <span>服务区</span>
                  <input
                    type="checkbox"
                    class="ui-checkbox"
                    v-model="formData.isService"
                    @change="handleServiceChange"
                  />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            v-if="
              !formData.isRoadAll && formData.isCompany && !formData.isService
            "
          >
            <el-form-item label-width="80px" label="公司名称" class="form_item">
              <el-select
                collapse-tags
                collapse-tags-tooltip
                v-model="formData.companySelects"
                multiple
                filterable
                placeholder="请选择公司"
                clearable
                @change="companyChange"
              >
                <el-option
                  v-for="(item, index) in companyList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            v-if="
              !formData.isRoadAll && !formData.isCompany && formData.isService
            "
          >
            <el-form-item
              label-width="90px"
              label="服务区名称"
              class="form_item"
            >
              <el-select
                collapse-tags
                collapse-tags-tooltip
                v-model="formData.serviceSelects"
                multiple
                filterable
                placeholder="请选择服务区"
                clearable
                @change="railwayChange"
              >
                <el-option
                  v-for="(item, index) in listOptions.serviceAreaList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="12" v-loading="loading1">
          <div class="service_ranking">
            <div class="search_title_box">
              <div class="search_title">
                <i class="search_icon"></i>
                <el-text>危化品分类</el-text>
              </div>
              <div class="search_total">
                <i class="num_icon"></i>
                <text
                  >总数{{
                    dangerNumTotals ? dangerNumTotals : 0
                  }}件</text
                >
              </div>
            </div>
            <div
              id="route_ranking_echarts"
              style="width: 100%; height: 400px"
            ></div>
          </div>
        </el-col>
        <el-col :span="12" v-loading="loading2">
          <div class="service_ranking">
            <div class="search_title">
              <i class="search_icon"></i>
              <el-text>时段趋势分布</el-text>
            </div>
            <div
              id="time_trend_echarts"
              style="width: 100%; height: 400px"
            ></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import {
  nextTick,
  onMounted,
  reactive,
  ref,
  onActivated,
  getCurrentInstance,
} from "vue";
//   import DetailDialog from "./detail-dialog";
import { DateQuarter } from "mam-base-ui";
import { getCompany } from "@/api/informationServiceAreaApi.js";
import moment from "moment";
import {
  getDngerQueryClassChart, //危化品分类
  getQueryTimeChart, // 时段趋势分布
  getRoadLineList,
  getRoadLineServiceArea,
} from "@/api/dangerClassNewReport/index.js";
// import { getRoadLineAllList} from "@/api/powerStation/index.js";
import { useRouter } from "vue-router";
const router = useRouter();
import ExportDialog from "../../rmt/components/export-dialog/index.vue";
const { proxy } = getCurrentInstance();
import { debounce } from "lodash-es";
const classNewReportData = ref({}); //危化品分类
const queryTimeChartData = ref({}); // 时段趋势分布
const loading1 = ref(false);
const loading2 = ref(false);
const exportShow = ref(false);
const page = ref(1); // 当前页
const companyList = ref([]); // 公司下拉数据
const lineTree = ref([]); // 路段下拉数据
const lineAll = ref([]); // 路线下拉数据
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
const dangerNumTotals = ref(0); // 危化品数量
// echarts危化品分类
const routeEcharts = async (type) => {
  await handleQueryClassChart(type); //危化品分类
  var myRankingEcharts = echarts.init(
    document.getElementById("route_ranking_echarts")
  ); // 指定图表的配置项和数据
  // 点击跳转
  // myRankingEcharts.on("click", (params) => {
  //   let data = {
  //     name: params.name,
  //     value: params.value,
  //     time: formData.time,
  //     timeList: formData.timeList,
  //   };
  //   proxy.$Bus.emit("jumpAgency", { url: "/bas/dangerClass", data: data });
  // });
  var data = [
    {
      name: "易燃易爆",
      num: classNewReportData.value?.flammExpl ?? 0,
      rate: classNewReportData.value?.flammExplRate ?? 0,
    },
    {
      name: "腐蚀品",
      num: classNewReportData.value?.corrosive ?? 0,
      rate: classNewReportData.value?.corrosiveRate ?? 0,
    },
    {
      name: "有毒品",
      num: classNewReportData.value?.toxic ?? 0,
      rate: classNewReportData.value?.toxicRate ?? 0,
    },
    {
      name: "压缩气体和液化气体",
      num: classNewReportData.value?.compressedGas ?? 0,
      rate: classNewReportData.value?.compressedGasRate ?? 0,
    },
    {
      name: "易燃液体",
      num: classNewReportData.value?.flammLiquid ?? 0,
      rate: classNewReportData.value?.flammLiquidRate ?? 0,
    },
    {
      name: "易燃固体",
      num: classNewReportData.value?.flammSolid ?? 0,
      rate: classNewReportData.value?.flammSolidRate ?? 0,
    },
    {
      name: "自燃物品和遇湿易燃物品",
      num: classNewReportData.value?.waterReact ?? 0,
      rate: classNewReportData.value?.waterReactRate ?? 0,
    },
    {
      name: "放射性物品",
      num: classNewReportData.value?.radioactive ?? 0,
      rate: classNewReportData.value?.radioactiveRate ?? 0,
    },
    {
      name: "空车",
      num: classNewReportData.value?.empty ?? 0,
      rate: classNewReportData.value?.emptyRate ?? 0,
    },
  ];
  var attackSourcesColor = [
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "rgb(69,115,179)" },
    ]),
  ];
  var attaData = [];
  var rateData = [];
  var topName = [];
  // var dangerTotal = 0;
  // data.forEach((item) => {
  //   dangerTotal += item.num;
  // })
  dangerNumTotals.value  = classNewReportData.value.totalDangerNum;
  data.forEach((it, index) => {
    attaData[index] = parseFloat(it.num);
    rateData[index] = parseFloat(it.rate).toFixed(2);
    topName[index] = `${it.name}`;
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
    rateData.forEach((item, i) => {
      sss[i].rate = item;
    });
    return sss;
  }

  var option = {
    tooltip: {
      show: false,
      textStyle: {
        fontSize: 16,
      },
    },
    legend: {
      itemWidth: 20,
      itemHeight: 10,
      textStyle: {
        //图例文字的样式
        fontSize: 10,
        color: "#fff",
      },
      selectedMode: false,
    },
    grid: {
      left: "3%",
      right: "2%",
      width: "100%",
      bottom: "2%",
      top: "8%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },
      formatter: function (params) {
        console.log(params,'params');
        
        return (
          params[0].name +
          "<br/>" +
          "数量：" +
          params[0].value +
          "<br/>" +
          "占比：" +
          params[0].data.rate +
          "%"
        );
      },
    },
    xAxis: {
      type: "category",
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        interval: 0, // 强制显示所有标签
        width: 50,
        overflow: "break", // 超出宽度自动换行
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      data: topName,
    },
    yAxis: [
      {
        //名称
        type: "value",
        inverse: false,
        splitLine: {
          show: true,
          type: "dashed", // 虚线
        },
        // offset: -10,
        position: "left",
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          interval: 0,
          color: ["#000"],
          fontSize: 12,
        },
        // data: topName,
      },
    ],
    series: [
      {
        zlevel: 1,
        type: "bar",
        barWidth: 16,
        animationDuration: 1500,
        data: attackSourcesDataFmt(attaData),
        align: "center",
        itemStyle: {
          normal: {
            borderRadius: [10, 10, 0, 0],
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
      // {
      //   type: "bar",
      //   barWidth: 16,
      //   barGap: "-100%",
      //   margin: "20",
      //   data: salvProMax,
      //   textStyle: {
      //     //图例文字的样式
      //     fontSize: 10,
      //     color: "#000",
      //   },
      //   itemStyle: {
      //     normal: {
      //       color: "rgb(229,236,255)",
      //       width: "100%",
      //       fontSize: 10,
      //       barBorderRadius: 30,
      //     },
      //   },
      // },
    ],
  };
  option && myRankingEcharts.setOption(option);
};
// 获取危化品分类
const handleQueryClassChart = async (type) => {
  const params = {
    id: {
      selectTimeType: formData.selectTimeType ?? "",
      time: formData.time,
      timeList: formData.timeList,
      orgIds: formData.companySelects,
      serviceAreaIds: formData.serviceSelects,
      singleOrNot: formData.isWhole ? 2 : formData.isUnilateral ? 1 : 0,
    },
  };
  loading1.value = true;
  await getDngerQueryClassChart(params).then((res) => {
    classNewReportData.value = res.data;
    loading1.value = false;
  });
};
// echarts时段趋势排行
const timeTrendEcharts = async () => {
  await handleQueryTimeChart();
  var myRankingEcharts = echarts.init(
    document.getElementById("time_trend_echarts")
  ); // 指定图表的配置项和数据
  let option;
  // const colorList = ["#9E87FF", "#73DDFF", "#fe9a8b", "#F56948", "#9E87FF"];
  let timeTrendData = [];
  let timeTrendName = [
    "易燃易爆",
    "腐蚀品",
    "有毒品",
    "压缩气体和液化气体",
    "易燃液体",
    "易燃固体",
    "自燃物品和遇湿易燃物品",
    "放射性物品",
    "空车",
  ];
  timeTrendName.forEach((item, index) => {
    timeTrendData.push({
      name: item,
      type: "line",
      large: false,
      data: queryTimeChartData.value
        .filter((itm) => itm.dangerItemName == item)[0]
        ?.labels.map((itm) => {
          return {
            value: itm.dangerNum,
            rote: itm.dangerRate.toFixed(2),
          };
        }),
      symbol: "circle",
      symbolSize: 8,
      smooth: true,
      yAxisIndex: 0,
      showSymbol: false,
      lineStyle: {
        width: 5,
        shadowColor: "rgba(0,0,0, 0.1)",
        shadowBlur: 10,
        shadowOffsetY: 20,
      },
    });
  });
  const selectedState = {};
  timeTrendData.forEach((item, index) => {
    selectedState[item.name] = index < 3;
  });

  option = {
    title: {
      textStyle: {
        fontSize: 12,
        fontWeight: 400,
      },
      left: "center",
      top: "5%",
    },
    legend: {
      left: "left",
      icon: "circle",
      top: "2%",
      left: "3%",
      width: "60%",
      itemWidth: 6,
      itemGap: 14,
      height: "60%",
      textStyle: {
        color: "#556677",
      },
      selected: selectedState,
    },
    tooltip: {
      trigger: "axis",
      // trigger: "item", //鼠标悬停时显示
      axisPointer: {
        label: {
          show: true,
          backgroundColor: "#fff",
          color: "#556677",
          borderColor: "rgba(0,0,0,0)",
          shadowColor: "rgba(0,0,0,0)",
          shadowOffsetY: 0,
        },
        type: "line",
        // 悬停的原点尺寸修改

        lineStyle: {
          color: "#ccc", // 竖线颜色
          width: 1, // 竖线宽度
          type: "solid", // 线型（solid/dashed/dotted）
        },
        formatter: function (params) {
          return "6664";
        },
      },
      backgroundColor: "#fff",
      textStyle: {
        color: "#5c6c7c",
      },
      padding: [10, 10],
      extraCssText: "box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)",
      formatter: function (params) {
        console.log(params,'params');
        
        let result = `<div style="font-weight:bold;margin-bottom:5px;">${params[0].axisValue}</div>`;
        params.forEach((param) => {
          // 只显示当前选中的系列
          // if (
          //   param.seriesName in selectedState &&
          //   selectedState[param.seriesName]
          // ) {
            result += `
               <div style="display:flex;align-items:center;margin:3px 0;">
                 <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${param.color};margin-right:5px;"></span>
                  <span style="flex:1;">${param.seriesName}: ${param.data.value}</span>
                  <span style="color:#666;margin-left:10px;">占比: ${param.data.rote}%</span>
                </div>`;
          // }
        });
        return result;
      },
    },

    grid: {
      top: "15%",
    },
    xAxis: [
      {
        type: "category",
        data: [
          "00:00-06:00",
          "06:00-08:00",
          "08:00-10:00",
          "10:00-12:00",
          "12:00-14:00",
          "14:00-16:00",
          "16:00-18:00",
          "18:00-20:00",
          "20:00-22:00",
          "22:00-24:00",
        ],
        axisLine: {
          lineStyle: {
            color: "#DCE2E8",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          rotate: -40,
          textStyle: {
            color: "#556677",
          },
          // 默认x轴字体大小
          fontSize: 12,
          // margin:文字到x轴的距离
          margin: 15,
        },

        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        type: "value",
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#DCE2E8",
          },
        },
        axisLabel: {
          textStyle: {
            color: "#556677",
          },
        },
        splitLine: {
          show: true,
        },
      },
      {
        type: "value",
        position: "right",
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: "#556677",
          },
          formatter: "{value}",
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#DCE2E8",
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: timeTrendData,
  };
  // // 添加点击事件（带防抖）
  // const handleClick = debounce((params) => {
  //   // 获取像素坐标点
  //   const pointInPixel = [params.offsetX, params.offsetY];
  //   const { target, topTarget } = params;
  //   if (target?.z == 3 || topTarget?.z == 3) {
  //     let data = {
  //       name: params.name,
  //       value: params.value,
  //       time: formData.time,
  //       timeList: formData.timeList,
  //       companySelects: formData.companySelects,
  //       serviceSelects: formData.serviceSelects,
  //     };
  //     proxy.$Bus.emit("jumpAgency", { url: "/bas/dangerClass", data: data });
  //   }
  // }, 300);
  // myRankingEcharts.getZr().on("click", handleClick);
  option && myRankingEcharts.setOption(option);
};
// 获取时段趋势
const handleQueryTimeChart = async (type) => {
  const params = {
    // id: {
      selectTimeType: formData.selectTimeType ?? "",
      time: formData.time,
      timeList: formData.timeList,
      orgIds: formData.companySelects,
      serviceAreaIds: formData.serviceSelects,
      singleOrNot: formData.isWhole ? 2 : formData.isUnilateral ? 1 : 0,
    // },
  };
  loading2.value = true;
  await getQueryTimeChart(params).then((res) => {
    queryTimeChartData.value = res.data.records;
    loading2.value = false;
  });
};
// 路段联动
const railwayChange = (val) => {
  refresh();
};
// 查询联动
const companyChange = (val) => {
  refresh();
};
const seasonSelect = ref();
async function selectTimeTypeChange() {
  formData.time = "";
  formData.timeList = [];
  if (formData.selectTimeType == "0") {
    formData.time = moment().subtract(0, "day").format("YYYY-MM-DD");
  } else if (formData.selectTimeType == "1") {
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
      moment().format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD"),
    ];
  }
  page.value = 1;
  refresh();
}
const selectTimeChange = (val) => {
  refresh();
};
// 获取指定日期的那一周的开始、结束日期
function getWeekStartAndEnd(val) {
  let weekStart = val;
  let weekEnd = moment(val).add(6, "days").format("YYYY-MM-DD");
  return [weekStart, weekEnd];
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

const formData = reactive({
  selectTimeType: "0",
  isRoadAll: true, //全路网
  isCompany: false, // 公司
  isService: false, // 服务区
});
//全路网
const handleRoadAllChange = (event) => {
  if (event.target.checked) {
    formData.isRoadAll = true;
    formData.isCompany = false;
    formData.isService = false;
  }
  if (!event.target.checked) {
    event.target.checked = formData.isRoadAll = true;
  }
  formData.serviceSelects = [];
  formData.companySelects = [];
  refresh(1);
};
// 公司
const handleCompanyChange = (event) => {
  if (event.target.checked) {
    formData.isCompany = true;
    formData.isRoadAll = false;
    formData.isService = false;
  }
  if (!event.target.checked) {
    event.target.checked = formData.isCompany = true;
  }
  if (formData.isCompany) {
    formData.companySelects = [companyList.value[0].value];
  }
  formData.serviceSelects = [];
  refresh(2);
};
// 服务区
const handleServiceChange = (event) => {
  if (event.target.checked) {
    formData.isService = true;
    formData.isRoadAll = false;
    formData.isCompany = false;
  }
  if (!event.target.checked) {
    event.target.checked = formData.isService = true;
  }
  formData.companySelects = [];
  if (formData.isService) {
    formData.serviceSelects = [listOptions.serviceAreaList[0].value];
  }
  refresh(3);
};
const listOptions = reactive({
  serviceAreaList: [],
  statusList: [
    { label: "正常", value: "2" },
    { label: "异常", value: "1" },
  ],
  periodList: [],
});

// 获取字典数据
const getDictionary = () => {
  // 获取服务区
  getRoadLineServiceArea()
    .then(({ code, data }) => {
      if (code == 200) {
        listOptions.serviceAreaList = data.records;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  // 公司
  getCompany().then((res) => {
    companyList.value = res.data.records;
  });

  // 路线
  getRoadLineList().then((res) => {
    lineAll.value = res?.data?.records;
  });
};

// 排序字段
const orderColumn = ref({
  column: null,
  order: null,
});
onMounted(() => {
  formData.time = moment().subtract(0, "day").format("YYYY-MM-DD");
  refresh(1);
});
onActivated(() => {
  // refresh(1);
});
const refresh = (type) => {
  getDictionary();
  routeEcharts(type); //危化品分类
  timeTrendEcharts(); //时段趋势
};
</script>

<style lang="less" scoped>
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.this_page {
  .service_ranking_title_right {
    .el-radio-group {
      .el-radio__input {
        .el-radio__inner {
          width: 16px;
        }
      }
    }

    display: flex;
    .margin_right_10 {
      margin-right: 20px;
    }
    .service_ranking_title_right_item {
      display: flex;
      align-items: center;
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
      border: var(--checkbox-border-width) var(--checkbox-border-style)
        var(--checkbox-border-color);
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
      -webkit-box-shadow: 0 0 0 calc(var(--checkbox-diameter) / 2.5)
        var(--primary-color);
      box-shadow: 0 0 0 calc(var(--checkbox-diameter) / 2.5)
        var(--primary-color);
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
      -webkit-transform: translate(-50%, -50%) rotate(45deg)
        scale(var(--checkmark-size));
      -ms-transform: translate(-50%, -50%) rotate(45deg)
        scale(var(--checkmark-size));
      transform: translate(-50%, -50%) rotate(45deg)
        scale(var(--checkmark-size));
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

  .service_ranking {
    .service_ranking_title {
      display: flex;
      justify-content: space-between;
    }
  }
  .search_title_box {
    display: flex;
    align-items: center;
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
  .search_total {
    display: flex;
    align-items: center;
    background-color: #114484;
    color: #fff;
    padding: 4px;
    height: 24px;
    line-height: 24px;
    border-radius: 5px;
    margin-left: 6px;
    .num_icon {
      display: inline-block;
      width: 6px;
      height: 6px;
      background-color: #fff;
      border-radius: 50%;
      margin-right: 2px;
    }
  }
  .custom_form {
    // margin-bottom: 20px;

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
.margin_b_20 {
  margin-bottom: 20px;
}
</style>
