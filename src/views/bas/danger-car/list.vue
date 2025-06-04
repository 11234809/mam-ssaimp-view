<!-- @format -->

<template>
    <div class="danger_car_page">
        <!-- 筛选项 -->
        <el-form
            inline
            :model="formData"
            class="custom_form"
            label-width="130px"
            label-position="right"
            label-suffix=":"
        >
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="车牌号" class="form_item">
                        <el-input
                            v-model="formData.plateNumber"
                            placeholder="请输入车牌号"
                            clearable
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="车牌颜色" class="form_item">
                        <el-select
                            v-model="formData.plateType"
                            placeholder="请选择车牌颜色"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in platecolorcodeList"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="危化品名称" class="form_item">
                        <el-select
                            v-model="formData.dangerItemName"
                            placeholder="请选择危化品名称"
                            style="width: 100%"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in dangerItemOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="行驶路线（起点）" class="form_item">
                        <el-cascader
                            v-model="customFormData.startRoute"
                            :options="provinceList"
                            placeholder="请选择行驶路线（起点）"
                            @change="routeChange('startRoute', $event)"
                            filterable
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="行驶路线（终点）" class="form_item">
                        <el-cascader
                            v-model="customFormData.endRoute"
                            :options="provinceList"
                            placeholder="请选择行驶路线（终点）"
                            @change="routeChange('endRoute', $event)"
                            filterable
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="驶入时间" class="form_item">
                        <el-date-picker
                            v-model="customFormData.timeIn"
                            type="datetimerange"
                            range-separator="~"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            start-placeholder="请选择开始时间"
                            end-placeholder="请选择结束时间"
                            :default-time="defaultTimeIn"
                            @change="checkDate('timeIn', $event)"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="驶出时间" class="form_item">
                        <el-date-picker
                            v-model="customFormData.timeOut"
                            type="datetimerange"
                            range-separator="~"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            start-placeholder="请选择开始时间"
                            end-placeholder="请选择结束时间"
                            @change="checkDate('timeOut', $event)"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="停留时长（分钟）" class="form_item">
                        <el-input
                            v-model="formData.residenceMinutes"
                            placeholder="请输入停留时长（分钟）"
                            clearable
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="路线" class="form_item">
                    <el-select
                        collapse-tags
                        collapse-tags-tooltip
                        v-model="formData.roadRoute"
                        multiple
                        filterable
                        placeholder="请选择路线"
                        clearable
                        @change="railwayChange"
                    >
                        <el-option
                        v-for="(item, index) in lineAll"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="服务区" class="form_item">
                        <el-select
                            multiple
                            v-model="customFormData.serviceArea"
                            placeholder="请输入服务区名称"
                            @change="serviceAreaChange"
                            filterable
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in serviceAreaList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="上报人" class="form_item">
                        <el-input
                            v-model="formData.creatorName"
                            placeholder="请输入上报人"
                            clearable
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="上报时间" class="form_item">
                        <el-date-picker
                            v-model="customFormData.timeReport"
                            type="daterange"
                            range-separator="~"
                            value-format="YYYY-MM-DD"
                            start-placeholder="请选择开始时间"
                            end-placeholder="请选择结束时间"
                            @change="checkDate('timeReport', $event)"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="是否为危化品车辆" class="form_item">
                        <el-select
                            v-model="formData.carType"
                            placeholder="请选择是否为危化品车辆"
                            filterable
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in carTypeList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item class="form_item btn">
                        <el-button type="primary" @click="getData"
                            >查询</el-button
                        >
                        <el-button type="primary" @click="onReset"
                            >重置</el-button
                        >
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 功能按钮组 -->
        <div class="func_btn_box">
            <el-button type="primary" @click="handleDetail('add')"
                >添加</el-button
            >
        </div>
        <!-- 列表 -->
        <!-- <div class="tips_box">
            <span class="tips">已选择 <span class="tips_num">{{ checkNum }}</span> 项</span>
            <el-button link class="tips_num_close" @click="tableCheckClear">清空</el-button>
        </div> -->
        <el-table
            class="custom_table"
            ref="tableRef"
            border
            table-layout="auto"
            :data="tableData"
            @selection-change="selectionChange"
            style="width: 100%"
        >
            <el-table-column type="selection" width="40" />
            <el-table-column
                type="index"
                label="序号"
                width="80"
                align="center"
            />
            <el-table-column
                prop="plateNumber"
                label="车牌号"
                align="center"
                width="120"
            />
            <el-table-column
                prop="plateType"
                label="车牌颜色"
                align="center"
                width="90"
            />
            <el-table-column
                prop="dangerItemName1"
                label="危化品名称"
                align="center"
                width="120"
            />
            <el-table-column
                prop="startRoute"
                label="行驶路线（起点）"
                align="center"
                width="150"
                show-overflow-tooltip
            />
            <el-table-column
                prop="endRoute"
                label="行驶路线（终点）"
                align="center"
                width="150"
                show-overflow-tooltip
            />
            <el-table-column
                prop="serviceAreaName"
                label="服务区"
                align="center"
                width="150"
                show-overflow-tooltip
            />
            <el-table-column
                prop="startTime"
                label="驶入时间"
                align="center"
                width="160"
                show-overflow-tooltip
            />
            <el-table-column
                prop="endTime"
                label="驶离时间"
                align="center"
                width="160"
                show-overflow-tooltip
            />
            <el-table-column
                prop="residenceMinutes"
                label="停留时长"
                width="160"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="driver"
                label="驾驶员"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="tel"
                label="联系电话"
                align="center"
                width="140"
                show-overflow-tooltip
            />
            <el-table-column
                prop="cameraPic"
                label="卡口图片"
                align="center"
                width="160"
            >
                <template #default="scope">
                    <div v-if="scope.row.cameraPic" class="pic_box">
                        <el-image
                            v-for="(item, index) in scope.row.cameraPic"
                            :key="index"
                            :preview-src-list="scope.row.cameraPic"
                            :src="item"
                            preview-teleported
                            alt="加载失败"
                        />
                    </div>
                    <span v-else class="no_file">无文件</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="creatorName"
                label="上报人"
                align="center"
                width="120"
                show-overflow-tooltip
            />
            <el-table-column
                prop="createTime"
                label="上报时间"
                align="center"
                width="160"
                show-overflow-tooltip
            />
            <el-table-column
                prop="startPic"
                label="驶入图片"
                align="center"
                width="160"
            >
                <template #default="scope">
                    <div v-if="scope.row.startPic" class="pic_box">
                        <el-image
                            v-for="(item, index) in scope.row.startPic"
                            :key="index"
                            :preview-src-list="scope.row.startPic"
                            :src="item"
                            preview-teleported
                            alt="加载失败"
                        />
                    </div>
                    <span v-else class="no_file">无文件</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="endPic"
                label="驶离图片"
                align="center"
                width="160"
            >
                <template #default="scope">
                    <div v-if="scope.row.endPic" class="pic_box">
                        <el-image
                            v-for="(item, index) in scope.row.endPic"
                            :key="index"
                            :preview-src-list="scope.row.endPic"
                            :src="item"
                            preview-teleported
                            alt="加载失败"
                        />
                    </div>
                    <span v-else class="no_file">无文件</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right"
                align="center"
                width="240"
            >
                <template #default="scope">
                    <div class="action_sheet">
                        <el-button
                            type="primary"
                            size="small"
                            link
                            @click="handleDetail('edit', scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            type="primary"
                            size="small"
                            link
                            @click="handleDetail('pl', scope.row)"
                            >劝离</el-button
                        >
                        <el-button
                            type="primary"
                            size="small"
                            link
                            @click="handleDetail('bo', scope.row)"
                            >驶离</el-button
                        >
                        <el-dropdown>
                            <el-button type="primary" size="small" link>
                                更多<el-icon class="el-icon--right"
                                    ><arrow-down
                                /></el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item
                                        @click="handleDetail('al', scope.row)"
                                        >详情</el-dropdown-item
                                    >
                                    <el-dropdown-item
                                        @click="
                                            handleDelete(scope.row.entityId)
                                        "
                                        >删除</el-dropdown-item
                                    >
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination_box">
            <el-pagination
                v-model:current-page="page"
                v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20, 30, 50]"
                layout="total,  prev, pager, next,sizes, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>

        <!-- 新增/编辑/详情弹窗 -->
        <AddEditDetail
            v-if="aedDialog"
            ref="aedRef"
            :visible="aedDialog"
            :type="aedType"
            :id="aedData.entityId"
            @dialogClose="aedClose"
        />
        <!-- 劝离弹窗 -->
        <PersuadeLeave
            v-if="plDialog"
            ref="plRef"
            :visible="plDialog"
            :type="plType"
            :id="plData.entityId"
            @dialogClose="plClose"
        />
        <BearOff
            v-if="boDialog"
            ref="boRef"
            :visible="boDialog"
            :type="boType"
            :id="boData.entityId"
            @dialogClose="boClose"
        />
        <DetailAll
            v-if="alDialog"
            ref="alRef"
            :visible="alDialog"
            :type="alType"
            :id="alData.entityId"
            @dialogClose="alClose"
        />
    </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted, onActivated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute } from "vue-router";
import cityArea from "./cityArea.js";
import AddEditDetail from "./add-edit-detail.vue";
import PersuadeLeave from "./persuade-leave.vue";
import BearOff from "./bear-off.vue";
import DetailAll from "./detailAll.vue";
import moment from 'moment';
import {
    getBasDangerCarList,
    getBasDangerCarDelete,
} from "@/api/dangerCarApi.js";
import {
    getNormalOptions,
    getBasDangerItemList,
    getRoadLineList,
    getServiceArea,
} from "@/api/dictionaryApi.js";
const carTypeList = ref([
    {
        label: "否",
        value: '0',
    },
    {
        label: "是",
        value: '1',
    },
    {
        label: "已确认",
        value: '2',
    },
    {
        label: "未确认",
        value: '3',
    },
]); // 车辆类型下拉数据
const tableRef = ref(null); // 列表引用
const tableData = ref([]); // 列表数据
const lineAll = ref([]); // 路线下拉数据
let nowDate = moment(Date.now()).format('YYYY-MM-DD');
const formData = reactive({
    // 查询条件
    plateNumber: "", // 车牌号
    plateType: "", // 车牌类型
    startRoute: "", // 行驶路线（起点）
    endRoute: "", // 行驶路线（终点）
    serviceAreaId: "", // 服务区
    startTime: "", // 驶入时间
    startTimeIn: nowDate + " 00:00:00",
    endTimeIn: nowDate + " 23:59:59",
    endTime: "", // 驶离时间
    residenceMinutes: "", // 停留时长
    driver: "", // 驾驶员
    tel: "", // 联系电话
    cameraPic: "", // 卡口图片
    creatorName: "", // 上报人
    createTime: "", // 上报时间
    startPic: "", // 驶入图片
    endPic: "", // 驶离图片
    carType: "", // 车辆类型
});
const customFormData = reactive({
    // 自定义查询条件
    plateNumber: "", // 车牌号
    plateType: "", // 车牌类型
    startRoute: "", // 行驶路线（起点）
    endRoute: "", // 行驶路线（终点）
    serviceArea: [], // 服务区
    timeIn: [nowDate + " 00:00:00", nowDate + " 23:59:59"], // 驶入时间
    timeOut: "", // 驶离时间
    timeReport: "", // 上报时间
});
const route = useRoute();
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数
const checkNum = ref(0); // 已选择条数

const platecolorcodeList = ref([]); // 车牌颜色列表
const dangerItemOptions = ref([]); // 危化品名称列表
const serviceAreaList = ref([]); // 服务区列表
const provinceList = ref([]); // 省市区列表

const aedRef = ref(null); // 新增/编辑/详情弹窗引用
const aedType = ref(""); // 新增/编辑/详情弹窗类型
const aedData = ref({}); // 新增/编辑/详情弹窗数据
const aedDialog = ref(false); // 新增/编辑/详情弹窗显示隐藏

const plRef = ref(null); // 劝离弹窗引用
const plType = ref(""); // 劝离弹窗类型
const plData = ref({}); // 劝离弹窗数据
const plDialog = ref(false); // 劝离弹窗显示隐藏

const boRef = ref(null); // 驶离弹窗引用
const boType = ref(""); // 驶离弹窗类型
const boData = ref({}); // 驶离弹窗数据
const boDialog = ref(false); // 驶离弹窗显示隐藏

const alRef = ref(null); // 详情弹窗引用
const alType = ref(""); // 详情弹窗类型
const alData = ref({}); // 详情弹窗数据
const alDialog = ref(false); // 详情弹窗显示隐藏
onMounted(async() => {
    
})
onActivated(async() => {
    await getDictionary();
    if (
        route.query &&
        route.query.dangerServiceAreaId &&
        route.query.dangerItemId
    ) {
        customFormData.serviceArea = [];
        customFormData.serviceArea.push(route.query.dangerServiceAreaId);
        formData.dangerItemName = route.query.dangerItemId;
      
        serviceAreaChange(customFormData.serviceArea);
    } else if (route.query && route.query.statisticsServiceAreaId) {
        customFormData.serviceArea = [];
        route.query.statisticsServiceAreaId.forEach((item) => {
            customFormData.serviceArea.push(item);
        });
        serviceAreaChange(customFormData.serviceArea);
    } else if (route.query && route.query.dangerItemId) {
        formData.dangerItemName = route.query.dangerItemId;
    } 
    if(hasQueryParams()) {
      await valueBasedQuery();
    }
   await jumpSearchFormChange();
   await getData();
});
// 判断跳转带值是否满足参数要求,满足则查询
const hasQueryParams = () => {
  const queryKeys = [
    'name', 'carType', 'highSpeed', 'itemNameStart', 'itemNameEnd',
    'serviceAreaIdList', 'serviceAreaId', 'startTime', 'endTime'
  ];
  return route.query && queryKeys.some(key => route.query[key]);
}
// 带值查询
const valueBasedQuery = async (val) => {
    if( route.query && route.query.name) {
      formData.dangerItemName = dangerItemOptions.value ? dangerItemOptions.value.find(item => item.name === route.query.name)?.code:'';    
    }else{
        formData.dangerItemName = '';
    }
    // highSpeed
    // console.log(route.query,'route.query');
    // 车辆类型
    customFormData.carType = formData.carType = route.query && route.query.carType ? route.query.carType: null;

    customFormData.roadRoute = formData.roadRoute = route.query && route.query.highSpeed ? route.query.highSpeed.split(",")  : [];
    // 出发地
    customFormData.startRoute = formData.startRoute = route.query && route.query.itemNameStart ? route.query.itemNameStart : "";
    // 目的地
    customFormData.endRoute = formData.endRoute = route.query && route.query.itemNameEnd ? route.query.itemNameEnd : "";
    customFormData.serviceArea = route.query && route.query.serviceAreaIdList ? route.query.serviceAreaIdList : route.query && route.query.serviceAreaId? route.query.serviceAreaId.split(",") : [];
    formData.serviceAreaId = route.query && route.query.serviceAreaIdList ? route.query.serviceAreaIdList : route.query && route.query.serviceAreaId? route.query.serviceAreaId : "";
    if(route.query && route.query.startTime && route.query.endTime) {
        customFormData.timeIn = [route.query.startTime, route.query.endTime];    
        formData.startTimeIn = route.query.startTime;
        formData.endTimeIn = route.query.endTime;
    }
}
// 路段联动
const railwayChange = (val) => {
//   let railways = val.join(",");
  // 公司-服务区的联动数据
//   getRoadLineServiceArea({
//     orgIds:
//       formData.orgIds && formData.orgIds.length > 0
//         ? formData.orgIds.join(",")
//         : "",
//     highSpeed: railways,
//     serviceAreaIds:
//       formData.serviceAreaIds && formData.serviceAreaIds.length > 0
//         ? formData.serviceAreaIds.join(",")
//         : "",
//   }).then((res) => {
//     listOptions.serviceAreaList = res?.data?.records;
//   });
};
async function getData() {
    // 查询
    Array.isArray(formData.serviceAreaId) && serviceAreaChange(formData.serviceAreaId);
    getBasDangerCarList({
        ...formData,
        index: page.value,
        size: pageSize.value,
    }).then((res) => {
        res.data.records.map((item) => {
            // 卡口图片
            if (item.cameraPic) {
                item.cameraPic = item.cameraPic.split(",").map((ite) => {
                    return getImgForId(ite);
                });
            }
            // 驶入图片
            if (item.startPic) {
                item.startPic = item.startPic.split(",").map((ite) => {
                    return getImgForId(ite);
                });
            }
            // 驶离图片
            if (item.endPic) {
                item.endPic = item.endPic.split(",").map((ite) => {
                    return getImgForId(ite);
                });
            }
            // 车牌类型
            if (item.plateType) {
                platecolorcodeList.value.map((ite) => {
                    if (item.plateType == ite.code) {
                        item.plateType = ite.name;
                    }
                });
            }
            // 服务区
            if (item.serviceAreaId) {
                serviceAreaList.value.map((ite) => {
                    if (item.serviceAreaId == ite.id) {
                        item.serviceAreaId = ite.name;
                    }
                });
            }
        });
        tableData.value = res.data.records;
        tableData.value.map((item) => {
            dangerItemOptions.value.map((item2) => {
                if (item.dangerItemName == item2.code) {
                    item.dangerItemName1 = item2.name;
                }
            });
            // item.dangerItemName
        });
        total.value = res.data.total;
    });
}

// 获取字典数据
async function getDictionary() {
    // 获取车牌颜色
    getNormalOptions({
        queriers: [{ alias: "plateColorDictionary", param: null }],
    })
        .then(({ code, data }) => {
            if (code == 200) {
                platecolorcodeList.value = data.plateColorDictionary;
            }
        })
        .catch((err) => {
            console.log(err);
        });

    // 获取危化品
   await getBasDangerItemList({ index: 1, size: -1 })
        .then((res) => {
            if (res.code == 200) {
                dangerItemOptions.value = [];
                res.data.records.forEach((item) => {
                    dangerItemOptions.value.push({
                        name: item.dangerItemName,
                        code: item.entityId,
                    });
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    // 路线
    getRoadLineList().then((res) => {
        lineAll.value = res?.data?.records;
    });
    // 获取服务区
    getServiceArea()
        .then(({ code, data }) => {
            if (code == 200) {
                serviceAreaList.value = data.records;
            }
        })
        .catch((err) => {
            console.log(err);
        });
    getProvinceList();
}
// 获取省市区数据
function getProvinceList() {
    let cityAreaList = cityArea.provinceList;
    cityAreaList.map((item) => {
        (item.id = item.value), (item.value = item.label);
        item.children.map((itemF) => {
            (itemF.id = itemF.value), (itemF.value = itemF.label);
            itemF.children.map((itemT) => {
                (itemT.id = itemT.value), (itemT.value = itemT.label);
            });
        });
    });
    provinceList.value = cityAreaList;
}
getDictionary();
// 服务区数据转换
function serviceAreaChange(val) {
    if (val.length > 0) {
        formData.serviceAreaId = val.join(",");
    } else {
        formData.serviceAreaId = null;
    }
}
// 重置查询
function onReset() {
    // 重置表单参数赋值
    Object.keys(formData).map((key) => {
        formData[key] = null;
    });
    // 重置自定义表单参数赋值
    Object.keys(customFormData).map((key) => {
        customFormData[key] = [];
    });
    formData.startTimeIn = null;
    formData.endTimeIn = null;
    customFormData.timeIn = [null, null];
    page.value = 1; // 重置页码
    pageSize.value = 10; // 重置每页条数
    checkNum.value = 0; // 重置已选择条数
    tableCheckClear(); // 清空已选择数据
    getData(); // 重新查询
}
// 列表删除
async function handleDelete(id) {
    ElMessageBox.confirm("是否确认删除?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async () => {
        let res = await getBasDangerCarDelete({ entityId: id });
        if (res.code == 200) {
            ElMessage({
                message: res.data.message,
                type: "success",
            });
            await getData();
        }
    });
}
// 省市区联动
function routeChange(type, val) {
    if (val.length > 0) {
        formData[type] = val.join("-");
    } else {
        formData[type] = null;
    }
}
// 时间选择器数据转换
function checkDate(type, e) {
    switch (type) {
        // 驶入时间
        case "timeIn":
            formData.startTimeIn = e ? e[0] : "";
            formData.endTimeIn = e ? e[1] : "";
            break;
        // 驶出时间
        case "timeOut":
            formData.startTimeOut = e ? e[0] : "";
            formData.endTimeOut = e ? e[1] : "";
            break;
        // 上报时间
        case "timeReport":
            formData.startTimeCreate = e ? e[0] : "";
            formData.endTimeCreate = e ? e[1] : "";
            break;
        default:
            break;
    }
}
// 驶入时间组件时分秒的默认时间
const defaultTimeIn = [nowDate + " 00:00:00", nowDate + " 23:59:59"];
// 清空已选择项
function tableCheckClear() {
    tableRef.value.clearSelection();
}
// 分页
function handleCurrentChange(val) {
    page.value = val;
    getData();
}
// 每页条数
function handleSizeChange(val) {
    pageSize.value = val;
    getData();
}
// 已选择项
function selectionChange(val) {
    checkNum.value = val.length;
}

// 新增/编辑/详情弹窗
function handleDetail(type, data) {
    if (type == "add" || type == "edit") {
        // 新增/编辑
        aedDialog.value = true;
        aedType.value = type;
        aedData.value = data ? data : {};
    } else if (type == "pl") {
        // 劝离弹窗
        plDialog.value = true;
        plType.value = type;
        plData.value = data ? data : {};
    } else if (type == "bo") {
        // 驶离弹窗
        boDialog.value = true;
        boType.value = type;
        boData.value = data ? data : {};
    } else if (type == "al") {
        // 详情弹窗
        alDialog.value = true;
        alType.value = type;
        alData.value = data ? data : {};
    }
}

// 图片转换
function getImgForId(id) {
    return (
        process.env.VUE_APP_API_HOST_URL +
        process.env.VUE_APP_API_BASE_URL +
        `/pub/common/file/download?service=basDangerCarFileServiceImpl&id=${id}`
    );
}

function aedClose() {
    aedDialog.value = false;
    getData();
}
function plClose() {
    plDialog.value = false;
    getData();
}
function boClose() {
    boDialog.value = false;
    getData();
}
function alClose() {
    alDialog.value = false;
    getData();
}
// 特殊车辆管理统计跳转特殊车辆管理带值搜索
async function jumpSearchFormChange() {
    if( route.query && route.query.jumpFrom && route.query.orgId && route.query.serviceAreaIds) {
        if (route.query.jumpFrom == "dangerCarCount") {
            let serviceAreaIdArr = route.query.serviceAreaIds ? route.query.serviceAreaIds.split(",") : [];
            let timeInArr = [route.query.jumpStartTimeIn, route.query.jumpEndTimeIn];
            // 搜索框赋值 
            customFormData.timeIn = timeInArr;
            customFormData.serviceArea = serviceAreaIdArr;
            customFormData.carType = route.query.carType;
            // 查询条件赋值
            formData.serviceAreaId = route.query.serviceAreaIds;
            formData.startTimeIn = route.query.jumpStartTimeIn;
            formData.endTimeIn = route.query.jumpEndTimeIn;
            formData.carType = route.query.carType;
        }
    }
}
</script>

<style lang="less" scoped>
.danger_car_page {
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

            &.btn {
                .el-form-item__content {
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }
    }

    .func_btn_box {
        margin-bottom: 10px;
    }

    .tips_box {
        display: flex;
        align-items: center;
        height: 40px;
        background-color: #0099ff32;
        border: 1px solid aqua;
        border-radius: 3px;
        margin-bottom: 10px;
        padding: 10px;

        .tips {
            font-size: var(--fontSize16);

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
</style>
