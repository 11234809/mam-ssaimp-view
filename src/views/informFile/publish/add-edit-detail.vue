<!-- @format -->

<template>
    <el-dialog class="custom_dialog" v-model="dialogVisible" :title="title" width="600" :close-on-click-modal="false"
        :close-on-press-escape="false" @close="close">
        <el-form ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
            label-suffix="：">
            <el-form-item label="通知文件名称" class="form_item" prop="name">
                <el-input v-model="dialogForm.name" :disabled="isDisabled" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="文件类型" class="form_item" prop="type">
                <el-select v-model="dialogForm.type" :disabled="isDisabled" placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in informPublishFileTypeDictionary" :key="index" :label="item.name"
                        :value="item.code" />
                </el-select>
            </el-form-item>
            <el-form-item label="公告内容" class="form_item" prop="remark">
                <el-input v-model="dialogForm.remark" :disabled="isDisabled" type="textarea" placeholder="请输入" />
            </el-form-item>
            
            <el-form-item label="是否需要反馈" class="form_item" prop="isFeed">
                <el-radio-group :disabled="isDisabled" v-model="dialogForm.isFeed">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="接收范围" class="form_item" prop="roleCodeList">
                <el-select v-model="dialogForm.roleCodeList" multiple filterable :disabled="isDisabled" placeholder="请选择" clearable
                :reserve-keyword="false">
                    <el-option v-for="(item, index) in roleList" :key="index" :label="item.roleName"
                        :value="item.entityId" />
                </el-select>
            </el-form-item>
            <el-form-item label="文件" class="form_item">
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

            
        </el-form>
        <el-dialog v-model="imgDialog">
            <img style="width: 100%; object-fit: cover" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
        <template #footer>
            <div class="dialog-footer">
                <el-button :loading="confirmLoading" type="primary" v-if="!isDisabled" @click="dialogConfirm">确定</el-button>
                <el-button type="primary" @click="close">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, nextTick, onMounted, computed } from 'vue';
import {
    addInformFile,
    updateInformFile,
    getInformFileById,
    getRole
} from '@/api/informFile/informFilePublish.js';
import { queryNormalOptions } from '@/api/dictionaryApi.js';
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
const formRef = ref(null); // 表单ref
const dialogVisible = computed(() => {
    return props.visible;
}); // 弹窗
const title = ref('新增'); // 弹窗标题
const isDisabled = ref(false); // 禁用
const imgDialog = ref(false); // 预览图片弹窗
const dialogImageUrl = ref(''); // 预览图片地址
const files = ref([]); // 附件列表
const informPublishFileTypeDictionary = ref([]); // 发布类型字典
const roleList = ref([]); // 角色列表
const confirmLoading = ref(false); // 确定按钮loading
const emit = defineEmits(['dialogClose']);

// 弹窗表单数据
const dialogForm = reactive({
    name: '', // 通知文件名称
    type: '', // 文件类型
    remark: '', // 公告内容
    isFeed: 0, // 是否需要反馈
    roleCodeList: [], // 接受范围
    filesName:[],// 附件
});
// 弹窗表单验证规则
const rules = reactive({
    name: [{ required: true, message: '请输入通知文件名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择文件类型', trigger: 'change' }],
    isFeed: [{ required: true, message: '请选择是否需要反馈', trigger: 'change' }],
    remark: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
    roleCodeList: [{ required: true, message: '请选择接受范围', trigger: 'change' }],

});

queryNormalOptions({
    queriers: [{ alias: 'informPublishFileTypeDictionary', param: null }],
}).then((res) => {
    informPublishFileTypeDictionary.value = res.data.informPublishFileTypeDictionary;
});

onMounted(() => {
    if (props.type == 'add') {
        title.value = '新增';
        isDisabled.value = false;
    } else if (props.type == 'edit') {
        title.value = '编辑';
        isDisabled.value = false;
        getInformFilePublishItem(props.id);
    } else if (props.type == 'detail') {
        title.value = '详情';
        isDisabled.value = true;
        getInformFilePublishItem(props.id);
    }
});

getRole().then((res) => {
    roleList.value = res.data.records;
})
// 获取详情
const getInformFilePublishItem = async (id) => {
    picList.value = []
    delFileList.value = []
    let res = await getInformFileById({ id });
    if (res.code == 200) {
        Object.keys(res.data).map((key) => {
            dialogForm[key] = res.data[key];
        });
        dialogForm.roleCodeList = res.data.roleCode.split(',');
        dialogForm.filesName = [];
        if (res.data.files) {
            let arr = res.data.files.split(',');
            res.data.filesList.map(async (item) => {
                await dialogForm.filesName.push({
                    entityId: item.entityId,
                    uid: item.entityId,
                    name: item.fileName,
                    url:
                        process.env.VUE_APP_API_HOST_URL +
                        process.env.VUE_APP_API_BASE_URL +
                        `/pub/common/file/download?service=basPolicyFileFileServiceImpl&id=${item.entityId}`,
                });
            });
        }
        picList.value = await Promise.all(
            res.data.filesList.map(async (item) => {
                const fileInfo = await getFileInfo(item.entityId); // 获取文件信息
                return {
                    entityId: item.entityId,
                    name: item.fileName,
                    url: fileInfo // 假设 fileInfo 是一个对象，包含 url 属性
                };
            })
        )
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
    confirmLoading.value = true;
    const formData = new FormData();
    dialogForm.roleCode = dialogForm.roleCodeList.join(',');
    dialogForm.isFeedText = dialogForm.isFeed == "0" ? '否' : '是';
    const savedata = JSON.stringify(dialogForm);
    formData.append('request', savedata);
    picList.value.map((item) => {
        if (!Object.keys(item).includes("entityId"))
            formData.append('files', item.path);
    });
    saveData(props.type, formData);
};
const saveData = async (type, formData) => {
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
            if (type == 'add') {
                let res = await addInformFile(formData, {
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
                let res = await updateInformFile(formData, {
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
