/** 全局变量的定义 */
var thumbnailView;

/** VIEW的定义 */

$(function(){
	init();
});


/**
 * 初始化
 */
function init(){
	homeView = new HomeView();
	homeView.initHomeView();
}

/**
 * //获得登录前url中的参数
 */
var getBeforeLoginRequest = function() {
	   var url = window.location.href; //获取url
	   var index=url.indexOf('#');//获取#的位置
	   if(index != -1){
		   var str = url.substr(index+1);
		   return str;
	   }
	   return null;
};

/** 弹出提示框 */
var showTipMessage = function(msg) {
	$.messager.show({
		title:'信息提示',
		msg:msg,
		timeout:5000,
		showType:'slide',
		width: document.body.clientWidth,
		width:300,
		height:100,
		right:0
	});
};
