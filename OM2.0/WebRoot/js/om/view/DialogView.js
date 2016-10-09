/**
 * 控制OM的所有弹出窗口
 */
$(function() {
	var method = null;
	var cmap = null;
	/** 新增组织或用户 */
	NewWinView = Backbone.View.extend({
		el: $("#newWinView"),
		initialize: function() {
			var newWinTemplate = _.template($("#newWin_template").html());			
			$(this.el).html(newWinTemplate);			
		},
		events: {
			//选择新增组织和用户窗口
			"mouseover .newWinChoose input": "newWinChooseInputOver",
			"mouseout .newWinChoose input": "newWinChooseInputOut",
			"mousedown .newWinChoose input": "newWinChooseInputDown",
			"mouseup .newWinChoose input": "newWinChooseInputUp",
			"mouseover #newWin_close": "confirmCloseOver",
			"mouseout #newWin_close": "confirmCloseOut",
			"click #newWin_close": "confirmCloseClick",
			//新增简单组织信息窗口
			"mouseover #new_simple_organization_confirmBtn": "confirmBtnOver",
			"mouseout #new_simple_organization_confirmBtn": "confirmBtnOut",
			"mousedown #new_simple_organization_confirmBtn": "confirmBtnDown",
			"mouseup #new_simple_organization_confirmBtn": "confirmBtnUp",
			"mouseover #new_simple_organization_cancelBtn": "cancelBtnOver",
			"mouseout #new_simple_organization_cancelBtn": "cancelBtnOut",
			"mousedown #new_simple_organization_cancelBtn": "cancelBtnDown",
			"mouseup #new_simple_organization_cancelBtn": "cancelBtnUp",
			"mouseover #new_simple_organization_addMoreBtn": "addMoreBtnOver",
			"mouseout #new_simple_organization_addMoreBtn": "addMoreBtnOut",
			"mousedown #new_simple_organization_addMoreBtn": "addMoreBtnDown",
			"mouseup #new_simple_organization_addMoreBtn": "addMoreBtnUp",
			"focus input": "textInputFocus",
			"blur input": "textInputBlur",
			"mouseover #new_simple_organization_close": "confirmCloseOver",
			"mouseout #new_simple_organization_close": "confirmCloseOut",
			"click #new_simple_organization_close": "confirmCloseClick",
			//新增详细组织信息窗口
			"mouseover #new_organization_confirmBtn":"confirmBtnOver",
			"mouseout #new_organization_confirmBtn":"confirmBtnOut",
			"mousedown #new_organization_confirmBtn":"confirmBtnDown",
			"mouseup #new_organization_confirmBtn":"confirmBtnUp",
			"mouseover #new_organization_cancelBtn": "cancelBtnOver",
			"mouseout #new_organization_cancelBtn": "cancelBtnOut",
			"mousedown #new_organization_cancelBtn": "cancelBtnDown",
			"mouseup #new_organization_cancelBtn": "cancelBtnUp",
			"mouseover #new_organization_close": "confirmCloseOver",
			"mouseout #new_organization_close": "confirmCloseOut",
			"click #new_organization_close": "confirmCloseClick",
			//新增简单用户信息窗口
			"mouseover #new_simple_user_confirmBtn":"confirmBtnOver",
			"mouseout #new_simple_user_confirmBtn":"confirmBtnOut",
			"mousedown #new_simple_user_confirmBtn":"confirmBtnDown",
			"mouseup #new_simple_user_confirmBtn":"confirmBtnUp",
			"mouseover #new_simple_user_cancelBtn":"cancelBtnOver",
			"mouseout #new_simple_user_cancelBtn":"cancelBtnOut",
			"mousedown #new_simple_user_cancelBtn":"cancelBtnDown",
			"mouseup #new_simple_user_cancelBtn":"cancelBtnUp",
			"mouseover #new_simple_user_addMoreBtn": "addMoreBtnOver",
			"mouseout #new_simple_user_addMoreBtn": "addMoreBtnOut",
			"mousedown #new_simple_user_addMoreBtn": "addMoreBtnDown",
			"mouseup #new_simple_user_addMoreBtn": "addMoreBtnUp",			
			"mouseover #new_simple_user_close":"confirmCloseOver",
			"mouseout #new_simple_user_close":"confirmCloseOut",
			"click #new_simple_user_close":"confirmCloseClick",				
			 //新增详细用户信息窗口
			"mouseover #new_user_confirmBtn":"confirmBtnOver",
			"mouseout #new_user_confirmBtn":"confirmBtnOut",
			"mousedown #new_user_confirmBtn":"confirmBtnDown",
			"mouseup #new_user_confirmBtn":"confirmBtnUp",
			"mouseover #new_user_cancelBtn":"cancelBtnOver",
			"mouseout #new_user_cancelBtn":"cancelBtnOut",
			"mousedown #new_user_cancelBtn":"cancelBtnDown",
			"mouseup #new_user_cancelBtn":"cancelBtnUp",
			"mouseover #new_user_close":"confirmCloseOver",
			"mouseout #new_user_close":"confirmCloseOut",
			"click #new_user_close":"confirmCloseClick"			
		},
		newWinChooseInputOver: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("organizationBtn_f ");
		},
		newWinChooseInputOut: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("organizationBtn_n ");
		},
		newWinChooseInputDown: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("organizationBtn_p ");
		},
		newWinChooseInputUp: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("organizationBtn_f ");
			
			if(target.id == "organizationBtn"){//新增组织
				$("#newWin").hide();
				$("#new_simple_organization").show();
				$("#new_simple_organization_name_input").removeClass("textInput_change");
				$("#new_simple_organization_name_input").val("新增组织");
				$("#new_simple_organization_name_input").focus();
			}
			else if(target.id == "userBtn"){//新增用户
				$("#newWin").hide();
				$("#new_simple_user").show();
				$("#new_simple_user table input").each(function(){
					$(this).removeClass("textInput_change");
				});
				$("#new_simple_user .error_tip").each(function(){
					if(!$(this).is(":hidden")){
						$(this).hide();
					}
				});
				$("#addSimpleUserEmail_input").val("电子邮箱");
				$("#addSimpleUserEmail_input").focus();
				$("#addSimpleUserPassword_input").val("密码");
				$("#addSimpleUsername_input").val("姓名");
			}
		},
		confirmCloseOver:function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirm_close_f ");
		},
		confirmCloseOut:function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirm_close_n ");
		},
		confirmCloseClick: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			var id = target.id;
			
			if(id == "newWin_close"){				
				$("#newWin").hide();
			}
			else if(id == "new_simple_organization_close"){//关闭新增简单组织信息页面
				$("#new_simple_organization").hide();
			}
			else if(id == "new_organization_close"){//关闭新增详细组织信息页面
				$("#new_organization").hide();				
			}
			else if(id == "new_simple_user_close"){//关闭新增简单用户信息页面
				$("#new_simple_user").hide();
			}
			else if(id == "new_user_close"){//关闭新增简单用户信息页面
				$("#new_user").hide();	
			}
			$("#newWinView").hide();
		},
		confirmBtnOver: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_f");
		},
		confirmBtnOut: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_n");
		},
		confirmBtnDown: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_p");
		},
		confirmBtnUp: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			var id = target.id;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_f");
						
			if(id == "new_simple_organization_confirmBtn"){//新增简单的组织信息
				if( inputHasNoContent("new_simple_organization_name_input")){
					$("#new_simple_organization_error_tip").show();
					$("#new_simple_organization_error_tip").text("新增组织名称不能为空");
					return;
				}
				
				cmap.put("type",0);
				cmap.put("name",$.trim($("#new_simple_organization_name_input").val()));
				$("#new_simple_organization").hide();
				$("#new_simple_organization_name_input").removeClass("textInput_change");
			}
			else if(id == "new_organization_confirmBtn"){//新增详细的组织信息
				if(inputHasNoContent("addOrganizationName_input")){
					$("#addOrganizationName_input_tip").show();
					$("#addOrganizationName_input_tip").text("新增组织名称不能为空");
					return;
				}

				var errorTipShow = false;
				$("#new_organization .error_tip").each(function(){
					if(!$(this).is(":hidden")){						
						errorTipShow = true;
					}
				});
				if(errorTipShow){
					return;
				}

				var name = $.trim($("#addOrganizationName_input").val());
				cmap.put("name",name);
				cmap.put("type",0);
				if(!inputHasNoContent("addOrganizationEmail_input")){
					var email =  $.trim($("#addOrganizationEmail_input").val());
					cmap.put("email",email);
				}
				if(!inputHasNoContent("addOrganizationPhone_input")){
					var phone =  $.trim($("#addOrganizationPhone_input").val());
					cmap.put("phone",phone);
				}
				if(!inputHasNoContent("addOrganizationMobilePhone_input")){
					var mobliePhone =  $.trim($("#addOrganizationMobilePhone_input").val());
					cmap.put("mobliePhone",mobliePhone);
				}
				if(!inputHasNoContent("addOrganizationAddress_input")){
					var address =  $.trim($("#addOrganizationAddress_input").val());
					cmap.put("address",address);
				}
				$("#new_organization").hide();
			}
			else if(id == "new_simple_user_confirmBtn"){//新增简单用户信息
				if(inputHasNoContent("addSimpleUserEmail_input") || inputHasNoContent("addSimpleUserPassword_input") 
						|| inputHasNoContent("addSimpleUsername_input")){
					if(inputHasNoContent("addSimpleUserEmail_input")){
						$("#addSimpleUserEmail_input_tip").show();
						$("#addSimpleUserEmail_input_tip").text("电子邮箱不能为空");
					}
					if(inputHasNoContent("addSimpleUserPassword_input")){
						$("#addSimpleUserPassword_input_tip").show();
						$("#addSimpleUserPassword_input_tip").text("密码不能为空");
					}
					if(inputHasNoContent("addSimpleUsername_input")){
						$("#addSimpleUsername_input_tip").show();
						$("#addSimpleUsername_input_tip").text("用户姓名不能为空");
					}					
					return;
				}
				
				var errorTipShow = false;
				$("#new_simple_user .error_tip").each(function(){
					if(!$(this).is(":hidden")){						
						errorTipShow = true;
					}
				});
				if(errorTipShow){
					return;
				}
				
				var email = $.trim($("#addSimpleUserEmail_input").val());
				var password = $.trim($("#addSimpleUserPassword_input").val());
				var name = $.trim($("#addSimpleUsername_input").val());
				cmap.put("type",1);
				cmap.put("email",email);
				cmap.put("password",password);
				cmap.put("name",name);

				$("#new_simple_user").hide();
			}
			else if(id == "new_user_confirmBtn"){////新增详细用户信息
				if(inputHasNoContent("addUserEmail_input") || inputHasNoContent("addUserPassword_input") 
						|| inputHasNoContent("addUsername_input")){
					if(inputHasNoContent("addUserEmail_input")){
						$("#addUserEmail_input_tip").show();
						$("#addUserEmail_input_tip").text("电子邮箱不能为空");
					}
					if(inputHasNoContent("addUserPassword_input")){
						$("#addUserPassword_input_tip").show();
						$("#addUserPassword_input_tip").text("密码不能为空");
					}
					if(inputHasNoContent("addUsername_input")){
						$("#addUsername_input_tip").show();
						$("#addUsername_input_tip").text("用户姓名不能为空");
					}					
					return;
				}
				
				var errorTipShow = false;
				$("#new_user .error_tip").each(function(){
					if(!$(this).is(":hidden")){						
						errorTipShow = true;
					}
				});
				if(errorTipShow){
					return;
				}
				
				var email = $.trim($("#addUserEmail_input").val());
				var password = $.trim($("#addUserPassword_input").val());
				var name = $.trim($("#addUsername_input").val());
				cmap.put("type",1);
				cmap.put("email",email);
				cmap.put("password",password);
				cmap.put("name",name);
				if(!inputHasNoContent("addUserPhone_input")){
					var phone =  $.trim($("#addUserPhone_input").val());
					cmap.put("phone",phone);
				}
				if(!inputHasNoContent("addUserMobilePhone_input")){
					var mobilePhone =  $.trim($("#addUserMobilePhone_input").val());
					cmap.put("mobilePhone",mobilePhone);
				}
				if(!inputHasNoContent("addUserAddress_input")){
					var address =  $.trim($("#addUserAddress_input").val());
					cmap.put("phone",address);
				}
				$("#new_user").hide();
				
			}
			method(cmap);
			$("#newWinView").hide();
			
			//用于判断input中是否没有内容
			function inputHasNoContent(inputId){
				var defaultValue = $("#" + inputId).attr("defaultValue");
				return $.trim($("#" + inputId).val()) == defaultValue 
					&& ($("#" + inputId).css("color") == "#999999" 
					|| $("#" + inputId).css("color")=="rgb(153, 153, 153)");
			}
		},
		cancelBtnOver: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("cancelBtn_f");
		},
		cancelBtnOut: function(event){
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
			var id = target.id;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("cancelBtn_f");
			
			if(id == "new_simple_organization_cancelBtn"){//取消新增简单组织信息
				$("#new_simple_organization").hide();
			}
			else if(id == "new_organization_cancelBtn"){//取消新增详细组织信息
				$("#new_organization").hide();
			}
			else if(id == "new_simple_user_cancelBtn"){//取消新增简单用户信息
				$("#new_simple_user").hide();
			}
			else if(id == "new_user_cancelBtn"){//取消新增详细用户信息
				$("#new_user").hide();
			}
			$("#newWinView").hide();
		},
		addMoreBtnOver: function (event) {
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("addMoreBtn_f");
		},
		addMoreBtnOut: function (event) {
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("addMoreBtn_n");
		},
		addMoreBtnDown: function (event) {
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("addMoreBtn_p");
		},
		addMoreBtnUp: function (event) {
			var e = event || window.event;
			var target = e.srcElement || e.target;
			var id = target.id;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("addMoreBtn_f");
			
			if(id == "new_simple_organization_addMoreBtn"){//新增组织详细信息
				$("#new_simple_organization").hide();
				$("#new_organization").show();
				
				$("#new_organization table input").each(function(){
					$(this).removeClass("textInput_change");
				});
				$("#new_organization .error_tip").each(function(){
					if(!$(this).is(":hidden")){
						$(this).hide();
					}
				});
				if(inputHasNoContent("new_simple_organization_name_input")){
					$("#addOrganizationName_input").val("新增组织");
					$("#addOrganizationName_input").focus();
				}
				else{
					$("#addOrganizationName_input").addClass("textInput_change");
					$("#addOrganizationName_input").focus();
					$("#addOrganizationName_input").val($.trim($("#new_simple_organization_name_input").val()));
					
				}
				$("#addOrganizationEmail_input").val("电子邮箱");
				$("#addOrganizationPhone_input").val("电话");
				$("#addOrganizationMobilePhone_input").val("手机");
				$("#addOrganizationAddress_input").val("地址");
			}
			else if(id == "new_simple_user_addMoreBtn"){//新增用户详细信息
				$("#new_simple_user").hide();
				$("#new_user").show();
				$("#new_user table input").each(function(){
					$(this).removeClass("textInput_change");
				});
				$("#new_user .error_tip").each(function(){
					if(!$(this).is(":hidden")){
						$(this).hide();
					}
				});
				if(inputHasNoContent("addSimpleUserEmail_input")){
					$("#addUserEmail_input").val("电子邮箱");
					$("#addUserEmail_input").focus();
				}
				else{
					$("#addUserEmail_input").addClass("textInput_change");
					$("#addUserEmail_input").focus();
					$("#addUserEmail_input").val($.trim($("#addSimpleUserEmail_input").val()));
				}
				if(inputHasNoContent("addSimpleUserPassword_input")){
					$("#addUserPassword_input").val("密码");
				}
				else{
					$("#addUserPassword_input").addClass("textInput_change");
					$("#addUserPassword_input").val($.trim($("#addSimpleUserPassword_input").val()));
					
//					var myreg =/^[0-9]{6,16}$/;
					//var myreg = /^(?=.*\d.*)(?=.*[a-zA-Z].*)|(?=.*\d.*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*)|(?=.*[a-zA-Z].*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*).{6,16}$/;
					var myreg = /^[0-9A-Za-z\!\$\%\^\&\*\.\~\_\-\@\,\.]{6,16}$/;
					if(!myreg.test($("#addUserPassword_input").val())){
						$("#addUserPassword_input_tip").text('请输入6-16位数字、字母或符号，区分大小写');
						$("#addUserPassword_input_tip").show();
					}
					/*else{
						var myreg = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\_]{6,16}$/;
						if(!myreg.test($("#addUserPassword_input").val())){
							$("#addUserPassword_input_tip").text("6~16位字符，区分大小写");
							$("#addUserPassword_input_tip").show();
						}
					}*/
					
				}
				if(inputHasNoContent("addSimpleUsername_input")){
					$("#addUsername_input").val("姓名");
				}
				else{
					$("#addUsername_input").addClass("textInput_change");
					$("#addUsername_input").val($.trim($("#addSimpleUsername_input").val()));
				}
				$("#addUserPhone_input").val("电话");
				$("#addUserMobilePhone_input").val("手机");
				$("#addUserAddress_input").val("地址");
			}
			
			//用于判断input中是否没有内容
			function inputHasNoContent(inputId){
				var defaultValue = $("#" + inputId).attr("defaultValue");
				return $.trim($("#" + inputId).val()) == defaultValue 
					&& ($("#" + inputId).css("color") == "#999999" 
					|| $("#" + inputId).css("color")=="rgb(153, 153, 153)");
			}
		},
		textInputFocus: function(event) {
			var e = event || window.event;
			var target = e.srcElement || e.target;
			var defaultValue = $(target).attr("defaultValue");
			if(target.type == "text"){
				if($.trim($(target).val()) == defaultValue 
						&& ($(target).css("color") == "#999999" 
							|| $(target).css("color")=="rgb(153, 153, 153)")){
					$(target).val("");
					$(target).addClass("textInput_change");
				}
				
				$(target).removeClass("textInput_n");
				$(target).addClass("textInput_p");
				
				var tip = $(target).parent().parent().next().children().children();
				if(!$(tip).is(":hidden")){
					$(tip).hide();
				}
			}
		},
		textInputBlur: function(event) {
			var e = event || window.event;
			var target = e.srcElement || e.target;
			var defaultValue = $(target).attr("defaultValue");
			if(target.type == "text"){
				
				if($.trim($(target).val()) == ""){
					$(target).val(defaultValue);
					$(target).removeClass("textInput_change");
				}
				$(target).removeClass("textInput_p");
				$(target).addClass("textInput_n");
				if(target.id == "addOrganizationEmail_input" || target.id == "addSimpleUserEmail_input" ||
						target.id == "addUserEmail_input"){//验证邮箱格式
					if(!inputHasNoContent(target.id)){					
						var myreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;///^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
						if(!myreg.test($("#" + target.id).val())){
							var tipDiv = $("#" + target.id).parent().parent().next().children().children();
							tipDiv.text("请输入正确的电子邮箱地址");
							tipDiv.show();
						}else{
							var url = contextPath + '/ts/omUserIsExit?data={"email":"'+$("#" + target.id).val()+'"}';
							$.ajax({
								url: url,
								type: "post", 
								success: function(response){
									if(JSON2.parse(response).returnFlag != 0){
										var tipDiv = $("#" + target.id).parent().parent().next().children().children();
										tipDiv.text("电子邮箱地址重复，请重新输入");
										tipDiv.show();
									}
								}
							});
						}
					}
				}
				
				if(target.id == "addSimpleUserPassword_input" || target.id == "addUserPassword_input"){//验证用户密码
					if(!inputHasNoContent(target.id)){
						
//						var myreg =/^[0-9]{6,16}$/;
						//var myreg = /^(?=.*\d.*)(?=.*[a-zA-Z].*)|(?=.*\d.*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*)|(?=.*[a-zA-Z].*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*).{6,16}$/;
						var myreg = /^[0-9A-Za-z\!\$\%\^\&\*\.\~\_\-\@\,\.]{6,16}$/;
						if(!myreg.test($("#" + target.id).val())){
							var tipDiv = $("#" + target.id).parent().parent().next().children().children();
							tipDiv.text('请输入6-16位数字、字母或符号，区分大小写');
							tipDiv.show();
							return;
						}
						
						/*var myreg = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\_]{6,16}$/;
						if(!myreg.test($("#" + target.id).val())){
							var tipDiv = $("#" + target.id).parent().parent().next().children().children();
							tipDiv.text("6~16位字符，区分大小写");
							tipDiv.show();
						}*/
					}
				}
				
				if(target.id == "addOrganizationPhone_input" || target.id == "addUserPhone_input"){//验证电话号码
					if(!inputHasNoContent(target.id)){	
						var myreg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7}$/;
						var myregs = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}$/;
						console.info(!myreg.test($("#" + target.id).val()));
						console.info(!myregs.test($("#" + target.id).val()));
						if(!myreg.test($("#" + target.id).val()) && !myregs.test($("#" + target.id).val())){
							var tipDiv = $("#" + target.id).parent().parent().next().children().children();
							tipDiv.text("请输入正确的电话号码");
							tipDiv.show();
						}
					}
				}
				
				if(target.id == "addOrganizationMobilePhone_input" || target.id == "addUserMobilePhone_input"){//验证手机号码
					if(!inputHasNoContent(target.id)){	
						var myreg = /^1[0-9]{10}$/;
						if(!myreg.test($("#" + target.id).val())){
							var tipDiv = $("#" + target.id).parent().parent().next().children().children();
							tipDiv.text("请输入正确的手机号码");
							tipDiv.show();
						}
					}
				}
			}
			
			//用于判断input中是否没有内容
			function inputHasNoContent(inputId){
				var defaultValue = $("#" + inputId).attr("defaultValue");
				return $.trim($("#" + inputId).val()) == defaultValue 
					&& ($("#" + inputId).css("color") == "#999999" 
					|| $("#" + inputId).css("color")=="rgb(153, 153, 153)");
			}
		},
		newWinOpen: function(m,map){
			method = m;
			cmap = map;
			$("#newWinView").show();
			$("#newWin").show();
		}
	});
	
	//修改对话框
	RenameWinView = Backbone.View.extend({
		el: $("#renameWinView"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var renameWinTemplate = _.template($("#renameWin_template").html());
			$(this.el).html(renameWinTemplate);
		},
		events: {
			"mouseover #renameSaveBtn": "renameSaveBtnOver",
			"mouseout #renameSaveBtn": "renameSaveBtnOut",
			"mousedown #renameSaveBtn": "renameSaveBtnMousedown",
			"mouseup #renameSaveBtn": "renameSaveBtnMouseup",
			"mouseover #renameSaveCancelBtn": "renameSaveCancelBtnOver",
			"mouseout #renameSaveCancelBtn": "renameSaveCancelBtnOut",
			"mousedown #renameSaveCancelBtn": "renameSaveCancelBtnMousedown",
			"mouseup #renameSaveCancelBtn": "renameSaveCancelBtnMouseup",
			"mouseover #renameWin_close": "renameWinCloseOver",
			"mouseout #renameWin_close": "renameWinCloseOut",
			"click #renameWin_close": "renameWinCloseClick",
			"focus #renameText": "focus_renameText",
			"blur #renameText": "blur_renameText"
		},
		renameSaveBtnOver: function(){
			$("#renameSaveBtn").removeClass($("#renameSaveBtn").attr("class"));
			$("#renameSaveBtn").addClass("confirmBtn_f");
		},
		renameSaveBtnOut: function(){
			$("#renameSaveBtn").removeClass($("#renameSaveBtn").attr("class"));
			$("#renameSaveBtn").addClass("confirmBtn_n");
		},
		renameSaveBtnMousedown: function(){
			$("#renameSaveBtn").removeClass($("#renameSaveBtn").attr("class"));
			$("#renameSaveBtn").addClass("confirmBtn_p");
		},
		renameSaveBtnMouseup: function(){
			$("#renameSaveBtn").removeClass($("#renameSaveBtn").attr("class"));
			$("#renameSaveBtn").addClass("confirmBtn_f");
			if(method != null){
				var functionType = cmap.get("functionType");
				var typeName = cmap.get("typeName");
				if(functionType == "add"){
					if(inputHasNoContent("renameText")){						
						$("#renameWinContent_error_tip").show();
						$("#renameWinContent_error_tip").text("新增" + typeName + "名称不能为空");
						return;
					}						
					else if($.trim($("#renameText").val()) != ""){
						cmap.remove("name");
						cmap.put("name", $.trim($("#renameText").val()));
						$("#renameWinView").hide();
						method(cmap);
					}
				}
				else if(functionType == "rename"){
					if($.trim($("#renameText").val()) == ""){
						$("#renameWinContent_error_tip").show();
						var type = cmap.get("type");
						if(type == 1){
							$("#renameWinContent_error_tip").text("重命名" + typeName + "姓名不能为空");
						}
						else{
							$("#renameWinContent_error_tip").text("重命名" + typeName + "名称不能为空");
						}
						
						return;
					}else if($.trim($("#renameText").val()) == cmap.get("name")){//名字和原来名字一样时
						$("#renameWinView").hide();
						return;
					}else{
						cmap.remove("name");
						cmap.put("name", $.trim($("#renameText").val()));
						$("#renameWinView").hide();
						method(cmap);
					}
				}
			}
			//用于判断input中是否没有内容
			function inputHasNoContent(inputId){
				var defaultValue = $("#" + inputId).attr("defaultValue");
				return $.trim($("#" + inputId).val()) == defaultValue 
					&& ($("#" + inputId).css("color") == "#999999" 
					|| $("#" + inputId).css("color")=="rgb(153, 153, 153)");
			}
		},
		renameSaveCancelBtnOver: function(){
			$("#renameSaveCancelBtn").removeClass($("#renameSaveCancelBtn").attr("class"));
			$("#renameSaveCancelBtn").addClass("cancelBtn_f");
		},
		renameSaveCancelBtnOut: function(){
			$("#renameSaveCancelBtn").removeClass($("#renameSaveCancelBtn").attr("class"));
			$("#renameSaveCancelBtn").addClass("cancelBtn_n");
		},
		renameSaveCancelBtnMousedown: function(){
			$("#renameSaveCancelBtn").removeClass($("#renameSaveCancelBtn").attr("class"));
			$("#renameSaveCancelBtn").addClass("cancelBtn_p");
		},
		renameSaveCancelBtnMouseup: function(){
			$("#renameSaveCancelBtn").removeClass($("#renameSaveCancelBtn").attr("class"));
			$("#renameSaveCancelBtn").addClass("cancelBtn_f");
			$("#renameWinView").hide();
		},
		renameWinCloseOver: function(){
			$("#renameWin_close").removeClass("confirm_close_n");
			$("#renameWin_close").addClass("confirm_close_f");
		},
		renameWinCloseOut: function(){
			$("#renameWin_close").removeClass("confirm_close_f");
			$("#renameWin_close").addClass("confirm_close_n");
		},
		renameWinCloseClick: function(){
			$("#renameWinView").hide();
			
			
		},
		renameWinOpen: function(m, map){
			$("#renameWinView").show();
			$("#renameText").removeClass("textInput_change");
			method = m;
			cmap = map;
			var functionName = map.get("functionName");
			var functionType = map.get("functionType");
			var name = map.get("name");
			var titleName = map.get("titleName");
			$("#renameWin").children().eq(0).children("h4").text(functionName);
			$("#renameWinContent_title").text(titleName);
			$("#renameText").val(name);
			$("#renameText").attr("defaultValue",name);
			if(functionType == "add"){
				$("#renameText").focus();					
			}
			else if(functionType == "rename"){	
				$("#renameText").select();
			}
		},
		focus_renameText: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			var id = target.id;
			var functionType = cmap.get("functionType");
			if(functionType == "add"){
				
				var defaultValue = $(target).attr("defaultValue");
				if(target.type == "text"){
					if($.trim($(target).val()) == defaultValue 
							&& ($(target).css("color") == "#999999" 
								|| $(target).css("color")=="rgb(153, 153, 153)")){
						$(target).val("");
						$(target).addClass("textInput_change");
					}
				}
			}
			else if(functionType == "rename"){
				$(target).addClass("textInput_change");
			}
			
			$(target).removeClass("textInput_n");
			$(target).addClass("textInput_p");
			if(id == "renameText"){
				if(!$("#renameWinContent_error_tip").is(":hidden")){
					$("#renameWinContent_error_tip").hide();
				}
			}
		},
		blur_renameText: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			
			var functionType = cmap.get("functionType");
			
			if(functionType == "add"){
				var defaultValue = $(target).attr("defaultValue");
				if(target.type == "text"){
					
					if($.trim($(target).val()) == ""){
						$(target).val(defaultValue);
						$(target).removeClass("textInput_change");
					}
				}
			}
			$(target).removeClass("textInput_p");
			$(target).addClass("textInput_n");
		}
	});
	//确认删除对话框
	ConfirmView = Backbone.View.extend({
		el: $("#confirmView"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var confirmTemplate = _.template($("#confirm_template").html());
			$(this.el).html(confirmTemplate);
		},
		events: {
			"mouseover #deleteBtn": "deleteBtnOver",
			"mouseout #deleteBtn": "deleteBtnOut",
			"mousedown #deleteBtn": "deleteBtnMousedown",
			"mouseup #deleteBtn": "deleteBtnMouseup",
			"mouseover #resetBtn": "resetBtnOver",
			"mouseout #resetBtn": "resetBtnOut",
			"mousedown #resetBtn": "resetBtnMousedown",
			"mouseup #resetBtn": "resetBtnMouseout",
			"mouseover #delete_confirm_close": "confirmCloseOver",
			"mouseout #delete_confirm_close": "confirmCloseOut",
			"click #delete_confirm_close": "resetBtnClick"
		},
		deleteBtnOver: function(){
			$("#deleteBtn").removeClass($("#deleteBtn").attr("class"));
			$("#deleteBtn").addClass("confirmBtn_f");
		},
		deleteBtnOut: function(){
			$("#deleteBtn").removeClass($("#deleteBtn").attr("class"));
			$("#deleteBtn").addClass("confirmBtn_n");
		},
		deleteBtnMousedown: function(){
			$("#deleteBtn").removeClass($("#deleteBtn").attr("class"));
			$("#deleteBtn").addClass("confirmBtn_p");
		},
		deleteBtnMouseup: function(){
			$("#deleteBtn").removeClass($("#deleteBtn").attr("class"));
			$("#deleteBtn").addClass("confirmBtn_f");
			$("#confirmView").hide();
			if(method != null){
				method(cmap);
			}
		},
		resetBtnOver: function(){
			$("#resetBtn").removeClass($("#resetBtn").attr("class"));
			$("#resetBtn").addClass("cancelBtn_f");
		},
		resetBtnOut: function(){
			$("#resetBtn").removeClass($("#resetBtn").attr("class"));
			$("#resetBtn").addClass("cancelBtn_n");
		},
		resetBtnMousedown: function(){
			$("#resetBtn").removeClass($("#resetBtn").attr("class"));
			$("#resetBtn").addClass("cancelBtn_p");
		},
		resetBtnMouseout: function(){
			$("#resetBtn").removeClass($("#resetBtn").attr("class"));
			$("#resetBtn").addClass("cancelBtn_f");
			$("#confirmView").hide();
		},
		resetBtnClick: function(){
			$("#confirmView").hide();
		},
		confirmCloseOver: function(){
			$("#delete_confirm_close").removeClass("confirm_close_n");
			$("#delete_confirm_close").addClass("confirm_close_f");
		},
		confirmCloseOut: function(){
			$("#delete_confirm_close").removeClass("confirm_close_f");
			$("#delete_confirm_close").addClass("confirm_close_n");
		},
		confirmOpen: function(m, map){
			var name = map.get("name");
			var titleName = map.get("titleName");
			$("#confirmView").show();
			$("#comfirmbox_content").html(name);
			$(".comfirmbox_title").html(titleName);
			cmap = map;
			method = m;
		}
	});
	
	//移至对话框
	RelieveView = Backbone.View.extend({
		el: $("#relieveView"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var relieveTemplate = _.template($("#relieve_template").html());
			$(this.el).html(relieveTemplate);
			
			//所有组织树
			var rootJson = [{"id":ORGANIZATION_ROOT_ID,"text":"组织","iconCls":"icon-organization-double","state":"closed","attributes":{"type":0}}];
			$('#relieve_organization_groups').tree({
				data: rootJson,
				animate: true,//有展开动画
				checkbox:true,//可以选择
				cascadeCheck: false,
				onBeforeLoad : function(node, param){
				},
				onLoadSuccess : function(node, data){//数据加载成功后，在界面上增加显示布局
					if (data.data) {
						if(data.returnFlag == -1){//没有查询到数据时，
							
						}
						else{
							$(this).tree("append",{parent:node.target,data:data.data});	
							
							var organizationData = cmap.get("organizationData");
							for ( var i = 0; i < organizationData.length; i++) {
								var node = $(this).tree("find",organizationData[i].id);
								if(node){
									$(this).tree("check",node.target);
								}
							}
						}											
					}
				},
				onCheck : function(node, checked) {
					if(userFirstRelieve){//用户控制不让至少选择一个用户这个提示显示,因为刚弹出移至对话框时，要将组织节点设为未选中状态
						userFirstRelieve = false;
						return;
					}
					if(checked == false){
						if($(this).tree("getChecked") == ""){//没有选择项时,必须要选择一项，应该这项不能取消
							$(this).tree("check",node.target);

							if($("#userSelectOrganization_tip").is(":hidden")){
								$("#userSelectOrganization_tip").show();
								setTimeout(function(){
									$("#userSelectOrganization_tip").hide();
								}, 1000);
							}
						}
					}
				}
			});
						
		},
		events: {
			"mouseover #relieveBtn": "relieveBtnOver",
			"mouseout #relieveBtn": "relieveBtnOut",
			"mousedown #relieveBtn": "relieveBtnMousedown",
			"mouseup #relieveBtn": "relieveBtnMouseup",
			"mouseover #relieveCancelBtn": "relieveCancelBtnOver",
			"mouseout #relieveCancelBtn": "relieveCancelBtnOut",
			"mousedown #relieveCancelBtn": "relieveCancelBtnMousedown",
			"mouseup #relieveCancelBtn": "relieveCancelBtnMouseup",
			"mouseover #relieve_close": "relieveCloseOver",
			"mouseout #relieve_close": "relieveCloseOut",
			"click #relieve_close": "relieveCloseClick",
			"click #selectAllUser": "selectAllUserClick"
		},
		relieveBtnOver: function(){
			$("#relieveBtn").removeClass($("#relieveBtn").attr("class"));
			$("#relieveBtn").addClass("confirmBtn_f");
		},
		relieveBtnOut: function(){
			$("#relieveBtn").removeClass($("#relieveBtn").attr("class"));
			$("#relieveBtn").addClass("confirmBtn_n");
		},
		relieveBtnMousedown: function(){
			$("#relieveBtn").removeClass($("#relieveBtn").attr("class"));
			$("#relieveBtn").addClass("confirmBtn_p");
		},
		relieveBtnMouseup: function(){
			$("#relieveBtn").removeClass($("#relieveBtn").attr("class"));
			$("#relieveBtn").addClass("confirmBtn_f");
			var from = cmap.get("from");
			if(from == "containUser" || from == "fromMoreOrganizationInformation"){//组织详细信息页面跳转过来
				
				var userData = cmap.get("userData");
				var tree_id = cmap.get("tree_id");
				var organizationNode = cmap.get("node");
				var checkedNodes = $('#include_user_groups').tree("getChecked");//现在选择的用户树节点数据
				var resultData = new Array();
				
				for ( var i = 0; i < checkedNodes.length; i++) {
					resultData[i] = checkedNodes[i];
				}
				
				//去掉组织中原来的用户和现在选择的用户相同信息
				for(var i = 0; i < userData.length; i++){
					for(var j = 0; j< checkedNodes.length; j++){
						
						if(userData[i].id == checkedNodes[j].id){
							userData.splice(i,1);
							checkedNodes.splice(j,1);
							i--;
							break;
						}
					}
				}
				
				var value = "";
				for( var i = 0; i < userData.length; i++){//组织树去掉的组织节点								
					if(value == ""){
						value = value + "{'id':" + userData[i].id + ",'type':1}";
						continue;
					}
					else{
						value = value + ",{'id':" + userData[i].id + ",'type':1}";
					}
				}
				for( var i = 0; i < checkedNodes.length; i++){//组织树新增的组织节点								
					if(value == ""){
						value = value + "{'id':" + checkedNodes[i].id + ",'type':0}";
						continue;
					}
					else{
						value = value + ",{'id':" + checkedNodes[i].id + ",'type':0}";
					}
				}
				
				if(value != ""){//改变的所属组织信息
					var url = contextPath + '/ts/omOrganizationSelectUser?data={"id":' + organizationNode.id + ', "value":['+ value +']}';
					var map = new HashMap();
					map.put("tree_id", tree_id);
					map.put("organizationNode", organizationNode);
					map.put("userData", userData);
					map.put("checkedNodes", checkedNodes);
					map.put("resultData",resultData);
					
					function removeUserNode(response,map){
						var tree_id = map.get("tree_id");
						var organizationNode = map.get("organizationNode");
						var userData = map.get("userData");
						var checkedNodes = map.get("checkedNodes");
						
						//新增组织用户
						for ( var i = 0; i < checkedNodes.length; i++) {
							$("#" + tree_id).tree('append', {
								parent: (organizationNode?organizationNode.target:null),
								data: [{
									id: checkedNodes[i].id,
									text: checkedNodes[i].text,
									iconCls: "icon-user",
									attributes:{
										type: checkedNodes[i].attributes.type,
										name: checkedNodes[i].text,
										password: checkedNodes[i].attributes.password,
										phone: checkedNodes[i].attributes.phone,
										mobilePhone: checkedNodes[i].attributes.mobilePhone,
										email: checkedNodes[i].attributes.email,
										address: checkedNodes[i].attributes.address
									}
								}]
							});
							
							if(organizationNode.iconCls == "icon-organization-single"){//父角色是叶子节点时,改变父角色的图标
								$(organizationNode.target).children(".tree-icon").removeClass("icon-organization-single-s");
								$(organizationNode.target).children(".tree-icon").addClass("icon-organization-double-s");
								organizationNode.iconCls = "icon-organization-double";
								$("#" + tree_id).tree("update",organizationNode);
							}
						}
					
						//移除组织中的用户
						for ( var i = 0; i < userData.length; i++) {
							//remove
							var length = $(organizationNode.target).next().children().length;
							for(var j = 0; j < length; j++){
								if(parseInt($(organizationNode.target).next().children().eq(j).children().attr("node-id")) == userData[i].id){
									$("#" + tree_id).tree("remove",($(organizationNode.target).next().children().eq(j).children())[0]);
									break;
								}
							}
							
							if(i == userData.length-1){
								if($("#" + tree_id).tree("getChildren",organizationNode.target) == ""){
									organizationNode.iconCls = "icon-organization-single";
									$("#" + tree_id).tree("update",organizationNode);
								}
							}
						}
						
						var data = response.data;
						if(data != ""){
							for(var i=0; i < data.length;i++){
								for(var j=0; j < userData.length; j++){
									if(data[i] == userData[j].id){
										var rootNode = $("#" + tree_id).tree("find",ORGANIZATION_ROOT_ID);
										
										$("#" + tree_id).tree('append', {
											parent: (rootNode?rootNode.target:null),
											data: [{
												id: userData[j].id,
												text: userData[j].text,
												iconCls: "icon-user",
												attributes:{
													type: userData[j].type,
													name: userData[j].name,
													password: userData[j].password,
													phone: userData[j].phone,
													mobilePhone: userData[j].mobilePhone,
													email: userData[j].email,
													address: userData[j].address
												}
											}]
										});
									}
								}
							}
						}
						
						var checkedNodes = $('#include_user_groups').tree("getChecked");
						for(var i in checkedNodes){
							$('#include_user_groups').tree("uncheck", checkedNodes[i].target);
						}
						
						if(tree_id == "search_organization_groups_ul"){
							searchOrganizationTreeHasChanged = true;
						}
					}					
					operateServerData(url,organizations,removeUserNode,map);
				}
				var checkedNodes = $('#include_user_groups').tree("getChecked");
				for(var i in checkedNodes){
					$('#include_user_groups').tree("uncheck", checkedNodes[i].target);
				}
			}
			else if(from == "relieveOrganization" || from == "fromMoreUserInformation"){//移至功能或者用户详细信息编辑处跳转过来
				var tree_id = cmap.get("tree_id");
				var userNode = cmap.get("node");
				
				var organizationData = cmap.get("organizationData");//移动之前用户所属的组织信息
				var checkedNodes = $('#relieve_organization_groups').tree("getChecked");//现在选择的组织树节点数据
				var resultData = new Array();//最终的组织树节点数据数组
				for ( var i = 0; i < checkedNodes.length; i++) {
					resultData[i] = checkedNodes[i].text;
				}
				//去掉移动之前的组织和现在选择的组织相同信息
				for( var i = 0; i < organizationData.length; i++){
					for ( var j = 0; j < checkedNodes.length; j++){
						if(organizationData[i].id == checkedNodes[j].id){
							organizationData.splice(i,1);
							checkedNodes.splice(j,1);
							i--;
							break;
						}
					}
				}
				
				var value = "";
				for( var i = 0; i < organizationData.length; i++){//组织树去掉的组织节点								
					if(value == ""){
						value = value + "{'id':" + organizationData[i].id + ",'type':1}";
						continue;
					}
					else{
						value = value + ",{'id':" + organizationData[i].id + ",'type':1}";
					}
				}
				for( var i = 0; i < checkedNodes.length; i++){//组织树新增的组织节点								
					if(value == ""){
						value = value + "{'id':" + checkedNodes[i].id + ",'type':0}";
						continue;
					}
					else{
						value = value + ",{'id':" + checkedNodes[i].id + ",'type':0}";
					}
				}
				if(value != ""){//改变的所属组织信息
					
					var url = contextPath + '/ts/omUserSelectOrganization?data={"id":' + userNode.id + ', "value":['+ value +']}';
					var map = new HashMap();
					map.put("tree_id", tree_id);
					map.put("userNode", userNode);
					map.put("organizationData", organizationData);
					map.put("checkedNodes", checkedNodes);					
					
					//去掉组织用户树中的用户节点
					function removeNode(response,map){
						var tree_id = map.get("tree_id");
						var userNode = map.get("userNode");
						var organizationData = map.get("organizationData");
						var checkedNodes = map.get("checkedNodes");
						
						for( var i = 0; i < organizationData.length; i++){//组织树去掉的组织节点
							var t = $("#" + tree_id);
							var node = t.tree("find",organizationData[i].id);
							if(node){
								//组织已展开
								if(t.tree("getChildren",node.target) != ""){
									var length = $(node.target).next().children().length;
									for(var j = 0; j < length; j++){
										if(parseInt($(node.target).next().children().eq(j).children().attr("node-id")) == userNode.id){
											t.tree("remove",($(node.target).next().children().eq(j).children())[0]);
											//如果其父组织下只有一个用户，移除这个用户之后，父组织的图标要相应改变
											if(t.tree("getChildren",node.target) == ""){
												node.iconCls = "icon-organization-single";
												t.tree("update",node);
											}
											break;
										}
									}
								}
								else{//组织未展开，需要判断组织下的子节点个数
									var url = contextPath + '/ts/omGetSubCount?data={"id":' + node.id + '}';
																		
									//根据返回的数据判断，当该组织下面没有用户时，刷新该组织的父组织
									function isChangeNode(response) {
										var count = response.data;
										if(count == 0){
											var parentNode = t.tree("getParent",node.target);
											var	url = contextPath + "/ts/omGetOrganizationTree?type=0&data={'id':" + parentNode.id +"}";										
											t.tree("options").url = url;
											t.tree("reload",parentNode.target);
										}
									}
									
									operateServerData(url,organizations,isChangeNode);
								}
							}
						}
						
						for( var i = 0; i < checkedNodes.length; i++){//组织树新增的组织节点
							var node = $("#" + tree_id).tree("find",checkedNodes[i].id);
							if(node){
								//组织已展开
								var t = $("#" + tree_id);
								if(t.tree("getChildren",node.target) != ""){
									
									t.tree('append', {
										parent: (node?node.target:null),
										data: [{
											id: userNode.id,
											text: userNode.text,
											iconCls: userNode.iconCls,
											attributes:{
												type: userNode.attributes.type,
												name: userNode.text,
												password: userNode.attributes.password,
												phone: userNode.attributes.phone,
												mobilePhone: userNode.attributes.mobilePhone,
												email: userNode.attributes.email,
												address: userNode.attributes.address
											}
										}]
									});
								}
								else{//组织未展开，判断是否为叶子节点，若是叶子节点，需变成根节点
									if(t.tree("isLeaf",node.target)){
										t.tree('append', {
											parent: (node?node.target:null),
											data: [{
												id: userNode.id,
												text: userNode.text,
												iconCls: userNode.iconCls,
												attributes:{
													type: userNode.attributes.type,
													name: userNode.text,
													password: userNode.attributes.password,
													phone: userNode.attributes.phone,
													mobilePhone: userNode.attributes.mobilePhone,
													email: userNode.attributes.email,
													address: userNode.attributes.address
												}
											}]
										});
										node.iconCls = "icon-organization-double";							
										t.tree("update",node);
										node.attributes.clicked = true;						
									}						
								}
							}
						}
					}
					operateServerData(url,organizations,removeNode,map);
					if(tree_id == "search_organization_groups_ul"){
						searchOrganizationTreeHasChanged = true;
					}
				}
			}
			$("#relieveView").hide();
		},
		relieveCancelBtnOver: function(){
			$("#relieveCancelBtn").removeClass($("#relieveCancelBtn").attr("class"));
			$("#relieveCancelBtn").addClass("cancelBtn_f");
		},
		relieveCancelBtnOut: function(){
			$("#relieveCancelBtn").removeClass($("#relieveCancelBtn").attr("class"));
			$("#relieveCancelBtn").addClass("cancelBtn_n");
		},
		relieveCancelBtnMousedown: function(){
			$("#relieveCancelBtn").removeClass($("#relieveCancelBtn").attr("class"));
			$("#relieveCancelBtn").addClass("cancelBtn_p");
		},
		relieveCancelBtnMouseup: function(){
			$("#relieveCancelBtn").removeClass($("#relieveCancelBtn").attr("class"));
			$("#relieveCancelBtn").addClass("cancelBtn_f");
			$("#relieveView").hide();
			var from = cmap.get("from");
			if(from == "containUser" || from == "fromMoreOrganizationInformation"){									
				var checkedNodes = $('#include_user_groups').tree("getChecked");
				for(var i in checkedNodes){
					$('#include_user_groups').tree("uncheck", checkedNodes[i].target);
				}
			}
		},
		relieveCloseOver: function(){
			$("#relieve_close").removeClass("confirm_close_n");
			$("#relieve_close").addClass("confirm_close_f");
		},
		relieveCloseOut: function(){
			$("#relieve_close").removeClass("confirm_close_f");
			$("#relieve_close").addClass("confirm_close_n");
		},
		relieveCloseClick: function(){
			$("#relieveView").hide();
			var from = cmap.get("from");
			if(from == "containUser" || from == "fromMoreOrganizationInformation"){
				var checkedNodes = $('#include_user_groups').tree("getChecked");
				for(var i in checkedNodes){
					$('#include_user_groups').tree("uncheck", checkedNodes[i].target);
				}
			}
			
		},
		selectAllUserClick: function(){
			var strClass = $("#selectAllUser").attr("class");
			var classes = strClass.split(" ");
			var roots = $('#include_user_groups').tree("getRoots");
			if(classes[1] == "tree-checkbox0"){//全选
				$("#selectAllUser").removeClass("tree-checkbox0");
				$("#selectAllUser").addClass("tree-checkbox1");
				for(var i in roots){
					$('#include_user_groups').tree("check", roots[i].target);
				}
			}
			else if(classes[1] == "tree-checkbox1"){//全不选
				$("#selectAllUser").removeClass("tree-checkbox1");
				$("#selectAllUser").addClass("tree-checkbox0");
				for(var i in roots){
					$('#include_user_groups').tree("uncheck", roots[i].target);
				}
			}
			
		},
		relieveOpen: function(map){
			cmap = map;
			var from = cmap.get("from");
			if(from =="containUser" || from =="fromMoreOrganizationInformation"){//添加用户功能或者从组织详细页面跳转过来
				
				$.ajax({
					url: contextPath + "/ts/omGetAllUser",
					type: "post", 
					success: function(data, textStatus){
						var json = JSON.parse(data);
						var userData = json.data;
						
						$('#include_user_groups').tree({
							animate: true,//有展开动画
							checkbox:true,//可以选择
							cascadeCheck: false,
							data:userData
						});
																
					var url = contextPath + "/ts/omGetUserByOrganization?data={'organizationId':" + cmap.get("node").id + "}";
					operateServerData(url,organizations,getInformation,cmap);
					//获得用户属于的组织
					function getInformation(response,cmap){
						cmap.put("userData",response.data);
						var roots = $('#include_user_groups').tree("getRoots");
						for(var i in response.data){
							for (var j in roots) {
								if(response.data[i].id == roots[j].id){
									$('#include_user_groups').tree("check", roots[j].target);
								}							
							}
						}					
					}
						
			      }});
				
				var strClass = $("#selectAllUser").attr("class");
				var classes = strClass.split(" ");
				if(classes[1] == "tree-checkbox1"){
					$("#selectAllUser").removeClass("tree-checkbox1");
					$("#selectAllUser").addClass("tree-checkbox0");
				}
				
				$("#relieveBox h4").html("添加用户");
				$("#relieveBtn").val("确定");
				$("#relieve_organization_groups").hide();
				$("#include_user_groups").show();
				$("#selectAllUser_div").show();
				$("#relieveBtn_div").css("margin-top",0);
				
				$("#relieveView").show();
			}
			else if(from == "relieveOrganization" || from == "fromMoreUserInformation"){//移至功能或者用户详细信息编辑处跳转过来
				userFirstRelieve = true;
				var node = cmap.get("node");
				var srcUrl = contextPath + '/ts/omGetOrganizationByUser?data={"userId":' + node.id +'}';
				
				//获得用户属于的组织
				function getInformation(response,map){
					cmap.put("organizationData",response.data);
					$('#relieve_organization_groups').tree("uncheck", $('#relieve_organization_groups').tree("find",ORGANIZATION_ROOT_ID).target);
					var url =contextPath + '/ts/omGetAllOrganization?';
					$("#relieve_organization_groups").tree("options").url = url;
					$("#relieve_organization_groups").tree("reload",$("#relieve_organization_groups").tree("find",ORGANIZATION_ROOT_ID).target);
					if($("#relieve_organization_groups").tree("find",ORGANIZATION_ROOT_ID).state == "closed"){
						$("#relieve_organization_groups").children().children().children(".tree-hit").click();
					}
					$("#relieveBox h4").text("移至");
					$("#relieveBtn").val("移动");
					
					$("#relieve_organization_groups").show();
					$("#include_user_groups").hide();
					$("#selectAllUser_div").hide();
					$("#relieveBtn_div").css("margin-top","36px");
					$("#relieveView").show();
				}
				operateServerData(srcUrl,organizations,getInformation,cmap);	
			}
		}
	});
	
	//用户和组织详细信息对话框和编辑详细信息对话框
	MoreInformationView = Backbone.View.extend({
		el: $("#moreInformationView"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var moreInformationTemplate = _.template($("#moreInformation_template").html());
			$(this.el).html(moreInformationTemplate);
		},
		events: {
			"mouseover #edit_MoreInformationBtn": "saveBtnOver",
			"mouseout #edit_MoreInformationBtn": "saveBtnOut",
			"mousedown #edit_MoreInformationBtn": "saveBtnDown",
			"mouseup #edit_MoreInformationBtn": "saveBtnUp",
			"mouseover #changePassword_MoreInformationBtn": "saveBtnOver",
			"mouseout #changePassword_MoreInformationBtn": "saveBtnOut",
			"mousedown #changePassword_MoreInformationBtn": "saveBtnDown",
			"mouseup #changePassword_MoreInformationBtn": "saveBtnUp",
			"mouseover #moreInformation_close": "confirmCloseOver",
			"mouseout #moreInformation_close": "confirmCloseOut",
			"click #moreInformation_close": "confirmCloseClick",
				
			"mouseover #moreInformationSaveBtn": "saveBtnOver",
			"mouseout #moreInformationSaveBtn": "saveBtnOut",
			"mousedown #moreInformationSaveBtn": "saveBtnDown",
			"mouseup #moreInformationSaveBtn": "saveBtnUp",			
			"mouseover #changePasswordSaveBtn": "saveBtnOver",
			"mouseout #changePasswordSaveBtn": "saveBtnOut",
			"mousedown #changePasswordSaveBtn": "saveBtnDown",
			"mouseup #changePasswordSaveBtn": "saveBtnUp",			
			"mouseover #moreInformationCancelBtn": "cancelBtnOver",
			"mouseout #moreInformationCancelBtn": "cancelBtnOut",
			"mousedown #moreInformationCancelBtn": "cancelBtnDown",
			"mouseup #moreInformationCancelBtn": "cancelBtnUp",			
			"mouseover #changePasswordCancelBtn": "cancelBtnOver",
			"mouseout #changePasswordCancelBtn": "cancelBtnOut",
			"mousedown #changePasswordCancelBtn": "cancelBtnDown",
			"mouseup #changePasswordCancelBtn": "cancelBtnUp",			
			"mouseover #edit_moreInformation_close": "confirmCloseOver",
			"mouseout #edit_moreInformation_close": "confirmCloseOut",
			"click #edit_moreInformation_close": "confirmCloseClick",			
			"mouseover #changePassword_moreInformation_close": "confirmCloseOver",
			"mouseout #changePassword_moreInformation_close": "confirmCloseOut",
			"click #changePassword_moreInformation_close": "confirmCloseClick",			
			"focus #moreInformationView table input" :"inputFocus",
			"blur #moreInformationView table input" :"inputBlur",
			"mouseover #user_jump": "jumpOver",
			"mouseout #user_jump": "jumpOut",
			"mousedown #user_jump": "jumpDown",
			"mouseup #user_jump": "jumpUp",
			"mouseover #organization_jump": "organizationJumpOver",
			"mouseout #organization_jump": "organizationJumpOut",
			"mousedown #organization_jump": "organizationJumpDown",
			"mouseup #organization_jump": "organizationJumpUp"
		},
		saveBtnOver: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("saveBtn_f");
		},
		saveBtnOut: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("saveBtn_n");
		},
		saveBtnDown: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("saveBtn_p");
		},
		saveBtnUp: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("saveBtn_f");
			var node = cmap.get("node");
			if(target.id == "edit_MoreInformationBtn"){
				$("#moreInformationBox").hide();
				$("#edit_moreInformationBox").show();
				
				$("#edit_moreInformationBox table input").each(function(){
					$(this).removeClass("textInput_change");
				});
			
				$("#edit_moreInformationBox .error_tip").each(function(){
					if(!$(this).is(":hidden")){
						$(this).hide();
					}
				});
				$("#emai_input").val(node.attributes.email);
				$("#name_input").val(node.text);
				$("#phone_input").val(node.attributes.phone);
				$("#mobilePhone_input").val(node.attributes.mobilePhone);
				$("#address_input").val(node.attributes.address);															
			}else if(target.id == "changePassword_MoreInformationBtn"){
				$("#moreInformationBox").hide();
				$("#changePassword_moreInformationBox").show();
				$("#newPwd_input").focus();
				
				$("#changePassword_moreInformationBox table input").each(function(){
					$(this).removeClass("textInput_change");
				});
			
				$("#changePassword_moreInformationBox .error_tip").each(function(){
					if(!$(this).is(":hidden")){
						$(this).hide();
					}
				});
				$("#newPwd_input").val("");
				$("#confirmPwd_input").val("");
			}
			else if(target.id == "moreInformationSaveBtn"){								
				var type = node.attributes.type;
				if(type == 0){
					if($.trim($("#name_input").val()) == ""){
						$("#editName_input_tip").show();
						$("#editName_input_tip").text("组织名称不能为空");
						return;
					}					
				}
				else if(type == 1){
					if($.trim($("#name_input").val()) == "" || $.trim($("#emai_input").val()) == ""){
						if($.trim($("#name_input").val()) == ""){
							$("#editName_input_tip").show();
							$("#editName_input_tip").text("用户姓名不能为空");
						}
						if($.trim($("#emai_input").val()) == ""){
							$("#editEmail_input_tip").show();
							$("#editEmail_input_tip").text("电子邮箱不能为空");
						}
						return;
					}
				}
				
				var errorTipShow = false;
				$("#edit_moreInformationBox .error_tip").each(function(){
					if(!$(this).is(":hidden")){						
						errorTipShow = true;
					}
				});
				if(errorTipShow){
					return;
				}
				
				if((node.attributes.email == $.trim($("#emai_input").val()))
						&& (node.text == $.trim($("#name_input").val()))
						&& (node.attributes.phone ==$.trim($("#phone_input").val()))
						&& (node.attributes.mobilePhone == $.trim($("#mobilePhone_input").val()))
						&& (node.attributes.address == $.trim($("#address_input").val()))){//信息没有修改
					$("#moreInformationView").hide();
					$("#edit_moreInformationBox").hide();
					return;
				}
				//用户详细信息页面关闭，编辑用户详细信息页面打开
				$("#moreInformationView").hide();
				$("#edit_moreInformationBox").hide();
				
				node.attributes.email =$.trim($("#emai_input").val());
				node.text =$.trim($("#name_input").val());
				node.attributes.phone =$.trim($("#phone_input").val());
				node.attributes.mobilePhone =$.trim($("#mobilePhone_input").val());
				node.attributes.address =$.trim($("#address_input").val());
				var tree_id = cmap.get("tree_id");
				$("#" + tree_id).tree("update",node);
				cmap.remove("node");
				cmap.put("node",node);
				
				if(method){
					method(cmap);
				}

			}else if(target.id == "changePasswordSaveBtn"){
				if($("#newPwd_input").val() != $("#confirmPwd_input").val()){
					$("#confirmPwd_input_tip").text("与新密码输入不一致");
					$("#confirmPwd_input_tip").show();
				}
				var errorTipShow = false;
				$("#changePassword_moreInformationBox .error_tip").each(function(){
					if(!$(this).is(":hidden")){						
						errorTipShow = true;
					}
				});
				if(errorTipShow){
					return;
				}
				//用户详细信息页面关闭，编辑用户详细信息页面打开
				$("#moreInformationView").hide();
				$("#changePassword_moreInformationBox").hide();
				
				var url = contextPath + '/ts/omUpdatePassword?data={"id":'+node.id+',"new":"'+$("#newPwd_input").val()+'"}';
				operateServerData(url, organizations);
			}
		},
		confirmCloseOver: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirm_close_f");
		},
		confirmCloseOut: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirm_close_n");
		},
		confirmCloseClick: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			
			if(target.id == "moreInformation_close"){
				$("#moreInformationBox").hide();
				$("#moreInformationView").hide();
			}
			else if(target.id == "edit_moreInformation_close"){								
				$("#edit_moreInformationBox").hide();
				$("#moreInformationView").hide();
			}else if(target.id == "changePassword_moreInformation_close"){
				$("#changePassword_moreInformationBox").hide();
				$("#moreInformationView").hide();
			}
			
		},
		moreInformationBoxOpen: function(m,map){
			cmap = map;
			method = m;
			var node = map.get("node");
			var data = map.get("data");
			var type = node.attributes.type;
			
			$("#changePassword_MoreInformationBtn").hide();
			if(type == 1){
				$("#changePassword_MoreInformationBtn").show();
			}
			$("#moreInformationBox").show();
			$("#moreInformationView").show();
			//去掉用户或组织详细信息页面中的组织
			var organizationListlength  = $("#organization_list_ul").children().length;
			for(var i=0;i<organizationListlength;i++){
				$("#organization_list_ul").children().eq(0).remove();
			}
			
			if(type == 0){
				$("#name_content_title").text("组织名称：");
				$("#local_title").text("包含用户");
				for(var i=0;i < data.length;i++){
					$("#organization_list_ul").append('<li class="organization_item"><div class="userItem_img"></div>' +
							'<div class="organizationItem_name" id="userItem_name' + (i+1) +'"><span>' + data[i].name  + '</span></div></li>');
					limit("userItem_name" + (i+1),nameLimit);
				}
				$("#organization_list_ul").append('<li class="organization_item_jump"><div class="icon_organization_jump_n" id="organization_jump"></div></li>');
			}
			else if(type == 1){
				$("#name_content_title").text("姓名：");
				$("#local_title").text("所属组织");
				
				for(var i=0;i < data.length;i++){
					$("#organization_list_ul").append('<li class="organization_item"><div class="organizationItem_img"></div>' +
							'<div class="organizationItem_name" id="organizationItem_name' + (i+1) +'"><span>' + data[i].name + '</span></div></li>');
					limit("organizationItem_name" + (i+1),nameLimit);
				}
				$("#organization_list_ul").append('<li class="organization_item_jump"><div class="icon_jump_n" id="user_jump"></div></li>');
			}
			$("#emai_content").text(node.attributes.email);
			$("#name_content").text(node.text);
			$("#phone_content").text(node.attributes.phone);
			$("#mobilePhone_content").text(node.attributes.mobilePhone);
			$("#address_content").text(node.attributes.address);									
		},
		cancelBtnOver: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("cancelBtn_f");
		},
		cancelBtnOut: function(event){
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
			$("#changePassword_moreInformationBox").hide();
			$("#edit_moreInformationBox").hide();
			$("#moreInformationView").hide();
			
			
		},
		inputFocus: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("textInput_p");
			var tip = $(target).parent().parent().next().children().children();
			if(!$(tip).is(":hidden")){
				$(tip).hide();
			}
		},
		inputBlur: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("textInput_n");
			$(target).addClass("textInput_change");
			
			if(target.id == "emai_input"){//验证邮箱格式
				if($.trim($(target).val()) != ""){
					var myreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;///^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
					if(!myreg.test($("#" + target.id).val())){
						var tipDiv = $("#" + target.id).parent().parent().next().children().children();
						tipDiv.text("请输入正确的电子邮箱地址");
						tipDiv.show();
					}else{
						var url = contextPath + '/ts/omUserIsExit?data={"email":"'+$("#" + target.id).val()+'"}';
						$.ajax({
							url: url,
							type: "post", 
							success: function(response){
								if(JSON2.parse(response).returnFlag != 0){
									var tipDiv = $("#" + target.id).parent().parent().next().children().children();
									tipDiv.text("电子邮箱地址重复，请重新输入");
									tipDiv.show();
								}
							}
						});
					}
				}
			}
			if(target.id == "phone_input"){//验证电话号码	
				if($.trim($(target).val()) != ""){
					var myreg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7}$/;
					var myregs = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}$/;
					if(!myreg.test($("#" + target.id).val()) && !myregs.test($("#" + target.id).val())){
						var tipDiv = $("#" + target.id).parent().parent().next().children().children();
						tipDiv.text("请输入正确的电话号码");
						tipDiv.show();
					}
				}
			}
			if(target.id == "mobilePhone_input"){//验证手机号码
				if($.trim($(target).val()) != ""){
					var myreg = /^1[0-9]{10}$/;
					if(!myreg.test($("#" + target.id).val())){
						var tipDiv = $("#" + target.id).parent().parent().next().children().children();
						tipDiv.text("请输入正确的手机号码");
						tipDiv.show();
					}
				}
			}
			if(target.id == "newPwd_input"){
				if($.trim($(target).val()) != ""){
//					var myreg =/^[0-9]{6,16}$/;
					var myreg = /^(?=.*\d.*)(?=.*[a-zA-Z].*)|(?=.*\d.*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*)|(?=.*[a-zA-Z].*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*).{6,16}$/;
					if(!myreg.test($("#" + target.id).val())){
						var tipDiv = $("#" + target.id).parent().parent().next().children().children();
						tipDiv.text('密码过于简单，请尝试6~16位“字母、数字、符号”的组合');
						tipDiv.show();
						return;
					}
					
					/*var myreg = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\_]{6,16}$/;
					if(!myreg.test($("#" + target.id).val())){
						var tipDiv = $("#" + target.id).parent().parent().next().children().children();
						tipDiv.text("6~16位字符，区分大小写");
						tipDiv.show();
					}*/
				}else{
					var tipDiv = $("#" + target.id).parent().parent().next().children().children();
					tipDiv.text('密码不能为空');
					tipDiv.show();
					return;
				}
			}
			if(target.id == "confirmPwd_input"){
				if($("#newPwd_input").val() != $("#confirmPwd_input").val()){
					var tipDiv = $("#" + target.id).parent().parent().next().children().children();
					tipDiv.text("与新密码输入不一致");
					tipDiv.show();
				}
			}
		},
		jumpOver: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("icon_jump_f");
		},
		jumpOut: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("icon_jump_n");
		},
		jumpDown: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("icon_jump_p");
		},
		jumpUp: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("icon_jump_f");
						
			$("#moreInformationView").hide();
			
			var map = new HashMap();
			var node = cmap.get("node");
			var tree_id = cmap.get("tree_id");
			
			map.put("node", node);
			map.put("tree_id", tree_id);
			map.put("from", "fromMoreUserInformation");
			relieveView.relieveOpen(map);
		},
		organizationJumpOver: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("icon_organization_jump_f");
		},
		organizationJumpOut: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("icon_organization_jump_n");
		},
		organizationJumpDown: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("icon_organization_jump_p");
		},
		organizationJumpUp: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("icon_organization_jump_f");
						
			$("#moreInformationView").hide();
			
			var map = new HashMap();
			var node = cmap.get("node");
			var tree_id = cmap.get("tree_id");
			
			map.put("node", node);
			map.put("tree_id", tree_id);
			map.put("from", "fromMoreOrganizationInformation");
			
			relieveView.relieveOpen(map);
		}
	});
	
	NewResourceView = Backbone.View.extend({
		el: $("#newResourceView"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var newResourceTemplate = _.template($("#newResource_template").html());
			$(this.el).html(newResourceTemplate);
		},
		events: {
			"focus input":"textInputFocus",
			"blur input":"textInputBlur",
			"mouseover #newResourceConfirmBtn": "confirmBtnOver",
			"mouseout #newResourceConfirmBtn": "confirmBtnOut",
			"mousedown #newResourceConfirmBtn": "confirmBtnDown",
			"mouseup #newResourceConfirmBtn": "confirmBtnUp",			
			"mouseover #newResourceCancelBtn": "cancelBtnOver",
			"mouseout #newResourceCancelBtn": "cancelBtnOut",
			"mousedown #newResourceCancelBtn": "cancelBtnDown",
			"mouseup #newResourceCancelBtn": "cancelBtnUp",
			"mouseover #newResource_close": "confirmCloseOver",
			"mouseout #newResource_close": "confirmCloseOut",
			"click #newResource_close": "confirmCloseClick"
		},
		confirmBtnOver: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_f");
		},
		confirmBtnOut: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_n");
		},
		confirmBtnDown: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_p");
		},
		confirmBtnUp: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_f");
			
			var errorTipShow = false;
			$("#newResource .error_tip").each(function(){
				if(!$(this).is(":hidden")){						
					errorTipShow = true;
				}
			});
			if(errorTipShow){
				return;
			}
			
			var url = contextPath + '/ts/omCheckNoIsExit?data={"no":"'+$.trim($("#resource_number_input").val())+'"}';
			operateServerData(url, resources, IsNotRepeat);
			function IsNotRepeat(response){
				if (cmap) {
					var name = $.trim($("#resource_name_input").val());
					var no = $.trim($("#resource_number_input").val());
					cmap.remove("name");
					cmap.put("name",name);
					cmap.put("no",no);
					method(cmap);
				}
			}
			
			$("#newResourceView").hide();
		},
		cancelBtnOver: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("cancelBtn_f");
		},
		cancelBtnOut: function(event){
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
			$("#newResourceView").hide();
		},
		confirmCloseOver:function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirm_close_f ");
		},
		confirmCloseOut:function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirm_close_n ");
		},
		confirmCloseClick: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;			
			$("#newResourceView").hide();
		},
		textInputFocus: function(event) {
			var e = event || window.event;
			var target = e.srcElement || e.target;
			var defaultValue = $(target).attr("defaultValue");
			if(target.type == "text"){
				if($.trim($(target).val()) == defaultValue 
						&& ($(target).css("color") == "#999999" 
							|| $(target).css("color")=="rgb(153, 153, 153)")){
					$(target).val("");
					$(target).addClass("textInput_change");
				}
				
				$(target).removeClass("textInput_n");
				$(target).addClass("textInput_p");
				
				var tip = $(target).parent().parent().next().children().children();
				if(!$(tip).is(":hidden")){
					$(tip).hide();
				}
			}
		},
		textInputBlur: function(event) {
			var e = event || window.event;
			var target = e.srcElement || e.target;
			var defaultValue = $(target).attr("defaultValue");
			if(target.type == "text"){
				
				if($.trim($(target).val()) == ""){
					$(target).val(defaultValue);
					$(target).removeClass("textInput_change");
				}
				$(target).removeClass("textInput_p");
				$(target).addClass("textInput_n");
			}
			
			if(inputHasNoContent("resource_name_input")){
				$("#resource_name_input_tip").text("资源名称不能为空");
				$("#resource_name_input_tip").show();
				return;
			}
			
			if(inputHasNoContent("resource_number_input")){
				$("#resource_number_input_tip").text("资源编号不能为空");
				$("#resource_number_input_tip").show();
				return;
			}
		},
		newResourceViewOpen: function(m,map){
			cmap = map;
			method = m;
			$("#newResourceView").show();
			$("#resource_name_input").removeClass("textInput_change");
			$("#resource_name_input").val("资源名称");
			$("#resource_name_input").focus();
			$("#resource_number_input").removeClass("textInput_change");
			$("#resource_number_input").val("资源编号");
			if(!$("#resource_name_input_tip").is(":hidden")){
				$("#resource_name_input_tip").hide();
			}
		}
		
	});
	//用于判断input中是否没有内容
	function inputHasNoContent(inputId){
		var defaultValue = $("#" + inputId).attr("defaultValue");
		return $.trim($("#" + inputId).val()) == defaultValue 
			&& ($("#" + inputId).css("color") == "#999999" 
			|| $("#" + inputId).css("color")=="rgb(153, 153, 153)");
	}
});