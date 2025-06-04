<template>
    <div class="this_page">
        <!-- 筛选项 -->
        <el-form inline :model="formData" class="custom_form" label-width="120px" label-position="right"
            label-suffix=":">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="公司" class="form_item">
                        <el-select v-model="formData.companyIdList" filterable collapse-tags multiple
                        :reserve-keyword="false" placeholder="请选择或输入公司" clearable>
                            <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="服务区" class="form_item">
                        <el-select v-model="formData.serviceAreaIdList" filterable collapse-tags multiple
                        :reserve-keyword="false" placeholder="请选择或输入服务区" clearable>
                            <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="时间(月份)" class="form_item">
                        <el-date-picker v-model="formData.month" type="month" value-format="YYYY-MM" placeholder="请选择时间(月份)" />
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
            <el-button type="primary" @click="doExport()">
                <el-icon>
                    <Download />
                </el-icon>
                <span>导出</span>
            </el-button>
        </div>
        <!-- 列表 -->
        <el-table class="custom_table" ref="tableRef" border :data="tableData" @selection-change="selectionChange"
            style="width: 100%">
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="company" label="公司" align="center" show-overflow-tooltip />
            <el-table-column prop="serviceAreaName" label="服务区" align="center" show-overflow-tooltip />
            <el-table-column prop="timesByC" label="公司稽查次数" align="center" show-overflow-tooltip />
            <el-table-column prop="decodeByC" label="公司稽查扣分" align="center" show-overflow-tooltip />
            <el-table-column prop="timesByS" label="服务区稽查次数" align="center" show-overflow-tooltip />
            <el-table-column prop="decodeByS" label="服务区稽查扣分" align="center" show-overflow-tooltip />
            <el-table-column prop="total" label="扣分合计" align="center" show-overflow-tooltip />
        </el-table>
        <!-- 分页 -->
        <div class="pagination_box">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
                layout="total,  prev, pager, next,sizes, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { exportData } from "@/utils/common-features";
import { serveInspect } from "@/api/serveInspectApi";
import { getServiceArea, getCompany } from "@/api/dictionaryApi";
import moment from 'moment'

/* 筛选表单数据start */
const formData = reactive({
    dangerItemName: "",
    month:moment().format('YYYY-MM'),
});
/* 筛选表单数据end */

/* 列表相关start */
const tableRef = ref(null); //列表ref
const checkNum = ref(0); // 列表选择总条数
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const companyList = ref([]);
const serviceAreaList = ref([]);
//获取列表数据
function getData() {
    serveInspect({
        index: page.value,
        size: pageSize.value,
        ...formData,
    }).then(({ code, data }) => {
        if (code == 200) {
            tableData.value = data.records;
            total.value = data.total;
        }
    })
}
// 获取字典数据
const getDictionary = () => {
    // 获取服务区
    getServiceArea().then(({ code, data }) => {
        if (code == 200) {
            serviceAreaList.value = data.records;
        }
    })
    // 获取公司
    getCompany().then(({ code, data }) => {
        if (code == 200) {
            companyList.value = data.records;
        }
    })
};
getDictionary()
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
/* 列表相关end */

function doExport() {
    let params = { ...formData, };
    exportData("/statisticalForm/serveInspect/exportXls", "服务区稽查统计报表", params);
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
