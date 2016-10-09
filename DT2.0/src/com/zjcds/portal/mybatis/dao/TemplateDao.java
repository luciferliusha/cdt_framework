package com.zjcds.portal.mybatis.dao;

import java.util.List;

import com.zjcds.portal.mybatis.bean.Template;

/**
 * 模板库DAO
 * 
 * @author linj date 2014-02-10
 * 
 */
public interface TemplateDao {

    /**
     * 增加模板
     * 
     * @param 模板对象
     * @return 状态
     */
    int addTemplate(Template template);

    /**
     * 修改模板
     * 
     * @param 模板
     * @return
     */
    int updateTemplate(Template template);

    /**
     * 批量删除模板
     * 
     * @param 模板
     * @return
     */
    int deleteTemplate(String[] appIds);
    
    /**
     * 根据模板ID删除模板
     * 
     * @param 模板
     * @return
     */
    int deleteTemplateById(Template template);

    /**
     * 获取全部模板
     * 
     * @return
     */
    List<Template> getAllTemplate();

    /**
     * 根据模板ID获取模板信息
     * @param Template
     * @return
     * @author linj created on 2014-2-10 
     * @since CDS Framework 1.0
     */
    Template getTemplateById(Template template);
}
