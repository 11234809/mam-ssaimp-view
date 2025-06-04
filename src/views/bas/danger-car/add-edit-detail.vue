<!-- @format -->

<template>
  <div class="add_edit_detail">
    <el-dialog
      class="custom_dialog"
      v-model="props.visible"
      width="790"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :destroy-on-close="true"
    >
      <template #header>
        <div class="add-edit-header">
          <h4>{{ title }}</h4>
          <img src="@/assets/images/close.png" @click="close" />
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="dialogForm"
        label-width="auto"
        class="custom_form"
        :rules="rules"
      >
        <el-form-item label="服务区" class="form_item" prop="serviceAreaId">
          <el-select
            v-model="dialogForm.serviceAreaId"
            placeholder="请选择服务区名称"
            filterable
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="(item, index) in serviceAreaList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" class="form_item" prop="plateNumber">
          <el-input
            v-model="dialogForm.plateNumber"
            placeholder="请输入车牌号"
            :disabled="isDisabled"
            clearable
          />
        </el-form-item>
        <el-form-item label="车牌颜色" class="form_item" prop="plateType">
          <el-select
            v-model="dialogForm.plateType"
            placeholder="请选择车牌颜色"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="(item, index) in platecolorcodeList"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="危化品名称" class="form_item" prop="dangerItemName">
          <el-select
            v-model="dialogForm.dangerItemName"
            placeholder="请选择危化品名称"
            :disabled="isDisabled"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="(item, index) in dangerItemOptions"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="行驶路线（起点）" class="form_item" prop="startRoute">
          <el-cascader
            style="width: 100%"
            v-model="startRoute"
            filterable
            :options="provinceList"
            :disabled="isDisabled"
            placeholder="请选择行驶路线（起点）"
            @change="routeChange('startRoute', $event)"
          />
        </el-form-item>
        <el-form-item label="行驶路线（终点）" class="form_item" prop="endRoute">
          <el-cascader
            style="width: 100%"
            v-model="endRoute"
            filterable
            :options="provinceList"
            :disabled="isDisabled"
            placeholder="请选择行驶路线（终点）"
            @change="routeChange('endRoute', $event)"
          />
        </el-form-item>
        <el-form-item label="驾驶员" class="form_item" prop="driver">
          <el-input
            v-model="dialogForm.driver"
            placeholder="请输入驾驶员"
            :disabled="isDisabled"
            clearable
          />
        </el-form-item>
        <el-form-item label="联系电话" class="form_item" prop="tel">
          <el-input
            v-model="dialogForm.tel"
            placeholder="请输入联系电话"
            :disabled="isDisabled"
            clearable
          />
        </el-form-item>
        <el-form-item label="驶入时间" class="form_item" prop="startTime">
          <el-date-picker
            style="width: 100%"
            v-model="dialogForm.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择驶入时间"
            :disabled="isDisabled"
            @change="checkDate('startTime', $event)"
          />
        </el-form-item>
        <el-form-item label="驶入图片" class="form_item" prop="startPic" required>
          <el-upload
            v-model:file-list="dialogForm.startPicNames"
            :disabled="isDisabled"
            class="upload-demo"
            action="#"
            list-type="picture"
            accept=".jpeg,.png,.jpg,.bmp,.gif"
            :http-request="customUpload"
            multiple
          >
            <el-button>
              <el-icon class="el-icon--right"> <Plus /> </el-icon>点击上传
            </el-button>
            <template #file="{ file }">
              <div class="cst_upload_box">
                <img class="cst_upload_img" :src="file.url" alt="" />
                <span class="cst_upload_name">{{ file.name }}</span>
                <div class="cst_upload_icon" @click="handleRemove(file)">
                  <el-icon>
                    <Close />
                  </el-icon>
                </div>
                <div class="cst_upload_view" @click="handlePicturePreview(file)">
                  <el-icon><View /></el-icon>
                </div>
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="isBtnShow" type="info" @click="dialogConfirm" :loading="loading">
            保存并继续添加
          </el-button>
          <el-button v-if="!isDisabled" type="primary" @click="dialogConfirm" :loading="loading">
            保存<img src="@/assets/images/sure.png" />
          </el-button>
          <el-button @click="close">
            关闭<img src="@/assets/images/cancel.png" />
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="imgDialogVisible" width="60%" style="max-height: 70%;overflow: hidden;overflow-y: scroll;">
        <img :src="dialogImageUrl" width="100%" style="object-fit: contain;" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, nextTick, onMounted, computed, watch } from 'vue';
import cityArea from './cityArea.js';
import {
  getNormalOptions,
  getBasDangerItemList,
  getServiceArea,
} from '@/api/dictionaryApi.js';
import {
  getBasDangerCarAdd,
  getBasDangerCarEdit,
  getBasDangerCarGet,
  getFileInfo,
} from '@/api/dangerCarApi.js';

const emit = defineEmits(['dialogClose']);
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
const dialogVisible = ref(false); // 弹窗
const title = ref('新增'); // 弹窗标题
// 弹窗表单数据
const dialogForm = reactive({
  serviceAreaId: '', // 服务区
  plateNumber: '', // 车牌号
  plateType: '', // 车牌颜色
  dangerItemName: '', // 危化品名称
  startRoute: [], // 行驶路线（起点）
  endRoute: [], // 行驶路线（终点）
  driver: '', // 驾驶员
  tel: '', // 联系电话
  startTime: '', // 驶入时间
  startPic: '', // 驶入图片
});
const startRoute = ref([]); // 行驶路线（起点）
const endRoute = ref([]); // 行驶路线（终点）
// 弹窗表单验证规则
const rules = reactive({
  serviceAreaId: [{ required: true, message: '请选择服务区名称', trigger: 'change' }],
  plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'change' }],
  plateType: [{ required: true, message: '请选择车牌颜色', trigger: 'change' }],
  dangerItemName: [{ required: true, message: '请选择危化品名称', trigger: 'change' }],
  startRoute: [{ required: true, message: '请选择行驶路线（起点）', trigger: 'change' }],
  endRoute: [{ required: true, message: '请选择行驶路线（终点）', trigger: 'change' }],
  driver: [{ required: true, message: '请输入驾驶员', trigger: 'change' }],
  tel: [{ required: true, message: '请输入联系电话', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择驶入时间', trigger: 'change' }],
  startPic: [{ required: true, message: '请上传驶入图片', trigger: 'change' }],
});
const formRef = ref(null); // 表单ref
const isDisabled = ref(false); // 禁用
const isBtnShow = ref(false); // 重复保存按钮
const files = ref([]); // 附件列表
const fileList = ref([]); // 附件列表
const platecolorcodeList = ref([]); // 车牌颜色列表
const dangerItemOptions = ref([]); // 危化品名称列表
const serviceAreaList = ref([]); // 服务区列表
const provinceList = ref([]); // 省市区列表
var imgDialogVisible = ref(false); // 预览图片弹窗
var dialogImageUrl = ref(''); // 预览图片地址

onMounted(() => {
  if (props.type == 'add') {
    title.value = '新增特殊车辆';
    isDisabled.value = false;
    isBtnShow.value = true;
  } else if (props.type == 'edit') {
    title.value = '编辑特殊车辆';
    isDisabled.value = false;
    getDangerCar(props.id);
  } else if (props.type == 'detail') {
    title.value = '特殊车辆详情';
    isDisabled.value = true;
    getDangerCar(props.id);
  }
});
// 获取详情
async function getDangerCar(id) {
  let res = await getBasDangerCarGet({ id });
  if (res.code == 200) {
    Object.keys(res.data).map((key) => {
      dialogForm[key] = res.data[key];
    });
    dialogForm.startPicNames = [];
    if (res.data.startPic) {
      let arr = res.data.startPic.split(',');
      arr.map(async (item) => {
        await getFileInfo({ id: item }).then(async (res) => {
          if (res.code == 200) {
            await dialogForm.startPicNames.push({
              uid: item,
              name: res.data.fileName,
              url: getImgForId(item),
            });
          } else {
            dialogForm.startPicNames = [];
          }
        });
      });
    }
    startRoute.value = res.data.startRoute ? res.data.startRoute.split('-') : "";
    endRoute.value = res.data.endRoute ? res.data.endRoute.split('-') : "";
  }
}
// 图片转换
function getImgForId(id) {
  return (
    process.env.VUE_APP_API_HOST_URL +
    process.env.VUE_APP_API_BASE_URL +
    `/pub/common/file/download?service=basDangerCarFileServiceImpl&id=${id}`
  );
}
// 获取字典数据
function getDictionary() {
  // 获取车牌颜色
  getNormalOptions({ queriers: [{ alias: 'plateColorDictionary', param: null }] })
    .then(({ code, data }) => {
      if (code == 200) {
        platecolorcodeList.value = data.plateColorDictionary;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  // 获取危化品
  getBasDangerItemList({ index: 1, size: -1 })
    .then((res) => {
      if (res.code == 200) {
        dangerItemOptions.value = [];
        res.data.records.forEach((item) => {
          dangerItemOptions.value.push({
            name: item.dangerItemName,
            code: item.entityId,
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  // 获取服务区
  getServiceArea()
    .then(({ code, data }) => {
      if (code == 200) {
        serviceAreaList.value = data.records;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  getProvinceList();
}
// 获取省市区数据
function getProvinceList() {
  let cityAreaList = cityArea.provinceList;
  cityAreaList.map((item) => {
    (item.id = item.value), (item.value = item.label);
    item.children.map((itemF) => {
      (itemF.id = itemF.value), (itemF.value = itemF.label);
      itemF.children.map((itemT) => {
        (itemT.id = itemT.value), (itemT.value = itemT.label);
      });
    });
  });
  provinceList.value = cityAreaList;
}
getDictionary();

function routeChange(type, val) {
  if (val.length > 0) {
    dialogForm[type] = val.join('-');
  } else {
    dialogForm[type] = null;
  }
}

function checkDate(type, value) {
  if (type == 'startTime') {
    dialogForm.startTime = value;
  }
}
// 删除图片
const handleRemove = (file) => {
  if (props.type !== 'detail') {
    dialogForm.startPicNames = dialogForm.startPicNames.filter(
      (item) => item.uid !== file.uid
    );
    if (picList.value.length > 0) {
      picList.value = picList.value.filter((item) => item.uid !== file.uid);
    }
    if (dialogForm.startPic) {
      dialogForm.startPic = dialogForm.startPic
        .split(',')
        .filter((item) => item !== file.uid)
        .join(',');
    }
  }
};
const picList = ref([]); // 图片列表
// 上传图片
const customUpload = (file) => {
  console.log(file, '上传file');
  
  picList.value.push({
    path: file.file,
    uid: file.file.uid,
    value: '0',
    nodeName: file.file.name,
    type: file.file.type,
  });
  formRef.value.clearValidate('startPic');
};
const loading = ref(false);
const dialogConfirm = () => {
  const formData = new FormData();
  formData.append('request', JSON.stringify(dialogForm));
  picList.value.map((item) => {
    formData.append('startPic', item.path);
  });
  saveData(props.type, formData);
};
async function saveData(type, formData) {
  await formRef.value.validate(async (valid, fields) => {
    if (!dialogForm.startPic) {
      if (picList.value.length > 0) {
        valid = true;
        formRef.value.clearValidate('startPic');
      } else {
        valid = false;
      }
    }
    if (valid) {
      loading.value = true;
      if (type == 'add') {
        let res = await getBasDangerCarAdd(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.code == 200) {
          ElMessage({
            message: res.data.message,
            type: 'success',
          });
          loading.value = false;
          emit('dialogClose');
          if (isBtnShow === false) {
            emit('dialogClose');
          }
        } else if (res.code == 500) {
          ElMessage({
            message: res.message,
            type: 'error',
          });
          loading.value = false;
        }
      }
      if (type == 'edit') {
        let res = await getBasDangerCarEdit(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.code == 200) {
          ElMessage({
            message: res.data.message,
            type: 'success',
          });
          emit('dialogClose');
        }
        if (res.code == 500) {
          ElMessage({
            message: res.data.message,
            type: 'error',
          });
        }
      }
    }
  });
}
const close = () => {
  emit('dialogClose');
};
// 查看图片
function handlePicturePreview (file) {
    dialogImageUrl.value = file.url;
    imgDialogVisible.value = true;
}
</script>

<style lang="less" scoped>
.add_edit_detail {
  .custom_dialog {
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
      img {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
    .custom_form {
      margin-bottom: 20px;

      .form_item {
        .el-select,
        .el-input {
          min-width: 240px;
        }

        .separator {
          margin: 0 10px;
        }

        .upload-demo {
          width: 100%;
        }
      }
    }

    .tips_box {
      display: flex;
      align-items: center;
      height: 40px;
      background-color: #0099ff32;
      border: 1px solid aqua;
      border-radius: 3px;
      margin-bottom: 10px;
      padding: 10px;

      .tips {
        font-size: var(--fontSize16);

        .tips_num {
          color: blue;
        }
      }

      .tips_num_close {
        margin-left: 10px;
        color: blue;
      }
    }

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
        }
        .cst_upload_view {
            margin-left: 10px;
            padding-top: 5px;
        }
      }
    }
  }
}
</style>
