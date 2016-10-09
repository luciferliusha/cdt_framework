package com.zjcds.portal.mybatis.bean;

import java.io.Serializable;

/**
 * 解决方案喜好实体类
 * 
 * @author linj 2014-2-24
 * 
 * 
 */
public class PlatformFav implements Serializable {

    /**
	 * 
	 */
    private static final long serialVersionUID = 1L;

    private String userKey; // 用户标识

    private int pfId;// 解决方案ID

    private int kind;// 功能操作类别

    public String getUserKey() {
        return userKey;
    }

    public int getPfId() {
        return pfId;
    }

    public void setUserKey(String userKey) {
        this.userKey = userKey;
    }

    public void setPfId(int pfId) {
        this.pfId = pfId;
    }

    public int getKind() {
        return kind;
    }

    public void setKind(int kind) {
        this.kind = kind;
    }

}
