/**
 * 角色树view
 */
function RoleView(){
	/** ********内部属性及方法******** start */
	var ROLE_ROOT_ID = 0;//角色树根节点id
	var selectRoleNode = null;//选中的角色树节点
	var roleService = new RoleService();
	var searchRoleData = null;//搜索角色返回的数据
	var roleResourceData = new HashMap();//角色的资源数据缓存map,key:角色的id,value是角色的资源信息json数组
	var _roleView = this;
	
	/**
	 * 在界面上新增角色节点
	 * @data 接口返回的角色节点id
	 * @param 新增节点参数信息
	 */
	var appendRoleNode = function(data,param){
		var roleZTree = $.fn.zTree.getZTreeObj("roleZTree");
		var parentNode = roleZTree.getSelectedNodes()[0];//父节点
		var paramData = JSON2.parse(param.data);
		var checked = false;
		if(parentNode.checked && !parentNode.getCheckStatus().half){
			checked = true;
		}
		var newRoleNodes = [{"id":data,"name":paramData.name,"status":paramData.status,"parentId":parentNode.id,"iconSkin":"icon-role-single",
			"checked":checked}];//新增节点信息
		if(!parentNode.isParent){//父节点是叶子节点，改变父节点的图标
			parentNode.iconSkin = "icon-role-double-s";
			roleZTree.updateNode(parentNode);
		}		
		roleZTree.addNodes(parentNode,newRoleNodes);//新增角色节点
		
		$(".blackboard-css").hide();
		$("#renameWin").fadeOut(function(){
			$("#renameWin").remove();
		});
	};
	
	/**
	 * 在界面上更新角色节点（重命名）
	 * @data 接口返回的数据
	 * @param 重命名节点参数信息
	 */
	var updateRoleNode = function(data,param){
		var roleZTree = $.fn.zTree.getZTreeObj("roleZTree");
		var selectNode = roleZTree.getSelectedNodes()[0];//选中节点
		var paramData = JSON2.parse(param.data);
		selectNode.name = paramData.name;
		roleZTree.updateNode(selectNode);
		
		$(".blackboard-css").hide();
		$("#renameWin").fadeOut(function(){
			$("#renameWin").remove();
		});
	};
	
	/**
	 * 在界面上删除角色节点
	 * @data 接口返回的数据
	 * @param 删除节点参数信息
	 */
	var deleteRoleNode = function(data,param){
		var roleZTree = $.fn.zTree.getZTreeObj("roleZTree");
		var selectNode = roleZTree.getSelectedNodes()[0];//选中节点	
		var parentNode = selectNode.getParentNode();
		roleZTree.removeNode(selectNode);//删除选中节点
		if(!parentNode.isParent){//删除选中节点后，若父节点变为叶子节点，则改变父节点的图标
			parentNode.iconSkin = "icon-role-single";
			roleZTree.updateNode(parentNode);
		}
		roleResourceData.remove(selectNode.id);
		resourceView.setSaveRoleNode(null);
		unCheckAllResourceNodes();
		selectRoleNode = null;
		$(".blackboard-css").hide();
		$("#deleteWin").fadeOut(function(){
			$("#deleteWin").remove();
		});
	};
	
	/**
	 * 在界面上显示搜索角色结果
	 * @param data 接口返回的数据
	 */
	var showSearchRoleData = function(data){
		searchRoleData = data;
		if(data.length == 0){
			$("#role_result_span_tip").show();
		}
		else if(data.length > 0){
			var roleZTree = $.fn.zTree.getZTreeObj("roleZTree");
			for ( var i = 0; i < data.length; i++) {
				var treeNode = roleZTree.getNodeByParam("id",data[i].id);
					
				if($("#" + treeNode.tId + "_a").length == 0){//改变搜索结果节点的样式，若节点在界面上还未加载则需要先选中节点
					roleZTree.selectNode(treeNode);
				}
						
				$("#" + treeNode.tId + "_span").addClass("search_node_color");				
			}
			if($("#role_operate").height() < $("#roleZTree").height()){//判断角色树出现滚动条，则将滚动条移动到最上面
				$("#role_operate").scrollTop(0);
			}
			if(selectRoleNode){//搜索角色树之后，选中节点要切换回来
				roleZTree.selectNode(selectRoleNode);
			}
			else{//没有选中节点，则取消角色树的选中节点选中状态
				roleZTree.cancelSelectedNode();
			}
		}
	};
	
	/**
	 * 勾选资源节点
	 * @param treeNode
	 * @returns
	 */
	var checkResourceNodes = function(treeNode){
		var id = treeNode.id;
		if(id == ROLE_ROOT_ID){//角色树根节点,不勾选资源节点
			return;
		}
		if(roleResourceData.get(id)){//角色资源信息已缓存在map中
			resourceView.checkResourceNodes(roleResourceData.get(id),treeNode);
		}
		else{
			var param = {data:JSON2.stringify({"id":id})};
			roleService.omGetRoleResource(function(data){
				resourceView.checkResourceNodes(data,treeNode);
				roleResourceData.put(id, data);
			}, param);
		}
	};
	
	/**
	 * 取消所有勾选资源节点
	 * @returns
	 */
	var unCheckAllResourceNodes = function(){
		resourceView.unCheckAllResourceNodes();
	};
	
	/**
	 * 将资源赋予角色的回调函数
	 * @param param
	 * @param isShowTip
	 * @returns
	 */
	var awardResource = function(param,isShowTip){
		var id = JSON2.parse(param.data).id;//改变资源信息的角色id
		var paramData = JSON2.parse(param.data).value;//角色改变的资源信息数组
		var data = roleResourceData.get(id);//未改变资源信息之间，角色的资源信息数组
		
		for ( var i = 0; i < paramData.length; i++) {
			if(paramData[i].type == 0){//授权
				if(data.length == 0){
					var json = {"id":paramData[i].id,"permission":paramData[i].permission};
					data.push(json);
				}
				else{
					for ( var j = 0; j < data.length; j++) {
						if(paramData[i].id == data[j].id){
							data.splice(j,1);
							var json = {"id":paramData[i].id,"permission":paramData[i].permission};
							data.push(json);
							break;
						}
						if(j == data.length -1){
							var json = {"id":paramData[i].id,"permission":paramData[i].permission};
							data.push(json);
						}
					}
				}			
			}
			else{
				if(paramData[i].type == 1){//取消权利
					for ( var j = 0; j < data.length; j++) {
						if(paramData[i].id == data[j].id){
							data.splice(j,1);
							break;
						}
					}
				}
			}
		}
		roleResourceData.remove(id);
		roleResourceData.put(id,data);
		if(isShowTip){
			$.messager.alert("操作提示", "保存成功！","info");
			omTopView.removeOmsaveDisable();
		}
	};
	
	/**
	 * 初始化角色树
	 */
	var initRoleZTree = function(){
		var setting = {
			async:{
				enable: true,//开启异步加载模式
				url: path + "/ts/omGetRoleZTree?",
				autoParam: ["id"]
			},
			data: {
				simpleData: {
					enable: true,//使用简单数据模式
					idKey: "id",
					pIdKey: "parentId",
					rootPId: -1
				}
			},
			check: {				
				enable: true//显示checkbox
			},
			view: {
				showLine:false//不显示连线
			},
			callback: {
				onRightClick: onRightClick,//右键回调函数
				onClick: onClick//点击回调函数
			}
		};
		var zNodes = [{"id":ROLE_ROOT_ID,"name":"角色","parentId":-1,"open":false, "isParent":true,
			"iconSkin":"icon-role-double"}];//定义zTree根节点
		$.fn.zTree.init($("#roleZTree"), setting, zNodes);//创建zTree
		var roleZTree = $.fn.zTree.getZTreeObj("roleZTree");//获得zTree对象
		var rootNode = roleZTree.getNodeByParam("id",ROLE_ROOT_ID,null);//获得根节点对象
		roleZTree.expandNode(rootNode,true,false,true);//展开根节点
	};
	
	/**
	 * 点击zTree回调函数
	 * @param event
	 * @param treeId
	 * @param treeNode
	 * @returns
	 */
	var onClick = function(event, treeId, treeNode){
		var roleZTree = $.fn.zTree.getZTreeObj(treeId);//获得zTree对象
		if(selectRoleNode){
			if(selectRoleNode.id == treeNode.id){//点击同一节点
				return;
			}
			if(selectRoleNode.isParent){//父亲节点
				selectRoleNode.iconSkin = "icon-role-double";				
			}
			else{
				selectRoleNode.iconSkin = "icon-role-single";
			}
			roleZTree.updateNode(selectRoleNode);
			omAwardResource(selectRoleNode);
			
			unCheckAllResourceNodes();
		}
		else{
			unCheckAllResourceNodes();
		}
		
		selectRoleNode = treeNode;
		if(treeNode.isParent){
			treeNode.iconSkin = "icon-role-double-s";
		}
		else{
			treeNode.iconSkin = "icon-role-single-s";
		}
		roleZTree.updateNode(treeNode);
		checkResourceNodes(treeNode);
	};
	
	/**
	 * 右击zTree回调函数
	 * @param event
	 * @param treeId
	 * @param treeNode
	 */
	var onRightClick = function(event, treeId, treeNode){
		showMenu(treeId,treeNode,event);
	};
	
	/**
	 * 显示菜单
	 * @param treeId
	 * @param treeNode
	 * @param event
	 * @returns
	 */
	var showMenu = function(treeId,treeNode,event){
		if(treeNode){//这个判断用来放置右击树的其他地方时取不到treeNode
			var roleZTree = $.fn.zTree.getZTreeObj(treeId);//获得zTree对象
			roleZTree.selectNode(treeNode);//选中右键点击的节点
			onClick(null,treeId,treeNode);//点击右键点击的节点
			var menuId = "role_menu";

			initMenu(roleZTree,treeNode,menuId,event);
		}
	};
		
	/**
	 * 将资源赋予角色
	 * @treeNode 角色节点
	 * @returns
	 */
	var omAwardResource = function(treeNode){
		var id = treeNode.id;
		if(id == ROLE_ROOT_ID){//根节点直接返回
			return;
		}
		var changeCheckedResourcesData = _roleView.getChangeCheckedResourceData(treeNode);//角色改变的资源信息
		if(changeCheckedResourcesData && changeCheckedResourcesData.length > 0){
			_roleView.saveRolePermission(treeNode,changeCheckedResourcesData,false);
		}
	};
	
	/** ********内部属性及方法******** end */
	
	/** 对外提供的函数 */
	/**
	 * 初始化
	 */
	this.init = function(){
		initRoleZTree();
	};

	/**
	 * 新增角色树节点
	 * @param treeNode 父节点
	 * @param name 新增节点名称
	 */
	this.addZTreeNode = function(treeNode,name){		
		var param = {type:"add",data:JSON2.stringify({name:name,parentId:treeNode.id,status:1})};
		roleService.omOperateRole(appendRoleNode,param);
	};
	
	/**
	 * 重命名角色树节点
	 * @param treeNode 重命名节点
	 * @param name 节点名称
	 */
	this.updateZTreeNode = function(treeNode,name){
		var param = {type:"update",data:JSON2.stringify({id:treeNode.id,name:name})};
		roleService.omOperateRole(updateRoleNode,param);		
	};
	
	/**
	 * 删除角色树节点
	 * @treeNode 删除节点
	 */
	this.deleteZTreeNode = function(treeNode){
		var param = {type:"delete",data:JSON2.stringify({id:treeNode.id})};
		roleService.omOperateRole(deleteRoleNode,param);
	};
	
	/**
	 * 搜索角色
	 * @param name 搜索角色名称
	 */
	this.omSearchRole = function(name){
		this.unOmSearchRole();
		
		var param = {data:JSON2.stringify({name:name})};
		roleService.omSearchRole(showSearchRoleData, param);
	};
	
	/**
	 * 取消搜索到的角色样式
	 */
	this.unOmSearchRole = function(){
		if(searchRoleData && searchRoleData.length > 0){//有搜索到角色
			var roleZTree = $.fn.zTree.getZTreeObj("roleZTree");
			for ( var i = 0; i < searchRoleData.length; i++) {				
				var treeNode = roleZTree.getNodeByParam("id",searchRoleData[i].id);
				if(treeNode){
					$("#" + treeNode.tId + "_span").removeClass("search_node_color");
				}
			}
		}
	};	
	
	/**
	 * 勾选角色节点
	 * @param treeNodesData 勾选的角色节点数组
	 */
	this.checkRoleNodes = function(treeNodesData){
		var roleZTree = $.fn.zTree.getZTreeObj("roleZTree");//获得zTree对象
		for ( var i = 0; i < treeNodesData.length; i++) {
			var treeNode = roleZTree.getNodeByParam("id",treeNodesData[i].id);
			roleZTree.checkNode(treeNode, true, true,false);
		}
	};
	
	/**
	 * 从缓存map中获得角色节点的资源数据数组
	 * @param treeNode 角色节点
	 */
	this.getRoleResourceArr = function(treeNode){
		if(treeNode){
			return roleResourceData.get(treeNode.id);
		}
		else{
			return null;
		}
	};
	
	/**
	 * 取消勾选所有角色节点
	 */
	this.unCheckAllRoleNodes = function(){
		var roleZTree = $.fn.zTree.getZTreeObj("roleZTree");//获得zTree对象
		roleZTree.checkAllNodes(false);
	};
	
	/**
	 * 获得组织用户的角色改变数据数组  //0代表授权，1代表取消
	 * @param oldCheckedRolesData保存之前组织用户勾选的角色数组信息
	 */
	this.getChangeCheckedRolesData = function(oldCheckedRolesData){
		var roleZTree = $.fn.zTree.getZTreeObj("roleZTree");//获得zTree对象
		var checkedNodes = roleZTree.getCheckedNodes(true);
		var changeRolesData = new Array();//存放改变了的组织用户的角色信息数组
		//去掉勾选角色数组信息中的半勾选角色信息
		for ( var i = 0; i < checkedNodes.length; i++) {
			if(checkedNodes[i].getCheckStatus().half){//节点半选中状态
				checkedNodes.splice(i,1);
				i--;
			}
		}
		if(oldCheckedRolesData.length == 0 && checkedNodes.length == 0){//保存前后都没有角色信息
			return changeRolesData;
		}
		
		//判断组织用户新增的角色信息
		if(oldCheckedRolesData.length == 0){//组织用户的角色保存之前没有勾选角色信息
			for ( var i = 0; i < checkedNodes.length; i++) {
				var json = {"id":checkedNodes[i].id,"type":0};
				changeRolesData.push(json);
			}
		}
		else{
			for ( var i = 0; i < checkedNodes.length; i++) {
				for ( var j = 0; j < oldCheckedRolesData.length; j++) {
					if(checkedNodes[i].id == oldCheckedRolesData[j].id){//勾选的节点没有变化
						break;
					}
					if(j == oldCheckedRolesData.length -1){
						var json = {"id":checkedNodes[i].id,"type":0};
						changeRolesData.push(json);
					}
				}
			}
		}
		//判断组织用户减少的角色信息
		if(checkedNodes.length == 0){//组织用户的角色保存之后没有勾选角色信息
			for ( var i = 0; i < oldCheckedRolesData.length; i++) {
				var json = {"id":oldCheckedRolesData[i].id,"type":1};
				changeRolesData.push(json);
			}
		}
		else{
			for ( var i = 0; i < oldCheckedRolesData.length; i++) {
				for ( var j = 0; j < checkedNodes.length; j++) {
					if(oldCheckedRolesData[i].id == checkedNodes[j].id){
						break;
					}
					if(j == checkedNodes.length -1){
						var json = {"id":oldCheckedRolesData[i].id,"type":1};
						changeRolesData.push(json);
					}
				}
			}
		}
		
		return changeRolesData;
	};
	
	/**
	 * 获得角色节点改变的资源数据
	 * @param treeNode
	 */
	this.getChangeCheckedResourceData = function(treeNode){
		var id = treeNode.id;
		if(id == ROLE_ROOT_ID){//根节点直接返回
			return;
		}
		var oldCheckedResourcesData = roleResourceData.get(id);//获得保存之前角色勾选的资源数组信息
		var changeCheckedResourcesData = new Array();
		if(oldCheckedResourcesData){
			changeCheckedResourcesData = resourceView.getChangeCheckedResourcesData(oldCheckedResourcesData);			
		}
		
		return changeCheckedResourcesData;
	};
	
	/**
	 * 保存角色权限
	 * @param treeNode
	 * @param changeCheckedResourcesData //角色改变的资源数组信息
	 * @param isShowTip
	 */
	this.saveRolePermission = function(treeNode,changeCheckedResourcesData,isShowTip){
		var id = treeNode.id;
		var param = {"data":JSON2.stringify({"id": id,"value":changeCheckedResourcesData})};
		roleService.omAwardResource(awardResource, param ,isShowTip);
	};
}