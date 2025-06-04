<!-- 物资领用月报 -->

<template>
	<div class="staff-list_page" id="staff-list">
		<!-- 筛选项 -->
		<el-form inline :model="formData" class="custom_form" label-width="130px" label-position="right"
			label-suffix=":">
			<el-row :gutter="30">
				<el-col :span="6" v-for="formItem in formItemList">
					<el-form-item :label="formItem.label" class="form_item">
						<el-select v-if="formItem.type === 'select'" v-model="formData[formItem.prop]" multiple
							filterable :placeholder="`请选择${formItem.label}`" clearable
                            :reserve-keyword="false">
							<el-option v-for="(item, index) in formItem.options" :key="index" :label="item.label"
								:value="item.value" />
						</el-select>
						<el-date-picker value-format="YYYY-MM" v-if="formItem.type === 'datePicker'" v-model="formData[formItem.prop]"
							type="month" placeholder="请选择时间（月份）" />
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
		<div style="height: 20px"></div>
		<el-table class="custom_table" ref="tableRef" table-layout="auto" :data="tableData" style="width: 100%">
			<el-table-column v-for="item in tableColumn" :type="item.type" :prop="item.prop" :label="item.label"
				:width="item.width" align="center">
			</el-table-column>
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
import { ref, reactive, onMounted, computed } from "vue";
import { getServiceArea, queryNormalOptions } from "@/api/dictionaryApi.js";
import { formItem, tableColumn } from "./index";
import { exportData } from "@/utils/common-features";
import { suppliesReceiveList } from '@/api/suppliesReceiveApi.js';
import moment from 'moment';

let formData = reactive({
    yearAndMonth:moment().subtract(1, 'months').format('YYYY-MM'),
});
// 搜索表单
const formItemList = computed(() => {
	return formItem(listOptions);
});

const tableRef = ref(null); // 列表引用
const tableData = ref([]); // 列表数据
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数

const listOptions = reactive({
	serviceAreaIdList: [], // 服务区列表
	serviceAreaTypeList: [], // 服务区类型列表

});
// 列表导出
const handleExcel = () => {
	let params = {
		index: page.value,
		size: pageSize.value,
		...formData,
	}
	exportData("/statisticalForm/suppliesReceive/export", "物资领用月报", params);
};
// 列表查询
const getData = () => {
	let params = {
		index: page.value,
		size: pageSize.value,
		...formData,
	}
	suppliesReceiveList(params).then(res => {
		if (res.code == 200) {
			tableData.value = res.data.records;
			total.value = res.data.total;
		}
	}).catch((err) => {
		console.log(err);
	});
};

// 获取字典数据
const getDictionary = () => {
	// 获取服务区
	getServiceArea().then(({ code, data }) => {
		if (code == 200) {
			listOptions.serviceAreaIdList = data.records;
		}
	}).catch((err) => {
		console.log(err);
	});
	// 获取服务区类型
	queryNormalOptions({
		queriers: [{ alias: 'basAreaInfoTypeDictionary', param: null }],
	}).then((res) => {
		let list = []
		res.data.basAreaInfoTypeDictionary.map(item => {
			list.push(
				{
					label: item.name,
					value: item.code
				}
			)
		})
		listOptions.serviceAreaTypeList = list;
		console.log(list);

	});
};

// 重置查询
const onReset = () => {
	// 重置表单参数赋值
	Object.keys(formData).forEach((key) => {
		formData[key] = null;
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
