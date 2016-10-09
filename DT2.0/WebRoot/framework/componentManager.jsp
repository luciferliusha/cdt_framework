<%@page import="com.zjcds.portal.config.ConfigManager"%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%
	String style = ConfigManager.getInstance().getSysConfig().getConfigValue("config.styleName");
%>
<!DOCTYPE html>
<html>
  <head>
    
    <title>构件管理</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/css/font-awesome/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/js/libs/easyui/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/js/libs/easyui/themes/icon.css">
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/css/<%=style %>/componentManager.css">
	
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/underscore/underscore-min.js"></script>	
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/backbone/backbone-min.js"></script>
	
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/view/componentManagerView.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/init/initComponentManager.js"></script>
	
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/json2.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/containSpecial.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/framework/common/loadCssFile.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/cookies.js"></script>
	
	<script type="text/javascript">
		//先记录上下文
		var contextPath = "<%=request.getContextPath() %>";
		var style = "<%=style %>";
		var clientHeight = document.documentElement.clientHeight;
		var clientWidth = document.documentElement.clientWidth;
		
		$(function(){
			resize();
			loadCssForCom(contextPath,"componentManager.css");
		});
					
		window.onresize = function(){
		
			resize();
		};
		
		//调整宽和高
			function resize(){
				var clientHeight = document.documentElement.clientHeight;
				var clientWidth = document.documentElement.clientWidth;
				$("#componentEdit").width(clientWidth - $("#componentTree").width() + "px");
				$("#componentTree").height(clientHeight - $("#componentTop").height() - 10 + "px");
			}
	</script>
  </head>
  <body style="display:none;">
	<div id="componentTop">
	<script type="text/template" id="componentTop_template">
		<!--<div id="logo">
			<img id="logo_img" src="../images/top/head-bg-logobutton-n-green.png" style="border: 0px;">
		</div>
		<div class="top-text">构件管理</div>-->
	</script>
	</div>
	<div id="componentManager">
	<script type="text/template" id="componentManager_template">
		<div id="componentTree">
			<ul id="componentTree_ul" class="easyui-tree tree">
			</ul>
		</div>
		<div id="componentEdit">
			<div style="width: auto; height: auto;display: table;position: relative;margin-left: auto;margin-right: auto;">
				<span class="title_span">标题:</span>
				<input id="titleEdit" class="textInput_d" type="text" onkeypress='return ValidateSpecialCharacter();' maxlength="50">
				<span class="text_err"></span>
			</div>
			<div style="width: auto; height: auto;margin-top:20px;display: table;position: relative;margin-left: auto;margin-right: auto;">
				<span class="title_span">内容:</span>
				<input id="contentEdit" class="textInput_d" type="text" maxlength="300">
				<span class="text_err"></span>
			</div>
			<div style="width: auto; height: auto;margin-top:20px;display: table;position: relative;margin-left: auto;margin-right: auto;">
				<span class="title_span">简介:</span>
				<textarea id="describeEdit" class="textarea_input_text_n" maxlength="200" onkeydown='if (this.value.length>200 && event.keyCode != 8){event.returnValue=false}' onpropertychange="if(this.value.length>200){this.value=this.value.substr(0,200)}"></textarea >
				<span class="text_err" style="margin-top:-10px;"></span>
				<div id="submitEdit" class="confirmBtn_n" style="display:none;">提交</div>
			</div>
		</div>
	</script>
	</div>
	
	<!-- 第一层目录操作列表 -->
	<div id="component_menu" class="easyui-menu" style="display: none;">
		<div onclick="appendComponentNode('componentTree_ul')" data-options="iconCls:'icon-add-n icon-plus'">新增</div>
		<div onclick="removeComponentNode('componentTree_ul')" data-options="iconCls:'icon-trash-n icon-trash'">删除</div>
	</div>
  </body>
</html>