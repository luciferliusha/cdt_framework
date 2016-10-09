/**
 * GIS异常告警调用JS
 */
$(function(){
	var warningNum = 0;
	var cdtWarningTimer = null;//定时器
	var waringMillisec = 1000*60*15;//15分钟刷新一次
	var cdtCheckTimer = null;//判断定时器
	var checkNum = -1;
	
	if (isSessionOut == false) {
		getWarningInfo();
		cdtWarningTimer = setInterval(getWarningInfo, waringMillisec);
	}
	
	/** 获取告警信息 */
	function getWarningInfo() {
		warningNum = 0;
		checkNum = -1;
		$("#warning_table").empty();//先清除信息
		$("#warning_table").append("<tr id='warning_title'><th colspan='2'>异常告警</th></tr>");
		CEarlyWarningService(userId,function(data){
			//返回数据格式为：xxx路xxx南1（400米范围内）聚集20辆车
			//在这里处理返回数据
			warningNum++;
			if (warningNum > 5) {//只显示5个
				return;
			}
			addWarningToTable(data);
		});
	}
	/** 添加告警信息 */
	function addWarningToTable(message) {
		if (warningNum <= 5) {
			$("#warning_table").append("<tr><td><div class='rank-num-top'>0"+ warningNum + "</div></td><td style='padding-top: 6px;'>" + message + "</td></tr>");
			if (warningNum == 1) {
				cdtCheckTimer = setInterval(checkWarningEnd, 500);//判断
			}
		}
	}

	/** 因为是异步，所以要判读是否完全结束 */
	function checkWarningEnd() {
		if (checkNum == warningNum) {
			showTipMessage($("#menuBox").html());
			clearInterval(cdtCheckTimer);
			cdtCheckTimer = null;
		}
		else {
			checkNum = warningNum;
		}
	}
});