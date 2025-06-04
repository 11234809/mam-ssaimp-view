<template>
    <div class="base-area-config">
        <!-- 筛选 -->
        <el-form
            inline
            :model="formInline"
            class="custom_form"
            label-width="120px"
            label-position="right"
            label-suffix=":"
        >
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="服务区" class="form_item">
                        <el-select
                            v-model="formInline.serviceAreaId"
                            placeholder="请选择服务区"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in serviceAreaList"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="区域名称" class="form_item">
                        <el-input
                            v-model="formInline.name"
                            placeholder="请输入区域名称"
                            clearable
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="状态" class="form_item">
                        <el-select
                            v-model="formInline.status"
                            placeholder="请选择状态"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in areaStatusList"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8" class="btn">
                    <el-form-item class="btn_form__item">
                        <el-button type="primary" @click="handleAdd"
                            >新增</el-button
                        >
                        <el-button type="primary" @click="getData"
                            >查询</el-button
                        >
                        <el-button type="primary" @click="onReset"
                            >重置</el-button
                        >
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 列表 -->
        <!-- <div class="tips_box">
        <span class="tips"
            >已选择 <span class="tips_num">{{ checkNum }}</span> 项</span
        >
        <el-button link class="tips_num_close" @click="tableCheckClear"
            >清空</el-button
        >
    </div> -->
        <el-table
            class="custom_table"
            ref="tableRef"
            border
            :data="tableData"
            @selection-change="selectionChange"
            style="width: 100%"
            :row-style="{ height: '20px' }"
        >
            <!-- <el-table-column type="selection" width="50" fixed="left"/> -->
            <el-table-column
                type="index"
                label="序号"
                width="55"
                align="center"
                fixed="left"
            />
            <el-table-column
                prop="serviceAreaName"
                label="服务区"
                align="center"
                width="240"
            />
            <el-table-column
                prop="name"
                label="区域名称"
                align="center"
                width="240"
            />
            <el-table-column
                prop="area"
                label="区域面积"
                align="center"
                width="120"
            />
            <el-table-column
                prop="longitude"
                label="经度"
                align="center"
                width="120"
            />
            <el-table-column
                prop="latitude"
                label="纬度"
                align="center"
                width="120"
            />
            <el-table-column prop="remark" label="备注" align="center" />
            <el-table-column
                prop="status"
                label="查看二维码"
                align="center"
                width="100"
            >
                <template #default="scope">
                    <el-button type="primary" @click="viewQRCode(scope.row)"
                        >查看</el-button
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                align="center"
                width="100"
            >
                <template #default="scope">
                    <!-- <div v-for="item in areaStatusList">
                        <p v-if="scope.row.status == item.code">{{item.name}}</p>
                    </div> -->
                    <p v-if="scope.row.status == 1">启用</p>
                    <p v-else>停用</p>
                </template>
            </el-table-column>
            <el-table-column
                width="200"
                label="操作"
                align="center"
                fixed="right"
            >
                <template #default="scope">
                    <el-button
                        link
                        type="primary"
                        @click="handleEdit(scope.row)"
                        >编辑
                    </el-button>
                    <el-button
                        link
                        type="primary"
                        @click="handleDetail(scope.row)"
                        >详情
                    </el-button>
                    <el-button
                        v-if="scope.row.status == 0"
                        link
                        type="primary"
                        @click="setStatus(scope.row, 1)"
                        >启用
                    </el-button>
                    <el-button
                        v-else
                        link
                        type="primary"
                        @click="setStatus(scope.row, 0)"
                        >停用
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination_box">
            <el-pagination
                v-model:current-page="page"
                v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20, 30, 50]"
                layout="total,  prev, pager, next,sizes, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <!-- 详情弹窗 -->
        <el-dialog
            class="custom_dialog"
            v-model="dialogVisible"
            :title="dialogTitle"
            width="500"
            @close="closeDialog"
        >
            <el-form
                ref="formRef"
                :rules="rules"
                :model="dialigForm"
                label-width="auto"
                style="max-width: 600px"
            >
                <el-form-item label="服务区" prop="serviceAreaId">
                    <el-select
                        v-model="dialigForm.serviceAreaId"
                        placeholder="请选择服务区"
                        clearable
                        :disabled="isDisabled"
                    >
                        <el-option
                            v-for="(item, index) in serviceAreaList"
                            :key="index"
                            :label="item.name"
                            :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="区域名称" prop="name">
                    <el-input
                        v-model="dialigForm.name"
                        :disabled="isDisabled"
                    />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select
                        v-model="dialigForm.status"
                        placeholder="请选择状态"
                        clearable
                        :disabled="isDisabled"
                    >
                        <el-option
                            v-for="(item, index) in areaStatusList"
                            :key="index"
                            :label="item.name"
                            :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                    <el-input
                        v-model="dialigForm.longitude"
                        :disabled="isDisabled"
                    />
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                    <el-input
                        v-model="dialigForm.latitude"
                        :disabled="isDisabled"
                    />
                </el-form-item>
                <el-form-item label="区域面积">
                    <el-input
                        v-model="dialigForm.area"
                        :disabled="isDisabled"
                    />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        type="textarea"
                        v-model="dialigForm.remark"
                        :disabled="isDisabled"
                    />
                </el-form-item>
                <!-- <el-form-item v-if="dialogTitle != '新增'" label="二维码图片">
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="dialigForm.url"
                        fit="cover"
                    ></el-image>
                </el-form-item> -->
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        type="primary"
                        v-if="dialogTitle == '编辑' || dialogTitle == '新增'"
                        @click="dialogConfirm"
                        >保存</el-button
                    >
                    <el-button type="primary" @click="closeDialog"
                        >关闭</el-button
                    >
                </div>
            </template>
        </el-dialog>
        <el-dialog
            class="custom_dialog"
            v-model="dialogVisible2"
            title="区域二维码"
            width="500"
        >
            <el-form
                ref="printFormRef"
                label-width="auto"
                style="max-width: 600px"
            >
                <div style="text-align: center">
                    <div
                        id="printMe"
                        style="width: 200px; height: 270px; margin: 0 auto"
                    >
                        <div
                            class="print-title"
                            style="
                                font-size: 12px;
                                font-weight: 600;
                                color: gray;
                            "
                        >
                            智慧服务区综合管理平台-区域管理
                        </div>
                        <img style="width: 200px" :src="codeUrl" />
                        <div
                            style="
                                width: 200px;
                                text-align: center;
                                font-size: large;
                            "
                        >
                            {{ this.codeTitle }}
                        </div>
                    </div>
                    <el-button v-print="'#printMe'"> 打印 </el-button>
                </div>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible2 = false"
                        >关闭</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";

export default {
    name: "securityStaff",
    data() {
        return {
            dialogVisible: false,
            // 筛选表单数据
            formInline: {
                serviceAreaId: "",
                name: "",
                status: "",
            },
            syncTime: [],
            // 弹窗表单数据
            dialigForm: {
                serviceAreaId: "",
                name: "",
                status: "",
                longitude: "",
                latitude: "",
                area: "",
                remark: "",
                url: "",
            },
            rules: {
                serviceAreaId: [
                    {
                        required: true,
                        message: "请输入服务区名称",
                        trigger: "change",
                    },
                ],
                name: [
                    {
                        required: true,
                        message: "请输入区域名称",
                        trigger: "change",
                    },
                ],
                status: [
                    {
                        required: true,
                        message: "请选择状态",
                        trigger: "change",
                    },
                ],
                longitude: [
                    {
                        required: true,
                        message: "请输入经度",
                        trigger: "change",
                    },
                ],
                latitude: [
                    {
                        required: true,
                        message: "请输入纬度",
                        trigger: "change",
                    },
                ],
            },
            page: 1,
            pageSize: 10,
            total: 0,
            checkNum: 0, // 已选择项
            // 特殊车辆信息列表数据
            tableData: [],
            serviceAreaList: [],
            areaList: [],
            areaStatusList: [],
            selectData: [],
            isDisabled: true,
            dialogTitle: "",
            dialogVisible2: false,
            codeUrl: "",
            codeTitle: "",
        };
    },
    created() {
        this.getDictionary();
        this.getSelect();
        this.getData();
    },

    methods: {
        // 获取特殊车辆列表数据
        getData() {
            let _this = this;
            this.$http.callbackPost(
                "/bas/areaConfig/queryPage",
                {
                    index: this.page,
                    size: this.pageSize,
                    ...this.formInline,
                },
                null,
                function (result) {
                    if (result.code == 200) {
                        _this.tableData = result.data.records;
                        _this.total = result.data.total;
                    } else {
                        console.log(result);
                    }
                },
                function (error) {
                    console.log(error);
                }
            );
        },
        // 获取字典数据
        getDictionary() {
            let _this = this;
            this.$http.callbackPost(
                "/pub/common/queryNormalOptions",
                {
                    queriers: [
                        { alias: "whetherEnableDictionary", param: null },
                    ],
                },
                null,
                function (result) {
                    if (result.code == 200) {
                        _this.areaStatusList = result.data
                            .whetherEnableDictionary
                            ? result.data.whetherEnableDictionary
                            : [];
                    }
                    console.log(_this.areaStatusList, "_this.areaStatusList");
                },
                function (error) {
                    console.log(error);
                }
            );
        },
        //获取下拉数据
        getSelect() {
            let _this = this;
            this.$http.callbackPost(
                "/pub/ssaimp/common/getServiceArea",
                {},
                null,
                function (result) {
                    if (result.code == 200) {
                        _this.serviceAreaList = result.data.records;
                        _this.serviceAreaList.forEach((item) => {
                            item.code = item.value;
                            item.name = item.label;
                        });
                    } else {
                        console.log(result);
                    }
                },
                function (error) {
                    console.log(error);
                }
            );
        },
        // 重置筛选
        onReset() {
            Object.keys(this.formInline).map((key) => {
                this.formInline[key] = "";
            });
            this.page = 1;
            this.pageSize = 10;
            this.formInline = {
                serviceAreaId: "",
                name: "",
            };
            this.getData();
        },
        // 已选择项
        selectionChange(val) {
            this.checkNum = val.length;
            this.selectData = val;
        },
        // 清空已选择项
        tableCheckClear() {
            this.$refs.tableRef.clearSelection();
        },
        // 分页大小
        handleSizeChange(val) {
            this.pageSize = val;
            this.getData();
        },
        // 分页页数
        handleCurrentChange(val) {
            this.page = val;
            this.getData();
        },
        //新增
        handleAdd() {
            this.dialogTitle = "新增";
            this.dialigForm = {
                serviceAreaId: "",
                name: "",
                status: "",
                longitude: "",
                latitude: "",
                area: "",
                remark: "",
                url: "",
            };
            this.dialogVisible = true;
            this.isDisabled = false;
        },
        //编辑详情
        handleEdit(row) {
            this.dialogTitle = "编辑";
            let _that = this;
            this.$http.callbackPost(
                "/bas/areaConfig/get",
                { id: row.entityId },
                null,
                function (result) {
                    if (result.code == 200) {
                        _that.dialigForm = result.data;
                        _that.dialigForm.url =
                            process.env.VUE_APP_API_HOST_URL +
                            process.env.VUE_APP_API_BASE_URL +
                            `/pub/common/file/download?service=basAreaConfigServiceImpl&id=${result.data.entityId}`;
                        _that.codeUrl = _that.dialigForm.url;
                        _that.codeTitle = _that.dialigForm.name;
                        _that.dialogVisible = true;
                        _that.isDisabled = false;
                        _that.getData();
                    }
                },
                function (error) {
                    console.log(error);
                }
            );
        },
        // 查看详情
        handleDetail(row) {
            this.dialogTitle = "详情";
            let _that = this;
            this.$http.callbackPost(
                "/bas/areaConfig/get",
                { id: row.entityId },
                null,
                function (result) {
                    if (result.code == 200) {
                        _that.dialigForm = result.data;
                        _that.dialigForm.url =
                            process.env.VUE_APP_API_HOST_URL +
                            process.env.VUE_APP_API_BASE_URL +
                            `/pub/common/file/download?service=basAreaConfigServiceImpl&id=${result.data.entityId}`;
                        _that.codeUrl = _that.dialigForm.url;
                        _that.codeTitle = _that.dialigForm.name;
                        _that.dialogVisible = true;
                        _that.isDisabled = true;
                        _that.getData();
                    }
                },
                function (error) {
                    console.log(error);
                }
            );
        },
        // 启用停用
        setStatus(row, type) {
            let _that = this;
            if (type == 1) {
                ElMessageBox.confirm("是否启用区域?", "提示", {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    this.$http.callbackPost(
                        "/bas/areaConfig/del",
                        { entityId: row.entityId, status: type },
                        null,
                        function (result) {
                            if (result.code == 200) {
                                _that.getData();
                            }
                        },
                        function (error) {
                            console.log(error);
                        }
                    );
                });
            } else {
                ElMessageBox.confirm("是否停用区域?", "提示", {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    this.$http.callbackPost(
                        "/bas/areaConfig/del",
                        { entityId: row.entityId, status: type },
                        null,
                        function (result) {
                            if (result.code == 200) {
                                _that.getData();
                            }
                        },
                        function (error) {
                            console.log(error);
                        }
                    );
                });
            }
        },
        viewQRCode(row) {
            this.codeUrl =
                process.env.VUE_APP_API_HOST_URL +
                process.env.VUE_APP_API_BASE_URL +
                `/pub/common/file/download?service=basAreaConfigServiceImpl&id=${row.entityId}`;
            this.codeTitle = row.name;
            this.dialogVisible2 = true;
        },
        closeDialog() {
            this.$refs.formRef.resetFields();
            this.dialogVisible = false;
        },
        //提交保存
        dialogConfirm() {
            let _that = this;
            this.$refs.formRef.validate(async (valid, fields) => {
                if (valid) {
                    if (this.dialogTitle == "新增") {
                        this.$http.callbackPost(
                            "/bas/areaConfig/add",
                            this.dialigForm,
                            null,
                            function (result) {
                                if (result.code == 200) {
                                    ElMessage({
                                        message: result.data.message,
                                        type: "success",
                                    });
                                    _that.dialogVisible = false;
                                    _that.getData();
                                } else {
                                    ElMessage({
                                        message: result.message,
                                        type: "error",
                                    });
                                }
                            },
                            function (error) {
                                console.log(error);
                            }
                        );
                    } else {
                        this.$http.callbackPost(
                            "/bas/areaConfig/edit",
                            this.dialigForm,
                            null,
                            function (result) {
                                if (result.code == 200) {
                                    ElMessage({
                                        message: result.data.message,
                                        type: "success",
                                    });
                                    _that.dialogVisible = false;
                                    _that.getData();
                                } else {
                                    ElMessage({
                                        message: result.message,
                                        type: "error",
                                    });
                                }
                            },
                            function (error) {
                                console.log(error);
                            }
                        );
                    }
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
.base-area-config {
    padding: 16px;

    /*去除页眉页脚*/
    @page {
        size: auto; /* auto is the initial value */
        margin: 3mm; /* this affects the margin in the printer settings */
    }

    html {
        background-color: #ffffff;
        margin: 0; /* this affects the margin on the html before sending to printer */
    }

    body {
        border: solid 1px blue;
        margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
    }
    /*去除页眉页脚*/

    .custom_form {
        margin-bottom: 20px;

        .form_item {
            width: 100%;

            .el-select,
            .el-input {
                min-width: 240px;
            }

            .separator {
                margin: 0 10px;
            }
        }

        .btn {
            display: flex;
            justify-content: start;

            .btn_form__item {
                margin-right: 0px;
            }
        }
    }

    .tips_box {
        display: flex;
        align-items: center;
        height: 40px;
        background-color: #0099ff32;
        border: 1px solid aqua;
        border-radius: 3px;
        margin-bottom: 10px;
        padding: 10px;

        .tips {
            font-size: var(--fontSize16);

            .tips_num {
                color: blue;
            }
        }

        .tips_num_close {
            margin-left: 10px;
            color: blue;
        }
    }

    .custom_table {
        margin-bottom: 20px;
    }

    .pagination_box {
        float: right;
    }

    .el-table {
        height: calc(100vh - 360px);
    }
}
</style>
