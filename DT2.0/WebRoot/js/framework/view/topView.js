/**
 * CDT顶部VIEW
 */

function TopView(){
	var initTemplate = function() {
		var _topHtml = $.render($("#top_logo_template").html(),{logoUrl:path + logoUrl,topWidth:topWidth,topHeight:topHeight,
				topMarginTop:topMarginTop,topMarginLeft:topMarginLeft,userName:userName});
		$("#top_div").append(_topHtml);
		initBtnEvent();
		if(!frontPage){
			$("#homeVisitDiv").hide();
			$(".index_content_div").width(0);
			$(".index_content_div").hide();
		}
	};

	/**
	 * 初始化顶部按钮事件
	 */
	var initBtnEvent = function() {
		$("#homeVisitDiv").die("click").live("click",function(){//首页按钮
			if($("#sysSettingDiv").hasClass("settingDiv_s")) {//要先退出系统管理模式
//				$.messager.alert("操作提示", "请先退出系统管理模式后再切换!","error");
//				return;
				$("#sysSettingDiv").removeClass("settingDiv_s");
				$("#sysSettingDiv").addClass("settingDiv_n");
				$("#sysSettingDiv").children("div").removeClass("setting-f");
				$("#sysSettingDiv").children("div").addClass("setting-n");
				//退出系统管理
				messageCenter.callMessage('OUTER_SYSTEMMANAGER_TO_HOME');
			}
			if($("#sysEditDiv").hasClass("settingDiv_s")) {//要先退出编辑模式
				$("#sysEditDiv").removeClass("settingDiv_s");
				$("#sysEditDiv").addClass("settingDiv_n");
				$("#sysEditDiv").children("div").removeClass("edit-f");
				$("#sysEditDiv").children("div").addClass("edit-n");
				//改变左侧导航栏状态
				messageCenter.callMessage('SHOW_MODE');
				messageCenter.callMessage('SORT_SOLUTION_DISABLE');
			}
/*			if(isIE){
				document.execCommand("Stop");
			}else{
				window.stop();
			}*/
			//当解决方案被重复点击时，不会重新加载该解决方案的工作区内容。
			solutionView.removeCheckd();
			
			$(".iframe_loading").hide();
			if($(".index_content_div").width() != 0){
				return;
			}
			if (!$(".index_content_div").is(":animated")) {
				$(".index_content").css("margin-left","0px");
				$(".index_content").empty();
				$("#page_number").empty();
				$("#pre_page").hide();
				$("#next_page").hide();
				solutionView.getSolutionService().getSolutionData(solutionView.getInitSolutionData);
				$(".index_content_div").animate({width:"100%"},{easing: 'easeInOutExpo', duration:1000, complete:function(){
						$("#pre_page").show();
						$("#next_page").show();
					}
				});
			}
		});
		$("#sysEditDiv").die("click").live("click",function(){//编辑按钮
			if($(".index_content_div").width() != 0 || $("#menu_operate_div").is(":animated")){
				return;
			}
			if($("#sysSettingDiv").hasClass("settingDiv_s")) {//要先退出系统管理模式
				$.messager.alert("操作提示", "请先退出系统管理模式后再切换!","error");
				return;
			}
			if($(this).hasClass("settingDiv_n")) {//不选中->选中
				$(this).removeClass("settingDiv_n");
				$(this).addClass("settingDiv_s");
				$(this).children("div").removeClass("edit-n");
				$(this).children("div").addClass("edit-f");
				//改变左侧导航栏状态
				messageCenter.callMessage('EDIT_MODE');
				messageCenter.callMessage('SORT_SOLUTION_ENABLE');
			}
			else {
				$(this).removeClass("settingDiv_s");
				$(this).addClass("settingDiv_n");
				$(this).children("div").removeClass("edit-f");
				$(this).children("div").addClass("edit-n");
				//改变左侧导航栏状态
				messageCenter.callMessage('SHOW_MODE');
				messageCenter.callMessage('SORT_SOLUTION_DISABLE');
			}
		});
		$("#sysSettingDiv").die("click").live("click",function(){//系统管理
			if ($(".index_content_div").is(":animated")) {//首页还在切换过程中
				return;
			}
			if (!$("#userInfo-menu").is("hidden")) {
				$("#userInfo-menu").fadeOut();
			}
			if($("#sysEditDiv").hasClass("settingDiv_s")) {//要先退出编辑模式
				$.messager.alert("操作提示", "请先退出编辑模式后再切换!","error");
				return;
			}
			if($(this).hasClass("settingDiv_n")) {//不选中->选中,//进入系统管理
				$(this).removeClass("settingDiv_n");
				$(this).addClass("settingDiv_s");
				$(this).children("div").removeClass("setting-n");
				$(this).children("div").addClass("setting-f");
				if ($(".index_content_div").width() != 0) {//存在首页情况下
					$("#pre_page").hide();
					$("#next_page").hide();
					menuModel(solutionView.narrowSolutionInit);//左侧菜单栏的展现方式
					$(".index_content_div").animate({width:"0px"},{easing: 'easeInOutExpo', duration:1000, complete:function(){//隐藏首页
							//进入系统管理
							messageCenter.callMessage('ENTER_SYSTEMMANAGER');
						}
					});
				}
				else {
					//进入系统管理
					messageCenter.callMessage('ENTER_SYSTEMMANAGER');
				}
			}
			else {//退出系统管理
				$(this).removeClass("settingDiv_s");
				$(this).addClass("settingDiv_n");
				$(this).children("div").removeClass("setting-f");
				$(this).children("div").addClass("setting-n");
				//退出系统管理
				messageCenter.callMessage('OUTER_SYSTEMMANAGER');
			}
		});
		$("#favoriteDiv").die("click").live("click",function(){//解决方案喜好设置按钮
			if (!$("#userInfo-menu").is("hidden")) {
				$("#userInfo-menu").fadeOut();
			}
			if($(this).hasClass("settingDiv_n")) {//不选中->选中
				$(this).removeClass("settingDiv_n");
				$(this).addClass("settingDiv_s");
				$(this).children("div").removeClass("favorite-n");
				$(this).children("div").addClass("favorite-f");
				//弹出解决方案喜好设置
				messageCenter.callMessage('POPUP_FAVORITE_SETTING');
			}
			else {
				$(this).removeClass("settingDiv_s");
				$(this).addClass("settingDiv_n");
				$(this).children("div").removeClass("favorite-f");
				$(this).children("div").addClass("favorite-n");
				//关闭解决方案喜好设置
				messageCenter.callMessage('CLOSE_FAVORITE_SETTING');
			}
		});
		
		$("#userInfoTopDiv").die("click").live("click",function(event){//用户信息
			event.stopPropagation();
			$("#userInfo-menu").slideToggle(function(){
				$("#userInfo-menu").css("overflow","inherit");
			});
		});
		
		if(!($._data($("#userInfoTopDiv").get(0), "events") != undefined
				&& $._data($("#userInfoTopDiv").get(0), "events")["hover"] != undefined)){//用户信息鼠标事件
			$("#userInfoTopDiv").hover(function(){
				$("#userNameDiv").css("color","#ffffff");
			},function(){
				$("#userNameDiv").css("color","#ffffff");
			});
		}
		
		$("#userInfoTopDiv li label").die("click").live("click",function(){//用户信息点击操作
			var id = $(this).attr("id");
			if(id == "save"){//保存
				var $oldSelectedDiv = $("#solution_div_sidebar").find(".active");
				if(isFromOrm){
					if(!ORMPermissionWorking('SAVE')){
						solutionView.saveSolutionWorkspace();
					}
				}
				else if(isFromOutOm){//外部接口权限
					if(!outOmPermissionWorking('CDT-05', 3)){
						solutionView.saveSolutionWorkspace();
					}
				}
				else{
					if(!cdtPermissionWorking('CDT-05', 3)){
						solutionView.saveSolutionWorkspace();
					}
				}
			}
			else if(id == "logout"){//注销
				if(isFromOrm){
					doLogout();
				}else{
					window.location.href= path + "/logout.do";
				}
			}
		});

		/**
		 * 切换左侧菜单的两种模式
		 */
		if(!($._data($("#control").get(0), "events") != undefined
				&& $._data($("#control").get(0), "events")["click"] != undefined)){
			$("#control").bind("click",function(){
				if($(".index_content_div").width() != 0){
					return;
				}
				if($("#sysEditDiv").hasClass("settingDiv_s")) {//要先退出编辑模式
					$.messager.alert("操作提示", "请先退出编辑模式后再切换!","error");
					return;
				}
				messageCenter.callMessage('CHANGE_MENU');
			});
		}
		
		$("#styleSetting").die("click").live("click",function(event){//设置top和menu的颜色
			event.stopPropagation();
			if($("#styleSettingDiv").hasClass("settingDiv_n")){//未选中==>选中
				$("#styleSettingDiv").removeClass("settingDiv_n");
				$("#styleSettingDiv").addClass("settingDiv_s");
				$(this).removeClass("brush-n");
				$(this).addClass("brush-f");
			}else{
				$("#styleSettingDiv").removeClass("settingDiv_s");
				$("#styleSettingDiv").addClass("settingDiv_n");
				$(this).removeClass("brush-f");
				$(this).addClass("brush-n");
			}
			$("#styleSetting-menu").slideToggle(function(){
				$("#styleSetting-menu").css("overflow","inherit");
			});
		});
		$("#styleSetting-menu ul.header-color-variation li a").die("click").live("click",function(){//改变header颜色
			var colorName = $(this).attr('data-headertheme');
			if(headerCssName == null)
				headerCssName = "header_"+style+".css";
			if(colorName == headerCssName)
				return;
			replaceCssFile(headerCssName, colorName);
			headerCssName = colorName;
			setCookie("cds-dt-header-css", headerCssName, 120, contextPath);
			if($("#sysSettingDiv").hasClass("settingDiv_s")) {//系统管理内部本身会有操作，从session中获取
				$("#working").find("iframe").attr("src",($("#working").find("iframe").attr("src")));
			}else{//刷新每个构件
				var $iframe;
				//选择存在的url方式或构件方式
				var $workSpace = $("#working .solution_workspace_url").length==0?$("#working .solution_workspace"):$("#working .solution_workspace_url");
				$workSpace.each(function(){
					$iframe = $(this).find("iframe");
					var _src = $iframe.attr("src");
					if(_src == null)
						return;
					var _index = _src.lastIndexOf("&colorStyle");
					var _srcNew = _src.substring(0, _index);
					var _subSrc = _src.substring(_index+"&colorStyle".length);
					var _subSrcIndex = _subSrc.indexOf("&");//拼回后面的URL
					var _subedSrc = "";
					if (_subSrcIndex != -1) {
						_subedSrc = _subSrc.substring(_subSrcIndex);
					}
					$iframe.attr("src",(_srcNew+"&colorStyle="+headerCssName.split(/[_.]/)[1] + _subedSrc));
					
				});
				/*var _src = $("#working").find("iframe").attr("src");
				if(_src == null)
					return;
				var _index = _src.lastIndexOf("&colorStyle");
				var _srcNew = _src.substring(0, _index);
				var _subSrc = _src.substring(_index+"&colorStyle".length);
				var _subSrcIndex = _subSrc.indexOf("&");//拼回后面的URL
				var _subedSrc = "";
				if (_subSrcIndex != -1) {
					_subedSrc = _subSrc.substring(_subSrcIndex);
				}
				$("#working").find("iframe").attr("src",(_srcNew+"&colorStyle="+headerCssName.split(/[_.]/)[1] + _subedSrc));*/
			}
		});
		$("#styleSetting-menu ul.sidebar-color-variation li a").die("click").live("click",function(){//改变sidebar颜色
			var colorName = $(this).attr('data-theme');
			if(menuCssName == null)
				menuCssName = "menu_default.css";
			if(colorName == menuCssName)
				return;
			replaceCssFile(menuCssName, colorName);
			menuCssName = colorName;
			setCookie("menu", menuCssName, 120, contextPath);
		});
		$(document).click(function(event) {
			$("#styleSettingDiv").removeClass("settingDiv_s");
			$("#styleSettingDiv").addClass("settingDiv_n");
			$("#styleSetting").removeClass("brush-f");
			$("#styleSetting").addClass("brush-n");
			$("#styleSetting-menu").fadeOut();
			$("#userInfo-menu").fadeOut();
		});//单击空白区域隐藏
	};

	this.init = function() {
		initTemplate();
	};
}