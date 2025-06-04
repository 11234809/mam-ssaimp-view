/**
 * 设备物资管理
 */

import { http } from "mam-base-ui";
/**
 * 获取服务区下拉列表
 * @param {*} data 
 * @returns 
 */
export function getServiceArea(data) {
    const url = "/pub/ssaimp/common/getServiceArea";
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

/**
 * 获取公司下拉列表
 * @param {*} data 
 * @returns 
 */
export function getCompany(data) {
    const url = "/pub/ssaimp/common/getCompany";
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

// 设备巡检列表
export function getBasRecordList(data) {
    const url = "/device/basRecord/queryPage";
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

/**
 * 物资列表-分页列表查询
 */
export function getBasGoodsList(data) {
    const url = "/device/basGoods/queryPage";
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

/**
 * 物资列表-入库
 */
export function getBasGoodsSave(data) {
    const url = "/device/basGoods/save";
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

/**
 * 物资列表-出库
 */
export function getBasGoodsUpdate(data) {
    const url = "/device/basGoods/update";
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

/**
 * 获取图片文件名
 */
export function getFileInfo(data) {
    const url = `/device/basGoods/getFileInfo/${data.fileIds}`;
    return new Promise((resolve) => {
        http.callbackGet(
            url,
            {},
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