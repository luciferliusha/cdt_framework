/** 图片库管理入口 */

/** 全局变量的定义 */


/** VIEW的定义 */
var picManageView;

$(function(){
	init();
});


/**
 * 初始化
 */
function init(){
	picManageView = new PicManageView();
	picManageView.init();
}
