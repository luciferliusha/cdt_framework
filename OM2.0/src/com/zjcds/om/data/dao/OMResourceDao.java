package com.zjcds.om.data.dao;

import java.util.List;
import java.util.Map;

import com.zjcds.om.data.bean.OMResourceData;
import com.zjcds.om.data.bean.OMUserPermissionData;

/**
 * 资源接口 dao层
 * 
 * @author yuzq
 * @date 2013/4/27
 * 
 */
public interface OMResourceDao {

    /**
     * 取得资源树 获取一层数据
     * 
     * @param resourceData
     * @return
     */
    List<OMResourceData> omGetResourceTreeOne(OMResourceData resourceData);

    /**
     * 取得子资源
     * 
     * @param id
     * @return
     */
    List<OMResourceData> getChildrenResource(int id);

    /**
     * 根据角色ID，取得该角色的资源
     * 
     * @param roleId 角色ID
     * @return
     * @author linj created on 2013-5-6
     * @since OM 1.0
     */
    List<OMResourceData> omGetRoleResource(int roleId);

    /**
     * 根据用户ID，取得该用户的所有资源权限
     * 
     * @param roleId 角色ID
     * @return
     * @author linj created on 2013-5-6
     * @since OM 1.0
     */
    List<OMUserPermissionData> omGetUserAllResource(Map<String, Object> map);

    /**
     * 根据用户ID，取得该用户的所有资源权限，返回资源对象
     * 
     * @param roleId 角色ID
     * @return
     * @author linj created on 2013-5-6
     * @since OM 1.0
     */
    List<OMResourceData> omGetUserAllResourceInfo(Map<String, Object> map);

    /**
     * 修改资源
     * 
     * @param resource
     */
    void omUpdateresource(OMResourceData resource);

    /**
     * 根据资源ID删除资源与角色的关系
     * 
     * @param id
     */
    void omDeleteRelationWithRole(int id);

    /**
     * 根据资源ID删除资源信息
     * 
     * @param id
     */
    void omDeleteResource(int id);

    /**
     * 新增资源信息
     * 
     * @param resource
     */
    void omAddResource(OMResourceData resource);

    /**
     * 将资源赋予给角色
     * 
     * @param map
     */
    void omAwardRole(Map<String, Object> map);

    /**
     * 取得资源信息
     * 
     * @param resource
     * @return
     */
    OMResourceData omGetResource(OMResourceData resource);

    /**
     * 组织资源
     * 
     * @param name 关键字
     * @return 包括父子信息的资源
     * @author linj created on 2013-5-13
     * @since OM 1.0
     */
    List<OMResourceData> omSearchResource(String name);

    /**
     * 搜索资源 不拼装层次结构数据
     * 
     * @param name
     * @return
     */
    List<OMResourceData> omSearchResource2(OMResourceData resource);

    /**
     * 检查资源编号是否存在
     * 
     * @param resource
     * @return
     */
    int omCheckNoIsExit(OMResourceData resource);

    /**
     * 取得父资源
     * 
     * @param parentId
     * @return
     * @author yuzq created on 2013-11-8
     * @since CDS Framework 1.0
     */
    OMResourceData getParentResource(Integer parentId);
}
