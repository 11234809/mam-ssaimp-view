/*
 * @Descripttion: 
 * @version: 
 * @Author: yangfeng
 * @Date: 2024-07-24 14:18:07
 * @LastEditors: yangfeng
 * @LastEditTime: 2024-09-18 09:17:09
 */
import facilitiesInfo from "./src/facilities-info.vue"

/**
 * 注册组件。 
 * @author 王璐
 * @date 2024/2/19 
 * @param {*} vue Vue 对象。
 
 */
facilitiesInfo.install = function (vue) {
    vue.component(facilitiesInfo.name, facilitiesInfo);
};

// 导出组件
export default facilitiesInfo;