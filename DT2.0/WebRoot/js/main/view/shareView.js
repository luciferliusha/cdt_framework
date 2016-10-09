/**
 * 分享View
 */
var userData;
$(function() {
	//分享
	ShareView = Backbone.View.extend({
		el: $("#shareWinView"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var shareWinTemplate = _.template($("#shareWin_template").html());
			$(this.el).html(shareWinTemplate);
		},
		events: {
			"click #shareBtn": "shareBtnClick",
			"click #selectAllUser": "selectAllUserClick",
			"mouseover #shareWin_close": "shareWinCloseOver",
			"mouseout #shareWin_close": "shareWinCloseOut",
			"click #shareWin_close": "shareWinCloseClick"
		},
		shareBtnClick:function() {
			var checkedNodes = $('#share_users').tree("getChecked");
			var key = pfIdData.get(solutionSelectItemId);
			var shareOptData = "";
			if (key != null) {
				//全选的话直接保存到解决方案的全选字段
				if($("#selectAllUser").hasClass("tree-checkbox1")){
					shareOptData = "[{pfId:" + key + ",type:0,userId:'-999'}]";
				}else{
				if (checkedNodes != null && checkedNodes.length > 0) {//有选择
					if (pfSharedUsers != null) {//原先存在分享的用户
						var tmpData = "{pfId:" + key + ",type:1,userId:'-999'},";
						var checkedNodeId;
						for (var i in checkedNodes) {//先判断新增的
							checkedNodeId = checkedNodes[i].id;
							var isExits = false;
							for (var j in pfSharedUsers) {
								if (checkedNodeId == pfSharedUsers[j].id) {//都存在
									isExits = true;
									break;
								}
							}
							if (!isExits) {//不存在则新增
								tmpData = tmpData + "{pfId:" + key + ",type:0,userId:'" + checkedNodeId + "'},";//type:0表示新增
							}
						}
						for (var j in pfSharedUsers) {//再判断删除的
							var isExits = false;
							checkedNodeId = pfSharedUsers[j].id;
							for (var i in checkedNodes) {
								if (checkedNodes[i].id == checkedNodeId) {//都存在
									isExits = true;
									break;
								}
							}
							if (!isExits) {//不存在则新增
								tmpData = tmpData + "{pfId:" + key + ",type:1,userId:'" + checkedNodeId + "'},";//type:1表示删除
							}
						}
						if (tmpData.length > 1) {
							tmpData = tmpData.substring(0, tmpData.length-1);//去掉最后一个,
							shareOptData = "[" + tmpData + "]";
						}
					}
					else {//原先没有分享过
						var tmpData = "";
						for (var i in checkedNodes) {
							tmpData = tmpData + "{pfId:" + key + ",type:0,userId:'" + checkedNodes[i].id + "'},";//type:0表示新增
						}
						if (tmpData.length > 1) {
							tmpData = tmpData.substring(0, tmpData.length-1);//去掉最后一个,
							shareOptData = "[" + tmpData + "]";
						}
					}
				}
				else {//没有选择
					if (pfSharedUsers != null && pfSharedUsers.length > 0) {//原先存在分享的用户
						var tmpData = "";
						for (var j in pfSharedUsers) {
							tmpData = tmpData + "{pfId:" + key + ",type:1,userId:'" + pfSharedUsers[j].id + "'},";//type:1表示删除
						}
						if (tmpData.length > 1) {
							tmpData = tmpData.substring(0, tmpData.length-1);//去掉最后一个,
							shareOptData = "[" + tmpData + "]";
						}
					}
				}
				}
				if (shareOptData != "") {
					$.getJSON(contextPath + '/operateSharedPF.do?sharedData=' + shareOptData, function(result){
						$("#shareWinView").hide();
					});
				}
				else {
					$("#shareWinView").hide();
				}
			}
		},
		selectAllUserClick: function(){//全选/全部选
			if ($("#selectAllUser").hasClass("tree-checkbox0")) {
				$("#selectAllUser").removeClass("tree-checkbox0");
				$("#selectAllUser").addClass("tree-checkbox1");
				//全选
				var roots = $('#share_users').tree("getRoots");
				for (var i in roots) {
					$('#share_users').tree("check", roots[i].target);
				}
				$("#shareWinContentBlank").show();
			}
			else {
				$("#selectAllUser").removeClass("tree-checkbox1");
				$("#selectAllUser").addClass("tree-checkbox0");
				//全不选
				var roots = $('#share_users').tree("getRoots");
				for (var i in roots) {
					$('#share_users').tree("uncheck", roots[i].target);
				}
				$("#shareWinContentBlank").hide();
			}
		},
		saveBtnOver: function(){
			$("#saveBtn").removeClass("confirmButtonY_n");
			$("#saveBtn").addClass("confirmButtonY_f");
		},
		saveBtnOut: function(){
			$("#saveBtn").removeClass("confirmButtonY_f");
			$("#saveBtn").addClass("confirmButtonY_n");
		},
		saveBtnClick: function(){
		},
		shareWinCloseOver: function(){
			$("#shareWin_close").removeClass("confirm_close_n");
			$("#shareWin_close").addClass("confirm_close_f");
		},
		shareWinCloseOut: function(){
			$("#shareWin_close").removeClass("confirm_close_f");
			$("#shareWin_close").addClass("confirm_close_n");
		},
		shareWinCloseClick: function(){
			$("#shareWinView").hide();
		}
	});
});