<!--
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2025-02-17 10:00:10
 * @LastEditors: fbz
 * @LastEditTime: 2025-05-06 10:49:02
-->
<template>
    <div class="specialCarStatistics">
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
                    <el-form-item label="公司" class="form_item">
                        <el-select
                            v-model="formInline.orgIds"
                            placeholder="请选择公司"
                            clearable
                            filterable
                            multiple
                            collapse-tags
                            :max-collapse-tags="1"
                            @change="companyChange(formInline.orgIds)"
                        >
                            <el-option
                                v-for="(item, index) in companyList"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            >
                            </el-option>
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
                <el-col :span="8">
                    <el-form-item label="服务区方向" class="form_item">
                        <el-select
                            v-model="formInline.serviceAreaDirection"
                            placeholder="请选择服务区方向"
                            clearable
                        >
                            <el-option
                                v-for="(
                                    item, index
                                ) in serviceAreaDirectionList"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
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
                <el-col :span="8" class="btn">
                    <el-form-item class="btn_form__item">
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
        <el-button class="export-button" type="primary" @click="exportData">导出</el-button
        >
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
                class="custom_table"
                ref="tableRef"
                border
                :data="tableData"
                @selection-change="selectionChange"
                style="width: 100%"
                :row-style="{ height: '20px' }"
                @sort-change="sortChange"
            >
                <!-- <el-table-column
                    type="index"
                    label="序号"
                    width="55"
                    align="center"
                    fixed="left"
                /> -->
                <el-table-column
                    prop="serialNumber"
                    label="序号"
                    width="55"
                    align="center"
                    fixed="left"
                />
                <el-table-column prop="orgName" label="公司" align="center" />
                <el-table-column
                    prop="serviceAreaName"
                    label="服务区"
                    align="center"
                />
                <el-table-column
                    sortable="custom"
                    prop="dangerCarCount"
                    label="特殊车辆数"
                    align="center"
                >
                    <template #default="scope">
                        <a
                            style="color: #108ee9; cursor: pointer"
                            @click="jumpTo(scope.row)"
                        >
                            {{ scope.row.dangerCarCount }}
                        </a>
                    </template>
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
    name: "securityStaff",
    components: {
        DateQuarter,
    },
    data() {
        return {
            dialogVisible: false,
            // 筛选表单数据
            formInline: {
                orgIds: [],
                serviceAreaIds: [],
                serviceAreaDirection: "整体",
                selectTimeType: "0",
                time: "",
                timeList: [],
                sort: "desc",
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
            serviceAreaDirectionList: [
                {
                    name: "进城",
                    code: "进城",
                },
                {
                    name: "出城",
                    code: "出城",
                },
                {
                    name: "进出城",
                    code: "进出城",
                },
                {
                    name: "整体",
                    code: "整体",
                },
            ],
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
        };
    },
    created() {
        // this.getDictionary();
        this.getSelect();
        this.formInline.time = moment().format("YYYY-MM-DD");
        this.getData();
    },
    activated() {
        if(this.$route.query && this.$route.query.time){
            this.formInline.time = this.$route.query.time;
        }
    },

    methods: {
        sortChange(row, column) {
            console.log(row, column);
            if (row.order == "descending") {
                this.formInline.sort = "desc";
            } else {
                this.formInline.sort = "asc";
            }
            this.getData();
        },
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
                "/bas/dangerCarCount/all",
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
                        { alias: "serviceDirectionDictionary", param: null },
                    ],
                },
                null,
                function (result) {
                    if (result.code == 200) {
                        _this.serviceAreaDirectionList = result.data
                            .serviceDirectionDictionary
                            ? result.data.serviceDirectionDictionary
                            : [];
                    }
                    console.log(
                        _this.serviceAreaDirectionList,
                        "_this.serviceAreaDirectionList"
                    );
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
                "/pub/ssaimp/common/getCompany",
                {},
                null,
                function (result) {
                    if (result.code == 200) {
                        _this.companyList = result.data.records;
                        _this.companyList.forEach((item) => {
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
        companyChange(id) {
            let _this = this;
            let orgIds = id.join(",");
            this.$http.callbackPost(
                "/pub/ssaimp/common/getServiceArea",
                { orgIds: orgIds },
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
                orgIds: [],
                serviceAreaIds: [],
                serviceAreaDirection: "整体",
                selectTimeType: "0",
                time: "",
                timeList: [],
                sort: "desc",
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
        jumpTo(row) {
            let jumpEndTimeIn = "";
            let jumpStartTimeIn = "";
            if (this.formInline.startTimeIn.length > 0) {
                if (this.formInline.selectTimeType == "0") {  // 日
                    jumpStartTimeIn = this.formInline.startTimeIn + " 00:00:00";
                    jumpEndTimeIn = this.formInline.endTimeIn + " 23:59:59";
                } else if (this.formInline.selectTimeType == "1") {  // 周
                    jumpStartTimeIn = this.formInline.startTimeIn + " 00:00:00";
                    jumpEndTimeIn = this.formInline.endTimeIn + " 23:59:59";
                } else if (this.formInline.selectTimeType == "2") {  // 月
                    jumpStartTimeIn = moment(this.formInline.startTimeIn).startOf('month').format('YYYY-MM-DD') + " 00:00:00";
                    jumpEndTimeIn = moment(this.formInline.endTimeIn).endOf('month').format('YYYY-MM-DD') + " 23:59:59";
                } else if (this.formInline.selectTimeType == "3") {  // 季
                    jumpStartTimeIn = moment(this.formInline.startTimeIn).startOf('month').format('YYYY-MM-DD') + " 00:00:00";
                    jumpEndTimeIn = moment(this.formInline.endTimeIn).endOf('month').format('YYYY-MM-DD') + " 23:59:59";
                } else if (this.formInline.selectTimeType == "4") {  // 年
                    jumpStartTimeIn = moment(this.formInline.startTimeIn).startOf('year').format('YYYY-MM-DD') + " 00:00:00";
                    jumpEndTimeIn = moment(this.formInline.endTimeIn).endOf('year').format('YYYY-MM-DD') + " 23:59:59";
                } else if (this.formInline.selectTimeType == "5") {  // 时间段
                    jumpStartTimeIn = this.formInline.startTimeIn + " 00:00:00";
                    jumpEndTimeIn = this.formInline.endTimeIn + " 23:59:59";
                }
            } else {
                jumpStartTimeIn = "";
                jumpEndTimeIn = "";
            }
            let serviceAreaIds = row.serviceAreaNameIds ? row.serviceAreaNameIds.toString() : null;
            // carType - 默认是危化品车辆
            this.$Bus.emit("jumpAgency", {
                url: "/bas/dangerCar",
                data: { jumpFrom: "dangerCarCount", orgId: row.orgId, serviceAreaIds: serviceAreaIds, jumpStartTimeIn: jumpStartTimeIn, jumpEndTimeIn: jumpEndTimeIn, carType: "1" },
            });
        },
        exportData() {
            this.$http.callbackPost(
                "/bas/dangerCarCount/export",
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
                    downloadElement.download = `特殊车辆管理统计${systemTime}.xlsx`; // 下载后文件名
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
.specialCarStatistics {
    padding: 16px;
    .export-button{
        margin-bottom: 15px;
    }
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
