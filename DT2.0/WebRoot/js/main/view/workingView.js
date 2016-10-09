/**
 * 工作区view
 */
$(function(){
	WorkingView = Backbone.View.extend({
		initialize: function () {
			
		},
		addView: function(id,name){
			$("#" + this.el.id).append('<div id=' + id + ' class="working_content">' + name + '</div>');
		}
	});
});