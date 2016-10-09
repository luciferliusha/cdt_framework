package com.zjcds.portal.mybatis.dao;

import java.util.List;

import com.zjcds.portal.mybatis.bean.Icons;

/**
 * 图标库DAO
 * 
 * @author linj date 2014-02-10
 * 
 */
public interface IconsDao {

    /**
     * 增加图标
     * 
     * @param 图标对象
     * @return 状态
     */
    int addIcons(Icons icons);

    /**
     * 修改图标
     * 
     * @param 图标
     * @return
     */
    int updateIcons(Icons icons);

    /**
     * 批量删除图标
     * 
     * @param 图标
     * @return
     */
    int deleteIcons(String[] appIds);

    /**
     * 获取全部图标
     * 
     * @return
     */
    List<Icons> getAllIcons();

    /**
     * 根据图标ID获取图标信息
     * @param icons
     * @return
     * @author linj created on 2014-2-10 
     * @since CDS Framework 1.0
     */
    Icons getIconById(Icons icons);
}
