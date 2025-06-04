<!--
 * @Descripttion: 
 * @version: 
 * @Author: yangfeng
 * @Date: 2024-07-22 11:07:56
 * @LastEditors: yangfeng
 * @LastEditTime: 2025-01-14 16:11:08
-->
<template>
  <message ref="commonViewTable" :errorMessage="errorMessage"> </message>
</template>
<script>
import { message } from "mam-base-ui";
// import message from "../../../../../../mam-base/mam-base-ui/src/components/lib/message/src/message.vue";
import { errorMessage } from "@/assets/api/errorMessage.js";

export default {
  name: "messageView",
  components: {
    message,
  },
  data() {
    return {
      errorMessage: () => {},
    };
  },
  created() {
    this.errorMessage = errorMessage;
  },
  methods: {},
};
</script>

<style lang="less"></style>
