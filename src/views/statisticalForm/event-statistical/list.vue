<!-- 事件统计报表 -->

<template>
  <div class="staff-list_page" id="staff-list">
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
        <el-col :span="formItem.type === 'datePicker' ? 12 : 6" v-for="formItem in formItemList" :key="formItem.prop">
          <el-form-item :label="formItem.label" class="form_item">
            <el-select
              v-if="formItem.type === 'select'"
              v-model="formData[formItem.prop]"
              multiple
              filterable
              :reserve-keyword="false"
              collapse-tags
              :placeholder="`请选择${formItem.label}`"
              clearable
            >
              <el-option
                v-for="(item, index) in formItem.options"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              v-if="formItem.type === 'datePicker'"
              v-model="formData[formItem.prop]"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="~"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="18"></el-col>
        <el-col :span="6">
          <el-form-item class="form_item query-form-btn">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 功能按钮组 -->
    <div class="func_btn_box">
      <el-button type="primary" @click="handleExcel">导出</el-button>
    </div>
    <el-table
      class="custom_table"
      ref="tableRef"
      table-layout="auto"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        v-for="item in colonm"
        :key="item.prop"
        :type="item.type"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        align="center"
      >
        <template #default="{ row }" v-if="!normalColumn.includes(item.prop)">
          <el-button
            type="primary"
            size="small"
            link
            @click="handleDetail(row, item.prop)"
            v-if="row[item.prop]"
          >
            {{ row[item.prop]}}
          </el-button>
          <span v-else>0</span>
        </template>
        <template #default="{ row }" v-else-if="normalColumn.includes(item.prop)&&item.prop!='index'">{{ row[item.prop] || '-' }}</template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 详情弹窗 -->
    <DetailDialog
      v-if="aedVisible"
      :visible="aedVisible"
      :data="aedData"
      @dialogClose="aedClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
// import { getBaseStaffList, exportXlsUrl } from "@/api/staffListApi.js";
import { getServiceArea, queryNormalOptions } from "@/api/dictionaryApi.js";
import { formItem, tableColumn, normalColumn } from "./index";
import DetailDialog from "./detail-dialog.vue";
import { downFilePOST } from "@/api/manage";
import { getEventlList } from "@/api/statisticalForm/event";
import { exportData } from "@/utils/common-features";
import moment from "moment"

let formData = reactive({
  serviceAreaIdList:[],
  serviceAreaTypeList:[],
  checkTime:[moment().format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
});
// 搜索表单
const formItemList = computed(() => {
  return formItem(listOptions);
});

const tableRef = ref(null); // 列表引用
const tableData = ref([]); // 列表数据
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数
const aedData = ref({}); // 详情弹窗数据
const aedVisible = ref(false); // 详情弹窗显示
const colonm = ref({}); // 表格表头
const listOptions = reactive({
  companyList: [],
  serviceAreaList: [],
  serviceTypeList:[],
  deviceStatusOptions: [
    // { label: "正常", value: "正常" },
    // { label: "异常", value: "异常" },
  ],
  checkNumOptions: [
    { label: "每日", value: 0 },
    { label: "每周", value: 1 },
  ],
});

// 详情弹窗关闭
const aedClose = () => {
  aedVisible.value = false;
  getData();
};
// 列表详情
const handleDetail = (data,prop) => {
  // console.log("---------------> ~ handleDetail ~ data:",prop, data)
  aedVisible.value = true;
  let parmas = {
    companyIdList:[data.companyId||''],
    serviceAreaIdList:[data.serviceAreaId||''],
    eventName: prop == 'total' ? '' : prop,
  }
  aedData.value = parmas ? parmas : {};
};
// 服务区类型
queryNormalOptions({
    queriers: [{ alias: 'basAreaInfoTypeDictionary', param: null }],
}).then((res) => {
  res.data.basAreaInfoTypeDictionary.forEach(el=>{
    if(el.name !='整体') {
      listOptions.serviceTypeList.push({
        label: el.name,
        value: el.name,
      })
    }
  })
});
// 列表导出
const handleExcel = () => {
  let params = {
      ...formData,
      index: page.value,
      size: pageSize.value,
  }
  exportData("/statisticalForm/eventStatistical/export", "事件统计报表", params);
};
// 处理动态表头
const disposeColumn = (arr)=>{
      if(!arr || !Object.keys.length) return []
      // 固定字段
      let fixdProperty = [ "total", "eventType", "serviceAreaId", "serviceAreaName", "companyId", "company", "eventNum"]
      let keyArr = Object.keys(arr)
      let dynamic = keyArr.filter(el=>!fixdProperty.includes(el)).map(item=>{
        return {
          label: item,
          prop: item,
        }
      })
      return dynamic
}
const getData = () => {
    let parmas = {
      ...formData,
      startTime: formData.checkTime[0],
      endTime: formData.checkTime[1],
      index: page.value,
      size: pageSize.value,
    }
    getEventlList(parmas).then((res) => {
      if (res.code === 200) {
        tableData.value = res.data.records;
        let pop = {
            prop: "total",
            label: "事件总数",
        }
        let colonmDunamic = disposeColumn(tableData.value[0]) || []
        colonm.value = [...tableColumn, ...colonmDunamic,pop]
        total.value = res.data.total;
      } else {
        ElMessage.error(res.message);
      }
    });
  
};


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
}

// 重置查询
const onReset = () => {
  // 重置表单参数赋值
  Object.keys(formData).forEach((key) => {
    formData[key] = null;
  });
  formData.checkTime = [];
  // console.log("---------------> ~ onReset ~ formData:", formData)
  page.value = 1; // 重置页码
  pageSize.value = 10; // 重置每页条数
  getData(); // 重新查询
}

// 分页
const handleCurrentChange = (val) => {
  page.value = val;
  getData();
}

// 每页条数
const handleSizeChange = (val) => {
  pageSize.value = val;
  getData();
}

onMounted(() => {
  getDictionary();
  getData();
});
</script>

<style lang="less" scoped>
#staff-list .el-button--danger.is-plain:hover {
  color: #fff !important;
}

.staff-list_page {
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
