<template>
	<view style="position: relative;" class="mainbg">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="添加好友"
			:isback="true"></top-nave>
		<view class="searchbox uni-flex uni-row">
			<view class="searchimage">
				<image src="https://mallwj.hm-myy.cn/169113249064520230804150130.png" mode=""></image>
			</view>
			<view class="searchinput" style="flex: 1 1 0%;">
				<input type="text" v-model="keyword" placeholder="搜索昵称" @blur="searchPost"  />
			</view>
		</view>
		<view class="applylist" v-if="searchList.length>0">
			<view class="personview uni-flex uni-row" style="justify-content: space-between;"  v-for="item in searchList">
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
		<view class="msg-empty" v-else>
			<text class="txt">暂无搜索结果</text>
		</view>
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
			<view class="informationShow-box">
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
			...mapGetters(['loginUserInfo'])
		},
		components: {
			topNave
		},
		data() {
			return {
				navigationBarHeight: 0,
				statusBarHeight: 0,
				domain: this.$H.domain,
				isApplyList:[],
				notation: '',
				message: '',
				openPop: false,
				userInfo:{},
				keyword:'',
				searchList:[]
			};
		},
		onLoad() {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			//重新获取连接websocket
			if (!$store.state.isSocketOpen) {
				websocket.initConnect()
			}
			// console.log(this.noticeList)
			// this.deleteNotice(98)
			this.getApplyList()
		},
		onShow() {
			if (!$store.state.isSocketOpen&&uni.getStorageSync('hasLogin')) {
				websocket.initConnect()
			}
		},
		methods: {
			searchPost(){
				// 搜索
				if(this.keyword != ''){
					this.$H.get("user/search", {
						keyword: this.keyword,
						page: 1
					}).then(res => {
						
						this.searchList = res.result.data;
								
					})
				}else{
					this.searchList = []
				}
				
			},
			getApplyList(){
				this.$H.get("user/recommend/friend", {
					uid: uni.getStorageSync("userInfo").uid,
					page: 1
				}).then(res => {
					
					this.isApplyList = res.result.content;
							
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

<style lang="scss">
	.searchbox {
		background: rgba(0, 0, 0, 0.5);
		border-radius: 22px;
		margin: 0 16px;
		padding: 12px 20px;
	
		.searchimage {
			width: 20px;
			height: 20px;
	
			image {
				width: 20px;
				height: 20px;
			}
		}
	
		.searchinput {
			margin-left: 12px;
	
			input {
				background: none;
				color: white;
			}
		}
	}
	.to-add{
		margin: 12px 17px;
		border-radius: 20px 20px 20px 20px;
		border: 1px solid #FFFFFF;
		font-size: 16px;
		font-weight: 400;
		color: #FFFFFF;
		text-align: center;
		padding: 13rpx 0;
	}
	.top_tite{
		margin: 12px 17px;
		font-size: 14px;
		font-weight: 500;
		color: #FFFFFF;
	}
	
	.msg-empty{
		  display: flex;
		  flex-direction: column;
		  align-items:center ;
		  min-height: 100rpx;
		  
		  .txt{
			  color: white;
			  font-size: 28rpx;
			  margin-top: 20rpx;
		  }
	}
	
	.applylist{
		margin: 0 17px;
		.personview{
			background: #06407A;
			border-radius: 8px 8px 8px 8px;
			padding: 20px 10px 16px 16px;
			margin-bottom: 12px;
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
						color: #FFFFFF;
						// margin-bottom: 9px;
					}
				
					.info-time {
						font-size: 12px;
						font-weight: 400;
						color: rgba(255, 255, 255, 0.6);
					}
				}
				
			}
			
			.right-btn{
				margin-left: 15px;
				margin-top: 10px;
				.btn-agree{
					font-size: 12px;
					font-weight: 400;
					color: #FFFFFF;
					padding: 0px 12px;
					background: #00B127;
					border-radius: 18px 18px 18px 18px;
					line-height: 24px;
					height: 24px;
				}
				.btn-refuse{
					font-size: 12px;
					font-weight: 400;
					color: #FFFFFF;
					padding: 0px 12px;
					background: #CE0303;
					border-radius: 18px 18px 18px 18px;
					margin-right: 9px;
					line-height: 24px;
					height: 24px;
				}
				.btn-add{
					height: 27px;
					background: #03D7FC;
					border-radius: 14px 14px 14px 14px;
					padding: 0 12px;
					font-size: 12px;
					font-weight: 500;
					color: #06407A;
					line-height: 27px;
				}
			}
		}
	}
	.flex-items {
		display: flex;
		align-items: center;
	}
	.flex-column {
		flex-direction: column
	}
	.flex-row-plus {
		display: flex;
		flex-direction: row
	}
	.mar-top-30 {
		margin-top: 30upx;
	}
	
	.mar-top-60 {
		margin-top: 60upx;
	}
	.mar-left-40 {
		margin-left: 40upx;
	}
	.informationShow-box {
		.flex-items {
			input {
				padding-left: 16upx;
			}
		}
	
		.phoneStyle {
			input {
				background: #EEEEEE;
				color: #999999;
			}
		}
	
		.informationShow-centent {
			width: 520upx;
			height: 550upx;
	
			.remark {
				border: 1upx solid #DDDDDD;
				width: 300upx;
				height: 48upx;
			}
	
			.nick {
				border: 1upx solid #DDDDDD;
				width: 300upx;
				height: 48upx;
			}
	
			.massageDes-but {
				position: absolute;
				bottom: 0;
			}
	
			.exitBut {
				border: 1upx solid #E5E5E5;
				width: 260upx;
				height: 90upx;
				text-align: center;
				line-height: 90upx;
			}
	
			.submitbut {
				background-color: #323232;
				width: 260upx;
				height: 90upx;
				text-align: center;
				line-height: 90upx;
				color: #FFFFFF;
			}
		}
	}
</style>