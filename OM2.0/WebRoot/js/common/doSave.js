/**
 * 保存功能
 */

/** 点击组织或用户和角色时, 将各自的权限缓存到hashmap中 */
function saveOldFromSelect(DataOld, selectNode, nodes){
	
	var saveData = new Array();
	for(var i=0; i<nodes.length; i++){
		saveData.push({id: nodes[i].id});
	}
	if(DataOld.get(selectNode.id) == null){//将数据缓存到hashmap用于组织切换时调用
		DataOld.put(selectNode.id, saveData);
	}
}

/** 角色切换时, 判断当前角色的资源更改并存储 */
function saveRoleFromResource(selectedRoleNode, roleResourceData, checkSelected){//角色切换时, 不对数据库做出更改
	
	var nodes = $("#resource_groups_ul").tree("getChecked");
	var saveData = new Array();
	var checkedData = new Array();
	
	if (checkSelected == true) {//需要判断选中的
		for(var i=0; i<nodes.length; i++){
			if($('#resource_groups_ul').tree('isLeaf',nodes[i].target)){//叶子节点
				var pnode = $('#resource_groups_ul').tree('getParent',nodes[i].target); //获取当前节点的父节点
				if (!($(pnode.target).find('.tree-checkbox').hasClass('tree-checkbox1'))) {//父节点未选中
					checkedData.push({id: nodes[i].id});
				}
			}
			else {
				var pnode = $('#resource_groups_ul').tree('getParent',nodes[i].target); //获取当前节点的父节点
				if (pnode == null) {
					checkedData.push({id: nodes[i].id});
				}
				else {
					if (!($(pnode.target).find('.tree-checkbox').hasClass('tree-checkbox1'))) {//父节点未选中
						checkedData.push({id: nodes[i].id});
					}
				}
			}
			saveData.push({id: nodes[i].id});
		}
		if(roleResourceCheckData.get(selectedRoleNode.id) != null){//若角色权限被修改则更新hashmap中的数据
			roleResourceCheckData.remove(selectedRoleNode.id);
		}
		roleResourceCheckData.put(selectedRoleNode.id, checkedData);
	}
	else {//不需要，保存时候用
		for(var i=0; i<nodes.length; i++){
			saveData.push({id: nodes[i].id});
		}
	}
	
	if(roleResourceData.get(selectedRoleNode.id) != null){//若角色权限被修改则更新hashmap中的数据
		roleResourceData.remove(selectedRoleNode.id);
	}
	roleResourceData.put(selectedRoleNode.id, saveData);
}

/** 
 * 组织或用户切换时, 先判断当前角色的资源更改情况并存储,
 * 再判断当前组织或用户的角色更改情况并存储
 */
function saveOrganizationFromRole(nodeType, selectedOrganizationNode, organizationRoleData, userRoleData,
		selectedRoleNode, roleResourceData){//组织或用户切换时, 对数据库做出更改
	
	var nodes = $("#role_groups_ul").tree("getChecked");
	var saveData = new Array();
	for(var i=0; i<nodes.length; i++){
		saveData.push({id: nodes[i].id});
	}
	
	//若已选择角色, 则先模拟一次角色切换, 将当前更改的角色信息记录下来
	if(selectedRoleNode != null){
		saveRoleFromResource(selectedRoleNode, roleResourceData);
	}
	
	//判断点击的是组织或用户, 给出不同相应: 1, 用户节点; 0, 组织节点; null: 最上面的根节点
	if(nodeType == 1){
		
		if(userRoleDataOld.get(selectedOrganizationNode.id) == null){//将用户数据缓存到hashmap用于组织切换时调用
			userRoleDataOld.put(selectedOrganizationNode.id, saveData);
		}
		if(userRoleData.get(selectedOrganizationNode.id) != null){//若用户权限被修改则更新hashmap中的数据
			userRoleData.remove(selectedOrganizationNode.id);
		}
		userRoleData.put(selectedOrganizationNode.id, saveData);
		
		//记录指定用户的权限变更
		transportOrganizationRole(selectedOrganizationNode, selectedRoleNode, userRoleData, roleResourceData, 
				userRoleDataOld, roleResourceDataOld);
	}else{
		//若hashmap中对应组织的数据为空, 则直接将数据缓存至hashmap, 方便下次读取
		
		if(organizationRoleDataOld.get(selectedOrganizationNode.id) == null){//将用户数据缓存到hashmap用于组织切换时调用
			organizationRoleDataOld.put(selectedOrganizationNode.id, saveData);
		}
		if(organizationRoleData.get(selectedOrganizationNode.id) != null){//若用户权限被修改则更新hashmap中的数据
			organizationRoleData.remove(selectedOrganizationNode.id);
		}
		organizationRoleData.put(selectedOrganizationNode.id, saveData);
		
		//记录指定组织的权限变更
		transportOrganizationRole(selectedOrganizationNode, selectedRoleNode, organizationRoleData, roleResourceData, 
				organizationRoleDataOld, roleResourceDataOld);
	}
}

/** 读取hashmap中的角色或资源数据 */
function readCheckFromMap(ulTree, data){
	for(var i=0; i<data.length; i++){
		
		ulTree.tree("check",ulTree.tree("find",data[i].id).target);
	}
}

/** 记录指定角色的权限变更 */
function transportRoleResource(resourceOldIds, resourceIds, node, transportType){
	
	var value = '';
	if(JSON2.stringify(resourceOldIds) != JSON2.stringify(resourceIds)){
		
		//分别遍历roleResourceDataOld和roleResourceData, 找出相同元素并去除之
		for(var j=0; j<resourceOldIds.length; j++){
			
			for(var k=0; k<resourceIds.length; k++){
				
				if(resourceOldIds[j].id == resourceIds[k].id){
					resourceOldIds.splice(j,1);
					resourceIds.splice(k,1);
					j--;
					k--;
					break;
				}
			}
		}
		
		//若切换时角色的权限被更改, 则记录之
		for(var j=0; j<resourceOldIds.length; j++){
				
			if(j == 0){
				value = '{"id":'+resourceOldIds[j].id+',"type":1}';
			}else{
				value += ',{"id":'+resourceOldIds[j].id+',"type":1}';
			}
		}
		
		for(var j=0; j<resourceIds.length; j++){
			
			if(j == 0){
				if(resourceOldIds.length == 0){
					value = '{"id":'+resourceIds[j].id+',"type":0}';
				}else{
					value += ',{"id":'+resourceIds[j].id+',"type":0}';
				}
			}else{
				value += ',{"id":'+resourceIds[j].id+',"type":0}';
			}
		}
		
		roleResourceValue.put(node.id, value);
		
		if(transportType == 1){
			var data = '{"id":'+node.id+',"value":['+value+']}';
			var url = contextPath + '/ts/omAwardResource?data='+data;
//			alert("url---"+url);
			operateServerData(url, roles, omSaveSuccess);
		}
	}else{
	}
	function omSaveSuccess() {
		alert("保存成功");
	}
}

/** 记录组织或用户的权限变更 */
function transportOrganizationRole(selectedOrganizationNode_T, selectedRoleNode_T, organizationRoleData_T, roleResourceData_T, 
		organizationRoleDataOld_T, roleResourceDataOld_T){
	
	//若已选择角色, 则先记录指定角色的权限变更
	if(selectedRoleNode_T != null){
		
		var resourceOldIds = roleResourceDataOld_T.get(selectedRoleNode_T.id).slice(0);
		var resourceIds = roleResourceData_T.get(selectedRoleNode_T.id).slice(0);
		transportRoleResource(resourceOldIds, resourceIds, selectedRoleNode_T, 0);
	}
	
	var roleOldIds = organizationRoleDataOld_T.get(selectedOrganizationNode_T.id).slice(0);
	var roleIds = organizationRoleData_T.get(selectedOrganizationNode_T.id).slice(0);
	
	var value = '';
	var innerValue = '';
	
	if(JSON2.stringify(roleOldIds) != JSON2.stringify(roleIds) || roleResourceValue.keys().length != 0){
		
		//分别遍历roleOldIds和roleIds, 找出相同元素并去除之
		for(var j=0; j<roleOldIds.length; j++){
			
			for(var k=0; k<roleIds.length; k++){
				
				if(roleOldIds[j].id == roleIds[k].id){
					//若只改动角色下的资源, 则保留该组织下的角色更改
					if(!roleResourceValue.containsKey(roleOldIds[j].id)){
						roleOldIds.splice(j,1);
						roleIds.splice(k,1);
						j--;
						k--;
					}else{
						roleOldIds.splice(j,1);
						j--;
					}
					break;
				}
			}
		}
		
		//若切换时角色的权限被更改, 则记录之
		for(var j=0; j<roleOldIds.length; j++){
			if(roleResourceValue.get(roleOldIds[j].id) != null){
				innerValue = roleResourceValue.get(roleOldIds[j].id);
			}
			if(j == 0){
				value = '{"id":'+roleOldIds[j].id+',"type":1,"value":['+innerValue+']}';
			}else{
				value += ',{"id":'+roleOldIds[j].id+',"type":1,"value":['+innerValue+']}';
			}
		}
		
		for(var j=0; j<roleIds.length; j++){
			
			if(roleResourceValue.get(roleIds[j].id) != null){
				innerValue = roleResourceValue.get(roleIds[j].id);
			}
			if(j == 0){
				if(roleOldIds.length == 0){
					value = '{"id":'+roleIds[j].id+',"type":0,"value":['+innerValue+']}';
				}else{
					value += ',{"id":'+roleIds[j].id+',"type":0,"value":['+innerValue+']}';
				}
			}else{
				value += ',{"id":'+roleIds[j].id+',"type":0,"value":['+innerValue+']}';
			}
		}
		
		//organization之间的切换时, 需要调用相应接口进行存储
		var data = '{"id":'+selectedOrganizationNode_T.id+',"type":'+selectedOrganizationNode_T.attributes.type+',"value":['+value+']}';
		var url = contextPath + '/ts/omAwardPermission?data='+data;
//		alert("url---"+url);
		operateServerData(url, organizations);
	}else{
	}
}

/** 对比并存储角色下的资源权限 */
function AwardResource(){
	if(selectedRoleNode != null){
		var nodesData = new Array();
		var nodes = roleResourceData.get(selectedRoleNode.id);
		var AwardResourceResult = new Array();
		var resourcesPermissionDataCopy = resourcesPermissionData.slice(0);
		
		for(var i=0; i<nodes.length; i++){
			var target = $("#resource_groups_ul").tree("find",nodes[i].id).target;
			var checkboxes = $(target).children(".operate-div").children(".opertate-tree-checkbox");
			
			var a=0, b=0, c=0, d=0;
			if($(checkboxes[0]).attr("class") =='opertate-tree-checkbox operate-tree-checkbox0'){
				a = 0;
			}else if($(checkboxes[0]).attr("class") =='opertate-tree-checkbox operate-tree-checkbox1'){
				a = 8;
			}
			if($(checkboxes[1]).attr("class") =='opertate-tree-checkbox operate-tree-checkbox0'){
				b = 0;
			}else if($(checkboxes[1]).attr("class") =='opertate-tree-checkbox operate-tree-checkbox1'){
				b = 4;
			}
			if($(checkboxes[2]).attr("class") =='opertate-tree-checkbox operate-tree-checkbox0'){
				c = 0;
			}else if($(checkboxes[2]).attr("class") =='opertate-tree-checkbox operate-tree-checkbox1'){
				c = 2;
			}
			if($(checkboxes[3]).attr("class") =='opertate-tree-checkbox operate-tree-checkbox0'){
				d = 0;
			}else if($(checkboxes[3]).attr("class") =='opertate-tree-checkbox operate-tree-checkbox1'){
				d = 1;
			}
			nodesData.push({id: nodes[i].id, permission: parseInt(parseInt((a+b+c+d),10).toString(2))});
		}
		resourcesPermissionData = nodesData.slice(0);
		for(var i=0; i<resourcesPermissionDataCopy.length; i++){
			for(var j=0; j<nodesData.length; j++){
				if(resourcesPermissionDataCopy[i].id == nodesData[j].id){
					if(resourcesPermissionDataCopy[i].permission != nodesData[j].permission){
						AwardResourceResult.push({id: nodesData[j].id, type: 0, permission: nodesData[j].permission});
					}
					resourcesPermissionDataCopy.splice(i,1);
					nodesData.splice(j,1);
					i--;
					j--;
					break;
				}
			}
		}
		for(var i=0; i<resourcesPermissionDataCopy.length; i++){
			AwardResourceResult.push({id: resourcesPermissionDataCopy[i].id, type: 1, permission: 0});
		}
		for(var j=0; j<nodesData.length; j++){
			AwardResourceResult.push({id: nodesData[j].id, type: 0, permission: nodesData[j].permission});
		}
		
		//调用接口
		if(AwardResourceResult.length != 0){
			var value = '';
			for(var i=0; i<AwardResourceResult.length; i++){
				if(i == 0){
					value += '{id:'+AwardResourceResult[i].id+',type:'+AwardResourceResult[i].type+',permission:'+AwardResourceResult[i].permission+'}';
				}else{
					value += ',{id:'+AwardResourceResult[i].id+',type:'+AwardResourceResult[i].type+',permission:'+AwardResourceResult[i].permission+'}';
				}
			}
			var url = contextPath + '/ts/omAwardResource?data={id:'+selectedRoleNode.id+',value:['+value+']}';
			operateServerData(url, resources);
		}
	}
}

/** 存储数据之后清理所有hashmap */
function cleanHashmap(){
	
	organizationRoleDataOld.clear();
	userRoleDataOld.clear();
	roleResourceDataOld.clear();
	
	organizationRoleDataOld = organizationRoleDataOld.clone(organizationRoleData);
	userRoleDataOld = userRoleDataOld.clone(userRoleData);
	roleResourceDataOld = roleResourceDataOld.clone(roleResourceData);

	roleResourceValue.clear();
}
