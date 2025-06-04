/**
 * 培训管理接口文件
 */

import {doPost,doGet} from '@/utils/requestUtils'
// 培训管理分页列表数据
export function getQueryPage(data) {
    const url = "/daily/trainManage/queryPage";
    return doPost(url,data);
}

// 培训管理新增
export function addTrainManage(data) {
    const url = "/daily/trainManage/add";
    return doPost(url,data);
}


//修改培训管理
export function updateTrainManage(data) {
    const url = "/daily/trainManage/edit";
    return doPost(url, data);
}


// 删除培训管理
export function deleteTrainManage(data) {
    const url = `/daily/trainManage/delete`;
    return doPost(url,data);
}

export function getFileInfo(id){
    const url = `/daily/trainManage/getFileInfo/${id}`;
    return doGet(url);
}

