/**
 * GIS异常告警调用JS
 */
$(function(){
	var warningNum = 0;
	var cdtWarningTimer = null;//定时器
	var waringMillisec = 1000*60*2;//2分钟刷新一次
	var cdtCheckTimer = null;//判断定时器
	var checkNum = -1;
	
//	if (isSessionOut == false) {
		getWarningInfo();
		cdtWarningTimer = setInterval(getWarningInfo, waringMillisec);
//	}
	
	/** 获取告警信息 */
	function getWarningInfo() {
		warningNum = 0;
		checkNum = -1;
		$("#warning_table").empty();//先清除信息
		$("#warning_table").append("<tr id='warning_title' style='height:14px;'><th colspan='2'>异常告警</th></tr>");
		$("#warning_table").width("100%");
		$("#warning_table").height("100%");
		$("#warning_table").css("text-align","center");
//		CEarlyWarningService(userId,function(data){
//			//返回数据格式为：xxx路xxx南1（400米范围内）聚集20辆车
//			//在这里处理返回数据
//			warningNum++;
//			if (warningNum > 5) {//只显示5个
//				return;
//			}
//			addWarningToTable(data);
//		});
		var _url = "http://localhost:8080/DA/daQueryData.do";
		var _param = {data:JSON2.stringify({"id":"ptzhjg_qycl_jq_zdy_bj","where":{"gps_time":{"data":"20141027","where":"=","isReplace":true}}})};
		$.ajax({
			type : "post",
            dataType : "json",
            url : _url,
            data : _param,
			success: function(response){
				var total = response.total;
				var rows = response.rows;
				if(total > 0){
					addWarningToTable(total,rows);
				}
			}
		});
	}
	/** 添加告警信息 */
	function addWarningToTable(total,rows) {
//		if (warningNum <= 5) {
//			$("#warning_table").append("<tr><td><div class='rank-num-top'>0"+ warningNum + "</div></td><td style='padding-top: 6px;'>" + message + "</td></tr>");
//			if (warningNum == 1) {
//				cdtCheckTimer = setInterval(checkWarningEnd, 500);//判断
//			}
//		}
		for(var i=0; i<total; i++){
			$("#warning_table").append("<tr style='height:40px;'><td><div style='width:100%;' class='rank-num-top'>"+ rows[i].MARKNAME + "</div></td><td style='padding-top: 6px;'>" + rows[i].MARKTYPE + "</td></tr>");
		}
		$(".panel.window").remove();
		showTipMessage($("#menuBox").html());
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
	
	/** 弹出提示框 */
	function showTipMessage(msg) {
		$.messager.show({
			title:'信息提示',
			msg:msg,
			timeout:0,
			showType:'slide',
			width: document.body.clientWidth,
			width:400,
			height:280,
			right:0
		});
	}
});