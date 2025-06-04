<template>
  <div class="this_page">
    <!-- 筛选项 -->
    <div ref="searchRef">
      <el-form
        inline
        :model="formData"
        class="custom_form"
        label-width="120px"
        style="padding: 0 20px"
        label-position="right"
        label-suffix=":"
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="统计维度" label-width="80px" class="form_item">
              <!--              <el-select v-model="formData.selectTimeType" placeholder="请选择统计维度" clearable-->
              <!--                         @change="selectTimeTypeChange()">-->
              <!--                <el-option v-for="(item, index) in selectTimeTypeList" :key="index" :label="item.name"-->
              <!--                           :value="item.code"/>-->
              <!--              </el-select>-->
              <el-radio-group
                v-model="formData.selectTimeType"
                @change="selectTimeTypeChange()"
              >
                <el-radio-button
                  v-for="(item, index) in selectTimeTypeList"
                  :key="index"
                  :label="item.code"
                >
                  {{ item.name }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="!formData.selectTimeType"> </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '0'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker
                style="width: 100%"
                v-model="formData.time"
                type="date"
                placeholder="请选择日期"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '1'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker
                style="width: 100%"
                v-model="formData.time"
                type="week"
                placeholder="请选择周"
                :format="weekFormat"
                valueFormat="YYYY-MM-DD"
                @change="weekChange(formData.time)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '2'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker
                style="width: 100%"
                v-model="formData.time"
                type="month"
                placeholder="请选择月"
                format="YYYY-MM"
                valueFormat="YYYY-MM"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '3'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <DateQuarter
                style="width: 100%"
                ref="seasonSelect"
                placeholder="请选择季度"
                @chooseSeason="seasonChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '4'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker
                style="width: 100%"
                v-model="formData.time"
                type="year"
                placeholder="请选择年"
                format="YYYY"
                valueFormat="YYYY"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.selectTimeType == '5'">
            <el-form-item label="统计时间" label-width="80px" class="form_item">
              <el-date-picker
                style="width: 100%"
                v-model="formData.timeList"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="公司" label-width="80px" class="form_item">
              <el-select
                collapse-tags
                collapse-tags-tooltip
                v-model="formData.company"
                multiple
                filterable
                placeholder="请选择公司"
                clearable
              >
                <el-option
                  v-for="(item, index) in companyList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服务区" label-width="80px" class="form_item">
              <el-select
                v-model="formData.serviceName"
                :reserve-keyword="false"
                multiple
                filterable
                placeholder="请选择服务区"
                clearable
                collapse-tags
                collapse-tags-tooltip
                @change="serviceAreaChange"
              >
                <el-option
                  v-for="(item, index) in listOptions.serviceAreaList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="路线" label-width="80px" class="form_item">
              <el-select
                collapse-tags
                collapse-tags-tooltip
                v-model="formData.roadRoute"
                multiple
                filterable
                placeholder="请选择路线"
                clearable
              >
                <el-option
                  v-for="(item, index) in lineAll"
                  :key="item.entityId"
                  :label="item.roadLineName"
                  :value="item.roadLineName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--        <el-col :span="6">-->
          <!--          <el-form-item label="路段" label-width="80px" class="form_item">-->
          <!--            <el-cascader v-model="formData.roadSection" filterable clearable :show-all-levels="false" collapse-tags-->
          <!--                         :props="lineProps" :options="lineTree">-->
          <!--            </el-cascader>-->
          <!--          </el-form-item>-->
          <!--        </el-col>-->
          <!--        <el-col :span="6">-->
          <!--          <el-form-item label="电站名称" label-width="80px" class="form_item">-->
          <!--            <el-select v-model="formData.stationName" multiple filterable placeholder="请选择" clearable-->
          <!--                       collapse-tags-->
          <!--                       collapse-tags-tooltip>-->
          <!--              <el-option v-for="(item, index) in stationList" :key="index" :label="item.label"-->
          <!--                         :value="item.label"/>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--        </el-col>-->
          <!--        <el-col :span="6">-->
          <!--          <el-form-item label="运营单位" label-width="80px" class="form_item">-->
          <!--            <el-select v-model="formData.operatorUnit" multiple filterable placeholder="请选择" clearable-->
          <!--                       collapse-tags-->
          <!--                       collapse-tags-tooltip>-->
          <!--              <el-option v-for="(item, index) in operationList" :key="index" :label="item.label"-->
          <!--                         :value="item.label"/>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--        </el-col>-->
          <el-col :span="18">
            <el-form-item class="form_item query-form-btn">
              <el-button type="primary" @click="getData" :loading="loading"
                >查询</el-button
              >
              <el-button
                type="primary"
                @click="onReset"
                style="margin-right: 20px"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 功能按钮组 -->
    <div class="func_btn_box">
      <!--      <el-popconfirm title="您确定要导出吗?" width="auto" @confirm="doExport">-->
      <!--        <template #reference>-->
      <!-- v-if="isAuth('/rmt/chargeReportConnector.export')" -->
      <el-button type="primary" @click="doExport">
        <el-icon>
          <Download />
        </el-icon>
        <span>导出</span>
      </el-button>
      <!--        </template>-->
      <!--      </el-popconfirm>-->
    </div>
    <!-- 列表 -->
    <!--    :default-sort="{ prop: 'chargeTimeRate', order: 'descending' }"-->
    <el-table
      v-loading="loading"
      class="custom_table"
      ref="tableRef"
      :max-height="`calc(100vh - ${tableHeight}px)`"
      @sort-change="handleSortChange"
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column
        prop="serviceAreaName"
        label="服务区名称"
        min-width="120"
        align="center"
      />
      <el-table-column
        prop="serviceAreaCode"
        label="服务区编号"
        width="140"
        align="center"
      />
      <el-table-column
        prop="companyName"
        label="公司"
        min-width="140"
        align="center"
      />
      <el-table-column
        prop="roadRoute"
        label="路线名称"
        min-width="140"
        align="center"
      />
      <el-table-column
        prop="transformerCapacity"
        label="变压器容量"
        width="140"
        align="center"
      />
      <el-table-column
        prop="equipmentNum"
        label="充电桩数量"
        width="120"
        sortable
        align="center"
      />
      <el-table-column
        prop="connectionNum"
        label="充电枪数量"
        width="120"
        sortable
        align="center"
      />
      <el-table-column
        prop="isRelated"
        label="随手查关联枪数"
        sortable
        width="160"
        align="center"
      />
      <el-table-column
        prop="chargeElec"
        label="充电量(kWh)"
        width="140"
        sortable
        align="center"
      />
      <el-table-column
        prop="chargeFee"
        label="充电电费(元)"
        width="160"
        sortable
        align="center"
      />
      <el-table-column
        prop="chargeServiceFee"
        label="充电服务费(元)"
        width="160"
        sortable
        align="center"
      />
      <el-table-column
        prop="chargeNum"
        label="充电次数"
        width="140"
        sortable
        align="center"
      />
      <el-table-column
        prop="chargeTime"
        label="充电时长(h)"
        width="160"
        sortable
        align="center"
      />
      <el-table-column
        prop="chargeTimeRate"
        label="时长利用率(%)"
        width="170"
        sortable
        align="center"
      >
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span> 时长利用率(%) </span>
              <el-popover
                placement="top-start"
                title="时长利用率(%)"
                effect="dark"
                width="auto"
                trigger="hover"
                content="（求和（状态为充电中的枪*充电时长）/所有枪*24）"
              >
                <template #reference>
                  <el-icon color="#fa8c16" size="18">
                    <QuestionFilled />
                  </el-icon>
                </template>
              </el-popover>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="capacityRate"
        label="容量利用率(%)"
        width="170"
        sortable
        align="center"
      >
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span> 容量利用率(%) </span>
              <el-popover
                placement="top-start"
                title="容量利用率(%)"
                effect="dark"
                width="auto"
                trigger="hover"
                content="（求和（电量）/功率*24）"
              >
                <template #reference>
                  <el-icon color="#fa8c16" size="18">
                    <QuestionFilled />
                  </el-icon>
                </template>
              </el-popover>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="chargeTimeAvg"
        label="平均充电时长(h)"
        width="180"
        sortable
        align="center"
      >
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span> 平均充电时长(h) </span>
              <el-popover
                placement="top-start"
                title="平均充电时长(h)"
                effect="dark"
                width="auto"
                trigger="hover"
                content="（总充电时长/总次数）"
              >
                <template #reference>
                  <el-icon color="#fa8c16" size="18">
                    <QuestionFilled />
                  </el-icon>
                </template>
              </el-popover>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="chargeFeeAvg"
        label="平均充电电价(元)"
        width="180"
        sortable
        align="center"
      >
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span> 平均充电电价(元) </span>
              <el-popover
                placement="top-start"
                title="平均充电电价(元)"
                effect="dark"
                width="auto"
                trigger="hover"
                content="（充电订单总电费/总电量）"
              >
                <template #reference>
                  <el-icon color="#fa8c16" size="18">
                    <QuestionFilled />
                  </el-icon>
                </template>
              </el-popover>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="chargeServiceFeeAvg"
        label="平均服务费价格(元)"
        width="190"
        sortable
        align="center"
      >
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span> 平均服务费价格(元) </span>
              <el-popover
                placement="top-start"
                title="平均服务费价格(元)"
                effect="dark"
                width="auto"
                trigger="hover"
                content="（充电订单总服务区/总电量）"
              >
                <template #reference>
                  <el-icon color="#fa8c16" size="18">
                    <QuestionFilled />
                  </el-icon>
                </template>
              </el-popover>
            </span>
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

    <!--导出 弹窗 -->
    <ExportDialog
      v-model="exportShow"
      :list="exportList"
      @closeModal="closeModal"
      @export="exportExcel"
    />
  </div>
</template>

<script setup>
import {
  nextTick,
  onMounted,
  reactive,
  ref,
  useTemplateRef,
  getCurrentInstance,
  onActivated,
  watch,
} from "vue";
//   import DetailDialog from "./detail-dialog";
import { DateQuarter } from "mam-base-ui";
import { getServiceArea } from "@/api/dictionaryApi.js";
import { exportData } from "@/utils/common-features";
import { getCompany } from "@/api/informationServiceAreaApi.js";
import moment from "moment";
import { camelToSnake } from "@/utils/index";
import {
  getChargeReportServiceAreaList,
  getRoadLineAllList,
} from "@/api/powerStation/index.js";
import ExportDialog from "../components/export-dialog/index.vue";
import { useRoute } from "vue-router";
import { bigScreen } from "@/store/bigScreen";

const loading = ref(false);
const exportShow = ref(false);
const timestamp = ref(new Date().getTime());
const { proxy } = getCurrentInstance();
const route = useRoute();
const store = bigScreen();

function closeModal() {
  exportShow.value = false;
}

const exportList = ref([
  {
    value: "serviceAreaName",
    label: "服务区名称",
    checked: true,
  },
  {
    value: "serviceAreaCode",
    label: "服务区编号",
    checked: true,
  },
  {
    value: "companyName",
    label: "公司",
    checked: true,
  },
  {
    value: "roadRoute",
    label: "路线名称",
    checked: true,
  },

  {
    value: "transformerCapacity",
    label: "变压器容量",
    checked: true,
  },
  {
    value: "equipmentNum",
    label: "充电桩数量",
    checked: true,
  },
  {
    value: "connectionNum",
    label: "充电枪数量",
    checked: true,
  },
  {
    value: "isRelated",
    label: "随手查关联枪数",
    checked: true,
  },

  {
    value: "chargeElec",
    label: "充电量（KWH）",
    checked: true,
  },
  {
    value: "chargeFee",
    label: "充电电费（元）",
    checked: true,
  },
  {
    value: "chargeServiceFee",
    label: "充电服务费（元）",
    checked: true,
  },
  {
    value: "chargeNum",
    label: "充电次数",
    checked: true,
  },
  {
    value: "chargeTime",
    label: "充电时长（h）",
    checked: true,
  },

  {
    value: "chargeTimeRate",
    label: "时长利用率（%）",
    checked: true,
  },
  {
    value: "capacityRate",
    label: "容量利用率（%）",
    checked: true,
  },
  {
    value: "chargeTimeAvg",
    label: "平均充电时长（h）",
    checked: true,
  },
  {
    value: "chargeFeeAvg",
    label: "平均充电电价（元）",
    checked: true,
  },
  {
    value: "chargeServiceFeeAvg",
    label: "平均服务费价格（元）",
    checked: true,
  },
]);

const selectTimeTypeList = [
  {
    name: "日",
    code: "0",
  },
  {
    name: "周",
    code: "1",
  },
  {
    name: "月",
    code: "2",
  },
  {
    name: "季",
    code: "3",
  },
  {
    name: "年",
    code: "4",
  },
  {
    name: "其他",
    code: "5",
  },
];
const seasonSelect = ref();

const formData = reactive({
  selectTimeType: "0",
  serviceName: [], // 服务区名称列表
  serviceAreaId: "", // 服务区ID
});

// 服务区数据转换
function serviceAreaChange(val) {
  if (val && val.length > 0) {
    formData.serviceAreaId = val.join(",");
  } else {
    formData.serviceAreaId = null;
  }
}

async function selectTimeTypeChange() {
  formData.time = "";
  formData.timeList = [];
  if (formData.selectTimeType == "0") {
    formData.time = moment().subtract(1, "day").format("YYYY-MM-DD");
  } else if (formData.selectTimeType == "1") {
    formData.time = moment().format("YYYY-MM-DD");
    // weekChange(formData.time);
    let startDate = moment(formData.time)
      .clone()
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    let weekEnd = moment(formData.time)
      .clone()
      .endOf("isoWeek")
      .format("YYYY-MM-DD");
    console.log(startDate, "startDate99999999999");
    console.log(weekEnd, "weekEnd99999999999");

    weekChange(startDate);
    formData.timeList = [startDate, weekEnd];
  } else if (formData.selectTimeType == "2") {
    formData.time = moment().format("YYYY-MM");
  } else if (formData.selectTimeType == "3") {
    await nextTick(() => {
      let nowYear = moment().year();
      let nowQuarter = moment().quarter();
      seasonSelect.value.getDefaultTimeNow();
      seasonChange(nowYear, nowQuarter, "");
    });
  } else if (formData.selectTimeType == "4") {
    formData.time = moment().format("YYYY");
  } else if (formData.selectTimeType == "5") {
    formData.timeList = [
      moment().format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD"),
    ];
  }
  page.value = 1;
  await getData();
}

// 获取指定日期的那一周的开始、结束日期
function getWeekStartAndEnd(val) {
  let weekStart = val;
  let weekEnd = moment(val).add(6, "days").format("YYYY-MM-DD");
  return [weekStart, weekEnd];
}

// 根据日期判断是月的第几周
function getWeekInMonth(t) {
  if (t == undefined || t == "" || t == null) {
    t = new Date();
  } else {
    var _t = new Date();
    t = new Date(t);
    _t.setYear(t.getFullYear());
    _t.setMonth(t.getMonth());
    _t.setDate(t.getDate());

    var date = _t.getDate(); //给定的日期是几号

    _t.setDate(1);
    var d = _t.getDay(); //1. 得到当前的1号是星期几。
    var fisrtWeekend = d;
    if (d == 0) {
      fisrtWeekend = 1;
      //1号就是星期天
    } else {
      fisrtWeekend = 7 - d + 1; //第一周的周未是几号
    }
    if (date <= fisrtWeekend) {
      return 1;
    } else {
      return 1 + Math.ceil((date - fisrtWeekend) / 7);
    }
  }
}

// 选择周
const weekFormat = ref("YYYY [年 第] ww [周]");

function weekChange(data) {
  let curDate = moment(data).clone().endOf("isoWeek").format("YYYY-MM-DD");

  let week = getWeekInMonth(curDate);
  let weekRange = getWeekStartAndEnd(data);
  // let curDate =weekRange[1]
  weekFormat.value =
    new Date(curDate).getFullYear() +
    " 年 " +
    String(Number(new Date(curDate).getMonth()) + 1) +
    " 月 第 " +
    week +
    " 周 ";
  formData.timeList = weekRange;
}

// 选择季度赋值
function seasonChange(year, season, dataValue) {
  let value = [];
  if (season == 1) {
    value = [`${year}-01`, `${year}-03`];
  } else if (season == 2) {
    value = [`${year}-04`, `${year}-06`];
  } else if (season == 3) {
    value = [`${year}-07`, `${year}-09`];
  } else if (season == 4) {
    value = [`${year}-10`, `${year}-12`];
  }
  formData["timeList"] = value;
}

const listOptions = reactive({
  serviceAreaList: [],
  statusList: [
    { label: "正常", value: "2" },
    { label: "异常", value: "1" },
  ],
  periodList: [],
});
const tableRef = ref(null); //列表ref
const tableData = ref([]); //列表数据
const page = ref(1); // 当前页
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 列表总条数
const aedData = ref({}); // 详情弹窗数据
const aedVisible = ref(false); // 详情弹窗显示
const companyList = ref([]); // 公司下拉数据
const lineTree = ref([]); // 路段下拉数据
const lineAll = ref([]); // 路线下拉数据
const lineProps = { multiple: true, value: "label" };

const stationList = ref([]);

const operationList = ref([]);
const bigScreenData = ref({}); //大屏数据

onMounted(() => {
  getDictionary();
  getData();
  nextTick(() => {
    tableHeight.value =
      63 + 32 + 71 + searchFormDom.value.offsetHeight + 52 + 50;
  });
});
onActivated(async () => {
  await getDictionary();
  await valueBasedQuery();
  // await jumpSearchFormChange();
  await getData();
});
// 充电可视化跳转计算季度
function getDateInfo(startDateStr, endDateStr) {
  // 解析函数
  const parse = (str) => {
    const [y, m] = str.split("-").map(Number);
    return { year: y, month: m, totalMonths: y * 12 + m };
  };

  // 解析日期
  const start = parse(startDateStr);
  const end = parse(endDateStr);

  return {
    startYear: start.year,
    endYear: end.year,
    year: start.year, // 默认返回开始年份
    monthDiff: end.totalMonths - start.totalMonths,
  };
}
// 带值查询
const valueBasedQuery = async (val) => {
  // if (store.chargeReportData) {
  //   bigScreenData.value = store.chargeReportData;
  //   formData.selectTimeType = bigScreenData.value.selectTimeType;
  //   console.log(formData.selectTimeType, "formData.selectTimeType");
  // }
  if (!route.query || Object.keys(route.query).length === 0) {
    const timeTypeMap = {
      2: "1", // 周
      3: "2", // 月
      4: "3", // 季
      5: "4", // 年
      6: "5", // 其他
    };
    bigScreenData.value = store.chargeReportData;
    const mappedCode = timeTypeMap[bigScreenData.value.selectTimeType];
    formData.selectTimeType = mappedCode;
    if (mappedCode == "0") {
      formData.time = moment().subtract(1, "day").format("YYYY-MM-DD");
    } else if (mappedCode == "1") {
      formData.time = moment().format("YYYY-MM-DD");
      let startDate = moment(formData.time)
        .clone()
        .startOf("isoWeek")
        .format("YYYY-MM-DD");
      let weekEnd = moment(formData.time)
        .clone()
        .endOf("isoWeek")
        .format("YYYY-MM-DD");
      formData.timeList = [startDate, weekEnd];
    } else if (mappedCode == "2") {
      formData.time = moment().format("YYYY-MM");
    } else if (mappedCode == "3") {
      await nextTick(() => {
        let nowYear = moment().year();
        let nowQuarter = moment().quarter();
        seasonSelect.value.getDefaultTimeNow();
        seasonChange(nowYear, nowQuarter, "");
      });
    } else if (mappedCode == "4") {
      formData.time = moment().format("YYYY");
    } else if (mappedCode == "5") {
      formData.timeList = [
        bigScreenData.value.dateRange[0],
        bigScreenData.value.dateRange[1],
      ];
    }
    formData.serviceName = bigScreenData.value.serviceAreaIdList
      ? bigScreenData.value.serviceAreaIdList
      : [];
    formData.serviceAreaId = Array.isArray(
      bigScreenData.value.serviceAreaIdList
    )
      ? bigScreenData.value.serviceAreaIdList.join(",")
      : bigScreenData.value.serviceAreaIdList;
  } else {
    formData.selectTimeType =
      route.query && route.query.selectTimeType
        ? route.query.selectTimeType
        : "0";

    formData.serviceName =
      route.query && route.query.serviceAreaIdList
        ? route.query.serviceAreaIdList
        : route.query && route.query.serviceAreaId
        ? route.query.serviceAreaId.split(",")
        : [];

    formData.serviceAreaId = Array.isArray(route.query?.serviceAreaIdList)
      ? route.query.serviceAreaIdList.join(",")
      : route.query?.serviceAreaIdList ??
        (Array.isArray(route.query?.serviceAreaId)
          ? route.query.serviceAreaId.join(",")
          : "");
    if (route.query.selectTimeType == "3") {
      const result = getDateInfo(
        route.query.timeList[0],
        route.query.timeList[1]
      );
      nextTick(() => {
        seasonSelect.value.getDefaultTimeNow();
        seasonChange(result.year, result.monthDiff, "");
      });
    }
    if (route.query.time) {
      formData.time = route.query.time;
    } else if (route.query.timeList) {
      formData["timeList"] = route.query.timeList;
    } else {
      formData.time = moment().subtract(1, "day").format("YYYY-MM-DD");
    }
  }
};

// 获取字典数据
const getDictionary = () => {
  // 获取服务区
  getServiceArea()
    .then(({ code, data }) => {
      if (code == 200) {
        listOptions.serviceAreaList = data.records;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  // 公司
  getCompany().then((res) => {
    companyList.value = res.data.records;
  });

  // getRoadLineTreeList().then((res) => {
  //   lineTree.value = res?.data?.records;
  // });

  // 路线
  getRoadLineAllList().then((res) => {
    console.log(res, "res");
    lineAll.value = res?.data?.records;
  });
  // // 电站
  // getStationList().then((res) => {
  //   console.log(res, 'stationList res')
  //   stationList.value = res?.data?.records;
  // })
  // // 运营单位
  // getOperationList().then((res) => {
  //   console.log(res, 'stationList res')
  //   operationList.value = res?.data?.records;
  // })
};

// 排序字段
const orderColumn = ref({
  column: null,
  order: null,
});
const handleSortChange = ({ column, prop, order }) => {
  console.log(column, prop, order);
  if (order) {
    let newColumn = camelToSnake(prop);
    orderColumn.value = {
      column: newColumn,
      order: order,
    };
    page.value = 1;
  } else {
    orderColumn.value = {
      column: null,
      order: null,
    };
  }
  getData();
};

function flattenArray(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flattenArray(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

//获取列表数据
const getData = async () => {
  loading.value = true;
  tableData.value = [];
  timestamp.value = new Date().getTime();
  const params = {
    index: page.value,
    size: pageSize.value,
    ...formData,
    ...orderColumn.value,
    order: orderColumn.value.order === "descending" ? "desc" : "asc",
  };

  let res = await getChargeReportServiceAreaList(params);
  if (res.code == 200) {
    tableData.value = res.data.records;
    // 处理服务区名称显示
    tableData.value.forEach((item) => {
      if (item.serviceAreaId) {
        const serviceArea = listOptions.serviceAreaList.find(
          (service) => service.value === item.serviceAreaId
        );
        if (serviceArea) {
          item.serviceAreaName = serviceArea.label;
        }
      }
    });
    total.value = Number(res.data.total);
  }
  loading.value = false;
};
// 查询重置
const onReset = () => {
  Object.keys(formData).map((key) => {
    formData[key] = null;
  });
  formData.selectTimeType = "0";
  formData.serviceName = [];
  formData.serviceAreaId = null;
  page.value = 1;
  pageSize.value = 10;
  getData();
};
// 列表分页-当前页改变
const handleCurrentChange = (val) => {
  page.value = val;
  getData();
};
// 列表分页-每页显示条数改变
const handleSizeChange = (val) => {
  pageSize.value = val;
  getData();
};
// 列表详情
const handleDetail = (data) => {
  aedVisible.value = true;
  aedData.value = data ? data : {};
};

// 详情弹窗关闭
const aedClose = () => {
  aedVisible.value = false;
  getData();
};
// 导出
const doExport = () => {
  exportShow.value = true;
};

function exportExcel(fileList) {
  const params = {
    ...formData,
    ...orderColumn.value,
    order: orderColumn.value.order === "descending" ? "desc" : "asc",
    fieldList: fileList,
  };

  exportData("/rmt/chargeReportServiceArea/export", "服务区维度", params);
  exportShow.value = false;
}

const tableHeight = ref();
const searchFormDom = useTemplateRef("searchRef");
</script>

<style lang="less" scoped>
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}

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

  .func_btn_box {
    margin-bottom: 10px;
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
        content: "";
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

::v-deep(.season > span > .el-input) {
  width: 100% !important;
}
</style>
