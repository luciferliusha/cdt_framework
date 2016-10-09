/*
 * 文件名称: PicsServiceImpl.java
 * 版权信息: Copyright 2001-2014 ZheJiang Collaboration Data System Co., LTD. All right reserved.
 * ----------------------------------------------------------------------------------------------
 * 修改历史:
 * ----------------------------------------------------------------------------------------------
 * 修改原因: 新增
 * 修改人员: linj
 * 修改日期: 2014-4-3
 * 修改内容: 
 */
package com.zjcds.portal.service.pics.impl;

import java.io.File;
import java.util.List;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.cds.framework.core.ContextHolder;
import com.zjcds.framework.common.util.DateUtil;
import com.zjcds.framework.common.util.FileLoadUtil;
import com.zjcds.framework.common.util.FileUtil;
import com.zjcds.framework.common.util.ReturnInfoUtil;
import com.zjcds.portal.common.constant.Constant;
import com.zjcds.portal.mybatis.bean.Pics;
import com.zjcds.portal.mybatis.dao.PicsDao;
import com.zjcds.portal.service.pics.PicsService;


/**
 * 
 * @author Administrator created on 2014-4-3
 * @since CDS Framework 1.0
 */
public class PicsServiceImpl implements PicsService {
    
    /** 日志 */
    private static Logger logger = Logger.getLogger(PicsServiceImpl.class);

    /** 应用图片APP */
    private PicsDao picDao;

    /**
     * (non-Javadoc)
     * @see com.zjcds.portal.service.pics.PicsService#addPics(com.zjcds.portal.mybatis.bean.Pics, java.io.File, java.lang.String)
     */
    @Override
    public String addPics(Pics pics, File pic, String picFileName) throws Exception {
        if (pics == null) {
            return ReturnInfoUtil.getFailReturnData("请传递应用图片数据!");
        }
        String fileNewName = null;
        String cutDate = DateUtil.currentTime("yyyyMMddHHmmssSSS");
        if (pic != null) {// 有上传文件,正常状态图标
            String fileSuffix = picFileName.substring(picFileName.lastIndexOf("."));
            fileNewName = cutDate + fileSuffix;
            String webRootRealPath = ContextHolder.getWebRootRealPath();
            String filePath = webRootRealPath + File.separator + Constant.UPLOAD_DIR + File.separator
                    + Constant.UPLOAD_DIR_PICS + File.separator + fileNewName;
            FileLoadUtil.uploadFile(pic, filePath);
            pics.setPic(fileNewName);
        }
        picDao.addPics(pics);// 插入到数据库
        logger.info("新增图标:" + pics.getPicId() + "成功!");
        return "<script>parent.picManageView.addPicCallBack(" + JSON.toJSONString(pics) + ");</script>";
    }

    /**
     * (non-Javadoc)
     * @see com.zjcds.portal.service.pics.PicsService#deletePics(java.lang.String)
     */
    @Override
    public String deletePics(String data) {
        if (data == null || data.isEmpty()) {
            return ReturnInfoUtil.getFailReturnData("请传递data参数!");
        }
        String[] appIds = data.split(",");
        String filePathDir = ContextHolder.getWebRootRealPath() + File.separator + Constant.UPLOAD_DIR + File.separator
                + Constant.UPLOAD_DIR_PICS;
        String filePath = null;
        Pics pics = null;
        for (String appId : appIds) {
            pics = new Pics();
            pics.setPicId(Integer.valueOf(appId));
            pics = picDao.getPicById(pics);
            filePath = filePathDir + File.separator + pics.getPic();
            if (FileUtil.deleteFile(filePath)) {// 删除图标图片
                logger.info("删除文件成功!" + filePath);
            }
            else {
                logger.error("删除文件失败!" + filePath);
            }
        }
        picDao.deletePics(appIds);
        logger.info("删除图标：" + data + "成功!");
        return ReturnInfoUtil.getSuccessReturnData("删除成功!");
    }

    /**
     * (non-Javadoc)
     * @see com.zjcds.portal.service.pics.PicsService#updatePics(com.zjcds.portal.mybatis.bean.Pics, java.io.File, java.lang.String)
     */
    @Override
    public String updatePics(Pics pics, File pic, String picFileName) {
        if (pics == null) {
            return ReturnInfoUtil.getFailReturnData("请传递应用图标app数据!");
        }
        Pics oldPics = picDao.getPicById(pics);
        String filePathDir = ContextHolder.getWebRootRealPath() + File.separator + Constant.UPLOAD_DIR
            + File.separator + Constant.UPLOAD_DIR_PICS;
        String cutDate = DateUtil.currentTime("yyyyMMddHHmmssSSS");
        if (pic != null) {// 有上传文件
            // 先删除旧文件
            String filePath = filePathDir + File.separator + oldPics.getPic();
            if (FileUtil.deleteFile(filePath)) {// 删除图标图片
                logger.info("删除文件成功!" + filePath);
            }
            else {
                logger.error("删除文件失败!" + filePath);
            }
            
            String fileSuffix = picFileName.substring(picFileName.lastIndexOf("."));
            String fileNewName = cutDate + fileSuffix;
            filePath = filePathDir + File.separator + fileNewName;
            FileLoadUtil.uploadFile(pic, filePath);
            pics.setPic(fileNewName);
        }
        picDao.updatePics(pics);
        logger.info("更新图标" + pics.getPicId() + "成功!");
        return "<script>parent.picManageView.updatePicCallBack(" + JSON.toJSONString(pics) + ");</script>";
    }

    /**
     * (non-Javadoc)
     * @see com.zjcds.portal.service.pics.PicsService#getAllPics()
     */
    @Override
    public String getAllPics() {
        List<Pics> iconsList = picDao.getAllPics();
        return ReturnInfoUtil.getSuccessReturnData(iconsList);
    }

    
    public PicsDao getPicDao() {
        return picDao;
    }

    
    public void setPicDao(PicsDao picDao) {
        this.picDao = picDao;
    }

}
