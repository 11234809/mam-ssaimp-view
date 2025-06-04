<template>
  <div>
    <div class="title"><span></span>汽修</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有汽修" prop="garageBean.isGarage">
          <el-select
            v-model="formInfo.garageBean.isGarage"
            placeholder="请选择是否有汽修"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsGarage"
            @clear="clearIsGarage"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="formInfo.garageBean.isGarage != 0 && formInfo.garageBean.isGarage != null"
    >
      <el-col :span="8">
        <el-form-item label="有无自修区" prop="garageBean.isPracticeArea">
          <el-select
            v-model="formInfo.garageBean.isPracticeArea"
            placeholder="请选择有无自修区"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="无" :value="0"></el-option>
            <el-option label="有" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="经营范围" prop="garageBean.garageBusinessScope">
          <el-input
            v-model="formInfo.garageBean.garageBusinessScope"
            placeholder="请输入经营范围"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="经营企业" prop="garageBean.garageRunBusiness">
          <el-input
            v-model="formInfo.garageBean.garageRunBusiness"
            placeholder="请输入经营企业"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="维修车间数" prop="garageBean.garageRoomNum">
          <el-input
            v-model="formInfo.garageBean.garageRoomNum"
            placeholder="请输入维修车间数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>间</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="维修工人数" prop="garageBean.garageWorkerNum">
          <el-input
            v-model="formInfo.garageBean.garageWorkerNum"
            placeholder="请输入维修工人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责人" prop="garageBean.personInChargeGarage">
          <el-input
            v-model="formInfo.garageBean.personInChargeGarage"
            placeholder="请输入负责人"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="garageBean.telephoneGarage">
          <el-input
            v-model="formInfo.garageBean.telephoneGarage"
            placeholder="请输入联系电话"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useAreaInfoStore } from "../../../../store/useAreaInfoStore";
const areaInfoStore = useAreaInfoStore();
const { formInfoDisabled, formInfo } = storeToRefs(areaInfoStore);

const changeIsGarage = (e) => {
  if (e === 0) {
    initGarageBean();
  }
};

const clearIsGarage = () => {
  if (formInfo.value.garageBean.isGarage === "") {
    formInfo.value.garageBean.isGarage = null;
    initGarageBean();
  }
};

const initGarageBean = () => {
  formInfo.value.garageBean.isPracticeArea = null;
  formInfo.value.garageBean.garageBusinessScope = null;
  formInfo.value.garageBean.garageRunBusiness = null;
  formInfo.value.garageBean.garageRoomNum = null;
  formInfo.value.garageBean.garageWorkerNum = null;
  formInfo.value.garageBean.personInChargeGarage = null;
  formInfo.value.garageBean.telephoneGarage = null;
};
</script>
<style lang="less" scope></style>
