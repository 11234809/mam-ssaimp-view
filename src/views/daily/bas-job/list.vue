<!-- 专项工作下发 -->
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
          <el-form-item label="专项内容" class="form_item">
            <el-input
              v-model="formData.content"
              placeholder="请输入专项内容"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专项状态" class="form_item">
            <el-select
              v-model="formData.status"
              placeholder="请选择专项状态"
              clearable
            >
              <el-option
                v-for="(item, index) in listOptions.statusList"
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
              value-format="YYYY-MM-DD"
              range-separator="~"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="下发时间" class="form_item">
            <el-date-picker
              v-model="formData.publishTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="~"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
            ></el-date-picker>
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
          <el-form-item label="下发单位" class="form_item">
            <el-input
              v-model="formData.publishCompany"
              placeholder="请输入下发单位"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="form_item query-form-btn">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 功能按钮组 -->
    <div class="func_btn_box">
      <el-button type="primary" @click="handleOpen('add')" v-if="isAuth('add')"
        >新增</el-button
      >
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
      style="width: 100%"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column
        prop="name"
        label="专项工作名称"
        min-width="180"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="type"
        label="专项类型"
        show-overflow-tooltip
        width="140"
        align="center"
      >
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
        min-width="200"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="requireTime"
        label="要求完成时间"
        width="140"
        align="center"
      />
      <el-table-column
        prop="money"
        label="预算金额(元)"
        width="120"
        align="center"
      />
      <el-table-column
        prop="status"
        label="专项状态"
        width="120"
        align="center"
      >
        <template #default="{ row }">
          {{ row.status === 0 ? "未下发" : row.status === 1 ? "已下发" : "" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="publishBy"
        label="下发人"
        width="120"
        align="center"
      />
      <el-table-column
        prop="publishTime"
        label="下发时间"
        width="180"
        align="center"
      />
      <el-table-column
        prop="publishCompany"
        label="下发单位"
        min-width="180"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column label="操作" fixed="right" align="center" width="220">
        <template #default="{ row }">
          <div class="action_sheet">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleOpen('detail', row)"
              >查看专项明细</el-button
            >
            <el-button
              type="primary"
              size="small"
              link
              @click="handleOpen('edit', row)"
              v-if="row.status === 0 && isAuth('edit')"
              >编辑</el-button
            >
            <el-button
              type="primary"
              size="small"
              link
              @click="handleDelete(row.entityId)"
              v-if="row.status === 0 && isAuth('delete')"
              >删除</el-button
            >
            <el-button
              type="primary"
              size="small"
              link
              @click="handleSend(row)"
              v-if="row.status === 0 && isAuth('edit')"
              >下发</el-button
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

    <!-- 详情弹窗 -->
    <Detail
      v-if="detailVisible"
      ref="detailRef"
      :visible="detailVisible"
      :data="detailData"
      @dialogClose="handleClose"
      :options="listOptions"
      :type="dialogType"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Detail from "./detail.vue";
import { queryNormalOptions } from "@/api/dictionaryApi.js";
import { getBasJobList, deleteBasJob, issuedBasJob } from "@/api/daily/basJob";
import { exportData } from "@/utils/common-features";
import { isAuth } from "@/utils/authorization";

import moment from 'moment'

const formData = reactive({
    publishTime:[moment().format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
});
const listOptions = reactive({
  statusList: [], // 专项状态列表
  typeList: [], // 专项类型
});
// const checkNum = ref(0); // 列表选择总条数
const checkList = ref([]); // 列表选择数据
const tableData = ref([{}]);
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数
const dialogType = ref("add"); // 弹窗类型
const tableRef = ref();
const detailVisible = ref(false); // 详情弹窗显示/隐藏
const detailData = ref({}); // 详情弹窗数据

// 获取字典数据
function getDictionary() {
  // 获取专项状态
  queryNormalOptions({
    queriers: [{ alias: "specialStatusDictionary", param: null }],
  }).then(({ code, data }) => {
    listOptions.statusList = data.specialStatusDictionary;
  });
  // 获取专项类型
  queryNormalOptions({
    queriers: [{ alias: "specialTypeDictionary", param: null }],
  }).then(({ code, data }) => {
    listOptions.typeList = data.specialTypeDictionary;
  });
}

// 列表选择清空
const tableCheckClear = () => {
  tableRef.value.clearSelection();
  selectionChange([]);
};
// 列表选择
const selectionChange = (val) => {
  // console.log('check', val) ;
  // checkNum.value = val.length;
  checkList.value = val;
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
  };
  const res = await getBasJobList(params);
  if (res.code == 200) {
    tableData.value = res.data.records;
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
// 打开新增/编辑/详情弹窗
const handleOpen = (type, data = {}) => {
  dialogType.value = type;
  detailVisible.value = true;
  detailData.value = data;
};
// 删除
const handleDelete = (id) => {
  ElMessageBox.confirm("是否确认删除?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    let res = await deleteBasJob({ entityId: id });
    if (res.code == 200) {
      ElMessage({
        message: res.data.message,
        type: "success",
      });
      await getData();
    }
  });
};
// 下发
const handleSend = (data) => {
  ElMessageBox.confirm("是否确认下发?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const formData = new FormData();
    formData.append("request", JSON.stringify(data));
    let res = await issuedBasJob(formData);
    if (res.code == 200) {
      ElMessage({
        message: res.data.message,
        type: "success",
      });
      await getData();
    }
  });
};
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

// 详情弹窗关闭
function handleClose() {
  detailVisible.value = false;
  getData();
}

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
  exportData("/daily/basJob/export", "专项工作下发", params);
};

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
