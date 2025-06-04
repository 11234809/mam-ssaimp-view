<template>
  <div class="danger_car_sync">
    <!-- 筛选 -->
    <el-form inline :model="formInline" class="custom_form" label-width="120px" label-position="right" label-suffix=":">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="业务模块" class="form_item">
            <el-select v-model="formInline.busCode" placeholder="请选择业务模块" clearable>
              <el-option v-for="(item, index) in businessModuleList" :key="index" :label="item.name"
                :value="item.code" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标题" class="form_item">
            <el-input v-model="formInline.msgTitle" placeholder="请输入标题" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否已读" class="form_item">
            <el-select v-model="formInline.readStatus" placeholder="请选择是否已读" clearable>
              <el-option v-for="(item, index) in readStatusList" :key="index" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="接收时间" class="form_item">
            <el-date-picker v-model="formInline.receptionTimeList" type="datetimerange" range-separator="~"
              start-placeholder="开始时间" end-placeholder="结束时间" :size="size" format="YYYY-MM-DD HH:mm:ss"
              valueFormat="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="查看时间" class="form_item">
            <el-date-picker v-model="formInline.viewTimeList" type="datetimerange" range-separator="~"
              start-placeholder="开始时间" end-placeholder="结束时间" :size="size" format="YYYY-MM-DD HH:mm:ss"
              valueFormat="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="5">
                    <el-form-item label="车牌颜色" class="form_item">
                        <el-select
                            v-model="formInline.platecolorcode"
                            placeholder="请选择车牌颜色"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in platecolorcodeList"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col> -->
        <!-- TODO 暂时隐藏 -->
        <!-- <el-col :span="9">
                    <el-form-item label="同步时间" class="form_item">
                        <el-date-picker v-model="syncTime" type="daterange" range-separator="~"
                            value-format="YYYY-MM-DD" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
                            @change="checkDate" />
                    </el-form-item>
                </el-col> -->
        <el-col :span="8" class="btn">
          <el-form-item class="btn_form__item">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
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
    <el-row>
      <el-col>
        <el-form-item>
          <div>
            <el-button type="primary" @click="hanldReadAll">一键已读<el-icon class="el-icon--right">
                <Plus />
              </el-icon></el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-table class="custom_table" ref="tableRef" border :data="tableData" @selection-change="selectionChange"
      style="width: 100%" :row-style="{ height: '20px' }">
      <!-- <el-table-column type="selection" width="50" fixed="left"/> -->
      <el-table-column type="index" label="序号" width="55" align="center" fixed="left" />
      <el-table-column prop="busCode" label="业务模块" align="center" width="110">
        <template #default="scope">
          <div v-for="(item, index) in businessModuleList" :key="index">
            <p v-if="item.code.toString() == scope.row.busCode.toString()">
              {{ item.name }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="msgTitle" label="标题" align="center" width="120" />
      <el-table-column show-overflow-tooltip prop="msgContent" label="内容" align="center" width="520" />
      <el-table-column width="120" prop="readStatus" label="是否已读" align="center">
        <template #default="scope">
          <div v-for="(item, index) in readStatusList" :key="index">
            <p v-if="item.code.toString() == scope.row.readStatus.toString()">
              {{ item.name }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="receiverName" label="接收人姓名" align="center" width="160" />
      <el-table-column prop="receiveTimeStr" label="接收时间" align="center" width="180" />
      <el-table-column prop="readTimeStr" label="查看时间" align="center" width="180" />
      <!-- TODO 暂时隐藏 -->
      <!-- <el-table-column prop="createTime" label="操作时间" align="center" /> -->
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="handleDetail(scope.row)">详情 </el-button>
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
    <el-dialog class="custom_dialog" v-model="dialogVisible" msgTitle="消息详情" width="500">
      <el-form :model="dialigForm" label-width="auto" style="max-width: 600px">
        <el-form-item label="业务模块">
          <el-input v-model="dialigForm.businessModuleName" disabled />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="dialigForm.msgTitle" disabled />
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="dialigForm.msgContent" disabled />
        </el-form-item>
        <el-form-item label="接收人姓名">
          <el-input v-model="dialigForm.receiverName" disabled />
        </el-form-item>
        <!-- <el-form-item label="接收时间">
                    <el-input v-model="dialigForm.receiveTimeStr" disabled />
                </el-form-item>
                <el-form-item label="查看时间">
                    <el-input v-model="dialigForm.viewTimeStr" disabled />
                </el-form-item> -->

        <!-- TODO 暂时隐藏 -->
        <!-- <el-form-item label="车牌颜色" class="form_item">
                    <el-select
                        v-model="dialigForm.platecolorcode"
                        placeholder="请选择车牌颜色"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in platecolorcodeList"
                            :key="index"
                            :label="item.name"
                            :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="操作人">
                    <el-input v-model="dialigForm.creatorName" disabled />
                </el-form-item> -->
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
import { ElMessage } from "element-plus";
export default {
  name: "dangerCarSync",
  data() {
    return {
      dialogVisible: false,
      // 筛选表单数据
      formInline: {
        busCode: "",
        msgTitle: "",
        receptionTimeList: [],
        viewTimeList: [],
      },
      syncTime: [],
      // 弹窗表单数据
      dialigForm: {
        businessModuleName: "",
        msgTitle: "",
        msgContent: "",
        receiverName: "",
        // receiveTimeStr: "",
        // viewTimeStr: "",
      },
      page: 1,
      pageSize: 10,
      total: 0,
      checkNum: 0, // 已选择项
      // 特殊车辆信息列表数据
      tableData: [],
      readStatusList: [],
      businessModuleList: [],
      selectData: [],
    };
  },
  created() {
    this.getDictionary();
  },

  methods: {
    // 获取特殊车辆列表数据
    getData() {
      let _this = this;
      this.$http.callbackPost(
        "/bas/message/queryPage",
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
            { alias: "businessModuleTypeDictionary", param: null },
            { alias: "whetherReadDictionary", param: null },
          ],
        },
        null,
        function (result) {
          if (result.code == 200) {
            _this.readStatusList = result.data.whetherReadDictionary
              ? result.data.whetherReadDictionary
              : [];
            _this.businessModuleList = result.data.businessModuleTypeDictionary
              ? result.data.businessModuleTypeDictionary
              : [];
          }
          console.log(_this.readStatusList, "_this.readStatusList");
          _this.getData();
        },
        function (error) {
          console.log(error);
        }
      );
    },
    toreadStatus(data) {
      if (data) {
        this.readStatusList.forEach((item) => {
          if (item.code.toString() == data.toString()) {
            console.log("yes");
            return item.name;
          }
        });
        return "未知";
      }
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
        busCode: "",
        msgTitle: "",
        receptionTimeList: [],
        viewTimeList: [],
      };
      this.getData();
    },
    // 批量已读
    hanldReadAll() {
      let _that = this;
      console.log(this.selectData, "this.selectData");
      this.$http.callbackPost(
        "/bas/message/editRead",
        {},
        null,
        function (result) {
          if (result.code == 200) {
            ElMessage({
              message: result.data.message,
              type: "success",
              plain: true,
            });
            _that.getData();
            _that.$Bus.emit("getUnreadMessage", {});
          }
        },
        function (error) {
          console.log(error);
        }
      );
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
    // 查看详情
    handleDetail(row) {
      let _that = this;
      this.$http.callbackPost(
        "/bas/message/get",
        { id: row.entityId },
        null,
        function (result) {
          if (result.code == 200) {
            _that.dialigForm = result.data;
            _that.dialigForm["businessModuleName"] = "";
            _that.businessModuleList.forEach((item) => {
              if (item.code.toString() == row.busCode.toString()) {
                _that.dialigForm["businessModuleName"] = item.name;
              }
            });
            if (_that.dialigForm["businessModuleName"] == "") {
              _that.dialigForm["businessModuleName"] = "未知";
            }
            _that.dialogVisible = true;
            _that.$Bus.emit("getUnreadMessage", {});
            _that.getData();
          }
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
.danger_car_sync {
  padding: 16px;

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
      justify-content: end;

      .btn_form__item {
        margin-right: 0px
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
