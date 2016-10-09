/**
 * 图片模型
 */
$(function(){
	PageNumberModel = Backbone.Model.extend({
		//设置默认属性
		defaults : {
			id : null
		}
	});
	
	/*AppModel = Backbone.Model.extend({
		//设置默认属性
		defaults : {
			id : null,
			name : null
		},
		initialize : function() {

		}
	});
	
	AppsModel = Backbone.Model.extend({
		//设置默认属性
		defaults : {
			id : null,
			name : null
		},
		initialize : function() {
			
		}
	});
	
	MoreInfoModel = Backbone.Model.extend({
		//设置默认属性
		defaults : {
			id : null,
			name : null,
			url : null
		},
		initialize : function() {
			
		}
	});*/
	
	/** 登录前的平台Model */
	PlatFormModel = Backbone.Model.extend({
		//设置默认属性
		defaults : {
			id:null,
			dirId : null,
			dirName : null,
			picName : null,
			url : null
		},
		initialize : function() {
			if (!this.get("picName")) {//如果没有设置缩略图图片,则用默认的图片
				this.set({
					"picName" : contextPath+'/images/login/app-double-n.gif'
				});
			}
			else {
				this.set({
					"picName" : 'icons/platform/' + this.get("picName")
				});
			}
		}
	});
	
});