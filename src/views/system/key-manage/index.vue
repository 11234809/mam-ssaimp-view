<!--
 * @Descripttion: 配置加密
 * @version: 
 * @Author: ysl
 * @Date: 2024-09-18 09:14:40
 * @LastEditors: ysl
 * @LastEditTime: 2024-11-19 16:09:38
-->
<template>
    <div id="KeyManageCon">
        <keyManagement></keyManagement>
    </div>
</template>

<script>
import { keyManagement } from "mam-base-ui";
import "mam-base-ui/theme/key-management.css";

export default {
    name: "KeyManage",
    components: {
        keyManagement
    },
    props: {},
    data() {
        return {

        };
    },
    mounted() {

    },
    created() {

    },
    methods: {

    }
}
</script>

<style scoped lang='less'></style>
