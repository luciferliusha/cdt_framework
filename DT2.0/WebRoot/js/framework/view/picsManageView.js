/**
 * 图片库管理VIEW
 */

function PicManageView(){
	/** 图片库service */
	var picManageService = new PicManageService();
	var picPath = path + "/uploadFils/pics/";
	var addOpeWin; //新增窗口对象
	var editOpeWin; //编辑窗口对象
	var alertTitle = '操作提示';
	var picData = []; //数据数组
	var check_submit = {"picsManage":true};//防止表单重复提交
	
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
			var _pic_n_notForIE8 = picPath + _item.pic;
			if (window.navigator.userAgent.indexOf("MSIE")>=1) {
	    		var index = navigator.userAgent.indexOf("MSIE");
	    		var versions = parseInt(navigator.userAgent.substring(index+5,index+8));
	    		if(versions == 8){//IE7、IE8、IE9
	    			_pic_n_notForIE8 = "";
	    		}
	        }
			var _picItem = $.render($("#pic-item-template").html(),{pic_id: _item.picId, pic_n_notForIE8: _pic_n_notForIE8, pic_n1: picPath + _item.pic, pic_name: _item.picName});
			$("#pic_list").append(_picItem);
			picData.push(_item);
		}
	};
	
	/**
	 * 获取图片库数据
	 * @returns
	 */
	var getPicsData = function() {
		picManageService.getPicsData(randerView);
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
			if(_$.find(".txt_error").size()==0 && check_submit.picsManage){
				check_submit.picsManage = false;
				_$.find("#pic_add_form").submit();
			}
		});
		_$.find("#add_pic_name").unbind().bind('focus',function(){
			var _this = $(this);
			var _val = $.trim(_this.val());
			var _tip = $("#"+_this.attr("id")+"_msg");
			_tip.attr("class","txt_info").html("图片名称不能超过25个字！");
			_this.removeClass("textInput_n");
			_this.addClass("textInput_p");
		}).bind('blur',function(){
			var _this = $(this);
			var _val = $.trim(_this.val());
			_this.val(_val);
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				_tip.attr("class","txt_error").html("图片名称为必填项！");
			}else if(_val.length>25){
				_tip.attr("class","txt_error").html("图片名称不能超过25个字符！");
			}else {
				_tip.attr("class","txt_info").html("图片名称不能超过25个字！");
			}
			_this.removeClass("textInput_p");
			_this.addClass("textInput_n");
		});
		_$.find("#add_pic_normal").unbind().uploadPreview({target:"#add_pic_nor_pre",width:"200",height:"150",focusId:"add_pic_nor_pre"}).bind('change',function(){
			$("#add_pic_nor_pre").css("background-color",'transparent');
		}).bind('change.check',function(){
			var _this = $(this);
			var _val = _this.val();
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				_tip.attr("class","txt_error").html("请选择图片！");
			}else if(/\.(jpg|jpeg|gif|png)$/i.test(_val)){
				_tip.attr("class","txt_info").html("仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。");
			}else{
				_tip.attr("class","txt_error").html("仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。");
			}
		});
		_$.find("#add_pic_selected").unbind().uploadPreview({target:"#add_pic_sel_pre",width:"200",height:"150",focusId:"add_pic_sel_pre"}).bind('change',function(){
			$("#add_pic_sel_pre").css("background-color",'transparent');
		}).bind('change.check',function(){
			var _this = $(this);
			var _val = _this.val();
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				_tip.attr("class","txt_error").html("选中图片为必填项！");
			}else if(/\.(jpg|jpeg|gif|png)$/i.test(_val)){
				_tip.attr("class","txt_info").html("仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。");
			}else{
				_tip.attr("class","txt_error").html("仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。");
			}
		});
	};
	
	/**
	 * 编辑界面初始化
	 */
	var initEditOpeWin = function(_win,_index){
		var _item = picData[_index];
		_win.index = _index; //编辑项
		var _$ = _win.$;
		_$.find("#edit_cancel").unbind().bind('click',function(){
			_win.close();
		});
		_$.find("#edit_submit").unbind().bind('click',function(){
			_$.find("input").trigger("blur").trigger('change.check');
			if(_$.find(".txt_error").size()==0){
				_$.find("#pic_edit_form").submit();
			}
		});
		_$.find("#edit_pic_name").unbind().bind('focus',function(){
			var _this = $(this);
			var _val = $.trim(_this.val());
			var _tip = $("#"+_this.attr("id")+"_msg");
			_tip.attr("class","txt_info").html("图片名称不能超过25个字！");
			_this.removeClass("textInput_n");
			_this.addClass("textInput_p");
		}).bind('blur',function(){
			var _this = $(this);
			var _val = $.trim(_this.val());
			_this.val(_val);
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				_tip.attr("class","txt_error").html("图片名称为必填项！");
			}else if(_val.length>25){
				_tip.attr("class","txt_error").html("图片名称不能超过25个字符！");
			}else {
				_tip.attr("class","txt_info").html("图片名称不能超过25个字！");
			}
			_this.removeClass("textInput_p");
			_this.addClass("textInput_n");
		});
		_$.find("#edit_pic_normal").unbind().uploadPreview({target:"#edit_pic_nor_pre",width:"200",height:"150",focusId:"edit_pic_nor_pre"}).bind('change',function(){
			var _pre = $("#edit_pic_nor_pre");
			if(!_pre.attr('css.bk')){
				_pre.attr('css.bk',_pre.css("background"));
			}
			_pre.css("background",'');
		}).bind('change.check',function(){
			var _this = $(this);
			var _val = _this.val();
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				var _pre = $("#edit_pic_nor_pre");
				var _bkcss = _pre.attr('css.bk');
				if(_bkcss){_pre.css("background",_bkcss);}
			}else if(/\.(jpg|jpeg|gif|png)$/i.test(_val)){
				_tip.attr("class","txt_info").html("仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。");
			}else{
				_tip.attr("class","txt_error").html("仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。");
			}
		});
		_$.find("#edit_pic_selected").unbind().uploadPreview({target:"#edit_pic_sel_pre",width:"200",height:"150",focusId:"edit_pic_sel_pre"}).bind('change',function(){
			var _pre = $("#edit_pic_sel_pre");
			if(!_pre.attr('css.bk')){
				_pre.attr('css.bk',_pre.css("background"));
			}
			_pre.css("background",'');
		}).bind('change.check',function(){
			var _this = $(this);
			var _val = _this.val();
			var _tip = $("#"+_this.attr("id")+"_msg");
			if(_val==''){
				var _pre = $("#edit_pic_sel_pre");
				var _bkcss = _pre.attr('css.bk');
				if(_bkcss){_pre.css("background",_bkcss);}
			}else if(/\.(jpg|jpeg|gif|png)$/i.test(_val)){
				_tip.attr("class","txt_info").html("仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。");
			}else{
				_tip.attr("class","txt_error").html("仅支持小于2M的JPG、JPEG、GIF、PNG格式文件。建议尺寸200*150。");
			}
		});
	};
	
	/**
	 * 列表操作按钮事件绑定
	 */
	var bindListOpeEvent = function(){
		$("#pic_add").unbind().bind("click",function(){
			addOpeWin = new OpeWinView({title:"新增图片",content:$.render($("#pic-add-template").html()),width:530,height:350});
			initAddOpeWin(addOpeWin);
			addOpeWin.show();
			check_submit.picsManage = true;
		});
		
		$("#pic_delete").unbind().bind("click",function(){
			var _sels = $("#pic_list li.selected");
			if(_sels.size()>0){
				var msg = "确定要删除以下图片？<ol class='pic_del_list'>";
				var idArr = [];
				_sels.each(function(){
					var _item = picData[$(this).index()];
					var _itemId = _item.picId;
					var _itemName = _item.picName;
					if(_item){
						msg+=("<li>"+_itemName+"</li>");
						idArr.push(_itemId);
					}
				});
				msg+="</ol>";
				$.messager.confirm(alertTitle, alertMsgWrap(msg), function(r){
				  if (r){	
					  picManageService.delPicsData(delPicsCallBack, {data: idArr.join(',')}, _sels);
				  }
				});
			}else{
				$.messager.alert(alertTitle,"请选择要删除的图片！",'warning');
			}
		});
		
		$("#pic_list").find(".picSpan").die("click").live("click",function(){
			var _this = $(this);
			_this.parent().toggleClass("selected");
		});
		
		$("#pic_list").find(".picDiv").die("click").live("click",function(){
			var _i = $(this).parent().index();
			var _item = picData[_i];
			editOpeWin = new OpeWinView({
				title:"编辑图片",
				content:$.render($("#pic-edit-template").html(),{
						pic_id: _item.picId,
						pic_n1: picPath + _item.pic,
						pic_name: _item.picName
					}
				),width:530,height:350});
			initEditOpeWin(editOpeWin, _i);
			editOpeWin.show();
		});
	};
	
	/**
	 * 更新图片的回调函数
	 */
	this.updatePicCallBack = function(data){
		var _item = picData[editOpeWin.index];
		if(_item){
			for(var i in data){
				_item[i] = data[i];
			}
			var _pic_n_notForIE8 = picPath + _item.pic;
			if (window.navigator.userAgent.indexOf("MSIE")>=1) {
	    		var index = navigator.userAgent.indexOf("MSIE");
	    		var versions = parseInt(navigator.userAgent.substring(index+5,index+8));
	    		if(versions == 8){//IE7、IE8、IE9
	    			_pic_n_notForIE8 = "";
	    		}
	        }
			$("#pic"+_item.picId).replaceWith($.render($("#pic-item-template").html(),{pic_id: _item.picId, pic_n_notForIE8: _pic_n_notForIE8, pic_n1: picPath + _item.pic, pic_name: _item.picName}));
			$.messager.alert(alertTitle,"图片更新成功！",'info');
			editOpeWin.close();
		}
	};
	
	/**
	 * 删除图片的回调函数
	 */
	var delPicsCallBack = function(data, _sels) {
		(_sels||$("#pic_list li.selected")).each(function(){
			var _this = $(this);
			picData.splice(_this.index(),1);
			_this.remove();
		});
		$.messager.alert(alertTitle,"图片删除成功！",'info');
	};
	
	/**
	 * 添加图片的回调函数
	 */
	this.addPicCallBack = function(data){
		randerView([data]);
		$.messager.alert(alertTitle,"图片添加成功！",'info');
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
		getPicsData();
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
		_this.$ = _win = $($.render($("#pic-win-template").html(),{title:options.title}));
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