<template>
  <div class="this_page">
    <!-- 筛选项 -->
    <el-form inline :model="formData" class="custom_form" label-width="120px" label-position="right"
             label-suffix=":">
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="公司" class="form_item">
            <el-select collapse-tags collapse-tags-tooltip v-model="formData.companyIdList" multiple filterable
                       placeholder="请选择公司" clearable
                       :reserve-keyword="false">
              <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="服务区" class="form_item">
            <el-select collapse-tags collapse-tags-tooltip v-model="formData.serviceAreaIdList" multiple
                       filterable placeholder="请选择服务区" clearable
                       :reserve-keyword="false">
              <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检查时间" class="form_item">
            <el-date-picker value-format="YYYY-MM-DD" v-model="formData.checkTime" type="daterange"
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检查类型" class="form_item">
            <el-select collapse-tags collapse-tags-tooltip v-model="formData.checkTypeList" multiple filterable
                       placeholder="请选择检查类型" clearable
                       :reserve-keyword="false">
              <el-option v-for="(item, index) in checkTypeList" :key="index" :label="item.name"
                         :value="item.code"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检查方式" class="form_item">
            <el-select collapse-tags collapse-tags-tooltip v-model="formData.checkWayList" multiple
                       filterable placeholder="请选择检查方式" clearable
                       :reserve-keyword="false">
              <el-option v-for="(item, index) in checkMethodList" :key="index" :label="item.name"
                         :value="item.code"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检查层级" class="form_item">
            <el-select collapse-tags collapse-tags-tooltip v-model="formData.checkLevelList" multiple filterable
                       placeholder="请选择检查层级" clearable
                       :reserve-keyword="false">
              <el-option v-for="(item, index) in checkLevelList" :key="index" :label="item.name"
                         :value="item.code"/>
            </el-select>
          </el-form-item>
        </el-col>
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
      <el-button v-if="isAuth('add')" type="primary" @click="handleDetail(1)">
        <span>新增</span>
      </el-button>
      <el-button type="primary" @click="handleExcel(false)">
        <span>导出</span>
      </el-button>
      <el-button type="primary" @click="handleExcel(true)">
        <span>带图导出</span>
      </el-button>
    </div>
    <div style="height: 20px"></div>
    <!-- 列表 -->
    <el-table class="custom_table" ref="tableRef" border :data="tableData" @selection-change="selectionChange"
              style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center"/>
      <el-table-column prop="companyText" label="公司" align="center" min-width="130" show-overflow-tooltip/>
      <el-table-column prop="serviceAreaText" label="服务区" align="center" min-width="130" show-overflow-tooltip/>
      <el-table-column prop="checkUserName" label="检查人" align="center" width="100" show-overflow-tooltip/>
      <el-table-column prop="checkTypeText" label="检查类型" align="center" width="100" show-overflow-tooltip/>
      <el-table-column prop="checkWayText" label="检查方式" align="center" width="100" show-overflow-tooltip/>
      <el-table-column prop="checkLevelText" label="检查层级" align="center" width="100" show-overflow-tooltip/>
      <el-table-column prop="checkTime" label="检查时间" align="center" width="130" show-overflow-tooltip/>
      <el-table-column prop="checkItem1Result" label="公共卫生间" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.checkItem1HasContent"
               style="color:blue;cursor:pointer" @click="openRemarkPopup(scope.row.entityId, 1)">
            {{ Number(scope.row.checkItem1Result) > 0 ? Number(scope.row.checkItem1Result) : 0  }}
          </div>
          <div v-else>
            {{ Number(scope.row.checkItem1Result) > 0 ? Number(scope.row.checkItem1Result) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem2Result" label="公共场区" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.checkItem2HasContent"
               style="color:blue;cursor:pointer" @click="openRemarkPopup(scope.row.entityId, 2)">
            {{ Number(scope.row.checkItem2Result) > 0 ? Number(scope.row.checkItem2Result) : 0 }}
          </div>
          <div v-else>
            {{ Number(scope.row.checkItem2Result) > 0 ? Number(scope.row.checkItem2Result) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem3Result" label="餐饮服务" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.checkItem3HasContent"
               style="color:blue;cursor:pointer" @click="openRemarkPopup(scope.row.entityId, 3)">
            {{ Number(scope.row.checkItem3Result) > 0 ? Number(scope.row.checkItem3Result) : 0 }}
          </div>
          <div v-else>
            {{ Number(scope.row.checkItem3Result) > 0 ? Number(scope.row.checkItem3Result) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem4Result" label="零售服务" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.checkItem4HasContent"
               style="color:blue;cursor:pointer" @click="openRemarkPopup(scope.row.entityId, 4)">
            {{ Number(scope.row.checkItem4Result) > 0 ? Number(scope.row.checkItem4Result) : 0 }}
          </div>
          <div v-else>
            {{ Number(scope.row.checkItem4Result) > 0 ? Number(scope.row.checkItem4Result) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem5Result" label="汽车服务" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.checkItem5HasContent"
               style="color:blue;cursor:pointer" @click="openRemarkPopup(scope.row.entityId, 5)">
            {{ Number(scope.row.checkItem5Result) > 0 ? Number(scope.row.checkItem5Result) : 0 }}
          </div>
          <div v-else>
            {{ Number(scope.row.checkItem5Result) > 0 ? Number(scope.row.checkItem5Result) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem6Result" label="人性化服务" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.checkItem6HasContent"
               style="color:blue;cursor:pointer" @click="openRemarkPopup(scope.row.entityId, 6)">
            {{ Number(scope.row.checkItem6Result) > 0 ? Number(scope.row.checkItem6Result) : 0 }}
          </div>
          <div v-else>
            {{ Number(scope.row.checkItem6Result) > 0 ? Number(scope.row.checkItem6Result) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem7Result" label="信息化服务" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.checkItem7HasContent"
               style="color:blue;cursor:pointer" @click="openRemarkPopup(scope.row.entityId, 7)">
            {{ Number(scope.row.checkItem7Result) > 0 ? Number(scope.row.checkItem7Result) : 0 }}
          </div>
          <div v-else>
            {{ Number(scope.row.checkItem7Result) > 0 ? Number(scope.row.checkItem7Result) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem8Result" label="应急保障" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.checkItem8HasContent"
               style="color:blue;cursor:pointer" @click="openRemarkPopup(scope.row.entityId, 8)">
            {{ Number(scope.row.checkItem8Result) > 0 ? Number(scope.row.checkItem8Result) : 0 }}
          </div>
          <div v-else>
            {{ Number(scope.row.checkItem8Result) > 0 ? Number(scope.row.checkItem8Result) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem9Result" label="生态环保" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.checkItem9HasContent"
               style="color:blue;cursor:pointer" @click="openRemarkPopup(scope.row.entityId, 9)">
            {{ Number(scope.row.checkItem9Result) > 0 ? Number(scope.row.checkItem9Result) : 0 }}
          </div>
          <div v-else>
            {{ Number(scope.row.checkItem9Result) > 0 ? Number(scope.row.checkItem9Result) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem10Result" label="拓展服务" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.checkItem10HasContent"
               style="color:blue;cursor:pointer" @click="openRemarkPopup(scope.row.entityId, 10)">
            {{ Number(scope.row.checkItem10Result) > 0 ? Number(scope.row.checkItem10Result) : 0 }}
          </div>
          <div v-else>
            {{ Number(scope.row.checkItem10Result) > 0 ? Number(scope.row.checkItem10Result) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem11Result" label="投诉与监督" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.checkItem11HasContent"
               style="color:blue;cursor:pointer" @click="openRemarkPopup(scope.row.entityId, 11)">
            {{ Number(scope.row.checkItem11Result) > 0 ? Number(scope.row.checkItem11Result) : 0 }}
          </div>
          <div v-else>
            {{ Number(scope.row.checkItem11Result) > 0 ? Number(scope.row.checkItem11Result) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checkTotal" label="扣分总计" align="center" width="100" show-overflow-tooltip/>
      <el-table-column label="操作" align="center" width="140" fixed="right">
        <template #default="scope">
          <div class="action_sheet">
<!--            <el-button type="primary" size="small" link-->
<!--                       @click="handleDetail(3, scope.row.entityId)">-->
<!--              查看-->
<!--            </el-button>-->
            <el-button v-if="isAuth('edit')" type="primary" size="small" link
                       @click="handleDetail(2, scope.row.entityId)">
              编辑
            </el-button>
            <el-button v-if="isAuth('del')" type="primary" size="small" link
                       @click="delData(scope.row.entityId)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
      <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
                     layout="total,  prev, pager, next,sizes, jumper" :total="total" @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"/>
    </div>
    
    <!-- 新增/编辑/详情弹窗 -->
    <AddEditDetail
      v-if="aedVisible"
      :visible="aedVisible"
      :type="aedType"
      :id="dialogInfoId"
      @dialogClose="aedClose"
      :serviceAreaList="serviceAreaList"
      :checkTypeList="checkTypeList"
      :checkLevelList="checkLevelList"
      :checkWayList="checkMethodList"
    />
    
    <RemarkDialog
      v-if="remarkDialogVisiable"
      :visible="remarkDialogVisiable"
      :datas="remarkDialogData"
      :isDisabled="true"
      @dialogClose="remarkDialogClose"/>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted} from "vue";
import AddEditDetail from "./add-edit-detail";
import {getServiceArea, queryNormalOptions} from "@/api/dictionaryApi.js";
import {getCompany} from '@/api/informationServiceAreaApi.js';
import RemarkDialog from './remarkForAdd.vue';
import {
  deleteServiceQualityInfoApi,
  getServiceQualityApi,
  getServiceQualityTypeInfoApi
} from "@/api/daily/serviceQualityApi";
import {isAuth} from "@/utils/authorization";
import {ElMessage, ElMessageBox} from "element-plus";
import {exportData} from "@/utils/common-features";
import moment from 'moment'

/* 筛选表单数据start */
const formData = reactive({
  companyIdList: [],
  serviceAreaIdList: [],
  checkTime: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
  checkTypeList: [],
  checkLevelList: [],
  checkWayList: [],
});

/* 列表相关start */
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const serviceAreaList = ref([]); // 服务区域列表
const companyList = ref([]); // 公司列表
const checkTypeList = ref([]); // 检查类型列表
const checkMethodList = ref([]); // 检查方式列表
const checkLevelList = ref([]); // 检查层级列表
const dialogInfoId = ref(null);
const remarkDialogVisiable = ref(false);
const remarkDialogData = ref({});

//获取列表数据
const getData = async () => {
  const params = {
    index: page.value,
    size: pageSize.value,
    companyIdList: formData.companyIdList,
    serviceAreaIdList: formData.serviceAreaIdList,
    startCheckTime: formData.checkTime ? formData.checkTime[0] : '',
    endCheckTime: formData.checkTime ? formData.checkTime[1] : '',
    checkTypeList: formData.checkTypeList,
    checkLevelList: formData.checkLevelList,
    checkWayList: formData.checkWayList,
  }
  let {data} = await getServiceQualityApi(params);
  tableData.value = data.records
  total.value = Number(data.total)
}

const delData = (id) => {
  ElMessageBox.confirm("是否确认删除?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const resData = await deleteServiceQualityInfoApi(id)
    if (resData.code == '200') {
      ElMessage({
        message: resData.data.message,
        type: 'success',
      });
      getData()
    } else {
      ElMessage({
        message: resData.message || resData.data.message,
        type: 'error',
      })
    }
  })
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
      {alias: 'serviceQualityCheckLevelDictionary', param: null},
      {alias: 'serviceQualityCheckTypeDictionary', param: null},
      {alias: 'serviceQualityCheckWayDictionary', param: null}
    ],
  }).then((res) => {
    checkLevelList.value = res.data.serviceQualityCheckLevelDictionary;
    checkTypeList.value = res.data.serviceQualityCheckTypeDictionary;
    checkMethodList.value = res.data.serviceQualityCheckWayDictionary;
  });
}

// 查询重置
function onReset() {
  formData.companyIdList = []
  formData.serviceAreaIdList = []
  formData.checkTime = []
  formData.checkTypeList = []
  formData.checkLevelList = []
  formData.checkWayList = []
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

// 列表新增/编辑/详情 1 - 新增 2 - 编辑 3 - 详情
function handleDetail(type, id) {
  dialogInfoId.value = id
  aedType.value = type;
  aedVisible.value = true;
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

const handleExcel = (exportPic) => {
  // 构建请求参数
  const params = {
    companyIdList: formData.companyIdList,
    serviceAreaIdList: formData.serviceAreaIdList,
    startCheckTime: formData.checkTime ? formData.checkTime[0] : '',
    endCheckTime: formData.checkTime ? formData.checkTime[1] : '',
    checkTypeList: formData.checkTypeList,
    checkLevelList: formData.checkLevelList,
    checkWayList: formData.checkWayList,
    size: exportPic?pageSize.value:-1,
    index:exportPic?page.value: null,
    exportPic:exportPic
  }
  
  exportData("/daily/serviceQuality/exportXls", "服务质量监督报表", params);
}


const openRemarkPopup = async (id, type) => {
  remarkDialogData.value = {}
  const { data } = await getServiceQualityTypeInfoApi(id, type)
  remarkDialogData.value = data
  remarkDialogVisiable.value = true
}
const remarkDialogClose = () => {
  remarkDialogVisiable.value = false
  remarkDialogData.value = {}
}

onMounted(() => {
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
  
  :deep(.custom_table) {
    margin-bottom: 20px;
    
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
