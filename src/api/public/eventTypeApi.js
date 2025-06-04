import {doPost} from "@/utils/requestUtils";

export const addEventTypeApi = (data) => {
  return doPost('/public/eventType/add', data);
}

export const editEventTypeApi = (data) => {
  return doPost('/public/eventType/edit', data);
}

export const getEventTypeApi = data => {
  return doPost('/public/eventType/queryPage', data)
}

export const getEventTypeChildrenApi = pid => {
  return doPost('/public/eventType/queryChildren', {pid})
}

export const getEventTypeDetailAPi = id => {
  return doPost('/public/eventType/get', {id})
}

export const delEventTypeApi = id => {
  return doPost('/public/eventType/delete', {id})
}