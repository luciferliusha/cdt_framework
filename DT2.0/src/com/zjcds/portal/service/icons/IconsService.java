package com.zjcds.portal.service.icons;

import java.io.File;

import com.zjcds.portal.mybatis.bean.Icons;

/**
 * 登录Service接口
 * 
 * @author linj
 * 
 */
public interface IconsService {

    /**
     * 新增图标
     * 
     * @param data 图标
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String addIcons(Icons icons, File iconNormal, String normalFileName, File iconSelected,
            String selectedFileName) throws Exception;

    /**
     * 批量删除图标
     * 
     * @param data 图标
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String deleteIcons(String data);

    /**
     * 更新图标
     * 
     * @param data 图标
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String updateIcons(Icons icons, File iconNormal, String normalFileName, File iconSelected,
            String selectedFileName);

    /**
     * 获取所有图标
     * 
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String getAllIcons();
}