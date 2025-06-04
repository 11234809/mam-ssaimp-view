<!--
 * @Author: fbz
 * @Date: 2025-03-05 17:51:00
 * @LastEditors: fbz
 * @LastEditTime: 2025-05-16 11:54:20
-->
<!--
 * @Author: fbz
 * @Date: 2025-03-05 17:51:00
 * @LastEditors: fbz
 * @LastEditTime: 2025-05-08 17:07:06
-->
<template>
  <div>
    <div class="title"><span></span>车辆能源补给</div>
    <el-row>
      <el-col :span="24">
        <div class="title_2">基本情况</div>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务区变压器数量" prop="energyBean.transformerNum">
          <el-input
              v-model="formInfo.energyBean.transformerNum"
              placeholder="请输入服务区变压器数量"
              :disabled="formInfoDisabled"
              oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="变压器容量" prop="energyBean.transformerCapacity">
          <el-input
              v-model="formInfo.energyBean.transformerCapacity"
              placeholder="请输入变压器容量"
              :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="已使用容量" prop="energyBean.usedCapacity">
          <el-input
              v-model="formInfo.energyBean.usedCapacity"
              placeholder="请输入已使用容量"
              :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="title_2">加油站</div>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否有加油站" prop="energyBean.isGasStation">
          <el-select
              v-model="formInfo.energyBean.isGasStation"
              placeholder="请选择是否有加油站"
              :disabled="formInfoDisabled"
              clearable
              @change="changeIsGasStation"
              @clear="clearIsGasStation"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
        v-if="
        formInfo.energyBean.isGasStation != 0 && formInfo.energyBean.isGasStation != null
      "
    >
      <el-col :span="8">
        <el-form-item label="运营单位" prop="energyBean.gasStationRunBusiness">
          <el-input
              v-model="formInfo.energyBean.gasStationRunBusiness"
              placeholder="请输入运营单位"
              :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="柴油标号" prop="energyBean.dieselNo">
          <el-input
              v-model="formInfo.energyBean.dieselNo"
              placeholder="请输入柴油标号"
              :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="汽油标号" prop="energyBean.petrolNo">
          <el-input
              v-model="formInfo.energyBean.petrolNo"
              placeholder="请输入汽油标号"
              :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="加油机数量" prop="energyBean.tankerNum">
          <el-input
              v-model="formInfo.energyBean.tankerNum"
              placeholder="请输入加油机数量"
              :disabled="formInfoDisabled"
              oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="加油枪数量" prop="energyBean.oilGunNum">
          <el-input
              v-model="formInfo.energyBean.oilGunNum"
              placeholder="请输入加油枪数量"
              :disabled="formInfoDisabled"
              oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="汽油加油枪数量" prop="energyBean.petrolGunNum">
          <el-input
              v-model="formInfo.energyBean.petrolGunNum"
              placeholder="请输入汽油加油枪数量"
              :disabled="formInfoDisabled"
              oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="柴油加油枪数量" prop="energyBean.dieselGunNum">
          <el-input
              v-model="formInfo.energyBean.dieselGunNum"
              placeholder="请输入柴油加油枪数量"
              :disabled="formInfoDisabled"
              oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="负责人" prop="energyBean.personInChargeGas">
          <el-input
              v-model="formInfo.energyBean.personInChargeGas"
              placeholder="请输入负责人"
              :disabled="formInfoDisabled"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="energyBean.telephoneGas">
          <el-input
              v-model="formInfo.energyBean.telephoneGas"
              placeholder="请输入联系电话"
              :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="title_2">加气站</div>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否有加气站" prop="energyBean.isAirStation">
          <el-select
              v-model="formInfo.energyBean.isAirStation"
              placeholder="请选择是否有加气站"
              :disabled="formInfoDisabled"
              clearable
              @change="changeIsAirStation"
              @clear="clearIsAirStation"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row
        v-if="
        formInfo.energyBean.isAirStation != 0 && formInfo.energyBean.isAirStation != null
      "
    >
      <el-col :span="8">
        <el-form-item label="运营单位" prop="energyBean.airStationRunBusiness">
          <el-input
              v-model="formInfo.energyBean.airStationRunBusiness"
              placeholder="请输入运营单位"
              :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="加气枪数量" prop="energyBean.airGunNum">
          <el-input
              v-model="formInfo.energyBean.airGunNum"
              placeholder="请输入加气枪数量"
              :disabled="formInfoDisabled"
              oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责人" prop="energyBean.personInChargeAir">
          <el-input
              v-model="formInfo.energyBean.personInChargeAir"
              placeholder="请输入负责人"
              :disabled="formInfoDisabled"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="energyBean.telephoneAir">
          <el-input
              v-model="formInfo.energyBean.telephoneAir"
              placeholder="请输入联系电话"
              :disabled="formInfoDisabled"
              oninput="value=value.replace(/[^\d]/g,'')"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="title_2">充电站</div>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否有充电站" prop="energyBean.isChargingStation">
          <el-select
            v-model="formInfo.energyBean.isChargingStation"
            placeholder="请选择是否有充电站"
            :disabled="formInfoDisabled"
            @change="isFilteredIsChargingStationData()"
            clearable
          >
            <el-option 
              v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" 
              :key="item.name+index" 
              :label="item.name" 
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <template v-if="formInfo.energyBean.isChargingStation+'' ==='1'">
      <el-tabs type="border-card">
        <el-tab-pane label="充电站">
          <ServiceAreaVehicleEnergySupplyChargingStations v-bind="$attrs"/>
        </el-tab-pane>
        <el-tab-pane label="充电桩">
          <ServiceAreaVehicleEnergySupplyChargingPiles v-bind="$attrs"/>
        </el-tab-pane>
      </el-tabs>
    </template>
    <el-row>
      <el-col :span="24">
        <div class="title_2">换电站</div>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否有换电站 " prop="energyBean.isExchangeStation">
          <el-select
              v-model="formInfo.energyBean.isExchangeStation"
              placeholder="请选择是否有换电站"
              :disabled="formInfoDisabled"
              clearable
              @change="changeIsExchangeStation"
              @clear="clearIsExchangeStation"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
        v-if="
        formInfo.energyBean.isExchangeStation != 0 &&
        formInfo.energyBean.isExchangeStation != null
      "
    >
      <el-col :span="8">
        <el-form-item label="换电站类型" prop="energyBean.stationType">
          <el-select
              v-model="formInfo.energyBean.stationType"
              placeholder="请选择换电站类型"
              :disabled="formInfoDisabled"
              clearable
          >
            <el-option
                v-for="(item, index) in dictItemsList.exStationTypeDictionary"
                :key="index"
                :label="item.name"
                :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="运营单位" prop="energyBean.exStationRunBusiness">
          <el-input
              :disabled="formInfoDisabled"
              v-model="formInfo.energyBean.exStationRunBusiness"
              placeholder="请输入运营单位"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="运营状态" prop="energyBean.exStationStatus">
          <el-select
              v-model="formInfo.energyBean.exStationStatus"
              placeholder="请选择运营状态"
              :disabled="formInfoDisabled"
              clearable
          >
            <el-option
                v-for="(item, index) in dictItemsList.exchangeStatusDictionary"
                :key="index"
                :label="item.name"
                :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="换电桩数量" prop="energyBean.chargingExchangeNum">
          <el-input
              :disabled="formInfoDisabled"
              v-model="formInfo.energyBean.chargingExchangeNum"
              placeholder="请输入换电桩数量"
              oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="可换电池数量" prop="energyBean.exBatteryNum">
          <el-input
              :disabled="formInfoDisabled"
              v-model="formInfo.energyBean.exBatteryNum"
              placeholder="请输入可换电池数量"
              oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="换电工位数量" prop="energyBean.exWorkerNum">
          <el-input
              :disabled="formInfoDisabled"
              v-model="formInfo.energyBean.exWorkerNum"
              placeholder="请输入换电工位数量"
              oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="日均使用次数" prop="energyBean.daysUse">
          <el-input
              :disabled="formInfoDisabled"
              v-model="formInfo.energyBean.daysUse"
              placeholder="请输入日均使用次数"
              onkeyup="this.value=this.value.match(/\d+\.?\d{0,2}/);"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useAreaInfoStore } from "../../../../store/useAreaInfoStore";
import  ServiceAreaVehicleEnergySupplyChargingStations from "../components/service-area-vehicle-energy-supply-charging-stations.vue"; 
import  ServiceAreaVehicleEnergySupplyChargingPiles from "../components/service-area-vehicle-energy-supply-charging-piles.vue";  
const areaInfoStore = useAreaInfoStore();

const {
  formInfoDisabled,
  validatorRules,
  formInfo,
  navigationList,
  flag,
  dictItemsList,
} = storeToRefs(areaInfoStore);

// 是否有充电站 没有 则清空数据和校验规则
const isFilteredIsChargingStationData = () => {
  if (formInfo.value.energyBean.isChargingStation*1 == 0) {
    formInfo.value.energyBean.chargeStationList = [];
    formInfo.value.energyBean.chargePileList = [];
  }else if(formInfo.value.energyBean.isChargingStation*1 == 1){
    formInfo.value.energyBean.chargeStationList = [{
      stationName: null,// 充电站名称
      stationAddress: null,// 充电站地址
      longitude: null,// 经度
      latitude: null,// 纬度
      transformerCapacity: null,// 箱变容量（kVA）
      ratedTotalPower: null,// 额定总功率（kW）
      isIntegratedStorage: 0,// 是否为充储一体化站 0否 1是
      energyStorageCapacity: null,// 储能配置规模（kWh）
      dischargeDuration: null,// 放电时间（h）
      hasSolarPower: 0,// 是否有光伏供能 0否 1是
      solarPowerCapacity: null,// 光伏配置规模（kWp）
      isV2gStation: 0,// 是否为V2G充电站 0否 1是
      v2gStationType: null,// V2G充电站类型
      v2gPileCount: null,// V2G充电桩数量
      v2gDischargePower: null,// V2G放电功率（kW）
      cameraCount: null,// 充电站摄像机数量
      hasCanopy: "1",// 是否有车棚 0否 1是
      stationStatus: null,// 充电站状态
      stationType: null,// 充电站类型
      parkingFeeType: null,// 停车费类型
      is24HoursOperation: '1',// 是否24小时开放 0否 1是
      paymentMethods: [],// 支付方式 多个逗号分隔
      stationPhone: null,// 充电站电话
      servicePhone: null,// 服务电话
      constructionLocation: null,// 建设场所
      surroundingEnvironment: null,// 周边环境
      surroundingFacilities: [],// 周边设施 多个逗号分隔
      builtTime: null,// 建设时间
      commissioningTime: null,// 投运时间
      stationPhotosList : [],// 充电站照片 多个逗号分隔
    }];
    formInfo.value.energyBean.chargePileList=[{
      serviceAreaId: null,// 服务区域ID
      stationName: null,// 充电站名称
      chargerCount: null,// 充电桩数量
      deviceCode: null,// 设备编码
      deviceName: null,// 设备名称
      deviceType: null,// 设备类型
      totalPower: null,// 充电设备总功率（kW）
      maxPower: null,// 充电设备最大功率（kW）
      gunCount: null,// 充电枪数量
      voltageRange: null,// 电压范围
      manufacturer: null,// 生产厂家
      maxCurrent: null,// 充电设备最大电流（A）
      builtTime: null,// 建设时间
      operationTime: null,// 运营时间
      gunImagesList: [],// 充电桩充电枪数图片（最多3张）
      nameplateImagesList: [],// 充电桩铭牌图片（最多3张）
      inspectionReportImagesList: [],// 第三方检测报告（最多3张）
      chargeGunList:[// 充电枪列表
        { 
          interfaceCode: null,// 充电设备接口编码
          interfaceName: null,// 充电设备接口名称
          isLinkedToCheck: null,// 是否与第三方检测系统对接 0否 1是
        }
      ]
    }];
  }
}

</script>
<style lang="less" scope>
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
</style>
