<script>
	//import websocket from '@/utils/websocket.js';
	import $store from '@/store/index.js';
	export default {
		onLaunch: function() {
			uni.hideTabBar();
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
			});

			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});

			});

			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
			});
			// 状态栏高度
			this.globalData.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			
			// #ifdef MP-WEIXIN
			// 获取微信胶囊的位置信息 width,height,top,right,left,bottom
			const custom = wx.getMenuButtonBoundingClientRect()
			this.globalData.navigationBarHeight = custom.height + (custom.top - this.globalData.statusBarHeight) * 2
			// #endif
			// #ifdef APP-PLUS || H5
			this.globalData.navigationBarHeight = 55
			// #endif
			// 总体高度 = 状态栏高度 + 导航栏高度
			this.globalData.navHeight = this.globalData.navigationBarHeight + this.globalData.statusBarHeight
			
			this.$H.get('user/isOpen').then(res => {
				this.globalData.isOpen=res.result;
			});
			let that = this;
			// 强制登录
			uni.showLoading({
				title: '正在登录中...',
				mask: true,
			});
			
			uni.login({
			  provider: 'weixin',
			  success: function (loginRes) {
				
			    console.log(loginRes);
				that.$H.post('user/miniWxLogin', {
					code: loginRes.code,
				}).then(res2 => {
					
					if (res2.code === 0) {
						uni.setStorageSync("hasLogin", true);
						uni.setStorageSync("token", res2.token);
						$store.state.token = res2.token;
						// uni.switchTab({
						// 	url: '/pages/index/index'
						// });
						// uni.navigateBack();
						
						that.$H.get("user/userInfo").then(res => {
							$store.state.loginUserInfo = res.result;
							uni.setStorageSync("userInfo", res.result)
							//连接websocket
							//websocket.initConnect();
							//获取好友列表
							$store.dispatch('getFriendList');
							///获取通知消息
							$store.dispatch('getNoticeList');
							uni.hideLoading();
							that.$isResolve()
						})
					}else if(res2.code==999){
						// console.log('手机号待获取')
						uni.hideLoading();
						uni.navigateTo({
							url:'/pages/login/login'
						})
						
					}
					
				})
			  }
			});
			
		},
		onShow: function() {
			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			//#endif
			if(uni.getStorageSync('hasLogin')){
				//连接websocket
				//websocket.initConnect();
				//获取好友列表
				$store.dispatch('getFriendList');
				///获取通知消息
				$store.dispatch('getNoticeList');
			}
		},
		onHide: function() {

		},
		globalData: {
		  isOpen: 1,//是否关闭视频功能 默认1开启 0关闭
		  statusBarHeight: 0, // 状态导航栏高度
		  navHeight: 0, // 总体高度
		  navigationBarHeight: 0, // 导航栏高度(标题栏高度)
		}
	};
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import "static/css/iconfont.css";

	page {
		font-size: 32rpx;
		line-height: 1.7;
		background:$themes-color;
	}

	.container {
		padding: 20rpx;
		overflow: hidden;
	}

	// 发布按钮
	.plus-box {
		background-color: $themes-color;
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 60rpx;
		right: 30rpx;
		z-index: 999;
		box-shadow: 0 0 10rpx #333;
	}

	.plus-box:active {
		background-color: #999;
	}

	.f-wrap {
		padding: 20rpx;
		border-radius: 10rpx;
		box-shadow: 5rpx 5rpx 20rpx #e6e6e6;
		background-color: #FFFFFF;
		margin-bottom: 20rpx;
	}

	.f-wrap>.title {
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.f-fixed {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 20rpx 20rpx 50rpx 20rpx;
		z-index: 999;
		background-color: #fff;
	}

	/* 隐藏滚动条 */
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}
	
	// 布局样式
	.uni-flex{
		display: flex;
	}
	// 横向布局
	.uni-row{
		flex-direction: row;
	}
</style>
