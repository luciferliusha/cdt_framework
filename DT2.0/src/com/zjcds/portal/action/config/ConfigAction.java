package com.zjcds.portal.action.config;


import com.cds.framework.dao.paging.PageInfo;
import com.zjcds.portal.action.common.FrameworkBaseAction;
import com.zjcds.portal.service.config.ConfigService;

/**
 * 配置管理action
 * 
 * @author xinyf
 */
public class ConfigAction extends FrameworkBaseAction {

    private static final long serialVersionUID = 1L;

    private ConfigService configService;

    private String data;
    
    /**
     * 分页用参数
     */
    private Integer page; // 当前页

    private Integer rows; // 每页的行数

    @Override
    public String doExecute() throws Exception {
        return null;
    }

    /**
     * 新增配置
     * 
     * @param data 配置
     */
    public String addConfig() throws Exception {
        super.writeJson(configService.addConfig(data));
        return null;
    }


    /**
     * 更新配置
     * 
     * @param data 配置
     */
    public String updateConfig() throws Exception {
        super.writeJson(configService.updateConfig(data));
        return null;
    }
    
    /**
     * 批量删除配置
     * 
     * @param data 配置
     */
    public String deleteConfig() throws Exception {
        super.writeJson(configService.deleteConfig(data));
        return null;
    }
    
    /**
     * 根据配置ID删除配置
     * 
     * @param data 配置
     */
    public String deleteConfigById() throws Exception {
        super.writeJson(configService.deleteConfigById(data));
        return null;
    }

    /**
     * 获取所有配置
     */
    public String getAllConfig() throws Exception {
        super.writeJson(configService.getAllConfig());
        return null;
    }
    
    /**
     * 根据参数名称或英文名称模糊查询获取配置
     */
    public String getConfigsByName() throws Exception {
        super.writeJson(configService.getConfigsByName(data));
        return null;
    }
    
    /**
     * 根据Id获取配置
     */
    public String getConfigById() throws Exception {
        super.writeJson(configService.getConfigById(data));
        return null;
    }
    
    /**
     * 根据参数名称或英文名称查询获取配置
     */
    public String getConfigByNameEn() throws Exception {
        super.writeJson(configService.getConfigByNameEn(data));
        return null;
    }
    
    /**
     * 获取参数类型
     */
    public String getParamType() throws Exception {
        super.writeJson(configService.getParamType());
        return null;
    }
    
    /**
     * 获取数据类型
     */
    public String getDataType() throws Exception {
        super.writeJson(configService.getDataType());
        return null;
    }
    
    /**
     * 判断是否存在该英文名称
     */
    public String isConfigNameEnExist() throws Exception {
        super.writeJson(configService.isConfigNameEnExist(data));
        return null;
    }
    
    public String getConfigList() throws Exception {
        PageInfo pageInfo = new PageInfo();
        if (page != null) {
            pageInfo.setPageNo(page);
        }
        if (rows != null) {
            pageInfo.setPageSize(rows);
        }
        super.writeJson(configService.getConfigList(data,pageInfo));
        return null;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public ConfigService getConfigService() {
        return configService;
    }

    public void setConfigService(ConfigService configService) {
        this.configService = configService;
    }

	public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}

	public Integer getRows() {
		return rows;
	}

	public void setRows(Integer rows) {
		this.rows = rows;
	}

}
