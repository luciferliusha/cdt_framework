/**
 * 删除确认框View
 */
$(function(){
	var method = null;
	var event = null;
	var cmap = null;
	
	ConfirmView = Backbone.View.extend({
		el: $("#confirmView"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var confirmTemplate = _.template($("#confirm_template").html());
			$(this.el).html(confirmTemplate);
		},
		events: {
			"mouseover #deleteBtn": "deleteBtnOver",
			"mouseout #deleteBtn": "deleteBtnOut",
			"click #deleteBtn": "deleteBtnClick",
//			"mouseover #resetBtn": "resetBtnOver",
//			"mouseout #resetBtn": "resetBtnOut",
			"click #resetBtn": "resetBtnClick",
			"mouseover #confirm_close": "confirmCloseOver",
			"mouseout #confirm_close": "confirmCloseOut",
			"click #confirm_close": "resetBtnClick"
		},
		deleteBtnOver: function(){
			$("#deleteBtn").removeClass("confirmButtonY_n");
			$("#deleteBtn").addClass("confirmButtonY_f");
		},
		deleteBtnOut: function(){
			$("#deleteBtn").removeClass("confirmButtonY_f");
			$("#deleteBtn").addClass("confirmButtonY_n");
		},
		deleteBtnClick: function(){
			$("#confirmView").hide();
			if(method != null){
				if(event != null){
					method(event);
				}else{
					method();
				}
			}
		},
		resetBtnOver: function(){
			$("#resetBtn").removeClass("confirmButtonN_n");
			$("#resetBtn").addClass("confirmButtonN_f");
		},
		resetBtnOut: function(){
			$("#resetBtn").removeClass("confirmButtonN_f");
			$("#resetBtn").addClass("confirmButtonN_n");
		},
		resetBtnClick: function(){
			$("#confirmView").hide();
		},
		confirmCloseOver: function(){
			$("#confirm_close").removeClass("confirm_close_n");
			$("#confirm_close").addClass("confirm_close_f");
		},
		confirmCloseOut: function(){
			$("#confirm_close").removeClass("confirm_close_f");
			$("#confirm_close").addClass("confirm_close_n");
		},
		confirmOpen: function(m, name, e){
			$("#confirmView").show();
			$("#comfirmbox_content").html(name);
			method = m;
			event = e;
		}
	});
	
	//新建选择框
	NewWinView = Backbone.View.extend({
		el: $("#newWinView"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var newWinTemplate = _.template($("#newWin_template").html());
			$(this.el).html(newWinTemplate);
		},
		events: {
			"mouseover #solutionsBtn": "solutionsBtnOver",
			"mouseout #solutionsBtn": "solutionsBtnOut",
			"click #solutionsBtn": "solutionsBtnClick",
			"mouseover #solutionBtn": "solutionBtnOver",
			"mouseout #solutionBtn": "solutionBtnOut",
			"click #solutionBtn": "solutionBtnClick",
			"mouseover #newWin_close": "newWinCloseOver",
			"mouseout #newWin_close": "newWinCloseOut",
			"click #newWin_close": "newWinCloseClick"
		},
		solutionsBtnOver: function(){
			$("#solutionsBtn").removeClass("solutionBtn_n");
			$("#solutionsBtn").addClass("solutionBtn_f");
		},
		solutionsBtnOut: function(){
			$("#solutionsBtn").removeClass("solutionBtn_f");
			$("#solutionsBtn").addClass("solutionBtn_n");
		},
		solutionsBtnClick: function(){
			//新建方案组
			var type = 0;
				
			var map = new HashMap();
			map.put("functionType", "add");
			map.put("functionName", "新建解决方案组");
			map.put("name", "");
			map.put("type", type);
			renameWinView.renameWinOpen(solutionOperateView.addSolutionBar, map);
			$("#newWinView").hide();
		},
		solutionBtnOver: function(){
			$("#solutionBtn").removeClass("solutionBtn_n");
			$("#solutionBtn").addClass("solutionBtn_f");
		},
		solutionBtnOut: function(){
			$("#solutionBtn").removeClass("solutionBtn_f");
			$("#solutionBtn").addClass("solutionBtn_n");
		},
		solutionBtnClick: function(){//解决方案新增点击
			//新建方案
//			var type = 1;
//			
//			var map = new HashMap();
//			map.put("functionType", "add");
//			map.put("functionName", "新建解决方案");
//			map.put("name", "新建解决方案");
//			map.put("type", type);
//			renameWinView.renameWinOpen(solutionOperateView.addSolutionBar, map);
			if (!solutionEditWinView) {
				solutionEditWinView = new SolutionEditWinView();
			}
			var data = {type:"add", name:"", url:""};
			solutionEditWinView.solutionEditWinOpen(solutionOperateView.addSolutionBar, data);
			$("#newWinView").hide();
		},
		newWinCloseOver: function(){
			$("#newWin_close").removeClass("confirm_close_n");
			$("#newWin_close").addClass("confirm_close_f");
		},
		newWinCloseOut: function(){
			$("#newWin_close").removeClass("confirm_close_f");
			$("#newWin_close").addClass("confirm_close_n");
		},
		newWinCloseClick: function(){
			$("#newWinView").hide();
		},
		newWinOpen: function(e){
			$("#newWinView").show();
			event = e;
		}
	});
	
	//重命名对话框
	RenameWinView = Backbone.View.extend({
		el: $("#renameWinView"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var renameWinTemplate = _.template($("#renameWin_template").html());
			$(this.el).html(renameWinTemplate);
		},
		events: {
			"mouseover #renameSaveBtn": "renameSaveBtnOver",
			"mouseout #renameSaveBtn": "renameSaveBtnOut",
			"click #renameSaveBtn": "renameSaveBtnClick",
			"mouseover #renameWin_close": "renameWinCloseOver",
			"mouseout #renameWin_close": "renameWinCloseOut",
			"click #renameWin_close": "renameWinCloseClick",
			"focus #renameText": "focus_renameText"
		},
		renameSaveBtnOver: function(){
			$("#renameSaveBtn").removeClass("confirmButtonY_n");
			$("#renameSaveBtn").addClass("confirmButtonY_f");
		},
		renameSaveBtnOut: function(){
			$("#renameSaveBtn").removeClass("confirmButtonY_f");
			$("#renameSaveBtn").addClass("confirmButtonY_n");
		},
		renameSaveBtnClick: function(){
			if(method != null){
				var type = cmap.get("type");
				var typeName = "";
				if(type == 0){
					typeName = "解决方案组";
				}else if(type == 1){
					typeName = "解决方案";
				}
				if(cmap.get("functionType") == "add"){//新增解决方案(组)
					if($.trim($("#renameText").val()) == ""){
						$(".rename_warning").show();
						$(".rename_warning").html(typeName + "名称不能为空!");
						return;
					}
					else if($.trim($("#renameText").val()) != ""){
						cmap.remove("name");
						cmap.put("name", $.trim($("#renameText").val()));
						$("#renameWinView").hide();
						method(cmap);
					}
				}
				else if(cmap.get("functionType") == "rename"){//解决方案(组)重命名
					if($.trim($("#renameText").val()) == ""){
						$(".rename_warning").show();
						$(".rename_warning").html(typeName + "名称不能为空!");
						return;
					}else if($.trim($("#renameText").val()) == cmap.get("name")){//名字和原来名字一样时
						$("#renameWinView").hide();
						return;
					}else{
						cmap.remove("name");
						cmap.put("name", $.trim($("#renameText").val()));
						$("#renameWinView").hide();
						method(cmap);
					}
				}
				
			}
		},
		renameWinCloseOver: function(){
			$("#renameWin_close").removeClass("confirm_close_n");
			$("#renameWin_close").addClass("confirm_close_f");
		},
		renameWinCloseOut: function(){
			$("#renameWin_close").removeClass("confirm_close_f");
			$("#renameWin_close").addClass("confirm_close_n");
		},
		renameWinCloseClick: function(){
			$("#renameWinView").hide();
		},
		renameWinOpen: function(m, map){
			if(!$(".rename_warning").is(":hidden")){
				$(".rename_warning").hide();
			}
			$("#renameWinView").show();
			method = m;
			cmap = map;
			var functionName = map.get("functionName");
			var name = map.get("name");
			$("#renameWin").children().eq(0).children("h4").text(functionName);
			$("#renameText").val(name);
			$("#renameText").select();
		},
		focus_renameText: function(){
			if(!$(".rename_warning").is(":hidden")){
				$(".rename_warning").hide();
			}
		}
	});
	
	//URL方式标题配置对话框
	FrameTitleConfigWinView = Backbone.View.extend({
		defaultConfig:function(){return {titleFontSize:'12px'};},//默认title配置参数
		titleId: null,//配置的title的ID
		isOpening: false,//配置框是否打开着
		describe: null,//title的配置信息：背景色、文号
		panelState: null,//panel的位置、宽高信息
		isFrame: null, //是否是url形式的解决方案
		el: $("#frameTitleConfig"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var defaultColor = "";//默认颜色配置
			var template = _.template($("#frameTitleConfig_template").html());
			$(this.el).html(template);
			$("#titleBgColor").minicolors({
				control: 'hue',
				defaultValue:defaultColor,
				inline:false,
				letterCase:'uppercase',
				position:'bottom left',
				change: function(hex, opacity) {
					//alert($("#titleBgColor").minicolors("value"));
				},
				theme: 'frameTitleConfig'
			});
		},
		events: {
			"click #frameTitleConfig_close": "close",
			"click #frameTleConfigCancelBtn": "close",
			"click #frameTleConfigSaveBtn": "submit",
			"keyup #titleBgColor":"validate",
			"keyup #titleFontSize":"validate",
			"keyup #panelHeight":"validate",
			"keyup #panelWidth":"validate",
			"keyup #panelPositionX":"validate",
			"keyup #panelPositionY":"validate"
		},
		parsePercentToPx: function(percent, all){
			return Math.round(parseFloat(percent)*0.01*parseFloat(all));
		},
		parsePxToPercent: function(px,all){
			return Math.round(parseFloat(px)/parseFloat(all)*10000)/100;
		},
		initState: function(options){
			var _describe = options||frameTitleConfigView.defaultConfig();
			var _titleBgColor = _describe.titleBgColor;
			var _titleFontSize = _describe.titleFontSize;
			$("#titleBgColor").minicolors("value",_titleBgColor?_titleBgColor:"");
			$("#titleFontSize").val(_titleFontSize?parseInt(_titleFontSize):parseInt(frameTitleConfigView.defaultConfig().titleFontSize));
			if(!this.isFrame){
				$(this.el).find("h4").html("构件配置");
				$("#frameTitleConfigWin").css("height","345px");
				var _panel = $("#"+this.titleId).parent().parent();
				var _panelState = _panel.data("panelState")||{};
				var _allW = $("#working").width();
				$("#panelPositionX").val(frameTitleConfigView.parsePercentToPx(_panelState.x,_allW)||parseInt(_panel.css("left")));
				$("#panelWidth").val(frameTitleConfigView.parsePercentToPx(_panelState.w,_allW)||parseInt(_panel.css("width")));
				$("#panelPositionY").val(parseInt(_panelState.y||_panel.css("top")));
				$("#panelHeight").val(parseInt(_panelState.h||_panel.css("height")));
				$(this.el).find("table tr:gt(2):lt(4)").show();
			}else{
				$(this.el).find("h4").html("标题栏配置");
				$("#frameTitleConfigWin").css("height","");
				$(this.el).find("table tr:gt(2):lt(4)").hide();
			}
			this.validate();
		},
		open: function(options, titleId, isFrame){
			if(this.isOpening){ return false;}
			this.describe = options;
			this.titleId = titleId;
			this.isFrame = isFrame;
			this.initState(options);
			$(this.el).show();
		},
		warning: function(msg){
			$("#frameTitleConfig_warning").html(msg);
		},
		validate: function(){
			this.validateSubmit();
		},
		validateSubmit: function(options){
			this.warning("");
			var _titleBgColor = $("#titleBgColor").minicolors("value");
			var _titleFontSize = ($.trim($("#titleFontSize").val()));
			var _panelPositionX = ($.trim($("#panelPositionX").val()));
			var _panelPositionY = ($.trim($("#panelPositionY").val()));
			var _panelWidth = ($.trim($("#panelWidth").val()));
			var _panelHeight = ($.trim($("#panelHeight").val()));
			var _allW = $("#working").width();
//			var _warning = [];
			if(_titleBgColor&&!/^#([A-F0-9]{6})||([A-F0-9]{3})$/.test(_titleBgColor)){
				this.warning("请输入合法的颜色，如：#FFEEDD");
				return false;
			}
			if(_titleFontSize==''||isNaN(_titleFontSize)||_titleFontSize<0){
				this.warning("请输入合法的字号，如：13");
				return false;
			}
			if(!this.isFrame){
				if(_panelPositionX==''||_panelPositionY==''||isNaN(_panelPositionX)||isNaN(_panelPositionY)||_panelPositionX<0||_panelPositionY<0){
					this.warning("请输入合法的位置，如：30");
					return false;
				}
				if(_panelHeight==''||_panelWidth==''||isNaN(_panelHeight)||isNaN(_panelWidth)||_panelHeight<0||_panelWidth<0){
					this.warning("请输入合法的宽高，如：30");
					return false;
				}
				this.panelState = {
	                   x:(frameTitleConfigView.parsePxToPercent(_panelPositionX,_allW)+'%'),
	                   y:_panelPositionY+='px',
	                   w:(frameTitleConfigView.parsePxToPercent(_panelWidth,_allW)+'%'),                 
	                   h:_panelHeight+='px'
				};
			}
			_titleFontSize = parseInt(_titleFontSize) + "px";
			var _describe = options||frameTitleConfigView.defaultConfig();
			_describe.titleBgColor = _titleBgColor;
			_describe.titleFontSize = _titleFontSize;
			return _describe;
		},
		submit: function(){
			var pfId = pfIdData.get(solutionSelectItemId);
			if (LEFT_MENU_TYPE == 2) {//2层菜单
				pfId = solutionInfo.get(solutionSelectItemId).pfId;
			}
			var _describe;
			var _labels = solutionLabels.get(pfId);
			var _i = !this.isFrame;
			_describe = $("#"+this.titleId).data("titleConfig");
			var _describeStr = JSON2.stringify(_describe);
			if(_i){
//				_describe = this.validateSubmit(_labels[_i.x].panels[_i.y]?_labels[_i.x].panels[_i.y].titleConfig:{});
				_describe = this.validateSubmit(_describe||this.describe);
			}else{
				_describe = this.validateSubmit(_describe||solutionLabels.get(pfId)[0]||this.describe);
			}
			if(!_describe){
				return;
			}
			if(_i){
				/*if(_labels[_i.x].panels[_i.y]){_labels[_i.x].panels[_i.y].titleConfig = _describe;}*/
				if(JSON2.stringify($("#"+this.titleId).parent().parent().data("panelState"))!=JSON2.stringify(this.panelState)||_describeStr!=JSON2.stringify(_describe)){
					isChanged = true;//标识内容已改变，等待切换时候更新
				}
				var _space = $("#"+this.titleId).parent().parent().data("panelState",this.panelState);
				this.resizePanel(this.titleId);
			}else{
				solutionLabels.put(pfId,[_describe]);
				if(_describeStr!=JSON2.stringify(_describe)){
					var url = contextPath + '/updateDescribeById.do';
					var param = {pfId:pfId,describe:JSON.stringify(_describe)};
					if(isFromOrm){
						if(!ORMPermissionWorking('SAVE')){
							operateServerData(url, solutions, null, null, param);
						}
					}
					else if(isFromOutOm){
						if(!checkOutOmPermissionWorking('SAVE')){
							operateServerData(url, solutions, null, null, param);
						}
					}
					else{
						if(!cdtPermissionWorking('CDT-05', 3)){
							operateServerData(url, solutions, null, null, param);
						}
					}
				}
			}
			$("#"+this.titleId).css(getIframeTitleStyle(_describe)).data("titleConfig",_describe)
			this.close();
		},
		close: function(){
			$(this.el).hide();
			this.isOpening = false;
		},
		resizePanel: function(titleId,panelId){
			if(titleId||panelId){
				var _space = titleId?$("#"+titleId).parent().parent():$("#"+panelId);
				var _panelState = _space.data("panelState");
				if(_panelState){
					var _workWidth = $("#working").width();
					var _width = frameTitleConfigView.parsePercentToPx(_panelState.w,_workWidth);
					var _left = frameTitleConfigView.parsePercentToPx(_panelState.x,_workWidth);
					var h2Height = 24;
					_space.css({"left":_left+"px","top":_panelState.y,"width":_width+"px","height":_panelState.h})
					var _height = _space.height();
					_space.find(".frameDiv").height(_height-2-h2Height);//.width(_width-2)
					_space.find(".iframe_css").width(_width-10).height(_height-7-h2Height);
				}
			}
		},
		updatePanelState: function(titleId,panelId){
			if(titleId||panelId){
				var _space = titleId?$("#"+titleId).parent().parent():$("#"+panelId);
				var _panelState = _space.data("panelState");
				var _workWidth = $("#working").width();
				if(_panelState){
					_panelState.w = frameTitleConfigView.parsePxToPercent(_space.css("width"),_workWidth)+"%";
					_panelState.x = frameTitleConfigView.parsePxToPercent(_space.css("left"),_workWidth)+"%";
					_panelState.y = _space.css("top");
					_panelState.h = _space.css("height");
				}
			}
		},resizePanels: function(){
			var _allW = $("#working").width();
			$("#working .working_css").each(function(){
				var _this = $(this);
				var _panelState = _this.data("panelState");
				if(_panelState){
					_this.css({left:frameTitleConfigView.parsePercentToPx(_panelState.x,_allW)+"px",width:frameTitleConfigView.parsePercentToPx(_panelState.w,_allW)+"px"});
					frameTitleConfigView.resizePanel(null,_this.attr("id"));
				}
			});
		}
	})
});