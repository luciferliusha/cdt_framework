/**
 * 系统配置Service
 */
function SettingService() {
	
	/** 内部属性及方法 strart */
	var _updateInfoUrl = path + "/updateInfo.do";
	
	/** 内部属性及方法 end */
	
	/** ******** 对外方法 ********  */
	/**
	 * 更新系统配置
	 */
	this.updateInfo = function(paras, callBack) {
		$.HttpUtil.doAjax(_updateInfoUrl, paras, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
}