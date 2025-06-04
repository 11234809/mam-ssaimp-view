<!--
 * @Descripttion: 
 * @version: 
 * @Author: yangfeng
 * @Date: 2024-07-02 09:13:00
 * @LastEditors: ysl
 * @LastEditTime: 2024-12-24 14:53:49
-->
<template>
    <div>
        <Dictionary ref="dictionaryTableView"> </Dictionary>
    </div>
</template>

<script>
import { Dictionary } from "mam-base-ui";
import "mam-base-ui/theme/dictionary.css";

export default {
    name: "dictionaryView",
    components: {
        Dictionary,
    },
    data() {
        return {};
    },
    created() {},
    methods: {},
};
</script>

<style lang="less"></style>
