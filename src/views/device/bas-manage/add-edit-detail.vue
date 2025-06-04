<template>
  <el-dialog class="custom_dialog" v-model="dialogVisible" :title="title" width="800" :close-on-click-modal="false"
             :close-on-press-escape="false" @close="close">
    <el-form ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
             label-suffix="：">
      <el-form-item label="服务区" class="form_item" prop="serviceAreaId">
        <el-select :disabled="isDisabled" v-model="dialogForm.serviceAreaId" placeholder="请选择服务区" clearable
                   @change="serviceChange">
          <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型" class="form_item" prop="typeId">
        <el-cascader
            style="width: 100%"
            :disabled="isDisabled"
            v-model="dialogForm.typeId"
            :options="deviceTypeList"
            :props="{expandTrigger: 'hover'}"
            placeholder="请选择设备类型"
            clearable
        />
      </el-form-item>

      <el-form-item label="设备名称" class="form_item" prop="name">
        <el-input :disabled="isDisabled" v-model="dialogForm.name" placeholder="请输入设备名称" clearable/>
      </el-form-item>
      <el-form-item label="设备编号" class="form_item" prop="code">
        <el-input :disabled="isDisabled" v-model="dialogForm.code" placeholder="请输入设备编号" clearable/>
      </el-form-item>
      <el-form-item label="品牌" class="form_item" prop="brand">
        <el-input :disabled="isDisabled" v-model="dialogForm.brand" placeholder="请输入品牌" clearable/>
      </el-form-item>
      <el-form-item label="规格型号" class="form_item" prop="model">
        <el-input :disabled="isDisabled" v-model="dialogForm.model" placeholder="请输入规格型号" clearable/>
      </el-form-item>
      <el-form-item label="单价(元)" class="form_item" prop="price">
        <el-input :disabled="isDisabled" v-model="dialogForm.price" placeholder="请输入单价(元)" clearable/>
      </el-form-item>
      <el-form-item label="备注" class="form_item" prop="remark">
        <el-input :disabled="isDisabled" v-model="dialogForm.remark" placeholder="请输入备注" clearable/>
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
import {addBasManage, updateBasManage, getDeviceTypeList} from '@/api/device/basManage.js';
import {getServiceArea} from "@/api/dictionaryApi.js";
import {getDeviceClassifyChildrenApi} from "@/api/public/deviceClassifyApi";

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
  obj: {
    type: Object,
    default: () => {
      return {
        serviceAreaId: '',
        type: '',
        name: '',
        code: '',
        brand: '',
        model: '',
        price: '',
        remark: '',
      }
    },
  }
});
const formRef = ref(null); // 表单ref
const dialogVisible = computed(() => {
  return props.visible;
}); // 弹窗
const title = ref('新增'); // 弹窗标题
const isDisabled = ref(false); // 禁用
const serviceAreaList = ref([]); // 服务区域列表
const deviceTypeList = ref([]); // 准确性列表
const isBtnDisabled = ref(false)

const emit = defineEmits(['dialogClose']);

// 弹窗表单数据
const dialogForm = reactive({
  serviceAreaId: '',
  typeId: '',
  name: '',
  code: '',
  brand: '',
  model: '',
  price: '',
  remark: '',
});
// 弹窗表单验证规则
const rules = reactive({
  serviceAreaId: [{required: true, message: '请选择服务区', trigger: 'change'}],
  typeId: [{required: true, message: '请选择设备类型', trigger: 'change'}],
  name: [{required: true, message: '请输入设备名称', trigger: 'blur'}],
  code: [{required: true, message: '请输入设备编号', trigger: 'blur'}],
  price: [{pattern: /^\d+(\.\d{1,2})?$/, message: '请输入正确的设备价格', trigger: 'blur'}],
});

onMounted(() => {
  getServiceOptions()
  if (props.type == 'add') {
    title.value = '新增';
    isDisabled.value = false;
  } else if (props.type == 'edit') {
    title.value = '编辑';
    isDisabled.value = false;
    getItem(props.id);
  } else if (props.type == 'detail') {
    title.value = '详情';
    isDisabled.value = true;
    getItem(props.id);
  }
})
const getServiceOptions = () => {
  serviceAreaList.value = []
  getServiceArea().then(res => {
    serviceAreaList.value = res.data.records;
  })
}

const serviceChange = (e) => {
  const params = {
    size: 100,
    index: -1,
    serviceAreaIdList: [e]
  }
  getDeviceTypeList(params).then(res => {
    deviceTypeList.value = [];
    res.data.records.map(item => {
      let result = {
        label: item.name,
        value: item.entityId,
        children: []
      }
      getDeviceClassifyChildrenApi(item.entityId).then(innerRes => {
        const data = innerRes.data;
        const childrenList = data.map(item => {
          return {
            label: item.name,
            value: item.entityId,
          }
        });
        result.children = childrenList;
        if (childrenList.length <= 0) result.disabled = true;
        deviceTypeList.value.push(result)
      });
      // item.children && item.children.map(child => {
      //     result.children.push({
      //         label: child.name,
      //         value: child.entityId
      //     });
      // })
      // deviceTypeList.value.push(result)
    })
  })
}

// 获取详情
const getItem = async (id) => {
  // let res = await getNewMediaById({ id });
  // if (res.code == 200) {
  //     Object.keys(res.data).map((key) => {
  //         dialogForm[key] = res.data[key];
  //     });
  // }
  Object.keys(props.obj).map((key) => {
    dialogForm[key] = props.obj[key];
  });
  serviceChange(dialogForm.serviceAreaId);
};
// 弹窗关闭
const close = () => {
  emit('dialogClose');
};
// 弹窗确认
const dialogConfirm = (isContinue) => {
  saveData(props.type, {
    entityId: dialogForm.entityId,
    serviceAreaId: dialogForm.serviceAreaId,
    typeId: dialogForm.typeId[1],
    name: dialogForm.name,
    code: dialogForm.code,
    brand: dialogForm.brand,
    model: dialogForm.model,
    price: dialogForm.price,
    remark: dialogForm.remark,
  }, isContinue);
};
const saveData = async (type, formData, isContinue) => {
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (type == 'add') {
        isBtnDisabled.value = true
        let res = await addBasManage(formData);
        if (res.code == 200) {
          ElMessage({
            message: '新增成功',
            type: 'success',
          });
          isBtnDisabled.value = false
          if (isContinue) {
            Object.keys(dialogForm).map((key) => {
              if (key == 'files' || key == 'filesName') dialogForm[key] = [];
              else dialogForm[key] = null;
            });
          } else {
            emit('dialogClose');
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
      if (type == 'edit') {
        let res = await updateBasManage(formData);
        if (res.code == 200) {
          ElMessage({
            message: res.data.message,
            type: 'success',
          });
          isBtnDisabled.value = false
          emit('dialogClose');
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
