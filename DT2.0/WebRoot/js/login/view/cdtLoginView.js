/**
 * 登录界面
 */
$(function() {
	CdtLoginView = Backbone.View.extend({
		el: $("#login-rightView"),
		initialize: function () {
			this.logins = new Logins(/*null, { view : this }*/);
			this.rander();
		},
		events: {
			"focus input": "textInputFocus",
			"blur input": "textInputBlur",
			"mouseover #cdt-login": "cdtLoginMouseover",
			"mouseout #cdt-login": "cdtLoginMouseout",
			"mousedown #cdt-login": "cdtLoginMousedown",
			"mouseup #cdt-login": "cdtLoginMouseup",
			/*"mouseover #checkbox-login": "checkboxMouseover",
			"mouseout #checkbox-login": "checkboxMouseout",
			"click #checkbox-login": "checkboxClick",*/
			"click #personalRegister": "personalRegister",
			"click #enterpriseRegister": "enterpriseRegister"
		},
		rander : function () {
			document.title = sysName;
			var loginLeftTmp = _.template($("#login-leftView-template").html(),{LOGIN_PIC_SUMMARY:LOGIN_PIC_SUMMARY,LOGIN_PIC_BGIMG:contextPath+LOGIN_PIC_BGIMG});
			$("#login-leftView").html(loginLeftTmp);
			var loginRightTemplate = _.template($("#login-rightView-template").html(),{sysNameStyle:sysNameStyle,sysName:sysName});
			$(this.el).html(loginRightTemplate);
			var loginBottomTemplate = _.template($("#login-bottomView-template").html(),{rightName:rightName,techniqueName:techniqueName});
			$("#login-bottomView").html(loginBottomTemplate);
			$("#loginName").val($("#loginName").attr("defaultValue"));
			$("#pwdInfo").val($("#pwdInfo").attr("defaultValue"));
		},
		textInputFocus: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			var defaultValue = $(target).attr("defaultValue");
			if($(target).attr("id") == "pwdInfo"){
				setTimeout(function(){
					$("#pwdInfo").hide();
					$("#pwd").show();
					$("#pwd").focus();
					$("#pwd").select();
				}, 0.01);
			}else if($(target).attr("id") == "pwd"){
				$(target).addClass("login-input-change");
				$(target).removeClass("login-input-n");
				$(target).addClass("login-input-f");
			}else if($(target).attr("id") == "loginName"){
				if($.trim($(target).val()) == defaultValue){
					$(target).val("");
				}
				$(target).addClass("login-input-change");
				$(target).removeClass("login-input-n");
				$(target).addClass("login-input-f");
			}
		},
		textInputBlur: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			var defaultValue = $(target).attr("defaultValue");
			if($(target).attr("id") == "pwd"){
				if($("#pwd").val() == ""){
					$("#pwd").hide();
					$("#pwdInfo").show();
					$("#pwdInfo").blur();
				}else{
					$("#pwd").removeClass("login-input-f");
					$("#pwd").addClass("login-input-n");
				}
			}else if($(target).attr("id") == "loginName"){
				if($.trim($(target).val()) == ""){
					$(target).val(defaultValue);
					$(target).removeClass("login-input-change");
				}
				$(target).removeClass("login-input-f");
				$(target).addClass("login-input-n");
			}
		},
		cdtLoginMouseover: function(){
			$("#cdt-login").removeClass("cdt-login-n");
			$("#cdt-login").addClass("cdt-login-f");
		},
		cdtLoginMouseout: function(){
			$("#cdt-login").removeClass("cdt-login-f");
			$("#cdt-login").removeClass("cdt-login-p");
			$("#cdt-login").addClass("cdt-login-n");
		},
		cdtLoginMousedown: function(){
			$("#cdt-login").removeClass("cdt-login-f");
			$("#cdt-login").addClass("cdt-login-p");
		},
		cdtLoginMouseup: function(){
			$("#cdt-login").removeClass("cdt-login-p");
			$("#cdt-login").addClass("cdt-login-f");
			
			this.doLogin();
		},
		checkboxMouseover: function(){
			if($("#checkbox-login").attr("class") == "checkbox-login-n"){
				$("#checkbox-login").removeClass("checkbox-login-n");
				$("#checkbox-login").addClass("checkbox-login-f");
			}
		},
		checkboxMouseout: function(){
			if($("#checkbox-login").attr("class") == "checkbox-login-f"){
				$("#checkbox-login").removeClass("checkbox-login-f");
				$("#checkbox-login").addClass("checkbox-login-n");
			}
		},
		checkboxClick: function(){
			var curClass = $("#checkbox-login").attr("class");
			if(curClass == "checkbox-login-f"){
				$("#checkbox-login").removeClass("checkbox-login-f");
				$("#checkbox-login").addClass("checkbox-login-p");
			}else if(curClass == "checkbox-login-p"){
				$("#checkbox-login").removeClass("checkbox-login-p");
				$("#checkbox-login").addClass("checkbox-login-f");
			}
		},
		doLogin: function (e) {
			if(!checkBrowserVersions()){
				//alert("您的浏览器版本过低，IE请使用IE8及以上版本，推荐使用Google Chrome 浏览器");
				$.messager.alert("操作提示", "抱歉！您的浏览器版本过低，请先更新您的浏览器！","error");
				return;
			}
			var loginName = $("#loginName").val();
			var pwd = $("#pwd").val();
			var rolename='';
			if ($.trim(loginName) == '' || $.trim(loginName) == $("#loginName").attr("defaultValue")) {
				//alert('请输入用户名!');
				$.messager.alert("操作提示", "请输入用户名!","error", function(){
					$("#loginName").focus();
				});
				return;
			}
			else if (validateRules.isSingleQuotation($.trim(loginName))) {
				//alert('用户名或密码错误!');//输入的用户名格式不正确,不能包含单引号\'和尖括号<>! //格式错误的情况下也是提示用户名或密码错误
				$.messager.alert("操作提示", "用户名或密码错误!","error");
				return;
			}
			if ($.trim(pwd) == '') {
				//alert('请输入密码!');
				$.messager.alert("操作提示", "请输入密码!","error", function(){
					$("#pwd").focus();
				});
				return;
			}
			else if (validateRules.isSingleQuotation($.trim(pwd))) {
				//alert('用户名或密码错误!');//输入的密码格式不正确,,不能包含单引号\'和尖括号<>!
				$.messager.alert("操作提示", "用户名或密码错误!","error");
				return;
			}
			//wangwenliang add 2015-0915 start
			this.doLoginAjax(loginName, pwd,rolename);
			//this.changeToMain("",map);
		},
		doLoginAjax: function(loginName, pwd,rolename){
			loginName = replaceSpecialCharacter(loginName);
			pwd = replaceSpecialCharacter(pwd);
			rolename=replaceSpecialCharacter(rolename);
			var user = new LoginModel({ loginName: loginName, pwd: pwd });
			this.logins.add(user);
			var url = contextPath + "/login.do?loginName=" + loginName + "&pwd=" + pwd +"&isClient=1"+"&rolename="+rolename;//$.md5(pwd)
			 //wangwenliang add 2015-0915 end
			var map = new HashMap();
			map.put("selectedId",selectedId);
			
			if(isFromOrm){
				doLogin(loginName, pwd, firstSolutionSelected, map);
			}else{
				operateServerData(url,this.logins,this.changeToMain,map);	
			}
		},
		changeToMain: function(response,map){//登录成功后，跳转到主界面
			firstSolutionSelected();
			var selectedId = map.get("selectedId");
			//window.location.href=contextPath + "/framework/main.jsp?selectedId=" + selectedId + "&userId=" + response.data.id;
			window.location.href=contextPath + "/framework/framework.jsp";
		},
		personalRegister: function() {
			$("#new_organization").hide();
			$("#new_simple_user").show();
			registerSimpleUserShow();
		},
		enterpriseRegister: function() {
			$("#new_simple_user").hide();
			$("#new_organization").show();
			registerOrganizationShow();
		}
	});
	function firstSolutionSelected(){
		var curClass = $("#checkbox-login").prop("checked");
		if (curClass) {//未选中->选中
			addCookie(true, "#loginName", "#pwd", contextPath);
		} else{//选中->未选中
			addCookie(false, "#loginName", "#pwd", contextPath);
		}
	}
	function registerSimpleUserShow(){
		$("#addSimpleUserEmail_input").removeClass("register_textInput_change");
		$("#addSimpleUserPassword_input").removeClass("register_textInput_change");
		$("#addSimpleUsername_input").removeClass("register_textInput_change");
		$("#addSimpleUserEmail_input").val($("#addSimpleUserEmail_input").attr("defaultValue"));
		$("#addSimpleUserPassword_input").val("");
		$("#addSimpleUserPasswordConfirm_input").val("");
		$("#addSimpleUserPassword_input").hide();
		$("#addSimpleUserPasswordConfirm_input").hide();
		$("#addSimpleUserPasswordInfo_input").show();
		$("#addSimpleUserPasswordConfirmInfo_input").show();
		$("#addSimpleUserPasswordInfo_input").val($("#addSimpleUserPasswordInfo_input").attr("defaultValue"));
		$("#addSimpleUserPasswordConfirmInfo_input").val($("#addSimpleUserPasswordConfirmInfo_input").attr("defaultValue"));
		$("#addSimpleUsername_input").val($("#addSimpleUsername_input").attr("defaultValue"));
		$("#blackboard").show();
		$("#signin_wd").show();
		$("#new_simple_user .error_tip").each(function(){
			if(!$(this).is(":hidden")){
				$(this).hide();
			}
		});
	}
	function registerOrganizationShow(){
		$("#addOrganizationName_input").removeClass("register_textInput_change");
		$("#addOrganizationEmail_input").removeClass("register_textInput_change");
		$("#addOrganizationPassword_input").removeClass("register_textInput_change");
		$("#addOrganizationUsername_input").removeClass("register_textInput_change");
		$("#addOrganizationName_input").val($("#addOrganizationName_input").attr("defaultValue"));
		$("#addOrganizationEmail_input").val($("#addOrganizationEmail_input").attr("defaultValue"));
		$("#addOrganizationPassword_input").val("");
		$("#addOrganizationPasswordConfirm_input").val("");
		$("#addOrganizationPassword_input").hide();
		$("#addOrganizationPasswordConfirm_input").hide();
		$("#addOrganizationPasswordInfo_input").show();
		$("#addOrganizationPasswordConfirmInfo_input").show();
		$("#addOrganizationPasswordInfo_input").val($("#addOrganizationPasswordInfo_input").attr("defaultValue"));
		$("#addOrganizationPasswordConfirmInfo_input").val($("#addOrganizationPasswordConfirmInfo_input").attr("defaultValue"));
		$("#addOrganizationUsername_input").val($("#addOrganizationUsername_input").attr("defaultValue"));
		$("#blackboard").show();
		$("#signin_wd").show();
		$("#new_organization .error_tip").each(function(){
			if(!$(this).is(":hidden")){
				$(this).hide();
			}
		});
	}
	
	CdtSigninView = Backbone.View.extend({
		el: $("#signin_wd"),
		initialize: function () {
			// 构造函数，实例化一个World集合类，并且以字典方式传入AppView的对象
//			this.logins = new Logins(/*null, { view : this }*/);
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
//			"mouseover #new_simple_user_cancelBtn":"cancelBtnOver",
//			"mouseout #new_simple_user_cancelBtn":"cancelBtnOut",
//			"mousedown #new_simple_user_cancelBtn":"cancelBtnDown",
			"mouseup #new_simple_user_cancelBtn":"cancelBtnUp",			
			"mouseover #new_simple_user_close":"confirmCloseOver",
			"mouseout #new_simple_user_close":"confirmCloseOut",
			"click #new_simple_user_close":"confirmCloseClick",
			//新增简单组织信息窗口
			"mouseover #new_organization_confirmBtn": "confirmBtnOver",
			"mouseout #new_organization_confirmBtn": "confirmBtnOut",
			"mousedown #new_organization_confirmBtn": "confirmBtnDown",
			"mouseup #new_organization_confirmBtn": "confirmBtnUp",
//			"mouseover #new_organization_cancelBtn": "cancelBtnOver",
//			"mouseout #new_organization_cancelBtn": "cancelBtnOut",
//			"mousedown #new_organization_cancelBtn": "cancelBtnDown",
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
			}
			else if (validateRules.isSingleQuotation($("#" + name).val())) {
				$("#"+note).css("color", "red");
				$("#"+note).text("组织名格式输入不正确,不能包含单引号'和尖括号<>");
				$("#"+note).show();
				return false;
			}
			else{
				return true;
			}
		},
		signinNameCheck: function(name, note){
			if(inputHasNoContent(name)){
				$("#"+note).css("color", "red");
				$("#"+note).text("用户姓名不能为空,请重新输入");
				$("#"+note).show();
				return false;
			}
			else if (validateRules.isSingleQuotation($("#" + name).val())) {
				$("#"+note).css("color", "red");
				$("#"+note).text("用户姓名格式输入不正确,不能包含单引号'和尖括号<>");
				$("#"+note).show();
				return false;
			}
			else{
				return true;
			}
		},
		mailboxCheck: function(name, note){
			var myreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;///^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
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
			
			if($.trim($("#"+name).val()) == ""){
				$("#"+note).css("color", "red");
				$("#"+note).text("密码不能为空");
				$("#"+note).show();
				return false;
			}
			//var myreg = /^(?=.*\d.*)(?=.*[a-zA-Z].*)|(?=.*\d.*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*)|(?=.*[a-zA-Z].*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*){6,16}$/;
			var myreg = /^[0-9A-Za-z\!\$\%\^\&\*\.\~\_\-\@\,\.]{6,16}$/;
			if(!myreg.test($("#"+name).val())){
				$("#"+note).css("color", "red");
				$("#"+note).text("请输入6-16位数字、字母或符号，区分大小写");
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
					var password = replaceSpecialCharacter($("#addSimpleUserPassword_input").val());
					var userName = replaceQuotation($.trim($("#addSimpleUsername_input").val()));
					var url = contextPath + '/userRegister.do?data={"email":"'+email+'","password":"'+password+'","userName":"'+encodeURIComponent(userName)+'"}';
					$.ajax({
						url: url,
						type: "post", 
						success: function(data, textStatus){
//							alert("注册成功");
							data = JSON2.parse(data);
							if(data.returnFlag == -1){
								//alert(data.data);
								$.messager.alert("操作提示", data.data,"error");
							}else{
								$.messager.show({
									title:'提示',
									msg:'注册成功!',
									timeout:1500,
									showType:'slide',
									width: 150,
									height: 70,
									right:0
								});
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
					
					var name = replaceQuotation($.trim($("#addOrganizationName_input").val()));
					var email = $("#addOrganizationEmail_input").val();
					var password = replaceSpecialCharacter($("#addOrganizationPassword_input").val());
					var userName = replaceQuotation($.trim($("#addOrganizationUsername_input").val()));
					var url = contextPath + '/userRegister.do?data={"organizationName":"'+encodeURIComponent(name)+'","email":"'+email+'","password":"'+password+'","userName":"'+encodeURIComponent(userName)+'"}';
//					operateServerData(url, logins);
					$.ajax({
						url: url,
						type: "post", 
						success: function(data, textStatus){
//							alert("注册成功");
							data = JSON2.parse(data);
							if(data.returnFlag == -1){
								//alert(data.data);
								$.messager.alert("操作提示", data.data,"error");
							}else{
								$.messager.show({
									title:'提示',
									msg:'注册成功!',
									timeout:1500,
									showType:'slide',
									width: 150,
									height: 70,
									right:0
								});
								$("#blackboard").hide();
								$("#signin_wd").hide();
							}
				      }});
				}else{
				}
			}
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
//				$("#addSimpleUserPasswordInfo_input").blur();
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
		confirmCloseClick: function(event){
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
//			var id = target.id;
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
//			$(target).removeClass($(target).attr("class"));
//			$(target).addClass("cancelBtn_f");
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

function checkBrowserVersions(){
	var index = navigator.userAgent.indexOf("MSIE");
	if(index > 0){
		//是IE浏览器
		var versions = parseInt(navigator.userAgent.substring(index+5,index+8));
		if(versions < 8){
			return false;
		}
	}
	return true;
}

function checkBrowserIE8(){
	var index = navigator.userAgent.indexOf("MSIE");
	if(index > 0){
		//是IE浏览器
		var versions = parseInt(navigator.userAgent.substring(index+5,index+8));
		if(versions == 8){
			return false;
		}
	}
	return true;
}

//检查licence证书
function checkLicence(callBack){
	$.ajax( {
		url : contextPath+'/checkLicence.do',
		type : "post",
		cache : false,
		success: function(data, textStatus){
			data = JSON2.parse(data);
			if(data.returnFlag == -1){
				$("#cdt-login").attr('disabled',true); 
				$.messager.show({
					title:'提示',
					msg:'<span style="color:red;" >'+data.data+'</span>',
					showType:'slide',
					width: $(window).width(),
					height: 70,
					right:0,
					timeout:0,
					top:0
				});
			}else{
				if(data.data.returnFlag == -1){
					$.messager.show({
						title:'提示',
						msg:'<span style="color:red;" >'+data.data.data+'</span>',
						showType:'slide',
						width: $(window).width(),
						height: 70,
						right:0,
						timeout:0,
						top:0
					});
				}
			}
			callBack();
		}
	});
}
