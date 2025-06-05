<!--
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2025-05-28 15:55:53
 * @LastEditors: ysl
 * @LastEditTime: 2025-06-05 10:20:42
-->
<template>
  <ScreenAdapter :width="1920" :height="1080">
    <Header
      :theme-btn-list="themeBtnList"
      :active-theme="activeTheme"
      @theme-change="handleThemeBtn"
    />
    <component
      :is="components[activeTheme.component]"
      :key="activeTheme.id"
      ref="activeComponent"
    />
  </ScreenAdapter>
</template>

<script setup>

import ScreenAdapter from './components/screen-content/index.vue';
import Header from './components/header/index.vue';
import SmartEnergy from './components/smart-energy/index.vue';
import SmartManagement from './components/smart-management/index.vue';
import synthesizeManage from './components/smart-synthesize/index.vue';
import SmartService from './components/smart-service/index.vue';
import { ref, onMounted, computed, nextTick } from 'vue'

const components = {
  SmartEnergy,
  synthesizeManage,
  SmartManagement,
  SmartService
}
// 头部声明数据
const themeBtnList = ref([{
  id: 1,
  name: "综合管理",
  component:'synthesizeManage',
  leftComponent: "SynthesizeLeft",
  rightComponent: "SynthesizeRight",
}, {
  id: 2,
  name: '智慧能源',
  component:'SmartEnergy',
  leftComponent: "EnergyLeft",
  rightComponent: "EnergyRight",
}
  , {
  id: 3,
  name: '智慧服务',
  component:'SmartService',
  leftComponent: "ServiceLeft",
  rightComponent: "ServiceRight",
},
{
  id: 4,
  name: '智慧管理',
  component:'SmartManagement',
  leftComponent: "ManagementLeft",
  rightComponent: "ManagementRight",
}, {
  id: 5,
  name: '智慧经营',
  component:'SmartEnergy',
  leftComponent: "BusinessLeft",
  rightComponent: "BusinessRight",
}])
const activeTheme = ref(themeBtnList.value[0])

// 智慧能源
const activeComponent = ref(null);

function handleThemeBtn(item) {
  activeTheme.value = item;
   nextTick(() => {
    if (item.id === 2 && activeComponent.value?.refresh) {
      activeComponent.value.refresh();
    }
  });
}
</script>

<style scoped></style>
