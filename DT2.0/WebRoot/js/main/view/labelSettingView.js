/**
 * 页签设置框
 */
$(function(){

	var callback;//回调
	
	LabelSettingView = Backbone.View.extend({
		el: $("#settingLabelWinView"),
		initialize: function(){
			this.rander();
		},
		rander: function(){
			var lableSetTemplate = _.template($("#labelSettingWin_template").html());
			$(this.el).html(lableSetTemplate);
		},
		events: {
			"mouseover #settingConfirmBtn": "settingConfirmBtnOver",
			"mouseout #settingConfirmBtn": "settingConfirmBtnOut",
			"click #settingConfirmBtn": "settingConfirmBtnClick",
			"mouseover #resetBtn": "resetBtnOver",
			"mouseout #resetBtn": "resetBtnOut",
			"click #resetBtn": "resetBtnClick",
			"mouseover #confirm_close": "confirmCloseOver",
			"mouseout #confirm_close": "confirmCloseOut",
			"click #confirm_close": "resetBtnClick"
		},
		settingConfirmBtnOver: function(){
			$("#settingConfirmBtn").removeClass("confirmButtonY_n");
			$("#settingConfirmBtn").addClass("confirmButtonY_f");
		},
		settingConfirmBtnOut: function(){
			$("#settingConfirmBtn").removeClass("confirmButtonY_f");
			$("#settingConfirmBtn").addClass("confirmButtonY_n");
		},
		settingConfirmBtnClick: function(){
			$("#settingLabelWinView").hide();
			if (callback != null) {
				var chageTabType = $("#labelSettingView input[name='chageTabType']:checked").val();
				var paramValue = $("#paramValue").val();
				var data = {chageTabType:chageTabType, paramValue:paramValue};
				callback(data);
			}
		},
		resetBtnOver: function(){
			$("#resetBtn").removeClass("confirmButtonN_n");
			$("#resetBtn").addClass("confirmButtonN_f");
		},
		resetBtnOut: function(){
			$("#resetBtn").removeClass("confirmButtonN_f");
			$("#resetBtn").addClass("confirmButtonN_n");
		},
		resetBtnClick: function(){
			$("#settingLabelWinView").hide();
		},
		confirmCloseOver: function(){
			$("#confirm_close").removeClass("confirm_close_n");
			$("#confirm_close").addClass("confirm_close_f");
		},
		confirmCloseOut: function(){
			$("#confirm_close").removeClass("confirm_close_f");
			$("#confirm_close").addClass("confirm_close_n");
		},
		labelSettingWinOpen: function(method,data){
			$("#labelSettingView").css("top",clientHeight/2-$("#labelSettingView").height()/2 + "px");
			$("#labelSettingView").css("left",clientWidth/2-$("#labelSettingView").width()/2 + "px");
			$("#settingLabelWinView").show();
			callback = method;
			this.initData(data);
		},
		initData:function(data) {
			if (data && data.chageTabType) {
				$("#labelSettingView input:radio[value='"+ data.chageTabType + "']").attr('checked','true');
			}
			else {
				$("#labelSettingView input:radio[value='1']").attr('checked','true');
			}
			if (data && data.paramValue) {
				$("#paramValue").val(data.paramValue);
			}
			else {
				$("#paramValue").val("");
			}
		}
	});
});