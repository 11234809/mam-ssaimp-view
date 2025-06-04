import Warehouse from "./warehouse";
import WarehouseSpareParts from "./warehouse-spare-parts";
/**
 * @type {Array} 组件集合。
 */
const components = [
    Warehouse,
    WarehouseSpareParts
];

/**
 * 注册组件。
 * @author 袁孝均
 * @date 2024/08/22
 * @param {*} vue Vue 对象。
 */
const install = function (vue) {
    components.forEach((component) => {
        vue.component(component.name, component);
    });
};

// 导出库
export default {
    install
};
