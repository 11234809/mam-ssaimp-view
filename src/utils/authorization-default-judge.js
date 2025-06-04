/*
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2024-09-06 16:55:20
 * @LastEditors: yangfeng
 * @LastEditTime: 2024-09-30 11:16:19
 */
import {isAuthDefault} from "./authorization-default.js"

function judgeBtnArr() {
    // 判断table按钮
    // arr 表格内所有默认按钮
    // 返回用户有权限的按钮
    judgeBtnArr.prototype.tableBtnArr = function(arr) {
        // allAuthBtn 有权限的按钮
        let allAuthBtn = JSON.parse(sessionStorage.getItem("permissions") || '[]')
        if (allAuthBtn == null) {
            allAuthBtn = []
        }
        let beforActionArray = arr
        let afterActionArray = isAuthDefault(allAuthBtn, arr);
        // 存在查看按钮时，在过滤后数组中加入查询权限
        if (beforActionArray.includes("info")) {
            let infoArr = ["info"]
            let authArr = [...new Set(afterActionArray.concat(infoArr))]
            return authArr
        } else {
            return afterActionArray
        }
    };
    // 判断按钮组按钮
    // arr 按钮组内所有默认按钮
    // 返回用户有权限的按钮
    judgeBtnArr.prototype.groupBtnArr = function(arr) {
        // allAuthBtn 有权限的按钮
        let allAuthBtn = JSON.parse(sessionStorage.getItem("permissions") || '[]')
        if (allAuthBtn == null) {
            allAuthBtn = []
        }
        let beforBtnArray = arr;
        let afterBtnArray = isAuthDefault(allAuthBtn, arr);
        // 加入null保证样式合理
        if (beforBtnArray.length > 0 && afterBtnArray.length == 0) {
            let authArr = ["null"];
            return authArr
        } else {
            let authArr = afterBtnArray;
            return authArr
        }
    };
}

const judgeBtnArrInst = new judgeBtnArr();    // 初始化组件实例
export default judgeBtnArrInst;              // 导出组件实例