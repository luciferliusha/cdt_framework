/** 图标库管理入口 */

/** 全局变量的定义 */


/** VIEW的定义 */
var iconManageView;

$(function(){
	init();
});


/**
 * 初始化
 */
function init(){
	iconManageView = new IconManageView();
	iconManageView.init();
}
