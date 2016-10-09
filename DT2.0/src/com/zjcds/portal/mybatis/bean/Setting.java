package com.zjcds.portal.mybatis.bean;

/**
 * 图片库实体类
 * 
 * @author linj created on 2014-2-10
 * @since CDS Framework 3.0
 */
public class Setting {

	private String systemName; // 系统名称

	private String systemNameFontSize; // 系统名称字体

	private String logoURL; // 系统LOGO图片

	private String topWidth; // 图片宽度

	private String topHeight; // 图片高度

	private String topMarginTop; // 上边距

	private String topMarginLeft; // 左边距

	private String rightName; // 版权信息

	private String techniqueName;// 技术支持
	
	private Boolean frontPage;//是否显示首页，默认为true显示首页，false为没有首页功能
	
	private Integer frontPageAccess;//定义首页九宫格访问方式，0为展示所有解决方案，1为展示第一层解决方案组和解决方案

	private String styleName;//整体样式风格名称
	
	public String getSystemName() {
		return systemName;
	}

	public String getSystemNameFontSize() {
		return systemNameFontSize;
	}

	public String getLogoURL() {
		return logoURL;
	}

	public String getTopWidth() {
		return topWidth;
	}

	public String getTopHeight() {
		return topHeight;
	}

	public String getTopMarginTop() {
		return topMarginTop;
	}

	public String getTopMarginLeft() {
		return topMarginLeft;
	}

	public String getRightName() {
		return rightName;
	}

	public String getTechniqueName() {
		return techniqueName;
	}

	public void setSystemName(String systemName) {
		this.systemName = systemName;
	}

	public void setSystemNameFontSize(String systemNameFontSize) {
		this.systemNameFontSize = systemNameFontSize;
	}

	public void setLogoURL(String logoURL) {
		this.logoURL = logoURL;
	}

	public void setTopWidth(String topWidth) {
		this.topWidth = topWidth;
	}

	public void setTopHeight(String topHeight) {
		this.topHeight = topHeight;
	}

	public void setTopMarginTop(String topMarginTop) {
		this.topMarginTop = topMarginTop;
	}

	public void setTopMarginLeft(String topMarginLeft) {
		this.topMarginLeft = topMarginLeft;
	}

	public void setRightName(String rightName) {
		this.rightName = rightName;
	}

	public void setTechniqueName(String techniqueName) {
		this.techniqueName = techniqueName;
	}

	public Boolean getFrontPage() {
		return frontPage;
	}

	public void setFrontPage(Boolean frontPage) {
		this.frontPage = frontPage;
	}

	public Integer getFrontPageAccess() {
		return frontPageAccess;
	}

	public void setFrontPageAccess(Integer frontPageAccess) {
		this.frontPageAccess = frontPageAccess;
	}

	public String getStyleName() {
		return styleName;
	}

	public void setStyleName(String styleName) {
		this.styleName = styleName;
	}
}
