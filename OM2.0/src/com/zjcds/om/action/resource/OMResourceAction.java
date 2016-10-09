package com.zjcds.om.action.resource;

import com.zjcds.framework.action.PortalBaseAction;
import com.zjcds.om.service.resource.OMResourceService;

public class OMResourceAction extends PortalBaseAction {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private OMResourceService resourceService;

    private String type; // 用于设置返回数据格式

    private String data; // 条件数据

    private String returnData; // 返回数据

    private String id;//ZTree自动传递参数

    @Override
    public String doExecute() throws Exception {
        return null;
    }

    public String omGetResourceTree() throws Exception {
        if (type != null) {
            returnData = resourceService.omGetResourceTree(type, data);
        }
        else {
            returnData = super.getReturnFalse("返回类型不能为空");
        }
        super.writeJson(returnData);
        return null;
    }

    /**
     * 根据角色ID，取得该角色的资源
     * 
     * @return
     * @throws Exception
     * @author linj created on 2013-5-6
     * @since OM 1.0
     */
    public String omGetRoleResource() throws Exception {
        returnData = resourceService.omGetRoleResource(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 资源操作 包括增,删,改
     * 
     * @return
     * @throws Exception
     */
    public String omOperateResource() throws Exception {
        if (type != null) {
            returnData = resourceService.omOperateResource(type, data);
        }
        else {
            returnData = super.getReturnFalse("操作类型不能为空");
        }
        super.writeJson(returnData);
        return null;
    }

    /**
     * 将资源添加到角色
     * 
     * @return
     * @throws Exception
     */
    public String omAwardResource() throws Exception {
        returnData = resourceService.omAwardResource(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 取得资源信息
     * 
     * @return
     * @throws Exception
     */
    public String omGetResource() throws Exception {
        returnData = resourceService.omGetResource(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 搜索资源
     * 
     * @return
     * @throws Exception
     */
    public String omSearchResource() throws Exception {
        returnData = resourceService.omSearchResource(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 检查编号是否存在
     * 
     * @return
     * @throws Exception
     */
    public String omCheckNoIsExit() throws Exception {
        returnData = resourceService.omCheckNoIsExit(data);
        super.writeJson(returnData);
        return null;
    }

    /***zTree新增 start***/
    /**
     * 获得资源zTree
     * 
     * @return
     * @throws Exception
     */
    public String omGetResourceZTree() throws Exception {
        returnData = resourceService.omGetResourceZTree(id);
        super.writeJson(returnData);
        return null;
    }
    /***zTree新增 end***/

    public OMResourceService getResourceService() {
        return resourceService;
    }

    public void setResourceService(OMResourceService resourceService) {
        this.resourceService = resourceService;
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

}
