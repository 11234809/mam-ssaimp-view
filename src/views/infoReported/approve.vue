<template>
    <div class="custom_dialog">
        <el-form ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
            label-suffix="：">
            <div class="add-edit-header">
                <h4>上报基本信息</h4>
            </div>
            <div class="center_box">
                <el-form-item label="上报标题" class="form_item" prop="reportTitle">
                    <el-input v-model="dialogForm.reportTitle" :disabled="true" placeholder="请输入上报标题" clearable />
                </el-form-item>
                <el-form-item label="上报类型" class="form_item">
                    <el-select :disabled="true" v-model="dialogForm.reportTypeId" filterable
                        :reserve-keyword="false"
                        placeholder="请选择上报类型（支持多选）" clearable>
                        <el-option v-for="(item, index) in infoReportedTypeDictionary" :key="index" :label="item.name"
                            :value="item.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="上报内容" class="form_item">
                    <Editor ref="quill" :readOnly="true" :min-height="192" @update:input='changeInput' />
                </el-form-item>
                <el-form-item label="附件上传" class="form_item">
                    <el-upload v-model:file-list="dialogForm.filesName" :disabled="true" class="upload-demo"
                        action="#" list-type="picture" accept=".jpeg,.png,.jpg,.bmp,.gif" :http-request="customUpload">
                        <template #file="{ file }">
                            <div class="cst_upload_box">
                                <img class="cst_upload_img" :src="file.url" alt="" @click="handlePreview(file)" />
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
                <el-form-item label="上报人" class="form_item" prop="reportUserName">
                    <el-input v-model="dialogForm.reportUserName" :disabled="true" placeholder="" clearable />
                </el-form-item>
                <el-form-item label="上报时间" class="form_item" prop="reportTime">
                    <el-input v-model="dialogForm.reportTime" :disabled="true" placeholder="" clearable />
                </el-form-item>
                <el-form-item label="上报单位" class="form_item" prop="reportUnitName">
                    <el-input v-model="dialogForm.reportUnitName" :disabled="true" placeholder="" clearable />
                </el-form-item>
            </div>
            <div class="add-edit-header">
                <h4>审批信息</h4>
            </div>

            <div class="center_box">
                <el-form-item label="审批结果" class="form_item" prop="auditOpinion">
                    <el-radio-group v-model="dialogForm.auditOpinion" @change="changeAuditOpinion">
                        <el-radio :label="'1'">通过</el-radio>
                        <el-radio :label="'0'">驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="意见描述" class="form_item" prop="auditOpinionDesc">
                    <el-input v-model="dialogForm.auditOpinionDesc" type='textarea' placeholder="" clearable />
                </el-form-item>
                <el-form-item v-if="dialogForm.reportStatusId != '6'" label="审批人" class="form_item" prop="nextHandlerId">
                        <el-select :disabled="true" v-model="dialogForm.nextHandlerId" 
                           placeholder="请选择审批人" clearable>
                            <el-option v-for="(item, index) in nextHandlerList" :key="index"
                                :label="item.handlerName" :value="item.handlerId" />
                        </el-select>
                </el-form-item>

            </div>
            <div class="add-edit-header">
                <h4>流程信息</h4>
            </div>
            <div class="center_box">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column type="index" label="序号" width="80" align="center" />
                    <el-table-column prop="name" label="操作者" width="180" show-overflow-tooltip />
                    <el-table-column prop="time" label="时间" width="180" show-overflow-tooltip />
                    <el-table-column prop="action" label="操作" width="100" show-overflow-tooltip />
                    <el-table-column prop="comment" label="处理意见" show-overflow-tooltip />
                </el-table>
            </div>
        </el-form>
        <el-dialog v-model="imgDialog">
            <img style="width: 100%; object-fit: cover" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
        <div class="footer">
            <el-button v-if="isAuth('complete')" type="primary" @click="dialogConfirm">审批</el-button>
            <el-button type="primary" @click="close">返回待办</el-button>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, onMounted } from 'vue';
import {
    approveInfoReported,
    getReportedInfoById,
    getNextApproverList,
    getHistoryProcNode
} from '@/api/infoReported.js';
import Editor from "@/components/Editor"
import { queryNormalOptions } from '@/api/dictionaryApi.js';
import { useRouter } from 'vue-router';
import emitter from '@/utils/mitt.js';
import {isAuth} from "@/utils/authorization";

const infoReportedTypeDictionary = ref([]); //信息上报类型字典
const infoReportedAuditOpinionDictionary = ref([]);
const nextHandlerList = ref([]);
const router = useRouter();
const queryParam = ref(router.currentRoute.value.query);
queryNormalOptions({
    queriers: [{ alias: 'infoReportedTypeDictionary', param: null }],
}).then((res) => {
    infoReportedTypeDictionary.value = res.data.infoReportedTypeDictionary;
});
queryNormalOptions({
    queriers: [{ alias: 'infoReportedAuditOpinionDictionary', param: null }],
}).then((res) => {
    infoReportedAuditOpinionDictionary.value = res.data.infoReportedAuditOpinionDictionary;
});

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
});
const formRef = ref(null); // 表单ref
const isDisabled = ref(false); // 禁用
const imgDialog = ref(false); // 预览图片弹窗
const dialogImageUrl = ref(''); // 预览图片地址
const quill = ref();
const tableData = ref([]);

// 弹窗表单数据
const dialogForm = reactive({
        reportId : '',
        auditOpinion: '1',
        auditOpinionDesc: '',
        nextHandlerId: ''
    });
// 弹窗表单验证规则
const rules = reactive({
    reportTitle: [{ required: true, message: '请输入上报标题', trigger: 'change' }],
    auditOpinionDesc: [{ required: true, message: '请输入审批意见', trigger: 'blur' }],
    nextHandlerId: [
        { validator: (rule, value, callback) => {
            if (dialogForm.auditOpinion == '1' && !value) {
                callback(new Error('请选择下一处理人'));
            } else {
                callback();
            }
        }, trigger: 'blur'
        }
    ],

});
let taskParams = {};
const getUrlParamObject = (url) => {
    let params = url.split('?')[1].split('&');
    let obj = {};
    for (let i = 0; i < params.length; i++) {
        let param = params[i].split('=');
        obj[param[0]] = param[1];
    }
    return obj;
}

onMounted(() => {
    isDisabled.value = true;
    taskParams = getUrlParamObject(queryParam.value.formKey)
    getItemDetail(taskParams.id);
});
// 获取详情
const getItemDetail = async (id) => {
    let res = await getReportedInfoById({ id });
    if (res.code == 200) {
        Object.keys(res.data).map((key) => {
            dialogForm[key] = res.data[key];
        });
        dialogForm.nextHandlerId = '';
        quill.value.refreshContent(res.data.reportContent);
        dialogForm.filesName = [];
        if (res.data.reportAttachs) {
            res.data.reportAttachsList.map(async (item) => {
                await dialogForm.filesName.push({
                    uid: item.entityId,
                    name: item.fileName,
                    url:
                        process.env.VUE_APP_API_HOST_URL +
                        process.env.VUE_APP_API_BASE_URL +
                        `/pub/common/file/download?service=basInfoReportFileServiceImpl&id=${item.entityId}`,
                });
            });
        }
        getNextApproverList({
            currentStatus: dialogForm.reportStatusId || '1',
            companyId: dialogForm.reportUnitId
        }).then((res) => {
            if (res.code == 200) {
                nextHandlerList.value = res.data.records;
                dialogForm.nextHandlerId = nextHandlerList.value[0].handlerId;
                nextHandlerList.value.push({
                    handlerId: dialogForm.reportUserId,
                    handlerName: dialogForm.reportUserName,
                })
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
const changeAuditOpinion = (val) => {
    if (val == '0') {
        dialogForm.nextHandlerId = dialogForm.reportUserId;
    } else {
        dialogForm.nextHandlerId = nextHandlerList.value[0].handlerId
    }
}
const getNameById = (id) => {
    let name = '';
    nextHandlerList.value.map((item) => {
        if (item.handlerId == id) {
            name = item.handlerName;
        }
    });
    return name;
}
// 弹窗确认
const dialogConfirm = () => {
    const savedata = {
        entityId : taskParams.id,
        auditOpinion: dialogForm.auditOpinion,
        auditOpinionDesc: dialogForm.auditOpinionDesc,
        nextHandlerId: dialogForm.nextHandlerId || undefined,
        nextHandlerName: getNameById(dialogForm.nextHandlerId) || undefined,
        taskId: queryParam.value.taskId,
    }
    saveData(savedata);
};
const close = () => {
    emitter.emit("tabsCloseCurrent");
}
const saveData = async (formData) => {
    await formRef.value.validate(async (valid) => {
        if (valid) {
            let res = await approveInfoReported(formData);
            if (res.code == 200) {
                ElMessage({
                    message: res.data.message,
                    type: 'success',
                });
                close();
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

.center_box{
    width: 65%;
    margin: 0 auto;
}
.footer{
    width: 300px;
    display: flex;
    margin: 0 auto;
    margin-top: 50px;
    justify-content: space-evenly;
}
</style>
