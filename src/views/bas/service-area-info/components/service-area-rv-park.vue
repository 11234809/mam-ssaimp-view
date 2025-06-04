<template>
  <div class="rv-park">
    <div class="title"><span></span>房车营地</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有房车营地" prop="limoCampBean.isLimoCamp">
          <el-select
            v-model="formInfo.limoCampBean.isLimoCamp"
            placeholder="请选择是否有房车营地"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsLimoCamp"
            @clear="clearIsLimoCamp"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="
        formInfo.limoCampBean.isLimoCamp != 0 && formInfo.limoCampBean.isLimoCamp != null
      "
    >
      <el-col :span="8">
        <el-form-item label="是否提供水电等基础服务" prop="limoCampBean.isBasicService">
          <el-select
            v-model="formInfo.limoCampBean.isBasicService"
            placeholder="请选择是否提供水电等基础服务"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否提供线上预订" prop="limoCampBean.isOnlineBook">
          <el-select
            v-model="formInfo.limoCampBean.isOnlineBook"
            placeholder="请选择是否提供线上预订"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否提供电话预订" prop="limoCampBean.isTelBook">
          <el-select
            v-model="formInfo.limoCampBean.isTelBook"
            placeholder="请选择是否提供电话预订"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="停靠房车营位" prop="limoCampBean.limoCampNum">
          <el-input
            v-model="formInfo.limoCampBean.limoCampNum"
            placeholder="请输入停靠房车营位"
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

const changeIsLimoCamp = (e) => {
  if (e == 0) {
    initLimoCampBean();
  }
};

const clearIsLimoCamp = () => {
  if (formInfo.value.limoCampBean.isLimoCamp == "") {
    formInfo.value.limoCampBean.isLimoCamp = null;
    initLimoCampBean();
  }
};

const initLimoCampBean = () => {
  formInfo.value.limoCampBean.isBasicService = null;
  formInfo.value.limoCampBean.isOnlineBook = null;
  formInfo.value.limoCampBean.isTelBook = null;
  formInfo.value.limoCampBean.limoCampNum = null;
};
</script>
<style lang="less" scope></style>
