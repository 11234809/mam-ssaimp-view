<template>
  <div class="header">
    <div class="header-left">充电服务区运营监控平台</div>
    <div class="header-center">
      <div
        v-for="item in themeBtnList"
        :key="item.id"
        :class="[
          'theme-btn',
          'cursor-pointer',
          activeTheme.id === item.id ? 'active' : '',
        ]"
        @click="emit('theme-change', item)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="header-right">
      <span class="time">{{ currentTime }}</span>
      <div class="header-right-line" />
      <span class="weather">
        <i>{{ weatherInfo.icon }}</i> {{ weatherInfo.temp }} °C
        {{ weatherInfo.weather }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  themeBtnList: {
    type: Array,
    required: true,
  },
  activeTheme: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["theme-change"]);

const currentTime = ref("");
const weatherInfo = ref({
  temp: "17",
  weather: "晴",
  icon: "☀️",
});
const weatherIcons = {
  晴: "☀️",
  多云: "⛅",
  阴: "☁️",
  小雨: "🌧️",
  中雨: "🌧️",
  大雨: "🌧️",
  雷阵雨: "⛈️",
  雪: "❄️",
  // 可补充更多
};

// const fetchWeather = async () => {
//   try {
//     const response = await fetch(
//       "https://restapi.amap.com/v3/weather/weatherInfo?city=500000&key=22598e2a304f8edeee31f3bcd802d389"
//     );

//     const data = await response.json();
//     console.log("高德天气返回数据:", data);

//     if (data.status !== "1" || !data.lives?.length) {
//       throw new Error(`接口异常: ${data.info}`);
//     }

//     const { temperature: temp, weather } = data.lives[0];

//     // 使用数据
//     weatherInfo.value = {
//       temp: `${temp}℃`,
//       weather,
//       icon: weatherIcons[weather] || "☀️",
//     };
//   } catch (error) {
//     console.error("获取天气失败:", error);
//   }
// };

function updateTime() {
  const now = new Date();
  const weekdays = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const weekday = weekdays[now.getDay()];

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  currentTime.value = `${year}年${month}月${day}日 ${weekday} ${hours}:${minutes}:${seconds}`;
}

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
  // fetchWeather();
  // 每隔1小时更新天气数据
  // setInterval(fetchWeather, 3600000);
});
</script>

<style scoped>
.header {
  align-items: flex-start;
  height: 200px;
  position: relative;
  background: url("../../images/组2398.png") no-repeat;
  background-size: 107% 100%;
  background-position: -110px -20px;
}

.header-left {
  position: absolute;
  font-size: 38px;
  font-weight: 400;
  color: #fff;
  font-family: YouSheBiaoTiHei;
  top: 4px;
  left: 24px;
}

.header-center {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -2px;
  left: 50%;
  transform: translate(-50%, 21%);
  width: 896px;
  font-family: JiangChengXieHei-900W;
  color: #bbcde6;
  font-size: 18px;
  font-weight: normal;
  /* line-height: ; */
}

.theme-btn {
  width: 175px;
  height: 53px;
  bottom: 20px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  text-align: center;
  cursor: pointer;
  line-height: 49px;
}

.theme-btn.active {
  color: #fff;
  background-image: url("../../images/选中.png");
}

.header-right {
  position: absolute;
  right: 24px;
  top: 20px;
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right-line {
  width: 2px;
  height: 27px;
  background-color: #9ec5e7;
  margin: 0 8px;
}
</style>
