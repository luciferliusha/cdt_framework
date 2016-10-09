/**
 * 
 * 解决方案model类
 * @author songd
 * @date 2013-04-03
 */
$(function(){	
	SolutionModel = Backbone.Model.extend({
		id: null,
		parentViewId: null,
		pfId: null,
		parentId: null,
		type: null,
		describe: null,
		name: null,
		number: null,
		userId:null,
		url:null,
		isSubType:null
	});
});