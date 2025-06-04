<!-- 专项工作执行 -->
<template>
  <div class="danger_car_page">
    <!-- 筛选项 -->
    <el-form
      inline
      :model="formData"
      class="custom_form"
      label-width="130px"
      label-position="right"
      label-suffix=":"
    >
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="公司名称" class="form_item">
            <el-select
              v-model="formData.companyIdList"
              filterable
              :reserve-keyword="false"
              multiple
              placeholder="请选择公司名称"
              clearable
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option
                v-for="(item, index) in listOptions.companyList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="服务区名称" class="form_item">
            <el-select
              v-model="formData.serviceAreaIdList"
              filterable
              :reserve-keyword="false"
              multiple
              placeholder="请选择服务区名称"
              clearable
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option
                v-for="(item, index) in listOptions.serviceAreaList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专项工作名称" class="form_item">
            <el-input
              v-model="formData.name"
              placeholder="请输入专项工作名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专项类型" class="form_item">
            <el-select
              v-model="formData.type"
              placeholder="请选择专项类型"
              clearable
            >
              <el-option
                v-for="(item, index) in listOptions.typeList"
                :key="index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="要求完成时间" class="form_item">
            <el-date-picker
              v-model="formData.requireTime"
              type="daterange"
              range-separator="~"
              value-format="YYYY-MM-DD"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="下发时间" class="form_item">
            <el-date-picker
              v-model="formData.publishTime"
              type="daterange"
              range-separator="~"
              value-format="YYYY-MM-DD"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="下发人" class="form_item">
            <el-input
              v-model="formData.publishBy"
              placeholder="请输入下发人"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专项内容" class="form_item">
            <el-input
              v-model="formData.content"
              placeholder="请输入专项内容"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="下发单位" class="form_item">
            <el-input
              v-model="formData.publishCompany"
              placeholder="请输入下发单位"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item class="form_item query-form-btn">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 功能按钮组 -->
    <div class="func_btn_box">
      <el-button type="primary" @click="handleExport">导出</el-button>
    </div>

    <!-- 列表 -->
    <div class="tips_box">
      <span class="tips"
        >已选择 <span class="tips_num">{{ checkList.length }}</span> 项</span
      >
      <el-button link class="tips_num_close" @click="tableCheckClear"
        >清空</el-button
      >
    </div>
    <el-table
      class="custom_table"
      ref="tableRef"
      border
      table-layout="auto"
      :data="tableData"
      @selection-change="selectionChange"
      style="width: 100%"
      show-overflow-tooltip
    >
      <el-table-column type="selection" width="40" />
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column
        prop="companyName"
        width="200"
        label="公司名称"
        align="center"
      />
      <el-table-column
        prop="serviceAreaName"
        width="180"
        label="服务区名称"
        align="center"
      />
      <el-table-column
        prop="name"
        label="专项工作名称"
        width="120"
        align="center"
      />
      <el-table-column prop="type" label="专项类型" width="120" align="center">
        <template #default="{ row }">
          {{
            listOptions.typeList.filter((item) => item.code === row.type)[0]
              ?.name
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="专项内容"
        width="180"
        align="center"
      />
      <el-table-column
        prop="requireTime"
        label="要求完成时间"
        width="120"
        align="center"
      />
      <el-table-column
        prop="money"
        label="预算金额(元)"
        width="120"
        align="center"
      />
      <el-table-column
        prop="chargingParkNum"
        label="充电停车位年度目标任务（个）"
        width="240"
        align="center"
      />
      <el-table-column
        prop="chargingPileNum"
        label="充电桩年度目标任务（个）"
        width="200"
        align="center"
      />
      <el-table-column
        prop="superChargingPileNum"
        label="超充桩年度目标任务（个）"
        width="200"
        align="center"
      />
      <el-table-column
        prop="superChargingGunNum"
        label="超充枪年度目标任务（个）"
        width="200"
        align="center"
      />
      <el-table-column
        prop="publishBy"
        label="下发人"
        width="120"
        align="center"
      />
      <el-table-column
        prop="publishTime"
        label="下发时间"
        width="120"
        align="center"
      />
      <el-table-column
        prop="publishCompany"
        label="下发单位"
        width="120"
        align="center"
      />
      <el-table-column label="操作" fixed="right" align="center" width="180">
        <template #default="scope">
          <div class="action_sheet">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleDetail('perform', scope.row)"
              >执行专项</el-button
            >
            <el-button
              type="primary"
              size="small"
              link
              @click="handleDetail('detail', scope.row)"
              >查看执行情况</el-button
            >
          </div>
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

    <!-- 执行/详情弹窗 -->
    <RecordDetail
      v-if="detailVisible"
      ref="detailRef"
      :visible="detailVisible"
      :data="detailData"
      :type="dialogType"
      :options="listOptions"
      @dialogClose="handleClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import RecordDetail from "./record-detail.vue";
import {
  queryNormalOptions,
  getCompany,
  getServiceArea,
} from "@/api/dictionaryApi.js";
import { getBasJobRecordList } from "@/api/daily/basRecord";
import { exportData } from "@/utils/common-features";
import { keyList } from "./index";

import moment from 'moment'

const formData = reactive({
    publishTime:[moment().format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
});
const tableData = ref([{}]);
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数
const detailVisible = ref(false); // 详情弹窗显示/隐藏
const detailData = ref({}); // 详情弹窗数据
const dialogType = ref("detail");
const checkList = ref([]); // 列表选择
const tableRef = ref();
// 下拉选项
const listOptions = reactive({
  companyList: [], // 公司
  serviceAreaList: [], // 服务区
  typeList: [],
});

// 获取字典数据
const getDictionary = () => {
  // 获取服务区
  getServiceArea()
    .then(({ code, data }) => {
      if (code == 200) {
        listOptions.serviceAreaList = data.records;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // 获取公司下拉
  getCompany().then(({ code, data }) => {
    listOptions.companyList = data.records;
  });
  // 获取专项类型
  queryNormalOptions({
    queriers: [{ alias: "specialTypeDictionary", param: null }],
  }).then(({ code, data }) => {
    listOptions.typeList = data.specialTypeDictionary;
  });
};
// 查询
const getData = async () => {
  const params = {
    index: page.value,
    size: pageSize.value,
    ...formData,
    requireTimeStart: formData.requireTime?.[0],
    requireTimeEnd: formData.requireTime?.[1],
    publishTimeStart: formData.publishTime?.[0],
    publishTimeEnd: formData.publishTime?.[1],
    // requireTimeEnd: formData.requireTime.length ? formData.requireTime[1] : undefined,
  };
  const res = await getBasJobRecordList(params);
  if (res.code == 200) {
    tableData.value = res.data.records.map((item) => {
      const newItem = { ...item };
      // 字符串转为数值类型
      Object.keys(newItem).map((v) => {
        if (keyList.includes(v)) {
          newItem[v] = Number(newItem[v]);
        }
      });
      // 获取附件预览图地址
      const filesName = item.files?.split(",").map((item) => ({
        uid: item,
        url:
          process.env.VUE_APP_API_HOST_URL +
          process.env.VUE_APP_API_BASE_URL +
          `/pub/common/file/download?service=basJobFileServiceImpl&id=${item}`,
      }));
      // const filesName = item.files
      //   ?.split(",")
      //   .map(
      //     (item2) =>
      //       process.env.VUE_APP_API_HOST_URL +
      //       process.env.VUE_APP_API_BASE_URL +
      //       `/pub/common/file/download?service=basGoodsFileServiceImpl&id=${item2}`
      //   );
      return { ...newItem, filesName };
    });
    total.value = Number(res.data.total);
  }
};
// 重置查询
function onReset() {
  // 重置表单参数赋值
  Object.keys(formData).map((key) => {
    formData[key] = undefined;
  });
  getData();
}
// 列表选择清空
const tableCheckClear = () => {
  tableRef.value.clearSelection();
  selectionChange([]);
};
// 列表选择
const selectionChange = (val) => {
  checkList.value = val;
};
// 导出
const handleExport = () => {
  const params = {
    // index: page.value,
    // size: pageSize.value,
    ...formData,
    requireTimeStart: formData.requireTime?.[0],
    requireTimeEnd: formData.requireTime?.[1],
    publishTimeStart: formData.publishTime?.[0],
    publishTimeEnd: formData.publishTime?.[1],
    ids: checkList.value.map((item) => item.entityId),
  };
  exportData("/daily/basJobRecord/export", "专项工作执行", params);
};
// 详情
function handleDetail(type, data) {
  dialogType.value = type;
  detailVisible.value = true;
  detailData.value = data;
}
// 每页条数
function handleSizeChange(val) {
  pageSize.value = val;
  getData();
}
// 分页
function handleCurrentChange(val) {
  page.value = val;
  getData();
}
function handleClose() {
  detailVisible.value = false;
  getData();
}

onMounted(() => {
  getDictionary();
  getData();
});
</script>

<style scoped lang="less">
.danger_car_page {
  .custom_form {
    margin-bottom: 20px;

    :deep(.form_item) {
      width: 100%;

      .el-cascader {
        width: 100%;
      }

      .separator {
        margin: 0 10px;
      }
    }
  }

  .func_btn_box {
    margin-bottom: 10px;
  }

  .tips_box {
    display: flex;
    align-items: baseline;
    height: 40px;
    margin: 10px 0;
    padding: 10px;

    .tips {
      position: relative;
      font-size: var(--fontSize16);
      font-weight: bold;

      &::before {
        position: absolute;
        content: "";
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

  :deep(.custom_table) {
    margin-bottom: 20px;

    .pic_box {
      display: flex;

      .el-image {
        width: 50px;
        height: 50px;
        object-fit: cover;

        &:not(:last-child) {
          margin-right: 10px;
        }
      }
    }

    .no_file {
      font-style: italic;
      color: #5d5d5d;
    }

    .action_sheet {
      display: flex;
      align-items: center;
      justify-content: center;

      .el-dropdown {
        margin-left: 12px;
      }
    }
  }

  .pagination_box {
    float: right;
  }
}
</style>
