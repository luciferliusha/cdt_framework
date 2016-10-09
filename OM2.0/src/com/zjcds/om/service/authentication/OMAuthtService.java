package com.zjcds.om.service.authentication;

/**
 * 认证接口 service层
 * 
 * @author yuzq
 * @date 2013/4/23
 * 
 */
public interface OMAuthtService {

    /**
     * 取得用户的权限
     * 
     * @param data
     * @return
     * @author linj created on 2013-5-7
     * @since OM 1.0
     */
    String omGetUserPopedom(String data) throws Exception;

    /**
     * 登录
     * 
     * @param data 登录信息
     * @return
     * @throws Exception
     */
    String omLogin(String data) throws Exception;
}
