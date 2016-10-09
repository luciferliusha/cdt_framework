$(function() {
	ComponentTopView = Backbone.View.extend({
		el: $("#componentTop"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var componentTopTemplate = _.template($("#componentTop_template").html());
			$(this.el).html(componentTopTemplate);
		},
		events: {
		}
	});
	
	ComponentManagerView = Backbone.View.extend({
		el: $("#componentManager"),
		initialize: function(){
			this.rander();
			this.initComponentTree();
			$("#titleEdit").attr("disabled","disabled");
			$("#contentEdit").attr("disabled","disabled");
			$("#describeEdit").attr("disabled","disabled");
			$("#describeEdit").removeClass($("#describeEdit").attr("class"));
			$("#describeEdit").addClass("textarea_input_text_d");
		},
		rander: function(){
			var componentManagerTemplate = _.template($("#componentManager_template").html());
			$(this.el).html(componentManagerTemplate);
		},
		events: {
			"focus input":"inputFocus",
			"blur input":"inputBlur",
			"focus #describeEdit":"describeEditFocus",
			"blur #describeEdit":"describeEditBlur",
			"mouseover #submitEdit": "submitEdit0ver",
			"mouseout #submitEdit": "submitEdit0ut",
			"mousedown #submitEdit": "submitEditDown",
			"mouseup #submitEdit": "submitEdit"
		},
		initComponentTree: function() {
			var check_submit = {"component":true};//防止表单重复提交
			var rootJson = [{"id":0,"text":"","iconCls":"icon-organization-double","state":"closed","attributes":{"type":-1}}];
			$("#componentTree_ul").tree({  
			    data: rootJson,
			    animate: true,//有展开动画
				onClick:function(node){
	
				},
				onSelect: function(node){
					if(selectedAppNode){//改变上一次选中项的样式
						if(selectedAppNode.id == node.id){//点击的是选中项
							return;
						}
						
						$(selectedAppNode.target).children(".tree-title").removeClass("om-tree-app-title-s");
						if(selectedAppNode.attributes.type == -1 || selectedAppNode.attributes.type == 0){
							$(selectedAppNode.target).children(".tree-icon").removeClass("icon-organization-double-s");
							$(selectedAppNode.target).children(".tree-icon").addClass("icon-organization-double");
						}
						else if(selectedAppNode.attributes.type == 1){
							$(selectedAppNode.target).children(".tree-icon").removeClass("icon-organization-single-s");
							$(selectedAppNode.target).children(".tree-icon").addClass("icon-organization-single");
						}
					}
					
					selectedAppNode = node;
					
					$(node.target).children(".tree-title").addClass("om-tree-app-title-s");//改变选中行的字体颜色
					if(selectedAppNode.attributes.type == -1 || selectedAppNode.attributes.type == 0){
						$(node.target).children(".tree-icon").removeClass("icon-organization-double");
						$(node.target).children(".tree-icon").addClass("icon-organization-double-s");
					}
					else if(selectedAppNode.attributes.type == 1){
						$(node.target).children(".tree-icon").removeClass("icon-organization-single");
						$(node.target).children(".tree-icon").addClass("icon-organization-single-s");
					}
					
					if(node.attributes.type == -1){//最顶节点
						$("#titleEdit").attr("disabled","disabled");
						$("#contentEdit").attr("disabled","disabled");
						$("#describeEdit").attr("disabled","disabled");
						$("#titleEdit").val("");
						$("#contentEdit").val("");
						$("#describeEdit").val("");
						$("#titleEdit").removeClass($("#titleEdit").attr("class"));
						$("#titleEdit").addClass("textInput_d");
						$("#contentEdit").removeClass($("#contentEdit").attr("class"));
						$("#contentEdit").addClass("textInput_d");
						$("#describeEdit").removeClass($("#describeEdit").attr("class"));
						$("#describeEdit").addClass("textarea_input_text_d");
						$("#submitEdit").hide();
					}else if(node.attributes.type == 0){//父节点，目录
						$("#titleEdit").removeAttr("disabled");
						$("#contentEdit").attr("disabled","disabled");
						$("#contentEdit").val("");
						$("#describeEdit").attr("disabled","disabled");
						$("#describeEdit").val("");
						$("#titleEdit").val(node.text);
						$("#titleEdit").removeClass($("#titleEdit").attr("class"));
						$("#titleEdit").addClass("textInput_n");
						$("#contentEdit").removeClass($("#contentEdit").attr("class"));
						$("#contentEdit").addClass("textInput_d");
						$("#describeEdit").removeClass($("#describeEdit").attr("class"));
						$("#describeEdit").addClass("textarea_input_text_d");
						$("#submitEdit").show();
						$("#titleEdit").focus();						
					}else{//构件节点
						$("#titleEdit").removeAttr("disabled");
						$("#contentEdit").removeAttr("disabled");
						$("#describeEdit").removeAttr("disabled");
						$("#titleEdit").val(node.text);
						if(node.attributes.type == 1 && node.attributes.fileName != null){
							var url = node.attributes.fileName;
							$("#contentEdit").val(url);
						}
						if(node.attributes.type == 1 && node.attributes.describe != null){
							$("#describeEdit").val(node.attributes.describe);
						}
						$("#titleEdit").removeClass($("#titleEdit").attr("class"));
						$("#titleEdit").addClass("textInput_n");
						$("#contentEdit").removeClass($("#contentEdit").attr("class"));
						$("#contentEdit").addClass("textInput_n");
						$("#describeEdit").removeClass($("#describeEdit").attr("class"));
						$("#describeEdit").addClass("textarea_input_text_n");
						$("#submitEdit").show();
						$("#titleEdit").focus();
					}
					$(".text_err").hide();
				},
				onBeforeExpand: function(node){//在节点打开之前触发,从接口获取json数据
					var id = node.id;
					var url = contextPath + "/getAppTree.do?appId="+id;
					$(this).tree("options").url = url;						
				},
				onBeforeLoad : function(node, param){
					
				},
				onLoadSuccess : function(node, data){//数据加载成功后，在界面上增加显示布局
					if (data.data) {
						if(data.returnFlag == -1){//没有查询到数据时，
							
						}
						else{
							$(this).tree("append",{parent:node.target,data:data.data});
							addTreeTitle(data.data);
						}														
					}
				},
				onContextMenu: function(e,node){//鼠标右键弹出操作下拉框
					e.preventDefault();
					
					$(this).tree('select',node.target);
					$(this).tree('expand',node.target);
					
					$('#component_menu').menu('show',{
						left: e.pageX,
						top: e.pageY
					});

					initMenu(node,"component_menu");
				}
			}); 
			
			var rootNode = $("#componentTree_ul").tree("getRoot");
			$("#componentTree_ul").tree("expand",rootNode.target);
		},
		inputFocus:function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("textInput_p");
			if($(target).siblings(".text_err").is(":visible")){
				$(target).siblings(".text_err").hide();
			}
		},
		inputBlur:function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("textInput_n");
			var error = null;
			if($.trim($(target).val()) == ""){
				if(target.id == "titleEdit"){
					error = "标题名称不能为空！";
				}
				else if(target.id == "contentEdit"){
					error = "内容不能为空！";
				}
			}
			else{
				if(target.id == "contentEdit"){
					var url = $.trim($(target).val());
					url = url.replace(/\\/g,"/");
					if(!validateRules.isUrl($.trim(url))){
						error="内容的URL格式输入不正确！";
					}
				}
			}
			if(error != null){
				$(target).siblings(".text_err").text(error);
				$(target).siblings(".text_err").css("display","block");
			}
		},
		describeEditFocus:function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("textarea_input_text_f");
			if($(target).siblings(".text_err").is(":visible")){
				$(target).siblings(".text_err").hide();
			}
		},
		describeEditBlur:function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("textarea_input_text_n");
			var error = null;
			if($.trim($(target).val()).length > 200){
				error = "简介内容过长，不能超过200个字！";
			}
			if(error != null){
				$(target).siblings(".text_err").text(error);
				$(target).siblings(".text_err").css("display","block");
			}
		},
		submitEdit0ver:function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_f");
		},
		submitEdit0ut:function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_n");
		},
		submitEditDown:function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_p");
		},
		submitEdit: function(event){
			var e = event || window.event;
			var target = e.srcElement || e.target;
			$(target).removeClass($(target).attr("class"));
			$(target).addClass("confirmBtn_f");
			
			var node = $('#componentTree_ul').tree('getSelected');
			var parentNode = $('#componentTree_ul').tree('getParent', node.target);
			var id = node.id;
			var parentId = parentNode.id;
			var appName = $.trim($("#titleEdit").val());
			var hasError = false;
			
			if(appName == ""){
				$("#titleEdit").siblings(".text_err").text("标题名称不能为空！");
				$("#titleEdit").siblings(".text_err").css("display","block");
				hasError = true;
			}
			
			if(node.attributes.type != -1){
				var url = $("#contentEdit").val();
				//url = url.toLocaleLowerCase();
				url = url.replace(/\\/g,"/");//URL
				
				if ($("#contentEdit").attr("disabled") != "disabled" && $.trim(url) == "") {
					$("#contentEdit").siblings(".text_err").text("内容不能为空！");
					$("#contentEdit").siblings(".text_err").css("display","block");
					hasError = true;
				}
				
				if($.trim(url) != "" && !validateRules.isUrl($.trim(url))){
					$("#contentEdit").siblings(".text_err").text("内容的URL格式输入不正确！");
					$("#contentEdit").siblings(".text_err").css("display","block");
					hasError = true;
				}
				
				url = url.replace(/\"/ig,"\\\"");				
				var describe = $.trim($("#describeEdit").val());
				if ($.trim(describe) != "" && describe.length > 200) {//不能超过200个字
					$("#describeEdit").siblings(".text_err").text("简介内容过长，不能超过200个字！");
					$("#describeEdit").siblings(".text_err").css("display","block");
					hasError = true;
				}
				if(hasError && check_submit.component){
					return;
				}
				check_submit = {"component":false};
				$.ajax({
					url: contextPath + '/updateAppFile.do?file={"appId":'+id+',"appName":"'+encodeURIComponent(appName)+'","fileName":"'+encodeURIComponent($.trim(url))+'","parentId":'+parentId+',"describe":"' + encodeURIComponent(describe)+'"}',
					type: "post", 
					error: function(){
						check_submit = {"component":true};
					},
					success: function(data, textStatus){
						$('#componentTree_ul').tree('update',{target:node.target, text: appName, 
							attributes: {type: node.attributes.type, fileName: $("#contentEdit").val(), 
								orderBy: node.attributes.orderBy,describe: describe}});
						//编辑完节点后更新title
						var nodeData = new Array();
						nodeData.push($('#componentTree_ul').tree("getData",node.target))
						addTreeTitle(nodeData);
						//alert("提交成功！");
						$.messager.alert("操作提示", "提交成功!","info");
						check_submit = {"component":true};
			      }});
			}
		}
	});
});