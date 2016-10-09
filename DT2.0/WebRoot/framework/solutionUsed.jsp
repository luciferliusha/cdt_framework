<%@page import="com.zjcds.portal.config.ConfigManager"%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%
String path = request.getContextPath();
String style = ConfigManager.getInstance().getSysConfig().getConfigValue("config.styleName");
%>
<!DOCTYPE HTML>
<html>
  <head>
    <title></title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <!-- CSS导入 -->
    <link href="<%=path %>/js/libs/easyui/themes/default/easyui.css" rel="stylesheet" type="text/css">
	<link href="<%=path %>/js/libs/easyui/themes/icon.css" rel="stylesheet" type="text/css">
    <link href="<%=path %>/css/<%=style %>/solutionUsed.css" rel="stylesheet" type="text/css" />
    <link href="<%=path %>/css/framework_all.css" rel="stylesheet" type="text/css" />
    <link href="<%=path %>/css/framework_default.css" rel="stylesheet" type="text/css" />
    
	<!-- JS导入 -->	
	<script type="text/javascript" src="<%=path %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=path %>/js/common/name_limit.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/highcharts/highcharts.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/highcharts/cds_highcharts.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/riot/render.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/isotope/jquery.isotope.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/My97DatePicker/WdatePicker.js"></script>

	<script type="text/javascript" src="<%=path %>/js/gobal/httpUtil.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/service/solutionUsedService.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/solutionUsedView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/main/solutionUsed.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/common/loadCssFile.js"></script>
	<script type="text/javascript" src="<%=path %>/js/cookies.js"></script>	

	<script type="text/javascript">
		var path = "<%=path %>";
		var style = "<%=style %>";
		window.onresize = function() {
			$("#solutionUsedGrid").datagrid("resize", {height:307});
			var chart = $('#solutionUsedPie').highcharts();
			if(chart != null){
				chart.setSize($(".main").width()*0.49-1,305);
			}
		};
	</script>
  </head>

  	<!-- 模板文档 -->
  	
	<!-- 模板结束 -->
  
  <body style="display:none;">
  	<div class="main">
  		<ul id="search-condition">
  		<!-- 
  			<li><span>用户:</span>
  			<input type="text"/></li>
  			<li><span>构件名称:</span>
  			<input type="text"/></li>
  		-->
  			<li><span>开始时间:</span>
  			<input id="logTimeStart" type="text" class="easyui-validatebox Wdate" value="" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',errDealMode:1})" style="height:21px;"/></li>
  			<li><span>截止时间:</span>
  			<input id="logTimeEnd" type="text" class="easyui-validatebox Wdate" value="" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',errDealMode:1})" style="height:21px;"/></li>
  			<li><input type="button" value="搜索" class="search-button buttonX buttonX-n" id="solutionUsedSearch"/></li>
  		</ul>
	  	<div id="gridDiv">
	  		<div class="panel_title">
	  			<div class="panel_title_content">解决方案使用情况一览</div>
	  		</div>
	  		<div id="solutionUsedGrid"></div>
	  	</div>
	  	<div class="v_space"></div>
	  	<div id="pieDiv">
	  		<div class="panel_title">
	  			<div class="panel_title_content">解决方案使用情况占比</div>
	  		</div>
			<div id="solutionUsedPie">
			</div>
		</div>
	</div>
  </body>
</html>
