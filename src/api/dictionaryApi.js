/**
 * 获取字典数据
 * @param data
 * @returns
 */
import { http } from "mam-base-ui";
import { doPost, doGet } from "@/utils/requestUtils";
// 车牌颜色字典
export function getNormalOptions(data) {
    const url = "/pub/common/queryNormalOptions";
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data || null,
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
// 获取危化品字典
export function getBasDangerItemList(data) {
    const url = "/bas/dangerItem/queryPage";
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data || null,
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
// 获取服务区
export function getServiceArea(data) {
    const url = "/pub/ssaimp/common/getServiceArea";
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data || null,
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

// 获取根据ID图片
export function getImageForId(service, id) {
    const url = `/pub/common/file/download?service=${service}&id=${id}`;
    return new Promise((resolve) => {
        http.callbackGet(
            url,
            null,
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

// 字典获取
export function queryNormalOptions(data) {
    const url = `/pub/common/queryNormalOptions`;
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
// 路线
export function getRoadLineList(data) {
    const url = "/pub/ssaimp/common/getRoadLine";
    return doPost(url, data);
}

export function getServiceAreaInfo(companyId) {
    const url = `/pub/ssaimp/common/getServiceAreaInfo`;
    return doGet(url, { companyId });
}

// 根据公司ID获取服务区
export function getServiceAreaFullName(orgId) {
    const url = `/pub/ssaimp/common/getServiceAreaFullName`;
    return doPost(url, { ...orgId });
}