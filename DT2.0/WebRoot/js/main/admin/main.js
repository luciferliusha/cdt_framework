$(function(){
	_.templateSettings = {
			interpolate:/\{\{(.+?)\}\}/g
	};
	
	var topView = new TopView();
	var managerView = new ManagerView();
	var appGroupView = new AppGroupView();
	var solutionGroupView = new SolutionGroupView();
})