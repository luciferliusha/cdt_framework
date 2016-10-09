<%@page import="com.zjcds.portal.config.SysConfig"%>
<%@page import="com.zjcds.portal.config.ConfigManager"%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%
String path = request.getContextPath();
SysConfig sysConfig = ConfigManager.getInstance().getSysConfig();
%>
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <!-- CSS导入 -->
    <link href="<%=path%>/css/font-awesome/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="<%=path %>/js/libs/easyui/themes/default/easyui.css" rel="stylesheet" type="text/css">
	<link href="<%=path %>/js/libs/easyui/themes/icon.css" rel="stylesheet" type="text/css">
    
	<!-- JS导入 -->
	<script type="text/javascript" src="<%=path %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/riot/render.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/isotope/jquery.isotope.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/imgPreview/zjcds.jquery.imgPreview.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/json2.js"></script>

	<script type="text/javascript" src="<%=path %>/js/gobal/httpUtil.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/service/settingService.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/settingView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/common/loadCssFile.js"></script>
	<script type="text/javascript" src="<%=path %>/js/cookies.js"></script>

	<script type="text/javascript">
		var path = "<%=path %>";
		var isIE = navigator.userAgent.toUpperCase().indexOf("MSIE") == -1 ? false : true;
		var systemName = "<%=sysConfig.getConfigValue("config.systemName").replaceAll("\"","%22") %>";//转换"防止错误
		systemName = systemName.replace(/\%22/g, "\"");//转换"回来
		var systemNameFontSize = "<%=sysConfig.getConfigValue("config.systemNameFontSize") %>";
		systemNameFontSize = systemNameFontSize.replace("px", "");
		var logoURL = "<%=sysConfig.getConfigValue("config.logoURL") %>";
		var topWidth = "<%=sysConfig.getConfigValue("config.topWidth") %>";
		topWidth = topWidth.replace("px", "");
		var topHeight = "<%=sysConfig.getConfigValue("config.topHeight") %>";
		topHeight = topHeight.replace("px", "");
		var topMarginTop = "<%=sysConfig.getConfigValue("config.topMarginTop") %>";
		topMarginTop = topMarginTop.replace("px", "");
		var topMarginLeft = "<%=sysConfig.getConfigValue("config.topMarginLeft") %>";
		topMarginLeft = topMarginLeft.replace("px", "");
		var rightName = "<%=sysConfig.getConfigValue("config.rightName").replaceAll("\"","%22") %>";
		rightName = rightName.replace(/\%22/g, "\"");//转换"回来
		var techniqueName = "<%=sysConfig.getConfigValue("config.techniqueName").replaceAll("\"","%22") %>";
		techniqueName = techniqueName.replace(/\%22/g, "\"");//转换"回来
		var frontPage = <%=Boolean.parseBoolean(sysConfig.getConfigValue("config.frontPage")) %>;
		var frontPageAccess = <%=Integer.parseInt((sysConfig.getConfigValue("config.frontPageAccess"))) %>;
		var style = "<%=sysConfig.getConfigValue("config.styleName") %>";
		var sysSettingData = {systemName:systemName,systemNameFontSize:systemNameFontSize,logoURL:path+logoURL,topWidth:topWidth,topHeight:topHeight,topMarginTop:topMarginTop,topMarginLeft:topMarginLeft,rightName:rightName,techniqueName:techniqueName};
		
		var settingView;
		$(function(){
			loadCssForCom(path,"sysLogoManage.css");
			settingView = new SettingView();
			settingView.init();
		});
	</script>
  </head>

  	<!-- 模板文档 -->
 	<!-- 配置信息模板 -->
  	<script type="text/template" id="sys-config-template">
		<li class="sys_setting_item item_step1"><h4>系统名称</h4><div class="meta_opr"><p><a id="modifySystemName" href="javascript:;" class="">修改</a><a id="cancelSystemName" href="javascript:;" class="right-gap" style="display:none;">取消</a><a id="saveSystemName" href="javascript:;" class="" style="display:none;">保存</a></p><p class="desc">登录页面显示的系统名称</p></div><div class="meta_content" id="systemNameDiv" contenteditable="false">{systemName}<br/></div><p id="systemNameTip" class="error" style="display:none;"></p></li>
		<li class="sys_setting_item item_step1"><h4>系统名称字体</h4><div class="meta_opr"><p><a id="modifySystemNameFont" href="javascript:;" class="">修改</a><a id="cancelSystemNameFont" href="javascript:;" class="right-gap" style="display:none;">取消</a><a id="saveSystemNameFont" href="javascript:;" class="" style="display:none;">保存</a></p><p class="desc">系统名称如果过长请缩小字体大小防止换行</p></div><div id="systemNameFontDiv" class="meta_content">{systemNameFontSize}<br/></div><p class="p-px">px</p><p id="systemNameFontTip" class="error" style="display:none;"></p></li>
		<li class="sys_setting_item"><h4>系统LOGO</h4><div class="meta_opr"><p><a id="modifyLogo" href="javascript:;" class="">修改</a><a id="cancelLogo" href="javascript:;" class="right-gap" style="display:none;">取消</a><a id="saveLogo" href="javascript:;" class="" style="display:none;">保存</a></p><p class="desc">系统左上角显示的LOGO图片，不可大于2M</p></div><div class="meta_content logoBackgroud"><div id="logo_img" class="meta_pic" style="width:{topWidth}px;height:{topHeight}px;background-image: url('{logoURL}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{logoURL}', sizingMethod='scale')"></div></div><form id="update_logo_form" style="display:none;" action="<%=path%>/updateLogo.do" method="POST" enctype="multipart/form-data" target="logo_update_frame"><input key="logo_img" id="logo_file" type="file" name="pic" accept="image/jpg,image/jpeg,image/gif,image/png" /></form><p id="logoImgTip" class="error" style="display:none;"></p></li>
		<li class="sys_setting_item"><h4>系统LOGO属性</h4><div class="meta_opr"><p><a id="modifySystemLogoPro" href="javascript:;" class="">修改</a><a id="cancelLogoPro" href="javascript:;" class="right-gap" style="display:none;">取消</a><a id="saveLogoPro" href="javascript:;" class="" style="display:none;">保存</a></p></div><div class="meta_content meta_text">宽度：</div><div id="logoWidthDiv" class="meta_content meta_content_s">{topWidth}<br/></div><div class="meta_content">px</div><div id="logoWidthTip" class="span-error" style="display:none;"></div><p style="height:4px"></p><div class="meta_content meta_text next-line">高度：</div><div id="logoHeightDiv" class="meta_content meta_content_s">{topHeight}<br/></div><div class="meta_content">px</div><div id="logoHeightTip" class="span-error" style="display:none;"></div></li>
		<li class="sys_setting_item item_step1"><h4>系统LOGO样式</h4><div class="meta_opr"><p><a id="modifyLogoStyle" href="javascript:;" class="">修改</a><a id="cancelLogoStyle" href="javascript:;" class="right-gap" style="display:none;">取消</a><a id="saveLogoStyle" href="javascript:;" class="" style="display:none;">保存</a></p><p class="desc">上边距为LOGO图片距离顶部的空白距离，即margin-top</p><p class="desc">左边距为LOGO图片距离左侧的空白距离，即margin-left</p></div><div class="meta_content meta_text">上边距：</div><div class="meta_content meta_content_s" id="logoMarginTopDiv">{topMarginTop}<br/></div><div class="meta_content">px</div><div id="logoTopTip" class="span-error" style="display:none;"></div><p style="height:4px"></p><div class="meta_content meta_text next-line">左边距：</div><div class="meta_content meta_content_s" id="logoMarginLeftDiv">{topMarginLeft}<br/></div><div class="meta_content">px</div><div id="logoLeftTip" class="span-error" style="display:none;"></div></li>
		<li class="sys_setting_item item_step1"><h4>版权信息</h4><div class="meta_opr"><p><a id="modifyRightName" href="javascript:;" class="">修改</a><a id="cancelRightName" href="javascript:;" class="right-gap" style="display:none;">取消</a><a id="saveRightName" href="javascript:;" class="" style="display:none;">保存</a></p><p class="desc">登录页面显示的版权信息</p></div><div id="rightNameDiv" class="meta_content">{rightName}<br/></div><p id="rightNameTip" class="error" style="display:none;"></p></li>
		<li class="sys_setting_item item_step1"><h4>技术支持</h4><div class="meta_opr"><p><a id="modifyTechniqueName" href="javascript:;" class="">修改</a><a id="cancelTechniqueName" href="javascript:;" class="right-gap" style="display:none;">取消</a><a id="saveTechniqueName" href="javascript:;" class="" style="display:none;">保存</a></p><p class="desc">登录页面显示的技术支持信息</p></div><div id="techniqueNameDiv" class="meta_content">{techniqueName}<br/></div><p id="techniqueNameTip" class="error" style="display:none;"></p></li>
		<li class="sys_setting_item item_step1">
			<h4>默认风格</h4>
			<ul id="style-list" class="header-color-variation demo-color-variation">
				<li><a data-headertheme="header_default.css" styleName="default" class="color-default"></a></li>
				<li><a data-headertheme="header_blue.css" styleName="blue" class="color-blue"></a></li>
				<li><a data-headertheme="header_orange.css" styleName="orange" class="color-orange"></a></li>
				<li><a data-headertheme="header_deepblue.css" styleName="deepblue" class="color-deepblue"></a></li>
				<li><a data-headertheme="header_red.css" styleName="red" class="color-red"></a></li>
			</ul>
		</li>
		
	</script>
	<!-- 配置是否显示首页和首页访问方式模板 -->
  	<script type="text/template" id="front-page-template">
		<li class="sys_setting_item item_step1" style="height:39px;">
			<h4>是否显示首页</h4>
			 <section id="front-page-switch" class="container">
   	 			<div class="switch">
     				<input type="radio" class="switch-input" name="view" id="show-front-page">
      				<label for="show-front-page" class="switch-label switch-label-on">显示</label>
      				<input type="radio" class="switch-input" name="view" id="hide-front-page">
      				<label for="hide-front-page" class="switch-label switch-label-off">隐藏</label>
      				<span class="switch-selection"></span>
    			</div>
			</section>
    	</li>
		<li id="front-page-access-li" class="sys_setting_item item_step1" style="height:39px;">
			<h4>首页访问方式</h4>
			 <section id="front-page-access-switch" class="container">
   	 			<div class="switch">
     				<input type="radio" class="switch-input" name="view2" id="front-page-access-all">
      				<label for="front-page-access-all" class="switch-label switch-label-on">所有解决方案</label>
      				<input type="radio" class="switch-input" name="view2" id="front-page-access-first">
      				<label for="front-page-access-first" class="switch-label switch-label-off">第一层解决方案(组)</label>
      				<span class="switch-selection"></span>
    			</div>
			</section>
    	</li>
	</script>
	<!-- 配置是否显示首页和首页访问方式模板(IE8) -->
	<script type="text/template" id="front-page-ie8-template">
		<li class="sys_setting_item item_step1" style="height:39px;">
			<h4>是否显示首页</h4>
			<div id="front-page-switch" class="container">
				<div class="switch">
					<label id="show-front-page-label" class="switch-label switch-label-off">显示</label>
					<label id="hide-front-page-label" for="front-page-access-first" class="switch-label switch-label-on">隐藏</label>
					<span class="switch-selection"></span>
				</div>
			</div>
		</li>
		<li id="front-page-access-li" class="sys_setting_item item_step1" style="height:39px;">
			<h4>首页访问方式</h4>
			<div id="front-page-access-switch" class="container">
				<div class="switch">
					<label id="front-page-access-all-label" class="switch-label switch-label-off">所有解决方案</label>
					<label id="front-page-access-first-label" for="front-page-access-first" class="switch-label switch-label-on">第一层解决方案(组)</label>
					<span class="switch-selection"></span>
				</div>
			</div>
		</li>
	</script>
	<!-- 模板结束 -->
  <body style="display:none;">
  	<div class="main_bd" >
	  	<div class="logo_config">
			<ul id="sys_setting_area">
			</ul>
	  	</div>
   	</div>
  </body>
</html>
