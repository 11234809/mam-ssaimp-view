<!-- 日常记录报表 -->

<template>
    <div class="staff-list_page" id="staff-list">
        <!-- 筛选项 -->
        <el-form inline :model="formData" class="custom_form" label-width="130px" label-position="right"
            label-suffix=":">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="统计纬度" class="form_item">
                        <el-radio-group v-model="dimension" @change="selectTimeTypeChange">
                            <el-radio-button :label="0">日</el-radio-button>
                            <el-radio-button :label="1">周</el-radio-button>
                            <el-radio-button :label="2">月</el-radio-button>
                            <el-radio-button :label="3">季度</el-radio-button>
                            <el-radio-button :label="4">年度</el-radio-button>
                            <el-radio-button :label="5">其他</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="dimension == 0">
                    <el-form-item label="统计时间" class="form_item">
                        <el-date-picker style="width:100%" value-format="YYYY-MM-DD" v-model="dateData.date" type="date" :clearable="false" :editable="false"
                            placeholder="请选择统计时间" />
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="dimension == 1">
                    <el-form-item label="统计时间" class="form_item">
                        <el-date-picker style="width:100%" :format="weekFormat" value-format="YYYY-MM-DD" v-model="dateData.week" type="week" :clearable="false" :editable="false"
                            placeholder="请选择统计时间" />
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="dimension == 2">
                    <el-form-item label="统计时间" class="form_item">
                        <el-date-picker style="width:100%" value-format="YYYY-MM" v-model="dateData.month" type="month" :clearable="false" :editable="false"
                            placeholder="请选择统计时间" />
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="dimension == 3">
                    <el-form-item label="统计时间" class="form_item">
                        <DateQuarter
                            style="width: 100%"
                            ref="seasonSelect"
                            placeholder="请选择季度"
                            :editable="false"
                            @chooseSeason="seasonChange"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="dimension == 4">
                    <el-form-item label="统计时间" class="form_item">
                        <el-date-picker style="width:100%" value-format="YYYY" v-model="dateData.year" type="year" :clearable="false" :editable="false"
                            placeholder="请选择统计时间" />
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="dimension == 5">
                    <el-form-item label="统计时间" class="form_item">
                        <el-date-picker style="width:100%" value-format="YYYY-MM-DD" v-model="dateData.dates" type="daterange" :clearable="false" :editable="false"
                            range-separator="~"
                            start-placeholder="请选择开始日期" end-placeholder="请选择结束日期"
                            placeholder="请选择统计时间" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :span="8" v-for="formItem in formItemList">
                    <el-form-item :label="formItem.label" class="form_item">
                        <el-select collapse-tags collapse-tags-tooltip v-if="formItem.type === 'select'"
                            v-model="formData[formItem.prop]" multiple filterable 
                            :reserve-keyword="false" :placeholder="`请选择${formItem.label}`"
                            clearable @change="handleChangeCompany(formItem.prop)">
                            <el-option v-for="(item, index) in formItem.options" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="服务区方向" class="form_item">
                        <el-radio-group v-model="formData.direction">
                            <el-radio :label="0">整体</el-radio>
                            <el-radio :label="1">进/出城</el-radio>
                            <el-radio :label="2">进城</el-radio>
                            <el-radio :label="3">出城</el-radio>
                        </el-radio-group>
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
            <el-button type="primary" @click="handleExcel">导出</el-button>
        </div>

        <el-table class="custom_table" ref="tableRef" table-layout="auto" :data="tableData" style="width: 100%"
            :span-method="arraySpanMethod" :cell-class-name="cellClassName" @sort-change="handleSortChange">
            <el-table-column :label="title" align="center">
                <el-table-column label="序号" type="index" :index="(i) => (page - 1) * pageSize + i" width="80"
                    align="center" />
                <el-table-column label="服务区名称" prop="serviceAreaName" align="center" />
                <el-table-column label="公司名称" prop="companyName" align="center" />
                <el-table-column label="车流量日均情况（辆）" align="center">
                    <el-table-column label="总车流" prop="carTraffic" align="center" sortable="custom" />
                    <el-table-column label="新能源车" prop="newEnergyTraffic" align="center" sortable="custom" />
                    <el-table-column label="货车" prop="freightTraffic" align="center" sortable="custom" />
                </el-table-column>
                <el-table-column label="日均客流量（人）" prop="guestTraffic" align="center" sortable="custom" />
                <el-table-column label="运行收入日均情况（万元）" align="center">
                    <el-table-column label="油品收入" prop="oilIncome" align="center" sortable="custom" />
                    <el-table-column label="非油品收入" prop="nonOilIncome" align="center" sortable="custom" />
                    <el-table-column label="收入总计" prop="incomeTotal" align="center" sortable="custom" />
                </el-table-column>
                <el-table-column label="其他日均情况" align="center">
                    <el-table-column label="小车换电(辆)" prop="exPassengerNumber" align="center" sortable="custom" />
                    <el-table-column label="重卡换电(辆)" prop="exTruckNumber" align="center" sortable="custom" />
                    <el-table-column label="加气量(吨)" prop="gasNumber" align="center" sortable="custom" />
                    <el-table-column label="光伏发电量(KWH)" prop="photovoltaicNumber" align="center" sortable="custom" />
                    <el-table-column label="光伏发电时长(小时)" prop="photovoltaicTime" align="center" sortable="custom" />
                </el-table-column>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination_box">
            <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
                layout="total, prev, pager, next, sizes, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from "vue";
import moment from "moment";
import { ElMessage } from "element-plus";
import { queryPage } from "@/api/statisticalForm/dailyRecord.js";
import { getCompany, getServiceAreaInfo} from "@/api/dictionaryApi.js";
import { downFilePOST } from "@/api/manage";
import { DateQuarter } from "mam-base-ui";
const title = ref('')
const dateData = ref({
    date: moment().format('YYYY-MM-DD'),
    week: moment().format('YYYY-MM-DD'),
    month: moment().format('YYYY-MM'),
    quarter: moment().quarter(),
    year: moment().format('YYYY'),
    dates:[moment().format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')]
});
const seasonSelect = ref();
const getTitle = () => {
    let result = "服务区运行数据";
    let appendStr = '';
    let endDate = new Date(formData.endTime);
    let startDate = new Date(getStartTime());
    switch (dimension.value) {
        case 0:
            appendStr = '(' + endDate.toLocaleDateString().replace(/\//g, '.') + ')';
            break;
        case 1:
            //这个月第几周
            let week = Math.ceil((endDate.getDate() + 6 - endDate.getDay()) / 7) - 1;
            appendStr = '(' + (endDate.getMonth() + 1) + '月第' + week + '周)';
            break;
        case 2:
            appendStr = '(' + (endDate.getMonth() + 1) + '月)';
            break;
        case 3:
            //今年第几季度
            let season = Math.ceil((endDate.getMonth() + 1) / 3);
            appendStr = '(' + (endDate.getFullYear()) + '年第' + season + '季度)';
            break;
        case 4:
            appendStr = '(' + (endDate.getFullYear()) + '年)';
            break;
        default:
            appendStr = '(' + startDate.toLocaleDateString().replace(/\//g, '.') + '~' + endDate.toLocaleDateString().replace(/\//g, '.') + ')';
            break;
    }
    title.value = result + appendStr;
}
const cellClassName = ({ row, column, rowIndex, columnIndex }) => {
    if (rowIndex === 0) {
        return columnIndex == 0 ? '' : 'daily-record-first-row';
    }
    if (columnIndex === 8) {
        return 'daily-record-ninth-column';
    }
    return '';
}
const handleSortChange = ({ prop, order }) => {
    if (order === 'ascending') {
        tableData.value = [
            tableData.value[0],  // 保留第一行数据
            ...tableData.value.slice(1).sort((a, b) => {
                if (a[prop] < b[prop]) return -1;
                if (a[prop] > b[prop]) return 1;
                return 0;
            })
        ];
    } else if (order === 'descending') {
        tableData.value = [
            tableData.value[0],  // 保留第一行数据
            ...tableData.value.slice(1).sort((a, b) => {
                if (a[prop] > b[prop]) return -1;
                if (a[prop] < b[prop]) return 1;
                return 0;
            })
        ];
    } else {
        tableData.value = defaultTabelData;
    }
};
const queryFormItem = (listOptions) => {
    return [
        {
            type: "select",
            options: listOptions.companyList,
            label: "公司",
            prop: "companyId",
        },
        {
            type: "select",
            options: listOptions.serviceAreaList,
            label: "服务区",
            prop: "serviceAreaId",
        },
    ];
};
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const date = now.getDate();
const initEndTime = `${year}-${month >= 10 ? month : ('0' + month)}-${date >= 10 ? date : ('0' + date)}`;
const formData = reactive({
    serviceAreaId: [], // 服务区
    companyId: [],// 公司
    // 结束时间 YYYY-MM-DD
    endTime: initEndTime,
    direction: 0
});
const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
    if (row.companyName == '全路网合计') {
        if (columnIndex === 2) {
            return [1, 3]
        } else if (columnIndex === 0 || columnIndex === 1) {
            return [0, 0]
        }
    }
}
// 搜索表单
const formItemList = computed(() => {
    return queryFormItem(listOptions);
});

const tableRef = ref(null); // 列表引用
const tableData = ref([]); // 列表数据
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数
const weekFormat= ref('YYYY [年 第] ww [周]');
let defaultTabelData = [];

const dimension = ref(0)// 维度

const listOptions = reactive({
    companyList: [],
    serviceAreaList: [],
});

const getTableNameByDimension = () => {
    let result = '';
    switch (dimension.value) {
        case 0:
            result = '日报';
            break;
        case 1:
            result = '周报';
            break;
        case 2:
            result = '月报';
            break;
        case 3:
            result = '季报';
            break;
        case 4:
            result = '年报';
            break;
        default:
            result = '其他';
            break;
    }
    return result;
}
// 列表导出
const handleExcel = () => {
    // dimension
    let fileName = "运行数据报表-" + getTableNameByDimension() + "-" + (initEndTime.replace(/-/g, ""));
    let resultDate = getResultDate();
    let startDate = resultDate.startDate;
    let endDate = resultDate.endDate;
    downFilePOST('/api/statisticalForm/dailyRecord/export', {
        index: -1,
        size: -1,
        startDate, endDate,
        serviceAreaId: formData.serviceAreaId.join(','),
        companyId: formData.companyId.join(','),
        directionFlag: formData.direction,
        dimFlag: dimension.value
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
const getStartTime = () => {
    let result;
    switch (dimension.value) {
        case 0:
            result = formData.endTime;
            break;
        case 1:
            //倒推一周
            result = new Date(formData.endTime).getTime() - 6 * 24 * 60 * 60 * 1000;
            break;
        case 2:
            //倒推一个月
            result = new Date(formData.endTime).getTime() - 29 * 24 * 60 * 60 * 1000;
            break;
        case 3:
            //倒推一个季度
            result = new Date(formData.endTime).getTime() - 89 * 24 * 60 * 60 * 1000;
            // case 'other':
            break;
        case 4:
            //倒推一年
            result = new Date(formData.endTime).getTime() - 364 * 24 * 60 * 60 * 1000;
            break;
        default:
            result = formData.startTime || formData.endTime;
            break;
    }
    const now = new Date(result);
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const initEndTime = `${year}-${month >= 10 ? month : ('0' + month)}-${date >= 10 ? date : ('0' + date)}`;
    return initEndTime;
}
const getResultDate = () => {
    let result = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
    };
    switch (dimension.value) {
        case 0:
            return {
                startDate:  moment(dateData.value.date).format('YYYY-MM-DD'),
                endDate: moment(dateData.value.date).format('YYYY-MM-DD')
            }
        case 1:
            return {
                startDate:  moment(dateData.value.week).startOf('isoWeek').format('YYYY-MM-DD'),
                endDate: moment(dateData.value.week).endOf('isoWeek').format('YYYY-MM-DD')
            }
        case 2:
            return {
                startDate:  moment(dateData.value.month).startOf('month').format('YYYY-MM-DD'),
                endDate: moment(dateData.value.month).endOf('month').format('YYYY-MM-DD')
            }
        case 3:
            return {
                startDate: dateData.value.quarter[0],
                endDate: dateData.value.quarter[1]
            }
        case 4:
            return {
                startDate:  moment(dateData.value.year).startOf('year').format('YYYY-MM-DD'),
                endDate: moment(dateData.value.year).endOf('year').format('YYYY-MM-DD')
            }
        default:
            return {
                startDate: dateData.value.dates[0],
                endDate: dateData.value.dates[1]
            }
    }
}
const seasonChange = (year, season, dataValue) => {
    let value = [];
    if (season == 1) {
        value = [`${year}-01-01`, `${year}-03-31`];
    } else if (season == 2) {
        value = [`${year}-04-01`, `${year}-06-30`];
    } else if (season == 3) {
        value = [`${year}-07-01`, `${year}-09-30`];
    } else if (season == 4) {
        value = [`${year}-10-01`, `${year}-12-31`];
    }
    dateData.value.quarter = value;
}

const selectTimeTypeChange = (val) => {
    if (dimension.value == "0") {
        dateData.value.date = moment().format("YYYY-MM-DD");
    } else if (dimension.value == "1") {
        dateData.value.week = moment().format("YYYY-MM-DD");
    } else if (dimension.value == "2") {
        dateData.month = moment().format("YYYY-MM");
    } else if (dimension.value == "3") {
        nextTick(() => {
            let nowYear = moment().year();
            let nowQuarter = moment().quarter();
            seasonSelect.value.getDefaultTimeNow();
            seasonChange(nowYear, nowQuarter, "");
        });
    } else if (dimension.value == "4") {
        dateData.year = moment().format("YYYY");
    } else if (dimension.value == "5") {
        dateData.dates = [
            moment().format("YYYY-MM-DD"),
            moment().format("YYYY-MM-DD"),
        ];
    }
}

const getData = async () => {
    // 查询
    let resultDate = getResultDate();
    let startDate = resultDate.startDate;
    let endDate = resultDate.endDate;
    formData.endTime = endDate;
    queryPage({
        index: page.value,
        size: pageSize.value,
        startDate, endDate,
        serviceAreaId: formData.serviceAreaId.join(','),
        companyId: formData.companyId.join(','),
        directionFlag: formData.direction
    }).then((res) => {
        if (res.code === 200) {
            getTitle();
            tableData.value = res.data.records;
            defaultTabelData = JSON.parse(JSON.stringify(res.data.records));
            total.value = res.data.total;
        } else {
            ElMessage.error(res.message);
        }
    });
};
const handleChangeCompany = (type) => {
    if (type != 'companyId') return false;
    formData.serviceAreaId = [];
    listOptions.serviceAreaList = [];
    // 获取公司
    getServiceAreaInfo(formData.companyId.join(','))
        .then(({ code, data }) => {
            if (code == 200) {
                listOptions.serviceAreaList = data;
            }
        })
        .catch((err) => {
            console.log(err);
        });
}
// 获取字典数据
const getDictionary = () => {
    getCompany().then(({ code, data }) => {
            if (code == 200) {
                listOptions.companyList = data.records;
            }
        })
        .catch((err) => {
            console.log(err);
        });
    // 获取服务区
    getServiceAreaInfo()
        .then(({ code, data }) => {
            if (code == 200) {
                listOptions.serviceAreaList = data;
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

// 重置查询
const onReset = () => {
    formData.serviceAreaId = [];// 服务区
    formData.companyId = [];// 公司
    dateData.value.date = moment().format('YYYY-MM-DD'),
    dateData.value.week = moment().format('YYYY-MM-DD'),
    dateData.value.month = moment().format('YYYY-MM'),
    dateData.value.quarter = moment().quarter(),
    dateData.value.year =  moment().format('YYYY'),
    dateData.value.dates = [moment().format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')]
    formData.direction = 0
    dimension.value = 0;
    page.value = 1; // 重置页码
    pageSize.value = 10; // 重置每页条数
    getData(); // 重新查询
};

// 分页
const handleCurrentChange = (val) => {
    page.value = val;
    getData();
};

// 每页条数
const handleSizeChange = (val) => {
    pageSize.value = val;
    getData();
};

onMounted(() => {
    getDictionary();
    getData();
});
</script>
<style lang="less">

.daily-record-first-row {
    color: red;
}

.daily-record-ninth-column {
    color: red;
}
</style>
<style lang="less" scoped>
#staff-list .el-button--danger.is-plain:hover {
    color: #fff !important;
}

.staff-list_page {
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

    .func_btn_box {
        margin-bottom: 10px;
    }

    .total-box {
        .total {
            display: flex;
            text-align: center;
            margin-bottom: 10px;

            .title {
                min-width: 240px;
                font-size: 20px;
                font-weight: 600;
                height: 60px;
                line-height: 60px;
                border: 1px solid #ccc;
                padding: 0 10px;
            }

            .detail {
                display: flex;
                height: 60px;

                .single {
                    width: 135px;
                    border: 1px solid #ccc;
                    border-left: 0;
                    line-height: 1.5;

                    .single-one {
                        font-size: 16px;
                    }

                    .single-two {
                        font-size: 18px;
                    }
                }
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
