<template>
	<view class="bgbox" >
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="星尘商店"></top-nave>
		<!-- <top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="基地"></top-nave> -->
		<view class="intelbox">
			<view class="pointbox">
				<view class="point">
					{{info.integral}}
				</view>
				<view class="point-title">
					当前可用燃料
				</view>
			</view>
			<view style="position: absolute;right: 0;top: 70rpx;">
				<view class="fuelbtn" @tap="goUserIntegral(0)">燃料明细</view>
				<view class="rateBtn" @tap="getRateBtn">我的兑换</view>
			</view>
			
		</view>
		<view style="text-align: center;margin-top: 40rpx;" @tap="getsign">
			<image mode="aspectFill" style="width: 702rpx;height: 150rpx;"   src="https://xiaoyuan.pujinetwork.com/bbs/20230901/d1007a5cecb4457fb762b9efddbee312.png "></image>
		</view>
		
		<!-- 热门兑换 -->
		<view class="top-title-view">
			热门兑换
		</view>
		<scroll-view class="productview" :scroll-x="true">
			<view class="productbox" v-for="(item,index) in productList" :key='index' @tap="pageToDetail(item)">
				<view class="productimage">
					<image :src="item.thumbnail" mode=""></image>
				</view>
				<view class="productname">
					{{item.goodsName}}
				</view>
				<view class="productnum">
					已兑换{{item.buyCount}}
				</view>
				<view class="productpoint">
					{{item.points}}<span>燃料</span>
				</view>
			</view>
		</scroll-view>
		<view class="tomore" @tap="pageToList()">
			查看全部燃料兑换商品 >>
		</view>
		<!-- 积分任务 -->
		<view class="top-title-view">
			日常任务
		</view>
		<view class="tasklist">
			<view class="taskview uni-flex uni-row" style="justify-content: space-between;" v-for="item in dailyTask" :key="item.id">
				<view class="uni-flex uni-row taskinfo"  style="flex: 1 1 0%;">
					<view class="left-image">
						<image :src="item.img" mode="aspectFill" style="width:80rpx;height: 80rpx;"></image>
					</view>
					<view class="left-info" style="flex: 1 1 0%;" v-if="item.taskStatus == null">
						<view class="task-name">
							{{item.pointTaskName}}
						</view>
						<view class="task-point">
							奖励{{item.pointValue}}燃料
						</view>
					</view>
					<view class="left-info" style="flex: 1 1 0%;" v-else>
						<view class="task-name">
							{{item.pointTaskName}}
						</view>
						<view class="task-point">
							({{item.completedValue}}/{{item.pointTaskValue}})
						</view>
					</view>
				</view>
				<view class="right-btn uni-flex uni-row">
					<view class="btn-get" @tap="saveTask(item.id)" v-if="item.taskStatus == null">
						领取任务
					</view>
					<view class="btn-success" @tap="getnavigateTo(item)"   v-if="item.taskStatus == 'IN_HAND'">
						去完成
					</view>
					<view class="btn-completed" v-if="item.taskStatus == 'FINISHED'">
						已结束
					</view>
					<view class="btn-completed" v-if="item.taskStatus == 'COMPLETED'">
						已完成
					</view>
				</view>
			</view>
		</view>
		<view class="top-title-view">
			新手任务
		</view>
		<view class="tasklist">
			<view class="taskview uni-flex uni-row" style="justify-content: space-between;" v-for="(items,index) in beginnerTask"  :key="index">
				<view class="uni-flex uni-row taskinfo"  style="flex: 1 1 0%;">
					<view class="left-image">
						<image :src="items.img" mode="aspectFill" style="width:80rpx;height: 80rpx;"></image>
					</view>
					<view class="left-info" style="flex: 1 1 0%;" v-if="items.taskStatus == null">
						<view class="task-name">
							{{items.pointTaskName}}
						</view>
						<view class="task-point">
							奖励{{items.pointValue}}燃料
						</view>
					</view>
					<view class="left-info" style="flex: 1 1 0%;" v-else>
						<view class="task-name">
							{{items.pointTaskName}}
						</view>
						<view class="task-point">
							({{items.completedValue}}/{{items.pointTaskValue}})
						</view>
					</view>
				</view>
				<view class="right-btn uni-flex uni-row">
					<view class="btn-get" @tap="saveTask(items.id)" v-if="items.taskStatus == null">
						领取任务
					</view>
					<!-- FINISHED -->
					<view class="btn-success" @tap="getnavigateTo(items)" v-if="items.taskStatus == 'IN_HAND'" >
						去完成
					</view>
					<view class="btn-completed" v-if="items.taskStatus == 'COMPLETED'">
						已完成
					</view>
					<view class="btn-completed" v-if="items.taskStatus == 'FINISHED'">
						已结束
					</view>
				</view>
			</view>
		</view>
		<view class="top-title-view">
			特殊任务
		</view>
		<view class="tasklist">
			<view class="taskview uni-flex uni-row" style="justify-content: space-between;" v-for="item in specialTask" :key='item.id'>
				<view class="uni-flex uni-row taskinfo"  style="flex: 1 1 0%;">
					<view class="left-image">
						<image :src="item.img"  mode="aspectFill" style="width:80rpx;height: 80rpx;"></image>
					</view>
					<view class="left-info" style="flex: 1 1 0%;" v-if="item.taskStatus == null">
						<view class="task-name">
							{{item.pointTaskName}}
						</view>
						<view class="task-point">
							奖励{{item.pointValue}}燃料
						</view>
					</view>
					<view class="left-info" style="flex: 1 1 0%;" v-else>
						<view class="task-name">
							{{item.pointTaskName}}
						</view>
						<view class="task-point">
							({{item.completedValue}}/{{item.pointTaskValue}})
						</view>
					</view>
				</view>
				<view class="right-btn uni-flex uni-row">
					<view class="btn-get" @tap="saveTask(item.id)" v-if="item.taskStatus == null">
						领取任务
					</view>
					<view class="btn-success" @tap="getnavigateTo(item)"  v-if="item.taskStatus == 'IN_HAND'">
						去完成
					</view>
					<!-- <view class="btn-get-point" @tap="completeTask(item.taskId)" v-if="item.taskStatus == 'IN_HAND' && item.completedValue == item.pointTaskValue">
						领取奖励
					</view> -->
					<view class="btn-completed" v-if="item.taskStatus == 'COMPLETED'">
						已完成
					</view>
					<view class="btn-completed" v-if="item.taskStatus == 'FINISHED'">
						已结束
					</view>
				</view>
			</view>
		</view>
		<view style="height: 50px;">&nbsp;</view>
		<lf-tabbar :active="3"></lf-tabbar>
		
		<u-popup v-model="openPop" mode="center" border-radius="14" :bgColor="bgColor">
			<view class="popup">
				<view class="content">
					<button open-type="share" class="btn">立即邀请好友</button>
					<view class="label" @click="openPop=false"> 暂不邀请 </view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import topNave from '@/components/nav-header/index.vue';
	export default {
		computed: {
			...mapGetters(['loginUserInfo'])
		},
		components: {
			topNave
		},
		data() {
			return {
				navigationBarHeight: 0,
				statusBarHeight: 0,
				beginnerTask:[],
				specialTask:[],
				dailyTask:[],
				productList:[],
				info:{},
				openPop:false,
				bgColor:{
					background: 'transparent'
				},
			};
		},
		onShareAppMessage(res) {
			return {
				title: this.$c.miniappName,
				path: `/pages/store/index?formId=${this.loginUserInfo.uid}`,
				imageUrl: this.shareCover
			};
		},
		onShareTimeline(res) {
			return {
				title: this.$c.miniappName,
				query: `formId=${this.loginUserInfo.uid}`,
				imageUrl: this.shareCover
			}
		},
		onLoad(option) {
			console.log('option',option)
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			if(option.formId){
				this.$store.commit('SET_FORMID',option.formId)
				this.$H.post(`point/task/complete/${option.formId}?alreadyNum=1&type=invite_new`).then(res => {
					console.log('----res',res)
				})
				
				this.$H.get("user/userInfo").then(res => {
					if(res.code != 0){
						this.$f.toast('限时任务需要先完成实名认证，请去实名认证')
						uni.navigateTo({
							url:`/pages/user/edit-info/edit`
						})
					}
				})
				
				
			}
		},
		onShow() {
			this.getAllTask();
			this.getCommodity();
			this.getUserInfo();
		},
		
		methods: {
			getnavigateTo(item){
				//邀新任务
				if(item.type=='invite_new_group' || item.type=='invite_new'){
					this.openPop = true;
					
				}else if(item.skipUrl== '/pages/square/index'||item.skipUrl== '/pages/index/index'||item.skipUrl== '/pages/store/index'){
					 uni.switchTab({
					 		url: item.skipUrl
					 	})
				 }else{
					 uni.navigateTo({
					 		url: item.skipUrl,
					});
				 }
				
			},
			
			getsign(){
				uni.navigateTo({
					url:'/pages/sign/sign'
				})
			},
			getUserInfo: function(){
			 	this.$H.post('sign/userInfo', {}).then(res => {
					this.info = res.data;
					console.log(this.info,'info=====')
				})
			},
			// 燃料明细
			getFuelbtn(){
				uni.navigateTo({
					url:'/pages/store/fuel'
				})
			},
			getRateBtn(){
				uni.navigateTo({
					url:'/pages/store/rate'
				})
			},
			goUserIntegral(type) {
				uni.navigateTo({
					url: '/pages/sign/integral?type=' + type
				});
			},
			pageToList(){
				uni.navigateTo({
					url:'/pages/store/productlist'
				})
			},
			pageToDetail(row){
				uni.navigateTo({
					url:'/pages/store/detail?id=' + row.id
				})
			},
			getCommodity(){
				let that = this;
				that.$H.get("pointGoods",{
					pageNumber:1,
					pageSize:5
				}).then(res => {
					
					that.productList = res.result.records
							
				})
			},
			getAllTask(){
				let that = this;
				that.beginnerTask=[];
				that.specialTask=[];
				that.dailyTask=[];
				// 所有积分任务
				// uni.showLoading({
				// 	mask: true,
				// 	title: '加载中'
				// });
				// setTimeout(()=>{
					that.$H.get("point/task/getList").then(res => {
						res.result.forEach(v=>{
							v.taskStatus = null;
							if(v.pointTaskType == 'beginner'){
								that.beginnerTask.push(v)
							}
							if(v.pointTaskType == 'special'){
								that.specialTask.push(v)
							}
							if(v.pointTaskType == 'daily'){
								that.dailyTask.push(v)
							}
						})
						that.getMyTask();
						console.log(that.beginnerTask,'beginnerTask1')
					})
				// },500)
				
			},
			getMyTask(){
				let that = this;
				// 领取的积分任务
				
				that.$H.get("point/task/getMyTaskList/" + that.loginUserInfo.uid,).then(res => {
					// uni.showLoading({
					// 	mask: true,
					// 	title: '加载中'
					// });
					// setTimeout(()=>{
						res.result.forEach(v=>{
							if(v.pointTaskType == 'beginner'){
								that.beginnerTask.forEach((m,i)=>{
									if(v.taskId == m.id){
										that.beginnerTask[i].taskStatus=v.taskStatus;
										that.beginnerTask[i]=v;
										that.beginnerTask[i].skipUrl=m.skipUrl;
										that.beginnerTask[i].img=m.img;
									}
								})
							}
							if(v.pointTaskType == 'special'){
								that.specialTask.forEach((m,i)=>{
									if(v.taskId == m.id){
										that.specialTask[i].taskStatus=v.taskStatus;
										that.specialTask[i]=v;
										that.specialTask[i].skipUrl=m.skipUrl;
										that.specialTask[i].img=m.img;
									}
								})
							}
							if(v.pointTaskType == 'daily'){
								that.dailyTask.forEach((m,i)=>{
									if(v.taskId == m.id){
										that.dailyTask[i].taskStatus=v.taskStatus;
										that.dailyTask[i]=v;
										that.dailyTask[i].skipUrl=m.skipUrl;
										that.dailyTask[i].img=m.img;
									}
								})
							}
						})
						// uni.hideLoading();
					// },10000)
					
					 console.log(that.dailyTask,that.beginnerTask,'beginnerTask======')
				})
			},
			saveTask(id){
				// 领取任务
				let that = this;
				uni.showLoading({
					mask: true,
					title: '领取中'
				});
				setTimeout(()=>{
					that.$H.post("point/task/save/" + id).then(res => {
						that.getAllTask()
					})
					uni.hideLoading()
				},1000)
				
			},
			completeTask(id){
				// 领取任务奖励
				let that = this;
				that.$H.post("point/task/complete/" + id).then(res => {
					that.getAllTask()
							
				})
			}
		}
	};
</script>
<style lang="scss">
	page {
	  width: 100%;
	  overflow-x: hidden;
	  background-color: $themes-color;
	}
</style>
<style lang="scss" scoped>
	.popup{
		background-image: url('https://xiaoyuan.pujinetwork.com/bbs/20230906/603e65d13d9a45afac4ae69c3e391d5a.png');
		background-size: 100%;
		background-repeat: no-repeat;
		width: 550rpx;
		height: 700rpx;
		position: relative;
		.content{
			position: absolute;
			left: 103rpx;
			right: 103rpx;
			bottom: 0;
			text-align: center;
			.btn{
				width: 344rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: $btn-base;
				border-radius: 44rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
			.label{
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
				margin: 30rpx auto;
			}
		}
	}
	.bgbox{
		background-image: url('https://mallwj.hm-myy.cn/169199334419320230814140904.png');
		background-size: 100%;
		background-repeat: no-repeat;
	}
	
	// 积分内容
	.intelbox{
		position: relative;
		// height: 200px;
		.pointbox{
			margin-top: 69px;
			display: inline-block;
			padding: 9px 37px 9px 21px;
			background: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.6) 51%, rgba(0,0,0,0) 100%);
			.point{
				font-size: 40px;
				font-weight: 800;
				color: #FFFFFF;
			}
			.point-title{
				font-size: 12px;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 12px;
				text-shadow: 0px 2px 14px rgba(0,0,0,0.25);
				// margin-top: 5px;
			}
			
		}
		.fuelbtn{
			width: 180rpx;
			height: 64rpx;
			background: rgba(0,0,0,0.6);
			border-radius: 32rpx 0rpx 0rpx 32rpx;
			font-size: 28rpx;
			text-align: center;
			line-height: 64rpx;
			font-weight: 500;
			color: #FFFFFF;
			margin-bottom: 32rpx;
		}
		.rateBtn{
			width: 180rpx;
			height: 64rpx;
			background: $btn-base;
			border-radius: 32rpx 0rpx 0rpx 32rpx;
			text-align: center;
			line-height: 64rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
	.top-title-view{
		font-size: 18px;
		font-weight: 800;
		color: #FFFFFF;
		margin: 12px 12px;
	}
	
	.taskview{
		background: $bg-color-light;
		border-radius: 12px 12px 12px 12px;
		margin: 6px 12px;
		padding: 19px 8px 19px 12px;
		.taskinfo{
			.left-image {
				// width: 80rpx;
				// height: 80rpx;
				// border-radius: 20px;
				// overflow: hidden;
				image {
					// width: 40px;
					// height: 40px;
				}
			}
			.left-info {
				margin-left: 8px;
			
				.task-name {
					font-size: 15px;
					font-weight: 600;
					color: $text-color-base;
				}
			
				.task-point {
					font-size: $font-size-sm;
					font-weight: 400;
					color:rgba(15,1,88,0.8);
				}
			}
			
		}
		.right-btn{
			width: 90px;
			margin-top: 5px;
			.btn-get{
				border-radius: 16px 16px 16px 16px;
				opacity: 1;
				border: 1px solid $text-color-purple;
				font-size: 14px;
				font-weight: 500;
				color: $text-color-purple;
				line-height: 32px;
				padding:0 6px;
				height: 32px;
			}
			.btn-success{
				background: $text-color-purple;
				border-radius: 16px 16px 16px 16px;
				font-size: 14px;
				font-weight: 500;
				color: $text-color-white;
				line-height: 32px;
				padding:0 18px;
				height: 32px;
			}
			.btn-get-point{
				border-radius: 16px 16px 16px 16px;
				opacity: 1;
				border: 1px solid #FFDA44;
				font-size: 14px;
				font-weight: 500;
				color: #FFDA44;
				line-height: 32px;
				padding:0 6px;
				height: 32px;
			}
			.btn-completed{
				background: #9896EC;
				border-radius: 16px 16px 16px 16px;
				font-size: 14px;
				font-weight: 500;
				color: #6765CA;
				line-height: 32px;
				padding:0 18px;
				height: 32px;
			}
		}
		
	}
	
	.tomore{
		margin: 20px 12px;
		background: $bg-color-black;
		border-radius: 8px 8px 8px 8px;
		font-size: 14px;
		font-weight: 500;
		color: #FFFFFF;
		text-align: center;
		padding: 10px 0;
	}
	
	// 商品列表
	.productview{
		white-space: nowrap;
		width: 95%;
		overflow-x: hidden;
		margin: 0px 2.5%;
		// padding:17px 0 0px ;
		.productbox{
			display: inline-block;
			background:$bg-color-black;
			border-radius: 12px 12px 12px 12px;
			margin: 0 1%;
			overflow: hidden;
			width:140px;
			.productimage{
				image{
					width: 140px;
					height: 140px;
				}
			}
			.productname{
				margin: 6px 12px;
				text-align: center;
				font-size: 14px;
				// font-family: Source Han Sans CN-Medium, Source Han Sans CN;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 16px;
			}
			.productnum{
				text-align: center;
				font-size: 10px;
				font-weight: 300;
				color: rgba(255,255,255,0.8);
			}
			.productpoint{
				margin: 13px auto 11px;
				width: 90px;
				border-radius: 14px 14px 14px 14px;
				border: 1px solid #FFDA44;
				text-align: center;
				font-size: 14px;
				font-weight: 500;
				color: #FFDA44;
				line-height: 28px;
				span{
					font-size: 12px;
				}
			}
		}
	}
</style>