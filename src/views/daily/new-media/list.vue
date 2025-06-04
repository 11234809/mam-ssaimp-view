<template>
    <div class="this_page">
        <!-- 筛选项 -->
        <el-form inline :model="formData" class="custom_form" label-width="120px" label-position="right"
            label-suffix=":">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="选择公司" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.companyIdList" multiple
                            filterable placeholder="请选择公司" clearable
                            :reserve-keyword="false">
                            <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="选择服务区" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.serviceAreaIdList" multiple
                            filterable placeholder="请选择服务区" clearable
                            :reserve-keyword="false">
                            <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="上报类型" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.submissionTypeList" multiple
                            filterable placeholder="请选择上报类型" clearable
                            :reserve-keyword="false">
                            <el-option v-for="(item, index) in reportTypeList" :key="index" :label="item.name"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="报送时间" class="form_item">
                        <el-date-picker value-format="YYYY-MM-DD HH:mm:ss" v-model="formData.reportTime" type="datetimerange"
                            date-format="YYYY/MM/DD ddd"
                            time-format="A hh:mm:ss"
                            range-separator="~" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :span="24">
                    <el-form-item class="form_item query-form-btn">
                        <el-button type="primary" @click="getData">
                            <el-icon>
                                <Search />
                            </el-icon>
                            <span>查询</span>
                        </el-button>
                        <el-button type="primary" @click="onReset">
                            <el-icon>
                                <RefreshLeft />
                            </el-icon>
                            <span>重置</span>
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 功能按钮组 -->
        <div class="func_btn_box">
            <el-button v-if="isAuth('add')" type="primary" @click="handleDetail('add')">
                <span>新增</span>
            </el-button>
            <el-button type="primary" @click="doExport(false)">
                <span>导出</span>
            </el-button>
            <el-button type="primary" @click="doExport(true)">
                <span>带图导出</span>
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
            <el-table-column prop="companyName" label="公司" align="center" show-overflow-tooltip />
            <el-table-column prop="name" label="服务区" align="center" show-overflow-tooltip />
            <el-table-column prop="submissionType" label="上报类型" align="center" show-overflow-tooltip>
                <template #default="scope">
                    {{ getSubmissionTypeByCode(scope.row.submissionType) }}
                </template>
            </el-table-column>
            <el-table-column prop="submissionContent" label="报送内容" align="center" show-overflow-tooltip>
                <template #default="scope">
                    {{ getTextByHtml(scope.row.submissionContent) }}
                </template>
            </el-table-column>
            <el-table-column label="图片" align="center" show-overflow-tooltip>
                <template #default="scope">
                    <div v-if="scope.row.files" class="accessory_box">
                        <template v-for="(item, index) in scope.row.filesName" :key="index">
                            <!-- <el-button v-if="index == 0" size="small" @click="fileDownload(item.url)">
                                <el-icon>
                                    <Download />
                                </el-icon>
                                {{ item.name }}
                            </el-button> -->

                            <img width="50" height="50" class="cst_upload_img" :src="item.url" alt="" />
                        </template>
                        <span v-if="scope.row.files.split(',').length > 1">
                            ...(共{{ scope.row.files.split(",").length }}个文件)
                        </span>

                    </div>
                    <span v-else class="no_file">无文件</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="报送时间" align="center" show-overflow-tooltip />
            <el-table-column prop="creatorName" label="上报人" align="center" show-overflow-tooltip />
            <el-table-column label="操作" align="center" width="140">
                <template #default="scope">
                    <div class="action_sheet">
                        <el-button type="primary" size="small" link
                            @click="handleDetail('detail', scope.row)">详情</el-button>
                        <el-button type="primary" size="small" link
                            @click="handleDetail('exam', scope.row)">考核</el-button>
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
import { getQueryPage } from "@/api/daily/newMedia.js";
import { getServiceArea } from "@/api/dictionaryApi.js";
import { getCompany } from '@/api/informationServiceAreaApi.js';
import { downFilePOST } from "@/api/manage";
import { queryNormalOptions } from '@/api/dictionaryApi.js';
import {isAuth} from "@/utils/authorization";
import moment from "moment";

const useInfo = JSON.parse(sessionStorage.getItem("userInfo"));

/* 筛选表单数据start */
const formData = reactive({
    companyIdList: [],
    serviceAreaIdList: [],
    submissionTypeList: [],
    reportTime: [moment().format("YYYY-MM-DD")+" 00:00:00", moment().format("YYYY-MM-DD")+" 23:59:59"],
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
const reportTypeList = ref([]);
//获取列表数据
async function getData() {
    let res = await getQueryPage({
        index: page.value,
        size: pageSize.value,
        ...formData,
        startTime: formData.reportTime ? formData.reportTime[0] : null,
        endTime: formData.reportTime ? formData.reportTime[1] : null,
    });
    if (res.code == 200) {
        tableData.value = res.data.records;
        tableData.value.map(async (item) => {
            item.filesName = [];
            if (item.files) {
                item.files.split(",").map(async (item2) => {
                    // await fileInfo({ id: item2 }).then(async res => {
                    // if (res.code == 200) {
                    await item.filesName.push({
                        name: res.data.fileName,
                        url:
                            process.env.VUE_APP_API_HOST_URL +
                            process.env.VUE_APP_API_BASE_URL +
                            `/pub/common/file/download?service=basNewMediaFileServiceImpl&id=${item2}`,
                    })
                    //     } else {
                    //         item.filesName = [];
                    //     }
                    // });
                });
            }
        });
        total.value = ~~res.data.total;
    }
}
getData();
getServiceArea().then(res => {
    serviceAreaList.value = res.data.records;
});
getCompany().then((res) => {
    companyList.value = res.data.records;
});
queryNormalOptions({
    queriers: [{ alias: 'submitTypeDictionary', param: null }],
}).then((res) => {
    reportTypeList.value = res.data.submitTypeDictionary;
});

// 查询重置
function onReset() {
    Object.keys(formData).map((key) => {
        formData[key] = null;
    });
    formData.reportTime = [];
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
    window.open(file);
}

function doExport(exportPic) {
    const systemTime = moment().format("YYYYMM");
    let fileName = "新媒体报送"+systemTime;
    downFilePOST('/api/daily/newMedia/export', {
        ...formData,
        startTime: formData.reportTime ? formData.reportTime[0] : null,
        endTime: formData.reportTime ? formData.reportTime[1] : null,
        size: exportPic ? pageSize.value : -1,
        index:exportPic ? page.value : -1,
        exportPic
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

const getSubmissionTypeByCode = (code) => {
    let result = reportTypeList.value.find(item => item.code == code);
    return result ? result.name : "";
}

const getTextByHtml = (html) => {
    let str = typeof html == 'string' ? html.replace(/<[^>]*>/g, '') : '';
    let div = document.createElement("div");
    div.innerHTML = str;
    return div.innerText;
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

.func_btn_box {
    margin-bottom: 20px;
}
</style>
