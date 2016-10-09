package com.zjcds.portal.service.user.impl;

import java.util.HashMap;
import java.util.Map;

import com.zjcds.framework.common.httpconnect.ConnectInfo;
import com.zjcds.framework.common.httpconnect.HttpTools;
import com.zjcds.portal.config.ConfigManager;
import com.zjcds.portal.service.CDTBaseService;
import com.zjcds.portal.service.user.UserService;

/**
 * 用户接口实现类
 * @author xinyf created on 2013-8-7
 * @see UserService
 *
 */
public class UserServiceImpl extends CDTBaseService implements UserService {

	@Override
	public String getUserInfo(String data) throws Exception {
		Map<String, String> params = setParams(data);
        return sendRequestToOM("userInfo",params);
	}

	@Override
	public String updateUserInfo(String data) throws Exception {
		Map<String, String> params = setParams(data);
        params.put("type","update");//操作类型为update，此为OM接口所需参数
		return sendRequestToOM("updateUserInfo",params);
	}

	@Override
	public String updateUserPassword(String data) throws Exception {
		Map<String, String> params = setParams(data);
		return sendRequestToOM("updateUserPassword",params);
	}

	@Override
	public String isUserExit(String data) throws Exception {
        Map<String, String> params = setParams(data);
		return sendRequestToOM("isUserExit",params);
	}
	
	/**调用OM接口*/
	private String sendRequestToOM(String interfaceInfo,Map<String, String> params) throws Exception{
		ConnectInfo con = new ConnectInfo(ConfigManager.getInstance().getSysConfig().getOmServer());
        Map<String, String> mapper = ConfigManager.getInstance().getSysConfig().getOmInterface();
        return HttpTools.doGet(con, mapper.get(interfaceInfo), params);
	}
	/**设置请求参数*/
	private Map<String, String> setParams(String data) throws Exception{
		Map<String, String> params = new HashMap<String, String>();
        params.put("data", data);
		return params;
	}
}
