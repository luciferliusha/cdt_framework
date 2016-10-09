package com.zjcds.om.data.bean;

/**
 * 组织角色实体类
 * @author yuzq
 * @date 2013/4/23
 *
 */
public class OMOrganizationRoleData {

    private Integer organizationId;   //组织ID
    private Integer roleId;    //角色ID
    
    public Integer getOrganizationId() {
        return organizationId;
    }
    
    public void setOrganizationId(Integer organizationId) {
        this.organizationId = organizationId;
    }
    
    public Integer getRoleId() {
        return roleId;
    }
    
    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }
    
}
