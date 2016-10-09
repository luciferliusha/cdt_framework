/**
 * 初始化全局变量和函数
 *@author songd
 *@date 2013-04-26
 */
var ORGANIZATION_ROOT_ID = -1;//组织用户树和搜索组织用户树根节点ID
var RESOURCE_ROOT_ID = 0;//资源树根节点ID
var ROLE_ROOT_ID = 0;//角色树根节点ID

$(function(){
	$(".easyui-menu .menu-item").height("31px");
	//操作列表鼠标滑过事件
	$(".easyui-menu .menu-item").bind("mouseover",function(){
		var classStrs = new Array();
		if($(this).children().length > 1){//详细信息没有图标，只有一个孩子
			classStrs = $(this).children(".menu-icon").attr("class").split(" ");
			if(classStrs[1] == "icon-add-n"){
				$(this).children(".menu-icon").removeClass("icon-add-n");
				$(this).children(".menu-icon").addClass("icon-add-f");
			}
			else if(classStrs[1] == "icon-rename-n"){
				$(this).children(".menu-icon").removeClass("icon-rename-n");
				$(this).children(".menu-icon").addClass("icon-rename-f");
			}
			else if(classStrs[1] == "icon-move-n"){
				$(this).children(".menu-icon").removeClass("icon-move-n");
				$(this).children(".menu-icon").addClass("icon-move-f");	
			}
			else if(classStrs[1] == "icon-relieve-n"){
				$(this).children(".menu-icon").removeClass("icon-relieve-n");
				$(this).children(".menu-icon").addClass("icon-relieve-f");	
			}
			else if(classStrs[1] == "icon-contain-n"){
				$(this).children(".menu-icon").removeClass("icon-contain-n");
				$(this).children(".menu-icon").addClass("icon-contain-f");	
			}
			else if(classStrs[1] == "icon-trash-n"){
				$(this).children(".menu-icon").removeClass("icon-trash-n");
				$(this).children(".menu-icon").addClass("icon-trash-f");			
			}
		}		
		
	});
	//操作列表鼠标滑出事件
	$(".easyui-menu .menu-item").bind("mouseout",function(){
		var classStrs = new Array();
		if($(this).children().length > 1){//详细信息没有图标，只有一个孩子
			classStrs = $(this).children(".menu-icon").attr("class").split(" ");
			if(classStrs[1] == "icon-add-f"){
				$(this).children(".menu-icon").addClass("icon-add-n");
				$(this).children(".menu-icon").removeClass("icon-add-f");
			}
			else if(classStrs[1] == "icon-rename-f"){
				$(this).children(".menu-icon").addClass("icon-rename-n");
				$(this).children(".menu-icon").removeClass("icon-rename-f");
			}
			else if(classStrs[1] == "icon-move-f"){				
				$(this).children(".menu-icon").addClass("icon-move-n");	
				$(this).children(".menu-icon").removeClass("icon-move-f");
			}
			else if(classStrs[1] == "icon-relieve-f"){				
				$(this).children(".menu-icon").addClass("icon-relieve-n");
				$(this).children(".menu-icon").removeClass("icon-relieve-f");
			}
			else if(classStrs[1] == "icon-contain-f"){
				$(this).children(".menu-icon").removeClass("icon-contain-f");
				$(this).children(".menu-icon").addClass("icon-contain-n");	
			}
			else if(classStrs[1] == "icon-trash-f"){
				$(this).children(".menu-icon").addClass("icon-trash-n");
				$(this).children(".menu-icon").removeClass("icon-trash-f");
			}
		}		
	});
});

/**
 * 新增树节点
 * @param tree_id  整棵树的id 
 */
function appendOmNode(tree_id){
	var t = $('#' + tree_id);
	var node = t.tree('getSelected');
	if(tree_id == "organization_groups_ul" || tree_id == "search_organization_groups_ul"){//组织用户树增加组织或用户 或者  搜索组织用户树增加组织或用户
		var map = new HashMap();
		map.put("node",node);
		map.put("tree_id", tree_id);
		newWinView.newWinOpen(addNode,map);
	}
	else if(tree_id == "role_groups_ul"){//增加角色
		var map = new HashMap();
		map.put("functionName","新增角色");
		map.put("functionType","add");
		map.put("name","新增角色");
		map.put("typeName","角色");
		map.put("titleName","角色名称:");
		map.put("node",node);
		map.put("tree_id", tree_id);
		renameWinView.renameWinOpen(addNode,map);
	}
	else if(tree_id == "resource_groups_ul"){//增加资源		
		var map = new HashMap();
		map.put("functionName","新增资源");
		map.put("functionType","add");
		map.put("name","新增资源");
		map.put("typeName","资源");
		map.put("titleName","资源名称:");
		map.put("node",node);
		map.put("tree_id", tree_id);
		newResourceView.newResourceViewOpen(addNode,map);
	}
	//增加节点
	function addNode(paraMap){
		var tree_id = paraMap.get("tree_id");
		if(tree_id == "organization_groups_ul" || tree_id == "search_organization_groups_ul"){
			var node = paraMap.get("node");
			var type = paraMap.get("type");
			var parentId = node.id;
			var status = 1;
			var name = paraMap.get("name");
			var password = paraMap.get("password");
			var phone = paraMap.get("phone");
			var mobilePhone = paraMap.get("mobilePhone");
			var email = paraMap.get("email");
			var address = paraMap.get("address");
			var iconClsImage ="";			
			if(type == 0){
				iconClsImage = "icon-organization-single";
			}
			else if(type == 1){
				iconClsImage = "icon-user";
			}
			paraMap.put("iconClsImage",iconClsImage);
			if(password == null){
				password = "";
				paraMap.remove("password");
				paraMap.put("password",password);
			}
			if(phone == null){
				phone = "";
				paraMap.remove("phone");
				paraMap.put("phone",phone);
			}
			if(mobilePhone == null){
				mobilePhone = "";
				paraMap.remove("mobilePhone");
				paraMap.put("mobilePhone",mobilePhone);
			}
			if(email == null){
				email = "";
				paraMap.remove("email");
				paraMap.put("email",email);
			}
			if(address == null){
				address = "";
				paraMap.remove("address");
				paraMap.put("address",address);
			}			
			var data =
				'"parentId":'+parentId+
				',"type":'+type+
				',"status":'+status+
				',"name":"'+encodeURIComponent(name)+
				'","password":"'+password+
				'","phone":"'+phone+
				'","mobilePhone":"'+mobilePhone+
				'","email":"'+email+
				'","address":"'+encodeURIComponent(address)+'"';
			var url=contextPath + '/ts/omOperateOrganization?type=add&data={'+data+'}';

			function addOneOrganization(response,paraMap){//增加组织或用户节点
				var id = response.data;
				var node = paraMap.get("node");
				var type = paraMap.get("type");
				var name = paraMap.get("name");
				var password = paraMap.get("password");
				var phone = paraMap.get("phone");
				var mobilePhone = paraMap.get("mobilePhone");
				var email = paraMap.get("email");
				var address = paraMap.get("address");
				var iconClsImage = paraMap.get("iconClsImage");

				addOneOrganizationInInterface(id,tree_id,node);

				function addOneOrganizationInInterface(id,tree_id,node){
					var t = $("#"+tree_id);
					t.tree('append', {
						parent: (node?node.target:null),
						data: [{
							id: id,
							text: name,
							iconCls: iconClsImage,
							attributes:{
								type: type,
								name: name,
								password: password,
								phone: phone,
								mobilePhone: mobilePhone,
								email: email,
								address: address
							}
						}]
					});
					if(node){
						if(node.iconCls == "icon-organization-single"){//父角色是叶子节点时,改变父角色的图标
							$(node.target).children(".tree-icon").removeClass("icon-organization-single-s");
							$(node.target).children(".tree-icon").addClass("icon-organization-double-s");
							node.iconCls = "icon-organization-double";
							$("#" + tree_id).tree("update",node);
						}															
					}
					//如果在搜索组织用户树中添加节点,搜索组织用户树改变标识设为true
					if(tree_id == "search_organization_groups_ul" && searchOrganizationTreeHasChanged == false){
						searchOrganizationTreeHasChanged = true;
					}			
				}				
			}
			
			operateServerData(url, organizations, addOneOrganization, paraMap);
		}
		else if(tree_id == "role_groups_ul"){
			var t = $("#"+paraMap.get("tree_id"));
			var node = paraMap.get("node");
			var parentId = node.id;
			var name = paraMap.get("name");
			var status = 1;
			var url = contextPath + "/ts/omOperateRole?type=add&data={'name':'"+encodeURIComponent(name)+"','parentId':"+parentId+",'status':"+status+"}";
			var map = new HashMap();
			map.put("node", node);
			map.put("name", name);

			function addOneRole(response,map){//增加角色节点
				var id = response.data;
				var node = map.get("node");
				var name = map.get("name");
				t.tree('append', {
					parent: (node?node.target:null),
					data: [{
						id: id,
						text: name,
						iconCls:"icon-role-single"
					}]
				});
				if(node){
					if(node.iconCls == "icon-role-single"){//父角色是叶子节点时,改变父角色的图标
						$(node.target).children(".tree-icon").removeClass("icon-role-single-s");
						$(node.target).children(".tree-icon").addClass("icon-role-double-s");
						node.iconCls = "icon-role-double";
						$("#role_groups_ul").tree("update",node);
					}
				}
			}
			
			operateServerData(url,roles,addOneRole,map);
			
		}
		else if(tree_id == "resource_groups_ul"){
			var t = $("#"+paraMap.get("tree_id"));
			var node = paraMap.get("node");
			var parentId = node.id;
			var name = paraMap.get("name");
			var no = paraMap.get("no");
			var status = 1;
			var map = new HashMap();
			map.put("node", node);
			map.put("name", name);
			map.put("no",no);
			var url = contextPath + "/ts/omOperateResource?type=add&data={'name':'"+encodeURIComponent(name)+"','parentId':"+parentId+",'no':'" + no + "','status':"+status+"}";						
			function addOneResource(response,map){//增加资源节点
				var id = response.data;
				var node = map.get("node");
				var name = map.get("name");
				var no = map.get("no");
				t.tree('append', {
					parent: (node?node.target:null),
					data: [{
						id: id,
						text: name + "(" + no + ")",
						iconCls:"icon-resource-single",
						no:no
					}]
				});
				if(node){
					if(node.iconCls == "icon-resource-single"){//父角色是叶子节点时,改变父角色的图标
						$(node.target).children(".tree-icon").removeClass("icon-resource-single-s");
						$(node.target).children(".tree-icon").addClass("icon-resource-double-s");
						node.iconCls = "icon-resource-double";
						$("#resource_groups_ul").tree("update",node);
					}
				}
				
				addResourceOperate(t.tree('find',id).target);
			}
			
			operateServerData(url,resources,addOneResource,map);
		}
	}
}
/**
 * 用户的移至功能
 * @param tree_id  整棵树的id
 */
function relieveOmNode(tree_id){
	var t = $('#' + tree_id);
	var node = t.tree('getSelected');
	var map = new HashMap();
	map.put("node", node);
	map.put("tree_id", tree_id);
	map.put("from", "relieveOrganization");
	relieveView.relieveOpen(map);
}

/**
 * 组织的添加用户功能
 * @param tree_id
 */
function containOmNode(tree_id){
	var t = $('#' + tree_id);
	var node = t.tree('getSelected');
	var map = new HashMap();
	map.put("node", node);
	map.put("tree_id", tree_id);
	map.put("from", "containUser");
	
	relieveView.relieveOpen(map);
}
/**
 * 重命名树节点
 * @param tree_id  整棵树的id
 */
function updateOmNode(tree_id){
	var t = $('#' + tree_id);
	var node = t.tree('getSelected');
	if(tree_id == "organization_groups_ul" || tree_id == "search_organization_groups_ul"){
		var type = node.attributes.type;
		var map = new HashMap();
		map.put("functionType","rename");
		map.put("tree_id", tree_id);
		map.put("name",node.text);
		map.put("node",node);
		map.put("type",type);
		if(type == 0){			
			map.put("functionName","重命名（组织）");
			map.put("typeName","组织");
			map.put("titleName","组织名称:");
		}
		else if(type == 1){
			map.put("functionName","重命名（用户）");
			map.put("typeName","用户");
			map.put("titleName","用户姓名:");
		}
		renameWinView.renameWinOpen(saveOmNode,map);
	}
	else if(tree_id == "role_groups_ul"){
		var map = new HashMap();
		map.put("functionType","rename");
		map.put("tree_id", tree_id);
		map.put("functionName","重命名（角色）");
		map.put("name",node.text);
		map.put("node",node);
		map.put("typeName","角色");
		map.put("titleName","角色名称:");
		renameWinView.renameWinOpen(saveOmNode,map);
	}
	else if(tree_id == "resource_groups_ul"){
		var map = new HashMap();
		map.put("functionType","rename");
		map.put("tree_id", tree_id);
		map.put("functionName","重命名（资源）");
		map.put("name",node.text);
		map.put("node",node);
		map.put("typeName","资源");
		map.put("titleName","资源名称:");
		renameWinView.renameWinOpen(saveOmNode,map);
	}
	
	//修改完树节点后保存
	function saveOmNode(map){
		
		var tree_id = map.get("tree_id");	
		var node = map.get("node");
		var name = map.get("name");
		var id = node.id;
		node.text = name;
		$("#" + tree_id).tree("update",node);
		var url = "";
		if(tree_id == "organization_groups_ul" || tree_id == "search_organization_groups_ul"){			

			var type = map.get("type");
			url = contextPath + '/ts/omOperateOrganization?type=update&data={"id":' + id + ',"name":"' 
				+ encodeURIComponent(name) +'","type":'+ type +'}';
			operateServerData(url,organizations);
			if(tree_id == "search_organization_groups_ul"){
				searchOrganizationTreeHasChanged = true;
			}
			//修改界面上其他组织下的该用户
			if(node.attributes.type == 1){
				var srcUrl = contextPath + '/ts/omGetOrganizationByUser?data={"userId":' + node.id +'}';
				operateServerData(srcUrl,organizations,getInformation,map);
				function getInformation(response,map){	
					var data = response.data;
					var tree_id = map.get("tree_id");
					var node = map.get("node");
					
					for(var i=0;i<data.length;i++){
						//循环获取该用户所有的父亲节点
						var parentNode = $("#" + tree_id).tree("find",data[i].id);
						if(parentNode){
							//获取父亲节点的所有子节点
							var childrenNodes = $("#" + tree_id).tree("getChildren",parentNode.target);
							if(childrenNodes){
								for(var j=0;j<childrenNodes.length;j++){
									if(childrenNodes[j].id == node.id && childrenNodes[j].text != node.text){
										childrenNodes[j].text = node.text;
										$("#" + tree_id).tree("update",childrenNodes[j]);
									}
								}
							}
						}
					}
				}
			}
		}
		else if(tree_id == "role_groups_ul"){
			$("#role_groups_ul").tree("update",node);
			url = contextPath + '/ts/omOperateRole?type=update&data={"id":' + id + ',"name":"' 
				+ encodeURIComponent(name) +'"}';
			operateServerData(url,roles);
		}
		else if(tree_id == "resource_groups_ul"){
			$("#resource_groups_ul").tree("update",node);
			url = contextPath + '/ts/omOperateResource?type=update&data={"id":' + id + ',"name":"' 
				+ encodeURIComponent(name) +'"}';
			operateServerData(url,resources);
		}
	}
}

/**
 * 删除和移除(只是移除用户)树节点
 * @param tree_id  整棵树的id
 */
function removeOmNode(tree_id,type){
	var t = $('#' + tree_id);
	var node = t.tree('getSelected');
	var map = new HashMap();
	var name="";
	map.put("titleName", "删除");
	var parentNode = $("#"+tree_id).tree("getParent",node.target);
	if(tree_id == "organization_groups_ul" || tree_id == "search_organization_groups_ul"){
		if(node.attributes.type == 0){
			name="确认删除名为【" + node.text + "】的组织?<br>删除后将无法撤销此操作!";
		}
		else if(node.attributes.type == 1){
			if(type == "relieve"){
				name="确认删除名为【" + node.text + "】的用户和上级组织【" + parentNode.text +"】间的关系?<br>删除后将无法撤销此操作!";
				map.remove("titleName");
				map.put("titleName", "解除关系");
			}
			else if(type == "delete"){
				name="确认删除名为【" + node.text + "】的用户?<br>删除后将无法撤销此操作!";
			}			
		}
		
	}
	else if(tree_id == "role_groups_ul"){
		name="确认删除名为【" + node.text + "】的角色?<br>删除后将无法撤销此操作!";
	}
	else if(tree_id == "resource_groups_ul"){
		name="确认删除名为【" + node.text + "】的资源?<br>删除后将无法撤销此操作!";
	}
	map.put("tree_id",tree_id);
	map.put("name", name);
	map.put("node", node);
	confirmView.confirmOpen(deleteOmNode,map);
	
	function deleteOmNode(map){
		var node = map.get("node");
		var id = node.id;
		var tree_id = map.get("tree_id");
		if(tree_id == "organization_groups_ul" || tree_id == "search_organization_groups_ul"){//移除或删除组织或用户节点
			var parentNode = $('#' + tree_id).tree('getParent', node.target);//获得父节点			
			if(type == "relieve"){
				if($('#' + tree_id).tree('isLeaf', parentNode.target)){//判断父节点为叶子节点时，改变父节点的图标
					$(parentNode.target).children(".tree-icon").removeClass("icon-organization-double");
					$(parentNode.target).children(".tree-icon").addClass("icon-organization-single");
					parentNode.iconCls = "icon-organization-single";
					$("#organization_groups_ul").tree("update",parentNode);
				}
				var url=contextPath + '/ts/omRemoveRelation?data={"organizationId":'+ parentNode.id +',"userId":'+id+'}';
				function relieve(){
					$('#' + tree_id).tree('remove', node.target);					
					if(tree_id == "search_organization_groups_ul"){
						searchOrganizationTreeHasChanged = true;
					}
				}			
				operateServerData(url,organizations,relieve);
			}
			else if(type == "delete"){
				if(node.attributes.type == 0){//删除组织
					$('#' + tree_id).tree('remove', node.target);
					if($('#' + tree_id).tree('isLeaf', parentNode.target)){//判断父节点为叶子节点时，改变父节点的图标
						$(parentNode.target).children(".tree-icon").removeClass("icon-organization-double");
						$(parentNode.target).children(".tree-icon").addClass("icon-organization-single");
						parentNode.iconCls = "icon-organization-single";
						$("#organization_groups_ul").tree("update",parentNode);
					}

					var url=contextPath + '/ts/omOperateOrganization?type=delete&data={"id":'+id+',"type":'+node.attributes.type+'}';				
					operateServerData(url,organizations,addToRoot);
					
					function addToRoot(response){
						var data = response.data;
						for(var i=0; i<data.length; i++){
							var node = $("#organization_groups_ul").tree("getRoot").target;
							var type = data[i].type;
							var status = data[i].status;
							var name = data[i].name;
							var password = data[i].password;
							var phone = data[i].phone;
							var mobilePhone = data[i].mobilephone;
							var email = data[i].email;
							var address = data[i].address;
							var iconClsImage = "icon-user";;
							$("#organization_groups_ul").tree('append', {
								parent: node,
								data: [{
									id: id,
									text: name,
									iconCls: iconClsImage,
									attributes:{
										type: type,
										name: name,
										password: password,
										phone: phone,
										mobilePhone: mobilePhone,
										email: email,
										address: address
									}
								}]
							});
						}
					}
				}
				else if(node.attributes.type == 1){//删除用户
					if(tree_id == "organization_groups_ul"){//组织用户树
						
						var srcUrl = contextPath + '/ts/omGetOrganizationByUser?data={"userId":' + id +'}';
						var paraMap = new HashMap();
						paraMap.put("node", node);
						paraMap.put("tree_id", tree_id);
						paraMap.put("id",id);				
						//获得用户属于的组织
						function getInformation(response,paraMap){
							var organizationData = response.data;
							paraMap.put("organizationData",organizationData);
							var url=contextPath + '/ts/omOperateOrganization?type=delete&data={"id":'+id+',"type":'+node.attributes.type+'}';				
							operateServerData(url,organizations,deleteUserNode,paraMap);
							
							function deleteUserNode(response,paraMap){ 
								var organizationData = paraMap.get("organizationData");
								var userNode = paraMap.get("node");
								var tree_id = paraMap.get("tree_id");
								for( var i = 0; i < organizationData.length; i++){//组织树去掉组织节点
									var t = $("#" + tree_id);
									var node = t.tree("find",organizationData[i].id);
									if(node){
										//组织已展开
										if(t.tree("getChildren",node.target) != ""){
											var length = $(node.target).next().children().length;
											for(var j = 0; j < length; j++){
												if(parseInt($(node.target).next().children().eq(j).children().attr("node-id")) == userNode.id){
													t.tree("remove",($(node.target).next().children().eq(j).children())[0]);
													//如果其父组织下只有一个用户，移除这个用户之后，父组织的图标要相应改变
													if(t.tree("getChildren",node.target) == ""){
														node.iconCls = "icon-organization-single";
														t.tree("update",node);
													}
													break;
												}
											}
										}
										else{//组织未展开，需要判断组织下的子节点个数
											var url = contextPath + '/ts/omGetSubCount?data={"id":' + node.id + '}';					
											//根据返回的数据判断，当该组织下面没有用户时，刷新该组织的父组织
											function isChangeNode(response) {
												var count = response.data;
												if(count == 0){
													var parentNode = t.tree("getParent",node.target);
													var	url = contextPath + "/ts/omGetOrganizationTree?type=0&data={'id':" + parentNode.id +"}";										
													t.tree("options").url = url;
													t.tree("reload",parentNode.target);
												}
											}									
											operateServerData(url,organizations,isChangeNode);
										}
									}
								}
							}
						}			
						operateServerData(srcUrl,organizations,getInformation,paraMap);
					}
					else if(tree_id == "search_organization_groups_ul"){//搜索组织用户树
						var url=contextPath + '/ts/omOperateOrganization?type=delete&data={"id":'+id+',"type":'+node.attributes.type+'}';				
						operateServerData(url,organizations);				
						//删除用户节点时，若用户属于其他组织，则其他组织中的此用户也要被删除
						if(node.attributes.type == 1){
							while($('#' + tree_id).tree('find', id)){
								var parentNode = $('#' + tree_id).tree('getParent', $('#' + tree_id).tree('find', id).target);
								$('#' + tree_id).tree('remove', $('#' + tree_id).tree('find', id).target);
								if($('#' + tree_id).tree('isLeaf',parentNode.target)){//父节点为叶子节点时，改变组织图标
									parentNode.iconCls = "icon-organization-single";
									$('#' + tree_id).tree("update",parentNode);
								}
								 
							}
						}
					}
				}				
			}
			
			//去掉所有选择角色的选择状态
			var checkRoleNodes = $('#role_groups_ul').tree('getChecked');
			if(checkRoleNodes){
				for ( var i = 0; i < checkRoleNodes.length; i++) {
					$('#role_groups_ul').tree('uncheck',checkRoleNodes[i].target);
				}
			}
			/********************清理hashMap*/
			
			if(tree_id == "organization_groups_ul"){
				selectedOrganizationNode = null;
			}
			else if(tree_id == "search_organization_groups_ul"){
				selectedSearchOrganizationNode = null;
				searchOrganizationTreeHasChanged = true;
			}
		}
		else if(tree_id == "role_groups_ul"){//删除角色节点
			var url=contextPath + '/ts/omOperateRole?type=delete&data={id:'+id+'}';
			operateServerData(url,roles);
			
			//去掉所有选择资源的选择状态
			var checkResourceNodes = $('#resource_groups_ul').tree('getChecked');
			if(checkResourceNodes){
				for ( var i = 0; i < checkResourceNodes.length; i++) {
					$('#resource_groups_ul').tree('uncheck',checkResourceNodes[i].target);
				}
			}
			
			//移除节点时, 清理hashmap
			if(roleResourceData.containsKey(selectedRoleNode.id)){
				roleResourceData.remove(selectedRoleNode.id);
			}
			if(roleResourceDataOld.containsKey(selectedRoleNode.id)){
				roleResourceDataOld.remove(selectedRoleNode.id);
			}
			selectedRoleNode = null;
			
			var parentNode = $('#' + tree_id).tree('getParent', node.target);//获得父节点
			$('#' + tree_id).tree('remove', node.target);
			if($('#' + tree_id).tree('isLeaf', parentNode.target)){//判断父节点为叶子节点时，改变父节点的图标
				$(parentNode.target).children(".tree-icon").removeClass("icon-role-double");
				$(parentNode.target).children(".tree-icon").addClass("icon-role-single");
				parentNode.iconCls = "icon-role-single";
				$("#role_groups_ul").tree("update",parentNode);
			}
			
		}
		else if(tree_id == "resource_groups_ul"){//删除资源节点
			
			var url=contextPath + '/ts/omOperateResource?type=delete&data={id:'+ id+ '}';
			operateServerData(url,resources);
			selectedResourceNode = null;
						
			var parentNode = $('#' + tree_id).tree('getParent', node.target);//获得父节点
			$('#' + tree_id).tree('remove', node.target);
			if($('#' + tree_id).tree('isLeaf', parentNode.target)){//判断父节点为叶子节点时，改变父节点的图标
				$(parentNode.target).children(".tree-icon").removeClass("icon-resource-double");
				$(parentNode.target).children(".tree-icon").addClass("icon-resource-single");
				parentNode.iconCls = "icon-resource-single";
				$("#resource_groups_ul").tree("update",parentNode);
			}
		}
	}
}
/**
 * 显示、修改用户或者组织详细信息
 * @param tree_id  整棵树的id
 */
function showMoreInformation(tree_id){
	var t = $('#' + tree_id);
	var node = t.tree('getSelected');
	var type = node.attributes.type;
	var map = new HashMap();
	map.put("tree_id", tree_id);
	map.put("node", node);
	var url = "";
	if(type == 0){//获得组织包含的用户
		 url = contextPath + '/ts/omGetUserByOrganization?data={"organizationId":' + node.id + '}';
	}
	else if(type == 1){//获得用户目前位于的组织
		url = contextPath + '/ts/omGetOrganizationByUser?data={"userId":' + node.id +'}';	
		
	}
	operateServerData(url,organizations,getInformation,map);
	
	//获得用户位于的组织信息或组织包含的用户信息
	function getInformation(response,map){
		var data = response.data;
		map.put("data",data);
		moreInformationView.moreInformationBoxOpen(editMoreInformation,map);
		
	}
			
	function editMoreInformation(map){
		var node = map.get("node");
		var id = node.id;
		var type = node.attributes.type;
		var email = node.attributes.email;
		var name = node.text;		
		var phone = node.attributes.phone;
		var mobilePhone = node.attributes.mobilePhone;
		var address = node.attributes.address;
		var tree_id = map.get("tree_id");
		
		var url = contextPath + '/ts/omOperateOrganization?type=update&data={"id":' + id + ',"name":"' 
		+ encodeURIComponent(name) + '","type":' + type + ',"email":"' + email + '","phone":"' + phone +
		'","mobilePhone":"' + mobilePhone + '","address":"' + encodeURIComponent(address) +'"}';
		operateServerData(url,organizations);
		
		if(tree_id == "search_organization_groups_ul"){
			searchOrganizationTreeHasChanged = true;
		}
				
		//修改界面上其他组织下的该用户
		if(node.attributes.type == 1){
			var srcUrl = contextPath + '/ts/omGetOrganizationByUser?data={"userId":' + node.id +'}';
			function getInformation(response,map){
				var data = response.data;
				var tree_id = map.get("tree_id");
				var node = map.get("node");
				
				for(var i=0;i<data.length;i++){
					//循环获取该用户所有的父亲节点
					var parentNode = $("#" + tree_id).tree("find",data[i].id);
					if(parentNode){
						//获取父亲节点的所有子节点
						var childrenNodes = $("#" + tree_id).tree("getChildren",parentNode.target);
						if(childrenNodes){
							for(var j=0;j<childrenNodes.length;j++){
								if(childrenNodes[j].id == node.id){
									
									childrenNodes[j].text = node.text;
									childrenNodes[j].attributes.email = node.attributes.email;
									childrenNodes[j].attributes.phone = node.attributes.phone;
									childrenNodes[j].attributes.mobilePhone = node.attributes.mobilePhone;
									childrenNodes[j].attributes.address = node.attributes.address;
									$("#" + tree_id).tree("update",childrenNodes[j]);
								}
							}
						}
					}
				}								
			}	
			operateServerData(srcUrl,organizations,getInformation,map);
		}
	}
	
}

/**
 * 为资源树各节点增加操作
 * @param target  资源数节点的div对象
 */
function addResourceOperate(target){
	$(target).append(
			"<div class='operate-div'><span class='opertate-tree-checkbox operate-tree-checkbox0' style='margin-left:40px;'>" + 
			"</span><span class='opertate-tree-title'>增</span>"+ 
			"<span class='opertate-tree-checkbox operate-tree-checkbox0'></span><span class='opertate-tree-title'>删</span>" + 
			"<span class='opertate-tree-checkbox operate-tree-checkbox0'></span><span class='opertate-tree-title'>改</span>" + 
			"<span class='opertate-tree-checkbox operate-tree-checkbox0'></span><span class='opertate-tree-title'>查</span></div>");
	$(target).bind("mouseover",function(){
		$(this).children(".operate-div").css("display","inline");
	});
	$(target).bind("mouseout",function(){
		$(this).children(".operate-div").css("display","none");
	});
	$(target).children(".operate-div").children(".opertate-tree-checkbox").each(function(){
		
		$(this).bind("click",function(){
			var nodeTarget = $(this).parent().parent();
			var treeCheckboxClassStr = $(nodeTarget).children(".tree-checkbox").attr("class");
			var treeCheckboxClasses = treeCheckboxClassStr.split(" ");
			if(treeCheckboxClasses[1] == "tree-checkbox1"){//资源选中才能选择操作
				var classStr = $(this).attr("class");
				var classes = classStr.split(" ");
				if(classes[1] == "operate-tree-checkbox0"){
					 $(this).removeClass("operate-tree-checkbox0");
					 $(this).addClass("operate-tree-checkbox1");
				}
				else if(classes[1] == "operate-tree-checkbox1"){
					 $(this).removeClass("operate-tree-checkbox1");
					 $(this).addClass("operate-tree-checkbox0");
				}
			}
		});
	});
}