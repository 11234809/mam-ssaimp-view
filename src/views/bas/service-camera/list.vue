<!--
 * @Author: fbz
 * @Date: 2025-05-13 16:45:38
 * @LastEditors: fbz
 * @LastEditTime: 2025-05-20 15:20:19
-->
<template>
  <div class="service-camera">
    <el-form
      inline
      :model="formData"
      class="custom_form"
      label-width="130px"
      label-position="right"
      label-suffix=":">
      <el-row>
        <el-col :span="6">
            <el-form-item label="服务区" class="form_item">
                <el-select
                    multiple
                    v-model="serviceAreaIdList"
                    placeholder="请输入服务区名称"
                    @change="serviceAreaChange"
                    filterable
                    clearable
                >
                    <el-option
                        v-for="(item, index) in serviceAreaList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="卡口名称" class="form_item">
                <el-input
                    v-model="formData.cameraName"
                    placeholder="请输入卡口名称"
                    clearable
                />
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="卡口类型" class="form_item">
              <el-checkbox-group v-model="formData.cameraType">
                <el-checkbox v-for="(item,index) in typeList" :label="item.code" >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item class="form_item btn">
                <el-button type="primary" @click="query"
                    >查询</el-button
                >
                <el-button type="primary" @click="onReset"
                    >重置</el-button
                >
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="func_btn_box">
      <el-button type="primary" @click="handleDetail('add')">添加</el-button>
      <el-button type="primary" @click="doExport">
        <el-icon>
          <Download/>
        </el-icon>
        <span>导出</span>
      </el-button>
    </div>
    <el-table
      class="custom_table"
      ref="tableRef"
      border
      table-layout="auto"
      :data="tableData"
      style="width: 100%"
      @selection-change="selectionChange">
    <el-table-column type="selection" width="40" />
      <el-table-column prop="serviceAreaName" label="服务区" align="center" show-overflow-tooltip/>
      <el-table-column prop="name" label="卡口名称" align="center" show-overflow-tooltip/>
      <el-table-column prop="code" label="卡口编号" align="center"  show-overflow-tooltip/>
      <el-table-column prop="type" label="卡口类型" align="center"  how-overflow-tooltip/>
      <el-table-column label="操作" fixed="right" align="center">
        <template #default="scope">
          <div class="action_sheet">
            <el-button  type="primary" size="small" link  @click="handleDetail('edit', scope.row)" >编辑</el-button>
            <el-popconfirm
              class="box-item"
              title="是否确定删除该数据"
              placement="top-end"
              @confirm="handleDelete(scope.row.entityId)"
            >
              <template #reference>
                <el-button type="primary" size="small" link @confirm="handleDelete(scope.row.entityId)">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
      <el-pagination
          v-model:current-page="formData.index"
          v-model:page-size="formData.size"
          :page-sizes="[5, 10, 20, 30, 50]"
          layout="total,  prev, pager, next,sizes, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
    </div>
    <AddOrEdit v-model:visible="dialogVisible" :detailData="detailData" @getList="getDataList"/>
  </div>
</template>

<script setup>
import { ref,reactive,onActivated } from 'vue'
import { getQueryPageList,addData,editData,deleteData,getDictItems} from '../../../api/serviceCamera.js'
import { getServiceArea } from "@/api/dictionaryApi.js";
import { ElMessage } from 'element-plus';
import AddOrEdit from './components/addOrEdit.vue'
import {exportData} from "@/utils/common-features";

const formData = reactive({
  serviceAreaId: '', // 服务区ID
  cameraName: '', // 卡口名称
  cameraType:['1','2'], // 卡口类型
  index:1, // 页码
  size:10, // 每页条数
})
const total = ref(0) // 总条数
const serviceAreaIdList = ref([]) // 服务区ID列表

const dialogVisible = ref(false) // 弹窗是否显示
const detailData = ref({}) // 详情数据
const handleDetail = (type, row) => {
  dialogVisible.value = true;
  detailData.value = row || {};
}

// 查询数据
onActivated(async () => {
  await getDataList();
  await getDictionary();
  await getDictionaryType();
})

const tableSelectionList = ref([]) 
// 列表选择
const selectionChange = (val) => {
  tableSelectionList.value = val.map(item =>{
    return item.entityId
  })
}

// 导出
const doExport = () => {
  const params = {
    ...formData,
  };
  exportData("/bas/serviceCamera/exportXls", "卡口配置明细", params);
}

// 服务区数据转换
const serviceAreaChange = (val) => {
  if (val.length > 0) {
      formData.serviceAreaId = val.join(",");
  } else {
      formData.serviceAreaId = '';
  }
}

// 查询
const query = () => {
  formData.index = 1;
  getDataList();
}
// 重置查询
const onReset = () => {
  serviceAreaIdList.value = []
  formData.serviceAreaId=''; // 服务区ID
  formData.cameraName=''; // 卡口名称
  formData.cameraType=['1','2']; // 卡口类型
  getDataList()
}
const tableData = ref([]) // 表格数据
// 获取列表数据
const getDataList = async () => {
  try{
    const {data} = await getQueryPageList(formData)
    tableData.value = data?.records ?? []
    total.value = data?.total ?? 0
  }catch(error){
    ElMessage({
      message: error,
      type: 'error',
    });
  }
}

// 删除
const handleDelete = async (entityId) => {
  try{
    const { data } = await deleteData({entityId})
    ElMessage({
      message: data.message,
      type: 'success',
    });
    getDataList()
  }catch(error){
    ElMessage({
      message: error,
      type: 'error',
    });
  } 
}
// 分页
const handleCurrentChange = (val)=> {
    formData.index = val;
    getDataList();
}
// 每页条数
const handleSizeChange = (val)=>  {
    formData.size = val;
    getDataList();
}
const serviceAreaList = ref([]); // 服务区列表
// 获取服务区列表下拉
const getDictionary = async () => {
  getServiceArea().then(({ code, data }) => 
    {
      if (code == 200) {
          serviceAreaList.value = data.records;
      }
    }).catch((err) => {
        console.log(err);
    });
};
const typeList = ref([]); // 卡口类型列表
// 卡口类别
const getDictionaryType = async () => {
  try{
    const { data } = await getDictItems({queriers:[ { alias: "bayonetTypeDictionary", param: null }]})
    typeList.value = data?.bayonetTypeDictionary ?? []; 
  }catch(error){
    ElMessage({
      message: error.data.message,
      type: 'error',
    }); 
  }
}
</script>

<style lang="less" scoped>
.service-camera {
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

    .tips_box {
        display: flex;
        align-items: center;
        height: 40px;
        background-color: #0099ff32;
        border: 1px solid aqua;
        border-radius: 3px;
        margin-bottom: 10px;
        padding: 10px;

        .tips {
            font-size: var(--fontSize16);

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