/**
 * 用户View
 */
$(function() {
	UserView = Backbone.View.extend({
		el: $("#userView"),
		userInfo:null,
		initialize: function(){
			this.rander();
			users = new Users(null, { view : this });
		},
		rander: function(){
			var userTemplate = _.template($("#user_template").html());
			$(this.el).html(userTemplate);
		},
		events: {
			"mouseover #edit_userBtn": "saveBtnOver",
			"mouseout #edit_userBtn": "saveBtnOut",
			"mousedown #edit_userBtn": "saveBtnDown",
			"mouseup #edit_userBtn": "saveBtnUp",
			"mouseover #changePassword_userBtn": "saveBtnOver",
			"mouseout #changePassword_userBtn": "saveBtnOut",
			"mousedown #changePassword_userBtn": "saveBtnDown",
			"mouseup #changePassword_userBtn": "saveBtnUp",
			"mouseover #user_close": "confirmCloseOver",
			"mouseout #user_close": "confirmCloseOut",
			"click #user_close": "confirmCloseClick",
				
			"mouseover #userSaveBtn": "saveBtnOver",
			"mouseout #userSaveBtn": "saveBtnOut",
			"mousedown #userSaveBtn": "saveBtnDown",
			"mouseup #userSaveBtn": "saveBtnUp",			
			"mouseover #changePasswordSaveBtn": "saveBtnOver",
			"mouseout #changePasswordSaveBtn": "saveBtnOut",
			"mousedown #changePasswordSaveBtn": "saveBtnDown",
			"mouseup #changePasswordSaveBtn": "saveBtnUp",			
			"mouseover #userCancelBtn": "cancelBtnOver",
			"mouseout #userCancelBtn": "cancelBtnOut",
			"mousedown #userCancelBtn": "cancelBtnDown",
			"mouseup #userCancelBtn": "cancelBtnUp",			
			"mouseover #changePasswordCancelBtn": "cancelBtnOver",
			"mouseout #changePasswordCancelBtn": "cancelBtnOut",
			"mousedown #changePasswordCancelBtn": "cancelBtnDown",
			"mouseup #changePasswordCancelBtn": "cancelBtnUp",			
			"mouseover #edit_user_close": "confirmCloseOver",
			"mouseout #edit_user_close": "confirmCloseOut",
			"click #edit_user_close": "confirmCloseClick",			
			"mouseover #changePassword_user_close": "confirmCloseOver",
			"mouseout #changePassword_user_close": "confirmCloseOut",
			"click #changePassword_user_close": "confirmCloseClick",			
			"focus #userView table input" :"inputFocus",
			"blur #userView table input" :"inputBlur"
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
			var userInfo = this.userInfo;
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("saveBtn_f");
			if(target.id == "edit_userBtn"){
				$("#userBox").hide();
				$("#edit_userBox").show();
				
				$("#edit_userBox table input").each(function(){
					$(this).removeClass("textInput_change");
				});
			
				$("#edit_userBox .error_tip").each(function(){
					if(!$(this).is(":hidden")){
						$(this).hide();
					}
				});
				$("#emai_input").val(userInfo.email);
				$("#name_input").val(userInfo.name);
				$("#phone_input").val(userInfo.phone);
				$("#mobilePhone_input").val(userInfo.mobilePhone);
				$("#address_input").val(userInfo.address);															
			}else if(target.id == "changePassword_userBtn"){
				$("#userBox").hide();
				$("#changePassword_userBox").show();
				$("#newPwd_input").focus();
				
				$("#changePassword_userBox table input").each(function(){
					$(this).removeClass("textInput_change");
				});
			
				$("#changePassword_userBox .error_tip").each(function(){
					if(!$(this).is(":hidden")){
						$(this).hide();
					}
				});
				$("#newPwd_input").val("");
				$("#confirmPwd_input").val("");
			}
			else if(target.id == "userSaveBtn"){
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
				
				var errorTipShow = false;
				$("#edit_userBox .error_tip").each(function(){
					if(!$(this).is(":hidden")){						
						errorTipShow = true;
					}
				});
				if(errorTipShow){
					return;
				}
				
				if((userInfo.email == $.trim($("#emai_input").val()))
						&& (userInfo.name == $.trim($("#name_input").val()))
						&& (userInfo.phone ==$.trim($("#phone_input").val()))
						&& (userInfo.mobilePhone == $.trim($("#mobilePhone_input").val()))
						&& (userInfo.address == $.trim($("#address_input").val()))){//信息没有修改
					$("#userView").hide();
					$("#edit_userBox").hide();
					return;
				}
				
				var _userInfo = {};
				_userInfo.id = userInfo.id;
				_userInfo.email =$.trim($("#emai_input").val());
				_userInfo.name =$.trim($("#name_input").val());
				_userInfo.phone =$.trim($("#phone_input").val());
				_userInfo.mobilePhone =$.trim($("#mobilePhone_input").val());
				_userInfo.address =$.trim($("#address_input").val());
				var map = new HashMap();
				map.put("userInfo",_userInfo);
				var closeWin = function(response,map){
					//关闭弹窗
					$("#userView").hide();
					$("#edit_userBox").hide();
					var name = map.get("userInfo").name;
					userName = name;
					$("#username").text(userName);//更新用户名
				};
				
				var url = contextPath + '/updateUserInfo.do?data={"id":' + _userInfo.id + ',"name":"' 
				+ encodeURIComponent(_userInfo.name) + '","type":' + 1 + ',"email":"' + _userInfo.email + '","phone":"' + _userInfo.phone +
				'","mobilePhone":"' + _userInfo.mobilePhone + '","address":"' + encodeURIComponent(_userInfo.address) +'"}';
				operateServerData(url,users,closeWin,map);

			}else if(target.id == "changePasswordSaveBtn"){
				if($("#newPwd_input").val() != $("#confirmPwd_input").val()){
					$("#confirmPwd_input_tip").text("与新密码输入不一致");
					$("#confirmPwd_input_tip").show();
				}
				var errorTipShow = false;
				$("#changePassword_userBox .error_tip").each(function(){
					if(!$(this).is(":hidden")){						
						errorTipShow = true;
					}
				});
				if(errorTipShow){
					return;
				}
				
				var closeWin = function(response,map){
					//关闭弹窗
					$("#userView").hide();
					$("#changePassword_userBox").hide();
				};
				
				var url = contextPath + '/updateUserPassword.do?data={"id":'+userInfo.id+',"new":"'+$("#newPwd_input").val()+'"}';
				operateServerData(url, users, closeWin);
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
			
			if(target.id == "user_close"){
				$("#userBox").hide();
				$("#userView").hide();
			}
			else if(target.id == "edit_user_close"){								
				$("#edit_userBox").hide();
				$("#userView").hide();
			}else if(target.id == "changePassword_user_close"){
				$("#changePassword_userBox").hide();
				$("#userView").hide();
			}
			
		},
		getUserInfo: function(method,map){
			var url = contextPath + '/getUserInfo.do?data={"type":1,"id":' + userId +'}';	
			var _this = this;
			function p_method(response,map){
				_this.userInfo = response.data;
				if(method){
					method(response,map);	
				}
			}
			operateServerData(url,users,p_method,map);
		},
		openUserInfoWin: function(response,map){
			var data = response.data;
			$("#changePassword_userBtn").hide();
			$("#changePassword_userBtn").show();
			$("#userBox").show();
			$("#userView").show();
		
			if(data){
				$("#emai_content").text(data.email);
				$("#name_content").text(data.name);
				$("#phone_content").text(data.phone);
				$("#mobilePhone_content").text(data.mobilePhone);
				$("#address_content").text(data.address);	
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
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("cancelBtn_f");
			$("#changePassword_userBox").hide();
			$("#edit_userBox").hide();
			$("#userView").hide();
			
			
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
					}else if($.trim(this.userInfo.email)==$.trim($(target).val())){
						//邮箱地址未更改
					}else{
						var url = contextPath + '/isUserExit.do?data={"email":"'+$("#" + target.id).val()+'"}';
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
					var myreg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}$/;
					if(!myreg.test($("#" + target.id).val())){
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
					var myreg = /^(?=.*\d.*)(?=.*[a-zA-Z].*)|(?=.*\d.*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*)|(?=.*[a-zA-Z].*)(?=.*[\!\#\$\%\^\&\*\.\~\_].*).{6,16}$/;
					if(!myreg.test($("#" + target.id).val())){
						var tipDiv = $("#" + target.id).parent().parent().next().children().children();
						tipDiv.text('密码过于简单，请尝试6~16位“字母、数字、符号”的组合');
						tipDiv.show();
						return;
					}
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
		}
	});
});