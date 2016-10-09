/**
 * 登录分页的九宫格的展现
 */
function ThumbnailView(){
	var thumbnailTotal = 16;//假设有16个图标
	var page_total = parseInt(thumbnailTotal/6)+((thumbnailTotal%6) == 0? 0 : 1);;//假设有三页
	var page_code = 0;//当前第一页
	var client_width, _paddingLeft;
	client_width = $(window).width();
	if (client_width < 1024) {//保证最小1024
		client_width = 1024;
	}
	_paddingLeft = (client_width - 1024)/2;
	if (_paddingLeft < 0) {
		_paddingLeft = 0;
	}
	
	/**
	 * 初始化首页内容：包括thumbnail和pagination
	 */
	this.initpaginationView = function(){
		initThumbnailView();
		initPaginationView();
		bindPageButtonClick();
		bindPageNumberClick();
	};
	
	/**
	 * 初始化九宫格
	 */
	var initThumbnailView = function(){
		$(".main_div").append('<div class="thumbnailViewParent"></div>');
		$(".main_div .thumbnailViewParent").width((page_total)*client_width);
		for(var k=0; k<page_total; k++){
			$(".main_div .thumbnailViewParent").append('<div class="thumbnailView"></div>');
		}
		for(var i=0; i<thumbnailTotal; i++){
			var _pageNumber = parseInt(i/6);
			$($(".main_div .thumbnailViewParent").children(".thumbnailView")[_pageNumber]).append('<div class="thumbnailView-item"></div>');
		}
	};
	
	/**
	 * 初始化左右翻页和页码
	 */
	var initPaginationView = function(){
		var _page_button_template = $("#page_button_template").html();
		$(".main_div").append(_page_button_template);
		
		for(var i=0; i<page_total; i++){
			$("#page_number").append('<span class="page_number_n">'+(i+1)+'</span>');
		}
		
		$($("#page_number").children("span")[0]).removeClass("page_number_n");
    	$($("#page_number").children("span")[0]).addClass("page_number_p");
	};
	
	/**
	 * 上下页按钮事件
	 * @returns
	 */
	var bindPageButtonClick = function() {
		if(!($._data($("#pre_page").get(0), "events") != undefined
				&& $._data($("#pre_page").get(0), "events")["click"] != undefined)){
			$("#pre_page").bind("click",function(){
				if(page_code <= 0){
					return;
				}
				if (!$(".main_div .thumbnailViewParent").is(":animated")) {
					$(".main_div .thumbnailViewParent").animate({
		        		"margin-left": -(page_code-1)*client_width
		        	}, 500);
					page_code--;
					page_unfocus();
					$($("#page_number").children("span")[page_code]).removeClass("page_number_n");
		        	$($("#page_number").children("span")[page_code]).addClass("page_number_p");
				}
			});
		}
		if(!($._data($("#next_page").get(0), "events") != undefined
				&& $._data($("#next_page").get(0), "events")["click"] != undefined)){
			$("#next_page").bind("click",function(){
				if(page_code >= (page_total-1)){//page_code从0开始，page_total从1开始
					return;
				}
				if (!$(".main_div .thumbnailViewParent").is(":animated")) {
					$(".main_div .thumbnailViewParent").animate({
		        		"margin-left": -((page_code+1) * client_width)
		        	}, 500);
					page_code++;
		        	page_unfocus();
		        	$($("#page_number").children("span")[page_code]).removeClass("page_number_n");
		        	$($("#page_number").children("span")[page_code]).addClass("page_number_p");
				}
			});
		}
	};
	
	/**
	 * 绑定上下页页码事件
	 */
	var bindPageNumberClick = function(){
		$("#page_number span").die("click").live("click",function(){
			var page_code_pointer = $(this).index();//点击的第几页，从0开始
			if(page_code < page_code_pointer){//前进
				page_code = page_code_pointer;
				$(".main_div .thumbnailViewParent").animate({
	        		"margin-left": -(page_code)*client_width
	        	}, 500);
			}else if(page_code > page_code_pointer){//后退
				page_code = parseInt(page_code_pointer);
				$(".main_div .thumbnailViewParent").animate({
	        		"margin-left": -(page_code)*client_width
	        	}, 500);
			}
			page_unfocus();
			$(this).removeClass("page_number_n");
			$(this).addClass("page_number_p");
		});
	};
	
	/**
	 * 还原页码到非选中状态
	 */
	var page_unfocus = function(){
		$("#page_number span").removeClass("page_number_p");
		$("#page_number span").addClass("page_number_n");
	};
}