/**
 * 构件使用日志VIEW
 */

function AppUsedView(){
	
	/** 构件使用日志service */
	var appUsedService = new AppUsedService();
	
	/**
	 * 渲染数据
	 * @param data
	 * @returns
	 */
	var randerGridView = function(gridUrl) {
		$("#appUsedGrid").datagrid({
			fitColumns:true,	//自适应列宽
			height:307,
			//width:900,
			autoRowHeight:false,
			nowrap:false,
			url:gridUrl,
			striped:true,	//显示条纹
			singleSelect:true,
			//pageSize:_pageSize,
			//showFooter:true,
			//rownumbers:true,
			pagination:true,
			pagePosition: "top",
			columns:[[   
				        {field:'appName',title:'构件',width:300,align:'left'},
				        {field:'hotNum',title:'使用次数',width:150,align:'center'}
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
		creatChart('appUsedPie', data);
		resize();
	};
	
	/**
	 * 获取构件使用日志数据
	 * @returns
	 */
	var getPieData = function() {
		appUsedService.getPieData(randerPieView);
	};
	
	var resize = function() {
		var chart = $('#appUsedPie').highcharts();
		if(chart != null){
			chart.setSize($(".main").width()*0.49-1,305);
		}
	};

	/**
	 * 初始化
	 */
	this.init = function() {
		randerGridView(appUsedService.getGridDataUrl());
		getPieData();
	};
}