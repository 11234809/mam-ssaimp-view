import { http } from "mam-base-ui";
import {doPost} from "@/utils/requestUtils";
// 查询新媒体素材列表
export function getPublicSatisfyList(data) {
    const url = "/statisticalForm/publicSatisfy/total/queryPage";
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
// 查询餐饮满意度
export function getPublicSatisfyFoodList(data) {
    const url = "/statisticalForm/publicSatisfy/food/queryPage";
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
// 查询小面满意度
export function getPublicSatisfyCqxmList(data) {
    const url = "/statisticalForm/publicSatisfy/cqxm/queryPage";
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
