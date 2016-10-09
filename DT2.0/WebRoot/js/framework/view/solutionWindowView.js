/**
* 解决方案弹出窗口VIEW
*/
function SolutionWindowView(){
	var _iconPath = path + "/uploadFils/icons/";//图标路径
	var _picPath = path + "/uploadFils/pics/";//图片路径
	
	/**
	 * 初始化解决方案组树
	 * @param callBack 回调函数
	 */
	var initPFDirTree = function(callBack){
		var solutionService = solutionView.getSolutionService();
		solutionService.getPFDirTreeData(function(data){
			var treeData = [{"iconCls":"icon-platform-dir","id":0,"state":"open","text":"解决方案根目录"}];
			treeData[0].children = data;
			$('#solutions_PFDirTree').combotree({
			    data:treeData,
			    onSelect: function(node){
			    	$("#solution_paraent_message").text("");
			    }
			});
			if(callBack){
				callBack();
			}
		});	
	};
	
	/**
	 * 选择解决方案组树
	 * @param id 解决方案组id
	 * @returns
	 */
	var selectPFDirTree = function(id){
		$('#solutions_PFDirTree').combotree('setValue', id); 
	};
	
	/**
	 * 选择模板
	 */
	var selectTemplate = function(id){
		$("#template_list").combobox("select",id?id:0);
	};

	/**
	 * 初始化图标库
	 * @param callBack
	 * @returns
	 */
	var initIconData = function(callBack) {
		solutionView.getSolutionService().getIconsData(randerIconData,callBack);
	};
	
	/**
	 * 初始化图片库
	 * @param callBack
	 * @returns
	 */
	var initPicData = function(callBack) {
		solutionView.getSolutionService().getPicsData(randerPicData,callBack);
	};
	
	/**
	 * 从combobox中获取指定id模板的信息
	 */
	var getTemplateObj = function(id){
		var _options = $('#template_list').combobox('options')||{};
		var _data = _options.data||[];
		for(var i=0;i<_data.length;i++){
			if(id==_data[i].id){
				return _data[i];
			}
		}
	};
	
	/**
	 * 初始化模板列表
	 */
	var initTemplateData = function(callBack) {
		solutionView.getSolutionService().getTemplateData(function(data){
			data.unshift({id:0,name:"请选择模板"});
			$('#template_list').combobox({
				valueField:'id',
			    textField:'name',
			    data:data,
			    editable: false,
			    onSelect: function(node){
			    	$("#template_list_message").text("");
			    }
			}).combobox("select",0);
			if(callBack){
				callBack();
			}
		});
	};
	/**
	 * 选择图标
	 * @param picName
	 * @returns
	 */
	var selectIcon = function(picName){
		var _scrollTop = $("#icon_list").position().top;
		var _icons = $("#icon_list").children();
		for ( var i = 0; i < _icons.length; i++) {
			if(picName != null && picName != "" && picName == $(_icons[i]).attr("normalicon")){
				_scrollTop = $(_icons[i]).position().top;
				$(_icons[i]).click();
				break;
			}
		}
		$("#icon_list").scrollTop((_scrollTop - $("#icon_list").position().top));
	};
	
	/**
	 * 选择图片
	 * @param picName
	 * @returns
	 */
	var selectPic = function(picName){
		var _scrollTop = $("#pic_list").position().top;
		var _pics = $("#pic_list").children();
		for ( var i = 0; i < _pics.length; i++) {
			if(picName != null && picName != "" && picName == $(_pics[i]).attr("normalpic")){
				_scrollTop = $(_pics[i]).position().top;
				$(_pics[i]).click();
				break;
			}
		}
		$("#pic_list").scrollTop((_scrollTop - $("#pic_list").position().top));
	};
	
	/**
	 * 渲染图标库
	 * @param iconData
	 * @param callBack
	 * @returns
	 */
	var randerIconData = function(iconData,callBack) {
		for ( var i = 0; i < iconData.length; i++) {
			var _item = iconData[i];
			var _iconItem = $.render($("#icon-item-template").html(),{icon_id: _item.iconId, normalIcon:_item.iconNormal, selectedIcon:_item.iconSelected,
				icon_n: _iconPath + _item.iconNormal, icon_s: _iconPath + _item.iconSelected, icon_name: _item.iconName});
			$("#icon_list").append(_iconItem);
		}
		$("#icon_list li").die("click").live("click",function(){
			var _this = $(this);
			if(!_this.hasClass("selected")){//没有选中
				//先去掉选中的
				var oldSelectedIcon = $("#icon_list").find(".selected");
				oldSelectedIcon.removeClass("selected");
			}
			_this.toggleClass("selected");
			$("#solution_icon_message").text("");
		});
		if(callBack){
			callBack();
		}
	};
	
	/**
	 * 渲染图片库
	 * @param picData
	 * @param callBack
	 * @returns
	 */
	var randerPicData = function(picData,callBack) {
		for ( var i = 0; i < picData.length; i++) {
			var _item = picData[i];
			var _pic_n_notForIE8 = _picPath + _item.pic;
			if (window.navigator.userAgent.indexOf("MSIE")>=1) {
	    		var index = navigator.userAgent.indexOf("MSIE");
	    		var versions = parseInt(navigator.userAgent.substring(index+5,index+8));
	    		if(versions == 8){//IE7、IE8、IE9
	    			_pic_n_notForIE8 = "";
	    		}
	        }
			var _picItem = $.render($("#pic-item-template").html(),{pic_id: _item.picId, normalPic:_item.pic,
				pic_n_notForIE8: _pic_n_notForIE8, pic_n: _picPath + _item.pic, pic_name: _item.picName});
			$("#pic_list").append(_picItem);
		}
		$("#pic_list li").die("click").live("click",function(){
			var _this = $(this);
			if(!_this.hasClass("selected")){//没有选中
				//先去掉选中的
				var oldSelectedIcon = $("#pic_list").find(".selected");
				oldSelectedIcon.removeClass("selected");
			}
			_this.toggleClass("selected");
			$("#solution_pic_message").text("");
		});
		if(callBack){
			callBack();
		}
	};
	
	/**
	 * 初始化新增解决方案或者解决方案组窗口
	 */
	this.initNewSolutionChooseWindow = function() {
		var _newSolutionChooseWindow = $("#new_solution_choose_template").html();
		var _view = this;
		$(".all_background").show();
		$("body").append(_newSolutionChooseWindow);
		$("#new_solution_choose_window").fadeIn();
		$("#new_solution_choose_window").draggable({
			handle: $('#new_solution_choose_window h4'),
			drag: function(event,ui){
				var d = ui.position;
				var maxLeft = $(window).width()- 196;//391为本身的宽度,margin-left为-195
				var maxTop = $(window).height()- 118;//192为本身高度，margin-top为-76、40为top的高度
				if (d.left < 195){d.left = 195;}//margin-left为-195
				else if (d.left > maxLeft) {
					d.left = maxLeft;
				}
				if (d.top < 116){d.top = 116;}//margin-top为-76、40为top的高度
				else if (d.top > maxTop) {
					d.top = maxTop;
				}
			}
		});
		if(!($._data($("#new_solution_choose_window .window_close").get(0), "events") != undefined
				&& $._data($("#new_solution_choose_window .window_close").get(0), "events")["click"] != undefined)){//关闭按钮
			$("#new_solution_choose_window .window_close").bind("click",function(){
				$(".all_background").hide();
				$("#new_solution_choose_window").fadeOut(function(){
					$("#new_solution_choose_window").remove();
				});
			});
		}
		if(!($._data($("#choose_solutions").get(0), "events") != undefined
				&& $._data($("#choose_solutions").get(0), "events")["click"] != undefined)){//解决方案组
			$("#choose_solutions").bind("click",function(){
				$(".all_background").hide();
				$("#new_solution_choose_window").fadeOut(function(){
					$("#new_solution_choose_window").remove();
					_view.initNewSolutionsWindow();
				});
			});
			$("#choose_solutions").bind("mouseover",function(){
				$(this).removeClass("button-03-n");
				$(this).addClass("button-03-f");
			});
			$("#choose_solutions").bind("mouseout",function(){
				$(this).removeClass("button-03-f");
				$(this).addClass("button-03-n");
			});
		}
		if(!($._data($("#choose_solution").get(0), "events") != undefined
				&& $._data($("#choose_solution").get(0), "events")["click"] != undefined)){//解决方案
			$("#choose_solution").bind("click",function(){
				$(".all_background").hide();
				$("#new_solution_choose_window").fadeOut(function(){
					$("#new_solution_choose_window").remove();
					_view.initNewSolutionWindow();
				});
			});
			$("#choose_solution").bind("mouseover",function(){
				$(this).removeClass("button-03-n");
				$(this).addClass("button-03-f");
			});
			$("#choose_solution").bind("mouseout",function(){
				$(this).removeClass("button-03-f");
				$(this).addClass("button-03-n");
			});
		}
	};
	
	/**
	 * 初始化新增（编辑)解决方案组窗口
	 * @param jsonData 修改时为解决方案组json数据，新增是为undefined
	 */
	this.initNewSolutionsWindow = function(jsonData) {
		var operateType = "";//操作类型 new：新增;edit：编辑
		var _newSolutionsWindow = $("#new_solutions_template").html();		
		$(".all_background").show();
		$("body").append(_newSolutionsWindow);
		$("#new_sloutions_window").fadeIn();
		$("#new_sloutions_window").draggable({
			handle: $('#new_sloutions_window h4'),
			drag: function(event,ui){
				var d = ui.position;
				//width: 445px;height: 474px;margin-left: -222px;margin-top: -237px;
				var maxLeft = $(window).width()- 223;//222
				var maxTop = $(window).height()- 240;//237+40
				if (d.left < 222){d.left = 222;}//margin-left为-195
				else if (d.left > maxLeft) {
					d.left = maxLeft;
				}
				if (d.top < 277){d.top = 277;}//margin-top为-237、40为top的高度
				else if (d.top > maxTop) {
					d.top = maxTop;
				}
			}
		});
		if(!jsonData){//新增
			$("#new_sloutions_window h4").text("新增解决方案组");
			operateType = "new";
			initPFDirTree();
			initIconData();
			initPicData();
			$("#solutions_PFDirTree").removeAttr("disabled");
		}
		else{//编辑
			$("#new_sloutions_window h4").text("编辑解决方案组");
			operateType = "edit";
			$("#new_solutions_name_input").val(jsonData.pfName);
			initPFDirTree(function(){
				selectPFDirTree(jsonData.parentId);
			});
			initIconData(function(){
				selectIcon(jsonData.picName);
			});
			initPicData(function(){
				selectPic(jsonData.keyWord);
			});
		}
		
		if(!($._data($("#new_sloutions_window .window_close").get(0), "events") != undefined
				&& $._data($("#new_sloutions_window .window_close").get(0), "events")["click"] != undefined)){//关闭按钮
			$("#new_sloutions_window .window_close").bind("click",function(){
				$(".all_background").hide();
				$("#new_sloutions_window").fadeOut(function(){
					$("#new_sloutions_window").remove();
				});
			});
		}
		
		if(!($._data($("#new_solutions_name_input").get(0), "events") != undefined
				&& $._data($("#new_solutions_name_input").get(0), "events")["focus"] != undefined)){//解决方案组名称输入框

			$("#new_solutions_name_input").bind("focus",function(){
				$(this).removeClass("textInput-n");
				$(this).addClass("textInput-p");
				$("#solution_name_message").text("");//清空错误
			});
			$("#new_solutions_name_input").bind("blur",function(){
				$(this).removeClass("textInput-p");
				$(this).addClass("textInput-n");
			});
		}
		
		if(!($._data($("#new_solutions_saveBtn").get(0), "events") != undefined
				&& $._data($("#new_solutions_saveBtn").get(0), "events")["click"] != undefined)){//保存按钮
			$("#new_solutions_saveBtn").bind("click",function(){
				$("#new_sloutions_window .text_error").text("");//清空错误
				var type = 0;
				var parentId = $("#solutions_PFDirTree").combotree("getValue");//父亲id
				var pfName = $.trim($("#new_solutions_name_input").val()).replace(/\"/ig,"\\\"");//解决方案组名称
				var selectedIcon = $("#icon_list").find(".selected");
				var selectedPic = $("#pic_list").find(".selected");
				var hasError = false;
				if(parentId == ""){
					$("#solution_paraent_message").text("请选择解决方案组的位置！");
					hasError = true;
				}
				if(pfName == ""){
					$("#solution_name_message").text("请输入解决方案组的名称！");
					hasError = true;
				}
				if (selectedIcon.length == 0) {//未选中图标
					$("#solution_icon_message").text("请选择解决方案组的图标！");
					hasError = true;
				}
				if (selectedPic.length == 0) {//未选中图片
					$("#solution_pic_message").text("请选择解决方案组的图片！");
					hasError = true;
				}
				if(hasError == false){
					var option = null;
					if(operateType == "edit"){
						if(parentId == jsonData.parentId && pfName == jsonData.pfName && type == jsonData.type
								&& selectedIcon.attr("normalIcon") == jsonData.picName 
								&& selectedIcon.attr("selectedIcon") == jsonData.fileName
								&& selectedPic.attr("normalPic") == jsonData.keyWord){//解决方案组信息没有改变
							$(".all_background").hide();
							$("#new_sloutions_window").fadeOut(function(){
								$("#new_sloutions_window").remove();
							});
							return;
						}
						option = {pfId:jsonData.pfId,parentId:parentId,pfName:pfName,type:type,operateType:operateType,
								normalIcon:selectedIcon.attr("normalIcon"),selectedIcon:selectedIcon.attr("selectedIcon"),
								normalPic:selectedPic.attr("normalPic")};
					}
					else if(operateType == "new"){
						option = {parentId:parentId,pfName:pfName,type:type,operateType:operateType,
								normalIcon:selectedIcon.attr("normalIcon"),selectedIcon:selectedIcon.attr("selectedIcon"),
								normalPic:selectedPic.attr("normalPic")};
					}
					solutionView.addSolution(option);
				}
			});
		}
	};
	
	/**
	 * 
	 * 初始化新增（编辑）解决方案窗口
	 * jsonData
	 */
	this.initNewSolutionWindow = function(jsonData){
		var operateType = "";//操作类型 new：新增;edit：编辑
		var _newSolutionWindow = $("#new_solution_template").html();
		var oldTemplateId = 0;//模板id
		$(".all_background").show();
		$("body").append(_newSolutionWindow);
		$("#new_sloution_window").fadeIn();
		$("#new_sloution_window").draggable({
			handle: $('#new_sloution_window h4'),
			drag: function(event,ui){
				var d = ui.position;
				//width: 445px;height: 564px;margin-left: -222px;margin-top: -282px;	
				var maxLeft = $(window).width()- 223;//222
				var maxTop = $(window).height()- 282;//282-40
				if (d.left < 222){d.left = 222;}//
				else if (d.left > maxLeft) {
					d.left = maxLeft;
				}
				if (d.top < 322){d.top = 322;}//margin-top为-76、40为top的高度
				else if (d.top > maxTop) {
					d.top = maxTop;
				}
			}
		});
		if(!jsonData){//新增
			$("#new_sloution_window h4").text("新增解决方案");
			operateType = "new";
			initPFDirTree();
			initTemplateData();
			initIconData();
			initPicData();
			$("#solutions_PFDirTree").removeAttr("disabled");
		}
		else{//编辑
			var url = jsonData.url;
			$("#new_sloution_window h4").text("编辑解决方案");
			operateType = "edit";
			$("#new_solution_name_input").val(jsonData.pfName);
			$("#new_solution_url_input").val(jsonData.url);
			if(jsonData.describe&&jsonData.describe.length==1&&
					jsonData.describe[0].panels&&jsonData.describe[0].panels.length==1
					&&jsonData.describe[0].panels[0].templateId){ //获取原模板id
				oldTemplateId = jsonData.describe[0].panels[0].templateId;
			}
			if(url != "" && url != null){
				if (jsonData.describe != "" && typeof(jsonData.describe) == "string") {
					jsonData["describe"] = JSON2.parse(jsonData.describe);
				}
				var isShowTitle = jsonData.describe.isShowTitle;
				if(isShowTitle == false){
					 $("#new_solution_title_checkbox").attr("checked",false);
				}
				else{
					 $("#new_solution_title_checkbox").attr("checked","checked");
				}
			}
			initPFDirTree(function(){
				selectPFDirTree(jsonData.parentId);
			});
			initTemplateData(function(){
				selectTemplate(oldTemplateId);
			});
			initIconData(function(){
				selectIcon(jsonData.picName);
			});
			initPicData(function(){
				selectPic(jsonData.keyWord);
			});
		}
		
		if(!($._data($("#new_sloution_window .window_close").get(0), "events") != undefined
				&& $._data($("#new_sloution_window .window_close").get(0), "events")["click"] != undefined)){//关闭按钮
			$("#new_sloution_window .window_close").bind("click",function(){
				$(".all_background").hide();
				$("#new_sloution_window").fadeOut(function(){
					$("#new_sloution_window").remove();
				});
			});
		}
		if(!($._data($("#new_sloution_window .textInput").get(0), "events") != undefined
				&& $._data($("#new_sloution_window .textInput").get(0), "events")["focus"] != undefined)){//文本输入框
			
			$("#new_sloution_window .textInput").bind("focus",function(){
				$(this).removeClass("textInput-n");
				$(this).addClass("textInput-p");
				if($(this).attr("id") == "new_solution_name_input"){
					$("#solution_name_message").text("");
				}
				else if($(this).attr("id") == "new_solution_url_input"){
					$("#solution_url_message").text("");
				}
			});
			$("#new_sloution_window .textInput").bind("blur",function(){
				$(this).removeClass("textInput-p");
				$(this).addClass("textInput-n");
			});
		}
		
		if(!($._data($("#new_solution_saveBtn").get(0), "events") != undefined
				&& $._data($("#new_solution_saveBtn").get(0), "events")["click"] != undefined)){//保存按钮
			$("#new_solution_saveBtn").bind("click",function(){
				$("#new_sloution_window .text_error").text("");//清空错误
				var type = 1;
				var parentId = $("#solutions_PFDirTree").combotree("getValue");//父亲id
				var pfName = $.trim($("#new_solution_name_input").val()).replace(/\"/ig,"\\\"");//解决方案组名称
				var url = $.trim($("#new_solution_url_input").val()).replace(/\\/g,"/");//URL
				var templateId = $("#template_list").combobox("getValue");//模板id
				var templateObj = null; //模板信息对象
				var selectedIcon = $("#icon_list").find(".selected");//图标
				var selectedPic = $("#pic_list").find(".selected");//图片
				var isShowTitle = $("#new_solution_title_checkbox").attr("checked") == "checked"?true:false;//是否显示标题栏
				var hasError = false;
				if(parentId == ""){
					$("#solution_paraent_message").text("请选择解决方案的位置！");
					hasError = true;
				}
				if(pfName == ""){
					$("#solution_name_message").text("请输入解决方案的名称！");
					hasError = true;
				}
				if(url != ""){
					if(!validateRules.isUrl((url))){
						$("#solution_url_message").text("请输入正确的URL格式！");
						hasError = true;
					}
					url = url.replace(/\"/ig,"\\\"");
				}
				if(templateId&&templateId!="0"){ //判断是否选择了模板
					templateObj = getTemplateObj(templateId);
				}
				if (selectedIcon.length == 0) {//未选中图标
					$("#solution_icon_message").text("请选择解决方案的图标！");
					hasError = true;
				}
				if (selectedPic.length == 0) {//未选中图片
					$("#solution_pic_message").text("请选择解决方案的图片！");
					hasError = true;
				}
				if(hasError == false){
					var option = null;
					if(operateType == "edit"){
						if(parentId == jsonData.parentId && pfName == jsonData.pfName && type == jsonData.type
								&& selectedIcon.attr("normalIcon") == jsonData.picName 
								&& selectedIcon.attr("selectedIcon") == jsonData.fileName
								&& selectedPic.attr("normalPic") == jsonData.keyWord
								&& jsonData.url == url&& oldTemplateId == templateId){//判断解决方案信息没有改变
							if(url == ""){
								$(".all_background").hide();
								$("#new_sloution_window").fadeOut(function(){
									$("#new_sloution_window").remove();
								});
								return;
							}
							else{//写入url方式
								if(jsonData.describe && jsonData.describe.isShowTitle == isShowTitle){
									$(".all_background").hide();
									$("#new_sloution_window").fadeOut(function(){
										$("#new_sloution_window").remove();
									});
									return;
								}
							}	
						}
						option = {pfId:jsonData.pfId,parentId:parentId,pfName:pfName,type:type,operateType:operateType,
								normalIcon:selectedIcon.attr("normalIcon"),selectedIcon:selectedIcon.attr("selectedIcon"),
								normalPic:selectedPic.attr("normalPic"), url:url, isShowTitle:isShowTitle, 
								templateObj: templateObj, oldTemplateId: oldTemplateId};
					}
					else if(operateType == "new"){
						option = {parentId:parentId,pfName:pfName,type:type,operateType:operateType,
								normalIcon:selectedIcon.attr("normalIcon"),selectedIcon:selectedIcon.attr("selectedIcon"),
								normalPic:selectedPic.attr("normalPic"),url:url, isShowTitle:isShowTitle, 
								templateObj: templateObj};
					}
					
					solutionView.addSolution(option);
				}
			});
		}
	};
	
	/**
	 * 
	 * 初始化删除解决方案（组）窗口
	 * jsonData
	 */
	this.initDeleteSolutionWindow = function(jsonData){
		var _deleteSolutionWindow = $("#delete_solution_template").html();
		$(".all_background").show();
		$("body").append(_deleteSolutionWindow);
		$("#delete_sloution_window").fadeIn();
		$("#delete_sloution_window").draggable({
			handle: $('#delete_sloution_window h4'),
			drag: function(event,ui){
				var d = ui.position;
				//height: 193px;width: 392px;margin-top: -96px;margin-left: -196px;
				var maxLeft = $(window).width()- 196;//
				var maxTop = $(window).height()- 100;//
				if (d.left < 196){d.left = 196;}//
				else if (d.left > maxLeft) {
					d.left = maxLeft;
				}
				if (d.top < 136){d.top = 136;}//40为top的高度
				else if (d.top > maxTop) {
					d.top = maxTop;
				}
			}
		});
		var type = jsonData.type;
		var pfName = jsonData.pfName;
		var content = "";
		if(type == 0){
			content = "确认删除名为【" + pfName + "】的解决方案组?<br/>删除后将无法撤销此操作!";
		}
		else if(type == 1){
			content = "确认删除名为【" + pfName + "】的解决方案?<br/>删除后将无法撤销此操作!";
		}
		$("#delete_solution_content").html(content);
		
		if(!($._data($("#delete_sloution_window .window_close").get(0), "events") != undefined
				&& $._data($("#delete_sloution_window .window_close").get(0), "events")["click"] != undefined)){//关闭按钮
			$("#delete_sloution_window .window_close").bind("click",function(){
				$(".all_background").hide();
				$("#delete_sloution_window").fadeOut(function(){
					$("#delete_sloution_window").remove();
				});
			});
		}
		
		if(!($._data($("#delete_solution_cancel").get(0), "events") != undefined
				&& $._data($("#delete_solution_cancel").get(0), "events")["click"] != undefined)){//取消按钮
			$("#delete_solution_cancel").bind("click",function(){
				$(".all_background").hide();
				$("#delete_sloution_window").fadeOut(function(){
					$("#delete_sloution_window").remove();
				});
			});
		}

		if(!($._data($("#delete_solution_btn").get(0), "events") != undefined
				&& $._data($("#delete_solution_btn").get(0), "events")["click"] != undefined)){//删除按钮
			$("#delete_solution_btn").bind("click",function(){
				var pfId = jsonData.pfId;
				solutionView.deleteSolution(pfId);
			});
		}
	};
}