<template>
  <div class="this_page">
    <!-- 筛选项 -->
    <div ref="searchRef">
      <el-form inline ref="searchRef" :model="formData" class="custom_form" label-width="120px" label-position="right"
               label-suffix=":">
        <el-row :gutter="30">
          <el-col :span="5">
            <el-form-item label="公司" label-width="60px" class="form_item">
              <el-select collapse-tags collapse-tags-tooltip v-model="formData.companyList" multiple filterable
                         placeholder="请选择公司" clearable>
                <el-option v-for="(item, index) in companyList" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="路段" label-width="60px" class="form_item">
              <el-cascader v-model="formData.railwayList" :emitPath="false" placeholder="请选择路段"  filterable clearable
                           :show-all-levels="false"
                           collapse-tags
                           :props="lineProps" :options="lineTree">
              </el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="服务区" label-width="60px" class="form_item">
              <el-select v-model="formData.serviceList" multiple filterable placeholder="请选择服务区" clearable collapse-tags
                         collapse-tags-tooltip>
                <el-option v-for="(item, index) in listOptions.serviceAreaList" :key="index" :label="item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="日期" label-width="60px" class="form_item">
              <el-date-picker v-model="formData.countDay" :clearable="false" placeholder="请选择日期" value-format="YYYY-MM-DD"
                              range-separator="~" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item class="form_item query-form-btn">
              <el-button type="primary" @click="getData" :loading="loading">查询</el-button>
              <el-button type="primary" @click="onReset" style="margin-right: 20px">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="30">
                  <el-col :span="18"></el-col>
                  <el-col :span="6">
                      <el-form-item class="form_item query-form-btn">
                          <el-button type="primary" @click="getData">查询</el-button>
                          <el-button type="primary" @click="onReset">重置</el-button>
                      </el-form-item>
                  </el-col>
              </el-row> -->
      </el-form>
    </div>
    <!-- 功能按钮组 -->
    <div class="func_btn_box">
      <el-button type="primary" @click="doExport">
        <el-icon>
          <Download/>
        </el-icon>
        <span>导出</span>
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" class="custom_table" ref="tableRef" @sort-change="handleSortChange" border
              :data="tableData" :max-height="`calc(100vh - ${tableHeight}px)`" style="width: 100%">
      <el-table-column :label="`重庆高速公路服务区充电桩使用情况统计表` + (curData ?`（统计${curData} 00:00-24:00）`:'')"
                       align="center">
        <el-table-column type="index" label="序号" width="80" align="center"/>
        <el-table-column prop="companyName" label="公司" min-width="140" align="center"/>
        <el-table-column prop="railway" label="路段" align="center"/>
        <el-table-column prop="serviceAreaName" label="服务区" min-width="140" align="center"/>
        <el-table-column prop="serviceId" label="服务区编号" width="140" align="center"/>
        <el-table-column :label="`${curData?curData:''}充电桩使用情况(按照不同品牌统计)`" align="center">
          <el-table-column label="国网电动" align="center">
            <el-table-column prop="gdChargeGunsNum" label="充电枪数" width="120" sortable align="center"/>
            <el-table-column prop="gdChargeNum" label="充电次数" width="120" sortable align="center"/>
            <el-table-column prop="gdChargeHours" label="充电总时长" width="120" sortable align="center"/>
          </el-table-column>
          <el-table-column label="数字交通" align="center">
            <el-table-column prop="sjChargeGunsNum" label="充电枪数" width="120" sortable align="center"/>
            <el-table-column prop="sjChargeNum" label="充电次数" width="120" sortable align="center"/>
            <el-table-column prop="sjChargeHours" label="充电总时长" width="120" sortable align="center"/>
          </el-table-column>
          <el-table-column label="其他品牌运营商" align="center">
            <el-table-column prop="otChargeGunsNum" label="充电枪数" width="120" sortable align="center"/>
            <el-table-column prop="otChargeNum" label="充电次数" width="120" sortable align="center"/>
            <el-table-column prop="otChargeHours" label="充电总时长" width="120" sortable align="center"/>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="`${curData?curData:''}合计`" align="center">
          <el-table-column prop="totalChargeGunsNum" label="充电枪数" width="120" sortable align="center"/>
          <el-table-column prop="totalChargeNum" label="充电次数" width="120" sortable align="center"/>
          <el-table-column prop="totalChargeHours" label="充电总时长" width="120" sortable align="center"/>
          <el-table-column prop="totalChargeHoursRate" label="充电时长利用率(%)" width="200" align="center" sortable>
            <template #header>
              <div style="display: flex; align-items: center">
                <span style="display: flex; align-items: center">
                  <span>
                   充电时长利用率(%)
                  </span>
                  <el-popover placement="top-start" title="充电时长利用率(%)" effect="dark" width="auto" trigger="hover"
                              content="充电枪占用（充电）时长求和/充电枪数量*24小时">
                    <template #reference>
                      <el-icon color="#fa8c16" size="18">
                        <QuestionFilled/>
                      </el-icon>
                    </template>
                  </el-popover>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
      <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
                     layout="total,  prev, pager, next,sizes, jumper" :total="total" @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"/>
    </div>

    <!-- 详情弹窗 -->
    <!-- <DetailDialog
        v-if="aedVisible"
        :visible="aedVisible"
        :data="aedData"
        @dialogClose="aedClose"
        :options="listOptions"
      /> -->
  </div>
</template>

<script setup>
import {nextTick, onMounted, reactive, ref, useTemplateRef} from "vue";
//   import DetailDialog from "./detail-dialog";
import {getServiceArea} from "@/api/dictionaryApi.js";
import {exportData} from "@/utils/common-features";
import {getCompany} from "@/api/informationServiceAreaApi.js";
import {getChargePileUsageList, getRoadLineTreeList,} from "@/api/powerStation/index.js";
import {camelToSnake} from "@/utils";

const formData = reactive({
  countDay: ''
});
const listOptions = reactive({
  serviceAreaList: [],
  statusList: [
    {label: "正常", value: "2"},
    {label: "异常", value: "1"},
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
const companyList = ref([]); // 公司下拉数据
const lineTree = ref([]); // 路段下拉数据

const lineProps = {multiple: true, value: "label",reserveKeyword:false};
const curData = ref(getCurDate(null));
const loading = ref(false)

function getCurDate(dateStr, num = 1) {
  let now = null;
  console.log(dateStr, "dateStr");
  if (dateStr) {
    now = new Date(dateStr);
  } else {
    now = new Date();
  }
  now.setDate(now.getDate() - num);
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份是从0开始的，所以需要+1
  const day = now.getDate().toString().padStart(2, "0");

  const formattedDate = `${year}年${month}月${day}日`;
  return formattedDate;
}

// 获取字典数据
const getDictionary = () => {
  // 获取服务区
  getServiceArea()
      .then(({code, data}) => {
        if (code == 200) {
          listOptions.serviceAreaList = data.records;
        }
      })
      .catch((err) => {
        console.log(err);
      });

  // 公司
  getCompany().then((res) => {
    companyList.value = res.data.records;
  });
  getRoadLineTreeList().then((res) => {
    lineTree.value = res?.data?.records;
  });
};

function flattenArray(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flattenArray(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

//获取列表数据
const getData = async () => {
  loading.value = true;
  tableData.value = []
  const params = {
    index: page.value,
    size: pageSize.value,
    ...formData,
    railwayList: formData.railwayList ? flattenArray(formData.railwayList) : null,
    sortColumn: orderColumn.value,
    // startTime: formData.checkTime?.[0],
  };
  console.log(formData.countDay, "formData.countDay");
  if (formData?.countDay) {
    curData.value = getCurDate(formData.countDay, 0);
  } else {
    curData.value = null
  }
  let res = await getChargePileUsageList(params);
  if (res.code == 200) {
    tableData.value = res.data.records;
    total.value = Number(res.data.total);
  }
  loading.value = false;
};

// 排序字段
const orderColumn = ref({
  column: null,
  order: null
})
const handleSortChange = ({column, prop, order}) => {
  console.log(column, prop, order)
  if (order) {
    let newColumn = camelToSnake(prop)
    orderColumn.value = {
      column: newColumn,
      order: order === 'descending' ? 'desc' : 'asc'
    }
    page.value = 1;
  } else {
    orderColumn.value = {
      column: null,
      order: null
    }
  }
  getData()
}
// 查询重置
const onReset = () => {
  Object.keys(formData).map((key) => {
    formData[key] = null;
  });
  formData.countDay = getCurDate().replace("年", "-").replace("月", "-").replace("日", "")
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
const doExport = () => {
  const params = {
    ...formData,
    sortColumn: orderColumn.value,
    railwayList: formData.railwayList ? flattenArray(formData.railwayList) : null,
  };
  exportData("/rmt/chargePileUsage/exportXls", "充电桩使用情况", params);
};

const tableHeight = ref()
const searchFormDom = useTemplateRef('searchRef')
onMounted(() => {
  formData.countDay = getCurDate().replace("年", "-").replace("月", "-").replace("日", "")
  getDictionary();
  getData();

  nextTick(() => {
    tableHeight.value = 63 + 32 + 71 + searchFormDom.value.offsetHeight + 52 + 50;
  })
});
</script>

<style lang="less" scoped>
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}

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
