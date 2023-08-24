<template>
	<view class="" style="position: relative;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="隐私设置" :isback="true"></top-nave>
		
		<view class="mainbg">
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="">
					隐藏我的动态
				</view>
				<view class="rightview">
					<switch checked color="#3AB501" style="transform:scale(0.7)"/>
				</view>
			</view>
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="">
					隐藏我的相册
				</view>
				<view class="rightview">
					<switch checked color="#3AB501" style="transform:scale(0.7)"/>
				</view>
			</view>
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="">
					接收陌生人消息
				</view>
				<view class="rightview">
					<switch checked color="#3AB501" style="transform:scale(0.7)"/>
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
			
		},
	};
</script>

<style scoped lang="scss">
	.infoview{
		margin:12px 12px;
		background: $bg-color-light;
		border-radius: 8px 8px 8px 8px;
		padding: 12px 16px;
		font-size: 14px;
		font-weight: 400;
		color: $text-color-base;
		.des{
			font-size: 12px;
			font-weight: 400;
			color:  $text-color-assist;
		}
		.rightview{
			text-align: right;
			.time{
				font-size: 12px;
				font-weight: 400;
				color:  $text-color-assist;
				padding-bottom: 12px;
			}
			span{
				font-size: 14px;
				font-weight: 400;
				color: #FFDA44;
				margin-left: 6px;
			}
			image{
				width: 96px;
				height: 96px;
			}
		}
	}
	
</style>
