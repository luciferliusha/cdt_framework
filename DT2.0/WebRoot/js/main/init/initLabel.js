var labelView;
var i = 0;//右上角table显示内容
var index = 1;//右上角table显示位置
var showFirstLabel = 0;//显示的第一个标签
var showLastLabel = 0;//显示的最后一个标签
var selectLabelId = "";//选中标签ID
var selectLabelChangeType="";//选中标签的切换类型
var selectLabelContentId = "";//选中标签显示内容的ID
var selectSolutionTitleItem;//选中解决方案组标题列表子项
var solutionSelectItemId = "";
var maxZIndex = 900;
var SELECT_LABEL = 0;
var SELECT_SOLUTION = 1;
var labelSort = new Array();
$(function(){
	if (isSessionOut == true && needSession == true) {
		return;
	}
	//防止Underscore的默认<%=和jsp冲突,修改为{{}}
	_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
	};

});

function initLabel() {
	labelView = new LabelView();
}
