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
          <Download/>
        </el-icon>
        <span>导出</span>
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" class="custom_table" ref="tableRef" @sort-change="handleSortChange" border
              :data="tableData" :max-height="`calc(100vh - ${tableHeight}px)`" style="width: 100%">
      <!--      <el-table-column type="selection" width="55"/>-->
      <el-table-column type="index" label="序号" width="80" align="center"/>
      <el-table-column prop="serviceAreaName" label="服务区名称" width="160" align="center"/>
      <el-table-column prop="serAreaCode" label="服务区编码" width="140" align="center"/>
      <el-table-column prop="stationId" label="充电站编号" width="160" align="center"/>
      <el-table-column prop="stationName" label="充电站名称" width="280" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleDetail(row)">{{ row?.stationName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="areaCode" label="充电站省市辖区编码" min-width="160" align="center"/>
      <el-table-column prop="province" label="所属地区(省)）" width="140" align="center"/>
      <el-table-column prop="address" label="详细地址" width="280" align="center"/>
      <el-table-column prop="lng" label="经度" width="140" align="center"/>
      <el-table-column prop="lat" label="纬度" width="140" align="center"/>
      <el-table-column prop="serviceTel" label="服务电话" width="140" align="center"/>
      <el-table-column prop="stationMode" label="站点模式" width="140" align="center"/>
      <el-table-column prop="stationType" label="站点类型" width="160" align="center"/>
      <el-table-column prop="stationStatus" label="站点状态" width="160" align="center"/>
      <el-table-column prop="operatorType" label="运营商类别" width="160" align="center"/>
      <el-table-column prop="operatorName" label="运营商名称" width="160" align="center"/>
      <el-table-column prop="syncTime" label="更新时间" min-width="140" align="center"/>
      <!--      <el-table-column fixed="right" label="操作" width="120">-->
      <!--        <template #default="scope">-->
      <!--          <el-button-->
      <!--              link-->
      <!--              type="primary"-->
      <!--              size="small"-->
      <!--              @click.prevent="handleDetail(scope.row)"-->
      <!--          >-->
      <!--            详情-->
      <!--          </el-button>-->
      <!--          <el-button-->
      <!--              link-->
      <!--              type="primary"-->
      <!--              size="small"-->
      <!--              @click.prevent="handleJgDetail(scope.row)"-->
      <!--          >-->
      <!--            价格策略-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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

    <!--    电价弹窗-->
<!--    <JgDialog ref="jgModalRef"-->
<!--              v-model="jgVisible"-->
<!--              @close="jgClose"-->
<!--    />-->
  </div>
</template>

<script setup>
import {nextTick, onMounted, reactive, ref, useTemplateRef} from "vue";
import DetailsDialog from "./components/details-dialog/index.vue";
// import JgDialog from "./components/jg-dialog/index.vue"
import {exportData} from "@/utils/common-features";
import {
  getDict,
} from "@/api/powerStation";
import {queryChargePageList} from "@/api/powerStation/chargePile"
import {getServiceAreaList} from "@/api/peopleFlowApi";

const detailModalRef = ref()
// const jgModalRef = ref()

const formData = reactive({
  operatorType: ["0", "1"]
});

const searchColumn = ref([
  {
    label: '服务区名称',
    field: 'serviceAreaName',
    type: 'select',
    labelWidth: '150px',
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
    label: '充电站省市辖区编码',
    field: 'areaCode',
    labelWidth: '150px',
    dataList: [],
  },
  {
    label: '所属地区（省）',
    field: 'province',
    dataList: [],
  },
  {
    label: '详细地址',
    field: 'address',
    dataList: [],
  },
  {
    label: '经度',
    field: 'lng',
    dataList: [],
  },
  {
    label: '纬度',
    field: 'lat',
    dataList: [],
    labelWidth: '150px',
  },
  {
    label: '站点模式',
    field: 'stationMode',
    type: 'select',
    dataList: [],
  },
  {
    label: '站点类型',
    field: 'stationType',
    type: 'select',
    dataList: [],
  },
  {
    label: '站点状态',
    field: 'stationStatus',
    type: 'select',
    dataList: [],
  },
  {
    label: '运营商类别',
    field: 'operatorType',
    type: 'checkbox',
    labelWidth: '150px',
    dataList: [],
  },
  {
    label: '运营商名称',
    field: 'operatorName',
    dataList: [],
  },
  {
    label: '更新时间',
    field: 'startTime',
    type: 'date-picker',
    shortcuts: [{
      text: '今天',
      value: new Date(),
    }],
    dataList: [],
  },
])


const tableRef = ref(null); //列表ref
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const aedData = ref({}); // 详情弹窗数据
const aedVisible = ref(false); // 详情弹窗显示
const loading = ref(false)

// 获取字典数据
const getDictionary = () => {
  // 整体服务区
  getServiceAreaList().then(res => {
    console.log(res, 'res')
    if (res?.code == 200) {
      searchColumn.value[0].dataList = res.data?.records
    }
  })

  getDict({queriers: [{"alias": "stationModeDictionary"}, {'alias': 'stationTypeDictionary'}, {'alias': 'rmtOperatorDictionary'}, {'alias': 'stationStatusDictionary'}]}).then(res => {
    console.log(res)
    searchColumn.value[11].dataList = res?.data?.stationStatusDictionary?.map(item => {
      return {label: item?.name, value: item?.code}
    });
    searchColumn.value[10].dataList = res?.data?.stationTypeDictionary?.map(item => {
      return {label: item?.name, value: item?.code}
    });
    searchColumn.value[9].dataList = res?.data?.stationModeDictionary?.map(item => {
      return {label: item?.name, value: item?.code}
    });
    searchColumn.value[12].dataList = res?.data?.rmtOperatorDictionary?.map(item => {
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
    operatorType: formData.operatorType?.map(item => item).join(',')
  };

  let res = await queryChargePageList(params);
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
  nextTick(() => {
    detailModalRef.value.getData(data)
  })
};

const jgVisible = ref(false)
const jgData = ref({})

// const handleJgDetail = (data) => {
//   jgVisible.value = true;
//   jgData.value = data ? data : {};
//   jgModalRef.value.getData(data)
// };

// 详情弹窗关闭
const aedClose = () => {
  aedVisible.value = false;
  jgData.value = {}
};
// 电价弹窗关闭
// const jgClose = () => {
//   jgVisible.value = false;
// };
// 导出
const doExport = () => {
  const params = {
    ...formData,
    operatorType: formData.operatorType?.map(item => item).join(',')
  };
  exportData("/rmt/serviceAreaInfo/exportCharge", "充电设施信息", params);
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
