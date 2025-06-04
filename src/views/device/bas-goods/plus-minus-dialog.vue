<!-- 设备物资管理-物资列表 入库出库弹窗 -->
<template>
  <el-dialog
    class="custom_dialog"
    v-model="dialogVisible"
    :title="title"
    width="800"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="dialogForm"
      label-width="auto"
      class="custom_form"
      :rules="rules"
      label-suffix="："
    >
      <el-row :gutter="30">
        <el-col :span="12" v-if="props.type === 'plus'">
          <el-form-item label="公司" class="form_item" prop="companyId">
            <el-select
              v-model="dialogForm.companyId"
              :multiple="props.type === 'minus'"
              filterable
              :reserve-keyword="false"
              @change="handleCompanyId"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in listOptions.companyList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="props.type === 'plus' ? 12 : 24">
          <el-form-item label="服务区" class="form_item" prop="serviceAreaId">
            <el-select
              v-model="dialogForm.serviceAreaId"
              :multiple="props.type === 'minus'"
              filterable
              :reserve-keyword="false"
              placeholder="请选择"
              clearable
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="3"
            >
              <el-option
                v-for="(item, index) in serviceAreaList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="props.type === 'plus' ? 12 : 24">
          <el-form-item label="物资类型" class="form_item" prop="type">
            <el-select
              v-model="dialogForm.type"
              :multiple="props.type === 'minus'"
              filterable
              :reserve-keyword="false"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in listOptions.typeList"
                :key="index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 出库 -->
        <template v-if="props.type === 'minus'">
          <el-col :span="24">
            <el-form-item label="物资名称" class="form_item" prop="entityId">
              <el-select
                v-model="dialogForm.entityId"
                multiple
                filterable
              :reserve-keyword="false"
                placeholder="请选择"
                clearable
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="3"
              >
                <el-option
                  v-for="(item, index) in goodsOptions"
                  :key="item.entityId"
                  :label="item.name"
                  :value="item.entityId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <template v-if="dialogForm.entityId?.length">
              <el-row :gutter="30" v-for="item in updateList">
                <el-col :span="6">
                  <el-form-item label="" class="form_item">
                    {{ item.name }}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="" class="form_item">
                    库存：{{ item.number }}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="数量" class="form_item" label-width="70">
                    <el-input-number
                      style="width: 100%"
                      v-model="item.num"
                      placeholder="请输入数量"
                      controls-position="right"
                      :min="0"
                      step-strictly
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="备注" class="form_item" label-width="70">
                    <el-input
                      v-model="item.remark"
                      placeholder="请输入备注"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-col>
        </template>
        <!-- 入库 -->
        <template v-if="props.type === 'plus'">
          <el-col :span="12">
            <el-form-item label="物资名称" class="form_item" prop="name">
              <el-input
                v-model="dialogForm.name"
                placeholder="请输入物资名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物资数量" class="form_item" prop="num">
              <el-input-number
                style="width: 100%"
                v-model="dialogForm.num"
                placeholder="请输入物资数量"
                clearable
                controls-position="right"
                :min="1"
                :step="1"
                step-strictly
                :precision="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号" class="form_item" prop="model">
              <el-input
                v-model="dialogForm.model"
                placeholder="请输入规格型号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌" class="form_item" prop="brand">
              <el-input
                v-model="dialogForm.brand"
                placeholder="请输入品牌"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" class="form_item" prop="supplier">
              <el-input
                v-model="dialogForm.supplier"
                placeholder="请输入供应商"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" class="form_item" prop="remark">
              <el-input
                v-model="dialogForm.remark"
                placeholder="请输入备注"
                clearable
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片" class="form_item" prop="files">
              <el-upload
                v-model:file-list="dialogForm.files"
                class="upload-demo"
                action="#"
                list-type="picture"
                accept=".jpeg,.png,.jpg,.bmp,.gif"
                :http-request="customUpload"
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
                      @click="handlePreview(file)"
                    />
                    <span class="cst_upload_name">{{ file.name }}</span>
                    <div class="cst_upload_icon">
                      <el-icon @click="handleRemove(file)">
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
          </el-col>
        </template>
      </el-row>
    </el-form>
    <el-dialog v-model="imgDialog">
      <img
        style="width: 100%; object-fit: cover"
        :src="dialogImageUrl"
        alt="Preview Image"
      />
    </el-dialog>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          v-if="!isDisabled"
          :disabled="isBtnDisabled"
          @click="dialogConfirm"
          >确定</el-button
        >
        <el-button type="primary" @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import {
  ref,
  reactive,
  onMounted,
  computed,
  defineProps,
  watchEffect,
} from "vue";
import {
  getBasGoodsSave,
  getBasGoodsUpdate,
  getBasGoodsList,
} from "@/api/device/basGoodsApi";
import { getServiceAreaInfo, getServiceArea } from "@/api/dictionaryApi.js"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "add",
  },
  options: {
    type: Object,
    default: () => {
      return {
        serviceAreaList: [],
        typeList: [],
      };
    },
  },
});
const formRef = ref(null); // 表单ref
const dialogVisible = computed(() => {
  return props.visible;
}); // 弹窗
const listOptions = computed(() => {
  return props.options;
});
const title = ref("新增"); // 弹窗标题
const isDisabled = ref(false); // 禁用
const imgDialog = ref(false); // 预览图片弹窗
const dialogImageUrl = ref(""); // 预览图片地址
const files = ref([]); // 附件列表
const goodsOptions = ref([]); // 物资名称下拉
const updateList = ref([]); // 出库列表
const isBtnDisabled = ref(false);
const serviceAreaList = ref([]); // 服务区列表
const needTrimList = ["name", "model", "brand", "supplier", "remark"]; // 需要校验是否是纯空格

const emit = defineEmits(["dialogClose"]);

// 弹窗表单数据
const dialogForm = reactive({});
// 弹窗表单验证规则
const rules = reactive({
  serviceAreaId: [
    { required: true, message: "请选择服务区", trigger: "change" },
  ],
  companyId: [{ required: true, message: "请选择公司", trigger: "change" }],
  type: [{ required: true, message: "请选择物资类型", trigger: "change" }],
  name: [{ required: true, message: "请输入物资名称", trigger: "blur" }],
  entityId: [{ required: true, message: "请选择物资名称", trigger: "change" }],
  num: [{ required: true, message: "请输入物资数量", trigger: "blur" }],
});

onMounted(() => {
  if (props.type == "plus") {
    title.value = "入库";
    isDisabled.value = false;
  } else if (props.type == "minus") {
    title.value = "出库";
    isDisabled.value = false;
    dialogForm.type = [];
    dialogForm.serviceAreaId = [];
    getServiceArea().then(({ code, data }) => {
      if (code == 200){
        serviceAreaList.value = data.records;
      }
    })
  }
});
watchEffect(() => {
  if (props.type === "minus") {
    if (dialogForm.serviceAreaId?.length || dialogForm.type?.length) {
      getGoodsList(dialogForm);
    } else {
      goodsOptions.value = [];
      dialogForm.entityId = [];
    }
  }
});
watchEffect(() => {
  updateList.value = goodsOptions.value
    .filter((item) => dialogForm.entityId.includes(item.entityId))
    .map((item) => ({
      number: item.number ?? item.num,
      entityId: item.entityId,
      name: item.name,
    }));
});
// 获取公司
const handleCompanyId = async (val) => {
  const { code, data } = await getServiceAreaInfo(val);
  if (code == 200) {
    serviceAreaList.value = data;
    dialogForm.serviceAreaId = null;
  }
};
// 获取物资名称下拉
const getGoodsList = (params = {}) => {
  const data = {
    size: -1,
    index: 1,
    serviceAreaId: params.serviceAreaId.length
      ? params.serviceAreaId.join(",")
      : undefined,
    type: params.type.length ? params.type.join(",") : undefined,
  };
  getBasGoodsList(data).then(({ code, data }) => {
    goodsOptions.value = data.records;
    dialogForm.entityId = [];
    // dialogForm.entityId = dialogForm.entityId.filter(
    //   (item) => data.records.findIndex((ele) => ele.entityId === item) !== -1
    // );
  });
};
// 弹窗关闭
const close = () => {
  emit("dialogClose");
};
// 弹窗确认
const dialogConfirm = async () => {
  // 去除输入框前后空格
  needTrimList.forEach((key) => {
    if (dialogForm[key]?.trim() === "") {
      dialogForm[key] = undefined;
    }
    // dialogForm[key] = dialogForm[key]?.trim();
  });
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      isBtnDisabled.value = true;
      // 入库
      if (props.type == "plus") {
        const formData = new FormData();
        formData.append("request", JSON.stringify(dialogForm));
        picList.value.map((item) => {
          formData.append("files", item.path);
        });
        let res = await getBasGoodsSave(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.code == 200) {
          isBtnDisabled.value = false;
          ElMessage({
            message: res.data.message,
            type: "success",
          });
          emit("dialogClose");
        } else if (res.code == 500) {
          isBtnDisabled.value = false;
          ElMessage({
            message: res.message,
            type: "warning",
          });
        } else {
          isBtnDisabled.value = false;
          ElMessage({
            message: res.message || res.data.message,
            type: "error",
          });
        }
      }
      // 出库
      if (props.type == "minus") {
        // 判断是否填写出库数量
        const canMinus = updateList.value.every((item) => item.num > 0);
        if (!canMinus) {
          isBtnDisabled.value = false;
          ElMessage({
            message: "请输入出库数量",
            type: "warning",
          });
          return;
        }
        // 判断出库数量是否超出库存数
        const numList = updateList.value.map((item) => item.number - item.num);
        const isPositive = numList.every((item) => item >= 0);
        if (!isPositive) {
          isBtnDisabled.value = false;
          ElMessage({
            message: "出库数量不能大于库存数",
            type: "warning",
          });
          return;
        }

        let res = await getBasGoodsUpdate(updateList.value);
        if (res.code == 200) {
          isBtnDisabled.value = false;
          ElMessage({
            message: res.data?.message ?? "出库成功",
            type: "success",
          });
          emit("dialogClose");
        } else if (res.code == 500) {
          isBtnDisabled.value = false;
          ElMessage({
            message: res?.message,
            type: "warning",
          });
        } else {
          isBtnDisabled.value = false;
          ElMessage({
            message: res?.message || res.data?.message,
            type: "error",
          });
        }
      }
    } else {
      return false;
    }
  });
};
// 预览图片
const handlePreview = (file) => {
  imgDialog.value = true;
  dialogImageUrl.value = file.url;
};
// 删除图片
const handleRemove = (file) => {
  dialogForm.files = dialogForm.files.filter((item) => item.uid !== file.uid);
  // dialogForm.files = dialogForm.files
  //   .split(",")
  //   .filter((item) => item !== file.uid)
  //   .join(",");
};
// 下载图片
const handleDownload = (file) => {
  let url = file.url;
  window.open(url);
};

const picList = ref([]); // 图片列表
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
      margin-right: 40px;
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
      content: "";
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
