<template>
	<view>
		<lf-field label="圈子类目" :required="true" :disabled="true" type="select" :isClick="true" @click="jumpClass" :placeholder="cateName"></lf-field>
		<lf-field label="圈子名称" v-model="form.topicName" :required="true" placeholder="请填写圈子名称"></lf-field>
		<lf-field label="圈子介绍" type="textarea" v-model="form.description" :required="true" placeholder="请填写圈子介绍"></lf-field>
		<view class="upload-wrap">
			<u-form-item :required="true" label="圈子头像" label-position="top">
				<u-upload
					ref="uUpload"
					name="Image"
					:header="header"
					:action="uploadImgUrl"
					@on-remove="onRemove1"
					:before-upload="beforeUpload"
					max-count="1"
					@on-uploaded="onUploaded1"
				></u-upload>
			</u-form-item>
			<u-form-item :required="true" label="圈子背景" label-position="top">
				<u-upload
					ref="uUpload"
					name="Image"
					:header="header"
					:action="uploadImgUrl"
					@on-remove="onRemove2"
					:before-upload="beforeUpload"
					max-count="1"
					@on-uploaded="onUploaded2"
				></u-upload>
			</u-form-item>
		</view>
		<!-- 提交按钮 -->
		<view class="submit-bottom">
			<view class="create-wrap">
				<view class="" style="margin-top: 10rpx;margin-right: 40rpx;">
					<checkbox-group @change="isAgree">
						<label>
							<checkbox color="#333333" :value="agree" :checked="agree"  /><text
								style="font-size: 24rpx;color:#828282">我已清楚平台规范并自愿承担责任</text>
						</label>
					</checkbox-group>
				</view>
				<view class="create-btn" @click="submit" v-if="canAdd">
					提交
				</view>
				<view class="create-btn2" v-else>
					权限不足
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			agree: true,
			cateList: [],
			cateName: '请选择',
			uploadImgUrl: this.$c.domain + 'common/upload',
			header: {
				token: uni.getStorageSync('token')
			},
			form: {
				cateId: '',
				topicName: '',
				description: '',
				coverImage: '',
				bgImage: ''
			},
			canAdd: false,
		};
	},
	onLoad() {
		this.getCate();
		this.detection();
	},
	methods: {
		detection(){
			this.$H.get('topic/detection').then(res => {
				if(res.code==0){
					this.canAdd=res.result
				}
			});
		},
		isAgree(){
			if(this.agree){
				this.agree=false
			}else{
				this.agree=true
			}
		},
		beforeUpload() {
			uni.showLoading({
				mask: true,
				title: '上传中'
			});
		},
		jumpClass() {
			uni.navigateTo({
				url: 'category'
			});
		},
		onRemove1() {
			this.form.coverImage = '';
		},
		onRemove2() {
			this.form.bgImage = '';
		},
		onUploaded1(e) {
			this.form.coverImage = e[0].response.result;
			uni.hideLoading();
		},
		onUploaded2(e) {
			this.form.bgImage = e[0].response.result;
			uni.hideLoading();
		},
		submit() {
			if(!this.agree){
				this.$u.toast('请先勾选同意框');
				return;
			}
			if (!this.form.cateId) {
				this.$u.toast('请选择圈子类目');
				return;
			}

			if (!this.form.topicName) {
				this.$u.toast('请填写圈子名称');
				return;
			}

			if (!this.form.description) {
				this.$u.toast('请填写圈子介绍');
				return;
			}

			if (!this.form.coverImage) {
				this.$u.toast('请上传圈子头像');
				return;
			}

			if (!this.form.bgImage) {
				this.$u.toast('请上传圈子主页背景图');
				return;
			}

			this.$H.post('topic/topicAdd', this.form).then(res => {
				if (res.code == 0) {
					this.$u.toast('成功创建圈子');
					uni.redirectTo({
						url: '/pages/topic/detail?id=' + res.result
					});
				}
			});
		},
		getCate() {
			this.$H.post('topic/classList').then(res => {
				this.cateList = res.result;
			});
		}
	}
};
</script>

<style>
page {
	background-color: #fff;
}

.upload-wrap {
	padding: 30rpx;
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
	
	.create-btn2 {
		width: 180rpx;
		height: 70rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #4a4a4a;
		color: #ffffff;
		font-size: 26rpx;
		margin-left: 55rpx;
	}
</style>
