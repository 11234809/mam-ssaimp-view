<!-- @format -->

<template>
  <div class="drwaer">
    <div class="infoL">
      <div
        v-for="(item, i) in navigationList"
        :key="i"
        @click="handleClick(i)"
        :class="i == indexL ? 'title_left' : 'title_left_1'"
      >
        <span v-show="i == indexL"></span>
        {{ item.text }}（{{ item.number }}/{{ item.total }}）
      </div>
    </div>
    <div class="infoR">
      <el-form
        :inline="true"
        :model="formInfo"
        ref="infoRuleForm"
        :rules="validatorRules"
        :validate-on-rule-change="false"
      >
        <div class="boxR">
          <div
            v-for="(item, i) in components"
            :key="i"
            :ref="(el) => setCombinationRef(el, `comb-${i}`)"
            class="combination"
          >
            <component :is="item" :infoRuleForm="infoRuleForm"/>
          </div>
        </div>
        <div class="processing-personnel">
          <div
            v-if="
              flag == 'add' ||
              flag == 'edit' ||
              ((flag == 'backlog' || flag == 'todo') && formInfo.auditStatus == '2')
            "
          >
            <el-col :span="18">
              <el-form-item label="下一步处理人" prop="basicBean.auditUserId">
                <el-select
                  v-model="formInfo.basicBean.auditUserId"
                  placeholder="请选择下一步处理人"
                  :disabled="commitStatus"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in companyManagerList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div v-if="flag == 'todo'">
            <el-col :span="24" v-if="formInfo.auditStatus == 1">
              <el-form-item label="是否通过" prop="isStatus">
                <el-radio-group :disabled="commitStatus" v-model="formInfo.isStatus">
                  <el-radio :label="0" :value="0" size="large">通过</el-radio>
                  <el-radio :label="1" :value="1" size="large">驳回</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审核意见" prop="comment">
                <el-input
                  v-model="formInfo.comment"
                  placeholder="请输入审核意见"
                  :disabled="commitStatus"
                ></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div v-if="flag == 'todo'" style="margin-top: 6px">
            <el-col
              :span="6"
              v-if="
                formInfo.auditStatus == 1 ||
                formInfo.auditStatus == 2 ||
                formInfo.auditStatus == 3
              "
            >
              <el-button type="primary" @click="viewAuditHistory">
                查看审核历史纪录
                <el-icon v-if="historyLoading">
                  <Loading />
                </el-icon>
              </el-button>
            </el-col>
          </div>
        </div>
      </el-form>
      <el-dialog v-model="auditHistoryVisible" title="审核历史纪录" width="1000">
        <el-table
          :data="auditHistoryData"
          tooltip-effect="dark"
          style="width: 100%"
          height="400"
          max-height="400"
          :row-style="{ height: '46px' }"
          empty-text="暂无数据"
          :table-layout="auto"
          border
        >
          <el-table-column type="index" width="60" align="center" label="序号" />
          <el-table-column property="assigneeName" label="审核人" width="180" />
          <el-table-column property="activityName" label="审核节点" />
          <el-table-column property="fullMessage" show-overflow-tooltip label="审核意见" min-width="180" />
          <el-table-column property="endTime" label="审核时间" />
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
import {storeToRefs} from 'pinia';
import {ElMessage} from "element-plus";
import {defineComponent, defineExpose, nextTick, onMounted, reactive, ref, useTemplateRef} from 'vue';
import serviceAreaInfo from './service-area-info.vue';
import serviceAreaStaff from './service-area-staff.vue';
import serviceOfficeSpace from './service-area-office-space.vue';
import serviceVenueArea from './service-area-venue-area.vue';
import serviceParkingSpaces from './service-area-parking-spaces.vue';
import servicePublicToilets from './service-area-public-toilets.vue';
import serviceSupermarket from './service-area-supermarket.vue';
import serviceRestaurant from './service-area-restaurant.vue';
import serviceGuestRoom from './service-area-guest-room.vue';
import serviceShowerRoom from './service-area-shower-room.vue';
import serviceAreaAddWater from './service-area-add-water.vue';
import serviceAreaAutoRepair from './service-area-auto-repair.vue';
import serviceVehicleEnergySupply from './service-area-vehicle-energy-supply.vue';
import serviceNursingRoom from './service-area-nursing-room.vue';
import servieceAreaEmergencyRescue from './service-area-emergency-rescue.vue';
import serviceAreaEmisssionReduction from './service-area-emission-reduction.vue';
import sercieHealthCare from './service-area-health-care.vue';
import serviceQualityAssurance from './service-area-quality-assurance.vue';
import serviceInformationDelivery from './service-area-information-delivery.vue';
import serviceSecurityMonitoring from './service-area-security-monitoring.vue';
import serviceRvPark from './service-area-rv-park.vue';
import serviceFreeRest from './service-area-free-rest.vue';
import serviceSafe from './service-area-safe.vue';
import serviceEtcLane from './service-area-etc-lane.vue';
import serviceElectricity from './service-area-electricity.vue';
import serviceDriverHouse from './service-area-driver-house.vue';
import serviceHydrogen from './service-area-hydrogen.vue'
import {useAreaInfoStore} from '../../../../store/useAreaInfoStore';

const areaInfoStore = useAreaInfoStore();
const {
  formInfo,
  validatorRules,
  navigationList,
  flag,
  formInfoDisabled,
  formInfoProcessDisabled,
  companyManagerList,
  auditHistoryVisible,
  auditHistoryData,
  historyLoading,
} = storeToRefs(areaInfoStore);
const { getAuditHistory } = areaInfoStore;

defineComponent({
  components: {
    serviceAreaInfo, //服务区基本信息
    serviceAreaStaff, //服务区工作人员
    serviceOfficeSpace, // 经营管理单位办公用房
    serviceVenueArea, // 服务区场所面积
    serviceParkingSpaces, // 停车位数
    servicePublicToilets, //公共卫生间
    serviceSupermarket, // 商超
    serviceRestaurant, // 餐饮
    serviceGuestRoom, //客房
    serviceShowerRoom, // 淋浴
    serviceAreaAddWater, // 加水
    serviceAreaAutoRepair, // 汽修
    serviceVehicleEnergySupply, //车辆能源补给
    serviceNursingRoom, //母婴室
    servieceAreaEmergencyRescue, // 应急救援
    serviceAreaEmisssionReduction, // 节能减排绿色
    sercieHealthCare, // 医疗卫生
    serviceQualityAssurance, // 质量保障
    serviceInformationDelivery, // 信息发布
    serviceSecurityMonitoring, // 安全监控
    serviceRvPark, //房车营地
    serviceFreeRest, // 免费休息区
    serviceSafe, // 安全保障
    serviceEtcLane, // ETC车道
    serviceElectricity, // 光伏电力
    serviceDriverHouse, // 司机之家
    serviceHydrogen, // 加氢气
  },
});
// const infoRuleForm = ref(null);
const infoRuleForm = useTemplateRef("infoRuleForm");
const rightBox = ref(null);
const indexL = ref(0);
const components = ref([
  serviceAreaInfo, //服务区基本信息
  serviceAreaStaff, //服务区工作人员
  serviceOfficeSpace, // 经营管理单位办公用房
  serviceVenueArea, // 服务区场所面积
  serviceParkingSpaces, // 停车位数
  servicePublicToilets, //公共卫生间
  serviceSupermarket, // 商超
  serviceRestaurant, // 餐饮
  serviceGuestRoom, //客房
  serviceShowerRoom, // 淋浴
  serviceAreaAddWater, // 加水
  serviceAreaAutoRepair, // 汽修
  serviceVehicleEnergySupply, //车辆能源补给
  serviceNursingRoom, //母婴室
  servieceAreaEmergencyRescue, // 应急救援
  serviceAreaEmisssionReduction, // 节能减排绿色
  sercieHealthCare, // 医疗卫生
  serviceQualityAssurance, // 质量保障
  serviceInformationDelivery, // 信息发布
  serviceSecurityMonitoring, // 安全监控
  serviceRvPark, //房车营地
  serviceFreeRest, // 免费休息区
  serviceSafe, // 安全保障
  serviceEtcLane, // ETC车道
  serviceElectricity, // 光伏电力
  serviceDriverHouse, // 司机之家
  serviceHydrogen, // 加氢气
]);
// 使用reactive创建一个响应式的对象来存储refs
const combinationRefs = reactive({});
const viewAuditHistoryVisible = ref(false);
const viewAuditHistoryData = ref([]);

onMounted(() => {
  if (indexL.value != 0) {
    indexL.value = 0;
  }
});

// 动态设置ref
const setCombinationRef = (element, i) => {
  if (element) {
    combinationRefs[i] = element;
  }
};

// 提供一个方法来获取特定的ref
const getCombinationRef = (i) => {
  return combinationRefs[i];
};
/**
 *@description 基本信息左侧数据点击处理
 */
const handleClick = async (i) => {
  indexL.value = i;
  const el = getCombinationRef(`comb-${i}`);
  if (el) {
    await nextTick();
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const viewAuditHistory = () => {
  getAuditHistory();
};

const validateForm = async () => {
  try {
    await infoRuleForm.value.validate();
    return 'success';
  } catch (errors) {
    const errorFields = Object.values(errors);
    ElMessage.error(errorFields[0][0].message);
    return 'failed';
  }
};
const clearValidate = (attribute) => {
  infoRuleForm.value.clearValidate(attribute);
};
defineExpose({ validateForm,formInfo,clearValidate });
</script>
<style lang="less" scope>
.drwaer {
  display: flex;
  width: 100%;
  height: 100%;
  .avatar-uploader .el-upload {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    flex-direction: column;
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 88px;
      text-align: center;
    }
  }

  .avatar-uploader .el-upload:hover {
    border-color: #3890f2;
  }

  .infoL {
    width: 21%;
    overflow-y: auto;
    height: 100%;
    padding: 30px 0 30px 34px;
    /* 针对Webkit内核的浏览器 */
    &::-webkit-scrollbar {
      /* 设置滚动条的宽度 */
      width: 6px;
    }

    /* 滚动条轨道 - 背景颜色/白底 */
    &::-webkit-scrollbar-track {
      background: #cccdcf;
      border-radius: 4px;
    }

    /* 滚动条的滑块部分 */
    &::-webkit-scrollbar-thumb {
      background: #114484;
      border-radius: 4px;
    }

    .title_left,
    .title_left_1 {
      display: flex;
      align-items: center;
      height: 34px;
      padding: 10px;
      margin-bottom: 20px;
      font-size: var(--fontSize14);
      cursor: pointer;
      span {
        width: 5px;
        height: 16px;
        background: #114484;
        display: inline-block;
        margin-right: 4px;
      }
    }

    .title_left:nth-last-child(1),
    .title_left_1:nth-last-child(1) {
      margin-bottom: 0;
    }
    .title_left {
      color: #29425d;
      font-weight: bold;
    }

    .title_left_1 {
      color: #535a6a;
    }
  }
  /* 隐藏水平滚动条 */

  .infoR {
    width: 79%;
    .el-form {
      height: 100%;

      .boxR {
        //height: 840px;
        height: 100%;
        padding: 10px;
        overflow-y: auto;
        overflow-x: hidden;
        &::-webkit-scrollbar {
          display: none;
        }

        /* 隐藏垂直滚动条 */
        &::-webkit-scrollbar {
          width: 0; /* 对于垂直滚动条 */
          height: 0; /* 对于水平滚动条 */
        }
        /* 隐藏 Webkit 浏览器的滚动条 */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */

        /* 隐藏 Webkit 浏览器的滚动条 */
        -webkit-scrollbar: none; /* Chrome, Safari, and Opera */
        .combination {
          background: white;
          margin-top: 30px;
          padding: 20px;
          border-radius: 6px;
        }
        .combination:nth-child(1) {
          margin-top: 0;
        }

        .el-form-item {
          width: 100%;
          display: flex;
          flex-direction: column;
          .el-form-item__label {
            display: block !important;
          }
          .el-form-item__content {
            .el-select {
              width: 100%;
            }
          }
        }
        .el-col {
          display: flex;
        }

        .title {
          display: inline-block;
          font-size: 18px;
          width: 100%;
          color: #29425d;
          margin-bottom: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          span {
            width: 5px;
            height: 16px;
            background: #114484;
            display: inline-block;
            margin-right: 6px;
          }
        }

        .title_2 {
          width: 32%;
          height: 22px;
          font-size: 15px;
          display: inline-block;
          padding-left: 15px;
          margin: 10px 20px;
          line-height: 22px;
          color: #3890f2;
          background-color: rgba(56, 144, 242, 0.2);
          border-radius: 2px;
        }

        .title_3 {
          width: 30%;
          height: 22px;
          font-size: 15px;
          display: inline-flex;
          padding: 0 15px;
          margin: 10px 20px;
          color: #a8b68a;
          background-color: rgba(22, 231, 25, 0.2);
          border-radius: 2px;
          align-items: center;
          justify-content: space-between;
        }

        .labelTip {
          position: absolute;
          z-index: 11111;
          left: 0;
          top: 30px;
          text-align: right;
          color: red;
          font-size: 12px;
        }
      }
    }
    .processing-personnel {
      display: flex;
      position: fixed;
      bottom: 0;
      right: 20%;
      .el-col-18 {
        background-color: #fff;
        display: flex;
        justify-content: end;
        .el-select {
          width: 500px;
        }
      }
    }
  }
  .el-radio-group {
    display: flex;
  }
}
</style>
