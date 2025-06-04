/**
 * 通知文件查看数据接口文件
 */

import {doPost} from '@/utils/requestUtils'
// 通知文件查看分页列表数据
export function getQueryPage(data) {
    const url = "/informFile/check/queryPage";
    return doPost(url,data);
}

// 通知文件查看详情数据
export function getInformFileById(data) {
    const url = "/informFile/check/get";
    return doPost(url,data);
}

// 阅读通知文件
export function readInformFile(data) {
    const url = "/informFile/check/read";
    return doPost(url,data);
}

// 反馈通知文件
export function feedbackInformFile(data) {
    const url = "/informFile/check/feed";
    return doPost(url,data);
}