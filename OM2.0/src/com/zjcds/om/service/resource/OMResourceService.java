package com.zjcds.om.service.resource;

/**
 * 资源接口 service层
 * 
 * @author yuzq
 * @date 2013/4/23
 * 
 */
public interface OMResourceService {

    /**
     * 获取资源树
     * 
     * @param type
     * @param data
     * @return
     */
    String omGetResourceTree(String type, String data) throws Exception;

    /**
     * 根据角色ID，取得该角色的资源
     * 
     * @param data
     * @return
     * @author linj created on 2013-5-6
     * @since OM 1.0
     */
    String omGetRoleResource(String data) throws Exception;

    /**
     * 操作资源 包括增加,删除,修改资源
     * 
     * @param type
     * @param data
     * @return
     * @throws Exception
     */
    String omOperateResource(String type, String data) throws Exception;

    /**
     * 将资源添加到角色
     * 
     * @param data
     * @return
     */
    String omAwardResource(String data) throws Exception;

    /**
     * 获得资源信息
     * 
     * @param data
     * @return
     */
    String omGetResource(String data) throws Exception;

    /**
     * 搜索资源
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String omSearchResource(String data) throws Exception;

    /**
     * 检查资源编号是否存在
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String omCheckNoIsExit(String data) throws Exception;

    /**zTree新增 strat**/
    /**
     * 获取资源树
     * 
     * @param type
     * @param data
     * @return
     */
    String omGetResourceZTree(String id) throws Exception;
    /**zTree新增 end**/
}
