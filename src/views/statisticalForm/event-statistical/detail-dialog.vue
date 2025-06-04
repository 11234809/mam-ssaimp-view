<!-- 设备巡检详情弹窗 -->

<template>
  <el-dialog
    class="custom_dialog"
    v-model="dialogVisible"
    title="详情"
    width="1600"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
  >
    <!-- 功能按钮组 -->
    <div class="func_btn_box">
      <el-button type="primary" @click="handleExcel">导出</el-button>
    </div>
    <el-table
      class="custom_table"
      ref="tableRef"
      table-layout="auto"
      :data="tableData"
      height="600"
      style="width: 100%"
    >
    <el-table-column label="序号" width="60" type="index" align="center"></el-table-column>
      <el-table-column
        v-for="item in detailTableColumn"
        :key="item.prop"
        :type="item.type"
        :label="item.label"
        :width="item.width"
        align="center"
      >
        <template v-if="item.slotType === 'img'" #default="{ row }">
            <div v-if="row[item.prop]" class="pic_box">
            <el-image
              v-for="(item, index) in row[item.prop]"
              :key="index"
              :previewSrcList="[item]"
              :src="item"
              preview-teleported
              alt="加载失败"
            />
          </div>
          <span v-else class="no_file">无文件</span>
        </template>
        <template #default="{ row }" v-else>
          {{ row[item.prop] || '-' }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
      <el-pagination
        :current-page="parmas.index"
        :hide-on-single-page="false"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <template #footer>
      <div class="dialog-footer" style="height: 20px;">
        <!-- <el-button type="primary" @click="close">关闭</el-button> -->
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed, defineProps } from "vue";
import { detailTableColumn } from "./index";
import { queryEventDaily } from "../../../api/statisticalForm/event";
import { ElMessage } from "element-plus";
import { downFilePOST } from "@/api/manage";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => {},
  },
});
const tableRef = ref(null); // 表格ref
const tableData = ref([{}]);
const total = ref(0); // 总条数
let parmas = ref({
  index:1,
  size:10,
})

const dialogVisible = computed(() => {
  return props.visible;
}); // 弹窗

const emit = defineEmits(["dialogClose"]);

// 获取表格数据
const getData = () => {
  queryEventDaily(parmas.value).then(res=>{
    tableData.value = res.data.records.map(el=>{
      const files = el.files?.split(",").map(
        (item) =>process.env.VUE_APP_API_HOST_URL + process.env.VUE_APP_API_BASE_URL + `/pub/common/file/download?service=basEventReportFileServiceImpl&id=${item}`
      );
      const handleFiles = el.handleFiles?.split(",").map(
        (item) =>process.env.VUE_APP_API_HOST_URL + process.env.VUE_APP_API_BASE_URL + `/pub/common/file/download?service=basEventReportFileServiceImpl&id=${item}`
      );
      return {
        ...el,
        guanzhiTime:el.isControl == 0 ? "-":`${el.startTime|| ''}~${el.endTime || ''}`,
        statusText: el.status === 2 ? '已处理' : '未处理',
        epidemicNum: el.epidemicNum || '0',
        files,
        handleFiles,
      }
    })
    total.value = res.data.total;
  })
};

// 分页
const handleCurrentChange = (val) => {
  parmas.value.index = val;
  getData();
};
// 弹窗关闭
const close = () => {
  emit("dialogClose");
};

const handleExcel = () => {
  downFilePOST('/api/statisticalForm/eventStatistical/eventDailyExport',parmas.value).then(data=>{
    if (!data) {
      ElMessage.warning("文件下载失败");
      return;
    }
    let excelData = data.data;
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      window.navigator.msSaveBlob(
        new Blob([excelData], { type: "application/vnd.ms-excel" }),
        '事件详情' + ".xls"
      );
    } else {
      let url = window.URL.createObjectURL(
        new Blob([excelData], { type: "application/vnd.ms-excel" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", '事件详情' + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // 下载完成移除元素
      window.URL.revokeObjectURL(url); // 释放掉blob对象
    }
  })
}
onMounted(() => {
  parmas.value = {...parmas.value,...props.data}
  getData()
});
</script>

<style lang="less" scoped>
.func_btn_box {
  margin-bottom: 10px;
}
.pagination_box {
    float: right;
  }
// .upload-demo {
//   width: 100%;

//   .cst_upload_box {
//     position: relative;
//     display: flex;
//     align-items: center;
//     width: 100%;
//     height: 80px;

//     .cst_upload_img {
//       width: 140px;
//       height: 100%;
//       object-fit: fill;
//     }

//     .cst_upload_name {
//       margin-left: 20px;
//     }

//     .cst_upload_icon {
//       position: absolute;
//       top: 0;
//       right: 0;

//       .el-icon:nth-child(1) {
//         margin-right: 12px;
//       }

//       .el-icon {
//         cursor: pointer;
//       }
//     }
//   }
// }

// .add-edit-header {
//   color: --whiteBtnTextColor;
//   display: flex;
//   justify-content: space-between;
//   padding: 10px 18px;

//   h4 {
//     position: relative;
//     display: flex;
//     font-weight: bold;
//     font-size: 18px;

//     &::before {
//       content: "";
//       width: 5px;
//       height: 16px;
//       background-color: #114484;
//       position: absolute;
//       left: -10px;
//       top: 4px;
//     }
//   }
// }
</style>
