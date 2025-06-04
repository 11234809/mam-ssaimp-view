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
    <el-date-picker
      v-if="selected === '6'"
      v-model="dateRange"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      clearable
      size="small"
      style="margin: 8px auto; width: 43%; max-width: 280px"
    />
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
    name: "昨日",
    code: "0",
  },
  {
    name: "今日",
    code: "1",
  },
  {
    name: "周",
    code: "2",
  },
  {
    name: "月",
    code: "3",
  },
  {
    name: "季",
    code: "4",
  },
  {
    name: "年",
    code: "5",
  },
  {
    name: "其它",
    code: "6",
  },
];
const emit = defineEmits(["update:modelValue", "select"]);

const { modelValue } = toRefs(props);

const selected = ref(modelValue.value);
const dateRange = ref([]);

// 选中时间类型
function handleSelect(code) {
  selected.value = code;
  emit("update:modelValue", code);
  if (code === "6") {
    emit("select", { code, dateRange: dateRange.value });
  } else {
    emit("select", { code });
  }
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
  width: 28px;
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
