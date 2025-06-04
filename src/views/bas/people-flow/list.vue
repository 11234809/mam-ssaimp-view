<!--
 * @Descripttion: 服务区人流量客流量统计
 * @version: 
 * @Author: ysl
 * @Date: 2025-02-24 11:05:22
 * @LastEditors: ysl
 * @LastEditTime: 2025-03-28 11:35:42
-->
<template>
    <div class="people-flow">
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
                    <el-form-item label="行政区划" class="form_item">
                        <el-cascader
                            style="width: 100%"
                            v-model="searchForm.xzxqId"
                            filterable
                            clearable
                            :props="cascaderProps"
                            collapse-tags
                            collapse-tags-tooltip
                            :max-collapse-tags="1"
                            :options="xzxqList"
                            :show-all-levels="true"
                            placeholder="请选择行政区划"
                            @change="checkSelect($event, 'xzxqId')" 
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="统计时间" class="form_item">
                        <el-date-picker 
                            v-model="searchForm.statTimeRange" 
                            type="daterange" 
                            range-separator="~" 
                            value-format="YYYY-MM-DD" 
                            :default-time="defaultTime"
                            start-placeholder="请选择开始时间" 
                            end-placeholder="请选择结束时间" 
                            @change="checkDate($event, 'statTimeRange')" 
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
            ref="peopleTableRef" 
            class="custom_table" 
            table-layout="auto" 
            :data="tableData" 
            style="width: 100%" 
            v-loading="tableLoading"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="name" label="服务区" align="left" show-overflow-tooltip min-width="200" />
            <el-table-column prop="total" label="总数" align="center" sortable show-overflow-tooltip min-width="80" />
            <el-table-column prop="ageChild" label="小孩数量" align="center" sortable show-overflow-tooltip min-width="110" />
            <el-table-column prop="ageYoung" label="青年数量" align="center" sortable show-overflow-tooltip min-width="110" />
            <el-table-column prop="ageMiddle" label="中年数量" align="center" sortable show-overflow-tooltip min-width="110" />
            <el-table-column prop="ageOld" label="老年数量" align="center" sortable show-overflow-tooltip min-width="110" />
            <el-table-column prop="ageOther" label="其他年龄数量" align="center" sortable show-overflow-tooltip min-width="120" />
            <el-table-column prop="genderMale" label="男性数量" align="center" sortable show-overflow-tooltip min-width="110" />
            <el-table-column prop="genderFemale" label="女性数量" align="center" sortable show-overflow-tooltip min-width="110" />
            <el-table-column prop="genderOther" label="其他性别数量" align="center" sortable show-overflow-tooltip min-width="120" />
            <el-table-column prop="day" label="日期" align="center" sortable show-overflow-tooltip min-width="160" />
            <el-table-column prop="statTime" label="统计时间" align="center" sortable show-overflow-tooltip min-width="180" />
            <el-table-column prop="statType" label="统计类型" align="center" show-overflow-tooltip min-width="100" />
            <el-table-column prop="hour" label="小时" align="center" sortable show-overflow-tooltip min-width="100" />
            <el-table-column prop="xzxq" label="行政区划" align="center" show-overflow-tooltip min-width="100" />
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
import { ref, reactive, onMounted, nextTick ,onActivated} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getTableData, getServiceAreaList, hanldExport } from '@/api/peopleFlowApi.js';
import cityArea from '../danger-car/cityArea.js';
import moment from 'moment';
import { useRoute } from 'vue-router';
const route = useRoute();
onMounted(() => {
    console.log(666);
    roterData();
    getTableList();
    getSelectList();
});

const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数
const tableLoading = ref(false); // 表格加载

const peopleTableRef = ref(null); // 列表引用
const tableData = ref([]); // 列表数据
const serviceAreaList = ref([]); // 服务区列表
const xzxqList = ref([]); // 行政区列表
const cascaderProps = ref({
    multiple: true, 
    checkStrictly: false, 
    expandTrigger: "hover", 
    emitPath: false,
    label: "label",
    value: "label"
})
const checkNum = ref(0);  // 已选择条数
var dictionaryKey = reactive(true);  // 导出是否选择数据
const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
]
let selectionRow = reactive([]);
let nowDate = moment(Date.now()).format('YYYY-MM-DD');
let nowStartDate = moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
let nowEndDate = moment(new Date().setHours(23, 59, 59, 999)).format('YYYY-MM-DD HH:mm:ss');
let searchForm = reactive({
    // 自定义查询条件
    serviceAreaList: [],
    serviceAreaId: "", // 服务区Id
    serviceAreaIdStr: "", // 服务区Id
    serviceAreaNameStr: "", // 服务区Name
    xzxqList: [],
    xzxqId: "", // 行政区划Id
    xzxqIdStr: "", // 行政区划Id
    xzxqNameStr: "", // 行政区划Name
    statTimeRange: [null, null], // 统计时间
    startTime: null, // 开始统计时间
    endTime: null, // 结束统计时间
});
onActivated(() => {
    roterData();
    getTableList();
    getSelectList();
})
const roterData  = () => {
    // （注：跳转页面是中文筛选，故传中文）
    searchForm.serviceAreaId = route.query && route.query.serviceAreaName ? route.query.serviceAreaName.split(",") : [];
    searchForm.serviceAreaIdStr = route.query && route.query.serviceAreaName ? route.query.serviceAreaName : "";
    searchForm.serviceAreaList = route.query && route.query.serviceAreaName ? route.query.serviceAreaName.split(",") : [];
    searchForm.serviceAreaNameStr = route.query && route.query.serviceAreaName ? route.query.serviceAreaName : "";
    if(route.query && route.query.startTime && route.query.endTime) {
        searchForm.statTimeRange = [route.query.startTime, route.query.endTime];
        searchForm.startTime = route.query.startTime;
        searchForm.endTime = route.query.endTime;
    } else if(route.query && !route.query.startTime && !route.query.endTime && route.query.selectTimeType) {
        searchForm.statTimeRange = [null, null];
        searchForm.startTime = null;
        searchForm.endTime = null;
    }else{
        searchForm.statTimeRange =[nowDate, nowDate];
        searchForm.startTime = nowDate;
        searchForm.endTime = nowDate;
    }
}
// 获取数据表格
function getTableList() {
    let data = {
        index: page.value, 
        size: pageSize.value,
        ...searchForm
    }
    tableLoading.value = true;
    if(route.query.serviceAreaId) { //服务区
        data.serviceAreaId = route.query.serviceAreaId;
    }
    getTableData(data).then(({ code, data, message }) => {
        if (code === 200) {
            tableLoading.value = false;
            tableData.value = data.records;
            total.value = data.total;
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
    // 获取重庆行政区
    let cityAreaList = cityArea.provinceList;
    xzxqList.value = cityAreaList;
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
        searchForm.serviceAreaIdStr = serviceAreaIdStr;
        searchForm.serviceAreaNameStr = serviceAreaNameStr;
        if (serviceAreaIdStr == "") {
            searchForm.serviceAreaList = [];
        } else {
            searchForm.serviceAreaList = serviceAreaIdStr.split(",");
        }
    } else if (type == "xzxqId") {
        let xzxqIdArr = []
        Object.keys(data).forEach((key) => {
            xzxqIdArr.push(data[key])
        });
        searchForm.xzxqIdStr = xzxqIdArr.toString();
        searchForm.xzxqNameStr = xzxqIdArr.toString();
        searchForm.xzxqList = xzxqIdArr;
    } 
}
// 选择时间变化
function checkDate(data, type) {
    if (type == "timeRange") {
        if (data && data.length > 0) {
            searchForm.timeStart = data[0];
            searchForm.timeEnd = data[1];
        } else {
            searchForm.timeStart ="";
            searchForm.timeEnd = "";
        }
    } else if (type == "statTimeRange") {
        if (data && data.length > 0) {
            searchForm.startTime = data[0];
            searchForm.endTime = data[1];
        } else {
            searchForm.startTime = "";
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
    getTableList()
}
// 多选时获取选择行id
function handleSelectionChange(selection) {
    selectionRow = JSON.parse(JSON.stringify(selection));
    checkNum.value = selection.length;
    if (selection.length > 0) {
        dictionaryKey = false;
    } else {
        dictionaryKey = true;
    }
}
// 清空选择列表
function tableCheckClear() {
    peopleTableRef.value.clearSelection();
    handleSelectionChange([]);
}
// 导出
function handleExcel() {
    let exportTip = "";
    let exportParam = {}
    if (dictionaryKey) {
        exportTip = "确认是否导出全部数据?";
        exportParam = {
            ...searchForm
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
            downloadElement.download = `客流量_${systemTime}.xlsx`; // 下载后文件名
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
function handleSizeChange(val) {
    pageSize.value = val;
    getTableList();
}
// 前后页变动时候触发
function handleCurrentChange(val) {
    page.value = val;
    getTableList();
}

</script>

<style scoped lang='less'>
#people-flow .el-button--danger.is-plain:hover {
    color: #fff !important;
}

.people-flow {
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
}
</style>
