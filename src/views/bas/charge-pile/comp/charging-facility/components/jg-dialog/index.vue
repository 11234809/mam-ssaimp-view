<template>
  <el-dialog
      v-bind="$attrs"
      title="电站标价"
      width="60%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      draggable
      destroy-on-close
      align-center
      :lock-scroll="false"
  >
    <div>
      <div>
        <el-table v-loading="loading" :data="tableData" border min-height="300">
          <el-table-column prop="equipmentId" label="时段" align="center">
            <template #default="scope">
                <div>
                    {{scope.row?.startTime}}-{{scope.row.endTime}}
                </div>
            </template>
            </el-table-column>
          <el-table-column prop="elecPrice" label="电费(元/度)" align="center"/>
          <el-table-column prop="servicePrice" label="服务费(元/度)" align="center"/>
          <el-table-column prop="totalPrice" label="总计单价(元/度)" align="center"/>
        </el-table>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {defineEmits, defineExpose, ref} from "vue";
import {getChargeStationManageChargeGun} from "@/api/powerStation";


const tableData = ref([])

const emit = defineEmits(["close", "export"]);

const handleClose = () => {
  emit("close");
};
const loading = ref(false);
function getData(option){
  loading.value = true;
  getChargeStationManageChargeGun({stationId: option.stationId}).then(res=>{
    tableData.value = res.data.records
    loading.value = false;
  })
}

defineExpose({getData})

</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.cell-item{
  width: 120px;
}
:deep(.el-descriptions__label.el-descriptions__cell.is-bordered-label){
  width: 120px;
}
</style>
