package com.zjcds.portal.service.app.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.cds.framework.dao.paging.PageInfo;
import com.zjcds.framework.common.util.JsonUtil;
import com.zjcds.portal.common.constant.Constant;
import com.zjcds.portal.mybatis.bean.App;
import com.zjcds.portal.mybatis.bean.AppHot;
import com.zjcds.portal.mybatis.dao.AppDao;
import com.zjcds.portal.service.CDTBaseService;
import com.zjcds.portal.service.app.AppService;

/**
 * 构件实现类
 * 
 * @author yuzq 2013-2-26
 * 
 */
public class AppServiceImpl extends CDTBaseService implements AppService {

    /** 构件接口 */
    private AppDao appDao;

    /** 日志 */
    private static Logger logger = Logger.getLogger(AppServiceImpl.class);

    /**
     * @see com.zjcds.portal.service.app.AppService #addAppFile(String)
     */
    @Override
    public String addAppFile(String file) throws Exception {
        if (file != null && !"".equals(file.trim())) {
            App app = JSONObject.parseObject(file, App.class);
            setDefaultVisible(app);
            appDao.addAppFile(app);
            returnData = super.getSuccessReturnData(app.getAppId());
            logger.info("新增" + app.getAppId() + "成功!");
        }
        else {
            returnData = super.getFailReturnData("构件信息不能为空!");
        }
        return returnData;
    }

    /** 当构件是否显示Visible为空时,设置默认值 */
    private void setDefaultVisible(App app) throws Exception {
        if (app.getVisible() == null) {
            app.setVisible(Constant.VISIBLE_DEFAULT);
        }
    }

    /**
     * 删除构件
     * 
     * @see com.zjcds.portal.service.app.AppService #deleteAppFile(String)
     */
    @Override
    public String deleteAppFile(Integer appId) throws Exception {
        if (appId != null) {
            appDao.deleteAppFile(appId);
            logger.info("删除构件" + appId + "成功!");
            returnData = super.getSuccessReturnData(appId);
        }
        else {
            returnData = super.getFailReturnData("构件ID不能为空!");
        }
        return returnData;
    }

    /**
     * 修改构件
     * 
     * @see com.zjcds.portal.service.app.AppService #updateAppFile(String)
     */
    @Override
    public String updateAppFile(String file) throws Exception {
        if (file != null && !"".equals(file.trim())) {
            App app = JSONObject.parseObject(file, App.class);
            appDao.updateAppFile(app);
            logger.info("修改的构件ID为:" + app.getAppId() + "!");
            returnData = super.getSuccessReturnData(JsonUtil.getJSONString(app));
        }
        else {
            returnData = super.getFailReturnData("构件信息不能为空!");
        }
        return returnData;
    }

    /**
     * 删除构件目录 递归删除该目录下的构件和子目录
     * 
     * @see com.zjcds.portal.service.app.AppService #deleteAppDir(String)
     */
    @Override
    public String deleteAppDir(Integer appId) throws Exception {
        if (appId != null) {
            recursionDeleteApp(appId);
            returnData = super.getSuccessReturnData(appId);
        }
        else {
            returnData = super.getFailReturnData("构件或目录ID不能为空!");
        }
        return returnData;
    }

    /** 递归删除 */
    private void recursionDeleteApp(int appId) throws Exception {
        appDao.deleteAppFile(appId);
        appDao.deleteAppHot(appId);
        logger.info("被删除的构件或目录ID为:" + appId);
        List<App> appList = appDao.getSubAppFile(appId);
        for (App app : appList) {
            recursionDeleteApp(app.getAppId());
        }
    }

    /**
     * 根据构件目录ID取得该目录下的构件和子目录
     * 
     * @see com.zjcds.portal.service.app.AppService #getSubAppInfo(String)
     */
    @Override
    public String getSubAppInfo(Integer appId) throws Exception {
        List<App> appList = appDao.getSubAppInfo(appId);
        setSubNumber(appList);
        returnData = super.getSuccessReturnData(JsonUtil.getJSONString(appList));
        return returnData;
    }

    /** 设置下一级构件数量 */
    private void setSubNumber(List<App> appList) throws Exception {
        for (App app : appList) {
            app.setSubNumber(appDao.getSubAppInfoCount(app.getAppId()));
        }
    }

    /**
     * @see com.zjcds.portal.service.app.AppService #getAppTree()
     */
    @Override
    public String getAppTree(Integer appId) throws Exception {
        if (appId != null) {
            List<App> appList = appDao.getSubAppInfo(appId);
            List<Map<String, Object>> appTreeData = getCapsulationList(appList);
            returnData = super.getSuccessReturnData(JsonUtil.getJSONString(appTreeData));
        }
        else {
            returnData = super.getFailReturnData("构件ID不能为空!");
        }
        return returnData;
    }

    /** 组装数据用于显示树结构 */
    private List<Map<String, Object>> getCapsulationList(List<App> appList) throws Exception {
        List<Map<String, Object>> appTreeData = new ArrayList<Map<String, Object>>();
        Map<String, Object> appMap = null;
        for (App app : appList) {
            appMap = getCapsulationMap(app);
            appTreeData.add(appMap);
        }
        return appTreeData;
    }

    /** 将每个构件组装成Map类型 */
    private Map<String, Object> getCapsulationMap(App app) throws Exception {
        Map<String, Object> appMap = new HashMap<String, Object>();
        appMap.put("id", app.getAppId());
        appMap.put("text", app.getAppName());
        appMap.put("state", app.getState());
        setShowIcon(app, appMap);
        appMap.put("attributes", app);
        return appMap;
    }

    /** 设置显示图标 */
    private void setShowIcon(App app, Map<String, Object> appMap) throws Exception {
        if (app.getType() == Constant.DIR_IDENTIFICATION) {
            appMap.put(Constant.ICON, Constant.DIR_PIC);
        }
        else if (app.getType() == Constant.FILE_IDENTIFICATION) {
            appMap.put(Constant.ICON, Constant.FILE_PIC);
        }
    }

    /**
     * @see com.zjcds.portal.service.app.AppService#getAppInfo(int)
     */
    @Override
    public String getAppInfo(Integer appId) throws Exception {
        if (appId != null) {
            App app = appDao.getAppInfo(appId);
            returnData = super.getSuccessReturnData(JsonUtil.getJSONString(app));
        }
        else {
            returnData = super.getFailReturnData("构件ID不能为空!");
        }
        return returnData;
    }

    @Override
    public String addAppUsedLog(String data) throws Exception {
        String ret = null;
        if (data != null && !data.isEmpty()) {
            AppHot appHot = JSONObject.parseObject(data, AppHot.class);
            AppHot exitAppHot = appDao.getAppHotByAppId(appHot);
            if (exitAppHot == null) {//不存在，则新增
                appHot.setHotNum(1);
                appDao.addAppHot(appHot);
            }
            else {
                appDao.addUpAppHot(appHot);//累加更新
            }
            logger.info("构件使用记录日志成功!");
            ret = super.getSuccessReturnData("记录成功!");
        }
        else {
            ret = super.getFailReturnData("构件信息不能为空!");
        }
        return ret;
    }
    
    @Override
    public String getAppUsedLogList(PageInfo pageInfo) throws Exception {
        List<AppHot> appHotList = appDao.getAppHotList(pageInfo);
        return super.makeEasyUiData(appHotList, pageInfo.getTotalCount(), null);
    }

    @Override
    public String getAppUsedLogPie(String pieData) throws Exception {
        if (pieData != null && !pieData.isEmpty()) {
            List<AppHot> appHotList = appDao.getAppHotList();
            com.alibaba.fastjson.JSONObject pieJsonData = JSON.parseObject(pieData);
            com.alibaba.fastjson.JSONArray seriesValue = pieJsonData.getJSONArray(Constant.SERIES);
            for (int j = 0; j < appHotList.size(); j++) {//获取数据设置到highcharts的json对象中
                for (int i = 0; i < seriesValue.size(); i++) {// 遍历放入记录
                    com.alibaba.fastjson.JSONArray itemData = seriesValue.getJSONObject(i).getJSONArray(Constant.DATA);// 获取存放数据的对象
                    com.alibaba.fastjson.JSONArray item = new com.alibaba.fastjson.JSONArray();
                    item.add(appHotList.get(j).getAppName());
                    item.add(appHotList.get(j).getHotNum());
                    itemData.add(item);
                }
            }
            return super.getSuccessReturnData(pieJsonData);
        }
        else {
            return super.getFailReturnData("file参数不能为空!");
        }
    }
    
    public AppDao getAppDao() {
        return appDao;
    }

    public void setAppDao(AppDao appDao) {
        this.appDao = appDao;
    }

}
