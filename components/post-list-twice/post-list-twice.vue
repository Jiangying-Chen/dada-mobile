<template>
	<view>
		<view class="post-list">
			<block v-for="(item, index) in dataList" :key="index">
				<view @click="jump(item)" v-if="item.media&&item.media.length > 0 || item.type == 4">
					<view class="post-item">
						<image v-if="item.type == 1 || item.type == 3" :src="item.media[0]" mode="aspectFill"
							class="basic-img"></image>
						<image v-if="item.type == 4" src="https://xiaoyuan.pujinetwork.com/bbs/20230825/6bf11e9dfbeb4cf59246e950bf692272.jpeg" mode="aspectFill"
							class="basic-img"></image>
						<view v-if="item.type == 2">
							<view class="video-wrap">
								<!-- 如果使用阿里云存储打开如下两行代码注释 -->
								<!-- <image class="cover-img" mode="aspectFill" v-if="item.cut == 1" :src="item.media[0] + '?x-oss-process=video/snapshot,t_0,f_jpg'">
								<image class="cover-img" mode="aspectFill" v-else :src="item.media[0] + '?x-oss-process=video/snapshot,t_0,f_jpg'"> -->
								<!-- 如果使用七牛云存储打开如下两行代码注释 -->
								<image class="cover-img" mode="aspectFill" v-if="item.cut == 1" :src="item.media[0]">
								</image>
								<image class="cover-img" mode="aspectFill" v-else
									:src="item.media[0] + '?vframe/jpg/offset/1'"></image>
								<image class="icon" src="/static/play.png"></image>
							</view>
						</view>
						<view style="padding: 10rpx;">
							<view class="title" v-if="item.type != 4">
								<text>{{ item.title}}</text>
							</view>
							<view class="title" v-else>
								<text>{{ item.content}}</text>
							</view>
							<view style="display: flex;justify-content: space-between;">
								<view @click.stop="toUcenter(item.userInfo.uid)" class="userBox">
									<image
										style="width: 42rpx;height: 42rpx;border-radius: 8rpx;border: 1px solid #000;"
										:src="item.userInfo.avatar" mode=""></image>
									<text class="username">
										{{ item.userInfo.username.substring(0, 9) }}
									</text>
								</view>
								<view style="display: flex;align-items: center;" v-if="item.isCollection"
									@click.stop="cancelCollection(item.id,index)">
									<u-icon name="heart-fill" color="#cc0000"></u-icon>
									<view style="font-size: 20rpx;">
										{{ item.collectionCount }}
									</view>
								</view>
								<view style="display: flex;align-items: center;" v-if="!item.isCollection"
									@click.stop="addCollection(item.id,index)">
									<u-icon name="heart"></u-icon>
									<view style="font-size: 20rpx;">
										{{ item.collectionCount }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>

		<!-- 加载状态 -->
		<view>
			<block v-if="dataList.length === 0 && loadStatus == 'nomore'">
				<u-empty margin-top="100" text="暂无内容" mode="favor"></u-empty>
			</block>
			<block v-else>
				<u-loadmore margin-bottom="50" margin-top="50" bg-color="#f5f5f5" :status="loadStatus" color='#ffffff'/>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'post-list-twice',
		props: {
			dataList: Array,
			loadStatus: {
				type: String,
				default: 'loading'
			}
		},
		data() {
			return {}
		},
		methods: {
			toUcenter(uid) {
				uni.navigateTo({
					url: '/pages/user/home?uid=' + uid
				})
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
				if (e.type == 3) {
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
			cancelCollection(id, index) {
				this.$H
					.post('post/cancelCollection', {
						id: id
					})
					.then(res => {
						if (res.code === 0) {
							this.dataList[index].isCollection = false;
							this.dataList[index].collectionCount--;
						}
					});
			},
			addCollection(id, index) {
				this.$H
					.post('post/addCollection', {
						id: id,
						uid: this.dataList[index].uid
					})
					.then(res => {
						if (res.code === 0) {
							this.dataList[index].isCollection = true;
							this.dataList[index].collectionCount++;
						}
					});
			},
	
	}
}
</script>

<style>
	page {
		background-color: #f5f5f5;
	}
</style>

<style lang="scss" scoped>
	.post-list {
		padding: 0 15rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.post-item {
			background: #fff;
			box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.25);
			border-radius: c(9);
			width: 355rpx;
			margin: 10rpx 0;
			box-sizing: border-box;

			.basic-img {
				width: 100%;
				display: block;
				height: c(207);
				border-radius: 13rpx 13rpx 0 0;
			}

			border-radius: 13rpx 13rpx 13rpx 13rpx;

			.title {
				font-size: 32rpx;
				height: 70rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.avatar {
				width: 28rpx;
				height: 28rpx;
				flex: 0 0 28rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.username {
				font-size: 20rpx;
				font-weight: 600;
				margin-left: 10rpx;
			}
		}
	}

	.userBox {
		display: flex;
		align-items: center;

		.username {
			height: 27rpx;
			line-height: 27rpx;
		}
	}

	.video-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		height: 460rpx;
		border-radius: 13rpx 13rpx 0 0;

		image {
			position: absolute;
		}

		.icon {
			width: 100rpx;
			height: 100rpx;
			z-index: 999;
		}
	}

	.cover-img {
		width: 100%;
		border-radius: 20rpx !important;
	}
</style>
