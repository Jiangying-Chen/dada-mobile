<template>
	<view class="container">
		<!-- 类型 -->
		<view @click="show = true"
			style="display: flex;align-items: center;justify-content: space-between;margin-top: 33rpx;">
			<view class="" style="font-size: 32rpx;font-weight: 600;">
				举报类型
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
			class="post-txt" disabled="true"></textarea>

		<!-- 图片截图 -->
		<view class="contentNav">截图证据</view>
		<block>
			<u-upload ref="uUpload" :file-list="fileList" :deletable="false" :auto-upload="false"></u-upload>
		</block>
		<u-line length="690rpx" margin="30rpx 0 0 30rpx" color="#F6F6F6"></u-line>
		<!-- 反馈 -->
		<view class="contentNav">举报反馈</view>
		<textarea v-if="form.feedback" :auto-height="true" maxlength="-1" v-model="form.feedback"
			class="post-txt" disabled="true"></textarea>
		<text style="font-size: 30rpx;color: #ff0000" v-else>等待管理员处理</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fileList: [],
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
					feedback:''
				},
				header: {
					token: uni.getStorageSync('token')
				},
				id:'',

			};
		},
		onLoad(options) {
			if(options.id){
				this.id=options.id
				this.getDetail();
			}

		},
		methods: {
			getDetail(){
				this.$H.get('/report/detail',{
					id:this.id
				}).then(res=>{
					if(res.code==0){
						let arr=res.result.media;
						
						var fileList = [];
						
						for (var i = 0; i <arr.length; i++) {
						　　var obj = {};
						　　obj.url = arr[i];
						　　fileList.push(obj);
						}
						this.fileList=fileList
						this.form.feedback=res.result.feedback
						this.form.content=res.result.content
						if(res.result.type==1){
							this.cateName='帖子'
						}else if(res.result.type==2){
							this.cateName='评论'
						}else if(res.result.type==3){
							this.cateName='用户'
						}else if(res.result.type==4){
							this.cateName='圈子'
						}
					}
				})
			},
			
			chooseClass(id, name) {
				this.form.cateId = id;
				this.cateName = name;
				this.show = false;
			},
			
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
