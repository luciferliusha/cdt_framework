/**
 * 构件View
 */

function ComponentView(){
	var hasInitComponentView = false;
	var componentService = new ComponentService();
	var appData = new HashMap();//用来存放构件信息的map,key是构件id,value是构件信息
	var explorAnimating = false;//展开解决方案组动画标识
	var componentLimit = 18;//构件内容字数限制
	var componentTitleLimit = 44;//构件标题字数限制
	
	//新拖拽构件的默认参数
	var working_space_width = "40%";//宽度
	var working_space_height = "400px";//高度
	var working_space_title_bgcolor = "";//标题背景色颜色
	var working_space_title_font_size = "12px";//标题文字大小
	
	/**
	 * 加载第一层构件组数据
	 */
	var loadSubAppInfoData = function(data){
		for ( var i = 0; i < data.length; i++) {//在界面上加载第一层构件组数据
			var _component_group = $.render($("#component_group_template").html(),{"appId":data[i].appId,
				"appName":data[i].appName,"subNumber":data[i].subNumber});
			var appName = data[i].appName;
//			var tempName = name_limit(appName,componentTitleLimit);			
			$("#component_div_sidebar").append(_component_group);
//			if(appName != tempName){//文字内容改变，即文字过长
//				$($("#component_div_sidebar").children()[i]).find(".component_group_title").text(tempName);
				$($("#component_div_sidebar").children()[i]).find(".component_group_title").attr("title",appName);
//			}
		}
		$("#menu_ul_parent").mCustomScrollbar("update");
	};
	
	/**
	 * 初始化第一层构件组数据
	 */
	var initSubAppInfo =function(){
		componentService.getSubAppInfo(loadSubAppInfoData);
	};
	
	/**
	 * 加载构件数据
	 * @param data 接口返回的构件数据
	 * @param $this 点击的构件组标题Jquery对象
	 */
	var loadAppInfoData = function(data,$this){
		var _component_group_ul = $("#component_group_ul_template").html();
		$this.parent().append(_component_group_ul);
		if(data.length == 0){
			explorAnimating = false;
			return;
		}
		for ( var i = 0; i < data.length; i++) {//在界面上加载构件数据
			var _component = $.render($("#component_template").html(),{"appId":data[i].appId,
				"appName":data[i].appName});
			var describe = data[i].describe; 
			var appName = data[i].appName;
			var tempName = name_limit(appName,componentLimit);
			appData.put(data[i].appId, data[i]);
			$this.next().append(_component);
			if(appName != tempName){//文字内容改变，即文字过长
				$($this.next().children()[i]).find(".component_group_item_content_font span").text(tempName);
				$($this.next().children()[i]).find(".component_group_item_content_font span").attr("title",appName);
			}
			describe = describe.replace(/\n/g,"<br/>").replace(/\r/g,"&nbsp;");//替换换行
			if (describe != null && describe != "") {//添加简介的提示				
				$($this.next().children()[i]).qtip({
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
			//为构件添加拖动事件
			$($this.next().children()[i])._draggable({
				proxy: function(source){
					var p = $('<div class="component_li_copy part_application_f"></div>');
					p.html($(source).html()).appendTo('body');
					return p;
				},
				revert: true,
				onBeforeDrag: function(e){
					//判断是否已有拖拽
					if($(".component_li_copy").size()>0){
						return false;
					}
				},
				onDrag: function(e){
				},
				onStopDrag: function(e){
					var $work = $("#working");
					var _offset = $work.offset();
					var _data = e.data;
					//条件：拖到了working区域内，且当前为非URL和模板方式才执行
					if(_data.left>=_offset.left&&_data.left<=_offset.left+$work.width()
							&&_data.top>=_offset.top&&_data.top<=_offset.top+$work.height()
							&&$work.find(".solution_workspace_template").size()==0
							&&$work.find(".solution_workspace_url").size()==0){
						var $this = $(this);
						var _appid = $this.attr("appid");
						var _component = appData.get(_appid);
						if(_component){
							var _left = $work.scrollLeft() + _data.left - _offset.left + "px";
							var _top = $work.scrollTop() + _data.top -_offset.top + "px";
							var _param = {
								"solution_workspace":"solution_workspace","pfName":_component.appName,"url":_component.fileName,
								"width":working_space_width,"height":working_space_height,"left":_left,"top":_top,isShowTitle:true, 
								"titleBgColor":working_space_title_bgcolor, "titleFontSize":working_space_title_font_size,
								title:("label0_space"+$work.find(".solution_workspace").size())//为了兼容以前保留title属性
							};
							messageCenter.callMessage('CREATE_IFRAME',{workspace:$work,param:_param, showBorder:true,saveData: true});
							messageCenter.callMessage('ADD_APP_USED_LOG',{appId:_appid});
							
							var _proxy = $this._draggable("proxy");
							if(_proxy) _proxy.remove();//移除拖拽div
						}
					}
				}
			});
		}
		explorComponent($this);
	};
	
	/**
	 * 绑定构件组标题的事件
	 */
	var bindComponentGroupTitleEvent = function(){
		$(".component_group_title_div").die("click").live("click",function(){//构件组标题点击事件
			if(explorAnimating){
				return;
			}
			explorAnimating = true;
			var appId = $(this).parent().attr("appId");
			if($(this).nextAll(".component_group_ul").length == 0){//构件组没有展开过
				componentService.getAppInfo(loadAppInfoData, {"appId":appId},$(this));
			}
			else{
				if($(this).nextAll(".component_group_ul").children().length == 0){//构件组下面没有子构件
					explorAnimating = false;
					return;
				}
				explorComponent($(this));
			}		
		});		
		
		$('.component_group_title_div').die('hover').live('hover', function(event){//构件组标题鼠标移入移出事件
		    if (event.type =='mouseenter'){
		    	$(this).addClass("component_group_title_f");
		    	$(this).find(".number_marked").removeClass("number_marked_n");
		    	$(this).find(".number_marked").addClass("number_marked_f");
		        return false;// 禁止冒泡
		    }else if(event.type =='mouseleave'){
		    	$(this).removeClass("component_group_title_f");
		    	$(this).find(".number_marked").removeClass("number_marked_f");
		    	$(this).find(".number_marked").addClass("number_marked_n");
		        return false;
		    }
		});
	};
	
	/**
	 * 展开和关闭构件组
	 * @param $this 点击的构件组标题Jquery对象
	 */
	var explorComponent = function($this){
		if($this.next().is(":hidden")){//展开
			$this.next().show();
			$this.next().css("padding-bottom","6px");
			var _hight = $this.next().height();
			$this.next().height("0");
			$this.next().animate({height:_hight},400,function(){
				explorAnimating = false;
				$("#menu_ul_parent").mCustomScrollbar("update");
			});
		}
		else{//关闭			
			var _hight = $this.next().height();
			$this.next().css("padding-bottom","0");
			$this.next().animate({height:0},400,function(){
				explorAnimating = false;
				$(this).hide();
				$(this).height(_hight + "px");
				$("#menu_ul_parent").mCustomScrollbar("update");
			});
		}
	};
	
	/**
	 * 绑定构件的事件
	 */
	var bindComponentEvent = function(){
		$(".component_group_ul li").die('hover').live('hover', function(event){//构件鼠标移入移出事件
		    if (event.type =='mouseenter'){
		    	$(this).removeClass("part_application_n");
		    	$(this).addClass("part_application_f");
		        return false;// 禁止冒泡
		    }else if(event.type =='mouseleave'){
		    	$(this).removeClass("part_application_f");
		    	$(this).addClass("part_application_n");
		        return false;
		    }
		});
	};
	
	this.init = function() {
		if(!hasInitComponentView){
			$("#component_div_sidebar").empty();
			appData.clear();
			hasInitComponentView = true;
			initSubAppInfo();
			
			bindComponentGroupTitleEvent();
			bindComponentEvent();			 
		}
	};
	
	this.getAppData = function(){
		return appData;
	};
	
	/**
	 * 构件使用次数记录
	 * 参数: {appId: appid}
	 */
	this.addAppUsedLog = function(jsonData){
		componentService.addAppUsedLog({file:JSON2.stringify(jsonData)});
	};
	
	this.setHasInitComponentView = function(_hasInitComponentView){
		hasInitComponentView = _hasInitComponentView;
	};
}