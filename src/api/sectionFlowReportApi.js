/*
 * @Descripttion: 断面流量获取及服务区卡口数据与断面流量对比统计API
 * @version: 
 * @Author: ysl
 * @Date: 2025-02-24 11:10:43
 * @LastEditors: ysl
 * @LastEditTime: 2025-03-05 09:29:39
 */
import { http } from "mam-base-ui";

export const sectionFlowReportFN = { 
    DICT: "/pub/common/queryNormalOptions",  // 字典API
    LIST: "/bas/sectionFlow/queryPage",  // 表格数据
    AREASELECT: "/pub/ssaimp/common/getServiceArea",  // 服务区列表
    EXPORT: "/bas/sectionFlow/exportXls",  // 导出
}

// 获取字典数据
export function getNormalOptions (data) {
    return new Promise((resolve) => {
        http.callbackPost(sectionFlowReportFN.DICT, data || null, null,
            function (result) {
                resolve(result);
            }, function (error) {
                resolve(error);
            }
        );
    })
}

// 获取表格数据
export function getTableData (data) {
    return new Promise((resolve) => {
        http.callbackPost(sectionFlowReportFN.LIST, data || null, null,
            function (result) {
                resolve(result);
            }, function (error) {
                resolve(error);
            }
        );
    })
}

// 获取服务区列表
export function getServiceAreaList (data) {
    return new Promise((resolve) => {
        http.callbackPost(sectionFlowReportFN.AREASELECT, data || null, null,
            function (result) {
                resolve(result);
            }, function (error) {
                resolve(error);
            }
        );
    })
}

// 导出列表
export function hanldExport (data) {
    return new Promise((resolve) => {
        http.callbackPost(sectionFlowReportFN.EXPORT, data || null, { responseType: "blob" },
            function (result) {
                resolve(result);
            }, function (error) {
                resolve(error);
            }
        );
    })
}