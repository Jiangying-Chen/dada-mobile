<template>
	<view class="container">
		<view class="f-wrap">
			<u-form ref="uForm">
				<u-form-item label="圈子名称" label-width="auto"><u-input input-align="right" v-model="form.topicName" placeholder="请填写圈子名称" /></u-form-item>
				<u-form-item label="圈子描述" label-position="top"><u-input type="textarea" v-model="form.description" placeholder="请填写圈子描述" /></u-form-item>
				<u-form-item label="圈子封面" label-position="top">
					<u-upload
						ref="uUpload"
						name="Image"
						:file-list="fileList1"
						:header="header"
						:action="uploadImgUrl"
						max-count="1"
						@on-uploaded="onUploaded1"
						:before-upload="beforeUpload"
						@on-remove="onRemove1"
					></u-upload>
				</u-form-item>
				<u-form-item label="圈子背景" label-position="top">
					<u-upload
						ref="uUpload"
						name="Image"
						:file-list="fileList2"
						:header="header"
						:action="uploadImgUrl"
						max-count="1"
						@on-uploaded="onUploaded2"
						:before-upload="beforeUpload"
						@on-remove="onRemove2"
					></u-upload>
				</u-form-item>
			</u-form>
		</view>
		<!-- 提交按钮 -->
		<lf-button shape="circle" @click="submit">提交</lf-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			uploadImgUrl: this.$c.domain + 'common/upload',
			header: {
				token: uni.getStorageSync('token')
			},
			form: {
				topicName: '',
				description: '',
				bgImage: '',
				coverImage: '',
				id: ''
			},
			fileList1: [],
			fileList2: []
		};
	},
	onLoad(options) {
		this.getTopicInfo(options.topicId);
		
	},
	methods: {
		beforeUpload() {
			uni.showLoading({
				mask: true,
				title: '上传中'
			});
		},
		onUploaded1(e) {
			this.form.bgImage = e[0].response.result;
			uni.hideLoading();
		},
		onUploaded2(e) {
			this.form.coverImage = e[0].response.result;
			uni.hideLoading();
		},
		onRemove1(index) {
			this.form.bgImage = '';
		},
		onRemove2(index) {
			this.form.coverImage = '';
		},
		submit() {
			this.$H.post('topic/topicEdit', this.form).then(res => {
				if (res.code == 0) {
					this.$u.toast('保存成功');
				}
			});
		},
		getTopicInfo(topicId) {
			this.$H
				.get('topic/detail', {
					id: topicId
				})
				.then(res => {
					this.fileList1 = [
						{
							url: res.result.bgImage
						}
					];

					this.fileList2 = [
						{
							url: res.result.coverImage
						}
					];

					this.form = res.result;
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f5f5f5;
}
</style>
