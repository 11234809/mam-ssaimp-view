<template>
    <div class="info_reported">
        <!-- 筛选项 -->
        <el-form inline :model="formData" class="custom_form" label-width="120px" label-position="right"
            label-suffix=":">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="选择公司" class="form_item">
                        <el-select 
                            v-model="formData.companyIdList" 
                            placeholder="请选择公司" 
                            multiple
                            filterable
                            :reserve-keyword="false"
                            collapse-tags
                            clearable
                        >
                            <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="选择服务区" class="form_item">
                        <el-select v-model="formData.serviceAreaIdList" placeholder="请选择服务区"  multiple filterable 
                        :reserve-keyword="false" clearable>
                            <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="选择评价时间" class="form_item">
                        <el-date-picker v-model="checkTime" type="daterange" range-separator="~"
                            value-format="YYYY-MM-DD"
                            start-placeholder="请选择开始日期" end-placeholder="请选择结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item class="form_item">
                        <el-button type="primary" @click="getData">查询</el-button>
                        <el-button type="primary" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="func_btn_box">
            <el-button type="primary" @click="exportFile">导出</el-button>
        </div>
        <!-- 列表 -->
        <el-table class="custom_table" ref="tableRef" border :data="tableData" @selection-change="selectionChange"  @sort-change="sortChange"
            style="width: 100%">
            <el-table-column type="index" label="序号" width="80" align="center" fixed="left" />
            <el-table-column prop="company" label="公司" align="center" show-overflow-tooltip fixed="left" />
            <el-table-column prop="areaName" label="服务区" align="center" show-overflow-tooltip fixed="left" />
            <el-table-column label="色" align="center">
                <el-table-column prop="odorGood" label="非常满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="odorNor" label="基本满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="odorBad" label="不满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="odorRatio" align="center" show-overflow-tooltip sortable>
                    <template #header>
                        <span>满意度(%)</span>
                        <el-tooltip content="满意度 =（非常满意评价次数*5 + 一般满意评价次数*3 + 不满意 *0）/ 评价总次数*5" placement="top">
                            <el-icon>
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="香" align="center">
                <el-table-column prop="dishTaste" label="非常满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="dishTaste" label="基本满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="dishTaste" label="不满意" align="center" show-overflow-tooltip sortable />
                <el-table-column align="center" show-overflow-tooltip sortable>
                    <template #header>
                        <span>满意度(%)</span>
                        <el-tooltip content="满意度 =（非常满意评价次数*5 + 一般满意评价次数*3 + 不满意 *0）/ 评价总次数*5" placement="top">
                            <el-icon>
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="味" align="center">
                <el-table-column prop="aromaGood" label="非常满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="aromaNor" label="基本满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="aromaBad" label="不满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="aromaRatio" align="center" show-overflow-tooltip sortable>
                    <template #header>
                        <span>满意度(%)</span>
                        <el-tooltip content="满意度 =（非常满意评价次数*5 + 一般满意评价次数*3 + 不满意 *0）/ 评价总次数*5" placement="top">
                            <el-icon>
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="劲" align="center">
                <el-table-column prop="finesseGood" label="非常满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="finesseNor" label="基本满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="finesseBad" label="不满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="finesseRatio" align="center" show-overflow-tooltip sortable>
                    <template #header>
                        <span>满意度(%)</span>
                        <el-tooltip content="满意度 =（非常满意评价次数*5 + 一般满意评价次数*3 + 不满意 *0）/ 评价总次数*5" placement="top">
                            <el-icon>
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="服" align="center">
                <el-table-column prop="attitudeGood" label="非常满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="attitudeNor" label="基本满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="attitudeBad" label="不满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="attitudeRatio" align="center" show-overflow-tooltip sortable>
                    <template #header>
                        <span>满意度(%)</span>
                        <el-tooltip content="满意度 =（非常满意评价次数*5 + 一般满意评价次数*3 + 不满意 *0）/ 评价总次数*5" placement="top">
                            <el-icon>
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="整体评价" align="center">
                <el-table-column prop="overallEvaluationGood" label="非常满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="overallEvaluationNor" label="基本满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="overallEvaluationBad" label="不满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="overallEvaluationRatio" align="center" show-overflow-tooltip sortable>
                    <template #header>
                        <span>满意度(%)</span>
                        <el-tooltip content="满意度 =（非常满意评价次数*5 + 一般满意评价次数*3 + 不满意 *0）/ 评价总次数*5" placement="top">
                            <el-icon>
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table-column>
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
import { getPublicSatisfyCqxmList } from "@/api/statisticalForm/publicSatisfy";
import { getCompany, getServiceArea } from "@/api/dictionaryApi";
import { downFilePOST } from "@/api/manage";
import { ElMessage } from "element-plus";
import {exportData} from "@/utils/common-features";
import moment from "moment";
/* 筛选表单数据start */
const formData = reactive({
    serviceAreaIdList:[],
    companyIdList:[],
    orderSuffix:'',
    orderBy:'',
});
const checkTime = ref([moment().subtract(1, "days").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")])
/* 筛选表单数据end */
const companyList = ref({})
const serviceAreaList = ref({})
getCompany().then((res) => {
    companyList.value = res.data.records;
  })
getServiceArea().then(res => {
    serviceAreaList.value = res.data.records;
});

/* 列表相关start */
const tableRef = ref(null); //列表ref
const checkNum = ref(0); // 列表选择总条数
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
//获取列表数据
async function getData() {
    let parmas = {
        ...formData,
        "index": page.value,
        "size": pageSize.value,
        "beginCreateTime": checkTime.value[0],
        "endCreateTime": checkTime.value[1]
    }
    let res = await getPublicSatisfyCqxmList(parmas);
    if (res.code == 200) {
        tableData.value = res.data.records;
        total.value = ~~res.data.total;
    }
}
getData();
function exportFile(){
    let params = {
        "index": page.value,
        "size": pageSize.value,
        "companyIdList": formData.companyIdList ,
        "serviceAreaIdList": formData.serviceAreaIdList,
        "beginCreateTime": checkTime.value[0],
        "endCreateTime": checkTime.value[1]
    }
    exportData("/statisticalForm/publicSatisfy/cqxm/exportXls", "重庆小面餐饮评价报表", params);
}
// 查询重置
function onReset() {
    Object.keys(formData).map((key) => {
        formData[key] = null;
    });
    checkTime.value = [];
    page.value = 1;
    pageSize.value = 10;
    tableCheckClear();
    getData();
}
// 排序发生变化
const sortChange = (val) => {
    if(!val.order){ // 清除排序
        formData.orderSuffix = ""
        formData.orderBy = ""
        getData()
        return
    }
    formData.orderBy = val.prop
    if(val.order=="ascending") formData.orderSuffix="ASC"
    if(val.order=="descending") formData.orderSuffix="DESC"
    getData()
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

// 计算满意度
// function calculateSatisfaction(data) {
//     const total = data.verySatisfied + data.satisfied + data.dissatisfied;
//     const satisfaction = (data.verySatisfied * 5 + data.satisfied * 3) / (total * 5) * 100;
//     return satisfaction.toFixed(2) + "%";
// }
</script>

<style lang="less" scoped>
.info_reported {
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
