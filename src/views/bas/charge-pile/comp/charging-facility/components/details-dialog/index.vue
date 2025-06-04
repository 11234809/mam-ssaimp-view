<template>
  <el-dialog
      style="margin: 132px auto 5vh auto;"
      v-bind="$attrs"
      title="充电站详情"
      width="80%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      draggable
      destroy-on-close
      :lock-scroll="false"
  >
    <el-scrollbar style="height: calc(100vh - 132px * 2 - 60px)">
      <div>
        <el-descriptions
            class="margin-top"
            title="充电站基本信息"
            :column="2"
            size="large"
            border
        >
          <el-descriptions-item v-for="item in itemInfo" :key="item.label">
            <template #label>
              <div class="cell-item">
                {{ item.label }}
              </div>
            </template>
            <div style="width: 250px !important; display: block;box-sizing: border-box">
              {{ item.key && info ? info[item.key] : '-' }} {{ item?.unit }}
            </div>

          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
            class="margin-top"
            title="运营信息"
            :column="2"
            size="large"
            border
        >
          <el-descriptions-item v-for="item in itemInfo2" :key="item.label">
            <template #label>
              <div class="cell-item">
                {{ item.label }}
              </div>
            </template>
            <div style="width: 250px !important; display: block;box-sizing: border-box">
              {{ item.key && info ? info[item.key] : '-' }} {{ item?.unit }}
            </div>

          </el-descriptions-item>
        </el-descriptions>
        <div>
          <el-radio-group v-model="tabValue" size="large" style="margin: 10px 0">
            <el-radio-button label="1">充电设备信息</el-radio-button>
            <el-radio-button label="2">充电设备接口信息</el-radio-button>
          </el-radio-group>
          <el-table v-if="tabValue === '1'" :data="tableData" border style="width: 100%" max-height="300">
            <!--          设备编码、设备名称、设备型号、设备类型、设备总功率、充电枪数、归属商户-->
            <el-table-column prop="equipmentId" label="充电设备编码" min-width="150" align="center"/>
            <el-table-column prop="manufacturerId" label="组织机构代码" min-width="150" align="center"/>
            <el-table-column prop="manufacturerName" label="设备生产商名称" min-widt="150" align="center"/>
            <el-table-column prop="equipmentModel" label="设备型号" min-width="150" align="center"/>
            <el-table-column prop="productionDate" label="设备生产日期" min-widt="150" align="center"/>
            <el-table-column prop="equipmentType" label="设备类型" min-widt="150" align="center"/>
            <el-table-column prop="equipmentLng" label="经度" min-widt="80" align="center"/>
            <el-table-column prop="equipmentLat" label="纬度" min-widt="80" align="center"/>
            <el-table-column prop="power" label="充电设备总功率" min-width="180" align="center"/>
          </el-table>
          <el-table v-else :data="tableData1" border style="width: 100%" max-height="300">
            <el-table-column prop="connectorId" label="充电设备接口编码" min-width="150" align="center"/>
            <el-table-column prop="connectorName" label="充电设备接口名称" min-width="150" align="center"/>
            <el-table-column prop="connectorType" label="充电设备接口类型" min-widt="150" align="center"/>
            <el-table-column prop="voltageUpperLimits" label="额定电压上限(V)" min-widt="150" align="center"/>
            <el-table-column prop="voltageLowerLimits" label="额定电压下限(V)" min-widt="150" align="center"/>
            <el-table-column prop="current" label="额定电流(A)" min-width="150" align="center"/>
            <el-table-column prop="power" label="额定功率(KW)" min-widt="150" align="center"/>
            <el-table-column prop="nationalStandard" label="国家标准" min-width="180" align="center"/>
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
import {defineEmits, defineExpose, h, ref} from "vue";
import {ElMessage, ElMessageBox, ElSwitch} from "element-plus";
import {
  getChargeStationManageConnector,
  getChargeStationManageDetails,
  getChargeStationManageEquipment,
  getChargeStationManageUpdateState
} from "@/api/powerStation";
import {getDict} from "@/api/powerStation/index.js";
import {queryChargeEquipPageList, queryChargeEquipConnectorPageList} from "@/api/powerStation/chargePile";

const tabValue = ref('1')
const tableData = ref([])
const tableData1 = ref([])
const equipmentModelList = ref([])

const itemInfo = [
  {
    label: '服务区名称',
    key: 'serviceAreaName',
  },
  {
    label: '服务区编码',
    key: 'serAreaCode',
  }, {
    label: '公司',
    key: 'company',
  }, {
    label: '充电站编号',
    key: 'stationId',
  },
  {
    label: '充电站名称',
    key: 'stationName',
  }, {
    label: '充电站省市辖区编码',
    key: 'areaCode',
  }, {
    label: '所属地区(省)',
    key: 'provicne',
  }, {
    label: '详细地址',
    key: 'address',
  },
  {
    label: '经度',
    key: 'lng',
  },
  {
    label: '纬度',
    key: 'lat'
  },
  {
    label: '服务电话',
    key: 'serviceTel'
  },
  {
    label: '站点模式',
    key: 'stationMode',
  },
  {
    label: '站点类型',
    key: 'stationType',
  }, {
    label: '站点状态',
    key: 'stationStatus',
  },
  {
    label: '车位数量',
    key: 'parkNums',
  }
]

const itemInfo2 = [
  {
    label: '运营商名称',
    key: 'operatorName',
  },
  {
    label: '运营商客户电话',
    key: 'operatorTel1',
  }, {
    label: '运营商客户电话2',
    key: 'operatorTel2',
  }, {
    label: '运营商注册地址',
    key: 'operatorRegAddress',
  },
  {
    label: '建设场所',
    key: 'construction',
  }, {
    label: '营业时间',
    key: 'businessHours',
  }, {
    label: '支付方式',
    key: 'payment',
  }, {
    label: '是否支持预约',
    key: 'supportOrder',
  },
  {
    label: '备注',
    key: 'operatorNote',
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
  info.value = option
  // // 1000004 ||
  // getChargeStationManageDetails({id: option.stationId}).then((res) => {
  //   console.log(res, '123232322')
  //   info.value = res.data
  // })
  console.log(option, 'option')
  queryChargeEquipPageList({stationId: option.stationId}).then(res => {
    tableData.value = res.data.records
  })
  queryChargeEquipConnectorPageList({stationId: option.stationId}).then(res => {
    tableData1.value = res.data.records?.map(item => {
      return {
        ...item,
        isRelationSsc: item.isRelationSsc === 1 ? true : false
      }
    })
  })
}

defineExpose({getData})
getDictionary()

function getDictionary() {
  // 获取品牌字典
  getDict({queriers: [{"alias": "stationEquipmentBrandDictionary"}]}).then(res => {
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

:deep(.el-descriptions__header ) {
  margin-top: 20px;
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
