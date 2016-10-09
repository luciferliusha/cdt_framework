package com.zjcds.portal.mybatis.bean;

import java.util.List;

/**
 * 树实体类
 * 
 * @author linj date 2013-01-31
 * 
 * 
 */
public class TreeBean {

    private int id; // 平台ID

    private String name; // 平台名称

    private String text; // 平台名称
    
    private int type;// 平台类型：0解决方案组；1解决方案

    private Integer parentId; // 解决方案目录

    private String state; // 确定前端显示形式

    private String iconCls;// 前端显示的图标样式

    private List<TreeBean> children; // 子资源

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getText() {
        return text;
    }

    public Integer getParentId() {
        return parentId;
    }

    public String getState() {
        return state;
    }

    public String getIconCls() {
        return iconCls;
    }

    public List<TreeBean> getChildren() {
        return children;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public void setChildren(List<TreeBean> children) {
        this.children = children;
    }

    
    public int getType() {
        return type;
    }

    
    public void setType(int type) {
        this.type = type;
    }

}
