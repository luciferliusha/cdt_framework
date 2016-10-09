package com.zjcds.om.service.role;

/**
 * 角色接口 service层
 * 
 * @author yuzq
 * @date 2013/4/24
 * 
 */
public interface OMRoleService {

    /**
     * 获得角色树
     * 
     * @param type
     * @param data
     */
    String omGetRoleTree(String type, String data) throws Exception;

    /**
     * 根据组织ID，查询该组织的角色
     * 
     * @return
     * @author linj created on 2013-5-6
     * @since OM 1.0
     */
    String omGetOrganizationRole(String data) throws Exception;

    /**
     * 根据用户ID，查询该用户的角色
     * 
     * @return
     * @author linj created on 2013-5-6
     * @since OM 1.0
     */
    String omGetUserRole(String data) throws Exception;

    /**
     * 操作角色 包括角色的增加,删除,修改
     * 
     * @param type
     * @param data
     * @return
     * @throws Exception
     */
    String omOperateRole(String type, String data) throws Exception;

    /**
     * 把角色赋予某个组织
     * 
     * @param data
     * @return
     */
    String omAwardPermission(String data) throws Exception;

    /**
     * 获得角色信息
     * 
     * @param data
     * @return
     */
    String omGetRole(String data) throws Exception;

    /**
     * 搜索角色
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String omSerachRole(String data) throws Exception;
    
    /***zTree新增 start***/
    /**
     * 获得角色Z树
     * 
     * @param data
     */
    String omGetRoleZTree(String id) throws Exception;
    /***zTree新增 end***/
}
