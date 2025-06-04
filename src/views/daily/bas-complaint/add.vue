<!-- 投诉管理新增弹窗 -->

<template>
  <el-dialog
    class="custom_dialog"
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form
      ref="formRef"
      :model="dialogForm"
      label-width="auto"
      class="custom_form"
      label-suffix="："
      :rules="rules"
      :disabled="dialogType === 3"
    >
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="服务区" prop="serviceAreaId">
            <el-select
              v-model="dialogForm.serviceAreaId"
              placeholder="请选择服务区"
              clearable
              :disabled="dialogType === 4 || dialogType === 5"
            >
              <el-option
                v-for="item in listOptions.serviceAreaList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投诉主题" prop="title">
            <el-input :disabled="dialogType === 4 || dialogType === 5" v-model="dialogForm.title"
                      placeholder="请输入投诉主题"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投诉人" prop="comBy">
            <el-input :disabled="dialogType === 4 || dialogType === 5" v-model="dialogForm.comBy"
                      placeholder="请输入投诉人"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投诉时间" prop="comTime">
            <el-date-picker
              :disabled="dialogType === 4 || dialogType === 5"
              style="width: 100%"
              v-model="dialogForm.comTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择投诉时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投诉内容" prop="comDesc">
            <el-input
              :disabled="dialogType === 4 || dialogType === 5"
              v-model="dialogForm.comDesc"
              type="textarea"
              :rows="3"
              placeholder="请输入投诉内容"
            />
          </el-form-item>
        </el-col>
        <template v-if="dialogType !== 1 || dialogType !== 2">
          <el-col v-if="dialogType === 5 || dialogType === 3" :span="12">
            <el-form-item label="投诉回复结果" prop="replyDesc">
              <el-input
                v-model="dialogForm.replyDesc"
                type="textarea"
                :rows="3"
                placeholder="请输入投诉回复结果"
              />
            </el-form-item>
          </el-col>
          <template v-if="dialogType === 4 || dialogType === 3">
            <el-col :span="12">
              <el-form-item label="投诉状态" prop="status">
                <el-select
                  v-model="dialogForm.status"
                  placeholder="请选择投诉状态"
                  clearable
                >
                  <el-option
                    v-for="item in listOptions.complaintStatusOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回复状态" prop="replyStatus">
                <el-select
                  v-model="dialogForm.replyStatus"
                  placeholder="请选择投诉状态"
                  clearable
                >
                  <el-option
                    v-for="item in listOptions.recoilStatusOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="dialogForm.remark"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注"
                />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="12" v-if="dialogType !== 1 && dialogType !== 2">
            <el-form-item label="附件" prop="replyFiles">
              <el-upload
                style="width: 100%"
                v-model:file-list="dialogForm.replyFiles"
                action="#"
                multiple
                :limit="9"
                :http-request="customUpload"
                :on-remove="handleRemove"
                :on-preview="handlePreview"
              >
                <el-button>
                  <el-icon class="el-icon--right">
                    <Plus/>
                  </el-icon>
                  点击上传
                </el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="close">关闭</el-button>
        <el-button v-if="dialogType !== 3" :disabled="isBtnDisabled" type="primary" @click="submitSave">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive, onMounted, computed, defineProps, defineEmits} from "vue";
import {
  addBaseConplaintApi,
  getBaseConplaintInfoApi,
  defineBaseConplaintApi,
  replyBaseConplaintApi, editBaseConplaintApi
} from '@/api/daily/baseComplaint'
import {ElMessage} from "element-plus";
import {fileInfo} from "@/api/dangerItemApi";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  dialogType: {
    type: Number,
    default: 1, // 1 - 新增 2 - 编辑 3 - 详情 4 - 界定有效 5 - 投诉回复
  },
  rowId: {
    type: Number || String,
    default: null
  },
  data: {
    type: Object,
    default: () => {
    },
  },
  options: {
    type: Object,
    default: () => {
      return {
        companyList: [],
        serviceAreaList: [],
        recoilStatusOptions: [], // 回复状态
        complaintStatusOptions: [] // 投诉状态
      };
    },
  },
});

const isBtnDisabled = ref(false)
const emit = defineEmits(["closeDialog"]);
const formRef = ref(null); // 表单ref
// 弹窗表单数据
const dialogForm = reactive({
  serviceAreaId: '', // 服务区id
  title: '', // 投诉标题
  comBy: '', // 投诉人
  comTime: '', // 投诉时间
  comDesc: '', // 投诉内容
  status: '', // 投诉状态
  replyDesc: '', // 回复内容
  replyStatus: '', // 回复状态
  remark: '', // 备注
  replyFiles: []
});
const picList = ref([]); // 文件列表
const delFileList = ref([]); // 删除文件列表
const rules = reactive({
  serviceAreaId: [
    {required: true, message: "请选择服务区", trigger: "change"},
  ],
  title: [
    {required: true, message: "请输入投诉标题", trigger: "blur"},
  ],
  comBy: [
    {required: true, message: "请输入投诉人", trigger: "blur"},
  ],
  comTime: [
    {required: true, message: "请选择投诉时间", trigger: "change"},
  ],
  comDesc: [
    {required: true, message: "请输入投诉内容", trigger: "change"},
  ],
});
const dialogVisible = computed(() => {
  return props.visible;
}); // 弹窗

const listOptions = computed(() => {
  return props.options;
});

const dialogTitle = computed(() => {
  let title = "";
  switch (props.dialogType) {
    case 1:
      title = "新增";
      break;
    case 2:
      title = "编辑";
      break;
    case 3:
      title = "详情";
      break;
    case 4:
      title = "界定有效";
      break;
    case 5:
      title = "投诉回复";
      break;
    default:
      title = "新增";
      break;
  }
  return title;
})

// 弹窗关闭
const close = () => {
  emit("closeDialog");
};

const getDialogInfo = async () => {
  dialogForm.replyFiles = []
  picList.value = []
  delFileList.value = []
  const {data} = await getBaseConplaintInfoApi({id: props.rowId})
  dialogForm.serviceAreaId = data.serviceAreaId || ''
  dialogForm.title = data.title || ''
  dialogForm.comBy = data.comBy || ''
  dialogForm.comTime = data.comTime || ''
  dialogForm.comDesc = data.comDesc || ''
  dialogForm.status = String(data.status)
  dialogForm.replyDesc = data.replyDesc
  dialogForm.replyStatus = String(data.replyStatus)
  dialogForm.remark = data.remark || ''
  dialogForm.replyFiles = await Promise.all(
    data.replyFilesList.map(async (item) => {
      const fileInfo = await getFileInfo(item.entityId); // 获取文件信息
      return {
        entityId: item.entityId,
        name: item.fileName,
        url: fileInfo // 假设 fileInfo 是一个对象，包含 url 属性
      };
    })
  )
  
  picList.value = await Promise.all(
    data.replyFilesList.map(async (item) => {
      const fileInfo = await getFileInfo(item.entityId); // 获取文件信息
      return {
        entityId: item.entityId,
        name: item.fileName,
        url: fileInfo // 假设 fileInfo 是一个对象，包含 url 属性
      };
    })
  )
}

const getFileInfo = async (itemId) => {
  const res = await fileInfo({id: itemId})
  if (res.code == '200') {
    return process.env.VUE_APP_API_HOST_URL +
      process.env.VUE_APP_API_BASE_URL +
      `/pub/common/file/download?service=basComplaintFileServiceImpl&id=${itemId}`
  } else {
    return ''
  }
}

const submitSave = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      isBtnDisabled.value = true
      // 保存
      const formData = new FormData();
      if (props.dialogType === 1) {
        formData.append("request", JSON.stringify({
          serviceAreaId: dialogForm.serviceAreaId || '',
          title: dialogForm.title || '',
          comBy: dialogForm.comBy || '',
          comDesc: dialogForm.comDesc || '',
          comTime: dialogForm.comTime || '',
        }));
        const res = await addBaseConplaintApi(formData, {'Content-Type': 'multipart/form-data'})
        if (res.code == '200') {
          isBtnDisabled.value = false
          ElMessage({
            message: res.data.message,
            type: 'success',
          });
          close()
        } else if (res.code == '500') {
          isBtnDisabled.value = false
          ElMessage({
            message: res.message,
            type: 'warning',
          });
        } else {
          isBtnDisabled.value = false
          ElMessage({
            message: res.message || res.data.message,
            type: 'error',
          });
        }
      }
      
      if (props.dialogType === 2) {
        formData.append("request", JSON.stringify({
          entityId: props.rowId,
          serviceAreaId: dialogForm.serviceAreaId || '',
          title: dialogForm.title || '',
          comBy: dialogForm.comBy || '',
          comDesc: dialogForm.comDesc || '',
          comTime: dialogForm.comTime || '',
        }));
        const res = await editBaseConplaintApi(formData, {'Content-Type': 'multipart/form-data'})
        if (res.code == '200') {
          isBtnDisabled.value = false
          ElMessage({
            message: res.data.message,
            type: 'success',
          });
          close()
        } else if (res.code == '500') {
          isBtnDisabled.value = false
          ElMessage({
            message: res.message,
            type: 'warning',
          });
        } else {
          isBtnDisabled.value = false
          ElMessage({
            message: res.message || res.data.message,
            type: 'error',
          });
        }
      }
      
      if (props.dialogType === 4) {
        formData.append("request", JSON.stringify({
          entityId: props.rowId,
          status: dialogForm.status || '',
          remark: dialogForm.remark || '',
          replyStatus: dialogForm.replyStatus || '',
        }))
        if (picList.value.length > 0) {
          picList.value.map((item) => {
            if (!Object.keys(item).includes("entityId")) {
              formData.append('replyFiles', item.path)
            }
          })
        }
        formData.append('deleteFileIdList', JSON.stringify(delFileList.value))
        const res = await defineBaseConplaintApi(formData, {'Content-Type': 'multipart/form-data'})
        if (res.code == '200') {
          isBtnDisabled.value = false
          ElMessage({
            message: res.data.message,
            type: 'success',
          });
          close()
        } else if (res.code == '500') {
          isBtnDisabled.value = false
          ElMessage({
            message: res.message,
            type: 'warning',
          });
        } else {
          isBtnDisabled.value = false
          ElMessage({
            message: res.message || res.data.message,
            type: 'error',
          });
        }
      }
      
      if (props.dialogType === 5) {
        formData.append("request", JSON.stringify({
          entityId: props.rowId,
          replyDesc: dialogForm.replyDesc || '',
        }))
        if (picList.value.length > 0) {
          picList.value.map((item) => {
            if (!Object.keys(item).includes("entityId")) {
              formData.append('replyFiles', item.path)
            }
          })
        }
        formData.append('deleteFileIdList', JSON.stringify(delFileList.value))
        const res = await replyBaseConplaintApi(formData, {'Content-Type': 'multipart/form-data'})
        if (res.code == '200') {
          isBtnDisabled.value = false
          ElMessage({
            message: res.data.message,
            type: 'success',
          });
          close()
        } else if (res.code == '500') {
          isBtnDisabled.value = false
          ElMessage({
            message: res.message,
            type: 'warning',
          });
        } else {
          isBtnDisabled.value = false
          ElMessage({
            message: res.message || res.data.message,
            type: 'error',
          });
        }
      }
    }
  })
}

// 上传文件
const customUpload = (file) => {
  picList.value.push({
    path: file.file,
    uid: file.file.uid,
    value: '0',
    nodeName: file.file.name,
    type: file.file.type,
  });
};

const handleRemove = (file) => {
  
  const index = dialogForm.replyFiles.findIndex(item => item.uid === file.uid);
  if (index !== -1) {
    picList.value.splice(index, 1); // 移除文件
    dialogForm.replyFiles.splice(index, 1); // 移除文件
  }
  if (Object.keys(file).includes("entityId")) {
    delFileList.value.push(file.entityId);
  }
}

const handlePreview = (file) => {
  console.log(file, '=======')
  // 检查文件是否有有效的下载链接
  if (!file.url) {
    console.error("文件没有有效的下载链接");
    return;
  }
  
  // 创建一个 <a> 标签
  const a = document.createElement("a");
  
  // 设置 <a> 标签的 href 属性为文件的下载链接
  a.href = file.url;
  
  // 如果有文件名称，设置 download 属性（可选）
  if (file.name) {
    a.download = file.name; // 指定下载文件的文件名
  }
  
  // 将 <a> 标签添加到文档中
  document.body.appendChild(a);
  
  // 触发点击事件以开始下载
  a.click();
  
  // 移除 <a> 标签
  document.body.removeChild(a);
}

onMounted(() => {
  if (props.dialogType !== 1) {
    getDialogInfo()
  }
});
</script>

<style lang="less" scoped>
::v-deep(.el-textarea.is-disabled .el-textarea__inner) {
  color: black !important;
  background-color: #fff !important;
  
  &::placeholder {
    color: black !important;
  }
}
</style>
