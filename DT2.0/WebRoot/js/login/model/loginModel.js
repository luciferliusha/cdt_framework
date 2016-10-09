/**
 * 构件模型，属性为：url
 */
$(function(){
LoginModel = Backbone.Model.extend({
	// 设置默认的属性
	defaults : {
		loginName : "",
		pwd : "",
		isClient : ""
	},
	//确保每一个isClient都不为空
	initialize : function() {
		if (!this.get("isClient")) {
			this.set({
				"isClient" : '1'
			});
		}
	}
});
});