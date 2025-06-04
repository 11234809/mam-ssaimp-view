<template>
  <div>
    <div class="title"><span></span>餐饮</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有餐饮" prop="foodBean.isFoodBeverage">
          <el-select
            v-model="formInfo.foodBean.isFoodBeverage"
            placeholder="请选择是否有餐饮"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsFoodBeverage"
            @clear="clearIsFoodBeverage"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="
        formInfo.foodBean.isFoodBeverage != 0 && formInfo.foodBean.isFoodBeverage != null
      "
    >
      <el-col :span="8">
        <el-form-item label="主菜系" prop="foodBean.mainCuisine">
          <el-input
            v-model="formInfo.foodBean.mainCuisine"
            placeholder="请输入主菜系"
            :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="餐饮种类" prop="foodBean.mealsKinds">
          <el-select
            v-model="formInfo.foodBean.mealsKinds"
            placeholder="请选择餐饮种类"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option
              v-for="(item, index) in dictItemsList.mealsKindsCodeDictionary"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="餐厅面积" prop="foodBean.restaurantArea">
          <el-input
            v-model="formInfo.foodBean.restaurantArea"
            placeholder="请输入餐厅面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="餐厅数量" prop="foodBean.restaurantNum">
          <el-input
            v-model="formInfo.foodBean.restaurantNum"
            placeholder="请输入餐厅数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>家</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="特色门店" prop="foodBean.specialtyStore">
          <el-input
            v-model="formInfo.foodBean.specialtyStore"
            placeholder="请输入特色门店"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>家</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="包间数量" prop="foodBean.restaurantRoomNum">
          <el-input
            v-model="formInfo.foodBean.restaurantRoomNum"
            placeholder="请输入包间数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>间</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="同时容纳就餐人数" prop="foodBean.mealsNum">
          <el-input
            v-model="formInfo.foodBean.mealsNum"
            placeholder="请输入同时容纳就餐人数"
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

const changeIsFoodBeverage = (e) => {
  if (e == 0) {
    initFoodBean();
  }
};

const clearIsFoodBeverage = () => {
  if (formInfo.value.foodBean.isFoodBeverage == "") {
    formInfo.value.foodBean.isFoodBeverage = null;
    initFoodBean();
  }
};

const initFoodBean = () => {
  formInfo.value.foodBean.mainCuisine = null;
  formInfo.value.foodBean.mealsKinds = null;
  formInfo.value.foodBean.restaurantArea = null;
  formInfo.value.foodBean.restaurantNum = null;
  formInfo.value.foodBean.specialtyStore = null;
  formInfo.value.foodBean.restaurantRoomNum = null;
  formInfo.value.foodBean.mealsNum = null;
};
</script>
<style lang="less" scope></style>
