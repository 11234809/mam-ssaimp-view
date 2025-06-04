<!--
 * @Descripttion: 
 * @version: 
 * @Author: yangfeng
 * @Date: 2024-07-22 11:07:56
 * @LastEditors: yangfeng
 * @LastEditTime: 2024-11-18 14:39:38
-->
<template>
    <roadSegment ref="commonViewTable"> </roadSegment>
</template>
<script>
import { roadSegment } from "mam-rnbdmp-ui";
// import roadSegment from "../../../../../../mam-rnbdmp/mam-rnbdmp-view/src/components/lib/road-segment/index.js";
import "mam-rnbdmp-ui/theme/route.css";

export default {
    name: "roadSegmentView",
    components: {
        roadSegment,
    },
    data() {
        return {};
    },
    created() {},
    methods: {},
};
</script>

<style lang="less"></style>
