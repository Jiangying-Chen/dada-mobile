<template>
	<view>
		<view style="margin-top: -20rpx;">
			<view class="flex flex-row-between pad">
				<view class="margin10 fw600 text-xl">
					热门话题
				</view>
				<view class="margin10" style="font-size: 20rpx;">
					<text></text>
				</view>
			</view>
		</view>
		<view>
			<view class="plan-content margin text-justify">
				<view v-for="(item,index) in discussList" :key="index" @click="jump(item.id)"
					class="plan-content__item margin-right round text-sm text-bold"
					:class="[`bg-${item.color}--light color-${item.color}`]">
					<text class="plan-content__item--prefix">#</text> {{item.title}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "discuss-recommend",
		props: {
			discussList: {
				type: Array,
				default: [],
			}
		},
		data() {
			return {

			};
		},
		methods:{
			jump(id){
				uni.navigateTo({
					url:"/pages/discuss/detail?id="+id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex {
		display: -webkit-flex;
		display: flex;
	}

	.flex-row-between {
		justify-content: space-between;
	}

	.margin-left {
		margin-left: 30rpx;
	}

	.margin {
		margin: 30rpx;
	}
	.margin10 {
		margin: 10rpx;
	}
	.text-bold {
		font-weight: bold;
	}
	.pad{
		padding: 0 10rpx;
	}
	.text-xl {
		font-size: 30rpx;
	}
	.fw600{
		font-weight: 600;
	}
	.text-sm {
		font-size: 24rpx;
	}

	.text-justify {
		text-align: justify;
	}

	.plan-content {
		&__item {
			display: inline-block;
			line-height: 45rpx;
			padding: 10rpx 30rpx;
			margin: 20rpx 20rpx 5rpx 0rpx;

			&--prefix {
				padding-right: 10rpx;
			}
		}
	}

	.color-red {
		color: #E83A30 !important;

	}

	.bg-red--light {
		background-color: #FAD8D6 !important;
	}

	.bg-cyan--light {
		background-color: #D5FAF2 !important;
	}

	.color-cyan {
		color: #2DE8BD !important;
	}

	.bg-blue--light {
		background-color: #D8E5FF !important;
	}

	.color-blue {
		color: #3D7EFF !important;
	}

	.bg-green--light {
		background-color: #D6FADB !important;
	}

	.color-green {
		color: #31E749 !important;
	}

	.bg-orange--light {
		background-color: #FFEDD4 !important;
	}

	.color-orange {
		color: #FFA726 !important;
	}

	.bg-purplered--light {
		background-color: #FAD5E8 !important;
	}

	.color-purplered {
		color: #E72F8C !important;
	}

	.bg-purple--light {
		background-color: #E7D5FA !important;
	}

	.color-purple {
		color: #892FE8 !important;
	}

	.bg-brown--light {
		background-color: #E9DCD5 !important;
	}

	.color-brown {
		color: #914F2C !important;
	}

	.bg-grey--light {
		background-color: #E4E9EC !important;
	}

	.color-grey {
		color: #78909C !important;
	}

	.bg-yellowgreen--light {
		background-color: #EDFAD5 !important;
	}

	.color-yellowgreen {
		color: #A4E82F !important;
	}
</style>
