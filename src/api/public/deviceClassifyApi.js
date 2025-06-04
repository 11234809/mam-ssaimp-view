import {doPost} from "@/utils/requestUtils";

export const addDeviceClassifyApi = (data) => {
  return doPost('/public/deviceClassify/add/old', data);
}

export const addDeviceClassifyChildApi = (data) => {
  return doPost('/public/deviceClassify/add/son', data);
}

export const editDeviceClassifyApi = (data) => {
  return doPost('/public/deviceClassify/edit', data);
}

export const getDeviceClassifyApi = data => {
  return doPost('/public/deviceClassify/queryPage', data)
}

export const getDeviceClassifyChildrenApi = entityId => {
  return doPost('/public/deviceClassify/getChild', {entityId})
}

export const getDeviceClassifyDetailAPi = id => {
  return doPost('/public/deviceClassify/get', {id})
}

export const delDeviceClassifyApi = entityId => {
  return doPost('/public/deviceClassify/detele', {entityId})
}

export const getSystemListApi = () => {
  return doPost('/device/basRecord/config/queryPage', {index: 1, size: -1})
}