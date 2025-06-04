import { http } from "mam-base-ui";
// 获取物资领用列表
export function serveInfo(data) {
    const url = "/statisticalForm/serveInfo/queryPage";
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
