<template>
  <el-dialog style="margin: 132px auto 5vh auto;" v-bind="$attrs" title="充电站详情" width="60%" :before-close="handleClose"
    :close-on-click-modal="false" draggable destroy-on-close :lock-scroll="false">
    <el-scrollbar style="height: calc(100vh - 132px * 2 - 60px)">
      <div>
        <el-descriptions class="margin-top" :title="info?.stationName || '-'" :column="2" size="large" border>
          <el-descriptions-item v-for="item in itemInfo" :key="item.label">
            <template #label>
              <div class="cell-item">
                {{ item.label }}
              </div>
            </template>
            <span>
              {{ item.key && info ? info[item.key] : '-' }} {{ item?.unit }}
            </span>

          </el-descriptions-item>
        </el-descriptions>

        <div>
          <el-radio-group v-model="tabValue" size="large" style="margin: 10px 0">
            <el-radio-button label="1">充电桩信息</el-radio-button>
            <el-radio-button label="2">充电枪信息</el-radio-button>
          </el-radio-group>
          <el-table v-if="tabValue === '1'" :data="tableData" border max-height="300">
            <!--          设备编码、设备名称、设备型号、设备类型、设备总功率、充电枪数、归属商户-->
            <el-table-column prop="equipmentId" label="设备编码" align="center" />
            <el-table-column prop="equipmentName" label="设备名称" align="center" />
            <el-table-column prop="equipmentModel" label="设备型号" align="center" />
            <el-table-column prop="equipmentType" label="设备类型" align="center" />
            <el-table-column label="设备总功率" align="center">
              <template #default="{ row }">
                <span>{{ row.power }}
                  <span :style="{ color: row.power >= 480 ? 'red' : '#909399' }">
                    （{{ row.power >= 480 ? '超充站' : '非超充站' }}）
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="connNum" label="充电枪数" align="center" />
            <el-table-column prop="opreateUnite" label="归属商户" align="center" />
          </el-table>
          <el-table v-else :data="tableData1" border max-height="300">
            <el-table-column prop="connectorId" label="终端编码" align="center" />
            <el-table-column prop="connectorName" label="终端名称" align="center" />
            <el-table-column prop="stationName" label="归属电站" align="center" />
            <el-table-column prop="enableStatus" label="终端启停" align="center">
              <template #default="scope">
                <div class="flex">
                  <span class="dot" :class="{ 'danger': scope.row.enableStatus != '启用' }"></span>
                  <span>{{ scope.row.enableStatus }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" width="140" label="工作状态" align="center">
              <template #default="scope">
                <div class="flex">
                  <span class="dot" :class="{ 'danger': scope.row.status != '空闲' }"></span>
                  <span>{{ scope.row.status }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="operatorName" label="归属商户" align="center" />
            <el-table-column prop="equipmentModel" label="品牌" :formatter="equipmentModelFormatter" align="center" />
            <el-table-column prop="isRelationSsc" width="180" label="是否关联随手查" align="center">
              <template #default="{ row }">
                <div style="display: flex; align-items: center; margin: 4px 10px">
                  <el-tag> {{ row?.isRelationSsc ? '是' : '否' }}</el-tag>

                  <el-button type="primary" style="margin-left: 4px;" @click="statusBtn(row)">关联随手查</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { defineEmits, defineExpose, h, ref } from "vue";
import { ElMessage, ElMessageBox, ElSwitch } from "element-plus";
import {
  getChargeStationManageConnector,
  getChargeStationManageDetails,
  getChargeStationManageEquipment,
  getChargeStationManageUpdateState
} from "@/api/powerStation";
import { getDict } from "@/api/powerStation/index.js";
const tabValue = ref('1')
const tableData = ref([])
const tableData1 = ref([])
const equipmentModelList = ref([])

const itemInfo = [
  {
    label: '电站编码',
    key: 'stationId',
  },
  {
    label: '支付方式',
    key: 'payment',
  }, {
    label: '归属商户',
    key: 'operatorName',
  }, {
    label: '周边环境',
    key: 'environment',
  },
  {
    label: '电站位置',
    key: 'environment',
    unit: '电站'
  }, {
    label: '电站地址',
    key: 'address',
  }, {
    label: '电站类型',
    key: 'stationType',
  }, {
    label: '停车收费模式',
    key: 'parkType',
  },
  {
    label: '建设场所',
    key: 'construction',
  },
  {
    label: '周边配套设施',
    key: 'supportingFacilities'
  },
  {
    label: '站点状态',
    key: 'stationStatus'
  },
  {
    label: '停车收费提示',
    key: 'remark',
  },
  {
    label: '额定总功率',
    key: 'totalPower',
    unit: 'KV.A'
  }, {
    label: '开通运营时间',
    key: 'operateTime',
  }, {
    label: '接入平台时间',
    key: 'firstSaveTime',
  },
  {
    label: '7*24小时营业',
    key: 'roundTheClock',
  }, {
    label: '站点电话',
    key: 'stationTel',
  }, {
    label: '服务电话',
    key: 'serviceTel',
  },
]

const emit = defineEmits(["close"]);

const handleClose = () => {
  emit("close");
};

const loading = ref(false);


function statusBtn(row) {
  const checked = ref(row.isRelationSsc)
  ElMessageBox.confirm('关联随手查', 'Warning', {
    title: '关联随手查',
    // Should pass a function if VNode contains dynamic props
    closeOnClickModal: false,
    lockScroll: false,
    confirmButtonClass: 'charge-station-manage-confirm-button',
    message: () =>
      h(ElSwitch, {
        modelValue: checked.value,
        'onUpdate:modelValue': (val) => {
          checked.value = val
        },
      }),
  }).then(() => {
    const stationIdIsRelatedMap = {}
    stationIdIsRelatedMap[row.connectorId] = checked.value ? 1 : 0;
    getChargeStationManageUpdateState({
      stationIdIsRelatedMap
    }).then(res => {
      if (res?.code === 200) {
        ElMessage.success('修改成功')
        row.isRelationSsc = checked.value
      }
      console.log(res, 22222)
    })
  })

}

let statusDict = {
  0: '离网',
  1: '空闲',
  2: '占用（未充电）',
  3: '占用（充电中）',
  4: '占用（预约锁定）',
  255: '故障'
}

const info = ref()

function getData(option) {
  tabValue.value = '1'
  // 1000004 ||
  getChargeStationManageDetails({ id: option.stationId }).then((res) => {
    console.log(res, '123232322')
    info.value = res.data
  })
  getChargeStationManageEquipment({ stationId: option.stationId }).then(res => {
    tableData.value = res.data.records
  })
  getChargeStationManageConnector({ stationId: option.stationId }).then(res => {
    tableData1.value = res.data.records?.map(item => {
      return {
        ...item,
        isRelationSsc: item.isRelationSsc === 1 ? true : false
      }
    })
  })
}

defineExpose({ getData })
getDictionary()

function getDictionary() {
  // 获取品牌字典
  getDict({ queriers: [{ "alias": "stationEquipmentBrandDictionary" }] }).then(res => {
    equipmentModelList.value = res?.data?.stationEquipmentBrandDictionary;
  })
}
// 品牌返回
function equipmentModelFormatter(row) {
  let index = equipmentModelList.value.findIndex((item) => item.code === row.equipmentModel);
  return index !== -1 ? equipmentModelList.value[index].name : "";
}

</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.cell-item {
  width: 120px;
}

:deep(.el-descriptions__label.el-descriptions__cell.is-bordered-label) {
  width: 120px;
}


.flex {
  display: flex;
  align-items: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: #389e0d;
  display: inline-block;
  margin-right: 4px;
}

.dot.danger {
  background: red;
}
</style>
<style>
.el-button--primary.charge-station-manage-confirm-button {
  --el-button-bg-color: var(--btnBgColor) !important;
  background: var(--btnBgColor) !important;
}
</style>
