<template>
  <view class="ul box-nav">
    <view class="li" v-for="(item,index) in content" :key="index" :style="{'flex':'0 0 '+ getItemValue() + '%'}"  @click="jump(item.url,item.type)">
        <view class="imgBox">
          <image class="img" :src="item.img"></image>
        </view>
        <h4 class="h4">{{item.title}}</h4>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'nav-pane',
    props: {
      content: {
        type: Array
      }
    },
    methods: {
      // 计算生成格子百分比
      getItemValue (val) {
        const len = parseInt(this.content.length)
        if (len === 0) {
          return 0
        } else {
          return (1 / len * 10000 / 100.00)
        }
      },
	  jump(url,type){
		  console.log(111,url,type)
		  if(type==1){
			  // #ifdef MP-WEIXIN
			  uni.navigateTo({
			  	url: '/pages/webview/webview?src=' + url
			  });
			  // #endif
			  // #ifdef H5
			  window.open(url)
			  // #endif
			  // #ifdef APP-PLUS
			  plus.runtime.openURL(url)
			  // #endif
		  }else{
			  if(url=='/pages/index/index'||url=='/pages/square/square'||url=='/pages/message/message'||url=='/pages/my/my'){
				  uni.switchTab({
				  	url:url
				  })
			  }else{
				  uni.navigateTo({
				  	url:url
				  })
			  }
		  }
		  
		  
	  }
    }
  }
</script>

<style lang="scss" scoped>
  .box-nav{
	background-color: #ffffff;
    min-height: 100upx;
    width: 710upx;
    margin: 0 auto;
    display: flex;
    padding: 20upx 0;
    .li{
	  width: 0;
      text-align: center;
      .imgBox{
        .img{
          width: 100upx;
          height: 100upx;
        }
      }
      .h4{
        font-size: 26upx;
        color: #333;
        line-height: 33upx;
		font-weight: normal;
      }
    }
  }
</style>
