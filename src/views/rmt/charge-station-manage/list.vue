<template>
  <div class="this_page">
    <!-- 筛选项 -->
    <div ref="searchRef">
      <el-form inline :model="formData" class="custom_form" label-width="110px" label-position="right" label-suffix=":">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="公司" class="form_item">
              <el-select collapse-tags collapse-tags-tooltip v-model="formData.companyList" multiple filterable
                placeholder="请选择公司" clearable>
                <el-option v-for="(item, index) in companyList" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="路段" class="form_item">
              <el-cascader v-model="formData.railwayList" :emitPath="false" filterable clearable
                :show-all-levels="false" placeholder="请选择路段" collapse-tags :props="lineProps" :options="lineTree">
              </el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="服务区" class="form_item">
              <el-select v-model="formData.serviceList" multiple filterable placeholder="请选择服务区" clearable collapse-tags
                collapse-tags-tooltip>
                <el-option v-for="(item, index) in listOptions.serviceAreaList" :key="index" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电站名称" class="form_item">
              <el-input v-model="formData.stationName" clearable placeholder="请输入电站名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电站地址" class="form_item">
              <el-input v-model="formData.address" clearable placeholder="请输入电站地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电站状态" class="form_item">
              <el-select v-model="formData.stationStatus" filterable placeholder="请选择电站状态" clearable>
                <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="归属商户" class="form_item">
              <el-select v-model="formData.operatorName" filterable placeholder="请选择归属商户" clearable>
                <el-option v-for="item in shList" :label="item" :value="item" :key="item" />

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否超充站" class="form_item">
              <el-select collapse-tags collapse-tags-tooltip v-model="formData.isSuper" placeholder="请选择是否超充站"
                clearable>
                <el-option v-for="(item, index) in superchargingStation" :key="index" :label="item.name"
                  :value="item.isSuper" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="开通运营时间" class="form_item">
              <el-date-picker value-format="YYYY-MM-DD" v-model="formData.operateTimeList" type="daterange"
                range-separator="~" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接入平台时间" class="form_item">
              <el-date-picker value-format="YYYY-MM-DD" v-model="formData.firstSaveTimeList" type="daterange"
                range-separator="~" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-row :gutter="30">
          </el-row> -->
          <el-col :span="18"></el-col>
          <el-col :span="6">
            <el-form-item class="form_item query-form-btn">
              <el-button type="primary" @click="getData" :loading="loading">查询</el-button>
              <el-button type="primary" @click="onReset" style="margin-right: 20px">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 功能按钮组 -->
    <div class="func_btn_box">
      <el-button type="primary" @click="doExport">
        <el-icon>
          <Download />
        </el-icon>
        <span>导出</span>
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" class="custom_table" ref="tableRef" @sort-change="handleSortChange" border
      :data="tableData" :max-height="`calc(100vh - ${tableHeight}px)`" style="width: 100%">

      <el-table-column type="index" label="序号" width="80" fixed="left" align="center" />
      <el-table-column prop="companyName" label="公司" fixed="left" min-width="140" align="center" />
      <el-table-column prop="roadSection" label="路段" fixed="left" width="140" align="center" />
      <el-table-column prop="serviceAreaName" label="服务区" fixed="left" min-width="140" align="center" />
      <el-table-column prop="stationName" label="电站名称" fixed="left" min-width="140" align="center" />
      <el-table-column prop="address" label="电站地址" min-width="140" align="center" />
      <el-table-column prop="isSuper" label="是否是超充站"
        :formatter="(row) => row.isSuper === 1 ? '是' : (row.isSuper === 0 ? '否' : '')" fixed="left" min-width="140"
        align="center" />
      <el-table-column prop="stationType" label="电站类型" width="120" align="center" />
      <el-table-column prop="operatorName" label="归属商户" width="140" align="center" />
      <el-table-column prop="operateTime" label="开通运营时间" width="160" align="center" />
      <el-table-column prop="equipmentNum" sortable width="140" label="充电桩数量" align="center" />
      <el-table-column prop="zlChargeConnectorNum" sortable width="160" label="充电枪数量(直流)" align="center" />
      <el-table-column prop="jlChargeConnectorNum" sortable width="160" label="充电枪数量(交流)" align="center" />
      <el-table-column prop="stationStatus" label="电站状态" width="140" align="center" />
      <el-table-column prop="totalPower" label="额定总功率(KW)" width="140" align="center" />
      <el-table-column prop="firstSaveTime" label="接入平台时间" width="160" align="center" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="handleDetail(scope.row)">
            详情
          </el-button>
          <el-button link type="primary" size="small" @click.prevent="handleJgDetail(scope.row)">
            价格策略
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
      <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
        layout="total,  prev, pager, next,sizes, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <!-- 详情弹窗 -->
    <DetailsDialog ref="detailModalRef" v-model="aedVisible" @close="aedClose" />

    <!--    电价弹窗-->
    <JgDialog ref="jgModalRef" v-model="jgVisible" @close="jgClose" />
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, useTemplateRef } from "vue";
import DetailsDialog from "./components/details-dialog/index.vue";
import JgDialog from "./components/jg-dialog/index.vue"
import { getServiceArea } from "@/api/dictionaryApi.js";
import { exportData } from "@/utils/common-features";
import { getCompany } from "@/api/informationServiceAreaApi.js";
import {
  getChargeStationManageAreaList,
  getChargeStationManagePullName,
  getDict,
  getRoadLineTreeList
} from "@/api/powerStation/index.js";

const detailModalRef = ref()
const jgModalRef = ref()

const formData = reactive({
  countDay: '',
  operateTimeList: [], // 开通运营时间
  firstSaveTimeList: [], // 接入平台时间
  isSuper: null, // 是否是超充站
});
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
const companyList = ref([]); // 公司下拉数据
const lineTree = ref([]); // 路段下拉数据

const lineProps = { multiple: true, value: "label" };
const loading = ref(false)
const shList = ref([])

const statusList = ref([])

const superchargingStation = ref([
  { name: "是", isSuper: 1 },
  { name: "否", isSuper: 0 },
]);


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

  // 公司
  getCompany().then((res) => {
    companyList.value = res.data.records;
  });
  getRoadLineTreeList().then((res) => {
    lineTree.value = res?.data?.records;
  });

  getChargeStationManagePullName().then((res) => {
    shList.value = res?.data?.records;
  })


  getDict({ queriers: [{ "alias": "stationStatusDictionary" }] }).then(res => {
    console.log(res)
    statusList.value = res?.data?.stationStatusDictionary;
  })
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
    // operateTime: formData.operateTime ? formData.operateTime.join(",") : null,
    // firstSaveTime: formData.firstSaveTime ? formData.firstSaveTime.join(",") : null,
    sortColumn: orderColumn.value,
    // startTime: formData.checkTime?.[0],
  };

  let res = await getChargeStationManageAreaList(params);
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
const handleSortChange = ({ column, prop, order }) => {
  console.log(column, prop, order)
  if (order) {
    let newColumn = (prop)
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
  detailModalRef.value.getData(data)
};

const jgVisible = ref(false)
const jgData = ref({})

const handleJgDetail = (data) => {
  jgVisible.value = true;
  jgData.value = data ? data : {};
  jgModalRef.value.getData(data)
};

// 详情弹窗关闭
const aedClose = () => {
  aedVisible.value = false;
  jgData.value = {}
};
// 电价弹窗关闭
const jgClose = () => {
  jgVisible.value = false;
};
// 导出
const doExport = () => {
  const params = {
    ...formData,
    sortColumn: orderColumn.value,
    railwayList: formData.railwayList ? flattenArray(formData.railwayList) : null,
  };
  exportData("/rmt/chargeStationManage/exportXls", "充电站管理", params);
};


const tableHeight = ref()
const searchFormDom = useTemplateRef('searchRef')
onMounted(() => {
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
