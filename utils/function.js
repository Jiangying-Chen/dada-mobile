export default {

	// 公共跳转方法
	jump(url, type = 1) {
		// 保留当前页面，跳转到应用内的某个页面
		if (type == 1) {
			uni.navigateTo({
				url: url
			})
		}

		// 关闭当前页面，跳转到应用内的某个页面
		if (type == 2) {
			uni.redirectTo({
				url: url
			})
		}
		// 关闭所有页面，打开到应用内的某个页面
		if (type == 3) {
			uni.reLaunch({
				url: url
			})
		}

		// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
		if (type == 4) {
			uni.switchTab({
				url: url
			})
		}
	},
	tostring(value) {
		return JSON.stringify(value);
	},
	toast(title, icon = 'none') {
		uni.showToast({
			title: title,
			icon: icon,
			duration: 1500
		});
	},
	copy(res, isToast = true) {
		uni.setClipboardData({
			data: res,
			success: function() {
				if (isToast) {
					uni.showToast({
						title: "复制成功",
						duration: 2000,
						icon: "none",
					});
				}
			},
			fail() {
				console.log('copy fail')
			}
		});
		
	}
}
