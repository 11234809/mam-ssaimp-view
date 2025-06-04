<template>
  <div class="this_page">
    <!-- 筛选项 -->
    <div ref="searchRef">
      <el-form inline :model="formData" class="custom_form" label-width="130px" label-position="right" label-suffix=":">
        <el-row :gutter="30">
          <el-col :span="6" v-for="cItem in  searchColumn" :key="cItem?.label">
            <el-form-item :label="cItem?.label" class="form_item">
              <template v-if="cItem?.type ==='select'">
                <el-select collapse-tags collapse-tags-tooltip v-model="formData[cItem?.field]"
                           :multiple="cItem?.multiple" filterable
                           :placeholder="`请选择${cItem?.label}`" clearable>
                  <el-option v-for="(item, index) in cItem?.dataList" :key="index" :label="item?.label"
                             :value="item?.value"/>
                </el-select>
              </template>
              <template v-else>
                <el-input v-model="formData[cItem?.field]" clearable :placeholder="`请输入${cItem?.label}`"></el-input>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="18">
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
      <el-table-column prop="name" label="服务区名称" min-width="140" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleDetail(row)">{{ row?.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="serialNo" label="服务区编码" width="140" align="center"/>
      <el-table-column prop="serviceType" label="服务区类型" min-width="140" align="center"/>
      <el-table-column prop="areaCode" label="行政区划代码" min-width="140" align="center"/>
      <el-table-column prop="province" label="所属地区（省）" min-width="140" align="center"/>
      <el-table-column prop="city" label="所属地区（市）" width="120" align="center"/>
      <el-table-column prop="district" label="所属地区（区县）" width="140" align="center"/>
      <el-table-column prop="roadType" label="公路类型" width="160" align="center"/>
      <el-table-column prop="routeCode" width="140" label="所在路线编号" align="center"/>
      <el-table-column prop="routeName" width="160" label="所在路线名称" align="center"/>
      <el-table-column prop="dir" width="160" label="方向" align="center"/>
      <el-table-column prop="lon" label="经度" width="140" align="center"/>
      <el-table-column prop="lat" label="纬度" width="140" align="center"/>
      <el-table-column prop="managementUnit" label="经营管理单位名称" width="140" align="center"/>
      <el-table-column prop="managementUnitNature" label="经营管理单位性质" width="140" align="center"/>
      <el-table-column prop="whetherOpenAllDay" label="是否二十四小时开放" width="160" align="center"/>
      <el-table-column prop="syncTime" label="更新时间" width="120" align="center"/>
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
import {
  getDict,
} from "@/api/powerStation";
import {queryServicePageList,getAllServiceArea,getServiceArea} from "@/api/powerStation/chargePile"

const detailModalRef = ref()

const formData = reactive({});

const columns = [
  {
    label: '服务区名称',
    key: 'name'
  },
  {
    label: '服务区编码',
    key: 'serialNo'
  },
  {
    label: '服务区类型',
    key: 'serviceType'
  },
  {
    label: '行政区划代码',
    key: 'areaCode'
  },
  {
    label: '所属地区（省）',
    key: 'province'
  },
  {
    label: '所属地区（市）',
    key: 'city'
  },
  {
    label: '所属地区（区县）',
    key: 'district'
  },
  {
    label: '公路类型',
    key: 'roadType'
  },
  {
    label: '所在路线编号',
    key: 'routeCode'
  },
  {
    label: '所在路线名称',
    key: 'routeName'
  },
  {
    label: '方向',
    key: 'dir'
  },
  {
    label: '经度',
    key: 'lon'
  },
  {
    label: '维度',
    key: 'lat'
  },
  {
    label: '经营管理单位名称',
    key: 'managementUnit'
  },
  {
    label: '经营管理单位性质',
    key: 'managementUnitNature'
  },
  {
    label: '填报单位ID',
    key: 'departmentId'
  },
  {
    label: '填报单位名称',
    key: 'departmentName'
  },
  {
    label: '填报人',
    key: 'createBy'
  },
  {
    label: '服务区联系电话',
    key: 'tel'
  },
  {
    label: '是否二十四小时开放',
    key: 'whetherOpenAllDay'
  },
  {
    label: '更新时间',
    key: 'syncTime'
  },
  {
    label: '平台中服务区名称',
    key: 'basName'
  },
]

const searchColumn = ref([
  {
    label: '服务区名称',
    field: 'serviceAreaName',
    type: 'select',
    dataList: [],
  },
  {
    label: '服务区编码',
    field: 'serialNo',
    dataList: [],
  },
  {
    label: '服务区类型',
    field: 'serviceType',
    type: 'select',
    dataList: [],
  },
  {
    label: '行政区划代码',
    field: 'areaCode',
    dataList: [],
  },
  {
    label: '所属地区（省）',
    field: 'province',
    dataList: [],
  },
  {
    label: '所属地区（市）',
    field: 'city',
    dataList: [],
  },
  {
    label: '所属地区（区县）',
    field: 'district',
    dataList: [],
  },
  {
    label: '公路类型',
    field: 'roadType',
    type: 'select',
    dataList: [],
  },
  {
    label: '所在路线编号',
    field: 'routeCode',
    dataList: [],
  },
  {
    label: '所在路线名称',
    field: 'routeName',
    dataList: [],
  },
  {
    label: '方向',
    field: 'dir',
    type: 'select',
    dataList: [],
  },
  {
    label: '经度',
    field: 'lon',
    dataList: [],
  },
  {
    label: '纬度',
    field: 'lat',
    dataList: [],
  },
  {
    label: '经营管理单位名称',
    field: 'managementUnit',
    dataList: [],
  },
  {
    label: '经营管理单位性质',
    field: 'managementUnitNature',
    type: 'select',
    dataList: [],
  },
  {
    label: '是否24小时开放',
    field: 'whetherOpenAllDay',
    type: 'select',
    dataList: [],
  },
  {
    label: '平台中服务区名称',
    field: 'basServiceAreaName',
    type: 'select',
    dataList: [],
  },
])


const tableRef = ref(null); //列表ref
const tableData = ref([
  {id: 1, name: '测试服务区'}, {id: 2, name: '测试服务区'}
]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const aedData = ref({}); // 详情弹窗数据
const aedVisible = ref(false); // 详情弹窗显示
const loading = ref(false)

// 获取字典数据
const getDictionary = () => {
  // 整体服务区
  getAllServiceArea().then(res => {
    console.log(res, 'res')
    if (res?.code == 200) {
      searchColumn.value[0].dataList = res.data?.records
    }
  })
  // 平台中服务区名称
  getServiceArea()
      .then(({code, data}) => {
        if (code == 200) {
          searchColumn.value[16].dataList = data.records?.map(item => {
            return {label: item?.label, value: item?.label}
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });

  getDict({queriers: [{"alias": "rmtDirDictionary"}, {'alias': 'rmtRoadTypeDictionary'}, {'alias': 'rmtManagementUnitNatureDictionary'}, {'alias': 'basAreaInfoPublicDictionary'}, {'alias': 'rmtServiceTypeDictionary'}]}).then(res => {
    console.log(res)
    searchColumn.value[2].dataList = res?.data?.rmtServiceTypeDictionary?.map(item => {
      return {label: item?.name, value: item?.code}
    });
    searchColumn.value[7].dataList = res?.data?.rmtRoadTypeDictionary?.map(item => {
      return {label: item?.name, value: item?.code}
    });
    searchColumn.value[10].dataList = res?.data?.rmtDirDictionary?.map(item => {
      return {label: item?.name, value: item?.code}
    });

    searchColumn.value[14].dataList = res?.data?.rmtManagementUnitNatureDictionary?.map(item => {
      return {label: item?.name, value: item?.code}
    });
    searchColumn.value[15].dataList = res?.data?.basAreaInfoPublicDictionary?.map(item => {
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
  };

  let res = await queryServicePageList(params);
  if (res.code == 200) {
    tableData.value = res.data.records;
    total.value = Number(res.data.total);
  }
  loading.value = false;
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
  nextTick(() => {
    detailModalRef.value.renderInfo(data, columns)
  })
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
  };
  exportData("/rmt/serviceAreaInfo/exportService", "服务区基础信息", params);
};


const tableHeight = ref()
const searchFormDom = useTemplateRef('searchRef')
onMounted(() => {
  getDictionary();
  getData();
  nextTick(() => {
    // 动态 设置表格高度，使页面 不会滚动
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
