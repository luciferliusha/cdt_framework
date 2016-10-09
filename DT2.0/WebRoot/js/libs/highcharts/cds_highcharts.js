function creatChart(container, mainStr, menus) {
	// Color 颜色选项
	var pie_name_limit = 26;//饼图中名称的长度限制
	var mainJsonobj = mainStr;
	var colors = [ '#ed561b', '#50b432', '#058dc7', '#765d93', '#dddf00',
			'#ff9655', '#64e572', '#24cbe5', '#856Af9', '#fff263', '#e8a18e',
			'#2ee176', '#54a0ee', '#ca2ee1', '#e2e66c', '#c7644d', '#9fc749',
			'#3e798e', '#8c3ebe', '#ffca63' ];
	// 设置图表的颜色方案
	Highcharts.setOptions( {
		colors : colors,
		lang : {
			numericSymbols : null
		}
	});
	// Chart 图表区选项
	var chartJsonobj = mainJsonobj.chart;
	var chart_inverted = chartJsonobj.inverted;
	var seriesType = chartJsonobj.defaultSeriesType;
	var chart_background = chartJsonobj.backgroundColor;
	var chart_margin = chartJsonobj.margin;
	if (seriesType == undefined) {
		seriesType = "column";
	}
	if(chart_background == undefined){
		chart_background = "#F2F7F7";
	}
	if(chart_margin == undefined){
		chart_margin = [null];
	}
	
	// tooltip
	var tooltip;
	tooltip = mainJsonobj.toolTip;
	var tooltipValue = mainJsonobj.toolTipValue;
	
	if (tooltip != undefined) {
		var valuePrefix = tooltip.valuePrefix;
		if (valuePrefix == undefined)
			valuePrefix = '';
		var valueSuffix = tooltip.valueSuffix;
		if (valueSuffix == undefined)
			valueSuffix = '';
	} else {
		var valuePrefix = '';
		var valueSuffix = '';
	}
	// Title：标题选项
	var titleJsonobj = mainJsonobj.title;
	var title_text = titleJsonobj.text;
	var title_style_font = titleJsonobj.font;
	var title_style_color = titleJsonobj.color;
	
	/**用于在标题上添加前缀、中间说明、后缀等*/
	var titleValue = titleJsonobj.titleValue;
	if(titleValue != undefined){
		for ( var i = 0; i < titleValue.length; i++) {
			if ($("#" + titleValue[i].DataBaseName).length > 0) {
				var value = "";
				if(titleValue[i].type != undefined  && titleValue[i].type == "text"){//获取的查询条件的类型,不传入则默认为combobox类型
					value = $.trim($("#" + titleValue[i].DataBaseName).val());
				}
				else{
					if($("#" + titleValue[i].DataBaseName).combobox("getText") == "全部" || 
							$("#" + titleValue[i].DataBaseName).combobox("getText") == "请选择" ||
							$("#" + titleValue[i].DataBaseName).combobox("getText") == ""){						
							title_text = title_text.replace("["+i+"]", "");
							continue;
					}
					else{
						value = $("#" + titleValue[i].DataBaseName).combobox("getText");
					}
				}
				
				if(titleValue[i].format != undefined && titleValue[i].format == "YYYYMM" &&//格式化
						$.trim($("#" + titleValue[i].DataBaseName).val()).length == 6){//查询条件中的数据为6位
					value = value.substr(0,4) + "年" + value.substr(4,2) + "月";
					
				}
				
				title_text = title_text.replace("["+i+"]", titleValue[i].valuePrefix + value + titleValue[i].valueSuffix);						
			}
		}
	}

	// Subtitle：副标题选项
	var subtitleJsonobj = mainJsonobj.subtitle;
	var subtitle_text = subtitleJsonobj.text;
	var subtitle_style_font = subtitleJsonobj.font;
	var subtitle_style_color = subtitleJsonobj.color;

	// xAxis：X轴选项
	var xAxis = mainJsonobj.xAxis;

	// yAxis：Y轴选项
	var yAxis = mainJsonobj.yAxis;

	// Series：数据列选项
	var series = mainJsonobj.series;
	
	// 图下方文字说明
	var note = mainJsonobj.note;
	var noteHeight = 0;
	if (note != undefined) {
		var noteStyle = note.style;
		var noteContent = note.content;
		if ($("#" + container + "_note").length > 0) {
			if (noteStyle != undefined) {
				$("#" + container + "_note").css(noteStyle);
			}
			if (noteContent != undefined) {
				if(mainJsonobj.series[0].type == "pie"){//饼状图，判断替换图下方说明
					var total = 0;					
					for ( var i = 0; i < series[0].data.length; i++) {
						total = total + series[0].data[i][1];
						noteContent= noteContent.replace("[" + series[0].data[i][0] + "]",series[0].data[i][1]);
					}
					noteContent = noteContent.replace("[pie_total]",total+"");
				}
				$("#" + container + "_note").html(noteContent);
			}
			noteHeight = $("#" + container + "_note").height();
		}
	}
	// Legend：图例选项
	var legendJsonobj = mainJsonobj.legend;
	var legend_layout = legendJsonobj.layout;
	var legend_borderWidth = legendJsonobj.borderWidth;
	var legend_align = legendJsonobj.align;
	var legend_verticalAlign = legendJsonobj.verticalAlign;
	var legend_width = legendJsonobj.width;
	var legend_symbolWidth = 16;//图例标志的宽度，默认16
	if (legend_width == undefined) {
		legend_width = document.documentElement.clientWidth;
	}
	var legend_height = legendJsonobj.height;
	if (legend_height == undefined) {
		legend_height = document.documentElement.clientHeight;
		if ($("#" + container + "_form").length > 0) {
			legend_height = legend_height - noteHeight
				- $("#" + container + "_form").height() - 30;
				jHeight = noteHeight + $("#" + container + "_form").height() + 30;
		}
		else {
			legend_height = legend_height - noteHeight - 30;
		}
	}
	if(series.length == 1 && series[0].type == "column"){//只有一组柱状图时，图例标志的宽度设为0
		legend_symbolWidth = 0;
	}
	


	// plotOptions：数据点选项
	var plotOptionsJsonobj = mainJsonobj.plotOptions;
	var column_enabled = plotOptionsJsonobj.column_enabled;
	var column_stacking = plotOptionsJsonobj.column_stacking;
	var line_enabled = plotOptionsJsonobj.line_enabled;
	var cursor_type = plotOptionsJsonobj.cursor;
	var pie_dataLabels_distance = plotOptionsJsonobj.pie_dataLabels_distance;
	var pie_dataLabels_showNumber = plotOptionsJsonobj.pie_dataLabels_showNumber;
	var pie_size = plotOptionsJsonobj.pie_size;
	var series_groupPadding = plotOptionsJsonobj.groupPadding;
	var series_pointPadding = plotOptionsJsonobj.pointPadding;
	var series_pointWidth = plotOptionsJsonobj.pointWidth;
	if(pie_dataLabels_distance == undefined){
		pie_dataLabels_distance = 30;
	}
	if(pie_size == undefined){
		pie_size = null;
	}
	if(series_groupPadding == undefined){
		series_groupPadding = 0.2;
	}
	if(series_pointPadding == undefined){
		series_pointPadding = 0.1;
	}
	if(series_pointWidth == undefined){
		series_pointWidth = null;
	}
	
	// 下钻
	var drillDownJsonobj = mainJsonobj.drill_down;
	$('#' + container).highcharts(
			{
				chart : {
					defaultSeriesType : seriesType,
					inverted : chart_inverted,
					plotBackgroundColor : null,
					backgroundColor : chart_background,
					margin: chart_margin,
					plotBorderWidth : null,
					plotShadow : false,
					width : legend_width,
					height : legend_height
				},
				title : {
					text : title_text,
					style : {
						color : title_style_color,
						font : title_style_font
					}
				},
				subtitle : {
					text : subtitle_text,
					style : {
						color : subtitle_style_color,
						font : subtitle_style_font
					}
				},
				xAxis : xAxis,
				yAxis : yAxis,
				tooltip : {
					enabled : true,
					formatter : function() {
						
						var seriesType = this.series.type;
						var pointName;
						if(seriesType == "pie"){
							pointName = this.point.name.replace(/</g, "&lt;");
						}else{
							pointName = this.series.name;
						}
						var nameSuffix = '';
						var valuePrefix = '';
						var valueSuffix = '';
						var valueExtend = '';
						if (tooltip != undefined) {
							var currentValue = tooltip[this.series.index];
							if(currentValue == undefined)
								currentValue = tooltip[0];
							if (currentValue != undefined) {
								valuePrefix = currentValue.valuePrefix;
								if (valuePrefix == undefined)
									valuePrefix = '';
								valueSuffix = currentValue.valueSuffix;
								if (valueSuffix == undefined)
									valueSuffix = '';
								valueExtend = currentValue.valueExtend;
								if (valueExtend == undefined){
									valueExtend = '';
								}else{
									if(tooltipValue != undefined){
										for(var i=0; i<tooltipValue.length;i++){
											valueExtend = valueExtend.replace("["+i+"]", tooltipValue[i].data[this.point.x]);
										}
									}
									valueExtend = "<br/>" + valueExtend;
								}
								nameSuffix = currentValue.nameSuffix;
								//alert("nameSuffix:"+nameSuffix);
								if (nameSuffix != undefined){
									if(tooltipValue != undefined){
										for(var i=0; i<tooltipValue.length;i++){
											nameSuffix = nameSuffix.replace("["+i+"]", tooltipValue[i].data[this.point.x]!=null?tooltipValue[i].data[this.point.x]:"");
										}
									}
									pointName += nameSuffix;
								}
							}
						}
						
						if (seriesType == 'pie') {// 饼状图
							if (series[0].showValue) {
								var unitText = series[0].text;
								if (unitText == undefined) {
									unitText = "";
								}
								return '<b>' + pointName + '</b>: ' + this.y
										+ unitText + ','
										+ changeTwoDecimal(this.percentage)
										+ '%';
							}
							return '<b>' + pointName + '</b>: '
									+ changeTwoDecimal(this.percentage) + '%';

						} else {// 其他图
							
							return '' + pointName + ',' + this.x + ','
									+ valuePrefix + this.y + valueSuffix + valueExtend;
						}
					}
				},
				legend : {
					layout : legend_layout,
					backgroundColor : null,
					borderColor : "#909090",
					borderWidth : legend_borderWidth,
					align : legend_align,
					verticalAlign : legend_verticalAlign,
					symbolWidth: legend_symbolWidth,
					enabled : true,
					shadow : false
				},
				series : series,
				plotOptions : {

					column : {
						enableMouseTracking : true,
						stacking : column_stacking,
						cursor : cursor_type,
						shadow : false,
						lineWidth : 1,
						point : {
							events : {
								click: function(event){									
									click_funtion(drillDownJsonobj,menus,$('#' + container).highcharts(),this);
            					}
							}
						},
						dataLabels : {
							enabled : column_enabled,
							color : '#333333',
							style : {
								fontWeight : 'normal'
							},
							formatter : function() {
								return this.y;
							}
						}
					},
					line : {
						enableMouseTracking : true,
						cursor : cursor_type,
						shadow : false,
						lineWidth : 2,
						point : {
							events : {
								click: function(event){									
									click_funtion(drillDownJsonobj,menus,$('#' + container).highcharts(),this);
            					}
							}
						},
						dataLabels : {
							enabled : line_enabled,
							color : '#333333',
							style : {
								fontWeight : 'normal'
							},
							formatter : function() {
								return this.y;
							}
						}
					},
					pie : {
						size:pie_size,
						allowPointSelect : true,
						enableMouseTracking : true,
						cursor : cursor_type,
						shadow : false,
						point : {
							events : {
								click: function(event){									
									click_funtion(drillDownJsonobj,menus,$('#' + container).highcharts(),this);
            					}
							}
						},
						dataLabels : {
							enabled : true,
							distance: pie_dataLabels_distance,
							color : '#333333',
							style : {
								fontWeight : 'normal'
							},
							formatter : function() {
								var name = this.point.name.replace(/</g, "&lt;");
								var temp_name = name_limit(name,pie_name_limit);//判断饼图名称长度限制
								if(pie_dataLabels_showNumber != undefined && pie_dataLabels_showNumber){//显示数量
									var unitText = series[0].text;
									if (unitText == undefined) {
										unitText = "";
									}
									return '<b>' + name + '</b>: ' + this.y
											+ unitText + ','
											+ changeTwoDecimal(this.percentage)
											+ '%';
								}
								else{
									return '<b>' + temp_name + '</b>';
								}
							}
						}
					},
					spline : {
						enableMouseTracking : true,
						cursor : cursor_type,
						shadow : false,
						lineWidth : 2,
						point : {
							events : {
								click: function(event){									
									click_funtion(drillDownJsonobj,menus,$('#' + container).highcharts(),this);
            					}
							}
						},
						dataLabels : {
							enabled : line_enabled,
							color : '#333333',
							style : {
								fontWeight : 'normal'
							},
							formatter : function() {
								return this.y;
							}
						}
					},
	            	series:{
	                    groupPadding: series_groupPadding,
	                    pointPadding: series_pointPadding,
	                    pointWidth: series_pointWidth
	                }
				},
				credits : {
					enabled : false
				}
			});

}

function changeTwoDecimal(x) {
	var f_x = parseFloat(x);
	f_x = Math.round(x * 100) / 100;
	return f_x;
}

function formatData(value, isPercent) {
	if (isPercent) {
		return value + "%";
	} else {
		return value;
	}
}

/**
 * 点击图表下钻
 * @param drillDownJsonobj 下钻信息Json对象
 * @param menus 当前图表的查询条件
 * @param chart
 * @param _view
 */
function click_funtion(drillDownJsonobj,menus,chart,_view){	
	if(drillDownJsonobj != undefined){
		var chartId = drillDownJsonobj.chart_id;
		var datas = drillDownJsonobj.data;
		var db = "";
		//组装下钻后图表的查询条件信息
		for ( var i = 0; i < datas.length; i++) {
			var dbName = datas[i].drill_name;//下钻后图表的查询字段		
			var dbValue = "";//下钻后图表查询字段的值
			var dbType = datas[i].drill_name_type;//下钻后图表查询字段的类型
			var where = datas[i].where;//下钻后图表查询字段的条件
			
			var name = datas[i].name;//当前图表的查询字段			
			var type = datas[i].Type;//当前图表查询字段的类型
			var addXAxis = datas[i].addXAxis;
			var connect = datas[i].connect;
			
			if(type == "select" || type == "area_select" || type == "area_select_2"){
				dbValue = $("#" + name).combobox("getValue");
			}
			else{
				dbValue = $.trim($("#" + name).val());
			}
			
			
			if(addXAxis != null && addXAxis){			
				dbValue = dbValue + connect + chart.xAxis[0].categories[_view.x];
			}
			if(i == 0){
				db = '{"dbName":"' + dbName + '","dbValue":"' + dbValue + '","dbType":"' + dbType + '","where":"' + where + '"}';
				continue;
			}
			db = db + ',{"dbName":"' + dbName + '","dbValue":"' + dbValue + '","dbType":"' + dbType + '","where":"' + where + '"}';	
		}										
		db = '"db":[' + db + ']';
		//存储下钻前图表的查询条件信息
		if(menus != undefined){
			var where = "";
			for ( var i = 0; i < menus.length; i++) {
				var dataBaseName = menus[i].DataBaseName;
				var type = menus[i].Type;
				if(i == 0){
					where = '{"dbName":"' + dataBaseName + '","dbValue":"' + $("#" + dataBaseName).val() + '",' + 
						'"dbType":"' + type + '","where":"' + menus[i].where + '"}';
					continue;
				}
				where = where + ',{"dbName":"' + dataBaseName + '","dbValue":"' + $("#" + dataBaseName).val() + '",' + 
					'"dbType":"' + type + '","where":"' + menus[i].where + '"}';
			}
			where = '"db":[' + where + ']';
			
			if(dirllData.get(id) != null){
				dirllData.remove(id);
			}
			dirllData.put(id, where);
		}
		drill_down(chartId,db);
	}
}
