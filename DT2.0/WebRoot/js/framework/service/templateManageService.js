/**
 * 模板库Service
 */
function TemplateManageService() {
	
	/** 内部属性及方法 strart */
	var _getTemplateDataUrl = path + "/getAllTemplate.do";
	var _addTemplateDataUrl = path + "/addTemplate.do";
	var _delTemplateDataUrl = path + "/deleteTemplate.do";
	var _updateTemplateDataUrl = path + "/updateTemplate.do";
	
	/** 内部属性及方法 end */
	
	/** ******** 对外方法 ********  */
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
	 * 增加模板
	 */
	this.addTemplateData = function(callBack, param, check_submit, disable, enable) {
		if(check_submit != null && !check_submit.templateManage){//防止表单重复提交
			return;
		}
		if(disable != null){
			disable();
		}
		$.HttpUtil.doAjax(_addTemplateDataUrl, param, function(ret) {
			if(callBack) {
				callBack(ret.data);
			}
		}, function(){
			enable();
		});
	};
	
	/**
	 * 删除模板
	 */
	this.delTemplateData = function(callBack, param) {
		$.HttpUtil.doAjax(_delTemplateDataUrl, param, function(ret) {
			if(callBack) {
				callBack(ret.data);
			}
		});
	};
	
	/**
	 * 更新模板
	 */
	this.updateTemplateData = function(callBack, param, obj) {
		$.HttpUtil.doAjax(_updateTemplateDataUrl, param, function(ret) {
			if(callBack) {
				callBack(ret.data, obj);
			}
		});
	};
}