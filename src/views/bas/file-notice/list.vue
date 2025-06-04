<!-- 文件通知传达统计表 -->

<template>
  <div class="staff-list_page" id="staff-list">
    <!-- 筛选项 -->
    <el-form
      inline
      :model="staffFormData"
      class="custom_form"
      label-width="130px"
      label-position="right"
      label-suffix=":"
    >
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="时间（月份）" class="form_item">
            <el-date-picker
              v-model="staffFormData.serviceAreaId"
              type="month"
              placeholder="请选择时间（月份）"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item class="form_item btn">
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
      :span-method="arraySpanMethod"
      :data="tableData"
      style="width: 100%"
      :show-header="false"
    >
      <!-- <el-table-column
        v-for="item in tableHeader"
        :label="item.label"
        :key="item.prop"
      >
        <el-table-column
          align="center"
          :label="tableHeader[0][key]"
          min-width="100"
          :prop="key"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[key] || "--" }}</span>
          </template>
        </el-table-column>
      </el-table-column> -->
      <el-table-column
        v-for="(value, key) in tableHeader[0]"
        :label="value"
        :key="key"
      >
        <el-table-column
          align="center"
          :label="tableHeader[0][key]"
          min-width="100"
          :prop="key"
        >
          <template slot-scope="scope">
            {{ scope }}
            <span>{{ scope.row[key] || "--" }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div style="height: 20px"></div>
    <el-table
      class="custom_table"
      ref="tableRef"
      table-layout="auto"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column label="文件下发信息" align="center">
        <el-table-column
          prop="company"
          label="公司"
          align="center"
          width="220"
        ></el-table-column>
        <el-table-column
          prop="serviceAreaName"
          label="服务区"
          align="center"
          width="220"
        />
      </el-table-column>
      <el-table-column
        prop="stourByS"
        label="政策法规："
        align="center"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="stourByS"
        label="制度："
        align="center"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="stourByS"
        label="制度："
        align="center"
        width="200"
      />
      <el-table-column
        prop="stourByS"
        label="通知通告："
        align="center"
        width="200"
      />
      <el-table-column
        prop="stourByS"
        label="公告："
        align="center"
        width="200"
      />
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      class="custom_dialog"
      v-model="staffModalvVisible"
      :title="staffModalTitle"
      width="600"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-table
        class="custom_table"
        ref="tableRef"
        table-layout="auto"
        :data="stafftableDataSource"
        style="width: 100%"
      >
        <el-table-column
          prop="areaName"
          label="未巡检区域"
          width="240"
          align="center"
        />
        <el-table-column
          prop="tourDate"
          label="未巡检日期"
          align="center"
          width="200"
        />
        <el-table-column
          prop="unTours"
          label="未巡检次数"
          align="center"
          width="120"
        />
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleClose">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getBaseStaffList, exportXlsUrl } from "@/api/staffListApi.js";
import { downFilePOST } from "@/api/manage";
import moment from "moment";
import { getServiceArea } from "@/api/dictionaryApi.js";

const tableRef = ref(null); // 列表引用
const tableData = ref([
  {
    announce: 0,
    company: "渝蓉公司",
    law: 2,
    notice: 0,
    serviceAreaName: "围龙服务区",
    system: 1,
    total: 0,
  },
]); // 列表数据

let staffModalTitle = ref(" "); // 员工未巡检详情标题
let stafftableDataSource = ref([]); // 员工未巡检详情list
let nowDate = moment(Date.now()).format("YYYY-MM-DD");
let formData = reactive({
  // 自定义查询条件
  serviceAreaId: "", // 服务区
  side: "", // 服务区类型
  startTime: nowDate, // 开始时间，默认为当前日期
  endTime: nowDate, // 结束时间，默认为当前日期
});
let staffFormData = reactive({
  // 自定义查询条件
  serviceAreaId: "", // 服务区
  side: "", // 服务区类型
  timeRange: [nowDate, nowDate], // 时间周期，默认为当前日期范围
});
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数

const serviceAreaList = ref([]); // 服务区列表
const sideList = reactive([
  { name: "整体", code: "ALL" },
  { name: "进城", code: "RIGHT" },
  { name: "出城", code: "LEFT" },
]); // 服务区类型列表
const tableHeader = ref([
  {
    work: '文件下发',
    work: '文件下发',
    law: '政策法规',
    system: '制度',
    notice: '通知通告',
    announce: '公告',
  },
]);
// 合并规则: 第一行
const mergingRuleListFirstColumn = ref([
  {
    startIndex: 0,
    endIndex: 2,
    count: 0,
  },
]);
const mergingRuleListFirstRow = ref([]);
const mergingRuleListSecondRow = ref([]);
// const mergingRuleListThirdlyRow = ref([]);

// 列表合并
function arraySpanMethod({ row, column, rowIndex, columnIndex }) {
  console.log(row, column, rowIndex, columnIndex);
  if (columnIndex === 0) {
    let item = {};
    for (let i = 0; i < mergingRuleListFirstColumn.value.length; i++) {
      item = mergingRuleListFirstColumn.value[i];
      if (rowIndex >= item.startIndex && rowIndex <= item.endIndex) {
        if (rowIndex === item.startIndex) {
          return [item.count, 1];
        } else {
          return [0, 0];
        }
      }
    }
  }

  //   if (rowIndex === 0) {
  //     let item = {};
  //     for (let i = 0; i < 1; i++) {
  //       item = mergingRuleListFirstRow[i];
  //       if (columnIndex >= item.startIndex && columnIndex <= item.endIndex) {
  //         if (columnIndex === item.startIndex) {
  //           return [1, item.count];
  //         } else {
  //           return [0, 0];
  //         }
  //       }
  //     }
  //   }

  //   if (rowIndex === 1) {
  //     let item = {};
  //     for (let i = 0; i < 1; i++) {
  //       item = mergingRuleListSecondRow.value[i];
  //       if (columnIndex >= item.startIndex && columnIndex <= item.endIndex) {
  //         if (columnIndex === item.startIndex) {
  //           return [1, item.count];
  //         } else {
  //           return [0, 0];
  //         }
  //       }
  //     }
  //   }

  //   if (rowIndex === 2) {
  //     let item = {};
  //     for (let i = 0; i < 1; i++) {
  //       item = mergingRuleListThirdlyRow.value[i];
  //       if (columnIndex >= item.startIndex && columnIndex <= item.endIndex) {
  //         if (columnIndex === item.startIndex) {
  //           return [1, item.count];
  //         } else {
  //           return [0, 0];
  //         }
  //       }
  //     }
  //   }

  //   if (rowIndex === 3) {
  //     let item = {};
  //     for (let i = 0; i < 1; i++) {
  //       item = this.mergingRuleListFourthlyRow[i];
  //       if (columnIndex >= item.startIndex && columnIndex <= item.endIndex) {
  //         if (columnIndex === item.startIndex) {
  //           return [1, item.count];
  //         } else {
  //           return [0, 0];
  //         }
  //       }
  //     }
  //   }
  return [1, 1]; // 其他列不合并
}
// 列表导出
function handleExcel() {
  let fileName = "保安保洁管理报表";
  formData.serviceAreaId = staffFormData.serviceAreaId;
  formData.side = staffFormData.side;
  downFilePOST(exportXlsUrl, formData).then((data) => {
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
  formData.serviceAreaId = staffFormData.serviceAreaId;
  formData.side = staffFormData.side;
  // 查询
  getBaseStaffList({
    ...formData,
    pageNo: page.value,
    pageSize: pageSize.value,
  }).then((res) => {
    if (res.code === 200) {
      res.data.records.forEach((item) => {
        // 服务区
        if (item.serviceAreaId) {
          serviceAreaList.value.forEach((ite) => {
            if (item.serviceAreaId === ite.id) {
              item.serviceAreaId = ite.name;
            }
          });
        }
      });
      tableData.value = res.data.records;
      total.value = res.data.total;
    } else {
      ElMessage.error(res.message);
    }
  });
}

function handleClose() {
  staffModalvVisible.value = false;
}

// 获取字典数据
function getDictionary() {
  // 获取服务区
  getServiceArea()
    .then(({ code, data }) => {
      if (code === 200) {
        serviceAreaList.value = data.records;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// 重置查询
function onReset() {
  // 重置表单参数赋值
  Object.keys(formData).forEach((key) => {
    formData[key] = null;
  });
  // 重置自定义表单参数赋值
  Object.keys(staffFormData).forEach((key) => {
    staffFormData[key] = " ";
  });
  page.value = 1; // 重置页码
  pageSize.value = 10; // 重置每页条数
  getData(); // 重新查询
}

// 时间选择器数据转换
function checkDate(e) {
  formData.startTime = e[0];
  formData.endTime = e[1];
}

// 分页
function handleCurrentChange(val) {
  page.value = val;
  getData();
}

// 每页条数
function handleSizeChange(val) {
  pageSize.value = val;
  getData();
}

const staffModalvVisible = ref(false); // 员工未巡检详情隐藏
function handleExamine(record) {
  staffModalvVisible.value = true;
  staffModalTitle = "保安未巡检详情";
  stafftableDataSource = record.utourAreaS;
}

function handleExamine1(record) {
  staffModalvVisible.value = true;
  staffModalTitle = "管理员未巡检详情";
  stafftableDataSource = record.utourAreaM;
}

function handleExamine2(record) {
  staffModalvVisible.value = true;
  staffModalTitle = "日巡检设备未巡检详情";
  stafftableDataSource = record.utourDeviceD;
}

function handleExamine3(record) {
  staffModalvVisible.value = true;
  staffModalTitle = "周巡检设备未巡检详情";
  stafftableDataSource = record.utourDeviceW;
}

function handleExamine4(record) {
  staffModalvVisible.value = true;
  staffModalTitle = "未消毒详情";
  stafftableDataSource = record.udisinfectConfigs;
}

onMounted(() => {
  getDictionary();
  //   getData();
});
</script>

<style lang="less" scoped>
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

      &.btn {
        .el-form-item__content {
          display: flex;
          justify-content: flex-end;
        }
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
