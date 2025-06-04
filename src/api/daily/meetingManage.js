/**
 * 会议管理接口文件
 */

import {doPost,doGet} from '@/utils/requestUtils'
// 会议管理分页列表数据
export function getQueryPage(data) {
    const url = "/daily/meetingManage/queryPage";
    return doPost(url,data);
}

// 会议管理新增
export function addMeetingManage(data) {
    const url = "/daily/meetingManage/add";
    return doPost(url,data);
}


//修改会议管理
export function updateMeetingManage(data) {
    const url = "/daily/meetingManage/edit";
    return doPost(url, data);
}


// 删除会议管理
export function deleteMeetingManage(data) {
    const url = `/daily/meetingManage/delete`;
    return doPost(url,data);
}

export function getFileInfo(id){
    const url = `/daily/meetingManage/getFileInfo/${id}`;
    return doGet(url);
}

