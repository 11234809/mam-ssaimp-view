/*
 * @Descripttion: 
 * @version: 
 * @Author: yangfeng
 * @Date: 2024-07-24 14:18:07
 * @LastEditors: yangfeng
 * @LastEditTime: 2024-09-23 10:10:31
 */
import electronicFence from "./src/electronic-fence.vue"

/**
 * 注册组件。 
 * @author 王璐
 * @date 2024/2/19 
 * @param {*} vue Vue 对象。
 
 */
electronicFence.install = function (vue) {
    vue.component(electronicFence.name, electronicFence);
};

// 导出组件
export default electronicFence;