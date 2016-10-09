package com.zjcds.portal.service.user.impl;

import java.util.Map;

import com.zjcds.portal.mybatis.dao.UserRoleDao;
import com.zjcds.portal.service.user.UserRoleService;

public class UserRoleServiceImpl implements UserRoleService {

	private UserRoleDao userRoleDao;
	
	public UserRoleDao getUserRoleDao() {
		return userRoleDao;
	}

	public void setUserRoleDao(UserRoleDao userRoleDao) {
		this.userRoleDao = userRoleDao;
	}

	@Override
	public Map getUserInfoByRoleNmae(String rolename) {
		// TODO Auto-generated method stub
		return userRoleDao.getUserInfoByRoleNmae(rolename);
	}

}
