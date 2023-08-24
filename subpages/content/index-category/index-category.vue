<template>
	<view>
		<!-- #ifdef MP -->
		<aTip :isCustom="true" :text="wxText" :borderR="5"></aTip>
		<!-- #endif -->
		<!-- navbar -->
		<u-navbar :is-back="false" z-index="99999" :background="background">
			<!-- tabs -->
			<u-tabs :list="tabList" font-size="35" name="cateName" :current="current"
				@change="tabChange" bg-color=""></u-tabs>
		</u-navbar>
		<!-- 最新 -->
		<view v-if="current === 2">
			<post-list :list="lastPost" :loadStatus="loadStatus4" :showTag="true" :open="adIsOpen" :openAd="true" :wxAdpid="wxAdpid" :h5Adpid="h5Adpid"></post-list>
			<!-- <post-list-twice :dataList="lastPost" :loadStatus="loadStatus4"></post-list-twice> -->
		</view>
		<!-- 关注 -->
		<view v-if="current === 0">
			<!-- <post-list :list="followUserPost" :loadStatus="loadStatus1" :showTag="true"></post-list> -->
			<post-list-twice :dataList="followUserPost" :loadStatus="loadStatus1"></post-list-twice>
		</view>
		<view v-if="current === 1">
			<!-- 我的圈子 -->
			<view class="topic-wrap">
				<view class="block-title">
					<view>我加入的圈子</view>
				</view>
				<u-grid @click="jump" :col="5" :border="false">
					<!-- 我的圈子 -->
					<u-grid-item :index="'/pages/topic/detail?id='+item.id"
						v-for="(item, index) in joinTopicList" :key="index">
						<view class="grid-topic">
							<u-image width="120rpx" :border-radius="10" height="120rpx" :src="item.coverImage">
							</u-image>
							<view class="name">{{ item.topicName.substring(0, 5) }}</view>
							<text v-if="sessionUid == item.uid" class="user">圈主</text>
						</view>
					</u-grid-item>
					<!-- 创建圈子 -->
					<u-grid-item index="/pages/topic/add/add">
						<navigator class="grid-topic">
							<u-image width="120rpx" :border-radius="10" height="120rpx" src="/static/add-1.png">
							</u-image>
							<view class="name">创建圈子</view>
						</navigator>
					</u-grid-item>
				</u-grid>
			</view>
			<!-- <post-list :list="joinTopicPost" :loadStatus="loadStatus3" :showTag="true"></post-list> -->
			<post-list-twice :dataList="joinTopicPost" :loadStatus="loadStatus3"></post-list-twice>
		</view>
		<!-- tabbar -->
		<lf-tabbar :active="0" :count="messegeNum"></lf-tabbar>
		<!-- 返回顶部 -->
		<!-- <lf-back-top></lf-back-top> -->
	</view>
</template>

<script>
	import postList from '@/components/post-list/post-list.vue';
	import postListTwice from '@/components/post-list-twice/post-list-twice.vue'
	import aTip from '@/components/add-tips/index.vue';
	import {mapGetters} from 'vuex';
	export default {
		components: {
			postList,
			postListTwice,
			aTip
		},
		data() {
			return {
				sessionUid: uni.getStorageSync('userInfo').uid,
				loadStatus1: 'loadmore',
				loadStatus2: 'loadmore',
				loadStatus3: 'loadmore',
				loadStatus4: 'loadmore',
				page: 1,
				page2: 1,
				page3: 1,
				page4: 1,
				shareCover: '',
				topDisList: [],
				swiperList: [],
				followUserPost: [],
				joinTopicPost: [],
				lastPost: [],
				tabList: [{
						name: '关注'
					},
					{
						name: '圈子'
					},
					{
						name: '最新'
					}
				],
				current: 2,
				joinTopicList:[],
				wxText: "点击添加到我的小程序",
				background: {
					backgroundImage: 'linear-gradient(45deg, rgb(210,227,235), rgb(173, 173, 220))'
				},
				h5Adpid:'',
				wxAdpid:'',
				adIsOpen:''
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
		onLoad() {
			this.getSysInfo();
			this.getLastPost();
			this.getAdConfig();
		},
		onShow() {
			this.getMsgNum();
		},
		onReachBottom() {
			if (this.current === 0) {
				this.page2++;
				this.getFollowUserPost();
			}

			if (this.current === 1) {
				this.page3++;
				this.getJoinTopicPost();
			}
			if (this.current === 2) {
				this.page4++;
				this.getLastPost();
			}
		},
		onPullDownRefresh() {
			if (this.current === 0) {
				this.page2 = 1;
				this.followUserPost = [];
				this.getFollowUserPost();
				this.getMsgNum();
			}

			if (this.current === 1) {
				this.page3 = 1;
				this.joinTopicPost = [];
				this.getJoinTopicPost();
				this.getUserJoinTopic();
				this.getMsgNum();
			}
			
			if (this.current === 2) {
				this.page4 = 1;
				this.lastPost = [];
				this.getLastPost();
			}
			uni.stopPullDownRefresh();
		},
		methods: {
			getMsgNum() {
				this.$H.post('message/num').then(res => {
					this.msgNum = res.result;
					let all=this.$store.state.totalUnread.message+this.$store.state.totalUnread.notice+res.result.allCount
					this.$store.state.messegeNum = [0, 0, 0, all , 0];
				});
			},
			tabChange(index) {
				console.log('index:',index)
				this.current = index;
				this.followUserPost=[];
				this.joinTopicList=[];
				this.lastPost=[];
				this.joinTopicPost=[];
				if(index===1){
					this.page3 = 1;
					this.getJoinTopicPost();
					this.getUserJoinTopic();
					this.getMsgNum();
				}
				if(index===0){
					this.page2 = 1;
					this.getFollowUserPost();
					this.getMsgNum();
				}
				if(index===2){
					this.page4 = 1;
					this.getLastPost();
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
			jump(url){
				uni.navigateTo({
					url:url
				})
			},
			getSysInfo() {
				this.$H.get('system/miniConfig').then(res => {
					this.shareCover = res.result.intro;
				});
			},
			// 获取加入的圈子动态
			getJoinTopicPost() {
				this.loadStatus3 = 'loading';
				this.$H
					.get('post/joinTopicPost', {
						page: this.page3
					})
					.then(res => {
						this.joinTopicPost = this.joinTopicPost.concat(res.result.data);
						if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
							this.loadStatus3 = 'nomore';
						} else {
							this.loadStatus3 = 'loadmore';
						}
					});
			},
			// 获取关注用户帖子
			getFollowUserPost() {
				this.loadStatus1 = 'loading';
				this.$H
					.get('post/followUserPost', {
						page: this.page2
					})
					.then(res => {
						if(res.code==0&&res.result){
							this.followUserPost = this.followUserPost.concat(res.result.data);
							if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
								this.loadStatus1 = 'nomore';
							} else {
								this.loadStatus1 = 'loadmore';
							}
						}else{
							this.loadStatus1 = 'nomore';
						}
						
					});
			},
			//获取最新帖子
			getLastPost() {
				this.loadStatus4 = 'loading';
				this.$H
					.get('post/lastPost', {
						page: this.page4
					})
					.then(res => {
						this.lastPost = this.lastPost.concat(res.result.data);
						if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
							this.loadStatus4 = 'nomore';
						} else {
							this.loadStatus4 = 'loadmore';
						}
					});
			},
			//获取广告配置
			getAdConfig() {
				this.$H.get('system/getAd').then(res => {
					if(res.code==0){
						this.adIsOpen = res.adIsOpen;
						this.h5Adpid = res.h5Adpid;
						this.wxAdpid = res.wxAdpid;
					}
				});
			},
		}
	};
</script>

<style>
	page {
		background-color: #F5F5F5;
	}
</style>
<style lang="scss" scoped>
	.swiper-body{
		height: calc(100vh - var(--status-bar-height) - 43px);
	}
	
	.body-scroll-view{
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
		.right{
			margin-left: auto;
			color: #999;
			font-size: 24rpx;
		}
	}
	
	// 顶部圈子
	.topic-wrap{
		padding: 0 20rpx; 
		background-color: #fff;
		margin-bottom: 20rpx;
	}
	.grid-topic{
		position: relative;
		margin-bottom: 20rpx;
		.name{
			font-size: 24rpx;
			text-align: center;
		}
		.user{
			position: absolute;
			left: 0;
			top: 0;
			font-size: 20rpx;
			display: block;
			background-color: $themes-color;
			padding: 5rpx;
			border-radius: 0 0 10rpx 0;
		}
	}
</style>
