<template>
  <div class="emergency-rescue-services">
    <div class="title"><span></span>应急救援服务</div>
    <el-row>
      <el-col :span="12">
        <el-form-item label="是否有应急救援服务" prop="rescueBean.isRescue">
          <el-select
            v-model="formInfo.rescueBean.isRescue"
            placeholder="请选择是否有应急救援服务"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsRescue"
            @clear="clearIsRescue"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="formInfo.rescueBean.isRescue != 0 && formInfo.rescueBean.isRescue != null"
    >
      <el-col :span="8">
        <el-form-item label="是否设置救援直升机停机坪" prop="rescueBean.isRescueApron">
          <el-select
            v-model="formInfo.rescueBean.isRescueApron"
            placeholder="请选择是否设置救援直升机停机坪"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否提供清障救援服务" prop="rescueBean.isRescueBarrier">
          <el-select
            v-model="formInfo.rescueBean.isRescueBarrier"
            placeholder="请选择是否提供清障救援服务"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否提供救援呼叫服务接口" prop="rescueBean.isRescueCall">
          <el-select
            v-model="formInfo.rescueBean.isRescueCall"
            placeholder="请选择是否提供救援呼叫服务接口"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useAreaInfoStore } from "../../../../store/useAreaInfoStore";
const areaInfoStore = useAreaInfoStore();
const { formInfoDisabled, formInfo } = storeToRefs(areaInfoStore);

const changeIsRescue = (val) => {
  if (val == 0) {
    initRescue();
  }
};

const clearIsRescue = () => {
  if (formInfo.value.rescueBean.isRescue == "") {
    formInfo.value.rescueBean.isRescue = null;
    initRescue();
  }
};

const initRescue = () => {
  formInfo.value.rescueBean.isRescueApron = null;
  formInfo.value.rescueBean.isRescueBarrier = null;
  formInfo.value.rescueBean.isRescueCall = null;
};
</script>
<style lang="less" scope></style>
