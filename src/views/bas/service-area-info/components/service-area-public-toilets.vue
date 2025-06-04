<template>
  <div>
    <div class="title"><span></span>公共卫生间</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有卫生间" prop="toiletBean.isToilet">
          <el-select
            v-model="formInfo.toiletBean.isToilet"
            placeholder="请选择是否有卫生间"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsToilet"
            @clear="clearIsToilet"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="formInfo.toiletBean.isToilet != 0 && formInfo.toiletBean.isToilet != null"
    >
      <el-col :span="8">
        <el-form-item label="男小便器数量" prop="toiletBean.manUrinalNum">
          <el-input
            v-model="formInfo.toiletBean.manUrinalNum"
            placeholder="请输入男小便器数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="男蹲位数量" prop="toiletBean.manHoleNum">
          <el-input
            v-model="formInfo.toiletBean.manHoleNum"
            placeholder="请输入男蹲位数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="女蹲位数量" prop="toiletBean.womanHoleNum">
          <el-input
            v-model="formInfo.toiletBean.womanHoleNum"
            placeholder="请输入女蹲位数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="女厕座便数量" prop="toiletBean.womanSeatThenNum">
          <el-input
            v-model="formInfo.toiletBean.womanSeatThenNum"
            placeholder="请输入女厕座便数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="无障碍卫生间数量" prop="toiletBean.accessibleToiletNum">
          <el-input
            v-model="formInfo.toiletBean.accessibleToiletNum"
            placeholder="请输入无障碍卫生间数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="第三卫生间数量" prop="toiletBean.thirdToiletNum">
          <el-input
            v-model="formInfo.toiletBean.thirdToiletNum"
            placeholder="请输入第三卫生间数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="第三卫生间便位数量" prop="toiletBean.thirdSeatNum">
          <el-input
            v-model="formInfo.toiletBean.thirdSeatNum"
            placeholder="请输入第三卫生间便位数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="移动卫生间蹲位数量" prop="toiletBean.mobileToiletSquatNum">
          <el-input
            v-model="formInfo.toiletBean.mobileToiletSquatNum"
            placeholder="请输入移动卫生间蹲位数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="男厕座便数量" prop="toiletBean.manSeatThenNum">
          <el-input
            v-model="formInfo.toiletBean.manSeatThenNum"
            placeholder="请输入男厕座便数量"
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

const changeIsToilet = (e) => {
  if (e == 0) {
    initToiletBean();
  }
};

const clearIsToilet = () => {
  if (formInfo.value.toiletBean.isToilet == "") {
    formInfo.value.toiletBean.isToilet = null;
    initToiletBean();
  }
};

const initToiletBean = () => {
  formInfo.value.toiletBean.manUrinalNum = null;
  formInfo.value.toiletBean.manHoleNum = null;
  formInfo.value.toiletBean.womanHoleNum = null;
  formInfo.value.toiletBean.womanSeatThenNum = null;
  formInfo.value.toiletBean.accessibleToiletNum = null;
  formInfo.value.toiletBean.thirdToiletNum = null;
  formInfo.value.toiletBean.thirdSeatNum = null;
  formInfo.value.toiletBean.mobileToiletSquatNum = null;
  formInfo.value.toiletBean.manSeatThenNum = null;
};
</script>
<style lang="less" scope></style>
