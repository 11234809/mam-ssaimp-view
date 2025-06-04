<!-- @format -->

<template>
  <div>
    <div class="title">停车位数</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有停车场" prop="carBean.isParking">
          <el-select
            v-model="formInfo.carBean.isParking"
            placeholder="请选择是否有停车场"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsParking"
            @clear="clearIsParking"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      v-if="formInfo.carBean.isParking != '0' && formInfo.carBean.isParking != null"
    >
      <el-col :span="8">
        <el-form-item label="是否设置客运汽车停靠站" prop="carBean.isPassengerStop">
          <el-select
            v-model="formInfo.carBean.isPassengerStop"
            placeholder="请选择是否设置客运汽车停靠站"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="大客车位数量" prop="carBean.buses">
          <el-input
            v-model="formInfo.carBean.buses"
            placeholder="请输入大客车位数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="货车位数量" prop="carBean.largeTruck">
          <el-input
            v-model="formInfo.carBean.largeTruck"
            placeholder="请输入货车位数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="小车位数量" prop="carBean.smallCars">
          <el-input
            v-model="formInfo.carBean.smallCars"
            placeholder="请输入小车位数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="危化品车位数量" prop="carBean.dangerousGoodsCarrier">
          <el-input
            v-model="formInfo.carBean.dangerousGoodsCarrier"
            placeholder="请输入危化品车位数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="牲畜车位数量" prop="carBean.livestockTruck">
          <el-input
            v-model="formInfo.carBean.livestockTruck"
            placeholder="请输入牲畜车位数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="充电停车位数量" prop="carBean.electricCar">
          <el-input
            v-model="formInfo.carBean.electricCar"
            placeholder="请输入充电停车位数量"
            :disabled="formInfoDisabled"
            @blur="areaInfoStore.computeReservedElectricCar"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="拖挂车位数量" prop="carBean.trailer">
          <el-input
            v-model="formInfo.carBean.trailer"
            placeholder="请输入拖挂车位数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="房车位数量" prop="carBean.limo">
          <el-input
            v-model="formInfo.carBean.limo"
            placeholder="请输入房车位数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="无障碍车位数量" prop="carBean.barrierFreeCar">
          <el-input
            v-model="formInfo.carBean.barrierFreeCar"
            placeholder="请输入无障碍车位数量"
            :disabled="formInfoDisabled"
            @blur="areaInfoStore.computeReservedElectricCar"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="女性车位数量" prop="carBean.femaleCar">
          <el-input
            v-model="formInfo.carBean.femaleCar"
            placeholder="请输入女性车位数量"
            :disabled="formInfoDisabled"
            @blur="areaInfoStore.computeReservedElectricCar"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="预留充电停车位数量" prop="carBean.reservedElectricCar">
          <span class="labelTip">（不计入总车位数）</span>
          <el-input
            v-model="formInfo.carBean.reservedElectricCar"
            placeholder="请输入预留充电停车位数量"
            disabled
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
import { storeToRefs } from 'pinia';
import { useAreaInfoStore } from '../../../../store/useAreaInfoStore';
const areaInfoStore = useAreaInfoStore();
const { formInfoDisabled, formInfo } = storeToRefs(areaInfoStore);

const changeIsParking = (e) => {
  if (e == 0) {
    initCarBean();
  }
};

const clearIsParking = (e) => {
  if (formInfo.value.carBean.isParking == '') {
    formInfo.value.carBean.isParking = null;
    initCarBean();
  }
};

const initCarBean = () => {
  formInfo.value.carBean.isPassengerStop = null;
  formInfo.value.carBean.buses = null;
  formInfo.value.carBean.largeTruck = null;
  formInfo.value.carBean.smallCars = null;
  formInfo.value.carBean.dangerousGoodsCarrier = null;
  formInfo.value.carBean.livestockTruck = null;
  formInfo.value.carBean.electricCar = null;
  formInfo.value.carBean.trailer = null;
  formInfo.value.carBean.limo = null;
  formInfo.value.carBean.barrierFreeCar = null;
  formInfo.value.carBean.femaleCar = null;
  formInfo.value.carBean.reservedElectricCar = null;
};
</script>
<style lang="less" scope></style>
