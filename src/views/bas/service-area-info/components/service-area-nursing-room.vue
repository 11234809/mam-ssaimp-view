<template>
  <div class="nursing-room">
    <div class="title"><span></span>母婴室</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有母婴室" prop="babyBean.isMotherBaby">
          <el-select
            v-model="formInfo.babyBean.isMotherBaby"
            placeholder="请选择是否有母婴室"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsMotherBaby"
            @clear="clearIsMotherBaby"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="formInfo.babyBean.isMotherBaby != 0 && formInfo.babyBean.isMotherBaby != null"
    >
      <el-col :span="8">
        <el-form-item label="是否设有母婴休息设施" prop="babyBean.isMotherBabyRest">
          <el-select
            v-model="formInfo.babyBean.isMotherBabyRest"
            placeholder="请选择是否有母婴室"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否设有卫生间" prop="babyBean.isMotherBabyToilet">
          <el-select
            v-model="formInfo.babyBean.isMotherBabyToilet"
            placeholder="请选择是否设有卫生间"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="母婴室面积" prop="babyBean.motherBabyArea">
          <el-input
            v-model="formInfo.babyBean.motherBabyArea"
            placeholder="请输入母婴室面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="母婴室数量" prop="babyBean.motherBabyNum">
          <el-input
            v-model="formInfo.babyBean.motherBabyNum"
            placeholder="请输入母婴室数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>间</template>
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

const changeIsMotherBaby = (e) => {
  if (e == 0) {
    initBabyBean();
  }
};

const clearIsMotherBaby = () => {
  if (formInfo.value.babyBean.isMotherBaby == "") {
    formInfo.value.babyBean.isMotherBaby = null;
    initBabyBean();
  }
};

const initBabyBean = () => {
  formInfo.value.babyBean.isMotherBabyRest = null;
  formInfo.value.babyBean.isMotherBabyToilet = null;
  formInfo.value.babyBean.motherBabyArea = null;
  formInfo.value.babyBean.motherBabyNum = null;
};
</script>
<style lang="less" scope></style>
