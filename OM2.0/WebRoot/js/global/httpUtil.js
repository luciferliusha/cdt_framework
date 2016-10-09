//在jquery全局对象中扩展一个HttpUtil命名空间。
$.extend({
	HttpUtil : {}
});

//将方法扩展到之前扩展的Jquery的HttpUtil命名空间中去
$.extend($.HttpUtil, {
	/**
	 * @param _url 请求地址
	 * @param _params  post请求的参数
	 * @param callBack 数据返回后需要执行的方法
	 */	
	doAjax : function(_url, _params, callBack) {
		$.ajax({
            type : "post",
            dataType : "json",
            contentType : "application/x-www-form-urlencoded",
            url : _url,
            data : _params,
            error : function(XMLHttpRequest, textStatus, errorThrown) {
            	if (XMLHttpRequest.status != 0) {//排除0的情况，可能是ajax被迫终止，会到这个0的情况
            		$.messager.alert("操作提示", "数据获取异常，请刷新重试！" /*+ XMLHttpRequest.responseText*/,"error");
            	}
            },
            success : function(response, textStatus) {
                if (response != null) {
                	if(response.returnFlag==0){
                		if (callBack != null) {
                			callBack(response);
                		}
                	}else{
                		$.messager.alert("操作提示", response.data,"error", function() {
                			if (response.data == "您未登录或离开系统过久,请重新登录!") {
                				window.location.href = path;
                			}
                		});
                	}
                }
            }
        });
	},
	/**
	 * 获取数据后直接返回
	 * @param _url 请求地址
	 * @param _params  post请求的参数
	 * @param callBack 数据返回后需要执行的方法
	 */	
	doSimpleAjax : function(_url, _params, callBack){
		$.ajax({
            type : "post",
            dataType : "json",
            contentType : "application/x-www-form-urlencoded",
            url : _url,
            data : _params,
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                $.messager.alert("操作提示", "数据获取异常，请刷新重试！","error");
            },
            success : function(response, textStatus) {
        		if (callBack != null) {
        			callBack(response);
        		}
            }
        });
	}
});