/**
 * 服务质量监督
 */
import { doPost } from "@/utils/requestUtils";

export const saveServiceQualityApi = (data, header) => {
  return doPost("/daily/serviceQuality/add", data, header);
}

export const editServiceQualityApi = (data, header) => {
  return doPost("/daily/serviceQuality/edit", data, header);
}

export const getServiceQualityApi = (data) => {
  return doPost("/daily/serviceQuality/queryPage", data);
}

export const getServiceQualityInfoApi = (id) => {
  return doPost("/daily/serviceQuality/get", {id});
}

export const getServiceQualityTypeInfoApi = (entityId, itemType) => {
  return doPost("/daily/serviceQuality/item", {entityId, itemType});
}

export const deleteServiceQualityInfoApi = (id) => {
  return doPost("/daily/serviceQuality/delete", {id});
}