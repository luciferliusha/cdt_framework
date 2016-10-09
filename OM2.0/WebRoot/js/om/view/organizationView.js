/**
* 组织和用户的视图
*/
$(function() {
	OrganizationView = Backbone.View.extend({
		el: $("#organization_operate"),
		initialize: function() {
			var organizationTemplate = _.template($("#organization_template").html());			
			$(this.el).html(organizationTemplate);			
			organizations = new Organizations(null, { view : this });
			this.initOrganizationGroup();			
		},
		events: {
		},
		initOrganizationGroup: function(){//初始化即增加第一层组织用户树
			//顶层数据
			var rootJson = [{"id":ORGANIZATION_ROOT_ID,"text":"组织","iconCls":"icon-organization-double","state":"closed","attributes":{"type":0}}];
			$('#organization_groups_ul').tree({
				data: rootJson,
				animate: true,//有展开动画
				onClick:function(node){
	
				},
				onSelect: function(node){
					//若上一项数据不为空, 则存储上一项选择的数据到组织或用户hashmap
					if(selectedOrganizationNode != null){
						saveOrganizationFromRole(selectedOrganizationNode.attributes.type, selectedOrganizationNode, organizationRoleData, userRoleData, selectedRoleNode, roleResourceData);
						//保存之后, 清空所有hashmap
						cleanHashmap();
					}
	
					if(selectedOrganizationNode){//改变上一次选中项的样式	
						if(node.id == selectedOrganizationNode.id && 
								node.attributes.type == selectedOrganizationNode.attributes.type){//判断是否选中同一组织或用户
							if(node.attributes.type == 1){//用户时还得判断父组织id
								if(node.attributes.parentId == selectedOrganizationNode.attributes.parentId){
									return;
								}
							}
							else{
								return;
							}
						}
						
						$(selectedOrganizationNode.target).children(".tree-title").removeClass("om-tree-organization-title-s");
						
						if(selectedOrganizationNode.attributes.type == 0){//选中的是组织
							if($(this).tree("isLeaf",selectedOrganizationNode.target)){//叶子节点
								$(selectedOrganizationNode.target).children(".tree-icon").removeClass("icon-organization-single-s");
								$(selectedOrganizationNode.target).children(".tree-icon").addClass("icon-organization-single");
							}
							else{//非叶子节点
								$(selectedOrganizationNode.target).children(".tree-icon").removeClass("icon-organization-double-s");
								$(selectedOrganizationNode.target).children(".tree-icon").addClass("icon-organization-double");
							}
							if(selectedOrganizationNode.id != ORGANIZATION_ROOT_ID){
								rolesUncheck(organizationRoleData, selectedOrganizationNode);
							}									
						}
						else if(selectedOrganizationNode.attributes.type == 1){//选中的是用户
							$(selectedOrganizationNode.target).children(".tree-icon").removeClass("icon-user-s");
							$(selectedOrganizationNode.target).children(".tree-icon").addClass("icon-user");
							rolesUncheck(userRoleData, selectedOrganizationNode);
						}
					}else{//第一次选中时, 清理之前的选中项
						var nodes = $("#role_groups_ul").tree("getChecked");
						for(var i=0; i<nodes.length; i++){
							$("#role_groups_ul").tree("uncheck", nodes[i].target);
						}
					}
					
					selectedOrganizationNode = node;
										
					$(node.target).children(".tree-title").addClass("om-tree-organization-title-s");//改变选中行的字体颜色
					//改变图标
					var url = "";
					if(node.attributes.type == 0){//选中的是组织
						if($(this).tree("isLeaf",node.target)){//叶子节点
							$(node.target).children(".tree-icon").removeClass("icon-organization-single");
							$(node.target).children(".tree-icon").addClass("icon-organization-single-s");
						}
						else{//非叶子节点
							$(node.target).children(".tree-icon").removeClass("icon-organization-double");
							$(node.target).children(".tree-icon").addClass("icon-organization-double-s");
						}
						if(node.id != ORGANIZATION_ROOT_ID){
							
							if(organizationRoleData.get(selectedOrganizationNode.id) != null){//判断hashmap中是否有缓存
								
								readCheckFromMap($("#role_groups_ul"), organizationRoleData.get(selectedOrganizationNode.id));
							}else{
								url = contextPath + "/ts/omGetOrganizationRole?data={id:" + node.id +"}";
								rolesCheck(url, organizationRoleData, node);
							}
						}								
					}
					else if(node.attributes.type == 1){//选中的是用户
						$(node.target).children(".tree-icon").removeClass("icon-user");
						$(node.target).children(".tree-icon").addClass("icon-user-s");
						
						if(userRoleData.get(selectedOrganizationNode.id) != null){//判断hashmap中是否有缓存
							
							readCheckFromMap($("#role_groups_ul"), userRoleData.get(selectedOrganizationNode.id));
						}else{
							url = contextPath + "/ts/omGetUserRole?data={id:" + node.id +"}";
							rolesCheck(url, userRoleData, node);
						}
						
						var parentNode = $(this).tree("getParent",node.target);
						node.attributes.parentId = parentNode.id;
					}
					
					//取消角色的选择状态
					function rolesUncheck(map,node){								
						if(map.get(node.id) != null 
								&& map.get(node.id).length != 0){
							var data = map.get(node.id);
							for(var i=0; i<data.length; i++){
								$("#role_groups_ul").tree("uncheck",$("#role_groups_ul").tree("find",data[i].id).target);
							}
						}
					}
					//选择角色
					function rolesCheck(url,map,node){
						if(map.get(node.id) == null){
							var paraMap = new HashMap();
							paraMap.put("id", node.id);
							paraMap.put("map", map);
							
							operateServerData(url,organizations,checkRoles,paraMap);
						}
						else{
							var data = map.get(node.id);
							for(var i=0; i<data.length; i++){
								$("#role_groups_ul").tree("check",$("#role_groups_ul").tree("find",data[i].id).target);
							}
						}
					}
					
					function checkRoles(response,paraMap){
						var data = response.data;
						var id = paraMap.get("id");
						var map = paraMap.get("map");
						for(var i=0; i<data.length; i++){
							$("#role_groups_ul").tree("check",$("#role_groups_ul").tree("find",data[i].id).target);
						}
						map.put(id, data);
						
						//存储组织或用户的权限到数据库
						if(node.attributes.type == 1){
							saveOldFromSelect(userRoleDataOld, selectedOrganizationNode, $('#role_groups_ul').tree('getChecked'));
						}else{
							saveOldFromSelect(organizationRoleDataOld, selectedOrganizationNode, $('#role_groups_ul').tree('getChecked'));
						}
					}
				},
				onBeforeExpand: function(node){//在节点打开之前触发,从接口获取json数据
					if(!node.attributes.clicked){//第一次点击组织时，从接口获得数据并在界面上显示
						var url = contextPath + "/ts/omGetOrganizationTree?type=0&data={'id':" + node.id + "}";
						$(this).tree("options").url = url;						
					}
					else{
						
					}
				},
				onBeforeLoad : function(node, param){
					if(node && !node.attributes.clicked){
						$("#loadingOrganization").show();
					}
				},
				onLoadSuccess : function(node, data){//数据加载成功后，在界面上增加显示布局
					if (data.data) {
						if(data.returnFlag == -1){//没有查询到数据时，
							
						}
						else{
							$(this).tree("append",{parent:node.target,data:data.data});
						}														
						node.attributes.clicked = true;
					}
					$("#loadingOrganization").hide();
				},
				onContextMenu: function(e,node){//鼠标右键弹出操作下拉框
					e.preventDefault();
					
					$(this).tree('select',node.target);
					
					//鼠标右键，展开子节点
					var parent = node.target;
					if($(node.target).parent().children().length == 1){//还未加载子节点时					
						$(this).tree("expand",parent);
					}
					else if($(node.target).parent().children().length == 2){//子节点已加载
						if($(parent).next().is(":hidden")){
							$(this).tree("expand",parent);
						}
					}
					var menuId = "";
					if(node.attributes.type == 0){//组织
						menuId = "organization_menu";
					}
					else if(node.attributes.type == 1){//用户
						menuId = "user_menu";
					}
					$('#' + menuId).menu('show',{
						left: e.pageX,
						top: e.pageY
					});

					initMenu(node,menuId);
				}
			});
			var rootNode = $("#organization_groups_ul").tree("getRoot");
			$("#organization_groups_ul").tree("expand",rootNode.target);
						
			//搜索组织用户树
			$('#search_organization_groups_ul').tree({
				data: rootJson,
				animate: true,//有展开动画
				//dnd: true//可以拖拽移动位置
				onBeforeLoad : function(node, param){
				},
				onLoadSuccess : function(node, data){//数据加载成功后，在界面上增加显示布局
					if (data.data) {
						if(data.returnFlag == -1){//没有查询到数据时，
							
						}
						else{
							if(data.data.length == 0){
								if($(".organization_result_span_tip").is(":hidden")){
									$(".organization_result_span_tip").show();
								}
								return;
							}
							if(!$(".organization_result_span_tip").is(":hidden")){
								$(".organization_result_span_tip").hide();
							}
							$(this).tree("append",{parent:node.target,data:data.data});							
							
						}
					}
					
				},
				onSelect: function(node){
					//若上一项数据不为空, 则存储上一项选择的数据到组织或用户hashmap
					if(selectedSearchOrganizationNode != null){
						saveOrganizationFromRole(selectedSearchOrganizationNode.attributes.type, selectedSearchOrganizationNode, organizationRoleData, userRoleData, selectedRoleNode, roleResourceData);
						//保存之后, 清空所有hashmap
						cleanHashmap();
					}
	
					if(selectedSearchOrganizationNode){//改变上一次选中项的样式	
						if(node.id == selectedSearchOrganizationNode.id && 
								node.attributes.type == selectedSearchOrganizationNode.attributes.type){//判断是否选中同一组织或用户
							if(node.attributes.type == 1){//用户时还得判断父组织id
								if(node.attributes.parentId == selectedSearchOrganizationNode.attributes.parentId){
									return;
								}
							}
							else{
								return;
							}
						}
						
						$(selectedSearchOrganizationNode.target).children(".tree-title").removeClass("om-tree-organization-title-s");
						
						if(selectedSearchOrganizationNode.attributes.type == 0){//选中的是组织
							if($(this).tree("isLeaf",selectedSearchOrganizationNode.target)){//叶子节点
								$(selectedSearchOrganizationNode.target).children(".tree-icon").removeClass("icon-organization-single-s");
								$(selectedSearchOrganizationNode.target).children(".tree-icon").addClass("icon-organization-single");
							}
							else{//非叶子节点
								$(selectedSearchOrganizationNode.target).children(".tree-icon").removeClass("icon-organization-double-s");
								$(selectedSearchOrganizationNode.target).children(".tree-icon").addClass("icon-organization-double");
							}
							if(selectedSearchOrganizationNode.id != ORGANIZATION_ROOT_ID){
								rolesUncheck(organizationRoleData, selectedSearchOrganizationNode);
							}
						}
						else if(selectedSearchOrganizationNode.attributes.type == 1){//选中的是用户
							$(selectedSearchOrganizationNode.target).children(".tree-icon").removeClass("icon-user-s");
							$(selectedSearchOrganizationNode.target).children(".tree-icon").addClass("icon-user");
							rolesUncheck(userRoleData, selectedSearchOrganizationNode);
						}
					}
					else{//第一次选中时, 清理之前的选中项
						var nodes = $("#role_groups_ul").tree("getChecked");
						for(var i=0; i<nodes.length; i++){
							$("#role_groups_ul").tree("uncheck", nodes[i].target);
						}
					}
					
					selectedSearchOrganizationNode = node;
										
					$(node.target).children(".tree-title").addClass("om-tree-organization-title-s");//改变选中行的字体颜色
					//改变图标
					var url = "";
					if(node.attributes.type == 0){//选中的是组织
						if($(this).tree("isLeaf",node.target)){//叶子节点
							$(node.target).children(".tree-icon").removeClass("icon-organization-single");
							$(node.target).children(".tree-icon").addClass("icon-organization-single-s");
						}
						else{//非叶子节点
							$(node.target).children(".tree-icon").removeClass("icon-organization-double");
							$(node.target).children(".tree-icon").addClass("icon-organization-double-s");
						}
						if(node.id != ORGANIZATION_ROOT_ID){
							
							if(organizationRoleData.get(selectedSearchOrganizationNode.id) != null){//判断hashmap中是否有缓存
								
								readCheckFromMap($("#role_groups_ul"), organizationRoleData.get(selectedSearchOrganizationNode.id));
							}else{
								url = contextPath + "/ts/omGetOrganizationRole?data={id:" + node.id +"}";
								rolesCheck(url, organizationRoleData, node);
							}
						}
					}
					else if(node.attributes.type == 1){//选中的是用户
						$(node.target).children(".tree-icon").removeClass("icon-user");
						$(node.target).children(".tree-icon").addClass("icon-user-s");
						
						if(userRoleData.get(selectedSearchOrganizationNode.id) != null){//判断hashmap中是否有缓存
							
							readCheckFromMap($("#role_groups_ul"), userRoleData.get(selectedSearchOrganizationNode.id));
						}else{
							url = contextPath + "/ts/omGetUserRole?data={id:" + node.id +"}";
							rolesCheck(url, userRoleData, node);
						}
						
						var parentNode = $(this).tree("getParent",node.target);
						node.attributes.parentId = parentNode.id;
					}
					
					//取消角色的选择状态
					function rolesUncheck(map,node){
						if(map.get(node.id) != null 
								&& map.get(node.id).length != 0){
							var data = map.get(node.id);
							for(var i=0; i<data.length; i++){
								$("#role_groups_ul").tree("uncheck",$("#role_groups_ul").tree("find",data[i].id).target);
							}
						}
					}
					//选择角色
					function rolesCheck(url,map,node){
						if(map.get(node.id) == null){
							var paraMap = new HashMap();
							paraMap.put("id", node.id);
							paraMap.put("map", map);
							
							operateServerData(url,organizations,checkRoles,paraMap);
						}
						else{
							var data = map.get(node.id);
							for(var i=0; i<data.length; i++){
								$("#role_groups_ul").tree("check",$("#role_groups_ul").tree("find",data[i].id).target);
							}
						}
					}
					
					function checkRoles(response,paraMap){
						var data = response.data;
						var id = paraMap.get("id");
						var map = paraMap.get("map");
						for(var i=0; i<data.length; i++){
							$("#role_groups_ul").tree("check",$("#role_groups_ul").tree("find",data[i].id).target);
						}
						map.put(id, data);
						
						//存储组织或用户的权限到数据库
						if(node.attributes.type == 1){
							saveOldFromSelect(userRoleDataOld, selectedSearchOrganizationNode, $('#role_groups_ul').tree('getChecked'));
						}else{
							saveOldFromSelect(organizationRoleDataOld, selectedSearchOrganizationNode, $('#role_groups_ul').tree('getChecked'));
						}
					}
				},
				onContextMenu: function(e,node){//鼠标右键弹出操作下拉框
					e.preventDefault();
					
					$(this).tree('select',node.target);
					
					//鼠标右键，展开子节点
					var parent = node.target;
					if($(node.target).parent().children().length == 1){//还未加载子节点时					
						$(this).tree("expand",parent);
					}
					else if($(node.target).parent().children().length == 2){//子节点已加载
						if($(parent).next().is(":hidden")){
							$(this).tree("expand",parent);
						}
					}
					var menuId = "";
					if(node.attributes.type == 0){//组织
						menuId = "search_organization_menu";
					}
					else if(node.attributes.type == 1){//用户
						menuId = "search_user_menu";
					}
					$('#' + menuId).menu('show',{
						left: e.pageX,
						top: e.pageY
					});

					initMenu(node,menuId);
				}
				
			});
		}
	});
});