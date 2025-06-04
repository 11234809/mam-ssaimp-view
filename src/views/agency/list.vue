<!--
 * @Descripttion: 
 * @version: 
 * @Author: yangfeng
 * @Date: 2024-07-04 13:45:45
 * @LastEditors: ysl
 * @LastEditTime: 2025-01-21 14:41:16
-->
<template>
    <div id="logManage">
        <LoadingBox ref="loadingBox" @hanldsearchData="hanldsearchData">
            <template #boxslot="scope">
                <!-- 查询表单 -->
                <div class="searchBox">
                    <SearchForm 
                        :formSearch="formSearch" 
                        ref="searchForm" 
                        @getFromSearchData="getFromSearchData"
                        @fromSearchResetField="fromSearchResetField" 
                        @selectChange="selectChange" 
                    />
                </div>
            </template>
        </LoadingBox>
        <div class="tableBox">
            <!-- 表头操作按钮 -->
            <CommonTableBtngroup ref="qrtzTableBtngroup" :btnArray="btnArray"></CommonTableBtngroup>
            <!-- 数据表格 -->
            <CommonTable 
                ref="commonLogTable" 
                :btnArray="btnArray" 
                :style="{ width: tableWidth ? tableWidth : '100%' }"
                :tableHeight="tableHeight" 
                :tableData="tableData" 
                :tableFN="tableFN" 
                :hasCustomBtn="true"
                :actionArray="actionArray" 
                :tbColumns="tbColumns" 
                :isPagination="true"
                :tableDataLength="tableDataLength" 
                :hasOrder="true" 
                :hasChecked="false" 
                :isShowSummary="false"
                :isCustomBtn="true" 
                :acticonBtnWidth="acticonBtnWidth" 
                @PaginationData="PaginationData"
            >
                <template #btnslot="scope">
                    <div class="btnBox" style="margin: 0; padding: 0">
                        <el-button 
                            size="small" 
                            @click="jumpAgency(scope.scope.row)" 
                            type="primary"
                        >
                            办理
                        </el-button>
                    </div>
                </template>
                <template #operatorNameSlot="scope">
                    <p style="margin: 0; padding: 0" v-if="scope.row.procDefName">
                        {{ scope.row.procDefName }}
                    </p>
                    <p style="margin: 0; padding: 0" v-else>未知</p>
                </template>
                <template #clientTypeSlot="scope">
                    <p style="margin: 0; padding: 0" v-if="!scope.row.clientType">无</p>
                    <p style="margin: 0; padding: 0" v-else-if="scope.row.clientType == 'web'">
                        web端
                    </p>
                    <p style="margin: 0; padding: 0" v-else-if="scope.row.clientType == 'app'">
                        app端
                    </p>
                </template>
            </CommonTable>
        </div>
    </div>
</template>

<script>
import {
    LoadingBox,
    SearchForm,
    CommonTableBtngroup,
    CommonTable,
} from "mam-base-ui";
import httpStatus from "../../assets/constant/http-status.js";
import { getTimeDifference } from "../../utils/authorization-default.js";
export default {
    name: "agency",
    components: {
        LoadingBox,
        SearchForm,
        CommonTableBtngroup,
        CommonTable,
    },
    data() {
        return {
            page: 1,
            limit: 10,
            taskGroupList: [],
            taskStatusList: [],
            dialogVisibleLog: false,
            paginationData: {},
            btnArray: ["null"],
            actionArray: ["null"], //操作按钮
            acticonBtnWidth: 75,
            tableWidth: "100%",
            isActionShow: false,
            tableHeight: "454",
            formSearch: {
                labelWidth: "140px",
                buttonWidth: "420px",
                seizeWidth: "280px",
                seizeBumber: {
                    1920: 2, //1920，1080
                    2560: 1, //2560，1440
                    1706: 1, //2560的1.5倍数    1706，960
                    1600: 1, //1600，900
                    1440: 1, //1440，1080
                    1366: 1, //1366，768
                    1280: 0, //1280，960
                },
                formItemList: [
                    {
                        type: "INPUT",
                        label: "待办标题",
                        value: "",
                        itemId: "procDefName",
                        width: 280,
                        placeholder: "请输入待办标题",
                    },
                ],
            },
            tableFN: {
                LIST: "/sys/todo/list",
                SELECT: "/pub/common/queryNormalOptions",
                STAR: "/workflow/process/startProcess",
                CLAIM: "/sys/todo/claim",
            },
            tbColumns: [
                {
                    label: "业务模块", //列名
                    dataIndex: "procDefName", //和数据属性对应
                    align: "center",
                    width: "160",
                    slotName: "operatorNameSlot",
                    slotcol: true,
                },
                {
                    label: "待办标题",
                    dataIndex: "description",
                    align: "left",
                    sortable: false,
                    fixed: false,
                    minWidth: "450",
                },
                {
                    label: "待办名称",
                    dataIndex: "category",
                    align: "left",
                    sortable: false,
                    fixed: false,
                    width: "160",
                },
                {
                    label: "节点名称",
                    dataIndex: "taskName",
                    align: "center",
                    sortable: false,
                    fixed: false,
                },
                {
                    label: "流程发起人",
                    dataIndex: "startUserName",
                    align: "center",
                    width: "160",
                    sortable: false,
                    fixed: false,
                },
                {
                    label: "接收人",
                    dataIndex: "assigneeName",
                    align: "center",
                    width: "160",
                    sortable: false,
                    fixed: false,
                },
                {
                    label: "接受时间",
                    dataIndex: "createTime",
                    align: "center",
                    width: "180",
                    sortable: false,
                    fixed: false,
                },
                {
                    label: "待办停留时间",
                    dataIndex: "stopTime",
                    align: "center",
                    width: "180",
                    sortable: false,
                    fixed: false,
                },
            ],
            tableData: [],
            page: 1,
            limit: 10,
            clientTypeList: [],
            dataOption: {
                queriers: [{ alias: "clientTypeDictionary", param: null }],
            },
            tableDataLength: 0,
        };
    },
    created() {
        this.getTableList();
        this.hanldselectList();
    },
    methods: {
        // 获取分页数据
        PaginationData(data) {
            this.page = data.page;
            this.limit = data.limit;
            this.getTableList(data);
        },
        // 获取表数据
        getTableList(data) {
            let searchData = {
                index: this.page,
                size: this.limit,
                orderAsc: false,
                tenantId: process.env.VUE_APP_BASE_TENANTID,
            };
            if (data) {
                data = { ...data, ...searchData };
            } else {
                data = searchData;
            }
            this.$http.callbackPost(
                this.tableFN.LIST,
                data,
                null,
                function (result) {
                    if (result.code == httpStatus.ok) {
                        let tableList = result.data.records;
                        tableList.forEach((item) => {
                            item.stopTime = getTimeDifference(item.createTime);
                        });
                        this.tableData = tableList;
                        this.tableDataLength = result.data.total;
                        this.$nextTick(() => {
                            this.$refs.commonLogTable.getTableList();
                        });
                    } else {
                        this.$message({
                            message: result.message,
                            type: "info",
                        });
                    }
                },
                function (error) {
                    this.$message({ message: error, type: "error" });
                },
                this
            );
        },
        // 获取返回搜索栏下拉框数据
        hanldsearchData(data) {
            if (data) {
                // 查询 - 任务分组
                this.clientTypeList = data.clientTypeDictionary;
                if (data.clientTypeDictionary) {
                    this.clientTypeList.map((item) => {
                        item.label = item.name;
                        item.value = item.code;
                    });
                }

                let formSelectList = JSON.parse(JSON.stringify(this.formSearch));
                formSelectList.formItemList.map((item) => {
                    if (item.itemId == "clientType") {
                        item.optionList = this.clientTypeList;
                    }
                });
                this.formSearch = formSelectList;
            }
        },
        // 调用LoadingBox获取搜索表单下拉列表数据接口
        getTopURL() {
            this.$nextTick(() => {
                this.$refs.loadingBox.getTopURL(this.tableFN.SELECT, this.dataOption);
            });
        },
        // 搜索表单重置
        fromSearchResetField() {
            this.$refs.commonLogTable.getPaginationData({
                page: 1,
                limit: this.paginationData.limit,
            });
            let isFromSearchResetField =
                typeof this.$attrs.onFromSearchResetField == "function";
            let isGetTableList = typeof this.$attrs.onGetTableList == "function";
            // 是否自定义表单重置
            if (isFromSearchResetField) {
                this.$emit("fromSearchResetField");
            } else {
                // 是否自定义表格数据
                if (isGetTableList) {
                    this.$emit("getTableList");
                } else {
                    this.$nextTick(() => {
                        this.$refs.commonLogTable.getTableList();
                    });
                }
            }
        },
        // 获取搜索栏下拉框数据方法
        hanldselectList() {
            this.$nextTick(() => {
                this.getTopURL();
            });
        },
        // 表单重置
        fromSearchResetField() {
            this.getTableList();
        },
        // 表单搜索
        getFromSearchData(data) {
            this.getTableList(data);
        },
        // 下拉框变化触发
        selectChange(data) {
            // 下拉框选择变化时
        },
        jumpAgency(data) {
            let param = {
                tenantId: process.env.VUE_APP_BASE_TENANTID,
                wfTaskBusiness: {
                    taskId: data.taskId,
                    // userId: data.startUserId,
                    userId: data.assigneeId,
                },
            };
            this.$http.callbackPost(
                this.tableFN.CLAIM,
                param,
                null,
                function (result) {
                    if (result.code == httpStatus.ok) {
                        this.$Bus.emit("jumpAgency", { url: data.formKey, data: data });
                    } else {
                        this.$message({
                            message: result.message,
                            type: "info",
                        });
                    }
                },
                function (error) {
                    this.$message({ message: error, type: "error" });
                },
                this
            );
        },
    },
};
</script>
  
<style lang="less">
#logManage {
    .el-dialog__title {
        color: #ffffff !important;
    }

    .el-dialog__header.show-close {
        padding-right: 0 !important;
    }

    .el-dialog__headerbtn .el-dialog__close {
        color: #ffffff !important;
    }

    .my-header {
        display: flex;
        height: 45px;
        font-size: 17px;
        padding-left: 15px;
      align-items: center;
    }
}
</style>
  
