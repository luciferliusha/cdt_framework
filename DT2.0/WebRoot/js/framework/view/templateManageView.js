/**
 * 模板库管理VIEW
 */

function TemplateManageView(){
	/** 模板库service */
	var templateManageService = new TemplateManageService();
	var templateTree = $("#templateTree_ul"); //EasyUI tree
	var templateData = []; //模板数据
	var alertTitle = '操作提示';
	var opeType = "add"; // add, edit 操作类型：新增 或 编辑
	var titleEditInfo = ["模板名称不能超过25个字！","模板名称超过25字符了！","模板名称为必填字段！"];
	var contextEditInfo = ["请输入模板内容！","模板内容为必填字段！"];
	var memoEditInfo = ["模板简介不能超过50个字！","模板简介超过50字符了！"];
	var editor;
	var check_submit = {"templateManage":true};//防止表单重复提交
	
	/**
	 * 将返回的数据转换成EasyUI的tree所接受的参数形式
	 */
	var parseDataToTreeArr = function(data){
		var _treeArr = [];
		for(var i=0; i<data.length; i++) {
			var _item = data[i];
			templateData.push(_item);
			_treeArr.push({id:_item.id, text:_item.name});
		}
		return _treeArr;
	};
	
	/**
	 * Easy message alert 布局处理
	 */
	var alertMsgWrap = function(msg){
		return '<div style="width: 215px;float: left;">'+msg+'</div>';
	};
	
	/**
	 * 渲染数据
	 * @param data
	 * @returns
	 */
	var randerView = function(data) {
		$('#templateTree_ul').tree("append",{data:parseDataToTreeArr(data)});
		reloadTitleForItem();
	};
	
	/**
	 * 给列表添加title提示信息
	 */
	var reloadTitleForItem = function(){
		var _arr = $("#templateTree_ul").tree('getRoots');
		for(var i=0; i<_arr.length; i++){
			var _item = _arr[i];
			$(_item.target).attr("title",_item.text);
		}
	};
	
	/**
	 * 初始化模板编辑界面
	 */
	var initTemplateEdit = function(item){
		opeType = item?'edit':'add';
		var _item = item||{name:'',id:'',memo:'',context:''};
		var _view = $("#templateEdit");
		_view.find("#titleEditInfo").attr("class","txt_info").html(titleEditInfo[0]);
		_view.find("#contextEditInfo").attr("class","txt_info").html(contextEditInfo[0]);
		_view.find("#memoEditInfo").attr("class","txt_info").html(memoEditInfo[0]);
		_view.find("#titleEdit").val(_item.name);
		editor.setData(_item.context);
		//_view.find("#contextEdit").val(_item.context);
		_view.find("#memoEdit").val(_item.memo);
	};
	
	/**
	 * 获取模板库数据
	 * @returns
	 */
	var getTemplateData = function() {
		templateManageService.getTemplateData(randerView);
	};
	
	/**
	 * 添加模板数据
	 */
	var addTemplateData = function(param) {
		templateManageService.addTemplateData(addTemplateCallBack, param, check_submit, function(){
			check_submit.templateManage = false;
		}, function(){
			check_submit.templateManage = true;
		});
	};
	
	/**
	 * 添加模板数据回调函数
	 */
	var addTemplateCallBack = function(data) {
		randerView([data]);
		initTemplateEdit();
		$.messager.alert(alertTitle,"模板添加成功！",'info');
	};
	
	/**
	 * 删除模板数据
	 */
	var delTemplateData = function(param) {
		templateManageService.delTemplateData(delTemplateCallBack, param);
	};
	
	/**
	 * 删除模板数据回调函数
	 */
	var delTemplateCallBack = function(param) {
		var _nodes = templateTree.tree("getChecked");
		var _sel = templateTree.tree('getSelected');
		if(_sel&&_sel.checked){ //选中项被删除则初始化编辑界面
			initTemplateEdit();
		}
		$.each(_nodes, function(i, v){
			templateData.splice($(v.target).parent().index(),1);
			templateTree.tree('remove',v.target);
		});
		$.messager.alert(alertTitle,"模板删除成功！",'info');
	};
	
	/**
	 * 更新模板数据
	 */
	var updateTemplateData = function(param, obj) {
		templateManageService.updateTemplateData(updateTemplateCallBack, param, obj);
	};
	
	/**
	 * 更新模板数据回调函数
	 */
	var updateTemplateCallBack = function(data, obj) {
		var _sel = templateTree.tree("getSelected");
		templateTree.tree('update', {
			target: _sel.target,
			text: obj.name
		});
		var _item = templateData[$(_sel.target).parent().index()];
		_item.name = obj.name;
		_item.context = obj.context;
		_item.memo = obj.memo;
		$.messager.alert(alertTitle,"模板更新成功！",'info');
	};
	
	/**
	 * 获取编辑界面数据
	 */
	var getEditTemplate = function() {
		var _name = $("#titleEdit").val();
		//var _context = $("#contextEdit").val();
		var _context = editor.getData();
		var _memo = $("#memoEdit").val();
		var _obj = {name:_name,context:_context,memo:_memo};
		var _sel = templateTree.tree("getSelected");
		if(_sel!=null){
			_obj.id = _sel.id;
		}
		return _obj;
	};
	
	/**
	 * 初始化相关事件
	 */
	var bindOpeEvent = function() {
		$("#template_ope_add").unbind().bind('click', function(){
			templateTree.find("div.tree-node-selected").removeClass('tree-node-selected');//去掉选中状态
			initTemplateEdit();
		});
		$("#template_ope_delete").unbind().bind('click', function(){
			var _nodes = templateTree.tree('getChecked');
			if(_nodes.length>0){
				var msg = "确定要删除以下模板？<ol class='template_del_list'>";
				var idArr = [];
				$.each(_nodes, function(i, v){
					var _item = templateData[$(v.target).parent().index()];
					if(_item){
						msg+=("<li>"+_item.name+"</li>");
						idArr.push(_item.id);
					}
				});
				msg+="</ol>";
				$.messager.confirm(alertTitle, alertMsgWrap(msg), function(r){
				  if (r){	
					  delTemplateData({data: idArr.join(',')});
				  }
				});
			}else{
				$.messager.alert(alertTitle,"请勾选要删除的模板！",'warning');
			}
		});
		$("#submitEdit").unbind().bind('click', function(){
			$("#titleEdit").trigger("blur");
			//$("#contextEdit").trigger("blur");
			editor.fire("blur");
			$("#memoEdit").trigger("blur");
			
			if($(".txt_error").size()>0) {
				return;
			}
			var _obj = getEditTemplate();
			var _str = JSON2.stringify(_obj);
			if(opeType=='edit'){
				updateTemplateData({data: _str}, _obj);
			}else if(opeType=='add'){
				addTemplateData({data: _str});
			}
			
		});
		
		$("#titleEdit").unbind().bind('focus', function(){
			$("#titleEditInfo").attr("class","txt_info").html(titleEditInfo[0]);
			$(this).removeClass("textInput_n");
			$(this).addClass("textInput_p");
		}).bind('blur', function(){
			var _v = $.trim($(this).val());
			$(this).val(_v);
			var _info = $("#titleEditInfo");
			if(_v==''){
				_info.attr("class","txt_error").html(titleEditInfo[2]);
			}else if(_v.length>25){
				_info.attr("class","txt_error").html(titleEditInfo[1]);
			}else {
				_info.attr("class","txt_info").html(titleEditInfo[0]);
			}
			$(this).removeClass("textInput_p");
			$(this).addClass("textInput_n");
		});
		
//		$("#contextEdit").unbind().bind('focus', function(){
//			$("#contextEditInfo").attr("class","txt_info").html(contextEditInfo[0]);
//		}).bind('blur', function(){
//			var _v = $.trim($(this).val());
//			$(this).val(_v);
//			var _info = $("#contextEditInfo");
//			if(_v==''){
//				_info.attr("class","txt_error").html(contextEditInfo[1]);
//			}else{
//				_info.attr("class","txt_info").html(contextEditInfo[0]);
//			}
//		});
		editor.on( 'focus', function( e ) {
			$("#contextEditInfo").attr("class","txt_info").html(contextEditInfo[0]);
		});
		editor.on( 'blur', function( e ) {
			var _v = editor.getData();
			var _info = $("#contextEditInfo");
			if(_v==''){
				_info.attr("class","txt_error").html(contextEditInfo[1]);
			}else{
				_info.attr("class","txt_info").html(contextEditInfo[0]);
			}
		} );
		
		$("#memoEdit").unbind().bind('focus', function(){
			$("#memoEditInfo").attr("class","txt_info").html(memoEditInfo[0]);
			$(this).removeClass("textarea_input_text_n");
			$(this).addClass("textarea_input_text_p");
		}).bind('blur', function(){
			var _v = $.trim($(this).val());
			$(this).val(_v);
			var _info = $("#memoEditInfo");
			if(_v.length>50){
				_info.attr("class","txt_error").html(memoEditInfo[1]);
			}else{
				_info.attr("class","txt_info").html(memoEditInfo[0]);
			}
			$(this).removeClass("textarea_input_text_p");
			$(this).addClass("textarea_input_text_n");
		});
		
		$("#temp_help_link").unbind().bind('click', function(){
			new OpeWinView({title:"模板编写说明",content:$.render($("#temp-help-template").html()),width:450,height:260}).show();
		});
	};

	/**
	 * 初始化
	 */
	this.init = function() {
		ppath = path + "/js/framework/ckeditor-plugins/";
		CKEDITOR.plugins.addExternal( 'dropclass', ppath+'dropclass/' );
		CKEDITOR.plugins.addExternal( 'elementope', ppath+'elementope/' );
		CKEDITOR.plugins.addExternal( 'editstyle', ppath+'editstyle/' );
		CKEDITOR.plugins.addExternal( 'elementinsert', ppath+'elementinsert/' );
		editor = CKEDITOR.replace( 'contextEdit',
			{
				title: false, //取消编辑器的title
				//autoParagraph: false,
				enterMode: CKEDITOR.ENTER_DIV,
				contentsCss: path+'/css/template_ckeditor_contentCss.css',//加载配置样式
				ignoreEmptyParagraph: false,//不忽略空
				allowedContent: true, //不过滤html代码
				toolbar: [
		          ['Source','Maximize','ShowBlocks'],
		          ['Undo','Redo','Cut','Copy','Paste', '-',  //,'PasteText','PasteFromWord'
		           'Bold', 'Italic','Underline','Strike','RemoveFormat'],
		           ['Styles','Format','Font','Fontsize','TextColor','BGColor'],
		           ['NumberedList','BulletedList','Outdent','Indent'],
		           ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
		           ['Bidiltr','Bidirtl','Link','Unlink','Anchor','Table']
		            ],
		            extraPlugins: 'dropclass,editstyle,elementope,elementinsert', //加载插件
		            removePlugins: 'div',//移除div插件，防止干扰
		            customConfig: '', //取消加载配置文件
				    on: { //事件绑定
						instanceReady: function(evt){ //初始化事件
							var edit = evt.editor;
							edit.execCommand('showblocks'); 
						}
					}
			});
		templateTree.tree({
			checkbox: true,
			onSelect: function(node){
				var _item = templateData[$(node.target).parent().index()];
				initTemplateEdit(_item);
			}
		});
		initTemplateEdit();
		getTemplateData();
		bindOpeEvent();
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
		_this.$ = _win = $($.render($("#win-template").html(),{title:options.title}));
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
