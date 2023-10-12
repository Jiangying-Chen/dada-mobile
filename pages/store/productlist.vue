<template>
	<view class="bgbox">
		<top-nave :bar-height="statusBarHeight" :nav-height="navigationBarHeight" title="燃料兑换"
			:isback="true"></top-nave>
		<view class="pointview">
			{{loginUserInfo.integral}}
		</view>
		<view class="pointsgin">
			当前可用燃料
		</view>
		<view class="searchtype uni-flex uni-row">
			<view class="searchview" style="flex: 1 1 0%;" @tap="changeSearch('price')">
				价格
			</view>
			<view class="searchview" style="flex: 1 1 0%;" @tap="changeSearch('buy_count')">
				销量
			</view>
		</view>
		<view class="productlist uni-flex uni-row" style="flex-wrap: wrap;">
			<view class="productview" v-for="item in productList"  @tap="pageToDetail(item)">

				<image :src="item.thumbnail" mode=""></image>
				<view class="productname">
					{{item.goodsName}}
				</view>
				<view class="productisbuy">
					已兑换{{item.buyCount}}
				</view>
				<view class="uni-flex uni-row productbuy" style="justify-content: space-between;">
					<view class="productpoint" style="flex: 1 1 0%;">
						{{item.points}}<span>燃料</span>
					</view>
					<view class="productbuybtn">
						兑换
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import topNave from '@/components/nav-header/index.vue';
	export default {
		computed: {
			...mapGetters(['loginUserInfo'])
		},
		components: {
			topNave
		},
		data() {
			return {
				navigationBarHeight: 0,
				statusBarHeight: 0,
				productList: [],
				pages: 1,
				sort: 'price',
				order: 'asc',
				loadend: false
			};
		},

		onLoad(option) {
			let that = this;
			this.navigationBarHeight = getApp().globalData.statusBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight + getApp().globalData.navigationBarHeight;
			this.getProductList()
		},
		onShow() {

		},
		onReachBottom() {
			// this.page = this.page++
			this.getProductList()
		},
		methods: {
			pageToDetail(row){
				uni.navigateTo({
					url:'/pages/store/detail?id=' + row.id
				})
			},
			getProductList() {
				if (this.loadend) return
				let that = this;
				that.$H.get("pointGoods", {
					sort: that.sort,
					order: that.order,
					pageNumber: that.pages,
					pageSize: 10
				}).then(res => {
					res.result.records.forEach(v => {
						that.productList.push(v)
					})
					if (res.result.total == that.pages) {
						that.loadend = true;
					} else {
						that.pages++
					}
				})
			},
			changeSearch(type) {
				this.loadend = false;
				this.pages = 1;
				if (type == this.sort) {
					if (this.order == 'asc') {
						this.order = 'desc'
					} else {
						this.order = 'asc'
					}
				} else {
					this.sort = type;
					this.order = 'asc';
				}
				this.productList = [];
				this.getProductList()
			}


		}
	};
</script>

<style lang="scss" scoped>
	.bgbox {
		background-image: url('https://mallwj.hm-myy.cn/169232500106920230818101641.png');
		background-size: 100%;
		background-repeat: no-repeat;
	}

	.pointview {
		margin-top: 40px;
		text-align: center;
		font-size: 56px;
		font-weight: 800;
		color: $text-color-white;
		line-height: 56px;
		text-shadow: 0px 2px 14px rgba(0, 0, 0, 0.25);
	}

	.pointsgin {
		margin-top: 10px;
		text-align: center;
		font-size: 12px;
		font-weight: 400;
		color: $text-color-white;
		line-height: 12px;
		text-shadow: 0px 2px 14px rgba(0, 0, 0, 0.25);
	}

	.searchtype {
		margin: 20px 16px;
		background: $bg-color-black;
		border-radius: 22px 22px 22px 22px;
		padding: 10px 28px;

		.searchview {
			font-size: 12px;
			font-weight: 400;
			color: $text-color-white;
			text-align: center;
		}
	}

	.productlist {
		margin: 0 12px;

		.productview {
			margin: 0 5px 16px 5px;
			width: calc(50% - 10px);
			background: $bg-color-black;
			border-radius: 12px 12px 12px 12px;
			overflow: hidden;
			image{
				width: 100%;
				height: 166px;
			}
			.productname{
				margin: 8px 12px;
				font-size: 14px;
				font-weight: 500;
				color: $text-color-white;
				overflow:hidden;
				text-overflow:ellipsis;
				white-space:nowrap;
			}
			.productisbuy{
				margin: 0 12px;
				font-size: 10px;
				font-weight: 300;
				color: $text-color-white;
				line-height: 10px;
			}
			.productbuy{
				margin: 20px 12px;
				.productpoint{
					font-size: 16px;
					font-weight: 800;
					color: $text-color-white;
					line-height: 24px;
					span{
						font-size: 10px;
						font-weight: 400;
					}
				}
				.productbuybtn{
					line-height: 24px;
					text-align: center;
					width: 57px;
					background: $btn-base;
					border-radius: 13px 13px 13px 13px;
					font-size: 12px;
					font-weight: 500;
					color: $text-color-white;
				}
			}
		}
	}
</style>