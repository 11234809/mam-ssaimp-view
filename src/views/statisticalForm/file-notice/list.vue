<!-- 文件通知传达统计表 -->

<template>
  <div class="staff-list_page" id="staff-list">
    <!-- 筛选项 -->
    <el-form
      inline
      :model="formData"
      class="custom_form"
      label-width="130px"
      label-position="right"
      label-suffix=":"
    >
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="时间（月份）" class="form_item">
            <el-date-picker
              v-model="formData.yearAndMonth"
              type="month"
              placeholder="请选择时间（月份）"
              value-format="YYYY-MM"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12"></el-col>
        <el-col :span="6">
          <el-form-item class="form_item query-form-btn">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 功能按钮组 -->
    <div class="func_btn_box">
      <el-button type="primary" @click="handleExcel">导出</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="640"
      border
      class="custom_table"
      ref="tableRef"
    >
    <el-table-column label="">
        <el-table-column label="">
            <el-table-column v-for="item in tableHeaderItem" :label="item.label" align="center">
                <template #default="{ row }">
                {{ row[item.prop] }}
                </template>
            </el-table-column>
        </el-table-column>
    </el-table-column>
      <!-- <el-table-column v-for="item in tableHeaderItem" :label="item.label" align="center">
        <template #default="{ row }">
          {{ row[item.prop] }}
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed,nextTick } from "vue";
import { ElMessage } from "element-plus";
import { queryPage } from "@/api/statisticalForm/fileNotice.js";
import { downFilePOST } from "@/api/manage";
import moment from "moment";

const tableRef = ref(null); // 列表引用
const tableData = ref([]); // 列表数据

let nowDate = moment(Date.now()).format("YYYY-MM-DD");
let formData = reactive({
  // 自定义查询条件
  yearAndMonth: moment().format("YYYY-MM"), 
});
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数
const tableHeaderItem = ref([
  {
    label: "公司",
    prop: "company",
  },
  {
    label: "服务区",
    prop: "serviceAreaName",
  },
  {
    label: "政策法规",
    prop: "law",
  },
  {
    label: "制度",
    prop: "system",
  },
  {
    label: "通知通告",
    prop: "notice",
  },
  {
    label: "公告",
    prop: "announce",
  },
  {
    label: "扣分合计",
    prop: "total",
  },
]);
const tableHeader = ref([
  {
    company: "文件下发信息",
    serviceAreaName: "文件下发信息",
    law: "政策法规：",
    system: "制度：",
    notice: "通知通告：",
    announce: "公告：",
    total: "",
  },
  {
    company: "公司",
    serviceAreaName: "服务区",
    law: "查询数量",
    system: "",
    notice: "",
    announce: "",
    total: "",
  },
  {
    company: "",
    serviceAreaName: "",
    law: "政策法规",
    system: "制度",
    notice: "通知通告",
    announce: "公告",
    total: "扣分合计",
  },
]);
const tableDataList = computed(() => {
  return tableHeader.value.concat(tableData.value);
});
// 行样式
const tableRowClassName = ({ row, rowIndex }) => {
  if (rowIndex < 3) {
    return "table_header_row";
  }
};

// 列表合并
function arraySpanMethod({ row, column, rowIndex, columnIndex }) {
  if (rowIndex === 0 && columnIndex === 0) {
    return [1, 2];
  } else if (rowIndex === 0 && columnIndex === 1) {
    return [0, 0];
  }

  if (rowIndex === 1) {
    if ([0, 1].includes(columnIndex)) {
      return [2, 1];
    } else if (columnIndex === 2) {
      return [1, 5];
    } else {
      return [0, 0];
    }
  }

  if (rowIndex === 2) {
    if ([0, 1].includes(columnIndex)) {
      return [0, 0];
    } else {
      return [1, 1];
    }
  }
  return [1, 1]; // 其他列不合并
}
// 列表导出
function handleExcel() {
  let fileName = "文件通知传达统计表"+nowDate;
  downFilePOST('/statisticalForm/fileNotice/exportDate', formData).then((data) => {
    if (!data) {
      ElMessage.warning("文件下载失败");
      return;
    }
    let excelData = data.data;
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      window.navigator.msSaveBlob(
        new Blob([excelData], { type: "application/vnd.ms-excel" }),
        fileName + ".xls"
      );
    } else {
      let url = window.URL.createObjectURL(
        new Blob([excelData], { type: "application/vnd.ms-excel" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // 下载完成移除元素
      window.URL.revokeObjectURL(url); // 释放掉blob对象
    }
  });
}

async function getData() {
  // 查询
  queryPage({
    ...formData,
  }).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data.datas.detailVOS;
      tableHeader.value[0].law = "政策法规："+res.data.datas.totalLaw+"份";
      tableHeader.value[0].system = "制度："+res.data.datas.totalSystem+"份";
      tableHeader.value[0].notice = "通知通告："+res.data.datas.totalNotice+"份";
      tableHeader.value[0].announce = "公告："+res.data.datas.totalAnnounce+"份";
      total.value = res.data.total;
      setHeaderText(res.data.datas);
    } else {
      ElMessage.error(res.message);
    }
  });
}

// 重置查询
function onReset() {
  // 重置表单参数赋值
  Object.keys(formData).forEach((key) => {
    formData[key] = null;
  });
  page.value = 1; // 重置页码
  pageSize.value = 10; // 重置每页条数
  getData(); // 重新查询
}

onMounted(() => {
    getData();
    setHeaderTabel();
});
const setHeaderText = (data)=>{
    const rows = document.getElementsByClassName("el-table__header")[0].rows;
    rows[0].cells[1].innerText = "政策法规:"+data.totalLaw+"份";
    rows[0].cells[2].innerText = "制度:"+data.totalSystem+"份";
    rows[0].cells[3].innerText = "通知通告:"+data.totalNotice+"份";
    rows[0].cells[4].innerText = "公告:"+data.totalAnnounce+"份";
}
const setHeaderTabel = () => {
    setTimeout(() => {
        const rows = document.getElementsByClassName("el-table__header")[0].rows;
        const cell1 = rows[0].cells[0];
        cell1.colSpan = 1
        cell1.style.textAlign = 'center'
        for(let i = 0; i < 5; i++){
            rows[0].appendChild(cell1.cloneNode(true));
        }
        cell1.colSpan = 2;
        cell1.innerText = "文件下发信息";
        rows[0].cells[1].innerText = "政策法规:0份";
        rows[0].cells[2].innerText = "制度:0份";
        rows[0].cells[3].innerText = "通知通告:0份";
        rows[0].cells[4].innerText = "公告:0份";
        rows[0].cells[5].innerText = "";

        let cell2 = rows[1].cells[0];
        cell2.style.textAlign = 'center'
        rows[1].appendChild(cell2.cloneNode(true));
        rows[1].appendChild(cell2.cloneNode(true));

        cell2.colSpan = 1;
        cell2.rowSpan = 2;
        cell2.innerText = "公司";
        rows[1].cells[1].rowSpan = 2;
        rows[1].cells[1].colSpan = 1;
        rows[1].cells[1].colSpan = 1;
        rows[1].cells[1].innerText = "服务区";

        rows[1].cells[2].rowSpan = 2;
        rows[1].cells[2].rowSpan = 1;
        rows[1].cells[2].innerText = "查阅数量";

        rows[2].removeChild(rows[2].cells[0])
        rows[2].removeChild(rows[2].cells[0])
    },500)
}
</script>

<style lang="less" scoped>
.el-table {
  /deep/ .table_header_row {
    color: #000;
    background-color: #eaeef8;
    font-weight: bold;
    position: sticky
  }
}

#staff-list .el-button--danger.is-plain:hover {
  color: #fff !important;
}

.staff-list_page {
  .custom_form {
    margin-bottom: 20px;

    :deep(.form_item) {
      width: 100%;

      .el-cascader {
        width: 100%;
      }

      .separator {
        margin: 0 10px;
      }
    }
  }

  .func_btn_box {
    margin-bottom: 10px;
  }

  :deep(.custom_table) {
    margin-bottom: 20px;

    .pic_box {
      display: flex;

      .el-image {
        width: 50px;
        height: 50px;
        object-fit: cover;

        &:not(:last-child) {
          margin-right: 10px;
        }
      }
    }

    .no_file {
      font-style: italic;
      color: #5d5d5d;
    }

    .action_sheet {
      display: flex;
      align-items: center;
      justify-content: center;

      .el-dropdown {
        margin-left: 12px;
      }
    }
  }

  .pagination_box {
    float: right;
  }
}
</style>
