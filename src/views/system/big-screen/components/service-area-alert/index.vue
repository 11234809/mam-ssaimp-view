<template>
 <div class="info-alert-box" v-if="isShowSearch">
 	<div class="alert-box">
 		<div class="title">
 			服务区详情
 			
 			<div class="close" @click="isShowSearch=false"></div>
 		</div>
 		
		<div class="box-centent">
			
			<div class="top-box">
				<div class="img"></div>
				<div class="box-right">
					<div class="b-right-top">
						<div class="tit">大观服务区(茂名方向)</div>
						<div class="top-start">
							<div class="item"></div>
							<div class="item"></div>
							<div class="item"></div>
							<div class="item"></div>
						</div>
						<div class="top-phone">
							<span>建成运营</span>
							<img class="phone-img" src="../../images/manage/phone.png" alt="" />
							<span>023-23456589</span>
						</div>
					</div>
					
					<div class="b-right-top">
						<span class="top-lable">G65沪蓉高速</span>
						<span class="top-lable">收费站：重庆大观站至——重庆南川站</span>
						<span class="top-lable">特色服务区</span>
						<span class="top-lable">占地面积（m2）：83065</span>
					</div>
					
					<div class="right-desc">
						G42沪蓉高速奉节服务区位于重庆市奉节县,距重庆主城316KM，距离奉节城区16KM，服务区设有分离式东、西两区，于2010年投入运营。
						服务区总占地面积120亩，有效用地面积60亩，建筑面积32808㎡。是集餐饮、购物、休闲、娱乐、旅游、加油等服务为一体的综合商业体。
					</div>
					
					<div class="right-tab">
						<div class="item">停车位</div>
						<div class="item">停车位</div>
						<div class="item">停车位</div>
					</div>
				</div>
			</div>
			
			<div class="service-num-box">
				<div class="item-box">
					<div class="service-public-title">停车位</div>
					<div class="service-box">
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">大货车停车位</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">大客车停车位</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">小车位</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">危化品车位</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">牲畜停车位</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">无障碍停车位</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">女性专用车位</div>
								<div class="num">32</div>
							</div>
						</div>
					</div>
				</div>
				<div class="item-box">
					<div class="service-public-title">卫生间</div>
					<div class="service-box">
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">第三卫生间</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">无障碍卫生间</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">男厕蹲位</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">男厕小便器</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">男厕坐便</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">女厕蹲位</div>
								<div class="num">32</div>
							</div>
						</div>
						<div class="box-item">
							<el-progress type="circle" :percentage="25" stroke-width="5" width="50" color="#1DA7C0" />
							<div class="txt-box">
								<div class="txt">女厕坐便器</div>
								<div class="num">32</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div class="public-box">
				<div class="service-public-title">餐饮</div>
				
				<div class="scll-box">
					 <div class="swiper-container">
						  <div class="swiper-wrapper">
							  
							  <div class="scll-item swiper-slide" v-for="item in 10">
								<div class="img"></div>
								<div class="box-right">
									<div class="b-right-top">
										<div class="tit">大观服务区(茂名方向)</div>
									</div>
									
									<div class="b-right-top">
										<span class="top-lable blue">G65沪蓉高速</span>
										<span class="top-lable">包间0  餐位120位</span>
									</div>
									
									
									<div class="right-tab">
										<div class="item">停车位</div>
										<div class="item">停车位</div>
										<div class="item">停车位</div>
									</div>
								</div>
							  </div>
						  </div>
						  <!-- 如果需要导航按钮 -->
						      <div class="swiper-button-prev"></div>
						      <div class="swiper-button-next"></div>
						</div>
					
				</div>
				
			</div>
			
			<div class="public-box">
				<div class="service-public-title">商超</div>
				
				<div class="scll-box">
					 <div class="swiper-container">
						  <div class="swiper-wrapper">
							  
							  <div class="scll-item swiper-slide" v-for="item in 10">
								<div class="img"></div>
								<div class="box-right">
									<div class="b-right-top">
										<div class="tit">大观服务区(茂名方向)</div>
									</div>
									
									<div class="b-right-top">
										<span class="top-lable blue">G65沪蓉高速</span>
										<span class="top-lable">包间0  餐位120位</span>
									</div>
									
									
									<div class="right-tab">
										<div class="item">停车位</div>
										<div class="item">停车位</div>
										<div class="item">停车位</div>
									</div>
								</div>
							  </div>
						  </div>
						  <!-- 如果需要导航按钮 -->
						      <div class="swiper-button-prev"></div>
						      <div class="swiper-button-next"></div>
						</div>
					
				</div>
				
			</div>
			
			
			<div class="service-num-box">
				<div class="item-box">
					<div class="service-public-title">加油站</div>
					
					<div class="service-more-item">
						<div class="img"></div>
						<div class="box-right">
							<div class="b-right-top">
								<div class="tit">大观服务区大观服务区大观服务区大观服务区(茂名方向)</div>
								<div class="top-phone">
									建成运营
								</div>
							</div>
							
							<div class="b-right-top">
								<span class="top-lable">收费站：100</span>
								<span class="top-lable">收费站：100</span>
							</div>
							<div class="b-right-top">
								<span class="top-lable">收费站：100</span>
								<span class="top-lable">收费站：100</span>
							</div>
							
							<div class="right-tab">
								<div class="item">停车位</div>
								<div class="item">停车位</div>
								<div class="item">停车位</div>
							</div>
						</div>
					</div>
					
				</div>
				<div class="item-box">
					<div class="service-public-title">加气站</div>
					
				</div>
			</div>
			
			<div class="service-num-box">
				<div class="item-box">
					<div class="service-public-title">充电站</div>
					
					
					
				</div>
				<div class="item-box">
					<div class="service-public-title">汽修</div>
					<div class="service-more-item">
						<div class="img"></div>
						<div class="box-right">
							<div class="b-right-top">
								<div class="tit">大观服务区大观服务区大观服务区大观服务区(茂名方向)</div>
								<div class="top-phone">
									建成运营
								</div>
							</div>
							
							<div class="b-right-top">
								<span class="top-lable">收费站：100</span>
								<span class="top-lable">收费站：100</span>
							</div>
							<div class="b-right-top">
								<span class="top-lable">收费站：100</span>
								<span class="top-lable">收费站：100</span>
							</div>
							
							<div class="right-tab">
								<div class="item">停车位</div>
								<div class="item">停车位</div>
								<div class="item">停车位</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div class="service-num-box">
				<div class="item-box">
					<div class="service-public-title">客房</div>
					
					<div class="service-more-item">
						<div class="img"></div>
						<div class="box-right">
							<div class="b-right-top">
								<div class="tit">大观服务区大观服务区大观服务区大观服务区(茂名方向)</div>
								<div class="top-phone">
									建成运营
								</div>
							</div>
							
							<div class="b-right-top">
								<span class="top-lable">收费站：100</span>
								<span class="top-lable">收费站：100</span>
							</div>
							<div class="b-right-top">
								<span class="top-lable">收费站：100</span>
								<span class="top-lable">收费站：100</span>
							</div>
							
							<div class="right-tab">
								<div class="item">停车位</div>
								<div class="item">停车位</div>
								<div class="item">停车位</div>
							</div>
						</div>
					</div>
					
				</div>
				<div class="item-box">
					<div class="service-public-title">母婴室</div>
					
				</div>
			</div>
			
			<div class="service-num-box">
				<div class="item-box">
					<div class="service-public-title">加水</div>
					
					
					
				</div>
				<div class="item-box">
					<div class="service-public-title">淋浴</div>
					<div class="service-more-item">
						<div class="img"></div>
						<div class="box-right">
							<div class="b-right-top">
								<div class="tit">大观服务区大观服务区大观服务区大观服务区(茂名方向)</div>
								<div class="top-phone">
									建成运营
								</div>
							</div>
							
							<div class="b-right-top">
								<span class="top-lable">收费站：100</span>
								<span class="top-lable">收费站：100</span>
							</div>
							<div class="b-right-top">
								<span class="top-lable">收费站：100</span>
								<span class="top-lable">收费站：100</span>
							</div>
							
							<div class="right-tab">
								<div class="item">停车位</div>
								<div class="item">停车位</div>
								<div class="item">停车位</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div class="service-num-box">
				<div class="item-box">
					<div class="service-public-title">司机之家</div>
					<div class="service-more-item">
						<div class="img"></div>
						<div class="box-right">
							<div class="b-right-top">
								<div class="tit">大观服务区大观服务区大观服务区大观服务区(茂名方向)</div>
								<div class="top-phone">
									建成运营
								</div>
							</div>
							
							<div class="b-right-top">
								<span class="top-lable">收费站：100</span>
								<span class="top-lable">收费站：100</span>
							</div>
							<div class="b-right-top">
								<span class="top-lable">收费站：100</span>
								<span class="top-lable">收费站：100</span>
							</div>
							
							<div class="right-tab">
								<div class="item">停车位</div>
								<div class="item">停车位</div>
								<div class="item">停车位</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			
		</div>
 	</div>
 </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits,defineExpose,reactive } from 'vue'
import Swiper from "swiper"
import { Pagination,Navigation } from "swiper/modules" // 导入分页模块
import { Autoplay } from "swiper/modules" // 导入自动滚动模块
// 导入 Swiper 样式
import "swiper/css"
import 'swiper/css/navigation'
import "swiper/css/pagination"

const props = defineProps({
  fromData: {
    type: Array,
    required: true
  }
})

const backFormData = ref({});


const isShowSearch=ref(false)

const open=()=>{
	isShowSearch.value=true;
}

const close=()=>{
	isShowSearch.value=false;
}

const mySwiperFn = () => {
  // 初始化 Swiper 实例
  new Swiper(".swiper-container", {
    loop: true, // 无缝 ，是否循环展示
    // 自动播放
    autoplay: {
      delay: 2000, // 每个图片移动完成后间隔
      disableOnInteraction: false, // 触摸后是否停止自动移动
      pauseOnMouseEnter: true //鼠标进入，停止滚动
    },
 
    resistanceRatio: 0,
    slidesPerView: 3, // 一组三个，设置slider容器能够同时显示的slides数量 > 1
    spaceBetween: 14, // 调整项目之间的间距，根据需要调整
    centeredSlides: true,
    // 窗口变化,重新init,针对F11全屏和放大缩小,必须加
    observer: true, //修改swiper自己或子元素时，自动初始化swiper
    observeParents: true, //修改swiper的父元素时，自动初始化swiper
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 1 //动态分页器的主指示点的数量
    },
	
	navigation: {
	  nextEl: '.swiper-button-next',
	  prevEl: '.swiper-button-prev',
	},
	
    // 使用的模块
    modules: [Pagination,Navigation]
  })
}
 
onMounted(() => {
  mySwiperFn()
})
</script>

<style lang="less" scoped>
.info-alert-box{
		width: 1380px;
		height:1032px;
		background: url('../../images/manage/alert_bg1.png');
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 888;
		display: flex;
		justify-content: center;
		margin-left: -690px;
		margin-top: -515px;
		overflow: hidden;
		
		.alert-box{
			width: 1328px;
			height: 962px;
			box-sizing: border-box;
			margin-top: 14px;
			
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
			
			.box-centent{
				height: 892px;
				overflow-y: auto;
				overflow-x: hidden;
				
				
				.top-box{
					width: 100%;
					height: 164px;
					display: flex;
					
					.img{
						width: 216px;
						height: 164px;
						background: #ddd;
						margin-left: 90px;
					}
					
					.box-right{
						height: 164px;
						width: 930px;
						margin-left: 17px;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						
						
						.b-right-top{
							height: 35px;
							display: flex;
							align-items: center;
							
							.tit{
								font-size: 18px;
								color: #FFFFFF;
								line-height: 35px;
							}
							
							.top-start{
								display: flex;
								height: 35px;
								margin-left: 6px;
								
								.item{
									width: 35px;
									height: 35px;
									background: url('../../images/manage/star1.png') left top no-repeat;
									margin-right: -7px;
								}
							}
							
							.top-phone{
								margin-left: 45px;
								display: flex;
								font-size: 14px;
								color: #0EC5FA;
								.phone-img{
									margin: 0 7px 0 24px
								}
							}
							
							.top-lable{
								margin-right: 45px;
								color: #fff;
								font-size: 14px
							}
						}
						
						.right-desc{
							height: 40px;
							font-family: Source Han Sans CN;
							font-size: 14px;
							color: #ECF4FF;
							line-height: 20px;
						}
						
						.right-tab{
							display: flex;
							
							.item{
								padding: 0 14px;
								height: 24px;
								background: rgba(27,149,235,0.52);
								border-radius: 2px;
								border: 1px solid;
								border-image: linear-gradient(-82deg, rgba(41,160,255,0.91), rgba(8,177,239,0.91)) 1 1;
								font-size: 14px;
								color: #CEDCE6;
								margin-right: 8px;
							}
						}
					}
			
				}
			
				.service-num-box{
					display: flex;
					justify-content: space-between;
					padding: 0 25px;
					margin-top: 24px;
					
					.item-box{
						width: 580px;
						
						.service-box{
							display: grid;
							grid-template-columns: repeat(4, auto);
							gap: 10px 5px;
							justify-content: space-around;
							padding: 0 30px;
							
							.box-item{
								width: 120px;
								min-height: 74;
								background: url('../../images/sc.png') top center no-repeat;
								display: flex;
								justify-content: center;
								flex-direction: column;
								align-items: center;
								padding-top: 12px;
								
								/deep/ .el-progress .el-progress__text{
									color: #50E0FF;
									
									span{
										font-size: 14px
									}
								}
								
								.txt-box{
									height: 20px;
									display: flex;
									align-items: center;
									justify-content: center;
									margin-top: 5px;
									
									.txt{
										font-size: 14px;
										color: #D4DBE4;
									}
									.num{
										font-size: 18px;
										color: #0BE1D9;
										margin-left: 7px;
									}
								}
							}
						}
					}
				
				
					
				}
				
				.public-box{
					padding: 0 25px;
					margin-top: 24px;
					
					.scll-box{
						width:1200px;
						overflow: hidden;
						height: 120px;
						margin-left: 43px;
						position: relative;
						
						// .swiper-button-prev{
						// 	width: 49px;
						// 	height: 51px;
						// 	background: url('../../images/manage/r_left.png');
							
						// 	&::after{
						// 		content: '';
						// 	}
						// }
						// .swiper-button-next{
						// 	width: 49px;
						// 	height: 51px;
						// 	background: url('../../images/manage/r_right.png');
							
						// 	&::after{
						// 		content: '';
						// 	}
						// }
						
						.scll-item{
							width: 387px;
							height: 120px;
							border-radius: 5px;
							border: 1px solid #5BC7FC;
							display: flex;
							align-items: center;
							justify-content: center;
							
							.img{
								width: 120px;
								height: 90px;
								background: #ddd;
							}
							
							.box-right{
								height: 90px;
								width: 230px;
								margin-left: 11px;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								
								
								.b-right-top{
									height: 20px;
									display: flex;
									align-items: center;
									
									.tit{
										font-size: 14px;
										color: #FFFFFF;
										line-height: 20px;
									}
									
									.top-lable{
										margin-right: 20px;
										color: #fff;
										
										&.blue{
											color: #0EC5FA;
										}
									}
									
								}
								
								.right-tab{
									display: flex;
									
									.item{
										padding: 0 8px;
										height: 24px;
										background: rgba(27,149,235,0.52);
										border-radius: 2px;
										border: 1px solid;
										border-image: linear-gradient(-82deg, rgba(41,160,255,0.91), rgba(8,177,239,0.91)) 1 1;
										font-size: 14px;
										color: #CEDCE6;
										margin-right: 8px;
									}
								}
							}
										
						}
					}
				}
			
			
				.service-more-item{
					width: 100%;
					height: 164px;
					display: flex;
					
					.img{
						width: 155px;
						height: 118px;
						background: #ddd;
						margin-left: 45px;
					}
					
					.box-right{
						height: 118px;
						width: 360px;
						margin-left: 10px;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						
						
						.b-right-top{
							height: 35px;
							display: flex;
							align-items: center;
							
							.tit{
								font-size: 14px;
								color: #FFFFFF;
								line-height: 35px;
								height: 25px;
								line-height: 25px;
								overflow: hidden;
							}
							
							.top-phone{
								margin-left: 10px;
								display: flex;
								font-size: 14px;
								color: #0EC5FA;
							}
							
							.top-lable{
								margin-right: 15px;
								color: #fff;
								font-size: 14px
							}
						}
						
				
						.right-tab{
							display: flex;
							
							.item{
								padding: 0 8px;
								height: 24px;
								line-height: 24px;
								background: rgba(27,149,235,0.52);
								border-radius: 2px;
								border: 1px solid;
								border-image: linear-gradient(-82deg, rgba(41,160,255,0.91), rgba(8,177,239,0.91)) 1 1;
								font-size: 12px;
								color: #CEDCE6;
								margin-right: 8px;
							}
						}
					}
							
				}
							
			}
		}
		
		.service-public-title {
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
	}
	
	
</style>