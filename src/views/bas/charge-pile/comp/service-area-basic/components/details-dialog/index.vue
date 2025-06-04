<template>
  <el-dialog
      style="margin: 132px auto 5vh auto;"
      v-bind="$attrs"
      :title="title"
      width="60%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      draggable
      destroy-on-close
      :lock-scroll="false"
  >
    <el-scrollbar style="max-height: calc(100vh - 132px * 2 - 60px)">
      <div>
        <el-descriptions
            class="margin-top"
            direction="vertical"
            title=""
            :column="4"
            size="large"
            border
        >
          <el-descriptions-item v-for="item in itemInfo" :key="item.label">
            <template #label>
              <div class="cell-item">
                {{ item.label }}:
              </div>
            </template>
            <span>
              {{ item.key && info ? info[item.key] || '-' : '-' }} {{ item?.unit }}
            </span>

          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import {defineEmits, defineExpose, ref} from "vue";

const itemInfo = ref([])

const title=ref('服务区基础信息')
const emit = defineEmits(["close"]);

const handleClose = () => {
  emit("close");
};


const info = ref()


function renderInfo(row, columns,title) {
  itemInfo.value = columns
  info.value = row
  title && (title.value = title);
  console.log(row, columns,'row, column')
}


defineExpose({
  renderInfo
})


</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}


:deep(.el-descriptions__label.el-descriptions__cell.is-bordered-label) {
  width: 120px;
}


.flex {
  display: flex;
  align-items: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: #389e0d;
  display: inline-block;
  margin-right: 4px;
}

.dot.danger {
  background: red;
}

</style>
<style>
.el-button--primary.charge-station-manage-confirm-button {
  --el-button-bg-color: var(--btnBgColor) !important;
  background: var(--btnBgColor) !important;
}
</style>
