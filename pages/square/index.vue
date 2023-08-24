<template>
	<view class="bgbox" >
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="黑洞助手"></top-nave>
		<!-- <top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="基地"></top-nave> -->
		<view class="wait">
			功能正在开发中...
		</view>
		<lf-tabbar :active="1"></lf-tabbar>
	</view>
</template>

<script>
	import topNave from '@/components/nav-header/index.vue';
	export default {
		
		components: {
			topNave
		},
		data() {
			return {
				navigationBarHeight: 0,
				statusBarHeight: 0,
			};
		},
		
		onLoad() {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			
		},
		onShow() {
		},
		
		methods: {
			
		}
	};
</script>

<style lang="less">
	.wait{
		font-size: 28px;
		text-align: center;
		color: #fff;
		margin-top: 200px;
	}
</style>