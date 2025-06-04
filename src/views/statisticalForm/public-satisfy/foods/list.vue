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
                            collapse-tags
                            filterable
                            :reserve-keyword="false"
                            clearable
                        >
                            <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="选择服务区" class="form_item">
                        <el-select v-model="formData.serviceAreaIdList" placeholder="请选择服务区"   multiple filterable 
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
          <!-- 功能按钮组 -->
        <div class="func_btn_box">
            <el-button type="primary" @click="exportFile">导出</el-button>
        </div>
        <!-- 列表 -->
        <el-table class="custom_table" ref="tableRef" border :data="tableData" @selection-change="selectionChange" @sort-change="sortChange"
            style="width: 100%">
            <el-table-column type="index" label="序号" width="80" align="center" fixed="left" />
            <el-table-column prop="companyId" label="公司" align="center" show-overflow-tooltip fixed="left" />
            <el-table-column prop="areaName" label="服务区" align="center" show-overflow-tooltip fixed="left" />
            
            <el-table-column>
                <el-table-column prop="qualityGood" label="非常满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="qualityNor" label="基本满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="qualityBad" label="不满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="qualityRatio" align="center" show-overflow-tooltip sortable>
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
            <el-table-column label="饭菜口味" align="center">
                <el-table-column prop="tasteGood" label="非常满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="tasteNor" label="基本满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="tasteBad" label="不满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="tasteRatio" align="center" show-overflow-tooltip sortable>
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
            <el-table-column label="饭菜、餐具卫生" align="center">
                <el-table-column prop="tablewareGood" label="非常满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="tablewareNor" label="基本满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="tablewareBad" label="不满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="tablewareRatio" align="center" show-overflow-tooltip sortable>
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
            <el-table-column label="饭菜种类" align="center">
                <el-table-column prop="typeGood" label="非常满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="typeNor" label="基本满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="typeBad" label="不满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="typeRatio" align="center" show-overflow-tooltip sortable>
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
            <el-table-column label="饭菜份量" align="center">
                <el-table-column prop="quantityGood" label="非常满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="quantityNor" label="基本满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="quantityBad" label="不满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="quantityRatio" align="center" show-overflow-tooltip sortable>
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
            <el-table-column label="上菜速度" align="center">
                <el-table-column prop="speedGood" label="非常满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="speedNor" label="基本满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="speedBad" label="不满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="speedRatio" align="center" show-overflow-tooltip sortable>
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
            <el-table-column label="就餐区环境" align="center">
                <el-table-column prop="environmentGood" label="非常满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="environmentNor" label="基本满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="environmentBad" label="不满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="environmentRatio" align="center" show-overflow-tooltip sortable>
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
            <el-table-column label="就餐区卫生情况" align="center">
                <el-table-column prop="hygieneGood" label="非常满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="hygieneNor" label="基本满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="hygieneBad" label="不满意" align="center" show-overflow-tooltip sortable />
                <el-table-column prop="hygieneRatio" align="center" show-overflow-tooltip sortable>
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
            <el-table-column label="工作人员服务态度" align="center">
                <el-table-column prop="attitudeGood" label="非常满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="attitudeNor" label="基本满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="attitudeBad" label="不满意" align="center" show-overflow-tooltip
                    sortable />
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
            <el-table-column label="工作人员个人卫生" align="center">
                <el-table-column prop="personalHygieneGood" label="非常满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="personalHygieneNor" label="基本满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="personalHygieneBad" label="不满意" align="center" show-overflow-tooltip
                    sortable />
                <el-table-column prop="personalHygieneRatio" align="center" show-overflow-tooltip sortable>
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
import { getCompany, getServiceArea } from "@/api/dictionaryApi";
import { getPublicSatisfyFoodList } from "@/api/statisticalForm/publicSatisfy";
import { downFilePOST } from "@/api/manage";
import { ElMessage } from "element-plus";
import moment from "moment";
import { exportData } from "@/utils/common-features";

/* 筛选表单数据start */
const formData = reactive({
    serviceAreaIdList:[],
    companyIdList:[],
    orderSuffix:'', // 排序方向
    orderBy:'', // 排向项
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
    let res = await getPublicSatisfyFoodList(parmas);
    if (res.code == 200) {
        tableData.value = res.data.records;
        total.value = res.data.total;
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
    exportData("/statisticalForm/publicSatisfy/food/exportXls", "餐饮服务评价报表", params);
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
// 查询重置
function onReset() {
    Object.keys(formData).map((key) => {
        formData[key] = null;
    });
    page.value = 1;
    pageSize.value = 10;
    checkTime.value = [];
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

// // 计算满意度
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
