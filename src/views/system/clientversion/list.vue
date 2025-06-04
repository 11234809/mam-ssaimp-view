<!--
 * @Description: 版本管理
 * @Version: 2.0
 * @Autor: wanglu
 * @Date: 2025-02-19 09:31:59
 * @LastEditors: ysl
 * @LastEditTime: 2025-02-27 18:34:42
-->
 
<template>
    <div id="clientversion">
        <Clientversion :errorMessage="errorMessage"></Clientversion>
    </div>
</template>

<script>
import { errorMessage } from "@/assets/api/errorMessage.js";
import { Clientversion } from "mam-base-ui";

export default {
    name: "clientversion",
    components: {
        Clientversion
    },
    props: {},
    data() {
        return {
            errorMessage: null,
        };
    },
    mounted() {},
    created() {
        this.errorMessage = errorMessage;
    },
    methods: {},
};
</script>

<style scoped lang="less"></style>
