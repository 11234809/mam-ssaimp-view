/**
 * 日报记录接口文件
 */

import {doPost,doGet} from '@/utils/requestUtils'
// 日报记录分页列表数据
export function getQueryPage(data) {
    const url = "/daily/dailyIncome/queryPage";
    return doPost(url,data);
}

// 日报记录新增
export function addDailyIncome(data) {
    const url = "/daily/dailyIncome/add";
    return doPost(url,data);
}


//修改日报记录
export function updateDailyIncome(data) {
    const url = "/daily/dailyIncome/update";
    return doPost(url, data);
}


// 删除日报记录
export function deleteDailyIncome(data) {
    const url = `/daily/dailyIncome/delete`;
    return doPost(url,data);
}

// 统计结果
export function staticTotal(data){
    const url = "/daily/dailyIncome/staticTotal";
    return doPost(url,data);
}