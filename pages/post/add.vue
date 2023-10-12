<template>
	<view class="">
			<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="发布动态" :isback="true"></top-nave>
		<view class="container">
			<!-- <h-tips content="请遵守社区规定,文明发帖共创和谐健康的社区环境"></h-tips> -->
			<!-- <input v-model="form.title" class="title-input" placeholder="标题" /> -->
			<view class="one-line" style="margin-top: 38rpx;">
				<view class="top">
					<view class="title">
						标题
					</view>
					<view class="num">
						{{form.title.length}}/20
					</view>
				</view>
				<view class="content">
					<input class="txt1" type="text" placeholder="起个标题叭~" maxlength="20" v-model="form.title" placeholder-style="font-size:14px">
				</view>
				<!-- <u-line margin="25rpx 0 0 0" length="690rpx" color="#F6F6F6"></u-line> -->
			</view>
			<!-- <u-line color="#c8c8c8"></u-line> -->
			<!-- 内容 -->
			<view class="one-line" style="margin-top: 38rpx;">
				<view class="top">
					<view class="title">
						内容
					</view>
					<view class="num">
						{{form.content.length}}/400
					</view>
				</view>
				<view class="content">
					<textarea placeholder="说些什么叭..." class="txt1 input-text1 post-txt1" maxlength="1000" :auto-height="true"
						v-model="form.content" placeholder-style="font-size:14px"></textarea>
				</view>
				<!-- <u-line length="690rpx" color="#F6F6F6" margin="20rpx 0 32rpx 0"></u-line> -->
			</view>
			<!-- 上传图片 -->
			<view v-if="form.type == 1" style="transform: translateX(-10rpx);margin: 20px 0;">
				<u-upload ref="uUpload" :size-type="['original']" name="Image" :max-count="9" :header="header"
					:action="uploadImgUrl" @on-uploaded="submit" :auto-upload="false" :custom-btn="true">
					<view slot="addBtn" class="slot-btn">
						<u-icon name="plus" size="40" color="#6f6f6f"></u-icon>
						<view class="slot-txt">
							上传图片
						</view>
					</view>
				</u-upload>
				<!-- <u-line length="690rpx" color="#F6F6F6" margin="30rpx 0 33rpx 0"></u-line> -->
			</view>
			<!-- 上传视频 -->
			<block v-if="form.type == 2">
				<view v-if="form.media.length == 0" class="upload-wrap" @click="chooseVideo">
					<image class="icon" src="/static/video.png"></image>
					<text>上传视频</text>
				</view>
				<video v-if="form.media.length > 0" @click="chooseVideo" :controls="false" :show-center-play-btn="false" class="upload-video" :src="form.media[0]"></video>
			</block>
			<!-- 选择星球-->
			<view class="one-line" style="margin-top: 38rpx;">
				<view class="top">
					<view class="title">
						当前星球
					</view>
					<!-- <view class="num">
						{{form.content.length}}/400
					</view> -->
				</view>
				<view class="content">
					{{topicName ||''}}
					<!-- <textarea placeholder="说些什么叭..." class="txt1 input-text1 post-txt1" maxlength="1000" :auto-height="true"
						v-model="form.content"></textarea> -->
				</view>
				<!-- <u-line length="690rpx" color="#F6F6F6" margin="20rpx 0 32rpx 0"></u-line> -->
			</view>
			<!-- <view>{{ topicName }}</view> -->
			<!-- <navigator v-if="isTopic" url="/pages/topic/choose-topic/choose-topic" class="choose-item">
				<image class="icons" src="/static/p_1.png"></image>
				<text class="txt">{{ topicName }}</text>
				<u-icon class="u-icon" name="arrow-right"></u-icon>
			</navigator> -->
			
			<!-- 选择话题 -->
			<navigator v-if="form.topicId" :url="'/pages/discuss/choose-discuss/choose-discuss?topicId=' + form.topicId" class="choose-item">
				<image class="icon" src="/static/m_1.png"></image>
				<text class="txt txt-l" v-if="disName=='选择话题'">选择话题</text>
				<text class="txt" v-else>{{ disName }}</text>
				<u-icon class="u-icon" name="arrow-right"></u-icon>
			</navigator>
			
			<!-- @好友 -->
			<view class="choose-item" @click="toNavChoose">
				<image class="icon" src="/static/m_1.png"></image>
				<text class="txt txt-l" v-if="callList.length==0">选择好友</text>
				<text class="txt" v-else>
					{{friendStr}}
				</text>
				<u-icon class="u-icon" name="arrow-right"></u-icon>
			</view>
			
			
			<!-- 帖子类型 -->
			<!-- <view class="choose-item">
				<image class="icon" src="/static/m_3.png"></image>
				<text class="txt">{{typeName}}</text>
				  <u-radio-group
					class="radio"
				    v-model="radiovalue1"
				    placement="row"
				    @change="groupChange"
				  >
				    <u-radio
				      v-for="(item, index) in radiolist1"
				      :key="index"
				      :label="item.name"
				      :name="item.name"
					  active-color="#333333"
				      @change="radioChange"
				    >
				    </u-radio>
				  </u-radio-group>
			</view> -->
			<!-- 付费贴价格 -->
			<!-- <view class="choose-item" v-if="form.cut==1">
				<image class="icon" src="/static/price.png"></image>
				<text class="txt">付费贴单价</text>
				  <u-input
					class="inputStyle"
				    placeholder="查看详情内容需支付金额"
				    border="surround"
					type="digit"
					clearable
				    v-model="form.pay"
				    @change="inputChange"
				  ></u-input>
			</view> -->
			<!-- 所在位置 -->
			<!-- <view @click="chooseLocation" class="choose-item" style="margin-bottom: 60rpx;">
				<u-icon class="icon add-icon" name="map" color="#999" size="40"></u-icon>
				<text class="txt">{{ form.address || '所在位置' }}</text>
				<u-icon class="u-icon" name="arrow-right"></u-icon>
			</view> -->
			<!-- 发布按钮 -->
			<view class="release-btn">
				<view class="btn" v-if="form.type == 1" @click="uploadImg">
					立即发表
				</view>
				<view class="btn" v-if="form.type == 2" @click="videoSubmit">
					立即发表
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
import hTips from '@/components/h-tips/h-tips.vue'
import topNave from '@/components/nav-header/index.vue';
export default {
	data() {
		return {
			navigationBarHeight: 0,
			statusBarHeight: 0,
			
			uploadImgUrl: this.$c.domain + 'common/upload',
			// topicName: '选择星球',
			topicName:'',
			disName: '选择话题',
			typeName: '普通贴',
			form: {
				title: '',
				type: 1,
				topicId: '',
				discussId: '',
				content: '',
				media: [],
				longitude: 0,
				latitude: 0,
				address: '',
				cut: 0,
				pay: '',
			},
			header: {
				token: uni.getStorageSync('token')
			},
			isTopic: true,
			switch2:0,
		  // 基本案列数据
		  radiolist1: [{
			name: '普通贴',
			disabled: false
		    },
			{
			  name: '付费贴',
			  disabled: false
			}
		  ],
		  // u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
		  radiovalue1: '普通贴',
		  callList:[],
		  
		  uid:'',
		  avatar:'',
		  username:'',
		  friendStr:'',
		  
		};
	},
	components: {
		hTips,topNave
	},
	onShow() {
		if(uni.getStorageSync('callFriendList')){
			this.callList = JSON.parse(uni.getStorageSync('callFriendList'));
			console.log('this.callList',this.callList)
			this.friendStr = this.callList.map(v=>v.notation).join(',');
			console.log('this.friendStr',this.friendStr)
		}
		
		
		if(uni.getStorageSync('topicId')){
			this.form.topicId=uni.getStorageSync('topicId')
		}
		
		console.log(uni.getStorageSync('topicId'),'=uni.getStorageSync')
		this.toppicDetail(uni.getStorageSync('topicId'))
		
	},
	onLoad(options) {
		this.navigationBarHeight = getApp().globalData.statusBarHeight;
		this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
		this.form.type = options.type;
		
		if(uni.getStorageSync('userInfo').uid){
			this.uid = uni.getStorageSync('userInfo').uid;
			this.avatar= uni.getStorageSync('userInfo').avatar;
			this.username= uni.getStorageSync('userInfo').username;
		}else{
			uni.navigateTo({
				url:'/pages/user/login'
			})
		}
        try {
        	uni.removeStorageSync('callFriendList');
        } catch (e) {
        	// error
        }
		if (options.isTopic) {
			this.isTopic = options.isTopic;
		}

		if (options.topicId) {
			this.form.topicId = options.topicId;
			this.isTopic = false;
		}
		if (options.discussId) {
			this.form.discussId = options.discussId;
			this.disName=options.disName
		}
		
		
		// this.$H.get("user/userInfo").then(res => {
		// 		this.uid = res.result.uid;
		// 		this.$H.get('topic/getParent/' + this.uid).then(res => {
		// 			console.log(res,'获取当前母星==')
		// 			this.toppicDetail(res.result.topicId)
		// 			this.form.topicId=res.result.topicId;
		// 		})
		// 	})

		let location = uni.getStorageSync('location_info');
		this.form.longitude = location.longitude;
		this.form.latitude = location.latitude;
		
		
		
	},
	methods: {
		//选择好友
		toNavChoose(){
			let ids = this.callList.map(v=>v.friend_id).toString();
			console.log('ids',ids)
			uni.navigateTo({
				url:`/pages/message/chooseFriend?ids=${ids}`
			})
		},
		
		// 获取当前母星详情
		toppicDetail(id) {
			this.$H.get('topic/detail', {
				id: id
			}).then(res => {
				if(res.code==500){
					this.topicName ='';
				}else{
					this.topicName = res.result.topicName;
				}
			});
			
		},
		inputChange(n){
		},
	    groupChange(n) {
	    },
	    radioChange(n) {
		  
		  if(n=='普通贴'){
			  this.form.cut=0;
			  this.typeName='普通贴';
		  }else if(n=='付费贴'){
			  this.form.cut=1;
			  this.typeName='付费贴';
		  }
	    },
		change(e) {
			if(e){
				// console.log('111');
				this.form.topicId=3;
			}else{
				this.form.topicId=2;
				// console.log('222');
			}
		},
		chooseVideo() {
			var self = this;
			uni.chooseVideo({
				count: 1,
				sourceType: ['camera', 'album'],
				success: function(res) {
					let viedoPath = res.tempFilePath;

					uni.showLoading({
						mask: true,
						title: '上传中'
					});

					uni.uploadFile({
						url: self.$c.domain + 'common/upload',
						filePath: viedoPath,
						name: 'Image',
						header: {
							token: uni.getStorageSync('token')
						},
						success: uploadFileRes => {
							let upData = JSON.parse(uploadFileRes.data);
							if (upData.code == 0) {
								self.form.media.push(upData.result);
							}
						},
						complete() {
							uni.hideLoading();
						}
					});
				}
			});
		},
		uploadImg() {
			if (!this.form.topicId) {
				this.$u.toast('请选择圈子');
				return;
			}

			if (!this.form.content) {
				this.$u.toast('内容不能为空');
				return;
			}
			if (!this.form.title) {
				this.$u.toast('标题不能为空');
				return;
			}
			if(this.form.cut==1){
				var ret=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
				if(!ret.test(this.form.pay)){
					this.$u.toast('输入金额不合法');
					return;
				}
				if(this.form.pay<=0){
					this.$u.toast('输入金额必须大于0');
					return;
				}
				if(this.form.pay>100){
					this.$u.toast('输入金额必须小于100');
					return;
				}
			}
			uni.showLoading({
				mask: true,
				title: '发布中'
			});
			this.$refs.uUpload.upload();
		},
		chooseLocation() {
			let that = this;
			uni.chooseLocation({
				success: function(res) {
					that.form.address = res.name;
					that.form.latitude = res.latitude;
					that.form.longitude = res.longitude;
				},
				fail(err) {
					console.log(err)
				}
			});
		},
		videoSubmit() {
			if (this.form.media.length == 0) {
				this.$u.toast('请上传视频');
				return;
			}

			if (!this.form.topicId) {
				this.$u.toast('请选择圈子');
				return;
			}
			if (!this.form.content) {
				this.$u.toast('内容不能为空');
				return;
			}
			if (!this.form.title) {
				this.$u.toast('标题不能为空');
				return;
			}
			uni.showLoading({
				mask: true,
				title: '发布中'
			});
			
			// postCategoryList
			console.log(this.form,'from====')
			this.$H.post('post/addPost', this.form).then(res => {
				if (res.code == 0) {
					uni.redirectTo({
						url: '/pages/post/video-detail?id=' + res.result
					});
				}
				uni.hideLoading();
			});
		},
		//发布按钮
		submit(e) {
			uni.showLoading({
				mask: true,
				title: '发布中'
			});

			let mediaList = [];
			e.forEach(function(item, index) {
				mediaList.push(item.response.result);
			});
			this.form.media = mediaList;
			let list = this.callList.map(v=>({
				friend_id:v.friend_id,
				notation:v.notation
			}))
			this.form.atFriendList = JSON.stringify(list);
			
			this.$H.post('post/addPost', this.form).then(res => {
				if (res.code == 0) {
					this.callList.forEach(v=>{
						this.sendMessage(v.friend_id,res.result)
					})
					try {
						uni.removeStorageSync('callFriendList');
					} catch (e) {
						// error
					}
					
					uni.redirectTo({
						url: '/pages/post/detail?id=' + res.result
					});
					this.form={};
				}
				uni.hideLoading();
			});
		},
		//发送信息
		sendMessage(friend_id,postId){
			let m = {
				senderId: this.uid,
				senderName: this.username,
				senderAvatar: this.avatar,
				receiverId: friend_id,
				notation: '',
				applyMessage: '',
				postId:postId,
			}
			let msg = {
				type: 'at-friend',
				data: m
			}
			let that = this
			uni.sendSocketMessage({
				data: JSON.stringify(msg),
				success() {
					uni.showToast({
						icon: 'success',
						title: '发送成功'
					})
				},
				fail(res) {
					uni.showToast({
						icon: 'none',
						title: '发送失败,请重试'
					})
					websocket.initConnect()
				}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.txt-l{
	color: $text-color-light;
}
.container {
	padding: 20rpx;
	overflow: scroll;
}
.title-input{
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
	.icon{
		width: 50rpx;
		height: 50rpx;
	}
	
	text{
		font-size: 24rpx;
	}
}

.upload-video{
	width: 180rpx;
	height: 180rpx;
	margin-top: 30rpx;
}

.choose-item{
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1px solid $border-color;
	&:last-child{
		border: 0;
	}
	.txt{
		margin-left: 20rpx;
		font-size: 30rpx;
		//color: rgba(255,255,255,0.8);
	}
	.sw{
		margin-left: 300rpx;
	}
	.inputStyle{
		margin-left: 60rpx;
		width: 400rpx;
	}
	.radio{
		margin-right: auto;
		position: absolute; 
		right: 0;
	}
	.icon{
		width: 40rpx;
		height: 40rpx;
	}
	.u-icon{
		margin-left: auto;
		color: #999;
	}
	
	.add-icon{
		margin-left: 0;
	}
}

	.one-line {
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				font-size: 30rpx;
				font-weight: 500;
				color: $text-color-light;
				line-height: 42rpx;
			}

			.num {
				font-size: 24rpx;
				color: $text-color-light;
				line-height: 33rpx;
				opacity: 0.5;
			}
		}

		.content {
			margin-top: 26rpx;
			border-radius: 8px;
			background: $bg-color-light;
			padding: 8px;
			font-size: 28rpx;
			.txt {
				font-size: 30rpx;
				color: $text-color-light;
				line-height: 42rpx;
			}
		}
	}
	.slot-btn {
		margin: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 200rpx;
		height: 200rpx;
		border-radius: 10rpx;
		background-color: $bg-color-light;
	
	}
	
	.slot-txt {
		margin-top: 17rpx;
		font-size: 24rpx;
		color: #000000;
		line-height: 33rpx;
		opacity: 0.5;
	}
	.release-btn {
		display: flex;
		justify-content: center;
		margin-top: 40px;
		.btn {
			width: 100%;
			margin: 0 16px;
			padding: 12px 0;
			background: $btn-base;
			border-radius: 24px;
			font-size: 18px;
			font-weight: 500;
			color: $text-color-white;
			text-align: center;
		}
	}
</style>
