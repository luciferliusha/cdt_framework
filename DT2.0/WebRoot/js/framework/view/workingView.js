/**
 * 工作区View
 */
function WorkingView(){
	
	var _panelTitleHeight = 24;//24为标题高度
	var frameTitleHeight = 25;//含高度和边框：24+1
	var shadeOut = null;
	var shadeIn = null;
	
	
	/**
	 * resize所有的构件
	 * @returns
	 */
	var resizePanels = function(){
		var wkWidth = $("#working").width();
		var wkHeight = $("#working").height();
		$("#working .solution_workspace").each(function(){
			var _this = $(this);
			resizePanel(_this, wkWidth, wkHeight);
		});
	};

	/**
	 * resize构件面板
	 * @param _this
	 * @param _wkWidth
	 * @param _wkHeight
	 * @returns
	 */
	var resizePanel = function(_this, _wkWidth, _wkHeight){
		var _panelOption = _this.data("panelOption");
		if(_panelOption){
			var _width = parsePercentToPx(_panelOption.width, _wkWidth) - 2; //减去2px的边框
			var _left = parsePercentToPx(_panelOption.x, _wkWidth);
			var _height;
			if (_panelOption.isMax == true) {//最大化情况下
				_height = _wkHeight - 2;//减去2px的边框
			}
			else {
				_height = parseInt(_panelOption.height) - 2; //减去2px的边框
			}
			_this.css({"left":_left+"px","top":_panelOption.y,"width":_width+"px","height":_height+"px"});
			
			var titleHeight = _panelTitleHeight;//24为标题高度
			var iframeTitle = _this.find(".frameTitle");
			if(iframeTitle.is(":hidden")){//判断标题是否显示
				titleHeight = 0;
			}
			iframeTitle.css("width", _width+"px");
			var $iframe = _this.find("iframe");
			$iframe.css("width", _width+"px");
			$iframe.css("height", (_height - titleHeight - 1)+"px");
		}
//		$("#working").mCustomScrollbar("update");
	};
	
	/**
	 * resize URL方式的iframe
	 * @returns
	 */
	var resizeIframe = function(workspace_url) {
		var wkWidth = $("#working").width();
		var wkHeight = $("#working").height();
		workspace_url.css("width", wkWidth);
		workspace_url.css("height", wkHeight);
		var titleHeight = _panelTitleHeight;//24为标题高度
		var iframeTitle = workspace_url.find(".frameTitle");
		if(iframeTitle.is(":hidden")){//判断标题是否显示
			titleHeight = 0;
		}
		iframeTitle.css("width", parseInt(wkWidth) - 2);
		var $iframe = workspace_url.find("iframe");
		$iframe.css("width", wkWidth);
		$iframe.css("height", parseFloat(wkHeight) - titleHeight - 1);
		
		if ($.browser.webkit) {//chrome会出现滚动条，如下设置后会消失
			workspace_url.css("width", wkWidth - 18);
			workspace_url.css("height", wkHeight - 18);
			iframeTitle.css("width",iframeTitle.width() - 18);
			$iframe.css("width", $iframe.width() - 18);
			$iframe.css("height", $iframe.height() - 18);
			workspace_url.css("width", wkWidth);
			workspace_url.css("height", wkHeight);
			iframeTitle.css("width",iframeTitle.width() + 18);
			$iframe.css("width", $iframe.width() + 18);
			$iframe.css("height", $iframe.height() + 18);
		}
//		$("#working").mCustomScrollbar("update");
	};

	
	var parsePxToPercent = function(px, all) {
		return Math.round(parseFloat(px) / parseFloat(all) * 10000) / 100;
	};
	
	var parsePercentToPx = function(percent, all) {
		return Math.round(parseFloat(percent) * 0.01 * parseFloat(all));
	};

	/**
	 * 获取最大z-index
	 */
	var getMaxIndex =function(){
		var index=0;
		var _arr = $('#working').find(".solution_workspace");
		_arr.each(function(){
			var _i = $(this).css("z-index");
			if(!isNaN(_i)&&parseInt(_i)>index){
				index = parseInt(_i);
			}
		});
		return parseInt(index);
	};
	
	/**
	 * 遮罩
	 */
	var Shade = function(div){
		var _shadeDiv = div;
		var _opts = {obj:null,resize:null,shade:null};
		return {
			remove: function(){ //移除遮罩
				if(_opts.obj!=null){
					_opts.obj = null;
					_opts.resize = null;
					_opts.shade.remove();
					_opts.shade = null;
					return true;
				}
				return false;
			},
			appendTo: function(options){//添加遮罩到某obj
				for(var i in options){
					_opts[i] = options[i];
				}
				_opts.obj = $(_opts.obj);
				if(_opts.shade){
					_opts.shade = $(_opts.shade);
				}else{
					_opts.shade = $(_shadeDiv);
				}
				_opts.obj.append(_opts.shade);
				this.resize();
			},
			resize:function(){//遮罩是否要重新resize
				if(_opts.obj&&_opts.resize){
					_opts.resize(_opts.shade,_opts.obj);
				}
			}
		};
	};

	/**
	 * 更新面板的data
	 * @param _oldOption
	 * @param _newOption
	 * @param containBorder 传递的Option中的宽高值是否包含了边框宽度，默认未包含（因一般传递的是panel的width和height）
	 * @returns
	 */
	var updatePanelOption = function(_oldOption, _newOption, containBorder) {
		if(_oldOption && _newOption){
			var _workWidth = $("#working").width();
			var borderWidth = 2;
			if(containBorder == true){
				borderWidth = 0;
			}
			_oldOption.width = parsePxToPercent(parseFloat(_newOption.width)+borderWidth, _workWidth) + "%";//保存时加上2px的边框
			_oldOption.x = parsePxToPercent(_newOption.x, _workWidth) + "%";
			_oldOption.y = _newOption.y;
			_oldOption.height = (parseInt(_newOption.height)+borderWidth) + "px"; //保存时加上2px的边框
			if (_newOption.isMax == true) {
				_oldOption.isMax = true;
			}
			else {
				_oldOption.isMax = false;
			}
		}
	};
	
	
	/**************** 对外提供的方法 **********************/
	
	/**
	 * resize工作区
	 */
	this.resizeWorking = function(option) {
		if(option.left == 40){//缩小
			$("#working").animate({left:option.left},{easing: 'easeInOutExpo', duration:600, complete:function(){
				}
			});
			resizeIframeSize(option);
		}else{//放大
			$("#working").animate({left:option.left},{easing: 'easeInOutExpo', duration:600, complete:function(){
					resizeIframeSize(option);
				}
			});
		}
//		$("#working").mCustomScrollbar("update");
	};
	var resizeIframeSize = function(option){
		$("#working").css("width", option.width + "px");
		var $solution_workspace_url = $("#working").find(".solution_workspace_url");
		if ($solution_workspace_url.length == 0) {//不存在URL方式的
			resizePanels();
		}
		else {//URL方式
			resizeIframe($solution_workspace_url);
		}
	};
	
	/**
	 * 窗口resize，resize工作区的内容
	 */
	this.resize = function() {
		this.resizeWorking({left:$("#menu_div").width(),width:$(window).width() - $("#menu_div").width()});
	};
	
	/**
	 * 新建一个框体装载网页
	 */
	this.createIframeForUrl = function(option) {
		var $workspace = option.workspace;
		var _param = option.param;
		var _showBorder = option.showBorder;
		var _saveData = option.saveData;
		var _title = _param.title;
		var solution_workspace = _param.solution_workspace;
		var pfName = _param.pfName;
		var url = _param.url;
		var width = _param.width;
		var height = _param.height;
		var left = _param.left;
		var top = _param.top;
		var isMax = _param.isMax;//是否为最大化
		if (isMax == undefined) {
			isMax = false;
		}
		var titleBgColor = _param.titleBgColor;
		var titleFontSize = _param.titleFontSize;
		var isShowTitle = _param.isShowTitle;//是否显示标题
		var borderWidth = 2;
		var frameTitleBorder = "";
		if (_showBorder == false) {//不显示边框
			borderWidth = 0;
			frameTitleBorder = "frameTitleBorder";
		}
		var _allW = $("#working").width();
		// 处理原像素信息
		if (left.indexOf('px') != -1) {
			left = parsePxToPercent(left, _allW) + '%';
		}
		if (width.indexOf('px') != -1) {
			width = parsePxToPercent(width, _allW) + '%';
		}
		var save_left = left;//保存到data用,left为百分比
		var save_width = width;//保存到data用,width为百分比
		var save_height = parseInt(height);//保存到data用，用px
		left = parsePercentToPx(left, _allW);
		top = parseInt(top);
		width = parsePercentToPx(width, _allW);
		// height = parseInt(height);
		var titleWidth = width - 2;//标题栏的宽度，标题栏有左右边框
		width = width - borderWidth;//减去边框的宽度
		height = parseInt(height) - borderWidth;//减去边框的高度
		var iframeWidth = parseInt(width);
		var display = "block;";//
		var titleHeight = _panelTitleHeight;
		if (isShowTitle == false) {
			display = "none";
			titleHeight = 0;
		}
		var iframeHeight = parseInt(height) - titleHeight - 1;//24为标题高度
		var _new_solution_workspace_template = $.render($("#new_solution_workspace_template").html(), {solution_workspace:solution_workspace,pfName:pfName,
			width:width,height:height,left:left,top:top,frameTitleBorder:frameTitleBorder,titleWidth:titleWidth,
			iframeWidth:iframeWidth,iframeHeight:iframeHeight,titleBgColor:titleBgColor,titleFontSize:titleFontSize,display:display});
		var $panel = $(_new_solution_workspace_template);
		$workspace.append($panel);
		
		if (_saveData == true) {//直接非URL方式需要保存数据
			$panel.data("panelOption",{
				title : _title,
				x : save_left,
				y : top + "px",
				width : save_width,
				height : save_height + "px",
				url : url,
				head : pfName,
				isMax : isMax,
				titleConfig : {
					titleBgColor : titleBgColor,
					titleFontSize : titleFontSize,
					isShowTitle : isShowTitle
				}
			});
		}
		var $iframe = $panel.find("iframe");//iframe
		var $loading = $panel.find(".iframe_loading");
		$iframe.attr("src", URLUtil.addCurrentUserAcct(url)).load(function(){
			$loading.hide();
//			$("#working").mCustomScrollbar("update");
		});
		
		//给append的构建添加drag和resize事件
		if(solution_workspace=='solution_workspace'){
//			var _newTemp = $workspace.find(".solution_workspace:last");
			//给新append的添加拖拽事件
			$panel.css("z-index",getMaxIndex()+1)._draggable({
				handle: $panel.find(".frameTitle"),
				onStartDrag: function(e){
					var _this = this;
					var $this = $(this);
					$this.css("z-index",10001);//提升z-index
					shadeOut.appendTo({obj:$("#working"),resize:function(s,o){
						s.width(o.get(0).scrollWidth).height(o.get(0).scrollHeight);
					}});
					shadeIn.appendTo({obj:$this.find(".iframeforurl"),resize:function(s,o){
						var _iframe = o.find("iframe");
						s.width(_iframe.width()).height(_iframe.height());
					}});
				},
				onDrag: function(e){
					var $this = $(this);
					shadeOut.resize();
					shadeIn.resize();
					var d = e.data;
					if (d.left < 0){d.left = 0;}  
					if (d.top < 0){d.top = 0;}
				},
				onStopDrag: function(e){
					$(this).css("z-index","").css("z-index",getMaxIndex()+1);//更新z-index
					shadeOut.remove();
					shadeIn.remove();
					var optData = $(this).data("panelOption");
					updatePanelOption(optData, {x:$(this).css("left"), y:$(this).css("top"), width:$(this).css("width"), height:$(this).css("height"),isMax:false});
				}
			})._resizable({
				minWidth: 60,
				minHeight: 60,
				onStartResize:function(e){
					var $this = $(this);
					$this.css("z-index",10001);//提升z-index
					shadeOut.appendTo({obj:$("#working"),resize:function(s,o){
						s.width(o.get(0).scrollWidth).height(o.get(0).scrollHeight);
					}});
					shadeIn.appendTo({obj:$this.find(".iframeforurl"),resize:function(s,o){
						var _iframe = o.find("iframe");
						s.width(_iframe.width()).height(_iframe.height());
					}});
					
				},onResize:function(e){
					var $this = $(this);
					var d = e.data;
					//判断是否移动到了左或上边界
					if ((d.left)< 0){d.left = 0;d.width=d.startLeft-0+d.startWidth;}  
					if ((d.top)< 0){d.top = 0;d.height=d.startTop-0+d.startHeight;}
					
					//更新内部元素大小
					var innerWidth = d.width-d.deltaWidth;
					var iframeHeight = d.height-d.deltaHeight-frameTitleHeight;
					$this.find(".frameTitle").width(innerWidth);
					$this.find("iframe").width(innerWidth).height(iframeHeight);

					//更新遮罩
					shadeOut.resize();
					shadeIn.resize();			
				},onStopResize:function(e){
					var d = e.data;
					var $this = $(this);
					//判断是否移出了左或上边界
					if((d.left)<0){
						$this.css({left:'0px'}).width(d.startLeft-0+d.startWidth-d.deltaWidth);
					}
					if((d.top)<0){
						$this.css({top:'0px'}).height(d.startTop-0+d.startHeight-d.deltaHeight);
					}
					
					//移除遮罩
					shadeOut.remove();
					shadeIn.remove();
					$(this).css("z-index","").css("z-index",getMaxIndex()+1);//更新z-index
					var optData = $(this).data("panelOption");
					updatePanelOption(optData, {x:$this.css("left"), y:$this.css("top"), width:$this.css("width"), height:$this.css("height"),isMax:false});
				}
			});
			if(isFromOrm){
				if(ORMPermissionWorking('COMPONENTCHANGE')){
					$panel._draggable('disable');
					$panel._resizable('disable');
				}
				if(ORMPermissionWorking('COMPONENTQUERY')){
					$panel.hide();
				}
			}
			else if(isFromOutOm){//外部接口权限
				//没有解决方案增改权限，则禁用解决方案中的构件拖动与拉大拉小功能
				if(outOmPermissionWorking('CDT-02', 0) && outOmPermissionWorking('CDT-02', 2)){
					$panel._draggable('disable');
					$panel._resizable('disable');
				}
				if(outOmPermissionWorking('CDT-03', 3)){
					$panel.hide();
				}
			}
			else{
				//没有解决方案增改权限，则禁用解决方案中的构件拖动与拉大拉小功能
				if(cdtPermissionWorking('CDT-02', 0) && cdtPermissionWorking('CDT-02', 2)){
					$panel._draggable('disable');
					$panel._resizable('disable');
				}
				/*if(cdtPermissionWorking('CDT-03', 2)){
					$panel._resizable('disable');
				}*/
				if(cdtPermissionWorking('CDT-03', 3)){
					$panel.hide();
				}
			}
		}else if(solution_workspace=='solution_workspace_url'){
			$panel.find(".frame_title_config").css({right:"0px"});//重设位置
		}
	};

	/**
	 * 重新加载iframe的URL
	 */
	this.reloadIframeForUrl = function(option) {
		var $solution_workspace_url = option.workspace;
		var _param = option.param;
		var pfName = _param.pfName;
		var url = _param.url;
		var height = _param.height;
		var isShowTitle = _param.isShowTitle;//是否显示标题
		var titleBgColor = _param.titleBgColor;
		var titleFontSize = _param.titleFontSize;
		var $frameTitle = $solution_workspace_url.find(".frameTitle");//标题栏
		var $iframe = $solution_workspace_url.find("iframe");//iframe
		$("body").scrollTop(0);//解决接收到消息后切换选择某个解决方案，整个页面向上平移的问题
		if (isShowTitle == false) {//是否显示标题栏
			$frameTitle.hide();
			//需要重新计算高度
			$iframe.css("height", parseInt(height) - 1);
		}
		else {
			$frameTitle.show();
			//需要重新计算高度
			$iframe.css("height", parseInt(height) - 25);
		}
		$frameTitle.css("background-color", titleBgColor);
		var $frameTitleSpan = $frameTitle.children().eq(0);
		$frameTitleSpan.text(pfName);
		$frameTitleSpan.css("font-size", titleFontSize);
		
		//判断新的URL和原来加载的是否是一样的URL
		var newLen = url.indexOf("?");
		var newUrl = url;
		if (newLen != -1) {//截取不包含参数
			newUrl = url.substr(0, newLen);
		}
		var oldUrl = $iframe.attr("src");
		var oldLen = oldUrl.indexOf("?");
		if (oldLen != -1) {
			oldUrl = oldUrl.substr(0, oldLen);
		}
		if (oldUrl != newUrl) {//判断URL是否一致，一致则发送消息，不一致则加载
			var $loading = $solution_workspace_url.find(".iframe_loading");
			$loading.show();
			$iframe.attr("src", "about:blank");
			GCUtil.doGC();
			$iframe.attr("src", URLUtil.addCurrentUserAcct(url)).load(function(){
				$loading.hide();
			});
		}
		else {//传递消息，请遵循参数的key是一致的，然后参数为一个参数，如data={"id":"123","reload":"true"}或者data="hellword"
			var para = url.substr(url.indexOf("=")+1);
			var paraIndex = para.indexOf("&");
			if (paraIndex != -1) {//此处只能传递一个参数，如果需要传递多个参数的话，请组织成json格式，如data={"id":"123","reload":"true"}
				para = para.substr(0, paraIndex);
			}
			$iframe[0].contentWindow.postMessage(para, '*');//传递消息
		}
	};
	
	/**
	 * 保存当前编辑的工作区框体
	 */
	this.saveSolutionWorkspace = function($oldSelectedDiv, solutionsDataMap, callBack){
		var solutionId = $oldSelectedDiv.attr("solutionid");
		var $solution_workspace = $("#working").find(".solution_workspace");
		var $solution_workspace_url = $("#working").find(".solution_workspace_url");
		var $solution_workspace_template = $("#working").find(".solution_workspace_template");
		var _allW = $("#working").width();
		var _saveSuccess = false;
		//防止构件模式下，删除所有构件时，无法保存的情况
		if($solution_workspace_url.length != 0){//存在URL方式
			var data = solutionsDataMap.get(solutionId);
			var workingData = data.describe;
			if (typeof(workingData) == "string") {
				try {
					workingData = JSON.parse(workingData);
				}
				catch (err) {
					workingData = {};
				}
			}
			var titleBgColor =$solution_workspace_url.find(".frameTitle").css("background-color");
			if(titleBgColor.indexOf("#") != 0){
				titleBgColor = titleBgColor.colorHex();
			}
			var titleFontSize = $($solution_workspace_url.find(".frameTitle").children("span")[0]).css("font-size");
			if(titleBgColor != workingData.titleBgColor || titleFontSize != workingData.titleFontSize){
				if(titleBgColor != workingData.titleBgColor){
					workingData.titleBgColor = titleBgColor;
				}
				if(titleFontSize != workingData.titleFontSize){
					workingData.titleFontSize = titleFontSize;
				}
				var _param = {pfId:solutionId,describe:JSON.stringify(workingData)};
				messageCenter.callMessage('UPDATE_DESCRIBE',{callBack:callBack,param:_param});
				_saveSuccess = true;
				data.describe = workingData;//修改旧的describe更新到solutionsDataMap中
				solutionsDataMap.remove(solutionId);
				solutionsDataMap.put(solutionId, data);
			}
			else {
				if(callBack != null && !_saveSuccess){
					callBack(0);
				}
			}
		}else if($solution_workspace_template.length != 0){ //存在模板方式
			var data = solutionsDataMap.get(solutionId);
			var workingData = data.describe;
			var _template = workingData[0].panels[0];
			_template.html = escape($solution_workspace_template.html());
			var _param = {pfId:solutionId,describe:JSON.stringify(workingData)};
			messageCenter.callMessage('UPDATE_DESCRIBE',{callBack:callBack,param:_param});
		}else if($solution_workspace.length >= 0){//不存在URL方式（当构建删除到个数为0的时候，防止保存失效）
			var solutionWorkspaceString = "";
			$("#working .solution_workspace").each(function(){
				var _this = $(this);
				var optData = _this.data("panelOption");
				if (optData) {
					if (solutionWorkspaceString != "") {
						solutionWorkspaceString += "," + JSON.stringify(optData);
					}
					else {
						solutionWorkspaceString += JSON.stringify(optData);
					}
				}
			});
			solutionWorkspaceString = '['+ solutionWorkspaceString + ']';
			
			var data = solutionsDataMap.get(solutionId);
			var workingData = data.describe;
			if(!workingData || !workingData.length){ //初始为空时，创建初始值
				workingData = [{panels:[],title:"新建标签页"}];
			}
			if (workingData && workingData.length > 0) {
				var _children = workingData[0].panels;
				if(JSON.stringify(_children) != solutionWorkspaceString){//解决方案经过编辑，需要存储
					var solutionWorkspaceJson = JSON.parse(solutionWorkspaceString);
					workingData[0].panels = solutionWorkspaceJson;//修改内容
					var _param = {pfId:solutionId,describe:JSON.stringify(workingData)};
					messageCenter.callMessage('UPDATE_DESCRIBE',{callBack:callBack,param:_param});
					_saveSuccess = true;
					data.describe = workingData;//修改旧的describe更新到solutionsDataMap中
					solutionsDataMap.remove(solutionId);
					solutionsDataMap.put(solutionId, data);
				}
				else {
					if(callBack != null && !_saveSuccess){
						callBack(0);
					}
				}
			}
		}
	};

	/**
	 * 创建模板
	 */
	this.createTemplate = function(option){
		var _html = unescape(option.html);
		var $workspaceDiv = $("<div class='solution_workspace_template' style='height:100%;width:100%'></div>");
		var $workspace = option.workspace.empty();
		$workspaceDiv.append(_html).find(".component_drop").droppable({
			onDragEnter:function(){
				$(this).addClass('component_drop_over');
			},
			onDragLeave:function(){
				$(this).removeClass('component_drop_over');
			},
			onDrop:function(e,source){
				$(this).removeClass('component_drop_over');
				var appId = $(source).attr("appid");
				var app = menuView.getComponentData().get(appId);//获取构件数据
				if(app){
					$(this).empty().html('<iframe style="width:100%;height:100%;" frameborder="0" src="'+
							app.fileName +'"></iframe>');
					
					messageCenter.callMessage('ADD_APP_USED_LOG',{appId:appId});
				}
			}
		});
		$workspace.append($workspaceDiv);
		
	};
	
	/**
	 * 切换Panel最大化
	 */
	this.togglePanelMax = function(panel){
		var _sizeState = panel.data("sizeState");
		var wkWidth = $("#working").width();
		var wkHeight = $("#working").height();
		var optData = $(panel).data("panelOption");
		var _newState = null;
		if(_sizeState){
			_newState = _sizeState;
			panel.data("sizeState",null);
			updatePanelOption(optData, _newState);
		}else{
			_sizeState = {
					x:panel.css("left"),
					y: panel.css("top"),
					width: panel.width()+"px",
					height: panel.height()+"px"
			};
			_newState = {x:"0px",y:"0px",width: wkWidth+"px",height: wkHeight+"px",isMax:true};
			panel.data("sizeState",_sizeState);
			updatePanelOption(optData, _newState, true);
		}
		resizePanel(panel, wkWidth, wkHeight);
	};
	
	/**
	 * 更新面板的data
	 * @param _oldOption
	 * @param _newOption
	 * @param containBorder 传递的Option中的宽高值是否包含了边框宽度，默认未包含
	 * @returns
	 */
	this.updatePanelAllOption = function(_oldOption, _newOption) {
		if(_oldOption && _newOption){
			var _workWidth = $("#working").width();
			var borderWidth = 2;
			_oldOption.width = parsePxToPercent(parseFloat(_newOption.width)+borderWidth, _workWidth) + "%";//保存时加上2px的边框
			_oldOption.x = parsePxToPercent(_newOption.x, _workWidth) + "%";
			_oldOption.y = _newOption.y;
			_oldOption.height = (parseInt(_newOption.height)+borderWidth) + "px"; //保存时加上2px的边框
			_oldOption.isMax = false;//设置后则不为最大化状态
			_oldOption.titleConfig = {
				titleBgColor : _newOption.titleBgColor,
				titleFontSize : _newOption.titleFontSize,
				isShowTitle : _newOption.ShowTitle
			};
		}
	};
	
	/**
	 * 初始化
	 */
	this.initVariable = function() {
		shadeOut = new Shade("<div style='background-color:#000000;opacity:0.2;filter:Alpha(opacity=20);margin:0;padding:0;top:0;left:0;width:100%;height:100%;position:absolute;z-index:10000;'></div>");
		shadeIn = new Shade("<div style='background-color:#000000;opacity:.0;filter:Alpha(opacity=0);margin:0;padding:0;width:100%;height:100%;top:"+frameTitleHeight+"px;left:0;position:absolute;'></div>");
	};

	/**
	 * 传递消息到面板的 其它 iframe中
	 */
	this.postPanelMessage = function(messageData) {
		var $iframe;
		$("#working .solution_workspace").each(function(){
			$iframe = $(this).find("iframe");
			if ($iframe.length > 0 && $iframe[0].contentWindow != messageData.source) {//自身iframe不做消息传递
				$iframe[0].contentWindow.postMessage(messageData.data, '*');
			}
		});
	};
	
	/**
	 * 传递消息到面板的 自身 iframe中
	 */
	this.postReturnMessage = function(messageData) {
		var $iframe;
		$("#working .solution_workspace").each(function(){
			$iframe = $(this).find("iframe");
			if ($iframe.length > 0 && $iframe[0].contentWindow == messageData.source) {//仅仅自身iframe做消息传递
				$iframe[0].contentWindow.postMessage(messageData.data, '*');
				return false;
			}
		});
	};
}