/**
 * 信息上报数据接口文件
 */

import {doPost} from '@/utils/requestUtils'
// 查询信息上报分页列表数据
export function getQueryPage(data) {
    const url = "/infoReported/queryPage";
    return doPost(url,data);
}

// 查询信息上报详情数据
export function getReportedInfoById(data) {
    const url = "/infoReported/get";
    return doPost(url,data);
}

//excel文件导出
export function exportXls(data){
    const url = "/infoReported/exportXls";
    return doPost(url,data);
}

//新增信息上报数据
export function addInfoReported(data){
    const url = "/infoReported/add";
    return doPost(url,data);
}

//修改信息上报数据
export function updateInfoReported(data){
    const url = "/infoReported/edit";
    return doPost(url,data);
}

//删除信息上报数据
export function deleteInfoReported(data){
    const url = "/infoReported/delete";
    return doPost(url,data);
}

//审批
export function approveInfoReported(data){
    const url = '/infoReported/audit/complete';
    return doPost(url,data);
}

//提交审核
export function submitInfoReported(data){
    const url = '/infoReported/start';
    return doPost(url,data);
}

//下一任审批者List
export function getNextApproverList(data){
    const url = '/infoReported/getNextHandlerList'
    return doPost(url,data);
}

//查询流程流转历史
export function getHistoryProcNode(data){
    const url = '/infoReported/histories';
    return doPost(url,data);
}

export function getUserInfo(id){
    const url = '/sys/user/get';
    return doPost(url,{
        id
    });
}