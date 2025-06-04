<!-- 设备维修 -->
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
              v-model="formData.serviceAreaId"
              multiple
              filterable
              :reserve-keyword="false"
              placeholder="请选择"
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
          <el-form-item label="故障时间" class="form_item">
            <el-date-picker
              style="width: 100%"
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
          <el-form-item label="设备名称" class="form_item">
            <el-input
              v-model="formData.deviceName"
              placeholder="请输入设备名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="修复状态" class="form_item">
            <el-select
              v-model="formData.deviceStatus"
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
          <el-form-item label="修复时间" class="form_item">
            <el-date-picker
              style="width: 100%"
              v-model="formData.modTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6"></el-col>
        <el-col :span="6"></el-col>
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
      table-layout="auto"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="80" align="center"/>
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
        label="所属系统"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="type"
        label="设备分类"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="failureTime"
        label="故障时间"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="creatorName"
        label="故障上报人"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="statusText"
        label="修复状态"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="修复时间"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{row}">
          <span v-if="row.status === '2'">{{ row.modifyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修复人"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{row}">
          <span v-if="row.status === '2'">{{ row.updaterName }}</span>
        </template>
      </el-table-column>
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
import {ref, reactive, onMounted, defineModel} from "vue";
import DetailDialog from "./detail-dialog";
import {getServiceArea} from "@/api/dictionaryApi.js";
import {basRepairListPostApi} from "@/api/device/basRepairAPI";
import {exportData} from "@/utils/common-features";

/* 筛选表单数据start */
const formData = reactive({
  serviceAreaId: [], // 服务区id
  checkTime: [], // 巡检时间
  deviceName: null, // 设备名称
  deviceStatus: null, // 设备状态
  modTime: [], // 测试时间
});
const listOptions = reactive({
  serviceAreaList: [],
  statusList: [
    {label: "未修复", value: 1},
    {label: "已修复", value: 2},
  ],
});
/* 列表相关start */
const tableRef = ref(null); //列表ref
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
/* 详情弹窗相关start */
const aedData = ref(null); // 详情弹窗数据
const aedVisible = ref(false); // 详情弹窗显示

// 获取字典数据
function getDictionary() {
  // 获取服务区
  getServiceArea()
    .then(({code, data}) => {
      if (code == '200') {
        listOptions.serviceAreaList = data.records;
      }
    })
}

//获取列表数据
const getData = async () => {
  const {data} = await basRepairListPostApi({
    index: page.value,
    size: pageSize.value,
    serviceAreaId: formData.serviceAreaId.join(',') || '', // 服务区id
    startTime: formData.checkTime ? formData.checkTime[0] : '',
    endTime: formData.checkTime ? formData.checkTime[1] : '',
    name: formData.deviceName, // 设备名称
    status: formData.deviceStatus, // 设备状态
    modSTime: formData.modTime ? formData.modTime[0] : '', // 测试时间
    modETime: formData.modTime ? formData.modTime[1] : '', // 测试时间
  })
  if (data !== null && data.records.length > 0) {
    tableData.value = data.records
    total.value = Number(data.total)
  }
}

// 查询重置
function onReset() {
  formData.serviceAreaId = []
  formData.checkTime = []
  formData.deviceName = null
  formData.deviceStatus = null
  formData.modTime = []
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

// 列表详情
function handleDetail(data) {
  aedVisible.value = true;
  aedData.value = data ? data : {};
}

// 详情弹窗关闭
function aedClose() {
  aedVisible.value = false;
}

// 导出
const doExport = (imgFlag) => {
  // 构建请求参数
  const params = {
    serviceAreaId: formData.serviceAreaId.join(',') || '', // 服务区id
    startTime: formData.checkTime ? formData.checkTime[0] : '',
    endTime: formData.checkTime ? formData.checkTime[1] : '',
    name: formData.deviceName, // 设备名称
    status: formData.deviceStatus, // 设备状态
    modSTime: formData.modTime ? formData.modTime[0] : '', // 测试时间
    modETime: formData.modTime ? formData.modTime[1] : '', // 测试时间
    index: imgFlag?page.value:-1,
    size: imgFlag?pageSize.value:-1,
    imgFlag
  };
  
  exportData("/device/basRepair/export", "设备维修报表", params);
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
