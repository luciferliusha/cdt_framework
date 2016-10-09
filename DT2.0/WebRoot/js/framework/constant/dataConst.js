/**
* js数据常量类
*/
var Const = {
	/** 系统管理中的解决方案数据 */
	systemManagerData:function(path) {
		return [
	             {
	                 "describe": {
	                     "isShowTitle": true
	                 },
	                 "fileName": "goujian_s.png",
	                 "picName": "goujian_n.png",
	                 "orderBy": 0,
	                 "parentId": 0,
	                 "pfId": "componentManager",
	                 "pfName": "构件管理",
	                 "type": 1,
	                 "url": path + "/framework/componentManager.jsp"
	             },
	             {
	                 "describe": {
	                     "isShowTitle": true
	                 },
	                 "fileName": "tubiao_s.png",
	                 "picName": "tubiao_n.png",
	                 "orderBy": 1,
	                 "parentId": 0,
	                 "pfId": "iconsManager",
	                 "pfName": "图标库管理",
	                 "type": 1,
	                 "url": path + "/framework/iconsManager.jsp"
	             },
	             {
	                 "describe": {
	                     "isShowTitle": true
	                 },
	                 "fileName": "tupian_s.png",
	                 "picName": "tupian_n.png",
	                 "orderBy": 2,
	                 "parentId": 0,
	                 "pfId": "imagesManager",
	                 "pfName": "图片库管理",
	                 "type": 1,
	                 "url": path + "/framework/picsManager.jsp"
	             },
	             {
	                 "describe": {
	                     "isShowTitle": true
	                 },
	                 "fileName": "moban_s.png",
	                 "picName": "moban_n.png",
	                 "orderBy": 3,
	                 "parentId": 0,
	                 "pfId": "templateManager",
	                 "pfName": "模板库管理",
	                 "type": 1,
	                 "url": path + "/framework/templateManager.jsp"
	             },
	             {
	                 "describe": {
	                     "isShowTitle": true
	                 },
	                 "fileName": "gjrizi_s.png",
	                 "picName": "gjrizi_n.png",
	                 "orderBy": 4,
	                 "parentId": 0,
	                 "pfId": "appUsed",
	                 "pfName": "构件使用日志",
	                 "type": 1,
	                 "url": path + "/framework/appUsed.jsp"
	             },
	             {
	                 "describe": {
	                     "isShowTitle": true
	                 },
	                 "fileName": "jjrizi_s.png",
	                 "picName": "jjrizi_n.png",
	                 "orderBy": 5,
	                 "parentId": 0,
	                 "pfId": "solutionUsed",
	                 "pfName": "解决方案访问日志",
	                 "type": 1,
	                 "url": path + "/framework/solutionUsed.jsp"
	             },
	             //暂时删除该功能，该功能目前只在温州项目中给GIS调用用
	             /*{
	                 "describe": {
	                     "isShowTitle": true
	                 },
	                 "fileName": "peizhi_s.png",
	                 "picName": "peizhi_n.png",
	                 "orderBy": 6,
	                 "parentId": 0,
	                 "pfId": "vehicleNetworkControlSystem",
	                 "pfName": "配置项管理",
	                 "type": 1,
	                 "url": path + "/framework/vehicleNetworkControlSystem.jsp"
	             }*/
	             {
	                 "describe": {
	                     "isShowTitle": true
	                 },
	                 "fileName": "setting_s.png",
	                 "picName": "setting_n.png",
	                 "orderBy": 6,
	                 "parentId": 0,
	                 "pfId": "systemSetting",
	                 "pfName": "系统配置管理",
	                 "type": 1,
	                 "url": path + "/framework/setting.jsp"
	             }
	         ];
	}
};