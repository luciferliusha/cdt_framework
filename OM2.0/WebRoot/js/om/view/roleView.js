/**
 * 角色的视图
 */
$(function() {
	RoleView = Backbone.View.extend({
		el: $("#role_operate"),
		initialize: function() {
			var roleTemplate = _.template($("#role_template").html());			
			$(this.el).html(roleTemplate);			
			roles = new Roles(null, { view : this });

			this.initRoleGroup();
		},
		events: {
		},
		initRoleGroup: function(){//初始化即增加第一层角色树
			//顶层数据
			var rootJson = [{"id":ROLE_ROOT_ID,"text":"角色","iconCls":"icon-role-double","state":"closed","attributes":[]}];
			$('#role_groups_ul').tree({
				data: rootJson,
				animate: true,//有展开动画
//					dnd: true,//可以拖拽移动位置
				checkbox:true,//可以选择
//						cascadeCheck:false,
				onClick: function(node){
				},
				onSelect: function(node){
					//若上一项数据不为空, 则存储上一项选择的数据到角色hashmap
					if(selectedRoleNode != null){
						saveRoleFromResource(selectedRoleNode, roleResourceData, true);
					}
					
					if(selectedRoleNode){//改变上一次选中项的样式	
						if(node.id == selectedRoleNode.id){
							return;
						}
						$(selectedRoleNode.target).children(".tree-title").removeClass("om-tree-title-s");
						
						if($(this).tree("isLeaf",selectedRoleNode.target)){//叶子节点
							$(selectedRoleNode.target).children(".tree-icon").removeClass("icon-role-single-s");
							$(selectedRoleNode.target).children(".tree-icon").addClass("icon-role-single");
						}
						else{//非叶子节点
							$(selectedRoleNode.target).children(".tree-icon").removeClass("icon-role-double-s");
							$(selectedRoleNode.target).children(".tree-icon").addClass("icon-role-double");
						}
						//resourcesUncheck(roleResourceData, selectedRoleNode);
					}//else{
//						var nodes = $("#resource_groups_ul").tree("getChecked");
//						for(var i=0; i<nodes.length; i++){
//							$("#resource_groups_ul").tree("uncheck", nodes[i].target);
//						}
						$("#resource_groups_ul").tree("uncheck", $("#resource_groups_ul").tree("getRoot").target);
					//}
					
					$(node.target).children(".tree-title").addClass("om-tree-title-s");//改变选中行的字体颜色
					//改变图标
					if($(this).tree("isLeaf",node.target)){//叶子节点
						$(node.target).children(".tree-icon").removeClass("icon-role-single");
						$(node.target).children(".tree-icon").addClass("icon-role-single-s");
					}
					else{//非叶子节点
						$(node.target).children(".tree-icon").removeClass("icon-role-double");
						$(node.target).children(".tree-icon").addClass("icon-role-double-s");
					}
					selectedRoleNode = node;							
					
					if(/*roleResourceData*/roleResourceCheckData.get(selectedRoleNode.id) != null){//判断hashmap中是否有缓存
						
						readCheckFromMap($("#resource_groups_ul"), roleResourceCheckData.get(selectedRoleNode.id)/*roleResourceData.get(selectedRoleNode.id)*/);
					}else{
						var url = contextPath + "/ts/omGetRoleResource?data={id:" + node.id + "}";
						resourcesCheck(url, roleResourceData, node);
					}
					//为被选中角色的资源分配权限
					var url = contextPath + "/ts/omGetRoleResource?data={id:" + node.id + "}";
					resourcesPermissionCheck(url, roleResourceData, node);
												
					//取消资源的选择状态
					function resourcesUncheck(map,node){								
						if(map.get(node.id) != null 
								&& map.get(node.id).length != 0){
							var data = map.get(node.id);
							for(var i=0; i<data.length; i++){
								$("#resource_groups_ul").tree("uncheck",$("#resource_groups_ul").tree("find",data[i].id).target);
							}
						}
					}
											
					//选择资源
					function resourcesCheck(url,map,node){
						if(map.get(node.id) == null){
							var paraMap = new HashMap();
							paraMap.put("id", node.id);
							paraMap.put("map", map);
							
							operateServerData(url,organizations,checkRoles,paraMap);
						}
						else{
							var data = map.get(node.id);
							for(var i=0; i<data.length; i++){
								$("#resource_groups_ul").tree("check",$("#resource_groups_ul").tree("find",data[i].id).target);
							}
						}
					}

					function checkRoles(response,paraMap){
						var data = response.data;
						var map = paraMap.get("map");
						var id = paraMap.get("id");
						var dataCopy = data.slice(0);
						var dataNew = new Array();
						for(var i=0; i<dataCopy.length; i++){
							var hasChild = false;
							for(var j=0; j<dataCopy.length; j++){
								if(dataCopy[i].parentId == dataCopy[j].id){//是孩子节点则不存入
									hasChild = true;
									break;
								}
							}
							if (!hasChild) {
								dataNew.push(dataCopy[i]);
							}
						}

						for(var i=0; i<dataNew.length; i++){
							var target = $("#resource_groups_ul").tree("find",dataNew[i].id).target;
							$("#resource_groups_ul").tree("check",target);
						}
						map.put(id, dataNew);
						roleResourceCheckData.put(id, dataNew);
						resourcesPermissionDataOld = $('#resource_groups_ul').tree('getChecked');
						//缓存角色的权限到hashmap
						saveOldFromSelect(roleResourceDataOld, selectedRoleNode, $('#resource_groups_ul').tree('getChecked'));
					}
					
					//选择资源权限
					function resourcesPermissionCheck(url,map,node){
						operateServerData(url,organizations,selectResourcesPermission);
					}
					
					function selectResourcesPermission(response){
						var data = response.data;
						resourcesPermissionData = data.slice(0);
						
						for(var i=0; i<data.length; i++){
							var target = $("#resource_groups_ul").tree("find",data[i].id).target;
//							$("#resource_groups_ul").tree("check",target);
							
							var checkboxes = $(target).children(".operate-div").children(".opertate-tree-checkbox");
							var permission = parseInt(data[i].permission, 2);
							var temp = permission&0x08;//判断有'增'权限
							if(temp == 0x08){
								$(checkboxes[0]).removeClass("operate-tree-checkbox0");
								$(checkboxes[0]).addClass("operate-tree-checkbox1");
							}
							
							temp = permission&0x04;//判断有'删'权限
							if(temp == 0x04){
								$(checkboxes[1]).removeClass("operate-tree-checkbox0");
								$(checkboxes[1]).addClass("operate-tree-checkbox1");
							}
							
							temp = permission&0x02;//判断有'改'权限
							if(temp == 0x02){
								$(checkboxes[2]).removeClass("operate-tree-checkbox0");
								$(checkboxes[2]).addClass("operate-tree-checkbox1");
							}
							
							temp = permission&0x01;//判断有'查'权限
							if(temp == 0x01){
								$(checkboxes[3]).removeClass("operate-tree-checkbox0");
								$(checkboxes[3]).addClass("operate-tree-checkbox1");
							}
						}
					}
				} ,
				onBeforeExpand: function(node){//在节点打开之前触发,从接口获取json数据
					if(node.id == ROLE_ROOT_ID && !node.attributes.clicked){//第一次点击组织顶端时，从接口获得数据并在界面上显示
						var url = contextPath + "/ts/omGetRoleTree?type=1&data={id:" + node.id + "}";
						$(this).tree("options").url = url;
					}
				},
				onBeforeLoad : function(node, param){
					if(node && node.id == ROLE_ROOT_ID && !node.attributes.clicked){
						$("#loadingRole").show();	
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
					$("#loadingRole").hide();
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
					
					$('#role_menu').menu('show',{
						left: e.pageX,
						top: e.pageY
					});

					if(node.id == ROLE_ROOT_ID){//资源树根节点禁止删除和修改
						var renameItem = $('#role_menu').menu('findItem',"重命名");
						if(!renameItem.disabled){//修改功能被启用,禁用修改功能
							$('#role_menu').menu('disableItem',renameItem.target);
							$('#role_menu').menu('setIcon',{target:renameItem.target,iconCls:'icon-rename-d'});//更换图标
							$(renameItem.target).children(".menu-text").addClass("menu-text-disabled");//修改文字颜色
						}
						
						
						var deleteItem = $('#role_menu').menu('findItem',"删除");
						if(!deleteItem.disabled){//删除功能被启用,禁用删除功能
							$('#role_menu').menu('disableItem',deleteItem.target);
							$('#role_menu').menu('setIcon',{target:deleteItem.target,iconCls:'icon-trash-d'});//更换图标						
							$(deleteItem.target).children(".menu-text").addClass("menu-text-disabled");
						}												
					}
					else{
						var renameItem = $('#role_menu').menu('findItem',"重命名");
						if(renameItem.disabled){//修改功能被禁用,重新启用
							$('#role_menu').menu('enableItem',renameItem.target);
							$('#role_menu').menu('setIcon',{target:renameItem.target,iconCls:'icon-rename-n'});//更换图标
							$(renameItem.target).children(".menu-text").removeClass("menu-text-disabled");
						}
						
						var deleteItem = $('#role_menu').menu('findItem',"删除");
						if(deleteItem.disabled){//删除功能被禁用，重新启用
							$('#role_menu').menu('enableItem',deleteItem.target);
							$('#role_menu').menu('setIcon',{target:deleteItem.target,iconCls:'icon-trash-n'});//更换图标
							$(deleteItem.target).children(".menu-text").removeClass("menu-text-disabled");
						}
					}
				}
			});
			var rootNode = $("#role_groups_ul").tree("getRoot");
			$("#role_groups_ul").tree("expand",rootNode.target);
		}
	});
});