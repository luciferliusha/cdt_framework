/**
 * 初始化用户View
 */
var users;
var userView;
$(function() {
	if (isSessionOut == true && needSession == true) {
		return;
	}
	//防止Underscore的默认<%=和jsp冲突,修改为{{}}
	_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
	};	
});
/**
 * 初始化用户信息
 */
function initUserView() {
	userView = new UserView();
}