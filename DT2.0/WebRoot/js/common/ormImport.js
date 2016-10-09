/**
 * 权限对接接口
 */
var GlobalPermission;
var ormUserType;

//将权限赋值给全局变量并打印出来
function print(data) {
	$("#userSetting p").text(data.user.userName);
	userName = data.user.userName;
	userAcct = data.user.userAcct;
	getPermissionFromORM(data);
	ORMPermissionOperate();
}
//调用权限接口获取用户权限
function getUserInfo() {
	var req = {"userAcct": userName};
	ORM.Request.getUserInfo(req, print);
}
//根据久拓权限接口禁用对应功能
function ORMPermission(permission, identify){
	if(permission == identify){
		return true;
	}else{
		return false;
	}
}
//根据权限功能获取权限标识
function getIdentifyFromPermission(permission){
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

//获得ORM接口中的权限数据
function getPermissionFromORM(data){
	GlobalPermission = data.right;
	ormUserType = data.user.userAcctTypeValue;
	return GlobalPermission;
}

//遍历解决方案列表，删除不属于该用户的解决方案
function getSolutionsFromOrm(tmpSolution){
	if(ormUserType == "管理员用户"){
		return;
	}
	for(var i=0; i<tmpSolution.length; i++){
		var isExit = false;
		for(var j=0; j<GlobalPermission.length; j++){
			if(tmpSolution[i].pfName == GlobalPermission[j].resourceNameCn){
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
function ORMPermissionWorking(permission){
	var identify = getIdentifyFromPermission(permission);
	if(identify != null && identify != ''){
		for(var i=0; i<GlobalPermission.length; i++){
			if(identify == GlobalPermission[i].resourceNameCn){
				return false;
			}
		}
	}
	return true;
}

//当前登录用户没有指定权限是对界面显示或操作做出限制
function ORMPermissionOperate(){
	initLabel();
	initTop();
	initSolution();
	initComponet();
	initMain();
	initUserView();
	if(ORMPermissionWorking('SOLUTIONADD')){
		$("#solutions_add").hide();
	}else{
		$("#solutions_add").show();
	}
	if(ORMPermissionWorking('SOLUTIONQUERY')){
		$("#solution_operate").hide();
	}else{
		$("#solutions_groups").show();
	}
	if(ORMPermissionWorking('LABELADD')){
		$("#add_page").hide();
		$("#label_turn_down").removeClass($("#label_turn_down").attr("class"));
		$("#label_turn_down").addClass("turn_down_no_d");
	}else{
		$("#add_page").show();
	}
	if(ORMPermissionWorking('LABELQUERY')){
		$("#table_label").hide();
	}else{
		$("#table_label").show();
	}
	if(ORMPermissionWorking('SAVE')){
		$("#save").css("color","#cccccc");
	}else{
		$("#save").css("color","#333333");
	}
	if(ORMPermissionWorking('SHARE')){
		$("#share").css("color","#cccccc");
	}else{
		$("#share").css("color","#333333");
	}
	if(ORMPermissionWorking('SOLUTIONTOCOMPONENT')){
		SOLUTION_SCAN_TYPE = 2;//设置为浏览模式
		solution_space_width = 50;
		solutionLimit = 8;//修改文字的长度
		chageSolutionBg();
		$("#operate .operate_title_bg").hide();
		moveTop();
	}else{
		SOLUTION_SCAN_TYPE = 1;
		$("#operate .operate_title_bg").show();
	}
	initSolutionView();
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

function getUserStatus(userName, isSessionOut){
	var reqUserStatus = JSON2.parse('{"userAcct":"'+userName+'"}');
	ORM.Validator.getUserStatus(reqUserStatus, function isOnLine(result){
		if(!result.userStatus){
			alert("您未登录或离开系统过久,请重新登录!");
			window.location.href=contextPath == "" ? "/" : contextPath;
		}
		else {
			isSessionOut = false;
			setTimeout(getUserInfo, 800);
		}
	});
}

function doLogin(loginName, pwd, firstSolutionSelected, map){
	var reqLogin = JSON2.parse('{"userAcct":"'+loginName+'","userPwd":"'+pwd+'"}');
	ORM.Validator.login(reqLogin, function loginSuccess(result){
		//alert(result.resMsg);
		if(result.resResult == "true"){
			var reqJsonStr = JSON2.parse('{"userAcct": "'+loginName+'"}');
			firstSolutionSelected();
			var selectedId = map.get("selectedId");
			//window.location.href=contextPath + "/framework/main.jsp?selectedId=" + selectedId + "&loginName=" + loginName + "&userId=" + "";
			window.location.href=contextPath + "/framework/framework.jsp?userAcct=" + base64encode(loginName);
		}
	});
}

function doLogout(){
	ORM.Validator.logout(function loginSuccess(result){
		//alert(result.resMsg);
		if(result.resResult){
			window.location.href=contextPath;
		}
	});
}
