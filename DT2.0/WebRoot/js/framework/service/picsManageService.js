/**
 * 图片库Service
 */
function PicManageService() {
	
	/** 内部属性及方法 strart */
	var _getPicsDataUrl = path + "/getAllPics.do";
	var _delPicsDataUrl = path + "/deletePics.do";
	
	/** 内部属性及方法 end */
	
	/** ******** 对外方法 ********  */
	/**
	 * 获取图片库内容
	 */
	this.getPicsData = function(callBack) {
		$.HttpUtil.doAjax(_getPicsDataUrl, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
	
	/**
	 * 删除图片
	 */
	this.delPicsData = function(callBack, params, _sels) {
		$.HttpUtil.doAjax(_delPicsDataUrl, params, function(ret) {
			if (callBack) {
				callBack(ret.data, _sels);
			}
		});
	};
}