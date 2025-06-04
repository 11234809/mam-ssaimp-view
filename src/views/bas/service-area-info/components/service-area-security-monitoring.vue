<template>
  <div class="emission-reduction">
    <div class="title"><span></span>服务区安防监控</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否布设安防监控系统" prop="monitorBean.isMonitor">
          <el-select
            v-model="formInfo.monitorBean.isMonitor"
            placeholder="请选择是否布设安防监控系统"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsMonitor"
            @clear="clearIsMonitor"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="formInfo.monitorBean.isMonitor != 0 && formInfo.monitorBean.isMonitor != null"
    >
      <el-col :span="8">
        <el-form-item label="监控摄像头数量" prop="monitorBean.cameraNum">
          <el-input
            v-model="formInfo.monitorBean.cameraNum"
            placeholder="请输入监控摄像头数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="普清监控摄像头数量" prop="monitorBean.lowCameraNum">
          <el-input
            v-model="formInfo.monitorBean.lowCameraNum"
            placeholder="请输入普清监控摄像头数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="高清监控摄像头数量" prop="monitorBean.highCameraNum">
          <el-input
            v-model="formInfo.monitorBean.highCameraNum"
            placeholder="请输入高清监控摄像头数量"
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

const changeIsMonitor = (e) => {
  if (e == 0) {
    initMonitorBean();
  }
};

const clearIsMonitor = () => {
  if (formInfo.value.monitorBean.isMonitor == "") {
    formInfo.value.monitorBean.isMonitor = null;
    initMonitorBean();
  }
};

const initMonitorBean = () => {
  formInfo.value.monitorBean.cameraNum = null;
  formInfo.value.monitorBean.lowCameraNum = null;
  formInfo.value.monitorBean.highCameraNum = null;
};
</script>
<style lang="less" scope></style>
