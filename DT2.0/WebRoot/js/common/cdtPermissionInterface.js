//var resultPermissionMap = new HashMap();
var resultPermissionList = new Array();
var userKind;
var isInited = false;//是否已经加载过

//根据userId获取权限字段
function cdtGetUrlPermission(userId){
	var url = contextPath + '/getUserPopedom.do?data={"userId":"'+userId+'"}';
	doAjaxServerData(url, getPermissionList, userId);
}

function getPermissionList(response, userId){
	if (!isInited) {//是否已经加载过，如果加载过则不初始化，防止点击返回按钮保存
		initLabel();
		initTop();
		initSolution();
		initComponet();
		initMain();
		initUserView();
	}
	
	var permissionList = response.data;
	userKind = response.kind;
	getUserPermission("CDT",permissionList,userId);
	
	if(cdtPermissionWorking("CDT-02", 0)){
		$("#solutions_add").hide();
	}else{
		$("#solutions_add").show();
	}
	if(cdtPermissionWorking("CDT-02", 3)){
		$("#solution_operate").hide();
	}else{
		$("#solutions_groups").show();
	}
	if(cdtPermissionWorking("CDT-04", 0)){
		$("#add_page").hide();

		$("#label_turn_down").removeClass($("#label_turn_down").attr("class"));
		$("#label_turn_down").addClass("turn_down_no_d");
	}else{
		$("#add_page").show();
	}
	if(cdtPermissionWorking("CDT-04", 3)){
		$("#table_label").hide();
	}else{
		$("#table_label").show();
	}
	if(cdtPermissionWorking("CDT-05", 3)){
		$("#save").css("color","#cccccc");
	}else{
		$("#save").css("color","#333333");
	}
	if(cdtPermissionWorking("CDT-06", 3)){
		$("#share").css("color","#cccccc");
	}else{
		$("#share").css("color","#333333");
	}
	if(cdtPermissionWorking("CDT-07", 3)){
		if (MENU_SHOW_MODE == 2) {//是为温州展现模式
			SOLUTION_SCAN_TYPE = 2;//设置为浏览模式
			solution_space_width = 50;
			solutionLimit = 8;//修改文字的长度
			chageSolutionBg();
		}
		else {//浏览模式多现实1个字
			solutionLimit = 20;
		}
		$("#operate .operate_title_bg").hide();
		moveTop();
	}else{
		SOLUTION_SCAN_TYPE = 1;
		$("#operate .operate_title_bg").show();
	}
	if (!isInited) {//是否已经加载过，如果加载过则不初始化，防止点击返回按钮保存
		initSolutionView();
		isInited = true;
	}
	resize();
}

function chageSolutionBg() {
	$("#operate").width(solution_space_width+"px");
	$("#solution_operate").width(solution_space_width+"px");
	$("#solutions_operate_title").width(solution_space_width+"px");
	$("#solutions_operate_title").css("margin-bottom", "0px");
	$("#solution_operate").css("background", "#323a45");
	$("#solutions_return").css("margin-left", "0px");
	$("#solutions_operate_title_name").hide();//隐藏路径
	$("#working").css("left", solution_space_width+ "px");
}

//上移
function moveTop(){
	var solution_operate = document.getElementById("solution_operate");
	solution_operate.style.marginTop="-55px";
}
//获取该用户的权限
function getUserPermission(parentName, permissionList, userId){
	if(userId == 0){
		resultPermissionList.push({no:"CDT-02",role:[1,1,1,1]});
		resultPermissionList.push({no:"CDT-03",role:[1,1,1,1]});
		resultPermissionList.push({no:"CDT-04",role:[1,1,1,1]});
		resultPermissionList.push({no:"CDT-05",role:[1,1,1,1]});
		resultPermissionList.push({no:"CDT-06",role:[1,1,1,1]});
		resultPermissionList.push({no:"CDT-07",role:[1,1,1,1]});
		resultPermissionList.push({no:"CDT-08",role:[1,1,1,1]});
	}else if(userId == -1){
		resultPermissionList.push({no:"CDT-02",role:[0,0,0,1]});
		resultPermissionList.push({no:"CDT-03",role:[0,0,0,1]});
		resultPermissionList.push({no:"CDT-04",role:[0,0,0,1]});
		resultPermissionList.push({no:"CDT-05",role:[0,0,0,0]});
		resultPermissionList.push({no:"CDT-06",role:[0,0,0,0]});
		resultPermissionList.push({no:"CDT-07",role:[0,0,0,0]});
		resultPermissionList.push({no:"CDT-08",role:[0,0,0,0]});
	}else{
		for(var i=0; i<permissionList.length; i++){
			checkPermissionName(permissionList[i]);
		}
	}
//	resultPermissionMap.put(parentName , resultPermissionList);
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
//		alert('有增权限');
		tempArray.push(1);
	}else{
		tempArray.push(0);
	}
	
	temp = role&0x04;//判断有'删'权限
	if(temp == 0x04){
//		alert('有删权限');
		tempArray.push(1);
	}else{
		tempArray.push(0);
	}
	
	temp = role&0x02;//判断有'改'权限
	if(temp == 0x02){
//		alert('有改权限');
		tempArray.push(1);
	}else{
		tempArray.push(0);
	}
	
	temp = role&0x01;//判断有'查'权限
	if(temp == 0x01){
//		alert('有查权限');
		tempArray.push(1);
	}else{
		tempArray.push(0);
	}
	
	resultPermissionList.push({'no': no, 'role': tempArray});
}

//根据权限禁用对应功能
function cdtPermissionWorking(permission, operate){
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
}
