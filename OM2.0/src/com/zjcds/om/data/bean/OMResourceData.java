package com.zjcds.om.data.bean;

import java.util.Date;
import java.util.List;

/**
 * 资源实体类
 * 
 * @author yuzq
 * @date 2013/4/23
 * 
 */
public class OMResourceData {

    private Integer id; // 资源ID

    private String text;// Tree显示资源名称用

    private Integer parentId; // 父资源ID

    private Integer status; // 资源状态

    private String name; // 资源名称

    private String no; // 资源编号

    private Date createTime; // 资源创建时间

    private Date updateTime; // 资源修改时间

    private Integer permission;// 许可

    private List<OMResourceData> children; // 子资源

    private String state; // 确定前端显示形式

    private String iconCls;// 前端显示的图标样式

    private String iconSkin;//zTree显示的图标样式

    private boolean isParent;//zTree是否是父节点 

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

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        this.text = name+"("+no+")";
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
        this.text = name+"("+no+")";
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

    public Integer getPermission() {
        return permission;
    }

    public void setPermission(Integer permission) {
        this.permission = permission;
    }

    public List<OMResourceData> getChildren() {
        return children;
    }

    public void setChildren(List<OMResourceData> children) {
        this.children = children;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
        // if (this.state != null && !this.state.isEmpty()) {
        // this.iconCls = OMConstant.ICON_RESOURCE_DOUBLE;
        // }
        // else {
        // this.iconCls = OMConstant.ICON_RESOURCE_SINGLE;
        // }
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
