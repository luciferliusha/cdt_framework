package com.zjcds.portal.service.platform.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.cds.framework.dao.paging.PageInfo;
import com.zjcds.framework.common.constant.Constants;
import com.zjcds.framework.common.httpconnect.ConnectInfo;
import com.zjcds.framework.common.httpconnect.HttpTools;
import com.zjcds.framework.common.util.DateUtil;
import com.zjcds.framework.common.util.JsonUtil;
import com.zjcds.framework.view.bean.Permission;
import com.zjcds.framework.view.bean.UserPermission;
import com.zjcds.portal.common.constant.Constant;
import com.zjcds.portal.config.ConfigManager;
import com.zjcds.portal.mybatis.bean.Platform;
import com.zjcds.portal.mybatis.bean.PlatformFav;
import com.zjcds.portal.mybatis.bean.PlatformHot;
import com.zjcds.portal.mybatis.bean.PlatformLog;
import com.zjcds.portal.mybatis.bean.TreeBean;
import com.zjcds.portal.mybatis.dao.PlatformDao;
import com.zjcds.portal.service.CDTBaseService;
import com.zjcds.portal.service.platform.PlatformService;

/**
 * 操作平台的实现类,被Action层调用
 * 
 * @author yuzq 2013-01-31
 */
public class PlatformServiceImpl extends CDTBaseService implements PlatformService {

    /** 日志 */
    private static Logger logger = Logger.getLogger(PlatformServiceImpl.class);

    /** 平台接口 */
    private PlatformDao platformDao;

    /**
     * 增加平台 2013-2-25
     * 
     * @throws Exception
     * 
     * @see com.zjcds.portal.service.platform.PlatformService #addPlatformDir(String)
     */
    @Override
    public String addPlatFormFile(String file, String describe, String userId) throws Exception {
        if (file != null && !"".equals(file)) {
            returnData = addOperate(file, describe, userId);
        }
        else {
            returnData = super.getFailReturnData("解决方案信息不能为空!");
        }
        return returnData;
    }

    /** 增加操作 */
    private String addOperate(String file, String describe, String userId) throws Exception {
        Platform platform = (Platform) JsonUtil.getDTO(file, Platform.class);
        paddingPlatformInfo(platform, userId);
        if(describe!=null){platform.setDescribe(describe);}
        int maxOrderBy = platformDao.getMaxOrderBy(platform);
        platform.setOrderBy(maxOrderBy);
        platformDao.addPlatFormFile(platform);
        logger.info("新增解决方案:" + platform.getPfName() + "!");
        Map<String, Object> retMap =  new HashMap<String, Object>();
        retMap.put("pfId", platform.getPfId());
        retMap.put("orderBy", platform.getOrderBy());
        returnData = super.getSuccessReturnData(JSON.toJSONString(retMap));
        return returnData;
    }

    /** 填充解决方案信息 */
    private void paddingPlatformInfo(Platform platform, String userId) throws Exception {
        setDefaultVisibleForPlatform(platform);
        setUserInfoForPlatform(platform, userId);
    }

    /** 当解决方案是否显示Visible为空时,设置默认值 */
    private void setDefaultVisibleForPlatform(Platform platform) throws Exception {
        if (platform.getVisible() == null)
            platform.setVisible(Constant.VISIBLE_DEFAULT);
    }

    /** 为解决方案设置用户信息 */
    private void setUserInfoForPlatform(Platform platform, String userId) throws Exception {
        platform.setCreateUser(userId);
        platform.setUpdateUser(userId);
    }

    /**
     * 删除平台 2013-2-25
     * 
     * @see com.zjcds.portal.service.platform.PlatformService #deletePlatform(String)
     */
    @Override
    public String deletePlatForm(Integer pfId) throws Exception {
        if (pfId != null) {
            returnData = deleteOperate(pfId);
        }
        else {
            returnData = super.getFailReturnData("解决方案ID不能为空!");
        }
        return returnData;
    }

    /** 删除操作 */
    private String deleteOperate(Integer pfId) throws Exception {
        platformDao.deletePlatFormFile(pfId);
        platformDao.deleteSharedPlatForm(pfId);
        logger.info("删除的解决方案ID为:" + pfId);
        returnData = super.getSuccessReturnData(pfId);
        return returnData;
    }

    /**
     * 更新平台 2013-2-25
     * 
     * @see com.zjcds.portal.service.platform.PlatformService #updatePlatformFile(String)
     */
    @Override
    public String updatePlatFormFile(String file, String describe) throws Exception {
        if (file != null && !"".equals(file)) {
            returnData = updateOperate(file,describe);
        }
        else {
            returnData = super.getFailReturnData("解决方案ID不能为空!");
        }
        return returnData;
    }

    /** 更新操作 */
    private String updateOperate(String file, String describe) throws Exception {
        Platform platform = (Platform) JsonUtil.getDTO(file, Platform.class);
        if(describe!=null){platform.setDescribe(describe);}
        platformDao.updatePlatFormFile(platform);
        logger.info("修改的解决方案ID为:" + platform.getPfId());
        returnData = super.getSuccessReturnData(platform.getPfId());
        return returnData;
    }

    /**
     * 根据平台目录取得该目录下的所有平台和子目录
     * 
     * @author yuzq date 2013-2-27
     * @throws Exception
     * @see com.zjcds.portal.service.platform.PlatformService #getSubPFInfo(int)
     */
    @Override
    public String getSubPFInfo(int pfId) throws Exception {
        List<Platform> platformList = platformDao.getSubPFInfo(pfId);
        setSubPlatformCount(platformList);
        returnData = super.getSuccessReturnData(JsonUtil.getJSONString(platformList));
        return returnData;
    }

    /** 设置下一级解决方案数目 */
    private void setSubPlatformCount(List<Platform> platformList) throws Exception {
        for (Platform platform : platformList) {
            platform.setSubNumber(platformDao.getSubPFInfoCount(platform.getPfId()));
        }
    }

    /**
     * @see com.zjcds.portal.service.platform.PlatformService #getSubPFInfo(int, String, String)
     */
    @Override
    public String getSubPFInfo(int pfId, String userId, String otherUserId) throws Exception {
        List<Platform> platformList = new ArrayList<Platform>();
        if (clickSharedPlatformGroup(pfId)) {// 点击分享的解决方案组，只取得分享的解决方案
            platformList = platformDao.getSharedPFInfo(userId);
        }
        else if (clickOtherUserPlatform(pfId)) {// 点击其他用户的解决方案则取得该用户的解决方案
            getOtherUserPlatform(platformList, otherUserId);
        }
        else {
            getPersonalPlatform(platformList, pfId, userId);
        }
        return super.getSuccessReturnData(platformList);
    }

    /** 点击解决方案组 */
    private boolean clickSharedPlatformGroup(int pfId) throws Exception {
        return Constant.PLATFROM_ID_SHARED == pfId;
    }

    /** 点击其他用户的解决方案 */
    private boolean clickOtherUserPlatform(int pfId) throws Exception {
        return Constant.PLATFROM_ID_OTHERS >= pfId;
    }

    /** 取得其他用户的解决方案 */
    private void getOtherUserPlatform(List<Platform> platformList, String otherUserId) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("pfId", 0);
        map.put("userId", otherUserId);
        platformList = platformDao.getUserSubPFInfo(map);
        for (Platform platform : platformList) {
            map.put("parentId", platform.getPfId());
            platform.setSubNumber(platformDao.getUserSubPFInfoCount(map));
        }
    }

    /** 取得个人的解决方案 */
    private void getPersonalPlatform(List<Platform> platformList, int pfId, String userId) throws Exception {
        if (loginByGeneralUser(pfId, userId)) {// 非管理员并已经登录，只有第一层才拼装
            getGeneralUserRootNodePlatfrom(platformList, pfId, userId);
        }
        else if (loginByAdminUser(userId,pfId)) {// 管理员或未登录，只有第一层才拼装
            getAdminUserRootNodePlatform(platformList,pfId);
        }
        else {
            platformCreatedByPersonal(platformList,pfId,userId);
        }
    }

    /** 普通用户登录,且第一次取得解决方案(只取得根节点下的解决方案) */
    private boolean loginByGeneralUser(int pfId, String userId) throws Exception {
        return userId != null && pfId == 0;
    }

    /** 取得普通用户根节点的解决方案 */
    private void getGeneralUserRootNodePlatfrom(List<Platform> platformList, int pfId, String userId) throws Exception {
        platformCreatedByPersonal(platformList, pfId, userId);
        platformSharedByOther(platformList,userId);
    }

    /** 拥有其他分享的解决方案 */
    private boolean hasSharedPlatform(int sharedNum) throws Exception {
        return sharedNum > 0;
    }

    /** 根据创建用户取得解决方案,非根节点之下的解决方案*/
    private void platformCreatedByPersonal(List<Platform> platformList, int pfId, String userId) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("pfId", pfId);
        map.put("userId", userId);
        platformList = platformDao.getUserSubPFInfo(map);
        for (Platform platform : platformList) {
            map.put("parentId", platform.getPfId());
            platform.setSubNumber(platformDao.getUserSubPFInfoCount(map));
        }
    }

    /** 其他用户分享的解决方案 */
    private void platformSharedByOther(List<Platform> platformList, String userId) throws Exception {
        int sharedNum = platformDao.getSharedPFCount(userId);
        if (hasSharedPlatform(sharedNum)) {// 有分享
            Platform sharedForm = new Platform();
            sharedForm.setPfId(Constant.PLATFROM_ID_SHARED);
            sharedForm.setPfName(Constant.PLATFROM_NAME_SHARED);
            sharedForm.setSubNumber(sharedNum);
            platformList.add(sharedForm);
        }
    }

    /**管理员登陆,且第一次取得解决方案(只取得根节点下的解决方案)*/
    private boolean loginByAdminUser(String userId,int pfId) throws Exception{
        return userId == null && pfId == 0;
    }
    /**取得管理员根节点的解决方案*/
    private void getAdminUserRootNodePlatform(List<Platform> platformList,int pfId) throws Exception{
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("pfId", pfId);
        platformList = platformDao.getAdminSubPFInfo(map);
        for (Platform platform : platformList) {
            map.put("parentId", platform.getPfId());
            platform.setSubNumber(platformDao.getUserSubPFInfoCount(map));
        }
        combineOtherAndPersonalPlatform(platformList);
    }
    /**合并其他用户和个人的解决方案*/
    private void combineOtherAndPersonalPlatform(List<Platform> platformList) throws Exception{
        List<String> userList = platformDao.getAllOtherUserPF();
        int i = 0;
        for (String user : userList) {
            try {
                String userName = getUserName(user);
                if (userName == null)
                    continue;
                Platform otherForm = new Platform();
                otherForm.setUserId(user);
                otherForm.setPfId(Constant.PLATFROM_ID_OTHERS - i);
                otherForm.setPfName(userName + Constant.PLATFROM_NAME_OTHERS);// 此处需要替换userId为userName
                Map<String, Object> tmpMap = new HashMap<String, Object>();
                tmpMap.put("userId", user);
                tmpMap.put("parentId", 0);
                otherForm.setSubNumber(platformDao.getUserSubPFInfoCount(tmpMap));
                platformList.add(otherForm);
            }
            finally {
                i++;
            }
        }
    }
    /** 取得用户名称 */
    private String getUserName(String userId) throws Exception {
        Map<String, String> requestParam = setRequestParam(userId);
        String userInfo = getUserInfo(requestParam);
        return getUserNameOperate(userInfo);
    }

    /** 设置请求参数 */
    private Map<String, String> setRequestParam(String userId) throws Exception {
        JSONObject requestParam = new JSONObject();
        requestParam.put("id", userId);
        requestParam.put("type", 1);
        Map<String, String> result = new HashMap<String, String>();
        result.put("data", requestParam.toString());
        return result;
    }

    /** 调用OM接口取得用户信息 */
    private String getUserInfo(Map<String, String> requestParam) throws Exception {
        ConnectInfo con = new ConnectInfo(ConfigManager.getInstance().getSysConfig().getOmServer());
        Map<String, String> mapper = ConfigManager.getInstance().getSysConfig().getOmInterface();
        String result = HttpTools.doGet(con, mapper.get("userInfo"), requestParam);
        return result;
    }

    /** 取得用户名称操作 */
    @SuppressWarnings("unchecked")
    private String getUserNameOperate(String userInfo) throws Exception {
        JSONObject returnData = JSONObject.fromObject(userInfo);
        Map<String, Object> data = returnData.getJSONObject("data");
        String userName = null;
        String email = null;
        if (data != null && !data.isEmpty()) {
            userName = (String) data.get("name");
            email = (String) data.get("email");
            email = email.split("@")[0];
        }
        if (userName == null) {
            return userName;
        }
        else {
            return userName + "(" + email + ")";
        }
    }

    /**
     * 
     * @see com.zjcds.portal.service.platform.PlatformService #checkPFFile(int, UserPermission, String)
     */
    @Override
    public boolean checkPFFile(int pfId, UserPermission user, String resourceName) throws Exception {
        boolean hasSavePer = false;
        if (user != null && !Constants.ADMIN_USER.equals(user.getKind())) {// 通过OM3.0登录,并不是管理员
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("pfId", pfId);
            map.put("userId", user.getId());
            int count = platformDao.checkPFFile(map);
            if (count == 1) {// 属于自己的解决方案
                hasSavePer = true;
            }
            else {// 别人分享的解决方案则需要判断操作权限
                List<Permission> pers = user.getPermission();
                Map<String, String> resources = ConfigManager.getInstance().getSysConfig().getResources();
                String resource = resources != null ? resources.get(resourceName) : "";
                for (Permission per : pers) {
                    if (resource.equals(per.getName()) && (per.getRole() == null || per.getRole().compareTo(-1) != 0)) {// 有保存权限
                        hasSavePer = true;
                        break;
                    }
                }
            }
        }
        else {// 未登录，目前就直接返回OK
            hasSavePer = true;
        }
        return hasSavePer;
    }

    /**
     * 
     * @see com.zjcds.portal.service.platform.PlatformService #updateDescribeById(int, String, String)
     */
    @Override
    public void updateDescribeById(int pfId, String describe, String userId) throws Exception {
        Platform platform = new Platform();
        platform.setPfId(pfId);
        platform.setDescribe(describe);
        platform.setUpdateUser(userId);
        platform.setUpdateTime(DateUtil.getCurDate(DateUtil.DEFAULT_DATETIME_FORMAT_SEC));
        platformDao.updateDescribeById(platform);
    }

    /**
     * 
     * @see com.zjcds.portal.service.platform.PlatformService #operateSharedPF(List<SharedPlatForm>)
     */
    @SuppressWarnings("unchecked")
    @Override
    public void operateSharedPF(String sharedData) throws Exception {
        List<Map<String, Object>> sharedPf = (List<Map<String, Object>>) JsonUtil.getDTOList(sharedData, Map.class);
        for (Map<String, Object> map : sharedPf) {
            platformDao.operateSharedPF(map);
        }
    }

    @Override
    public String getSharedUsersByPF(int pfId) throws Exception {
        List<Map<String, String>> userList = platformDao.getSharedUsersByPF(pfId);
        String platformList_to_str = JsonUtil.getJSONString(userList);
        JSONObject json = new JSONObject();
        json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_SUCCESS);
        json.put(Constants.RETURN_DATA, platformList_to_str);
        return json.toString();
    }

    /**
     * 删除平台目录
     * 
     * @see com.zjcds.portal.service.platform.PlatformService #deletePlatformDir(String)
     * @author yuzq 2013-2-25
     */
    @Override
    public int deletePlatFormDir(int pfId) throws Exception {
        // 删除解决方案的点击统计数
        platformDao.deletePlatformHot(pfId);
        // 删除分享记录
        platformDao.deleteSharedPlatForm(pfId);
        // 删除解决方案目录
        platformDao.deletePlatFormFile(pfId);
        // 删除解决方案的喜好信息
        platformDao.deleteFavoriteByPfId(pfId);
        // 删除解决方案的日志信息
        platformDao.deletePFLogByPfId(pfId);
        // 递归删除
        List<Platform> platformList = platformDao.getSubPFFile(pfId);
        for (Platform platform : platformList) {
            deletePlatFormDir(platform.getPfId());
        }
        return 0;
    }

    /**
     * @see com.zjcds.portal.service.platform.PlatformService#cdtPlatFormSort(java.lang.String)
     */
    @SuppressWarnings("unchecked")
    @Override
    public String cdtPlatFormSort(String file) throws Exception {
        if (file != null && !"".equals(file)) {
            List<Platform> pfList = (List<Platform>) JsonUtil.getDTOList(file, Platform.class);
            for (Platform p : pfList) {
                platformDao.updatePlatFormFile(p);
            }
            returnData = super.getSuccessReturnData("排序完成!");
        }
        else {
            returnData = super.getFailReturnData("需传递参数file!");
        }
        return returnData;
    }

    /**
     * @see com.zjcds.portal.service.platform.PlatformService #getPFAccordPermission()
     */
    @Override
    public String getPFAccordPermission(String kind, List<Permission> permissions, int pfId) throws Exception {
        List<Platform> platforms = platformDao.getSubPFInfo(pfId);

        if (Constants.ADMIN_USER.equals(kind)) {
            setSubPlatformCount(platforms);
            returnData = super.getSuccessReturnData(JsonUtil.getJSONString(platforms));
        }
        else if (Constants.GENERAL_USER.equals(kind)) {
            returnData = getPFInPermission(platforms, permissions);
        }
        return returnData;
    }

    /**
     * 平台点击统计
     * 
     * @author liux 2013-8-7
     * @throws Exception
     */
    @Override
    public String setPFClickCount(int pfId) throws Exception {
        // 根据pfId,在T_PLATFORM_HOT表中获取数据，放入实体类platformHot，
        // 如果platformHot存在，则updatePlatformHot,如果platformHot不存在，则insertPlatformHot
        PlatformHot platformHot = platformDao.findPlatformHot(pfId);
        if (platformHot != null) {
            platformHot.setHotNum(platformHot.getHotNum() + 1);
            platformDao.updatePlatformHot(platformHot);
        }
        else {
            platformHot = new PlatformHot();
            platformHot.setPfId(pfId);
            platformHot.setHotNum(1);
            platformDao.insertPlatformHot(platformHot);
        }
        return super.getSuccessReturnData("完成统计");
    }
    
    @Override
    public String getPFDirTree() throws Exception {
        TreeBean treeBean = new TreeBean();
        List<TreeBean> pfDirList = getPFDirTreeData(treeBean);
        return super.getSuccessReturnData(pfDirList);
    }
    
    @Override
    public String getPFTree(String kind, List<Permission> permissions) throws Exception {
        TreeBean treeBean = new TreeBean();
        List<TreeBean> pfDirList = null;
        if (Constants.ADMIN_USER.equals(kind)) {
            pfDirList = getAllPFTreeData(treeBean);
        }
        else if (Constants.GENERAL_USER.equals(kind)) {
            pfDirList = getPFTreeData(treeBean, permissions);
        }
        return super.getSuccessReturnData(pfDirList);
    }
    
    @Override
    public String getFavoritePlatForm(String data) throws Exception {
        String ret = null;
        if (data != null && !data.isEmpty()) {
            PlatformFav pfFav = JSON.parseObject(data, PlatformFav.class);
            ret = super.getSuccessReturnData(platformDao.getFavoritePlatForm(pfFav));
        }
        else {
            ret = super.getFailReturnData("请传递file参数!");
        }
        return ret;
    }
    
    @Override
    public String getFavPlatFormList(String data) throws Exception {
        String ret = null;
        if (data != null && !data.isEmpty()) {
            PlatformFav pfFav = JSON.parseObject(data, PlatformFav.class);
            ret = super.getSuccessReturnData(platformDao.getFavPlatFormList(pfFav));
        }
        else {
            ret = super.getFailReturnData("请传递file参数!");
        }
        return ret;
    }

    @Override
    public String saveFavoritePlatForm(String data) throws Exception {
        String ret = null;
        if (data != null && !data.isEmpty()) {
            List<PlatformFav> pfFavs = JSON.parseArray(data, PlatformFav.class);
            for (PlatformFav pfFav : pfFavs) {
                if (pfFav.getKind() == 1) {// 新增
                    platformDao.saveFavoritePlatForm(pfFav);
                    logger.info("新增用户喜好成功!");
                }
                else if (pfFav.getKind() == -1) {//删除
                    platformDao.deleteFavoritePlatForm(pfFav);
                    logger.info("删除用户喜好成功!");
                }
            }
            ret = super.getSuccessReturnData("保存成功!");
        }
        else {
            ret = super.getFailReturnData("请传递file参数!");
        }
        return ret;
    }
    
    @Override
    public String savePlatFormLog(String data) throws Exception {
        String ret = null;
        if (data != null && !data.isEmpty()) {
            PlatformLog platformLog = JSON.parseObject(data, PlatformLog.class);
            platformDao.savePlatFormLog(platformLog);
            ret = super.getSuccessReturnData("保存成功!");
        }
        else {
            ret = super.getFailReturnData("请传递file参数!");
        }
        return ret;
    }

    @Override
    public String getPlatFormLog(String data, PageInfo pageInfo) throws Exception {
        String ret = null;
        if (data != null && !data.isEmpty()) {
            PlatformLog platformLog = JSON.parseObject(data, PlatformLog.class);
            ret = super.makeEasyUiData(platformDao.getPlatFormLog(platformLog, pageInfo), pageInfo.getTotalCount(), null);
        }
        else {
            ret = super.getFailReturnData("请传递file参数!");
        }
        return ret;
    }
    
    @Override
    public String getPlatFormLogNum(String data, String pieData) throws Exception {
        if (data != null && !data.isEmpty() && pieData != null && !pieData.isEmpty()) {
            PlatformLog platformLog = JSON.parseObject(data, PlatformLog.class);
            List<PlatformLog> platformLogList = platformDao.getPlatFormLogNum(platformLog);
            com.alibaba.fastjson.JSONObject pieJsonData = JSON.parseObject(pieData);
            com.alibaba.fastjson.JSONArray seriesValue = pieJsonData.getJSONArray(Constant.SERIES);
            for (int j = 0; j < platformLogList.size(); j++) {//获取数据设置到highcharts的json对象中
                for (int i = 0; i < seriesValue.size(); i++) {// 遍历放入记录
                    com.alibaba.fastjson.JSONArray itemData = seriesValue.getJSONObject(i).getJSONArray(Constant.DATA);// 获取存放数据的对象
                    com.alibaba.fastjson.JSONArray item = new com.alibaba.fastjson.JSONArray();
                    item.add(platformLogList.get(j).getPfName());
                    item.add(platformLogList.get(j).getVisitNum());
                    itemData.add(item);
                }
            }
            return super.getSuccessReturnData(pieJsonData);
        }
        else {
            return super.getFailReturnData("file参数不能为空!");
        }
    }
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Override
    public String getPlatMenus(String kind, List<Permission> permissions) throws Exception {
        List<Map<String, Object>> menusList = platformDao.getPlatFormMenus();
        
        if (Constants.GENERAL_USER.equals(kind)) {
            menusList = filterWithPermission(menusList, permissions);
        }
        String parentIds;
        List<Map<String, Object>> tempMap;
        for (Map menuMap : menusList) {
            tempMap = platformDao.getPlatFormMenusParentId(menuMap);
            parentIds = "";
            for (Map parentMap : tempMap) {
                if ("".equals(parentIds)) {
                    parentIds = parentMap.get("PARENTID").toString();
                }
                else {
                    parentIds = parentIds + "," + parentMap.get("PARENTID").toString();
                }
            }
            menuMap.put("parentId", parentIds);
        }
        return super.getSuccessReturnData(menusList);
    }
    
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Override
    public String getPlatMenu(String kind, List<Permission> permissions) throws Exception {
        List<Map<String, Object>> menusList = platformDao.getPlatFormMenu();
        
        if (Constants.GENERAL_USER.equals(kind)) {
            menusList = filterWithPermission(menusList, permissions);
        }
        String parentIds;
        List<Map<String, Object>> tempMap;
        for (Map menuMap : menusList) {
            tempMap = platformDao.getPlatFormMenusParentId(menuMap);
            parentIds = "";
            for (Map parentMap : tempMap) {
                if ("".equals(parentIds)) {
                    parentIds = parentMap.get("PARENTID").toString();
                }
                else {
                    parentIds = parentIds + "," + parentMap.get("PARENTID").toString();
                }
            }
            menuMap.put("parentId", parentIds);
        }
        return super.getSuccessReturnData(menusList);
    }

    @SuppressWarnings("unchecked")
	@Override
    public String getPlatFormParentIdByName(String data) throws Exception {
    	String ret = null;
        if (data != null && !data.isEmpty()) {
            Map<String, Object> map = JSON.parseObject(data, Map.class);
            List<Map<String, Object>> mapList = platformDao.getPlatFormParentIdByName(map);
            String parentIds = "";
            for (Map<String, Object> parentMap : mapList) {
                if ("".equals(parentIds)) {
                    parentIds = parentMap.get("PARENTID").toString();
                }
                else {
                    parentIds = parentIds + "," + parentMap.get("PARENTID").toString();
                }
            }
            com.alibaba.fastjson.JSONObject json = new com.alibaba.fastjson.JSONObject();
            json.put("parentId", parentIds);
            ret = super.getSuccessReturnData(json);
        }
        else {
            ret = super.getFailReturnData("请传递file参数!");
        }
        return ret;
    }
    
    /**
     * 根据权限过滤
     * @param menusList
     * @param permissions
     * @return
     * @author linj created on 2014-4-18 
     * @since CDS Framework 1.0
     */
    private List<Map<String, Object>> filterWithPermission(List<Map<String, Object>> menusList, List<Permission> permissions) {
        List<Map<String, Object>> resultData = new ArrayList<Map<String, Object>>();
        for (Map<String, Object> map : menusList) {
            for (Permission p : permissions) {
                if (map.get("pfName").equals(p.getName())) {
                    resultData.add(map);
                    break;
                }
            }
        }
        return resultData;
    }

    
    /**
     * 获取解决方案组树
     */
    private List<TreeBean> getPFDirTreeData(TreeBean treeBean) throws Exception {
        List<TreeBean> resources = platformDao.getPFDirTree(treeBean);
        for (TreeBean beanData : resources) {
            beanData.setIconCls(Constant.ICON_PLATFORM_DIR_CLASS);//都是解决方案组
            if (beanData.getState() != null) {
                beanData.setChildren(getPFDirTreeData(beanData));
            }
        }
        return resources;
    }
    
    /**
     * 获取解决方案及解决方案组树
     * @param treeBean
     * @return
     * @throws Exception
     * @author Administrator created on 2014-2-25 
     * @since CDS Framework 1.0
     */
    private List<TreeBean> getAllPFTreeData(TreeBean treeBean) throws Exception {
        List<TreeBean> pfTrees = platformDao.getPFTree(treeBean);
        for (TreeBean beanData : pfTrees) {
            if (beanData.getType() == Constant.DIR_IDENTIFICATION) {//解决方案组
                beanData.setIconCls(Constant.ICON_PLATFORM_DIR_CLASS);
            }
            else {
                beanData.setIconCls(Constant.ICON_PLATFORM_FILE_CLASS);
            }
            if (beanData.getState() != null) {
                beanData.setChildren(getAllPFTreeData(beanData));
            }
        }
        return pfTrees;
    }

    /**
     * 根据权限获取解决方案及解决方案组树
     * @param treeBean
     * @return
     * @throws Exception
     * @author Administrator created on 2014-2-25 
     * @since CDS Framework 1.0
     */
    private List<TreeBean> getPFTreeData(TreeBean treeBean, List<Permission> permissions) throws Exception {
        List<TreeBean> pfTrees = platformDao.getPFTree(treeBean);
        List<TreeBean> resultData = new ArrayList<TreeBean>();
        for (TreeBean beanData : pfTrees) {
            for (Permission p : permissions) {
                if (beanData.getName().equals(p.getName())) {
                    if (beanData.getType() == Constant.DIR_IDENTIFICATION) {//解决方案组
                        beanData.setIconCls(Constant.ICON_PLATFORM_DIR_CLASS);
                    }
                    else {
                        beanData.setIconCls(Constant.ICON_PLATFORM_FILE_CLASS);
                    }
                    if (beanData.getState() != null) {
                        beanData.setChildren(getPFTreeData(beanData, permissions));
                    }
                    resultData.add(beanData);
                    break;
                }
            }
        }
        return resultData;
    }

    /** 取得符合权限的解决方案 */
    private String getPFInPermission(List<Platform> platforms, List<Permission> permissions) throws Exception {
        List<Platform> resultData = compareWithPermission(platforms, permissions);
        if (resultData.size() == 0) {
            return super.getSuccessReturnData(resultData);
        }
        else {
            addSubCount(resultData, permissions);
            return super.getSuccessReturnData(JsonUtil.getJSONString(resultData));
        }
    }

    private List<Platform> compareWithPermission(List<Platform> platforms, List<Permission> permissions)
            throws Exception {
        List<Platform> resultData = new ArrayList<Platform>();
        for (Platform pf : platforms) {
            for (Permission p : permissions) {
                if (pf.getPfName().equals(p.getName())) {
                    resultData.add(pf);
                    break;
                }

            }
        }
        return resultData;
    }

    private void addSubCount(List<Platform> resultData, List<Permission> permissions) throws Exception {
        for (Platform pf : resultData) {
            List<Platform> subPlatforms = platformDao.getSubPFInfo(pf.getPfId());
            List<Platform> comparedPF = compareWithPermission(subPlatforms, permissions);
            pf.setSubNumber(comparedPF.size());
        }
    }

    public PlatformDao getPlatformDao() {
        return platformDao;
    }

    public void setPlatformDao(PlatformDao platformDao) {
        this.platformDao = platformDao;
    }

}
