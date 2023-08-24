<template>
	<view>
		<view class="hot-wrap">
			<!-- 置顶帖 -->
			<view class="totop-wrap" style="margin-top: 10rpx;">
				<block v-for="(item, index) in hotList">
					<view class="img-txt" @click="jumpHot(item.id)">
						<view class="img">
							<image src="../../static/images/ding.png"
								style="width: 22rpx;height: 30rpx;"></image>
						</view>
						<view class="txt add">
							{{item.title}}
						</view>
					</view>
					<view class="hot">
						{{item.readCount}}
					</view>
				</block>
			</view>
			<u-line color="#4e4e75" margin="20rpx 30rpx 0 30rpx" length="690rpx" />
			<!-- 热度排序 -->
			<block v-for="(item, index) in hotPost" v-if="index < 10" :key="index">
				<view style="margin-top: 20rpx;" @click="jumpHot(item.id)">
					<view class="totop-wrap hotsrot-wrap" style="padding-left: 49rpx;">
						<view class="img-txt">
							<view style="font-size: 36rpx;font-weight: 900;color: #ff3300;"
								:style="{opacity:(index>3?0.3:1)}">
								{{index+1}}
							</view>
							<view class="txt">
								{{item.title}}
							</view>
						</view>
						<view class="hot">
							{{item.readCount}}
						</view>
					</view>
				</view>
				<u-line color="#d4d4d4" margin="20rpx 30rpx 0 30rpx" length="690rpx"></u-line>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name:"post-recommend",
		props: {
			hotPost: {
				type: Array,
				default: [],
			},
			hotList: {
				type: Array,
				default: [],
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			jumpHot(id) {
				uni.navigateTo({
					url: '/pages/post/detail?id=' + id
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F5F5F5;
	}

	.hot-wrap {
		background-color: #ffffff;
		height: 100vh;
	}

	.swiper-wrap {
		padding: 25rpx 30rpx 0;

		.img {
			width: 690rpx;
			height: 220rpx;
			background: #ff6666;
			border-radius: 10rpx;
			opacity: 0.8;
		}
	}

	.totop-wrap {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx 0 46rpx;

		.img-txt {
			display: flex;
			align-items: center;

			.img {}

			.txt {
				width: 480rpx;
				margin-left: 28rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				line-height: 45rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.add{
				font-weight: 800;
			}
		}

		.hot {
			font-size: 24rpx;
			color: #ff6666;
			line-height: 33rpx;
			opacity: 0.5;
		}
	}
</style>