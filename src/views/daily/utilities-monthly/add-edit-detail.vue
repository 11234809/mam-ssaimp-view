<!-- @format -->

<template>
    <el-dialog class="custom_dialog" v-model="dialogVisible" :title="title" width="800" :close-on-click-modal="false"
        :close-on-press-escape="false" @close="close">
        <el-form ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
            label-suffix="：">
            <el-row :gutter="30">
                <el-col :span="12">
                    <el-form-item label="服务区名称" class="form_item" prop="serviceAreaId">
                        <el-select v-model="dialogForm.serviceAreaId" :disabled="isDisabled" filterable placeholder="请选择" clearable>
                            <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="填报年月" class="form_item" prop="createMonth">
                        <el-date-picker value-format="YYYY-MM" v-model="dialogForm.createMonth" type="month"
                            placeholder="请选择填报年月" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="" class="form_item">
                <div>
                  <el-tag style="font-weight: bold; font-size: 20px; margin-left: 198px; padding: 20px;">公共部分</el-tag>
                </div>
                <div>
                  <el-tag style="font-weight: bold; font-size: 20px; margin-left: 210px;padding: 20px;">经营部分</el-tag>
                </div>
            </el-form-item>
            <el-form-item label="用水量(吨)" class="form_item" prop="req">
                <el-input type="hidden" v-model="dialogForm.req"/>
                <el-form-item prop="waterCommon">
                    <el-input style="width: 300px;" v-model="dialogForm.waterCommon" :disabled="isDisabled"
                        placeholder="请输入用水量(公共部分)(吨)" />
                </el-form-item>
                <div style="width:30px;"></div>
                <el-form-item prop="waterManage">
                    <el-input style="width: 300px;" v-model="dialogForm.waterManage" :disabled="isDisabled"
                        placeholder="请输入用水量(经营部分)(吨)" />
                </el-form-item>
            </el-form-item>
            <el-form-item label="用电量(度)" class="form_item" prop="req">
                <el-input type="hidden" v-model="dialogForm.req"/>
                <el-form-item prop="electricCommon">
                    <el-input style="width: 300px;" v-model="dialogForm.electricCommon" :disabled="isDisabled"
                        placeholder="请输入用电量(公共部分)(度)" />
                </el-form-item>
                <div style="width:30px;"></div>
                <el-form-item prop="electricManage">
                    <el-input style="width: 300px;" v-model="dialogForm.electricManage" :disabled="isDisabled"
                        placeholder="请输入用电量(经营部分)(度)" />
                </el-form-item>
            </el-form-item>
            <el-form-item label="用气量(立方)" class="form_item" prop="req">
                <el-input type="hidden" v-model="dialogForm.req"/>
                <el-form-item prop="gasCommon">
                    <el-input style="width: 300px;" v-model="dialogForm.gasCommon" :disabled="isDisabled"
                        placeholder="请输入用气量(公共部分)(立方)" /></el-form-item>
                <div style="width:30px;"></div>
                <el-form-item prop="gasManage">
                    <el-input style="width: 300px;" v-model="dialogForm.gasManage" :disabled="isDisabled"
                        placeholder="请输入用气量(经营部分)(立方)" /></el-form-item>
            </el-form-item>
            <el-form-item label="生物油(吨)" class="form_item" prop="req">
                <el-input type="hidden" v-model="dialogForm.req"/>
                <el-form-item prop="oilCommon">
                    <el-input style="width: 300px;" v-model="dialogForm.oilCommon" :disabled="isDisabled"
                        placeholder="请输入生物油(公共部分)(吨)" /></el-form-item>
                <div style="width:30px;"></div>
                <el-form-item prop="oilManage">
                    <el-input style="width: 300px;" v-model="dialogForm.oilManage" :disabled="isDisabled"
                        placeholder="请输入生物油(经营部分)(吨)" /></el-form-item>
            </el-form-item>
        </el-form>
        <el-dialog v-model="imgDialog">
            <img style="width: 100%; object-fit: cover" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :loading="confirmLoading" v-if="type == 'add'" @click="dialogConfirm(true)">提交并继续添加</el-button>
                <el-button type="primary" :loading="confirmLoading" v-if="!isDisabled" @click="dialogConfirm(false)">确定</el-button>
                <el-button type="primary" @click="close">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import {ElMessage} from 'element-plus';
import {computed, onMounted, reactive, ref} from 'vue';
import {addUtiltiesMonthly, updateUtiltiesMonthly} from '@/api/daily/utilitiesMonthly.js';
import {getServiceArea} from "@/api/dictionaryApi.js";

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
        default: () => { },
    },
    // data: {
    //     type: Object,
    //     default: () => { },
    // },
});
const formRef = ref(null); // 表单ref
const dialogVisible = computed(() => {
    return props.visible;
}); // 弹窗
const title = ref('新增'); // 弹窗标题
const isDisabled = ref(false); // 禁用
const imgDialog = ref(false); // 预览图片弹窗
const dialogImageUrl = ref(''); // 预览图片地址
const files = ref([]); // 附件列表
const serviceAreaList = ref([]); // 服务区域列表

const emit = defineEmits(['dialogClose']);
const confirmLoading = ref(false); // 提交loading

// 弹窗表单数据
const dialogForm = reactive({
    companyId: '',
    serviceAreaId: '',
    waterCommon: '',
    waterManage: '',
    electricCommon: '',
    electricManage: '',
    gasCommon: '',
    gasManage: '',
    oilCommon: '',
    oilManage: '',
    req:'1'
});
const validatePositiveNumber = (rule, value, callback) => {
    if(value.trim() == ''){
        callback(new Error('必须输入数字'));
    }
    if (isNaN(value) || value < 0) {
        dialogForm[rule.field] = '';
        callback(new Error('必须为正数'));
    } else {
        callback();
    }
}
// 弹窗表单验证规则
const rules = reactive({
    req: [{ required: true, message: '', trigger: 'change' }],
    stayTime: [{ required: true, message: '请输入停留时长(分钟)', trigger: 'blur' }],
    serviceAreaId: [{ required: true, message: '请选择服务区名称', trigger: 'change' }],
    createMonth: [{ required: true, message: '请选择填报年月', trigger: 'change' }],
    waterCommon: [{ required: true, message: '请输入用水量(公共部分)(吨)', trigger: 'blur' }, { validator: validatePositiveNumber, trigger: 'blur' }],
    waterManage: [{ required: true, message: '请输入用水量(经营部分)(吨)', trigger: 'blur' }, { validator: validatePositiveNumber, trigger: 'blur' }],
    electricCommon: [{ required: true, message: '请输入用电量(公共部分)(度)', trigger: 'blur' }, { validator: validatePositiveNumber, trigger: 'blur' }],
    electricManage: [{ required: true, message: '请输入用电量(经营部分)(度)', trigger: 'blur' }, { validator: validatePositiveNumber, trigger: 'blur' }],
    gasCommon: [{ required: true, message: '请输入用气量(公共部分)(立方)', trigger: 'blur' }, { validator: validatePositiveNumber, trigger: 'blur' }],
    gasManage: [{ required: true, message: '请输入用气量(经营部分)(立方)', trigger: 'blur' }, { validator: validatePositiveNumber, trigger: 'blur' }],
    oilCommon: [{ required: true, message: '请输入生物油(公共部分)(吨)', trigger: 'blur' }, { validator: validatePositiveNumber, trigger: 'blur' }],
    oilManage: [{ required: true, message: '请输入生物油(经营部分)(吨)', trigger: 'blur' }, { validator: validatePositiveNumber, trigger: 'blur' }],
});
onMounted(() => {
    if (props.type == 'add') {
        title.value = '新增';
        isDisabled.value = false;
    } else if (props.type == 'edit') {
        title.value = '编辑';
        isDisabled.value = false;
        getUtilitiesMonthlyItem(props.data);
    } else if (props.type == 'detail') {
        title.value = '详情';
        isDisabled.value = true;
        getUtilitiesMonthlyItem(props.data);
    }
});
getServiceArea().then(res => {
    serviceAreaList.value = res.data.records;
});
// 获取详情
const getUtilitiesMonthlyItem = async (data) => {
    Object.keys(data).map((key) => {
        dialogForm[key] = data[key];
    });
};
const stayTimeBlur = (val) => {
    let reg = /^\+?[1-9]\d*$/;
    if (!reg.test(val)) {
        ElMessage({
            message: '停留时长只能输入正整数',
            type: 'error',
        });
        dialogForm.stayTime = '';
    }
};
// 弹窗关闭
const close = () => {
    confirmLoading.value = false;
    emit('dialogClose');
};
// 弹窗确认
const dialogConfirm = (isContinue) => {
    const formData = new FormData();
    let obj = JSON.stringify(dialogForm);
    if (obj.companyId == '') {
        delete obj.companyId;
    }
    formData.append('request', obj);
    picList.value.map((item) => {
        formData.append('files', item.path);
    });
    saveData(props.type, formData, isContinue);
};
const saveData = async (type, formData, isContinue) => {
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
            confirmLoading.value = true;
            if (type == 'add') {
                let res = await addUtiltiesMonthly(formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                confirmLoading.value = false;
                if (res.code == 200) {
                    ElMessage({
                        message: res.data.message,
                        type: 'success',
                    });
                    if (isContinue) {
                        Object.keys(dialogForm).map((key) => {
                            dialogForm[key] = null;
                        });
                    } else {
                        emit('dialogClose');
                    }
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
            }
            if (type == 'edit') {
                let res = await updateUtiltiesMonthly(formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                confirmLoading.value = false;
                if (res.code == 200) {
                    ElMessage({
                        message: res.data.message,
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
            }
        } else {
            return false;
        }
    });
};
// 预览图片
const handlePreview = (file) => {
    imgDialog.value = true;
    dialogImageUrl.value = file.url;
};
// 删除图片
const handleRemove = (file) => {
    dialogForm.filesName = dialogForm.filesName.filter((item) => item.uid !== file.uid);
    dialogForm.files = dialogForm.files
        .split(',')
        .filter((item) => item !== file.uid)
        .join(',');
};
// 下载图片
const handleDownload = (file) => {
    let url = file.url;
    window.open(url);
};

const picList = ref([]); // 图片列表
// 上传图片
const customUpload = (file) => {
    picList.value.push({
        path: file.file,
        id: file.file.uid,
        value: '0',
        nodeName: file.file.name,
        type: file.file.type,
    });
};
</script>

<style lang="less" scoped>
.upload-demo {
    width: 100%;

    .cst_upload_box {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height: 80px;

        .cst_upload_img {
            width: 140px;
            height: 100%;
            object-fit: fill;
        }

        .cst_upload_name {
            margin-left: 20px;
        }

        .cst_upload_icon {
            position: absolute;
            top: 0;
            right: 0;

            .el-icon:nth-child(1) {
                margin-right: 12px;
            }

            .el-icon {
                cursor: pointer;
            }
        }
    }
}

.add-edit-header {
    color: --whiteBtnTextColor;
    display: flex;
    justify-content: space-between;
    padding: 10px 18px;

    h4 {
        position: relative;
        display: flex;
        font-weight: bold;
        font-size: 18px;

        &::before {
            content: '';
            width: 5px;
            height: 16px;
            background-color: #114484;
            position: absolute;
            left: -10px;
            top: 4px;
        }
    }
}
</style>
