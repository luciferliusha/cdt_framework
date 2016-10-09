<%@page import="com.zjcds.portal.config.SysConfig"%>
<%@page import="com.zjcds.framework.common.constant.Constants"%>
<%@page import="com.zjcds.portal.config.ConfigManager" %>
<%@page import="com.zjcds.framework.view.bean.UserPermission"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%
	SysConfig sysConfig = ConfigManager.getInstance().getSysConfig();
	String style = sysConfig.getConfigValue("config.styleName");
	String path = request.getContextPath();
%>

<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE">
    <!-- CSS导入 -->
    <link href="<%=path%>/css/font-awesome/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="<%=path%>/js/libs/easyui/themes/default/easyui.css" rel="stylesheet" type="text/css">
	<link href="<%=path%>/js/libs/easyui/themes/icon.css" rel="stylesheet" type="text/css">
    <link href="<%=path %>/js/libs/tip/jquery.qtip.css" rel="stylesheet" type="text/css" />
    <link href="<%=path %>/css/framework_all.css" rel="stylesheet" type="text/css" />
    <link href="<%=path %>/css/framework_default.css" rel="stylesheet" type="text/css" />
    <link href="<%=path %>/css/header_<%=style%>.css" rel="stylesheet" type="text/css" />
    <link href="<%=path %>/css/menu_default.css" rel="stylesheet" type="text/css" />
	<link href="<%=path %>/css/index.css" rel="stylesheet" type="text/css" />
	<link href="<%=path %>/js/libs/minicolors/jquery.minicolors.css" rel="stylesheet" type="text/css" />
	<link href="<%=path %>/js/libs/mCustomScrollbar/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css" />

	<script type="text/javascript" src="<%=path %>/js/libs/jquery/jquery-1.7.2.js"></script>
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
    
	<!-- JS导入 -->
	<script type="text/javascript" src="<%=path %>/js/libs/jquery/jquery-ui.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/mCustomScrollbar/jquery.mousewheel.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/mCustomScrollbar/jquery.mCustomScrollbar.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/riot/render.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/tip/jquery.qtip.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/minicolors/jquery.minicolors.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/base64/base64.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/common/getUrlPermission.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/common/loadCssFile.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/colorchange/color_exchange.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easing/jquery.easing.1.3.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/json2.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/util.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/name_limit.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/containSpecial.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/cdtUtil.js"></script>
		
	<script type="text/javascript" src="<%=path %>/js/common/SettingConst.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/constant/constants.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/constant/dataConst.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/main/framework.js"></script>
	<script type="text/javascript" src="<%=path %>/js/gobal/httpUtil.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/topView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/isotopeView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/menuView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/solutionWindowView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/solutionFavView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/solutionView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/componentView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/workingView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/service/componentService.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/service/solutionService.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/service/permissionService.js"></script>
	<script type="text/javascript" src="<%=path %>/js/cookies.js"></script>

	<script type="text/javascript">
	<%
		UserPermission clientsession = (UserPermission)request.getSession().getAttribute(Constants.SESSION_USER);
	%>
		//读取配置信息
		sysName = "<%=sysConfig.getConfigValue("config.systemName").replaceAll("\"","%22") %>";//转换"防止错误
		sysName = sysName.replace(/\%22/g, "\"");//转换"回来
		logoUrl = "<%=sysConfig.getConfigValue("config.logoURL") %>";
		topWidth = "<%=sysConfig.getConfigValue("config.topWidth") %>";
		topHeight = "<%=sysConfig.getConfigValue("config.topHeight") %>";
		topMarginTop = "<%=sysConfig.getConfigValue("config.topMarginTop") %>";
		topMarginLeft = "<%=sysConfig.getConfigValue("config.topMarginLeft") %>";
		frontPage = <%=Boolean.parseBoolean(sysConfig.getConfigValue("config.frontPage")) %>;//是否登录后显示首页，默认为true显示首页，false为没有首页功能
		frontPageAccess = <%=Integer.parseInt((sysConfig.getConfigValue("config.frontPageAccess"))) %>;//定义首页九宫格访问方式，0为展示所有解决方案，1为展示第一层解决方案组和解决方案
		
		var isIE=navigator.userAgent.toUpperCase().indexOf("MSIE")==-1?false:true;
		var path = "<%=path %>";
		var style = "<%=style %>";
		var contextPath = path;//兼容以前的
		var userAcct = "";//登录账号
		var userName = "";//用户名(显示右上角用)
		var userOrg = "";//组织信息
		var userXzqhdm = "";//用户行政区划代码
		var xzqh = "";
		var isLogined = false;//是否登录在线(session是否没有超时)
		var isFromOrm = false;//权限是否从外部JSAPI方式来
		var isFromOutOm = false;
		if (isFromOrm) {//外部JSAPI方式
			userAcct = userName = base64decode('<%=request.getParameter("userAcct")%>');
		}
		else if(isFromOutOm){//权限是否从外部权限系统来
		}
		else {
		<%
			if(clientsession != null){
		%>
				isLogined = true;
				userAcct = '<%=clientsession.getLoginName() %>';
				userName = '<%=clientsession.getName() %>';
				userXzqhdm = '<%=clientsession.getXzqhdm() %>';
		<%
			}
		%>
		}
	</script>
  </head>

  	<!-- 模板文档 -->
  	<!-- topView模板 -->
  	<script type="text/template" id="top_logo_template">
		<div class="control_n" id="control" title="切换导航栏"></div>
		<div style="width:{topWidth};height:{topHeight};margin-top:{topMarginTop};margin-left:{topMarginLeft};background-image: url('{logoUrl}');" id="logo"></div>
		<div id="tools">
			<div id="styleSettingDiv" class="settingDiv_n">
				<div id="styleSetting" class="styleSettingCls brush-n" title="选择颜色方案"></div>
			</div>
			<ul class="dropdown-menu menu-arrow" id="styleSetting-menu">
				<li>
					<label>顶部栏的颜色</label>
					<ul class="header-color-variation demo-color-variation">
						<!--<li><a class="color-dark" data-headertheme="header_dark.css"></a></li>-->
						<li><a class="color-default" data-headertheme="header_default.css"></a></li>
						<li><a class="color-blue" data-headertheme="header_blue.css"></a></li>
						<li><a class="color-orange" data-headertheme="header_orange.css"></a></li>
						<li><a class="color-deepblue" data-headertheme="header_deepblue.css"></a></li>
						<li><a class="color-red" data-headertheme="header_red.css"></a></li>
					</ul>
				</li>
				<li class="divider"></li>
				<li>
					<label>导航栏的颜色</label>
					<ul class="sidebar-color-variation demo-color-variation">
						<li><a class="color-default" data-theme="menu_default.css"></a></li>
						<li><a class="color-gray" data-theme="menu_gray.css"></a></li>
						<!--<li><a class="color-dark" data-theme="menu_dark.css"></a></li>-->
					</ul>
				</li>
			</ul>
			<div id="homeVisitDiv" class="settingDiv_n">
				<div id="homeVisit" class="editCls home-n" title="首页"></div>
			</div>
			<div id="sysEditDiv" class="settingDiv_n">
				<div id="sysEdit" class="editCls edit-n" title="编辑解决方案"></div>
			</div>
			<div id="sysSettingDiv" class="settingDiv_n">
				<div id="sysSetting" class="settingCls setting-n" title="系统管理"></div>
			</div>
			<div id="favoriteDiv" class="settingDiv_n">
				<div id="favoriteSetting" class="favoriteCls favorite-n" title="解决方案喜好设置"></div>
			</div>
			<div id="userInfoTopDiv" class="userInfoTopCls">
				<div id="userNameDiv" class="userNameCls">{userName}</div>
				<div id="userPicDiv" class="userPicCls"></div>

				<ul class="userInfo-dropdown-menu menu-arrow" id="userInfo-menu" style="display:none;">
					<!--<li>
						<label>个人信息</label>
					</li>-->
					<li>
						<label id="save">保存</label>
					</li>
					<li>
						<label id="logout">注销</label>
					</li>
				</ul>
			</div>
		</div>
	</script>
	
	<!-- menuView模板 -->
	<script type="text/template" id="solution_parent_li_template">
		<li solutionid='{solutionid}' parentId='{parentId}' orderBy='{orderBy}' class="firstparent solution_div_sidebar_parent_li_n">
			<div class="sidebar_div">
				<span iconNormal="{iconNormal}" iconSelect="{iconSelect}" class="solutionpic" style="background-image: url('{iconName}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{iconName}', sizingMethod='scale')"></span>
				<span class="tools-delete tools-delete-n icon-trash"></span>
				<span class="tools-rename tools-rename-n icon-pencil"></span>
				<a class="wordspan solution_name" title='{title}'>{solutionname}</a>
			</div>
		</li>
	</script>
	<script type="text/template" id="solution_parent_li_hasChild_template">
		<li solutionid='{solutionid}' parentId='{parentId}' orderBy='{orderBy}' class="hasChild firstparent solution_div_sidebar_parent_li_n">
			<div class="sidebar_div">
				<span class="solutionpic" iconNormal="{iconNormal}" iconSelect="{iconSelect}" style="background-image: url('{iconName}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{iconName}', sizingMethod='scale')"></span>
				<span class="arrow arrow-left"></span>
				<span class="tools-rename tools-rename-n icon-pencil"></span>
				<a class="wordspan solution_name" title='{title}'>{solutionname}</a>
			</div>
		</li>
	</script>
	<script type="text/template" id="solution_children_ul_template">
		<ul class="solution_div_sidebar_child solution_div_sidebar_child_click"></ul>
	</script>
	<script type="text/template" id="solution_children_li_template">
		<li solutionid='{solutionid}' parentId='{parentId}' orderBy='{orderBy}' class="solution_div_sidebar_child_li_n">
			<div>
				<span class="tools-delete tools-delete-n icon-trash"></span>
				<span class="tools-rename tools-rename-n icon-pencil"></span>
				<a class="solution_name" title='{title}'>{solutionname}</a>
			</div>
		</li>
	</script>
	<script type="text/template" id="solution_children_li_hasChild_template">
		<li solutionid='{solutionid}' parentId='{parentId}' orderBy='{orderBy}' class="hasChild solution_div_sidebar_child_li_n">
			<div>
				<span class="arrow arrow-left"></span>
				<span class="tools-rename tools-rename-n icon-pencil"></span>
				<a class="solution_name" title='{title}'>{solutionname}</a>
			</div>
		</li>
	</script>
  	<!-- 构件组模板 -->
  	<script type="text/template" id="component_group_template">
		<li class="component_group_title_li" appId="{appId}">
			<div class="component_group_title_div">
				<span class="component_group_title">{appName}</span>
				<span class="number_marked number_marked_n">{subNumber}</span>
			</div>
		</li>
	</script>
	<script type="text/template" id="component_group_ul_template">
		<ul class="component_group_ul">
		</ul>
	</script>
	<!-- 构件模板 -->
	<script type="text/template" id="component_template">
		<li class="part_application_n" appId="{appId}">
			<table cellpadding="0" cellspacing="0" class="component_table">
			 	<tr>
			 		<td class="component_group_item_content_font">
			 			<span style="word-break:break-all;display:block;">
			 				{appName}
						</span>
					</td>
				</tr>
			</table>			 			
		</li>
	</script>
	<!-- 新建解决方案组和解决方案window -->
	<script type="text/template" id="new_solution_choose_template">
		<div id="new_solution_choose_window" class="window_css">
  			<h4>请选择新增类型</h4>
  			<div class="window_cut_off"></div>
  			<div class="new_solution_choose">
  				<div id="choose_solutions" class="button-03 button-03-n">解决方案组</div>
  				<div id="choose_solution" class="button-03 button-03-n">解决方案</div>
  			</div>
  			<div class="window_close window_close_n"></div>
		</div>
	</script>
	
	<!-- 图标信息模板 -->
  	<script type="text/template" id="icon-item-template">
		  	<li id="icon{icon_id}" normalIcon="{normalIcon}" selectedIcon="{selectedIcon}">
				<div class="iconDiv">
					<div title="正常显示的图标" class="iconStyle" style="background-image: url('{icon_n}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{icon_n}', sizingMethod='scale')">
					</div>
					<div title="选择后显示的图标" class="iconStyle" style="background-image: url('{icon_s}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{icon_s}', sizingMethod='scale')">
					</div>
				</div>
				<div class="iconSpan" title="{icon_name}">{icon_name}</div>
			</li>
	</script>
	
	<!-- 图片信息模板 -->
  	<script type="text/template" id="pic-item-template">
		  	<li id="pic{pic_id}" normalPic="{normalPic}">
				<div class="picDiv">
					<div title="正常显示的图标" class="picStyle" style="background-image: url('{pic_n_notForIE8}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{pic_n}', sizingMethod='scale')">
					</div>
				</div>
				<div class="picSpan" title="{pic_name}">{pic_name}</div>
			</li>
	</script>
	
	<!-- 新建解决方案组window -->
	<script type="text/template" id="new_solutions_template">
		<div id="new_sloutions_window" class="window_css">
  			<h4>新建解决方案组</h4>
  			<div class="window_cut_off"></div>
  			<div class="new_solutions">
  				<table cellpadding="0" cellspacing="0">
  					<tr style="height:24px;">
  						<td style="width:40px;"><span>位置：</span></td>
  						<td  style="padding-left: 5px;"><select id="solutions_PFDirTree" disabled="disabled" style="height:24px;"></select></td>
  						<td></td>
  					</tr>
  					<tr class="window_table_divideTr">
						<td></td>
						<td colspan="2" id="solution_paraent_message" class="text_error">
						</td>
					</tr>
  					<tr>
  						<td><span>名称：</span></td>
  						<td>
							<input id="new_solutions_name_input" class="textInput textInput-n" onkeypress='ValidateSpecialCharacter();' maxlength="20">
						</td>
  						<td></td>
  					</tr>
					<tr class="window_table_divideTr2">
						<td></td>
						<td colspan="2" id="solution_name_message" class="text_error">
						</td>
					</tr>
					<tr>
  						<td title="导航栏展示的图标"><span>图标：</span></td>
  						<td colspan="2">
							<ul id="icon_list"></ul>
						</td>
  					</tr>
					<tr class="window_table_divideTr">
						<td></td>
						<td colspan="2" id="solution_icon_message" class="text_error">
						</td>
  					</tr>
					<tr>
  						<td title="首页展示的图标"><span>图片：</span></td>
  						<td colspan="2">
							<ul id="pic_list"></ul>
						</td>
  					</tr>
					<tr class="window_table_divideTr">
						<td></td>
						<td colspan="2" id="solution_pic_message" class="text_error">
						</td>
  					</tr>
					<tr>
  						<td colspan="3" align="right"><div id="new_solutions_saveBtn" class="buttonX buttonX-n">保存</div></td>
  					</tr>
  				</table>
  			</div>
  			<div class="window_close window_close_n"></div>
  		</div>
	</script>
	<!-- 新建解决方案window -->
	<script type="text/template" id="new_solution_template">
		<div id="new_sloution_window" class="window_css">
  			<h4>新建解决方案</h4>
  			<div class="window_cut_off"></div>
  			<div class="new_solution">
  				<table cellpadding="0" cellspacing="0">
  					<tr style="height:24px;">
 						<td style="width:40px;"><span>位置：</span></td>
 						<td  style="padding-left: 5px;"><select id="solutions_PFDirTree" disabled="disabled" style="height:24px;"></select></td>
 						<td></td>
  					</tr>
  					<tr class="window_table_divideTr">
						<td></td>
						<td colspan="2" id="solution_paraent_message" class="text_error">
						</td>
  					</tr>
  					<tr>
  						<td><span>名称：</span></td>
  						<td>
							<input id="new_solution_name_input" class="textInput textInput-n" onkeypress='ValidateSpecialCharacter();' maxlength="20">
						</td>
  						<td></td>
  					</tr>
  					<tr class="window_table_divideTr">
						<td></td>
						<td colspan="2" id="solution_name_message" class="text_error">
						</td>
  					</tr>
  					<tr>
  						<td title="应用载入的URL，输入URL后模板项会不起作用"><span>URL：</span></td>
  						<td>
							<input id="new_solution_url_input" class="textInput textInput-n" maxlength="300">
						</td>
  						<td></td>
  					</tr>
					<tr class="window_table_divideTr2">
						<td></td>
						<td colspan="2" id="solution_url_message" class="text_error">
						</td>
					</tr>
  					<tr style="height:24px;">
 						<td style="width:40px;" title="载入模板中的布局进行展现，只有在URL为空的情况下选择有用"><span>模板：</span></td>
 						<td  style="padding-left: 5px;"><select id="template_list" style="height:24px;"></select></td>
 						<td></td>
  					</tr>
  					<tr class="window_table_divideTr">
						<td></td>
						<td colspan="2" id="solution_template_message" class="text_error">
						</td>
  					<tr>
					<tr>
  						<td title="导航栏展示的图标"><span>图标：</span></td>
  						<td colspan="2">
							<ul id="icon_list"></ul>
						</td>
  					</tr>
  					<tr class="window_table_divideTr">
						<td></td>
						<td colspan="2" id="solution_icon_message" class="text_error">
						</td>
					</tr>
					<tr>
  						<td title="首页展示的图标"><span>图片：</span></td>
  						<td colspan="2">
							<ul id="pic_list"></ul>
						</td>
  					</tr>
					<tr class="window_table_divideTr">
						<td></td>
						<td colspan="2" id="solution_pic_message" class="text_error">
						</td>
					</tr>
  					<tr>
  						<td></td>
  						<td colspan="2">
							<input title="只有在输入URL情况下才有用，可以设置载入该URL应用的标题栏是否展现" id="new_solution_title_checkbox" type="checkbox" checked="">
							<span title="只有在输入URL情况下才有用，可以设置载入该URL应用的标题栏是否展现" id="new_solution_is_show_title">是否显示标题栏</span>
							<div id="new_solution_saveBtn" class="buttonX buttonX-n">保存</div>
						</td>
  					</tr>
  				</table>
  			</div>
  			<div class="window_close window_close_n"></div>
  		</div>
	</script>
	<!-- 删除解决方案window -->
	<script type="text/template" id="delete_solution_template">
		<div id="delete_sloution_window" class="window_css">
  			<h4>提示</h4>
  			<div class="window_cut_off"></div>
  			<div class="delete_solution">
  				<div style="font-weight: bold;">删除选中项</div>
  				<div id="delete_solution_content"></div>
  			</div>
  			<a id="delete_solution_cancel">取消</a>
  			<div id="delete_solution_btn" class="buttonX buttonX-n">删除</div>		
  			<div class="window_close window_close_n"></div>
  		</div>
	</script>
	<!-- 工作区设置框体 -->
	<script type="text/template" id="frameTitleConfig_template">
		<div id="frameTitleConfigWin" class="window_css">
			<div style="width:100%; height:100%">
				<h4>标题栏配置</h4>
				<div class="window_cut_off"></div>
				<div class="frameTitleConfigContent">
					<table style="padding:10px;width:100%;text-align:center;line-height:30px;">
						<tr style="line-height:12px;color:red;font-size:10px;overflow:hidden;">
							<td colspan="2"><span id="frameTitleConfig_warning"></span>&nbsp;</td>
						</tr>
						<tr>
							<td width="30%"><font style="font-size:12px;">标题栏背景颜色:</font></td>									
							<td width="70%"><input class="textInput textInput-n" id="titleBgColor" type="text" value="" 
								onpaste="return false"></td>
						</tr>
						<tr>
							<td><font style="font-size:12px;">标题栏文字大小:</font></td>									
							<td><input class="textInput textInput-n" id="titleFontSize" type="text" value="" 
								onpaste="return false"></td>
						</tr>
						<tr>
							<td><font style="font-size:12px;">构件x位置:</font></td>									
							<td><input class="textInput textInput-n" id="panelPositionX" type="text" value="" 
								onpaste="return false"></td>
						</tr>
						<tr>
							<td><font style="font-size:12px;">构件y位置:</font></td>									
							<td><input class="textInput textInput-n" id="panelPositionY" type="text" value="" 
								onpaste="return false"></td>
						</tr>
						<tr>
							<td><font style="font-size:12px;">构件宽度:</font></td>									
							<td><input class="textInput textInput-n" id="panelWidth" type="text" value="" 
								onpaste="return false"></td>
						</tr>
						<tr>
							<td><font style="font-size:12px;">构件高度:</font></td>									
							<td><input class="textInput textInput-n" id="panelHeight" type="text" value="" 
								onpaste="return false"></td>
						</tr>
						<tr style="line-height:40px;">
							<td colspan="2"><input class="cancel buttonX buttonX-n" type="button"
								value="取消" onfocus='this.blur();'>	
							    <input class="confirm buttonX buttonX-n" type="button"
								value="保存" onfocus='this.blur();' style="margin-left: 25%"></td>
						</tr>
					</table>
				</div>
			</div>
			<div class="window_close window_close_n"></div>
		</div>
	</script>
	<!-- 为解决方案新建工作区 -->
	<script type="text/template" id="new_solution_workspace_template">
		<div class="{solution_workspace}" style="width:{width}px;height:{height}px;left:{left}px;top:{top}px">
			<div class="frameTitle {frameTitleBorder}" style="background-color:{titleBgColor};display: {display};width:{titleWidth}px">
				<span style="font-size:{titleFontSize}">{pfName}</span>
				<span class="frame_title_close frame_title_close_n" style="display: none;"></span>
				<span class="frame_title_config frame_title_config_n" style="display: none;"></span>
			</div>
			<div class="iframeforurl">
				<div class="iframe_loading"></div>
				<iframe style="width:{iframeWidth}px;height:{iframeHeight}px;" frameborder="0" scrolling="auto"></iframe>
			</div>
		</div>
	</script>
	<!-- 解决方案喜好设置弹出窗模板 -->
	<script type="text/template" id="favoriteSetting_template">
		<div id="favoriteSettingWin" class="window_css">
			<div style="width:100%; height:100%">
				<h4>解决方案喜好设置</h4>
				<div class="window_cut_off"></div>
				<div class="favoriteSettingContent">
					<div id="solution_tree_loading" class="iframe_loading"></div>
					<ul id="solution_tree" class="easyui-tree tree solution_favorite_tree"></ul>
				</div>
				<a id="delete_solutionFav_cancel" class="cancel">取消</a>
  				<div id="save_solutionFav_btn" class="confirm buttonX buttonX-n">保存</div>
			</div>
			<div class="window_close window_close_n"></div>
		</div>
	</script>
	<!-- 首页块状解决方案模板 -->
	<script type="text/template" id="isotope_content_template">
		<div class="item">
			<div class="item-div">
				<span class="item-span item-span-n"></span>
				<div class="item-image" style="background-image: url({url});">
				</div>
			</div>
			<div class="item-text">{name}</div>
		</div>
	</script>
	<script type="text/template" id="isotope_content_template_ie8">
		<div class="item">
			<div class="item-div">
				<span class="item-span item-span-n"></span>
				<div class="item-image" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{url}', sizingMethod='scale')">
				</div>
			</div>
			<div class="item-text">{name}</div>
		</div>
	</script>
	<!-- 模板结束 -->
  
  <body style="display: none;">
  	<!--主界面 -->
  		<div class="index_content_div">
  			<div class="index_content"></div>
  			<div id="pre_page" class="pre_page_n"></div>
  			<div id="next_page" class="next_page_n"></div>
  			<ul id="page_number">
  			</ul>
  			<div class="button-group">
  				<button class="is-checked">4×3</button>
  				<button>4×2</button>
  			</div>
  		</div>
  		<div class="all_background"></div>
		<div id="top_div" class="top_div">
		</div>
		<div style="padding-top: 40px;">
			<div id="working"></div>
			<div id="menu_div" class="menu_div">
				<div id="menu_operate_div"  class="menu_operate_div_border" style="display: none">
					<div id="menu_operate" class="menu_operate_left">
						<div id="solutions"><span>解决方案</span></div>
						<div id="components"><span>构件</span></div>
					</div>
					<div id="solutions_add" class="solutions_add icon-plus" title="点击新增"></div>
				</div>
				<div id="menu_ul_parent" class="menu_ul_parent">
					<ul id="solution_div_sidebar">
					</ul>
					<ul id="component_div_sidebar">
					</ul>
				 </div>			 
			</div>
		</div>
  </body>
</html>
