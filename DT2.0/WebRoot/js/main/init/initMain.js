var groupAnimating = false;//展开，隐藏动画进行中标识  构件和解决方案公用
var workingView;

$(function(){
	if (isSessionOut == true && needSession == true) {
		return;
	}
	//防止Underscore的默认<%=和jsp冲突,修改为{{}}
	_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
	};
	document.title = sysName;
});
/**
 * 初始化主页面
 */
function initMain() {
	var operateTitleView = new OperateTitleView();
	workingView = new WorkingView({el: $("#working")});
}

/** 监听postMessage消息事件 */ 
if (typeof window.addEventListener != 'undefined') {
	window.addEventListener('message', onMessage, false);
} else if (typeof window.attachEvent != 'undefined') {
	window.attachEvent('onmessage', onMessage);
} 
/** 存放面板的ID */
var idMap = new HashMap();
/** 接收到消息后传递给其他的iframe */
function onMessage(e) {
	var data = JSON2.parse(e.data);//数据结构必须遵循{name:iframe的ID,data:传递的数据参数}
	var frameId = data.name;
	var datas = data.data;
	var keys = idMap.keys();
	var iframe;
	for (var i = 0, len = keys.length; i < len; i++) {
		iframe = document.getElementById(keys[i]);
		if (iframe && frameId != keys[i]) {//自身iframe不做消息传递
			iframe.contentWindow.postMessage(datas, '*');
		}
	}
};

/** 载入构件或者URL直接载入的时候拼接参数 */
function addCurrentId(url, currentLabelId, userId){
	//添加昊天权限系统参数
	var bpUserGUID = URLUtil.getQueryString("bpUserGUID");
	var bpPortalID = URLUtil.getQueryString("bpPortalID");
	var bpParam = "";
	
	if(bpUserGUID != null && bpUserGUID != "null" && bpPortalID != null && bpPortalID != "null"){
		bpParam = "&bpUserGUID=" + bpUserGUID + "&bpPortalID=" + bpPortalID;
	}
	
	if(url.indexOf("?") != -1){
		url += '&currentLabelId=' + currentLabelId + '&userId=' + userId + '&userAcct=' + userAcct + bpParam;
	}else{
		url += '?currentLabelId=' + currentLabelId + '&userId=' + userId + '&userAcct=' + userAcct + bpParam;
	}
	return url;
}
function addCurrentUserId(url, userId){
	var bpUserGUID = URLUtil.getQueryString("bpUserGUID");
	var bpPortalID = URLUtil.getQueryString("bpPortalID");
	var bpParam = "";
	if(bpUserGUID != null && bpUserGUID != "null" && bpPortalID != null && bpPortalID != "null"){
		bpParam = "&bpUserGUID=" + bpUserGUID + "&bpPortalID=" + bpPortalID;
	}
	
	if(url.indexOf("?") != -1){
		url += '&userId=' + userId + '&userAcct=' + userAcct + bpParam;
	}else{
		url += '?userId=' + userId + '&userAcct=' + userAcct + bpParam;
	}
	return url;
}