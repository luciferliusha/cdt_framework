/**
 * 构件组model
 */
$(function(){
	ComponentModel = Backbone.Model.extend({
		defaults: {
			id: null,
			appId:null,
			name: null,
			number: null,
			appType: null,
			fileName:null,
			describe:null
		},
		initialize: function(){
			
		}
	});
});