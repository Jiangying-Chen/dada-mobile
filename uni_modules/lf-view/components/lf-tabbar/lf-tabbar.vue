<template>
	<view>
		<view class="tabbar-wrap">
			<block v-for="(item, index) in list" :key="index">
				<view @click="onTab(item, index)" v-show="active !== index" class="tab-item">
					<image class="icon" :class="{ 'mid-button': item.midButton }" :src="item.iconPath"  :style="{height:item.midButton == true ? '34px' : '24px'}"></image>
					<text class="txt" :style="{ color: color }">{{ item.text }}</text>
					<!-- <text v-if="count[index] > 0" class="number">{{count[index] | maxNum}}</text> -->
				</view>
				<view @click="onTab(item, index)" v-show="active === index" class="tab-item">
					<image class="icon" :class="{ 'mid-button': item.midButton }" :src="item.selectedIconPath"></image>
					<text class="txt" :style="{ color: selectedColor }">{{ item.text }}</text>
					<!-- <text v-if="count[index] > 0" class="number">{{count[index] | maxNum}}</text> -->
				</view>
			</block>
		</view>
		<!-- 中间按钮弹窗 -->
		<lf-popup v-model="showPopup">
			<view class="handle-wrap" v-if="isOpen==1">
				<view @click="handleJump(item)" class="item" v-for="(item,index) in popup" :key="index">	
					<image mode="widthFix" class="icon" :src="item.icon"></image>
					<text class="txt">{{item.text}}</text>
				</view>
			</view>
			<view class="handle-wrap" v-if="isOpen==0">
				<view @click="handleJump(item)" class="item" v-for="(item,index) in popup2" :key="index">	
					<image mode="widthFix" class="icon" :src="item.icon"></image>
					<text class="txt">{{item.text}}</text>
				</view>
			</view>
			<!-- <view class="handle-close">
				<u-icon @click="onClose" size="50rpx" name="close"></u-icon>
			</view> -->
		</lf-popup>
		
		<RealName v-model="isOpenRealName"></RealName>
		
		<view style="height: 52px;"></view>
	</view>
</template>

<script>
import RealName from '@/components/RealName/RealName.vue'
import tabbar from '@/utils/tabbar.js';
export default {
	components:{
		RealName
	},
	name: 'lf-tabbar',
	props: {
		//tab 上的文字默认颜色
		color: {
			type: String,
			default: '#FFFFFF'
		},
		//tab 上的文字选中时的颜色
		selectedColor: {
			type: String,
			default: '#C1C0FA'
		},
		active:{
			type:Number,
			default:0
		},
		count:{
			type:Array,
			default:[]
		}
	},
	beforeCreate() {
		uni.hideTabBar();
	},
	filters:{
		maxNum(num){

			if(num > 99){
				return '99+'
			}else{
				return num
			}
		}
	},
	data() {
		return {
			isOpen: getApp().globalData.isOpen,
			list: tabbar.list,
			popup:tabbar.popup,
			showPopup:false,
			popup2:[{
				icon: '/static/h_2.png',
				text: '动态',
				url: '/pages/post/add?type=1'
			},
			{
				icon: '/static/h_1.png',
				text: '投票',
				url: '/pages/vote/vote'
			},
			{
				icon: '/static/article.png',
				text: '长文',
				url: '/subpages/content/article/add'
			}],
			
			isOpenRealName:false,
			
		};
	},
	computed:{
		userInfo(){
			return this.$store.state.loginUserInfo ||{}
		}
	},
	methods: {
		onTab(e, index) {
			console.log('')
			if(e.pagePath=='/pages/post/add?type=1'){
				   if(this.userInfo && this.userInfo.uid){
					   if(this.userInfo.type==1){
						   uni.navigateTo({
						   		url:e.pagePath
						   })
					   }else{
						   //未实名
						   let isRN = getApp().globalData.isRealName;
						   if(isRN==1){
							   if(this.userInfo.identity==null || this.userInfo.identity==''){
								   console.log('未实名')
								   this.isOpenRealName = true;
							   }else{
								   uni.navigateTo({
										url:e.pagePath
								   })
							   }
						   }else{
							   uni.navigateTo({
									url:e.pagePath
							   })
						   }
					   }
					   
				   }else{
					   this.$u.toast('未登录，暂不支持发帖');
					   this.$store.commit('SET_ISJUMP',false)
					   setTimeout(()=>{
						   uni.navigateTo({
							  url:'/pages/user/login'
						   })
					   },500)
					   return
				   }
			}else if(e.pagePath=='/pages/store/index' || e.pagePath =='/pages/my/jidi'){
				 if(this.userInfo && this.userInfo.uid){
					 uni.switchTab({
						url: e.pagePath
					 });
				 }else{
					this.$store.commit('SET_ISJUMP',false)
					uni.navigateTo({
						url:'/pages/user/login'
					})
					return
				 }
			}else{
				uni.switchTab({
					url: e.pagePath
				});
			}
			this.$emit('click', e);
		},
		
		
		onClose(){
			this.showPopup = false;
		},
		handleJump(e){
			uni.navigateTo({
				url:e.url
			})
			
			this.showPopup = false;
		}
	}
};
</script>

<style lang="scss" scoped>
	.flex-items {
		display: flex;
		align-items: center;
	}
.informationShow-centent {
		width: 580rpx;
		height: 500rpx;
		.title{
			font-weight: bold;
			color: $text-color-black;
			text-align: center;
			margin: 42rpx auto;
			font-size: 40rpx;
		}
		.red-label{
			font-size: 28rpx;
			font-weight: 400;
			color: #E3493F;
			text-align: center;
			margin-bottom: 20rpx;
		}
		.box{
			margin-bottom: 40rpx;
			.label-left{
				width: 140rpx;
				font-size: $font-size-base;
				font-weight: 400;
				color: #000000;
				text-align: center;
				
			}
			.label-right{
				flex:1;
				.remark {
					border: 2rpx solid #D9D9D9;
					width: 360rpx;
					height: 66rpx;
					line-height: 66rpx;
					border-radius: 16rpx;
					padding: 0 20rpx;
				}
			}
		}
		

	.flex-footer{
		display: flex;
		padding: 26rpx 32rpx;
		justify-content: space-between;
		align-items: center;
		.btns{
			width: 220rpx;
			height: 64rpx;
			text-align: center;
			//line-height: 64rpx;
			border-radius: 32rpx ;
			border: 1upx solid $btn-base;
		}
		.exitBut {
			background:$text-color-white;
			color: $btn-base;
		}
		.submitbut {
			background:$btn-base;
			color: $text-color-white;
		}
	}	
	
}	
	
.tabbar-wrap {
	position: fixed;
	bottom: 0;
	width: 100%;
	z-index: 999;
	//background-color: #001937;
	background-color: #2A0A6D;
	//height: 52px;
	
	//height: 56px;
	padding-top: 4px;
	display: flex;
	align-items: center;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 100%;
		border-radius: 8px;
		position: relative;
		.icon {
			width: 24px;
			height: 24px;
		}
		.txt {
			font-size: 10px;
		}
		.number{
			background-color: #FA3534;
			color: #fff;
			border-radius: 50%;
			position: absolute;
			right: 25rpx;
			top: 10rpx;
			display: inline-block;
			width: 40rpx;
			height: 40rpx;
			font-size: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.mid-button {
			width: 43px;
			height: 43px;
		}
	}
	
	.tab-item[hidden] {
		display: none !important;
	}
}

// 中间按钮弹出框
.handle-wrap{
	display: flex;
	padding: 50rpx 0;
	.item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		padding: 20rpx 0;
		border-radius: 20rpx;
		.icon{
			width: 100rpx;
			margin-bottom: 20rpx;
		}
		.txt{
			font-size: 28rpx;
		}
	}
}

.handle-close{
	display: flex;
	justify-content: center;
	margin-bottom: 50rpx;
}
</style>
