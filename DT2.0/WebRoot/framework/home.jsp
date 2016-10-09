<!-- 
 CDTV2.1 首页面
 @author linj 
-->
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%
String path = request.getContextPath();
%>
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    
    <!-- CSS导入 -->
    <link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/css/home.css">
	<!-- JS导入 -->
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/framework/main/main.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/framework/view/homeView.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/framework/view/paginationView.js"></script>
	<script type="text/javascript">
		var path = "<%=path %>";
	</script>
  </head>

  	<!-- 模板文档 -->
	<!-- 首页分页滚动模板 -->
	<script type="text/template" id="page_button_template">
		<div id="pre_page" class="pre_page"></div>
		<div id="next_page" class="next_page"></div>
		<div id="page_number" class="page_number" align="center">
		</div>
	</script>
	<!-- 模板结束 -->
  
  <body>
  	<!--主界面 -->
  	<div class="main_div">
	</div>
  </body>
</html>
