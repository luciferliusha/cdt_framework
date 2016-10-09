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
function operateServerData(url,collection,method,map,params){
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
						method(response,map);
					}
				}
				else{
					alert(response.data);
				}
			}			
		},
		error : function(collection, response) {
			alert('连接服务器失败，请刷新重试！');
		}
	});
	
}