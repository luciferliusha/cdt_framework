var selectedAppNode;//选中的构件节点
$(function(){
	_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
	};		
	$(".easyui-menu .menu-item").height("31px");
	var componentTopView = new ComponentTopView();
	var componentManagerView = new ComponentManagerView();
	//操作列表鼠标滑过事件
	$(".easyui-menu .menu-item").bind("mouseover",function(){
		var classStrs = new Array();
		classStrs = $(this).children(".menu-icon").attr("class").split(" ");
		if(classStrs[1] == "icon-add-n"){
			$(this).children(".menu-icon").removeClass("icon-add-n");
			$(this).children(".menu-icon").addClass("icon-add-f");
		}
		else if(classStrs[1] == "icon-trash-n"){
			$(this).children(".menu-icon").removeClass("icon-trash-n");
			$(this).children(".menu-icon").addClass("icon-trash-f");			
		}
	});
	
	$(".easyui-menu .menu-item").bind("mouseout",function(){
		var classStrs = new Array();
		classStrs = $(this).children(".menu-icon").attr("class").split(" ");
		if(classStrs[1] == "icon-add-f"){
			$(this).children(".menu-icon").addClass("icon-add-n");
			$(this).children(".menu-icon").removeClass("icon-add-f");
		}
		else if(classStrs[1] == "icon-trash-f"){
			$(this).children(".menu-icon").addClass("icon-trash-n");
			$(this).children(".menu-icon").removeClass("icon-trash-f");
		}
	});
	
	addGetLeafChildrenFunction();
});

function initMenu(node, menu_id){
	if(node.attributes.type == -1){
		var appendItem = $('#' + menu_id).menu('findItem',"新增");
		var removeItem = $('#' + menu_id).menu('findItem',"删除");
		if(appendItem.disabled){
			$('#' + menu_id).menu('enableItem',appendItem.target);
			$('#' + menu_id).menu('setIcon',{target:appendItem.target,iconCls:'icon-add-n icon-plus'});//更换图标
			$(appendItem.target).children(".menu-text").removeClass("menu-text-disabled");//修改文字颜色
		}
		if(!removeItem.disabled){
			$('#' + menu_id).menu('disableItem',removeItem.target);
			$('#' + menu_id).menu('setIcon',{target:removeItem.target,iconCls:'icon-trash-d'});
			$(removeItem.target).children(".menu-text").addClass("menu-text-disabled");//修改文字颜色
		}
	}else if(node.attributes.type == 0){
		var appendItem = $('#' + menu_id).menu('findItem',"新增");
		var removeItem = $('#' + menu_id).menu('findItem',"删除");
		if(appendItem.disabled){
			$('#' + menu_id).menu('enableItem',appendItem.target);
			$('#' + menu_id).menu('setIcon',{target:appendItem.target,iconCls:'icon-add-n icon-plus'});//更换图标
			$(appendItem.target).children(".menu-text").removeClass("menu-text-disabled");//修改文字颜色
		}
		if(removeItem.disabled){
			$('#' + menu_id).menu('enableItem',removeItem.target);
			$('#' + menu_id).menu('setIcon',{target:removeItem.target,iconCls:'icon-trash-n icon-trash'});//更换图标
			$(removeItem.target).children(".menu-text").removeClass("menu-text-disabled");//修改文字颜色
		}
	}else if(node.attributes.type == 1){
		var appendItem = $('#' + menu_id).menu('findItem',"新增");
		var removeItem = $('#' + menu_id).menu('findItem',"删除");
		if(!appendItem.disabled){
			$('#' + menu_id).menu('disableItem',appendItem.target);
			$('#' + menu_id).menu('setIcon',{target:appendItem.target,iconCls:'icon-add-d'});//更换图标
			$(appendItem.target).children(".menu-text").addClass("menu-text-disabled");//修改文字颜色
		}
		if(removeItem.disabled){
			$('#' + menu_id).menu('enableItem',removeItem.target);
			$('#' + menu_id).menu('setIcon',{target:removeItem.target,iconCls:'icon-trash-n icon-trash'});//更换图标
			$(removeItem.target).children(".menu-text").removeClass("menu-text-disabled");//修改文字颜色
		}
	}else{
		
	}
}

function appendComponentNode(tree_id) {
	var t = $('#' + tree_id);
	var node = t.tree('getSelected');
	var id = node.id;
	var orderBy = 0;
	
	if(t.tree('getLeafChildren', node.target).length != 0){
		var lastchild = t.tree('getLeafChildren', node.target)[t.tree('getLeafChildren', node.target).length-1];
		orderBy = lastchild.attributes.orderBy+1;
	}
	if(node.attributes.type == -1){
		$.ajax({
			url: contextPath + '/addAppFile.do?file={"parentId":'+id+',"appName":"'+encodeURIComponent("新建目录")+'","type":0,"appType":0,"orderBy":'+orderBy+'}',
			type: "post", 
			success: function(data, textStatus){
				var responseData = JSON.parse(data);
				var data = [{"id":responseData.data,"text":"新建目录","iconCls":"icon-organization-double","attributes":{"type":0,"orderBy":orderBy}}];
				t.tree('append',{parent:node.target,data:data});
				t.tree("select",t.tree("find",responseData.data).target);
				addTreeTitle(data);
	      }});
	}else if(node.attributes.type == 0){
		$.ajax({
			url: contextPath + '/addAppFile.do?file={"parentId":'+id+',"appName":"'+encodeURIComponent("新建构件")+'","type":1,"appType":1,"orderBy":'+orderBy+'}',
			type: "post", 
			success: function(data, textStatus){
				var responseData = JSON.parse(data);
				var data = [{"id":responseData.data,"text":"新建构件","iconCls":"icon-organization-single","attributes":{"type":1,"orderBy":orderBy}}];
				t.tree('append',{parent:node.target,data:data});
				t.tree("select",t.tree("find",responseData.data).target);
				addTreeTitle(data);
	      }});
	}else if(node.attributes.type == 1){
		
	}else{
		
	}
}

function removeComponentNode(tree_id) {
	var t = $('#' + tree_id);
	var node = t.tree('getSelected');
	var id = node.id;
	var text = node.text;
	var type = node.attributes.type;
	var deleteName = "";
	if(type == 0){
		deleteName = "确认删除名为【" + text + "】的构件组?<br/>删除后将无法撤销此操作!";
	}
	else if(type == 1){
		deleteName = "确认删除名为【" + text + "】的构件?<br/>删除后将无法撤销此操作!";
	}
	$.messager.confirm("操作提示", deleteName, function (data) {
        if (data) {
    		$.ajax({
			url: contextPath + '/deleteAppDir.do?appId='+id,
			type: "post", 
			success: function(data, textStatus){
				t.tree('remove', node.target);
				$("#titleEdit").attr("disabled","disabled");
				$("#contentEdit").attr("disabled","disabled");
				$("#describeEdit").attr("disabled","disabled");
				$("#titleEdit").val("");
				$("#contentEdit").val("");
				$("#describeEdit").val("");
				$("#titleEdit").removeClass($("#titleEdit").attr("class"));
				$("#titleEdit").addClass("textInput_d");
				$("#contentEdit").removeClass($("#contentEdit").attr("class"));
				$("#contentEdit").addClass("textInput_d");
				$("#describeEdit").removeClass($("#describeEdit").attr("class"));
				$("#describeEdit").addClass("textarea_input_text_d");
				$("#submitEdit").hide();
				$(".text_err").hide();
				selectedAppNode = null;
			}});
        }
        else{
        }
    });
}

/**
 * Easyui tree扩展tree方法获取一级子节点
 */
function addGetLeafChildrenFunction(){
	$.extend($.fn.tree.methods,{
	    getLeafChildren:function(jq, params){
	        var nodes = [];
	        $(params).next().children().children("div.tree-node").each(function(){
	            nodes.push($(jq[0]).tree('getNode',this));
	        });
	        return nodes;
	    }
	});
}

/**
 * 增加tree 节点 title属性
 * @param data 节点数据数组
 */
function addTreeTitle(data){
	$.each(data,function(idx,val){
		$("#componentTree_ul [node-id='"+val.id+"']").attr('title',val.text);//设置title 
	}); 
}