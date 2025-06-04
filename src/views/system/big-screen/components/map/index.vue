<template>
  <div ref="chartRef" style="width: 100%; height: 100vh; position: relative">
    <div v-if="showBack" class="back-button" @click="goBack">返回重庆市</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import chongqingMap from "@/views/system/big-screen/components/map/json/chongqing.json";

const props = defineProps({
  mapData: {
    type: Array,
    default: () => [],
  },
});

const chartRef = ref(null);
const isMounted = ref(false);
let chartInstance = null;
let timer = null;
let index = -1;

const currentMap = ref(chongqingMap);
const currentMapName = ref("重庆");
const showBack = ref(false);

const getPointData = (data) =>
  data
    .filter((item) => item.csLng && item.csLat)
    .map((item) => ({
      name: item.serviceAreaName,
      value: [Number(item.csLng), Number(item.csLat), 1],
      itemStyle: {
        color: "#ffcc00",
      },
      label: {
        show: true,
        formatter: item.serviceAreaName,
        color: "#fff",
        fontSize: 12,
        distance: 10,
      },
    }));

const startLoop = (points) => {
  clearInterval(timer);
  index = -1;
  timer = setInterval(() => {
    chartInstance.dispatchAction({
      type: "hideTip",
      seriesIndex: 0,
      dataIndex: index,
    });
    chartInstance.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex: index,
    });

    index = (index + 1) % points.length;

    chartInstance.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: index,
    });
    chartInstance.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: index,
    });
  }, 2000);
};

const stopLoop = () => {
  clearInterval(timer);
};
const mockPointData = [
  {
    serviceAreaName: "测试服务区A",
    csLng: 106.5516,
    csLat: 29.563,
    value: 10,
  },
  {
    serviceAreaName: "测试服务区B",
    csLng: 106.6,
    csLat: 29.57,
    value: 15,
  },
  {
    serviceAreaName: "测试服务区C",
    csLng: 106.58,
    csLat: 29.55,
    value: 8,
  },
];

const initChart = (mapData) => {
  if (!chartRef.value) return;

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }

  echarts.registerMap(currentMapName.value, currentMap.value);

  // const pointData = getPointData(mapData);

  const pointData = getPointData(mockPointData);

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      show: true,
      formatter: (params) =>
        `${params.name || ""}：困难人数 ${params.value[2]}`,
    },
    geo3D: {
      map: currentMapName.value,
      boxHeight: 8,
      regionHeight: 3,
      shading: "realistic",
      realisticMaterial: {
        roughness: 0.8,
        metalness: 0,
      },
      light: {
        main: { intensity: 1, shadow: true },
        ambient: { intensity: 0.3 },
      },
      itemStyle: {
        color: "#1d7bbf",
        borderWidth: 0.6,
        borderColor: "#2ab8ff",
      },
      emphasis: {
        label: { show: false },
        itemStyle: {
          color: "#2AB8FF",
        },
      },
      viewControl: {
        distance: 120,
        panMouseButton: "left",
      },
    },
    series: [
      {
        type: "scatter3D",
        coordinateSystem: "geo3D",
        data: pointData,
        symbolSize: 12,
        emphasis: {
          itemStyle: {
            color: "#ffff00",
          },
        },
      },
    ],
  };

  chartInstance.setOption(option);

  chartInstance.on("mousemove", (e) => {
    stopLoop();
    chartInstance.dispatchAction({ type: "downplay", seriesIndex: 0 });
    chartInstance.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: e.dataIndex,
    });
    chartInstance.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: e.dataIndex,
    });
  });

  chartInstance.on("mouseout", () => {
    startLoop(pointData);
  });

  chartInstance.on("click", (e) => {
    if (e.name && e.name.includes("区")) {
      // 模拟加载新地图
      currentMapName.value = e.name;
      currentMap.value = chongqingMap; // TODO：替换为实际区县 map json
      showBack.value = true;
      initChart();
    }
  });

  startLoop(pointData);
};

const goBack = () => {
  currentMap.value = chongqingMap;
  currentMapName.value = "重庆";
  showBack.value = false;
  initChart();
};
onMounted(() => {
  isMounted.value = true;
  initChart();
});
// onMounted(initChart);
onBeforeUnmount(() => {
  stopLoop();
  if (chartInstance) {
    chartInstance.dispose();
  }
});

watch(
  () => props.mapData,
  (newVal) => {
    if (newVal && newVal.length && isMounted.value) {
      console.log("父组件传来的数据变了：", newVal);
      initChart(newVal);
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.back-button {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 6px 6px;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
</style>
