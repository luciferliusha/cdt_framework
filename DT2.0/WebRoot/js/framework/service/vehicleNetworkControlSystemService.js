function VehicleNetworkControlSystemService(){
	
	var getAllConfigUrl = path + "/getAllConfig.do";
	var getConfigsByNameUrl = path + "/getConfigsByName.do";
	var getConfigByIdUrl = path + "/getConfigById.do";
	var addConfigUrl = path + "/addConfig.do";
	var updateConfigUrl = path + "/updateConfig.do";
//	var deleteConfigByIdUrl = path + "/deleteConfigById.do?data={id:1}";
	var deleteConfigUrl = path + "/deleteConfig.do";
	var isConfigNameEnExistUrl = path + "/isConfigNameEnExist.do";
	
	this.getAllConfig = function(callBack){
		$.HttpUtil.doAjax(getAllConfigUrl, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
	this.getConfigsByName = function(param, callBack){
		var url = getConfigsByNameUrl + "?" + param;
		$.HttpUtil.doAjax(url, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
	this.getConfigById = function(param, callBack){
		var url = getConfigByIdUrl + "?data={id:"+param+"}";
		$.HttpUtil.doAjax(url, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
	this.addConfig = function(param,callBack){
		var url = addConfigUrl + "?data=" + param;
		$.HttpUtil.doAjax(url, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
	this.updateConfig = function(param,callBack){
		var url = updateConfigUrl + "?data=" + param;
		$.HttpUtil.doAjax(url, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
	this.deleteConfigById = function(){};
	this.deleteConfig = function(param,callBack){
		var url = deleteConfigUrl+"?data="+param;
		$.HttpUtil.doAjax(url, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
	this.isConfigNameEnExist = function(param,callBack){
		var url = isConfigNameEnExistUrl+"?data="+param;
		$.HttpUtil.doAjax(url, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
}