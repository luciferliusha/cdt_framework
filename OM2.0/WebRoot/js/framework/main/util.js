/**
*一些公用的方法
*/

/**
 * 判断含有提示信息的输入框是否为空
 * @param _target 输入框的jquery对象
 * @return true表示输入框为空
 */
function isHintInputEmpty(_target){
	var defaultValue = _target.attr("defaultValue");
	if($.trim(_target.val()) == defaultValue 
			&& _target.hasClass("input_hint")){
		return true;
	}
	return false;
}

/**
 * 获得zTree中某个节点的所有父节点信息
 * @param treeNode ztree节点
 * @param treeId ztree整棵树Id
 * @param rootId ztree根节点id
 * @param parentNodeArr 保存节点的父节点信息数组
 */
function getZTreeAllParentNodes(treeNode, treeId, rootId, parentNodesArr){
	if(treeNode.id == rootId){//根节点，没有父亲节点，直接返回
		return;
	}
	var parentNode = treeNode.getParentNode();
	parentNodesArr.push(parentNode);
	if(parentNode.id != rootId){
		getZTreeAllParentNodes(parentNode, treeId, rootId, parentNodesArr);
	}
}

/**
 * 获得zTree中某个节点的所有子节点信息
 * @param treeNode ztree节点
 * @param treeId ztree整棵树Id
 * @param rootId ztree根节点id
 * @param childrenNodesArr 保存节点的子节点信息数组
 */
function getZTreeAllChildrenNodes(treeNode, treeId, rootId, childrenNodesArr){
	if(!treeNode.isParent){//叶子节点，直接返回
		return;
	}
	var childrenNodes = treeNode.children;
	for ( var i = 0; i < childrenNodes.length; i++) {
		childrenNodesArr.push(childrenNodes[i]);
		if(childrenNodes[i].isParent){
			getZTreeAllChildrenNodes(childrenNodes[i], treeId, rootId, childrenNodesArr);
		}
	}
}