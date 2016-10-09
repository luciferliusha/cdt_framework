/**
 * 资源树View
 */
function ResourceView(){
	/** ********内部属性及方法******** start */
	var RESOURCE_ROOT_ID = 0;//资源树根节点id
	var selectResourceNode = null;//选中的角色树节点
	var resourceService = new ResourceService();
	var searchResourceData = null;//搜索资源返回的数据
	var saveRoleNode = null;//需要保存的角色节点
	
	/**
	 * 在界面上新增资源节点
	 * @data 接口返回的资源节点id
	 * @param 新增节点参数信息
	 */
	var appendResourceNode = function(data,param){
		var resourceZTree = $.fn.zTree.getZTreeObj("resourceZTree");
		var parentNode = resourceZTree.getSelectedNodes()[0];//父节点
		var paramData = JSON2.parse(param.data);
		var checked = false;//
		if(parentNode.checked && !parentNode.getCheckStatus().half){
			checked = true;
		}
		var newResourceNodes = [{"id":data,"name":paramData.name + "(" + paramData.no + ")","no":paramData.no,"status":paramData.status,
			"parentId":parentNode.id,"iconSkin":"icon-resource-single","checked":checked}];//新增节点信息
		if(!parentNode.isParent){//父节点是叶子节点，改变父节点的图标
			parentNode.iconSkin = "icon-resource-double-s";
			resourceZTree.updateNode(parentNode);
		}
		resourceZTree.addNodes(parentNode,newResourceNodes);//新增角色节点
		
		$(".blackboard-css").hide();
		$("#newResourceWin").fadeOut(function(){
			$("#newResourceWin").remove();
		});
	};
	
	/**
	 * 在界面上更新资源节点（重命名）
	 * @data 接口返回的数据
	 * @param 重命名节点参数信息
	 */
	var updateResourceNode = function(data,param){
		var resourceZTree = $.fn.zTree.getZTreeObj("resourceZTree");
		var selectNode = resourceZTree.getSelectedNodes()[0];//选中节点		
		var paramData = JSON2.parse(param.data);
		selectNode.name = paramData.name + "(" + paramData.no + ")";
		selectNode.no = paramData.no;
		resourceZTree.updateNode(selectNode);
		
		$(".blackboard-css").hide();
		$("#newResourceWin").fadeOut(function(){
			$("#newResourceWin").remove();
		});
	};
	
	/**
	 * 在界面上删除资源节点
	 * @data 接口返回的数据
	 * @param 删除节点参数信息
	 */
	var deleteResourceNode = function(data,param){
		var resourceZTree = $.fn.zTree.getZTreeObj("resourceZTree");
		var selectNode = resourceZTree.getSelectedNodes()[0];//选中节点	
		var parentNode = selectNode.getParentNode();
		resourceZTree.removeNode(selectNode);//删除选中节点
		if(!parentNode.isParent){//删除选中节点后，若父节点变为叶子节点，则改变父节点的图标
			parentNode.iconSkin = "icon-resource-single";
			resourceZTree.updateNode(parentNode);
		}
		
		selectResourceNode = null;
		$(".blackboard-css").hide();
		$("#deleteWin").fadeOut(function(){
			$("#deleteWin").remove();
		});
	};
	
	/**
	 * 在界面上显示搜索资源结果
	 * @param data 接口返回的数据
	 */
	var showSearchResourceData = function(data){
		searchResourceData = data;
		if(data.length == 0){
			$("#resource_result_span_tip").show();
		}
		else if(data.length > 0){
			var resourceZTree = $.fn.zTree.getZTreeObj("resourceZTree");
			for ( var i = 0; i < data.length; i++) {
				var treeNode = resourceZTree.getNodeByParam("id",data[i].id);
					
				if($("#" + treeNode.tId + "_a").length == 0){//改变搜索结果节点的样式，若节点在界面上还未加载则需要先选中节点
					resourceZTree.selectNode(treeNode);
				}
						
				$("#" + treeNode.tId + "_span").addClass("search_node_color");				
			}
			if($("#resource_operate").height() < $("#resourceZTree").height()){//判断资源树出现滚动条，则将滚动条移动到最上面
				$("#resource_operate").scrollTop(0);
			}
			if(selectResourceNode){//搜索资源树之后，选中节点要切换回来
				resourceZTree.selectNode(selectResourceNode);
			}
			else{//没有选中节点，则取消资源树的选中节点选中状态
				resourceZTree.cancelSelectedNode();
			}
		}
	};
	
	/**
	 * 初始化资源树
	 */
	var initResourceZTree = function(){
		var setting = {
				async:{
					enable: true,//开启异步加载模式
					url: path + "/ts/omGetResourceZTree?",
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
					showLine: false,//不显示连线
					addHoverDom: addHoverDom,//鼠标移入节点事件
					removeHoverDom: removeHoverDom//鼠标移出节点事件
				},
				callback: {
					onRightClick: onRightClick,//右键回调函数
					onClick: onClick,//点击回调函数
					onCheck: onCheck//勾选回调函数
				}
			};
			
			var zNodes = [{"id":RESOURCE_ROOT_ID,"name":"资源","parentId":-1,"open":false, "isParent":true,
				"iconSkin":"icon-resource-double"}];//定义zTree根节点
			$.fn.zTree.init($("#resourceZTree"), setting, zNodes);//创建zTree
			var resourceZTree = $.fn.zTree.getZTreeObj("resourceZTree");//获得zTree对象
			var rootNode = resourceZTree.getNodeByParam("id",RESOURCE_ROOT_ID,null);//获得根节点对象
			resourceZTree.expandNode(rootNode,true,false,true);//展开根节点
		
	};

	/**
	 * 鼠标移入节点事件
	 * @param treeId
	 * @param treeNode
	 * @returns
	 */
	var addHoverDom = function(treeId,treeNode){
		if(treeNode.id == RESOURCE_ROOT_ID){//根节点直接返回
			return;
		}

		if ($("#"+treeNode.tId + "_operate").length>0){//已添加操作列表，直接显示
			$("#"+treeNode.tId + "_operate").show();
			return;
		}		
		var obj = $("#" + treeNode.tId + "_a");
		var _resource_operate_div = "<div id='" + treeNode.tId + "_operate' class='resource_operate_div'>" +
			"<span class='resource_operate_checkbox resource_operate_checkbox_false_full'></span><span>增</span>"+ 
			"<span class='resource_operate_checkbox resource_operate_checkbox_false_full'></span><span>删</span>" + 
			"<span class='resource_operate_checkbox resource_operate_checkbox_false_full'></span><span>改</span>" + 
			"<span class='resource_operate_checkbox resource_operate_checkbox_false_full'></span><span>查</span></div>";		
		obj.append(_resource_operate_div);
		
		if(!($._data($("#"+treeNode.tId + "_operate .resource_operate_checkbox").get(0), "events") != undefined
				&& $._data($("#"+treeNode.tId + "_operate .resource_operate_checkbox").get(0), "events")["click"] != undefined)){//
			$("#"+treeNode.tId + "_operate .resource_operate_checkbox").bind("click",function(){//点击节点操作项
				if(treeNode.checked && !treeNode.getCheckStatus().half){//节点选中且不是半勾选时，点击节点操作项
					if($(this).hasClass("resource_operate_checkbox_false_full")){//打钩
						$(this).removeClass("resource_operate_checkbox_false_full");
						$(this).addClass("resource_operate_checkbox_true_full");
					}
					else if($(this).hasClass("resource_operate_checkbox_true_full")){//取消打钩
						$(this).removeClass("resource_operate_checkbox_true_full");
						$(this).addClass("resource_operate_checkbox_false_full");
					}
				}
			});
		}
		if(treeNode.checked && !treeNode.getCheckStatus().half){
			//资源节点增加增删改查
			if(saveRoleNode){
				var treeNodesData = roleView.getRoleResourceArr(saveRoleNode);
				if(treeNodesData){
					for ( var i = 0; i < treeNodesData.length; i++) {
						if(treeNodesData[i].id == treeNode.id){
							resourcePermission(treeNode,treeNodesData[i].permission);
						}
					}
				}
			}			
		}	
	};
	
	/**
	 * 鼠标移出节点事件
	 * @param treeId
	 * @param treeNode
	 * @returns
	 */
	var removeHoverDom = function(treeId,treeNode){
		if($("#" + treeNode.tId + "_operate").is(":visible")){
			$("#" + treeNode.tId + "_operate").hide();
		}
	};
	
	/**
	 * 点击zTree回调函数
	 * @param event
	 * @param treeId
	 * @param treeNode
	 * @returns
	 */
	var onClick = function(event, treeId, treeNode){
		var resourceZTree = $.fn.zTree.getZTreeObj(treeId);//获得zTree对象
		if(selectResourceNode){
			if(selectResourceNode.id == treeNode.id){//点击同一节点
				return;
			}
			if(selectResourceNode.isParent){//父亲节点
				selectResourceNode.iconSkin = "icon-resource-double";				
			}
			else{
				selectResourceNode.iconSkin = "icon-resource-single";
			}
			resourceZTree.updateNode(selectResourceNode);			
		}
		
		selectResourceNode = treeNode;
		if(treeNode.isParent){
			treeNode.iconSkin = "icon-resource-double-s";
		}
		else{
			treeNode.iconSkin = "icon-resource-single-s";
		}
		resourceZTree.updateNode(treeNode);
		
	};
	
	/**
	 * 勾选zTree回调函数
	 * @param event
	 * @param treeId
	 * @param treeNode
	 */
	var onCheck = function(event, treeId, treeNode){		
		if(!treeNode.checked){//节点取消勾选状态
			unResourcePermission(treeNode);//取消节点的权限
			unParentNodesPermission(treeNode, treeId);//取消节点所有父节点的增删改查
			unChildrenNodesPermission(treeNode, treeId);//取消该节点所有子节点的增删改查			
		}
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
			var resourceZTree = $.fn.zTree.getZTreeObj(treeId);//获得zTree对象
			resourceZTree.selectNode(treeNode);//选中右键点击的节点
			onClick(null,treeId,treeNode);//点击右键点击的节点
			var menuId = "resource_menu";

			initMenu(resourceZTree,treeNode,menuId,event);
		}

	};
	
	/**
	 * 资源节点增加增删改查
	 * @param treeNode 资源树节点
	 * @param permission 增删改查权限 例如:1100
	 * @returns
	 */
	var resourcePermission = function(treeNode,permission){
		var obj = $("#" + treeNode.tId + "_a");
		if(obj.children(".resource_operate_div").length > 0){
			var _checkboxes = obj.children(".resource_operate_div").children(".resource_operate_checkbox");
			permission = parseInt(permission, 2);
			var temp = permission&0x08;//判断有'增'权限
			if(temp == 0x08){
				$(_checkboxes[0]).removeClass("resource_operate_checkbox_false_full");
				$(_checkboxes[0]).addClass("resource_operate_checkbox_true_full");
			}
			temp = permission&0x04;//判断有'删'权限
			if(temp == 0x04){
				$(_checkboxes[1]).removeClass("resource_operate_checkbox_false_full");
				$(_checkboxes[1]).addClass("resource_operate_checkbox_true_full");
			}
			
			temp = permission&0x02;//判断有'改'权限
			if(temp == 0x02){
				$(_checkboxes[2]).removeClass("resource_operate_checkbox_false_full");
				$(_checkboxes[2]).addClass("resource_operate_checkbox_true_full");
			}
			
			temp = permission&0x01;//判断有'查'权限
			if(temp == 0x01){
				$(_checkboxes[3]).removeClass("resource_operate_checkbox_false_full");
				$(_checkboxes[3]).addClass("resource_operate_checkbox_true_full");
			}
		}
	};
	
	/**
	 * 取消资源节点增删改查
	 * @param treeNode 资源树节点
	 * @returns
	 */
	var unResourcePermission = function(treeNode){
		var obj = $("#" + treeNode.tId + "_a");
		if(obj.children(".resource_operate_div").length > 0){
			var _checkboxes = obj.children(".resource_operate_div").children(".resource_operate_checkbox");
			for ( var i = 0; i < _checkboxes.length; i++) {
				if($(_checkboxes[i]).hasClass("resource_operate_checkbox_true_full")){
					$(_checkboxes[i]).removeClass("resource_operate_checkbox_true_full");
					$(_checkboxes[i]).addClass("resource_operate_checkbox_false_full");
				}
			}
		}
	};
	
	/**
	 * 获得资源节点的增删改查
	 * @param treeNode 资源树节点
	 * @returns
	 */
	var getResourcePermission = function(treeNode){
		var obj = $("#" + treeNode.tId + "_a");
		var permission = 0;
		if(obj.children(".resource_operate_div").length > 0){//界面上有操作增删改查 div
			var _checkboxes = obj.children(".resource_operate_div").children(".resource_operate_checkbox");
			var a=0, b=0, c=0, d=0;
			if($(_checkboxes[0]).hasClass("resource_operate_checkbox_true_full")){
				a = 8;
			}
			else if($(_checkboxes[0]).hasClass("resource_operate_checkbox_false_full")){
				a = 0;
			}
			if($(_checkboxes[1]).hasClass("resource_operate_checkbox_true_full")){
				b = 4;
			}
			else if($(_checkboxes[1]).hasClass("resource_operate_checkbox_false_full")){
				b = 0;
			}
			if($(_checkboxes[2]).hasClass("resource_operate_checkbox_true_full")){
				c = 2;
			}
			else if($(_checkboxes[2]).hasClass("resource_operate_checkbox_false_full")){
				c = 0;
			}
			if($(_checkboxes[3]).hasClass("resource_operate_checkbox_true_full")){
				d = 1;
			}
			else if($(_checkboxes[3]).hasClass("resource_operate_checkbox_false_full")){
				d = 0;
			}
			
			permission = parseInt(parseInt((a+b+c+d),10).toString(2));
		}
		else{
			if(saveRoleNode){
				var treeNodesData = roleView.getRoleResourceArr(saveRoleNode);
				for ( var i = 0; i < treeNodesData.length; i++) {
					if(treeNodesData[i].id == treeNode.id){
						permission = treeNodesData[i].permission;
						break;
					}
				}
			}
		}
		return permission;
	};
	
	/**
	 * 取消节点所有父节点的增删改查
	 * @param treeNode
	 * @param treeId
	 * @returns
	 */
	var unParentNodesPermission = function(treeNode,treeId){
		var parentNodes = new Array();//节点所有父亲节点
		getZTreeAllParentNodes(treeNode, treeId, RESOURCE_ROOT_ID, parentNodes);
		for ( var i = 0; i < parentNodes.length; i++) {
			unResourcePermission(parentNodes[i]);
		}
	};
	
	/**
	 * 取消节点所有子节点的增删改查
	 * @param treeNode
	 * @param treeId
	 * @returns
	 */
	var unChildrenNodesPermission = function(treeNode,treeId){
		var childrenNodes = new Array();//节点所有孩子节点
		getZTreeAllChildrenNodes(treeNode, treeId, RESOURCE_ROOT_ID, childrenNodes);
		for ( var i = 0; i < childrenNodes.length; i++) {
			unResourcePermission(childrenNodes[i]);
		}
	};
	/** ********内部属性及方法******** end */
	/**
	 * 初始化
	 */
	this.init = function(){
		initResourceZTree();
	};
	
	/**
	 * 新增资源树节点
	 * @param data 新增节点json信息 
	 */
	this.addZTreeNode = function(data){		
		var param = {type:"add",data:JSON2.stringify(data)};
		resourceService.omOperateResource(appendResourceNode, param);
	};
	
	/**
	 * 更新资源树节点
	 * @param data 更新节点json信息 
	 */
	this.updateZTreeNode = function(data){
		var param = {type:"update",data:JSON2.stringify(data)};
		resourceService.omOperateResource(updateResourceNode, param);
	};
	
	/**
	 * 删除资源树节点
	 * @treeNode 删除节点
	 */
	this.deleteZTreeNode = function(treeNode){
		var param = {type:"delete",data:JSON2.stringify({id:treeNode.id})};
		resourceService.omOperateResource(deleteResourceNode,param);
	};
	
	/**
	 * 勾选资源节点
	 * @param treeNodesData 勾选的资源节点数组
	 * @param selectRoleNode 选中的角色节点
	 */
	this.checkResourceNodes = function(treeNodesData,selectRoleNode){
		var resourceZTree = $.fn.zTree.getZTreeObj("resourceZTree");//获得zTree对象
		for ( var i = 0; i < treeNodesData.length; i++) {
			var treeNode = resourceZTree.getNodeByParam("id",treeNodesData[i].id);
			resourceZTree.checkNode(treeNode, true, true,false);
			
			resourcePermission(treeNode,treeNodesData[i].permission);	
		}
		this.setSaveRoleNode(selectRoleNode);
	};
	
	/**
	 * 取消勾选所有资源节点
	 */
	this.unCheckAllResourceNodes = function(){
		var resourceZTree = $.fn.zTree.getZTreeObj("resourceZTree");//获得zTree对象
		var checkedNodes = resourceZTree.getCheckedNodes(true);
		for ( var i = 0; i < checkedNodes.length; i++) {//取消资源节点的增删改查
			unResourcePermission(checkedNodes[i]);
		}
		resourceZTree.checkAllNodes(false);
	};
			
	/**
	 * 搜索资源
	 * @param name 搜索资源名称
	 */
	this.omSearchResource = function(name){
		this.unOmSearchResource();
		
		var param = {data:JSON2.stringify({name:name})};
		resourceService.omSearchResource(showSearchResourceData, param);
	};
	
	/**
	 * 取消搜索到的资源样式
	 */
	this.unOmSearchResource = function(){
		if(searchResourceData && searchResourceData.length > 0){//有搜索到角色
			var resourceZTree = $.fn.zTree.getZTreeObj("resourceZTree");
			for ( var i = 0; i < searchResourceData.length; i++) {				
				var treeNode = resourceZTree.getNodeByParam("id",searchResourceData[i].id);
				if(treeNode){
					$("#" + treeNode.tId + "_span").removeClass("search_node_color");
				}
			}
		}
	};
	
	/**
	 * 判断资源编号是否存在
	 * @param callBack 回调函数
	 * @param no 资源编号
	 */
	this.omCheckNoIsExit = function(callBack,no){
		var param = {data:JSON2.stringify({no:no})};
		resourceService.omCheckNoIsExit(function(ret){
			if(callBack){
				var flag = ret.returnFlag == 0?true:false;
				callBack(flag);
			}
		}, param);
	};
	
	/**
	 * 获得角色的资源改变数据数组
	 * @param oldCheckedResourcesData 保存之前角色勾选的资源数组信息
	 */
	this.getChangeCheckedResourcesData = function(oldCheckedResourcesData){
		var resourceZTree = $.fn.zTree.getZTreeObj("resourceZTree");
		var checkedNodes = resourceZTree.getCheckedNodes(true);
		var changeResourcesData = new Array();//存放改变了的角色的资源信息数组
		//去掉勾选资源数组信息中的半勾选资源信息
		for ( var i = 0; i < checkedNodes.length; i++) {
			if(checkedNodes[i].getCheckStatus().half){//节点半选中状态
				checkedNodes.splice(i,1);
				i--;
			}
		}
		
		if(oldCheckedResourcesData.length == 0 && checkedNodes.length == 0){//保存前后都没有资源信息
			return changeResourcesData;
		}
		
		//判断角色新增的资源信息
		if(oldCheckedResourcesData.length == 0){//角色的资源保存之前没有勾选资源信息
			for ( var i = 0; i < checkedNodes.length; i++) {
				var permission = getResourcePermission(checkedNodes[i]);
				var json = {"id":checkedNodes[i].id,"type":0,"permission":permission};
				changeResourcesData.push(json);
			}
		}
		else{
			for ( var i = 0; i < checkedNodes.length; i++) {
				for ( var j = 0; j < oldCheckedResourcesData.length; j++) {
					var permission = getResourcePermission(checkedNodes[i]);
					if(checkedNodes[i].id == oldCheckedResourcesData[j].id){
						if(permission == oldCheckedResourcesData[j].permission){//勾选的节点没有变化
						}
						else{//都有此资源节点，但是权限已改变
							var json = {"id":checkedNodes[i].id,"type":0,"permission":permission};
							changeResourcesData.push(json);
						}
						break;
					}
					if(j == oldCheckedResourcesData.length -1){
						var json = {"id":checkedNodes[i].id,"type":0,"permission":permission};
						changeResourcesData.push(json);
					}
				}
			}
		}
		
		//判断角色减少的资源信息
		if(checkedNodes.length == 0){//角色的资源保存之后没有勾选资源信息
			for ( var i = 0; i < oldCheckedResourcesData.length; i++) {
				var json = {"id":oldCheckedResourcesData[i].id,"type":1};
				changeResourcesData.push(json);
			}
		}
		else{
			for ( var i = 0; i < oldCheckedResourcesData.length; i++) {
				for ( var j = 0; j < checkedNodes.length; j++) {
					if(oldCheckedResourcesData[i].id == checkedNodes[j].id){
						break;
					}
					if(j == checkedNodes.length -1){
						var json = {"id":oldCheckedResourcesData[i].id,"type":1};
						changeResourcesData.push(json);
					}					
				}
			}
		}
		
		return changeResourcesData;
	};
	
	/**
	 * 设置需要保存的角色树节点
	 */
	this.setSaveRoleNode = function(roleNode){
		saveRoleNode = roleNode;
	};
}