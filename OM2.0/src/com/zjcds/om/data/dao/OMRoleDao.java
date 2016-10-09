package com.zjcds.om.data.dao;

import java.util.List;
import java.util.Map;

import com.zjcds.om.data.bean.OMRoleData;

/**
 * 角色接口 dao层
 * 
 * @author yuzq
 * @date 2013/4/27
 * 
 */
public interface OMRoleDao {

    /**
     * 获取角色树 返回一层
     * 
     * @param roleData
     * @return
     */
    List<OMRoleData> omGetRoleTreeOne(OMRoleData roleData);

    /**
     * 获取整个角色树
     * 
     * @param roleData
     * @return
     * @author linj created on 2013-5-3
     * @since OM 1.0
     */
    List<OMRoleData> omGetRoleTree(OMRoleData roleData);

    /**
     * 获取子角色
     * 
     * @param id
     * @return
     */
    List<OMRoleData> getChildRole(int id);

    /**
     * 根据组织ID，查询该组织的角色
     * 
     * @param orgId 组织ID
     * @author linj created on 2013-5-6
     * @since OM 1.0
     */
    List<OMRoleData> omGetOrganizationRole(int orgId);

    /**
     * 根据用户ID，查询该用户的角色
     * 
     * @param userId 用户ID
     * @author linj created on 2013-5-6
     * @since OM 1.0
     */
    List<OMRoleData> omGetUserRole(int userId);

    /**
     * 修改角色
     * 
     * @param role
     */
    void omUpdateRole(OMRoleData role);

    /**
     * 删除角色
     * 
     * @param id
     */
    void omDeleteRole(int id);

    /**
     * 根据角色ID删除角色与组织的关系
     * 
     * @param id
     */
    void omDeleteRelationWithOrganization(int id);

    /**
     * 根据角色ID删除角色与用户的关系
     * 
     * @param id
     */
    void omDeleteRelationWithUser(int id);

    /**
     * 根据角色ID删除角色与资源的关系
     * 
     * @param id
     */
    void omDeleteRelationWithResource(int id);

    /**
     * 新增角色
     * 
     * @param role
     */
    void omAddRole(OMRoleData role);

    /**
     * 把角色授权给组织
     * 
     * @param map
     */
    void omAwardOrganization(Map<String, Object> map);

    /**
     * 把角色授权用户
     * 
     * @param map
     */
    void omAwardUser(Map<String, Object> map);

    /**
     * 取得角色信息
     * 
     * @param role
     * @return
     */
    OMRoleData omGetRole(OMRoleData role);

    /**
     * 角色搜索 返回层次结构数据
     * 
     * @param name 关键字
     * @return
     */
    List<OMRoleData> omSearchRole(String name);

    /**
     * 角色搜索 不返回层次结构数据
     * 
     * @param role
     * @return
     */
    List<OMRoleData> omSearchRole2(OMRoleData role);
}
