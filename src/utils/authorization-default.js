/*
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2024-09-06 16:55:20
 * @LastEditors: ysl
 * @LastEditTime: 2024-09-28 19:46:35
 */
/**
 * 提取两数组相同值
 * @param {*} arr1 arr2
 * arr1 = ["add", "del"], arr2 = ["run", "add"]
 * 返回 ["add"]
 */
export function isAuthDefault(arr1, arr2) {
    if (typeof (arr1) === "object") {
        arr1 = Object.values(arr1)
    }
    if (typeof (arr2) === "object") {
        arr2 = Object.values(arr2)
    }
    let set2 = new Set(arr2)
    let arr = arr1.filter(item => set2.has(item));
    return arr
}

/**
* 计算停留时间（当前时间减去传入时间）
* @param dateString
* dateString---传入的时间（字符形式，必填）
* 返回 转换后的停留时长---如：3天-2小时-12分
*/
export function getTimeDifference(dateString) {
    let stopTime = '';
    const date = new Date(dateString);
    const timestamp = date.getTime();
    const now = Date.now();
    const remainingTime = now - timestamp;
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) stopTime += days + '天';
    if (hours > 0) stopTime += hours + '小时';
    if (minutes > 0) stopTime += minutes + '分钟';

    return stopTime;
}