<!-- 专项工作下发-详情 -->
<template>
  <div class="add_edit_detail">
    <el-dialog class="custom_dialog" v-model="props.visible" width="1000" :close-on-press-escape="false"
      :close-on-click-modal="false" destroy-on-close :show-close="false">
      <template #header>
        <div class="add-edit-header">
          <h4>{{ title }}</h4>
          <img src="@/assets/images/close.png" @click="close" />
        </div>
      </template>
      <el-form :model="baseForm" label-width="auto" class="custom_form" :rules="rules" label-suffix="：" ref="formRef">
        <el-tag class="tag_box" type="primary" size="large"> 基本信息 </el-tag>
        <el-form-item label="专项工作名称" class="form_item" prop="name">
          <el-input v-model="baseForm.name" placeholder="请输入专项工作名称" :disabled="isDisabled" clearable />
        </el-form-item>
        <el-form-item label="专项类型" class="form_item" prop="type">
          <el-select v-model="baseForm.type" placeholder="请选择专项类型" :disabled="isDisabled" clearable>
            <el-option v-for="(item, index) in listOptions.typeList" :key="index" :label="item.name"
              :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="要求完成时间" class="form_item" prop="requireTime">
          <el-date-picker style="width: 100%" :disabled="isDisabled" v-model="baseForm.requireTime" type="date"
            placeholder="请选择要求完成时间" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="专项内容" class="form_item" prop="content">
          <el-input v-model="baseForm.content" type="textarea" :rows="2" placeholder="请输入专项内容" clearable
            :disabled="isDisabled" />
        </el-form-item>
        <el-form-item label="预算金额(元)" class="form_item" prop="money">
          <!-- <el-input
            v-model="baseForm.money"
            placeholder="请输入预算金额(元)"
            :disabled="isDisabled"
            clearable
            :formatter="(value) => value.replace(/[^\d+\.?\d{0,2}]/g, '')"
          /> -->
          <el-input-number v-model="baseForm.money" :min="0" :step="0.01" step-strictly controls-position="right"
            style="width: 100%" :disabled="isDisabled" placeholder="请输入预算金额(元)" />
        </el-form-item>
        <el-form-item label="附件" class="form_item" prop="files">
          <el-upload v-model:file-list="baseForm.filesName" :disabled="isDisabled" class="upload-demo" action="#"
            list-type="text" :http-request="customUpload">
            <el-button>
              <el-icon class="el-icon--right">
                <Plus />
              </el-icon>点击上传
            </el-button>
            <template #file="{ file }">
              <div class="cst_upload_box">
                <span class="cst_upload_name">{{ file.name || file.fileName }}</span>
                <div class="cst_upload_icon">
                  <el-icon @click="handleRemove(file)" v-if="!isDisabled">
                    <Close />
                  </el-icon>
                  <el-icon @click="handleDownload(file)">
                    <el-icon>
                      <Download />
                    </el-icon>
                  </el-icon>
                </div>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-tag class="tag_box" type="primary" size="large">专项明细</el-tag>
        <el-form-item label="服务区" class="form_item" prop="serviceAreaIdList">
          <div class="area-box">
            <el-select v-model="baseForm.serviceAreaIdList" placeholder="请选择服务区" :disabled="isDisabled" clearable
              multiple filterable collapse-tags collapse-tags-tooltip :max-collapse-tags="4"
              @change="getCompanyByServiceArea" 
              :reserve-keyword="false">
              <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                :value="item.value" />
            </el-select>
            <el-button :disabled="isDisabled" class="area-btn" type="primary" @click="checkAll">全选</el-button>
          </div>
          <div>
            已选择服务区： {{ baseForm.serviceAreaIdList?.length ?? 0 }}个
          </div>
        </el-form-item>
      </el-form>
      <div class="import-btn">
        <el-button type="primary" style="margin-right: 10px" @click="handleDownloadFile">模板下载</el-button>
        <el-upload action="#" accept=".xlsx,.xls" :http-request="customFileUpload" :show-file-list="false">
          <el-button type="primary" :disabled="isDisabled">批量导入</el-button>
        </el-upload>
      </div>
      <div class="stats-box">
        (统计： 充电停车位年度目标任务:{{ totals.chargingParkNumSum }}个;
        充电桩年度目标任务:{{ totals.chargingPileNumSum }}个;
        超充桩年度目标任务:{{ totals.superChargingPileNumSum }}个;
        超充枪年度目标任务:{{ totals.superChargingGunNumSum }}个;)
      </div>
      <el-table class="custom_table" ref="tableRef" border :data="tableData">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="companyName" label="公司" align="center" show-overflow-tooltip />
        <el-table-column prop="serviceAreaName" label="服务区" align="center" show-overflow-tooltip />
        <el-table-column prop="chargingParkNum" align="center">
          <template #header>
            <span style="color: red">*</span>
            充电停车位(个)
          </template>
          <template #default="{ row }">
            <el-input-number v-model="row.chargingParkNum" class="mx-4" :min="0" step-strictly controls-position="right"
              style="width: 100%" :disabled="isDisabled" value-on-clear="min" />
          </template>
        </el-table-column>
        <el-table-column prop="chargingPileNum" align="center">
          <template #header>
            <span style="color: red">*</span>
            充电桩(个)
          </template>
          <template #default="{ row }">
            <el-input-number v-model="row.chargingPileNum" class="mx-4" :min="0" step-strictly controls-position="right"
              style="width: 100%" :disabled="isDisabled" />
          </template>
        </el-table-column>
        <el-table-column prop="superChargingPileNum" align="center" show-overflow-tooltip>
          <template #header>
            <span style="color: red">*</span>
            超充桩(个)
          </template>
          <template #default="{ row }">
            <el-input-number v-model="row.superChargingPileNum" class="mx-4" :min="0" step-strictly
              controls-position="right" style="width: 100%" :disabled="isDisabled" />
          </template>
        </el-table-column>
        <el-table-column prop="superChargingGunNum" align="center" show-overflow-tooltip>
          <template #header>
            <span style="color: red">*</span>
            超充枪(个)
          </template>
          <template #default="{ row }">
            <el-input-number v-model="row.superChargingGunNum" class="mx-4" :min="0" step-strictly
              controls-position="right" style="width: 100%" :disabled="isDisabled" />
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="imgDialog">
        <img style="width: 100%; object-fit: cover" :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="confirmLoading" v-if="props.type !== 'detail'" type="primary"
            @click="submit">保存</el-button>
          <el-button type="primary" @click="close">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref, onMounted, computed, watchEffect, watch } from "vue";
import { getCompany, getServiceArea } from "@/api/dictionaryApi.js";
import {
  getBasJobDetail,
  addBasJob,
  getDetailArea,
  basJobImport,
  editBasJob,
} from "@/api/daily/basJob";
import { exportData } from "@/utils/common-features";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: {},
  },
  type: {
    type: String,
    default: "add",
  },
  options: {
    type: Object,
    default: () => {
      return {
        typeList: [],
        mattersTypeList: [],
      };
    },
  },
});
const emit = defineEmits(["dialogClose"]);

const listOptions = computed(() => {
  return props.options;
});
const isDisabled = ref(false);
const baseForm = ref({
  serviceAreaIdList: [],
  filesName: [],
});
const allotsForm = reactive({});
const rules = reactive({
  name: [{ required: true, message: "请输入专项工作名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择专项工作类型", trigger: "change" }],
  serviceAreaIdList: [
    { required: true, message: "请选择服务区", trigger: "change" },
  ],
  requireTime: [
    { required: true, message: "请选择要求完成时间", trigger: "change" },
  ],
  content: [{ required: true, message: "请输入专项内容", trigger: "blur" }],
});
const tableRef = ref();
const tableData = ref([]);
const title = ref("新增");
const serviceAreaList = ref([]);
const picList = ref([]); // 图片列表
const formRef = ref();
const file = ref();
const imgDialog = ref(false); // 预览图片弹窗
const dialogImageUrl = ref(""); // 预览图片地址
// 需要转为数值类型的键
const keyList = [
  "chargingParkNum",
  "chargingPileNum",
  "superChargingPileNum",
  "superChargingGunNum",
];
const confirmLoading = ref(false); // 提交按钮loading

// 数据统计
const totals = computed(() => {
  const sum = {
    chargingParkNumSum: 0,
    chargingPileNumSum: 0,
    superChargingPileNumSum: 0,
    superChargingGunNumSum: 0,
  };
  tableData.value?.forEach((item) => {
    sum.chargingParkNumSum = sum.chargingParkNumSum + item.chargingParkNum;
    sum.chargingPileNumSum = sum.chargingPileNumSum + item.chargingPileNum;
    sum.superChargingPileNumSum =
      sum.superChargingPileNumSum + item.superChargingPileNum;
    sum.superChargingGunNumSum =
      sum.superChargingGunNumSum + item.superChargingGunNum;
  });
  return sum;
});
// 根据选择服务区获取公司
const getCompanyByServiceArea = (val) => {
  getDetailArea({ serviceAreaIdList: val }).then(({ code, data }) => {
    if (code == 200) {
      const oldList = [...tableData.value];
      tableData.value = data.map((item) => {
        const index = oldList.findIndex((v) => v.companyId === item.companyId);
        if (index === -1) {
          return {
            ...item,
            chargingParkNum: 0,
            chargingPileNum: 0,
            superChargingPileNum: 0,
            superChargingGunNum: 0,
            serviceAreaName: item.name,
            serviceAreaId: item.entityId,
          };
        } else {
          return oldList[index];
        }
      });
    }
  });
};
// 删除图片
const handleRemove = (file) => {
  baseForm.value.filesName = baseForm.value.filesName.filter(
    (item) => item.uid !== file.uid
  );
  baseForm.value.files = baseForm.value.files
    .split(",")
    .filter((item) => item !== file.uid)
    .join(",");
};
// 预览图片
const handlePreview = (file) => {
  imgDialog.value = true;
  dialogImageUrl.value = file.url;
};
// 下载图片
const handleDownload = (file) => {
  const url = file.url;
  window.open(url);
};
// 下载模板
const handleDownloadFile = () => {
  exportData("/daily/basJob/download/template", "专项工作下发-明细模版");
};
// 上传文件
const customFileUpload = async (file) => {
  const formData = new FormData();
  formData.append("files", file.file);
  const res = await basJobImport(formData);
  if (res.code == 200) {
    tableData.value = res.data.map((item) => {
      const newItem = { ...item };
      // 字符串转为数值类型
      Object.keys(newItem).map((v) => {
        if (keyList.includes(v)) {
          newItem[v] = Number(newItem[v]);
        }
      });
      return newItem;
    });
    const importId = res.data.map((item) => item.serviceAreaId);
    // const allId = [...importId, ...baseForm.value.serviceAreaIdList];
    const idList = [...new Set(importId)];
    baseForm.value.serviceAreaIdList = idList;
  } else if (res.code == 500) {
    ElMessage({
      message: res.message,
      type: "warning",
    });
  }
};
// 上传图片
const customUpload = (file) => {
  picList.value.push({
    path: file.file,
    id: file.file.uid,
    value: "0",
    nodeName: file.file.name,
    type: file.file.type,
  });
};
// 获取服务区
const getServiceAreaList = async () => {
  const { code, data } = await getServiceArea();
  if (code == 200) {
    serviceAreaList.value = data.records;
  }
};
// 服务区全选
const checkAll = () => {
  const companyIdList = serviceAreaList.value.map((item) => item.value);
  baseForm.value.serviceAreaIdList = companyIdList;
  getCompanyByServiceArea(companyIdList);
};
// 获取详情
const getDetail = async () => {
  const { code, data } = await getBasJobDetail({ id: props.data.entityId });
  if (code == 200) {
    baseForm.value = { ...baseForm.value, ...props.data, ...data };
    baseForm.value.filesName = data?.fileList?.map((item) => ({
      ...item,
      uid: item.entityId,
      url:
        process.env.VUE_APP_API_HOST_URL +
        process.env.VUE_APP_API_BASE_URL +
        `/pub/common/file/download?service=basJobFileServiceImpl&id=${item.entityId}`,
    }));
    // picList.value = baseForm.value.filesName
    tableData.value = data?.detailList?.map((item) => {
      const newItem = { ...item };
      // 字符串转为数值类型
      Object.keys(newItem).map((v) => {
        if (keyList.includes(v)) {
          newItem[v] = Number(newItem[v]);
        }
      });
      return newItem;
    });
  }
};
// 保存
const submit = async () => {
  const formData = new FormData();
  const params = { ...baseForm.value, detailList: tableData.value };
  // console.log(params);
  formData.append("request", JSON.stringify(params));
  //   picList.value.map((item) => {
  //     formData.append("files", item.path);
  //   });
  let await00 = picList.value.map(async (item) => {
    if (!Object.keys(item).includes("entityId")) {
      formData.append('files', item.path)
    } else {
      let blobRes = await fetch(item.url)
      let blob = await blobRes.blob()
      let type = getFileType(item.fileName || item.nodeName)
      // 这样，就从图片地址获取到图片的二进制数据，并创建对应的File对象，这些`File对象`可以上传到服务器或者存储到本地等
      let myFile = new File([blob], item.fileName || item.nodeName, { type, lastModified: Date.now() })
      formData.append('files', myFile)
    }
  })
  await Promise.all(await00)
  saveData(props.type, formData);
};
const getFileType = (val) => {
  console.log("---------------> ~ getFileType ~ val:", val)
  if (!val) return
  let word = [
    // 'doc', 'docx', 'txt', 'pdf', 'ppt', 'pptx', 'xls', 'xlsx'
    {
      type: '.docx',
      value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    {
      type: '.pdf',
      value: 'application/vnd.ms-powerpoint'
    },
    {
      type: '.xlsx',
      value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    {
      type: '.zip',
      value: 'application/zip'
    },
    {
      type: '.rar',
      value: 'application/vnd.rar'
    }
  ];
  let pic = [
    {
      type: '.jpg',
      value: 'image/jpeg'
    },
    {
      type: '.png',
      value: 'image/png'
    },
    {
      type: '.png',
      value: 'image/jpeg'
    },
  ]
  let video = [
    {
      type: '.mp4',
      value: 'video/mp4'
    },
    {
      type: '.avi',
      value: 'video/x-msvideo'
    },
    {
      type: '.mov',
      value: 'video/quicktime'
    },
    {
      type: '.wmv',
      value: 'video/x-ms-wmv'
    }
  ]
  let fileType = null
  fileType = word.filter(item => val.lastIndexOf(item.type) > -1)
  if (fileType && fileType.length > 0) return fileType[0].value || false
  fileType = pic.filter(item => val.lastIndexOf(item.type) > -1)
  if (fileType && fileType.length > 0) return fileType[0].value || false
  fileType = video.filter(item => val.lastIndexOf(item.type) > -1)
  if (fileType && fileType.length > 0) return fileType[0].value || false
  ElMessage({
    message: '不支持该文档类型',
    type: 'warning',
  });
  return false
}
// 提交数据
const saveData = async (type, formData) => {
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      confirmLoading.value = true;
      if (type == "add") {
        let res = await addBasJob(formData);
        handleMessage(res);
      }
      if (type == "edit") {
        let res = await editBasJob(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        handleMessage(res);
      }
    } else {
      return false;
    }
  });
};
// 操作完成提示
const handleMessage = (res) => {
  confirmLoading.value = false;
  if (res.code == 200) {
    ElMessage({
      message: res.data.message,
      type: "success",
    });
    emit("dialogClose");
  } else if (res.code == 500) {
    ElMessage({
      message: res.message,
      type: "warning",
    });
  } else {
    ElMessage({
      message: res.message || res.data.message,
      type: "error",
    });
  }
};
// 关闭
const close = () => {
  confirmLoading.value = false;
  emit("dialogClose");
};

onMounted(() => {
  if (props.type === "detail") {
    title.value = "详情";
    isDisabled.value = true;
    getDetail();
  } else if (props.type === "add") {
    title.value = "新增";
    isDisabled.value = false;
  } else if (props.type === "edit") {
    title.value = "编辑";
    isDisabled.value = false;
    getDetail();
  }
  getServiceAreaList();
});
</script>

<style lang="scss" scoped>
.add_edit_detail {
  .custom_dialog {
    .tag_box {
      margin-bottom: 20px;
    }

    // .item_title {
    //   font-size: 20px;
    //   margin-bottom: 10px;
    // }

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
          content: "";
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

          .upload-text {
            cursor: not-allowed;
          }
        }

        .area-box {
          display: flex;
          width: 100%;

          .area-btn {
            margin-left: 10px;
          }
        }
      }
    }

    .import-btn {
      text-align: right;
      display: flex;
      justify-content: end;
    }

    .stats-box {
      text-align: center;
      margin-top: 14px;
      margin-bottom: 10px;
      color: rgb(153, 153, 153);
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

          .el-icon:nth-child(1) {
            margin-right: 12px;
          }

          .el-icon {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
