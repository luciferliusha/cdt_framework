// =========================================================================
//                          Cookie functions 
// =========================================================================

/** 修改server2008 64位下 显示undefined 问题 modify by linj 20111103 */
function loginFocus(nameId, passwordId, checkId,passwordInfoId) {
	var userid_cookie = getCookieValue("username");
	var pwd_cookie = getCookieValue("password");
	if (userid_cookie != undefined && userid_cookie != "" && userid_cookie != "undefined" && typeof(userid_cookie) != "undefined") {
		$(nameId).val(userid_cookie);
	}
	if (pwd_cookie != undefined && pwd_cookie != "" && pwd_cookie != "undefined" && typeof(pwd_cookie) != "undefined") {
		$(passwordId).val(pwd_cookie);
		$(checkId).removeClass("checkbox-login-n");
		$(checkId).addClass("checkbox-login-p");
		//liux 添加 --为解决'输入密码的提示框在记住密码的情况下，还显示提示'的问题 20130812
		$(passwordInfoId).hide();
		$(passwordId).show();
	}
}

function addCookie(checked, nameId, passwordId) {
	if (checked) {
		var username = $.trim($(nameId).val());
		var password = $(passwordId).val();
		setCookie("username", username, 120, "/");
		setCookie("password", password, 120, "/");
	} else {
		deleteCookie("username", "/");
		deleteCookie("password", "/");
	}
}

//增加OM搜索结果cookie
function addOmSearchCookie(array){
	setCookie("omSearch", array, 120, "/");
};

//获得OM搜索结果cookie
function getOmSearchCookie(){
	return  unescape(getCookieValue("omSearch"));
};

//新建cookie。
//hours为空字符串时,cookie的生存期至浏览器会话结束。hours为数字0时,建立的是一个失效的cookie,这个cookie会覆盖已经建立过的同名、同path的cookie（如果这个cookie存在）。
function setCookie(name, value, hours, path) {
	var name = escape(name);
	var value = escape(value);
	var expires = new Date();
	expires.setTime(expires.getTime() + hours * 3600000);
	path = path == "" ? "" : ";path=" + path;
	_expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
	document.cookie = name + "=" + value + _expires + path;
}

//获取cookie值
function getCookieValue(name) {
	var name = escape(name);
	// 读cookie属性，这将返回文档的所有cookie
	var allcookies = document.cookie;
	// 查找名为name的cookie的开始位置
	name += "=";
	var pos = allcookies.indexOf(name);
	// 如果找到了具有该名字的cookie，那么提取并使用它的值
	if (pos != -1) { // 如果pos值为-1则说明搜索"version="失败
		var start = pos + name.length; // cookie值开始的位置
		var end = allcookies.indexOf(";", start); // 从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
		if (end == -1)
			end = allcookies.length; // 如果end值为-1说明cookie列表里只有一个cookie
		var value = allcookies.substring(start, end); // 提取cookie的值
		return (value); // 对它解码
	} else
		return ""; // 搜索失败，返回空字符串
}

// 删除cookie
function deleteCookie(name, path) {
	var name = escape(name);
	var expires = new Date(0);
	path = path == "" ? "" : ";path=" + path;
	document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path;
}