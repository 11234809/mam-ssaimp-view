/**
 * 通知文件发布数据接口文件
 */

import {doPost} from '@/utils/requestUtils'
// 通知文件发布分页列表数据
export function getQueryPage(data) {
    const url = "/informFile/publish/queryPage";
    return doPost(url,data);
}

// 通知文件发布详情数据
export function getInformFileById(data) {
    const url = "/informFile/publish/get";
    return doPost(url,data);
}
//新增通知文件发布数据
export function addInformFile(data){
    const url = "/informFile/publish/add";
    return doPost(url,data);
}

//修改通知文件发布数据
export function updateInformFile(data){
    const url = "/informFile/publish/edit";
    return doPost(url,data);
}

//删除通知文件发布数据
export function deleteInformFile(data){
    const url = "/informFile/publish/delete";
    return doPost(url,data);
}

export function publishInformFile(data){
    const url = "/informFile/publish/publish";
    return doPost(url,data);
}

export function getRole(){
    const url = "/pub/ssaimp/common/page";
    return doPost(url,{size:-1,index:1});
}