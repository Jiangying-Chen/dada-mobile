<template>
	<view style="position: relative;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="编辑资料" :isback="true" color="#333"></top-nave>
		
		<view class="mainbg">
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;" >
				<view class="" style="line-height: 36px;width: 65px;">
					实名信息
				</view>
				<view v-if="userInfo.identity" class="identity">
					已认证
				</view>
				 <view class="rightview" style="flex: 1 1 0%;" v-else  @click="isOpenRealName=true">
				 	   <text style="color:grey;font-size: 28rpx;">请填写实名信息</text>
					   <u-icon name="arrow-right" color="#0F0158" size="28"></u-icon>
				 </view>
			</view>
			
			<RealName v-model="isOpenRealName"></RealName>
			
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="" style="line-height: 36px;width: 65px;">
					头像
				</view>
				 <button class="chooseImg"   open-type="chooseAvatar" @chooseavatar="onAvatarBefore">
					<u-avatar mode="square" slot="right" :src="userInfo.avatar" size="100"></u-avatar>
					
				 </button>
			</view>
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;" @click="openPop=true">
					<view class="" style="line-height: 36px;width: 65px;">名字</view>
				    <view class="rightview" style="flex: 1 1 0%;">
						{{userInfo.username ||''}}
				    </view>
			</view>
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;">
				<view class="" style="line-height: 36px;width: 65px;">
					个人介绍
				</view>
				<view class="rightview" style="flex: 1 1 0%;">
					<u-input @click="jump(userInfo.intro,'intro')" :placeholder="userInfo.intro" :disabled="true" placeholder-style='placeholderStyle'
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
			<view class="uni-flex uni-row infoview" style="justify-content: space-between;" @click="getSet">
				<view class="" style="line-height: 36px;width: 65px;">我的母星</view>
				<view class="rightview" style="flex: 1 1 0%;">
						{{topicName ||''}}<u-icon name="arrow-right" color="#0F0158"></u-icon>
				</view>
			</view>
			<!-- <view class="uni-flex uni-row infoview" style="flex-direction: column; justify-content: space-between;" >
				<view class="uni-flex uni-row" style="width: 100%; line-height: 36px;align-items:center;justify-content: space-between;">
					<view>所在星球</view>
					<view>
						<u-icon name="arrow-right" color="#0F0158"></u-icon>
					</view>
				</view>
				<scroll-view :scroll-x="true" style="width: 100%;display: flex;overflow-x: hidden;" class="scrollbox">
					<view class="top-type" v-for="(item,index) in joinTopicList" style="width: 35%;"
						@tap="changeInfo(item,index)" :class="infoIndex == index ? 'active':''">
						{{item.topicName}}
					</view>
				</scroll-view>
			</view> -->
			
			<!-- <view class="uni-flex uni-row infoview" style="flex-direction: column; justify-content: space-between;" >
				<view class="uni-flex uni-row" style="width: 100%; justify-content: space-between;align-items: center;">
					<view class="" style="line-height: 36px;width: 65px;">照片集</view>
					<view >
						已选{{fileList.length>0?fileList.length:0}}张<u-icon name="arrow-right" color="#0F0158"></u-icon>
					</view>
				</view>
				
				<view class="" style="display: flex;width: 100%;">
					<u-upload ref="uUpload" :file-list="fileList" :action="uploadImgUrl" 
						:to-json="true" :size-type="['compressed']"   @on-remove="handleRemove" 
						name="Image"   max-count="9" :header="header"  width="135" height="135"  @on-uploaded="submitTupian"
					></u-upload>
				</view>
			</view> -->
		
			<!-- <view class="saveBtn" @click="submit"> 
				保存
			</view> -->
			<view style="height: 200rpx;">&nbsp;</view>
		</view>
		<!-- <view class="f-fixed">
			<lf-button @click="outlogin" color="#03D7FC" font="#06407A">退出登录</lf-button>
		</view> -->
		<!-- 性别选择 -->
		<lf-select v-model="showGender" :list="gender" @confirm="saveGender"></lf-select>
		
		<!-- 修改昵称 -->
		<u-popup v-model="openPop" mode="center" border-radius="28" >
			<view class="pop-class">
				<view class="title">修改昵称</view>
				<form @submit='formSubmit' >
					<view class="inp-class">
						<input type="nickname" class="weui-input" name='nickName' placeholder="请输入昵称"  v-model='userInfo.username'/>
					</view>
					<button class="btn-class"  form-type="submit" >保存</button>
				</form>
			</view>
		</u-popup>
		
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
				uploadImgUrl: this.$c.domain + 'common/upload',
				header: {
					token: uni.getStorageSync('token')
				},
				form: {
					userImages:"",
					},
				fileList: [],
				infoIndex:0,
				navigationBarHeight: 0,
				statusBarHeight: 0,
				form: {},
				//userInfo: {},
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
				],
				topicName:'',
				openPop:false,
				pages:0,
				isLoadMore:false,
				joinTopicList:[],
				lists:[],
				fileImgList: [],

				isOpenRealName:false,
			};
		},
		onLoad(options) {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			this.getUserInfo();
			this.getUserJoinTopic();
		},
		computed:{
			userInfo:{
				get(){
					return this.$store.state.loginUserInfo;
				},
				set(){
					
				}
				
			}
		},
		onReady() {
				
		},
		methods: {
			//移除照片
			handleRemove(file){
				console.log('---file',file)
				this.fileList.splice(file,1)
				console.log('this.fileList',this.fileList)
				this.updateUserInfoImage();
			},
		   //所有图片上传完毕触发
			submitTupian(e) {
				console.log('上传完成 e====',e)
				this.fileList = e.map(v=>({url:v.url}));
				this.updateUserInfoImage();
			},
			//修改用户信息的相册接口
			updateUserInfoImage(){
				let userImagesList = JSON.stringify(this.fileList);
				console.log(userImagesList,'====this.lists===')
				this.$H.post('user/userInfoEdit', {
					userImages:userImagesList
				}).then(res => {
					if (res.code == 0) {
						this.getUserInfo();
						this.$f.toast('修改成功')
					}
				});
			},
			
			submit() {
				this.$refs.uUpload.upload();
			},
			onChoose(){
				let that=this;
				let imgpat = this.$refs.uUpload.lists;
				let filearr=imgpat.map(v=>({
					file:v.file.path
				}))
				console.log(filearr,'imgpat====');
				// 将图片上传到服务器
				uni.uploadFile({
					url: that.$c.domain + 'common/upload', // 图片要上传的服务器地址
					filePath: filearr,
					name: 'file',
					success: (res) => {
						if (res.code === 200) {
							this.$refs.uToast.show({
								title: '更新成功',
								type: 'success',
							})
						}
					},
					})
			},
			changeInfo(item,index){
				this.infoIndex=index;
				uni.setStorageSync('topicId', item.id);
				
			},
			// 获取当前加入的圈子
			getUserJoinTopic() {
				let _this=this;
				_this.$H.post('topic/userJoinTopic',{
						page:_this.pages,
					})
					.then(res => {
						_this.joinTopicList = _this.joinTopicList.concat(res.result.data);
						_this.isLoadMore = (_this.pages == res.result.total);
						if (!_this.isLoadMore) {
							_this.pages++;
						}
						uni.stopPullDownRefresh();
					});
			},
			// 当前母星
			getCurrentParent(){
				this.$H.get('topic/getParent/' + this.userInfo.uid).then(res => {
					this.toppicDetail(res.result.topicId)
				})
			},
			toppicDetail(id) {
				this.$H.get('topic/detail', {
					id: id
				}).then(res => {
					this.topicName = res.result.topicName;
					
				});
			},
			// 设置母星
			getSet(){
				uni.navigateTo({
					url:'/pages/login/setParent'
				})
			},
			formSubmit(e){
			   let nickName = e.detail.value.nickName; //获取昵称
			   //修改昵称
			   let obj = {
				   username:nickName
			   }
			   this.$H.post("user/userInfoEdit", obj).then(res => {
			   	  if (res.code == 0) {
						this.userInfo.username = nickName;
						$store.state.loginUserInfo = this.userInfo;
						this.openPop = false;
						this.$f.toast('修改成功')
			   	  }else{
					  this.$f.toast(res.msg)
				  }
			   })
			},
			
			
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
					this.userInfo = res.result;
					let arrList=this.userInfo.userImages?JSON.parse(this.userInfo.userImages):[];
					this.fileList=arrList.map(v=>({url:v.url}));
					console.log('用户信息 this.userInfo',this.userInfo)
					if (res.result.gender === 1) {
						this.userInfo.gender = '男'
					} else if (res.result.gender === 2) {
						this.userInfo.gender = '女'
					} else {
						this.userInfo.gender = '保密'
					}
					this.getCurrentParent();
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
			//获取微信头像
			onAvatarBefore(e){
				 let tempUrl =  e.detail.avatarUrl;
				 if(tempUrl){
						this.myUploadFile(tempUrl)
				 }
			},
			myUploadFile(tempUrl){
				let that = this;
				uni.uploadFile({
					url: that.$c.domain + 'common/upload',
					filePath: tempUrl,
					name: 'Image',
					header: {
						token: uni.getStorageSync("token")
					},
					success: (uploadFileRes) => {
						console.log(uploadFileRes,'uploadFileRes==')
						let data = JSON.parse(uploadFileRes.data)
						if (data.code == 0) {
							that.updateAvatar(data.result)
							//uni.hideLoading();
						}
					}
				});
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
<style scoped lang="scss">
	.identity{
		width: 100rpx;
		height: 44rpx;
		text-align: center;
		line-height: 44rpx;
		background: #00A469;
		border-radius: 8rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #FFFFFF;
	}
	
	.chooseImg::after{ border: none; }
	.scrollbox{
		white-space: nowrap;
		margin: 5rpx;
		.top-type{
			display: inline-block;
			margin: 5rpx;
			padding:0 10rpx;
			height: 48rpx;
			text-align: center;
			line-height: 48rpx;
			background: #7F7DEB;
			font-size: 24rpx;
			font-weight: 500;
			color: #C1C0FA;
			border-radius: 32rpx 32rpx 32rpx 32rpx;
		}
		.active{
			background: #6322EF;
			color: #FFFFFF;
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
	.saveBtn{
		width: 680rpx;
		margin: 0 auto;
		text-align: center;
		line-height: 88rpx;
		height: 88rpx;
		background: #6322EF;
		border-radius: 44rpx 44rpx 44rpx 44rpx;
		font-size: 36rpx;
		font-weight: 500;
		color: #FFFFFF;
		
		
	}
	.pop-class{
		width: 560rpx;
		padding: 40rpx;
		height: auto;
		.title{
			font-size: 32rpx;
			font-weight: 600;
		}
		.inp-class{
			margin-top: 36rpx;
			border:1px solid $border-color;
			padding: 20rpx;
			// width: 520rpx;
		}
		.btn-class{
			margin-top: 36rpx;
			background-color: $btn-base;
			color: #fff;
			text-align: center;
			// width: 520rpx;
		}
		
	}
	
	
	.chooseImg{
		background-color: transparent;
		// width: 90px;
		// height: 90px;
		padding: 0;
		margin: 0;
	}	
	
	.placeholderStyle{
		color: $text-color-base;
	}
	.infoview{
		align-items: center;
		margin:12px 12px;
		background: $bg-color-light;
		//background-color: #000;
		border-radius: 8px 8px 8px 8px;
		padding: 12px 16px;
		font-size: 14px;
		font-weight: 400;
		color: $text-color-base;
		.des{
			font-size: 12px;
			font-weight: 400;
			color:$text-color-base;
		}
		.rightview{
			text-align: right;
			.time{
				font-size: 12px;
				font-weight: 400;
				color: $text-color-base;
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
		color: $text-color-base;
		border: 1px solid  $text-color-base;
	}
	
	.f-fixed{
		background: none;
		
	}
</style>

