/**
 * 垃圾回收
 */
var GCUtil = {
	doGC : function() {
		var index = navigator.userAgent.indexOf("MSIE");
		if (index > 0) {// IE
			CollectGarbage();// 垃圾回收
		}
	}
};

var URLUtil = {
	/**
	 * 添加URL参数
	 * @param url
	 * @returns
	 */
	addCurrentUserAcct : function(url) {
		if(isFromOrm){
			var _userOrg = '&userOrg=' + userOrg;
		}else{
			var _userOrg = "";
		}
		var _outOmParam = "";
		if(isFromOutOm){
			var bpUserGUID = URLUtil.getQueryString("bpUserGUID");
			var bpPortalID = URLUtil.getQueryString("bpPortalID");
			if(bpUserGUID != null && bpUserGUID != "null" && bpPortalID != null && bpUserGUID != "null"){
				_outOmParam = "&bpUserGUID=" + bpUserGUID + "&bpPortalID=" + bpPortalID; 
			}
			
		}
		if (url.indexOf("?") != -1) {
			url += '&userAcct=' + userAcct + _userOrg + "&colorStyle=" + headerCssName.split(/[_.]/)[1] + "&userXzqhdm=" + userXzqhdm + _outOmParam;
		} else {
			url += '?userAcct=' + userAcct + _userOrg + "&colorStyle=" + headerCssName.split(/[_.]/)[1] + "&userXzqhdm=" + userXzqhdm + _outOmParam;
		}
		return url;
	},
	getQueryString:function(name) {//从Url中获取参数
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
};

var WindowUtil = {
	/**
	 * 弹出单个窗口
	 * @param opt  窗口参数JSON对象
	 */
	openSingleWindow : function(data) {//CDT弹窗
		dataSource = data;
		var opt = dataSource.data;
		var title = null;
		var titles = null;
		if(opt.tab == true){
			if(opt.popTabsTitle) {
				title = opt.popTabsTitle;
			}
			else {
				title = opt.title;
			}
			if(opt.tabTitle) {
				titles = opt.tabTitle;
			}
			else {
				titles = opt.title;
			}
			var urls = opt.url;
			var width = opt.width;
			var height = opt.height;
			var _tabs_content = "";
			var winMarginLR = 15;//window中的内容的左右间距和
			var winMarginTB = 60;//window中的内容的上下间距和
			for ( var i = 0; i < urls.length; i++) {
				_tabs_content += '<div title="' + titles[i] + '" ><iframe id="tabs_iframe' + i 
					+'" style="width:' + (width-winMarginLR) +'px;height:' + (height-winMarginTB) +'px;" frameborder="0"'
					+ '></iframe></div>';
			}
			_win = $('<div style="overflow:hidden;"><div id="pop_tabs" class="easyui-tabs">' + _tabs_content + '</div></div>');
		}
		else{
			title = opt.title;
			_win = $('<div style="overflow:hidden;"><iframe id="cdt_popup_single_window" style="width:100%;height:100%;" frameborder="0"></iframe></div>');
		}
		
		$("body").append(_win);
		_win.dialog({
		    width:opt.width,
		    height:opt.height,
		    title:title,
		    shadow: true,
		    modal: true,
		    resizable: true,
		    onClose: function(){
				$(this).dialog("destroy");//销毁弹窗
				$(".all_background").hide();
			},
			onOpen: function(){
				$(".all_background").show();
				//矫正显示位置，当打开位置为负时，置为0px
				var dialog = $(this).dialog("dialog");
				var pos = dialog.position();
				if(pos.left<0){
					dialog.css("left","0px");
				}
				if(pos.top<40){//40为top的高度
					dialog.css("top","40px");
				}
				if(opt.tab){
					$('#pop_tabs').tabs({//加载tab
						width:opt.width,
						height:opt.width,
					    border:false,
					    onSelect:function(chosenTitle){//选择选项卡时，加载其中iframe的url，防止一起加载会导致页面加载不完全
					    	var index = 0;
					    	for ( var i = 0; i < titles.length; i++) {
								if(chosenTitle == titles[i]){
									index = i;
									break;
								}
							}
					    	if(!$("#tabs_iframe" + index).attr("src")){
					    		$("#tabs_iframe" + index).attr("src",urls[index]).load(function(){
					    		});
					    	}
					    }
					}); 
				}
				else {
					$("#cdt_popup_single_window").attr("src",opt.url);
				}
			},
			onMove: function(left,top){
				//放置拖出左上边界
				var dialog = $(this).dialog("dialog");
				if(left<0){
					dialog.css("left","0px");
				}
				if(top<40){//40为top的高度
					dialog.css("top","40px");
				}
			}
		});
	},
	closeSingleWindow : function(promptMsg) {//CDT弹窗的关闭
		var opt = {
				"datagrid_reload" : true, //表格编辑后刷新的标识
				"promptMsg" : promptMsg
		};
		//"source"用于判断自身的标识
		var data = {"source":dataSource.source, data:opt};
		//将消息传递给自身用来刷新
		messageCenter.callMessage('POST_RETURN_MESSAGE', data);
		_win.dialog("destroy");//销毁弹窗
		$(".all_background").hide();
		dataSource = null;//弹窗关闭后，释放资源
	}
};
