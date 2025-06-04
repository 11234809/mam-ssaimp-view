/**
 * 培训管理接口文件
 */

import {doPost,doGet} from '@/utils/requestUtils'
// 培训管理分页列表数据
export function getQueryPage(data) {
    const url = "/daily/emergencyDrill/list";
    return doPost(url,data);
}

// 培训管理新增
export function addEmergencyDrill(data) {
    const url = "/daily/emergencyDrill/add";
    return doPost(url,data);
}


//修改培训管理
export function updateEmergencyDrill(data) {
    const url = "/daily/emergencyDrill/edit";
    return doPost(url, data);
}


// 删除培训管理
export function deleteEmergencyDrill(data) {
    const url = `/daily/emergencyDrill/delete`;
    return doPost(url,data);
}



//培训管理明细
export function getEmergencyDrillById(data) {
    const url = "/daily/emergencyDrill/detail";
    return doPost(url, data);
}

