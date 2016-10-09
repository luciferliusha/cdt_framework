package com.zjcds.portal.mybatis.bean;

import java.io.Serializable;

/**
 * 平台热度类
 * 
 * @author liux 2013-8-7
 * 
 * 
 */
public class PlatformHot implements Serializable {

    /**
	 * 
	 */
    private static final long serialVersionUID = 1L;

    private int pfId;

    private int hotNum;

    public int getPfId() {
        return pfId;
    }

    public void setPfId(int pfId) {
        this.pfId = pfId;
    }

    public int getHotNum() {
        return hotNum;
    }

    public void setHotNum(int hotNum) {
        this.hotNum = hotNum;
    }
}
