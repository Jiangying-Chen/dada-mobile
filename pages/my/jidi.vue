<template>
	<view class="boxs" style="position: relative;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="基地"></top-nave>
		<view class="mainbg">
			<!-- <image src="https://mallwj.hm-myy.cn/169285662329720230824135703.png" mode="widthFix" style="width: 100%; height: 100%;"></image> -->
			
			<view class="viewbox" :style="{marginTop:   statusBarHeight + 40 + 'px'}">
				<view class="wxdview btnview" @tap="navePageTo('/pages/message/message')">
					<image src="https://mallwj.hm-myy.cn/169285674648320230824135906.png" mode="widthFix"></image>
					<view class="viewtitle">
						星际无线电
					</view>
				</view>
				<view class="lxview btnview" @tap="navePageTo('/pages/message/addmessage')">
					<image src="https://mallwj.hm-myy.cn/169285676542720230824135925.png" mode="widthFix"></image>
					<view class="viewtitle">
						流星讯息
					</view>
				</view>
				<view class="kcview btnview" @tap="navePageTo('/pages/minerals/index')">
					<image src="https://mallwj.hm-myy.cn/169285670617620230824135826.png" mode="widthFix"></image>
					<view class="viewtitle">
						矿产
					</view>
				</view>
				<view class="fcview btnview" @tap="navePageTo('/pages/my/setinfo')">
					<image src="https://mallwj.hm-myy.cn/169285678396920230824135943.png" mode="widthFix"></image>
					<view class="viewtitle">
						宇宙飞船中心
					</view>
				</view>
			</view>
		</view>
		
		<lf-tabbar :active="4" ></lf-tabbar>
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

<style scoped lang="scss">
	
	/*背景    https://mallwj.hm-myy.cn/169285662329720230824135703.png
	 矿石     https://mallwj.hm-myy.cn/169285670617620230824135826.png
	 小飞船   https://mallwj.hm-myy.cn/169285674648320230824135906.png
	 流星     https://mallwj.hm-myy.cn/169285676542720230824135925.png
	 大飞船   https://mallwj.hm-myy.cn/169285678396920230824135943.png
	*/
   .boxs{
	   background:url('https://mallwj.hm-myy.cn/169285662329720230824135703.png') 100% 100%;
	   width: 100vw;
	   height: 96vh;
	   background-size: cover;
	   overflow: hidden;
	   
   }
	.mainbg{
		// position: absolute;
		// top:0;
		// width:100%;
		// height:100%;
		// z-index:-1;
		// image{
		// 	width: 100%;
		// }
		.viewbox{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			.btnview{
				position: absolute;
				.viewtitle{
					background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 29%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0) 100%);
					text-align: center;
					font-size: 24rpx;
					font-weight: 400;
					color: #FFFFFF;
					width: 100px;
					//margin-top: -70rpx;
				}
			}
			.wxdview{
				top: 50rpx;
				left: 86rpx;
				image{
					width: 260rpx;
					height: 192rpx;
				}
				.viewtitle{
					margin-top: 0;
					margin-left: 60rpx;
				}
				
			}
			.lxview{
				top: 66rpx;
				right: 0;
				image{
					width: 332rpx;
					height: 318rpx;
				}
				.viewtitle{
					margin-top: -30rpx;
					margin-left: -10rpx;
				}
			}
			.kcview{
				top: 520rpx;
				right:98rpx;
				image{
					width: 135px;
					height: 133px;
				}
				.viewtitle{
					margin-top: -30rpx;
					margin-left: 77rpx;
				}
			}
			.fcview{
				top: 900rpx;
				left:0;
				image{
					width: 638rpx;
					height: 316rpx;
				}
				.viewtitle{
					margin-top: -70rpx;
					margin-left: 250rpx;
				}
			}
		}
	}
	
</style>
