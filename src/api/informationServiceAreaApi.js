// 基础信息服务区
import { http } from "mam-base-ui";

// 获取基础信息服务区列表
export function getServiceAreaInfoList(data) {
    const url = "/bas/serviceAreaInfo/list";
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

// 获取基础信息服务区数据
export function getServiceAreaInfo(data) {
    const url = "/bas/serviceAreaInfo/get";
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


// 删除基础信息服务区数据
export function deletetServiceAreaInfo(data) {
    const url = "/bas/serviceAreaInfo/delete";
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
// 新增基础信息服务区数据
export function addServiceAreaInfo(data) {
    const url = "/bas/serviceAreaInfo/add";
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

// 编辑基础信息服务区数据
export function editServiceAreaInfo(data) {
    const url = "/bas/serviceAreaInfo/edit";
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve(error);
            }
        );
    });
}
// 充电站/充电桩上传图片
export function updateCharge(data) {
    const url = "/bas/serviceAreaInfo/updateCharge";
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve(error);
            }
        );
    });
}

// 充电桩获取服务器图片
export function getPileFileInfo(data) {
    const url = "/bas/serviceAreaInfo/getPileFileInfo";
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve(error);
            }
        );
    });
}
// 充电站获取图片
export function getStationFileInfo(data) {
    const url = "/bas/serviceAreaInfo/getStationFileInfo";
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve(error);
            }
        );
    });
}
// 汽车之家获取图片
export function getDriverFileInfo(data) {
    const url = "/bas/serviceAreaInfo/getDriverFileInfo";
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve(error);
            }
        );
    });
}
// 汽车之家上传图片
export function updateDriver(data) {
    const url = "/bas/serviceAreaInfo/updateDriver";
    return new Promise((resolve) => {
        http.callbackPost(
            url,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve(error);
            }
        );
    });
}
// 获取公司列表
export function getCompany(data) {
    const url = "/pub/ssaimp/common/getCompany";
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
// 获取新增/编辑管理公司列表
export function getOrg(data) {
    const url = "/pub/ssaimp/common/getOrg";
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
// 获取服务区列表
export function getServiceArea(data) {
    const url = "/pub/ssaimp/common/getServiceArea";
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


// 获取服务区列表
export function getServiceAreaFullName(data) {
    const url = "/pub/ssaimp/common/getServiceAreaFullName";
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

// 获取道路线列表
export function getRoadLine(data) {
    const url = "/pub/ssaimp/common/getRoadLine";
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

// 获取道路列表
export function getRoad(data) {
    const url = "/pub/ssaimp/common/getRoad";
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

//启动流程接口
export function startProcessInterface(data) {
    const url = "/bas/serviceAreaInfo/start";
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

//结束流程接口
export function processCompletedInterface(data) {
    const url = "/bas/serviceAreaInfo/complete";
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

//获取公司负责人
export function getCompanyManager(data) {
    const url = "/pub/ssaimp/common/getCompanyManager";
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

//获取公司负责人
export function getServiceArealnfoList(data) {
    const url = "/bas/serviceAreaInfo/historyProcNode";
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



