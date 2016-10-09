package com.zjcds.portal.service.template;

/**
 * 模板库Service接口
 * 
 * @author linj
 * 
 */
public interface TemplateService {

    /**
     * 新增模板
     * 
     * @param data 模板
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String addTemplate(String data) throws Exception;

    /**
     * 批量删除模板
     * 
     * @param data 模板
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String deleteTemplate(String data);
    
    /**
     * 更具模板ID删除模板
     * 
     * @param data 模板
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String deleteTemplateById(String data);

    /**
     * 更新模板
     * 
     * @param data 模板
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String updateTemplate(String data);

    /**
     * 获取所有模板
     * 
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String getAllTemplate();
}