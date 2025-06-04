<!-- 服务质量监督报表 -->
<template>
  <div class="this_page">
    <!-- 筛选项 -->
    <el-form inline :model="formData" class="custom_form" label-width="100px" label-position="right"
             label-suffix=":">
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="公司" class="form_item">
            <el-select
              v-model="formData.companyIdList"
              placeholder="请选择公司"
              clearable
              collapse-tags
              collapse-tags-tooltip
              multiple
              filterable
              :reserve-keyword="false"
            >
              <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="服务区" class="form_item">
            <el-select
              v-model="formData.serviceAreaIdList"
              placeholder="请选择服务区"
              clearable
              collapse-tags
              collapse-tags-tooltip
              multiple
              filterable
              :reserve-keyword="false"
            >
              <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="服务区类型" class="form_item">
            <el-select
              v-model="formData.sideList"
              placeholder="请选择服务区类型"
              clearable
              multiple
              filterable
              :reserve-keyword="false"
            >
              <el-option v-for="(item, index) in serviceAreaTypeList" :key="index" :label="item.name"
                         :value="item.code"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检查时间" class="form_item">
            <el-date-picker
              v-model="formData.checkTime"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6"></el-col>
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
      <el-button type="primary" @click="doExport">
        <el-icon>
          <Download/>
        </el-icon>
        <span>导出</span>
      </el-button>
    </div>
    <el-table class="custom_table" ref="tableRef" border :data="tableData" @selection-change="selectionChange"
              style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="company" label="公司" align="center" min-width="120" show-overflow-tooltip/>
      <el-table-column prop="serviceAreaName" label="服务区" align="center" min-width="120" show-overflow-tooltip/>
      <el-table-column prop="checkTime" label="检查时间" align="center" width="190" show-overflow-tooltip/>
      <el-table-column prop="checkItem1Result" label="公共卫生间" align="center" width="110" show-overflow-tooltip/>
      <el-table-column prop="checkItem2Result" label="公共场所" align="center" width="110" show-overflow-tooltip/>
      <el-table-column prop="checkItem3Result" label="餐饮服务" align="center" width="110" show-overflow-tooltip/>
      <el-table-column prop="checkItem4Result" label="零售服务" align="center" width="110" show-overflow-tooltip/>
      <el-table-column prop="checkItem5Result" label="汽车服务" align="center" width="110" show-overflow-tooltip/>
      <el-table-column prop="checkItem6Result" label="人性化服务" align="center" width="110" show-overflow-tooltip/>
      <el-table-column prop="checkItem7Result" label="信息化服务" align="center" width="110" show-overflow-tooltip/>
      <el-table-column prop="checkItem8Result" label="应急保障" align="center" width="110" show-overflow-tooltip/>
      <el-table-column prop="checkItem9Result" label="生态环保" align="center" width="110" show-overflow-tooltip/>
      <el-table-column prop="checkItem10Result" label="扩展服务" align="center" width="110" show-overflow-tooltip/>
      <el-table-column prop="checkItem11Result" label="投诉与监督" align="center" width="110" show-overflow-tooltip/>
      <el-table-column prop="checkTotal" label="扣分合计" width="110" align="center" show-overflow-tooltip/>
    </el-table>
    <div class="pagination_box">
      <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
                     layout="total,  prev, pager, next,sizes, jumper" :total="total" @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from "vue";
import {getServiceArea, queryNormalOptions} from "@/api/dictionaryApi";
import {getCompany} from "@/api/informationServiceAreaApi";
import {getServeQualityApi} from "@/api/statisticalForm/serveQuality";
import {exportData} from "@/utils/common-features";

/* 筛选表单数据start */
const formData = reactive({
  companyIdList: [],
  serviceAreaIdList: [],
  sideList: [],
  checkTime: [],
});
/* 筛选表单数据end */

/* 列表相关start */
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const serviceAreaList = ref([]); // 服务区域列表
const companyList = ref([]); // 公司列表
const serviceAreaTypeList = ref([]); // 服务区域类型列表

//获取列表数据
const getData = async () => {
  const params = {
    index: page.value,
    size: pageSize.value,
    companyIdList: formData.companyIdList,
    serviceAreaIdList: formData.serviceAreaIdList,
    sideList: formData.sideList,
    beginCheckTime: formData.checkTime ? formData.checkTime[0] : '',
    endCheckTime: formData.checkTime ? formData.checkTime[1] : '',
  }
  const { data } = await getServeQualityApi(params)
  tableData.value = data.records
  total.value = Number(data.total)
}

// 查询重置
const onReset = () => {
  formData.companyIdList = []
  formData.serviceAreaIdList = []
  formData.sideList = []
  formData.checkTime = getLast30Days()  // 默认显示最近30天
  page.value = 1;
  pageSize.value = 10;
  getData();
}

const getLast30Days = () => {
  const currentDate = new Date();
  // 获取结束时间，即当前日期
  const endDate = currentDate;
  const endYear = endDate.getFullYear();
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
  const endDay = String(endDate.getDate()).padStart(2, '0');
  const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;
  
  // 获取开始时间，即当前日期往前推 30 天
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - 29);
  const startYear = startDate.getFullYear();
  const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
  const startDay = String(startDate.getDate()).padStart(2, '0');
  const formattedStartDate = `${startYear}-${startMonth}-${startDay}`;
  
  return [formattedStartDate, formattedEndDate]
}

// 列表分页-当前页改变
const handleCurrentChange = (val) => {
  page.value = val;
  getData();
}
// 列表分页-每页显示条数改变
const handleSizeChange = (val) => {
  pageSize.value = val;
  getData();
}

const getDictionary = () => {
  getServiceArea().then(res => {
    serviceAreaList.value = res.data.records;
  });
  getCompany().then((res) => {
    companyList.value = res.data.records;
  })
  
  queryNormalOptions({
    queriers: [
      {alias: 'basAreaInfoDireDictionary', param: null},
    ]
  }).then(res => {
    serviceAreaTypeList.value = res.data.basAreaInfoDireDictionary;
  })
}

const doExport = () => {
  // 构建请求参数
  const params = {
    companyIdList: formData.companyIdList,
    serviceAreaIdList: formData.serviceAreaIdList,
    sideList: formData.sideList,
    beginCheckTime: formData.checkTime ? formData.checkTime[0] : '',
    endCheckTime: formData.checkTime ? formData.checkTime[1] : '',
    size: -1
  }
  
  exportData("/statisticalForm/serveQuality/exportXls", "服务质量监督统计报表", params);
}

onMounted(() => {
  formData.checkTime = getLast30Days()  // 默认显示最近30天
  getDictionary()
  getData()
})
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
        content: '';
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

.func_btn_box {
  margin-bottom: 20px;
}
</style>
