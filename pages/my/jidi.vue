<template>
	<view class="" style="position: relative;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="基地"></top-nave>
		<view class="mainbg">
			<image src="https://mallwj.hm-myy.cn/168991570243520230721130142.png" mode="widthFix"></image>
			
			<view class="viewbox" :style="{marginTop:   statusBarHeight + 40 + 'px'}">
				<view class="wxdview btnview" @tap="navePageTo('/pages/message/message')">
					<image src="https://mallwj.hm-myy.cn/168991564210420230721130042.png" mode="widthFix"></image>
					<view class="viewtitle">
						星际无线电
					</view>
				</view>
				<view class="lxview btnview" @tap="navePageTo('/pages/message/addmessage')">
					<image src="https://mallwj.hm-myy.cn/168991564210020230721130042.png" mode="widthFix"></image>
					<view class="viewtitle">
						流星讯息
					</view>
				</view>
				<view class="kcview btnview" @tap="navePageTo('/pages/minerals/index')">
					<image src="https://mallwj.hm-myy.cn/168991564209820230721130042.png" mode="widthFix"></image>
					<view class="viewtitle">
						矿产
					</view>
				</view>
				<view class="fcview btnview" @tap="navePageTo('/pages/my/setinfo')">
					<image src="https://mallwj.hm-myy.cn/168991564211620230721130042.png" mode="widthFix"></image>
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

<style scoped lang="less">
	.mainbg{
		position: absolute;
		top:0;
		width:100%;
		height:100%;
		z-index:-1;
		image{
			width: 100%;
		}
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
					font-size: 12px;
					font-weight: 400;
					color: #FFFFFF;
					width: 100px;
					margin-top: -30px;
				}
			}
			.wxdview{
				top: 0;
				left: 27px;
				image{
					width: 170px;
					height: 135px;
				}
				.viewtitle{
					margin-left: 35px;
				}
				
			}
			.lxview{
				top: 206rpx;
				right: 0px;
				image{
					width: 166px;
					height: 159px;
				}
				.viewtitle{
					margin-left: 33px;
				}
			}
			.kcview{
				top: 710rpx;
				right: 7px;
				image{
					width: 135px;
					height: 133px;
				}
				.viewtitle{
					margin-left: 17px;
				}
			}
			.fcview{
				top: 878rpx;
				left:-15px;
				image{
					width: 292px;
					height: 172px;
				}
				.viewtitle{
					margin-left: 88px;
				}
			}
		}
	}
	
</style>
