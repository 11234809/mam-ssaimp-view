<!--
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2024-09-02 09:52:54
 * @LastEditors: ysl
 * @LastEditTime: 2024-11-21 15:41:18
-->
<template>
  <router-view v-if="isRouterAlive" />
</template>
<script>

export default {
  data() {
    return {
      isRouterAlive: true
    };
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    }
  },
};
</script>
<style lang="scss">
@import 'styles/whiteTheme.scss';
@import 'styles/darkTheme.scss';
@import 'styles/global.scss';
</style>
