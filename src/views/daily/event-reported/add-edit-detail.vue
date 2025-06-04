<!-- @format -->

<template>
    <el-dialog class="custom_dialog" v-model="dialogVisible" :title="title" width="1200" :close-on-click-modal="false"
        :close-on-press-escape="false" @close="close">
        <el-form ref="formRef" :inline="true" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
            label-suffix="：">
            <el-form-item label="服务区" class="form_item">
                <el-select v-model="dialogForm.serviceAreaId" :disabled="isDisabled" placeholder="请选择服务区" clearable>
                    <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="区域" class="form_item">
                <el-select v-model="dialogForm.areaId" :disabled="isDisabled" placeholder="请选择区域列表" clearable>
                    <el-option v-for="(item, index) in areaConfigList" :key="index" :label="item.name"
                        :value="item.area+''" />
                </el-select>
            </el-form-item>
            <el-form-item label="事件名称" class="form_item" prop="eventName">
                <el-input v-model="dialogForm.eventName" :disabled="isDisabled" placeholder="请输入事件名称" clearable />
            </el-form-item>
            <el-form-item label="事件类型" class="form_item">
                <el-select v-model="dialogForm.eventType" :disabled="isDisabled" placeholder="请选择事件类型" clearable>
                    <el-option v-for="(item, index) in eventReportedTypeDictionary" :key="index" :label="item.name"
                        :value="item.code" />
                </el-select>
            </el-form-item>
            <el-form-item label="异常描述" class="form_item" prop="describ">
                <el-input v-model="dialogForm.describ" :disabled="isDisabled" placeholder="请输入异常描述" clearable />
            </el-form-item>
            <el-form-item label="角色" class="form_item" prop="reportRole">
                <el-input v-model="dialogForm.reportRole" :disabled="isDisabled" placeholder="请输入角色" clearable />
            </el-form-item>
            <el-form-item label="发生时间" class="form_item">
                <el-date-picker value-format="YYYY-MM-DD HH:mm:ss" v-model="dialogForm.happenTime" type="datetime" :disabled="isDisabled" placeholder="请选择发生时间" />
            </el-form-item>
            <el-form-item label="疫情人员数量" class="form_item" prop="epidemicNum">
                <el-input v-model="dialogForm.epidemicNum" :disabled="isDisabled" placeholder="0" clearable />
            </el-form-item>

            <el-form-item label="管制状态" class="form_item">
                <el-select v-model="dialogForm.isControl" :disabled="isDisabled" placeholder="请选择事件类型" clearable>
                    <el-option v-for="(item, index) in eventReportedIsControlDictionary" :key="index" :label="item.name"
                        :value="~~item.code" />
                </el-select>
            </el-form-item>

            
            <el-form-item v-if="aedType == 'detail'" label="处理时间" class="form_item" prop="handleTime">
                <el-date-picker value-format="YYYY-MM-DD HH:mm:ss" v-model="dialogForm.handleTime" type="datetime" placeholder="请选择处理时间" />
            </el-form-item>
            <el-form-item v-if="aedType == 'detail'" label="处理结果" class="form_item" prop="handleResult">
                <el-input v-model="dialogForm.handleResult" placeholder="请输入处理结果" clearable />
            </el-form-item>

            <el-form-item v-if="aedType == 'detail'" label="处理时图片" class="form_item">
                <el-upload v-model:file-list="dialogForm.filesName" class="upload-demo"
                    action="#" list-type="picture" accept=".jpeg,.png,.jpg,.bmp,.gif" :http-request="customUpload"
                        :on-remove="handleRemove" :on-preview="handlePreview">
                    <el-button>
                        <el-icon class="el-icon--right">
                            <Plus />
                        </el-icon>点击上传
                    </el-button>
                </el-upload>
            </el-form-item>
            <el-form-item v-if="aedType == 'end'" label="管制措施" class="form_item">
                <el-input :disabled="true" v-model="dialogForm.controlMethod" placeholder="请输入处理结果" clearable />
            </el-form-item>
            <el-form-item v-if="aedType == 'end'" label="管制开始时间" class="form_item">
                <el-date-picker :disabled="true" value-format="YYYY-MM-DD HH:mm:ss" v-model="dialogForm.startTime" type="datetime" placeholder="请选择管制开始时间" />
            </el-form-item>
            <el-form-item v-if="aedType == 'end'" label="管制结束时间" class="form_item" prop="endTime">
                <el-date-picker value-format="YYYY-MM-DD HH:mm:ss" v-model="dialogForm.endTime" type="datetime" placeholder="请选择管制结束时间" />
            </el-form-item>
        </el-form>
        <el-dialog v-model="imgDialog">
            <img style="width: 100%; object-fit: cover" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
        <template #footer>
            <div class="dialog-footer">
                <el-button :loading="confirmLoading" type="primary" v-if="aedType == 'end' || aedType == 'detail'" @click="dialogConfirm">保存</el-button>
                <el-button type="primary" @click="close">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, onMounted, computed } from 'vue';
import {
    getReportedInfoById,
    getAreaConfigList,
    handleEventReported,
    endControl,
    // fileInfo,
} from '@/api/daily/eventReported.js';

import { queryNormalOptions } from '@/api/dictionaryApi.js';
import {getServiceArea} from "@/api/dictionaryApi.js";
import { fileInfo } from "@/api/dangerItemApi";


const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'add',
    },
    id: {
        type: String,
        default: '',
    },
    // data: {
    //     type: Object,
    //     default: () => { },
    // },
});
const aedType = ref('detail'); // 弹窗类型
const formRef = ref(null); // 表单ref
const dialogVisible = computed(() => {
    return props.visible;
}); // 弹窗
const title = ref('新增'); // 弹窗标题
const isDisabled = ref(false); // 禁用
const imgDialog = ref(false); // 预览图片弹窗
const dialogImageUrl = ref(''); // 预览图片地址
const files = ref([]); // 附件列表

const serviceAreaList = ref([]); // 服务区域
const eventReportedTypeDictionary = ref([]); // 事件类型
const eventReportedIsControlDictionary = ref([]); // 是否管制
const areaConfigList = ref([]); // 区域配置
const emit = defineEmits(['dialogClose']);
const confirmLoading = ref(false); // 提交loading

// 弹窗表单数据
const dialogForm = reactive({
    serviceAreaText: '', // 服务区域
    areaName: '', // 区域名称
    eventName: '', // 事件名称
    eventTypeText: '', // 事件类型
    describ: '', // 事件描述
    reportRole:'', // 报告人
    happenTime:'',
    epidemicNum:'',
    isControlText:'',
    handleTime:'',
    handleResult:'',
    files: []
});
// 弹窗表单验证规则
const rules = reactive({
    handleResult: [{ required: true, message: '请输入处理结果', trigger: 'change' }],
    endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
    handleTime: [{ required: true, message: '请选择处理时间', trigger: 'change' }],
});

onMounted(() => {
    getServiceArea().then(res => {
        serviceAreaList.value = res.data.records;
    });
    queryNormalOptions({
        queriers: [{ alias: 'eventReportedTypeDictionary', param: null }],
    }).then((res) => {
        eventReportedTypeDictionary.value = res.data.eventReportedTypeDictionary;
    });
    queryNormalOptions({
        queriers: [{ alias: 'eventReportedIsControlDictionary', param: null }],
    }).then((res) => {
        eventReportedIsControlDictionary.value = res.data.eventReportedIsControlDictionary;
    });
    getAreaConfigList().then((res) => {
         areaConfigList.value = res.data.records;
    });
    if (props.type == 'detail') {
        title.value = '事件处理';
        aedType.value = 'detail';
        isDisabled.value = true;
        getEventReportedItem(props.id);
    } else if (props.type == 'end') {
        title.value = '管制结束';
        isDisabled.value = true;
        aedType.value = 'end';
        getEventReportedItem(props.id);
    }
});
// 获取详情
const getEventReportedItem = async (id) => {
    picList.value = []
    delFileList.value = []
    let res = await getReportedInfoById({ id });
    if (res.code == 200) {
        Object.keys(res.data).map((key) => {
            dialogForm[key] = res.data[key];
        });
        dialogForm.filesName = [];
        if (res.data.handleFiles) {
            let arr = res.data.files.split(',');
            res.data.handlefilesList.map(async (item) => {
                await dialogForm.filesName.push({
                    entityId: item.entityId,
                    uid: item.entityId,
                    name: item.fileName,
                    url:
                        process.env.VUE_APP_API_HOST_URL +
                        process.env.VUE_APP_API_BASE_URL +
                        `/pub/common/file/download?service=basEventReportFileServiceImpl&id=${item.entityId}`,
                });
            });
            picList.value = await Promise.all(
                res.data.handlefilesList.map(async (item) => {
                    const fileInfo = await getFileInfo(item.entityId); // 获取文件信息
                    return {
                        entityId: item.entityId,
                        name: item.fileName,
                        url: fileInfo // 假设 fileInfo 是一个对象，包含 url 属性
                    };
                })
            )
        }
    }
};
const getFileInfo = async (itemId) => {
    const res = await fileInfo({ id: itemId })
    if (res.code == '200') {
        return process.env.VUE_APP_API_HOST_URL +
            process.env.VUE_APP_API_BASE_URL +
            `/pub/common/file/download?service=basEventReportFileServiceImpl&id=${itemId}`
    } else {
        return ''
    }
}
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
const dialogConfirm = () => {
    const formData = new FormData();
    formData.append('request', JSON.stringify(dialogForm));
    picList.value.map((item) => {
        if (!Object.keys(item).includes("entityId"))
            formData.append('files', item.path);
    });
    saveData(props.type, formData);
};
const saveData = async (type, formData) => {
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
            confirmLoading.value = true;
            if (type == 'detail'){
                let data = {
                    entityId : dialogForm.entityId,
                    handleTime: dialogForm.handleTime,
                    handleResult: dialogForm.handleResult,
                };
                const eventReportedData = new FormData();
                eventReportedData.append('request', JSON.stringify(data));
                picList.value.map((item) => {
                    eventReportedData.append('files', item.path);
                });
                let res = await handleEventReported(eventReportedData);
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
            if (type == 'end'){
                let data = {
                    entityId : dialogForm.entityId,
                    endTime: dialogForm.endTime,
                }
                let res = await endControl(data)
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
    const index = picList.value.findIndex(item => item.uid === file.uid);
    if (index !== -1) {
        picList.value.splice(index, 1); // 移除文件
    }
    if (Object.keys(file).includes("entityId")) {
        delFileList.value.push(file.entityId);
    }
};
// 下载图片
const handleDownload = (file) => {
    let url = file.url;
    window.open(url);
};

const picList = ref([]); // 图片列表
const delFileList = ref([]); // 删除文件列表
// 上传图片
const customUpload = (file) => {
    picList.value.push({
        path: file.file,
        uid: file.file.uid,
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

.form_item {
    width: 500px;
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
