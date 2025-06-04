import { http } from "mam-base-ui";
// 查询新媒体素材列表
export function getMediaMateriallList(data) {
    const url = "/statisticalForm/newMediaMaterial/list";
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
// 导出新媒体素材
export function exportNewMediaMaterial(data) {
    const url = "/statisticalForm/newMediaMaterial/export";
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


