/**
* 解决方案用户喜好设置窗口VIEW
*/
function SolutionFavView(){
	/************  内部属性、方法  ****************/
	var selectedResourceNode = null;
	var ROOT_ID = 0;
	var _favoritePlatForm = null;//喜好的解决方案数据
	
	/**
	 * 关闭
	 */
	var colsePopUp = function() {
		$(".all_background").hide();
		$("#solution_tree").remove();
		$("#favoriteSettingWin").remove();
		if ($("#favoriteDiv").hasClass("settingDiv_s")) {
			$("#favoriteDiv").removeClass("settingDiv_s");
			$("#favoriteDiv").addClass("settingDiv_n");
		}
		GCUtil.doGC();
	};

	/**
	 * 初始化解决方案树
	 */
	var initSolutionTree = function() {
		$("#solution_tree_loading").show();
		//初始化树
		//顶层数据
		var rootJson = [{"id":ROOT_ID,"text":"解决方案根目录","iconCls":"icon-resource-double","state":"closed","attributes":[]}];
		$('#solution_tree').tree({
			data: rootJson,
			animate: true,//有展开动画
			checkbox:true,//可以选择
			onClick:function(node){
			},
			onSelect: function(node){
			},
			onBeforeExpand: function(node){//在节点打开之前触发,从接口获取json数据
			},
			onBeforeLoad : function(node, param){							

			},
			onLoadSuccess : function(node, data){//数据加载成功后，在界面上增加显示布局
			},
			onCheck: function(node, checked){
				if(!checked){
					$(node.target).children(".operate-div").children(".opertate-tree-checkbox").each(function(){
						var classStr = $(this).attr("class");
						var classes = classStr.split(" ");
						if(classes[1] == "operate-tree-checkbox1"){
							 $(this).removeClass("operate-tree-checkbox1");
							 $(this).addClass("operate-tree-checkbox0");
						}
					});
					
					var nodes = $("#solution_tree").tree("getChildren",node.target);
					for(var i=0; i<nodes.length; i++){
						$(nodes[i].target).children(".operate-div").children(".opertate-tree-checkbox").each(function(){
							var classStr = $(this).attr("class");
							var classes = classStr.split(" ");
							if(classes[1] == "operate-tree-checkbox1"){
								$(this).removeClass("operate-tree-checkbox1");
								$(this).addClass("operate-tree-checkbox0");
							}
						});
					}
				}
			}
		});
		
		solutionView.getSolutionService().getPFTreeData(randerSolutionTree, null);
	};

	/**
	 * 渲染树
	 * @param data
	 * @returns
	 */
	var randerSolutionTree = function(data) {
		if (isFromOrm) {//外部JSAPI方式
			getSolutionsFromTreeOrm(data);
		}
		
		solutionView.getSolutionService().getFavoritePlatForm(function(favData) {
			_favoritePlatForm = favData;
			setCheckedNode(data, favData);
			var rootNode = $("#solution_tree").tree("getRoot");
			$("#solution_tree").tree("append",{parent:rootNode.target,data:data});
			$("#solution_tree").tree("expand",rootNode.target);
			$("#solution_tree_loading").hide();
		}, {file:'{"userKey":"' + userAcct + '"}'});
	};

	/**
	 * 递归设置节点选中
	 * @param data
	 * @param favData
	 * @returns
	 */
	var setCheckedNode = function(data, favData) {
		for (var item in data) {//设置已经订阅的选中true
			for (var i in favData) {
				if (data[item].id == favData[i].pfId) {
					data[item].checked = true;
					break;
				}
			}
			if (data[item].children != null && data[item].children.length > 0) {
				setCheckedNode(data[item].children, favData);
			}
		}
	};

	/**
	 * 保存喜好设置
	 * @returns
	 */
	var saveFavSetting = function() {
		var saveData = new Array();
		var newCheckedNodes = $("#solution_tree").tree("getChecked");//用户对应选择的系统节点信息
		if (_favoritePlatForm.length == 0 && newCheckedNodes.length > 0) {//都是新增的
			for (var i in newCheckedNodes) {
				saveData.push({"userKey": userAcct, "pfId":newCheckedNodes[i].id, "kind": 1});
			}
		}
		else if (_favoritePlatForm.length > 0 && newCheckedNodes.length == 0) {//全是删除的
			for (var i in _favoritePlatForm) {
				saveData.push({"userKey": userAcct, "pfId":_favoritePlatForm[i].pfId, "kind": -1});
			}
		}
		else if (_favoritePlatForm.length > 0 && newCheckedNodes.length > 0) {//判断新增和删除的数据
			for (var i in _favoritePlatForm) {//先找出删除的
				var isExist = false;
				for (var j in newCheckedNodes) {
					if (_favoritePlatForm[i].pfId == newCheckedNodes[j].id) {//2者都存在
						isExist = true;
						break;
					}
				}
				if (!isExist) {//不存在则删除
					saveData.push({"userKey": userAcct, "pfId":_favoritePlatForm[i].pfId, "kind": -1});
				}
			}
			for (var i in newCheckedNodes) {//再找出新增的
				var isExist = false;
				for (var j in _favoritePlatForm) {
					if (_favoritePlatForm[j].pfId == newCheckedNodes[i].id) {//2者都存在
						isExist = true;
						break;
					}
				}
				if (!isExist) {//不存在则新增
					saveData.push({"userKey": userAcct, "pfId":newCheckedNodes[i].id, "kind": 1});
				}
			}
		}
		if (saveData.length > 0) {
			solutionView.getSolutionService().saveFavoritePlatForm(function(retData) {
				$.messager.alert("操作提示",retData,"info", function() {
					colsePopUp();
					messageCenter.callMessage('REFLASH_SOLUTION');
				});
				
			}, {file:JSON2.stringify(saveData)});
		}
		else {
			colsePopUp();
		}
	};
	
	/************  对外方法  ****************/
	/**
	 * 弹出设置窗口
	 */
	this.popUpFavSetting = function() {
		var _deleteSolutionWindow = $("#favoriteSetting_template").html();
		$(".all_background").show();
		$("body").append(_deleteSolutionWindow);
		initSolutionTree();
		
		if(!($._data($("#favoriteSettingWin .window_close").get(0), "events") != undefined
				&& $._data($("#favoriteSettingWin .window_close").get(0), "events")["click"] != undefined)){//关闭按钮
			$("#favoriteSettingWin .window_close").bind("click",function(){
				colsePopUp();
			});
		}
		
		if(!($._data($("#favoriteSettingWin .cancel").get(0), "events") != undefined
				&& $._data($("#favoriteSettingWin .cancel").get(0), "events")["click"] != undefined)){//取消按钮
			$("#favoriteSettingWin .cancel").bind("click",function(){
				colsePopUp();
			});
		}
		
		if(!($._data($("#save_solutionFav_btn").get(0), "events") != undefined
				&& $._data($("#save_solutionFav_btn").get(0), "events")["click"] != undefined)){//取消按钮
			$("#save_solutionFav_btn").bind("click",function(){
				saveFavSetting();
			});
		}
	};

	/**
	 * 关闭
	 */
	this.closeFavSetting = function() {
		colsePopUp();
	};
}