<!-- @format -->

<template>
    <el-dialog class="custom_dialog" v-model="dialogVisible" :title="title" width="800" :close-on-click-modal="false"
        :close-on-press-escape="false" @close="close">
        <el-form ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
            label-suffix="：">
            <el-scrollbar height="540px">
                <div class="add-edit-header">
                    <h4>上报基本信息</h4>
                </div>
                <el-form-item label="上报标题" class="form_item" prop="reportTitle">
                    <el-input v-model="dialogForm.reportTitle" :disabled="isDisabled" placeholder="请输入上报标题" clearable />
                </el-form-item>
                <el-form-item label="上报类型" class="form_item" prop="reportTypeId">
                    <el-select :disabled="isDisabled" v-model="dialogForm.reportTypeId" filterable placeholder="请选择上报类型"
                        clearable
                        :reserve-keyword="false">
                        <el-option v-for="(item, index) in infoReportedTypeDictionary" :key="index" :label="item.name"
                            :value="item.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="上报内容" class="form_item" prop="reportContent">
                    <Editor ref="quill" :readOnly="isDisabled" :min-height="192" @update:input='changeInput' />
                </el-form-item>
                <el-form-item label="附件上传" class="form_item" prop="filesName">
                    <el-upload v-model:file-list="dialogForm.filesName" :disabled="isDisabled" class="upload-demo"
                        action="#" list-type="picture" accept=".jpeg,.png,.jpg,.bmp,.gif" :http-request="customUpload"
                        :on-remove="handleRemove" :on-preview="handlePreview">
                        <el-button v-if="!isDisabled">
                            <el-icon class="el-icon--right">
                                <Plus />
                            </el-icon>点击上传
                        </el-button>
                        <template #file="{ file }">
                            <div class="cst_upload_box">
                                <img class="cst_upload_img" onerror="this.style.display='none';" :src="file.url" alt="" @click="handlePreview(file)" />
                                <span class="cst_upload_name">{{ file.name }}</span>
                                <div class="cst_upload_icon">
                                    <el-icon @click="handleRemove(file)" v-if="!isDisabled">
                                        <Close />
                                    </el-icon>
                                    <el-icon @click="handleDownload(file)">
                                        <el-icon>
                                            <Download />
                                        </el-icon>
                                    </el-icon>
                                </div>
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>

                <el-form-item v-if="isDisabled" label="上报人" class="form_item" prop="reportUserName">
                    <el-input v-model="dialogForm.reportUserName" :disabled="true" placeholder="" clearable />
                </el-form-item>

                <el-form-item v-if="isDisabled" label="上报时间" class="form_item" prop="reportTime">
                    <el-input v-model="dialogForm.reportTime" :disabled="true" placeholder="" clearable />
                </el-form-item>

                <el-form-item label="上报单位" class="form_item" prop="reportUnitName">
                    <el-input v-model="dialogForm.reportUnitName" :disabled="true" placeholder="" clearable />
                </el-form-item>
            </el-scrollbar>
            <div v-if="!isDisabled" class="add-edit-header">
                <h4>审批信息</h4>
            </div>
            <el-form-item v-if="!isDisabled" label="审批人" class="form_item" prop="nextHandlerId">
                <el-select disabled v-model="dialogForm.nextHandlerId" placeholder="请选择审批人" clearable>
                    <el-option v-for="(item, index) in nextHandlerList" :key="index" :label="item.handlerName"
                        :value="item.handlerId" />
                </el-select>
            </el-form-item>


            <div v-if="isDisabled" class="add-edit-header">
                <h4>流程信息</h4>
            </div>
            <el-table v-if="isDisabled" :data="tableData" style="width: 100%">
                <el-table-column type="index" label="序号" width="80" align="center" />
                <el-table-column prop="name" label="操作者" width="180" show-overflow-tooltip />
                <el-table-column prop="time" label="时间" width="180" show-overflow-tooltip />
                <el-table-column prop="action" label="操作" width="100" show-overflow-tooltip />
                <el-table-column prop="comment" label="处理意见" show-overflow-tooltip />
            </el-table>
        </el-form>
        <el-dialog v-model="imgDialog">
            <img style="width: 100%; object-fit: cover" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
        <template #footer>
            <div class="dialog-footer">
                <el-button :loading="confirmLoading" type="primary" v-if="!isDisabled && isAuth('add')"
                    @click="dialogConfirm(true)">提交</el-button>
                <el-button :loading="confirmLoading" type="primary" v-if="!isDisabled"
                    @click="dialogConfirm(false)">保存</el-button>
                <el-button type="primary" @click="close">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, onMounted, computed } from 'vue';
import {
    addInfoReported,
    updateInfoReported,
    getReportedInfoById,
    getNextApproverList,
    getHistoryProcNode,
    getUserInfo
} from '@/api/infoReported.js';
import Editor from "@/components/Editor"
import { queryNormalOptions } from '@/api/dictionaryApi.js';
import { fileInfo } from "@/api/dangerItemApi";
import { isAuth } from "@/utils/authorization";
import { getCompany } from '@/api/dictionaryApi.js';

const infoReportedTypeDictionary = ref([]); //信息上报类型字典
const nextHandlerList = ref([]);
const confirmLoading = ref(false);
let reportUnitId = ''; // 上报单位id
let reportUnitName = ''; // 上报单位

queryNormalOptions({
    queriers: [{ alias: 'infoReportedTypeDictionary', param: null }],
}).then((res) => {
    infoReportedTypeDictionary.value = res.data.infoReportedTypeDictionary;
});
const userInfo = JSON.parse(sessionStorage.getItem(('userInfo')))
getCompany().then((res) => {
    const companyList = res.data.records;
    reportUnitId = companyList[0].value;
    reportUnitName = companyList[0].label;
    if (!dialogForm.reportUnitName) dialogForm.reportUnitName = reportUnitName;

    getNextApproverList({
        currentStatus: dialogForm.reportStatusId || '1',
        companyId: reportUnitId
    }).then((res) => {
        nextHandlerList.value = res.data.records;
        dialogForm.nextHandlerId = res.data.records[0].handlerId;
    });
})

const changeInput = (params) => {
    console.log(params);
    dialogForm.reportContent = params;
}
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
const formRef = ref(null); // 表单ref
const dialogVisible = computed(() => {
    return props.visible;
}); // 弹窗
const title = ref('新增'); // 弹窗标题
const isDisabled = ref(false); // 禁用
const imgDialog = ref(false); // 预览图片弹窗
const dialogImageUrl = ref(''); // 预览图片地址
const files = ref([]); // 附件列表
const quill = ref();
const emit = defineEmits(['dialogClose']);
const tableData = ref([]);

// 弹窗表单数据
const dialogForm = reactive({
    reportTitle: '', // 标题
    reportTypeId: '', // 上报类型
    reportContent: '', // 内容
    reportUserName: '', // 上报人
    reportUnitName: '', // 上报单位
    reportTime: '', // 上报时间
    nextHandlerName: '', // 审批人
    filesName: [], // 附件
});
// 弹窗表单验证规则
const rules = reactive({
    reportTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    reportTypeId: [{ required: true, message: '请选择上报类型', trigger: 'change' }],
    reportContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    filesName: [{ required: true, message: '请上传附件', trigger: 'change' }],
    reportUnitName: [{ required: true, message: '请选择上报单位', trigger: 'change' }],
    nextHandlerId: [{ required: true, message: '请选择审批人', trigger: 'change' }]
});

onMounted(() => {
    if (props.type == 'add') {
        title.value = '新增';
        isDisabled.value = false;
    } else if (props.type == 'edit') {
        title.value = '编辑';
        isDisabled.value = false;
        getItemDetail(props.id);
    } else if (props.type == 'detail') {
        title.value = '详情';
        isDisabled.value = true;
        getItemDetail(props.id);
    }
});
// 获取详情
const getItemDetail = async (id) => {
    picList.value = []
    delFileList.value = []
    let res = await getReportedInfoById({ id });
    if (res.code == 200) {
        Object.keys(res.data).map((key) => {
            dialogForm[key] = res.data[key];
        });
        quill.value.refreshContent(res.data.reportContent);
        dialogForm.filesName = [];
        if (res.data.reportAttachs) {
            res.data.reportAttachsList.map(async (item) => {
                dialogForm.filesName.push({
                    entityId: item.entityId,
                    uid: item.entityId,
                    name: item.fileName,
                    url:
                        process.env.VUE_APP_API_HOST_URL +
                        process.env.VUE_APP_API_BASE_URL +
                        `/pub/common/file/download?service=basInfoReportFileServiceImpl&id=${item.entityId}`,
                });
            });
        }
        if (res.data.reportAttachsList) {
            picList.value = await Promise.all(
                res.data.reportAttachsList.map(async (item) => {
                    const fileInfo = await getFileInfo(item.entityId); // 获取文件信息
                    return {
                        entityId: item.entityId,
                        name: item.fileName,
                        url: fileInfo // 假设 fileInfo 是一个对象，包含 url 属性
                    };
                })
            )
        }
        getNextApproverList({
            currentStatus: dialogForm.reportStatusId || '1',
            companyId: dialogForm.reportUnitId
        }).then((res) => {
            if (res.code == 200) {
                nextHandlerList.value = res.data.records;
            }
        });
        getHistoryProcNode({
            id: dialogForm.entityId
        }).then((res) => {
            tableData.value = [];
            res.data.map(item => {
                tableData.value.push({
                    name: item.auditUserName,
                    time: item.auditTime,
                    action: item.auditOpinionText,
                    comment: item.auditOpinionDesc,
                });
            });
        })
    }
};
const getFileInfo = async (itemId) => {
    const res = await fileInfo({ id: itemId })
    if (res.code === '200') {
        return process.env.VUE_APP_API_HOST_URL +
            process.env.VUE_APP_API_BASE_URL +
            `/pub/common/file/download?service=basInfoReportFileServiceImpl&id=${itemId}`
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
const dialogConfirm = (submit) => {
    confirmLoading.value = true;
    const currentDate = new Date();
    // 定义日期格式
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formatter = new Intl.DateTimeFormat('zh-CN', options);
    // 格式化日期
    const formattedDate = formatter.format(currentDate);
    const formData = new FormData();
    dialogForm.nextHandlerName = nextHandlerList.value.find((item) => item.handlerId == dialogForm.nextHandlerId)?.handlerName;
    dialogForm.reportTime = formattedDate;
    dialogForm.reportUnitId = dialogForm.reportUnitId || reportUnitId;
    dialogForm.reportUnitName = dialogForm.reportUnitName || reportUnitName;
    formData.append('request', JSON.stringify(dialogForm));
    picList.value.map((item) => {
        if (!Object.keys(item).includes("entityId"))
            formData.append('files', item.path);
    });
    formData.append('submit', submit);
    saveData(props.type, formData);
};

const saveData = async (type, formData) => {
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
            if (type == 'add') {
                let res = await addInfoReported(formData, {
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
            if (type == 'edit') {

                if (picList.value.length > 0) {
                    picList.value.map((item) => {
                        if (!Object.keys(item).includes("entityId")) {
                            formData.append('replyFiles', item.path)
                        }
                    })
                }
                formData.append('deleteFileIdList', JSON.stringify(delFileList.value))
                let res = await updateInfoReported(formData, {
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
            confirmLoading.value = false;
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
