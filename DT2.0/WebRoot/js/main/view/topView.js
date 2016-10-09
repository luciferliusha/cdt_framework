/**
 * 顶端view
 */
$(function(){
	TopView = Backbone.View.extend({
		el: $("#topView"),
		initialize: function(){
			this.rander();
			
			if(shareData){
				$("#share").remove();
				$("#set_list").css("padding-top", "6px");
				$("#set_list_div").css("background", "url('../images/common/option-menubg.png') no-repeat");
			}
			
			/**嘉善项目，右上角只显示保存 start*/
			/*$("#username").hide();
			$("#logout").hide();
			$("#set_list #save").css("margin-top","2px");
			$("#set_list_div").css("background-image",'url("' + contextPath + '/images/common/option-menubg-one.png")');*/
			/**嘉善项目，右上角只显示保存 end*/
		},
		rander: function(){
			var topTemplate = _.template($("#top_template").html(),{sysName:sysName});
			$(this.el).html(topTemplate);
		},
		events: {
			"mousedown #logo": "control_mousedown",
			"mouseover #logo": "control_mouseover",
			"mouseout #logo": "control_mouseout",
			"click #setting": "set",
			"mousedown #setting": "logoutMousedown",
			"mouseover #set_list li": "set_list_mouseover",
			"mouseout #set_list li": "set_list_mouseout",
			"mouseover #message" :"message_mouseover",
			"mouseout #message" :"message_mouseout",
			"mousedown #message" :"message_mousedown",
			"click #save": "save",
			"click #share": "share",
			"click #logout": "logout",
			"click #username": "showUserInfo"
		},
		message_mouseover:function(){
			$("#message").removeClass($("message").attr("class"));
			$("#message").addClass("message_hov");
		},
		message_mouseout:function(){
			$("#message").removeClass($("message").attr("class"));
			$("#message").addClass("message_def");
		},
		message_mousedown:function(){
			$("#message").removeClass($("message").attr("class"));
			$("#message").addClass("message_pre");
		},
		control_mousedown: function(){
			if(controlClicked){
				return;
			}
			controlClicked = true;
			var clientWidth = document.documentElement.clientWidth;
			$("#control").removeClass($("#control").attr("class"));
			
			if($("#working").width() == clientWidth){//展开
				$("#logo").attr("title","收起侧边导航");
				$("#control").addClass("control_p");
				$("#working").animate({left:solution_space_width + "px",width:clientWidth-solution_space_width},400,function(){
					controlClicked = false;
					if ($.browser.webkit && $("#label0_solusion_content_spaceTitle").length > 0) {//防止webkit内核的出现滚动条后不能去掉了
						$("#label0_solusion_content_space").height($("#label0_solusion_content_space").height()-10);
						$("#label0_solusion_iframeDiv").height($("#label0_solusion_iframeDiv").height()-10);
						$("#label0_solusion_iframe").height($("#label0_solusion_iframe").height() -10 );
					}
					resizeIframe();
					frameTitleConfigView.resizePanels();
				});
			}
			else{//闭合
				$("#logo").attr("title","展开侧边导航");
				$("#control").addClass("control_f");
				$("#working").animate({left:0,width:clientWidth},400,function(){
					controlClicked = false;
					if ($.browser.webkit && $("#label0_solusion_content_spaceTitle").length > 0) {
						$("#label0_solusion_content_space").height($("#label0_solusion_content_space").height()+10);
						$("#label0_solusion_iframeDiv").height($("#label0_solusion_iframeDiv").height()+10);
						$("#label0_solusion_iframe").height($("#label0_solusion_iframe").height()+10 );
					}
					resizeIframe();
					frameTitleConfigView.resizePanels();
				});			
			}
		},
		control_mouseover: function(){
			if($("#control").attr("class") == "control_p"){
				return;
			}
			$("#control").removeClass($("#control").attr("class"));
			$("#control").addClass("control_f");
		},
		control_mouseout: function(){
			if($("#control").attr("class") == "control_p"){
				return;
			}
			$("#control").removeClass($("#control").attr("class"));
			$("#control").addClass("control_n");
		},
		set: function(){
			if($("#set_list_div").is(":visible")){
				$("#set_list_div").hide();
			}
			else{
				$("#set_list_div").show();
				$("#set_list_div").focus();
			}
			$("#set_list_div").bind("blur",function(){
				var browser = navigator.userAgent;
				if(browser.indexOf('MSIE') != -1 ){
					if(document.activeElement.id != "setting"){
						if($("#set_list_div").is(":visible")){
							$("#set_list_div").hide();
						}
					}
				}
				else{
					if($("#set_list_div").is(":visible")){
						$("#set_list_div").hide();
					}
				}		
			});
		},
		logoutMousedown: function(){
			return false;
		},
		set_list_mouseover: function(event){
			var e = event || window.event;
            var target = e.srcElement || e.target;
            if(target.className == "user"){
            	return;
            }
            if(target.id == "save"){
            	if(isFromOrm){
            		if(ORMPermissionWorking('SAVE')){
                		return;
                	}
            	}
            	else if(isFromOutOm){
            		if(checkOutOmPermissionWorking('SAVE')){
            			return;
            		}
            	}
            	else{
	            	if(cdtPermissionWorking('CDT-05', 3)){
	            		return;
	            	}
            	}
            }
            if(target.id == "share"){
            	if(isFromOrm){
            		if(ORMPermissionWorking('SHARE')){
                		return;
                	}
            	}
            	else if(isFromOutOm){
            		
            	}
            	else{
            		if(cdtPermissionWorking('CDT-06', 3)){
                		return;
                	}
            	}
            }
            
			$(target).removeClass("set_list_n");
			$(target).addClass("set_list_f");
		},
		set_list_mouseout: function(event){
			var e = event || window.event;
            var target = e.srcElement || e.target;
            if(target.className == "user"){
            	return;
            }
			$(target).removeClass("set_list_f");
			$(target).addClass("set_list_n");
		},
		save: function(){
			if(isFromOrm){
				if(ORMPermissionWorking('SAVE')){
					return;
				}
			}
			else if(isFromOutOm){
				if(checkOutOmPermissionWorking('SAVE')){
					return;
				}
			}
			else{
				if(cdtPermissionWorking('CDT-05', 3)){
					return;
				}
			}
			
			function saveResult(){
				checkSave();//只保存当前的解决方案
				//var keys = solutionLabels.keys();
				//var length = solutionLabels.size();
				//for(var k=0; k<length; k++){
//					var key = solutionLabels.keys()[0];
//					var value = JSON2.stringify(solutionLabels.get(key));
//					var url = contextPath + '/updateDescribeById.do';
//					var param = {pfId:key,describe:value};
//					operateServerData(url, labelView.labels, null, null, param);
//					solutionLabels.remove(key);
				//}
			}
			//保存最近显示的页面到hashmap
//			WorkingspaceSave(SELECT_SOLUTION);
			$("#set_list_div").hide();
			if(solutionLabels.size() != 0){
				//var url = contextPath + "/checkPriv.do?resource=save";
				//operateServerData(url,labelView.labels,saveResult);
				saveResult();
			}
		},
		share:function() {//分享
			if(isFromOrm){
				if(ORMPermissionWorking('SHARE')){
					return;
				}
			}
			else if(isFromOutOm){
//				if(checkOutOmPermissionWorking('SHARE')){
//					return;
//				}
			}
			else{
				if(cdtPermissionWorking('CDT-06', 3)){
					return;
				}
			}
			
			$("#set_list_div").hide();
			if (READLOCK==0) {//没有选择解决方案则不弹出分享
				//alert("请先选择解决方案！");
				$.messager.alert("操作提示", "请先选择解决方案!","error");
				return;
			}
			$("#shareWinView").show();
			if ($("#selectAllUser").hasClass("tree-checkbox1")) {
				$("#selectAllUser").removeClass("tree-checkbox1");
				$("#selectAllUser").addClass("tree-checkbox0");
			}
			/** 用户树 */
			if (shareUserData) {
				//存在，则先全部取消选择的
				var roots = $('#share_users').tree("getRoots");
				for (var i in roots) {//先全部取消
					$('#share_users').tree("uncheck", roots[i].target);
				}
				setSharedUserSelected();
			}
			else {
				$.getJSON(contextPath + '/getShareUserList.do',function(treeData){
					if (treeData.returnFlag == 0){
						shareUserData = treeData.data;
						$('#share_users').tree({
							animate: true,//有展开动画
							checkbox:true,//可以选择
							cascadeCheck: false,
							data:shareUserData
						});
						setSharedUserSelected();
					}
				});
			}
			function setSharedUserSelected() {
				//取得已经分享的用户
				pfSharedUsers = null;//先清空
				var key = pfIdData.get(solutionSelectItemId);
				$.getJSON(contextPath + '/getSharedUsersByPF.do?pfId='+key,function(userData){
					if (userData.returnFlag == 0){
						var roots = $('#share_users').tree("getRoots");
						var node;
						pfSharedUsers = userData.data;
						if(pfSharedUsers.length == 1 && pfSharedUsers[0].id == '-999'){
							$("#selectAllUser").click();
						}else{
							for (var j in pfSharedUsers) {
								for (var i in roots) {
									node = roots[i];
									if (node.id == pfSharedUsers[j].id) {
										$('#share_users').tree("check", node.target);
										break;
									}
								}
							}
						}
					}
				});
			}
		},
		logout: function(){
			if(isFromOrm){
				doLogout();
			}else{
				window.location.href=contextPath + "/logout.do";
			}
		},
		showUserInfo: function(){
			$("#set_list_div").hide();
			var map = new HashMap();
			userView.getUserInfo(userView.openUserInfoWin,map);
		}
	});
});