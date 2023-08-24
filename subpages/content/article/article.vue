<template>
	<view class="article-container">
		<view class="content">
			<view class="detail">
				<view class="title">{{ articleDetail.title }}</view>
				<view class="info">
					<view class="author-info" @click="jumpUser(articleDetail.userInfo.uid)">
						<text class="username">{{ articleDetail.userInfo.username }}</text>
						<text class="date hidden">{{ articleDetail.createTime | timeFormat}}</text>
					</view>
					<view class="read">浏览 {{ articleDetail.readCount }}</view>
				</view>

				<view class="desc">
					<mp-html :content="articleDetail.content" />
				</view>
			</view>

			<view class="float-empty"></view>
			<view class="comment-bar">
				<view class="input" @tap="openCommentPop"><text>发表评论</text></view>
				<view class="operate">
					<view class="info" hover-class="none" @click="openCommentPop">
						<image src="/static/images/comment.png"></image>
						<text class="count"
							v-if="articleDetail.commentCount > 0">{{ articleDetail.commentCount }}</text>
					</view>
					<view class="like">
						<image @tap="addCollection()" v-show="!articleDetail.isCollection" src="/static/images/unlike.png">
						</image>
						<image @tap="cancelCollection()" v-show="articleDetail.isCollection" src="/static/images/like.png">
						</image>
						<text class="count"
							v-if="articleDetail.collectionCount > 0">{{ articleDetail.collectionCount }}</text>
					</view>
					<button class="share" @click="share">
						<image src="/static/images/share-article.png"></image>
					</button>
				</view>
			</view>
			<!-- 评论弹窗 -->
			<lf-popup v-model="commentPopup" height="50vh">
				<scroll-view scroll-y style="height: 45vh;" @scrolltolower="reachBottom">
					<view class="comment-box">
						<view class="title">评论（{{ articleDetail.commentCount }}）</view>
						<view style="margin-bottom: 40rpx;" v-for="(item, index) in commentList" :key="index">
							<!-- 评论列表 -->
							<view class="comment-item" @longpress="delComment(item, index)">
								<image @click="jumpUser(item.userInfo.uid)" class="avatar" :src="item.userInfo.avatar">
								</image>
								<view class="c-content" @click="onReply(item)">
									<view class="user">
										<text>{{ item.userInfo.username }}</text>
										<block v-if="item.isThumbs">
											<view @click.stop="cancelThumbs(item.id, index)" class="thumbs">
												<text class="num">{{ item.thumbs }}</text>
												<u-icon class="icon" size="40" name="heart-fill" color="#e62e00">
												</u-icon>
											</view>
										</block>
										<block v-else>
											<view @click.stop="onThumbs(item.id, index)" class="thumbs">
												<text class="num">{{ item.thumbs }}</text>
												<u-icon class="icon" size="40" name="heart-fill" color="#bfbfbf">
												</u-icon>
											</view>
										</block>
									</view>
									<text class="c-txt">{{ item.content }}</text>
									<text class="time">{{ item.createTime | timeFormat }}</text>
								</view>
							</view>
							<view @click="onReply(item2, index, index2)" v-if="item.children.length > 0"
								v-for="(item2, index2) in item.children" :key="item2.id"
								@longpress="delComment(item2, index, index2)" class="sub-comment-item">
								<view class="user">
									<u-avatar class="avatar" :size="40" :src="item2.userInfo.avatar"></u-avatar>
									<view class="u-head">
										<text>{{ item2.userInfo.username }}</text>
										<block v-if="item2.isThumbs">
											<view class="thumbs" @click.stop="cancelThumbs(item2.id, index, index2)">
												<text class="num">{{ item2.thumbs }}</text>
												<u-icon class="icon" size="40" name="heart-fill" color="#e62e00">
												</u-icon>
											</view>
										</block>
										<block v-else>
											<view class="thumbs" @click.stop="onThumbs(item2.id, index, index2)">
												<text class="num">{{ item2.thumbs }}</text>
												<u-icon class="icon" size="40" name="heart-fill" color="#bfbfbf">
												</u-icon>
											</view>
										</block>
									</view>
								</view>
								<view class="reply">
									<text>@</text>
									<navigator :url="'/pages/user/home?uid=' + item2.toUser.uid" hover-class="none"
										class="name">{{ item2.toUser.username }}</navigator>
									<text>：{{ item2.content }}</text>
									<view class="time">{{ item2.createTime | timeFormat }}</view>
								</view>
							</view>
						</view>
						<!-- 加载状态 -->
						<block v-if="commentList.length > 0">
							<view style="margin: 30rpx;">
								<u-loadmore :status="loadStatus" />
							</view>
						</block>
						<block v-else>
							<u-empty text="暂无评论" mode="message"></u-empty>
						</block>
						<view style="height: 100rpx;"></view>
					</view>
				</scroll-view>
				<!-- 评论输入框 -->
				<view class="comment-tool">
					<textarea :placeholder="placeholder" @blur="onBlur" :focus="focus" fixed="true" cursor-spacing="10"
						v-model="form.content" auto-height="true" placeholder-class="txt-placeholder"></textarea>
					<u-button @click="addComment" :disabled="isSubmitD">发布</u-button>
				</view>
			</lf-popup>

			<!-- 分享选择弹窗 -->
			<lf-popup v-model="showShare" height="240rpx">
				<view class="share-wrap" @click="closeShare">
					<!-- #ifdef MP-WEIXIN -->
					<button open-type="share" class="share-item u-reset-button">
						<image src="/static/wechat.png"></image>
						<text>微信好友</text>
					</button>
					<!-- #endif -->
					<!-- #ifdef H5 || APP-PLUS -->
					<view class="share-item2" @click="copyPageUrl">
						<image src="/static/images/share.png"></image>
						<text>分享链接</text>
					</view>
					<!-- #endif -->
					<!-- #ifdef H5 || MP-WEIXIN -->
					<view class="share-item" @click="shareCanvas">
						<image src="/static/images/share2.png"></image>
						<text>分享海报</text>
					</view>
					<!-- #endif -->
				</view>
			</lf-popup>
			<!-- 分享海报弹窗-->
			<u-popup v-model="showCanvas" mode="center" width="80%">
				<view class="share-box">
					<image :src="posterUrl" class="images"></image>
				</view>
				<view class="footer">
					<u-button :custom-style="shareBtnStyle" @click="saveImg" type="success" shape="circle">保存分享</u-button>
				</view>
			</u-popup>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				id: 0,
				articleDetail: {
					comment: [],
					media: [],
					commentList: {
						data: []
					},
					topicInfo: {
						topicName: ''
					},
					userInfo: {

					},
					voteInfo: {}
				},
				commentPopup: false,
				commentList: [],
				focus: false,
				placeholder: '说点什么...',
				page: 1,
				form: {
					pid: 0,
					type: 1,
					toUid: '',
					postId: '',
					content: ''
				},
				loadStatus: 'loadmore',
				isSubmitD: false,
				showShare: false,
				showCanvas: false,
				shareBtnStyle: {
					backgroundColor: '#333'
				},
				posterUrl:"",
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
			}
			this.getArticleDetail();
			this.getCommentList();
			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			//#endif
		},
		methods: {
			getArticleDetail() {
				uni.showLoading({
					mask: true,
					title: '加载中'
				});
				this.$H
					.get('post/detail', {
						id: this.id
					})
					.then(res => {
						if (res.code == 500) {
							uni.hideLoading();
							this.$u.toast(res.msg);
							setTimeout(function() {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}, 1500);
						} else {
							//这里一定要再判断是否为长文
							if(res.result.type!=3){
								uni.redirectTo({
									url:'/pages/post/detail?id='+this.id
								})
							}
							this.articleDetail = res.result;
							uni.setNavigationBarTitle({
								title: this.articleDetail.title
							});
							uni.setNavigationBarColor({
							    frontColor: '#ffffff',
							    backgroundColor: '#ACA3E0',
							    animation: {
							        duration: 400,
							        timingFunc: 'easeIn'
							    }
							})

							uni.hideLoading();
						}

					});
			},
			cancelCollection() {
				this.$H
					.post('post/cancelCollection', {
						id: this.id
					})
					.then(res => {
						if (res.code === 0) {
							this.articleDetail.isCollection = false;
							this.articleDetail.collectionCount--;
						}
					});
			},
			addCollection() {
				this.$H
					.post('post/addCollection', {
						id: this.id,
						uid: this.articleDetail.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.articleDetail.isCollection = true;
							this.articleDetail.collectionCount++;
						}
					});
			},
			openCommentPop() {
				this.commentPopup = true
			},
			delComment(e, index, index2) {
				let that = this;
				let user = uni.getStorageSync("userInfo");

				if (e.uid != user.uid) {
					return;
				}
				that.commentPopup = false;
				uni.showModal({
					title: '提示',
					content: '确定删除该评论？',
					success: function(res) {
						if (res.confirm) {
							that.$H
								.post('comment/del', {
									id: e.id
								})
								.then(res2 => {
									if (res2.code == 0) {
										if (index2 || index2 === 0) {
											that.commentList[index].children.splice(index2, 1);
										} else {
											that.commentList.splice(index, 1);
										}
										that.articleDetail.commentCount--;
									}
								});
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			// 评论触底
			reachBottom() {
				this.page++;
				this.getCommentList();
			},
			jumpUser(uid) {
				uni.navigateTo({
					url: '/pages/user/home?uid=' + uid
				});
			},
			getCommentList() {
				this.loadStatus = 'loading';
				this.$H
					.get('comment/list', {
						postId: this.id,
						page: this.page
					})
					.then(res => {
						if (res.code == 0) {
							this.commentList = this.commentList.concat(res.result.data);

							if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
								this.loadStatus = 'nomore';
							} else {
								this.loadStatus = 'loadmore';
							}
						}
					});
			},
			// 点赞
			onThumbs(id, index, index2) {
				this.$H
					.post('comment/thumbs', {
						id: id
					})
					.then(res => {
						if (res.code == 0) {
							if (index2 || index2 == 0) {
								this.commentList[index].children[index2].isThumbs = true;
								this.commentList[index].children[index2].thumbs++;
							} else {
								this.commentList[index].isThumbs = true;
								this.commentList[index].thumbs++;
							}
						}
					});
			},
			// 取消点赞
			cancelThumbs(id, index, index2) {
				console.log(index + ',' + index2);
				this.$H
					.post('comment/cancelThumbs', {
						id: id
					})
					.then(res => {
						if (res.code == 0) {
							if (index2 || index2 == 0) {
								this.commentList[index].children[index2].isThumbs = false;
								this.commentList[index].children[index2].thumbs--;
							} else {
								this.commentList[index].isThumbs = false;
								this.commentList[index].thumbs--;
							}
						}
					});
			},
			// 回复评论
			onReply(e) {
				this.placeholder = '回复：' + e.userInfo.username;
				this.focus = true;

				let pid = e.pid;
				if (pid === 0) {
					this.form.pid = e.id;
				} else {
					this.form.pid = e.pid;
				}

				this.form.toUid = e.userInfo.uid;
				this.form.postId = this.id;
			},
			// 输入框失去焦点时
			onBlur() {
				this.placeholder = '说点什么...';
				this.focus = false;
				this.pid = 0;
			},
			addComment() {
				this.isSubmitD = true;
				if (this.form.content == '') {
					this.$u.toast('评论不能为空');
					this.isSubmitD = false;
					return;
				}
				this.form.postId = this.id;
				uni.showLoading({
					mask: true,
					title: '发布中'
				});
				// console.log(JSON.stringify(this.form))
				this.$H.post('post/addComment', this.form).then(res => {
					if (res.code == 0) {
						this.form.content = '';
						this.$u.toast('评论成功');
						this.page = 1;
						this.commentList = [];
						this.getCommentList();
						this.articleDetail.commentCount++;
					}
					this.isSubmitD = false;
					uni.hideLoading();
				});
			},
			onShareAppMessage(res) {
				if (res.from === 'button') {
					// 来自页面内分享按钮
					console.log(res.target);
				}
				let imgURL;
				if (this.articleDetail.media.length > 0) {
					imgURL = this.articleDetail.media[0];
				}
				return {
					title: this.articleDetail.title,
					path: '/subpages/content/article/article?id=' + this.id
				};
			},
			onShareTimeline() {
				let imgURL = (imgURL = this.articleDetail.media[0]);
				return {
					title: this.articleDetail.title,
					query: 'id=' + this.id
				};
			},
			closeShare(){
				this.showShare = false
			},
			copyPageUrl() {
				let that = this;
				uni.setClipboardData({
					data: this.$c.shareH5Url + 'subpages/content/article/article?id=' + this.id,
					success: function() {
						uni.hideToast();
						that.$f.toast('链接复制成功', 'none');
						that.showShare = false;
					}
				});
			},
			// 保存海报到相册
			saveImg() {
				// #ifdef MP-WEIXIN
				uni.getImageInfo({
					src: this.posterUrl,
					success: function(image) {
						uni.saveImageToPhotosAlbum({
							filePath: image.path,
							success: function() {
								uni.showToast({
									title: '图片保存成功'
								});
							},
							fail: function() {
								uni.showModal({
									title: '图片保存失败',
									content: '请确认是否已开启授权',
									confirmText: '开启授权',
									success(res) {
										if (res.confirm) {
											uni.openSetting({
												success(settingdata) {
													if (settingdata.authSetting[
															"scope.writePhotosAlbum"
														]) {
														uni.showToast({
															title: '授权成功，请重试哦~',
															icon: "none"
														});
													} else {
														uni.showToast({
															title: '请确定已打开保存权限',
															icon: "none"
														});
													}
												}
											})
										}
									}
								})
							},
						});
					},
					fail() {}
				});
				// #endif
				// #ifdef H5
				var oA = document.createElement('a');
				oA.download = ''; // 设置下载的文件名，默认是’下载’
				oA.href = this.posterUrl;
				document.body.appendChild(oA);
				oA.click();
				oA.remove(); // 下载之后把创建的元素删除
				// #endif
			},
			// 生成分享海报
			shareCanvas() {
				this.showCanvas=true;
				uni.showLoading({
					mask: true,
					title: '正在生成海报'
				});
				// #ifdef H5
				let origin="h5";
				let url=this.$c.shareH5Url+"subpages/content/article/article?id="+this.id
				// #endif
				// #ifdef MP-WEIXIN
				let origin="weixin";
				let url="subpages/content/article/article?id="+this.id
				// #endif
				this.$H
					.get('post/qrCode', {
						postId: this.id,
						origin: origin,
						url: url
					})
					.then(res => {
						if(res.code==0){
							this.posterUrl = res.result
						}else{
							this.showCanvas=false;
						}
						uni.hideLoading();
					});
			},
			share() {
				this.showShare = true
			},

		}
	}
</script>

<style lang="scss" scoped>
	.article-container {
		height: 100%;
		background: #ffffff;
	}

	.content {
		position: relative;
	}

	.detail {
		padding: 40rpx 32rpx;
		background: #fff;

		.title {
			font-size: 44rpx;
			color: #262626;
			line-height: 70rpx;
			font-weight: bold;
		}

		.info {
			margin-top: 32rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.author-info {
				.username {
					color: #666;
				}

				.date {
					color: #999;
					margin-left: 24rpx;
				}
			}

			.read {
				color: #999;
			}
		}

		.desc {
			margin-top: 56rpx;
			overflow: hidden;
			color: #262626;

			.wxParse {
				color: #262626;
			}
		}
	}

	.comment-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
		background-color: #ffffff;
		box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: row;

		.input {
			flex-grow: 0;
			flex-shrink: 0;
			margin: 20rpx 10rpx 20rpx 20rpx;
			display: flex;
			align-items: center;
			background: #f2f2f2;
			width: 420rpx;
			border-radius: 40rpx 40rpx 0 40rpx;

			text {
				font-size: 32rpx;
				color: #aaa;
				margin-left: 38rpx;
			}
		}

		.operate {
			width: 100%;
			flex-grow: 1;
			flex-shrink: 1;
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-right: 10rpx;

			view,
			navigator {
				display: flex;
				justify-content: space-around;
				align-items: center;
				width: 33%;

				image {
					width: 45rpx;
					height: 45rpx;
				}
			}

			.info,
			.like {
				position: relative;

				.count {
					position: absolute;
					top: -15rpx;
					right: -4rpx;
					background-image: linear-gradient(140deg, #aaaaff 9%, #aa55ff 75%);
					display: flex;
					align-items: center;
					border-radius: 50rpx;
					padding: 0 10rpx;
					font-size: 22rpx;
					color: #fff;
					height: 30rpx;
					line-height: 30rpx;
				}
			}

			.share {
				display: flex;
				justify-content: space-around;
				padding: 0;
				background: transparent;

				image {
					width: 45rpx;
					height: 45rpx;
					border: 0;
				}

				&:after {
					display: none;
				}
			}
		}
	}

	.float-empty {
		height: 120rpx;
		width: 100%;
		display: block;
		background: #fff;
	}

	/*评论列表*/
	.comment-box {
		background-color: #ffffff;
		margin-top: 20rpx;
	}

	.comment-box>.title {
		margin: 20rpx;
	}

	.comment-item {
		display: flex;
		padding: 20rpx;

		&:active {
			background-color: #F5F5F5;
		}

		.c-content {
			display: flex;
			flex-direction: column;
			flex: 1;

			.time {
				color: #999;
				font-size: 10px;
			}

			.user {
				display: flex;

				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					color: #bfbfbf;

					.num {
						margin-right: 10rpx;
					}
				}
			}
		}

		.avatar {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
	}

	.sub-comment-item {
		margin-left: 100rpx;
		padding: 20rpx;

		&:active {
			background-color: #F5F5F5;
		}

		.user {
			display: flex;
			align-items: center;

			.name {
				color: #616161;
			}

			.avatar {
				margin-right: 10rpx;
			}

			.u-head {
				flex: 1;
				display: flex;

				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					color: #bfbfbf;

					.num {
						margin-right: 10rpx;
					}
				}
			}
		}

		.reply {
			.time {
				margin-left: auto;
				font-size: 20rpx;
				color: #999;
			}

			.name {
				display: inline-block;
				color: #2b85e4;
				font-weight: 600;
			}
		}
	}

	/* 评论tool */
	.comment-tool {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		display: flex;
		z-index: 999;
	}

	.comment-tool textarea {
		padding: 20rpx;
		border-radius: 10rpx;
		min-height: 40rpx;
	}

	.comment-tool .u-btn {
		margin-left: 10rpx;
	}
	// 分享弹窗
	.share-wrap {
		display: flex;
		padding: 30rpx;
		width: 45%;
		margin: 0 auto;
	
		.share-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
	
			&:nth-child(1) {
				margin-right: auto;
			}
	
			image {
				width: 100rpx;
				height: 100rpx;
			}
	
			text {
				font-size: 24rpx;
				margin-top: 20rpx;
			}
		}
	
		.share-item2 {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
	
			&:nth-child(1) {
				margin: auto;
			}
	
			image {
				width: 100rpx;
				height: 100rpx;
			}
	
			text {
				font-size: 24rpx;
				margin-top: 20rpx;
			}
		}
	}
	
	//海报弹窗
	.share-box {
		height: 530px;
		position: relative;
		.images{
			width: 100%;
			height: 100%;
		}
	
	}
</style>
