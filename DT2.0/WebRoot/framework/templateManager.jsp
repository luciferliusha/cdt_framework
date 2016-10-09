<%@page import="com.zjcds.portal.config.ConfigManager"%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%
String path = request.getContextPath();
String style = ConfigManager.getInstance().getSysConfig().getConfigValue("config.styleName");
%>
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <!-- CSS导入 -->
    <link href="<%=path %>/js/libs/easyui/themes/default/easyui.css" rel="stylesheet" type="text/css">
	<link href="<%=path %>/js/libs/easyui/themes/icon.css" rel="stylesheet" type="text/css">
    <link href="<%=path %>/css/<%=style %>/templateManager.css" rel="stylesheet" type="text/css" />
    
	<!-- JS导入 -->
	<script type="text/javascript" src="<%=path %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/riot/render.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/isotope/jquery.isotope.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/ckeditor/ckeditor.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/json2.js"></script>

	<script type="text/javascript" src="<%=path %>/js/gobal/httpUtil.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/service/templateManageService.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/templateManageView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/main/templateManager.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/common/loadCssFile.js"></script>
	<script type="text/javascript" src="<%=path %>/js/cookies.js"></script>

	<script type="text/javascript">
		var path = "<%=path %>";
		var style = "<%=style %>";
		
		$(function(){
			loadCssForCom(path,"templateManager.css");
		});
	</script>
  </head>

  	<!-- 模板文档 -->
  	
  	<!-- 窗口模板 -->
  	<script type="text/template" id="win-template">
		<div class="ope_win">
			<div class="ope_win_title"><span>{title}</span><div class="ope_win_close"></div></div>
			<div class="ope_win_content"></div>
		</div>
	</script>
	
	<!-- 模板编写说明 -->
  	<script type="text/template" id="temp-help-template">
		<div style="padding:15px 10px 10px;font-size:14px;">
模板编辑器基于CKEditor，并在此基础上新增了几项功能便于设计模板。新增功能通过在编辑器内右击鼠标访问（所编辑元素为编辑焦点所在元素），分别为：
<ol style="margin:8px 0;line-height: 18px;">
<li><b>设置/取消可拖入构件区域</b>：可设置或取消当前元素为可拖入构件区域，若该项背景为选中色则表示当前元素已设置为可拖入构件，反之为未设置。也可切换到源代码进行查看。
<li><b>编辑样式</b>：可编辑当前元素或其父辈元素的样式。
<li><b>删除元素</b>：可删除当前选中元素（包括其所有子元素）。
<li><b>插入元素</b>：可在当前位置插入一些基本元素。
</ol>
<b>提示</b>：在编辑失误的情况下，可通过编辑器工具栏中的“撤销”或“重做”功能来恢复到原先的编辑状态。
		</div>
	</script>
	<!-- 模板结束 -->
  
  <body style="display:none;">
   <div class="all_background"></div>
   <div id="div_wrap">
  	<div id="templateTree">
  		<div id="template_ope">
			<input id="template_ope_add" class="normal_btn add_btn" type="button" value="新增模板">
			<input id="template_ope_delete" class="normal_btn del_btn" type="button" value="删除模板">
  		</div>
		<ul id="templateTree_ul">
		</ul>
	</div>
	<div id="templateEdit">
		<div class="template_edit_title">编辑区域</div>
		<div style="width: auto; height: auto;">
			<span style="cursor:default;display:inline-block;width:80px;"><span class="txt_must">*</span>模板名称:</span><span style="line-height:12px;" class="txt_info" id="titleEditInfo"></span>
			<br/>
			<input id="titleEdit" class="textInput textInput_n" type="text" maxlength="25">
		</div>
		<div style="width: auto; height: auto;margin-top:12px;">
			<span style="cursor:default;"><span class="txt_must">*</span>模板内容(<a id="temp_help_link" title="查看使用说明"> 查看使用说明 </a>):</span>
			<span class="txt_info" id="contextEditInfo"></span>
			<br/>
			<textarea id="contextEdit" class="textarea_input_text_n"></textarea >
		</div>
		<div style="width: auto; height: auto;margin-top:12px;">
			<span style="cursor:default;">模板简介:</span>
			<span class="txt_info" id="memoEditInfo"></span>
			<br/>
			<textarea id="memoEdit" class="textarea_input_text textarea_input_text_n" maxlength="50" onkeydown='if (this.value.length>200 && event.keyCode != 8){event.returnValue=false}' onpropertychange="if(this.value.length>50){this.value=this.value.substr(0,50)}"></textarea >
		</div>
			<input type="button" id="submitEdit" class="normal_btn" value="提交" />
	</div>
   </div>
  </body>
</html>
