package com.zjcds.portal.service.user;

/**
 * 用户接口
 * @author xinyf created on 2013-8-7
 *
 */
public interface UserService {
	/**
	 * 获取用户信息
	 * @param data
	 * @return
	 * @throws Exception
	 */
	String getUserInfo(String data) throws Exception;
	
	/**
	 * 更新用户信息
	 * @param data
	 * @return
	 * @throws Exception
	 */
	String updateUserInfo(String data) throws Exception;
	
	/**
	 * 更新用户密码
	 * @param data
	 * @return
	 * @throws Exception
	 */
	String updateUserPassword(String data) throws Exception;
	
	/**
	 * 判断用户是否存在
	 * @param data
	 * @return
	 * @throws Exception
	 */
	String isUserExit(String data) throws Exception;
}
