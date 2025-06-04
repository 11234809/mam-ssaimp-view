<!-- 设备完好率统计报表 -->
<template>
	<div class="staff-list_page" id="staff-list">
		<!-- 筛选项 -->
		<el-form inline :model="formData" class="custom_form" label-width="130px" label-position="right"
			label-suffix=":">
			<el-row :gutter="30">
				<el-col :span="6">
					<el-form-item label="公司" class="form-item">
						<el-select collapse-tags collapse-tags-tooltip v-model="formData.companyId" multiple 
                        :reserve-keyword="false" filterable placeholder="请选择公司" clearable>
							<el-option v-for="(item, index) in listOptions.companyList" :key="index" :label="item.label"
								:value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="6">
					<el-form-item label="服务区" class="form-item">
						<el-select collapse-tags collapse-tags-tooltip v-model="formData.serviceAreaId" multiple 
                        :reserve-keyword="false" filterable placeholder="请选择服务区" clearable>
							<el-option v-for="(item, index) in listOptions.serviceAreaList" :key="index"
								:label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="6">
					<el-form-item label="时间(月份)" class="form_item">
						<el-date-picker v-model="formData.yearAndMonth" value-format="YYYY-MM" type="month"
							placeholder="请选择时间（月份）" />
					</el-form-item>
				</el-col>

				<el-col :span="6">
					<el-form-item class="form_item btn">
						<el-button type="primary" @click="getData">查询</el-button>
						<el-button type="primary" @click="onReset">重置</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<!-- 功能按钮组 -->
		<div class="func_btn_box">
			<el-button type="primary" @click="handleExcel">导出</el-button>
		</div>
		<el-table class="custom_table" ref="tableRef" table-layout="fixed" :data="tableData" style="width: 100%">
			<el-table-column v-for="item in tableColumn" :type="item.type" :prop="item.prop" :label="item.label"
				:width="item.width" align="center" show-overflow-tooltip />
		</el-table>
		<!-- 分页 -->
		<div class="pagination_box">
			<el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
				layout="total, prev, pager, next, sizes, jumper" :total="total" @size-change="handleSizeChange"
				@current-change="handleCurrentChange" />
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getCompany } from "@/api/informationServiceAreaApi"
import { ElMessage } from "element-plus";
import { tableColumn } from "./index";
import { getServiceArea } from "@/api/dictionaryApi.js";
import { deviceIntactRateList } from "@/api/deviceIntactRateApi.js";
import { exportData } from "@/utils/common-features";

import moment from 'moment'

const formData = reactive({
	companyId: [], // 公司
	serviceAreaId: [], // 服务区
	yearAndMonth: moment().format('YYYY-MM'), // 服务区类型
});

const tableRef = ref(null); // 列表引用
const tableData = ref([]); // 列表数据
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数

const listOptions = reactive({
	companyList: [],
	serviceAreaList: [],
	time: []
});
// 列表导出
const handleExcel = () => {
	let params = {
		index: page.value,
		size: pageSize.value,
		...formData,
	}
	exportData("/statisticalForm/deviceIntactRate/export", "设备完好率统计报表", params);
};

const getData = async () => {
	let params = {
		page: page.value,
		pageSize: pageSize.value,
		companyIdList: formData.companyId,
		serviceAreaIdList: formData.serviceAreaId,
		yearAndMonth: formData.yearAndMonth,
	};
	deviceIntactRateList(params).then(res => {
		if (res.code == 200) {
			tableData.value = res.data.records;
			total.value = res.data.total;
		}
	})
};

// 获取字典数据
const getDictionary = () => {
	// 获取服务区
	getServiceArea()
		.then(({ code, data }) => {
			if (code == 200) {
				listOptions.serviceAreaList = data.records;
			}
		})
		.catch((err) => {
			console.log(err);
		});
	getCompany().then((res) => {
		listOptions.companyList = res.data.records;
	})
};

// 重置查询
const onReset = () => {
	Object.keys(formData).forEach((key) => {
		if (key == 'yearAndMonth') {
			formData[key] = '';
		} else {
			formData[key] = [];
		}
	});
	page.value = 1; // 重置页码
	pageSize.value = 10; // 重置每页条数
	getData(); // 重新查询
};

// 分页
const handleCurrentChange = (val) => {
	page.value = val;
	getData();
};

// 每页条数
const handleSizeChange = (val) => {
	pageSize.value = val;
	getData();
};

onMounted(() => {
	getDictionary();
	getData();
});
</script>

<style lang="less" scoped>
#staff-list .el-button--danger.is-plain:hover {
	color: #fff !important;
}

.staff-list_page {
	.custom_form {
		margin-bottom: 20px;

		:deep(.form-item) {
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
