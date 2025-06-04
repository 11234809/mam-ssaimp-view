/**
 * 消毒区域接口文件
 */

import {doPost} from '@/utils/requestUtils'
// 查询消毒区域分页列表数据
export function getQueryPage(data) {
    const url = "/daily/sterilizeConfig/queryPage";
    return doPost(url,data);
}

// 查询消毒区域详情数据
export function getSterilizeConfigById(data) {
    const url = "/daily/sterilizeConfig/get";
    return doPost(url,data);
}

//新增消毒区域数据
export function addSterilizeConfig(data){
    const url = "/daily/sterilizeConfig/add";
    return doPost(url,data);
}

//修改消毒区域数据
export function updateSterilizeConfig(data){
    const url = "/daily/sterilizeConfig/edit";
    return doPost(url,data);
}

//删除消毒区域数据
export function deleteSterilizeConfig(data){
    const url = "/daily/sterilizeConfig/delete";
    return doPost(url,data);
}