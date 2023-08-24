<template>
	<view class="user" :style="[background]">
		<view class="header">
			<!-- #ifndef  H5 -->
			<u-sticky offset-top="0" h5-nav-height="0" bg-color="transparent">
				<u-navbar :is-back="false" title="个人中心" :title-bold="true" :is-fixed="false" :border-bottom="false"
					:background="{ background: 'rgba(256,256, 256,' + navBg + ')' }"
					:title-color="navBg > 0.5 ? '#000' : '#fff'"></u-navbar>
			</u-sticky>
			<!-- #endif -->
			<view class="user-info row-between">
				<view class="info row">
					<image v-if="hasLogin" class="avatar mr20 flexnone" :src="userInfo.avatar" @click="showDrawer()"></image>
					<image v-else class="avatar mr20 flexnone" @tap="toLogin" src="/static/images/unlogin_avatar.png">
					</image>
					<view class="white" v-if="hasLogin" @tap="toNav('/pages/user/home')">
						<view class="name xxl line1">{{userInfo.username}}</view>
						<view class="user-id row-between" v-if="userInfo.intro">
							<view class="xs white ml20 mr20">{{userInfo.intro}}</view>
						</view>
					</view>
					<view class="white" v-else @tap="toLogin">
						<view style="font-size: 42rpx">点击登录</view>
						<view class="sm">登录体验更多功能</view>
					</view>
				</view>
				<view class="row" style="align-self: flex-start;">
					<view class="user-opt" style="margin-right: 30rpx;" @tap="goMessage()">
						<view class="dot row-center" v-if="msg>0"></view>
						<image style="width:58rpx;height: 58rpx;" src="/static/images/icon_my_news.png"></image>
					</view>
					<view class="user-opt" @tap="toNav('/pages/user/edit-info/edit')">
						<image style="width:58rpx;height: 58rpx;" src="/static/images/icon_my_setting.png"></image>
					</view>
				</view>
			</view>
			<view class="member column-end" @click="toVip">
				<view class="member-entery row-between">
					<view class="row">
						<image class="icon-md" src="/static/images/icon_member.png"></image>
						<view class="ml10" v-if="hasLogin&&userInfo.vip==1">尊贵的会员您好</view>
						<view class="ml10" v-else-if="hasLogin&&userInfo.vip==0">普通用户</view>
						<view class="ml10" v-else>登录体验更多服务</view>
					</view>
					<view class="row">
						<view class="sm">{{hasLogin ? '会员中心' : '请先登录'}}</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="my-assets bg-white">
			<view class="title row lg">我的账号</view>
			<view class="nav row">
				<view class="column-center mb20 assets-item" @click="toNav('/pages/my/fans')">
					<view class="xl primary">{{userInfo.fans || 0}}</view>
					<view class="sm">粉丝</view>
				</view>
				<view class="column-center mb20 assets-item" @click="toNav('/pages/my/follow')">
					<view class="xl primary">{{userInfo.follow || 0}}</view>
					<view class="sm">关注</view>
				</view>
				<view class="column-center mb20 assets-item" @click="toNav('/pages/my/post')">
					<view class="xl primary">{{userInfo.postNum || 0}}</view>
					<view class="sm">帖子</view>
				</view>
				<view class="column-center mb20 assets-item" @click="toNav('/pages/sign/integral')">
					<view class="xl primary">{{userInfo.integral || 0}}</view>
					<view class="sm">积分</view>
				</view>
			</view>
		</view>
		<!-- mini幻灯片 -->
		<view v-if="bannerList && bannerList.length>0">
			<mine-banner :items="bannerList"></mine-banner>
		</view>
		<!-- 我的服务 -->
		<view class="block-wrap">
			<view class="block-title">我的服务</view>
			<u-grid :col="4" :border="false" style="margin: 20rpx 0;" @click="toNav">
				<u-grid-item v-for="(menu,menuListIndex) in menuList" :key="menuListIndex" :index="menu.url">
					<image class="gn-icon" :src="menu.img"></image>
					<view class="grid-text">{{menu.name}}</view>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="xs muted" style="margin: 50rpx 0;">
			<view class="row-center">
				噗叽校园生活V1.8.2-演示站点
			</view>
			<view class="row-center">
				© www.linfeng.tech
			</view>
		</view>
		<!-- tabbar -->
		<lf-tabbar :active="4" :count="msgCount"></lf-tabbar>
		<!-- 侧边栏 -->
		 <unidrawer ref="draw" :mask="true" :width="280" :mode="'left'">
			<sideview></sideview>
		</unidrawer>
	</view>
</template>

<script>
	import mineBanner from "@/components/mine-banner/mine-banner.vue";
	import unidrawer from '@/uni_modules/uni-drawer/components/uni-drawer/uni-drawer.vue';
	import sideview from '@/components/sideView/sideview.vue';
	
	export default {
		components:{
			mineBanner,
			sideview,
			unidrawer
		},
		data() {
			return {
				userInfo: '',
				showNav: false,
				navH: 0,
				navBg: 0,
				menuList: [],
				statusBarH: "",
				hasLogin: false,
				background: '',
				msg: 0,
				bgImg: '',
				bannerList:[],
				isOpen:'',
				shareCover:''
			};
		},

		computed: {
			msgCount() {
				this.msg = this.$store.state.messegeNum[3]
				return this.$store.state.messegeNum
			}
		},
		onLoad() {
			this.getUserMenu();
			this.getBgImg();
			this.getLinkList();
			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			//#endif
			this.getSysInfo();
			
		},
		onShow() {
			if (uni.getStorageSync('hasLogin')) {
				this.getUserInfo();
				this.hasLogin = true;
			} else {
				this.hasLogin = false;
			}
			this.getMsgNum();
		},
		onPageScroll(e) {
			const top = uni.upx2px(100)
			const {
				scrollTop
			} = e
			let percent = scrollTop / top > 1 ? 1 : scrollTop / top
			this.navBg = percent
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
				// console.log(res.target);
			}
			let imgURL = this.shareCover
			return {
				title: this.$c.miniappName,
				path: '/pages/index/index',
				imageUrl: imgURL
			};
		},
		methods: {
			getUserMenu() {
				this.$H.get('userMenu/list').then(res => {
					if (res.code == 0) {
						this.menuList = res.result;
					}

				});
			},
			getMsgNum() {
				this.$H.post('message/num').then(res => {
					this.msgNum = res.result;
					let all=this.$store.state.totalUnread.message+this.$store.state.totalUnread.notice+res.result.allCount
					this.$store.state.messegeNum = [0, 0, 0, all , 0];
				});
			},
			//显示侧边栏
			showDrawer(){
				this.$refs.draw.open();
			},
			// 获取轮播图
			getLinkList() {
				this.$H
					.post('link/list', {
						cateId: 1
					})
					.then(res => {
						this.bannerList = res.result;
					});
			},
			toLogin() {
				// #ifdef APP-PLUS || H5
				uni.navigateTo({
					url: '/pages/user/go-login'
				});
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/user/login'
				});
				// #endif
			},
			getSysInfo() {
				this.$H.get('system/basic').then(res => {
					this.shareCover = res.logo;
					this.isOpen=res.vipShow;
				});
			},
			getUserInfo() {
				this.$H.get('user/userInfo').then(res => {
					this.userInfo = res.result;
				});
			},
			toUcenter() {
				uni.navigateTo({
					url: '/pages/user/home'
				});
			},
			toNav(url) {
				uni.navigateTo({
					url: url
				});
			},
			getIsOpen(){
				this.$H.get('system/vipShow').then(res => {
					this.isOpen=res.vipShow;
				});
			},
			toVip(){
				//vip入口开关开着才能进入,用于微信小程序审核
				if(this.isOpen=='0'){
					uni.navigateTo({
						url: '/pages/user/vip/vip'
					});
				}
			},
			goMessage() {
				uni.switchTab({
					url: '/pages/message/message'
				})
			},

			getBgImg() {
				this.$H.get('system/bgImgConfig').then(res => {
					this.bgImg = res.bgImg;
					this.background = {
						'background-image': `url(${this.bgImg})`
					}
				});
			},

		},
	};
</script>
<style lang="scss">
	.user {
		background-image: url(../../static/images/my_topbg.png);
		background-size: 100% 420rpx;
		background-repeat: no-repeat;

		.header {
			display: flex;
			flex-direction: column;
			height: 420rpx;

			.user-info {
				padding: 10rpx 30rpx;
				//#ifdef  H5 
				padding-top: 90rpx;

				//#endif
				.avatar {
					height: 110rpx;
					width: 110rpx;
					border-radius: 50%;
					overflow: hidden;
				}

				.name {
					text-align: left;
					margin-bottom: 5rpx;
					max-width: 400rpx;
				}

				.user-id {
					border: 1px solid white;
					border-radius: 100rpx;

					.copy-btn {
						background-color: #FFDFDA;
						height: 40rpx;
						width: 90rpx;
						border-radius: 100rpx;
					}
				}

				.user-opt {
					position: relative;

					.dot {
						position: absolute;
						background-color: #ee0a24;
						border: 2rpx solid #FFFFFF;
						color: #F4F4F5;
						border-radius: 100%;
						top: 6rpx;
						right: 0rpx;
						font-size: 22rpx;
						min-width: 16rpx;
						height: 16rpx;
					}
				}

				.buyer-type {
					background-color: #FFA200;
					height: 38rpx;
					padding: 0 10rpx;
				}
			}

			.member {
				flex: 1;
				padding: 0 20rpx;

				.member-entery {
					color: #FFE0A1;
					padding: 0 16rpx;
					width: 100%;
					height: 80rpx;
					background: url(../../static/images/bg_member_grade.png);
					background-size: 100%;
				}
			}

		}

		.order-nav {
			.icon-contain {
				position: relative;
			}
		}

		.order-nav,
		.my-assets {
			margin: 20rpx 20rpx 0;
			border-radius: 8rpx;
		}

		.title {
			height: 88rpx;
			padding: 0 30rpx;
			border-bottom: 1px dashed #ffffff;
		}

		.nav {
			padding: 26rpx 0 0;

			.assets-item {
				flex: 1;
			}

			.item {
				width: 25%;
			}

			.badge {
				padding: 0 6rpx;
				min-width: 28rpx;
				height: 28rpx;
				border-radius: 28rpx;
				box-sizing: border-box;
				border: 1rpx solid #FF2C3C;
				color: #FF2C3C;
				position: absolute;
				left: 33rpx;
				top: -10rpx;
				z-index: 2;
			}

			.nav-icon {
				width: 52rpx;
				height: 52rpx;
			}
		}
	}

	.block-wrap {
		background-color: #fff;
		border-radius: 20rpx;
		margin: 20rpx;
		overflow: hidden;

		.block-title {
			background-color: #fff;
			padding: 20rpx;
		}
	}

	.gn-icon {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 20rpx;
	}

	.grid-text {
		color: #999;
		font-size: 12px;
		margin-bottom: 20rpx;
	}

	.icon {
		min-height: 34rpx;
		min-width: 34rpx;
		height: 34rpx;
		width: 34rpx;
		vertical-align: middle;
	}

	.icon-md {
		min-height: 44rpx;
		min-width: 44rpx;
		height: 44rpx;
		width: 44rpx;
		vertical-align: middle;
	}

	.row {
		display: flex;
		align-items: center;
	}

	.row-between {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.column-end {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
	}

	.column-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.mr20 {
		margin-right: 20rpx;
	}

	.flexnone {
		flex: none;
	}

	.line1 {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.column-between {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.md {
		font-size: 30rpx;
	}

	.wrap {
		flex-wrap: wrap;
	}

	.bg-white {
		background-color: #ffffff;
	}

	.white {
		color: #ffffff;
	}

	.primary {
		color: #333333;
	}

	.normal {
		color: #333333;
	}

	.ml20 {
		margin-left: 20rpx;
	}

	.lg {
		font-size: 32rpx;
	}

	.sm {
		font-size: 26rpx;
	}

	.xs {
		font-size: 24rpx;
	}

	.mr5 {
		margin-right: 5rpx;
	}

	.xxl {
		font-size: 36rpx;
	}

	.mb20 {
		margin-bottom: 20rpx;
	}

	.mt10 {
		margin-top: 10rpx;
	}

	.row-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.br60 {
		border-radius: 60rpx;
	}

	.ml10 {
		margin-left: 10rpx;
	}

	.ml5 {
		margin-left: 5rpx;
	}

	.muted {
		color: #999999;
	}
</style>
