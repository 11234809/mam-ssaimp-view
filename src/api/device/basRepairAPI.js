/*
* 设备维修
* */
import { doPost } from '@/utils/requestUtils'

// 获取列表
export const basRepairListPostApi = (data) => {
  const url = '/device/basRepair/queryPage'
  return doPost(url, data)
}