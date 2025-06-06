<template>
	<keep-alive>
		<div class="smart-energy">
			<!-- left -->
			<div class="smart-energy-left">
				<!-- 巡检信息 -->
				<div class="smart-energy-left-item">
					<div class="item-top">巡检信息</div>
					<div class="item-info-box">
						<div class="box-title">
							<div class="li"></div>
							<div class="txt">管理员巡检</div>
							<div class="hr"></div>
						</div>
						<div class="box-item">
							<img class="icon" src="../../images/manage/gl.png" alt="" />

							<div class="item-ul">
								<div class="ul-item">
									<div class="tit">计划</div>
									<div class="number1">{{manageInfoData.managerPlanCount}}</div>
								</div>
								<div class="ul-item w2">
									<div class="tit">完成</div>
									<div class="number2">{{manageInfoData.managerCompleteCount}}</div>
								</div>
								<div class="ul-item">
									<div class="tit">完成率</div>
									<div class="number2">{{manageInfoData.managerCompleteRate}}%</div>
								</div>
							</div>
						</div>
						<div class="box-title mt30">
							<div class="li"></div>
							<div class="txt">保安巡检</div>
							<div class="hr"></div>
						</div>
						<div class="box-item">
							<img class="icon" src="../../images/manage/ba.png" alt="" />

							<div class="item-ul">
								<div class="ul-item">
									<div class="tit">计划</div>
									<div class="number1">{{manageInfoData.securityPlanCount}}</div>
								</div>
								<div class="ul-item w2">
									<div class="tit">完成</div>
									<div class="number2">{{manageInfoData.securityCompleteCount}}</div>
								</div>
								<div class="ul-item">
									<div class="tit">完成率</div>
									<div class="number2">{{manageInfoData.securityCompleteRate}}%</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 服务区充电排名 -->
				<div class="smart-energy-left-item">
					<div class="item-top">危化品车辆排名</div>
					<TimeTypeSelector v-model="dangerCar.selectTimeType"
						@select="handleSelectDangerCarRanking" />
					<div class="item-bottom">
						<div ref="dangerCarRef" style="width: 450px; height: 260px"></div>
					</div>
				</div>
				<!-- 危化品车辆分布 -->
				<div class="smart-energy-left-item">
					<div class="item-top">危化品车辆分布</div>
					<div class="item-bottom item-bottom-table scroll-wrapper">
						<div ref="dangerCarNetRef" style="width:450px; height: 260px"></div>
					</div>
				</div>
			</div>
			<!-- left end -->

			<!-- center -->
			<div class="smart-energy-center">
				<div class="smart-energy-center-header">
					<!-- 危化品车辆 -->
					<div class="center-header-item">
						<img src="../../images/manage/wx.png" class="icon" />
						<div class="center-header-item-bottom">
							<div class="center-header-item-bottom-time">
								<span class="center-header-item-bottom-time-num">{{centerHeaderData.dangerTotal}}</span>
							</div>
							<div class="center-header-item-bottom-label">危化品车辆</div>
						</div>
					</div>
					<!-- 司机之家服务人次 -->
					<div class="center-header-item">
						<img src="../../images/manage/sj.png" class="icon"/>
						<div class="center-header-item-bottom">
							<div class="center-header-item-bottom-time">
								<span class="center-header-item-bottom-time-num">{{centerHeaderData.truckTotal}}</span>
							</div>
							<div class="center-header-item-bottom-label">司机之家服务人次</div>
						</div>
					</div>
					<div class="center-header-item">
						<img src="../../images/manage/jg.png"  class="icon"/>
						<div class="center-header-item-bottom">
							<div class="center-header-item-bottom-time">
								<span class="center-header-item-bottom-time-num">{{centerHeaderData.eventTotal}}</span>
							</div>
							<div class="center-header-item-bottom-label">突发事件</div>
						</div>
					</div>

				</div>
				<div class="search-box">
					<div class="area-btn" @click="openSearchALert">
						服务区筛选
					</div>

					<div class="search-input-box">
						<input type="text" class="input" v-model="serviceParams.serviceAreaName" placeholder="服务区搜索" />
						<div class="box-btn" @click="getServiceListData"></div>
					</div>
				</div>
				<div class="center-bottom">
					<Map ref="mapRef" @markerClick="markerClick"  />
				</div>
			</div>
			<!-- center end -->


			<!-- right -->
			<div class="smart-energy-right">
				<div class="smart-energy-right-item" style="height: 450px;">
					<div class="item-top">司机之家使用率排名</div>
					<TimeTypeSelector v-model="carUse.selectTimeType" @select="handleSelectCarUseRanking" />
					<div style="height: 450px;">
						<div class="item-table">
						  <!-- 表头 -->
						  <table class="item-table-content table-header">
						    <thead>
						      <tr>
						        <th v-for="(col, index) in carUseColumns" :key="index">{{ col.label }}</th>
						      </tr>
						    </thead>
						  </table>

						  <!-- 表体-->
						  <div class="table-body">
						    <table class="item-table-content">
						      <tbody ref="scrollContent">
						        <tr class="" v-for="(item, index) in carUseData" >
						          <td v-for="(col, i) in carUseColumns" :key="i">
									  <div class="io" :class="'b'+index" v-if="i==0">TOP{{ index+1 }}</div>
									  <span v-else>{{ item[col.prop] }}</span>
								  </td>
						        </tr>
						      </tbody>
						    </table>
						  </div>
						</div>

					</div>
				</div>
				<div class="smart-energy-right-item">
					<div class="item-top">事件信息</div>
					<div class="item-bottom item-bottom-table scroll-wrappe">


						<div class="item-table">
						  <!-- 表头 -->
						  <table class="item-table-content table-header">
						    <thead>
						      <tr>
						        <th v-for="(col, index) in eventInformationDataColumns" :key="index">{{ col.label }}</th>
						      </tr>
						    </thead>
						  </table>

						  <!-- 表体-->
						  <div class="table-body nd">
						    <table class="item-table-content">
						      <tbody>
						        <tr class="" v-for="(item, index) in eventInformationData" >
						          <td v-for="(col, i) in eventInformationDataColumns" :key="i">
									  {{ item[col.prop] }}
								  </td>
						        </tr>
						      </tbody>
						    </table>
						  </div>
						</div>

					</div>
				</div>
			</div>
			<!-- right end -->

			<!-- 服务器筛选 -->
			<searchAlert ref='searchRef' :from-data="searchAreaArr" @ok="chooseSearch"></searchAlert>
			<!-- 服务器筛选 end -->

			<!-- 服务区详情 -->
			<searchAreaAlert ref="serviceInfoRef" :id="serviceId"></searchAreaAlert>

		</div>
	</keep-alive>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import TimeTypeSelector from "../time-type-selector/index.vue";
import * as echarts from "echarts";
import {getRowBarOption} from '../../service'
import {getRowXBarOption} from '../../service_xbar'
import searchAlert from '../service-search-alert/index';
import searchAreaAlert from '../service-area-alert/index';
import Map from '@/components/map/index.vue';

import {
  getManageInfo,
  getServiceRanking,
  getServiceCarDis,
  getServiceAreaList,
  getEventList,
  getTruckHomeList,
  getDataTotal,
  getRoadLineList
} from "@/api/bigScreen/management.js";

const {
		proxy
	} = getCurrentInstance();
	const router = useRouter();

	// const components = {
	//   searchAlert,
	//   searchAreaAlert,
	//   map
	// }
	
	
	//巡检信息
	const manageInfoData = reactive({
		managerCompleteCount:0,
		managerCompleteRate:0,
		managerPlanCount:0,
		securityCompleteCount:0,
		securityCompleteRate:0,
		securityPlanCount:0,
	});
	
	//指标汇总
	const centerHeaderData = reactive({
		dangerTotal: 0, //危化品车辆
		truckTotal: 0, //司机之家服务人次
		eventTotal: 0, //突发事件
	});
	
	//初始化
	const init=async () => {
		//巡检信息
		let res = await getManageInfo();
		let info =res.data.records[0];
		
		manageInfoData.managerCompleteCount=info.managerCompleteCount;
		manageInfoData.managerCompleteRate=info.managerCompleteRate;
		manageInfoData.managerPlanCount=info.managerPlanCount;
		manageInfoData.securityCompleteCount=info.securityCompleteCount;
		manageInfoData.securityCompleteRate=info.securityCompleteRate;
		manageInfoData.securityPlanCount=info.securityPlanCount;
		
		//指标汇总
		res = await getDataTotal();
		info =res.data;
		centerHeaderData.dangerTotal=info.dangerTotal;
		centerHeaderData.truckTotal=info.truckTotal;
		centerHeaderData.eventTotal=info.eventTotal;
	}
	init();
	
	//服务区查询
	let serviceInfoRef = ref('');
	let mapRef = ref('');
	const serviceId = ref(0);
	const serviceParams = reactive({
		serviceAreaName: '', //服务区名称
		highSpeed: '', //所在高速 逗号隔开
		star: '', //星级 逗号隔开
		status: '', //服务区状态 逗号隔开
		specService: '', //是否特色服务区 1 是 0 否
		truckHome: '', //是否司机之家 1 是 0 否
		station: '', //是否同心驿站 1 是 0 否
	});
	const getServiceListData=()=>{
		getServiceAreaList(serviceParams).then(res=>{
			console.log(res.data.records)
			mapRef.value.removeAllMarkers();
			
			let mapArr=[];
			
			res.data.records.forEach(item=>{
				let n=2;
				if(item.star=='三星级'){
					n=3;
				}
				if(item.star=='四星级'){
					n=4;
				}
				if(item.star=='五星级'){
					n=5;
				}
				
				mapArr.push({
					...item,
					type:item.status,
					starNum:n,
					lng:item.lng,
					lat:item.lat,
				});
			})
			mapRef.value.setMarkers(mapArr)
		})
	}
	
	//地图点击
	function markerClick(res){
		console.log(res)
		serviceId.value=res.serviceAreaId;
		
		
		nextTick(() => {
		  serviceInfoRef.value.open()
		})
	}
	

	/* 危化品车辆排名: DangerCarRanking */
	const dangerCar = reactive({
	  selectTimeType: "0",
	  queryStart: '',
	  queryEnd: '',
	});
	function handleSelectDangerCarRanking(payload) {
	  dangerCar.selectTimeType = payload.code;
	  if (payload.code === "6") {
	    let timeRunge = payload.dateRange || [];
		if(timeRunge[0]){
			dangerCar.queryStart=timeRunge[0];
		}
		if(timeRunge[1]){
			dangerCar.queryEnd=timeRunge[1];
		}
	  }else{
		  dangerCar.queryStart=''
		  dangerCar.queryEnd=''
	  }
	  dangerCarEcharts();
	}

	let dangerCarChart = null
	let dangerCarRef = ref('');
	const dangerCarEcharts = async () => {
		
	  let chartData = {
	    data: [],
	    yData: [],
	    xData: [],
	  }
	  
	  //危化品车辆排名
	  let res = await getServiceRanking(dangerCar);
	  res.data.records.forEach(item=>{
		  chartData.data.push(item.carNum);
		  chartData.yData.push(item.itemName);
	  })
	  
	  nextTick(() => {
	    if (!dangerCarChart) {
	      dangerCarChart = echarts.init(dangerCarRef.value);
	    }
		let option = getRowBarOption(chartData, {
		  barColor: [
		    { offset: 0, color: "#652B06" },
		    { offset: 1, color: "#F89E46" },
		  ]
		})
		dangerCarChart && dangerCarChart.setOption(option);
	  })
	};
	dangerCarEcharts()

	//危化品车辆分布
	let dangerCarNetChart = null
	let dangerCarNetRef = ref('');
	const dangerCarNetEcharts =  async () => {
	  let chartData = {
	    data: [],
	    yData: [],
	    xData: [],
	  }
	  
	  //危化品车辆分布
	  let res = await getServiceCarDis();
	  res.data.records.forEach(item=>{
		  chartData.data.push(item.dangerNum);
		  chartData.xData.push(item.dangerItemName);
	  })
	  
	  
	  nextTick(() => {
	    if (!dangerCarNetChart) {
	      dangerCarNetChart = echarts.init(dangerCarNetRef.value);
	      let option = getRowXBarOption(chartData, {
	        barColor: [
	         { offset: 0, color: "#0d488d" },
	         { offset: 0.5, color: "#38a7c7" },
	         { offset: 1, color: "#5DF7F8" },
	        ]
	      })
	      dangerCarNetChart && dangerCarNetChart.setOption(option);
	    }
	  })
	};
	dangerCarNetEcharts()

	/* 司机之家使用率排名: carUseRanking */
	const carUse = reactive({
	  selectTimeType: "0",
	  queryStart: '',
	  queryEnd: '',
	});
	function handleSelectCarUseRanking(payload) {
	  carUse.selectTimeType = payload.code;
	  if (payload.code === "6") {
	    let timeRunge = payload.dateRange || [];
		if(timeRunge[0]){
			carUse.queryStart=timeRunge[0];
		}
		if(timeRunge[1]){
			carUse.queryEnd=timeRunge[1];
		}
	  }else{
		  carUse.queryStart=''
		  carUse.queryEnd=''
	  }
	  getCarUseData();
	}

	const carUseData = ref([]);
	const carUseColumns = [
	  { label: "排名", prop: "serviceAreaId" },
	  { label: "服务区名称", prop: "serviceAreaName" },
	  { label: "使用率", prop: "usedRate" },
	];
	
	const getCarUseData=()=>{
		getTruckHomeList(carUse).then(res=>{
			carUseData.value=res.data.records
		})
	}
	getCarUseData();



	/* 事件信息: eventInformation */

	const eventInformationData = ref([]);
	const eventInformationDataColumns = [
	  { label: "事件名称", prop: "eventType" },
	  { label: "服务区", prop: "serviceAreaName" },
	  { label: "时间", prop: "reportTime" },
	];
	
	const getEventDataList=()=>{
		getEventList().then(res=>{
			eventInformationData.value=res.data.records
		})
	}
	getEventDataList();
	
	//服务区筛选数据
	let searchRef = ref('');
	const openSearchALert=()=>{
		searchRef.value.open();
	}
	const searchAreaArr=ref([]);

	let areaArr=[];

	areaArr.push({
		title:'星级',
		field:'star',
		children:[
			{
				value:'三星级',
				label:'3级'
			},
			{
				value:'四星级',
				label:'4级'
			},
			{
				value:'五星级',
				label:'5级'
			},
			{
				value:'达标',
				label:'达标'
			}
		]
	})
	
	//路线
	const getLineDataList=async ()=>{
		let res=await getRoadLineList()
		
		areaArr.push({
			title:'路线',
			field:'highSpeed',
			children:res.data.records
		})
	}
	getLineDataList();

	

	areaArr.push({
		title:'服务区状态',
		field:'status',
		children:[
			{
				value:3,
				label:'在建'
			},
			{
				value:1,
				label:'建成运营'
			},
			{
				value:2,
				label:'建成未运营'
			},
			{
				value:4,
				label:'关闭'
			}
		]
	})
	
	areaArr.push({
		title:'其他',
		field:'other',
		children:[
			{
				value:1,
				label:'司机之家'
			},
			{
				value:2,
				label:'特色服务区'
			},
			{
				value:3,
				label:'同心驿站'
			}
		]
	})
	searchAreaArr.value=areaArr;

	//搜索回调
	const chooseSearch=(res)=>{
		
		console.log(res.highSpeed)
		
		if(res.highSpeed){
			serviceParams.highSpeed=res.highSpeed.join(',')
		}
		if(res.star){
			serviceParams.star=res.star.join(',')
		}
		if(res.status){
			serviceParams.status=res.status.join(',')
		}
	
		serviceParams.specService=''
		serviceParams.truckHome=''
		serviceParams.station=''
		
		if(res.other){
			res.other.forEach(item=>{
				if(item==1){
					serviceParams.truckHome=1
				}
				if(item==2){
					serviceParams.specService=1
				}
				if(item==3){
					serviceParams.station=1
				}
			})
		}
		
		
		getServiceListData();
	}

</script>
<style lang="less" scoped>
	.mt24{
		margin-top: 24px;
	}
	.mt30{
		margin-top: 30px;
	}
	.smart-energy {
		display: flex;
		height: calc(100% - 108px);
		width: 100%;
		color: #fff;
		margin-top: -100px;
		padding: 0px 2px;
	}

	.smart-energy-left,
	.smart-energy-right {
		flex: 1;
		height: 100%;
		background-color: #16283a;
		/* 各占1份 */
		/* background-color: pink; */
		/* 方便区分颜色 */
	}

	.smart-energy-left-item,
	.smart-energy-right-item {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 319px;
		background-position: center 0;
		position: relative;
	}

	.item-top {
		flex: 1;
		width: 412px;
		height: 40px;
		line-height: 40px;
		padding-left: 34px;
		color: #fff;
		font-size: 20px;
		font-weight: 500;
		margin-top: 8px;
		margin-left: 2.2rem;
		background: url("../../images/manage/tit_bg.png") left no-repeat;
		background-size: auto 100%;
		margin-bottom: 22px;
	}

	.item-bottom {
		flex: 6;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		color: #fff;
		gap: 2px;
		/* 可以加点间距，看效果 */
	}

	.item-info-box{
		width: 100%;
		height: 296px;

		.box-title{
			padding-left: 28px;
			display: flex;
			align-items: center;
			font-size: 16px;

			.li{
				width: 24px;
				height: 24px;
				background:url('../../images/manage/li.png');
				margin-right: 3px;
			}

			.txt{
				min-width: 90px;
				line-height: 24px;
				height: 24px;
			}

			.hr{
				width: 200px;
				height: 2px;
				margin-left: 17px;
				background: url('../../images/manage/line.png');
				background-size: 100% auto;
			}
		}

		.box-item{
			height: 64rpx;
			display: flex;
			align-items: center;
			padding-left: 34px;
			margin-top: 16px;

			.icon{
				object-fit: cover;
				width: 65px;
				height: 65px
			}

			.item-ul{
				height: 34px;
				width: 328px;
				margin-left: 16px;
				display: flex;
				align-items: center;
				background-image: linear-gradient(to right, transparent 0%, rgba(27, 59, 90,0.8) 50%, transparent 100%);

				.ul-item{
					width: 115px;
					height: 18px;
					line-height: 18px;
					display: flex;
					align-items: flex-end;

					&.w2{
						width: 105px;
					}

					.tit{
						font-size: 18px;
						color: #D1D6DF;
					}
					.number1{
						font-size: 34px;
						height: 30px;
						line-height: 34px;
						color: #FFE04D;
						margin-left: 5px;
						background: linear-gradient(0deg, RGBA(255, 234, 102, 1) 0%, rgba(255, 224, 77, 1) 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
					.number2{
						font-size: 26px;
						height: 18px;
						line-height: 14px;
						color: #89C96A;
						margin-left: 5px;

					}
				}

			}
		}
	}

	.item-table{
		justify-content: flex-start;
		width: 90%;
		margin-left: 28px;

		.table-header{
			table-layout: fixed;
		}

		.item-table-content{
			width: 100%;
			margin: 0 auto;
			border-collapse: collapse;
			text-align: center;
			color: #d5e2f1;
			table-layout: fixed;

			th,td{
				height: 34px;
				border-bottom: 1px solid rgba(216,227,238,0.1);
			}


		}

		.table-body{
			&.nd{
				tr:nth-child(even){
					background:RGBA(17, 39, 57, 1);
				}
			}

			tr{
				background: rgba(27,130,183,0.12);

				&:hover{
					background: rgba(27,130,183,0.22);
				}
				td{
					text-align: center;
				}
				.io{
					width: 54px;
					height: 22px;
					line-height: 26px;
					background: url('../../images/manage/t4.png');
					color: #fff;
					padding-left: 0px;
					font-size: 12px;
					margin-left: 43px;

					&.b0{
						background: url('../../images/manage/t1.png');
					}
					&.b1{
						background: url('../../images/manage/t2.png');
					}
					&.b2{
						background: url('../../images/manage/t3.png');
					}
				}
			}
		}
	}

	.custom-dark-table {
		background-color: #142234;
		color: #d5e2f1;
	}

	.smart-energy-center {
		flex: 2;
		/* 占2份 */
		/* background-color: red; */
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.search-box{
		width: 100%;
		height: 45px;
		display: flex;
		align-items: center;
		margin-top: 26px;

		.area-btn{
			width: 114px;
			height: 45px;
			background: url('../../images/manage/btn_bg.png');
			text-align: center;
			line-height: 45px;
			font-size: 14px;
			color: #fff;
			cursor: pointer;
			margin-left: 32px;
		}

		.search-input-box{
			width:190px;
			height: 41px;
			box-sizing: border-box;
			border: 1px solid #5BC7FC;
			margin-left: 19px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.input{
				height: 41px;
				width: 143px;
				padding: 5px 10px;
				box-sizing: border-box;
				font-size: 14px;
				color: #fff;
				background: transparent;
				border: 0;
				outline:none;

				&::placeholder{
					color: #FFF;
				}
			}

			.box-btn{
				width: 40px;
				height: 41px;
				background: url('../../images/manage/search.png') 4px center no-repeat;
				background-size: 18px 18px;
				cursor: pointer;
			}
		}
	}

	.center-bottom {
		flex: 1;
		/* 剩余空间全给它 */
		position: relative;
		overflow: hidden;
		margin-top: 10px;
		width: 100%;
		height: 800px;

	}

	.tps-box{
		position: absolute;
		right: 11px;
		bottom: 20px;
		width: 120px;

		.item{
			height: 44px;
			display: flex;
			align-items: center;
			font-size: 14px;

			.icon{
				object-fit: cover;
				width: 43px;
				height: 44px;
				margin-right: 6px;
			}
		}
	}

	.smart-energy-center-header {
		display: grid;
		grid-template-columns: repeat(4, auto);
		gap: 10px 20px;
		justify-content: space-around;
	}

	.smart-energy-center-header>div {
		/* background: #1d7bbf; */
		color: #fff;
		padding: 10px 20px;
		border-radius: 6px;
		text-align: center;
	}

	.center-header-item {
		display: flex;
		justify-content: center;
		align-items: center;

		.icon{
			object-fit: left;
			width: 86px;
			height: 71px
		}
	}

	.center-header-item-bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		/* 上下贴靠 */
		margin-top: 8px;
		margin-left: 12px;
	}

	.center-header-item-bottom-time {
		font-size: 18px;
		font-weight: bold;
		color: #fff;
		margin-bottom: 4px;
		/* 控制和下方文字的间距 */
	}

	.center-header-item-bottom-time-num {
		font-size: 30px;
		color: #e2eaf4;
		font-weight: bold;
	}

	.center-header-item-bottom-time-unit {
		font-size: 12px;
		color: #fff;
		font-weight: normal;
	}

	.center-header-item-bottom-label {
		font-size: 16px;
		color: #fff;
		font-weight: normal;
	}

	.area-alert-box{
		width: 671px;
		height: 371px;
		background: url('../../images/manage/alert_bg.png');
		position: fixed;
		top: 50%;
		left: 50%;
		margin-left: -335px;
		margin-top: -185px;
		z-index: 888;
		display: flex;
		justify-content: center;
		align-items: center;

		.alert-box{
			width: 614px;
			height: 313px;

			.title{
				width: 100%;
				height: 42px;
				border-bottom: 2px solid #55b3cd;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: linear-gradient(to right, rgba(8, 131, 177, 1), rgba(8, 131, 177, 0));

				font-family: Source Han Sans CN;
				font-size: 18px;
				color: #ECF4FF;
				padding: 0 10px 0 25px;
				margin-bottom: 25px;

				.close{
					width: 42px;
					height: 42px;
					background:url('../../images/manage/cha.png') center no-repeat;
					cursor: pointer;
				}
			}

			.alert-item{
				display: flex;

				.item-tit{
					width: 120px;
					height: 32px;
					line-height: 32px;
					text-align: right;
					color: #fff;
					font-size: 14px
				}
				.item-checkbox{
					width: 490px;
					.image-checkbox{
						.diy-box{
							display: flex;
							align-items: center;
							color: rgba(206, 220, 230, 1);
						}
					}
					/deep/ .image-checkbox .el-checkbox__input {
					   display: none;
					}

					.el-checkbox{
						.off{
							display: block;
						}
						.on{
							display: none;
						}

						&.is-checked{
							.off{
								display: none;
							}
							.on{
								display: block;
							}
						}
					}


				}
			}

			.alert-footer{
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 10px;

				.footer-btn{
					width: 103px;
					height: 47px;
					margin-left: 30px;
					background:url('../../images/manage/btn_bg1.png');
					text-align: center;
					line-height: 47px;
					cursor: pointer;

					.txt{
						font-size: 14px;
						color: rgba(248, 252, 255, 0);
						text-shadow: 0px 3px 0px rgba(0,103,156,0.33), 0px 3px 5px rgba(6,13,16,0.7);
						background: linear-gradient(0deg, #7CD0FF 0%, #FEFFFF 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}
			}


		}
	}
</style>
