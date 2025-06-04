/**
 * 物资列表
 */
import { doPost, doGet } from "@/utils/requestUtils";

/**
 * 物资列表-分页列表查询
 */
export function getBasGoodsList(data) {
    const url = "/device/basGoods/queryPage";
    return doPost(url, data);
}

/**
 * 物资列表-入库
 */
export function getBasGoodsSave(data) {
    const url = "/device/basGoods/save";
    return doPost(url, data);
}

/**
 * 物资列表-出库
 */
export function getBasGoodsUpdate(data) {
    const url = "/device/basGoods/update";
    return doPost(url, data);
}

/**
 * 物资列表-出库
 */
export function getCompanyInfo(serviceAreaId) {
    const url = `/device/basGoods/getCompanyInfo/${serviceAreaId}`;
    return doGet(url, {});
}