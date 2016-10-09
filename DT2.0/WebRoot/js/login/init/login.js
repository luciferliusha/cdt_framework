/**
 * 
 */
var loginView;
$(function(){
	_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
	};
	loginView = new LoginView();
	var signinView = new SigninView(); 
});