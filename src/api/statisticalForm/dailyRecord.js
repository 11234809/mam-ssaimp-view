// 日报报表接口文件
import {doPost} from "@/utils/requestUtils";

export const queryPage = data => {
  return doPost('/statisticalForm/dailyRecord/queryPage', data)
}