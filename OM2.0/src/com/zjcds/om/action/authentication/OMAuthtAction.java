package com.zjcds.om.action.authentication;

import com.zjcds.framework.action.PortalBaseAction;
import com.zjcds.om.constant.OMConstant;
import com.zjcds.om.service.authentication.OMAuthtService;


public class OMAuthtAction extends PortalBaseAction {

    /** serialVersionUID */
    private static final long serialVersionUID = 1L;

    /** 权限认证service */
    private OMAuthtService authtService;
    
    private String type;//类型
    
    private String data; // 接收前端数据 json格式

    @Override
    public String doExecute() throws Exception {
        return null;
    }

    /**
     * 登录/注销
     * @return
     * @author linj created on 2013-5-7
     * @throws Exception 
     * @since OM 1.0
     */
    public String omLogin() throws Exception {
        String returnData = null;
        if (type == null) {
            returnData = super.getReturnFalse("参数type不能为空!");
            super.writeJson(returnData);
        }
        else if (OMConstant.LOGIN.equals(type)) {//登录
            returnData = authtService.omLogin(data);
            super.writeJson(returnData);
        }
        else if (OMConstant.LOGOUT.equals(type)) {//注销
            
        }
        return null;
    }

    /**
     * 取得用户权限
     * @return
     * @author linj created on 2013-5-7 
     * @throws Exception 
     * @since OM 1.0
     */
    public String omGetUserPopedom() throws Exception {
        String returnData = authtService.omGetUserPopedom(data);
        super.writeJson(returnData);
        return null;
    }
    
    public OMAuthtService getAuthtService() {
        return authtService;
    }

    
    public void setAuthtService(OMAuthtService authtService) {
        this.authtService = authtService;
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
