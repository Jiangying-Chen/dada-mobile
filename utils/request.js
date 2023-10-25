import config from './config.js';
import store from '../store'
export default {
	request(options = {}) {
		return new Promise((resolve, reject) => {
			let url = options.url;
			if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) {
				options.url = config.domain + url;
			}
			options.header.token = uni.getStorageSync("token");
			//options.header.token = '';
			options.complete = (response) => {
				
				if (response.statusCode == 200 || response.statusCode == 0) {
					if (response.data.code == 401 || response.data.code == 420 || response.data.code == 403) {
							console.log('store.state.isJump',store.state.isJump)
							if(store.state.isJump==true){
								uni.setStorageSync("token", null);
								uni.navigateTo({
									url: "/pages/user/login"
								})
								store.commit('SET_ISJUMP',false)
							}
							reject()
						
					}
					if (response.data.code == 403) {
							uni.setStorageSync("token", null);
							if(store.state.isJump==true){
								uni.navigateTo({
									url: "/pages/user/login"
								});
								store.commit('SET_ISJUMP',false)
							}
							reject()
					}

					if (response.data.code == 500) {
						if( response.data.msg !='该圈子已被禁用'){
							uni.showToast({
								title: response.data.msg,
								icon: "none",
								duration: 2000
							});
						}
						
					}
					resolve(response.data)
				} else {
					uni.showToast({
						title: '请求异常',
						icon: "none"
					});
				}
			}

			uni.request(options)
		})
	},

	post(url, data = {}, header = {}) {

		let options = {
			url: url,
			data: data,
			header: header,
			method: "POST"
		}

		return this.request(options);
	},

	get(url, data = {}, header = {}) {
		let options = {
			url: url,
			data: data,
			header: header
		}

		return this.request(options);
	},
	
	delete(url, data = {}, header = {}) {
		let options = {
			url: url,
			data: data,
			header: header,
			method: "DELETE"
		}
		return this.request(options);
	}
};