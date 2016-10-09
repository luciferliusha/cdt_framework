/**
 * 模板库Service
 */
function TemplateManageService() {
	
	/** 内部属性及方法 strart */
	var _getTemplateDataUrl = path + "/getTemplate.do";
	
	/** 内部属性及方法 end */
	
	/** ******** 对外方法 ********  */
	/**
	 * 获取图标库内容
	 */
	this.getTemplateData = function(callBack) {
		$.HttpUtil.doAjax(_getTemplateDataUrl, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
}