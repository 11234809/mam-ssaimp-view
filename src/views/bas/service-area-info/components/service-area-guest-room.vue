<template>
  <div>
    <div class="title"><span></span>客房</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有客房" prop="roomBean.isAccommodation">
          <el-select
            v-model="formInfo.roomBean.isAccommodation"
            placeholder="请选择是否有客房"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsAccommodation"
            @clear="clearIsAccommodation"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="
        formInfo.roomBean.isAccommodation != 0 &&
        formInfo.roomBean.isAccommodation != null
      "
    >
      <el-col :span="8">
        <el-form-item label="客房数" prop="roomBean.guestRoomNum">
          <el-input
            v-model="formInfo.roomBean.guestRoomNum"
            placeholder="请输入客房数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>套</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="标准间数" prop="roomBean.standardRoomNum">
          <el-input
            v-model="formInfo.roomBean.standardRoomNum"
            placeholder="请输入标准间数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="床位数" prop="roomBean.bedsNum">
          <el-input
            v-model="formInfo.roomBean.bedsNum"
            placeholder="请输入床位数"
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
import { ref } from "vue";
import { useAreaInfoStore } from "../../../../store/useAreaInfoStore";
const areaInfoStore = useAreaInfoStore();
const { formInfoDisabled, formInfo } = storeToRefs(areaInfoStore);

const changeIsAccommodation = (e) => {
  if (e == 0) {
    initRoomBean();
  }
};

const clearIsAccommodation = () => {
  if (formInfo.value.roomBean.isAccommodation == "") {
    formInfo.value.roomBean.isAccommodation = null;
    initRoomBean();
  }
};

const initRoomBean = () => {
  formInfo.value.roomBean.guestRoomNum = null;
  formInfo.value.roomBean.standardRoomNum = null;
  formInfo.value.roomBean.bedsNum = null;
};
</script>
<style lang="less" scope></style>
