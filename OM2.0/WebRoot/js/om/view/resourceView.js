/**
 * 资源的视图
 */
$(function(){
	ResourceView = Backbone.View.extend({
		el: $("#resource_operate"),
		initialize: function() {
			var resourceTemplate = _.template($("#resource_template").html());			
			$(this.el).html(resourceTemplate);			
			resources = new Resources(null, { view : this });

			this.initResourceGroup();
		},
		events: {
			
		},
		initResourceGroup: function(){//初始化即增加第一层资源树
			//顶层数据
			var rootJson = [{"id":RESOURCE_ROOT_ID,"text":"资源","iconCls":"icon-resource-double","state":"closed","attributes":[]}];
			$('#resource_groups_ul').tree({
				data: rootJson,
				animate: true,//有展开动画
//				dnd: true,//可以拖拽移动位置
				checkbox:true,//可以选择
				onClick:function(node){
					
				},
				onSelect: function(node){
					if(selectedResourceNode){//改变上一次选中项的样式	
						if(node.id == selectedResourceNode.id){
							return;
						}
						$(selectedResourceNode.target).children(".tree-title").removeClass("om-tree-title-s");
						
						if($(this).tree("isLeaf",selectedResourceNode.target)){//叶子节点
							$(selectedResourceNode.target).children(".tree-icon").removeClass("icon-resource-single-s");
							$(selectedResourceNode.target).children(".tree-icon").addClass("icon-resource-single");
						}
						else{//非叶子节点
							$(selectedResourceNode.target).children(".tree-icon").removeClass("icon-resource-double-s");
							$(selectedResourceNode.target).children(".tree-icon").addClass("icon-resource-double");
						}
					}
					
					$(node.target).children(".tree-title").addClass("om-tree-title-s");//改变选中行的字体颜色
					//改变图标
					if($(this).tree("isLeaf",node.target)){//叶子节点
						$(node.target).children(".tree-icon").removeClass("icon-resource-single");
						$(node.target).children(".tree-icon").addClass("icon-resource-single-s");
					}
					else{//非叶子节点
						$(node.target).children(".tree-icon").removeClass("icon-resource-double");
						$(node.target).children(".tree-icon").addClass("icon-resource-double-s");
					}
					selectedResourceNode = node;
				},
				onBeforeExpand: function(node){//在节点打开之前触发,从接口获取json数据
					if(node.id == RESOURCE_ROOT_ID && !node.attributes.clicked){
						var url = contextPath + "/ts/omGetResourceTree?type=1&data={id:" + node.id + "}";
						$(this).tree("options").url = url;						
					}
				},
				onBeforeLoad : function(node, param){							
					if(node && node.id == RESOURCE_ROOT_ID && !node.attributes.clicked){
						$("#loadingResource").show();	
					}
				},
				onLoadSuccess : function(node, data){//数据加载成功后，在界面上增加显示布局
					if (data.data) {
						if(data.returnFlag == -1){//没有查询到数据时，
								
						}
						else{
							$(this).tree("append",{parent:node.target,data:data.data});	
							
							var nodes = $("#resource_groups_ul").tree("getChildren",rootNode.target);
							for ( var i = 0; i < nodes.length; i++) {
								addResourceOperate(nodes[i].target);
							}
						}													
						node.attributes.clicked = true;
					}
					$("#loadingResource").hide();
				},
				onCheck: function(node, checked){
					if(!checked){
						$(node.target).children(".operate-div").children(".opertate-tree-checkbox").each(function(){
							var classStr = $(this).attr("class");
							var classes = classStr.split(" ");
							if(classes[1] == "operate-tree-checkbox1"){
								 $(this).removeClass("operate-tree-checkbox1");
								 $(this).addClass("operate-tree-checkbox0");
							}
						});
						
						var nodes = $("#resource_groups_ul").tree("getChildren",node.target);
						for(var i=0; i<nodes.length; i++){
							$(nodes[i].target).children(".operate-div").children(".opertate-tree-checkbox").each(function(){
								var classStr = $(this).attr("class");
								var classes = classStr.split(" ");
								if(classes[1] == "operate-tree-checkbox1"){
									$(this).removeClass("operate-tree-checkbox1");
									$(this).addClass("operate-tree-checkbox0");
								}
							});
						}
					}
				},
				onContextMenu: function(e,node){//鼠标右键弹出操作下拉框
					e.preventDefault();
					$(this).tree('select',node.target);
					
					//鼠标右键，展开子节点
					var parent = node.target;
					if($(node.target).parent().children().length == 1){//还未加载子节点时					
						$(this).tree("expand",parent);
					}
					else if($(node.target).parent().children().length == 2){//子节点已加载
						if($(parent).next().is(":hidden")){
							$(this).tree("expand",parent);
						}
					}
					
					$('#resource_menu').menu('show',{
						left: e.pageX,
						top: e.pageY
					});

					if(node.id == RESOURCE_ROOT_ID){//资源树根节点禁止删除和修改
						var renameItem = $('#resource_menu').menu('findItem',"重命名");
						if(!renameItem.disabled){//修改功能被启用,禁用修改功能
							$('#resource_menu').menu('disableItem',renameItem.target);
							$('#resource_menu').menu('setIcon',{target:renameItem.target,iconCls:'icon-rename-d'});//更换图标
							$(renameItem.target).children(".menu-text").addClass("menu-text-disabled");//修改文字颜色
						}
						
						
						var deleteItem = $('#resource_menu').menu('findItem',"删除");
						if(!deleteItem.disabled){//删除功能被启用,禁用删除功能
							$('#resource_menu').menu('disableItem',deleteItem.target);
							$('#resource_menu').menu('setIcon',{target:deleteItem.target,iconCls:'icon-trash-d'});//更换图标						
							$(deleteItem.target).children(".menu-text").addClass("menu-text-disabled");
						}												
					}
					else{
						var renameItem = $('#resource_menu').menu('findItem',"重命名");
						if(renameItem.disabled){//修改功能被禁用,重新启用
							$('#resource_menu').menu('enableItem',renameItem.target);
							$('#resource_menu').menu('setIcon',{target:renameItem.target,iconCls:'icon-rename-n'});//更换图标
							$(renameItem.target).children(".menu-text").removeClass("menu-text-disabled");
						}
						
						var deleteItem = $('#resource_menu').menu('findItem',"删除");
						if(deleteItem.disabled){//删除功能被禁用，重新启用
							$('#resource_menu').menu('enableItem',deleteItem.target);
							$('#resource_menu').menu('setIcon',{target:deleteItem.target,iconCls:'icon-trash-n'});//更换图标
							$(deleteItem.target).children(".menu-text").removeClass("menu-text-disabled");
						}
					}
				}
			});
			var rootNode = $("#resource_groups_ul").tree("getRoot");
			$("#resource_groups_ul").tree("expand",rootNode.target);
		}
	});
});