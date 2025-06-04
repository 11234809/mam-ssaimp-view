// 通用工具函数


// 驼峰转下划线
export function camelToSnake(camelCaseString) {
    return camelCaseString.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}
