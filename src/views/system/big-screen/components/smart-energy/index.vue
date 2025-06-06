<!--
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2025-05-28 15:55:53
 * @LastEditors: ysl
 * @LastEditTime: 2025-06-06 18:38:16
-->
<template>
  <div class="smart-energy">
    <div class="smart-energy-left">
      <!-- 充电信息 -->
      <div class="smart-energy-left-item">
        <div class="item-top">充电信息</div>
        <TimeTypeSelector
          v-model="informationStatement.selectTimeType"
          @select="handleSelectInformation"
        />
        <div class="item-bottom">
          <div class="item-bottom-one">
            <div class="item-bottom-one-left">
              <div class="item-bottom-one-left-top" @click="handleChargeElec">
                {{ informationData.chargeElec }}
              </div>
              <div class="item-bottom-one-left-bottom">充电量kWh</div>
            </div>
            <div class="item-bottom-one-center" />
            <div class="item-bottom-one-right">
              <div class="item-bottom-one-right-top" @click="handleChargeNum">
                {{ informationData.chargeNum }}
              </div>
              <div class="item-bottom-one-right-bottom">充电次数</div>
            </div>
          </div>
          <div class="item-bottom-two">
            <div class="item-bottom-two-left">
              <div class="item-bottom-two-left-top" @click="handleChargeFee">
                {{ informationData.chargeFee }}
              </div>
              <div class="item-bottom-two-left-bottom">充电电费(元)</div>
            </div>
            <div class="item-bottom-two-center" />
            <div class="item-bottom-two-right">
              <div
                class="item-bottom-two-right-top"
                @click="handleChargeServiceFee"
              >
                {{ informationData.chargeServiceFee }}
              </div>
              <div class="item-bottom-two-right-bottom">充电服务费(元)</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 服务区充电排名 -->
      <div class="smart-energy-left-item">
        <div class="item-top">服务区充电排名</div>
        <TimeTypeSelector
          v-model="chargingRankingStatement.selectTimeType"
          @select="handleSelectChargingRanking"
        />
        <div class="item-bottom">
          <div
            id="charging_ranking_echarts"
            style="width: 100%; height: 260px"
          ></div>
        </div>
      </div>
      <!-- 加气信息 -->
      <div class="smart-energy-left-item">
        <div class="item-top">加气信息</div>
        <TimeTypeSelector
          v-model="informationAerate.selectTimeType"
          @select="handleSelectAerate"
        />
        <div class="item-bottom item-bottom-table scroll-wrapper">
          <AutoScrollTable
            :data="aerateData"
            :columns="columns"
            @row-click="handleAerateClick"
          />
        </div>
      </div>
    </div>
    <div class="smart-energy-center">
      <div class="smart-energy-center-header">
        <!-- 充电平均时长 -->
        <div class="center-header-item">
          <img
            src="../../images/smartEnergy/组 7804 (1).png"
            style="object-fit: left; width: 86px; height: 71px"
          />
          <div class="center-header-item-bottom">
            <div class="center-header-item-bottom-time">
              <span class="center-header-item-bottom-time-num">{{
                centerHeaderData.chargeTimeAvg
              }}</span>
              <span class="center-header-item-bottom-time-unit">分钟</span>
            </div>
            <div class="center-header-item-bottom-label">平均充电时长</div>
          </div>
        </div>
        <!-- 时长利用率 -->
        <div class="center-header-item">
          <img
            src="../../images/smartEnergy/组 7804 (2).png"
            style="object-fit: left; width: 86px; height: 71px"
          />
          <div class="center-header-item-bottom">
            <div class="center-header-item-bottom-time">
              <span class="center-header-item-bottom-time-num">{{
                centerHeaderData.chargeTimeRate
              }}</span>
              <span class="center-header-item-bottom-time-unit">%</span>
            </div>
            <div class="center-header-item-bottom-label">时长利用率</div>
          </div>
        </div>
        <div class="center-header-item">
          <img
            src="../../images/smartEnergy/组 7804 (3).png"
            style="object-fit: left; width: 86px; height: 71px"
          />
          <div class="center-header-item-bottom">
            <div class="center-header-item-bottom-time">
              <span class="center-header-item-bottom-time-num">{{
                centerHeaderData.capacityRate
              }}</span>
              <span class="center-header-item-bottom-time-unit">%</span>
            </div>
            <div class="center-header-item-bottom-label">容量利用率</div>
          </div>
        </div>
        <div class="center-header-item">
          <img
            src="../../images/smartEnergy/组 7804 (4).png"
            style="object-fit: left; width: 86px; height: 71px"
          />
          <div class="center-header-item-bottom">
            <div class="center-header-item-bottom-time">
              <span class="center-header-item-bottom-time-num">{{
                centerHeaderData.oilCarNumber
              }}</span>
            </div>
            <div class="center-header-item-bottom-label">加油车次</div>
          </div>
        </div>
        <div class="center-header-item">
          <img
            src="../../images/smartEnergy/组 7804 (5).png"
            style="object-fit: left; width: 86px; height: 71px"
          />
          <div class="center-header-item-bottom">
            <div class="center-header-item-bottom-time">
              <span class="center-header-item-bottom-time-num">{{
                centerHeaderData.gasNumber
              }}</span>
            </div>
            <div class="center-header-item-bottom-label">加气量</div>
          </div>
        </div>
        <div class="center-header-item">
          <img
            src="../../images/smartEnergy/组 7804 (6).png"
            style="object-fit: left; width: 86px; height: 71px"
          />
          <div class="center-header-item-bottom">
            <div class="center-header-item-bottom-time">
              <span class="center-header-item-bottom-time-num">{{
                centerHeaderData.exNumber
              }}</span>
            </div>
            <div class="center-header-item-bottom-label">换电车次</div>
          </div>
        </div>
        <div class="center-header-item">
          <img
            src="../../images/smartEnergy/组 7804 (7).png"
            style="object-fit: left; width: 86px; height: 71px"
          />
          <div class="center-header-item-bottom">
            <div class="center-header-item-bottom-time">
              <span class="center-header-item-bottom-time-num">{{
                centerHeaderData.photovoltaicNumber
              }}</span>
            </div>
            <div class="center-header-item-bottom-label">光伏发电量</div>
          </div>
        </div>
      </div>
      <div class="search-box">
        <div class="search-input-box">
          <input
            type="text"
            class="input"
            v-model="serviceParams.serviceAreaName"
            placeholder="服务区搜索"
          />
          <div class="box-btn" @click="getServiceListData"></div>
        </div>
      </div>
      <div class="center-bottom" style="height: 99vh">
        <Map
          ref="mapRef"
          @markerClick="markerClick"
          @map-loaded="mapLoaded"
          :smartEnergy="smartEnergy"
        />
      </div>
    </div>
    <div class="smart-energy-right">
      <div class="smart-energy-right-item">
        <div class="item-top">加油站排名</div>
        <TimeTypeSelector
          v-model="comeOnStatement.selectTimeType"
          @select="handleSelectComeOn"
        />
        <div class="item-bottom">
          <div id="come_on_echarts" style="width: 100%; height: 260px"></div>
        </div>
      </div>
      <div class="smart-energy-right-item">
        <div class="item-top">换电信息</div>
        <TimeTypeSelector
          v-model="replaceBatteryStatement.selectTimeType"
          @select="handleSelectReplaceBattery"
        />
        <div class="item-bottom item-bottom-table scroll-wrapper">
          <AutoScrollTable
            :data="replaceBatteryData"
            :columns="replaceBatteryColumns"
            @row-click="replaceBatteryClick"
          />
        </div>
      </div>
      <div class="smart-energy-right-item">
        <div class="item-top">光伏发电信息</div>
        <TimeTypeSelector
          v-model="photovoltaicStatement.selectTimeType"
          @select="handleSelectPhotovoltaic"
        />
        <div class="item-bottom item-bottom-table scroll-wrapper">
          <AutoScrollTable
            :data="photovoltaicData"
            :columns="photovoltaicColumns"
            @row-click="photovoltaicClick"
          />
        </div>
      </div>
    </div>
    <SmartEnergyGisDialog
      v-model:visible="showDialog"
      :station-data="chargeStationData"
      :sub-title="subTitle"
      :loading="loading"
      style="background: rgba(17, 47, 73, 0.7); border: 2px solid #3ee5fa"
    />
  </div>
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
} from "vue";
import { useRouter } from "vue-router";
// import ChongQingMap from "../map/index.vue";
import Map from "@/components/map/index.vue";
import TimeTypeSelector from "../time-type-selector/index.vue";
import AutoScrollTable from "../auto-scroll-table/index.vue";
import SmartEnergyGisDialog from "../smart-energy-gis-dialog/index.vue";
import * as echarts from "echarts";
import {
  getSmartEnergyLocation,
  getYesterdaySmartEnergyInfo, // GIS上方数据
  getChargeInfoByTime, // 充电信息
  getChargeRankingByServiceFullName, // 服务区充电排名
  getAirRankingByServiceFullName, // 加气排名
  getOilCarNumberRankingByServiceFullName, // 加油站排名
  getExNumberRankingByServiceFullName, // 换电信息
  getPhotovoltaicRankingByServiceFullName, // 光伏发电
  getSmartEnergyChargeStation, // 充电站详情信息
  getSmartEnergyOil, // 加油站详情信息
  getSmartEnergyEX, // 换电站详情信息
  getSmartEnergyAir, // 加气站详情信息
  getSmartEnergyGF, // 光伏发电详情信息
} from "@/api/bigScreen/index.js";
import { bigScreen } from "@/store/bigScreen";
import router from "@/router";
import { doGet } from "@/utils/requestUtils";

const { proxy } = getCurrentInstance();

const input = ref("");

const showDialog = ref(false);

const chargeStationData = ref({});
const loading = ref(false);
const subTitle = ref("");
const smartEnergy = ref("smartEnergy");
const photoUrls = ref([]);
const markerClick = async (item) => {
  const typeMap = {
    1: {
      api: getSmartEnergyChargeStation,
      title: "充电站",
    },
    2: {
      api: getSmartEnergyOil,
      title: "加油站",
    },
    3: {
      api: getSmartEnergyEX,
      title: "换电站",
    },
    4: {
      api: getSmartEnergyAir,
      title: "加气站",
    },
    5: {
      api: getSmartEnergyGF,
      title: "光伏发电",
    },
  };
  const config = typeMap[item.type];

  showDialog.value = true;
  loading.value = true; // 开始加载
  let res;
  // 充电站

  if (config) {
    res = await config.api({ serviceAreaName: item.serviceAreaName });
    subTitle.value = config.title;
  }
  const stationData = res.data?.records[0] || {};
  console.log(stationData, "stationData");

  let data = {
    ...item,
    ...stationData,
  };

  if (item.type == 1) {
    const stationPhotos = stationData.stationPhotos;
    const photoUrls = stationPhotos
      ? stationPhotos
          .split(",")
          .map(
            (id) =>
              process.env.VUE_APP_API_HOST_URL +
              process.env.VUE_APP_API_BASE_URL +
              `/pub/common/file/download?service=basServiceStationFileServiceImpl&id=${id}`
          )
      : [];
    // const photoUrls =
    //   "http://192.168.100.124:18020/api/pub/common/file/download?service=basServiceAreaInfoFileServiceImpl&id=1930539113259704321";
    const processedPaymentMethods = parsePaymentMethods(
      stationData.paymentMethods
    );

    chargeStationData.value = {
      img: photoUrls,
      paymentMethods: processedPaymentMethods,
      ...data,
    };
  }
  if (item.type != "1") {
    chargeStationData.value = data;
  }
  loading.value = false; // 加载结束
};
const parsePaymentMethods = (input) => {
  if (!input) return [];

  if (Array.isArray(input)) return input;

  try {
    if (typeof input === "string" && input.trim().startsWith("[")) {
      return JSON.parse(input);
    }

    return input
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  } catch (e) {
    console.warn("支付方式解析失败，使用原始值:", input);
    return [input];
  }
};
const getPhotoUrl = async (id) => {
  try {
    const res = await doGet(
      `/pub/common/file/download?service=basServiceStationFileServiceImpl&id=${id}`,
      {}, // GET 请求不需要 data
      { responseType: "blob" } // 如果是图片文件
    );
    const blob = new Blob([res], { type: res.type || "image/png" });
    const blobUrl = URL.createObjectURL(blob);
    console.log(blobUrl, "blobUrl");
    return blobUrl;
  } catch (e) {
    console.error("获取图片失败", e);
    return "";
  }
};

//顶部数据
const centerHeaderData = reactive({
  chargeTimeAvg: 0, //平均充电时长
  chargeTimeRate: 0, //时长利用率
  capacityRate: 0, //容量利用率
  oilCarNumber: 0, //加油车次
  gasNumber: 0, //加气量
  exNumber: 0, //换电次数
  photovoltaicNumber: 0, //光伏发电量
});

const getCenterHeaderData = async () => {
  const res = await getYesterdaySmartEnergyInfo();

  const data = res.data.records[0] || {};
  // 响应式赋值
  centerHeaderData.chargeTimeAvg = data.chargeTimeAvg || 0;
  centerHeaderData.chargeTimeRate = data.chargeTimeRate || 0;
  centerHeaderData.capacityRate = data.capacityRate || 0;
  centerHeaderData.oilCarNumber = data.oilCarNumber || 0;
  centerHeaderData.gasNumber = data.gasNumber || 0;
  centerHeaderData.exNumber = data.exNumber || 0;
  centerHeaderData.photovoltaicNumber = data.photovoltaicNumber || 0;
};

const mapRef = ref();
// 地图数据
const mapData = ref([]);
const serviceParams = reactive({
  serviceAreaName: "", //服务区名称
});
const mapEcharts = async () => {
  await mapLoaded();
};

const getServiceListData = async () => {
  await mapLoaded(serviceParams);
};

const mapLoaded = async (params) => {
  const res = await getSmartEnergyLocation(params);
  mapData.value = res.data.records;
  // const list = [
  //   {
  //     type: "5",
  //     serviceAreaName: "垫江服务区（进城）",
  //     lng: 108.232755,
  //     lat: 30.45502,
  //   },
  // ];
  const deepCopiedRecords = JSON.parse(JSON.stringify(res.data.records));
  // console.log(deepCopiedRecords, "deepCopiedRecords");

  // 转换为统一格式
  const list = [];
  deepCopiedRecords.forEach((item) => {
    if (
      item.chargeStationBeanList &&
      item.chargeStationBeanList.csLng != null &&
      item.chargeStationBeanList.csLat != null
    ) {
      list.push({
        type: "1",
        lng: Number(item.chargeStationBeanList.csLng),
        lat: Number(item.chargeStationBeanList.csLat),
        serviceAreaName: item.chargeStationBeanList.stationName,
      });
    }
    if (
      item.oilBean &&
      item.oilBean.oilLng != null &&
      item.oilBean.oilLat != null
    ) {
      list.push({
        type: "2",
        lng: Number(item.oilBean.oilLng),
        lat: Number(item.oilBean.oilLat),
        serviceAreaName: item.oilBean.oilName,
      });
    }
    if (
      item.airBean &&
      item.airBean.airLng != null &&
      item.airBean.airLat != null
    ) {
      list.push({
        type: "3",
        lng: Number(item.airBean.airLng),
        lat: Number(item.airBean.airLat),
        serviceAreaName: item.airBean.airName,
      });
    }
    if (item.exBean && item.exBean.exLng != null && item.exBean.exLat != null) {
      list.push({
        type: "4",
        lng: Number(item.exBean.exLng),
        lat: Number(item.exBean.exLat),
        serviceAreaName: item.exBean.exName,
      });
    }
    if (item.gfBean && item.gfBean.gfLng != null && item.gfBean.gfLat != null) {
      list.push({
        type: "5",
        lng: Number(item.gfBean.gfLng),
        lat: Number(item.gfBean.gfLat),
        serviceAreaName: item.gfBean.gfName,
      });
    }
  });
  // console.log(list, "=======================");
 if (params) {
    mapRef.value.removeAllMarkers();
  }
  mapRef.value.setMarkers(list);
};

/* 充电信息:information */
const informationStatement = reactive({
  selectTimeType: "0",
});

const informationData = reactive({
  chargeElec: 0,
  chargeNum: 0,
  chargeFee: 0,
  chargeServiceFee: 0,
});

const informationEcharts = async (timeType) => {
  const params = {
    selectTimeType: timeType.code || "0",
    timeList: timeType.code === "6" ? timeType.dateRange : [],
  };
  console.log(params, "params");

  const res = await getChargeInfoByTime(params);
  const data = res.data.records[0] || {};
  // 响应式赋值
  informationData.chargeElec = data.chargeElec || 0;
  informationData.chargeNum = data.chargeNum || 0;
  informationData.chargeFee = data.chargeFee || 0;
  informationData.chargeServiceFee = data.chargeServiceFee || 0;
};

function handleSelectInformation(payload) {
  informationStatement.selectTimeType = payload.code;
  if (payload.code === "6") {
    // 获取到时间
    informationStatement.dateRange = payload.dateRange || [];
  }
  informationEcharts(payload);
}

// 数字点击事件
// 充电电量
const handleChargeElec = () => {
  const data = { ...informationStatement, ...informationData };
  router.push({
    path: "/rmt/chargeReportServiceArea",
    query: data,
  });
  const store = bigScreen();
  store.setData(data);
  // proxy.$Bus.emit("jumpAgency", {
  //   url: "/rmt/chargeReportServiceArea",
  // data: data,
  // });
  router.push({
    path: "/rmt/chargeReportServiceArea",
    query: data,
  });
};

// 充电次数
const handleChargeNum = () => {
  const data = { ...informationStatement, ...informationData };
  const store = bigScreen();
  store.setData(data);
  proxy.$Bus.emit("jumpAgency", {
    url: "/rmt/chargeReportServiceArea",
    // data: data,
  });
};

// 充电费用
const handleChargeFee = () => {
  const data = { ...informationStatement, ...informationData };
  const store = bigScreen();
  store.setData(data);
  proxy.$Bus.emit("jumpAgency", {
    url: "/rmt/chargeReportServiceArea",
    // data: data,
  });
};

// 充电服务费
const handleChargeServiceFee = () => {
  const data = { ...informationStatement, ...informationData };
  const store = bigScreen();
  store.setData(data);
  proxy.$Bus.emit("jumpAgency", {
    url: "/rmt/chargeReportServiceArea",
    // data: data,
  });
};

/* 充电排名: chargingRanking */
const chargingRankingStatement = reactive({
  selectTimeType: "0",
  dateRange: [],
});

const chargingRankingData = ref([]);

// 获取服务区充电排名
const getChargingRanking = async (payload) => {
  const params = {
    selectTimeType: payload.code,
    timeList: payload.code === "6" ? payload.dateRange : [],
  };
  const res = await getChargeRankingByServiceFullName(params);
  chargingRankingData.value = res.data.records;
};

let chargingRankingChart = null;
let scrollTimer = null;
const chargingRankingEcharts = async (payload) => {
  await getChargingRanking(payload);

  const chartDom = document.getElementById("charging_ranking_echarts");
  if (!chartDom) return;

  if (!chargingRankingChart) {
    chargingRankingChart = echarts.init(chartDom);
  } else {
    chargingRankingChart.clear();
  }

  const totalData = chargingRankingData.value || [];
  let startIndex = 0;
  const displayCount = 6;

  // 更新图表方法
  const updateChart = () => {
    const visibleData = totalData.slice(startIndex, startIndex + displayCount);
    const names = visibleData.map((item) => item.serviceFullName);
    const values = visibleData.map((item) => item.chargeElec);

    const option = {
      grid: {
        left: 100,
        right: 40,
        bottom: 40,
        top: 20,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      xAxis: {
        type: "value",
        axisLine: { show: false }, // 隐藏轴线
        axisTick: { show: false }, // 隐藏刻度线
        axisLabel: { show: false }, // 隐藏刻度文字
        splitLine: { show: false },
      },
      yAxis: {
        type: "category",
        data: names,
        axisLine: { lineStyle: { color: "#293648" } },
        axisTick: {
          show: true,
          lineStyle: {
            color: "#293648", // 刻度线颜色
          },
          length: 3, // 刻度线长度，3px
          alignWithLabel: true, // 刻度线对齐刻度标签
        },
        axisLabel: {
          color: "#fff",
          fontSize: 12,
          fontWeight: "normal", // 或 bold
          margin: 8,
          rotate: 30,
        },
      },
      series: [
        {
          type: "bar",
          data: values,
          barWidth: 10,
          barCategoryGap: "5%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#0d488d" },
              { offset: 0.5, color: "#38a7c7" },
              { offset: 1, color: "#5cf5f6" },
            ]),
          },
          label: {
            show: true,
            position: "right", // 在柱条右侧显示数值
            color: "#fff", // 文本颜色
            fontSize: 14, // 字体大小
            formatter: "{c}", // 显示值（{c} 代表当前值）
          },
        },
      ],
    };

    chargingRankingChart.setOption(option);

    chargingRankingChart.off("click"); // 防止多次绑定
    chargingRankingChart.on("click", (params) => {
      const clickedIndex = params.dataIndex + startIndex;
      const clickedData = totalData[clickedIndex];
      const data = { ...clickedData, ...chargingRankingStatement };
      const store = bigScreen();
      store.setData(data);
      proxy.$Bus.emit("jumpAgency", {
        url: "/rmt/chargeReportServiceArea",
        // data: data,
      });
      console.log("点击了：", data);
    });
  };

  const startScroll = () => {
    stopScroll(); // 避免重复
    if (totalData.length <= displayCount) return;

    scrollTimer = setInterval(() => {
      startIndex++;
      if (startIndex + displayCount > totalData.length) {
        startIndex = 0;
      }
      updateChart();
    }, 3000);
  };

  const stopScroll = () => {
    if (scrollTimer) {
      clearInterval(scrollTimer);
      scrollTimer = null;
    }
  };

  updateChart();
  startScroll();

  // 鼠标悬停控制
  chartDom.onmouseenter = stopScroll;
  chartDom.onmouseleave = startScroll;
};

function handleSelectChargingRanking(payload) {
  chargingRankingStatement.selectTimeType = payload.code;
  if (payload.code === "6") {
    chargingRankingStatement.dateRange = payload.dateRange || [];
  }
  chargingRankingEcharts(payload);
}

/* 加气信息:aerate */
const informationAerate = reactive({
  selectTimeType: "0",
  dateRange: [],
});

const aerateData = ref([]);
const columns = [
  { label: "服务区名称", prop: "serviceFullName" },
  { label: "加气量(吨)", prop: "gasNumber" },
  { label: "加气金额(元)", prop: "gasCost" },
];

const getAerateTabel = async (payload) => {
  const params = {
    selectTimeType: payload.code,
    timeList: payload.code === "6" ? payload.dateRange : [],
  };
  const res = await getAirRankingByServiceFullName(params);
  aerateData.value = res.data.records;
};

const handleSelectAerate = (payload) => {
  informationAerate.selectTimeType = payload.code;
  if (payload.code === "6") {
    informationAerate.dateRange = payload.dateRange || [];
  }
  getAerateTabel(payload);
};

const handleAerateClick = (item) => {
  const data = { ...item, ...informationAerate };
  const store = bigScreen();
  store.setData(data);
  proxy.$Bus.emit("jumpAgency", {
    url: "/daily/dailyIncome",
    // data: data,
  });
};

/* 右侧展示 */

/* 加油站排名:comeOn */
const comeOnStatement = reactive({
  selectTimeType: "0",
  dateRange: [],
});

const comeOnData = ref([]);

// 获取加油站排名
const getComeOn = async (payload) => {
  const params = {
    selectTimeType: payload.code,
    timeList: payload.code === "6" ? payload.dateRange : [],
  };
  const res = await getOilCarNumberRankingByServiceFullName(params);
  comeOnData.value = res.data.records;
};

// 生成ECharts
let comeOnChart = null;
let comeOnScrollTimer = null;
const comeOnEcharts = async (payload) => {
  await getComeOn(payload);
  const comeOnDom = document.getElementById("come_on_echarts");
  if (!comeOnDom) return;

  if (!comeOnChart) {
    comeOnChart = echarts.init(comeOnDom);
  } else {
    comeOnChart.clear();
  }

  const totalData = comeOnData.value || [];
  let startIndex = 0;
  const displayCount = 6;

  // 更新图表方法
  const updateChart = () => {
    const visibleData = totalData.slice(startIndex, startIndex + displayCount);
    const names = visibleData.map((item) => item.serviceFullName);
    const values = visibleData.map((item) => item.oilCarNumber);

    const option = {
      grid: {
        left: 100,
        right: 40,
        bottom: 40,
        top: 20,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      xAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        type: "category",
        data: names,
        axisLine: { lineStyle: { color: "#293648" } },
        axisTick: {
          show: true,
          lineStyle: { color: "#293648" },
          length: 3,
          alignWithLabel: true,
        },
        axisLabel: {
          color: "#fff",
          fontSize: 12,
          fontWeight: "normal",
          margin: 8,
          rotate: 30,
        },
      },
      series: [
        {
          type: "bar",
          data: values,
          barWidth: 10,
          barCategoryGap: "5%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#0d488d" },
              { offset: 0.5, color: "#38a7c7" },
              { offset: 1, color: "#5cf5f6" },
            ]),
          },
          label: {
            show: true,
            position: "right",
            color: "#fff",
            fontSize: 14,
            formatter: "{c}",
          },
        },
      ],
    };

    comeOnChart.setOption(option);
    comeOnChart.off("click"); // 防止多次绑定
    comeOnChart.on("click", (params) => {
      const clickedIndex = params.dataIndex + startIndex;
      const clickedData = totalData[clickedIndex];
      const data = { ...clickedData, ...comeOnStatement };
      const store = bigScreen();
      store.setData(data);
      proxy.$Bus.emit("jumpAgency", {
        url: "/daily/dailyIncome",
        // data: data,
      });
      console.log("点击了：", data);
    });
  };

  const stopScroll = () => {
    if (comeOnScrollTimer) {
      clearInterval(comeOnScrollTimer);
      comeOnScrollTimer = null;
    }
  };

  const startScroll = () => {
    stopScroll();
    if (totalData.length <= displayCount) return;

    comeOnScrollTimer = setInterval(() => {
      startIndex++;
      if (startIndex + displayCount > totalData.length) {
        startIndex = 0;
      }
      updateChart();
    }, 3000);
  };

  updateChart();
  startScroll();

  // 鼠标悬停控制
  comeOnDom.onmouseenter = stopScroll;
  comeOnDom.onmouseleave = startScroll;
};

// 切换日期时间
const handleSelectComeOn = (payload) => {
  comeOnStatement.selectTimeType = payload.code;
  if (payload.code === "6") {
    comeOnStatement.dateRange = payload.dateRange || [];
  }
  comeOnEcharts(payload);
};

/* 换电信息:ReplaceBattery */
const replaceBatteryStatement = reactive({
  selectTimeType: "0",
  dateRange: [],
});

const replaceBatteryData = ref([]);

const replaceBatteryColumns = [
  { label: "服务区名称", prop: "serviceFullName" },
  { label: "小车换电(辆)", prop: "exPassengerNumber" },
  { label: "重卡换电(辆)", prop: "exTruckNumber" },
];

const getReplaceBatteryTabel = async (payload) => {
  const params = {
    selectTimeType: payload.code,
    timeList: payload.code === "6" ? payload.dateRange : [],
  };
  const res = await getExNumberRankingByServiceFullName(params);
  replaceBatteryData.value = res.data.records;
};

const handleSelectReplaceBattery = (payload) => {
  replaceBatteryStatement.selectTimeType = payload.code;
  if (payload.code === "6") {
    replaceBatteryStatement.dateRange = payload.dateRange || [];
  }
  getReplaceBatteryTabel(payload);
};

const replaceBatteryClick = (item) => {
  console.log("点击项数据换电信息:", item);
  const data = { ...item, ...replaceBatteryStatement };
  const store = bigScreen();
  store.setData(data);
  proxy.$Bus.emit("jumpAgency", {
    url: "/daily/dailyIncome",
    // data: data,
  });
};

/* 光伏发电信息:photovoltaic */
const photovoltaicStatement = reactive({
  selectTimeType: "0",
  dateRange: [],
});

const photovoltaicData = ref([]);

const photovoltaicColumns = [
  { label: "服务区名称", prop: "serviceFullName" },
  { label: "发电量(kWh)", prop: "photovoltaicNumber" },
  { label: "发电时长(h)", prop: "photovoltaicTime" },
];

const getPhotovoltaicTabel = async (payload) => {
  const params = {
    selectTimeType: payload.code,
    timeList: payload.code === "6" ? payload.dateRange : [],
  };
  const res = await getPhotovoltaicRankingByServiceFullName(params);
  photovoltaicData.value = res.data.records;
};

const handleSelectPhotovoltaic = (payload) => {
  photovoltaicStatement.selectTimeType = payload.code;
  if (payload.code === "6") {
    photovoltaicStatement.dateRange = payload.dateRange || [];
  }
  getPhotovoltaicTabel(payload);
};

const photovoltaicClick = (item) => {
  const data = { ...item, ...photovoltaicStatement };
  const store = bigScreen();
  store.setData(data);
  proxy.$Bus.emit("jumpAgency", {
    url: "/daily/dailyIncome",
    // data: data,
  });
};

// 刷新
const refresh = () => {
  getCenterHeaderData(); // 中心头部
  mapEcharts(); // 地图
  informationEcharts(informationStatement.selectTimeType); // 充电信息
  chargingRankingEcharts({
    code: chargingRankingStatement.selectTimeType,
  }); // 服务区充电
  getAerateTabel({
    code: informationAerate.selectTimeType,
  }); // 加气
  comeOnEcharts({
    code: comeOnStatement.selectTimeType,
  }); // 加油站排名
  getReplaceBatteryTabel({
    code: replaceBatteryStatement.selectTimeType,
  }); // 换电信息
  getPhotovoltaicTabel({
    code: photovoltaicStatement.selectTimeType,
  }); // 光伏发电
  console.log("调用");
};

onActivated(() => {
  refresh();
});

// 暴露给父组件
defineExpose({ refresh });
</script>
<style scoped>
.smart-energy {
  display: flex;
  height: calc(100% - 94px);
  width: 100%;
  color: #fff;
  margin-top: -117px;
  padding: 0px 2px;
}

.smart-energy-left,
.smart-energy-right {
  width: 460px;
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
  background: url("../../images/smartEnergy/tit_bg.png") no-repeat;
  background-position: center 0;
  position: relative;
}

.item-top {
  flex: 1;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  margin-top: 8px;
  margin-left: 5.75rem;
}

.item-bottom {
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #fff;
  gap: 2px; /* 可以加点间距，看效果 */
}

.item-bottom-one {
  flex: 1;
  background: url("../../images/smartEnergy/item603(1).png") no-repeat center
    center;
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
  cursor: pointer;
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
  cursor: pointer;
}

.item-bottom-one-right-bottom {
  font-weight: 500;
  color: #40abd8;
}

.item-bottom-two {
  flex: 1;
  background: url("../../images/smartEnergy/item603.png") no-repeat center
    center;
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
  cursor: pointer;
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
  cursor: pointer;
}

.item-bottom-two-right-bottom {
  font-weight: 500;
  color: #40abd8;
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
}

.center-bottom {
  flex: 1; /* 剩余空间全给它 */
  position: relative;
  overflow: hidden;
  margin-top: 10px;
}

.smart-energy-center-header {
  height: 210px;
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
  justify-content: center;
  align-items: center;
}

.center-header-item-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 上下贴靠 */
  margin-top: 8px;
  margin-left: 12px;
}

.center-header-item-bottom-time {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px; /* 控制和下方文字的间距 */
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

.search-box {
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  margin-top: 26px;
}

.search-input-box {
  width: 190px;
  height: 41px;
  box-sizing: border-box;
  border: 1px solid #5bc7fc;
  margin-left: 19px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input {
  height: 39px;
  width: 143px;
  padding: 5px 10px;
  box-sizing: border-box;
  font-size: 14px;
  color: #fff;
  background: transparent;
  border: 0;
}

.input::placeholder {
  color: #fff;
}

.box-btn {
  width: 40px;
  height: 41px;
  background: url("../../images/manage/search.png") 4px center no-repeat;
  background-size: 18px 18px;
  cursor: pointer;
}
</style>
