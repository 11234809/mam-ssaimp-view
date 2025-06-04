<!--
 * @Descripttion: 断面流量获取及服务区卡口数据与断面流量对比统计
 * @version: 
 * @Author: ysl
 * @Date: 2025-02-24 11:05:22
 * @LastEditors: ysl
 * @LastEditTime: 2025-04-18 15:39:20
-->
<template>
    <div class="section-flow-report">
        <!-- 筛选项 -->
        <el-form inline :model="searchForm" class="custom_form" label-width="130px" label-position="right" label-suffix=":">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="服务区" class="form_item">
                        <el-select 
                            v-model="searchForm.serviceAreaId" 
                            placeholder="请选择服务区" 
                            filterable 
                            clearable
                            multiple
                            collapse-tags
                            collapse-tags-tooltip
                            :max-collapse-tags="1"
                            @change="checkSelect($event, 'serviceAreaId')" 
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
                    <el-form-item label="日期" class="form_item">
                        <el-date-picker 
                            v-model="searchForm.timeRange" 
                            type="daterange" 
                            range-separator="~" 
                            value-format="YYYY-MM-DD" 
                            start-placeholder="请选择开始时间" 
                            end-placeholder="请选择结束时间" 
                            @change="checkDate($event, 'timeRange')" 
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item class="form_item btn">
                        <el-button type="primary" @click="getSearchData">查询</el-button>
                        <el-button type="primary" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 功能按钮组 -->
        <div class="func_btn_box">
            <el-button type="primary" @click="handleExcel">导出</el-button>
        </div>
        <el-table 
            ref="reportTableRef" 
            class="custom_table" 
            table-layout="auto" 
            :data="tableData" 
            style="width: 100%" 
            v-loading="tableLoading"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="index" label="序号" width="80" align="center" fixed/>
            <el-table-column prop="serviceAreaName" label="服务区" align="left" show-overflow-tooltip min-width="180" fixed="left" />
            <!-- <el-table-column prop="gantryCode" label="断面编码" align="left" show-overflow-tooltip min-width="160" /> -->
            <el-table-column prop="enterTotalCount" label="驶入车流量" align="center" sortable show-overflow-tooltip min-width="120" />
            <el-table-column prop="exitTotalCount" label="驶出车流量" align="center" sortable show-overflow-tooltip min-width="120" />
            <el-table-column prop="gantryTotalCount1" label="门架天线车流量" align="center" sortable show-overflow-tooltip min-width="140" />
            <el-table-column prop="gantryTotalRate1" label="门架天线驶入率(%)" align="center" sortable show-overflow-tooltip min-width="180" />
            <el-table-column prop="gantryTotalCount2" label="门架牌识车流量" align="center" sortable show-overflow-tooltip min-width="140" />
            <el-table-column prop="gantryTotalRate2" label="门架牌识驶入率(%)" align="center" sortable show-overflow-tooltip min-width="180" />
            <el-table-column prop="enterDangerCount" label="驶入危化品车流量" align="center" sortable show-overflow-tooltip min-width="140" />
            <el-table-column prop="exitDangerCount" label="驶出危化品车流量" align="center" sortable show-overflow-tooltip min-width="140" />
            <el-table-column prop="gantryDangerCount1" label="门架天线危化品车流量" align="center" sortable show-overflow-tooltip min-width="180" />
            <el-table-column prop="gantryDangerRate1" label="门架天线危化品驶入率(%)" align="center" sortable show-overflow-tooltip min-width="200" />
            <el-table-column prop="gantryDangerCount2" label="门架牌识危化品车流量" align="center" sortable show-overflow-tooltip min-width="180" />
            <el-table-column prop="gantryDangerRate2" label="门架牌识危化品驶入率(%)" align="center" sortable show-overflow-tooltip min-width="200" />
            <el-table-column prop="totalCountY" label="黄色车牌数" align="center" sortable min-width="140" />
            <el-table-column prop="totalCountB" label="蓝色车牌数" align="center" sortable min-width="140" />
            <el-table-column prop="totalCountG" label="绿色车牌数" align="center" sortable min-width="140" />
            <el-table-column prop="totalCountW" label="白色车牌数" align="center" sortable min-width="140" />
            <el-table-column prop="avgStayMin" label="车辆平均停留时长(分钟)" align="center" sortable min-width="280" />
            <el-table-column prop="matchCount" label="匹配数" align="center" sortable min-width="120" />
            <el-table-column prop="matchRate" label="匹配率(%)" align="center" sortable min-width="140">
                <template #header="scope">
                    <div class="inlineBox">
                        匹配率(%)
                        <el-tooltip content="匹配率=匹配数/（（驶入车流量+驶出车流量）/2）" placement="top" effect="dark">
                            <el-icon color="#E6A23C">
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
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
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getTableData, getNormalOptions, getServiceAreaList, hanldExport } from '@/api/sectionFlowReportApi.js';
import moment from 'moment';

onMounted(() => {
    getTableList();
    getSelectList();
});

const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数
const tableLoading = ref(false); // 表格加载

const reportTableRef = ref(null); // 列表引用
const tableData = ref([]); // 列表数据
const serviceAreaList = ref([]); // 服务区列表
const checkNum = ref(0);  // 已选择条数
const dictionaryKey = ref(true);  // 导出是否选择数据
let selectionRow = reactive([]);
let nowDate = moment(Date.now()).subtract(1, 'day').format('YYYY-MM-DD');
let nowStartDate = moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
let nowEndDate = moment(new Date().setHours(23, 59, 59, 999)).format('YYYY-MM-DD HH:mm:ss');
let searchForm = reactive({
    // 自定义查询条件
    serviceAreaId: "", // 服务区Id
    serviceAreaIds: "", // 服务区Id
    serviceAreaNameStr: "", // 服务区Name
    serviceAreaList: [],
    timeRange: [nowDate, nowDate], // 日期
    startTime: nowDate, // 开始日期
    endTime: nowDate, // 结束日期
});
// 获取数据表格
function getTableList() {
    let data = {
        index: page.value, 
        size: pageSize.value, 
        serviceAreaIds: searchForm.serviceAreaIds, 
        startTime: searchForm.startTime, 
        endTime: searchForm.endTime, 
    }
    tableLoading.value = true;
    getTableData(data).then(({ code, data, message }) => {
        if (code === 200) {
            let tableList = data.records;
            tableList.map((item) => {
                Object.keys(item).forEach((key) => {
                    if (item[key] == null) {
                        item[key] = "-";
                    }
                });
            })
            tableData.value = tableList;
            total.value = data.total;
            tableLoading.value = false;
        } else{
            tableLoading.value = false;
            ElMessage.warning(message);
        }
    }).catch((err) => {
        tableLoading.value = false;
        ElMessage.error(err.message);
    });
}
// 获取下拉列表
function getSelectList() {
    // 获取服务区下拉列表
    getServiceAreaList(null).then(({ code, data }) => {
        if (code === 200) {
            let areaList = data.records;
            areaList.forEach((item) => {
                item.code = item.value;
                item.name = item.label;
            });
            serviceAreaList.value = areaList;
        } else{
            ElMessage.warning(data.message);
        }
    }).catch((err) => {
        ElMessage.error(err.message);
    });
}
// 选择下拉框变化
function checkSelect(data, type) {
    if (type == "serviceAreaId") {
        let serviceAreaIdStr = data.toString()
        // name
        let areaList = serviceAreaList.value;
        let areaNameArr = [];
        areaList.forEach((item) => {
            data.forEach((itemId) => {
                if (item.code == itemId) {
                    areaNameArr.push(item.name)
                }
            })
        })
        let serviceAreaNameStr = areaNameArr.toString()
        // 赋值
        searchForm.serviceAreaIds = serviceAreaIdStr;
        searchForm.serviceAreaNameStr = serviceAreaNameStr;
        if (serviceAreaIdStr == "") {
            searchForm.serviceAreaList = [];
        } else {
            searchForm.serviceAreaList = serviceAreaIdStr.split(",");
        }
    }
}
// 选择时间变化
function checkDate(data, type) {
    if (type == "timeRange") {
        if (data && data.length > 0) {
            searchForm.startTime = data[0];
            searchForm.endTime = data[1];
        } else {
            searchForm.startTime ="";
            searchForm.endTime = "";
        }
    }
}
// 查询
function getSearchData() {
    page.value = 1;
    pageSize.value = 10;
    getTableList()
}
// 重置
function onReset() {
    page.value = 1;
    pageSize.value = 10;
    // 重置自定义表单参数赋值
    Object.keys(searchForm).forEach((key) => {
        if (typeof(searchForm[key]) == "string") {
            searchForm[key] = "";
        } else {
            searchForm[key] = [];
        }
    });
    // 时间-当天
    searchForm.timeRange = [nowDate, nowDate], // 统计时间
    searchForm.startTime = nowDate, // 开始统计时间
    searchForm.endTime = nowDate, // 结束统计时间
    getTableList()
}
// 多选时获取选择行id
function handleSelectionChange(selection) {
    selectionRow = JSON.parse(JSON.stringify(selection));
    checkNum.value = selectionRow.length;
    if (selectionRow.length > 0) {
        dictionaryKey.value = false;
    } else {
        dictionaryKey.value = true;
    }
}
// 清空选择列表
function tableCheckClear() {
    reportTableRef.value.clearSelection();
    handleSelectionChange([]);
}
// 导出
function handleExcel() {
    let exportTip = "";
    let exportParam = {}
    if (dictionaryKey.value) {
        exportTip = "确认是否导出全部数据?";
        exportParam = {
            serviceAreaIds: searchForm.serviceAreaIds, 
            startTime: searchForm.startTime, 
            endTime: searchForm.endTime, 
        }
    } else {
        exportTip = "确认是否导出选中数据?";
        let ids = selectionRow.map((item) => item.id);
        exportParam = {
            checkIds: ids.toString(),
        }
    }
    ElMessageBox.confirm(exportTip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async () => {
        hanldExport(exportParam).then((data) => {
            const systemTime = moment().format("YYYY-MM-DD");
            var blob = new Blob([data], { type: 'application/vnd.ms-excel' });
            var downloadElement = document.createElement("a");
            var href = window.URL.createObjectURL(blob); // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = `断面流量统计_${systemTime}.xlsx`; // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); // 点击下载
            document.body.removeChild(downloadElement); // 下载完成移除元素
            window.URL.revokeObjectURL(href);
        }).catch((err) => {
            ElMessage.error(err.message);
        });
    }).catch(() => {
        ElMessage.info("已取消");
    });
}
// 分页分页大小改变触发
function handleSizeChange() {
    pageSize.value = val;
    getTableList();
}
// 前后页变动时候触发
function handleCurrentChange() {
    page.value = val;
    getTableList();
}

</script>

<style scoped lang='less'>
#section-flow-report .el-button--danger.is-plain:hover {
    color: #fff !important;
}

.section-flow-report {
    .custom_form {
        margin-bottom: 10px;

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
    .inlineBox {
        display: inline;
        align-items: center;
    }
}
</style>
