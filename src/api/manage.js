/*
 * @Description: 
 * @Version: 2.0
 * @Autor: wanglu
 * @Date: 2025-02-07 09:53:20
 * @LastEditors: wanglu
 * @LastEditTime: 2025-02-20 11:39:16
 */
import signMd5Utils from '../utils/signMd5Utils'
import axios from 'axios';
//get
export function getAction (url, parameter) {
    let sign = signMd5Utils.getSign(url, parameter);
    //将签名和时间戳，添加在请求接口 Header
    let signHeader = { "X-Sign": sign, "X-TIMESTAMP": signMd5Utils.getDateTimeToString() };
    return this.$http.callbackPost(
        url, parameter, signHeader
    )
}

export function downFile (url, parameter, downloadProgress) {
    return axios({
        url: url,
        params: parameter,
        method: 'get',
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
            console.log(progressEvent, '返回一个对象');
            downloadProgress(progressEvent)
        },
        // cancelToken: new CancelToken((c)=>{ //c是一个函数，调用c就可以关闭本次请求
        //   cancel = c;
        // })
    })
}
export function downFilePOST (url, parameter) {
    return axios({
        url: url,
        data: parameter,
        // params: parameter,
        method: 'post',
        responseType: 'blob'
    })
}
export function downFileGET (url, parameter) {
    return axios({
        url: url,
        params: parameter,
        method: 'get',
        responseType: 'blob'
    })
}

/**
 * 下载文件
 * @param url 文件路径
 * @param fileName 文件名
 * @param parameter
 * @returns {*}
 */
export function downloadFile (url, fileName, parameter) {
    return downFile(url, parameter).then((data) => {
        if (!data || data.size === 0) {
            Vue.prototype['$message'].warning('文件下载失败')
            return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName)
        } else {
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
        }
    })
}
