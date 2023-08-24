<template>
	<view class="container">
		<!-- 类型 -->
		<view @click="show = true"
			style="display: flex;align-items: center;justify-content: space-between;margin-top: 33rpx;">
			<view class="" style="font-size: 32rpx;font-weight: 600;">
				选择举报类型
			</view>
			<view class="" style="display: flex;align-items: center;">
				<view class="" style="font-size: 26rpx;color: #999999;margin-right: 19rpx;">
					{{cateName}}
				</view>
				<view class=""
					style="width: 15rpx;height: 15rpx;border-top: 4rpx solid #5a5a5a;border-right: 4rpx solid #000000;transform:rotate(45deg)">
				</view>
			</view>
		</view>
		<u-line length="690rpx" margin="30rpx 0 0 30rpx" color="#F6F6F6"></u-line>
		<!-- 描述 -->
		<view class="contentNav">举报描述</view>
		<textarea placeholder="提供更多信息有助于举报被快速处理" :auto-height="true" maxlength="-1" v-model="form.content"
			class="post-txt"></textarea>

		<!-- 图片截图 -->
		<view class="contentNav">截图证据</view>
		<block>
			<u-upload ref="uUpload" :size-type="['original']" name="Image" :max-count="9" :header="header"
				:action="uploadImgUrl" @on-uploaded="submit" :auto-upload="false"></u-upload>
		</block>

		<view class="submit-bottom">
			<view class="create-wrap">
				<view class="" style="margin-top: 10rpx;margin-right: 40rpx;">
					<checkbox-group>
						<label>
							<checkbox color="#333333" value="cb" checked="true" disabled="true" /><text
								style="font-size: 24rpx;color:#828282">我承诺描述内容和截图证据均属实</text>
						</label>
					</checkbox-group>
				</view>
				<view class="create-btn" @click="uploadImg">
					确认举报
				</view>
			</view>
		</view>
		<!-- 圈子弹出选择 -->
		<u-popup v-model="show" mode="bottom" border-radius="20">
			<view class="circle-wrap">
				<block v-for="(item, index) in classList" :key="index">
					<view @click="chooseClass(item.id,item.cateName)" class="one">
						{{ item.cateName }}
					</view>
					<view class="line" style="margin-bottom: 20rpx;"></view>
				</block>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false, //选择弹出
				uploadImgUrl: this.$c.domain + 'common/upload',
				classList: [{
						id: 1,
						cateName: '帖子'
					},
					{
						id: 2,
						cateName: '评论'
					},
					{
						id: 3,
						cateName: '用户'
					},
					{
						id: 4,
						cateName: '圈子'
					},
				],
				cateName: '未选择',
				form: {
					linkId: 0,
					cateId: '',
					content: '',
					media: [],
				},
				header: {
					token: uni.getStorageSync('token')
				},


			};
		},
		onLoad(options) {
			if (options.postId) {
				this.form.linkId = options.postId
				this.form.cateId = 1;
				this.cateName = '帖子';
			}
			if(options.uid){
				let userInfo = uni.getStorageSync("userInfo");
				if (userInfo) {
					if(userInfo.uid==options.uid){
						this.$u.toast('不能举报自己');
						setTimeout(function() {
							uni.navigateBack();
						}, 1000);
					}
				}else{
					// #ifdef MP-WEIXIN
						uni.navigateTo({
							url: "/pages/user/login"
						})
					// #endif
					
					// #ifdef H5||APP-PLUS
						uni.navigateTo({
							url: "/pages/user/go-login"
						})
					// #endif
				}
			}

		},
		methods: {
			uploadImg() {
				if (!this.form.cateId) {
					this.$u.toast('请选择举报类型');
					return;
				}
				if (!this.form.content) {
					this.$u.toast('描述不能为空');
					return;
				}
				uni.showLoading({
					mask: true,
					title: '提交中'
				});
				this.$refs.uUpload.upload();
			},
			chooseClass(id, name) {
				this.form.cateId = id;
				this.cateName = name;
				this.show = false;
			},
			submit(e) {
				uni.showLoading({
					mask: true,
					title: '提交中'
				});

				let mediaList = [];
				e.forEach(function(item, index) {
					mediaList.push(item.response.result);
				});

				this.form.media = mediaList;
				if (this.form.media.length == 0) {
					uni.hideLoading();
					this.$u.toast('截图材料不能为空');
					return;
				}

				this.$H.post('report/addReport', this.form).then(res => {
					if (res.code == 0) {
						this.$u.toast('举报成功');
						setTimeout(function() {
							uni.reLaunch({
								url: '/pages/report/list'
							});
						}, 1000);
					}
					uni.hideLoading();
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		padding: 10rpx 20rpx;
		overflow: scroll;
	}

	.circle-wrap {
		padding: 40rpx 0 70rpx;

		.one {
			display: flex;
			justify-content: center;
			margin-bottom: 16rpx;
			font-size: 30rpx;
			color: #000000;
			line-height: 42rpx;
		}
	}

	.line {
		width: 690rpx;
		height: 1rpx;
		background-color: #F6F6F6;
		margin-left: 30rpx;
	}

	.submit-bottom {
		position: fixed;
		bottom: 0;
		border-top: 1px solid #eeeeee;
		width: 750rpx;
		height: 150rpx;
		background-color: white;
		display: flex;
		padding: 25rpx;
		justify-content: center;

	}

	.create-wrap {
		display: flex;
	}

	.create-btn {
		width: 180rpx;
		height: 70rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #000000;
		color: #ffffff;
		font-size: 26rpx;
		margin-left: 55rpx;
	}

	.contentNav {
		font-size: 32rpx;
		font-weight: bold;
		color: #000000;
		// padding: 10rpx 10rpx;
	}

	.title-input {
		border-bottom: 1px solid #F5F5F5;
		margin: 20rpx 0;
		padding: 20rpx 0;
	}

	.post-txt {
		width: 100%;
		padding: 20rpx 0;
		min-height: 300rpx;
	}

	.upload-wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 180rpx;
		height: 180rpx;
		background-color: #F5F5F5;
		margin-top: 30rpx;
		border-radius: 10rpx;

		.icon {
			width: 50rpx;
			height: 50rpx;
		}

		text {
			font-size: 24rpx;
		}
	}
</style>
