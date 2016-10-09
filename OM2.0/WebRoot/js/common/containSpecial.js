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
	email: "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$",//邮件
	//url:"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$"//url
	url: "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-\{\}\:\"]+))*$",//url
	password:"^[0-9A-Za-z\\!\\$\\%\\^\\&\\*\\.\\~\\_\\-\@\\,\\.]{6,16}$",//密码(请输入6-16位数字、字母或符号，区分大小写)
	phone:"^(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{7,8}$",//电话号码
	mobilePhone: "^1[0-9]{10}$",//手机号码
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
	isPassword:function(str){
		return new RegExp(validateRegExp.password).test(str);
	},
	isPhone:function(str){
		return new RegExp(validateRegExp.phone).test(str);
	},
	isMobilePhone:function(str){
		return new RegExp(validateRegExp.mobilePhone).test(str);
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
	   var txt=new RegExp("[ ,\\`,\\~,\\!,\\@,\#,\\$,\\^,\\+,\\*,\\&,\\\\,\\/,\\?,\\|,\\:,\\.,\\<,\\>,\\{,\\},\\'',\\;,\\=,\"]"); 
	   //特殊字符正则表达式 
	   if (txt.test(character)) {
	    if (document.all) { 
	     window.event.returnValue = false; 
	    } else { 
	     arguments.callee.caller.arguments[0].preventDefault(); 
	    } 
   }
}

