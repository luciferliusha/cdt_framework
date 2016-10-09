/**
 * OM的topView
 */
$(function() {
	OmTopView = Backbone.View.extend({
		el: $("#omTopView"),
		initialize: function() {
			var omTopViewTemplate = _.template($("#omTopView_template").html());			
			$(this.el).html(omTopViewTemplate);			
//			roles = new Roles(null, { view : this });
		},
		events: {
			"focus #search_input": "placeholderFocus",
			"blur #search_input": "placeholderBlur",
			"mouseover #search_button": "searchButtonOver",
			"mouseout #search_button": "searchButtonOut",
			"mousedown #search_button": "searchButtonDown",
			"mouseup #search_button": "searchButtonUp",
			"mouseover #search_category": "searchCategoryOver",
			"mouseout #search_category": "searchCategoryOut",
			"mousedown #search_category": "searchCategoryDown",
			"mouseup #search_category": "searchCategoryUp",
			"mouseover #search_category_menu ul li": "menuliOver",
			"mouseout #search_category_menu ul li": "menuliOut",
			"click #search_category_menu ul li": "menuliClick",
			"mouseover #omsave": "omsaveOver",
			"mouseout #omsave": "omsaveOut",
			"mousedown #omsave": "omsaveDown",
			"mouseup #omsave": "omsaveUp",
			"mouseover .search_close":"searchCloseOver",
			"mouseout .search_close":"searchCloseOut",
			"click .search_close":"searchCloseClick"
		},
		
		/** ie实现placeholder属性,input默认灰色文字提醒 */
		placeholderFocus: function(){
			var defaultValue = $("#search_input").attr("defaultValue");	
			if($.trim($("#search_input").val()) == defaultValue 
					&& ($("#search_input").css("color") == "#9a9a9a" 
						|| $("#search_input").css("color")=="rgb(154, 154, 154)")){
				$("#search_input").val("");
				$("#search_input").css("color","#000");
			}
				$("#search_input_bg").removeClass("search_input_bg_n");
				$("#search_input_bg").addClass("search_input_bg_f");
				
				if(omSearchMenu.length > 0){
					$("#searchRecord").height(omSearchMenu.length*35);
					$("#searchRecord").empty();
					var i = omSearchMenu.length;
					while(i--){
						$("#searchRecord").append('<li onclick="searchRecordItem(' + omSearchMenu[i] +')">'+omSearchMenu[i]+'</li>');
					}
					$("#searchRecord").show();
				}
		},
		placeholderBlur: function(){
			var defaultValue = $("#search_input").attr("defaultValue");
			if($.trim($("#search_input").val()) == ""){
				$("#search_input").val(defaultValue);
				$("#search_input").css("color","#9a9a9a");
			}
				$("#search_input_bg").removeClass("search_input_bg_f");
				$("#search_input_bg").addClass("search_input_bg_n");
		},
		
		/** 搜索按钮的点击事件 */
		searchButtonOver: function(){
			$("#search_button").removeClass("search_button_n");
			$("#search_button").removeClass("search_button_p");
			$("#search_button").addClass("search_button_f");
		},
		searchButtonOut: function(){
			$("#search_button").removeClass("search_button_f");
			$("#search_button").removeClass("search_button_p");
			$("#search_button").addClass("search_button_n");
		},
		searchButtonDown: function(){
			$("#search_button").removeClass("search_button_n");
			$("#search_button").removeClass("search_button_f");
			$("#search_button").addClass("search_button_p");
			var defaultValue = $("#search_input").attr("defaultValue");	
			var name = $.trim($("#search_input").val());
			if(!name || (name == defaultValue && 
					($("#search_input").css("color") == "#9a9a9a" 
						|| $("#search_input").css("color")=="rgb(154, 154, 154)"))){
				alert("搜索内容不能为空");
				return;
			}
			
			if(selectSearchMenuItemId == "search_organization_item"){//搜索组织或用户
				if($("#organization_search_name_div").is(":hidden")){
					$("#organization_search_name_div").show();
					
					$("#organization_groups_ul").hide();
					$(".organization_result_span").hide();
					$("#search_organization_groups_ul").show();
				}
				$("#organization_search_name").children("span").text(name);
				limit("organization_search_name",10);
				
				var url =contextPath + '/ts/omSerachOrganization?data={"name":"'+ encodeURIComponent(name)+'"}';
				$("#search_organization_groups_ul").tree("options").url = url;
				$("#search_organization_groups_ul").tree("reload",$("#search_organization_groups_ul").tree("find",ORGANIZATION_ROOT_ID).target);
				
				//清空角色树的所有选择项
				var nodes = $("#role_groups_ul").tree("getChecked");
				for ( var i = 0; i < nodes.length; i++) {
					$("#role_groups_ul").tree("uncheck",nodes[i].target);
				}
			}
			else if(selectSearchMenuItemId == "search_role_item"){//搜索角色
				if($("#role_search_name_div").is(":hidden")){
					$("#role_search_name_div").show();
					$(".role_result_span").hide();
				}
				$("#role_search_name").children("span").text(name);
				limit("role_search_name",10);
				
				function rolesSearchResult(response){
					searchRolesData = response.data;
					if(searchRolesData.length == 0){
						if($(".role_result_span_tip").is(":hidden")){
							$(".role_result_span_tip").show();
						}
						return;
					}
					if(!$(".role_result_span_tip").is(":hidden")){
						$(".role_result_span_tip").hide();
					}					
					for(var i=0;i<searchRolesData.length;i++){
						var node = $("#role_groups_ul").tree("find",searchRolesData[i].id);
						
						$(node.target).children(".tree-title").addClass("om-tree-title-search");//改变搜索结果行的字体颜色
						$("#role_groups_ul").tree("expandTo",node.target);
					}
				}
				//搜索之前若已有搜索结果，即连续第二次搜索时，先清空上一次的记录
				if(searchRolesData){
					for ( var i = 0;i < searchRolesData.length; i++) {
						var node = $("#role_groups_ul").tree("find",searchRolesData[i].id);					
						$(node.target).children(".tree-title").removeClass("om-tree-title-search");//改变搜索结果行的字体颜色
					}
					
				}
				var url =contextPath + '/ts/omSerachRole?data={"name":"'+ encodeURIComponent(name)+'"}';
				operateServerData(url,roles,rolesSearchResult);								
			}
			else if(selectSearchMenuItemId == "search_resource_item"){//搜索资源
				if($("#resource_search_name_div").is(":hidden")){
					$("#resource_search_name_div").show();
					$(".resource_result_span").hide();
				}
				$("#resource_search_name").children("span").text(name);
				limit("resource_search_name",10);
				
				
				function resourcesSearchResult(response){
					searchResourcesData = response.data;
					if(searchResourcesData.length == 0){
						if($(".resource_result_span_tip").is(":hidden")){
							$(".resource_result_span_tip").show();
						}
						return;
					}
					if(!$(".resource_result_span_tip").is(":hidden")){
						$(".resource_result_span_tip").hide();
					}
					
					for(var i=0;i<searchResourcesData.length;i++){
						var node = $("#resource_groups_ul").tree("find",searchResourcesData[i].id);
						
						$(node.target).children(".tree-title").addClass("om-tree-title-search");//改变搜索结果行的字体颜色
						$("#resource_groups_ul").tree("expandTo",node.target);
					}
				}
				
				if(searchResourcesData){
					for ( var i = 0;i < searchResourcesData.length; i++) {
						var node = $("#resource_groups_ul").tree("find",searchResourcesData[i].id);					
						$(node.target).children(".tree-title").removeClass("om-tree-title-search");//改变搜索结果行的字体颜色
					}
				}		
				var url =contextPath + '/ts/omSearchResource?data={"name":"'+ encodeURIComponent(name)+'"}';
				operateServerData(url,resources,resourcesSearchResult);
			}
			
			//缓存搜索内容
			if(omSearchMenu.length == 5){
				omSearchMenu.shift();
			}
			omSearchMenu.push(name);
		},
		searchButtonUp: function(){
			$("#search_button").removeClass("search_button_f");
			$("#search_button").removeClass("search_button_p");
			$("#search_button").addClass("search_button_n");
		},
		
		/** 搜索分类的点击事件 */
		searchCategoryOver: function(){
			$("#search_category").removeClass("search_category_n");
			$("#search_category").removeClass("search_category_p");
			$("#search_category").addClass("search_category_f");
		},
		searchCategoryOut: function(){
			$("#search_category").removeClass("search_category_f");
			$("#search_category").removeClass("search_category_p");
			$("#search_category").addClass("search_category_n");
		},
		searchCategoryDown: function(){
			$("#search_category").removeClass("search_category_n");
			$("#search_category").removeClass("search_category_f");
			$("#search_category").addClass("search_category_p");
		},
		searchCategoryUp: function(){
			$("#search_category").removeClass("search_category_f");
			$("#search_category").removeClass("search_category_p");
			$("#search_category").addClass("search_category_n");
			if($("#search_category_menu").is(":hidden")){
				$("#search_category_menu").show();
			}
			else{
				$("#search_category_menu").hide();
			}
		},
		
		/** 搜索分类菜单点击事件 */
		menuliOver: function(event){
			var e = event || window.event;
            var target = e.srcElement || e.target;
            if(target.id == selectSearchMenuItemId){
            	return;
            }
			$(target).removeClass("menu_li_n");
			$(target).addClass("menu_li_f");
		},
		menuliOut: function(event){
			var e = event || window.event;
            var target = e.srcElement || e.target;
            if(target.id == selectSearchMenuItemId){
            	return;
            }
			$(target).removeClass("menu_li_f");
			$(target).addClass("menu_li_n");
		},
		menuliClick: function(event){
			var e = event || window.event;
            var target = e.srcElement || e.target;
            if(selectSearchMenuItemId == target.id){
            	return;
            }
            $("#" + selectSearchMenuItemId).removeClass("menu_li_f");
			$("#" + selectSearchMenuItemId).addClass("menu_li_n");
            var targetName;
            switch (parseInt($(target).attr("cid"))) {
			case 0:
				targetName = "组织";
				selectSearchMenuItemId = "search_organization_item";
				break;
			case 1:
				targetName = "角色";
				selectSearchMenuItemId = "search_role_item";
				break;
			case 2:
				targetName = "资源";
				selectSearchMenuItemId = "search_resource_item";
				break;

			default:
				targetName = "";
				break;
			}
            $("#" + selectSearchMenuItemId).removeClass("menu_li_n");
			$("#" + selectSearchMenuItemId).addClass("menu_li_f");
			$("#search_category span").text(targetName);
			$("#search_input").attr("defaultValue","按"+targetName+"搜索");
			$("#search_input").css("color","#9a9a9a");
			$("#search_input").val("按"+targetName+"搜索");
			$("#search_category_menu").hide();
		},
		
		/** 保存按钮的点击事件 */
		omsaveOver: function(){
			$("#omsave").removeClass("omsave_n");
			$("#omsave").addClass("omsave_f");
		},
		omsaveOut: function(){
			$("#omsave").removeClass("omsave_f");
			$("#omsave").removeClass("omsave_p");
			$("#omsave").addClass("omsave_n");
		},
		omsaveDown: function(){
			$("#omsave").removeClass("omsave_f");
			$("#omsave").addClass("omsave_p");
		},
		omsaveUp: function(){
			$("#omsave").removeClass("omsave_p");
			$("#omsave").addClass("omsave_f");
			
			doSave();
			function doSave(){
//				$("#omsave").removeClass("omsave_f");
//				$("#omsave").addClass("omsave_d");
//				$("#omsave span").removeClass("menu_span_n");
//				$("#omsave span").addClass("menu_span_d");
//				$("#omsave span").text("已保存");
				
				/** 若已保存,则无法执行以下效果 */
				if($("#omsave").attr("btnDisable") == "true"){
					
					if(selectedOrganizationNode != null){//存储组织或用户和角色的权限
						saveOrganizationFromRole(selectedOrganizationNode.attributes.type, selectedOrganizationNode, organizationRoleData, userRoleData,
								selectedRoleNode, roleResourceData);
					}else if(roleResourceData.keys() != null){//缓存角色权限到hashmap
						
						if(selectedRoleNode != null){
							saveRoleFromResource(selectedRoleNode, roleResourceData);
						}
					}else{
						
					}
					//存储角色的权限
					for(var i=0; i<roleResourceData.keys().length; i++){
						var resourceOldIds, resourceIds;
						if(roleResourceDataOld.get(roleResourceData.keys()[i]) == null){
							resourceOldIds = new Array();
						}else{
							resourceOldIds = roleResourceDataOld.get(roleResourceData.keys()[i]).slice(0);
						}
						if(roleResourceData.get(roleResourceData.keys()[i]) == null){
							resourceIds = new Array();
						}else{
							resourceIds = roleResourceData.get(roleResourceData.keys()[i]).slice(0);
						}
						transportRoleResource(resourceOldIds, resourceIds, $("#role_groups_ul").tree("find",roleResourceData.keys()[i]), 1);
					}
					
					//存储资源的权限
					AwardResource();
					
					//保存之后, 清空所有hashmap
					cleanHashmap();
				}else{
					
				}
//				$("#omsave").attr("btnDisable", "false");
			}
		},
		saveAvailable: function(){
			$("#omsave").removeClass("omsave_d");
			$("#omsave").addClass("omsave_n");
			$("#omsave span").removeClass("menu_span_d");
			$("#omsave span").addClass("menu_span_n");
			$("#omsave span").text("保存更改");
		},
		searchCloseOver: function(event){
			var e = event || window.event;
            var target = e.srcElement || e.target;
            $(target).removeClass("search_close_n");
            $(target).addClass("search_close_f");
		},
		searchCloseOut: function(event){
			var e = event || window.event;
            var target = e.srcElement || e.target;
            $(target).removeClass("search_close_f");
            $(target).addClass("search_close_n");
		},
		searchCloseClick: function(event){
			var e = event || window.event;
            var target = e.srcElement || e.target;
            $(target).parent().hide();
			$(target).parent().next().show();
			
			if(target.id == "organization_search_close"){
				if(!$(".organization_result_span_tip").is(":hidden")){
					$(".organization_result_span_tip").hide();
				}
				$("#organization_groups_ul").show();
				$("#search_organization_groups_ul").hide();
				if(selectedSearchOrganizationNode){
					//alert("如果搜索结果有选中项，保存选择的角色");
				}
				selectedSearchOrganizationNode = null;

				//清空角色树选择的角色节点
				var nodes = $("#role_groups_ul").tree("getChecked");
				if(nodes){
					for ( var i = 0; i < nodes.length; i++) {
						$("#role_groups_ul").tree("uncheck",nodes[i].target);
					}
				}
				if(searchOrganizationTreeHasChanged){//搜索组织用户树有改变时，重新刷新组织用户树
					var url = contextPath + "/ts/omGetOrganizationTree?type=0&data={'id':" + ORGANIZATION_ROOT_ID + "}";
					$("#organization_groups_ul").tree("options").url = url;
					$("#organization_groups_ul").tree("reload",$("#organization_groups_ul").tree("find",ORGANIZATION_ROOT_ID).target);
					
					searchOrganizationTreeHasChanged = false;
				}
				else{
					//从搜索结果返回时，若原先组织用户有选中项，则返回时需要选择角色
					if(selectedOrganizationNode){
						var data = new Array();
						if(selectedOrganizationNode.attributes.type == 0){
							data = organizationRoleData.get(selectedOrganizationNode.id);
						}
						else if(selectedOrganizationNode.attributes.type == 1){
							data = userRoleData.get(selectedOrganizationNode.id);
						}
						for(var i=0; i<data.length; i++){
							$("#role_groups_ul").tree("check",$("#role_groups_ul").tree("find",data[i].id).target);
					 }
					}
				}
			}
			else if(target.id == "role_search_close"){
				if(!$(".role_result_span_tip").is(":hidden")){
					$(".role_result_span_tip").hide();
				}				
				if(searchRolesData){
					for ( var i = 0;i < searchRolesData.length; i++) {
						var node = $("#role_groups_ul").tree("find",searchRolesData[i].id);					
						$(node.target).children(".tree-title").removeClass("om-tree-title-search");//改变搜索结果行的字体颜色
					}
					searchRolesData = null;
				}
			}
			else if(target.id == "resource_search_close"){
				if(!$(".resource_result_span_tip").is(":hidden")){
					$(".resource_result_span_tip").hide();
				}
				if(searchResourcesData){
					for ( var i = 0;i < searchResourcesData.length; i++) {
						var node = $("#resource_groups_ul").tree("find",searchResourcesData[i].id);					
						$(node.target).children(".tree-title").removeClass("om-tree-title-search");//改变搜索结果行的字体颜色
					}
					searchResourcesData = null;
				}
			}
		}
	});
	
	$(document).bind("click", function(event) {
		var e = event || window.event;
        var target = e.srcElement || e.target;
		if($(target).attr("id") != "search_category" && $(target).attr("id") != "search_category_span"){
			if($("#search_category_menu").css("display") == "block"){
				$("#search_category_menu").hide();
			}
		}
		if($(target).attr("id") != "search_input"){
			$("#searchRecord").hide();
		}
	});
});

function searchRecordItem(text){
	$("#search_input").val(text);
	$("#searchRecord").hide();
}
