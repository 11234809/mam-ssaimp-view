import { http } from "mam-base-ui";
// 获取物资领用列表
export function deviceIntactRateList(data) {
    const url = "/statisticalForm/deviceIntactRate/list";
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
