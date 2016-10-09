package com.zjcds.om.action.user;

import com.zjcds.framework.action.PortalBaseAction;
import com.zjcds.om.service.user.OMUserService;

/**
 * 用户动作类
 * 
 * @author yuzq
 * @date 2013-5-6
 * 
 */
public class OMUserAction extends PortalBaseAction {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private Integer organizationId; // 组织ID

    private Integer userId; // 用户ID

    private String data;

    private OMUserService userService;

    private String returnData = null; // 返回数据

    @Override
    public String doExecute() throws Exception {
        return null;
    }

    /**
     * 移除用户与组织的关系
     * 
     * @return
     * @throws Exception
     */
    public String omRemoveRelation() throws Exception {
        String returnData = userService.omRemoveRelationUserWithOrganization(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 验证用户是否存在 根据邮箱验证
     * 
     * @return
     * @throws Exception
     */
    public String omUserIsExit() throws Exception {
        returnData = userService.omUserIsExit(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 取得所有用户
     * 
     * @return
     * @throws Exception
     */
    public String omGetAllUser() throws Exception {
        returnData = userService.omGetAllUser();
        super.writeJson(returnData);
        return null;
    }

    /**
     * 根据组织取得包含的用户
     * 
     * @return
     * @throws Exception
     */
    public String omGetUserByOrganization() throws Exception {
        returnData = userService.omGetUserByOrganization(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 用户选中/取消组织
     * 
     * @return
     * @throws Exception
     */
    public String omUserSelectOrganization() throws Exception {
        returnData = userService.omUserSelectOrganization(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 取得可分享用户列表
     * 
     * @return
     * @throws Exception
     */
    public String omGetShareUser() throws Exception {
        returnData = userService.omGetShareUser(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 用户注册
     * 
     * @return
     * @throws Exception
     */
    public String omUserRegister() throws Exception {
        returnData = userService.omUserRegister(data);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 修改密码
     * 
     * @return
     * @throws Exception
     */
    public String omUpdatePassword() throws Exception {
        returnData = userService.omUpdatePassword(data);
        super.writeJson(returnData);
        return null;
    }

    /***zTree新增  start***/
    /**
     * 取得所有用户
     * 
     * @return
     * @throws Exception
     */
    public String omGetZTreeAllUser() throws Exception {
        returnData = userService.omGetZTreeAllUser();
        super.writeJson(returnData);
        return null;
    }
    /***zTree新增  end***/
    public Integer getOrganizationId() {
        return organizationId;
    }
    
    /**
     * 获取当前用户信息
     * @return
     */
    public String omGetUserInfo() throws Exception{
    	returnData = userService.omGetUserInfo(data);
    	super.writeJson(returnData);
    	return null;
    }

    public void setOrganizationId(Integer organizationId) {
        this.organizationId = organizationId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public OMUserService getUserService() {
        return userService;
    }

    public void setUserService(OMUserService userService) {
        this.userService = userService;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

}
