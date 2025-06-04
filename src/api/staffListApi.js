/*
 * @Description: 
 * @Version: 2.0
 * @Autor: wanglu
 * @Date: 2025-02-19 16:26:00
 * @LastEditors: wanglu
 * @LastEditTime: 2025-02-20 09:16:08
 */
// 保安保洁管理列表数据
import { http } from "mam-base-ui";

export function getBaseStaffList (data) {
    const url = "/bas/basManageReport/listByMonth";
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data,
            null,
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve(error);
            }
        );
    });
}


export const exportXlsUrl = "/api/bas/basManageReport/exportXlsByMonth"