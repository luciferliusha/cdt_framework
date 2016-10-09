/**
*外部权限接口
*/

var outOmPermissionList;//外部权限接口获得的权限列表
/**
 * 获得权限
 */
function getRightXML(){
	var url = "http://172.20.96.75:8080/OMWebservice/getRightXML.do?";
	var bpUserGUID = URLUtil.getQueryString("bpUserGUID");
	var bpPortalID = URLUtil.getQueryString("bpPortalID");
	var param = {data:JSON2.stringify({bpUserGUID:bpUserGUID,bpPortalID:bpPortalID})};
	doSimpleAjax(url,param,getRightXMLSuccess,getRightXMLFailed);
}

/**
 * 正确时返回函数
 */
function getRightXMLSuccess(response) {
	outOmPermissionList = response;

	initLabel();
	initTop();
	initSolution();
	initComponet();
	initMain();
	initUserView();
	initSolutionView();

	if (checkOutOmPermissionWorking('SOLUTIONADD')) {
		$("#solutions_add").hide();
	} else {
		$("#solutions_add").show();
	}
	if (checkOutOmPermissionWorking('SOLUTIONQUERY')) {
		$("#solution_operate").hide();
	} else {
		$("#solutions_groups").show();
	}
	if (checkOutOmPermissionWorking('LABELADD')) {
		$("#add_page").hide();
		$("#label_turn_down").removeClass($("#label_turn_down").attr("class"));
		$("#label_turn_down").addClass("turn_down_no_d");
	} else {
		$("#add_page").show();
	}
	if (checkOutOmPermissionWorking('LABELQUERY')) {
		$("#table_label").hide();
	} else {
		$("#table_label").show();
	}
	if (checkOutOmPermissionWorking('SAVE')) {
		$("#save").css("color", "#cccccc");
	} else {
		$("#save").css("color", "#333333");
	}
	if (checkOutOmPermissionWorking('SHARE')) {
		$("#share").css("color", "#cccccc");
	} else {
		$("#share").css("color", "#333333");
	}
	if(checkOutOmPermissionWorking('SOLUTIONTOCOMPONENT')){
		$("#operate .operate_title_bg").hide();
		moveTop();
	}else{
		SOLUTION_SCAN_TYPE = 1;
		$("#operate .operate_title_bg").show();
	}

	$("#userSetting p").text("");
	resize();
}

/**
 * 出错时返回函数
 */
function getRightXMLFailed(){
	isFromOutOm = false;
	cdtGetUrlPermission(userId);
}

function getSolutionsFromOutOm(tmpSolution){	
	for(var i=0; i<tmpSolution.length; i++){
		var isExit = false;
		for ( var j = 0; j < outOmPermissionList.length; j++) {
			if(tmpSolution[i].pfName == outOmPermissionList[j].resourceNameCn){
				isExit = true;
			}
		}
		if(!isExit){
			tmpSolution.splice(i,1);
			i--;
		}
	}
}

//判断当前登录用户是否拥有权限
function checkOutOmPermissionWorking(permission){
	var identify = getIdentifyFromPermissionOutOm(permission);
	if(identify != null && identify != ''){
		for(var i=0; i<outOmPermissionList.length; i++){
			if(identify == outOmPermissionList[i].resourceNameCn){
				return false;
			}
		}
	}
	return true;
}

//根据权限功能获取权限标识
function getIdentifyFromPermissionOutOm(permission){
	var identify;
	switch(permission){
	case 'LOGIN'://登录
		identify = 'CDT-01';
		break;
	case 'SOLUTIONADD'://解决方案增加
		identify = 'CDT-02';
		break;
	case 'SOLUTIONDELETE'://解决方案删除
		identify = 'CDT-03';
		break;
	case 'SOLUTIONCHANGE'://解决方案修改
		identify = 'CDT-04';
		break;
	case 'SOLUTIONQUERY'://解决方案查询
		identify = 'CDT-05';
		break;
	case 'COMPONENTADD'://构件增加
		identify = 'CDT-06';
		break;
	case 'COMPONENTDELETE'://构件删除
		identify = 'CDT-07';
		break;
	case 'COMPONENTCHANGE'://构件修改
		identify = 'CDT-08';
		break;
	case 'COMPONENTQUERY'://构件查询
		identify = 'CDT-09';
		break;
	case 'LABELADD'://页签增加
		identify = 'CDT-10';
		break;
	case 'LABELDELETE'://页签删除
		identify = 'CDT-11';
		break;
	case 'LABELCHANGE'://页签修改
		identify = 'CDT-12';
		break;
	case 'LABELQUERY'://页签查询
		identify = 'CDT-13';
		break;
	case 'SAVE'://保存
		identify = 'CDT-14';
		break;
	case 'SHARE'://分享
		identify = 'CDT-15';
		break;
	case 'SOLUTIONTOCOMPONENT'://解决方案和构件切换
		identify = 'CDT-16';
		break;
	case 'SORT'://解决方案和页签排序
		identify = 'CDT-17';
		break;
	default:
		break;
	}
	return identify;
}