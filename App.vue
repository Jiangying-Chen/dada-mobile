<script>
    import websocket from '@/utils/websocket.js';
	import $store from '@/store/index.js';
	export default {
		onLaunch: function() {
			uni.hideTabBar();
			
			let startParamObj = wx.getLaunchOptionsSync();
			if(wx.canIUse('getUpdateManager')&& startParamObj.scene!=1154){
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					if(res.hasUpdate){
					  updateManager.onUpdateReady(function(){
						wx.showModal({
						  title:'更新提示',
						  content:'新版本已经下载好，是否重启当前应用？',
						  success(res){
							if(res.confirm){
							  updateManager.applyUpdate()
							}
						  }
						})
					  })
					  updateManager.onUpdateFailed(function (){
						wx.showModal({
						  title:'发现新版本',
						  content:'请删除当前小程序，重启搜索打开...',
						})
					  })
					}
				})
			}else{
			      // wx.showModal({
			      //   title:'更新提示',
			      //   content:'当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
			      // })
			     // return
			}
			
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
			that.$isResolve()
			
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
							websocket.initConnect();
							//获取好友列表
							$store.dispatch('getFriendList');
							///获取通知消息
							$store.dispatch('getNoticeList');
							uni.hideLoading();
							
						})
					}else if(res2.code==999){
						console.log('手机号未绑定')
						uni.setStorageSync("hasLogin", false);
						uni.setStorageSync("token", null);
						$store.state.token = null;
						uni.setStorageSync("userInfo", {})
						
						uni.hideLoading();
						// uni.navigateTo({
						// 	url:'/pages/user/login'
						// })
						
						
					}
					
				})
			  }
			});
			
			//获取任务列表
			this.$H.get("point/task/getMyTaskList/" + $store.state.loginUserInfo.uid).then(res => {
				console.log('----任务列表res',res)
				if(res.code==0){
					let result = res.result;
					if(result.length>0){
						//在线任务
						this.globalData.onLineObj = result.filter(v=>v.type=='online')[0];
						//邀请新人
						this.globalData.newPeopleObj = result.filter(v=>v.type=='invite_new')[0];   //alreadyNum:1 ,
						//黑洞助手提问
						this.globalData.askObj = result.filter(v=>v.type=='black_hole_qa')[0]; 
					}
				}
			})
			
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
				websocket.initConnect();
				//获取好友列表
				$store.dispatch('getFriendList');
				///获取通知消息
				$store.dispatch('getNoticeList');
			}
			
			
			let starTime = new Date().getTime();
			this.globalData.starTime = starTime;
			console.log('this.globalData.starTime',this.globalData.starTime)
			//pointTaskValue 分钟
			if(this.globalData.onLineObj && this.globalData.onLineObj.taskStatus!='COMPLETED'){
				console.log('this.globalData.onLineObj',this.globalData.onLineObj)  //this.globalData.onLineObj.pointTaskValue
				let time = 5*60000;
				let timer = setTimeout(()=>{
						this.$H.post(`point/task/complete/-1?alreadyNum=5&type=online`).then(res => {
							console.log('res',res)
						})
				},time)
			    
			}
			
		},
		onHide: function() {
			// if(this.globalData.onLineObj && this.globalData.onLineObj.taskStatus!='COMPLETED'){
			// 	let lastTime = new Date().getTime()
			// 	let onlineTime = Math.floor(Math.abs(lastTime-this.globalData.starTime)/60000);  //分钟
				
			// 	this.$H.post(`point/task/complete/-1?alreadyNum=${onlineTime}&type=online`).then(res => {
			// 		console.log('res',res)
			// 	})
			// }
			

		},
		globalData: {
		  isOpen: 1,//是否关闭视频功能 默认1开启 0关闭
		  statusBarHeight: 0, // 状态导航栏高度
		  navHeight: 0, // 总体高度
		  navigationBarHeight: 0, // 导航栏高度(标题栏高度)
		  starTime:0,
		  onLineObj:{},
		  newPeopleObj:{},
		  askObj:{},
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
