<!--
 * @Descripttion: 401
 * @version: 
 * @Author: ysl
 * @Date: 2024-02-18 13:46:16
 * @LastEditors: ysl
 * @LastEditTime: 2024-09-25 10:03:07
-->
<template>
    <div class="erorr-no">
        <div class="error-box">
            <div class="box-top">
                401
            </div>
            <div class="box-bottom">
                无权限，请联系管理员授权！
            </div> 
        </div>
    </div>
</template>

<script>
export default {
    name: "UnauthorizedErrorView"
};
</script>
<style lang="less">
.erorr-no{
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