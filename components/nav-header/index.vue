<template>
  <view class="top-nav-bg" :style="{height:barHeight +'px'}">
    <image src="../../static/topbg.png"  style="width: 100%;height: 100%;"></image>
	<view class="top-title" :style="{top:navHeight + 5 +'px'}">
		{{title}}
	</view>
	<image src="../../static/new/left.png" :style="{top:navHeight + 10 +'px'}" class="backbtn" mode="" @tap="backTo()" v-if="isback == true"></image>
	
  </view>
</template>

<script>
  export default {
    name: 'top-nave',
    props: {
    	navHeight:{
			type: Number,
			default: 0,
		},
    	barHeight: {
    		type: Number,
    		default: 0,
    	},
		title:{
			type:String,
			default:'哒哒校园'
		},
		isback:{
			type:Boolean,
			default:false
		}
    },
    methods: {
		backTo(){
			// console.log(1)
			// 返回上一页
			uni.navigateBack()
		}
	}
  }
</script>

<style lang="scss" scoped>
  page{
  	background:#041839;
  }
  .top-nav-bg{
	  position: relative;
  }
  .backbtn{
	  width: 20px;
	  height: 20px;
	  position: absolute;
	  // top: 44px;
	  left: 16px;
	  
  }
  .top-title{
	  position: absolute;
	  // top: 44px;
	  text-align: center;
	  width: 100%;
	  font-size: 17px;
	  font-weight: 500;
	  color: #FFFFFF;
  }
</style>
