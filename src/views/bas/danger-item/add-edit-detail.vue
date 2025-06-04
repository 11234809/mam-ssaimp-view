<!-- @format -->

<template>
    <el-dialog 
        class="custom_dialog" 
        v-model="dialogVisible" 
        :title="title" width="600" 
        :close-on-click-modal="false"
        :close-on-press-escape="false" 
        @close="close"
    >
        <el-form 
            ref="formRef" 
            :model="dialogForm" 
            label-width="auto" 
            class="custom_form" 
            :rules="rules"
            label-suffix="："
        >
            <el-form-item label="危化品名称" class="form_item" prop="dangerItemName">
                <el-input 
                    v-model="dialogForm.dangerItemName" 
                    :disabled="isDisabled" 
                    placeholder="请输入危化品名称" 
                    clearable 
                />
            </el-form-item>
            <el-form-item label="停留时长（分钟）" class="form_item" prop="stayTime">
                <el-input
                    v-model="dialogForm.stayTime" 
                    :disabled="isDisabled" 
                    @blur="stayTimeBlur(dialogForm.stayTime)"
                    placeholder="请输入停留时长（分钟）" 
                    clearable 
                />
            </el-form-item>
            <el-form-item label="注意事项" class="form_item">
                <el-input 
                    v-model="dialogForm.attention" 
                    :disabled="isDisabled" 
                    type="textarea" 
                    placeholder="请输入注意事项" 
                />
            </el-form-item>
            <el-form-item label="附件" class="form_item">
                <el-upload 
                    v-model:file-list="dialogForm.filesName" 
                    :disabled="isDisabled" 
                    class="upload-demo"
                    action="#" 
                    list-type="picture" 
                    accept=".jpeg,.png,.jpg,.bmp,.gif" 
                    :http-request="customUpload"
                >
                    <el-button>
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
    getDangerItemAdd,
    getDangerItemEdit,
    getDangerItemGet,
    fileInfo,
} from '@/api/dangerItemApi.js';

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

const emit = defineEmits(['dialogClose']);

// 弹窗表单数据
const dialogForm = reactive({
    dangerItemName: '', // 危化品名称
    stayTime: '', // 停留时长
    attention: '', // 注意事项
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
        getDangerItem(props.id);
    } else if (props.type == 'detail') {
        title.value = '详情';
        isDisabled.value = true;
        getDangerItem(props.id);
    }
});
// 获取详情
const getDangerItem = async (id) => {
    let res = await getDangerItemGet({ id });
    if (res.code == 200) {
        Object.keys(res.data).map((key) => {
            dialogForm[key] = res.data[key];
        });
        dialogForm.filesName = [];
        if (res.data.files) {
            let arr = res.data.files.split(',');
            arr.map(async (item) => {
                await fileInfo({ id: item }).then(async (res) => {
                    if (res.code == 200) {
                        await dialogForm.filesName.push({
                            uid: item,
                            name: res.data.fileName,
                            url:
                                process.env.VUE_APP_API_HOST_URL +
                                process.env.VUE_APP_API_BASE_URL +
                                `/pub/common/file/download?service=basDangerItemFileServiceImpl&id=${item}`,
                        });
                    } else {
                        dialogForm.filesName = [];
                    }
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
            if (type == 'edit') {
                let res = await getDangerItemEdit(formData, {
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
</style>
