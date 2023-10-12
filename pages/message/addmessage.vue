<template>
	<view style="position: relative;" >
		<!-- class="mainbg" -->
		<!-- <top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="流星讯息"
			:isback="true"></top-nave> -->
			<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="流星讯息"  title-color='#333'
						:isback="true"></top-nave>
		<view class="to-add" @tap="pageToFriend()">
			+ 添加好友
		</view>
		<!-- @我的 -->
		<view>
			<view class="top_tite">
				@我的
			</view>
			<view class="applylist" v-if="noticeList.length>0">
				<view class="personview uni-flex uni-row" style="justify-content: space-between;"  v-for="item in callList" @click="navToDetail(item)">
					<view class="uni-flex uni-row personinfo">
						<view class="left-image">
							<image :src="getUserAvatar(item)" mode=""></image>
						</view>
						<view class="left-info" style="flex: 1 1 0%;">
							<view class="info-name">
								{{getUserName(item)}}
							</view>
							<view class="info-time">
								快来看看我发的帖子吧
							</view>
						</view>
					</view>
					<view class="right-btn uni-flex uni-row">
						<view class="btn-add">
						     查看
						</view>
						
					</view>
				</view>
			</view>
			<view class="msg-empty" v-else>
				<text class="txt">暂无消息</text>
			</view>
			
		</view>
		
		<!-- 好友申请 -->
		<view class="top_tite">
			好友申请
		</view>
		<view class="applylist" v-if="addList.length>0">
			<view class="personview uni-flex uni-row" style="justify-content: space-between;"  v-for="item in addList">
				<view class="uni-flex uni-row personinfo">
					<view class="left-image">
						<image :src="getUserAvatar(item)" mode=""></image>
					</view>
					<view class="left-info" style="flex: 1 1 0%;">
						<view class="info-name">
							{{getUserName(item)}}
						</view>
						<view class="info-time">
							{{getUserMessage(item)}}
						</view>
					</view>
				</view>
				<view class="right-btn uni-flex uni-row">
					<view class="btn-refuse" @click="reject(item.id)" v-if="!item.isRead&&item.type!=='reject'">
						拒绝
					</view>
					<view class="btn-agree"  @click="agree(item)" v-if="!item.isRead&&item.type!=='reject'">
						同意
					</view>
				</view>
			</view>
		</view>
		<view class="msg-empty" v-else>
			<text class="txt">暂无好友申请</text>
		</view>
		
		<!-- 可能认识的人 -->
		<view class="top_tite">
			可能认识的人
		</view>
		<view class="applylist" v-if="isApplyList.length>0">
			<view class="personview uni-flex uni-row" style="justify-content: space-between;"  v-for="item in isApplyList">
				<view class="uni-flex uni-row personinfo">
					<view class="left-image">
						<image :src="item.avatar" mode=""></image>
					</view>
					<view class="left-info" style="flex: 1 1 0%;">
						<view class="info-name">
							{{item.username}}
						</view>
						<view class="info-time">
							{{item.intro}}
						</view>
					</view>
				</view>
				<view class="right-btn uni-flex uni-row">
					<view class="btn-add" @tap="open(item)">
						+ 好友
					</view>
				</view>
			</view>
		</view>
		
		<u-popup v-model="openPop" mode="center" border-radius="14">
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
	import {
		mapGetters
	} from 'vuex';
	import websocket from '@/utils/websocket.js';
	import $store from '@/store/index.js';
	import topNave from '@/components/nav-header/index.vue';
	
	export default {
		computed: {
			...mapGetters(['loginUserInfo', 'noticeList']),
			callList(){
				return this.noticeList.filter(v=>v.type=='at-friend');
			},
			addList(){
				return this.noticeList.filter(v=>v.type=='person-apply');
			}
		},
		components: {
			topNave
		},
		data() {
			return {
				navigationBarHeight: 0,
				statusBarHeight: 0,
				domain: this.$H.domain,
				indexList: [''],
				customStyle: {
					// 注意驼峰命名，并且值必须用引号包括，因为这是对象
					width: '20%',
					height: '50upx',
					fontSize: '20rpx'
				},
				customStyle2: {
					// 注意驼峰命名，并且值必须用引号包括，因为这是对象
					width: '20%',
					marginLeft: '20upx',
					height: '50upx',
					fontSize: '20rpx'
				},
				isApplyList:[],
				notation: '',
				message: '',
				openPop: false,
				userInfo:{},
				
			};
		},
		onLoad() {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			//重新获取连接websocket
			if (!$store.state.isSocketOpen) {
				websocket.initConnect()
			}
			
			this.getApplyList()
		},
		onShow() {
			if (!$store.state.isSocketOpen&&uni.getStorageSync('hasLogin')) {
				websocket.initConnect()
			}
			//从新获取消息列表
			$store.dispatch('getNoticeList')
			
		},
		methods: {
			//查看帖子详情
			navToDetail(item){
				let postId = JSON.parse(item.information).postId;
				this.$H.post(`notice/readById/${item.id}`).then(res => {
					uni.navigateTo({
						url: '/pages/post/detail?id=' + postId
					});
							
				})
			},
			pageToFriend(){
				uni.navigateTo({
					url: '/pages/message/searchmessage'
				})
			},
			getUserAvatar(item){
				let info = JSON.parse(item.information)
				if(info.senderAvatar){
					return info.senderAvatar;
				}
				return "";
			},
			getUserName(item){
				let info = JSON.parse(item.information)
				if(info.senderName){
					return info.senderName;
				}
				return "";
			},
			getUserMessage(item){
				let info = JSON.parse(item.information)
				if(info.applyMessage){
					return info.applyMessage;
				}
				return "";
			},
			getApplyList(){
				this.$H.get("user/recommend/friend", {
					uid: uni.getStorageSync("userInfo").uid,
					page: 1
				}).then(res => {
					
					this.isApplyList = res.result.content;
							
				})
			},
			reject(id) {
				this.$H.post("notice/reject", {
					id: id,
					senderName: this.loginUserInfo.username,
					senderAvatar: this.loginUserInfo.avatar
				}).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '操作成功',
							icon: 'none'
						})
						that.deleteNotice(id);
						$store.dispatch('getNoticeList')
					}
			
				})
			},
			agree(item) {
				if (item.type == 'person-apply') {
					this.agreePersonApply(item.id)
					return
				}
			},
			agreePersonApply(id) {
				let that = this
				//构造websocket消息
				let msg = {
					type: 'person-apply-agree',
					data: {
						id: id
					}
				}
				uni.sendSocketMessage({
					data: JSON.stringify(msg),
					fail(res) {
						websocket.initConnect();
						that.deleteNotice(id);
						setTimeout(function() {
						    that.retry(id);
						}, 1200);
					}
				})
			},
			retry(id){
				console.log('尝试重连')
				let msg = {
					type: 'person-apply-agree',
					data: {
						id: id
					}
				}
				uni.sendSocketMessage({
					data: JSON.stringify(msg),
					fail(res) {
						uni.showToast({
							icon: 'error',
							title: '操作失败,请重试'
						})
						websocket.initConnect()
					}
				})
			},
			deleteNotice(id) {
				this.$H.post("notice/delete", {
					id: id
				}).then(res => {
					// uni.showToast({
					// 	title: '删除成功',
					// 	icon: 'none'
					// })
					$store.dispatch('getNoticeList')
				})
			},
			
			// 添加好友
			open(row) {
				this.userInfo = row;
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
						that.openPop = false;
						that.getApplyList();
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
						that.openPop = false;
						that.getApplyList();
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
		}
	}
</script>
<style>
	page{
		background-color: white;
	}
</style>
<style lang="scss" scoped>
	.to-add{
		margin: 12px 17px;
		border-radius: 20px 20px 20px 20px;
		border: 1px solid $btn-base;
		font-size: 16px;
		font-weight: 400;
		color: $btn-base;
		text-align: center;
		padding: 13rpx 0;
	}
	.top_tite{
		margin: 12px 17px;
		font-size: 14px;
		font-weight: 500;
		color: $text-color-black;
	}
	
	.msg-empty{
		  display: flex;
		  flex-direction: column;
		  align-items:center ;
		  min-height: 100rpx;
		  
		  .txt{
			  color: $text-color-assist;
			  font-size: 28rpx;
			  margin-top: 20rpx;
		  }
	}
	
	.applylist{
		margin: 0 32rpx;
		.personview{
			background: $bg-color-light;
			border-radius: 8px 8px 8px 8px;
			padding: 20px 10px 16px 16px;
			margin-bottom: 12px;
			color:$text-color-base;
			.personinfo{
				.left-image {
					width: 40px;
					height: 40px;
					border-radius: 20px;
					overflow: hidden;
					image {
						width: 40px;
						height: 40px;
					}
				}
				.left-info {
					margin-left: 8px;
				
					.info-name {
						font-size: 14px;
						font-weight: 500;
						color:$text-color-base;
					}
				
					.info-time {
						font-size: 12px;
						font-weight: 400;
						color:$text-color-assist;
					}
				}
				
			}
			
			.right-btn{
				margin-left: 15px;
				margin-top: 10px;
				.btn-agree{
					font-size: 12px;
					font-weight: 400;
					color: $text-color-white;
					padding: 0px 12px;
					background: $btn-success;
					border-radius: 18px 18px 18px 18px;
					line-height: 24px;
					height: 24px;
				}
				.btn-refuse{
					font-size: 12px;
					font-weight: 400;
					color: $text-color-white;
					padding: 0px 12px;
					background: $btn-error;
					border-radius: 18px 18px 18px 18px;
					margin-right: 9px;
					line-height: 24px;
					height: 24px;
				}
				.btn-add{
					height: 27px;
					background: $btn-base;
					border-radius: 14px 14px 14px 14px;
					padding: 0 12px;
					font-size: 12px;
					font-weight: 500;
					color: $text-color-white;
					line-height: 27px;
				}
			}
		}
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