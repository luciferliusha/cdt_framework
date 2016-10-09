package com.zjcds.portal.service.template.impl;

import java.util.List;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.zjcds.framework.common.util.ReturnInfoUtil;
import com.zjcds.portal.mybatis.bean.Template;
import com.zjcds.portal.mybatis.dao.TemplateDao;
import com.zjcds.portal.service.template.TemplateService;

public class TemplateServiceImpl implements TemplateService {

    /** 日志 */
    private static Logger logger = Logger.getLogger(TemplateServiceImpl.class);

    /** 应用模板APP */
    private TemplateDao templateDao;

    @Override
    public String addTemplate(String data) throws Exception {
        if (data == null) {
            return ReturnInfoUtil.getFailReturnData("请传递应用模板app数据!");
        }
        Template template = JSON.parseObject(data, Template.class);
        templateDao.addTemplate(template);// 插入到数据库
        logger.info("新增模板:" + template.getId() + "成功!");
        return ReturnInfoUtil.getSuccessReturnData(JSON.toJSONString(template));
    }

    @Override
    public String deleteTemplate(String data) {
        if (data == null || data.isEmpty()) {
            return ReturnInfoUtil.getFailReturnData("请传递data参数!");
        }
        String[] appIds = data.split(",");
        templateDao.deleteTemplate(appIds);
        logger.info("删除模板：" + data + "成功!");
        return ReturnInfoUtil.getSuccessReturnData("删除成功!");
    }
    
    @Override
    public String deleteTemplateById(String data) {
        if (data == null || data.isEmpty()) {
            return ReturnInfoUtil.getFailReturnData("请传递data参数!");
        }
        Template template = JSON.parseObject(data, Template.class);
        templateDao.deleteTemplateById(template);
        logger.info("删除模板：" + data + "成功!");
        return ReturnInfoUtil.getSuccessReturnData("删除成功!");
    }

    @Override
    public String updateTemplate(String data) {
        if (data == null) {
            return ReturnInfoUtil.getFailReturnData("请传递应用模板app数据!");
        }
        Template template = JSON.parseObject(data, Template.class);
        templateDao.updateTemplate(template);
        logger.info("更新模板" + template.getId() + "成功!");
        return ReturnInfoUtil.getSuccessReturnData("更新成功!");
    }

    @Override
    public String getAllTemplate() {
        List<Template> TemplateList = templateDao.getAllTemplate();
        return ReturnInfoUtil.getSuccessReturnData(TemplateList);
    }

    public TemplateDao getTemplateDao() {
        return templateDao;
    }

    public void setTemplateDao(TemplateDao templateDao) {
        this.templateDao = templateDao;
    }

}
