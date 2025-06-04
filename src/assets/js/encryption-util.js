/*
 * @Descripttion: 
 * @version: 
 * @Author: yangfeng
 * @Date: 2024-08-06 14:17:23
 * @LastEditors: yangfeng
 * @LastEditTime: 2024-08-09 15:33:43
 */
import CommonUtil from "./common-util";
import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";
import encryptionAlgorithm from "../constant/encryption-algorithm";

/**
 * 定义加解密工具。
 * @author yangfeng
 * @date 2024/8/6
 */
function EncryptionUtil() {
    /**
     * 加密数据。
     * @author yangfeng
     * @date 2024/8/6
     * @returns {String} 加密数据。
     */
    EncryptionUtil.prototype.encryptionData = function(data) {
        let encryptionData = null;
        if (
            process.env.VUE_APP_CRYPTO_ALGORITHM ==
            encryptionAlgorithm.aes
        ) {
            // 使用 AES 加密算法加密数据
            let key = CryptoJS.enc.Base64.parse(
                CommonUtil.getAccessAuthorization().encryptionKey
            );
            let result = CryptoJS.AES.encrypt(
                data,
                key,
                { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
            );
            encryptionData = CryptoJS.enc.Base64.stringify(
                CryptoJS.enc.Hex.parse(result.ciphertext.toString())
            );
            return encryptionData;
        } else if (
            process.env.VUE_APP_CRYPTO_ALGORITHM ==
            encryptionAlgorithm.rsa
        ) {
            // 使用 RSA 加密算法加密数据
            let encryptor = new JSEncrypt();
            encryptor.setPublicKey(CommonUtil.getAccessAuthorization().encryptionKey);
            let result = encryptor.encrypt(data);
            encryptionData = result;
            return encryptionData;
        } else {
            return encryptionData;
        }
    };
 /**
     * 解密数据。
     * @author yangfeng
     * @date 2024/8/6
     * @returns {String} 解密数据。
     */
 EncryptionUtil.prototype.decryptionData = function(data) {
    let decryptionData = null;
    if (
        process.env.VUE_APP_CRYPTO_ALGORITHM ==
        encryptionAlgorithm.aes
    ) {
        // 使用 AES 加密算法解密数据
        let key = CryptoJS.enc.Base64.parse(
            CommonUtil.getAccessAuthorization().decryptionKey
        );
        let result = CryptoJS.AES.decrypt(
            data,
            key,
            { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        );
        decryptionData = result.toString(CryptoJS.enc.Utf8);
        return decryptionData;
    } else if (
        process.env.VUE_APP_CRYPTO_ALGORITHM ==
        encryptionAlgorithm.rsa
    ) {
        // 使用 RSA 加密算法解密数据
        const decrypt = new JSEncrypt()
        decrypt.setPrivateKey(CommonUtil.getAccessAuthorization().decryptionKey)
        let result = decrypt.decrypt(data)
        decryptionData = result;
        return decryptionData;
    } else {
        return decryptionData;
    }
};
}

const EncryptionUtilInst = new EncryptionUtil();// 初始化组件实例
export default EncryptionUtilInst;// 导出组件实例
