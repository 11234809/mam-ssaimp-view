<template>
  <div class="auto-scroll-table">
    <!-- 表头 -->
    <table class="smart-energy-left-item-table table-header">
      <thead>
        <tr>
          <th v-for="(col, index) in columns" :key="index">{{ col.label }}</th>
        </tr>
      </thead>
    </table>

    <!-- 表体（可滚动） -->
    <div class="table-body-scroll" ref="scrollContainer">
      <table class="smart-energy-left-item-table">
        <tbody ref="scrollContent">
          <tr
            v-for="(item, index) in data"
            :key="index"
            :class="index % 2 === 0 ? 'row-odd' : 'row-even'"
            @mouseenter="pauseScroll"
            @mouseleave="resumeScroll"
            @click="handleClick(item)"
          >
            <td v-for="(col, i) in columns" :key="i">{{ item[col.prop] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true, // 每项: { label: '标题', prop: '字段名' }
  },
});

const emit = defineEmits(["row-click"]);

const scrollContainer = ref(null);
const scrollContent = ref(null);
let scrollInterval = null;

const startScroll = () => {
  const container = scrollContainer.value;
  const content = scrollContent.value;
  if (!container || !content || content.scrollHeight <= container.clientHeight)
    return;

  scrollInterval = setInterval(() => {
    if (container.scrollTop + container.clientHeight >= content.scrollHeight) {
      container.scrollTop = 0;
    } else {
      container.scrollTop += 1;
    }
  }, 30);
};

const pauseScroll = () => {
  clearInterval(scrollInterval);
};

const resumeScroll = () => {
  startScroll();
};

const handleClick = (item) => {
  emit("row-click", item);
};

onMounted(() => {
  startScroll();
});

onBeforeUnmount(() => {
  clearInterval(scrollInterval);
});

watch(
  () => props.data,
  () => {
    pauseScroll();
    setTimeout(startScroll, 100); // 重启滚动以适配新数据
  }
);
</script>

<style scoped>
.auto-scroll-table {
  justify-content: flex-start;
}
.smart-energy-left-item-table {
  width: 90%;
  margin: 0 auto;
  border-collapse: collapse;
  text-align: center;
  color: #d5e2f1;
  background-color: #142234;
  table-layout: fixed;
}

.smart-energy-left-item-table th,
.smart-energy-left-item-table td {
  padding: 0.5rem;
  /* border: .0625rem solid #1d3a4d; */
}

.smart-energy-left-item-table th {
  background-color: #132538;
}

.table-body-scroll {
  height: 12.5rem;
  overflow: hidden;
}

.table-header {
  table-layout: fixed;
}
.table-body-scroll tr {
  cursor: pointer;
}
.row-odd {
  background-color: #143751;
}

.row-even {
  background-color: #112839;
}
</style>
