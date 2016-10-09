/**
 * 登录的Collection集合
 */
$(function(){
Logins = Backbone.Collection.extend({
	model:LoginModel,
	// World对象的集合
	initialize : function(models, options) {
		this.bind("add", this.addModels);
	},

	addModels : function (model) {

	}
});
});