/*
 * 文件名称: SettingServiceImpl.java
 * 版权信息: Copyright 2001-2014 ZheJiang Collaboration Data System Co., LTD. All right reserved.
 * ----------------------------------------------------------------------------------------------
 * 修改历史:
 * ----------------------------------------------------------------------------------------------
 * 修改原因: 新增
 * 修改人员: linj
 * 修改日期: 2014-4-3
 * 修改内容: 
 */
package com.zjcds.portal.service.setting.impl;

import java.io.File;
import java.io.FileOutputStream;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.cds.framework.core.ContextHolder;
import com.zjcds.framework.common.config.ClassPathHelper;
import com.zjcds.framework.common.util.DateUtil;
import com.zjcds.framework.common.util.FileLoadUtil;
import com.zjcds.framework.common.util.ReturnInfoUtil;
import com.zjcds.portal.common.constant.Constant;
import com.zjcds.portal.config.ConfigManager;
import com.zjcds.portal.config.SysConfig;
import com.zjcds.portal.mybatis.bean.Setting;
import com.zjcds.portal.service.setting.SettingService;

/**
 * 
 * @author Administrator created on 2014-4-3
 * @since CDS Framework 1.0
 */
public class SettingServiceImpl implements SettingService {

	/** 日志 */
	private static Logger logger = Logger.getLogger(SettingServiceImpl.class);

	@Override
	public String updateInfo(String data) throws Exception {
		if (data != null && !data.isEmpty()) {
			Setting setting = JSON.parseObject(data, Setting.class);
			SysConfig sysConfig = ConfigManager.getInstance().getSysConfig();
			//每个更新请只传递该对应的参数
			if (setting.getSystemName() != null) {//修改系统名称
				logger.info("修改系统名称!");
				sysConfig.setConfigValue("config.systemName", setting.getSystemName());
			}
			else if (setting.getSystemNameFontSize() != null) {//修改系统名称字体
				logger.info("修改系统名称字体!");
				sysConfig.setConfigValue("config.systemNameFontSize", setting.getSystemNameFontSize());
			}
			else if (setting.getTopWidth() != null && setting.getTopHeight() != null) {//修改LOGO宽高
				logger.info("修改LOGO宽高!");
				sysConfig.setConfigValue("config.topWidth", setting.getTopWidth());
				sysConfig.setConfigValue("config.topHeight", setting.getTopHeight());
			}
			else if (setting.getTopMarginTop() != null && setting.getTopMarginLeft() != null) {//修改LOGO边距
				logger.info("修改LOGO边距!");
				sysConfig.setConfigValue("config.topMarginTop", setting.getTopMarginTop());
				sysConfig.setConfigValue("config.topMarginLeft", setting.getTopMarginLeft());
			}
			else if (setting.getRightName() != null) {//版权信息
				logger.info("修改版权信息!");
				sysConfig.setConfigValue("config.rightName", setting.getRightName());
			}
			else if (setting.getTechniqueName() != null) {//技术支持
				logger.info("修改技术支持!");
				sysConfig.setConfigValue("config.techniqueName", setting.getTechniqueName());
			}
			else if(setting.getFrontPage() != null){//是否显示首页
				logger.info("修改是否显示首页!");
				sysConfig.setConfigValue("config.frontPage", setting.getFrontPage().toString());
			}
			else if(setting.getFrontPageAccess() != null){//首页访问方式
				logger.info("修改首页访问方式!");
				sysConfig.setConfigValue("config.frontPageAccess", setting.getFrontPageAccess().toString());
			}
			else if(setting.getStyleName() != null){//整体样式风格名称
				logger.info("修改整体样式风格名称!");
				sysConfig.setConfigValue("config.styleName", setting.getStyleName());
			}
			String webRootRealPath = ClassPathHelper.getClassPath();
			FileOutputStream outFile = new FileOutputStream(webRootRealPath + "config.properties", false);//true表示追加打开
			sysConfig.storeConfig(outFile, "系统相关配置，请不要手动修改，通过系统管理的系统配置管理进行配置");
			outFile.close();
			return ReturnInfoUtil.getSuccessReturnData("更新成功!");
		}
		else {
			return ReturnInfoUtil.getFailReturnData("请传递data数据!");
		}
	}

	@Override
	public String updateLogo(File pic, String picFileName) throws Exception {
		String filePathDir = "";
		if (pic != null) {// 有上传文件
			String cutDate = DateUtil.currentTime("yyyyMMddHHmmssSSS");
			String fileSuffix = picFileName.substring(picFileName.lastIndexOf("."));
			String fileNewName = cutDate + fileSuffix;
			filePathDir = "/" + Constant.UPLOAD_DIR + "/" + Constant.UPLOAD_DIR_LOGO + "/" + fileNewName;
			String filePath = ContextHolder.getWebRootRealPath() + filePathDir;
			FileLoadUtil.uploadFile(pic, filePath);
			SysConfig sysConfig = ConfigManager.getInstance().getSysConfig();
			sysConfig.setConfigValue("config.logoURL", filePathDir);
			FileOutputStream outFile = new FileOutputStream(ClassPathHelper.getClassPath() + "config.properties", false);//true表示追加打开
			sysConfig.storeConfig(outFile, "系统相关配置，请不要手动修改，通过系统管理的系统配置管理进行配置");
			outFile.close();
			logger.info("更新LOGO成功" + filePath + "!");
		}
		return "<script>parent.settingView.updateLogoCallBack('" + filePathDir + "');</script>";
	}

}
