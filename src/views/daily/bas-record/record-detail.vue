<!-- 专项工作执行-详情 -->
<template>
  <div class="add_edit_detail">
    <el-dialog
      class="custom_dialog"
      v-model="props.visible"
      width="1000"
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
      <el-form :model="dialogForm" label-width="auto" class="custom_form">
        <el-tag class="tag_box" type="primary" size="large"> 基本信息 </el-tag>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专项工作名称" class="form_item" prop="name">
              <el-input
                v-model="dialogForm.name"
                placeholder="请输入专项工作名称"
                disabled
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专项类型" class="form_item" prop="type">
              <el-select
                v-model="dialogForm.type"
                placeholder="请选择专项类型"
                disabled
                clearable
              >
                <el-option
                  v-for="(item, index) in props.options.typeList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="要求完成时间"
              class="form_item"
              prop="requireTime"
            >
              <el-date-picker
                style="width: 100%"
                disabled
                v-model="dialogForm.requireTime"
                type="date"
                placeholder="请选择要求完成时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专项内容" class="form_item" prop="content">
              <el-input
                v-model="dialogForm.content"
                type="textarea"
                :rows="2"
                placeholder="请输入专项内容"
                clearable
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预算金额" class="form_item" prop="money">
              <el-input
                v-model="dialogForm.money"
                placeholder="请输入预算金额"
                disabled
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附件" class="form_item" prop="files">
              <el-upload
                v-model:file-list="dialogForm.filesName"
                class="upload-demo"
                action="#"
                list-type="picture"
                accept=".jpeg,.png,.jpg,.bmp,.gif"
                disabled
              >
                <el-button class="upload-text">
                  <el-icon class="el-icon--right"> <Plus /> </el-icon>点击上传
                </el-button>
                <template #file="{ file }">
                  <div class="cst_upload_box">
                    <img
                      class="cst_upload_img"
                      :src="file.url"
                      alt=""
                      @click="handlePictureCardPreview(file)"
                    />
                    <span class="cst_upload_name">{{ file.name }}</span>
                    <div class="cst_upload_icon">
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
          </el-col>
        </el-row>
      </el-form>
      <el-tag class="tag_box" type="primary" size="large"> 执行专项 </el-tag>
      <el-table table-layout="auto" :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column label="充电停车位" align="center">
          <el-table-column
            prop="chargingParkNumYear"
            label="年度目标任务"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                disabled
                :min="0"
                v-model="row.chargingParkNumYear"
              />
            </template>
          </el-table-column>
          <el-table-column prop="chargingParkNumNew" width="140" align="center">
            <template #header>
              <span style="color: red">*</span>本周新增数量
            </template>
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                :disabled="!row.isEdit"
                :min="0"
                v-model="row.chargingParkNumNew"
                @change="(val) => changeNum(val, 'chargingParkNum', row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="chargingParkNumTotal"
            label="累计建成数量"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                disabled
                :min="0"
                v-model="row.chargingParkNumTotal"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="chargingParkNumRate"
            label="完成进度(%)"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                :precision="2"
                disabled
                :min="0"
                v-model="row.chargingParkNumRate"
              />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="充电桩" align="center">
          <el-table-column
            prop="chargingPileNumYear"
            label="年度目标任务"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                disabled
                :min="0"
                v-model="row.chargingPileNumYear"
              />
            </template>
          </el-table-column>
          <el-table-column prop="chargingPileNumNew" width="140" align="center">
            <template #header>
              <span style="color: red">*</span>本周新增数量
            </template>
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                :disabled="!row.isEdit"
                :min="0"
                v-model="row.chargingPileNumNew"
                @change="(val) => changeNum(val, 'chargingPileNum')"
              />
              <!-- <el-input
                :formatter="(val) => val.replace(/[^\d.]/g, '')"
                v-if="row.isEdit"
                v-model="row.specialName"
              />
              <span v-else>{{ row.specialName }}</span> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="chargingPileNumTotal"
            label="累计建成数量"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                disabled
                :min="0"
                v-model="row.chargingPileNumTotal"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="chargingPileNumRate"
            label="完成进度(%)"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                :precision="2"
                disabled
                :min="0"
                v-model="row.chargingPileNumRate"
              />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="超充桩" align="center">
          <el-table-column
            prop="superChargingPileNumYear"
            label="年度目标任务"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                disabled
                :min="0"
                v-model="row.superChargingPileNumYear"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="superChargingPileNumNew"
            width="140"
            align="center"
          >
            <template #header>
              <span style="color: red">*</span>本周新增数量
            </template>
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                :disabled="!row.isEdit"
                :min="0"
                v-model="row.superChargingPileNumNew"
                @change="(val) => changeNum(val, 'superChargingPileNum')"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="superChargingPileNumTotal"
            label="累计建成数量"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                disabled
                :min="0"
                v-model="row.superChargingPileNumTotal"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="superChargingPileNumRate"
            label="完成进度(%)"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                :precision="2"
                disabled
                :min="0"
                v-model="row.superChargingPileNumRate"
              />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="超充枪" align="center">
          <el-table-column
            prop="superChargingGunNumYear"
            label="年度目标任务"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                disabled
                :min="0"
                v-model="row.superChargingGunNumYear"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="superChargingGunNumNew"
            width="140"
            align="center"
          >
            <template #header>
              <span style="color: red">*</span>本周新增数量
            </template>
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                :disabled="!row.isEdit"
                :min="0"
                v-model="row.superChargingGunNumNew"
                @change="(val) => changeNum(val, 'superChargingGunNum')"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="superChargingGunNumTotal"
            label="累计建成数量"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                step-strictly
                disabled
                :min="0"
                v-model="row.superChargingGunNumTotal"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="superChargingGunNumRate"
            label="完成进度(%)"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                controls-position="right"
                :precision="2"
                disabled
                :min="0"
                v-model="row.superChargingGunNumRate"
              />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="finishTime"
          label="计划完成时间"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-date-picker
              :disabled="!row.isEdit"
              v-model="row.finishTime"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="workRemark"
          label="本周工作开展情况"
          width="240"
          align="center"
        >
          <template #default="{ row }">
            <div style="width: 240px">
              <el-input :disabled="!row.isEdit" v-model="row.workRemark" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="problemRemark"
          label="遇到的困难及需要解决的问题"
          width="240"
          align="center"
        >
          <template #default="{ row }">
            <div style="width: 240px">
              <el-input :disabled="!row.isEdit" v-model="row.problemRemark" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="下一步工作及其他需报告事项"
          width="240"
          align="center"
        >
          <template #default="{ row }">
            <div style="width: 240px">
              <el-input :disabled="!row.isEdit" v-model="row.remark" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="files"
          label="现场照片，上传jpg/png文件，2张图片"
          width="320"
          align="center"
        >
          <template #default="{ row }">
            <div style="width: 320px">
              <el-upload
                :disabled="!row.isEdit"
                class="upload-demo"
                action="#"
                multiple
                list-type="picture-card"
                accept=".png,.jpg"
                :http-request="(val) => customUpload(val, row)"
                v-model:file-list="row.filesName"
                :on-preview="handlePictureCardPreview"
                :on-remove="(file) => handleRemove(file, row)"
                :on-change="(file, files) => handleChange(file, files, row)"
              >
                <el-icon class="el-icon--right"> <Plus /> </el-icon>
              </el-upload>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
          width="140"
          v-if="props.type === 'perform'"
        >
          <template #header>
            <div>
              操作
              <el-button
                type="primary"
                size="small"
                link
                icon="plus"
                v-if="type === 'perform' && isAuth('add')"
                @click="handleAdd"
              ></el-button>
            </div>
          </template>
          <template #default="{ row }">
            <div class="action_sheet" style="width: 80px">
              <el-button
                type="primary"
                size="small"
                link
                @click="handleDelete(row)"
                :disabled="!isAuth('delete')"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="dialogVisible">
        <img
          style="width: 100%; object-fit: cover"
          :src="dialogImageUrl"
          alt="Preview Image"
        />
      </el-dialog>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            :loading="confirmLoading"
            v-if="props.type === 'perform'"
            type="primary"
            @click="submit"
            >保存</el-button
          >
          <el-button type="primary" @click="close">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { ElMessage, ElMessageBox, genFileId } from "element-plus";
import {
  addBasJobRecordDetail,
  getBasJobRecordDetail,
  deleteBasJobRecordDetail,
  addFile,
} from "@/api/daily/basRecord";
import moment from "moment";
import { keyList } from "./index";
import { isAuth } from "@/utils/authorization";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "detail",
  },
  data: {
    type: Object,
    default: {},
  },
  options: {
    type: Object,
    default: () => {
      return {
        typeList: [],
      };
    },
  },
});
const emit = defineEmits(["dialogClose"]);

const title = ref("详情"); // 弹窗标题
// 弹窗表单数据
const dialogForm = reactive({});
const tableData = ref([]);
const id = ref(1);
// const picList = ref([]); // 图片列表
const dialogImageUrl = ref(""); // 预览图片地址
const dialogVisible = ref(false); // 预览图片弹窗
const confirmLoading = ref(false); // 提交按钮loading

// 获取明细
const getDetail = async () => {
  const res = await getBasJobRecordDetail({ id: props.data.entityId });
  if (res.code == 200) {
    tableData.value = res.data.details.map((item) => {
      // 类型转为数值
      const newItem = { ...item };
      Object.keys(newItem).map((v) => {
        if (keyList.includes(v)) {
          newItem[v] = Number(newItem[v]);
        }
      });
      // 拼接获取图片url
      const filesName = item.files?.split(",").map((item2) => ({
        url:
          process.env.VUE_APP_API_HOST_URL +
          process.env.VUE_APP_API_BASE_URL +
          `/pub/common/file/download?service=basSpecialProjectRecordDetailFileServiceImpl&id=${item2}`,
      }));
      return { ...newItem, filesName };
    });
  }
};
// 充电停车位求累计建成数量及完成进度
const changeNum = (val, type, row) => {
  const numNew = `${type}New`;
  const numTotal = `${type}Total`;
  const numRate = `${type}Rate`;
  const numYear = `${type}Year`;
  const numSubmit = `${type}Submit`;
  tableData.value = tableData.value.map((item) => {
    if (item.isEdit) {
      const sum = tableData.value.reduce((s, v) => s + v[numNew], 0);
      const rate = (sum / item[numYear]) * 100;
      const reg = /^[0-9]\d*$/;
      let submit = true;
      if (reg.test(item[numNew])) {
        submit = true;
      } else {
        // 避免重复提示
        if (row.id === item.id) {
          ElMessage({
            message: "请输入大于等于0的整数",
            type: "warning",
          });
        }
        submit = false;
      }
      if (sum > item[numYear]) {
        // 避免重复提示
        if (row.id === item.id) {
          ElMessage({
            message: "本周新增数量与累计建成数量不能大于年度目标任务",
            type: "warning",
          });
        }
        submit = false;
      }
      return { ...item, [numTotal]: sum, [numRate]: rate, [numSubmit]: submit };
    } else {
      return item;
    }
  });
};
// 保存
const submit = async () => {
  // console.log("submit", tableData.value, picList.value);
  // 判断是否填写数据
  const isEmpty = tableData.value.every((item) => {
    return (
      item.chargingPileNumSubmit &&
      item.superChargingPileNumSubmit &&
      item.superChargingGunNumSubmit &&
      item.chargingParkNumSubmit
    );
  });
  // console.log("isEmpty", isEmpty);
  if (!isEmpty) {
    ElMessage({
      message: "请输入正确内容",
      type: "warning",
    });
    return;
  }
  const formData = new FormData();
  const newList = tableData.value.filter((item) => item.isEdit);
  console.log(newList);
  // formData.append("request", newList);

  // 上传单行数据
//   formData.append(
//     "request",
//     JSON.stringify(tableData.value[tableData.value.length - 1])
//   );
//   const fileList = tableData.value[tableData.value.length - 1].filesList.map(
//     (item) => item.path
//   );
//   fileList.map((pic) => {
//     formData.append(`files`, pic);
//   });
  
//   const params = Object.assign({}, newList);
//   formData.append("request", JSON.stringify(newList[0]));
  // 上传单行图片
//   tableData.value[tableData.value.length - 1].filesList.map((item) => {
//     formData.append("files", item.path);
//   });
//   formData.append("files", fileList);

  // 上传多行数据及图片
//   const requestObj = Object.assign({}, newList);
  formData.append(`request`, JSON.stringify(newList));
  let filesIndexList = [];
  newList.forEach((i,idx) => {
    filesIndexList.push(i.filesList.length);
    i.filesList.forEach((item) => {
        formData.append(`files`, item.path);
    })
  });
  formData.append(`filesIndexList`, filesIndexList);

//   formData.append("files",filesListList);
//   newList.forEach((item, index) => {
//     // formData.append(`request_${index}`, JSON.stringify(item));
//     item.filesList.map((pic, picIndex) => {
//       formData.append(`files_${index}_${picIndex}`, pic.path);
//     });
//   });

  // tableData.value[0].filesList.map((item) => {
  //   formData.append("files", item.path);
  // });
  // console.log(123, formData);
  confirmLoading.value = true;
  const res = await addBasJobRecordDetail(formData);
  confirmLoading.value = false;
  // console.log("res", res);
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
// 下载图片
const handleDownload = (file) => {
  const url = file.url;
  window.open(url);
};
// 文件变化-限制文件数量上限为2
const handleChange = (file, files, row) => {
  // console.log("handleChange", file, files, row);
  if (files.length > 2) {
    files.shift();
  }
};
// 处理文件超出限制的情况
// const handleExceed = (files, uploadFiles, row) => {
//   console.log("Exceed", files, uploadFiles, row);
//   if (files.length > 1) {
//     const newFileOne = files[0];
//     const newFileTwo = files[1];
//     row.filesName = [
//       {
//         name: newFileOne.name,
//         // status: "ready", // 文件状态
//         raw: newFileOne, // 原始文件对象
//         url: URL.createObjectURL(newFileOne), // 生成预览 URL
//       },
//       {
//         name: newFileTwo.name,
//         // status: "ready", // 文件状态
//         raw: newFileTwo, // 原始文件对象
//         url: URL.createObjectURL(newFileTwo), // 生成预览 URL
//       },
//     ];
//     // row.filesList = [
//     //   {
//     //     path: newFileOne,
//     //     uid: genFileId(),
//     //     value: "0",
//     //     nodeName: newFileOne.name,
//     //     type: newFileOne.type,
//     //   },
//     //   {
//     //     path: newFileTwo,
//     //     uid: genFileId(),
//     //     value: "0",
//     //     nodeName: newFileTwo.name,
//     //     type: newFileTwo.type,
//     //   },
//     // ];
//   } else {
//     // // 移除最先上传的文件
//     // const removedFile = uploadFiles.shift();
//     // console.log("移除的文件:", removedFile);

//     // // 添加新文件，并确保设置预览信息
//     // const newFile = files[0];
//     // uploadFiles.push({
//     //   name: newFile.name,
//     //   // status: 'ready', // 文件状态
//     //   raw: newFile, // 原始文件对象
//     //   url: URL.createObjectURL(newFile), // 生成预览 URL
//     //   id: genFileId()
//     // });

//     // // 更新 fileList 预览
//     // row.filesName = uploadFiles;

//     // row.filesList.filter((item) => item.id !== removedFile.id);
//     // row.filesList = row.filesName.map((item) => ({
//     //   ...item,
//     //   path: item.raw,
//     //   value: "0",
//     //   nodeName: item.name,
//     //   type: item.raw.type,
//     // }));

//     // 移除最先上传的文件
//     row.filesName.shift();
//     // 添加新文件，并确保设置预览信息
//     const newFile = file[0];
//     row.filesName.push({
//       name: newFile.name,
//       // status: "ready", // 文件状态
//       raw: newFile, // 原始文件对象
//       url: URL.createObjectURL(newFile), // 生成预览 URL
//     });
//     // // row.filesList.shift();
//     // const newFileL = fileList[1];
//     // console.log("id", fileList);
//     // row.filesList.push({
//     //   path: newFile,
//     //   // uid: newFileL.uid,
//     //   value: "0",
//     //   nodeName: newFile.name,
//     //   type: newFile.type,
//     // });
//   }

//   // 移除最先上传的文件
//   // fileList.value.shift();
//   //     // 添加新文件，并确保设置预览信息
//   //     const newFile = file[0];
//   //     fileList.value.push({
//   //       name: newFile.name,
//   //       status: 'ready', // 文件状态
//   //       raw: newFile, // 原始文件对象
//   //       url: URL.createObjectURL(newFile), // 生成预览 URL
//   //     });
// };
// 预览图片
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};
// 操作增加数据
const handleAdd = () => {
  const oldList = tableData.value.filter((item) => item.entityId);
  if (oldList.length) {
    // 判断是否超过7天
    const lastTime = oldList[oldList.length - 1].updateTime;
    // console.log(moment(lastTime));
    const days = moment(new Date()).diff(lastTime, "days");
    // console.log(days);
    if (days >= 7) {
      handleNew();
    } else {
      ElMessage({
        message: "7天内只可填写一次",
        type: "warning",
      });
    }
  } else {
    handleNew();
  }
};
// 新增空数据
const handleNew = () => {
  tableData.value.push({
    isEdit: true,
    id: id.value,
    projectRecordId: props.data.entityId,
    chargingParkNumYear: props.data.chargingParkNum,
    chargingParkNumSubmit: false,
    // chargingParkNumNew: 0,
    chargingPileNumYear: props.data.chargingPileNum,
    chargingPileNumSubmit: false,
    // chargingPileNumNew: 0,
    superChargingPileNumYear: props.data.superChargingPileNum,
    superChargingPileNumSubmit: false,
    // superChargingPileNumNew: 0,
    superChargingGunNumYear: props.data.superChargingGunNum,
    superChargingGunNumSubmit: false,
    // superChargingGunNumNew: 0,
    filesList: [], // 给后端的文件
    filesName: [], // 双向绑定展示
  });
  id.value++;
};
// 执行删除
const handleDelete = (data) => {
  ElMessageBox.confirm("是否确认删除?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    if (data.entityId) {
      // 调接口删除
      const res = await deleteBasJobRecordDetail(data);
      if (res.code == 200) {
        ElMessage({
          message: res.data.message,
          type: res.data.status ? "success" : "error",
        });
        if (res.data.status) {
          tableData.value = tableData.value.filter(
            (item) => item.entityId !== data.entityId
          );
        }
      }
    } else {
      tableData.value = tableData.value.filter((item) => item.id !== data.id);
    }
  });
};
// 获取基本信息详情
const getBaseDetail = () => {
  Object.keys(props.data).map((key) => {
    dialogForm[key] = props.data[key];
    // dialogForm.filesName = props.data.files?.split(",").map((item) => ({
    //   uid: item,
    //   url:
    //     process.env.VUE_APP_API_HOST_URL +
    //     process.env.VUE_APP_API_BASE_URL +
    //     `/pub/common/file/download?service=basJobFileServiceImpl&id=${item}`,
    // }));
  });
};
// 上传图片
const customUpload = async (file, row) => {
  // console.log(file, "上传");
  // 限制上传文件数量上限为2
  if (row.filesList.length > 1) {
    row.filesList.shift();
    row.filesList.push({
      path: file.file,
      id: file.file.uid,
      value: "0",
      nodeName: file.file.name,
      type: file.file.type,
    });
  } else {
    row.filesList.push({
      path: file.file,
      id: file.file.uid,
      value: "0",
      nodeName: file.file.name,
      type: file.file.type,
    });
  }
  // picList.value.push({
  //   path: file.file,
  //   uid: file.file.uid,
  //   value: "0",
  //   nodeName: file.file.name,
  //   type: file.file.type,
  // });
};
// 删除图片
const handleRemove = (file, row) => {
  row.filesList = row.filesList?.filter((item) => item.uid !== file.uid);
  // console.log(row, file);
  // row.files = row.files
  //   .split(",")
  //   .filter((item) => item !== file.uid)
  //   .join(",");
};
// 关闭弹窗
const close = () => {
  emit("dialogClose");
};

onMounted(() => {
  if (props.type === "perform") {
    title.value = "编辑";
  } else if (props.type === "detail") {
    title.value = "详情";
  }
  getBaseDetail();
  getDetail();
});
</script>

<style lang="scss" scoped>
.accessory_box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.no_file {
  font-style: italic;
  color: #5d5d5d;
}
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
      ::v-deep .el-upload--picture-card {
        width: 80px;
        height: 80px;
        line-height: 80px;
      }

      ::v-deep .el-upload-list--picture-card .el-upload-list__item {
        width: 80px !important;
        height: 80px !important;
      }
      // height: 32px;
      // height: 50px;
      // width: 50px;
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
      }
    }
  }
}
</style>
