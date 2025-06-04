import { http } from "mam-base-ui";
// 查询新媒体素材列表
export function getEventlList(data) {
    const url = "/statisticalForm/eventStatistical/list";
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
// 新媒体详情
export function queryEventDaily(data) {
    const url = "/statisticalForm/eventStatistical/queryEventDaily";
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