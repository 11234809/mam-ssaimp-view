<template>
    <div class="fwq-bg-box">
        <div class="fwq-bg-pic">
            <div class="top-logo"></div>
            <div class="bottom-box">
                <div class="left-login-box">
                    <div class="left-login-content">
                        <div class="login-title">智慧服务区综合管理平台  </div>
                        <div class="login-wariningInf">本平台为非涉密平台，严禁处理、传输国家秘密 </div> 
                        <div class="login-form">
                            <el-form :model="loginForm" @keyup.enter.native="login()">
                                <el-form-item>
                                    <el-input size="large" class="form-login-input" v-model="loginForm.username">
                                        <template #prefix>
                                            <div class="login-input-prefix">账号</div>
                                        </template>
                                        <template #suffix>
                                            <div class="login-input-suffix">
                                                <el-image style="width: 28px; height: 30px" :src="require('@/assets/images/login/login-user.png')" fit="fill" />
                                            </div>
                                        </template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-input size="large" class="form-login-input" v-model="loginForm.inputpwd" type="password" autocomplete="off">
                                        <template #prefix>
                                            <div class="login-input-prefix">密码</div>
                                        </template>
                                        <template #suffix>
                                            <div class="login-input-suffix">
                                                <el-image style="width: 25px; height: 27px" :src="require('@/assets/images/login/login-password.png')" fit="fill" />
                                            </div>
                                        </template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item v-if="$loginSecurityEnabled">
                                    <div class="login-code-box">
                                        <el-input size="large" class="form-login-input" style="width: 298px" v-model="loginForm.captcha">
                                            <template #prefix>
                                                <div class="login-input-prefix">验证码</div>
                                            </template>
                                        </el-input>
                                        <el-image class="code-image" :src="captchaUrl" @click="refreshCaptchaUrl" title="点击刷新验证码" />
                                    </div>
                                </el-form-item>
                            </el-form>
                            <span class="tip-message">{{ failedReason }}</span>
                        </div>
                        <div class="login-btn" @click="login">登录</div>
                    </div>
                </div>
                <div class="right-picture-box"></div>
            </div>
        </div>
    </div>
</template>

<script>
import encryptionAlgorithm from "../../assets/constant/encryption-algorithm.js";
import EncryptionUtil from "../../assets/js/encryption-util.js";
import httpStatus from "../../assets/constant/http-status.js";
import propertyName from "../../assets/constant/property-name.js";
import commonUtil from "../../assets/js/common-util.js";
import defaultCaptchaUrl from "../../assets/images/default-captcha.jpg";
import router from "../../router/index";

export default {
    name: "LoginView",
    data () {
        var validatePassword = (rule, value, callback) => {
            if (!this.isPasswordReg(value) || value.length < 12) {
                callback(
                    new Error("密码至少12位，需包括数字、小写字母、大写字母、特殊符号中的至少3类")
                );
            } else {
                callback();
            }
        };
        return {
            // 登录表单对象
            loginForm: {
                username: "",
                inputpwd: "",
                password: "",
                captcha: "",
                algorithm: "",
                loginSecurityEnabled: this.$loginSecurityEnabled,
            },
            // 登录表单对象
            editPswForm: {},
            editPswFormRules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名称",
                        trigger: "blur",
                    },
                ],
                inputpwd: [
                    {
                        required: true,
                        message: "请输入原密码",
                        trigger: "blur",
                    },
                ],
                newPassword: [
                    {
                        required: true,
                        message: "请输入新密码",
                        trigger: "blur",
                    },
                    { validator: validatePassword, trigger: "blur" },
                ],
                comfirmPassword: [
                    {
                        required: true,
                        message: "请确认新密码",
                        trigger: "blur",
                    },
                ],
            },
            encryptionAlgorithms: Object.values(encryptionAlgorithm),
            accessAuthorization: null,
            captchaUrl: defaultCaptchaUrl,
            failedReason: null,
            pwsFailedReason: null,
            isForm: "pswForm",
            codeImgUrl: "",
        };
    },
    created () {
        this.refreshAccessAuthorization();
    },
    methods: {
        // 刷新访问授权
        refreshAccessAuthorization () {
            if (!this.$loginSecurityEnabled) {
                // 登录安全关闭时不请求访问授权
                return;
            }

            this.$http.callbackPost(
                "/pub/nl/common/auth",
                null,
                null,
                function (result) {
                    if (result.code == httpStatus.ok) {
                        // 缓存访问授权
                        this.accessAuthorization = result.data;
                        commonUtil.saveAccessAuthorization(this.accessAuthorization);

                        // 初始验证码地址
                        this.refreshCaptchaUrl();
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
        // 刷新验证码地址
        refreshCaptchaUrl () {
            if (!this.$loginSecurityEnabled) {
                // 登录安全关闭时不请求验证码
                return;
            }

            this.captchaUrl =
                this.$baseUrl + "/pub/nl/common/captcha/graphical?t=" + new Date().getTime();
        },
        //遍历对象属性并去掉空格
        trimObjectValues (obj) {
            for (let key in obj) {
                if (typeof obj[key] === 'string') { // 确保属性值是字符串
                    obj[key] = obj[key].trim();
                }
            }
            return obj;
        },
        // 登录
        login () {
            if (this.$loginSecurityEnabled) {
                // 登录安全打开时检查访问授权是否存在
                if (this.accessAuthorization == null) {
                    return;
                }
                // 登录安全打开时对密码进行加密
                this.loginForm.password = EncryptionUtil.encryptionData(this.loginForm.inputpwd);
                this.loginForm.inputpwd = "";
            } else {
                // 登录安全关闭时保持密码不变
                this.loginForm.password = this.loginForm.inputpwd;
            }
            this.loginForm = this.trimObjectValues(this.loginForm);
            this.$http.callbackPost(
                "/pub/nl/common/login",
                this.loginForm,
                null,
                function (result) {
                    if (result.code == httpStatus.ok) {
                        if (result.data.status) {
                            if (!this.$loginSecurityEnabled) {
                                // 缓存访问授权
                                this.accessAuthorization = result.data.accessAuthorization;
                                commonUtil.saveAccessAuthorization(this.accessAuthorization);
                            }

                            if (result.data.needUpdatePassword) {
                                // 打开密码修改对话框
                                this.isForm = "editPswForm";
                            } else {
                                // 修改登录状态并更新缓存
                                this.saveLoginStatus();

                                let routerList = result.data.authResources;

                                let routList = [];

                                routerList.forEach((item) => {
                                    if (
                                        item.authId != "/home" &&
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
                                                keepAlive:
                                                    item.authId == "/workplace" || item.authId == "/sys/todo"
                                                        ? false
                                                        : true,
                                            },
                                            component: this.loadView(item.resourceAddr),
                                        });
                                    }
                                });

                                // 将菜单添加进路由
                                routList.forEach((item) => {
                                    router.addRoute("home", item);
                                });

                                sessionStorage.setItem("menuList", JSON.stringify(routList));

                                // 跳转到主页面
                                this.$router.push({ path: "/home" });
                            }
                        } else {
                            this.refreshCaptchaUrl();
                            this.failedReason = result.data.reason;
                        }
                    } else {
                        this.refreshCaptchaUrl();
                        console.log(result);
                    }
                },
                function (error) {
                    this.refreshCaptchaUrl();
                    console.log(error);
                },
                this
            );
        },
        // 确认修改密码
        submitPsw () {
            this.$refs.editPswFormRef.validate((valid) => {
                if (valid) {
                    if (his.editPswForm.newPassword !== his.editPswForm.comfirmPassword) {
                        this.$message({
                            message: "确认密码与新密码不一致",
                            type: "warning",
                        });
                    } else {
                        this.editPswForm.password = EncryptionUtil.encryptionData(
                            this.editPswForm.inputpwd
                        );
                        this.editPswForm.newPassword = EncryptionUtil.encryptionData(
                            this.editPswForm.newPassword
                        );
                        this.editPswForm.comfirmPassword = EncryptionUtil.encryptionData(
                            this.editPswForm.comfirmPassword
                        );
                        this.$http.callbackPost(
                            "/sys/user/changePassword",
                            this.editPswForm,
                            null,
                            function (result) {
                                if (result.code == 200) {
                                    this.$message({
                                        message: result.message || result.data.message,
                                        type: "success",
                                    });
                                    this.isForm = "pswForm";
                                } else {
                                    this.$message({
                                        message: result.message || result.data.message,
                                        type: "info",
                                    });
                                }
                            },
                            function (error) {
                                this.$message({ message: error, type: "error" });
                            },
                            this
                        );
                    }
                }
            });
        },
        loadView (view) {
            // 路由异步懒加载
            if (view && view.length > 0) {
                let path = view.substring(1, view.length);
                return () => import(`@/${path}`);
            } else {
                return null;
            }
        },
        // 保存登录状态
        saveLoginStatus () {
            this.accessAuthorization[propertyName.loggedin] = true;
            commonUtil.saveAccessAuthorization(this.accessAuthorization);
        },
        // 会话唯一性测试
        uniqueSession () {
            let url =
                "/test/session?token=" + encodeURIComponent(this.accessAuthorization.token);
            this.$http.callbackPost(
                url,
                null,
                { withCredentials: false },
                function (result) {
                    console.log(result);
                },
                function (error) {
                    console.log(error);
                },
                this
            );
        },
        // 密码校验
        isPasswordReg (value) {
            return /^(?![\da-z]+$)(?![\dA-Z]+$)(?![\d`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]+$)(?![a-zA-Z]+$)(?![a-z`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]+$)(?![A-Z`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]+$)[\da-zA-z`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]{1,}$/.test(
                value
            );
        },
        // 点击切换登录或者扫一扫
        formCode () {
            this.isForm = this.isForm == "pswForm" ? "scanForm" : "pswForm";
        },
        // 返回登录
        loginBack () {
            this.isForm = "pswForm";
        },
        // 修改密码
        formToEdit () {
            this.isForm = "editPswForm";
        },
    },
};
</script>

<style lang="less" scoped>
.fwq-bg-box {
    width: 100%;
    height: 100%;
    background-image: url("../../assets/images/login/login-shadow.png");
    background-repeat: no-repeat;
    background-size: 1433px 1074px;
    background-position: bottom -33px right -47px;
    display: flex;
    flex-direction: column;

    .fwq-bg-pic {
        width: 100%;
        height: 100%;
        background-image: url("../../assets/images/login/login-pic.png");
        background-repeat: no-repeat;
        background-size: 1141px 799px;
        background-position: bottom 118px right 9px;
        display: flex;
        flex-direction: column;
    }

    .top-logo {
        width: 100%;
        height: 137px;
        background-image: url("../../assets/images/logo.png");
        background-repeat: no-repeat;
        background-size: 214px 47px;
        background-position: top 45px left 53px;
    }

    .bottom-box {
        width: 100%;
        flex: 1;
        display: flex;
    }

    .left-login-box {
        width: 779px;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .left-login-content {
        width: 535px;
        height: 80%;
        display: flex;
        margin-right: 56px;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }

    .right-picture-box {
        width: calc(100% - 779px);
        height: 100%;
    }

    .login-title {
        width: 535px;
        height: 60px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 45px;
        color: #114484;
        line-height: 60px;
        text-align: center;
    }
    .login-wariningInf{
        width:  535px;
        height: 30px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 24px;
        color: red;
        line-height: 30px;
        text-align: center;
    }
    .form-login-input {
        width: 470px;
        margin-top: 70px;

        ::v-deep(.el-input__wrapper) {
            box-shadow: 0 0 0 0px
                var(--el-input-border-color, var(--el-border-color)) inset;
            cursor: default;
            font-size: 22px;
            border-bottom: 3px solid #114484;
            border-radius: 0;
            background: transparent;
            padding-bottom: 25px;

            ::v-deep(.el-input__inner) {
                cursor: default !important;
            }
        }
    }

    .login-code-box {
        width: 100%;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding-bottom: 10px;
    }

    .code-image {
        width: 160px;
        height: 69px;
    }

    .login-input-prefix {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 24px;
        color: #114484;
    }

    .login-input-suffix {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .login-btn {
        cursor: pointer;
        text-align: center;
        width: 470px;
        height: 117px;
        margin-top: 100px;
        background: #114484;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 38px;
        color: #ffffff;
        line-height: 117px;
        border-radius: 59px;
    }
}
</style>
