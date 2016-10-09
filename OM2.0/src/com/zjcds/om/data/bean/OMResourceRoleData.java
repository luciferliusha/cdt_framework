package com.zjcds.om.data.bean;

/**
 * 资源角色实体类
 * 
 * @author yuzq
 * @date 2013/4/23
 * 
 */
public class OMResourceRoleData {

    private Integer roleId; // 角色ID

    private Integer resourceId; // 资源ID

    private Integer permission; // 权限

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public Integer getResourceId() {
        return resourceId;
    }

    public void setResourceId(Integer resourceId) {
        this.resourceId = resourceId;
    }

    public Integer getPermission() {
        return permission;
    }

    public void setPermission(Integer permission) {
        this.permission = permission;
    }

}
