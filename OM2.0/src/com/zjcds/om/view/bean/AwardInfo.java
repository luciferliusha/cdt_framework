package com.zjcds.om.view.bean;

import java.util.List;

/**
 * 存储授权信息
 * 
 * @author Administrator
 * 
 */
public class AwardInfo {

    private Integer id;

    private Integer type; // 0代表授权 1代表取消权利

    private List<AwardInfo> value;

    private Integer permission; // 资源的具体操作,如:增删改查

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public List<AwardInfo> getValue() {
        return value;
    }

    public void setValue(List<AwardInfo> value) {
        this.value = value;
    }

    public Integer getPermission() {
        return permission;
    }

    public void setPermission(Integer permission) {
        this.permission = permission;
    }

}
