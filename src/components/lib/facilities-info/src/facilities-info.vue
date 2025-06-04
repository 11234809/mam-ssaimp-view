<template>
    <div id="facilitiesInfo">
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
                @hanldAddForm="hanldAddForm"
            ></CommonTableBtngroup>
            <CommonTable
                ref="commonRoleTable"
                :style="{ width: tableWidth ? tableWidth : '100%' }"
                :btnArray="btnArray"
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
                :acticonBtnWidth="acticonBtnWidth"
                @PaginationData="PaginationData"
            >
                <template #btnslot="scope">
                    <slot name="btnslot" v-bind="{ scope }"></slot>
                </template>
            </CommonTable>
        </div>
        <EditForm
            ref="editform"
            :editFormList="editFormList"
            :dialogWidth="dialogWidth"
            :labelWidth="labelWidth"
            @getTableList="getTableList"
            @hanldSelectChange="editSelectChange"
            @handleClose="handleEditFormClose"
        />
        <el-dialog
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
                    style="background: var(--bgGradientBodyColor); color: #fff"
                >
                    <span>{{ dialogTitle }}</span>
                </div>
            </template>
            <el-scrollbar max-height="600" style="margin: 0 10px;border-radius: 10px;">
                <TreeForm
                    ref="menuListTree"
                    :treeData="treeData"
                    :isCheckbox="isCheckbox"
                    :isExpandAll="isExpandAll"
                    :isActionShow="isActionShow"
                    :actionArray="actionArray2"
                    :isSearch="isSearch"
                ></TreeForm>
            </el-scrollbar>
            <template #footer>
                <div class="dialog-footer" style="padding-right: 15px">
                    <el-button @click="dialogVisible2 = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
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
} from "mam-base-ui";
export default {
    name: "facilitiesInfo",
    components: {
        LoadingBox,
        SearchForm,
        CommonTableBtngroup,
        CommonTable,
        EditForm,
        TreeForm,
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
        dataOption: {
            // 查询条件中下拉列表接口参数
            type: Object,
        },
        tableDataLength: {
            //列表数据总长度
            type: Number,
        },
    },
    data() {
        return {
            page: 1,
            limit: 10,
            dialogVisibleLog: false,
            paginationData: {},
            dialogTitle: "角色授权",
            dialogVisible2: false,
            modifyPermissionsUrl: "",
            treeData: [],
            roleId: "",
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
        //添加新的数据,传递到表单
        toHanldAddForm(url, type, data, name) {
            this.$nextTick(() => {
                this.$refs.editform.init(url, type, data, name);
            });
        },
        //添加新的数据,传递到表单
        toHanldAddForm2(id, url, treeData, selectData) {
            this.$nextTick(() => {
                this.roleId = id;
                this.modifyPermissionsUrl = url;
                this.dialogVisible2 = true;
                this.treeData = treeData;
                this.$nextTick(() => {
                    this.$refs.menuListTree.setChecked(selectData, true, false);
                });
            });
        },
        //修改角色授权
        handleSubmit() {
            let sendList = this.$refs.menuListTree.getCheckedKeys();
            this.$http.callbackPost(
                this.modifyPermissionsUrl,
                {
                    entityId: this.roleId,
                    resourceList: sendList,
                },
                null,
                function (result) {
                    if (result.code == 200) {
                        this.$message({
                            message: result.message || result.data.message,
                            type: "success",
                        });
                        this.$emit("getTableList");
                        this.dialogVisible2 = false;
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
        // 关闭编辑弹框
        handleEditFormClose () {
            let isHandleEditFormClose =
                typeof this.$attrs.onHandleEditFormClose == "function";
            if (isHandleEditFormClose) {
                this.$emit("handleEditFormClose");
            } else {
                this.$nextTick(() => {
                    this.$refs.editform.handleEditClose();
                });
            }
        },
        // 默认关闭编辑弹框
        defultEditClose () {
            this.$nextTick(() => {
                this.$refs.editform.handleEditClose();
            });
        },
        //点击左上角X时触发的方法
        handleClose() {
            this.roleId = "";
            this.modifyPermissionsUrl = "";
            this.treeData = [];
            this.$refs.menuListTree.setCheckedKeys([]);
            this.dialogVisible2 = false;
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
        modifyPermissions(data) {
            let isHandleSwitchSource =
                typeof this.$attrs.onModifyPermissions == "function";
            if (isHandleSwitchSource) {
                this.$emit("modifyPermissions", data);
            } else {
                this.$nextTick(() => {
                    this.$refs.commonRoleTable.modifyPermissions(data);
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
                //
            }
        },
        // 编辑表单下拉框选择变化
        editSelectChange(value, data) {
            let isEidtSelectChange =
                typeof this.$attrs.onEidtSelectChange == "function";
            // 是否自定义表单下拉框选择功能
            if (isEidtSelectChange) {
                this.$emit("eidtSelectChange", value, data);
            }
        },
        //重写提交
        handleSubmit2(data) {
            this.$http.callbackPost(
                this.tableFN.EDIT,
                data,
                null,
                function (result) {
                    if (result.code == 200) {
                        this.$message({
                            message: result.message || result.data.message,
                            type: "success",
                        });
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
        // 回调修改表单值
        toResetData(itemId, resetData) {
            this.$nextTick(() => {
                this.$refs.editform.toResetData(itemId, resetData);
            });
        },
    },
};
</script>

<style lang="less"></style>
