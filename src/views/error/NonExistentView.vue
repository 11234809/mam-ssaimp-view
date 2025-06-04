<!--
 * @Descripttion: 404
 * @version: 
 * @Author: ysl
 * @Date: 2024-09-06 16:00:47
 * @LastEditors: ysl
 * @LastEditTime: 2024-09-25 15:59:03
-->
<template>
    <div class="erorr-null">
        <div class="error-box">
            <el-empty description="404" :image-size="200">
                <div class="box-bottom">
                    当前页面不见了&nbsp;&nbsp;(ó﹏ò｡)
                </div> 
            </el-empty>
        </div>
    </div>
</template>

<script>
export default {
    name: "NonExistentView",
};
</script>
<style lang="less">
.erorr-null{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--checkboxDisableTextColor);
    background: var(--bgGradientBodyColor);
    .error-box{
        margin-bottom: 150px;
    }
    .box-top{
        font-weight: 600;
        font-size: 32px;
    }
    .box-bottom{
        font-weight: 600;
        font-size: 28px;
    }
}
</style>