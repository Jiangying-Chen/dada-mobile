<template>
	<view class="" style="position: relative;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="编辑资料" :isback="true"></top-nave>
		
		
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
			
		},
	};
</script>

<style scoped lang="less">
	
	
</style>
