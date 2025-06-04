import { http } from "mam-base-ui";
import { doPost } from '@/utils/requestUtils'

// 查询服务区排名前10
export function getChargeReport(data) {
    const url = "/rmt/chargeVisualizationController/chargeReport";
    return doPost(url, data);
}

// 查询查询充电前10名
export function getServiceChargeRanking(data) {
    const url = "/rmt/chargeVisualizationController/serviceChargeRanking";
    return doPost(url, data);
}
// 查询查询充电前10名
export function getServiceChargeUsage(data) {
    const url = "/rmt/chargeVisualizationController/serviceChargeUsage";
    return doPost(url, data);
}
// 查询查询充电前10名
export function getUseRatioByTimeFrame(data) {
    const url = "/rmt/chargeVisualizationController/getUseRatioByTimeFrame";
    return doPost(url, data);
}

// 查询查询充电前10名
export function getChargeVisualizationServiceArea(data) {
    const url = "/pub/ssaimp/common/getServiceAreaFullName";
    return doPost(url, data);
}