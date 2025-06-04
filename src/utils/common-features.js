import { http } from "mam-base-ui";
import moment from "moment";
/**
 * 
 * @param {string} url 导出接口
 * @param {string} filename 导出文件名称
 * @param {*} data 请求参数
 */
export function exportData(url, filename, data = {}) {
  http.callbackPost(
    url,
    data,
    { responseType: "blob" },
    (result) => {
      const systemTime = moment().format("YYYYMM");
      var blob = new Blob([result]);
      var downloadElement = document.createElement("a");
      var href = window.URL.createObjectURL(blob); // 创建下载的链接
      downloadElement.href = href;
      downloadElement.download = `${filename}${systemTime}.xlsx`; // 下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); // 点击下载
      document.body.removeChild(downloadElement); // 下载完成移除元素
      window.URL.revokeObjectURL(href);
    },
    (error) => {
      console.log(error);
    }
  );
}
 
export function exportFormatData(url, filename, data = {},selectTimeType,weekFormat,jd) {
  const startOfWeek = moment().startOf('isoWeek'); // ISO周的第一天（周一）
  const endOfWeek = moment().endOf('isoWeek');  // ISO周的最后一天（周日）
  http.callbackPost(
    url,
    data,
    { responseType: "blob" },
    (result) => {
      let systemTime = data.time; //默认天
      if(selectTimeType=="0"){ //天
        systemTime = data.time;
      }else if(selectTimeType=="1"){ //周
        systemTime = weekFormat;
      } else if(selectTimeType=="2"){ //月
        systemTime = data.time;
      } else if(selectTimeType=="3"){ //季度
        systemTime = jd;
      } else if(selectTimeType=="4"){ //年
        systemTime = data.time;
      } else if(selectTimeType=="5"){ //自定义
        systemTime = data.timeList[0]+ '至' + data.timeList[1];
      } else{
        systemTime = data.time; //默认天
      }
      console.log(data,'data');
      console.log(selectTimeType,'selectTimeType');
      
      var blob = new Blob([result]);
      var downloadElement = document.createElement("a");
      var href = window.URL.createObjectURL(blob); // 创建下载的链接
      downloadElement.href = href;
      downloadElement.download = `${filename}${systemTime}.xlsx`; // 下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); // 点击下载
      document.body.removeChild(downloadElement); // 下载完成移除元素
      window.URL.revokeObjectURL(href);
    },
    (error) => {
      console.log(error);
    }
  );
}
