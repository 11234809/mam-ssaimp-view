<!-- @format -->

<template>
    <el-dialog class="custom_dialog" v-model="dialogVisible" :title="title" width="600" :close-on-click-modal="false"
        :close-on-press-escape="false" @close="close">
        <el-form ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
            label-suffix="：">
            <el-form-item label="通知文件名称" class="form_item">
                <el-input v-model="dialogForm.name" :disabled="true" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="文件类型" class="form_item">
                <el-select v-model="dialogForm.type" :disabled="true" placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in informPublishFileTypeDictionary" :key="index" :label="item.name"
                        :value="item.code" />
                </el-select>
            </el-form-item>
            <el-form-item label="公告内容" class="form_item">
                <el-input v-model="dialogForm.remark" :disabled="true" type="textarea" placeholder="请输入" />
            </el-form-item>
            
            <el-form-item label="是否需要反馈" class="form_item">
                <el-radio-group disabled v-model="dialogForm.isFeed">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="是否及时阅读" class="form_item">
                <el-radio-group disabled v-model="dialogForm.timelyReadingText">
                    <el-radio :label="'是'">是</el-radio>
                    <el-radio :label="'否'">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否反馈" class="form_item">
                <el-radio-group disabled v-model="dialogForm.feedStatusText">
                    <el-radio :label="'是'">是</el-radio>
                    <el-radio :label="'否'">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="公告文件" class="form_item">
                <el-upload v-model:file-list="dialogForm.filesNameList" :disabled="true" class="upload-demo"
                    action="#" list-type="picture" accept=".jpeg,.png,.jpg,.bmp,.gif" :http-request="customUpload">
                    <!-- <el-button>
                        <el-icon class="el-icon--right">
                            <Plus />
                        </el-icon>点击上传
                    </el-button> -->
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

            <el-form-item label="反馈内容" class="form_item">
                <el-input v-model="dialogForm.feedTxt" :disabled="isDisabled" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="反馈附件" class="form_item">
                <el-upload v-model:file-list="dialogForm.feedFiles" :disabled="isDisabled" class="upload-demo"
                    action="#" list-type="picture" accept=".jpeg,.png,.jpg,.bmp,.gif" :http-request="customUpload">
                    <el-button v-if="!isDisabled">
                        <el-icon class="el-icon--right">
                            <Plus />
                        </el-icon>点击上传
                    </el-button>
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
        </el-form>
        <el-dialog v-model="imgDialog">
            <img style="width: 100%; object-fit: cover" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" v-if="!isDisabled" @click="dialogConfirm">保存</el-button>
                <el-button type="primary" @click="close">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, nextTick, onMounted, computed } from 'vue';
import {
    getInformFileById,
    feedbackInformFile
} from '@/api/informFile/informFileCheck';
import { queryNormalOptions } from '@/api/dictionaryApi.js';


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
const informPublishFileTypeDictionary = ref([]); // 附件类型
const emit = defineEmits(['dialogClose']);

// 弹窗表单数据
const dialogForm = reactive({
    name:'',
    type:'',
    companyText:'',
    isFeed:'',
    timelyReadingText:'',
    feedStatusText:'',
    feedFilesList:[],
    feedTxt:null,
    feedFiles:[],
});
// 弹窗表单验证规则
const rules = reactive({
    dangerItemName: [{ required: true, message: '请输入危化品名称', trigger: 'change' }],
    stayTime: [{ required: true, message: '请输入停留时长（分钟）', trigger: 'blur' }],
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
    } else if (props.type == 'feedback'){
        title.value = '反馈';
        isDisabled.value = false;
        getItem(props.id);
    }
});
queryNormalOptions({
    queriers: [{ alias: 'informPublishFileTypeDictionary', param: null }],
}).then((res) => {
    informPublishFileTypeDictionary.value = res.data.informPublishFileTypeDictionary;
});
// 获取详情
const getItem = async (id) => {
    let res = await getInformFileById({ id });
    if (res.code == 200) {
        Object.keys(res.data).map((key) => {
            dialogForm[key] = res.data[key];
        });
        dialogForm.feedFiles = [];
        dialogForm.filesNameList = [];
        dialogForm.timelyReadingText = res.data.timelyReading == 2 ? '是' : '否';
        if(res.data.filesList){
            res.data.filesList.map((item) => {
                dialogForm.filesNameList.push({
                    uid: item.entityId,
                    name: item.fileName,
                    url:
                        process.env.VUE_APP_API_HOST_URL +
                        process.env.VUE_APP_API_BASE_URL +
                        `/pub/common/file/download?service=basPolicyFileFileServiceImpl&id=${item.entityId}`,
                });
            });
        }
        if (res.data.feedFiles) {
            res.data.feedFilesList.map(async (item) => {
                dialogForm.feedFiles.push({
                    uid: item.entityId,
                    name: item.fileName,
                    url: process.env.VUE_APP_API_HOST_URL +
                        process.env.VUE_APP_API_BASE_URL +
                        `/pub/common/file/download?service=basPolicyRecordFileServiceImpl&id=${item.entityId}`,
                });
            });
        }
    }
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
    emit('dialogClose');
};
// 弹窗确认
const dialogConfirm = () => {
    const formData = new FormData();
    formData.append('request', JSON.stringify(dialogForm));
    picList.value.map((item) => {
        formData.append('files', item.path);
    });
    saveData(props.type, formData);
};
const saveData = async (type, formData) => {
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
            if (type == 'add') {
                let res = await getDangerItemAdd(formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
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
            if (type == 'feedback') {
                let res = await feedbackInformFile(formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
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
