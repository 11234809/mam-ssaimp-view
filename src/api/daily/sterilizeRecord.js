/**
 * 消毒记录接口文件
 */

import {doPost} from '@/utils/requestUtils'
// 查询消毒记录分页列表数据
export function getQueryPage(data) {
    const url = "/daily/sterilizeRecord/queryPage";
    return doPost(url,data);
}

// 查询消毒记录详情数据
export function getReportedInfoById(data) {
    const url = "/daily/sterilizeRecord/get";
    return doPost(url,data);
}

//excel文件导出
export function exportXls(data){
    const url = "/daily/sterilizeRecord/exportXls";
    return doPost(url,data);
}

//新增消毒记录数据
export function addSterilizeRecord(data){
    const url = "/daily/sterilizeRecord/add";
    return doPost(url,data);
}

//修改消毒记录数据
export function updateSterilizeRecord(data){
    const url = "/daily/sterilizeRecord/edit";
    return doPost(url,data);
}

//删除消毒记录数据
export function deleteSterilizeRecord(data){
    const url = "/daily/sterilizeRecord/delete";
    return doPost(url,data);
}
