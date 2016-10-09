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
    <link href="<%=path %>/css/<%=style %>/iconsManager.css" rel="stylesheet" type="text/css" />
    
	<!-- JS导入 -->
	<script type="text/javascript" src="<%=path %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/riot/render.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/isotope/jquery.isotope.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/imgPreview/zjcds.jquery.imgPreview.js"></script>

	<script type="text/javascript" src="<%=path %>/js/gobal/httpUtil.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/service/iconManageService.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/iconsManageView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/main/iconsManager.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/common/loadCssFile.js"></script>
	<script type="text/javascript" src="<%=path %>/js/cookies.js"></script>

	<script type="text/javascript">
		var path = "<%=path %>";
		var style = "<%=style %>";
		
		$(function(){
			loadCssForCom(path,"iconsManager.css");
		});
	</script>
  </head>

  	<!-- 模板文档 -->
  	<!-- 图标信息模板 -->
  	<script type="text/template" id="icon-item-template">
		  	<li id="icon{icon_id}">
				<div class="iconDiv">
					<div class="iconStyle" style="background-image: url('{icon_n1}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{icon_n1}', sizingMethod='scale')">
					</div>
					<div class="iconStyle" style="background-image: url('{icon_s1}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{icon_s1}', sizingMethod='scale')">
					</div>
				</div>
				<div class="iconSpan" title="{icon_name}">{icon_name}</div>
			</li>
	</script>
	
  	<!-- 窗口模板 -->
  	<script type="text/template" id="icon-win-template">
		<div class="ope_win">
			<div class="ope_win_title"><span>{title}</span><div class="ope_win_close"></div></div>
			<div class="ope_win_content"></div>
		</div>
	</script>
	
  	<!-- 添加图标模板 -->
  	<script type="text/template" id="icon-add-template">
			<form id="icon_add_form" style="padding: 15px;" action="<%=path%>/addIcons.do" method="POST" enctype="multipart/form-data" target="icon_add_frame">
				<table border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td width="100"><span class="txt_must">*</span>图标名称</td>
						<td width="270" colspan="2">
							<input id="add_icon_name" class="textInput textInput_n" type="text" maxlength="25" name="icons.iconName" />
						</td>
					</tr>
					<tr class="help_message"><td>&nbsp;</td><td colspan="2" class="txt_info" id="add_icon_name_msg">图标名称不能超过25个字！</td></tr>
					<tr>
						<td><span class="txt_must">*</span>常态图标</td>
						<td width="20"><div class="icon_preview_img" id="add_icon_nor_pre"></div></td>
						<td title="仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。">
							<input id="add_icon_normal" type="file"  name="iconNormal" accept="image/jpg,image/jpeg,image/gif,image/png" />
						</td>
					</tr>
					<tr class="help_message"><td>&nbsp;</td><td colspan="2" class="txt_info" id="add_icon_normal_msg">仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。</td></tr>
					<tr>
						<td><span class="txt_must">*</span>选中图标</td>
						<td><div class="icon_preview_img" id="add_icon_sel_pre"></div></td>
						<td title="仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。">
							<input id="add_icon_selected" type="file" name="iconSelected" accept="image/jpg,image/jpeg,image/gif,image/png" />
						</td>
					</tr>
					<tr class="help_message"><td>&nbsp;</td><td colspan="2" class="txt_info" id="add_icon_selected_msg">仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。</td></tr>
					<tr>
						<td colspan="3" align="right">
							<input type="button" id="add_cancel" class="cancel_btn" value="取消" />
							<input type="button" id="add_submit" class="normal_btn" style="margin:0 10px; " value="提交" />
						</td>
					</tr>
				</table>
				<iframe name="icon_add_frame" style="display:none;"></iframe>
			</form>	
	</script>
 	<!-- 编辑图标模板 -->
  	<script type="text/template" id="icon-edit-template">
			<form id="icon_edit_form" style="padding: 15px;" action="<%=path%>/updateIcons.do" method="POST" enctype="multipart/form-data" target="icon_edit_frame">
				<table border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td width="100"><span class="txt_must">*</span>图标名称</td>
						<td width="270" colspan="2">
							<input id="edit_icon_name" class="textInput textInput_n" value="{icon_name}" type="text" maxlength="25" name="icons.iconName" />
						</td>
					</tr>
					<tr class="help_message"><td>&nbsp;</td><td colspan="2" class="txt_info" id="edit_icon_name_msg">图标名称不能超过25个字！</td></tr>
					<tr>
						<td><span class="txt_must">*</span>常态图标</td>
						<td class="icon_preview_bg"><div class="icon_preview_img" id="edit_icon_nor_pre" style="background-image: url('{icon_n1}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{icon_n1}', sizingMethod='scale')"></div></td>
						<td title="仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。">
							<input id="edit_icon_normal" type="file"  name="iconNormal" accept="image/jpg,image/jpeg,image/gif,image/png" />
						</td>
					</tr>
					<tr class="help_message"><td>&nbsp;</td><td colspan="2" class="txt_info" id="edit_icon_normal_msg">仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。</td></tr>
					<tr>
						<td><span class="txt_must">*</span>选中图标</td>
						<td class="icon_preview_bg"><div class="icon_preview_img" id="edit_icon_sel_pre" style="background-image: url('{icon_s1}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{icon_s1}', sizingMethod='scale')"></td>
						<td title="仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。">
							<input id="edit_icon_selected" type="file" name="iconSelected" accept="image/jpg,image/jpeg,image/gif,image/png" />
						</td>
					</tr>
					<tr class="help_message"><td>&nbsp;</td><td colspan="2" class="txt_info" id="edit_icon_selected_msg">仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。</td></tr>
					<tr>
						<td colspan="3" align="right">
							<input type="button" id="edit_cancel" class="cancel_btn" value="取消" />
							<input type="button" id="edit_submit" class="normal_btn" style="margin:0 10px; " value="提交" />
						</td>
					</tr>
				</table>
				<input type="hidden" id="edit_icon_id" value="{icon_id}" name="icons.iconId">
				<iframe name="icon_edit_frame" style="display:none;"></iframe>
			</form>	
	</script>
  	
	<!-- 模板结束 -->
  <body style="display:none;">
  	<div class="all_background"></div>
  	<div class="icon_config">
		<div id="icon_title">
			<input id="icon_add" class="normal_btn add_btn" type="button" value="新增图标"/>
			<input id="icon_delete" class="normal_btn del_btn" type="button" value="删除图标"/>
		</div>
		<div id="icon_content">
			<ul id="icon_list"></ul>
		</div>
  	</div>
  </body>
</html>
