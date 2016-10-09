package com.zjcds.portal.mybatis.bean;

import java.io.Serializable;

/**
 * 解决方案访问日志实体类
 * 
 * @author linj 2014-2-24
 * 
 * 
 */
public class PlatformLog implements Serializable {

    /**
	 * 
	 */
    private static final long serialVersionUID = 1L;

    private String userName; // 用户标识

    private String logTime;// 用户访问时间

    private int pfId;// 解决方案ID

    private String pfName;// 解决方案名称

    /** 查询用字段 */
    private String logTimeStart;// 查询开始时间

    private String logTimeEnd;// 查询开始时间
    
    /** 统计用字段 */
    private Long visitNum;//访问次数

    public int getPfId() {
        return pfId;
    }

    public void setPfId(int pfId) {
        this.pfId = pfId;
    }

    public String getUserName() {
        return userName;
    }

    public String getLogTime() {
        return logTime;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setLogTime(String logTime) {
        this.logTime = logTime;
    }

    public String getPfName() {
        return pfName;
    }

    public String getLogTimeStart() {
        return logTimeStart;
    }

    public String getLogTimeEnd() {
        return logTimeEnd;
    }

    public void setPfName(String pfName) {
        this.pfName = pfName;
    }

    public void setLogTimeStart(String logTimeStart) {
        this.logTimeStart = logTimeStart;
    }

    public void setLogTimeEnd(String logTimeEnd) {
        this.logTimeEnd = logTimeEnd;
    }

    
    public Long getVisitNum() {
        return visitNum;
    }

    
    public void setVisitNum(Long visitNum) {
        this.visitNum = visitNum;
    }
}
