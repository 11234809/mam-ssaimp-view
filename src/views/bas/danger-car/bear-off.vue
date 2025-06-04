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
          <img src="@/assets/images/close.png" @click="close"/>
        </div>
      </template>
      <el-form
          ref="formRef"
          :model="dialogForm"
          label-width="auto"
          class="custom_form"
          :rules="rules"
      >
        <el-form-item label="驶入时间" class="form_item" prop="startTime">
          <el-date-picker
              style="width: 100%"
              v-model="dialogForm.startTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择驶入时间"
              :disabled="true"
          />
        </el-form-item>
        <el-form-item label="驶入图片" class="form_item" prop="startPic">
          <div>
            <div v-if="dialogForm.startPicList.length !== 0" class="pic_box">
              <el-image
                  v-for="(item, index) in dialogForm.startPicList"
                  :key="index"
                  :preview-src-list="dialogForm.startPicList"
                  :src="item"
                  style="width: 140px;height: 80px;margin-right: 6px;"
                  preview-teleported
                  alt="加载失败"
              />
            </div>
            <span v-else class="no_file">无文件</span>
          </div>
        </el-form-item>
        <el-form-item label="是否为危化品车辆" class="form_item" prop="isDangerCar">
          <el-radio-group v-model="dialogForm.isDangerCar">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="驶离时间" class="form_item" prop="endTime">
          <el-date-picker
              style="width: 100%"
              v-model="dialogForm.endTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择驶离时间"
              @change="endTimeChange"
          />
        </el-form-item>
       <el-form-item label="驶离图片" class="form_item" prop="endPic">
          <el-upload
              v-model:file-list="dialogForm.endPicfilesName"
              class="upload-demo"
              action="#"
              list-type="picture"
              accept=".jpeg,.png,.jpg,.bmp,.gif"
              :http-request="sitePicCustomUpload"
              multiple
          >
            <el-button>
              <el-icon class="el-icon--right">
                <Plus/>
              </el-icon>
              点击上传
            </el-button>
            <template #file="{ file }">
              <div class="cst_upload_box">
                <img class="cst_upload_img" :src="file.url" alt=""/>
                <span class="cst_upload_name">{{ file.name }}</span>
                <div class="cst_upload_icon" @click="sitePicHandleRemove(file)">
                  <el-icon>
                    <Close/>
                  </el-icon>
                </div>
                <div class="cst_upload_view" @click="handlePicturePreview(file)">
                  <el-icon><View /></el-icon>
                </div>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="停留时长（分钟）" class="form_item" prop="residenceMinutes">
          <el-input
              v-model="dialogForm.residenceMinutes"
              placeholder="停留时长（分钟）"
              :disabled="true"
              clearable
          />
        </el-form-item>
        <el-form-item label="车辆归属" class="form_item" prop="ownership">
          <el-select
            v-model="dialogForm.ownership"
            placeholder="请选择车辆归属"
            :disabled="isDisabled"
            clearable
          >
            <el-option
              v-for="(item, index) in ownershipList"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" class="form_item" prop="remark">
          <el-input
              v-model="dialogForm.remark"
              placeholder="备注"
              :disabled="false"
              type="textarea"
              clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogConfirm">
            保存<img src="@/assets/images/sure.png"/>
          </el-button>
          <el-button @click="close">
            关闭<img src="@/assets/images/cancel.png"/>
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
import {ElMessage} from "element-plus";
import {reactive, ref} from "vue";
import {getBasDangerCarEdit, getBasDangerCarGet, getFileInfo,} from "@/api/dangerCarApi.js";
import {getNormalOptions} from '@/api/dictionaryApi.js';
import moment from 'moment';
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
const ownershipList = ref([]); // 车牌归属列表
const formRef = ref(null);
const dialogForm = reactive({
  startTime: "", // 驶入时间
  endTime: 0, // 驶离时间
  endPic: "", // 驶离图片
  residenceMinutes: null, // 停留时长（分钟）
  startPicList: [], // 驶离图片
  isDangerCar:'0',
});
var imgDialogVisible = ref(false); // 预览图片弹窗
var dialogImageUrl = ref(''); // 预览图片地址

// 弹窗表单验证规则
const rules = reactive({
  startTime: [{required: false, message: "请输入驶入时间"}],
  isDangerCar:[{required: true,message:"请设置是否为危化品车辆"}]
});
const title = ref("");
const endPic = ref([]);
// 获取字典数据
function getDictionary() {
    // 获取车辆归属
    getNormalOptions({ queriers: [{ alias: 'ownershipDictionary', param: null }] })
        .then(({ code, data }) => {
            if (code == 200) {
                ownershipList.value = data.ownershipDictionary;
            }
        })
        .catch((err) => {
            console.log(err);
        });
}
// 数据获取
async function getDangerCar() {
  let res = await getBasDangerCarGet({id: props.id});
  if (res.code == 200) {
    Object.keys(res.data).map((key) => {
      dialogForm[key] = res.data[key];
    });
    dialogForm.endPicfilesName = [];
    if (res.data.endPic) {
      let arr = res.data.endPic.split(",");
      arr.map(async (item) => {
        await getFileInfo({id: item}).then(async (res) => {
          if (res.code == 200) {
            await dialogForm.endPicfilesName.push({
              uid: item,
              name: res.data.fileName,
              url: getImgForId(item),
            });
          } else {
            dialogForm.endPicfilesName = [];
          }
        });
      });
    }
    if (res.data?.startPic) {
      res.data.startPic?.split(",").map(async (ite) => {
        await dialogForm.startPicList.push(
            getImgForId(ite)
        );
      });
    }
    if(!res.data?.endTime){
      dialogForm.endTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      timeDiffFun();
    }
    console.log(dialogForm.startPicList, 'starPic');
    title.value = "驶离登记" + "-" + res.data.plateNumber;
  } else {
    ElMessage.error(res.message);
  }
}

getDangerCar();
getDictionary();

// 图片转换
function getImgForId(id) {
  return (
      process.env.VUE_APP_API_HOST_URL +
      process.env.VUE_APP_API_BASE_URL +
      `/pub/common/file/download?service=basDangerCarFileServiceImpl&id=${id}`
  );
}

// 现场删除图片
const sitePicHandleRemove = (file) => {
  dialogForm.endPicfilesName = dialogForm.endPicfilesName.filter(
      (item) => item.uid !== file.uid
  );
  if (sitePicList.value.length > 0) {
    sitePicList.value = sitePicList.value.filter((item) => item.uid !== file.uid);
  }
  if (dialogForm.endPic) {
    dialogForm.endPic = dialogForm.endPic
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
  formRef.value.clearValidate("endPic");
};

const endTimeChange = () => {
  const startTime = new Date(dialogForm.startTime).getTime();
  const endTime = new Date(dialogForm.endTime).getTime();
  if (endTime < startTime) {
    ElMessage.error("驶离时间不能小于驶入时间");
    dialogForm.endTime = "";
    return;
  }
  timeDiffFun()
};
// 时间差值
const timeDiffFun = () => {
  const startTime = new Date(dialogForm.startTime).getTime();
  const endTime = new Date(dialogForm.endTime).getTime();
  const timeDiff = endTime - startTime;
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  // 格式化时间差为字符串
  const formattedTimeDiff = `${hours}小时${minutes}分${seconds}秒`;
  dialogForm.residenceMinutes = formattedTimeDiff;
}
const dialogConfirm = () => {
  const formData = new FormData();
  formData.append("request", JSON.stringify(dialogForm));
  sitePicList.value.map((item) => {
    formData.append("endPic", item.path);
  });
  // dialogForm.endPic = sitePicList.value.map((item) => item.id).join(",");
  saveData(props.type, formData);
};

async function saveData(type, formData) {
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      let res = await getBasDangerCarEdit(formData, {
        headers: {"Content-Type": "multipart/form-data"},
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
          message: res.message,
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
