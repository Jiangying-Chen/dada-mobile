<template>
	<view>
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="选择话题" :isback="true"></top-nave>
		<!-- <view style="color: transparent;" >
			<u-search
				placeholder="请输入您需要的内容"
				:show-action="false"
				shape="round"
				bg-color='transparent'
				border-color="#FFFFFF"
				margin="10rpx 30rpx 20rpx"
				color="#fff"
				placeholder-color="#fff"
				:clearabled="true"
				v-model="keyword"
				@custom="onChange"
				@search="onChange"
				@change="onChange"
			></u-search></view> -->
		<!-- <view class="searchBtn">
			<view class="searchimage">
				<image src="https://mallwj.hm-myy.cn/169113249064520230804150130.png" mode=""></image>
			</view>
			<view class="searchinput" style="flex: 1 1 0%; " >
				
				<input type="text" v-model="keyword" placeholder="输入您要搜索的话题" @blur="searchParent" />
			</view>
		</view> -->
		<view
			class="topic-item"
			@click="chooseTopic(item.id, item.title)"
			v-for="(item, index) in disList"
			:key="index"
		>
		
			<view class="center">
				
				<view style="color: #fff;display: flex;align-items: center;">
					<image src="../../../static/huati.png" mode="aspectFill" style="width: 40rpx;height: 40rpx;margin-right: 20rpx;">
					</image>{{ item.title}}</view>
			</view>
			<view class="count-box">
				<text style="color: #fff;">共{{ item.readCount }}讨论</text>
			</view>
		</view>
		<!-- 加载状态 -->
		<block v-if="disList.length === 0 && loadStatus == 'nomore'">
			<u-empty margin-top="100" text="暂无话题" mode="favor"></u-empty>
		</block>
		<block v-else>
			<view style="margin: 30rpx 0;">
				<u-loadmore :status="loadStatus" />
			</view>
		</block>
	</view>
</template>

<script>
import topNave from '@/components/nav-header/index.vue';
export default {
	components: {
		topNave
	},
	data() {
		return {
			disList: [],
			loadStatus: 'loadmore',
			page: 1,
			topicId:"",
			navigationBarHeight: 0,
			statusBarHeight: 0,
			keyword:''
		};
	},
	onLoad(options) {
		this.navigationBarHeight = getApp().globalData.statusBarHeight;
		this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
		this.topicId = options.topicId;
		this.getDisList();
	},
	filters: {
		replace(str) {
			str = str.replace(/\n/g, '');
			return str.substring(0,40);
		}
	},
	onReachBottom() {
		this.page++;
		this.getDisList();
	},
	methods: {
		getDisList() {
			this.$H
				.post('discuss/list',{
					page:this.page,
					topicId:this.topicId
				})
				.then(res => {
					this.disList = res.result.data;
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
			prevPage.$vm.form.discussId = id;
			prevPage.$vm.disName = name;
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.topic-item {
	display: flex;
	align-items: center;
	// background-color: #7762EC;
	padding: 30rpx;
	margin: 10rpx;
	// border-bottom: 1px solid #f5f5f5;
	border-radius: 16rpx;
	.cover-img {
		margin-right: 20rpx;
	}
	.center {
		flex: 1;
		.desc {
			font-size: 20rpx;
			color: #fff;
		}
	}
	.count-box {
		display: flex;
		flex-direction: column;
		font-size: 20rpx;
		color: #999;
		margin-left: 20rpx;
	}
}
.searchBtn{
	height: 80rpx;
	border-radius: 50rpx 50rpx 50rpx 50rpx;
	border: 2rpx solid #FFFFFF;
	
}

</style>
