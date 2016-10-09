/**
 * 标签model
 */
$(function(){
	LabelModel = Backbone.Model.extend({
		defaults:{
			id: null,
			name: null,
			labelContentId: null,//标签对应工作区id
			labelInputId:null,//标签输入框id
			chageTabType:null,//是否切换工作区
			paramValue:null//传递的参数
		}
	});
});