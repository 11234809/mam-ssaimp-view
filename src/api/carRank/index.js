/*
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2025-05-09 15:35:45
 * @LastEditors: ysl
 * @LastEditTime: 2025-05-29 11:23:40
 */
import {http} from "mam-base-ui";
import {doPost} from '@/utils/requestUtils'

// 查询服务区排名前10
export function getServiceRanking(data) {
    const url = "/bas/carRank/serviceRanking";
    return doPost(url,data);
}
// 查询路线排名前10
export function getRoadRouteRanking(data) {
    const url = "/bas/carRank/roadRouteRanking";
    return doPost(url,data);
}
// 查询出发地/目的地排名前10
export function getPlaceRanking(data) {
    const url = "/bas/carRank/placeRanking";
    return doPost(url,data);
}

// 路线
export function getRoadLineList(data) {
    const url = "/pub/ssaimp/common/getRoadLine";
    return doPost(url,data);
}
// 查询服务区
export function getRoadLineServiceArea(data) {
    const url = "/pub/ssaimp/common/getAllServiceArea";
    return doPost(url,data);
}