// 文件通知传达接口文件
import {doPost} from "@/utils/requestUtils";

export const queryPage = data => {
  return doPost('/statisticalForm/fileNotice/list', data)
}