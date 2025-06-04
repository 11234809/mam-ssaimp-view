<template>
  <div class="etc">
    <div class="title"><span></span>ETC车道</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有ETC车道" prop="etcBean.isEtc">
          <el-select
            v-model="formInfo.etcBean.isEtc"
            placeholder="请选择是否有ETC车道"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsEtc"
            @clear="clearIsEtc"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="formInfo.etcBean.isEtc != 0 && formInfo.etcBean.isEtc != null">
      <el-col :span="8">
        <el-form-item label="ETC车道通行车辆类型" prop="etcBean.etcCarType">
          <el-select
            v-model="formInfo.etcBean.etcCarType"
            placeholder="请选择ETC车道通行车辆类型"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option
              v-for="(item, index) in dictItemsList.vehicleTypeDictionary"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="ETC车道数量" prop="etcBean.etcLaneNum">
          <el-input
            v-model="formInfo.etcBean.etcLaneNum"
            placeholder="请输入ETC车道数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="入口车道数量" prop="etcBean.inLaneNum">
          <el-input
            v-model="formInfo.etcBean.inLaneNum"
            placeholder="请输入入口车道数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="出口车道数量" prop="etcBean.outLaneNum">
          <el-input
            v-model="formInfo.etcBean.outLaneNum"
            placeholder="请输入出口车道数量"
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
const { formInfoDisabled, formInfo, dictItemsList } = storeToRefs(areaInfoStore);
const changeIsEtc = (e) => {
  if (e === 0) {
    initEtcBean();
  }
};

const clearIsEtc = () => {
  if (formInfo.value.etcBean.isEtc === "") {
    formInfo.value.etcBean.isEtc = null;
    initEtcBean();
  }
};

const initEtcBean = () => {
  formInfo.value.etcBean.etcCarType = null;
  formInfo.value.etcBean.etcLaneNum = null;
  formInfo.value.etcBean.inLaneNum = null;
  formInfo.value.etcBean.outLaneNum = null;
};
</script>
<style lang="less" scope></style>
