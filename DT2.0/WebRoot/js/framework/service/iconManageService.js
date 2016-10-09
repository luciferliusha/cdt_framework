/**
 * 图标库Service
 */
function IconManageService() {
	
	/** 内部属性及方法 strart */
	var _getIconsDataUrl = path + "/getAllIcons.do";
	var _delIconsDataUrl = path + "/deleteIcons.do";
	
	/** 内部属性及方法 end */
	
	/** ******** 对外方法 ********  */
	/**
	 * 获取图标库内容
	 */
	this.getIconsData = function(callBack) {
		$.HttpUtil.doAjax(_getIconsDataUrl, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
	
	/**
	 * 删除图标
	 */
	this.delIconsData = function(callBack, params, _sels) {
		$.HttpUtil.doAjax(_delIconsDataUrl, params, function(ret) {
			if (callBack) {
				callBack(ret.data, _sels);
			}
		});
	};
}