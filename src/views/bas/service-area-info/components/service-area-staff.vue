<template>
  <div>
    <div class="title"><span></span>服务区工作人员</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="业主单位管理人数" prop="personBean.ownerManageNum">
          <el-input
            v-model="formInfo.personBean.ownerManageNum"
            placeholder="请输入业主单位管理人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="经营单位服务区人数" prop="personBean.operateServiceNum">
          <el-input
            v-model="formInfo.personBean.operateServiceNum"
            placeholder="请输入经营单位服务区人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="物业保障员工人数" prop="personBean.guaranteeNum">
          <el-input
            v-model="formInfo.personBean.guaranteeNum"
            placeholder="请输入物业保障员工人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="可住宿人数" prop="personBean.ableAccommodationNum">
          <el-input
            v-model="formInfo.personBean.ableAccommodationNum"
            placeholder="请输入可住宿人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="协管人数" prop="personBean.assistNum">
          <el-input
            v-model="formInfo.personBean.assistNum"
            placeholder="请输入协管人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="电工人数" prop="personBean.electricianNum">
          <el-input
            v-model="formInfo.personBean.electricianNum"
            placeholder="请输入电工人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="加油站人数" prop="personBean.gasStationPerson">
          <el-input
            v-model="formInfo.personBean.gasStationPerson"
            placeholder="请输入加油站人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="信息化运维人数" prop="personBean.informationNum">
          <el-input
            v-model="formInfo.personBean.informationNum"
            placeholder="请输入信息化运维人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="管理人员人数" prop="personBean.managePersonNum">
          <el-input
            v-model="formInfo.personBean.managePersonNum"
            placeholder="请输入管理人员人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="经营单位管理人数" prop="personBean.operateManageNum">
          <el-input
            v-model="formInfo.personBean.operateManageNum"
            placeholder="请输入经营单位管理人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="保洁人数" prop="personBean.procterGambleNum">
          <el-input
            v-model="formInfo.personBean.procterGambleNum"
            placeholder="请输入保洁人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="保安人数" prop="personBean.securityGuardNum">
          <el-input
            v-model="formInfo.personBean.securityGuardNum"
            placeholder="请输入保安人数"
            :disabled="formInfoDisabled"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #suffix>人</template>
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
