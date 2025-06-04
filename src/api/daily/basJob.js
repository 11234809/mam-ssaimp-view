/**
 * 专项工作下发数据接口文件
 */
import { http } from "mam-base-ui";
import { doPost } from "@/utils/requestUtils";
// 查询专项工作下发分页列表数据
export function getBasJobList(data) {
  const url = "/daily/basJob/list";
  return doPost(url, data);
}
// 查询专项工作下发详情
export function getBasJobDetail(data) {
  const url = "/daily/basJob/detail";
  return doPost(url, data);
}
// 删除专项工作下发
export function deleteBasJob(data) {
  const url = "/daily/basJob/delete";
  return doPost(url, data);
}
// 新增专项工作下发
export function addBasJob(data) {
  const url = "/daily/basJob/add";
  return doPost(url, data);
}
// 获取公司及服务区
export function getDetailArea(data) {
  const url = "/daily/basJob/detail/area";
  return doPost(url, data);
}
// 批量导入
export function basJobImport(data) {
  const url = "/daily/basJob/import";
  return doPost(url, data);
}
// 编辑
export function editBasJob(data) {
  const url = "/daily/basJob/edit";
  return doPost(url, data);
}
// 下发
export function issuedBasJob(data) {
  const url = "/daily/basJob/issued";
  return doPost(url, data);
}
