package com.zjcds.portal.service.setting;

import java.io.File;

/**
 * 系统配置Service接口
 * 
 * @author linj
 * 
 */
public interface SettingService {

    /**
     * 更新系统配置
     * 
     * @param data 信息
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String updateInfo(String data) throws Exception;


    /**
     * 更新图标
     * 
     * @param data 图标
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String updateLogo(File pic, String picFileName) throws Exception;
}