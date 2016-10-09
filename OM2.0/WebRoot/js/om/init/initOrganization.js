/**
* 初始化组织和用户
*/
var organizations;
var selectedOrganizationNode;//选中的组织用户节点
var selectedSearchOrganizationNode;//选中的搜索组织用户节点
var organizationRoleData = new HashMap();//组织拥有的角色,key是主键id,value是拥有的角色数据
var userRoleData = new HashMap();//用户拥有的角色,key是主键id,value是拥有的角色数据
var organizationRoleDataOld = new HashMap();//首次点击角色时做缓存,key是主键id,value是数据库中拥有的资源数据
var userRoleDataOld = new HashMap();//首次点击角色时做缓存,key是主键id,value是数据库中拥有的资源数据
var searchOrganizationTreeHasChanged = false;//搜索组织用户树是否有改变节点的信息，包括增、删、改，true为有改变,false无改变
$(function() {
	var organizationView = new OrganizationView();

});

function initMenu(node,menu_id){
	if(node.attributes.type == 0){//组织菜单
		if(node.id == ORGANIZATION_ROOT_ID){//组织用户树根节点禁止重命名、添加用户、删除和详细信息
			var renameItem = $('#' + menu_id).menu('findItem',"重命名");
			if(!renameItem.disabled){//修改功能被启用,禁用修改功能
				$('#' + menu_id).menu('disableItem',renameItem.target);
				$('#' + menu_id).menu('setIcon',{target:renameItem.target,iconCls:'icon-rename-d'});//更换图标
				$(renameItem.target).children(".menu-text").addClass("menu-text-disabled");//修改文字颜色
			}
			var containItem = $('#' + menu_id).menu('findItem',"添加用户");
			if(!containItem.disabled){
				$('#' + menu_id).menu('disableItem',containItem.target);
				$('#' + menu_id).menu('setIcon',{target:containItem.target,iconCls:'icon-contain-d'});
				$(containItem.target).children(".menu-text").addClass("menu-text-disabled");
			}
			var deleteItem = $('#' + menu_id).menu('findItem',"删除");
			if(!deleteItem.disabled){
				$('#' + menu_id).menu('disableItem',deleteItem.target);
				$('#' + menu_id).menu('setIcon',{target:deleteItem.target,iconCls:'icon-trash-d'});
				$(deleteItem.target).children(".menu-text").addClass("menu-text-disabled");
			}
			var moreItem = $('#' + menu_id).menu('findItem',"详细信息");
			if(!moreItem.disabled){
				$('#' + menu_id).menu('disableItem',moreItem.target);
				$(moreItem.target).children(".menu-text").addClass("menu-text-disabled");
			}
			
			var addItem = $('#' + menu_id).menu('findItem',"新增");
			if(addItem.disabled){
				$('#' + menu_id).menu('enableItem',addItem.target);
				$('#' + menu_id).menu('setIcon',{target:addItem.target,iconCls:'icon-add-n'});//更换图标
				$(addItem.target).children(".menu-text").removeClass("menu-text-disabled");
			}
		}
		else{//其他组织的重命名、添加用户、删除和详细信息功能被禁用，重新启用
			var renameItem = $('#' + menu_id).menu('findItem',"重命名");
			if(renameItem.disabled){
				$('#' + menu_id).menu('enableItem',renameItem.target);
				$('#' + menu_id).menu('setIcon',{target:renameItem.target,iconCls:'icon-rename-n'});
				$(renameItem.target).children(".menu-text").removeClass("menu-text-disabled");
			}
			var containItem = $('#' + menu_id).menu('findItem',"添加用户");
			if(containItem.disabled){
				$('#' + menu_id).menu('enableItem',containItem.target);
				$('#' + menu_id).menu('setIcon',{target:containItem.target,iconCls:'icon-contain-n'});
				$(containItem.target).children(".menu-text").removeClass("menu-text-disabled");
			}
			var deleteItem = $('#' + menu_id).menu('findItem',"删除");
			if(deleteItem.disabled){
				$('#' + menu_id).menu('enableItem',deleteItem.target);
				$('#' + menu_id).menu('setIcon',{target:deleteItem.target,iconCls:'icon-trash-n'});
				$(deleteItem.target).children(".menu-text").removeClass("menu-text-disabled");
			}

			var moreItem = $('#' + menu_id).menu('findItem',"详细信息");
			if(moreItem.disabled){
				$('#' + menu_id).menu('enableItem',moreItem.target);
				$(moreItem.target).children(".menu-text").removeClass("menu-text-disabled");
			}
		}
	}
	else if(node.attributes.type == 1){//用户菜单
		
	}
}