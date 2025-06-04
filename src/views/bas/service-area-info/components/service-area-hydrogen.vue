<!--
 * @Author: fbz
 * @Date: 2025-05-06 15:16:19
 * @LastEditors: fbz
 * @LastEditTime: 2025-05-20 10:10:44
-->
<template>
  <div class="service-area-info">
    <div class="title"><span></span>加氢站</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有加氢站" prop="addHydrogenBean.isHydrogenStation">
          <el-select
              v-model="formInfo.addHydrogenBean.isHydrogenStation"
              placeholder="请选择是否有加氢站"
              :disabled="formInfoDisabled"
              clearable
              @change="changeIsElectricity"
              @clear="clearIsElectricity"
          >

            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="formInfo.addHydrogenBean?.isHydrogenStation != 0 && formInfo.addHydrogenBean?.isHydrogenStation != null">
<!--      <el-col :span="8">-->
<!--        <el-form-item label="项目法人：" prop="electricityBean.projectEntity">-->
<!--          <el-input v-model="formInfo.electricityBean.projectEntity"  maxlength="50" show-word-limit placeholder="请输入项目法人" :disabled="formInfoDisabled"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-col>-->
    </el-row>
  </div>
</template>
<script setup>
import {storeToRefs} from "pinia";
import {useAreaInfoStore} from "../../../../store/useAreaInfoStore";

const areaInfoStore = useAreaInfoStore();
  const { formInfoDisabled, formInfo,validatorRules,dictItemsList } = storeToRefs(areaInfoStore);


  function  changeIsElectricity(e){
    if(e === 0){
      initData()
      formInfo.value.addHydrogenBean.isHydrogenStation = 0;
    }
  }

  function  clearIsElectricity(){
    if (formInfo.value.electricityBean.isPvGenStation === "") {
      initData()
    }
  }

  function  initData(){
    Object.keys(formInfo.value.addHydrogenBean).forEach((key) => {
      formInfo.value.addHydrogenBean[key] = null
    })
  }
</script>
