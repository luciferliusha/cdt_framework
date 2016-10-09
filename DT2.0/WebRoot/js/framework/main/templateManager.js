/** 模板库管理入口 */

/** 全局变量的定义 */


/** VIEW的定义 */
var templateManageView;

$(function(){
	init();
});


/**
 * 初始化
 */
function init(){
	templateManageView = new TemplateManageView();
	templateManageView.init();
}
