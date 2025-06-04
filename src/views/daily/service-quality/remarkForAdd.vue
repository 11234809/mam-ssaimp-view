<!-- @format -->

<template>
  <el-dialog
    v-model="dialogVisible"
    align-center
    width="600"
    :before-close="close"
    class="custom_dialog"
  >
    <template #header>
      <div class="dialog-header">
        {{ dialogTitle }}
      </div>
    </template>
    <el-form label-width="100px" label-suffix="：" label-position="left" :disabled="isDisabled">
      <el-form-item label="备注">
        <el-input v-model="remark" type="textarea" :rows="4" placeholder="请输入备注信息"/>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload
          ref="uploadFiles"
          action="#"
          v-model:file-list="replyFiles"
          accept=".jpeg,.png,.jpg,.bmp,.gif"
          :http-request="customUpload"
          multiple
          :limit="9"
          list-type="picture-card"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
        >
          <el-icon>
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
    
    </el-form>
    <template #footer v-if="!isDisabled">
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogConfirm">确定</el-button>
        <el-button type="primary" @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogImageVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image"/>
  </el-dialog>
</template>

<script setup>
import {ref, onMounted, computed, defineEmits, defineProps, nextTick, watch} from 'vue'
import {ElMessage} from "element-plus";
import {Plus, Delete} from '@element-plus/icons-vue'
import {fileInfo} from "@/api/dangerItemApi";

const props = defineProps({
  type: {
    type: Number,
    default: null
  },
  datas: {
    type: Object,
    default: () => {
    }
  },
  visible: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  isToBody: {
    type: Boolean,
    default: false
  }
})
const uploadFiles = ref(null)
const remark = ref('')
const picList = ref([]);
const replyFiles = ref([])
const delFileList = ref([])
const dialogImageVisible = ref(false)
const dialogImageUrl = ref('')
const dialogVisible = computed(() => {
  return props.visible;
});
const dialogTitle = computed(() => {
  switch (props.type) {
    case 1:
      return "公共卫生间";
    case 2:
      return "公共场区";
    case 3:
      return "餐饮服务";
    case 4:
      return "零售服务";
    case 5:
      return "汽车服务";
    case 6:
      return "人性化服务";
    case 7:
      return "信息化服务";
    case 8:
      return "应急保障";
    case 9:
      return "生态环保";
    case 10:
      return "拓展服务";
    case 11:
      return "投诉与监督";
    default:
      return "未知类型";
  }
})

// 生成随机字符的函数
const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const customUpload = (file) => {
  // 使用 URL.createObjectURL 生成本地可用的链接
  const fileBlob = new Blob([file.file], { type: file.file.type });
  const localUrl = URL.createObjectURL(fileBlob);
  picList.value.push({
    name: file.file.name,
    path: file.file,
    uid: file.file.uid,
    type: file.file.type,
    url: localUrl
  })
}

// 删除图片
const handleRemove = (file) => {
  const index = replyFiles.value.findIndex(item => item.uid === file.uid);
  if (index !== -1) {
    picList.value.splice(index, 1); // 移除文件
    replyFiles.value.splice(index, 1)
  }
  if (Object.keys(file).includes("entityId")) {
    delFileList.value.push(file.entityId);
  }
}


const close = () => {
  emit('dialogClose', false)
}
const emit = defineEmits(['dialogClose', 'confirm']);

const dialogConfirm = () => {
  const rapicList = picList.value.map(item => item)
  const rawDelFileList = JSON.parse(JSON.stringify(delFileList.value));
  emit('confirm', props.type, remark.value, rapicList, rawDelFileList);
  picList.value = []
  remark.value = ''
  delFileList.value = []
  replyFiles.value = []
  close()
}

const getFileInfo = async (itemId) => {
  const res = await fileInfo({id: itemId})
  if (Number(res.code) === 200) {
    return process.env.VUE_APP_API_HOST_URL +
      process.env.VUE_APP_API_BASE_URL +
      `/pub/common/file/download?service=serviceQualityPicFileServiceImpl&id=${itemId}`
  } else {
    return ''
  }
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogImageVisible.value = true
}

watch(() => props.visible, (newVal, oldVal) => {
  if (newVal) {
    if (props.datas.remark) {
      remark.value = props.datas.remark
    }
    if (props.datas.files) {
      const files = JSON.parse(JSON.stringify(props.datas.files));
      console.log(files)
      nextTick(async () => {
        files.forEach(item => {
          if (item && typeof item === 'object' && 'entityId' in item) {
            getFileInfo(item.entityId).then(fileInfo => {
              replyFiles.value.push({
                entityId: item.entityId,
                name: item.fileName,
                url: fileInfo // 假设 fileInfo 是一个对象，包含 url 属性
              })
            })
          } else {
            replyFiles.value.push(item)
          }
        })
        picList.value = replyFiles.value
      })
    }
  } else {
    // 对话框隐藏时的处理逻辑
    console.log('对话框已隐藏');
  }
})
onMounted(() => {
  if (props.datas.remark) {
    remark.value = props.datas.remark
  }
  if (props.datas.files) {
    const files = JSON.parse(JSON.stringify(props.datas.files));
    nextTick(async () => {
      files.forEach(item => {
        if (item && typeof item === 'object' && 'entityId' in item) {
          getFileInfo(item.entityId).then(fileInfo => {
            replyFiles.value.push({
              entityId: item.entityId,
              name: item.fileName,
              url: fileInfo // 假设 fileInfo 是一个对象，包含 url 属性
            })
          })
        } else {
          replyFiles.value.push(item)
        }
      })
      picList.value = replyFiles.value
    })
  }
})

</script>


<style lang="less" scoped>
.dialog-header {
  font-size: 16px;
  color: black;
}
</style>