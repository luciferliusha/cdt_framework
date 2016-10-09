package com.zjcds.om.data.dao;

import java.util.List;
import java.util.Map;

import com.zjcds.om.data.bean.OMOrganizationData;

/**
 * 组织接口 dao层
 * 
 * @author yuzq
 * @date 2013/4/24
 * 
 */
public interface OMOrganizationDao {

    /**
     * 获取组织树
     * 
     * @param organization
     * @return
     */
    List<OMOrganizationData> omGetOrganizationTree(OMOrganizationData organization);

    /**
     * 取得子节点
     * 
     * @param id
     * @return
     */
    List<OMOrganizationData> getChildrenOrganization(int id);

    /**
     * 获取组织 一层数据
     * 
     * @param organization
     * @return
     */
    List<OMOrganizationData> omGetOrganizationOne(OMOrganizationData organization);

    /**
     * 修改组织
     * 
     * @param organization
     */
    void omUpdateOrganization(OMOrganizationData organization);

    /**
     * 根据组织ID删除组织与用户的关系
     * 
     * @param id
     */
    void omDeleteRelationWithUser(int id);

    /**
     * 根据组织ID删除组织与角色的关系
     * 
     * @param id
     */
    void omDeleteRelationWithRole(int id);

    /**
     * 根据组织ID删除组织
     * 
     * @param id
     */
    void omDeleteOrganization(int id);

    /**
     * 新增组织
     * 
     * @param organization
     */
    void omAddOrganization(OMOrganizationData organization);

    /**
     * 根据ID取得组织或用户
     * 
     * @param organization
     * @return
     */
    OMOrganizationData omGetOrganization(OMOrganizationData organization);

    /**
     * 组织搜索
     * 
     * @param name 关键字
     * @return 包括父子信息的组织
     * @author linj created on 2013-5-13
     * @since OM 1.0
     */
    List<OMOrganizationData> omSearchOrg(OMOrganizationData organization);

    /**
     * 取得所有组织数据
     * 
     * @return
     */
    List<OMOrganizationData> omGetAllOrganization();

    /**
     * 根据用户取得组织列表
     * 
     * @return
     */
    List<OMOrganizationData> omGetOrganizationByUser(int userId);

    /**
     * 组织选中/取消用户
     * 
     * @param map
     */
    void omAwardOrganization(Map<String, Object> map);

    /**
     * 取得该组织的子节点
     * 
     * @param id
     */
    int omGetSubCount(Integer id);

    /**
     * 根据组织名查询组织
     * 
     * @param name
     * @return
     */
    Integer omOrganizationIsExit(String name);
    
    /**zTree新增 start**/
    /**
     * 根据组织用户名称搜索
     * @param organization
     * @return
     */
    List<OMOrganizationData> omSearchOrgZTree(OMOrganizationData organization);
    /**zTree新增 end**/
}
