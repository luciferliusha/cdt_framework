package com.zjcds.portal.mybatis.bean;

import java.io.Serializable;

/**
 * 构件使用情况实体类
 * 
 * @author linj 2013-8-7
 * 
 * 
 */
public class AppHot implements Serializable {

    /**
	 * 
	 */
    private static final long serialVersionUID = 1L;

    private int appId;// 构件ID
    
    private String appName; //构件名称

    private int hotNum;// 使用次数

    public int getAppId() {
        return appId;
    }

    public void setAppId(int appId) {
        this.appId = appId;
    }

    public int getHotNum() {
        return hotNum;
    }

    public void setHotNum(int hotNum) {
        this.hotNum = hotNum;
    }

    
    public String getAppName() {
        return appName;
    }

    
    public void setAppName(String appName) {
        this.appName = appName;
    }
}
