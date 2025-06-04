<template>
  <div class="this_page">
    <!-- 筛选项 -->
    <div ref="searchRef">
      <el-form inline :model="formData" class="custom_form" label-width="130px" label-position="right" label-suffix=":">
        <el-row :gutter="30">
          <el-col :span="6" v-for="cItem in  searchColumn" :key="cItem?.label">
            <el-form-item :label="cItem?.label" :label-width="cItem?.labelWidth" class="form_item">
              <template v-if="cItem?.type ==='select'">
                <el-select collapse-tags collapse-tags-tooltip v-model="formData[cItem?.field]"
                           :multiple="cItem?.multiple" filterable
                           :placeholder="`请选择${cItem?.label}`" clearable>
                  <el-option v-for="(item, index) in cItem?.dataList" :key="index" :label="item?.label"
                             :value="item?.value"/>
                </el-select>
              </template>
              <template v-else-if="cItem?.type ==='checkbox'">
                <el-checkbox-group v-model="formData[cItem?.field]">
                  <el-checkbox v-for="(item, index) in cItem?.dataList" :label="item?.value"
                               :key="index">
                    {{ item?.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
              <template v-else-if="cItem?.type ==='date-picker'">
                <el-date-picker
                    v-model="formData[cItem?.field]"
                    type="date"
                    :placeholder="`请选择${cItem?.label}`"
                    :shortcuts="cItem?.shortcuts"
                    value-format="YYYY-MM-DD"
                    style="width: 100%"
                />
              </template>
              <template v-else>
                <el-input v-model="formData[cItem?.field]" clearable :placeholder="`请输入${cItem?.label}`"></el-input>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          <Download/>
        </el-icon>
        <span>导出</span>
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" class="custom_table" ref="tableRef" @sort-change="handleSortChange" border
              :data="tableData" :max-height="`calc(100vh - ${tableHeight}px)`" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center"/>
      <el-table-column prop="serviceAreaName" label="服务区名称" min-width="140" align="center"/>
      <el-table-column prop="company" label="公司" min-width="140" align="center"/>
      <el-table-column prop="serAreaCode" label="服务区编码" width="140" align="center"/>
      <el-table-column prop="stationId" label="充电站编号" width="180" align="center"/>
      <el-table-column prop="stationName" label="充电站名称" width="300" align="center">
        <template #default="{ row }">
          <el-button type="primary" :title="row?.stationName" link @click="handleDetail(row)">{{
              row?.stationName
            }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="operatorId" label="运营商编码" width="120" align="center"/>
      <el-table-column prop="operatorType" label="运营商类别" width="140" align="center"/>
      <el-table-column prop="operatorName" label="运营商名称" width="200" align="center"/>
      <el-table-column prop="equipmentId" width="140" label="设备编码" align="center"/>
      <el-table-column prop="connectorId" width="180" label="充电设备接口编码" align="center"/>
      <el-table-column prop="connectorName" width="180" label="充电设备接口名称" align="center"/>
      <el-table-column prop="connectorStatus" label="充电设备接口状态" width="140" align="center"/>
      <el-table-column prop="lockStatus" label="地锁状态" width="140" align="center"/>
      <el-table-column prop="parkStatus" label="车位状态" width="140" align="center"/>
      <el-table-column prop="soc" label="电池剩余电量" width="140" align="center"/>
      <el-table-column prop="remainingTime" label="估算剩余充电时间(分钟)" width="180" align="center"/>
      <el-table-column prop="syncTime" label="更新时间" width="160" align="center"/>
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
      <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
                     layout="total,  prev, pager, next,sizes, jumper" :total="total" @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"/>
    </div>

    <!-- 详情弹窗 -->
    <DetailsDialog
        ref="detailModalRef"
        v-model="aedVisible"
        @close="aedClose"
    />
  </div>
</template>

<script setup>
import {nextTick, onMounted, reactive, ref, useTemplateRef} from "vue";
import DetailsDialog from "@/views/bas/charge-pile/comp/service-area-basic/components/details-dialog/index.vue";
import {exportData} from "@/utils/common-features";
import {getCompany} from "@/api/informationServiceAreaApi.js";
import {
  getDict,
} from "@/api/powerStation";
import {getServiceAreaList} from "@/api/peopleFlowApi";
import {queryChargeEquipDynamicPageList} from "@/api/powerStation/chargePile";

const detailModalRef = ref()
const jgModalRef = ref()

const formData = reactive({
  operatorType: ['0', '1']
});

const tableRef = ref(null); //列表ref
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const aedData = ref({}); // 详情弹窗数据
const aedVisible = ref(false); // 详情弹窗显示

const loading = ref(false)
// 弹窗显示的详情信息
const columns = [
  {
    label: '服务区名称',
    key: 'serviceAreaName'
  },
  {
    label: '服务区编码',
    key: 'serAreaCode'
  },
  {
    label: '公司',
    key: 'company'
  },
  {
    label: '充电站编号',
    key: 'stationId'
  },
  {
    label: '充电站名称',
    key: 'stationName'
  },
  {
    label: '设备编码',
    key: 'equipmentId'
  },
  {
    label: '充电设备接口编码',
    key: 'connectorId'
  },
  {
    label: '充电设备接口名称',
    key: 'connectorName'
  },
  {
    label: '充电设备接口状态',
    key: 'connectorStatus'
  },
  {
    label: '地锁状态',
    key: 'lockStatus'
  },
  {
    label: '车位状态',
    key: 'parkStatus'
  },
  {
    label: '电池剩余容量',
    key: 'soc'
  },
  {
    label: '估算剩余充电时间(分钟)',
    key: 'remainingTime'
  },
]

const searchColumn = ref([
  {
    label: '公司',
    field: 'company',
    type: 'select',
    dataList: [],
  },
  {
    label: '服务区名称',
    field: 'serviceAreaName',
    type: 'select',
    dataList: [],
  },
  {
    label: '服务区编码',
    field: 'serAreaCode',
    dataList: [],
  },
  {
    label: '充电站编号',
    field: 'stationId',
    dataList: [],
  },
  {
    label: '充电站名称',
    field: 'stationName',
    dataList: [],
  },
  {
    label: '运营商编码',
    field: 'operatorId',
    dataList: [],
  },
  {
    label: '运营商类别',
    field: 'operatorType',
    type: 'checkbox',
    dataList: [],
  },
  {
    label: '运营商名称',
    field: 'operatorName',
    dataList: [],
  },
  {
    label: '设备编码',
    field: 'equipmentId',
    dataList: [],
  },

  {
    label: '充电设备接口编码',
    field: 'connectorId',
    dataList: [],
  },
  {
    label: '充电设备接口名称',
    field: 'connectorName',
    dataList: [],
  },
  {
    label: '充电设备接口状态',
    field: 'connectorStatus',
    type: 'select',
    dataList: [],
  },
  {
    label: '地锁状态',
    field: 'lockStatus',
    type: 'select',
    dataList: [],
  },
  {
    label: '车位状态',
    field: 'parkStatus',
    type: 'select',
    dataList: [],
  },
])

// 获取字典数据
const getDictionary = () => {
  // 整体服务区
  getServiceAreaList().then(res => {
    console.log(res, 'res')
    if (res?.code == 200) {
      searchColumn.value[1].dataList = res.data?.records
    }
  })

  // 公司
  getCompany().then((res) => {
    searchColumn.value[0].dataList = res.data.records;
  });


  getDict({queriers: [{"alias": "rmtOperatorDictionary"}, {'alias': 'connectorLockStatusDictionary'}, {'alias': 'connectorParkStatusDictionary'}, {'alias': 'connectorStatusDictionary'}]}).then(res => {
    searchColumn.value[6].dataList = res?.data?.rmtOperatorDictionary?.map(item => {
      return {label: item?.name, value: item?.code}
    });
    searchColumn.value[12].dataList = res?.data?.connectorLockStatusDictionary?.map(item => {
      return {label: item?.name, value: item?.code}
    });
    searchColumn.value[13].dataList = res?.data?.connectorParkStatusDictionary?.map(item => {
      return {label: item?.name, value: item?.code}
    });
    searchColumn.value[11].dataList = res?.data?.connectorStatusDictionary?.map(item => {
      return {label: item?.name, value: item?.code}
    });
  })
};


//获取列表数据
const getData = async () => {
  loading.value = true;
  tableData.value = []
  const params = {
    index: page.value,
    size: pageSize.value,
    ...formData,
    operatorType: formData.operatorType?.map(item => item)?.join(',')
  };

  let res = await queryChargeEquipDynamicPageList(params);
  if (res.code == 200) {
    tableData.value = res.data.records;
    total.value = Number(res.data.total);
  }
  loading.value = false;
};

// 查询重置
const onReset = () => {
  Object.keys(formData).map((key) => {
    if(key === 'operatorType') {
      formData[key] = ['0', '1'];
    }else{
      formData[key] = null;
    }
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
  detailModalRef.value.renderInfo(data, columns, '充电设施动态信息')
};

const jgVisible = ref(false)
const jgData = ref({})

// 详情弹窗关闭
const aedClose = () => {
  aedVisible.value = false;
  jgData.value = {}
};
// 导出
const doExport = () => {
  const params = {
    ...formData,
    operatorType: formData.operatorType?.map(item => item)?.join(',')
  };
  exportData("/rmt/serviceAreaInfo/exportChargeEquipDynamic", "充电设施动态", params);
};


const tableHeight = ref()
const searchFormDom = useTemplateRef('searchRef')
onMounted(() => {
  getDictionary();
  getData();
  nextTick(() => {
    tableHeight.value = 63 + 32 + 71 + searchFormDom.value.offsetHeight + 52 + 50 + 42;
  })
});
</script>

<style lang="less" scoped>
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-button--primary.is-link {
    color: var(--el-color-primary);
  }
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
