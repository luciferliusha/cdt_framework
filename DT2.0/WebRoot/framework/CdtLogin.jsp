<%@page import="com.zjcds.portal.config.SysConfig"%>
<%@page import="com.zjcds.portal.config.ConfigManager"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	SysConfig sysConfig = ConfigManager.getInstance().getSysConfig();
	String style = sysConfig.getConfigValue("config.styleName");
%>
<!DOCTYPE html>
<html>
<head>

<title></title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">

<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/jquery/jquery-1.7.2.js"></script>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/js/libs/easyui/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/js/libs/easyui/themes/icon.css">
	
	<%
		List<String> jsUrls = ConfigManager.getInstance().getSysConfig().getJsUrlList();//外部JS导入
		if (jsUrls != null) {
			for (String jsUrl : jsUrls) {
	%>
	<script type="text/javascript" src="<%=jsUrl %>"></script>
	<%			
			}
		}
	%>

<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>

<script type="text/javascript" src="<%=request.getContextPath() %>/js/framework/constant/constants.js"></script>

<script type="text/javascript" src="<%=request.getContextPath() %>/js/login/model/loginModel.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/login/collection/loginCollection.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/login/view/cdtLoginView.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/login/init/initCdtLoginView.js"></script>

<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/underscore/underscore-min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/backbone/backbone-min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/base64/base64.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/util.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/json2.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/containSpecial.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/gobal/httptools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/framework/common/loadCssFile.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/cookies.js"></script>


<script type="text/javascript">
	var contextPath = "<%=request.getContextPath()%>";
	var style = "<%=style %>";
	var isFromOrm = false;//权限是否从orm接口来
	var isSessionOut = true;

	//读取配置中的信息
	sysName = "<%=sysConfig.getConfigValue("config.systemName").replaceAll("\"","%22") %>";//转换"防止错误
	sysName = sysName.replace(/\%22/g, "\"");//转换"回来
	var systemNameFontSize = "<%=sysConfig.getConfigValue("config.systemNameFontSize") %>";
	sysNameStyle = "font-size:" + systemNameFontSize;
	rightName = "<%=sysConfig.getConfigValue("config.rightName").replaceAll("\"","%22") %>";
	rightName = rightName.replace(/\%22/g, "\"");//转换"回来
	techniqueName = "<%=sysConfig.getConfigValue("config.techniqueName").replaceAll("\"","%22") %>";
	techniqueName = techniqueName.replace(/\%22/g, "\"");//转换"回来
	
	$(function(){
		if(!checkBrowserVersions()){
			var msg = '<br/><span style="color:red;" >抱歉！您的浏览器版本过低，请更新浏览器，IE请使用IE8及以上版本，推荐使用谷歌Chrome浏览器！</span><br/><br/>' +
				'<span>浏览器下载： &nbsp;</span><img src="<%=request.getContextPath() %>/images/browser/IE8.png"/>' +
				'&nbsp;<a href="<%=request.getContextPath() %>/uploadFils/browser/IE8-WindowsXP-x86-CHS.2728888507.exe"> Internet Explorer 8（IE8）浏览器  </a>&nbsp;&nbsp;' + 
				'&nbsp;&nbsp;&nbsp;&nbsp;<img src="<%=request.getContextPath() %>/images/browser/chrome.png"/>' +
				'&nbsp;<a href="<%=request.getContextPath() %>/uploadFils/browser/ChromeStandaloneSetup.1418195695.exe"> 谷歌Chrome浏览器 </a>&nbsp;';
			$.messager.show({
				title:'提示',
				msg: msg,
				timeout:30000,
				showType:'slide',
				width: $(window).width(),
				height: 150,
				right:0,
				top:0
			});
		}
		else if (!checkBrowserIE8()) {
			$.messager.show({
				title:'提示',
				msg:'<span style="color:red;" >您的浏览器为IE8，为了提升更好的效果，请使用IE8以上版本或者谷歌Chrome、火狐浏览器！</span>',
				timeout:3500,
				showType:'slide',
				width: $(window).width(),
				height: 50,
				right:0,
				top:0
			});
		}
		checkLicence(initLogin);//检查licence
	});
	
	function initLogin() {
		
		loginFocus("#loginName", "#pwd", "#checkbox-login","#pwdInfo");
		
		resize();
		loadCssForCom(contextPath,"CdtLogin.css");
		//绑定enter键登陆事件
		bindEnterKey();

		//若url中存在用户名和密码，就自动登录
		var userAcct = userName = '<%=request.getParameter("userName")%>';
		var passWord = '<%=request.getParameter("pass")%>';
		//wangwenliang add 2015-0915 start
		var rolename='<%=request.getParameter("rolename")%>'
		//if(userAcct != 'null' && passWord != 'null'){
		if(rolename != 'null'){
		//alert(rolename);
	   //wangwenliang add 2015-0915 end
			//cdtLoginView.doLoginAjax(userAcct, passWord);
			cdtLoginView.doLoginAjax(rolename, passWord,rolename);
		}
	}
	
	window.onresize = function() {
		resize();
	};
	
	function resize() {
	
		var clientHeight = document.documentElement.clientHeight;
		var clientWidth = document.documentElement.clientWidth;
		
		if(clientWidth > 978){
			$("#logo-topView").css("margin-left", (clientWidth-978)/2 + "px");
			$("#login-topView").css("margin-left", (clientWidth-978)/2 + "px");
			$("#login-bottomView").css("margin-left", (clientWidth-978)/2 + "px");
		}
	}
	
	/**
	* 监听用户名和密码输入框点击enter键登陆事件
	*/
	function bindEnterKey(){
		if(!($._data($("#loginName").get(0), "events") != undefined
				&& $._data($("#loginName").get(0), "events")["keydown"] != undefined)){//用户名输入框键盘按下事件
			$("#loginName").bind("keydown",function(e){	
				if(e.keyCode == 13){
					cdtLoginView.doLogin();
				}
			});
		}
		
		if(!($._data($("#pwd").get(0), "events") != undefined
				&& $._data($("#pwd").get(0), "events")["keydown"] != undefined)){//密码输入框键盘按下事件
			$("#pwd").bind("keydown",function(e){
				if(e.keyCode == 13){
					cdtLoginView.doLogin();
				}
			});
		}
	}
</script>
</head>

<body style="display:none;">
<!--<div id="logo-topView" style="margin-top: 40px;padding-left: 60px;">
		<font style="width: auto; height: 70px; line-height: 70px; margin-bottom: 6px; color: #21917F; font-size: 32px; font-weight: bold; font-family: 'Microsoft YaHei' !important;"></font>
	</div> -->
	<div id="login-topView" style="width: 978px; height: 425px;">
		<div id="login-leftView" style="width: 470px; height: auto; margin-top: 120px; margin-left: 25px; float: left;">
			<script type="text/template" id="login-leftView-template">
				<p>{{LOGIN_PIC_SUMMARY}}</p>
				<div class="login-left-view" style="background-image: url('{{LOGIN_PIC_BGIMG}}');"></div>
			</script>
		</div>
		<div id="login-rightView" style="width: 390px; height: auto; margin-left: 92px; margin-top: 70px; float: left;">
		<script type="text/template" id="login-rightView-template">
			<!-- <div style="width: 187px; height: 70px; margin-bottom: 6px; background-image: url('images/login/cdt.png');"></div> -->
			<font class="sysNameStyle" style="{{sysNameStyle}}">{{sysName}}</font>			
			<!-- <font class="font-gray" style="font-weight: bold;">登录名：</font> -->
			<div style="margin-top: 10px;"><input id="loginName" type="text" class="login-input-n" defaultValue="请输入用户名 someone@example.com" value="" maxlength="32" onkeypress='return validateSpecialCharacterSimple();'>
			<!-- <div style="margin-top: 20px;"><font class="font-gray" style="font-weight: bold;">登录密码：</font></div> -->
			<input id="pwd" type="password" class="login-input-n" value="" style="display: none;" maxlength="50" onkeypress='return validateSpecialCharacterSimple();'>
			<input id="pwdInfo" type="text" class="login-input-n" defaultValue="请输入密码" value=""></div>
			<div style="margin-top: 10px; padding-left: 5px;height: 25px;">
				<!--<div id="checkbox-login" class="checkbox-login-n"></div>-->
				<input id="checkbox-login" type="checkbox">
				<font class="font-gray" style="line-height: 25px;">记住用户名</font>
				<!--<font class="font-gray font-blue" style="float: right; padding-right: 30px; line-height: 20px; cursor: pointer;"><a>忘记登录密码？</a></font>-->
			</div>
			<div style="width:140px;height:46px;margin-top: 32px;">
			<button id="cdt-login" class="cdt-login-n">登录</button></div>
			<div style="margin-top: 20px; display: none;">
				<font class="font-gray" style="float: left;">第一次使用？</font>
				<font id="personalRegister" class="font-gray font-blue" style="float: left; padding-left: 5px; cursor: pointer;"><a>个人用户注册</a></font>
				<font class="font-gray" style="float: left; padding-left: 5px;">/</font>
				<font id="enterpriseRegister" class="font-gray font-blue" style="float: left; padding-left: 5px; cursor: pointer;"><a>企业用户注册</a></font>
			</div>
		</script>
		</div>
	</div>
	<div id="login-bottomView" style="width: 978px; height: 1px; padding: 0px; margin-top: 120px; border-bottom: 1px solid #e8e8e8;">
	</div>
	<script type="text/template" id="login-bottomView-template">
			<div id="font-foot" style="padding-top: 18px;">
				<!-- <font>©2013浙江协同数据系统有限公司版权所有</font> -->
				<font>{{rightName}}&nbsp;&nbsp;|&nbsp;{{techniqueName}}</font>
				<div style="float: right; display: none;">
					<font>帮助中心</font>
					<font>&nbsp;&nbsp;问题反馈</font>
				</div>
			</div>
	</script>
	
	<div id="blackboard" style="top: 0px;"></div>
	<div id="signin_wd" class="user_wd" style="display: none; z-index: 999; background-color: #fff;">
	</div>
	
	<script type="text/template" id="signin_template">
	<div id="new_simple_user" class="new_simple_user-css">
		<h4>个人用户注册</h4>
		<div class="cut-off"></div>
		<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-bottom: 0;font-size: 12px;">
				<tr><td><div class="addInformation_input_title">用户名：</div></td></tr>
				<tr><td><input id="addSimpleUserEmail_input" class="register_textInput_n" type="text" defaultValue="输入电子邮箱" value="" maxlength="32"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addSimpleUserEmail_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">密码：</div></td></tr>
				<tr><td title="仅支持如下符号:&#13;!$%^&*.~_-@,"><input id="addSimpleUserPasswordInfo_input" class="register_textInput_n" type="text" value="" defaultValue="密码" title="仅支持如下符号:&#13;!$%^&*.~_-@,"></td></tr>
				<tr><td title="仅支持如下符号:&#13;!$%^&*.~_-@,"><input id="addSimpleUserPassword_input" class="register_textInput_p" type="password" value="" style="display: none;" onkeypress='return validateSpecialCharacterSimple();' title="仅支持如下符号:&#13;!$%^&*.~_-@,"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addSimpleUserPassword_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">确认密码：</div></td></tr>
				<tr><td><input id="addSimpleUserPasswordConfirmInfo_input" class="register_textInput_n" type="text" value="" defaultValue="确认密码" title="仅支持如下符号:&#13;!$%^&*.~_-@,"></td></tr>
				<tr><td><input id="addSimpleUserPasswordConfirm_input" class="register_textInput_p" type="password" value="" style="display: none;" onkeypress='return validateSpecialCharacterSimple();' title="仅支持如下符号:&#13;!$%^&*.~_-@,"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addSimpleUserPasswordConfirm_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">请输入真实姓名：</div></td></tr>
				<tr><td><input id="addSimpleUsername_input" class="register_textInput_n" type="text" defaultValue="姓名" value="" maxLength="32"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addSimpleUsername_input_tip"></span></td></tr>
			</table>
			<div style="margin: 20px;margin-top: 0;cursor: default;float: left;">
				<input id="new_simple_user_confirmBtn" class="signinBtn_n" type="button" value="确认" onfocus='this.blur();'>
				<!-- <input id="new_simple_user_cancelBtn" class="cancelBtn_n" type="button" value="取消" onfocus='this.blur();'> -->
				<font id="new_simple_user_cancelBtn" class="font-gray font-blue" style="padding-left: 5px; cursor: pointer;"><a>取消</a></font>
			</div>
		<div id="new_simple_user_close" class="signin_close_n"></div>
	</div>
	<div id="new_organization" class="newOrganization-css" style="display: none;">
		<h4>企业用户注册</h4>
			<div class="cut-off"></div>
			<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-bottom: 0;font-size: 12px;">					
			<tr><td><div class="addInformation_input_title">请输入组织名称：</div></td></tr>
			<tr><td><input id="addOrganizationName_input" class="register_textInput_n" id="" type="text" defaultValue="组织名称" value="" maxLength="32"></td></tr>
			<tr style="height:20px;"><td><span class="error_tip" id="addOrganizationName_input_tip"></span></td></tr>
			<tr><td><div class="addInformation_input_title">电子邮件：</div></td></tr>
			<tr><td><input id="addOrganizationEmail_input" class="register_textInput_n" type="text" defaultValue="电子邮件" value="" maxlength="32"></td></tr>
			<tr style="height:20px;"><td><span class="error_tip" id="addOrganizationEmail_input_tip"></span></td></tr>
			<tr><td><div class="addInformation_input_title">密码：</div></td></tr>
			<tr><td><input id="addOrganizationPasswordInfo_input" class="register_textInput_n" type="text" defaultValue="密码" value="" title="仅支持如下符号:&#13;!$%^&*.~_-@,"></td></tr>
			<tr><td><input id="addOrganizationPassword_input" class="register_textInput_p" type="password" value="" onkeypress='return validateSpecialCharacterSimple();' title="仅支持如下符号:&#13;!$%^&*.~_-@,"></td></tr>
			<tr style="height:20px;"><td><span class="error_tip" id="addOrganizationPassword_input_tip"></span></td></tr>
			<tr><td><div class="addInformation_input_title">确认密码：</div></td></tr>
			<tr><td><input id="addOrganizationPasswordConfirmInfo_input" class="register_textInput_n" type="text" defaultValue="确认密码" value="" title="仅支持如下符号:&#13;!$%^&*.~_-@,"></td></tr>
			<tr><td><input id="addOrganizationPasswordConfirm_input" class="register_textInput_n" type="password" value="" onkeypress='return validateSpecialCharacterSimple();' title="仅支持如下符号:&#13;!$%^&*.~_-@,"></td></tr>
			<tr style="height:20px;"><td><span class="error_tip" id="addOrganizationPasswordConfirm_input_tip"></span></td></tr>
			<tr><td><div class="addInformation_input_title">请输入用户姓名：</div></td></tr>
			<tr><td><input id="addOrganizationUsername_input" class="register_textInput_n" type="text" defaultValue="姓名" value="" maxLength="32"></td></tr>
			<tr style="height:20px;"><td><span class="error_tip" id="addOrganizationUsername_input_tip"></span></td></tr>
		</table>
		<div style="margin: 20px;margin-top: 0;cursor: default;float: left;">
			<input id="new_organization_confirmBtn" class="signinBtn_n" type="button" value="确认" onfocus='this.blur();'>
			<!-- <input id="new_organization_cancelBtn" class="cancelBtn_n" type="button" value="取消" onfocus='this.blur();'> -->
			<font id="new_organization_cancelBtn" class="font-gray font-blue" style="padding-left: 5px; cursor: pointer;"><a>取消</a></font>
		</div>
		<div id="new_organization_close" class="signin_close_n"></div>
	</div>
	</script>
</body>
</html>
