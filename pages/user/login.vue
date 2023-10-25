<template>
	<view style="position: relative;height: 100vh;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="授权登录" :isback="true"></top-nave>
		<view class="login">
			<image class="logo" src="https://mallwj.hm-myy.cn/169104903858020230803155038.png" mode="widthFix"></image>
			<!-- <text class="txt1">申请获取手机号登录</text>
			<text class="txt2">根据《网络安全法》等规定发帖评论等需要先绑定手机号哦</text> -->
			
			<button class="loginBtn" v-if="!agreement" @click="showMess">授权登录</button>
			<button v-else open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="loginBtn">
			授权登录</button>
			<!-- <text class="txt3" @click="goBack">暂不登录</text> -->
		</view>
		<!-- <view class="agreement">
			<image v-if="!agreement" src="../../static/images/none.png" mode="" @click="agreement=true"></image>
			<image v-else src="../../static/images/solid.png" mode="" @click="agreement=false"></image>
			<view>
				<text class="font-color-999">我已阅读并同意</text>
				<text style="color: #6322EF;" @click="protocol('protocol')">《用户服务协议与隐私政策》</text>
			</view>
		</view> -->
		
		<u-popup v-model="showPrivacy"  :mask-close-able='false' mode="center" :round="10">
		      <view class="popup">
		           <view class="title">隐私保护指引</view>
				   <view class="content">在使用当前小程序服务之前，请仔细阅读 <text @tap="openPrivacy" class="link">{{privacyContractName}}</text>。
				        如果您同意{{privacyContractName}}，请点击"同意"开始使用。
				   </view>
				   <view class="flex-box">
					   <view class="refuse" @click="refuse">拒绝</view>
					   <button id="agree-btn" open-type="getPhoneNumber|agreePrivacyAuthorization" @agreeprivacyauthorization="handleAgreePrivacyAuthorization" @getphonenumber="getPhoneNumber">同意</button>
				   </view>
		      </view>
		</u-popup>
		
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
				shareCover: "",
				agreement:false,
				privacyContractName:'',
				showPrivacy:true,
			};
		},
		onLoad() {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			this.getSysInfo();
			this.login();
			
			console.log('版本',this.$u.config.version);
			wx.getPrivacySetting({
			  success: res => {
			    console.log('隐私协议---res',res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
				this.privacyContractName = res.privacyContractName
			    if (res.needAuthorization==false) {
			      // 需要弹出隐私协议
					 this.showPrivacy = true;
			    } else {
			         // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
					 this.showPrivacy = false;
			    }
			  },
			  fail: () => {},
			  complete: () => {}
			})
		},
		methods: {
			//打开隐私协议页面
			openPrivacy(e){
				console.log('打开隐私协议页面',e)
					uni.navigateTo({
						url:'/pages/login/privacy'
					})
			},
			handleAgreePrivacyAuthorization(){
				this.$store.commit('SET_ISJUMP',false)
				console.log('用户同意隐私协议事件回调')
			},
			refuse(){
				this.showPrivacy = false;
				uni.switchTab({
					url:'/pages/index/index'
				})
				 this.$store.commit('SET_ISJUMP',true)
			},
			
			
			// goBack() {
			// 	uni.reLaunch({
			// 		url: '/pages/index/index'
			// 	});
			// },
			getSysInfo() {
				this.$H.get("system/miniConfig").then(res => {
					this.shareCover = res.result.intro;
				})
			},
			async login() {
				let that = this;
				let loginCode = await this.getLoginCode();
				that.$H.post('user/miniWxLogin', {
					code: loginCode,
				}).then(res2 => {
					$store.commit('SET_ISDISABLED',false)
					if (res2.code === 0) {
						uni.setStorageSync("hasLogin", true);
						uni.setStorageSync("token", res2.token);
						console.log("res2.token",res2.token)
						setTimeout(()=>{
						$store.state.token = res2.token;	
						},500)
						//uni.navigateBack();
						that.getUserInfo();
					}else if(res2.code==999){
						console.log('手机号待获取')
						uni.hideLoading();
					}else if(res2.code==500){ //账号被禁用
						if(res2.msg=='该账号已被禁用'){
							$store.commit('SET_ISDISABLED',true)
						}
						
					}
					
				})
			},
			getUserInfo() {
				this.$H.get("user/userInfo").then(res => {
					$store.state.loginUserInfo = res.result;
					uni.setStorageSync("userInfo", res.result)
					//连接websocket
					// websocket.initConnect();
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
			showMess(){
				uni.showToast({
					title: '请先阅读并同意《用户服务协议与隐私政策》',
					duration: 2000,
					icon: 'none'
				});
				
			},
			getPhoneNumber(e) {
					if (e.detail.errMsg === "getPhoneNumber:ok") {
						console.log(e)
						uni.login({
							provider: 'weixin',
							success: (res) => {
								this.$H.post('user/getSessionKey', {
									code: res.code,
								}).then(res1 => {
									if (res1.code == 0) {
										this.$H.post('user/bindWxPhone', {
											wechatOpenId: res1.openid,
											sessionKey: res1.session_key,
											encryptedData: e.detail.encryptedData,
											iv: e.detail.iv,
											wechatUnionId:res1.unionid
										}).then(res2 => {
											uni.setStorageSync("hasLogin", true);
											uni.setStorageSync("token", res2.result.token);
											this.getUserInfo();
											setTimeout(()=>{
												uni.navigateBack();
											},500)
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
			// },
			//跳转到隐私服务协议
			protocol(type) {
				uni.navigateTo({
					url: './protocol?type=' + type
				})
			},

		}
	}
</script>
<style>
	page{
		background-color: #0F0158;
	}
</style>
<style lang="scss" scoped>
	.popup{
		width: 630rpx;
	    padding: 50rpx;
		.title{
			text-align: center;
			font-size: 36rpx;
			font-weight: 800;
		}
		.content{
			font-weight: 400;
			font-size: 28rpx;
			line-height: 44rpx;
			margin:50rpx 0;
			.link{
				color: #4cd964;
				text-decoration: underline;
				cursor: pointer;
			}
		}
		.flex-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
			.refuse{
				width: 45%;
				background-color: #f3f3f3;
				color: #888;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 8px;
			}
			#agree-btn{
				width: 45%;
				background-color: #4cd964;
				color: #fff;
				height: 80rpx;
				margin: 0;
				padding: 0;
				line-height: 80rpx;
				border-radius: 8px;
			}
		}
	}
	
	.agreement {
		position: absolute;
		bottom: 120rpx;
		left: 70rpx;
		right: 0;
		display: flex;
		align-items: center;
		line-height: 50rpx;
	    font-size: 24rpx;
        font-weight: 500;
		color:#fff;
		
		image {
			width: 36rpx;
			height: 36rpx;
			margin-right: 15upx;
		}
	}
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
	
	.loginBtn{
		background-color: $btn-base;
		color: $text-color-white;
		width:100%;
		border-radius: 44rpx;
	}
</style>
