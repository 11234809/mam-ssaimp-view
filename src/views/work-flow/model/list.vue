<!--
 * @Descripttion: 系统流程模型
 * @version: 
 * @Author: ysl
 * @Date: 2024-08-06 15:50:14
 * @LastEditors: ysl
 * @LastEditTime: 2025-04-02 15:54:54
-->
<template>
    <div id="sysProcessModel">
        <SysProcessModel 
            ref="modelRef" 
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
            :editFormList="editFormList" 
            :historyTbColumns="historyTbColumns" 
            :hasCustomTableBtn="true" 
            :hasCustomGroupBtn="true" 
            :acticonBtnHistoryWidth="acticonBtnHistoryWidth" 
            :historyActionArray="historyActionArray" 
            :tableDataLength="tableDataLength" 
            :hisTableDataLength="hisTableDataLength" 
            :designerData="designerData" 
            :processView="processView" 
            :tenantId="tenantId" 
            @getTableList="getTableList" 
            @hanldsearchData="hanldsearchData"
            @fromSearchResetField="fromSearchResetField" 
            @getFromSearchData="getFromSearchData" 
            @selectChange="selectChange" 
            @hanldAddForm="hanldAddForm" 
            @hanldEditTable="hanldEditTable"
            @hanldDelTable="hanldDelTable" 
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
                    <el-tooltip content="设计" placement="top" effect="dark">
                        <el-button size="small" @click="handleDesigner(scope.scope.scope.row)" type="primary">
                            <el-icon>
                                <Brush />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="部署" placement="top" effect="dark">
                        <el-button size="small" @click="handleDeploy(scope.scope.scope.row)" type="primary">
                            <el-icon>
                                <Guide />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="流程图" placement="top" effect="dark">
                        <el-button size="small" @click="handleProcessView(scope.scope.scope.row)" type="primary">
                            <el-icon>
                                <View />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="历史" placement="top" effect="dark">
                        <el-button size="small" @click="handleHistory(scope.scope.scope.row)" type="primary">
                            <el-icon>
                                <Discount />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                </template>
                <template v-else>
                    <el-button size="small" @click="handleDesigner(scope.scope.scope.row)" type="primary">设计</el-button>
                    <el-button size="small" @click="handleDeploy(scope.scope.scope.row)" type="primary">部署</el-button>
                    <el-button size="small" @click="handleProcessView(scope.scope.scope.row)" type="primary">流程图</el-button>
                    <el-button size="small" @click="handleHistory(scope.scope.scope.row)" type="primary">历史</el-button>
                </template>
            </template>
            <template #modelNameSlot="scope">
                <el-button link type="primary" @click="handleProcessView(scope.row)">{{ scope ? scope.row.modelName : "" }}</el-button>
            </template>
            <template #versionSlot="scope">
                <el-tag type="primary">{{
                    scope ? scope.row.version : ""
                }}</el-tag>
            </template>
            <template #historyBtnslot="scope">
                <template v-if="thisHistoryBtnType == 'icon'">
                    <el-tooltip content="部署" placement="top" effect="dark">
                        <el-button size="small" @click="handleDeploy(scope.scope.scope.row)" type="primary">
                            <el-icon>
                                <Guide />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="设为最新" placement="top" effect="dark">
                        <el-button size="small" @click="handleLatest(scope.scope.scope.row)" type="primary">
                            <el-icon>
                                <Star />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                </template>
                <template v-else>
                    <el-button size="small" @click="handleDeploy(scope.scope.scope.row)" type="primary">部署</el-button>
                    <el-button size="small" @click="handleLatest(scope.scope.scope.row)" type="primary">设为最新</el-button>
                </template>
            </template>
        </SysProcessModel>
    </div>
</template>

<script>
import { SysProcessModel } from "mam-base-ui";
import httpStatus from "../../../assets/constant/http-status.js";
import "mam-base-ui/theme/sys-process-model.css";
export default {
    name: "sysProcessModel",
    components: {
        SysProcessModel,
    },
    data () {
        return {
            btnArray: ["add"],
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
                        label: "模型标识",
                        value: "",
                        itemId: "modelKey",
                        width: 280,
                        placeholder: "请输入模型标识",
                    },
                    {
                        type: "INPUT",
                        label: "模型名称",
                        value: "",
                        itemId: "modelName",
                        width: 280,
                        placeholder: "请输入模型名称",
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
                ],
            },
            actionArray: ["edit", "del"],
            acticonBtnWidth: 303,
            historyActionArray: ["deploy", "latest"],
            acticonBtnHistoryWidth: 110,
            tableFN: {
                LIST: "/workflow/model/page",
                UPDATE: "/workflow/model/edit",
                ADD: "/workflow/model/add",
                DELECT: "/workflow/model/delete",
                INFO: "/workflow/model/get",
                HList: "/workflow/model/historyList",
                BPMNINFO: "/workflow/model/bpmnXml",
                SAVE: "/workflow/model/save",
                LATEST: "/workflow/model/latest",
                SELECT: "/pub/common/queryNormalOptions",
                DEPLOY: "/workflow/model/deploy",
            },
            tbColumns: [
                {
                    label: "模型标识", //列名
                    dataIndex: "modelKey", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "left", //对齐方式
                    width: 180,
                },
                {
                    label: "模型名称",
                    dataIndex: "modelName",
                    align: "left",
                    width: "160",
                    sortable: false,
                    fixed: false,
                    slotcol: true,
                    slotName: "modelNameSlot",
                },
                {
                    label: "流程分类",
                    dataIndex: "category",
                    align: "center",
                    width: "160",
                    sortable: false,
                    fixed: false,
                    width: "240",
                },
                {
                    label: "模型版本",
                    dataIndex: "version",
                    align: "center",
                    width: "120",
                    sortable: false,
                    fixed: false,
                    slotcol: true,
                    slotName: "versionSlot",
                },
                {
                    label: "描述",
                    dataIndex: "description",
                    align: "left",
                    sortable: false,
                    fixed: false,
                    align: "left", //对齐方式
                },
                {
                    label: "创建时间",
                    dataIndex: "createTime",
                    align: "center",
                    width: "180",
                    sortable: true,
                    fixed: false,
                },
            ],
            tableData: [],
            showEditform: false,
            editFormList: [],
            editFormList1: [
                {
                    type: "INPUT",
                    label: "模型标识",
                    disabled: false,
                    required: true,
                    message: "请填写模型标识",
                    value: "",
                    itemId: "modelKey",
                    width: 280,
                    placeholder: "请填写模型标识",
                },
                {
                    type: "INPUT",
                    label: "模型名称",
                    required: true,
                    message: "请填写模型名称",
                    value: "",
                    itemId: "modelName",
                    width: 280,
                    placeholder: "请填写模型名称",
                },
                {
                    type: "SELECT",
                    label: "流程分类",
                    required: true,
                    message: "请填写流程分类",
                    value: "",
                    itemId: "category",
                    width: 280,
                    placeholder: "请选择流程分类",
                    optionList: [],
                },
                {
                    type: "TEXTAREA",
                    label: "描述",
                    value: "",
                    itemId: "description",
                    width: 280,
                    placeholder: "请填写描述",
                },
            ],
            editFormList2: [
                {
                    type: "INPUT",
                    label: "模型标识",
                    disabled: true,
                    required: true,
                    message: "请填写模型标识",
                    value: "",
                    itemId: "modelKey",
                    width: 280,
                    placeholder: "请填写模型标识",
                },
                {
                    type: "INPUT",
                    label: "模型名称",
                    disabled: true,
                    required: true,
                    message: "请填写模型名称",
                    value: "",
                    itemId: "modelName",
                    width: 280,
                    placeholder: "请填写模型名称",
                },
                {
                    type: "SELECT",
                    label: "流程分类",
                    required: true,
                    message: "请填写流程分类",
                    value: "",
                    itemId: "category",
                    width: 280,
                    placeholder: "请选择流程分类",
                    optionList: [],
                },
                {
                    type: "TEXTAREA",
                    label: "描述",
                    value: "",
                    itemId: "description",
                    width: 280,
                    placeholder: "请填写描述",
                },
            ],
            historyTbColumns: [
                {
                    label: "模型标识",
                    dataIndex: "modelKey",
                    sortable: false,
                    fixed: false,
                    align: "left",
                },
                {
                    label: "模型名称",
                    dataIndex: "modelName",
                    align: "left",
                    width: "160",
                    sortable: false,
                    fixed: false,
                    slotcol: true,
                    slotName: "modelNameSlot",
                },
                {
                    label: "流程分类",
                    dataIndex: "category",
                    align: "center",
                    width: "160",
                    sortable: false,
                    fixed: false,
                },
                {
                    label: "模型版本",
                    dataIndex: "version",
                    align: "center",
                    width: "120",
                    sortable: false,
                    fixed: false,
                    slotcol: true,
                    slotName: "versionSlot",
                },
                {
                    label: "描述",
                    dataIndex: "description",
                    align: "left",
                    sortable: false,
                    fixed: false,
                },
                {
                    label: "创建时间",
                    dataIndex: "createTime",
                    align: "center",
                    sortable: true,
                    fixed: false,
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
            designerData: {
                loading: false,
                bpmnXml: "",
                modelId: 123,
                modelName: "",
                form: {
                    processName: null,
                    processKey: null,
                },
            },
            processView: {
                title: "",
                index: undefined,
                xmlData: "",
            },
            searchDataList: {},
            selectRow: {},
            tenantId: "",
        };
    },
    created () {
        this.tenantId = process.env.VUE_APP_BASE_TENANTID;
        this.getTableList();
        this.hanldselectList();
        this.setPagination(this.page, this.limit);
    },
    methods: {
        // 设置分页
        setPagination (page, pageSize) {
            let pageData = {page: page, limit: pageSize}
            this.$nextTick(() => {
                this.$refs.modelRef.setPagination(pageData);
            });
        },
        // 获取分页数据
        PaginationData (data) {
            this.page = data.page;
            this.limit = data.limit;
            this.getTableList(this.searchDataList);
        },
        // 获取历史分页数据
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
                wfModelBusiness: {
                    ...data,
                },
                orderAsc: false,
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
                            this.$refs.modelRef.getTableListNew(data);
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
                let editSelectList = JSON.parse(
                    JSON.stringify(this.editFormList1)
                );
                editSelectList.map((item) => {
                    if (item.itemId == "category") {
                        item.optionList = this.categoryList;
                    }
                });
                this.editFormList1 = editSelectList;
                let editSelectList2 = JSON.parse(
                    JSON.stringify(this.editFormList2)
                );
                editSelectList2.map((item) => {
                    if (item.itemId == "category") {
                        item.optionList = this.categoryList;
                    }
                });
                this.editFormList2 = editSelectList2;
            }
        },
        // 获取搜索栏下拉框数据方法
        hanldselectList () {
            this.$nextTick(() => {
                this.$refs.modelRef.getTopURL();
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
        // 添加
        hanldAddForm () {
            this.showEditform = true;
            let formType = "add";
            let rowInf = {
                modelKey: "",
                modelName: "",
                category: "",
                description: "",
            };
            this.editFormList = this.editFormList1;

            if (this.$refs.modelRef && this.showEditform) {
                this.$nextTick(() => {
                    this.$refs.modelRef.hanldQrtzUpdateForm(
                        this.tableFN.ADD,
                        formType,
                        rowInf,
                        "流程模型"
                    );
                });
            }
        },
        // 编辑
        hanldEditTable (row) {
            this.showEditform = true;
            let formType = "edit";
            this.editFormList = this.editFormList2;
            let rowInf = {};
            this.$http.callbackPost(
                this.tableFN.INFO,
                { modelId: row.modelId },
                null,
                function (result) {
                    if (result.code == httpStatus.ok) {
                        rowInf = result.data;
                        rowInf.newTask = false;
                        if (this.$refs.modelRef && this.showEditform) {
                            this.$nextTick(() => {
                                this.$refs.modelRef.hanldQrtzUpdateForm(
                                    this.tableFN.UPDATE,
                                    formType,
                                    rowInf,
                                    "流程模型"
                                );
                            });
                        }
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
        // 删除
        hanldDelTable (row) {
            row = JSON.parse(JSON.stringify(row));
            let modelId = [];
            modelId.push(row.modelId);
            this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    this.loading = true;
                    this.$http.callbackPost(
                        this.tableFN.DELECT,
                        { modelIds: modelId },
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
            let ids = this.selectRowData.map((item) => item.modelId);
            let modelNames = this.selectRowData.map((item) => item.modelName);
            this.$confirm(
                "此操作将删除选中" + modelNames + ", 是否继续?",
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
                        { modelIds: ids },
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
        // 设计
        handleDesigner (row) {
            this.designerData.title = "流程设计 - " + row.modelName;
            if (row.modelId) {
                this.designerData.modelId = row.modelId;
                this.designerData.form = {
                    processName: row.modelName,
                    processKey: row.modelKey,
                };
                this.$http.callbackPost(
                    this.tableFN.BPMNINFO,
                    { modelId: row.modelId },
                    null,
                    function (result) {
                        if (result.code == httpStatus.ok) {
                            this.designerData.bpmnXml = result.data;
                            this.$nextTick(() => {
                                this.$refs.modelRef.modelDesigner(
                                    row,
                                    this.designerData
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
        // 部署
        handleDeploy (row) {
            let data = {
                tenantId: process.env.VUE_APP_BASE_TENANTID,
                wfModelBusiness: { ...row },
            };
            this.$http.callbackPost(
                this.tableFN.DEPLOY,
                data,
                null,
                function (result) {
                    if (result.code == httpStatus.ok) {
                        this.$message({
                            message: result.data.message,
                            type: "success",
                        });
                        let obj = { path: "/workflow/deploy" };
                        this.$router.push(obj);
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
        // 流程图
        handleProcessView (row) {
            this.processView.title = "流程图 - " + row.modelName;
            if (row.modelId) {
                this.processView.index = row.modelId;
                this.$http.callbackPost(
                    this.tableFN.BPMNINFO,
                    { modelId: row.modelId },
                    null,
                    function (result) {
                        if (result.code == httpStatus.ok) {
                            this.processView.xmlData = result.data;
                            this.$nextTick(() => {
                                this.$refs.modelRef.modelProcessView(
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
        // 分页获取历史表格数据
        getHisTableList (row) {
            row = JSON.parse(JSON.stringify(row));
            let searchData = {
                index: this.hisPage,
                size: this.hisLimit,
                wfModelBusiness: {
                    modelKey: row.modelKey,
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
                            this.$refs.modelRef.historyList(
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
        // 历史
        handleHistory (row) {
            row = JSON.parse(JSON.stringify(row));
            this.selectRow = row;
            let searchData = {
                index: this.hisPage,
                size: this.hisLimit,
                wfModelBusiness: {
                    modelKey: row.modelKey,
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
                            this.$refs.modelRef.historyDetail(
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
        // 设为最新
        handleLatest (row) {
            let data = {
                tenantId: process.env.VUE_APP_BASE_TENANTID,
                wfModelBusiness: { modelKey: row.modelKey },
            };
            this.$http.callbackPost(
                this.tableFN.LATEST,
                data,
                null,
                function (result) {
                    if (result.code == httpStatus.ok) {
                        this.$message({
                            message: result.message,
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
        },
    },
};
</script>

<style lang="less" scoped></style>
