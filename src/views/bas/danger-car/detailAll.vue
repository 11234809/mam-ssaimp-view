<!-- @format -->

<template>
  <div class="add_edit_detail">
    <el-drawer
      class="custom_dialog"
      v-model="props.visible"
      width="800"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :show-close="false"
    >
      <template #header>
        <div class="add-edit-header">
          <h4>{{ title }}</h4>
          <img src="@/assets/images/close.png" @click="close" />
        </div>
      </template>
      <el-tag class="tag_box" type="primary" size="large">
        停留信息-{{ dialogForm.plateNumber }}
      </el-tag>
      <el-form :model="dialogForm" label-width="auto" class="custom_form">
        <el-form-item label="服务区" class="form_item" prop="serviceAreaId">
          <el-select
            v-model="dialogForm.serviceAreaId"
            placeholder="请选择服务区名称"
            :disabled="true"
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
            :disabled="true"
            clearable
          />
        </el-form-item>
        <el-form-item label="车牌颜色" class="form_item" prop="plateType">
          <el-select
            v-model="dialogForm.plateType"
            placeholder="请选择车牌颜色"
            :disabled="true"
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
            :disabled="true"
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
            v-model="dialogForm.startRoute"
            :options="provinceList"
            :disabled="true"
            placeholder="请选择行驶路线（起点）"
          />
        </el-form-item>
        <el-form-item label="行驶路线（终点）" class="form_item" prop="endRoute">
          <el-cascader
            style="width: 100%"
            v-model="dialogForm.endRoute"
            :options="provinceList"
            :disabled="true"
            placeholder="请选择行驶路线（终点）"
          />
        </el-form-item>
        <el-form-item label="驾驶员" class="form_item" prop="driver">
          <el-input
            v-model="dialogForm.driver"
            placeholder="请输入驾驶员"
            :disabled="true"
            clearable
          />
        </el-form-item>
        <el-form-item label="联系电话" class="form_item" prop="tel">
          <el-input
            v-model="dialogForm.tel"
            placeholder="请输入联系电话"
            :disabled="true"
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
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="驶入图片" class="form_item">
          <el-upload
            v-model:file-list="dialogForm.startPicNames"
            :disabled="true"
            class="upload-demo"
            action="#"
            list-type="picture"
            accept=".jpeg,.png,.jpg,.bmp,.gif"
          >
            <el-button class="upload-text">
              <el-icon class="el-icon--right"> <Plus /> </el-icon>点击上传
            </el-button>
            <template #file="{ file }">
              <div class="cst_upload_box">
                <img class="cst_upload_img" :src="file.url" alt="" />
                <span class="cst_upload_name">{{ file.name }}</span>
                <div class="cst_upload_icon"></div>
                <div class="cst_upload_view" @click="handlePicturePreview(file)">
                  <el-icon><View /></el-icon>
                </div>
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-tag class="tag_box" type="primary" size="large"
        >驶离登记-{{ dialogForm.plateNumber }}</el-tag
      >
      <el-form :model="dialogForm" label-width="auto" class="custom_form">
        <!-- <el-form-item label="驶入时间" class="form_item" prop="startTime">
                    <el-date-picker style="width: 100%;" v-model="dialogForm.startTime" type="date"
                        value-format="YYYY-MM-DD" placeholder="请选择驶入时间" :disabled="true" />
                </el-form-item> -->
        <el-form-item label="驶离时间" class="form_item" prop="endTime">
          <el-date-picker
            style="width: 100%"
            v-model="dialogForm.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择驶离时间"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="驶离图片" class="form_item" prop="endPic">
          <el-upload
            v-model:file-list="dialogForm.endPicNames"
            class="upload-demo"
            action="#"
            list-type="picture"
            accept=".jpeg,.png,.jpg,.bmp,.gif"
            :disabled="true"
          >
            <el-button class="upload-text">
              <el-icon class="el-icon--right"> <Plus /> </el-icon>点击上传
            </el-button>
            <template #file="{ file }">
              <div class="cst_upload_box">
                <img class="cst_upload_img" :src="file.url" alt="" />
                <span class="cst_upload_name">{{ file.name }}</span>
                <div class="cst_upload_icon"></div>
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
            placeholder="请输入停留时长（分钟）"
            :disabled="true"
            clearable
          />
        </el-form-item>
        <el-form-item label="车辆归属" class="form_item" prop="ownership">
          <el-select
            v-model="dialogForm.ownership"
            placeholder="请选择车辆归属"
            :disabled="true"
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
        <el-form-item label="是否为危化品车辆" class="form_item" prop="isDangerCar">
          <el-radio-group v-model="dialogForm.isDangerCar" :disabled="true">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" class="form_item" prop="remark">
          <el-input
              v-model="dialogForm.remark"
              placeholder="备注"
              :disabled="true"
              type="textarea"
              clearable
          />
        </el-form-item>
      </el-form>
      <el-tag class="tag_box" type="primary" size="large"
        >劝离登记-{{ dialogForm.plateNumber }}</el-tag
      >
      <el-form :model="dialogForm" label-width="auto" class="custom_form">
        <el-form-item label="劝离原因" class="form_item" prop="adviseLeave">
          <el-input
            v-model="dialogForm.adviseLeave"
            type="textarea"
            :rows="2"
            placeholder="请输入劝离原因"
            clearable
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="现场图片" class="form_item" prop="sitePic">
          <el-upload
            v-model:file-list="dialogForm.sitePicNames"
            class="upload-demo"
            action="#"
            list-type="picture"
            accept=".jpeg,.png,.jpg,.bmp,.gif"
            :disabled="true"
          >
            <el-button class="upload-text">
              <el-icon class="el-icon--right"> <Plus /> </el-icon>点击上传
            </el-button>
            <template #file="{ file }">
              <div class="cst_upload_box">
                <img class="cst_upload_img" :src="file.url" alt="" />
                <span class="cst_upload_name">{{ file.name }}</span>
                <div class="cst_upload_icon"></div>
                <div class="cst_upload_view" @click="handlePicturePreview(file)">
                  <el-icon><View /></el-icon>
                </div>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否通知第三方" class="form_item" prop="isNotifiThree">
          <el-radio-group v-model="dialogForm.isNotifiThree" :disabled="true">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dialogForm.isNotifiThree == 1"
          label="第三方单位"
          class="form_item"
          prop="threeCompany"
        >
          <el-select
            v-model="dialogForm.threeCompany"
            placeholder="请选择第三方单位"
            :disabled="true"
          >
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
        >
          <el-upload
            v-model:file-list="dialogForm.notifiThreeFileNames"
            class="upload-demo"
            action="#"
            list-type="picture"
            accept=".jpeg,.png,.jpg,.bmp,.gif"
            :disabled="true"
          >
            <el-button class="upload-text">
              <el-icon class="el-icon--right"> <Plus /> </el-icon>点击上传
            </el-button>
            <template #file="{ file }">
              <div class="cst_upload_box">
                <img class="cst_upload_img" :src="file.url" alt="" />
                <span class="cst_upload_name">{{ file.name }}</span>
                <div class="cst_upload_icon"></div>
                <div class="cst_upload_view" @click="handlePicturePreview(file)">
                  <el-icon><View /></el-icon>
                </div>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否驶离" class="form_item" prop="isLeave">
          <el-radio-group v-model="dialogForm.isLeave" :disabled="true">
            <el-radio label="1">是</el-radio>
            <el-radio label="-">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="close">关闭</el-button>
        </div>
      </template>
    </el-drawer>
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
  queryNormalOptions,
} from '@/api/dictionaryApi.js';
import { getFileInfo, getBasDangerCarGet } from '@/api/dangerCarApi.js';

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
const title = ref('详情'); // 弹窗标题
// 弹窗表单数据
const dialogForm = reactive({});
const startRoute = ref([]); // 行驶路线（起点）
const endRoute = ref([]); // 行驶路线（终点）
const files = ref([]); // 附件列表
const platecolorcodeList = ref([]); // 车牌颜色列表
const ownershipList = ref([]); // 车牌归属列表
const dangerItemOptions = ref([]); // 危化品名称列表
const serviceAreaList = ref([]); // 服务区列表
const provinceList = ref([]); // 省市区列表
var imgDialogVisible = ref(false); // 预览图片弹窗
var dialogImageUrl = ref(''); // 预览图片地址
onMounted(() => {
  getDangerCar(props.id);
});
// 获取详情
async function getDangerCar(id) {
  let res = await getBasDangerCarGet({ id });
  if (res.code == 200) {
    Object.keys(res.data).map((key) => {
      dialogForm[key] = res.data[key];
      if (key == 'startPic') {
        dialogForm.startPicNames = [];
        dialogForm[key]
          ? dialogForm[key].split(',').map(async (item) => {
              await getFileInfo({ id: item }).then((res) => {
                if (res.code == 200) {
                  dialogForm.startPicNames.push({
                    uid: item,
                    name: res.data.fileName,
                    url: getImgForId(item),
                  });
                }
              });
            })
          : [];
      }
      if (key == 'endPic') {
        dialogForm.endPicNames = [];
        dialogForm[key]
          ? dialogForm[key].split(',').map(async (item) => {
              await getFileInfo({ id: item }).then((res) => {
                if (res.code == 200) {
                  dialogForm.endPicNames.push({
                    uid: item,
                    name: res.data.fileName,
                    url: getImgForId(item),
                  });
                }
              });
            })
          : [];
      }

      if (key == 'startRoute') {
        dialogForm[key] = dialogForm[key] ? dialogForm[key].split('-') : dialogForm[key];
      }
      if (key == 'endRoute') {
        dialogForm[key] = dialogForm[key] ? dialogForm[key].split('-') : dialogForm[key];
      }
      if (key == 'sitePic') {
        dialogForm.sitePicNames = [];
        dialogForm[key]
          ? dialogForm[key].split(',').map(async (item) => {
              await getFileInfo({ id: item }).then((res) => {
                if (res.code == 200) {
                  dialogForm.sitePicNames.push({
                    uid: item,
                    name: res.data.fileName,
                    url: getImgForId(item),
                  });
                }
              });
            })
          : [];
      }
      if (key == 'notifiThreeFile') {
        dialogForm.notifiThreeFileNames = [];
        dialogForm[key]
          ? dialogForm[key].split(',').map(async (item) => {
              await getFileInfo({ id: item }).then((res) => {
                if (res.code == 200) {
                  dialogForm.notifiThreeFileNames.push({
                    uid: item,
                    name: res.data.fileName,
                    url: getImgForId(item),
                  });
                }
              });
            })
          : [];
      }
    });
    console.log("dialogForm", dialogForm);
  }
}
const options = ref([]); // 第三方单位列表
function getDictItem() {}
getDictItem();
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
  queryNormalOptions({
    queriers: [{ alias: 'threeCompanyDictionary', param: null }],
  }).then((res) => {
    options.value = res.data.threeCompanyDictionary;
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

const close = () => {
  console.log('close');

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
    .tag_box {
      margin-bottom: 20px;
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
