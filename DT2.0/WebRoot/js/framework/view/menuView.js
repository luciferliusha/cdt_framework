/**
 * CDT左侧导航栏VIEW
 */

function MenuView(){
	var clientHeight;

	/**
	 * 初始化导航栏高度
	 * @param menu_operate_height 解决方案/构件库切换按钮的高度
	 * @returns
	 */
	var initMenuSize = function(menu_operate_height) {
		clientHeight = $(window).height() - 40;
		$("#menu_div").height(clientHeight);
		$("#menu_ul_parent").height(clientHeight - menu_operate_height);
	};
	
	/**
	 * 绑定左侧导航栏中顶部的一些点击事件
	 */
	var bindMenu0perateClick = function(){
		if(!($._data($("#solutions").get(0), "events") != undefined
				&& $._data($("#solutions").get(0), "events")["click"] != undefined)){//点击解决方案
			$("#solutions").bind("click",function(){
				if($("#menu_operate").attr("class") == "menu_operate_right"){
					$("#menu_operate").removeClass($("operate_title").attr("class"));
					$("#menu_operate").addClass("menu_operate_left");
					$("#menu_operate_div").addClass("menu_operate_div_border");
					if(isFromOrm){//外部JS方式
						if(!ORMPermissionWorking('SOLUTIONADD')){//是否有权限进行自动保存
							$("#solutions_add").fadeIn();
						}
						if(!ORMPermissionWorking('SOLUTIONQUERY')){//是否有权限进行自动保存
							$("#solution_div_sidebar").show();
						}
					}
					if(isFromOutOm){//外部接口权限
						if(!outOmPermissionWorking("CDT-02", 0)){//解决方案的增加权限
							$("#solutions_add").fadeIn();
						}
						if(!outOmPermissionWorking("CDT-02", 3)){//解决方案的查看权限
							$("#solution_div_sidebar").show();
						}
					}
					else {
						if(!cdtPermissionWorking("CDT-02", 0)){//解决方案的增加权限
							$("#solutions_add").fadeIn();
						}
						if(!cdtPermissionWorking("CDT-02", 3)){//解决方案的查看权限
							$("#solution_div_sidebar").show();
						}
					}
					$("#component_div_sidebar").hide();
				}
				$("#menu_ul_parent").mCustomScrollbar("update");
			});
		};
		if(!($._data($("#components").get(0), "events") != undefined
				&& $._data($("#components").get(0), "events")["click"] != undefined)){//点击构件
			$("#components").bind("click",function(){
				if($("#menu_operate").attr("class") == "menu_operate_left"){
					$("#menu_operate").removeClass($("operate_title").attr("class"));
					$("#menu_operate_div").removeClass("menu_operate_div_border");
					$("#menu_operate").addClass("menu_operate_right");
					$("#component_div_sidebar").show();
					$("#solution_div_sidebar").hide();
					$("#solutions_add").fadeOut();
					
					componentView.init();
				}
				$("#menu_ul_parent").mCustomScrollbar("update");
			});			
		};
		if(!($._data($("#solutions_add").get(0), "events") != undefined
				&& $._data($("#solutions_add").get(0), "events")["click"] != undefined)){//点击新增解决方案
			$("#solutions_add").bind("click",function(){
				solutionWindowView.initNewSolutionChooseWindow();
			});			
		};
	};
	
	this.init = function() {
		initMenuSize(0);
		colorTheme(function(){//读取cookies的颜色设置
			$("body").show();
		});//初始化替换上次浏览时保留的背景
		componentView = new ComponentView();
		solutionView = new SolutionView();
		solutionView.init();
		
		bindMenu0perateClick();
	};

	/**
	 * 编辑模式
	 */
	this.chageToEditMode = function() {
		//只要有解决方案的增改权限,显示解决方案和构件切换div
		if(isFromOrm){//外部JS方式
			if(!ORMPermissionWorking("SOLUTIONADD", 0) || !ORMPermissionWorking("SOLUTIONADD", 2)){
				//隐藏解决方案/构件
				$("#menu_operate_div").show();
				$("#menu_operate_div").animate({height: "55px"},{easing:'easeInExpo', duration:600, complete: function(){
					solutionView.setSolutionMode(1);
					initMenuSize(55);
					$("#menu_ul_parent").mCustomScrollbar("update");
				}});
			}
		}
		if(isFromOutOm){//外部接口权限
			if(!outOmPermissionWorking("CDT-02", 0) || !outOmPermissionWorking("CDT-02", 2)){
				//隐藏解决方案/构件
				$("#menu_operate_div").show();
				$("#menu_operate_div").animate({height: "55px"},{easing:'easeInExpo', duration:600, complete: function(){
					solutionView.setSolutionMode(1);
					initMenuSize(55);
					$("#menu_ul_parent").mCustomScrollbar("update");
				}});
			}
		}
		else if(!cdtPermissionWorking("CDT-02", 0) || !cdtPermissionWorking("CDT-02", 2)){
			//隐藏解决方案/构件
			$("#menu_operate_div").show();
			$("#menu_operate_div").animate({height: "55px"},{easing:'easeInExpo', duration:600, complete: function(){
				solutionView.setSolutionMode(1);
				initMenuSize(55);
				$("#menu_ul_parent").mCustomScrollbar("update");
			}});
		}
		else{
			solutionView.setSolutionMode(1);
			initMenuSize(55);
			$("#menu_ul_parent").mCustomScrollbar("update");
		}
	};

	/**
	 * 展现模式
	 */
	this.chageToShowMode = function() {
		//隐藏解决方案/构件
		if($("#menu_operate").attr("class") == "menu_operate_right"){//当前展现的是构件库
			$("#solutions").click();
		}
		$("#menu_operate_div").animate({height: "0px"},{easing:'easeInExpo', duration:600, complete: function(){
			$("#menu_operate_div").hide();
			solutionView.setSolutionMode(0);
			initMenuSize(0);
			$("#menu_ul_parent").mCustomScrollbar("update");
		}});
	};

	/**
	 * 窗口resize，左侧导航栏resize
	 */
	this.resize = function() {
		if ($("#menu_operate_div").is(":hidden")) {//展现模式
			initMenuSize(0);
		}
		else {//编辑模式
			initMenuSize(55);
		}
		solutionView.resize();
	};
	
	this.getComponentData = function(){
		return componentView.getAppData();
	};
}