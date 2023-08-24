<template>
	<view class="discuss-container">
		<view class="discussInfo">

			<view class="title">

				<view class="dis-title"># {{discussInfo.title}}</view>
				<view class="count">
					<text>{{discussInfo.postCount}} 篇内容</text>
					<text>{{discussInfo.readCount}} 次浏览</text>
				</view>
			</view>
			<view class="desc">
				<view class="discuss-desc">{{discussInfo.introduce}}</view>
			</view>
			<view class="user">
				<text class="tag">
					发起人
				</text>
				<view class="user-c">
					<text>{{discussInfo.userInfo.username}}</text>
				</view>
				<u-avatar size="40" class="avatar" :src="discussInfo.userInfo.avatar"></u-avatar>
				
			</view>
		</view>
		<post-list :list="postList" :loadStatus="loadStatus"></post-list>
		<!-- 发布按钮 -->
		<view @click="onTrigger" url="/pages/post/add" class="plus-box">
			<u-icon color="#fff" name="plus"></u-icon>
		</view>
	</view>
</template>

<script>
	import postList from '../../components/post-list/post-list.vue';
	export default {
		components: {
			postList
		},
		data() {
			return {
				disId: 0,
				loadStatus: "loading",
				postList: [],
				discussInfo: {
					userInfo: {}
				},
				page: 1
			};
		},
		onLoad(options) {
			this.disId = options.id;
			this.getDiscussInfo();
			this.getPostList();

			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			//#endif
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.discussInfo.introduce,
				path: '/pages/discuss/detail?id=' + this.disId,
			}
		},
		onShareTimeline() {
			let imgURL = "";
			return {
				title: this.discussInfo.introduce,
				imageUrl: imgURL,
				query: 'id=' + this.disId
			}
		},
		methods: {
			onTrigger() {
				uni.navigateTo({
					url: "/pages/post/add?topicId=" + this.discussInfo.topicId + "&discussId=" + this.discussInfo
						.id + "&type=1&disName=" + this.discussInfo.title
				})
			},
			getDiscussInfo() {
				this.$H.get('discuss/detail', {
					id: this.disId
				}).then(res => {
					this.discussInfo = res.result;
				})
			},
			getPostList() {
				this.loadStatus = "loading";
				this.$H.post('post/list', {
					disId: this.disId,
					page: this.page
				}).then(res => {
					this.postList = this.postList.concat(res.result.data);

					if (res.current_page === res.last_page || res.last_page === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

	.discuss-container{
		background-color: #ebebeb;
	}
	.discussInfo {

		padding: 20rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		align-items: center;

		.title {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			margin: 10rpx 4rpx;
		}

		.desc {
			display: flex;
			align-items: center;

			.tag {
				width: 70rpx;
				height: 42rpx;
				font-size: 24rpx;
				text-align: center;
				border-radius: 10rpx;
				border: .5px solid #dddddd;
				margin-right: 15rpx;
				
			}
		}
	}

	.discussInfo>.user {
		display: flex;
		margin: 10rpx 4rpx;
		align-items: center;

		.tag {
			width: 100rpx;
			height: 42rpx;
			font-size: 24rpx;
			text-align: center;
			border-radius: 10rpx;
			border: .5px solid #dddddd;
			margin-right: 15rpx;
		}
	}

	.discussInfo>.user>.user-c {
		display: flex;
		flex-direction: column;
		margin-right: 15rpx;
	}

	.discussInfo>.user>.user-c text:nth-child(2) {
		font-size: 10px;
		color: #999;
	}

	.avatar {
		margin-right: 10rpx;
		font-size: 0;
	}

	.count {
		font-size: 12px;
		color: #999;
		margin-bottom: 10rpx;
	}

	.count text {
		margin: 0 10rpx;
	}

	.dis-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #616161;
		width: 400rpx;
	}

	.discuss-desc {
		color: #616161;
	}
</style>
