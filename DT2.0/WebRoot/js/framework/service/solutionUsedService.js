/**
 * 构件使用情况Service
 */
function SolutionUsedService() {
	
	/** 内部属性及方法 strart */
	var _getGridDataUrl = path + "/getPlatFormLog.do";
	var _getPieDataUrl = path + "/getPlatFormLogNum.do";
	/** 图标数据格式  */
	var file = '{logTimeStart:"",logTimeEnd:""}';
	var _pieJson = "{'chart': {'plotBackgroundColor':null,plotBorderWidth: 1},"+
	  "'title': {'text': '','font': 'normal 18px 宋体'}," +
	  "'subtitle': {'text': ''}," +
	  "'legend':{'width':0,'height':0}," +
	  "'series': [{type: 'pie', text: '次', showValue:true, data: []}]," +
	  "'plotOptions': {pie_dataLabels_showNumber:false}"+
	  "}";
	
	/** 内部属性及方法 end */
	
	/** ******** 对外方法 ********  */
	/**
	 * 获取构件使用情况
	 */
	this.getPieData = function(callBack, param) {
		if(param != null && param !=""){
			file = param;
		}
		var url = _getPieDataUrl + "?file="+encodeURIComponent(file)+"&describe=" + encodeURIComponent(_pieJson);
		$.HttpUtil.doAjax(url, null, function(ret) {
			if (callBack) {
				callBack(ret.data);
			}
		});
	};
	
	/**
	 * 获取构件使用情况
	 */
	this.getGridDataUrl = function(param) {
		if(param != null && param !=""){
			file = param;
		}
		return _getGridDataUrl + "?file="+encodeURIComponent(file);
	};
}