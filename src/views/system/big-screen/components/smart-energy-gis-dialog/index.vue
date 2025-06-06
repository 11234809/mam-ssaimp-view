<template>
  <el-dialog
    v-model="visible"
    width="900"
    :before-close="handleClose"
    class="site-detail-dialog"
  >
    <div class="dialog-title">{{ subTitle }}</div>

    <div class="dialog-content">
      <!-- 如果有图片 -->
      <div class="left-photo" v-if="subTitle == '充电站'">
        <el-image
          :key="index"
          :src="img"
          :preview-src-list="srcList"
          :preview-teleported="true"
          fit="cover"
          style="width: 100%; margin-bottom: 10px; cursor: pointer"
        />
      </div>

      <!-- 右侧字段信息 -->
      <div class="right-info">
        <!-- 充电站名称 -->
        <div class="right-info-title">
          <span class="right-info-title-left">{{ stationData.stationName }}</span>
          <span class="right-info-title-right">
            {{ stationData.supperGunNum > 1 ? "超充站" : "" }}
          </span>
          <div class="stationId">充电站编号:{{ stationData.stationId }}</div>
        </div>
        <div class="right-info-content">
          <div class="right-info-content-item">
            <div>站点状态: {{ stationData.stationStatus }}</div>
            <div>
              7×24小时营业:
              {{
                stationData.is24HoursOperation == true
                  ? "否"
                  : stationData.is24HoursOperation == false
                  ? "是"
                  : ""
              }}
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
          <el-tag type="primary">{{ stationData.paymentMethods }}</el-tag>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
  subTitle: { type: String, default: "" },
  data: { type: Object, required: true },
});

const emit = defineEmits(["update:modelValue"]);
const visible = ref(props.modelValue);

const stationData = computed(() => props.data);

const img =
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg";
const srcList = [
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
  "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
  "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
  "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
  "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
  "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg",
];


watch(
  () => props.modelValue,
  (val) => (visible.value = val)
);
watch(visible, (val) => emit("update:modelValue", val));

// 照片
const hasPhoto = computed(() => {
  return Array.isArray(data[stationPhotos]) && data[stationPhotos].length > 0;
});

const handleClose = () => {
  visible.value = false;
};
</script>

<style scoped>
.site-detail-dialog {
  font-weight: bold;
  background: #0f273d;
  color: #fff;
}

.dialog-title {
  background: url(../../images/smartEnergy/组12398.png) no-repeat;
  color: #ffffff;
  background-size: auto 100%;
  padding: 10px 30px 10px 85px;
  font-size: 20px;
}

.dialog-content {
  display: flex;
  padding: 20px;
  gap: 20px;
}

.left-photo {
  width: 40%;
  max-height: 500px;
  overflow-y: auto;
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

.right-info-content-item {
  display: flex;
  gap: 225px;
  align-items: center;
  color: #d6dfea;
  font-size: 14px;
}
</style>
