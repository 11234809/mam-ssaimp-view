<template>
    <div class="this_page">
        <!-- 筛选项 -->
        <el-form inline :model="formData" class="custom_form" label-width="120px" label-position="right"
            label-suffix=":">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="用户名" class="form_item">
                        <!-- <el-select collapse-tags collapse-tags-tooltip v-model="formData.userName" multiple filterable
                            placeholder="请选择" clearable>
                            <el-option v-for="(item, index) in []" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select> -->
                        <el-input v-model="formData.userName" placeholder="请输入用户名" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="公司" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.companyIdList" multiple
                            filterable placeholder="请选择" clearable
                            :reserve-keyword="false">
                            <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="服务区" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.serviceAreaIdList" multiple
                            filterable placeholder="请选择" clearable
                            :reserve-keyword="false">
                            <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="文件类型" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.fileTypeList" multiple
                            filterable placeholder="请选择" clearable
                            :reserve-keyword="false">
                            <el-option v-for="(item, index) in informPublishFileTypeDictionary" :key="index"
                                :label="item.name" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="阅读状态" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.statusList" multiple
                            placeholder="请选择" clearable>
                            <el-option v-for="(item, index) in informFileCheckStatusDictionary" :key="index"
                                :label="item.name" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="文件名称" class="form_item">
                        <el-input v-model="formData.fileName" placeholder="请输入文件名称" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="公告内容" class="form_item">
                        <el-input v-model="formData.content" placeholder="请输入公告内容" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="是否需要反馈" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.isFeedList" multiple
                            placeholder="请选择" clearable>
                            <el-option v-for="(item, index) in informPublishFeedDictionary" :key="index"
                                :label="item.name" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="是否及时阅读" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.timelyReadingList" multiple
                            placeholder="请选择" clearable>
                            <el-option v-for="(item, index) in informFileCheckTimelyReadingDictionary" :key="index"
                                :label="item.name" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="是否反馈" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-model="formData.feedStatusList" multiple
                            placeholder="请选择" clearable>
                            <el-option v-for="(item, index) in informFileCheckFeedStatusDictionary" :key="index"
                                :label="item.name" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="反馈时间" class="form_item">
                        <el-date-picker value-format="YYYY-MM-DD" v-model="formData.feedTime" type="daterange"
                            range-separator="~" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="阅读时间" class="form_item">
                        <el-date-picker value-format="YYYY-MM-DD" v-model="formData.readTime" type="daterange"
                            range-separator="~" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期">
                        </el-date-picker>
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
        <el-table class="custom_table" ref="tableRef" border :data="tableData" @selection-change="selectionChange"
            style="width: 100%">
            <!-- <el-table-column type="selection" width="40" /> -->
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="companyText" label="公司" align="center" show-overflow-tooltip />
            <el-table-column prop="serviceAreaText" label="服务区" align="center" show-overflow-tooltip/>
            <el-table-column prop="userName" label="用户名" align="center" show-overflow-tooltip />
            <el-table-column prop="name" label="通知文件名称" align="center" show-overflow-tooltip />
            <el-table-column prop="type" label="文件类型" align="center" show-overflow-tooltip>
                <template #default="scope">
                    {{ getTypeById(scope.row.type) }}
                </template>
            </el-table-column>
            <!-- <el-table-column prop="endRoute" label="上报人" align="center" width="450">
                <template #default="scope">
                    <div v-if="scope.row.files" class="accessory_box">
                        <template v-for="(item, index) in scope.row.filesName" :key="index">
                            <el-button v-if="index == 0" size="small" @click="fileDownload(item.url)">
                                <el-icon>
                                    <Download />
                                </el-icon>
                                {{ item.name }}
                            </el-button>
                        </template>
<span v-if="scope.row.files.split(',').length > 1">
    ...(共{{ scope.row.files.split(",").length }}个文件)
</span>

</div>
<span v-else class="no_file">无文件</span>
</template>
</el-table-column> -->
            <el-table-column label="公告内容" align="center" show-overflow-tooltip>
                <template #default="scope">
                    <span style="color:blue;cursor: pointer;" @click="handleDetail('detail', scope.row)">{{
                        scope.row.remark }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="isFeed" label="是否需要反馈" align="center" show-overflow-tooltip>
                <template #default="scope">
                    {{ getIsFeedText(scope.row.isFeed) }}
                </template>
            </el-table-column>
            <el-table-column prop="feedStatusText" label="是否反馈" align="center" show-overflow-tooltip />
            <el-table-column prop="feedTime" label="反馈时间" align="center" show-overflow-tooltip />
            <el-table-column prop="feedTxt" label="反馈内容" align="center" show-overflow-tooltip />
            <el-table-column prop="statusText" label="阅读状态" align="center" show-overflow-tooltip />
            <el-table-column prop="timelyReadingText" label="是否及时阅读" align="center" show-overflow-tooltip />
            <el-table-column prop="readTime" label="阅读时间" align="center" show-overflow-tooltip />
            <el-table-column label="操作" align="center" width="140">
                <template #default="scope">
                    <div class="action_sheet">
                        <el-button v-if="sameUser(scope.row.userId)" type="primary" size="small" link
                            @click="readFile('detail', scope.row)">查看</el-button>
                        <el-button v-if="scope.row.isFeed == 1" type="primary" size="small" link
                            @click="handleDetail('feedback', scope.row)">反馈</el-button>

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
import { getQueryPage, readInformFile } from "@/api/informFile/informFileCheck.js";

import { getServiceArea } from "@/api/dictionaryApi.js";
import { getCompany } from '@/api/informationServiceAreaApi.js';
import { queryNormalOptions } from '@/api/dictionaryApi.js';

const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

/* 筛选表单数据start */
const formData = reactive({
    "userName": null,
    "companyIdList": [],
    "serviceAreaIdList": [],
    "fileTypeList": [],
    "fileName": null,
    "statusList": [],
    "content": null,
    "isFeedList": [],
    "timelyReadingList": [],
    "feedStatusList": [],
    "feedTime": [],
    "readTime": []
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
const informPublishFileTypeDictionary = ref([]); // 文件类型列表
const informPublishFeedDictionary = ref([]); // 发布状态列表
const informFileCheckFeedStatusDictionary = ref([]); // 是否已反馈列表
const informFileCheckStatusDictionary = ref([]); // 及时阅读列表
const informFileCheckTimelyReadingDictionary = ref([]); // 反馈状态列表


//获取列表数据
async function getData() {
    let res = await getQueryPage({
        index: page.value,
        size: pageSize.value,
        "userName": formData.userName || null,
        "companyIdList": formData.companyIdList.length > 0 ? formData.companyIdList : null,
        "serviceAreaIdList": formData.serviceAreaIdList.length > 0 ? formData.serviceAreaIdList : null,
        "fileTypeList": formData.fileTypeList.length > 0 ? formData.fileTypeList : null,
        "fileName": formData.fileName || null,
        "statusList": formData.statusList.length > 0 ? formData.statusList : null,
        "content": formData.content || null,
        "feedStatusList": formData.feedStatusList.length > 0 ? formData.feedStatusList : null,
        "isFeedList": formData.isFeedList.length > 0 ? formData.isFeedList : null,
        "timelyReadingList": formData.timelyReadingList.length > 0 ? formData.timelyReadingList : null,
        feedBeginTime: formData.feedTime ? formData.feedTime[0] : null,
        feedEndTime: formData.feedTime ? formData.feedTime[1] : null,
        readBeginTime: formData.readTime ? formData.readTime[0] : null,
        readEndTime: formData.readTime ? formData.readTime[1] : null,
    });
    if (res.code == 200) {
        tableData.value = res.data.records;
        tableData.value.map(async (item) => {
            item.filesName = [];
            if (item.files) {
                item.files.split(",").map(async (item2) => {
                    await fileInfo({ id: item2 }).then(async res => {
                        if (res.code == 200) {
                            await item.filesName.push({
                                name: res.data.fileName,
                                url:
                                    process.env.VUE_APP_API_HOST_URL +
                                    process.env.VUE_APP_API_BASE_URL +
                                    `/pub/common/file/download?service=basPolicyRecordFileServiceImpl&id=${item2}`,
                            })
                        } else {
                            item.filesName = [];
                        }
                    });
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
    queriers: [{ alias: 'informPublishFileTypeDictionary', param: null }],
}).then((res) => {
    informPublishFileTypeDictionary.value = res.data.informPublishFileTypeDictionary;
});

queryNormalOptions({
    queriers: [{ alias: 'informPublishFeedDictionary', param: null }],
}).then((res) => {
    informPublishFeedDictionary.value = res.data.informPublishFeedDictionary;
});
queryNormalOptions({
    queriers: [{ alias: 'informFileCheckFeedStatusDictionary', param: null }],
}).then((res) => {
    informFileCheckFeedStatusDictionary.value = res.data.informFileCheckFeedStatusDictionary;
});
queryNormalOptions({
    queriers: [{ alias: 'informFileCheckStatusDictionary', param: null }],
}).then((res) => {
    informFileCheckStatusDictionary.value = res.data.informFileCheckStatusDictionary;
});
queryNormalOptions({
    queriers: [{ alias: 'informFileCheckTimelyReadingDictionary', param: null }],
}).then((res) => {
    informFileCheckTimelyReadingDictionary.value = res.data.informFileCheckTimelyReadingDictionary;
});


// 查询重置
function onReset() {
    Object.keys(formData).map((key) => {
        if (key.indexOf('List') != -1) {
            formData[key] = [];
        } else {
            formData[key] = null;
        }
    });
    formData.feedTime = [];
    formData.readTime = [];
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
const sameUser = (id) => {
    return userInfo.id == id;
}
const readFile = (type, row) => {
    handleDetail(type, row);
    readInformFile({ id: row.entityId }).then(res=>{
        if (res.code == 200) {
            ElMessage({
                message: res.data.message,
                type: "success",
            });
        }
    })
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
        `/pub/common/file/download?service=basPolicyFileFileServiceImpl&id=${file}`;
    window.open(url);
}

function doExport() {
    alert("//todo export");
}
const getIsFeedText = (id) => {
    let text = "";
    informPublishFeedDictionary.value.forEach((item) => {
        if (item.code == id) {
            text = item.name;
        }
    });
    return text;

}
const getTypeById = (id) => {
    let text = "";
    informPublishFileTypeDictionary.value.forEach((item) => {
        if (item.code == id) {
            text = item.name;
        }
    });
    return text;
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
