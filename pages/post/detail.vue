<template>
	<view>
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="详情" :isback="true"></top-nave>
		<view class="info-box">
			
			<view :class="'user-item-'+showType">
				<image @click="jumpUser(postDetail.uid)" :src="postDetail.userInfo.avatar"></image>
				<view class="user-item-user">
					<view class="diyTag">
						<text class="user-name">{{ postDetail.userInfo.username }}</text>
						<image src="../../static/vip/vipIcon.png" class="image3" v-if="postDetail.userInfo.vip==1" />
					</view>
					<view class="postIntro">
						<text>{{ postDetail.createTime | timeFormat }}</text>
					</view>
				</view>
				<view v-if="postDetail.isFollow" class="followStyle1" @click="cancelFollow">
					已关注
				</view>
				<!-- <view v-if="!postDetail.isFollow" class="followStyle" @click="follow"> -->
				<!-- <view v-if="!postDetail.isFollow" class="followStyle">
					+ 好友
				</view> -->
			</view>
			
			<view class="post-title" style="font-weight: bold;">{{ postDetail.title }}</view>
			<!-- <u-parse :html="postDetail.content" @longpress="onCopy"></u-parse> -->
			<rich-text class="post-text" @longpress="onCopy" :nodes="postDetail.content |formatRich"></rich-text>
			
			<view v-if="showType=='1'&&postDetail.media&&postDetail.media.length>0&&postDetail.type == 1">
				<u-swiper
					:list="postDetail.media"
					indicator-pos="bottomRight"
					height='500'
					:effect3d="false"
					@click="showImage"
				></u-swiper>
			</view>
			
			<!-- <view class="hr"></view> -->
			<!-- <u-line v-if="showType=='1'&&postDetail.media&&postDetail.media.length>0&&postDetail.type == 1" margin="28rpx 0rpx"></u-line> -->
			<!-- 图片 -->
			<block v-if="postDetail.type == 1 && showType=='0'">
				<!--一张图片-->
				<block v-if="postDetail.media.length == 1">
					<image class="img-style-1" @tap.stop="previewImage" mode="aspectFill"
						:data-current="postDetail.media[0]" :data-image="postDetail.media" :src="postDetail.media[0]">
					</image>
				</block>
				<!--二张图片-->
				<block v-else-if="postDetail.media.length == 2">
					<view class="img-style-2">
						<image v-for="(mediaItem, index2) in postDetail.media" :key="index2" @tap.stop="previewImage"
							mode="aspectFill" :data-current="mediaItem" :data-image="postDetail.media" :src="mediaItem">
						</image>
					</view>
				</block>
				<!--四张图-->
				<block v-else-if="postDetail.media.length == 4">
					<view class="img-style-4">
						<image v-for="(mediaItem, index2) in postDetail.media" :key="index2" @tap.stop="previewImage"
							mode="aspectFill" :data-current="mediaItem" :data-image="postDetail.media" :src="mediaItem">
						</image>
					</view>
				</block>
				<!--其他张数图片-->
				<block v-else>
					<view class="other-img-flex" :class="imageClass[postDetail.media.length]">
						<view :class="'wrap-style ' + 'wrap-style-' + (imageIndex + 1)" v-for="(image, imageIndex) in postDetail.media" :key="imageIndex">
							<image class="show-flex" mode="aspectFill" @tap.stop="previewImage" :data-current="image" :data-image="postDetail.media" :src="image"></image>
						</view>
					</view>
				</block>
			</block>
			<block v-if="postDetail.type == 2 && postDetail.media.length > 0">
				<video :controls="true" :autoplay="true" :loop="true" :src="postDetail.media[0]"></video>
			</block>
			<!-- 投票 -->
			<view v-if="postDetail.type === 4" class="vote-box">
				<view class="title">{{ postDetail.voteInfo.title }}</view>
				<view class="expire-time" v-if="postDetail.voteInfo.type === 1">单选</view>
				<view class="expire-time" v-if="postDetail.voteInfo.type === 2">多选</view>
				<!-- 是否投票失效 -->
				<view class="expire-box" v-if="isVoteExpire">投票已过期</view>
				<view v-else class="expire-time">截止：{{ postDetail.voteInfo.time }}</view>
				<view class="vote-item" @click="castVote(index2, postDetail.voteInfo.type)"
					:class="{ active: item2.checked }" v-for="(item2, index2) in postDetail.voteInfo.options"
					:key="index2">
					<text v-if="postDetail.isVoteResult || isVoteExpire">{{ item2.content }}<text
							style="color: #999;margin-left: 20rpx;">({{ item2.ticketNum }}票)</text></text>
					<text v-else="postDetail.isVoteResult">{{ item2.content }}</text>
				</view>
				<lf-button v-if="!postDetail.isVoteResult && isVoteExpire === false" @click="voteSubmit">投票</lf-button>
			</view>
			
			<!-- 话题 -->
			<!-- <view class="detail-tag" v-if="postDetail.discussId > 0 && postDetail.type == 1">
				<view @click="toDiscuss(postDetail.discussId)">
					<image mode="aspectFill" src="/static/images/topic.png"></image>
					<view>{{postDetail.discussName}}</view>
				</view>
			</view> -->
			<!-- 地址信息 -->
			<view v-if="postDetail.address" @click="openLocation" class="post-address">
				<view>
					<u-icon class="icon" name="map-fill"></u-icon>
					<view>{{postDetail.address}}</view>
				</view>
			</view>
			<!-- 圈子信息 -->
			<!-- <navigator class="topic-info" :url="'/pages/topic/detail?id=' + postDetail.topicId">
				<image mode="aspectFill" class="cover" :src="postDetail.topicInfo.coverImage"></image>
				<view class="center">
					<view class="desc">{{ postDetail.topicInfo.topicName.substring(0, 12) }}</view>
					<view class="count-txt">{{ postDetail.topicInfo.userCount | numberFormat}}位成员 /
						{{ postDetail.topicInfo.postCount | numberFormat }}篇作品
					</view>
				</view>
				<view class="right">
					<text>去看看</text>
					<u-icon name="arrow-right-double"></u-icon>
				</view>
			</navigator> -->
			<!--点赞、分享、评论-->
			<view class="p-footer">
				<block v-if="postDetail.isCollection">
					<view class="p-item" @click="cancelCollection">
						<u-icon name="thumb-up-fill" size="40" color="#6422EF"></u-icon>
						<text style="margin-left: 10rpx;">{{ postDetail.collectionCount }}</text>
					</view>
				</block>
				<block v-else>
					<view class="p-item" @click="addCollection">
						<text style="margin-left: 10rpx;">{{ postDetail.collectionCount }}</text>
					</view>
				</block>
				<view class="p-item" @click="focus = true">
					<text class="iconfont icon-pinglun" ></text>
					<text>{{ postDetail.commentCount }}</text>
				</view>
				

			</view>
		</view>
		<!-- 广告 -->
		<!-- <view>
			<linfeng-ad :isVip="isVip" :open="adIsOpen" :h5Adpid="h5Adpid" :wxAdpid="wxAdpid"></linfeng-ad>
		</view> -->

		<view class="comment-box">
			<view class="title" >全部评论</view>
			<view style="margin-bottom: 40rpx;" v-for="(item, index) in commentList" :key="index">
				<view class="comment-item" @longpress="delComment(item, index)">
					<image @click="jumpUser(item.userInfo.uid)" class="avatar" :src="item.userInfo.avatar"></image>
					<view class="c-content" @click="onReply(item)">
						<view class="user">
							<!-- <text v-if="item.userInfo.uid == postDetail.userInfo.uid" class="official">楼主</text> -->
							<text >{{ item.userInfo.username }}</text>
							<image v-if="item.userInfo.vip==1" src="../../static/vip/vipIcon.png"
								style="width: 45rpx;height: 45rpx;margin-left: 7rpx;" />
							<block v-if="item.isThumbs">
								<view @click.stop="cancelThumbs(item.id, index)" class="thumbs">
									<text class="num">{{ item.thumbs }}</text>
									<u-icon class="icon" size="40" name="thumb-up-fill" color="#0F0158"></u-icon>
								</view>
							</block>
							<block v-else>
								<view @click.stop="onThumbs(item.id, index)" class="thumbs">
									<text class="num">{{ item.thumbs }}</text>
									<u-icon class="icon" size="40" name="thumb-up-fill" color="#0F0158"></u-icon>
								</view>
							</block>
						</view>
						<text class="c-txt" style="width: 200px;overflow: hidden;word-wrap: break-word;">{{ item.content }}</text>
						<text class="time" >{{ item.createTime | timeFormat }}</text>
					</view>
				</view>
				<view @longpress="delComment(item, index, index2)" @click="onReply(item2, index, index2)"
					v-if="item.children!=null&&item.children.length > 0" v-for="(item2, index2) in item.children"
					:key="item2.id" class="sub-comment-item">
					<view class="user">
						<u-avatar class="avatar" :size="40" :src="item2.userInfo.avatar"></u-avatar>
						<view class="u-head">
							<!-- <text v-if="item2.userInfo.uid == postDetail.userInfo.uid" class="official">楼主</text> -->
							<text >{{ item2.userInfo.username }}</text>
							<image v-if="item2.userInfo.vip==1" src="../../static/vip/vipIcon.png"
								style="width: 45rpx;height: 45rpx;margin-left: 7rpx;" />
							<block v-if="item2.isThumbs">
								<view class="thumbs" @click.stop="cancelThumbs(item2.id, index, index2)">
									<text class="num">{{ item2.thumbs }}</text>
									<u-icon class="icon" size="40" name="thumb-up-fill" color="#0F0158"></u-icon>
								</view>
							</block>
							<block v-else>
								<view class="thumbs" @click.stop="onThumbs(item2.id, index, index2)">
									<text class="num">{{ item2.thumbs }}</text>
									<u-icon class="icon" size="40" name="thumb-up-fill" color="#0F0158"></u-icon>
								</view>
							</block>
						</view>
					</view>
					<view class="reply">
						<text>@</text>
						<navigator :url="'/pages/user/home?uid=' + item2.toUser.uid" hover-class="none" class="name">
							{{ item2.toUser.username }}
						</navigator>
						<text  style="color: #FFFFFF;">：{{ item2.content }}</text>
						<view class="time">{{ item2.createTime | timeFormat }}</view>
					</view>
				</view>
			</view>
			<!-- 加载状态 -->
			<block v-if="commentList!=null&&commentList.length > 0">
				<view style="margin: 30rpx;">
					<u-loadmore :status="loadStatus" color="#0F0158" />
				</view>
			</block>
			<block v-else>
				<u-empty text="暂无评论" mode="message" icon-color="#0F0158" color="#0F0158"></u-empty>
			</block>
		</view>
		<view style="height: 100rpx;"></view>
		<!-- 评论输入框 -->
		<!-- <view class="comment-tool">
			<textarea :placeholder="placeholder" @blur="onBlur" :focus="focus" fixed="true" cursor-spacing="10"
				v-model="form.content" auto-height="true" placeholder-class="txt-placeholder" confirm-type="send"
				@confirm="addComment"></textarea>
			<u-button @click="addComment" :disabled="isSubmitD" :custom-style="btnStyle" style="border-radius: 0;">发布
			</u-button>
		</view> -->
		<view class="comment-tool">
			<view style="height: 60rpx;">
				<input type="text" :placeholder="placeholder"
					style="height: 60rpx;font-size: 28rpx;font-weight: 500;line-height: 60rpx;width: 500rpx;margin-right: 20rpx;"
					@blur="onBlur"  v-model="form.content" confirm-type="send" @confirm="addComment">
				<!-- <textarea :placeholder="placeholder" @blur="onBlur" :focus="focus" fixed="true" cursor-spacing="10"
					  	v-model="form.content" auto-height="true" placeholder-class="txt-placeholder" confirm-type="send"
					  	@confirm="addComment"></textarea> -->
			</view>
			<u-button  @click="addComment" :disabled="isSubmitD" :custom-style="btnStyle">发送
			</u-button>
		</view>
		<!-- 分享选择弹窗 -->
		<lf-popup v-model="showShare" height="240rpx">
			<view class="share-wrap" @click="closeShare">
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="share" class="share-item u-reset-button">
					<image src="/static/wechat.png"></image>
					<text>微信好友</text>
				</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
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
</template>

<script>
	import linfengAd from "@/components/linfeng-ad/linfeng-ad.vue";
	import topNave from '@/components/nav-header/index.vue';
	export default {
		components:{
			linfengAd,
			topNave
		},
		data() {
			return {
				btnStyle: {
					borderRadius: '44rpx',
					color: "#fff",
					backgroundColor: '#6322EF',
					width: '182rpx',
					height: '60rpx',
					fontSize: '30rpx'
				},
				postId: 0,
				postDetail: {
					comment: [],
					media: [],
					commentList: {
						data: []
					},
					topicInfo: {
						topicName: ''
					},
					userInfo:{
						
					},
					voteInfo:{}
				},
				focus: false,
				isSubmitD: false,
				commentList: [],
				placeholder: '说点什么...',
				form: {
					pid: 0,
					type: 1,
					toUid: '',
					postId: '',
					content: ''
				},
				showShare: false,
				showCanvas: false,
				shareBtnStyle: {
					backgroundColor: '#333'
				},
				page: 1,
				loadStatus: 'loadmore',
				isVoteExpire: false,
				isVip: 0,
				posterUrl:"",
				showTel:false,
				imageClass: ['', 'one-img', 'two-img', 'three-img', 'four-img', 'five-img', 'six-img', 'seven-img',
					'eight-img', 'nine-img'
				],
				h5Adpid:'',
				wxAdpid:'',
				adIsOpen:'',
				showType:'0',
				statusBarHeight: 0,
				navigationBarHeight:0
			};
		},
		filters: {
			// -webkit-line-clamp: 4;
			formatRich(val){
				return "<div style='overflow : hidden;text-overflow: ellipsis;display: -webkit-box; -webkit-box-orient: vertical;word-break: break-all;'>" + val + "</div>"
				}
		},
		onLoad(options) {
			this.postId = options.id;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			if (options.scene) {
				this.postId = options.scene;
			}
			if (options.mid) {
				this.messageRead(options.mid);
			}

			this.form.postId = this.postId;
			this.getPostDetail();
			this.getCommentList();
			this.getAdConfig();
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.isVip = uni.getStorageSync('userInfo').vip
			}
			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			//#endif
		},
		onReachBottom() {
			this.page++;
			this.getCommentList();
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮

			}
			let imgURL;
			if (this.postDetail.media != null) {
				if (this.postDetail.media.length > 0) {
					imgURL = this.postDetail.media[0];
				}
			}
			return {
				title: this.postDetail.content,
				path: '/pages/post/detail?id=' + this.postId,
				imageUrl: imgURL
			};
		},
		onShareTimeline() {
			let imgURL = (imgURL = this.postDetail.media[0]);
			return {
				title: this.postDetail.content,
				imageUrl: imgURL,
				query: 'id=' + this.postId
			};
		},
		methods: {
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
			close(e){
				this.showTel=e
			},
			openShare() {
				this.showShare = true
			},
			messageRead(mid) {
				this.$H
					.post('message/readMessage', {
						postId: this.postId,
						mid: mid
					})
					.then(res => {

					});
			},
			voteSubmit() {
				let voteDate = [];
				this.postDetail.voteInfo.options.forEach(item => {
					if (item.checked) {
						voteDate.push(item.id);
					}
				});
				this.$H
					.post('post/vote/userVote', {
						id: this.postDetail.voteInfo.id,
						vote: voteDate
					})
					.then(res => {
						if (res.code == 0) {
							this.getPostDetail();
							uni.showToast({
								title: "投票成功",
								icon: "none",
								duration: 2000,
							});
						}
					});
			},
			castVote(index, type) {
				if (!this.postDetail.isVoteResult && !this.isVoteExpire) {
					if (type === 1) {
						this.postDetail.voteInfo.options.forEach(item => {
							this.$set(item, 'checked', false);
						});
					}
					let checked = this.postDetail.voteInfo.options[index].checked;
					if (checked) {
						this.$set(this.postDetail.voteInfo.options[index], 'checked', false);
					} else {
						this.$set(this.postDetail.voteInfo.options[index], 'checked', true);
					}
				}
			},
			closeShare(){
				this.showShare = false
			},
			copyPageUrl() {
				let that = this;
				uni.setClipboardData({
					data: this.$c.shareH5Url + 'pages/post/detail?id=' + this.postId,
					success: function() {
						uni.hideToast();
						that.$f.toast('链接复制成功', 'none');
						that.showShare = false;
					}
				});
			},
			// 长按 删除评论
			delComment(e, index, index2) {
				let that = this;
				let user = uni.getStorageSync('userInfo');
				//如果是子评论需要遍历子评论查询是否存在自己回复的评论消息
				var flag = false; //这个用来确定父评论下是否存在用户自己的子评论
				var i = 0; //这个用来锁定子评论楼层位置
				e.children.map((item) => {
					if (item.uid == user.uid) {
						flag = true;
						e.id = item.id;
						if (index2) {
							index2 = i;
						}
					}
					i++;
				});

				if (e.uid != user.uid) {
					if (!flag) {
						return;
					}
				}
				uni.showModal({
					title: '提示',
					content: '确定删除自己的评论嘛？',
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
									}
								});
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			onCopy() {
				// let that = this;
				// uni.setClipboardData({
				// 	data: this.postDetail.content,
				// 	success: function() {
				// 		uni.hideToast();
				// 		that.$f.toast('复制成功', 'success');
				// 	}
				// });
				this.$f.copy(this.postDetail.content);
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
				let url=this.$c.shareH5Url+"pages/post/detail?id="+this.postId
				// #endif
				// #ifdef MP-WEIXIN
				let origin="weixin";
				let url="pages/post/detail?id="+this.postId
				// #endif
				this.$H
					.get('post/qrCode', {
						postId: this.postId,
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
			toDiscuss(id) {
				uni.navigateTo({
					url: '/pages/discuss/detail?id=' + id
				});
			},

			openLocation() {
				uni.openLocation({
					address: this.postDetail.address,
					latitude: parseFloat(this.postDetail.latitude),
					longitude: parseFloat(this.postDetail.longitude),
					success: () => {
						console.log('success');
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
				this.form.postId = this.postId;
			},
			// 输入框失去焦点时
			onBlur() {
				this.placeholder = '留下你的精彩评论...';
				this.focus = false;
				// #ifdef MP
				this.form.pid = 0;
				// #endif
			},
			// 获取评论列表
			getCommentList() {
				this.loadStatus = 'loading';
				this.$H
					.get('comment/list', {
						postId: this.postId,
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
			jumpUser(uid) {
				uni.navigateTo({
					url: '/pages/user/home?uid=' + uid
				});
			},
			addComment() {
				this.isSubmitD = true;
				if (this.form.content == '') {
					this.$u.toast('评论不能为空');
					this.isSubmitD = false;
					return;
				}

				uni.showLoading({
					mask: true,
					title: '发布中'
				});
				this.$H.post('post/addComment', this.form).then(res => {
					if (res.code == 0) {
						this.form.content = '';
						this.$u.toast('评论成功');
						this.page = 1;
						this.commentList = [];
						this.form.pid = 0;
						this.getCommentList();
						this.postDetail.commentCount++;
					}
					this.isSubmitD = false;
					uni.hideLoading();
				});
			},
			getPostDetail() {
				uni.showLoading({
					mask: true,
					title: '加载中'
				});
				this.$H
					.get('post/detail', {
						id: this.postId
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
							this.postDetail = res.result;
							if(res.result.showType){
								this.showType = res.result.showType;
							}
							//这里一定要再判断是否为长文
							if(res.result.type==3){
								uni.redirectTo({
									url:'/subpages/content/article/article?id='+this.postId
								})
								
							}
							// 投票帖子
							if (res.result.voteId > 0) {
								res.result.voteInfo.options.forEach(item => {
									this.$set(item, 'checked', false);
								});

								let timestamp = Date.parse(new Date()) / 1000;
								if (res.result.voteInfo.expireTime < timestamp) {
									this.isVoteExpire = true;
								}
							}
							uni.hideLoading();
						}

					});
			},
			cancelCollection() {
				this.$H
					.post('post/cancelCollection', {
						id: this.postId
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isCollection = false;
							this.postDetail.collectionCount--;
						}
					});
			},
			addCollection() {
				this.$H
					.post('post/addCollection', {
						id: this.postId,
						uid: this.postDetail.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isCollection = true;
							this.postDetail.collectionCount++;
						}
					});
			},
			addThumb() {
				this.$H
					.post('post/addThumb', {
						id: this.postId
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isThumb = true;
						}
					});
			},
			cancelThumb() {
				this.$H
					.post('post/cancelThumb', {
						id: this.postId,
						uid: this.postDetail.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isThumb = false;
						}
					});
			},
			follow() {
				this.$H
					.post('user/addFollow', {
						id: this.postDetail.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isFollow = true;
						} else {
							this.$refs.uToast.show({
								title: res.msg,
								type: 'error'
							});
						}
					});
			},
			cancelFollow() {
				this.$H
					.post('user/cancelFollow', {
						id: this.postDetail.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isFollow = false;
						}
					});
			},
			previewImage(e) {
				uni.previewImage({
					current: e.currentTarget.dataset.current, // 当前显示图片的http链接
					urls: e.currentTarget.dataset.image // 需要预览的图片http链接列表
				});
			},
			showImage(index){
				uni.previewImage({
					current: this.postDetail.media[index], // 当前显示图片的http链接
					urls: this.postDetail.media // 需要预览的图片http链接列表
				});
			}

		}
	};
</script>

<style lang="scss" scoped>
	
	.post-title {
		margin: 20rpx 0;
		color:$text-color-base;
	}

	.info-box {
		margin: 12px;
		padding: 20rpx;
		background-color: $bg-color-light;
		border-radius: 8px 8px 8px 8px;
		color:$text-color-base;
	}

	.icon text {
		font-size: 12px;
		color:red;
		margin-right: 20rpx;
	}
	.detail-tag,
	.post-address {
		display: flex;
		align-items: center;
		padding: 12rpx 0;
	}
	.post-address>view,
	.detail-tag>view {
		display: flex;
		align-items: center;
		height: 56rpx;
		line-height: 56rpx;
		border-radius: 56rpx;
		background: #eff2f3;
		padding: 0 24rpx 0 12rpx;
		margin-right: 16rpx;
	}
	.post-address>view view,
	.detail-tag>view view {
		margin-left: 8rpx;
		font-size: 26rpx;
		font-weight: 400;
	}
	.post-address image,
	.detail-tag image {
		height: 44rpx;
		width: 44rpx;
	}
	/*关注*/

	.user-item-0 {
		display: flex;

		.user-item-user {

			.diyTag {
				display: flex;
				align-items: center;

				.user-name {
					font-size: 36rpx;
					color: $text-color-base;
				}

				.image3 {
					width: 0.38 * 100rpx;
					height: 0.38 * 100rpx;
					margin-left: 0.05 * 100rpx;
				}
			}

			flex: 1;

			.postIntro {
				font-size: 10px;
				color: $text-color-assist;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}

		image {
			width: 80rpx;
			height: 80rpx;
			float: left;
			margin-right: 10rpx;
			border-radius: 50%;
		}
	}
	.user-item-1 {
		display: flex;
		border-radius: 30rpx;
		.user-item-user {
	
			.diyTag {
				display: flex;
				align-items: center;
	
				.user-name {
					font-size: 36rpx;
					color:  $text-color-base;
				}
	
				.image3 {
					width: 0.38 * 100rpx;
					height: 0.38 * 100rpx;
					margin-left: 0.05 * 100rpx;
				}
			}
	
			flex: 1;
	
			.postIntro {
				font-size: 10px;
				color: $text-color-assist;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}
	
		image {
			width: 80rpx;
			height: 80rpx;
			float: left;
			margin-right: 10rpx;
			border-radius: 50%;
		}
	}

	.followStyle {
		// width: 120rpx;
		// height: 50rpx;
		padding: 0px 12px;
		height: 28px;
		line-height: 28px;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		color: #06407A;
		background: #03D7FC;
		font-size: 12px;
		border-radius: 14px 14px 14px 14px;
	}

	.followStyle1 {
		width: 100rpx;
		height: 50rpx;
		border: 1px solid #F3F2F2;
		border-radius: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		color: #9F9E9F;
	}

	/*底部操作*/
	.p-footer {
		display: flex;
		border-top: 1px solid #B2B1FE;
		margin: 20rpx 0 0;
		padding-top: 10rpx;
		color:$text-color-base;
		.p-item {
			display: flex;
			align-items: center;
			color:$text-color-base;
			margin: 0 auto;
			.iconfont {
				font-size: 40rpx;
			}

			&:nth-child(2) {
				margin: 0 auto;
			}

			.iconfont {
				margin-right: 10rpx;
			}
		}
	}

	/*评论列表*/
	.comment-box {
		background: $bg-color-light;
		border-radius: 8px 8px 8px 8px;
		padding: 20rpx;
		margin: 12px;
	}

	.comment-box>.title {
		margin-bottom: 20rpx;
		font-size: 14px;
		font-weight: 500;
		color: $text-color-base;
	}

	.comment-item {
		display: flex;
		padding: 20rpx;
		&:active {
			background-color: $text-color-base;
		}

		.c-content {
			display: flex;
			flex-direction: column;
			flex: 1;

			.time {
				color:  $text-color-base;
				font-size: 10px;
			}

			.user {
				display: flex;

				.official {
					display: inline-block;
					font-size: 20rpx;
					color: #ffffff;
					background-color: #938d8d;
					padding: 4rpx 8rpx;
					border-radius: 14rpx;
					margin-right: 10rpx;
				}

				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					//color: #bfbfbf;
					color:red;

					.num {
						margin-right: 10rpx;
						color:$text-color-base;
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
		background-color: #F3F2F2;
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
				.official {
					display: inline-block;
					font-size: 16rpx;
					color: #ffffff;
					background-color: #938d8d;
					padding: 4rpx 8rpx;
					border-radius: 14rpx;
					margin-right: 10rpx;
				}

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
				color: #55aaff;
				font-weight: 600;
			}
		}
	}

	/* 评论tool */
	/* #ifdef H5 || MP-WEIXIN */
	.comment-tool {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		padding: 20rpx 20rpx 50rpx;
		display: flex;
		z-index: 999;
	}

	.comment-tool textarea {
		background-color: #f5f5f5;
		padding: 20rpx;
		border-radius: 10rpx;
		min-height: 40rpx;
	}

	.comment-tool .u-btn {
		margin-left: 10rpx;
	}

	/* #endif */
	/* #ifdef APP-PLUS */
	.comment-tool {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #F5F5F5;
		padding-left: 20rpx;
		height: 110rpx;
		display: flex;
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.comment-tool textarea {
		background-color: #f5f5f5;
		padding: 10rpx;
		border-radius: 10rpx;
		min-height: 70rpx;
	}

	.comment-tool .u-btn {
		margin-left: 10rpx;
	}

	/* #endif */
	/*文章图片*/
	.img-style-1 {
		display: block;
		width: 100%;
		max-height: 600rpx;
		border-radius: 5px;
	}

	.img-style-2 {
		display: flex;
	}

	.img-style-2 image {
		margin: 5rpx;
		border-radius: 5px;
		width: 100%;
		height: 294rpx;
	}

	.img-style-3 {
		display: flex;
		flex-wrap: wrap;
	}

	.img-style-3 image {
		width: 31.3%;
		height: 200rpx;
		margin: 1%;
		border-radius: 5px;
	}

	.img-style-4 {
		display: flex;
		flex-wrap: wrap;
	}

	.img-style-4 image {
		width: 48%;
		height: 320rpx;
		margin: 0.5%;
	}

	// 圈子信息
	.topic-info {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		background-color: #F1F3F5;
		margin: 20rpx 0;
		padding: 24rpx;
		border-radius: 12rpx;
		.cover {
			width: 100rpx;
			height: 100rpx;
			margin-right: 20rpx;
		}

		.center {
			flex: 1;

			.count-txt {
				color: #999;
			}
		}

		.right {
			margin-left: 20rpx;
			color: #55aaff;
		}
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
	.footer {
		// position: absolute;
		bottom: 20rpx;
		left: 20rpx;
		right: 20rpx;
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

		.active {
			background-color: #333;
			color: #fff;
		}
	}

	.expire-box {
		background-color: #999;
		color: #fff;
		font-size: 24rpx;
		display: inline-block;
		padding: 0 20rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}

	video {
		width: 100%;
	}

	.post-text {
		// width: 90%;
		// white-space: pre-wrap;
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		// -webkit-line-clamp: 10;
		white-space: pre-wrap;
		// overflow: hidden;
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
