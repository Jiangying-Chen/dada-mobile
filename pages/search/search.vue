<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
			<top-nave :isback="true" :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="搜索"></top-nave>
			<!-- search-icon="/static/images/more-search.png" -->
			<view style="color: transparent;" class="container">
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
				></u-search>
				<!-- tabs -->
				<block v-if="keyword">
					<!-- active-item-style -->
						<view class="tabs-box">
							<u-tabs
							bar-color="#C1C0FA"
							inactive-color="#fff"
							active-color="#fff"
							bg-color="transparent"
							bar-height="6" 
							bar-width="40"
								:list="tabList"
								:is-scroll="false"
								:current="current"
								@change="tabChange"
							></u-tabs>
						</view>
						<view v-show="current === 0">
							<post-list v-if="indexStyle1=='0'" :list="postList" :loadStatus="loadStatus" :showTag="true"
								:open="adIsOpen" :openAd="true" :wxAdpid="wxAdpid" :h5Adpid="h5Adpid"></post-list>
							<!-- <post-list :list="postList" :loadStatus="loadStatus" ></post-list> -->
						</view>
						<view v-show="current === 1">
							<user-list :list="userList" :loadStatus="loadStatus" :isyonghu="false"></user-list>
						</view>
						<!-- <view v-show="current === 2">
							<topic-list
								:list="topicList"
								:loadStatus="loadStatus"
								loadmoreBgColor="#fff"
							></topic-list>
						</view> -->
					</block>
					<block v-else>
						<view class="empty-box">
							<view v-if="userSearch.length > 0" style="width: 100%; margin-right: auto;display: flex;justify-content: space-between;">
								<label style="color: #fff;">搜索记录</label> 
								<u-icon color="#fff" name="trash" @click="deleteSearchByUId" :size="40"></u-icon>
								<!-- <image @click="deleteSearchByUId" style="width: 35rpx;height: 35rpx;margin-left: 450rpx;" src="/static/images/search-del.png" mode=""></image> -->
							</view>
							<view class="item-wrap">
								<view v-for="(item, index) in userSearch" :key="item.searchId">
									<view class="item" @click="historyKeyword(item.content)">
										{{ item.content }}
									</view>
								</view>
							</view>
							<view v-if="hotSearch.length > 0" style="margin-right: auto;margin-top: 20rpx;">
								<label style="color: #fff;">热门搜索</label>
							</view>
							<view  class="item-wrap">
								<view class="item" v-for="(item, index) in hotSearch" :key="index">
									<view @click="historyKeyword(item)">{{ item }}</view>
								</view>
							</view>
						</view>
					</block>
			</view>
			
		</view>
	
</template>

<script>
import postList from '@/components/post-list/post-list.vue'
import topicList from '@/components/topic-list/topic-list.vue'
import userList from '@/components/user-list/user-list.vue'
import topNave from '@/components/nav-header/index.vue';
export default {
	components: {
		postList,
		topicList,
		userList,
		topNave
	},
	data() {
		return {
			// navbarHeight: 0,
			navbarHeight: 0,
			navigationBarHeight: 0,
			statusBarHeight: 0,
			keyword: '',
			tabList: [
				{
					name: '动态'
				},
				{
					name: '用户'
				},
				// {
				// 	name: '圈子'
				// }
			],
			current: 0,
			postList: [],
			userList: [],
			topicList: [],
			pagePost: 1,
			pageUser: 1,
			topicPage: 1,
			loadStatus: 'loadmore',
			h5Adpid: '1818425366',
			wxAdpid: '1872486102',
			adIsOpen: '0',
			indexStyle1: '0',
			hotSearch: [],
			userSearch: []
		}
	},
	onReachBottom() {
		let type = this.current
		if (type === 0) {
			this.pagePost++
			this.getPostList()
		}

		if (type === 1) {
			this.pageUser++
			this.getUserList()
		}

		if (type === 2) {
			this.topicPage++
			this.getTopicList()
		}
	},
	onLoad() {
		this.navigationBarHeight = getApp().globalData.statusBarHeight;
		this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
		this.getUserSearchHistory()
		this.getHotSearchHistory()
	},
	methods: {
		onChange() {
			if (this.keyword) {
				let type = this.current

				this.pagePost = 1
				this.pageUser = 1
				this.topicPage = 1

				if (type === 0) {
					this.postList = []
					this.getPostList()
				}

				if (type === 1) {
					this.userList = []
					this.getUserList()
				}

				if (type === 2) {
					this.topicList = []
					this.getTopicList()
				}
			}
		},
		getUserList() {
			this.loadStatus = 'loading'
			this.$H
				.get('user/search', {
					keyword: this.keyword,
					page: this.pageUser
				})
				.then(res => {
					this.userList = this.userList.concat(res.result.data)
					console.log(this.userList,'this.userList==')
					if (
						res.result.current_page >= res.result.total ||
						res.result.last_page === 0
					) {
						this.loadStatus = 'nomore'
					} else {
						this.loadStatus = 'loadmore'
					}
				})
		},
		getTopicList() {
			this.loadStatus = 'loading'
			this.$H
				.get('topic/search', {
					keyword: this.keyword,
					page: this.topicPage
				})
				.then(res => {
					this.topicList = this.topicList.concat(res.result.data)
					if (
						res.result.current_page >= res.result.total ||
						res.result.last_page === 0
					) {
						this.loadStatus = 'nomore'
					} else {
						this.loadStatus = 'loadmore'
					}
				})
		},
		getPostList() {
			this.loadStatus = 'loading'
			this.$H
				.get('post/search', {
					keyword: this.keyword,
					page: this.pagePost
				})
				.then(res => {
					this.postList = this.postList.concat(res.result.data)
					if (
						res.result.current_page >= res.result.total ||
						res.result.last_page === 0
					) {
						this.loadStatus = 'nomore'
					} else {
						this.loadStatus = 'loadmore'
					}
				})
		},
		tabChange(index) {
			this.current = index

			if (index === 0) {
				this.postList = []
				this.getPostList()
			}

			if (index === 1) {
				this.userList = []
				this.getUserList()
			}

			if (index === 2) {
				this.topicList = []
				this.getTopicList()
			}
		},
		//删除所有历史搜索消息
		deleteSearchByUId() {
			this.$H.post('search/deleteSearchByUId').then(res => {
				if (res.code == 0) {
					this.userSearch = []
				}
			})
		},
		//获取热门搜索列表
		getHotSearchHistory() {
			this.$H.get('search/getHotSearchHistory').then(res => {
				if (res.code == 0) {
					this.hotSearch = res.result
				}
			})
		},
		//获取用户搜索历史列表
		getUserSearchHistory() {
			this.$H.get('search/getUserSearchHistory').then(res => {
				if (res.code == 0) {
					this.userSearch = res.result
				}
			})
		},
		//点击内容跳转搜索
		historyKeyword(keyWord) {
			this.keyword = keyWord
		}
	}
}
</script>
<style>
page {
	background-color: #7F7DEB !important;
}
</style>
<style lang="scss" scoped>
@import 'search.scss';
</style>
