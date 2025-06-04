/**
 * 新媒体报送数据接口文件
 */
import {doPost} from '@/utils/requestUtils'

// 新媒体报送分页列表数据
export function getQueryPage(data) {
    const url = "/daily/newMedia/list";
    return doPost(url,data);
}
// 新媒体报送详情数据
export function getNewMediaById(data) {
    const url = "/daily/newMedia/detail";
    return doPost(url,data);
}

//新增新媒体报送数据
export function addNewMedia(data){
    const url = "/daily/newMedia/add";
    return doPost(url,data);
}

//修改新媒体报送数据
export function updateNewMedia(data){
    const url = "/daily/newMedia/edit";
    return doPost(url,data);
}

//excel文件导出
export function exportXls(data){
    const url = "/daily/newMedia/export";
    return doPost(url,data);
}