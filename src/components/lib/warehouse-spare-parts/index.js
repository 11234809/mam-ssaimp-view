/*
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2024-09-18 11:35:41
 * @LastEditors: ysl
 * @LastEditTime: 2024-09-18 17:01:40
 */
import WarehouseSpareParts from "./src/warehouse-spare-parts.vue"

WarehouseSpareParts.install = function (vue) {
    vue.component(WarehouseSpareParts.name, WarehouseSpareParts);
};

// 导出组件
export default WarehouseSpareParts;