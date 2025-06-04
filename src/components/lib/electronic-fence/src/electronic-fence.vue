<template>
    <div id="electronicFence">
        <div class="boxLeft">
            <div class="borderLeft">电子围栏</div>
            <div class="leftBox">
                <TreeForm
                    ref="treeFrom"
                    :treeData="treeData"
                    :isCheckbox="isCheckbox"
                    :isExpandAll="isExpandAll"
                    :isActionShow="isActionShow"
                    :actionArray="actionArray2"
                    :isSearch="isSearch"
                    @nodeclick="nodeclick"
                >
                    <template #operation="scope">
                        <slot name="operation" v-bind="{ scope }"></slot>
                    </template>
                </TreeForm>
            </div>
        </div>
        <div class="right" style="float: left; width: 80%">
            <div class="rightBox">
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
                    <CommonTableBtngroup
                        :btnArray="btnArray"
                        @hanldAddForm="modifyPermissions({}, 'add')"
                        @hanldExport="hanldExport"
                    ></CommonTableBtngroup>
                    <CommonTable
                        ref="commonRoleTable"
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
                        @hanldEditTable="hanldEditTable"
                        @hanldInfoTable="hanldInfoTable"
                        @hanldDelTable="hanldDelTable"
                        @hanldAddForm2="hanldAddForm2"
                        @handleDelBtn="handleDelBtn"
                        :acticonBtnWidth="acticonBtnWidth"
                        @PaginationData="PaginationData"
                    >
                        <template #btnslot="scope">
                            <slot name="btnslot" v-bind="{ scope }"></slot>
                        </template>
                    </CommonTable>
                </div>
                <edit-form-drawer
                    ref="editform"
                    :editFormList="editFormList"
                    :dialogWidth="dialogWidth"
                    :labelWidth="labelWidth"
                    @getTableList="getTableList"
                    @handleSubmit="handleSubmit1"
                />
                <edit-form-drawer
                    ref="editform2"
                    :editFormList="editFormList"
                    :dialogWidth="dialogWidth"
                    :labelWidth="labelWidth"
                    @getTableList="getTableList"
                    @handleSubmit="handleSubmit2"
                />
                <el-drawer
                    v-model="dialogVisible2"
                    v-if="dialogVisible2"
                    :width="dialogWidth"
                    :before-close="handleClose"
                    destroy-on-close
                    :close-on-click-modal="false"
                    style="padding: 0 0 20px 0"
                >
                    <template
                        #header
                        style="
                            background: var(--bgGradientBodyColor);
                            color: #fff;
                            display: flex;
                            height: 45px;
                            padding-left: 15px;
                            align-items: center;
                        "
                    >
                        <div
                            class="my-header"
                            style="background-color: transparent; color: #fff"
                        >
                            <span>{{ dialogTitle }}</span>
                        </div>
                    </template>

                    <el-form
                        ref="editRuleForm"
                        :disabled="isDisabled"
                        :inline="true"
                        :model="editFormData"
                        class="edit-form-inline"
                        :class="{ 'from-info': isInfo }"
                    >
                        <el-form-item
                            prop="fenceCode"
                            label="电子围栏编码:"
                            :rules="[
                                {
                                    required: true,
                                    message: '请填写电子围栏编码',
                                },
                            ]"
                        >
                            <el-input
                                :disabled="true"
                                :readonly="true"
                                v-model="editFormData.fenceCode"
                                style="width: 360px"
                                placeholder="请填写电子围栏编码"
                            />
                        </el-form-item>
                        <el-form-item
                            prop="fenceName"
                            label="电子围栏名称:"
                            :rules="[
                                {
                                    required: true,
                                    message: '请填写电子围栏名称',
                                },
                            ]"
                        >
                            <el-input
                                :disabled="isDisabled"
                                :readonly="isReadonly"
                                v-model="editFormData.fenceName"
                                style="width: 360px"
                                placeholder="请填写电子围栏名称"
                            />
                        </el-form-item>
                        <el-form-item
                            label="电子围栏范围:"
                            style="width: 450px"
                        >
                            <TreeForm
                                style="width: 480px"
                                ref="menuListTree"
                                :treeData="treeData2"
                                :isCheckbox="isCheckbox2"
                                :isExpandAll="isExpandAll2"
                                :isActionShow="isActionShow2"
                                :actionArray="actionArray3"
                                :isSearch="isSearch"
                                :isShowControlBox="false"
                                @nodeclick="nodeclick"
                            ></TreeForm>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <div class="dialog-footer" style="padding-right: 15px">
                            <el-button @click="dialogVisible2 = false"
                                >取消</el-button
                            >
                            <el-button
                                type="primary"
                                @click="handleSubmit"
                                v-if="!isDisabled"
                            >
                                确认
                            </el-button>
                        </div>
                    </template>
                </el-drawer>
            </div>
        </div>
    </div>
</template>

<script>
import {
    LoadingBox,
    SearchForm,
    CommonTableBtngroup,
    CommonTable,
    EditForm,
    TreeForm,
    EditFormDrawer,
} from "mam-base-ui";
export default {
    name: "role",
    components: {
        LoadingBox,
        SearchForm,
        CommonTableBtngroup,
        CommonTable,
        EditForm,
        TreeForm,
        EditFormDrawer,
    },
    props: {
        dialogWidth: {
            //表单宽度
            type: Number,
        },
        labelWidth: {
            //表单文字宽度
            type: Number,
        },
        formSearch: {
            // 查询条件
            type: Object,
        },
        btnArray: {
            //添加按钮
            type: Array,
        },
        tableWidth: {
            //表格宽度
            type: String,
        },
        actionArray: {
            //表格按钮组
            type: Array,
        },
        acticonBtnWidth: {
            //表格按钮组长度
            type: Number,
        },
        tableFN: {
            //表格接口
            type: Object,
        },
        tbColumns: {
            //表格表头接口
            type: Array,
        },
        tableData: {
            //表格数据
            type: Array,
        },
        editFormList: {
            //表单内容
            type: Array,
        },
        editFormList1: {
            //表单内容(暂存)
            type: Array,
        },
        tableHeight: {
            //表单高度
            type: String,
        },
        treeData: {
            //树表单数据
            type: Array,
        },
        actionArray2: {
            //树表单操作按钮
            type: Array,
        },
        isActionShow: {
            //树表单操作按钮是否显示操作按钮
            type: Boolean,
        },
        isCheckbox: {
            //树表单操作按钮是否多选
            type: Boolean,
        },
        isExpandAll: {
            //树表单操作按钮是否展开
            type: Boolean,
        },
        isSearch: {
            //树表单操作按钮是否开启搜索
            type: Boolean,
        },
        actionArray3: {
            //树表单操作按钮
            type: Array,
        },
        isActionShow2: {
            //树表单操作按钮是否显示操作按钮
            type: Boolean,
        },
        isCheckbox2: {
            //树表单操作按钮是否多选
            type: Boolean,
        },
        isExpandAll2: {
            //树表单操作按钮是否展开
            type: Boolean,
        },
        isSearch2: {
            //树表单操作按钮是否开启搜索
            type: Boolean,
        },
        dataOption: {
            // 查询条件中下拉列表接口参数
            type: Object,
        },
        tableDataLength: {
            //列表数据总长度
            type: Number,
        },
        users: {
            //用户表
            type: Object,
        },
    },
    data() {
        return {
            page: 1,
            limit: 10,
            dialogVisibleLog: false,
            paginationData: {},
            dialogTitle: "电子围栏",
            dialogVisible2: false,
            modifyPermissionsUrl: "",
            fenceId: "",
            treeData2: [],
            editFormData: {
                fenceCode: "",
                fenceName: "",
            },
            isDisabled: false,
            isReadonly: false,
        };
    },
    created() {},
    methods: {
        //获取右侧表单值
        getTableList(data) {
            let isGetTableList =
                typeof this.$attrs.onGetTableList == "function";
            if (isGetTableList) {
                this.$emit("getTableList", data);
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.getTableList(data);
                });
            }
        },
        //刷新右侧表单值
        getNewTableList() {
            this.$nextTick(() => {
                this.$refs.commonRoleTable.getTableList();
            });
        },
        //刷新右侧表单值
        getNewTreeTable() {
            this.$nextTick(() => {
                this.$refs.commonRoleTable.getTreeTable();
            });
        },
        //获取右侧表单值
        getTreeTable(data) {
            let isGetTreeTable =
                typeof this.$attrs.onGetTreeTable == "function";
            if (isGetTreeTable) {
                this.$emit("getTreeTable", data);
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.getTreeTable(data);
                });
            }
        },
        //添加新的数据
        hanldAddForm() {
            let isHanldAddForm =
                typeof this.$attrs.onHanldAddForm == "function";
            if (isHanldAddForm) {
                this.$emit("hanldAddForm", "");
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.hanldAddForm();
                });
            }
        },
        //添加新的数据
        hanldAddForm2(data) {
            let isHanldAddForm2 =
                typeof this.$attrs.onHanldAddForm2 == "function";
            if (isHanldAddForm2) {
                this.$emit("hanldAddForm2", data);
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.hanldAddForm2(data);
                });
            }
        },
        //删除围栏用户
        handleDelBtn(data) {
            let isHandleDelBtn =
                typeof this.$attrs.onHandleDelBtn == "function";
            if (isHandleDelBtn) {
                this.$emit("handleDelBtn", data);
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.handleDelBtn(data);
                });
            }
        },
        //导出数据
        hanldExport() {
            let isHanldExport = typeof this.$attrs.onHanldExport == "function";
            if (isHanldExport) {
                this.$emit("hanldExport", "");
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.hanldExport();
                });
            }
        },
        //添加新的数据,传递到表单
        toHanldExport() {},
        //添加新的数据,传递到表单
        toHanldAddForm(url, type, data, name) {
            this.$nextTick(() => {
                this.$refs.editform.init(url, type, data, name);
            });
        },
        //添加新的数据,传递到表单
        toHanldAddForm2(id, url, treeData, selectData, infoData, type) {
            this.$nextTick(() => {
                this.fenceId = id;
                this.modifyPermissionsUrl = url;
                this.dialogVisible2 = true;
                this.treeData2 = treeData;
                this.editFormData.fenceCode = infoData.fenceCode;
                this.editFormData.fenceName = infoData.fenceName;

                this.$nextTick(() => {
                    this.$refs.menuListTree.setCheckedKeys(selectData);
                });
            });

            if (type == "info") {
                this.isDisabled = true;
            } else {
                this.isDisabled = false;
            }
        },
        //添加新的数据,传递到表单
        toHanldAddForm3(url, type, data, name) {
            this.$nextTick(() => {
                this.$refs.editform2.init(url, type, data, name);
            });
        },
        //修改角色授权
        handleSubmit() {
            this.$refs.editRuleForm.validate((valid) => {
                if (valid) {
                    let sendList = this.$refs.menuListTree.getCheckedKeys();
                    this.$http.callbackPost(
                        this.modifyPermissionsUrl,
                        {
                            entityId: this.fenceId,
                            fenceName: this.editFormData.fenceName,
                            fenceCode: this.editFormData.fenceCode,
                            facilitieList: sendList,
                        },
                        null,
                        function (result) {
                            if (result.code == 200) {
                                this.$message({
                                    message:
                                        result.message || result.data.message,
                                    type: "success",
                                });
                                this.$emit("getTableList");
                                this.$emit("getTreeTable");
                                this.handleClose();
                                this.dialogVisible2 = false;
                            } else {
                                this.$message({
                                    message:
                                        result.message || result.data.message,
                                    type: "info",
                                });
                            }
                        },
                        function (error) {
                            this.$message({
                                message: error,
                                type: "error",
                            });
                        },
                        this
                    );
                } else {
                    return false;
                }
            });
        },
        //点击左上角X时触发的方法
        handleClose() {
            this.fenceId = "";
            this.modifyPermissionsUrl = "";
            this.dialogVisible2 = false;
            this.treeData2 = [];
            this.editFormData.fenceCode = "";
            this.editFormData.fenceName = "";
            this.$refs.menuListTree.setCheckedKeys([]);
        },
        //修改数据
        hanldEditTable(data) {
            let isHanldEditTable =
                typeof this.$attrs.onHanldEditTable == "function";
            if (isHanldEditTable) {
                this.$emit("hanldEditTable", data);
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.hanldEditTable(data);
                });
            }
        },
        //修改数据,传递到表单
        toHanldEditTable(url, type, data, name) {
            this.$nextTick(() => {
                this.$refs.editform.init(url, type, data, name);
            });
        },
        //获取数据
        hanldInfoTable(data) {
            let isHanldInfoTable =
                typeof this.$attrs.onHanldInfoTable == "function";
            if (isHanldInfoTable) {
                this.$emit("hanldInfoTable", data);
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.hanldInfoTable(data);
                });
            }
        },
        //获取数据,传递到表单
        toHanldInfoTable(url, type, data, name) {
            this.$nextTick(() => {
                this.$refs.editform.init(url, type, data, name);
            });
        },
        //删除数据
        hanldDelTable(data) {
            let isHanldDelTable =
                typeof this.$attrs.onHanldDelTable == "function";
            if (isHanldDelTable) {
                this.$emit("hanldDelTable", data);
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.hanldDelTable(data);
                });
            }
        },
        //修改用户权限
        modifyPermissions(data, type) {
            let isHandleSwitchSource =
                typeof this.$attrs.onModifyPermissions == "function";
            if (isHandleSwitchSource) {
                this.$emit("modifyPermissions", data, type);
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.modifyPermissions(data, type);
                });
            }
        },
        // 获取返回的搜索表单下拉列表总数据
        hanldsearchData(data) {
            let isHanldsearchData =
                typeof this.$attrs.onHanldsearchData == "function";
            // 是否自定义表格数据
            if (isHanldsearchData) {
                this.$emit("hanldsearchData", data);
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.getTableList(data);
                });
            }
        },
        // 调用LoadingBox获取搜索表单下拉列表数据接口
        getTopURL() {
            this.$nextTick(() => {
                this.$refs.loadingBox.getTopURL(
                    this.tableFN.SELECT,
                    this.dataOption
                );
            });
        },
        // 分页变化
        PaginationData(data) {
            // 是否自定义分页变化
            this.paginationData = data;
            let isPaginationData =
                typeof this.$attrs.onPaginationData == "function";
            if (isPaginationData) {
                this.$emit("PaginationData", data);
            } else {
                this.$emit("getTableList", data);
            }
        },
        // 搜索表单重置
        fromSearchResetField() {
            this.$refs.commonRoleTable.getPaginationData({
                page: 1,
                limit: this.paginationData.limit,
            });
            let isFromSearchResetField =
                typeof this.$attrs.onFromSearchResetField == "function";
            let isGetTableList =
                typeof this.$attrs.onGetTableList == "function";
            // 是否自定义表单重置
            if (isFromSearchResetField) {
                this.$emit("fromSearchResetField");
            } else {
                // 是否自定义表格数据
                if (isGetTableList) {
                    this.$emit("getTableList");
                } else {
                    this.$nextTick(() => {
                        this.$refs.commonRoleTable.getTableList();
                    });
                }
            }
        },
        // 表单搜索
        getFromSearchData(data) {
            let isGetFromSearchData =
                typeof this.$attrs.onGetFromSearchData == "function";
            let isGetTableList =
                typeof this.$attrs.onGetTableList == "function";
            // 是否自定义表单搜索
            if (isGetFromSearchData) {
                this.$emit("getFromSearchData", data);
            } else {
                // 是否自定义表格数据
                if (isGetTableList) {
                    this.$emit("getTableList", data);
                } else {
                    this.$nextTick(() => {
                        this.$refs.commonRoleTable.getTableList(data);
                    });
                }
            }
        },
        // 表单下拉框选择变化触发
        selectChange(data) {
            let isSelectChange =
                typeof this.$attrs.onSelectChange == "function";
            // 是否自定义表单下拉框选择功能
            if (isSelectChange) {
                this.$emit("selectChange", data);
            } else {
                this.$nextTick(() => {
                    this.$refs.searchForm.selectChange(data);
                });
            }
        },
        //重写提交
        handleSubmit1(data) {
            this.$http.callbackPost(
                this.tableFN.UPDATE,
                data,
                null,
                function (result) {
                    if (result.code == 200) {
                        if (result.data.status) {
                            this.$message({
                                message: result.message || result.data.message,
                                type: "success",
                            });
                        } else {
                            this.$message({
                                message: result.message || result.data.message,
                                type: "info",
                            });
                        }
                        this.getTableList();
                        this.$refs.editform.handleClose();
                    } else {
                        this.$message({
                            message: result.message || result.data.message,
                            type: "info",
                        });
                    }
                },
                function (error) {
                    this.$message({
                        message: error,
                        type: "error",
                    });
                },
                this
            );
        },
        //重写提交
        handleSubmit2(data) {
            let sendData = data;

            this.users.forEach((item) => {
                if (item.value == sendData.userId) {
                    sendData["userName"] = item.name;
                }
            });
            this.$http.callbackPost(
                this.tableFN.UPDATE2,
                data,
                null,
                function (result) {
                    if (result.code == 200) {
                        this.$message({
                            message: result.message || result.data.message,
                            type: "success",
                        });
                        this.getTableList();
                        this.$emit("getTreeTable");
                        this.$refs.editform2.handleClose();
                    } else {
                        this.$message({
                            message: result.message || result.data.message,
                            type: "info",
                        });
                    }
                },
                function (error) {
                    this.$message({
                        message: error,
                        type: "error",
                    });
                },
                this
            );
        },
        nodeclick() {},
    },
};
</script>

<style lang="less" scoped>
#electronicFence {
    height: 100%;
    .boxLeft {
        float: left;
        width: 19%;
        height: 100%;
        padding: 10px;
        color: var(--textColor);
        background-color: var(--boxBgColor);
        border-radius: 10px;
        margin-right: 10px;
        overflow: hidden;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;

        .edit-form-box-darkBlue {
            background: var(--nullBgColor);
        }
    }
    .boxLeft::-webkit-scrollbar {
        display: none;
    }
    .borderLeft {
        font-size: 15px;
        padding-left: 10px;
        text-align: start;
        border-left: 3px solid #409eff;
    }
    .el-dialog__title {
        color: #ffffff !important;
    }
    .el-dialog__header.show-close {
        padding-right: 0 !important;
    }
    .el-dialog__headerbtn .el-dialog__close {
        color: #ffffff !important;
    }
    
    .right {
        height: 100%;
        overflow: hidden;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    ::v-deep(.right)::-webkit-scrollbar {
        display: none;
    }
}
</style>
