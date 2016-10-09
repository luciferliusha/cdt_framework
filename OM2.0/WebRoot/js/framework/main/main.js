/**
 * 程序入口
 */
var omTopView;
var windowView;
var organizationView;
var roleView;
var resourceView;
$(function(){
	omTopView = new OmTopView();
	organizationView = new OrganizationView();
	roleView = new RoleView();
	resourceView = new ResourceView();
	windowView = new WindowView();
	omTopView.init();	
	organizationView.init();	
	roleView.init();
	resourceView.init();
	
	bindEasyUiMenuEvent();
});

/**
 * 绑定zTree操作列表事件
 */
function bindEasyUiMenuEvent(){
	$(".easyui-menu .menu-item").height("31px");
	
	var menus = ["add","rename","move","relieve","contain","trash"];//操作列表数组
	$(".easyui-menu .menu-item").hover(function(){
		var _icon = $(this).find(".menu-icon");//图标对象
		for ( var i = 0; i < menus.length; i++) {
			if(_icon.hasClass("icon-" + menus[i] +"-n")){
				_icon.removeClass("icon-" + menus[i] +"-n");
				_icon.addClass("icon-" + menus[i] +"-f");
				break;
			}
		}
	},function(){
		var _icon = $(this).find(".menu-icon");//图标对象
		for ( var i = 0; i < menus.length; i++) {
			if(_icon.hasClass("icon-" + menus[i] +"-f")){
				_icon.removeClass("icon-" + menus[i] +"-f");
				_icon.addClass("icon-" + menus[i] +"-n");
				break;
			}
		}
	});
}

/**
 * 初始化菜单
 * @param treeNode
 * @param menuId
 * @param event
 * @returns
 */
var initMenu = function(zTree,treeNode,menuId,event){
	if(treeNode.isParent && !treeNode.open){//判断节点是父节点且节点未展开
		zTree.expandNode(treeNode,true,false,true);//展开节点
	}

	$("#" + menuId).menu('show',{
		left: event.clientX,
		top: event.clientY
	});

	if(treeNode.getParentNode() == null){//根节点，禁用功能
		var menus = [{"name":"重命名","iconCls":"icon-rename-d"},
		             {"name":"添加用户","iconCls":"icon-contain-d"},
		             {"name":"删除","iconCls":"icon-trash-d"},
		             {"name":"详细信息"}];//禁用功能json数组数据
		for ( var i = 0; i < menus.length; i++) {
			var item = $('#' + menuId).menu('findItem',menus[i].name);
			if(item && !item.disabled){
				$('#' + menuId).menu('disableItem',item.target);
				if(menus[i].iconCls){
					$('#' + menuId).menu('setIcon',{target:item.target,iconCls:menus[i].iconCls});//更换图标
				}
				$(item.target).children(".menu-text").addClass("menu-text-disabled");//修改文字颜色					
			}
		}
	}
	else{//其他节点，启用功能
		var menus= [{"name":"重命名","iconCls":"icon-rename-n"},
					{"name":"添加用户","iconCls":"icon-contain-n"},
					{"name":"删除","iconCls":"icon-trash-n"},
					{"name":"详细信息"}];//启用功能json数组数据
		for ( var i = 0; i < menus.length; i++) {
			var item = $('#' + menuId).menu('findItem',menus[i].name);
			if(item && item.disabled){
				$('#' + menuId).menu('enableItem',item.target);
				if(menus[i].iconCls){
					$('#' + menuId).menu('setIcon',{target:item.target,iconCls:menus[i].iconCls});
				}
				$(item.target).children(".menu-text").removeClass("menu-text-disabled");
			}
		}
	}
};

/**
 * 新增树节点
 * @param treeId
 */
function appendOmNode(treeId){
	switch (treeId) {
		case "organizationZTree"://组织用户树
			windowView.initNewChooseWin();
			break;
		case "roleZTree"://角色树
			windowView.initRenameWin(treeId,"new");
			break;
		case "resourceZTree"://资源树
			windowView.initNewResourceWin("new");
			break;
	}
}

/**
 * 重命名树节点
 * @param treeId
 */
function updateOmNode(treeId){
	switch (treeId) {
		case "organizationZTree"://组织用户树
		case "roleZTree"://角色树
			windowView.initRenameWin(treeId,"rename");
			break;
		case "resourceZTree"://资源树
			windowView.initNewResourceWin("rename");
			break;
	}
}

/**
 * 删除树节点
 * @param treeId
 * @param operateType 操作类型 delete,relieve(在组织用户树中包括删除节点和解除用户和组织之间的关系)
 */
function removeOmNode(treeId,operateType){
	if(!operateType){//操作类型未定义默认操作类型为删除
		operateType = "delete";
	}
	windowView.initDeleteWin(treeId, operateType);
}

/**
 * 组织用户树中组织添加用户
 */
function containOmNode(){
	windowView.initContainUserWin();
}

/**
 * 用户移至组织
 */
function relieveOmNode(){
	windowView.initRelieveOrganizationWin();
}

/**
 * 显示组织用户详细信息窗口
 */
function showMoreInformation(){
	windowView.initMoreInformationWin();
}