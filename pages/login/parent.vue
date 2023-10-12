<template>
	<view style="position: relative;" class="mainbg">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="设置母星"
			:isback="true"></top-nave>
		<view class="top-header-title">
			请设置您的母星
		</view>

		<view class="searchbox uni-flex uni-row" style="align-items: center;" @click="getnavigateTo">
			<view class="searchimage">
				<image src="https://mallwj.hm-myy.cn/169113249064520230804150130.png" mode=""></image>
			</view>
			<view class="searchinput" style="flex: 1 1 0%; " >
				<view style="color: #fff;">搜索您的母星</view>
				<!-- <input type="text" v-model="keyword" placeholder="搜索您的母星" @blur="searchParent" /> -->
			</view>
		</view>


		<view class="search-result" v-if="search.length > 0">
			<view class="result-view uni-flex uni-row" style="justify-content: space-between;" v-for="item in search">
				<view class="uni-flex uni-row left-box">
					<view class="left-image">
						<image :src="item.bgImage" mode=""></image>
					</view>
					<view class="left-info" style="flex: 1 1 0%;">
						<view class="info-name">
							{{item.topicName}}
						</view>
						<view class="info-time">
							{{item.createTime}}
						</view>
					</view>
				</view>
				<view class="right-btn">
					<view class="btn1" @tap="toSetParent(item)">
						设为母星
					</view>

				</view>
			</view>

		</view>
		<!-- <view class="noresult" v-if="search.length == 0">
			暂无搜索结果
		</view> -->
	</view>

</template>

<script>
	import websocket from '@/utils/websocket.js';
	import $store from '@/store/index.js';
	import topNave from '@/components/nav-header/index.vue';
	export default {
		components: {
			topNave
		},
		data() {
			return {
				navigationBarHeight: 0,
				statusBarHeight: 0,
				domain: this.$H.domain,
				shareCover: "",
				uid: 0,
				keyword: '',
				search: []
			};
		},
		onLoad() {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			this.uid = uni.getStorageSync('userInfo').uid;
		},
		methods: {
			searchParent() {
				let _this = this;
				if(_this.keyword == '' || _this.keyword == null){
					uni.showToast({
						title: '关键词不能为空',
						icon: "none"
					});
				}else{
					_this.$H.get('topic/search', {
						page: 1,
						keyword: _this.keyword
					}).then(res => {
						if(res.result.data.length > 0){
							_this.search = res.result.data;
						}else{
							_this.search = []
						}
						
					});
				}
				
			},
			getnavigateTo(){
				uni.navigateTo({
					url:'/pages/login/setParent'
				})
			},
			toSetParent(code){
				let _this = this;
				_this.$H.get('topic/joinTopic',{
					id:code.id,
					parentStar:true
				}).then(res=>{
					if(res.code == 0){
						uni.showToast({
							title: '设置成功',
							icon: "none"
						});
						_this.$isResolve()
						uni.switchTab({
							url: '/pages/index/index'
						});
					}
				})
				
			}
		}
	}
</script>

<style lang="scss">
	.mainbg {
		background: url("https://mallwj.hm-myy.cn/169113202973720230804145349.png") repeat-y;
		background-size: 100%;
		height: 100vh;
	}

	.top-header-title {
		margin: 69px 0 52px;
		text-align: center;
		font-size: 24px;
		font-weight: bold;
		color: #FFFFFF;
	}

	.searchbox {
		background: rgba(0, 0, 0, 0.5);
		border-radius: 22px;
		margin: 0 45px;
		padding: 12px 20px;

		.searchimage {
			width: 20px;
			height: 20px;

			image {
				width: 20px;
				height: 20px;
			}
		}

		.searchinput {
			margin-left: 12px;

			input {
				background: none;
				color: white;
			}
		}
	}
	.noresult{
		margin: 20px 16px;
		text-align: center;
		font-size: 16px;
		color: #FFFFFF;
	}
	.search-result {
		margin: 20px 16px;

		.result-view {
			padding: 21px 12px;
			background: #06407A;
			border-radius: 8px 8px 8px 8px;
			margin-bottom: 8px;

			.left-box {
				padding-left: 5px;

				.left-image {
					width: 40px;
					height: 40px;

					image {
						width: 40px;
						height: 40px;
					}
				}

				.left-info {
					margin-left: 8px;

					.info-name {
						font-size: 14px;
						font-weight: 500;
						color: #FFFFFF;
						// margin-bottom: 9px;
					}

					.info-time {
						font-size: 12px;
						font-weight: 400;
						color: rgba(255, 255, 255, 0.6);
					}
				}
			}

			.right-btn {
				width: 87px;

				.btn1 {
					width: 87px;
					padding: 6px 0;
					background: #03D7FC;
					border-radius: 18px 18px 18px 18px;
					font-size: 14px;
					font-weight: 500;
					color: #06407A;
					text-align: center;
					margin-top: 3px;
				}

			}
		}

	}
</style>