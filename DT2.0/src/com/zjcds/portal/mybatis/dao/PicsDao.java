package com.zjcds.portal.mybatis.dao;

import java.util.List;

import com.zjcds.portal.mybatis.bean.Pics;

/**
 * 图标库DAO
 * 
 * @author linj date 2014-02-10
 * 
 */
public interface PicsDao {

    /**
     * 增加图标
     * 
     * @param 图标对象
     * @return 状态
     */
    int addPics(Pics pics);

    /**
     * 修改图标
     * 
     * @param 图标
     * @return
     */
    int updatePics(Pics pics);

    /**
     * 批量删除图标
     * 
     * @param 图标
     * @return
     */
    int deletePics(String[] appIds);

    /**
     * 获取全部图标
     * 
     * @return
     */
    List<Pics> getAllPics();

    /**
     * 根据图标ID获取图标信息
     * @param pics
     * @return
     * @author linj created on 2014-2-10 
     * @since CDS Framework 1.0
     */
    Pics getPicById(Pics pics);
}
