/**
 * 构件Service
 */
function ComponentService() {
	
	/** 内部属性及方法 strart */
	var _getSubAppInfoUrl = path + "/getSubAppInfo.do";
	var _addAppUsedLogUrl = path + "/addAppUsedLog.do";
	
	/** 内部属性及方法 end */
	
	/** ******** 对外方法 ********  */
	/**
	 * 获取第一层构件组信息
	 */
	this.getSubAppInfo = function(callBack) {
		$.HttpUtil.doAjax(_getSubAppInfoUrl, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
	
	/**
	 * 获取构件信息
	 */
	this.getAppInfo = function(callBack,param,$this){
		$.HttpUtil.doAjax(_getSubAppInfoUrl, param, function(ret) {
			if (callBack) {
				callBack(ret.data,$this);
			}
		});
	};
	
	/**
	 * 构件使用次数记录
	 */
	this.addAppUsedLog = function(param){
		$.HttpUtil.doAjax(_addAppUsedLogUrl, param);
	};
}