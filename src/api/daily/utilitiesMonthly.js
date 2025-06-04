/**
 * 水电气月报数据接口文件
 */
import { doPost } from "@/utils/requestUtils";

// 水电气月报分页列表数据
export function getQueryPage(data) {
    const url = "/daily/utilitiesMonthly/list";
    return doPost(url,data);
}
// 水电气月报详情数据
export function getUtiltiesMonthlyById(data) {
    const url = "/daily/utilitiesMonthly/detail";
    return doPost(url,data);
}

//新增水电气月报数据
export function addUtiltiesMonthly(data){
    const url = "/daily/utilitiesMonthly/add";
    return doPost(url,data);
}

//修改水电气月报数据
export function updateUtiltiesMonthly(data){
    const url = "/daily/utilitiesMonthly/edit";
    return doPost(url,data);
}

//excel文件导出
export function exportXls(data){
    const url = "/daily/utilitiesMonthly/export";
    return doPost(url,data);
}