<!-- @format -->

<template>
    <div class="staff-list_page" id="staff-list">
        <!-- 筛选项 -->
        <el-form inline :model="staffFormData" class="custom_form" label-width="130px" label-position="right"
            label-suffix=":">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="服务区" class="form_item">
                        <el-select v-model="staffFormData.serviceAreaId" placeholder="请输入服务区名称" filterable clearable>
                            <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="服务区类型" class="form_item">
                        <el-select v-model="staffFormData.side" placeholder="请选择服务区类型" clearable>
                            <el-option v-for="(item, index) in sideList" :key="index" :label="item.name"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="选择时间" class="form_item">
                        <el-date-picker v-model="staffFormData.timeRange" type="daterange" range-separator="~"
                            value-format="YYYY-MM-DD" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
                            @change="checkDate($event)" />
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item class="form_item btn">
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
        <el-table class="custom_table" ref="tableRef" table-layout="auto" :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="company" label="公司" align="center" width="200" />
            <el-table-column prop="serviceAreaName" label="服务区" align="center" width="220" />
            <el-table-column prop="stourByS" label="保安应巡检点次" align="center" width="200" />
            <el-table-column prop="rtourByS" label="保安实际巡检点次" align="center" width="140" />
            <el-table-column prop="utourByS" label="保安未巡检点次" align="center" width="140">
                <template #default="scope">
                    <div v-if="scope.row.utourByS == 0 || scope.row.utourByS == '-'" class="pic_box">
                        {{ scope.row.utourByS }}
                    </div>
                    <el-button v-else type="danger" plain @click="handleExamine(scope.row)"
                        style="border-color: #f56c6c;">
                        <span style="width: 60px; text-overflow:ellipsis;overflow:hidden;">
                            {{ scope.row.utourByS }}
                        </span>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="stourByM" label="管理人员应巡检点次" align="center" width="180" />
            <el-table-column prop="rtourByM" label="管理人员实际巡检点次" align="center" width="180" />
            <el-table-column prop="utourByM" label="管理人员未巡检点次" align="center" width="180">
                <template #default="scope">
                    <div v-if="scope.row.utourByM == 0 || scope.row.utourByM == '-'" class="pic_box">
                        {{ scope.row.utourByM }}
                    </div>
                    <el-button v-else type="danger" plain @click="handleExamine1(scope.row)"
                        style="border-color: #f56c6c;">
                        <span style="width: 60px; text-overflow:ellipsis;overflow:hidden;">
                            {{ scope.row.utourByM }}
                        </span>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="stourByDevice" label="日巡检设备应巡检点次" align="center" width="180" />
            <el-table-column prop="rtourByDevice" label="日巡检设备实际巡检点次" align="center" width="180" />
            <el-table-column prop="utourByDevice" label="日巡检设备未巡检点次" align="center" width="180">
                <template #default="scope">
                    <div v-if="scope.row.utourByDevice == 0 || scope.row.utourByDevice == '-'" class="pic_box">
                        {{ scope.row.utourByDevice }}
                    </div>
                    <el-button v-else type="danger" plain @click="handleExamine2(scope.row)"
                        style="border-color: #f56c6c;">
                        {{ scope.row.utourByDevice }}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="sweekByDevice" label="周巡检设备应巡检点次" align="center" width="180" />
            <el-table-column prop="rweekByDevice" label="周巡检设备实际巡检点次" align="center" width="180" />
            <el-table-column prop="uweekByDevice" label="周巡检设备未巡检点次" align="center" width="180">
                <template #default="scope">
                    <div v-if="scope.row.uweekByDevice == 0 || scope.row.uweekByDevice == '-'" class="pic_box">
                        {{ scope.row.uweekByDevice }}
                    </div>
                    <el-button v-else type="danger" plain @click="handleExamine3(scope.row)"
                        style="border-color: #f56c6c;">
                        <span style="width: 60px; text-overflow:ellipsis;overflow:hidden; color: #f56c6c;">
                            {{ scope.row.uweekByDevice }}
                        </span>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="sdisinfect" label="应消毒点次" align="center" width="120" />
            <el-table-column prop="rdisinfect" label="实际消毒点次" align="center" width="120" />
            <el-table-column prop="udisinfect" label="未消毒点次" align="center" width="120">
                <template #default="scope">
                    <div v-if="scope.row.udisinfect == 0 || scope.row.udisinfect == '-'" class="pic_box">
                        {{ scope.row.udisinfect }}
                    </div>
                    <el-button v-else type="danger" plain @click="handleExamine4(scope.row)"
                        style="border-color: #f56c6c;">
                        <span style="width: 60px; text-overflow:ellipsis;overflow:hidden;">
                            {{ scope.row.udisinfect }}
                        </span>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination_box">
            <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
                layout="total, prev, pager, next, sizes, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
        <el-dialog class="custom_dialog" v-model="staffModalvVisible" :title="staffModalTitle" width="600"
            :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :destroy-on-close="true">
            <el-table class="custom_table" ref="tableRef" table-layout="auto" :data="stafftableDataSource"
                style="width: 100%" max-height="500">
                <el-table-column prop="areaName" label="未巡检区域" width="240" align="center" />
                <el-table-column prop="tourDate" label="未巡检日期" align="center" width="200" />
                <el-table-column prop="unTours" label="未巡检次数" align="center" width="120" />
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="handleClose">关闭</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { getBaseStaffList, exportXlsUrl } from '@/api/staffListApi.js';
import { downFilePOST } from '@/api/manage';
import moment from 'moment';
import { getServiceArea } from '@/api/dictionaryApi.js';

const tableRef = ref(null); // 列表引用
const tableData = ref([]); // 列表数据

let staffModalTitle = ref(' '); // 员工未巡检详情标题
let stafftableDataSource = ref([]); // 员工未巡检详情list
let nowDate = moment(Date.now()).format('YYYY-MM-DD');
let formData = reactive({
    // 自定义查询条件
    serviceAreaId: '', // 服务区
    side: '', // 服务区类型
    startTime: nowDate, // 开始时间，默认为当前日期
    endTime: nowDate, // 结束时间，默认为当前日期
});
let staffFormData = reactive({
    // 自定义查询条件
    serviceAreaId: '', // 服务区
    side: '', // 服务区类型
    timeRange: [nowDate, nowDate], // 时间周期，默认为当前日期范围
});
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数

const serviceAreaList = ref([]); // 服务区列表
const sideList = reactive([
    { name: '整体', code: 'ALL' },
    { name: '进城', code: 'RIGHT' },
    { name: '出城', code: 'LEFT' },
]); // 服务区类型列表

getDictionary();
getData();

// 列表导出
function handleExcel () {
    let fileName = '保安保洁管理报表';
    formData.serviceAreaId = staffFormData.serviceAreaId;
    formData.side = staffFormData.side;
    downFilePOST(exportXlsUrl, formData).then((data) => {
        if (!data) {
            ElMessage.warning('文件下载失败');
            return;
        }
        let excelData = data.data;
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([excelData], { type: 'application/vnd.ms-excel' }), fileName + '.xls');
        } else {
            let url = window.URL.createObjectURL(new Blob([excelData], { type: 'application/vnd.ms-excel' }));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', fileName + '.xls');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // 下载完成移除元素
            window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
    });
}

async function getData () {
    formData.serviceAreaId = staffFormData.serviceAreaId;
    formData.side = staffFormData.side;
    // 查询
    getBaseStaffList({ ...formData, pageNo: page.value, pageSize: pageSize.value }).then((res) => {
        if (res.code === 200) {
            res.data.records.forEach((item) => {
                // 服务区
                if (item.serviceAreaId) {
                    serviceAreaList.value.forEach((ite) => {
                        if (item.serviceAreaId === ite.id) {
                            item.serviceAreaId = ite.name;
                        }
                    });
                }
            });
            tableData.value = res.data.records;
            total.value = res.data.total;
        } else {
            ElMessage.error(res.message);
        }
    });
}

function handleClose () {
    staffModalvVisible.value = false;
}

// 获取字典数据
function getDictionary () {
    // 获取服务区
    getServiceArea()
        .then(({ code, data }) => {
            if (code === 200) {
                serviceAreaList.value = data.records;
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

// 重置查询
function onReset () {
    // 重置自定义表单参数赋值
    Object.keys(staffFormData).forEach((key) => {
        if (typeof (staffFormData[key]) == "string") {
            staffFormData[key] = "";
        } else {
            staffFormData[key] = [];
        }
    });
    // 重置自定义表单参数赋值
    Object.keys(formData).forEach((key) => {
        if (typeof (formData[key]) == "string") {
            formData[key] = "";
        } else {
            formData[key] = [];
        }
    });
    formData.startTime = nowDate; // 开始时间，默认为当前日期
    formData.endTime = nowDate; // 结束时间，默认为当前日期
    staffFormData.timeRange = [nowDate, nowDate]
    page.value = 1; // 重置页码
    pageSize.value = 10; // 重置每页条数
    getData(); // 重新查询
}

// 时间选择器数据转换
function checkDate (e) {
    formData.startTime = e[0];
    formData.endTime = e[1];
}

// 分页
function handleCurrentChange (val) {
    page.value = val;
    getData();
}

// 每页条数
function handleSizeChange (val) {
    pageSize.value = val;
    getData();
}

const staffModalvVisible = ref(false); // 员工未巡检详情隐藏
function handleExamine (record) {
    staffModalvVisible.value = true;
    staffModalTitle = '保安未巡检详情';
    stafftableDataSource = record.utourAreaS;
}

function handleExamine1 (record) {
    staffModalvVisible.value = true;
    staffModalTitle = '管理员未巡检详情';
    stafftableDataSource = record.utourAreaM;
}

function handleExamine2 (record) {
    staffModalvVisible.value = true;
    staffModalTitle = '日巡检设备未巡检详情';
    stafftableDataSource = record.utourDeviceD;
}

function handleExamine3 (record) {
    staffModalvVisible.value = true;
    staffModalTitle = '周巡检设备未巡检详情';
    stafftableDataSource = record.utourDeviceW;
}

function handleExamine4 (record) {
    staffModalvVisible.value = true;
    staffModalTitle = '未消毒详情';
    stafftableDataSource = record.udisinfectConfigs;
}
</script>

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

    :deep(.custom_table) {
        margin-bottom: 20px;

        .pic_box {
            display: flex;
            justify-content: center;

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