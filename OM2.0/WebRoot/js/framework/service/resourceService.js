/**
 * 资源View service
 */
function ResourceService(){
	/** 内部属性及方法 start */
	var omOperateResourceUrl = path + "/ts/omOperateResource?";//操作资源url:新增，修改与删除
	var omSearchResourceUrl = path + "/ts/omSearchResource?";//搜索资源url
	var omCheckNoIsExitUrl = path + "/ts/omCheckNoIsExit?";//判断资源编号是否存在url
	/** 内部属性及方法 end */
	
	/***
	 * 操作资源
	 */
	this.omOperateResource = function(callBack,param){
		$.HttpUtil.doAjax(omOperateResourceUrl,param,function(ret){
			if(callBack){
				callBack(ret.data,param);
			}
		});//请求数据
	};
	
	/**
	 * 搜索资源
	 */
	this.omSearchResource = function(callBack,param){
		$.HttpUtil.doAjax(omSearchResourceUrl,param,function(ret){
			if(callBack){
				callBack(ret.data);
			}
		});//请求数据
	};
	
	/**
	* 判断资源编号是否存在
	*/
	this.omCheckNoIsExit = function(callBack,param){
		$.HttpUtil.doSimpleAjax(omCheckNoIsExitUrl,param,function(ret){
			if(callBack){
				callBack(ret);
			}
		});//请求数据
	};
}