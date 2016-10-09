package com.zjcds.portal.mybatis.bean;


/**
 * 图标库实体类
 * 
 * @author linj created on 2014-2-10
 * @since CDS Framework 3.0
 */
public class Icons {

    private int iconId; // 图标ID

    private String iconName; // 图标名称
    
    private String iconNormal; // 常态图标文件名
    
    private String iconSelected; // 选中图标文件名
    
    

    public int getIconId() {
        return iconId;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconId(int iconId) {
        this.iconId = iconId;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    
    public String getIconNormal() {
        return iconNormal;
    }

    
    public String getIconSelected() {
        return iconSelected;
    }

    
    public void setIconNormal(String iconNormal) {
        this.iconNormal = iconNormal;
    }

    
    public void setIconSelected(String iconSelected) {
        this.iconSelected = iconSelected;
    }

}
