<template>
	<view>
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="选择星球" :isback="true"></top-nave>
		<view
			
			@click="chooseTopic(item.id, item.topicName)"
			v-for="(item, index) in topicList"
			:key="index"
			style="background: none;"
		>
			<view class="topic-item">
				<u-image class="cover-img" width="120rpx" height="120rpx" border-radius="10rpx" :src="item.coverImage"></u-image>
				<view class="center">
					<view class="title">{{ item.topicName.substring(0, 10) }}</view>
					<view class="desc">{{ item.description | replace }}</view>
				</view>
				<view class="count-box">
					<text>{{ item.userCount }}圈友</text>
					<text>{{ item.postCount }}动态</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import topNave from '@/components/nav-header/index.vue';
export default {
	data() {
		return {
			navigationBarHeight: 0,
			statusBarHeight: 0,
			topicList: [],
			loadStatus: 'loadmore',
			page: 1
		};
	},
	components: {
		topNave
	},
	onLoad(options) {
		this.navigationBarHeight = getApp().globalData.statusBarHeight;
		this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
		this.getTopicList();
	},
	filters: {
		replace(str) {
			str = str.replace(/\n/g, '');
			return str.substring(0,40);
		}
	},
	onReachBottom() {
		this.page++;
		this.getTopicList();
	},
	methods: {
		getTopicList() {
			this.$H
				.post('topic/userJoinTopic',{
					page:this.page
				})
				.then(res => {
					this.topicList = this.topicList.concat(res.result.data);
					console.log('this.topicList',this.topicList )
					if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
				});
		},
		chooseTopic(id, name) {
			let pages = getCurrentPages(); //获取所有页面栈实例列表
			let nowPage = pages[pages.length - 1]; //当前页页面实例
			let prevPage = pages[pages.length - 2]; //上一页页面实例
			prevPage.$vm.form.topicId = id;
			prevPage.$vm.topicName = name;
			prevPage.$vm.form.discussId = '';
			prevPage.$vm.disName = '选择话题';
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.topic-item {
	display: flex;
	align-items: center;
	background-color: $bg-color-light;
	padding:16rpx 30rpx;
	margin: 16rpx 32rpx;
	border-radius: 16rpx;
	.cover-img {
		margin-right: 20rpx;
	}
	.center {
		flex: 1;
		.title{
			font-size: $font-size-lg;
			color:$text-color-base;
		}
		.desc {
			font-size: $font-size-base;
			color:$text-color-assist;
		}
	}
	.count-box {
		display: flex;
		flex-direction: column;
		font-size: 20rpx;
		color: $text-color-assist;
		margin-left: 20rpx;
	}
}


</style>
