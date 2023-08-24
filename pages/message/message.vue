<template>
	<view>
		<u-navbar :is-back="true" :border-bottom="false">
			<!-- <u-icon name="plus-circle" :size="60" class="search-wrap" @click="toPlus"></u-icon> -->
			<u-tabs :list="pageTab" :current="pageCurrent" @change="pageTabChange"></u-tabs>
		</u-navbar>
		<view v-if="pageCurrent == 0">
			<!-- 消息列表 -->
			<view class="list" style="background: none;">
				<view class="flex_col" @longpress="onLongPress" :class="{'active':pickerUserIndex==index}" @tap="listTap(item)" v-for="(item,index) in sessionList"
				 :key="index" :data-index="index">
					<view class="avatar-container">
						<image :src="item.avatar" mode="aspectFill" style="border-radius: 10%;"></image>
						<!-- #ifdef H5 -->
						<u-badge style="position: absolute;right: -10upx;top: -10upx;"  :count="item.unread"></u-badge>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<u-badge class="msg-tag" :count="item.unread"></u-badge>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS -->
						<u-badge style="position: absolute;right: 20upx;top: 20upx;"  :count="item.unread"></u-badge>
						<!-- #endif -->
					</view>
					<view class="flex_grow">
						<view class="flex_col">
							<view class="flex_grow">{{item.name}}</view>
							<view class="time">{{timeShowFormat(item.updateTime)}}</view>
						</view>
						<view class="info">{{item.lastMessage}}</view>
					</view>
				</view>
			</view>
			<block v-if="sessionList.length == 0">
				<view class="msg-empty">
					<image class="img" mode="widthFix" src="/static/empty.png"></image>
					<text class="txt">暂无会话</text>
				</view>
			</block>
		</view>
		<view v-if="pageCurrent == 1">
			<u-index-list :indexList="indexList" :scrollTop="scrollTop">
				<template v-for="(item, index) in friendListShow">
					<view :key="index">
						<u-index-anchor v-if="item.length!==0" :use-slot="true"><text
								class="anchor-text">{{indexList[index]}}</text></u-index-anchor>
						<view class="list" v-for="(item1, index1) in item" :key="index1">
							<view class="list__item" @tap="gotoFriendInfo(item1.id)">
								<image class="list__item__avatar" :src="item1.url"></image>
								<text
									style="margin-left:30rpx;font-size: 36rpx;color: #2c2c2c;font-weight: 520;">{{item1.name}}</text>
							</view>
							<u-line></u-line>
						</view>
					</view>
				</template>
			</u-index-list>
			<block v-if="friendList.length == 0">
				<view class="msg-empty">
					<image class="img" mode="widthFix" src="/static/empty.png"></image>
					<text class="txt">暂无好友哦~</text>
				</view>
			</block>
			<view class="count-desc" v-if="friendList.length > 0">
				<text class="list__footer">共{{friendList.length}}位好友</text>
			</view>
		</view>
		<!-- 删除系统消息弹窗 -->
		<u-action-sheet :list="sheetList" v-model="showSheet" @click="onSheetItem"></u-action-sheet>

	</view>
</template>

<script>
	const indexList = () => {
		const indexList = []
		const charCodeOfA = 'A'.charCodeAt(0)
		indexList.push("↑")
		indexList.push("☆")
		for (let i = 0; i < 26; i++) {
			indexList.push(String.fromCharCode(charCodeOfA + i))
		}
		indexList.push('#')
		return indexList
	}
	import uIndexList from '@/uview-ui/components/u-index-list/u-index-list.vue';
	import {
		mapGetters
	} from 'vuex';
	import $store from '@/store/index.js';
	import websocket from '@/utils/websocket.js';
	import timeUtil from '@/utils/timeUtil.js';
	import stringUtil from '@/utils/stringUtil.js';
	import unidrawer from '@/uni_modules/uni-drawer/components/uni-drawer/uni-drawer.vue';
	import sideview from '@/components/sideView/sideview.vue';
	export default {
		data() {
			return {
				isOpen: getApp().globalData.isOpen,
				showPlusPost: false,
				showSheet: false,
				showChatSheet: false,
				sheetList: [{
					text: '删除',
					color: 'red'
				}],
				msgNum: {
					thumbCount: 0,
					follow: 0,
					comment: 0,
					systemUnreadCount: 0,
					articleMsgList: [],
					chatMsgList: [],
				},
				checkedMsgId: '',
				checkedIndex: '',
				checkedMsgUid: '',
				adminInfo: {
					username: '系统通知',
					avatar: 'http://pic.linfeng.tech/test/20220528/653770a9701f492ba5b0b75b05c16991.png',
					uid: 1
				},
				pageTab: [{
						name: '私信'
					},
					{
						name: '好友'
					}
				],
				pageCurrent: 0,
				indexList: indexList(),
				scrollTop: 0,
				/* 选择的用户下标 */
				pickerUserIndex: -1,
			};
		},
		components: {
			uIndexList: uIndexList,
			unidrawer:unidrawer,
			sideview:sideview
		},
		computed: {
			...mapGetters(['loginUserInfo', 'isSocketOpen', 'friendListShow', 'friendList', 'totalUnread', 'messegeNum','sessionList'])
		},
		onLoad() {
			//重新获取连接websocket
			if (!$store.state.isSocketOpen && uni.getStorageSync('hasLogin')) {
				websocket.initConnect()
			}
		},
		onShow() {
			if (uni.getStorageSync('userInfo').uid) {
				this.getMsgNum();
			}
			//重新获取连接websocket
			if (!$store.state.isSocketOpen && uni.getStorageSync('hasLogin')) {
				websocket.initConnect()
				$store.dispatch('getFriendList')
				$store.dispatch('getNoticeList')
			}
		},
		onPullDownRefresh() {
			this.getMsgNum();
			uni.stopPullDownRefresh();
		},
		methods: {
			timeShowFormat(time){
				return timeUtil.timeShowFormat(timeUtil.getFormatTime(time));
			},
			/* 列表触摸事件 */
			listTap(item) {
				/* 因弹出遮罩问题，所以需要在遮罩弹出的情况下阻止列表事件的触发 */
				if (this.showShade) {
					return;
				}
				if(item.type=='person'){
					$store.state.chattingUserInfo = item;
					this.$H.post('chat/list', {
						sessionId: item.sessionId,
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
			
				}
			},
			/* 长按监听 */
			onLongPress(e) {
				let [touches, style, index] = [e.touches[0], "", e.currentTarget.dataset.index];
			
				/* 因 非H5端不兼容 style 属性绑定 Object ，所以拼接字符 */
				if (touches.clientY > (this.winSize.height / 2)) {
					style = `bottom:${this.winSize.height-touches.clientY}px;`;
				} else {
					style = `top:${touches.clientY}px;`;
				}
				if (touches.clientX > (this.winSize.witdh / 2)) {
					style += `right:${this.winSize.witdh-touches.clientX}px`;
				} else {
					style += `left:${touches.clientX}px`;
				}
			
				this.popStyle = style;
				this.pickerUserIndex = Number(index);
				this.showShade = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this.showPop = true;
					}, 10);
				});
			},
			pageTabChange(index) {
				this.pageCurrent = index
			},
			goSys() {
				if (uni.getStorageSync('hasLogin')) {
					this.$f.jump('/pages/system/system?user=' + this.$f.tostring(this.adminInfo))
				} else {
					this.$f.toast('请先登录哦')
				}
			},
			goChatList() {
				if (uni.getStorageSync('hasLogin')) {
					this.$f.jump('/pages/im/chat-list/chat-list')
				} else {
					this.$f.toast('请先登录哦')
				}
			},
			goNotice() {
				if (uni.getStorageSync('hasLogin')) {
					this.$f.jump('/pages/im/notice-list/notice-list')
				} else {
					this.$f.toast('请先登录哦')
				}
			},
			// 更新阅读状态
			articleMsgState(id) {
				this.$H.post('message/articleMsgState', {
					id: id
				});
			},
			// 长按图文消息
			onPressArticle() {
				this.showSheet = true;
			},
			// 删除系统消息
			onSheetItem(index) {
				if (index == 0) {
					this.$H
						.post('message/delSystemMsg').then(res => {
							if (res.code == 0) {
								this.msgNum.systemUnreadCount = 0
							}
						});
				}
			},

			getMsgNum() {
				this.$H.post('message/num').then(res => {
					this.msgNum = res.result;
					let all = this.$store.state.totalUnread.message + this.$store.state.totalUnread.notice + res
						.result.allCount
					this.$store.state.messegeNum = [0, 0, 0, all, 0];
				});
			},
			gotoFriendInfo(id) {
				uni.navigateTo({
					url: '/pages/user/home?uid=' + id
				})
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			toPlus() {
				this.showPlusPost = true;
			},
			toPost(i) {
				this.showPlusPost = false;
				if (i == 3) {
					this.$f.jump('/pages/vote/vote')
				} else if (i == 4) {
					this.$f.jump('/subpages/content/article/add')
				} else {
					this.$f.jump('/pages/post/add?type=' + i)
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import url('@/static/css/navigate-bar.css');

	.msg-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 800rpx;

		.img {
			width: 200rpx;
			margin-top: 100rpx;
		}

		.txt {
			color: #999;
			font-size: 20rpx;
			margin-top: 20rpx;
		}
	}

	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}

	.list__item:active {
		background-color: #e8e8e8;
	}

	.list {

		&__item {
			// @include flex;
			padding: 10px 16px;
			align-items: center;
			display: flex;

			&__avatar {
				height: 45px;
				width: 45px;
				border-radius: 5px;
			}
		}

		&__footer {
			color: $u-tips-color;
			font-size: 14px;
			text-align: center;
			margin: 15px 0;
		}
	}

	.count-desc {
		height: 150rpx;
		text-align: center;
	}

	.search-wrap {
		margin-left: 20rpx;
		margin-right: 30%;
	}

	.message-container {
		padding: 0 20rpx;
	}

	.message-line {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0px;
		border-bottom: 1rpx solid #EEEEEE;
	}

	.message-line:last-of-type {
		border: none;
	}

	.message-info {
		display: flex;
		align-items: center;
	}

	.message-icon {
		height: 104rpx;
		line-height: 104rpx;
		text-align: center;
		width: 104rpx;
		border-radius: 50%;
		background: #f5f5f5;
	}

	.message-text {
		padding-left: 20rpx;
	}

	.message-text view:nth-child(1) {
		display: flex;
		align-items: center;
	}

	.message-text view:nth-child(1) text:nth-child(1) {
		font-size: 32rpx;
		font-weight: 600;
	}

	.message-text view:nth-child(1) text:nth-child(2) {
		font-size: 20rpx;
		font-weight: 300;
		color: #FFFFFF;
		height: 36rpx;
		line-height: 36rpx;
		border-radius: 18rpx;
		padding: 0 12rpx;
		background: #f34d15;
		margin-left: 12rpx;
	}

	.message-text view:nth-child(2) {
		font-size: 28rpx;
		font-weight: 400;
		color: #666666;
	}

	.share-type {
		padding: 50rpx 30rpx;

		.type-item {
			background-color: #F5F5F5;
			padding: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 20rpx;
			}

			&:nth-child(2) {
				margin: 20rpx 0;
			}

			&:nth-child(3) {
				margin: 20rpx 0;
			}
		}
	}
	
	
	@import url('@/static/css/navigate-bar.css');
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
	/* 列式弹性盒子 */
	.flex_col {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
	}
	
	/* 弹性盒子弹性容器 */
	.flex_col .flex_grow {
		width: 0;
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
		color: #FFFFFF;
	}
	
	.flex_row .flex_grow {
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
	}
	
	/* 弹性盒子允许换行 */
	.flex_col.flex_wrap {
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		font-size: 18px;
		color: rgba(255,255,255,0.8);
	}
	.msg-tag{
		position: absolute;
		right: -20upx;
		top: -20upx;
	}
	/* 列表 */
	.list {
		background-color: #fff;
		font-size: 28upx;
		color: #333;
		user-select: none;
		touch-callout: none;
	
		&>view {
			padding: 36upx 30upx;
			position: relative;
			
			&:active,
			&.active {
				background-color: none;
			}
			
			.avatar-container{
				height: 90upx;
				width: 90upx;
				border-radius: 4px;
				margin-right: 20upx;
				position: relative;
			}
			image {
				height: 90upx;
				width: 90upx;
				// border-radius: 4px;
				// margin-right: 20upx;
			}
	
			&>view {
				line-height: 40upx;
	
				.time,
				.info {
					font-size: 14px;
					font-weight: 400;
					color: rgba(255,255,255,0.8);
					font-size: 24upx;
				}
	
				.time {
					width: 150upx;
					text-align: right;
				}
	
				.info {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	
		&>view:not(:first-child) {
			margin-top: 1px;
	
			&::after {
				content: '';
				display: block;
				height: 0;
				border-top: #1F3A69 solid 1px;
				width: 620upx;
				position: absolute;
				top: -1px;
				right: 0;
				transform:scaleY(0.5);	/* 1px像素 */
			}
		}
	}
	
	/* 遮罩 */
	.shade {
		position: fixed;
		z-index: 100;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		-webkit-touch-callout: none;
	
		.pop {
			position: fixed;
			z-index: 101;
			width: 200upx;
			box-sizing: border-box;
			font-size: 28upx;
			text-align: left;
			color: #333;
			background-color: #fff;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
			line-height: 80upx;
			transition: transform 0.15s ease-in-out 0s;
			user-select: none;
			-webkit-touch-callout: none;
			transform: scale(0, 0);
	
			&.show {
				transform: scale(1, 1);
			}
	
			&>view {
				padding: 0 20upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				user-select: none;
				-webkit-touch-callout: none;
	
				&:active {
					background-color: #f3f3f3;
				}
			}
		}
	}
</style>