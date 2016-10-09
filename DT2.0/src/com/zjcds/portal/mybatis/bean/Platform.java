package com.zjcds.portal.mybatis.bean;

import java.util.Date;

/**
 * 平台实体类
 * 
 * @author yuzq date 2013-01-31
 * 
 * 
 */
public class Platform {

	private int pfId; // 平台ID

	private String pfName; // 平台名称

	private String userId; // 用户标识

	private String dirId; // 平台目录ID

	private String keyWord; // 关键字

	private String fileName; // 文件名

	private Integer visible; // 是否限制在前端

	private Integer orderBy; // 排序

	private String picName; // 缩略图地址

	private String url; // 外部平台地址

	private String createUser; // 创建用户

	private Date createTime; // 创建时间

	private String updateUser; // 更新用户

	private Date updateTime; // 更新时间

	private Integer parentId; // 解决方案目录

	private Integer type; // 类型 0 目录 1 解决方案

	private String describe; // 存放数据

	private Integer subNumber; // 下一级目录和解决方案总数目

	public int getPfId() {
		return pfId;
	}

	public void setPfId(int pfId) {
		this.pfId = pfId;
	}

	public String getPfName() {
		return pfName;
	}

	public void setPfName(String pfName) {
		this.pfName = pfName;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getDirId() {
		return dirId;
	}

	public void setDirId(String dirId) {
		this.dirId = dirId;
	}

	public String getKeyWord() {
		return keyWord;
	}

	public void setKeyWord(String keyWord) {
		this.keyWord = keyWord;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public Integer getVisible() {
		return visible;
	}

	public void setVisible(Integer visible) {
		this.visible = visible;
	}

	public Integer getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(Integer orderBy) {
		this.orderBy = orderBy;
	}

	public String getPicName() {
		return picName;
	}

	public void setPicName(String picName) {
		this.picName = picName;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public String getDescribe() {
		return describe;
	}

	public void setDescribe(String describe) {
		this.describe = describe;
	}

	public Integer getSubNumber() {
		return subNumber;
	}

	public void setSubNumber(Integer subNumber) {
		this.subNumber = subNumber;
	}

}
