<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="校园墙"></top-nave>
		<view class="uni-flex uni-row topbox" style="justify-content: space-between;">
			<view class="uni-flex uni-row" style="padding: 7px 0;">
				<view class="left-line">

				</view>
				<view class="">
					<view class="top-title">
						当前所在星球
						<span class="addbtnxq"  v-if="isJoin ==false" @tap="addTopic()">我要入驻</span>
					</view>
					<view class="top-name">
						{{topicName}}
					</view>
				</view>
			</view>
			<view class="">
				<image src="../../static/new/xjhx.png" mode="widthFix" @tap="pageTo('/pages/index/change')"></image>
			</view>
		</view>
		<!-- navbar -->
		<!-- <view id="navbar" class="lf-nav" :style="{paddingTop:statusBarHeight +'px'}">
			<view class="lf-all">
				<view class="lf-all-nav" :style="{height: navigationBarHeight+'px'}">
					<view class="navbar-img" @click="refresh()">
						<image :src="shareCover" mode="" class="n-img"></image>
					</view>
					<view class="search-wrap" @click="toSearch">
						<u-search shape="round" height="60" placeholder="搜索帖子/用户/圈子" :disabled="true"
							:show-action="false"></u-search>
					</view>
				</view>
				<view class="lf-tab">
					<view class="lf-tab-con">
						<u-tabs :list="tabList" font-size="28" name="cateName" :current="current" @change="tabChange"
							inactive-color="#949494" bar-height="6" bar-width="20" height="40">
						</u-tabs>
					</view>
					<view class="lf-vip" v-if="vipShow=='0'">
						<image @click="toVipPage()" src="/static/join-vip.png" class="lf-vip-icon"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="lf-top"></view> -->
		<view class="lf-tab">
			<view class="lf-tab-con">
				<u-tabs :list="tabList" font-size="28" name="cateName" bg-color="none" :current="current"
					@change="tabChange" inactive-color="#FFFFFF" active-color="#FFFFFF" show-bar="true" bar-height="6"
					bar-color="#C1C0FA" height="40">
				</u-tabs>
			</view>

		</view>
		<!-- 最新 -->
		<view>
			<post-list v-if="indexStyle1=='0'" :list="lastPost" :loadStatus="loadStatus" :showTag="true"
				:open="adIsOpen" :openAd="true" :wxAdpid="wxAdpid" :h5Adpid="h5Adpid"></post-list>
			<post-list-twice v-if="indexStyle1=='1'" :dataList="lastPost" :loadStatus="loadStatus"></post-list-twice>
		</view>
		<!-- tabbar -->
		<lf-tabbar :active="0" :count="messegeNum"></lf-tabbar>
		<!-- 返回顶部 -->
		<!-- <lf-back-top></lf-back-top> -->
		<!-- 入住星球 -->
		<u-popup v-model="openPop" mode="center" border-radius="28" >
			<view class="infobox">
				<view class="infobox-title">
					{{topicName}}
				</view>
				<view class="infobox-contact">
					<view class="infobox-font">
						入驻该星球需要消耗{{}}燃料
					</view>
					<view class="infobox-btn uni-flex uni-row" style="justify-content: space-between;">
						<view class="btn-left" @tap="outPop">
							再想想
						</view>
						<view class="btn-right" @tap="submitPop">
							我要入驻
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>

</template>
<script>
	import postList from '@/components/post-list/post-list.vue';
	import postListTwice from '@/components/post-list-twice/post-list-twice.vue'
	import aTip from '@/components/add-tips/index.vue';
	import topNave from '@/components/nav-header/index.vue';
	import {
		mapGetters
	} from 'vuex';
	export default {
		components: {
			postList,
			postListTwice,
			aTip,
			topNave
		},
		data() {
			return {
				sessionUid: uni.getStorageSync('userInfo').uid,
				loadStatus: 'loadmore',

				page: 1,
				shareCover: 'http://pic.linfeng.tech/test/20220724/9a665bf276a44827ad8ef0b3140a7d1d.png',
				topDisList: [],
				swiperList: [],
				followUserPost: [],
				joinTopicPost: [],
				lastPost: [],
				tabList: [{
					name: '最新'
				}],
				current: 0,
				joinTopicList: [],
				wxText: "点击添加到我的小程序",
				background: {
					backgroundImage: 'linear-gradient(45deg, rgb(210,227,235), rgb(173, 173, 220))'
				},
				h5Adpid: '1818425366',
				wxAdpid: '1872486102',
				adIsOpen: '0',
				navbarHeight: 0,
				navigationBarHeight: 0,
				statusBarHeight: 0,
				indexStyle1: '0',
				indexStyle2: '0',
				indexStyle3: '0',
				vipShow: '0',
				uid: 0,
				topicName: '暂未加入',
				isJoin:null,
				openPop:false
			};
		},
		computed: {
			...mapGetters(['messegeNum'])
		},
		onShareAppMessage(res) {
			return {
				title: this.$c.miniappName,
				path: '/pages/index/index',
				imageUrl: this.shareCover
			};
		},
		async onLoad(option) {
			await this.$onLaunched

			this.uid = uni.getStorageSync('userInfo').uid;
			// 获取当前会员的母星
			this.$H.get('topic/getParent/' + this.uid).then(res => {
				if (res.result == '' || res.result == null) {
					uni.navigateTo({
						url: '/pages/login/parent'
					})
				} else {
					uni.setStorageSync('topicId', res.result.topicId)
					this.toppicDetail(res.result.topicId)
				}
			});
			this.getSysInfo();
			this.getLastPost();
			this.getAdConfig();
			console.log('uni.$u.config.v', uni.$u.config.v);
		},
		onShow() {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;

			if (uni.getStorageSync('topicId')) {
				this.toppicDetail(uni.getStorageSync('topicId'))
				// 刷新数据
			}
		},
		onReachBottom() {

			this.page++;
			if(this.current == 0){
				this.getLastPost();
			}else{
				this.getTopPost(this.current);
			}
			

		},
		onPullDownRefresh() {

			this.page = 1;
			this.lastPost = [];
			if(this.current == 0){
				this.getLastPost();
			}else{
				this.getTopPost(this.current);
			}
			
			uni.stopPullDownRefresh();
		},
		methods: {
			addTopic(){
				// 入住星球
				this.openPop = true
			},
			outPop(){
				this.openPop = false
			},
			submitPop(){
				this.$H.get('topic/joinTopic', {
					id: uni.getStorageSync('topicId'),
					parentStar:false
				}).then(res => {
					if(res.code == 0){
						this.$f.toast('入驻成功')
						this.toppicDetail(uni.getStorageSync('topicId'))
						this.openPop = false
					}else{
						this.openPop = false;
						this.$f.toast(res.message)
					}
					
				});
			},
			pageTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			toppicDetail(id) {
				this.$H.get('topic/detail', {
					id: id
				}).then(res => {
					this.topicName = res.result.topicName;
					this.tabList = [{
						name: '最新'
					}];
					this.isJoin = res.result.isJoin;
					res.result.postCategoryList.forEach(v => {
						let array = {};
						array.name = v.name;
						array.topicId = v.topicId;
						array.id = v.id;
						this.tabList.push(array)

					})
				});
			},
			refresh() {

				this.page = 1;
				this.lastPost = [];
				if(this.current == 0){
					this.getLastPost();
				}else{
					this.getTopPost(this.current);
				}
				

			},


			tabChange(index) {
				console.log('index:', index)
				this.current = index;
				this.followUserPost = [];
				this.joinTopicList = [];
				this.lastPost = [];
				this.joinTopicPost = [];

				// if (index === 2) {
				this.page = 1;

				if (index == 0) {
					this.getLastPost();
				} else {
					this.getTopPost(index);
				}


			},
			// 用户加入的圈子
			getUserJoinTopic() {
				this.loadStatus = 'loading';
				this.$H
					.post('topic/userJoinTopic', {
						classId: this.topicClassId
					})
					.then(res => {
						this.joinTopicList = res.result.data;
						uni.stopPullDownRefresh();
					});
			},
			jump(url) {
				uni.navigateTo({
					url: url
				})
			},
			getSysInfo() {
				this.$H.get('system/basic').then(res => {
					this.shareCover = res.logo;
					this.indexStyle1 = res.indexStyle1;
					this.indexStyle2 = res.indexStyle2;
					this.indexStyle3 = res.indexStyle3;
					this.vipShow = res.vipShow;
				});
			},

			// 获取不同话题的帖子
			getTopPost(index) {
				this.loadStatus = 'loading';
				let id = this.tabList[index].id;
				let topId = this.tabList[index].topicId;
				this.$H.post('post/list', {
					page: this.page,
					postCategoryId:id,
					topicId:topId
				}).then(res => {
					this.lastPost = this.lastPost.concat(res.result.data);
					if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
				});
			},
			//获取最新帖子
			getLastPost() {
				this.loadStatus = 'loading';
				this.$H.get('post/lastPost', {
					page: this.page
				}).then(res => {
					this.lastPost = this.lastPost.concat(res.result.data);
					if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
				});
			},
			//获取广告配置
			getAdConfig() {
				this.$H.get('system/getAd').then(res => {
					if (res.code == 0) {
						this.adIsOpen = res.adIsOpen;
						this.h5Adpid = res.h5Adpid;
						this.wxAdpid = res.wxAdpid;
					}
				});
			},
			toVipPage() {
				if (uni.getStorageSync('hasLogin')) {
					this.$f.jump('/pages/user/vip/vip')
				} else {
					this.$f.toast('请先登录哦')
				}
			},
			toSearch() {
				if (uni.getStorageSync('hasLogin')) {
					this.$f.jump('/pages/search/search')
				} else {
					this.$f.toast('请先登录哦')
				}
			}
		}
	};
</script>
<style lang="scss">
	page{
		background-color: $bg-color-base;
	}
</style>
<style lang="scss" scoped>
	.index-con {
		padding-bottom: 80rpx;
	    background:  $bg-color-base;
		min-height: 100vh;
	}
	// .lf-nav {
	// 	background-color: #070042;
	// 	position: fixed;
	// 	top: 0;
	// 	z-index: 999;
	// }

	.lf-all {
		display: flex;
		flex-direction: column;
	}

	.lf-all-nav {
		display: flex;
		align-items: center;
	}

	.lf-tab {
		display: flex;
		margin-top: 15rpx;
		padding-right: 40rpx;
		justify-content: space-between;
		width: 750rpx;
		margin-bottom: 15rpx;
	}

	.lf-tab-con {
		width: 500rpx;
	}

	.lf-vip {
		padding-top: 5rpx;
		height: 40rpx;
	}

	.lf-vip-icon {
		width: 146rpx;
		height: 40rpx;
	}

	.lf-top {
		/* #ifdef H5*/
		margin-top: 160rpx;
		/* #endif */
		/* #ifdef MP */
		margin-top: 242rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		margin-top: 242rpx;
		/* #endif */

	}

	.navbar-img {
		.n-img {
			width: 80rpx;
			height: 80rpx;
			margin: 0 20rpx 0 40rpx
		}

	}

	.search-wrap {
		/* #ifdef MP */
		width: 410rpx;
		/* #endif */
		/* #ifndef MP */
		width: 100%;
		/* #endif */

	}

	.swiper-body {
		height: calc(100vh - var(--status-bar-height) - 43px);
	}

	.body-scroll-view {
		width: 100%;
		height: 100%;
	}

	.tab-box {
		width: 80%;
	}

	.block-title {
		font-weight: bold;
		padding: 20rpx;
		color: #616161;
		display: flex;
		font-size: 28rpx;

		.right {
			margin-left: auto;
			color: #333;
			font-size: 20rpx;
			display: flex;
			align-items: center;
		}
	}

	// 顶部圈子
	.topic-wrap {
		padding: 0 20rpx;
		background-color: #070042;
		margin-bottom: 1rpx;
	}

	.grid-topic {
		position: relative;
		margin-bottom: 20rpx;

		.name {
			font-size: 20rpx;
			text-align: center;
		}

		.user {
			position: absolute;
			right: -13rpx;
			top: -5rpx;
			font-size: 24rpx;
			display: block;
			padding: 5rpx;
			border-radius: 0 0 10rpx 0;
			height: auto;
			color: white;
		}
	}

	.topbox {
		margin: 0 12px 16px;
		//background: rgba(0, 0, 0, 0.4);
		background-color: $color-black;
		border-radius: $border-radius-base;
		padding: 5px 0 5px 12px;

		.left-line {
			width: 4px;
			background: $border-color;
			border-radius: 12px 12px 12px 12px;
			height: 50px;
			margin-right: 6px;
		}

		.top-title {
			font-size: 12px;
			font-weight: 400;
			color: $border-color;
			// margin-bottom: 12rpx;
		}

		.top-name {
			font-size: 20px;
			font-weight: bold;
			color: $text-color-white;
		}

		image {
			margin-top: 3px;
			width: 150px;
			height: 60px;
		}
	}
	
	.addbtnxq{
		display: inline-block;
		padding:0px 7px ;
		font-size: 12px;
		font-weight: 400;
		color: #C1C0FA;
		background:  $btn-base;
		border-radius: 24rpx ;
		margin-left: 8px;
	}
	
	
	.infobox {
		background: linear-gradient(180deg, #03D7FC 0%, #00B2FF 100%);
		// background-image: url('https://mallwj.hm-myy.cn/169199907149720230814154431.png');
		background-repeat: no-repeat;
		background-size: 100%;
		// background-color: none;
		width: 334px;
		// height:235px;
	
		// border-radius: 9px 9px 9px 9px;
		.infobox-title {
			padding: 13px 0 17px;
			font-size: 18px;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
			// border-bottom: 1px solid #000000;
		}
	
		.infobox-contact {
			// padding: 27px 12px;
		}
	
		.infobox-font {
			font-size: 14px;
			color: #FFFFFF;
			text-align: center;
			padding: 8px 0;
			
		}
	
		.infobox-btn {
			margin-top: 20px;
			border-top:  1px solid #92C3FF;;
			.btn-left {
				text-align: center;
				// width: 120px;
				width: 50%;
				padding: 11px 0;
				font-size: 16px;
				font-weight: 500;
				color: #FFFFFF;
				border-right:  1px solid #92C3FF;;
				// background: #001422;
				// border-radius: 20px;
			}
	
			.btn-right {
				text-align: center;
				// width: 120px;
				width: 50%;
				padding: 11px 0;
				font-size: 14px;
				font-weight: 500;
				color: #FFFFFF;
				// background: linear-gradient(180deg, #03D7FC 0%, rgba(3, 215, 252, 0.55) 100%);
				// border-radius: 20px;
			}
		}
	}
	
</style>