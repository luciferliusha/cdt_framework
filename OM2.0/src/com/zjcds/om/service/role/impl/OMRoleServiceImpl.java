package com.zjcds.om.service.role.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import com.alibaba.fastjson.JSONArray;
import com.zjcds.framework.common.util.JsonUtil;
import com.zjcds.om.constant.OMConstant;
import com.zjcds.om.data.bean.OMRoleData;
import com.zjcds.om.data.dao.OMResourceDao;
import com.zjcds.om.data.dao.OMRoleDao;
import com.zjcds.om.service.OMBaseService;
import com.zjcds.om.service.role.OMRoleService;
import com.zjcds.om.util.SqlEscapeUtil;
import com.zjcds.om.view.bean.AwardInfo;

/**
 * 角色实现类 service层
 * 
 * @author yuzq
 * @date 2013/4/24
 * 
 */
public class OMRoleServiceImpl extends OMBaseService implements OMRoleService {

    private OMRoleDao roleDao;

    private OMResourceDao resourceDao;

    private Logger logger = Logger.getLogger(OMRoleServiceImpl.class);

    /**
     * @see com.zjcds.om.service.role.OMRoleService #omGetRoleTree(int, String)
     */
    @Override
    public String omGetRoleTree(String type, String data) throws Exception {
        OMRoleData role = (OMRoleData) JsonUtil.getDTO(data, OMRoleData.class);
        List<OMRoleData> roles = null;
        switch (super.stringToInt(type)) {
            case OMConstant.ONLY_RETURN_CHILDREN_DATA:
                roles = roleDao.omGetRoleTreeOne(role);
                break;
            case OMConstant.RETURN_ALL_DATA:
                roles = getRoleTreeData(role);
                break;
        }
        returnData = super.getSuccessReturnData(roles);
        return returnData;
    }

    @Override
    public String omGetOrganizationRole(String data) throws Exception {
        JSONObject jsonObject = JSONObject.fromObject(data);
        if (jsonObject != null && !jsonObject.isNullObject()) {
            int orgId = jsonObject.getInt(OMConstant.PARAMETER_ID);
            List<OMRoleData> roleList = roleDao.omGetOrganizationRole(orgId);
            returnData = super.getSuccessReturnData(roleList);
        }
        else {
            returnData = super.getFailReturnData("组织信息不能为空!");
        }
        return returnData;
    }

    @Override
    public String omGetUserRole(String data) throws Exception {
        JSONObject jsonObject = JSONObject.fromObject(data);
        if (jsonObject != null && !jsonObject.isNullObject()) {
            int userId = jsonObject.getInt(OMConstant.PARAMETER_ID);
            List<OMRoleData> roleList = roleDao.omGetUserRole(userId);
            returnData = super.getSuccessReturnData(roleList);
        }
        else {
            returnData = super.getFailReturnData("用户信息不能为空!");
        }
        return returnData;
    }

    /**
     * @see com.zjcds.om.service.role.OMRoleService #omOperateRole(String, String)
     */
    @Override
    public String omOperateRole(String type, String data) throws Exception {
        OMRoleData role = (OMRoleData) JsonUtil.getDTO(data, OMRoleData.class);
        if (TypeIsAdd(type))
            returnData = omAddRole(role);
        if (TypeIsDelete(type))
            returnData = omDeleteRole(role);
        if (TypeIsUpdate(type))
            returnData = omUpdateRole(role);
        if (TypeIsError(type))
            returnData = super.getFailReturnData("操作类型错误!");
        return returnData;
    }

    /**
     * @see com.zjcds.om.service.role.OMRoleService #omAwardPermission(String)
     */
    @Override
    public String omAwardPermission(String data) throws Exception {
        AwardInfo roleInfo = super.stringToAwardInfo(data);
        returnData = omRelationWithOrganization(roleInfo);
        return returnData;
    }

    /** 建立或删除角色与组织(用户)的关系 */
    private String omRelationWithOrganization(AwardInfo roleInfo) throws Exception {
        if (roleInfo != null) {
            // 取得组织ID
            int organizationId = roleInfo.getId();
            // 取得角色列表
            List<AwardInfo> roleList = roleInfo.getValue();
            Map<String, Object> map = null;
            if (roleList != null) {
                // 建立或删除角色与组织的关系
                for (AwardInfo role : roleList) {
                    map = new HashMap<String, Object>();
                    map.put("organizationId", organizationId);
                    // 角色ID
                    map.put("roleId", role.getId());
                    // 操作类型 0代表授权 1代表取消权利
                    map.put("type", role.getType());
                    if (roleInfo.getType() == 0) {
                        roleDao.omAwardOrganization(map);
                    }
                    else if (roleInfo.getType() == 1) {
                        roleDao.omAwardUser(map);
                    }
                    omRelationWithResource(role);
                }
            }
            returnData = super.getSuccessReturnData("操作成功!");
        }
        else {
            returnData = super.getFailReturnData("操作失败!");
        }
        return returnData;
    }

    /** 建立或删除角色与资源的关系 */
    private void omRelationWithResource(AwardInfo role) throws Exception {
        Map<String, Object> map = null;
        // 取得资源列表
        List<AwardInfo> resourceList = role.getValue();
        if (resourceList != null) {
            // 建立或删除资源与角色的关系
            for (AwardInfo resource : resourceList) {
                map = new HashMap<String, Object>();
                // 角色ID
                map.put("roleId", role.getId());
                // 资源ID
                map.put("resourceId", resource.getId());
                // 操作类型
                map.put("type", resource.getType());
                resourceDao.omAwardRole(map);
            }
        }
    }

    /**
     * @see com.zjcds.om.service.role.OMRoleService #omGetRole(String)
     */
    @Override
    public String omGetRole(String data) throws Exception {
        OMRoleData role = (OMRoleData) JsonUtil.getDTO(data, OMRoleData.class);
        if (role != null) {
            if (role.getId() != null) {
                OMRoleData result = roleDao.omGetRole(role);
                returnData = super.getSuccessReturnData(result);
            }
            else {
                returnData = super.getFailReturnData("角色ID不能为空!");
            }
        }
        else {
            returnData = super.getFailReturnData("角色不能为空!");
        }
        return returnData;
    }

    /**
     * @see com.zjcds.om.service.role.OMRoleService #omSerachRole(String)
     */
    @Override
    public String omSerachRole(String data) throws Exception {
    	if(data != null){
    		data = SqlEscapeUtil.sqlWhereEscape2(data);
    	}
    	OMRoleData role = (OMRoleData) JsonUtil.getDTO(data, OMRoleData.class);
        // List<OMRoleData> roleList = null;
        // if (role == null) {
        // roleList = roleDao.omSearchRole("");
        // }
        // else {
        // roleList = roleDao.omSearchRole(role.getName());
        // }
        // // 取出根节点
        // OMRoleData root = roleList.get(0);
        // roleList.remove(root);
        // List<OMRoleData> roleListAfterSetIcon = setIcons(roleList);
        // returnData = super.getSuccessReturnData(getCapsulationSerachResult(root,
        // roleListAfterSetIcon).getChildren());
        List<OMRoleData> roleList = null;
        if (role == null)
            role = new OMRoleData();
        roleList = roleDao.omSearchRole2(role);
        returnData = super.getSuccessReturnData(setReturnDataParse(roleList));
        return returnData;
    }

    /** 处理返回数据格式 {"returnFlag":"","data":[{"id":"","id":"",...}]} */
    private List<Map<String, Object>> setReturnDataParse(List<OMRoleData> roleList) throws Exception {
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        Map<String, Object> map = null;
        for (OMRoleData role : roleList) {
            map = new HashMap<String, Object>();
            map.put("id", role.getId());
            list.add(map);
        }
        return list;
    }

    /** 设置图标和state */
    @SuppressWarnings("unused")
    private List<OMRoleData> setIcons(List<OMRoleData> roleList) throws Exception {
        for (OMRoleData role : roleList) {
            if (role.getState() == null) {
                role.setIconCls(OMConstant.ICON_ROLE_SINGLE);
            }
            else {
                role.setIconCls(OMConstant.ICON_ROLE_DOUBLE);
            }
            role.setState("");
        }
        return roleList;
    }

    /** 组装搜索结果 */
    @SuppressWarnings("unused")
    private OMRoleData getCapsulationSerachResult(OMRoleData root, List<OMRoleData> roleList) throws Exception {
        List<OMRoleData> children = new ArrayList<OMRoleData>();
        for (OMRoleData role : roleList) {
            if (role.getParentId() == root.getId()) {
                children.add(role);
                getCapsulationSerachResult(role, roleList);
            }
        }
        root.setChildren(children);
        return root;
    }

    /** 获取角色树 */
    @SuppressWarnings("unused")
    private List<Map<String, Object>> getRoleTree(int type, OMRoleData role) throws Exception {
        // 定义集合存放所有的map元素
        List<Map<String, Object>> resourceList = new ArrayList<Map<String, Object>>();
        // 定义map存放每个角色数据
        Map<String, Object> roleMap = null;
        List<OMRoleData> roles = roleDao.omGetRoleTreeOne(role);
        for (OMRoleData rolwData : roles) {
            roleMap = new HashMap<String, Object>();
            roleMap.put("id", rolwData.getId());
            roleMap.put("text", rolwData.getName());
            roleMap.put("attributes", rolwData);
            roleMap.put("state", rolwData.getState());
            if (type == 1) {
                if (rolwData.getState() != null) {
                    roleMap.put("children", getRoleTree(type, rolwData));
                    roleMap.put("iconCls", "icon-role-double");
                }
                else {
                    roleMap.put("iconCls", "icon-role-single");
                }
            }
            resourceList.add(roleMap);
        }
        return resourceList;
    }

    /** 获取角色树 */
    private List<OMRoleData> getRoleTreeData(OMRoleData role) throws Exception {
        List<OMRoleData> roles = roleDao.omGetRoleTreeOne(role);
        for (OMRoleData roleData : roles) {
            if (roleData.getState() != null) {
                roleData.setIconCls(OMConstant.ICON_ROLE_DOUBLE);
                roleData.setChildren(getRoleTreeData(roleData));
            }
            else {
                roleData.setIconCls(OMConstant.ICON_ROLE_SINGLE);
            }
        }
        return roles;
    }

    /** 新增角色 */
    private String omAddRole(OMRoleData role) throws Exception {
        if (role == null) {
            returnData = super.getFailReturnData("角色信息不能为空!");
        }
        else {
            if (role.getParentId() == null || role.getName() == null || role.getStatus() == null) {
                returnData = super.getFailReturnData("父目录,名称,状态都不能为空!");
            }
            else {
                roleDao.omAddRole(role);
                returnData = super.getSuccessReturnData(role.getId());
            }
        }
        return returnData;
    }

    /** 删除角色 */
    private String omDeleteRole(OMRoleData role) throws Exception {
        if (role == null) {
            returnData = super.getFailReturnData("角色信息不能为空!");
        }
        else {
            if (role.getId() == null) {
                returnData = super.getFailReturnData("角色ID不能为空!");
            }
            else {
                recursionDeleteRole(role);
                returnData = super.getSuccessReturnData(" 删除成功" + role.getId());
            }
        }
        return returnData;
    }

    /** 修改角色 */
    private String omUpdateRole(OMRoleData role) throws Exception {
        if (role == null) {
            returnData = super.getFailReturnData("角色信息不能为空!");
        }
        else {
            if (role.getId() == null) {
                returnData = super.getFailReturnData("角色ID不能为空!");
            }
            else {
                roleDao.omUpdateRole(role);
                returnData = super.getSuccessReturnData(role.getId());
            }
        }
        return returnData;
    }

    /** 递归删除角色及下一级角色 */
    private void recursionDeleteRole(OMRoleData role) throws Exception {
        roleDao.omDeleteRelationWithOrganization(role.getId());
        roleDao.omDeleteRelationWithUser(role.getId());
        roleDao.omDeleteRelationWithResource(role.getId());
        roleDao.omDeleteRole(role.getId());
        logger.info("删除角色ID为:" + role.getId() + ",角色名称为:" + role.getName());
        // 获取子角色
        List<OMRoleData> roles = roleDao.getChildRole(role.getId());
        for (OMRoleData r : roles) {
            recursionDeleteRole(r);
        }
    }

    /***zTree新增 start***/
    @Override
    public String omGetRoleZTree(String id) throws Exception{
    	OMRoleData role = new OMRoleData();
    	if(id != null && !id.equals("")){
    		role.setId(super.stringToInt(id));
    	}
    	
    	List<OMRoleData> roles = new ArrayList<OMRoleData>();
    	omGetRoleZTreeData(roles,role);
    	returnData = JSONArray.toJSONString(roles);
    	return returnData;
    }
    
    public String omGetRoleZTreeData(List<OMRoleData> allRoles,OMRoleData role) throws Exception{
    	List<OMRoleData> roles = roleDao.omGetRoleTreeOne(role);
    	for (OMRoleData roleData : roles) {
    		
    		if (roleData.getState() != null) {
    			omGetRoleZTreeData(allRoles,roleData);
    			roleData.setIconSkin(OMConstant.ICON_ROLE_DOUBLE);
    			roleData.setIsParent(true);
    		}
    		else{
    			roleData.setIconSkin(OMConstant.ICON_ROLE_SINGLE);
    			roleData.setIsParent(false);
    		}
    		allRoles.add(roleData);
    	}
    	return null;
    }
    /***zTree新增 end***/
    
    public OMRoleDao getRoleDao() {
        return roleDao;
    }

    public void setRoleDao(OMRoleDao roleDao) {
        this.roleDao = roleDao;
    }

    public OMResourceDao getResourceDao() {
        return resourceDao;
    }

    public void setResourceDao(OMResourceDao resourceDao) {
        this.resourceDao = resourceDao;
    }
    
}
