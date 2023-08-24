<template>
	<view>
		<view class="container">
			<!-- header -->
			<view class="header">
				<view class="txt">
					付费贴需要支付
				</view>
				<view class="num">
					<text class="tag">¥</text>{{ post.pay || 0 }}
				</view>
			</view>
			<!-- body -->
			<view class="body">
				<view class="title">
					标题
				</view>
				<view class="content">
					{{post.title}}
				</view>
			</view>
			<!-- footer -->
			<view class="footer">
				<view v-if="enough" class="btn"  @click="payVipPost">
					立即支付
				</view>
				<view v-else class="btn"  @click="goRecharge">
					去充值
				</view>
				<view class="tips">
					提示：支付后即可查看付费帖详情，支付后不可退款
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: "Confirm",
		components: {},
		props: {},
		data: function() {
			return {
				enough: false,
				active: 0,
				money: "",
				now_money: "",
				picList: [],
				activePic: 0,
				numberPic: "",
				paid_price: "",
				rechar_id: 0,
				post: {},
				userInfo: {},
				postId: 0,
				type: 0,
				isBuy: false,
			};
		},

		onLoad(options) {
			this.postId = options.id;
			this.type = options.type;
		},
		mounted: function() {

			this.getUserInfo();
		},
		methods: {
			payVipPost() {
				var that = this;
				uni.showModal({
					title: '提示',
					content: '确定支付吗？',
					success: function(res) {
						if (res.confirm) {
							// console.log('用户点击确定');
							that.$H.post('user/payVipPost', {
								postId: that.postId
							}).then(res => {
								let url;
								if (that.type == 1 || that.type == 4) {
									url = '/pages/post/detail?id=' + that.postId;
								} else if (that.type == 2) {
									url = '/pages/post/video-detail?id=' + that.postId;
								}
								if (res.code == 0) {
									uni.navigateTo({
										url: url
									})
								}

							});
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},

			goRecharge() {
				uni.navigateTo({
					url: '/pages/pay/pay'
				})
			},

			getUserInfo() {
				this.$H.get('user/userInfo').then(res => {
					this.userInfo = res.result;
					this.now_money = this.userInfo.money;
					this.getVipPostInfo();
				});
			},

			getVipPostInfo() {
				this.$H.post('post/getVipPostInfo', {
					postId: this.postId,
					uid: this.userInfo.uid
				}).then(res => {
					this.post = res.result;
					this.isBuy = res.result.isBuy;
					if (res.result.isBuy) {
						let url;
						if (this.type == 1 || this.type == 4) {
							url = '/pages/post/detail?id=' + this.postId;
						} else if (this.type == 2) {
							url = '/pages/post/video-detail?id=' + this.postId;
						}
						uni.navigateTo({
							url: url
						})
					} else {
						if (this.userInfo.money >= res.result.pay) {
							this.enough = true
						} else {
							uni.showToast({
								title: "余额不足，请充值",
								icon: "none",
								duration: 2000,
							});

						}
					}

				});
			},


		},
	};
</script>

<style scoped lang="less">
	.container {
		background-color: #f7f7f6;
		width: 100vw;
		height: 100vh;
		padding: 0;
		padding-top: 20rpx;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;

		.txt {
			font-size: 28rpx;
			font-weight: 450;
		}

		.num {
			font-size: 80rpx;
			font-weight: 450;

			.tag {
				font-size: 60rpx;
				margin-right: 10rpx;
			}
		}
	}

	.body {
		background-color: #fff;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;

		.title {
			color: #cac9ca;
		}

		.content {
			width: 550rpx;
			display: flex;
			justify-content: flex-end;
			overflow: auto;
		}

	}

	.footer {
		margin-top: 50rpx;
		
		.btn {
			width: 710rpx;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #28a840;
			color: #fff;
			border-radius: 10rpx;
			margin-left: 20rpx;
		}
		.tips {
			display: flex;
			justify-content: center;
			margin-top: 20rpx;
			font-size: 24rpx;
			color: #999;
			
		}
	}

	.tip {
		font-size: 0.28 * 100rpx;
		color: #797979;
		font-weight: 800;
		margin-bottom: 0.07 * 100rpx;
		margin-top: 30rpx;
	}


</style>
