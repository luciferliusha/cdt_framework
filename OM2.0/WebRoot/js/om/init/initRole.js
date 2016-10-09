/**
* 初始化角色
*/
var roles;
var selectedRoleNode;//选中的角色节点
var searchRolesData;//搜索角色结果数据
var roleResourceCheckData = new HashMap();//选中的角色拥有的资源,key是主键id,value是拥有的资源数据
var roleResourceData = new HashMap();//角色拥有的资源,key是主键id,value是拥有的资源数据
var roleResourceDataOld = new HashMap();//首次点击角色时做缓存,key是主键id,value是数据库中拥有的资源数据
var roleResourceValue = new HashMap();//比较之后, 需要被存储到的数据缓存集合

var resourceOperateData = new HashMap();
$(function() {
	var roleView = new RoleView();
});