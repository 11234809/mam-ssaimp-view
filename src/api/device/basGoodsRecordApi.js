/*
* 出入库记录
* */
import { doPost } from '@/utils/requestUtils'

// 获取列表
export const basGoodsRecordListPostApi = (data) => {
  const url = '/device/basGoodsRecord/queryPage'
  return doPost(url, data)
}