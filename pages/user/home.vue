<template>
	<view :style="{minHeight:allHeight+'px'}">
		<view class="back-wrap">
			<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="个人主页" :isback="true"></top-nave>
			<!-- 头部 -->
			<view class="page-top" >
				<view class="avatar">
					<image :src="userInfo.avatar"
						style="width: 144rpx;height: 144rpx;border-radius: 50%;">
					</image>
				</view>
				<view>
					<view style="font-size: 34rpx;font-weight: 600;line-height: 48rpx;margin-top: 30rpx;">
						{{ userInfo.username }}
					</view>
					<view style="font-size: 12px;font-weight: 400;margin-top: 26rpx;">
						<!-- 浙江大学/浙江工业大学/浙江师范大学 -->
						{{userInfo.strInfo}}
					</view>
					<view style="font-size: 24rpx;line-height: 33rpx;margin-top: 16rpx;">{{ userInfo.intro }}</view>
				</view>
				<!-- 圈子&关注&粉丝&编辑资料 按钮 -->
				<view class="some-btn uni-flex uni-row" style="justify-content: center;">
					<view v-if="currUid==uid" @click="goPersonalData()" class="edit-btn">
						编辑资料
					</view>
					
					<view v-if="currUid!=uid&&!userInfo.isFriend" class="chatButton" @click="open()">
						加好友
					</view>
					<view v-if="currUid!=uid&&userInfo.isFriend" class="chatButton" @click="gotoChat()">
						聊天
					</view>
					
				</view>

			</view>
			
			<!-- 底部 -->
			<view class="page-bottom">
				<view class="tabs" style="background: #0F0158;" :style="{top: navHeight*2 + 'rpx'}">
					<u-tabs :list="tabList" font-size="28" name="tabName" bg-color="none" :current="current"
						@change="tabChange" inactive-color="#ffffff" active-color="#ffffff" bar-height="6" bar-width="20"
						 height="40" >
					</u-tabs>
				</view>
				
				<view v-if="current === 0">
					<!-- #ifdef H5 -->
					<view v-if="postList.length ==0" style="background-color: #f7f7f7;height: 160rpx;"></view>
					<!-- #endif -->
					<post-list :list="postList" :loadStatus="loadStatus"></post-list>
				</view>
				<view v-if="current === 1">
					<view v-if="ImagesList.length ==0" >
						<u-empty margin-top="100" text="暂无内容" mode="favor"></u-empty>
					</view>
					<view v-if="ImagesList.length >0"  style="width: 96%;margin: 0 2%;flex-wrap: wrap; display: flex;justify-content: space-between;">
						<view v-for="(item,index) in ImagesList" :key="index" class="" style="">
							<view style="width: 45%;border-radius: 16rpx 16rpx 16rpx 16rpx;">
								<image :src="item.url" mode="aspectFill" style="width: 338rpx;height: 338rpx;border-radius: 16rpx 16rpx 16rpx 16rpx;"></image>
							</view>
						</view>
					</view>
					<!-- <post-list :list="postList" :loadStatus="loadStatus"></post-list> -->
				</view>
				
			</view>
		</view>

		<!-- 填写信息弹窗 -->
		<u-popup v-model="openPop" mode="center" border-radius="14">
			<!-- <view class="informationShow-box">
				<view class="flex-items flex-column informationShow-centent">
					<view class="mar-top-60">
						<label class="title">申请好友</label>
					</view>
					<view class="flex-items flex-row mar-top-60">
						<view class="fs26">备注</view>
						<input class="remark mar-left-20 fs26" v-model="message" />
					</view>
					<view class="flex-items flex-row mar-top-30 ">
						<label class="fs26">对方</label>
						<input class="nick mar-left-20 fs26" v-model="notation" disabled="disabled" />
					</view>
					<view class="flex-row-plus massageDes-but">
						<view class="exitBut" @click="outPop">取消</view>
						<view class="submitbut" @click="submitPop">提交</view>
					</view>
				</view>
			</view> -->
			
			<view class="informationShow-centent">
					<view class="title">申请添加好友</view>
					<view class="flex-items box">
						<view class="label-left">发送</view>
						<view class="label-right">{{notation}}</view>
					</view>
					<view class="flex-items box">
						<view class="label-left">备注</view>
						<view class="label-right"><input class="remark " v-model="message" /></view>
					</view>
					
					<view class="flex-footer">
						<view class="btns exitBut " @click="outPop">取消</view>
						<view class="btns submitbut" @click="submitPop">提交</view>
					</view>
			</view>
			
		</u-popup>
	</view>
</template>
<script>
	import postList from '@/components/post-list/post-list.vue';
	import topicList from '@/components/topic-list/topic-list.vue';
	import {
		mapGetters
	} from 'vuex';
	import $store from '@/store/index.js';
	import websocket from '@/utils/websocket.js';
	import topNave from '@/components/nav-header/index.vue';
	export default {
		computed: {
			...mapGetters(['friendList', 'loginUserInfo', 'sessionList'])
		},
		components: {
			postList,
			topicList,
			topNave
		},
		data() {
			return {
				ImagesList:[],
				loading: true,
				background: {
					backgroundColor: 'unset'
				},
				tabList: [
					{
						tabName: '动态'
					},
					{
						tabName: '相册'
					}
				],
				current: 0,
				uid: 0,
				postList: [],
				topicList: [],
				userInfo: {},
				userJson: "",
				loadStatus: "loading",
				page: 1,
				currUid: 0,
				statusBarHeight: 0,
				navigationBarHeight:0,
				navHeight: 0,
				navOpacity: 0,
				createTopicList: [],
				notation: '',
				message: '',
				openPop: false,
				allHeight:0
			};
		},
		onLoad(options) {
			this.navHeight = getApp().globalData.navHeight;
			// this.statusBarHeight = getApp().globalData.statusBarHeight;
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			uni.getSystemInfo({
				success: (res) => {
					this.allHeight = res.windowHeight;
				}
			})
			if (options.uid) {
				this.uid = options.uid;
			} else {
				if (uni.getStorageSync('userInfo').uid) {
					this.uid = uni.getStorageSync('userInfo').uid;
				}
			}
			this.postList = [];
			this.getUserInfo();
			if (uni.getStorageSync('userInfo').uid) {
				this.currUid = uni.getStorageSync('userInfo').uid;
			}
			if(!$store.state.isSocketOpen){
				websocket.initConnect()
			}
		},
		onShow() {
			this.postList = [];
			this.page = 1;
			if (uni.getStorageSync('hasLogin')) {
				this.getUserInfo();
				if (uni.getStorageSync('userInfo').uid) {
					this.currUid = uni.getStorageSync('userInfo').uid;
				}
				this.getPostList();
			} else {
				this.$f.toast('请先登录哦')
			}
			if (!$store.state.isSocketOpen&&uni.getStorageSync('hasLogin')) {
				websocket.initConnect()
			}
		},
		onReachBottom() {
			if (this.current == 0) {
				this.page++;
				this.getPostList();
			}
		},
		methods: {
			getFollow(){
				if(this.userInfo.isWatch){
					this.$f.toast('TA设置了私密哦')
					return
				}
				this.$f.jump('/pages/my/follow?uid='+this.userInfo.uid)
			},
			getFans(){
				if(this.userInfo.isFan){
					this.$f.toast('TA设置了私密哦')
					return
				}
				this.$f.jump('/pages/my/fans?uid='+this.userInfo.uid)
			},
			onBack() {
				let pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack();
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					});
				}
			},
			follow() {
				this.$H.post('user/addFollow', {
					id: this.userInfo.uid
				}).then(res => {
					if (res.code === 0) {
						this.userInfo.isFollow = true;
					} else {
						this.$u.toast(res.msg);
					}
				})
			},
			cancelFollow() {
				this.$H.post('user/cancelFollow', {
					id: this.userInfo.uid
				}).then(res => {
					if (res.code === 0) {
						this.userInfo.isFollow = false;
					}
				})
			},
			tabChange(index) {
				this.current = index;
				if (index === 0) {
					this.postList = [];
					this.page = 1;
					this.getPostList();
				}
			},
			getPostList() {
				if(this.userInfo.isPost){
					this.$f.toast('TA设置了私密哦')
					this.postList =[]
					this.loadStatus = "nomore";
					return
				}
				this.loadStatus = "loading";
				this.$H.post('post/list', {
					page: this.page,
					uid: this.uid,
					myUid: this.currUid
				}).then(res => {
					this.postList = this.postList.concat(res.result.data);
					console.log(this.postList,res.result.data,'this.postList===')
					// let arrList=this.postList[0].userInfo.userImages?JSON.parse(this.postList[0].userInfo.userImages):[];
					// this.ImagesList=arrList;
					// console.log(this.ImagesList,'====')
					if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				})
			},
			getTopicList() {
				this.$H.post('topic/userJoinTopic', {
					uid: this.uid
				}).then(res => {
					this.topicList = res.result.data;
				})
			},
			getUserInfo() {
				uni.showLoading({
					title:'加载中',
					mask:true
				})
				this.$H.post('user/userInfoById', {
					uid: this.uid
				}).then(res => {
					console.log(res,'====res')
					let arrList = JSON.parse(res.result.userImages)
					this.ImagesList = arrList;
					console.log(this.ImagesList,'====')
					let strInfo = res.result.tagStr.join('/');
					this.userInfo = res.result;
					this.userInfo.strInfo = strInfo;
					if (res.result.gender === 1) {
						this.userInfo.gender = '男'
					} else if (res.result.gender === 2) {
						this.userInfo.gender = '女'
					} else {
						this.userInfo.gender = '保密'
					}
					if (this.userInfo.createTopicList != null) {
						this.createTopicList = this.userInfo.createTopicList
					}

					let user = {
						uid: res.result.uid,
						username: res.result.username,
						avatar: res.result.avatar,
					}
					this.userJson = JSON.stringify(user)
					uni.setNavigationBarTitle({
						title: this.userInfo.username
					});
					uni.hideLoading();
					this.loading = false;
				})
			},
			goPersonalData() {
				uni.navigateTo({
					url: '/pages/user/edit-info/edit'
				});
			},
			onPageScroll(e) {
				// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
				this.scrollTop = e.scrollTop;
				// 滚动175rpx显示nav
				this.navOpacity = e.scrollTop / 50;
			},
			goIntegral() {
				uni.navigateTo({
					url: '/pages/sign/integral'
				})
			},
			goAccount() {
				uni.navigateTo({
					url: '/pages/account/account'
				})
			},
			goFollow() {
				uni.navigateTo({
					url: '/pages/my/follow'
				})
			},
			open() {
				this.openPop = true
				this.notation = this.userInfo.username
				//处理偶尔取不到当前用户信息的问题
				if(!this.loginUserInfo.username){
					if(uni.getStorageSync('userInfo').username){
						this.$store.state.loginUserInfo=uni.getStorageSync('userInfo')
					}else{
						this.$H.get('user/userInfo').then(res => {
							this.$store.state.loginUserInfo = res.result;
							this.message = '你好,我是' + res.result.username
						});
					}
				}
				this.message = '你好,我是' + this.$store.state.loginUserInfo.username
				
			},
			outPop(){
				this.openPop = false
			},
			//发送好友申请
			submitPop() {
				if (this.notation.trim() === '') {
					uni.showToast({
						title: '备注不允许为空',
						icon: 'none'
					})
					return
				}
				if (this.notation.trim().length > 20 || this.message.trim().length > 20) {
					uni.showToast({
						title: '字数不要超过20个字',
						icon: 'none'
					})
					return
				}
				if(!$store.state.isSocketOpen){
					websocket.initConnect()
				}
				if(!this.loginUserInfo.uid){
					uni.showToast({
						title: '你的账号信息过期请重新登录',
						icon: 'none'
					})
					return
				}
				//构造websocket消息
				let m = {
					senderId: this.loginUserInfo.uid,
					senderName: this.loginUserInfo.username,
					senderAvatar: this.loginUserInfo.avatar,
					receiverId: this.userInfo.uid,
					notation: this.notation.trim(),
					applyMessage: this.message.trim()
				}
				let msg = {
					type: 'person-apply',
					data: m
				}
				let that = this
				uni.sendSocketMessage({
					data: JSON.stringify(msg),
					success() {
						uni.showToast({
							icon: 'success',
							title: '发送成功'
						})
						that.openPop = false
					},
					fail(res) {
						websocket.initConnect()
						setTimeout(function() {
						    that.retrySubmit();
						}, 1200);
					}
				})
			},
			//尝试重连
			retrySubmit(){
				console.log('尝试重连')
				let m = {
					senderId: this.loginUserInfo.uid,
					senderName: this.loginUserInfo.username,
					senderAvatar: this.loginUserInfo.avatar,
					receiverId: this.userInfo.uid,
					notation: this.notation.trim(),
					applyMessage: this.message.trim()
				}
				let msg = {
					type: 'person-apply',
					data: m
				}
				let that = this
				uni.sendSocketMessage({
					data: JSON.stringify(msg),
					success() {
						uni.showToast({
							icon: 'success',
							title: '发送成功'
						})
						that.openPop = false
					},
					fail(res) {
						uni.showToast({
							icon: 'none',
							title: '发送失败,请重试'
						})
						websocket.initConnect()
					}
				})
			},
			//跳转聊天页面
			gotoChat(){
				for(let i=0;i<this.sessionList.length;i++){
					if(this.sessionList[i].chattingUserId==this.userInfo.uid)
					{
						$store.state.chattingUserInfo = this.sessionList[i]
						break;
					}
				}
				this.$H.post('chat/list', {
					sessionId: $store.state.chattingUserInfo.sessionId,
					pageNum: 1,
					pageSize: 20
				}).then(res => {
					if (res.code == 0) {
						let data = res.data
						for (let i = 0; i < $store.state.personMessage.length; i++) {
							if ($store.state.personMessage[i].sessionId == data.sessionId) {
								let current = Number(data.pageInfo.current)
								let total = Number(data.pageInfo.total)
								let size = Number(data.pageInfo.size)
								$store.state.personMessage[i].lastMessageId = data.pageInfo.records
									.length != 0 ? data.pageInfo.records[0].id : 0
								$store.state.personMessage[i].list = data.pageInfo.records.reverse()
								$store.state.personMessage[i].pageNum = current
								$store.state.personMessage[i].hasNextPage = current * size < total
								break;
							}
						}
						uni.navigateTo({
							url:'/pages/im/chat/chat'
						})
					}else{
						uni.showToast({
							icon:'none',
							mask:'消息加载失败'
						})
					}
				})
				
			},
		}
	}
</script>
<style lang="scss">
	page {
		background-color: $bg-color-black;
	}
</style>
<style lang="scss" scoped>
	.back-wrap {
		background: url('https://mallwj.hm-myy.cn/168992454831520230721152908.png') no-repeat;
		background-size: 750rpx 700rpx;
		padding-bottom: 80rpx;
	}

	.page-top {
		// width: 750rpx;
		// height: 700rpx;
		padding: 30rpx;
		color: $text-color-base;
		margin: 159px 12px 0;
		background: $bg-color-light;
		border-radius: 8px 8px 8px 8px;
		text-align: center;
		.setting {
			z-index: 999;
			background-color: #ffffff;
			width: 750rpx;
			position: fixed;
			top: 0;
			left: 0;
			padding-left: 50rpx;

			.setting-inner {
				display: flex;
				align-items: center;

				.nav-nickname {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 590rpx;
					font-size: 24rpx;
					font-weight: 500;
					color: #000000;
				}
			}

		}

		.setting-o {
			background-color: transparent;
		}

		.avatar {
			// margin-top: 115rpx;
			margin: -36px auto 0;
		}

		.some-btn {
			display: flex;
			align-items: center;
			margin-top: 42rpx;

			.num-name {
				width: 116rpx;

				.num {
					font-size: 32rpx;
					font-weight: 600;
					line-height: 45rpx;
				}

				.name {
					margin-top: 2rpx;
					font-size: 20rpx;
					line-height: 28rpx;
				}
			}

			.edit-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 184rpx;
				height: 54rpx;
				line-height: 54rpx;
				background-color: $text-color-purple;
				border: 2rpx solid $border-color;
				border-radius: 100rpx;
				font-size: 24rpx;
				font-weight: 600;
				color: $text-color-white;
			}

			.watch-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				// margin-left: 60rpx;
				width: 124rpx;
				height: 54rpx;
				background-color: $btn-base;
				border: 2rpx solid $border-color;
				border-radius: 100rpx;
				font-size: 24rpx;
				font-weight: 600;
			}

			.follow-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				// margin-left: 60rpx;
				width: 124rpx;
				height: 54rpx;
				//background-color: #f5f5f5;
				color: $text-color-purple;
				border: 2rpx solid $border-color;
				border-radius: 100rpx;
				font-size: 24rpx;
				font-weight: 600;
			}
            //加好友
			.chatButton {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 10rpx;
				width: 124rpx;
				height: 54rpx;
				line-height: 54rpx;
				background-color: $text-color-purple;
				border: 2rpx solid $border-color;
				border-radius: 100rpx;
				font-size: 24rpx;
				font-weight: 600;
				color: $text-color-white;
			}
		}
	}

	.page-mid {
		display: flex;
		justify-content: space-around;
		padding-top: 50rpx;
		margin-top: 42rpx;
		width: 750rpx;
		height: 180rpx;
		background-color: #F9F9F9;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;

		// transform: translateY(-108rpx);
		.one-btn {
			display: flex;
			flex-direction: column;
			align-items: center;

			.top {
				font-size: 28rpx;
				font-weight: 600;
				color: #333333;
				line-height: 40rpx;
			}

			.bottom {
				margin-top: 10rpx;
				font-size: 24rpx;
				line-height: 33rpx;
				color: #999999;
			}
		}
	}

	.page-bottom {

		// transform: translateY(-108rpx);
		.tabs {
			background-color: #ffffff;
			// position: sticky;
			top: 82rpx;
			// z-index: 99;
			display: flex;
			justify-content: center;
			padding-top: 60rpx;
			width: 750rpx;
		}
	}

	.f-wrap {
		margin-bottom: 30rpx;
	}

	.avatar {
		width: 144rpx;
		height: 144rpx;
		border-radius: 50%;
		z-index: 999;
	}

	.tab-box {
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}
	.tag-box .tag {
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		display: inline-block;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		background-color: #ffebe5;
	}

	.tag-box .tag:nth-child(2n) {
		background-color: #ecf9f2;
	}

	.tag-box .tag:nth-child(3n) {
		background-color: #fff7e5;
	}

	.tag-box .tag:nth-child(5n) {
		background-color: #b3e0ff;
	}

	.image3 {
		width: 0.50 * 100rpx;
		height: 0.50 * 100rpx;
		margin-left: 0.05 * 100rpx;
	}
	.flex-items {
		display: flex;
		align-items: center;
	}
	
	.flex-row-plus {
		display: flex;
		flex-direction: row
	}
	
	.informationShow-centent {
			width: 580rpx;
			height: 480rpx;
			.title{
				font-size: $font-size-lg;
				font-weight: bold;
				color: $text-color-black;
				text-align: center;
				margin: 42rpx auto;
			}
			.box{
				margin-bottom: 40rpx;
				.label-left{
					width: 140rpx;
					font-size: $font-size-base;
					font-weight: 400;
					color: #000000;
					text-align: center;
					
				}
				.label-right{
					flex:1;
					.remark {
						border: 2rpx solid #D9D9D9;
						width: 360rpx;
						height: 66rpx;
						line-height: 66rpx;
						border-radius: 16rpx;
						padding: 0 20rpx;
					}
				}
			}
			
	
		.flex-footer{
			display: flex;
			padding: 26rpx 32rpx;
			justify-content: space-between;
			align-items: center;
			.btns{
				width: 220rpx;
				height: 64rpx;
				text-align: center;
				//line-height: 64rpx;
				border-radius: 32rpx ;
				border: 1upx solid $btn-base;
			}
			.exitBut {
				background:$text-color-white;
				color: $btn-base;
			}
			.submitbut {
				background:$btn-base;
				color: $text-color-white;
			}
		}
	}
</style>
