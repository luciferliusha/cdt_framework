package com.zjcds.portal.action.user;

import org.apache.log4j.Logger;

import com.zjcds.portal.action.common.FrameworkBaseAction;
import com.zjcds.portal.service.user.UserService;

/**
 * 用户Action
 * @author xinyf created on 2013-8-7
 *
 */
public class UserAction extends FrameworkBaseAction {

	private static final long serialVersionUID = 1L;
	
	private static Logger logger = Logger.getLogger(UserAction.class);
	
    private UserService userService;
    private String data;
	 
    /**
     * 获取用户信息
     * @return
     * @throws Exception
     */
	public String getUserInfo() throws Exception{
		String json = userService.getUserInfo(data);
		super.writeJson(json);
		return null;
	}
	
    /**
     * 更新用户信息
     * @return
     * @throws Exception
     */
	public String updateUserInfo() throws Exception{
		String json = userService.updateUserInfo(data);
		super.writeJson(json);
		return null;
	}
	
	/**
	 * 更新用户密码
	 * @return
	 * @throws Exception
	 */
	public String updateUserPassword() throws Exception{
		String json = userService.updateUserPassword(data);
		super.writeJson(json);
		return null;
	}

	/**
	 * 判断用户是否存在
	 * @return
	 * @throws Exception
	 */
	public String isUserExit() throws Exception{
		String json = userService.isUserExit(data);
		super.writeJson(json);
		return null;
	}
	
	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public UserService getUserService() {
		return userService;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getData() {
		return data;
	}

}
