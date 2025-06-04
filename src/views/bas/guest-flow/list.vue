<!-- 客流量统计 -->
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
          <el-col :span="7">
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
          <el-col :span="7" v-if="!formData.selectTimeType"> </el-col>
          <el-col :span="7" v-if="formData.selectTimeType == '6'">
            <el-form-item label="小时" label-width="80px" class="form_item">
              <el-select
                v-model="formData.hour"
                placeholder="请选择小时"
                @change="hourChange(formData.hour)"
              >
                <el-option
                  v-for="item in hourList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" v-if="formData.selectTimeType == '0'">
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
          <el-col :span="7" v-if="formData.selectTimeType == '1'">
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
          <el-col :span="7" v-if="formData.selectTimeType == '2'">
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
          <el-col :span="7" v-if="formData.selectTimeType == '3'">
            <el-form-item label="统计时间" label-width="80px" class="form_item" style="width: 100%">
              <DateQuarter
                style="width: 100%"
                ref="seasonSelect"
                placeholder="请选择季度"
                @chooseSeason="seasonChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7" v-if="formData.selectTimeType == '4'">
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
          <el-col :span="7" v-if="formData.selectTimeType == '5'">
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

          <el-col :span="7">
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
                  v-for="(item, index) in companyListMap"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="路线" label-width="80px" class="form_item">
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
          <el-col :span="7">
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
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
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
        fixed
        prop="companyName"
        label="公司名称"
        min-width="140"
        align="center"
      />
      <el-table-column
        fixed
        prop="serviceAreaName"
        label="服务区名称"
        min-width="140"
        align="center"
      />
      <el-table-column
        fixed
        prop="railway"
        label="路线名称"
        width="140"
        align="center"
      />
      <el-table-column
        fixed
        prop="totalPassFlow"
        width="100"
        label="总客流量"
        align="center"
      />
      <el-table-column label="小孩" width="140" align="center">
        <el-table-column
          prop="kidNum"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.kidNum
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="kidRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.kidRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="青年" width="140" align="center">
        <el-table-column
          prop="adultNum"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.adultNum
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="adultRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.adultRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="中年" width="140" align="center">
        <el-table-column
          prop="midNum"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.midNum
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="midRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.midRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="老年" width="140" align="center">
        <el-table-column
          prop="oldNum"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.oldNum
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="oldRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.oldRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="其他" width="140" align="center">
        <el-table-column
          prop="otherNum"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.otherNum
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="otherRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.otherRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="男性" width="140" align="center">
        <el-table-column
          prop="manNum"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.manNum
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="manRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.manRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="女性" width="140" align="center">
        <el-table-column
          prop="womanNum"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.womanNum
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="womanRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.womanRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="未识别" width="140" align="center">
        <el-table-column
          prop="unknownNum"
          sortable="custom"
          label="数量"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.unknownNum
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="unknownRate"
          sortable="custom"
          label="占比（%）"
          width="120"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">{{
              scope.row.unknownRate
            }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        v-if="formData.selectTimeType != '6' && formData.selectTimeType != '0'"
        label="日均客流量"
        prop="averageFlow"
        width="140"
        align="center"
      >
        <template #default="scope">
          <el-link type="primary" @click="toDetail(scope.row)">{{
            scope.row.averageFlow
          }}</el-link>
        </template>
      </el-table-column>

      <!--
      <el-table-column prop="transformerCapacity" label="变压器容量" width="140" align="center"/>
      <el-table-column prop="equipmentNum" label="充电桩数量" width="120" sortable align="center"/>
      <el-table-column prop="connectionNum" label="充电枪数量" width="120" sortable align="center"/>
      <el-table-column prop="isRelated" label="随手查关联枪数" sortable width="160" align="center"/>
      <el-table-column prop="chargeElec" label="充电量(kWh)" width="140" sortable align="center"/>
      <el-table-column prop="chargeFee" label="充电电费(元)" width="160" sortable align="center"/>
      <el-table-column prop="chargeServiceFee" label="充电服务费(元)" width="160" sortable align="center"/>
      <el-table-column prop="chargeNum" label="充电次数" width="140" sortable align="center"/>
      <el-table-column prop="chargeTime" label="充电时长(h)" width="160" sortable align="center"/>
      <el-table-column prop="chargeTimeRate" label="时长利用率(%)" width="170" sortable align="center">
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span>
                时长利用率(%)
              </span>
              <el-popover placement="top-start" title="时长利用率(%)" effect="dark" width="auto" trigger="hover"
                          content="（求和（状态为充电中的枪*充电时长）/所有枪*24）">
                <template #reference>
                  <el-icon color="#fa8c16" size="18">
                    <QuestionFilled/>
                  </el-icon>
                </template>
              </el-popover>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="capacityRate" label="容量利用率(%)" width="170" sortable align="center">
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span>
                容量利用率(%)
              </span>
              <el-popover placement="top-start" title="容量利用率(%)" effect="dark" width="auto" trigger="hover"
                          content="（求和（电量）/功率*24）">
                <template #reference>
                  <el-icon color="#fa8c16" size="18">
                    <QuestionFilled/>
                  </el-icon>
                </template>
              </el-popover>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="chargeTimeAvg" label="平均充电时长(h)" width="180" sortable align="center">
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span>
                平均充电时长(h)
              </span>
              <el-popover placement="top-start" title="平均充电时长(h)" effect="dark" width="auto" trigger="hover"
                          content="（总充电时长/总次数）">
                <template #reference>
                  <el-icon color="#fa8c16" size="18">
                    <QuestionFilled/>
                  </el-icon>
                </template>
              </el-popover>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="chargeFeeAvg" label="平均充电电价(元)" width="180" sortable align="center">
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span>
                平均充电电价(元)
              </span>
              <el-popover placement="top-start" title="平均充电电价(元)" effect="dark" width="auto" trigger="hover"
                          content="（充电订单总电费/总电量）">
                <template #reference>
                  <el-icon color="#fa8c16" size="18">
                    <QuestionFilled/>
                  </el-icon>
                </template>
              </el-popover>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="chargeServiceFeeAvg" label="平均服务费价格(元)" width="190" sortable align="center">
        <template #header>
          <div style="display: flex; align-items: center">
            <span style="display: flex; align-items: center">
              <span>
                平均服务费价格(元)
              </span>
              <el-popover placement="top-start" title="平均服务费价格(元)" effect="dark" width="auto" trigger="hover"
                          content="（充电订单总服务区/总电量）">
                <template #reference>
                  <el-icon color="#fa8c16" size="18">
                    <QuestionFilled/>
                  </el-icon>
                </template>
              </el-popover>
            </span>
          </div>
        </template>
      </el-table-column> -->
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
import { useRouter } from "vue-router";
const router = useRouter();
import {
  getQueryPage,
  getRoadLineAllList,
  getRoadLineList,
  getRoadLineServiceArea,
} from "@/api/guestFlow/index.js";
// import { getRoadLineAllList} from "@/api/powerStation/index.js";

import ExportDialog from "../../rmt/components/export-dialog/index.vue";

const loading = ref(false);
const exportShow = ref(false);
const timestamp = ref(new Date().getTime());

function closeModal() {
  exportShow.value = false;
}
const hourList = ref([
  {
    value: "00",
    label: "00",
  },
  {
    value: "01",
    label: "01",
  },
  {
    value: "02",
    label: "02",
  },
  {
    value: "03",
    label: "03",
  },
  {
    value: "04",
    label: "04",
  },
  {
    value: "05",
    label: "05",
  },
  {
    value: "06",
    label: "06",
  },
  {
    value: "07",
    label: "07",
  },
  {
    value: "08",
    label: "08",
  },
  {
    value: "09",
    label: "09",
  },
  {
    value: "10",
    label: "10",
  },
  {
    value: "11",
    label: "11",
  },
  {
    value: "12",
    label: "12",
  },
  {
    value: "13",
    label: "13",
  },
  {
    value: "14",
    label: "14",
  },
  {
    value: "15",
    label: "15",
  },
  {
    value: "16",
    label: "16",
  },
  {
    value: "17",
    label: "17",
  },
  {
    value: "18",
    label: "18",
  },
  {
    value: "19",
    label: "19",
  },
  {
    value: "20",
    label: "20",
  },
  {
    value: "21",
    label: "21",
  },
  {
    value: "22",
    label: "22",
  },
  {
    value: "23",
    label: "23",
  },
]);
const exportList = ref([
  {
    value: "serviceAreaName",
    label: "服务区",
    checked: true,
  },
  {
    value: "serviceAreaCode",
    label: "总数",
    checked: true,
  },
  {
    value: "companyName",
    label: "确定为危化品总数",
    checked: true,
  },
  {
    value: "roadRoute",
    label: "易燃易爆",
    checked: true,
  },

  {
    value: "transformerCapacity",
    label: "腐蚀品",
    checked: true,
  },
  {
    value: "transformerCapacity",
    label: "有毒品",
    checked: true,
  },
  {
    value: "equipmentNum",
    label: "压缩气体和液化气体",
    checked: true,
  },
  {
    value: "connectionNum",
    label: "易燃液体",
    checked: true,
  },
  {
    value: "isRelated",
    label: "易燃固体",
    checked: true,
  },

  {
    value: "chargeElec",
    label: "自燃物品和遇湿易燃物品",
    checked: true,
  },
  {
    value: "chargeFee",
    label: "放射性物品",
    checked: true,
  },
  {
    value: "chargeServiceFee",
    label: "空车",
    checked: true,
  },
  {
    value: "chargeNum",
    label: "00:00-06:00",
    checked: true,
  },
  {
    value: "chargeTime",
    label: "06:00-08:00",
    checked: true,
  },

  {
    value: "chargeTimeRate",
    label: "08:00-10:00",
    checked: true,
  },
  {
    value: "capacityRate",
    label: "10:00-12:00",
    checked: true,
  },
  {
    value: "chargeTimeAvg",
    label: "12:00-14:00",
    checked: true,
  },
  {
    value: "chargeFeeAvg",
    label: "14:00-16:00",
    checked: true,
  },
  {
    value: "chargeServiceFeeAvg",
    label: "16:00-18:00",
    checked: true,
  },
  {
    value: "chargeServiceFeeAvg",
    label: "18:00-20:00",
    checked: true,
  },
  {
    value: "chargeServiceFeeAvg",
    label: "20:00-22:00",
    checked: true,
  },
  {
    value: "chargeServiceFeeAvg",
    label: "22:00-24:00",
    checked: true,
  },
]);

const selectTimeTypeList = [
  {
    name: "小时",
    code: "6",
  },
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
// 查询联动
const companyChange = (val) => {
  let companys = val.join(",");
  // 公司-线路的联动数据
  getRoadLineList({
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
// 路段联动
const railwayChange = (val) => {
  let railways = val.join(",");
  // 公司-服务区的联动数据
  getRoadLineServiceArea({
    orgIds:
      formData.orgIds && formData.orgIds.length > 0
        ? formData.orgIds.join(",")
        : "",
    highSpeed: railways,
    serviceAreaIds:
      formData.serviceAreaIds && formData.serviceAreaIds.length > 0
        ? formData.serviceAreaIds.join(",")
        : "",
  }).then((res) => {
    listOptions.serviceAreaList = res?.data?.records;
  });
};
const seasonSelect = ref();
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
async function selectTimeTypeChange() {
  formData.time = "";
  formData.timeList = [];
  if (formData.selectTimeType == "0") {
    formData.time = moment().subtract(0, "day").format("YYYY-MM-DD");
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

// 选择小时
const hourFormat = ref("YYYY-MM-DD HH");
function hourChange(data) {
  hourFormat.value = moment(data).format("YYYY-MM-DD日HH小时");
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
const companyListMap = ref([]); // 公司下拉数据
const lineTree = ref([]); // 路段下拉数据
const lineAll = ref([]); // 路线下拉数据
const lineProps = { multiple: true, value: "label" };

const stationList = ref([]);

const operationList = ref([]);

// 跳转
const { proxy } = getCurrentInstance();
const toDetail = (row) => {
  console.log(row, "row");
  let data = {
    startTime: row.startTime,
    endTime: row.endTime,
    time: formData.time,
    timeList: formData.timeList,
    selectTimeType: formData.selectTimeType,
    companyId: row.companyId, //公司
    roadId: row.roadId, //路线
    serviceAreaName: row.serviceAreaName, //服务区（注：跳转页面是中文筛选，故传中文）
  };
  proxy.$Bus.emit("jumpAgency", { url: "/bas/peopleFlow", data: data });
  // router.push({
  //   path: "/bas/peopleFlow",
  //   query: {
  //     time: formData.time,
  //     timeList: formData.timeList,
  //     selectTimeType: row.selectTimeType,
  //     companyId: row.companyId, //公司
  //     roadId: row.roadId, //路线
  //     serviceAreaName: row.serviceAreaName, //服务区（注：跳转页面是中文筛选，故传中文）
  //   },
  // });
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
    companyListMap.value = res.data.records;
  });

  // 路线
  getRoadLineList().then((res) => {
    lineAll.value = res?.data?.records;
  });
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

//获取列表数据
const getData = async () => {
  loading.value = true;
  tableData.value = [];
  timestamp.value = new Date().getTime();
  if (formData.selectTimeType == "6") {
    formData.time = moment().subtract(0, "day").format("YYYY-MM-DD");
  }
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
    // fieldList: fileList,
  };
  exportFormatData(
    "/bas/guestFlow/exportXls",
    "客流量统计",
    params,
    formData.selectTimeType,
    weekFormat.value,
    seasonSelect.value?.showValue
  );
};

function exportExcel(fileList) {
  const params = {
    ...formData,
    ...orderColumn.value,
    order: orderColumn.value.order === "descending" ? "desc" : "asc",
    fieldList: fileList,
  };

  exportData("/rmt/chargeReportServiceArea/export", "危化品分类统计", params);
  exportShow.value = false;
}

const tableHeight = ref();
const searchFormDom = useTemplateRef("searchRef");
onMounted(() => {
  formData.time = moment().subtract(0, "day").format("YYYY-MM-DD");
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
