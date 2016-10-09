package com.zjcds.portal.config;

/** 
 * 配置管理类
 * @author linj
 * @date 2012-7-9
 *
 */
public class ConfigManager {
	
	private static ConfigManager configManager = null;

	/** 实例化 */
	public static ConfigManager getInstance() {
		if (configManager == null) {
			configManager = new ConfigManager();
		}
		return configManager;
	}

	public ConfigManager () {
		sysConfig = new SysConfig();
	}

	/** 配置信息 */
	private SysConfig sysConfig;

	/**
	 * @return the sysConfig
	 */
	public SysConfig getSysConfig() {
		return sysConfig;
	}

	/**
	 * @param sysConfig the sysConfig to set
	 */
	public void setSysConfig(SysConfig sysConfig) {
		this.sysConfig = sysConfig;
	}
}
