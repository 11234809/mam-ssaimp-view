<template>
    <div class="this_page">
        <!-- 筛选项 -->
        <el-form inline :model="formData" class="custom_form" label-width="120px" label-position="right"
            label-suffix=":">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="公司" class="form_item">
                        <el-select v-model="formData.companyIdList" filterable multiple collapse-tags
                        :reserve-keyword="false" placeholder="请选择公司" clearable>
                            <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="服务区" class="form_item">
                        <el-select v-model="formData.serviceAreaIdList" filterable multiple collapse-tags
                        :reserve-keyword="false" placeholder="请选择服务区"
                            clearable>
                            <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="星级" class="form_item">
                        <el-select v-model="formData.starList" multiple collapse-tags placeholder="请选择星级" clearable>
                            <el-option v-for="(item, index) in starRatingList" :key="index" :label="item.name"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="方向" class="form_item">
                        <el-select v-model="formData.serviceAreaDirectionList" multiple placeholder="请选择方向" clearable>
                            <el-option v-for="(item, index) in directionList" :key="index" :label="item.name"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="行政区域(省)" class="form_item">
                        <el-select v-model="formData.provinceList"  filterable
                        :reserve-keyword="false" placeholder="请选择行政区域(省)"
                            @change="provinceChange" clearable>
                            <el-option v-for="(item, index) in provinceList" :key="index" :label="item.label"
                                :value="item.value" :children="item.children" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="行政区域(市/区)" class="form_item">
                        <el-cascader v-model="formData.cityList" :options="cityList" filterable
                        :reserve-keyword="false" label="label"
                            value="value" children="children" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item class="form_item query-form-btn">
                        <el-button type="primary" @click="getData">查询</el-button>
                        <el-button type="primary" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 功能按钮组 -->
        <div class="func_btn_box">
            <el-button type="primary" @click="doExport()">
                <el-icon>
                    <Download />
                </el-icon>
                <span>导出</span>
            </el-button>
        </div>
        <!-- 列表 -->
        <el-table class="custom_table" ref="tableRef" border :data="tableData" @selection-change="selectionChange"
            style="width: 100%">
            <!-- <el-table-column type="index" label="序号" width="80" align="center" /> -->
            <el-table-column prop="company" label="公司" align="center" show-overflow-tooltip />
            <el-table-column prop="name" label="服务区名称" align="center" show-overflow-tooltip />
            <el-table-column prop="type" label="服务区/停车区" align="center" show-overflow-tooltip />
            <el-table-column prop="serviceAreaDirection" label="方向" align="center" show-overflow-tooltip />
            <el-table-column prop="road" label="所属路段" align="center" show-overflow-tooltip />
            <el-table-column prop="star" label="星级" align="center" show-overflow-tooltip />
            <el-table-column prop="buildArea" label="总面积(亩)" align="center" show-overflow-tooltip />
            <el-table-column label="新能源数量(座)" align="center">
                <el-table-column prop="isAirStation" label="加气" align="center" show-overflow-tooltip />
                <el-table-column prop="isChargingStation" label="充电" align="center" show-overflow-tooltip />
                <el-table-column prop="isExchangeStation" label="换电" align="center" show-overflow-tooltip />
                <el-table-column prop="isGreenEnergy" label="光伏" align="center" show-overflow-tooltip />
            </el-table-column>
            <el-table-column prop="isTruckHome" label="司机之家(座)" align="center" show-overflow-tooltip />
            <el-table-column label="服务区车位数" align="center">
                <el-table-column prop="totalCars" label="总车位数" align="center" show-overflow-tooltip />
                <el-table-column prop="smallCars" label="小型客车总数" align="center" show-overflow-tooltip />
                <el-table-column prop="electricCar" label="充电位" align="center" show-overflow-tooltip />
            </el-table-column>
            <el-table-column prop="city" label="行政区域" align="center" show-overflow-tooltip />
            <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip />
        </el-table>
        <!-- 分页 -->
        <!-- <div class="pagination_box">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
                layout="total,  prev, pager, next,sizes, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div> -->

        <!-- 新增/编辑/详情弹窗 -->
        <!-- <AddEditDetail v-if="aedVisible" :visible="aedVisible" :type="aedType" :id="aedData.entityId"
            @dialogClose="aedClose" /> -->
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import moment from "moment";
import { downFilePOST } from "@/api/manage";
import { serveInfo } from "@/api/serveInfoApi.js";
import { getServiceArea, getCompany, queryNormalOptions } from "@/api/dictionaryApi";
import { cityObj } from "@/utils/city";
const useInfo = JSON.parse(sessionStorage.getItem("userInfo"));

/* 筛选表单数据start */
const formData = reactive({});
/* 筛选表单数据end */

/* 列表相关start */
const tableRef = ref(null); //列表ref
const checkNum = ref(0); // 列表选择总条数
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const serviceAreaList = ref([]) // 服务区列表
const companyList = ref([]) // 公司列表
const starRatingList = ref([]) // 星级列表
const directionList = ref([]) // 方向列表
const provinceList = ref([]) // 行政区域(省)列表
const cityList = ref([]) // 行政区域(市/区)列表

// 获取字典数据
const getDictionary = () => {
    // 获取服务区
    getServiceArea().then(({ code, data }) => {
        if (code == 200) {
            serviceAreaList.value = data.records;
        }
    })
    // 获取公司
    getCompany().then(({ code, data }) => {
        if (code == 200) {
            companyList.value = data.records;
        }
    })
    // 获取星级
    queryNormalOptions({
        queriers: [{ alias: 'basAreaInfoStarDictionary', param: null }],
    }).then(({ code, data }) => {
        if (code == 200) {
            starRatingList.value = data.basAreaInfoStarDictionary;
        }
    })
    // 获取方向
    queryNormalOptions({
        queriers: [{ alias: 'basAreaInfoDireDictionary', param: null }],
    }).then(({ code, data }) => {
        if (code == 200) {
            directionList.value = data.basAreaInfoDireDictionary;
        }
    })
    provinceList.value = cityObj;
};


//获取列表数据
function getData() {
    let params = {
        index: page.value,
        size: pageSize.value,
        ...formData,
    };
    serveInfo(params).then((res) => {
        tableData.value = res.data.records;
        total.value = res.data.total;
    })
}
getDictionary()
getData();

// 通过省获取市区
const provinceChange = (val) => {
    console.log(val);

    if (val) {
        cityObj.map(item => {
            if (item.value == val) {
                console.log(item.children);
                cityList.value = item.children
            }
        })
    } else {
        cityList.value = [];
    }
}

// 查询重置
function onReset() {
    Object.keys(formData).map((key) => {
        formData[key] = null;
    });
    page.value = 1;
    pageSize.value = 10;
    tableCheckClear();
    getData();
}
// 列表选择
function selectionChange(val) {
    checkNum.value = val.length;
}
// 列表选择清空
function tableCheckClear() {
    tableRef.value.clearSelection();
    selectionChange([]);
}
// // 列表分页-当前页改变
// function handleCurrentChange(val) {
//     page.value = val;
//     getData();
// }
// // 列表分页-每页显示条数改变
// function handleSizeChange(val) {
//     pageSize.value = val;
//     getData();
// }
/* 列表相关end */

function doExport() {
    let params = { ...formData, };
    const systemTime = moment().format("YYYYMMDD");
    let fileName = "服务区基础信息统计报表"+systemTime;
    downFilePOST('/api/statisticalForm/serveInfo/exportXls', params).then((data) => {
        if (!data) {
            ElMessage.warning("文件下载失败");
            return;
        }
        let excelData = data.data;
        if (typeof window.navigator.msSaveBlob !== "undefined") {
            window.navigator.msSaveBlob(
                new Blob([excelData], { type: "application/vnd.ms-excel" }),
                fileName + ".xls"
            );
        } else {
            let url = window.URL.createObjectURL(
                new Blob([excelData], { type: "application/vnd.ms-excel" })
            );
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", fileName + ".xls");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // 下载完成移除元素
            window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
    });
}
</script>

<style lang="less" scoped>
.this_page {
    .custom_form {
        margin-bottom: 20px;

        :deep(.form_item) {
            width: 100%;

            .el-cascader {
                width: 100%;
            }

            .separator {
                margin: 0 10px;
            }
        }
    }

    .tips_box {
        display: flex;
        align-items: baseline;
        height: 40px;
        margin: 10px 0;
        padding: 10px;

        .tips {
            position: relative;
            font-size: var(--fontSize16);
            font-weight: bold;

            &::before {
                position: absolute;
                content: '';
                width: 5px;
                height: 15px;
                left: -10px;
                top: 4px;
                background-color: #114484;
            }

            .tips_num {
                color: blue;
            }
        }

        .tips_num_close {
            margin-left: 10px;
            color: blue;
        }
    }

    :deep(.custom_table) {
        margin-bottom: 20px;

        .pic_box {
            display: flex;

            .el-image {
                width: 50px;
                height: 50px;
                object-fit: cover;

                &:not(:last-child) {
                    margin-right: 10px;
                }
            }
        }

        .no_file {
            font-style: italic;
            color: #5d5d5d;
        }

        .accessory_box {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            // overflow-x: auto;

            // &::-webkit-scrollbar {
            //     // width: 100px;
            //     height: 10px;
            // }

            // &::-webkit-scrollbar-thumb {
            //     background-color: #5d5d5d;
            // }

            // &::-webkit-scrollbar-track {
            //     background-color: aliceblue;
            // }
        }

        .action_sheet {
            display: flex;
            align-items: center;
            justify-content: center;

            .el-dropdown {
                margin-left: 12px;
            }
        }
    }

    .pagination_box {
        float: right;
    }
}

.func_btn_box {
    margin-bottom: 20px;
}
</style>
