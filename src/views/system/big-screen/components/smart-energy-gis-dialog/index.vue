<template>
  <el-dialog
    v-model="visibleInner"
    :width="width"
    :before-close="handleClose"
    class="site-detail-dialog"
    append-to-body
  >
    <div :class="stationData.type == '1' ? 'dialog-title' : 'dialog-title1'">
      {{ subTitle }}
    </div>

    <div
      :class="stationData.type == '1' ? 'dialog-content' : 'dialog-content2'"
    >
      <!-- 如果有图片 -->
      <!-- 仅当 type === '1' 时渲染图片区域 -->
      <div class="left-photo" v-if="stationData.type == '1'">
        <!-- 多图模式 -->
        <template v-if="Array.isArray(stationData.img)">
          <el-image
            v-for="(img, index) in stationData.img"
            :key="index"
            :src="img"
            :preview-src-list="srcList"
            :preview-teleported="true"
            fit="cover"
            class="preview-img"
          />
        </template>

        <!-- 单图模式 -->
        <template v-else>
          <el-image
            :src="stationData.img"
            :preview-src-list="srcList"
            :preview-teleported="true"
            fit="cover"
            class="preview-img"
          />
        </template>
      </div>

      <!-- 右侧字段信息 -->
      <div class="right-info" v-if="stationData.type == '1'">
        <!-- 充电站名称 -->
        <div class="right-info-title">
          <span class="right-info-title-left">{{
            stationData.stationName
          }}</span>
          <span class="right-info-title-right">
            {{ stationData.supperGunNum > 1 ? "超充站" : "" }}
          </span>
          <div class="stationId">充电站编号:{{ stationData.stationId }}</div>
        </div>
        <div class="right-info-content">
          <div class="right-info-content-item-7">
            <div>站点状态: {{ getStatusText(stationData.stationStatus) }}</div>
            <div>
              7×24小时营业:
              {{ formatBoolean(stationData.is24HoursOperation) }}
            </div>
          </div>
          <div class="right-info-content-item">
            <div>站点电话: {{ stationData.servicePhone }}</div>
            <div>服务电话: {{ stationData.servicePhone }}</div>
          </div>
          <div class="right-info-content-item">
            <div>充电桩数: {{ stationData.chargingPileNum }}</div>
            <div>充电枪数: {{ stationData.chargeGunNum }}</div>
          </div>
          <div class="right-info-content-item">
            <div>超充枪数: {{ stationData.supperGunNum }}</div>
            <div>快充枪数: {{ stationData.quickGunNum }}</div>
          </div>
        </div>
        <div class="right-info-bottom">
          <el-tag
            v-for="method in stationData.paymentMethods"
            :key="method"
            type="primary"
            style="margin-right: 5px"
            effect="dark"
          >
            {{ getPaymentMethodText(method) }}
          </el-tag>
        </div>
      </div>

      <!-- 不为1的是时候显示 -->
      <div class="right-info" v-if="stationData.type != '1'">
        <!-- 充电站名称 -->
        <div class="right-info-title">
          <span class="right-info-title-left">{{ stationData.oilName }}</span>
        </div>
        <div class="right-info-content">
          <div class="right-info-content-item-7">
            <div>运营单位: {{ stationData.gasStationRunBusiness }}</div>
            <div>
              加油机数量:
              {{ stationData.tankerNum }}
            </div>
          </div>
          <div class="right-info-content-item">
            <div>加油枪数量: {{ stationData.oilGunNum }}</div>
            <div>汽油加油枪数量: {{ stationData.petrolGunNum }}</div>
          </div>
          <div class="right-info-content-item">
            <div>柴油加油枪数量: {{ stationData.dieselGunNum }}</div>
            <div>柴油标号: {{ stationData.dieselNo }}</div>
          </div>
          <div class="right-info-content-item">
            <div>汽油标号: {{ stationData.petrolNo }}</div>
            <div>负责人: {{ stationData.personInChargeGas }}</div>
          </div>
          <div class="right-info-content-item">
            <div>联系电话: {{ stationData.telephoneGas }}</div>
          </div>
        </div>
        <div class="right-info-bottom">
          <el-tag
            v-for="method in stationData.paymentMethods"
            :key="method"
            type="primary"
            style="margin-right: 5px"
            effect="dark"
          >
            {{ getPaymentMethodText(method) }}
          </el-tag>
        </div>
      </div>

      <!-- 不为1的时候显示 -->
      <div class="left-photo" v-if="stationData.type != '1'">
        <!-- 多图模式 -->
        <template v-if="Array.isArray(stationData.img)">
          <el-image
            v-for="(img, index) in stationData.img"
            :key="index"
            :src="img"
            :preview-src-list="srcList"
            :preview-teleported="true"
            fit="cover"
            class="preview-img"
          />
        </template>

        <!-- 单图模式 -->
        <template v-else>
          <el-image
            :src="stationData.img"
            :preview-src-list="srcList"
            :preview-teleported="true"
            fit="cover"
            class="preview-img"
          />
        </template>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  subTitle: {
    type: String,
    default: "充电站详情",
  },
  stationData: {
    type: Object,
    default: () => ({}),
  },
  width: {
    type: String,
    default: "900px",
  },
});

const emit = defineEmits(["update:visible", "close"]);

const visibleInner = ref(props.visible);

// 支付方式转换
const getPaymentMethodText = (method) => {
  const paymentMethodMap = {
    1: "刷卡",
    199: "充电卡",
    2: "线上",
    201: "微信",
    202: "支付宝",
    299: "二维码",
    298: "账户余额",
    297: "电子钱包",
  };

  // 处理1xx和2xx的通用情况
  if (!paymentMethodMap[method]) {
    if (method.startsWith("1")) {
      return "刷卡(其他)";
    } else if (method.startsWith("2")) {
      return "线上(其他)";
    }
    return "未知支付方式";
  }

  return paymentMethodMap[method];
};

// 7X24小时营业
const formatBoolean = (value) => {
  if (value === true) return "是";
  if (value === false) return "否";
  return "--";
};

// 站点状态
const getStatusText = (status) => {
  const statusMap = {
    0: "未知",
    1: "建设中",
    5: "关闭下线",
    6: "维护中",
    50: "正常使用",
  };
  return statusMap[status] || `未知状态(${status})`;
};

// 同步外部visible变化
watch(
  () => props.visible,
  (val) => {
    visibleInner.value = val;
  }
);

// 内部visible变化通知外部
watch(visibleInner, (val) => {
  emit("update:visible", val);
  if (!val) {
    emit("close");
  }
});

const handleClose = () => {
  visibleInner.value = false;
};
</script>

<style scoped>
.site-detail-dialog {
  font-weight: bold;
  color: #fff;
  background: url(../../images/smartEnergy/model_content.png) no-repeat;
}
.dialog-title {
  background: url(../../images/smartEnergy/tit_bg.png) no-repeat;
  color: #ffffff;
  background-size: auto 100%;
  padding: 10px 30px 10px 85px;
  font-size: 20px;
}

.dialog-title1 {
  background: url(../../images/smartEnergy/model_title.png) no-repeat;
  color: #ffffff;
  background-size: auto 100%;
  padding: 10px 30px 10px 85px;
  font-size: 20px;
  margin: -33px -17px -16px -17px;
}

.dialog-content {
  display: flex;
  padding: 20px;
  gap: 20px;
}
.dialog-content2 {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
}

.left-photo {
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
}

.preview-img {
  width: calc(50% - 10px); /* 或者你希望的宽度，如 180px */
  cursor: pointer;
}
.right-info {
  flex: 1;
  background: #0f273d;
}

.right-info-title-left {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
}

.right-info-title-right {
  font-size: 18px;
  font-weight: bold;
  margin-left: 20px;
  color: #0ec3f7;
}

.stationId {
  color: #c2c2c2;
  font-size: 16px;
  margin-top: 12px;
}

.right-info-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

/* .right-info-content-item {
  display: flex;
  gap: 225px;
  align-items: center;
  color: #d6dfea;
  font-size: 14px;
  text-align: left;
}

.right-info-content-item-7 {
  display: flex;
  gap: 178px;
  align-items: center;
  color: #d6dfea;
  font-size: 14px;
} */

.right-info-bottom {
  margin-top: 20px;
}

.right-info-content-item,
.right-info-content-item-7,
.right-info-content-item-oil {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 两列等宽 */
  column-gap: 40px; /* 列间距 */
  row-gap: 10px; /* 行间距 */
  color: #d6dfea;
  font-size: 14px;
  text-align: left;
}

/* .right-info-content-item {
  display: flex;
  gap: 225px;
  align-items: center;
  color: #d6dfea;
  font-size: 14px;
} */
</style>
