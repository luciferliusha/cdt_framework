package com.zjcds.portal.mybatis.bean;

/**
 * 图片库实体类
 * 
 * @author linj created on 2014-2-10
 * @since CDS Framework 3.0
 */
public class Pics {

    private int picId; // 图片ID

    private String picName; // 图片名称

    private String pic; // 图片文件名

    public int getPicId() {
        return picId;
    }

    public String getPicName() {
        return picName;
    }

    public String getPic() {
        return pic;
    }

    public void setPicId(int picId) {
        this.picId = picId;
    }

    public void setPicName(String picName) {
        this.picName = picName;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }
}
