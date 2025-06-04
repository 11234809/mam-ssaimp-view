<template>
  <div class="emission-reduction">
    <div class="title"><span></span>节能减排绿色</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否实施垃圾分类" prop="greenBean.isGarbageClassify">
          <el-select
            v-model="formInfo.greenBean.isGarbageClassify"
            placeholder="请选择是否实施垃圾分类"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="是否开展生活垃圾无害化处理"
          prop="greenBean.isGarbageHarmless"
        >
          <el-select
            v-model="formInfo.greenBean.isGarbageHarmless"
            placeholder="请选择是否开展生活垃圾无害化处理"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否实现垃圾专业回收" prop="greenBean.isGarbageRecovery">
          <el-select
            v-model="formInfo.greenBean.isGarbageRecovery"
            placeholder="请选择是否实现垃圾专业回收"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否配置污水处理监测系统" prop="greenBean.isSewageDetection">
          <el-select
            v-model="formInfo.greenBean.isSewageDetection"
            placeholder="请选择是否配置污水处理监测系统"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否实现中水回用" prop="greenBean.isWaterReuse">
          <el-select
            v-model="formInfo.greenBean.isWaterReuse"
            placeholder="请选择是否实现中水回用"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="处理后水质检测是否达标" prop="greenBean.isWaterStandard">
          <el-select
            v-model="formInfo.greenBean.isWaterStandard"
            placeholder="请选择处理后水质检测是否达标"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="污水处理设备日处理能力" prop="greenBean.dailyMaxCapacity">
          <el-input
            v-model="formInfo.greenBean.dailyMaxCapacity"
            placeholder="请输入污水处理设备日处理能力"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>吨</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="设备投入运行日期" prop="greenBean.runningDate">
          <el-date-picker
            v-model="formInfo.greenBean.runningDate"
            type="date"
            placeholder="请选择初始运营日期"
            :disabled="formInfoDisabled"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="污水处理模式" prop="greenBean.sewageMode">
          <el-select
            v-model="formInfo.greenBean.sewageMode"
            placeholder="请选择污水处理模式"
            :disabled="formInfoDisabled"
            clearable
          >
            <el-option
              v-for="(item, index) in dictItemsList.sewageTreatmentModeDictionary"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item
          label="污水处理设备实际每日处理量"
          prop="greenBean.dailyRealCapacity"
        >
          <el-input
            v-model="formInfo.greenBean.dailyRealCapacity"
            placeholder="请输入污水处理设备实际每日处理量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d\.]/g,'')"
          >
            <template #suffix>吨</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="垃圾收集容器配置数量" prop="greenBean.garbageNum">
          <el-input
            v-model="formInfo.greenBean.garbageNum"
            placeholder="请输入垃圾收集容器配置数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="分类垃圾收集容器配置数量"
          prop="greenBean.garbageClassifyNum"
        >
          <el-input
            v-model="formInfo.greenBean.garbageClassifyNum"
            placeholder="请输入分类垃圾收集容器配置数量"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>个</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否采用光伏发电" prop="greenBean.isGreenEnergy">
          <el-select
            v-model="formInfo.greenBean.isGreenEnergy"
            placeholder="请选择是否采用光伏发电"
            :disabled="formInfoDisabled"
            clearable
            @change="changeIsGreenEnergy"
            @clear="clearIsGreenEnergy"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col
        :span="8"
        v-if="
          formInfo.greenBean.isGreenEnergy != 0 &&
          formInfo.greenBean.isGreenEnergy != null
        "
      >
        <el-form-item label="光伏发电" prop="greenBean.greenEnergy">
          <el-input
            v-model="formInfo.greenBean.greenEnergy"
            placeholder="请输入光伏发电"
            :disabled="formInfoDisabled"
          ></el-input>
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
const changeIsGreenEnergy = (e) => {
  if (e == 0) {
    formInfo.value.greenBean.greenEnergy = null;
  }
};
const clearIsGreenEnergy = () => {
  if (formInfo.value.greenBean.isGreenEnergy == "") {
    formInfo.value.greenBean.isGreenEnergy = null;
    formInfo.value.greenBean.greenEnergy = null;
  }
};
</script>
<style lang="less" scope></style>
