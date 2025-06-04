<script setup>
import {ref, reactive, onMounted, computed, defineProps, defineEmits} from 'vue';
import {queryNormalOptions} from "@/api/dictionaryApi";
import {addEventTypeApi, editEventTypeApi, getEventTypeDetailAPi} from "@/api/public/eventTypeApi";
import {ElMessage} from "element-plus";

const props = defineProps({
  dialogType: {
    type: Number,
    default: 1
  },
  dialogVisible: {
    type: Boolean,
    default: false
  },
  dialogId: {
    type: Number || String,
    default: null
  }
})

const emit = defineEmits(['closeDialog'])
const isBtnDisabled = ref(false)
const dialogForm = reactive({
  pid: '',
  typeId: '',
  name: '',
  typeStatus: '',
  remark: ''
})
const rules = reactive({
  typeId: [
    { required: true, message: '请输入ID', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  typeStatus: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
})
const formRef = ref(null)
const addPid = ref(null)
const visible = computed(() => props.dialogVisible)
const dialogTitle = computed(() => {
  switch (props.dialogType) {
    case 1:
      return '新增'
    case 2:
      return '编辑'
    case 3:
      return '详情'
    case 4:
      return '添加下级'
    default:
      return '新增'
  }
})
const parentOptions = ref([])
const statusOptions = ref([])

const close = () => {
  emit('closeDialog', false)
}

const getDetail = async () => {
  const { data } = await getEventTypeDetailAPi(props.dialogId)
  if (props.dialogType === 4) {
    parentOptions.value.push({
      label: data.name,
      value: data.entityId
    })
    dialogForm.pid = data.entityId
    addPid.value = data.pid
  } else {
    parentOptions.value.push({
      label: data.pidText,
      value: data.pid
    })
    dialogForm.pid = data.pid
    dialogForm.entityId = data.entityId
    dialogForm.typeId = data.typeId
    dialogForm.name = data.name
    dialogForm.typeStatus = String(data.typeStatus)
    dialogForm.remark = data.remark
  }
  
}

const getOptions = () => {
  queryNormalOptions({
    queriers: [{ alias: 'eventTypeConfigStatusDictionary', param: null }],
  }).then((res) => {
    statusOptions.value = res.data.eventTypeConfigStatusDictionary;
    dialogForm.typeStatus = statusOptions.value.length > 0 ? statusOptions.value[0].code : ''
  })
}

const dialogConfirm = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      isBtnDisabled.value = true
      const params = {
        ...dialogForm
      }
      let res
      if (props.dialogType === 1 || props.dialogType === 4) {
        res = await addEventTypeApi(params)
        // 新增
      } else if (props.dialogType === 2) {
        res = await editEventTypeApi(params)
      }
      if (res.code == 200) {
        ElMessage({
          message: res.data.message,
          type: 'success',
        });
        isBtnDisabled.value = false
        if (props.dialogType === 2) {
          emit('closeDialog', true, dialogForm.pid);
        } if (props.dialogType === 4) {
          emit('closeDialog', true, addPid.value, props.dialogId);
        } else {
          emit('closeDialog', true);
        }
      } else if (res.code == 500) {
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
  })
}

onMounted(() => {
  getOptions()
  if (props.dialogId) {
    getDetail()
  }
})
</script>

<template>
  <el-dialog
    v-model="visible"
    class="custom_dialog"
    :title="dialogTitle"
    width="600px"
    :model-value="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="formRef"
      :model="dialogForm"
      :disabled="dialogType === 3"
      label-suffix=":"
      :rules="rules"
      label-width="140px"
      style="padding-right: 10px"
    >
      <el-form-item v-if="dialogType === 4 || dialogForm.pid" label="父级节点" prop="pid">
        <el-select v-model="dialogForm.pid" placeholder="请选择父级节点" :disabled="true">
          <el-option v-for="(item, index) in parentOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="检查中心事件id" prop="typeId">
        <el-input v-model="dialogForm.typeId" placeholder="请输入检查中心事件id" clearable/>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="dialogForm.name" placeholder="请输入名称" clearable/>
      </el-form-item>
      <el-form-item label="状态" prop="typeStatus">
        <el-select v-model="dialogForm.typeStatus" placeholder="请选择父级节点">
          <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input
          v-model="dialogForm.remark"
          type="textarea"
          rows="3"
          placeholder="请输入名称"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :disabled="isBtnDisabled" @click="dialogConfirm">确定</el-button>
        <el-button type="primary" @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">

</style>