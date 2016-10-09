package com.zjcds.om.service.user;

/**
 * 用户接口 service层
 * 
 * @author yuzq
 * @date 2013/4/24
 * 
 */
public interface OMUserService {

    /**
     * 获得当前用户权限
     * 
     * @param user
     * @return
     */
    String omGetCurrentUserPopedom(String type, String data) throws Exception;

    /**
     * 移除用户与组织的关系
     * 
     * @param organizationId
     * @param data
     * @return
     */
    String omRemoveRelationUserWithOrganization(String data) throws Exception;

    /**
     * 验证用户是否存在,根据邮箱验证
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String omUserIsExit(String data) throws Exception;

    /**
     * 取得所有用户
     * 
     * @return
     * @throws Exception
     */
    String omGetAllUser() throws Exception;

    /**
     * 根据组织取得所包含的用户
     * 
     * @return
     * @throws Exception
     */
    String omGetUserByOrganization(String data) throws Exception;

    /**
     * 用户授予组织
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String omUserSelectOrganization(String data) throws Exception;

    /**
     * 取得分享用户
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String omGetShareUser(String data) throws Exception;

    /**
     * 用户注册
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String omUserRegister(String data) throws Exception;

    /**
     * 修改密码
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String omUpdatePassword(String data) throws Exception;

    /**zTree新增 start**/
    String omGetZTreeAllUser() throws Exception;
    /**zTree新增 end**/
    
    /**
     * 获取当前用户信息
     * @param data
     * @return
     * @throws Exception
     */
    String omGetUserInfo(String data) throws Exception;
}
