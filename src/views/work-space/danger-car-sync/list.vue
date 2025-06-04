<template>
    <div class="danger_car_sync">
        <!-- 筛选 -->
        <el-form inline :model="formInline" class="custom_form" label-width="120px" label-position="right"
            label-suffix=":">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="车牌号" class="form_item">
                        <el-input v-model="formInline.vehicleno" placeholder="请输入车牌号" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="车牌颜色" class="form_item">
                        <el-select v-model="formInline.platecolorcode" placeholder="请选择车牌颜色" clearable>
                            <el-option v-for="(item, index) in platecolorcodeList" :key="index" :label="item.name"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- TODO 暂时隐藏 -->
                <!-- <el-col :span="9">
                    <el-form-item label="同步时间" class="form_item">
                        <el-date-picker v-model="syncTime" type="daterange" range-separator="~"
                            value-format="YYYY-MM-DD" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
                            @change="checkDate" />
                    </el-form-item>
                </el-col> -->
                <el-col :span="6">
                    <el-form-item>
                        <el-button type="primary" @click="getData">查询</el-button>
                        <el-button type="primary" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 列表 -->
        <div class="tips_box">
            <span class="tips">已选择 <span class="tips_num">{{ checkNum }}</span> 项</span>
            <el-button link class="tips_num_close" @click="tableCheckClear">清空</el-button>
        </div>
        <el-table class="custom_table" ref="tableRef" border :data="tableData" @selection-change="selectionChange"
            style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="vehicleno" label="车牌号" align="center" />
            <el-table-column prop="platecolorcode" label="车牌颜色" align="center" />
            <el-table-column prop="creatorName" label="操作人" align="center" />
            <!-- TODO 暂时隐藏 -->
            <!-- <el-table-column prop="createTime" label="操作时间" align="center" /> -->
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination_box">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
                layout="total,  prev, pager, next,sizes, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
        <!-- 详情弹窗 -->
        <el-dialog class="custom_dialog" v-model="dialogVisible" title="特殊车辆信息" width="500">
            <el-form :model="dialigForm" label-width="auto" style="max-width: 600px">
                <el-form-item label="车牌号">
                    <el-input v-model="dialigForm.vehicleno" disabled />
                </el-form-item>
                <el-form-item label="车牌颜色" class="form_item">
                    <el-select v-model="dialigForm.platecolorcode" placeholder="请选择车牌颜色" clearable disabled>
                        <el-option v-for="(item, index) in platecolorcodeList" :key="index" :label="item.name"
                            :value="item.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="操作人">
                    <el-input v-model="dialigForm.creatorName" disabled />
                </el-form-item>
                <!-- TODO 暂时隐藏 -->
                <!-- <el-form-item label="操作时间">
                    <el-input v-model="dialigForm.createTime" disabled />
                </el-form-item> -->
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'dangerCarSync',
    data() {
        return {
            dialogVisible: false,
            // 筛选表单数据
            formInline: {
                vehicleno: '',
                platecolorcode: '',
                startTime: '',
                endTime: '',
            },
            syncTime: [],
            // 弹窗表单数据
            dialigForm: {
                vehicleno: '',
                platecolorcode: '',
                creatorName: '',
                createTime: '',
            },
            page: 1,
            pageSize: 10,
            total: 0,
            checkNum: 0, // 已选择项
            // 特殊车辆信息列表数据
            tableData: [],
            // 车牌颜色列表数据
            platecolorcodeList: [],
        }
    },
    created() {
        this.getData()
        this.getDictionary()
    },

    methods: {
        // 获取特殊车辆列表数据
        getData() {
            let _this = this
            this.$http.callbackPost(
                "/bas/dangerCarSync/queryPage",
                {
                    index: this.page,
                    size: this.pageSize,
                    ...this.formInline
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
                },
            );
        },
        // 获取车牌颜色字典数据
        getDictionary() {
            let _this = this
            this.$http.callbackPost(
                "/pub/common/queryNormalOptions",
                {
                    queriers: [{ alias: "plateColorDictionary", param: null }],
                },
                null,
                function (result) {
                    if (result.code == 200) {
                        _this.platecolorcodeList = result.data.plateColorDictionary;
                    }
                },
                function (error) {
                    console.log(error);
                },
            );
        },
        // 时间选择器
        checkDate(val) {
            if (val.length > 0) {
                this.formInline.startTime = val[0]
                this.formInline.endTime = val[1]
            }
        },
        // 重置筛选
        onReset() {
            Object.keys(this.formInline).map((key) => {
                this.formInline[key] = '';
            })
            this.page = 1
            this.pageSize = 10
            this.syncTime = []
            this.getData()
        },
        // 已选择项
        selectionChange(val) {
            this.checkNum = val.length
        },
        // 清空已选择项
        tableCheckClear() {
            this.$refs.tableRef.clearSelection()
        },
        // 分页大小
        handleSizeChange(val) {
            this.pageSize = val
            this.getData()
        },
        // 分页页数
        handleCurrentChange(val) {
            this.page = val
            this.getData()
        },
        // 查看详情
        handleDetail(row) {
            let _this = this
            this.$http.callbackPost(
                "/bas/dangerCarSync/get",
                { id: row.entityId },
                null,
                function (result) {
                    if (result.code == 200) {
                        _this.dialigForm = result.data;
                        _this.dialogVisible = true
                    }
                },
                function (error) {
                    console.log(error);
                },
            );
        },
    }
}
</script>

<style lang="less" scoped>
.danger_car_sync {
    .custom_form {
        margin-bottom: 20px;

        .form_item {
            width: 100%;

        }
    }

    .tips_box {
        display: flex;
        align-items: baseline;
        height: 40px;
        margin-bottom: 10px;
        padding: 10px;

        .tips {
            position: relative;
            font-size: var(--fontSize16);
            font-weight: bold;

            &::before {
                position: absolute;
                content: '';
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

    .custom_table {
        margin-bottom: 20px;
    }

    .pagination_box {
        float: right;
    }
}
</style>