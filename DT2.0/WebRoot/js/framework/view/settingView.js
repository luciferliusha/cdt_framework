/**
 * 系统配置管理VIEW
 */

function SettingView(){

	var _logoPath = "";
	var settingService = new SettingService();

	var initTemplate = function() {
		$("#sys_setting_area").append($.render($("#sys-config-template").html(), sysSettingData));		
		initFrontPage();
		initSelectedStyle();
		addEvent();
	};
	
	/**
	 * 初始化是否显示首页和首页访问方式
	 * @returns
	 */
	var initFrontPage = function(){
		if(checkBrowserVersions()){//浏览器版本小于等于IE8
			$("#sys_setting_area").append($("#front-page-ie8-template").html());
			if(frontPage){//显示首页
				$("#show-front-page-label").addClass("switch-label-selected");
				$("#front-page-switch .switch-selection").css("left","2px");
			}
			else{//隐藏首页
				$("#hide-front-page-label").addClass("switch-label-selected");
				$("#front-page-switch .switch-selection").css("left","134px");
				$("#front-page-access-li").hide();
			}
			if(frontPageAccess == 0){//所有解决方案
				$("#front-page-access-all-label").addClass("switch-label-selected");
				$("#front-page-access-switch .switch-selection").css("left","2px");
			}
			else if(frontPageAccess == 1){//第一层解决方案(组)
				$("#front-page-access-first-label").addClass("switch-label-selected");
				$("#front-page-access-switch .switch-selection").css("left","134px");
			}
		}
		else{
			$("#sys_setting_area").append($("#front-page-template").html());
			if(frontPage){//显示首页
				$("#show-front-page").attr("checked","checked");
			}
			else{//隐藏首页
				$("#hide-front-page").attr("checked","checked");
				$("#front-page-access-li").hide();
			}
			if(frontPageAccess == 0){//所有解决方案
				$("#front-page-access-all").attr("checked","checked");
			}
			else if(frontPageAccess == 1){//第一层解决方案(组)
				$("#front-page-access-first").attr("checked","checked");
			}
		}		
	};
	
	/**
	 * 初始化选中风格样式
	 * @returns
	 */
	var initSelectedStyle = function(){
		$("#style-list li a.color-" + style).addClass("icon-ok");
	};
	
	var addEvent = function() {
		var _systemName;
		//系统名称修改
		$("#modifySystemName").unbind().bind('click',function() {
			if (isIE) {//IE下需要去掉<br/>，火狐下需要<br/>，不然删除完内容后高度会变小
				$("#systemNameDiv").text($("#systemNameDiv").text());
			}
			$("#systemNameDiv").attr("contenteditable", "true");
			$("#systemNameDiv").addClass("content_editable");
			$("#systemNameDiv").focus();
			$(this).hide();
			$("#saveSystemName").show();
			$("#cancelSystemName").show();
			_systemName = $.trim($("#systemNameDiv").text());
		});
		//保存
		$("#saveSystemName").unbind().bind('click',function() {	
			$("#systemNameTip").hide();
			var systemName = $.trim($("#systemNameDiv").text());
			if (systemName != "") {
				settingService.updateInfo({data:JSON2.stringify({systemName:systemName})}, function() {
					systemNameDone();
				});
			}
			else {
				$("#systemNameTip").show();
				$("#systemNameTip").text("请填写系统名称!");
			}
		});
		//取消
		$("#cancelSystemName").unbind().bind('click',function() {
			$("#systemNameTip").hide();
			$("#systemNameDiv").text(_systemName);
			systemNameDone();
		});

		var _systemNameFont;
		//系统名称字体修改
		$("#modifySystemNameFont").unbind().bind('click',function() {
			if (isIE) {//IE下需要去掉<br/>，火狐下需要<br/>，不然删除完内容后高度会变小
				$("#systemNameFontDiv").text($("#systemNameFontDiv").text());
			}
			$("#systemNameFontDiv").attr("contenteditable", "true");
			$("#systemNameFontDiv").addClass("content_editable");
			$("#systemNameFontDiv").focus();
			$(this).hide();
			$("#saveSystemNameFont").show();
			$("#cancelSystemNameFont").show();
			_systemNameFont = $.trim($("#systemNameFontDiv").text());
		});
		//保存
		$("#saveSystemNameFont").unbind().bind('click',function() {	
			$("#systemNameFontTip").hide();
			var systemNameFont = $.trim($("#systemNameFontDiv").text());
			if (systemNameFont != "") {
				if (!RegExp("^[0-9]*$").test(systemNameFont)) {
					$("#systemNameFontTip").show();
					$("#systemNameFontTip").text("系统名称字体大小只能输入数字!");
				}
				else {
					settingService.updateInfo({data:JSON2.stringify({systemNameFontSize:systemNameFont+"px"})}, function() {
						systemNameFontDone();
					});
				}
			}
			else {
				$("#systemNameFontTip").show();
				$("#systemNameFontTip").text("请填写系统名称字体大小!");
			}
		});
		//取消
		$("#cancelSystemNameFont").unbind().bind('click',function() {
			$("#systemNameFontTip").hide();
			$("#systemNameFontDiv").text(_systemNameFont);
			systemNameFontDone();
		});
		
		//
		var _logoWidth;
		var _logoHeight;
		//LOGO图片宽高修改
		$("#modifySystemLogoPro").unbind().bind('click',function(){
			if (isIE) {//IE下需要去掉<br/>，火狐下需要<br/>，不然删除完内容后高度会变小
				$("#logoWidthDiv").text($("#logoWidthDiv").text());
				$("#logoHeightDiv").text($("#logoHeightDiv").text());
				$("#logoWidthDiv").css("margin-bottom", "2px");
			}
			$("#logoWidthDiv").attr("contenteditable", "true");
			$("#logoWidthDiv").addClass("span_content_editable");
			$("#logoHeightDiv").attr("contenteditable", "true");
			$("#logoHeightDiv").addClass("span_content_editable");
			$("#logoWidthDiv").focus();
			$(this).hide();
			$("#saveLogoPro").show();
			$("#cancelLogoPro").show();
			_logoWidth = $.trim($("#logoWidthDiv").text());
			_logoHeight = $.trim($("#logoHeightDiv").text());
		});
		//保存
		$("#saveLogoPro").unbind().bind('click',function() {
			var hasError = false;
			$("#logoWidthTip").hide();
			$("#logoHeightTip").hide();
			var logoWidth = $.trim($("#logoWidthDiv").text());
			var logoHeight = $.trim($("#logoHeightDiv").text());
			if (logoWidth != "") {
				if (!RegExp("^[0-9]*$").test(logoWidth)) {
					$("#logoWidthTip").show();
					$("#logoWidthTip").text("宽度只能输入数字!");
					hasError = true;
				}
			}
			else {
				$("#logoWidthTip").show();
				$("#logoWidthTip").text("请填写宽度!");
				hasError = true;
			}
			if (logoHeight != "") {
				if (!RegExp("^[0-9]*$").test(logoHeight)) {
					$("#logoHeightTip").show();
					$("#logoHeightTip").text("高度只能输入数字!");
					hasError = true;
				}
			}
			else {
				$("#logoHeightTip").show();
				$("#logoHeightTip").text("请填写高度!");
				hasError = true;
			}
			if (!hasError) {
				settingService.updateInfo({data:JSON2.stringify({topWidth:logoWidth+"px", topHeight:logoHeight+"px"})}, function() {
					logoWidthHeightDone();
					topWidth = logoWidth;
					topHeight = logoHeight;
					$("#logo_img").css("width", topWidth);
					$("#logo_img").css("height", topHeight);
					if ($("#logo_img").children().length == 1) {//如果有预览的图片，也跟着一起修改
						var _pre = $("#logo_img").children().eq(0);
						_pre.css("width", topWidth);
						_pre.css("height", topHeight);
					}
				});
			}
		});
		//取消
		$("#cancelLogoPro").unbind().bind('click',function() {
			$("#logoWidthTip").hide();
			$("#logoWidthDiv").text(_logoWidth);
			$("#logoHeightTip").hide();
			$("#logoHeightDiv").text(_logoHeight);
			logoWidthHeightDone();
		});
		
		//
		var _logoMarginTop;
		var _logoMarginLeft;
		//LOGO图片样式修改
		$("#modifyLogoStyle").unbind().bind('click',function(){
			if (isIE) {//IE下需要去掉<br/>，火狐下需要<br/>，不然删除完内容后高度会变小
				$("#logoMarginTopDiv").text($("#logoMarginTopDiv").text());
				$("#logoMarginLeftDiv").text($("#logoMarginLeftDiv").text());
				$("#logoMarginTopDiv").css("margin-bottom", "2px");
			}
			$("#logoMarginTopDiv").attr("contenteditable", "true");
			$("#logoMarginTopDiv").addClass("span_content_editable");
			$("#logoMarginLeftDiv").attr("contenteditable", "true");
			$("#logoMarginLeftDiv").addClass("span_content_editable");
			$("#logoMarginTopDiv").focus();
			$(this).hide();
			$("#saveLogoStyle").show();
			$("#cancelLogoStyle").show();
			_logoMarginTop = $.trim($("#logoMarginTopDiv").text());
			_logoMarginLeft = $.trim($("#logoMarginLeftDiv").text());
		});
		//保存
		$("#saveLogoStyle").unbind().bind('click',function() {
			var hasError = false;
			$("#logoTopTip").hide();
			$("#logoLeftTip").hide();
			var logoMarginTop = $.trim($("#logoMarginTopDiv").text());
			var logoMarginLeft = $.trim($("#logoMarginLeftDiv").text());
			if (logoMarginTop != "") {
				if (!RegExp("^[0-9]*$").test(logoMarginTop)) {
					$("#logoTopTip").show();
					$("#logoTopTip").text("上边距只能输入数字!");
					hasError = true;
				}
			}
			else {
				$("#logoTopTip").show();
				$("#logoTopTip").text("请填写上边距!");
				hasError = true;
			}
			if (logoMarginLeft != "") {
				if (!RegExp("^[0-9]*$").test(logoMarginLeft)) {
					$("#logoLeftTip").show();
					$("#logoLeftTip").text("左边距只能输入数字!");
					hasError = true;
				}
			}
			else {
				$("#logoLeftTip").show();
				$("#logoLeftTip").text("请填写左边距!");
				hasError = true;
			}
			if (!hasError) {
				settingService.updateInfo({data:JSON2.stringify({topMarginTop:logoMarginTop+"px", topMarginLeft:logoMarginLeft+"px"})}, function() {
					logoStyleDone();
				});
			}
		});
		//取消
		$("#cancelLogoStyle").unbind().bind('click',function() {
			$("#logoTopTip").hide();
			$("#logoMarginTopDiv").text(_logoMarginTop);
			$("#logoLeftTip").hide();
			$("#logoMarginLeftDiv").text(_logoMarginLeft);
			logoStyleDone();
		});
		
		var _rightName;
		//版权信息修改
		$("#modifyRightName").unbind().bind('click',function(){
			if (isIE) {//IE下需要去掉<br/>，火狐下需要<br/>，不然删除完内容后高度会变小
				$("#rightNameDiv").text($("#rightNameDiv").text());
			}
			$("#rightNameDiv").attr("contenteditable", "true");
			$("#rightNameDiv").addClass("content_editable");
			$("#rightNameDiv").focus();
			$(this).hide();
			$("#saveRightName").show();
			$("#cancelRightName").show();
			_rightName = $.trim($("#rightNameDiv").text());
		});
		//保存
		$("#saveRightName").unbind().bind('click',function() {	
			$("#rightNameTip").hide();
			var rightName = $.trim($("#rightNameDiv").text());
			if (rightName != "") {
				if(rightName.indexOf("<script>")!=-1||rightName.indexOf("</script>")!=-1){
					$("#rightNameTip").show();
					$("#rightNameTip").text("版权信息包含特殊字符!");
				}else{
					settingService.updateInfo({data:JSON2.stringify({rightName:rightName})}, function() {
						rightNameDone();
					});
				}
			}
			else {
				$("#rightNameTip").show();
				$("#rightNameTip").text("请填写版权信息!");
			}
		});
		//取消
		$("#cancelRightName").unbind().bind('click',function() {
			$("#rightNameTip").hide();
			$("#rightNameDiv").text(_rightName);
			rightNameDone();
		});

		//
		var _techniqueName;
		//技术支持修改
		$("#modifyTechniqueName").unbind().bind('click',function(){
			if (isIE) {//IE下需要去掉<br/>，火狐下需要<br/>，不然删除完内容后高度会变小
				$("#techniqueNameDiv").text($("#techniqueNameDiv").text());
			}
			$("#techniqueNameDiv").attr("contenteditable", "true");
			$("#techniqueNameDiv").addClass("content_editable");
			$("#techniqueNameDiv").focus();
			$(this).hide();
			$("#saveTechniqueName").show();
			$("#cancelTechniqueName").show();
			_techniqueName = $.trim($("#techniqueNameDiv").text());
		});
		//保存
		$("#saveTechniqueName").unbind().bind('click',function() {	
			$("#techniqueNameTip").hide();
			var techniqueName = $.trim($("#techniqueNameDiv").text());
			if (techniqueName != "") {
				if(techniqueName.indexOf("<script>")!=-1||techniqueName.indexOf("</script>")!=-1){
					$("#techniqueNameTip").show();
					$("#techniqueNameTip").text("技术支持信息包含特殊字符!");
				}else{
					settingService.updateInfo({data:JSON2.stringify({techniqueName:techniqueName})}, function() {
						techniqueNameDone();
					});
				}
			}
			else {
				$("#techniqueNameTip").show();
				$("#techniqueNameTip").text("请填写技术支持信息!");
			}
		});
		//取消
		$("#cancelTechniqueName").unbind().bind('click',function() {
			$("#techniqueNameTip").hide();
			$("#techniqueNameDiv").text(_techniqueName);
			techniqueNameDone();
		});
		
		//LOGO
		_logoPath = path + logoURL;
		$("#logo_file").unbind().uploadPreview({target:"#logo_img",width:topWidth,height:topHeight,focusId:"logo_img"}).bind("change", function (e) {
			var _pre = $("#logo_img");
			_pre.css("background",'');
			_pre.css("filter",'');
		});
		
		//LOGO修改
		$("#modifyLogo").unbind().bind('click',function(){
			$("#update_logo_form").show();
			$(this).hide();
			$("#saveLogo").show();
			$("#cancelLogo").show();
			
		});
		//保存
		$("#saveLogo").unbind().bind('click',function() {	
			$("#logoImgTip").hide();
			var logo_file = $("#logo_file").val();
			if (logo_file != "") {
				if(!(/\.(jpg|jpeg|gif|png)$/i).test(logo_file)){
					$("#logoImgTip").show();
					$("#logoImgTip").text("仅支持小于2M的JPG、JPEG、GIF、PNG格式文件!");
				}
				else {
					$("#update_logo_form").submit();
				}
			}
			else {
				$("#logoImgTip").show();
				$("#logoImgTip").text("请选择LOGO图片!");
			}
		});
		//取消
		$("#cancelLogo").unbind().bind('click',function() {
			$("#logo_img").css("background-image", "url('" + _logoPath + "')");
			$("#logo_img").css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + _logoPath +  "',sizingMethod='scale')'");
			logoDone();
		});
		//默认风格修改
		$("#style-list li a").unbind().bind('click',function() {
			var $this = $(this);
			var styleName = $this.attr("styleName");
			if($this.hasClass("icon-ok")){
				return;
			}
			else{
				settingService.updateInfo({data:JSON2.stringify({styleName:styleName})},function(){
					$("#style-list li a.icon-ok").removeClass("icon-ok");
					$this.addClass("icon-ok");
				});
			}			
		});
		
		if(checkBrowserVersions()){
			//是否显示首页修改
			$("#front-page-switch .switch-label").unbind().bind('click',function() {
				var id = this.id;//点击label ID
				var $switchSelection = $("#front-page-switch .switch-selection");//选中span对象
				var left = $switchSelection.css("left");
				var frontPage = null;
				if(left == "2px" && id == "hide-front-page-label"){//选中隐藏
					frontPage = false;
					$("#front-page-switch .switch-selection").animate({left:"134px"},150,function(){
						$("#show-front-page-label").removeClass("switch-label-selected");
						$("#hide-front-page-label").addClass("switch-label-selected");
						$("#front-page-access-li").slideToggle();
					});					
				}
				else if(left == "134px" && id == "show-front-page-label"){//选中显示
					frontPage = true;
					$("#front-page-switch .switch-selection").animate({left:"2px"},150,function(){
						$("#hide-front-page-label").removeClass("switch-label-selected");
						$("#show-front-page-label").addClass("switch-label-selected");
						$("#front-page-access-li").slideToggle();
					});
				}
				if(frontPage != null){
					settingService.updateInfo({data:JSON2.stringify({frontPage:frontPage})});
				}
			});
			//首页访问方式修改
			$("#front-page-access-switch .switch-label").unbind().bind('click',function() {
				var id = this.id;//点击label ID
				var $switchSelection = $("#front-page-access-switch .switch-selection");//选中span对象
				var left = $switchSelection.css("left");
				var frontPageAccess = null;
				if(left == "2px" && id == "front-page-access-first-label"){//选中第一层解决方案(组)
					frontPageAccess = 1;
					$("#front-page-access-switch .switch-selection").animate({left:"134px"},150,function(){
						$("#front-page-access-all-label").removeClass("switch-label-selected");
						$("#front-page-access-first-label").addClass("switch-label-selected");
					});					
				}
				else if(left == "134px" && id == "front-page-access-all-label"){//选中所有解决方案
					frontPageAccess = 0;
					$("#front-page-access-switch .switch-selection").animate({left:"2px"},150,function(){
						$("#front-page-access-first-label").removeClass("switch-label-selected");
						$("#front-page-access-all-label").addClass("switch-label-selected");
					});
				}
				if(frontPageAccess != null){
					settingService.updateInfo({data:JSON2.stringify({frontPageAccess:frontPageAccess})});
				}
			});
		}
		else{
			//是否显示首页修改
			$("#front-page-switch input").unbind().bind('change',function() {
				var id = this.id;
				var frontPage = true;
				if(id == "show-front-page"){
					frontPage = true;
					$("#front-page-access-li").slideToggle();
				}
				else if(id == "hide-front-page"){
					frontPage = false;					
					$("#front-page-access-li").slideToggle();
				}
				settingService.updateInfo({data:JSON2.stringify({frontPage:frontPage})});
			});
			//首页访问方式修改
			$("#front-page-access-switch input").unbind().bind('change',function() {
				var id = this.id;
				var frontPageAccess = 0;
				if(id == "front-page-access-all"){//所有解决方案
					frontPageAccess = 0;
				}
				else if(id == "front-page-access-first"){//第一层解决方案(组)
					frontPageAccess = 1;
				}
				settingService.updateInfo({data:JSON2.stringify({frontPageAccess:frontPageAccess})});
			});
		}
	};

	/**
	 * 系统名称操作完成
	 * @returns
	 */
	var systemNameDone = function() {
		$("#systemNameDiv").attr("contenteditable", "false");
		$("#systemNameDiv").removeClass("content_editable");
		$("#saveSystemName").hide();
		$("#cancelSystemName").hide();
		$("#modifySystemName").show();
		$("#systemNameTip").hide();
	};
	
	/**
	 * 系统名称字体操作完成
	 * @returns
	 */
	var systemNameFontDone = function() {
		$("#systemNameFontDiv").attr("contenteditable", "false");
		$("#systemNameFontDiv").removeClass("content_editable");
		$("#saveSystemNameFont").hide();
		$("#cancelSystemNameFont").hide();
		$("#modifySystemNameFont").show();
		$("#systemNameFontTip").hide();
	};
	
	/**
	 * LOGO宽高
	 * @returns
	 */
	var logoWidthHeightDone = function() {
		$("#logoWidthDiv").attr("contenteditable", "false");
		$("#logoWidthDiv").removeClass("span_content_editable");
		$("#logoHeightDiv").attr("contenteditable", "false");
		$("#logoHeightDiv").removeClass("span_content_editable");
		$("#saveLogoPro").hide();
		$("#cancelLogoPro").hide();
		$("#modifySystemLogoPro").show();
		$("#logoWidthTip").hide();
		$("#logoHeightTip").hide();
	};
	
	var logoStyleDone = function() {
		$("#logoMarginTopDiv").attr("contenteditable", "false");
		$("#logoMarginTopDiv").removeClass("span_content_editable");
		$("#logoMarginLeftDiv").attr("contenteditable", "false");
		$("#logoMarginLeftDiv").removeClass("span_content_editable");
		$("#saveLogoStyle").hide();
		$("#cancelLogoStyle").hide();
		$("#modifyLogoStyle").show();
		$("#logoTopTip").hide();
		$("#logoLeftTip").hide();
	};
	
	/**
	 * 系统名称操作完成
	 * @returns
	 */
	var rightNameDone = function() {
		$("#rightNameDiv").attr("contenteditable", "false");
		$("#rightNameDiv").removeClass("content_editable");
		$("#saveRightName").hide();
		$("#cancelRightName").hide();
		$("#modifyRightName").show();
		$("#rightNameTip").hide();
	};
	
	/**
	 * 系统名称操作完成
	 * @returns
	 */
	var techniqueNameDone = function() {
		$("#techniqueNameDiv").attr("contenteditable", "false");
		$("#techniqueNameDiv").removeClass("content_editable");
		$("#saveTechniqueName").hide();
		$("#cancelTechniqueName").hide();
		$("#modifyTechniqueName").show();
		$("#techniqueNameTip").hide();
	};

	/**
	 * LOGO操作完成
	 * @returns
	 */
	var logoDone = function() {
		$("#update_logo_form").hide();
		$("#logoImgTip").hide();
		$("#logo_img").empty();
		$("#logo_file").val("");
		$("#saveLogo").hide();
		$("#cancelLogo").hide();
		$("#modifyLogo").show();
	};

	/**
	 * 判断浏览器版本是否小于等于IE8
	 * @returns true 小于等于IE8 false 不是IE活着大于IE8
	 */
	var checkBrowserVersions = function(){
		var index = navigator.userAgent.indexOf("MSIE");
		if(index > 0){
			//是IE浏览器
			var versions = parseInt(navigator.userAgent.substring(index+5,index+8));
			if(versions <= 8){
				return true;
			}
			else{
				return false;
			}
		}
		return false;
	};
	
	/**
	 * 更新图片的回调函数
	 */
	this.updateLogoCallBack = function(data){
		if(data && data != ""){
			_logoPath =  path + data;
			$("#logo_img").css("background-image", "url('" + _logoPath + "')");
			$("#logo_img").css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + _logoPath +  "',sizingMethod='scale')'");
		}
		logoDone();
	};
	
	/**
	 * 上传文件失败回调函数
	 */
	this.uploadFileErrorCallBack = function(msg){
		$("#logoImgTip").show();
		$("#logoImgTip").text("仅支持小于2M的JPG、JPEG、GIF、PNG格式文件!");
	};

	/**
	 * 初始化
	 */
	this.init = function() {
		initTemplate();
	};
}
