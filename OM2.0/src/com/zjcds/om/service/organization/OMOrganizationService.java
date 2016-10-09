package com.zjcds.om.service.organization;

/**
 * 组织关系接口 service层
 * 
 * @author yuzq
 * @date 2013/4/24
 * 
 */
public interface OMOrganizationService {

    /**
     * 获取组织树
     * 
     * @return
     */
    String omGetOrganizationTree(String type, String data) throws Exception;

    /**
     * 操作组织信息
     * 
     * @param type
     * @param data
     * @return
     * @throws Exception
     */
    String omOperateOrganization(String type, String data) throws Exception;

    /**
     * 获取指定组织
     * 
     * @param data
     * @return
     */
    String omGetOrganization(String data) throws Exception;

    /**
     * 搜索组织或用户
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String omSerachOrganization(String data) throws Exception;

    /**
     * 取得所有组织
     * 
     * @return
     * @throws Exception
     */
    String omGetAllOrganization() throws Exception;

    /**
     * 根据用户取得组织列表
     * 
     * @return
     * @throws Exception
     */
    String omGetOrganizationByUser(String data) throws Exception;

    /**
     * 组织选择/取消用户
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String omOrganizationSelectUser(String data) throws Exception;

    /**
     * 取得组织下面子节点数量
     * 
     * @param id
     * @return
     * @throws Exception
     */
    String omGetSubCount(String data) throws Exception;

    /***zTree新增 start***/
    /**
     * 获得组织Z树
     * 
     * @param data
     */
    String omGetOrganizationZTree(String id) throws Exception;
    
    /**
     * 获得所有组织
     * @return
     * @throws Exception
     */
    String omGetZTreeAllOrganization() throws Exception;
    
    /**
     * 搜索组织或用户zTree
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String omSerachOrganizationZTree(String data) throws Exception;
    /***zTree新增 end***/
}
