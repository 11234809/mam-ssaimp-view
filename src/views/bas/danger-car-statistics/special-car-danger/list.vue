<!--
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2025-02-17 10:00:10
 * @LastEditors: yangfeng
 * @LastEditTime: 2025-03-05 14:53:22
-->
<template>
    <div class="specialCarDanger">
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
                    <el-form-item label="统计维度" class="form_item">
                        <el-select
                            v-model="formInline.selectTimeType"
                            placeholder="请选择统计维度"
                            clearable
                            @change="selectTimeTypeChange()"
                        >
                            <el-option
                                v-for="(item, index) in selectTimeTypeList"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="formInline.selectTimeType == '0'">
                    <el-form-item label="统计时间" class="form_item">
                        <el-date-picker
                            style="width: 100%"
                            v-model="formInline.time"
                            type="date"
                            placeholder="请选择日期"
                            :size="size"
                            format="YYYY-MM-DD"
                            valueFormat="YYYY-MM-DD"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="formInline.selectTimeType == '1'">
                    <el-form-item label="统计时间" class="form_item">
                        <el-date-picker
                            style="width: 100%"
                            v-model="formInline.time"
                            type="week"
                            placeholder="请选择周"
                            :size="size"
                            :format="weekFormat"
                            valueFormat="YYYY-MM-DD"
                            @change="weekChange(formInline.time)"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="formInline.selectTimeType == '2'">
                    <el-form-item label="统计时间" class="form_item">
                        <el-date-picker
                            style="width: 100%"
                            v-model="formInline.time"
                            type="month"
                            :size="size"
                            placeholder="请选择月"
                            format="YYYY-MM"
                            valueFormat="YYYY-MM"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="formInline.selectTimeType == '3'">
                    <el-form-item label="统计时间" class="form_item">
                        <DateQuarter
                            style="width: 100%"
                            ref="seasonSelect"
                            placeholder="请选择季度"
                            @chooseSeason="seasonChange"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="formInline.selectTimeType == '4'">
                    <el-form-item label="统计时间" class="form_item">
                        <el-date-picker
                            style="width: 100%"
                            v-model="formInline.time"
                            type="year"
                            :size="size"
                            placeholder="请选择年"
                            format="YYYY"
                            valueFormat="YYYY"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="formInline.selectTimeType == '5'">
                    <el-form-item label="统计时间" class="form_item">
                        <el-date-picker
                            style="width: 100%"
                            v-model="formInline.timeList"
                            type="daterange"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            :size="size"
                            format="YYYY-MM-DD"
                            valueFormat="YYYY-MM-DD"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="危化品名称" class="form_item">
                        <el-select
                            v-model="formInline.dangerItemList"
                            placeholder="请选择危化品名称"
                            clearable
                            filterable
                            multiple
                            collapse-tags
                            :max-collapse-tags="1"
                        >
                            <el-option
                                v-for="(item, index) in dangerItemList"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="服务区" class="form_item">
                        <el-select
                            v-model="formInline.serviceAreaIds"
                            placeholder="请选择服务区"
                            clearable
                            filterable
                            multiple
                            collapse-tags
                            :max-collapse-tags="1"
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
                <el-col :span="8" class="btn">
                    <el-form-item class="btn_form__item">
                        <el-button type="primary" @click="exportData"
                            >导出</el-button
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
        <div
            class="table"
            style="
                width: 100%;
                max-height: calc(100vh - 360px);
                overflow-y: auto;
            "
        >
            <el-table
                :data="tableData"
                style="width: 100%"
                :span-method="objectSpanMethod"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    width="55"
                    align="center"
                    fixed="left"
                />
                <el-table-column
                    prop="dangerItemName"
                    label="危化品名称"
                ></el-table-column>
                <el-table-column prop="count" label="危化品车辆总数">
                    <template #default="scope">
                        <el-link
                            type="primary"
                            @click="handlecountClick(scope.row.dangerItemId)"
                        >
                            {{ scope.row.total }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column label="占比(%)" prop="totalPercent">
                </el-table-column>
                <el-table-column prop="count" label="各服务区危化品车辆总数">
                    <el-table-column label="服务区" prop="serviceAreaName">
                    </el-table-column>
                    <el-table-column label="数目" prop="count">
                        <template #default="scope">
                            <el-link
                                type="primary"
                                @click="
                                    handleServiceClick(
                                        scope.row.serviceAreaId,
                                        scope.row.dangerItemId
                                    )
                                "
                            >
                                {{ scope.row.count }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="占比(%)" prop="percent">
                    </el-table-column>
                </el-table-column>
            </el-table>

            <!-- <div
                class="box"
                style="width: 100%; background-color: pink; height: 800px"
            ></div> -->
        </div>
        <!-- 分页 -->
        <!-- <div class="pagination_box">
            <el-pagination
                v-model:current-page="page"
                v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20, 30, 50]"
                layout="total,  prev, pager, next,sizes, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div> -->
    </div>
</template>

<script>
import moment from "moment";
import { DateQuarter } from "mam-base-ui";
export default {
    name: "specialCarDanger",
    components: {
        DateQuarter,
    },
    data() {
        return {
            dialogVisible: false,
            // 筛选表单数据
            formInline: {
                companyIds: [],
                serviceAreaIds: [],
                direction: "",
                selectTimeType: "0",
                time: "",
                timeList: [],
            },
            syncTime: [],
            // 弹窗表单数据
            dialigForm: {},
            page: 1,
            pageSize: 10,
            total: 0,
            checkNum: 0, // 已选择项
            // 特殊车辆信息列表数据
            tableData: [],
            serviceAreaList: [],
            areaList: [],
            normalOrNotList: [],
            selectData: [],
            isDisabled: true,
            imgDialog: false,
            dialogImageUrl: "",
            files: [],
            selectTimeTypeList: [
                {
                    name: "按日度查询",
                    code: "0",
                },
                {
                    name: "按周度查询",
                    code: "1",
                },
                {
                    name: "按月度查询",
                    code: "2",
                },
                {
                    name: "按季度查询",
                    code: "3",
                },
                {
                    name: "按年度查询",
                    code: "4",
                },
                {
                    name: "按时间段查询",
                    code: "5",
                },
            ],
            weekFormat: "YYYY [年 第] ww [周]",
            companyList: [],
            dangerItemList: [],
            jumpIndex: 0,
        };
    },
    created() {
        this.getDictionary();
        this.getSelect();
        this.formInline.time = moment().format("YYYY-MM-DD");
        this.getData();
    },

    methods: {
        // 获取特殊车辆列表数据
        getData() {
            let _this = this;

            if (this.formInline.timeList.length != 0) {
                this.formInline["startTimeIn"] = this.formInline.timeList[0];
                this.formInline["endTimeIn"] = this.formInline.timeList[1];
            } else if (this.formInline.time) {
                this.formInline["startTimeIn"] = this.formInline.time;
                this.formInline["endTimeIn"] = this.formInline.time;
            } else {
                this.formInline["startTimeIn"] = "";
                this.formInline["endTimeIn"] = "";
            }

            this.$http.callbackPost(
                "/bas/dangerItemReport/queryPage",
                {
                    index: this.page,
                    size: -1,
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
                        _this.directionList = result.data
                            .whetherEnableDictionary
                            ? result.data.whetherEnableDictionary
                            : [];
                    }
                    console.log(_this.directionList, "_this.directionList");
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

            this.$http.callbackPost(
                "/bas/dangerItem/queryPage",
                { index: 1, size: -1 },
                null,
                function (result) {
                    if (result.code == 200) {
                        _this.dangerItemList = result.data.records;
                        _this.dangerItemList.forEach((item) => {
                            item.code = item.entityId;
                            item.name = item.dangerItemName;
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
        selectAreaChange() {
            this.formInline.serviceAreaIds = "";
            this.formInline.routeId = "";
            this.formInline.selectTimeType = "0";
            this.formInline.time = "";
            this.formInline.timeList = [];
            this.getData();
        },
        selectTimeTypeChange() {
            this.formInline.time = "";
            this.formInline.timeList = [];
            if (this.formInline.selectTimeType == "0") {
                this.formInline.time = moment().format("YYYY-MM-DD");
            } else if (this.formInline.selectTimeType == "1") {
                this.formInline.time = moment().format("YYYY-MM-DD");
                this.weekChange(this.formInline.time);
            } else if (this.formInline.selectTimeType == "2") {
                this.formInline.time = moment().format("YYYY-MM");
            } else if (this.formInline.selectTimeType == "3") {
                this.$nextTick(() => {
                    let nowYear = moment().year();
                    let nowQuarter = moment().quarter();
                    this.$refs.seasonSelect.getDefaultTimeNow();
                    this.seasonChange(nowYear, nowQuarter, "");
                });
            } else if (this.formInline.selectTimeType == "4") {
                this.formInline.time = moment().format("YYYY");
            } else if (this.formInline.selectTimeType == "5") {
                this.formInline.timeList = [
                    moment().format("YYYY-MM-DD"),
                    moment().format("YYYY-MM-DD"),
                ];
            }
        },
        // 重置筛选
        onReset() {
            this.page = 1;
            this.pageSize = 10;
            this.formInline = {
                selectArea: "0",
                serviceAreaIds: [],
                routeId: "",
                selectTimeType: "0",
                time: "",
                timeList: [],
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
        // 选择季度赋值
        seasonChange(year, season, dataValue) {
            let value = [];
            if (season == 1) {
                value = [`${year}-01`, `${year}-03`];
            } else if (season == 2) {
                value = [`${year}-04`, `${year}-06`];
            } else if (season == 3) {
                value = [`${year}-07`, `${year}-09`];
            } else if (season == 4) {
                value = [`${year}-10`, `${year}-12`];
            }
            this.formInline["timeList"] = value;
        },
        // 选择周
        weekChange(data) {
            let week = this.getWeekInMonth(data);
            let weekRange = this.getWeekStartAndEnd(data);
            this.weekFormat =
                new Date(data).getFullYear() +
                " 年 " +
                String(Number(new Date(data).getMonth()) + 1) +
                " 月 第 " +
                week +
                " 周 ";
            this.formInline.timeList = weekRange;
        },
        // 获取指定日期的那一周的开始、结束日期
        getWeekStartAndEnd(val) {
            let weekStart = val;
            let weekEnd = moment(val).add(6, "days").format("YYYY-MM-DD");
            return [weekStart, weekEnd];
        },
        // 根据日期判断是月的第几周
        getWeekInMonth(t) {
            if (t == undefined || t == "" || t == null) {
                t = new Date();
            } else {
                var _t = new Date();
                t = new Date(t);
                _t.setYear(t.getFullYear());
                _t.setMonth(t.getMonth());
                _t.setDate(t.getDate());

                var date = _t.getDate(); //给定的日期是几号

                _t.setDate(1);
                var d = _t.getDay(); //1. 得到当前的1号是星期几。
                var fisrtWeekend = d;
                if (d == 0) {
                    fisrtWeekend = 1;
                    //1号就是星期天
                } else {
                    fisrtWeekend = 7 - d + 1; //第一周的周未是几号
                }
                if (date <= fisrtWeekend) {
                    return 1;
                } else {
                    return 1 + Math.ceil((date - fisrtWeekend) / 7);
                }
            }
        },
        handleServiceClick(dangerServiceAreaId, dangerItemId) {
            console.log(dangerServiceAreaId, "dangerServiceAreaId");
            console.log(dangerItemId, "dangerItemId");
            this.$Bus.emit("jumpAgency", {
                url: "/bas/dangerCar",
                data: {
                    dangerServiceAreaId: dangerServiceAreaId,
                    dangerItemId: dangerItemId,
                    jumpIndex: this.jumpIndex++,
                },
            });
        },
        handlecountClick(dangerItemId) {
            this.$Bus.emit("jumpAgency", {
                url: "/bas/dangerCar",
                data: {
                    dangerItemId: dangerItemId,
                    jumpIndex: this.jumpIndex++,
                },
            });
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            // 只处理前三列（dangerItemId, dangerItemName, count）
            if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
                // 获取当前行的危化品 ID
                const currentDangerItemId = row.dangerItemId;

                // 查找所有具有相同危化品 ID 的行
                const sameIdRows = this.tableData.filter(
                    (item) => item.dangerItemId === currentDangerItemId
                );

                // 如果是当前危化品 ID 的第一行，则返回合并的行数和列数
                if (
                    rowIndex ===
                    this.tableData.findIndex(
                        (item) => item.dangerItemId === currentDangerItemId
                    )
                ) {
                    return {
                        rowspan: sameIdRows.length, // 合并的行数
                        colspan: 1, // 合并的列数
                    };
                } else {
                    // 如果不是第一行，则隐藏该单元格
                    return {
                        rowspan: 0,
                        colspan: 0,
                    };
                }
            }
        },
        exportData() {
            this.$http.callbackPost(
                "/bas/dangerItemReport/exportXlsByMonth",
                this.formInline,
                { responseType: "blob" },
                function (result) {
                    let nowDate = new Date();
                    let date = {
                        year: nowDate.getFullYear(),
                        month: nowDate.getMonth() + 1,
                        date: nowDate.getDate(),
                    };
                    const systemTime =
                        date.year + "-" + date.month + "-" + date.date;
                    var blob = new Blob([result]);
                    var downloadElement = document.createElement("a");
                    var href = window.URL.createObjectURL(blob); // 创建下载的链接
                    downloadElement.href = href;
                    downloadElement.download = `特殊车辆危化品数统计${systemTime}.xlsx`; // 下载后文件名
                    document.body.appendChild(downloadElement);
                    downloadElement.click(); // 点击下载
                    document.body.removeChild(downloadElement); // 下载完成移除元素
                    window.URL.revokeObjectURL(href);
                },
                function (error) {
                    console.log(error);
                }
            );
        },
    },
};
</script>

<style lang="less" scoped>
.specialCarDanger {
    padding: 16px;

    .upload-demo {
        width: 100%;

        .cst_upload_box {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            height: 80px;

            .cst_upload_img {
                width: 120px;
                height: 100%;
                object-fit: fill;
            }

            .cst_upload_name {
                margin-left: 20px;
            }

            .cst_upload_icon {
                position: absolute;
                top: 0;
                right: 0;

                .el-icon:nth-child(1) {
                    margin-right: 12px;
                }

                .el-icon {
                    cursor: pointer;
                }
            }
        }
    }

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
