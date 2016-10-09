<%@page import="com.zjcds.framework.view.bean.UserPermission"%>
<%@page import="com.zjcds.portal.config.ConfigManager" %>
<%@page import="com.zjcds.framework.common.constant.Constants"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String style = ConfigManager.getInstance().getSysConfig().getStyleName();
%>
<!DOCTYPE HTML>
<html>
	<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/jquery/jquery-1.7.2.js"></script>
  		
  		<link rel="stylesheet" href="<%=request.getContextPath() %>/js/libs/tip/jquery.qtip.css" type="text/css">
  		<link href="<%=request.getContextPath() %>/css/<%=style %>/main.css" rel="stylesheet" type="text/css" />
  		<link href="<%=request.getContextPath() %>/css/<%=style %>/userView.css" rel="stylesheet" type="text/css" />
  		<link href="<%=request.getContextPath() %>/css/<%=style %>/confirmbox.css" rel="stylesheet" type="text/css" />
  		<link href="<%=request.getContextPath() %>/css/<%=style %>/jquery-ui.css" rel="stylesheet" type="text/css" />
  		<link rel="stylesheet" href="<%=request.getContextPath() %>/js/libs/easyui/themes/default/easyui.css" type="text/css">
		<link rel="stylesheet" href="<%=request.getContextPath() %>/js/libs/easyui/themes/icon.css" type="text/css">

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
					
  		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/jquery/jquery-ui.js"></script>
  		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/underscore/underscore-min.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/backbone/backbone-min.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/easyui/jquery.easyui.min.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/My97DatePicker/WdatePicker.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/tip/jquery.qtip.js"></script>
		<link rel="stylesheet" href="<%=request.getContextPath() %>/js/libs/minicolors/jquery.minicolors.css" type="text/css" />
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/minicolors/jquery.minicolors.min.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/framework/constant/constants.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/SettingConst.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/resize.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/name_limit.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/cdtUtil.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/util.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/workingspace_console.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/draggableFrame.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/json2.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/containSpecial.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/cdtPermissionInterface.js"></script>
		
		<!-- backbone.js -->
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/gobal/httptools.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/model/labelModel.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/model/componentModel.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/model/solutionModel.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/model/userModel.js"></script>
		
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/topView.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/labelView.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/operateTitleView.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/componentView.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/solutionView.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/workingView.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/confirmboxView.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/labelSettingView.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/solutionSettingView.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/shareView.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/userView.js"></script>
		
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/collection/mainCollection.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/init/initLabel.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/init/initTop.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/init/initWorking.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/init/initComponent.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/init/initSolution.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/init/initMain.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/init/initUserView.js"></script>
		

		<script type="text/javascript">
			var shareData = false;
			//设置是否要验证登录用户，如果不需要则 在这里设置为false
			var needSession = true;//是否要验证登录用户，如果是则需要验证session超时和用户的权限，如果否则通过sys用户操作，默认为true
			var isSessionOut = false;//是否超时
			var isFromOrm = false;//权限是否从orm接口来
			var isFromOutOm = false;//权限是否从外部权限系统来
			var userName = "";
			var userAcct = "";//用户账号

		<%
			UserPermission clientsession = (UserPermission)request.getSession().getAttribute("sessionUser");
			String sharedNotAvailable =  ConfigManager.getInstance().getSysConfig().getPlatformAsResource();
		 	if ("true".equals(sharedNotAvailable)) {//是否为分享模式
		%>
		 	 shareData = true;
		<%
			}
			String userName = "";
			String userAcct = "";
			if(clientsession != null){
				//获取用户名
				userName = clientsession.getName();
				userAcct = clientsession.getLoginName();
			}
			else {
		%>
			isSessionOut = true;
		<%
		 	}
		%>
			if (isFromOrm) {
				isSessionOut = false;
			}
			var canAnimateMenu = false;//是否点击解决方案自动收缩解决方案左侧栏
		
			//先记录上下文
			var contextPath = "<%=request.getContextPath() %>";
			var selectedId = '<%=request.getParameter("selectedId")%>';//默认选中的平台解决方案
			var showMenu = '<%=request.getParameter("showMenu")%>';//标识默认是否显示左侧菜单，false不显示
			var userId = '<%=request.getParameter("userId")%>';
			if(isFromOrm){
				userAcct = userName = '<%=request.getParameter("loginName")%>';
			}
			else{
				userName = '<%=userName%>';
				userAcct = '<%=userAcct%>';
			}
			
			var clientHeight = document.documentElement.clientHeight;
			var clientWidth = document.documentElement.clientWidth;
			
			$(function(){
				if(isFromOrm){
					getUserStatus(userName, isSessionOut);
				}
				else if(isFromOutOm){
					getRightXML();
				}
				else {
					if (isSessionOut == true && needSession == true) {
					 	$.messager.alert("操作提示", "您未登录或离开系统过久,请重新登录!","error", function() {
					 		window.location.href="<%="".equals(request.getContextPath()) ? "/" : request.getContextPath() %>";
					 	});
					 	return;
					}
					cdtGetUrlPermission(userId);//从接口获取权限字段
				}
				
				resize();
				if(showMenu != "null" && showMenu == "false"){
					$("#control").removeClass("control_p");	
					$("#control").addClass("control_n");
				}
				else {
					$("#logo").attr("title","收起侧边导航");
				};
				
			});
						
			window.onresize = function(){
				resize();
			};
			
			//调整宽和高
			function resize(){
				var clientHeight = document.documentElement.clientHeight;
				var clientWidth = document.documentElement.clientWidth;
				$("#operate").height(clientHeight - 40 + "px");
				$("#components_groups").height($("#operate").height() - $(".operate_title_bg").height() + "px");
				var operate_title_bg_height = $(".operate_title_bg").height();
				if ($(".operate_title_bg").is(":hidden")) {
					operate_title_bg_height = 0;
				}
				var paddingWidth = 7;
				if (SOLUTION_SCAN_TYPE == 2) {//浏览模式
					paddingWidth = 0;
				}
				$("#solutions_groups").height($("#operate").height() - paddingWidth - //-7是因为解决方案页面设置了间距7
					operate_title_bg_height - $("#solutions_operate_title").height() + "px");
				
				$("#working").height(clientHeight - 40 + "px");
				$(".working_content").height(clientHeight - 40 - $("#texture").height() + "px");
				if(showMenu != "null" && showMenu == "false"){//默认不显示左侧菜单，false
					if($("#working").css("left") == "0px"){
						$("#working").width(clientWidth + "px");
					}
					else{
						$("#working").width((clientWidth - solution_space_width) + "px");
					}
				}
				else{
					if($("#working").css("left") == "0px"){
						$("#working").css("left", solution_space_width+ "px");
						$("#working").width((clientWidth - solution_space_width) + "px");
						$(".page-shadow").css("left", (solution_space_width-5) + "px");
					}
					else{
						$("#working").width((clientWidth - solution_space_width) + "px");
					}
				}
				
				$("#comfirmbox").css("top",clientHeight/2-$("#comfirmbox").height()/2 + "px");
				$("#comfirmbox").css("left",clientWidth/2-$("#comfirmbox").width()/2 + "px");
				$("#newWin").css("top",clientHeight/2-$("#comfirmbox").height()/2 + "px");
				$("#newWin").css("left",clientWidth/2-$("#comfirmbox").width()/2 + "px");
				$("#renameWin").css("top",clientHeight/2-$("#comfirmbox").height()/2 + "px");
				$("#renameWin").css("left",clientWidth/2-$("#comfirmbox").width()/2 + "px");
				$("#labelSettingView").css("top",clientHeight/2-$("#labelSettingView").height()/2 + "px");
				$("#labelSettingView").css("left",clientWidth/2-$("#labelSettingView").width()/2 + "px");
				$("#solutionEditWin").css("top",clientHeight/2-$("#solutionEditWin").height()/2 + "px");
				$("#solutionEditWin").css("left",clientWidth/2-$("#solutionEditWin").width()/2 + "px");
				$("#frameTitleConfigWin").css("left",clientWidth/2-$("#frameTitleConfigWin").width()/2 + "px");
				$("#frameTitleConfigWin").css("top",clientHeight/2-$("#frameTitleConfigWin").height()/2 + "px");

				if(frameTitleConfigView){
					frameTitleConfigView.resizePanels();
				}
			}
			/** 弹出提示框 */
			function showTipMessage(msg) {
				$.messager.show({
					title:'信息提示',
					msg:msg,
					timeout:10000,
					showType:'slide',
					width: document.body.clientWidth,
					width:400,
					height:280,
					right:0
				});
			}
		</script>
	</head>
	<body ><!-- onSelectStart=return(event.srcElement.type=="text") -->
		<div id="top" >
			<div id="topView">
			<script type="text/template" id="top_template">			
			<div id="logo">
				<div id="control" class="control_p"></div>
                <div id="cdt_logo"><img src="<%=request.getContextPath() %>/images/top/<%=style%>/CDT_LOGO.png"/></div>
			</div>
			<div class="top-text">{{sysName}}</div>
            <div id="setting">
                 <div id="userIcon"><!--<img src="<%=request.getContextPath() %>/images/top/Avatar-24px.png"  />--></div> 
                 <div id="userSetting"><p>{{userName}}</p></div>      
			</div>
            <div id="message" class="message_def"></div>
			
			<div tabindex="0" hidefocus="true" id="set_list_div">
				<ul id="set_list">
					<li id="username" class="user">个人信息</li>
					<li id="save" class="set_list_n">保存</li>
					<li id="share" class="set_list_n">分享</li>
					<li id="logout" class="set_list_n">注销</li>
				</ul>
			</div>
			</script>			
			</div>
			<div id="div_table_label" style="display: none;">
			<script type="text/template" id="label_template">
			<table id="table_label" class="table_label" cellpadding="0" cellspacing="0">
				<tr >
					<td>
						<div id="label_turn_up" class="turn_up_d"></div>			
					</td>
					<td>
						<div id="label_turn_down" class="turn_down_d"></div>
					</td>
					<td>
						<div id="add_page" class="add_page" title="新建标签页"></div>
					</td>
				</tr>
			</table>
			</script>
			</div>
		</div>
		<div id="body">
			<div id="operate" display="block">
			<div class="operate_title_bg" style="display:none;">
				<div id="operate_title" class="operate_switch_left">
				<script type="text/template" id="operate_title_template">
					<div id="solutions" ><p>解决方案</p></div>
					<div id="components"><p>构件</p></div>
				</script>
				</div>
			</div>
			<div id="component_operate">
			<script type="text/template" id="component_operate_template">
				<div id="components_groups">
				</div>
			</script>	
			</div>
			
			<div id="solution_operate">
				<script type="text/template" id="solution_operate_template">
					<div id="solutions_operate_title" class="solutions_operate_title" onselectstart="javascript:return false;">
						<div id="solutions_return" class="solutions_return_n" title="返回"></div>
						<div id="solutions_operate_title_name"><span></span></div>
						<div id="solutions_add" class="solutions_add" title="点击新建"></div>
					</div>
					<div id="solutions_groups">
					</div>
				</script>
				</div>
			</div>
			<img class="page-shadow" src="<%=request.getContextPath()%>/images/common/page-shadow.png">
			<div id="working">
				<!-- <div id="texture"></div> -->
			</div>
		</div>
		<div id="loading">
		</div>
		<div id="confirmView" style="display: none;">
			<script type="text/template" id="confirm_template">
				<div id="blackboard" class="blackboard-css"></div>
				<div id="comfirmbox" class="confirmbox-css">
					<div style="width:100%; height:100%">
						<h4>提示</h4>
						<div class="cut-off"></div>
						<div class="font-info-div">
							<div class="font-info" style="color: #4D4D4D; padding-top: 24px; font-weight:bold;">删除选中项?</div>
							<div id="comfirmbox_content" class="font-info" style="padding-top: 11px;"></div>
						</div>
						<div style="text-align: right; padding-right: 20px;">
							<input class="confirmButtonY_n" id="deleteBtn" type="button" value="删除"
								onfocus='this.blur();'>
							<!-- <input class="confirmButtonN_n" id="resetBtn" type="reset"
								value="取消" onfocus='this.blur();'> -->
							<font id="resetBtn" class="font-gray font-blue" style="padding-left: 5px; cursor: pointer;"><a>取消</a></font>
						</div>
					</div>
					<div id="confirm_close" class="confirm_close_n"></div>
				</div>
			</script>
		</div>
		<div id="newWinView" style="display: none;">
			<script type="text/template" id="newWin_template">
				<div id="blackboardW" class="blackboard-css"></div>
				<div id="newWin" class="newWin-css">
					<div style="width:100%; height:100%">
						<h4>请选择新增类型</h4>
						<div class="cut-off"></div>
						<div class="newWinChoose">
							<input class="solutionBtn_n" id="solutionsBtn" type="button" value="解决方案组"
								onfocus='this.blur();'>
							<input class="solutionBtn_n" id="solutionBtn" type="reset"
								value="解决方案" onfocus='this.blur();' style="margin-left: 44px">
						</div>
					</div>
					<div id="newWin_close" class="confirm_close_n"></div>
				</div>
			</script>
		</div>
		<div id="frameTitleConfig" style="display: none;">
			<script type="text/template" id="frameTitleConfig_template">
				<div id="blackboardW" class="blackboard-css"></div>
				<div id="frameTitleConfigWin" class="newWin-css">
					<div style="width:100%; height:100%">
						<h4>标题栏配置</h4>
						<div class="cut-off"></div>
						<div class="frameTitleConfigContent">
							<table style="padding:10px;width:100%;text-align:center;line-height:30px;">
								<tr style="line-height:12px;color:red;font-size:10px;overflow:hidden;">
									<td colspan="2"><span id="frameTitleConfig_warning"></span>&nbsp;</td>
								</tr>
								<tr>
									<td width="30%"><font style="font-size:12px;">标题栏背景颜色:</font></td>									
									<td width="70%"><input class="rename_text_n" id="titleBgColor" type="text" value="" 
										onpaste="return false"></td>
								</tr>
								<tr>
									<td><font style="font-size:12px;">标题栏文字大小:</font></td>									
									<td><input class="rename_text_n" id="titleFontSize" type="text" value="" 
										onpaste="return false"></td>
								</tr>
								<tr>
									<td><font style="font-size:12px;">构件x位置:</font></td>									
									<td><input class="rename_text_n" id="panelPositionX" type="text" value="" 
										onpaste="return false"></td>
								</tr>
								<tr>
									<td><font style="font-size:12px;">构件y位置:</font></td>									
									<td><input class="rename_text_n" id="panelPositionY" type="text" value="" 
										onpaste="return false"></td>
								</tr>
								<tr>
									<td><font style="font-size:12px;">构件宽度:</font></td>									
									<td><input class="rename_text_n" id="panelWidth" type="text" value="" 
										onpaste="return false"></td>
								</tr>
								<tr>
									<td><font style="font-size:12px;">构件高度:</font></td>									
									<td><input class="rename_text_n" id="panelHeight" type="text" value="" 
										onpaste="return false"></td>
								</tr>
								<tr style="line-height:40px;">
									<td colspan="2"><input class="confirmButtonY_n" id="frameTleConfigCancelBtn" type="button"
										value="取消" onfocus='this.blur();'>	
									    <input class="confirmButtonY_n" id="frameTleConfigSaveBtn" type="button"
										value="保存" onfocus='this.blur();' style="margin-left: 25%"></td>
								</tr>
							</table>
						</div>
					</div>
					<div id="frameTitleConfig_close" class="confirm_close_n"></div>
				</div>
			</script>
		</div>
		<div id="renameWinView" style="display: none;">
			<script type="text/template" id="renameWin_template">
				<div id="blackboardR" class="blackboard-css"></div>
				<div id="renameWin" class="renameWin-css">
					<div style="width:100%; height:100%">
						<h4></h4>
						<div class="cut-off"></div>
						<div class="renameWinContent">
							<table>
								<tr>
									<td><font style="font-size:12px;">名称:</font></td>									
									<td><input class="rename_text_n" id="renameText" type="text" value="" 
										onkeypress='return ValidateSpecialCharacter();' onpaste="return false"></td>
									<td><input class="confirmButtonY_n" id="renameSaveBtn" type="button"
										value="保存" onfocus='this.blur();' style="margin-left: 20px"></td>
								</tr>
							</table>
						</div>
					<div class="rename_warning" style="position:absolute;top:40px;left:10px;color:red;display:none;font-size:12px"></div>
					</div>
					<div id="renameWin_close" class="confirm_close_n"></div>
				</div>
			</script>
		</div>
		<div id="solutionEditWinView" style="display: none;">
			<script type="text/template" id="solutionEditWin_template">
				<div class="blackboard-css"></div>
				<div id="solutionEditWin" class="renameWin-css">
					<div style="width:100%; height:100%">
						<h4></h4>
						<div class="cut-off"></div>
						<div class="font-info-div">
							<table style=padding-top:15px; padding-left:15px;" cellpadding="0" cellspacing="10">
								<tr>
									<td><font style="font-size:12px;">名称：</font></td>									
									<td><input class="rename_text_n" id="renameSolutionText" type="text" value="" 
										onkeypress='return ValidateSpecialCharacter();' onpaste="return false"></td>
								</tr>
								<tr>
									<td title="输入URL后该解决方案没有页签,直接载入URL"><font style="font-size:12px;">URL：</font></td>									
									<td><input class="rename_text_n" id="renameUrlText" type="text" value=""></td>
								</tr>
								<tr>
									<td><font style="font-size:12px;">标题栏：</font></td>		
									<td>
										<font style="font-size:12px;"><input class="" id="isShowTitle" type="checkbox" checked>是否显示</font>
									</td>
								</tr>
								<tr id="solutionEditTr" style="display:none;">
									<td title="选择解决方案所属的解决方案组，不选择为根目录"><font style="font-size:12px;">位置：</font></td>									
									<td style="padding-left:5px;"><select id="solutionGroupSelect" editable="false">
										</select></td>
								</tr>
							</table>
						</div>
						<div style="text-align: right; padding-right: 20px;">
							<input class="confirmButtonY_n" id="renameSaveBtn" type="button"
									value="保存" onfocus='this.blur();' style="margin-left: 20px">
						</div>
					<div class="solutionEdit_warning" style="position:absolute;top:40px;left:10px;color:red;display:none;font-size:12px"></div>
					</div>
					<div id="solutionEditWin_close" class="confirm_close_n"></div>
				</div>
			</script>
		</div>
		<div id="shareWinView" style="display: none;">
			<script type="text/template" id="shareWin_template">
				<div id="blackboardR" class="blackboard-css"></div>
				<div id="shareWin" class="shareWin-css">
					<div style="width:100%; height:100%">
						<h4>分享</h4>
						<div class="cut-off"></div>
						<div class="shareWinContent">
						<div class="shareUserTree"><!-- 用户列表 -->
							<ul id="share_users" class="easyui-tree tree">
							</ul>
						</div>
						<div id="shareWinContentBlank" class="shareWinContent" style="position: absolute; display: none;">
						</div>
						</div>
						<div class="buttonArea">
							<span class="tree-checkbox tree-checkbox0" id="selectAllUser"/><span class="tree-title selectAllSpan">所有用户</span>
							<input class="button_n" id="shareBtn" type="button" value="分享" onfocus='this.blur();'/>
						</div>
					</div>
					<div id="shareWin_close" class="confirm_close_n"></div>
				</div>
			</script>
		</div>
		<div id="settingLabelWinView" style="display: none;">
			<script type="text/template" id="labelSettingWin_template">
				<div id="settingBlackboard" class="blackboard-css"></div>
				<div id="labelSettingView" class="labelSetting-css">
					<div style="width:100%; height:100%">
						<h4>设置</h4>
						<div class="cut-off"></div>
						<div class="font-info-div">
							<table style="padding-top:15px; padding-left:10px;" cellpadding="0" cellspacing="10">
										<tr><td class="labelSetting-td">切换工作区：</td><td class="labelSetting-td">
										<input  name="chageTabType" id="chageTabTypeOn" type="radio" onfocus='this.blur();' value="1"/>是
										<input  name="chageTabType" id="chageTabTypeOff" type="radio" onfocus='this.blur();' value="0"/>否
										</td></tr>
										<tr><td class="labelSetting-td">传递的参数：</td>
										<td><input class="input_text_n" id="paramValue" type="text" value="" >
										</td></tr>
							</table>
						</div>
						<div style="text-align: right; padding-right: 20px;">
							<input class="confirmButtonY_n" id="settingConfirmBtn" type="button" value="确定"
								onfocus='this.blur();'>
							<input class="confirmButtonN_n" id="resetBtn" type="reset"
								value="取消" onfocus='this.blur();'>
						</div>
					</div>
					<div id="settingConfirm_close" class="confirm_close_n"></div>
				</div>
			</script>
		</div>
	<!-- 用户和组织详细信息对话框和编辑详细信息对话框-->
	<div id = "userView" style="display: none;">
		<script type="text/template" id="user_template">
		<div class="blackboard-css"></div>
		<!-- 用户详细信息 -->
		<div id="userBox" class="userBox-css">
			<h4>详细信息</h4>
			<div class="cut-off"></div>
			<div class="userBox_content">
				<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-top:10px; font-size: 12px;">					
					<tr><td id="name_content_title" class="user_title">姓名：</td><td class="user_content" id="name_content"></td></tr>
					<tr><td class="user_title">电子邮箱：</td><td class="user_content" id="emai_content"></td></tr>
					<tr><td class="user_title">电话：</td><td class="user_content" id="phone_content"></td></tr>
					<tr><td class="user_title">手机：</td><td class="user_content" id="mobilePhone_content"></td></tr>
					<tr><td class="user_title">地址：</td><td class="user_content" id="address_content"></td></tr>
				</table>
				<div class="edit_userBtn_div">
					<input id="edit_userBtn" class="saveBtn_n" type="button" value="编辑" onfocus='this.blur();'>
					<input id="changePassword_userBtn" class="saveBtn_n" type="button" value="修改密码" onfocus='this.blur();'>
				</div>
			</div>
			<div id="user_close" class="confirm_close_n"></div>
		</div>
		<!-- 编辑用户详细信息 -->
		<div id="edit_userBox" class="edit_userBox-css">
			<h4>详细信息</h4>
			<div class="cut-off"></div>
			<div class="edit_userBox_content"> 
				<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-bottom:0px;font-size: 12px;">					
					<tr><td><div id="name_input_title" class="user_input_title">用户姓名：</div></td></tr>					
					<tr><td><input id="name_input" class="textInput_n" type="text" value="" onkeypress='return ValidateSpecialCharacter();' onpaste="return false" maxLength="32"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="editName_input_tip"></span></td></tr>
					<tr><td><div class="user_input_title">电子邮箱：</div></td></tr>
					<tr><td><input id="emai_input" class="textInput_n" type="text" value="" maxLength="64"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="editEmail_input_tip"></span></td></tr>
					<tr><td><div class="user_input_title">电话：</div></td></tr>
					<tr><td><input id="phone_input" class="textInput_n" type="text" value=""></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="editPhone_input_tip"></span></td></tr>
					<tr><td><div class="user_input_title">手机：</div></td></tr>
					<tr><td><input id="mobilePhone_input" class="textInput_n" type="text" value="" maxLength="11"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="editMobilePhone_input_tip"></span></td></tr>
					<tr><td><div class="user_input_title">地址：</div></td></tr>
					<tr><td><input id="address_input" class="textInput_n" type="text" value="" maxLength="64" onkeypress='return ValidateSpecialCharacter();' onpaste="return false"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="editAddress_input_tip"></span></td></tr>
				</table>
				<div style="margin: 20px;margin-top: 20px;cursor: default;float: left;">
					<input id="userSaveBtn" class="saveBtn_n" type="button" value="保存" onfocus='this.blur();'>
					<input id="userCancelBtn" class="cancelBtn_n" type="button" value="取消" onfocus='this.blur();'>
				</div>
			</div>
			<div id="edit_user_close" class="confirm_close_n"></div>
		</div>
		<div id="changePassword_userBox" class="changePassword_userBox-css">
			<h4>修改密码</h4>
			<div class="cut-off"></div>
			<div class="changePassword_userBox_content"> 
				<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-bottom:0px;font-size: 12px;">					
					<tr><td><div class="user_input_title">新密码：</div></td></tr>					
					<tr><td><input id="newPwd_input" class="textInput_n" type="password" value="" maxLength="16"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="newPwd_input_tip"></span></td></tr>
					<tr><td><div class="user_input_title">确认新密码：</div></td></tr>
					<tr><td><input id="confirmPwd_input" class="textInput_n" type="password" value="" maxLength="16"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="confirmPwd_input_tip"></span></td></tr>
				</table>
				<div style="margin: 20px;margin-top: 20px;cursor: default;float: left;">
					<input id="changePasswordSaveBtn" class="saveBtn_n" type="button" value="保存" onfocus='this.blur();'>
					<input id="changePasswordCancelBtn" class="cancelBtn_n" type="button" value="取消" onfocus='this.blur();'>
				</div>
			</div>
			<div id="changePassword_user_close" class="confirm_close_n"></div>
		</div>
		</script>
	</div>
	<div id="menuBox" style="display: none;">
    	<table id="warning_table">
        </table>
    </div>
	</body>
</html>
