package com.zjcds.portal.service.config.impl;

import java.util.List;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.cds.framework.dao.paging.PageInfo;
import com.zjcds.framework.common.util.ReturnInfoUtil;
import com.zjcds.portal.mybatis.bean.Config;
import com.zjcds.portal.mybatis.dao.ConfigDao;
import com.zjcds.portal.service.CDTBaseService;
import com.zjcds.portal.service.config.ConfigService;

public class ConfigServiceImpl extends CDTBaseService implements ConfigService {

    /** 日志 */
    private static Logger logger = Logger.getLogger(ConfigServiceImpl.class);

    private ConfigDao configDao;

    @Override
    public String addConfig(String data) throws Exception {
        if (data == null) {
            return ReturnInfoUtil.getFailReturnData("请传递data参数!");
        }
        Config config = JSON.parseObject(data, Config.class);
        configDao.addConfig(config);
        logger.info("新增配置:" + config.getId() + "成功!");
        return ReturnInfoUtil.getSuccessReturnData(JSON.toJSONString(config));
    }

    @Override
    public String deleteConfig(String data) {
        if (data == null || data.isEmpty()) {
            return ReturnInfoUtil.getFailReturnData("请选择一条记录!");
        }
        String[] appIds = data.split(",");
        configDao.deleteConfig(appIds);
        logger.info("删除配置：" + data + "成功!");
        return ReturnInfoUtil.getSuccessReturnData("删除成功!");
    }
    
    @Override
    public String deleteConfigById(String data) {
        if (data == null || data.isEmpty()) {
            return ReturnInfoUtil.getFailReturnData("请传递data参数!");
        }
        Config config = JSON.parseObject(data, Config.class);
        configDao.deleteConfigById(config);
        logger.info("删除配置：" + data + "成功!");
        return ReturnInfoUtil.getSuccessReturnData("删除成功!");
    }

    @Override
    public String updateConfig(String data) {
        if (data == null) {
            return ReturnInfoUtil.getFailReturnData("请传递data参数!");
        }
        Config config = JSON.parseObject(data, Config.class);
        configDao.updateConfig(config);
        logger.info("更新配置" + config.getId() + "成功!");
        return ReturnInfoUtil.getSuccessReturnData("更新成功!");
    }

    @Override
    public String getAllConfig() {
        List<Config> configList = configDao.getAllConfig();
        return ReturnInfoUtil.getSuccessReturnData(configList);
    }
    
	@Override
	public String getConfigById(String data) {
        if (data == null) {
            return ReturnInfoUtil.getFailReturnData("请传递data参数!");
        }
        Config config = JSON.parseObject(data, Config.class);
        config = configDao.getConfigById(config);
        return ReturnInfoUtil.getSuccessReturnData(config);
	}
	
	@Override
    public String getConfigByNameEn(String data) {
        if (data == null) {
            return ReturnInfoUtil.getFailReturnData("请传递data参数!");
        }
        Config config = JSON.parseObject(data, Config.class);
        config = configDao.getConfigByNameEn(config);
        return ReturnInfoUtil.getSuccessReturnData(config);
    }

	@Override
	public String getConfigsByName(String data) {
        if (data == null) {
            return ReturnInfoUtil.getFailReturnData("请传递有效参数!");
        }
        Config config = JSON.parseObject(data, Config.class);
        List<Config> configList = configDao.getConfigsByName(config);
        return ReturnInfoUtil.getSuccessReturnData(configList);
	}
	
	@Override
    public String getParamType() {
        List<Config> configList = configDao.getParamType();
        String jsonText = JSON.toJSONString(configList, true); 
        return jsonText;
    }
	
	@Override
    public String getDataType() {
        List<Config> configList = configDao.getDataType();
        String jsonText = JSON.toJSONString(configList, true); 
        return jsonText;
    }

	@Override
	public String isConfigNameEnExist(String data) {
        if (data == null) {
            return ReturnInfoUtil.getFailReturnData("请传递data参数!");
        }
        Config config = JSON.parseObject(data, Config.class);
        config = configDao.getConfigByNameEn(config);
        if(config==null){
        	return ReturnInfoUtil.getSuccessReturnData(false);
        }
        return ReturnInfoUtil.getSuccessReturnData(true);
	}

    public ConfigDao getConfigDao() {
        return configDao;
    }

    public void setConfigDao(ConfigDao configDao) {
        this.configDao = configDao;
    }

	@Override
	public String getConfigList(String data, PageInfo pageInfo) throws Exception {
		Config config = new Config();
        if (data != null) {
        	config = JSON.parseObject(data, Config.class);
        }
		List<Config> configList = configDao.getConfigList(pageInfo, config);
		int pageNo = pageInfo.getPageNo();
		int pageSize = pageInfo.getPageSize();
		if(configList != null){//返回的配置列表增加序号
			for (int i = 0; i < configList.size(); i++) {
				configList.get(i).setXh((pageNo-1)*pageSize + i + 1);
			}
		}
        return super.makeEasyUiData(configList, pageInfo.getTotalCount(), null);
	}

}
