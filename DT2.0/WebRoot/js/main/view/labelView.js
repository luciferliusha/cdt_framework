/**
 * 标签view
 */
$(function(){
	LabelView = Backbone.View.extend({
		el: $("#div_table_label"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var labelTemplate = _.template($("#label_template").html());			
			$(this.el).html(labelTemplate);
			this.labels = new Labels(null, { view : this });									
			var context = this;		
			$("#top").resize(function(){//窗口大小改变
				context.label_resize();
			});
		},
		events: {
			"click #add_page": "addPage",
			"click #label_turn_up": "turnUp",
			"click #label_turn_down": "turnDown"
		},
		addPage: function(id,name,chageTabType,paramValue){
			if(id != null && name != null){//构件组和解决方案切换
				var labelModel = new LabelModel({id: id,name: name,labelContentId: id+"_content",labelInputId: id+"_input"});
				if (chageTabType) {
					labelModel.set({chageTabType:chageTabType});
				}
				if (paramValue) {
					labelModel.set({paramValue:paramValue});
				}
				this.labels.add(labelModel);
			}
			else{//点击新增标签
				var labelModel = new LabelModel({id: "label" + i,name: "新建标签页"+i,labelContentId:"label" + i+"_content",labelInputId:"label" + i+"_input"});
				this.labels.add(labelModel);
				var json_add = JSON2.parse('{"title":"新建标签页'+i+'","panels":[]}');
				describeJson.push(json_add);
				isChanged = true;
				
				//添加页签保存
				WorkingspaceSave(SELECT_LABEL);
				
//				var workingView = new WorkingView({el: $("#working")});
				workingView.addView("label" + i+"_content","");
				$("#"+"label" + i+"_content").height($("#working").height()-10);
				
				$("#" + selectLabelId).removeClass("labels_s");
				$("#" + selectLabelId).addClass("labels_n");
				$("#" + selectLabelContentId).hide();
				$("#" + selectLabelId).css("z-index",$("#" + selectLabelId).attr("zindex"));
				var lastSelectLabelId = selectLabelId;
				
				selectLabelId = "label" + i;
				$("#" + selectLabelId).css("z-index",999);
				selectLabelContentId = "label" + i+"_content";
				$("#" + selectLabelId).removeClass("labels_n");
				$("#" + selectLabelId).addClass("labels_s");
				$("#" + selectLabelContentId).show();
				selectLabelChangeType = "1";//新增设置默认1
								
				if(document.documentMode == 10){//解决ie10下页签显示bug
					var lastLabelModel = this.labels.get(lastSelectLabelId);
					this.label_mouseover(lastLabelModel);
					this.label_mouseout(lastLabelModel);
					
					this.label_mouseover(labelModel);
					this.label_mouseout(labelModel);
				}
				
				var div_panels_c = document.getElementById(selectLabelId+"_content").getElementsByTagName("iframe");
				panels = div_panels_c.length;
			}

			var clientWidth = document.documentElement.clientWidth;
			var showLabels = parseInt((clientWidth-529)/137);//可以显示的页签个数

			if(index > showLabels){//页签个数过多
				if($("#label_turn_up").attr("class") == "turn_up_d"){
					$("#label_turn_up").removeClass("turn_up_d");
					$("#label_turn_up").addClass("turn_up_n");
					$("#label_turn_up").attr("title","向后滚动标签页");
				}

				if($("#label_turn_down").attr("class") == "turn_down_n"){//当有右边有多个页签隐藏时
					var hideLabels = index-showLastLabel-1;//右边隐藏页签个数
					if(hideLabels >= showLabels){
						for(var j = 0;j < showLabels;j++){
							$("#table_label tr").each(function(){$("td:eq(" + (showFirstLabel + j) + ")",this).hide();});
							$("#table_label tr").each(function(){$("td:eq(" + (index - j) + ")",this).show();});
						}
						showFirstLabel = index - showLabels + 1;
						showLastLabel = index;						
					}
					else{
						for(var j = 0;j <= hideLabels;j++){
							$("#table_label tr").each(function(){$("td:eq(" + (showFirstLabel + j) + ")",this).hide();});
							$("#table_label tr").each(function(){$("td:eq(" + (showLastLabel + j) + ")",this).show();});
						}
						showFirstLabel += hideLabels + 1;
						showLastLabel += hideLabels + 1;
					}					
					$("#label_turn_down").removeClass("turn_down_n");
					$("#label_turn_down").addClass("turn_down_d");
					$("#label_turn_down").attr("title","");
				}
				else{
					$("#table_label tr").each(function(){$("td:eq(" + (index - showLabels) + ")",this).hide();});
					showFirstLabel = index - showLabels + 1;
					showLastLabel = index;
				}
			}
			else{
				showLastLabel = index;
			}
			i++;
			index++;
		},
		label_resize: function(){
			var clientWidth = document.documentElement.clientWidth;
			if(clientWidth < 800){
				clientWidth = 800;
			}
			var showLabels = parseInt((clientWidth-529)/137);//可以显示的页签个数
			
			if(showLabels < (showLastLabel - showFirstLabel + 1)){//可以显示标签个数小于页面改变前的标签个数
				var shouldHideLabels = (showLastLabel - showFirstLabel + 1) - showLabels;//需要隐藏的标签个数
				for(var j = 0;j < shouldHideLabels;j++){
					$("#table_label tr").each(function(){$("td:eq(" + showLastLabel + ")",this).hide();});
					showLastLabel --;
					if($("#label_turn_down").attr("class") == "turn_down_d"){
						$("#label_turn_down").removeClass("turn_down_d");
						$("#label_turn_down").addClass("turn_down_n");
					}
					else if($("#label_turn_down").attr("class") == "turn_down_no_d"){
						$("#label_turn_down").removeClass("turn_down_no_d");
						$("#label_turn_down").addClass("turn_down_no_n");
						$("#label_turn_down").attr("title","向前滚动标签页");
					}
				}
			}
			else{
				var shouldShowLabels = showLabels - (showLastLabel - showFirstLabel + 1);//需要显示的标签个数
				if($("#label_turn_down").attr("class") == "turn_down_n" ||
						$("#label_turn_down").attr("class") == "turn_down_no_n"){
					for(var j = 0;j < shouldShowLabels;j ++){
						$("#table_label tr").each(function(){$("td:eq(" + (showLastLabel + 1) + ")",this).show();});
						showLastLabel ++;
						if(showLastLabel == index-1){
							if($("#label_turn_down").attr("class") == "turn_down_n"){
								$("#label_turn_down").removeClass("turn_down_n");
								$("#label_turn_down").addClass("turn_down_d");
								$("#label_turn_down").attr("title","");
							}
							else if($("#label_turn_down").attr("class") == "turn_down_no_n"){
								$("#label_turn_down").removeClass("turn_down_no_n");
								$("#label_turn_down").addClass("turn_down_no_d");
								$("#label_turn_down").attr("title","");
							}
							shouldShowLabels = shouldShowLabels - (j + 1);
							break;
						}
					}
				}
				if(shouldShowLabels != 0){
					if($("#label_turn_up").attr("class") == "turn_up_n"){
						for(var j = 0;j < shouldShowLabels;j ++){
							$("#table_label tr").each(function(){$("td:eq(" + (showFirstLabel - 1) + ")",this).show();});
							showFirstLabel --;
							if(showFirstLabel == 1){
								$("#label_turn_up").removeClass("turn_up_n");
								$("#label_turn_up").addClass("turn_up_d");
								$("#label_turn_up").attr("title","");
								break;
							}
						}						
					}
				}
			}
			
		},
		turnUp: function(){
			if($("#label_turn_up").attr("class") == "turn_up_n"){
				
				$("#table_label tr").each(function(){$("td:eq(" + (showLastLabel) + ")",this).hide();});
				$("#table_label tr").each(function(){$("td:eq(" + (showFirstLabel-1) + ")",this).show();});
				showFirstLabel --;
				showLastLabel --;
				if(showFirstLabel == 1){
					$("#label_turn_up").removeClass("turn_up_n");
					$("#label_turn_up").addClass("turn_up_d");
					$("#label_turn_up").attr("title","");
				}
				if($("#label_turn_down").attr("class") == "turn_down_d"){
					$("#label_turn_down").removeClass("turn_down_d");
					$("#label_turn_down").addClass("turn_down_n");
					$("#label_turn_down").attr("title","向前滚动标签页");
				}
				else if($("#label_turn_down").attr("class") == "turn_down_no_d"){
					$("#label_turn_down").removeClass("turn_down_no_d");
					$("#label_turn_down").addClass("turn_down_no_n");
					$("#label_turn_down").attr("title","向前滚动标签页");
				}
			}
		},
		turnDown: function(){
			if($("#label_turn_down").attr("class") == "turn_down_n" ||
					$("#label_turn_down").attr("class") == "turn_down_no_n"){
								
				$("#table_label tr").each(function(){$("td:eq(" + showFirstLabel + ")",this).hide();});
				$("#table_label tr").each(function(){$("td:eq(" + (showLastLabel + 1) + ")",this).show();});
				showFirstLabel ++;
				showLastLabel ++;
				if(showLastLabel == index-1){
					if($("#label_turn_down").attr("class") == "turn_down_n"){
						$("#label_turn_down").removeClass("turn_down_n");
						$("#label_turn_down").addClass("turn_down_d");
						$("#label_turn_down").attr("title","");
					}
					else if($("#label_turn_down").attr("class") == "turn_down_no_n"){
						$("#label_turn_down").removeClass("turn_down_no_n");
						$("#label_turn_down").addClass("turn_down_no_d");
						$("#label_turn_down").attr("title","");
					}
				}
				$("#label_turn_up").removeClass("turn_up_d");
				$("#label_turn_up").addClass("turn_up_n");
				$("#label_turn_up").attr("title","向后滚动标签页");
			}
			
		},
		label_mouseover: function(model){
			var labelInputId = model.get("labelInputId");
			if($("#" + labelInputId).is(":visible")){
				return;
			}
			var id = model.get("id");
			$($("#" + id).children(".label_close")).show();
//			$($("#" + id).children(".label_setting")).show();
		},
		label_mouseout: function(model){
			var labelInputId = model.get("labelInputId");
			if($("#" + labelInputId).is(":visible")){
				return;
			}
			var id = model.get("id");
			$($("#" + id).children(".label_close")).hide();
			$($("#" + id).children(".label_setting")).hide();
		},
		label_click: function(model){
			
			if (isLoading) {//如果还在加载中则不切换
				return;
			}
			
			var labelContentId = model.get("labelContentId");
			var id = model.get("id");
			var chageTabType = model.get("chageTabType");
			var paramValue = model.get("paramValue");
			
			if(id != selectLabelId){
				isLoading = true;//设置为加载中
				//保存数据到describeJson
				WorkingspaceSave(SELECT_LABEL);
				
				var save_id = 0;
				for(var j=0; j<describeJson.length; j++){
					if(id == $("#table_label tr").children().eq(j+1).children().attr("id")){
						save_id = j;
					}
				}
				appUrlMap.clear();//先清空
				for(var k=0; k<$("#"+labelContentId).children().length; k++){
					if($("#"+$("#"+labelContentId).children().eq(k).attr("id")+"_iframe").attr("src") == null){
						var url = describeJson[save_id].panels[k].url.replace(/\'/ig,"\"");
						url = addCurrentId(url, labelContentId, userId);
						//$("#"+$("#"+labelContentId).children().eq(k).attr("id")+"_iframe").attr("src", url);
						appUrlMap.put($("#"+labelContentId).children().eq(k).attr("id")+"_iframe", url);
					}
				}
				//加载当前页签中的app的URL
				loadAppUrl();
				$("#" + selectLabelId).removeClass("labels_s");
				$("#" + selectLabelId).addClass("labels_n");
				if (chageTabType != "0" || (selectLabelChangeType !="" && selectLabelChangeType != chageTabType)) {//需要切换
					$("#" + selectLabelContentId).hide();
				}
				
				$("#" + selectLabelId).css("z-index",$("#" + selectLabelId).attr("zindex"));
				var lastSelectLabelId = selectLabelId;
				
				selectLabelId = id;
				$("#" + selectLabelId).css("z-index",999);
				selectLabelContentId = labelContentId;
				
				if (chageTabType != "0" || (selectLabelChangeType !="" && selectLabelChangeType != chageTabType)) {//需要切换
					$("#" + selectLabelContentId).show();
					selectLabelChangeType = chageTabType;
				}
				$("#" + id).removeClass("labels_n");
				$("#" + id).addClass("labels_s");
				
				var lastLabelModel = this.labels.get(lastSelectLabelId);
				if(lastLabelModel){
					var labelInputId = lastLabelModel.get("labelInputId");
					if(!$('#' + labelInputId).is(":hidden")){//解决编辑页签时，点其他页签，上个页签编辑未完毕的bug
						var lastId = model.get("id");
						if($.trim($("#" + labelInputId).attr("value")) != ""){
							lastLabelModel.set("name",$.trim($("#" + labelInputId).attr("value")));
						}
						$("#" + lastId).children("span").text(model.get("name"));
						limit(lastId,12);
						$("#" + labelInputId).hide();
					}
				}
				
				if(document.documentMode == 10){//解决ie10下页签显示bug
					if(lastLabelModel){
						this.label_mouseover(lastLabelModel);
						this.label_mouseout(lastLabelModel);
					}
					
					this.label_mouseover(model);
					this.label_mouseout(model);
					this.label_mouseover(model);
				}												
			}
			var div_panels_c = document.getElementById(selectLabelId+"_content").getElementsByTagName("iframe");
			panels = div_panels_c.length;
			
			if(isFromOrm){
				if(ORMPermissionWorking('COMPONENTQUERY')){
					$('#'+selectLabelContentId).hide();
				}
			}
			else if(isFromOutOm){
				if(checkOutOmPermissionWorking('COMPONENTQUERY')){
					$('#'+selectLabelContentId).hide();
				}
			}
			else{
				if(cdtPermissionWorking('CDT-03', 3)){
					$('#'+selectLabelContentId).hide();
				}
			}
			
			if (chageTabType == "0") {//不需要切换
				var data = {name:model.get("name"), data:paramValue};
				window.postMessage(JSON2.stringify(data), "*");
			}
		},
		closeLabel_mouseover: function(model, closeImag){
			closeImag.src=contextPath + "/images/tabs/tab-close-f.png";
		},
		closeLabel_mouseout: function(model, closeImag){
			closeImag.src=contextPath + "/images/tabs/tab-close-n.png";
		},
		closeLabel: function(model, e){			
			var labelInputId = model.get("labelInputId");
			if($("#" + labelInputId).is(":visible")){
				return;
			}
			if($("#table_label tr td").size() == 4){//只有一个标签时,不能删除
				//alert("必须保留至少一个页签！");
				$.messager.alert("操作提示", "未能删除标签页,必须保留至少一个标签页!","error");
				return;
			}
			var confirmContent = $("#" + model.get("id") ).children("span").attr("title");
			if(confirmContent == "" || confirmContent == null){
				confirmContent = $("#" + model.get("id") ).children("span").text();
			}
			confirmContent = "确认删除名为【"+confirmContent+"】的标签页?<br>删除后将无法撤销此操作!";
			confirmView.confirmOpen(deleteLabel, confirmContent);
			e.stopPropagation();
			
			function deleteLabel(){//删除标签页
				var id = model.get("id");
				var labelContentId = model.get("labelContentId");
				var row = $("#" + id).parent().index();
				
				//修改页签删除时需要保存的内容
				for(var k=0; k<describeJson.length; k++){
					if(k == row-1){
						describeJson.splice(k, 1);
						isChanged = true;
						break;
					}
				}
				
				var needSelectLabel = null;//删除选中的标签时，下次默认需要选中的标签
				if(id == selectLabelId){//删除选中的标签时
					if(row == 1){//删除第一个标签
						var tempSelectLabelId = selectLabelId;
						selectLabelId = "";
						needSelectLabel = $("#" + tempSelectLabelId).parent().next().children().children("span");
					}
					else if (row > 1){
						var tempSelectLabelId = selectLabelId;
						selectLabelId = "";
						needSelectLabel = $("#" + tempSelectLabelId).parent().prev().children().children("span");
					}
				}
				$("#" + labelContentId).remove();
				labelView.labels.remove(model);
				
				$("#table_label tr").each(function(){$("td:eq(" + row + ")",this).remove();});
				if($("#label_turn_up").attr("class") == "turn_up_n"){//左边有隐藏标签
					$("#table_label tr").each(function(){$("td:eq(" + (showFirstLabel-1) + ")",this).show();});
					showLastLabel --;
					index --;
					if(showFirstLabel == 2){
						$("#label_turn_up").removeClass("turn_up_n");
						$("#label_turn_up").addClass("turn_up_d");
						$("#label_turn_up").attr("title","");
						showFirstLabel --;
					}
					else{
						showFirstLabel --;
					}
				}
				else{
					if($("#label_turn_down").attr("class") == "turn_down_n" || 
							$("#label_turn_down").attr("class") == "turn_down_no_n"){//右边有隐藏标签
						$("#table_label tr").each(function(){$("td:eq(" + (showLastLabel) + ")",this).show();});
						index --;
						if(showLastLabel == index-1){
							if($("#label_turn_down").attr("class") == "turn_down_n"){
								$("#label_turn_down").removeClass("turn_down_n");
								$("#label_turn_down").addClass("turn_down_d");
								$("#label_turn_down").attr("title","");
							}
							else if($("#label_turn_down").attr("class") == "turn_down_no_n"){
								$("#label_turn_down").removeClass("turn_down_no_n");
								$("#label_turn_down").addClass("turn_down_no_d");
								$("#label_turn_down").attr("title","");
							}
						}
					}
					else{
						showLastLabel --;
						index --;
					}
				}
				
				if(needSelectLabel){
					needSelectLabel.mousedown();
				}
			}
		},
		showLabelSetting:function(model, e) {//弹出设置
			if (!labelSettingView) {
				labelSettingView = new LabelSettingView();
			}
			var labelInfo={chageTabType:model.get("chageTabType"), paramValue:model.get("paramValue")};
			labelSettingView.labelSettingWinOpen(settingLabel, labelInfo);
			
			function settingLabel(data){//设置标签页
				var id = model.get("id");
				if (data && data.chageTabType) {
					model.set({chageTabType:data.chageTabType});
					$("#"+id + "_name_span").attr("chageTabType", model.get("chageTabType"));
				}
				if (data && data.paramValue) {
					model.set({paramValue:data.paramValue});
					$("#"+id + "_name_span").attr("paramValue", model.get("paramValue"));
				}
			}
		},
		settingLabel_mouseover: function(model,settingImag){
			settingImag.src=contextPath + "/images/tabs/tab-setting-f.png";
		},
		settingLabel_mouseout: function(model,settingImag){
			settingImag.src=contextPath + "/images/tabs/tab-setting-n.png";
		},
		label_dblclick: function(model){
			var id = model.get("id");		
			var labelName = model.get("name");
			var labelInputId = model.get("labelInputId");
			$($("#" + id).children(".label_close")).hide();
			$($("#" + id).children(".label_setting")).hide();
			$("#" + labelInputId).show();
			$("#" + labelInputId).attr("value",labelName);
			$("#" + labelInputId).select();
			$("#" + labelInputId).bind("blur",function(){
				rename();
			});
			$("#" +labelInputId).bind("keydown",function(){
				var event = arguments.callee.caller.arguments[0] || window.event;
				if(event.keyCode == 13){
					rename();
				}
			});	
			
			function rename(){
				if($.trim($("#" + labelInputId).attr("value")) != ""){
					model.set("name",$.trim($("#" + labelInputId).attr("value")));
				}
				$("#" + id).children("span").text(model.get("name"));
				
				limit(id,12);
				$("#" + labelInputId).hide();
			}
		}
	});
});