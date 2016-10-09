package com.zjcds.portal.mybatis.dao;

import java.util.List;

import com.cds.framework.dao.paging.PageInfo;
import com.zjcds.portal.mybatis.bean.Config;

/**
 * 配置类DAO
 * 
 * @author xinyf
 * 
 */
public interface ConfigDao {

    /**
     * 增加配置
     * 
     * @param 配置对象
     * @return 状态
     */
    int addConfig(Config config);

    /**
     * 批量删除配置
     * 
     * @param 配置
     * @return
     */
    int deleteConfig(String[] ids);
    
    /**
     * 根据配置ID删除配置
     * 
     * @param 配置
     * @return
     */
    int deleteConfigById(Config config);

    /**
     * 修改配置
     * 
     * @param 配置
     * @return
     */
    int updateConfig(Config template);
    
    /**
     * 获取全部配置
     * 
     * @return
     */
    List<Config> getAllConfig();
    
    /**
     * 获取参数类型
     * 
     * @return
     */
    List<Config> getParamType();
    
    /**
     * 获取数据类型
     * 
     * @return
     */
    List<Config> getDataType();
    
    /**
     * 根据参数名称或英文名称模糊查询配置信息
     * 
     * @return
     */
    List<Config> getConfigsByName(Config name);

    /**
     * 根据配置ID获取配置信息
     * @param Config
     */
    Config getConfigById(Config config);
    
    /**
     * 根据英文名称获取配置
     * @param Config
     */
    Config getConfigByNameEn(Config config);

	List<Config> getConfigList(PageInfo pageInfo, Config config);
}
