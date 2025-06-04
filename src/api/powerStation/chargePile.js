import {http} from "mam-base-ui";

// 服务区列表
export function queryServicePageList(data) {
    const url = "/rmt/serviceAreaInfo/queryServicePage";
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
// 服务区名称下拉
export function getAllServiceArea(data) {
    const url = "/rmt/serviceAreaInfo/getAllServiceArea";
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
// 平台服务区下拉
export function getServiceArea(data) {
    const url = "/rmt/serviceAreaInfo/getServiceArea";
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
// 充电设施列表
export function queryChargePageList(data) {
    const url = "/rmt/serviceAreaInfo/queryChargePage";
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

// 充电设备信息查询
export function queryChargeEquipPageList(data) {
    const url = "/rmt/serviceAreaInfo/queryChargeEquipPage";
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

//充电设备接口信息查询
export function queryChargeEquipConnectorPageList(data) {
    const url = "/rmt/serviceAreaInfo/queryChargeEquipConnectorPage";
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

// 充电站动态list
export function queryChargeEquipDynamicPageList(data) {
    const url = "/rmt/serviceAreaInfo/queryChargeEquipDynamicPage";
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



