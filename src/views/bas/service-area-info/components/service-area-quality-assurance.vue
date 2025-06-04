<template>
  <div class="service-quality-assurance">
    <div class="title"><span></span>服务质量管理监督</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有服务监督" prop="superviseBean.isSupervise">
          <el-select
            v-model="formInfo.superviseBean.isSupervise"
            placeholder="请选择是否有服务监督"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsSupervise"
            @clear="clearIsSupervise"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="
        formInfo.superviseBean.isSupervise != 0 &&
        formInfo.superviseBean.isSupervise != null
      "
    >
      <el-col :span="8">
        <el-form-item label="是否设有投诉台" prop="superviseBean.isComplaintDesk">
          <el-select
            v-model="formInfo.superviseBean.isComplaintDesk"
            placeholder="请选择是否设有投诉台"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否设有监督公示栏" prop="superviseBean.isSuperviseBoard">
          <el-select
            v-model="formInfo.superviseBean.isSuperviseBoard"
            placeholder="请选择是否设有监督公示栏"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否设有监督电话" prop="superviseBean.isSuperviseTel">
          <el-select
            v-model="formInfo.superviseBean.isSuperviseTel"
            placeholder="请选择是否设有监督电话"
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

const changeIsSupervise = (e) => {
  if (e == 0) {
    initSuperviseBean();
  }
};

const clearIsSupervise = () => {
  if (formInfo.value.superviseBean.isSupervise == "") {
    formInfo.value.superviseBean.isSupervise = null;
    initSuperviseBean();
  }
};

const initSuperviseBean = () => {
  formInfo.value.superviseBean.isComplaintDesk = null;
  formInfo.value.superviseBean.isSuperviseBoard = null;
  formInfo.value.superviseBean.isSuperviseTel = null;
};
</script>
<style lang="less" scope></style>
