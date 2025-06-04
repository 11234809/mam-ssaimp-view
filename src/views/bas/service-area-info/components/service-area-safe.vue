<template>
  <div class="safe">
    <div class="title"><span></span>安全</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="危化品车位是否有应急沙池" prop="fireBean.isBunker">
          <el-select
            v-model="formInfo.fireBean.isBunker"
            placeholder="请选择危化品车位是否有应急沙池"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="危化品车位是否配备消防设备" prop="fireBean.isFire">
          <el-select
            v-model="formInfo.fireBean.isFire"
            placeholder="请选择危化品车位是否配备消防设备"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="经营摊位使用情况" prop="fireBean.boothDesc">
          <el-input
            v-model="formInfo.fireBean.boothDesc"
            placeholder="请输入经营摊位使用电、液化气、天然气情况"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="厨房使用情况" prop="fireBean.kitchenDesc">
          <el-input
            v-model="formInfo.fireBean.kitchenDesc"
            placeholder="请输入厨房使用电、液化气、天然气情况"
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
</script>
<style lang="less" scope></style>
