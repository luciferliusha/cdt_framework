/**
 * CDT左侧导航栏VIEW中解决方案部分
 */

function SolutionView(){
	
	var solutionService = new SolutionService();
	var solutionLimit = 16;//解决方案名称字数限制
	var lowSolutionLimit = 14;//第三层以上的解决方案名称字数限制
	var solutionsDataMap = new HashMap();//解决方案(组)数据，key：解决方案(组)id，data：对应的数据
	var _solutionMode = 0;//解决方案表现模式：0为展现模式，1为编辑模式
	var _isSystemManager = false;//是否为系统管理展现模式：true为系统管理展现模式，默认为false
	var _iconPath = path + "/uploadFils/icons/";//图标路径
	var _defNormalIcon = "def_n.png";//默认图标
	var _defSelectIcon = "def_s.png";//默认图标
	var _defNormalPic = "app-default.png";//默认图标
	var _menuMaxWidth = 230;//菜单栏展开宽度
	var _menuMinWidth = 40;//菜单栏收起宽度
	var _menutype = SOLUTION_SCAN_TYPE;//菜单栏加载类型，1：展开；2：收起
	var _defaultTitleConfig = {//默认的标题栏样式
			titleBgColor : "#e5e7e9",
			titleFontSize : "12px"
	};
	var _favoriteData = null;//喜好的解决方案（包含其父解决方案信息）
	var _isotopeData = null;//首页解决方案数据
	var sortable;
	var check_submit = {"solution":true};//防止表单重复提交
	
	/**
	 * 初始化新增解决方案(组)
	 * @data 接口返回的数据
	 * @param 新增解决方案(组)传递的参数
	 */
	var initNewSolution = function(data,param){
		var pfId = data.pfId;
		var orderBy = data.orderBy;
		var fileJson = JSON2.parse(param.file);
		var pfName = fileJson.pfName;
		var describe = fileJson.describe;
		var tempName = "";
		var title = "";
		var type = fileJson.type;
		var parentId = fileJson.parentId;
		fileJson.pfId = pfId;
		fileJson.orderBy = orderBy;
		var iconNormal = fileJson.picName;//解决方案的图标
		if (iconNormal == null || iconNormal == "") {
			iconNormal = _defNormalIcon;
		}
		var iconSelected = fileJson.fileName;//解决方案的图标
		if (iconSelected == null || iconSelected == "") {
			iconSelected = _defSelectIcon;
		}
		var picNormal = fileJson.keyWord;//解决方案的图标
		if (picNormal == null || picNormal == "") {
			picNormal = _defNormalPic;
		}
		
		if(parentId == 0){//第一层
			tempName = name_limit(pfName,solutionLimit);
			if(tempName != pfName){
				title = pfName;
			}
			if(type == 0){//解决方案组
				var _solution_parent_li_hasChild_template = $.render($("#solution_parent_li_hasChild_template").html(),
						{solutionname:tempName,title:title,solutionid:pfId,parentId:parentId,orderBy:orderBy,
						iconName:_iconPath+iconNormal,iconNormal:iconNormal,iconSelect:iconSelected,picNormal:picNormal});
				$("#solution_div_sidebar").append(_solution_parent_li_hasChild_template);
			}
			else if(type == 1){//解决方案
				var _solution_parent_li_template = $.render($("#solution_parent_li_template").html(),
						{solutionname:tempName,title:title,solutionid:pfId,parentId:parentId,orderBy:orderBy,
						iconName:_iconPath+iconNormal,iconNormal:iconNormal,iconSelect:iconSelected,picNormal:picNormal});
				$("#solution_div_sidebar").append(_solution_parent_li_template);
			}
		}
		else {
			//根据父节点找到解决方案组
			$("#solution_div_sidebar .hasChild").each(function(){
				var $this = $(this);
				if($this.attr("solutionid") == parentId){
					if ($this.children(".solution_div_sidebar_child").length > 0) {//已经展开过，则添加内容
						var outLevel = $this.parents("ul").length >= 2;//标识新增的解决方案是否大于等于第三层,是为true,否为false
						var _solution_children_li_template = "";
						if(outLevel){
							tempName = name_limit(pfName,lowSolutionLimit);
						}
						else{
							tempName = name_limit(pfName,solutionLimit);
						}
						if(tempName != pfName){
							title = pfName;
						}
						if(type == 0){
							_solution_children_li_template = $.render($("#solution_children_li_hasChild_template").html(),
									{solutionname:tempName,title:title,solutionid:pfId,parentId:parentId,orderBy:orderBy,
									iconName:_iconPath+iconNormal,iconNormal:iconNormal,iconSelect:iconSelected,picNormal:picNormal});
						}
						else if(type == 1){
							_solution_children_li_template = $.render($("#solution_children_li_template").html(),
									{solutionname:tempName,title:title,solutionid:pfId,parentId:parentId,orderBy:orderBy,
									iconName:_iconPath+iconNormal,iconNormal:iconNormal,iconSelect:iconSelected,picNormal:picNormal});
						}
						$this.children("ul").append(_solution_children_li_template);
						if(outLevel){
							$($this.children("ul").children()[$this.children("ul").children().length-1]).children("div").
								find(".solution_name").addClass("solution_name_out_level");
						}
					}
					return false;//跳出each循环
				}
			});
		}
		if(describe){
			//如果存在，则解析describe
			describe = JSON2.parse(describe);
			fileJson.describe = describe;
		}
		solutionsDataMap.put(pfId, fileJson);//将新增的解决方案信息缓存到map中
		$(".all_background").hide();
		if(type == 0){
			$("#new_sloutions_window").remove();
		}
		else if(type == 1){
			$("#new_sloution_window").remove();
		}
		$("#menu_ul_parent").mCustomScrollbar("update");
	};
	
	/**
	 * 编辑解决方案(组)
	 * @data 接口返回的数据
	 * @param 编辑解决方案(组)传递的参数
	 */
	var editSolution = function(param){
		var fileJson = JSON2.parse(param.file);
		var pfId = fileJson.pfId;
		var type = fileJson.type;
		var pfName = fileJson.pfName;
		var picName = fileJson.picName;
		var fileName = fileJson.fileName;
		var keyWord = fileJson.keyWord;
		var url = fileJson.url;
		var describe = fileJson.describe;
		var oldSolutionData = solutionsDataMap.get(pfId);
		var templateObj = null;
		$("#solution_div_sidebar li").each(function(){
			if($(this).attr("solutionid") == pfId){
				if(oldSolutionData.pfName != pfName){//名称改变
					var outLevel = $(this).parents("ul").length >= 3;//标识编辑的解决方案是否大于等于第三层,是为true,否为false
					var tempName = "";
					var nameObj = $(this).children("div").find(".solution_name");
					if(outLevel){
						tempName = name_limit(pfName,lowSolutionLimit);
					}
					else{
						tempName = name_limit(pfName,solutionLimit);
					}
					nameObj.text(tempName);
					if(tempName != pfName){
						nameObj.attr("title",pfName);
					}
					else{
						nameObj.attr("title","");
					}
					oldSolutionData.pfName = pfName;
				}
				if(oldSolutionData.picName != picName){//图标改变
					var $this = $(this);
					var iconObj = $this.find(".solutionpic");
					if(iconObj.length > 0){
						var normalIcon = _iconPath + picName;
						var selectedIcon = _iconPath + fileName;
						iconObj.attr("iconnormal",picName);
						iconObj.attr("iconselect",fileName);
						if($this.hasClass("active")){
							iconObj.css("background-image", "url('" + selectedIcon + "')");
							iconObj.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + selectedIcon 
									+ "', sizingMethod='scale')");
						}
						else{
							iconObj.css("background-image", "url('" + normalIcon + "')");
							iconObj.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + normalIcon 
									+ "', sizingMethod='scale')");
						}
					}
					oldSolutionData.picName = picName;
					oldSolutionData.fileName = fileName;
				}
				if(oldSolutionData.keyWord != keyWord){//图标改变
					oldSolutionData.keyWord = keyWord;
				}
				return false;//跳出each循环
			}
		});
		
		if(url != ""){//写入url方式
			oldSolutionData.describe = describe;
		}else{
			describe = ( describe&&(typeof(describe) == "string") ) && JSON2.parse(describe);
			//判断是否有模板信息
			if(describe&&describe.length==1&&describe[0].panels&&describe[0].panels.length==1&&describe[0].panels[0].templateId){
				oldSolutionData.describe = describe;
				templateObj = describe[0].panels[0];
			}else if(oldSolutionData.url != ""){//判断从写入url方式切换到其他方式时，describe需要置空
				oldSolutionData.describe = "";
			}else if(describe == ""){ //故意传递置空
				oldSolutionData.describe = "";
			}
		}
		
		$("#solution_div_sidebar .active").each(function(){
			if (!$(this).hasClass("hasChild")) {//获取选中的解决方案
				var curSelectedId = $(this).attr("solutionid");
				if (curSelectedId == pfId) {//修改的是当前选中的
					var $solution_workspace_url = $("#working").find(".solution_workspace_url");
					if ($solution_workspace_url.length > 0 && url != "") {//URL方式的，且url不为空
						var $frameTitle = $solution_workspace_url.find(".frameTitle");//标题栏
						var $iframe = $solution_workspace_url.find("iframe");//iframe
						var height = $(window).height() - $("#top_div").height();
						if (describe != "" && typeof(describe) == "string") {
							describe = JSON2.parse(describe);
						}
						if (describe.isShowTitle == false) {//是否显示标题栏
							$frameTitle.hide();
							//需要重新计算高度
							$iframe.css("height", parseInt(height) - 1);
						}
						else {
							$frameTitle.show();
							//需要重新计算高度
							$iframe.css("height", parseInt(height) - 25);
						}
						$frameTitle.children().eq(0).text(pfName);
						//URL不一致则重新载入URL
						var oldUrl = $iframe.attr("src");
						if (oldUrl != url) {
							var $loading = $solution_workspace_url.find(".iframe_loading");
							$loading.show();
							$iframe.attr("src", "about:blank");
							GCUtil.doGC();
							$iframe.attr("src", URLUtil.addCurrentUserAcct(url)).load(function(){
								$loading.hide();
							});
						}
					}
					else if(templateObj){ //模板方式
						var _html = templateObj.html;
						messageCenter.callMessage('CREATE_TEMPLATE', {workspace:$("#working"),html:_html});
					}
					else if (url != "") {//从拖拉构件的方式->修改为URL方式展现的,add by linj 20150109
						var $workspace = $("#working");
						$workspace.empty();//清空工作区
						GCUtil.doGC();
						var solution_workspace = "solution_workspace_url";
						if (describe != "" && typeof(describe) == "string") {
							describe = JSON2.parse(describe);
						}
						var isShowTitle = true;
						var titleBgColor = "";
						var titleFontSize = "";
						if (describe) {
							if (describe.titleBgColor && describe.titleBgColor != "") {
								titleBgColor = describe.titleBgColor;
							}
							else {
								titleBgColor = _defaultTitleConfig.titleBgColor;
								describe.titleBgColor = titleBgColor;
							}
							if (describe.titleFontSize && describe.titleFontSize != "") {
								titleFontSize = describe.titleFontSize;
							}
							else {
								titleFontSize = _defaultTitleConfig.titleFontSize;
								describe.titleFontSize = titleFontSize;
							}
							isShowTitle = describe.isShowTitle;
						}
						else {
							titleBgColor = _defaultTitleConfig.titleBgColor;
							titleFontSize = _defaultTitleConfig.titleFontSize;
						}
						var width = $(window).width() - $("#menu_ul_parent").width() + "px";
						var height = $(window).height() - $("#top_div").height() + "px";
						var left = "0px";
						var top = "0px";
						var _param = {"solution_workspace":solution_workspace,"pfName":pfName,"url":url,"width":width,"height":height,"left":left,"top":top,"titleBgColor":titleBgColor,"titleFontSize":titleFontSize,isShowTitle:isShowTitle};
						messageCenter.callMessage('CREATE_IFRAME', {workspace:$workspace,param:_param, showBorder:false, saveData:false});
					}
					else { //其余则清空工作区
						$("#working").empty();
					}
				}
				return false;//跳出each循环
			}
		});

		if(oldSolutionData.url != url){
			oldSolutionData.url = url;
		}
		solutionsDataMap.remove(pfId); //修改map中的值
		solutionsDataMap.put(pfId,oldSolutionData);
		$(".all_background").hide();
		if(type == 0){
			$("#new_sloutions_window").remove();
		}
		else if(type == 1){
			$("#new_sloution_window").remove();
		}
	};
	
	/**
	 * 删除解决方案(组)数据
	 * @param param 删除解决方案(组)传递的参数
	 * @returns
	 */
	var deleteSolutionData = function(param){
		var pfId = param.pfId;
		$("#solution_div_sidebar li").each(function(){
			var $this = $(this);
			if($this.attr("solutionid") == pfId){
				if($this.hasClass("active")//删除选中项
						|| ($this.hasClass("hasChild") && $this.find(".active").length > 0)){//第二层以上的解决方案组下面含有选中的解决方案
					if($this.prev().length > 0){//不是第一个解决方案(组)
						if(!$this.prev().hasClass("hasChild")){
							$this.prev().click();
						}
						else{
							if(!$this.hasClass("firstparent")){//不是第一层
								$this.parents(".firstparent").removeClass("active");
								chageIconCss($this.parents(".firstparent"), "iconNormal");
							}
						}
					}
					else if($this.next().length > 0){//不是最后一个解决方案(组)
						if(!$this.next().hasClass("hasChild")){
							$this.next().click();
						}
						else{
							if(!$this.hasClass("firstparent")){//不是第一层
								$this.parents(".firstparent").removeClass("active");
								chageIconCss($this.parents(".firstparent"), "iconNormal");
							}
						}
					}
					else{//只有一个解决方案(组)
						if(!$this.hasClass("firstparent")){//不是第一层
							$this.parents(".firstparent").removeClass("active");
							chageIconCss($this.parents(".firstparent"), "iconNormal");
						}
					}
				}
				if($this.hasClass("hasChild")){//删除解决方案组时，解决方案组下面的解决方案(组)也要在Map中移除
					$this.find("li").each(function(){
						var tempPfId = $this.attr("solutionid");
						solutionsDataMap.remove(tempPfId);
					});
				}
				$this.remove();
				solutionsDataMap.remove(pfId);
			}
		});
		$(".all_background").hide();
		$("#delete_sloution_window").remove();
	};
	
	/*
	 * 获取第一层解决方案
	 */
	var getSolutionDataFromHttpUtil = function(visitType){
		solutionService.getSolutionData(initSolutionData,visitType);
	};
	
	/*
	 * 根据解决方案组id获取其孩子
	 */
	var getSolutionsChildrenDataFromHttpUtil = function($this, solutionid, scanType, loadfirsttime,parentids){
		solutionService.getSolutionsChildrenData($this, solutionid, scanType, loadfirsttime,parentids, initSolutionsChildrenData);
	};
	
	/**
	 * 获取解决方案（组）数据并初始化
	 */
	var initSolutionData = function(data,visitType,_total) {//visitType:0表示初始登录，1表示进出系统管理，2表示首页切换
		_favoriteData = null;//先清空喜好的数据
		if (userKind != 1) {//非系统管理员
			if (isFromOrm) {//外部JSAPI方式
				getSolutionsFromOrm(data);
			}
			if(isFromOutOm){//外部接口权限
				getOutOmPerssion.getSolutionsFromOutOm(data);
				if(visitType != 2){//若点击首页，则跳过解决方案初始化
					randerSolution(data);
				}
				//进入或者退出系统管理，在首页未展现时，那就默认选中第一个（不能使用frontpage作为判断条件，防止在展现首页的情况下修改喜好设置出现的首页不刷新问题）
				if (visitType == 1 && $(".index_content_div").width()==0) {
					solutionView.isotopeItemClick(0);
				}
				else {
					if(frontPageAccess == 1){//当九宫格的访问方式为第一层数据时，加载第一层的解决方案组合解决方案到首页
						solutionService.getIsotopeFirstLevelData(initIsotopeData,_total,visitType);
					}else{//当九宫格的访问方式为所有解决方案时，加载所有解决方案到首页
						solutionService.getIsotopeData(initIsotopeData,_total,visitType);
					}
				}
			}
			else{
				//获取订阅的喜好的解决方案
				solutionService.getFavPlatFormList(function(favData) {
					_favoriteData = favData;
					//若喜好的解决方案初始化为空，与全部选中的状态相同，展现所有的解决方案
					if(_favoriteData.length != 0){
						for ( var i = 0; i < data.length; i++) {
							var isExit = false;
							for (var j in favData) {
								if (data[i].pfId == favData[j].pfId) {
									isExit = true;
									break;
								}
							}
							if (!isExit) {
								data.splice(i, 1);
								i--;
							}
						}
					}
					if(visitType != 2){//若点击首页，则跳过解决方案初始化
						randerSolution(data);
					}
					//进入或者退出系统管理，在首页未展现时，那就默认选中第一个（不能使用frontpage作为判断条件，防止在展现首页的情况下修改喜好设置出现的首页不刷新问题）
					if (visitType == 1 && $(".index_content_div").width()==0) {
						solutionView.isotopeItemClick(0);
					}
					else {
						if(frontPageAccess == 1){//当九宫格的访问方式为第一层数据时，加载第一层的解决方案组合解决方案到首页
							solutionService.getIsotopeFirstLevelData(initIsotopeData,_total,visitType);
						}else{//当九宫格的访问方式为所有解决方案时，加载所有解决方案到首页
							solutionService.getIsotopeData(initIsotopeData,_total,visitType);
						}
					}
				}, {file:'{"userKey":"' + userAcct + '"}'});
			}
		}else {
			if(visitType != 2){//若点击首页，则跳过解决方案初始化
				//渲染左侧导航栏
				randerSolution(data);
			}
			//进入或者退出系统管理，在首页未展现时，那就默认选中第一个（不能使用frontpage作为判断条件，防止在展现首页的情况下修改喜好设置出现的首页不刷新问题）
			if (visitType == 1 && $(".index_content_div").width()==0) {
				solutionView.isotopeItemClick(0);
			}
			else {
				if(frontPageAccess == 1){//当九宫格的访问方式为第一层数据时，加载第一层的解决方案组合解决方案到首页
					solutionService.getIsotopeFirstLevelData(initIsotopeData,_total,visitType);
				}else{//当九宫格的访问方式为所有解决方案时，加载所有解决方案到首页
					solutionService.getIsotopeData(initIsotopeData,_total,visitType);
				}
			}
		}
	};
	
	/**
	 * 首页面初始化
	 */
	var initIsotopeData = function(data,_total,visitType) {//visitType:0表示初始登录，1表示进出系统管理，2表示首页切换
		_favoriteData = null;//先清空喜好的数据
		_isotopeData = null;
		if (userKind != 1) {//非系统管理员
			if (isFromOrm) {//外部JSAPI方式
				getSolutionsFromOrm(data);
			}
			//获取订阅的喜好的解决方案
			solutionService.getFavPlatFormList(function(favData) {
				_favoriteData = favData;
				//若喜好的解决方案初始化为空，与全部选中的状态相同，展现所有的解决方案
				if(_favoriteData.length != 0){
					for ( var i = 0; i < data.length; i++) {
						var isExit = false;
						for (var j in favData) {
							if (data[i].pfId == favData[j].pfId) {
								isExit = true;
								break;
							}
						}
						if (!isExit) {
							data.splice(i, 1);
							i--;
						}
					}
				}
				_isotopeData = data;
				isotopeView.initData(data,_total,visitType);
			}, {file:'{"userKey":"' + userAcct + '"}'});
		}else {
			_isotopeData = data;
			isotopeView.initData(data,_total,visitType);
		}
//		if(visitType == 1){//如果加载的是系统管理下的解决方案，则不需要加载大图标
//			solutionView.isotopeItemClick(0);
//			return;
//		}
		
	};

	/**
	 * 渲染解决方案
	 * @param data
	 * @returns
	 */
	var randerSolution = function(data) {
		for(var i=0; i<data.length; i++){
			var solutionid = data[i].pfId;
			var parentId = data[i].parentId;
			solutionsDataMap.put(solutionid, data[i]);//将新增的解决方案信息缓存到map中
			var solutionname = data[i].pfName;
			var tempName = name_limit(solutionname,solutionLimit);		
			var title = "";
			var orderBy = data[i].orderBy;
			var iconNormal = data[i].picName;//解决方案常态的图标
			var picNormal = data[i].keyWord;
			if(tempName != solutionname){
				title = solutionname;
			}
			if (iconNormal == null || iconNormal == "") {
				iconNormal = _defNormalIcon;
			}
			var iconSelected = data[i].fileName;//解决方案选中的图标
			if (iconSelected == null || iconSelected == "") {
				iconSelected = _defSelectIcon;
			}
			if (picNormal == null || picNormal == "") {
				picNormal = _defNormalPic;
			}
			if(data[i].type == 0){
				var _solution_parent_li_hasChild_template = $.render($("#solution_parent_li_hasChild_template").html(),
						{solutionname:tempName,solutionid:solutionid,parentId:parentId,orderBy:orderBy,title:title,
						iconName:_iconPath+iconNormal,iconNormal:iconNormal,iconSelect:iconSelected,picNormal:picNormal});
				$("#solution_div_sidebar").append(_solution_parent_li_hasChild_template);
			}
			else{
				var _solution_parent_li_template = $.render($("#solution_parent_li_template").html(),
						{solutionname:tempName,solutionid:solutionid,parentId:parentId,orderBy:orderBy,title:title,
						iconName:_iconPath+iconNormal,iconNormal:iconNormal,iconSelect:iconSelected,picNormal:picNormal});
				$("#solution_div_sidebar").append(_solution_parent_li_template);
			}
		}
		if(_menutype == 1){//若菜单栏为默认展开状态
//			$('#working').css('left',_menuMaxWidth+'px');
			$('#solution_div_sidebar li').width(_menuMaxWidth);
		}else{//若菜单栏为默认收起状态
//			$('#working').css('left',_menuMinWidth+'px');
			narrowSolutionDetail();
			solutionView.narrowSolutionInit();
		}
//		if($("#menu_div").width() <= _menuMinWidth){//小图标状态下
//			narrowSolution();
//		}
		$("#menu_ul_parent").mCustomScrollbar("update");
	};
	
	/**
	 * 获取解决方案组下子节点并初始化
	 */
	var initSolutionsChildrenData = function($this, data, scanType, loadfirsttime,parentids){
		if (userKind != 1) {//非系统管理员
			if (isFromOrm) {//外部JSAPI方式
				getSolutionsFromOrm(data);
			}
			if(isFromOutOm){
				getOutOmPerssion.getSolutionsFromOutOm(data);
				randerSolutionChildren($this, data, scanType, loadfirsttime,parentids);
			}
			else{
				//获取订阅的喜好的解决方案
				//若喜好的解决方案初始化为空，与全部选中的状态相同，展现所有的解决方案
				if(_favoriteData.length != 0){
					for ( var i = 0; i < data.length; i++) {
						var isExit = false;
						for (var j in _favoriteData) {
							if (data[i].pfId == _favoriteData[j].pfId) {
								isExit = true;
								break;
							}
						}
						if (!isExit) {
							data.splice(i, 1);
							i--;
						}
					}
				}
				randerSolutionChildren($this, data, scanType, loadfirsttime,parentids);
			}
		}
		else {
			randerSolutionChildren($this, data, scanType, loadfirsttime,parentids);
		}
	};

	/**
	 * 展现并渲染解决方案组下的数据
	 * @param $this
	 * @param data
	 * @param scanType
	 * @returns
	 */
	var randerSolutionChildren = function($this, data, scanType, loadfirsttime,parentids) {
		var $solution_div_sidebar_child = $this.children(".solution_div_sidebar_child");
		if($solution_div_sidebar_child.length == 0){//防止重复加载
			var _solution_children_ul_template = $("#solution_children_ul_template").html();
			var outLevel = $this.parents("ul").length >= 2;//标识加载的解决方案是否大于等于第三层,是为true,否为false
			$this.append(_solution_children_ul_template);
			if($this.hasClass('firstparent')){
				$this.children('ul').addClass('firstparentul');
			}
			$ul = $this.children("ul");
			for(var i=0; i<data.length; i++){
				var solutionid = data[i].pfId;
				solutionsDataMap.put(solutionid, data[i]);//将新增的解决方案信息缓存到map中
				var solutionname = data[i].pfName;
				var parentId = data[i].parentId;
				var tempName = "";
				var title = "";
				var orderBy = data[i].orderBy;
				var _solution_children_li_template = "";
				if(outLevel){
					tempName = name_limit(solutionname,lowSolutionLimit);
				}
				else{
					tempName = name_limit(solutionname,solutionLimit);
				}
				if(tempName != solutionname){
					title = solutionname;
				}
				if(data[i].type == 0){
					_solution_children_li_template = $.render($("#solution_children_li_hasChild_template").html(),
							{solutionname:tempName,solutionid:solutionid,parentId:parentId,orderBy:orderBy,title:title});
				}else{
					_solution_children_li_template = $.render($("#solution_children_li_template").html(),
							{solutionname:tempName,solutionid:solutionid,parentId:parentId,orderBy:orderBy,title:title});
				}
				$ul.append(_solution_children_li_template);
				if(outLevel){//超过三层以上时，文字需向后移
					$($ul.children()[i]).children("div").find(".solution_name").addClass("solution_name_out_level");
				}
			}
			//hover模式下第二级目录以上的浏览方式和click模式相同，hover浏览模式第一级目录浏览方式有所不同
			if(parseInt($("#menu_div").width()) <= _menuMinWidth && $this.parents("ul").length == 1){//hover浏览模式
				initSolutionsChildrenHover($this);
			}else{//click浏览模式
				initSolutionsChildrenAnimate($this);
			}
		}else{
			if(loadfirsttime){
				if($solution_div_sidebar_child.is(":hidden")){
					$this.click();
				}
			}
		}
		if(loadfirsttime){
			var parentId = (parentids!=null && parentids.length != 0)?parentids:0;
			var $thisli = $($this.find("ul").find("li").eq(parentId));
			if(parentId != 0){
				$thisli = getIndexOfsolutions(parentId,$this.find("ul").find("li"));
			}
			if($thisli.hasClass("hasChild")){
				var scanType = 0;//浏览模式为click
				var loadfirsttime = true;
				var solutionid = $thisli.attr("solutionid");
				getSolutionsChildrenDataFromHttpUtil($thisli, {"pfId":solutionid}, scanType, loadfirsttime,parentId);
			}else{
				$thisli.click();
			}
		}
	};

	/**
	 * 展开解决方案组下子节点click
	 */
	var initSolutionsChildrenAnimate = function($this){
		//关闭除他父亲以外的所有展开项
		var $mouthopen = $("#solution_div_sidebar").find(".mouthopen");
		if(!$this.hasClass("firstparent")){
			var $thisparent = $this.parents(".firstparent");
		}else{
			$thisparent = $this;
		}
		if($mouthopen.attr("solutionid")!=null && $thisparent.attr("solutionid") != null && $mouthopen.attr("solutionid") != $thisparent.attr("solutionid")){
			$mouthopen.children(".solution_div_sidebar_child").hide();
			$mouthopen.removeClass("mouthopen");
			
			$($mouthopen.children()[0]).find(".arrow").removeClass("arrow-down");
			$($mouthopen.children()[0]).find(".arrow").addClass("arrow-left");	
		}
		$thisparent.addClass("mouthopen");
		
		//解决bug，当缩小情况下可能会导致展开的子解决方案有个top40的
		var $thisul = $this.find(".firstparentul");
		if ($thisul.css("top") != "0px") {
			$thisul.css("top", "0px");
		}
		
		var $solution_div_sidebar_child = $this.children(".solution_div_sidebar_child");
		if(!$solution_div_sidebar_child.is(":animated")){
			var _height = $solution_div_sidebar_child.height();
			$solution_div_sidebar_child.css("height","0");
			$solution_div_sidebar_child.show();
			if(parseInt($("#menu_div").width())<=_menuMinWidth && $this.parents("ul").length >=2){//hover模式下当解决方案大于等于第三层，修改文字缩进
				$solution_div_sidebar_child.find("li a").addClass("ttchanged_outLevel");
			}
			$solution_div_sidebar_child.animate({height:_height},400, function(){
				$solution_div_sidebar_child.css("height","auto");
				$("#menu_ul_parent").mCustomScrollbar("update");
				//为hover模式下的第二层以下解决方案组展开添加滚动条
				addScrollForHoverMode($this);
			});
		}
		if(_solutionMode == 0){//展现模式
			$($this.children()[0]).find(".arrow").removeClass("arrow-left");
			$($this.children()[0]).find(".arrow").addClass("arrow-down");
		}
	};

	/**
	 * 展开解决方案组下子节点hover
	 */
	var initSolutionsChildrenHover = function($this){
		if($this.children("div").hasClass("solution_div_sidebar_parent_li_f")){//判断展开时，鼠标是否在父解决方案上
			var _arrow = $this.children("div").find(".arrow");
			_arrow.show();
			_arrow.removeClass("arrow-left");
			_arrow.addClass("arrow-down");
			$this.children(".solution_div_sidebar_child").show();
		}		
		$this.find(".solution_div_sidebar_child_lichanged").width(_menuMaxWidth-_menuMinWidth);
		var $solution_div_sidebar_child = $this.children(".solution_div_sidebar_child");
		$solution_div_sidebar_child.addClass("solution_div_sidebar_child_ulchanged");
		$solution_div_sidebar_child.removeClass("solution_div_sidebar_child_click");
		$this.children('.firstparentul').addClass("solution_div_sidebar_child_hover");
		$solution_div_sidebar_child.find("li").addClass("solution_div_sidebar_child_lichanged");
		if($this.parents("ul").length >=2){//解决方案大于等于第三层
			$solution_div_sidebar_child.find("li a").addClass("ttchanged_outLevel");
		}
		else{
			$solution_div_sidebar_child.find("li a").addClass("ttchanged");
		}
		$solution_div_sidebar_child.find("li").width(_menuMaxWidth-_menuMinWidth);
		if($solution_div_sidebar_child.parent().hasClass("firstparent")){
			$solution_div_sidebar_child.addClass("firstchild_ul");
		}
		if(!$this.hasClass("firstparent")){//获取该解决方案组展开项ul对应的父亲节点li，也就是第一层目录
			var $thisparent = $this.parents(".firstparent");
		}else{
			var $thisparent = $this;
		}
		if($(window).height()-$thisparent.offset().top<3*_menuMinWidth+20){//如果选中的解决方案组在可视区域内的倒数三个，则将它的子节点反转显示在父节点上方
		//移动解决方案显示在其父亲上面
			moveChildrenOverParent($this);
		}else{//为超出的解决方案组子节点添加滚动条
			//为hover显示的解决方案组添加滚动条
			addSiderbarForHover($this);
		}
	};
	
	/**
	 * 移动孩子节点显示在父亲节点的上方
	 */
	var moveChildrenOverParent = function($this){
		if($this.children("ul").position().top != _menuMinWidth){//防止该移动事件触发两次
			return;
		}
		var $thisul = $this.find(".firstparentul");
		if($thisul.length != 0){//第二级目录向外展开时
			$thisul.height($thisul.children().length*_menuMinWidth);
			$thisul.css("top",-$thisul.children().length*_menuMinWidth-10+"px");
			//为向上显示的孩子节点添加滚动条
			addSiderbarForHover_rollback($this);
		}else{//第三级目录向外展开时
			$thisul = $this.children("ul");
			var $thisparentul = $thisul.parents(".firstparentul");
			$thisparentul.height($thisparentul.height()+$thisul.children().length*_menuMinWidth);
			$thisparentul.css("top",$thisparentul.position().top-$thisul.children().length*_menuMinWidth-5+"px");
			addSiderbarForHover_rollback_forthirdlevel($this);
		}
	};
	
	/**
	 * 为hover显示的解决方案组添加滚动条
	 */
	var addSiderbarForHover = function($this){
		if($this != null){
			if($this.hasClass("firstparent")){//当选中第一层级和第二层级时，获取第一层级li和展现的弹窗ul
				var $thisul = $this.find(".firstparentul");
				var $firstparent = $this;
			}else{
				var $thisul = $this.parents(".firstparentul");
				var $firstparent = $this.parents(".firstparent");
			}
			var ulHeight = $(window).height()-$firstparent.offset().top-_menuMinWidth;
			$thisul.css("top",_menuMinWidth+"px");
			$thisul.height("auto");
			if($thisul.height() > ulHeight){
				$thisul.height(ulHeight-10);
				$thisul.css("overflow","hidden");
				if($thisul.hasClass("mCustomScrollbar")){//防止重复绑定滚动条
					$thisul.mCustomScrollbar("update");
				}else{
					$thisul.mCustomScrollbar();
				}
			}else{
				if($thisul.hasClass("mCustomScrollbar")){//防止重复绑定滚动条
					$thisul.mCustomScrollbar("update");
				}
			}
		}
	};
	/**
	 * 为hover移除的解决方案组添加滚动条
	 */
	var removeSiderbarForHover = function($this){
		var $thisul = $this.find(".firstparentul");
		$thisul.css("top",0);
		$thisul.mCustomScrollbar("destroy");
	};
	/**
	 * 为反转向上显示的解决方案组添加滚动条
	 */
	var addSiderbarForHover_rollback = function($this){
		if($this != null){
			var ulHeight = $this.offset().top-_menuMinWidth;
			var $thisul = $this.find(".firstparentul");
			$thisul.height($thisul.children().length*_menuMinWidth);
			if($thisul.height() > ulHeight){
				$thisul.css("top",-ulHeight+"px");
				$thisul.height(ulHeight-10);
				$thisul.css("overflow","hidden");
				$thisul.mCustomScrollbar();
			}else{
				$thisul.css("top",-$thisul.height()-10+"px");
			}
		}
	};
	/**
	 * 为反转向上的第三级目录显示的解决方案组添加滚动条
	 */
	var addSiderbarForHover_rollback_forthirdlevel = function($this){
		if($this != null){
			if(!$this.hasClass("firstparent")){//当选中第一层级和第二层级时，获取第一层级li和展现的弹窗ul
				$thisparent = $this.parents(".firstparent");
			}else{
				$thisparent = $this;
			}
			$thisul = $thisparent.find(".firstparentul");
			var ulHeight = $thisparent.offset().top-_menuMinWidth;
//			$thisul.height($thisul.children().length*_menuMinWidth);
			if($thisul.height() > ulHeight){
				$thisul.css("top",-ulHeight+"px");
				$thisul.height(ulHeight-10);
				$thisul.css("overflow","hidden");
				if(!$thisul.hasClass("mCustomScrollbar")){//防止重复绑定滚动条
					$thisul.mCustomScrollbar();
				}
				else{
					$thisul.mCustomScrollbar("update");
				}
			}
		}
	};
	
	/**
	 * 绑定解决方案（组）点击事件
	 */
	var bindSolutionSidebarClick = function(){
		$("#solution_div_sidebar li").die("click").live("click",function(){
			var $this = $(this);
			var scanType = 0;//浏览模式为click
			if($this.attr("class")!=null && $this.hasClass("hasChild")){//当解决方案组被点击
				var $solution_div_sidebar_child = $this.children(".solution_div_sidebar_child");
				if($solution_div_sidebar_child.length == 0){//若解决方案组的子节点未加载
					//加载解决方案组下的解决方案
					var solutionid = $this.attr("solutionid");
					getSolutionsChildrenDataFromHttpUtil($this, {"pfId":solutionid}, scanType);
				}else{
					if($solution_div_sidebar_child.is(":hidden")){//子ul未展开
						//hover模式下第二级目录以上的浏览方式和click模式相同，hover浏览模式第一级目录浏览方式有所不同
						if(parseInt($("#menu_div").width()) <= 40 && $this.parents("ul").length == 1){//hover浏览模式
							initSolutionsChildrenHover($this);
						}else{//click浏览模式
							initSolutionsChildrenAnimate($this);
						}
					}else{//子ul已展开
						if(!$solution_div_sidebar_child.is(":animated")){
							var _height = $solution_div_sidebar_child.height();
							$solution_div_sidebar_child.animate({height:0},400,function(){
								$solution_div_sidebar_child.hide();
								$solution_div_sidebar_child.css("height",_height+"px");
								$("#menu_ul_parent").mCustomScrollbar("update");
								//为hover模式下的第二层以下解决方案组展开添加滚动条
								addScrollForHoverMode($this);
							});
						}
						if(_solutionMode == 0){//展现模式
							$($this.children()[0]).find(".arrow").removeClass("arrow-down");
							$($this.children()[0]).find(".arrow").addClass("arrow-left");
						}
					}
				}
			}else{//当解决方案被点击
				initSolutionsChildrenAnimate($this);
				if(!$this.hasClass("active")){
					//先去掉旧的样式
					var $oldSelectedDiv = null;//
					$("#solution_div_sidebar .active").each(function(){
						if (!$(this).hasClass("hasChild")) {
							$oldSelectedDiv = $(this);
							return false;//跳出each
						}
					});
					if ($oldSelectedDiv != null) {
						if(!_isSystemManager && _solutionMode == 1){//没有进入系统管理,并是编辑模式
							if(isFromOrm){//外部JS方式
								if(!ORMPermissionWorking('SAVE')){//是否有权限进行自动保存
									workingView.saveSolutionWorkspace($oldSelectedDiv, solutionsDataMap);//保存编辑过的解决方案
								}
							}
							else if(isFromOutOm){//外部接口权限
								if(!outOmPermissionWorking('CDT-05', 3)){//是否有权限进行自动保存
									workingView.saveSolutionWorkspace($oldSelectedDiv, solutionsDataMap);//保存编辑过的解决方案
								}
							}
							else{
								if(!cdtPermissionWorking('CDT-05', 3)){//是否有权限进行自动保存
									workingView.saveSolutionWorkspace($oldSelectedDiv, solutionsDataMap);//保存编辑过的解决方案
								}
							}
						}
					}
					$oldSelectedDiv = $("#solution_div_sidebar").find(".active");
					chageIconCss($oldSelectedDiv, "iconNormal");
					$oldSelectedDiv.removeClass("active");
					//再改变当前点击的样式
					$this.addClass("active");
					if($this.hasClass("firstparent")){//第一层解决方案
						//改变图标为选中状态
						chageIconCss($this, "iconSelect");
					}
					else{//不是第一层解决方案，需要改变第一层解决方案为选中状态
						var _firstparent = $this.parents(".firstparent");
						_firstparent.addClass("active");
						chageIconCss(_firstparent, "iconSelect");
					}
					if(_solutionMode == 1){//编辑模式
						if($this.hasClass("firstparent")){
							$this.find(".tools-delete").removeClass("tools-delete-n");
							$this.find(".tools-delete").addClass("tools-delete-s");
							$this.find(".tools-rename").removeClass("tools-rename-n");
							$this.find(".tools-rename").addClass("tools-rename-s");
						}
					}
					// 载入解决方案到右侧工作区
					readContentFromUrl($this);
				}
			}
			$("#menu_ul_parent").mCustomScrollbar("update");
			if(!$this.hasClass("hasChild")){
				$this.mouseleave();//第一层的第一项是解决方案组，通过首页进入时，防止在程序hover和click后有子解决方案残留在页面上
			}
			return false;//防止点击事件冒泡
		});
	};
	
	/**
	 * 为hover模式下的第二层以下解决方案组展开添加滚动条
	 */
	var addScrollForHoverMode = function($this){
		if(parseInt($("#menu_div").width()) <= _menuMinWidth && $this.parents("ul").length >= 2){
			if(!$this.hasClass("firstparent")){//当选中第一层级和第二层级时，获取第一层级li
				var $thisparent = $this.parents(".firstparent");
			}else{
				var $thisparent = $this;
			}
			if($(window).height()-$thisparent.offset().top<3*_menuMinWidth+20){
				//移动解决方案显示在其父亲上面
				moveChildrenOverParent($this);
			}else{
				//为hover显示的解决方案组添加滚动条
				addSiderbarForHover($this);
			}
		}
	};

	/**
	 * 改变解决方案的图标样式
	 * @param docObject
	 * @returns
	 */
	var chageIconCss = function(docObject, attrName) {
		var iconObj = docObject.find(".solutionpic");
		var selectedIcon = _iconPath + iconObj.attr(attrName);
		iconObj.css("background-image", "url('" + selectedIcon + "')");
		iconObj.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + selectedIcon + "', sizingMethod='scale')");
	};
	
	/**
	 * 取消绑定解决方案（组）点击事件
	 */
	var unbindSolutionSidebarClick = function(){
		$("#solution_div_sidebar li").die("click");
	};
	
	/**
	 * 点击解决方案后，载入解决方案到右侧工作区
	 */
	var readContentFromUrl = function($this) {
		var solutionid = $this.attr("solutionid");
		var data = null;
		if ((data = solutionsDataMap.get(solutionid)) != null) {
			if(!_isSystemManager && _solutionMode == 0){//没有进入系统管理,并是浏览模式
				//保存解决方案访问日志(系统管理员是否也要记录日志，现在是记录的)
				var platformLog = {userName:userName,pfId:solutionid};
				solutionService.savePlatFormLog(null, {file:JSON2.stringify(platformLog)});
			}
			// 两种载入方式
			var url = data.url;
			if (url == null || url == "") {// 方式一：多标签
				// 清空工作区
				var $workspace = $("#working");
				$workspace.empty();
				GCUtil.doGC();
				var workingData = data.describe;
				if (workingData && workingData.length > 0) {
					var _children = data.describe[0].panels;
					// 清空工作区
					var $workspace = $("#working");
					$workspace.empty();
					//模板方式：length为1且有templateId(0为无模板！)
					if(_children.length==1&&_children[0].templateId&&_children[0].templateId!="0"){
						var _templatePanel = _children[0];
						var _html = _templatePanel.html;
						messageCenter.callMessage('CREATE_TEMPLATE', {workspace:$workspace,html:_html});
					}else{ //非模板模式
//						$workspace.append('<div id="workspace_content"></div>');
//						var _height = 0, _width = 0;
						for ( var j = 0; j < _children.length; j++) {
							var solution_workspace = "solution_workspace";
							var pfName = _children[j].head;
							var url = _children[j].url;
							var width = _children[j].width;
							var height = _children[j].height;
							var left = _children[j].x;
							var top = _children[j].y;
							var isMax = _children[j].isMax;
							var titleBgColor = "";
							var titleFontSize = "";
							var titleConfig = _children[j].titleConfig;
//							var theMostTallOne = parseInt(height)+parseInt(top);
//							var theMostWideOne = Math.round(parseFloat(width) * 0.01 * parseFloat($(window).width()-$("#menu_div").width()))+Math.round(parseFloat(left) * 0.01 * parseFloat($(window).width()-$("#menu_div").width()));
//							_width = (_width<theMostWideOne)?theMostWideOne: _width;
//							_height = (_height<theMostTallOne)?theMostTallOne:_height;
							if (titleConfig) {
								if (titleConfig.titleBgColor && titleConfig.titleBgColor != "") {
									titleBgColor = titleConfig.titleBgColor;
								}
								else {
									titleBgColor = _defaultTitleConfig.titleBgColor;
								}
								if (titleConfig.titleFontSize && titleConfig.titleFontSize != "") {
									titleFontSize = titleConfig.titleFontSize;
								}
								else {
									titleFontSize = _defaultTitleConfig.titleFontSize;
								}
							}
							else {
								titleBgColor = _defaultTitleConfig.titleBgColor;
								titleFontSize = _defaultTitleConfig.titleFontSize;
							}
							if (isMax == true) {//最大化情况下
								height = $("#working").height();
							}
							else {
								isMax = false;
							}
							var _param = {"solution_workspace":solution_workspace,"pfName":pfName,"url":url,"width":width,"height":height,"isMax":isMax,
									"left":left,"top":top,"titleBgColor":titleBgColor,"titleFontSize":titleFontSize,isShowTitle:true,
									title:"label0_space"+j};//为了兼容以前保留title属性
							messageCenter.callMessage('CREATE_IFRAME', {workspace:$workspace, param:_param, showBorder:true, saveData:true});
						}
//						$("#workspace_content").width(_width);
//						$("#workspace_content").height(_height);
//						$("#working").mCustomScrollbar({
//							axis:"yx",
//							theme:"3d"
//						});
					}
				}
			}
			else {// 方式二：单标签
				var solution_workspace = "solution_workspace_url";
				var pfName = data.pfName;
				var url = data.url;
				var isShowTitle = true;
				var solutionOpt = data.describe;
				var titleBgColor = "";
				var titleFontSize = "";
				if (solutionOpt) {
					if (solutionOpt.titleBgColor && solutionOpt.titleBgColor != "") {
						titleBgColor = solutionOpt.titleBgColor;
					}
					else {
						titleBgColor = _defaultTitleConfig.titleBgColor;
						solutionOpt.titleBgColor = titleBgColor;
					}
					if (solutionOpt.titleFontSize && solutionOpt.titleFontSize != "") {
						titleFontSize = solutionOpt.titleFontSize;
					}
					else {
						titleFontSize = _defaultTitleConfig.titleFontSize;
						solutionOpt.titleFontSize = titleFontSize;
					}
					isShowTitle = solutionOpt.isShowTitle;
					data.describe = solutionOpt;
				}
				else {
					titleBgColor = _defaultTitleConfig.titleBgColor;
					titleFontSize = _defaultTitleConfig.titleFontSize;
					data.describe = {titleBgColor:titleBgColor, titleFontSize:titleFontSize};
				}
				//describe更新到solutionsDataMap中
				solutionsDataMap.remove(solutionid);
				solutionsDataMap.put(solutionid, data);
				var width = $(window).width() - $("#menu_ul_parent").width() + "px";
				var height = $(window).height() - $("#top_div").height() + "px";
				var left = "0px";
				var top = "0px";
				var _param = {"solution_workspace":solution_workspace,"pfName":pfName,"url":url,"width":width,"height":height,"left":left,"top":top,"titleBgColor":titleBgColor,"titleFontSize":titleFontSize,isShowTitle:isShowTitle};
				var $workspace = $("#working");
				var $solution_workspace_url = $("#working").find(".solution_workspace_url");
				if ($solution_workspace_url.length == 0) {//不存在URL方式的
//					$workspace.find(".solution_workspace").remove();//清除原来的内容
					$workspace.empty();//清空工作区
					GCUtil.doGC();
					messageCenter.callMessage('CREATE_IFRAME', {workspace:$workspace,param:_param, showBorder:false, saveData:false});
				}
				else {//存在URL方式的，重新载入URL
					messageCenter.callMessage('RELOAD_IFRAME', {workspace:$solution_workspace_url,param:_param});
				}
			}
		}
	};

	/**
	 * 为工作区模块添加的事件
	 */
	var solutionWorkspaceEvent = function() {
		var $frameTitle = $("#working .frameTitle");
		var $frameTitleConfig = $("#working .frameTitle .frame_title_config");
		var $frameTitleClose = $("#working .frameTitle .frame_title_close");
		$frameTitle.die('hover').live('hover', function(event) {// 工作区标题鼠标移入移出事件
			var $this = $(this);
			if (event.type == 'mouseenter') {
				if (_isSystemManager == false) {//系统管理模式不出现
					if(isFromOrm){
						if(!ORMPermissionWorking('COMPONENTDELETE')){
							$this.children(".frame_title_config").show();
						}
					}
					else if(isFromOutOm){//外部接口权限
						//只要有解决方案新增或者修改权限，才显示标题设置按钮
						if(!outOmPermissionWorking("CDT-02", 0) || !outOmPermissionWorking("CDT-02", 2)){
							$this.children(".frame_title_config").show();
						}
					}
					else{
						//只要有解决方案新增或者修改权限，才显示标题设置按钮
						if(!cdtPermissionWorking("CDT-02", 0) || !cdtPermissionWorking("CDT-02", 2)){
							$this.children(".frame_title_config").show();
						}
						/*if(!cdtPermissionWorking('CDT-03', 1)){
							$this.children(".frame_title_config").show();
						}*/
					}
					
					if ($("#working").find(".solution_workspace").length > 0) {//非URL模式
						if(isFromOrm){
							if(!ORMPermissionWorking('COMPONENTDELETE')){
								$this.children(".frame_title_close").show();
							}
						}
						else if(isFromOutOm){//外部接口权限
							if(!outOmPermissionWorking("CDT-02", 0) || !outOmPermissionWorking("CDT-02", 2)){
								$this.children(".frame_title_close").show();
							}
						}
						else{
							//只要有解决方案新增或者修改权限，才显示标题关闭按钮
							if(!cdtPermissionWorking("CDT-02", 0) || !cdtPermissionWorking("CDT-02", 2)){
								$this.children(".frame_title_close").show();
							}
							/*if(!cdtPermissionWorking('CDT-03', 1)){
								$this.children(".frame_title_close").show();
							}*/
						}
					}
				}
				return false;// 禁止冒泡
			} else if (event.type == 'mouseleave') {
				if (_isSystemManager == false) {
					$this.children(".frame_title_config").hide();
					if ($("#working").find(".solution_workspace").length > 0) {//非URL模式
						$this.children(".frame_title_close").hide();
					}
				}
				return false;
			}
		}).die('dblclick').live('dblclick',function(event){ //双击事件
			var _panel = $(this).parent();
			workingView.togglePanelMax(_panel);
		});
		
		$frameTitleConfig.die('hover').live('hover', function(event) {//设置按钮
			var $this = $(this);
			if (event.type == 'mouseenter') {
				$this.removeClass("frame_title_config_n");
				$this.addClass("frame_title_config_f");
				return false;// 禁止冒泡
			} else if (event.type == 'mouseleave') {
				$this.removeClass("frame_title_config_f");
				$this.addClass("frame_title_config_n");
				return false;
			}
		});
		
		$frameTitleClose.die('hover').live('hover', function(event) {//panel关闭按钮
			var $this = $(this);
			if (event.type == 'mouseenter') {
				$this.removeClass("frame_title_close_n");
				$this.addClass("frame_title_close_f");
				return false;// 禁止冒泡
			} else if (event.type == 'mouseleave') {
				$this.removeClass("frame_title_close_f");
				$this.addClass("frame_title_close_n");
				return false;
			}
		});
		
		$frameTitleClose.die('click').live('click', function(event) {//panel关闭按钮点击事件
			var $this = $(this);
			var $panel = $this.parent().parent();
			var $iframe = $panel.find("iframe");//iframe
			$iframe.attr("src", "about:blank");
			$iframe.remove();
			$panel.remove();
			GCUtil.doGC();
		});
		
		$frameTitleConfig.die('click').live('click',function(event) {// 工作区标题鼠标点击事件
			var $frameTitle = $(this).parent();
			var _frameTitleConfigTemplate = $("#frameTitleConfig_template").html();
			$(".all_background").show();
			$("body").append(_frameTitleConfigTemplate);
			var $solution_workspace = $("#working").find(".solution_workspace");
			var $solution_workspace_url = $("#working").find(".solution_workspace_url");
			var titleBgColor = $frameTitle.css("background-color");
			if(titleBgColor.indexOf("#") != 0){
				titleBgColor = titleBgColor.colorHex();
			}
			$("#titleBgColor").val(titleBgColor);
			$("#titleFontSize").val($($frameTitle.children("span")[0]).css("font-size"));
			if($solution_workspace.length != 0){//不存在URL方式
				$("#frameTitleConfigWin").find("h4").html("构件配置");
				$("#frameTitleConfigWin").css("height","345px");
				$("#frameTitleConfigWin").css("margin-top","-172px");
				var _panel = $frameTitle.parent();
				var _panelState = _panel.data("panelState")||{};
				var _allW = $("#working").width();
				$("#panelPositionX").val(parseInt(_panel.css("left")));
				$("#panelWidth").val(parseInt(_panel.css("width"))+ 2);
				$("#panelPositionY").val(parseInt(_panelState.y||_panel.css("top")));
				$("#panelHeight").val(parseInt(_panelState.h||_panel.css("height")) + 2);
				$("#frameTitleConfigWin").find("table tr:gt(2):lt(4)").show();
			}else if($solution_workspace_url.length != 0){//存在URL方式
				$("#frameTitleConfigWin").find("h4").html("标题栏配置");
				$("#frameTitleConfigWin").css("height","");
				$("#frameTitleConfigWin").find("table tr:gt(2):lt(4)").hide();
			}
			if(!($._data($("#frameTitleConfigWin .window_close").get(0), "events") != undefined
					&& $._data($("#frameTitleConfigWin .window_close").get(0), "events")["click"] != undefined)){//关闭按钮
				var defaultColor = "";// 默认颜色配置
				$("#titleBgColor").minicolors( {
					control : 'hue',
					defaultValue : defaultColor,
					inline : false,
					letterCase : 'uppercase',
					position : 'bottom left',
					change : function(hex, opacity) {
						// alert($("#titleBgColor").minicolors("value"));
					},
					theme : 'frameTitleConfig'
				});
				$("#frameTitleConfigWin .window_close").bind('click',function(event) {// 关闭工作区编辑框体
					$(".all_background").hide();
					$("#frameTitleConfigWin").remove();
				});
				$("#frameTitleConfigWin .cancel").bind('click',function(event){
					$("#frameTitleConfigWin .window_close").click();
				});
				$("#frameTitleConfigWin .confirm").bind('click',function(event){
					var titleBgColor = $("#titleBgColor").val();
					var titleFontSize = $("#titleFontSize").val();
					if(titleBgColor!=""){
						$frameTitle.css("background-color",titleBgColor);
					}
					if(titleFontSize!=""){
						if (titleFontSize.indexOf("px") != -1) {
							$($frameTitle.children()[0]).css("font-size",titleFontSize);
						}
						else {
							$($frameTitle.children()[0]).css("font-size",titleFontSize+"px");
						}
					}
					var $frame = $frameTitle.parent();
					var $iframe = $frame.find("iframe");
					var $solution_workspace = $("#working").find(".solution_workspace");
					var $solution_workspace_url = $("#working").find(".solution_workspace_url");
					if($solution_workspace.length != 0){//不存在URL方式
						var panelPositionX = $("#panelPositionX").val();
						var panelPositionY = $("#panelPositionY").val();
						var panelWidth = $("#panelWidth").val();
						var panelHeight = $("#panelHeight").val();
						if(panelPositionX == ""){
							panelPositionX = $frame.css("left");
						}
						if(panelPositionY == ""){
							panelPositionY = $frame.css("top");
						}
						if(panelWidth == ""){
							panelWidth = $frame.css("width");
						}
						if(panelHeight == ""){
							panelHeight = $frame.css("height");
						}
						panelWidth = parseInt(panelWidth)-2;//减去2px的边框
						panelHeight = parseInt(panelHeight)-2;//减去2px的边框
						$frameTitle.css("width",panelWidth+"px");
						$frame.css("left",panelPositionX+"px");
						$frame.css("top",panelPositionY+"px");
						$frame.css("width",panelWidth+"px");
						$frame.css("height",panelHeight+"px");
						$iframe.css("width",panelWidth+"px");
						var _iframeHeight = parseInt(panelHeight)-parseInt($frameTitle.height())-1;
						$iframe.css("height",_iframeHeight+"px");
						var _oldOption = $frame.data("panelOption");
						workingView.updatePanelAllOption(_oldOption, {
							x : panelPositionX+"px",
							y : panelPositionY+"px",
							width : panelWidth+"px",
							height : panelHeight+"px",
							titleBgColor : titleBgColor,
							titleFontSize : titleFontSize,
							isShowTitle : true
						});
					}
					$("#frameTitleConfigWin .window_close").click();
				});
			}
		});
	};

	

	/**
	 * 绑定解决方案（组）hover事件
	 */
	var bindSolutionSidebarClickHover = function(){
		$('#solution_div_sidebar li .sidebar_div').die('hover').live('hover', function(event){//第一层解决方案（组）标题鼠标移入移出事件
			if ($("#menu_operate_div").is(":animated"))//在取消编辑的动画过程中，防止左侧菜单出现编辑和删除按钮
				return;
			var $this = $(this);
			var _class_n ="solution_div_sidebar_parent_li_n";
			var _class_f = "solution_div_sidebar_parent_li_f";
			if (event.type =='mouseenter'){//鼠标移入
				$this.removeClass(_class_n);
				$this.addClass(_class_f);
				if(_solutionMode == 1){//编辑模式
					if($this.parent().hasClass("hasChild")){//解决方案组
						var _arrow = $this.find(".arrow");
						var _rename = $this.find(".tools-rename");
						_arrow.removeClass(_arrow.attr("class"));
						_rename.removeClass(_rename.attr("class"));
						if($this.parent().hasClass("active")){
							_arrow.addClass("tools-delete tools-delete-s icon-trash");
							_rename.addClass("tools-rename tools-rename-s icon-pencil");
						}
						else{
							_arrow.addClass("tools-delete tools-delete-n icon-trash");
							_rename.addClass("tools-rename tools-rename-n icon-pencil");
						}
						if(isFromOrm){
							if(!ORMPermissionWorking('SOLUTIONDELETE')){
								_arrow.show();
							}
							if(!ORMPermissionWorking('SOLUTIONCHANGE')){
								_rename.show();
							}
						}
						else if(isFromOutOm){//外部接口权限
							if(!outOmPermissionWorking('CDT-02', 1)){
								_arrow.show();
							}
							if(!outOmPermissionWorking('CDT-02', 2)){
								_rename.show();
							}
						}
						else{
							if(!cdtPermissionWorking('CDT-02', 1)){
								_arrow.show();
							}
							if(!cdtPermissionWorking('CDT-02', 2)){
								_rename.show();
							}
						}
					}
					else{//解决方案
						var _delete = $this.find(".tools-delete");
						var _rename = $this.find(".tools-rename");
						_delete.removeClass(_delete.attr("class"));
						_rename.removeClass(_rename.attr("class"));
						if($this.parent().hasClass("active")){
							_delete.addClass("tools-delete tools-delete-s icon-trash");
							_rename.addClass("tools-rename tools-rename-s icon-pencil");
						}
						else{
							_delete.addClass("tools-delete tools-delete-n icon-trash");
							_rename.addClass("tools-rename tools-rename-n icon-pencil");
						}	
						if(isFromOrm){
							if(!ORMPermissionWorking('SOLUTIONDELETE')){
								_delete.show();
							}
							if(!ORMPermissionWorking('SOLUTIONCHANGE')){
								_rename.show();
							}
						}
						else if(isFromOutOm){//外部接口权限
							if(!outOmPermissionWorking('CDT-02', 1)){
								_delete.show();
							}
							if(!outOmPermissionWorking('CDT-02', 2)){
								_rename.show();
							}
						}
						else{
							if(!cdtPermissionWorking('CDT-02', 1)){
								_delete.show();
							}
							if(!cdtPermissionWorking('CDT-02', 2)){
								_rename.show();
							}
						}
					}
				}
												
		        return false;// 禁止冒泡
		    }else if(event.type =='mouseleave'){//鼠标移出
				$this.removeClass(_class_f);
				$this.addClass(_class_n);
								
				//需要判断是否为编辑模式
				if(_solutionMode == 1){//编辑模式
					if($this.parent().hasClass("hasChild")){//解决方案组
						var _delete = $this.find(".tools-delete");
						_delete.removeClass(_delete.attr("class"));
						if($this.nextAll("ul").length > 0 && $this.nextAll("ul").is(":visible")){//解决方案组已展开
							_delete.addClass("arrow arrow-down");
						}
						else{
							_delete.addClass("arrow arrow-left");
						}					
						$this.find(".tools-rename").hide();	
					}
					else{//解决方案
						$this.find(".tools-delete").hide();
						$this.find(".tools-rename").hide();					
					}
				}
				
		        return false;
		    }
		});
		$('#solution_div_sidebar .solution_div_sidebar_child li div').die('hover').live('hover', function(event){//其它层解决方案（组）标题鼠标移入移出事件
			if ($("#menu_operate_div").is(":animated"))//在取消编辑的动画过程中，防止左侧菜单出现编辑和删除按钮
				return;
			var $this = $(this);
			var _class_n ="solution_div_sidebar_child_li_n";
			var _class_f = "solution_div_sidebar_parent_li_f";
			if (event.type =='mouseenter'){//鼠标移入
				$this.removeClass(_class_n);
				$this.addClass(_class_f);
				
				if(_solutionMode == 1){//编辑模式
					if($this.parent().hasClass("hasChild")){//解决方案组
						var _arrow = $this.find(".arrow");
						_arrow.removeClass(_arrow.attr("class"));
						_arrow.addClass("tools-delete tools-delete-n icon-trash");
						_arrow.show();
						$this.find(".tools-rename").show();
					}
					else{//解决方案
						$this.find(".tools-delete").show();
						$this.find(".tools-rename").show();
					}
				}
		        return false;// 禁止冒泡
		    }else if(event.type =='mouseleave'){
				$this.removeClass(_class_f);
				$this.addClass(_class_n);
				
				//需要判断是否为编辑模式
				if(_solutionMode == 1){//编辑模式
					if($this.parent().hasClass("hasChild")){//解决方案组
						var _delete = $this.find(".tools-delete");
						_delete.removeClass(_delete.attr("class"));
						if($this.nextAll("ul").length > 0 && $this.nextAll("ul").is(":visible")){//解决方案组已展开
							_delete.addClass("arrow arrow-down");
						}
						else{
							_delete.addClass("arrow arrow-left");
						}
						$this.find(".tools-rename").hide();	
					}
					else{//解决方案
						$this.find(".tools-delete").hide();
						$this.find(".tools-rename").hide();					
					}
				}
		        return false;
		    }
		});
	};
	/**
	 * 取消绑定解决方案（组）hover事件
	 */
	var unbindSolutionSidebarClickHover = function(){
		$('#solution_div_sidebar li .sidebar_div').die('hover');
		$('#solution_div_sidebar .solution_div_sidebar_child li div').die('hover');
	};
	
	/**
	 * 当解决方案组切换到小图标模式，绑定解决方案（组）hover事件
	 */
	var bindSolutionSidebarHover = function(){
		$("#solution_div_sidebar li").die("hover").live("hover",function(event){
			if (event.type == "mouseenter"){//鼠标移入
				var $this = $(this);
				var scanType = 1;//浏览模式为hover
				if($(this).hasClass("firstparent"))//选中第一层级解决方案，定义宽度
					$this.width(_menuMaxWidth);
				$this.find(".solution_div_sidebar_child_lichanged").width(_menuMaxWidth-_menuMinWidth);
				$this.find(".wordspan").show();
				
				if($this.attr("class")!=null && $this.hasClass("hasChild")){
					var $solution_div_sidebar_child = $this.children(".solution_div_sidebar_child");
					if($this.parents("ul").length >= 2){//取消第二层级以下目录的自动展开
						return;
					}
					if($solution_div_sidebar_child.length == 0){//若解决方案组的子节点未加载
						//加载解决方案组下的解决方案
						var solutionid = $this.attr("solutionid");
						getSolutionsChildrenDataFromHttpUtil($this, {"pfId":solutionid}, scanType);
					}
					else{
						var _arrow = $this.children("div").find(".arrow");
						_arrow.show();
						_arrow.removeClass("arrow-left");
						_arrow.addClass("arrow-down");
						//解决如下问题：当解决方案为展开的状态下，选中二级目录任一项，然后切换到hover模式，该二级目录无法展开
						$this.children(".solution_div_sidebar_child").css("overflow","inherit");
						$this.children(".solution_div_sidebar_child").show();
						if($this.parents("ul").length >= 2){//显示的解决方案大于等于第三层时
							$this.children(".solution_div_sidebar_child").children().each(function(){
								if(!$(this).find("a").hasClass("ttchanged_outLevel")){
									$(this).find("a").addClass("ttchanged_outLevel");
								}
							});
						}
						if(!$this.hasClass("firstparent")){//当选中第一层级和第二层级时，获取第一层级li
							var $thisparent = $this.parents(".firstparent");
						}else{
							var $thisparent = $this;
						}
						if($(window).height()-$thisparent.offset().top<3*_menuMinWidth+20){
							//移动解决方案显示在其父亲上面
							moveChildrenOverParent($this);
						}else{
							//为hover显示的解决方案组添加滚动条
							addSiderbarForHover($this);
						}
					}
				}
				if($this.hasClass("firstparent")){
					var _class_n = "solution_div_sidebar_parent_li_n";
					var _class_f = "solution_div_sidebar_parent_li_f";
					$this.children("div").removeClass(_class_n);
					$this.children("div").addClass(_class_f);
				}else{
					var _class_n = "solution_div_sidebar_child_li_n";
					var _class_f = "solution_div_sidebar_parent_li_f";
					$this.children("div").removeClass(_class_n);
					$this.children("div").addClass(_class_f);
					$this.width(_menuMaxWidth-_menuMinWidth);
				}
//				return false;
			}
			else if(event.type = "mouseleave"){
				var $this = $(this);
				if(!$this.hasClass('firstparent')){
					var _class_n ="solution_div_sidebar_child_li_n";
					var _class_f = "solution_div_sidebar_parent_li_f";
					$this.children("div").removeClass(_class_f);
					$this.children("div").addClass(_class_n);
					return;
				}
				$this.find(".wordspan").hide();
				$this.width(_menuMinWidth);
				$this.find(".solution_div_sidebar_child_lichanged").width(_menuMaxWidth-_menuMinWidth);
				
				if($this.attr("class")!=null && $this.hasClass("hasChild")){				
					var _arrow = $this.children("div").find(".arrow");
					if($this.hasClass("firstparent")){
						_arrow.hide();
					}
					$this.find(".arrow").removeClass("arrow-down");
					$this.find(".arrow").addClass("arrow-left");
					$this.find(".solution_div_sidebar_child").hide();
				}
				if($this.hasClass("firstparent")){
					var _class_n ="solution_div_sidebar_parent_li_n";
					var _class_f = "solution_div_sidebar_parent_li_f";
					$this.children("div").removeClass(_class_f);
					$this.children("div").addClass(_class_n);
					removeSiderbarForHover($this);
				}else{
					var _class_n ="solution_div_sidebar_child_li_n";
					var _class_f = "solution_div_sidebar_parent_li_f";
					$this.children("div").removeClass(_class_f);
					$this.children("div").addClass(_class_n);
					$this.width(_menuMaxWidth-_menuMinWidth);
				}
				//设置第一层级li高度自适应
				var $firstparentul = $(this).find(".firstparentul");
				if($firstparentul == null){
					$(this).parents(".firstparentul").height("auto");
				}else{
					$firstparentul.height("auto");
				}
//				return false;
			}
		});
	};
	/**
	 * 绑定解决方案（组）编辑和删除按钮事件
	 */
	var bindSolutionEditClick = function(){
		//删除解决方案点击事件
		$("#solution_div_sidebar li .tools-delete").die("click").live("click",function(e){
			var solutionObj = $(this).parent().parent();
			var pfId = solutionObj.attr("solutionid");
			var solutionData = solutionsDataMap.get(pfId);;			
			solutionWindowView.initDeleteSolutionWindow(solutionData);
			e.stopPropagation();
		});
		//编辑解决方案点击事件	
		$("#solution_div_sidebar li .tools-rename").die("click").live("click",function(e){
			var solutionObj = $(this).parent().parent();
			var pfId = solutionObj.attr("solutionid");
			var solutionData = solutionsDataMap.get(pfId);
			type = solutionData.type;
			if(type == 0){//解决方案组				
				solutionWindowView.initNewSolutionsWindow(solutionData);
			}
			else if(type == 1){//解决方案
				solutionWindowView.initNewSolutionWindow(solutionData);
			}
			e.stopPropagation();
		});
	};
	
	/**
	 * 取消绑定解决方案（组）hover事件
	 */
	var unbindSolutionSidebarHover = function(){
		$("#solution_div_sidebar li").die("hover");
	};
	
	/**
	 * 缩小状态下的解决方案（组）;
	 * @returns
	 */
	var narrowSolution = function(){
		//取消点击事件
		unbindSolutionSidebarClickHover();
		$("#solution_div_sidebar .solution_div_sidebar_child").hide();//隐藏所有打开的解决方案组
		$("#solution_div_sidebar").find(".arrow").each(function(){//有解决方案组展开时，改变展开图标
			var $this = $(this);
			if($this.hasClass("arrow-down")){
				$this.removeClass("arrow-down");
				$this.addClass("arrow-left");
			}
		});
		if(parseInt($("#menu_div").width()) != _menuMinWidth){
			$("#menu_div").animate({width:_menuMinWidth},{easing: 'easeInOutExpo', duration:600, complete:function(){
				narrowSolutionDetail();
				bindSolutionSidebarHover();
			}});
		}else{//在保存喜好的情况下，因操作速度过快移动到解决方案上，这里的600ms延时会使解决方案组显示不出来
			narrowSolutionDetail();
			bindSolutionSidebarHover();
			$("#menu_div").width(_menuMinWidth);
		}
		messageCenter.callMessage('RESIZE_WORKING', {left:_menuMinWidth,width:$(window).width() - _menuMinWidth});
		
	};
	var narrowSolutionDetail = function(){
		$("#solution_div_sidebar li").width(_menuMinWidth);
		$("#solution_div_sidebar .solution_div_sidebar_child li").width(_menuMaxWidth-_menuMinWidth);
		//设置隐藏部分class
		$("#solution_div_sidebar .solution_div_sidebar_child").addClass("solution_div_sidebar_child_ulchanged");
		$("#solution_div_sidebar .firstparent").children("ul").addClass("firstchild_ul");
		$("#solution_div_sidebar .firstparentul").addClass("solution_div_sidebar_child_hover");
		$("#solution_div_sidebar .solution_div_sidebar_child li").addClass("solution_div_sidebar_child_lichanged");
		$("#solution_div_sidebar .solution_div_sidebar_child li a").addClass("ttchanged");
		//隐藏菜单栏右侧多余部分
		$("#solution_div_sidebar li .sidebar_div .arrow").hide();
		$("#solution_div_sidebar li .sidebar_div .wordspan").hide();
		$("#menu_ul_parent").removeClass("menu_ul_parent");
		$("#menu_div").css("overflow","inherit");
	};
	this.narrowSolutionInit = function(){
		narrowSolution();
		if($("#menu_ul_parent .mCustomScrollBox")!=null){
			$("#menu_ul_parent .mCustomScrollBox").css("overflow","inherit");
		}
		$("#menu_ul_parent").mCustomScrollbar("update");
		setCookie("menumodel", "wzyg", 120, contextPath);
		$(".mCustomScrollBox>.mCSB_scrollTools").css("z-index","1");
	};
	
	/**
	 * 保存后载入保存信息的弹出框体
	 */
	var saveCallBack = function(data){
		if(data == 0){
			$.messager.alert("操作提示","保存成功！",'info');
		}else{
			$.messager.alert("操作提示","保存失败！",'warning');
		}
	};
	
	/**
	 * 解决方案排序
	 */
	var Sortable = function(){
		var solutionId;
		var beforeSort, afterSort;
		var JsonString = "";
		this.sortable = function(){
			$("#solution_div_sidebar").sortable({
				axis: 'y',
				items: '.firstparent',
				revert: true,
				scroll: false,
				helper: 'clone',
				tolerance: 'pointer',
				containment: $("#solution_div_sidebar"),
				placeholder: 'sort_firstparent',
//					items: '.solution_list_group',
				forcePlaceholderSize: true,
				start: sortStart,
				update: sortUpdate
			});
		};
		var sortStart = function(event, ui){
			beforeSort = $(ui.item).index();
		};
		var sortUpdate = function(event, ui){
			afterSort = $(ui.item).index();
			var mbeforeSort, mafterSort;
			
			if(beforeSort < afterSort){
				mbeforeSort = beforeSort;
				mafterSort = afterSort;
			}else{
				mbeforeSort = afterSort;
				mafterSort = beforeSort;
			}
			var sortableData = new Array();
			for(var i=0; i<(mafterSort-mbeforeSort)+1; i++){
				var orderby = $("#solution_div_sidebar").children("li").eq(mbeforeSort+i).attr("orderby");
				sortableData.push(orderby);
			}
			if(beforeSort < afterSort){
				sortableData.unshift(sortableData[sortableData.length-1]);// 将一个或多个新元素添加到数组开始，数组中的元素自动后移，返回数组新长度
				sortableData.pop();//移除最后一个元素并返回该元素值
			}else{
				sortableData.push(sortableData[0]);// 将一个或多个新元素添加到数组结尾，并返回数组新长度
				sortableData.shift(); //移除最前一个元素并返回该元素值，数组中元素自动前移
			}
			for(var i=0; i<(mafterSort-mbeforeSort)+1; i++){
				var solutionid = $("#solution_div_sidebar").children("li").eq(mbeforeSort+i).attr("solutionid");
				var orderby = sortableData[i];
				$("#solution_div_sidebar").children("li").eq(mbeforeSort+i).attr("orderby",orderby);
				if(i == 0){
					addJsonString(solutionid, orderby, 0);
				}else{
					addJsonString(solutionid, orderby, 1);
				}
			}
//			console.info(JsonString);
			solutionService.sortSolution(null, JsonString);
			JsonString = "";
			
		};
		var addJsonString = function(solutionid, orderby, num){
			if(num == 0){
				JsonString += '{"pfId":'+solutionid+',"orderBy":'+orderby+'}';
			}else{
				JsonString += ',{"pfId":'+solutionid+',"orderBy":'+orderby+'}';
			}
		};
		this.sortEnable = function(){
			$("#solution_div_sidebar").sortable("enable");
		};
		this.sortDisable = function(){
			$("#solution_div_sidebar").sortable("disable");
		};
	};

	/**
	 * 初始化
	 */
	this.init = function() {
		$("#working").width($(window).width() - $("#menu_div").width());
		$("#working").height($(window).height() - $("#top_div").height());
		getSolutionDataFromHttpUtil(0);
		solutionWorkspaceEvent();
		bindSolutionEditClick();
		sortable = new Sortable();
		sortable.sortable();
		sortable.sortDisable();
		bindSolutionSidebarClick();
		if(_menutype == 0){
			bindSolutionSidebarClickHover();
		}else{
			bindSolutionSidebarHover();
		}
	};
	this.sortSolutionEnable = function(){
		if(isFromOrm){
			if(!ORMPermissionWorking('SORT')){
				sortable.sortEnable();
			}
		}
		if(isFromOutOm){//外部接口权限
			if(!outOmPermissionWorking("CDT-08", 3)){
				sortable.sortEnable();
			}
		}
		else{
			if(!cdtPermissionWorking("CDT-08", 3)){
				sortable.sortEnable();
			}
		}
	};
	this.sortSolutionDisable = function(){
		sortable.sortDisable();
	};
	
	this.getSolutionService = function(){
		return solutionService;
	};
	
	this.getInitSolutionData = function(data,_total){
		initSolutionData(data,2,_total);
	};

	
	/**
	 * 切换左侧菜单的两种模式
	 */
	this.bindSolutionControlClick = function(){
		if ($("#menu_div").is(":animated"))
			return;
		if(parseInt($("#menu_div").width()) <= _menuMinWidth){//放大
			_menutype = 1;
			unbindSolutionSidebarHover();
			$("#menu_div").animate({width:_menuMaxWidth},{easing: 'easeInOutExpo', duration:600, complete:function(){
				bindSolutionSidebarClickHover();
				bindSolutionSidebarClick();
			}});
			$("#solution_div_sidebar li").width(_menuMaxWidth);
			$("#solution_div_sidebar .solution_div_sidebar_child li").width(_menuMaxWidth);
			//设置隐藏部分class
			$("#solution_div_sidebar .solution_div_sidebar_child").removeClass("solution_div_sidebar_child_ulchanged");
			$("#solution_div_sidebar .solution_div_sidebar_child").removeClass("firstchild_ul");
			$("#solution_div_sidebar .firstparentul").removeClass("solution_div_sidebar_child_hover");
			$("#solution_div_sidebar .solution_div_sidebar_child").addClass("solution_div_sidebar_child_click");
			$("#solution_div_sidebar .solution_div_sidebar_child li").removeClass("solution_div_sidebar_child_lichanged");
			$("#solution_div_sidebar .solution_div_sidebar_child li a").removeClass("ttchanged");
			$("#solution_div_sidebar .solution_div_sidebar_child li a").removeClass("ttchanged_outLevel");
			//显示菜单栏右侧多余部分
			$("#solution_div_sidebar li .sidebar_div .arrow").css("display","inline");
			$("#solution_div_sidebar li .sidebar_div .wordspan").show();
			$("#menu_ul_parent").addClass("menu_ul_parent");
			messageCenter.callMessage('RESIZE_WORKING', {left:_menuMaxWidth,width:$(window).width() - _menuMaxWidth});
			if($("#menu_ul_parent .mCustomScrollBox")!=null){
				$("#menu_ul_parent .mCustomScrollBox").css("overflow","hidden");
			}
			$("#menu_ul_parent").mCustomScrollbar("update");
			setCookie("menumodel", "normal", 120, contextPath);
			$(".mCustomScrollBox>.mCSB_scrollTools").css("z-index","999");
		}else{//缩小
			_menutype = 2;
			narrowSolution();
			if($("#menu_ul_parent .mCustomScrollBox")!=null){
				$("#menu_ul_parent .mCustomScrollBox").css("overflow","inherit");
			}
			$("#menu_ul_parent").mCustomScrollbar("update");
			setCookie("menumodel", "wzyg", 120, contextPath);
			$(".mCustomScrollBox>.mCSB_scrollTools").css("z-index","1");
		}
	};
	
	/**
	 * 新增(编辑)解决方案(组)
	 * @param parentId 父亲id
	 * @param pfName 解决方案名称
	 * @param type 类型 0表示解决方案组,1表示解决方案
	 * @param operateType 操作类型 new: 新增;edit:编辑
	 * @param url
	 * @param isShowTitle 是否显示标题
	 * @param pfId 编辑时需要传入pfId
	 */
	this.addSolution = function(option){
		var file = "";
		var pfIdStr = "";
		if(option.operateType == "edit"){
			pfIdStr = '"pfId":'+ option.pfId + ',';
		}
		if(option.type == 0){//解决方案组
			file = '{' + pfIdStr + '"pfName":"' + option.pfName + '","parentId":' + option.parentId +  ',"type":' + 0 + ',"url":""' 
				+ ',"picName":"' + option.normalIcon + '","fileName":"'+ option.selectedIcon +'","keyWord":"'+option.normalPic+ '"}';
		}
		else if(option.type == 1){//解决方案
			if(option.url != ""){//写入url方式
				var solutionData = solutionsDataMap.get(option.pfId);
				var workingData;
				if (solutionData != null && (workingData = solutionData.describe)!= null) {
					if (typeof(workingData) == "string") {
						workingData = {};
					}
				}
				else {
					workingData = {};
				}
				workingData.isShowTitle = option.isShowTitle;
				file = JSON.stringify({pfId:option.pfId, pfName:option.pfName,parentId:option.parentId,type:1,url:option.url,describe:JSON.stringify(workingData),picName:option.normalIcon,fileName:option.selectedIcon,keyWord:option.normalPic});
				if (solutionData != null) {
					solutionData.describe = workingData;//修改旧的describe更新到solutionsDataMap中
					solutionsDataMap.remove(option.pfId);
					solutionsDataMap.put(option.pfId, solutionData);
				}
			}
			else{
				var _templateObj = option.templateObj;
				var _describe = "";
				var _describeValue = '""';
				if(	(_templateObj&&option.operateType=="new") //新增且选了模板
					|| //编辑，且选了模板,且模板已变
					(_templateObj&&option.operateType == "edit"&&option.oldTemplateId != _templateObj.id )
				){
					_describeValue = ('[{"title":"新建标签页","panels":[{"templateId":'+_templateObj.id+',"html":"'+escape(_templateObj.context?_templateObj.context:'')+'"}]}]').replace(/"/g,"\\\"");
					_describeValue = '"'+_describeValue+'"';
					_describe = ',"describe":' + _describeValue;
				}else if(!_templateObj&&option.operateType == "edit"&&option.oldTemplateId){
					//编辑且取消了模板（原有模板）
					_describeValue = '""';
					_describe = ',"describe":'+_describeValue;
				}
				if(option.operateType == "edit" && solutionsDataMap.get(option.pfId).url != "" ){//编辑时从写入url方式切换到其他方式
					file = '{' + pfIdStr + '"pfName":"' + option.pfName + '","parentId":' + option.parentId +  ',"type":' + 1 
						+ ',"url":"","describe":'+_describeValue+',"picName":"' + option.normalIcon + '","fileName":"'+ option.selectedIcon +'","keyWord":"'+option.normalPic+'"}';
				}
				else {
					file = '{' + pfIdStr + '"pfName":"' + option.pfName + '","parentId":' + option.parentId +  ',"type":' + 1 
						+ ',"url":"","picName":"' + option.normalIcon + '","fileName":"'+ option.selectedIcon +'","keyWord":"'+option.normalPic+ '"' + _describe + '}';
				}
			}
		}
		if(option.operateType == "new"){
			solutionService.addPlatFormFile(initNewSolution,{"file":file},check_submit,function(){//防止表单重复提交
				check_submit.solution = false;
			},function(){
				check_submit.solution = true;
			});
		}
		else if(option.operateType == "edit"){
			solutionService.updatePlatFormFile(editSolution,{"file":file});
		}
	};
	
	/**
	 * 删除解决方案(组)
	 * pfId 解决方案组ID
	 */
	this.deleteSolution = function(pfId){
		solutionService.deletePlatFormDir(deleteSolutionData, {"pfId":pfId});
	};

	/**
	 * 设置解决方案表现模式
	 */
	this.setSolutionMode = function(mode) {
		_solutionMode = mode;
		if (_solutionMode == 1) {//变化为编辑模式，则判断是否为展开的导航栏
			if(parseInt($("#menu_div").width()) <= _menuMinWidth){//收起情况则变换为放大
				this.bindSolutionControlClick();
			}
		}
	};
	
	/**
	 * 访问存储解决方案的接口
	 */
	this.updateDescribeById = function(jsonData){
		var _callBack = jsonData.callBack;
		var _param = jsonData.param;
		solutionService.updateDescribeById(_callBack,_param);
	};
	
	/**
	 * 进入系统管理
	 */
	this.enterSystemManager = function(){
		$("#solution_div_sidebar").empty();//清空所有解决方案（组）
		$("#working").empty();//清空工作区
		solutionsDataMap.clear();//清空保存的解决方案数据
		componentView.setHasInitComponentView(false);//设置构件需要重新加载
		_isSystemManager = true;
		initSolutionData(Const.systemManagerData(path),1);
	};
	
	/**
	 * 退出系统管理/保存设置后，刷新解决方案数据
	 */
	this.outerSystemManager = function(){
		$("#solution_div_sidebar").empty();//清空所有解决方案（组）
		$("#working").empty();//清空工作区
		solutionsDataMap.clear();//清空保存的解决方案数据
		GCUtil.doGC();
		_isSystemManager = false;
		getSolutionDataFromHttpUtil(1);
	};
	
	/**
	 * 系统管理情况下，点击首页，退出系统管理进入首页
	 */
	this.outerSystemManagerToHome = function(){
		$("#solution_div_sidebar").empty();//清空所有解决方案（组）
		$("#working").empty();//清空工作区
		solutionsDataMap.clear();//清空保存的解决方案数据
		GCUtil.doGC();
		_isSystemManager = false;
		getSolutionDataFromHttpUtil(0);
	};
	
	/**
	 * 点击topview用户名下保存当前解决方案
	 */
	this.saveSolutionWorkspace = function(){
		var $oldSelectedDiv = null;
		
		$("#solution_div_sidebar .active").each(function(){
			if (!$(this).hasClass("hasChild")) {
				$oldSelectedDiv = $(this);
				return false;//跳出each
			}
		});
		if ($oldSelectedDiv != null) {
			workingView.saveSolutionWorkspace($oldSelectedDiv, solutionsDataMap, saveCallBack);
		}
	};
	
	// 默认点击第一个解决方案
	this.isotopeItemClick = function(index){
		if ($("#solution_div_sidebar").children().length > 0) {
			var $this = $($("#solution_div_sidebar").children("li")[index]);
			if($this.hasClass("hasChild")){
				var loadfirsttime = true;
				var solutionid = $this.attr("solutionid");
				if(parseInt($("#menu_div").width()) <= _menuMinWidth){
					var scanType = 1;//浏览模式为hover
				}else{
					var scanType = 0;//浏览模式为click
				}
				getSolutionsChildrenDataFromHttpUtil($this, {"pfId":solutionid}, scanType, loadfirsttime);
			}
			else{
				$this.click();
			}
		}
	};
	
	//从首页点击解决方案之后，进入到导航栏选择指定的解决方案
	this.isoItemChoose = function(index){
		var data = _isotopeData[index];
		var solutionid = data.id;
		var parentids = data.parentId.split(",");
		if ($("#solution_div_sidebar").children().length > 0) {
			var thisParents = $("#solution_div_sidebar").children("li");
			var $this = getIndexOfsolutions(parentids, thisParents);
			if($this.hasClass("hasChild")){
				var loadfirsttime = true;
				var solutionid = $this.attr("solutionid");
				if(parseInt($("#menu_div").width()) <= _menuMinWidth){
					var scanType = 1;//浏览模式为hover
				}else{
					var scanType = 0;//浏览模式为click
				}
				getSolutionsChildrenDataFromHttpUtil($this, {"pfId":solutionid}, scanType, loadfirsttime,parentids);
			}else{
				$this.click();
			}
		}
	};

	/**
	 * 接收到消息后切换选择某个解决方案
	 * data的格式{name:""}
	 */
	this.chageToSelectSolution = function(data) {
		solutionService.getPlatFormParentIdByName(function(ret) {
			var pids = ret.parentId;
			if (pids != "") {
				var parentids = pids.split(",");
				if ($("#solution_div_sidebar").children().length > 0) {
					var thisParents = $("#solution_div_sidebar").children("li");
					var $this = getIndexOfsolutions(parentids, thisParents);
					if($this.hasClass("hasChild")){
						var loadfirsttime = true;
						var solutionid = $this.attr("solutionid");
						if(parseInt($("#menu_div").width()) <= _menuMinWidth){
							var scanType = 1;//浏览模式为hover
						}else{
							var scanType = 0;//浏览模式为click
						}
						getSolutionsChildrenDataFromHttpUtil($this, {"pfId":solutionid}, scanType, loadfirsttime, parentids);
					}else{
						$this.click();
					}
				}
			}
			else {
				//后续需要做提示
			}
		}, {file:JSON2.stringify({pfName:data.name})});
	};
	
	//获取解决方案组在其父亲下的位置
	var getIndexOfsolutions = function(parentids,$thisParents){
		for(var i=0; i<$thisParents.length; i++){
			if($($thisParents[i]).attr("solutionid") == parentids[parentids.length-1]){
				parentids.pop();
				return $($thisParents[i]);
			}
		}
	};

	/**
	 * 窗口resize，resize工作区
	 */
	this.resize = function() {
		$("#working").width($(window).width() - $("#menu_div").width());
		$("#working").height($(window).height() - $("#top_div").height());
	};
	
	/**
	 * 取消当前选中的解决方案
	 */
	this.removeCheckd = function(){
		//当解决方案被重复点击时，不会重新加载该解决方案的工作区内容。
		//所以当首页覆盖住工作区空间的时候，会取消该解决方案的加载进度，
		//所以需要取消解决方案的选中状态，为了防止重新点击该解决方案的时候出现未加载的状态。
		var $oldSelectedDiv = $("#solution_div_sidebar").find(".active").find(".sidebar_div");
		chageIconCss($oldSelectedDiv, "iconNormal");
		$("#solution_div_sidebar").find(".active").removeClass("active");
		$("#working").empty();
	};
	
	/**
	 * 从首页进入或从设置选项出来时，选择第一个解决方案
	 */
	this.selectFirstSolution = function(visitType){
		if(visitType == 1 || !frontPage){//如果加载的是系统管理下的解决方案，则不需要加载大图标
			solutionView.isotopeItemClick(0);
			return;
		}
	};
	
}