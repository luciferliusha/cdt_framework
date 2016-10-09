/**
 * CDT顶部VIEW
 */

function SortableView(){
	var _picPath = path + "/uploadFils/pics/";//图片路径
	var rows = 3,columns = 4;
	var initTemplate = function() {
		initBtnEvent();
	};
	
	/**
	 * 初始化数据
	 */
	this.initData = function(data){
		init();
		var solutionsNum = data.length;
		var solutions = getsolutionData(data,true);
		var solution = getsolutionData(data,false);
		initsolutionUlData(solutions);
		$("#solutionBox :first-child").addClass("active");
		initsolutionItemData(solution,0);
		bindSortable();
	};
	/** mode:true表示取出解决方案组的数据;false表示取出解决方案的数据 */
	var getsolutionData = function(data,mode){//获取第一层数据中的解决方案组，用于展现在首页的解决方案组一栏
		var solutions = new Array(), solution = new Array();
		for(var i=0; i<data.length; i++){
			var arg = data[i];
			var type = data[i].type;
			if(type == 0){//若读取到解决方案组，则保存到解决方案组的json数组
				solutions.push(arg);
			}else if(type == 1){//若读取到解决方案，则保存到解决方案的json数组
				solution.push(arg);
			}
		}
		if(mode){
			return solutions;
		}else{
			return solution;
		}
	};
	/** 初始化解决方案组数据到首页的解决方案组一栏 */
	var initsolutionUlData = function(data){
		var $solutionBox = $("#solutionBox");
		$solutionBox.append('<li title="首页">首页</li>');
		
		for(var i=0; i<data.length; i++){
			var pfName = data[i].pfName;
			$solutionBox.append('<li title="'+pfName+'">'+name_limit(pfName,8)+'</li>');
		}
	};
	/** 加载首页解决方案item,需要控制显示数量和显示样式 ,data:改解决方案组下解决方案的数据;rows：首页可显示解决方案的行数;
	 * columns:首页可显示解决方案的列数：pageNum:首页显示的当前解决方案在解决方案组中的分页后的位置*/
	var initsolutionItemData = function(data, pageNum){
		var dataNum = data.length;
		var pageNumMax = rows*columns;
		var pageTotal = parseInt(dataNum/pageNumMax)+((dataNum%pageNumMax) == 0? 0 : 1);
		
		var _startNum = pageNum*pageNumMax;
		//若剩余解决方案数量不足以铺满首页，则取循环结束数值为data剩余数量，否则取可铺满首页的最大数值
		var _endNum = (_startNum+pageNumMax>dataNum)?(dataNum-_startNum):pageNumMax;
		for(var i=_startNum; i<_endNum; i++){
			var _url = _picPath+data[i].keyWord;
			var _contentHtml = $.render($("#isotope_content_template").html(),{url:_url,name:data[i].pfName});
			$(".index_content .containerpage").append(_contentHtml);
		}
	};

	/**
	 * resize
	 */
	this.resizeIndexPage = function() {
		resizePage();
	};

	/**
	 * 初始化顶部按钮事件
	 */
	var initBtnEvent = function() {
		var client_width = $(window).width();
		var _pageChange = '<div class="index_content"><div class="containerpage"></div></div>';
		if(!($._data($("#pre_page").get(0), "events") != undefined
				&& $._data($("#pre_page").get(0), "events")["click"] != undefined)){
			$("#pre_page").bind("click",function(){//pagenum变小
				var $pageCenter = $(".index_content_div .index_content");
				if (!$pageCenter.is(":animated")) {
					$(".index_content_div").append(_pageChange);
					resizePage();
					var $pageChange = $($(".index_content_div").children(".index_content")[1]);
					$pageChange.css("margin-left",client_width*(-1));
					$pageCenter.animate({
		        		"margin-left": client_width*(1)
		        	}, 500, function(){
		        		$pageCenter.remove();
		        	});
					$pageChange.animate({
		        		"margin-left": client_width*(0)
		        	}, 500);
				}
			});
			$("#next_page").bind("click",function(){//pagenum变大
				var $pageCenter = $(".index_content_div .index_content");
				if (!$pageCenter.is(":animated")) {
					$(".index_content_div").append(_pageChange);
					resizePage();
					var $pageChange = $($(".index_content_div").children(".index_content")[1]);
					
					$pageChange.css("margin-left",client_width*(1));
					$pageCenter.animate({
		        		"margin-left": client_width*(-1)
		        	}, 500, function(){
		        		$pageCenter.remove();
		        	});
					$pageChange.animate({
		        		"margin-left": client_width*(0)
		        	}, 500);
				}
			});
			
			$("#itemModeTool .itemArrayMode").bind("hover",function(event){
				if (event.type =='mouseenter'){
					$("#itemModeTool .itemShapeModeBox").hide();
			    	$("#itemModeTool .itemArrayModeBox").show();
			    }
			});
			$("#itemModeTool .itemArrayModeBox").bind("hover",function(event){
				if(event.type =='mouseleave'){
					$("#itemModeTool .itemArrayModeBox").hide();
			    }
			});
			$("#itemModeTool .itemShapeMode").bind("hover",function(event){
				if (event.type =='mouseenter'){
					$("#itemModeTool .itemArrayModeBox").hide();
					$("#itemModeTool .itemShapeModeBox").show();
			    }
			});
			$("#itemModeTool .itemShapeModeBox").bind("hover",function(event){
				if(event.type =='mouseleave'){
					$("#itemModeTool .itemShapeModeBox").hide();
			    }
			});
		}
		$("#itemModeTool .itemArrayModeBox li").die("click").live("click",function(){
			$("#itemModeTool .itemArrayModeBox").hide();
		});
		$("#itemModeTool .itemShapeModeBox li").die("click").live("click",function(){
			$("#itemModeTool .itemShapeModeBox").hide();
		});
		
		$("#solutionBox li").die("click").live("click",function(){//解决方案组点击事件
			$("#solutionBox li.active").removeClass("active");
			$(this).addClass("active");
		});
		$(".containerpage .item").die("click").live("click",function(){//解决方案点击事件
			
		});
		
	};
	
	var resizePage = function() {
		var client_width = $(window).width();
		if (client_width < 1024) {//保证最小1024
			client_width = 1024;
		}
		var _paddingLeft = (client_width - 1024)/2;
		if (_paddingLeft < 0) {
			_paddingLeft = 0;
		}
		$(".index_content").width(client_width);
		
		var paddingTop = ($(window).height()-40-$(".containerpage").height())/2;
		if (paddingTop < 0) {
			paddingTop = 0;
		}
		var pageTop = ($(window).height()-80)/2;
		if (pageTop < 0) {
			pageTop = 0;
		}
		var numberTop = paddingTop + 600 + 30;//600是containerpage的高度
		$(".containerpage").css("margin-left", _paddingLeft);
		$(".containerpage").css("margin-right", _paddingLeft);
		$(".containerpage").css("margin-top", paddingTop);
		$("#pre_page").css("top", pageTop);
		$("#next_page").css("top", pageTop);
		$("#pre_page").css("left", _paddingLeft);
		$("#next_page").css("right", _paddingLeft);
	};
	
	var init_page = function(){
		resizePage();
	};
	
	var bindSortable = function() {//为grid添加sort事件
		$(".index_content .containerpage").sortable();
		$(".index_content .containerpage").disableSelection();
	};

	var init = function() {
		$(".index_content .containerpage").empty();
		init_page();
		initTemplate();
	};
}