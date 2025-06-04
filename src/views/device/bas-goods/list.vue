<!-- 物资列表 -->
<template>
  <div class="this_page">
    <!-- 筛选项 -->
    <el-form
      inline
      :model="formData"
      class="custom_form"
      label-width="120px"
      label-position="right"
      label-suffix=":"
    >
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="公司" class="form_item">
            <el-select
              v-model="formData.companyId"
              @change="handleChangeCompany"
              multiple
              filterable
              :reserve-keyword="false"
              placeholder="请选择公司"
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
          <el-form-item label="服务区" class="form_item">
            <el-select
              v-model="formData.serviceAreaId"
              multiple
              filterable
              :reserve-keyword="false"
              placeholder="请选择服务区"
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
          <el-form-item label="物资名称" class="form_item">
            <el-input
              v-model="formData.name"
              placeholder="请输入物资名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物资类型" class="form_item">
            <el-select
              v-model="formData.type"
              multiple
              filterable
              :reserve-keyword="false"
              placeholder="请选择物资类型"
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
          <el-form-item label="规格型号" class="form_item">
            <el-input
              v-model="formData.model"
              placeholder="请输入规格型号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="品牌" class="form_item">
            <el-input
              v-model="formData.brand"
              placeholder="请输入品牌"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商" class="form_item">
            <el-input
              v-model="formData.supplier"
              placeholder="请输入供应商"
              clearable
            />
          </el-form-item>
        </el-col>
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
      <el-button type="primary" @click="doUpdate('plus')" v-if="isAuth('add')">

        <span>入库</span>
      </el-button>
      <el-button type="primary" @click="doUpdate('minus')" v-if="isAuth('edit')">

        <span>出库</span>
      </el-button>
      <el-button type="primary" @click="doExport(0)">
        <span>导出</span>
      </el-button>
      <el-button type="primary" @click="doExport(1)">
          <span>带图导出</span>
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
      class="custom_table"
      ref="tableRef"
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column
        prop="companyName"
        label="公司"
        align="center"
        show-overflow-tooltip
        min-width="200"
      />
      <el-table-column
        prop="serviceAreaName"
        label="服务区"
        align="center"
        show-overflow-tooltip
        min-width="200"
      />
      <el-table-column
        prop="name"
        label="物资名称"
        align="center"
        show-overflow-tooltip
        min-width="140"
      />
      <el-table-column
        prop="type"
        label="物资类型"
        align="center"
        show-overflow-tooltip
        min-width="140"
      />
      <el-table-column
        prop="num"
        label="物资数量"
        align="center"
        show-overflow-tooltip
        min-width="140"
      />
      <el-table-column
        prop="model"
        label="规格型号"
        align="center"
        show-overflow-tooltip
        min-width="140"
      />
      <el-table-column
        prop="brand"
        label="品牌"
        align="center"
        show-overflow-tooltip
        min-width="140"
      />
      <el-table-column
        prop="supplier"
        label="供应商"
        align="center"
        show-overflow-tooltip
        min-width="140"
      />
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="files"
        label="图片"
        align="center"
        show-overflow-tooltip
        width="200"
      >
        <template #default="{ row }">
          <div v-if="row.filesName" class="pic_box">
            <el-image
              v-for="(item, index) in row.filesName"
              :key="index"
              :preview-src-list="row.filesName"
              :src="item"
              preview-teleported
              alt="加载失败"
            />
          </div>
          <span v-else class="no_file">无文件</span>
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

    <!-- 新增/编辑/详情弹窗 -->
    <PlusMinusDialog
      v-if="aedVisible"
      :visible="aedVisible"
      :type="aedType"
      @dialogClose="aedClose"
      :options="listOptions"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import PlusMinusDialog from "./plus-minus-dialog.vue";
import {
  queryNormalOptions,
  getCompany,
  getServiceAreaInfo,
} from "@/api/dictionaryApi.js";
import { exportData } from "@/utils/common-features";
import { getBasGoodsList } from "@/api/device/basGoodsApi";
import {isAuth} from "@/utils/authorization";

const useInfo = JSON.parse(sessionStorage.getItem("userInfo"));

/* 筛选表单数据start */
const formData = reactive({});
const listOptions = reactive({
  companyList: [],
  serviceAreaList: [],
  typeList: [],
});
const handleChangeCompany = () => {
  // 获取服务区
  getServiceAreaInfo(formData.companyId?.join(","))
    .then(({ code, data }) => {
      if (code == 200) {
        formData.serviceAreaId = [];
        listOptions.serviceAreaList = data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
// 获取字典数据
function getDictionary() {
  // 获取服务区
  getServiceAreaInfo()
    .then(({ code, data }) => {
      if (code == 200) {
        listOptions.serviceAreaList = data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // 获取公司下拉
  getCompany().then(({ code, data }) => {
    listOptions.companyList = data.records;
  });
  // 获取物资类型
  queryNormalOptions({
    queriers: [{ alias: "sysGoodsTypeDictionary", param: null }],
  }).then(({ code, data }) => {
    listOptions.typeList = data.sysGoodsTypeDictionary;
  });
}
/* 筛选表单数据end */

/* 列表相关start */
const tableRef = ref(null); //列表ref
const tableData = ref([
  {
    plateType: null,
    deviceStatus: null,
  },
]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
//获取列表数据
async function getData() {
  const params = {
    index: page.value,
    size: pageSize.value,
    ...formData,
    serviceAreaId: formData.serviceAreaId?.length
      ? formData.serviceAreaId.join(",")
      : undefined,
    companyId: formData.companyId?.length
      ? formData.companyId.join(",")
      : undefined,
    type: formData.type?.length ? formData.type.join(",") : undefined,
  };
  let res = await getBasGoodsList(params);
  if (res.code == 200) {
    tableData.value = res.data.records.map((item) => {
      const filesName = item.files
        ?.split(",")
        .map(
          (item2) =>
            process.env.VUE_APP_API_HOST_URL +
            process.env.VUE_APP_API_BASE_URL +
            `/pub/common/file/download?service=basGoodsFileServiceImpl&id=${item2}`
        );
      return { ...item, filesName };
    });
    // tableData.value.map(async (item) => {
    //   item.filesName = item.files.split(",").map((item2) => {
    //     return  process.env.VUE_APP_API_HOST_URL + process.env.VUE_APP_API_BASE_URL + `/pub/common/file/download?service=basGoodsFileServiceImpl&id=${item2}`
    //   });
    //   // if (item.files) {
    //   //   item.files.split(",").map(async (item2) => {
    //   //     await getFileInfo({ fileIds: item2 }).then(async (res) => {
    //   //       if (res.code == 200) {
    //   //         item.filesName = res.data.map((i) => ({
    //   //           uid: item2,
    //   //           name: i.fileName,
    //   //           url:
    //   //             process.env.VUE_APP_API_HOST_URL +
    //   //             process.env.VUE_APP_API_BASE_URL +
    //   //             `/pub/common/file/download?service=basGoodsFileServiceImpl&id=${item2}`,
    //   //         }));
    //   //       } else {
    //   //         item.filesName = [];
    //   //       }
    //   //     });
    //   //   });
    //   // }
    // });
    total.value = Number(res.data.total);
  } else {
  }
}
// 查询重置
function onReset() {
  Object.keys(formData).map((key) => {
    formData[key] = null;
  });
  page.value = 1;
  pageSize.value = 10;
  getData();
}
// 列表分页-当前页改变
function handleCurrentChange(val) {
  page.value = val;
  getData();
}
// 列表分页-每页显示条数改变
function handleSizeChange(val) {
  pageSize.value = val;
  getData();
}
function fileDownload(file) {
  let url =
    process.env.VUE_APP_API_HOST_URL +
    process.env.VUE_APP_API_BASE_URL +
    `/pub/common/file/download?service=basDangerItemFileServiceImpl&id=${file}`;
  window.open(url);
}

/* 入库/出库弹窗相关start */
const aedType = ref(""); // 入库/出库弹窗类型 plus:入库 minus:出库
const aedVisible = ref(false); // 入库/出库弹窗显示

// 入库/出库弹窗关闭
function aedClose() {
  aedVisible.value = false;
  aedType.value = "";
  getData();
}
// 导出
function doExport(imgFlag) {
  const params = {
    ...formData,
    serviceAreaId: formData.serviceAreaId?.length
      ? formData.serviceAreaId.join(",")
      : undefined,
    companyId: formData.companyId?.length
      ? formData.companyId.join(",")
      : undefined,
    type: formData.type?.length ? formData.type.join(",") : undefined,
    index: imgFlag?page.value:-1,
    size: imgFlag?pageSize.value:-1,
    imgFlag
  };
  exportData("/device/basGoods/export", "物资列表", params);
}
// 打开入库/出库弹窗
function doUpdate(type) {
  aedType.value = type;
  aedVisible.value = true;
}
/* 入库/出库弹窗相关end */

onMounted(() => {
  getDictionary();
  getData();
});
</script>

<style lang="less" scoped>
.this_page {
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

    .accessory_box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
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
