<!--
 * @Descripttion: 组织管理
 * @version: 
 * @Author: ysl
 * @Date: 2024-09-09 11:11:19
 * @LastEditors: ysl
 * @LastEditTime: 2024-11-19 16:09:44
-->
<template>
    <div id="organization">
        <Organization ref="organizationRef"></Organization>
    </div>
</template>

<script>
import { Organization } from "mam-base-ui";
import "mam-base-ui/theme/organization.css";

export default {
    name: "organization",
    components: {
        Organization
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
