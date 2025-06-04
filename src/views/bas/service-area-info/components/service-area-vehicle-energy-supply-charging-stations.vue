<template>
  <div class="service-area-vehicle-energy-supply-charging-stations">
    <el-row>
      <el-col :span="24">
        <div class="title_2">充电站基本信息</div>
      </el-col>
    </el-row>
    <template v-for="(item,index) in formInfo.energyBean.chargeStationList" :key="'stationName'+index">
      <el-row>
        <el-col :span="3">
          <el-button
            :disabled="formInfoDisabled"
            type="primary"
            @click="addNewChargingStation"
          >
          新增充电站
          </el-button>
        </el-col>
        <el-col :span="3" v-if="formInfo.energyBean.chargeStationList.length>1 ">
          <el-button
            :disabled="formInfoDisabled"
            type="primary"
            @click="deleteChargingStationFun(index)"
          >
          删除充电站
          </el-button>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="8">
          <el-form-item label="充电站名称" :prop="`energyBean.chargeStationList[${index}].stationName`">
            <el-input placeholder="请输入充电站名称" maxlength="50" :disabled="formInfoDisabled" v-model="formInfo.energyBean.chargeStationList[index].stationName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="充电站地址" :prop="`energyBean.chargeStationList[${index}].stationAddress`">
            <el-input placeholder="请输入充电站地址" maxlength="100" :disabled="formInfoDisabled" v-model="formInfo.energyBean.chargeStationList[index].stationAddress" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经度" :prop="`energyBean.chargeStationList[${index}].longitude`">
            <el-input placeholder="请输入经度" :disabled="formInfoDisabled" v-model="formInfo.energyBean.chargeStationList[index].longitude" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="纬度" :prop="`energyBean.chargeStationList[${index}].latitude`">
            <el-input placeholder="请输入纬度" :disabled="formInfoDisabled" v-model="formInfo.energyBean.chargeStationList[index].latitude" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="箱变容量（kVA）" :prop="`energyBean.chargeStationList[${index}].transformerCapacity`">
            <el-input placeholder="请输入箱变容量（kVA）" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargeStationList[index].transformerCapacity" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="额定总功率（充电主机总功率）（KW）" :prop="`energyBean.chargeStationList[${index}].ratedTotalPower`">
            <el-input placeholder="请输入额定总功率（充电主机总功率）（KW）" oninput="value=value.replace(/[^\d]/g,'')" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargeStationList[index].ratedTotalPower" />
          </el-form-item>
        </el-col>
        <!-- 默认【否】，如果选择【是】，则显示储能配置规模、放电时长； -->
        <el-col :span="8">
          <el-form-item label="是否为充储一体化站" :prop="`energyBean.chargeStationList[${index}].isIntegratedStorage`">
            <el-select
              v-model="formInfo.energyBean.chargeStationList[index].isIntegratedStorage"
              placeholder="是否为充储一体化站"
              :disabled="formInfoDisabled"
              clearable
              @change="isFilteredStorageData(index)"
            >
              <el-option 
                v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" 
                :key="item.name+index+'isIntegratedStorage'" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="formInfo.energyBean.chargeStationList[index].isIntegratedStorage*1">
          <el-col :span="8">
            <el-form-item label="储能配置规模" :prop="`energyBean.chargeStationList[${index}].energyStorageCapacity`">
              <el-input placeholder="请输入储能配置规模"  :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargeStationList[index].energyStorageCapacity" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="放电时长（h）" :prop="`energyBean.chargeStationList[${index}].dischargeDuration`">
              <el-input placeholder="请输入放电时长（h）" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargeStationList[index].dischargeDuration" />
            </el-form-item>
          </el-col>
        </template>
        <!-- 默认【否】，如果选择【是】，则显示光伏配置规模 -->
        <el-col :span="8">
          <el-form-item label="是否有光伏供能" :prop="`energyBean.chargeStationList[${index}].hasSolarPower`">
            <el-select
            v-model="formInfo.energyBean.chargeStationList[index].hasSolarPower"
              placeholder="是否为充储一体化站"
              :disabled="formInfoDisabled"
              clearable
              @change="isFilteredHasSolarPowerData(index)"
            >
              <el-option 
                v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" 
                :key="item.name+index+'hasSolarPower'" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="formInfo.energyBean.chargeStationList[index].hasSolarPower*1">
          <el-col :span="8">
            <el-form-item label="光伏配置规模" :prop="`energyBean.chargeStationList[${index}].solarPowerCapacity`">
              <el-input placeholder="请输入光伏配置规模" :disabled="formInfoDisabled"  v-model="formInfo.energyBean.chargeStationList[index].solarPowerCapacity" />
            </el-form-item>
          </el-col>
        </template>

        <!-- ，默认【否】，如果选择【是】，则显示V2G站的类别、V2G桩数、V2G放电功率（KW） -->
        <el-col :span="8">
          <el-form-item label="是否为V2G站" :prop="`energyBean.chargeStationList[${index}].isV2gStation`">
             <el-select
                v-model="formInfo.energyBean.chargeStationList[index].isV2gStation"
                placeholder="是否为V2G站"
                :disabled="formInfoDisabled"
                clearable
                @change="isFilteredIsV2gStationData(index)"
              >
              <el-option 
                v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" 
                :key="item.name+index+'isV2gStation'" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="formInfo.energyBean.chargeStationList[index].isV2gStation*1">
          <el-col :span="8">
            <el-form-item label="V2G站的类别" :prop="`energyBean.chargeStationList[${index}].v2gStationType`">
              <el-select
                v-model="formInfo.energyBean.chargeStationList[index].v2gStationType"
                placeholder="V2G站的类别"
                :disabled="formInfoDisabled"
                clearable
              >
                <el-option 
                  v-for="(item,index) in dictItemsList.v2ClassDictionary" 
                  :key="item.name+index" 
                  :label="item.name" 
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="V2G桩数" :prop="`energyBean.chargeStationList[${index}].v2gPileCount`">
              <el-input placeholder="请输入V2G桩数"  :disabled="formInfoDisabled" oninput="value=value.replace(/[^\d]/g,'')"  v-model="formInfo.energyBean.chargeStationList[index].v2gPileCount" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label=" V2G放电功率（KW）" :prop="`energyBean.chargeStationList[${index}].v2gDischargePower`">
              <el-input placeholder="请输入 V2G放电功率（KW）"  :disabled="formInfoDisabled" oninput="value=value.replace(/[^\d]/g,'')" v-model="formInfo.energyBean.chargeStationList[index].v2gDischargePower" />
            </el-form-item>
          </el-col>
        </template>
        
        <el-col :span="8">
          <el-form-item label="充电站摄像机数量" :prop="`energyBean.chargeStationList[${index}].cameraCount`">
            <el-input placeholder="请输入充电站摄像机数量" :disabled="formInfoDisabled" oninput="value=value.replace(/[^\d]/g,'')"  v-model="formInfo.energyBean.chargeStationList[index].cameraCount"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否有车棚" :prop="`energyBean.chargeStationList[${index}].hasCanopy`">
            <el-select
               v-model="formInfo.energyBean.chargeStationList[index].hasCanopy"
                placeholder="是否有车棚"
                :disabled="formInfoDisabled"
                clearable
              >
                <el-option 
                  v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" 
                  :key="item.name+index" 
                  :label="item.name" 
                  :value="item.code">
                </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="站点状态" :prop="`energyBean.chargeStationList[${index}].stationStatus`">
            <el-select
              v-model="formInfo.energyBean.chargeStationList[index].stationStatus"
              placeholder="选择站点状态"
              :disabled="formInfoDisabled"
              clearable
            >
              <el-option 
                v-for="(item,index) in dictItemsList.stationStatusDictionary" 
                :key="item.name+index" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="站点类型" :prop="`energyBean.chargeStationList[${index}].stationType`">
            <el-select
              v-model="formInfo.energyBean.chargeStationList[index].stationType"
              placeholder="选择站点类型"
              :disabled="formInfoDisabled"
              clearable
            >
              <el-option 
                v-for="(item,index) in dictItemsList.stationTypeDictionary" 
                :key="item.name+index" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停车费类型" :prop="`energyBean.chargeStationList[${index}].parkingFeeType`">
            <el-select
              v-model="formInfo.energyBean.chargeStationList[index].parkingFeeType"
              placeholder="选择停车费类型"
              :disabled="formInfoDisabled"
              clearable
            >
             <el-option 
                v-for="(item,index) in dictItemsList.stationParkTypeDictionary" 
                :key="item.name+index" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="7×24小时营业" :prop="`energyBean.chargeStationList[${index}].is24HoursOperation`">
            <el-select
              v-model="formInfo.energyBean.chargeStationList[index].is24HoursOperation"
              placeholder="选择7×24小时营业"
              :disabled="formInfoDisabled"
              clearable
            >
            <el-option 
                v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" 
                :key="item.name+index+'is24HoursOperation'" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="支付方式" :prop="`energyBean.chargeStationList[${index}].paymentMethods`">
          <el-checkbox-group v-model="formInfo.energyBean.chargeStationList[index].paymentMethods" :disabled="formInfoDisabled">
              <el-checkbox :label="item.code" v-for="(item,index) in dictItemsList.stationPayDictionary" :key="item.name+index">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="站点电话" :prop="`energyBean.chargeStationList[${index}].stationPhone`">
            <el-input placeholder="请输入站点电话" :disabled="formInfoDisabled"  maxlength="11" v-model="formInfo.energyBean.chargeStationList[index].stationPhone" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="服务电话" :prop="`energyBean.chargeStationList[${index}].servicePhone`">
            <el-input placeholder="请输入服务电话"  :disabled="formInfoDisabled"  maxlength="11"  v-model="formInfo.energyBean.chargeStationList[index].servicePhone" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="建设场所" :prop="`energyBean.chargeStationList[${index}].constructionLocation`">
            <el-select
              v-model="formInfo.energyBean.chargeStationList[index].constructionLocation"
              placeholder="选择建设场所"
              :disabled="formInfoDisabled"
              clearable
            >
              <el-option 
                v-for="(item,index) in dictItemsList.stationConstructionDictionary" 
                :key="item.name+index" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="周边环境" :prop="`energyBean.chargeStationList[${index}].surroundingEnvironment`">
            <el-select
              v-model="formInfo.energyBean.chargeStationList[index].surroundingEnvironment"
              placeholder="选择周边环境"
              :disabled="formInfoDisabled"
              clearable
            >
              <el-option 
                v-for="(item,index) in dictItemsList.stationEnvironmentDictionary" 
                :key="item.name+index" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="周边配套设施" :prop="`energyBean.chargeStationList[${index}].surroundingFacilities`">
            <el-select
              v-model="formInfo.energyBean.chargeStationList[index].surroundingFacilities"
              placeholder="选择周边配套设施"
              multiple
              :disabled="formInfoDisabled"
              clearable
            >
              <el-option 
                v-for="(item,index) in dictItemsList.stationSupportingDictionary" 
                :key="item.name+index" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="建成时间" :prop="`energyBean.chargeStationList[${index}].builtTime`">
            <el-date-picker  v-model="formInfo.energyBean.chargeStationList[index].builtTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择建成时间："
            :disabled="formInfoDisabled" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="投运时间" :prop="`energyBean.chargeStationList[${index}].commissioningTime`">
            <el-date-picker  v-model="formInfo.energyBean.chargeStationList[index].commissioningTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择投运时间：" 
            :disabled="formInfoDisabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="站点照片" :prop="`energyBean.chargeStationList[${index}].stationPhotosList`" >
            <el-upload
            v-model:file-list="stationPhotosList[index]"
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
      </el-row>
    </template>
    
    <el-dialog v-model="dialogVisible">
      <img :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useAreaInfoStore } from "../../../../store/useAreaInfoStore";
import { ref,onMounted,useAttrs  } from "vue";
import { updateCharge,getStationFileInfo } from '../../../../api/informationServiceAreaApi.js'
import { ElMessage } from "element-plus";
const areaInfoStore = useAreaInfoStore();
const { formInfoDisabled, formInfo,dictItemsList } = storeToRefs(areaInfoStore);
const { addNewChargingStation, deleteChargingStation } = areaInfoStore;
const attrs = useAttrs()
const stationPhotosList = ref([])
const dialogVisible = ref(false);
const dialogImageUrl = ref("");

onMounted(() => {
  getImgList();
  formatData();
})
// 格式化数据
const formatData = () => {
  formInfo.value.energyBean.chargeStationList.map((item,index) => {
    item.is24HoursOperation = item.is24HoursOperation?.toString() || '';
    item.hasCanopy = item.hasCanopy?.toString() || '';
    item.isV2gStation = item.isV2gStation?.toString() || '';
    item.hasSolarPower = item.hasSolarPower?.toString() || '';
    item.isIntegratedStorage = item.isIntegratedStorage?.toString() || '';
  });
}
// 获取服务器图片
const getImgList = async () => {
  formInfo.value.energyBean.chargeStationList.map((item,index) => {
    stationPhotosList.value.push([]);
    item.stationPhotosList.map(async (item) => {
      await getStationFileInfo({ id: item }).then((res) => {
        if (res.code == 200) {
          stationPhotosList.value[index].push(
            {
              uid: item,
              name: res.data.fileName,
              url: ConvertImgForId(item),
            }
          )
        } else {
          stationPhotosList.value = [];
        }
      });
    })
  });
}

// 是否为充储一体化站选择否 需要删除对应的储能配置规模、放电时长
const isFilteredStorageData = (index) => {
  if (formInfo.value.energyBean.chargeStationList[index].isIntegratedStorage *1 === 0) {
    formInfo.value.energyBean.chargeStationList[index].energyStorageCapacity = '';
    formInfo.value.energyBean.chargeStationList[index].dischargeDuration = '';
  }
}
// 是否有光伏供能选择否 需要删除对应的光伏配置规模
const isFilteredHasSolarPowerData = (index) => {
  if (formInfo.value.energyBean.chargeStationList[index].hasSolarPower *1 === 0) {
    formInfo.value.energyBean.chargeStationList[index].hasSolarPower = '';
  }
}
// 是否为V2G站选择否 需要删除对应的V2G站的类别、V2G桩数、V2G放电功率（KW）
const isFilteredIsV2gStationData = (index) => {
  if (formInfo.value.energyBean.chargeStationList[index].isV2gStation *1 === 0) {
    formInfo.value.energyBean.chargeStationList[index].v2gStationType = '';
    formInfo.value.energyBean.chargeStationList[index].v2gPileCount = '';
    formInfo.value.energyBean.chargeStationList[index].v2gDischargePower = '';
  } 
}
// 转换图片地址
const ConvertImgForId = (id)=>{
  return (
    process.env.VUE_APP_API_HOST_URL +
    process.env.VUE_APP_API_BASE_URL +
    `/pub/common/file/download?service=basServiceStationFileServiceImpl&id=${id}`
  );
}
// 新增充电站
const addNewChargingStationFun = () =>{
  addNewChargingStation();
}
// 删除充电站
const deleteChargingStationFun = (index) => {
  deleteChargingStation(index);
}
// 上传图片
const customUpload = (file,index) => {
  attrs.infoRuleForm.clearValidate(`energyBean.chargeStationList[${index}].stationPhotosList`)
  const formData = new FormData();
  formData.append('file', file.file);
  getUpdateChargeApi(formData,index)
};
// 接口上传图片
const getUpdateChargeApi = async (formData,index) => {
  const {code,data} = await updateCharge(formData)
  if(code == 200){
    formInfo.value.energyBean.chargeStationList[index].stationPhotosList.push(data);
  }else if(code == 500){
    ElMessage.error('站点照片上传失败') 
  }
}
// 删除图片
const handleRemove = (file,rowIndex) => {
  const index = stationPhotosList.value[rowIndex].findIndex(item => item.uid === file.uid);
  stationPhotosList.value[rowIndex].splice(index, 1);
  formInfo.value.energyBean.chargeStationList[rowIndex].stationPhotosList.splice(index, 1);
};

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