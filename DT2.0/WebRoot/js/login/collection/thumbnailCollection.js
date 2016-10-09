/**
 * 图片的Collection集合
*/
$(function(){
	//页码集合
	PageNumber = Backbone.Collection.extend({
		model : PageNumberModel,
		initialize : function(models, options){
			this.bind("add", function(model){
				var id = model.get("id");
				$("#"+options.view.el.id).append("<li class = 'page_number_li'><img id="+id+" src='"+contextPath+"/images/button/round-n.gif'> " +
					"</li>");
				
				$("#"+id).bind("click",function(){
					options.view.onClick(model);
				});
			});
		}
	});
	
	/*App = Backbone.Collection.extend({
		model : AppModel,
		initialize : function(models, options){
			this.bind("add", function(model){
				var id = model.get("id");
				var name = model.get("name");
				
				$("#"+id).append("<img id="+id+"_img"+" src=''><div class='text_info_div'><font id="+id+"_info"+"></font></div>");
				$("#"+id).css("cursor","pointer");
				$("#"+id+"_img").attr("src", contextPath+"/images/login/app-single-n.gif");
				$("#"+id+"_info").html(name);
				
				$("#"+id).bind("click",function(){
					options.view.onClick(model);
				});
				$("#"+id).bind("mouseover",function(){
					options.view.mouseover(model);
				});
				$("#"+id).bind("mouseout",function(){
					options.view.mouseout(model);
				});
			});
		}
	});
	
	Apps = Backbone.Collection.extend({
		model : AppsModel,
		initialize : function(models, options){
			this.bind("add", function(model){
				var id = model.get("id");
				var name = model.get("name");
				
				$("#"+id).append("<img id="+id+"_img"+" src=''><div class='text_info_div'><font id="+id+"_info"+"></font></div>");
				$("#"+id).css("cursor","pointer");
				$("#"+id+"_img").attr("src", contextPath+"/images/login/app-double-n.gif");
				$("#"+id+"_info").html(name);
				
				$("#"+id).bind("click",function(){
					options.view.onClick(model);
				});
				$("#"+id).bind("mouseover",function(){
					options.view.mouseover(model);
				});
				$("#"+id).bind("mouseout",function(){
					options.view.mouseout(model);
				});
			});
		}
	});
	
	MoreInfo = Backbone.Collection.extend({
		model : MoreInfoModel,
		initialize : function(models, options){
			this.bind("add", function(model){
				var id = model.get("id");
				var name = model.get("name");
				var url = model.get("url");
				
				$("#"+id).append("<table style='width: 269px; height: 156px;'>" +
						"<tr style='width: 269px; height: 156px;'>" +
						"<td style='width: 269px; height: 156px; " +
						"background: url("+contextPath+"/images/login/app-blank-n.gif) no-repeat;'>" +
						"<a class='hover_light'><span id="+id+"_span"+"></span>" +
						"<img id="+id+"_img"+" style='width: 265px; height: 145px; margin-top: -8px;' src=''></a>" +
						"</td></tr></table><div class='text_info_div'><font id="+id+"_info"+"></font></div>");
				$("#"+id+"_img").attr("src", url);
				$("#"+id+"_info").html(name);
				
				$("#"+id).bind("click",function(){
					options.view.onClick(model);
				});
				$("#"+id).bind("mouseover",function(){
					options.view.mouseover(model);
				});
				$("#"+id).bind("mouseout",function(){
					options.view.mouseout(model);
				});
			});
		}
	});*/
	
	/** 登录前的平台Collection */
	PlatForm = Backbone.Collection.extend({
		model : PlatFormModel,
		initialize : function(models, options){
			this.bind("add", function(model){
				options.view.addOnePF();
			});
		}
	});
	
});
