/**
 * 解决方案设置view（新建、编辑）
 */
$(function(){

	var callback;//回调
	var cacheData;//数据
	
	/** 解决方案编辑对话框*/
	SolutionEditWinView = Backbone.View.extend({
		el: $("#solutionEditWinView"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var solutionEditWinTemplate = _.template($("#solutionEditWin_template").html());
			$(this.el).html(solutionEditWinTemplate);
		},
		events: {
			"mouseover #renameSaveBtn": "renameSaveBtnOver",
			"mouseout #renameSaveBtn": "renameSaveBtnOut",
			"click #renameSaveBtn": "renameSaveBtnClick",
			"mouseover #solutionEditWin_close": "solutionEditWinCloseOver",
			"mouseout #solutionEditWin_close": "solutionEditWinCloseOut",
			"click #solutionEditWin_close": "solutionEditWinCloseClick",
			"focus #renameSolutionText": "focus_renameSolutionText",
			"focus #renameUrlText": "focus_renameSolutionText"
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
			if(callback != null){
				if($.trim($("#renameSolutionText").val()) == ""){
					$(".solutionEdit_warning").show();
					$(".solutionEdit_warning").html("解决方案名称不能为空!");
					return;
				}
				if($.trim($("#renameUrlText").val()) != "" && !validateRules.isUrl($.trim($("#renameUrlText").val()))){
					$(".solutionEdit_warning").show();
					$(".solutionEdit_warning").html("URL格式输入不正确!");
					return;
				}
				if(cacheData.type == "add"){//新增解决方案
					$("#solutionEditWin").css("height", 192);
					$("#solutionEditWin .font-info-div").css("height", 107);
					$("#solutionEditTr").hide();
					$("#solutionEditWinView").hide();
					var data = new HashMap();
					data.put("type", 1);//1解决方案
					data.put("name", $.trim($("#renameSolutionText").val()));
					var url = $.trim($("#renameUrlText").val()).replace(/\"/ig,"\'");
					url = url.replace(/%22/ig,"\'");
					data.put("url", url);//"转换'
					data.put('describe',{isShowTitle: $("#isShowTitle").prop("checked")});//是否显示标题
					if (LEFT_MENU_TYPE == 2) {//2层菜单
						data.put("parent", $("#solutionGroupSelect").combobox("getValue"));
					}
					callback(data);
				}
				else if(cacheData.type == "edit"){//解决方案重命名
					var url = $.trim($("#renameUrlText").val()).replace(/\"/ig,"\'");//"转换'
					var _isShowTitle = $("#isShowTitle").prop("checked");
					var _desc = cacheData.describe||{};
					//name、url、标题显示都未改变，则返回
					if (cacheData.name == $.trim($("#renameSolutionText").val()) && cacheData.url == url && (url==''||_desc.isShowTitle == _isShowTitle)) {
						$("#solutionEditWinView").hide();
						return;
					}
					$("#solutionEditWinView").hide();
					var data = new HashMap();
					data.put("type", 1);//1解决方案
					data.put("name", $.trim($("#renameSolutionText").val()));
					data.put("url", url);
					if(url){
						_desc.isShowTitle = _isShowTitle;//状态更新
					}
					data.put("describe",_desc);
					callback(data);
				}
			}
		},
		solutionEditWinCloseOver: function(){
			$("#solutionEditWin_close").removeClass("confirm_close_n");
			$("#solutionEditWin_close").addClass("confirm_close_f");
		},
		solutionEditWinCloseOut: function(){
			$("#solutionEditWin_close").removeClass("confirm_close_f");
			$("#solutionEditWin_close").addClass("confirm_close_n");
		},
		solutionEditWinCloseClick: function(){
			$("#solutionEditWin").css("height", 192);
			$("#solutionEditWin .font-info-div").css("height", 107);
			$("#solutionEditTr").hide();
			$("#solutionEditWinView").hide();
		},
		solutionEditWinOpen: function(method, data){
			if(!$(".solutionEdit_warning").is(":hidden")){
				$(".solutionEdit_warning").hide();
			}
			$("#solutionEditWin").css("top",clientHeight/2-$("#solutionEditWin").height()/2 + "px");
			$("#solutionEditWin").css("left",clientWidth/2-$("#solutionEditWin").width()/2 + "px");
			$("#solutionEditWinView").show();
			callback = method;
			cacheData = data;
			var functionName = "";
			if (cacheData.type=="add") {
				functionName = "新建解决方案";
				if (LEFT_MENU_TYPE == 2) {//2层菜单
					var solutionGrpData = solutionGroupInfo.values();
					solutionGrpData.unshift({divId:"solutions_groups",pfId:0,name:"根目录",type:0});//添加空白代表根节点
					$("#solutionEditTr").show();
					$("#solutionGroupSelect").combobox({//组装解决方案下拉框
						"width":203,
						"panelHeight":"auto",
						"valueField":'pfId',    
						"textField":'name',
						"data":solutionGrpData,
						"onLoadSuccess":function(){
						}
					});
					$("#solutionEditWin").css("height", 222);
					$("#solutionEditWin .font-info-div").css("height", 137);
				}
			}
			else if (cacheData.type=="edit") {
				functionName = "重命名解决方案";
			}
			var isShowTitle = true;
			if(cacheData.describe&&cacheData.describe.isShowTitle===false){
				isShowTitle = false;
			}
			$("#solutionEditWin").children().eq(0).children("h4").text(functionName);
			$("#renameSolutionText").val(cacheData.name);
			$("#isShowTitle").prop("checked",isShowTitle);
			$("#renameUrlText").val(cacheData.url.replace(/\'/ig,"\""));//'转换回"
			$("#renameSolutionText").select();
		},
		focus_renameSolutionText: function(){
			if(!$(".solutionEdit_warning").is(":hidden")){
				$(".solutionEdit_warning").hide();
			}
		}
	});
});