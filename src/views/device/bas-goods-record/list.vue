<!-- 物资出入库 -->
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
          <el-form-item label="公司" class="form_item">
            <el-select
              v-model="formData.companyId"
              multiple
              filterable
              :reserve-keyword="false"
              placeholder="请选择公司"
              clearable
            >
              <el-option
                v-for="(item, index) in listOptions.companyList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="服务区" class="form_item">
            <el-select
              v-model="formData.serviceAreaId"
              multiple
              filterable
              :reserve-keyword="false"
              placeholder="请选择服务区"
              clearable
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
          <el-form-item label="物资类型" class="form_item">
            <el-select
              v-model="formData.type"
              multiple
              filterable
              :reserve-keyword="false"
              placeholder="请选择物资类型"
              clearable
            >
              <el-option
                v-for="(item, index) in listOptions.typeList"
                :key="index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出入库时间" class="form_item">
            <el-date-picker
              v-model="formData.checkTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物资名称" class="form_item">
            <el-input
              v-model="formData.name"
              placeholder="请输入物资名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出入库类型" class="form_item">
            <el-select
              v-model="formData.recordType"
              filterable
              :reserve-keyword="false"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in listOptions.checkNumOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6"/>
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
      <el-button type="primary" @click="doExport()">
        <el-icon>
          <Download/>
        </el-icon>
        <span>导出</span>
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
      <el-table-column type="index" label="序号" width="80" align="center"/>
      <el-table-column
        prop="companyName"
        label="公司"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="serviceAreaName"
        label="服务区"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="goodsType"
        label="物资类型"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="name"
        label="物资名称"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="num"
        label="数量"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="type"
        label="出入库类型"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ listOptions.checkNumOptions.find((item) => item.value === row.type)?.label }}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="creatorName"
        label="入库人"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createTime"
        label="出入库时间"
        align="center"
        show-overflow-tooltip
      />
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
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from "vue";
import {getServiceArea, getCompany} from "@/api/device/deviceApi";
import {queryNormalOptions} from "@/api/dictionaryApi.js";
import {basGoodsRecordListPostApi} from "@/api/device/basGoodsRecordApi";
import {exportData} from "@/utils/common-features";

/* 筛选表单数据start */
const formData = reactive({
  serviceAreaId: [], // 服务区
  companyId: [], // 公司
  type: [], // 物资类型
  name: '', // 物资名称
  recordType: '', // 出入库类型
  checkTime: [], // 出入库时间
});
const listOptions = reactive({
  serviceAreaList: [],
  companyList: [],
  typeList: [],
  checkNumOptions: [
    {label: '入库', value: 'IN'},
    {label: '出库', value: 'OUT'},
  ],
});

/* 列表相关start */
const tableRef = ref(null); //列表ref
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
// 获取字典数据
function getDictionary() {
  // 获取服务区
  getServiceArea()
    .then(({code, data}) => {
      if (code == '200') {
        listOptions.serviceAreaList = data.records;
        console.log(data)
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // 获取公司下拉
  getCompany().then(({data}) => {
    listOptions.companyList = data.records;
  });
  // 获取物资类型
  queryNormalOptions({
    queriers: [{alias: "sysGoodsTypeDictionary", param: null}],
  }).then(({data}) => {
    listOptions.typeList = data.sysGoodsTypeDictionary;
  });
}

//获取列表数据
const getData = async () => {
  const {data} = await basGoodsRecordListPostApi({
    index: page.value,
    size: pageSize.value,
    companyId: formData.companyId.join(',') || '',
    serviceAreaId: formData.serviceAreaId.join(',') || '',
    type: formData.type.join(',') || '',
    name: formData.name || '',
    recordType: formData.recordType || '',
    startTime: formData.checkTime ? formData.checkTime[0] : '',
    endTime: formData.checkTime ? formData.checkTime[1] : '',
  })
  if (data !== null && data.records.length > 0) {
    tableData.value = data.records
    total.value = Number(data.total)
  } else {
    tableData.value = []
    total.value = 0
  }
}

// 查询重置
function onReset() {
  formData.serviceAreaId = []
  formData.companyId = []
  formData.type = []
  formData.name = ''
  formData.recordType = ''
  formData.checkTime = []
  page.value = 1;
  pageSize.value = 10;
  getData();
}

// 列表分页-当前页改变
function handleCurrentChange(val) {
  page.value = val;
  getData();
}

// 列表分页-每页显示条数改变
function handleSizeChange(val) {
  pageSize.value = val;
  getData();
}

function doExport() {
  // 构建请求参数
  const params = {
    companyId: formData.companyId.join(',') || '',
    serviceAreaId: formData.serviceAreaId.join(',') || '',
    type: formData.type.join(',') || '',
    name: formData.name || '',
    recordType: formData.recordType || '',
    startTime: formData.checkTime ? formData.checkTime[0] : '',
    endTime: formData.checkTime ? formData.checkTime[1] : '',
  };
  
  exportData("/device/basGoodsRecord/export", "物资出入库记录报表", params);
}

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
