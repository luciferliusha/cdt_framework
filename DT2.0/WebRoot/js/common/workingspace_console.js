/**
 * 切换页签时和解决方案前，将数据保存到present_panels
 */
var READLOCK = 0;//若欲读取该文件的文件夹下无此文件，则锁定存储项
var isChanged = false;//保存前的解决方案是否有变化
function WorkingspaceSave(label_solution){//切换页签或解决方案时, 保存数据
	
//	if(label_solution == SELECT_LABEL){//点击页签时缓存数据到describeJson
		var select_code = 0;
		if($("#table_label tr").children().length != 0){
			for(var k=0; k<$("#table_label tr").children().length; k++){
				//点击标签切换时可找到select_code
				if(selectLabelId == $("#table_label tr").children().eq(k+1).children().attr("id")){
					select_code = k;
					break;
				}else{//删除标签切换时不能找到select_code
					select_code = -1;
				}
			}
		}		
		//读取当前工作面板的代码保存到json_panel
		if(selectLabelId != null && selectLabelId != ""){
//			var json_panel = new Array();
			var stitle;
			if($("#"+selectLabelId).children("span").attr("title") != null &&
					$("#"+selectLabelId).children("span").attr("title") != ""){
				stitle = $("#"+selectLabelId).children("span").attr("title");
			}
			else{
				stitle = $("#"+selectLabelId).children("span").text();
			}
			var chageTabType =$("#"+selectLabelId).children("span").attr("chageTabType");
			var paramValue = $("#"+selectLabelId).children("span").attr("paramValue");
			var pro='';
			if (chageTabType) {
				pro+='"chageTabType":"'+chageTabType+'",';
			}
			if (paramValue) {
				pro+='"paramValue":"'+paramValue+'",';
			}
			json_panel = JSON2.parse('{"title":"'+stitle+'",'+pro+'"panels":[]}');
			
			if($("#"+selectLabelId+"_content"+" .iframe_css").length != 0){
				var maxHeight = $("#working").height();//最大高度
				var maxWidth = $("#working").width();
				$("#"+selectLabelId+"_content"+" .iframe_css").each(function(){
//					var src = this.src.replace(/\"/ig,"\'");
					var src = $(this).attr("url").replace(/\"/ig,"\'");
					var appWidth = $("#"+this.id).parent().parent().parent().css("width");
					var appHeight = $("#"+this.id).parent().parent().parent().css("height");
					if (appWidth == maxWidth+"px" && appHeight == maxHeight+"px") {
						appWidth = "max";
						appHeight = "max";
					}
					
					var _panelState = $("#"+this.id).parent().parent().parent().data("panelState");
					var json_add = JSON2.parse('{"title":"'+$("#"+this.id).parent().parent().parent().attr("id")+'",'+
							'"x":"'+_panelState.x+'",'+
							'"y":"'+_panelState.y+'",'+
							'"width":"'+_panelState.w+'",'+
							'"height":"'+_panelState.h+'",'+
							'"url":"'+src.slice(0, removeStrWithcomma(src, "?currentLabelId=", "&currentLabelId="))+'","head":"'+$("#"+this.id).parent().prev().text()+'"}');
					json_add.titleConfig = $("#"+this.id).parent().parent().find(".frameTitle").data("titleConfig")||frameTitleConfigView.defaultConfig();
					$("#"+this.id).parent().parent().find(".frameTitle").data("titleConfig",json_add.titleConfig);
					
					json_panel.panels.push(json_add);
				});
			}
			//切换页签时暂时保存到describeJson
			if(select_code != -1){//若点击标签切换，则缓存数据到describeJson
				if(JSON2.stringify(json_panel) != JSON2.stringify(describeJson[select_code])){
					isChanged = true;
					if(describeJson[select_code] == null){
						describeJson.push(JSON2.parse('{"title":"'+stitle+'",'+pro+'"panels":[]}'));
					}
					if(json_panel.panels.length == 0){
						describeJson[select_code].panels.splice(0, describeJson[select_code].panels.length);
					}
//					else{
						describeJson.splice(select_code, 1, json_panel);
//					}
				}
			}else{//若删除标签切换，则无需操作缓存数据
				
			}
		}else{
			
		}
//	}else 
	if(label_solution == SELECT_SOLUTION){
		var key = pfIdData.get(solutionSelectItemId);
		if (LEFT_MENU_TYPE == 2) {//2层菜单
			key = solutionInfo.get(solutionSelectItemId).pfId;
		}
		var value = describeJson.slice(0);
		if(key != null){
			/*if (JSON2.stringify(solutionLabels.get(key)) != JSON2.stringify(value)) {
				isChanged = true;
			}*/
			solutionLabels.remove(key);
			solutionLabels.put(key, value);
		}
	}
}

/**
 * 页面加载或者切换时从文件读入数据
 * @param id 切换前页面
 * @param nfid 切换后页面
 */
function WorkingspaceRead(describeJson, id){
	
	/**获取页签和工作区数据并读入*/
	if(describeJson != null){
		READLOCK = 1;//若读取成功，需要保存
		if($("#div_table_label").css("display") == "none"){//标签栏只有在方案加载成功时才会出现
			$("#div_table_label").show();
		}
		
		//记录读取信息，用于后续判断页面是否更改
		panel_flag = JSON2.stringify(describeJson);

		for(var j=0; j<$("#table_label tr").children().length;j++){//显示左移、右移和新增标签
			$("#table_label tr").each(function(){
				$("td:eq(" + j+ ")",this).show();
				$("#table_label td").css('float', 'left');
			});
		}
		//页面暂存方案
		//$("#working").empty();//清空工作区（貌似会自动清空的）
		if(describeJson.length == 0){//文件中无存储内容
			//生成一个空白页
			var labelModel = new LabelModel({id: "label0",name: "新建标签页",labelContentId: "label0_content",labelInputId:"label0Input"});
			labelView.labels.reset();
			labelView.labels.add(labelModel);
			
			selectLabelId = "label0";
			selectLabelContentId = "label0_content";
			//生成一个空白工作区
//			var workingView = new WorkingView({el: $("#working")});
			workingView.addView("label0_content","");
			$("#"+"label0_content").height($("#working").height());//去掉-10
			showFirstLabel = 1;
			showLastLabel = 1;
			i++;
			index++;
			
			//将生成页签和工作区暂存入describeJson
			var json_add = JSON2.parse('{"title":"新建标签页","panels":[]}');
			describeJson.push(json_add);
			$("#loading").fadeOut();//隐藏加载提示
			isLoading = false;//设置加载完成
		}else{
			//获取该解决方案在切换前保存的被选定的页签的id
			if(id==null || $("#"+id).attr("sid") == null || $("#"+id).attr("sid") == ""){//若不存在，则默认为第一个页签
				sid = "label0";
			}else{
				sid = $("#"+id).attr("sid");
			}
			labelView.labels.reset();
			appUrlMap.clear();//先清空appURL的内容
			for(var j=0; j<describeJson.length; j++){
				//生成页签和工作区
				labelView.addPage("label"+j, describeJson[j].title,  describeJson[j].chageTabType, describeJson[j].paramValue);
				selectLabelId = "label"+j;
				selectLabelContentId = selectLabelId+"_content";
				//目前切换页签即使不切换内容页也先加载工作区,如存在性能问题则需要修改
//				var workingView = new WorkingView({el: $("#working")});
				workingView.addView(selectLabelContentId,"");
				$("#"+"label"+j+"_content").height($("#working").height());//去掉-10
				var maxHeight = $("#working").height();//最大高度
				var maxWidth = $("#working").width();
				var panel;
				var appHeight;
				var appWidth;
				for(var k=0; k<describeJson[j].panels.length; k++){
					panel = describeJson[j].panels[k];
					idMap.put(selectLabelId+"_space"+k+"_iframe", panel.head);//保存每个APP的iframe的ID到HashMap中,可以传递消息
					appHeight = panel.height;
					if (appHeight == "max") {
						appHeight = maxHeight+"px";
					}
					appWidth = panel.width;
					if (appWidth == "max") {
						appWidth = maxWidth+"px";
					}
					else {
						//if (SOLUTION_SCAN_TYPE == 2) {//浏览模式
						//	appWidth = parseInt(appWidth) + 180;//因为左侧菜单长度不一致，如果以后一致了需要修改
						//}
					}
					createFrame(selectLabelContentId, "label"+j+"_space"+k, 
							panel.x, panel.y, appWidth, appHeight, panel.head, 
							"label"+j+"_space"+k+"_iframe_border", "label"+j+"_space"+k+"_iframe", 
							selectLabelId+"_space"+panels+"_iframe_div",panel);
					$("#"+"label"+j+"_space"+k).attr("iframe_index",k);
					if(selectLabelId == sid){//给当前显示的面板添加网页
						var url = panel.url.replace(/\'/ig,"\"");
						url = addCurrentId(url, selectLabelContentId, userId);
						//$("#"+"label"+j+"_space"+k+"_iframe").attr("src", url);//先不加载
						appUrlMap.put("label"+j+"_space"+k+"_iframe", url);
					}
					panels++;
				}
				
				//设置选中页签的显示状态和该页签下工作区的显隐状态
				if(selectLabelId != sid){
					$("#" + selectLabelId).removeClass("labels_s");
					$("#" + selectLabelId).addClass("labels_n");
					$("#" + selectLabelContentId).hide();
				}else{
					$("#" + selectLabelId).removeClass("labels_n");
					$("#" + selectLabelId).addClass("labels_s");
					$("#" + selectLabelId).css("z-index","999");
					$("#" + selectLabelContentId).show();
					if(isFromOrm){
						if(ORMPermissionWorking('COMPONENTQUERY')){
							$("#" + selectLabelContentId).hide();
						}
					}
					else if(isFromOutOm){
						
					}
					else{
						if(cdtPermissionWorking('CDT-03', 3)){
							$("#" + selectLabelContentId).hide();
						}
					}
				}
			}
			//加载当前页签中的app的URL
			loadAppUrl();
			selectLabelId = sid;
			selectLabelContentId = sid+"_content";
			$("#"+selectLabelId).css("z-index", 999);
			
			//获取焦点在页签数组中的索引
			var panels_index = 0;
			var clientWidth = document.documentElement.clientWidth;
			var showLabels = parseInt((clientWidth-529)/137);
			for(var j=0; j<describeJson.length; j++){
				if($("#table_label tr").children().eq(j+1).children().attr("id") == sid){
					panels_index = j;
					break;
				}
			}
			
			if(describeJson.length>showLabels){
				for(var j=1; j<=showLabels; j++){//隐藏读取结束后的所有页签
					$("#table_label tr").children().eq(showFirstLabel+j-1).hide();
				}
				if(panels_index < describeJson.length-showLabels){//选中标签+显示长度<总长度
					for(var k=0; k<showLabels; k++){//显示包括选择页签在内的对应长度的页签,不够则隐藏
						$("#table_label tr").children().eq(panels_index+1+k).show();
					}
					showFirstLabel = panels_index+1;
					showLastLabel = panels_index+showLabels;
				}else{
					for(var k=0; k<showLabels; k++){//显示包括选择页签在内的对应长度的页签,不够则隐藏
						$("#table_label tr").children().eq(describeJson.length-showLabels+1+k).show();
					}
					showFirstLabel = describeJson.length-showLabels+1;
					showLastLabel = describeJson.length-showLabels+showLabels;
				}
				if(panels_index == 0){//左侧无页签
					$("#label_turn_up").removeClass("turn_up_n");
					$("#label_turn_up").addClass("turn_up_d");
					$("#label_turn_up").attr("title","");
				}
				if(describeJson.length - panels_index > showLabels){//右侧有页签					
					if($("#label_turn_down").attr("class") == "turn_down_d"){
						$("#label_turn_down").removeClass("turn_down_d");
						$("#label_turn_down").addClass("turn_down_n");
						$("#label_turn_down").attr("title","向前滚动标签页");
					}
					else if($("#label_turn_down").attr("class") == "turn_down_no_d"){
						$("#label_turn_down").removeClass("turn_down_no_d");
						$("#label_turn_down").addClass("turn_down_no_n");
						$("#label_turn_down").attr("title","向前滚动标签页");
					}
				}
			}
		}
		
		//新建面板时，使之出现在正确的位置
		for(var k=0; k<describeJson.length; k++){
			if(selectLabelId == $("#table_label tr").children().eq(k+1).children().attr("id")){
				panels = describeJson[k].panels.length;
				break;
			}
		}
	}else{
		READLOCK = 0;//若读取失败，则不保存
		if($("#div_table_label").css("display") == "block"){//标签栏只有在方案加载成功时才会出现
			$("#div_table_label").hide();
		}
		$("#loading").fadeOut();//隐藏加载提示
		isLoading = false;//设置加载完成
	}
	
	if(isFromOrm){
		if(!ORMPermissionWorking('SORT')){
			sortable();
		}
	}
	else if(isFromOutOm){
		sortable();
	}
	else{
		if(!cdtPermissionWorking("CDT-08", 3)){
			sortable();
		}
	}
	function sortable(){
		$("#table_label tr").sortable({
			axis: 'x',
			forcePlaceholderSize: true,
			revert: true,
			scroll: false,
			helper: 'original',
			tolerance: 'pointer',
			containment: 'parent',
			items: '.tablelabel-list',
			zIndex: 1001,
			start: sortStart,
			update: sortUpdate
		});
	}
	function sortStart(event, ui){
		for(var k=0; k<$("#table_label tr").children('td').length; k++){
			if($(ui.item).children('div').attr('id') == $("#table_label tr").children('td').eq(k).children('div').attr('id')){
				labelSort[0] = k-1;
				break;
			}
		}
	}
	function sortUpdate(event, ui) {
		for(var k=0; k<$("#table_label tr").children('td').length; k++){
			if($(ui.item).children('div').attr('id') == $("#table_label tr").children('td').eq(k).children('div').attr('id')){
				labelSort[1] = k-1;
				break;
			}
		}
		
		var sortTransfer = describeJson[labelSort[0]];
		describeJson.splice(labelSort[0], 1);
		describeJson.splice(labelSort[1], 0, sortTransfer);
		
		for(var k=0; k<$("#table_label tr").sortable('toArray').length; k++){
			$("#table_label tr").children('td').eq(k+1).children('div').css('z-index', 900-k);
			$("#table_label tr").children('td').eq(k+1).children('div').attr('zindex', 900-k);
			$("#" + selectLabelId).css("z-index",999);
		}
	}
}

/**
 * 重置标识
 */
function init_elem(){
	i = 0;//右上角table显示内容
	index = 1;//右上角table显示位置
	showFirstLabel = 0;//显示的第一个标签
	showLastLabel = 0;//显示的最后一个标签
	selectLabelId = "";//选中标签ID
	selectLabelContentId = "";//选中标签的工作区ID
	panels = 0;//工作区中面板数量
}

/**
 * 读入页签和工作区的内容
 * @param describeJson
 */
function readPanels(describeJson, id){
	/**将读取到的页签内容填入页签*/
	WorkingspaceRead(describeJson, id);
	solutionSelectItemId = id;
}

/** 加载构件APP */
function loadAppUrl() {
	if (appUrlMap.size() > 0) {
		var key = appUrlMap.keys()[0];
		if ($("#" + key).length > 0) {
			$("#" + key).attr("src", appUrlMap.get(key)).load(function(){
				appUrlMap.remove(key);
				loadAppUrl();
			});
		}
		else {
			appUrlMap.remove(key);
			loadAppUrl();
		}
	}
	else {
		$("#loading").fadeOut();//隐藏加载提示
		isLoading = false;//设置加载完成
	}
}

/**
 * 带URL的解决方案的载入，没有页签，直接载入URL
 * @param url
 */
function loadUrlToWorking(url, id, name, describe){
	
	//$("#label0_solusion_content").remove();
	var contentId = "label0_solusion_content";
	var iframe = "label0_solusion_iframe";
	var space = contentId + "_space";
	url = url.replace(/\'/ig,"\"");
	
	var _style = getIframeTitleStyle(describe);
	if ($("#"+iframe).length > 0) {//已经加载iframe
		var oldUrl = $("#"+iframe).attr("src");
		var oldLen = oldUrl.indexOf("?");
		if (oldLen != -1) {
			oldUrl = oldUrl.substr(0, oldLen);
		}
		var newLen = url.indexOf("?");
		var newUrl = url;
		if (newLen != -1) {
			newUrl = url.substr(0, newLen);
		}
		$("#"+space+"Title").html(name).parent().css(_style);
		if (oldUrl != newUrl) {//判断URL是否一致，一致则发送消息，不一致则加载
			$("#loading").fadeIn();
			$("#"+iframe).attr("src", "about:blank");
			doGC();
			$("#"+iframe).attr("src", url).load(function(){
				$("#loading").fadeOut();//隐藏加载提示
			});
		}
		else {
			var para = url.substr(url.indexOf("=")+1);
			var paraIndex = para.indexOf("&");
			if (paraIndex != -1) {//此处只能传递一个参数，如果需要传递多个参数的话，请组织成json格式，如data={"id":"123","reload":"true"}
				para = para.substr(0, paraIndex);
			}
			//var data = {name:iframe, data:para};
			document.getElementById(iframe).contentWindow.postMessage(para, '*');
		}
		resizeIframe();//不重新加载内容则resize
	}
	else {
		$("#loading").fadeIn();//隐藏加载提示
//		var workingView = new WorkingView({el: $("#working")});
		workingView.addView(contentId,"");
		$("#"+contentId).height($("#working").height());//去掉-10
		var h2Height = 24;
		if(_style.display=="none"){
			h2Height = 0;
		}
		var height = $("#"+contentId).height();
		var width = $("#"+contentId).width();
		var html = '<div id="'+space+'" class="working_css" style="left:'+
		'0px;top:'+'0px;width:'+width+'px;height:'+
		height+'px;">'+'<!--圆角<b class="round_b1"></b><b class="round_b2"></b>' + 
		'<b class="round_b3"></b><b class="round_b4"></b>--><div class="working_content_css">'+
		'<div id="frameTitle" class="frameTitleNotMove"><span id="'+space+'Title">'+name+'</span>'+
		'<span id="frameTitleConfig" title="标题栏设置" class="frame_title_config"></span>'+
		'</div>'
		+'<div id="'+iframe+'Div'+'" class="frameDiv" style="height:'+
		(height-h2Height-2)+'px;"><iframe name='+iframe+' id="'+iframe+ '" src=' + url + ' scrolling="auto"'+
		' style="width:'+(width-8)+'px;height: '+(height-h2Height-2)+'px;"'+
		' class="iframe_css" frameborder="0"></iframe></div></div></div>';
		$("#"+contentId).append(html);
		idMap.put(iframe, iframe);
		$("#frameTitleConfig").hide();
		$("#frameTitle").bind("mouseover",function(){$("#frameTitleConfig").show();})
						.bind("mouseout",function(){$("#frameTitleConfig").hide();})
						.css(_style);
		$("#loading").fadeOut();//隐藏加载提示
		resizeIframe();
	}
	$("#frameTitleConfig").unbind("click").bind("click",function(){
		frameTitleConfigView.open(describe,"frameTitle", true);
	});
	$("#frameTitle").data("titleConfig",describe);
	isLoading = false;//设置加载完成
	solutionSelectItemId = id;
}

var getIframeTitleStyle = function(describe){
	var _desc = describe||frameTitleConfigView.defaultConfig();
	var _style = {};
	if(_desc.isShowTitle===false){
		_style.display = "none";
	}else{
		_style.display = "";
	}
	if(_desc.titleBgColor){
		_style["background-color"] = _desc.titleBgColor;
	}else{
		_style["background-color"] = "";
	}
	if(_desc.titleFontSize){
		_style["font-size"] = _desc.titleFontSize;
	}else{
		_style["font-size"] = "";
	}
	return _style;
};


/** resie iframe */
var resizeIframe = function() {
	var contentId = "label0_solusion_content";
	var space = contentId + "_space";
	var iframe = "label0_solusion_iframe";
	var _titleDiv = "label0_solusion_content_spaceTitle";
	var h2Height = 24;
	if($("#"+_titleDiv).parent().css("display")=='none'){//判断标题是否显示
		h2Height = 0;
	}
	if ($("#"+contentId).length > 0) {
		$("#"+contentId).height($("#working").height());
		var height = $("#"+contentId).height();
		var width = $("#"+contentId).width();
		
		$("#" + space).animate({height:height,width:width},300,function(){
			if ($.browser.webkit) {//chrome会出现滚动条，如下设置后会消失
				$("#" + space).css("height", height - 10);
				$("#" + space).css("width", width - 10);
				$("#" + iframe + "Div").height((height-h2Height-2-10) + "px");
				$("#" + iframe).height((height-h2Height-2-10) + "px");
				$("#" + iframe).width((width-8-10) + "px");
				
				setTimeout(function() {
					$("#" + space).css("height", height - 0);
					$("#" + space).css("width", width - 0);
					$("#" + iframe + "Div").height((height-h2Height-2) + "px");
					$("#" + iframe).height((height-h2Height-2-4) + "px");
					$("#" + iframe).width((width-8) + "px");
				}, 100);
				
			}
		});
		$("#" + iframe + "Div").height((height-h2Height-2) + "px");
		$("#" + iframe).height((height-h2Height-2) + "px");
		$("#" + iframe).width((width-8) + "px");
		
		if ($.browser.webkit) {
			$("#" + space).css("height", height - 0);
			$("#" + space).css("width", width - 0);
			$("#" + iframe + "Div").height((height-h2Height-2-0) + "px");
			$("#" + iframe).height((height-h2Height-2-0) + "px");
			$("#" + iframe).width((width-8-0) + "px");
		}
	}
};

/** 重命名后需要修改URL方式的工作区的标题 */
function changeUrlWorkingSpaceName(name, describe) {
	if ($("#label0_solusion_content_spaceTitle").length > 0) {
		$("#label0_solusion_content_spaceTitle").html(name);
	}
	var _style = getIframeTitleStyle(describe);
	$("#frameTitle").css(_style);
	resizeIframe();
}

/**
 * 清理页签和工作区的内容
 * @param describeJson
 */
function cleanWorkSpace(){
	//选取不同解决方案时改变页签和工作区的内容
	//清理构件组生成的标签和内容
	
	var table_label_length= $("#table_label tr").children().length-3;
	if(table_label_length!=0 && $("#div_table_label").css("display") == "block"){//若页签的长度不为零，则清空之
		while($("#table_label tr").children().length > 3){
			var removeLabel = $("#table_label tr").children().eq(1).children().attr("id");
			var removeContent = $("#"+removeLabel + "_content");
			var iframeDivId = null;
			while(removeContent.children().length > 0){
				iframeDivId = removeContent.children().eq(0).attr("id");
				removeIframe(iframeDivId + "_iframe");
				$("#" + iframeDivId).remove();
			}
			removeContent.remove();
			doGC();
			$("#table_label tr").each(function(){$("td:eq(1)",this).remove();});			
			if($("#table_label tr").children().length == 3){
				break;
			}
		}
		if($("#label_turn_up").attr("class") == "turn_up_n"){
			$("#label_turn_up").removeClass("turn_up_n");
			$("#label_turn_up").addClass("turn_up_d");
			$("#label_turn_up").attr("title","");
		}
		if($("#label_turn_down").attr("class") == "turn_down_no_n"){
			$("#label_turn_down").removeClass("turn_down_no_n");
			$("#label_turn_down").addClass("turn_down_no_d");
			$("#label_turn_down").attr("title","");
		}
		else if($("#label_turn_down").attr("class") == "turn_down_n"){
			$("#label_turn_down").removeClass("turn_down_n");
			$("#label_turn_down").addClass("turn_down_d");
			$("#label_turn_down").attr("title","");
		}
			
		//初始化相关变量
		init_elem();
		
		for(var j=0; j<$("#table_label tr").children().length;j++){//隐藏左移、右移和新增标签
			$("#table_label tr").each(function(){$("td:eq(" + j+ ")",this).hide();});
		}
		
	}
	else {//直接是URL的方式
		//$("#label0_solusion_content").remove();
	}
	if(solutionSelectItemId == "" || solutionSelectItemId == null){
		READLOCK = 0;//若读取失败，则不保存
		if($("#div_table_label").css("display") == "block"){//标签栏只有在方案加载成功时才会出现
			$("#div_table_label").hide();
		}
	}
	doGC();//垃圾回收
}

/** 自动保存切换前的解决方案 */
function checkSave() {
	if(document.getElementById(solutionSelectItemId) != null && READLOCK == 1){//第一次登录时没有选中解决方案,则无需保存
		/**保存之前的操作数据到对应的hashmap*/
		WorkingspaceSave(SELECT_SOLUTION);
		if (solutionSelectItemId != null && solutionSelectItemId != "" && isChanged) {//切换前有解决方案显示，则先保存切换前的解决方案
			var oldPfId = pfIdData.get(solutionSelectItemId);//取得切换前的解决方案，并保存
			if (LEFT_MENU_TYPE == 2) {//2层菜单
				oldPfId = solutionInfo.get(solutionSelectItemId).pfId;
			}
			var value = JSON2.stringify(solutionLabels.get(oldPfId));
			var url = contextPath + '/updateDescribeById.do';
			var param = {pfId:oldPfId,describe:value};
			if(isFromOrm){
				if(!ORMPermissionWorking('SAVE')){
//					operateServerData(url, labelView.labels, null, null, param);//切换自动保存解决方案
					doAjaxServerData(url,null,null,param);//使用ajax方法保存，防止保存时清空页签collection
				}
			}
			else if(isFromOutOm){
				doAjaxServerData(url,null,null,param);
			}
			else{
				if(!cdtPermissionWorking('CDT-05', 3)){
//					operateServerData(url, labelView.labels, null, null, param);//切换自动保存解决方案
					doAjaxServerData(url,null,null,param);//使用ajax方法保存，防止保存时清空页签collection
				}
			}
			isChanged = false;
		}
	}else{}
}

/** 将插入src的页签ID删除 */
function removeStrWithcomma(srcStr, targetStr1, targetStr2){
	if(srcStr.lastIndexOf(targetStr1) != -1){
		return srcStr.lastIndexOf(targetStr1);
	}else{
		if(srcStr.lastIndexOf(targetStr2) != -1){
			return srcStr.lastIndexOf(targetStr2);
		}else{
			return srcStr.length;
		}
	}
}

function removeIframe(iframeId) {
	var frame = $("#" + iframeId);
	if (frame) {
		frame.attr("src", "about:blank");
		frame.remove();//删除iframe
	}
}

function doGC() {
	var index = navigator.userAgent.indexOf("MSIE");
	if(index > 0){//IE
		CollectGarbage();//垃圾回收
	}
}