/**
 * 动态加载、移除和替换css文件
 * 
 * @param filename
 * @return
 */

var headerCssName, menuCssName;
// 动态加载css文件
var loadCssFile = function(filename) {
	var fileref = document.createElement("link");
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", path+'/css/'+filename);
	if (typeof fileref != "undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}
	return fileref;
};

// 动态移除css文件
var removeCssFile = function(fileName) {
	var targetelement = "link";
	var targetattr = "href";
	var allsuspects = document.getElementsByTagName(targetelement);
	for ( var i = allsuspects.length; i >= 0; i--) {
		if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null
				&& allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
			allsuspects[i].parentNode.removeChild(allsuspects[i]);
		}
	}
};

// 动态替换css文件
var replaceCssFile = function(oldFileName, newFileName) {
	var targetelement = "link";
	var targetattr = "href";
	var allsuspects = document.getElementsByTagName(targetelement);
	for ( var i = allsuspects.length; i >= 0; i--) {
		if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null
				&& allsuspects[i].getAttribute(targetattr).indexOf(oldFileName) != -1) {
			var newelement = loadCssFile(newFileName);
			allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i]);
		}
	}
};

//动态加载css文件的函数  
function loadCss(url,callBack) {  
    //<link href="css/main.css" rel="stylesheet" type="text/css" />  
    var link = document.createElement("link");  
    link.rel = "stylesheet";  
    link.type = "text/css";  
    link.href = url;  
    document.getElementsByTagName("head")[0].appendChild(link);
    if(callBack != null){
        callBack();
    }
} 

//判断当前首页颜色类型并且为系统管理下的各个页面加载对应的CSS文件
function loadCssForCom(contextPath,cssFile){
	var stylecookie = getCookieValue("cds-dt-header-css").split(/[_.]/)[1];
	var cssurl = (stylecookie != null)?contextPath+"/css/"+stylecookie+"/"+cssFile:contextPath+"/css/"+style+"/"+cssFile;
	loadCss(cssurl,function(){
		$("body").show();
	});
}