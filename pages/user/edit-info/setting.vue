<template>
	<view class="setting-box">
		<view class="setting-contain">
			<view class="txt-desc">
				<text>私信铃声通知</text>
			</view>
			<view class="btn">
				<switch @change="switchChange(1,systemConfig.bell)" color="#aaaaff" :checked="systemConfig.bell" />
			</view>
		</view>
		<u-line color="#bfbfbf"></u-line>
		<!-- #ifdef APP-PLUS -->
		<view class="setting-contain">
			<view class="txt-desc">
				<text>私信震动提示</text>
			</view>
			<view class="btn">
				<switch @change="switchChange(2,systemConfig.vibrate)" color="#aaaaff"
					:checked="systemConfig.vibrate" />
			</view>
		</view>
		<u-line color="#bfbfbf"></u-line>
		<!-- #endif -->
		<view class="setting-contain">
			<view class="txt-desc">
				<text>隐藏我的关注列表</text>
			</view>
			<view class="btn">
				<switch @change="change(1)" color="#aaaaff" :checked="form.isWatch" />
			</view>
		</view>
		<u-line color="#bfbfbf"></u-line>
		<view class="setting-contain">
			<view class="txt-desc">
				<text>隐藏我的粉丝列表</text>
			</view>
			<view class="btn">
				<switch @change="change(2)" color="#aaaaff" :checked="form.isFollow" />
			</view>
		</view>
		<u-line color="#bfbfbf"></u-line>
		<view class="setting-contain">
			<view class="txt-desc">
				<text>隐藏我的作品</text>
			</view>
			<view class="btn">
				<switch @change="change(3)" color="#aaaaff" :checked="form.isPost" />
			</view>
		</view>
		<u-line color="#bfbfbf"></u-line>
	</view>
</template>
<script>
	import {
		mapGetters
	} from 'vuex';
	import $store from '@/store/index.js';
	export default {
		data() {
			return {
				form: {
					isFollow: false,
					isWatch: false,
					isPost: false
				},
			}
		},
		onLoad() {
			this.getUserSetting();
		},
		computed: {
			...mapGetters(['systemConfig'])
		},
		methods: {
			getUserSetting(){
				this.$H.get('user/userSetting').then(res => {
						if (res.code === 0) {
							this.form.isFollow=res.result.isFan;
							this.form.isWatch=res.result.isWatch;
							this.form.isPost=res.result.isPost;
						}
					});
			},
			switchChange(i, flag) {
				switch (i) {
					case 1:
						$store.state.systemConfig.bell = !flag;
						break;
					case 2:
						$store.state.systemConfig.vibrate = !flag;
						break;
				
				}
				uni.setStorageSync('system_config', this.systemConfig);
			},
			change(i){
				switch (i) {
					case 1:
						this.form.isWatch = !this.form.isWatch;
						break;
					case 2:
						this.form.isFollow = !this.form.isFollow;
						break;
					case 3:
						this.form.isPost = !this.form.isPost;
						break;						
				}
				this.$H.post('user/updateUserSetting',{
					isFan:this.form.isFollow,
					isWatch:this.form.isWatch,
					isPost:this.form.isPost
				}).then(res => {
						if (res.code === 0) {
							this.$f.toast(res.msg)
						}
				});
			}
		}
	}
</script>
<style>
	.setting-box {}

	.setting-contain {
		display: flex;
		padding: 40rpx;
	}

	.txt-desc {
		margin-left: 40rpx;
		font-size: 36rpx;
		font-weight: 600;
	}

	.btn {
		margin-right: 30rpx;
		position: absolute;
		right: 0;
	}
</style>
