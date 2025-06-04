<template>
  <div>
    <el-radio-group v-model="tabValue" style="margin-bottom: 10px">
      <el-radio-button label="1">服务区基础信息查询</el-radio-button>
      <el-radio-button label="2">充电设施信息查询</el-radio-button>
      <el-radio-button label="3">充电设施动态查询</el-radio-button>
    </el-radio-group>

    <ServiceAreaBasic v-if="tabValue ==='1'"/>
    <ChargingFacility v-if="tabValue ==='2'"/>
    <ChargingFacilityDynamic v-if="tabValue ==='3'"/>

  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import ServiceAreaBasic from '@/views/bas/charge-pile/comp/service-area-basic/index.vue'
import ChargingFacility from '@/views/bas/charge-pile/comp/charging-facility/index.vue'
import ChargingFacilityDynamic from '@/views/bas/charge-pile/comp/charging-facility-dynamic/index.vue'

const tabValue = ref('1')


onMounted(() => {

})
</script>

<style scoped lang="less">
</style>
