import { http } from "mam-base-ui";
import {doPost} from '@/utils/requestUtils'

export function getQueryPageList (data) {
    const url = "/bas/serviceCamera/queryPage";
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
//excel文件导出
export function exportXls(data){
    const url = "/bas/serviceCamera/exportXls";
    return doPost(url,data);
}
export function addData (data) {
    const url = "/bas/serviceCamera/add";
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
export function editData (data) {
    const url = "/bas/serviceCamera/edit";
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
export function deleteData (data) {
    const url = "/bas/serviceCamera/delete";
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