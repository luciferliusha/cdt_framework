package com.zjcds.portal.action.icons;

import java.io.File;

import com.zjcds.portal.action.common.FrameworkBaseAction;
import com.zjcds.portal.mybatis.bean.Icons;
import com.zjcds.portal.service.icons.IconsService;

/**
 * 图标库管理action
 * @author linj
 * 
 */
public class IconsAction extends FrameworkBaseAction {

    private static final long serialVersionUID = 1L;

    private IconsService iconsService;
    
    private String data;

    private File iconNormal;// 图标图片文件上传用

    private String iconNormalFileName;// 文件名
    
    private File iconSelected;// 图标图片文件上传用

    private String iconSelectedFileName;// 文件名

    private Icons icons;// 图标上传更新用的对象，页面中使用icons.XXX

    @Override
    public String doExecute() throws Exception {
        return null;
    }

    /**
     * 新增图标
     * 
     * @param data 图标
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String addIcons() throws Exception {
        super.writeJson(iconsService.addIcons(icons, iconNormal, iconNormalFileName, iconSelected, iconSelectedFileName));
        return null;
    }

    /**
     * 批量删除图标
     * 
     * @param data 图标
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String deleteIcons() throws Exception {
        super.writeJson(iconsService.deleteIcons(data));
        return null;
    }

    /**
     * 更新图标
     * 
     * @param data 图标
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String updateIcons() throws Exception {
        super.writeJson(iconsService.updateIcons(icons, iconNormal, iconNormalFileName, iconSelected,
                iconSelectedFileName));
        return null;
    }

    /**
     * 获取所有图标
     * 
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String getAllIcons() throws Exception {
        super.writeJson(iconsService.getAllIcons());
        return null;
    }

    
    public String getData() {
        return data;
    }

    
    public IconsService getIconsService() {
        return iconsService;
    }

    
    public File getIconNormal() {
        return iconNormal;
    }

    
    public String getIconNormalFileName() {
        return iconNormalFileName;
    }

    
    public File getIconSelected() {
        return iconSelected;
    }

    
    public String getIconSelectedFileName() {
        return iconSelectedFileName;
    }

    
    public Icons getIcons() {
        return icons;
    }

    
    public void setData(String data) {
        this.data = data;
    }

    
    public void setIconsService(IconsService iconsService) {
        this.iconsService = iconsService;
    }

    
    public void setIconNormal(File iconNormal) {
        this.iconNormal = iconNormal;
    }

    
    public void setIconNormalFileName(String iconNormalFileName) {
        this.iconNormalFileName = iconNormalFileName;
    }

    
    public void setIconSelected(File iconSelected) {
        this.iconSelected = iconSelected;
    }

    
    public void setIconSelectedFileName(String iconSelectedFileName) {
        this.iconSelectedFileName = iconSelectedFileName;
    }

    
    public void setIcons(Icons icons) {
        this.icons = icons;
    }
}
