<template>
	<view>
		<!-- class="bgbox" -->
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="黑洞助手"></top-nave>
		<!-- <top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="基地"></top-nave> -->
		<view class="myboxes">
			<view> 
			   <image class="code"  src="https://xiaoyuan.pujinetwork.com/bbs/20230901/fdeba5e8465746b790bda0481fe33217.jpg"></image>
			</view>
			<view class="title">扫码关注公众号 ，</view>
			<view class="title">在公众号回复“黑洞助手”，根据提示进行操作</view>
			<view class="label">可提问次数：{{myNumber}}次</view>
			<view class="flex-box" @click="showAdd">
				<image src="https://xiaoyuan.pujinetwork.com/bbs/20230901/2ce04d1b0d024ad098799a94595de6ec.png" class="icon-vd"></image>
				<view class="num" >增加提问次数</view>
		    </view>
		</view>
		
		
		<lf-tabbar :active="1"></lf-tabbar>
	</view>
</template>

<script>
	import topNave from '@/components/nav-header/index.vue';
	// 在页面中定义激励视频广告
	var videoAd = null;
	export default {
		components: {
			topNave
		},
		data() {
			return {
				navigationBarHeight: 0,
				statusBarHeight: 0,
				myNumber:0,
			};
		},
		computed:{
			askComplete(){
				return this.$store.state.askComplete;
			}
		},
		onLoad() {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			
			// 在页面onLoad回调事件中创建激励视频广告实例
			if (wx.createRewardedVideoAd) {
			  videoAd = wx.createRewardedVideoAd({
			    adUnitId: 'adunit-d2bf124482bc010e'
			  })
			  videoAd.onLoad(() => {})
			  videoAd.onError((err) => {})
			 // videoAd.onClose((res) => {})
			}
			
		},
		onShow(){
			this.getNum()
		},
		methods: {
			//查询剩余次数
			getNum(){
				this.$H.get(`chat/queryEffectiveCount `).then(res => {
					console.log('剩余次数res',res)
					if(res.code == 0){
						this.myNumber = res.result;
					}
				})
			},
			//接入广告
			showAdd(){
				// 用户触发广告后，显示激励视频广告
				if (videoAd) {
				  videoAd.show().catch(() => {
				    // 失败重试
				    videoAd.load()
				      .then(() => videoAd.show())
				      .catch(err => {
				        console.log('激励视频 广告显示失败')
				      })
				  })
				  
				  try{
						if(videoAd.closeHandler){
						  videoAd.offClose(videoAd.closeHandler);
						  console.log("videoAd.offClose卸载成功");
						}
					} catch (e) {
						console.log("videoAd.offClose 卸载失败");
						console.error(e);
					}
					videoAd.closeHandler=  (res)=> {
						// 用户点击了【关闭广告】按钮
						if (res && res.isEnded || res === undefined) {
							 console.log('正常播放结束，可以下发游戏奖励')
							this.addNum();
						} else {
							console.log('播放中途退出，不下发游戏奖励')
						}
					};
				 videoAd.onClose(videoAd.closeHandler);
				  
				}
				
				
			},
			
			//增加次数，看广告
			addNum(){
				this.$H.get(`chat/addEffectiveCount?count=5`).then(res => {
					console.log('增加次数res',res)
					if(res.code == 0){
						this.getNum()
						
						if(this.askComplete==false){
							this.$H.post(`point/task/complete/-1?alreadyNum=1&type=black_hole_qa`).then(res => {
								this.$store.commit('SET_ASKCOMPLETE',true)
							})
						}
						
					}
				})
			},
		}
	};
</script>

<style lang="less" scoped>
	.myboxes{
		padding: 200rpx 120rpx;
		text-align: center;
		color: #fff;
		.code{
			width: 324rpx;
			height: 324rpx;
			margin:0 auto;
			margin-bottom: 68rpx;
		}
		.title{
			font-size: 32rpx;
			font-weight: bold;
			color: #FFFFFF;
		}
		.flex-box{
			display: flex;
			align-items: center;
			justify-content: center;
			//width: 438rpx;
			width: 100%;
			height: 80rpx;
			background: linear-gradient(180deg, #6322EF 0%, #3E00C3 100%);
			box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(52,16,129,0.2);
			border-radius: 49rpx;
			.num{
				font-size: 32rpx;
				margin-left: 20rpx;
				font-weight: bold;
			}
		}
		.label{
			background: #7F7DEB;
			margin: 100rpx 0;
		}
		.icon-vd{
			width: 42rpx;
			height: 34rpx;
			background: #222222;
		}
	}
</style>