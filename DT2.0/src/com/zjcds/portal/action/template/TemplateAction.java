package com.zjcds.portal.action.template;

import com.zjcds.portal.action.common.FrameworkBaseAction;
import com.zjcds.portal.service.template.TemplateService;

/**
 * 模板库管理action
 * 
 * @author linj created on 2014-2-11
 * @since CDS Framework 1.0
 */
public class TemplateAction extends FrameworkBaseAction {

    private static final long serialVersionUID = 1L;

    private TemplateService templateService;

    private String data;

    @Override
    public String doExecute() throws Exception {
        return null;
    }

    /**
     * 新增模板
     * 
     * @param data 模板
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String addTemplate() throws Exception {
        super.writeJson(templateService.addTemplate(data));
        return null;
    }

    /**
     * 批量删除模板
     * 
     * @param data 模板
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String deleteTemplate() throws Exception {
        super.writeJson(templateService.deleteTemplate(data));
        return null;
    }
    
    /**
     * 根据模板ID删除模板
     * 
     * @param data 模板
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String deleteTemplateById() throws Exception {
        super.writeJson(templateService.deleteTemplateById(data));
        return null;
    }

    /**
     * 更新模板
     * 
     * @param data 模板
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String updateTemplate() throws Exception {
        super.writeJson(templateService.updateTemplate(data));
        return null;
    }

    /**
     * 获取所有模板
     * 
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String getAllTemplate() throws Exception {
        super.writeJson(templateService.getAllTemplate());
        return null;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public TemplateService getTemplateService() {
        return templateService;
    }

    public void setTemplateService(TemplateService templateService) {
        this.templateService = templateService;
    }

}
