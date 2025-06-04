/**
 * 投诉管理
 */
import { doPost } from "@/utils/requestUtils";

export const addBaseConplaintApi = (data, header) => {
  return doPost("/daily/basComplaint/add", data, header);
}

export const editBaseConplaintApi = (data, header) => {
  return doPost("/daily/basComplaint/edit", data, header);
}

export const defineBaseConplaintApi = (data, header) => {
  return doPost("/daily/basComplaint/define", data, header);
}

export const deleteBaseConplaintApi = (id) => {
  return doPost("/daily/basComplaint/delete", {id});
}

export const replyBaseConplaintApi = (data, header) => {
  return doPost("/daily/basComplaint/reply", data, header);
}

export const getBaseConplaintApi = (data) => {
  return doPost("/daily/basComplaint/queryPage", data);
}

export const getBaseConplaintInfoApi = (data) => {
  return doPost("/daily/basComplaint/get", data);
}