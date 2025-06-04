<template>
  <div class="total" v-for="v in statsList">
    <div class="title">{{ v.label }}</div>
    <div class="detail">
      <div
        :class="{ single: true, activeColor: item.key === 'incomeTotal' }"
        v-for="item in v.list"
      >
        <div class="single-one">{{ item.title }}</div>
        <div class="single-two">{{ data[item.key] ?? 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { trafficStats, revenueStats, rechargeStats } from "./index";

const props = defineProps({
  data: {
    type: Object,
    defaults: {},
  },
});

const statsList = computed(() => {
  return [
    {
      label: "流量情况统计",
      list: trafficStats,
    },
    {
      label: "收入情况统计",
      list: revenueStats,
    },
    {
      label: "换电、加气、光伏统计",
      list: rechargeStats,
    },
  ];
});
</script>

<style lang="less" scoped>
.total {
  display: flex;
  text-align: center;
  margin-bottom: 10px;
  .title {
    min-width: 240px;
    font-size: 16px;
    font-weight: bold;
    height: 60px;
    line-height: 60px;
    border: 1px solid #ccc;
    padding: 0 10px;
  }
  .detail {
    display: flex;
    height: 60px;
    .single {
      width: 135px;
      border: 1px solid #ccc;
      border-left: 0;
      line-height: 1.5;
      .single-one {
        font-size: 16px;
      }
      .single-two {
        font-size: 18px;
      }
    }
    .activeColor {
      color: #1890ff;
    }
  }
}
</style>
