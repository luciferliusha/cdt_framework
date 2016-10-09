/**
 * 服务请求辅助类
 * 
 * @author songd
 *@date 2013-04-01
 */

/**
 * backBone中服务请求函数
 * @param url 
 * @param collection  执行异步请求的collection
 * @param method 数据返回后需要操作的view所执行的方法
 * @param map haspmap类型，其作用是view传递过来的method方法的参数
 */
function operateServerData(url,collection,method,map,params, isReLogin){
	collection.fetch({
		url : url,
		type : "post",
		contentType : "application/x-www-form-urlencoded",
		data : params,
		success : function(collection, response) {
			if(response != null){
				collection.reset();
				if(response.returnFlag == 0){
					if(method != null){
						method(response,map);//如果有显示加载提示的话，回调需要自己隐藏加载提示
					}
				}
				else{
					$("#loading").fadeOut();//隐藏加载提示
					$.messager.alert("操作提示", response.data,"error", function() {
						if (isReLogin && isReLogin == true) {//需要验证session超时和重新登录
							if (contextPath && contextPath != "") {
								window.location.href=contextPath;
							}
							else {
								window.location.href = "/";
							}
						}
				 	});
				}
			}			
		},
		error : function(collection, response) {
			$("#loading").fadeOut();//隐藏加载提示
			$.messager.alert("操作提示", "数据获取异常，请刷新重试!","error");
		}
	});
	
}

/**
 * ajax方式获取服务数据
 * @param url
 * @param method
 * @param map
 * @param params
 * @param isReLogin
 */
function doAjaxServerData(url,method,map,params, isReLogin) {
	$.ajax({
		url : url,
		dataType : "json",
		type : "post",
		contentType : "application/x-www-form-urlencoded",
		data : params,
		success : function(response) {
			if(response != null){
				if(response.returnFlag == 0 || response.returnFlag == "0"){
					if(method != null){
						method(response,map);//如果有显示加载提示的话，回调需要自己隐藏加载提示
					}
				}
				else{
					$("#loading").fadeOut();//隐藏加载提示
					$.messager.alert("操作提示", response.data,"error", function() {
						if (isReLogin && isReLogin == true) {//需要验证session超时和重新登录
							if (contextPath && contextPath != "") {
								window.location.href=contextPath;
							}
							else {
								window.location.href = "/";
							}
						}
				 	});
				}
			}			
		},
		error : function(collection, response) {
			$("#loading").fadeOut();//隐藏加载提示
			$.messager.alert("操作提示", "数据获取异常，请刷新重试!","error");
		}
    });
}

/**
 * ajax方式
 * @param _url
 * @param _params
 * @param callBack
 * @returns
 */
var doAjax = function(_url, _params, callBack) {
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
            if (response != null) {
            	if(response.returnFlag==0){
            		if (callBack != null) {
            			callBack(response);
            		}
            	}else{
            		$.messager.alert("操作提示", response.data,"error", function() {
            			if (response.data == "您未登录或离开系统过久,请重新登录!") {
            				window.location.href = path == "" ? "/" : path;
            			}
            		});
            	}
            }
        }
    });
};

/**
 * 获取数据后直接返回
 * @param _url 请求地址
 * @param _params  post请求的参数
 * @param callBack 数据返回后需要执行的方法
 * @param failedCallBack 错误时,数据返回后需要执行的方法 
 */	
var doSimpleAjax = function(_url, _params, callBack,failedCallBack){
	$.ajax({
        type : "post",
        dataType : "json",
        contentType : "application/x-www-form-urlencoded",
        url : _url,
        data : _params,
        error : function(XMLHttpRequest, textStatus, errorThrown) {
        	if(failedCallBack){
        		failedCallBack();
        	}
        	else{
                $.messager.alert("操作提示", "数据获取异常，请刷新重试！","error");	
        	}
        },
        success : function(response, textStatus) {
    		if (callBack != null) {
    			callBack(response);
    		}
        }
    });
};