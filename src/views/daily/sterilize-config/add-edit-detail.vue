<template>
  <el-dialog class="custom_dialog" v-model="dialogVisible" :title="title" width="800" :close-on-click-modal="false"
             :close-on-press-escape="false" @close="close">
    <el-form ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
             label-suffix="：">
      <el-form-item label="服务区" class="form_item" prop="serviceAreaId">
        <el-select v-model="dialogForm.serviceAreaId" :disabled="isDisabled" placeholder="请选择服务区" clearable>
          <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" class="form_item" prop="type">
        <el-select v-model="dialogForm.type" :disabled="isDisabled" placeholder="请选择区域类型" clearable>
          <el-option v-for="(item, index) in areaTypeList" :key="index" :label="item.name"
                     :value="item.code"/>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" class="form_item" prop="name">
        <el-input v-model="dialogForm.name" :disabled="isDisabled" placeholder="请输入名称"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :disabled="isBtnDisabled" v-if="!isDisabled" @click="dialogConfirm(false)">确定</el-button>
        <el-button type="primary" @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ElMessage} from 'element-plus';
import {ref, reactive, nextTick, onMounted, computed} from 'vue';
import {
  addSterilizeConfig,
  updateSterilizeConfig,
  getSterilizeConfigById
} from '@/api/daily/sterilizeConfig.js';
import {getServiceArea} from "@/api/dictionaryApi.js";
import {queryNormalOptions} from '@/api/dictionaryApi.js';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'add',
  },
  id: {
    type: String,
    default: '',
  },
});
const formRef = ref(null); // 表单ref
const isBtnDisabled = ref(false); // 按钮禁用
const dialogVisible = computed(() => {
  return props.visible;
}); // 弹窗
const title = ref('新增'); // 弹窗标题
const isDisabled = ref(false); // 禁用
const serviceAreaList = ref([]); // 服务区域列表
const areaTypeList = ref([]);

const emit = defineEmits(['dialogClose']);

// 弹窗表单数据
const dialogForm = reactive({
  entityId: undefined,
  serviceAreaId: '',
  type: '',
  name: '',
});
// 弹窗表单验证规则
const rules = reactive({
  serviceAreaId: [{ required: true, message: '请选择服务区', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'change' }],
});

onMounted(() => {
  if (props.type == 'add') {
    title.value = '新增';
    isDisabled.value = false;
  } else if (props.type == 'edit') {
    title.value = '编辑';
    isDisabled.value = false;
    getSterilizeConfigItem(props.id);
  } else if (props.type == 'detail') {
    title.value = '详情';
    isDisabled.value = true;
    getSterilizeConfigItem(props.id);
  }
});
queryNormalOptions({
  queriers: [{alias: 'sterilizeRecordDisinfectTypeDictionary', param: null}],
}).then((res) => {
  areaTypeList.value = res.data.sterilizeRecordDisinfectTypeDictionary;
});
getServiceArea().then(res => {
  serviceAreaList.value = res.data.records;
});
// 获取详情
const getSterilizeConfigItem = async (id) => {
  let res = await getSterilizeConfigById({id});
  if (res.code == 200) {
    Object.keys(dialogForm).map((key) => {
      dialogForm[key] = res.data[key];
    });
  }
};
// 弹窗关闭
const close = () => {
  emit('dialogClose');
};
// 弹窗确认
const dialogConfirm = () => {
  const formData = new FormData();
  formData.append('request', JSON.stringify(dialogForm));
  saveData(props.type, formData);
};
const saveData = async (type, formData) => {
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      isBtnDisabled.value = true
      if (type == 'add') {
        let res = await addSterilizeConfig(formData);
        if (res.code == 200) {
          ElMessage({
            message: res.data.message,
            type: 'success',
          });
          isBtnDisabled.value = false
          emit('dialogClose');
        } else if (res.code == 500) {
          ElMessage({
            message: res.message,
            type: 'warning',
          });
        } else {
          ElMessage({
            message: res.message || res.data.message,
            type: 'error',
          });
        }
      }
      if (type == 'edit') {
        let res = await updateSterilizeConfig(formData);
        if (res.code == 200) {
          ElMessage({
            message: res.data.message,
            type: 'success',
          });
          isBtnDisabled.value = false
          emit('dialogClose');
        } else if (res.code == 500) {
          ElMessage({
            message: res.message,
            type: 'warning',
          });
        } else {
          ElMessage({
            message: res.message || res.data.message,
            type: 'error',
          });
        }
      }
    } else {
      return false;
    }
  });
};
</script>

<style lang="less" scoped>
.upload-demo {
  width: 100%;
  
  .cst_upload_box {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 80px;
    
    .cst_upload_img {
      width: 140px;
      height: 100%;
      object-fit: fill;
    }
    
    .cst_upload_name {
      margin-left: 20px;
    }
    
    .cst_upload_icon {
      position: absolute;
      top: 0;
      right: 0;
      
      .el-icon:nth-child(1) {
        margin-right: 12px;
      }
      
      .el-icon {
        cursor: pointer;
      }
    }
  }
}

.add-edit-header {
  color: --whiteBtnTextColor;
  display: flex;
  justify-content: space-between;
  padding: 10px 18px;
  
  h4 {
    position: relative;
    display: flex;
    font-weight: bold;
    font-size: 18px;
    
    &::before {
      content: '';
      width: 5px;
      height: 16px;
      background-color: #114484;
      position: absolute;
      left: -10px;
      top: 4px;
    }
  }
}
</style>
