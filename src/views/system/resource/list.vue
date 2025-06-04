<!--
 * @Descripttion: 
 * @version: 
 * @Author: yangfeng
 * @Date: 2024-07-02 13:59:10
 * @LastEditors: yangfeng
 * @LastEditTime: 2024-11-18 14:33:53
-->
<template>
    <div>
        <Resource ref="ResourceTableView" @jumpToResource="jumpToResource">
        </Resource>
    </div>
</template>

<script>
import { Resource } from "mam-base-ui";
// import Resource from "../../../../../../mam-base/mam-base-ui/src/components/lib/resource/index.js";
import "mam-base-ui/theme/resource.css";

export default {
    name: "resourceView",
    components: {
        Resource,
    },
    data() {
        return {};
    },
    created() {},
    methods: {
        jumpToResource() {
            this.$Bus.emit("jumpResource", {});
        },
    },
};
</script>

<style lang="less"></style>
