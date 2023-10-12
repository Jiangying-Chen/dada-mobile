<template>
	<!-- position: relative; -->
	<view style="background: #090C17;">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="矿产" :isback="true"></top-nave>
		<view class="toptitle">
			我的矿产<span>点击矿石可兑换燃料</span>
		</view>
		<scroll-view class="mineralsview" scroll-x="true">
			<view class="mineralsbox" v-for="item in mineralList"   @click="changeMinerals(item)">
				<view class="mineralsimage">
					<image :src="item.image" mode=""></image>
					<span class="mineralsnumber">{{item.mineralNum}}</span>
				</view>
				<view class="mineralsname">
					{{item.name}}
				</view>
				<view class="mineralscode">
					{{item.changePoint}}燃料
				</view>
			</view>
		</scroll-view>
		<view class="minerals">
			<!-- <image src="https://mallwj.hm-myy.cn/168992259982520230721145639.png" mode="widthFix"></image> -->
			<image src='https://mallwj.hm-myy.cn/169286377746220230824155617.png' mode="widthFix" style="width: 750rpx; height: 768rpx;"></image>
			<view class="uni-flex uni-row mineralstop" style="justify-content: space-between;">
				<view class="fontbox">
					今日已挖矿石 {{isMineral}} 颗
				</view>
				<view class="fontbox">
					下次刷新：{{downTime}}
				</view>
			</view>
			<view class="minerals-po" style="left: 0;bottom: 400rpx;" v-if="mineral[1].isShow == true" 
				@tap="getMineral(mineral[1])">
				<image :src="mineral[1].data.image" mode=""></image>
				<view class="titlename">
					{{mineral[1].data.mineralName}}
				</view>
			</view>
			<!-- <view class="minerals-po" style="left: 130rpx;bottom: 300rpx;"  v-if="mineral[1].isShow == true"
				@tap="getMineral(mineral[1])">
				<image :src="mineral[1].data.image" mode=""></image>
				<view class="titlename">
					{{mineral[1].data.mineralName}}
				</view>
			</view> -->
			<view class="minerals-po" style="left: 0;bottom: 25rpx;" v-if="mineral[2].isShow == true" 
				@tap="getMineral(mineral[2])">
				<image :src="mineral[2].data.image" mode=""></image>
				<view class="titlename">
					{{mineral[2].data.mineralName}}
				</view>
			</view>
			<view class="minerals-po" style="left: 130rpx;bottom: 300rpx;" v-if="mineral[3].isShow == true"
				@tap="getMineral(mineral[3])">
				<image :src="mineral[3].data.image" mode=""></image>
				<view class="titlename">
					{{mineral[3].data.mineralName}}
				</view>
			</view>
			<view class="minerals-po" style="right: 36rpx;bottom:380rpx;" v-if="mineral[4].isShow == true"
				@tap="getMineral(mineral[4])">
				<image :src="mineral[4].data.image" mode=""></image>
				<view class="titlename">
					{{mineral[4].data.mineralName}}
				</view>
			</view>
			<view class="minerals-po" style="right:8rpx;bottom: 62rpx;" v-if="mineral[5].isShow == true"
				@tap="getMineral(mineral[5])">
				<image :src="mineral[5].data.image" mode=""></image>
				<view class="titlename">
					{{mineral[5].data.mineralName}}
				</view>
			</view>
			<view class="minerals-po" style="right:130rpx;bottom: 140rpx;" v-if="mineral[6].isShow == true" 
				@tap="getMineral(mineral[6])">
				<image :src="mineral[6].data.image" mode=""></image>
				<view class="titlename">
					{{mineral[6].data.mineralName}}
				</view>
			</view>
		</view>
		<view class="friend-flex">
			<view class="titles">
				好友矿区
			</view>
			<view class="friend-label" @click="goToFriendList">全部好友<u-icon name="arrow-right-double"></u-icon></view>
		</view>
		
		<scroll-view class="peopleview" scroll-x="true">
			<view class="peoplebox" v-for="item in friendList" @tap="pageToFriend(item)">
				<view class="peopleimage">
					<image :src="item.avatar" mode=""></image>
				</view>
				<view class="peoplename">
					{{item.notation}}
				</view>
			</view>
		</scroll-view>
         
		 <!-- 矿石兑换和采集 -->
		<u-popup v-model="isShowTs" mode="center" border-radius="18">
			<view class="infobox">
				<view class="infobox-title">
					矿石{{title}}
				</view>
				<view class="infobox-contact">
					<view class ='flex-class'>
						<view>
							<image :src="nowMineral.data.image" mode="widthFix"  class="ks-img"></image>
						</view>
						<view>
							<view>
								{{title=='采集'?nowMineral.data.mineralName:nowMineral.data.name}}
							</view>
							<!-- <view class="infobox-font">
							 	可{{title}}数量：{{nowMineral.data.mineralNum}}
							 </view> --> 
							 <view v-if='title=="兑换"' style="color:#FFDA44">{{nowMineral.data.changePoint}}燃料</view>
						</view>
					</view>
					<view class="infobox-font uni-flex uni-row">
						<view style="margin-right: 30rpx;">
							{{title}}数量
						</view>
						<view class="uni-flex uni-row" v-if='title=="采集"'>
							1个
						</view>
						<view class="uni-flex uni-row" v-if='title=="兑换"'>
							<view class="opt-btn" @tap="delMineral()">
								<image src="https://mallwj.hm-myy.cn/169287337951120230824183619.png" mode=""></image>
							</view>
							<view class="">
								<input type="number" v-model="toGetMineralNum" class="numberinput" @blur="sureNumber"/>
							</view>
							<view class="opt-btn" @tap="addMineral()">
								<image src="https://mallwj.hm-myy.cn/169287336154120230824183601.png" mode=""></image>
							</view>
						</view>
					</view>
					<view class="infobox-btn uni-flex uni-row" style="justify-content: space-between;">
						<view class="btn-left" @tap="closePopup">
							取消
						</view>
						<view class="btn-right" @tap="postGetMineral" v-if='title=="采集"'>
							确认
						</view>
						<view class="btn-right" @tap="submitChangeMineral" v-else>
							确认
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 采集满提示 -->
		<u-popup v-model="isShowTsOne" mode="center" border-radius="18">
			<view class="infobox">
				<view class="infobox-title">
					 提示
				</view>
				<view class="infobox-contact">
					<view class ='ts-title'>
					     <text>已采集</text><text style="color:#FFDA44">10</text><text>个矿石</text>
					</view>
					<view  class ='ts-label'>
							今日采集已满，可飞往好友基地矿山采集
					</view>
					<view class="infobox-btn uni-flex uni-row" style="justify-content: space-between;">
						<view class="btn-left" @tap="isShowTsOne=false">
							返回基地
						</view>
						<view class="btn-right" @tap="goToFriendList">
							去好友基地
						</view>
						
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>
<script>
	import {mapGetters} from 'vuex';
	import topNave from '@/components/nav-header/index.vue';
	import $store from '@/store/index.js';
	export default {
		name: "Confirm",
		components: {
			topNave
		},
		props: {},
		data: function() {
			return {

				navigationBarHeight: 0,
				statusBarHeight: 0,

				// 会员信息
				uid: 0,
				mineralList: [],
				mineral: [{
					isShow: false,
					data: {}
				}, {
					isShow: false,
					data: {}
				}, {
					isShow: false,
					data: {}
				}, {
					isShow: false,
					data: {}
				}, {
					isShow: false,
					data: {}
				}, {
					isShow: false,
					data: {}
				}, {
					isShow: false,
					data: {}
				}],
				isShowTs: false,
				nowMineral: {},
				toGetMineralNum:1,
				downTime:'00:00:00',
				isMineral:0,
				title:'采集',
				isShowTsOne:false,
			};
		},
		computed: {
			...mapGetters(['friendListShow', 'friendList'])
		},
		onShow() {
			let _this = this;
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			if (uni.getStorageSync('userInfo').uid) {
				
				let personInfo = uni.getStorageSync("userInfo");
				_this.uid = personInfo.uid;
				_this.hasMineralsList();
				_this.getMineralsList();
				$store.dispatch('getFriendList');
				_this.getNumber();
				console.log(this.friendList)
			}else{
				uni.navigateTo({
					url:'/pages/user/login'
				})
			}

			

		},
		mounted: function() {

		},
		methods: {
			//去好友列表
			goToFriendList(){
				uni.navigateTo({
					url:`/pages/minerals/friendList`
				})
			},
			//兑换矿产
			changeMinerals(item){
				console.log('item',item)
				this.isShowTs = true;
				this.title = '兑换';
				this.nowMineral.data = item;
				this.toGetMineralNum=0;
			},
			//确定兑换,接口有问题
			submitChangeMineral(){
				if(this.toGetMineralNum==0){
					this.$f.toast('请选择兑换数量')
					return
				}
				this.$H.post(`mineral/member/changeMineral/${this.uid}?mineralId=${this.nowMineral.data.id}&num=${this.toGetMineralNum}`).then(res => {
				    if(res.code===0){ //兑换成功
						this.isShowTs = false;
						this.hasMineralsList()
						this.$f.toast('兑换成功！')
					}else{
						this.$f.toast(res.msg)
					}
					
					
				})
			},
			// 获取挖矿数量
			getNumber(){
				this.$H.get("mineral/member/mining/total/" + this.uid ,{
					type:'MINING'
				}).then(res => {
					this.isMineral = res.result;
				})
				
			},
			delMineral(){
				if(this.toGetMineralNum > 1){
					this.toGetMineralNum--
				}
			},
			addMineral(){
				if(this.toGetMineralNum < this.nowMineral.data.mineralNum){
					this.toGetMineralNum++
				}
			},
			sureNumber(){
				if(this.toGetMineralNum < 1 ){
					this.toGetMineralNum = 1
				}
				
				if(this.toGetMineralNum > this.nowMineral.data.mineralNum){
					this.toGetMineralNum = this.nowMineral.data.mineralNum
				}
			},
			pageToFriend(data) {
				uni.navigateTo({
					url:'/pages/minerals/friend?uid=' + data.friend_id + '&name=' + data.notation
				})
			},
			hasMineralsList() {
				let _this = this;
				this.$H.get("mineral/member/have/" + _this.uid).then(res => {
					_this.mineralList = res.result;
				})
			},
			getMineralsList() {
				let _this = this;
				this.$H.get("mineral/user/" + _this.uid).then(res => {
					_this.mineral = [{
						isShow: false,
						data: {}
					}, {
						isShow: false,
						data: {}
					}, {
						isShow: false,
						data: {}
					}, {
						isShow: false,
						data: {}
					}, {
						isShow: false,
						data: {}
					}, {
						isShow: false,
						data: {}
					}, {
						isShow: false,
						data: {}
					}];
					// 随机数
					let numArray = new Array();
					let timeArray = new Array();
					// let number = 0;
					res.result.forEach(v => {
						if (v.mineralNum > 0) {
							numArray.push(v)
						}
						timeArray.push(v.nextTime);
					})
					numArray.forEach(v => {
						let number = Math.ceil(Math.random() * 6);
				        console.log('number',number)
						_this.mineral[number].data = v;
						_this.mineral[number].isShow = true;
					})
					
					let maxTime = Math.max(...timeArray);
					console.log(maxTime)
					
					_this.temp = setInterval(() => {
						_this.downTime = _this.countDown(maxTime)
					}, 1000)
					
				})
			},
			// 倒计时
			countDown(endTime) {
				let _this = this;
				let times = (new Date()).getTime();
				let isTimer = '';
				
			
				if (times < endTime) {
					let timediff = Math.round((endTime - times) / 1000);
					
					let hour = parseInt(timediff / 3600 % 24);
					let minute = parseInt(timediff / 60 % 60);
					let second = timediff % 60;
			
					hour = hour < 10 ? '0' + hour : hour;
					minute = minute < 10 ? '0' + minute : minute;
					second = second < 10 ? '0' + second : second;
					isTimer = hour + ':' + minute + ':' + second
				}else{
					isTimer = '00:00:00';
				}
			
			
				return isTimer
			},
			//采集
			getMineral(data) {
				if(this.isMineral>9){
					this.isShowTsOne = true;
					return
				}else{
					this.isShowTs = true;
					this.title='采集';
					this.nowMineral = data;
					console.log('this.nowMineral',this.nowMineral)
					this.toGetMineralNum = data.data.mineralNum
				}
				
				
			},
			closePopup() {
				this.isShowTs = false;
			},
			//采集接口
			postGetMineral() {
				let _this = this;
				this.$H.get("mineral/mining/" + _this.nowMineral.data.mineralId, {
					uid: _this.uid,
					num: 1 //_this.toGetMineralNum
				}).then(res => {
					// 随机数
					// let numArray = new Array();
					// let number = 0;
					if (res.code == 0) {
						_this.hasMineralsList();
						_this.getMineralsList();
						_this.getNumber();
						_this.isShowTs = false;
						_this.mineral = [{
							isShow: false,
							data: {}
						}, {
							isShow: false,
							data: {}
						}, {
							isShow: false,
							data: {}
						}, {
							isShow: false,
							data: {}
						}, {
							isShow: false,
							data: {}
						}, {
							isShow: false,
							data: {}
						}, {
							isShow: false,
							data: {}
						}];
					}
				})
			}
		},
	};
</script>
<style lang="scss">
	page {
	  width: 100%;
	  overflow-x: hidden;
	}
</style>

<style scoped lang="scss">
.friend-flex{
	display: flex;
	justify-content: space-between;
	align-items: center;
	.friend-label{
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(255,255,255,0.8);
		margin-right: 20rpx;
	}
}	
.infobox{
	.flex-class{
		display: flex;
		align-items: center;
	}
	.ks-img{
		background: #000000;
		width:160rpx;
		height: 160rpx;
		border: 2rpx solid #0180FF;
		margin-right: 24rpx;
		margin-bottom: 20rpx;
	}
	.ts-title{
		text-align: center;
		margin-bottom: 20rpx;
		>text{
			font-size: 32rpx;
		}
	}
	.ts-label{
		font-size: 12px;
		font-weight: 400;
		text-align: center;
	}
}	
	
	.titles{
		font-size: 16px;
		font-weight: bold;
		color: $text-color-white;
		margin: 12px 12px;
	}
	// 提示框
	.infobox {
		width: 560rpx;
		background: $bg-color-black;
		box-shadow: 0px 0px 16px 0px $bg-color-light;
        color: $text-color-white;
		.infobox-title {
			padding: 26rpx;
			font-size: 16px;
			color: $text-color-white;
			text-align: center;
			border-bottom: 1px solid #000000;
		}
		.infobox-contact {
			padding: 36rpx;
		}

		.infobox-font {
			font-size: 14px;
			color: $text-color-white;
			padding: 8px 0;
			.opt-btn{
				width: 30px;
				height: 30px;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.numberinput{
				width: 80px;
				    color: white;
				    text-align: center;
				    padding: 3px 0;
				    margin: 0 10px;
				    background: #001338;
				    border: 1px solid $btn-base;
				    border-radius: 5px;
			}
		}

		.infobox-btn {
			margin-top: 20px;

			.btn-left {
				text-align: center;
				width: 120px;
				padding: 11px 0;
				font-size: 14px;
				font-weight: 500;
				color: $text-color-white;
				//border:1px solid $btn-base;
				background: #020014;
				border-radius: 20px;
			}

			.btn-right {
				text-align: center;
				width: 120px;
				padding: 11px 0;
				font-size: 14px;
				font-weight: 500;
				color: $text-color-white;
				background: linear-gradient(180deg, #8B54FF 0%, #6322EF 100%);
				border-radius: 20px;
			}
		}
	}


	.toptitle {
		margin: 0 12px;
		font-size: 16px;
		font-weight: bold;
		color: #FFFFFF;

		span {
			font-size: 12px;
			font-weight: 400;
			color: rgba(255, 255, 255, 0.8);
			margin-left: 8px;
		}
	}

	.mineralsview {
		white-space: nowrap;
		// width: 400rpx;
		width: 96%;
		margin: 16px 2%;
             
		.mineralsbox {
			display: inline-block;
			width: 90px;
			// height: 130px;
			text-align: center;
			background: #1B202D;
			padding-bottom: 6px;
			margin-right: 12px;
            
			.mineralsimage {
				background: #2A385C;
				margin: 4px 5px 0;
				position: relative;

				image {
					width: 70px;
					height: 70px;
					margin: 4px 4px 0;
					border: 1px solid #2246CA;
					background-color: #000;
				}

				span {
					position: absolute;
					right: 6px;
					top: 8px;
					font-size: 16px;
					font-weight: 800;
					color: #FFFFFF;
					line-height: 16px;
				}
			}

			.mineralsname {
				font-size: 16px;
				font-weight: bold;
				color: #FFFFFF;
				margin-top: 8px;
			}

			.mineralscode {
				font-size: 12px;
				font-weight: 400;
				color: #FFDA44;
				margin-top: 4px;
			}
		}
	}

	// 采矿
	.minerals {
		width: 100%;
		position: relative;

		image {
			width: 100%;
		}

		.mineralstop {
			position: absolute;
			width: 96%;
			top: 8px;
			left: 2%;

			.fontbox {
				padding: 6px;
				font-size: 12px;
				font-family: Source Han Sans CN-Medium, Source Han Sans CN;
				font-weight: 500;
				color: #FFFFFF;
				background: rgba(0, 0, 0, 0.6);
				border-radius: 4px 4px 4px 4px;
			}
		}

		.minerals-po {
			position: absolute;
			//width: 200rpx;
			image {
				width: 150rpx;
				height: 150rpx;
				margin: 0 9px;
			}

			.titlename {
				margin-top: -6px;
				font-size: 12px;
				font-weight: 400;
				color: #FFFFFF;
				background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 29%, rgba(0, 0, 0, 0.7) 78%, rgba(0, 0, 0, 0) 100%);
				border-radius: 0px 0px 0px 0px;
				text-align: center;
				padding: 2px 5px;
				line-height: 12px;
			}
		}
	}


	.peopleview {
		white-space: nowrap;
		// width: 400rpx;
		width: 96%;
		margin: 0px 2%;
		padding:10px 0 37px ;

		.peoplebox {
			display: inline-block;
			width: 64px;
			// height: 130px;
			text-align: center;
			padding-bottom: 6px;
			margin-right: 12px;

			.peopleimage {
				width: 48px;
				margin: 0 7px;
				overflow: hidden;
				border-radius: 24px;
				height: 48px;
				image {
					width: 48px;
					height: 48px;
				}

			}

			.peoplename {
				font-size: 12px;
				font-weight: 500;
				color: #FFFFFF;
				margin-top: 4px;
			}

		}
	}
</style>