<template>
    <div class="this_page">
        <!-- 筛选项 -->
        <el-form inline :model="formData" class="custom_form" label-width="120px" label-position="right"
            label-suffix=":">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="上报标题" class="form_item">
                        <el-input v-model="formData.reportTitle" placeholder="请输入上报标题" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="上报类型" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.reportTypeIdList" multiple
                            filterable placeholder="请选择上报类型（支持多选）" clearable
                            :reserve-keyword="false">
                            <el-option v-for="(item, index) in infoReportedTypeDictionary" :key="index"
                                :label="item.name" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="上报单位" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.reportUnitIdList" multiple
                            filterable placeholder="请选择上报单位（支持多选，搜索）" clearable
                            :reserve-keyword="false">
                            <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="上报时间" class="form_item">
                        <el-date-picker value-format="YYYY-MM-DD" v-model="formData.reportTime" type="daterange"
                            range-separator="~" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="上报信息状态" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.reportStatusIdList" multiple
                            filterable placeholder="请选择上报信息状态" clearable
                            :reserve-keyword="false">
                            <el-option v-for="(item, index) in infoReportedStatusDictionary" :key="index"
                                :label="item.name" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item class="form_item query-form-btn">
                        <el-button type="primary" @click="getData">查询</el-button>
                        <el-button type="primary" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 功能按钮组 -->
        <div class="func_btn_box">
            <el-button v-if="isAuth('add')" type="primary" @click="handleDetail('add')">
                <el-icon>
                    <Plus />
                </el-icon>
                <span>新增</span>
            </el-button>
            <el-button type="primary" @click="doExport()">
                <el-icon>
                    <Download />
                </el-icon>
                <span>导出</span>
            </el-button>
            <!-- <el-button type="primary" @click="doExportPDF()">
                <el-icon>
                    <MessageBox />
                </el-icon>
                <span>导出PDF</span>
            </el-button> -->
        </div>
        <!-- 列表 -->
        <div class="tips_box">
            <span class="tips">已选择 <span class="tips_num">{{ checkNum }}</span> 项</span>
            <el-button link class="tips_num_close" @click="tableCheckClear">清空</el-button>
        </div>
        <el-table class="custom_table" ref="tableRef" border :data="tableData" @selection-change="selectionChange"
            style="width: 100%">
            <el-table-column type="selection" width="40" />
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="reportTitle" label="上报标题" align="center" show-overflow-tooltip />
            <el-table-column prop="reportTypeId" label="上报类型" align="center" show-overflow-tooltip>
                <template #default="scope">
                    {{ getInfoReportedType(scope.row.reportTypeId) }}
                </template>
            </el-table-column>
            <el-table-column prop="reportUnitName" label="上报单位" align="center" show-overflow-tooltip>
                <template #default="scope">
                    {{ getUnitName(scope.row.reportUnitId) }}
                </template>
            </el-table-column>
            <el-table-column prop="reportUserName" label="上报人" align="center" show-overflow-tooltip />
            <el-table-column prop="reportTime" label="上报时间" align="center" show-overflow-tooltip />
            <el-table-column prop="reportStatusText" label="上报状态" align="center" show-overflow-tooltip />

            <el-table-column label="操作" align="center" width="160">
                <template #default="scope">
                    <div class="action_sheet">
                        <el-button  type="primary" size="small" link
                            @click="handleDetail('detail', scope.row)">详情</el-button>
                        <el-button v-if="isAuth('edit') && scope.row.reportStatusId == '1'" type="primary" size="small" link
                            @click="handleDetail('edit', scope.row)">编辑</el-button>
                        <el-button v-if="isAuth('del') && scope.row.reportStatusId == '1'" type="primary" size="small" link
                            @click="handleDelete(scope.row.entityId)">废弃</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination_box">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
                layout="total,  prev, pager, next,sizes, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <!-- 新增/编辑/详情弹窗 -->
        <AddEditDetail v-if="aedVisible" :visible="aedVisible" :type="aedType" :id="aedData.entityId"
            @dialogClose="aedClose" />
    </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import AddEditDetail from "./add-edit-detail";
import { getQueryPage, deleteInfoReported } from "@/api/infoReported.js";
import { getCompany } from '@/api/informationServiceAreaApi.js';
import { queryNormalOptions } from '@/api/dictionaryApi.js';
import { downFilePOST } from "@/api/manage";
import {isAuth} from "@/utils/authorization";

const useInfo = JSON.parse(sessionStorage.getItem("userInfo"));

/* 筛选表单数据start */
const formData = reactive({
    reportTitle: '',
    reportTypeIdList: [],
    reportUnitIdList: [],
    reportTime: [],
    reportStatusIdList: []
});
/* 筛选表单数据end */

/* 列表相关start */
const tableRef = ref(null); //列表ref
const checkNum = ref(0); // 列表选择总条数
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const infoReportedStatusDictionary = ref([]); //信息上报状态字典
const infoReportedTypeDictionary = ref([]); //信息上报类型字典
const companyList = ref([]); //单位列表
const selection = ref([]); //列表选中数据

queryNormalOptions({
    queriers: [{ alias: 'infoReportedStatusDictionary', param: null }],
}).then((res) => {
    infoReportedStatusDictionary.value = res.data.infoReportedStatusDictionary;
});
queryNormalOptions({
    queriers: [{ alias: 'infoReportedTypeDictionary', param: null }],
}).then((res) => {
    infoReportedTypeDictionary.value = res.data.infoReportedTypeDictionary;
});
getCompany().then((res) => {
    companyList.value = res.data.records;
})


//获取列表数据
async function getData() {
    let res = await getQueryPage({
        index: page.value,
        size: pageSize.value,
        ...formData,
        reportBeginTime: formData.reportTime?formData.reportTime[0]:null,
        reportEndTime: formData.reportTime?formData.reportTime[1]:null,

    });
    if (res.code == 200) {
        tableData.value = res.data.records;
        total.value = ~~res.data.total;
    }
}
getData();
// 查询重置
function onReset() {
    Object.keys(formData).map((key) => {
        formData[key] = null;
    });
    page.value = 1;
    pageSize.value = 10;
    tableCheckClear();
    getData();
}
// 列表选择
function selectionChange(val) {
    checkNum.value = val.length;
    selection.value = val;
}
// 列表选择清空
function tableCheckClear() {
    tableRef.value.clearSelection();
    selectionChange([]);
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
// 列表删除
async function handleDelete(id) {
    ElMessageBox.confirm("是否确认删除?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async () => {
        let res = await deleteInfoReported({ id });
        if (res.code == 200) {
            ElMessage({
                message: res.data.message,
                type: "success",
            });
            await getData();
        }
    });
}
// 列表新增/编辑/详情
function handleDetail(type, data) {
    aedVisible.value = true;
    aedType.value = type;
    aedData.value = data ? data : {};
}
/* 列表相关end */

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
/* 新增/编辑/详情弹窗相关end */


function doExport() {
  let fileName = "信息上报审批"
  downFilePOST('/api/infoReported/exportXls', {
    ...formData,
    reportBeginTime: formData.reportTime?formData.reportTime[0]:null,
    reportEndTime: formData.reportTime?formData.reportTime[1]:null,
    size:-1,
    index:-1
  }).then((data) => {
    if (!data) {
      ElMessage.warning("文件下载失败");
      return;
    }
    let excelData = data.data;
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      window.navigator.msSaveBlob(
        new Blob([excelData], { type: "application/vnd.ms-excel" }),
        fileName + ".xls"
      );
    } else {
      let url = window.URL.createObjectURL(
        new Blob([excelData], { type: "application/vnd.ms-excel" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // 下载完成移除元素
      window.URL.revokeObjectURL(url); // 释放掉blob对象
    }
  });
}

function doExportPDF() {
  let fileName = "信息上报审批"
  selection.value.forEach(item => {
    downFilePOST('/api/infoReported/exportPdf', {id:item.entityId}).then((data) => {
        if (!data) {
        ElMessage.warning("文件下载失败");
        return;
        }
        let excelData = data.data;
        if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(
            new Blob([excelData], { type: "application/pdf" }),
            fileName + ".pdf"
        );
        } else {
        let url = window.URL.createObjectURL(
            new Blob([excelData], { type: "application/pdf" })
        );
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName + ".pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 下载完成移除元素
        window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
    });
  })
}

const getInfoReportedType = (id)=>{
    let obj = infoReportedTypeDictionary.value.find(item => item.code == id);
    return obj ? obj.name : "";
}
const getUnitName = (id)=>{
    let obj = companyList.value.find(item => item.value == id);
    return obj ? obj.label : "";
}
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
.func_btn_box{
    margin-bottom: 20px;
}
</style>
