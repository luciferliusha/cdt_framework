package com.zjcds.om.data.bean;

import java.util.Date;
import java.util.List;

/**
 * 角色实体类
 * 
 * @author yuzq
 * @date 2013/4/23
 * 
 */
public class OMRoleData {

    private Integer id; // 角色ID

    private String text; // Tree显示角色名称用

    private Integer parentId; // 父ID

    private String name; // 角色名称

    private Integer status; // 角色状态

    private Date createTime; // 角色创建时间

    private Date updateTime; // 角色修改时间

    private String state; // 用于设置前端显示形式 "closed"文件夹 "opend"为文件

    private String iconCls;// 前端显示的图标样式

    private String iconSkin;//zTree显示的图标样式
    
    private boolean isParent;//zTree是否是父节点

    private List<OMRoleData> children;// 子节点

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        this.text = name;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
        // if (this.state != null && !this.state.isEmpty()) {
        // this.iconCls = OMConstant.ICON_ROLE_DOUBLE;
        // }
        // else {
        // this.iconCls = OMConstant.ICON_ROLE_SINGLE;
        // }
    }

    public List<OMRoleData> getChildren() {
        return children;
    }

    public void setChildren(List<OMRoleData> children) {
        this.children = children;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }
	
	public String getIconSkin() {
		return iconSkin;
	}

	public void setIconSkin(String iconSkin) {
		this.iconSkin = iconSkin;
	}

	public boolean getIsParent() {
		return isParent;
	}

	public void setIsParent(boolean isParent) {
		this.isParent = isParent;
	}
}
