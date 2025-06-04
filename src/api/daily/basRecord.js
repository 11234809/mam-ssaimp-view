/**
 * 专项工作执行数据接口文件
 */
import { doPost } from "@/utils/requestUtils";

// 查询专项工作执行分页列表数据
export function getBasJobRecordList(data) {
  const url = "/daily/basJobRecord/list";
  return doPost(url, data);
}
// 新增明细记录
export function addBasJobRecordDetail(data) {
  const url = "/daily/basJobRecord/addDetail_1";
  return doPost(url, data);
}
// 查看明细
export function getBasJobRecordDetail(data) {
  const url = "/daily/basJobRecord/detail";
  return doPost(url, data);
}
// 上传图片返回ID
export function addFile(data) {
  const url = "/daily/basJobRecord/addFile";
  return doPost(url, data);
}
// 删除明细
export function deleteBasJobRecordDetail(data) {
  const url = "/daily/basJobRecord/delete";
  return doPost(url, data);
}
