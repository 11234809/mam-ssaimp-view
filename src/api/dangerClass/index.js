import {http} from "mam-base-ui";
import {doPost} from '@/utils/requestUtils'

// 查询列表
export function getQueryPage(data) {
    const url = "/bas/dangerClass/queryPage";
    return doPost(url,data);
}
// 路线
export function getRoadLineAllList(data) {
    const url = "/base/road/line/listAll";
    return new Promise((resolve) => {
        http.callbackGet(
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
    return doPost(url,data);
}
// 查询服务区
export function getRoadLineServiceArea(data) {
    const url = "/pub/ssaimp/common/getServiceArea";
    return doPost(url,data);
}