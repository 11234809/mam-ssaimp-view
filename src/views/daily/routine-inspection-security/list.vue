<!--
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2025-02-17 10:00:10
 * @LastEditors: fbz
 * @LastEditTime: 2025-05-06 10:42:41
-->
<template>
    <div class="securityStaff">
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
                          filterable
                          @change="
                              serviceAreaChange(formInline.serviceAreaId)
                          "
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
                  <el-form-item label="区域" class="form_item">
                      <el-select
                          v-model="formInline.areaId"
                          placeholder="请选择区域"
                          clearable
                          filterable
                      >
                          <el-option
                              v-for="(item, index) in areaList"
                              :key="index"
                              :label="item.name"
                              :value="item.code"
                          />
                      </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="状态" class="form_item">
                      <el-select
                          v-model="formInline.normalOrNot"
                          placeholder="请选择状态"
                          clearable
                      >
                          <el-option
                              v-for="(item, index) in normalOrNotList"
                              :key="index"
                              :label="item.name"
                              :value="item.code"
                          />
                      </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="上报人" class="form_item">
                      <el-input
                          v-model="formInline.reportPersonName"
                          placeholder="请输入上报人"
                          clearable
                      />
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="巡检时间" class="form_item">
                      <el-date-picker
                          v-model="formInline.reportTimeList"
                          type="datetimerange"
                          range-separator="~"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          :size="size"
                          format="YYYY-MM-DD HH:mm:ss"
                          valueFormat="YYYY-MM-DD HH:mm:ss"
                      />
                  </el-form-item>
              </el-col>
              <el-col :span="8" class="btn">
                  <el-form-item class="btn_form__item">
                      <!-- <el-button type="primary" @click="downloadTemplate"
                          >下载导出模版</el-button
                      > -->
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
        <el-button class="export-button" type="primary" @click="exportData">导出</el-button>
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
            />
            <el-table-column
                prop="areaName"
                label="区域"
                align="center"
                width="300"
            />
            <el-table-column
                prop="reportTimeStr"
                label="巡检时间"
                align="center"
                width="240"
            />
            <el-table-column
                prop="reportPersonName"
                label="上报人"
                align="center"
                width="240"
            />
            <el-table-column
                width="120"
                prop="normalOrNot"
                label="状态"
                align="center"
            >
                <template #default="scope">
                    <div v-for="(item, index) in normalOrNotList" :key="index">
                        <p
                            v-if="
                                item.code.toString() ==
                                scope.row.normalOrNot.toString()
                            "
                        >
                            {{ item.name }}
                        </p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                width="120"
                label="操作"
                align="center"
                fixed="right"
            >
                <template #default="scope">
                    <el-button
                        link
                        type="primary"
                        @click="handleDetail(scope.row)"
                        >详情
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
            title="详情"
            width="500"
        >
            <el-form
                :model="dialigForm"
                label-width="auto"
                style="max-width: 600px"
            >
                <el-form-item label="服务区">
                    <el-input v-model="dialigForm.serviceAreaName" disabled />
                </el-form-item>
                <el-form-item label="区域">
                    <el-input v-model="dialigForm.areaName" disabled />
                </el-form-item>
                <el-form-item label="巡检时间">
                    <el-input v-model="dialigForm.reportTimeStr" disabled />
                </el-form-item>
                <el-form-item label="状态">
                    <el-input v-model="dialigForm.normalOrNotStr" disabled />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="dialigForm.remark" disabled />
                </el-form-item>
                <el-form-item label="图片信息">
                    <el-upload
                        v-model:file-list="dialigForm.filesName"
                        :disabled="isDisabled"
                        class="upload-demo"
                        action="#"
                        list-type="picture"
                        accept=".jpeg,.png,.jpg,.bmp,.gif"
                        :http-request="customUpload"
                    >
                        <template #file="{ file }">
                            <div class="cst_upload_box">
                                <img
                                    class="cst_upload_img"
                                    :src="file.url"
                                    alt=""
                                    @click="handlePreview(file)"
                                />
                                <span class="cst_upload_name">{{
                                    file.name
                                }}</span>
                                <div class="cst_upload_icon">
                                    <!-- <el-icon @click="handleRemove(file)" v-if="!isDisabled">
                                        <Close />
                                    </el-icon> -->
                                    <el-icon @click="handleDownload(file)">
                                        <el-icon>
                                            <Download />
                                        </el-icon>
                                    </el-icon>
                                </div>
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
            <el-dialog v-model="imgDialog">
                <img
                    style="width: 100%; object-fit: cover"
                    :src="dialogImageUrl"
                    alt="Preview Image"
                />
            </el-dialog>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false"
                        >关闭</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
	import { bigScreen } from "@/store/bigScreen";
	const store=bigScreen();
export default {
    name: "securityStaff",
    data() {
        return {
            dialogVisible: false,
            // 筛选表单数据
            formInline: {
                serviceAreaId: "",
                areaList: "",
                normalOrNot: "",
                reportPersonName: "",
                reportTimeList: [],
            },
            syncTime: [],
            // 弹窗表单数据
            dialigForm: {
                serviceAreaName: "",
                areaName: "",
                reportTime: "",
                normalOrNotName: "",
                remark: "",
                filesName: [],
            },
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
                "/daily/routineInspection/manager/queryPage",
                {
                    index: this.page,
                    size: this.pageSize,
                    ...this.formInline,
                    reportedByWho: 1,
					largeScreen:store.chargeReportData.largeScreen?true:false
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
                        { alias: "inspectionStatusDictionary", param: null },
                    ],
                },
                null,
                function (result) {
                    if (result.code == 200) {
                        _this.normalOrNotList = result.data
                            .inspectionStatusDictionary
                            ? result.data.inspectionStatusDictionary
                            : [];
                    }
                    console.log(_this.normalOrNotList, "_this.normalOrNotList");
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
                "/bas/areaConfig/all",
                {},
                null,
                function (result) {
                    if (result.code == 200) {
                        _this.areaList = result.data.records;
                        _this.areaList.forEach((item) => {
                            item.code = item.entityId;
                            item.name = item.name;
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
        serviceAreaChange(id) {
            let _this = this;
            this.$http.callbackPost(
                "/bas/areaConfig/all",
                {
                    serviceAreaId: id,
                },
                null,
                function (result) {
                    if (result.code == 200) {
                        _this.areaList = result.data.records;
                        _this.areaList.forEach((item) => {
                            item.code = item.entityId;
                            item.name = item.name;
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
        // 时间选择器
        checkDate(val) {
            if (val.length > 0) {
                this.formInline.startTime = val[0];
                this.formInline.endTime = val[1];
            }
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
                areaList: "",
                normalOrNot: "",
                reportPersonName: "",
                reportTimeList: [],
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
        handlePreview(file) {
            this.imgDialog = true;
            this.dialogImageUrl = file.url;
        },
        // 删除图片
        handleRemove(file) {
            this.dialogForm.filesName = this.dialogForm.filesName.filter(
                (item) => item.uid !== file.uid
            );
            this.dialogForm.files = this.dialogForm.files
                .split(",")
                .filter((item) => item !== file.uid)
                .join(",");
        },
        // 下载图片
        handleDownload(file) {
            let url = file.url;
            window.open(url);
        },
        // 查看详情
        handleDetail(row) {
            let _that = this;
            this.$http.callbackPost(
                "/daily/routineInspection/manager/get",
                { id: row.entityId, reportedByWho: 1 },
                null,
                function (result) {
                    if (result.code == 200) {
                        _that.dialigForm = result.data;
                        _that.dialigForm["filesName"] = [];

                        if (result.data.fileList) {
                            let arr = result.data.fileList;
                            arr.map((item) => {
                                _that.dialigForm.filesName.push({
                                    uid: item.entityId,
                                    name: item.fileName,
                                    url:
                                        process.env.VUE_APP_API_HOST_URL +
                                        process.env.VUE_APP_API_BASE_URL +
                                        `/pub/common/file/download?service=routineInspectionFileServiceImpl&id=${item.entityId}`,
                                });
                            });
                        } else {
                            _that.dialigForm.filesName = [];
                        }

                        _that.dialogVisible = true;
                        _that.getData();
                    }
                },
                function (error) {
                    console.log(error);
                }
            );
        },
        exportData() {
            this.formInline["reportedByWho"] = 1;
            this.$http.callbackPost(
                "/daily/routineInspection/security/export",
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
                    downloadElement.download = `保安巡检记录${systemTime}.xlsx`; // 下载后文件名
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
        downloadTemplate() {
            this.formInline["reportedByWho"] = 1;
            this.$http.callbackPost(
                "/daily/routineInspection/security/downloadTemplate",
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
                    downloadElement.download = `保安巡检记录模版${systemTime}.xlsx`; // 下载后文件名
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
.securityStaff {
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
            justify-content: end;

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
