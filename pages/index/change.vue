<template>
	<view class="mainbg">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="星际航行" :isback="true"></top-nave>
		<view class="barbox">
			<view class="uni-flex uni-row toptitle"  style="justify-content: space-between;">
				<view class="">
					入驻星球：{{allNumber}}
				</view>
				<!-- <view class="">
					全部星球 >
				</view> -->
			</view>
			<view class="xqbox uni-flex uni-row">
				<view class="xqview" v-for="(item,index) in topList" v-if="index < 4">
					<image :src="item.bgImage" mode=""></image>
					<view class="xqname">
						{{item.topicName}}
					</view>
				</view>
			</view>
		</view>
		<view class="" style="height: 22px;"></view>
		<view class="xqlist" v-for="item in allList">
			<view class="xq " v-for="(items , index) in item" :class="['xq' + index]" @tap="changeTop(items)">
				<image :src="items.bgImage" mode=""></image>
				<view class="xqtitle">
					{{items.topicName}}
				</view>
			</view>
			
		</view>
		<view class="" style="height: 142px;"></view>
		<view  class="uni-flex uni-row bottomxq"  style="justify-content: space-between;">
			<view class="" style="position: relative;">
				<image :src="bgImage" mode="" class="mxxq"></image>
				<view class="myxq" style="width: 70%;">
					<view class="" style="font-weight: 300;">
						我的母星
					</view>
					<view class="">
						{{topicName}}
					</view>
				</view>
			</view>
			<view class="">
				<image src="https://mallwj.hm-myy.cn/168990968999420230721112129.png" mode="" class="btntop" @tap="toBackTop()"></image>
			</view>
		</view>
	</view>
</template>
<script>
	import topNave from '@/components/nav-header/index.vue';
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
				pages:1,
				loadend:false,
				topList:[],
				allList:[],
				allNumber:0,
				uid:0,
				topicName:'',
				bgImage:''
			};
		},

		onLoad(options) {
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			this.geTop()
			this.uid = uni.getStorageSync('userInfo').uid;
			this.$H.get('topic/getParent/' + this.uid).then(res => {
				this.toppicDetail(res.result.topicId)
				
			});
		},
		mounted: function() {
			
		},
		onReachBottom() {
			// this.page = this.page++
			this.geTop()
		},
		methods: {
			changeTop(row){
				uni.setStorageSync('topicId', row.id);
				uni.navigateBack({})
			},
			toppicDetail(id) {
				this.$H.get('topic/detail', {
					id: id
				}).then(res => {
					this.topicName = res.result.topicName;
					this.bgImage = res.result.bgImage
				});
			},
			toBackTop(){
				uni.pageScrollTo({
					scrollTop:0,
					duration:2000
				})
			},
			geTop(){
				if (this.loadend) return
				let _this = this;
				this.$H.get('topic/classTopicAreImg',{
					 classId:'1',
					 page:_this.pages,
					 limit:10
				}).then(res => {
					_this.allNumber = res.result.last_page;
					res.result.data.forEach(v=>{
						_this.topList.push(v)
					});
					let len = _this.topList.length; //数组长度
					let n = 5;//按照多少分组
					let Num = len % n === 0 ? len / n : Math.floor((len / n) + 1); //分成多少分
					let array = [];
					for(let i = 0 ; i < Num ;i++){
						let newArray = _this.topList.slice(i*n,i*n+n);
						array.push(newArray)
					}
					
					// console.log(array);
					_this.allList = array
					
					
					if(res.result.total == _this.pages){
						_this.loadend = true;
					}else{
						_this.pages++
					}
				});
			}
		},
	};
</script>

<style scoped lang="scss">
	.mainbg{
		background:url("https://mallwj.hm-myy.cn/168990802567620230721105345.png")  repeat-y ;
		background-size: 100%;
		height: 100%;
	}
	.barbox{
		margin: 12px;
		background: rgba(0,0,0,0.5);
		border-radius: 12px 12px 12px 12px;
		padding: 10px 14px;
		.toptitle{
			font-size: 12px;
			font-weight: 400;
			color: $text-color-light;
		}
		.xqbox{
			margin-top: 14px;
			.xqview{
				width: 18%;
				margin: 0 1%;
				text-align: center;
				image{
					margin: 0 auto;
					width: 40px;
					height: 40px;
				}
				.xqname{
					font-size: 12px;
					font-weight: 400;
					color: #FFFFFF;
				}
			}
		}
	}
	
	.xqlist{
		position: relative;
		margin: 0 12px;
		padding-bottom: 25px;
		height:440px;
		.xq{
			image{
				width:120px;
				height: 120px;
			}
			.xqtitle{
				background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0) 100%);
				text-align: center;
				color: white;
				font-size: 14px;
				margin-top: -35px;
			}
		}
		.xq0{
			position:absolute;
			right:20px;
			top:0;
		}
		.xq1{
			position:absolute;
			left:18px;
			top:25px;
		}
		.xq2{
			position:absolute;
			right:81px;
			top:169px;
		}
		.xq3{
			position:absolute;
			top:258px;
			left:13px;
		}
		.xq4{
			position:absolute;
			top:329px;
			right:10px;
		}
	}
	
	.bottomxq{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height:142px;
		.mxxq{
			width: 294px;
			height: 294px;
			margin-left: -78px;
			// position: absolute;
		}
		.myxq{
			background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 29%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0) 100%);
			font-size: 14px;
			font-family: Source Han Sans CN-Medium, Source Han Sans CN;
			font-weight: 500;
			color: #FFFFFF;
			padding: 6px 12px;
			position: absolute;
			top: 63px;
			text-align: center;
			left: 12px;
		}
		.btntop{
			width: 40px;
			height: 40px;
			margin-top: 68px;
			margin-right: 27px;
		}
	}
</style>
