/**
 * 解决方案view
 */
$(function(){
	/**
	 * 解决方案工具条操作（返回、新增）VIEW
	 */
	SolutionOperateView = Backbone.View.extend({
		el: $("#solution_operate"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var solutionOperateTemplate = _.template($("#solution_operate_template").html());
			$(this.el).html(solutionOperateTemplate);
		},
		events: {
			"click #solutions_return": "solutionsReturn",
//			"mousedown #solutions_add": "addSolutionsMousedown",
			"click #solutions_add": "addSolutionsClick"
		},
		solutionsReturn: function(){//解决方案返回
			if (isLoading) {//如果还在加载中则不能返回
				return;
			}
			checkSave();
			//缓存选中项
			if(solutionSelectItemId != null && selectLabelId != null){
				$("#"+solutionSelectItemId).attr("sid", selectLabelId);
			}
			selectedSolutionData.remove($("#solutions_groups").children().eq(($("#solutions_groups").children().length-1)).attr("id"));
			$("#solutions_groups").children().eq(($("#solutions_groups").children().length-1)).remove();
			$("#solutions_groups").children().eq(($("#solutions_groups").children().length-1)).show();
			if($("#solutions_groups").children().length == 1){//返回到第一层数据时，隐藏返回按钮，操作路径清空
				if(!isFromOrm){
					cdtGetUrlPermission(userId);
				}
				$("#solutions_return").hide();
				$("#solutions_operate_title_name").children("span").text("");
			}
			else{//返回后还有好几层数据时，改变操作路径
				var titleName = "";//操作路径名称
				for(var j=0; j<$("#solutions_groups").children().length-1;j++){
					//前面选中的解决方案组id
					var oldSelectSolutionId = selectedSolutionData.get($("#solutions_groups").children().eq(j).attr("id"));
					if(j == 0){
						if($("#" + oldSelectSolutionId).children("span").attr("title") != null && 
								$("#" + oldSelectSolutionId).children("span").attr("title") != ""){
							titleName = $("#" + oldSelectSolutionId).children("span").attr("title");
						}
						else{
							titleName = $("#" + oldSelectSolutionId).children("span").text();
						}
						continue;
					}
					
					if($("#" + oldSelectSolutionId).children("span").attr("title") != null && 
							$("#" + oldSelectSolutionId).children("span").attr("title") != ""){
						titleName = titleName + " > " + $("#" + oldSelectSolutionId).children("span").attr("title");
					}
					else{
						titleName = titleName + " > " + $("#" + oldSelectSolutionId).children("span").text();
					}					
				}
				$("#solutions_operate_title_name").children("span").text(titleName);					
				limit("solutions_operate_title_name", operateTitleLimit);				
			}
			//点击返回键时,清空右边页签
			solutionSelectItemId = "";
			cleanWorkSpace();
		},
		addSolutions: function(e){
			newWinView.newWinOpen(e);
		},
		addSolutionBar: function(parMap){//parMap中存储传进来的参数 新建/重命名解决方案、解决方案组
			var type = parMap.get("type");
			var pfName = parMap.get("name");
			var pfUrl = parMap.get("url");//解决方案的URL
			var describe = type==1&&pfUrl?parMap.get("describe"):[];//是解决方案且url不为空 配置信息：是否显示标题栏
			var describeStr = JSON.stringify(describe);
			if (!pfUrl) {
				pfUrl = "";
			}
			if (LEFT_MENU_TYPE == 1) {
				
			}
			else if (LEFT_MENU_TYPE == 2) {//2层目录结构
				if (type == 0) {//新增解决方案组
					var maxOrderBy = 1;
					if ($("#solutions_groups").children().length > 0) {
						var lastId = $("#solutions_groups").children().last().attr("id");
						var index = lastId.substring(lastId.indexOf("solutions_groups")+16);
						maxOrderBy = parseInt(index) + 1;
					}
					
					var fileJsonStr = '{"pfName":"' + encodeURIComponent(pfName) + '","parentId":0,type:' + type + ',"orderBy":' + maxOrderBy + ',"url":"' + pfUrl + '"}';
					var url = contextPath + '/addPlatFormFile.do?file=' + fileJsonStr;
					
					var map = new HashMap();
					map.put("max", maxOrderBy);
					map.put("maxOrderBy", maxOrderBy);
					map.put("type", type);
					map.put("pfName",pfName);
					map.put("url",pfUrl);
					operateServerData(url,solutions,solutionOperateView.addGroupsItemTwo,map);
				}
				else if (type == 1) {//新增解决方案
					var parentPfId = parMap.get("parent");
					if (parentPfId == 0) {//根目录下新增
						var maxOrderBy = 1;
						if ($("#solutions_groups").children().length > 0) {
							var lastId = $("#solutions_groups").children().last().attr("id");
							var index = lastId.substring(lastId.indexOf("solutions_groups")+16);
							maxOrderBy = parseInt(index) + 1;
						}
						var fileJsonStr = '{"pfName":"' + encodeURIComponent(pfName) + '","parentId":0,type:' + type + ',"orderBy":' + maxOrderBy + ',"url":"' + pfUrl + '"}';
						var url = contextPath + '/addPlatFormFile.do?file=' + fileJsonStr;
						
						var map = new HashMap();
						map.put("max", maxOrderBy);
						map.put("maxOrderBy", maxOrderBy);
						map.put("type", type);
						map.put("pfName",pfName);
						map.put("url",pfUrl);
						map.put("parentPfId",parentPfId);
						map.put("describe",describe);
						operateServerData(url,solutions,solutionOperateView.addGroupsItemTwo,map,{describe: describeStr});
					}
					else {//某个解决方案下新增
						var sgInfo = solutionGroupInfo.get(parentPfId);
						var contentId = sgInfo.divId + "_content";
						
						var maxOrderBy = $("#" + contentId).children().length;
						if (maxOrderBy == 0) {//未点击过新增则从数据中取得
							maxOrderBy = sgInfo.number + 1;
						}
						else {
							var lastId = $("#" + contentId).children().last().attr("id");
							var index = lastId.substring(lastId.indexOf("_title")+6);
							maxOrderBy = parseInt(index) + 1;
						}
						var fileJsonStr = '{"pfName":"' + encodeURIComponent(pfName) + '","parentId":' + parentPfId + ',type:' + type + ',"orderBy":' + maxOrderBy + ',"url":"' + pfUrl + '"}';
						var url = contextPath + '/addPlatFormFile.do?file=' + fileJsonStr;
						
						var map = new HashMap();
						map.put("max", maxOrderBy);
						map.put("maxOrderBy", maxOrderBy);
						map.put("type", type);
						map.put("pfName",pfName);
						map.put("url",pfUrl);
						map.put("parentPfId",parentPfId);
						map.put("parentViewId", contentId);
						map.put("describe",describe);
						operateServerData(url,solutions,solutionOperateView.addGroupsItemTwo,map, {describe: describeStr});
					}
				}
			}
			else if (LEFT_MENU_TYPE == 3) {//多级目录
				if($("#solutions_groups").children().length == 1){//在第一层添加解决方案组或者解决方案
					var tmpSolution = firSolutionData.get(0);
					var solutionsParent = $("#solutions_groups").children().children();//包含解决方案和解决方案组的ul
					//maxOrderBy用来向数据库插入数据时的排序
					var maxOrderBy = 0;
					for(var i=0; i<tmpSolution.length; i++){
						if(maxOrderBy < tmpSolution[i].orderBy){
							maxOrderBy = tmpSolution[i].orderBy;
						}
					}
					if(maxOrderBy == 0 && tmpSolution.length == 0){
						maxOrderBy = 0;
					}
					else{
						maxOrderBy = maxOrderBy + 1;
					}				
					//max变量用来定义新增平台的id
					var max = 0;
					for(var i=0; i<solutionsParent.children().length; i++){
						if(max < parseInt(solutionsParent.children().eq(i).attr("group_item_index"))){
							max =  parseInt(solutionsParent.children().eq(i).attr("group_item_index"));
						}
					}
					max = max + 1;
					
					var fileJsonStr = '{"pfName":"' + encodeURIComponent(pfName) + '","parentId":0,type:' + type + ',"orderBy":' + maxOrderBy + ',"url":"' + pfUrl + '"}';
					var url = contextPath + '/addPlatFormFile.do?file=' + fileJsonStr;
					
					var map = new HashMap();
					map.put("max", max);
					map.put("maxOrderBy", maxOrderBy);
					map.put("type", type);
					map.put("pfName",pfName);
					map.put("tmpSolution",tmpSolution);
					map.put("url",pfUrl);
					map.put("describe",describe);
					operateServerData(url,solutions,solutionOperateView.addFirstSolutionGroupsItem,map,{describe: describeStr});
				}
				else{//在第二层以下添加解决方案组或者解决方案
					var prevSelectedId = selectedSolutionData.get($("#solutions_groups").children().eq($("#solutions_groups")
							.children().length-2).attr("id")); //上一个解决方案界面选中的解决方案组li id
					var prevPfId = pfIdData.get(prevSelectedId);//上一个解决方案界面选中的解决方案组的pfId
					var solutionsParent = $("#solutions_groups").children().eq($("#solutions_groups").children().length-1)
						.children();//包含解决方案和解决方案组的ul
					var tmpSolution = solutionData.get(prevPfId);
					//maxOrderBy用来向数据库插入数据时的排序
					var maxOrderBy = 0;
					for(var i=0; i<tmpSolution.length; i++){
						if(maxOrderBy < tmpSolution[i].orderBy){
							maxOrderBy = tmpSolution[i].orderBy;
						}
					}
					if(maxOrderBy == 0 && tmpSolution.length == 0){
						maxOrderBy = 0;
					}
					else{
						maxOrderBy = maxOrderBy + 1;
					}
					
					//max变量用来定义新增平台的id
					var max = 0;
					for(var i=0; i<solutionsParent.children().length; i++){
						if(max < parseInt(solutionsParent.children().eq(i).attr("group_item_index"))){
							max =  parseInt(solutionsParent.children().eq(i).attr("group_item_index"));
						}
					}
					max = max + 1;
					var fileJsonStr = '{"pfName":"' + encodeURIComponent(pfName) + '","parentId":' + prevPfId +',type:' + type + ',"orderBy":' + maxOrderBy + ',"url":"' + pfUrl + '"}';
					var url = contextPath + '/addPlatFormFile.do?file=' + fileJsonStr;
					var map = new HashMap();
					map.put("max", max);
					map.put("maxOrderBy", maxOrderBy);
					map.put("type", type);
					map.put("pfName",pfName);
					map.put("solutionsParent", solutionsParent);
					map.put("tmpSolution",tmpSolution);
					map.put("prevPfId", prevPfId);
					map.put("prevSelectedId", prevSelectedId);
					map.put("url", pfUrl);
					map.put("describe",describe);
					operateServerData(url,solutions,solutionOperateView.addSolutionGroupsItem,map,{describe: describeStr});
				}
			}
		},
		addGroupsItemTwo: function(response,map){//2级目录情况下，第一层新增解决方案(组)
			var max = map.get("max");
			var maxOrderBy = map.get("maxOrderBy");
			var type = map.get("type");
			var pfName = map.get("pfName");
			var tmpSolution = map.get("tmpSolution");
			var pfUrl = map.get("url");
			var describe = map.get("describe");
			var pfId = response.data.pfId;
			if (type == 0) {//解决方案组
				$("#solutions_groups").append("<div id='solutions_groups" + max + "' onselectstart='javascript:return false;'></div>");
				var solutionModel = new SolutionModel({id:"solutions1_item_title" + max,parentViewId:"solutions_groups" + max,pfId:pfId,userId:userId,
					parentId:0,type:type,describe:describe,name:pfName, number: 0, url:pfUrl});
				solutions.add(solutionModel);
			}
			else if (type == 1) {//解决方案
				var parentPfId = map.get("parentPfId");
				if (parentPfId == 0) {//在根节点下新增
					$("#solutions_groups").append("<div id='solutions_groups" + max + "' onselectstart='javascript:return false;'></div>");
					var solutionModel = new SolutionModel({id:"solutions1_item_title" + max,parentViewId:"solutions_groups" + max,pfId:pfId,userId:userId,
						parentId:0,type:type,describe:describe,name:pfName, number: 0, url:pfUrl});
					solutions.add(solutionModel);
				}
				else {
					var parentViewId = map.get("parentViewId");
					if ($("#" + parentViewId).children().length == 0) {//未加载过，则自动点击
						$("#" + parentViewId).prev().click();
					}
					else {//加载过了则手动添加
						if ($("#" + parentViewId).height() > 0) {//展开
							$("#" + parentViewId).animate({height:40*($("#" + parentViewId).children.length+1)},300,function(){
							});
						}
						var index = parentViewId.substring(parentViewId.indexOf("_title")+6);
						var solutionModel = new SolutionModel({id:"solutions" + index + "_item_title" + max,parentViewId:parentViewId,pfId:pfId,userId:userId,
							parentId:parentPfId,type:type,describe:describe,name:pfName, number: 0, url:pfUrl, isSubType:"true"});
						solutions.add(solutionModel);
						if ($("#" + parentViewId).height() == 0) {//闭合的，则展开
							$("#" + parentViewId).prev().click();
						}
					}
				}
			}
		},
		addFirstSolutionGroupsItem: function(response,map){//第一层数据界面新增解决方案组和解决方案,第一层新增后渲染页面
			var max = map.get("max");
			var maxOrderBy = map.get("maxOrderBy");
			var type = map.get("type");
			var pfName = map.get("pfName");
			var tmpSolution = map.get("tmpSolution");
			var pfUrl = map.get("url");
			var describe = map.get("describe");
			var describeStr = JSON.stringify(describe);
			var pfId = response.data.pfId;
			var solutionModel = new SolutionModel({id:"solutions1_item" +max,parentViewId:"solutions1",pfId:pfId,
				parentId:0,type:type,describe:describe,name:pfName, number: 0, url:pfUrl});
			solutions.reset();
			solutions.add(solutionModel);
			$("#solutions1_item" +max).attr("group_item_index",max);
			slutionTypeData.remove("solutions1_item" +max);
			slutionTypeData.put("solutions1_item" +max,type);
			
			pfIdData.remove("solutions1_item" +max);
			pfIdData.put("solutions1_item" +max, pfId);
			
			var jsonStr = "";
			var addSolutionJson = '{"pfId":"' + pfId + '","pfName":"' + pfName + '","subNumber":0,"type":' + type + ',"orderBy":' 
				+ maxOrderBy +',"parentId":"' + 0 + '","url":"' + pfUrl + '","describe":'+describeStr+'}';
			if(tmpSolution == null || tmpSolution.length == 0){
				jsonStr = "[" + addSolutionJson +"]";
			}
			else{		
				for(var i=0; i<tmpSolution.length; i++){
					if(i == 0){
						jsonStr = JSON.stringify(tmpSolution[i]);
						continue;
					}
					jsonStr = jsonStr + "," + JSON.stringify(tmpSolution[i]);
				}
				
				jsonStr = '[' + jsonStr +',' + addSolutionJson + ']';
			}
			
			var newTmpSolution = JSON.parse(jsonStr);
			firSolutionData.remove(0);			
			firSolutionData.put(0,newTmpSolution);			
		},
		addSolutionGroupsItem: function(response,map){//在第二层以下添加解决方案组或者解决方案	,第二层以下新增后渲染页面
			var max = map.get("max");
			var maxOrderBy = map.get("maxOrderBy");
			var type = map.get("type");
			var pfName = map.get("pfName");
			var solutionsParent = map.get("solutionsParent");
			var tmpSolution = map.get("tmpSolution");
			var prevPfId = map.get("prevPfId");
			var prevSelectedId = map.get("prevSelectedId");
			var pfUrl = map.get("url");
			var describe = map.get("describe");
			var describeStr = JSON.stringify(describe);
			var pfId = response.data.pfId;	
			
			var solutionModel = new SolutionModel({id:"solutions" + ($("#solutions_groups").children().length) +  "_item" +max,parentViewId:solutionsParent.attr("id"),pfId:pfId,
				parentId:prevPfId,type:type,describe:describe,name:pfName, number: 0, url:pfUrl});
			solutions.reset();
			solutions.add(solutionModel);
			$("#solutions" + ($("#solutions_groups").children().length) +  "_item" +max).attr("group_item_index",max);			
			
			slutionTypeData.remove("solutions" + ($("#solutions_groups").children().length) +  "_item" +max);
			slutionTypeData.put("solutions" + ($("#solutions_groups").children().length) +  "_item" +max,type);
			
			pfIdData.remove("solutions" + ($("#solutions_groups").children().length) +  "_item" +max);
			pfIdData.put("solutions" + ($("#solutions_groups").children().length) +  "_item" +max, pfId);
			
			var jsonStr = "";
			var addSolutionJson = '{"pfId":"' + pfId + '","pfName":"' + pfName + '","subNumber":0,"type":' + type + ',"orderBy":' + maxOrderBy 
				+',"parentId":"' + prevPfId + '","url":"' + pfUrl + '","describe":'+describeStr+'}';
			if(tmpSolution == null || tmpSolution.length == 0){
				jsonStr = "[" + addSolutionJson +"]";
			}
			else{
				if(type == 0){//当新增解决方案组时，在下一次下钻时，新增解决方案组的位置应该在解决方案之上
					var soulutionsIndex = -1;//用于确定解决方案组在tmpSolution数组中的位置
					for(var i=0; i<tmpSolution.length;i++){
						if(tmpSolution[i].type == 0){
							soulutionsIndex = i;
						}
					}
					if(soulutionsIndex == -1){//没有一个解决方案组时，新增的解决方案组应该在最上面
						jsonStr = addSolutionJson;
						for(var i=0; i<tmpSolution.length;i++){
							jsonStr = jsonStr + "," + JSON.stringify(tmpSolution[i]);
						}
					}
					else{
						for(var i=0; i<tmpSolution.length;i++){
							if(i == 0){
								jsonStr = JSON.stringify(tmpSolution[i]);
								if(i == soulutionsIndex){
									jsonStr = jsonStr + "," + addSolutionJson;									
								}
								continue;
							}
							jsonStr = jsonStr + "," + JSON.stringify(tmpSolution[i]);
							if(i == soulutionsIndex){
								jsonStr = jsonStr + "," + addSolutionJson;
							}
							
						}
					}
				}
				else if(type ==1){
					for(var i=0; i<tmpSolution.length;i++){
						if(i == 0){
							jsonStr = JSON.stringify(tmpSolution[i]);
							continue;
						}
						jsonStr = jsonStr + "," + JSON.stringify(tmpSolution[i]);
					}
					jsonStr =jsonStr +',' + addSolutionJson;
				}
				jsonStr = '[' + jsonStr + ']';
			}
			var newTmpSolution = JSON.parse(jsonStr);
			solutionData.remove(prevPfId);
			solutionData.put(prevPfId,newTmpSolution);
			
			$("#" + prevSelectedId + ">div:eq(1)").children("span").html(parseInt($("#" + prevSelectedId + 
					">div:eq(1)").children("span").html())+1);
			//当有大于三层数据时，增加第最后一层中的解决方案(组)个数，倒数第三层中的数据也要改变
			if($("#solutions_groups").children().length == 3 || $("#solutions_groups").children().length > 3){
				var oldSelectId = selectedSolutionData.get($("#solutions_groups").children().eq($("#solutions_groups").children().length-3).attr("id"));
				var oldPfId = pfIdData.get(oldSelectId);
				var oldTmpSolution = solutionData.get(oldPfId);
				for(var i=0; i<oldTmpSolution.length; i++){
					if( prevPfId == oldTmpSolution[i].pfId){
						oldTmpSolution[i].subNumber = oldTmpSolution[i].subNumber + 1;
					}
				}
			}
		},
		addSolutionsMousedown: function(){//拖动新增解决方案图标，新增系统、解决方案组和解决方案
			var obj = document.getElementById("solutions_add");
			var className = obj.className;			
			var dragDiv = document.createElement("div");
			dragDiv.id = "addSolutionDragDiv";
			dragDiv.className = className;
			dragDiv.style.position = "absolute";
			dragDiv.style.width = "15px";
			dragDiv.style.height = "15px";
			dragDiv.style.left = getObjPos(obj)['left'] + "px";
			dragDiv.style.top = getObjPos(obj)['top'] - parseInt($("#solutions_add").css("margin-top")) - 40 + "px";
			
			document.getElementById("body").appendChild(dragDiv);			
//			dragDiv.onMouseMove = objectMove(dragDiv, event);
//			start_move();
			
			function cPos(left, top){
				this.left = left;
				this.top = top;
			}
			
			function getObjPos(ATarget){
				var target = ATarget;
				var pos = new cPos(target.offsetLeft, target.offsetTop);
				target = target.offsetParent;
				while(target){
					pos.left += target.offsetLeft;
					pos.top += target.offsetTop;
					target = target.offsetParent;
				}
				return pos;
			}
			
		},
		addSolutionsClick: function(e){
			solutionOperateView.addSolutions(e);
		}
	});	
	
	/**
	 * 解决方案VIEW
	 */
	SolutionView = Backbone.View.extend({
		initialize: function () {
			$("#loading").fadeIn();//加载提示
			solutions = new Solutions(null, { view : this });
			var url = contextPath + '/getSubPFInfo.do';
			if (LEFT_MENU_TYPE == 1) {//1层目录结构
				operateServerData(url,solutions,this.initSolutionData);//获得第一层数据，并执行初始化操作	
			}
			else if (LEFT_MENU_TYPE == 2) {//2层目录结构
				operateServerData(url,solutions,this.initSolutionDataTwo);//获得第一层数据，并执行初始化操作	
			}
			else if (LEFT_MENU_TYPE == 3) {//多级目录
				operateServerData(url,solutions,this.initSolutionData);//获得第一层数据，并执行初始化操作	
			}
			
		},
		events: {
			
		},
		/** 初始化2级目录 */
		initSolutionDataTwo : function(response) {
			//初始化解决方案数据
			$("#loading").fadeOut();//隐藏加载提示
			var tmpSolution = response.data;
			if(selectedId == ""){//点击登录按钮进入,而不是点击系统进入，默认选择第一个系统
				if(tmpSolution != null && tmpSolution.length != 0){
					selectedId = tmpSolution[0].pfId;
				}
			}
						
			for(var i=0; i<tmpSolution.length; i++){
				$("#solutions_groups").append("<div id='solutions_groups" + (i+1) + "' onselectstart='javascript:return false;'></div>");
				var solutionModel = new SolutionModel({id:"solutions1_item_title" +(i+1),parentViewId:"solutions_groups" + (i+1),pfId:tmpSolution[i].pfId,userId:tmpSolution[i].userId,
					parentId:tmpSolution[i].parentId,type:tmpSolution[i].type,describe:tmpSolution[i].describe,name:tmpSolution[i].pfName, number: tmpSolution[i].subNumber,
					url:tmpSolution[i].url});
				solutions.add(solutionModel);				
				
				//初始化数据时选中默认选中项
				if(selectedId == tmpSolution[i].pfId){
					//改变默认选中项的样式
					var type = tmpSolution[i].type;
					$("#" + "solutions1_item_title" +(i+1)).removeClass($("#" + "solutions1_item_title" +(i+1)).attr("class"));
					if(type == 0){
						$("#" + "solutions1_item_title" +(i+1)).addClass("solution_list_item_s solution_list_group");
					}else if(type == 1){
						$("#" + "solutions1_item_title" +(i+1)).addClass("solution_list_item_s solution_list_single");
					}
					$("#" + "solutions1_item_title" +(i+1) + ">div:eq(0)").removeClass($("#" + "solutions1_item_title" +(i+1) + ">div:eq(0)").attr("class"));
					if(type == 0){//解决方案组
						$("#" + "solutions1_item_title" +(i+1) + ">div:eq(0)").addClass(getSolutionPicForcus(tmpSolution[i].pfName, 0));
						//展开状态
						$("#working").css("left",solution_space_width+"px");
						var clientWidth = document.documentElement.clientWidth;
						$("#working").css("width",(clientWidth-solution_space_width)+"px");
						$("#control").removeClass($("#control").attr("class"));
						$("#control").addClass("control_p");
						
//						$("#" + "solutions1_item" +(i+1)).click();
					}
					else if(type == 1){//解决方案
						$("#" + "solutions1_item_title" +(i+1) + ">div:eq(0)").addClass(getSolutionPicForcus(tmpSolution[i].pfName, 1));
						$("#" + "solutions1_item_title" +(i+1)).click();
					}
										
					//改变selectedSolutionData中的数据，存储选中项
					selectedSolutionData.put("solutions_groups","solutions1_item_title" +(i+1));
				}
								
				$("#solutions1_item" +(i+1)).attr("group_item_index",i+1);
			}					
			if(tmpSolution.length == 0 || !selectedSolutionData.get("solutions_groups1")){//进入时解决方案为空或者没有选中的解决方案时，展开左侧
				$("#working").css("left",solution_space_width+"px");
				var clientWidth = document.documentElement.clientWidth;
				$("#working").css("width",(clientWidth-solution_space_width)+"px");
				$("#control").removeClass($("#control").attr("class"));
				$("#control").addClass("control_p");
			}
		},
		initSolutionData : function(response) {//初始化解决方案数据
			$("#loading").fadeOut();//隐藏加载提示
			var tmpSolution = response.data;
			if(isFromOrm){
				getSolutionsFromOrm(tmpSolution);
			}
			else if(isFromOutOm){
				getSolutionsFromOutOm(tmpSolution);
			}
			if(selectedId == ""){//点击登录按钮进入,而不是点击系统进入，默认选择第一个系统
				if(tmpSolution != null && tmpSolution.length != 0){
					selectedId = tmpSolution[0].pfId;
				}
			}
			firSolutionData.put(0, tmpSolution);//存储第一层数据
			$("#solutions_groups").append("<div id='solutions_groups1' onselectstart='javascript:return false;'><ul id='solutions1' class='solutions_groups'></ul></div>");
			if(SOLUTION_SCAN_TYPE == 2){//浏览模式
				$(".solutions_groups").width(solution_space_width+"px");
			}
			for(var i=0; i<tmpSolution.length; i++){
				var solutionModel = new SolutionModel({id:"solutions1_item" +(i+1),parentViewId:"solutions1",pfId:tmpSolution[i].pfId,userId:tmpSolution[i].userId,
					parentId:tmpSolution[i].parentId,type:tmpSolution[i].type,describe:tmpSolution[i].describe,name:tmpSolution[i].pfName, number: tmpSolution[i].subNumber,
					url:tmpSolution[i].url});
				solutions.add(solutionModel);
				slutionTypeData.put("solutions1_item" +(i+1), tmpSolution[i].type);
				pfIdData.put("solutions1_item" +(i+1), tmpSolution[i].pfId);
				//初始化数据时选中默认选中项
				if(selectedId == tmpSolution[i].pfId){
					//改变默认选中项的样式
					var type = tmpSolution[i].type;
					$("#" + "solutions1_item" +(i+1)).removeClass($("#" + "solutions1_item" +(i+1)).attr("class"));
					if(SOLUTION_SCAN_TYPE == 1){
						if(type == 0){
							$("#" + "solutions1_item" +(i+1)).addClass("solution_list_item_s solution_list_group");
						}else if(type == 1){
							$("#" + "solutions1_item" +(i+1)).addClass("solution_list_item_s solution_list_single");
						}
					}else if(SOLUTION_SCAN_TYPE == 2){
						if(type == 0){
							$("#" + "solutions1_item" +(i+1)).addClass("wz-solution-list-item wz-solution-list-item-p solution_list_group");
						}else if(type == 1){
							$("#" + "solutions1_item" +(i+1)).addClass("wz-solution-list-item wz-solution-list-item-p solution_list_single");
						}
					}
					$("#" + "solutions1_item" +(i+1) + ">div:eq(0)").removeClass($("#" + "solutions1_item" +(i+1) + ">div:eq(0)").attr("class"));
					if(SOLUTION_SCAN_TYPE == 1){
						if(type == 0){//解决方案组
							$("#" + "solutions1_item" +(i+1) + ">div:eq(0)").addClass("list_folder_s");
							//展开状态
							$("#working").css("left",solution_space_width+"px");
							var clientWidth = document.documentElement.clientWidth;
							$("#working").css("width",(clientWidth-solution_space_width)+"px");
							$("#control").removeClass($("#control").attr("class"));
							$("#control").addClass("control_p");
							
//							$("#" + "solutions1_item" +(i+1)).click();
						}
						else if(type == 1){//解决方案
							$("#" + "solutions1_item" +(i+1) + ">div:eq(0)").addClass("list_file_s");
							$("#" + "solutions1_item" +(i+1)).click();
						}
					}else if(SOLUTION_SCAN_TYPE == 2){
						if(type == 0){//解决方案组
							$("#" + "solutions1_item" +(i+1) + ">div:eq(0)").addClass("wz-solution-list-item-img").addClass("wz-solution-list-item-drawer-f");
							//展开状态
							$("#working").css("left",solution_space_width+"px");
							var clientWidth = document.documentElement.clientWidth;
							$("#working").css("width",(clientWidth-solution_space_width)+"px");
							$("#control").removeClass($("#control").attr("class"));
							$("#control").addClass("control_p");
							
//							$("#" + "solutions1_item" +(i+1)).click();
						}
						else if(type == 1){//解决方案
							$("#" + "solutions1_item" +(i+1) + " .wz-solution-list-item-img").addClass(wz_solution_pic_f($("#" + "solutions1_item" +(i+1) + " .wz-solution-list-item-text").attr("defaultValue")));
							$("#" + "solutions1_item" +(i+1) + " .wz-solution-list-item-text").removeClass("wz-solution-list-item-text-n");
							$("#" + "solutions1_item" +(i+1) + " .wz-solution-list-item-text").addClass("wz-solution-list-item-text-f");
							$("#" + "solutions1_item" +(i+1)).click();
						}
					}
										
					//改变selectedSolutionData中的数据，存储选中项
					selectedSolutionData.put("solutions_groups1","solutions1_item" +(i+1));
				}
								
				$("#solutions1_item" +(i+1)).attr("group_item_index",i+1);
			}						
			if(tmpSolution.length == 0 || !selectedSolutionData.get("solutions_groups1")){//进入时解决方案为空或者没有选中的解决方案时，展开左侧
				$("#working").css("left",solution_space_width+"px");
				var clientWidth = document.documentElement.clientWidth;
				$("#working").css("width",(clientWidth-solution_space_width)+"px");
				$("#control").removeClass($("#control").attr("class"));
				$("#control").addClass("control_p");
			}
		},
		addSolution: function(model){//增加解决方案(组)
			var id = model.get("id");
			var name = model.get("name");
			var parentId = model.get("parentId");
			var pfId = model.get("pfId");
			var parentViewId = model.get("parentViewId");
			var number = model.get("number");
			var type = model.get("type");
			var describe = model.get("describe");
			var solutionsGroupsId = $("#" + parentViewId).parent().attr("id");
			var contextView = this;
//			var userId = model.get("userId");
			var pfUrl = model.get("url");
			var isSubType = model.get("isSubType");
			if (!pfUrl) {
				pfUrl = "";
			}
			if (LEFT_MENU_TYPE == 2) {//2层菜单
				solutionInfo.put(id, {pfId:pfId,name:name,type:type,isSubType:isSubType,describe:describe});//存储解决方案信息
				if(type == 0){//增加解决方案组
					solutionGroupInfo.put(pfId, {divId:id,pfId:pfId,name:name,type:type,isSubType:isSubType,number:number});//存储解决方案组信息,为了新增第二级解决方案的时候选择用
					if (isSubType == "true") {//子目录,新增的为第二级目录
						$("#" + parentViewId).append("<div pfId='" + pfId + "' id=" + id + " url='" + pfUrl + "' class='solution_list_subitem_n solution_list_group'></div>");
						$("#" + parentViewId).append('<div id="' + id + '_content"></div>');
						$("#" + id).append('<div class="list_folder_n" style="display:none;"></div>'+
								'<span class="sub_solution_list_item_text">' + name + '</span><div class="arrow_left"></div><div class="tools_rename"></div>');
					}
					else {
						$("#" + parentViewId).append("<div pfId='" + pfId + "' id=" + id + " url='" + pfUrl + "' class='solution_list_item_n solution_list_group'></div>");
						$("#" + parentViewId).append('<div id="' + id + '_content"></div>');
						$("#" + id).append('<div class="' + getSolutionPicNormal(name, 0) + '"></div>'+
								'<span class="solution_list_item_text">' + name + '</span><div class="arrow_left"></div><div class="tools_rename"></div>');
					}
				}
				else if(type == 1){//增加解决方案
					if (isSubType == "true") {//子目录
						$("#" + parentViewId).append("<div pfId='" + pfId + "' id=" + id + " url='" + pfUrl + "' class='solution_list_subitem_n solution_list_single'></div>");
						$("#" + id).append('<div class="list_file_n" style="display:none;"></div>'+
								'<span class="sub_solution_list_item_text">' + name + '</span><div class="tools_delete"></div><div class="tools_rename"></div>');
					}
					else {
						$("#" + parentViewId).append("<div pfId='" + pfId + "' id=" + id + " url='" + pfUrl + "' class='solution_list_item_n solution_list_single'></div>");
						$("#" + id).append('<div class="' + getSolutionPicNormal(name, 1) + '"></div>'+
								'<span class="solution_list_item_text">' + name + '</span><div class="tools_delete"></div><div class="tools_rename"></div>');
					}
					$("#" + id).children(".tools_delete").hide();
				}
				limit(id, solutionLimit);
			}
			else if (LEFT_MENU_TYPE == 3) {//多级菜单
				if(SOLUTION_SCAN_TYPE == 1){
					if(type == 0){//增加解决方案组
						$("#" + parentViewId).append('<li id=' + id + ' class="solution_list_item_n solution_list_group"><div class="' + getSolutionPicNormal(name, 0) + '"></div>'+
								'<span class="solution_list_item_text">' + name + '</span><div class="number_marked_n"><span>' + number + '</span></div><div class="tools_rename"></div></li>');
					}
					else if(type == 1){//增加解决方案
						$("#" + parentViewId).append('<li id=' + id + ' url="' + pfUrl + '" class="solution_list_item_n solution_list_single"><div class="' + getSolutionPicNormal(name, 1) + '"></div>'+
								'<span class="solution_list_item_text">' + name + '</span><div class="tools_delete"></div><div class="tools_rename"></div></li>');
						$("#" + id).children(".tools_delete").hide();
					}
				}else if(SOLUTION_SCAN_TYPE == 2){//APP模式样式
					if(type == 0){//增加解决方案组
						$("#" + parentViewId).append('<li id=' + id + ' class="wz-solution-list-item wz-solution-list-item-n solution_list_group"><div class="wz-solution-list-item-img wz-solution-list-item-drawer-n"></div>'+
								'<span class="wz-solution-list-item-text wz-solution-list-item-text-n">' + name + '</span></li>');
					}
					else if(type == 1){//增加解决方案
						$("#" + parentViewId).append('<li id=' + id + ' url="' + pfUrl + '" class="wz-solution-list-item wz-solution-list-item-n solution_list_single"><div class="wz-solution-list-item-img '+wz_solution_pic_n(name)+'"></div>'+
								'<span class="wz-solution-list-item-text wz-solution-list-item-text-n" defaultValue="'+name+'">' + name + '</span></li>');
					}
				}
				limit(id, solutionLimit);
			}

			$("#" +id).bind("click",function(){//点击解决方案(组)
				doGC();//垃圾回收
				if (isLoading) {//如果还在加载中则不切换
					return;
				}
				
				//点击解决方案次数统计
				if (isSolutionClickCount == true) {
					var clickCountUrl = contextPath + '/setPFClickCount.do?pfId=' + pfId;
					operateServerData(clickCountUrl,solutions);
				}
				
				if (LEFT_MENU_TYPE == 2 && type == 1) {//2层菜单，并且现在点击的是解决方案
					if (selectedSolutionDivId != null && selectedSolutionDivId != id) {//判断是否前面有点击过
						//清除原先的解决方案选择
						var oldSolutionInfo = solutionInfo.get(selectedSolutionDivId);
						if (oldSolutionInfo.isSubType == "true") {//子级的解决方案
							$("#" + selectedSolutionDivId + ">div:eq(0)").removeClass($("#" + selectedSolutionDivId + ">div:eq(0)").attr("class"));
							$("#" + selectedSolutionDivId + ">div:eq(0)").addClass(getSolutionPicNormal(oldSolutionInfo.name, oldSolutionInfo.type));
							$("#" + selectedSolutionDivId).removeClass($("#" + selectedSolutionDivId).attr("class"));
							$("#" + selectedSolutionDivId).addClass("solution_list_subitem_n solution_list_single");
							var oldSelectedParentId = $("#" + selectedSolutionDivId).parent().prev().attr("id");
							var selectedParentId = $("#" + id).parent().prev().attr("id");
							if (oldSelectedParentId != selectedParentId) {//切换了，则移除父DIV的选中样式
								$("#" + oldSelectedParentId + ">div:eq(0)").removeClass($("#" + oldSelectedParentId + ">div:eq(0)").attr("class"));
								$("#" + oldSelectedParentId + ">div:eq(0)").addClass(getSolutionPicNormal(solutionInfo.get(oldSelectedParentId).name, solutionInfo.get(oldSelectedParentId).type));
								$("#" + oldSelectedParentId).removeClass($("#" + oldSelectedParentId).attr("class"));
								$("#" + oldSelectedParentId).addClass("solution_list_item_n solution_list_group");
							}
						}
						else {
							$("#" + selectedSolutionDivId + ">div:eq(0)").removeClass($("#" + selectedSolutionDivId + ">div:eq(0)").attr("class"));
							$("#" + selectedSolutionDivId + ">div:eq(0)").addClass(getSolutionPicNormal(oldSolutionInfo.name, oldSolutionInfo.type));
							$("#" + selectedSolutionDivId).removeClass($("#" + selectedSolutionId).attr("class"));
							$("#" + selectedSolutionDivId).addClass("solution_list_item_n solution_list_single");
						}
					}
				}
				else {
					//整个解决方案(组)上一次选中项的id
					var selectedSolutionId = selectedSolutionData.get(solutionsGroupsId);
					if(selectedSolutionId != null){
						//点击另一个解决方案(组)，上一次选中项要还原
						if(selectedSolutionId != id){
							var oldType = slutionTypeData.get(selectedSolutionId);//上一次选中项的类型
							if(SOLUTION_SCAN_TYPE == 1){//普通模式
								var oldPfName = "";//解决方案名字
								if($("#" + selectedSolutionId + " span").attr("title") != null && $("#" + selectedSolutionId + " span").attr("title") != ""){
									oldPfName = $("#" + selectedSolutionId).children("span").attr("title");
								}
								else{
									oldPfName = $("#" + selectedSolutionId).children("span").text();
								}
								if(oldType == 0){//解决方案组
									$("#" + selectedSolutionId + ">div:eq(0)").removeClass($("#" + selectedSolutionId + ">div:eq(0)").attr("class"));
									$("#" + selectedSolutionId + ">div:eq(0)").addClass(getSolutionPicNormal(oldPfName, 0));
									$("#" + selectedSolutionId).removeClass($("#" + selectedSolutionId).attr("class"));
									$("#" + selectedSolutionId).addClass("solution_list_item_n solution_list_group");
								}
								else if(oldType == 1){//解决方案
									$("#" + selectedSolutionId + ">div:eq(0)").removeClass($("#" + selectedSolutionId + ">div:eq(0)").attr("class"));
									$("#" + selectedSolutionId + ">div:eq(0)").addClass(getSolutionPicNormal(oldPfName, 1));
									$("#" + selectedSolutionId).removeClass($("#" + selectedSolutionId).attr("class"));
									$("#" + selectedSolutionId).addClass("solution_list_item_n solution_list_single");
								}
								
								$("#" + selectedSolutionId + ">div:eq(1)").removeClass("tools_delete_s");
								$("#" + selectedSolutionId + ">div:eq(1)").addClass("tools_delete");
								$("#" + selectedSolutionId + ">div:eq(2)").removeClass("tools_rename_s");
								$("#" + selectedSolutionId + ">div:eq(2)").addClass("tools_rename");
							}
							else if(SOLUTION_SCAN_TYPE == 2){//温州APP模式
								if(oldType == 0){
									$("#" + selectedSolutionId + " .wz-solution-list-item-img").removeClass("wz-solution-list-item-drawer-f");
									$("#" + selectedSolutionId + " .wz-solution-list-item-img").addClass("wz-solution-list-item-drawer-n");
								}else if(oldType == 1){
									$("#" + selectedSolutionId + " .wz-solution-list-item-img").removeClass(wz_solution_pic_f($("#" + selectedSolutionId + " .wz-solution-list-item-text").attr("defaultValue")));
									$("#" + selectedSolutionId + " .wz-solution-list-item-img").addClass(wz_solution_pic_n($("#" + selectedSolutionId + " .wz-solution-list-item-text").attr("defaultValue")));
								}
								$("#" + selectedSolutionId).removeClass("wz-solution-list-item-p");
								$("#" + selectedSolutionId).addClass("wz-solution-list-item-n");
								$("#" + selectedSolutionId + " .wz-solution-list-item-text").removeClass("wz-solution-list-item-text-f");
								$("#" + selectedSolutionId + " .wz-solution-list-item-text").addClass("wz-solution-list-item-text-n");
								if(type == 0){
									$("#" + id + " .wz-solution-list-item-img").removeClass("wz-solution-list-item-drawer-f");
									$("#" + id + " .wz-solution-list-item-img").addClass("wz-solution-list-item-drawer-n");
								}else if(type == 1){
									$("#" + id + " .wz-solution-list-item-img").removeClass(wz_solution_pic_f($("#" + id + " .wz-solution-list-item-text").attr("defaultValue")));
									$("#" + id + " .wz-solution-list-item-img").addClass(wz_solution_pic_n($("#" + id + " .wz-solution-list-item-text").attr("defaultValue")));
								}
								$("#" + id).removeClass("wz-solution-list-item-n");
								$("#" + id).removeClass("wz-solution-list-item-f");
								$("#" + id).addClass("wz-solution-list-item-p");
								$("#" + id + " .wz-solution-list-item-text").removeClass("wz-solution-list-item-text-n");
								$("#" + id + " .wz-solution-list-item-text").addClass("wz-solution-list-item-text-f");
							}
							selectedSolutionData.remove(solutionsGroupsId);
						}
					}
				}
				selectedSolutionData.put(solutionsGroupsId,id);
				//缓存选中项
				if(solutionSelectItemId != null && selectLabelId != null){
					$("#"+solutionSelectItemId).attr("sid", selectLabelId);
				}
				
				if(type == 0){//点击解决方案组，下钻或者展开
					isLoading = true;//设置为正在加载中
					checkSave();//保存切换前的解决方案
					
					if (LEFT_MENU_TYPE == 2) {//2层菜单,展开操作，不设置背景颜色
						var map = new HashMap();
						if(solutionData.get(pfId) == null){//第一次点击解决方案组时，从接口获取
							var url = contextPath + '/getSubPFInfo.do?pfId=' + pfId;
							if (pfId <= -2) {//说明是其他用户的解决方案点击
								url = url + "&otherUserId=" + userId;
							}
							if (needSession == true) {//需要验证session
								url += "&needSession=true";
							}
							map.put("pfId",pfId);
							map.put("contentId", id + "_content");
							$("#loading").fadeIn();//加载提示
							operateServerData(url, solutions, contextView.getSubSolutions,map, null, true);
							if (openedSolutionDivId != null && openedSolutionDivId != id) {//上一个展开的设置为闭合
								$("#" + openedSolutionDivId + "_content").height("0px");
								$("#" + openedSolutionDivId + "_content").hide();
								$("#" + openedSolutionDivId + ">div:eq(1)").removeClass($("#" + openedSolutionDivId + ">div:eq(1)").attr("class"));
								$("#" + openedSolutionDivId + ">div:eq(1)").addClass("arrow_left");
								$("#" + openedSolutionDivId + ">div:eq(2)").hide();
							}
							openedSolutionDivId = id;
							$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));
							$("#" + id + ">div:eq(1)").addClass("arrow_down");
							$("#" + id + ">div:eq(2)").hide();
						}
						else{//不是第一次点击解决方案组时
							if (!$("#" + id + "_content").is(":animated")) {//
								if ($("#" + id + "_content").height() > 0) {//展开->闭合
									$("#" + id + "_content").animate({height:0},300,function(){
										$("#" + id + "_content").hide();
										$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));
										$("#" + id + ">div:eq(1)").addClass("arrow_left");
										$("#" + id + ">div:eq(2)").hide();
									});
									openedSolutionDivId = null;
								}
								else {
									if (openedSolutionDivId != null && openedSolutionDivId != id) {//上一个展开的设置为闭合
										$("#" + openedSolutionDivId + "_content").height("0px");
										$("#" + openedSolutionDivId + "_content").hide();
										$("#" + openedSolutionDivId + ">div:eq(1)").removeClass($("#" + openedSolutionDivId + ">div:eq(1)").attr("class"));
										$("#" + openedSolutionDivId + ">div:eq(1)").addClass("arrow_left");
										$("#" + openedSolutionDivId + ">div:eq(2)").hide();
									}
									openedSolutionDivId = id;
									$("#" + id + "_content").show();
									$("#" + id + "_content").animate({height:40*$("#" + id + "_content").children().length},300,function(){
										$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));
										$("#" + id + ">div:eq(1)").addClass("arrow_down");
										$("#" + id + ">div:eq(2)").hide();
									});
								}
							}
							isLoading = false;//设置为解决方案组加载完成
						}
						if(pfId == -1){
							if(!isFromOrm){
								cdtGetUrlPermission(-1);
							}
						}
					}
					else if (LEFT_MENU_TYPE == 3) {//多层层菜单

						if(SOLUTION_SCAN_TYPE == 1){
							$("#" + id).removeClass($("#" + id).attr("class"));
							$("#" + id).addClass("solution_list_item_s solution_list_group");
							$("#" + id + ">div:eq(0)").removeClass($("#" + id + ">div:eq(0)").attr("class"));
							$("#" + id + ">div:eq(0)").addClass("list_folder_s");
						}else if(SOLUTION_SCAN_TYPE == 2){
							//wzygj
						}
						
						if($("#solutions_return").is(":hidden")){//如果返回按钮隐藏，则显示返回按钮和操作路径
							$("#solutions_return").show();
						}
						//点击解决方案组时，改变操作路径
						var titleName = "";//操作路径名称
						for(var j=0; j<$("#solutions_groups").children().length;j++){
							//前面选中的解决方案组id
							var oldSelectSolutionId = selectedSolutionData.get($("#solutions_groups").children().eq(j).attr("id"));
							if(j == 0){
								if($("#" + oldSelectSolutionId).children("span").attr("title") != null && 
										$("#" + oldSelectSolutionId).children("span").attr("title") != ""){
									titleName = $("#" + oldSelectSolutionId).children("span").attr("title");
								}
								else{
									titleName = $("#" + oldSelectSolutionId).children("span").text();
								}
								continue;
							}
							
							if($("#" + oldSelectSolutionId).children("span").attr("title") != null && 
									$("#" + oldSelectSolutionId).children("span").attr("title") != ""){
								titleName = titleName + " > " + $("#" + oldSelectSolutionId).children("span").attr("title");
							}
							else{
								titleName = titleName + " > " + $("#" + oldSelectSolutionId).children("span").text();
							}
						}

						$("#solutions_operate_title_name").children("span").text(titleName);					
						limit("solutions_operate_title_name", operateTitleLimit);
						
						//点击解决方案组时,清空右边页签
						solutionSelectItemId = "";
						cleanWorkSpace();
						var map = new HashMap();
						if(solutionData.get(pfId) == null){//第一次点击解决方案组时，从接口获取
							var url = contextPath + '/getSubPFInfo.do?pfId=' + pfId;
							if (pfId <= -2) {//说明是其他用户的解决方案点击
								url = url + "&otherUserId=" + userId;
							}
							if (needSession == true) {//需要验证session
								url += "&needSession=true";
							}
							map.put("pfId",pfId);
							$("#loading").fadeIn();//加载提示
							operateServerData(url, solutions, contextView.addSolutionsGroup,map, null, true);
						}
						else{//不是第一次点击解决方案组时，从solutionData中获取
							var tmpSolution = solutionData.get(pfId);
							contextView.addSolutionsGroup(tmpSolution,map);
						}
						if(pfId == -1){
							if(!isFromOrm){
								cdtGetUrlPermission(-1);
							}
						}
					}
				}
				else if(type == 1){//点击解决方案,加载右侧标签
					selectedSolutionDivId = id;//设置当前选择的ID
					if(solutionLabels.get(pfId) != null){
						describe = solutionLabels.get(pfId);
					}else{
						describe = model.get("describe");
					}
					if(SOLUTION_SCAN_TYPE == 1){//普通模式
						if (isSubType == "true") {//子目录
							if ($("#" + id).hasClass("solution_list_subitem_f") || $("#" + id).hasClass("solution_list_subitem_s_f")) {//鼠标移上去的时候点击
								$("#" + id).removeClass($("#" + id).attr("class"));
								$("#" + id).addClass("solution_list_subitem_s_f solution_list_single");
								var selectedParentId = $("#" + id).parent().prev().attr("id");//设置父DIV的选中样式
								$("#" + selectedParentId).removeClass($("#" + selectedParentId).attr("class"));
								$("#" + selectedParentId).addClass("solution_list_item_s solution_list_group");
								$("#" + selectedParentId + ">div:eq(0)").removeClass($("#" + selectedParentId + ">div:eq(0)").attr("class"));
								$("#" + selectedParentId + ">div:eq(0)").addClass(getSolutionPicForcus(solutionInfo.get(selectedParentId).name, solutionInfo.get(selectedParentId).type));
							}
							else {//自动点击
								$("#" + id).removeClass($("#" + id).attr("class"));
								$("#" + id).addClass("solution_list_subitem_s solution_list_single");
							}
						}
						else {
							if (LEFT_MENU_TYPE == 2) {//2层菜单
								if (openedSolutionDivId != null && openedSolutionDivId != id) {//上一个展开的设置为闭合
									$("#" + openedSolutionDivId + "_content").height("0px");
									$("#" + openedSolutionDivId + "_content").hide();
									$("#" + openedSolutionDivId + ">div:eq(1)").removeClass($("#" + openedSolutionDivId + ">div:eq(1)").attr("class"));
									$("#" + openedSolutionDivId + ">div:eq(1)").addClass("arrow_left");
									$("#" + openedSolutionDivId + ">div:eq(2)").hide();
									openedSolutionDivId = null;
								}
							}
							if ($("#" + id).hasClass("solution_list_item_f") || $("#" + id).hasClass("solution_list_item_s_f")) {//鼠标移上去的时候点击
								$("#" + id).removeClass($("#" + id).attr("class"));
								$("#" + id).addClass("solution_list_item_s_f solution_list_single");
								$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));				
								$("#" + id + ">div:eq(1)").addClass("tools_delete_s");
								$("#" + id + ">div:eq(2)").removeClass($("#" + id + ">div:eq(2)").attr("class"));				
								$("#" + id + ">div:eq(2)").addClass("tools_rename_s");
							}
							else {//自动点击
								$("#" + id).removeClass($("#" + id).attr("class"));
								$("#" + id).addClass("solution_list_item_s solution_list_single");
								$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));				
								$("#" + id + ">div:eq(1)").addClass("tools_delete_s");
								$("#" + id + ">div:eq(2)").removeClass($("#" + id + ">div:eq(2)").attr("class"));				
								$("#" + id + ">div:eq(2)").addClass("tools_rename_s");
							}
						}
						$("#" + id + ">div:eq(0)").removeClass($("#" + id + ">div:eq(0)").attr("class"));
						if (LEFT_MENU_TYPE == 2) {//2层菜单
							$("#" + id + ">div:eq(0)").addClass(getSolutionPicForcus(solutionInfo.get(id).name, solutionInfo.get(id).type));
						}
						else if (LEFT_MENU_TYPE == 3) {//多层菜单
							$("#" + id + ">div:eq(0)").addClass(getSolutionPicForcus(name, type));
						}
					}
					else if(SOLUTION_SCAN_TYPE == 2){//温州APP模式
						$("#" + id + ">div:eq(0)").removeClass($("#" + id + ">div:eq(0)").attr("class"));
						$("#" + id + ">div:eq(0)").addClass("wz-solution-list-item-img " + wz_solution_pic_f($("#" + id + " .wz-solution-list-item-text").attr("defaultValue")));
					}
					
					
					if(solutionSelectItemId != id && !$("#working").is(":animated") && !isLoading){
						isLoading = true;//设置为正在加载中
						/**读取解决方案*/
						checkSave();//保存切换前的解决方案
						/**若存在页签的长度不为零，则清空之*/
						cleanWorkSpace();
						var clientWidth = document.documentElement.clientWidth;
						function afterClickPF(){
							if(describe.length > 0 && describe instanceof Array ){
								describeJson = describe.slice(0);
							}else if(describe && !(describe instanceof Array)){
								describeJson = [describe];
							}else{
								describeJson.splice(0, describeJson.length);
							}
							var newPfUrl = $("#" + id).attr("url");
							if (newPfUrl != "") {
								//防止重命名后的修改，应该取最新的
								var newName = "";
								if($("#" + id + " span").attr("title") != null && $("#" + id + " span").attr("title") != ""){
									newName = $("#" + id).children("span").attr("title");
								}
								else{
									newName = $("#" + id).children("span").text();
								}
								newPfUrl = addCurrentUserId(newPfUrl, userId);//添加userId作为参数
								loadUrlToWorking(newPfUrl, id, newName, describeJson[0]);//直接展现URL的解决方案:describe配置信息
							}
							else {
								$("#loading").fadeIn();
								removeIframe("label0_solusion_iframe");
								$("#label0_solusion_content").remove();//清除URL方式的内容
								doGC();
								readPanels(describeJson, id);
							}
							solutionLabels.put(pfId, describeJson.slice(0));//先保存到缓存
						}
						
						if(canAnimateMenu != true){//是否自动收缩
							afterClickPF();
						}
						else{
							$("#working").animate({left:0,width:clientWidth},400,function(){
								afterClickPF();
								$("#control").removeClass($("#control").attr("class"));
								$("#control").addClass("control_n");
							});
						}
					}
					else{//点击同一个解决方案
						var clientWidth = document.documentElement.clientWidth;
						if(canAnimateMenu == true){//是否自动收缩
							$("#working").animate({left:0,width:clientWidth},400,function(){
								resizeIframe();//不重新加载内容则resize
							});
						}
					}
				}
			});
			$("#" +id).bind("mouseover",function(){//鼠标移动到解决方案(组)上，改变样式
				if (LEFT_MENU_TYPE == 2) {//2层菜单
					solutions.mouseoverTwo(id, type, pfId, isSubType);
				}
				else if (LEFT_MENU_TYPE == 3) {//多层层菜单
					if(SOLUTION_SCAN_TYPE == 1){
						solutions.mouseover(id, pfId, solutionsGroupsId);
					}else if(SOLUTION_SCAN_TYPE == 2){
						solutions.mouseoverWz(id, type, pfId, isSubType);
					}
				}
			});
			$("#" +id).bind("mouseout",function(){//鼠标移出解决方案(组)，改变样式
				if (LEFT_MENU_TYPE == 2) {//2层菜单
					solutions.mouseoutTwo(id,type,isSubType);
				}
				else if (LEFT_MENU_TYPE == 3) {//多层层菜单
					if(SOLUTION_SCAN_TYPE == 1){
						solutions.mouseout(id,solutionsGroupsId);
					}else if(SOLUTION_SCAN_TYPE == 2){
						solutions.mouseoutWz(id, type, pfId, isSubType);
					}
				}
			});
			$("#" +id).bind("mousedown",function(){//鼠标按下解决方案(组)，绑定排序方式
				if (LEFT_MENU_TYPE == 2) {//2层菜单
					
				}
				else if (LEFT_MENU_TYPE == 3) {//多层层菜单
					if(SOLUTION_SCAN_TYPE == 1){
						solutions.mousedown(id, parentId, solutions);
					}else if(SOLUTION_SCAN_TYPE == 2){
					}
				}
			});
			
			$("#" +id + ">div:eq(2)").bind("click",function(e){//点击，重命名解决方案
				var name = "";
				if($("#" + id + " span").attr("title") != null && $("#" + id + " span").attr("title") != ""){
					name = $("#" + id).children("span").attr("title");
				}
				else{
					name = $("#" + id).children("span").text();
				}
				var pfUrl = $("#" + id).attr("url");
				var map = new HashMap();
				map.put("functionType", "rename");
				if(type == 0){
					map.put("functionName", "重命名解决方案组");
					map.put("type", type);
					map.put("name", name);
					renameWinView.renameWinOpen(rename, map);
				}else if(type ==1){
					if (!solutionEditWinView) {
						solutionEditWinView = new SolutionEditWinView();
					}
					var data = {type:"edit", name:name, url:pfUrl,describe: describe};
					solutionEditWinView.solutionEditWinOpen(rename, data);
				}

				function rename(map){
					var name = map.get("name");
					var pfUrl = map.get("url");
					var describe = map.get("describe");
					if (!pfUrl) {
						pfUrl = "";
					}
					if (pfUrl != null && id == solutionSelectItemId) {//同时修改加载了的工作区的标题,及状态
						changeUrlWorkingSpaceName(name, describe);
					}
					$("#" + id ).children("span").text(name);
					limit(id,solutionLimit);
					$("#" + id).attr("url", pfUrl);
					
					var fileJsonStr = '{"pfId":"' + pfId + '","pfName":"'+ encodeURIComponent(name) + '", url:"' + pfUrl + '"}';
					var url = contextPath + '/updatePlatFormFile.do?file=' + fileJsonStr;					
					operateServerData(url, solutions, null, null, {describe: JSON.stringify(describe)});
					
					if (LEFT_MENU_TYPE == 3) {//多层层菜单
						if($("#solutions_groups").children().length != 1){
							//上个解决方案(组)页面选中的解决方案组li id
							var prevSelectedId = selectedSolutionData.get($("#solutions_groups").children().eq($("#solutions_groups").
									children().length-2).attr("id"));
							//上个解决方案(组)页面选中的解决方案组的pfId
							var prevPfId = pfIdData.get(prevSelectedId);
							//改变solutionData中存储的数据
							var prevTmpSolution = solutionData.get(prevPfId);
							for(var i=0; i<prevTmpSolution.length;i++){
								if(prevTmpSolution[i].pfId == pfId){
									prevTmpSolution[i].pfName = name;
								}
							}
						}
					}
				}
				e.stopPropagation();
			});
			$("#" +id + ">div:eq(1)").bind("click",function(e){//点击，删除
				e.stopPropagation();
				var confirmContent = $("#" + id ).children("span").attr("title");
				if(confirmContent == "" || confirmContent == null){
					confirmContent = $("#" + id ).children("span").text();
				}
				if(type == 0){
					confirmContent = "确认删除名为【"+confirmContent+"】的解决方案组?<br>删除后将无法撤销此操作!";
				}else if(type == 1){
					confirmContent = "确认删除名为【"+confirmContent+"】的解决方案?<br>删除后将无法撤销此操作!";
				}
				confirmView.confirmOpen(deleteSolution, confirmContent, e);
				
				function deleteSolution(){
															
					var url = contextPath + '/deletePlatFormDir.do?pfId=' + pfId;
					operateServerData(url, solutions);
					var deleteParent = null;
					if (LEFT_MENU_TYPE == 2) {//2级菜单
						solutionInfo.remove(id);//移除改缓存
						if(type == 0){
							solutionGroupInfo.remove(pfId);//移除改缓存
						}
						if (id == selectedSolutionDivId) {//删除的是选中的解决方案
							selectedSolutionDivId = null;//清空选中的
							if (isSubType == "true") {//删除的是子解决方案
								if ($("#" + id).next().length == 1) {//存在下一个节点
									$("#" + id).next().click();
								}
								else if ($("#" + id).prev().length == 1) {//存在上一个节点
									$("#" + id).prev().click();
								}
								else {//不存在
									//删除解决方案时,清空右边页签
									solutionSelectItemId = "";
									cleanWorkSpace();
								}
							}
							else {//根目录下删除
								deleteParent = $("#" + id).parent();//下面可以删除同时删除父节点
								if (deleteParent.next().length == 1) {//存在下一个节点
									deleteParent.next().children().first().click();
								}
								else if (deleteParent.prev().length == 1) {//存在上一个节点
									deleteParent.prev().children().first().click();
								}
								else {//不存在
									//删除解决方案时,清空右边页签
									solutionSelectItemId = "";
									cleanWorkSpace();
								}
							}
						}
						else {
							if (!(isSubType == "true")) {//删除的是根目录
								deleteParent = $("#" + id).parent();//下面可以删除同时删除父节点
							}
						}
					}
					else if (LEFT_MENU_TYPE == 3) {//多层层菜单
						//删除选中项
						if(id == selectedSolutionData.get($("#solutions_groups").children().eq($("#solutions_groups").children().length-1).attr("id"))){
							if($("#" + id).parent().children().length == 1){//只有一个解决方案(组)时,移除这个解决方案界面在selectedSolutionData中的内容
								selectedSolutionData.remove($("#solutions_groups").children().eq($("#solutions_groups").children().length-1).attr("id"));
								//删除解决方案时,清空右边页签
								solutionSelectItemId = "";
								cleanWorkSpace();
							}
							else{//有多个解决方案(组)时
								if($("#" + id).index() == 0){//删除第一项，默认选中后一项
									var nextType = slutionTypeData.get($("#" + id).next().attr("id"));
									$("#" + id).next().removeClass($("#" + id).next().attr("class"));
									if(type == 0){
										$("#" + id).next().addClass("solution_list_item_s solution_list_group");
									}else if(type == 1){
										$("#" + id).next().addClass("solution_list_item_s solution_list_single");
									}
									$("#" + id).next().children().eq(0).removeClass($("#" + id).next().children().eq(0).attr("class"));
								
									if(nextType == 0){
										$("#" + id).next().children().eq(0).addClass("list_folder_s");
									}
									else if(nextType == 1){
										$("#" + id).next().children().eq(0).addClass("list_file_s");
										$("#" + id).next().click();
									}
									
									selectedSolutionData.remove($("#solutions_groups").children().eq($("#solutions_groups").children().length-1).attr("id"));
									selectedSolutionData.put($("#solutions_groups").children().eq($("#solutions_groups").children().length-1).attr("id"),
											$("#" + id).next().attr("id"));
								}
								else{//不是删除第一项，默认选中前一项
									var prevType = slutionTypeData.get($("#" + id).prev().attr("id"));
									$("#" + id).prev().removeClass($("#" + id).next().attr("class"));
									if(type == 0){
										$("#" + id).prev().addClass("solution_list_item_s solution_list_group");
									}else if(type == 1){
										$("#" + id).prev().addClass("solution_list_item_s solution_list_single");
									}
									$("#" + id).prev().children().eq(0).removeClass($("#" + id).prev().children().eq(0).attr("class"));
								
									if(prevType == 0){
										//隐藏页签控制台
										READLOCK = 0;//若读取失败，则不保存
										if($("#div_table_label").css("display") == "block"){//标签栏只有在方案加载成功时才会出现
											$("#div_table_label").hide();
										}
										$("#" + id).prev().children().eq(0).addClass("list_folder_s");																		
									}
									else if(prevType == 1){
										$("#" + id).prev().children().eq(0).addClass("list_file_s");
										$("#" + id).prev().click();
									}								
									selectedSolutionData.remove($("#solutions_groups").children().eq($("#solutions_groups").children().length-1).attr("id"));
									selectedSolutionData.put($("#solutions_groups").children().eq($("#solutions_groups").children().length-1).attr("id"),
											$("#" + id).prev().attr("id"));
								}
							}
						}
						
						if($("#solutions_groups").children().length == 1){//解决方案界面显示第一层时
							for(var k=0; k<firSolutionData.get(0).length;k++){
								if(pfId == firSolutionData.get(0)[k].pfId){
									firSolutionData.get(0).splice(k,1);//移除firSolutionData中的相应内容
								}
							}						
						}
						else{//解决方案界面不显示第一层时
							//上一个界面选中的解决方案(组)li id
							var prevSelectedId =  selectedSolutionData.get($("#solutions_groups").children().eq($("#solutions_groups").children().length-2).attr("id"));
							$("#" + prevSelectedId + ">div:eq(1)").children("span").text(parseInt($("#" + prevSelectedId + ">div:eq(1)").children("span").text()) - 1);
							var prevPfId = pfIdData.get(prevSelectedId);
							for(var k=0; k<solutionData.get(prevPfId).length;k++){//删除上一个界面中选中解决方案组存储的内容
								if(pfId == solutionData.get(prevPfId)[k].pfId){
									solutionData.get(prevPfId).splice(k,1);
								}
							}
							if($("#solutions_groups").children().length > 3 || $("#solutions_groups").children().length == 3){
								var oldSelectedId = selectedSolutionData.get($("#solutions_groups").children().eq($("#solutions_groups").children().length-3).attr("id"));
								var oldPfId = pfIdData.get(oldSelectedId);
								for(var k=0; k<solutionData.get(oldPfId).length; k++){//改变底数第三个界面中选中解决方案组存储的内容
									if(prevPfId == solutionData.get(oldPfId)[k].pfId){
										solutionData.get(oldPfId)[k].subNumber = solutionData.get(oldPfId)[k].subNumber - 1;
									}
								}
							}
						}
					}
					
					//移除slutionTypeData中存储的内容(类型)
					slutionTypeData.remove(id);
					if(type == 0){//删除解决方案组时，移除solutionData中的内容
						solutionData.remove(pfId);
					}
					else if(type ==1){//删除解决方案时
						
					}
					$("#" +id).remove();//移除解决方案(组)li
					if (LEFT_MENU_TYPE == 2) {//2级菜单，
						if (isSubType == "true") {//删除的是子解决方案
							$("#" + parentViewId).animate({height:40*$("#" + parentViewId).children().length},300,function(){
							});
						}
						else {//删除的是根目录
							if (deleteParent) {
								deleteParent.remove();//移除父节点solutions_groupsX
							}
						}
					}
				}
			});			
		},
		addSolutionsGroup: function(result,map){//点击解决方案组下钻,默认选中第一项
			$("#loading").fadeOut();//加载提示
			var tmpSolution;
			if(result.data == null){////从本地hashMap获取数据
				tmpSolution = result;
			}
			else{//从接口获取数据
				tmpSolution = result.data;
				var pfId = map.get("pfId");
				solutionData.put(pfId, tmpSolution);
			}
						
			var index = $("#solutions_groups").children().length;
			$("#solutions_groups").children().eq(index-1).hide();
			$("#solutions_groups").append("<div id='solutions_groups" + (index+1) +  "' onselectstart='javascript:return false;'><ul id='solutions" + (index+1) + 
					"' class='solutions_groups'></ul></div>");
			
			if(tmpSolution.length == 0){
				isLoading = false;//若解决方案组下没有解决方案，则移除限制点击的效果
			}
			for(var i=0; i<tmpSolution.length; i++){
				var solutionModel = new SolutionModel({id:"solutions" + (index+1) + "_item" +(i+1),parentViewId:"solutions"+(index+1),pfId:tmpSolution[i].pfId,
					parentId:tmpSolution[i].parentId,type:tmpSolution[i].type,describe:tmpSolution[i].describe,name:tmpSolution[i].pfName, number: tmpSolution[i].subNumber,
					url:tmpSolution[i].url});
				//添加解决方案前,先清空solutions中的内容
				solutions.reset();
				solutions.add(solutionModel);
				//添加类型时，先清空slutionTypeData中的值
				slutionTypeData.remove("solutions" + (index+1) + "_item" +(i+1));								
				slutionTypeData.put("solutions" + (index+1) + "_item" +(i+1), tmpSolution[i].type);
				//添加pfId时，先清空pfIdData中的值
				pfIdData.remove("solutions" + (index+1) + "_item" +(i+1));
				pfIdData.put("solutions" + (index+1) + "_item" +(i+1), tmpSolution[i].pfId);
				
				if(i == 0){
					var type = tmpSolution[i].type;
					$("#" + "solutions" + (index+1) +"_item" +(i+1)).removeClass($("#" + "solutions" + (index+1) +"_item" +(i+1)).attr("class"));
					if(SOLUTION_SCAN_TYPE == 1){
						if(type == 0){
							$("#" + "solutions" + (index+1) +"_item" +(i+1)).addClass("solution_list_item_s solution_list_group");
						}else if(type == 1){
							$("#" + "solutions" + (index+1) +"_item" +(i+1)).addClass("solution_list_item_s solution_list_single");
						}
					}else if(SOLUTION_SCAN_TYPE == 2){
						if(type == 0){
							$("#" + "solutions" + (index+1) +"_item" +(i+1)).addClass("wz-solution-list-item wz-solution-list-item-p solution_list_group");
						}else if(type == 1){
							$("#" + "solutions" + (index+1) +"_item" +(i+1)).addClass("wz-solution-list-item wz-solution-list-item-p solution_list_single");
						}
						$("#" + "solutions" + (index+1) +"_item" +(i+1) + " .wz-solution-list-item-text").removeClass("wz-solution-list-item-text-n");
						$("#" + "solutions" + (index+1) +"_item" +(i+1) + " .wz-solution-list-item-text").addClass("wz-solution-list-item-text-f");
					}
					$("#" + "solutions" + (index+1) +"_item" +(i+1) + ">div:eq(0)").removeClass($("#" + "solutions" + (index+1) +"_item" +(i+1) 
							+ ">div:eq(0)").attr("class"));
					if(type == 0){//默认选中第一项是解决方案组时
						$("#" + "solutions" + (index+1) +"_item" +(i+1) + ">div:eq(0)").addClass("list_folder_s");
						isLoading = false;//设置为解决方案组加载完成
					}
					else if(type == 1){//默认选中第一项是解决方案时,默认点击
						$("#" + "solutions" + (index+1) +"_item" +(i+1) + ">div:eq(0)").addClass("list_file_s");
						isLoading = false;//设置为加载完成，下面开始加载第一个解决方案
						$("#" + "solutions" + (index+1) +"_item" +(i+1)).click();
						solutionSelectItemId = "solutions" + (index+1) +"_item" +(i+1);
					}
					//改变selectedSolutionData中的数据，存储选中项
					selectedSolutionData.put("solutions_groups" + (index+1),"solutions" + (index+1) +"_item" +(i+1));				
				}
				$("#solutions"+(index+1)+"_item" +(i+1)).attr("group_item_index",i+1);
			}
		},
		getSubSolutions : function(result,map){//点击解决方案组：展开
			$("#loading").fadeOut();//加载提示
			var contentId = map.get("contentId");
			var index = contentId.substring(contentId.indexOf("_title")+6);
			if(result.data == null){////从本地hashMap获取数据
				tmpSolution = result;
			}
			else{//从接口获取数据
				tmpSolution = result.data;
				var pfId = map.get("pfId");
				solutionData.put(pfId, tmpSolution);
			}
			if(tmpSolution.length == 0){//没有子解决方案
				isLoading = false;//若解决方案组下没有解决方案，则移除限制点击的效果
			}
			else {
				$("#" + contentId).animate({height:40*tmpSolution.length},300,function(){
				});
				for(var i=0; i<tmpSolution.length; i++){//循环添加
					var solutionModel = new SolutionModel({id:"solutions" + index + "_item_title" +(i+1),parentViewId:contentId,pfId:tmpSolution[i].pfId,userId:tmpSolution[i].userId,
						parentId:tmpSolution[i].parentId,type:tmpSolution[i].type,describe:tmpSolution[i].describe,name:tmpSolution[i].pfName, number: tmpSolution[i].subNumber,
						url:tmpSolution[i].url,isSubType:"true"});
					solutions.add(solutionModel);
				}
				isLoading = false;//设置为解决方案组加载完成
			}
		}
	});
});