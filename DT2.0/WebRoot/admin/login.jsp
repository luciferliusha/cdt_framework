<%@ page contentType="text/html; charset=utf-8"%>
<html>
	<head>
		<title></title>
		<link rel="stylesheet" type="text/css"
			href="<%=request.getContextPath()%>/js/libs/easyui/themes/default/easyui.css">
		<link rel="stylesheet" type="text/css"
			href="<%=request.getContextPath()%>/js/libs/easyui/themes/icon.css">
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/css/admin/login.css" />
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/libs/jquery/jquery-1.7.2.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/libs/easyui/jquery.easyui.min.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/cookies.js"></script>


		<style type="text/css">
<!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}
-->
body,div{
	padding: 0;
	margin: 0;
	color: #333333;
	min-width: 800px;
	min-height: 600px;
	overflow: hidden; 
}

</style>
<script type="text/javascript">
	function changeloginState4mouseover() {
		$("#login").removeClass("loginButton_n");
		$("#login").addClass("loginButton_f");
	}
	function changeloginState4mouseout() {
		$("#login").removeClass("loginButton_f");
		$("#login").removeClass("loginButton_p");
		$("#login").addClass("loginButton_n");
	}
	function changeloginState4mousedown() {
		$("#login").removeClass("loginButton_f");
		$("#login").addClass("loginButton_p");
	}
	function changeresetState4mouseover() {
		$("#reset").removeClass("resetButton_n");
		$("#reset").addClass("resetButton_f");
	}
	function changeresetState4mouseout() {
		$("#reset").removeClass("resetButton_f");
		$("#reset").removeClass("resetButton_p");
		$("#reset").addClass("resetButton_n");
	}
	function changeresetState4mousedown() {
		$("#reset").removeClass("resetButton_f");
		$("#reset").addClass("resetButton_p");
	}
	function changeLoginTextSelected() {
		$("#loginName").removeClass("textInput_n");
		$("#loginName").addClass("textInput_p");
	}
	function changeLoginTextNotSelected() {
		$("#loginName").removeClass("textInput_p");
		$("#loginName").addClass("textInput_n");
	}
	function changePswTextSelected() {
		$("#pwd").removeClass("textInput_n");
		$("#pwd").addClass("textInput_p");
	}
	function changePswTextNotSelected() {
		$("#pwd").removeClass("textInput_p");
		$("#pwd").addClass("textInput_n");
	}
	function changeCheckboxmouseout() {
		var curClass = $("#remeberPsw").attr("class");
		if (curClass == "checkbox_f") {
			$("#remeberPsw").removeClass("checkbox_f");
			$("#remeberPsw").addClass("checkbox_n");
		}
		else if (curClass == "checkbox_on_f") {
			$("#remeberPsw").removeClass("checkbox_on_f");
			$("#remeberPsw").addClass("checkbox_on_n");
		}
	}
	function changeCheckboxmouseover() {
		var curClass = $("#remeberPsw").attr("class");
		if (curClass == "checkbox_n") {
			$("#remeberPsw").removeClass("checkbox_n");
			$("#remeberPsw").addClass("checkbox_f");
		}
		else if (curClass == "checkbox_on_n") {
			$("#remeberPsw").removeClass("checkbox_on_n");
			$("#remeberPsw").addClass("checkbox_on_f");
		}
	}
	function onCheckBoxClick() {
		var curClass = $("#remeberPsw").attr("class");
		if (curClass == "checkbox_f") {//未选中->选中
			$("#remeberPsw").removeClass("checkbox_f");
			$("#remeberPsw").addClass("checkbox_on_f");
			addCookie(true, "#loginName", "#pwd");
		}
		else if (curClass == "checkbox_on_f") {//选中->未选中
			$("#remeberPsw").removeClass("checkbox_on_f");
			$("#remeberPsw").addClass("checkbox_f");
			addCookie(false, "#loginName", "#pwd");
		}
	}
	function changeCheckboxSelectedmouseout() {
		$("#remeberPsw").removeClass("checkbox_on_n");
		$("#remeberPsw").addClass("checkbox_on_f");
	}
	function changeCheckboxSelectedmouseover() {
		$("#remeberPsw").removeClass("checkbox_on_f");
		$("#remeberPsw").addClass("checkbox_on_n");
	}
	/** 验证登录输入信息 */
	function checkLogin() {
		if ($.trim($("#loginName").val()) == "") {
			alert("请输入账户名!");
			$("#loginName").focus();
			return false;
		}
		if ($.trim($("#pwd").val()) == "") {
			alert("请输入密码!");
			$("#pwd").focus();
			return false;
		}
	
		return true;
	}
</script>
	</head>
	<body style="margin: 0; overflow: hidden;">
		<div id="top">
			<div id="logo">
				<img alt="" src="<%=request.getContextPath() %>/images/top/head-bg-logobutton-n-green.png">
			</div>
			<div id="logo_right" style="float: right;">
			</div>
		</div>
		<div id="login_bg">
			<form id="form1" name="form1" action="<%=request.getContextPath() %>/adminLogin.do" method="post"
				onsubmit="checkLogin()">
				<table width="100%" height="100%" border="0" cellspacing="0"
					cellpadding="0" style="margin: 0; overflow: hidden;">
					<tr>
						<td>
							<table border="0" align="center" cellspacing="0" cellpadding="0">
								<tr>
									<td width="1101" height="420"
										style="background: url(<%=request.getContextPath() %>/images/admin/login/loginbg.png); background-position: center; padding-left: 180px;"
										align="center">
										<table border="0" cellpadding="0" cellspacing="0" height="230">
											<tr>
												<td colspan="2" height="18" align="center">
													<label id="info"
														style="color: #ff0000; font-size: 12px; padding-left: 2px;"><%=request.getAttribute("info") == null ? "" : request
					.getAttribute("info")%></label>
												</td>
											</tr>
											<tr height="40">
												<td width="60" height="40" valign="middle">
													<label class="labelStyle">
														用户名:
													</label>
												</td>
												<td width="238" height="40" valign="middle"
													style="padding-top: 5px;">
													<input class="easyui-validatebox textInput_n" type="text"
														required="true" missingMessage="请输入账户" name="loginName"
														id="loginName" ltype="text"
														onfocus="changeLoginTextSelected()"
														onblur="changeLoginTextNotSelected()" maxlength="15" />
												</td>
											</tr>
											<tr height="40">
												<td>
													<label class="labelStyle">
														密码:
													</label>
												</td>
												<td height="40" valign="middle" style="padding-top: 5px;">
													<input class="easyui-validatebox textInput_n"
														type="password" required="true" missingMessage="请输入密码"
														name="pwd" id="pwd" ltype="password"
														onfocus="changePswTextSelected()"
														onblur="changePswTextNotSelected()" maxlength="25" />
												</td>
											</tr>
											<tr>
												<td>
													&nbsp;
												</td>
												<td height="40" valign="bottom">
													<input class="checkbox_n" name="remeberPsw" id="remeberPsw"
														type="button" onmouseout="changeCheckboxmouseout()"
														onmouseover="changeCheckboxmouseover()"
														onclick="onCheckBoxClick()" onfocus='this.blur();' />
													<label for="remeberPsw"
														style="vertical-align: middle; font-family: 'Microsoft YaHei' !important, simsun; font-size: 12px; height: 23px; padding-top: 1px;">
														记住密码
													</label>
												</td>
											</tr>
											<tr>
												<td>
													&nbsp;
												</td>
												<td align="left" height="40" valign="bottom">
													<input class="loginButton_n" id="login" type="submit"
														value="登录" onmouseover="changeloginState4mouseover()"
														onmousedown="changeloginState4mousedown()"
														onmouseout="changeloginState4mouseout()"
														onfocus='this.blur();'>
													&nbsp;&nbsp;
													<input class="resetButton_n" id="reset" type="reset"
														value="重置" onmouseover="changeresetState4mouseover()"
														onmousedown="changeresetState4mousedown()"
														onmouseout="changeresetState4mouseout()"
														onfocus='this.blur();'>
												</td>
											</tr>
											<tr>
												<td>
													&nbsp;
												</td>
												<td>
													&nbsp;
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</form>
		</div>
	</body>
</html>