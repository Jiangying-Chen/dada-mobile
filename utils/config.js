const miniappName = "噗叽校园生活"; //站点标题用于分享时的标题
const shareH5Url = "https://h5.linfeng.tech/#/"; //H5分享路径

//本地环境配置
// const baseUrl = "localhost:8080"; //你本地测试的接口地址
// const domain = 'http://' + baseUrl + "/app/"; //接口服务地址
// const websocketUrl = 'ws://'+baseUrl+'/app/socket/';//IM通信地址
// const imfile = 'http://' + baseUrl + "/"; //IM文件资源地址
// const emojiUrl = 'https://img.xxx.com/big/';//私聊表情包资源地址


//线上环境配置
 const baseUrl = "bbs.hm-map.cn";
 const domain = 'https://' + baseUrl + "/app/"; 
 const websocketUrl = 'wss://'+baseUrl+'/socket/'
//const baseUrl = "192.168.0.90:8885";
//const domain = 'http://' + baseUrl + "/app/"; 
//const websocketUrl = 'ws://'+baseUrl+'/socket/';
const imfile = 'https://' + baseUrl + "/"; 
const emojiUrl = "https://img.xxx.com/big/";

export default {
	baseUrl: baseUrl,
	domain: domain,
	miniappName: miniappName,
	shareH5Url: shareH5Url,
	websocketUrl: websocketUrl,
	imfile:imfile,
	emojiUrl:emojiUrl
}
