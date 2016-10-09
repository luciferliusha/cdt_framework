package com.zjcds.portal.service.icons.impl;

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
import com.zjcds.portal.mybatis.bean.Icons;
import com.zjcds.portal.mybatis.dao.IconsDao;
import com.zjcds.portal.service.icons.IconsService;

public class IconsServiceImpl implements IconsService {

    /** 日志 */
    private static Logger logger = Logger.getLogger(IconsServiceImpl.class);

    /** 应用图标APP */
    private IconsDao iconDao;

    @Override
    public String addIcons(Icons icons, File iconNormal, String normalFileName, 
            File iconSelected, String selectedFileName) throws Exception {
        if (icons == null) {
            return ReturnInfoUtil.getFailReturnData("请传递应用图标app数据!");
        }
        String fileNewName = null;
        String cutDate = DateUtil.currentTime("yyyyMMddHHmmssSSS");
        if (iconNormal != null) {// 有上传文件,正常状态图标
            String fileSuffix = normalFileName.substring(normalFileName.lastIndexOf("."));
            fileNewName = cutDate + Constant.ICONS_NORMAL + fileSuffix;
            String webRootRealPath = ContextHolder.getWebRootRealPath();
            String filePath = webRootRealPath + File.separator + Constant.UPLOAD_DIR + File.separator
                    + Constant.UPLOAD_DIR_ICONS + File.separator + fileNewName;
            FileLoadUtil.uploadFile(iconNormal, filePath);
            icons.setIconNormal(fileNewName);
        }
        if (iconSelected != null) {// 有上传文件,选中图标
            String fileSuffix = selectedFileName.substring(selectedFileName.lastIndexOf("."));
            fileNewName = cutDate + Constant.ICONS_SELECTED + fileSuffix;
            String webRootRealPath = ContextHolder.getWebRootRealPath();
            String filePath = webRootRealPath + File.separator + Constant.UPLOAD_DIR + File.separator
                    + Constant.UPLOAD_DIR_ICONS + File.separator + fileNewName;
            FileLoadUtil.uploadFile(iconSelected, filePath);
            icons.setIconSelected(fileNewName);
        }
        iconDao.addIcons(icons);// 插入到数据库
        logger.info("新增图标:" + icons.getIconId() + "成功!");
        return "<script>parent.iconManageView.addIconCallBack(" + JSON.toJSONString(icons) + ");</script>";
    }

    @Override
    public String deleteIcons(String data) {
        if (data == null || data.isEmpty()) {
            return ReturnInfoUtil.getFailReturnData("请传递data参数!");
        }
        String[] appIds = data.split(",");
        String filePathDir = ContextHolder.getWebRootRealPath() + File.separator + Constant.UPLOAD_DIR + File.separator
                + Constant.UPLOAD_DIR_ICONS;
        String filePath = null;
        Icons icons = null;
        for (String appId : appIds) {
            icons = new Icons();
            icons.setIconId(Integer.valueOf(appId));
            icons = iconDao.getIconById(icons);
            filePath = filePathDir + File.separator + icons.getIconNormal();
            if (FileUtil.deleteFile(filePath)) {// 删除图标图片
                logger.info("删除文件成功!" + filePath);
            }
            else {
                logger.error("删除文件失败!" + filePath);
            }
            filePath = filePathDir + File.separator + icons.getIconSelected();
            if (FileUtil.deleteFile(filePath)) {// 删除图标图片
                logger.info("删除文件成功!" + filePath);
            }
            else {
                logger.error("删除文件失败!" + filePath);
            }
        }
        iconDao.deleteIcons(appIds);
        logger.info("删除图标：" + data + "成功!");
        return ReturnInfoUtil.getSuccessReturnData("删除成功!");
    }

    @Override
    public String updateIcons(Icons icons, File iconNormal, String normalFileName, 
            File iconSelected, String selectedFileName) {
        if (icons == null) {
            return ReturnInfoUtil.getFailReturnData("请传递应用图标app数据!");
        }
        Icons oldIcons = iconDao.getIconById(icons);
        String filePathDir = ContextHolder.getWebRootRealPath() + File.separator + Constant.UPLOAD_DIR
            + File.separator + Constant.UPLOAD_DIR_ICONS;
        String cutDate = DateUtil.currentTime("yyyyMMddHHmmssSSS");
        if (iconNormal != null) {// 有上传文件
            // 先删除旧文件
            String filePath = filePathDir + File.separator + oldIcons.getIconNormal();
            if (FileUtil.deleteFile(filePath)) {// 删除图标图片
                logger.info("删除文件成功!" + filePath);
            }
            else {
                logger.error("删除文件失败!" + filePath);
            }
            
            String fileSuffix = normalFileName.substring(normalFileName.lastIndexOf("."));
            String fileNewName = cutDate + Constant.ICONS_NORMAL + fileSuffix;
            filePath = filePathDir + File.separator + fileNewName;
            FileLoadUtil.uploadFile(iconNormal, filePath);
            icons.setIconNormal(fileNewName);
        }
        if (iconSelected != null) {
            String filePath = filePathDir + File.separator + oldIcons.getIconSelected();
            if (FileUtil.deleteFile(filePath)) {// 删除图标图片
                logger.info("删除文件成功!" + filePath);
            }
            else {
                logger.error("删除文件失败!" + filePath);
            }
            
            String fileSuffix = selectedFileName.substring(selectedFileName.lastIndexOf("."));
            String fileNewName = cutDate + Constant.ICONS_SELECTED + fileSuffix;
            filePath = filePathDir + File.separator + fileNewName;
            FileLoadUtil.uploadFile(iconSelected, filePath);
            icons.setIconSelected(fileNewName);
        }
        iconDao.updateIcons(icons);
        logger.info("更新图标" + icons.getIconId() + "成功!");
        return "<script>parent.iconManageView.updateIconCallBack(" + JSON.toJSONString(icons) + ");</script>";
    }

    @Override
    public String getAllIcons() {
        List<Icons> iconsList = iconDao.getAllIcons();
        return ReturnInfoUtil.getSuccessReturnData(iconsList);
    }

    
    public IconsDao getIconDao() {
        return iconDao;
    }

    
    public void setIconDao(IconsDao iconDao) {
        this.iconDao = iconDao;
    }
}
