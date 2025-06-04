<!-- 设备巡检详情弹窗 -->

<template>
  <el-dialog
    class="custom_dialog"
    v-model="dialogVisible"
    title="详情"
    width="800"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
  >
    <el-form
      ref="formRef"
      :model="dialogForm"
      label-width="auto"
      class="custom_form"
      label-suffix="："
    >
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="服务区" class="form_item" prop="serviceAreaId">
            <el-select
              v-model="dialogForm.serviceAreaId"
              filterable
              :reserve-keyword="false"
              placeholder="请选择"
              clearable
              disabled
            >
              <el-option
                v-for="(item, index) in listOptions.serviceAreaList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" class="form_item" prop="name">
            <el-input
              v-model="dialogForm.name"
              placeholder="请输入设备名称"
              clearable
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="巡检系统" class="form_item" prop="system">
            <el-input
              v-model="dialogForm.system"
              placeholder="请输入巡检系统"
              clearable
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="巡检周期" class="form_item" prop="period">
            <el-select
              v-model="dialogForm.period"
              filterable
              :reserve-keyword="false"
              placeholder="请选择巡检周期"
              clearable
              :disabled="true"
            >
              <el-option
                v-for="(item, index) in listOptions.periodList"
                :key="index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="巡检设备分类" class="form_item" prop="type">
            <el-input
              v-model="dialogForm.type"
              placeholder="请输入巡检设备分类"
              clearable
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备状态" class="form_item" prop="status">
            <el-select
              v-model="dialogForm.status"
              filterable
              :reserve-keyword="false"
              placeholder="请选择设备状态"
              clearable
              :disabled="true"
            >
              <el-option
                v-for="(item, index) in listOptions.statusList"
                :key="index"
                :label="item.label"
                :value="~~item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="巡检内容" class="form_item" prop="inspectItem">
            <el-input
              v-model="dialogForm.inspectItem"
              placeholder="请输入巡检内容"
              clearable
              type="textarea"
              :rows="2"
              :disabled="true"
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
              :rows="2"
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图片" class="form_item" prop="files">
            <el-image
              v-for="(item, index) in dialogForm.filesList"
              :key="index"
              :preview-src-list="dialogForm.filesList"
              :src="item"
              preview-teleported
              alt="加载失败"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted, computed, defineProps } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => {},
  },
  options: {
    type: Object,
    default: () => {
      return {
        serviceAreaList: [],
        statusList: [],
        periodList: [],
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

const emit = defineEmits(["dialogClose"]);

// 弹窗表单数据
const dialogForm = reactive({});
// 弹窗关闭
const close = () => {
  emit("dialogClose");
};

onMounted(() => {
  Object.keys(props.data).map((key) => {
    dialogForm[key] = props.data[key];
    const filesList = props.data.files?.split(",")
      .map(
        (item) =>
          process.env.VUE_APP_API_HOST_URL +
          process.env.VUE_APP_API_BASE_URL +
          `/pub/common/file/download?service=basDeviceFileServiceImpl&id=${item}`
      );
    dialogForm.filesList = filesList;
  });
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
