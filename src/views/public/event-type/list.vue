<script setup>
import {ref, reactive, onMounted} from "vue";
import {isAuth} from "@/utils/authorization";
import {ArrowDown, Plus} from "@element-plus/icons-vue";
import AddEditDetail from "./add-edit-detail.vue";
import {getEventTypeApi, getEventTypeChildrenApi, delEventTypeApi, getEventTypeDetailAPi} from "@/api/public/eventTypeApi";
import {ElMessageBox, ElMessage} from "element-plus";

const formData = reactive({
  name: '',
  index: 1,
  size: 10
})
const total = ref(0);
const tableData = ref([]);
const dialogVisible = ref(false);
const dialogType = ref(1); // 1 - 新增 2 - 编辑 3 - 查看
const dialogId = ref(null);
const tableRef = ref(null);
const maps = ref(new Map());

const getData = async () => {
  const {data} = await getEventTypeApi({...formData});
  tableData.value = data.records.map(item => {
    if (item['hasChildren']) {
      return item;
    } else {
      delete item.hasChildren;
      return item;
    }
  });
  total.value = Number(data.total);
};

const load = async (row, treeNode, resolve) => {
  // 存储 row.entityId、treeNode 和 resolve 到 maps 中
  maps.value.set(row.entityId, {row, treeNode, resolve});
  
  const {data} = await getEventTypeChildrenApi(row.entityId);
  const childrenList = data.records.map(item => {
    if (item['hasChildren']) {
      return item;
    } else {
      delete item.hasChildren;
      return item;
    }
  })
  if (childrenList.length === 0) {
    resolve([])
    tableRef.value.store.states.lazyTreeNodeMap.value[row.entityId] = []
  } else {
    resolve(childrenList)
  }
};

const handleSizeChange = (val) => {
  formData.size = val;
  getData();
};

const handleCurrentChange = (val) => {
  formData.index = val;
  getData();
};

const onReset = () => {
  formData.name = '';
  formData.index = 1;
  formData.size = 10;
  getData();
};

const delRow = (id, pid) => {
  ElMessageBox.confirm("是否确认删除?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const res = await delEventTypeApi(id)
    if (res.code === 200) {
      ElMessage.success('删除成功');
      if (pid) {
        entryMaps(pid)
        getData()
      } else {
        getData()
      }
    }
  })
}

const openDialog = (type, id) => {
  dialogType.value = type;
  dialogVisible.value = true;
  if (type !== 1) {
    dialogId.value = id;
  }
};

const closeDialog = (isConfig, pid, rowId) => {
  dialogId.value = ''
  dialogType.value = 1
  dialogVisible.value = false;
  if (dialogType.value !== 3 && isConfig) {
    getData();
    entryMaps(pid)
    const entry = maps.value.get(rowId);
    if (entry) {
      entryMaps(rowId)
    }
  }
};

const entryMaps = (rowId) => {
  // 从 maps 中取出对应的值
  const entry = maps.value.get(rowId);
  if (entry) {
    const {row, treeNode, resolve} = entry;
    // 将取出对应数据再传给 load 方法
    load(row, treeNode, resolve);
  } else {
    console.warn(`No entry found for rowId: ${rowId}`);
  }
}

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="staff-list_page" id="staff-list">
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
          <el-form-item label="名称" class="form_item">
            <el-input v-model="formData.name" placeholder="请输入名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"></el-col>
        <el-col :span="6"></el-col>
        <el-col :span="6">
          <el-form-item class="form_item query-form-btn">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div class="func_btn_box">
    <el-button v-if="isAuth('add')" type="primary" @click="openDialog(1)">
      <el-icon>
        <Plus/>
      </el-icon>
      新增
    </el-button>
  </div>
  <el-table
    ref="tableRef"
    :data="tableData"
    style="width: 100%"
    row-key="entityId"
    table-layout="auto"
    :load="load"
    lazy
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column label="名称" prop="name" min-width="300"/>
    <el-table-column label="说明" prop="remark" width="300"/>
    <el-table-column label="状态" prop="statusText" width="100"/>
    <el-table-column label="操作" width="150" align="center">
      <template #default="{row}">
        <div class="operate-box">
          <el-button v-if="isAuth('edit')" type="primary" size="small" link @click="openDialog(2, row.entityId)">编辑</el-button>
          <el-dropdown>
            <el-button type="primary" size="small" link>
              更多
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="isAuth('add')" @click="openDialog(4, row.entityId, row.name)">添加下级</el-dropdown-item>
                <el-dropdown-item v-if="isAuth('del')" @click="delRow(row.entityId, row.pid)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div class="pagination_box">
    <el-pagination
      v-model:current-page="formData.index"
      v-model:page-size="formData.size"
      :page-sizes="[5, 10, 20, 30, 50]"
      layout="total,  prev, pager, next, sizes, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  
  <AddEditDetail
    v-if="dialogVisible"
    :dialogVisible="dialogVisible"
    :dialogType="dialogType"
    :dialogId="dialogId"
    @close-dialog="closeDialog"
  />
</template>

<style scoped lang="less">
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

.operate-box {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .el-dropdown {
    margin-left: 12px;
  }
}

.func_btn_box {
  margin-bottom: 20px;
}

.pagination_box {
  margin-top: 20px;
  float: right;
}
</style>