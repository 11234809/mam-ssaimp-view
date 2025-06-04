<!-- @format -->

<template>
    <div class="service-area-info">
        <el-card shadow="always">
            <!-- 查询区域 -->
            <div class="search-wrapper">
                <el-form :inline="true" :model="formSearch" ref="serchRuleForm">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="所属公司：">
                                <el-select v-model="formSearch.company" placeholder="请选择公司" clearable filterable @change="companyChange(formSearch.company)">
                                    <el-option v-for="(item, index) in companyList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="服务区：">
                                <el-select filterable v-model="formSearch.serviceArea" placeholder="请选择服务区" clearable>
                                    <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所在高速：">
                                <el-select v-model="formSearch.highSpeed" filterable placeholder="请选择所在高速" clearable>
                                    <el-option v-for="(item, index) in roadLineList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="所属路段：">
                                <el-select v-model="formSearch.road" filterable placeholder="请选择所属路段" clearable>
                                    <el-option v-for="(item, index) in roadList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="星级：">
                                <el-select v-model="formSearch.star" placeholder="请选择星级" clearable>
                                    <el-option v-for="(
                                            item, index
                                        ) in dictItemsList.starLevelDictionary" :key="index" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="布局形式：">
                                <el-select v-model="formSearch.layoutForm" placeholder="请选择布局形式" clearable>
                                    <el-option v-for="(
                                            item, index
                                        ) in dictItemsList.layoutFormDictionary" :key="index" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="服务区方向：">
                                <el-select v-model="formSearch.serviceAreaDirection" placeholder="请选择服务区方向：" clearable>
                                    <el-option v-for="(
                                            item, index
                                        ) in dictItemsList.serviceDirectionDictionary" :key="index" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="审核状态：">
                                <el-select v-model="formSearch.auditStatus" placeholder="请选择审核状态" clearable>
                                    <el-option v-for="(
                                            item, index
                                        ) in dictItemsList.auditStatusDictionary" :key="index" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="服务区状态：">
                                <el-select v-model="formSearch.serviceAreaStatus" placeholder="请选择服务区状态" clearable>
                                    <el-option v-for="(
                                            item, index
                                        ) in dictItemsList.serviceAreaStatusDictionary" :key="index" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-button type="primary" @click="submitForm(serchRuleForm)" icon="Search">
                                查询
                            </el-button>
                            <el-button type="primary" icon="RefreshRight" style="margin-left: 8px" @click="searchReset(serchRuleForm)">
                                重置
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <!-- 表格区域 -->
            <div class="table-wrapper">
                <div class="table-btn">
                    <el-button type="primary" icon="Plus" @click="add()">新增</el-button>
                    <!-- <el-button type="primary" icon="Download">导出</el-button> -->
                </div>
                <div class="tips_box">
                    <span class="tips">已选择
                        <span class="tips_num">{{
                            multipleSelectionTotal
                        }}</span>
                        项</span>
                    <el-button link class="tips_num_close" @click="clear">清空</el-button>
                </div>
                <div class="table-content">
                    <el-table ref="multipleTableRef" :data="serviceAreaTableList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" height="500" max-height="500" :row-style="{ height: '46px' }" empty-text="暂无数据" v-loading="loading">
                        <el-table-column fixed="left" type="selection" min-width="55"></el-table-column>
                        <el-table-column prop="name" label="服务区名称" min-width="260">
                        </el-table-column>
                        <el-table-column prop="highSpeed" label="所在高速" min-width="120">
                        </el-table-column>
                        <el-table-column prop="road" label="所属路段" min-width="290">
                        </el-table-column>
                        <el-table-column prop="company" label="所属公司" min-width="120">
                        </el-table-column>
                        <el-table-column prop="star" label="星级" min-width="120">
                        </el-table-column>
                        <el-table-column prop="layoutForm" label="布局形式" min-width="140">
                        </el-table-column>
                        <el-table-column prop="serviceAreaDirection" label="服务区方向" min-width="140">
                        </el-table-column>
                        <el-table-column prop="auditStatus" label="审核状态" min-width="120">
                        </el-table-column>
                        <el-table-column prop="status" label="服务区状态" min-width="150">
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" min-width="180">
                            <template #default="scope">
                                <div class="operate" v-if="
                                        scope.row.auditStatus == '待提交' ||
                                        scope.row.auditStatus == '已通过'
                                    ">
                                    <el-text type="primary" @click="edit(scope.row)">
                                        编辑
                                    </el-text>
                                    <font>|</font>
                                    <el-dropdown>
                                        <span class="el-dropdown-link">
                                            更多
                                            <el-icon class="el-icon--right">
                                                <arrow-down />
                                            </el-icon>
                                        </span>
                                        <template #dropdown>
                                            <el-dropdown-menu>
                                                <el-dropdown-item @click="detail(scope.row)">
                                                    详情
                                                </el-dropdown-item>
                                                <el-dropdown-item @click="
                                                        deleteRow(scope.row)
                                                    ">
                                                    删除
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </template>
                                    </el-dropdown>
                                </div>
                                <div class="operate" v-if="scope.row.auditStatus == '已驳回'">
                                    <!-- <el-text type="primary" size="small" @click="edit(scope.row)">
                    编辑
                  </el-text> -->
                                    <el-text type="primary" @click="detail(scope.row)">
                                        详情
                                    </el-text>
                                    <font>| &nbsp;</font>
                                    <el-text type="primary" @click="deleteRow(scope.row)">
                                        删除
                                    </el-text>
                                </div>
                                <div class="operate" v-if="scope.row.auditStatus == '待审核'">
                                    <el-text type="primary" @click="detail(scope.row)">
                                        详情
                                    </el-text>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30]" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>
            </div>
            <!-- 抽屉 -->
            <el-drawer v-model="drawerStatus" :close-on-click-modal="false" :close-on-press-escape="false" :size="'82%'" modal-class="serviceAreaInfo" :destroy-on-close="true" :show-close="false">
                <template #header>
                    <div class="add-edit-header">
                        <h4>服务区基本信息</h4>
                        <img src="@/assets/images/close.png" @click="deawerCancel" />
                    </div>
                </template>
                <template #default>
                    <div class="infoForm">
                        <serviceAreaInfoDrawer ref="serviceAreaRef" />
                    </div>
                </template>
                <template #footer>
                    <div style="flex: auto">
                        <el-button @click="deawerCancel">
                            关闭<img src="@/assets/images/cancel.png" />
                        </el-button>
                        <el-button type="primary" @click="deawerConfirm(1)" v-if="
                                flag == 'add' ||
                                flag == 'edit' ||
                                flag == 'todo'
                            ">
                            保存<img src="@/assets/images/sure.png" />
                        </el-button>
                        <el-button type="primary" @click="deawerConfirm(0)" v-if="
                                flag == 'add' ||
                                flag == 'edit' ||
                                flag == 'todo'
                            ">
                            提交<img src="@/assets/images/sure.png" />
                        </el-button>
                    </div>
                </template>
            </el-drawer>
        </el-card>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    onMounted,
    reactive,
    ref,
    defineComponent,
    onActivated,
    getCurrentInstance,
} from "vue";
import serviceAreaInfoDrawer from "./components/service-area-Info-drawer.vue";
import {
    getServiceAreaInfoList,
    deletetServiceAreaInfo,
    getServiceArea,
    getRoadLine,
} from "@/api/informationServiceAreaApi";
import { useAreaInfoStore } from "../../../store/useAreaInfoStore";

const areaInfoStore = useAreaInfoStore();
let {
    flag,
    companyList,
    dictItemsList,
    roadLineList,
    roadList,
    drawerStatus,
    formInfo,
} = storeToRefs(areaInfoStore);
let {
    addAreaInfo,
    editAreaInfo,
    todoAreaInfo,
    detailAreaInfo,
    getDictItemsList,
    getCompanyList,
    getOrgList,
    getRoadLineList,
    getRoadList,
    editSaveAreaInfo,
    saveAreaInfo,
    todoSaveAreaInfo,
    deawerClose,
    getDrawerStatus,
    startProcess,
    processCompleted,
    processSub,
    getFlag,
    getAuditStatus,
    getCompanyManagerList,
} = areaInfoStore;
defineComponent({
    components: {
        serviceAreaInfoDrawer,
    },
});
let formSearch = ref({
    company: null,
    serviceArea: null,
    highSpeed: null,
    road: null,
    star: null,
    layoutForm: null,
    serviceAreaDirection: null,
    auditStatus: null,
    serviceAreaStatus: null,
});
let serviceAreaTableList = ref([]);
let multipleSelection = ref([]);
let multipleSelectionTotal = ref(0);
let currentPage = ref(1);
let pageSize = ref(10);
let total = ref(0);
let serviceAreaList = ref([]);
let loading = ref(false);
const multipleTableRef = ref();
const serviceAreaRef = ref(null);
const serchRuleForm = ref();

onMounted(() => {
    getDictItemsList();
    getCompanyList();
    getOrgList();
    getRoadLineList();
    getRoadList();
    getServiceAreaInfoTableList();
    getCompanyManagerList();
    getServiceAreaList();
    if (getDrawerStatus === true) {
        deawerClose();
    }
});
onActivated(() => {
    const proxy = getCurrentInstance().appContext.config.globalProperties;
    todoAreaInfo(proxy);
});

/**
 * @description  form 表单查询
 */
const submitForm = async (formEl) => {
    if (!formEl) return;
    getServiceAreaInfoTableList();
};
/**
 * @description  重置查询
 */
const searchReset = (formEl) => {
    if (!formEl) return;
    formSearch.value = {
        company: null,
        serviceArea: null,
        highSpeed: null,
        road: null,
        star: null,
        layoutForm: null,
        serviceAreaDirection: null,
        auditStatus: null,
        serviceAreaStatus: null,
    };
    getServiceAreaInfoTableList();
};
/**
 * @description  多选
 */
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
    multipleSelectionTotal.value = multipleSelection.value.length;
};
/**
 * @description 清空选择数据
 */
const clear = (i) => {
    multipleTableRef.value.clearSelection();
};
/**
 * @description  当页数据条数改变
 */
const handleSizeChange = (event) => {
    pageSize.value = event;
    getServiceAreaInfoTableList();
};
/**
 * @description  分页页数改变
 */
const handleCurrentChange = (event) => {
    currentPage.value = event;
    getServiceAreaInfoTableList();
};
/**
 * @description 删除单行数据
 */
const deleteRow = (val) => {
    ElMessageBox.confirm("是否删除?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
    })
        .then(() => {
            deletetServiceAreaInfo({ id: val.entityId }).then((res) => {
                if (res.code === 200) {
                    ElMessage({
                        type: "success",
                        message: res.data.message,
                    });
                    getServiceAreaInfoTableList();
                }
            });
        })
        .catch(() => { });
};

/**
 * @description 新增服务区数据
 */
const add = () => {
    addAreaInfo();
};
/**
 * @description 编辑单行数据
 */
const edit = (val) => {
    editAreaInfo({ id: val.entityId });
};
/**
 * @description 查看单行数据
 */
const detail = (val) => {
    detailAreaInfo({ id: val.entityId });
};

/**
 * @description 抽屉取消
 */
const deawerCancel = () => {
    deawerClose();
};
const clearValidate = () => {
  serviceAreaRef.value.formInfo.energyBean.chargeStationList.map((item,index) => {
    if(item.stationPhotosList.length > 0) {
      serviceAreaRef.value.clearValidate(`energyBean.chargeStationList[${index}].stationPhotosList`)
    }
  })
  // 上传图片第三方检测报告图片
  serviceAreaRef.value.formInfo.energyBean.chargePileList.map((item,index) => {
    if(item.nameplateImagesList.length > 0) {
      serviceAreaRef.value.clearValidate(`energyBean.chargePileList[${index}].nameplateImagesList`)
    }
  })
  // 铭牌图片
  serviceAreaRef.value.formInfo.energyBean.chargePileList.map((item,index) => {
    if(item.nameplateImagesList.length > 0) {
      serviceAreaRef.value.clearValidate(`energyBean.chargePileList[${index}].nameplateImagesList`)
    }
  })
  // 充电桩充电枪数图片
  serviceAreaRef.value.formInfo.energyBean.chargePileList.map((item,index) => {
    if(item.gunImagesList.length > 0) {
      serviceAreaRef.value.clearValidate(`energyBean.chargePileList[${index}].gunImagesList`)
    }
  })
}
/**
 * @description 抽屉确定
 */
const deawerConfirm = async (i) => {
    if (serviceAreaRef.value) {
        clearValidate();
        const validateStatus = await serviceAreaRef.value.validateForm();
        if (validateStatus != "failed") {
            switch (i) {
                case 0:
                    // 提交
                    if (flag.value == "add") {
                        // 新增提交
                        startProcess();
                    } else if (flag.value == "edit") {
                        // 新增提交
                        startProcess();
                    } else if (flag.value == "todo") {
                        // 代办提交
                        processSub();
                    }
                    break;
                case 1:
                    // 保存
                    if (flag.value == "edit") {
                        // 编辑保存
                        editSaveAreaInfo();
                    } else if (flag.value == "add") {
                        // 新增保存
                        saveAreaInfo();
                    } else if (flag.value == "todo") {
                        // 代办保存
                        todoSaveAreaInfo();
                    }
                    break;
            }
            setTimeout(() => {
                getServiceAreaInfoTableList();
            }, 3000);
        }
    }
};

/**
 * @description 获取列表数据
 */
const getServiceAreaInfoTableList = () => {
    loading.value = true;
    let serviceAreaInfoObj = {
        index: currentPage.value,
        size: pageSize.value,
        company: formSearch.value.company,
        serviceAreaId: formSearch.value.serviceArea,
        highSpeed: formSearch.value.highSpeed,
        road: formSearch.value.road,
        star: formSearch.value.star,
        layoutForm: formSearch.value.layoutForm,
        serviceAreaDirection: formSearch.value.serviceAreaDirection,
        auditStatus: formSearch.value.auditStatus,
        status: formSearch.value.serviceAreaStatus,
    };
    getServiceAreaInfoList(serviceAreaInfoObj)
        .then((res) => {
            if (res.code === 200) {
                let listData = []
                if (res.data && res.data.records) {
                    listData = res.data.records
                    total.value = res.data.total || 0;
                }
                serviceAreaTableList.value = listData || [];
                serviceAreaTableList.value.map((item) => {
                    // 所在高速回显
                    roadLineList.value.map((val) => {
                        if (val.value == item.highSpeed) {
                            item.highSpeed = val.label;
                        }
                    });
                    // 所在道路回显
                    roadList.value.map((val) => {
                        if (val.value == item.road) {
                            item.road = val.label;
                        }
                    });
                    // 所属公司回显
                    companyList.value.map((val) => {
                        if (val.value == item.company) {
                            item.company = val.label;
                        }
                    });
                    // 审核状态回显
                    dictItemsList.value.auditStatusDictionary.map((val) => {
                        if (val.code == item.auditStatus) {
                            item.auditStatus = val.name;
                        }
                    });
                    // 服务区状态回显
                    dictItemsList.value.serviceAreaStatusDictionary.map(
                        (val) => {
                            if (val.code == item.status) {
                                item.status = val.name;
                            }
                        }
                    );
                });
                loading.value = false;
            }
        })
        .catch((err) => {
            ElMessage({
                message: err,
                type: "warning",
            });
        });
};

/**
 * @description 获取服务区列表
 */
const getServiceAreaList = () => {
    getServiceArea()
        .then((res) => {
            if (res.code === 200) {
                serviceAreaList.value = res.data.records;
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

/**
 * @description 公司列表变化联动服务区
 */
const companyChange = (orgId) => {
    console.log(orgId, "orgId");

    getServiceArea({ orgId: orgId })
        .then((res) => {
            if (res.code === 200) {
                formSearch.value.serviceArea = "";
                serviceAreaList.value = res.data.records;
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
</script>
<style lang="less" scope>
.service-area-info {
    .el-card {
        border: none;

        .el-card__body {
            padding: 0 20px;
        }

        .search-wrapper {
            .el-form {
                .el-form-item {
                    width: 100%;

                    .el-form-item__label {
                        width: 30%;
                        text-align: start;
                        word-break: keep-all;
                    }

                    .el-form-item__content {
                        width: 70%;

                        .el-select {
                            width: 100%;
                        }
                    }
                }

                .el-col-24 {
                    display: flex;
                    justify-content: end;
                }
            }
        }

        .table-wrapper {
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
                        content: "";
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

            .table-select {
                margin-top: 8px;

                .el-alert {
                    background-color: #e6f7ff;
                    border: 1px solid #91d5ff;

                    .select-text {
                        color: rgba(0, 0, 0, 0.65);
                        font-size: --fontSize14;

                        font {
                            color: #1890ff;
                            margin: 0 2px;
                        }
                    }

                    .el-text {
                        margin-left: 24px;
                        font-size: --fontSize14;
                        cursor: pointer;
                    }
                }
            }

            .table-content {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                margin-top: 16px;

                .operate {
                    display: flex;

                    .el-text,
                    .el-dropdown-link {
                        font-size: --fontSize14;
                        cursor: pointer;
                        color: #409eff;
                        display: flex;
                        align-items: center;
                    }

                    .el-text {
                        margin-right: 6px;
                    }

                    .el-dropdown-link {
                        margin-left: 6px;
                    }

                    font {
                        color: #e8e8e8;
                    }
                }

                .el-pagination {
                    margin-top: 16px;
                    padding-bottom: 6px;
                }
            }
        }
    }
}
</style>
<style lang="less">
.serviceAreaInfo {
    .el-drawer {
        background-color: #f7fafe;
    }

    .el-drawer__header {
        border-bottom: 1px solid #eeeeee;
        padding: 0 22px !important;
        height: 50px;
        margin-bottom: 0;
        .add-edit-header {
            color: --whiteBtnTextColor;
            display: flex;
            justify-content: space-between;
            padding: 10px 18px;
            display: flex;
            position: relative;
            h4 {
                font-weight: bold;
                font-size: 18px;
                display: flex;
                position: relative;
                &::before {
                    content: "";
                    width: 5px;
                    height: 16px;
                    background-color: #114484;
                    position: absolute;
                    left: -10px;
                    top: 4px;
                }
            }
            img {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }
        }
    }

    .el-drawer__body {
        display: flex;
        overflow: hidden;
        padding: 0 !important;

        .infoForm {
            width: 100%;
        }
    }

    .el-drawer__footer {
        border-top: 1px solid #eeeeee;
    }
}
</style>
