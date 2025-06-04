<template>
  <div class="add_edit_detail">
    <el-dialog
      class="custom_dialog"
      v-model="props.visible"
      width="790"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
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
        <el-form-item label="劝离原因" class="form_item" prop="adviseLeave">
          <el-input
            v-model="dialogForm.adviseLeave"
            type="textarea"
            :rows="2"
            placeholder="请输入劝离原因"
            clearable
          />
        </el-form-item>
        <el-form-item label="现场图片" class="form_item" prop="sitePic">
          <el-upload
            v-model:file-list="dialogForm.sitePicNames"
            class="upload-demo"
            action="#"
            list-type="picture"
            accept=".jpeg,.png,.jpg,.bmp,.gif"
            :http-request="sitePicCustomUpload"
          >
            <el-button>
              <el-icon class="el-icon--right"> <Plus /> </el-icon>点击上传
            </el-button>
            <template #file="{ file }">
              <div class="cst_upload_box">
                <img class="cst_upload_img" :src="file.url" alt="" />
                <span class="cst_upload_name">{{ file.name }}</span>
                <div class="cst_upload_icon" @click="sitePicHandleRemove(file)">
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
        <el-form-item label="是否通知第三方" class="form_item" prop="isNotifiThree">
          <el-radio-group v-model="dialogForm.isNotifiThree">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dialogForm.isNotifiThree == 1"
          label="第三方单位"
          class="form_item"
          prop="threeCompany"
          :rules="[
            { required: dialogForm.isNotifiThree == 1, message: '请选择第三方单位!' },
          ]"
        >
          <el-select v-model="dialogForm.threeCompany" placeholder="请选择第三方单位">
            <el-option
              v-for="item in options"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="dialogForm.isNotifiThree == 1"
          label="通知第三方单位凭证"
          class="form_item"
          prop="notifiThreeFile"
          :rules="[
            {
              required: dialogForm.isNotifiThree == 1,
              message: '请上传通知第三方单位凭证!',
            },
          ]"
        >
          <el-upload
            v-model:file-list="dialogForm.notifiThreeNames"
            class="upload-demo"
            action="#"
            list-type="picture"
            accept=".jpeg,.png,.jpg,.bmp,.gif"
            :http-request="customUpload"
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
        <el-form-item label="是否驶离" class="form_item" prop="isLeave">
          <el-radio-group v-model="dialogForm.isLeave">
            <el-radio label="1">是</el-radio>
            <el-radio label="-">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogConfirm">
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
import { ElMessage } from "element-plus";
import { ref, reactive, nextTick, onMounted, computed, watch } from "vue";
import cityArea from "./cityArea.js";
import { queryNormalOptions } from "@/api/dictionaryApi.js";
import {
  getBasDangerCarEdit,
  getBasDangerCarGet,
  getFileInfo,
} from "@/api/dangerCarApi.js";

const emit = defineEmits(["dialogClose"]);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "add",
  },
  id: {
    type: String,
    default: "",
  },
});
const formRef = ref(null);
const dialogForm = reactive({
  adviseLeave: null, // 劝离原因
  isNotifiThree: null, // 是否通知第三方
  isLeave: null, // 是否驶离
  notifiThreeFile: "", // 通知第三方单位凭证
  sitePic: "", // 现场图片
});
var imgDialogVisible = ref(false); // 预览图片弹窗
var dialogImageUrl = ref(''); // 预览图片地址

// 弹窗表单验证规则
const rules = reactive({
  adviseLeave: [{ required: true, message: "请输入劝离原因!", trigger: "change" }],
  sitePic: [{ required: true, message: "请上传现场图片!", trigger: "blur" }],
  // threeCompany: [{ required: true, message: '请选择第三方单位!' }],
  // notifiThreeFile: [{ required: true, message: '请上传通知第三方单位凭证!' }],
  isLeave: [{ required: true, message: "请选择是否驶离!", trigger: "change" }],
});
const title = ref("");
const options = ref([]);
const sitePic = ref([]); // 现场图片
const notifiThreeFile = ref([]); // 通知第三方单位凭证
function getDictItem() {
  queryNormalOptions({
    queriers: [{ alias: "threeCompanyDictionary", param: null }],
  }).then((res) => {
    options.value = res.data.threeCompanyDictionary;
  });
}
getDictItem();
// 数据获取
function getDangerCar() {
  getBasDangerCarGet({ id: props.id })
    .then((res) => {
      if (res.code == 200) {
        Object.keys(res.data).map((key) => {
          dialogForm[key] = res.data[key];
        });
        if (res.data.sitePic) {
          dialogForm.sitePicNames = [];
          if (res.data.sitePic) {
            let arr = res.data.sitePic.split(",");
            arr.map(async (item) => {
              await getFileInfo({ id: item }).then(async (res) => {
                if (res.code == 200) {
                  await dialogForm.sitePicNames.push({
                    uid: item,
                    name: res.data.fileName,
                    url: getImgForId(item),
                  });
                } else {
                  dialogForm.sitePicNames = [];
                }
              });
            });
          }
        }
        if (res.data.notifiThreeFile) {
          dialogForm.notifiThreeNames = [];
          if (res.data.notifiThreeFile) {
            let arr = res.data.notifiThreeFile.split(",");
            arr.map(async (item) => {
              await getFileInfo({ id: item }).then(async (res) => {
                if (res.code == 200) {
                  await dialogForm.notifiThreeNames.push({
                    uid: item,
                    name: res.data.fileName,
                    url: getImgForId(item),
                  });
                } else {
                  dialogForm.notifiThreeNames = [];
                }
              });
            });
          }
        }
        title.value = "劝离登记" + "-" + res.data.plateNumber;
      } else {
        ElMessage.error(res.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
getDangerCar();

// 图片转换
function getImgForId(id) {
  return (
    process.env.VUE_APP_API_HOST_URL +
    process.env.VUE_APP_API_BASE_URL +
    `/pub/common/file/download?service=basDangerCarFileServiceImpl&id=${id}`
  );
}

// 第三方删除图片
const handleRemove = (file) => {
  dialogForm.notifiThreeNames = dialogForm.notifiThreeNames.filter(
    (item) => item.uid !== file.uid
  );
  if (picList.value.length > 0) {
    picList.value = picList.value.filter((item) => item.uid !== file.uid);
  }
  if (dialogForm.notifiThreeFile) {
    dialogForm.notifiThreeFile = dialogForm.notifiThreeFile
      .split(",")
      .filter((item) => item !== file.uid)
      .join(",");
  }
};
const picList = ref([]); // 图片列表
// 第三方上传图片
const customUpload = (file) => {
  picList.value.push({
    path: file.file,
    uid: file.file.uid,
    value: "0",
    nodeName: file.file.name,
    type: file.file.type,
  });
  formRef.value.clearValidate("notifiThreeFile");
};

// 现场删除图片
const sitePicHandleRemove = (file) => {
  dialogForm.sitePicNames = dialogForm.sitePicNames.filter(
    (item) => item.uid !== file.uid
  );
  if (sitePicList.value.length > 0) {
    sitePicList.value = sitePicList.value.filter((item) => item.uid !== file.uid);
  }
  if (dialogForm.sitePic) {
    dialogForm.sitePic = dialogForm.sitePic
      .split(",")
      .filter((item) => item !== file.uid)
      .join(",");
  }
};
const sitePicList = ref([]); // 图片列表
// 现场上传图片
const sitePicCustomUpload = (file) => {
  sitePicList.value.push({
    path: file.file,
    uid: file.file.uid,
    value: "0",
    nodeName: file.file.name,
    type: file.file.type,
  });
  formRef.value.clearValidate("sitePic");
};
// 提交
const dialogConfirm = () => {
  if (dialogForm.isLeave == 1) {
    let time = new Date();
    let Y = time.getFullYear();
    let M = (time.getMonth() + 1).toString().padStart(2, "0");
    let D = time.getDate().toString().padStart(2, "0");
    let h = time.getHours().toString().padStart(2, "0");
    let m = time.getMinutes().toString().padStart(2, "0");
    let s = time.getSeconds().toString().padStart(2, "0");
    let formattedTime = `${Y}-${M}-${D} ${h}:${m}:${s}`;
    dialogForm.endTime = formattedTime;
    let diffTime =
      new Date(dialogForm.endTime).getTime() - new Date(dialogForm.startTime).getTime();
    if (diffTime < 0) {
      ElMessage({
        message: "驶离时间不能小于驶入时间",
        type: "error",
      });
    } else {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      dialogForm.residenceMinutes = `${hours}小时${minutes}分${seconds}秒`;
    }
  }
  const formData = new FormData();
  // 如果是否通知第三方为否，清空第三方单位和通知第三方单位凭证的值
  if (dialogForm.isNotifiThree == 0) {
    dialogForm.threeCompany = "";
    dialogForm.notifiThreeFile = "";
    notifiThreeFile.value = [];
    formRef.value.clearValidate("notifiThreeFile");
  }
  formData.append("request", JSON.stringify(dialogForm));
  sitePicList.value.map((item) => {
    formData.append("sitePic", item.path);
  });
  if (dialogForm.isNotifiThree == 1) {
    picList.value.map((item) => {
      formData.append("notifiThreeFile", item.path);
    });
  }
  saveData(props.type, formData);
};
async function saveData(type, formData) {
  await formRef.value.validate(async (valid, fields) => {
    // 判断第现场图片是否有历史数据
    if (!dialogForm.sitePic) {
      // 没有历史数据则判断是否上传了图片，并清除验证
      if (sitePicList.value.length > 0) {
        valid = true;
        formRef.value.clearValidate("sitePic");
      } else {
        valid = false;
      }
    }
    if (dialogForm.isNotifiThree == 1) {
      // 判断第三方图片是否有历史数据
      if (!dialogForm.notifiThreeFile) {
        // 没有历史数据则判断是否上传了图片，并清除验证
        if (picList.value.length > 0) {
          valid = true;
          formRef.value.clearValidate("notifiThreeFile");
        } else {
          valid = false;
        }
      }
    }
    if (valid) {
      let res = await getBasDangerCarEdit(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.code == 200) {
        ElMessage({
          message: res.data.message,
          type: "success",
        });
        emit("dialogClose");
      }
      if (res.code == 500) {
        ElMessage({
          message: res.data.message,
          type: "error",
        });
      }
    }
  });
}
const close = () => {
  emit("dialogClose");
};
// 查看图片
function handlePicturePreview (file) {
    dialogImageUrl.value = file.url;
    imgDialogVisible.value = true;
}
</script>

<style lang="less" scoped>
.add_edit_detail {
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
  .custom_dialog {
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
