/**
 * 设备巡检
 */
import { doPost } from "@/utils/requestUtils";

// 设备巡检列表
export function getBasRecordList(data) {
    const url = "/device/basRecord/queryPage";
    return doPost(url, data);
}