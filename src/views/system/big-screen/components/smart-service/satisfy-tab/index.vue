<!--
 * @Description: 
 * @Version: 
 * @Autor: lkr
 * @Date: 2025-06-05 17:13:02
 * @LastEditors: lkr
 * @LastEditTime: 2025-06-05 17:16:30
-->
<template>
    <div class="item-middle">
      <span
        v-for="(item, index) in selectTimeTypeList"
        :key="index"
        class="cursor-pointer"
        :class="{ active: selected === item.code }"
        @click="handleSelect(item.code)"
      >
        {{ item.name }}
      </span>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, toRefs } from "vue";
  
  const props = defineProps({
    modelValue: String,
  });
  
  // 日期数据
  const selectTimeTypeList = [
    {
      name: "总体评价",
      code: "0",
    },
    {
      name: "小面评价",
      code: "1",
    },
    {
      name: "餐饮评价",
      code: "2",
    },
  ];
  const emit = defineEmits(["update:modelValue", "select"]);
  
  const { modelValue } = toRefs(props);
  
  const selected = ref(modelValue.value);
  const dateRange = ref([]);
  
  watch(dateRange.value,(val)=>{
      emit("select", { code, dateRange: dateRange.value });
  })
  // 选中时间类型
  function handleSelect(code) {
    selected.value = code;
    emit("update:modelValue", code);
    emit("select", { code });
  }
  
  // 监听外部modelValue变化，保持内部selected同步
  watch(modelValue, (newVal) => {
    selected.value = newVal;
  });
  
  // 监听日期变化，选中6时，向父组件发送更新
  watch(dateRange, (val) => {
    if (selected.value === "6") {
      emit("select", { code: "6", dateRange: val });
    }
  });
  </script>
  
  <style scoped>
  .item-middle {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aeb2b6;
  }
  
  .cursor-pointer {
    width: 56px;
    height: 24px;
    font-size: 14px;
    margin: 0 4px;
    text-align: center;
    line-height: 24px; /* ✅ 让字体在垂直方向居中 */
    border-radius: 4px;
    cursor: pointer;
    color: #aeb2b6;
    background-color: #17283a;
    transition: background 0.3s, color 0.3s;
  }
  
  .cursor-pointer.active {
    background: linear-gradient(90deg, #17283a, #237aa1, #193246);
    color: #fff;
  }
  </style>
  