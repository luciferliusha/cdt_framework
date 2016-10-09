/**
 * 弹出框View
 */
function WindowView(){
	var _windowView = this;//弹出框View this对象
	var USER_TYPE = 1;//用户类型1
	var ORGANIZATION_TYPE = 0;//组织类型0	
	/**重命名窗口参数**/
	var renameOperateType;//重命名弹出框操作类型 new或者rename
	var renameTreeId;//重命名操作对应树id
	/**删除窗口参数**/
	var deleteOperateType;//删除弹出框操作类型 delete或者relieve
	var deleteTreeId;//删除操作对应树id
	/**新增资源窗口参数**/
	var newResourceOperateType;//新增资源弹出框操作类型 new或者rename
	/**新增详细组织信息窗口参数**/
	var newOrganizationOperateType;//新增详细组织信息窗口操作类型 new或者update
	/**新增详细用户信息窗口参数**/
	var newUserOperateType;//新增详细组织信息窗口操作类型 new或者update
	/**组织添加用户窗口参数**/
	var changeUserArray;//组织下的用户改变数组
	var allUserData = null;//所有用户信息数组
	/**用户移至组织窗口参数**/
	var relieveOrganizationArray;//用户移至的组织改变数组
	/**
	 * 初始化重命名弹出框
	 * 
	 *@param treeId 操作树的id
	 *@param operateType 操作类型 new或者rename
	 */
	this.initRenameWin = function(treeId,operateType){
		renameOperateType = operateType;
		renameTreeId = treeId;
		var zTree = $.fn.zTree.getZTreeObj(treeId);
		var selectNode = zTree.getSelectedNodes()[0];
		
		$(".blackboard-css").show();
		var json = null;
			if(renameTreeId == "organizationZTree"){
				if(renameOperateType == "rename"){
					if(selectNode.type == USER_TYPE){
						json = {"win_title":"重命名用户","renameInput_title":"用户名称：","name":selectNode.name,"defaultValue":selectNode.name};
					}
					else if(selectNode.type == ORGANIZATION_TYPE){
						json = {"win_title":"重命名组织","renameInput_title":"组织名称：","name":selectNode.name,"defaultValue":selectNode.name};
					}
				}				
			}
			else if(renameTreeId == "roleZTree"){
				if(renameOperateType == "new"){
					json = {"win_title":"新增角色","renameInput_title":"角色名称：","name":"角色名称","defaultValue":"角色名称"};									
				}
				else if(renameOperateType == "rename"){
					json = {"win_title":"重命名角色","renameInput_title":"角色名称：","name":selectNode.name,"defaultValue":selectNode.name};
				}
			}

		$("body").append($.render($("#renameWin_template").html(),json));		
		$("#renameWin").fadeIn();
		$("#renameWin").draggable({
			handle: $('#renameWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		if(!($._data($("#renameWin .textInput").get(0), "events") != undefined
				&& $._data($("#renameWin .textInput").get(0), "events")["focus"] != undefined)){//输入框事件
			$("#renameWin .textInput").bind("focus",function(){
				if(renameOperateType == "new"){
					if(isHintInputEmpty($(this))){
						$(this).val("");
						$(this).removeClass("input_hint");
						$(this).addClass("input_normal");
					}										
				}
				
				$(this).removeClass("textInput-n");
				$(this).addClass("textInput-f");
				$("#renameSaveBtn").removeAttr("disabled");
				$("#renameInput_error_tip").hide();
			});
			
			$("#renameWin .textInput").bind("blur",function(){
				if(renameOperateType == "new"){
					var defaultValue = $(this).attr("defaultValue");
					if($.trim($(this).val()) == ""){
						$(this).val(defaultValue);
						$(this).removeClass("input_normal");
						$(this).addClass("input_hint");
					}
				}
				else if(renameOperateType = "rename"){
					renameInputSubmitState();
				}
			});
		}
				
		if(renameOperateType == "new"){
			$("#renameWin .textInput").addClass("input_hint");
			$("#renameInput").focus();
		}
		else if(renameOperateType == "rename"){
			$("#renameWin .textInput").addClass("input_normal");
			$("#renameInput").select();
		}
				
		if(!($._data($("#renameSaveBtn").get(0), "events") != undefined
				&& $._data($("#renameSaveBtn").get(0), "events")["click"] != undefined)){//确认按钮点击事件
			$("#renameSaveBtn").bind("click",function(){
				if($(this).attr("disabled")){//设置确认按钮disabled属性，防止重复点击
					return;
				}
				else{
					$(this).attr("disabled",true);
				}
				
				var zTree = $.fn.zTree.getZTreeObj(renameTreeId);
				var selectNode = zTree.getSelectedNodes()[0];//选中树节点
				var name = $.trim($("#renameInput").val());
				if(renameOperateType == "new"){//只有角色树新增需要使用这个窗口
					if(isHintInputEmpty($("#renameInput"))){						
						$("#renameInput_error_tip").text("新增角色名称不能为空");
						$("#renameInput_error_tip").show();
						return;
					}					
					roleView.addZTreeNode(selectNode,name);
					
				}
				else if(renameOperateType == "rename"){
					if(renameInputSubmitState()){
						return;
					}
					if(name == $.trim($("#renameInput").attr("defaultvalue"))){//名称没有改变
						$(".blackboard-css").hide();
						$("#renameWin").fadeOut(function(){
							$("#renameWin").remove();
						});
					}
					else{
						if(renameTreeId == "organizationZTree"){
							organizationView.renameZTreeNode(selectNode,name);
						}
						else if(renameTreeId = "roleZTree"){
							roleView.updateZTreeNode(selectNode,name);
						}
					}
				}
			});
		}
		
		/**
		 * 判断重命名输入框在重命名时失去焦点或者提交的时候是否为空
		 * @returns 为空时  返回true 不为空返回false
		 */
		function renameInputSubmitState(){
			if($.trim($("#renameInput").val()) == ""){					
				var error = "";
				if(renameTreeId == "organizationZTree"){
					if(selectNode.type == USER_TYPE){
						error = "重命名用户名称不能为空";
					}
					else if(selectNode.type == ORGANIZATION_TYPE){
						error = "重命名组织名称不能为空";
					}
				}
				else if(renameTreeId = "roleZTree"){
					error = "重命名角色名称不能为空";
				}
				$("#renameInput_error_tip").text(error);
				$("#renameInput_error_tip").show();
				return true;
			}
			return false;
		}
				
		if(!($._data($("#renameCancelBtn").get(0), "events") != undefined
				&& $._data($("#renameCancelBtn").get(0), "events")["click"] != undefined)){//取消按钮点击事件
			$("#renameCancelBtn").bind("click",function(){
				$(".blackboard-css").hide();
				$("#renameWin").fadeOut(function(){
					$("#renameWin").remove();
				});
			});
		}
		
		if(!($._data($("#renameWin .win_close").get(0), "events") != undefined
				&& $._data($("#renameWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#renameWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#renameWin").fadeOut(function(){
					$("#renameWin").remove();
				});
			});
		}				
	};
	
	/**
	 * 初始化新增资源弹出框
	 * 
	 * @param operateType 操作类型 new或者rename
	 */
	this.initNewResourceWin = function(operateType){
		newResourceOperateType = operateType;
		var json = null;
		var resourceZTree = $.fn.zTree.getZTreeObj("resourceZTree");
		var selectNode = resourceZTree.getSelectedNodes()[0];//选中树节点
		if(newResourceOperateType == "new"){
			json = {win_title:"新增资源",name:"资源名称",nameDefaultValue:"资源名称",no:"资源编号",noDefaultValue:"资源编号"};
		}
		else if(newResourceOperateType == "rename"){
			var name = selectNode.name.substring(0,selectNode.name.lastIndexOf("(" + selectNode.no + ")"));
			json = {win_title:"编辑资源",name:name,nameDefaultValue:name,no:selectNode.no,noDefaultValue:selectNode.no};
		}
		$("body").append($.render($("#newResourceWin_template").html(),json));
		$(".blackboard-css").show();
		$("#newResourceWin").fadeIn();
		$("#newResourceWin").draggable({
			handle: $('#newResourceWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		
		if(!($._data($("#newResourceWin .textInput").get(0), "events") != undefined
				&& $._data($("#newResourceWin .textInput").get(0), "events")["focus"] != undefined)){//输入框事件
			$("#newResourceWin .textInput").bind("focus",function(){
				if(newResourceOperateType == "new"){
					if(isHintInputEmpty($(this))){
						$(this).val("");
						$(this).removeClass("input_hint");
						$(this).addClass("input_normal");
					}
				}
				$(this).removeClass("textInput-n");
				$(this).addClass("textInput-f");
				
				$("#newResourceSaveBtn").removeAttr("disabled");
				$("#" + this.id + "_error_tip").hide();
				
			});
			$("#newResourceWin .textInput").bind("blur",function(){
				var defaultValue = $(this).attr("defaultValue");
				var value = $.trim($(this).val());
				if(newResourceOperateType == "new"){
					if(value == ""){
						$(this).val(defaultValue);
						$(this).removeClass("input_normal");
						$(this).addClass("input_hint");
					}
					else{
						if(this.id == "resourceNoInput"){//判断资源编号是否已存在
							resourceView.omCheckNoIsExit(function(flag){
								if(!flag){
									$("#resourceNoInput_error_tip").text("该资源编号已存在！");
									$("#resourceNoInput_error_tip").show();
								}
							},value);
						}							
					}					
				}
				else if(newResourceOperateType == "rename"){
					if(value == ""){
						newResourceInputSubmitEmpty(this);
					}
					else{
						if(this.id == "resourceNoInput" && value != $(this).attr("defaultValue")){//判断资源编号是否已存在
							resourceView.omCheckNoIsExit(function(flag){
								if(!flag){
									$("#resourceNoInput_error_tip").text("该资源编号已存在！");
									$("#resourceNoInput_error_tip").show();
								}
							},value);
						}	
					}
				}
			});
		}
		
		if(newResourceOperateType == "new"){
			$("#newResourceWin .textInput").addClass("input_hint");
			$("#resourceNameInput").focus();
		}
		else if(newResourceOperateType == "rename"){
			$("#renameWin .textInput").addClass("input_normal");
			$("#resourceNameInput").select();
		}
		
		if(!($._data($("#newResourceSaveBtn").get(0), "events") != undefined
				&& $._data($("#newResourceSaveBtn").get(0), "events")["click"] != undefined)){//确认按钮点击事件
			$("#newResourceSaveBtn").bind("click",function(){
				if($(this).attr("disabled")){//设置确认按钮disabled属性，防止重复点击
					return;
				}
				else{
					$(this).attr("disabled",true);
				}
				var hasErr = false;//判断是否有错误
				var name = $.trim($("#resourceNameInput").val());
				var oldName = $("#resourceNameInput").attr("defaultValue");
				var no = $.trim($("#resourceNoInput").val());
				var oldNo = $("#resourceNoInput").attr("defaultValue");
				var resourceZTree = $.fn.zTree.getZTreeObj("resourceZTree");
				var selectNode = resourceZTree.getSelectedNodes()[0];//选中树节点
				var data = {};//向后台提交的数据
				if(newResourceOperateType == "new"){
					$("#newResourceWin .textInput").each(function(){
						if(isHintInputEmpty($(this))){
							var error = "";
							if(this.id == "resourceNameInput"){
								error = "资源名称不能为空！";
							}
							else if(this.id == "resourceNoInput"){
								error = "资源编号不能为空！";
							}
							$("#" + this.id + "_error_tip").text(error);
							$("#" + this.id + "_error_tip").show();
							hasErr = true;
						}												
					});
					if(!hasErr){
						resourceView.omCheckNoIsExit(function(flag){
							if(!flag){
								$("#resourceNoInput_error_tip").text("该资源编号已存在！");
								$("#resourceNoInput_error_tip").show();
							}
							else{
								data["name"] = name;
								data["no"] = no;
								data["status"] = 1;
								data["parentId"] = selectNode.id;
								resourceView.addZTreeNode(data);
							}
						},no);
					}
				}
				else if(newResourceOperateType == "rename"){
					$("#newResourceWin .textInput").each(function(){
						if($.trim($(this).val()) == ""){
							newResourceInputSubmitEmpty(this);
							hasErr = true;
						}
					});
					if(!hasErr){
						if(name == oldName && no == oldNo){//资源信息没有改变
							$(".blackboard-css").hide();
							$("#newResourceWin").fadeOut(function(){
								$("#newResourceWin").remove();
							});
						}
						else{
							if(no == oldNo){//资源编号没有改变
								data["id"] = selectNode.id;
								data["name"] = name;
								data["no"] = no;
								resourceView.updateZTreeNode(data);
							}
							else{//资源编号已改变
								resourceView.omCheckNoIsExit(function(flag){
									if(!flag){
										$("#resourceNoInput_error_tip").text("该资源编号已存在！");
										$("#resourceNoInput_error_tip").show();
									}
									else{
										data["id"] = selectNode.id;
										data["name"] = name;
										data["no"] = no;
										resourceView.updateZTreeNode(data);
									}
								},no);
							}
						}
					}
				}
			});
		}
		
		/**
		 * 显示新增资源输入框在重命名时失去焦点或者提交的时候为空的提示框
		 * @param _this input的this对象
		 * @returns 为空时  返回true 不为空返回false
		 */
		function newResourceInputSubmitEmpty(_this){
				var error = "";
				if(_this.id == "resourceNameInput"){
					error ="资源名称不能为空！";
				}
				else if(_this.id == "resourceNoInput"){
					error = "资源编号不能为空！";
				}
				$("#" + _this.id + "_error_tip").text(error);
				$("#" + _this.id + "_error_tip").show();
		}
		
		if(!($._data($("#newResourceCancelBtn").get(0), "events") != undefined
				&& $._data($("#newResourceCancelBtn").get(0), "events")["click"] != undefined)){//取消按钮点击事件
			$("#newResourceCancelBtn").bind("click",function(){
				$(".blackboard-css").hide();
				$("#newResourceWin").fadeOut(function(){
					$("#newResourceWin").remove();
				});
			});
		}
		
		if(!($._data($("#newResourceWin .win_close").get(0), "events") != undefined
				&& $._data($("#newResourceWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#newResourceWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#newResourceWin").fadeOut(function(){
					$("#newResourceWin").remove();
				});
			});
		}
	};
	
	/**
	 * 初始化删除弹出框
	 * 
	 *@param treeId 操作树的id
	 *@param operateType 操作类型 delete或者relieve
	 */
	this.initDeleteWin = function(treeId, operateType){
		deleteOperateType = operateType;
		deleteTreeId = treeId;
		var zTree = $.fn.zTree.getZTreeObj(treeId);
		var selectNode = zTree.getSelectedNodes()[0];
		var parentNode = selectNode.getParentNode();
		var deleteContent = "";
		var json = null;
		switch (deleteTreeId) {
			case "organizationZTree"://组织用户树
				if(deleteOperateType == "delete"){
					if(selectNode.type == ORGANIZATION_TYPE){
						deleteContent = "确认删除名为【" + selectNode.name + "】的组织？";
						json = {win_title:"删除",win_delte_content:deleteContent};
					}
					else if(selectNode.type == USER_TYPE){
						deleteContent = "确认删除名为【" + selectNode.name + "】的用户？";
						json = {win_title:"删除",win_delte_content:deleteContent};
					}
				}
				else if(deleteOperateType == "relieve"){//解除关系				
					deleteContent = "确认删除名为【" + selectNode.name + "】的用户与上级组织【" + parentNode.name +"】间的关系?";
					json = {win_title:"解除关系",win_delte_content:deleteContent};
				}
				break;
			case "roleZTree"://角色树
				deleteContent = "确认删除名为【" + selectNode.name + "】的角色？";
				json = {win_title:"删除",win_delte_content:deleteContent};
				break;
			case "resourceZTree"://资源树
				//获取资源名称（去掉资源ID）
				var name = selectNode.name.substring(0,selectNode.name.lastIndexOf("(" + selectNode.no + ")"));
				deleteContent = "确认删除名为【" + name + "】的资源？";
				json = {win_title:"删除",win_delte_content:deleteContent};
				break;
		}
		$("body").append($.render($("#deleteWin_template").html(),json));
		$(".blackboard-css").show();
		$("#deleteWin").fadeIn();
		$("#deleteWin").draggable({
			handle: $('#deleteWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		
		if(!($._data($("#deleteSaveBtn").get(0), "events") != undefined
				&& $._data($("#deleteSaveBtn").get(0), "events")["click"] != undefined)){//确认按钮点击事件
			$("#deleteSaveBtn").bind("click",function(){
				if($(this).attr("disabled")){//设置确认按钮disabled属性，防止重复点击
					return;
				}
				else{
					$(this).attr("disabled",true);
				}
				
				var zTree = $.fn.zTree.getZTreeObj(deleteTreeId);
				var selectNode = zTree.getSelectedNodes()[0];
				var parentNode = selectNode.getParentNode();
				switch (deleteTreeId) {
					case "organizationZTree"://组织用户树
						if(deleteOperateType == "delete"){
							organizationView.deleteZTreeNode(selectNode);
						}
						else if(deleteOperateType == "relieve"){
							organizationView.relieveRelatZTreeNode(selectNode,parentNode);
						}
						break;
					case "roleZTree"://角色树
						roleView.deleteZTreeNode(selectNode);
						break;
					case "resourceZTree"://资源树
						resourceView.deleteZTreeNode(selectNode);
						break;
				}
			});
		}
		
		if(!($._data($("#deleteCancelBtn").get(0), "events") != undefined
				&& $._data($("#deleteCancelBtn").get(0), "events")["click"] != undefined)){//取消按钮点击事件
			$("#deleteCancelBtn").bind("click",function(){
				$(".blackboard-css").hide();
				$("#deleteWin").fadeOut(function(){
					$("#deleteWin").remove();
				});
			});
		}
		
		if(!($._data($("#deleteWin .win_close").get(0), "events") != undefined
				&& $._data($("#deleteWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#deleteWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#deleteWin").fadeOut(function(){
					$("#deleteWin").remove();
				});
			});
		}
	};

	/**
	 * 初始化选择新增组织或者用户窗口
	 */
	this.initNewChooseWin = function(){
		$(".blackboard-css").show();
		$("body").append($("#newChooseWin_template").html());
		$("#newChooseWin").fadeIn();
		$("#newChooseWin").draggable({
			handle: $('#newChooseWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		
		if(!($._data($("#newChooseWin .hugeButton_01").get(0), "events") != undefined
				&& $._data($("#newChooseWin .hugeButton_01").get(0), "events")["click"] != undefined)){//选择组织或者用户点击事件
			$("#newChooseWin .hugeButton_01").bind("click",function(){
				var id = this.id;
				if(id == "chooseNewOrganization"){//新增组织
					$("#newChooseWin").fadeOut(function(){
						$("#newChooseWin").remove();
					});
					initNewSimpleOrganizationWin();
				}
				else if(id == "chooseNewUser"){//新增用户
					$("#newChooseWin").fadeOut(function(){
						$("#newChooseWin").remove();
					});
					initNewSimpleUserWin();
				}
			});
		}
		
		if(!($._data($("#newChooseWin .win_close").get(0), "events") != undefined
				&& $._data($("#newChooseWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#newChooseWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#newChooseWin").fadeOut(function(){
					$("#newChooseWin").remove();
				});
			});
		}
	};
	/**
	 * 初始化新增简单组织信息窗口
	 * @returns
	 */
	var initNewSimpleOrganizationWin = function(){
		$("body").append($("#newSimpleOrganizationWin_template").html());
		$("#newSimpleOrganizationWin").fadeIn();
		$("#newSimpleOrganizationWin").draggable({
			handle: $('#newSimpleOrganizationWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		if(!($._data($("#newSimpleOrganizationWin .textInput").get(0), "events") != undefined
				&& $._data($("#newSimpleOrganizationWin .textInput").get(0), "events")["focus"] != undefined)){//输入框事件
			$("#newSimpleOrganizationWin .textInput").bind("focus",function(){
				if(isHintInputEmpty($(this))){
					$(this).val("");
					$(this).removeClass("input_hint");
					$(this).addClass("input_normal");
				}
			
				$(this).removeClass("textInput-n");
				$(this).addClass("textInput-f");
				$("#newSimpleOrganizationSaveBtn").removeAttr("disabled");
				$("#newSimpleOrganizationName_error_tip").hide();
			});
			$("#newSimpleOrganizationWin .textInput").bind("blur",function(){
				var defaultValue = $(this).attr("defaultValue");
				if($.trim($(this).val()) == ""){
					$(this).val(defaultValue);
					$(this).removeClass("input_normal");
					$(this).addClass("input_hint");
				}
			});
		}
		
		$("#newSimpleOrganizationName").focus();
		
		if(!($._data($("#newSimpleOrganizationSaveBtn").get(0), "events") != undefined
				&& $._data($("#newSimpleOrganizationSaveBtn").get(0), "events")["click"] != undefined)){//确认按钮点击事件
			$("#newSimpleOrganizationSaveBtn").bind("click",function(){
				if($(this).attr("disabled")){//设置确认按钮disabled属性，防止重复点击
					return;
				}
				else{
					$(this).attr("disabled",true);
				}
				
				if(isHintInputEmpty($("#newSimpleOrganizationName"))){
					$("#newSimpleOrganizationName_error_tip").text("组织名称不能为空！");
					$("#newSimpleOrganizationName_error_tip").show();
					return;
				}
				var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
				var selectNode = organizationZTree.getSelectedNodes()[0];
				var name = $.trim($("#newSimpleOrganizationName").val());
				var data = {};
				data["parentId"] = selectNode.id;
				data["type"] = ORGANIZATION_TYPE;
				data["status"] = 1;
				data["name"] = name;
				organizationView.addZTreeNode(data,"newSimpleOrganizationWin");
			});
		}
		
		if(!($._data($("#newSimpleOrganizationAddMoreBtn").get(0), "events") != undefined
				&& $._data($("#newSimpleOrganizationAddMoreBtn").get(0), "events")["click"] != undefined)){//添加更多详细信息按钮点击事件
			$("#newSimpleOrganizationAddMoreBtn").bind("click",function(){				
				var name;
				var data;
				if(isHintInputEmpty($("#newSimpleOrganizationName"))){
					name = null;
				}
				else{
					name = $.trim($("#newSimpleOrganizationName").val());
				}
				data = {name:name};
				$("#newSimpleOrganizationWin").fadeOut(function(){
					$("#newSimpleOrganizationWin").remove();
				});
				initNewDetailOrganizationWin(data,"new");
			});
		}
		
		if(!($._data($("#newSimpleOrganizationCancelBtn").get(0), "events") != undefined
				&& $._data($("#newSimpleOrganizationCancelBtn").get(0), "events")["click"] != undefined)){//取消按钮点击事件
			$("#newSimpleOrganizationCancelBtn").bind("click",function(){
				$(".blackboard-css").hide();
				$("#newSimpleOrganizationWin").fadeOut(function(){
					$("#newSimpleOrganizationWin").remove();
				});
			});
		}
		
		if(!($._data($("#newSimpleOrganizationWin .win_close").get(0), "events") != undefined
				&& $._data($("#newSimpleOrganizationWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#newSimpleOrganizationWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#newSimpleOrganizationWin").fadeOut(function(){
					$("#newSimpleOrganizationWin").remove();
				});
			});
		}
	};
	
	/**
	 * 初始化新增详细组织信息窗口
	 * @param data 新增简单组织信息传递过来的参数或者修改组织信息传递过来的参数
	 * @param operateType 操作类型 new或者update
	 * @returns
	 */
	var initNewDetailOrganizationWin = function(data,operateType){
		newOrganizationOperateType = operateType;
		var json = null;
		if(newOrganizationOperateType == "new"){//新增
			var name;
			var nameClass;
			if(data && data.name){
				name = data.name;
				nameClass = "input_normal";
			}
			else{
				name = "组织名称";
				nameClass = "input_hint";
			}
			json = {win_title:"新增组织",name:name,nameClass:nameClass,nameDefaultValue:"组织名称",email:"电子邮箱",
					emailDefaultValue:"电子邮箱",phone:"电话",phoneDefaultValue:"电话",mobilePhone:"手机",mobilePhoneDefaultValue:"手机",
					address:"地址",addressDefaultValue:"地址"};
		}
		else if(newOrganizationOperateType == "update"){
			var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
			var selectNode = organizationZTree.getSelectedNodes()[0];
			json = {win_title:"详细信息",name:selectNode.name,nameDefaultValue:selectNode.name,email:selectNode.email,
					emailDefaultValue:selectNode.email,phone:selectNode.phone,phoneDefaultValue:selectNode.phone,
					phoneDefaultValue:selectNode.phone,mobilePhone:selectNode.mobilePhone,mobilePhoneDefaultValue:
					selectNode.mobilePhoneDefaultValue,address:selectNode.address,addressDefaultValue:selectNode.address};
		}
						
		$(".blackboard-css").show();
		$("body").append($.render($("#newDetailOrganizationWin_template").html(),json));
		$("#newDetailOrganizationWin").fadeIn();
		$("#newDetailOrganizationWin").draggable({
			handle: $('#newDetailOrganizationWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		
		if(!($._data($("#newDetailOrganizationWin .textInput").get(0), "events") != undefined
				&& $._data($("#newDetailOrganizationWin .textInput").get(0), "events")["focus"] != undefined)){//输入框事件
			$("#newDetailOrganizationWin .textInput").bind("focus",function(){
				if(newOrganizationOperateType == "new"){
					if(isHintInputEmpty($(this))){
						$(this).val("");
						$(this).removeClass("input_hint");
						$(this).addClass("input_normal");
					}
				}
				
				$(this).removeClass("textInput-n");
				$(this).addClass("textInput-f");
				$("#newDetailOrganizationSaveBtn").removeAttr("disabled");
				$("#" + this.id + "_error_tip").hide();
			});
			
			$("#newDetailOrganizationWin .textInput").bind("blur",function(){
				$(this).removeClass("textInput-f");
				$(this).addClass("textInput-n");
				
				if(newOrganizationOperateType == "new"){
					var defaultValue = $(this).attr("defaultValue");
					if($.trim($(this).val()) == ""){
						$(this).val(defaultValue);
						$(this).removeClass("input_normal");
						$(this).addClass("input_hint");
					}
					else{
						validateInputErr(this.id,"new");	
					}
				}
				else if(newOrganizationOperateType == "update"){
					validateInputErr(this.id,"update");
				}
			});
		}
		
		if(newOrganizationOperateType == "new" && !(data && data.name)){
			$("#newDetailOrganizationName").focus();
		}
		else{
			var tempName = $("#newDetailOrganizationName").val();
			$("#newDetailOrganizationName").val("").focus().val(tempName);
		}
		
		if(newOrganizationOperateType == "update"){
			$("#newDetailOrganizationWin .textInput").removeClass("input_hint");
			$("#newDetailOrganizationWin .textInput").addClass("input_normal");
		}
		
		if(!($._data($("#newDetailOrganizationSaveBtn").get(0), "events") != undefined
				&& $._data($("#newDetailOrganizationSaveBtn").get(0), "events")["click"] != undefined)){//确认按钮点击事件
			$("#newDetailOrganizationSaveBtn").bind("click",function(){
				if($(this).attr("disabled")){//设置确认按钮disabled属性，防止重复点击
					return;
				}
				else{
					$(this).attr("disabled",true);
				}
				var hasErr = false;
				var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
				var selectNode = organizationZTree.getSelectedNodes()[0];//选中树节点
				
				if(newOrganizationOperateType == "new"){
					if(isHintInputEmpty($("#newDetailOrganizationName"))){
						hasErr =true;
						$("#newDetailOrganizationName_error_tip").text("组织名称不能为空");
						$("#newDetailOrganizationName_error_tip").show();
					}
					
					$("#newDetailOrganizationWin .textInput").each(function(){
						if(validateInputErr(this.id,"new")){
							hasErr = true;
						}
					});
					if(!hasErr){
						var name = $.trim($("#newDetailOrganizationName").val());
						var email =  isHintInputEmpty($("#newDetailOrganizationEmail"))?"":$.trim($("#newDetailOrganizationEmail").val());
						var phone = isHintInputEmpty($("#newDetailOrganizationPhone"))?"":$.trim($("#newDetailOrganizationPhone").val());
						var mobilePhone = isHintInputEmpty($("#newDetailOrganizationMobilePhone"))?"":$.trim($("#newDetailOrganizationMobilePhone").val());
						var address = isHintInputEmpty($("#newDetailOrganizationAddress"))?"":$.trim($("#newDetailOrganizationAddress").val());
						
						var data = {};
						data["parentId"] = selectNode.id;
						data["type"] = ORGANIZATION_TYPE;
						data["status"] = 1;
						data["name"] = name;
						data["email"] = email;
						data["phone"] = phone;
						data["mobilePhone"] = mobilePhone;
						data["address"] = address;
						organizationView.addZTreeNode(data,"newDetailOrganizationWin");
					}
					
				}
				else if(newOrganizationOperateType == "update"){
					$("#newDetailOrganizationWin .textInput").each(function(){
						if(validateInputErr(this.id,"update")){
							hasErr = true;
						}
					});
					if(!hasErr){
						var name = $.trim($("#newDetailOrganizationName").val());
						var email =  $.trim($("#newDetailOrganizationEmail").val());
						var phone = $.trim($("#newDetailOrganizationPhone").val());
						var mobilePhone =  $.trim($("#newDetailOrganizationMobilePhone").val());
						var address = $.trim($("#newDetailOrganizationAddress").val());
						
						var defaultName = $("#newDetailOrganizationName").attr("defaultvalue");
						var defaultEmail = $("#newDetailOrganizationEmail").attr("defaultvalue");
						var defaultPhone = $("#newDetailOrganizationPhone").attr("defaultvalue");
						var defaultMobilePhone = $("#newDetailOrganizationMobilePhone").attr("defaultvalue");
						var defaultAddress = $("#newDetailOrganizationAddress").attr("defaultvalue");
						
						if(name == defaultName && email == defaultEmail && phone==defaultPhone && mobilePhone == defaultMobilePhone
								&& address == defaultAddress){//组织信息未改变
							$(".blackboard-css").hide();
							$("#newDetailOrganizationWin").fadeOut(function(){
								$("#newDetailOrganizationWin").remove();
							});
							return;
						}
						var data = {id:selectNode.id,name:name,type:selectNode.type,email:email,phone:phone,mobilePhone:mobilePhone,
								address:address};
						organizationView.updateZTreeNode(selectNode,data,"newDetailOrganizationWin");						
					}
				}
			});
		}
		
		if(!($._data($("#newDetailOrganizationCancelBtn").get(0), "events") != undefined
				&& $._data($("#newDetailOrganizationCancelBtn").get(0), "events")["click"] != undefined)){//取消按钮点击事件
			$("#newDetailOrganizationCancelBtn").bind("click",function(){
				$(".blackboard-css").hide();
				$("#newDetailOrganizationWin").fadeOut(function(){
					$("#newDetailOrganizationWin").remove();
				});
			});
		}
		
		if(!($._data($("#newDetailOrganizationWin .win_close").get(0), "events") != undefined
				&& $._data($("#newDetailOrganizationWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#newDetailOrganizationWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#newDetailOrganizationWin").fadeOut(function(){
					$("#newDetailOrganizationWin").remove();
				});
			});
		}
		
		/**
		 * 验证输入框的错误
		 * @param id 控件id
		 * @param type "new"或者"update"
		 * @returns true表示输入框有错误 false表示输入框没有错误
		 */
		function validateInputErr(id,type){
			var returnFlag = false;
			var validateType = $("#" + id).attr("validateType");//判断验证类型：包括非空、邮箱、电话、手机号码等
			var validateTypeArr = null;//验证类型数组
			if(validateType){
				validateTypeArr = validateType.split(",");
			}
			if(validateTypeArr){
				var _tip = "";
				var value = $.trim($("#" + id).val());
				var isEmpty = false;//判断input是否为空
				if(type == "new"){
					isEmpty = isHintInputEmpty($("#" + id));
				}
				else if(type == "update"){
					isEmpty = value == ""?true:false;
				}
				
				for ( var i = 0; i < validateTypeArr.length; i++) {
					if(isEmpty){
						if(type == "update" && validateTypeArr[i] == "required"){
							if(id == "newDetailOrganizationName"){
								_tip = "组织名称不能为空！";
							}
						}
					}
					else{
						if(validateTypeArr[i] == "email"){
							if(!validateRules.isEmail(value)){
								_tip = "请输入正确的电子邮箱地址！";
							}
						}
						else if(validateTypeArr[i] == "phone"){
							if(!validateRules.isPhone(value)){
								_tip = "请输入正确的电话号码！";
							}
						}
						else if(validateTypeArr[i] == "mobilePhone"){
							if(!validateRules.isMobilePhone(value)){
								_tip = "请输入正确的手机号码！";
							}
						}
					}
					if(_tip != ""){
						$("#" + id + "_error_tip").show();
						$("#" + id + "_error_tip").text(_tip);
						returnFlag = true;
						break;
					}
				}
			}
			return returnFlag;
		}
	};
	
	/**
	 * 初始化新增简单用户信息窗口
	 */
	function initNewSimpleUserWin(){
		var initJson = {};
		if(useUserName){
			initJson["emailTitle"] = "用户名：";
			initJson["email"] = "用户名";
			initJson["emailDefaultValue"] = "用户名";
		}
		else{
			initJson["emailTitle"] = "电子邮箱：";
			initJson["email"] = "电子邮箱";
			initJson["emailDefaultValue"] = "电子邮箱";
		}
		var _newSimpleUserWin = $.render($("#newSimpleUserWin_template").html(),initJson);
		$("body").append(_newSimpleUserWin);
		$("#newSimpleUserWin").fadeIn();
		$("#newSimpleUserWin").draggable({
			handle: $('#newSimpleUserWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		
		
		if(!($._data($("#newSimpleUserWin .textInput").get(0), "events") != undefined
				&& $._data($("#newSimpleUserWin .textInput").get(0), "events")["focus"] != undefined)){//输入框事件
			$("#newSimpleUserWin .textInput").bind("focus",function(){//密码框需要独立判断
				if(this.id == "newSimpleUserPasswordTip"){//密码提示框
					$(this).hide();
					$("#newSimpleUserPassword").show();
					$("#newSimpleUserPassword").focus();
				}
				else if(this.id == "newSimpleUserPassword"){//密码框
					$(this).removeClass("textInput-n");
					$(this).addClass("textInput-f");
					$("#" + this.id + "_error_tip").hide();
				}
				else{
					if(isHintInputEmpty($(this))){
						$(this).val("");
						$(this).removeClass("input_hint");
						$(this).addClass("input_normal");
					}
					$(this).removeClass("textInput-n");
					$(this).addClass("textInput-f");
					$("#" + this.id + "_error_tip").hide();
				}
				
				$("#newSimpleUserSaveBtn").removeAttr("disabled");
			});
			$("#newSimpleUserWin .textInput").bind("blur",function(){
				var defaultValue = $(this).attr("defaultValue");
				$(this).removeClass("textInput-f");
				$(this).addClass("textInput-n");
				if($.trim($(this).val()) == ""){
					if(this.id == "newSimpleUserPassword"){//密码框
						$(this).hide();
						$("#newSimpleUserPasswordTip").show();
					}
					else{
						$(this).val(defaultValue);
						$(this).removeClass("input_normal");
						$(this).addClass("input_hint");
					}
				}
				else{
					if(!validateInputErr(this.id)){
						if(this.id == "newSimpleUserEmail"){
							var email = $("#" + this.id).val();
							organizationView.omUserIsExit(email,function(response){
								if(response.returnFlag == "-1"){
									if(useUserName){
										$("#newSimpleUserEmail_error_tip").text("用户名重复，请重新输入！");
									}
									else{
										$("#newSimpleUserEmail_error_tip").text("电子邮箱地址重复，请重新输入！");
									}
									$("#newSimpleUserEmail_error_tip").show();
								}
							});
						}
					}
				}
			});
		}
		$("#newSimpleUserEmail").focus();
		
		if(!($._data($("#newSimpleUserSaveBtn").get(0), "events") != undefined
				&& $._data($("#newSimpleUserSaveBtn").get(0), "events")["click"] != undefined)){//确认按钮点击事件
			$("#newSimpleUserSaveBtn").bind("click",function(){
				if($(this).attr("disabled")){//设置确认按钮disabled属性，防止重复点击
					return;
				}
				else{
					$(this).attr("disabled",true);
				}
				var hasErr = false;
				var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
				var selectNode = organizationZTree.getSelectedNodes()[0];//选中树节点
				$("#newSimpleUserWin .textInput").each(function(){
					var _tip = "";
					if(this.id == "newSimpleUserPasswordTip"){
						if($(this).is(":visible")){//密码提示框显示时
							_tip = "密码不能为空！";
							hasErr = true;
							$("#newSimpleUserPassword_error_tip").text(_tip);
							$("#newSimpleUserPassword_error_tip").show();
						}
					}
					else if(this.id == "newSimpleUserPassword"){
						if($(this).is(":visible")){//密码框显示时框显示时
							if(validateInputErr(this.id)){
								hasErr = true;
							}
						}
					}
					else{
						if(isHintInputEmpty($(this))){
							switch (this.id) {
								case "newSimpleUserEmail":
									if(useUserName){
										_tip = "用户名不能为空！";
									}
									else{
										_tip = "电子邮箱不能为空！";
									}
									break;
								case "newSimpleUserName":
									_tip = "姓名不能为空！";
									break;
							}
							hasErr = true;
							$("#" + this.id + "_error_tip").text(_tip);
							$("#" + this.id + "_error_tip").show();
						}
						if(validateInputErr(this.id)){
							hasErr = true;
						}
					}					
				});
				
				if(!hasErr){
					var email = $.trim($("#newSimpleUserEmail").val());
					var password = $.trim($("#newSimpleUserPassword").val());
					var name = $.trim($("#newSimpleUserName").val());
					var data = {};
					data["parentId"] = selectNode.id;
					data["type"] = USER_TYPE;
					data["status"] = 1;
					data["email"] = email;
					data["password"] = password;
					data["name"] = name;
					organizationView.omUserIsExit(email,function(response){
						if(response.returnFlag == "0"){
							organizationView.addZTreeNode(data,"newSimpleUserWin");
						}
						else{
							if(useUserName){
								$("#newSimpleUserEmail_error_tip").text("用户名重复，请重新输入！");
							}
							else{
								$("#newSimpleUserEmail_error_tip").text("电子邮箱地址重复，请重新输入！");
							}
							$("#newSimpleUserEmail_error_tip").show();
						}
					});
				}
			});
		}
		
		if(!($._data($("#newSimpleUserAddMoreBtn").get(0), "events") != undefined
				&& $._data($("#newSimpleUserAddMoreBtn").get(0), "events")["click"] != undefined)){//添加更多详细信息按钮点击事件
			$("#newSimpleUserAddMoreBtn").bind("click",function(){
				
				var email = getValue($("#newSimpleUserEmail"));
				var password = getPassword();
				var name = getValue($("#newSimpleUserName"));
				
				var data = {email:email,password:password,name:name};
				
				initNewDetailUserWin(data,"new");
				$("#newSimpleUserWin").fadeOut(function(){
					$("#newSimpleUserWin").remove();
				});
				/**
				 * 获得输入框中的值
				 * @param _input 输入框jquery对象
				 */
				function getValue(_input){
					var value;
					if(isHintInputEmpty(_input)){
						value = null;
					}
					else{
						value = $.trim(_input.val());
					}
					return value;
				}
				
				/**
				 * 获得密码
				 */
				function getPassword(){
					var value = null;
					if($("#newSimpleUserPasswordTip").is(":visible")){//密码提示框显示
						value = null;
					}
					else if($("#newSimpleUserPassword").is(":visible")){//密码框显示
						value = $.trim($("#newSimpleUserPassword").val());
					}
					return value;
				}
			});
		}
		
		if(!($._data($("#newSimpleUserCancelBtn").get(0), "events") != undefined
				&& $._data($("#newSimpleUserCancelBtn").get(0), "events")["click"] != undefined)){//取消按钮点击事件
			$("#newSimpleUserCancelBtn").bind("click",function(){
				$(".blackboard-css").hide();
				$("#newSimpleUserWin").fadeOut(function(){
					$("#newSimpleUserWin").remove();
				});
			});
		}
		
		if(!($._data($("#newSimpleUserWin .win_close").get(0), "events") != undefined
				&& $._data($("#newSimpleUserWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#newSimpleUserWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#newSimpleUserWin").fadeOut(function(){
					$("#newSimpleUserWin").remove();
				});
			});
		}
		
		/**
		 * 验证输入框的错误
		 * @param id 控件id
		 * @returns true表示输入框有错误 false表示输入框没有错误
		 */
		function validateInputErr(id){
			var returnFlag = false;
			var validateType = $("#" + id).attr("validateType");//判断验证类型：包括邮箱、密码等
			var validateTypeArr = null;//验证类型数组
			if(validateType){
				validateTypeArr = validateType.split(",");
			}
			if(validateTypeArr){
				var _tip = "";
				var value = $.trim($("#" + id).val());
				var isEmpty = false;//判断input是否为空
				isEmpty = isHintInputEmpty($("#" + id));
				
				for ( var i = 0; i < validateTypeArr.length; i++) {
					if(!isEmpty){
						if(validateTypeArr[i] == "email" && !useUserName){
							if(!validateRules.isEmail(value)){
								_tip = "请输入正确的电子邮箱地址！";
							}
						}
						else if(validateTypeArr[i] == "password"){
							if(!validateRules.isPassword(value)){
								_tip = "请输入6-16位数字、字母或符号，区分大小写！";
							}
						}
					}
					if(_tip != ""){
						$("#" + id + "_error_tip").show();
						$("#" + id + "_error_tip").text(_tip);
						returnFlag = true;
					}
				}														
			}			
			return returnFlag;
		}
	}
	
	/**
	 * 初始化新增用户详细信息窗口
	 * @param data 新增简单用户信息传递过来的参数或者修改用户信息传递过来的参数
	 * @param operateType 操作类型 new或者update
	 */
	initNewDetailUserWin = function(data,operateType){
		newUserOperateType = operateType;
		var json = null;
		if(newUserOperateType == "new"){
			var emailTitle;
			if(useUserName){
				emailTitle = "用户名";
			}
			else{
				emailTitle = "电子邮箱";
			}
			var email = data&&data.email?data.email:emailTitle;
			var emailClass = data&&data.email?"input_normal":"input_hint";
			var passwordTipDisplay = data&&data.password?"none":"";
			var passwordDisplay = data&&data.password?"":"none";
			var password = data&&data.password?data.password:"";
			var name = data&&data.name?data.name:"姓名";
			var nameClass = data&&data.name?"input_normal":"input_hint";
			json = {win_title:"新增用户",emailTitle:emailTitle,email:email,emailClass:emailClass,emailDefaultValue:emailTitle,password:password,
					passwordTipDisplay:passwordTipDisplay,passwordDisplay:passwordDisplay,name:name,nameClass:nameClass,nameDefaultValue:"姓名",
					phone:"电话",phoneDefaultValue:"电话",mobilePhone:"手机",mobilePhoneDefaultValue:"手机",xzqhdm:"行政区划代码",
					xzqhdmDefaultValue:"行政区划代码",xzqhmc:"行政区划名称",xzqhmcDefaultValue:"行政区划名称",address:"地址",
					addressDefaultValue:"地址"};			
		}
		else if(newUserOperateType == "update"){
			var emailTitle;
			if(useUserName){
				emailTitle = "用户名";
			}
			else{
				emailTitle = "电子邮箱";
			}
			var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
			var selectNode = organizationZTree.getSelectedNodes()[0];
			json = {win_title:"详细信息",emailTitle:emailTitle,email:selectNode.email,emailClass:"input_normal",emailDefaultValue:selectNode.email,
					name:selectNode.name,nameClass:"input_normal",nameDefaultValue:selectNode.name,phone:selectNode.phone,
					phoneDefaultValue:selectNode.phone,mobilePhone:selectNode.mobilePhone,mobilePhoneDefaultValue:selectNode.mobilePhone,
					xzqhdm:selectNode.xzqhdm,xzqhdmDefaultValue:selectNode.xzqhdm,xzqhmc:selectNode.xzqhmc,xzqhmcDefaultValue:selectNode.xzqhmc,
					address:selectNode.address,addressDefaultValue:selectNode.address};
		}
				
		$("body").append($.render($("#newDetailUserWin_template").html(),json));
		$("#newDetailUserWin").fadeIn();
		$("#newDetailUserWin").draggable({
			handle: $('#newDetailUserWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		
		if(!($._data($("#newDetailUserWin .textInput").get(0), "events") != undefined
				&& $._data($("#newDetailUserWin .textInput").get(0), "events")["focus"] != undefined)){//输入框事件
			$("#newDetailUserWin .textInput").bind("focus",function(){//密码框需要独立判断，且编辑状态下没有密码框
				if(this.id == "newDetailUserPasswordTip"){//密码提示框
					$(this).hide();
					$("#newDetailUserPassword").show();
					$("#newDetailUserPassword").focus();
				}
				else if(this.id == "newDetailUserPassword"){//密码框
					$(this).removeClass("textInput-n");
					$(this).addClass("textInput-f");
					$("#" + this.id + "_error_tip").hide();
				}
				else{
					if(newUserOperateType == "new"){
						if(isHintInputEmpty($(this))){
							$(this).val("");
							$(this).removeClass("input_hint");
							$(this).addClass("input_normal");
						}
					}
					
					$(this).removeClass("textInput-n");
					$(this).addClass("textInput-f");				
					$("#" + this.id + "_error_tip").hide();
				}
									
				$("#newDetailUserSaveBtn").removeAttr("disabled");
			});
			$("#newDetailUserWin .textInput").bind("blur",function(){
				$(this).removeClass("textInput-f");
				$(this).addClass("textInput-n");
				if(newUserOperateType == "new"){
					var defaultValue = $(this).attr("defaultValue");
					if($.trim($(this).val()) == ""){
						if(this.id == "newDetailUserPassword"){//密码框
							$(this).hide();
							$("#newDetailUserPasswordTip").show();
						}
						else{
							$(this).val(defaultValue);
							$(this).removeClass("input_normal");
							$(this).addClass("input_hint");
						}
					}
					else{
						if(!validateInputErr(this.id,"new")){
							if(this.id == "newDetailUserEmail"){
								var email = $("#" + this.id).val();
								organizationView.omUserIsExit(email,function(response){
									if(response.returnFlag == "-1"){
										if(useUserName){
											$("#newDetailUserEmail_error_tip").text("用户名重复，请重新输入！");
										}
										else{
											$("#newDetailUserEmail_error_tip").text("电子邮箱地址重复，请重新输入！");
										}
										$("#newDetailUserEmail_error_tip").show();
									}
								});
							}
						}
					}
				}
				else if(newUserOperateType == "update"){
					if(!validateInputErr(this.id,"update")){
						if(this.id == "newDetailUserEmail"){
							var email = $("#" + this.id).val();
							var defaultEmail = $("#" + this.id).attr("defaultValue");
							if(email != defaultEmail){
								organizationView.omUserIsExit(email,function(response){
									if(response.returnFlag == "-1"){
										if(useUserName){
											$("#newDetailUserEmail_error_tip").text("用户名重复，请重新输入！");
										}
										else{
											$("#newDetailUserEmail_error_tip").text("电子邮箱地址重复，请重新输入！");
										}
										$("#newDetailUserEmail_error_tip").show();
									}
								});
							}
						}
					}
				}
			});
		}
		
		if(newUserOperateType == "new" && !(data && data.email)){
			$("#newDetailUserEmail").focus();
		}
		else{
			var tempEmail = $("#newDetailUserEmail").val();
			$("#newDetailUserEmail").val("").focus().val(tempEmail);
		}
		if(newUserOperateType == "update"){
			$("#newDetailUserWin .textInput").removeClass("input_hint");
			$("#newDetailUserWin .textInput").addClass("input_normal");
			$(".newDetailUserPassword").remove();//去掉密码和密码提示框
			$("#newDetailUserWin").addClass("update_detail_user_win");
		}
		
		if(!($._data($("#newDetailUserSaveBtn").get(0), "events") != undefined
				&& $._data($("#newDetailUserSaveBtn").get(0), "events")["click"] != undefined)){//确认按钮点击事件
			$("#newDetailUserSaveBtn").bind("click",function(){
				if($(this).attr("disabled")){//设置确认按钮disabled属性，防止重复点击
					return;
				}
				else{
					$(this).attr("disabled",true);
				}
				
				var hasErr = false;
				var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
				var selectNode = organizationZTree.getSelectedNodes()[0];//选中树节点
				
				if(newUserOperateType == "new"){
					$("#newDetailUserWin .textInput").each(function(){
						var _tip = "";
						if(this.id == "newDetailUserPasswordTip"){
							if($(this).is(":visible")){//密码提示框显示时
								_tip = "密码不能为空！";
								hasErr = true;
								$("#newDetailUserPassword_error_tip").text(_tip);
								$("#newDetailUserPassword_error_tip").show();
							}
						}
						else if(this.id == "newDetailUserPassword"){
							if($(this).is(":visible")){//密码框显示时框显示时
								if(validateInputErr(this.id,"new")){
									hasErr = true;
								}
							}
						}
						else{
							if(isHintInputEmpty($(this))){
								switch (this.id) {
									case "newDetailUserEmail":
										if(useUserName){
											_tip = "用户名不能为空！";
										}
										else{
											_tip = "电子邮箱不能为空！";
										}
										break;
									case "newDetailUserPassword":
										_tip = "密码不能为空！";
										break;
									case "newDetailUserName":
										_tip = "姓名不能为空！";
										break;
								}
								if(_tip != ""){
									$("#" + this.id + "_error_tip").text(_tip);
									$("#" + this.id + "_error_tip").show();
									hasErr = true;
								}
							}
							if(validateInputErr(this.id,"new")){
								hasErr = true;
							}
						}
					});

					if(!hasErr){
						var email = $.trim($("#newDetailUserEmail").val());
						organizationView.omUserIsExit(email,function(response){
							if(response.returnFlag == "-1"){
								if(useUserName){
									$("#newDetailUserEmail_error_tip").text("用户名重复，请重新输入！");
								}
								else{
									$("#newDetailUserEmail_error_tip").text("电子邮箱地址重复，请重新输入！");
								}
								$("#newDetailUserEmail_error_tip").show();
							}
							else if(response.returnFlag == "0"){
								var parentId = selectNode.id;
								var type = USER_TYPE;
								var status = 1;
								var password =  isHintInputEmpty($("#newDetailUserPassword"))?"":$.trim($("#newDetailUserPassword").val());
								var name =  isHintInputEmpty($("#newDetailUserName"))?"":$.trim($("#newDetailUserName").val());
								var phone =  isHintInputEmpty($("#newDetailUserPhone"))?"":$.trim($("#newDetailUserPhone").val());
								var mobilePhone =  isHintInputEmpty($("#newDetailUserMobilePhone"))?"":$.trim($("#newDetailUserMobilePhone").val());
								var xzqhdm =  isHintInputEmpty($("#newDetailUserXzqhdm"))?"":$.trim($("#newDetailUserXzqhdm").val());
								var xzqhmc =  isHintInputEmpty($("#newDetailUserXzqhmc"))?"":$.trim($("#newDetailUserXzqhmc").val());
								var address =  isHintInputEmpty($("#newDetailUserAddress"))?"":$.trim($("#newDetailUserAddress").val());

								var data = {parentId:parentId,type:type,status:status,email:email,password:password,
										name:name,phone:phone,mobilePhone:mobilePhone,xzqhdm:xzqhdm,xzqhmc:xzqhmc,
										address:address};
 								organizationView.addZTreeNode(data,"newDetailUserWin");
							}
						});
					}
				}
				else if(newUserOperateType == "update"){
					$("#newDetailUserWin .textInput").each(function(){
						if(validateInputErr(this.id,"update")){
							hasErr = true;
						}
					});
					
					if(!hasErr){
						var name = $.trim($("#newDetailUserName").val());
						var email =  $.trim($("#newDetailUserEmail").val());
						var phone = $.trim($("#newDetailUserPhone").val());
						var mobilePhone =  $.trim($("#newDetailUserMobilePhone").val());
						var xzqhdm =  $.trim($("#newDetailUserXzqhdm").val());
						var xzqhmc =  $.trim($("#newDetailUserXzqhmc").val());
						var address = $.trim($("#newDetailUserAddress").val());
						
						var defaultName = $("#newDetailUserName").attr("defaultvalue");
						var defaultEmail = $("#newDetailUserEmail").attr("defaultvalue");
						var defaultPhone = $("#newDetailUserPhone").attr("defaultvalue");
						var defaultMobilePhone = $("#newDetailUserMobilePhone").attr("defaultvalue");
						var defaultXzqhdm = $("#newDetailUserXzqhdm").attr("defaultvalue");
						var defaultXzqhmc = $("#newDetailUserXzqhmc").attr("defaultvalue");
						var defaultAddress = $("#newDetailUserAddress").attr("defaultvalue");
						if(name == defaultName && email == defaultEmail && phone == defaultPhone && mobilePhone == defaultMobilePhone
								&& xzqhdm == defaultXzqhdm && xzqhmc == defaultXzqhmc && address == defaultAddress){//用户信息没有改变
							$(".blackboard-css").hide();
							$("#newDetailUserWin").fadeOut(function(){
								$("#newDetailUserWin").remove();
							});
							return;
						}
						var data = {id:selectNode.id,type:selectNode.type,email:email,name:name,phone:phone,mobilePhone:mobilePhone,
								xzqhdm:xzqhdm,xzqhmc:xzqhmc,address:address};
						if(email == defaultEmail){//电子邮箱没有改变							
							organizationView.updateZTreeNode(selectNode,data,"newDetailUserWin");
						}
						else{
							organizationView.omUserIsExit(email,function(response){
								if(response.returnFlag == "-1"){
									if(useUserName){
										$("#newDetailUserEmail_error_tip").text("用户名重复，请重新输入！");
									}
									else{
										$("#newDetailUserEmail_error_tip").text("电子邮箱地址重复，请重新输入！");
									}
									$("#newDetailUserEmail_error_tip").show();
								}
								else if(response.returnFlag == "0"){
									organizationView.updateZTreeNode(selectNode,data,"newDetailUserWin");
								}
							});
						}						
					}					
				}
			});
		}
		
		if(!($._data($("#newDetailUserCancelBtn").get(0), "events") != undefined
				&& $._data($("#newDetailUserCancelBtn").get(0), "events")["click"] != undefined)){//取消按钮点击事件
			$("#newDetailUserCancelBtn").bind("click",function(){
				$(".blackboard-css").hide();
				$("#newDetailUserWin").fadeOut(function(){
					$("#newDetailUserWin").remove();
				});
			});
		}
		
		if(!($._data($("#newDetailUserWin .win_close").get(0), "events") != undefined
				&& $._data($("#newDetailUserWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#newDetailUserWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#newDetailUserWin").fadeOut(function(){
					$("#newDetailUserWin").remove();
				});
			});
		}
		
		/**
		 * 验证输入框的错误
		 * @param id 控件id
		 * @param type "new"或者"update"
		 * @returns true表示输入框有错误 false表示输入框没有错误
		 */
		function validateInputErr(id,type){
			var returnFlag = false;
			var validateType = $("#" + id).attr("validateType");//判断验证类型：包括非空、邮箱、密码、电话、手机号码等
			var validateTypeArr = null;//验证类型数组
			if(validateType){
				validateTypeArr = validateType.split(",");
			}
			if(validateTypeArr){
				var _tip = "";
				var value = $.trim($("#" + id).val());
				var isEmpty = false;//判断input是否为空
				if(type == "new"){
					isEmpty = isHintInputEmpty($("#" + id));
				}
				else if(type == "update"){
					isEmpty = value == ""?true:false;
				}				
				for ( var i = 0; i < validateTypeArr.length; i++) {
					if(isEmpty){
						if(type == "update" && validateTypeArr[i] == "required"){
							if(id == "newDetailUserName"){
								_tip = "姓名不能为空！";
							}
							else if(id == "newDetailUserPassword"){
								_tip = "密码不能为空！";
							}
							else if(id == "newDetailUserEmail"){
								if(useUserName){
									_tip = "用户名不能为空！";
								}
								else{
									_tip = "电子邮箱不能为空！";
								}
							}
						}
					}
					else{
						if(validateTypeArr[i] == "email"){
							if(!validateRules.isEmail(value) && !useUserName){
								_tip = "请输入正确的电子邮箱地址！";
							}
						}
						else if(validateTypeArr[i] == "password"){
							if(!validateRules.isPassword(value)){
								_tip = "请输入6-16位数字、字母或符号，区分大小写！";
							}
						}
						else if(validateTypeArr[i] == "phone"){
							if(!validateRules.isPhone(value)){
								_tip = "请输入正确的电话号码！";
							}
						}
						else if(validateTypeArr[i] == "mobilePhone"){
							if(!validateRules.isMobilePhone(value)){
								_tip = "请输入正确的手机号码！";
							}
						}
					}
					if(_tip != ""){
						$("#" + id + "_error_tip").show();
						$("#" + id + "_error_tip").text(_tip);
						returnFlag = true;
						break;
					}
				}
			}
			
			return returnFlag;
		}
	};
	
	/**
	 * 初始化组织添加用户接口
	 */
	this.initContainUserWin = function(){
		changeUserArray = new Array();
		$(".blackboard-css").show();
		$("body").append($("#containUserWin_template").html());
		$("#containUserWin").fadeIn();
		$("#containUserWin").draggable({
			handle: $('#containUserWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		
		var setting = {
				async:{
					enable: true,//开启异步加载模式
					url: path + "/ts/omGetZTreeAllUser?"
				},
				data: {
					simpleData: {
						enable: true,//使用简单数据模式
						idKey: "id",
						pIdKey: "parentId",
						rootPId: 0
					}
				},
				check: {				
					enable: true//显示checkbox
				},
				view: {
					showLine:false//不显示连线
				},
				callback: {
					onAsyncSuccess: onAsyncSuccess,
					onCheck: onCheck
				}
			};
				
		$.fn.zTree.init($("#allUserZTree"), setting, null);//创建zTree
		
		/**
		 * 获得所有用户信息回调函数
		 */
		function onAsyncSuccess(event, treeId, treeNode, msg){
			allUserData = eval(msg);;
			var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
			var selectOrganizationNode = organizationZTree.getSelectedNodes()[0];
			organizationView.omGetUserByOrganization(function(data){//获得组织下的用户
				if(data && data.length > 0){
					var allUserZTree = $.fn.zTree.getZTreeObj("allUserZTree");
					for ( var i = 0; i < data.length; i++) {
						var treeNode = allUserZTree.getNodeByParam("id",data[i].id);
						allUserZTree.checkNode(treeNode,true,false);
					}
					isAllSelectedStatus();
				}
			},selectOrganizationNode);
		}
		
		/**
		 * check回调函数
		 */
		function onCheck(event, treeId, treeNode){
			isAllSelectedStatus();
			for ( var i = 0; i < changeUserArray.length; i++) {//若节点已在数组中，则表示取消改变此节点
				if(changeUserArray[i].id == treeNode.id){
					changeUserArray.splice(i,1);
					return;
				}				
			}
			var type = treeNode.checked?0:1;//0代表授权，1代表取消
			var json = {id:treeNode.id,type:type};
			changeUserArray.push(json);
		}
		
		/**
		 * 判断全选或者不是全选状态
		 */
		function isAllSelectedStatus(){
			var allUserZTree = $.fn.zTree.getZTreeObj("allUserZTree");
			var allNodes = allUserZTree.getNodes();//获得所有用户树中所有节点
			var checkedNodes = allUserZTree.getCheckedNodes();
			var _selectAllUser = $("#selectAllUser");
			if(allNodes.length == checkedNodes.length){//全选
				if(_selectAllUser.hasClass("checkbox_n")){
					_selectAllUser.removeClass("checkbox_n");
					_selectAllUser.addClass("checkbox_s");
				}
			}
			else{//不是全选
				if(_selectAllUser.hasClass("checkbox_s")){
					_selectAllUser.removeClass("checkbox_s");
					_selectAllUser.addClass("checkbox_n");
				}
			}
		}
		
		if(!($._data($("#selectAllUser").get(0), "events") != undefined
				&& $._data($("#selectAllUser").get(0), "events")["click"] != undefined)){//全选按钮点击事件
			$("#selectAllUser").bind("click",function(){
				var allUserZTree = $.fn.zTree.getZTreeObj("allUserZTree");
				if($(this).hasClass("checkbox_n")){//全选
					$(this).removeClass("checkbox_n");
					$(this).addClass("checkbox_s");
					var unCheckedNodes = allUserZTree.getCheckedNodes(false);//获得所有未选中节点
					changeUserArrayMethod(unCheckedNodes,0);
					allUserZTree.checkAllNodes(true);
				}
				else if($(this).hasClass("checkbox_s")){
					$(this).removeClass("checkbox_s");
					$(this).addClass("checkbox_n");
					var checkedNodes = allUserZTree.getCheckedNodes(true);//获得所有选中节点
					changeUserArrayMethod(checkedNodes,1);					
					allUserZTree.checkAllNodes(false);
				}
				
				/**
				 * 改变 组织下的用户改变数组
				 * @param nodes 选中或者未选中的节点数组
				 * @param type //0代表授权，1代表取消
				 */
				function changeUserArrayMethod(nodes,type){
					for ( var i = 0; i < nodes.length; i++) {
						if(changeUserArray.length > 0){
							for ( var j = 0; j < changeUserArray.length; j++) {
								if(nodes[i].id == changeUserArray[j].id){
									changeUserArray.splice(j,1);
									break;
								}
								if(j == changeUserArray.length -1){
									var json = {id:nodes[i].id,type:type};
									changeUserArray.push(json);
									break;
								}							
							}
						}
						else if(changeUserArray.length == 0){
							var json = {id:nodes[i].id,type:type};
							changeUserArray.push(json);
						}
					}
				}				
			});
		}
		
		if(!($._data($("#containUserSaveBtn").get(0), "events") != undefined
				&& $._data($("#containUserSaveBtn").get(0), "events")["click"] != undefined)){//确认按钮点击事件
			$("#containUserSaveBtn").bind("click",function(){
				if($(this).attr("disabled")){//设置确认按钮disabled属性，防止重复点击
					return;
				}
				else{
					$(this).attr("disabled",true);
				}
				if(changeUserArray && changeUserArray.length == 0){
					$(".blackboard-css").hide();
					$("#containUserWin").fadeOut(function(){
						$("#containUserWin").remove();
					});
					return;
				}
				var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");//获得zTree对象
				var organizationNode = organizationZTree.getSelectedNodes()[0];//选中组织节点
				organizationView.omChangeOrganizationContainUser(organizationNode,changeUserArray,allUserData);
			});
		}
		
		if(!($._data($("#containUserCancelBtn").get(0), "events") != undefined
				&& $._data($("#containUserCancelBtn").get(0), "events")["click"] != undefined)){//取消按钮点击事件
			$("#containUserCancelBtn").bind("click",function(){
				$(".blackboard-css").hide();
				$("#containUserWin").fadeOut(function(){
					$("#containUserWin").remove();
				});
			});
		}
		
		if(!($._data($("#containUserWin .win_close").get(0), "events") != undefined
				&& $._data($("#containUserWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#containUserWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#containUserWin").fadeOut(function(){
					$("#containUserWin").remove();
				});
			});
		}
	};
	
	/**
	 * 初始化用户移至组织窗口
	 */
	this.initRelieveOrganizationWin = function(){
		$(".blackboard-css").show();
		$("body").append($("#relieveOrganizationWin_template").html());
		$("#relieveOrganizationWin").fadeIn();
		$("#relieveOrganizationWin").draggable({
			handle: $('#relieveOrganizationWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		relieveOrganizationArray = new Array();
		var setting = {
				async:{
					enable: true,//开启异步加载模式
					url: path + "/ts/omGetZTreeAllOrganization?"
				},
				data: {
					simpleData: {
						enable: true,//使用简单数据模式
						idKey: "id",
						pIdKey: "parentId",
						rootPId: -2
					}
				},
				check: {				
					enable: true,//显示checkbox
					chkboxType: { "Y": "", "N": "" }
				},
				view: {
					showLine:false//不显示连线
				},
				callback: {
					onAsyncSuccess: onAsyncSuccess,
					beforeCheck: beforeCheck,
					onCheck: onCheck
				}
			};
		var ORGANIZATION_ROOT_ID = -1;
		var zNodes = [{"id":ORGANIZATION_ROOT_ID,"name":"组织","type":0,"parentId":-2,"open":false, "isParent":true,
			"iconSkin":"icon-organization-double"}];//定义zTree根节点
		$.fn.zTree.init($("#allOrganizationZTree"), setting, zNodes);//创建zTree
		var allOrganizationZTree = $.fn.zTree.getZTreeObj("allOrganizationZTree");//获得zTree对象
		var rootNode = allOrganizationZTree.getNodeByParam("id",ORGANIZATION_ROOT_ID,null);//获得根节点对象
		allOrganizationZTree.expandNode(rootNode,true,false,true);//展开根节点		
		
		/**
		 * 获得所有组织信息回调函数
		 */
		function onAsyncSuccess(event, treeId, treeNode, msg){
			var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
			var selectUserNode = organizationZTree.getSelectedNodes()[0];
			organizationView.omGetOrganizationByUser(function(data){//获得组织下的用户
				if(data && data.length > 0){
					var allOrganizationZTree = $.fn.zTree.getZTreeObj("allOrganizationZTree");
					for ( var i = 0; i < data.length; i++) {
						var treeNode = allOrganizationZTree.getNodeByParam("id",data[i].id);
						allOrganizationZTree.checkNode(treeNode,true,false);
					}
				}				
			},selectUserNode);
		}
		
		/**
		 * 勾选组织之前回调函数
		 */
		function beforeCheck(treeId, treeNode){
			if(treeNode.checked){//取消勾选组织
				var allOrganizationZTree = $.fn.zTree.getZTreeObj("allOrganizationZTree");
				var checkedNodes = allOrganizationZTree.getCheckedNodes(true);
				if(checkedNodes.length == 1){
					if($("#userSelectOrganization_tip").is(":hidden")){
						$("#userSelectOrganization_tip").show();
						setTimeout(function(){
							$("#userSelectOrganization_tip").fadeOut();
						}, 1000);
					}					
					return false;
				}
			}
		}
		
		/**
		 * 勾选组织回调函数
		 */
		function onCheck(event, treeId, treeNode){
			for ( var i = 0; i < relieveOrganizationArray.length; i++) {//若节点已在数组中，则表示取消改变此节点
				if(relieveOrganizationArray[i].id == treeNode.id){
					relieveOrganizationArray.splice(i,1);
					return;
				}				
			}
			var type = treeNode.checked?0:1;//0代表授权，1代表取消
			var json = {id:treeNode.id,type:type};
			relieveOrganizationArray.push(json);			
		}
		
		if(!($._data($("#relieveOrganizationSaveBtn").get(0), "events") != undefined
				&& $._data($("#relieveOrganizationSaveBtn").get(0), "events")["click"] != undefined)){//移动按钮点击事件
			$("#relieveOrganizationSaveBtn").bind("click",function(){
				if($(this).attr("disabled")){//设置确认按钮disabled属性，防止重复点击
					return;
				}
				else{
					$(this).attr("disabled",true);
				}
				if(relieveOrganizationArray && relieveOrganizationArray.length == 0){
					$(".blackboard-css").hide();
					$("#relieveOrganizationWin").fadeOut(function(){
						$("#relieveOrganizationWin").remove();
					});
					return;
				}
				var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");//获得zTree对象
				var userNode = organizationZTree.getSelectedNodes()[0];//选中用户节点
				organizationView.omChangeUserRelieveOrganization(userNode,relieveOrganizationArray);
			});
		}
		
		if(!($._data($("#relieveOrganizationCancelBtn").get(0), "events") != undefined
				&& $._data($("#relieveOrganizationCancelBtn").get(0), "events")["click"] != undefined)){//取消按钮点击事件
			$("#relieveOrganizationCancelBtn").bind("click",function(){
				$(".blackboard-css").hide();
				$("#relieveOrganizationWin").fadeOut(function(){
					$("#relieveOrganizationWin").remove();
				});
			});
		}
		
		if(!($._data($("#relieveOrganizationWin .win_close").get(0), "events") != undefined
				&& $._data($("#relieveOrganizationWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#relieveOrganizationWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#relieveOrganizationWin").fadeOut(function(){
					$("#relieveOrganizationWin").remove();
				});
			});
		}
	};
	
	/**
	 * 初始化组织用户详细信息窗口
	 */
	this.initMoreInformationWin = function(){
		$(".blackboard-css").show();
		var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
		var selectUserNode = organizationZTree.getSelectedNodes()[0];
		if(selectUserNode.type == ORGANIZATION_TYPE){//组织
			$("body").append($.render($("#moreInformationWin_template").html(),{local_title:"包含用户"}));
			var titles = ["组织名称：","电子邮箱：","电话：","手机：","地址："];
			var values = [selectUserNode.name,selectUserNode.email,selectUserNode.phone,selectUserNode.mobilePhone,
			              selectUserNode.address];
			for ( var i = 0; i < titles.length; i++) {
				var json = {title:titles[i],value:values[i]};
				var _moreInformationTableTr = $.render($("#moreInformationTableTr_template").html(),json);
				$("#moreInformationTable").append(_moreInformationTableTr);
			}
			
			organizationView.omGetUserByOrganization(appendUsers,selectUserNode);
		}
		else if(selectUserNode.type == USER_TYPE){//用户
			$("body").append($.render($("#moreInformationWin_template").html(),{local_title:"归属组织"}));
			var emailTitle;
			if(useUserName){
				emailTitle = "用户名：";
			}
			else{
				emailTitle = "电子邮箱：";
			}
			var titles = ["姓名：",emailTitle,"电话：","手机：","行政区划代码：","行政区划名称：","地址："];
			var values = [selectUserNode.name,selectUserNode.email,selectUserNode.phone,selectUserNode.mobilePhone,
			              selectUserNode.xzqhdm,selectUserNode.xzqhmc,selectUserNode.address];
			for ( var i = 0; i < titles.length; i++) {
				var json = {title:titles[i],value:values[i]};
				var _moreInformationTableTr = $.render($("#moreInformationTableTr_template").html(),json);
				$("#moreInformationTable").append(_moreInformationTableTr);
			}
			
			$("#moreInformationWin").addClass("user_detail_win");
			$("#updateUserPasswordBtn").show();
			organizationView.omGetOrganizationByUser(appendOrganizations,selectUserNode);
			
			
			if(!($._data($("#updateUserPasswordBtn").get(0), "events") != undefined
					&& $._data($("#updateUserPasswordBtn").get(0), "events")["click"] != undefined)){//修改密码按钮点击事件
				$("#updateUserPasswordBtn").bind("click",function(){
					$("#moreInformationWin").fadeOut(function(){
						$("#moreInformationWin").remove();
					});
					initChangePasswordWin();
				});
			}
		}
		$("#moreInformationWin").fadeIn();
		$("#moreInformationWin").draggable({
			handle: $('#moreInformationWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		
		if(!($._data($("#moreInformationEditBtn").get(0), "events") != undefined
				&& $._data($("#moreInformationEditBtn").get(0), "events")["click"] != undefined)){//编辑按钮点击事件
			$("#moreInformationEditBtn").bind("click",function(){
				$("#moreInformationWin").fadeOut(function(){
					$("#moreInformationWin").remove();
				});
				var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
				var selectUserNode = organizationZTree.getSelectedNodes()[0];
				if(selectUserNode.type == ORGANIZATION_TYPE){
					initNewDetailOrganizationWin(null,"update");					
				}
				else if(selectUserNode.type == USER_TYPE){
					initNewDetailUserWin(null,"update");
				}
			});
		}
		
		if(!($._data($("#moreInformationWin .win_close").get(0), "events") != undefined
				&& $._data($("#moreInformationWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#moreInformationWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#moreInformationWin").fadeOut(function(){
					$("#moreInformationWin").remove();
				});
			});
		}
		
		/**
		 * 详细页面添加组织下的用户信息
		 * @param data 组织包含的用户信息数组
		 */
		function appendUsers(data){
			if(data && data.length > 0){
				for ( var i = 0; i < data.length; i++) {
					var name = data[i].name;
					var tempName = name_limit(name,12);
					var name_title = "";
					if(name != tempName){
						name_title = name;
					}
					var json = {icon_class:"userItem_img",name:tempName,name_title:name_title};
					var _organizationItem = $.render($("#organizationItem_template").html(),json);
					$("#organization_list_ul").append(_organizationItem);
				}					
			}
			var json = {jump_class:"containUser containUser_n"};
			var _organizationIumpItem = $.render($("#organizationIumpItem_template").html(),json);
			$("#organization_list_ul").append(_organizationIumpItem);
			
			if(!($._data($(".containUser").get(0), "events") != undefined
					&& $._data($(".containUser").get(0), "events")["click"] != undefined)){//跳转到组织添加用户界面
				$(".containUser").bind("click",function(){
					$("#moreInformationWin").fadeOut(function(){
						$("#moreInformationWin").remove();
					});
					_windowView.initContainUserWin();
				});
			}
		}
		
		/**
		 * 详细页面添加用户所属的组织信息
		 * @param data 用户所属的组织信息数组
		 */
		function appendOrganizations(data){
			if(data && data.length > 0){
				for ( var i = 0; i < data.length; i++) {
					var name = data[i].name;
					var tempName = name_limit(name,12);
					var name_title = "";
					if(name != tempName){
						name_title = name;
					}
					var json = {icon_class:"organizationItem_img",name:tempName,name_title:name_title};
					var _organizationItem = $.render($("#organizationItem_template").html(),json);
					$("#organization_list_ul").append(_organizationItem);
				}
			}
			var json = {jump_class:"relieveOrganization relieveOrganization_n"};
			var _organizationIumpItem = $.render($("#organizationIumpItem_template").html(),json);
			$("#organization_list_ul").append(_organizationIumpItem);
			if(!($._data($(".relieveOrganization").get(0), "events") != undefined
					&& $._data($(".relieveOrganization").get(0), "events")["click"] != undefined)){//跳转到用户移至组织界面
				$(".relieveOrganization").bind("click",function(){
					$("#moreInformationWin").fadeOut(function(){
						$("#moreInformationWin").remove();
					});
					_windowView.initRelieveOrganizationWin();
				});
			}
		}
	};
	
	/**
	 * 初始化修改密码窗口
	 */
	var initChangePasswordWin = function(){
		$("body").append($("#changePasswordWin_template").html());
		$("#changePasswordWin").fadeIn();
		$("#changePasswordWin").draggable({
			handle: $('#changePasswordWin h4'),
			onDrag: function(e){
				limitEasyUiDrag(e,this.id);						
			}
		});
		if(!($._data($("#changePasswordWin .textInput").get(0), "events") != undefined
				&& $._data($("#changePasswordWin .textInput").get(0), "events")["focus"] != undefined)){//输入框事件
			$("#changePasswordWin .textInput").bind("focus",function(){
				$(this).removeClass("textInput-n");
				$(this).addClass("textInput-f");
				var id = this.id;
				$("#" + id + "_error_tip").hide();
				$("#changePasswordSaveBtn").removeAttr("disabled");
			});
			
			$("#changePasswordWin .textInput").bind("blur",function(){
				$(this).removeClass("textInput-f");
				$(this).addClass("textInput-n");
				var id = this.id;
				validateInputErr(id);
			});
		}
		
		$("#newPassword").focus();
		
		if(!($._data($("#changePasswordSaveBtn").get(0), "events") != undefined
				&& $._data($("#changePasswordSaveBtn").get(0), "events")["click"] != undefined)){//保存按钮点击事件
			$("#changePasswordSaveBtn").bind("click",function(){
				if($(this).attr("disabled")){//设置确认按钮disabled属性，防止重复点击
					return;
				}
				else{
					$(this).attr("disabled",true);
				}
				var hasErr = false;
				$("#changePasswordWin .textInput").each(function(){
					var id = this.id;
					if(validateInputErr(id)){
						hasErr = true;
					}
				});
				
				if(!hasErr){
					var organizationZTree = $.fn.zTree.getZTreeObj("organizationZTree");
					var selectNode = organizationZTree.getSelectedNodes()[0];//选中树节点
					var id = selectNode.id;
					var newPassword = $("#newPassword").val();				
					var data = {"id":id,"new":newPassword};
					organizationView.omUpdatePassword(data);
				}
				
				
			});
		}
		
		if(!($._data($("#changePasswordCancelBtn").get(0), "events") != undefined
				&& $._data($("#changePasswordCancelBtn").get(0), "events")["click"] != undefined)){//取消按钮点击事件
			$("#changePasswordCancelBtn").bind("click",function(){
				$(".blackboard-css").hide();
				$("#changePasswordWin").fadeOut(function(){
					$("#changePasswordWin").remove();
				});
			});
		}
		
		if(!($._data($("#changePasswordCancelBtn").get(0), "events") != undefined
				&& $._data($("#changePasswordCancelBtn").get(0), "events")["click"] != undefined)){//取消按钮点击事件
			$("#changePasswordCancelBtn").bind("click",function(){
				$(".blackboard-css").hide();
				$("#changePasswordWin").fadeOut(function(){
					$("#changePasswordWin").remove();
				});
			});
		}
		
		if(!($._data($("#changePasswordWin .win_close").get(0), "events") != undefined
				&& $._data($("#changePasswordWin .win_close").get(0), "events")["click"] != undefined)){//关闭按钮点击事件
			$("#changePasswordWin .win_close").bind("click",function(){
				$(".blackboard-css").hide();
				$("#changePasswordWin").fadeOut(function(){
					$("#changePasswordWin").remove();
				});
			});
		}
		
		/**
		 * 验证输入框的错误
		 * @param id 控件id
		 * @returns true表示输入框有错误 false表示输入框没有错误
		 */
		function validateInputErr(id){
			var value = $("#" + id).val();
			var _tip = "";
			var returnFlag = false;
			if(id == "newPassword"){//新密码
				if(value == ""){
					_tip = "新密码不能为空";
				}
				else{
					if(!validateRules.isPassword(value)){
						_tip = "请输入6-16位数字、字母或符号，区分大小写！";
					}
				}
			}
			else if(id == "confirmNewPassword"){//确认新密码
				if(value == ""){
					_tip = "确认新密码不能为空";
				}
				else{
					var newPassord = $("#newPassword").val();
					if(newPassord != value){
						_tip = "与输入新密码不一致";
					}
				}
			}
			
			if(_tip != ""){
				$("#" + id + "_error_tip").show();
				$("#" + id + "_error_tip").text(_tip);
				returnFlag = true;
			}
			return returnFlag;
		}
	};
	
	/**
	 * 限制easyui drag不能超出屏幕
	 * @param e
	 * @param windId 弹出框id
	 */
	function limitEasyUiDrag(e,windId){
		var d = e.data;
		var marginLeft = parseInt($("#" + windId).css("margin-left"))*-1;//窗口margin-left,margin-left都为负值
		var marginTop = parseInt($("#" + windId).css("margin-top"))*-1;//窗口margin-top,margin-top都为负值
		var maxLeft = $(window).width()- marginLeft;
		var maxTop = $(window).height()- marginTop;
		if(d.left < marginLeft){
			d.left = marginLeft;
		}
		else if(d.left > maxLeft){
			d.left = maxLeft;
		}
		
		if (d.top < marginTop){
			d.top = marginTop;
		}
		else if (d.top > maxTop) {
			d.top = maxTop;
		}
	}
}