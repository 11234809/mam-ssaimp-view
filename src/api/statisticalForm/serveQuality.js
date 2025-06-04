import {doPost} from "@/utils/requestUtils";

export const getServeQualityApi = data => {
  return doPost('/statisticalForm/serveQuality/queryPage', data)
}