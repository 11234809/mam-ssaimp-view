<template>
  <div class="free-rest">
    <div class="title"><span></span>免费休息区</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有免费休息区" prop="freeBean.isFreeRest">
          <el-select
            v-model="formInfo.freeBean.isFreeRest"
            placeholder="请选择是否有免费休息区"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsFreeRest"
            @clear="clearIsFreeRest"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="formInfo.freeBean.isFreeRest != 0 && formInfo.freeBean.isFreeRest != null"
    >
      <el-col :span="8">
        <el-form-item label="免费休息区座位数" prop="freeBean.freeSeatNum">
          <el-input
            v-model="formInfo.freeBean.freeSeatNum"
            placeholder="请输入免费休息区座位数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否提供免费热水" prop="freeBean.isHotWater">
          <el-select
            v-model="formInfo.freeBean.isHotWater"
            placeholder="请选择是否提供免费热水"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="免费热水龙头数" prop="freeBean.waterFaucetNum">
          <el-input
            v-model="formInfo.freeBean.waterFaucetNum"
            placeholder="请输入免费热水龙头数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
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
const changeIsFreeRest = (e) => {
  if (e == 0) {
    initFreeBean();
  }
};

const clearIsFreeRest = () => {
  if (formInfo.value.freeBean.isFreeRest == 0) {
    formInfo.value.freeBean.isFreeRest = null;
    initFreeBean();
  }
};

const initFreeBean = () => {
  formInfo.value.freeBean.freeSeatNum = null;
  formInfo.value.freeBean.isHotWater = null;
  formInfo.value.freeBean.waterFaucetNum = null;
};
</script>
<style lang="less" scope></style>
