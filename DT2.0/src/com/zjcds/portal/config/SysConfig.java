package com.zjcds.portal.config;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.zjcds.framework.view.bean.CdsLicence;

/**
 * 系统配置信息
 * 
 * @author linj
 * @date 2012-07-09
 * 
 */
public class SysConfig {

    /** 整体样式风格名称 */
    private String styleName;

    /** OM地址 */
    private String omServer;

    /** OM接口信息 */
    private Map<String, String> omInterface;

    /** 资源信息 */
    private Map<String, String> resources;

    /** 把解决方案作为资源 */
    private String platformAsResource;
    
    /** 系统名、logo之类的配置 */
    private Properties systemPro;

    /** 外部JS的URL信息 */
    private List<String> jsUrlList;
    
    /** LICENCE */
    private CdsLicence cdsLicence;

    /**
     * @return the styleName
     */
    public String getStyleName() {
        return styleName;
    }

    /**
     * @param styleName the styleName to set
     */
    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public String getOmServer() {
        return omServer;
    }

    public void setOmServer(String omServer) {
        this.omServer = omServer;
    }

    public Map<String, String> getOmInterface() {
        return omInterface;
    }

    public void setOmInterface(Map<String, String> omInterface) {
        this.omInterface = omInterface;
    }

    public Map<String, String> getResources() {
        return resources;
    }

    public void setResources(Map<String, String> resources) {
        this.resources = resources;
    }

    public String getPlatformAsResource() {
        return platformAsResource;
    }

    public void setPlatformAsResource(String platformAsResource) {
        this.platformAsResource = platformAsResource;
    }

    
    public List<String> getJsUrlList() {
        return jsUrlList;
    }

    
    public void setJsUrlList(List<String> jsUrlList) {
        this.jsUrlList = jsUrlList;
    }

    
    public CdsLicence getCdsLicence() {
        return cdsLicence;
    }

    
    public void setCdsLicence(CdsLicence cdsLicence) {
        this.cdsLicence = cdsLicence;
    }

	public Properties getSystemPro() {
		return systemPro;
	}

	public void setSystemPro(Properties systemPro) {
		this.systemPro = systemPro;
	}

	/**
	 * 根据key获取property的值
	 * @param key
	 * @return
	 * @author linj created on 2013-11-27 
	 * @since CDS Framework 1.0
	 */
	public String getConfigValue(String key) {
	    if (systemPro != null) {
	        return systemPro.getProperty(key);
	    }
	    else {
	        return null;
	    }
	}
	
	/**
	 * 设置key的property的值
	 * @param key
	 * @return
	 * @author linj created on 2013-11-27 
	 * @since CDS Framework 1.0
	 */
	public void setConfigValue(String key, String value) {
	    if (systemPro != null) {
	        systemPro.setProperty(key, value);
	    }
	}
	
	/**
	 * 保存property内容到文件中
	 * @param key
	 * @return
	 * @author linj created on 2013-11-27 
	 * @throws IOException 
	 * @since CDS Framework 1.0
	 */
	public void storeConfig(FileOutputStream out, String comments) throws IOException {
	    if (systemPro != null) {
	        systemPro.store(out, comments);
	    }
	}
}
