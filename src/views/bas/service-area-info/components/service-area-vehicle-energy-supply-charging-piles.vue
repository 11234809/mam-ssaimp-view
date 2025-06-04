<template>
  <div class="service-area-vehicle-energy-supply-charging-piles">
    <el-row>
      <el-col :span="24">
        <div class="title_2">充电桩基本信息</div>
      </el-col>
    </el-row>
    <template v-for="(item,index) in formInfo.energyBean.chargePileList" :key="item.stationName+index">
      <el-row>
        <el-col :span="3">
          <el-button
            :disabled="formInfoDisabled"
            type="primary"
            @click="addNewChargingPilesFun"
          >
          新增充电桩
          </el-button>
        </el-col>
        <el-col :span="3" v-if="formInfo.energyBean.chargePileList.length>1">
          <el-button
            :disabled="formInfoDisabled"
            type="primary"
            @click="deleteChargingPilesFun(index)"
          >
          删除充电桩
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="充电站名称" :prop="`energyBean.chargePileList[${index}].stationName`">
            <!-- <el-input placeholder="请输入充电站名称" v-model="formInfo.energyBean.chargePileList[index].stationName" /> -->
            <el-select
              v-model="formInfo.energyBean.chargePileList[index].stationName"
              placeholder="选择充电站名称"
              :disabled="formInfoDisabled"
              clearable
            >
              <el-option v-for="(item,index) in stationNameList" :label="item.label" :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="充电桩数" :prop="`energyBean.chargePileList[${index}].chargerCount`">
            <el-input placeholder="请输入充电桩数" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargePileList[index].chargerCount" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备编码" :prop="`energyBean.chargePileList[${index}].deviceCode`">
            <el-input placeholder="请输入设备编码" :disabled="formInfoDisabled"  maxlength="32" v-model="formInfo.energyBean.chargePileList[index].deviceCode" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备名称" :prop="`energyBean.chargePileList[${index}].deviceName`">
            <el-input placeholder="请输入设备名称" :disabled="formInfoDisabled"  maxlength="30" v-model="formInfo.energyBean.chargePileList[index].deviceName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备类型" :prop="`energyBean.chargePileList[${index}].deviceType`">
            <el-select
              v-model="formInfo.energyBean.chargePileList[index].deviceType"
              placeholder="选择设备类型"
              :disabled="formInfoDisabled"
              clearable
            >
              <el-option 
                v-for="(item,index) in dictItemsList.stationEquipmentTypeDictionary" 
                :key="item.name+index" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="充电设备总功率（kW）" :prop="`energyBean.chargePileList[${index}].totalPower`">
            <el-input placeholder="请输入充电设备总功率（kW）" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargePileList[index].totalPower" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最大功率（kW）" :prop="`energyBean.chargePileList[${index}].maxPower`">
            <el-input placeholder="请输入最大功率（kW）" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargePileList[index].maxPower" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="充电桩充电枪数" :prop="`energyBean.chargePileList[${index}].gunCount`">
            <el-input placeholder="请输入充电桩充电枪数" :disabled="formInfoDisabled" oninput="value=value.replace(/[^\d]/g,'')"  v-model="formInfo.energyBean.chargePileList[index].gunCount" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="输出电压范围" :prop="`energyBean.chargePileList[${index}].voltageRange`">
            <el-input placeholder="请输入输出电压范围" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargePileList[index].voltageRange" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备生产商" :prop="`energyBean.chargePileList[${index}].manufacturer`">
            <el-input placeholder="请输入设备生产商" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargePileList[index].manufacturer" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最大输出电流（A）" :prop="`energyBean.chargePileList[${index}].maxCurrent`">
            <el-input placeholder="请输入最大输出电流（A）" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargePileList[index].maxCurrent" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="建成时间" :prop="`energyBean.chargePileList[${index}].builtTime`">
            <el-date-picker v-model="formInfo.energyBean.chargePileList[index].builtTime" type="month" value-format="YYYY-MM" placeholder="请选择建成时间："
            :disabled="formInfoDisabled" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运营时间":prop="`energyBean.chargePileList[${index}].operationTime`">
            <el-date-picker v-model="formInfo.energyBean.chargePileList[index].operationTime" type="month" value-format="YYYY-MM" placeholder="请选择运营时间："
            :disabled="formInfoDisabled" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="充电桩充电枪数图片" :prop="`energyBean.chargePileList[${index}].gunImagesList`">
            <el-upload
              v-model:file-list="gunImagesList[index]"
              :disabled="formInfoDisabled"
              class="upload-class"
              action="#"
              :limit="3"
              list-type="picture-card"
              accept=".jpeg,.png,.jpg,.bmp,.gif"
              :http-request="(file) => customUpload(file, index)" >
              <el-icon class="el-icon--right"> <Plus /> </el-icon>
              <template #file="{ file }">
                <div class="cst_upload_box">
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                  <span class="cst_upload_name">{{ file.name }}</span>
                  <div class="shadow-box" v-if="!formInfoDisabled">
                    <el-icon @click="handlePreview(file)">
                      <View />
                    </el-icon>
                    <el-icon @click="handleRemove(file,index)">
                      <Delete />
                    </el-icon>
                  </div>
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="铭牌照片:" :prop="`energyBean.chargePileList[${index}].nameplateImagesList`">
            <el-upload
              v-model:file-list="nameplateImagesList[index]"
              :disabled="formInfoDisabled"
              class="upload-class"
              action="#"
              :limit="3"
              list-type="picture-card"
              accept=".jpeg,.png,.jpg,.bmp,.gif"
              :http-request="(file) => customNameplateImageUpload(file, index)" >
              <el-icon class="el-icon--right"> <Plus /> </el-icon>
              <template #file="{ file }">
                <div class="cst_upload_box">
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                  <span class="cst_upload_name">{{ file.name }}</span>
                  <div class="shadow-box" v-if="!formInfoDisabled">
                    <el-icon @click="handlePreview(file)">
                      <View />
                    </el-icon>
                    <el-icon @click="handleNameplateImageRemove(file,index)">
                      <Delete />
                    </el-icon>
                  </div>
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="第三方检测报告:" :prop="`energyBean.chargePileList[${index}].inspectionReportImagesList`">
            <el-upload
              v-model:file-list="inspectionReportImagesList[index]"
              :disabled="formInfoDisabled"
              class="upload-class"
              action="#"
              :limit="3"
              list-type="picture-card"
              accept=".jpeg,.png,.jpg,.bmp,.gif"
              :http-request="(file) => customInspectionReportImagesUpload(file, index)" >
              <el-icon class="el-icon--right"> <Plus /> </el-icon>
              <template #file="{ file }">
                <div class="cst_upload_box">
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                  <span class="cst_upload_name">{{ file.name }}</span>
                  <div class="shadow-box" v-if="!formInfoDisabled">
                    <el-icon @click="handlePreview(file)">
                      <View />
                    </el-icon>
                    <el-icon @click="handleInspectionReportImagesRemove(file,index)">
                      <Delete />
                    </el-icon>
                  </div>
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="title_2">充电枪基本信息</div>
        </el-col>
      </el-row>
      <template v-for="(_item,_index) in item.chargeGunList" :key="`'interfaceName'+${_index}${index}`">
        <el-row>
          <el-col :span="3">
            <el-button
              :disabled="formInfoDisabled"
              type="primary"
              @click="addNewChargeGunFun(index)"
            >
            新增充电枪
            </el-button>
          </el-col>
          <el-col :span="3" v-if="item.chargeGunList.length>1">
            <el-button
              :disabled="formInfoDisabled"
              type="primary"
              @click="deleteChargeGunFun(index,_index)"
            >
            删除充电枪
            </el-button>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="8">
            <el-form-item label="充电设备接口名称" :prop="`energyBean.chargePileList[${index}].chargeGunList[${_index}].interfaceName`">
              <el-input placeholder="请输入充电设备接口名称" maxlength="30" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargePileList[index].chargeGunList[_index].interfaceName" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="充电设备接口编码" :prop="`energyBean.chargePileList[${index}].chargeGunList[${_index}].interfaceCode`">
              <el-input placeholder="请输入充电设备接口编码" maxlength="64" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargePileList[index].chargeGunList[_index].interfaceCode" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否关联随手查" :prop="`energyBean.chargePileList[${index}].chargeGunList[${_index}].interfaceCode`">
              <el-select 
                v-model="formInfo.energyBean.chargePileList[index].chargeGunList[_index].isLinkedToCheck" 
                placeholder="请选择是否关联随手查 " 
                clearable
                :disabled="formInfoDisabled"
                @change="changeIsEnergyDevice">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      
    </template>
    <el-dialog v-model="dialogVisible">
      <img :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useAreaInfoStore } from "../../../../store/useAreaInfoStore";
import {onMounted,ref,useAttrs,computed} from 'vue';
import { updateCharge,getStationFileInfo } from '../../../../api/informationServiceAreaApi.js'
const areaInfoStore = useAreaInfoStore();
const { formInfoDisabled, formInfo,dictItemsList } = storeToRefs(areaInfoStore);
const { addNewChargingPiles, deleteChargingPiles,addNewChargeGun,deleteChargeGun } = areaInfoStore;
import { ElMessage } from "element-plus";

const attrs = useAttrs()
const addNewChargingPilesFun = () =>{
  addNewChargingPiles();
}
const deleteChargingPilesFun = (index) => {
  deleteChargingPiles(index);
}
const addNewChargeGunFun = (index) =>{
  addNewChargeGun(index);
}
const deleteChargeGunFun = (index,_index) => {
  deleteChargeGun(index,_index);
}
onMounted(() => {
  getImgList();
})

const stationNameList = computed(() => {
  let stationNameList = [];
  formInfo.value.energyBean.chargeStationList.map(item => {
    stationNameList.push({
      label: item.stationName,
      value: item.stationName,
    });
  })
  return stationNameList;
})


// 获取服务器图片
const getImgList = async () => {
  await getChargePileList();
  await getNameplateList();
  await getInspectionReportImagesList()
}
// 充电桩充电枪数图片
const gunImagesList = ref([]);
// 获取服务器图片充电桩
const getChargePileList = () => {
  formInfo.value.energyBean.chargePileList.map((item,index) => {
    gunImagesList.value.push([]);
    item.gunImagesList.map(async (item) => {
      await getStationFileInfo({ id: item }).then((res) => {
        if (res.code == 200) {
          gunImagesList.value[index].push(
            {
              uid: item,
              name: res.data.fileName,
              url: ConvertImgForId(item),
            }
          )
        } else {
          gunImagesList.value = [];
        }
      });
    })
  }); 
}
const nameplateImagesList = ref([]);
const getNameplateList = () => {
  formInfo.value.energyBean.chargePileList.map((item,index) => {
    nameplateImagesList.value.push([]);
    item.nameplateImagesList.map(async (item) => {
      await getStationFileInfo({ id: item }).then((res) => {
        if (res.code == 200) {
          nameplateImagesList.value[index].push(
            {
              uid: item,
              name: res.data.fileName,
              url: ConvertImgForId(item),
            }
          )
        } else {
          nameplateImagesList.value = [];
        }
      });
    })
  }); 
}
// 第三方检测报告
const inspectionReportImagesList = ref([]);
const getInspectionReportImagesList = () => {
  formInfo.value.energyBean.chargePileList.map((item,index) => {
    inspectionReportImagesList.value.push([]);
    item.inspectionReportImagesList.map(async (item) => {
      await getStationFileInfo({ id: item }).then((res) => {
        if (res.code == 200) {
          inspectionReportImagesList.value[index].push(
            {
              uid: item,
              name: res.data.fileName,
              url: ConvertImgForId(item),
            }
          )
        } else {
          inspectionReportImagesList.value = [];
        }
      });
    })
  }); 
}
// 转换图片地址
const ConvertImgForId = (id)=>{
  return (
    process.env.VUE_APP_API_HOST_URL +
    process.env.VUE_APP_API_BASE_URL +
    `/pub/common/file/download?service=basServiceStationFileServiceImpl&id=${id}`
  );
}
// 当前选择的项目行
const selectIndex = ref(0);
// 上传图片充电桩充电枪数图片
const customUpload = (file,index) => {
  attrs.infoRuleForm.clearValidate(`energyBean.chargePileList[${index}].gunImagesList`)
  const formData = new FormData();
  formData.append('file', file.file);
  getUpdateCharge(formData,index)
};

// 接口上传图片充电桩充电枪数图片
const getUpdateCharge = async (formData,index) => {
  const {code,data} = await updateCharge(formData)
  if(code == 200){
    formInfo.value.energyBean.chargePileList[index].gunImagesList.push(data);
  }else if(code == 500){
    ElMessage.error('充电桩充电枪数图片上传失败') 
  }
}

// 删除图片充电桩充电枪数图片
const handleRemove = (file,rowIndex) => {
  const index = gunImagesList.value[rowIndex].findIndex(item => item.uid === file.uid);
  gunImagesList.value[rowIndex].splice(index, 1);
  formInfo.value.energyBean.chargePileList[rowIndex].gunImagesList.splice(index, 1);
};

// 上传图片铭牌
const customNameplateImageUpload = (file,rowIndex) => {
  attrs.infoRuleForm.clearValidate(`energyBean.chargePileList[${rowIndex}].nameplateImagesList`)
  const formData = new FormData();
  formData.append('file', file.file);
  getUpdateNameplateImage(formData,rowIndex)
}
// 接口上传图片铭牌
const getUpdateNameplateImage = async (formData,rowIndex) => {
  const {code,data} = await updateCharge(formData)
  if(code == 200){
    formInfo.value.energyBean.chargePileList[rowIndex].nameplateImagesList.push(data);
  }else if(code == 500){
    ElMessage.error('铭牌图片上传失败') 
  }
}
// 删除图片铭牌
const handleNameplateImageRemove = (file,rowIndex) => {
  const index = nameplateImagesList.value[rowIndex].findIndex(item => item.uid === file.uid);
  nameplateImagesList.value[rowIndex].splice(index, 1);
  formInfo.value.energyBean.chargePileList[rowIndex].nameplateImagesList.splice(index, 1);
};

// 上传图片第三方检测报告
const customInspectionReportImagesUpload = (file,rowIndex) => {
  attrs.infoRuleForm.clearValidate(`energyBean.chargePileList[${rowIndex}].nameplateImagesList`)
  const formData = new FormData();
  formData.append('file', file.file);
  getUpdateInspectionReportImages(formData,rowIndex)
}
// 接口上传图片第三方检测报告
const getUpdateInspectionReportImages = async (formData,rowIndex) => {
  const {code,data} = await updateCharge(formData)
  if(code == 200){
    formInfo.value.energyBean.chargePileList[rowIndex].inspectionReportImagesList.push(data);
  }else if(code == 500){
    ElMessage.error('第三方检测报告上传失败') 
  }
}
// 删除图片第三方检测报告
const handleInspectionReportImagesRemove = (file,rowIndex) => {
  const index = inspectionReportImagesList.value[rowIndex].findIndex(item => item.uid === file.uid);
  inspectionReportImagesList.value[rowIndex].splice(index, 1);
  formInfo.value.energyBean.chargePileList[rowIndex].inspectionReportImagesList.splice(index, 1);
};


const dialogVisible = ref(false);
const dialogImageUrl = ref("");
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

    .shadow-box {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: 0.5s;
      z-index: 5;
      display: inline-flex;
      justify-content: center;
      align-items: center;

      .el-icon {
        margin-right: 12px;
        color: white;
      }
    }

    .shadow-box:hover {
      color: #fff;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0.8;
      cursor: pointer;
    }
  }
</style>