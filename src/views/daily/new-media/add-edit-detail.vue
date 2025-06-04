<template>
    <el-dialog class="custom_dialog" v-model="dialogVisible" :title="title" width="800" :close-on-click-modal="false"
        :close-on-press-escape="false" @close="close">
        <el-form ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
            label-suffix="：">
            <el-form-item label="服务区名称" class="form_item" prop="serviceAreaId">
                <el-select :disabled="isDisabled" v-model="dialogForm.serviceAreaId" placeholder="请选择服务区" clearable>
                    <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="报送类型" class="form_item" prop="submissionType">
                <el-select :disabled="isDisabled" v-model="dialogForm.submissionType" placeholder="请选择报送类型" clearable>
                    <el-option v-for="(item, index) in reportTypeList" :key="index" :label="item.name"
                        :value="~~item.code" />
                </el-select>
            </el-form-item>
            <el-form-item label="报送内容" class="form_item" prop="submissionContent">
                <Editor ref="quill" :value="dialogForm.submissionContent" :readOnly="isDisabled" :min-height="192"
                    @update:input='changeInput' />
            </el-form-item>
            <el-form-item label="图片上传" class="form_item">
                <el-upload :disabled="isDisabled" v-model:file-list="dialogForm.filesName" class="upload-demo"
                    action="#" list-type="picture" accept=".jpeg,.png,.jpg,.bmp,.gif" :http-request="customUpload"
                    :on-remove="handleRemove" :on-preview="handlePreview" multiple>
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

            <el-form-item v-if="type != 'add'" label="准确性" class="form_item">
                <el-select :disabled="type != 'exam'" v-model="dialogForm.veracity" placeholder="请选择准确性" clearable>
                    <el-option v-for="(item, index) in accuracyTypeList" :key="index" :label="item.name"
                        :value="item.code" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="type != 'add' && dialogForm.veracity == '1'" label="扣分" class="form_item"
                prop="reportTime">
                <el-input :disabled="type == 'detail'" v-model="dialogForm.score" type="number" max="0" placeholder=""
                    clearable />
            </el-form-item>
        </el-form>
        <el-dialog v-model="imgDialog">
            <img style="width: 100%; object-fit: cover" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :loading="confirmLoading" v-if="type == 'add'" @click="dialogConfirm(true)">提交并继续添加</el-button>
                <el-button type="primary" :loading="confirmLoading" @click="dialogConfirm(false)">确定</el-button>
                <el-button type="primary" @click="close">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, nextTick, onMounted, computed } from 'vue';
import { addNewMedia, updateNewMedia, getNewMediaById } from '@/api/daily/newMedia.js';
import Editor from "@/components/Editor"
import { getServiceArea } from "@/api/dictionaryApi.js";
import { queryNormalOptions } from '@/api/dictionaryApi.js';
import { fileInfo } from "@/api/dangerItemApi";

const changeInput = (params) => {
    dialogForm.submissionContent = params;
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
const dialogVisible = computed(() => {
    return props.visible;
}); // 弹窗
const title = ref('新增'); // 弹窗标题
const isDisabled = ref(false); // 禁用
const imgDialog = ref(false); // 预览图片弹窗
const dialogImageUrl = ref(''); // 预览图片地址
const files = ref([]); // 附件列表
const serviceAreaList = ref([]); // 服务区域列表
const reportTypeList = ref([]); // 报送类型列表
const accuracyTypeList = ref([]); // 准确性列表
const quill = ref(null); // 富文本
const confirmLoading = ref(false); // 提交loading

const emit = defineEmits(['dialogClose']);

// 弹窗表单数据
const dialogForm = reactive({
    serviceAreaId: "",
    submissionType: "",
    submissionContent: "",
    filesName: [], // 图片列表
    veracity: "", // 准确性
    score: null,
});
// 弹窗表单验证规则
const rules = reactive({
    serviceAreaId: [{ required: true, message: '请选择服务区', trigger: 'change' }],
    submissionType: [{ required: true, message: '请选择报送类型', trigger: 'change' }],
    submissionContent: [{ required: true, message: '请输入报送内容', trigger: 'blur' }],

});

onMounted(() => {
    if (props.type == 'add') {
        title.value = '新增';
        isDisabled.value = false;
    } else if (props.type == 'edit') {
        title.value = '编辑';
        isDisabled.value = false;
        getItem(props.id);
    } else if (props.type == 'detail') {
        title.value = '详情';
        isDisabled.value = true;
        getItem(props.id);
    }else if (props.type == 'exam') {
        title.value = '编辑';
        isDisabled.value = true;
        getItem(props.id);
    }
});
getServiceArea().then(res => {
    serviceAreaList.value = res.data.records;
});
queryNormalOptions({
    queriers: [{ alias: 'submitTypeDictionary', param: null }],
}).then((res) => {
    reportTypeList.value = res.data.submitTypeDictionary;
});
queryNormalOptions({
    queriers: [{ alias: 'accuracyTypeDictionary', param: null }],
}).then((res) => {
    accuracyTypeList.value = res.data.accuracyTypeDictionary;
});

// 获取详情
const getItem = async (id) => {
    picList.value = []
    delFileList.value = []
    let res = await getNewMediaById({ id });
    if (res.code == 200) {
        Object.keys(res.data).map((key) => {
            dialogForm[key] = res.data[key];
        });
        dialogForm.filesName = [];
        if (res.data.files) {
            let arr = res.data.files.split(',');
            arr.map(async (item) => {
                // await fileInfo({ id: item }).then(async (res) => {
                //     if (res.code == 200) {
                await dialogForm.filesName.push({
                    entityId: item.entityId,
                    uid: item,
                    name: res.data.fileName,
                    url:
                        process.env.VUE_APP_API_HOST_URL +
                        process.env.VUE_APP_API_BASE_URL +
                        `/pub/common/file/download?service=basNewMediaFileServiceImpl&id=${item}`,
                });
                //     } else {
                //         dialogForm.filesName = [];
                //     }
                // });
            });
        }
        if(res.data.files){
            picList.value = await Promise.all(
                res.data.files.split(',').map(async (item) => {
                    const fileInfo = await getFileInfo(item.entityId); // 获取文件信息
                    return {
                        entityId: item.entityId,
                        name: item.fileName,
                        url: fileInfo // 假设 fileInfo 是一个对象，包含 url 属性
                    };
                })
            )
        }
        quill.value.refreshContent(dialogForm.submissionContent);
    }
};
const getFileInfo = async (itemId) => {
    const res = await fileInfo({ id: itemId })
    if (res.code === '200') {
        return process.env.VUE_APP_API_HOST_URL +
            process.env.VUE_APP_API_BASE_URL +
            `/pub/common/file/download?service=basPolicyFileFileServiceImpl&id=${itemId}`
    } else {
        return ''
    }
}
// 弹窗关闭
const close = () => {
    confirmLoading.value = false;
    emit('dialogClose');
};
// 弹窗确认
const dialogConfirm = (isContinue) => {
    const formData = new FormData();
    formData.append('request', JSON.stringify(dialogForm));
    picList.value.map((item) => {
        if (!Object.keys(item).includes("entityId"))
            formData.append('files', item.path);
    });
    saveData(props.type, formData, isContinue);
};
const saveData = async (type, formData, isContinue) => {
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
            confirmLoading.value = true;
            if (type == 'add') {
                let res = await addNewMedia(formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                confirmLoading.value = false;
                if (res.code == 200) {
                    ElMessage({
                        message: '新增成功',
                        type: 'success',
                    });
                    if(isContinue){
                        Object.keys(dialogForm).map((key) => {
                            if(key == 'files' || key == 'filesName') dialogForm[key] = [];
                            else dialogForm[key] = null;
                        });
                        quill.value.refreshContent('');
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
            if (type == 'edit' || type == 'exam') {
                if (picList.value.length > 0) {
                    picList.value.map((item) => {
                        if (!Object.keys(item).includes("entityId")) {
                            formData.append('replyFiles', item.path)
                        }
                    })
                }
                formData.append('deleteFileIdList', JSON.stringify(delFileList.value))
                let res = await updateNewMedia(formData, {
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
