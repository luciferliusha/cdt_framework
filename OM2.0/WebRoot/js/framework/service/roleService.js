/**
* 角色View service
*/
function RoleService(){
	/** 内部属性及方法 start */
	var omOperateRoleUrl = path + "/ts/omOperateRole?";//操作角色url:新增，修改与删除
	var omSearchRoleUrl = path + "/ts/omSerachRole?";//搜索角色url
	var omGetRoleResourceUrl = path + "/ts/omGetRoleResource?";//获得角色的资源url
	var omAwardResourceUrl = path + "/ts/omAwardResource?";//将资源赋予角色url
	/** 内部属性及方法 end */
	
	/***
	 * 操作角色
	 */
	this.omOperateRole = function(callBack,param){
		$.HttpUtil.doAjax(omOperateRoleUrl,param,function(ret){
			if(callBack){
				callBack(ret.data,param);
			}
		});//请求数据
	};
	
	/**
	 * 搜索角色
	 */
	this.omSearchRole = function(callBack,param){
		$.HttpUtil.doAjax(omSearchRoleUrl,param,function(ret){
			if(callBack){
				callBack(ret.data);
			}
		});//请求数据
	};
	
	/**
	 * 获得角色的资源
	 */
	this.omGetRoleResource = function(callBack,param){
		$.HttpUtil.doAjax(omGetRoleResourceUrl,param,function(ret){
			if(callBack){
				callBack(ret.data);
			}
		});//请求数据
	};
	
	/**
	 * 将资源赋予给角色
	 */
	this.omAwardResource = function(callBack,param,isShowTip){
		$.HttpUtil.doAjax(omAwardResourceUrl,param,function(ret){
			if(callBack){
				callBack(param,isShowTip);
			}
		});//请求数据
	};
}
