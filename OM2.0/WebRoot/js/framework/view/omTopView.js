/**
 * 顶部view
 */
function OmTopView(){
	/** ********内部属性及方法******** start */
	var omSearchArray = new Array();//搜索列表,最大长度为5
	var omSearchArrayMaxLength = 5;//搜索列表的最大长度为5
	var omSearchItemHeight = 35;//搜索列表子项高度
	var selectSearchMenuItemId = "search_organization_item";//选择的搜索分类id，默认选择组织
	
	/**
	 * 绑定搜索框事件
	 */
	var bindSearchInputEvent = function(){		
		if(!($._data($("#search_input").get(0), "events") != undefined
				&& $._data($("#search_input").get(0), "events")["focus"] != undefined)){//搜索框获取焦点和失去焦点事件
			$("#search_input").bind("focus",function(){//获得焦点
				if(isHintInputEmpty($(this))){
					$(this).val("");
					$(this).removeClass("input_hint");
					$(this).addClass("input_normal");															
				}
				$(".search_input_bg").removeClass("search_input_bg_n");
				$(".search_input_bg").addClass("search_input_bg_f");
				showOmSearchArray();
			});
			$("#search_input").bind("blur",function(){//失去焦点
				var defaultValue = $(this).attr("defaultValue");
				if($.trim($(this).val()) == ""){
					$(this).val(defaultValue);
					$(this).removeClass("input_normal");
					$(this).addClass("input_hint");
				}
				$(".search_input_bg").removeClass("search_input_bg_f");
				$(".search_input_bg").addClass("search_input_bg_n");
			});
		}
		
		if(!($._data($("#search_input").get(0), "events") != undefined
				&& $._data($("#search_input").get(0), "events")["keydown"] != undefined)){//搜索框键盘按下事件
			$("#search_input").bind("keydown",function(e){	
				if(e.keyCode == 13){
					startSearch();
				}
			});
		}
	};
	
	/**
	 * 绑定搜索按钮事件
	 */
	var bindSearchButtonEvent = function(){
		if(!($._data($("#search_button").get(0), "events") != undefined
				&& $._data($("#search_button").get(0), "events")["click"] != undefined)){//点击事件
			$("#search_button").bind("click",function(){
				startSearch();
			});
		}
	};
	
	/**
	 * 开始搜索功能
	 * @returns
	 */
	var startSearch = function(){
		var name = $.trim($("#search_input").val());
		var showSearchName = name_limit(name,14);//显示的搜索内容
		if(isHintInputEmpty($("#search_input"))){
			$.messager.alert("操作提示", "搜索内容不能为空！","info");
			return;
		}
		else if($.trim($("#search_input").val()) == ""){
			$.messager.alert("操作提示", "搜索内容不能为空！","info");
			return;
		}
		
		switch (selectSearchMenuItemId) {
			case "search_organization_item"://搜索组织用户
				$("#organization_result_span_tip").hide();
				$(".organization_result_span").hide();
				$("#organization_search_name_div").show();
				$("#organization_search_name").text(showSearchName);
				if(name != showSearchName){
					$("#organization_search_name").attr("title",name);
				}
				else{
					$("#organization_search_name").removeAttr("title");
				}
				organizationView.omSearchOrganization(name);
				break;
			case "search_role_item"://搜索角色
				$("#role_result_span_tip").hide();
				$(".role_result_span").hide();
				$("#role_search_name_div").show();
				$("#role_search_name").text(showSearchName);
				if(name != showSearchName){
					$("#role_search_name").attr("title",name);
				}
				else{
					$("#role_search_name").removeAttr("title");
				}
				roleView.omSearchRole(name);
				break;
			case "search_resource_item"://搜索资源
				$("#resource_result_span_tip").hide();
				$(".resource_result_span").hide();
				$("#resource_search_name_div").show();
				$("#resource_search_name").text(showSearchName);
				if(name != showSearchName){
					$("#resource_search_name").attr("title",name);
				}
				else{
					$("#resource_search_name").removeAttr("title");
				}
				resourceView.omSearchResource(name);
				break;
		}
		
		addToOmSearchArray(name);
	};
	
	/**
	 * 绑定选择搜索分类事件
	 */
	var bindSearchCategoryEvent = function(){
		if(!($._data($("#search_category").get(0), "events") != undefined
				&& $._data($("#search_category").get(0), "events")["click"] != undefined)){//选择搜索分类按钮事件
			$("#search_category").bind("click",function(){//点击事件，显示选择分类框
				if($("#search_category_menu").is(":visible")){
					$("#search_category_menu").fadeOut();
				}
				else{
					$("#search_category_menu").fadeIn();
					$("#search_category_menu").focus();
				}
			});
			
			$("#search_category").bind("mousedown",function(){//鼠标按下事件，防止显示选择分类框情况下点击此按钮会"闪现"
				return false;	
			});
		}
		
		
		if(!($._data($("#search_category_menu ul li").get(0), "events") != undefined
				&& $._data($("#search_category_menu ul li").get(0), "events")["click"] != undefined)){//搜索分类点击事件
			$("#search_category_menu ul li").bind("click",function(){
				var id = this.id;
				var name = "";
				if(id == selectSearchMenuItemId){
					$("#search_category_menu").fadeOut();
					return;
				}
				$("#" + selectSearchMenuItemId).removeClass("menu_li_f");

				switch (id) {
					case "search_organization_item":
						name = "组织";
						break;
					case "search_role_item":
						name = "角色";
						break;
					case "search_resource_item":
						name = "资源";
						break;
				}
				selectSearchMenuItemId = id;
				$("#" + selectSearchMenuItemId).addClass("menu_li_f");
				$("#search_category_span").text(name);
				$("#search_input").attr("defaultValue","按" + name + "搜索");
				if($("#search_input").hasClass("input_normal")){
					$("#search_input").removeClass("input_normal");
					$("#search_input").addClass("input_hint");
				}
				$("#search_input").val("按" + name + "搜索");
				$("#search_category_menu").fadeOut();
			});
		}
		
		if(!($._data($("#search_category_menu").get(0), "events") != undefined
				&& $._data($("#search_category_menu").get(0), "events")["blur"] != undefined)){//搜索分类失去焦点事件
			$("#search_category_menu").bind("blur",function(){
				var browser = navigator.userAgent;
				if(browser.indexOf('MSIE') != -1 ){//防止IE8下显示选择分类框情况下点击选择分类按钮会"闪现"
					if(document.activeElement.id != "search_category"){
						if($("#search_category_menu").is(":visible")){
							$("#search_category_menu").fadeOut();
						}
					}
				}
				else{
					if($("#search_category_menu").is(":visible")){
						$("#search_category_menu").fadeOut();
					}
				}				
			});
		}
		
	};
	
	/**
	 * 绑定搜索结果关闭事件
	 */
	var bindSearchCloseEvent = function(){
		if(!($._data($(".search_close").get(0), "events") != undefined
				&& $._data($(".search_close").get(0), "events")["click"] != undefined)){//搜索结果关闭点击事件
			$(".search_close").bind("click",function(){
				var id = this.id;
				switch (id) {
					case "organization_search_close"://组织用户
						$("#organization_result_span_tip").hide();
						$("#organization_search_name_div").hide();
						$(".organization_result_span").show();
						organizationView.unOmSearchOrganization();
						break;
					case "role_search_close"://角色
						$("#role_result_span_tip").hide();
						$("#role_search_name_div").hide();
						$(".role_result_span").show();
						roleView.unOmSearchRole();
						break;
					case "resource_search_close"://资源
						$("#resource_result_span_tip").hide();
						$("#resource_search_name_div").hide();
						$(".resource_result_span").show();
						resourceView.unOmSearchResource();
						break;
				}
			});
		}
	};
	
	/**
	 * 添加到搜索列表
	 * @param name 搜索名称
	 */
	var addToOmSearchArray = function(name){
		if(omSearchArray.length >= omSearchArrayMaxLength){//添加搜索结果到搜索列表
			omSearchArray.shift();
		}
		omSearchArray.push(name);
		
		addToCookie(omSearchArray);
	};
	
	/**
	 * 显示搜索列表
	 */
	var showOmSearchArray = function(){
		if(omSearchArray.length == 0){
			omSearchArray = getFromCookie();
		}
		
		if(omSearchArray.length > 0){//显示搜索列表
			$("#searchRecord").height(omSearchArray.length*omSearchItemHeight);
			$("#searchRecord").empty();
			var index = omSearchArray.length;
			while(index--){
				$("#searchRecord").append('<li>'+omSearchArray[index]+'</li>');
			}
			$("#searchRecord").show();
			
			$("#searchRecord li").die("click").live("click",function(){//绑定搜索列表点击事件
				$("#search_input").val($(this).text());
				$("#searchRecord").hide();
				
				if($("#search_input").hasClass("input_hint")){
					$("#search_input").removeClass("input_hint");
					$("#search_input").addClass("input_normal");
				}
			});
		}
	};
	
	/**
	 * 绑定保存按钮事件
	 */
	var binOmsaveEvent = function(){
		if(!($._data($("#omsave").get(0), "events") != undefined
				&& $._data($("#omsave").get(0), "events")["click"] != undefined)){//点击事件
			$("#omsave").bind("click",function(){
				if($(this).attr("disabled")){//设置确认按钮disabled属性，防止重复点击
					return;
				}
				else{
					$(this).attr("disabled",true);
				}
				
				var isRoleTipShow = true;//是否显示保存角色信息成功提示
				var isResourceTipShow = true;//是否显示保存资源信息成功提示
				var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");				
				var roleZTree = $.fn.zTree.getZTreeObj("roleZTree");				
				var selectOrganizationNode = organizationZTree.getSelectedNodes()[0];
				var selectRoleNode = roleZTree.getSelectedNodes()[0];//选中节点
				
				if(selectOrganizationNode){
					var changeCheckedRolesData = organizationView.getChangeCheckedRolesData(selectOrganizationNode);//组织用户改变角色信息
					if(changeCheckedRolesData && changeCheckedRolesData.length > 0){
						organizationView.saveOrganizationPermission(selectOrganizationNode,changeCheckedRolesData,true);
						isRoleTipShow == true;
						isResourceTipShow = false;
					}
					else{
						isRoleTipShow = false;
					}
				}
				else{
					isRoleTipShow = false;
				}
				
				if(selectRoleNode){
					var changeCheckedResourcesData =  roleView.getChangeCheckedResourceData(selectRoleNode);//角色改变的资源信息
					if(changeCheckedResourcesData && changeCheckedResourcesData.length > 0){
						roleView.saveRolePermission(selectRoleNode,changeCheckedResourcesData,isResourceTipShow);
					}
					else{
						isResourceTipShow = false;
					}
				}
				else{
					isResourceTipShow = false;
				}
				
				if(!isRoleTipShow && !isResourceTipShow){
					$(this).removeAttr("disabled",true);
					if(selectOrganizationNode || selectRoleNode){
						$.messager.alert("操作提示", "保存成功！","info");
					}
				}
				
			});
		}		
	};
	
	var bindDocumentEvent = function(){
		$(document).bind("click", function(event) {//隐藏搜索列表
			var e = event || window.event;
	        var target = e.srcElement || e.target;
			if($(target).attr("id") != "search_input"){
				$("#searchRecord").hide();
			}
		});
	};
	
	/**
	 * 添加搜索结果数组到cookie
	 * @param array 搜索结果数组
	 * @returns
	 */
	var addToCookie = function (array){
		var result = new Array();
		for ( var i = 0; i < array.length; i++) {
			var json = {"reslut":array[i]};
			result.push(json);
		}
		addOmSearchCookie(JSON2.stringify(result));
	};
	
	/**
	 * 从cookie中获取搜索结果数组
	 * @returns {Array}
	 */
	function getFromCookie(){
		var array = getOmSearchCookie();
		var result = new Array();;
		if(array == ""){
			result = new Array();
		}
		else{
			array = JSON2.parse(array);
			for ( var i = 0; i < array.length; i++) {
				result.push(array[i].reslut);
			}
		}
		return result;
	}
	/** ********内部属性及方法******** end */
	
	/** 对外提供的函数 */
	/**
	 * 初始化
	 */
	this.init = function(){
		$("#search_input").val("按组织搜索");
		bindSearchInputEvent();
		bindSearchButtonEvent();
		bindSearchCategoryEvent();
		bindSearchCloseEvent();
		binOmsaveEvent();
		bindDocumentEvent();
	};
	
	/**
	 * 移除保存按钮不能点击状态
	 */
	this.removeOmsaveDisable = function(){
		$("#omsave").removeAttr("disabled",true);
	};
}