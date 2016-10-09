/**
 * 登录前界面的登录和注册交互
 */
$(function(){
LoginView = Backbone.View.extend({
	el: $("#login_wd"),
	initialize: function () {
		// 构造函数，实例化一个World集合类，并且以字典方式传入AppView的对象
		this.logins = new Logins(/*null, { view : this }*/);
		this.rander();
	},
	events: {
		"click #loginBtn": "doLogin", // 事件绑定，绑定Dom中id为check的元素
		"mouseover #loginBtn": "changeloginState4mouseover",
		"mousedown #loginBtn": "changeloginState4mousedown",
		"mouseout #loginBtn": "changeloginState4mouseout",
		"mouseover #reset": "changeresetState4mouseover",
		"mousedown #reset": "changeresetState4mousedown",
		"mouseout #reset": "changeresetState4mouseout",
		"click #reset": "cancel",
		"focus #loginName": "changeLoginTextSelected",
		"blur #loginName": "changeLoginTextNotSelected",
		"focus #pwd": "changePswTextSelected",
		"blur #pwd": "changePswTextNotSelected",
		"mouseover #remeberPsw": "changeCheckboxmouseover",
		"mouseout #remeberPsw": "changeCheckboxmouseout",
		"click #remeberPsw": "onCheckBoxClick"
	},
	rander : function () {
		var loginTemplate = _.template($("#login_template").html());
		$(this.el).html(loginTemplate);
	},
	doLogin: function (e) {
		var loginName = $("#loginName").val();
		var pwd = $("#pwd").val();
		if ($.trim(loginName) == '') {
			alert('请输入用户名!');
			return;
		}
		if ($.trim(pwd) == '') {
			alert('请输入密码!');
			return;
		}
		var user = new LoginModel({ loginName: loginName, pwd: pwd });
		this.logins.add(user);
		var url = contextPath + "/login.do?loginName=" + loginName + "&pwd=" + pwd +"&isClient=1";//$.md5(pwd)
		var map = new HashMap();
		map.put("selectedId",selectedId);
		operateServerData(url,this.logins,this.changeToMain,map);	
		//this.changeToMain("",map);
	},
	changeToMain: function(response,map){//登录成功后，跳转到主界面
		var selectedId = map.get("selectedId");
		window.location.href=contextPath + "/framework/main.jsp?selectedId=" + selectedId + "&userId=" + response.data.id;
	},
	changeloginState4mouseover: function(){
		$("#loginBtn").removeClass("loginButton_n");
		$("#loginBtn").addClass("loginButton_f");
	},
	changeloginState4mousedown: function(){
		$("#loginBtn").removeClass("loginButton_f");
		$("#loginBtn").addClass("loginButton_p");
	},
	changeloginState4mouseout: function(){
		$("#loginBtn").removeClass("loginButton_f");
		$("#loginBtn").removeClass("loginButton_p");
		$("#loginBtn").addClass("loginButton_n");
	},
	changeresetState4mouseover: function(){
		$("#reset").removeClass("resetButton_n");
		$("#reset").addClass("resetButton_f");
	},
	changeresetState4mousedown: function(){
		$("#reset").removeClass("resetButton_f");
		$("#reset").addClass("resetButton_p");
	},
	changeresetState4mouseout: function(){
		$("#reset").removeClass("resetButton_f");
		$("#reset").removeClass("resetButton_p");
		$("#reset").addClass("resetButton_n");
	},
	cancel: function(){
		$("#blackboard").hide();
		$("#login_wd").hide();
	},
	changeLoginTextSelected: function(){
		$("#loginName").removeClass("textInput_n");
		$("#loginName").addClass("textInput_p");
	},
	changeLoginTextNotSelected: function(){
		$("#loginName").removeClass("textInput_p");
		$("#loginName").addClass("textInput_n");
	},
	changePswTextSelected: function(){
		$("#pwd").removeClass("textInput_n");
		$("#pwd").addClass("textInput_p");
	},
	changePswTextNotSelected: function(){
		$("#pwd").removeClass("textInput_p");
		$("#pwd").addClass("textInput_n");
	},
	changeCheckboxmouseover: function(){
		var curClass = $("#remeberPsw").attr("class");
		if (curClass == "checkbox_n") {
			$("#remeberPsw").removeClass("checkbox_n");
			$("#remeberPsw").addClass("checkbox_f");
		} else if (curClass == "checkbox_on_n") {
			$("#remeberPsw").removeClass("checkbox_on_n");
			$("#remeberPsw").addClass("checkbox_on_f");
		}
	},
	changeCheckboxmouseout: function(){
		var curClass = $("#remeberPsw").attr("class");
		if (curClass == "checkbox_f") {
			$("#remeberPsw").removeClass("checkbox_f");
			$("#remeberPsw").addClass("checkbox_n");
		} else if (curClass == "checkbox_on_f") {
			$("#remeberPsw").removeClass("checkbox_on_f");
			$("#remeberPsw").addClass("checkbox_on_n");
		}
	},
	onCheckBoxClick: function(){
		var curClass = $("#remeberPsw").attr("class");
		if (curClass == "checkbox_f") {//未选中->选中
			$("#remeberPsw").removeClass("checkbox_f");
			$("#remeberPsw").addClass("checkbox_on_f");
			addCookie(true, "#loginName", "#pwd");
		} else if (curClass == "checkbox_on_f") {//选中->未选中
			$("#remeberPsw").removeClass("checkbox_on_f");
			$("#remeberPsw").addClass("checkbox_f");
			addCookie(false, "#loginName", "#pwd");
		}
	}
});

SigninView = Backbone.View.extend({
	el: $("#signin_wd"),
	initialize: function () {
		// 构造函数，实例化一个World集合类，并且以字典方式传入AppView的对象
//		this.logins = new Logins(/*null, { view : this }*/);
		this.rander();
	},
	events: {
		"focus input": "textInputFocus",
		"blur input": "textInputBlur",
		//新增简单用户信息窗口
		"mouseover #new_simple_user_confirmBtn":"confirmBtnOver",
		"mouseout #new_simple_user_confirmBtn":"confirmBtnOut",
		"mousedown #new_simple_user_confirmBtn":"confirmBtnDown",
		"mouseup #new_simple_user_confirmBtn":"confirmBtnUp",
		"mouseover #new_simple_user_cancelBtn":"cancelBtnOver",
		"mouseout #new_simple_user_cancelBtn":"cancelBtnOut",
		"mousedown #new_simple_user_cancelBtn":"cancelBtnDown",
		"mouseup #new_simple_user_cancelBtn":"cancelBtnUp",			
		"mouseover #new_simple_user_close":"confirmCloseOver",
		"mouseout #new_simple_user_close":"confirmCloseOut",
		"click #new_simple_user_close":"confirmCloseClick",
		//新增简单组织信息窗口
		"mouseover #new_organization_confirmBtn": "confirmBtnOver",
		"mouseout #new_organization_confirmBtn": "confirmBtnOut",
		"mousedown #new_organization_confirmBtn": "confirmBtnDown",
		"mouseup #new_organization_confirmBtn": "confirmBtnUp",
		"mouseover #new_organization_cancelBtn": "cancelBtnOver",
		"mouseout #new_organization_cancelBtn": "cancelBtnOut",
		"mousedown #new_organization_cancelBtn": "cancelBtnDown",
		"mouseup #new_organization_cancelBtn": "cancelBtnUp",
		"mouseover #new_organization_close": "confirmCloseOver",
		"mouseout #new_organization_close": "confirmCloseOut",
		"click #new_organization_close": "confirmCloseClick"
	},
	organizationName: function(name, note){
		if(inputHasNoContent(name)){
			$("#"+note).css("color", "red");
			$("#"+note).text("组织名不能为空,请重新输入");
			$("#"+note).show();
			return false;
		}else{
			return true;
		}
	},
	signinNameCheck: function(name, note){
		if(inputHasNoContent(name)){
			$("#"+note).css("color", "red");
			$("#"+note).text("用户名不能为空,请重新输入");
			$("#"+note).show();
			return false;
		}else{
			return true;
		}
	},
	mailboxCheck: function(name, note){
		var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(!myreg.test($("#"+name).val())||inputHasNoContent(name)){
			$("#"+note).css("color", "red");
			$("#"+note).text("请输入正确的邮箱地址");
			$("#"+note).show();
			return false;
		}else{
			return true;
		}
	},
	signinpwdCheck: function(name, note){
		
		/*var myreg = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\_]{6,16}$/;
		if(!myreg.test($("#"+name).val())){
			$("#"+note).css("color", "red");
			$("#"+note).text("6~16位字符，区分大小写");
			$("#"+note).show();
			return false;
		}*/
		
//		var myreg =/^[0-9]{6,16}$/;
		var myreg = /^(?=.*\d.*)(?=.*[a-zA-Z].*)|(?=.*\d.*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*)|(?=.*[a-zA-Z].*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*).{6,16}$/;
		if(!myreg.test($("#"+name).val())||inputHasNoContent(name)){
			$("#"+note).css("color", "red");
			$("#"+note).text("密码过于简单，请尝试6~16位“字母、数字、符号”的组合");
			$("#"+note).show();
			return false;
		}
		
		return true;
	},
	signinpwdConfirmCheck: function(name1, name2, note){
		if($("#"+name1).val() != $("#"+name2).val()){
			$("#"+note).css("color", "red");
			$("#"+note).text("密码输入不一致，请重新输入");
			$("#"+note).show();
			return false;
		}
		return true;
	},
	doSignin: function(){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		var id = target.id;
		if(id == "new_simple_user_confirmBtn"){
			if(this.mailboxCheck("addSimpleUserEmail_input", "addSimpleUserEmail_input_tip")&&
				this.signinpwdCheck("addSimpleUserPassword_input", "addSimpleUserPassword_input_tip")&&
				this.signinpwdConfirmCheck("addSimpleUserPassword_input", "addSimpleUserPasswordConfirm_input", "addSimpleUserPasswordConfirm_input_tip")&&
				this.signinNameCheck("addSimpleUsername_input", "addSimpleUsername_input_tip")){
				
				var email = $("#addSimpleUserEmail_input").val();
				var password = $("#addSimpleUserPassword_input").val();
				var userName = $("#addSimpleUsername_input").val();
				var url = contextPath + '/userRegister.do?data={"email":"'+email+'","password":"'+password+'","userName":"'+encodeURIComponent(userName)+'"}';
				$.ajax({
					url: url,
					type: "post", 
					success: function(data, textStatus){
//						alert("注册成功");
						data = JSON2.parse(data);
						if(data.returnFlag == -1){
							alert(data.data);
						}else{
							$("#blackboard").hide();
							$("#signin_wd").hide();
						}
			      }});
			}else{
			}
		}else if(id == "new_organization_confirmBtn"){
			if(this.organizationName("addOrganizationName_input", "addOrganizationName_input_tip")&&
				this.mailboxCheck("addOrganizationEmail_input", "addOrganizationEmail_input_tip")&&
				this.signinpwdCheck("addOrganizationPassword_input", "addOrganizationPassword_input_tip")&&
				this.signinpwdConfirmCheck("addOrganizationPassword_input", "addOrganizationPasswordConfirm_input", "addOrganizationPasswordConfirm_input_tip")&&
				this.signinNameCheck("addOrganizationUsername_input", "addOrganizationUsername_input_tip")){
				
				var name = $("#addOrganizationName_input").val();
				var email = $("#addOrganizationEmail_input").val();
				var password = $("#addOrganizationPassword_input").val();
				var userName = $("#addOrganizationUsername_input").val();
				var url = contextPath + '/userRegister.do?data={"organizationName":"'+encodeURIComponent(name)+'","email":"'+email+'","password":"'+password+'","userName":"'+encodeURIComponent(userName)+'"}';
//				operateServerData(url, logins);
				$.ajax({
					url: url,
					type: "post", 
					success: function(data, textStatus){
//						alert("注册成功");
						data = JSON2.parse(data);
						if(data.returnFlag == -1){
							alert(data.data);
						}else{
							$("#blackboard").hide();
							$("#signin_wd").hide();
						}
			      }});
			}else{
			}
		}
	},
	confirmCloseClick: function(){
		$("#blackboard").hide();
		$("#signin_wd").hide();
	},
	rander : function () {
		var signinTemplate = _.template($("#signin_template").html());
		$(this.el).html(signinTemplate);
	},
	textInputFocus: function(event) {
		var e = event || window.event;
		var target = e.srcElement || e.target;
		var defaultValue = $(target).attr("defaultValue");
		
		if($(target).attr("id") == "addSimpleUserPasswordInfo_input"){
			$("#addSimpleUserPasswordInfo_input").hide();
			$("#addSimpleUserPassword_input").show();
			setTimeout(function(){
				$("#addSimpleUserPassword_input").focus();
				$("#addSimpleUserPassword_input").select();
			}, 500);
		}else if($(target).attr("id") == "addSimpleUserPassword_input"){
			$(target).removeClass("register_textInput_n");
			$(target).addClass("register_textInput_p");
			$("#addSimpleUserPassword_input_tip").hide();
		}else if($(target).attr("id") == "addSimpleUserPasswordConfirmInfo_input"){
			$("#addSimpleUserPasswordConfirmInfo_input").hide();
			$("#addSimpleUserPasswordConfirm_input").show();
			setTimeout(function(){
				$("#addSimpleUserPasswordConfirm_input").focus();
				$("#addSimpleUserPasswordConfirm_input").select();
			}, 500);
		}else if($(target).attr("id") == "addSimpleUserPasswordConfirm_input"){
			$(target).removeClass("register_textInput_n");
			$(target).addClass("register_textInput_p");
			$("#addSimpleUserPasswordConfirm_input_tip").hide();
		}else if($(target).attr("id") == "addOrganizationPasswordInfo_input"){
			$("#addOrganizationPasswordInfo_input").hide();
			$("#addOrganizationPassword_input").show();
			setTimeout(function(){
				$("#addOrganizationPassword_input").focus();
				$("#addOrganizationPassword_input").select();
			}, 500);
		}else if($(target).attr("id") == "addOrganizationPassword_input"){
			$(target).removeClass("register_textInput_n");
			$(target).addClass("register_textInput_p");
			$("#addOrganizationPassword_input_tip").hide();
		}else if($(target).attr("id") == "addOrganizationPasswordConfirmInfo_input"){
			$("#addOrganizationPasswordConfirmInfo_input").hide();
			$("#addOrganizationPasswordConfirm_input").show();
			setTimeout(function(){
				$("#addOrganizationPasswordConfirm_input").focus();
				$("#addOrganizationPasswordConfirm_input").select();
			}, 500);
		}else if($(target).attr("id") == "addOrganizationPasswordConfirm_input"){
			$(target).removeClass("register_textInput_n");
			$(target).addClass("register_textInput_p");
			$("#addOrganizationPasswordConfirm_input_tip").hide();
		}else if(target.type == "text"){
			if($.trim($(target).val()) == defaultValue 
					&& ($(target).css("color") == "#999999" 
						|| $(target).css("color")=="rgb(153, 153, 153)")){
				$(target).val("");
				$(target).addClass("register_textInput_change");
			}
			
			$(target).removeClass("register_textInput_n");
			$(target).addClass("register_textInput_p");
			
			var tip = $(target).parent().parent().next().children().children();
			if(!$(tip).is(":hidden")){
				$(tip).hide();
			}
		}
	},
	textInputBlur: function(event) {
		var e = event || window.event;
		var target = e.srcElement || e.target;
		var id = target.id;
		var defaultValue = $(target).attr("defaultValue");
		if($(target).attr("id") == "addSimpleUserPassword_input"){
			if($("#addSimpleUserPassword_input").val() == ""){
//			$("#addSimpleUserPasswordInfo_input").blur();
				$("#addSimpleUserPassword_input").hide();
				$("#addSimpleUserPasswordInfo_input").show();
				$("#addSimpleUserPasswordInfo_input").blur();
			}else{
				$("#addSimpleUserPassword_input").removeClass("register_textInput_p");
				$("#addSimpleUserPassword_input").addClass("register_textInput_n");
				this.signinpwdCheck("addSimpleUserPassword_input", "addSimpleUserPassword_input_tip");
			}
		}else if($(target).attr("id") == "addSimpleUserPasswordConfirm_input"){
			if($("#addSimpleUserPasswordConfirm_input").val() == ""){
				$("#addSimpleUserPasswordConfirm_input").hide();
				$("#addSimpleUserPasswordConfirmInfo_input").show();
				$("#addSimpleUserPasswordConfirmInfo_input").blur();
			}else{
				$("#addSimpleUserPasswordConfirm_input").removeClass("register_textInput_p");
				$("#addSimpleUserPasswordConfirm_input").addClass("register_textInput_n");
				this.signinpwdConfirmCheck("addSimpleUserPassword_input", "addSimpleUserPasswordConfirm_input", "addSimpleUserPasswordConfirm_input_tip");
			}
		}else if($(target).attr("id") == "addOrganizationPassword_input"){
			if($("#addOrganizationPassword_input").val() == ""){
				$("#addOrganizationPassword_input").hide();
				$("#addOrganizationPasswordInfo_input").show();
				$("#addOrganizationPasswordInfo_input").blur();
			}else{
				$("#addOrganizationPassword_input").removeClass("register_textInput_p");
				$("#addOrganizationPassword_input").addClass("register_textInput_n");
				this.signinpwdCheck("addOrganizationPassword_input", "addOrganizationPassword_input_tip");
			}
		}else if($(target).attr("id") == "addOrganizationPasswordConfirm_input"){
			if($("#addOrganizationPasswordConfirm_input").val() == ""){
				$("#addOrganizationPasswordConfirm_input").hide();
				$("#addOrganizationPasswordConfirmInfo_input").show();
				$("#addOrganizationPasswordConfirmInfo_input").blur();
			}else{
				$("#addOrganizationPasswordConfirm_input").removeClass("register_textInput_p");
				$("#addOrganizationPasswordConfirm_input").addClass("register_textInput_n");
				this.signinpwdConfirmCheck("addOrganizationPassword_input", "addOrganizationPasswordConfirm_input", "addOrganizationPasswordConfirm_input_tip");
			}
		}
		if(target.type == "text"){
			
			if($.trim($(target).val()) == ""){
				$(target).val(defaultValue);
				$(target).removeClass("register_textInput_change");
			}
			$(target).removeClass("register_textInput_p");
			$(target).addClass("register_textInput_n");
		}

		if(id == "addSimpleUserEmail_input" && $('#'+id).css("color") != "#999999" && 
				$('#'+id).css("color") != "rgb(153, 153, 153)"){
			this.mailboxCheck("addSimpleUserEmail_input", "addSimpleUserEmail_input_tip");
		/*}else if(id == "addSimpleUserPassword_input" && $('#'+id).css("color") != "#999999" && 
				$('#'+id).css("color") != "rgb(153, 153, 153)"){
			this.signinpwdCheck("addSimpleUserPassword_input", "addSimpleUserPassword_input_tip");*/
		}else if(id == "addSimpleUsername_input" && $('#'+id).css("color") != "#999999" && 
				$('#'+id).css("color") != "rgb(153, 153, 153)"){
			this.signinNameCheck("addSimpleUsername_input", "addSimpleUsername_input_tip");
		}else if(id == "addOrganizationName_input" && $('#'+id).css("color") != "#999999" && 
				$('#'+id).css("color") != "rgb(153, 153, 153)"){
			this.organizationName("addOrganizationName_input", "addOrganizationName_input_tip");
		}else if(id == "addOrganizationEmail_input" && $('#'+id).css("color") != "#999999" && 
				$('#'+id).css("color") != "rgb(153, 153, 153)"){
			this.mailboxCheck("addOrganizationEmail_input", "addOrganizationEmail_input_tip");
		/*}else if(id == "addOrganizationPassword_input" && $('#'+id).css("color") != "#999999" && 
				$('#'+id).css("color") != "rgb(153, 153, 153)"){
			this.signinpwdCheck("addOrganizationPassword_input", "addOrganizationPassword_input_tip");*/
		}else if(id == "addOrganizationUsername_input" && $('#'+id).css("color") != "#999999" && 
				$('#'+id).css("color") != "rgb(153, 153, 153)"){
			this.signinNameCheck("addOrganizationUsername_input", "addOrganizationUsername_input_tip");
		}
	},
	confirmCloseOver:function(event){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		$(target).removeClass($(target).attr("class"));
		$(target).addClass("signin_close_f");
	},
	confirmCloseOut:function(event){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		$(target).removeClass($(target).attr("class"));
		$(target).addClass("signin_close_n");
	},
	confirmCloseClick: function(){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		$(target).removeClass($(target).attr("class"));
		$(target).addClass("signin_close_f");
		$("#blackboard").hide();
		$("#signin_wd").hide();
	},
	confirmBtnOver: function(event){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		$(target).removeClass($(target).attr("class"));
		$(target).addClass("signinBtn_f");
	},
	confirmBtnOut: function(event){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		$(target).removeClass($(target).attr("class"));
		$(target).addClass("signinBtn_n");
	},
	confirmBtnDown: function(event){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		$(target).removeClass($(target).attr("class"));
		$(target).addClass("signinBtn_f");
	},
	confirmBtnUp: function(event){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		$(target).removeClass($(target).attr("class"));
		$(target).addClass("signinBtn_f");
//		var id = target.id;
		this.doSignin();
	},
	cancelBtnOver: function(){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		$(target).removeClass($(target).attr("class"));
		$(target).addClass("cancelBtn_f");
	},
	cancelBtnOut: function(){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		$(target).removeClass($(target).attr("class"));
		$(target).addClass("cancelBtn_n");
	},
	cancelBtnDown: function(event){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		$(target).removeClass($(target).attr("class"));
		$(target).addClass("cancelBtn_p");
	},
	cancelBtnUp: function(event){
		var e = event || window.event;
		var target = e.srcElement || e.target;
		$(target).removeClass($(target).attr("class"));
		$(target).addClass("cancelBtn_f");
		$("#blackboard").hide();
		$("#signin_wd").hide();
	}
});
function inputHasNoContent(inputId){
	var defaultValue = $("#" + inputId).attr("defaultValue");
	return $.trim($("#" + inputId).val()) == defaultValue 
		&& ($("#" + inputId).css("color") == "#999999" 
		|| $("#" + inputId).css("color")=="rgb(153, 153, 153)");
}
});