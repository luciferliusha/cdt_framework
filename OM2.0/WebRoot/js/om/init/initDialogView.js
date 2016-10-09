/**
 * 初始化OM的弹出窗口
 */
var newWinView;
var renameWinView;
var newResourceView;
var confirmView;
var relieveView;
var moreInformationView;
var nameLimit = 13;//组织和用户详细页面时包含用户或所属组织的名字长度限制
var userFirstRelieve = false;//用户移至页面刚打开时，设为true，用户控制不让至少选择一个用户这个提示显示
$(function() {
	/** 初始化新增窗口 */
	newWinView = new NewWinView();
	renameWinView = new RenameWinView();
	confirmView = new ConfirmView();
	relieveView = new RelieveView();
	moreInformationView = new MoreInformationView();
	newResourceView = new NewResourceView();
});