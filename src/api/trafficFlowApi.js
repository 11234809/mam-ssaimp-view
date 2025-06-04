/*
 * @Author: fbz
 * @Date: 2025-05-14 19:26:53
 * @LastEditors: fbz
 * @LastEditTime: 2025-05-20 19:57:17
 */
import { http } from "mam-base-ui";

export function getQueryPageList (data) {
    const url = "/bas/trafficFlow/queryPage";
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
// 导出
export function exportXls(data) {
    const url = "/bas/trafficFlow/exportXls";
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
//字典标签专用（通过code获取字典数组）
export function getDictItems(data) {
    const url = "/pub/common/queryNormalOptions";
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve(error);
            }
        );
    });
}
//图片获取
export function getTrafficImage(data) {
    const url = "/bas/trafficFlow/getTrafficImage";
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