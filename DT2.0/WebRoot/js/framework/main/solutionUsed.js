/** 构件使用日志入口 */

/** 全局变量的定义 */


/** VIEW的定义 */
var solutionUsedView;

$(function(){
	loadCssForCom(path,"solutionUsed.css");
	init();
});


/**
 * 初始化
 */
function init(){
	solutionUsedView = new SolutionUsedView();
	solutionUsedView.init();
}
