var controlClicked = false;
var confirmView;
var newWinView;
var renameWinView;
var frameTitleConfigView;
var shareUserData;//分享的用户列表
var pfSharedUsers;//具体某个解决方案的分享后的用户
var labelSettingView;//页签设置窗口
var solutionEditWinView;//解决方案新增或者编辑窗口
$(function(){
	if (isSessionOut == true && needSession == true) {
		return;
	}
	//防止Underscore的默认<%=和jsp冲突,修改为{{}}
	_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
	};		
});

function initTop() {
	var topView = new TopView();
	confirmView = new ConfirmView();
	newWinView = new NewWinView();
	renameWinView = new RenameWinView();
	frameTitleConfigView = new FrameTitleConfigWinView();
	var shareView = new ShareView();
}