package com.zjcds.portal.action.setting;

import java.io.File;

import com.zjcds.portal.action.common.FrameworkBaseAction;
import com.zjcds.portal.service.setting.SettingService;

/**
 * 系统配置管理action
 * 
 * @author linj
 * 
 */
public class SettingAction extends FrameworkBaseAction {

	private static final long serialVersionUID = 1L;

	private String data;

	private File pic;// 图片文件上传用

	private String picFileName;// 文件名

	private SettingService settingService;//系统配置Service

	@Override
	public String doExecute() throws Exception {
		return null;
	}

	/**
	 * 更新系统配置
	 * @return
	 * @throws Exception
	 */
	public String updateInfo() throws Exception {
		super.writeJson(settingService.updateInfo(data));
		return null;
	}

	/**
	 * 更新LOGO
	 * 
	 * @param data
	 *            图片
	 * @author linj created on 2013-12-9
	 * @since CDS Framework 1.0
	 */
	public String updateLogo() throws Exception {
		super.writeJson(settingService.updateLogo(pic, picFileName));
		return null;
	}

	public String getData() {
		return data;
	}

	public File getPic() {
		return pic;
	}

	public String getPicFileName() {
		return picFileName;
	}

	public void setData(String data) {
		this.data = data;
	}

	public void setPic(File pic) {
		this.pic = pic;
	}

	public void setPicFileName(String picFileName) {
		this.picFileName = picFileName;
	}

	public SettingService getSettingService() {
		return settingService;
	}

	public void setSettingService(SettingService settingService) {
		this.settingService = settingService;
	}
}
