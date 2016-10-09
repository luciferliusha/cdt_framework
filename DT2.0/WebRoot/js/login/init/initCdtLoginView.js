var selectedId = "";//选中的解决方案ID，null默认为第1个，以后支持localStorage则默认为退出前的ID
var cdtLoginView = null;
$(function() {
	_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
	};
	cdtLoginView = new CdtLoginView();
	var cdtSigninView = new CdtSigninView(); 
});