<template>
	<view>
		<block v-for="(item, index) in userList" :key="index">
			<navigator :url="'/pages/user/home?uid=' + item.uid" :class="isyonghu?'member-item':'member-item1'">
				<u-avatar class="avatar" :src="item.avatar"></u-avatar>
				<view class="user">
					<text class="name" style="color: #0F0158;padding-left: 10rpx;">{{ item.username }}</text>
					<text v-if="item.gender == 1" class="iconfont icon-nan"></text>
					<text v-if="item.gender == 2" class="iconfont icon-nv"></text>
				</view>
				<view v-if="isyonghu">
					<u-button :custom-style="customStyle" @click="follow(index, item.uid)" v-if="item.hasFollow === 0" class="btn-gz" type="default" size="mini">关注</u-button>
					<u-button @click="cancelFollow(index, item.uid)" v-if="item.hasFollow === 1" class="btn-gz" type="default" size="mini" plain>互相关注</u-button>
					<u-button @click="cancelFollow(index, item.uid)" v-if="item.hasFollow === 2" class="btn-gz" type="default" size="mini" plain>已关注</u-button>
								
				</view>
				
			</navigator>
		</block>
		<!-- 加载状态 -->
		<block v-if="loadStatus != 'none'">
			<block v-if="list.length === 0 && loadStatus == 'nomore'"><u-empty margin-top="100" text="暂无用户" mode="favor"></u-empty></block>
			<block v-else><u-loadmore margin-bottom="50" margin-top="50" :status="loadStatus" /></block>
		</block>
	</view>
</template>

<script>
export default {
	props: {
		list: Array,
		loadStatus: String,
		isyonghu:{
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			userList: [],
			customStyle: {
							backgroundColor: 'black',
							color: 'white'
						}
		};
	},
	watch: {
		list() {
			this.userList = this.list;
		}
	},
	methods: {
		follow(index, uid) {
			this.$H
				.post('user/addFollow', {
					id: uid
				})
				.then(res => {
					if (res.code == 0) {
						this.userList[index].hasFollow = 2;
					}
				});
		},
		cancelFollow(index, uid) {
			this.$H
				.post('user/cancelFollow', {
					id: uid
				})
				.then(res => {
					if (res.code === 0) {
						this.userList[index].hasFollow = 0;
					}
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.member-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1px solid #f5f5f5;
	background-color: #ffffff;
	&:last-child{
		border-bottom: 0;
	}
	
}
.member-item1 {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background: #C1C0FA;
	border-radius: 16rpx 16rpx 16rpx 16rpx;
	&:last-child{
		border-bottom: 0;
	}
	
}

.member-item .icon-nv {
	color: #ff4d94;
}

.member-item .icon-nan {
	color: #0091ff;
}

.member-item .avatar {
	margin-right: 20rpx;
}

.member-item .user .name {
	margin-right: 20rpx;
	color:#0F0158 ;
}

.member-item .user .iconfont {
	font-size: 12px;
}
/* #ifndef MP */
.member-item .btn-gz {
	margin-right: 20rpx;
}
/* #endif */
/* #ifdef MP */
.member-item .btn-gz {
	margin-left: auto;
}
/* #endif */
</style>
