<!-- 危化品车辆排名 -->
<template>
  <div class="this_page">
    <!-- 筛选项 -->
    <div ref="searchRef">
      <div class="search_title margin_b_20">
        <i class="search_icon"></i>
        <el-text>危化品车辆排名</el-text>
      </div>
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
                <el-text>服务区排名前10</el-text>
              </div>
              <div class="service_ranking_title_right">
                <div class="service_ranking_title_right_item margin_right_10">
                  <span>整体</span>
                  <input type="checkbox" class="ui-checkbox" v-model="formData.isWhole" @change="handleWholeChange" />
                </div>
                <div class="service_ranking_title_right_item">
                  <span>单侧</span>
                  <input type="checkbox" class="ui-checkbox" v-model="formData.isUnilateral"
                    @change="handleUnilateralChange" />
                </div>
              </div>
            </div>
            <div id="service_ranking_echarts" style="width: 100%; height: 400px"></div>
          </div>
        </el-col>
        <el-col :span="12" v-loading="loading2">
          <div class="service_ranking">
            <div class="search_title">
              <i class="search_icon"></i>
              <el-text>路线排名前10</el-text>
            </div>
            <div id="route_ranking_echarts" style="width: 100%; height: 400px"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-loading="loading3">
        <el-col :span="12">
          <div class="service_ranking">
            <div class="search_title">
              <i class="search_icon"></i>
              <el-text>出发地排名前10</el-text>
            </div>
            <div id="set_out_ranking_echarts" style="width: 100%; height: 400px"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="service_ranking">
            <div class="search_title">
              <i class="search_icon"></i>
              <el-text>目的地排名前10</el-text>
            </div>
            <div id="destination_ranking_echarts" style="width: 100%; height: 400px"></div>
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
  onActivated,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  useTemplateRef,
  getCurrentInstance,
} from "vue";
import { ElLoading } from "element-plus";
import { DateQuarter } from "mam-base-ui";
import { getServiceArea } from "@/api/dictionaryApi.js";
import { exportData, exportFormatData } from "@/utils/common-features";
import { getCompany } from "@/api/informationServiceAreaApi.js";
import moment from "moment";
import { camelToSnake } from "@/utils/index";
import { getQueryPage, getRoadLineAllList } from "@/api/guestFlow/index.js";
// import { getRoadLineAllList} from "@/api/powerStation/index.js";
import {
  getServiceRanking,
  getRoadRouteRanking,
  getPlaceRanking,
} from "@/api/carRank/index.js";
import ExportDialog from "../../rmt/components/export-dialog/index.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const { proxy } = getCurrentInstance();

const loading1 = ref(false);
const loading2 = ref(false);
const loading3 = ref(false);
const exportShow = ref(false);
const timestamp = ref(new Date().getTime());
function closeModal() {
  exportShow.value = false;
}
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
const page = ref(1); // 当前页
const companyList = ref([]); // 公司下拉数据
const lineTree = ref([]); // 路段下拉数据
const lineAll = ref([]); // 路线下拉数据
// echarts服务区
const serviceRankingData = ref([]);
const rankingChart = ref(null);
const rankingEcharts = async (isWhole, isUnilateral) => {
  await handleServiceRanking(isWhole, isUnilateral); //获取服务区排名前10
  // 先销毁旧的实例
  if (rankingChart.value) {
    rankingChart.value.dispose();
  }
  
  rankingChart.value = echarts.init(
    document.getElementById("service_ranking_echarts")
  ); // 指定图表的配置项和数据
  // 点击跳转
  rankingChart.value.on("click", (params) => {
    let dataParam = {
      name: params.name,
      value: params.value,
      time: formData.time,
      timeList: formData.timeList,
      selectTimeType: formData.selectTimeType,
      serviceAreaIdList: params.data.serviceAreaIdList,
      startTime: params.data.startTime,
      endTime: params.data.endTime,
      carType:1
    };
    proxy.$Bus.emit("jumpAgency", {
      url: "/bas/dangerCar",
      data: dataParam,
    });
  });
  var data = serviceRankingData.value;
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
    attaData[index] = parseFloat(it.carNum);
    attaName[index] = it.stock;
    topName[index] = `${it.itemName}`;
    if (index == 0) {
      //金牌
      topName[index] = `🥇 ${it.itemName}`;
    } else if (index == 1) {
      //银牌
      topName[index] = `🥈 ${it.itemName}`;
    } else if (index == 2) {
      //铜牌
      topName[index] = `🥉 ${it.itemName}`;
    } else if (index == 3) {
      //铁牌
      topName[index] = `🏅 ${it.itemName}`;
    } else {
      topName[index] = ` ${index < 9 ? "0" : ""}${index + 1} ${it.itemName}`;
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
    serviceRankingData.value.forEach((itm, idx) => {
      sss[idx].serviceAreaIdList = itm.serviceAreaIdList;
      sss[idx].startTime = itm.startTime;
      sss[idx].endTime = itm.endTime;
    });
    return sss;
  }
  if (serviceRankingData.value.length > 0) {
    var option = {
      tooltip: {
        show: true,
        textStyle: {
          fontSize: 16,
        },
        formatter: function (params) {
          return (
            params.name + "<br/>" + "数量：" + params.value + "<br/>"
          );
        },
      },
      // color: ["#F7B731"],
      legend: {
        // pageIconSize: [12, 12],
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
        left: formData.isUnilateral ? "-14%" : "-8%",
        right: "0%",
        // width: "104%",
        bottom: "2%",
        top: "8%",
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
          //名称
          type: "category",
          inverse: true,
          offset: -10,
          position: "left",
          // axisLabel: {
          //   color: `#fff`,
          //   fontSize: 10,
          // },
          // 关键配置：使数据顶部对齐
          // boundaryGap: false, // 不保留两端空白

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
  option && rankingChart.value.setOption(option, true);
};
// 获取服务区排名前10
const handleServiceRanking = async (isWhole, isUnilateral) => {
  const params = {
    selectTimeType: formData.selectTimeType ?? "",
    time: formData.time,
    timeList: formData.timeList,
    singleOrNot: isWhole ? 2 : isUnilateral ? 1 : 0,
  };
  loading1.value = true;
  await getServiceRanking(params).then((res) => {
    serviceRankingData.value = res.data.records;
    loading1.value = false;
  });
};

// echarts路线
const roadRouteRanking = ref([]);
const routeEcharts = async () => {
  await handleRoadRouteRanking();
  var myRankingEcharts = echarts.init(
    document.getElementById("route_ranking_echarts")
  ); // 指定图表的配置项和数据
  // 点击跳转
  myRankingEcharts.on("click", (params) => {
    let data = {
      name: params.name,
      value: params.value,
      time: formData.time,
      timeList: formData.timeList,
      selectTimeType: formData.selectTimeType,
      startTime: params.data.startTime,
      endTime: params.data.endTime,
      highSpeed: params.data.highSpeed,
      carType:1
    };
    proxy.$Bus.emit("jumpAgency", { url: "/bas/dangerCar", data: data });
  });
  var data = roadRouteRanking.value;
  var attaData = [];
  var topName = [];
  data.forEach((it, index) => {
    attaData[index] = parseFloat(it.carNum);
    topName[index] = `${it.itemName}`;
  });
  var salvProMax = []; //背景按最大值
  for (let i = 0; i < attaData.length; i++) {
    salvProMax.push(attaData[0]);
  }
  function attackSourcesDataFmt(sData) {
    var sss = [];
    sData.forEach(function (item, i) {
      // let itemStyle = {
      //   color: attackSourcesColor[i],
      // };
      sss.push({
        value: item,
        // itemStyle: itemStyle,
      });
    });
    roadRouteRanking.value.forEach((itm, idx) => {
      sss[idx].highSpeed = itm.highSpeed;
      sss[idx].startTime = itm.startTime;
      sss[idx].endTime = itm.endTime;
    });
    return sss;
  }
  var option;
  if (roadRouteRanking.value.length > 0) {
    option = {
      title: {
        show: false,
      },
      tooltip: {
        show: true,
        textStyle: {
          fontSize: 16,
        },
        formatter: function (params) {
          console.log(params, "params");

          return (
            params.name + "<br/>" + "数量：" + params.value + "<br/>"
          );
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
        left: "2%",
        right: "2%",
        width: "100%",
        bottom: "2%",
        top: "8%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: [0, 8.01],
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          interval: 0, // 强制显示所有标签
          rotate: 30,
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
            type: "dashed",
            lineStyle: { color: "#f2f2f3" },
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
          barWidth: 8,
          showBackground: true,
          backgroundStyle: {
            color: "rgb(229,236,255)",
            borderRadius: [30, 30, 0, 0],
          },
          // animationDuration: 1500,
          data: attackSourcesDataFmt(attaData),
          align: "center",
          itemStyle: {
            normal: {
              color: "rgb(74,130,255)", // 直接指定颜色
              barBorderRadius: 10,
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
    option = {
      title: {
        show: true,
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
        show: false,
        borderWidth: 1,
        borderColor: "#ccc",
        left: "3%",
        right: "4%",
        bottom: "3%",
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
      series: [
        {
          type: "bar",
          data: [],
          barWidth: 20,
        },
      ],
    };
  }
  option && myRankingEcharts.setOption(option);
};
// 获取路线排名前10
const handleRoadRouteRanking = async () => {
  const params = {
    selectTimeType: formData.selectTimeType ?? "",
    time: formData.time,
    timeList: formData.timeList,
    singleOrNot: formData.isWhole ? 2 : formData.isUnilateral ? 1 : 0,
  };
  loading2.value = true;
  await getRoadRouteRanking(params).then((res) => {
    roadRouteRanking.value = res.data.records;
    loading2.value = false;
  });
};
// echarts出发地排行
const startPlaceRanking = ref([]); // echarts出发地排行
const setOutEcharts = async () => {
  await handlePlaceRanking(1);
  var myRankingEcharts = echarts.init(
    document.getElementById("set_out_ranking_echarts")
  ); // 指定图表的配置项和数据
  // 点击跳转
  // myRankingEcharts.getZr().off();
  myRankingEcharts.on("click", (params) => {
    let data = {
      name: params.name,
      value: params.value,
      time: formData.time,
      timeList: formData.timeList,
      selectTimeType: formData.selectTimeType,
      startTime: params.data.startTime,
      endTime: params.data.endTime,
      itemNameStart: params.data.itemName,
      carType:1
      
    };
    proxy.$Bus.emit("jumpAgency", { url: "/bas/dangerCar", data: data });
  });
  var data = startPlaceRanking.value;
  var attaData = [];
  var topName = [];
  data.forEach((it, index) => {
    attaData[index] = parseFloat(it.carNum);
    topName[index] = `${it.itemName}`;
  });
  var salvProMax = []; //背景按最大值
  for (let i = 0; i < attaData.length; i++) {
    salvProMax.push(attaData[0] + 50000);
  }
  function attackSourcesDataFmt(sData) {
    var sss = [];
    sData.forEach(function (item, i) {
      // let itemStyle = {
      //   color: attackSourcesColor[i],
      // };
      sss.push({
        value: item,
        // itemStyle: itemStyle,
      });
    });
    startPlaceRanking.value.forEach((itms, idxs) => {
      sss[idxs].itemName = itms.itemName;
      sss[idxs].startTime = itms.startTime;
      sss[idxs].endTime = itms.endTime;
    });
    return sss;
  }
  if (startPlaceRanking.value.length > 0) {
    var option = {
      title: {
        show: false,
      },
      tooltip: {
        show: true,
        textStyle: {
          fontSize: 16,
        },
        formatter: function (params) {
          return (
            params.name + "<br/>" + "数量：" + params.value + "<br/>"
          );
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
        right: "10%",
        width: "90%",
        bottom: "2%",
        top: "8%",
        containLabel: true,
      },
      xAxis: {
        type: "value",

        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
          interval: 0, // 强制显示所有标签
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: topName,
      },
      yAxis: [
        {
          //名称
          type: "category",
          inverse: true,

          splitLine: {
            show: true,
            type: "dashed", // 虚线
          },
          position: "left",
          axisLabel: {
            show: false,
            fontSize: 10,
          },
          axisLine: {
            //y轴
            show: true,
            //颜色
            lineStyle: {
              color: "#ccc",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            color: ["#000"],
          },
          data: topName,
        },
      ],
      series: [
        {
          zlevel: 1,
          type: "bar",
          barWidth: 10,
          data: attackSourcesDataFmt(attaData),
          align: "center",
          itemStyle: {
            color: "rgb(69,115,179)", // 直接指定颜色
          },
          label: {
            show: true,
            position: "right",
            fontSize: 12,
            color: "rgb(69,115,179)",
          },
        },
      ],
    };
  } else {
    var option = {
      title: {
        show: true,
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
        show: false,
        borderWidth: 1,
        borderColor: "#ccc",
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",

        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
          interval: 0, // 强制显示所有标签
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
          type: "category",
          inverse: true,

          splitLine: {
            show: true,
            type: "dashed", // 虚线
          },
          position: "left",
          axisLabel: {
            show: false,
            fontSize: 10,
          },
          axisLine: {
            //y轴
            show: true,
            //颜色
            lineStyle: {
              color: "#ccc",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            color: ["#000"],
          },
          data: topName,
        },
      ],
      // 空系列
      series: [
        {
          type: "bar",
          data: [],
          barWidth: 20,
        },
      ],
    };
  }
  option && myRankingEcharts.setOption(option);
};
// echarts目的地排行
const endPlaceRanking = ref([]); // echarts目的地排行
const destinationEcharts = async () => {
  await handlePlaceRanking(2);
  var myRankingEcharts = echarts.init(
    document.getElementById("destination_ranking_echarts")
  ); // 指定图表的配置项和数据
  // 点击跳转
  myRankingEcharts.on("click", (params) => {
    let data = {
      name: params.name,
      value: params.value,
      time: formData.time,
      timeList: formData.timeList,
      serviceAreaIdList: params.data.serviceAreaIdList,
      startTime: params.data.startTime,
      endTime: params.data.endTime,
      itemNameEnd: params.data.itemName,
      carType:1
    };
    proxy.$Bus.emit("jumpAgency", { url: "/bas/dangerCar", data: data });
  });
  var data = endPlaceRanking.value;
  function contains(arr, dst) {
    var i = arr.length;
    while ((i -= 1)) {
      if (arr[i] == dst) {
        return i;
      }
    }
    return false;
  }
  var attaData = [];
  var topName = [];
  data.forEach((it, index) => {
    attaData[index] = parseFloat(it.carNum);
    topName[index] = `${it.itemName}`;
  });
  var salvProMax = []; //背景按最大值
  for (let i = 0; i < attaData.length; i++) {
    salvProMax.push(attaData[0]);
  }
  function attackSourcesDataFmt(sData) {
    var sss = [];
    sData.forEach(function (item, i) {
      // let itemStyle = {
      //   color: attackSourcesColor[i],
      // };
      sss.push({
        value: item,
        // itemStyle: itemStyle,
      });
    });
    endPlaceRanking.value.forEach((itm, idx) => {
      sss[idx].itemName = itm.itemName;
      sss[idx].startTime = itm.startTime;
      sss[idx].endTime = itm.endTime;
    });
    return sss;
  }
  if (endPlaceRanking.value.length > 0) {
    var option = {
      title: {
        show: false,
      },
      tooltip: {
        show: true,
        textStyle: {
          fontSize: 16,
        },
        formatter: function (params) {
          return (
            params.name + "<br/>" + "数量：" + params.value + "<br/>"
          );
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
        right: "10%",
        width: "90%",
        bottom: "2%",
        top: "8%",
        containLabel: true,
      },
      xAxis: {
        type: "value",

        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
          interval: 0, // 强制显示所有标签
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: topName,
      },
      yAxis: [
        {
          //名称
          type: "category",
          inverse: true,

          splitLine: {
            show: true,
            type: "dashed", // 虚线
          },
          position: "left",
          axisLabel: {
            show: false,
            fontSize: 10,
          },
          axisLine: {
            //y轴
            show: true,
            //颜色
            lineStyle: {
              color: "#ccc",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            color: ["#000"],
          },
          data: topName,
        },
      ],
      series: [
        {
          zlevel: 1,
          type: "bar",
          barWidth: 10,
          data: attackSourcesDataFmt(attaData),
          align: "center",
          itemStyle: {
            color: "rgb(83,100,214)", // 直接指定柱子颜色
          },
          label: {
            show: true,
            position: "right",
            fontSize: 12,
            color: "rgb(83,100,214)",
          },
        },
      ],
    };
  } else {
    var option = {
      title: {
        show: true,
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
        show: false,
        borderWidth: 1,
        borderColor: "#ccc",
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },

      xAxis: {
        type: "value",

        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
          interval: 0, // 强制显示所有标签
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
          type: "category",
          inverse: true,

          splitLine: {
            show: true,
            type: "dashed", // 虚线
          },
          position: "left",
          axisLabel: {
            show: false,
            fontSize: 10,
          },
          axisLine: {
            //y轴
            show: true,
            //颜色
            lineStyle: {
              color: "#ccc",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            color: ["#000"],
          },
          data: topName,
        },
      ],
      // 空系列
      series: [
        {
          type: "bar",
          data: [],
          barWidth: 20,
        },
      ],
    };
  }
  option && myRankingEcharts.setOption(option);
};
// 获取出发地和目的地
const handlePlaceRanking = async (placeType) => {
  const params = {
    selectTimeType: formData.selectTimeType ?? "",
    time: formData.time,
    timeList: formData.timeList,
    singleOrNot: formData.isWhole ? 2 : formData.isUnilateral ? 1 : 0,
    placeType: placeType,
  };
  loading3.value = true;
  await getPlaceRanking(params).then((res) => {
    if (placeType == 1) {
      startPlaceRanking.value = res.data.records;
    }
    if (placeType == 2) {
      endPlaceRanking.value = res.data.records;
    }
    loading3.value = false;
  });
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

// 选择小时
const hourFormat = ref("YYYY-MM-DD HH");
function hourChange(data) {
  hourFormat.value = moment(data).format("YYYY-MM-DD日HH小时");
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
  demo: "1",
  isWhole: true, //整体
  isUnilateral: false, // 单侧
});
//
const handleWholeChange = (event) => {
  if (event.target.checked) {
    formData.isWhole = true;
    formData.isUnilateral = false;
  }
  if (!event.target.checked) {
    event.target.checked = formData.isWhole = true;
  }
  rankingEcharts(formData.isWhole, formData.isUnilateral);
};
const handleUnilateralChange = (event) => {
  if (event.target.checked) {
    formData.isUnilateral = true;
    formData.isWhole = false;
  }
  if (!event.target.checked) {
    event.target.checked = formData.isUnilateral = true;
  }
  rankingEcharts(formData.isWhole, formData.isUnilateral);
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
  getServiceArea()
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
  getRoadLineAllList().then((res) => {
    lineAll.value = res?.data?.records;
  });
};
onActivated(() => {
  refresh();
});
onMounted(() => {
  formData.time = moment().subtract(0, "day").format("YYYY-MM-DD");
});
// 刷新
const refresh = () => {
  rankingEcharts(formData.isWhole, formData.isUnilateral); //服务区
  routeEcharts(); //路线
  setOutEcharts(); //出发地排行
  destinationEcharts(); //目的地排行
};
</script>

<style lang="less" scoped>
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.this_page {
  .service_ranking {
    .service_ranking_title {
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

    .margin_right_10 {
      margin-right: 20px;
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

.margin_b_20 {
  margin-bottom: 20px;
}
</style>
