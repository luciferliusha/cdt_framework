package com.zjcds.portal.config;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;

import com.zjcds.framework.common.config.ClassPathHelper;
import com.zjcds.framework.common.config.ConfigParseHelper;
import com.zjcds.framework.common.constant.Constants;
import com.zjcds.framework.common.util.FileUtil;
import com.zjcds.framework.common.util.LicenceUtil;
import com.zjcds.framework.view.bean.CdsLicence;
import com.zjcds.portal.common.constant.Constant;

/**
 * 配置信息解析类
 * 
 * @author linj
 * @date 2012-07-09
 */
public class ConfigureHolder extends PropertyPlaceholderConfigurer {

    private Log logger = LogFactory.getLog(ConfigureHolder.class);

    private String platformAsResource;

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        logger.info("ConfigureHolder starting...");
        this.readConfigInfo();
        super.postProcessBeanFactory(beanFactory);
        logger.info("ConfigureHolder end.");
    }

    /**
     * 读取配置信息
     * 
     * @author linj created on 2013-3-1
     * @since CDT Framework 1.0
     */
    private void readConfigInfo() {
        logger.info("读取licence!");
        String webRootRealPath = ClassPathHelper.getClassPath();
        String fileUrl = webRootRealPath + "licence.lrc";
        try {
            String lrcStr = FileUtil.readFileToString(fileUrl, "");
            CdsLicence cdsLrc = LicenceUtil.readLicence(lrcStr,Constants.LICENCE_KEY);
            ConfigManager.getInstance().getSysConfig().setCdsLicence(cdsLrc);
            if(!LicenceUtil.compareLicence(cdsLrc)){
                logger.info("licence已过期，请联系管理员!");
            }
        }
        catch (Exception e) {
            logger.info("读取licence失败!");
            e.printStackTrace();
        }
        logger.info("开始加载系统配置!");
        Map<String, String> mapper = ConfigParseHelper.getConfigs("config.xml", "/configs/mapper", "key", "value");// 读取配置
        String omServer = mapper.get("omServer");
        String styleName = mapper.get("styleName");
        if (omServer == null || omServer.isEmpty()) {
            logger.error("系统配置未加载完成：OM地址未配置!");
        }
        if (styleName == null || styleName.isEmpty()) {
            logger.info("样式名未配置,将设置为默认配置!");
            styleName = Constant.STYLE_DEFAULT;
        }
        ConfigManager.getInstance().getSysConfig().setOmServer(omServer);
        ConfigManager.getInstance().getSysConfig().setStyleName(styleName);
        ConfigManager.getInstance().getSysConfig().setPlatformAsResource(platformAsResource);

        // 系统资源信息
        Map<String, String> resources = ConfigParseHelper.getConfigs("resourceConfig.xml", "/configs/mapper", "key", "value");// 读取配置resources
        ConfigManager.getInstance().getSysConfig().setResources(resources);
        // OM接口信息
        Map<String, String> omInterface = ConfigParseHelper.getConfigs("omConfig.xml", "/configs/mapper", "key", "value");// 读取配置
        ConfigManager.getInstance().getSysConfig().setOmInterface(omInterface);
        // 系统配置：如系统名称、logo的配置
        ConfigManager.getInstance().getSysConfig().setSystemPro(new Properties());
        try {
        	InputStream inStream = new FileInputStream(webRootRealPath + "config.properties");
        	ConfigManager.getInstance().getSysConfig().getSystemPro().load(inStream);
        	inStream.close();
        }
        catch (Exception e) {
            logger.error("加载系统配置config.properties失败!" + e.getMessage());
            e.printStackTrace();
        }
        // 外部JS的URL配置
        List<String> jsUrls = ConfigParseHelper.getConfigs("jsConfig.xml", "/configs/mapper", "value");
        ConfigManager.getInstance().getSysConfig().setJsUrlList(jsUrls);
        logger.info("系统配置加载完成!");
    }

    public String getPlatformAsResource() {
        return platformAsResource;
    }

    public void setPlatformAsResource(String platformAsResource) {
        this.platformAsResource = platformAsResource;
    }

}
