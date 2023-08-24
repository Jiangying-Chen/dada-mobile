<template>
	<view style="position: relative;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="编辑资料" :isback="true"></top-nave>
		
		<view class="mainbg">
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="" style="line-height: 36px;width: 65px;">
					头像
				</view>
				<view class="rightview" style="flex: 1 1 0%;">
					<u-avatar @click="onAvatar" mode="square" slot="right" :src="userInfo.avatar" size="100"></u-avatar>
				</view>
			</view>
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="" style="line-height: 36px;width: 65px;">
					名字
				</view>
				<view class="rightview" style="flex: 1 1 0%;">
					<u-input @click="jump(userInfo.username,'username')" :placeholder="userInfo.username"
						:disabled="true" input-align="right" />
				</view>
			</view>
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="" style="line-height: 36px;width: 65px;">
					个人介绍
				</view>
				<view class="rightview" style="flex: 1 1 0%;">
					<u-input @click="jump(userInfo.intro,'intro')" :placeholder="userInfo.intro" :disabled="true"
						input-align="right" />
				</view>
			</view>
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="" style="line-height: 36px;width: 65px;">
					我的爱好
				</view>
				<view class="rightview" style="flex: 1 1 0%;">
					<view @click="jump(userInfo.tagStr,'tagStr')" class="tag-box">
						<view v-for="(item,index) in userInfo.tagStr" :key="index" class="tag">{{item}}</view>
					</view>
				</view>
			</view>
			
		</view>
		<!-- <view class="c-wrap">
			<u-form ref="uForm" label-width="auto">
				<u-form-item label="头像">
					<u-avatar @click="onAvatar" mode="square" slot="right" :src="userInfo.avatar" size="100"></u-avatar>
				</u-form-item>
				<u-form-item label="昵称" right-icon="arrow-right">
					<u-input @click="jump(userInfo.username,'username')" :placeholder="userInfo.username"
						:disabled="true" input-align="right" />
				</u-form-item>
				<u-form-item label="邮箱" right-icon="arrow-right">
					<u-input @click="jump(userInfo.email,'email')" :placeholder="userInfo.email" v-if="userInfo.email"
						:disabled="true" input-align="right" />
					<u-input @click="jump(userInfo.email,'email')" placeholder="未绑定" v-else
						:disabled="true" input-align="right" />
				</u-form-item>
				<u-form-item label="性别" right-icon="arrow-right">
					<u-input @click="showGender = true" :placeholder="userInfo.gender" :disabled="true"
						input-align="right" />
				</u-form-item>
				<u-form-item label="个性签名" right-icon="arrow-right">
					<u-input @click="jump(userInfo.intro,'intro')" :placeholder="userInfo.intro" :disabled="true"
						input-align="right" />
				</u-form-item>
				<u-form-item label="标签" label-position="top" :border-bottom="false">
					<view @click="jump(userInfo.tagStr,'tagStr')" class="tag-box">
						<view v-for="(item,index) in userInfo.tagStr" :key="index" class="tag">{{item}}</view>
					</view>
				</u-form-item>
			</u-form>
		</view> -->
		<!-- <view class="f-fixed">
			<lf-button @click="outlogin" color="#03D7FC" font="#06407A">退出登录</lf-button>
		</view> -->
		<!-- 性别选择 -->
		<lf-select v-model="showGender" :list="gender" @confirm="saveGender"></lf-select>
	</view>
</template>

<script>
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
				form: {},
				userInfo: {},
				showGender: false,
				gender: [{
						lable: "男",
						value: 1
					},
					{
						lable: "女",
						value: 2
					},
					{
						lable: "保密",
						value: 0
					}
				]
			};
		},
		onShow(options) {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			this.getUserInfo();
		},
		methods: {
			// 修改性别
			saveGender(index) {
				let gender = this.gender[index[0]].value;

				this.$H.post("user/userInfoEdit", {
					gender: gender
				}).then(res => {
					if (res.code == 0) {
						this.userInfo.gender = this.gender[index[0]].lable
					}
				})
			},
			getUserInfo() {
				this.$H.get("user/userInfo").then(res => {
					this.userInfo = res.result
					if (res.result.gender === 1) {
						this.userInfo.gender = '男'
					} else if (res.result.gender === 2) {
						this.userInfo.gender = '女'
					} else {
						this.userInfo.gender = '保密'
					}
					$store.state.loginUserInfo = this.userInfo
					uni.setStorageSync("userInfo", this.userInfo)

				})
			},
			jump(value, type) {
				uni.navigateTo({
					url: "submit?value=" + JSON.stringify(value) + "&type=" + type
				})
			},
			outlogin() {
				$store.state.totalUnread.message=0;
				$store.state.totalUnread.notice=0;
				uni.removeStorageSync("hasLogin");
				uni.removeStorageSync("token");
				uni.removeStorageSync("userInfo");
				uni.closeSocket();
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			onAvatar() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						uni.showLoading({
							mask: true,
							title: "上传头像中"
						})
						uni.uploadFile({
							url: that.$c.domain + 'common/upload',
							filePath: res.tempFilePaths[0],
							name: 'Image',
							header: {
								token: uni.getStorageSync("token")
							},
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)
								if (data.code == 0) {
									that.updateAvatar(data.result)
									uni.hideLoading();
								}
							}
						});
					}
				});

			},
			updateAvatar(avatar) {
				this.$H.post("user/userInfoEdit", {
					avatar: avatar
				}).then(res => {
					if (res.code == 0) {
						this.userInfo.avatar = avatar;
						$store.state.loginUserInfo = this.userInfo;
						uni.setStorageSync("userInfo", this.userInfo)
					}
				})
			}
		}
	}
</script>
<style scoped lang="less">
	.infoview{
		margin:12px 12px;
		background: #06407A;
		border-radius: 8px 8px 8px 8px;
		padding: 12px 16px;
		font-size: 14px;
		font-weight: 400;
		color: #FFFFFF;
		.des{
			font-size: 12px;
			font-weight: 400;
			color: rgba(255,255,255,0.8);
		}
		.rightview{
			text-align: right;
			.time{
				font-size: 12px;
				font-weight: 400;
				color: rgba(255,255,255,0.8);
				padding-bottom: 12px;
			}
			span{
				font-size: 14px;
				font-weight: 400;
				color: #FFDA44;
				margin-left: 6px;
			}
			image{
				width: 96px;
				height: 96px;
			}
		}
	}
	
</style>
<style scoped>
	
	.c-wrap {
		padding: 20rpx;
		background-color: #FFFFFF;
	}

	.bind-mobile {
		display: flex;
	}

	/* 标签 */
	.tag-box {}

	.tag-box .tag {
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		display: inline-block;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		background-color: none;
		color: #FFFFFF;
		border: 1px solid rgba(255,255,255,0.5);
	}

	/* .tag-box .tag:nth-child(2n) {
		background-color: #ecf9f2;
	}

	.tag-box .tag:nth-child(3n) {
		background-color: #fff7e5;
	}

	.tag-box .tag:nth-child(5n) {
		background-color: #b3e0ff;
	} */
	
	.f-fixed{
		background: none;
		
	}
</style>
