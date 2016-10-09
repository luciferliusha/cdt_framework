package com.zjcds.portal.mybatis.bean;

/**
 * 模板库实体类
 * 
 * @author linj created on 2014-2-10
 * @since CDS Framework 3.0
 */
public class Template {

    private int id; // 模板ID

    private String name; // 模板名称

    private String context; // 模板内容

    private String memo; // 模板简介

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getContext() {
        return context;
    }

    public String getMemo() {
        return memo;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

}
