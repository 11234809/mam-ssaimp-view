<!--
 * @Descripttion: 系统部署管理
 * @version: 
 * @Author: ysl
 * @Date: 2024-08-07 16:16:15
 * @LastEditors: ysl
 * @LastEditTime: 2025-04-02 15:54:42
-->
<template>
    <div id="sysProcessDeploy">
        <SysProcessDeploy 
            ref="deployRef" 
            :btnArray="btnArray" 
            :tableWidth="tableWidth" 
            :formSearch="formSearch" 
            :dataOption="dataOption" 
            :actionArray="actionArray" 
            :acticonBtnWidth="acticonBtnWidth" 
            :tableFN="tableFN" 
            :tbColumns="tbColumns" 
            :tableData="tableData" 
            :showEditform="showEditform" 
            :historyTbColumns="historyTbColumns" 
            :hasCustomTableBtn="true" 
            :hasCustomGroupBtn="true" 
            :acticonBtnHistoryWidth="acticonBtnHistoryWidth" 
            :historyActionArray="historyActionArray" 
            :tableDataLength="tableDataLength" 
            :hisTableDataLength="hisTableDataLength" 
            :processView="processView" 
            @getTableList="getTableList" 
            @hanldsearchData="hanldsearchData" 
            @fromSearchResetField="fromSearchResetField" 
            @getFromSearchData="getFromSearchData" 
            @selectChange="selectChange" 
            @hanldDelTable="hanldDelTable" 
            @hanldDelHisTable="hanldDelHisTable" 
            @PaginationData="PaginationData"
            @hisPaginationData="hisPaginationData"
            @updateCheckedArr="updateCheckedArr">
            <template #btngroupslot="scope">
                <el-button type="danger" @click="hanldBatchDel" :disabled="dictionaryKey">
                    批量删除
                    <el-icon class="el-icon--right">
                        <Delete />
                    </el-icon>
                </el-button>
            </template>
            <template #btnslot="scope">
                <template v-if="thisBtnType == 'icon'">
                    <el-tooltip content="版本管理" placement="top" effect="dark">
                        <el-button size="small" @click="handleHistory(scope.scope.scope.row)" type="primary">
                            <el-icon>
                                <Discount />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                </template>
                <template v-else>
                    <el-button size="small" @click="handleHistory(scope.scope.scope.row)" type="primary">版本管理</el-button>
                </template>
            </template>
            <template #processNameSlot="scope">
                <el-button link type="primary" @click="handleProcessView(scope.row)">{{ scope ? scope.row.processName : "" }}</el-button>
            </template>
            <template #versionSlot="scope">
                <el-tag type="primary">{{
                    scope ? scope.row.version : ""
                }}</el-tag>
            </template>
            <template #suspendedSlot="scope">
                <el-tag type="success" v-if="!scope.row.suspended">激活</el-tag>
                <el-tag type="warning" v-if="scope.row.suspended">挂起</el-tag>
            </template>
            <template #historyBtnslot="scope">
                <template v-if="thisHistoryBtnType == 'icon'">
                    <el-tooltip :content="
                            scope.scope.scope.row.suspended == false
                                ? '挂起'
                                : '激活'
                        " placement="top" effect="dark">
                        <el-button size="small" @click="handleChangeState(scope.scope.scope.row)" type="primary">
                            <template v-if="scope.scope.scope.row.suspended == false">
                                <!-- 挂起 -->
                                <el-icon>
                                    <VideoPause />
                                </el-icon>
                            </template>
                            <template v-else>
                                <!-- 激活 -->
                                <el-icon>
                                    <VideoPlay />
                                </el-icon>
                            </template>
                        </el-button>
                    </el-tooltip>
                </template>
                <template v-else>
                    <el-button size="small" @click="handleChangeState(scope.scope.scope.row)" type="primary">{{
                            scope.scope.scope.row.suspended == false
                                ? "挂起"
                                : "激活"
                        }}</el-button>
                </template>
            </template>
        </SysProcessDeploy>
    </div>
</template>

<script>
import { SysProcessDeploy } from "mam-base-ui";
import httpStatus from "../../../assets/constant/http-status.js";
import "mam-base-ui/theme/sys-process-deploy.css";
export default {
    name: "sysProcessDeploy",
    components: {
        SysProcessDeploy,
    },
    data () {
        return {
            btnArray: ["del"],
            tableWidth: "100%",
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
                        label: "流程标识",
                        value: "",
                        itemId: "processKey",
                        width: 280,
                        placeholder: "请输入流程标识",
                    },
                    {
                        type: "INPUT",
                        label: "流程名称",
                        value: "",
                        itemId: "processName",
                        width: 280,
                        placeholder: "请输入流程名称",
                    },
                    {
                        type: "SELECT",
                        label: "流程分类",
                        value: "",
                        itemId: "category",
                        width: 280,
                        isSearch: true,
                        placeholder: "请选择流程分类",
                        optionList: [],
                    },
                    {
                        type: "SELECT",
                        label: "状态",
                        value: "",
                        itemId: "suspended",
                        width: 280,
                        isSearch: true,
                        placeholder: "请选择状态",
                        optionList: [
                            {
                                label: "激活",
                                value: "active",
                            },
                            {
                                label: "挂起",
                                value: "suspended",
                            },
                        ],
                    },
                ],
            },
            actionArray: ["del"],
            acticonBtnWidth: 110,
            historyActionArray: ["del", "latest"],
            acticonBtnHistoryWidth: 110,
            tableFN: {
                LIST: "/workflow/deploy/page",
                DELECT: "/workflow/deploy/delete",
                HISDELECT: "/workflow/deploy/hisDelete",
                SELECT: "/pub/common/queryNormalOptions",
                HList: "/workflow/deploy/publishList",
                BPMNINFO: "/workflow/deploy/bpmnXml",
                STATE: "/workflow/deploy/changeState",
            },
            tbColumns: [
                {
                    label: "流程标识", //列名
                    dataIndex: "processKey", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "left", //对齐方式
                },
                {
                    label: "流程名称",
                    dataIndex: "processName",
                    align: "left",
                    width: "180",
                    sortable: false,
                    fixed: false,
                    slotcol: true,
                    slotName: "processNameSlot",
                },
                {
                    label: "流程分类",
                    dataIndex: "category",
                    align: "center",
                    width: "240",
                    sortable: false,
                    fixed: false,
                },
                {
                    label: "流程版本",
                    dataIndex: "version",
                    align: "center",
                    width: "120",
                    sortable: false,
                    fixed: false,
                    slotcol: true,
                    slotName: "versionSlot",
                },
                {
                    label: "状态",
                    dataIndex: "suspended",
                    align: "center",
                    width: "120",
                    sortable: false,
                    fixed: false,
                    slotcol: true,
                    slotName: "suspendedSlot",
                },
                {
                    label: "创建时间",
                    dataIndex: "deploymentTime",
                    align: "center",
                    width: "180",
                    sortable: true,
                    fixed: false,
                },
            ],
            tableData: [],
            showEditform: false,
            historyTbColumns: [
                {
                    label: "模型标识",
                    dataIndex: "processKey",
                    sortable: false,
                    fixed: false,
                    align: "left",
                },
                {
                    label: "流程名称",
                    dataIndex: "processName",
                    align: "left",
                    width: "300",
                    sortable: false,
                    fixed: false,
                    slotcol: true,
                    slotName: "processNameSlot",
                },
                {
                    label: "流程版本",
                    dataIndex: "version",
                    align: "center",
                    width: "120",
                    sortable: false,
                    fixed: false,
                    slotcol: true,
                    slotName: "versionSlot",
                },
                {
                    label: "状态",
                    dataIndex: "suspended",
                    align: "center",
                    width: "120",
                    sortable: false,
                    fixed: false,
                    slotcol: true,
                    slotName: "suspendedSlot",
                },
            ],
            historyTableData: [],
            page: 1,
            limit: 10,
            hisPage: 1,
            hisLimit: 10,
            tableDataLength: 0,
            hisTableDataLength: 0,
            categoryList: [],
            dataOption: {
                queriers: [{ alias: "wfCategoryDictionary", param: null }],
            },
            thisBtnType: "icon",
            thisHistoryBtnType: "icon",
            selectRowData: "",
            selectRowNum: "",
            dictionaryKey: true,
            processView: {
                title: "",
                index: undefined,
                xmlData: "",
            },
            searchDataList: {},
            selectRow: {},
        };
    },
    created () {
        this.getTableList();
        this.hanldselectList();
        this.setPagination(this.page, this.limit);
    },
    methods: {
        // 设置分页
        setPagination (page, pageSize) {
            let pageData = {page: page, limit: pageSize}
            this.$nextTick(() => {
                this.$refs.deployRef.setPagination(pageData);
            });
        },
        // 获取分页数据
        PaginationData (data) {
            this.page = data.page;
            this.limit = data.limit;
            this.getTableList(this.searchDataList);
        },
        // 获取版本管理分页数据
        hisPaginationData (data) {
            this.hisPage = data.page;
            this.hisLimit = data.limit;
            this.getHisTableList(this.selectRow);
        },
        // 获取表数据
        getTableList (data) {
            let searchData = {
                index: this.page,
                size: this.limit,
                tenantId: process.env.VUE_APP_BASE_TENANTID,
                orderAsc: false,
                processQuery: {
                    ...data,
                },
            };
            this.$http.callbackPost(
                this.tableFN.LIST,
                searchData,
                null,
                function (result) {
                    if (result.code == httpStatus.ok) {
                        let tableList = result.data.records;
                        this.tableDataLength = result.data.total;
                        this.tableData = tableList;
                        this.$nextTick(() => {
                            this.$refs.deployRef.getTableListNew(data);
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
        hanldsearchData (data) {
            if (data) {
                this.categoryList = data.wfCategoryDictionary;
                this.categoryList.map((item) => {
                    item.label = item.name;
                    item.value = item.code;
                });
                let formSelectList = JSON.parse(
                    JSON.stringify(this.formSearch)
                );
                formSelectList.formItemList.map((item) => {
                    if (item.itemId == "category") {
                        item.optionList = this.categoryList;
                    }
                });
                this.formSearch = formSelectList;
            }
        },
        // 获取搜索栏下拉框数据方法
        hanldselectList () {
            this.$nextTick(() => {
                this.$refs.deployRef.getTopURL();
            });
        },
        // 表单重置
        fromSearchResetField () {
            this.searchDataList = {};
            this.getTableList();
        },
        // 表单搜索
        getFromSearchData (data) {
            this.searchDataList = data;
            this.getTableList(data);
        },
        // 下拉框变化触发
        selectChange (data) {
            // 下拉框选择变化时
        },
        // 删除
        hanldDelTable (row) {
            row = JSON.parse(JSON.stringify(row));
            let deployIds = [];
            deployIds.push(row.deploymentId);
            this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    this.loading = true;
                    this.$http.callbackPost(
                        this.tableFN.DELECT,
                        { deployIds: deployIds },
                        null,
                        function (result) {
                            if (result.code == httpStatus.ok) {
                                this.$message({
                                    message: result.data.message,
                                    type: "success",
                                });
                                this.getTableList(this.searchDataList);
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
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        // 版本管理删除
        hanldDelHisTable (row) {
            row = JSON.parse(JSON.stringify(row));
            let deployIds = [];
            deployIds.push(row.deploymentId);
            this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    this.loading = true;
                    this.$http.callbackPost(
                        this.tableFN.DELECT,
                        { deployIds: deployIds },
                        null,
                        function (result) {
                            if (result.code == httpStatus.ok) {
                                this.$message({
                                    message: result.data.message,
                                    type: "success",
                                });
                                this.getHisTableList(this.selectRow);
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
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        // 多选时返回选中条
        updateCheckedArr (data) {
            this.selectRowData = data;
            this.selectRowNum = data.length;
            if (this.selectRowNum > 0) {
                this.dictionaryKey = false;
            } else {
                this.dictionaryKey = true;
            }
        },
        // 批量删除
        hanldBatchDel () {
            let ids = this.selectRowData.map((item) => item.deploymentId);
            let processNames = this.selectRowData.map(
                (item) => item.processName
            );
            this.$confirm(
                "此操作将删除选中" + processNames + ", 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(async () => {
                    this.loading = true;
                    this.$http.callbackPost(
                        this.tableFN.DELECT,
                        { deployIds: ids },
                        null,
                        function (result) {
                            if (result.code == httpStatus.ok) {
                                this.$message({
                                    message: result.data.message,
                                    type: "success",
                                });
                                this.getTableList(this.searchDataList);
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
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        // 流程图
        handleProcessView (row) {
            this.processView.title = "流程图 - " + row.processName;
            if (row.definitionId) {
                this.processView.index = row.definitionId;
                this.$http.callbackPost(
                    this.tableFN.BPMNINFO,
                    { definitionId: row.definitionId },
                    null,
                    function (result) {
                        if (result.code == httpStatus.ok) {
                            this.processView.xmlData = result.data.bpmnXml;
                            this.$nextTick(() => {
                                this.$refs.deployRef.modelProcessView(
                                    row,
                                    this.processView
                                );
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
            }
        },
        // 版本管理
        handleHistory (row) {
            row = JSON.parse(JSON.stringify(row));
            this.selectRow = row;
            let searchData = {
                index: this.hisPage,
                size: this.hisLimit,
                tenantId: process.env.VUE_APP_BASE_TENANTID,
                processQuery: {
                    processKey: row.processKey,
                },
                orderAsc: false,
            };
            this.$http.callbackPost(
                this.tableFN.HList,
                searchData,
                null,
                function (result) {
                    if (result.code == httpStatus.ok) {
                        this.historyTableData = result.data.records;
                        this.hisTableDataLength = result.data.total;
                        this.$nextTick(() => {
                            this.$refs.deployRef.historyDetail(
                                this.historyTableData
                            );
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
        // 版本管理-分页
        getHisTableList (row) {
            row = JSON.parse(JSON.stringify(row));
            this.selectRow = row;
            let searchData = {
                index: this.hisPage,
                size: this.hisLimit,
                tenantId: process.env.VUE_APP_BASE_TENANTID,
                processQuery: {
                    processKey: row.processKey,
                },
                orderAsc: false,
            };
            this.$http.callbackPost(
                this.tableFN.HList,
                searchData,
                null,
                function (result) {
                    if (result.code == httpStatus.ok) {
                        this.historyTableData = result.data.records;
                        this.hisTableDataLength = result.data.total;
                        this.$nextTick(() => {
                            this.$refs.deployRef.historyList(
                                this.historyTableData
                            );
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
        // 版本状态
        handleChangeState (row) {
            let searchData = {
                index: this.hisPage,
                size: this.hisLimit,
                definitionId: row.definitionId,
                state: row.suspended ? "active" : "suspended",
                processQuery: {
                    processKey: row.processKey,
                },
                orderAsc: false,
            };
            this.$http.callbackPost(
                this.tableFN.STATE,
                searchData,
                null,
                function (result) {
                    if (result.code == httpStatus.ok) {
                        this.$message({
                            message: result.data.message,
                            type: "success",
                        });
                        this.getHisTableList(this.selectRow);
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

<style lang="less" scoped></style>
