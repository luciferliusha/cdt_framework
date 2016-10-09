/**
 * 组织用户树View
 */
function OrganizationView(){
	/** ********内部属性及方法******** start */
	var ORGANIZATION_ROOT_ID = -1;//组织用户树根节点id
	var selectOrganizationNode = null;//选中的组织用户树节点
	var USER_TYPE = 1;//用户类型1
	var ORGANIZATION_TYPE = 0;//组织类型0
	var organizationService = new OrganizationService();
	var searchOrganizationData = null;//搜索组织用户返回的数据
	var organizationRoleData = new HashMap();//组织与用户的角色数据缓存map,key:组织用户的id,value组织用户的角色信息json数组
	var _organizationView = this;
	
	/**
	 * 在界面上新增组织用户节点
	 * @param data 接口返回的组织用户节点id
	 * @param param 新增节点参数信息
	 * @param _winId 新增窗口id
	 */
	var appendOrganizationNode = function(data,param,_winId){
		var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");//获得zTree对象
		var parentNode = organizationZTree.getSelectedNodes()[0];//父节点
		var paramData = JSON2.parse(param.data);
		var newRoleNodes = [];//新增节点信息数组;
		var newRoleNodeJson = {};//新增节点信息;
		newRoleNodeJson["id"] = data;		
		for(var key in paramData){//循环新增节点参数信息
			newRoleNodeJson[key] = paramData[key];
			if(key == "type"){
				if(paramData[key] == ORGANIZATION_TYPE){//新增组织
					newRoleNodeJson["iconSkin"] = "icon-organization-single";
				}
				else if(paramData[key] == USER_TYPE){//新增用户
					newRoleNodeJson["iconSkin"] = "icon-user";
				}
			}
		}
		newRoleNodes.push(newRoleNodeJson);
		if(!parentNode.isParent){//父节点是叶子节点，改变父节点的图标
			parentNode.iconSkin = "icon-organization-double-s";
			organizationZTree.updateNode(parentNode);
		}
		organizationZTree.addNodes(parentNode,newRoleNodes);//新增组织节点
		
		$(".blackboard-css").hide();
		$("#" + _winId).fadeOut(function(){
			$("#" + _winId).remove();
		});
	};
	
	/**
	 * 在组织用户树上重命名组织用户节点
	 * @param data 接口返回的数据
	 * @param param 新增节点参数信息
	 */
	var renameOrganizationNode = function(data,param){
		var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");//获得zTree对象
		var selectNode = organizationZTree.getSelectedNodes()[0];//选中节点
		var paramData = JSON2.parse(param.data);
		if(selectNode.type == USER_TYPE){//重命名用户
			var treeNodes = organizationZTree.getNodesByParam("id",selectNode.id);
			for ( var i = 0; i < treeNodes.length; i++) {
				treeNodes[i].name = paramData.name;
				organizationZTree.updateNode(treeNodes[i]);
			}
		}
		else if(selectNode.type == ORGANIZATION_TYPE){//重命名组织
			selectNode.name = paramData.name;
			organizationZTree.updateNode(selectNode);
		}
		
		$(".blackboard-css").hide();
		$("#renameWin").fadeOut(function(){
			$("#renameWin").remove();
		});
	};
	
	/**
	 * 在组织用户树上修改组织用户节点
	 * @param param 修改节点参数信息
	 * @param _winId 修改窗口id
	 */
	var updateOrganizationNode = function(data,param,_winId){
		var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");//获得zTree对象
		var selectNode = organizationZTree.getSelectedNodes()[0];//选中节点
		var paramData = JSON2.parse(param.data);
		if(selectNode.type == ORGANIZATION_TYPE){
			for ( var key in paramData) {//循环修改节点参数信息
				selectNode[key] = paramData[key];
			}
			organizationZTree.updateNode(selectNode);
		}
		else if(selectNode.type == USER_TYPE){
			var id = selectNode.id;
			var treeNodes = organizationZTree.getNodesByParam("id",id,null);
			for ( var i = 0; i < treeNodes.length; i++) {
				for ( var key in paramData) {//循环修改节点参数信息
					treeNodes[i][key] = paramData[key];
				}
				organizationZTree.updateNode(treeNodes[i]);
			}
		}
		$(".blackboard-css").hide();
		$("#" + _winId).remove();
	};
	
	/**
	 * 在界面上删除组织用户节点
	 * @param data
	 * @returns
	 */
	var deleteOrganizationNode = function(data){
		var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
		var selectNode = organizationZTree.getSelectedNodes()[0];//选中节点
		if (selectNode.type == USER_TYPE){//删除用户
			var id = selectNode.id;
			var treeNodes = organizationZTree.getNodesByParam("id",id,null);
			for ( var i = 0; i < treeNodes.length; i++) {
				var parentNode = treeNodes[i].getParentNode();
				organizationZTree.removeNode(treeNodes[i]);//删除用户节点
				if(!parentNode.isParent){//删除用户节点后，若父节点变为叶子节点，则改变父节点的图标
					parentNode.iconSkin = "icon-organization-single";
					organizationZTree.updateNode(parentNode);
				}
			}
			
		}
		else if(selectNode.type == ORGANIZATION_TYPE){//删除组织
			var rootNode = organizationZTree.getNodeByParam("id",ORGANIZATION_ROOT_ID,null);//获得根节点对象
			var parentNode = selectNode.getParentNode();			
			organizationZTree.removeNode(selectNode);//删除选中组织节点
			if(!parentNode.isParent){//删除选中节点后，若父节点变为叶子节点，则改变父节点的图标
				parentNode.iconSkin = "icon-organization-single";
				organizationZTree.updateNode(parentNode);
			}
			if(data && data.length > 0){
				for ( var i = 0; i < data.length; i++) {//删除组织后，若组织下面的用户不属于其他组织，则将这些用户移至根节点下面
					data[i]["parentId"] = ORGANIZATION_ROOT_ID;
					data[i]["iconSkin"] = "icon-user";
				}
				organizationZTree.addNodes(rootNode,data);
			}							
		}
		organizationRoleData.remove(selectOrganizationNode.id);
		selectOrganizationNode = null;
		unCheckAllRoleNodes();
		
		$(".blackboard-css").hide();
		$("#deleteWin").fadeOut(function(){
			$("#deleteWin").remove();
		});
	};
	
	/**
	 * 解除用户与其父组织之间的关系
	 * @param response
	 * @returns
	 */
	var relieveRelatUserNode = function(response){
		if(response.returnFlag == "-1"){
			$.messager.alert("操作提示", response.data,"info");
		}
		else if(response.returnFlag == "0"){
			var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");//获得zTree对象
			var selectNode = organizationZTree.getSelectedNodes()[0];//选中节点
			var parentNode = selectNode.getParentNode();
			organizationZTree.removeNode(selectNode);//删除用户节点
			if(!parentNode.isParent){//删除用户节点后，若父节点变为叶子节点，则改变父节点的图标
				parentNode.iconSkin = "icon-organization-single";
				organizationZTree.updateNode(parentNode);
			}
		}
		selectOrganizationNode = null;
		unCheckAllRoleNodes();
		$(".blackboard-css").hide();
		$("#deleteWin").fadeOut(function(){
			$("#deleteWin").remove();
		});
	};
	
	/**
	 * 在界面上改变组织包含的用户
	 * @param data 接口返回的需要移至根节点的用户数组
	 * @param param 访问接口传递的组织下包含用户改变数据
	 * @param allUserData 所有用户信息数组
	 */
	var changeOrganizationContainUser = function(data,param,allUserData){
		var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");//获得zTree对象
		var selectNode = organizationZTree.getSelectedNodes()[0];//选中节点
		var rootNode = organizationZTree.getNodeByParam("id",ORGANIZATION_ROOT_ID,null);//获得根节点对象
		var paramData = JSON2.parse(param.data).value;
		for ( var i = 0; i < paramData.length; i++) {//改变选中组织下的用户节点
			if(paramData[i].type == 0){//添加用户
				for ( var j = 0; j < allUserData.length; j++) {
					if(paramData[i].id == allUserData[j].id){
						allUserData[j].iconSkin = "icon-user";
						allUserData[j].parentId = selectNode.id;
						organizationZTree.addNodes(selectNode,[allUserData[j]]);
						break;
					}
				}
			}
			else if(paramData[i].type == 1){//移除用户
				var childrenNodes = selectNode.children;
				for ( var j = 0; j < childrenNodes.length; j++) {
					if(paramData[i].id == childrenNodes[j].id){
						organizationZTree.removeNode(childrenNodes[j]);
						break;
					}
				}
			}
		}
		
		if(!selectNode.isParent && selectNode.iconSkin == "icon-organization-double-s"){//删除用户节点后，若父节点变为叶子节点，则改变父节点的图标
			selectNode.iconSkin = "icon-organization-single-s";
			organizationZTree.updateNode(selectNode);
		}
		else if(selectNode.isParent && selectNode.iconSkin == "icon-organization-single-s"){
			selectNode.iconSkin = "icon-organization-double-s";
			organizationZTree.updateNode(selectNode);
		}
		
		if(data && data.length > 0){//组织下需要移动到根节点的用户
			for ( var i = 0; i < data.length; i++) {
				for ( var j = 0; j < allUserData.length; j++) {
					if(data[i] == allUserData[j].id){
						allUserData[j].iconSkin = "icon-user";
						allUserData[j].parentId = ORGANIZATION_ROOT_ID;
						organizationZTree.addNodes(rootNode,[allUserData[j]]);
						break;
					}
				}
			}
		}
		$(".blackboard-css").hide();
		$("#containUserWin").fadeOut(function(){
			$("#containUserWin").remove();
		});
	};
	
	/**
	 * 在界面上改变用户属于的组织
	 * @param param 访问接口传递的用户所属组织改变数据
	 */
	var changeUserRelieveOrganization = function(param){
		var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");//获得zTree对象
		var selectNode = organizationZTree.getSelectedNodes()[0];//选中节点
		var paramData = JSON2.parse(param.data).value;
		for ( var i = 0; i < paramData.length; i++) {
			var organizationNode = organizationZTree.getNodeByParam("id",paramData[i].id,null);//获得需要改变的组织节点
			if(paramData[i].type == 0){//组织添加用户节点
				if(!organizationNode.isParent){
					organizationNode.iconSkin = "icon-organization-double";
					organizationZTree.updateNode(organizationNode);
				}
				selectNode.iconSkin = "icon-user";
				organizationZTree.copyNode(organizationNode,selectNode,"inner");//将用户节点复制为组织节点的子节点
			}
			else if(paramData[i].type == 1){//组织移除用户节点
				var userNodes = organizationZTree.getNodesByParam("id",selectNode.id,null);//获得所有id为选中用户id的用户节点
				for ( var j = 0; j < userNodes.length; j++) {
					var parentNode = userNodes[j].getParentNode();//获得父亲节点
					if(paramData[i].id == parentNode.id){
						organizationZTree.removeNode(userNodes[j]);
						if(!parentNode.isParent){
							parentNode.iconSkin = "icon-organization-single";
							organizationZTree.updateNode(parentNode);
						}
						break;
					}
				}
			}
		}
		if(organizationZTree.getSelectedNodes().length == 0){//选中节点被移除
			selectOrganizationNode = null;
			unCheckAllRoleNodes();
		}
		
		$(".blackboard-css").hide();
		$("#relieveOrganizationWin").fadeOut(function(){
			$("#relieveOrganizationWin").remove();
		});
	};
		
	/**
	 * 在界面上显示搜索组织用户结果
	 * @param data 接口返回的数据
	 */
	var showSearchOrganizationData = function(data){
		searchOrganizationData = data;
		if(data.length == 0){
			$("#organization_result_span_tip").show();
		}
		else if(data.length > 0){
			var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
			for ( var i = 0; i < data.length; i++) {
				var treeNodes = organizationZTree.getNodesByParam("id",data[i].id);//根据同一id搜索组织用户树，可能搜索出很多用户节点
				for ( var j = 0; j < treeNodes.length; j++) {
					if($("#" + treeNodes[j].tId + "_a").length == 0){//改变搜索结果节点的样式，若节点在界面上还未加载则需要先选中节点
						organizationZTree.selectNode(treeNodes[j]);
					}
					$("#" + treeNodes[j].tId + "_span").addClass("search_node_color");
				}
			}
			if($("#organization_operate").height() < $("#organizationZTree").height()){//判断组织用户树出现滚动条，则将滚动条移动到最上面
				$("#organization_operate").scrollTop(0);
			}
			if(selectOrganizationNode){//搜索组织用户树之后，选中节点要切换回来
				organizationZTree.selectNode(selectOrganizationNode);
			}
			else{//没有选中节点，则取消组织用户树的选中节点选中状态
				organizationZTree.cancelSelectedNode();
			}
		}
	};
	
	/**
	 * 修改用户密码回调函数
	 * @param response 接口返回数据
	 * @returns
	 */
	var updateUserPassword = function(response){
		if(response.returnFlag == "-1"){
			$.messager.alert("操作提示", response.data,"info");
		}
		$(".blackboard-css").hide();
		$("#changePasswordWin").fadeOut(function(){
			$("#changePasswordWin").remove();
		});
	};
	
	/**
	 * 勾选角色节点
	 * @param treeNode 选中的组织用户树节点
	 * @returns
	 */
	var checkRoleNodes = function(treeNode){
		var id = treeNode.id;
		if(id == ORGANIZATION_ROOT_ID){//组织用户树根节点,不勾选角色节点
			return;
		}
		if(organizationRoleData.get(id)){//组织用户角色信息已缓存在map中
			roleView.checkRoleNodes(organizationRoleData.get(id));
		}
		else{
			var type = treeNode.type;
			var param = {data:JSON2.stringify({"id":id})};
			if(type == ORGANIZATION_TYPE){
				organizationService.omGetOrganizationRole(function(data){
					roleView.checkRoleNodes(data);
					organizationRoleData.put(id,data);
				}, param);
			}
			else if(type == USER_TYPE){
				organizationService.omGetUserRole(function(data){
					roleView.checkRoleNodes(data);
					organizationRoleData.put(id,data);
				}, param);
			}
		}
		
	};
	
	/**
	 * 取消所有勾选角色节点
	 * @returns
	 */
	var unCheckAllRoleNodes = function(){
		roleView.unCheckAllRoleNodes();
	};
	
	/**
	 * 将角色赋予组织用户的回调函数
	 * @param param 访问接口传递的组织用户的角色改变数据
	 * @param isShowTip 是否显示保存成功提示框
	 * @returns
	 */
	var awardPermission = function(param,isShowTip){
		var id = JSON2.parse(param.data).id;//改变角色信息的组织用户id
		var paramData = JSON2.parse(param.data).value;//组织用户改变的角色信息数组
		var data = organizationRoleData.get(id);//未改变角色信息之前，组织用户的组织角色信息数组
		for ( var i = 0; i < paramData.length; i++) {
			if(paramData[i].type == 0){//授权
				var json = {"id":paramData[i].id};
				data.push(json);
			}
			else if(paramData[i].type == 1){//取消权利
				for ( var j = 0; j < data.length; j++) {
					if(paramData[i].id == data[j].id){
						data.splice(j,1);
						break;
					}
				}
			}
		}
		organizationRoleData.remove(id);
		organizationRoleData.put(id,data);
		if(isShowTip){
			$.messager.alert("操作提示", "保存成功！","info");
			omTopView.removeOmsaveDisable();
		}
	};
	
	/**
	 * 初始化组织用户树
	 */
	var initOrganizationZTree = function(){
		var setting = {
			async:{
				enable: true,//开启异步加载模式
				url: path + "/ts/omGetOrganizationZTree?",
				autoParam: ["id"]
			},
			data: {
				simpleData: {
					enable: true,//使用简单数据模式
					idKey: "id",
					pIdKey: "parentId",
					rootPId: -2
				}
			},
			view: {
				showLine:false//不显示连线
			},
			callback: {
				onRightClick: onRightClick,//右键回调函数
				onClick: onClick//点击回调函数
				
			}
		};
		
		var zNodes = [{"id":ORGANIZATION_ROOT_ID,"name":"组织","type":0,"parentId":-2,"open":false, "isParent":true,
			"iconSkin":"icon-organization-double"}];//定义zTree根节点
		$.fn.zTree.init($("#organizationZTree"), setting, zNodes);//创建zTree
		var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");//获得zTree对象
		var rootNode = organizationZTree.getNodeByParam("id",ORGANIZATION_ROOT_ID,null);//获得根节点对象
		organizationZTree.expandNode(rootNode,true,false,true);//展开根节点
		
	};
	
	/**
	 * 点击zTree回调函数
	 * @param event
	 * @param treeId
	 * @param treeNode
	 * @returns
	 */
	var onClick = function(event, treeId, treeNode){
		var organizationZTree = $.fn.zTree.getZTreeObj(treeId);//获得zTree对象
		if(selectOrganizationNode){
			if(selectOrganizationNode.id == treeNode.id
					&& selectOrganizationNode.parentId == treeNode.parentId){//点击同一节点
				return;
			}
			if(selectOrganizationNode.type == ORGANIZATION_TYPE){
				if(selectOrganizationNode.isParent){//组织父节点
					selectOrganizationNode.iconSkin = "icon-organization-double";
				}
				else{//组织叶子节点
					selectOrganizationNode.iconSkin = "icon-organization-single";
				}
			}
			else if(selectOrganizationNode.type == USER_TYPE){//用户节点
				selectOrganizationNode.iconSkin = "icon-user";
			}
			organizationZTree.updateNode(selectOrganizationNode);
			omAwardPermission(selectOrganizationNode);//将角色赋予组织用户
			
			unCheckAllRoleNodes();
		}
		else{
			unCheckAllRoleNodes();
		}
		
		selectOrganizationNode = treeNode;
		if(treeNode.type == ORGANIZATION_TYPE){
			if(treeNode.isParent){//组织父节点
				treeNode.iconSkin = "icon-organization-double-s";
			}
			else{//组织叶子节点
				treeNode.iconSkin = "icon-organization-single-s";
			}
		}
		else if(treeNode.type == USER_TYPE){
			treeNode.iconSkin = "icon-user-s";
		}
		organizationZTree.updateNode(treeNode);
		checkRoleNodes(treeNode);
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
			var organizationZTree = $.fn.zTree.getZTreeObj(treeId);//获得zTree对象
			organizationZTree.selectNode(treeNode);//选中右键点击的节点
			onClick(null,treeId,treeNode);//点击右键点击的节点
			var menuId = "";
			
			if(treeNode.type == ORGANIZATION_TYPE){//组织
				menuId = "organization_menu";
			}
			else if(treeNode.type == USER_TYPE){//用户
				menuId = "user_menu";
			}
			
			initMenu(organizationZTree,treeNode,menuId,event);
		}
	};
	
	/**
	 * 将角色赋予组织用户
	 * @treeNode 组织用户节点
	 * @returns
	 */
	var omAwardPermission = function(treeNode){
		var id = treeNode.id;
		if(id == ORGANIZATION_ROOT_ID){//根节点直接返回
			return;
		}
		var changeCheckedRolesData = _organizationView.getChangeCheckedRolesData(treeNode);
		if(changeCheckedRolesData && changeCheckedRolesData.length > 0){
			_organizationView.saveOrganizationPermission(treeNode,changeCheckedRolesData,false);
		}
	};

	/** ********内部属性及方法******** end */
	
	/** 对外提供的函数 */
	/**
	 * 初始化
	 */
	this.init = function(){
		initOrganizationZTree();
	};
	
	/**
	 * 新增组织或者用户节点
	 * @param data 新增节点信息
	 * @param _winId 新增窗口id
	 */
	this.addZTreeNode = function(data,_winId){
		var param = {type:"add",data:JSON2.stringify(data)};
		organizationService.omOperateOrganization(appendOrganizationNode,param,_winId);
	};
	
	/**
	 * 判断用户邮箱是否存在
	 * @param email 邮箱
	 * @param callBack 回调函数
	 */
	this.omUserIsExit = function(email,callBack){
		var param = {data:JSON2.stringify({email:email})};
		organizationService.omUserIsExit(callBack, param);
	};
	
	/**
	 * 重命名组织用户树节点
	 * @param treeNode
	 * @param name
	 */
	this.renameZTreeNode = function(treeNode,name){
		var param = {type:"update",data:JSON2.stringify({id:treeNode.id,name:name,type:treeNode.type})};
		organizationService.omOperateOrganization(renameOrganizationNode, param);
	};

	/**
	 * 修改组织用户树节点
	 * @param treeNode 修改节点
	 * @param data 修改后的节点数据
	 * @param _winId 修改窗口id
	 */
	this.updateZTreeNode = function(treeNode,data,_winId){
		var param = {type:"update",data:JSON2.stringify(data)};
		organizationService.omOperateOrganization(updateOrganizationNode,param,_winId);
	};
	
	/**
	 * 删除组织用户树节点
	 * @@param treeNode 删除节点
	 */
	this.deleteZTreeNode = function(treeNode){
		var param = {type:"delete",data:JSON2.stringify({id:treeNode.id,type:treeNode.type})};
		organizationService.omOperateOrganization(deleteOrganizationNode, param);
	};
	
	/**
	 * 解除用户和组织之间的关系
	 * @param treeNode 解除关系的节点
	 * @param parentNode 解除关系的父节点
	 */
	this.relieveRelatZTreeNode = function(treeNode,parentNode){
		var param = {data:JSON2.stringify({organizationId:parentNode.id,userId:treeNode.id})};
		organizationService.omRemoveRelation(relieveRelatUserNode,param);
	};
	
	/**
	 * 获得组织包含用户数据
	 * @param callBack 返回函数
	 * @param treeNode 选中节点
	 */
	this.omGetUserByOrganization = function(callBack,treeNode){
		var param = {data:JSON2.stringify({organizationId:treeNode.id})};
		organizationService.omGetUserByOrganization(callBack,param);
	};
	
	/**
	 * 改变组织包含的用户
	 * @param treeNode 选中组织节点
	 * @param treeNode 组织节点改变的包含用户数据
	 * @param allUserData 所有用户信息数据
	 */
	this.omChangeOrganizationContainUser = function(treeNode,data,allUserData){
		var param = {data:JSON2.stringify({id:treeNode.id,value:data})};
		organizationService.omOrganizationSelectUser(changeOrganizationContainUser, param, allUserData);
	};

	/**
	 * 获得用户属于的组织
	 * @param callBack 回调函数
	 * @param treeNode 选中的用户节点
	 */
	this.omGetOrganizationByUser = function(callBack,treeNode){
		var param = {data:JSON2.stringify({userId:treeNode.id})};
		organizationService.omGetOrganizationByUser(callBack, param);
	};
	
	/**
	 * 改变用户属于的组织
	 * @param treeNode 选中的用户节点
	 * @param data 用户节点改变的属于组织数据
	 */
	this.omChangeUserRelieveOrganization = function(treeNode,data){
		var param = {data:JSON2.stringify({id:treeNode.id,value:data})};
		organizationService.omUserSelectOrganization(changeUserRelieveOrganization, param);
	};
	
	/**
	 * 修改密码
	 * @param data 用户修改密码数据
	 */
	this.omUpdatePassword = function(data){
		var param = {data:JSON2.stringify(data)};
		organizationService.omUpdatePassword(updateUserPassword, param);
	};
	
	/**
	 * 搜索组织用户
	 * @param name 搜索组织名称
	 */
	this.omSearchOrganization = function(name){
		this.unOmSearchOrganization();
		
		var param = {data:JSON2.stringify({name:name})};
		organizationService.omSerachOrganizationZTree(showSearchOrganizationData, param);
	};
	
	/**
	 * 取消搜索到的组织用户
	 */
	this.unOmSearchOrganization = function(){
		if(searchOrganizationData && searchOrganizationData.length > 0){//有搜索到组织用户
			var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
			for ( var i = 0; i < searchOrganizationData.length; i++) {
				var treeNodes = organizationZTree.getNodesByParam("id",searchOrganizationData[i].id);
				if(treeNodes){
					for ( var j = 0; j < treeNodes.length; j++) {
						$("#" + treeNodes[j].tId + "_span").removeClass("search_node_color");
					}
				}
			}
		}
	};
	
	/**
	 * 获得组织用户节点改变的角色数据
	 * @param treeNode
	 */
	this.getChangeCheckedRolesData = function(treeNode){
		var id = treeNode.id;
		if(id == ORGANIZATION_ROOT_ID){//根节点直接返回
			return;
		}
		var oldCheckedRolesData = organizationRoleData.get(id);//获得保存之前组织用户勾选的角色数组信息
		var changeCheckedRolesData = new Array();
		if(oldCheckedRolesData){
			changeCheckedRolesData = roleView.getChangeCheckedRolesData(oldCheckedRolesData);
		}
		return changeCheckedRolesData;
	};
	
	/**
	 * 保存组织用户权限
	 * @param treeNode
	 * @changeCheckedRolesData //组织用户改变的角色信息
	 * @param isShowTip
	 */
	this.saveOrganizationPermission = function(treeNode,changeCheckedRolesData,isShowTip){
		var id = treeNode.id;
		var type = treeNode.type;
		var param = {"data":JSON2.stringify({"id": id,"type": type,"value":changeCheckedRolesData})};
		organizationService.omAwardPermission(awardPermission, param, isShowTip);
	};
}