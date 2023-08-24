<template>
	<view>
		<view class="head">
			<view class="user-info">
				<image mode="aspectFill" class="avatar" :src="userInfo.avatar"></image>
				<view class="right" v-if="userInfo.vip==1">
					<view class="name">{{userInfo.username}},尊贵的会员您好</view>
					<text class="txt">您的会员到期时间为：{{userInfo.vipExpireTime}}</text>
				</view>
				<view class="right" v-else>
					<view class="name">{{userInfo.username}}</view>
					<text class="txt">您还不是VIP会员哦~</text>
				</view>
			</view>
		</view>
		<!-- 会员充值选项 -->
		<view class="item-choose">
			<view class="option-wrap">
				<view class="option-item" @click="activeIndex = index" :class="{'active':activeIndex == index}"
					v-for="(item,index) in vipList" :key="index">
					<text class="type-txt">{{item.name}}</text>
					<view class="price-box">
						<text class="vip-money">￥</text>
						<text class="num">{{item.price}}</text>
					</view>
					<view class="month-price">{{item.remark}}</view>
					<view class="month-price" style="background-color: #37414b;">限时优惠</view>
				</view>
			</view>
			<view class="agreement">
				<text>开通会员即代表同意此协议</text>
				<navigator url="/pages/user/protocol?type=app_vip_recharge_context">《会员服务协议》</navigator>
			</view>
			
			<view class="pay-btn" v-if="userInfo.vip==0" @click="onPay">立即开通</view>
			<view class="pay-btn" v-else @click="onPay">立即续费</view>
		</view>
		<!-- 会员权益 -->
		<view class="quanyi">
			<view class="b-head">会员权益</view>
			<view class="grid-wrap">
				<view class="vip-desc-item">
					<image mode="aspectFill" src="../../../static/vip/v_6.png"></image>
					<text class="title">积分特权</text>
					<text class="sub">尊享积分奖励{{integralNum}}倍特权</text>
				</view>
				<view class="vip-desc-item">
					<image mode="aspectFill" src="../../../static/vip/v_2.png"></image>
					<text class="title">改名次数</text>
					<text class="sub">更改昵称次数：{{renameCount}}次/月</text>
				</view>
				<view class="vip-desc-item">
					<image mode="aspectFill" src="../../../static/vip/v_3.png"></image>
					<text class="title">圈子数量</text>
					<text class="sub">每位会员可创建{{topicNum}}个圈子</text>
				</view>
				<view class="vip-desc-item">
					<image mode="aspectFill" src="../../../static/vip/v_4.png"></image>
					<text class="title">专属标志</text>
					<text class="sub">会员专属身份标识</text>
				</view>
				<view class="vip-desc-item">
					<image mode="aspectFill" src="../../../static/vip/v_1.png"></image>
					<text class="title">广告过滤</text>
					<text class="sub">会员自动过滤页面广告</text>
				</view>
				<view class="vip-desc-item">
					<image mode="aspectFill" src="../../../static/vip/v_5.png"></image>
					<text class="title">更多权益</text>
					<text class="sub">发现更多会员权益</text>
				</view>
				<view style="color: #fff;height: 30px;">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				activeIndex: 0,
				vipList: [],
				orderId: 0,
				renameCount: 0,
				integralNum: 0,
				topicNum: 0,
				type: ""
			};
		},
		onLoad() {
			this.getIsOpen();
			this.getUserInfo();
			this.getVipList();
			this.getVipConfig();
		},
		methods: {
			getIsOpen(){
				this.$H.get('system/vipShow').then(res => {
					if(res.vipShow=='1'){
						this.$u.toast("会员模块未开启");
						setTimeout(function() {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}, 1000);
					}
				});
			},
			getVipConfig() {
				this.$H.get("vip/vipConfig").then(res => {
					this.renameCount = res.renameCount;
					this.integralNum = res.integralNum;
					this.topicNum = res.topicNum;
				})
			},
			onPay() {
				let that = this;
				uni.showLoading({
					mask: true,
					title: "处理中"
				})
				// #ifdef APP-PLUS
				this.type = "app"
				// #endif
				// #ifdef H5
				this.type = "h5"
				let ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
				  uni.showToast({
				    icon: 'none',
				    title: '请用微信外浏览器打开支付'
				  })
				  return;
				}
				// #endif
				// #ifdef MP-WEIXIN
				this.type = "weixin"
				// #endif
				this.$H.post("vip/rechargeVip", {
					vipId: this.vipList[this.activeIndex].id,
					payType: this.type
				}).then(res => {
					that.orderId = res.result
					if (res.code == 0) {
						this.$H.post("vip/pay", {
							orderId: that.orderId,
							payType: that.type
						}).then(res => {
							uni.hideLoading()
							console.log("miniprogram:" + res.data)
							// #ifdef MP-WEIXIN
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: res.data.timeStamp,
								nonceStr: res.data.nonceStr,
								package: res.data.package,
								signType: res.data.signType,
								paySign: res.data.paySign,
								success: function(payRes) {
									uni.showToast({
										icon: 'none',
										title: '支付成功'
									})
									that.getUserInfo();
									uni.navigateTo({
										url: '/pages/user/vip/vip'
									})
								},
								fail: function(err) {
									uni.showToast({
										icon: 'none',
										title: '支付取消'
									})
									uni.navigateTo({
										url: '/pages/user/vip/vip'
									})
			
								}
							})
							// #endif
							
							// #ifdef APP-PLUS
							let str = res.data.package
							var index = str.lastIndexOf("\=");
							str = str.substring(index+1,str.length);
							var obj = {
							  appid: res.data.appId,
							  noncestr: res.data.nonceStr,
							  package: 'Sign=WXPay',
							  prepayid: str,
							  timestamp: res.data.timeStamp,
							  sign: 'MD5',
							  partnerid: res.data.partnerId
							}
							uni.requestPayment({
							  provider: 'wxpay',
							  orderInfo: obj,
							  success: function(payRes) {
							    uni.showToast({
							      icon: 'none',
							      title: '支付成功'
							    })
								that.getUserInfo();
							    uni.navigateTo({
							      url: '/pages/user/vip/vip'
							    })
							  },
							  fail: function(err) {
							    console.log(err)
							    uni.showToast({
							      icon: 'none',
							      title: '支付取消'
							    })
							  }
							})
							// #endif
							
							// #ifdef H5
							location.replace(res.data.mwebUrl)
							// #endif

						}).catch((err) => {
							console.log(err);
							uni.showToast({
								title: err.msg,
								icon: "none",
								duration: 2000,
							});
							// #ifdef H5
							uni.navigateTo({
							  url: '/pages/user/vip/vip'
							})
							// #endif
						});
					}
					uni.hideLoading();
				})
			},
			getVipList() {
				this.$H.get("vip/vipList").then(res => {
					this.vipList = res.result;
				})
			},
			getUserInfo() {
				this.$H.get('user/userInfo').then(res => {
					this.userInfo = res.result;
				});
			},
		}
	}
</script>
<style>
	page {
		background-color: #F5F5F5;
	}
</style>
<style lang="scss" scoped>
	.head {
		padding: 100rpx 30rpx;
		background: url('https://pic.linfeng.tech/test/20221103/65aa4934ff204371bd3ae731b9cf95cb.png') no-repeat;
		.user-info {
			color: #fff;
			display: flex;

			.avatar {
				width: 110rpx;
				height: 110rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.right {
				.name {
					font-size: 36rpx;
				}

				.txt {
					border-radius: 100rpx;
					font-size: 20rpx;
				}
			}
		}
	}

	.item-choose {
		background-color: #fff;
		margin: 30rpx;
		border-radius: 20rpx;
		padding: 20rpx;

		.option-wrap {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 20rpx;

			.option-item {
				border: 1px solid #999;
				border-radius: 10rpx;
				padding: 50rpx 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;

				.price-box {
					color: #fa5051;

					.vip-money {
						font-size: 20rpx;
					}

					.num {
						font-size: 40rpx;
						font-weight: bold;
					}
				}

				.month-price {
					font-size: 24rpx;
					color: #999;
				}

				.activi-txt {
					position: absolute;
					left: -1px;
					top: -1px;
					background-color: #fa5051;
					color: #fff;
					font-size: 20rpx;
					padding: 5rpx 10rpx;
					border-radius: 10rpx 0 10rpx 0;
				}
			}

			.active {
				background-color: #f5ebe2;
				border: 1px solid #dabca5;
			}
		}

		.pay-btn {
			padding: 20rpx;
			border-radius: 100rpx;
			background-image: linear-gradient(to right, #f4e4cb, #e9caad, #dfb492);
			color: #3d3f42;
			margin-top: 30rpx;
			text-align: center;
		}
	}

	.agreement {
		font-size: 24rpx;
		color: #999;
		margin: 30rpx 0;

		navigator {
			display: inline-block;
			color: #2B85E4;
		}
	}

	// 权益
	.quanyi {
		margin: 30rpx;
		border-radius: 20rpx;
		background-color: #fff;

		.b-head {
			background-color: #3d3f42;
			color: #e2bda0;
			padding: 20rpx;
			border-radius: 20rpx 20rpx 0 0;
		}

		.grid-wrap {
			margin-top: 30rpx;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-gap: 60rpx 20rpx;
			padding: 20rpx;

			.vip-desc-item {
				display: flex;
				flex-direction: column;
				align-items: center;

				image {
					width: 100rpx;
					height: 100rpx;
					margin-bottom: 10rpx;
				}

				.title {
					color: #000;
					font-size: 28rpx;
				}

				.sub {
					color: #616161;
					font-size: 20rpx;
				}
			}
		}
	}
</style>
