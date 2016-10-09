/**
 * 获取外部权限数据Service
 */
function OutOmPermissionService() {
	var _getOutOmPermissionUrl = "http://172.20.97.46:8080/OMWebservice/getRightXML.do?";
	
	/**
	 * 获取权限数据
	 */
	this.getOutOmPermission = function(callBack,failedCallBack,param,callBackParam){		
		$.HttpUtil.doAllSimpleAjax(_getOutOmPermissionUrl, param, function(ret) {
			if(callBack){
				callBack(ret, callBackParam);
			}
		},function(ret) {
			if(failedCallBack){
				failedCallBack(callBackParam);
			}
		});
	};
}