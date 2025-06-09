import { http } from "mam-base-ui";
import { doPost, doGet } from '@/utils/requestUtils'

// 查询服务区排名前10
export function getSmartEnergyLocation(data) {
    const url = "/bigScreen/SmartEnergyController/getSmartEnergyLocation";
    return doPost(url, data);
}

// 充电信息
export function getChargeInfoByTime(data) {
    const url = "/bigScreen/SmartEnergyController/getChargeInfoByTime";
    return doPost(url, data);
}

// 服务区充电降序排名
export function getChargeRankingByServiceFullName(data) {
    const url = "/bigScreen/SmartEnergyController/getChargeRankingByServiceFullName";
    return doPost(url, data);
}
// 服务区加气降序排名
export function getAirRankingByServiceFullName(data) {
    const url = "/bigScreen/SmartEnergyController/getAirRankingByServiceFullName";
    return doPost(url, data);
}

// 服务区加油车次降序排名
export function getOilCarNumberRankingByServiceFullName(data) {
    const url = "/bigScreen/SmartEnergyController/getOilCarNumberRankingByServiceFullName";
    return doPost(url, data);
}


// 服务区换电排名
export function getExNumberRankingByServiceFullName(data) {
    const url = "/bigScreen/SmartEnergyController/getExNumberRankingByServiceFullName";
    return doPost(url, data);
}

// 服务区光伏发电排名
export function getPhotovoltaicRankingByServiceFullName(data) {
    const url = "/bigScreen/SmartEnergyController/getPhotovoltaicRankingByServiceFullName";
    return doPost(url, data);
}

// GIS地图上方指标
export function getYesterdaySmartEnergyInfo(data) {
    const url = "/bigScreen/SmartEnergyController/getYesterdaySmartEnergyInfo";
    return doPost(url, data);
}

// 查询充电站详情信息
export function getSmartEnergyChargeStation(data) {
    const url = "/bigScreen/SmartEnergyController/getSmartEnergyChargeStation";
    return doPost(url, data);
}

// 查询加油站详情信息
export function getSmartEnergyOil(data) {
    const url = "/bigScreen/SmartEnergyController/getSmartEnergyOil";
    return doPost(url, data);
}

// 查询换电站详情信息
export function getSmartEnergyEX(data) {
    const url = "/bigScreen/SmartEnergyController/getSmartEnergyEX";
    return doPost(url, data);
}

// 查询加气站详情信息
export function getSmartEnergyAir(data) {
    const url = "/bigScreen/SmartEnergyController/getSmartEnergyAir";
    return doPost(url, data);
}

// 查询光伏发电详情信息
export function getSmartEnergyGF(data) {
    const url = "/bigScreen/SmartEnergyController/getSmartEnergyGF";
    return doPost(url, data);
}

//智慧服务-客流量排名

export function getTotalPeopleInfoBySa(data) {
    const url = "/bigScreen/smartSaScreen/getTotalPeopleInfoBySa";
    return doPost(url, data);
}
//智慧服务-客流量年龄分析
export function getTotalPeopleInfoByAge(data) {
    const url = "/bigScreen/smartSaScreen/getTotalPeopleInfoByAge";
    return doPost(url, data);
}
//智慧服务-车流量排名
export function getTotalCardInfoBySa(data) {
    const url = "/bigScreen/smartSaScreen/getTotalCardInfoBySa";
    return doPost(url, data);
}
//智慧服务-车流量趋势
export function getTotalCardInfoByTime(data) {
    const url = "/bigScreen/smartSaScreen/getTotalCardInfoByTime";
    return doPost(url, data);
}
//智慧服务-大屏指标
export function getTotalIndex(data) {
    const url = "/bigScreen/smartSaScreen/getTotalIndex";
    return doPost(url, data);
}
//智慧服务-满意度
export function getScreenInquireStat(data) {
    const url = "/bigScreen/smartSaScreen/getScreenInquireStat";
    return doPost(url, data);
}
//智慧服务-新能源车排名
export function getTotalNewEnergy(data) {
    const url = "/bigScreen/smartSaScreen/getTotalNewEnergy";
    return doPost(url, data);
}

// 字典查询参数
export function queryNormalOptions(data) {
    const url = "/pub/common/queryNormalOptions";
    return doPost(url, data);
}
