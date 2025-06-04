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
      <span class="weather"><i class="icon-sun">☀️</i> 17℃</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'

const props = defineProps({
  themeBtnList: {
    type: Array,
    required: true
  },
  activeTheme: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['theme-change'])

const currentTime = ref('')

function updateTime() {
  const now = new Date()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const weekday = weekdays[now.getDay()]
  
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  
  currentTime.value = `${year}年${month}月${day}日 ${weekday} ${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<style scoped>
.header {
  align-items: flex-start;
  height: 200px;
  position: relative;
  background: url('../../images/组2398.png') no-repeat;
  background-size: 107% 100%;
  background-position: -110px 0;
}

.header-left {
  position: absolute;
  font-size: 42px;
  font-weight: bold;
  color: #ccc;
  top: 20px;
  left: 24px;
}

.header-center {
  position: absolute;
  display: flex;
  top: 27px;
  left: 50%;
  transform: translateX(-50%);
  width: 896px;
  color: #BBCDE6;
  font-size: 24px;
  font-weight: 900;
}

.theme-btn {
  width: 175px;
  height: 44px;
  bottom: 20px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  text-align: center;
  cursor: pointer;
}

.theme-btn.active {
  color: #fff;
  background-image: url("../../images/选中.png");
}

.header-right {
  position: absolute;
  right: 24px;
  top: 30px;
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right-line {
  width: 2px;
  height: 27px;
  background-color: #9EC5E7;
  margin: 0 8px; 
}
</style>