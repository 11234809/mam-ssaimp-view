<!-- @format -->

<template>
  <el-dialog class="custom_dialog" v-model="dialogVisible" :title="dialogTitle" width="800"
             :close-on-click-modal="false"
             :close-on-press-escape="false" @close="close">
    <el-form ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
             :disabled="type === 3"
             label-suffix="：">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="检查时间" class="form_item" prop="checkTime">
            <el-input v-model="dialogForm.checkTime" :disabled="true" placeholder=""/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检查人员" class="form_item" prop="checkUserName">
            <el-input v-model="dialogForm.checkUserName" :disabled="true" placeholder=""/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="服务区" class="form_item" prop="serviceAreaId">
            <el-select v-model="dialogForm.serviceAreaId" placeholder="请选择服务区" filterable clearable
            :reserve-keyword="false">
              <el-option v-for="item in serviceAreaList" :key="item.value" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检查类型" class="form_item" prop="checkType">
            <el-select v-model="dialogForm.checkType" placeholder="请选择检查类型"  filterable clearable
            :reserve-keyword="false">
              <el-option v-for="item in checkTypeList" :key="item.code" :label="item.name"
                         :value="item.code"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="检查方式" class="form_item" prop="checkWay">
            <el-select v-model="dialogForm.checkWay" placeholder="请选择检查方式"  filterable clearable
            :reserve-keyword="false">
              <el-option v-for="item in checkWayList" :key="item.code" :label="item.name"
                         :value="item.code"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检查层级" class="form_item" prop="checkLevel">
            <el-select v-model="dialogForm.checkLevel" placeholder="请选择检查层级"  filterable clearable
            :reserve-keyword="false">
              <el-option v-for="item in checkLevelList" :key="item.code" :label="item.name"
                         :value="item.code"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="公共卫生间" class="form_item" prop="checkItem1Result">
            <el-input
              v-model="dialogForm.checkItem1Result"
              placeholder=""
              type="number"
              clearable
            >
              <template #append>
                <el-button @click="openRemarkPopup(1)">
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公共场区" class="form_item" prop="checkItem2Result">
            <el-input
              v-model="dialogForm.checkItem2Result"
              placeholder=""
              type="number"
              clearable
            >
              <template #append>
                <el-button @click="openRemarkPopup(2)">
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="餐饮服务" class="form_item" prop="checkItem3Result">
            <el-input
              v-model="dialogForm.checkItem3Result"
              placeholder=""
              type="number"
              clearable
            >
              <template #append>
                <el-button @click="openRemarkPopup(3)">
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="零售服务" class="form_item" prop="checkItem4Result">
            <el-input
              v-model="dialogForm.checkItem4Result"
              placeholder=""
              type="number"
              clearable
            >
              <template #append>
                <el-button @click="openRemarkPopup(4)">
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="汽车服务" class="form_item" prop="checkItem5Result">
            <el-input
              v-model="dialogForm.checkItem5Result"
              placeholder=""
              type="number"
              clearable
            >
              <template #append>
                <el-button @click="openRemarkPopup(5)">
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="人性化服务" class="form_item" prop="checkItem6Result">
            <el-input
              v-model="dialogForm.checkItem6Result"
              placeholder=""
              type="number"
              clearable
            >
              <template #append>
                <el-button @click="openRemarkPopup(6)">
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="信息化服务" class="form_item" prop="checkItem7Result">
            <el-input
              v-model="dialogForm.checkItem7Result"
              placeholder=""
              type="number"
              clearable
            >
              <template #append>
                <el-button @click="openRemarkPopup(7)" prop="checkLevel">
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应急保障" class="form_item" prop="checkItem8Result">
            <el-input
              v-model="dialogForm.checkItem8Result"
              placeholder=""
              type="number"
              clearable
            >
              <template #append>
                <el-button @click="openRemarkPopup(8)" prop="checkLevel">
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="生态环保" class="form_item" prop="checkItem9Result">
            <el-input
              v-model="dialogForm.checkItem9Result"
              placeholder=""
              type="number"
              clearable
            >
              <template #append>
                <el-button @click="openRemarkPopup(9)" prop="checkLevel">
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拓展服务" class="form_item" prop="checkItem10Result">
            <el-input
              v-model="dialogForm.checkItem10Result"
              placeholder=""
              type="number"
              clearable
            >
              <template #append>
                <el-button @click="openRemarkPopup(10)" prop="checkLevel">
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="投诉与监督" class="form_item" prop="checkItem11Result">
            <el-input
              v-model="dialogForm.checkItem11Result"
              placeholder=""
              type="number"
              clearable
            >
              <template #append>
                <el-button @click="openRemarkPopup(11)">
                  <el-icon>
                    <UploadFilled/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣分总计" class="form_item" prop="checkTotal">
            <el-input v-model="dialogForm.checkTotal" :disabled="true" placeholder=""/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog v-model="imgDialog">
      <img style="width: 100%; object-fit: cover" :src="dialogImageUrl" alt="Preview Image"/>
    </el-dialog>
    <template #footer>
      <div class="dialog-footer">
        <el-button :loading="confirmLoading" type="primary" @click="dialogConfirm">确定</el-button>
        <el-button type="primary" @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  <remarkDialog
    v-show="remarkDialogVisiable"
    :visible="remarkDialogVisiable"
    :type="remarkDialogType"
    :datas="remarkDialogData"
    :isToBody="true"
    @dialogClose="remarkDialogClose"
    @confirm="remarkDialogConfirm"
  />
</template>

<script setup>
import {ElMessage} from 'element-plus';
import {ref, reactive, onMounted, computed, defineProps, watch, defineEmits} from 'vue';
import remarkDialog from "./remarkForAdd.vue";
import {editServiceQualityApi, getServiceQualityInfoApi, saveServiceQualityApi} from "@/api/daily/serviceQualityApi";

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
  serviceAreaList: {
    type: Array,
    default: () => []
  },
  checkTypeList: {
    type: Array,
    default: () => []
  },
  checkLevelList: {
    type: Array,
    default: () => []
  },
  checkWayList: {
    type: Array,
    default: () => []
  },
})
const formRef = ref(null); // 表单ref
const dialogVisible = computed(() => {
  return props.visible;
}); // 弹窗
const dialogTitle = computed(() => {
  let title = ""
  switch (props.type) {
    case 1:
      title = "新增";
      break;
    case 2:
      title = "编辑";
      break;
    case 3:
      title = "详情";
      break;
    default:
      title = "新增";
      break;
  }
  return title;
})

const imgDialog = ref(false); // 预览图片弹窗
const dialogImageUrl = ref(''); // 预览图片地址
const remarkDialogVisiable = ref(false);
const remarkDialogData = ref({});
const remarkDialogType = ref(null)
const resData = ref({})
const confirmLoading = ref(false); // 提交loading

const emit = defineEmits(['dialogClose']);

// 弹窗表单数据
const dialogForm = reactive({
  checkTime: '',
  checkUserName: '',
  checkUserId: '',
  serviceAreaId: '',
  checkType: '',
  checkWay: '',
  checkLevel: '',
  checkItem1Result: 0,
  checkItem2Result: 0,
  checkItem3Result: 0,
  checkItem4Result: 0,
  checkItem5Result: 0,
  checkItem6Result: 0,
  checkItem7Result: 0,
  checkItem8Result: 0,
  checkItem9Result: 0,
  checkItem10Result: 0,
  checkItem11Result: 0,
  checkTotal: 0
});
const checkFiles = reactive({
  checkItem1Files: [],
  checkItem2Files: [],
  checkItem3Files: [],
  checkItem4Files: [],
  checkItem5Files: [],
  checkItem6Files: [],
  checkItem7Files: [],
  checkItem8Files: [],
  checkItem9Files: [],
  checkItem10Files: [],
  checkItem11Files: [],
})

const delFileList = ref([]); // 删除文件列表
const checkItemList = ref([
  { type: 1, remark: ''},
  { type: 2, remark: ''},
  { type: 3, remark: ''},
  { type: 4, remark: ''},
  { type: 5, remark: ''},
  { type: 6, remark: ''},
  { type: 7, remark: ''},
  { type: 8, remark: ''},
  { type: 9, remark: ''},
  { type: 10, remark: ''},
  { type: 11, remark: ''},
])
// 弹窗表单验证规则
const rules = reactive({
  // 检查时间（非必填）
  checkTime: [
    {required: false, message: "请输入检查时间", trigger: "blur"}
  ],
  // 检查人员（非必填）
  checkUserName: [
    {required: false, message: "请输入检查人员", trigger: "blur"}
  ],
  // 服务区（必填）
  serviceAreaId: [
    {required: true, message: "请选择服务区", trigger: "change"}
  ],
  // 检查类型（必填）
  checkType: [
    {required: true, message: "请选择检查类型", trigger: "change"}
  ],
  // 检查方式（必填）
  checkWay: [
    {required: true, message: "请选择检查方式", trigger: "change"}
  ],
  // 检查层级（必填）
  checkLevel: [
    {required: true, message: "请选择检查层级", trigger: "change"}
  ],
  // 检查项结果（必填，且必须是数字）
  checkItem1Result: [
    {required: true, message: "请输入公共卫生间扣分", trigger: "blur"},
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "请输入有效的数字，最多两位小数", trigger: "blur" }
  ],
  checkItem2Result: [
    {required: true, message: "请输入公共场区扣分", trigger: "blur"},
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "请输入有效的数字，最多两位小数", trigger: "blur" }
  ],
  checkItem3Result: [
    {required: true, message: "请输入餐饮服务扣分", trigger: "blur"},
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "请输入有效的数字，最多两位小数", trigger: "blur" }
  ],
  checkItem4Result: [
    {required: true, message: "请输入零售服务扣分", trigger: "blur"},
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "请输入有效的数字，最多两位小数", trigger: "blur" }
  ],
  checkItem5Result: [
    {required: true, message: "请输入汽车服务扣分", trigger: "blur"},
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "请输入有效的数字，最多两位小数", trigger: "blur" }
  ],
  checkItem6Result: [
    {required: true, message: "请输入人性化服务扣分", trigger: "blur"},
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "请输入有效的数字，最多两位小数", trigger: "blur" }
  ],
  checkItem7Result: [
    {required: true, message: "请输入信息化服务扣分", trigger: "blur"},
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "请输入有效的数字，最多两位小数", trigger: "blur" }
  ],
  checkItem8Result: [
    {required: true, message: "请输入应急保障扣分", trigger: "blur"},
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "请输入有效的数字，最多两位小数", trigger: "blur" }
  ],
  checkItem9Result: [
    {required: true, message: "请输入生态环保扣分", trigger: "blur"},
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "请输入有效的数字，最多两位小数", trigger: "blur" }
  ],
  checkItem10Result: [
    {required: true, message: "请输入拓展服务扣分", trigger: "blur"},
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "请输入有效的数字，最多两位小数", trigger: "blur" }
  ],
  checkItem11Result: [
    {required: true, message: "请输入投诉与监督扣分", trigger: "blur"},
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "请输入有效的数字，最多两位小数", trigger: "blur" }
  ]
})

// 监听 checkItem1Result 到 checkItem11Result 的变化
watch(
  () => [
    dialogForm.checkItem1Result,
    dialogForm.checkItem2Result,
    dialogForm.checkItem3Result,
    dialogForm.checkItem4Result,
    dialogForm.checkItem5Result,
    dialogForm.checkItem6Result,
    dialogForm.checkItem7Result,
    dialogForm.checkItem8Result,
    dialogForm.checkItem9Result,
    dialogForm.checkItem10Result,
    dialogForm.checkItem11Result
  ],
  (newValues) => {
    // 计算总和
    const total = newValues.reduce((sum, value) => {
      const num = Number(value)
      return Number.isNaN(num) ? sum : sum + num
    }, 0)
    dialogForm.checkTotal = Number(total).toFixed(2)
  },
  {deep: true, immediate: true} // 深度监听，立即执行一次
);

// 获取详情
const getUtilitiesMonthlyItem = async (id) => {
  const res = await getServiceQualityInfoApi(id);
  if (Number(res.code) === 200) {
    dialogForm.entityId = res.data.entityId;
    dialogForm.checkTime = res.data.checkTime;
    dialogForm.checkUserName = res.data.checkUserName;
    dialogForm.checkUserId = res.data.checkUserId;
    dialogForm.serviceAreaId = res.data.serviceAreaId.toString()
    dialogForm.checkType = res.data.checkType.toString()
    dialogForm.checkWay = res.data.checkWay.toString()
    dialogForm.checkLevel = res.data.checkLevel.toString()
    dialogForm.checkItem1Result = Number(res.data.checkItem1Result)
    dialogForm.checkItem2Result = Number(res.data.checkItem2Result)
    dialogForm.checkItem3Result = Number(res.data.checkItem3Result)
    dialogForm.checkItem4Result = Number(res.data.checkItem4Result)
    dialogForm.checkItem5Result = Number(res.data.checkItem5Result)
    dialogForm.checkItem6Result = Number(res.data.checkItem6Result)
    dialogForm.checkItem7Result = Number(res.data.checkItem7Result)
    dialogForm.checkItem8Result = Number(res.data.checkItem8Result)
    dialogForm.checkItem9Result = Number(res.data.checkItem9Result)
    dialogForm.checkItem10Result = Number(res.data.checkItem10Result)
    dialogForm.checkItem11Result = Number(res.data.checkItem11Result)
    dialogForm.checkTotal = Number(res.data.checkTotal)
    // 处理数据赋值
    for (let i = 1; i <= 11; i++) {
      const picKey = `checkItem${i}Pic`;
      const filesKey = `checkItem${i}Files`;
      if (res.data[picKey]) {
        checkFiles[filesKey] = res.data[picKey].files;
        checkItemList.value[i - 1].remark = res.data[picKey].remark || '';
      }
    }
  }
};

const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  // 月份从 0 开始计数，所以要加 1，并且保证是两位数
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 弹窗关闭
const close = () => {
    confirmLoading.value = false;
    emit('dialogClose');
};

// 子弹框关闭
const remarkDialogConfirm = (type, remark, files, delFiles) => {
  delFileList.value = delFiles
  checkItemList.value.forEach((item) => {
    if (Number(item.type) === Number(type)) {
      item.remark = remark
    }
  })
  // 根据 type 找到对应的键名，并更新 checkFiles 中的值
  const key = `checkItem${type}Files`; // 构造键名
  if (key in checkFiles) {
    checkFiles[key] = files; // 更新对应的文件列表
  }
}

// 弹窗确认
const dialogConfirm = async () => {
    formRef.value.validate( async (valid) => {
    if (valid) {
      confirmLoading.value = true;
      const formData = new FormData();
      formData.append("request", JSON.stringify(dialogForm))
      // 遍历 checkFiles 中的每个数组
      for (const key in checkFiles) {
        if (checkFiles[key].length > 0) {
          checkFiles[key].map((item) => {
            if (!Object.keys(item).includes("entityId")) {
              console.log(item.path)
              formData.append(key, item.path)
            }
          });
        }
      }
      formData.append('deleteFileIdList', JSON.stringify(delFileList.value))
      formData.append('checkItemList', JSON.stringify(checkItemList.value))
      let res
      if (props.type === 1) {
        res = await saveServiceQualityApi(formData, {'Content-Type': 'multipart/form-data'})
      } else if (props.type === 2) {
        res = await editServiceQualityApi(formData, {'Content-Type': 'multipart/form-data'})
      }
      confirmLoading.value = false;
      if (Number(res.code) === 200) {
        ElMessage({
          message: res.data.message,
          type: 'success',
        });
        close()
      } else if (Number(res.code) === 500) {
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
  })
}


const openRemarkPopup = (type) => {
  if (props.type === 2) {
    remarkDialogData.value = {
      remark: checkItemList.value[Number(type) - 1].remark || '',
      files: checkFiles[`checkItem${type}Files`] || []
    }
      // remarkDialogData.value = resData.value[`checkItem${type}Pic`]
  }
  if (props.type === 1) {
    remarkDialogData.value = {
      remark: checkItemList.value[Number(type) - 1].remark || '',
      files: checkFiles[`checkItem${type}Files`] || []
    }
  }
  remarkDialogType.value = type
  remarkDialogVisiable.value = true
}
const remarkDialogClose = () => {
  remarkDialogData.value = {}
  remarkDialogType.value = null
  remarkDialogVisiable.value = false
}

onMounted(() => {
  if (props.type === 1) {
    dialogForm.checkTime = getCurrentTime()
    const userInfo = JSON.parse(sessionStorage.getItem(('userInfo')))
    dialogForm.checkUserId = userInfo.id
    dialogForm.checkUserName = userInfo.name
  } else {
    getUtilitiesMonthlyItem(props.id)
  }
});
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
