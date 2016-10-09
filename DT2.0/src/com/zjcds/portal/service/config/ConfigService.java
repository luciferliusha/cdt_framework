package com.zjcds.portal.service.config;

import com.cds.framework.dao.paging.PageInfo;

/**
 * 配置Service接口
 * 
 * 
 */
public interface ConfigService {

    /**
     * 新增配置
     * 
     * @param data 配置
     */
    public String addConfig(String data) throws Exception;

    /**
     * 批量删除配置
     * 
     * @param data 配置
     */
    public String deleteConfig(String data);
    
    /**
     * 根据配置ID删除配置
     * 
     * @param data 配置
     */
    public String deleteConfigById(String data);

    /**
     * 更新配置
     * 
     * @param data 配置
     */
    public String updateConfig(String data);

    /**
     * 获取所有配置
     */
    public String getAllConfig();
    
    /**
     * 获取参数类型
     */
    public String getParamType();
    
    /**
     * 获取数据类型
     */
    public String getDataType();

    /**
     * 根据参数名称或英文名称模糊查询获取配置
     */
	public String getConfigsByName(String data);

    /**
     * 根据Id获取配置
     */
	public String getConfigById(String data);
	
	public String getConfigByNameEn(String data);

    /**
     * 判断是否存在该英文名称
     */
	public String isConfigNameEnExist(String data);

	public String getConfigList(String data, PageInfo pageInfo) throws Exception;
}