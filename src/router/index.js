/*
 * @Descripttion: 
 * @version: 
 * @Author: ysl
 * @Date: 2025-05-09 15:35:58
 * @LastEditors: ysl
 * @LastEditTime: 2025-06-03 10:37:39
 */
import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/system/login-view.vue";
import MainView from "../views/system/main-view.vue";
import BigScreen from "../views/system/big-screen/big-screen.vue";


let routes = [
    {
        path: "/",
        name: "login",
        component: LoginView
    },
    {
        path: "/bigScreen/SmartEnergyController",
        name: "bigScreen",
        component: BigScreen,
    },
    {
        path: "/about",
        name: "about",
        component: () => import(/* webpackChunkName: "about" */ "../views/about-view.vue")
    },
    {
        path: "/401",
        name: "401",
        component: () => import("../views/error/UnauthorizedErrorView.vue")
    },
    {
        path: "/404",
        name: "404",
        component: () => import("../views/error/NonExistentView.vue")
    },
    {
        path: "/home",
        name: "home",
        redirect: "/workplace",
        component: MainView,
        children: []
    },
];
let menuRoutes = [
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes: addMenuRoutes()
});

function addMenuRoutes(route, globalRoutes = []) {
    //获取菜单路由
    let rouList = JSON.parse(sessionStorage.getItem("menuList")) || [];
    if (rouList.length > 0) {
        rouList.map((item) => {
            item.name = item.resourceName,
                item.path = item.authId,
                item.component = loadView(item.resourceAddr)
        });
    }
    // 菜单路由加入主入口路由
    for (var i = 0; i < routes.length; i++) {
        if (routes[i].path == "/home") {
            routes[i].children = []
            routes[i].children = rouList
        }
    }
    return routes
}
// 路由异步懒加载
function loadView(view) {
    if (view && view.length > 0) {
        let path = view.substring(1, view.length)
        return () => import(`@/${path}`)
    } else {
        return null
    }
}

router.beforeEach((to, from, next) => {
 
    // 菜单路由
    let routeList = JSON.parse(sessionStorage.getItem("menuList")) || [];
    // 结合全局路由
    let rouList = routes.concat(routeList)
    let toIndex = rouList.findIndex((item) => item.path === to.path);
    if (toIndex == -1) {
        // 不在路由中
        next('/404');
    } else if ((rouList[toIndex].entityStatus && rouList[toIndex].showStatus) &&
        (rouList[toIndex].entityStatus != 1 || rouList[toIndex].showStatus == false)) {
        // 在菜单路由中，但无权限
        next('/401');
    }else if(to.path=="/rmt/chargeReportServiceArea"){
        next()
    } else {
        next();
    }
});
export default router;
