/**获得外部接口权限信息**/
var outOmPermissionList = new Array();//外部权限接口获得的权限列表
var getOutOmPerssion;
var rightXmlList;////外部权限接口获得的所有信息列表

$(function(){
	var outOmPermissionService = new OutOmPermissionService();
	/** 获取权限数据 */
	var GetOutOmPerssion = function(){
		/**
		 * 初始化函数
		 */
		this.getOutOmPermission = function(init){			
			var bpUserGUID = URLUtil.getQueryString("bpUserGUID");
			var bpPortalID = URLUtil.getQueryString("bpPortalID");			
			//var bpUserGUID = "E8F9D25B20FA20B1E040640A84071010";
			//var bpPortalID = "6E2917E658CE4DA78CFA87AD7A9EA820";
			var param = {data:JSON2.stringify({bpUserGUID:bpUserGUID,bpPortalID:bpPortalID})};
			outOmPermissionService.getOutOmPermission(getRightXMLSuccess, getRightXMLFailed, param, init);
	
		};
		
		/**
		 * 过滤解决方案函数
		 */
		this.getSolutionsFromOutOm = function(tmpSolution){
			for(var i=0; i<tmpSolution.length; i++){
				var isExit = false;
				for ( var j = 0; j < rightXmlList.length; j++) {
					if(tmpSolution[i].pfName == rightXmlList[j].resourceNameCn){
						isExit = true;
					}
				}
				if(!isExit){
					tmpSolution.splice(i,1);
					i--;
				}
			}
		};
		
		
		/**
		 * 正确时返回函数
		 */
		var getRightXMLSuccess = function(response,callBack){
			rightXmlList = response;			
			getUserPermission(rightXmlList);
			
			callBack();
			
			$("#sysEditDiv").show();
			$("#sysSettingDiv").hide();
			$("#favoriteDiv").hide();
						
			if(outOmPermissionWorking("CDT-02", 0)){//解决方案的增加权限
				$("#solutions_add").hide();
			}else{
				$("#solutions_add").show();
			}
			//只要有解决方案的增删改权限
			if(!outOmPermissionWorking("CDT-02", 0) || !outOmPermissionWorking("CDT-02", 1) || !outOmPermissionWorking("CDT-02", 2)){
				$("#sysEditDiv").show();
			}
			else {
				$("#sysEditDiv").hide();
			}
			
			if(outOmPermissionWorking("CDT-02", 3)){//解决方案的查看权限
				$("#solution_div_sidebar").hide();
			}else{
				$("#solution_div_sidebar").show();
			}
			if(outOmPermissionWorking("CDT-05", 3)){//解决方案保存权限
				$("#save").css("color","#cccccc");
			}else{
				$("#save").css("color","#333333");
			}
		};
		/**
		 * 正确时返回函数
		 */
		var getRightXMLFailed = function(callBack){
			isFromOutOm = false;
			getUrlPerssion.cdtGetUrlPermission(callBack);
		};		
		//获取该用户的权限
		var getUserPermission = function(rightXmlList){		
			for(var i=0; i<rightXmlList.length; i++){
				if(rightXmlList[i].resourceNameCn.indexOf("CDT") != -1){
					checkPermissionName(rightXmlList[i]);
				}				
			}			
		};
		var checkPermissionName = function(permissionList){
			var no = permissionList.resourceNameCn;
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
		};
		
		function checkPermissionList(no, role){
			var temp = role&0x08;//判断有'增'权限
			var tempArray = new Array();
			if(temp == 0x08){
				tempArray.push(1);
			}else{
				tempArray.push(0);
			}
			
			temp = role&0x04;//判断有'删'权限
			if(temp == 0x04){
				tempArray.push(1);
			}else{
				tempArray.push(0);
			}
			
			temp = role&0x02;//判断有'改'权限
			if(temp == 0x02){
				tempArray.push(1);
			}else{
				tempArray.push(0);
			}
			
			temp = role&0x01;//判断有'查'权限
			if(temp == 0x01){
				tempArray.push(1);
			}else{
				tempArray.push(0);
			}			
			outOmPermissionList.push({'no': no, 'role': tempArray});
		}
	};
	getOutOmPerssion = new GetOutOmPerssion();
	
});

//根据权限禁用对应功能
var outOmPermissionWorking = function(permission, operate){
	var permissionExist = 0;
	var cdtPermission;
	if(outOmPermissionList != null){
		for(var i=0; i<outOmPermissionList.length; i++){
			if(outOmPermissionList[i].no == permission){
				cdtPermission = outOmPermissionList[i].role;
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