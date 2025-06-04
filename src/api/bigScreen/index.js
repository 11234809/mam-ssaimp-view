/*
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2025-05-29 11:23:19
 * @LastEditors: ysl
 * @LastEditTime: 2025-06-04 17:10:28
 */
import { http } from "mam-base-ui";
import { doPost } from '@/utils/requestUtils'

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
