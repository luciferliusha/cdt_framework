/**
 * 获取OM权限数据Service
 */
function PermissionService() {
	
	var _cdtGetUrlPermissionUrl = path + '/getUserRight.do';
	
	/** 内部属性及方法 end */
	
	/** ******** 对外方法 ********  */
	
	/**
	 * 获取OM的权限数据
	 */
	this.cdtGetUrlPermission = function(callBack,param,callBackParam){
		$.HttpUtil.doAjax(_cdtGetUrlPermissionUrl, null, function(ret) {
			if(callBack){
				callBack(ret.data, callBackParam);
			}
		});
	};
}