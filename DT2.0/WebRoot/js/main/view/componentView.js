/**
 * 构件view
 */
$(function(){
	ComponentOperateView = Backbone.View.extend({
		el: $("#component_operate"),
		initialize: function(){
			this.rander();
			this.initData();
		},
		rander: function(){
			var componentOperateTemplate = _.template($("#component_operate_template").html());
			$(this.el).html(componentOperateTemplate);
		},
		events: {
		},
		initData: function(){//初始化数据		
			var componentTitleView = new ComponentTitleView();
		}
	});
	
	ComponentTitleView = Backbone.View.extend({
		initialize: function () {
			componentTitles = new ComponentTitles(null, { view : this });

			this.rander();
		},
		events: {
			
		},
		rander:function(){
			var url = contextPath + '/getSubAppInfo.do';
			operateServerData(url,componentTitles,this.initSubComponent);//获得构件组标题			
		},
		initSubComponent: function(response){
			var result = response.data;
	    	for(var j = 0; j<result.length;j++){
	    		$("#components_groups").append("<div class='group'><div id='components_group_title" +(result[j].appId)+ "' class='components_group_title'>" +						
				"</div><div class='components_group_content'></div>");
	    		var componentModel = new ComponentModel({id:"components_group_title" +(result[j].appId),appId:result[j].appId,name:result[j].appName,number:result[j].subNumber,
	    			appType:result[j].appType});
	    		componentTitles.add(componentModel);
	    	}
		},
		addOneSubComponent: function(model){
			var id = model.get("id");
			var appId =  model.get("appId");
			var name = model.get("name");
			var number = model.get("number");
			var contextView = this;
			$("#" + id).append('<span>'+ name  + '</span>' +
					'<div class="number_marked_n">' + number + '</div>');
			$("#" + id).attr("appId",appId);
			limit(id,componentTitleLimit);
			$("#" + id).bind("click",function(){
				if($("#" + id).next().children().length == 0){//判断构件组第一次展开	
					//根据id获取该目录下的构件
					var url = contextPath + '/getSubAppInfo.do?appId='+appId;
					var map = new HashMap();
					map.put("id", id);
					map.put("explorSolution", explorSolution);
					operateServerData(url,componentApps,contextView.addSubAppFile,map);
				}
				else{
					explorSolution();
				}
				
				function explorSolution(){
					if(groupAnimating){//展开，隐藏动画进行中标识
						return;
					}
					var contentHeight;
					groupAnimating = true;
					if(!$($("#" + id).next()).is(":hidden")){
						contentHeight = $($("#" + id).next()).height();
						$($("#" + id).next()).animate({height:0},300,function(){
							$(this).hide();
							$(this).height(contentHeight);//为了隐藏后显示，设置高度
							groupAnimating = false;
							if($(this).prev().attr("class") == "components_group_title_f"){
								return;
							}					
							$(this).prev().removeClass($(this).prev().attr("class"));
							$(this).prev().addClass("components_group_title");
							$($(this).prev().children("div")).addClass("number_marked_n");
							
						});
					}
					else{
						contentHeight = $("#" + id).next().height();
						$($("#" + id).next()).height(0);
						$($("#" + id).next()).show();
						$($("#" + id).next()).animate({height:contentHeight},300,function(){
							groupAnimating = false;
							if($(this).prev().attr("class") == "components_group_title_f"){
								return;
							}
							$(this).prev().removeClass($(this).prev().attr("class"));
							$(this).prev().addClass("components_group_title");							
							$($(this).prev().children("div")).addClass("number_marked_n");
							
						});
					}
				}
			});
			
			$("#" + id).bind("mouseover",function(){
				$("#" + id).removeClass($("#" + id).attr("class"));
				$("#" + id).addClass("components_group_title_f");
				
				$("#" + id).children("div").removeClass("number_marked_n");
				$("#" + id).children("div").addClass("number_marked_f");	
			});
			$("#" + id).bind("mouseout",function(){
				$("#" + id).removeClass($("#" + id).attr("class"));
				$("#" + id).addClass("components_group_title");
				
				$("#" + id).children("div").removeClass("number_marked_f");
				$("#" + id).children("div").addClass("number_marked_n");
			});
		},
		addSubAppFile: function(response,map){
			var id = map.get("id");
			var result = response.data;
			var length = result.length;//构件组中的构件个数
			var className = "part_application_n";
			if(length == 0){
				return;
			}
			$("#" + id).next().append("<ul id=components_group" + ($("#" + id).parent().index()+1) + "></ul>");
			for ( var i = 0; i < result.length; i++) {
				var componentModel = new ComponentModel({parentId:"components_group" + ($("#" + id).parent().index()+1),
					id:"components_group" + ($("#" + id).parent().index()+1) + "_item_" + (i+1) ,appId:result[i].appId,
					className: className,name:result[i].appName,fileName:result[i].fileName,describe:result[i].describe});
				componentApps.add(componentModel);
			}
			map.get("explorSolution")();
		}
	});
	
	
	ComponentView = Backbone.View.extend({
		initialize: function () {
			componentApps = new ComponentApps(null, { view : this });			
		},
		events: {
		},
		addOneComponent: function(model){
			var parentId = model.get("parentId");
			var id = model.get("id");
			var appId = model.get("appId");
			var name = model.get("name");
			var className = model.get("className");
			var describe = model.get("describe");
			
			$("#" + parentId).append('<li id='+ id + ' class=' + className + '><table ' +
					'cellpadding="0" cellspacing="0"><tr><td class="components_group_content_font"><div id=' + (id+"_item") +'><span>' 
					+ name + '</span></div></td></tr></table><li>');
			$("#" + id).attr("appId",appId);
			limit((id+"_item"), componentLimit);
			describe = describe.replace(/\n/g,"<br/>").replace(/\r/g,"&nbsp;");//替换换行
			if (describe != null && describe != "") {//添加简介的提示
				$("#" + id).qtip({
					content: {
						text:describe
					},
					style: {
						classes: 'zjcds_qtip'
					},
					position: {
						my: 'top left',
						at: 'bottom center'
				    }
				});
			}
			
			$("#" + id).bind("mouseover",function(){
				var className = $("#" + id).attr("class");
				var s = className.split("_");
				if(s[2] == "n"){//若css已经是part_olap_n,则无需替换
					$("#" + id).removeClass(className);
					$("#" + id).addClass(s[0] + "_" + s[1] +"_f");
					var marginTop =parseInt($($("#" + id).children()).css("margin-top"));
					$($("#" + id).children()).css("margin-top",(marginTop - 2) +"px");
				}
			});
			$("#" + id).bind("mouseout",function(){
				var className = $("#" + id).attr("class");	
				var s = className.split("_");
				if(s[2] == "f"){//若css已经是part_olap_f,则无需替换
					$("#" + id).removeClass(className);
					$("#" + id).addClass(s[0] + "_" + s[1] +"_n");
					var marginTop =parseInt($($("#" + id).children()).css("margin-top"));
					$($("#" + id).children()).css("margin-top",(marginTop + 2) +"px");
				}
			});
			if(isFromOrm){
				if(!ORMPermissionWorking('COMPONENTADD')){
					createSquare(id, name, model.get("fileName"));
				}
			}
			else if(isFromOutOm){
				if(!checkOutOmPermissionWorking('COMPONENTADD')){
					createSquare(id, name, model.get("fileName"));
				}
			}
			else{
				if(!cdtPermissionWorking('CDT-03', 0)){
					createSquare(id, name, model.get("fileName"));
				};
			}
			
			$("#" + id).bind("dblclick", function(){
				if(READLOCK == 1){//构件组只有在方案加载成功时才可用
					if(name == "" || name == null){
						iframe_html = $("#"+id).children().children().children().children().children().children("span").html();
					}else{
						iframe_html = name;
					}
					if(isFromOrm){
						if(!ORMPermissionWorking('COMPONENTADD')){
							componentView.dragToOpen(model.get("fileName"), 0, 0);
						}
					}else{
						if(!cdtPermissionWorking('CDT-03', 0)){
							componentView.dragToOpen(model.get("fileName"), 0, 0);
						}
					}
				}
			});
		},
		dragToOpen: function(fileName, left_new, top_new){
			var iframe_max = 0;
			for(var k=0; k<$("#"+selectLabelContentId).children().length; k++){
				if(iframe_max <= $("#"+selectLabelContentId).children().eq(k).attr("iframe_index")){
					iframe_max = parseInt($("#"+selectLabelContentId).children().eq(k).attr("iframe_index"))+1;
				}
			}
			idMap.put(selectLabelId+"_space"+iframe_max+"_iframe", iframe_html);//保存每个APP的iframe的ID到HashMap中,可以传递消息
			createFrame(selectLabelId+"_content", selectLabelId+"_space"+
					iframe_max, left_new+'px', top_new+'px', 
					working_space_width+'px', working_space_height+'px', 
					iframe_html, selectLabelId+"_space"+iframe_max+"_iframe_border", 
					selectLabelId+"_space"+iframe_max+"_iframe", 
					selectLabelId+"_space"+iframe_max+"_iframe_div");
			$("#"+selectLabelId+"_space"+iframe_max).css("z-index", parseInt(getMaxIndex())+1);
			$("#"+selectLabelId+"_space"+iframe_max).attr("iframe_index", iframe_max);
			if(fileName == null|| fileName ==""){
				var src = url.replace(/\'/ig,"\"");
				src = addCurrentId(src, selectLabelId, userId);
				$("#"+selectLabelId+"_space"+iframe_max+"_iframe").attr("src", src);
			}else{
				var src = fileName.replace(/\'/ig,"\"");
				src = addCurrentId(src, selectLabelId, userId);
				$("#"+selectLabelId+"_space"+iframe_max+"_iframe").attr("src", src);
				$("#"+selectLabelId+"_space"+iframe_max+"_iframe").attr("url", src);
			}
			panels++;
		}
	});
});