var solutionOperateView;
var solutions;//解决方案collection
var selectedSolutionData = new HashMap();//用来存放显示中的解决方案组中选择的解决方案,key是整个解决方案(组)div的Id
var slutionTypeData = new HashMap();//用来存放解决方案(组)的类型,key 是解决方案(组)li的id,value 是其类型0：解决方案组;1:解决方案
var operateTitleLimit = 22;//操作路径字数限制
var solutionLimit = 18;//解决方案标题字数限制
var firSolutionData = new HashMap();//key是第一层数据的parentId 0,值是第一层的数据
var solutionData = new HashMap();//key是第一层以下的解决方案组pfId,值是解决方案(组)数据
var pfIdData = new HashMap();//key:解决方案(组)的li id,value是其pfId
var solutionLabels = new HashMap();//key:解决方案id, value:页签和工作区数据
var isSolutionClickCount = false;//是否点击解决方案通知后台进行点击数的统计
var solutionGroupInfo = new HashMap();//2层菜单情况下存放数据，id为解决方组pfId，value为解决方案的json信息solutionGroupInfo
var solutionInfo = new HashMap();//2层菜单情况下存放数据，id为解决方案(组)div的ID，value为解决方案的json信息
var selectedSolutionDivId = null;//2层菜单情况下选中的解决方案的div的Id
var openedSolutionDivId = null;//2层菜单情况下，展开的解决方案组的div的Id
$(function(){
	if (isSessionOut == true && needSession == true) {
		return;
	}
	//防止Underscore的默认<%=和jsp冲突,修改为{{}}
	_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
	};
});

/**
 * 初始化
 */
function initSolution() {
	solutionOperateView = new SolutionOperateView();	
}

function initSolutionView() {
	var solutionView = new SolutionView();
}

/**
 * 温州图标转换
 * @param solution_name
 * @returns
 */
var wz_solution_pic_n = function(solution_name){
	if (solution_name.indexOf("车辆监管") != -1) {
		return "wz-solution-list-item-traffic-n";
	}
	else if (solution_name.indexOf("线路监管") != -1) {
		return "wz-solution-list-item-diecction-n";
	}
	else if (solution_name.indexOf("业户监管") != -1) {
		return "wz-solution-list-item-staffprofile-n";
	}
	else if (solution_name.indexOf("道路监管") != -1) {
		return "wz-solution-list-item-map-n";
	}
	else if (solution_name.indexOf("执法监管") != -1) {
		return "wz-solution-list-item-police-n";
	}
	else if (solution_name.indexOf("空间标注") != -1) {
		return "wz-solution-list-item-marker-n";
	}
	else {
		return "wz-solution-list-item-file-n";
	}
};

/**
 * 温州图标转换
 * @param solution_name
 * @returns
 */
var wz_solution_pic_f = function(solution_name){
	if (solution_name.indexOf("车辆监管") != -1) {
		return "wz-solution-list-item-traffic-f";
	}
	else if (solution_name.indexOf("线路监管") != -1) {
		return "wz-solution-list-item-diecction-f";
	}
	else if (solution_name.indexOf("业户监管") != -1) {
		return "wz-solution-list-item-staffprofile-f";
	}
	else if (solution_name.indexOf("道路监管") != -1) {
		return "wz-solution-list-item-map-f";
	}
	else if (solution_name.indexOf("执法监管") != -1) {
		return "wz-solution-list-item-police-f";
	}
	else if (solution_name.indexOf("空间标注") != -1) {
		return "wz-solution-list-item-marker-f";
	}
	else {
		return "wz-solution-list-item-file-f";
	}
};

/**
 * 图标转换
 * @param solution_name
 * @returns
 */
var getSolutionPicNormal = function(solution_name, type){
	if (solution_name.indexOf("行业总览") != -1) {
		return "solution-list-general-n";
	}
	else if (solution_name.indexOf("车辆监管") != -1 || solution_name.indexOf("车辆动态监管") != -1) {
		return "solution-list-cl-n";
	}
	else if (solution_name.indexOf("业户监管") != -1 || solution_name.indexOf("业户动态监管") != -1) {
		return "solution-list-yh-n";
	}
	else if (solution_name.indexOf("出租车") != -1) {
		return "solution-list-czc-n";
	}
	else if (solution_name.indexOf("96520") != -1) {
		return "solution-list-96520-n";
	}
	else if (solution_name.indexOf("城市公交") != -1) {
		return "solution-list-gj-n";
	}
	else if (solution_name.indexOf("行政执法") != -1) {
		return "solution-list-xzzf-n";
	}
	else if (solution_name.indexOf("数据查询") != -1) {
		return "solution-list-query-n";
	}
	else if (solution_name.indexOf("标准规范") != -1) {
		return "solution-list-bzgf-n";
	}
	else if (solution_name.indexOf("两客一危") != -1) {
		return "solution-list-lkyw-n";
	}
	else if (solution_name.indexOf("配置") != -1) {
		return "solution-list-setting-n";
	}
	else {
		if (type == 0) {
			return "list_folder_n";
		}
		else {
			return "list_file_n";
		}
	}
};

/**
 * 图标转换
 * @param solution_name
 * @returns
 */
var getSolutionPicForcus = function(solution_name, type){
	if (solution_name.indexOf("行业总览") != -1) {
		return "solution-list-general-f";
	}
	else if (solution_name.indexOf("车辆监管") != -1 || solution_name.indexOf("车辆动态监管") != -1) {
		return "solution-list-cl-f";
	}
	else if (solution_name.indexOf("业户监管") != -1 || solution_name.indexOf("业户动态监管") != -1) {
		return "solution-list-yh-f";
	}
	else if (solution_name.indexOf("出租车") != -1) {
		return "solution-list-czc-f";
	}
	else if (solution_name.indexOf("96520") != -1) {
		return "solution-list-96520-f";
	}
	else if (solution_name.indexOf("城市公交") != -1) {
		return "solution-list-gj-f";
	}
	else if (solution_name.indexOf("行政执法") != -1) {
		return "solution-list-xzzf-f";
	}
	else if (solution_name.indexOf("数据查询") != -1) {
		return "solution-list-query-f";
	}
	else if (solution_name.indexOf("标准规范") != -1) {
		return "solution-list-bzgf-f";
	}
	else if (solution_name.indexOf("两客一危") != -1) {
		return "solution-list-lkyw-f";
	}
	else if (solution_name.indexOf("配置") != -1) {
		return "solution-list-setting-f";
	}
	else {
		if (type == 0) {
			return "list_folder_s";
		}
		else {
			return "list_file_s";
		}
	}
};
