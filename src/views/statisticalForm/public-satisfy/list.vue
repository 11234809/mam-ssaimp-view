<template>
    <div>
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="总体评价报表" name="first">
                <Total v-if="activeName === 'first'" />
            </el-tab-pane>
            <el-tab-pane label="餐饮服务评价报表" name="second">
                <Foods v-if="activeName === 'second'"/>
            </el-tab-pane>
            <el-tab-pane label="重庆小面餐饮评价报表" name="third">
                <Noodles v-if="activeName === 'third'"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Total from './total/list'
import Foods from './foods/list'
import Noodles from './noodles/list'

const activeName = ref('first'); // 默认激活的标签页
function handleClick(tab, event) {
    console.log(tab, event);
}
</script>