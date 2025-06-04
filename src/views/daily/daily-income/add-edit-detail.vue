<template>
    <el-dialog class="custom_dialog" v-model="dialogVisible" :title="title" width="1200" :close-on-click-modal="false"
        :close-on-press-escape="false" align-center :lock-scroll="false" @close="close" style="height: calc(100vh - 132px * 2)">
        <el-scrollbar style="height: calc(100vh - 132px * 2 - 120px)">
            <el-form ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules" style="width:98%"
                label-suffix="：">
                <el-row :gutter="30">
                    <el-col :span="8">
                        <!-- 服务区名称 -->
                        <el-form-item label="服务区名称" class="form_item" prop="serviceAreaId">
                            <el-select :disabled="isDisabled || type == 'edit'" v-model="dialogForm.serviceAreaId" placeholder="请选择服务区"
                                clearable>
                                <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 日报时间 -->
                        <el-form-item label="日报时间" class="form_item" prop="createDay">
                            <el-date-picker value-format="YYYY-MM-DD" :disabled="isDisabled || type == 'edit'" v-model="dialogForm.createDay" type="date"
                                placeholder="请选择日报时间" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 服务区运营状态 -->
                        <el-form-item label="服务区运营状态" class="form_item" prop="operateStatus">
                            <el-select :disabled="isDisabled" v-model="dialogForm.operateStatus" placeholder="请选择服务区运营状态"
                                clearable>
                                <el-option v-for="(item, index) in operationStatusList" :key="index" :label="item.name"
                                    :value="~~item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <div class="sub_title">
                           <el-tag style="width: 70px;"> 车流量 </el-tag>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <!-- 流量统计口径 -->
                        <el-form-item label="流量统计口径" class="form_item" prop="statisticalCaliber">
                            <el-select :disabled="isDisabled" v-model="dialogForm.statisticalCaliber" placeholder="请选择流量统计口径"
                                clearable>
                                <el-option v-for="(item, index) in trafficStatisticsList" :key="index" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 大客车流量 -->
                        <el-form-item label="大客车流量" class="form_item" prop="bigPassengerTraffic">
                            <el-input :disabled="isDisabled" v-model="dialogForm.bigPassengerTraffic" type="number" min="0"
                                placeholder="请输入大客车流量" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 小客车流量 -->
                        <el-form-item label="小客车流量" class="form_item" prop="passengerTraffic">
                            <el-input :disabled="isDisabled" v-model="dialogForm.passengerTraffic" type="number" min="0"
                                placeholder="请输入小客车流量" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 新能源车流量 -->
                        <el-form-item label="新能源车流量" class="form_item" prop="newEnergyTraffic">
                            <el-input :disabled="isDisabled" v-model="dialogForm.newEnergyTraffic" type="number" min="0"
                                placeholder="请输入新能源车流量" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 货车流量 -->
                        <el-form-item label="货车流量" class="form_item" prop="freightTraffic">
                            <el-input :disabled="isDisabled" v-model="dialogForm.freightTraffic" type="number" min="0"
                                placeholder="请输入货车流量" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 危化品车流量 -->
                        <el-form-item label="危化品车流量" class="form_item" prop="dangerFreightTraffic">
                            <el-input :disabled="isDisabled" v-model="dialogForm.dangerFreightTraffic" type="number" min="0"
                                placeholder="请输入危化品车流量" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 计算总车流量 -->
                        <el-form-item label="总车流量" class="form_item" prop="carTraffic">
                            <el-input :disabled="true" v-model="carTraffic" type="number" min="0"
                                placeholder="请输入总车流量" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <div class="sub_title">
                          <el-tag style="width: 70px;">客流量</el-tag>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <!-- 客流量 -->
                        <el-form-item label="客流量" class="form_item" prop="guestTraffic">
                            <el-input :disabled="isDisabled" v-model="dialogForm.guestTraffic" type="number" min="0"
                                placeholder="请输入客流量" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <div class="sub_title">
                          <el-tag style="width: 70px;">经营收入</el-tag>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <!-- 小吃收入 -->
                        <el-form-item label="小吃收入" class="form_item" prop="snackIncome">
                            <el-tooltip :disabled="!tooltipFlagObj.snackIncome" effect="dark" content="每日收入金额不超过100万" placement="top">
                                <el-input :disabled="isDisabled" v-model="dialogForm.snackIncome" type="number" min="0"
                                    placeholder="请输入小吃收入" clearable @change="(value)=>value > 100 && (tooltipFlagObj.snackIncome = true)">
                                    <template #append>
                                        <span>万元</span>
                                    </template>
                                </el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 超市收入 -->
                        <el-form-item label="超市收入" class="form_item" prop="supermarketIncome">
                            <el-tooltip :disabled="!tooltipFlagObj.supermarketIncome" effect="dark" content="每日收入金额不超过100万" placement="top">
                                <el-input :disabled="isDisabled" v-model="dialogForm.supermarketIncome" type="number" min="0"
                                    placeholder="请输入超市收入" clearable @change="(value)=>value > 100 && (tooltipFlagObj.supermarketIncome = true)">
                                    <template #append>
                                        <span>万元</span>
                                    </template>
                                </el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 餐厅收入 -->
                        <el-form-item label="餐厅收入" class="form_item" prop="restaurantIncome">
                            <el-tooltip :disabled="!tooltipFlagObj.restaurantIncome" effect="dark" content="每日收入金额不超过100万" placement="top">
                                <el-input :disabled="isDisabled" v-model="dialogForm.restaurantIncome" type="number" min="0"
                                    placeholder="请输入餐厅收入" clearable @change="(value)=>value > 100 && (tooltipFlagObj.restaurantIncome = true)">
                                    <template #append>
                                        <span>万元</span>
                                    </template>
                                </el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 汽修收入 -->
                        <el-form-item label="汽修收入" class="form_item" prop="motorRepairIncome">
                            <el-tooltip :disabled="!tooltipFlagObj.motorRepairIncome" effect="dark" content="每日收入金额不超过100万" placement="top">
                                <el-input :disabled="isDisabled" v-model="dialogForm.motorRepairIncome" type="number" min="0"
                                    placeholder="请输入汽修收入" clearable @change="(value)=>value > 100 && (tooltipFlagObj.motorRepairIncome = true)">
                                    <template #append>
                                        <span>万元</span>
                                    </template>
                                </el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 客房收入 -->
                        <el-form-item label="客房收入" class="form_item" prop="roomIncome">
                            <el-tooltip :disabled="!tooltipFlagObj.roomIncome" effect="dark" content="每日收入金额不超过100万" placement="top">
                                <el-input :disabled="isDisabled" v-model="dialogForm.roomIncome" type="number" min="0"
                                    placeholder="请输入客房收入" clearable @change="(value)=>value > 100 && (tooltipFlagObj.roomIncome = true)">
                                    <template #append>
                                        <span>万元</span>
                                    </template>
                                </el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 油品收入 -->
                        <el-form-item label="油品收入" class="form_item" prop="oilIncome">
                            <el-tooltip :disabled="!tooltipFlagObj.oilIncome" effect="dark" content="每日收入金额不超过100万" placement="top">
                                <el-input :disabled="isDisabled" v-model="dialogForm.oilIncome" type="number" min="0"
                                    placeholder="请输入油品收入" clearable @change="(value)=>value > 100 && (tooltipFlagObj.oilIncome = true)">
                                    <template #append>
                                        <span>万元</span>
                                    </template>
                                </el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 其他收入 -->
                        <el-form-item label="其他收入" class="form_item" prop="otherIncome">
                            <el-tooltip :disabled="!tooltipFlagObj.otherIncome" effect="dark" content="每日收入金额不超过100万" placement="top">
                                <el-input :disabled="isDisabled" v-model="dialogForm.otherIncome" type="number" min="0"
                                    placeholder="请输入其他收入" clearable @change="(value)=>value > 100 && (tooltipFlagObj.otherIncome = true)">
                                    <template #append>
                                        <span>万元</span>
                                    </template>
                                </el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 计算收入总计 -->
                        <el-form-item label="收入总计" class="form_item" prop="incomeTotal">
                            <el-input :disabled="true" v-model="incomeTotal" type="number" min="0"
                                placeholder="请输入收入总计" clearable>
                                <template #append>
                                    <span>万元</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <div class="sub_title">
                          <el-tag style="width: 70px;">加油换电</el-tag>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <!-- 加油车次 -->
                        <el-form-item label="加油车次" class="form_item" prop="oilCarNumber">
                            <el-input :disabled="isDisabled" v-model="dialogForm.oilCarNumber" type="number" min="0"
                                placeholder="请输入加油车次" clearable>
                                <template #append>
                                    <span>辆</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 换电小型车车辆数 -->
                        <el-form-item label="换电小型客车车辆数" class="form_item" prop="exPassengerNumber">
                            <el-input :disabled="isDisabled" v-model="dialogForm.exPassengerNumber" type="number" min="0"
                                placeholder="请输入换电小型车车辆数" clearable>
                                <template #append>
                                    <span>辆</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 小型客车换电金额 -->
                        <el-form-item label="小型客车换电金额" class="form_item" prop="exPassengerCost">
                            <el-input :disabled="isDisabled" v-model="dialogForm.exPassengerCost" type="number"
                                min="0" placeholder="请输入小型客车换电金额" clearable>
                                <template #append>
                                    <span>元</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 换电卡车车辆数 -->
                        <el-form-item label="换电重卡车辆数" class="form_item" prop="exTruckNumber">
                            <el-input :disabled="isDisabled" v-model="dialogForm.exTruckNumber" type="number" min="0"
                                placeholder="请输入换电卡车车辆数" clearable>
                                <template #append>
                                    <span>辆</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 重卡换电金额 -->
                        <el-form-item label="重卡换电金额" class="form_item" prop="exTruckCost">
                            <el-input :disabled="isDisabled" v-model="dialogForm.exTruckCost"
                                type="number" min="0" placeholder="请输入重卡换电金额" clearable>
                                <template #append>
                                    <span>元</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <div class="sub_title">
                          <el-tag style="width: 70px;">加气</el-tag>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <!-- 加气车辆数 -->
                        <el-form-item label="加气车辆数" class="form_item" prop="gasCarNumber">
                            <el-input :disabled="isDisabled" v-model="dialogForm.gasCarNumber" type="number" min="0"
                                placeholder="请输入加气车辆数" clearable>
                                <template #append>
                                    <span>辆</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 加气量 -->
                        <el-form-item label="加气量" class="form_item" prop="gasNumber">
                            <el-input :disabled="isDisabled" v-model="dialogForm.gasNumber" type="number" min="0"
                                placeholder="请输入加气量" clearable>
                                <template #append>
                                    <span>吨</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 加气金额 -->
                        <el-form-item label="加气金额" class="form_item" prop="gasCost">
                            <el-input :disabled="isDisabled" v-model="dialogForm.gasCost" type="number" min="0"
                                placeholder="请输入加气金额" clearable>
                                <template #append>
                                    <span>元</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <div class="sub_title">
                          <el-tag style="width: 70px;">光伏发电</el-tag>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <!-- 光伏发电量 -->
                        <el-form-item label="光伏发电量" class="form_item" prop="photovoltaicNumber">
                            <el-input :disabled="isDisabled" v-model="dialogForm.photovoltaicNumber" type="number"
                                min="0" placeholder="请输入光伏发电量" clearable>
                                <template #append>
                                    <span>KWH</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 光伏发电时长 -->
                        <el-form-item label="光伏发电时长" class="form_item" prop="photovoltaicTime">
                            <el-input :disabled="isDisabled" v-model="dialogForm.photovoltaicTime"
                                type="number" min="0" placeholder="请输入光伏发电时长" clearable>
                                <template #append>
                                    <span>小时</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <!-- 备注 -->
                        <el-form-item label="备注" class="form_item" prop="remake">
                            <el-input :disabled="isDisabled" v-model="dialogForm.remake" type="textarea" placeholder="请输入备注"
                                clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-scrollbar>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :loading="confirmLoading" v-if="!isDisabled" @click="dialogConfirm()">确定</el-button>
                <el-button type="primary" @click="close">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import {ElMessage} from 'element-plus';
import {computed, onMounted, reactive, ref} from 'vue';
import {addDailyIncome, updateDailyIncome} from '@/api/daily/dailyIncome.js';
import {getServiceArea, queryNormalOptions} from "@/api/dictionaryApi.js";
import {formRules} from './formRules.js';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'add',
    },
    data: {
        type: Object,
        default: ()=>{return {}},
    },
});

const formRef = ref(null); // 表单ref
const dialogVisible = computed(() => {
    return props.visible;
}); // 弹窗
const title = ref('新增'); // 弹窗标题
const isDisabled = ref(false); // 禁用
const serviceAreaList = ref([]); // 服务区域列表
const operationStatusList = ref([]); // 服务区运营状态列表
const trafficStatisticsList = ref([]); // 流量统计口径列表
const confirmLoading = ref(false); // 确定按钮loading
const emit = defineEmits(['dialogClose']);
const tooltipFlagObj = ref({}); // tooltip显示隐藏

const carTraffic = computed(() => {
    return Number(dialogForm.bigPassengerTraffic) + Number(dialogForm.passengerTraffic) + Number(dialogForm.newEnergyTraffic) + Number(dialogForm.freightTraffic) + Number(dialogForm.dangerFreightTraffic);
});

const incomeTotal = computed(() => {
    return (Number(dialogForm.snackIncome) + Number(dialogForm.supermarketIncome) + Number(dialogForm.restaurantIncome) + Number(dialogForm.motorRepairIncome) + Number(dialogForm.roomIncome) + Number(dialogForm.oilIncome) + Number(dialogForm.otherIncome));

})
// 弹窗表单数据
const dialogForm = reactive({
    serviceAreaId: "", // 服务区id
    createDay: "", // 日报时间
    operateStatus: "", // 服务区运营状态
    statisticalCaliber: "", // 流量统计口径
    bigPassengerTraffic: "0", // 大巴车流量
    passengerTraffic: "0", // 小巴车流量
    newEnergyTraffic: "0", // 新能源车流量
    freightTraffic: "0", // 卡车流量
    dangerFreightTraffic: "0",   // 危险品车流量
    carTraffic: "0", // 总流量
    guestTraffic: "0", // 旅客流量
    snackIncome: "0.000000", // 小吃收入
    supermarketIncome: "0.000000", // 超市收入
    restaurantIncome: "0.000000", // 餐厅收入
    motorRepairIncome: "0.000000", // 车修收入
    roomIncome: "0.000000", // 酒店收入
    oilIncome: "0.000000", // 汽油收入
    otherIncome: "0.000000", // 其他收入
    incomeTotal: "0.000000", // 总收入
    oilCarNumber: "0", // 加油车流量
    exPassengerNumber: "0", // 小型电动车流量
    exPassengerCost: "0.00", // 小型电动车收入
    exTruckNumber: "0", // 卡车电动车流量
    exTruckCost: "0.00", // 卡车电动车收入
    gasCarNumber: "0", // 压缩天然气车流量
    gasNumber: "0.00", // 液化天然气车流量
    gasCost: "0.00", // 压缩天然气收入
    photovoltaicNumber: "0.00", // 太阳能发电量
    photovoltaicTime: "0.00", // 太阳能发电时长
    remark: "", // 备注
});
// 弹窗表单验证规则
const rules = reactive(formRules);

onMounted(() => {
    if (props.type == 'add') {
        title.value = '新增';
        isDisabled.value = false;
        getItem(props.data);
    } else if (props.type == 'edit') {
        title.value = '编辑';
        isDisabled.value = false;
        getItem(props.data);
    } else if (props.type == 'detail') {
        title.value = '详情';
        isDisabled.value = true;
        getItem(props.data);
    }
});
getServiceArea().then(res => {
    serviceAreaList.value = res.data.records;
});
queryNormalOptions({
    queriers: [{ alias: 'basDailyStatusDictionary', param: null }],
}).then((res) => {
    operationStatusList.value = res.data.basDailyStatusDictionary;
});
queryNormalOptions({
    queriers: [{ alias: 'basDailyCaliberDictionary', param: null }],
}).then((res) => {
    trafficStatisticsList.value = res.data.basDailyCaliberDictionary;
});

// 获取详情
const getItem = async (data) => {
    Object.keys(data).map((key) => {
        dialogForm[key] = data[key];
    });
};
// 弹窗关闭
const close = () => {
    confirmLoading.value = false;
    emit('dialogClose');
};
// 弹窗确认
const dialogConfirm = () => {
    saveData(props.type, dialogForm);
};
const saveData = async (type, formData) => {
    await formRef.value.validate(async (valid) => {
        if (valid) {
            confirmLoading.value = true;
            formData.carTraffic = carTraffic.value;
            formData.incomeTotal = incomeTotal.value;
            let res;
            if (type == 'add') {
                res = await addDailyIncome(formData);
            } else if (type == 'edit') {
                res = await updateDailyIncome(formData);
            }
            confirmLoading.value = false;
            if (res.code == 200) {
                ElMessage({
                    message: type == 'add' ? '新增成功' : '编辑成功',
                    type: 'success',
                });
                emit('dialogClose');
            } else if (res.code == 500) {
                ElMessage({
                    message: res.message,
                    type: 'warning',
                });
            } else {
                ElMessage({
                    message: res.message || res.data.message,
                    type: 'error',
                });
            }
        } else {
            return false;
        }
    });
};
</script>
<style lang="scss" scoped>
.sub_title{
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
}
</style>
