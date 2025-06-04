/*
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2024-09-18 09:55:51
 * @LastEditors: ysl
 * @LastEditTime: 2024-09-18 11:37:16
 */
import Warehouse from "./src/warehouse.vue"

Warehouse.install = function (vue) {
    vue.component(Warehouse.name, Warehouse);
};

// 导出组件
export default Warehouse;