/*
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2024-09-06 16:55:20
 * @LastEditors: ysl
 * @LastEditTime: 2024-09-09 09:26:20
 */
/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
    return JSON.parse(sessionStorage.getItem("permissions") || '[]').indexOf(key) !== -1 || false
}