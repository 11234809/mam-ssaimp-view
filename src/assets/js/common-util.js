import storageKey from "../constant/storage-key.js";

/**
 * 定义通用工具。
 * @author 袁孝均
 * @date 2023/12/25
 */
function CommonUtil() {
    /**
     * 获取访问授权。
     * @author 袁孝均
     * @date 2023/12/25
     * @returns {Object} 访问授权。
     */
    CommonUtil.prototype.getAccessAuthorization = function() {
        let accessAuthorization = null;
        let json = localStorage.getItem(storageKey.accessAuthorization);
        if (json) {
            accessAuthorization = JSON.parse(json);
        }
        return accessAuthorization;
    };

    /**
     * 保存访问授权。
     * @author 袁孝均
     * @date 2023/12/25
     * @param {Object} accessAuthorization 访问授权。
     */
    CommonUtil.prototype.saveAccessAuthorization = function(accessAuthorization) {
        if (accessAuthorization) {
            localStorage.setItem(storageKey.accessAuthorization, JSON.stringify(accessAuthorization));
        }
    };

    /**
     * 删除访问授权。
     * @author 袁孝均
     * @date 2024/01/11
     */
    CommonUtil.prototype.removeAccessAuthorization = function() {
        localStorage.removeItem(storageKey.accessAuthorization);
    };
}

const commonUtilInst = new CommonUtil();    // 初始化组件实例
export default commonUtilInst;              // 导出组件实例
