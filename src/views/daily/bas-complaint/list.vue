<!-- 投诉管理 -->

<template>
  <div class="staff-list_page" id="staff-list">
    <!-- 筛选项 -->
    <el-form
      inline
      :model="formData"
      class="custom_form"
      label-width="130px"
      label-position="right"
      label-suffix=":"
    >
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="公司" class="form_item">
            <el-select
              v-model="formData.companyIdList"
              placeholder="请选择公司"
              clearable
              filterable
              multiple
            >
              <el-option
                v-for="item in listOptions.companyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="服务区" class="form_item">
            <el-select
              v-model="formData.serviceAreaIdList"
              placeholder="请选择服务区"
              clearable
              filterable
              multiple
            >
              <el-option
                v-for="item in listOptions.serviceAreaList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="投诉主题" class="form_item">
            <el-input v-model="formData.title" placeholder="请输入投诉主题" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="投诉人" class="form_item">
            <el-input v-model="formData.comBy" placeholder="请输入投诉人" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="投诉时间" class="form_item">
            <el-date-picker
              style="width: 100%"
              v-model="formData.comTime"
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
          <el-form-item label="填写人" class="form_item">
            <el-input v-model="formData.creatorName" placeholder="请输入填写人" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="填写时间" class="form_item">
            <el-date-picker
              style="width: 100%"
              v-model="formData.createTime"
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
          <el-form-item label="投诉状态" class="form_item">
            <el-select
              v-model="formData.statusList"
              placeholder="请选择投诉状态"
              filterable
              clearable
            >
              <el-option
                v-for="item in listOptions.complaintStatusOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="回复状态" class="form_item">
            <el-select
              v-model="formData.replyStatusList"
              placeholder="请选择回复状态"
              filterable
              clearable
            >
              <el-option
                v-for="item in listOptions.recoilStatusOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6"></el-col>
        <el-col :span="6"></el-col>
        <el-col :span="6">
          <el-form-item class="form_item btn query-form-btn">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 功能按钮组 -->
    <div class="func_btn_box">
      <el-button v-if="isAuth('add')" type="primary" @click="openDialog(1)"
      >
        <el-icon>
          <Plus/>
        </el-icon>
        新增
      </el-button
      >
      <el-button type="primary" @click="handleExcel"
      >
        <el-icon>
          <Download/>
        </el-icon>
        导出
      </el-button
      >
    </div>
    <div style="height: 20px"></div>
    <el-table
      class="custom_table"
      ref="tableRef"
      table-layout="auto"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" width="60" align="center"/>
      <el-table-column label="公司名称" prop="companyText" align="center" show-overflow-tooltip/>
      <el-table-column label="服务区名称" prop="serviceAreaText" align="center" show-overflow-tooltip/>
      <el-table-column label="投诉主题" prop="title" align="center" show-overflow-tooltip/>
      <el-table-column label="投诉时间" prop="comTime" align="center" show-overflow-tooltip/>
      <el-table-column label="投诉人" prop="comBy" align="center" show-overflow-tooltip/>
      <el-table-column label="填写人" prop="creatorName" align="center" show-overflow-tooltip/>
      <el-table-column label="填写时间" prop="createTime" align="center" show-overflow-tooltip/>
      <el-table-column label="投诉状态" prop="statusText" align="center" show-overflow-tooltip/>
      <el-table-column label="回复状态" prop="replyStatusText" align="center" show-overflow-tooltip/>
      
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <div style="display: flex; align-items: center">
            <el-button v-if="isAuth('edit') && row.status === '2' && row.replyStatus === '1'" type="primary"
                       size="small" link
                       @click="openDialog(2, row.entityId)">
              编辑
            </el-button>
            <el-dropdown>
              <el-button type="primary" size="small" link>
                更多
                <el-icon class="el-icon--right">
                  <arrow-down/>
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="openDialog(3, row.entityId)">
                    详情
                  </el-dropdown-item>
                  <el-dropdown-item v-if="isAuth('del') && row.status === '2' && row.replyStatus === '1'"
                                    @click="delData(row.entityId)">
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item v-if="isAuth('reply') && row.status === '2' && row.replyStatus === '1'"
                                    @click="openDialog(5, row.entityId)">
                    投诉回复
                  </el-dropdown-item>
                  <el-dropdown-item v-if="isAuth('define')" @click="openDialog(4, row.entityId)">
                    界定有效
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增弹窗 -->
    <AddDialog
      v-if="aedVisible"
      :visible="aedVisible"
      :dialogType="dialogType"
      :rowId="rowId"
      :data="aedData"
      @closeDialog="closeDialog"
      :options="listOptions"
    />
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, computed} from "vue";
import {getServiceArea, getCompany, queryNormalOptions} from "@/api/dictionaryApi";
import {deleteBaseConplaintApi, getBaseConplaintApi} from '@/api/daily/baseComplaint'
import AddDialog from "./add.vue";
import {isAuth} from "@/utils/authorization";
import {ElMessage, ElMessageBox} from "element-plus";
import {exportData} from "@/utils/common-features";
import moment from 'moment'

let formData = reactive({
  companyIdList: [],
  serviceAreaIdList: [],
  title: '',
  comBy: '',
  comTime: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
  creatorName: '',
  createTime: [],
  statusList: '',
  replyStatusList: '',
});

const tableRef = ref(null); // 列表引用
const tableData = ref([]); // 列表数据
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数
const dialogType = ref(1) // 1 - 新增 2 - 编辑 3 - 详情 4 - 界定有效 5 - 投诉回复
const rowId = ref('')

const listOptions = reactive({
  companyList: [],
  serviceAreaList: [],
  recoilStatusOptions: [], // 回复状态
  complaintStatusOptions: [] // 投诉状态
});

// 列表导出
function handleExcel() {
  // 构建请求参数
  const params = {
    companyIdList: formData.companyIdList,
    serviceAreaIdList: formData.serviceAreaIdList,
    title: formData.title,
    comBy: formData.comBy,
    beginComTime: formData.comTime ? formData.comTime[0] : '',
    endComTime: formData.comTime ? formData.comTime[1] : '',
    creatorName: formData.creatorName,
    beginCreateTime: formData.createTime ? formData.createTime[0] : '',
    endCreateTime: formData.createTime ? formData.createTime[1] : '',
    statusList: formData.statusList.split(''),
    replyStatusList: formData.replyStatusList.split(''),
  };
  
  exportData("/daily/basComplaint/exportXls", "投诉管理报表", params);
}

const openDialog = (type, id) => {
  dialogType.value = type
  if (type !== 1) {
    rowId.value = id ? id : ''
  }
  aedVisible.value = true;
}

const closeDialog = () => {
  aedVisible.value = false;
  rowId.value = ''
  if (dialogType.value !== 3) {
    getData()
  }
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
  // 获取公司下拉
  getCompany().then(({code, data}) => {
    if (code == 200) {
      listOptions.companyList = data.records;
    }
  })
  
  queryNormalOptions({
    queriers: [
      {alias: 'basComplaintStatusDictionary', param: null},
      {alias: 'basComplaintReplyStatusDictionary', param: null}
    ],
  }).then((res) => {
    listOptions.complaintStatusOptions = res.data.basComplaintStatusDictionary;
    listOptions.recoilStatusOptions = res.data.basComplaintReplyStatusDictionary;
  });
}

const getData = async () => {
  const params = {
    index: page.value,
    size: pageSize.value,
    companyIdList: formData.companyIdList,
    serviceAreaIdList: formData.serviceAreaIdList,
    title: formData.title,
    comBy: formData.comBy,
    beginComTime: formData.comTime ? formData.comTime[0] : '',
    endComTime: formData.comTime ? formData.comTime[1] : '',
    creatorName: formData.creatorName,
    beginCreateTime: formData.createTime ? formData.createTime[0] : '',
    endCreateTime: formData.createTime ? formData.createTime[1] : '',
    statusList: formData.statusList.split(''),
    replyStatusList: formData.replyStatusList.split(''),
  }
  const {data} = await getBaseConplaintApi(params)
  tableData.value = data.records
  total.value = Number(data.total)
}

const delData = (id) => {
  ElMessageBox.confirm("是否确认删除?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const resData = await deleteBaseConplaintApi(id)
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

// 重置查询
function onReset() {
  // 重置表单参数赋值
  formData.companyIdList = []
  formData.serviceAreaIdList = []
  formData.title = ''
  formData.comBy = ''
  formData.comTime = []
  formData.creatorName = ''
  formData.createTime = []
  formData.statusList = ''
  formData.replyStatusList = ''
  page.value = 1; // 重置页码
  pageSize.value = 10; // 重置每页条数
  getData(); // 重新查询
}

// 分页
function handleCurrentChange(val) {
  page.value = val;
  getData();
}

// 每页条数
function handleSizeChange(val) {
  pageSize.value = val;
  getData();
}

/** 弹窗相关start */
const aedData = ref({}); // 弹窗数据
const aedVisible = ref(false); // 弹窗显示

onMounted(() => {
  getDictionary();
  getData();
});
</script>

<style lang="less" scoped>
#staff-list .el-button--danger.is-plain:hover {
  color: #fff !important;
}

.staff-list_page {
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
      
      &.btn {
        .el-form-item__content {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
  
  .func_btn_box {
    margin-bottom: 10px;
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
