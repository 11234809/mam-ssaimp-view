<!--
 * @Author: fbz
 * @Date: 2025-05-13 16:45:38
 * @LastEditors: ysl
 * @LastEditTime: 2025-05-23 14:34:37
-->
<template>
  <div class="traffic-flow">
    <el-form
      inline
      :model="formData"
      class="custom_form"
      label-width="130px"
      label-position="right"
      label-suffix=":">
      <el-row>
        <el-col :span="6">
            <el-form-item label="服务区" class="form_item">
                <el-select
                    multiple
                    v-model="formData.serviceAreaId"
                    placeholder="请选择服务区名称"
                    filterable
                    clearable
                >
                    <el-option
                        v-for="(item, index) in serviceAreaList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车牌号" class="form_item">
              <el-input
                  v-model="formData.carNumber"
                  placeholder="请输入车牌号"
                  clearable
              />
          </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="车牌颜色" class="form_item">
                <el-select
                    multiple
                    v-model="formData.plateColor"
                    placeholder="请选择车牌颜色"
                    filterable
                    clearable
                >
                    <el-option
                        v-for="(item, index) in dictionaryObject.plateColorList"
                        :key="index"
                        :label="item.name"
                        :value="item.code"
                    />
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="车辆类型" class="form_item">
              <el-checkbox-group v-model="formData.carType">
                <el-checkbox v-for="(item,index) in dictionaryObject.carTypeList" :label="item.code">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="车辆颜色" class="form_item">
                <el-select
                    multiple
                    v-model="formData.carColor"
                    placeholder="请选择车辆颜色"
                    filterable
                    clearable
                >
                  <el-option
                    v-for="(item, index) in dictionaryObject.carColorList"
                    :key="index"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="是否新能源车" class="form_item">
              <el-checkbox-group v-model="formData.isEcar">
                <el-checkbox v-for="(item,index) in dictionaryObject.isList" :label="item.code">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="卡口编号" class="form_item">
              <el-input
                  v-model="formData.bayonetCode"
                  placeholder="请输入卡口编号"
                  clearable
              />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="卡口名称" class="form_item">
              <el-input
                  v-model="formData.bayonetName"
                  placeholder="请输入卡口名称"
                  clearable
              />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="卡口类型" class="form_item">
              <el-checkbox-group v-model="formData.bayonetType">
                <el-checkbox v-for="(item,index) in dictionaryObject.typeList" :label="item.code">{{item.name}}</el-checkbox>
              </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="拍摄时间" class="form_item">
            <el-date-picker
                v-model="dataTime"
                type="daterange"
                range-separator="至"
                start-placeholder="拍摄开始时间"
                end-placeholder="拍摄结束时间"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="门架号" class="form_item">
              <el-input
                  v-model="formData.gantryId"
                  placeholder="请输入门架号"
                  clearable
              />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="通道号" class="form_item">
              <el-input
                  v-model="formData.chanIndex"
                  placeholder="请输入通道号"
                  clearable
              />
          </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item class="form_item btn">
                <el-button type="primary" @click="getDataList"
                    >查询</el-button
                >
                <el-button type="primary" @click="onReset"
                    >重置</el-button
                >
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="func_btn_box">
      <el-button type="primary" @click="doExport">
        <el-icon>
          <Download/>
        </el-icon>
        <span>导出</span>
      </el-button>
    </div>
    <el-table
      class="custom_table"
      ref="tableRef"
      border
      table-layout="auto"
      v-loading="loading"
      :data="tableData"
      style="width: 100%">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="serviceAreaName" label="服务区" align="center" show-overflow-tooltip/>
      <el-table-column prop="carNumber" label="车牌号" align="center" show-overflow-tooltip/>
      <el-table-column prop="plateColor" label="车牌颜色" align="center"  show-overflow-tooltip/>
      <el-table-column prop="carType" label="车辆类型" align="center"  show-overflow-tooltip/>
      <el-table-column prop="carColor" label="车辆颜色" align="center"  show-overflow-tooltip/>
      <el-table-column prop="isEcar" label="是否新能源车" align="center"  show-overflow-tooltip/>
      <el-table-column prop="picUrl" label="图片" align="center"  show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.picUrl.length>0" class="pic_box">
              <el-image
                  v-for="(item, index) in scope.row.picUrl"
                  :key="index"
                  :preview-src-list="scope.row.picUrl"
                  :src="item"
                  preview-teleported
                  alt="加载失败"
              />
          </div>
          <span v-else class="no_file">无文件</span>
        </template>
      </el-table-column>
      <el-table-column prop="bayonetCode" label="卡口编号" align="center"  show-overflow-tooltip/>
      <el-table-column prop="bayonetName" label="卡口名称" align="center"  show-overflow-tooltip/>
      <el-table-column prop="bayonetType" label="卡口类型" align="center"  show-overflow-tooltip/>
      <el-table-column prop="dataTime" label="拍摄时间" align="center"  show-overflow-tooltip/>
      <el-table-column prop="gantryId" label="门架编号" align="center"  show-overflow-tooltip/>
      <el-table-column prop="chanIndex" label="通道号" align="center"  show-overflow-tooltip/>
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
      <el-pagination
          v-model:current-page="formData.index"
          v-model:page-size="formData.size"
          :page-sizes="[5, 10, 20, 30, 50]"
          layout="total,  prev, pager, next,sizes, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script setup>
import { ref,reactive,onActivated,computed } from 'vue'
import { getQueryPageList,getTrafficImage} from '../../../api/trafficFlowApi.js'
import { getServiceArea,getNormalOptions } from "@/api/dictionaryApi.js";
import { ElMessage } from 'element-plus';
import {exportData} from "@/utils/common-features";
import moment from 'moment';
let nowDate = moment(Date.now()).format('YYYY-MM-DD');
const defaultValue = [nowDate,nowDate];
const loading = ref(false)
// 查询条件默认值
const tempFormData = Object.freeze({
  serviceAreaId: [], // 服务区ID
  bayonetCode: '', // 卡口编号
  bayonetName:'', // 卡口名称
  bayonetType:[], // 卡口类型
  carNumber:'', // 车牌号
  carType:[], // 车辆类型
  carColor:[], // 车辆颜色
  isEcar:[], // 是否新能源车
  plateColor:[], // 车牌颜色
  dataTimeStart:'', // 拍摄时间
  dataTimeEnd:'', // 拍摄时间
  chanIndex:'', // 通道号
  gantryId:'', // 门架编号
  index:1, // 页码
  size:10, // 每页条数
})
let formData = ref({...tempFormData})
const dataTime = ref(defaultValue)
const total = ref(0) // 总条数
const tableData = ref([]) // 表格数据

// 查询数据
onActivated(async () => {
  await getDictionary();
  await getDataList();
  await getServiceAreaDictionary();
})

// 数据字典
const dictionaryObject = ref({}) // 数据字典
const getDictionary = async () => {
  const list = await getNormalOptions({queriers:[ 
    { alias: "plateColorDictionary", param: null },
    { alias: "isEnergyDictionary", param: null },
    { alias: "carColorDictionary", param: null },
    { alias: "bayonetTypeDictionary", param: null },
    { alias: "carTypeDictionary", param: null }]
  })
  dictionaryObject.value.plateColorList = list?.data?.plateColorDictionary ?? [];
  dictionaryObject.value.isList = list?.data?.isEnergyDictionary?? [];
  dictionaryObject.value.carColorList = list?.data?.carColorDictionary?? [];
  dictionaryObject.value.typeList = list?.data?.bayonetTypeDictionary?? [];
  dictionaryObject.value.carTypeList = list?.data?.carTypeDictionary?? [];
}


// 查询条件转换对象
const queryData = computed(() => {
   const [start,end] = dataTime?.value ?? [];
   formData.value.dataTimeStart = start ?? '';
   formData.value.dataTimeEnd = end ?? '';
   return formData.value
})

// 获取列表数据
const getDataList = async () => {
  try {
    loading.value = true;
    const { data } = await getQueryPageList(queryData.value)
    tableData.value = data?.records ?? [];
    total.value = data?.total ?? 0
    loading.value = false;
    
    // 并行处理所有图片请求
    tableData.value = await Promise.all(
      tableData.value.map(async (item) => ({
        ...item,
        picUrl: await processImageUrls(item.picUrl)
      }))
    )
  } catch (error) {
    loading.value = false;
    ElMessage({
      message: error.message || '请求失败', // 显示具体错误信息
      type: 'error',
    });
  }
}

// 独立图片处理函数
const processImageUrls = async (picUrl) => {
  try {
    const picIds = (picUrl?.trim()?.split(',') || []).filter(Boolean)
    const results = await Promise.all(
      picIds.map(async (id) => {
        try {
          return await getImgForId(id.trim())
        } catch (e) {
          console.error('图片ID处理异常:', e)
          return null
        }
      })
    )
    return results.filter(url => (url !== null || url !== undefined) && url !== '')
  } catch {
    return []
  }
}
// 图片转换
const getImgForId = async (id) => {
  const res = await getTrafficImage({ id })
  const data = res?.data
  const code = res?.code
  if (code === 200) {
    const imgObj = typeof data === 'string' ? JSON.parse(data) : data
    let imgUrl = "";
    if (imgObj.data && imgObj.data.imgBASE64) {
        imgUrl = imgObj.data.imgBASE64;
    };
    return 'data:image/*;base64,' + imgUrl || ''
  }
  return ''
}
// 重置查询
const onReset = () => {
  formData.value = { ...tempFormData }// 卡口类型
  dataTime.value = defaultValue;
  getDataList()
}
// 导出
const doExport = () => {
  const params = {
    ...queryData.value,
  };
  exportData("/bas/trafficFlow/exportXls", "服务区车流量明细", params);
}

// 分页
const handleCurrentChange = (val)=> {
    formData.value.index = val;
    getDataList();
}
// 每页条数
const handleSizeChange = (val)=>  {
    formData.value.size = val;
    getDataList();
}
const serviceAreaList = ref([]); // 服务区列表
// 获取服务区列表下拉
const getServiceAreaDictionary = async () => {
  getServiceArea().then(({ code, data }) => 
    {
      if (code == 200) {
          serviceAreaList.value = data.records;
      }
    }).catch((err) => {
        console.log(err);
    });
};
</script>

<style lang="less" scoped>
.traffic-flow {
    .custom_form {
        margin-bottom: 20px;

        :deep(.form_item) {
            width: 100%;

            .el-cascader {
                width: 100%;
            }

            .separator {
                margin: 0 10px;
            }

            &.btn {
                .el-form-item__content {
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }
    }

    .func_btn_box {
        margin-bottom: 10px;
    }

    .tips_box {
        display: flex;
        align-items: center;
        height: 40px;
        background-color: #0099ff32;
        border: 1px solid aqua;
        border-radius: 3px;
        margin-bottom: 10px;
        padding: 10px;

        .tips {
            font-size: var(--fontSize16);

            .tips_num {
                color: blue;
            }
        }

        .tips_num_close {
            margin-left: 10px;
            color: blue;
        }
    }

    :deep(.custom_table) {
        margin-bottom: 20px;

        .pic_box {
            display: flex;

            .el-image {
                width: 50px;
                height: 50px;
                object-fit: cover;

                &:not(:last-child) {
                    margin-right: 10px;
                }
            }
        }

        .no_file {
            font-style: italic;
            color: #5d5d5d;
        }

        .action_sheet {
            display: flex;
            align-items: center;
            justify-content: center;

            .el-dropdown {
                margin-left: 12px;
            }
        }
    }

    .pagination_box {
        float: right;
    }
}
</style>