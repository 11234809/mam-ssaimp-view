<template>
  <div class="main">
    <div class="top-head">
      <div class="item left">
        <div class="head-logo">
          <el-image
            style="height: 29px; margin: 0 5px 0 0"
            :src="require('@/assets/images/logoOne.png')"
            fit="fill"
          />
        </div>
        <div class="head-title">
          <div class="head-titleInf">智慧服务区综合管理平台</div>
          <div class="head-wariningInf">
            本平台为非涉密平台，严禁处理、传输国家秘密
          </div>
        </div>
      </div>
      <div class="header-right">
        <el-button
          link
          @click="jumpMessage()"
          style="margin-right: 16px; color: #fff"
          >您当前有
          <p v-if="unReadNumber == 0" style="color: #fff">
            {{ unReadNumber }}
          </p>
          <p v-else style="color: red">{{ unReadNumber }}</p>
          条消息未读
        </el-button>
        <div class="item right">
          <el-dropdown placement="bottom">
            <el-avatar :size="30">
              <el-icon>
                <Avatar />
              </el-icon>
            </el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button link @click="logout">登出</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="login-name">{{ userName }}</div>
        </div>
        <!-- <el-button class="theme-btn" @click="setLightTheme">
                    <template v-slot:icon>
                        <img class="theme-btn-icon" src="@/assets/images/whiteTeme/switch_theme_icon.png"
                            alt="主题切换图标" />
                    </template>
                    更换主题
                </el-button> -->
      </div>
    </div>
    <div class="bottom">
      <div class="item left" v-loading="menuLoading">
        <el-scrollbar>
          <side-menu
            :defaultActive="menuName"
            :menuList="menuRouter"
            @hanldSelect="hanldSelect"
            style="height: 100%"
            class="left-menu"
          ></side-menu>
        </el-scrollbar>
      </div>
      <div class="item right" style="padding-left: 0">
        <el-tabs
          v-if="$route.meta.isTab"
          v-model="mainTabsActiveName"
          class="menu-tabs"
          closable
          editable
          @tab-click="selectedTabHandle"
          @tab-remove="removeTabHandle"
        >
          <template #add-icon>
            <el-dropdown placement="bottom" class="tab-fun">
              <el-icon>
                <Pointer />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="removeOtherTabHandle"
                    >关闭其它标签页
                  </el-dropdown-item>
                  <el-dropdown-item @click="removeAllTabHandle"
                    >关闭全部标签页
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <el-tab-pane
            v-for="item in mainTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
          </el-tab-pane>
          <div class="mian-box">
            <router-view v-slot="{ Component }">
              <keep-alive v-if="mainTabsActiveName !== '/sys/todo'">
                <component
                  :is="Component"
                  :key="$route.name"
                  v-if="$route.meta.keepAlive"
                />
              </keep-alive>
              <div v-else>
                <component
                  :is="Component"
                  :key="$route.name"
                  v-if="!$route.meta.keepAlive"
                />
              </div>
            </router-view>
          </div>
        </el-tabs>
        <template v-else>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component
                :is="Component"
                :key="$route.name"
                v-if="!$route.meta.keepAlive"
              />
            </keep-alive>
          </router-view>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import httpStatus from "../../assets/constant/http-status.js";
import commonUtil from "../../assets/js/common-util.js";
import router from "../../router/index";
import { SideMenu } from "mam-base-ui";
import emitter from "@/utils/mitt.js";

export default {
  name: "MainView",
  data() {
    return {
      userInfo: null,
      menuName: "",
      menuRouter: [],
      urlList: {
        GROUPLIST: "/sys/resource/all",
        ROUTERLIST: "/home/getMenuResource",
      },
      menuList: {},
      userName: "",
      treeGroup: [],
      menuLoading: false,
      mainTabs: [],
      mainTabsActiveName: "",
      theme: localStorage.getItem("theme") || "white", // 默认主题为深色
      headBg: {},
      unReadNumber: 0,
    };
  },
  components: {
    SideMenu,
  },
  mounted() {
    // 初始化时默认加载黑色主题
    document.documentElement.setAttribute("data-theme", this.theme);
    emitter.on("tabsCloseCurrent", () => {
      this.removeTabHandle(this.mainTabsActiveName);
    });
  },
  created() {
    this.getRoute();
    this.userInfo = this.$route.params.userInfo;
    this.userName = this.userInfo.name;
    this.$Bus.on("jumpResource", () => {
      this.getGroupList();
    });
    this.$Bus.on("jumpAgency", (data) => {
      console.log("jumpAgency",data);
      var urlARR = data.url.split("?");
      var urlStr = urlARR[0];
      this.hanldSelect(urlStr, "");
      this.$router.push({
        path: data.url,
        query: data.data,
      });
    });
    this.getUnreadMessage();
    this.$Bus.on("getUnreadMessage", () => {
      console.log("getUnreadMessage");
      this.getUnreadMessage();
    });
    this.changeHeadBg();
  },
  methods: {
    getUnreadMessage() {
      this.$http.callbackPost(
        "/bas/message/getUnreadMessage",
        null,
        null,
        function (result) {
          if (result.code == httpStatus.ok) {
            this.unReadNumber = result.data;
          } else {
            console.log(result);
          }
        },
        function (error) {
          console.log(error);
        },
        this
      );
    },
    changeHeadBg() {
      if (this.theme === "white") {
        this.headBg = {
          background: "url(" + require("../../assets/images/headBg.png") + ")",
          " background-size": "contain",
        };
      } else {
        this.headBg = {
          background: "#1C1F41",
        };
      }
    },
    setLightTheme() {
      this.theme = this.theme === "dark" ? "white" : "dark";
      document.documentElement.setAttribute("data-theme", this.theme);
      this.changeHeadBg();
      localStorage.setItem("theme", this.theme);
    },
    // 登出
    logout() {
      this.$http.callbackPost(
        "/pub/nl/common/logout",
        null,
        null,
        function (result) {
          if (result.code == httpStatus.ok) {
            commonUtil.removeAccessAuthorization(); // 删除缓存的访问授权
            sessionStorage.setItem("menuList", JSON.stringify([]));
            this.$router.push({ path: "/" }); // 跳转到登录页面
          } else {
            console.log(result);
          }
        },
        function (error) {
          console.log(error);
        },
        this
      );
    },
    hanldSelect(a, b) {
      this.menuName = a;

      this.mainTabsActiveName = a;
      const indexM = this.mainTabs.findIndex((d) => a === d.name);
      //获取刷新后路由
      this.menuList = JSON.parse(sessionStorage.getItem("menuList")) || [];
      if (indexM == -1) {
        this.menuList.forEach((item) => {
          if (item.path == a) {
            this.mainTabs.push({ name: a, title: item.name });
          }
        });
      }
    },
    getRoute() {
      var routList = [];
      routList = JSON.parse(sessionStorage.getItem("menuList")) || [];
      this.menuList = routList;

      if (this.$route.path == "/home") {
        // 默认打开界面
        this.menuName = "/workplace";
        this.$router.push({ path: "/workplace" });
      } else if (this.$route.path == "/rmt/chargeReportServiceArea") {
        this.menuName = "/rmt/chargeReportServiceArea";
        this.$router.push({ path: "/rmt/chargeReportServiceArea" });
        this.hanldSelect("/rmt/chargeReportServiceArea", "");
      } else if (this.$route.path == "/daily/dailyIncome") {
        this.menuName = "/daily/dailyIncome";
        this.$router.push({ path: "/daily/dailyIncome" });
        this.hanldSelect("/daily/dailyIncome", "");
      } else if (this.$route.path == "/bas/guestFlow") {
        this.menuName = "/bas/guestFlow";
        this.$router.push({ path: "/bas/guestFlow" });
        this.hanldSelect("/bas/guestFlow", "");
      }  else if (this.$route.path == "/statisticalForm/dailyRecord") {
        this.menuName = "/statisticalForm/dailyRecord";
        this.$router.push({ path: "/statisticalForm/dailyRecord" });
        this.hanldSelect("/statisticalForm/dailyRecord", "");
      } else if (this.$route.path == '/statisticalForm/publicSatisfy') {
        this.menuName = "/statisticalForm/publicSatisfy";
        this.$router.push({ path: "/statisticalForm/publicSatisfy" });
        this.hanldSelect("/statisticalForm/publicSatisfy", "");
      }  else if (this.$route.path == "/daily/routineInspection/manager") {
		  //巡检信息
        this.menuName = "/daily/routineInspection/manager";
        this.$router.push({ path: "/daily/routineInspection/manager" });
        this.hanldSelect("/daily/routineInspection/manager", "");
      }  else if (this.$route.path == "/daily/routineInspection/security") {
		  //巡检信息
        this.menuName = "/daily/routineInspection/security";
        this.$router.push({ path: "/daily/routineInspection/security" });
        this.hanldSelect("/daily/routineInspection/security", "");
      }  else if (this.$route.path == "/bas/carRank") {
		  //司机之家使用率排名
        this.menuName = "/bas/carRank";
        this.$router.push({ path: "/bas/carRank" });
        this.hanldSelect("/bas/carRank", "");
      }  else if (this.$route.path == "/daily/eventReported") {
		  //事件信息
        this.menuName = "/daily/eventReported";
        this.$router.push({ path: "/daily/eventReported" });
        this.hanldSelect("/daily/eventReported", "");
      } else {
        // 刷新
        this.menuName = "/workplace";
        this.$router.push({ path: "/workplace" });
      }

      // 获取资源分组
      this.getGroupList();
    },
    getGroupList() {
      // 获取资源分组
      this.$http.callbackPost(
        this.urlList.ROUTERLIST,
        null,
        null,
        function (result) {
          if (result.code == 200) {
            this.menuRouter = result.data.records;
            // 判断分组
            // this.judgeGroup();
            if (result.data.rebuildRouting) {
              let routerList = result.data.authResources;
              this.ReRoute(routerList);
            }
          } else {
            this.menuLoading = false;
            this.$message({
              message: result.message,
              type: "info",
            });
          }
        },
        function (error) {
          this.menuLoading = false;
          this.$message({ message: error, type: "error" });
        },
        this
      );
    },
    // 刷新路由
    ReRoute(routerList) {
      let routList = [];

      routerList.forEach((item) => {
        if (
          item.authId != process.env.VUE_APP_MAIN_AUTH &&
          item.entityStatus == 1 &&
          item.showStatus == true
        ) {
          routList.push({
            ...item,
            name: item.resourceName,
            path: item.authId,
            meta: {
              title: item.resourceName,
              key: item.authId,
              isTab: item.authId == "/workplace" ? false : true,
              iframeUrl: "",
              keepAlive: item.authId == "/workplace" ? false : true,
            },
            resourceAddr: item.resourceAddr,
            component: this.loadView(item.resourceAddr),
          });
        }
      });

      // 将菜单添加进路由
      routList.forEach((item) => {
        router.addRoute("home", item);
      });

      sessionStorage.setItem("menuList", JSON.stringify(routList));
    },
    loadView(view) {
      // 路由异步懒加载
      if (view && view.length > 0) {
        let path = view.substring(1, view.length);
        return () => import(`@/${path}`);
      } else {
        return null;
      }
    },
    // 判断分组
    judgeGroup() {
      if (this.treeGroup[0].children && this.treeGroup[0].children.length > 0) {
        // 菜单存在分组，多个菜单
        // 获取当前所在分组
        var groupName = "";
        // 获取分组所在位置
        var groupIndex = this.treeGroup.findIndex(
          (item) => item.resourceName === groupName
        );
        this.menuRouter = this.treeGroup[groupIndex].children;
      } else {
        // 只存在一个菜单
        this.treeGroup.map((item) => {
          this.menuRouter.push({
            ...item,
            name: item.resourceName,
            path: item.authId,
          });
        });
      }
      this.menuRouter.map((parentItem) => {
        parentItem.children = [];
      });
      this.menuRouter.map((parentItem) => {
        this.menuList.map((item) => {
          if (parentItem.groupCode == item.groupCode) {
            parentItem.children.push({
              ...item,
            });
          }
        });
      });
      this.menuLoading = false;
    },
    selectedTabHandle(tab, event) {
      tab = tab.props;
      var clickTab = this.mainTabs.filter((item) => item.name === tab.name);
      if (clickTab.length >= 1) {
        this.menuName = clickTab[0].name;
        this.$router.push({ path: clickTab[0].name });
      }
    },
    // tabs, 删除tab
    removeTabHandle(tabName) {
      this.mainTabs = this.mainTabs.filter((item) => item.name !== tabName);
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          var tab = this.mainTabs[this.mainTabs.length - 1];
          this.menuName = tab.name;
          this.mainTabsActiveName = tab.name;
          this.$router.push(
            {
              path: tab.name,
            },
            () => {
              this.mainTabsActiveName = tab.name;
            }
          );
        }
      } else {
        this.menuName = "/workplace";
        this.$router.push({ path: "/workplace" });
      }
    },
    // tabs, 关闭当前
    tabsCloseCurrentHandle() {
      this.removeTabHandle(this.mainTabsActiveName);
    },
    // tabs, 关闭其他
    removeOtherTabHandle() {
      this.mainTabs = this.mainTabs.filter(
        (item) => item.name === this.mainTabsActiveName
      );
    },
    // tabs, 关闭所有
    removeAllTabHandle() {
      this.mainTabs = [];
      this.menuName = "/workplace";
      this.$router.push({ path: "/workplace" });
    },
    jumpMessage() {
      this.$Bus.emit("jumpAgency", {
        url: "/bas/message",
        data: {},
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  background-color: var(--mainBgColor);
  background-image: var(--mainBgImg);
  background-size: cover;

  .top-head {
    height: 63px;
    padding: 8px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    // border-bottom: 1px solid var(--menuBorderColor);
    background: var(--bgMenuColor);

    .item.left {
      display: flex;
      align-items: center;
      float: left;
      text-align: left;
      font-size: 17px;
      padding-left: 10px;

      .head-titleInf {
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 20px;
        color: var(--headerTextColor);
        line-height: 22px;
        font-style: normal;
        margin-left: 10px;
      }
      .head-wariningInf {
        font-family: Microsoft YaHei;
        font-weight: normal;
        font-size: 16px;
        color: red;
        line-height: 18px;
        text-align: center;
        font-style: normal;
        margin-left: 10px;
        margin-top: 5px;
      }
    }

    .header-right {
      display: flex;

      align-items: center;

      .item.right {
        display: flex;
        padding: 0 10px 0 0;
        float: right;
        text-align: right;
        padding-right: 10px;
      }

      .login-name {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: var(--headerTextColor);
        line-height: 29px;
        text-align: left;
        font-style: normal;
        margin-left: 10px;
      }

      .theme-btn {
        width: 134px;
        height: 46px;
        border: none;
        font-size: 14px;
        color: var(--headerTextColor);

        --el-button-bg-color: none;
        --el-button-hover-border-color: none;
        --el-button-hover-bg-color: none;
        --el-button-hover-text-color: none;

        &-icon {
          width: 14px;
          height: 10px;
          filter: invert(1);
        }
      }
    }
  }

  .bottom {
    height: calc(100% - 63px);

    .item.left {
      float: left;
      width: 244px;
      height: 100%;

      background: var(--bgMenuColor);

      // border-right: 1px solid var(--menuBorderColor);
      // opacity: 0.85;
      // box-shadow: var(--boxshadow);

      :deep(.left-menu) {
        .el-menu-item,
        .el-sub-menu__title {
          &:hover {
            color: var(--textHoverColor);
          }
        }

        .side-menu-item {
          padding: 10px;
          border-radius: 4px;
        }

        --el-menu-bg-color: var(--bgGradientBodyColor);
        /* --el-menu-bg-color: red; */
        --el-menu-text-color: var(--leftMenuTextColor);
        --el-menu-hover-color: var(--tableTextColor);
        --el-menu-active-color: var(--textHoverColor);
        --el-menu-border-color: var(--bgGradientBodyColor);
        --el-menu-hover-bg-color: var(--menuHoverBgColor);
      }
    }

    .item.right {
      float: right;
      width: calc(100% - 244px);
      height: 100%;
      border-radius: 20px 0 0 20px;

      // background: var(--bgGradientBodyColor);
      background: var(--rightContentBgColor);
    }
  }
}

::v-deep(.el-tabs__nav-scroll) {
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: var(--el-border-color-light);
  }
}

::v-deep(.el-menu-item.is-active) {
  background-color: var(--menuHoverBgColor) !important;
}

::v-deep(.el-tabs__header) {
  margin: 0 !important;
  padding: 16px !important;
}

::v-deep(.el-tabs__item) {
  color: var(--tabsActiveColor) !important;

  &.is-active {
    color: var(--tabsActiveColor) !important;
  }
}

::v-deep(.el-tabs__nav-wrap)::after {
  display: none;
  content: 0;
}

.el-tabs {
  height: 100%;
}

::v-deep(.el-tabs__new-tab) {
  border: 1px solid var(--checkboxDisabvarextColor);
}

// ::v-deep(.el-tab-pane) {
//     height: calc(100% - 10px);
// }
.mian-box {
  height: calc(100% - 10px);
  overflow: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 12px;
}

::v-deep(.mian-box)::-webkit-scrollbar {
  display: none;
}

::v-deep(.el-tabs__content) {
  height: calc(100% - 72px);
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

::v-deep(.el-tabs__content)::-webkit-scrollbar {
  display: none;
}

::v-deep(.el-tabs__item) {
  color: var(--checkboxDisabvarextColor);
}

::v-deep(.el-tabs__item:hover) {
  color: var(--btnBgColor);
}

::v-deep(.el-tabs__item.is-active) {
  color: var(--btnBgColor);
}

::v-deep(.el-tabs__active-bar) {
  background-color: var(--btnBgColor);
}

::v-deep(.el-tabs__nav-wrap::after) {
  background-color: var(--checkboxDisabvarextColor);
}

.tab-fun {
  color: var(--tableTextColor);
}
</style>
