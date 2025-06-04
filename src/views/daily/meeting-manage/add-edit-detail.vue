<template>
    <el-dialog class="custom_dialog" v-model="dialogVisible" :title="title" width="800" :close-on-click-modal="false"
        :close-on-press-escape="false" @close="close">
        <el-form ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
            label-suffix="：" :inline="true">
            <el-form-item label="公司" class="form_item" prop="companyId">
                <el-select :disabled="isDisabled" v-model="dialogForm.companyId" placeholder="请选择公司" clearable
                    @change="handleChangeCompany">
                    <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="服务区" class="form_item" prop="serviceFullName">
                <el-select :disabled="isDisabled" v-model="dialogForm.serviceFullName" placeholder="请选择服务区" clearable>
                    <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.serviceName"
                        :value="item.serviceName" />
                </el-select>
            </el-form-item>
            <el-form-item label="会议时间" class="form_item" prop="meetTime">
                <el-date-picker style="width:100%" value-format="YYYY-MM-DD" :disabled="isDisabled"
                    v-model="dialogForm.meetTime" type="date" placeholder="请选择会议时间" clearable />
            </el-form-item>
            <el-form-item label="会议主持人" class="form_item" prop="master">
                <el-input :disabled="isDisabled" v-model="dialogForm.master" placeholder="请输入会议主持人" clearable />
            </el-form-item>
            <el-form-item label="参会人员" class="form_item" prop="member">
                <el-input :disabled="isDisabled" v-model="dialogForm.member" placeholder="请输入参会人员" clearable />
            </el-form-item>
            <el-form-item label="参会人数" class="form_item" prop="num">
                <el-input-number style="width:100%;text-align:left" controls-position="right" :min="0"
                    :disabled="isDisabled" v-model="dialogForm.num" type="number" placeholder="请输入参会人数" clearable />
            </el-form-item>
            <el-form-item label="会议类型" class="form_item" prop="type">
                <el-select :disabled="isDisabled" v-model="dialogForm.type" placeholder="请选择会议类型" clearable>
                    <el-option v-for="(item, index) in meetingTypeList" :key="index" :label="item.name"
                        :value="item.code" />
                </el-select>
            </el-form-item>
            <el-form-item label="会议主题" class="form_item" prop="title">
                <el-input :disabled="isDisabled" v-model="dialogForm.title" placeholder="请输入会议主题" clearable />
            </el-form-item>
            <el-form-item style="float:left" label="会议内容" class="form_item" prop="content">
                <el-input :rows="3" :disabled="isDisabled" v-model="dialogForm.content" type="textarea"
                    placeholder="请输入会议内容" clearable />
            </el-form-item>
            <el-form-item label="会议结论" class="form_item" prop="result">
                <el-input :disabled="isDisabled" v-model="dialogForm.result" placeholder="请输入结论" clearable />
            </el-form-item>
            <el-form-item label="会议费用" class="form_item" prop="cost">
                <el-input-number style="width:100%;text-align:left" controls-position="right" :min="0"
                    :disabled="isDisabled" v-model="dialogForm.cost" type="number" placeholder="请输入会议费用" clearable />
            </el-form-item>
            <el-form-item label="记录人" class="form_item" prop="recorder">
                <el-input :disabled="isDisabled" v-model="dialogForm.recorder" placeholder="请输入记录人" clearable />
            </el-form-item>
            <el-form-item label="视频上传" class="form_item">
                <el-upload :limit="10" :disabled="isDisabled" v-model:file-list="dialogForm.videoFiles"
                    class="upload-demo" action="#" list-type="text" accept=".mp4,.avi,.mov"
                    :http-request="customUploadVideo" :on-remove="handleRemoveVideo" :on-preview="handlePreviewVideo"
                    multiple :before-upload="beforeVideoAvatarUpload">
                    <el-button v-if="!isDisabled">
                        <el-icon class="el-icon--right">
                            <Plus />
                        </el-icon>点击上传
                    </el-button>
                </el-upload>
            </el-form-item>
            <el-form-item style="float:left" label="附件上传" class="form_item">
                <el-upload :limit="10" :disabled="isDisabled" v-model:file-list="dialogForm.attachmentFiles"
                    class="upload-demo" action="#" list-type="text" accept=".rar,.pdf,.zip,.docx,.xlsx"
                    :http-request="customUploadAttachment" :on-remove="handleRemoveAttachment"
                    :on-preview="handlePreviewAttachment" multiple :before-upload="beforeFileAvatarUpload">
                    <el-button v-if="!isDisabled">
                        <el-icon class="el-icon--right">
                            <Plus />
                        </el-icon>点击上传
                    </el-button>
                </el-upload>
            </el-form-item>
            <el-form-item multiple label="图片上传" class="form_item">
                <el-upload :limit="10" :disabled="isDisabled" v-model:file-list="dialogForm.imageFiles"
                    class="upload-demo" action="#" list-type="picture-card" accept=".jpg,.png,.jpeg"
                    :http-request="customUploadImage" :on-remove="handleRemoveImage" :on-preview="handlePreviewImage"
                    :before-upload="beforePictureAvatarUpload">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <div style="float:clear"></div>
        </el-form>
        <el-dialog v-model="imgDialog">
            <img style="width: 100%; object-fit: cover" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :loading="confirmLoading" v-if="!isDisabled"
                    @click="dialogConfirm(false)">确定</el-button>
                <el-button type="primary" @click="close">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, nextTick, onMounted, computed } from 'vue';
import { addMeetingManage, updateMeetingManage, getFileInfo } from '@/api/daily/meetingManage.js';
import { getServiceArea } from "@/api/dictionaryApi.js";
import { queryNormalOptions } from '@/api/dictionaryApi.js';
import { fileInfo } from "@/api/dangerItemApi";
import {
    getCompanyInfo,
} from "@/api/device/basGoodsApi";
import { getServiceAreaInfo, getCompany, getServiceAreaFullName } from "@/api/dictionaryApi.js"

const changeInput = (params) => {
    dialogForm.meetingContent = params;
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
    data: {
        type: Object,
        default: {},
    },
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
const meetingTypeList = ref([]); // 会议类型列表
const companyList = ref([]); // 公司列表
const confirmLoading = ref(false); // 确定按钮loading

const emit = defineEmits(['dialogClose']);

// 弹窗表单数据
const dialogForm = reactive({
    serviceFullName: "", //服务区名称
    companyId: "", //公司id
    meetTime: "",
    master: "",
    member: "",
    num: null,
    type: "",
    title: "",
    title: "",
    content: "",
    result: "",
    cost: null,
    recorder: "",
    videoFiles: [], // 视频列表
    attachmentFiles: [], // 附件列表
    imageFiles: [], // 图片列表
});

// 弹窗表单验证规则
const rules = reactive({
    serviceFullName: [{ required: true, message: '请选择服务区', trigger: 'change' }],
    companyId: [{ required: true, message: '请选择公司', trigger: 'change' }],
    meetTime: [{ required: true, message: '请选择会议时间', trigger: 'change' }],
    master: [{ required: true, message: '请输入会议主持人', trigger: 'blur' }],
    member: [{ required: true, message: '请输入参会人员', trigger: 'blur' }],
    num: [{ required: true, message: '请输入参会人数', trigger: 'blur' }],
    type: [{ required: true, message: '请选择会议类型', trigger: 'change' }],
    title: [{ required: true, message: '请输入会议主题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入会议内容', trigger: 'blur' }],
    result: [{ required: true, message: '请输入会议结论', trigger: 'blur' }],
    cost: [{ required: true, message: '请输入会议费用', trigger: 'blur' }],
    recorder: [{ required: true, message: '请输入记录人', trigger: 'blur' }],
});

onMounted(() => {
    if (props.type == 'add') {
        title.value = '新增';
        isDisabled.value = false;
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
queryNormalOptions({
    queriers: [{ alias: 'basMeetingTypeDictionary', param: null }],
}).then((res) => {
    meetingTypeList.value = res.data.basMeetingTypeDictionary;
});

getCompany().then(res => {
    companyList.value = res.data.records;
});

const handleChangeCompany = async (val, reset = true) => {
    // const { code, data } = await getServiceAreaInfo(val);
    const params = {
        orgId: val,
    }
    const { code, data } = await getServiceAreaFullName(params);
    if (code == 200) {
        serviceAreaList.value = data.records;
        reset && (dialogForm.serviceFullName = null);
    }
}

// 获取详情
const getItem = async (data) => {
    picList.value = []
    delPicList.value = []
    videoList.value = []
    delVideoList.value = []
    attachmentList.value = []
    delAttachmentList.value = []
    Object.keys(data).map((key) => {
        dialogForm[key] = data[key];
    });
    handleChangeCompany(dialogForm.companyId, false);
    dialogForm.videoFiles = [];
    dialogForm.attachmentFiles = [];
    dialogForm.imageFiles = [];

    if (data.files) {
        getFileInfo(data.files).then(res => {
            res.data.map(item => {
                dialogForm.attachmentFiles.push({
                    entityId: item.entityId,
                    uid: item.entityId,
                    name: item.fileName,
                    url:
                        process.env.VUE_APP_API_HOST_URL +
                        process.env.VUE_APP_API_BASE_URL +
                        `/pub/common/file/download?service=basMeetingFileServiceImpl&id=${item.entityId}`,
                });
            })
        })
    }
    if (data.picture) {
        getFileInfo(data.picture).then(res => {
            res.data.map(item => {
                dialogForm.imageFiles.push({
                    entityId: item.entityId,
                    uid: item.entityId,
                    name: item.fileName,
                    url:
                        process.env.VUE_APP_API_HOST_URL +
                        process.env.VUE_APP_API_BASE_URL +
                        `/pub/common/file/download?service=basMeetingFileServiceImpl&id=${item.entityId}`,
                });
            })
        })
    }
    if (data.video) {
        getFileInfo(data.video).then(res => {
            res.data.map(item => {
                dialogForm.videoFiles.push({
                    entityId: item.entityId,
                    uid: item.entityId,
                    name: item.fileName,
                    url:
                        process.env.VUE_APP_API_HOST_URL +
                        process.env.VUE_APP_API_BASE_URL +
                        `/pub/common/file/download?service=basMeetingFileServiceImpl&id=${item.entityId}`,
                });
            })
        })
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
    // dialogForm.serviceAreaName = serviceAreaList.value.find((item) => item.value == dialogForm.serviceAreaIds)?.label;

    dialogForm.serviceFullName = serviceAreaList.value.find((item) => item.serviceName == dialogForm.serviceFullName)?.serviceName;
    dialogForm.serviceAreaIds = serviceAreaList.value.find((item) => item.serviceName == dialogForm.serviceFullName)?.serviceAreaIdList.join(',');

    let uploadData = JSON.parse(JSON.stringify(dialogForm));
    delete uploadData.attachmentFiles;
    delete uploadData.imageFiles;
    delete uploadData.videoFiles;
    uploadData.cost = Number(uploadData.cost).toFixed(2)
    formData.append('request', JSON.stringify(uploadData));
    picList.value.map((item) => {
        if (!Object.keys(item).includes("entityId"))
            formData.append('imgFiles', item.path);
    });
    attachmentList.value.map((item) => {
        if (!Object.keys(item).includes("entityId"))
            formData.append('files', item.path);
    });
    videoList.value.map((item) => {
        if (!Object.keys(item).includes("entityId"))
            formData.append('videoFiles', item.path);
    });

    saveData(props.type, formData, isContinue);
};
const saveData = async (type, formData, isContinue) => {
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
            confirmLoading.value = true;
            if (type == 'add') {
                let res = await addMeetingManage(formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                confirmLoading.value = false;
                if (res.code == 200) {
                    ElMessage({
                        message: '新增成功',
                        type: 'success',
                    });
                    if (isContinue) {
                        Object.keys(dialogForm).map((key) => {
                            if (key == 'files' || key == 'filesName') dialogForm[key] = [];
                            else dialogForm[key] = null;
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
                if (picList.value.length > 0) {
                    picList.value.map((item) => {
                        if (!Object.keys(item).includes("entityId")) {
                            formData.append('replyFiles', item.path)
                        }
                    })
                }
                if (videoList.value.length > 0) {
                    videoList.value.map((item) => {
                        if (!Object.keys(item).includes("entityId")) {
                            formData.append('replyFiles', item.path)
                        }
                    })
                }
                if (attachmentList.value.length > 0) {
                    attachmentList.value.map((item) => {
                        if (!Object.keys(item).includes("entityId")) {
                            formData.append('replyFiles', item.path)
                        }
                    })
                }
                formData.append('deleteFileIdList', JSON.stringify(delPicList.value.concat(delVideoList.value).concat(delAttachmentList.value)))
                // formData.append('deleteFileIdList', JSON.stringify(delVideoList.value))
                // formData.append('deleteFileIdList', JSON.stringify(delAttachmentList.value))
                let res = await updateMeetingManage(formData, {
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

// 下载图片
const handleDownload = (file) => {
    let url = file.url;
    window.open(url);
};

const picList = ref([]); // 图片列表
const videoList = ref([]); // 视频列表
const attachmentList = ref([]); // 附件列表
const delPicList = ref([]); // 删除图片列表
const delVideoList = ref([]); // 删除视频列表
const delAttachmentList = ref([]); // 删除附件列表

// 上传视频
const customUploadVideo = (file) => {
    videoList.value.push({
        path: file.file,
        uid: file.file.uid,
        value: '0',
        nodeName: file.file.name,
        type: file.file.type,
    });
};

// 删除视频
const handleRemoveVideo = (file) => {
    const index = videoList.value.findIndex(item => item.uid === file.uid);
    if (index !== -1) {
        videoList.value.splice(index, 1); // 移除文件
    }
    if (Object.keys(file).includes("entityId")) {
        delVideoList.value.push(file.entityId);
    }
};

// 预览视频
const handlePreviewVideo = (file) => {
    window.open(file.url);
};

// 上传附件
const customUploadAttachment = (file) => {
    attachmentList.value.push({
        path: file.file,
        uid: file.file.uid,
        value: '0',
        nodeName: file.file.name,
        type: file.file.type,
    });
};

// 删除附件
const handleRemoveAttachment = (file) => {
    const index = attachmentList.value.findIndex(item => item.uid === file.uid);
    if (index !== -1) {
        attachmentList.value.splice(index, 1); // 移除文件
    }
    if (Object.keys(file).includes("entityId")) {
        delAttachmentList.value.push(file.entityId);
    }
};

// 预览附件
const handlePreviewAttachment = (file) => {
    window.open(file.url);
};

// 上传图片
const customUploadImage = (file) => {
    picList.value.push({
        path: file.file,
        uid: file.file.uid,
        value: '0',
        nodeName: file.file.name,
        type: file.file.type,
    });
};

// 删除图片
const handleRemoveImage = (file) => {
    const index = picList.value.findIndex(item => item.uid === file.uid);
    if (index !== -1) {
        picList.value.splice(index, 1); // 移除文件
    }
    if (Object.keys(file).includes("entityId")) {
        delPicList.value.push(file.entityId);
    }
};

// 预览图片
const handlePreviewImage = (file) => {
    imgDialog.value = true;
    dialogImageUrl.value = file.url;
};
const beforeFileAvatarUpload = (rawFile) => {
    let filename = rawFile.name.split(".");
    filename = filename[filename.length - 1]
    if (!['rar', 'pdf', 'zip', 'docx', 'xlsx'].includes(filename)) {
        ElMessage.error('上传文件只能是rar、pdf、zip、docx、xlsx格式!');
        return false;
    }
    //上传文件大小不能超过 300MB
    if (rawFile.size / 1024 / 1024 > 300) {
        ElMessage.error('上传文件大小不能超过 100MB!');
        return false;
    }
    return true;
}
const beforeVideoAvatarUpload = (rawFile) => {
    let filename = rawFile.name.split(".");
    filename = filename[filename.length - 1]
    if (!['mp4', 'avi', 'mov'].includes(filename)) {
        ElMessage.error('上传文件只能是mp4、avi、mov格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 300) {
        ElMessage.error('文件最大300MB!')
        return false
    }
    return true
}
const beforePictureAvatarUpload = (rawFile) => {
    let filename = rawFile.name.split(".");
    filename = filename[filename.length - 1]
    if (!['jpg', 'png', 'jpeg'].includes(filename)) {
        ElMessage.error('上传文件只能是jpg、png、jpeg格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 300) {
        ElMessage.error('文件最大300MB!')
        return false
    }
    return true
}
</script>

<style lang="less" scoped>
.form_item {
    width: 45%
}

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
