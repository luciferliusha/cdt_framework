<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title></title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page" />
		<link href="<%=request.getContextPath() %>/css/admin/main.css" rel="stylesheet" type="text/css">
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/jquery/jquery-1.7.2.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/underscore/underscore-min.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/backbone/backbone-min.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/resize.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/util.js"></script>
		<!-- backbone.js -->
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/view/admin/mainView.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath() %>/js/main/admin/main.js"></script>
	</head>

	<body>
	  <!-- top层 -->
		<div id="top">
		   <script type="text/template" id="top_template">
			<div id="logo">
				<img
					src="<%=request.getContextPath()%>/images/top/head-bg-logobutton-n-green.png">
			</div>
			<div id="setting"></div>
           </script>
		</div>
		
	    <div id="manager">
	        <!-- 按钮切换 -->
	      <script type="text/template" id="manager_template">
	        <div class="change_state">
	           <div class="solution">解决方案</div>
	           <div class="component">构件组</div>
	        </div>
	        <div class="solutions_search">
				<label id="solutions_lab_search" class="solutions_lab_search">搜索解决方案</label>
				<input id="solutions_search" type="text">
			</div>
          </script>
	    </div>
	    
	    <div id="app_group">
	      <script type="text/template" id="app_group_template">
	         <div id="app1" class="app_group_title">
	            <div style="margin-top: 8px; width: 200px;float: left;"><span >Apps测试-01</span></div> 
	             <div class="number_marked_n">4</div>
	         </div>
	         <div id="app2" class="app_group_title">
	             <div style="margin-top: 8px;width: 200px;float: left;"><span >Apps测试-02</span></div> 
	             <div class="number_marked_n">4</div>
	         </div>
	         <div id="app3" class="app_group_title">
	             <div style="margin-top: 8px;width: 200px;float: left;"><span >Apps测试-03</span></div> 
	             <div class="number_marked_n">4</div>
	         </div>
	         <div id="app4" class="app_group_title">
	             <div style="margin-top: 8px;width: 200px;float: left"><span >Apps测试-04</span></div> 
	             <div class="number_marked_n">4</div>
	         </div>
          </script>
	    </div>
	    
	    <div id="solution_group">
	     <script type="text/template" id="solution_group_template">
	      <div id="solution1" class="solution_group_title" style="margin-top: 10px;">
	           <div style="margin-top: 8px;width: 220px; float: left;"><span>解决方案a小组-测试1</span></div> 
	           <div class="number_marked_n">4</div>
	      </div>
	      <div id="solution2" class="solution_group_title">
	           <div style="margin-top: 8px;width: 220px; float: left;"><span>解决方案a小组-测试2</span></div> 
	           <div class="number_marked_n">4</div>
	      </div>
	      <div id="solution3" class="solution_group_title">
	           <div style="margin-top: 8px;width: 220px; float: left;"><span>解决方案a小组-测试3</span></div> 
	           <div class="number_marked_n">4</div>
	      </div>
	      <div id="solution4" class="solution_group_title">
	           <div style="margin-top: 8px;width: 220px; float: left;"><span>解决方案a小组-测试4</span></div> 
	           <div class="number_marked_n">4</div>
	      </div>
         </script>
	    </div>
	    <div id="solutions_list">
	     
	    </div>
	</body>
</html>
