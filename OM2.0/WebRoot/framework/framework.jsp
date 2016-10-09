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
	<link rel="stylesheet" href="<%=path %>/css/om-css.min.css" type="text/css" />
	<link rel="stylesheet" href="<%=path %>/js/libs/zTree/css/zTreeStyle/zTreeStyle.css" type="text/css">
 	<link rel="stylesheet" href="<%=path %>/js/libs/zTree/css/cds_zTreeStyle/zTreeStyle.css" type="text/css">
	<link rel="stylesheet" href="<%=path %>/js/libs/easyui/themes/default/easyui.css" type="text/css">
	<link rel="stylesheet" href="<%=path %>/js/libs/easyui/themes/icon.css" type="text/css">
	<script type="text/javascript" src="<%=path %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/riot/render.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/zTree/js/jquery.ztree.core-3.5.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/zTree/js/jquery.ztree.excheck-3.5.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/zTree/js/jquery.ztree.exedit-3.5.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="<%=path %>/js/compress/js/om-js.min.js"></script>
		
	<script type="text/javascript">
		var path = "<%=path %>";
		/** 调整宽和高 */
		var resizeTimer = null;
		var useUserName = false;//使用用户名替换邮箱标识,true替换
		
		$(function(){
			resize();
		});
		
		window.onresize=function() {
			if (resizeTimer) clearTimeout(resizeTimer);      
			resizeTimer = setTimeout(resize, 300);//IE下触发多次
		};
		
		function resize(){
			var clientHeight = document.documentElement.clientHeight;
			var clientWidth = document.documentElement.clientWidth;			
			var minWidth = parseInt($("body").css("min-width"));//body最小宽度
			var minHeight = parseInt($("body").css("min-height"));//body最小高度
			
			var bodyWidth;//body div宽度
			var bodyHeight;//body div高度
			
			if(clientHeight >= minHeight){
				bodyHeight = clientHeight - $("#searchView").height() - $("#resultView").height() - $(".horizontal_shadow").height();
			}
			else{
				bodyHeight = minHeight - $("#searchView").height() - $("#resultView").height() - $(".horizontal_shadow").height();			
			}
			if(clientWidth >= minWidth){
				bodyWidth = clientWidth;
			}
			else{
				bodyWidth = minWidth;
			}
			$("#body").height(bodyHeight);
			$(".page-shadow").height(bodyHeight-20);//20是自身的padding
			$("#organization_operate").height(bodyHeight - 10);//10是自身的padding
			$("#role_operate").height(bodyHeight - 20);//20是自身的padding
			$("#resource_operate").height(bodyHeight - 20);//20是自身的margin
			$("#resource_operate").width(bodyWidth - $("#organization_operate").width() - $("#role_operate").width() - 23);//20是资源框与右边的间距
		}
	</script>
	<!--选择新增组织或者用户窗口-->
	<script type="text/template" id="newChooseWin_template">
	  	<div id="newChooseWin" class="win_css">
	  		<h4 class="win_title">新增</h4>
	  		<div class="cut-off"></div>
	  		<div class="win_content">
	  			<div id="chooseNewOrganization" class="hugeButton_01 hugeButton_01_n">组织</div>
	  			<div id="chooseNewUser" class="hugeButton_01 hugeButton_01_n">用户</div>
	  		</div>
	  		<div class="win_close win_close_n"></div>
  		</div>
	</script>
	<!--重命名窗口-->
	<script type="text/template" id="renameWin_template">
		<div id="renameWin" class="win_css">
  			<h4 class="win_title">{win_title}</h4>
  			<div class="cut-off"></div>
			<div class="win_content">
  				<table cellspacing="0" cellpadding="0">
  					<tr><td><span class="win_input_title">{renameInput_title}</span></td></tr>
  					<tr><td><input id="renameInput" class="textInput textInput-n" type="text" value="{name}" defaultValue="{defaultValue}"
							 maxlength="32">
					</td></tr>
  					<tr class="error_tip_tr"><td><span id="renameInput_error_tip" class="input_error_tip"></span></td></tr>
  				</table>
  				<div id="renameSaveBtn" class="confirmBtn confirmBtn_n">确认</div>
  				<div id="renameCancelBtn" class="cancelBtn cancelBtn_n">取消</div>
			</div>
			<div class="win_close win_close_n"></div>
  		</div>
	</script>
	<!-- 新增资源窗口 -->
	<script type="text/template" id="newResourceWin_template">
		<div id="newResourceWin" class="win_css">
  			<h4 class="win_title">{win_title}</h4>
  			<div class="cut-off"></div>
  			<div class="win_content">
  				<table cellspacing="0" cellpadding="0">
  					<tr><td><span class="win_input_title">资源名称：</span></td></tr>
  					<tr><td><input id="resourceNameInput" class="textInput textInput-n" type="text" value="{name}" defaultValue="{nameDefaultValue}"
								 maxlength="32">
						</td></tr>
  					<tr class="error_tip_tr"><td><span id="resourceNameInput_error_tip" class="input_error_tip"></span></td></tr>
  					<tr><td><span class="win_input_title">资源编号：</span></td></tr>
  					<tr><td><input id="resourceNoInput" class="textInput textInput-n" type="text" value="{no}" defaultValue="{noDefaultValue}"
								maxlength="64">
						</td></tr>
  					<tr class="error_tip_tr"><td><span id="resourceNoInput_error_tip" class="input_error_tip"></span></td></tr>
  				</table>
  				<div id="newResourceSaveBtn" class="confirmBtn confirmBtn_n">确认</div>
  				<div id="newResourceCancelBtn" class="cancelBtn cancelBtn_n">取消</div>
  			</div>
			<div class="win_close win_close_n"></div>
  		</div>
	</script>
	<!-- 删除窗口 -->
	<script type="text/template" id="deleteWin_template">
		<div id="deleteWin" class="win_css">
  			<h4 class="win_title">{win_title}</h4>
  			<div class="cut-off"></div>
  			<div class="win_content">
	  			<div id="win_delte_title">删除选中项？</div>
	  			<div id="win_delte_content">{win_delte_content}<br/>删除后将无法撤销此操作！</div>
	  			<div id="deleteSaveBtn" class="confirmBtn confirmBtn_n">确认</div>
	  			<div id="deleteCancelBtn" class="cancelBtn cancelBtn_n">取消</div>
	  		</div>
  			<div class="win_close win_close_n"></div>
  		</div>
	</script>
	<!-- 新增简单组织信息窗口 -->
	<script type="text/template" id="newSimpleOrganizationWin_template">
	  	<div id="newSimpleOrganizationWin" class="win_css">
	  		<h4 class="win_title">新增组织</h4>
	  		<div class="cut-off"></div>
	  		<div class="win_content">
	  			<table cellspacing="0" cellpadding="0">
	  				<tr><td><span class="win_input_title">组织名称：</span></td></tr>
	  					<tr><td><input id="newSimpleOrganizationName" class="textInput textInput-n input_hint" type="text" value="组织名称" defaultValue="组织名称"
								 maxlength="32">
						</td></tr>
	  				<tr class="error_tip_tr"><td><span id="newSimpleOrganizationName_error_tip" class="input_error_tip"></span></td></tr>
	  			</table>
	  			<div id="newSimpleOrganizationSaveBtn" class="confirmBtn confirmBtn_n">确认</div>
	  			<div id="newSimpleOrganizationCancelBtn" class="cancelBtn cancelBtn_n">取消</div>
	  			<div id="newSimpleOrganizationAddMoreBtn" class="standardButton_04 standardButton_04_n">添加更多详细信息</div>
	  		</div>
			<div class="win_close win_close_n"></div>
  		</div>
	</script>
	<!-- 新增详细组织信息窗口 -->
	<script type="text/template" id="newDetailOrganizationWin_template">
		  <div id="newDetailOrganizationWin" class="win_css" >
	  		<h4 class="win_title">{win_title}</h4>
	  		<div class="cut-off"></div>
	  		<div class="win_content">
	  			<table cellspacing="0" cellpadding="0">
	  				<tr><td><span class="win_input_title">组织名称：</span></td></tr>
		  			<tr><td><input id="newDetailOrganizationName" class="textInput textInput-n {nameClass}" type="text" value="{name}" defaultValue="{nameDefaultValue}"
								 maxlength="32" validateType ="required">
						</td></tr>
		  			<tr class="error_tip_tr"><td><span id="newDetailOrganizationName_error_tip" class="input_error_tip"></span></td></tr>
		  			<tr><td><span class="win_input_title">电子邮箱：</span></td></tr>
		  			<tr><td><input id="newDetailOrganizationEmail" class="textInput textInput-n input_hint" type="text" value="{email}" defaultValue="{emailDefaultValue}"
								 maxlength="25" validateType ="email">
						</td></tr>
		  			<tr class="error_tip_tr"><td><span id="newDetailOrganizationEmail_error_tip" class="input_error_tip"></span></td></tr>	  			
		  			<tr><td><span class="win_input_title">电话：</span></td></tr>
		  			<tr><td><input id="newDetailOrganizationPhone" class="textInput textInput-n input_hint" type="text" value="{phone}" defaultValue="{phoneDefaultValue}"
								 maxlength="25" validateType ="phone">
						</td></tr>
		  			<tr class="error_tip_tr"><td><span id="newDetailOrganizationPhone_error_tip" class="input_error_tip"></span></td></tr>
		  			
		  			<tr><td><span class="win_input_title">手机：</span></td></tr>
		  			<tr><td><input id="newDetailOrganizationMobilePhone" class="textInput textInput-n input_hint" type="text" value="{mobilePhone}" defaultValue="{mobilePhoneDefaultValue}"
								 maxlength="11" validateType ="mobilePhone">
						</td></tr>
		  			<tr class="error_tip_tr"><td><span id="newDetailOrganizationMobilePhone_error_tip" class="input_error_tip"></span></td></tr>
		  			<tr><td><span class="win_input_title">地址：</span></td></tr>
		  			<tr><td><input id="newDetailOrganizationAddress" class="textInput textInput-n input_hint" type="text" value="{address}" defaultValue="{addressDefaultValue}"
								 maxlength="64">
						</td></tr>
		  			<tr class="error_tip_tr"></tr>
	  			</table>
	  			<div id="newDetailOrganizationSaveBtn" class="confirmBtn confirmBtn_n">确认</div>
		  		<div id="newDetailOrganizationCancelBtn" class="cancelBtn cancelBtn_n">取消</div>
	  		</div>
	  		<div class="win_close win_close_n"></div>
	  	</div>
	</script>
	<!-- 新增简单用户信息窗口 -->
	<script type="text/template" id="newSimpleUserWin_template">
		<div id="newSimpleUserWin" class="win_css">
	  		<h4 class="win_title">新增用户</h4>
		  	<div class="cut-off"></div>
		  	<div class="win_content">
		  		<table cellspacing="0" cellpadding="0">
					<tr><td><span class="win_input_title">{emailTitle}</span></td></tr>
			  		<tr><td><input id="newSimpleUserEmail" class="textInput textInput-n input_hint" type="text" value="{email}" defaultValue="{emailDefaultValue}"
								maxlength="25" validateType="email">
						</td></tr>
					<tr class="error_tip_tr"><td><span id="newSimpleUserEmail_error_tip" class="input_error_tip"></span></td></tr>
					<tr><td><span class="win_input_title">密码：</span></td></tr>
			  		<tr><td>
							<input id="newSimpleUserPasswordTip" class="textInput textInput-n input_hint" type="text" value="密码"
								title="可输入符号：!$%^&*.~_-@,">
							<input id="newSimpleUserPassword" class="textInput textInput-n" type="password" value=""
								maxlength="16" validateType="password" title="可输入符号：!$%^&*.~_-@,">
						</td></tr>
					<tr class="error_tip_tr"><td><span id="newSimpleUserPassword_error_tip" class="input_error_tip"></span></td></tr>
					
					<tr><td><span class="win_input_title">姓名：</span></td></tr>
			  		<tr><td><input id="newSimpleUserName" class="textInput textInput-n input_hint" type="text" value="姓名" defaultValue="姓名"
								 maxlength="32">
						</td></tr>
					<tr class="error_tip_tr"><td><span id="newSimpleUserName_error_tip" class="input_error_tip"></span></td></tr>
		  		</table>
		  		<div id="newSimpleUserSaveBtn" class="confirmBtn confirmBtn_n">确认</div>
			  	<div id="newSimpleUserCancelBtn" class="cancelBtn cancelBtn_n">取消</div>
			  	<div id="newSimpleUserAddMoreBtn" class="standardButton_04 standardButton_04_n">添加更多详细信息</div>
		  	</div>
	  		<div class="win_close win_close_n"></div>
	  	</div>
	</script>
	<!-- 新增详细用户信息窗口 -->
	<script type="text/template" id="newDetailUserWin_template">
		<div id="newDetailUserWin" class="win_css">
	  		<h4 class="win_title">{win_title}</h4>
		  	<div class="cut-off"></div>
			<div class="win_content">
				<table id="newDetailUserTable" cellspacing="0" cellpadding="0">
					<tr>
						<td class="user_td_title"><span>{emailTitle}:</span></td>
						<td><input id="newDetailUserEmail" class="textInput textInput-n {emailClass}" type="text" value="{email}" defaultValue="{emailDefaultValue}"
									maxlength="25" validateType="required,email"></td>
					</tr>
					<tr class="error_tip_tr"><td colspan="2"><span id="newDetailUserEmail_error_tip" class="input_error_tip"></span></td></tr>
					<tr class="newDetailUserPassword">
						<td class="user_td_title"><span>密码:</span></td>
						<td>
							<input id="newDetailUserPasswordTip" style="display:{passwordTipDisplay}" class="textInput textInput-n input_hint" type="text" value="密码"
								title="可输入符号：!$%^&*.~_-@,">
							<input id="newDetailUserPassword" style="display:{passwordDisplay};" class="textInput textInput-n" type="password" value="{password}"
									maxlength="16" validateType="required,password" title="可输入符号：!$%^&*.~_-@,"></td>
					</tr>
					<tr class="error_tip_tr newDetailUserPassword"><td colspan="2"><span id="newDetailUserPassword_error_tip" class="input_error_tip"></span></td></tr>				
					<tr>
						<td class="user_td_title"><span>姓名:</span></td>
						<td><input id="newDetailUserName" class="textInput textInput-n {nameClass}" type="text" value="{name}" defaultValue="{nameDefaultValue}"
									maxlength="32" validateType="required"></td>
					</tr>
					<tr class="error_tip_tr"><td colspan="2"><span id="newDetailUserName_error_tip" class="input_error_tip"></span></td></tr>	
					<tr>
						<td class="user_td_title"><span>电话:</span></td>
						<td><input id="newDetailUserPhone" class="textInput textInput-n input_hint" type="text" value="{phone}" defaultValue="{phoneDefaultValue}"
									 validateType="phone"></td>
					</tr>
					<tr class="error_tip_tr"><td colspan="2"><span id="newDetailUserPhone_error_tip" class="input_error_tip"></span></td></tr>
					<tr>
						<td class="user_td_title"><span>手机:</span></td>
						<td><input id="newDetailUserMobilePhone" class="textInput textInput-n input_hint" type="text" value="{mobilePhone}" defaultValue="{mobilePhoneDefaultValue}"
									 validateType="mobilePhone" maxlength="11"></td>
					</tr>
					<tr class="error_tip_tr"><td colspan="2"><span id="newDetailUserMobilePhone_error_tip" class="input_error_tip"></span></td></tr>
					<tr>
						<td class="user_td_title"><span>行政区划代码:</span></td>
						<td><input id="newDetailUserXzqhdm" class="textInput textInput-n input_hint" type="text" value="{xzqhdm}" defaultValue="{xzqhdmDefaultValue}"
									 maxlength="25"></td>
					</tr>
					<tr class="error_tip_tr"><td colspan="2"><span id="newDetailUserXzqhdm_error_tip" class="input_error_tip"></span></td></tr>
					<tr>
						<td class="user_td_title"><span>行政区划名称:</span></td>
						<td><input id="newDetailUserXzqhmc" class="textInput textInput-n input_hint" type="text" value="{xzqhmc}" defaultValue="{xzqhmcDefaultValue}"
									 maxlength="50"></td>
					</tr>
					<tr class="error_tip_tr" colspan="2"><td><span id="newDetailUserXzqhmc_error_tip" class="input_error_tip"></span></td></tr>
					<tr>
						<td class="user_td_title"><span>地址:</span></td>
						<td><input id="newDetailUserAddress" class="textInput textInput-n input_hint" type="text" value="{address}" defaultValue="{addressDefaultValue}"
									 maxlength="64"></td>
					</tr>
					<tr class="error_tip_tr" colspan="2"><td><span id="newDetailUserAddress_error_tip" class="input_error_tip"></span></td></tr>
				</table>
				<div id="newDetailUserSaveBtn" class="confirmBtn confirmBtn_n">确认</div>
				<div id="newDetailUserCancelBtn" class="cancelBtn cancelBtn_n">取消</div>
			</div>
			<div class="win_close win_close_n"></div>
  		</div>
	</script>
	<!-- 组织添加用户窗口 -->
	<script type="text/template" id="containUserWin_template">
		<div id="containUserWin" class="win_css">
	  		<h4 class="win_title">添加用户</h4>
	  		<div class="cut-off"></div>
			<div class="win_content">
				<div id="allUserZTreeDiv">
					<ul id="allUserZTree" class="ztree"></ul>
				</div>
				<div id="selectAllUserDiv">
					<span id="selectAllUser" class="checkbox checkbox_n"></span>
					<span id="selectAllUser_text">全选</span>
				</div>
				<div id="containUserSaveBtn" class="confirmBtn confirmBtn_n">确认</div>
				<div id="containUserCancelBtn" class="cancelBtn cancelBtn_n">取消</div>
			</div>		
			<div class="win_close win_close_n"></div>
	  	</div>
	</script>
	<!-- 用户移至组织窗口 -->
	<script type="text/template" id="relieveOrganizationWin_template">
		<div id="relieveOrganizationWin" class="win_css">
	  		<h4 class="win_title">移至</h4>
	  		<div class="cut-off"></div>
			<div class="win_content">
				<div id="allOrganizationZTreeDiv">
					<ul id="allOrganizationZTree" class="ztree"></ul>
				</div>
				<div id="relieveOrganizationSaveBtn" class="confirmBtn confirmBtn_n">移动</div>
				<div id="relieveOrganizationCancelBtn" class="cancelBtn cancelBtn_n">取消</div>
			</div>
            <div id="userSelectOrganization_tip">用户至少归属到一个组织</div>
			<div class="win_close win_close_n"></div>
	  	</div>
	</script>
	<!-- 组织用户详细信息窗口 -->
	<script type="text/template" id="moreInformationWin_template">
		<div id="moreInformationWin" class="win_css">
	  		<h4 class="win_title">详细信息</h4>
		  	<div class="cut-off"></div>
			<div class="win_content">
				<table id="moreInformationTable" cellspacing="0" cellpadding="0">
				</table>
				<div id="moreInformationEditBtn" class="confirmBtn confirmBtn_n">编辑</div>
				<div id="updateUserPasswordBtn" class="confirmBtn confirmBtn_n">修改密码</div>
				<div id="local_title">{local_title}</div>
				<div id="organization_list_div">
					<ul id="organization_list_ul">
					</ul>
				</div>
			</div>
			<div class="win_close win_close_n"></div>
	  	</div>
	</script>
	<!-- 组织用户详细信息表格中的一行 -->
	<script type="text/template" id="moreInformationTableTr_template">
		<tr>
			<td class="td_tile">{title}</td>
			<td class="td_content">{value}</td>
		</tr>
	</script>
	<!-- 组织用户详细信息中组织包含用户或者用户所属组织列表子项 -->
	<script type="text/template" id="organizationItem_template">
		<li class="organization_item">
			<div class={icon_class}></div>
			<div class="organizationItem_name">
				<span title={name_title}>{name}</span>
			</div>
		</li>
	</script>	
	<!--  组织用户详细信息中组织包含用户或者用户所属组织跳转到相应配置界面 -->
	<script type="text/template" id="organizationIumpItem_template">
		<li class="organization_jump_item">
			<div class="{jump_class}"></div>
		</li>
	</script>	
	<!-- 修改密码窗口 -->
	<script type="text/template" id="changePasswordWin_template">
	  	<div id="changePasswordWin" class="win_css">
	  		<h4 class="win_title">修改密码</h4>
			  	<div class="cut-off"></div>
				<div class="win_content">
					<table cellspacing="0" cellpadding="0">
						<tr><td><span class="win_input_title">新密码：</span></td></tr>
			  			<tr><td><input id="newPassword" class="textInput textInput-n input_normal" type="password" value=""
									maxlength="16" title="可输入符号：!$%^&*.~_-@,">
							</td></tr>
			  			<tr class="error_tip_tr"><td><span id="newPassword_error_tip" class="input_error_tip"></span></td></tr>
			  			<tr><td><span class="win_input_title">确认新密码：</span></td></tr>
			  			<tr><td><input id="confirmNewPassword" class="textInput textInput-n input_normal" type="password" value=""
									 maxlength="16" title="可输入符号：!$%^&*.~_-@,">
							</td></tr>
			  			<tr class="error_tip_tr"><td><span id="confirmNewPassword_error_tip" class="input_error_tip"></span></td></tr>  			
					</table>
					<div id="changePasswordSaveBtn" class="confirmBtn confirmBtn_n">确认</div>
					<div id="changePasswordCancelBtn" class="cancelBtn cancelBtn_n">取消</div>
				</div>
			<div class="win_close win_close_n"></div>
	  	</div>
	</script>
  </head>
  <body>
  	<div class="blackboard-css"></div>
  	<ul id="searchRecord">
    </ul>
  	<div id="omTopView">
  		<div id="searchView">
  			<div id="omsearch">
  				<div class="search_input_bg search_input_bg_n">
  					<input id="search_input" class="input_hint" type="text" defaultvalue="按组织搜索" value="按组织搜索" maxlength="18">
  				</div>
  				<div id="search_button" class="search_button search_button_n"></div>
  				<div id="search_category" class="search_category search_category_n">
  					<span id="search_category_span">组织</span>
  				</div>
  				<div id="search_category_menu" tabindex="0" hidefocus="true">
  					<ul>
  						<li class="menu_li menu_li_f" id="search_organization_item">组织</li>
  						<li class="menu_li" id="search_role_item">角色</li>
  						<li class="menu_li" id="search_resource_item">资源</li>
  					</ul>
  				</div>
  			</div>
  			<div id="omsave" class="button_01 button_01_n">保存更改</div>
  		</div>
  		<div id="resultView">
  			<div>
  				<div id="organization_search_name_div" class="search_name">
					<span id="organization_search_name"></span>
					<div id="organization_search_close" class="search_close search_close_n"></div>
				</div>
				<span id="organization_result_span_tip" class="search_tip" >没有搜索到组织和用户信息</span>
  				<span class="organization_result_span">组织</span>
  			</div>
  			<div>
  				<div id="role_search_name_div" class="search_name">
					<span id="role_search_name"></span>
					<div id="role_search_close" class="search_close search_close_n"></div>
				</div>
  				<span class="role_result_span">角色</span>
  				<span id="role_result_span_tip" class="search_tip">没有搜索到角色信息</span>
  			</div>
  			<div>
  				<div id="resource_search_name_div" class="search_name">
					<span id="resource_search_name"></span>
					<div id="resource_search_close" class="search_close search_close_n"></div>
				</div>
  				<span class="resource_result_span">资源</span>
  				<span id="resource_result_span_tip" class="search_tip">没有搜索到资源信息</span>
  			</div>
  		</div>
  		<div class="horizontal_shadow"></div>
  	</div>
  	<div id="body">
  		<div id="organization_operate">
  			<ul id="organizationZTree" class="ztree"></ul>
  		</div>
  		<div class="page-shadow"></div>
  		<div id="role_operate">
  			<ul id="roleZTree" class="ztree"></ul>
  		</div>
  		<div id="resource_operate">
  			<ul id="resourceZTree" class="ztree"></ul>
  		</div>
  	</div>

  	<!-- 组织操作列表  -->
	<div id="organization_menu" class="easyui-menu">
		<div onclick="appendOmNode('organizationZTree')" data-options="iconCls:'icon-add-n'">新增</div>
		<div onclick="updateOmNode('organizationZTree')" data-options="iconCls:'icon-rename-n'">重命名</div>
		<div onClick="containOmNode()" data-options="iconCls:'icon-contain-n'">添加用户</div>
		<div onclick="removeOmNode('organizationZTree','delete')" data-options="iconCls:'icon-trash-n'">删除</div>
		<div onclick="showMoreInformation()">详细信息</div>
	</div>
	
	<!-- 用户操作列表  -->
	<div id="user_menu" class="easyui-menu">
		<div onclick="updateOmNode('organizationZTree')" data-options="iconCls:'icon-rename-n'">重命名</div>
		<div onclick="relieveOmNode()" data-options="iconCls:'icon-move-n'">移至</div>
		<div onclick="removeOmNode('organizationZTree','relieve')" data-options="iconCls:'icon-relieve-n'">解除关系</div>
		<div onclick="removeOmNode('organizationZTree','delete')" data-options="iconCls:'icon-trash-n'">删除</div>
		<div onclick="showMoreInformation()">详细信息</div>
	</div>
  	
  	<!-- 角色树操作列表  -->
	<div id="role_menu" class="easyui-menu">
		<div onclick="appendOmNode('roleZTree')" data-options="iconCls:'icon-add-n'">新增</div>
		<div onclick="updateOmNode('roleZTree')" data-options="iconCls:'icon-rename-n'">重命名</div>
		<div onclick="removeOmNode('roleZTree')" data-options="iconCls:'icon-trash-n'">删除</div>
	</div>
	
	<!-- 资源操作列表  -->
	<div id="resource_menu" class="easyui-menu">
		<div onclick="appendOmNode('resourceZTree')" data-options="iconCls:'icon-add-n'">新增</div>
		<div onclick="updateOmNode('resourceZTree')" data-options="iconCls:'icon-rename-n'">编辑</div>
		<div onclick="removeOmNode('resourceZTree')" data-options="iconCls:'icon-trash-n'">删除</div>
	</div>
  </body>
</html>