import {http} from "mam-base-ui";
import {doPost} from '@/utils/requestUtils'

// 危化品分类
export function getDngerQueryClassChart(data) {
    const url = "/bas/dangerClassNewReport/queryClassChart";
    return doPost(url,data);
}
// 时段趋势分析
export function getQueryTimeChart(data) {
    const url = "/bas/dangerClassNewReport/queryTimeChart";
    return doPost(url,data);
}
// 路线
export function getRoadLineList(data) {
    const url = "/pub/ssaimp/common/getRoadLine";
    return doPost(url,data);
}
// 查询服务区
export function getRoadLineServiceArea(data) {
    const url = "/pub/ssaimp/common/getServiceArea";
    return doPost(url,data);
}