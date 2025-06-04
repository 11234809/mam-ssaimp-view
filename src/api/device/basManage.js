/**
 * 设备管理
 */
import { doPost } from "@/utils/requestUtils";


// 设备管理分页列表数据
export function getQueryPage(data) {
    const url = "/device/manage/queryPage";
    return doPost(url, data);
}
// 设备管理详情数据
export function getBasManageById(data) {
    const url = "/device/manage/detail";
    return doPost(url, data);
}

//新增设备管理数据
export function addBasManage(data) {
    const url = "/device/manage/save";
    return doPost(url, data);
}

//修改设备管理数据
export function updateBasManage(data) {
    const url = "/device/manage/update";
    return doPost(url, data);
}


// 删除设备管理
export function deleteBasManage(data) {
    const url = `/device/manage/delete`;
    return doPost(url,data);
}

//设备类型
export function getDeviceTypeList(data) {
    const url = "/public/deviceClassify/queryPage";
    return doPost(url, data);
}