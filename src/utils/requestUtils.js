import { http } from "mam-base-ui";

// 封装公共方法doPost
export const doPost = (url, data, header = {}) => {
  return new Promise((resolve, reject) => {
    http.callbackPost(
      url,
      data,
      header,
      (result) => {
        // 请求成功，调用resolve回调
        resolve(result);
      },
      (error) => {
        // 请求失败，调用reject回调
        reject(error);
      }
    );
  });
};

// 封装GET请求
export const doGet = (url, params, header = {}) => {
  return new Promise((resolve, reject) => {
    http.callbackGet(
      url,
      params,
      header,
      (result) => {
        resolve(result);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// 封装PUT请求
export const doPut = (url, data, header = {}) => {
  return new Promise((resolve, reject) => {
    http.callbackPut(
      url,
      data,
      header,
      (result) => {
        resolve(result);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// 封装DELETE请求
export const doDelete = (url, params, header = {}) => {
  return new Promise((resolve, reject) => {
    http.callbackDelete(
      url,
      params,
      header,
      (result) => {
        resolve(result);
      },
      (error) => {
        reject(error);
      }
    );
  });
};