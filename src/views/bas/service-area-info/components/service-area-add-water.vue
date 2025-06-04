<template>
  <div>
    <div class="title"><span></span>加水</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有加水" prop="waterBean.isAddWater">
          <el-select
            v-model="formInfo.waterBean.isAddWater"
            placeholder="请选择是否有加水"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsAddWater"
            @clear="clearIsAddWater"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="formInfo.waterBean.isAddWater != 0 && formInfo.waterBean.isAddWater != null"
    >
      <el-col :span="8">
        <el-form-item label="加水经营单位" prop="waterBean.operateWater">
          <el-input
            v-model="formInfo.waterBean.operateWater"
            placeholder="请输入加水经营单位"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="加水枪数量" prop="waterBean.waterGunNum">
          <el-input
            v-model="formInfo.waterBean.waterGunNum"
            placeholder="请输入加水枪数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责人" prop="waterBean.personInChargeWater">
          <el-input
            v-model="formInfo.waterBean.personInChargeWater"
            placeholder="请输入负责人"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="waterBean.telephoneWater">
          <el-input
            v-model="formInfo.waterBean.telephoneWater"
            placeholder="请输入联系电话"
            :disabled="formInfoDisabled"
          >
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

const changeIsAddWater = (e) => {
  if (e === 0) {
    initWaterBean();
  }
};

const clearIsAddWater = () => {
  if (formInfo.value.waterBean.isAddWater === "") {
    formInfo.value.waterBean.isAddWater === null;
    initWaterBean();
  }
};

const initWaterBean = () => {
  formInfo.value.waterBean.operateWater = null;
  formInfo.value.waterBean.waterGunNum = null;
  formInfo.value.waterBean.personInChargeWater = null;
  formInfo.value.waterBean.telephoneWater = null;
};
</script>
<style lang="less" scope></style>
