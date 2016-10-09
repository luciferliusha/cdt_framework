/**
 * 登录页面的主JS
 */
var page_code = 0;//页码标记，从零开始
var page_total = 1;//计算所需页面数量
var selectedId = "";//选中的解决方案ID，null默认为第1个，以后支持localStorage则默认为退出前的ID

var result;

$(function(){
	_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
	};

	var platForm;//platForm的collection
	var topView = new TopView();
	var pageButtonView = new PageButtonView();
	var pageView = new PageView();
});