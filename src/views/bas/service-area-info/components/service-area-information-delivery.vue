<!--
 * @Author: fbz
 * @Date: 2025-03-05 17:51:00
 * @LastEditors: ysl
 * @LastEditTime: 2025-05-22 14:04:37
-->
<template>
  <div class="emission-reduction">
    <div class="title"><span></span>信息发布</div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否有信息发布" prop="infoBean.isInfoPublish">
          <el-select
            v-model="formInfo.infoBean.isInfoPublish"
            placeholder="请选择是否有信息发布"
            :disabled="formInfoDisabled"
            @change="isFilteredIsInfoPublishData"
            @clear="clearIsInformation"
            clearable>
            <el-option 
              v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" 
              :key="item.name+index" 
              :label="item.name" 
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="是否开展服务质量满意度检查" prop="infoBean.isServiceSatisfaction">
          <el-radio-group v-model="formInfo.infoBean.isServiceSatisfaction" :disabled="formInfoDisabled">
            <el-radio v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" :label="item.code" size="large">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="是否设有广播呼叫系统" prop="infoBean.isBroadcastSystem">
          <el-radio-group v-model="formInfo.infoBean.isBroadcastSystem" :disabled="formInfoDisabled">
            <el-radio v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" :label="item.code" size="large">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="是否设置多媒体信息发布终端" prop="infoBean.isMultiMedia">
          <el-radio-group   v-model="formInfo.infoBean.isMultiMedia" :disabled="formInfoDisabled">
            <el-radio v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" :label="item.code" size="large">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="是否通过互联网发布服务" prop="infoBean.isOnline">
          <el-radio-group   v-model="formInfo.infoBean.isOnline" :disabled="formInfoDisabled">
             <el-radio v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" :label="item.code" size="large">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      
      <el-col :span="6">
        <el-form-item label="是否设置信息查询设备" prop="infoBean.isInfoQuery">
          <el-radio-group   v-model="formInfo.infoBean.isInfoQuery" :disabled="formInfoDisabled">
             <el-radio v-for="(item,index) in dictItemsList.basAreaInfoPublicDictionary" :label="item.code" size="large">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="6" class="add-col" v-if="formInfo.infoBean.isInfoPublish *1 ===1">
        <el-button type="primary" class="add-info" @click="addBasServiceAreaInfoPublish">添加信息发布设施</el-button>
      </el-col>
      <template v-if="formInfo.infoBean.isInfoPublish != 0 && formInfo.infoBean.isInfoPublish != null">
        <el-table
          ref="tableRef"
          :data="formInfo.infoBean.basServiceAreaInfoPublishList"
          class="custom-table-width"
          border>
          <el-table-column align="center" property="equipmentNum" label="*设备编号"  width="200">
            <template #header>
                <span style="color: red;">*</span>
                <span>设备编号</span>
            </template>
            <template #default="row">
              {{formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].equipmentNum}}
            </template>
          </el-table-column>
          <el-table-column align="center" property="equityUnit" label="*产权单位" width="200">
            <template #header>
                <span style="color: red;">*</span>
                <span>产权单位</span>
            </template>
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.equityUnit'" >
                    <el-input placeholder="请输入产权单位" maxlength="30" :disabled="formInfoDisabled"  v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].equityUnit" />
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="useUnit" label="*使用单位" width="200">
            <template #header>
                <span style="color: red;">*</span>
                <span>使用单位</span>
            </template>
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.useUnit'" >
                    <el-input placeholder="请输入使用单位" maxlength="30" :disabled="formInfoDisabled"  v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].useUnit" />
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="useClass" label="*使用分类" width="200">
            <template #header>
                <span style="color: red;">*</span>
                <span>使用分类</span>
            </template>
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.useClass'" >
                  <el-select
                    v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].useClass"
                    placeholder="请选择使用分类"
                    :disabled="formInfoDisabled"
                    clearable
                  >
                    <el-option 
                      v-for="(item,index) in dictItemsList.infoPubUseClassDictionary" 
                      :key="item.name+index" 
                      :label="item.name" 
                      :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="equipmentClass" label="*设备分类" width="200">
            <template #header>
                <span style="color: red;">*</span>
                <span>设备分类</span>
            </template>
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.equipmentClass'" >
                    <el-select
                      v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].equipmentClass"
                      placeholder="请选择使用分类"
                      :disabled="formInfoDisabled"
                      clearable
                    >
                      <el-option 
                        v-for="(item,index) in dictItemsList.infoPubDeviceClassDictionary" 
                        :key="item.name+index" 
                        :label="item.name" 
                        :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="displaySize" label="*显示屏尺寸（长*宽）" width="200">
            <template #header>
                <span style="color: red;">*</span>
                <span>显示屏尺寸（长*宽）</span>
            </template>
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.displaySize'" >
                    <el-input placeholder="请输入显示屏尺寸（长*宽）" :disabled="formInfoDisabled"  v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].displaySize" />
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="displayArea" label="*显示屏面积（平方米）" width="200">
            <template #header>
                <span style="color: red;">*</span>
                <span>显示屏面积（平方米）</span>
            </template>
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.displayArea'" >
                    <el-input placeholder="请输入显示屏面积（平方米）" :disabled="formInfoDisabled" oninput="value=value.replace(/[^\d]/g,'')"  v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].displayArea" />
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="signalNetwork" label="*信号网络方式" width="200">
            <template #header>
                <span style="color: red;">*</span>
                <span>信号网络方式</span>
            </template>
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.signalNetwork'" >
                  <el-select
                    v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].signalNetwork"
                    placeholder="请选择信号网络方式"
                    :disabled="formInfoDisabled"
                    clearable>
                    <el-option 
                      v-for="(item,index) in dictItemsList.infoPubNetDictionary" 
                      :key="item.name+index" 
                      :label="item.name" 
                      :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="site" label="*位置" width="200">
            <template #header>
                <span style="color: red;">*</span>
                <span>位置</span>
            </template>
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.site'" >
                    <el-select
                      v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].site"
                      placeholder="请选择位置"
                      :disabled="formInfoDisabled"
                      clearable>
                      <el-option 
                        v-for="(item,index) in dictItemsList.infoPubSiteDictionary" 
                        :key="item.name+index" 
                        :label="item.name" 
                        :value="item.code">
                      </el-option>
                  </el-select>
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="equipmentProducer" label="设备生产商" width="200">
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.equipmentProducer'" >
                    <el-input placeholder="请输入设备生产商" maxlength="50" :disabled="formInfoDisabled"  v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].equipmentProducer" />
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="softwareControlSystem" label="*软件控制系统" width="200">
            <template #header>
                <span style="color: red;">*</span>
                <span>软件控制系统</span>
            </template>
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.softwareControlSystem'" >
                    <el-input placeholder="请输入软件控制系统" maxlength="100" :disabled="formInfoDisabled"  v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].softwareControlSystem" />
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="infoPublishControlSystem" label="*信息发布控制方式" width="200">
            <template #header>
                <span style="color: red;">*</span>
                <span>信息发布控制方式</span>
            </template>
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.infoPublishControlSystem'" >
                    <el-input placeholder="请输入信息发布控制方式" maxlength="100" :disabled="formInfoDisabled"  v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].infoPublishControlSystem" />
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="sceneManagePerson" label="现场管理负责人及联系方式" width="200">
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.sceneManagePerson'" >
                    <el-input placeholder="请输入现场管理负责人及联系方式" maxlength="50" :disabled="formInfoDisabled"  v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].sceneManagePerson" />
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="infoAuditPerson" label="信息审核责任领导及联系方式" width="210">
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.infoAuditPerson'" >
                    <el-input placeholder="请输入信息审核责任领导及联系方式"  maxlength="50" :disabled="formInfoDisabled"  v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].infoAuditPerson" />
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" property="infoPublishPerson" label="信息发布责任人及联系方式" width="200">
            <template #default="row">
                <el-form-item :prop="'infoBean.basServiceAreaInfoPublishList.' + row.$index + '.infoPublishPerson'" >
                    <el-input placeholder="请输入信息发布责任人及联系方式"  maxlength="50"  :disabled="formInfoDisabled"  v-model="formInfo.infoBean.basServiceAreaInfoPublishList[row.$index].infoPublishPerson" />
                </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right">
            <template #default="row">
              <el-popconfirm title="是否确认删除该条数据?" @confirm="deleteItem(row.$index)">
                <template #reference>
                <el-button type="primary" class="add-info">删除</el-button>
                </template>
              </el-popconfirm>
              
            </template>
          </el-table-column>
        </el-table>
      </template>
      
    </el-row>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useAreaInfoStore } from "../../../../store/useAreaInfoStore";
const areaInfoStore = useAreaInfoStore();
const { formInfoDisabled, formInfo,dictItemsList } = storeToRefs(areaInfoStore);
const { addBasServiceAreaInfoPublishList, deleteBasServiceAreaInfoPublish } = areaInfoStore;

const changeIsInformation = (e) => {
  if (e == 0) {
    initInfoBean();
  }
};
// 新增信息发布设施
const addBasServiceAreaInfoPublish = () => {
  addBasServiceAreaInfoPublishList();
};
const isFilteredIsInfoPublishData = () => {
  if (formInfo.value.infoBean.isInfoPublish*1 == 0) {
    formInfo.value.infoBean.basServiceAreaInfoPublishList = [];
  }else if(formInfo.value.infoBean.isInfoPublish*1 == 1){
    formInfo.value.infoBean.basServiceAreaInfoPublishList=[{
      equipmentNum:null, // 设备编号
      equityUnit:null,// 产权单位
      useUnit:null,// 使用单位
      useClass:null,// 使用分类
      equipmentClass:null,// 设备分类
      displaySize:null,// 显示尺寸
      displayArea:null,// 显示屏面积（平方米）
      signalNetwork:null,// 信号网络方式
      site:null,// 位置
      equipmentProducer:null,// 设备生产商
      softwareControlSystem:null,// 软件控制系统
      infoPublishControlSystem:null,// 信息发布控制方式
      sceneManagePerson:null,// 现场管理负责人及联系方式
      infoAuditPerson:null,// 信息审核责任领导及联系方式
      infoPublishPerson:null,// 信息发布责任领导及联系方式
    }]
  }
};
const deleteItem = (index) => {
  deleteBasServiceAreaInfoPublish(index);
};
const clearIsInformation = () => {
  if (formInfo.value.infoBean.isInfoPublish == "") {
    formInfo.value.infoBean.isInfoPublish = null;
    initInfoBean();
  }
};

const initInfoBean = () => {
  formInfo.value.infoBean.isBroadcast = null;
  formInfo.value.infoBean.isInternet = null;
  formInfo.value.infoBean.isLargeScreen = null;
  formInfo.value.infoBean.isSelfQuery = null;
};
</script>
<style lang="less" scoped>
.custom-table-width {
  width: 2200px; /* 具体像素值 */
}
.add-col{
    align-items: center;
  }
</style>
