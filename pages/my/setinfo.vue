<template>
	<view style="position: relative;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="宇宙飞船中心" :isback="true"></top-nave>
		<view class="mainbg">
			<image class="bgimage" src="https://mallwj.hm-myy.cn/168991908596520230721135805.png" mode="aspectFill"></image>
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
		<view class="hexiao" @click="hexiao" v-if="verStatus==true">
			<image src="https://xiaoyuan.pujinetwork.com/bbs/20230905/5e96902211014ec5891c62c6ea6a80ff.png" mode="widthFix" style="width: 120rpx; height: 120rpx;"></image>
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
				verStatus:false,
			};
		},

		onLoad(options) {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			
		},
		onShow(){
			this.getUserInfo()
		},
		mounted: function() {
			
		},
		methods: {
			//获取用户信息
			getUserInfo(){
				this.$H.get("user/userInfo").then(res => {
					
					this.verStatus = res.result.verStatus;
					console.log('获取用户信息res',this.verStatus)
				})
			},
			navePageTo(url){
				uni.navigateTo({
					url:url
				})
			},
			hexiao(){
				uni.scanCode({
					//scanType: ['barCode'],
					success:(res)=> {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						if(res.result){
							let con = res.result.split('&');
							let barcode = con[0];
							let num = con[1];
							this.$H.post(`pointOrder/use/${barcode}?useNum=${num}`).then(res => {
								console.log('res',res)
								if(res.code==0){
									this.$f.toast('核销成功')
								}else{
									this.$f.toast('核销失败，可能已核销过了')
								}
							})
						}
					}
				});
				
			}
		},
	};
</script>

<style scoped lang="less">
	.hexiao{
		position: absolute;
		left: 300rpx;
		bottom: 100rpx;
		padding: 25rpx;
	}
	.mainbg{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
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
