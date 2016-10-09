/**
 * 登录前界面的框架布局
*/
$(function(){
	TopView = Backbone.View.extend({
		el: $("#top"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var topTemplate = _.template($("#top_template").html());
			$(this.el).html(topTemplate);
		},
		events: {
			"click #user_login": "userLogin",
			"click #user_signin": "userSignin",
			"mousedown #user_signin": "userSigninMousedown",
			"mouseover #register_list li": "register_list_mouseover",
			"mouseout #register_list li": "register_list_mouseout",
			"click #personalRegister": "personalRegister",
			"click #enterpriseRegister": "enterpriseRegister"
		},
		userLogin: function(){
			selectedId = "";//直接点击登录则设置为空
			$("#signin_wd").hide();
			$("#blackboard").show();
			$("#login_wd").show();
			loginFocus("#loginName", "#pwd", "#login");
			$("#loginName").focus();
		},
		userSignin: function(){
			if($("#registerOptions").is(":visible")){
				$("#registerOptions").hide();
			}
			else{
				$("#registerOptions").show();
				$("#registerOptions").focus();
			}
			$("#registerOptions").bind("blur",function(){
				var browser = navigator.userAgent;
				if(browser.indexOf('MSIE') != -1 ){
					if($("#registerOptions").is(":visible")){
						$("#registerOptions").hide();
					}
				}
				else{
					if($("#registerOptions").is(":visible")){
						$("#registerOptions").hide();
					}
				}		
			});
		},
		userSigninMousedown: function(){
			return false;
		},
		register_list_mouseover: function() {
			var e = event || window.event;
            var target = e.srcElement || e.target;
			$(target).removeClass("register_list_n");
			$(target).addClass("register_list_f");
		},
		register_list_mouseout: function() {
			var e = event || window.event;
            var target = e.srcElement || e.target;
			$(target).removeClass("register_list_f");
			$(target).addClass("register_list_n");
		},
		personalRegister: function() {
			$("#registerOptions").hide();
			$("#new_organization").hide();
			$("#new_simple_user").show();
			registerSimpleUserShow();
		},
		enterpriseRegister: function() {
			$("#registerOptions").hide();
			$("#new_simple_user").hide();
			$("#new_organization").show();
			registerOrganizationShow();
		}
	});
	function registerSimpleUserShow(){
		$("#login_wd").hide();
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
		$("#login_wd").hide();
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
});