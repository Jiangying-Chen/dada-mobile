<template>
	<!-- style="position: relative;" -->
	<view  class="mainbg">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="兴趣爱好"
			:isback="true"></top-nave>
		<view class="top-header-title">
			请选择您的兴趣与爱好
		</view>
		<view class="" style="font-size: 28rpx;font-weight: 400;color: #FFFFFF;text-align: center;margin-bottom: 70rpx;">兴趣爱好为个人信息，可以设置他人不可见</view>
		<view class="live-navstyle" >
			<view :class="{activestyle:interestIndex.indexOf(index)>-1}" class="live-nav-itemstyle" v-for="(item,index) in interest"
			:key="index" @click="getClick(item,index)">{{item.labelName}}</view>
		</view>
		<view style="position: absolute;bottom: 100rpx;left: 0;width: 100%;">
			<view style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
				<view class="textindex">您已选中 <span style="color:#F0DB1D ;">{{interestIndex?interestIndex.length:0}}</span> 个兴趣爱好</view>
				<view class="nextStep" @click="getnavigateTo(1)">下一步</view>
				<view class="" style="color: #fff;margin-top: 50rpx;width: 120rpx;height: auto;text-align: center;" @click="getnavigateTo(0)">跳过</view>
			</view>
		</view>
	</view>

</template>

<script>
	import websocket from '@/utils/websocket.js';
	import $store from '@/store/index.js';
	import topNave from '@/components/nav-header/index.vue';
	export default {
		components: {
			topNave
		},
		data() {
			return {
				interest:[],
				interestIndex:[],
				navigationBarHeight: 0,
				statusBarHeight: 0,
				domain: this.$H.domain,
				shareCover: "",
				uid: 0,
				keyword: '',
				search: [],
				tagStr:[],
			};
		},
		onLoad() {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			this.uid = uni.getStorageSync('userInfo').uid;
			this.gettag()
		},
		methods: {
			checkboxGroupChange(){
				
			},
			checkboxChange(){
				
			},
			gettag(){
				
				this.$H.get('user/get/label').then(res=>{
					this.interest=res.result;
				})
					
			},
			getClick(item,index){
				if(this.interestIndex.indexOf(index)==-1){
					this.interestIndex.push(index);
					this.tagStr.push(item.labelName)
				}else{
					let spliceIndex=this.interestIndex.indexOf(index);
					let labelName=this.tagStr.indexOf(item.labelName);
					this.tagStr.splice(labelName,1)
					this.interestIndex.splice(spliceIndex,1)
				}
				
			},
			searchParent() {
				let _this = this;
				if(_this.keyword == '' || _this.keyword == null){
					uni.showToast({
						title: '关键词不能为空',
						icon: "none"
					});
				}else{
					_this.$H.get('topic/search', {
						page: 1,
						keyword: _this.keyword
					}).then(res => {
						if(res.result.data.length > 0){
							_this.search = res.result.data;
						}else{
							_this.search = []
						}
						
					});
				}
				
			},
			getnavigateTo(type){
				if(type==1){
					let tagStr=JSON.stringify(this.tagStr);
					uni.navigateTo({
						url:'/pages/login/information?tagStr='+tagStr,
					})
				}else{
					uni.navigateTo({
						url:'/pages/login/information'
					})
				}
				
			},
			
		}
	}
</script>

<style lang="scss">
	.mainbg {
		background: url("https://mallwj.hm-myy.cn/169113202973720230804145349.png") repeat-y;
		background-size: 100%;
		height: 100vh;
	}
	.textindex{
		text-align: center;
		font-size: 28rpx;
		font-weight: 500;
		color: rgba(255,255,255,0.8);
	}
	.nextStep{
		margin-top: 58rpx;
		width: 460rpx;
		height: 88rpx;
		background: $btn-base;
		border-radius: 44rpx 44rpx 44rpx 44rpx;
		font-size: 36rpx;
		line-height: 88rpx;
		text-align: center;
		font-weight: 500;
		color: #FFFFFF;
	}
	.live-navstyle {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		width: 95%;
		margin: 0 auto;
		height: auto;
		
	}
	.live-nav-itemstyle {
		background: rgba(0,0,0,0.5);
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		width: 30%;
		margin:2% 1%;
		color: #fff;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		font-size: 14px;
		font-weight: 500;
	}
	
	.activestyle {
		background: $bg-color-base;
		border: 2rpx solid rgba(255,255,255,0.5);
		
	}
	
	
	.top-header-title {
		margin: 69px 0 5px;
		text-align: center;
		font-size: 24px;
		font-weight: bold;
		color: #FFFFFF;
	}

	.searchbox {
		background: rgba(0, 0, 0, 0.5);
		border-radius: 22px;
		margin: 0 45px;
		padding: 12px 20px;

		.searchimage {
			width: 20px;
			height: 20px;

			image {
				width: 20px;
				height: 20px;
			}
		}

		.searchinput {
			margin-left: 12px;

			input {
				background: none;
				color: white;
			}
		}
	}
	

</style>