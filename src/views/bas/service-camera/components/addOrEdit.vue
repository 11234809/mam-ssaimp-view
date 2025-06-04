<template>
  <div class="add-or-edit">
    <el-dialog class="custom_dialog" 
      v-model="props.visible"   
      width="790"  :close-on-click-modal="false"  :close-on-press-escape="false" :show-close="false">
      <template #header>
        <div class="add-edit-header">
          <h4>{{ title }}</h4>
          <img src="@/assets/images/close.png" @click="close"/>
        </div>
      </template>
      <el-form ref="formRef" :model="formData" label-width="auto" class="custom_form" label-suffix=":" :rules="rules">
        <el-form-item label="服务区" class="form_item" prop="serviceAreaId">
          <el-select v-model="formData.serviceAreaId" placeholder="请选择服务区"  clearable 
              filterable>
            <el-option
              v-for="(item, index) in serviceAreaList"
              :key="index"
              :label="item.label"
              :value="item.value"/>
            </el-select>
        </el-form-item>
        <el-form-item label="卡口类型" class="form_item" prop="type">
          <el-select v-model="formData.type" placeholder="请选择卡口类型"  clearable>
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.name"
              :value="item.code"/>
            </el-select>
        </el-form-item>
        <el-form-item label="卡口名称" class="form_item" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请填写卡口名称"
            maxlength="20"
            clearable/>
        </el-form-item>
        <el-form-item label="卡口编码" class="form_item" prop="code">
          <el-input
            v-model="formData.code"
            placeholder="请填写卡口编码"
            maxlength="20"
            clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogConfirm" :loading="loading">
            保存<img src="@/assets/images/sure.png"/>
          </el-button>
          <el-button @click="close">
            关闭<img src="@/assets/images/cancel.png"/>
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import { ref,onMounted,defineEmits,defineProps,computed,useTemplateRef,watch } from 'vue'
  import { getServiceArea } from "@/api/dictionaryApi.js";
  import { addData,editData,getDictItems,getQueryPageList } from "@/api/serviceCamera.js";
  import { ElMessage } from 'element-plus';
  onMounted(async () =>{
    await getDictionary()
    await getDictionaryType()
  })
 
  const formRef = useTemplateRef('formRef');
  const props = defineProps({
    visible: { // 弹窗是否显示
      type: Boolean,
      default: false,
    },
    detailData: { // 详情数据
      type: Object,
      default: () => {},
    },
  })
  // 监听详情数据变化
  watch(() => props.detailData, (val) => {
    if(val.entityId ){
      formData.value = {...props.detailData};
      formData.value.serviceAreaId = props.detailData.serviceAreaId+'';
      formData.value.type = props.detailData.entityStatus +'';
    }else{
      formData.value = {
        serviceAreaId: '', // 服务区ID
        name: '', // 卡口名称
        type: '', // 卡口类型
        code:'' // 卡口编码
      }
    }
  })
  const emit = defineEmits(['update:visible','getList']);

  // 弹窗动态标题
  const title = computed(() => { // 弹窗标题
    return props.detailData.entityId ? '编辑' : '添加';
  });
  const formData = ref({
    serviceAreaId: '', // 服务区ID
    name: '', // 卡口名称
    type: '', // 卡口类型
    code:'' // 卡口编码
  })
  // 表单验证规则
  const rules = ref({
    serviceAreaId: [{ required: true, message: '请选择服务区名称', trigger: 'change' }],
    type: [{ required: true, message: '请选择卡口类型', trigger: 'change' }],
    name: [{ required: true, message: '请选填写卡口名称', trigger: 'blur' }],
    code: [{ required: true, message: '请选填写卡口编码', trigger: 'blur' }]
  });
  const serviceAreaList = ref([]); // 服务区列表
  // 获取服务区列表下拉
  const getDictionary = () => {
    getServiceArea().then(({ code, data }) => 
      {
        if (code == 200) {
            serviceAreaList.value = data.records;
        }
      }).catch((err) => {
          console.log(err);
      });
  };
  const typeList = ref([]); // 卡口类型列表
  // 卡口类别
  const getDictionaryType = async () => {
    try{
      const { data } = await getDictItems({queriers:[ { alias: "bayonetTypeDictionary", param: null }]})
      typeList.value = data?.bayonetTypeDictionary ?? []; 
    }catch(error){
      ElMessage({
        message: error.data.message,
        type: 'error',
      }); 
    }
  }
  const loading = ref(false); // 加载中
  // 弹窗确定
  const dialogConfirm = async () => {
    loading.value = true;
    await formRef.value.validate(async (valid, fields) => {
      if (valid) {
        let result = {}
        if(props.detailData.entityId){
          edit()
        }else{
          add()
        }
      }else{
        loading.value = false;
      }
    })
  }
  const edit = () => {
    editData(formData.value).then(response => {
     const {data,code,message} = response
      if(code === 500){
        ElMessage({
          message,
          type: 'error',
        });
      }else if(code === 200){
        ElMessage({
          message: '添加成功',
          type:'success',
        });
        close()
      }
    }).catch((error) => {
        ElMessage({
        message: error,
        type: 'error',
      });
    }).finally(() => {
      loading.value = false;
    }) ;
  }
  const add = () => {
    addData(formData.value).then(response => {
      const {data,code,message} = response
      if(code === 500){
        ElMessage({
          message,
          type: 'error',
        });
      }else if(code === 200){
        ElMessage({
          message: '添加成功',
          type:'success',
        });
        close()
      }
    }).catch((error) => {
        ElMessage({
        message: error,
        type: 'error',
      });
    }).finally(() => {
      loading.value = false;
    }) ;
  }
  // 关闭弹窗
  const close = () => {
    emit('update:visible', false);
    emit('getList')
  }

</script>
<style lang="less" scoped>
.add-or-edit {
  .custom_dialog {
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
      img {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
    .custom_form {
      margin-bottom: 20px;

      .form_item {
        .el-select,
        .el-input {
          min-width: 240px;
        }
      }
    }
  }
}
</style>