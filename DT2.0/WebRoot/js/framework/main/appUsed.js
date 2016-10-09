/** 构件使用日志入口 */

/** 全局变量的定义 */


/** VIEW的定义 */
var appUsedView;

$(function(){
	init();
});


/**
 * 初始化
 */
function init(){
	appUsedView = new AppUsedView();
	appUsedView.init();
}
