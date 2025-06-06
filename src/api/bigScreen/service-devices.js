import {doPost} from '@/utils/requestUtils'

// 服务区设施
export function getServiceEquipment(data) {
    const url = "/integrate/manage/getServiceEquipment";
    return doPost(url, data);
}

// 车流量占比信息
export function getServiceCar(data) {
    const url = "/integrate/manage/getServiceCar";
    return doPost(url, data);
}

// 客流量占比信息
export function getServicePerson(data) {
    const url = "/integrate/manage/getServicePerson";
    return doPost(url, data);
}

// 充电繁忙排行
export function chargePileList(data) {
    const url = "/integrate/manage/chargePileList";
    return doPost(url, data);
}

// 经营信息
export function getServiceManage(data) {
    const url = "/integrate/manage/getServiceManage";
    return doPost(url, data);
}

// 经营收入排名
export function getIncomeList(data) {
    const url = "/integrate/manage/incomeList";
    return doPost(url, data);
}

// 综合管理-指标汇总
export function getIntegratedTotal(data) {
    const url = "/integrate/manage/integratedTotal";
    return doPost(url, data);
}

