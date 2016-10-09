/**
 * 用户模型
 */
$(function(){
	UserModel = Backbone.Model.extend({
		// 设置默认的属性
		defaults : {
			name : "",
			email : "",
			phone : "",
			mobilePhone : "",
			address : ""
		},
		initialize : function() {
		}
	});
});