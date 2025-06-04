<!--
 * @Descripttion: 
 * @version: 
 * @Author: yangfeng
 * @Date: 2024-07-22 11:07:56
 * @LastEditors: yangfeng
 * @LastEditTime: 2024-11-11 09:56:47
-->
<template>
    <facilitiesInfo
        ref="commonViewTable"
        :dialogWidth="dialogWidth"
        :tableHeight="tableHeight"
        :labelWidth="labelWidth"
        :formSearch="formSearch"
        :dataOption="dataOption"
        :btnArray="btnArray"
        :tableWidth="tableWidth"
        :actionArray="actionArray"
        :acticonBtnWidth="acticonBtnWidth"
        :tableFN="tableFN"
        :tbColumns="tbColumns"
        :tableData="tableData"
        :editFormList="editFormList"
        :editFormList1="editFormList1"
        :actionArray2="actionArray2"
        :isActionShow="isActionShow"
        :isCheckbox="isCheckbox"
        :isExpandAll="isExpandAll"
        :isSearch="isSearch"
        :tableDataLength="tableDataLength"
        @getTableList="getTableList"
        @hanldAddForm="hanldAddForm"
        @hanldEditTable="hanldEditTable"
        @hanldInfoTable="hanldInfoTable"
        @hanldDelTable="hanldDelTable"
        @modifyPermissions="modifyPermissions"
        @hanldsearchData="hanldsearchData"
        @fromSearchResetField="fromSearchResetField"
        @getFromSearchData="getFromSearchData"
        @eidtSelectChange="eidtSelectChange"
        @PaginationData="PaginationData"
        @handleEditFormClose="handleEditFormClose"
    >
        <template #btnslot="scope">
            <el-button
                size="small"
                v-if="isAuth('edit')"
                @click="hanldEditTable(scope.scope.scope.row)"
                type="primary"
                ><el-icon><Edit /></el-icon
            ></el-button>
            <el-button
                size="small"
                v-if="isAuth('del')"
                @click="hanldDelTable(scope.scope.scope.row)"
                type="danger"
                ><el-icon><Delete /></el-icon
            ></el-button>
        </template>
    </facilitiesInfo>
</template>
<script>
import facilitiesInfo from "../../../components/lib/facilities-info/index.js";
// import "mam-base-ui/theme/facilitiesInfo.css";

export default {
    name: "facilitiesInfoView",
    components: {
        facilitiesInfo,
    },
    data() {
        return {
            dialogWidth: 600,
            tableHeight: "454",
            labelWidth: 120,
            btnArray: ["add"],
            tableWidth: "100%",
            actionArray: ["info"],
            acticonBtnWidth: 160,
            formSearch: {
                labelWidth: "140px",
                buttonWidth: "420px",
                seizeWidth: "280px",
                seizeBumber: {
                    1920: 2, //1920，1080
                    2560: 1, //2560，1440
                    1706: 1, //2560的1.5倍数    1706，960
                    1600: 1, //1600，900
                    1440: 1, //1440，1080
                    1366: 1, //1366，768
                    1280: 0, //1280，960
                },
                formItemList: [
                    {
                        type: "INPUT",
                        label: "机电设施名称",
                        value: "",
                        itemId: "facilitiesName",
                        width: 280,
                        placeholder: "请输入机电设施名称",
                    },
                    {
                        type: "SELECT",
                        label: "设施类型",
                        message: "请选择设施类型",
                        value: "",
                        itemId: "facilitiesType",
                        width: 280,
                        isSearch: true,
                        placeholder: "请选择设施类型",
                        optionList: [],
                    },
                    {
                        type: "SELECT",
                        label: "自动运行状态",
                        message: "请选择自动运行状态",
                        value: "",
                        itemId: "runningState",
                        width: 280,
                        isSearch: true,
                        placeholder: "请选择自动运行状态",
                        optionList: [],
                    },
                    {
                        type: "INPUT",
                        label: "所属结构物名称",
                        value: "",
                        itemId: "structureName",
                        width: 280,
                        placeholder: "请输入所属结构物名称",
                    },
                ],
            },
            dataOption: {
                queriers: [
                    { alias: "runningStateDictionary", param: null },
                    { alias: "facilitiesTypeDictionary", param: null },
                    { alias: "cityCodeDictionary", param: null },
                ],
            },
            tableFN: {
                LIST: "/serv/facilities/info/queryPage",
                ADD: "/serv/facilities/info/add",
                EDIT: "/serv/facilities/info/edit",
                DELECT: "/serv/facilities/info/delete",
                INFO: "/serv/facilities/info/get",
                authResource: "/sys/role/authResource",
                selectResource: "/sys/role/selectResourceByRole",
                getResourceItem: "/sys/resource/getResourceItem",
                SELECT: "/pub/common/queryNormalOptions",
                ORGSELECT: "/pub/common/listOrgTree",
                STRUCTURESELECT: "/pub/common/base/structListAll",
                DOWNFILE: "/pub/common/file/download",
                CODE: "/serv/facilities/info/getCode",
            },
            tbColumns: [
                {
                    label: "机电设施名称", //列名
                    dataIndex: "facilitiesName", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "left",
                },
                {
                    label: "所属结构物", //列名
                    dataIndex: "structureName", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "center",
                    width: 150,
                },
                {
                    label: "桩号", //列名
                    dataIndex: "stationNumber", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "left",
                    width: 80,
                },
                {
                    label: "经度", //列名
                    dataIndex: "facilitiesLat", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "left",
                    width: 80,
                },
                {
                    label: "纬度", //列名
                    dataIndex: "facilitiesLng", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "left",
                    width: 80,
                },
                {
                    label: "启用时间", //列名
                    dataIndex: "activationTime", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "center",
                    width: 120,
                },
                {
                    label: "设施类型", //列名
                    dataIndex: "facilitiesType", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "center",
                    width: 100,
                    formatter: this.getValueName,
                },
                {
                    label: "设施规格型号", //列名
                    dataIndex: "facilitiesModel", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "left",
                    width: 200,
                },
                {
                    label: "自动运行状态", //列名
                    dataIndex: "runningState", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "center",
                    width: 110,
                    formatter: this.getValueName2,
                },
                {
                    label: "自动运行参数", //列名
                    dataIndex: "runningParameter", //和数据属性对应
                    sortable: false, //是否排序
                    fixed: false, //是否固定列
                    align: "left",
                    width: 200,
                },
            ],
            tableData: [],
            editFormList: [],
            editFormList1: [
                {
                    type: "INPUT",
                    label: "基础设施名称",
                    required: true,
                    message: "请填写基础设施名称",
                    value: "",
                    itemId: "facilitiesName",
                    width: 280,
                    placeholder: "请填写基础设施名称",
                },
                {
                    type: "SELECT",
                    label: "所属结构物",
                    required: true,
                    message: "请选择所属结构物",
                    value: "",
                    itemId: "structureId",
                    width: 280,
                    isSearch: true,
                    placeholder: "请选择所属结构物",
                    optionList: [],
                },
                {
                    type: "SELECT",
                    label: "城市区域编码",
                    required: true,
                    message: "请选择城市编码",
                    value: "",
                    itemId: "cityCode",
                    width: 280,
                    isSearch: true,
                    placeholder: "请选择城市编码",
                    optionList: [],
                },
                {
                    type: "INPUT",
                    label: "设施编码",
                    message: "系统自动生成",
                    value: "",
                    disabled: true,
                    itemId: "facilitiesCode",
                    width: 280,
                },
                {
                    type: "INPUT",
                    label: "机电码",
                    message: "系统自动生成",
                    value: "",
                    disabled: true,
                    itemId: "elecCode",
                    width: 280,
                },
                {
                    type: "INPUT",
                    label: "桩号",
                    required: true,
                    message: "请填写桩号",
                    value: "",
                    itemId: "stationNumber",
                    width: 280,
                    placeholder: "请填写桩号",
                },
                {
                    type: "INPUT",
                    label: "经度",
                    required: true,
                    message: "请填写经度",
                    value: "",
                    itemId: "facilitiesLat",
                    width: 280,
                    placeholder: "请填写经度",
                },
                {
                    type: "INPUT",
                    label: "纬度",
                    required: true,
                    message: "请填写纬度",
                    value: "",
                    itemId: "facilitiesLng",
                    width: 280,
                    placeholder: "请填写纬度",
                },
                {
                    type: "TIME",
                    label: "启用时间",
                    required: true,
                    message: "请填写启用时间",
                    format: "YYYY-MM-DD",
                    valueFormat: "YYYY-MM-DD",
                    value: "",
                    itemId: "activationTime",
                    width: 280,
                    placeholder: "请填写启用时间",
                },
                {
                    type: "SELECT",
                    label: "设施类型",
                    required: true,
                    message: "请选择设施类型",
                    value: "",
                    itemId: "facilitiesType",
                    width: 280,
                    isSearch: true,
                    placeholder: "请选择设施类型",
                    optionList: [],
                },
                {
                    type: "INPUT",
                    label: "设施规格型号",
                    required: true,
                    message: "请填写设施规格型号",
                    value: "",
                    itemId: "facilitiesModel",
                    width: 280,
                    placeholder: "请填写设施规格型号",
                },
                {
                    type: "SELECT",
                    label: "自动运行状态",
                    required: true,
                    message: "请选择自动运行状态",
                    value: "",
                    itemId: "runningState",
                    width: 280,
                    isSearch: true,
                    placeholder: "请选择自动运行状态",
                    optionList: [],
                },
                {
                    type: "INPUT",
                    label: "自动运行参数",
                    required: true,
                    message: "请填写自动运行参数",
                    value: "",
                    itemId: "runningParameter",
                    width: 280,
                    placeholder: "请填写自动运行参数",
                },
                // { 占位
                //     type: "HIDDEN",
                //     width: 580,
                // },
            ],
            editFormList2: [
                {
                    type: "INPUT",
                    label: "基础设施名称",
                    required: true,
                    message: "请填写基础设施名称",
                    value: "",
                    itemId: "facilitiesName",
                    width: 280,
                    placeholder: "请填写基础设施名称",
                },
                {
                    type: "SELECT",
                    label: "所属结构物",
                    required: true,
                    message: "请选择所属结构物",
                    value: "",
                    itemId: "structureId",
                    width: 280,
                    isSearch: true,
                    placeholder: "请选择所属结构物",
                    optionList: [],
                },
                {
                    type: "SELECT",
                    label: "城市区域编码",
                    required: true,
                    message: "请选择城市编码",
                    value: "",
                    itemId: "cityCode",
                    width: 280,
                    isSearch: true,
                    placeholder: "请选择城市编码",
                    optionList: [],
                },
                {
                    type: "INPUT",
                    label: "设施编码",
                    message: "系统自动生成",
                    value: "",
                    disabled: true,
                    itemId: "facilitiesCode",
                    width: 280,
                },
                {
                    type: "INPUT",
                    label: "机电码",
                    message: "系统自动生成",
                    value: "",
                    disabled: true,
                    itemId: "elecCode",
                    width: 280,
                },
                {
                    type: "INPUT",
                    label: "桩号",
                    required: true,
                    message: "请填写桩号",
                    value: "",
                    itemId: "stationNumber",
                    width: 280,
                    placeholder: "请填写桩号",
                },
                {
                    type: "INPUT",
                    label: "经度",
                    required: true,
                    message: "请填写经度",
                    value: "",
                    itemId: "facilitiesLat",
                    width: 280,
                    placeholder: "请填写经度",
                },
                {
                    type: "INPUT",
                    label: "纬度",
                    required: true,
                    message: "请填写纬度",
                    value: "",
                    itemId: "facilitiesLng",
                    width: 280,
                    placeholder: "请填写纬度",
                },
                {
                    type: "TIME",
                    label: "启用时间",
                    required: true,
                    message: "请填写启用时间",
                    format: "YYYY-MM-DD",
                    valueFormat: "YYYY-MM-DD",
                    value: "",
                    itemId: "activationTime",
                    width: 280,
                    placeholder: "请填写启用时间",
                },
                {
                    type: "SELECT",
                    label: "设施类型",
                    required: true,
                    message: "请选择设施类型",
                    value: "",
                    itemId: "facilitiesType",
                    width: 280,
                    isSearch: true,
                    placeholder: "请选择设施类型",
                    optionList: [],
                },
                {
                    type: "INPUT",
                    label: "设施规格型号",
                    required: true,
                    message: "请填写设施规格型号",
                    value: "",
                    itemId: "facilitiesModel",
                    width: 280,
                    placeholder: "请填写设施规格型号",
                },
                {
                    type: "SELECT",
                    label: "自动运行状态",
                    required: true,
                    message: "请选择自动运行状态",
                    value: "",
                    itemId: "runningState",
                    width: 280,
                    isSearch: true,
                    placeholder: "请选择自动运行状态",
                    optionList: [],
                },
                {
                    type: "INPUT",
                    label: "自动运行参数",
                    required: true,
                    message: "请填写自动运行参数",
                    value: "",
                    itemId: "runningParameter",
                    width: 280,
                    placeholder: "请填写自动运行参数",
                },
                {
                    type: "IMAGE",
                    label: "机电场所码",
                    message: "请填写机电场所码",
                    value: "",
                    itemId: "siteCodeShow",
                    boxWidth: 280,
                    boxHeight: 100,
                    imgWidth: 100,
                    imgHeight: 100,
                    placeholder: "请填写机电场所码",
                },
            ],

            treeData: [],
            actionArray2: [], //操作按钮
            isActionShow: true, //是否显示操作按钮
            isCheckbox: true, //是否多选
            isExpandAll: false, //是否展开
            isSearch: false, //是否开启搜索
            authRoleData: {},
            authAllData: {},
            tableDataLength: 0,
            facilitiesTypeList: [],
            runningStateList: [],
            cityCodeList: [],
            searchDataList: {},
            selectStructureId: "",
            selectCityCode: "",
            defaultStructureId: "",
            defaultCityCode: "",
            defaultFacilitiesCode: "",
            defaultElecCode: "",
        };
    },
    created() {
        this.getSelect();
        this.hanldselectList();
        this.getTableList();
        this.judgeFacilitiesInfoBtnArr();
        this.actionArray = this.judgeBtnArr.tableBtnArr(this.actionArray);
        this.btnArray = this.judgeBtnArr.groupBtnArr(this.btnArray);
    },
    methods: {
        // 判断默认增删改按钮权限是否显示
        judgeFacilitiesInfoBtnArr() {
            let btnArr = this.$route.params.userInfo.subAuthorities;
            // 判断table按钮
            let beforActionArray = this.actionArray;
            let afterActionArray = this.isAuthDefault(btnArr, this.actionArray);
            // 存在查看按钮时，在过滤后数组中加入查询权限
            if (beforActionArray.includes("info")) {
                let infoArr = ["info"];
                this.actionArray = [
                    ...new Set(afterActionArray.concat(infoArr)),
                ];
            }
            // 判断按钮组
            let beforBtnArray = this.btnArray;
            let afterBtnArray = this.isAuthDefault(btnArr, this.btnArray);
            if (beforBtnArray.length > 0 && afterBtnArray.length == 0) {
                this.btnArray = ["null"];
            } else {
                this.btnArray = afterBtnArray;
            }
            // 定时任务新增按钮权限同编辑权限
            if (afterActionArray.includes("edit")) {
                let editArr = ["add"];
                this.btnArray = [...new Set(this.btnArray.concat(editArr))];
            }
        },
        // 获取性别名称值
        getValueName(row) {
            let index = this.facilitiesTypeList.findIndex(
                (item) => item.code === row.facilitiesType
            );
            return index !== -1 ? this.facilitiesTypeList[index].name : "";
        },
        // 获取性别名称值
        getValueName2(row) {
            let index = this.runningStateList.findIndex(
                (item) => item.code === row.runningState
            );
            return index !== -1 ? this.runningStateList[index].name : "";
        },
        getSelect() {
            this.$http.callbackPost(
                this.tableFN.STRUCTURESELECT,
                {},
                null,
                function (result) {
                    if (result.code == 200) {
                        // 添加
                        let editSelectList = JSON.parse(
                            JSON.stringify(this.editFormList1)
                        );
                        editSelectList.map((item) => {
                            if (item.itemId == "structureId") {
                                item.optionList = result.data.records;
                                item.optionList.forEach((item) => {
                                    item["label"] = item.structureName;
                                    item["value"] = item.entityId;
                                });
                            }
                        });
                        this.editFormList1 = editSelectList;
                        // 编辑
                        let editSelectList2 = JSON.parse(
                            JSON.stringify(this.editFormList2)
                        );
                        editSelectList2.map((item) => {
                            if (item.itemId == "structureId") {
                                item.optionList = result.data.records;
                                item.optionList.forEach((item) => {
                                    item["label"] = item.structureName;
                                    item["value"] = item.entityId;
                                });
                            }
                        });
                        this.editFormList2 = editSelectList2;

                        let formSearchList = JSON.parse(
                            JSON.stringify(this.formSearch.formItemList)
                        );
                        formSearchList.map((item) => {
                            if (item.itemId == "structureId") {
                                item.optionList = result.data.records;
                                item.optionList.forEach((item) => {
                                    item["label"] = item.structureName;
                                    item["value"] = item.entityId;
                                });
                            }
                        });
                        this.formSearch.formItemList = formSearchList;
                    } else {
                        this.$message({
                            message: result.message,
                            type: "info",
                        });
                    }
                },
                function (error) {
                    this.$message({ message: error, type: "error" });
                },
                this
            );
        },
        getTableList(data) {
            let searchData = {
                index: this.page,
                size: this.limit,
                orderAsc: false,
            };
            if (data) {
                data = { ...data, ...searchData };
            } else {
                data = searchData;
            }
            this.$http.callbackPost(
                this.tableFN.LIST,
                data,
                null,
                function (result) {
                    if (result.code == 200) {
                        this.tableData = result.data.records;
                        this.tableDataLength = result.data.total;
                        this.$nextTick(() => {
                            this.$refs.commonViewTable.getNewTableList();
                        });
                    } else {
                        this.$message({
                            message: result.message,
                            type: "info",
                        });
                    }
                },
                function (error) {
                    this.$message({ message: error, type: "error" });
                },
                this
            );
        },
        hanldAddForm() {
            this.showEditform = true;
            let formType = "add";
            let rowInf = {
                roleName: "",
                roleOrg: "",
                roleRemark: "",
            };
            this.editFormList = this.editFormList1;

            this.$nextTick(() => {
                this.$refs.commonViewTable.toHanldAddForm(
                    this.tableFN.ADD,
                    formType,
                    rowInf,
                    "机电设施基础数据"
                );
            });
        },
        hanldEditTable(row) {
            this.showEditform = true;
            let formType = "edit";
            this.editFormList = this.editFormList2;
            let rowInf = {};
            this.$http.callbackPost(
                this.tableFN.INFO,
                {
                    id: row.entityId ? row.entityId : "",
                },
                null,
                function (result) {
                    if (result.code == 200) {
                        rowInf = result.data;
                        if (rowInf.siteCode) {
                            // 基本信息 - 场所码
                            rowInf.siteCodeShow =
                                // process.env.VUE_APP_API_HOST_URL +
                                this.$baseUrl +
                                this.tableFN.DOWNFILE +
                                "?service=servFacilitiesInfoServiceImpl&id=" +
                                rowInf.entityId;
                        } else {
                            rowInf.siteCodeShow = "";
                        }
                        this.$nextTick(() => {
                            this.$refs.commonViewTable.toHanldEditTable(
                                this.tableFN.EDIT,
                                formType,
                                rowInf,
                                "机电设施基础数据"
                            );
                        });
                        this.selectStructureId = rowInf.structureId;
                        this.selectCityCode = rowInf.cityCode;
                        // 初始结构物编码
                        this.defaultStructureId = rowInf.structureId;
                        // 初始城市编码
                        this.defaultCityCode = rowInf.cityCode;
                        // 初始设施编码
                        this.defaultFacilitiesCode = rowInf.facilitiesCode;
                        // 初始机电吗
                        this.defaultElecCode = rowInf.elecCode;
                    } else {
                        this.$message({
                            message: result.message,
                            type: "info",
                        });
                    }
                },
                function (error) {
                    this.$message({ message: error, type: "error" });
                },
                this
            );
        },
        hanldInfoTable(row) {
            this.showEditform = true;
            let formType = "info";
            let rowInf = {};
            this.editFormList = this.editFormList2;

            this.$http.callbackPost(
                this.tableFN.INFO,
                {
                    id: row.entityId ? row.entityId : "",
                },
                null,
                function (result) {
                    if (result.code == 200) {
                        rowInf = result.data;
                        if (rowInf.siteCode) {
                            // 基本信息 - 场所码
                            rowInf.siteCodeShow =
                                this.$baseUrl +
                                this.tableFN.DOWNFILE +
                                "?service=servFacilitiesInfoServiceImpl&id=" +
                                rowInf.entityId;
                        } else {
                            rowInf.siteCodeShow = "";
                        }
                        this.$nextTick(() => {
                            this.$refs.commonViewTable.toHanldInfoTable(
                                this.tableFN.INFO,
                                formType,
                                rowInf,
                                "机电设施基础数据"
                            );
                        });
                    } else {
                        this.$message({
                            message: result.message,
                            type: "info",
                        });
                    }
                },
                function (error) {
                    this.$message({ message: error, type: "error" });
                },
                this
            );
        },
        hanldDelTable(row) {
            row = JSON.parse(JSON.stringify(row));
            this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    this.loading = true;
                    this.$http.callbackPost(
                        this.tableFN.DELECT,
                        {
                            id: row.entityId ? row.entityId : "",
                        },
                        null,
                        function (result) {
                            if (result.code == 200) {
                                this.$message({
                                    message: result.data.message,
                                    type: "success",
                                });
                                this.getTableList();
                            } else {
                                this.$message({
                                    message: result.message,
                                    type: "info",
                                });
                            }
                        },
                        function (error) {
                            this.$message({ message: error, type: "error" });
                        },
                        this
                    );
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        modifyPermissions(row) {
            row = JSON.parse(JSON.stringify(row));
            this.$confirm("此操作将修改该用户权限, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    this.$http.callbackPost(
                        this.tableFN.selectResource,
                        {
                            roleId: row.entityId ? row.entityId : "",
                        },
                        null,
                        function (result) {
                            if (result.code == 200) {
                                this.authRoleData = result.data.records;
                                this.$http.callbackPost(
                                    this.tableFN.getResourceItem,
                                    {},
                                    null,
                                    function (result) {
                                        if (result.code == 200) {
                                            this.authAllData =
                                                result.data.records;
                                            this.treeData = result.data.records;
                                            this.$nextTick(() => {
                                                this.$refs.commonViewTable.toHanldAddForm2(
                                                    row.entityId
                                                        ? row.entityId
                                                        : "",
                                                    this.tableFN.authResource,
                                                    this.authAllData,
                                                    this.authRoleData
                                                );
                                            });
                                        } else {
                                            this.$message({
                                                message:
                                                    result.message ||
                                                    result.data.message,
                                                type: "info",
                                            });
                                        }
                                    },
                                    function (error) {
                                        this.$message({
                                            message: error,
                                            type: "error",
                                        });
                                    },
                                    this
                                );
                            } else {
                                this.$message({
                                    message:
                                        result.message || result.data.message,
                                    type: "info",
                                });
                            }
                        },
                        function (error) {
                            this.$message({
                                message: error,
                                type: "error",
                            });
                        },
                        this
                    );
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        // 获取分页数据
        PaginationData(data) {
            this.page = data.page;
            this.limit = data.limit;
            this.getTableList(this.searchDataList);
        },
        // 获取返回搜索栏下拉框数据
        hanldsearchData(data) {
            if (data) {
                // 查询 - 任务分组
                // 添加
                let editSelectList = JSON.parse(
                    JSON.stringify(this.editFormList1)
                );
                editSelectList.map((item) => {
                    if (item.itemId == "facilitiesType") {
                        item.optionList = data.facilitiesTypeDictionary;
                        if (data.facilitiesTypeDictionary) {
                            this.facilitiesTypeList =
                                data.facilitiesTypeDictionary;
                            item.optionList.forEach((item) => {
                                item["label"] = item.name;
                                item["value"] = item.code;
                            });
                        }
                    }
                    if (item.itemId == "runningState") {
                        this.runningStateList = data.runningStateDictionary;
                        item.optionList = data.runningStateDictionary;
                        if (data.runningStateDictionary) {
                            item.optionList.forEach((item) => {
                                item["label"] = item.name;
                                item["value"] = item.code;
                            });
                        }
                    }
                    if (item.itemId == "cityCode") {
                        this.cityCodeList = data.cityCodeDictionary;
                        item.optionList = data.cityCodeDictionary;
                        if (data.cityCodeDictionary) {
                            item.optionList.forEach((item) => {
                                item["label"] = item.name;
                                item["value"] = item.code;
                            });
                        }
                    }
                });
                this.editFormList1 = editSelectList;
                //编辑
                let editSelectList2 = JSON.parse(
                    JSON.stringify(this.editFormList2)
                );
                editSelectList2.map((item) => {
                    if (item.itemId == "facilitiesType") {
                        item.optionList = data.facilitiesTypeDictionary;
                        if (data.facilitiesTypeDictionary) {
                            this.facilitiesTypeList =
                                data.facilitiesTypeDictionary;
                            item.optionList.forEach((item) => {
                                item["label"] = item.name;
                                item["value"] = item.code;
                            });
                        }
                    }
                    if (item.itemId == "runningState") {
                        this.runningStateList = data.runningStateDictionary;
                        item.optionList = data.runningStateDictionary;
                        if (data.runningStateDictionary) {
                            item.optionList.forEach((item) => {
                                item["label"] = item.name;
                                item["value"] = item.code;
                            });
                        }
                    }
                    if (item.itemId == "cityCode") {
                        this.cityCodeList = data.cityCodeDictionary;
                        item.optionList = data.cityCodeDictionary;
                        if (data.cityCodeDictionary) {
                            item.optionList.forEach((item) => {
                                item["label"] = item.name;
                                item["value"] = item.code;
                            });
                        }
                    }
                });
                this.editFormList2 = editSelectList2;

                let formSearchList = JSON.parse(
                    JSON.stringify(this.formSearch.formItemList)
                );
                formSearchList.map((item) => {
                    if (item.itemId == "facilitiesType") {
                        this.facilitiesTypeList = data.facilitiesTypeDictionary;
                        item.optionList = data.facilitiesTypeDictionary;
                        if (data.facilitiesTypeDictionary) {
                            item.optionList.forEach((item) => {
                                item["label"] = item.name;
                                item["value"] = item.code;
                            });
                        }
                    }
                    if (item.itemId == "runningState") {
                        this.runningStateList = data.runningStateDictionary;
                        item.optionList = data.runningStateDictionary;
                        if (data.runningStateDictionary) {
                            item.optionList.forEach((item) => {
                                item["label"] = item.name;
                                item["value"] = item.code;
                            });
                        }
                    }
                    if (item.itemId == "cityCode") {
                        this.cityCodeList = data.cityCodeDictionary;
                        item.optionList = data.cityCodeDictionary;
                        if (data.cityCodeDictionary) {
                            item.optionList.forEach((item) => {
                                item["label"] = item.name;
                                item["value"] = item.code;
                            });
                        }
                    }
                });
                this.formSearch.formItemList = formSearchList;
            }
        },
        // 获取搜索栏下拉框数据方法
        hanldselectList() {
            this.$nextTick(() => {
                this.$refs.commonViewTable.getTopURL();
            });
        },
        // 表单重置
        fromSearchResetField() {
            this.searchDataList = {};
            this.getTableList();
        },
        // 表单搜索
        getFromSearchData(data) {
            this.searchDataList = data;
            this.getTableList(data);
        },
        // 下拉框变化触发
        eidtSelectChange(data, value, type) {
            // 下拉框选择变化时
            if (data.itemId == "structureId") {
                this.selectStructureId = value;
                if (
                    this.selectStructureId !== "" &&
                    this.selectCityCode !== ""
                ) {
                    if (
                        this.defaultStructureId == value &&
                        this.defaultCityCode == this.selectCityCode
                    ) {
                        this.$refs.commonViewTable.toResetData(
                            "facilitiesCode",
                            this.defaultFacilitiesCode
                        );
                        this.$refs.commonViewTable.toResetData(
                            "elecCode",
                            this.defaultElecCode
                        );
                    } else {
                        this.getCode(
                            this.selectStructureId,
                            this.selectCityCode
                        );
                    }
                } else {
                    this.$refs.commonViewTable.toResetData(
                        "facilitiesCode",
                        ""
                    );
                    this.$refs.commonViewTable.toResetData("elecCode", "");
                }
            }
            if (data.itemId == "cityCode") {
                this.selectCityCode = value;
                if (
                    this.selectStructureId !== "" &&
                    this.selectCityCode !== ""
                ) {
                    if (
                        this.defaultStructureId == this.selectStructureId &&
                        this.defaultCityCode == value
                    ) {
                        this.$refs.commonViewTable.toResetData(
                            "facilitiesCode",
                            this.defaultFacilitiesCode
                        );
                        this.$refs.commonViewTable.toResetData(
                            "elecCode",
                            this.defaultElecCode
                        );
                    } else {
                        this.getCode(
                            this.selectStructureId,
                            this.selectCityCode
                        );
                    }
                } else {
                    this.$refs.commonViewTable.toResetData(
                        "facilitiesCode",
                        ""
                    );
                    this.$refs.commonViewTable.toResetData("elecCode", "");
                }
            }
        },
        // 获取设施编码/机电吗
        getCode(id, code) {
            this.$http.callbackPost(
                this.tableFN.CODE,
                { id: id, selectCityCode: code },
                null,
                function (result) {
                    if (result.code == 200) {
                        this.$nextTick(() => {
                            let elecCode =result.data.elecCode    // 去掉区县代码
                                // this.selectCityCode + result.data.elecCode;
                            this.$refs.commonViewTable.toResetData(
                                "facilitiesCode",
                                result.data.facilitiesCode
                            );
                            this.$refs.commonViewTable.toResetData(
                                "elecCode",
                                elecCode
                            );
                        });
                    } else {
                        this.$message({
                            message: result.message,
                            type: "info",
                        });
                    }
                },
                function (error) {
                    this.$message({ message: error, type: "error" });
                },
                this
            );
        },
        // 关闭编辑弹窗
        handleEditFormClose() {
            this.selectStructureId = "";
            this.selectCityCode = "";
            this.$nextTick(() => {
                this.$refs.commonViewTable.defultEditClose();
            });
        },
    },
};
</script>

<style lang="less" scoped>
#facilitiesInfo {
    .searchBox {
        color: var(--textColor);
        background-color: var(--boxBgColor);
        padding-top: 10px;
    }
    .tableBox {
        color: var(--textColor);
        margin-top: 10px;
        padding: 10px 10px 0 10px;
    }
    .el-dialog__title {
        color: var(--textColor) !important;
    }
    .el-dialog__header.show-close {
        padding-right: 0 !important;
    }
    .el-dialog__headerbtn .el-dialog__close {
        color: var(--textColor) !important;
    }
    .my-header {
        display: flex;
        height: 45px;
        font-size: 17px;
        padding-left: 15px;
        align-items: center;
    }
}

.edit-form-inline ::v-deep(.el-select__placeholder) {
    color: #909399;
}
::v-deep(.el-input-number .el-input__inner) {
    text-align: left;
}
::v-deep(.el-dialog__title) {
    color: var(--textColor) !important;
}
::v-deep(.el-dialog__header.show-close) {
    padding-right: 0 !important;
}
::v-deep(.el-dialog__headerbtn .el-dialog__close) {
    color: var(--textColor) !important;
}
.my-header {
    display: flex;
    height: 45px;
    padding-left: 15px;
    font-size: 17px;
    align-items: center;
}

.edit-form-inline ::v-deep(.el-select__placeholder) {
    color: #909399;
}
::v-deep(.el-input-number .el-input__inner) {
    text-align: left;
}
::v-deep(.el-dialog__title) {
    color: var(--textColor) !important;
}
::v-deep(.el-dialog__header.show-close) {
    padding-right: 0 !important;
}
::v-deep(.el-dialog__headerbtn .el-dialog__close) {
    color: var(--textColor) !important;
}
</style>
