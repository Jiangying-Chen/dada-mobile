<template>
	<view>
		<block v-for="(item, index) in list" :key="index">
			<view @click="jump(item)">
				<view class="post-item">
					<view class="post-item-top-user">
						<view @click.stop="toUcenter(item.uid)">
							<u-avatar class="avatar" :src="item.userInfo.avatar" :show-level='item.userInfo.type == 1' 
								></u-avatar>

						</view>
						<view class="center">
							<view style="display: flex;align-items: center;">
								<text v-if="item.userInfo.type == 1" class="official">官方</text>
								<text class="username">{{ item.userInfo.username.substring(0, 12) }}</text>
								<image src="../../static/vip/vipIcon.png" class="image" v-if="item.userInfo.vip==1" />
								
								<text v-if="showTag&&item.postTop>0" class="officials"><u-icon name="arrow-upward"></u-icon>置顶</text>
								<text v-if="showTag&&item.status==1" class="officials">审核中</text>
								<text v-if="showTag&&item.status==2" class="officials">已下架</text>
							</view>
							<view>
								<text class="time">{{ item.createTime | timeFormat}}</text>
							</view>
						</view>
						<view class="right">
							<!-- 圈主 -->
							<view  v-if="handle && sessionUid == uid" @tap.stop="onActive(item, index)">
								<u-icon class="arrow-down" size="40" name="more-dot-fill"></u-icon>
							</view>
							<!-- 圈子管理员 -->
							<view v-else-if="admin" @tap.stop="onActive(item, index)">
								<u-icon class="arrow-down" size="40" name="more-dot-fill"></u-icon>
							</view>
							<!-- 帖子发布者 -->
							<view v-else-if="sessionUid == item.uid" @tap.stop="onActive(item, index)">
								<u-icon class="arrow-down" size="40" name="more-dot-fill"></u-icon>
							</view>
							<!-- 普通用户 -->
							<view style="display: none;" v-else @tap.stop="onActive2(item, index)">
								<u-icon class="arrow-down" size="40" name="more-dot-fill"></u-icon>
							</view>
						</view>
					</view>
					<!-- <text class="discuss-title" :data-id="item.discussId" v-if="item.discussId > 0"
						@tap.stop="toDiscuss">#{{ item.discussTitle }}</text> -->
					<view class="post-content" v-if="item.type != 3">
						<view class="" style="font-weight: bold;"> {{item.title}}</view>
						<!-- <u-parse :html="item.content"></u-parse> -->
						<rich-text class="post-text" :nodes="item.content| formatRich"></rich-text>
						<!-- 帖子类型 -->
						<!--  -->
						<block v-if="item.type == 1">
							<!--一张图片-->
							<block v-if="item.media.length == 1">
								<image :lazy-load="true" mode="aspectFill" class="img-style-1" :src="item.media[0]"
									@tap.stop="previewImage(item.media[0], item.media)"></image>
							</block>
							
							
							<!--二张图片-->
							<block v-else-if="item.media.length == 2">
								<view class="img-style-2">
									<image :lazy-load="true" v-for="(mediaItem, index2) in item.media" :key="index2"
										@tap.stop="previewImage(mediaItem, item.media)" mode="aspectFill"
										:src="mediaItem"></image>
								</view>
							</block>
							<!--四张图片-->
							<block v-else-if="item.media.length == 4">
								<view class="img-style-4">
									<image :lazy-load="true" v-for="(mediaItem, index2) in item.media" :key="index2"
										@tap.stop="previewImage(mediaItem, item.media)" mode="aspectFill"
										:src="mediaItem"></image>
								</view>
							</block>
							<block v-else>
								<view class="other-img-flex" :class="imageClass[item.media.length]">
									<view :class="'wrap-style ' + 'wrap-style-' + (imageIndex + 1)" v-for="(image, imageIndex) in item.media" :key="imageIndex">
										<image class="show-flex" mode="aspectFill" :src="item.media[imageIndex]" @tap.stop="previewImage(image, item.media)"></image>
									</view>
								</view>
							</block>
							
						</block>
						<!-- 视频 aliyun qiniu-->
						<view class="video-wrap" v-if="item.type == 2 && item.media.length > 0">
							<image class="icon" src="/static/play.png"></image>
							<!-- 如果使用阿里云存储打开如下两行代码注释 -->
							<!-- <image mode="aspectFill" v-if="item.cut == 1" :src="item.media[0] + '?x-oss-process=video/snapshot,t_0,f_jpg'">
						    <image mode="aspectFill" v-else :src="item.media[0] + '?x-oss-process=video/snapshot,t_0,f_jpg'"> -->
							<!-- 如果使用七牛云存储打开如下两行代码注释 -->
							<image mode="aspectFill" v-if="item.cut == 1" :src="item.media[0]"></image>
							<image mode="aspectFill" v-else :src="item.media[0] + '?vframe/jpg/offset/1'"></image>
						</view>
					</view>
					<view class="post-content" v-if="item.type === 3">
						<rich-text class="post-text" :nodes="item.title"></rich-text>
						<block>
							<block v-if="item.media.length===1">
								<image :lazy-load="true" mode="aspectFill" class="img-style-1" :src="item.media[0]"
									@tap.stop="previewImage(item.media[0], item.media)"></image>
							</block>
						</block>
					</view>
					<!-- 投票 -->
					<view v-if="item.type === 4" class="vote-box">
						<view class="title">{{item.voteInfo.title}}</view>
						<view class="expire-time">截止：{{item.voteInfo.time }}</view>
						<view class="vote-item" v-for="(item2,index2) in item.voteInfo.options" :key="index2">
							{{item2.content}}
						</view>
					</view>
					<!-- 圈子 -->
					<!-- <view class="topic" v-if="showTopic">
						<u-icon class="topic-icon" name="moments-circel-fill"></u-icon>
						<text>官方圈子</text>
					</view> -->
					<!-- 位置 -->
					<view class="address" v-if="item.address">
						<u-icon class="icon" name="map-fill"></u-icon>
						<text>{{ item.address }}</text>
					</view>
					<!-- 底部 -->
					<view class="p-footer">
						<view class="p-item margin50">
							<text class="iconfont icon-pinglun"></text>
							<text class="count">{{ item.commentCount }}</text>
						</view>
						<!-- <view class="p-item margin50">
							<text class="iconfont icon-yuedu"></text>
							<text class="count">{{ item.readCount }}</text>
						</view> -->
						<view v-if="item.isCollection" class="p-item" @click.stop="cancelCollection(item.id,index)">
							<u-icon name="thumb-up-fill" color="#6422EF"></u-icon>
							<text class="count" style="color:#6422EF">{{ item.collectionCount }}</text>
						</view>
						<view v-if="!item.isCollection" class="p-item" @click.stop="addCollection(item.id,index)">
							<u-icon name="thumb-up"></u-icon>
							<text class="count">{{ item.collectionCount }}</text>
						</view>
					</view>
				</view>
			</view>
			
			
		</block>
		<!-- 操作弹窗 -->
		<u-action-sheet :list="actionList" v-model="showAction" @click="actionCon"></u-action-sheet>
		<!-- 加载状态 -->
		<block v-if="list.length === 0 && loadStatus == 'nomore'">
			<u-empty margin-top="100" text="暂无内容" mode="favor"></u-empty>
		</block>
		<block v-else>
			<view style="margin: 30rpx 0;">
				<u-loadmore :status="loadStatus" color='#ffffff'/>
			</view>
		</block>
	</view>
</template>

<script>
	import linfengAd from "../../components/linfeng-ad/linfeng-ad.vue"
	export default {
		name: 'post-list',
		props: {
			list: Array,
			loadStatus: String,
			handle: {
				default: false,
				type: Boolean
			},
			showTopic: {
				default: true,
				type: Boolean
			},
			uid: Number,
			admin: {
				default: false,
				type: Boolean
			},
			//是否显示红色置顶状态
			showTag: false,
			//流量主总开关0关闭1开启
			open: {
			      type: String,
			      default: '0'
			},
			h5Adpid: {
				type: String,
				default: '1818425366'
			},
			wxAdpid: {
				type: String,
				default: '1872486102'
			},
			//帖子列表页是否展示流量主广告
			openAd: {
			      type: Boolean,
			      default: false
			},
		},
		filters: {
			formatRich(val){
				return "<div style='overflow : hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 4; -webkit-box-orient: vertical;word-break: break-all;'>" + val + "</div>"
			}
		},
		data() {
			return {
				showAction: false,
				actionList: [{
					text: '关注',
					key: 'follow'
				}, {
					text: '举报',
					key: 'report'
				}],
				choosePost: '',
				chooseIndex: '',
				sessionUid: '',
				isVip: 0,
				imageClass: ['', 'one-img', 'two-img', 'three-img', 'four-img', 'five-img', 'six-img', 'seven-img',
					'eight-img', 'nine-img'
				]
			};
		},
		watch: {
			uid(n) {
				if (this.sessionUid == n && this.handle) {
					//圈主
					this.actionList.unshift({
						text: '置顶',
						key: 'top'
					});
					this.actionList.unshift({
						text: '删除',
						color: 'red',
						key: 'delete'
					});
				} else if (this.admin) {
					//圈子管理员
					this.actionList.unshift({
						text: '删除',
						color: 'red',
						key: 'delete'
					});

				}
			}
		},
		created() {
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.sessionUid = userInfo.uid;
				this.isVip = uni.getStorageSync('userInfo').vip
			}
		},
		methods: {

			copyPageUrl(id) {
				let that = this;
				uni.setClipboardData({
					data: this.$c.shareH5Url + 'pages/post/detail?id=' + id,
					success: function() {
						uni.hideToast();
						that.$f.toast('复制成功', 'success');
						that.showShare = false;
					}
				});
			},
			onActive(postInfo, index) {
				this.showAction = true;
				this.choosePost = postInfo;
				this.chooseIndex = index;
				if (this.sessionUid == this.choosePost.uid && !this.admin) {
					//帖子发布者
					this.actionList = this.actionList.filter(item => item.key != 'delete' && item.key != 'cancelFollow' &&
						item.key != 'follow')
					this.actionList.unshift({
						text: '删除',
						color: 'red',
						key: 'delete'
					});
				} else {
					
					//圈子管理员或圈主
					if (postInfo.isFollow) {
						this.actionList = this.actionList.filter(item => item.key != 'cancelFollow' && item.key !=
							'follow')
						this.actionList.unshift({
							text: '取消关注',
							key: 'cancelFollow'
						});
					} else {
						this.actionList = this.actionList.filter(item => item.key != 'cancelFollow' && item.key !=
							'follow')
						this.actionList.unshift({
							text: '关注',
							key: 'follow'
						});
					}
				}
			},
			//普通用户触发
			onActive2(postInfo, index) {
				if (postInfo.isFollow) {
					this.actionList = this.actionList.filter(item => item.key != 'cancelFollow' && item.key != 'follow')
					this.actionList.unshift({
						text: '取消关注',
						key: 'cancelFollow'
					});
				} else {
					this.actionList = this.actionList.filter(item => item.key != 'cancelFollow' && item.key != 'follow')
					this.actionList.unshift({
						text: '关注',
						key: 'follow'
					});
				}
				this.showAction = true;
				uni.hideTabBar();
				this.choosePost = postInfo;
				this.chooseIndex = index;
				this.actionList = this.actionList.filter(item => item.key != 'delete')
			},
			actionCon(index) {
				let key = this.actionList[index].key;
				if (key == 'follow') {
					this.follow();
				} else if (key == 'cancelFollow') {
					this.cancelFollow();
				} else if (key == 'delete') {
					this.postDel();
				} else if (key == 'top') {
					this.postTop();
				} else if (key == 'report') {
					this.report();
				}
			},
			report() {
				uni.navigateTo({
					url: '/pages/report/report?postId=' + this.choosePost.id + '&uid=' + this.choosePost.uid
				})
			},
			cancelCollection(id, index) {
				this.$H
					.post('post/cancelCollection', {
						id: id
					})
					.then(res => {
						if (res.code === 0) {
							this.list[index].isCollection = false;
							this.list[index].collectionCount--;
						}
					});
			},
			addCollection(id, index) {
				this.$H
					.post('post/addCollection', {
						id: id,
						uid: this.list[index].uid
					})
					.then(res => {
						if (res.code === 0) {
							this.list[index].isCollection = true;
							this.list[index].collectionCount++;
						}
					});
			},
			// 置顶帖子
			postTop() {
				this.$H
					.post('post/setPostTop', {
						postId: this.choosePost.id,
						topicId: this.choosePost.topicId
					})
					.then(res => {
						if (res.code == 0) {
							this.$f.toast('成功设为置顶', 'success');
						}
					});

			},
			postDel() {
				this.$H
					.post('post/del', {
						id: this.choosePost.id
					})
					.then(res => {
						if (res.code == 0) {
							this.list.splice(this.chooseIndex, 1);
						}
					});
			},
			follow() {
				this.$H
					.post('user/addFollow', {
						id: this.choosePost.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.list[this.chooseIndex].isFollow = true;
							this.$u.toast(res.msg);
						}
					});
			},
			cancelFollow() {
				this.$H
					.post('user/cancelFollow', {
						id: this.choosePost.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.list[this.chooseIndex].isFollow = false;
							this.$u.toast(res.msg);
						}
					});
			},
			previewImage(url, urls) {
				uni.previewImage({
					current: url, // 当前显示图片的http链接
					urls: urls // 需要预览的图片http链接列表
				});
			},
			jumpTopic(id) {
				uni.navigateTo({
					url: '/pages/topic/detail?id=' + id
				});
			},

			jump(e) {
				let url;

				// 图文
				if (e.type == 1 || e.type == 4) {
					if (e.cut == 0) {
						url = '/pages/post/detail?id=' + e.id;
					} else {
						this.$H.post('post/getVipPostInfo', {
							postId: e.id
						}).then(res => {
							if (res.result.isBuy) {
								url = '/pages/post/detail?id=' + e.id;
							} else {
								url = '/pages/post/confirm?id=' + e.id + '&type=' + e.type;
							}
							uni.navigateTo({
								url: url
							})
						});
					}

				}
				//长文
				if(e.type == 3){
					url = '/subpages/content/article/article?id=' + e.id;
				}

				//视频
				if (e.type == 2) {
					// #ifdef APP-PLUS
					if (e.cut == 0) {
						url = '/pages/post/detail?id=' + e.id;
					} else {
						this.$H.post('post/getVipPostInfo', {
							postId: e.id
						}).then(res => {
							if (res.result.isBuy) {
								url = '/pages/post/detail?id=' + e.id;
							} else {
								url = '/pages/post/confirm?id=' + e.id + '&type=' + e.type;
							}
							uni.navigateTo({
								url: url
							})
						});

					}
					// #endif
					// #ifndef APP-PLUS
					if (e.cut == 0) {
						url = '/pages/post/video-detail?id=' + e.id;
					} else {
						this.$H.post('post/getVipPostInfo', {
							postId: e.id
						}).then(res => {
							if (res.result.isBuy) {
								url = '/pages/post/video-detail?id=' + e.id;
							} else {
								url = '/pages/post/confirm?id=' + e.id + '&type=' + e.type;
							}
							uni.navigateTo({
								url: url
							})
						});

					}
					// #endif

				}

				uni.navigateTo({
					url: url
				})
			},
			toDiscuss(e) {
				uni.navigateTo({
					url: '/pages/discuss/detail?id=' + e.currentTarget.dataset.id
				});
			},
			toUcenter(uid) {
				uni.navigateTo({
					url: '/pages/user/home?uid=' + uid
				});
			}
		}
	};
</script>

<style lang="scss" scoped>

	.post-item {
		background:$bg-color-light;
		padding: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		margin:0 12px 12px;
		.post-content {
			margin-top: 20rpx;
			color:$text-color-base;
			.img-style-1 {
				display: block;
				width: 100%;
				max-height: 600rpx;
				border-radius: 5px;
				overflow: hidden;
			}

			.img-style-2 {
				display: flex;
				image {
					margin: 5rpx;
					border-radius: 5px;
					width: 100%;
					height: 294rpx;
				}
			}

			.img-style-3 {
				display: flex;
				flex-wrap: wrap;
				image {
					width: 31.3%;
					height: 200rpx;
					margin: 1%;
					border-radius: 5px;
				}
			}

			.img-style-4 {
				display: flex;
				flex-wrap: wrap;
				image {
					width: 48%;
					height: 320rpx;
					margin: 0.5%;

				}
			}
		}

		.address {
			display: flex;
			font-size: 26rpx;
			background-color: #f0f0f0;
			border-radius: 20rpx;
			display: inline-block;
			padding: 5rpx 20rpx;
			margin: 20rpx 0;

			.icon {
				margin-right: 5rpx;
			}
		}

		.topic {
			display: flex;
			font-size: 22rpx;
			background-color: $themes-color;
			border-radius: 20rpx;
			display: inline-block;
			padding: 5rpx 20rpx;
			margin: 20rpx 0;
			color: #F4F4F5;

			.topic-icon {
				margin-right: 5rpx;
			}
		}
	}

	.post-item-top-user {
		display: flex;
		align-items: center;

		.avatar {
			width: 85rpx;
			height: 85rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}

		.center {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 24rpx;
			color: #999;
			.username {
				font-size: 32rpx;
				font-weight: 600;
				color: $text-color-base;
			}
			.time{
				color: $text-color-base;
			}

			.official {
				display: inline-block;
				font-size: 20rpx;
				color: #ffffff;
				//background-color: $themes-color;
				background-color: #6322EF;
				padding: 3rpx 10rpx;
				border-radius: 10rpx;
				margin-right: 10rpx;
				font-weight: 600;
			}

			.officials {
				display: inline-block;
				font-size: 25rpx;
				color: #ffffff;
				background-color: #6322EF;
				padding: 5rpx 10rpx;
				border-radius: 10rpx;
				margin-left: auto;
			}

			.image {
				width: 0.50 * 100rpx;
				height: 0.50 * 100rpx;
				margin-left: 0.05 * 100rpx;
			}
		}

		.right {
			height: 85rpx;

			.arrow-down {
				color: #999;
				margin-left: 40rpx;
			}
		}
	}

	.post-text {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		height: auto;
		// width: auto;
		// display: block;
		// display: -webkit-box;
		// -webkit-box-orient: vertical;
		// -webkit-line-clamp: 5;
		// white-space: nowrap;
		// overflow: hidden;
	}

	.discuss-title {
		height: 30rpx;
		padding: 10rpx;
		line-height: 30rpx;
		border-radius: 20rpx;
		font-size: 12px;
		background: #f5f5f9;
		color: #1d9ffc;
		text-align: center;
	}

	.p-footer {
		display: flex;
		border-top: 1px solid #B2B1FE;
		margin: 20rpx 0 0;
		padding-top: 10rpx;
		color:$text-color-base;
		.p-item {
			margin: 0 auto;
			color:$text-color-base;
			display: flex;
			align-items: center;

			.count {
				margin-left: 10rpx;
				font-size: 28rpx;
			}
		}

		.p-item[hidden] {
			display: none !important;
		}
	}

	.comment-wrap {
		font-size: 28rpx;
		padding-top: 20rpx;
		border-top: 1px solid #F5F5F5;

		.item {
			.name {
				color: #000;
				font-weight: 600;
			}
		}
	}

	.video-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		height: 500rpx;

		.icon {
			width: 100rpx;
			height: 100rpx;
			z-index: 999;
		}

		image {
			position: absolute;
		}
	}

	// 投票
	.vote-box {
		background-color: #F5F5F5;
		border-radius: 20rpx;
		padding: 20rpx;
		margin: 20rpx;

		.title {
			font-weight: bold;
		}

		.expire-time {
			font-size: 24rpx;
			margin: 20rpx 0;
		}

		.vote-item {
			font-size: 24rpx;
			font-weight: bold;
			padding: 20rpx;
			border-radius: 20rpx;
			border: 1px solid #999;
			text-align: center;
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}
	
	.other-img-flex {
		display: flex;
		align-items: center;
		position: relative;
		margin: 10rpx 0;
		width: 674rpx;
		.wrap-style .show-flex {
			width: 100%;
			height: 100%;
		}
	}
	
	.two-img {
		justify-content: space-between;
		align-items: center;
	}
	
	.two-img .wrap-style-1, 
	.two-img .wrap-style-2 {
		height: 332rpx;
		width: 332rpx;
	}
	
	.two-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 0 0 12rpx;
	}
	
	.two-img .wrap-style-2 .show-flex {
		border-radius: 0 12rpx 12rpx 0;
	}
	
	.three-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}
	
	.three-img .wrap-style-1,
	.three-img .wrap-style-2, 
	.three-img .wrap-style-3 {
		height: 332rpx;
		width: 332rpx;
	}
	
	.three-img .wrap-style-1 {
		height: 446rpx;
		width: 674rpx;
		margin-bottom: 10rpx;
	}
	
	.three-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 12rpx 0 0;
	}
	
	.three-img .wrap-style-2 .show-flex {
		border-radius: 0 0 0 12rpx;
	}
	
	.three-img .wrap-style-3 .show-flex {
		border-radius: 0 0 12rpx 0;
	}
	
	.four-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}
	
	.four-img .wrap-style-1, 
	.four-img .wrap-style-2, 
	.four-img .wrap-style-3, 
	.four-img .wrap-style-4 {
		height: 218rpx;
		width: 218rpx;
	}
	
	.four-img .wrap-style-1 {
		height: 446rpx;
		width: 674rpx;
		margin-bottom: 10rpx;
	}
	
	.four-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 12rpx 0 0;
	}
	
	.four-img .wrap-style-2 .show-flex {
		border-radius: 0 0 0 12rpx;
	}
	
	.four-img .wrap-style-3 .show-flex {
		border-radius: 0 0 12rpx 0;
	}
	
	.five-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}
	
	.five-img .wrap-style-1, 
	.five-img .wrap-style-2, 
	.five-img .wrap-style-3, 
	.five-img .wrap-style-4, 
	.five-img .wrap-style-5 {
		height: 332rpx;
		width: 332rpx;
	}
	
	.five-img .wrap-style-1 {
		height: 446rpx;
		width: 446rpx;
		margin-bottom: 10rpx;
	}
	
	.five-img .wrap-style-2 {
		height: 218rpx;
		width: 218rpx;
		margin-top: -238rpx;
	}
	
	.five-img .wrap-style-3 {
		height: 218rpx;
		width: 218rpx;
		position: absolute;
		right: 0;
		top: 228rpx;
	}
	
	.five-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 0 0 0;
	}
	
	.five-img .wrap-style-2 .show-flex {
		border-radius: 0 12rpx 0 0;
	}
	
	.five-img .wrap-style-4 .show-flex {
		border-radius: 0 0 0 12rpx;
	}
	
	.five-img .wrap-style-5 .show-flex {
		border-radius: 0 0 12rpx 0;
	}
	
	.six-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}
	
	.six-img .wrap-style-1, 
	.six-img .wrap-style-2, 
	.six-img .wrap-style-3, 
	.six-img .wrap-style-4, 
	.six-img .wrap-style-5,
	.six-img .wrap-style-6 {
		height: 218rpx;
		width: 218rpx;
	}
	
	.six-img .wrap-style-1 {
		height: 446rpx;
		width: 446rpx;
		margin-bottom: 10rpx;
	}
	
	.six-img .wrap-style-2 {
		margin-top: -238rpx;
	}
	
	.six-img .wrap-style-3 {
		position: absolute;
		right: 0;
		top: 228rpx;
	}
	
	.six-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 0 0 0;
	}
	
	.six-img .wrap-style-2 .show-flex {
		border-radius: 0 12rpx 0 0;
	}
	
	.six-img .wrap-style-4 .show-flex {
		border-radius: 0 0 0 12rpx;
	}
	
	.six-img .wrap-style-6 .show-flex {
		border-radius: 0 0 12rpx 0;
	}
	
	.seven-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}
	
	.seven-img .wrap-style-1,
	.seven-img .wrap-style-2,
	.seven-img .wrap-style-3,
	.seven-img .wrap-style-4,
	.seven-img .wrap-style-5,
	.seven-img .wrap-style-6,
	.seven-img .wrap-style-7 {
		height: 218rpx;
		width: 218rpx;
		margin-bottom: 10rpx;
	}
	
	.seven-img .wrap-style-1 {
		height: 446rpx;
		width: 674rpx;
	}
	
	.seven-img .wrap-style-5,
	.seven-img .wrap-style-6,
	.seven-img .wrap-style-7 {
		margin: 0;
	}
	
	.seven-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 12rpx 0 0;
	}
	
	.seven-img .wrap-style-5 .show-flex {
		border-radius: 0 0 0 12rpx;
	}
	
	.seven-img .wrap-style-7 .show-flex {
		border-radius: 0 0 12rpx 0;
	}
	
	.eight-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}
	
	.eight-img .wrap-style-1,
	.eight-img .wrap-style-2,
	.eight-img .wrap-style-3,
	.eight-img .wrap-style-4,
	.eight-img .wrap-style-5,
	.eight-img .wrap-style-6,
	.eight-img .wrap-style-7,
	.eight-img .wrap-style-8 {
		height: 218rpx;
		width: 218rpx;
		margin-bottom: 10rpx;
	}
	
	.eight-img .wrap-style-6,
	.eight-img .wrap-style-7,
	.eight-img .wrap-style-8 {
		margin: 0;
	}
	
	.eight-img .wrap-style-1,
	.eight-img .wrap-style-2 {
		height: 332rpx;
		width: 332rpx;
	}
	
	.eight-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 0 0 0;
	}
	
	.eight-img .wrap-style-2 .show-flex {
		border-radius: 0 12rpx 0 0;
	}
	
	.eight-img .wrap-style-6 .show-flex {
		border-radius: 0 0 0 12rpx;
	}
	
	.eight-img .wrap-style-8 .show-flex {
		border-radius: 0 0 12rpx 0;
	}
	
	.nine-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}
	
	.nine-img .wrap-style-1,
	.nine-img .wrap-style-2,
	.nine-img .wrap-style-3,
	.nine-img .wrap-style-4,
	.nine-img .wrap-style-5,
	.nine-img .wrap-style-6,
	.nine-img .wrap-style-7,
	.nine-img .wrap-style-8,
	.nine-img .wrap-style-9 {
		height: 218rpx;
		width: 218rpx;
		margin-bottom: 10rpx;
	}
	
	.nine-img .wrap-style-7,
	.nine-img .wrap-style-8,
	.nine-img .wrap-style-9 {
		margin: 0;
	}
	
	.nine-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 0 0 0;
	}
	
	.nine-img .wrap-style-3 .show-flex {
		border-radius: 0 12rpx 0 0;
	}
	
	.nine-img .wrap-style-7 .show-flex {
		border-radius: 0 0 0 12rpx;
	}
	
	.nine-img .wrap-style-9 .show-flex {
		border-radius: 0 0 12rpx 0;
	}
</style>
