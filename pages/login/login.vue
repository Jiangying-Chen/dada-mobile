<template>
	<view style="position: relative;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="授权登录" :isback="true"></top-nave>
		<view class="login">
			<image class="logo" src="https://mallwj.hm-myy.cn/169104903858020230803155038.png" mode="widthFix"></image>
			<!-- <text class="txt1">申请获取手机号登录</text>
			<text class="txt2">根据《网络安全法》等规定发帖评论等需要先绑定手机号哦</text> -->
			
			<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" 
			style="background: #03D7FC;color: #06407A;width:100%;border-radius: 44rpx;">
			授权登录</button>
			<!-- <text class="txt3" @click="goBack">暂不登录</text> -->
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
				navigationBarHeight: 0,
				statusBarHeight: 0,
				domain: this.$H.domain,
				shareCover: ""
			};
		},
		onLoad() {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			this.getSysInfo();
			this.login();
		},
		methods: {
			goBack() {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},
			getSysInfo() {
				this.$H.get("system/miniConfig").then(res => {
					this.shareCover = res.result.intro;
				})
			},
			async login() {

				// uni.showLoading({
				// 	mask: true,
				// 	title: '登录中'
				// });

				let that = this;

				let loginCode = await this.getLoginCode();
				that.$H.post('user/miniWxLogin', {
					code: loginCode,
				}).then(res2 => {
					if (res2.code === 0) {
						uni.setStorageSync("hasLogin", true);
						uni.setStorageSync("token", res2.token);
						$store.state.token = res2.token;
						// uni.switchTab({
						// 	url: '/pages/index/index'
						// });
						uni.navigateBack();
						that.getUserInfo();
						
					}else if(res2.code==999){
						console.log('手机号待获取')
						uni.hideLoading();
					}
					
				})
			},
			getUserInfo() {
				this.$H.get("user/userInfo").then(res => {
					$store.state.loginUserInfo = res.result;
					uni.setStorageSync("userInfo", res.result)
					//连接websocket
					websocket.initConnect();
					//获取好友列表
					$store.dispatch('getFriendList');
					///获取通知消息
					$store.dispatch('getNoticeList');
				})
			},
			getLoginCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							resolve(loginRes.code);
						}
					});
				});
			},
			
			getPhoneNumber(e) {
				console.log(e)
				if (e.detail.errMsg === "getPhoneNumber:ok") {
					console.log(e)
					uni.login({
						provider: 'weixin',
						success: (res) => {
							this.$H.post('user/getSessionKey', {
								code: res.code
							}).then(res1 => {
								if (res1.code == 0) {
									this.$H.post('user/bindWxPhone', {
										wechatOpenId: res1.openid,
										sessionKey: res1.session_key,
										encryptedData: e.detail.encryptedData,
										iv: e.detail.iv,
									}).then(res2 => {
										uni.setStorageSync("hasLogin", true);
										uni.setStorageSync("token", res2.result.token);
										this.getUserInfo();
										uni.navigateTo({
											url:'/pages/login/interest'
										})
										// uni.navigateBack({});
									})
								}
							})
			
						},
						fail: () => {
							uni.showToast({
								title: "微信登录授权失败",
								icon: "none"
							});
						}
					})
				} else {
					uni.showToast({
						title: "获取手机授权失败",
						icon: "none"
					});
				}
			
			},
			// getUserProfile() {
			// 	return new Promise((resolve, reject) => {
			// 		wx.getUserProfile({
			// 			lang: 'zh_CN',
			// 			desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			// 			success: res => {
			// 				resolve(res.userInfo);
			// 			}
			// 		});
			// 	});
			// }

		}
	}
</script>

<style lang="scss">
	.login {
		display: flex;
		flex-direction: column;
		padding: 100rpx;
	}

	.login .logo {
		width: 100%;
		// height: 220px;
		margin: 100px auto 100px;
	}

	.login .txt1 {
		margin-bottom: 10rpx;
	}

	.login .txt2 {
		color: #ffffff;
		margin-bottom: 50rpx;
	}

	.login .txt3 {
		color: #8c8c8c;
		margin-bottom: 90rpx;
		text-align: center;
	}

	.user-avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		overflow: hidden;
		margin: 50rpx auto;
	}

	.user-name {
		font-size: 35rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000;
		margin: 50rpx auto;
	}
</style>
