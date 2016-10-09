/**
 * 主界面的Collection集合
 * @author songd
 * @date 2013-04-03
 */
$(function(){
	/**
	 * 标签Collection
	 */
	Labels = Backbone.Collection.extend({
		model: LabelModel,
		initialize: function(models, options){
			this.bind("add",function(model){				
				var id = "label"+i;
				var name = model.get("name");
				var labelInputId = model.get("labelInputId");
				var cell = document.getElementById("table_label").rows[0].insertCell(index);
				cell.innerHTML = "<td><div id=" + "label" + i + " class='labels_n'><span id='" +id+ "_name_span' class='labels_name_span'>" + name + "</span><img class='label_close' src='" + contextPath + "/images/tabs/tab-close-n.png'>" +
				    "<img class='label_setting' src='" + contextPath + "/images/tabs/tab-setting-n.png'>" +//设置按钮
					"<input id=" + labelInputId + " onkeypress='return ValidateSpecialCharacter();' class='label_input'></div></td>";
				$("#"+"label" + i).parent("td").addClass("tablelabel-list");
					
				limit(id,12);
				
				if ( model.get("chageTabType")) {//设置属性
					$("#"+id + "_name_span").attr("chageTabType", model.get("chageTabType"));
				}
				if (model.get("paramValue")) {
					$("#"+id + "_name_span").attr("paramValue", model.get("paramValue"));
				}
				
				if($("#table_label tr td").size() == 4){//只有一个标签时,即默认的第一个标签
					$("#" + id).removeClass("labels_n");
					$("#" + id).addClass("labels_s");
					selectLabelId = id;
					$("#" + id).attr("zindex",maxZIndex);
					$("#" + id).css("z-index",maxZIndex);
				}
				else{
					var min=0;
					var zIndex;
					for(var j=0;j<$("#table_label tr").children().length-4;j++){
						zIndex = $("#table_label tr").children().eq(j+1).children().attr("zindex");
						if(j ==0){
							min = zIndex;
							
							continue;
						}
						if(min > zIndex){
							min = zIndex;
						}
					}
					$("#" + id).attr("zindex",(min-1));
					$("#" + id).css("z-index",(min-1));
				}
				$("#" + id).children().bind("mouseover",function(){
					if(isFromOrm){
						if(!ORMPermissionWorking('LABELDELETE')){
							options.view.label_mouseover(model);
						}
					}
					else if(isFromOutOm){
						if(!checkOutOmPermissionWorking('LABELDELETE')){
							options.view.label_mouseover(model);
						}
					}
					else{
						if(!cdtPermissionWorking('CDT-04', 1)){
							options.view.label_mouseover(model);
						}
					}
				});
				$("#" + id).children().bind("mouseout",function(){
					options.view.label_mouseout(model);
				});
				$("#" + id).children("span").bind("mousedown",function(){
					options.view.label_click(model);
				});
				$("#" + id).children("span").bind("dblclick",function(){
					if(isFromOrm){
						if(!ORMPermissionWorking('LABELCHANGE')){
							options.view.label_dblclick(model);
						}
					}
					if(isFromOutOm){
						if(!checkOutOmPermissionWorking('LABELCHANGE')){
							options.view.label_dblclick(model);
						}
					}
					else{
						if(!cdtPermissionWorking('CDT-04', 2)){
							options.view.label_dblclick(model);
						}
					}
				});		
				$($("#" + id).children(".label_close")).bind("click",function(e){
					options.view.closeLabel(model, e);
				});
				$($("#" + id).children(".label_close")).bind("mouseover",function(){
					options.view.closeLabel_mouseover(model,this);
				});
				$($("#" + id).children(".label_close")).bind("mouseout",function(){
					options.view.closeLabel_mouseout(model,this);
				});
				$($("#" + id).children(".label_setting")).bind("click",function(e){
					options.view.showLabelSetting(model, e);
				});
				$($("#" + id).children(".label_setting")).bind("mouseover",function(){
					options.view.settingLabel_mouseover(model,this);
				});
				$($("#" + id).children(".label_setting")).bind("mouseout",function(){
					options.view.settingLabel_mouseout(model,this);
				});
			});
		}
	});
	
	ComponentApps = Backbone.Collection.extend({
		model: ComponentModel,
		initialize: function(models, options){
			this.bind("add", function(model){
				options.view.addOneComponent(model);
			});
		}
	});
	
	ComponentTitles = Backbone.Collection.extend({
		model: ComponentModel,
		initialize: function(models, options){
			this.bind("add", function(model){
				options.view.addOneSubComponent(model);
			});
		}
	});
		
	Solutions = Backbone.Collection.extend({
		model: SolutionModel,
		initialize: function(models, options){
			this.bind("add", function(model){
				options.view.addSolution(model);
			});
		},
		mouseover: function(id, pfId, solutionsGroupsId){
			//设置权限
			var type = slutionTypeData.get(id);//类型
			var selectedSolutionId = selectedSolutionData.get(solutionsGroupsId);
			
			if(type == 0){//鼠标移动到解决方案组上
				if (id == selectedSolutionId){//移入选中项
					$("#" + id).removeClass($("#" + id).attr("class"));
					$("#" + id).addClass("solution_list_item_s_f solution_list_group");
				}
				else {
					$("#" + id).removeClass($("#" + id).attr("class"));
					$("#" + id).addClass("solution_list_item_f solution_list_group");
				}
				$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));				
				$("#" + id + ">div:eq(1)").addClass("tools_delete");
				$("#" + id + ">div:eq(1)").children("span").hide();
				$("#" + id + ">div:eq(2)").show();
				if(isFromOrm){
					if(ORMPermissionWorking('SOLUTIONDELETE') || pfId <= -1){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(ORMPermissionWorking('SOLUTIONCHANGE') || pfId <= -1){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
				else if(isFromOutOm){
					if(checkOutOmPermissionWorking('SOLUTIONDELETE') || pfId <= -1){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(checkOutOmPermissionWorking('SOLUTIONCHANGE') || pfId <= -1){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
				else{
					if(cdtPermissionWorking('CDT-02', 1) || pfId <= -1){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(cdtPermissionWorking('CDT-02', 2) || pfId <= -1){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
			}
			else if(type == 1){//鼠标移动到解决方案上
				if(id == selectedSolutionId){//移入选中项
					$("#" + id).removeClass($("#" + id).attr("class"));
					$("#" + id).addClass("solution_list_item_s_f solution_list_single");
				}
				else {
					$("#" + id).removeClass($("#" + id).attr("class"));
					$("#" + id).addClass("solution_list_item_f solution_list_single");
				}
				$("#" + id + ">div:eq(1)").show();
				$("#" + id + ">div:eq(2)").show();
				if(isFromOrm){
					if(ORMPermissionWorking('SOLUTIONDELETE')){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(ORMPermissionWorking('SOLUTIONCHANGE')){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
				else if(isFromOutOm){
					if(checkOutOmPermissionWorking('SOLUTIONDELETE')){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(checkOutOmPermissionWorking('SOLUTIONCHANGE')){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
				else{
					if(cdtPermissionWorking('CDT-02', 1)){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(cdtPermissionWorking('CDT-02', 2)){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
			}									
		},
		mouseoverTwo: function(id, type, pfId, isSubType){//2层结构
			if(type == 0){//鼠标移动到解决方案组上
				if (isSubType == "true") {//子目录
					if ($("#" + id).hasClass("solution_list_subitem_s") || $("#" + id).hasClass("solution_list_subitem_s_f")){//移入选中项
						$("#" + id).removeClass($("#" + id).attr("class"));
						$("#" + id).addClass("solution_list_subitem_s_f solution_list_group");
					}
					else {
						$("#" + id).removeClass($("#" + id).attr("class"));
						$("#" + id).addClass("solution_list_subitem_f solution_list_group");
					}
				}
				else {//第一层目录
					if ($("#" + id).hasClass("solution_list_item_s") || $("#" + id).hasClass("solution_list_item_s_f")){//移入选中项
						$("#" + id).removeClass($("#" + id).attr("class"));
						$("#" + id).addClass("solution_list_item_s_f solution_list_group");
						$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));				
						$("#" + id + ">div:eq(1)").addClass("tools_delete_s");
						$("#" + id + ">div:eq(2)").removeClass($("#" + id + ">div:eq(2)").attr("class"));				
						$("#" + id + ">div:eq(2)").addClass("tools_rename_s");
						$("#" + id + ">div:eq(2)").show();
					}
					else {
						$("#" + id).removeClass($("#" + id).attr("class"));
						$("#" + id).addClass("solution_list_item_f solution_list_group");
						$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));				
						$("#" + id + ">div:eq(1)").addClass("tools_delete");
						$("#" + id + ">div:eq(2)").removeClass($("#" + id + ">div:eq(2)").attr("class"));				
						$("#" + id + ">div:eq(2)").addClass("tools_rename");
						$("#" + id + ">div:eq(2)").show();
					}
				}
				if(isFromOrm){
					if(ORMPermissionWorking('SOLUTIONDELETE') || pfId <= -1){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(ORMPermissionWorking('SOLUTIONCHANGE') || pfId <= -1){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
				else if(isFromOutOm){
					if(checkOutOmPermissionWorking('SOLUTIONDELETE') || pfId <= -1){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(checkOutOmPermissionWorking('SOLUTIONCHANGE') || pfId <= -1){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
				else{
					if(cdtPermissionWorking('CDT-02', 1) || pfId <= -1){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(cdtPermissionWorking('CDT-02', 2) || pfId <= -1){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
			}
			else if(type == 1){//鼠标移动到解决方案上
				if (isSubType == "true") {//子目录
					if($("#" + id).hasClass("solution_list_subitem_s") || $("#" + id).hasClass("solution_list_subitem_s_f")){//移入选中项
						$("#" + id).removeClass($("#" + id).attr("class"));
						$("#" + id).addClass("solution_list_subitem_s_f solution_list_single");
						$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));				
						$("#" + id + ">div:eq(1)").addClass("tools_delete");
						$("#" + id + ">div:eq(2)").removeClass($("#" + id + ">div:eq(2)").attr("class"));				
						$("#" + id + ">div:eq(2)").addClass("tools_rename");
					}
					else {
						$("#" + id).removeClass($("#" + id).attr("class"));
						$("#" + id).addClass("solution_list_subitem_f solution_list_single");
						$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));				
						$("#" + id + ">div:eq(1)").addClass("tools_delete");
						$("#" + id + ">div:eq(2)").removeClass($("#" + id + ">div:eq(2)").attr("class"));				
						$("#" + id + ">div:eq(2)").addClass("tools_rename");
					}
				}
				else {
					if($("#" + id).hasClass("solution_list_item_s") || $("#" + id).hasClass("solution_list_item_s_f")){//移入选中项
						$("#" + id).removeClass($("#" + id).attr("class"));
						$("#" + id).addClass("solution_list_item_s_f solution_list_single");
						$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));				
						$("#" + id + ">div:eq(1)").addClass("tools_delete_s");
						$("#" + id + ">div:eq(2)").removeClass($("#" + id + ">div:eq(2)").attr("class"));				
						$("#" + id + ">div:eq(2)").addClass("tools_rename_s");
					}
					else {
						$("#" + id).removeClass($("#" + id).attr("class"));
						$("#" + id).addClass("solution_list_item_f solution_list_single");
						$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));				
						$("#" + id + ">div:eq(1)").addClass("tools_delete");
						$("#" + id + ">div:eq(2)").removeClass($("#" + id + ">div:eq(2)").attr("class"));				
						$("#" + id + ">div:eq(2)").addClass("tools_rename");
					}
				}
				
				$("#" + id + ">div:eq(1)").show();
				$("#" + id + ">div:eq(2)").show();
				if(isFromOrm){
					if(ORMPermissionWorking('SOLUTIONDELETE')){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(ORMPermissionWorking('SOLUTIONCHANGE')){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
				else if(isFromOutOm){
					if(checkOutOmPermissionWorking('SOLUTIONDELETE')){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(checkOutOmPermissionWorking('SOLUTIONCHANGE')){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
				else{
					if(cdtPermissionWorking('CDT-02', 1)){
						$("#" + id + ">div:eq(1)").hide();
					}
					if(cdtPermissionWorking('CDT-02', 2)){
						$("#" + id + ">div:eq(2)").hide();
					}
				}
			}									
		},
		mouseoverWz: function(id, pfId, solutionsGroupsId){
			//设置权限
			var type = slutionTypeData.get(id);//类型
			var selectedSolutionId = selectedSolutionData.get(solutionsGroupsId);
			if($("#" + id).attr("class").indexOf("wz-solution-list-item-p") == -1){
				if(type == 0){
					$("#" + id + " .wz-solution-list-item-img").removeClass("wz-solution-list-item-drawer-n");
					$("#" + id + " .wz-solution-list-item-img").addClass("wz-solution-list-item-drawer-f");
				}else if(type == 1){
					$("#" + id + " .wz-solution-list-item-img").removeClass(wz_solution_pic_n($("#" + id + " .wz-solution-list-item-text").attr("defaultValue")));
					$("#" + id + " .wz-solution-list-item-img").addClass(wz_solution_pic_f($("#" + id + " .wz-solution-list-item-text").attr("defaultValue")));
				}
				$("#" + id + " .wz-solution-list-item-text").removeClass("wz-solution-list-item-text-n");
				$("#" + id + " .wz-solution-list-item-text").addClass("wz-solution-list-item-text-f");
				$("#" + id).removeClass("wz-solution-list-item-n");
				$("#" + id).addClass("wz-solution-list-item-f");
			}
		},
		mouseout: function(id,solutionsGroupsId){
			$("#" + id).removeClass($("#" + id).attr("class"));
			var selectedSolutionId = selectedSolutionData.get(solutionsGroupsId);
			var type = slutionTypeData.get(id);//类型
			if(id == selectedSolutionId){//移出选中项
				if(type == 0){
					//$("#" + id + ">div:eq(0)").removeClass($("#" + id + ">div:eq(0)").attr("class"));
					//$("#" + id + ">div:eq(0)").addClass("list_folder_s");
					$("#" + id).addClass("solution_list_item_s solution_list_group");
				}
				else if(type == 1){
					//$("#" + id + ">div:eq(0)").removeClass($("#" + id + ">div:eq(0)").attr("class"));
					//$("#" + id + ">div:eq(0)").addClass("list_file_s");
					$("#" + id).addClass("solution_list_item_s solution_list_single");
				}								
			}
			else{
				if(type == 0){
					$("#" + id).addClass("solution_list_item_n solution_list_group");
				}else if(type == 1){
					$("#" + id).addClass("solution_list_item_n solution_list_single");
				}
			}
			if(type == 0){//鼠标移出解决方案组
				$("#" + id + ">div:eq(1)").show();
				$("#" + id + ">div:eq(2)").hide();
				$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));
				$("#" + id + ">div:eq(1)").children("span").show();
				$("#" + id + ">div:eq(1)").addClass("number_marked_n");
			}
			else if(type == 1){//鼠标移出解决方案
				$("#" + id + ">div:eq(1)").hide();
				$("#" + id + ">div:eq(2)").hide();
			}											
		},
		mouseoutTwo: function(id, type,isSubType){
			if (isSubType == "true") {//子目录
				if($("#" + id).hasClass("solution_list_subitem_s_f")){//移出选中项
					$("#" + id).removeClass($("#" + id).attr("class"));
					if(type == 0){
						//$("#" + id + ">div:eq(0)").removeClass($("#" + id + ">div:eq(0)").attr("class"));
						//$("#" + id + ">div:eq(0)").addClass("list_folder_s");
						$("#" + id).addClass("solution_list_subitem_s solution_list_group");
					}
					else if(type == 1){
						//$("#" + id + ">div:eq(0)").removeClass($("#" + id + ">div:eq(0)").attr("class"));
						//$("#" + id + ">div:eq(0)").addClass("list_file_s");
						$("#" + id).addClass("solution_list_subitem_s solution_list_single");
					}								
				}
				else{
					$("#" + id).removeClass($("#" + id).attr("class"));
					if(type == 0){
						$("#" + id).addClass("solution_list_subitem_n solution_list_group");
					}
					else if(type == 1){
						$("#" + id).addClass("solution_list_subitem_n solution_list_single");
					}
				}
			}
			else {
				if($("#" + id).hasClass("solution_list_item_s_f")){//移出选中项
					$("#" + id).removeClass($("#" + id).attr("class"));
					if(type == 0){
						//$("#" + id + ">div:eq(0)").removeClass($("#" + id + ">div:eq(0)").attr("class"));
						//$("#" + id + ">div:eq(0)").addClass("list_folder_s");
						$("#" + id).addClass("solution_list_item_s solution_list_group");
					}
					else if(type == 1){
						//$("#" + id + ">div:eq(0)").removeClass($("#" + id + ">div:eq(0)").attr("class"));
						//$("#" + id + ">div:eq(0)").addClass("list_file_s");
						$("#" + id).addClass("solution_list_item_s solution_list_single");
					}								
				}
				else{
					$("#" + id).removeClass($("#" + id).attr("class"));
					if(type == 0){
						$("#" + id).addClass("solution_list_item_n solution_list_group");
					}
					else if(type == 1){
						$("#" + id).addClass("solution_list_item_n solution_list_single");
					}
				}
			}
			if(type == 0){//鼠标移出解决方案组
				$("#" + id + ">div:eq(2)").hide();
				$("#" + id + ">div:eq(1)").removeClass($("#" + id + ">div:eq(1)").attr("class"));
				//$("#" + id + ">div:eq(1)").children("span").show();
				if ($("#" + id + "_content").height() > 0) {
					$("#" + id + ">div:eq(1)").addClass("arrow_down");
				}
				else {
					$("#" + id + ">div:eq(1)").addClass("arrow_left");
				}
				$("#" + id + ">div:eq(1)").show();
			}
			else if(type == 1){//鼠标移出解决方案
				$("#" + id + ">div:eq(1)").hide();
				$("#" + id + ">div:eq(2)").hide();
			}
		},
		mouseoutWz: function(id, pfId, solutionsGroupsId){
			var type = slutionTypeData.get(id);//类型
			if($("#" + id).attr("class").indexOf("wz-solution-list-item-p") == -1){
				if(type == 0){
					$("#" + id + " .wz-solution-list-item-img").removeClass("wz-solution-list-item-drawer-f");
					$("#" + id + " .wz-solution-list-item-img").addClass("wz-solution-list-item-drawer-n");
				}else if(type == 1){
					$("#" + id + " .wz-solution-list-item-img").removeClass(wz_solution_pic_f($("#" + id + " .wz-solution-list-item-text").attr("defaultValue")));
					$("#" + id + " .wz-solution-list-item-img").addClass(wz_solution_pic_n($("#" + id + " .wz-solution-list-item-text").attr("defaultValue")));
				}
				$("#" + id + " .wz-solution-list-item-text").removeClass("wz-solution-list-item-text-f");
				$("#" + id + " .wz-solution-list-item-text").addClass("wz-solution-list-item-text-n");
				$("#" + id).removeClass("wz-solution-list-item-f");
				$("#" + id).addClass("wz-solution-list-item-n");
			}
		},
		mousedown: function(id, parentId, solutions){

			var itemCls = $('#' + id).attr('class');
			var sortableUl = $('#' + id).parent('ul').attr('id');
			var sortableData;
			var groupNum = 0;
			var JsonString = '';
			
			if(parentId == 0){
				sortableData = firSolutionData.get(parentId);
			}else{
				sortableData = solutionData.get(parentId);
			}
			for(var k=0; k<sortableData.length; k++){
				if(sortableData[k].type == 0){
					groupNum++;
				}else{
					break;
				}
			}
			if(isFromOrm){
				if(!ORMPermissionWorking('SORT')){
					sortable();
				}
			}
			else if(isFromOutOm){
				if(!checkOutOmPermissionWorking('SORT')){
					sortable();
				}
			}
			else{
				if(!cdtPermissionWorking("CDT-08", 3)){
					sortable();
				}
			}
			function sortable(){
				$("#"+sortableUl).sortable({
					axis: 'y',
					items: 'li',
					revert: true,
					scroll: false,
					helper: 'clone',
					tolerance: 'pointer',
					containment: $("#solutions_groups"),
					placeholder: 'solution_list_item_n',
	//				items: '.solution_list_group',
					forcePlaceholderSize: true,
					start: sortStart,
					update: sortUpdate
				});
			}
			function sortStart(event, ui){
				for(var k=0; k<$("#" + sortableUl).children('li').length; k++){
					if(id == $("#" + sortableUl).children('li').eq(k).attr('id')){
						labelSort[2] = k;
						break;
					}
				}
			}
			function sortUpdate(event, ui){
				for(var k=0; k<$("#" + sortableUl).children('li').length; k++){
					if(id == $("#" + sortableUl).children('li').eq(k).attr('id')){
						labelSort[3] = k;
						break;
					}
				}
				
				if(labelSort[2] < labelSort[3]){
					
					for(var k=labelSort[2]; k<=labelSort[3]; k++){
						if(k == labelSort[2]){
							addJsonString(sortableData[labelSort[2]].pfId, sortableData[labelSort[3]].orderBy, 0);
						}else{
							addJsonString(sortableData[k].pfId, sortableData[k-1].orderBy, 1);
						}
					}
					
					var index = new Array();
					for(var k=labelSort[2]; k<=labelSort[3]; k++){
						if(k == labelSort[2]){
							index[k] = sortableData[k].orderBy;
							sortableData[k].orderBy = sortableData[labelSort[3]].orderBy;
						}else{
							index[k] = sortableData[k].orderBy;
							sortableData[k].orderBy = index[k-1];
						}
					}
					
					var sortableDataStore = sortableData[labelSort[2]];
					sortableData.splice(labelSort[2], 1);
					sortableData.splice(labelSort[3], 0, sortableDataStore);
					var url = contextPath + '/cdtPlatFormSort.do?file=['+JsonString+']';
					operateServerData(url, solutions);
					
				}else if(labelSort[2] > labelSort[3]){
					
					for(var k=labelSort[3]; k<=labelSort[2]; k++){
						if(k == labelSort[3]){
							addJsonString(sortableData[k].pfId, sortableData[k+1].orderBy, 0);
						}else if(k == labelSort[2]){
							addJsonString(sortableData[labelSort[2]].pfId, sortableData[labelSort[3]].orderBy, 1);
						}else{
							addJsonString(sortableData[k].pfId, sortableData[k+1].orderBy, 1);
						}
					}
					
					var index = 0;
					for(var k=labelSort[3]; k<=labelSort[2]; k++){
						if(k == labelSort[3]){
							index = sortableData[k].orderBy;
							sortableData[k].orderBy = sortableData[k+1].orderBy;
						}else if(k == labelSort[2]){
							sortableData[k].orderBy = index;
						}else{
							sortableData[k].orderBy = sortableData[k+1].orderBy;
						}
					}
					
					var sortableDataStore = sortableData[labelSort[2]];
					sortableData.splice(labelSort[2], 1);
					sortableData.splice(labelSort[3], 0, sortableDataStore);
					var url = contextPath + '/cdtPlatFormSort.do?file=['+JsonString+']';
					operateServerData(url, solutions);
				}
			}
			function addJsonString(pfId, orderBy, num){
				if(num == 0){
					JsonString += '{"pfId":'+pfId+',"orderBy":'+orderBy+'}';
				}else{
					JsonString += ',{"pfId":'+pfId+',"orderBy":'+orderBy+'}';
				}
			}

			if(isFromOrm){
				if(!ORMPermissionWorking('SORT')){//有解决方案排序权限
					sortWorking();
				}
			}
			else if(isFromOutOm){
				if(!checkOutOmPermissionWorking('SORT')){//有解决方案排序权限
					sortWorking();
				}
			}
			else{
				if(!cdtPermissionWorking("CDT-08", 3)){//有解决方案排序权限
					sortWorking();
				}
			}
			function sortWorking(){
				if(itemCls == 'solution_list_item_f solution_list_group'){
					$('#solutions1').sortable('option', 'items', '.solution_list_group');
				}else if(itemCls == 'solution_list_item_f solution_list_single'){
					$('#solutions1').sortable('option', 'items', '.solution_list_single');
				}else{
				}
			}
		}
	});
	
	
	/**
	 * 用户的Collections
	 */
	Users = Backbone.Collection.extend({
		model:UserModel,
		initialize : function(models, options) {
			this.bind("add", this.addModels);
		},
		addModels : function (model) {
		}
	});
});