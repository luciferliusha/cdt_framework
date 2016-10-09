/**
 * 构件使用日志VIEW
 */

function SolutionUsedView(){
	
	/** 构件使用日志service */
	var solutionUsedService = new SolutionUsedService();
	
	/**
	 * 渲染数据
	 * @param data
	 * @returns
	 */
	var randerGridView = function(gridUrl) {
		$("#solutionUsedGrid").datagrid({
			fitColumns:true,	//自适应列宽
			height:307,
			//width:900,
			autoRowHeight:false,
			//nowrap:false,
			url:gridUrl,
			striped:true,	//显示条纹
			singleSelect:true,
			//pageSize:_pageSize,
			//showFooter:true,
			//rownumbers:true,
			pagination:true,
			pagePosition: "top",
			columns:[[   
			          	{field:'userName',title:'用户',width:100,align:'left'},
			          	{field:'logTime',title:'访问时间',width:200,align:'center'},
				        {field:'pfName',title:'解决方案名称',width:150,align:'left'}
				    ]],
			showFooter:false,
			scrollbarSize: 1,
			onBeforeLoad:function(){
			},
			onLoadSuccess:function(){
				$(" .datagrid-body").css("overflow-x","hidden");
			}
		});
		//表格头部字体永久居中
		$('.datagrid-header-inner td div').css({
        	"text-align": "center",
        	"vertical-align": "middle"
        });
	};
	
	/**
	 * 渲染数据
	 * @param data
	 * @returns
	 */
	var randerPieView = function(data) {
		creatChart('solutionUsedPie', data);
		resize();
	};
	
	/**
	 * 获取构件使用日志数据
	 * @returns
	 */
	var getPieData = function(file) {
		solutionUsedService.getPieData(randerPieView, file);
	};
	
	var resize = function() {
		var chart = $('#solutionUsedPie').highcharts();
		if(chart != null){
			chart.setSize($(".main").width()*0.49-1,305);
		}
	};
	
	/**
	 * 绑定搜索按钮事件
	 */
	var bindSearchBtnEvent = function(){
		if(!($._data($("#solutionUsedSearch").get(0), "events") != undefined
				&& $._data($("#solutionUsedSearch").get(0), "events")["click"] != undefined)){
			$("#solutionUsedSearch").bind("click",function(){
				var logTimeStart = $("#logTimeStart").val();
				var logTimeEnd = $("#logTimeEnd").val();
				var queryTime = daysBetween1(logTimeEnd,logTimeStart);
				if (queryTime < 0){
					$.messager.alert("操作提示","开始时间不应大于截止时间，请重新选择时间！","error");
					return;
				}
				var file = '{logTimeStart:"'+logTimeStart+'",logTimeEnd:"'+logTimeEnd+'"}';
				$("#solutionUsedGrid").datagrid("options").url = solutionUsedService.getGridDataUrl(file);
				$("#solutionUsedGrid").datagrid('load');
				getPieData(file);
			});
		}
		
		/**
		 * 求两个时间的天数差 日期格式为 YYYY-MM-dd HH:MM:SS
		 */
		var daysBetween1 = function(DateOne,DateTwo)  
		{   
			var timeBetween = new Date(DateOne.replace(/-/g,"/"))-new Date(DateTwo.replace(/-/g,"/"));
		    return timeBetween;  
		};
	};

	/**
	 * 初始化
	 */
	this.init = function() {
		randerGridView(solutionUsedService.getGridDataUrl());
		getPieData();
		bindSearchBtnEvent();
	};
}