/**
 * 判断特殊字符工具类
 * @author songd
 * @date 2013-04-18
 */
/**
 * 常用字符验证规则
 * @copy from jsCommon
 */
var validateRegExp={
	email: "/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/",//"^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$",//邮件
	//url: "^(http|https)\://((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-\{\}\:\"]+))*$",
	//url:"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",//url
	url: "^(http|HTTP|https|HTTPS|ftp|FTP)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-\{\}\:\"\\[\\]]+))*$",//url
	singleQuotation: "[\\''\<\>]"//单引号'<>
};

/**
 * 常用字符验证
 */
var validateRules={
	isUrl:function(str){
		return new RegExp(validateRegExp.url).test(str);
	},
	isEmail:function(str) {
		return new RegExp(validateRegExp.email).test(str);
	},
	isSingleQuotation:function(str) {
		return new RegExp(validateRegExp.singleQuotation).test(str);
	}
};

/**
 * 判断一个字符串中的特殊字符，如果有特殊字符则返回true
 * 
 * @param s 拿来判断的字符串
 */

function containSpecial(s)       
{       
   var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);       
   return (containSpecial.test(s));       
}

/**
 * 禁止键盘输入特殊符号
 */
function ValidateSpecialCharacter() {
	   var code; 
	   if (document.all) { //判断是否是IE浏览器
	    code = window.event.keyCode; 
	   } else { 
	    code = arguments.callee.caller.arguments[0].which; 
	   } 
	   var character = String.fromCharCode(code);
	   var txt=new RegExp("[ ,\\`,\\~,\\!,\\@,\#,\\$,\\%,\\^,\\+,\\*,\\&,\\\\,\\/,\\?,\\|,\\:,\\.,\\<,\\>,\\{,\\},\\(,\\),\\'',\\;,\\=,\"]"); 
	   //特殊字符正则表达式 
	   if (txt.test(character)) {
	    if (document.all) { 
	     window.event.returnValue = false; 
	    } else { 
	     arguments.callee.caller.arguments[0].preventDefault(); 
	    } 
   }
}

/**
 * 替换特殊字符，目前替换井号，后续有其他请加入
 * @param str
 * @returns
 */
function replaceSpecialCharacter(str) {
	return str.replace(/\%/ig,"\%25").replace(/\#/ig,"\%23").replace(/\&/ig,"\%26");
}

/**
 * 替换"，目前替换"，后续有其他请加入
 * @param str
 * @returns
 */
function replaceQuotation(str) {
	return str.replace(/\"/ig,"\\\"");
}

/**
 * 禁止键盘输入特殊符号井号和单引号
 */
function validateSpecialCharacterSimple() {
	var code;
	if (document.all) { //判断是否是IE浏览器
		code = window.event.keyCode;
	} else {
		code = arguments.callee.caller.arguments[0].which;
	}
	var character = String.fromCharCode(code);
	var txt = new RegExp("[\#,\\'']");
	//特殊字符正则表达式 
	if (txt.test(character)) {
		if (document.all) {
			window.event.returnValue = false;
		} else {
			arguments.callee.caller.arguments[0].preventDefault();
		}
	}
}