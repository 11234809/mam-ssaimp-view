<!--
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2024-08-07 11:34:56
 * @LastEditors: yangfeng
 * @LastEditTime: 2024-11-18 14:06:09
-->
<template>
    <div id="logManagement">
        <logManagement ref="logManagementRef"> </logManagement>
    </div>
</template>

<script>
import { logManagement } from "mam-base-ui";
// import logManagement from "../../../../../../mam-base/mam-base-ui/src/components/lib/log-management/index.js";
import "mam-base-ui/theme/log-management.css";

export default {
    name: "logManagementView",
    components: {
        logManagement,
    },
    data() {
        return {};
    },
    created() {},
    methods: {},
};
</script>

<style lang="less"></style>
