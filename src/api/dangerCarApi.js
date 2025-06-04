// 特殊车辆管理列表数据
import { http } from "mam-base-ui";
export function getBasDangerCarList(data) {
    const url = "/bas/dangerCar/queryPage";
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
// 特殊车辆管理新增
export function getBasDangerCarAdd(data) {
    const url = "/bas/dangerCar/add";
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
// 特殊车辆管理修改
export function getBasDangerCarEdit(data) {
    const url = "/bas/dangerCar/edit";
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
// 特殊车辆管理详情
export function getBasDangerCarGet(data) {
    const url = "/bas/dangerCar/get";
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

// 特殊车辆管理删除
export function getBasDangerCarDelete(data) {
    const url = "/bas/dangerCar/delete";
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

// 特殊车辆管理图片信息
export function getFileInfo(data) {
    const url = "bas/dangerCar/getFileInfo";
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
