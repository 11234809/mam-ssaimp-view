<!--
 * @Author: fbz
 * @Date: 2025-05-06 15:16:19
 * @LastEditors: fbz
 * @LastEditTime: 2025-05-20 10:10:44
-->
<template>
  <div class="service-area-info">
    <div class="title"><span></span>光伏发电</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有光伏发电" prop="electricityBean.isPvGenStation">
          <el-select
              v-model="formInfo.electricityBean.isPvGenStation"
              placeholder="请选择是否有光伏发电"
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
    <el-row v-if="formInfo.electricityBean.isPvGenStation != 0 && formInfo.electricityBean.isPvGenStation != null">
      <el-col :span="8">
        <el-form-item label="项目法人：" prop="electricityBean.projectEntity">
          <el-input v-model="formInfo.electricityBean.projectEntity"  maxlength="50" show-word-limit placeholder="请输入项目法人" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建设单位：" prop="electricityBean.constructionUnit">
          <el-input v-model="formInfo.electricityBean.constructionUnit" maxlength="50" show-word-limit placeholder="请输入建设单位" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建设状态：" prop="electricityBean.constructionState">
          <el-select v-model="formInfo.electricityBean.constructionState" placeholder="请选择建设状态" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item,index) in dictItemsList.basAreaInfoConstructionStateDictionary" :key="item.name+index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="类型：" prop="electricityBean.photoType">
          <el-select
            v-model="formInfo.electricityBean.photoType"
            placeholder="请选择类型"
            clearable
            :disabled="formInfoDisabled"
            @change="changePhotoType">
            <!-- <el-option label="独立光伏" value="独立光伏"></el-option>
            <el-option label="分布式光伏" value="分布式光伏"></el-option> -->
            <el-option
              v-for="(item,index) in dictItemsList.basAreaInfoElectTypeDictionary"
              :key="item.name+index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="光伏场景：" prop="electricityBean.photoScene">
          <el-select v-model="formInfo.electricityBean.photoScene" placeholder="请先选择类型" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item,index) in photoTypeList" :key="item.code+index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="并网模式：" prop="electricityBean.synchronizeMode">
          <el-checkbox-group v-model="formInfo.electricityBean.synchronizeMode" :disabled="formInfoDisabled">
            <el-checkbox :label="item.code" v-for="(item,index) in dictItemsList.basAreaInfoModeDictionary" :key="item.name+index">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="光伏设备总容量：" prop="electricityBean.totalPhotoCapacity">
          <el-input v-model="formInfo.electricityBean.totalPhotoCapacity" placeholder="请输入光伏设备总容量" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否有储能设备：" prop="electricityBean.isEnergyDevice">
          <el-select
            v-model="formInfo.electricityBean.isEnergyDevice"
            placeholder="请选择是否有储能设备"
            clearable
            :disabled="formInfoDisabled"
            @change="changeIsEnergyDevice">
            <!-- <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option> -->
            <el-option v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" :key="item.name+index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="储能设备总容量（千瓦时）：" prop="electricityBean.totalEnergyCapacity">
          <el-input v-model="formInfo.electricityBean.totalEnergyCapacity" placeholder="请输入储能设备总容量" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="年均发电量（千瓦时）：" prop="electricityBean.annualAverageCapacity">
          <el-input v-model="formInfo.electricityBean.annualAverageCapacity" placeholder="请输入年均发电量" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="年均发电小时：" prop="electricityBean.annualAverageHours">
          <el-input v-model="formInfo.electricityBean.annualAverageHours"  placeholder="请输入年均发电小时" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="年均上网电量（千瓦时）：" prop="electricityBean.annualAverageOnlineCapacity">
          <el-input v-model="formInfo.electricityBean.annualAverageOnlineCapacity" placeholder="请输入年均上网电量" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建成投用时间：" prop="electricityBean.actualTime">
          <el-date-picker v-model="formInfo.electricityBean.actualTime" type="month" value-format="YYYY-MM" placeholder="请选择建成时间"
          :disabled="formInfoDisabled" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="并网时间：" prop="electricityBean.gridConnectionTime">
          <el-date-picker v-model="formInfo.electricityBean.gridConnectionTime" type="month" value-format="YYYY-MM" placeholder="请选择并网时间："
          :disabled="formInfoDisabled" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="并网电压等级：" prop="electricityBean.gridConnectionVoltageLevel">
          <el-input v-model="formInfo.electricityBean.gridConnectionVoltageLevel" placeholder="请输入并网电压等级" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="备注：" prop="electricityBean.note">
          <el-input v-model="formInfo.electricityBean.note"  type="textarea"  maxlength="300" show-word-limit placeholder="请输入备注" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import {storeToRefs} from "pinia";
import {useAreaInfoStore} from "../../../../store/useAreaInfoStore";
import {computed, ref, watch} from "vue"

const areaInfoStore = useAreaInfoStore();
  const { formInfoDisabled, formInfo,validatorRules,dictItemsList } = storeToRefs(areaInfoStore);

  // 并网模式夫默认值
  watch(() => {
    formInfo.value.electricityBean.synchronizeMode;
  },(newValue) => {
    formInfo.value.electricityBean.synchronizeMode = formInfo.value.electricityBean.synchronizeMode?? []
  }, { immediate: true })

  let photoTypeList = ref([]);
  const changePhotoType = (e) => {
    photoTypeList.value = photoTypeObject.value[e]
  }
  // 光伏场景联动列表
  const photoTypeObject = computed(() =>
    {
      return {
        [dictItemsList.value.basAreaInfoElectTypeDictionary?.[0]?.code]: dictItemsList.value.basAreaInfoElectDisDictionary,
        [dictItemsList.value.basAreaInfoElectTypeDictionary?.[1]?.code]: dictItemsList.value.basAreaInfoElectIndDictionary,
      }
    }
  );

  //是否有储能设备改变时对储能设备总容量（千瓦时）的校验规则进行改变
  const changeIsEnergyDevice = (e) => {
    if (!e) {
      validatorRules.value.electricityBean.totalEnergyCapacity = [{ required: false, message: "请输入储能设备总容量（千瓦时）!" }];
    }else{
      validatorRules.value.electricityBean.totalEnergyCapacity = [{ required: true, message: "请输入储能设备总容量（千瓦时）!" }];
    }
  }


  function  changeIsElectricity(e){
    if(e === 0){
      initData()
      formInfo.value.electricityBean.isPvGenStation = 0;
    }
  }

  function  clearIsElectricity(){
    if (formInfo.value.electricityBean.isPvGenStation === "") {
      initData()
      formInfo.value.electricityBean.isPvGenStation = null;
    }
  }

  function  initData(){
    // formInfo.electricityBean
    console.log(formInfo.value.electricityBean,'formInfo.electricityBean')
    // Object.keys(formInfo.value.electricityBean).forEach((key) => {
    //   formInfo.value.electricityBean[key] = null
    // })

    formInfo.value.electricityBean = {
      ...formInfo.value.electricityBean,
      isPvGenStation:null,
      projectEntity:null, // 项目法人
      constructionUnit:null, // 建设单位
      constructionState:null, // 建设状态
      photoType:null, // 类型  独立光伏 0/分布式光伏 1
      photoScene:null, // 光伏场景
      synchronizeMode:[], // 并网模式 自发自用0；自发自用1，余电上网2；全额上网3
      isEnergyDevice:null, // 是否有储能设备
      totalPhotoCapacity:null, // 光伏设备总容量（千瓦）
      totalEnergyCapacity:null, // 储能设备总容量（千瓦）
      annualAverageCapacity :null, // 年平均容量（千瓦）
      annualAverageHours :null, // 年均发电小时
      annualAverageOnlineCapacity :null, // 年均上网电量（千瓦时）
      actualTime :null, // 建成投用时间
      gridConnectionTime :null, // 并网时间
      gridConnectionVoltageLevel :null, // 并网电压等级
      note :null, // 备注
    }
    // formInfo.value.electricityBean.isPvGenStation = '0'
  }
</script>
