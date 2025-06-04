<template>
    <div class="this_page">
        <!-- 筛选项 -->
        <el-form inline :model="formData" class="custom_form" label-width="120px" label-position="right"
            label-suffix=":">
            <el-row :gutter="30">
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
                    <el-form-item label="设备名称" class="form_item">
                        <el-input v-model="formData.name" placeholder="请输入设备名称" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="设备系统" class="form_item">
                        <el-input v-model="formData.deviceSystem" placeholder="请输入设备系统" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="设备类型" class="form_item">
                        <el-input v-model="formData.type" placeholder="请输入设备类型" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="设备状态" class="form_item">
                        <el-select v-model="formData.status" filterable placeholder="请选择设备状态" clearable
                        :reserve-keyword="false">
                            <el-option label="正常" value="2"></el-option>
                            <el-option label="异常" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="设备品牌" class="form_item">
                        <el-input v-model="formData.brand" placeholder="请输入设备品牌" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="设备编号" class="form_item">
                        <el-input v-model="formData.code" placeholder="请输入设备编号" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
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
                <el-icon>
                    <Plus />
                </el-icon>
                <span>新增</span>
            </el-button>
        </div>
        <!-- 列表 -->
        <el-table class="custom_table" ref="tableRef" border :data="tableData"
            style="width: 100%">
            <el-table-column prop="serviceAreaName" label="服务区" align="center" show-overflow-tooltip />
            <el-table-column prop="deviceSystem" label="设备系统" align="center" show-overflow-tooltip />
            <el-table-column prop="type" label="设备类型" align="center" show-overflow-tooltip />
            <el-table-column prop="name" label="设备名称" align="center" show-overflow-tooltip />
            <el-table-column prop="code" label="设备编号" align="center" show-overflow-tooltip />
            <el-table-column prop="brand" label="品牌" align="center" show-overflow-tooltip />
            <el-table-column prop="model" label="规格型号" align="center" show-overflow-tooltip />
            <el-table-column prop="price" label="单价(元)" align="center" show-overflow-tooltip />
            <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" align="center" show-overflow-tooltip>
                <template #default="scope">
                    {{ scope.row.status == 2 ? '正常' : '异常'}}
                </template>
            </el-table-column>
            
            <el-table-column label="操作" align="center" width="140">
                <template #default="scope">
                    <div class="action_sheet">
                        <el-button type="primary" size="small" link
                            @click="handleDetail('detail', scope.row)">详情</el-button>
                        <el-button v-if="isAuth('edit')" type="primary" size="small" link
                            @click="handleDetail('edit', scope.row)">编辑</el-button>
                        <el-button v-if="isAuth('del')" type="primary" size="small" link
                            @click="handleDelete(scope.row.entityId)">删除</el-button>
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
        <AddEditDetail v-if="aedVisible" :visible="aedVisible" :type="aedType" :id="aedData.entityId" :obj="aedData"
            @dialogClose="aedClose" />
    </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import AddEditDetail from "./add-edit-detail";
import { getQueryPage,deleteBasManage } from "@/api/device/basManage.js";
import { getServiceArea } from "@/api/dictionaryApi.js";
import { queryNormalOptions } from '@/api/dictionaryApi.js';
import {isAuth} from "@/utils/authorization";

/* 筛选表单数据start */
const formData = reactive({
    serviceAreaIdList: [],
    name: '',
    deviceSystem:'',
    type:'',
    status:'',
    brand:'',
    code:'',
});
/* 筛选表单数据end */

/* 列表相关start */
const tableRef = ref(null); //列表ref
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const serviceAreaList = ref([]); // 服务区域列表
const reportTypeList = ref([]);
//获取列表数据
async function getData() {
    let res = await getQueryPage({
        index: page.value,
        size: pageSize.value,
        name: formData.name,
        deviceSystem:formData.deviceSystem,
        type:formData.type,
        status:formData.status,   
        brand:formData.brand,
        code:formData.code,
        serviceAreaId: formData.serviceAreaIdList?formData.serviceAreaIdList.join(','):'',
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
        let res = await deleteBasManage({id});
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
