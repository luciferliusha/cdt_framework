package com.zjcds.om.service.resource.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import com.alibaba.fastjson.JSONArray;
import com.zjcds.framework.common.util.JsonUtil;
import com.zjcds.om.constant.OMConstant;
import com.zjcds.om.data.bean.OMResourceData;
import com.zjcds.om.data.dao.OMResourceDao;
import com.zjcds.om.service.OMBaseService;
import com.zjcds.om.service.resource.OMResourceService;
import com.zjcds.om.util.SqlEscapeUtil;
import com.zjcds.om.view.bean.AwardInfo;

/**
 * 资源实现类 service层
 * 
 * @author yuzq
 * @date 2013/4/23
 * 
 */
public class OMResourceServiceImpl extends OMBaseService implements OMResourceService {

    private OMResourceDao resourceDao;

    private Logger logger = Logger.getLogger(OMResourceServiceImpl.class);

    /**
     * @see com.zjcds.om.service.resource.OMResourceService #omGetResourceTree(int, String)
     */
    @Override
    public String omGetResourceTree(String type, String data) throws Exception {
        OMResourceData resource = (OMResourceData) JsonUtil.getDTO(data, OMResourceData.class);
        List<OMResourceData> resources = null;
        switch (super.stringToInt(type)) {
            case OMConstant.ONLY_RETURN_CHILDREN_DATA:
                resources = resourceDao.omGetResourceTreeOne(resource);
                break;
            case OMConstant.RETURN_ALL_DATA:
                resources = getResourceTreeData(resource);
                break;
        }
        return super.getSuccessReturnData(resources);
    }

    /**
     * 获取资源树
     */
    private List<OMResourceData> getResourceTreeData(OMResourceData resource) throws Exception {
        List<OMResourceData> resources = resourceDao.omGetResourceTreeOne(resource);
        for (OMResourceData resourceData : resources) {
            if (resourceData.getState() != null) {
                resourceData.setIconCls(OMConstant.ICON_RESOURCE_DOUBLE);
                resourceData.setChildren(getResourceTreeData(resourceData));
            }
            else {
                resourceData.setIconCls(OMConstant.ICON_RESOURCE_SINGLE);
            }
        }
        return resources;
    }

    @Override
    public String omGetRoleResource(String data) throws Exception {
        JSONObject jsonObject = JSONObject.fromObject(data);
        if (jsonObject != null && !jsonObject.isNullObject()) {
            int roleId = jsonObject.getInt(OMConstant.PARAMETER_ID);
            List<OMResourceData> resourceList = resourceDao.omGetRoleResource(roleId);
            // removeParentResource(resourceList);
            returnData = super.getSuccessReturnData(resourceList);
        }
        else {
            returnData = super.getFailReturnData("角色信息不能为空!");
        }
        return returnData;
    }

    // /**移除父资源*/
    // private void removeParentResource(List<OMResourceData> resourceList) throws Exception {
    // List<OMResourceData> list = new ArrayList<OMResourceData>();
    // for (OMResourceData parent : resourceList) {
    // for (OMResourceData child : resourceList) {
    // if (parent.getId().intValue() == child.getParentId().intValue()) {
    // if (!list.contains(parent))
    // list.add(parent);
    // }
    // }
    // }
    // resourceList.removeAll(list);
    // }

    /**
     * @see com.zjcds.om.service.resource.OMResourceService #omOperateResource(String, String)
     */
    @Override
    public String omOperateResource(String type, String data) throws Exception {
        OMResourceData resource = (OMResourceData) JsonUtil.getDTO(data, OMResourceData.class);
        if (TypeIsAdd(type))
            returnData = omAddResource(resource);
        if (TypeIsDelete(type))
            returnData = omDeleteResource(resource);
        if (TypeIsUpdate(type))
            returnData = omUpdateResource(resource);
        if (TypeIsError(type))
            returnData = super.getFailReturnData("操作类型错误!");
        return returnData;
    }

    /** 新增资源 */
    private String omAddResource(OMResourceData resource) throws Exception {
        if (resource == null) {
            returnData = super.getFailReturnData("资源信息不能为空!");
        }
        else {
            if (resource.getParentId() == null || resource.getName() == null || resource.getStatus() == null) {
                returnData = super.getFailReturnData("父目录,名称,状态都不能为空!");
            }
            else {
                resourceDao.omAddResource(resource);
                returnData = super.getSuccessReturnData(resource.getId());
            }
        }
        return returnData;
    }

    /** 删除资源 */
    private String omDeleteResource(OMResourceData resource) throws Exception {
        if (resource == null) {
            returnData = super.getFailReturnData("资源信息不能为空!");
        }
        else {
            if (resource.getId() == null) {
                returnData = super.getFailReturnData("资源ID不能为空!");
            }
            else {
                // 递归删除角色信息
                recursionDeleteResource(resource);
                returnData = super.getSuccessReturnData(" 删除成功" + resource.getId());
            }
        }
        return returnData;
    }

    /** 递归删除资源 */
    private void recursionDeleteResource(OMResourceData resource) throws Exception {
        // 删除与角色关系
        resourceDao.omDeleteRelationWithRole(resource.getId());
        // 删除资源信息
        resourceDao.omDeleteResource(resource.getId());
        logger.info("删除的资源ID为:" + resource.getId() + ",名称为:" + resource.getName());
        // 查询子资源
        List<OMResourceData> resources = resourceDao.getChildrenResource(resource.getId());
        for (OMResourceData m : resources) {
            // 递归删除
            recursionDeleteResource(m);
        }
    }

    /** 修改资源 */
    private String omUpdateResource(OMResourceData resource) throws Exception {
        if (resource == null) {
            returnData = super.getFailReturnData("资源信息不能为空!");
        }
        else {
            if (resource.getId() == null) {
                returnData = super.getFailReturnData("资源ID不能为空!");
            }
            else {
                resourceDao.omUpdateresource(resource);
                returnData = super.getSuccessReturnData("被修改的资源ID为:" + resource.getId());
            }
        }
        return returnData;
    }

    /**
     * @see com.zjcds.om.service.resource.OMResourceService #omAwardResource(String)
     */
    @Override
    public String omAwardResource(String data) throws Exception {
        AwardInfo resourceInfo = super.stringToAwardInfo(data);
        if (resourceInfo != null) {
            omSaveAwardInfo(resourceInfo);
            returnData = super.getSuccessReturnData("保存成功!");
        }
        else {
            returnData = super.getFailReturnData("保存失败!");
        }
        return returnData;
    }

    /** 组装授权信息,并保存 */
    private void omSaveAwardInfo(AwardInfo resourceInfo) throws Exception {
        // 取得资源列表
        List<AwardInfo> resourceList = resourceInfo.getValue();
        Map<String, Object> map = null;
        for (AwardInfo resource : resourceList) {
            map = new HashMap<String, Object>();
            map.put("roleId", resourceInfo.getId());
            map.put("resourceId", resource.getId());
            map.put("type", resource.getType());
            map.put("permission", resource.getPermission());
            resourceDao.omAwardRole(map);
        }
    }

    /**
     * @see com.zjcds.om.service.resource.OMResourceService #omGetResource(String)
     */
    @Override
    public String omGetResource(String data) throws Exception {
        OMResourceData resource = (OMResourceData) JsonUtil.getDTO(data, OMResourceData.class);
        if (resource != null) {
            if (resource.getId() != null) {
                OMResourceData result = resourceDao.omGetResource(resource);
                returnData = super.getSuccessReturnData(result);
            }
            else {
                returnData = super.getFailReturnData("资源ID不能为空!");
            }
        }
        else {
            returnData = super.getFailReturnData("资源不能为空!");
        }
        return returnData;
    }

    /**
     * @see com.zjcds.om.service.resource.OMResourceService #omSearchResource(String)
     */
    @Override
    public String omSearchResource(String data) throws Exception {
    	if(data != null){
    		data = SqlEscapeUtil.sqlWhereEscape2(data);
    	}
    	OMResourceData resource = (OMResourceData) JsonUtil.getDTO(data, OMResourceData.class);
        List<OMResourceData> resourceList = null;
        // if (resource == null) {
        // resourceList = resourceDao.omSearchResource("");
        // }
        // else {
        // resourceList = resourceDao.omSearchResource(resource.getName());
        // }
        // // 取出根节点
        // OMResourceData root = resourceList.get(0);
        // resourceList.remove(root);
        // List<OMResourceData> resourceListAfterSetIcon = setIcons(resourceList);
        // returnData = super.getSuccessReturnData(getCapsulationSerachResult(root, resourceListAfterSetIcon)
        // .getChildren());
        if (resource == null)
            resource = new OMResourceData();
        resourceList = resourceDao.omSearchResource2(resource);
        returnData = super.getSuccessReturnData(setReturnDataParse(resourceList));
        return returnData;
    }

    /** 处理返回数据格式 {"returnFlag":"","data":[{"id":"","id":"",...}]} */
    private List<Map<String, Object>> setReturnDataParse(List<OMResourceData> resourceList) throws Exception {
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        Map<String, Object> map = null;
        for (OMResourceData resource : resourceList) {
            map = new HashMap<String, Object>();
            map.put("id", resource.getId());
            list.add(map);
        }
        return list;
    }

    /** 设置图标 */
    @SuppressWarnings("unused")
    private List<OMResourceData> setIcons(List<OMResourceData> resourceList) throws Exception {
        for (OMResourceData resource : resourceList) {
            if (resource.getState() == null) {
                resource.setIconCls(OMConstant.ICON_RESOURCE_SINGLE);
            }
            else {
                resource.setIconCls(OMConstant.ICON_RESOURCE_DOUBLE);
            }
            resource.setState("");
        }
        return resourceList;
    }

    /** 组装搜索结果 */
    @SuppressWarnings("unused")
    private OMResourceData getCapsulationSerachResult(OMResourceData root, List<OMResourceData> resourceList)
            throws Exception {
        List<OMResourceData> children = new ArrayList<OMResourceData>();
        for (OMResourceData resource : resourceList) {
            if (resource.getParentId() == root.getId()) {
                children.add(resource);
                getCapsulationSerachResult(resource, resourceList);
            }
        }
        root.setChildren(children);
        return root;
    }

    /** 获取资源树 */
    @SuppressWarnings("unused")
    private List<Map<String, Object>> getResourceTree(int type, OMResourceData resource) throws Exception {
        // 定义集合存放所有的map元素
        List<Map<String, Object>> resourceList = new ArrayList<Map<String, Object>>();
        // 定义map存放每个资源数据
        Map<String, Object> resourceMap = null;
        List<OMResourceData> resources = resourceDao.omGetResourceTreeOne(resource);
        for (OMResourceData resourceData : resources) {
            resourceMap = new HashMap<String, Object>();
            resourceMap.put("id", resourceData.getId());
            resourceMap.put("text", resourceData.getName());
            resourceMap.put("attributes", resourceData);
            resourceMap.put("state", resourceData.getState());
            if (type == OMConstant.RETURN_ALL_DATA) {
                if (resourceData.getState() != null) {
                    resourceMap.put("children", getResourceTree(type, resourceData));
                    resourceMap.put("iconCls", "icon-resource-double");
                }
                else {
                    resourceMap.put("iconCls", "icon-resource-single");
                }
            }
            else {
            }
            resourceList.add(resourceMap);
        }
        return resourceList;
    }

    /**
     * @see com.zjcds.om.service.resource.OMResourceService #omCheckNoIsExit(java.lang.String)
     */
    @Override
    public String omCheckNoIsExit(String data) throws Exception {
        if (data != null && data != "") {
            OMResourceData resource = (OMResourceData) JsonUtil.getDTO(data, OMResourceData.class);
            if (checkParam(resource)) {
                int count = resourceDao.omCheckNoIsExit(resource);
                if (count >= 1) {
                    returnData = super.getFailReturnData("该资源编号已存在!");
                }
                else {
                    returnData = super.getSuccessReturnData("该资源编号可用!");
                }
            }
            else {
                returnData = super.getFailReturnData("资源编号不能为空!");
            }
        }
        else {
            returnData = super.getFailReturnData("参数不正确!");
        }
        return returnData;
    }

    private boolean checkParam(OMResourceData resource) throws Exception {
        return resource != null && resource.getNo() != null;
    }
    /**zTree新增 start**/
    @Override
	public String omGetResourceZTree(String id) throws Exception {
		OMResourceData resource = new OMResourceData();
		if(id != null && !id.equals("")){
			resource.setId(super.stringToInt(id));
    	}
		List<OMResourceData> resources = new ArrayList<OMResourceData>();
		getResourceZTreeData(resources,resource);
		returnData = JSONArray.toJSONString(resources);
		return returnData;
	}
    
    /**
     * 获取资源Z树
     */
    private String getResourceZTreeData(List<OMResourceData> allResources, OMResourceData resource) throws Exception {
        List<OMResourceData> resources = resourceDao.omGetResourceTreeOne(resource);
        for (OMResourceData resourceData : resources) {
            if (resourceData.getState() != null) {
            	getResourceZTreeData(allResources,resourceData);
                resourceData.setIconSkin(OMConstant.ICON_RESOURCE_DOUBLE);
                resourceData.setIsParent(true);
            }
            else {
                resourceData.setIconSkin(OMConstant.ICON_RESOURCE_SINGLE);
            }
            resourceData.setName(resourceData.getName() + "(" + resourceData.getNo() + ")");
            allResources.add(resourceData);
        }
        return null;
    }
    /**zTree新增 end**/
    // /** 获取资源树 */
    // @SuppressWarnings("unused")
    // private List<Map<String, Object>> getResourceTree(int type, OMResourceData resource) throws Exception {
    // // 定义集合存放所有的map元素
    // List<Map<String, Object>> resourceList = new ArrayList<Map<String, Object>>();
    // // 定义map存放每个资源数据
    // Map<String, Object> resourceMap = null;
    // List<OMResourceData> resources = resourceDao.omGetResourceTreeOne(resource);
    // for (OMResourceData resourceData : resources) {
    // resourceMap = new HashMap<String, Object>();
    // resourceMap.put("id", resourceData.getId());
    // resourceMap.put("text", resourceData.getName());
    // resourceMap.put("attributes", resourceData);
    // resourceMap.put("state", resourceData.getState());
    // if (type == 1) {
    // if (resourceData.getState() != null) {
    // resourceMap.put("children", getResourceTree(type, resourceData));
    // resourceMap.put("iconCls", "icon-resource-double");
    // }
    // else {
    // resourceMap.put("iconCls", "icon-resource-single");
    // }
    // }
    // else {
    // }
    // resourceList.add(resourceMap);
    // }
    // return resourceList;
    // }

    // /** 设置图标 */
    // @SuppressWarnings("unused")
    // private List<OMResourceData> setIcons(List<OMResourceData> resourceList) throws Exception {
    // for (OMResourceData resource : resourceList) {
    // if (resource.getState() == null) {
    // resource.setIconCls(OMConstant.ICON_RESOURCE_SINGLE);
    // }
    // else {
    // resource.setIconCls(OMConstant.ICON_RESOURCE_DOUBLE);
    // }
    // resource.setState("");
    // }
    // return resourceList;
    // }

    public OMResourceDao getResourceDao() {
        return resourceDao;
    }

    public void setResourceDao(OMResourceDao resourceDao) {
        this.resourceDao = resourceDao;
    }
}
