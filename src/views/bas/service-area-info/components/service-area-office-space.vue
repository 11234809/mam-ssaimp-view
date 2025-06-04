<template>
  <div>
    <div class="title"><span></span>经营管理单位办公用房</div>
    <el-row>
      <el-col :span="12">
        <el-form-item label="办公区总面积" prop="officeBean.officeArea">
          <el-input
            v-model="formInfo.officeBean.officeArea"
            placeholder="请输入办公区总面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="办公区房间数" prop="officeBean.officeRoomNum">
          <el-input
            v-model="formInfo.officeBean.officeRoomNum"
            placeholder="请输入办公区房间数"
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
</script>
<style lang="less" scope></style>
