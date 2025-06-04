// 电站api
import {http} from "mam-base-ui";

// 充电桩使用情况列表
export function getChargePileUsageList(data) {
    const url = "/rmt/chargePileUsage/queryPage";
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

// 充电枪维度列表
export function getChargeReportConnectorList(data) {
    const url = "/rmt/chargeReportConnector/queryPage";
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

// 路段
export function getRoadLineTreeList(data) {
    const url = "/pub/common/base/roadLineTree";
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

// 电站列表
export function getStationList(data) {
    const url = "/pub/ssaimp/common/getStationList";
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

// 运营单位
export function getOperationList(data) {
    const url = "/pub/ssaimp/common/getOperationList";
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

// 充电站繁忙情况
export function getChargeStationBusyList(data) {
    const url = "/rmt/chargeStationBusy/queryPage";
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

// 充电站纬度
export function getChargeReportStationList(data) {
    const url = "/rmt/chargeReportStation/queryPage";
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

// 服务区
export function getChargeReportServiceAreaList(data) {
    const url = "/rmt/chargeReportServiceArea/queryPage";
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

// 充电站管理
export function getChargeStationManageAreaList(data) {
    const url = "/rmt/chargeStationManage/queryPage";
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

// 电站信息
export function getChargeStationManageDetails(data) {
    const url = "/rmt/chargeStationManage/details";
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

// 归属商户 列表
export function getChargeStationManagePullName(data) {
    const url = "/rmt/chargeStationManage/pullName";
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

// 电站-》充电枪
export function getChargeStationManageConnector(data) {
    const url = "/rmt/chargeStationManage/getStationConnector";
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

// 电站 =》充电桩
export function getChargeStationManageEquipment(data) {
    const url = "/rmt/chargeStationManage/getStationEquipment";
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

// 电价
export function getChargeStationManageChargeGun(data) {
    const url = "/rmt/chargeStationManage/getChargeGun";
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

// 充电枪随手查
export function getChargeStationManageUpdateState(data) {
    const url = "/rmt/chargeStationManage/updateState";
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

// 字典
export function getDict(data) {
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
