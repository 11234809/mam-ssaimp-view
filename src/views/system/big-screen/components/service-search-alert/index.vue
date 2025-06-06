<template>
 <div class="area-alert-box" v-if="isShowSearch">
 	<div class="alert-box">
 		<div class="title">
 			服务区筛选
 			
 			<div class="close" @click="isShowSearch=false"></div>
 		</div>
 		
		<div class="box-centent">
			<div class="alert-item" v-for="(item,index) in fromData" :key="index">
				<div class="item-tit">{{item.title}}：</div>
				<div class="item-checkbox">
					<el-checkbox-group v-model="backFormData[item?.field]">
					  <el-checkbox v-for="(c, index) in item.children" :label="c.value" :key="index" class="image-checkbox">
							  <div class="diy-box">
								  <img src="../../images/manage/checkbox_off.png" class="off" />
									<img src="../../images/manage/checkbox_on.png" class="on" />
								  {{c.label}}
							  </div>
					  </el-checkbox>
					</el-checkbox-group>
					  
				</div>
			</div>
		</div>
 		
 		<div class="alert-footer">
 			<div class="footer-btn" @click="resetData">
 				<span class="txt">重置</span>
 			</div>
 			<div class="footer-btn" @click="ok">
 				<span class="txt">确定</span>
 			</div>
 		</div>
 	</div>
 </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits,defineExpose,reactive } from 'vue'

const props = defineProps({
  fromData: {
    type: Array,
    required: true
  }
})

const backFormData = ref({});

const emptyStatus=ref(false)

const isShowSearch=ref(false)

const open=()=>{
	isShowSearch.value=true;
}

const close=()=>{
	isShowSearch.value=false;
}

const emit = defineEmits(["ok"]);

const resetData=()=>{
	Object.keys(backFormData.value).forEach(key=>{
		backFormData.value[key]=[];
	})
}

const ok=()=>{
	isShowSearch.value=false;
	emit("ok", backFormData.value);
}

defineExpose({
  open,
  close,
});
</script>

<style lang="less" scoped>
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
			
			.box-centent{
				height: 180px;
				overflow-y: auto;
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