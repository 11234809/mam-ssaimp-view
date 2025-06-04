<!-- 危化品停留时长统计 -->
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
                v-model="formData.orgIds"
                multiple
                filterable
                placeholder="请选择公司"
                clearable
                @change="companyChange"
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
            <el-form-item label="路线" label-width="80px" class="form_item">
              <el-select
                collapse-tags
                collapse-tags-tooltip
                v-model="formData.roadRoute"
                multiple
                filterable
                placeholder="请选择路线"
                clearable
                @change="roadRouteChange"
              >
                <el-option
                  v-for="(item, index) in lineAll"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="服务区" label-width="80px" class="form_item">
              <el-select
                v-model="formData.serviceAreaIds"
                :reserve-keyword="false"
                multiple
                filterable
                placeholder="请选择服务区"
                clearable
                collapse-tags
                collapse-tags-tooltip
              >
                <el-option
                  v-for="(item, index) in listOptions.serviceAreaList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

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
      <el-button type="primary" @click="doExport">
        <el-icon>
          <Download />
        </el-icon>
        <span>导出</span>
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="loading"
      class="custom_table"
      ref="tableRef"
      :max-height="`calc(100vh - ${tableHeight}px)`"
      @sort-change="handleSortChange"
      border
      :data="tableData"
      :span-method="arraySpanMethod"
      style="width: 100%"
    >
      <!-- <el-table-column type="index" fixed label="序号" width="60" align="center"/> -->
      <el-table-column
        prop="companyName"
        fixed
        label="公司"
        min-width="140"
        align="center"
      />
      <el-table-column
        prop="roadName"
        fixed
        label="路线"
        min-width="140"
        align="center"
      />
      <el-table-column
        prop="serviceAreaName"
        fixed
        label="服务区"
        min-width="140"
        align="center"
      />
      <el-table-column
        prop="totalCount"
        fixed
        label="总数"
        width="140"
        sortable="custom"
        align="center"
      >
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span> 总数 </span>
              <el-popover
                placement="top-start"
                content="总数表示由服务区点击是否是危化品车辆的数目之和"
                effect="dark"
                width="auto"
                trigger="hover"
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
        <template #default="scope">
          <el-link type="primary" @click="toDetail(scope.row,2)">{{
            scope.row.totalCount
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="isDangerTotalCount"
        fixed
        label="确定为危化品总数"
        width="140"
        sortable="custom"
        align="center"
      >
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span> 确定为危化品总数 </span>
              <el-popover
                placement="top-start"
                content="确定为危化品那总数表示由服务区点击是否是危化品时，选择是的危化品车辆数目之和"
                effect="dark"
                width="auto"
                trigger="hover"
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
        <template #default="scope">
          <el-link type="primary" @click="toDetail(scope.row,1)">{{
            scope.row.isDangerTotalCount
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="5分钟" width="140" align="center">
        <el-table-column
          prop="zeroToFiveCount"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.zeroToFiveCount
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="zeroToFiveRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.zeroToFiveRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="5-10分钟" width="140" align="center">
        <el-table-column
          prop="fiveToTenCount"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.fiveToTenCount
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="fiveToTenRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.fiveToTenRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="10-15分钟" width="140" align="center">
        <el-table-column
          prop="tenToFifCount"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.tenToFifCount
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="tenToFifRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.tenToFifRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="15-20分钟" width="140" align="center">
        <el-table-column
          prop="fifToTwenCount"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.fifToTwenCount
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="fifToTwenRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.fifToTwenRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="20-30分钟" width="140" align="center">
        <el-table-column
          prop="twenToThirtyCount"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.twenToThirtyCount
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="twenToThirtyRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.twenToThirtyRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="30-40分钟" width="140" align="center">
        <el-table-column
          prop="thirtyToFortyCount"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.thirtyToFortyCount
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="thirtyToFortyRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.thirtyToFortyRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="40-50分钟" width="140" align="center">
        <el-table-column
          prop="fortyToFiftyCount"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.fortyToFiftyCount
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="fortyToFiftyRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.fortyToFiftyRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="50-60分钟" width="140" align="center">
        <el-table-column
          prop="fiftyToSixtyCount"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.fiftyToSixtyCount
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="fiftyToSixtyRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.fiftyToSixtyRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="1-2小时" width="140" align="center">
        <el-table-column
          prop="oneToTwoCount"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.oneToTwoCount
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="oneToTwoRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.oneToTwoRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="2-6小时" width="140" align="center">
        <el-table-column
          prop="twoToSixCount"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.twoToSixCount
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="twoToSixRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.twoToSixRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="6小时以上" width="140" align="center">
        <el-table-column
          prop="sixCount"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.sixCount
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="sixRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.sixRate
            }}</el-link>
          </template>
        </el-table-column>
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
    <!-- <ExportDialog v-model="exportShow" :list="exportList" @closeModal="closeModal" @export="exportExcel"/> -->
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
} from "vue";
//   import DetailDialog from "./detail-dialog";
import { DateQuarter } from "mam-base-ui";
import { getServiceArea } from "@/api/dictionaryApi.js";
import { exportData, exportFormatData } from "@/utils/common-features";
import { getCompany } from "@/api/informationServiceAreaApi.js";
import moment from "moment";
import { camelToSnake } from "@/utils/index";
import {
  getQueryPage,
  getRoadLineList,
  getRoadLineServiceArea,
} from "@/api/stayDuration/index.js";
import {
  getChargeReportServiceAreaList,
  getRoadLineAllList,
} from "@/api/powerStation/index.js";
import ExportDialog from "../../rmt/components/export-dialog/index.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const loading = ref(false);
const exportShow = ref(false);
const timestamp = ref(new Date().getTime());

function closeModal() {
  exportShow.value = false;
}
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
// 查询联动
const companyChange = (val) => {
  let companys = val.join(",");
  // 公司-线路的联动数据
  getRoadLineList({
    orgIds: companys ?? "",
    highSpeed:
      formData.roadRoute && formData.roadRoute.length > 0
        ? formData.roadRoute.join(",")
        : "",
    serviceAreaIds:
      formData.serviceAreaIds && formData.serviceAreaIds.length > 0
        ? formData.serviceAreaIds.join(",")
        : "",
  }).then((res) => {
    lineAll.value = res?.data?.records;
  });

  // 公司-服务区的联动数据
  getRoadLineServiceArea({
    orgIds: companys ?? "",
    serviceAreaIds:
      formData.serviceAreaIds && formData.serviceAreaIds.length > 0
        ? formData.serviceAreaIds.join(",")
        : "",
    highSpeed:
      formData.roadRoute && formData.roadRoute.length > 0
        ? formData.roadRoute.join(",")
        : "",
  }).then((res) => {
    listOptions.serviceAreaList = res?.data?.records;
  });
};
const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex === 0) {
    if (columnIndex === 0) {
      return [1, 3];
    } else if (columnIndex === 1) {
      return [0, 0];
    } else if (columnIndex === 2) {
      return [0, 0];
    }
  }
};
// 路段联动
const roadRouteChange = (val) => {
  let railways = val.join(",");
  // 公司-服务区的联动数据
  getRoadLineServiceArea({
    orgIds:
      formData.orgIds && formData.orgIds.length > 0
        ? formData.orgIds.join(",")
        : "",
    serviceAreaIds:
      formData.serviceAreaIds && formData.serviceAreaIds.length > 0
        ? formData.serviceAreaIds.join(",")
        : "",
    highSpeed: railways ?? "",
  }).then((res) => {
    listOptions.serviceAreaList = res?.data?.records;
  });
};
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
      moment().subtract(1, 'days').format("YYYY-MM-DD"),
      moment().subtract(1, 'days').format("YYYY-MM-DD"),
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

const formData = reactive({
  selectTimeType: "0",
});
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


const operationList = ref([]);

// 跳转
const { proxy } = getCurrentInstance();
const toDetail = (row,carType) => {
  let data = {
    startTime: row.startTime,
    endTime: row.endTime,
    time: formData.time,
    timeList: formData.timeList,
    selectTimeType: formData.selectTimeType,
    company: row.company, //公司
    highSpeed: row.road, //路线
    serviceAreaId: row.serviceArea, //服务区
    carType: carType, //车辆类型
  };
  proxy.$Bus.emit("jumpAgency", { url: "/bas/dangerCar", data: data });
};
// 获取字典数据
const getDictionary = () => {
  // 获取服务区
  getRoadLineServiceArea()
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
  getRoadLineList().then((res) => {
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

  let res = await getQueryPage(params);
  if (res.code == 200) {
    tableData.value = res.data.records;
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
  // formData.time = moment().subtract(1, 'day').format('YYYY-MM-DD');
  page.value = 1;
  pageSize.value = 10;
  getData();
  getDictionary();
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
const doExport = (fileList) => {
  // exportShow.value = true;
  const params = {
    ...formData,
    ...orderColumn.value,
    order: orderColumn.value.order === "descending" ? "desc" : "asc",
  };
  exportFormatData(
    "/bas/stayDuration/exportXls",
    "危化品分类统计",
    params,
    formData.selectTimeType,
    weekFormat.value,
    seasonSelect.value?.showValue
  );
};

// function exportExcel(fileList) {
//   const params = {
//     ...formData,
//     ...orderColumn.value,
//     order: orderColumn.value.order === "descending" ? "desc" : "asc",
//     fieldList: fileList,
//   };
//   exportData("/rmt/chargeReportServiceArea/export", "危化品分类统计", params);
//   exportShow.value = false;
// }

const tableHeight = ref();
const searchFormDom = useTemplateRef("searchRef");
onMounted(() => {
  formData.time = moment().subtract(1, "day").format("YYYY-MM-DD");
  getDictionary();
  getData();

  nextTick(() => {
    tableHeight.value =
      63 + 32 + 71 + searchFormDom.value.offsetHeight + 52 + 50;
  });
});
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
