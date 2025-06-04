// 特殊车辆驶入情况列表数据
import { http } from "mam-base-ui";
export function getDangerCarEnterList(data) {
    const url = "/bas/dangerCarEnter/queryPage";
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