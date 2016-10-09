$(function(){
	OperateTitleView = Backbone.View.extend({
		el: $("#operate_title"),
		initialize: function(){
			this.rander();
		},
		events: {
			"click #solutions": "changeToSolutions",
			"click #components": "changeToComponents"
		},
		rander: function() {
			var operateTitleTemplate = _.template($("#operate_title_template").html());
			$(this.el).html(operateTitleTemplate);
		},
		changeToSolutions: function() {
//			if(showMenu != "null" && showMenu == "false"){//默认不显示左侧菜单时，不能点击解决方案和构件
//				return;
//			}
			
			if($("#solutions").attr("class") == null || $("#solutions").attr("class") == ""){
				$("#solution_operate").animate({left:0},0,function(){
					$("#component_operate").css("left",(-1)*solution_space_width+"px");
					$("#operate_title").removeClass($("operate_title").attr("class"));
					$("#operate_title").addClass("operate_switch_left");
//					$("#components p").hide();
//					$("#solutions p").show();
					//$("#solutions").addClass("solutions_n");
					//$("#components").removeClass("components_n");
				});
			}		
		},
		changeToComponents: function(){
//			if(showMenu != "null" && showMenu == "false"){//默认不显示左侧菜单时，不能点击解决方案和构件
//				return;
//			}
			
			if($("#components").attr("class") == "" || $("#components").attr("class") == null){
				$("#component_operate").animate({left:0},0,function(){
					$("#solution_operate").css("left",(-1)*solution_space_width+"px");
					$("#operate_title").removeClass($("operate_title").attr("class"));
					$("#operate_title").addClass("operate_switch_right");
//					$("#solutions p").hide();
//					$("#components").append("<p >构件</p>");
//					$("#components").addClass("components_n");
//					$("#solutions").removeClass("solutions_n");
				});
			}
		}
	});
});