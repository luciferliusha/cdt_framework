package com.zjcds.om.data.dao;

import java.util.List;
import java.util.Map;

import com.zjcds.om.data.bean.OMOrganizationData;
import com.zjcds.om.data.bean.OMUserData;

/**
 * 用户接口 dao层
 * 
 * @author yuzq
 * @date 2013/4/26
 * 
 */
public interface OMUserDao {

    /**
     * 根据组织ID关联用户信息
     * 
     * @param organizationId
     * @return
     */
    List<OMUserData> getUserByOrganizationId(OMOrganizationData organization);

    /**
     * 修改用户信息
     * 
     * @param organization
     */
    void omUpdateUser(OMOrganizationData organization);

    /**
     * 删除用户
     * 
     * @param id
     */
    void omDeleteUser(int id);

    /**
     * 新增用户
     * 
     * @param organization
     */
    void omAddUser(OMOrganizationData organization);

    /**
     * 创建用户与组织的关系
     * 
     * @param organization
     */
    void omAddUserRelationWithOrganization(OMOrganizationData organization);

    /**
     * 根据用户ID删除用户与组织的关系
     * 
     * @param organization
     */
    void omDeleteUserRelationWithOrganization(OMOrganizationData organization);

    /**
     * 根据用户ID删除用户与角色的关系
     * 
     * @param organization
     */
    void omDeleteUserRelationWithRole(OMOrganizationData organization);

    /**
     * 根据用户ID和组织
     * 
     * @param map
     */
    void omDeleteRelationByIds(Map<String, Object> map);

    /**
     * 根据用户ID查询与之关联的组织数量
     * 
     * @param userId
     * @return
     */
    int omGetRelationCount(int userId);

    /**
     * 登录验证
     * 
     * @param user
     * @return
     */
    Map<String, Object> omLogin(OMUserData user);

    /**
     * 验证用户是否应经存在
     * 
     * @param organization
     * @return
     */
    int omUserIsExit(String email);

    /**
     * 搜索用户
     * 
     * @param name 关键字
     * @return
     */
    List<OMUserData> omSearchUser(String name);

    /**
     * 取得所有用户
     * 
     * @return
     */
    List<OMUserData> omGetAllUser();

    /**
     * 根据组织取得所包含的用户
     * 
     * @param organizationId
     * @return
     */
    List<OMUserData> omGetUserByOrganization(int organizationId);

    /**
     * 建立(取消)用户与组织关系
     * 
     * @param map
     */
    void omAwardOrganization(Map<String, Object> map);

    /**
     * 根据用户ID查询可分享用户列表
     * 
     * @param userId
     * @return
     */
    List<Map<String, Object>> omGetShareUser(OMUserData user);

    /**
     * 用户注册
     * 
     * @param user
     */
    void omUserRegister(OMUserData user);

    /**
     * 查询用户密码
     * 
     * @param user
     * @return
     */
    String omGetUserPassword(Integer id);

    /**
     * 修改用户密码
     * 
     * @param map
     */
    void omUpdateUserPassword(Map<String, Object> map);

    /**
     * 获取当前用户信息
     * @param email
     * @return
     */
    OMUserData omGetUserInfo(String email);
}
