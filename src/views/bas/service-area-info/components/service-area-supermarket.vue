<template>
  <div>
    <div class="title"><span></span>商超</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有超市" prop="marketBean.isSupermarket">
          <el-select
            v-model="formInfo.marketBean.isSupermarket"
            placeholder="请选择是否有超市"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsSupermarket"
            @clear="clearIsSupermarket"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="
        formInfo.marketBean.isSupermarket != 0 &&
        formInfo.marketBean.isSupermarket != null
      "
    >
      <el-col :span="8">
        <el-form-item label="经营企业" prop="marketBean.supermarketRunBusiness">
          <el-input
            v-model="formInfo.marketBean.supermarketRunBusiness"
            placeholder="请输入经营企业"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="经营范围" prop="marketBean.supermarketBusinessScope">
          <el-input
            v-model="formInfo.marketBean.supermarketBusinessScope"
            placeholder="请输入经营范围"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="面积" prop="marketBean.supermarketArea">
          <el-input
            v-model="formInfo.marketBean.supermarketArea"
            placeholder="请输入面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="实行同城同价商品" prop="marketBean.samePriceGoods">
          <el-input
            v-model="formInfo.marketBean.samePriceGoods"
            placeholder="请输入实行同城同价商品"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="本地特色商品" prop="marketBean.localCharacteristicsGoods">
          <el-input
            v-model="formInfo.marketBean.localCharacteristicsGoods"
            placeholder="请输入本地特色商品"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责人" prop="marketBean.personInChargeMarket">
          <el-input
            v-model="formInfo.marketBean.personInChargeMarket"
            placeholder="请输入负责人"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="marketBean.telephoneMarket">
          <el-input
            v-model="formInfo.marketBean.telephoneMarket"
            placeholder="请输入联系电话"
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

const changeIsSupermarket = (val) => {
  if (val == 0) {
    initMarketBean();
  }
};

const clearIsSupermarket = () => {
  if (formInfo.value.marketBean.isSupermarket == "") {
    formInfo.value.marketBean.isSupermarket = null;
    initMarketBean;
  }
};

const initMarketBean = () => {
  formInfo.value.marketBean.supermarketRunBusiness = null;
  formInfo.value.marketBean.supermarketBusinessScope = null;
  formInfo.value.marketBean.supermarketArea = null;
  formInfo.value.marketBean.samePriceGoods = null;
  formInfo.value.marketBean.localCharacteristicsGoods = null;
  formInfo.value.marketBean.personInChargeMarket = null;
  formInfo.value.marketBean.telephoneMarket = null;
};
</script>
<style lang="less" scope></style>
