/**
 * 登录前界面的九宫格的展现
 */
$(function(){
	//左右切换页面按钮
	PageButtonView = Backbone.View.extend({
		el: $("#page_button"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var pageButonTemplate = _.template($("#page_button_template").html());
			$(this.el).html(pageButonTemplate);
		},
		events: {
			"mousedown #pre_page": "preDown",
			"mouseup #pre_page": "preUp",
			"mouseout #pre_page": "preOut",
			"mousedown #next_page": "nextDown",
			"mouseup #next_page": "nextUp",
			"mouseout #next_page": "nextOut"
		},
		preDown: function(){
			$("#pre_page").attr("src",contextPath+"/images/button/arrow-2left-p.gif");
		},
		preUp: function(){
			$("#pre_page").attr("src",contextPath+"/images/button/arrow-2left-f.gif");
			if(page_code>0){
				this.next_page_up();
				this.page_unfocus();
				$("#"+"page_number"+page_code).attr("src", contextPath+"/images/button/round-p.gif");
			}
		},
		preOut: function(){
			$("#pre_page").attr("src",contextPath+"/images/button/arrow-2left-n.gif");
		},
		nextDown: function(){
			$("#next_page").attr("src",contextPath+"/images/button/arrow-2right-p.gif");
		},
		nextUp: function(){
			$("#next_page").attr("src",contextPath+"/images/button/arrow-2right-f.gif");
			if(page_code<page_total-1){
				this.pre_page_up();
				this.page_unfocus();
				$("#"+"page_number"+page_code).attr("src", contextPath+"/images/button/round-p.gif");
			}
		},
		nextOut: function(){
			$("#next_page").attr("src",contextPath+"/images/button/arrow-2right-n.gif");
		},
		pre_page_up: function(){
			$("#total_pages").animate({
        		marginLeft: -(page_code+1)*client_width+(page_code+1)*padding_left/**distance_x*/
        	}, 500);
        	page_code++;
		},
		next_page_up: function(){
			$("#total_pages").animate({
        		marginLeft: (1-page_code)*client_width+(page_code-1)*padding_left/**distance_x*/
        	}, 500);
        	page_code--;
		},
		page_unfocus: function(){
			for(var i=0; i<4; i++){
				$("#"+"page_number"+i).attr("src", contextPath+"/images/button/round-n.gif");
			}
		}
	});
	
	//页码视图
	PageNumberView = Backbone.View.extend({
		initialize: function(){
			this.pageNumber = new PageNumber(null, {view : this});
		},
		events: {
		},
		onClick: function(model){
			var id = model.get("id");
			var page_code_pointer = id.substring(11);
			if(page_code < page_code_pointer){
				page_code = page_code_pointer-1;
				this.pre_page_up();
			}else if(page_code > page_code_pointer){
				page_code = parseInt(page_code_pointer)+1;
				this.next_page_up();
			}
			this.page_unfocus();
			$("#"+id).attr("src", contextPath+"/images/button/round-p.gif");
		},
		pre_page_up: function(){
			$("#total_pages").animate({
        		marginLeft: -(page_code+1)*client_width+(page_code+1)*padding_left/**distance_x*/
        	}, 500);
        	page_code++;
		},
		next_page_up: function(){
			$("#total_pages").animate({
        		marginLeft: (1-page_code)*client_width+(page_code-1)*padding_left/**distance_x*/
        	}, 500);
        	page_code--;
		},
		page_unfocus: function(){
			for(var i=0; i<page_total; i++){
				$("#"+"page_number"+i).attr("src", contextPath+"/images/button/round-n.gif");
			}
		}
	});
	
	//页面视图，用于展示所有app
	PageView = Backbone.View.extend({
		el: $("#total_pages"),
		initialize: function(){
			platForm = new PlatForm(null, {view : this});
			this.rander();
		},
		rander: function(){
			var url = contextPath + '/getAllPFInfo.do';
			operateServerData(url,platForm,this.initPF);			
		},
		initPF: function(response){
			platForm.reset();//先清除platForm内的model
			result = response.data;
			for(var i=0; i<result.length; i++){
				var platFormModel = new PlatFormModel({id:"app"+i,dirId:result[i].pfId, dirName:result[i].pfName, picName:"", url:result[i].url});
				platForm.add(platFormModel);//添加model
			}
		},
		addOnePF : function() {
			if (platForm.models.length == result.length) {//全部添加完后
				calWidthHeight();//先计算宽高
				page_total = Math.ceil(result.length/12);
				$("#total_pages").css("width", client_width*page_total);
				//根据app数量添加页面视图
				for(var k=0; k<page_total; k++) {
					$(this.el).append("<div id="+"page"+k+" class='page_style' style='margin-left:" + padding_left + "px;width:"+ page_width +"px;'></div>");
					//为每一个页面添加三条显示行
					for(var i=0; i<3; i++){
						var codei = k*3+i;
						$("#"+"page"+k).append("<div class='app_line_style' id="+"app_line"+codei+" style='width: 100%; height: " + (per_height+23)+ "px;'></div>");
						//控制三行之间的间隔
						if(i%3!=0){
							$("#"+"app_line"+i).css("margin-top", "33px");
						}
						//为每一条显示行添加四条显示列
						for(var j=0; j<4; j++){
							var codej = codei*4+j;
							$("#"+"app_line"+codei).append("<div id="+"app"+codej+" class='present_css'></div>");
						}
						//控制四列之间的间隔
						$("#"+"app"+(codei*4)).css("margin-left","0px");
					}
				}
				//
				var pageNumberView = new PageNumberView({el: $("#page_number")});
				for(var i=0; i<page_total; i++){
					var pageNumber = new PageNumberModel({id: "page_number"+i});
					pageNumberView.pageNumber.add(pageNumber);
				}
				//默认显示第一页
				$("#page_number0").click();
				//渲染所有的platform
				platForm.each(function(model){
					var id = model.get("id");
					var dirId = model.get("dirId");
					var name = model.get("dirName");
					var picName = model.get("picName");
					var url = model.get("url");
 
					var pfData = "<div style='position:relative;'><div style='position:absolute;'>"+
							"<img id="+id+"_shadow"+" class='platform_shadow' src='"+contextPath+"/images/login/app-blank-n.gif' style='width: " + per_width + "px; height: " + per_height +
							"px'></div><div style='position:absolute;padding-left:2px;padding-right:2px;'>" + 
							"<img id="+id+"_img"+" class='platform_img' style='z-index:1;align:center;width: " + (per_width-4) + "px; height: " + pf_img_height + "px;' src=''></div>" + 
							"<div style='position:absolute;'><img id="+id+"_focus"+" class='platform_focus' src='"+contextPath+"/images/login/app-blank-f.png' style='width: " + 
							per_width + "px; height: " + per_height +"px; display:none'></div></div>" + 
							"<div id=" + id+"_info_bg" + " class='text_info_div' style='width: " + per_width + "px;padding-top:" + (per_height+1) +"px;'><span id="+id+"_info"+"></span></div>";
					if (url != null && url != "") {//当时外部链接的情况
						pfData = pfData + "<a id='" + id + "_link' style='display:none;' href='" + url + "' target='_blank'></a>";
					}

					$("#"+id).append(pfData);
					$("#"+id).attr("dirId", dirId);
					
					$("#"+id).css("cursor","pointer");
					$("#"+id+"_img").attr("src", picName);
					$("#"+id+"_info").html(name);
					
					limit(id+"_info_bg",30);					
					$("#"+id).bind("click",function(){
						if (url != null && url != "") {//当时外部链接的情况
							$("#"+this.id+"_link")[0].click();
						}
						else {
							selectedId = dirId;//点击某个则登录后显示该平台解决方案
							$("#blackboard").show();
							$("#login_wd").show();
							loginFocus("#loginName", "#pwd", "#login");
						}
					});
					$("#"+id).bind("mouseover",function(){
						$("#"+id+"_focus").css("display", "inline");
					});
					$("#"+id).bind("mouseout",function(){
						$("#"+id+"_focus").css("display", "none");
					});
                });
			}
		},
		events: {
			
		}
	});
	
	/*AppView = Backbone.View.extend({
		initialize: function(){
			this.app = new App(null, {view : this});
		},
		events: {
		},
		onClick: function(model){
			var id = model.get("id");
			alert(id);
		},
		mouseover: function(model){
			var id = model.get("id");
			$("#"+id+"_img").attr("src",contextPath+"/images/login/app-single-f.gif");
		},
		mouseout: function(model){
			var id = model.get("id");
			$("#"+id+"_img").attr("src",contextPath+"/images/login/app-single-n.gif");
		}
	});
	
	AppsView = Backbone.View.extend({
		initialize: function(){
			this.apps = new Apps(null, {view : this});
		},
		events: {
		},
		onClick: function(model){
			var id = model.get("id");
			alert(id);
		},
		mouseover: function(model){
			var id = model.get("id");
			$("#"+id+"_img").attr("src",contextPath+"/images/login/app-double-f.gif");
		},
		mouseout: function(model){
			var id = model.get("id");
			$("#"+id+"_img").attr("src",contextPath+"/images/login/app-double-n.gif");
		}
	});
	
	MoreInfoView = Backbone.View.extend({
		initialize: function(){
			this.moreInfo = new MoreInfo(null, {view : this});
		},
		events: {
		},
		onClick: function(model){
			var id = model.get("id");
			alert(id);
		},
		mouseover: function(model){
			var id = model.get("id");
			document.getElementById(id+"_span").style.background = "url('"+contextPath+"/images/login/app-blank-f.png')";
		},
		mouseout: function(model){
			var id = model.get("id");
			document.getElementById(id+"_span").style.background = "";
		}
	});*/
});