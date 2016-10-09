$(function() {
	/**
	 * 组织和用户的集合
	 */
	Organizations = Backbone.Collection.extend({
		model: OmModel,
		initialize: function(model, options) {
			this.bind("add", function(model){
				options.view.addOrganizationGroup(model);
			});
		}
	});
	
	/**
	 * 角色的集合
	 */
	Roles = Backbone.Collection.extend({
		model: OmModel,
		initialize: function(model, options) {
			this.bind("add", function(model){
				options.view.addOrganizationGroup(model);
			});
		}
	});
	
	/**
	 * 资源的集合
	 */
	Resources = Backbone.Collection.extend({
		model: OmModel,
		initialize: function(model, options) {
			this.bind("add", function(model){
				options.view.addOrganizationGroup(model);
			});
		}
	});
});