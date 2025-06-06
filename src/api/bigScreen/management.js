/*
 * 综合管理、智慧管理
 */
import { http } from "mam-base-ui";
import { doPost } from '@/utils/requestUtils'


// /wisdom/manage/getManage  巡检信息
// /wisdom/manage/serviceRanking  危化品车辆排名
// /wisdom/manage/serviceCarDis 危化品车辆分布
// /wisdom/manage/serviceAreaList 服务区查询
// /wisdom/manage/eventList 突发事件
// /wisdom/manage/truckHomeList 司机之家使用率
// /wisdom/manage/dataTotal 指标汇总


// 巡检信息
export function getManageInfo(data) {
    const url = "/wisdom/manage/getManage";
    return doPost(url, data);
}

//危化品车辆排名
export function getServiceRanking(data) {
    const url = "/wisdom/manage/serviceRanking";
    return doPost(url, data);
}

//危化品车辆分布
export function getServiceCarDis(data) {
    const url = "/wisdom/manage/serviceCarDis";
    return doPost(url, data);
}

//服务区查询
export function getServiceAreaList(data) {
    const url = "/wisdom/manage/serviceAreaList";
    return doPost(url, data);
}

//突发事件
export function getEventList(data) {
    const url = "/wisdom/manage/eventList";
    return doPost(url, data);
}

//司机之家使用率
export function getTruckHomeList(data) {
    const url = "/wisdom/manage/truckHomeList";
    return doPost(url, data);
}

//指标汇总
export function getDataTotal(data) {
    const url = "/wisdom/manage/dataTotal";
    return doPost(url, data);
}

// 路线
export function getRoadLineList(data) {
    const url = "/pub/ssaimp/common/getRoadLine";
    return doPost(url,data);
}

//服务器详情
export function getServiceInfo(data) {
    const url = "/bas/serviceAreaInfo/get";
    return doPost(url,data);
}