<!-- 新媒体素材推送统计报表 -->

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
        <el-col :span="6" v-for="formItem in formItemList" :key="formItem.prop">
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
                v-for="(item) in formItem.options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              v-if="formItem.type === 'datePicker'"
              v-model="formData[formItem.prop]"
              value-format="YYYY-MM"
              type="month"
              placeholder="请选择时间（月份）"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item class="form_item btn">
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
        v-for="item in tableColumn"
        :key="item.prop"
        :type="item.type"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        align="center"
      >
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { getServiceArea, queryNormalOptions } from "@/api/dictionaryApi.js";
import { formItem, tableColumn } from "./index";
import { getMediaMateriallList } from "@/api/statisticalForm/newMediaMaterial";
import { downFilePOST } from "@/api/manage";
import moment from "moment"

let formData = reactive({
  serviceAreaIdList:[],
  serviceAreaTypeList:[],
  yearAndMonth:moment().format('YYYY-MM'),
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

const listOptions = reactive({
  companyList: [],
  serviceAreaList: [],
  deviceStatusOptions: [],
  serviceTypeList:[],
  checkNumOptions: [
    { label: "每日", value: 0 },
    { label: "每周", value: 1 },
  ],
});
// 发布状态列表
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
  // console.log(listOptions.serviceTypeList,'listOptions.serviceTypeList');
  
});
// 列表导出
const handleExcel = () => {
  downFilePOST('api/statisticalForm/newMediaMaterial/export',{
    ...formData,
      pageNo: page.value,
      pageSize: pageSize.value,
  }).then(data=>{
    if (!data) {
      ElMessage.warning("文件下载失败");
      return;
    }
    let excelData = data.data;
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      window.navigator.msSaveBlob(
        new Blob([excelData], { type: "application/vnd.ms-excel" }),
        '新媒体素材列表' + ".xls"
      );
    } else {
      let url = window.URL.createObjectURL(
        new Blob([excelData], { type: "application/vnd.ms-excel" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", '新媒体素材列表' + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // 下载完成移除元素
      window.URL.revokeObjectURL(url); // 释放掉blob对象
    }
  })
};
// 查询
const getData = () => {
    getMediaMateriallList({
      ...formData,
      index: page.value,
      size: pageSize.value,
    }).then((res) => {
      console.log("---------------> ~ getData ~ res:", res)
      if (res.code === 200) {
        tableData.value = res.data.records;
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
      console.log("---------------> ~ .then ~ data:", data)
      if (code == 200) {
        listOptions.serviceAreaList = data.records
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// 重置查询
const onReset = () => {
  // 重置表单参数赋值
  Object.keys(formData).forEach((key) => {
    formData[key] = undefined;
  });
  page.value = 1; // 重置页码
  pageSize.value = 10; // 重置每页条数
  getData(); // 重新查询
};

// 分页
const handleCurrentChange = (val) => {
  page.value = val;
  getData();
};

// 每页条数
const handleSizeChange = (val) => {
  pageSize.value = val;
  getData();
};

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

      &.btn {
        .el-form-item__content {
          display: flex;
          justify-content: flex-end;
        }
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
