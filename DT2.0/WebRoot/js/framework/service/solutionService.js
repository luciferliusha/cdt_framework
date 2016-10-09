/**
 * 解决方案Service
 */
function SolutionService() {
	
	/** 内部属性及方法 strart */
	
	var _solutionUrl = path + "/getSubPFInfo.do";
	var _getPFDirTreeUrl = path + "/getPFDirTree.do";
	var _addPlatFormFileUrl = path + "/addPlatFormFile.do";
	var _getIconsDataUrl = path + "/getAllIcons.do";
	var _getPicsDataUrl = path + "/getAllPics.do";
	var _updatePlatFormFileUrl = path + "/updatePlatFormFile.do";
	var _deletePlatFormDirUrl = path + "/deletePlatFormDir.do";
	var _updateDescribeByIdUrl = path + '/updateDescribeById.do';
	var _getTemplateDataUrl = path + "/getAllTemplate.do";
	var _getPFTreeDataUrl = path + "/getPFTree.do";
	var _getFavoritePlatFormUrl = path + "/getFavoritePlatForm.do";
	var _getFavPlatFormListUrl = path + "/getFavPlatFormList.do";
	var _saveFavoritePlatFormUrl = path + "/saveFavoritePlatForm.do";
	var _savePlatFormLogUrl = path + "/savePlatFormLog.do";
	var _sortSolutionUrl = path + '/cdtPlatFormSort.do';
	var _IsotopeDataUrl = path + '/getPlatMenus.do';
	var _IsotopeFirstLevelDataUrl = path + '/getPlatMenu.do';
	var _getPlatFormParentIdByNameUrl = path + '/getPlatFormParentIdByName.do';
	
	/** 内部属性及方法 end */
	
	/** ******** 对外方法 ********  */
	/**
	 * 获取解决方案
	 */
	this.getSolutionData = function(callBack,param) {
		$.HttpUtil.doAjax(_solutionUrl, null, function(ret) {
			if (callBack) {
				callBack(ret.data,param);
			}
		});
	};
	
	this.getSolutionsChildrenData = function($this, _param, scanType, loadfirsttime,parentids, callBack) {
		$.HttpUtil.doAjax(_solutionUrl, _param, function(ret) {
			if (callBack) {
				callBack($this, ret.data, scanType, loadfirsttime,parentids);
			}
		});
	};
	
	/**
	 * 获取所有解决方案组数据
	 */
	this.getPFDirTreeData = function(callBack){		
		$.HttpUtil.doAjax(_getPFDirTreeUrl, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
	
	/**
	 * 新增解决方案（组）
	 */
	this.addPlatFormFile = function(callBack,param,check_submit,disable,enable){
		if(check_submit != null && !check_submit.solution){//防止表单重复提交
			return;
		}
		if(disable != null){
			disable();
		}
		$.HttpUtil.doAjax(_addPlatFormFileUrl, param, function(ret) {
			if (callBack) {
				callBack(ret.data,param);
			}
		}, function(){
			enable();
		});
	};
	
	/**
	 * 获取图标库内容
	 */
	this.getIconsData = function(callBack,callBack2) {
		$.HttpUtil.doAjax(_getIconsDataUrl, null, function(ret) {
			if (callBack) {
				if(callBack2){
					callBack(ret.data,callBack2);
				}
				else{
					callBack(ret.data);
				}
			}
		});
	};
	
	/**
	 * 获取图片库内容
	 */
	this.getPicsData = function(callBack,callBack2) {
		$.HttpUtil.doAjax(_getPicsDataUrl, null, function(ret) {
			if (callBack) {
				if(callBack2){
					callBack(ret.data,callBack2);
				}
				else{
					callBack(ret.data);
				}
			}
		});
	};
	
	/**
	 * 获取模板库内容
	 */
	this.getTemplateData = function(callBack) {
		$.HttpUtil.doAjax(_getTemplateDataUrl, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};

	/**
	 * 编辑解决方案（组)
	 */
	this.updatePlatFormFile =function(callBack,param){
		$.HttpUtil.doAjax(_updatePlatFormFileUrl, param, function(ret) {
			if(callBack){
				callBack(param);
			}
		});
	};
	
	/**
	 * 删除解决方案（组)
	 */
	this.deletePlatFormDir = function(callBack,param){
		$.HttpUtil.doAjax(_deletePlatFormDirUrl, param, function(ret) {
			if(callBack){
				callBack(param);
			}
		});
	};
	
	/**
	 * 保存解决方案
	 */
	this.updateDescribeById = function(callBack,param){
		$.HttpUtil.doAjax(_updateDescribeByIdUrl, param, function(ret) {
			if(callBack){
				callBack(ret.returnFlag);
			}
		});
	};

	/**
	 * 获取整个解决方案树
	 */
	this.getPFTreeData = function(callBack,param){
		$.HttpUtil.doAjax(_getPFTreeDataUrl, param, function(ret) {
			if(callBack){
				callBack(ret.data);
			}
		});
	};
	
	/**
	 * 获取当前用户的喜好的解决方案
	 */
	this.getFavoritePlatForm = function(callBack,param){
		$.HttpUtil.doAjax(_getFavoritePlatFormUrl, param, function(ret) {
			if(callBack){
				callBack(ret.data);
			}
		});
	};
	
	/**
	 * 获取当前用户的喜好的解决方案及其递归操作到父解决方案
	 */
	this.getFavPlatFormList = function(callBack,param){
		$.HttpUtil.doAjax(_getFavPlatFormListUrl, param, function(ret) {
			if(callBack){
				callBack(ret.data);
			}
		});
	};
	
	/**
	 * 保存当前用户的喜好的解决方案
	 */
	this.saveFavoritePlatForm = function(callBack,param){
		$.HttpUtil.doAjax(_saveFavoritePlatFormUrl, param, function(ret) {
			if(callBack){
				callBack(ret.data);
			}
		});
	};
	
	/**
	 * 保存当前用户访问解决方案的日志
	 */
	this.savePlatFormLog = function(callBack,param){
		$.HttpUtil.doAjax(_savePlatFormLogUrl, param, function(ret) {
			if(callBack){
				callBack(ret.data);
			}
		});
	};
	
	/**
	 * 保存排序后的解决方案
	 */
	this.sortSolution = function(callBack, param){
		var _url = _sortSolutionUrl + '?file=['+param+']';
		$.HttpUtil.doAjax(_url, param, function(ret) {
			if(callBack){
				callBack(ret.data);
			}
		});
	};
	
	this.getIsotopeData = function(callBack, param, visitType){
		$.HttpUtil.doAjax(_IsotopeDataUrl, param, function(ret) {
			if(callBack){
				callBack(ret.data,param);
			}
		});
	};
	
	this.getIsotopeFirstLevelData = function(callBack, param, visitType){
		$.HttpUtil.doAjax(_IsotopeFirstLevelDataUrl, param, function(ret) {
			if(callBack){
				callBack(ret.data,param);
			}
		});
	};

	/**
	 * 根据解决方案名称获取父ID
	 */
	this.getPlatFormParentIdByName = function(callBack, param){
		$.HttpUtil.doAjax(_getPlatFormParentIdByNameUrl, param, function(ret) {
			if(callBack) {
				callBack(ret.data);
			}
		});
	};
}