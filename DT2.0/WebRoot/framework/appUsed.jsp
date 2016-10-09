<%@page import="com.zjcds.portal.config.ConfigManager"%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%
String path = request.getContextPath();
%>
<!DOCTYPE HTML>
<html>
  <head>
    <title></title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <!-- CSS导入 -->
    <link href="<%=path %>/js/libs/easyui/themes/default/easyui.css" rel="stylesheet" type="text/css">
	<link href="<%=path %>/js/libs/easyui/themes/icon.css" rel="stylesheet" type="text/css">
    <link href="<%=path %>/css/appUsed.css" rel="stylesheet" type="text/css" />
    
	<!-- JS导入 -->
	<script type="text/javascript" src="<%=path %>/js/common/name_limit.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/highcharts/highcharts.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/highcharts/cds_highcharts.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/riot/render.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/isotope/jquery.isotope.min.js"></script>

	<script type="text/javascript" src="<%=path %>/js/gobal/httpUtil.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/service/appUsedService.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/appUsedView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/main/appUsed.js"></script>

	<script type="text/javascript">
		var path = "<%=path %>";
		window.onresize = function() {
			$("#appUsedGrid").datagrid("resize", {height:307});
			var chart = $('#appUsedPie').highcharts();
			if(chart != null){
				chart.setSize($(".main").width()*0.49-1,305);
			}
		};
	</script>
  </head>

  	<!-- 模板文档 -->
  	
	<!-- 模板结束 -->
  
  <body>
  	<div class="main">
	  	<div id="gridDiv">
	  		<div class="panel_title">
	  			<div class="panel_title_content">构件使用情况一览</div>
	  		</div>
	  		<div id="appUsedGrid"></div>
	  	</div>
	  	<div class="v_space"></div>
	  	<div id="pieDiv">
	  		<div class="panel_title">
	  			<div class="panel_title_content">构件使用情况占比</div>
	  		</div>
			<div id="appUsedPie">
			</div>
		</div>
	</div>
  </body>
</html>
