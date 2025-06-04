/*
 * @Description:
 * @Version: 2.0
 * @Autor: wanglu
 * @Date: 2024-07-05 16:00:57
 * @LastEditors: ysl
 * @LastEditTime: 2025-06-03 10:05:56
 */
import {createApp} from "vue";
import App from "./app.vue";
import ElementPlus, {dayjs, ElSelect} from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "dayjs/locale/zh-cn";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import router from "./router";
import {convert, http, util} from "mam-base-ui";
import {isAuth} from "@/utils/authorization.js";
import {isAuthDefault} from "@/utils/authorization-default";
import judgeBtnArr from "@/utils/authorization-default-judge.js";
import merge from "lodash/merge";
import httpStatus from "./assets/constant/http-status.js";
import propertyName from "./assets/constant/property-name.js";
import commonUtil from "./assets/js/common-util.js";
import mitt from "mitt";
import "babel-polyfill";
import {createPinia} from "pinia";
import Print from 'vue3-print-nb'

//组件样式文件
import "element-plus/dist/index.css";
import "mam-base-ui/theme/common-box.css";
import "mam-base-ui/theme/common-table.css";
import "mam-base-ui/theme/pagination.css";
import "mam-base-ui/theme/search-form.css";
import "mam-base-ui/theme/tree-table.css";
import "mam-base-ui/theme/process-designer.css";
//引入highlight.js高亮代码
import highlightjs from "@highlightjs/vue-plugin";
import "highlight.js/styles/atom-one-dark-reasonable.css";
// 日期组件设置周开始为周一
dayjs.en.weekStart = 1;

//创建根实例
const app = createApp(App);
//创建createPinia()函数实例
const pinia = createPinia();
//声明组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 适配xml,json文本高亮
const hljs = require("highlight.js/lib/core");
hljs.registerLanguage("xml", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("json", require("highlight.js/lib/languages/json"));
app.use(highlightjs);

//vue3事件总线
const Mit = mitt();
app.config.globalProperties.$Bus = Mit;

// 挂载接口基础地址到应用对象
app.config.globalProperties.$baseUrl = process.env.VUE_APP_API_BASE_URL;
// 挂载登录安全开关到应用对象
app.config.globalProperties.$loginSecurityEnabled = process.env.VUE_APP_LOGIN_SECURITY_ENABLED === "true";

// 初始化 Http 组件并挂载到应用对象
http.initialize(
    { baseURL: process.env.VUE_APP_API_BASE_URL },
    {
        configHandler: (config) => {
            // 为所有请求添加请求头 'X-Client-Type'
            config.headers["X-Client-Type"] = "web";
            return config;
        },
    }
);
app.config.globalProperties.$http = http;
// 权限判断
app.config.globalProperties.isAuth = isAuth;
app.config.globalProperties.isAuthDefault = isAuthDefault;
app.config.globalProperties.judgeBtnArr = judgeBtnArr;
// 自定义检查方法
app.config.globalProperties.util = util;
app.config.globalProperties.convert = convert;

// 添加全局前置守卫
const noAuthRoutes = ["/", "/about", "/401", "/404", "/login"];
router.beforeEach(async (to) => {
    if (noAuthRoutes.includes(to.path)) {
        if (to.path === "/login") {
            let accessAuthorization = commonUtil.getAccessAuthorization();
            if (accessAuthorization && accessAuthorization[propertyName.loggedin]) {
                // 保存登录状态
                sessionStorage.setItem("isLogin", true);
                // 访问登录页面时如果已登录则跳转到主页面
                return { name: "main" };
            }
        }

        // 无需检查授权的页面直接跳转
        return true;
    }

    let accessAuthorization = commonUtil.getAccessAuthorization();
    if (!accessAuthorization || !accessAuthorization[propertyName.loggedin]) {
        // 保存登录状态
        sessionStorage.setItem("isLogin", false);
        // 访问授权页面时如果未登录则跳转到登录页面
        return { name: "login" };
    }

    // 请求路由鉴权
    let response = await http.post("/pub/common/routerAuth", { path: to.path }, null);
    if (response.data.code == httpStatus.ok) {
        if (response.data.data.status) {
            // 合并用户信息传递到目标页面
            merge(to.params, { userInfo: response.data.data.userInfo });
            let { data } = await http.get(`/pub/ssaimp/common/getRoleInfoByUserId/${response.data.data.userInfo.id}`)
            const userInfo = response.data.data.userInfo
            userInfo.roleList = data.data
            // 保存用户权限
            sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
            sessionStorage.setItem("permissions", JSON.stringify(response.data.data.userInfo.subAuthorities));
            return true;
        } else {
            console.error("路由鉴权失败");
            return { name: "401" };
        }
    } else {
        // 删除缓存的访问授权
        commonUtil.removeAccessAuthorization();

        console.error("路由鉴权异常：%s", response.data.message);
        // 保存登录状态
        sessionStorage.setItem("isLogin", false);
        return { name: "login" };
    }
});



app.use(router)
    .use(http)
    .use(pinia)
    .use(ElementPlus, {
        locale: zhCn,
    })
    .use(Print)

ElSelect.props.reserveKeyword.default = false
app.component('ElSelect',ElSelect)

app.mount("#app");
