<!-- 设备维修详情弹窗 -->

<template>
  <el-dialog
    class="custom_dialog"
    v-model="dialogVisible"
    title="详情"
    width="800"
    :before-close="close"
  >
    <el-form
      :model="resData"
      label-width="auto"
      class="custom_form"
      label-suffix="："
      disabled
    >
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="服务区" class="form_item" prop="serviceAreaId">
            <el-select
              v-model="resData.serviceAreaName"
              filterable
              :reserve-keyword="false"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in listOptions.serviceAreaList"
                :key="index"
                :label="item.label"
                :value="~~item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" class="form_item" prop="name">
            <el-input
              v-model="resData.name"
              placeholder="请输入"
              clearable
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属系统" class="form_item" prop="system">
            <el-input
              v-model="resData.system"
              placeholder="请输入"
              clearable
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="设备分类"
            class="form_item"
            prop="type"
          >
            <el-input
              v-model="resData.type"
              placeholder="请输入"
              clearable
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="故障时间" class="form_item" prop="failureTime">
            <el-date-picker
              style="width: 100%"
              :disabled="true"
              v-model="resData.failureTime"
              type="date"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修复状态" class="form_item">
            <el-select
              v-model="resData.status"
              filterable
              :reserve-keyword="false"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in listOptions.statusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="故障图片" class="form_item" prop="files">
            <el-image
              class="image-file"
              v-for="(item, index) in resData.beforeFileUrls"
              :key="index"
              :preview-src-list="resData.beforeFileUrls"
              :src="item"
              preview-teleported
              alt="加载失败"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修复图片" class="form_item" prop="files">
            <el-image
              class="image-file"
              v-for="(item, index) in resData.afterFileUrls"
              :key="index"
              :preview-src-list="resData.afterFileUrls"
              :src="item"
              preview-teleported
              alt="加载失败"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, computed, defineEmits, defineProps, onMounted} from "vue";
import {fileInfo} from "@/api/dangerItemApi";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    default: () => {
      return {
        serviceAreaList: [],
        statusList: []
      }
    },
  },
  data: {
    type: Object,
    default: () => {},
  }
})

const dialogVisible = computed(() => props.visible);
const listOptions = computed(() => props.options);
const resData = ref({})

const emit = defineEmits(["dialogClose"]);

const initData = async () => {
  const data = {...props.data}
  data.status = Number(data.status)
  if (data.afterFiles && data.afterFiles !== '' && data.afterFiles.split(',').length > 0) {
    data.afterFileUrls = await Promise.all(data.afterFiles.split(',').map(id => getFileInfo(id)))
  }
  
  if (data.beforeFiles && data.beforeFiles !== '' && data.beforeFiles.split(',').length > 0) {
    data.beforeFileUrls = await Promise.all(data.beforeFiles.split(',').map(id => getFileInfo(id)))
  }
  console.log(data)
  return data
}

const getFileInfo = async (itemId) => {
  const res = await fileInfo({id: itemId})
  if (res.code == '200') {
    return process.env.VUE_APP_API_HOST_URL +
      process.env.VUE_APP_API_BASE_URL +
      // `/pub/common/file/download?service=basGoodsFileServiceImpl&id=${itemId}`
      `/pub/common/file/download?service=basDeviceFileServiceImpl&id=${itemId}`
  } else {
    return ''
  }
}

// 弹窗关闭
const close = () => {
  emit("dialogClose");
};

onMounted(async () => {
  resData.value = await initData()
})

</script>

<style lang="less" scoped>
.image-file {
  width: 140px;
  height: 80px;
}
</style>
