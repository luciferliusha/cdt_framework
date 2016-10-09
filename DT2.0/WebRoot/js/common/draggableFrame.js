function createFrame(content, space, left, top, width, height, title, board, iframe, iframeDiv, panel){
	var boolResize = false;
	var h2Height = 24;
	var _allW = $("#working").width();
	//处理原像素信息
	if(left.indexOf('px')!=-1){left=frameTitleConfigView.parsePxToPercent(left,_allW)+'%';}
	if(width.indexOf('px')!=-1){width=frameTitleConfigView.parsePxToPercent(width,_allW)+'%';}
	
	var _panelState = {x:left,y:top,w:width,h:height};
	left = frameTitleConfigView.parsePercentToPx(left,_allW);
	top = parseInt(top);
	width = frameTitleConfigView.parsePercentToPx(width,_allW);
	height = parseInt(height);

	var panelUrl = panel?panel.url:"";
	$("#"+content).append('<div id="'+space+'" class="working_css" style="left:'+
			left+'px;top:'+top+'px;width:'+width+'px;height:'+
			height+'px;">'+'<!--圆角<b class="round_b1"></b><b class="round_b2"></b>' + 
			'<b class="round_b3"></b><b class="round_b4"></b>--><div class="working_content_css">'+
			'<div id="'+space+'Title" class="frameTitle" onmouseover="h2_mouseover(this)" ondblclick="panelMax(\''+space+ '\',\'' + iframe + '\',\'' + iframeDiv +'\')"'+
			'onmouseout="h2_mouseout(this)">'+title+
			'<span id="'+space+'_frameTitleConfig" class="panel_title_config" title="构件设置"></span>'+
			'<div class="working_close" onclick="working_close(this)" ' +
			'onmouseover="working_mouseover(this)" onmouseout="working_mouseout(this)">' +
			'</div>'+'</div><div id="'+iframe+'Div'+'" class="frameDiv" style="height:'+
			(height-h2Height-2)+'px;"><iframe name='+iframe+' id="'+iframe+'" scrolling="auto"'+ ' url="' + panelUrl + '"' +
			' style="width:'+(width-8)+'px;height: '+(height-h2Height-2)+'px;"'+
			' class="iframe_css" frameborder="0"></iframe>'+'<div id="'+iframeDiv+
			'" class="iframe_div_css" style="height: '+(height-h2Height-2)+'px;"></div>'
			+'</div></div><!--<div id="'+space+'Resize" class="resizeIcon"></div>--></div>');
	//       ↑<div id="'+space+'Resize" class="resizeIcon"></div>
	
	var _titleConfig = $("#"+space+'_frameTitleConfig');
	panel = panel||{};
	panel.titleConfig = panel.titleConfig||frameTitleConfigView.defaultConfig();
	$("#"+space+"Title").data("titleConfig",panel.titleConfig).css(getIframeTitleStyle(panel.titleConfig));
	_titleConfig.bind("click",function(e){
		frameTitleConfigView.open(panel.titleConfig,space+"Title", false);
		e.stopPropagation();
	}).bind('mousedown',function(e){e.stopPropagation();});
	
	var _iframeDiv = $("#"+iframe+"Div");
	var _space = $("#"+space);
	var _iframe = $("#"+iframe);
	var _content = $("#"+content);
	
	_space.data("panelState",_panelState);
	
	//--start 遮罩
	var Shade = function(el){
		var _shade = $(el);
		var _obj;
		var _needResize = false;
		var _sizeType = 0; //1:in,0:out
		return {
			remove: function(){ //移除遮罩
				_obj = null;
				_shade.remove();
				_needResize = false;
			},
			appendTo: function(obj, needResize, sizeType){//添加遮罩到某obj
				_sizeType = sizeType;
				_needResize = needResize;
				_obj = "#"+$(obj).attr("id");
				$(obj).append(_shade);
				this.resize();
			},
			resize:function(){//遮罩是否要重新resize
				if(_obj&&_needResize){
					if(_sizeType==1){
						_shade.width($(_obj)[0].scrollWidth).height($(_obj)[0].scrollHeight);
					}else{
						_shade.width($(_obj).width()).height($(_obj).height());
					}
				}
			}
		};
	};
	var shadeOut = new Shade("<div class='blackboard-css' style='top:0;left:0;width:100%;height:100%;position:absolute;z-index:10000;'></div>");
	var shadeIn = new Shade("<div style='width:100%;height:100%;top:"+h2Height+"px;left:0;position:absolute;'></div>");
	//--end
	
	//鼠标位置缓存
	var oldClientX;
	var oldClientY;
	
	var fixState = function(d){
		var disable = false;
		//--start阻止左移、上移 移除边界
		//还原大小,位置
		if (d.left < 0){
			_space.css("left","0px").width(_iframe.width()+10);
			d.left = 0; 
			disable = true;
		}else{//更新内部元素宽度
			var _width = _space.width();
			//_iframeDiv.width(_width-2);
			_iframe.width(_width-10);
		}
        if (d.top < 0){
        	_space.css("top","0px").height(_iframe.height()+7+h2Height);
        	d.top = 0; 
        	disable = true;
        }else{//更新内部元素高度
			var _height = _space.height();
			_iframeDiv.height(_height-2-h2Height);
			_iframe.height(_height-7-h2Height);
        }
		return disable;
	};
	
	//-----------------space
	$("#"+space)._resizable({onStartResize:function(event){
		//--start 添加遮罩
		shadeOut.appendTo($("#working"));
		_space.css("z-index","10001");//手动干预z-index
		shadeIn.appendTo($("#"+iframe+"Div"),true);
		//--end
		
		//缓存鼠标位置
		oldClientX = event.clientX;
		oldClientY = event.clientY;
	},onResize:function(event){
		//--start阻止左移、上移 移出边界，更新大小
		if(fixState(event.data)) return false;
		//--end
		
		shadeIn.resize();
		
		//--start滚动状态控制
		var leftBuf; //左侧的菜单宽度
		var topBuf = 40;//40px的头部高度
		if($("#working").css("left") == "0px"){
			leftBuf = 0 ;
		}else{
			leftBuf = $("#operate").width() + 2;
		}
		if(event.clientX-leftBuf<10 && event.clientX<oldClientX){ //左移动，并且在边界，则左移滚动条
			$('#'+content).scrollLeft($('#'+content).scrollLeft()-(oldClientX-event.clientX));
		}
		if(event.clientY-40<10 && event.clientY<oldClientY){ //上移动，并且在边界，则上移滚动条
			$('#'+content).scrollTop($('#'+content).scrollTop()-(oldClientY-event.clientY));
		}
		
		if($(window).width() - event.clientX < 10 && event.clientX > oldClientX ){ //右移动，并且在边界，则右移滚动条
			$('#'+content).scrollLeft($('#'+content).scrollLeft()+(event.clientX-oldClientX));
		}
		if($(window).height() - event.clientY < 10 && event.clientY > oldClientY ){//下移动，并且在边界，则下移滚动条
			$('#'+content).scrollTop($('#'+content).scrollTop()+(event.clientY - oldClientY));
		}
		//--end
		
		//缓存鼠标位置
		oldClientX = event.clientX;
		oldClientY = event.clientY;
		sizeMap.remove(space);
	},onStopResize:function(event){
		//--start移除遮罩
		shadeOut.remove();
		shadeIn.remove();
		_space.css("z-index","").css("z-index",parseInt(getMaxIndex())+1); //降级z-index
		//--end
		
		//--start还原位置大小
		fixState(event.data);
		frameTitleConfigView.updatePanelState(space+"Title");
        //--end
	}});
	
	$('#'+space)._draggable({
		handle: $('#'+space+'Title'),
		onStartDrag: function(e){
//			$('#'+space).css("z-index",parseInt(getMaxIndex())+1);
//			$('#'+iframeDiv).show();
			//--start 添加遮罩
			shadeOut.appendTo($("#working"));
			_space.css("z-index","10001");//手动干预z-index
			shadeIn.appendTo($("#"+iframe+"Div"),true);
			//--end
		},
		onDrag: function(e){
			shadeIn.resize();
			var d = e.data;
			if (d.left < 0){d.left = 0;}  
            if (d.top < 0){d.top = 0;}
		},
		onStopDrag: function(e){
//			$('#'+iframeDiv).hide();
			//--start移除遮罩
			shadeOut.remove();
			shadeIn.remove();
			_space.css("z-index","").css("z-index",parseInt(getMaxIndex())+1); //降级z-index
			//--end
			frameTitleConfigView.updatePanelState(space+"Title");
		}
	});
	
	if(isFromOrm){
		if(ORMPermissionWorking('COMPONENTCHANGE')){
			$('#'+space)._draggable('disable');
			$("#"+space)._resizable('disable');
		}
		if(ORMPermissionWorking('COMPONENTQUERY')){
			$('#'+space)._draggable('disable');
		}
	}
	else if(isFromOutOm){
		
	}
	else{
		if(cdtPermissionWorking('CDT-03', 2)){
			$('#'+content).hide();
			$("#"+space)._resizable('disable');
		}
		if(cdtPermissionWorking('CDT-03', 3)){
			$('#'+content).hide();
		}
	}
	
/*$('#'+space)._resizable({
	minWidth: 400,
	minHeight: 200,
    onStartResize: function(event, ui){
    	$('#'+iframeDiv).show();
    },
    onResize: function(event, ui){
    	$('#'+iframe+'Div').height($('#'+space).height()-h2Height-7+"px");
    	$('#'+iframe).width($('#'+space).width()-10+"px");
    	$('#'+iframe).height($('#'+space).height()-h2Height-7+"px");
    	
    	$('#'+iframeDiv).height($('#'+space).height()-h2Height-7+100+"px");
    	$('#'+iframeDiv).width($('#'+space).width()+100+"px");
    	
    	if($(window).width() + $('#'+space).scrollLeft() - event.clientX < 20){
    		$('#'+content).scrollLeft($('#'+content).scrollLeft()+20);
    	}
    	if($(window).height() + $('#'+space).scrollTop() - event.clientY < 20){
    		$('#'+content).scrollTop($('#'+content).scrollTop()+20);
    	}
    	
    },
    onStopResize: function(event, ui){
    	$('#'+iframeDiv).hide();
    	$('#'+iframe+'Div').height($('#'+space).height()-h2Height-7+"px");
    	$('#'+iframe).width($('#'+space).width()-10+"px");
    	$('#'+iframe).height($('#'+space).height()-h2Height-7+"px");
    	$('#'+iframeDiv).height($('#'+space).height()-h2Height-7+"px");
    }
});*/
}

function panelMax(space, iframe, iframeDiv){
	var maxHeight = $("#working").height();//最大高度
	var maxWidth = $("#working").width();
	var size = sizeMap.get(space);
	if (size == null) {
		size = $("#" + space).css("left") + "," + $("#" + space).css("top") + "," + $("#" + space).width() + "," + $("#" + space).height() + "," + $("#" + space).css("z-index");
		sizeMap.put(space, size);
		panelResize(space, iframe, iframeDiv, 0, 0, maxWidth, maxHeight, 999);
	}
	else {
		var sizeArray = size.split(",");
		panelResize(space, iframe, iframeDiv, sizeArray[0], sizeArray[1], sizeArray[2], sizeArray[3], sizeArray[4]);
		sizeMap.remove(space);
	}
}

function panelResize(space, iframe, iframeDiv, appLeft, appTop, appWidth, appHeight, zIndex){
	var h2Height = 24;
	if (!$("#" + space).is(":animated")) {
		$("#" + space).animate({left:appLeft,top:appTop,width:appWidth,height:appHeight},400,function(){
			$("#" + space).css("z-index", zIndex);
			$("#" + iframe+"Div").height((appHeight-h2Height-2)+"px");
			$("#" + iframe).width((appWidth-8)+"px");
			$("#" + iframe).height((appHeight-h2Height-2)+"px");
			$("#" + iframeDiv).height((appHeight-h2Height-2)+"px");
			frameTitleConfigView.updatePanelState(null,space);
		});
	}
}

function h2_mouseover(o){
	if(isFromOrm){
		if(!ORMPermissionWorking('COMPONENTDELETE')){
			$(o).children().show();
		}
	}
	else if(isFromOutOm){
		$(o).children().show();
	}
	else{
		if(!cdtPermissionWorking('CDT-03', 1)){
			$(o).children().show();
		}
	}
}
function h2_mouseout(o){
	$(o).children().hide();
}
function working_mouseover(o){
	$(o).css("background","url(" + contextPath + "/images/button/Insidepages-close-f.png)");
}
function working_mouseout(o){
	$(o).css("background","url(" + contextPath + "/images/button/Insidepages-close-n.png)");
}
function working_close(o){
	var currentId = $(o).parent().parent().parent().attr('id');
	idMap.remove(currentId+"_iframe");//关闭则要删除HashMap中当前的ID
	$(o).parent().parent().parent().remove();
}

function createSquare(id, name, fileName){
	$('#'+id)._draggable({
		proxy: function(source){
			var p = $('<div class="part_application_f"></div>');
			p.html($(source).html()).appendTo('body');
			return p;
		},
		revert: true,
		cursor: 'default',
		onDrag: function(e){
			var d = e.data;
			if (d.top < 40){d.top = 40;}
		},
		onStopDrag: function(e){
			if(e.clientX>solution_space_width){//构件组只有在方案加载成功时才可用
				if(READLOCK == 1){
					if(name == "" || name == null){
						iframe_html = $("#"+id).children().children().children().children().children().children("span").html();
					}else{
						iframe_html = name;
					}
					componentView.dragToOpen(fileName, e.clientX+$("#"+selectLabelId+"_content").scrollLeft()-solution_space_width, e.clientY+$("#"+selectLabelId+"_content").scrollTop()-50);
				}else{
					//alert("请先选择解决方案！");
					$.messager.alert("操作提示", "未能加载构件,请先选择解决方案!","error");
				}
			}
		}
	});
}

function getMaxIndex(){
	var index=0;
	var ds=document.getElementById('working').getElementsByTagName('div');
	var l=document.getElementById('working').getElementsByTagName('div').length;
	
	for (var i=0;i<l;i++)
	{
		if (ds[i].style.zIndex>index) index=ds[i].style.zIndex;
	}
	return index;
}