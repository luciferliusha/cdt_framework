package com.zjcds.portal.action.pics;

import java.io.File;

import com.zjcds.portal.action.common.FrameworkBaseAction;
import com.zjcds.portal.mybatis.bean.Pics;
import com.zjcds.portal.service.pics.PicsService;

/**
 * 图片库管理action
 * @author linj
 * 
 */
public class PicsAction extends FrameworkBaseAction {

    private static final long serialVersionUID = 1L;

    private PicsService picService;
    
    private String data;

    private File pic;// 图片图片文件上传用

    private String picFileName;// 文件名

    private Pics pics;// 图片上传更新用的对象，页面中使用pics.XXX

    @Override
    public String doExecute() throws Exception {
        return null;
    }

    /**
     * 新增图片
     * 
     * @param data 图片
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String addPics() throws Exception {
        super.writeJson(picService.addPics(pics, pic, picFileName));
        return null;
    }

    /**
     * 批量删除图片
     * 
     * @param data 图片
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String deletePics() throws Exception {
        super.writeJson(picService.deletePics(data));
        return null;
    }

    /**
     * 更新图片
     * 
     * @param data 图片
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String updatePics() throws Exception {
        super.writeJson(picService.updatePics(pics, pic, picFileName));
        return null;
    }

    /**
     * 获取所有图片
     * 
     * @author linj created on 2013-12-9
     * @since CDS Framework 1.0
     */
    public String getAllPics() throws Exception {
        super.writeJson(picService.getAllPics());
        return null;
    }

    
    public PicsService getPicService() {
        return picService;
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

    
    public Pics getPics() {
        return pics;
    }

    
    public void setPicService(PicsService picService) {
        this.picService = picService;
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

    
    public void setPics(Pics pics) {
        this.pics = pics;
    }

}
