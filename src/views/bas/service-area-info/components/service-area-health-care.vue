<template>
  <div class="health-care">
    <div class="title"><span></span>医疗卫生服务</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有医疗卫生服务" prop="medicalBean.isMedicalService">
          <el-select
            v-model="formInfo.medicalBean.isMedicalService"
            placeholder="请选择是否有医疗卫生服务"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsMedicalService"
            @clear="clearIsMedicalService"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="
        formInfo.medicalBean.isMedicalService != 0 &&
        formInfo.medicalBean.isMedicalService != null
      "
    >
      <el-col :span="8">
        <el-form-item
          label="是否提供简单应急医疗救治"
          prop="medicalBean.isMedicalEmergency"
        >
          <el-select
            v-model="formInfo.medicalBean.isMedicalEmergency"
            placeholder="请选择是否提供简单应急医疗救治"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否设置医务站（所/室）" prop="medicalBean.isMedicalStation">
          <el-select
            v-model="formInfo.medicalBean.isMedicalStation"
            placeholder="请选择是否设置医务站（所/室）"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="是否提供常用非处方药品"
          prop="medicalBean.isNonPrescriptionDrugs"
        >
          <el-select
            v-model="formInfo.medicalBean.isNonPrescriptionDrugs"
            placeholder="请选择是是否提供常用非处方药品"
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

const changeIsMedicalService = (e) => {
  if (e == 0) {
    initmedicalBean();
  }
};

const clearIsMedicalService = () => {
  if (formInfo.value.medicalBean.isMedicalService == "") {
    formInfo.value.medicalBean.isMedicalService = null;
    initmedicalBean();
  }
};

const initmedicalBean = () => {
  formInfo.value.medicalBean.isMedicalEmergency = null;
  formInfo.value.medicalBean.isMedicalStation = null;
  formInfo.value.medicalBean.isNonPrescriptionDrugs = null;
  formInfo.value.medicalBean.isMedicalEmergency = null;
};
</script>
<style lang="less" scope></style>
