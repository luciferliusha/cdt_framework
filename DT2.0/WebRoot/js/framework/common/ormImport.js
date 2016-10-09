/**
 * 权限对接接口
 */
var GlobalPermission;
var ormUserType;

//调用权限接口获取用户权限
function getUserInfo(init) {
	var req = {"userAcct": userName};
	ORM.Request.getUserInfo(req, function print(data) {
		//将权限赋值给全局变量并打印出来
		$("#userNameDiv").text(data.user.userName);
		userName = data.user.userName;
		userAcct = data.user.userAcct;
		userOrg = (data.org.length == 0)?"":JSON.stringify(data.org);
		getUserTypeFromORM(data);
		ORM.Request.getResourceList({"userAcct":userAcct},function(data){
			getPermissionFromORM(data);
			getUserTypeFromORMByResource();//添加是否是系统管理的判断
			init();
			ORMPermissionOperate();
		});
	});
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
	case 'SYSTEM_MANAGE'://系统管理
		identify = 'CDT-18';
		break;
	default:
		break;
	}
	return identify;
}

//获得ORM接口中的权限数据
function getPermissionFromORM(data){
	GlobalPermission = data;
	return GlobalPermission;
}

//获得ORM接口中的用户数据
function getUserTypeFromORM(data){
	ormUserType = data.user.userAcctTypeValue;
	if(ormUserType == "管理员用户"){
		userKind = 1;//管理员
	}
	else {
		userKind = 0;//普通用户
	}
}

/**
 * 判断用户是否有系统管理权限（由于久拓OM的更新，没有系统用户的标识，只有角色，所以添加CDT-18作为系统管理的资源来判断）
 * @param data
 * @returns
 */
function getUserTypeFromORMByResource(){
	if(ormUserType != "管理员用户"){
		if (!ORMPermissionWorking('SYSTEM_MANAGE')) {//有系统管理权限则当系统管理
			ormUserType = "管理员用户";
			userKind = 1;//管理员
		}
	}
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
				break;
			}
		}
		if(!isExit){
			tmpSolution.splice(i,1);
			i--;
		}
	}
}

//遍历解决方案列表，删除不属于该用户的解决方案
function getSolutionsFromTreeOrm(tmpSolution){
	if(ormUserType == "管理员用户"){
		return;
	}
	for(var i=0; i<tmpSolution.length; i++){
		var isExit = false;
		for(var j=0; j<GlobalPermission.length; j++){
			if(tmpSolution[i].name == GlobalPermission[j].resourceNameCn){
				isExit = true;
				break;
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
	if(ORMPermissionWorking('SOLUTIONADD')){
		$("#solutions_add").hide();
	}else{
		$("#solutions_add").show();
	}
	if(ORMPermissionWorking('SOLUTIONQUERY')){
		$("#solution_div_sidebar").hide();
	}else{
		$("#solution_div_sidebar").show();
	}
	if(ORMPermissionWorking('SAVE')){
		$("#save").css("color","#cccccc");
	}else{
		$("#save").css("color","#333333");
	}
	if(ormUserType != "管理员用户"){
		$("#sysEditDiv").hide();
		$("#sysSettingDiv").hide();
		$("#favoriteDiv").show();
	}
	else {
		$("#favoriteDiv").hide();//管理员不需要解决方案的订阅喜好设置
	}
}

function getUserStatus(userName, isSessionOut, init){
	var reqUserStatus = JSON.parse('{"userAcct":"'+userName+'"}');
	ORM.Validator.getUserStatus(reqUserStatus, function isOnLine(result){
		if(!result.userStatus){
			alert("您未登录或离开系统过久,请重新登录!");
			window.location.href = contextPath == "" ? "/" : contextPath;
		}
		else {
			getUserInfo(init);
		}
	});
}

function doLogin(loginName, pwd, firstSolutionSelected, map){
	var reqLogin = JSON2.parse('{"userAcct":"'+loginName+'","userPwd":"'+pwd+'"}');
	ORM.Validator.login(reqLogin, function loginSuccess(result){
		if(result.resResult == "true"){
			var reqJsonStr = JSON2.parse('{"userAcct": "'+loginName+'"}');
			firstSolutionSelected();
			var selectedId = map.get("selectedId");
			//window.location.href=contextPath + "/framework/main.jsp?selectedId=" + selectedId + "&loginName=" + loginName + "&userId=" + "";
			window.location.href=contextPath + "/framework/framework.jsp?userAcct=" + base64encode(loginName);
		}else{
			$.messager.alert("操作提示","用户名或密码错误！","error");
		}
	});
}

function doLogout(){
	ORM.Validator.logout(function loginSuccess(result){
		if(result.resResult){
			window.location.href=contextPath;
		}
	});
}
