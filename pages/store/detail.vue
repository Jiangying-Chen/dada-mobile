<template>
	<view class="bgbox">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="商品详情"
			:isback="true"></top-nave>
		<view class="productimage">
			<image :src="detail.thumbnail" mode="widthFix"></image>
		</view>
		<view class="viewbox">
			<view class="productname">
				{{detail.goodsName}}
			</view>
			<view class="uni-flex uni-row" style="justify-content: space-between;">
				<view class="pointview">
					{{detail.points}}
					<span>燃料</span>
				</view>
				<view class="buynumber">
					已兑换{{detail.buyCount}}
				</view>
			</view>
		</view>
		<view class="viewbox">

			<view class="uni-flex uni-row" style="justify-content: space-between;">
				<view class="leftitle">
					数量
				</view>
				<view class="uni-flex uni-row">
					<view class="numberbtn" :class="pronumber > 0 ? 'on' : ''" @tap="changeNumber(1)">
						-
					</view>
					<view class="numberinput">
						<input type="number" v-model="pronumber" @blur="inputNumber" />
					</view>
					<view class="numberbtn" :class="detail.residueStock > pronumber ? 'on' : ''" @tap="changeNumber(2)">
						+
					</view>
				</view>
			</view>
		</view>
		<view class="viewbox">
			<view class="titleview">商品介绍</view>
			<view class="detailview" v-html="detail.info">
			</view>
		</view>

		<view class="changebtn" @tap="changeProduct()">
			立即兑换
		</view>
		<view style="height: 20px;">&nbsp;</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
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
				detail: {},
				pronumber: 0
			};
		},

		onLoad(option) {
			let that = this;
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			that.$H.get("pointGoods/" + option.id).then(res => {
				that.detail = res.result

			})
		},
		onShow() {

		},

		methods: {
			inputNumber() {
				if (this.pronumber > this.detail.residueStock) {
					this.pronumber = this.detail.residueStock
				}
			},
			changeNumber(type) {
				// 1减少 2增加
				let that = this;
				if (type == 1) {
					if (that.pronumber > 0) {
						that.pronumber--
					}
				} else {
					if (that.pronumber < that.detail.residueStock) {
						that.pronumber++
					}
				}
			},
			// 创建订单
			changeProduct() {
				let that = this;
				if (that.pronumber == 0) {
					uni.showToast({
						title: '请选择商品数量',
						icon: 'none',
						duration: 2000,
					})
					return
				}
				uni.showLoading({
					title: '正在创建订单...',
					mask: true,
				});
				that.$H.post("pointOrder/" + that.detail.id, {
					num: that.pronumber,
					uid: that.loginUserInfo.uid
				}).then(res => {
					if (res.code == 0) {
						// 出票
						that.$H.post("pointOrder/paid/" + res.result.sn + "?uid=" + that.loginUserInfo.uid).then(
							res2 => {
								uni.hideLoading();
								if (res2.code == 0) {


									uni.showToast({
										title: '兑换成功',
										icon: 'none',
										duration: 2000,
									})
								} else {
									uni.showToast({
										title: res2.msg,
										icon: 'none',
										duration: 2000,
									})
								}

							})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000,
						})
					}

				})
			}

		}
	};
</script>

<style lang="scss" scoped>
	.productimage {
		image {
			width: 100%;
		}
	}

	.viewbox {
		margin: 16px 16px 0;
		background: $bg-color-light;
		border-radius: 8px 8px 8px 8px;
		padding: 18px;

		.titleview {
			font-size: 14px;
			font-weight: 600;
			color: $text-color-base;
			margin-bottom: 12px;
		}

		.productname {
			font-size: 18px;
			font-weight: 500;
			color: $text-color-base;
			line-height: 28px;
			margin-bottom: 20px;
		}

		.pointview {
			font-size: 28px;
			font-weight: 800;
			color: $text-color-base;
			line-height: 28px;

			span {
				font-size: 12px;
				margin-left: 3px;
			}
		}

		.buynumber {
			font-size: 12px;
			font-weight: 300;
			color: $text-color-base;
			line-height: 32px;
		}

		.leftitle {
			font-size: 14px;
			font-weight: 500;
			color: $text-color-base;
		}

		.detailview {
			color: $text-color-base;
		}

		// 数量按钮
		.numberbtn {
			width: 24px;
			height: 24px;
			background: $btn-base;
			border-radius: 12px 12px 12px 12px;
			line-height: 20px;
			color: rgba(255, 255, 255, 0.5);
			text-align: center;
			font-size: 28px;
		}

		.on {
			background: $btn-base;
			color: $text-color-white;
		}

		.numberinput {
			width: 30px;
			margin: 0 10px;

			input {
				text-align: center;
				line-height: 24px;
				font-size: 14px;
				font-weight: bold;
				color: $text-color-base;
			}

		}
	}

	.changebtn {
		margin: 30px 16px;
		text-align: center;
		// padding: 16px 0;
		line-height: 44px;
		font-size: 18px;
		font-weight: 500;
		color: $text-color-white;
		background: $btn-base;
		border-radius: 22px 22px 22px 22px;
	}
</style>