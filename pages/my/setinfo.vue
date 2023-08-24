<template>
	<view class="" style="position: relative;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="宇宙飞船中心" :isback="true"></top-nave>
		<view class="mainbg">
			<image class="bgimage" src="https://mallwj.hm-myy.cn/168991908596520230721135805.png" mode="widthFix"></image>
			<view class="optview uni-flex uni-row" style="justify-content: center;">
				<view class="imgboxs" @tap="navePageTo('/pages/user/edit-info/edit')">
					<image  src="https://mallwj.hm-myy.cn/168991914369220230721135903.png" mode="widthFix"></image>
				</view>
				<view class="imgboxs" style="margin: 80px 2%;"  @tap="navePageTo('/pages/my/privacy')">
					<image  src="https://mallwj.hm-myy.cn/168991908582020230721135805.png" mode="widthFix"></image>
				</view>
				<view class="imgboxs" @tap="navePageTo('/pages/my/kefu')">
					<image  src="https://mallwj.hm-myy.cn/168991908582720230721135805.png" mode="widthFix"></image>
				</view>
			</view>
			
		</view>
		
	</view>
</template>
<script>
	import topNave from '@/components/nav-header/index.vue';
	export default {
		name: "Confirm",
		components: {
			topNave
		},
		props: {},
		data: function() {
			return {
				
				navigationBarHeight: 0,
				statusBarHeight: 0,
			};
		},

		onLoad(options) {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			
		},
		mounted: function() {
			
		},
		methods: {
			navePageTo(url){
				uni.navigateTo({
					url:url
				})
			}
		},
	};
</script>

<style scoped lang="less">
	.mainbg{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		.bgimage{
			width: 100%;
			height: 100%;
		}
		.optview{
			position: absolute;
			top: 600rpx;
			width:95%;
			left:2.5%;
			.imgboxs{
				width: 28%;
			}
			image{
				width: 100%;
			}
		}
	}
	
</style>
