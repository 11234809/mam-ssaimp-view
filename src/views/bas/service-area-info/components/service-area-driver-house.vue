<!--
 * @Author: fbz
 * @Date: 2025-05-06 15:16:19
 * @LastEditors: fbz
 * @LastEditTime: 2025-05-20 15:11:33
-->
<template>
  <div class="service-area-driver-house">
    <div class="title"><span></span>司机之家</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否建设货车'司机之家'" prop="driverHouseBean.isHome">
          <el-select 
            v-model="formInfo.driverHouseBean.isHome" 
            placeholder="请选择是否建设货车'司机之家'" 
            clearable
            :disabled="formInfoDisabled"
            @change="changeIsHome"
            @clear="clearIsHome">
            <!-- <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option> -->
            <el-option v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" :key="item.name + index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="isShow">
      <el-col :span="8">
        <el-form-item label="距离重庆主城距离（KM）：" prop="driverHouseBean.distance">
          <el-input v-model="formInfo.driverHouseBean.distance" maxlength="50" 
          show-word-limit placeholder="请输入距离重庆主城距离（KM）" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="司机之家房屋面积（m2）：" prop="driverHouseBean.homeArea">
          <el-input v-model="formInfo.driverHouseBean.homeArea" maxlength="50" 
          show-word-limit placeholder="请输入司机之家房屋面积（m2）" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="能同时容纳人数：" prop="driverHouseBean.totalNum">
          <el-input v-model="formInfo.driverHouseBean.totalNum" maxlength="50" 
          show-word-limit placeholder="请输入能同时容纳人数" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="年人均使用人数：" prop="driverHouseBean.annualPersonNum">
          <el-input v-model="formInfo.driverHouseBean.annualPersonNum" placeholder="请输入年人均使用人数" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="司机之家服务功能：" prop="driverHouseBean.serviceFunction">
          <el-checkbox-group v-model="formInfo.driverHouseBean.serviceFunction" :disabled="formInfoDisabled">
            <el-checkbox :label="item.name" :value="item.code"  v-for="(item,index) in dictItemsList.basAreaInfoServiceDictionary" :key="item.code + index"/>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="简要说明：" prop="driverHouseBean.description">
          <el-input v-model="formInfo.driverHouseBean.description"  type="textarea"  maxlength="300" show-word-limit placeholder="请输入简要说明" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="简要说明图片：" prop="driverHouseBean.descriptionImageList" >
          <el-upload
          v-model:file-list="descriptionImageList"
          :disabled="formInfoDisabled"
          class="upload-class"
          action="#"
          :limit="5"
          list-type="picture-card"
          accept=".jpeg,.png,.jpg,.bmp,.gif"
          :http-request="customUpload" >
          <el-icon class="el-icon--right"> <Plus /> </el-icon>
          <template #file="{ file }">
            <div class="cst_upload_box">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="cst_upload_name">{{ file.name }}</span>
              <div class="shadow-box" v-if="!formInfoDisabled">
                <el-icon @click="handlePreview(file)">
                  <View />
                </el-icon>
                <el-icon @click="handleRemove(file)">
                  <Delete />
                </el-icon>
              </div>
            </div>
          </template>
        </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否按照标准设计打造：" prop="driverHouseBean.isStandardDesign">
          <el-select v-model="formInfo.driverHouseBean.isStandardDesign" placeholder="请选择是否按照标准设计打造" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" :key="item.name + index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否通过验收：" prop="driverHouseBean.isPass">
          <el-select v-model="formInfo.driverHouseBean.isPass" placeholder="请选择是否通过验收" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" :key="item.name + index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="投建单位：" prop="driverHouseBean.constructedUnit">
          <el-input v-model="formInfo.driverHouseBean.constructedUnit" placeholder="请输入投建单位" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="投资建设费用：" prop="driverHouseBean.constructedCost">
          <el-input v-model="formInfo.driverHouseBean.constructedCost" placeholder="请输入投资建设费用" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="管理单位：" prop="driverHouseBean.manageUnit">
          <el-input v-model="formInfo.driverHouseBean.manageUnit" placeholder="请输入管理单位" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="现场负责人：" prop="driverHouseBean.sitePrincipal">
          <el-input v-model="formInfo.driverHouseBean.sitePrincipal" placeholder="请输入现场负责人" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="现场负责人联系电话：" prop="driverHouseBean.sitePrincipalTel">
          <el-input v-model="formInfo.driverHouseBean.sitePrincipalTel" placeholder="请输入现场负责人联系电话" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建成时间：" prop="driverHouseBean.buildTime">
          <el-date-picker v-model="formInfo.driverHouseBean.buildTime" type="month" value-format="YYYY-MM" placeholder="请选择建成时间" :size="size"
          :disabled="formInfoDisabled" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否为同心驿站：" prop="driverHouseBean.isStation">
          <el-select v-model="formInfo.driverHouseBean.isStation" placeholder="请选择是否为同心驿站" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" :key="item.name + index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="特色服务：" prop="driverHouseBean.specialService">
          <el-input v-model="formInfo.driverHouseBean.specialService"  type="textarea"  maxlength="500" show-word-limit placeholder="请输入特色服务" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="特色服务图片：" prop="driverHouseBean.specialServiceImageList" >
          <el-upload
          v-model:file-list="specialServiceImageList"
          :disabled="formInfoDisabled"
          class="upload-class"
          action="#"
          :limit="5"
          list-type="picture-card"
          accept=".jpeg,.png,.jpg,.bmp,.gif"
          :http-request="customUploadSpecialImage" >
          <el-icon class="el-icon--right"> <Plus /> </el-icon>
          <template #file="{ file }">
            <div class="cst_upload_box">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="cst_upload_name">{{ file.name }}</span>
              <div class="shadow-box" v-if="!formInfoDisabled">
                <el-icon @click="handlePreview(file)">
                  <View />
                </el-icon>
                <el-icon @click="handleRemoveSpecialImage(file)">
                  <Delete />
                </el-icon>
              </div>
            </div>
          </template>
        </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible">
      <img :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script setup>
  import { storeToRefs } from "pinia";
  import { useAreaInfoStore } from "../../../../store/useAreaInfoStore";
  import { ElMessage } from "element-plus";
  import { computed,watch,ref,onMounted } from 'vue'
  import { getDriverFileInfo,updateDriver } from '../../../../api/informationServiceAreaApi.js'

  const areaInfoStore = useAreaInfoStore();
  const { formInfoDisabled, formInfo,dictItemsList } = storeToRefs(areaInfoStore);
  
  watch(() => formInfo.value.driverHouseBean.serviceFunction, (newVal, oldVal) => {
    formInfo.value.driverHouseBean.serviceFunction = formInfo.value.driverHouseBean.serviceFunction ?? []
  }, { immediate: true })

  // 是否展示货车'司机之家'的表单
  const isShow = computed(() => {
    // 如果formInfo.value.driverHouseBean.isHome 有值，并且值为1，返回true，否则返回false
    if (formInfo.value.driverHouseBean.isHome && formInfo.value.driverHouseBean.isHome != "0") {
      return true;
    }else{
      return false;
    }
  })
  // 改变是否建设货车'司机之家'的下来值
  const changeIsHome = (e) => {
    if (e == 0) {
      initDriverHouseBean();
    }
  }
  // 清空是否建设货车'司机之家'的下来值
  const clearIsHome = () => {
    if (formInfo.value.driverHouseBean.isHome == "") {
      formInfo.value.driverHouseBean.isHome = null;
      initDriverHouseBean();
    } 
  }
  // 初始化货车'司机之家'的表单数据
  const initDriverHouseBean = () => {
    formInfo.value.driverHouseBean.distance = null;
    formInfo.value.driverHouseBean.homeArea = null;
    formInfo.value.driverHouseBean.totalNum = null; 
    formInfo.value.driverHouseBean.annualPersonNum = null;
    formInfo.value.driverHouseBean.serviceFunction = [];
    formInfo.value.driverHouseBean.description = null;
    formInfo.value.driverHouseBean.isStandardDesign = null;
    formInfo.value.driverHouseBean.isPass = null;
    formInfo.value.driverHouseBean.constructedUnit = null;
    formInfo.value.driverHouseBean.constructedCost = null;
    formInfo.value.driverHouseBean.manageUnit = null;
    formInfo.value.driverHouseBean.sitePrincipal = null;
    formInfo.value.driverHouseBean.sitePrincipalTel = null;
    formInfo.value.driverHouseBean.buildTime = null;
    formInfo.value.driverHouseBean.isStation = 0;
    formInfo.value.driverHouseBean.specialService = null;
  }
  onMounted(() => {
    getDescImageList();
  })
  
  // 简要说明临时图片
  const descriptionImageList = ref([])
  // 上传图片
  const customUpload = (file) => {
    const formData = new FormData();
    formData.append('file', file.file);
    getUpdateDescImageApi(formData)
  };
  // 获取简要说明服务器图片
  const getDescImageList = async () => {
    formInfo.value.driverHouseBean?.descriptionImageList?.map(async (item) => {
      await getDriverFileInfo({ id: item }).then((res) => {
        if (res.code == 200) {
          descriptionImageList.value.push(
            {
              uid: item,
              name: res.data.fileName,
              url: ConvertImgForId(item),
            }
          )
        } else {
          descriptionImageList.value = [];
        }
      });
    });
    formInfo.value.driverHouseBean?.specialServiceImageList?.map(async (item) => {
      await getDriverFileInfo({ id: item }).then((res) => {
        if (res.code == 200) {
          specialServiceImageList.value.push(
            {
              uid: item,
              name: res.data.fileName,
              url: ConvertImgForId(item),
            }
          )
        } else {
          specialServiceImageList.value = [];
        }
      });
    });
  }
  // 接口上传图片
  const getUpdateDescImageApi = async (formData) => {
    const {code,data} = await updateDriver(formData)
    if(code == 200){
      formInfo.value.driverHouseBean.descriptionImageList.push(data);
    }else if(code == 500){
      ElMessage.error('简要说明图片上传失败') 
    }
  }
  // 删除图片
  const handleRemove = (file) => {
    const index = descriptionImageList.value.findIndex(item => item.uid === file.uid);
    descriptionImageList.value.splice(index, 1);
    formInfo.value.driverHouseBean.descriptionImageList.splice(index, 1);
  };
  
  // 特色服务图片
  const specialServiceImageList = ref([])
  // 上传图片
  const customUploadSpecialImage = (file) => {
    const formData = new FormData();
    formData.append('file', file.file);
    getSpecialImageApi(formData)
  };
  // 接口上传图片
  const getSpecialImageApi = async (formData) => {
    const {code,data} = await updateDriver(formData)
    if(code == 200){
      formInfo.value.driverHouseBean.specialServiceImageList.push(data);
    }else if(code == 500){
      ElMessage.error('特色服务图片上传失败') 
    }
  }
  // 删除图片
  const handleRemoveSpecialImage = (file) => {
    const index = specialServiceImageList.value.findIndex(item => item.uid === file.uid);
    specialServiceImageList.value.splice(index, 1);
    formInfo.value.driverHouseBean.specialServiceImageList.splice(index, 1);
  };
  const dialogVisible = ref(false);
  const dialogImageUrl = ref("");
  
  // 转换图片地址
  const ConvertImgForId = (id)=>{
    return (
      process.env.VUE_APP_API_HOST_URL +
      process.env.VUE_APP_API_BASE_URL +
      `/pub/common/file/download?service=basServiceAreaDriverFileServiceImpl&id=${id}`
    );
  }
  // 预览图片
  const handlePreview = (file) => {
    dialogImageUrl.value = file.url;
    dialogVisible.value = true;
  };
</script>
<style lang="scss" scoped>
.upload-class {
  ::v-deep .el-upload-list--picture-card{
    flex-wrap: nowrap !important;
  }
}
  .cst_upload_box {
    position: relative;
    width: 148px;
    height: 148px;
    border-radius: 6px;
    box-sizing: border-box;
    overflow: hidden;

    .el-upload-list__item-thumbnail {
      width: 100%;
      height: 100%;
    }
  }
</style>