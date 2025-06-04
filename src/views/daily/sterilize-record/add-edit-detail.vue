<template>
    <el-dialog class="custom_dialog" v-model="dialogVisible" :title="title" width="700" :close-on-click-modal="false"
        :close-on-press-escape="false" @close="close">
        <el-form inline ref="formRef" :model="dialogForm" label-width="auto" class="custom_form" :rules="rules"
            label-suffix="：">
            <el-form-item label="选择服务区" class="form_item" prop="serviceAreaText">
                <el-select :disabled="isDisabled" v-model="dialogForm.serviceAreaText" placeholder="请选择服务区" clearable>
                    <el-option v-for="(item, index) in serviceAreaList" :key="index" :label="item.name"
                        :value="item.code" />
                </el-select>
            </el-form-item>
            <el-form-item label="区域类型" class="form_item" prop="disinfectTypeText">
                <el-input :disabled="isDisabled" v-model="dialogForm.disinfectTypeText" placeholder="请输入区域类型" clearable />
            </el-form-item>
            <el-form-item label="消毒时间" class="form_item" prop="disinfectTime">
                <el-input :disabled="isDisabled" v-model="dialogForm.disinfectTime" placeholder="请输入消毒时间" clearable />
            </el-form-item>
            <el-form-item label="消毒方式" class="form_item" prop="disinfectWayText">
                <el-input  disabled v-model="dialogForm.disinfectWayText" 
                placeholder="请输入消毒方式" clearable />
            </el-form-item>
            <el-form-item label="用药名称" class="form_item" prop="medicNameText">
                <el-input  disabled v-model="dialogForm.medicNameText"   placeholder="请输入用药名称" clearable />
            </el-form-item>
            <el-form-item style="float:right" label="图片" class="form_item">
                <el-upload :disabled="isDisabled" v-model:file-list="dialogForm.filesName" class="upload-demo"
                    action="#" list-type="picture" accept=".jpeg,.png,.jpg,.bmp,.gif" :http-request="customUpload">
                    <!-- <el-button>
                        <el-icon class="el-icon--right">
                            <Plus />
                        </el-icon>点击上传
                    </el-button> -->
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
            <el-form-item label="备注" class="form_item">
                <el-input :disabled="isDisabled" v-model="dialogForm.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
            <div style="clear: both;"></div>
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
import { addSterilizeRecord, updateSterilizeRecord, getReportedInfoById, /* fileInfo */} from '@/api/daily/sterilizeRecord.js';

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

const emit = defineEmits(['dialogClose']);

// 弹窗表单数据
const dialogForm = reactive({
    serviceAreaText: '', // 选择服务区
    disinfectTypeText: '', // 区域类型
    disinfectTime: '', // 消毒时间
    disinfectWayText: '', // 消毒方式
    medicNameText: '', // 用药名称
    filesName: [], // 图片列表
    remark: '', // 备注
});
// 弹窗表单验证规则
const rules = reactive({
    serviceAreaText: [{ required: true, message: '请选择服务区', trigger: 'change' }],
    disinfectTypeText: [{ required: true, message: '请输入区域类型', trigger: 'blur' }],
    disinfectTime: [{ required: true, message: '请选择消毒时间', trigger: 'change' }],
    disinfectWay: [{ required: true, message: '请输入消毒方式', trigger: 'blur' }],
    medicNameText: [{ required: true, message: '请输入用药名称', trigger: 'blur' }],
});

onMounted(() => {
    if (props.type == 'add') {
        title.value = '新增';
        isDisabled.value = false;
    } else if (props.type == 'edit') {
        title.value = '编辑';
        isDisabled.value = false;
        getSterlizeItem(props.id);
    } else if (props.type == 'detail') {
        title.value = '详情';
        isDisabled.value = true;
        getSterlizeItem(props.id);
    }
});
// 获取详情
const getSterlizeItem = async (id) => {
    
    let res = await getReportedInfoById({ id });
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
                            uid: item,
                            name: '',//item.fileName,
                            url:
                                process.env.VUE_APP_API_HOST_URL +
                                process.env.VUE_APP_API_BASE_URL +
                                `/pub/common/file/download?service=sterilizeRecordFileServiceImpl&id=${item}`,
                        });
                    // } else {
                //         dialogForm.filesName = [];
                //     }
                // });
            });
        }
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
                let res = await addSterilizeRecord(formData, {
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
                let res = await updateSterilizeRecord(formData, {
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

.form_item {
    width: 300px;
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
::v-deep(.el-input.is-disabled .el-input__inner) {
  &::placeholder {
    color: #606266 !important;
  }
}
</style>
