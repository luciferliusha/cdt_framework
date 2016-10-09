/**
*组织用户View service
*/
function OrganizationService(){
	/** 内部属性及方法 start */
	var omOperateOrganizationUrl = path + "/ts/omOperateOrganization?";//操作组织用户url:新增，修改与删除
	var omSerachOrganizationZTreeUrl = path + "/ts/omSerachOrganizationZTree?";//搜索组织用户树url
	var omUserIsExitUrl = path + "/ts/omUserIsExit?";//判断用户邮箱是否存在url
	var omRemoveRelationUrl = path + "/ts/omRemoveRelation?";//解除用户与组织之间的关系url
	var omGetUserByOrganizationUrl = path + "/ts/omGetUserByOrganization?";//获得组织包含的用户url
	var omOrganizationSelectUserUrl = path + "/ts/omOrganizationSelectUser?";//改变组织包含用户url
	var omGetOrganizationByUserUrl = path + "/ts/omGetOrganizationByUser?";//获得用户属于的组织url
	var omUserSelectOrganizationUrl = path + "/ts/omUserSelectOrganization?";//改变用户属于的组织url
	var omUpdatePasswordUrl = path + "/ts/omUpdatePassword?";//修改密码url
	var omGetOrganizationRoleUrl = path + "/ts/omGetOrganizationRole?";//获得组织的角色url
	var omGetUserRoleUrl = path + "/ts/omGetUserRole?";//获得用户的角色url
	var omAwardPermissionUrl = path + "/ts/omAwardPermission";//将角色赋予组织用户url
	/** 内部属性及方法 end */
	
	/***
	 * 操作组织用户
	 */
	this.omOperateOrganization = function(callBack,param,_winId){
		$.HttpUtil.doAjax(omOperateOrganizationUrl,param,function(ret){
			if(callBack){
				callBack(ret.data,param,_winId);
			}
		});//请求数据
	};
	
	/**
	 * 搜索组织用户树
	 */
	this.omSerachOrganizationZTree = function(callBack,param){
		$.HttpUtil.doAjax(omSerachOrganizationZTreeUrl,param,function(ret){
			if(callBack){
				callBack(ret.data);
			}
		});//请求数据
	};
	
	/**
	 * 判断用户邮箱是否存在
	 */
	this.omUserIsExit = function(callBack,param){
		$.HttpUtil.doSimpleAjax(omUserIsExitUrl,param,function(response){
			if(callBack){
				callBack(response);
			}
		});//请求数据
	};
	
	/**
	 * 解除用户与组织之间的关系
	 */
	this.omRemoveRelation = function(callBack,param){
		$.HttpUtil.doSimpleAjax(omRemoveRelationUrl,param,function(response){
			if(callBack){
				callBack(response);
			}
		});//请求数据
	};
	
	/**
	 * 获得组织包含的用户
	 */
	this.omGetUserByOrganization = function(callBack,param){
		$.HttpUtil.doAjax(omGetUserByOrganizationUrl,param,function(ret){
			if(callBack){
				callBack(ret.data);
			}
		});//请求数据
	};
	
	/**
	 * 改变组织包含用户
	 */
	this.omOrganizationSelectUser = function(callBack,param,allUserData){
		$.HttpUtil.doAjax(omOrganizationSelectUserUrl,param,function(ret){
			if(callBack){
				callBack(ret.data,param,allUserData);
			}
		});//请求数据
	};
	
	/**
	 * 获得用户属于的组织
	 */
	this.omGetOrganizationByUser = function(callBack,param){
		$.HttpUtil.doAjax(omGetOrganizationByUserUrl,param,function(ret){
			if(callBack){
				callBack(ret.data);
			}
		});//请求数据
	};
	
	/**
	 * 改变组织包含用户
	 */
	this.omUserSelectOrganization = function(callBack,param){
		$.HttpUtil.doAjax(omUserSelectOrganizationUrl,param,function(ret){
			if(callBack){
				callBack(param);
			}
		});//请求数据
	};
	
	/**
	 * 修改密码
	 */
	this.omUpdatePassword = function(callBack,param){
		$.HttpUtil.doSimpleAjax(omUpdatePasswordUrl,param,function(ret){
			if(callBack){
				callBack(ret);
			}
		});//请求数据
	};
	
	/**
	 * 获得组织的角色
	 */
	this.omGetOrganizationRole = function(callBack,param){
		$.HttpUtil.doAjax(omGetOrganizationRoleUrl,param,function(ret){
			if(callBack){
				callBack(ret.data);
			}
		});//请求数据
	};
	
	/**
	 * 获得用户的角色
	 */
	this.omGetUserRole = function(callBack,param){
		$.HttpUtil.doAjax(omGetUserRoleUrl,param,function(ret){
			if(callBack){
				callBack(ret.data);
			}
		});//请求数据
	};
	
	/**
	 * 将角色赋予组织用户
	 */
	this.omAwardPermission = function(callBack,param,isShowTip){
		$.HttpUtil.doAjax(omAwardPermissionUrl,param,function(ret){
			if(callBack){
				callBack(param,isShowTip);
			}
		});//请求数据
	};
}