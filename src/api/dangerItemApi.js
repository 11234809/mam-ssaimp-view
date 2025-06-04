/**
 * 危化品管理数据接口文件
 */
import { http } from "mam-base-ui";
// 危化品列表
export function getQueryPage(data) {
    const url = "/bas/dangerItem/queryPage";
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
// 新增
export function getDangerItemAdd(data, option) {
    const url = `/bas/dangerItem/add`;
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data,
            option,
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve(error);
            }
        );
    });
}
// 编辑
export function getDangerItemEdit(data, option) {
    const url = `/bas/dangerItem/edit`;
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data,
            option,
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve(error);
            }
        );
    });
}
// 详情
export function getDangerItemGet(data, option) {
    const url = `/bas/dangerItem/get`;
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data,
            option,
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve(error);
            }
        );
    });
}
// 删除
export function getDangerItemDelete(data, option) {
    const url = "/bas/dangerItem/delete";
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

//
// 图片文件名称获取
export function fileInfo(data, option) {
    const url = "/bas/dangerItem/getFileInfo";
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
