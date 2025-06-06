<template>
  <div
    id="container"
    v-loading="loading"
    element-loading-background="#1c3954"
    element-loading-text="地图资源加载中..."
    v-bind="$attrs"
  >
    <ul v-if="props.smartEnergy == 'smartEnergy'" class="map-legend">
      <li
        @click="legendClick('1')"
        :class="{ active: activeList.includes('1') }"
      >
        <img src="./img/smartEnergy(1).png" alt="" /> 充电站
      </li>
      <li
        @click="legendClick('2')"
        :class="{ active: activeList.includes('2') }"
      >
        <img src="./img/smartEnergy(2).png" alt="" /> 加油站
      </li>
      <li
        @click="legendClick('3')"
        :class="{ active: activeList.includes('3') }"
      >
        <img src="./img/smartEnergy(3).png" alt="" />换电站
      </li>
      <li
        @click="legendClick('4')"
        :class="{ active: activeList.includes('4') }"
      >
        <img src="./img/smartEnergy(4).png" alt="" />加气站
      </li>
      <li
        @click="legendClick('5')"
        :class="{ active: activeList.includes('5') }"
      >
        <img src="./img/smartEnergy(5).png" alt="" />光伏发电
      </li>
    </ul>
    <ul class="map-legend" v-else>
      <li
        @click="legendClick('1')"
        :class="{ active: activeList.includes('1') }"
      >
        <img src="./img/icon-4.png" alt="" /> 建成运营
      </li>
      <li
        @click="legendClick('2')"
        :class="{ active: activeList.includes('2') }"
      >
        <img src="./img/icon-1.png" alt="" /> 建成未运营
      </li>
      <li
        @click="legendClick('3')"
        :class="{ active: activeList.includes('3') }"
      >
        <img src="./img/icon-2.png" alt="" />在建
      </li>
      <li
        @click="legendClick('4')"
        :class="{ active: activeList.includes('4') }"
      >
        <img src="./img/icon-3.png" alt="" />关闭
      </li>
      <li
        @click="legendClick('5')"
        :class="{ active: activeList.includes('5') }"
      >
        <img src="./img/icon-5.png" alt="" />星级
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineEmits, defineExpose, onMounted, ref } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import cqJson from "@/components/map/data/chongqing.json";

const props = defineProps({
  smartEnergy: {
    type: String,
    default: null,
  },
});

const loading = ref(true);

const emit = defineEmits(["mapLoaded", "markerClick"]);

const activeList = ref(["1", "2", "3", "4", "5"]);

function legendClick(key) {
  let index = activeList.value.indexOf(key);
  console.log(index);
  if (index !== -1) {
    activeList.value.splice(index, 1);
  } else {
    activeList.value.push(key);
  }
}

function setMarkers(list) {
  console.log(list, "2222");
  // 检查 list 是否为空或无效
  if (!list || list.length === 0) {
    console.warn("Marker list is empty or invalid");
    return;
  }

  // 检查 AMap 和 MapObj 是否可用
  if (!AmapObj.value || !MapObj.value) {
    console.error("AMap or Map instance is not initialized");
    return;
  }

  if (list.length === 0 || !list) return;

  list.map((item) => {
    const { type, lng, lat, starNum } = item;
    let iconUrl = null;
    if (props.smartEnergy == "smartEnergy") {
      if (type === "1") {
        iconUrl = new URL("./img/smartEnergy(1).png", import.meta.url).href;
      } else if (type === "2") {
        iconUrl = new URL("./img/smartEnergy(2).png", import.meta.url).href;
      } else if (type === "3") {
        iconUrl = new URL("./img/smartEnergy(3).png", import.meta.url).href;
      } else if (type === "4") {
        iconUrl = new URL("./img/smartEnergy(4).png", import.meta.url).href;
      } else if (type === "5") {
        iconUrl = new URL("./img/smartEnergy(5).png", import.meta.url).href;
      }
    } else {
      if (type === "1") {
        iconUrl = new URL("./img/icon-4.png", import.meta.url).href;
      } else if (type === "2") {
        iconUrl = new URL("./img/icon-1.png", import.meta.url).href;
      } else if (type === "3") {
        iconUrl = new URL("./img/icon-2.png", import.meta.url).href;
      } else if (type === "4") {
        iconUrl = new URL("./img/icon-3.png", import.meta.url).href;
      }
    }
    // 创建 AMap.Icon 实例：
    const AMap = AmapObj.value;
    const icon = new AmapObj.value.Icon({
      size: new AMap.Size(40, 40), // 图标尺寸
      // vue3/vite 需要用特定的本地图片引入方式，不可require引入
      image: iconUrl, // Icon的图像
      // imageOffset: new AMap.Pixel(0, -60),  // 图像相对展示区域的偏移量，适于雪碧图等
      imageSize: new AMap.Size(40, 40), // 根据所设置的大小拉伸或压缩图片
      imageOffset: new AMap.Pixel(0, 0),
    });
    // 创建一个 Marker 实例：
    const marker = new AMap.Marker({
      position: [lng, lat], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      extData: { ...item },
      icon: icon,
    });
    // props.smartEnergy
    let src = new URL("./img/icon-5.png", import.meta.url).href;
    let starHtml = "";
    for (let i = 0; i < starNum; i++) {
      starHtml += `<img src="${src}" />`;
    }
    props.smartEnergy == "smartEnergy"
      ? ``
      : marker.setLabel({
          content: `
    <div onclick="labelClick(event)" style="background: transparent" class="mark-label">
      ${starHtml}
    </div>
  `,
        });
    // 监听marker的点击事件
    AMap.event.addListener(marker, "click", function (e) {
      console.log(e.target, e.target.De.extData, "222");
      emit("markerClick", e.target.De.extData);
      // infoWindow.open(
      //     map,
      //     // 窗口信息的位置
      //     marker.getPosition(data.lnt, data.lat)
      // );
    });
    MapObj.value.add(marker);
  });
}

window.labelClick = function labelClick(event) {
  console.log(event, "click2");
  event.stopPropagation();
  event.preventDefault();
  return;
};

// 地图数据配置加载完成
function mapLoaded() {
  console.log("mapLoaded");

  emit("mapLoaded");
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}

function removeAllMarkers() {
  // 获取所有覆盖物（包括 Marker、Polygon 等）
  const allOverlays = MapObj.value.getAllOverlays();

  // 只移除 Marker 类型的点
  allOverlays.forEach((overlay) => {
    if (overlay instanceof AmapObj.value.Marker) {
      MapObj.value.remove(overlay);
    }
  });
}

const AmapObj = ref(null);
const MapObj = ref(null);

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "c121288adac61a192114d24987df6356",
  };
  AMapLoader.load({
    key: "133a285a8ecad1ad3ee7140ae8fbd502", // 申请好的Web端开发者Key，首次调用 load 时必填
    // version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      "AMap.Scale",
      "AMap.Marker",
      "AMap.Object3DLayer",
      "AMap.PlaceSearch",
      "AMap.MarkerCluster",
      "AMap.DistrictSearch",
      "Map3D",
    ], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) => {
      AmapObj.value = AMap;
      const districtSearch = new AMap.DistrictSearch({
        extensions: "all",
        subdistrict: 0,
      });
      districtSearch
        .search("重庆", function (status, result) {
          console.log(result, "result");
          let polygon = [];
          // 外多边形坐标数组和内多边形坐标数组
          const outer = [
            new AMap.LngLat(-360, 90, true),
            new AMap.LngLat(-360, -90, true),
            new AMap.LngLat(360, -90, true),
            new AMap.LngLat(360, 90, true),
          ];
          const holes = result.districtList[0].boundaries;
          const mask = [];
          for (let i = 0; i < holes.length; i++) {
            mask.push([holes[i]]);
          }
          const map = new AMap.Map("container", {
            mask: mask,
            // 设置地图容器id
            // pitch: 60,
            // rotation: -35,
            resizeEnable: true, //是否监控地图容器尺寸变化
            // features: ['bg', 'road', 'point'], //隐藏默认楼块
            // features: ['bg', 'road'],
            mapStyle: "amap://styles/575ba51b9e3d994d99743667a27baa18", //设置地图的显示样式
            // mapStyle: 'amap://styles/7daf7c6981b0bc497d78c23077f5492f',
            // layers: [new AMap.TileLayer.Satellite()], //地图图层（卫星图层）    new AMap.TileLayer()
            center: [107.54, 30],
            zooms: [7, 16], //地图显示的缩放级别范围
            viewMode: "3D",
            zoomEnable: true, //是否缩放
            dragEnable: true, //是否拖动
            // showLabel: false,
            labelIndex: 0,
            pitch: 30,
          });
          MapObj.value = map;

          const pathArray = [outer];
          pathArray.push.apply(pathArray, holes);
          polygon = new AMap.Polygon({
            path: pathArray,
            strokeColor: "#00BFFF", //城市边界颜色 //城市边界颜色
            strokeWeight: 2,
            fillColor: "#131925", // 遮罩背景色黑色
            fillOpacity: 1,
          });
          polygon.setPath(pathArray);
          map.add(polygon);

          //添加高度面
          var object3Dlayer = new AMap.Object3DLayer({ zIndex: -1 });
          map.add(object3Dlayer);
          var height = -50000;
          var color = "#0088ffcc"; //rgba
          var wall = new AMap.Object3D.Wall({
            path: holes,
            height: height,
            color: color,
          });
          wall.transparent = true;
          wall.backOrFront = "both";
          object3Dlayer.add(wall);

          // 读取本地geojson文件（假设文件路径为src/assets/data/geojsondata.geojson）
          // fetch('@/assets/data/chongqing.json')
          //     .then((response) => response.json())
          //     .then((geojson) => {
          //       console.log(geojson, 'geojson')
          // const pathArray = []
          cqJson.features?.map((item) => {
            //  console.log(item.geometry.coordinates[0], "22");
            const polygon = new AMap.Polygon({
              path: item.geometry.coordinates,
              strokeColor: "#00BFFF", //城市边界颜色 //城市边界颜色
              strokeWeight: 1,
              fillColor: "#131925", // 遮罩背景色黑色
              fillOpacity: 0.1,
            });
            wall.transparent = true;
            wall.backOrFront = "both";
            object3Dlayer.add(wall);

            // 读取本地geojson文件（假设文件路径为src/assets/data/geojsondata.geojson）
            // fetch('@/assets/data/chongqing.json')
            //     .then((response) => response.json())
            //     .then((geojson) => {
            //       console.log(geojson, 'geojson')
            // const pathArray = []
            cqJson.features?.map((item) => {
              // console.log(item.geometry.coordinates[0], '22')
              const polygon = new AMap.Polygon({
                path: item.geometry.coordinates,
                strokeColor: "#00BFFF", //城市边界颜色 //城市边界颜色
                strokeWeight: 1,
                fillColor: "#131925", // 遮罩背景色黑色
                fillOpacity: 0.1,
              });
              map.add(polygon);
              // pathArray.push(polygon)
              //   })
              //   // 加载geojson数据
            });

            // 创建一个 Marker 实例：
            // const marker = new AMap.Marker({
            //   position: [108.232755,30.45502],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            //   title: 'hhhhhh',
            //   // icon: icon
            // });
            // map.add(marker)

            mapLoaded();
          });
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
});

defineExpose({
  setMarkers,
  removeAllMarkers,
});
</script>

<style lang="less" scoped>
#container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;

  ::v-deep(.amap-marker-label) {
    background: transparent;
    border: none;
    color: #fff;
    top: -20px !important;

    left: -16px !important;

    .mark-label {
      width: 72px;
      display: flex;
      justify-content: center;

      img {
        width: 20px;
        height: 20px;
        margin-left: -6px;
        //margin-right: -4px;
      }
    }
  }

  .map-legend {
    position: absolute;
    right: 20px;
    bottom: 20px;
    z-index: 999;
    color: #fff;
    list-style: none;
    padding: 10px;

    > li.active {
      color: #40a9ff;
    }

    > li {
      margin: 3px 0;
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;

      > img {
        width: 44px;
        height: 44px;
      }
    }
  }
}
</style>
