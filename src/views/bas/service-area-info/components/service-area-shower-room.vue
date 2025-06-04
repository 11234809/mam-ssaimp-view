<template>
  <div>
    <div class="title"><span></span>淋浴</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有淋浴" prop="showerBean.isShower">
          <el-select
            v-model="formInfo.showerBean.isShower"
            placeholder="请选择是否有淋浴"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsShower"
            @clear="clearIsShower"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="formInfo.showerBean.isShower != '0' && formInfo.showerBean.isShower != null"
    >
      <el-col :span="8">
        <el-form-item label="淋浴总数量" prop="showerBean.showerNum">
          <el-input
            v-model="formInfo.showerBean.showerNum"
            placeholder="请输入淋浴总数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>间</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="男淋浴数量" prop="showerBean.manShowerNum">
          <el-input
            v-model="formInfo.showerBean.manShowerNum"
            placeholder="请输入男淋浴数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>间</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="女淋浴数量" prop="showerBean.womanShowerNum">
          <el-input
            v-model="formInfo.showerBean.womanShowerNum"
            placeholder="请输入女淋浴数量"
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

const changeIsShower = (e) => {
  if (e == 0) {
    initShowerBean();
  }
};

const clearIsShower = () => {
  if (formInfo.value.showerBean.isShower == "") {
    formInfo.value.showerBean.isShower = null;
    initShowerBean();
  }
};

const initShowerBean = () => {
  formInfo.value.showerBean.showerNum = null;
  formInfo.value.showerBean.manShowerNum = null;
  formInfo.value.showerBean.womanShowerNum = null;
};
</script>
<style lang="less" scope></style>
