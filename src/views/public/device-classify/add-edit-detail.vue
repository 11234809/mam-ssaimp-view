<script setup>
import {ref, reactive, onMounted, computed, defineProps, defineEmits} from 'vue';
import {queryNormalOptions} from "@/api/dictionaryApi";
import {addEventTypeApi, editEventTypeApi, getEventTypeDetailAPi} from "@/api/public/eventTypeApi";
import {ElMessage} from "element-plus";
import {
  addDeviceClassifyApi, addDeviceClassifyChildApi,
  editDeviceClassifyApi,
  getDeviceClassifyDetailAPi,
  getSystemListApi
} from "@/api/public/deviceClassifyApi";

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
  },
  serviceAreaList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['closeDialog'])
const pidNam = ref()
const isBtnDisabled = ref(false)
const dialogForm = reactive({
  pid: '0',
  serviceAreaId: '',
  name: '',
  code: '',
  period: '',
  times: '',
  remark: ''
})
const rules = reactive({
  serviceAreaId: [
    {required: true, message: '请选择服务器', trigger: 'change'}
  ],
  name: [
    {required: true, message: '请选择系统', trigger: 'change'}
  ],
  code: [
    {required: true, message: '请输入编码', trigger: 'blur'}
  ],
  period: [
    {required: true, message: '请选择巡检周期', trigger: 'blur'}
  ],
  times: [
    {required: true, message: '请输入巡检次数', trigger: 'blur'}
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
const inspectionOptions = ref([])
const systemOptions = ref([])

const close = () => {
  emit('closeDialog', false)
}

const getDetail = async () => {
  const {data} = await getDeviceClassifyDetailAPi(props.dialogId)
  if (props.dialogType === 4) {
    parentOptions.value.push({
      label: data.name,
      value: data.name
    })
    dialogForm.pid = data.entityId
    dialogForm.pidText = data.name
    dialogForm.serviceAreaId = data.serviceAreaId
  } else {
    parentOptions.value.push({
      label: data.pidText,
      value: data.pid
    })
    dialogForm.entityId = data.entityId || ''
    dialogForm.pid = data.pid || ''
    dialogForm.pidText = data.pidText || ''
    dialogForm.serviceAreaId = data.serviceAreaId || ''
    dialogForm.name = data.name || ''
    dialogForm.code = data.code || ''
    dialogForm.period = data.period ? String(data.period) : ''
    dialogForm.times = data.times || ''
    dialogForm.remark = data.remark || ''
  }
  
}

const getOptions = async () => {
  const { data } = await queryNormalOptions({
    queriers: [
      {alias: 'inspectionCycleDictionary', param: null},
      {alias: 'basDeviceSystemDictionary', param: null},
    ],
  })
  inspectionOptions.value = data.inspectionCycleDictionary
  systemOptions.value = data.basDeviceSystemDictionary
}

const dialogConfirm = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      const params = {
        ...dialogForm
      }
      isBtnDisabled.value = true
      let res
      if (props.dialogType === 1 || props.dialogType === 4) {
        if (props.dialogType === 1) {
          res = await addDeviceClassifyApi(params)
        } else {
          res = await addDeviceClassifyChildApi(params)
        }
        // 新增
      } else if (props.dialogType === 2) {
        res = await editDeviceClassifyApi(params)
      }
      if (res.code === 200) {
        isBtnDisabled.value = false
        ElMessage({
          message: res.data.message,
          type: 'success',
        });
        if (props.dialogType === 2) {
          emit('closeDialog', true, dialogForm.pid);
        }
        if (props.dialogType === 4) {
          emit('closeDialog', true, dialogForm.pid);
        } else {
          emit('closeDialog', true);
        }
      } else if (res.code === 500) {
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
      <el-form-item v-if="dialogForm.pid !== '0'" label="父级节点" prop="pid">
        <el-select v-model="dialogForm.pidText" placeholder="请选择父级节点" :disabled="true">
          <el-option v-for="(item, index) in parentOptions" :key="index" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="服务区" prop="serviceAreaId">
        <el-select v-model="dialogForm.serviceAreaId" placeholder="请选择服务区" :disabled="dialogType === 4">
          <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dialogForm.pid === '0'" label="系统名称" prop="name">
        <el-select v-model="dialogForm.name" placeholder="请选择系统名称">
          <el-option v-for="(item, index) in systemOptions" :key="index" :label="item.name" :value="item.code"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dialogForm.pid !== '0'" label="设备类型" prop="name">
        <el-input v-model="dialogForm.name" placeholder="请输入设备类型" clearable/>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="dialogForm.code" placeholder="请输入编码" clearable/>
      </el-form-item>
      <el-form-item v-if="dialogForm.pid === '0'" label="巡检周期" prop="period">
        <el-select v-model="dialogForm.period" placeholder="请选择巡检周期">
          <el-option v-for="(item, index) in inspectionOptions" :key="index" :label="item.name" :value="item.code"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dialogForm.pid === '0'" label="巡检次数" prop="times">
        <el-input v-model="dialogForm.times" placeholder="请输入巡检次数" clearable/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
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