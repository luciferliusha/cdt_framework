<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String reqData = request.getParameter("data");
%>
<!DOCTYPE html>
<html>
  <head>
    
    <title>嘉善县综合交通信息平台</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/js/libs/easyui/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/js/libs/easyui/themes/icon.css">
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/css/index.css">
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/css/login.css">
	
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/cookies.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/util.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/name_limit.js"></script>
	
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/underscore/underscore-min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/libs/backbone/backbone-min.js"></script>
	
	<!-- backbone.js -->
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/gobal/httptools.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/common/json2.js"></script>
	
	<script type="text/javascript">
	
		var reqData = <%=reqData %>;
		//监听postMessage消息事件 
		if (typeof window.addEventListener != 'undefined') {
			window.addEventListener('message', onMessage, false);
		}
		else if (typeof window.attachEvent != 'undefined') {
			window.attachEvent('onmessage', onMessage);
		}
	
		/** 传递消息 */
		function sendMessage2() {
			if (self.parent.frames.length > 0) {//在DT框架下
				var nameValue = $('#name').val();
				//数据结构必须遵循{message:"",data:传递的数据参数}，其中的data的数据格式为{name:"解决方案名称"}
				var data = {message:'SELECT_SOLUTION', data:{name:nameValue}};
				//传递到CDT中请先转换为字符串
				window.parent.postMessage((JSON2.stringify(data)), "*");
			}
		}
	
		/** 传递消息 */
		function sendMessage() {
			var area = $('#cc').combobox('getText');
			if (/*this.name &&*/ typeof window.parent != "undefined" && typeof window.parent.postMessage != "undefined") {
				//var data = {name:this.name, data:area};
				var data = {message:'POST_PANEL_MESSAGE', data:area};
				window.parent.postMessage(JSON2.stringify(data), "*");
			}
		}
		/** 接收消息 */
		function onMessage(e) {
			var data = e.data;
			$("#receiveData").html("接收到的消息：" + data /*+ " " + JSON2.parse(data).appId*/);
		};
		
		$(function(){
			if (reqData) {
				$("#receiveData").html(reqData.appId);
			}
		});
</script>
  </head>
  <body onSelectStart="return(event.srcElement.type=='text')">
	<div id="receiveDiv" style="border-bottom: #000000 solid 1px;"><span id="receiveData"></span></div>
	<div><select id="cc" class="easyui-combobox" name="state" style="width:200px;" required="true">
		<option value="hangzhou">杭州</option>
		<option value="ningbo">宁波</option>
		<option value="wenzhou">温州</option>
		</select><input type="button" value="提交" onclick="sendMessage()"/></div>
	<div>
		<input id="name" value="权限管理"/>
		<a id="changeMenu" onclick="sendMessage2()">点击我切换到</a>
	</div>
  </body>
</html>
