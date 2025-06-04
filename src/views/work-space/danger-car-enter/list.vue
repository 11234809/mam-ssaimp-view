<template>
  <div class="danger-car-center">
    <!-- 筛选项 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="120px" label-position="right"
      label-suffix="：">
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item style="width: 100%;" label="服务区名称">
            <el-input v-model="formInline.serviceAreaName" placeholder="请输入服务区名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item style="width: 100%;" label="车牌号">
            <el-input v-model="formInline.carNumber" placeholder="请输入车牌号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item style="width: 100%;" class="form_item">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 列表 -->
    <el-table :data="tableData" border min-height="800px">
      <el-table-column label="服务区名称" prop="serviceAreaName" align="center" show-overflow-tooltip />
      <el-table-column label="车牌号" prop="carNumber" align="center" show-overflow-tooltip />
      <el-table-column label="车牌颜色" prop="carColor" align="center" show-overflow-tooltip />
      <el-table-column label="卡口名称" prop="bayonetName" align="center" show-overflow-tooltip />
      <el-table-column label="卡口类型" prop="bayonetType" align="center" show-overflow-tooltip />
      <el-table-column label="车辆照片" prop="picUrl" align="center" width="160">
        <template #default="scope">
          <el-image v-for="(item, index) in scope.row.picUrl" :preview-src-list="scope.row.picUrl" preview-teleported :key="index" :src="item"  alt="加载失败" lazy />
        </template>
      </el-table-column>
      <el-table-column label="拍摄时间" prop="dataTime" align="center" />
    </el-table>
    <!-- 分页 -->
    <el-pagination class="pagination" background layout="prev, pager, next, jumper" :total="total" :page-size="pageSize"
      :current-page="currentPage" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
  </div>
</template>

<script setup>
import {nextTick, reactive, ref} from 'vue'
import {getDangerCarEnterList} from "@/api/dangerCarEnterApi";

const currentPage = ref(1) // 当前页
const pageSize = ref(10) // 每页显示条数
const total = ref(0) // 列表总条数
const tableData = ref([]) //列表数据
// 筛选表单数据
const formInline = reactive({
  serviceAreaName: '',
  carNumber: ''
})

// 获取列表数据
function getData() {
  getDangerCarEnterList({ index: currentPage.value, size: pageSize.value, ...formInline }).then(res => {
    if (res.code == 200) {
      res.data.records.forEach((item) => {
        if (item.picUrl) {
          item.picUrl = item.picUrl.split(',').filter(item => item && item.toString().trim() !== '').map(item => {
            return process.env.VUE_APP_API_HOST_URL + process.env.VUE_APP_API_BASE_URL + `/pub/ssaimp/file/download?service=basDangerCarEnterRecordsFileServiceImpl&id=${item}`
          })
        }
      });
      tableData.value = res.data.records;
      total.value = res.data.total;
    }
  })
}
getData()

// 重置
function onReset() {
  Object.keys(formInline).map(key => { formInline[key] = null })
  nextTick(() => {
    getData()
  })
}
// 分页
function handleCurrentChange(val) {
  currentPage.value = val
  getData()
}
// 每页显示条数
function handleSizeChange(val) {
  pageSize.value = val
  getData()
}
</script>

<style lang="less" scoped>
.pagination {
  float: right;
  margin-top: 30px;
}
</style>
