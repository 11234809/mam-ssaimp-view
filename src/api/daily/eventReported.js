/**
 * 事件上报数据接口文件
 */
import {doPost} from '@/utils/requestUtils'
// 查询事件上报分页列表数据
export function getQueryPage(data) {
    const url = "/daily/eventReported/queryPage";
    return doPost(url,data);
}

// 查询事件上报详情数据
export function getReportedInfoById(data) {
    const url = "/daily/eventReported/get";
    return doPost(url,data);
}

//excel文件导出
export function exportXls(data){
    const url = "/daily/eventReported/exportXls";
    return doPost(url,data);
}

//新增事件上报数据
export function addEventReported(data){
    const url = "/daily/eventReported/add";
    return doPost(url,data);
}

//修改事件上报数据
export function updateEventReported(data){
    const url = "/daily/eventReported/edit";
    return doPost(url,data);
}

//删除事件上报数据
export function deleteEventReported(data){
    const url = "/daily/eventReported/delete";
    return doPost(url,data);
}

//事件处理
export function handleEventReported(data){
    const url = "/daily/eventReported/handle";
    return doPost(url,data);
}

//结束管制
export function endControl(data){
    const url = "/daily/eventReported/endControl";
    return doPost(url,data);
}

export function getAreaConfigList(){
    const url = "/bas/areaConfig/all";
    return doPost(url,null);
}

export function getEventReportedType(){
    const url = "/public/eventType/queryTree";
    return doPost(url,null);
}