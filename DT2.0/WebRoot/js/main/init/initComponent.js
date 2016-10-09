var componentTitles;//构件第一层collection
var componentApps;//构件第二层collection
var componentView;
var componentTitleLimit = 44;//构件标题字数限制
var componentLimit = 26;//构件内容字数限制
$(function(){
	//防止Underscore的默认<%=和jsp冲突,修改为{{}}
//	_.templateSettings = {
//			interpolate : /\{\{(.+?)\}\}/g
//	};
	if (isSessionOut == true && needSession == true) {
		return;
	}
});

/**
 * 初始化构件
 */
function initComponet() {
	var componentOperateView = new ComponentOperateView();
	componentView = new ComponentView();
}