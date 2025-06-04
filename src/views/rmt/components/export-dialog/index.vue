<template>
  <el-dialog
      v-bind="$attrs"
      title="导出"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      draggable
      destroy-on-close
      align-center
      :lock-scroll="false"
  >
    <div>
      请选择导出的列：
      <div style="padding: 4px 40px">
        <el-checkbox
            label="全选按钮"
            :indeterminate="indeterminate"
            :checked="isAll"
            @change="handleCheckAllChange"
        />
        <el-checkbox-group
            v-model="checkList"
            @change="handleCheckedCitiesChange"
            style="display: flex; flex-direction: column"
        >
          <el-checkbox
              :label="item.value"
              v-for="item in props.list"
              :key="item.value"
              :checked="item.checked"
          >
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
         <el-popconfirm title="您确定要导出吗?" width="auto" @confirm="exportBtn">
            <template #reference>
                <el-button type="primary"> 导出 </el-button>
            </template>
         </el-popconfirm>
        <el-button type="primary" @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {computed, defineEmits, defineProps, ref} from "vue";
import {ElMessage} from "element-plus";

const props = defineProps({
  list: Array,
});

const emit = defineEmits(["closeModal", "export"]);

const checkList = ref([]);
// const isAll = ref(false);
const isIndeterminate = ref(false);

const handleCheckAllChange = (val) => {
  checkList.value = val ? props.list?.map((item) => item.value) : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value) => {
  const checkedCount = value.length;
  isAll.value = checkedCount === props.list.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.list.length;
};

const handleClose = () => {
  checkList.value = [];
  isIndeterminate.value = false;
  emit("closeModal");
};

const exportBtn = () => {
  console.log(checkList.value);
  if (checkList.value.length === 0) {
    ElMessage.warning("请选择导出的列");
    return;
  }
  emit("export", checkList.value);
};


const indeterminate = computed(() => {
  return (checkList.value.length > 0)
})
//
const isAll = ref(true)

</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
