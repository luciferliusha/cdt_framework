/**
 * 图标库管理VIEW
 */

function IconManageView(){
	/** 图标库service */
	var iconManageService = new IconManageService();
	var iconPath = path + "/uploadFils/icons/";
	var addOpeWin; //新增窗口对象
	var editOpeWin; //编辑窗口对象
	var alertTitle = '操作提示';
	var iconData = []; //数据数组
	var check_submit = {"iconsManage":true};//防止表单重复提交
	
	var alertMsgWrap = function(msg){
		return '<div style="width: 215px;float: left;">'+msg+'</div>';
	};
	
	/**
	 * 渲染数据
	 * @param data
	 * @returns
	 */
	var randerView = function(data) {
		for ( var i = 0; i < data.length; i++) {
			var _item = data[i];
			var _iconItem = $.render($("#icon-item-template").html(),{icon_id: _item.iconId, icon_n1: iconPath + _item.iconNormal, icon_s1: iconPath + _item.iconSelected, icon_name: _item.iconName});
			$("#icon_list").append(_iconItem);
			iconData.push(_item);
		}
	};
	
	/**
	 * 获取图标库数据
	 * @returns
	 */
	var getIconsData = function() {
		iconManageService.getIconsData(randerView);
	};
	
	/**
	 * 添加界面初始化
	 */
	var initAddOpeWin = function(_win){
		var _$ = _win.$;
		_win.validate = true;
		_$.find("#add_cancel").unbind().bind('click',function(){
			_win.close();
		});
		_$.find("#add_submit").unbind().bind('click',function(){
			_$.find("input").trigger("blur").trigger('change.check');
			if(_$.find(".txt_error").size()==0 && check_submit.iconsManage){
				check_submit.iconsManage = false;
				_$.find("#icon_add_form").submit();
			}
		});
		_$.find("#add_icon_name").unbind().bind('focus',function(){
			var _this = $(this);
			var _val = $.trim(_this.val());
			var _tip = $("#"+_this.attr("id")+"_msg");
			_tip.attr("class","txt_info").html("图标名称不能超过25个字！");
			_this.removeClass("textInput_n");
			_this.addClass("textInput_p");
		}).bind('blur',function(){
			var _this = $(this);
			var _val = $.trim(_this.val());
			_this.val(_val);
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				_tip.attr("class","txt_error").html("图标名称为必填项！");
			}else if(_val.length>25){
				_tip.attr("class","txt_error").html("图标名称不能超过25个字符！");
			}else {
				_tip.attr("class","txt_info").html("图标名称不能超过25个字！");
			}
			_this.removeClass("textInput_p");
			_this.addClass("textInput_n");
		});
		_$.find("#add_icon_normal").unbind().uploadPreview({target:"#add_icon_nor_pre",width:"20",height:"20",focusId:"add_icon_nor_pre"}).bind('change',function(){
			$("#add_icon_nor_pre").css("background-color",'transparent');
		}).bind('change.check',function(){
			var _this = $(this);
			var _val = _this.val();
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				_tip.attr("class","txt_error").html("常态图标为必填项！");
			}else if(/\.(jpg|jpeg|gif|png)$/i.test(_val)){
				_tip.attr("class","txt_info").html("仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。");
			}else{
				_tip.attr("class","txt_error").html("仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。");
			}
		});
		_$.find("#add_icon_selected").unbind().uploadPreview({target:"#add_icon_sel_pre",width:"20",height:"20",focusId:"add_icon_sel_pre"}).bind('change',function(){
			$("#add_icon_sel_pre").css("background-color",'transparent');
		}).bind('change.check',function(){
			var _this = $(this);
			var _val = _this.val();
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				_tip.attr("class","txt_error").html("选中图标为必填项！");
			}else if(/\.(jpg|jpeg|gif|png)$/i.test(_val)){
				_tip.attr("class","txt_info").html("仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。");
			}else{
				_tip.attr("class","txt_error").html("仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。");
			}
		});
	};
	
	/**
	 * 编辑界面初始化
	 */
	var initEditOpeWin = function(_win,_index){
		var _item = iconData[_index];
		_win.index = _index; //编辑项
		var _$ = _win.$;
		_$.find("#edit_cancel").unbind().bind('click',function(){
			_win.close();
		});
		_$.find("#edit_submit").unbind().bind('click',function(){
			_$.find("input").trigger("blur").trigger('change.check');
			if(_$.find(".txt_error").size()==0){
				_$.find("#icon_edit_form").submit();
			}
		});
		_$.find("#edit_icon_name").unbind().bind('focus',function(){
			var _this = $(this);
			var _val = $.trim(_this.val());
			var _tip = $("#"+_this.attr("id")+"_msg");
			_tip.attr("class","txt_info").html("图标名称不能超过25个字！");
			_this.removeClass("textInput_n");
			_this.addClass("textInput_p");
		}).bind('blur',function(){
			var _this = $(this);
			var _val = $.trim(_this.val());
			_this.val(_val);
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				_tip.attr("class","txt_error").html("图标名称为必填项！");
			}else if(_val.length>25){
				_tip.attr("class","txt_error").html("图标名称不能超过25个字符！");
			}else {
				_tip.attr("class","txt_info").html("图标名称不能超过25个字！");
			}
			_this.removeClass("textInput_p");
			_this.addClass("textInput_n");
		});
		_$.find("#edit_icon_normal").unbind().uploadPreview({target:"#edit_icon_nor_pre",width:"20",height:"20",focusId:"edit_icon_nor_pre"}).bind('change',function(){
			var _pre = $("#edit_icon_nor_pre");
			if(!_pre.attr('css.bk')){
				_pre.attr('css.bk',_pre.css("background"));
			}
			_pre.css("background",'');
		}).bind('change.check',function(){
			var _this = $(this);
			var _val = _this.val();
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				var _pre = $("#edit_icon_nor_pre");
				var _bkcss = _pre.attr('css.bk');
				if(_bkcss){_pre.css("background",_bkcss);}
			}else if(/\.(jpg|jpeg|gif|png)$/i.test(_val)){
				_tip.attr("class","txt_info").html("仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。");
			}else{
				_tip.attr("class","txt_error").html("仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。");
			}
		});
		_$.find("#edit_icon_selected").unbind().uploadPreview({target:"#edit_icon_sel_pre",width:"20",height:"20",focusId:"edit_icon_sel_pre"}).bind('change',function(){
			var _pre = $("#edit_icon_sel_pre");
			if(!_pre.attr('css.bk')){
				_pre.attr('css.bk',_pre.css("background"));
			}
			_pre.css("background",'');
		}).bind('change.check',function(){
			var _this = $(this);
			var _val = _this.val();
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				var _pre = $("#edit_icon_sel_pre");
				var _bkcss = _pre.attr('css.bk');
				if(_bkcss){_pre.css("background",_bkcss);}
			}else if(/\.(jpg|jpeg|gif|png)$/i.test(_val)){
				_tip.attr("class","txt_info").html("仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。");
			}else{
				_tip.attr("class","txt_error").html("仅支持小于1M的JPG、JPEG、GIF、PNG格式文件。建议尺寸16*16。");
			}
		});
	};
	
	/**
	 * 列表操作按钮事件绑定
	 */
	var bindListOpeEvent = function(){
		$("#icon_add").unbind().bind("click",function(){
			addOpeWin = new OpeWinView({title:"新增图标",content:$.render($("#icon-add-template").html()),width:530,height:250});
			initAddOpeWin(addOpeWin);
			addOpeWin.show();
			check_submit.iconsManage= true;
		});
		
		$("#icon_delete").unbind().bind("click",function(){
			var _sels = $("#icon_list li.selected");
			if(_sels.size()>0){
				var msg = "确定要删除以下图标？<ol class='icon_del_list'>";
				var idArr = [];
				_sels.each(function(){
					var _item = iconData[$(this).index()];
					if(_item){
						msg+=("<li>"+_item.iconName+"</li>");
						idArr.push(_item.iconId);
					}
				});
				msg+="</ol>";
				$.messager.confirm(alertTitle, alertMsgWrap(msg), function(r){
				  if (r){	
					  iconManageService.delIconsData(delIconsCallBack, {data: idArr.join(',')}, _sels);
				  }
				});
			}else{
				$.messager.alert(alertTitle,"请选择要删除的图标！",'warning');
			}
		});
		
		$("#icon_list").find(".iconSpan").die("click").live("click",function(){
			var _this = $(this);
			_this.parent().toggleClass("selected");
		});
		
		$("#icon_list").find(".iconDiv").die("click").live("click",function(){
			var _i = $(this).parent().index();
			var _item = iconData[_i];
			editOpeWin = new OpeWinView({
				title:"编辑图标",
				content:$.render($("#icon-edit-template").html(),{
						icon_id: _item.iconId,
						icon_n1: iconPath + _item.iconNormal,
						icon_s1: iconPath + _item.iconSelected,
						icon_name: _item.iconName
					}
				),width:530,height:250});
			initEditOpeWin(editOpeWin, _i);
			editOpeWin.show();
		});
	};
	
	/**
	 * 更新图标的回调函数
	 */
	this.updateIconCallBack = function(data){
		var _item = iconData[editOpeWin.index];
		if(_item){
			for(var i in data){
				_item[i] = data[i];
			}
			$("#icon"+_item.iconId).replaceWith($.render($("#icon-item-template").html(),{icon_id: _item.iconId, icon_n1: iconPath + _item.iconNormal, icon_s1: iconPath + _item.iconSelected, icon_name: _item.iconName}));
			$.messager.alert(alertTitle,"图标更新成功！",'info');
			editOpeWin.close();
		}
	};
	
	/**
	 * 删除图标的回调函数
	 */
	var delIconsCallBack = function(data, _sels) {
		(_sels||$("#icon_list li.selected")).each(function(){
			var _this = $(this);
			iconData.splice(_this.index(),1);
			_this.remove();
		});
		$.messager.alert(alertTitle,"图标删除成功！",'info');
	};
	
	/**
	 * 添加图标的回调函数
	 */
	this.addIconCallBack = function(data){
		randerView([data]);
		$.messager.alert(alertTitle,"图标添加成功！",'info');
		addOpeWin.close();
	};
	
	/**
	 * 上传文件失败回调函数
	 */
	this.uploadFileErrorCallBack = function(msg){
		 $.messager.alert(alertTitle,msg,'error');
	};

	/**
	 * 初始化
	 */
	this.init = function() {
		getIconsData();
		bindListOpeEvent();
	};
}

/**
 * 窗口View
 * @param options
 * @return
 */
function OpeWinView(options){
	this.options = options;
	var _win;
	var _isShow = false;
	var _this = this;
	var _close = function(){
		if(_isShow){
			_isShow = false;
			_win.remove();
			$(".all_background").hide();
		}
	};
	var renderView = function(options){
		_this.$ = _win = $($.render($("#icon-win-template").html(),{title:options.title}));
		_win.css({"width":parseFloat(options.width)+"px","height":parseFloat(options.height)+"px","margin-left":-parseFloat(options.width)/2+"px","margin-top":-parseFloat(options.height)/2+"px"});
		_win.find(".ope_win_close").unbind().bind('click',function(){
			_close();
		});
		_win.find(".ope_win_content").html(options.content);
	};
	this.close = _close;
	this.show = function(){
		if(!_isShow){
			_isShow = true;
			$(".all_background").show();
			$("body").append(_win);
		}
	};
	renderView(options);
} 