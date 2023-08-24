<template>
	<view class="bgbox" >
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="星尘商店"></top-nave>
		<!-- <top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="基地"></top-nave> -->
		<view class="intelbox">
			<view class="pointbox">
				<view class="point">
					{{loginUserInfo.integral}}
				</view>
				<view class="point-title">
					当前可用燃料
				</view>
			</view>
		</view>
		<!-- 热门兑换 -->
		<view class="top-title-view">
			热门兑换
		</view>
		<scroll-view class="productview" scroll-x="true">
			<view class="productbox" v-for="item in productList" @tap="pageToDetail(item)">
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
			<view class="taskview uni-flex uni-row" style="justify-content: space-between;" v-for="item in dailyTask" >
				<view class="uni-flex uni-row taskinfo"  style="flex: 1 1 0%;">
					<view class="left-image">
						<image :src="item.img" mode=""></image>
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
					<view class="btn-success" v-if="item.taskStatus == 'IN_HAND'">
						去完成
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
			<view class="taskview uni-flex uni-row" style="justify-content: space-between;" v-for="item in beginnerTask" >
				<view class="uni-flex uni-row taskinfo"  style="flex: 1 1 0%;">
					<view class="left-image">
						<image :src="item.img" mode="widthFix" style="width:100rpx;height: 100rpx;"></image>
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
					<view class="btn-success" v-if="item.taskStatus == 'IN_HAND'">
						去完成
					</view>
					<view class="btn-completed" v-if="item.taskStatus == 'COMPLETED'">
						已完成
					</view>
				</view>
			</view>
		</view>
		<view class="top-title-view">
			特殊任务
		</view>
		<view class="tasklist">
			<view class="taskview uni-flex uni-row" style="justify-content: space-between;" v-for="item in specialTask" >
				<view class="uni-flex uni-row taskinfo"  style="flex: 1 1 0%;">
					<view class="left-image">
						<image :src="item.img" mode=""></image>
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
					<view class="btn-success" v-if="item.taskStatus == 'IN_HAND'">
						去完成
					</view>
					<!-- <view class="btn-get-point" @tap="completeTask(item.taskId)" v-if="item.taskStatus == 'IN_HAND' && item.completedValue == item.pointTaskValue">
						领取奖励
					</view> -->
					<view class="btn-completed" v-if="item.taskStatus == 'COMPLETED'">
						已完成
					</view>
				</view>
			</view>
		</view>
		<lf-tabbar :active="3"></lf-tabbar>
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
				productList:[]
			};
		},
		
		onLoad() {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			
		},
		onShow() {
			this.getAllTask();
			this.getCommodity();
		},
		
		methods: {
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
					
							
				})
			},
			getMyTask(){
				let that = this;
				// 领取的积分任务
				that.$H.get("point/task/getMyTaskList/" + that.loginUserInfo.uid,).then(res => {
					
					res.result.forEach(v=>{
						
						if(v.pointTaskType == 'beginner'){
							that.beginnerTask.forEach((m,i)=>{
								if(v.taskId == m.id){
									that.beginnerTask[i].taskStatus=v.taskStatus;
									that.beginnerTask[i]=v;
								}
							})
						}
						if(v.pointTaskType == 'special'){
							that.specialTask.forEach((m,i)=>{
								if(v.taskId == m.id){
									that.specialTask[i].taskStatus=v.taskStatus;
									that.specialTask[i]=v;
								}
							})
						}
						if(v.pointTaskType == 'daily'){
							that.dailyTask.forEach((m,i)=>{
								if(v.taskId == m.id){
									that.dailyTask[i].taskStatus=v.taskStatus;
									that.dailyTask[i]=v;
								}
							})
						}
					})
					 console.log(that.dailyTask)
				})
			},
			saveTask(id){
				// 领取任务
				let that = this;
				that.$H.post("point/task/save/" + id,).then(res => {
					
					that.getAllTask()
							
				})
			},
			completeTask(id){
				// 领取任务奖励
				let that = this;
				that.$H.post("point/task/complete/" + id,).then(res => {
					
					that.getAllTask()
							
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.bgbox{
		background-image: url(https://mallwj.hm-myy.cn/169199334419320230814140904.png);
		background-size: 100%;
		background-repeat: no-repeat;
	}
	
	// 积分内容
	.intelbox{
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
	}
	.top-title-view{
		font-size: 18px;
		font-weight: 800;
		color: #FFFFFF;
		margin: 20px 12px;
	}
	
	.taskview{
		background: $bg-color-light;
		border-radius: 12px 12px 12px 12px;
		margin: 6px 12px;
		padding: 19px 8px 19px 12px;
		.taskinfo{
			.left-image {
				width: 40px;
				height: 40px;
				border-radius: 20px;
				overflow: hidden;
				image {
					width: 40px;
					height: 40px;
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
		width: 100%;
		margin: 0px 12px;
		padding:17px 0 0px ;
		.productbox{
			background:$bg-color-black;
			border-radius: 12px 12px 12px 12px;
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
				// padding: 4px 0;
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