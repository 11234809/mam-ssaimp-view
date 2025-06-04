<template>
  <div class="icon-number-title">
    <div class="left-icon">
      <slot name="icon"></slot>
    </div>
    <div class="right-content">
      <div class="number">{{ number }}</div>
      <div class="title">{{ title }}</div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  number: {
    type: [String, Number],
    required: true
  },
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.icon-number-title {
  display: flex;
  align-items: center;
  padding: 10px;
}
.left-icon {
  margin-right: 10px;
  border: 1px #a0a0a0 dashed;
}
.right-content {
  display: flex;
  flex-direction: column;
}
.number {
  font-family: Adobe Heiti Std;
  font-weight: normal;
  font-size: 30px;
  color: #FFFFFF;
  padding: 10px 0;
  text-shadow: 0 0 5px rgba(84, 141, 247, 0.7),
    /* 蓝色光晕 */
    0 0 10px rgba(89, 139, 231, 0.5),
    0 0 20px rgba(113, 154, 229, 0.3);
}
.title {
  color: #666;
  font-family: Adobe Heiti Std;
  font-weight: normal;
  font-size: 16px;
  color: #FFFFFF;
  padding: 10px 0;
}
</style>