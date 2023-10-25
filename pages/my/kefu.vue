<template>
	<view class="" style="position: relative;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="客服反馈" :isback="true"></top-nave>
		<view class="mainbg">
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="">
					客服电话
				</view>
				<view class="rightview">
					<view class="">
						不想被打扰，目前还没有
					</view>
					<!-- <view class="time">
						工作日7:00-21:00
					</view> -->
				</view>
			</view>
			
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="">
					客服微信
				</view>
				<view class="rightview">
					tongwenzhe
					<span @tap="copyFont('tongwenzhe')">复制</span>
				</view>
			</view>
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="">
					<view class="">
						微信二维码
					</view>
					<view class="des">
						长按识别加微信
					</view>
				</view>
				<view class="rightview">
					<image src="https://xiaoyuan.pujinetwork.com/bbs/20230906/4d0c040e38724a1b8f4d4b496f9b88d3.jpg " mode="" show-menu-by-longpress></image>
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
			copyFont(row){
				uni.setClipboardData({
					data:row,
					success: () => {
						console.log('复制成功')
					}
				})
			}
		},
	};
</script>

<style scoped lang="scss">
	.infoview{
		margin:12px 12px;
		background:$bg-color-light;
		border-radius: 8px 8px 8px 8px;
		padding: 12px 16px;
		font-size: 14px;
		font-weight: 400;
		color: $text-color-base;
		.des{
			font-size: 12px;
			font-weight: 400;
			color: $text-color-assist;
		}
		.rightview{
			text-align: right;
			.time{
				font-size: 12px;
				font-weight: 400;
				color: $text-color-assist;
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
