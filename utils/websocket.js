import $store from '@/store/index.js';
import noticeUtil from '@/utils/noticeUtil.js';
import timeUtil from '@/utils/timeUtil.js';
import config from '@/utils/config.js';

export default {
	//连接websocket

	initConnect() {
		uni.closeSocket()
		uni.connectSocket({
			url: config.websocketUrl + $store.state.token,
			success: res => {},
			fail(res) {
				console.log(res)
			}
		})

		uni.onSocketOpen(() => {
			$store.state.isSocketOpen = true
			// uni.showToast({
			// 	icon: 'none',
			// 	title: '连接成功'
			// })
			console.log('websocket连接成功')
		})

		//监听socket关闭
		uni.onSocketClose(() => {
			$store.state.isSocketOpen = false
			console.log('WebSocket连接已关闭！');
		})
		//监听socket错误
		uni.onSocketError(() => {
			$store.state.isSocketOpen = false
			console.log('WebSocket连接打开失败');
			// if (!$store.state.isSocketOpen) {
			// 	setTimeout(function() {
					
			// 	}, 3000);
			// }
		})
		//监听socket消息
		uni.onSocketMessage((res) => {
			//socket信息是字符串，需要先转成json形式再去解析内容
			let data = JSON.parse(res.data)
			switch (data.type) {
				case 'person-message':
					let message = data.data
					//消息加入消息历史列表
					for (let i = 0; i < $store.state.personMessage.length; i++) {
						if ($store.state.personMessage[i].sessionId == message.sessionId) {
							$store.state.personMessage[i].list.push(message)
							break
						}
					}
					//更新消息记录
					$store.state.lastUpdateSession = {
						id: message.sessionId,
						count: $store.state.lastUpdateSession.count + 1
					}
					//如果消息不是本人发的则响铃
					if (message.senderId != $store.state.loginUserInfo.uid) {
						if ($store.state.systemConfig.bell) {
							noticeUtil.playMessageAudio();
						}
						//#ifdef APP
						if ($store.state.systemConfig.vibrate) {
							uni.vibrateShort()
						}
						//#endif
					}
					for (let i = 0; i < $store.state.sessionList.length; i++) {
						if ($store.state.sessionList[i].sessionId == message.sessionId) {
							$store.state.sessionList[i].updateTime = message.updateTime
							switch (message.messageType) {
								case 'image':
									$store.state.sessionList[i].lastMessage = '【图片】';
									break;
								case 'file':
									$store.state.sessionList[i].lastMessage = '【文件】';
									break;
								case 'video':
									$store.state.sessionList[i].lastMessage = '【视频】';
									break;
								default:
									$store.state.sessionList[i].lastMessage = message.content;
							}
							//没有在这个对话 未读++
							if ($store.state.chattingUserInfo == null || $store.state.chattingUserInfo
								.sessionId != $store.state.sessionList[i].sessionId) {
								if (message.senderId != $store.state.loginUserInfo.uid)
									$store.state.sessionList[i].unread++;
							} else { 
								//否则已读
								$store.dispatch('clearUnread', {
									myId: $store.state.loginUserInfo.uid,
									friendId: $store.state.chattingUserInfo.chattingUserId
								})
							}
							//需要把对话移到第一位
							let session = $store.state.sessionList.splice(i, 1);
							$store.state.sessionList = session.concat($store.state.sessionList)

							break;
						}
					}
					$store.dispatch('countUnreadMessage')
					break;
				case 'token-failed':
					uni.showToast({
						title: '身份验证已过期',
						icon: 'none'
					})
					uni.removeStorageSync("hasLogin");
					uni.removeStorageSync("token");
					uni.removeStorageSync("userInfo");
					setTimeout(() => {
						uni.redirectTo({
							url: 'pages/user/go-login'
						})
					}, 1000)
					break;
				case 'person-apply':
					uni.showToast({
						icon: 'none',
						title: '你收到了一个好友请求'
					})
					$store.dispatch('getNoticeList');
					if ($store.state.systemConfig.bell) {
						noticeUtil.playSystemAudio();
					}
					//#ifdef APP
					if ($store.state.systemConfig.vibrate) {
						uni.vibrateShort()
					}
					//#endif
					break;

				case 'count':
					$store.state.onlineArray = data.data
					//console.log(data)
					// uni.showToast({
					// 	title:'共'+data.data.length+'人在线',
					// 	icon:'none'
					// })
					break;
				case 'person-apply-agree':
					//刷新一遍好友列表
					$store.dispatch('getFriendList')
					let friend = data.data
					if (friend.myId == $store.state.loginUserInfo.uid) {
						$store.dispatch('getNoticeList')
						uni.showToast({
							title: '添加成功',
							icon: 'success'
						})
					}
					break;
				case 'notice-refresh':
					$store.dispatch('getNoticeList')
					uni.showToast({
						title: data.data,
						icon: 'none'
					})
					break;

				case 'person-withdraw':
					for (let i = 0; i < $store.state.personMessage.length; i++) {
						if ($store.state.personMessage[i].sessionId == data.data.sessionId) {
							for (let j = $store.state.personMessage[i].list.length - 1; j >= 0; j--) {
								if ($store.state.personMessage[i].list[j].id == data.data.messageId) {
									$store.state.personMessage[i].list[j].isWithdrawn = 1
									break
								}
							}
							break;
						}
					}
					break;
			}
		})
	}
}
