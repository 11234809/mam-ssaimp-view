<!-- 日常记录报表--日报 -->

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
        <el-col :span="6" v-for="formItem in formItemList">
          <el-form-item :label="formItem.label" class="form_item">
            <el-select
              v-if="formItem.type === 'select'"
              v-model="formData[formItem.prop]"
              multiple
              filterable
              :placeholder="`请选择${formItem.label}`"
              clearable
              :reserve-keyword="false"
            >
              <el-option
                v-for="(item, index) in formItem.options"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              v-if="formItem.type === 'datePicker'"
              v-model="formData[formItem.prop]"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="~"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="form_item query-form-btn">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 功能按钮组 -->
    <div class="func_btn_box">
      <el-button
        type="primary"
        v-if="isAuth('add')"
        @click="handleDetail('add')"
        >新增</el-button
      >
      <el-button type="primary" @click="handleExcel">导出</el-button>
    </div>
    <!-- 统计 -->
    <div class="total-box">
      <Stats :data="trafficStatsObj" />
    </div>

    <el-table
      class="custom_table"
      ref="tableRef"
      table-layout="auto"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        v-for="item in tableColumnList"
        :type="item.type"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        align="center"
        :fixed="item.fixed || false"
        :sortable="item.sortable"
      >
        <template #default="{ row }" v-if="!item.type">
          <span>{{ row[item.prop] || "0" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="100" fixed="right">
        <template #default="scope">
          <div class="action_sheet">
            <!-- <el-button type="primary" size="small" link
                            @click="handleDetail('detail', scope.row)">详情</el-button> -->
            <el-button
              :disabled="!isSameMonth(scope.row.createDay)"
              v-if="isAuth('edit')"
              type="primary"
              size="small"
              link
              @click="handleDetail('edit', scope.row)"
              >编辑</el-button
            >
            <!-- <el-button type="primary" size="small" link
                            @click="handleDelete(scope.row.entityId)">删除</el-button> -->
          </div>
        </template>
      </el-table-column>
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

    <!-- 新增/编辑/详情弹窗 -->
    <AddEditDetail
      v-if="aedVisible"
      :visible="aedVisible"
      :type="aedType"
      :data="aedData"
      @dialogClose="aedClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onActivated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getQueryPage,
  deleteDailyIncome,
  staticTotal,
} from "@/api/daily/dailyIncome.js";
import { getServiceArea, getCompany } from "@/api/dictionaryApi.js";
import { dailyFormItem, dailyTableColumn, tableColumn } from "./index.js";
import Stats from "./stats.vue";
import { downFilePOST } from "@/api/manage";
import AddEditDetail from "./add-edit-detail";
import { isAuth } from "@/utils/authorization";
import moment from "moment";
import { bigScreen } from "@/store/bigScreen";

const store = bigScreen();
const formData = reactive({
  serviceAreaId: [], // 服务区
  checkTime: [
    moment().subtract(1, "d").format("YYYY-MM-DD"),
    moment().format("YYYY-MM-DD"),
  ], // 时间
});
const trafficStatsObj = ref({});

// 列表
const tableColumnList = computed(() => {
  return dailyTableColumn.concat(tableColumn);
});

// 搜索表单
const formItemList = computed(() => {
  return dailyFormItem(listOptions);
});

const tableRef = ref(null); // 列表引用
const tableData = ref([]); // 列表数据
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数

const listOptions = reactive({
  // companyList: [],
  serviceAreaList: [],
});
// 列表导出
const handleExcel = () => {
  // 导出方法
  let fileName = "日报记录";
  downFilePOST("/api/daily/dailyIncome/export", {
    index: -1,
    size: -1,
    serviceAreaId: formData.serviceAreaId.join(","),
    startDate: formData.checkTime ? formData.checkTime[0] : null,
    endDate: formData.checkTime ? formData.checkTime[1] : null,
  }).then((data) => {
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
};

const getData = async () => {
  // 查询
  getQueryPage({
    serviceAreaId: formData.serviceAreaId.join(","),
    startDate: formData.checkTime ? formData.checkTime[0] : null,
    endDate: formData.checkTime ? formData.checkTime[1] : null,
    index: page.value,
    size: pageSize.value,
  }).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data.records;
      total.value = res.data.total;
    } else {
      ElMessage.error(res.message);
    }
  });
  staticTotal({
    serviceAreaId: formData.serviceAreaId.join(","),
    startDate: formData.checkTime ? formData.checkTime[0] : null,
    endDate: formData.checkTime ? formData.checkTime[1] : null,
  }).then((res) => {
    trafficStatsObj.value = res.data;
  });
};

// 获取字典数据
const getDictionary = () => {
  // 获取服务区
  getServiceArea()
    .then(({ code, data }) => {
      if (code == 200) {
        listOptions.serviceAreaList = data.records;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // 获取公司
  // getCompany().then(({ code, data }) => {
  //     if (code == 200) {
  //         listOptions.companyList = data.records;
  //     }
  // });
};

// 重置查询
const onReset = () => {
  // 重置表单参数赋值
  Object.keys(formData).forEach((key) => {
    formData[key] = [];
  });
  page.value = 1; // 重置页码
  pageSize.value = 10; // 重置每页条数
  getData(); // 重新查询
};

// 分页
const handleCurrentChange = (val) => {
  page.value = val;
  getData();
};

// 每页条数
const handleSizeChange = (val) => {
  pageSize.value = val;
  getData();
};

onMounted(() => {
  getDictionary();
  getData();
});

onActivated(async () => {
  await getDictionary();
  await valueBasedQuery();
  await getData();
});

const valueBasedQuery = async (val) => {
  const now = moment();
  if (store.chargeReportData.selectTimeType === "0") {
    // 当前日
    const today = now.format("YYYY-MM-DD");
    formData.checkTime = [today, today];
  } else if (store.chargeReportData.selectTimeType === "1") {
    // 昨日
    const yesterday = now.clone().subtract(1, "day").format("YYYY-MM-DD");
    formData.checkTime = [yesterday, yesterday];
  } else if (store.chargeReportData.selectTimeType === "2") {
    // 本周（周一到周日）
    const startOfWeek = now.clone().startOf("isoWeek").format("YYYY-MM-DD");
    const endOfWeek = now.clone().endOf("isoWeek").format("YYYY-MM-DD");
    formData.checkTime = [startOfWeek, endOfWeek];
  } else if (store.chargeReportData.selectTimeType === "3") {
    // 当前月
    const startOfMonth = now.clone().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = now.clone().endOf("month").format("YYYY-MM-DD");
    formData.checkTime = [startOfMonth, endOfMonth];
  } else if (store.chargeReportData.selectTimeType === "4") {
    // 当前季度
    const startOfQuarter = now.clone().startOf("quarter").format("YYYY-MM-DD");
    const endOfQuarter = now.clone().endOf("quarter").format("YYYY-MM-DD");
    formData.checkTime = [startOfQuarter, endOfQuarter];
  } else if (store.chargeReportData.selectTimeType === "5") {
    // 当前年
    const startOfYear = now.clone().startOf("year").format("YYYY-MM-DD");
    const endOfYear = now.clone().endOf("year").format("YYYY-MM-DD");
    formData.checkTime = [startOfYear, endOfYear];
  }
  console.log(store.chargeReportData, "store.chargeReportData");

  formData.serviceAreaId = store.chargeReportData.serviceAreaIdList;
};
// 删除
const handleDelete = (id) => {
  ElMessageBox.confirm("是否确认删除?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    let res = await deleteDailyIncome({ id });
    if (res.code == 200) {
      ElMessage({
        message: res.data.message,
        type: "success",
      });
      await getData();
    }
  });
};

// 列表新增/编辑/详情
function handleDetail(type, data) {
  aedVisible.value = true;
  aedType.value = type;
  // 新增日报记录，默认日报时间当前日期前一天
  let addData = {
    createDay: moment().subtract(1, "d").format("YYYY-MM-DD"),
  };
  aedData.value = data ? data : addData;
}

/* 新增/编辑/详情弹窗相关start */
const aedData = ref(null); // 新增/编辑/详情弹窗数据
const aedType = ref(""); // 新增/编辑/详情弹窗类型 add:新增 edit:编辑 detail:详情
const aedVisible = ref(false); // 新增/编辑/详情弹窗显示

// 新增/编辑/详情弹窗关闭
function aedClose() {
  aedVisible.value = false;
  aedType.value = "";
  getData();
}

const isSameMonth = (reportDate) => {
  const currentTime = new Date();
  const currentYear = currentTime.getFullYear();
  const currentMonth = currentTime.getMonth() + 1;
  const currentDay = currentTime.getDate();
  const reportYear = new Date(reportDate).getFullYear();
  const reportMonth = new Date(reportDate).getMonth() + 1;
  const reportDay = new Date(reportDate).getDate();

  if (Number(currentYear) == Number(reportYear)) {
    if (Number(currentDay) > 5) {
      if (Number(reportMonth) < Number(currentMonth)) {
        return false;
      } else {
        return true;
      }
    } else {
      if (Number(reportMonth) < Number(currentMonth) - 1) {
        return false;
      } else {
        return true;
      }
    }
  } else {
    if (Number(currentYear) == Number(reportYear) + 1) {
      if (Number(currentMonth) == 1 && Number(reportMonth) == 12) {
        if (Number(currentDay) <= 5) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};
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
    }
  }

  .func_btn_box {
    margin-bottom: 10px;
  }

  .total-box {
    .total {
      display: flex;
      text-align: center;
      margin-bottom: 10px;

      .title {
        min-width: 240px;
        font-size: 20px;
        font-weight: 600;
        height: 60px;
        line-height: 60px;
        border: 1px solid #ccc;
        padding: 0 10px;
      }

      .detail {
        display: flex;
        height: 60px;

        .single {
          width: 135px;
          border: 1px solid #ccc;
          border-left: 0;
          line-height: 1.5;

          .single-one {
            font-size: 16px;
          }

          .single-two {
            font-size: 18px;
          }
        }
      }
    }
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
