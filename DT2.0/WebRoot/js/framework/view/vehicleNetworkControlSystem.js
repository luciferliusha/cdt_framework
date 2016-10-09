/**
 * 温州市重点营运车辆联网联控系统页面
 * @return
 */
var vehicleNetworkControlSystemService;
var presentSelectedId;
var presentSelectedData;
function VehicleNetworkControlSystem(){
	/**
	 * 初始化访问记录
	 */
	var initVisitLog = function(){
		vehicleNetworkControlSystemService = new VehicleNetworkControlSystemService();
		//情况查询内容
		$("#optTimeStart").val("");
		$("#optTimeEnd").val("");
		var url = path + "/getConfigList.do";
//		vehicleNetworkControlSystemService.getAllConfig(buildVisitLog);
		buildVisitLog(url);
		
		VisitLogQueryBtn();
	};
		
	/**
	 * 组装访问记录(近期活动)界面
	 * @param data 接口返回的访问记录数据
	 */
	var buildVisitLog = function(url){
		$("#personal_recent_activity_result_div").datagrid({
			toolbar:'#toolbar',
			fitColumns:true,	//自适应列宽
			height:500,
			//width:900,
			autoRowHeight:false,
			//nowrap:false,
			url:url,
//			data:data,
			striped:true,	//显示条纹
			singleSelect:false,
			//pageSize:_pageSize,
			//showFooter:true,
			//rownumbers:true,
			pagination:true,
			pagePosition: "top",
			columns:[[  
			          	{field:'xh',title:'',width:50,align:'center'},
			          	{field:'ck',checkbox:true}, 
				        {field:'nameCn',title:'参数名称',width:250,align:'left'},
				        {field:'nameEn',title:'英文名称',width:250,align:'left'},
				        {field:'paramType',title:'参数类型名称',width:250,align:'center'},
				        {field:'paramValue',title:'参数值',width:250,align:'right'},
				        {field:'dataType',title:'数据类型',width:250,align:'center'},
				        {field:'enabledFlagName',title:'是否启用',width:250,align:'center'},
//				        {field:'describe',title:'操作',width:250,align:'center'},
				        {field:'id',title:'Id',width:250,align:'center',hidden:true},
				        {field:'opt',title:'操作',width:250,align:'center',
				            formatter:function(value, row, index){
				            	var btn = '<a onclick="readVehicleInfo('+row.id+')" style="color:blue;text-decoration:underline;cursor:pointer;" title="查看">查看</a>'
				            		+'<a onclick="editVehicleInfo('+row.id+')" style="color:blue;text-decoration:underline;cursor:pointer;margin-left: 20px;" title="编辑">编辑</a>';
				                return btn;
				            }
				        }
				    ]],
		//	singleSelect:true,
			showFooter:false,
			scrollbarSize: 1,
			onBeforeLoad:function(param){
			},
			onLoadSuccess:function(data){
				//$(this).datagrid("selectRow",0).datagrid("unselectRow",0);
				$(" .datagrid-body").css("overflow-x","hidden");
			}
		});
	};
	
	var VisitLogQueryBtn = function() {
		if(!($._data($("#pra_query_btn").get(0), "events") != undefined
				&& $._data($("#pra_query_btn").get(0), "events")["click"] != undefined)){//查询按钮时间
			$("#pra_query_btn").bind("click",function(){
				var nameCn = $.trim($("#optTimeStart").val());
				var nameEn = $.trim($("#optTimeEnd").val());
//				var url = path + "/getConfigsByName.do" + 'data={"nameCn":"'+nameCn+'","nameEn":"'+nameEn+'"}';
//				vehicleNetworkControlSystemService.getConfigsByName(data, queryData);
//				$("#personal_recent_activity_result_div").datagrid('options').url = url;
				var param = {"data":'{"nameCn":"'+nameCn+'","nameEn":"'+nameEn+'"}'};
				$("#personal_recent_activity_result_div").datagrid('load', param);
			});
			$("#pra_query_btn").bind("mouseover",function(){
				$(this).removeClass("button-small-01-n");
				$(this).addClass("button-small-01-f");
			});
			$("#pra_query_btn").bind("mouseout",function(){
				$(this).removeClass("button-small-01-f");
				$(this).removeClass("button-small-01-p");
				$(this).addClass("button-small-01-n");
			});
			$("#pra_query_btn").bind("mousedown",function(){
				$(this).removeClass("button-small-01-f");
				$(this).addClass("button-small-01-p");
			});
			$("#pra_query_btn").bind("mouseup",function(){
				$(this).removeClass("button-small-01-p");
				$(this).addClass("button-small-01-f");
			});
		}
		if(!($._data($("#pra_reset_btn").get(0), "events") != undefined
				&& $._data($("#pra_reset_btn").get(0), "events")["click"] != undefined)){//重置按钮事件
			$("#pra_reset_btn").bind("click",function(){
				$("#optTimeStart").val("");
				$("#optTimeEnd").val("");
			});
			$("#pra_reset_btn").bind("mouseover",function(){
				$(this).removeClass("button-small-01-n");
				$(this).addClass("button-small-01-f");
			});
			$("#pra_reset_btn").bind("mouseout",function(){
				$(this).removeClass("button-small-01-f");
				$(this).removeClass("button-small-01-p");
				$(this).addClass("button-small-01-n");
			});
			$("#pra_reset_btn").bind("mousedown",function(){
				$(this).removeClass("button-small-01-f");
				$(this).addClass("button-small-01-p");
			});
			$("#pra_reset_btn").bind("mouseup",function(){
				$(this).removeClass("button-small-01-p");
				$(this).addClass("button-small-01-f");
			});
		}
//		var queryData = function(data){
//			$("#personal_recent_activity_result_div").datagrid('loadData', data);
//		};
	};
	
	//初始化界面
	this.initVehicleNetworkControlSystem = function(){
		initVisitLog();
		
		addInputEvent();
	};
}

function newVehicleInfo(){//添加按钮事件
	var _title = "添加";
	var $template = $("#vehicleSystem_template");
	var type = 0;
	openPopWin(_title, $template, type);
}
function destroyVehicleInfo(){//删除按钮事件
	var _datagrid = $("#personal_recent_activity_result_div");
	var _getChecked = _datagrid.datagrid("getSelections");
	var _data = "";
	for ( var i = 0; i < _getChecked.length; i++) {
		var selectionId = _getChecked[i].id;
		if(i==0){
			_data+=selectionId;
		}else{
			_data+=","+selectionId;
		}
	}
	if(_getChecked.length == 0){
		$.messager.confirm("操作提示", "请选择一条记录", "info");
		return;
	}
	$.messager.confirm("操作提示", "您确定要删除吗？", function () {
		vehicleNetworkControlSystemService.deleteConfig(_data,loadDatagridAgain);
	});
}
function readVehicleInfo(id){//查看按钮事件
	var _title = "查看";
	var $template = $("#vehicleSystemdetail_template");
	var type = 1;
	openPopWin(_title, $template, type);
	vehicleNetworkControlSystemService.getConfigById(id,writeDetail);
}
function editVehicleInfo(id){//编辑按钮事件
	presentSelectedId = id;
	var _title = "编辑";
	var $template = $("#vehicleSystem_template");
	var type = 2;
	openPopWin(_title, $template, type);
	vehicleNetworkControlSystemService.getConfigById(id,writeDetailInput);
}
function closeVehicleInfo(){//关闭按钮事件
	$("#openPopWin").dialog("destroy");
}
function saveVehicleInfo(){//保存按钮事件
	var _nameCn = $.trim($("#openPopWin .nameCn").val());
	var _nameEn = $.trim($("#openPopWin .nameEn").val());
	var _paramTypeId = $.trim($("#openPopWin .paramTypeId").combobox('getValue'));
	var _paramValue = $.trim($("#openPopWin .paramValue").val());
	var _dataTypeId = $.trim($("#openPopWin .dataTypeId").combobox('getValue'));
	var _enabledFlag = $.trim($("#openPopWin .enabledFlag").combobox('getValue'));
	var _describe = $.trim($("#openPopWin .describe").val());
	var title = $("#openPopWin").dialog("options").title;
	var _hasErrorMessage = true;
	var myreg = /^[0-9]*$/;
	if(_nameCn == ""){
		var _errorMessage = "参数名称不能为空!";
	}else if(_nameEn == ""){
		var _errorMessage = "英文名称不能为空!";
	}else if(_paramTypeId == ""){
		var _errorMessage = "参数类型不能为空!";
	}else if(_paramValue == ""){
		var _errorMessage = "参数值不能为空!";
	}else if(!myreg.test(_paramValue)){
		var _errorMessage = "参数值必须由数字组成!";
	}else if(_dataTypeId == ""){
		var _errorMessage = "数据类型不能为空!";
	}else if(_enabledFlag == ""){
		var _errorMessage = "启用标识不能为空!";
	}else{
		_hasErrorMessage = false;
	}
	if(_hasErrorMessage){
		$.messager.alert("操作提示", _errorMessage,"error");  
		return;
	}
	if(title == "添加"){
		var nameEn = '{nameEn:"'+_nameEn+'"}';
		vehicleNetworkControlSystemService.isConfigNameEnExist(nameEn,function(data){
			if(data){
				 $.messager.alert("操作提示","英文名称重复，请重新输入");
			}else{
				var _data = '{nameCn:"'+_nameCn+'",nameEn:"'+_nameEn+'",paramTypeId:'+_paramTypeId+',paramValue:"'+_paramValue+'",dataTypeId:'+_dataTypeId+',enabledFlag:'+_enabledFlag+',describe:"'+_describe+'"}';
				vehicleNetworkControlSystemService.addConfig(encodeURIComponent(_data),loadDatagridAgain);
			}
		});
	}else if(title == "编辑"){
		var nameCnString = paramTypeIdString = paramValueString = dataTypeIdString = enabledFlagString = describeString = "";
		if(presentSelectedData.nameCn != _nameCn){
			nameCnString = ',nameCn:"'+_nameCn+'"';
		}
		if(presentSelectedData.paramTypeId != _paramTypeId){
			paramTypeIdString = ',paramTypeId:'+_paramTypeId;
		}
		if(presentSelectedData.paramValue != _paramValue){
			paramValueString = ',paramValue:'+_paramValue;
		}
		if(presentSelectedData.dataTypeId != _dataTypeId){
			dataTypeIdString = ',dataTypeId:'+_dataTypeId;
		}
		if(presentSelectedData.enabledFlag != _enabledFlag){
			enabledFlagString = ',enabledFlag:'+_enabledFlag;
		}
		if(presentSelectedData.describe != _describe){
			describeString = ',describe:"'+_describe+'"';
		}
		var _dataString = nameCnString+paramTypeIdString+paramValueString+dataTypeIdString+enabledFlagString+describeString;
		if(_dataString != ""){
			var _data = '{id:'+presentSelectedId+_dataString+'}';
			vehicleNetworkControlSystemService.updateConfig(encodeURIComponent(_data),loadDatagridAgain);
		}else{
			loadDatagridAgain();
		}
	}
}
function loadDatagridAgain(){
	$("#openPopWin").dialog("destroy");
	$("#personal_recent_activity_result_div").datagrid("reload");
}
function writeDetail(data){
	$("#openPopWin .nameCn").text(data.nameCn);
	$("#openPopWin .nameEn").text(data.nameEn);
	$("#openPopWin .paramTypeId").text(data.paramType);
	$("#openPopWin .paramValue").text(data.paramValue);
	$("#openPopWin .dataTypeId").text(data.dataType);
	$("#openPopWin .enabledFlag").text(data.enabledFlagName);
	$("#openPopWin .describe").text(data.describe);
}
function writeDetailInput(data){
	$("#openPopWin .nameCn").val(data.nameCn);
	$("#openPopWin .nameEn").val(data.nameEn);
	$("#openPopWin .paramTypeId").combobox('select', data.paramTypeId);
	$("#openPopWin .paramValue").val(data.paramValue);
	$("#openPopWin .dataTypeId").combobox('select', data.dataTypeId);
	$("#openPopWin .enabledFlag").combobox('select', data.enabledFlag);
	$("#openPopWin .describe").text(data.describe);
	presentSelectedData = data;
}
function checkTheName(data){
	if(data){
		 $.messager.alert("操作提示","英文名称重复，请重新输入");
	}
}
function openPopWin(_title,$template,type){//$("#vehicleSystem_template").html().toString()
	var _win = $('<div id="openPopWin" style="width:100%; height:100%; overflow:hidden;"></div>');
	$("body").append(_win);
	_win.dialog({
	    width:630,
	    height:250,
	    title:_title,
	    shadow: true,
	    modal: true,
	    resizable: true,
	    onClose: function(){
			$(this).dialog("destroy");//销毁弹窗
		},
		onOpen: function(){
			//矫正显示位置，当打开位置为负时，置为0px
			var dialog = $(this).dialog("dialog");
			var pos = dialog.position();
			if(pos.left<0){
				dialog.css("left","0px");
			}
			if(pos.top<0){
				dialog.css("top","0px");
			}
			$("#openPopWin .panel div").append($template.html());
			if(type == 0){
				$("#openPopWin .nameEn").bind("blur",function(){
					var nameEn = '{nameEn:"'+$("#openPopWin .nameEn").val()+'"}';
					vehicleNetworkControlSystemService.isConfigNameEnExist(nameEn,checkTheName);
				});
			}
			if(type != 1){
				$('#openPopWin .paramTypeId').combobox({   
					 url:path + "/getParamType.do",   
					 valueField:'ID',   
					 textField:'NAME',
					 panelHeight: 'auto',
					 onLoadSuccess: function(){
						var data = $("#openPopWin .paramTypeId").combobox("getData");
						if(data != null && data.length >0){
							$("#openPopWin .paramTypeId").combobox("select",data[0].ID);
						}
					}
				});
				$('#openPopWin .dataTypeId').combobox({   
					 url:path + "/getDataType.do",   
					 valueField:'ID',   
					 textField:'NAME',
					 panelHeight: 'auto',
					 onLoadSuccess: function(){
						var data = $("#openPopWin .dataTypeId").combobox("getData");
						if(data != null && data.length >0){
							$("#openPopWin .dataTypeId").combobox("select",data[0].ID);
						}
					}
				});
				var data=[{"id":1,"text":"启用"},{"id":0,"text":"禁用"}];
				$('#openPopWin .enabledFlag').combobox({   
					 data:data,   
					 valueField:'id',   
					 textField:'text',
					 panelHeight: 'auto',
					 onLoadSuccess: function(){
						$("#openPopWin .enabledFlag").combobox("select",1);
					}
				});
			}
			if(type == 2){
				$("#openPopWin .nameEn").attr("disabled",true);
			}
		},
		onMove: function(left,top){
			//放置拖出左上边界
			var dialog = $(this).dialog("dialog");
			if(left<0){
				dialog.css("left","0px");
			}
			if(top<0){
				dialog.css("top","0px");
			}
		}
	});  
	if(!($._data($("#vehicleWindow .button-small").get(0), "events") != undefined
			&& $._data($("#vehicleWindow .button-small").get(0), "events")["click"] != undefined)){//查询按钮时间
		$("#vehicleWindow .vehicleBtn").bind("mouseover",function(){
			$(this).removeClass("button-small-01-n");
			$(this).addClass("button-small-01-f");
		});
		$("#vehicleWindow .vehicleBtn").bind("mouseout",function(){
			$(this).removeClass("button-small-01-f");
			$(this).removeClass("button-small-01-p");
			$(this).addClass("button-small-01-n");
		});
		$("#vehicleWindow .vehicleBtn").bind("mousedown",function(){
			$(this).removeClass("button-small-01-f");
			$(this).addClass("button-small-01-p");
		});
		$("#vehicleWindow .vehicleBtn").bind("mouseup",function(){
			$(this).removeClass("button-small-01-p");
			$(this).addClass("button-small-01-f");
		});
	}
}

/**
 * 绑定input,textarea事件
 * @returns
 */
function addInputEvent(){
	$(".textInput").die("focus").live("focus",function(){
		var $this = $(this);
		$this.removeClass("textInput_n");
		$this.addClass("textInput_p");
	});
	$(".textInput").die("blur").live("blur",function(){
		var $this = $(this);
		$this.removeClass("textInput_p");
		$this.addClass("textInput_n");
	});
	$("textarea").die("focus").live("focus",function(){
		var $this = $(this);
		$this.removeClass("textarea_input_text_n");
		$this.addClass("textarea_input_text_p");
	});
	$("textarea").die("blur").live("blur",function(){
		var $this = $(this);
		$this.removeClass("textarea_input_text_p");
		$this.addClass("textarea_input_text_n");
	});
}

$(function(){
	var vehicleNetworkControlSystem = new VehicleNetworkControlSystem();
	vehicleNetworkControlSystem.initVehicleNetworkControlSystem();
});
