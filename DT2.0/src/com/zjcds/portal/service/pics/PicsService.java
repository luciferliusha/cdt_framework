package com.zjcds.portal.service.pics;

import java.io.File;

import com.zjcds.portal.mybatis.bean.Pics;

/**
 * 图片Service接口
 * 
 * @author linj
 * 
 */
public interface PicsService {

    /**
     * 新增图标
     * 
     * @param data 图标
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String addPics(Pics pics, File pic, String picFileName) throws Exception;

    /**
     * 批量删除图标
     * 
     * @param data 图标
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String deletePics(String data);

    /**
     * 更新图标
     * 
     * @param data 图标
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String updatePics(Pics pics, File pic, String picFileName);

    /**
     * 获取所有图标
     * 
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String getAllPics();
}