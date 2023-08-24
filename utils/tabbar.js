export default {
	list: [{
			"pagePath": "/pages/index/index",
			"iconPath": "/static/tabbar/home-1.png",
			"selectedIconPath": "/static/tabbar/home.png",
			"text": "星球访问"
		},
		{
			"pagePath": "/pages/square/index",
			"iconPath": "/static/tabbar/msg-1.png",
			"selectedIconPath": "/static/tabbar/msg.png",
			"text": "黑洞助手"
		},
		{
			iconPath: '/static/tabbar/add.png',
			selectedIconPath: '/static/tabbar/add.png',
			midButton: true,
			isCustom: true,
			"pagePath":"/pages/post/add?type=1"
		},
		{
			"pagePath": "/pages/store/index",
			"iconPath": "/static/tabbar/quanzi-1.png",
			"selectedIconPath": "/static/tabbar/quanzi.png",
			"text": "星尘商店"
		},
		{
			"pagePath": "/pages/my/jidi",
			"iconPath": "/static/tabbar/my-1.png",
			"selectedIconPath": "/static/tabbar/my.png",
			"text": "基地"
		}
	],
	popup: [{
			icon: '/static/h_2.png',
			text: '动态',
			url: '/pages/post/add?type=1'
		},
		{
			icon: '/static/h_3.png',
			text: '视频',
			url: '/pages/post/add?type=2'
		}
		,
		{
			icon: '/static/h_1.png',
			text: '投票',
			url: '/pages/vote/vote'
		},
		{
			icon: '/static/article.png',
			text: '长文',
			url: '/subpages/content/article/add'
		}
	]
}
