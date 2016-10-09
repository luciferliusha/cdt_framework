package com.zjcds.portal.mybatis.bean;

/**
 * 配置类
 * @author xinyf
 *
 */
public class Config {
	/**
	 * 序号
	 */
	private Integer xh; 
	/**
	 * 主键
	 */
	private Integer id;
	
	/**
	 * 英文名称
	 */
	private String nameCn;
	
	/**
	 * 英文名称
	 */
	private String nameEn;
	
	/**
	 * 参数类型名称
	 */
	private String paramType;
	
	/**
	 * 参数类型ID
	 */
	private Integer paramTypeId;
	
	/**
	 * 参数值
	 */
	private Integer paramValue;
	
	/**
	 * 数据类型名称
	 */
	private String dataType;
	
	/**
	 * 数据类型ID
	 */
	private Integer dataTypeId;
	
	/**
	 * 启用标识
	 */
	private Integer enabledFlag;
	
	/**
	 * 启用标识名称
	 */
	private String enabledFlagName;
	
	/**
	 * 描述
	 */
	private String describe;
	
	public Integer getXh() {
		return xh;
	}

	public void setXh(Integer xh) {
		this.xh = xh;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNameCn() {
		return nameCn;
	}

	public void setNameCn(String nameCn) {
		this.nameCn = nameCn;
	}

	public String getNameEn() {
		return nameEn;
	}

	public void setNameEn(String nameEn) {
		this.nameEn = nameEn;
	}

	public String getParamType() {
		return paramType;
	}

	public void setParamType(String paramType) {
		this.paramType = paramType;
	}

	public Integer getParamTypeId() {
		return paramTypeId;
	}

	public void setParamTypeId(Integer paramTypeId) {
		this.paramTypeId = paramTypeId;
	}

	public Integer getParamValue() {
		return paramValue;
	}

	public void setParamValue(Integer paramValue) {
		this.paramValue = paramValue;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public Integer getDataTypeId() {
		return dataTypeId;
	}

	public void setDataTypeId(Integer dataTypeId) {
		this.dataTypeId = dataTypeId;
	}

	public Integer getEnabledFlag() {
		return enabledFlag;
	}

	public void setEnabledFlag(Integer enabledFlag) {
		this.enabledFlag = enabledFlag;
		//转换标识为名称
		if(enabledFlag!=null){
			if(enabledFlag.equals(1)){
				this.setEnabledFlagName("启用");
			}else if(enabledFlag.equals(0)){
				this.setEnabledFlagName("禁用");
			}
		}
	}

	public String getDescribe() {
		return describe;
	}

	public void setDescribe(String describe) {
		this.describe = describe;
	}

	public void setEnabledFlagName(String enabledFlagName) {
		this.enabledFlagName = enabledFlagName;
	}

	public String getEnabledFlagName() {
		return enabledFlagName;
	}
	
	
}
