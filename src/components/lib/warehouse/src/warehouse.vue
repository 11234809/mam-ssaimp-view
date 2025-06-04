<!--
 * @Descripttion: 仓库管理
 * @version: 
 * @Author: ysl
 * @Date: 2024-09-18 09:56:16
 * @LastEditors: ysl
 * @LastEditTime: 2024-09-25 10:53:30
-->
<template>
    <div id="warehouse">
        <!-- 查询表单 -->
        <LoadingBox ref="whLoadingBox" class="cstBox" @hanldsearchData="getSearchSelectData">
            <template #boxslot="scope">
                <!-- 查询表单 -->
                <div class="searchBox">
                    <SearchForm :formSearch="formSearch" ref="whSearchForm" @getFromSearchData="getFromSearchData"
                        @fromSearchResetField="fromSearchResetField" @selectChange="selectChange" />
                </div>
            </template>
        </LoadingBox>
        <div class="tableBox">
            <!-- 表头操作按钮 -->
            <CommonTableBtngroup ref="whTableBtngroup" :btnArray="btnArray" @hanldAddForm="hanldAddForm">
            </CommonTableBtngroup>
            <!-- 数据表格 -->
            <CommonTable class="cstTable" ref="commonwhTable" :btnArray="btnArray" :tableHeight='tableHeight'
                :style="{ width: tableWidth ? tableWidth : '100%' }" :tableData="tableData" :tableFN="tableFN"
                :actionArray="actionArray" :tbColumns="tbColumns" :isPagination="isPagination"
                :tableDataLength="tableDataLength" :hasOrder="hasOrder" :hasChecked="hasChecked"
                :isSelectSlip="isSelectSlip" :isShowSummary="isShowSummary" :isCustomBtn="isCustomBtn"
                :acticonBtnWidth="acticonBtnWidth" @hanldEditTable="hanldEditTable" @hanldInfoTable="hanldInfoTable"
                @hanldDelTable="hanldDelTable" @updateCheckedArr="updateCheckedArr" @PaginationData="PaginationData">
            </CommonTable>
        </div>
        <EditForm ref="whEditform" :editFormList="editFormList" @getTableList="getTableList"
            @handleSubmit="handleSubmit" />
    </div>
</template>

<script>
import { LoadingBox, SearchForm, CommonTableBtngroup, CommonTable, EditForm } from "mam-base-ui";
export default {
    name: "Warehouse",
    components: {
        LoadingBox,
        SearchForm,
        CommonTableBtngroup,
        CommonTable,
        EditForm
    },
    props: {
        formSearch: { // 查询条件
            type: Object
        },
        btnArray: { // 表头操作按钮
            type: Array
        },
        tableHeight: { // table 表格高度
            type: String
        },
        tableWidth: { // 表格宽度-100%
            type: String
        },
        tableData: { // 表格数据
            type: Array
        },
        tableFN: { // 接口列表
            type: Object
        },
        actionArray: { // 表格操作按钮
            type: Array
        },
        tbColumns: { // 表格表头数据
            type: Array
        },
        isPagination: { // 是否分页
            type: Boolean
        },
        tableDataLength: { // 分页-总数
            type: Number,
        },
        hasOrder: { // 是否带序号
            type: Boolean
        },
        hasChecked: { // 是否多选
            type: Boolean
        },
        isShowSummary: { // 是否开启合计
            type: Boolean
        },
        isSelectSlip: { // 是否开启底部计数
            type: Boolean
        },
        isCustomBtn: { // 是否自定义按钮
            type: Boolean
        },
        acticonBtnWidth: { // 表格按钮宽度
            type: Number
        },
        editFormList: { // 表单数据
            type: Array
        },
    },
    data() {
        return {
            paginationData: {}
        };
    },
    mounted() {

    },
    created() {

    },
    methods: {
        // 调用LoadingBox获取搜索表单下拉列表数据接口
        getTopURL(url, param) {
            this.$nextTick(() => {
                this.$refs.whLoadingBox.getTopURL(url, param);
            });
        },
        // 返回搜索表单返回下拉数据
        getSearchSelectData(data) {
            let isGetSearchSelectData = typeof (this.$attrs.onGetSearchSelectData) == 'function';
            // 是否自定义搜索表单返回下拉数据
            if (isGetSearchSelectData) {
                this.$emit('getSearchSelectData', data);
            } else {
                // 没有下拉返回数据
            }
        },
        // 表单搜索
        getFromSearchData(data) {
            let isGetFromSearchData = typeof (this.$attrs.onGetFromSearchData) == 'function';
            let isGetTableList = typeof (this.$attrs.onGetTableList) == 'function';
            // 是否自定义表单搜索
            if (isGetFromSearchData) {
                this.$emit('getFromSearchData', data);
            } else {
                // 是否自定义表格数据
                if (isGetTableList) {
                    this.$emit('getTableList', data);
                } else {
                    // 定时任务默认搜索
                    this.$emit('getTableList', data);
                }
            }
        },
        // 搜索表单重置
        fromSearchResetField() {
            this.$refs.commonwhTable.getPaginationData({ page: 1, limit: this.paginationData.limit });
            let isFromSearchResetField = typeof (this.$attrs.onFromSearchResetField) == 'function';
            let isGetTableList = typeof (this.$attrs.onGetTableList) == 'function';
            // 是否自定义表单重置
            if (isFromSearchResetField) {
                this.$emit('fromSearchResetField');
            } else {
                // 是否自定义表格数据
                if (isGetTableList) {
                    this.$emit('getTableList');
                } else {
                    // 定时任务默认重置
                    this.$emit('getTableList');
                }
            }
        },
        // 表单下拉框选择变化触发
        selectChange(data) {
            let isSelectChange = typeof (this.$attrs.onSelectChange) == 'function';
            // 是否自定义表单下拉框选择功能
            if (isSelectChange) {
                this.$emit('selectChange', data);
            } else {
                // 
            }
        },
        // 编辑弹窗初始化
        hanldQrtzUpdateForm(url, formType, rowInf, name) {
            this.$nextTick(() => {
                this.$refs.whEditform.init(url, formType, rowInf, name);
            });
        },
        // 添加表单
        hanldAddForm() {
            let isHanldAddForm = typeof (this.$attrs.onHanldAddForm) == 'function'
            // 是否自定义添加事件
            if (isHanldAddForm) {
                this.$emit('hanldAddForm');
            } else {
                // 默认添加表单
                if (this.$refs.whEditform) {
                    this.$nextTick(() => {
                        this.$refs.whEditform.init(this.tableFN.ADD, "add", {}, "仓库管理");
                    });
                }
            }
        },
        // 编辑表单
        hanldEditTable(row) {
            let isHanldEditTable = typeof this.$attrs.onHanldEditTable == "function";
            // 是否自定义编辑事件
            if (isHanldEditTable) {
                this.$emit("hanldEditTable", row);
            } else {
                // 默认编辑表单
                if (this.$refs.whEditform) {
                    this.$nextTick(() => {
                        this.$refs.whEditform.init(this.tableFN.UPDATE, "edit", row, "仓库管理");
                    });
                }
            }
        },
        // 查看表单
        hanldInfoTable(row) {
            // 是否自定义详情事件
            let isHanldInfoTable = typeof this.$attrs.onHanldInfoTable == "function";
            if (isHanldInfoTable) {
                this.$emit("hanldInfoTable", row);
            } else {
                // 默认查看表单
                if (this.$refs.whEditform) {
                    this.$nextTick(() => {
                        this.$refs.whEditform.init(this.tableFN.INFO, "info", row, "仓库管理");
                    });
                }
            }
        },
        // 删除表单
        hanldDelTable(data) {
            // 是否自定义删除事件
            let isHanldDelTable = typeof this.$attrs.onHanldDelTable == "function";
            if (isHanldDelTable) {
                this.$emit("hanldDelTable", data);
            } else {
                this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(async () => {
                    const deleteResult = await this.tableFN.DELECT(row.id);
                    if (deleteResult.code == 200 || deleteResult.sucessed) {
                        this.$message({
                            message: "删除成功",
                            type: "success",
                        });
                        this.$emit('getTableList');
                    } else {
                        this.$message({
                            message: deleteResult.msg,
                            type: "error",
                        });
                    }
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
            }
        },
        // 获取多选选中数据
        updateCheckedArr(data) {
            // 是否自定义获取多选选中数据
            let isUpdateCheckedArr = typeof this.$attrs.onUpdateCheckedArr == "function";
            if (isUpdateCheckedArr) {
                this.$emit("updateCheckedArr", data);
            } else {
                //
            }
        },
        // 分页变化
        PaginationData(data) {
            // 是否自定义分页变化
            this.paginationData = data
            let isPaginationData = typeof this.$attrs.onPaginationData == "function";
            if (isPaginationData) {
                this.$emit("PaginationData", data);
            } else {
                this.$emit("getTableList", data);
            }
        },
        // 获取表格数据
        getTableList(data) {
            let isGetTableList = typeof (this.$attrs.onGetTableList) == 'function';
            // 是否自定义表格数据
            if (isGetTableList) {
                this.$emit('getTableList', data);
            } else {
                this.$nextTick(() => {
                    this.$refs.commonwhTable.getTableList(data);
                });
            }
        },
        // 更新表格数据
        getTableListNew(data) {
            this.$nextTick(() => {
                this.$refs.commonwhTable.getTableList(data);
            });
        },
        // 关闭编辑弹框
        editClose() {
            this.$nextTick(() => {
                this.$refs.whEditform.handleClose();
            });
        },
        // 处理提交
        handleSubmit(data) {
            let isHandleSubmit = typeof this.$attrs.onHandleSubmit == "function";
            // 是否自定义编辑事件
            if (isHandleSubmit) {
                this.$emit("handleSubmit", data);
            } else {
                // 组织管理默认提交
            }
        },
    }
}
</script>

<style scoped lang='less'>
#warehouse {
    .tableBox {
        .edit-form-box-darkBlue {
            ::v-deep(.el-button) {
                color: var(--btnTextColor);
                background-color: var(--btnBgColor)
            }
        }
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
}
</style>
