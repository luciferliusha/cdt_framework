/**
 * 限制名字长度工具类
 * @author songd
 * @date 2013-04-03
 */

/**
 * 限制div下的span中文字的长度，超过部分用...
 * 
 * @param id 包含文字div的id
 * @param length 限制的长度 数字和字母的长度为1，汉字的长度为2
 */
function limit(id,length){
	var len = 0;
	var text = "";
	$("#" + id).each(function(){
		var str = $(this).children("span").text();
		for(var j = 0;j < str.length;j++){
			var c = str.charCodeAt(j);
			if((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)){
				len++;
			}
			else{
				len += 2;
			}
			if(len == length){
				if(j < (str.length-1)){
					text = str.substring(0,j+1);
					if(SOLUTION_SCAN_TYPE == 1){
						$(this).children("span").html(text + '...' );
					}else{
						$(this).children("span").html(text);
					}
					$(this).children("span").attr("title",str);
					break;
				}
			}
			else if(len > length){
				text = str.substring(0, j);
				if(SOLUTION_SCAN_TYPE == 1){
					$(this).children("span").html(text + '...' );
				}else{
					$(this).children("span").html(text);
				}
				$(this).children("span").attr("title",str);
				break;
				
			}
			else{
				$(this).children("span").removeAttr("title");
			}
		}						
	});
}	

/**
 * 限制文字中的长度，超过部分用...
 * @param name 需要限制长度的文字
 * @param length 限制的长度 数字长度为1，字母的长度为1.5，汉字的长度为2
 */
function name_limit(name,length){
	var len = 0;
	for ( var i = 0; i < name.length; i++) {
		var c= name.charCodeAt(i);
		if((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)){
			if(c>= 48 && c<=57){//数字
				len++;
			}
			else{//字母
				len = len + 1.5;
			}
		}
		else{
			len += 2;
		}
		if(len == length){
			
		}
		
		if(len == length){
			if(i < (name.length-1)){
				name = name.substring(0,i+1) + "...";
				break;
			}
		}
		else if(len > length){
			name = name.substring(0, i) + "...";			
			break;
			
		}
	}
	return name;
}