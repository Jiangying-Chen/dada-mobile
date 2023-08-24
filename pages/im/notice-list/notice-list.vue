<template>
	<view>
		<view v-if="noticeList.length>0" style="color: darkgrey;margin-left: 20rpx;font-size: 30rpx;margin-top: 20rpx;">全部通知消息</view>

		<view class="list" v-if="noticeList.length>0">
			<view v-for="(item,index) in noticeList" :key="index">
				<view style="display: flex;padding: 20rpx;height: 180rpx;">
					<view style="margin-left: 10rpx;" @click="toUserHome(item)">
						<u-avatar shape="square" size="80" fontSize="26"
							:src="getUserAvatar(item)"
							bgColor="#FEA356"></u-avatar>
					</view>
					<view style="margin-left: 30rpx;">
						<text style="font-size: 25rpx;">{{showDetail(item)}}</text>
					</view>
					<view style="width: 40%;display: flex;margin-right: auto;position: absolute; right: 0;">
						<button class="notice-btn hasRead" @click="check(item.id)"
							v-if="!item.isRead&&item.type==='reject'">
							已读
						</button>
						<button class="notice-btn delete" @tap="deleteNotice(item.id)" v-if="item.isRead">
							删除
						</button>
						<button class="notice-btn agree" @click="agree(item)" v-if="!item.isRead&&item.type!=='reject'">
							同意
						</button>
						<button class="notice-btn refuse" @click="reject(item.id)"
							v-if="!item.isRead&&item.type!=='reject'">
							拒绝
						</button>
					</view>
				</view>

				<u-line color="#c8c8c8"></u-line>
			</view>
		</view>
		<block v-if="noticeList.length == 0">
			<view class="msg-empty">
				<image class="img" mode="widthFix" src="/static/empty.png"></image>
				<text class="txt">暂无通知</text>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import $store from '@/store/index.js';
	import websocket from '@/utils/websocket.js';
	export default {
		computed: {
			...mapGetters(['loginUserInfo', 'noticeList'])
		},
		data() {
			return {
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
			}
		},
		onLoad() {
			//重新获取连接websocket
			if (!$store.state.isSocketOpen) {
				websocket.initConnect()
			}
			//从新获取消息列表
			$store.dispatch('getNoticeList')
			console.log(this.noticeList)
		},
		onShow() {
			if (!$store.state.isSocketOpen&&uni.getStorageSync('hasLogin')) {
				websocket.initConnect()
			}
		},

		methods: {

			check(id) {
				this.$H.post("notice/readById", {
					id: id
				}).then(res => {
					$store.dispatch('getNoticeList')
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
						$store.dispatch('getNoticeList')
					}

				})
			},

			deleteNotice(id) {
				this.$H.post("notice/delete", {
					id: id
				}).then(res => {
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					})
					$store.dispatch('getNoticeList')
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
						websocket.initConnect()
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
			getUserAvatar(item){
				let info = JSON.parse(item.information)
				if(info.senderAvatar){
					return info.senderAvatar;
				}
				return "";
			},
			toUserHome(item) {
				let info = JSON.parse(item.information)
				uni.navigateTo({
					url: '/pages/user/home?uid=' + item.senderId
				})
			},
			showDetail(item) {
				let info = JSON.parse(item.information)
				switch (item.type) {
					case 'person-apply':
						return '验证信息:' + info.applyMessage
						break;
					case 'reject':
						return '拒绝消息(来自:' + info.senderName + ')'
						break;
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	.msg-empty{
		  display: flex;
		  flex-direction: column;
		  align-items:center ;
		  min-height: 800rpx;
		  .img{
			 width: 200rpx;
			 margin-top: 100rpx;
		  }
		  .txt{
			  color: #999;
			  font-size: 20rpx;
			  margin-top: 20rpx;
		  }
	}
	.notice-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		color: #ffffff;
		margin-top: 80rpx;

	}

	.agree {
		background-color: #45b50e;
	}

	.refuse {
		background-color: #d61111;
	}

	.delete {
		background-color: #888383;
	}

	.hasRead {
		background-color: #ff5500;
	}
</style>
