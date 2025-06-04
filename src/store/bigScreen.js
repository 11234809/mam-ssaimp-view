/*
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2025-06-03 10:50:05
 * @LastEditors: ysl
 * @LastEditTime: 2025-06-03 10:59:14
 */
import { defineStore } from "pinia";

export const bigScreen = defineStore("tempData", {
    state: () => ({
        chargeReportData: null
    }),
    actions: {
        setData(data) {
            this.chargeReportData = data;
        },
        clearData() {
            this.chargeReportData = null;
        }
    }
});
