package com.zjcds.portal.action.register;

import com.zjcds.portal.action.common.FrameworkBaseAction;
import com.zjcds.portal.service.register.RegisterService;

/**
 * 注册动作类
 * 
 * @author yuzq
 * 
 */
public class RegisterAction extends FrameworkBaseAction {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private String data;

    private RegisterService registerService;

    /**
     * 用户注册
     * @return
     * @throws Exception
     */
    public String userRegister() throws Exception{
        String json = registerService.cdtUserRegister(data);
        super.writeJson(json);
        return null;
    }
    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public RegisterService getRegisterService() {
        return registerService;
    }

    public void setRegisterService(RegisterService registerService) {
        this.registerService = registerService;
    }

}
