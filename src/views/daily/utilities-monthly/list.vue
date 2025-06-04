<template>
    <div class="this_page">
        <!-- 筛选项 -->
        <el-form inline :model="formData" class="custom_form" label-width="120px" label-position="right"
            label-suffix=":">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="公司" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.companyIdList"
              :reserve-keyword="false" multiple filterable placeholder="请选择公司" clearable>
                            <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="服务区" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.serviceAreaIdList"
              :reserve-keyword="false" multiple filterable placeholder="请选择服务区" clearable>
                            <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="填报年月" class="form_item">
                        <el-date-picker value-format="YYYY-MM" v-model="formData.createMonth" type="month" placeholder="请选择填报年月" />
                    </el-form-item>
                </el-col>
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
            <el-button type="primary" @click="handleDetail('add')">
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
        </div>
        <!-- 列表 -->
        <!-- <div class="tips_box">
            <span class="tips">已选择 <span class="tips_num">{{ checkNum }}</span> 项</span>
            <el-button link class="tips_num_close" @click="tableCheckClear">清空</el-button>
        </div> -->
        <el-table class="custom_table" ref="tableRef" border :data="tableData" @selection-change="selectionChange"
            style="width: 100%">
            <!-- <el-table-column type="selection" width="40" /> -->
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="serviceAreaId" label="服务区" align="center" show-overflow-tooltip>
                <template #default="scope">
                    {{ getServiceAreaById(scope.row.serviceAreaId) }}
                </template>
            </el-table-column>
            <el-table-column prop="companyId" label="公司名称" align="center" show-overflow-tooltip>
                <template #default="scope">
                    {{ getCompanyById(scope.row.companyId) }}
                </template>
                </el-table-column>
            <el-table-column prop="createMonth" label="填报年月" align="center" show-overflow-tooltip />

            <el-table-column label="用水量（吨）" align="center">
                <el-table-column prop="waterCommon" label="公共部分" align="center" show-overflow-tooltip />
                <el-table-column prop="waterManage" label="经营部分" align="center" show-overflow-tooltip />
            </el-table-column>

            <el-table-column label="用电量（度）" align="center">
                <el-table-column prop="electricCommon" label="公共部分" align="center" show-overflow-tooltip />
                <el-table-column prop="electricManage" label="经营部分" align="center" show-overflow-tooltip />
            </el-table-column>

            <el-table-column label="用气量（立方）" align="center">
                <el-table-column prop="gasCommon" label="公共部分" align="center" show-overflow-tooltip />
                <el-table-column prop="gasManage" label="经营部分" align="center" show-overflow-tooltip />
            </el-table-column>

            <el-table-column label="生物油（吨）" align="center">
                <el-table-column prop="oilCommon" label="公共部分" align="center" show-overflow-tooltip />
                <el-table-column prop="oilManage" label="经营部分" align="center" show-overflow-tooltip />
            </el-table-column>

            <el-table-column label="操作" align="center" width="140">
                <template #default="scope">
                    <div class="action_sheet">
                        <el-button type="primary" size="small" link
                            @click="handleDetail('detail', scope.row)">查看</el-button>
                        <!-- <el-button type="primary" size="small" link @click="handleRelease(scope.row)">发布</el-button> -->
                        <el-dropdown>
                            <el-button type="primary" size="small" link>
                                更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleDetail('edit', scope.row)">编辑</el-dropdown-item>
                                    <!-- <el-dropdown-item
                                            @click="handleDelete(scope.row.entityId)">删除</el-dropdown-item> -->
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
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
        <AddEditDetail v-if="aedVisible" :visible="aedVisible" :type="aedType" :data="aedData"
            @dialogClose="aedClose" />
    </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import AddEditDetail from "./add-edit-detail";
import { getQueryPage, exportXls } from "@/api/daily/utilitiesMonthly.js";
import { getServiceArea } from "@/api/dictionaryApi.js";
import { getCompany } from '@/api/informationServiceAreaApi.js';
import { downFilePOST } from "@/api/manage";
import moment from 'moment';

const useInfo = JSON.parse(sessionStorage.getItem("userInfo"));

/* 筛选表单数据start */
const formData = reactive({
    companyIdList: [],
    serviceAreaIdList: [],
    createMonth: moment().format('YYYY-MM'),
});
/* 筛选表单数据end */

/* 列表相关start */
const tableRef = ref(null); //列表ref
const checkNum = ref(0); // 列表选择总条数
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const serviceAreaList = ref([]); // 服务区域列表
const companyList = ref([]); // 公司列表
//获取列表数据
async function getData() {
    let res = await getQueryPage({
        index: page.value,
        size: pageSize.value,
        ...formData
    });
    if (res.code == 200) {
        tableData.value = res.data.records;
        total.value = ~~res.data.total;
    }
}
getData();
getServiceArea().then(res => {
    serviceAreaList.value = res.data.records;
});
getCompany().then((res) => {
    companyList.value = res.data.records;
})
function getServiceAreaById(id){
    let result = '';
    serviceAreaList.value.forEach((item) => {
        if(item.value == id){
            result = item.label;
        }
    });
    return result;
}
function getCompanyById(id){
    let result = '';
    companyList.value.forEach((item) => {
        if(item.value == id){
            result = item.label;
        }
    });
    return result;
}
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
        let res = await getDangerItemDelete({ entityId: id });
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

function fileDownload(file) {
    let url =
        process.env.VUE_APP_API_HOST_URL +
        process.env.VUE_APP_API_BASE_URL +
        `/pub/common/file/download?service=basDangerItemFileServiceImpl&id=${file}`;
    window.open(url);
}

function doExport() {
  let fileName = "水电气月报"
  downFilePOST('/api/daily/utilitiesMonthly/export', formData).then((data) => {
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
