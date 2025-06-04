<template>
  <div class="service-area-info">
    <div class="title"><span></span>服务区基本信息</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="服务区名称：" prop="basicBean.name">
          <el-input v-model="formInfo.basicBean.name" placeholder="请输入服务区名称" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务区类别：" prop="basicBean.type">
          <el-select v-model="formInfo.basicBean.type" placeholder="请选择服务区类别" :disabled="formInfoDisabled" clearable>
            <el-option v-for="(item, index) in dictItemsList.serviceTypeDictionary" :key="index" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务区简介：" prop="basicBean.brief">
          <el-input v-model="formInfo.basicBean.brief" placeholder="请输入服务区简介" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="所属公司：" prop="basicBean.company">
          <el-select v-model="formInfo.basicBean.company" placeholder="请选择所属公司" :disabled="formInfoDisabled" filterable clearable>
            <el-option v-for="(item, index) in companyList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务区编号：" prop="basicBean.code">
          <el-input v-model="formInfo.basicBean.code" placeholder="请输入服务区编号" :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务区方向名称：" prop="basicBean.directionName">
          <el-input v-model="formInfo.basicBean.directionName" placeholder="请输入服务区方向名称"
            :disabled="formInfoDisabled"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="左右侧：" prop="basicBean.side">
          <el-select v-model="formInfo.basicBean.side" placeholder="请选择左右侧" :disabled="formInfoDisabled" clearable>
            <el-option v-for="(item, index) in dictItemsList.sideTypeDictionary" :key="index" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="道路方向：" prop="basicBean.area">
          <el-select v-model="formInfo.basicBean.area" placeholder="请选择服务区道路方向" :disabled="formInfoDisabled" clearable>
            <el-option value="up" label="上行"></el-option>
            <el-option value="down" label="下行"></el-option>
            <el-option value="toWay" label="双向"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务区星级：" prop="basicBean.star">
          <el-select v-model="formInfo.basicBean.star" placeholder="请选择服务区星级" :disabled="formInfoDisabled" clearable>
            <el-option v-for="(item, index) in dictItemsList.starLevelDictionary" :key="index" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="服务区方向：" prop="basicBean.serviceAreaDirection">
          <el-select v-model="formInfo.basicBean.serviceAreaDirection" placeholder="请选择服务区方向"
            :disabled="formInfoDisabled" clearable>
            <el-option v-for="(item, index) in dictItemsList.serviceDirectionDictionary" :key="index" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="双侧是否互通：" prop="basicBean.isTwoWay">
          <el-select v-model="formInfo.basicBean.isTwoWay" placeholder="请选择双侧是否互通" :disabled="formInfoDisabled"
            clearable>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否全年开放：" prop="basicBean.isWholeYear">
          <el-select v-model="formInfo.basicBean.isWholeYear" placeholder="请选择是否全年开放" :disabled="formInfoDisabled"
            clearable>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否主题服务区：" prop="basicBean.isTheme">
          <el-select v-model="formInfo.basicBean.isTheme" placeholder="请选择是否主题服务区" :disabled="formInfoDisabled"
            clearable>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
       <el-col :span="8">
        <el-form-item label="是否特色服务区：" prop="basicBean.isSpecService">
          <el-select v-model="formInfo.basicBean.isSpecService" placeholder="请选择是否特色服务区" :disabled="formInfoDisabled"
            clearable>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="每天是否24小时开放：" prop="basicBean.isWholeDay">
          <el-select v-model="formInfo.basicBean.isWholeDay" placeholder="请选择每天是否24小时开放" :disabled="formInfoDisabled"
            clearable>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否开放式服务区：" prop="basicBean.isOpenService">
          <el-select v-model="formInfo.basicBean.isOpenService" placeholder="请选择是否开放式服务区" :disabled="formInfoDisabled"
            clearable>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否设有入区车流量统计设施：" prop="basicBean.isVehicleCount">
          <el-select v-model="formInfo.basicBean.isVehicleCount" placeholder="请选择是否设有入区车流量统计设施"
            :disabled="formInfoDisabled" clearable>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否设有入区车流量统计、车型自动识别系统：" prop="basicBean.isVehicleAuto">
          <el-select v-model="formInfo.basicBean.isVehicleAuto" placeholder="请选择是否设有入区车流量统计、车型自动识别系统"
            :disabled="formInfoDisabled" clearable>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="小程序是否显示卫生间概况：" prop="basicBean.isShow">
          <el-select v-model="formInfo.basicBean.isShow" placeholder="请选择小程序是否显示卫生间概况" :disabled="formInfoDisabled"
            clearable>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="经度" prop="basicBean.longitude">
          <el-input :disabled="formInfoDisabled" v-model="formInfo.basicBean.longitude" placeholder="请输入经度"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="纬度" prop="basicBean.latitude">
          <el-input :disabled="formInfoDisabled" v-model="formInfo.basicBean.latitude" placeholder="请输入纬度"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="布局形式" prop="basicBean.layoutForm">
          <el-select v-model="formInfo.basicBean.layoutForm" placeholder="请选择布局形式" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item, index) in dictItemsList.layoutFormDictionary" :key="index" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="省" prop="basicBean.province">
          <el-select v-model="formInfo.basicBean.province" placeholder="请选择省" :disabled="formInfoDisabled"
            @change="getCity" @clear="clearProvince" clearable>
            <el-option v-for="(item, index) in cityObj" :key="index" :value="item.value"
              :label="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" v-if="cityList?.length > 0 || formInfo.basicBean.city != ''">
        <el-form-item label="市/区" prop="basicBean.city">
          <el-select v-model="formInfo.basicBean.city" placeholder="请选择市/区" :disabled="formInfoDisabled"
            @change="getCounty" @clear="clearCity" clearable>
            <el-option v-for="(item, index) in cityList" :key="index" :value="item.value"
              :label="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="countyList?.length > 0 || formInfo.basicBean.county != ''">
        <el-form-item label="县" prop="basicBean.county">
          <el-select v-model="formInfo.basicBean.county" placeholder="请选择县" :disabled="formInfoDisabled" clearable>
            <el-option v-for="(item, index) in countyList" :key="index" :value="item.value"
              :label="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="经营管理单位名称" prop="basicBean.businessUnits">
          <el-input :disabled="formInfoDisabled" v-model="formInfo.basicBean.businessUnits"
            placeholder="请输入经营管理单位名称"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="经营管理单位性质" prop="basicBean.unitNature">
          <el-select v-model="formInfo.basicBean.unitNature" placeholder="请选择经营管理单位性质" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item, index) in dictItemsList.serviceUnitNatureDictionary" :key="index"
              :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务区经营模式" prop="basicBean.serviceMode">
          <el-select v-model="formInfo.basicBean.serviceMode" placeholder="请选择服务区经营模式" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item, index) in dictItemsList.serviceModeDictionary" :key="index" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务咨询电话" prop="basicBean.consultationTel">
          <el-input :disabled="formInfoDisabled" v-model="formInfo.basicBean.consultationTel"
            placeholder="请输入服务咨询电话"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="起始收费站" prop="basicBean.startTollStation">
          <el-select v-model="formInfo.basicBean.startTollStation" placeholder="请选择起始收费站" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item, index) in dictItemsList.tollStationDictionary" :key="index" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="结束收费站" prop="basicBean.endTollStation">
          <el-select v-model="formInfo.basicBean.endTollStation" placeholder="请选择结束收费站" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item, index) in dictItemsList.tollStationDictionary" :key="index" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="所在路线编号" prop="basicBean.highCode">
          <el-input :disabled="formInfoDisabled" v-model="formInfo.basicBean.highCode"
            placeholder="请输入所在路线编号"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="所在路线名称" prop="basicBean.highSpeed">
          <el-select v-model="formInfo.basicBean.highSpeed" placeholder="请选择所在路线名称" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item, index) in roadLineList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="位置桩号" prop="basicBean.locationPileNo">
          <el-input :disabled="formInfoDisabled" v-model="formInfo.basicBean.locationPileNo"
            placeholder="请输入位置桩号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="初始运营日期" prop="basicBean.operationTime">
          <el-date-picker v-model="formInfo.basicBean.operationTime" type="date" placeholder="请选择初始运营日期" :size="size"
            :disabled="formInfoDisabled" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="建成时间" prop="basicBean.builtTime">
          <el-date-picker v-model="formInfo.basicBean.builtTime" type="date" placeholder="请选择建成时间" :size="size"
            :disabled="formInfoDisabled" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="产权隶属单位" prop="basicBean.ownership">
          <el-input :disabled="formInfoDisabled" v-model="formInfo.basicBean.ownership"
            placeholder="请输入产权隶属单位"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="所在路段" prop="basicBean.road">
          <el-select v-model="formInfo.basicBean.road" placeholder="请选择所在路段" :disabled="formInfoDisabled" clearable>
            <el-option v-for="(item, index) in roadList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="所在路段类型" prop="basicBean.roadType">
          <el-select v-model="formInfo.basicBean.roadType" placeholder="请选择所在路段类型" :disabled="formInfoDisabled"
            clearable>
            <el-option v-for="(item, index) in dictItemsList.roadTypeDictionary" :key="index" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select v-model="formInfo.auditStatus" placeholder="自动生成" disabled clearable>
            <el-option v-for="(item, index) in dictItemsList.auditStatusDictionary" :key="index" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="备注" prop="basicBean.remark">
          <el-input :disabled="formInfoDisabled" v-model="formInfo.basicBean.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="状态" prop="basicBean.status">
          <el-select v-model="formInfo.basicBean.status" placeholder="请选择状态" :disabled="formInfoDisabled" clearable
            @change="changeStatus" @clear="clearStatus">
            <el-option v-for="(item, index) in dictItemsList.serviceAreaStatusDictionary" :key="index"
              :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="formInfo.basicBean.status == 2">
        <el-form-item label="异常原因" prop="basicBean.abnormalReason">
          <el-input :disabled="formInfoDisabled" v-model="formInfo.basicBean.abnormalReason"
            placeholder="请输入异常原因"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否建设货车“司机之家”" prop="basicBean.isTruckHome">
          <el-select v-model="formInfo.basicBean.isTruckHome" placeholder="请选择是否建设货车“司机之家”" :disabled="formInfoDisabled"
            clearable @change="changeIsTruckHome" @clear="clearIsTruckHome">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" v-if="formInfo.basicBean.isTruckHome == 1">
        <el-form-item label="“司机之家”配套设施" prop="basicBean.truckHome">
          <el-input :disabled="formInfoDisabled" v-model="formInfo.basicBean.truckHome"
            placeholder="请输入“司机之家”配套设施"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否有助农兴农农副产品营销" prop="basicBean.isFarmerMode">
          <el-select v-model="formInfo.basicBean.isFarmerMode" placeholder="请选择是否有助农兴农农副产品营销"
            :disabled="formInfoDisabled" clearable @change="changeIsFarmerMode" @clear="clearIsFarmerMode">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="formInfo.basicBean.isFarmerMode == 1">
        <el-form-item label="农副产品营销方式" prop="basicBean.farmerMode">
          <el-input :disabled="formInfoDisabled" v-model="formInfo.basicBean.farmerMode"
            placeholder="请输入助农兴农农副产品营销方式"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-form-item label="管理公司及部门" prop="basicBean.manageCompany">
          <el-select v-model="formInfo.basicBean.manageCompany" multiple collapse-tags collapse-tags-tooltip filterable
            :max-collapse-tags="3" placeholder="请选择管理公司或部门" :disabled="formInfoDisabled" @change="changeManageCompany"
            clearable>
            <el-option v-for="(item, index) in orgList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="平面图">
          <el-upload ref="uploadImage" v-model:file-list="planeFigureUrl" action="#" list-type="picture-card"
            accept=".jpeg,.png,.jpg,.bmp,.gif" :limit="1" :disabled="formInfoDisabled" :on-exceed="handleExceed"
            :http-request="uploadPictures">
            <div class="upload-box" v-if="planeFigureUrl?.length == 0">
              <el-icon>
                <Plus />
              </el-icon>
            </div>
            <template #file="{ file }" v-if="planeFigureUrl?.length > 0">
              <div class="cst_upload_box">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
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
        <el-dialog v-model="dialogVisible">
          <img :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted, reactive } from "vue";
import { genFileId } from "element-plus";
import { cityObj } from "../../../../utils/city";
import { useAreaInfoStore } from "../../../../store/useAreaInfoStore";
const areaInfoStore = useAreaInfoStore();
const {
  formInfoDisabled,
  formInfo,
  companyList,
  orgList,
  dictItemsList,
  roadLineList,
  roadList,
  planeFigure,
} = storeToRefs(areaInfoStore);
const { setUpLoadImg, setFormInfoCompany, setImgBlank } = useAreaInfoStore();
/**
 * @description element上传组件数据绑定无法读取对象内部变量 需定义单独变量来接收数据
 *  */
let uploadStatus = ref(false);
let uploadImage = ref(null);
let manageCompany = ref([]);
let cityList = ref([]);
let countyList = ref([]);
let planeFigureUrl = ref([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

onMounted(() => {
  if (planeFigure.value?.url && planeFigure.value.url != null) {
    planeFigureUrl.value.push(planeFigure.value);
  }
  if (formInfo.value.basicBean.province != "") {
    if (formInfo.value.basicBean.city != "") {
      cityObj.forEach((e) => {
        if (e.value == formInfo.value.basicBean.province) {
          cityList.value = e.children;
        }
      });
      if (formInfo.value.basicBean.county != "") {
        cityList.value.forEach((val) => {
          if (val.key == formInfo.value.basicBean.city) {
            countyList.value = val.children;
          }
        });
      }
    }
  }
});

const changeManageCompany = (e) => {
  setFormInfoCompany(e);
};
const uploadPictures = (file) => {
  setUpLoadImg(file.file);
};
/**
/**
 * @description 删除图片
 */
const handleRemove = (val) => {
  planeFigureUrl.value = [];
  setUpLoadImg("");
  setImgBlank(val);
};

/**
 *  @description 预览图片
 */
const handlePreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};
/**
 * @description 上传超出限制处理
 */
const handleExceed = (files) => {
  uploadImage.value.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadImage.value.handleStart(file);
};

const getCity = (event) => {
  cityList.value = [];
  countyList.value = [];
  formInfo.value.basicBean.city = "";
  formInfo.value.basicBean.county = "";
  cityObj.forEach((e) => {
    if (event === e.value) {
      if (e.children) {
        cityList.value = e.children;
      }
    }
  });
};

const getCounty = (event) => {
  countyList.value = [];
  formInfo.value.basicBean.county = "";
  cityList.value.forEach((e) => {
    if (event === e.value) {
      if (e.children) {
        countyList.value = e.children;
      }
    }
  });
};

const clearProvince = () => {
  cityList.value = [];
  countyList.value = [];
  formInfo.value.basicBean.city = "";
  formInfo.value.basicBean.county = "";
};

const clearCity = () => {
  countyList.value = [];
  formInfo.value.basicBean.county = "";
};

const changeStatus = (e) => {
  if (e == 0) {
    formInfo.value.basicBean.abnormalReason = null;
  }
};

const clearStatus = () => {
  if (formInfo.value.basicBean.status == "") {
    formInfo.value.basicBean.status = null;
    formInfo.value.basicBean.abnormalReason = null;
  }
};

const changeIsTruckHome = (e) => {
  if (e == 0) {
    formInfo.value.basicBean.truckHome = null;
  }
};

const clearIsTruckHome = () => {
  if (formInfo.value.basicBean.isTruckHome == "") {
    formInfo.value.basicBean.isTruckHome = null;
    formInfo.value.basicBean.truckHome = null;
  }
};

const changeIsFarmerMode = (e) => {
  if (e == 0) {
    formInfo.value.basicBean.farmerMode = null;
  }
};

const clearIsFarmerMode = () => {
  if (formInfo.value.basicBean.isFarmerMode == "") {
    formInfo.value.basicBean.isFarmerMode = null;
    formInfo.value.basicBean.farmerMode = null;
  }
};
</script>
<style lang="less" scope></style>
<style lang="less">
.service-area-info {
  .el-overlay {
    .el-dialog__body {
      img {
        width: 100%;
      }
    }
  }

  /* .el-upload-list {
    position: relative;
  }

  .el-upload-list__item {
    padding: 0;
    position: absolute;
  } */

  .is-ready {
    z-index: 9;
  }

  .upload-box {
    width: 148px;
    height: 148px;
    border-radius: 6px;
    box-sizing: border-box;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #dcdfe6;
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
}
</style>
