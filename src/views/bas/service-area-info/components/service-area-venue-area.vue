<template>
  <div>
    <div class="title"><span></span>服务区场所面积</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="建筑面积" prop="areaBean.buildArea">
          <el-input
            v-model="formInfo.areaBean.buildArea"
            placeholder="请输入建筑面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="餐饮面积" prop="areaBean.cateringArea">
          <el-input
            v-model="formInfo.areaBean.cateringArea"
            placeholder="请输入餐饮面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="充电站面积" prop="areaBean.chargingArea">
          <el-input
            v-model="formInfo.areaBean.chargingArea"
            placeholder="请输入充电站面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="占地面积" prop="areaBean.coversArea">
          <el-input
            v-model="formInfo.areaBean.coversArea"
            placeholder="请输入占地面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="免费休息区建筑面积" prop="areaBean.freeArea">
          <el-input
            v-model="formInfo.areaBean.freeArea"
            placeholder="请输入免费休息区建筑面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="加气站面积" prop="areaBean.gasArea">
          <el-input
            v-model="formInfo.areaBean.gasArea"
            placeholder="请输入加气站面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="绿化面积" prop="areaBean.greenArea">
          <el-input
            v-model="formInfo.areaBean.greenArea"
            placeholder="请输入绿化面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="客房区面积" prop="areaBean.guestArea">
          <el-input
            v-model="formInfo.areaBean.guestArea"
            placeholder="请输入客房区面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="维修区面积" prop="areaBean.maintenanceArea">
          <el-input
            v-model="formInfo.areaBean.maintenanceArea"
            placeholder="请输入维修区面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="商超面积" prop="areaBean.marketArea">
          <el-input
            v-model="formInfo.areaBean.marketArea"
            placeholder="请输入商超面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="停车场面积" prop="areaBean.parkingLotArea">
          <el-input
            v-model="formInfo.areaBean.parkingLotArea"
            placeholder="请输入停车场面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="客车停车区占地面积" prop="areaBean.parkingPassengerArea">
          <el-input
            v-model="formInfo.areaBean.parkingPassengerArea"
            placeholder="请输入客车停车区占地面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="货车停车区占地面积" prop="areaBean.parkingTruckArea">
          <el-input
            v-model="formInfo.areaBean.parkingTruckArea"
            placeholder="请输入货车停车区占地面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="加油站面积" prop="areaBean.petrolArea">
          <el-input
            v-model="formInfo.areaBean.petrolArea"
            placeholder="请输入加油站面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="员工宿舍面积" prop="areaBean.staffDormitoryArea">
          <el-input
            v-model="formInfo.areaBean.staffDormitoryArea"
            placeholder="请输入员工宿舍面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <el-form-item label="会议室面积" prop="areaBean.totalArea">
          <el-input
            v-model="formInfo.areaBean.totalArea"
            placeholder="请输入会议室面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="总房间数" prop="areaBean.totalRoomNum">
          <el-input
            v-model="formInfo.areaBean.totalRoomNum"
            placeholder="请输入总房间数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>间</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="物流仓储面积" prop="areaBean.warehousingArea">
          <el-input
            v-model="formInfo.areaBean.warehousingArea"
            placeholder="请输入物流仓储面积"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>m²</template>
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
</script>
<style lang="less" scope></style>
