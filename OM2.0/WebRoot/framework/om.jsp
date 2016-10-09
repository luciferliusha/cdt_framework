<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>OM</title>
    
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<script type="text/javascript" src="<%=path %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/underscore/underscore-min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/backbone/backbone-min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/jquery.easyui.min.js"></script>
	
	<link href="<%=path %>/css/om.css" rel="stylesheet" type="text/css" />
	<link href="<%=path %>/css/DialogView.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" href="<%=path %>/js/libs/easyui/themes/default/easyui.css" type="text/css">
	<link rel="stylesheet" href="<%=path %>/js/libs/easyui/themes/icon.css" type="text/css">
	<script type="text/javascript" src="<%=path %>/js/common/json2.js"></script>
	<script type="text/javascript" src="<%=path %>/js/global/httptools.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/util.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/doSave.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/name_limit.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/containSpecial.js"></script>

	<!-- backbone.js -->
	<script type="text/javascript" src="<%=path %>/js/om/model/omModel.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/collection/omCollection.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/view/omTopView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/view/organizationView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/view/roleView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/view/resourceView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/view/DialogView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/init/initOm.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/init/initOrganization.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/init/initRole.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/init/initDialogView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/init/initResource.js"></script>
	<script type="text/javascript" src="<%=path %>/js/om/init/initOmTopView.js"></script>
	<script type="text/javascript">
		var contextPath = "<%=path %>";
		var selectedId = '<%=request.getParameter("selectedId")%>';//默认选中的平台解决方案
		var userName = '<%=request.getAttribute("userName")%>';
		var clientHeight = document.documentElement.clientHeight;
		var clientWidth = document.documentElement.clientWidth;
		$(function(){
			resize();
		});
		window.onresize = function(){
			resize();
		};
		//调整宽和高
		function resize(){
			clientHeight = document.documentElement.clientHeight;
			clientWidth = document.documentElement.clientWidth;
			$("#working-bg").height(clientHeight - $("#top").height() + "px");
			$("#working-bg").width(clientWidth - $("#organization_operate").width());
//			$("#organization_groups").height(clientHeight - $("#top").height() - $(".operate_title_bg").height() - $(".organization_groups_title").height() + "px");
			$("#resource_operate").height(clientHeight - $("#searchView").height() - $("#resultView").height() - 15 - 10 + "px");
			$("#resource_operate").width(clientWidth - $("#organization_operate").width() - $("#role_operate").width() - $(".page-shadow").width() - 60 + "px");
			$("#organization_operate").height(clientHeight - $("#searchView").height() - $("#resultView").height() - $(".horizontal_shadow").height() - 10);
			$("#role_operate").height(clientHeight - $("#searchView").height() - $("#resultView").height() - $(".horizontal_shadow").height() - 20);//20是自身的padding
			$("#loadingOrganization").css("left",$("#organization_operate").width()/2-$("#loadingOrganization").width()/2);
			$("#loadingRole").css("left",$("#organization_operate").width()+$("#role_operate").width()/2-$("#loadingRole").width()/2);
			$("#loadingResource").css("left",$("#organization_operate").width()+$("#role_operate").width()+$("#resource_operate").width()/2-$("#loadingResource").width()/2);
		}
	</script>
  </head>
  
  <body onSelectStart=return(event.srcElement.type=="text")>
    <ul id="searchRecord">
    </ul>
  <div id="omTopView">
  <script type="text/template" id="omTopView_template">
  	<div id="searchView">
  		<div id="omsearch">
  			<div id="search_input_bg" class="search_input_bg_n">
  				<input id="search_input" type="text" value="按组织搜索" defaultValue="按组织搜索" onkeypress='return ValidateSpecialCharacter();' onpaste="return false">
  				<span ></span>
  			</div>
  			<div id="search_button" class="search_button_n"></div>
  			<div id="search_category" class="search_category_n">
  				<span id="search_category_span" class="search_category_font">组织</span>
  			</div>
  			<div id="search_category_menu">
  				<ul>
  					<li cid="0" class="menu_li_f" id="search_organization_item">组织</li>
  					<li cid="1" class="menu_li_n" id="search_role_item">角色</li>
  					<li cid="2" class="menu_li_n" id="search_resource_item">资源</li>
  				</ul>
  			</div>
  		</div>
  		<div id="omsave" class="omsave_n" btnDisable="true">
  			<span class="menu_span_n">保存更改</span>
  		</div>
  	</div>
  	<div id="resultView">
  		<div>
			<div id="organization_search_name_div" class="search_name">
				<div id="organization_search_name"><span>公司A-01</span></div>
				<div id="organization_search_close" class="search_close search_close_n"></div>
			</div>
  			<span class="organization_result_span">组织</span>
			<span class="organization_result_span_tip">没有搜索到组织和用户信息</span>
  		</div>
		<div>
			<div id="role_search_name_div" class="search_name">
				<div id="role_search_name"><span>公司A-01</span></div>
				<div id="role_search_close" class="search_close search_close_n"></div>
			</div>
  			<span class="role_result_span">角色</span>
			<span class="role_result_span_tip">没有搜索到角色信息</span>
  		</div>
		<div>
			<div id="resource_search_name_div" class="search_name">
				<div id="resource_search_name"><span>公司A-01</span></div>
				<div id="resource_search_close" class="search_close search_close_n"></div>
			</div>
  			<span class="resource_result_span">资源</span>
			<span class="resource_result_span_tip">没有搜索到资源信息</span>
  		</div>
  	</div>
  	<div class="horizontal_shadow"></div>
  </script>
  </div>

	<div id="body">
		<div id="organization_operate">
			<script type="text/template" id="organization_template">
				<div id="organization_groups">
					<ul id="organization_groups_ul" class="easyui-tree tree"></ul>
					<ul id="search_organization_groups_ul" class="easyui-tree tree" style="display:none;"></ul>
				</div>
			</script>
		</div>
		<div class="page-shadow"></div>
		<div id="working-bg">
			<div id="role_operate">
			<script type="text/template" id="role_template">
				<div id="role_groups">
					<ul id="role_groups_ul" class="easyui-tree tree"></ul>
				</div>
			</script>
			</div>
			<div id="resource_operate">
			<script type="text/template" id="resource_template">
				<div id="resource_groups">
					<ul id="resource_groups_ul" class="easyui-tree tree"></ul>
				</div>
			</script>
			</div>
		</div>
	</div>
	<!-- 正在加载... -->
	<div id="loadingOrganization" class="loading">正在加载...</div>
	<div id="loadingRole" class="loading">正在加载...</div>
	<div id="loadingResource" class="loading">正在加载...</div>

	<!-- 用户操作列表  -->
	<div id="user_menu" class="easyui-menu">
		<div onclick="updateOmNode('organization_groups_ul')" data-options="iconCls:'icon-rename-n'">重命名</div>
		<div onclick="relieveOmNode('organization_groups_ul')" data-options="iconCls:'icon-move-n'">移至</div>
		<div onclick="removeOmNode('organization_groups_ul','relieve')" data-options="iconCls:'icon-relieve-n'">解除关系</div>
		<div onclick="removeOmNode('organization_groups_ul','delete')" data-options="iconCls:'icon-trash-n'">删除</div>
		<div onclick="showMoreInformation('organization_groups_ul')">详细信息</div>
	</div>
	<!-- 组织操作列表  -->
	<div id="organization_menu" class="easyui-menu">
		<div onclick="appendOmNode('organization_groups_ul')" data-options="iconCls:'icon-add-n'">新增</div>
		<div onclick="updateOmNode('organization_groups_ul')" data-options="iconCls:'icon-rename-n'">重命名</div>
		<div onClick="containOmNode('organization_groups_ul')" data-options="iconCls:'icon-contain-n'">添加用户</div>
		<div onclick="removeOmNode('organization_groups_ul','delete')" data-options="iconCls:'icon-trash-n'">删除</div>
		<div onclick="showMoreInformation('organization_groups_ul')">详细信息</div>
	</div>
	<!-- 搜索用户操作列表  -->
	<div id="search_user_menu" class="easyui-menu">
		<div onclick="updateOmNode('search_organization_groups_ul')" data-options="iconCls:'icon-rename-n'">重命名</div>
		<div onclick="relieveOmNode('search_organization_groups_ul')" data-options="iconCls:'icon-move-n'">移至</div>
		<div onclick="removeOmNode('search_organization_groups_ul','relieve')" data-options="iconCls:'icon-relieve-n'">解除关系</div>
		<div onclick="removeOmNode('search_organization_groups_ul','delete')" data-options="iconCls:'icon-trash-n'">删除</div>
		<div onclick="showMoreInformation('search_organization_groups_ul')">详细信息</div>
	</div>
	<!-- 搜索组织操作列表  -->
	<div id="search_organization_menu" class="easyui-menu">
		<div onclick="appendOmNode('search_organization_groups_ul')" data-options="iconCls:'icon-add-n'">新增</div>
		<div onclick="updateOmNode('search_organization_groups_ul')" data-options="iconCls:'icon-rename-n'">重命名</div>
		<div onClick="containOmNode('search_organization_groups_ul')" data-options="iconCls:'icon-contain-n'">添加用户</div>
		<div onclick="removeOmNode('search_organization_groups_ul','delete')" data-options="iconCls:'icon-trash-n'">删除</div>
		<div onclick="showMoreInformation('search_organization_groups_ul')">详细信息</div>
	</div>
	<!-- 角色操作列表  -->
	<div id="role_menu" class="easyui-menu">
		<div onclick="appendOmNode('role_groups_ul')" data-options="iconCls:'icon-add-n'">新增</div>
		<div onclick="updateOmNode('role_groups_ul')" data-options="iconCls:'icon-rename-n'">重命名</div>
		<!-- <div onclick="moveOmNode('role_groups_ul')" data-options="iconCls:'icon-move-n'">移至</div>-->
		<div onclick="removeOmNode('role_groups_ul')" data-options="iconCls:'icon-trash-n'">删除</div>
	</div>
	<!-- 资源操作列表  -->
	<div id="resource_menu" class="easyui-menu">
		<div onclick="appendOmNode('resource_groups_ul')" data-options="iconCls:'icon-add-n'">新增</div>
		<div onclick="updateOmNode('resource_groups_ul')" data-options="iconCls:'icon-rename-n'">重命名</div>
		<!-- <div onclick="moveOmNode('resource_groups_ul')" data-options="iconCls:'icon-move-n'">移至</div>-->
		<div onclick="removeOmNode('resource_groups_ul')" data-options="iconCls:'icon-trash-n'">删除</div>
	</div>
	
	<!-- 新增组织或用户 -->
	<div id="newWinView" style="display: none;">
	<script type="text/template" id="newWin_template">
		<div class="blackboard-css"></div>
		<div id="newWin" class="newWin-css" style="display: none;">
			<div style="width:100%; height:100%">
				<h4>新增</h4>
				<div class="cut-off"></div>
				<div class="newWinChoose">
					<input class="organizationBtn_n" id="organizationBtn" type="button" value="组织"
						onfocus='this.blur();'>
					<input class="organizationBtn_n" id="userBtn" type="reset"
						value="用户" onfocus='this.blur();' style="margin-left: 44px">
				</div>
			</div>
			<div id="newWin_close" class="confirm_close_n"></div>
		</div>
		<!-- 新增简单组织信息 -->
		<div id="new_simple_organization" class="renameWin-css" style="display:none;">
			<h4>新增组织</h4>
			<div class="cut-off"></div>
			<div class="renameWinContent">
				<div class="renameWinContent_title">组织名称：</div>
				<table  cellpadding="0" cellspacing="0">
					<tr>
						<td><input class="textInput_n" id="new_simple_organization_name_input" defaultValue="新增组织" type="text"
							value="" onkeypress='return ValidateSpecialCharacter();' onpaste="return false" maxLength="32"></td>
					</tr>
					<tr style="height:26px;">
						<td><span class="error_tip" id="new_simple_organization_error_tip"></span></td>
					</tr>
					<tr>
						<td>
							<input class="confirmBtn_n" id="new_simple_organization_confirmBtn" type="button" value="确认" onfocus='this.blur();'>
							<input class="cancelBtn_n" id="new_simple_organization_cancelBtn" type="button" value="取消" onfocus='this.blur();'>
							<input class="addMoreBtn_n" id="new_simple_organization_addMoreBtn" type="button" value="添加更多详细信息" onfocus='this.blur();'>
						</td>
					</tr>
				</table>
			</div>
			<div id="new_simple_organization_close" class="confirm_close_n"></div>
		</div>
		<!-- 新增详细的组织信息-->
		<div id="new_organization" class="newOrganization-css" style="display: none;">
			<h4>新增组织</h4>
			<div class="cut-off"></div>
			<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-bottom: 0;font-size: 12px;">					
				<tr><td><div class="addInformation_input_title">组织名称：</div></td></tr>
				<tr><td><input id="addOrganizationName_input" class="textInput_n" id="" type="text" defaultValue="新增组织"
					value="" onkeypress='return ValidateSpecialCharacter();' onpaste="return false" maxLength="32"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addOrganizationName_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">电子邮箱：</div></td></tr>
				<tr><td><input id="addOrganizationEmail_input" class="textInput_n" type="text" defaultValue="电子邮箱" value="" maxLength="25"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addOrganizationEmail_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">电话：</div></td></tr>
				<tr><td><input id="addOrganizationPhone_input" class="textInput_n" type="text" defaultValue="电话" value=""></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addOrganizationPhone_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">手机：</div></td></tr>
				<tr><td><input id="addOrganizationMobilePhone_input" class="textInput_n" type="text" defaultValue="手机" value="" maxLength="11"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addOrganizationMobilePhone_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">地址：</div></td></tr>
				<tr><td><input id="addOrganizationAddress_input" class="textInput_n" type="text" defaultValue="地址" value=""
					maxLength="64" onkeypress='return ValidateSpecialCharacter();' onpaste="return false"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addOrganizationAddress_input_tip"></span></td></tr>
			</table>
			<div style="margin: 20px;margin-top: 0;cursor: default;float: left;">
					<input id="new_organization_confirmBtn" class="confirmBtn_n" type="button" value="确认" onfocus='this.blur();'>
					<input id="new_organization_cancelBtn" class="cancelBtn_n" type="button" value="取消" onfocus='this.blur();'>
			</div>
			<div id="new_organization_close" class="confirm_close_n"></div>
		</div>
		<!--新增简单的用户信息 -->
		<div id="new_simple_user" class="new_simple_user-css">
			<h4>新增用户</h4>
			<div class="cut-off"></div>
			<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-bottom: 0;font-size: 12px;">
				<tr><td><div class="addInformation_input_title">电子邮箱：</div></td></tr>
				<tr><td><input id="addSimpleUserEmail_input" class="textInput_n" type="text" defaultValue="电子邮箱" value="" maxLength="25"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addSimpleUserEmail_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">密码：</div></td></tr>
				<tr><td><input id="addSimpleUserPassword_input" class="textInput_n" type="text" defaultValue="密码" value="" maxlength="16"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addSimpleUserPassword_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">用户姓名：</div></td></tr>
				<tr><td><input id="addSimpleUsername_input" class="textInput_n" type="text" defaultValue="姓名" maxLength="32"
					value="" onkeypress='return ValidateSpecialCharacter();' onpaste="return false"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addSimpleUsername_input_tip"></span></td></tr>
			</table>
			<div style="margin: 20px;margin-top: 0;cursor: default;float: left;">
				<input id="new_simple_user_confirmBtn" class="confirmBtn_n" type="button" value="确认" onfocus='this.blur();'>
				<input id="new_simple_user_cancelBtn" class="cancelBtn_n" type="button" value="取消" onfocus='this.blur();'>
				<input class="addMoreBtn_n" id="new_simple_user_addMoreBtn" type="button" value="添加更多详细信息" onfocus='this.blur();'>
			</div>
			<div id="new_simple_user_close" class="confirm_close_n"></div>
		</div>
		<!-- 新增详细的用户信息 -->
		<div id="new_user" class="new_user-css">
			<h4>新增用户</h4>
			<div class="cut-off"></div>
			<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-bottom: 0;font-size: 12px;">
				<tr><td><div class="addInformation_input_title">电子邮箱：</div></td></tr>
				<tr><td><input id="addUserEmail_input" class="textInput_n" type="text" defaultValue="电子邮箱" value="" maxLength="25"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addUserEmail_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">密码：</div></td></tr>
				<tr><td><input id="addUserPassword_input" class="textInput_n" type="text" defaultValue="密码" value="" maxLength="16"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addUserPassword_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">用户姓名：</div></td></tr>
				<tr><td><input id="addUsername_input" class="textInput_n" type="text" defaultValue="姓名" maxLength="32"
					value="" onkeypress='return ValidateSpecialCharacter();' onpaste="return false"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addUsername_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">电话：</div></td></tr>
				<tr><td><input id="addUserPhone_input" class="textInput_n" type="text" defaultValue="电话" value=""></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addUserPhone_input_tip"></span></td></tr>				
				<tr><td><div class="addInformation_input_title">手机：</div></td></tr>
				<tr><td><input id="addUserMobilePhone_input" class="textInput_n" type="text" defaultValue="手机" value="" maxLength="11"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addUserMobilePhone_input_tip"></span></td></tr>
				<tr><td><div class="addInformation_input_title">地址：</div></td></tr>
				<tr><td><input id="addUserAddress_input" class="textInput_n" type="text" defaultValue="地址" value=""
					maxLength="64" onkeypress='return ValidateSpecialCharacter();' onpaste="return false"></td></tr>
				<tr style="height:20px;"><td><span class="error_tip" id="addUserAddress_input_tip"></span></td></tr>				
			</table>
			<div style="margin: 20px;margin-top: 0;cursor: default;float: left;">
				<input id="new_user_confirmBtn" class="confirmBtn_n" type="button" value="确认" onfocus='this.blur();'>
				<input id="new_user_cancelBtn" class="cancelBtn_n" type="button" value="取消" onfocus='this.blur();'>
			</div>
			<div id="new_user_close" class="confirm_close_n"></div>
		</div>
	</script>
	</div>
	<!-- 重命名对话框 -->
	<div id="renameWinView" style="display: none;">
	<script type="text/template" id="renameWin_template">
		<div class="blackboard-css"></div>
		<div id="renameWin" class="renameWin-css">
		<div style="width:100%; height:100%">
			<h4 style="background-color:#F2FAF8"></h4>
			<div class="cut-off"></div>
			<div class="renameWinContent">
			<div id="renameWinContent_title" class="renameWinContent_title"></div>
				<table  cellpadding="0" cellspacing="0">
					<tr>
						<td><input class="textInput_n" id="renameText" type="text" value="" onkeypress='return ValidateSpecialCharacter();' onpaste="return false" maxLength="32"></td>
					</tr>
					<tr style="height:26px;">
						<td><span class="error_tip" id="renameWinContent_error_tip"></span></td>
					</tr>
					<tr>
						<td>
							<input class="confirmBtn_n" id="renameSaveBtn" type="button" value="确认" onfocus='this.blur();'>
							<input class="cancelBtn_n" id="renameSaveCancelBtn" type="button" value="取消" onfocus='this.blur();'>
						</td>
					</tr>
				</table>	
			</div>
			<div id="renameWin_close" class="confirm_close_n"></div>
		</div>
	</script>
	</div>
	<!-- 新增资源对话框 -->
	<div id="newResourceView" style="display: none;">
	<script type="text/template" id="newResource_template">
		<div class="blackboard-css"></div>
		<div id="newResource" class="newResource-css">
			<h4>新增资源</h4>
			<div class="cut-off"></div>
			<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-bottom:0px;font-size: 12px;">					
				<tr><td><div class="moreInformation_input_title">资源名称：</div></td></tr>					
				<tr><td><input id="resource_name_input" class="textInput_n" type="text" value="资源名称" defaultValue="资源名称" onkeypress='return ValidateSpecialCharacter();' onpaste="return false" maxLength="32"></td></tr>
				<tr style="height:16px;"><td><span class="error_tip" id="resource_name_input_tip"></span></td></tr>
				<tr><td><div class="moreInformation_input_title">资源编号：</div></td></tr>
				<tr><td><input id="resource_number_input" class="textInput_n" type="text" value="资源编号" defaultValue="资源编号" maxLength="64"></td></tr>
				<tr style="height:16px;"><td><span class="error_tip" id="resource_number_input_tip"></span></td></tr>
			</table>
			<div style="margin: 20px;margin-top: 10px;cursor: default;float: left;">
				<input id="newResourceConfirmBtn" class="confirmBtn_n" type="button" value="确定" onfocus='this.blur();'>
				<input id="newResourceCancelBtn" class="cancelBtn_n" type="button" value="取消" onfocus='this.blur();'>
			</div>
			<div id="newResource_close" class="confirm_close_n"></div>
		</div>
	</script>
	</div>
	
	<!-- 确认删除对话框 -->
	<div id="confirmView" style="display:none;">
	    <script type="text/template" id="confirm_template">
		<div class="blackboard-css"></div>
		<div id="comfirmbox" class="confirmbox-css">
			<div style="width:100%; height:100%">
				<h4 class="comfirmbox_title" style="letter-spacing: 1px;">删除</h4>
				<div class="cut-off"></div>
				<div class="font-info-div">
					<div class="font-info" style="color: #4D4D4D; padding-top: 20px; font-weight:bold;cursor:default;letter-spacing: 1px;">删除选中项?</div>
					<div id="comfirmbox_content" class="font-info" style="padding-top: 11px;cursor:default;"></div>
				</div>
				<div style="padding-left: 20px;">
					<input class="confirmBtn_n" id="deleteBtn" type="button" value="删除"
						onfocus='this.blur();'>
					<input class="cancelBtn_n" id="resetBtn" type="reset"
						value="取消" onfocus='this.blur();'>
				</div>
			</div>
			<div id="delete_confirm_close" class="confirm_close_n"></div>
		</div>
	    </script>
	</div>
	<!-- 移至对话框 -->	
	<div id="relieveView" style="display: none;">
	 <script type="text/template" id="relieve_template">
		<div class="blackboard-css"></div>
		<div id="relieveBox" class="relieveBox-css">
			<h4>移至</h4>
			<div class="cut-off"></div>
			<div class="relieveBox_content">
				<ul id="relieve_organization_groups" class="easyui-tree tree">
				</ul>
				<ul id="include_user_groups" class="easyui-tree tree" style="display:none;">
				</ul>
			</div>
			<div id="selectAllUser_div">
				<span class="tree-checkbox tree-checkbox0" id="selectAllUser"/><span class="tree-title selectAllSpan">全选</span>
			</div>
			<div id="relieveBtn_div">
				<input id="relieveBtn" class="confirmBtn_n" type="button" value="移动" onfocus='this.blur();'>
				<input id="relieveCancelBtn" class="cancelBtn_n" type="button" value="取消" onfocus='this.blur();'>
			</div>
			<div id="userSelectOrganization_tip">用户至少归属到一个组织</div>
			<div id="relieve_close" class="confirm_close_n"></div>
		</div>
		</script>
	</div>
	<!-- 用户和组织详细信息对话框和编辑详细信息对话框-->
	<div id = "moreInformationView" style="display: none;">
		<script type="text/template" id="moreInformation_template">
		<div class="blackboard-css"></div>
		<!-- 用户组织详细信息 -->
		<div id="moreInformationBox" class="moreInformationBox-css">
			<h4>详细信息</h4>
			<div class="cut-off"></div>
			<div class="moreInformationBox_content">
				<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-top:10px; font-size: 12px;">					
					<tr><td id="name_content_title" class="moreInformation_title">姓名：</td><td class="moreInformation_content" id="name_content"></td></tr>
					<tr><td class="moreInformation_title">电子邮箱：</td><td class="moreInformation_content" id="emai_content"></td></tr>
					<tr><td class="moreInformation_title">电话：</td><td class="moreInformation_content" id="phone_content"></td></tr>
					<tr><td class="moreInformation_title">手机：</td><td class="moreInformation_content" id="mobilePhone_content"></td></tr>
					<tr><td class="moreInformation_title">地址：</td><td class="moreInformation_content" id="address_content"></td></tr>
				</table>
				<div class="edit_MoreInformationBtn_div">
					<input id="edit_MoreInformationBtn" class="saveBtn_n" type="button" value="编辑" onfocus='this.blur();'>
					<input id="changePassword_MoreInformationBtn" class="saveBtn_n" type="button" value="修改密码" onfocus='this.blur();'>
				</div>
				<div id="local_title" class="local">目前位于</div>
				<div class="organization_list">
					<ul id="organization_list_ul">
					</ul>
				</div>
			</div>
			<div id="moreInformation_close" class="confirm_close_n"></div>
		</div>
		<!-- 编辑用户详细信息 -->
		<div id="edit_moreInformationBox" class="edit_moreInformationBox-css">
			<h4>详细信息</h4>
			<div class="cut-off"></div>
			<div class="edit_moreInformationBox_content"> 
				<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-bottom:0px;font-size: 12px;">					
					<tr><td><div id="name_input_title" class="moreInformation_input_title">用户姓名：</div></td></tr>					
					<tr><td><input id="name_input" class="textInput_n" type="text" value="" onkeypress='return ValidateSpecialCharacter();' onpaste="return false" maxLength="32"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="editName_input_tip"></span></td></tr>
					<tr><td><div class="moreInformation_input_title">电子邮箱：</div></td></tr>
					<tr><td><input id="emai_input" class="textInput_n" type="text" value="" maxLength="64"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="editEmail_input_tip"></span></td></tr>
					<tr><td><div class="moreInformation_input_title">电话：</div></td></tr>
					<tr><td><input id="phone_input" class="textInput_n" type="text" value=""></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="editPhone_input_tip"></span></td></tr>
					<tr><td><div class="moreInformation_input_title">手机：</div></td></tr>
					<tr><td><input id="mobilePhone_input" class="textInput_n" type="text" value="" maxLength="11"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="editMobilePhone_input_tip"></span></td></tr>
					<tr><td><div class="moreInformation_input_title">地址：</div></td></tr>
					<tr><td><input id="address_input" class="textInput_n" type="text" value="" maxLength="64" onkeypress='return ValidateSpecialCharacter();' onpaste="return false"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="editAddress_input_tip"></span></td></tr>
				</table>
				<div style="margin: 20px;margin-top: 20px;cursor: default;float: left;">
					<input id="moreInformationSaveBtn" class="saveBtn_n" type="button" value="保存" onfocus='this.blur();'>
					<input id="moreInformationCancelBtn" class="cancelBtn_n" type="button" value="取消" onfocus='this.blur();'>
				</div>
			</div>
			<div id="edit_moreInformation_close" class="confirm_close_n"></div>
		</div>
		<div id="changePassword_moreInformationBox" class="changePassword_moreInformationBox-css">
			<h4>修改密码</h4>
			<div class="cut-off"></div>
			<div class="changePassword_moreInformationBox_content"> 
				<table cellpadding="0" cellspacing="0" style="margin: 20px;margin-bottom:0px;font-size: 12px;">					
					<tr><td><div class="moreInformation_input_title">新密码：</div></td></tr>					
					<tr><td><input id="newPwd_input" class="textInput_n" type="password" value="" maxLength="16"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="newPwd_input_tip"></span></td></tr>
					<tr><td><div class="moreInformation_input_title">确认新密码：</div></td></tr>
					<tr><td><input id="confirmPwd_input" class="textInput_n" type="password" value="" maxLength="16"></td></tr>
					<tr style="height:16px;"><td><span class="error_tip" id="confirmPwd_input_tip"></span></td></tr>
				</table>
				<div style="margin: 20px;margin-top: 20px;cursor: default;float: left;">
					<input id="changePasswordSaveBtn" class="saveBtn_n" type="button" value="保存" onfocus='this.blur();'>
					<input id="changePasswordCancelBtn" class="cancelBtn_n" type="button" value="取消" onfocus='this.blur();'>
				</div>
			</div>
			<div id="changePassword_moreInformation_close" class="confirm_close_n"></div>
		</div>
		</script>
	</div>
	<!-- 用户选择组织提示 -->
	<!--<div id="userSelectOrganization_tip"> 用户至少需要选择一个组织 </div>-->
  </body>
</html>
