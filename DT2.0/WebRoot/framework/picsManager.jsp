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
    <link href="<%=path %>/css/<%=style %>/picsManager.css" rel="stylesheet" type="text/css" />
    
	<!-- JS导入 -->
	<script type="text/javascript" src="<%=path %>/js/libs/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/easyui/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/riot/render.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/isotope/jquery.isotope.min.js"></script>
	<script type="text/javascript" src="<%=path %>/js/libs/imgPreview/zjcds.jquery.imgPreview.js"></script>

	<script type="text/javascript" src="<%=path %>/js/gobal/httpUtil.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/service/picsManageService.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/view/picsManageView.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/main/picsManager.js"></script>
	<script type="text/javascript" src="<%=path %>/js/framework/common/loadCssFile.js"></script>
	<script type="text/javascript" src="<%=path %>/js/cookies.js"></script>

	<script type="text/javascript">
		var path = "<%=path %>";
		var style = "<%=style %>";
		
		$(function(){
			loadCssForCom(path,"picsManager.css");
		});
	</script>
  </head>

  	<!-- 模板文档 -->
  	<!-- 图片信息模板 -->
  	<script type="text/template" id="pic-item-template">
		  	<li id="pic{pic_id}">
				<div class="picDiv">
					<div class="picStyle" style="background-image: url('{pic_n_notForIE8}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{pic_n1}', sizingMethod='scale')">
					</div>
				</div>
				<div class="picSpan" title="{pic_name}">{pic_name}</div>
			</li>
	</script>
	
  	<!-- 窗口模板 -->
  	<script type="text/template" id="pic-win-template">
		<div class="ope_win">
			<div class="ope_win_title"><span>{title}</span><div class="ope_win_close"></div></div>
			<div class="ope_win_content"></div>
		</div>
	</script>
	
  	<!-- 添加图片模板 -->
  	<script type="text/template" id="pic-add-template">
			<form id="pic_add_form" style="padding: 15px;" action="<%=path%>/addPics.do" method="POST" enctype="multipart/form-data" target="pic_add_frame">
				<table border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td width="100"><span class="txt_must">*</span>图片名称</td>
						<td width="270" colspan="2">
							<input id="add_pic_name" class="textInput textInput_n" type="text" maxlength="25" name="pics.picName" />
						</td>
					</tr>
					<tr class="help_message"><td>&nbsp;</td><td colspan="2" class="txt_info" id="add_pic_name_msg">图片名称不能超过25个字！</td></tr>
					<tr>
						<td><span class="txt_must">*</span>图片</td>
						<td width="20"><div class="pic_preview_img" id="add_pic_nor_pre"></div></td>
					</tr>
					<tr>
						<td>&nbsp;</td>
						<td title="仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。">
							<input id="add_pic_normal" type="file"  name="pic" accept="image/jpg,image/jpeg,image/gif,image/png" />
						</td>
					</tr>
					<tr class="help_message"><td>&nbsp;</td><td colspan="2" class="txt_info" id="add_pic_normal_msg">仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。</td></tr>
					<tr>
						<td colspan="3" align="right">
							<input type="button" id="add_cancel" class="cancel_btn" value="取消" />
							<input type="button" id="add_submit" class="normal_btn" style="margin:0 10px; " value="提交" />
						</td>
					</tr>
				</table>
				<iframe name="pic_add_frame" style="display:none;"></iframe>
			</form>	
	</script>
 	<!-- 编辑图片模板 -->
  	<script type="text/template" id="pic-edit-template">
			<form id="pic_edit_form" style="padding: 15px;" action="<%=path%>/updatePics.do" method="POST" enctype="multipart/form-data" target="pic_edit_frame">
				<table border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td width="100"><span class="txt_must">*</span>图片名称</td>
						<td width="270" colspan="2">
							<input id="edit_pic_name" class="textInput textInput_n" value="{pic_name}" type="text" maxlength="25" name="pics.picName" />
						</td>
					</tr>
					<tr class="help_message"><td>&nbsp;</td><td colspan="2" class="txt_info" id="edit_pic_name_msg">图片名称不能超过25个字！</td></tr>
					<tr>
						<td><span class="txt_must">*</span>图片</td>
						<td class="pic_preview_bg"><div class="pic_preview_img" id="edit_pic_nor_pre" style="background-image: url('{pic_n1}');filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{pic_n1}', sizingMethod='scale')"></div></td>
					</tr>
					<tr>
						<td>&nbsp;</td>
						<td title="仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。">
							<input id="edit_pic_normal" type="file"  name="pic" accept="image/jpg,image/jpeg,image/gif,image/png" />
						</td>
					</tr>
					<tr class="help_message"><td>&nbsp;</td><td colspan="2" class="txt_info" id="edit_pic_normal_msg">仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。</td></tr>
					<tr>
						<td colspan="3" align="right">
							<input type="button" id="edit_cancel" class="cancel_btn" value="取消" />
							<input type="button" id="edit_submit" class="normal_btn" style="margin:0 10px; " value="提交" />
						</td>
					</tr>
				</table>
				<input type="hidden" id="edit_pic_id" value="{pic_id}" name="pics.picId">
				<iframe name="pic_edit_frame" style="display:none;"></iframe>
			</form>	
	</script>
  	
	<!-- 模板结束 -->
  <body style="display:none;">
  	<div class="all_background"></div>
  	<div class="pic_config">
		<div id="pic_title">
			<input id="pic_add" class="normal_btn add_btn" type="button" value="新增图片"/>
			<input id="pic_delete" class="normal_btn del_btn" type="button" value="删除图片"/>
		</div>
		<div id="pic_content">
			<ul id="pic_list"></ul>
		</div>
  	</div>
  </body>
</html>
