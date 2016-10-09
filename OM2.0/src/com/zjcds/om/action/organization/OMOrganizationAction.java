package com.zjcds.om.action.organization;

import com.zjcds.framework.action.PortalBaseAction;
import com.zjcds.om.service.organization.OMOrganizationService;

/**
 * 组织动作类
 * 
 * @author yuzq
 * @date 2013/4/25
 * 
 */
public class OMOrganizationAction extends PortalBaseAction {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private OMOrganizationService organizationService;

    private String type; // 用来确定返回数据的结构

    private String data; // 接收前端数据 json格式

    private String id;//ZTree自动传递参数

    private String returnData = null; // 返回数据

    @Override
    public String doExecute() throws Exception {
        return null;
    }

    /**
     * 获得组织树
     * 
     * @return
     * @throws Exception
     */
    public String omGetOrganizationTree() throws Exception {
        if (type != null) {
            returnData = organizationService.omGetOrganizationTree(type, data);
        }
        else {
            returnData = getReturnFalse("返回数据类型不能为空!");
        }
        super.writeJson(returnData);
        return null;
    }

    /**
     * 操作组织 包括增,删,改组织信息
     */
    public String omOperateOrganization() throws Exception {
        if (type != null) {
            returnData = organizationService.omOperateOrganization(type, data);
        }
        else {
            returnData = super.getReturnFalse("操作类型不能为空!");
        }
        super.writeJson(returnData);
        return null;
    }

    /**
     * 取得组织或用户信息
     * 
     * @return
     * @throws Exception
     */
    public String omGetOrganization() throws Exception {
        returnData = organizationService.omGetOrganization(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 取得所有组织
     * 
     * @return
     * @throws Exception
     */
    public String omGetAllOrganization() throws Exception {
        returnData = organizationService.omGetAllOrganization();
        super.writeJson(returnData);
        return null;
    }

    /**
     * 搜索组织(用户)
     * 
     * @return
     * @throws Exception
     */
    public String omSerachOrganization() throws Exception {
        returnData = organizationService.omSerachOrganization(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 根据用户取得所属组织列表
     * 
     * @return
     * @throws Exception
     */
    public String omGetOrganizationByUser() throws Exception {
        returnData = organizationService.omGetOrganizationByUser(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 组织选中/取消用户
     * 
     * @return
     * @throws Exception
     */
    public String omOrganizationSelectUser() throws Exception {
        returnData = organizationService.omOrganizationSelectUser(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 取得组织下的子节点数量
     * 
     * @return
     * @throws Exception
     */
    public String omGetSubCount() throws Exception {
        returnData = organizationService.omGetSubCount(data);
        super.writeJson(returnData);
        return null;
    }

    /***zTree新增 start***/
    /**
     * 获取组织zTree
     * 
     * @return
     * @throws Exception
     */
    public String omGetOrganizationZTree() throws Exception{
    	returnData = organizationService.omGetOrganizationZTree(id);
    	super.writeJson(returnData);
    	return null;
    }
    
    /**
     * 取得所有组织
     * 
     * @return
     * @throws Exception
     */
    public String omGetZTreeAllOrganization() throws Exception {
        returnData = organizationService.omGetZTreeAllOrganization();
        super.writeJson(returnData);
        return null;
    }
    
    /**
     * 搜索zTree组织(用户)
     * 
     * @return
     * @throws Exception
     */
    public String omSerachOrganizationZTree() throws Exception {
        returnData = organizationService.omSerachOrganizationZTree(data);
        super.writeJson(returnData);
        return null;
    }
    /***zTree新增 end***/

    public OMOrganizationService getOrganizationService() {
        return organizationService;
    }

    public void setOrganizationService(OMOrganizationService organizationService) {
        this.organizationService = organizationService;
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
