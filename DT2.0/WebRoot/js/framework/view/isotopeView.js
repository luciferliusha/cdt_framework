/**
 * CDT顶部VIEW
 */

function IsotopeView(){
	var indexData;
	var _picPath = path + "/uploadFils/pics/";//图片路径
	var page_code,page_total,dataNum,client_width;
	var initTemplate = function(_total) {
//		var _topHtml = $.render($("#top_logo_template").html(),{logoUrl:path + logoUrl,topWidth:topWidth,topHeight:topHeight,
//				topMarginTop:topMarginTop,topMarginLeft:topMarginLeft,userName:userName});
//		$("#top_div").append(_topHtml);
		
//		initData();
		initBtnEvent(_total);
	};
	
	/**
	 * 初始化数据
	 */
	this.initData = function(data, _total,visitType){
		initRanderIndex(data, _total,visitType);
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
	var initBtnEvent = function(_total) {		
		if(!($._data($("#pre_page").get(0), "events") != undefined
				&& $._data($("#pre_page").get(0), "events")["click"] != undefined)){
			$("#pre_page").bind("click",function(){
				if(page_code <= 0){
					return;
				}
				if (!$(".index_content").is(":animated")) {
					$(".index_content").animate({
		        		"margin-left": -(page_code-1)*client_width
		        	}, 500);
					page_code--;
					page_unfocus();
					$($("#page_number").children("li")[page_code]).removeClass("page_number_n");
		        	$($("#page_number").children("li")[page_code]).addClass("page_number_p");
				}
			});
			$("#next_page").bind("click",function(){
				if(page_code >= (page_total-1)){//page_code从0开始，page_total从1开始
					return;
				}
				if (!$(".index_content").is(":animated")) {
					$(".index_content").animate({
		        		"margin-left": -((page_code+1) * client_width)
		        	}, 500);
					page_code++;
		        	page_unfocus();
		        	$($("#page_number").children("li")[page_code]).removeClass("page_number_n");
		        	$($("#page_number").children("li")[page_code]).addClass("page_number_p");
				}
			});
		}
		$("#page_number li").die("click").live("click",function(){
			var page_code_pointer = $(this).index();//点击的第几页，从0开始
			if(page_code < page_code_pointer){//前进
				page_code = page_code_pointer;
				$(".index_content").animate({
	        		"margin-left": -(page_code)*client_width
	        	}, 500);
			}else if(page_code > page_code_pointer){//后退
				page_code = parseInt(page_code_pointer);
				$(".index_content").animate({
	        		"margin-left": -(page_code)*client_width
	        	}, 500);
			}
			page_unfocus();
			$(this).removeClass("page_number_n");
			$(this).addClass("page_number_p");
		});
		$(".containerpage .item .item-image").die("click").live("click",function(){//点击进入解决方案
			var index = $(this).parent().parent().index()+page_code*_total;
			if (!$(".index_content_div").is(":animated")) {
				$("#pre_page").hide();
				$("#next_page").hide();
				menuModel(solutionView.narrowSolutionInit);
				$(".index_content_div").animate({width:"0px"},{easing: 'easeInOutExpo', duration:1000, complete:function(){
						solutionView.isoItemChoose(index);
					}
				});
			}
		});
		$(".containerpage .item .item-image").die("hover").live("hover",function(event){
			if (event.type == "mouseenter"){//鼠标移入
				$(this).prev().removeClass("item-span-n");
				$(this).prev().addClass("item-span-f");
			}else if(event.type = "mouseleave"){//鼠标移出
				$(this).prev().removeClass("item-span-f");
				$(this).prev().addClass("item-span-n");
			}
		});
		//首页4×3,4×2
		$(".button-group button").die("click").live("click",function(event){
			if(!$(this).hasClass("is-checked")){
				$(".button-group").find(".is-checked").removeClass("is-checked");
				$(this).addClass("is-checked");
				
				var _total = $(this).text().split("×")[0]*$(this).text().split("×")[1];
				//设置首页显示模式（4*3）
				setCookie("sorttype", _total, 120, contextPath);
				
				$(".index_content").toggle({easing: 'easeOutSine', duration:500, complete:function(){
						$(".index_content").empty();
						$("#page_number").empty();
						//solutionView.getSolutionService().getSolutionData(solutionView.getInitSolutionData,_total);//不采用获取数据的方式
						initRanderIndex(indexData,_total);//采用缓存的方式
						$(".index_content").toggle({easing: 'easeInExpo', duration:600, complete:function(){}});
					}
				});
			}
		});
	};
	var page_unfocus = function(){
		$("#page_number li").removeClass("page_number_p");
		$("#page_number li").addClass("page_number_n");
	};
	
	var resizePage = function(_total) {
		client_width = $(window).width();
		if (client_width < 1024) {//保证最小1024
			client_width = 1024;
		}
		var _paddingLeft = (client_width - 1024)/2;
		if (_paddingLeft < 0) {
			_paddingLeft = 0;
		}
		$(".index_content").width((page_total)*client_width);
		
		var paddingTop = ($(window).height()-40-$(".containerpage").height()-$("#page_number").height())/2;
		if (paddingTop < 0) {
			paddingTop = 0;
		}
		var pageTop = ($(window).height()-80)/2;
		if (_total == 12) {//4*3
			if (pageTop < 360) {
				pageTop = 360;
			}
		}
		else {//4*2
			if (pageTop < 322) {
				pageTop = 322;
			}
		}
		
		var numberTop = paddingTop + 675 + 55;//600是containerpage的高度
		$(".containerpage").css("margin-left", _paddingLeft);
		$(".containerpage").css("margin-right", _paddingLeft);
		$(".containerpage").css("margin-top", paddingTop - 40);
		$("#page_number").css("top", numberTop);
		$("#page_number").css("left", _paddingLeft);
		$("#page_number").css("margin-left", (1024-8*page_total-(page_total-1)*8)/2);
		$("#pre_page").css("top", pageTop);
		$("#next_page").css("top", pageTop);
		$("#pre_page").css("left", _paddingLeft);
		$("#next_page").css("right", _paddingLeft);
		if(_total!=null){
			if(_total == 12){
				$(".index_content").css("padding-top","0px");
			}else{
				$(".index_content").css("padding-top","110px");
			}
		}
	};
	
	var init_page = function(_total){
		page_code = 0;
		page_total = parseInt(dataNum/_total)+((dataNum%_total) == 0? 0 : 1);
		
		$("#page_number").empty();//防止刷新
		for(var i=0; i<(page_total); i++){
			$(".index_content").append('<div class="containerpage"></div>');
			if(i == 0){
				$("#page_number").append("<li class='page_number_p'></li>");
			}else{
				$("#page_number").append("<li class='page_number_n'></li>");
			}
		}
		resizePage(_total);
	};
/*	
	var bindSortable = function() {//为grid添加sort事件
		$(".index_content .containerpage").sortable();
		$(".index_content .containerpage").disableSelection();
	}*/

	var initRanderIndex = function(data, _total,visitType) {
		indexData = data;
		dataNum = data.length;
		_total = getSortType();//从cokkies获取
		init(_total);
		var templateId = "isotope_content_template";
		if (checkBrowserIE8()) {
			templateId = "isotope_content_template_ie8";
		}
		for(var i=0; i<dataNum; i++){
			var _pageNumber = parseInt(i/_total);
			var _url = _picPath+data[i].keyWord;
			var _contentHtml = $.render($("#" + templateId).html(),{url:_url,name:data[i].pfName});
			$($(".index_content").children(".containerpage")[_pageNumber]).append(_contentHtml);
		}
//		bindSortable();
		if(dataNum == 0){
			$(".index_content_div").hide();
			$(".index_content_div").width(0);
		}
		solutionView.selectFirstSolution(visitType);
	};

	/**
	 * 判断是否是IE8及其以下
	 * @returns
	 */
	var checkBrowserIE8 = function(){
		var index = navigator.userAgent.indexOf("MSIE");
		if(index > 0){
			//是IE浏览器
			var versions = parseInt(navigator.userAgent.substring(index+5,index+8));
			if(versions <= 8){
				return true;
			}
		}
		return false;
	};
	
	var init = function(_total) {
		$(".index_content").empty();
		$(".index_content").css("margin-left","0px");//防止翻页后存留
		init_page(_total);
		initTemplate(_total);
	};
}