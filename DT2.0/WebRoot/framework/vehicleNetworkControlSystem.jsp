<%@page import="com.zjcds.portal.config.ConfigManager"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String style = ConfigManager.getInstance().getSysConfig().getConfigValue("config.styleName");
%>

<!DOCTYPE HTML>
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>配置项管理</title>
    
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<link rel="stylesheet" href="<%=path %>/js/libs/easyui/themes/default/easyui.css" type="text/css">
	<link rel="stylesheet" href="<%=path %>/js/libs/easyui/themes/icon.css" type="text/css">
	<link rel="stylesheet" href="<%=path %>/css/<%=style %>/vehicleNetworkControlSystem.css" type="text/css">

	<script type="text/javascript" src="<%=path %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="<%=path %>/js/gobal/httpUtil.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/vehicleNetworkControlSystem.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/service/vehicleNetworkControlSystemService.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/common/loadCssFile.js"></script>
	<script type="text/javascript" src="<%=path %>/js/cookies.js"></script>
  	
  	<script type="text/javascript">
  		var path = "<%=path %>";
  		var style = "<%=style %>";
		
		$(function(){
			loadCssForCom(path,"vehicleNetworkControlSystem.css");
		});
  	</script>
  	
  	<script type="text/template" id="vehicleSystem_template">
		<div class="vehicleSystem">
			<table>
				<tr style="height: 28px;">
					<td style="width: 54px;">参数名称</td>
					<td><input class="nameCn textInput textInput_n window_texInput"/></td>
					<td style="width: 54px;padding-left: 50px;">英文名称</td>
					<td><input class="nameEn textInput textInput_n window_texInput"/></td>
				</tr>
				<tr style="height: 28px;">
					<td>参数类型</td>
					<td>
						<select class="paramTypeId" class="easyui-combobox" name="dept" style="width:200px;">
						</select>
					</td>
					<td style="padding-left: 50px;">参数值</td>
					<td><input class="paramValue textInput textInput_n window_texInput" maxlength="9"/></td>
				</tr>
				<tr style="height: 28px;">
					<td>数据类型</td>
					<td>
						<select class="dataTypeId" class="easyui-combobox" name="dept" style="width:200px;">
						</select>
					</td>
					<td style="padding-left: 50px;">启用标识</td>
					<td>
						<select class="enabledFlag" class="easyui-combobox" name="dept" style="width:200px;">
						</select>
					</td>
				</tr>
				<tr>
					<td style="width: 48px;vertical-align: top;">描述</td>
					<td colspan='3'><textarea class="describe textarea_input_text textarea_input_text_n"></textarea></td>
				</tr>
			</table>
			<div id="vehicleWindow" style="width: 563px;">
				<div class="button-small button-small-01-n vehicleBtn" onclick="closeVehicleInfo()" type="button" style="border-radius:5px; cursor:pointer;float: right;background-size:80px 27px;" value="关闭">关闭</div>
				<div class="button-small button-small-01-n vehicleBtn" onclick="saveVehicleInfo()" type="button" style="border-radius:5px; cursor:pointer;float: right;background-size:80px 27px;margin-right:5px;" value="保存">保存</div>
			</div>
		</div>
	</script>
	<script type="text/template" id="vehicleSystemdetail_template">
		<div class="vehicleSystem">
			<table style="width: 563px;height:90px;" border="0" cellpadding="2" cellspacing="0" class="tabledetail">
				<tr>
					<td style="width:60px;background: #cccccc;">参数名称</td>
					<td style="width:200px;height:22px;" class="nameCn"></td>
					<td style="width:60px;background: #cccccc;">英文名称</td>
					<td style="width:200px;height:22px;" class="nameEn"></td>
				</tr>
				<tr>
					<td style="background: #cccccc;">参数类型</td>
					<td style="width:200px;height:22px;" class="paramTypeId"></td>
					<td style="background: #cccccc;">参数值</td>
					<td style="width:200px;height:22px;" class="paramValue"></td>
				</tr>
				<tr>
					<td style="background: #cccccc;">数据类型</td>
					<td style="width:200px;height:22px;" class="dataTypeId"></td>
					<td style="background: #cccccc;">启用标识</td>
					<td style="width:200px;height:22px;" class="enabledFlag"></td>
				</tr>
				<tr>
					<td style="width: 45px;vertical-align: top;background: #cccccc;">描述</td>
					<td colspan='3' style="width:499px;height:100px;vertical-align: top;" class="describe"></td>
				</tr>
			</table>
			<div id="vehicleWindow" style="width: 563px;">
				<div onclick="closeVehicleInfo()" class="button-small button-small-01-n vehicleBtn" type="button" style="border-radius:5px; cursor:pointer;float: right;" value="关闭">关闭</div>
			</div>
		</div>
	</script>
  	
  </head>
  
  <body style="display:none;">
  	<div class="all_background"></div>
  	<div class="personal_recent_activity_div">
		<div id="personal_recent_activity_query_div">
			<table class="personal_recent_activity_query_table" border="0"  cellpadding="0" cellspacing="0" style="padding: 5px 10px;">
				<tr>
					<td>参数名称：</td><td><input type="text" class="textInput textInput_n" name="optTimeStart" id="optTimeStart"/></td>
					<td style="padding-left: 10px;">英文名称：</td><td><input class="textInput textInput_n" type="text" name="optTimeEnd" id="optTimeEnd"/></td>
					<td><div id="pra_query_btn" class="button-small button-small-01-n" style="margin-left: 10px;">查询</div><div id="pra_reset_btn" class="button-small button-small-01-n" style="margin-left: 10px;">重置</div></td>
				</tr>
			</table>
		</div>
		<div id="toolbar">  
	        <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-add" plain="true" onclick="newVehicleInfo()">添加</a>  
<!-- 	    <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-edit" plain="true" onclick="editVehicleInfo()">修改预警信息</a>   -->
	        <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-remove" plain="true" onclick="destroyVehicleInfo()">删除</a>
	    </div>
		<div id="personal_recent_activity_result_div">
		</div>
	</div>
  </body>
</html>
