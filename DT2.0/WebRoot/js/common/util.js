function HashMap() {
	/** Map大小* */
	var size = 0;
	/** 对象* */
	var entry = new Object();
	/** Map的存put方法* */
	this.put = function(key, value) {
		if (!this.containsKey(key)) {
			size++;
			entry[key] = value;
		}
	};
	/** Map取get方法* */
	this.get = function(key) {
		return this.containsKey(key) ? entry[key] : null;
	};
	/** Map删除remove方法* */
	this.remove = function(key) {
		if (this.containsKey(key) && (delete entry[key])) {
			size--;
		}
	};
	/** 是否包含Key* */
	this.containsKey = function(key) {
		return (key in entry);
	};
	/** 是否包含Value* */
	this.containsValue = function(value) {
		for ( var prop in entry) {
			if (entry[prop] == value) {
				return true;
			}
		}
		return false;
	};
	/** 所有的Value* */
	this.values = function() {
		var values = new Array();
		for ( var prop in entry) {
			values.push(entry[prop]);
		}
		return values;
	};
	/** 所有的 Key* */
	this.keys = function() {
		var keys = new Array();
		for ( var prop in entry) {
			keys.push(prop);
		}
		return keys;
	};
	/** Map size* */
	this.size = function() {
		return size;
	};
	/** 清空Map* */
	this.clear = function() {
		size = 0;
		entry = new Object();
	};
}

/** 获取距离当前时间n天的日期,-1为昨天 **/
function getDateStr(n) {
    var today = new Date();
    today.setDate(today.getDate()+n);//获取AddDayCount天后的日期
    var y = today.getFullYear();
    var m = today.getMonth()+1;//获取当前月份的日期
    var d = today.getDate();
    if(m<10){
    	m = "0" + m;
    }
    if(d<10){
    	d = "0" + d;
    }
    return y+"-"+m+"-"+d;
}

/** 获取一年中的第几周 **/
function getYearWeek(a, b, c) {
	/* 
	date1是当前日期 
	date2是当年第一天 
	d是当前日期是今年第多少天 
	用d + 当前年的第一天的周差距的和在除以7就是本年第几周 
	 */
	var date1 = new Date(a, parseInt(b) - 1, c);
	var date2 = new Date(a, 0, 1);
	var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
	return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
};


function formatNum(s, n)   
{   
	n = n > 0 && n <= 20 ? n : 2;   
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
	var l = s.split(".")[0].split("").reverse(),   
	r = s.split(".")[1];   
	t = "";   
	for(var i = 0; i < l.length; i ++ )   
	{   
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
	}   
	return t.split("").reverse().join("") + "." + r;   
} 

//整数每三位加逗号
function formatInt(num)   
{   
	var snum = (num + "").split("").reverse();
	var t = "";   
	for(var i = 0; i < snum.length; i ++ )   
	{   
		t += snum[i] + ((i + 1) % 3 == 0 && (i + 1) != snum.length ? "," : "");
	}
	return t.split("").reverse().join("");   
} 

//日期格式化
Date.prototype.format = function(fmt){    
	var year    =   this.getFullYear();    
	var month   =   this.getMonth()+1;    
	fmt = fmt.replace("yyyy",year);
	fmt = fmt.replace("yy",year%100);
	fmt = fmt.replace("MM",fix(month));
	fmt = fmt.replace("dd",fix(this.getDate()));
	fmt = fmt.replace("hh",fix(this.getHours()));
	fmt = fmt.replace("mm",fix(this.getMinutes()));
	fmt = fmt.replace("ss",fix(this.getSeconds()));
	return fmt;
	function fix(n){
		return n<10?"0"+n:n;
	}
}


