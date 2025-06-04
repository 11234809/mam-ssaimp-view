<!-- 设备巡检 -->
<template>
  <div class="this_page">
    <!-- 筛选项 -->
    <el-form
      inline
      :model="formData"
      class="custom_form"
      label-width="120px"
      label-position="right"
      label-suffix=":"
    >
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="服务区" class="form_item">
            <el-select
              v-model="formData.serviceAreaIds"
              multiple
              filterable
              :reserve-keyword="false"
              placeholder="请选择"
              clearable
              collapse-tags
              collapse-tags-tooltip
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
        <el-col :span="6">
          <el-form-item label="设备状态" class="form_item">
            <el-select
              v-model="formData.status"
              filterable
              :reserve-keyword="false"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in listOptions.statusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="巡查周期" class="form_item">
            <el-select
              v-model="formData.period"
              filterable
              :reserve-keyword="false"
              placeholder="请选择"
              clearable
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
        <el-col :span="6">
          <el-form-item label="巡检系统" class="form_item">
            <el-input
              v-model="formData.system"
              placeholder="请输入巡检系统"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="巡检设备分类" class="form_item">
            <el-input
              v-model="formData.type"
              placeholder="请输入巡检设备分类"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="巡检时间" class="form_item">
            <el-date-picker
              v-model="formData.checkTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="~"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备名称" class="form_item">
            <el-input
              v-model="formData.name"
              placeholder="请输入设备名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="18"></el-col>
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
      <el-button type="primary" @click="doExport(0)">
        <span>导出</span>
      </el-button>
      <el-button type="primary" @click="doExport(1)">
          <span>带图导出</span>
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
      class="custom_table"
      ref="tableRef"
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column
        prop="serviceAreaName"
        label="服务区"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="name"
        label="设备名称"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="system"
        label="巡检系统"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="periodText"
        label="巡检周期"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="type"
        label="巡检设备分类"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="status"
        label="设备状态"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{
            listOptions.statusList.filter(
              (item) => item.value == row.status
            )[0]?.label
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="creatorName"
        label="巡检人"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="inspectTime"
        label="巡检时间"
        align="center"
        show-overflow-tooltip
        width="180"
      />
      <el-table-column label="操作" align="center" width="140">
        <template #default="scope">
          <div class="action_sheet">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleDetail(scope.row)"
            >
              详情
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total,  prev, pager, next,sizes, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 详情弹窗 -->
    <DetailDialog
      v-if="aedVisible"
      :visible="aedVisible"
      :data="aedData"
      @dialogClose="aedClose"
      :options="listOptions"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import DetailDialog from "./detail-dialog";
import { getServiceArea, queryNormalOptions } from "@/api/dictionaryApi.js";
import { getBasRecordList } from "@/api/device/basRecordApi";
import { exportData } from "@/utils/common-features";

const formData = reactive({});
const listOptions = reactive({
  serviceAreaList: [],
  statusList: [
    { label: "正常", value: "2" },
    { label: "异常", value: "1" },
  ],
  periodList: [],
});
const tableRef = ref(null); //列表ref
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const aedData = ref({}); // 详情弹窗数据
const aedVisible = ref(false); // 详情弹窗显示

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
  // 获取巡检周期
  queryNormalOptions({
    queriers: [{ alias: "devicePeriodDictionary", param: null }],
  }).then(({ code, data }) => {
    listOptions.periodList = data.devicePeriodDictionary;
  });
};

//获取列表数据
const getData = async () => {
  const params = {
    index: page.value,
    size: pageSize.value,
    ...formData,
    startTime: formData.checkTime?.[0],
    endTime: formData.checkTime?.[1],
    serviceAreaId: formData.serviceAreaIds?.length
      ? formData.serviceAreaIds?.join(",")
      : undefined,
  };
  let res = await getBasRecordList(params);
  if (res.code == 200) {
    tableData.value = res.data.records;
    total.value = Number(res.data.total);
  }
};
// 查询重置
const onReset = () => {
  Object.keys(formData).map((key) => {
    formData[key] = null;
  });
  page.value = 1;
  pageSize.value = 10;
  getData();
};
// 列表分页-当前页改变
const handleCurrentChange = (val) => {
  page.value = val;
  getData();
};
// 列表分页-每页显示条数改变
const handleSizeChange = (val) => {
  pageSize.value = val;
  getData();
};
// 列表详情
const handleDetail = (data) => {
  aedVisible.value = true;
  aedData.value = data ? data : {};
};

// 详情弹窗关闭
const aedClose = () => {
  aedVisible.value = false;
  getData();
};
// 导出
const doExport = (imgFlag) => {
  const params = {
    ...formData,
    startTime: formData.checkTime?.[0],
    endTime: formData.checkTime?.[1],
    index: imgFlag?page.value:-1,
    size: imgFlag?pageSize.value:-1,
    serviceAreaId: formData.serviceAreaIds.length
      ? formData.serviceAreaIds?.join(",")
      : undefined,
    imgFlag
  };
  exportData("/device/basRecord/export", "设备巡检", params);
};

onMounted(() => {
  getDictionary();
  getData();
});
</script>

<style lang="less" scoped>
.this_page {
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

  .tips_box {
    display: flex;
    align-items: baseline;
    height: 40px;
    margin: 10px 0;
    padding: 10px;

    .tips {
      position: relative;
      font-size: var(--fontSize16);
      font-weight: bold;

      &::before {
        position: absolute;
        content: "";
        width: 5px;
        height: 15px;
        left: -10px;
        top: 4px;
        background-color: #114484;
      }

      .tips_num {
        color: blue;
      }
    }

    .tips_num_close {
      margin-left: 10px;
      color: blue;
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

    .accessory_box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      // overflow-x: auto;

      // &::-webkit-scrollbar {
      //     // width: 100px;
      //     height: 10px;
      // }

      // &::-webkit-scrollbar-thumb {
      //     background-color: #5d5d5d;
      // }

      // &::-webkit-scrollbar-track {
      //     background-color: aliceblue;
      // }
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
