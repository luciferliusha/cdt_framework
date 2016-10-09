package com.zjcds.om.action.role;

import com.zjcds.framework.action.PortalBaseAction;
import com.zjcds.om.service.role.OMRoleService;

/**
 * 角色动作类
 * 
 * @author yuzq
 * @date 2013/4/27
 * 
 */
public class OMRoleAction extends PortalBaseAction {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private OMRoleService roleService;

    private String type; // 前端参数,用于设置返回数据结构

    private String data; // 存放查询条件

    private String id;//ZTree自动传递参数

    private String returnData = null; // 返回数据

    @Override
    public String doExecute() throws Exception {
        return null;
    }

    /**
     * 获取角色树
     * 
     * @return
     * @throws Exception
     */
    public String omGetRoleTree() throws Exception {
        if (type != null) {
            returnData = roleService.omGetRoleTree(type, data);
        }
        else {
            returnData = super.getReturnFalse("返回类型不能为空!");
        }
        super.writeJson(returnData);
        return null;
    }
    
    /**
     * 根据组织ID，查询该组织的角色
     * 
     * @return
     * @throws Exception
     * @author linj created on 2013-5-6
     * @since OM 1.0
     */
    public String omGetOrganizationRole() throws Exception {
        returnData = roleService.omGetOrganizationRole(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 根据用户ID，查询该用户的角色
     * 
     * @return
     * @throws Exception
     * @author linj created on 2013-5-6
     * @since OM 1.0
     */
    public String omGetUserRole() throws Exception {
        returnData = roleService.omGetUserRole(data);
        super.writeJson(returnData);
        return null;
    }

    public String omOperateRole() throws Exception {
        if (type != null) {
            returnData = roleService.omOperateRole(type, data);
        }
        else {
            returnData = super.getReturnFalse("操作类型不能为空!");
        }
        super.writeJson(returnData);
        return null;
    }

    /**
     * 将角色赋予组织
     * 
     * @return
     * @throws Exception
     */
    public String omAwardPermission() throws Exception {
        returnData = roleService.omAwardPermission(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 取得角色信息
     * 
     * @return
     * @throws Exception
     */
    public String omGetRole() throws Exception {
        String json = roleService.omGetRole(data);
        super.writeJson(json);
        return null;
    }

    /**
     * 搜索角色
     * 
     * @return
     * @throws Exception
     */
    public String omSerachRole() throws Exception {
        returnData = roleService.omSerachRole(data);
        super.writeJson(returnData);
        return null;
    }
    
    /***zTree新增 start***/
    /**
     * 获取角色Z树
     * 
     * @return
     * @throws Exception
     */
    public String omGetRoleZTree() throws Exception{
    	returnData = roleService.omGetRoleZTree(id);
    	super.writeJson(returnData);
    	return null;
    }
    /***zTree新增 end***/

    public OMRoleService getRoleService() {
        return roleService;
    }

    public void setRoleService(OMRoleService roleService) {
        this.roleService = roleService;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
}
