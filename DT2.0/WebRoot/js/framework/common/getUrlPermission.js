/** 获取权限数据信息 */
var getUrlPerssion;
var resultPermissionList = new Array();

$(function(){
	var permissionService = new PermissionService();
	/** 获取权限数据 */
	var GetUrlPerssion = function(){
		/**
		 * 访问权限接口获取权限数据
		 */
		this.cdtGetUrlPermission = function(init){
			permissionService.cdtGetUrlPermission(getUrlPerssion.compareSolutionWithCdt,"", init);
		};
		/**
		 * 判断各模块的权限并显示或隐藏之
		 */
		this.compareSolutionWithCdt = function(data) {
			var permissionList = data.right;
			userKind = data.kind;
			getUserPermission("CDT",permissionList,userKind);
			//初始化页面
			init();
			
			if(userKind == 1){//系统管理员
				$("#sysEditDiv").show();
				$("#sysSettingDiv").show();
				$("#favoriteDiv").hide();//管理员不需要解决方案的订阅喜好设置
			}
			else {
				$("#sysEditDiv").hide();
				$("#sysSettingDiv").hide();
				$("#favoriteDiv").show();
			}
			if(cdtPermissionWorking("CDT-02", 0)){//解决方案的增加权限
				$("#solutions_add").hide();
			}else{
				$("#solutions_add").show();
			}
			//只要有解决方案的增删改权限
			if(!cdtPermissionWorking("CDT-02", 0) || !cdtPermissionWorking("CDT-02", 1) || !cdtPermissionWorking("CDT-02", 2)){
				$("#sysEditDiv").show();
			}
			else {
				$("#sysEditDiv").hide();
			}
			
			if(cdtPermissionWorking("CDT-02", 3)){//解决方案的查看权限
				$("#solution_div_sidebar").hide();
			}else{
				$("#solution_div_sidebar").show();
			}
			if(cdtPermissionWorking("CDT-05", 3)){//解决方案保存权限
				$("#save").css("color","#cccccc");
			}else{
				$("#save").css("color","#333333");
			}
		};
		
		//获取该用户的权限
		function getUserPermission(parentName, permissionList, userKind){
			if(userKind == 1){//系统管理员
				resultPermissionList.push({no:"CDT-02",role:[1,1,1,1]});
				resultPermissionList.push({no:"CDT-03",role:[1,1,1,1]});
				resultPermissionList.push({no:"CDT-04",role:[1,1,1,1]});
				resultPermissionList.push({no:"CDT-05",role:[1,1,1,1]});
				resultPermissionList.push({no:"CDT-06",role:[1,1,1,1]});
				resultPermissionList.push({no:"CDT-07",role:[1,1,1,1]});
				resultPermissionList.push({no:"CDT-08",role:[1,1,1,1]});
			}else{
				for(var i=0; i<permissionList.length; i++){
					checkPermissionName(permissionList[i]);
				}
			}
//			resultPermissionMap.put(parentName , resultPermissionList);
		}
		
		function checkPermissionName(permissionList){
			var no = permissionList.no;
			var role = parseInt(permissionList.role, 2);
			switch(no){
			case 'CDT-02'://解决方案
				checkPermissionList(no, role);
				break;
			case 'CDT-03'://构件
				checkPermissionList(no, role);
				break;
			case 'CDT-04'://页签
				checkPermissionList(no, role);
				break;
			case 'CDT-05'://保存
				checkPermissionList(no, role);
				break;
			case 'CDT-06'://发布
				checkPermissionList(no, role);
				break;
			case 'CDT-07'://解决方案和构件切换按钮
				checkPermissionList(no, role);
				break;
			case 'CDT-08'://解决方案和页签的排序限制
				checkPermissionList(no, role);
				break;
			default:
			}
		}
		
		function checkPermissionList(no, role){
			var temp = role&0x08;//判断有'增'权限
			var tempArray = new Array();
			if(temp == 0x08){
//				alert('有增权限');
				tempArray.push(1);
			}else{
				tempArray.push(0);
			}
			
			temp = role&0x04;//判断有'删'权限
			if(temp == 0x04){
//				alert('有删权限');
				tempArray.push(1);
			}else{
				tempArray.push(0);
			}
			
			temp = role&0x02;//判断有'改'权限
			if(temp == 0x02){
//				alert('有改权限');
				tempArray.push(1);
			}else{
				tempArray.push(0);
			}
			
			temp = role&0x01;//判断有'查'权限
			if(temp == 0x01){
//				alert('有查权限');
				tempArray.push(1);
			}else{
				tempArray.push(0);
			}
			
			resultPermissionList.push({'no': no, 'role': tempArray});
		}
	};
	getUrlPerssion = new GetUrlPerssion();
});

//根据权限禁用对应功能
var cdtPermissionWorking = function(permission, operate){
	var permissionExist = 0;
	var cdtPermission;
	if(resultPermissionList != null){
		for(var i=0; i<resultPermissionList.length; i++){
			if(resultPermissionList[i].no == permission){
				cdtPermission = resultPermissionList[i].role;
				permissionExist = 1;
			}
		}
		if(cdtPermission != null && !cdtPermission[operate]){
			return true;
		}else{
			if(permissionExist == 0){
				return true;
			}else{
				return false;
			}
		}
	}
};
