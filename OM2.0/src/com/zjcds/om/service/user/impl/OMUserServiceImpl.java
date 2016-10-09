package com.zjcds.om.service.user.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.zjcds.framework.common.util.JsonUtil;
import com.zjcds.framework.common.util.StringUtils;
import com.zjcds.om.constant.OMConstant;
import com.zjcds.om.data.bean.OMOrganizationData;
import com.zjcds.om.data.bean.OMUserData;
import com.zjcds.om.data.dao.OMOrganizationDao;
import com.zjcds.om.data.dao.OMUserDao;
import com.zjcds.om.service.OMBaseService;
import com.zjcds.om.service.user.OMUserService;
import com.zjcds.om.view.bean.AwardInfo;

/**
 * 用户实现类 service层
 * 
 * @author yuzq
 * @date 2013/4/24
 * 
 */
public class OMUserServiceImpl extends OMBaseService implements OMUserService {

    private OMUserDao userDao;

    private OMOrganizationDao organizationDao;

    /**
     * @see com.zjcds.om.service.user.OMUserService #omGetCurrentUserPopedom(String, String)
     */
    @Override
    public String omGetCurrentUserPopedom(String type, String data) throws Exception {
        return null;
    }

    /**
     * @see com.zjcds.om.service.user.OMUserService #omRemoveRelationUserWithOrganization(String, String)
     */
    @Override
    public String omRemoveRelationUserWithOrganization(String data) throws Exception {
        if (data != null && data != "") {
            Map<String, Object> map = getCapsulationMap(data);
            if (omCheckIsSuccess(map)) {
                if (userOnlyBelongOneOrganization((Integer) map.get("userId"))) {
                    returnData = super.getFailReturnData("该用户只属于一个组织 ,不允许移除,可以转移到别的组织!");
                }
                else {
                    userDao.omDeleteRelationByIds(map);
                    returnData = super.getSuccessReturnData("组织ID:" + map.get("organizationId") + ",用户ID:"
                            + map.get("userId"));
                }
            }
            else {
                returnData = super.getFailReturnData("参数格式不正确!");
            }
        }
        else {
            returnData = super.getFailReturnData("参数不能为空");
        }
        return returnData;
    }

    /** 该用户只属于一个组织 */
    private boolean userOnlyBelongOneOrganization(int userId) throws Exception {
        return userDao.omGetRelationCount(userId) <= 1;
    }

    /**
     * @see com.zjcds.om.service.user.OMUserService #omGetAllUser()
     */
    @Override
    public String omGetAllUser() throws Exception {
        List<OMUserData> userList = userDao.omGetAllUser();
        setUserIcons(userList);
        returnData = super.getSuccessReturnData(getCapsulationList(userList));
        return returnData;
    }

    /** 设置用户图标 */
    private void setUserIcons(List<OMUserData> userList) throws Exception {
        for (OMUserData user : userList) {
            user.setIconCls(OMConstant.ICON_USER);
            user.setIconSkin(OMConstant.ICON_USER);
        }
    }

    /** 组装数据 格式:[{"id":"",...,"attributes":{}},{},......] */
    private List<Map<String, Object>> getCapsulationList(List<OMUserData> userList) throws Exception {
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        Map<String, Object> map = null;
        for (OMUserData user : userList) {
            map = new HashMap<String, Object>();
            map.put("id", user.getId());
            map.put("text", user.getText());
            map.put("iconCls", user.getIconCls());
            map.put("attributes", user);
            list.add(map);
        }
        return list;
    }

    /** 将json格式的参数组织为Map格式 */
    @SuppressWarnings("unchecked")
    private Map<String, Object> getCapsulationMap(String data) throws Exception {
        return (Map<String, Object>) JsonUtil.getMapFromJson(data);
    }

    /** 验证通过 */
    private boolean omCheckIsSuccess(Map<String, Object> map) throws Exception {
        return map.get("organizationId") != null && map.get("userId") != null;
    }

    /**
     * @see com.zjcds.om.service.user.OMUserService #omUserIsExit(String)
     */
    @Override
    public String omUserIsExit(String data) throws Exception {
        OMUserData user = (OMUserData) JsonUtil.getDTO(data, OMUserData.class);
        if (userDao.omUserIsExit(user.getEmail()) != 0) {
            returnData = super.getFailReturnData("该邮箱已注册,请更换邮箱!");
        }
        else {
            returnData = super.getSuccessReturnData("该邮箱可用!");
        }
        return returnData;
    }

    /**
     * @see com.zjcds.om.service.user.OMUserService#omGetUserByOrganization()
     */
    @Override
    public String omGetUserByOrganization(String data) throws Exception {
        if (data != null && data != "") {
            @SuppressWarnings("unchecked")
            Map<String, Object> map = (Map<String, Object>) JsonUtil.getMapFromJson(data);
            Map<String, Object> checkedMap = omCheckMapIncludeOrganizationId(map);
            returnData = omGetOrganizationIfUserIdNotNull(checkedMap, map);
        }
        else {
            returnData = super.getFailReturnData("参数不能为空!");
        }
        return returnData;
    }

    /**
     * @see com.zjcds.om.service.user.OMUserService#omAwardOrganization(java.lang.String)
     */
    @Override
    public String omUserSelectOrganization(String data) throws Exception {
        if (data != null && data != "") {
            AwardInfo awardInfo = super.stringToAwardInfo(data);
            Map<String, Object> checkedAwardInfo = omCheckAwardInfo(awardInfo);
            boolean confirmToDao = omAwardAccordingFlagValue(checkedAwardInfo);
            if (confirmToDao == true) {
                returnData = omAwardSpecific(awardInfo);
            }
            else {
                returnData = super.getFailReturnData(checkedAwardInfo.get("returnData").toString());
            }
        }
        else {
            returnData = super.getFailReturnData("参数不能为空!");
        }
        return returnData;
    }

    /** 检查授权信息是否正确 */
    private Map<String, Object> omCheckAwardInfo(AwardInfo awardInfo) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        if (awardInfo.getId() != null) {
            map = omCheckOrganizationInfo(awardInfo);
        }
        else {
            map.put("returnData", "用户ID不能为空");
            map.put("Flag", false);
        }
        return map;
    }

    /** 检查选中的组织信息 */
    private Map<String, Object> omCheckOrganizationInfo(AwardInfo awardInfo) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        if (awardInfo.getValue().size() != 0) {
            map.put("Flag", true);
        }
        else {
            map.put("returnData", "组织信息不能为空");
            map.put("Flag", false);
        }
        return map;
    }

    /** 根据Flag的值确定是否执行DAO层 */
    private boolean omAwardAccordingFlagValue(Map<String, Object> checkedAwardInfo) throws Exception {
        boolean flag = false;
        if (checkedAwardInfo.get("Flag").equals(true)) {
            flag = true;
        }
        return flag;
    }

    /** 将组织赋予用户的具体操作 */
    private String omAwardSpecific(AwardInfo awardInfo) throws Exception {
        Map<String, Object> paramMap = null;
        List<AwardInfo> organizationList = awardInfo.getValue();
        for (AwardInfo organization : organizationList) {
            paramMap = new HashMap<String, Object>();
            paramMap.put("userId", awardInfo.getId());
            paramMap.put("type", organization.getType());
            paramMap.put("organizationId", organization.getId());
            userDao.omAwardOrganization(paramMap);
        }
        returnData = super.getSuccessReturnData("操作成功!");
        return returnData;
    }

    /** 检查参数是否包含组织ID */
    private Map<String, Object> omCheckMapIncludeOrganizationId(Map<String, Object> map) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        if (map.size() != 0 && map.get("organizationId") != null) {
            result.put("flag", true);
        }
        else {
            result.put("returnData", "参数格式不正确");
            result.put("flag", false);
        }
        return result;
    }

    /** 当用用户ID不为空时,执行查询 */
    private String omGetOrganizationIfUserIdNotNull(Map<String, Object> checkedMap, Map<String, Object> map)
            throws Exception {
        if (checkedMap.get("flag").equals(true)) {
            returnData = super.getSuccessReturnData(userDao
                    .omGetUserByOrganization((Integer) map.get("organizationId")));
        }
        else {
            returnData = super.getFailReturnData(checkedMap.get("returnData").toString());
        }
        return returnData;
    }

    /**
     * @see com.zjcds.om.service.user.OMUserService#omGetShareUser(java.lang.String)
     */
    @Override
    public String omGetShareUser(String data) throws Exception {
        if (data != null && data != "") {
            OMUserData user = (OMUserData) JsonUtil.getDTO(data, OMUserData.class);
            List<Map<String, Object>> shareUserList = userDao.omGetShareUser(user);
            returnData = super.getSuccessReturnData(shareUserList);
        }
        else {
            returnData = super.getFailReturnData("参数data不存在!");
        }
        return returnData;
    }

    /**
     * @see com.zjcds.om.service.user.OMUserService#omUserRegister(java.lang.String)
     */
    @SuppressWarnings("unchecked")
    @Override
    public String omUserRegister(String data) throws Exception {
        if (data != null && !"".equals(data)) {
            Map<String, Object> params = (Map<String, Object>) JsonUtil.getMapFromJson(data);
            if (userDao.omUserIsExit(params.get("email").toString()) == 0) {
                returnData = omPersonOrEnterpriseRegister(params);
            }
            else {
                returnData = super.getFailReturnData("该邮箱已注册,请更换邮箱!");
            }
        }
        else {
            returnData = super.getFailReturnData("参数data不能为空!");
        }
        return returnData;
    }

    /** 个人用户或企业用户注册,name不为空,则为企业用户注册;否则为个人用户注册 */
    private String omPersonOrEnterpriseRegister(Map<String, Object> params) throws Exception {
        if (params.get("organizationName") != null) {
            returnData = omEnterpriseRegister(params);
        }
        else {
            returnData = omPersonRegister(params);
        }
        return returnData;
    }

    /** 企业用户注册,判断该企业是否存在;如果存在,不允许注册;否则新建组织和用户 */
    private String omEnterpriseRegister(Map<String, Object> params) throws Exception {
        Integer count = organizationDao.omOrganizationIsExit(params.get("organizationName").toString());
        if (count != 0) {
            returnData = super.getSuccessReturnData("该企业存在,不允许注册!");
        }
        else {
            /***************** 新增组织 ***************/
            OMOrganizationData organization = addOrganization(params);
            // OMOrganizationData organization = new OMOrganizationData();
            // organization.setParentId(OMConstant.ORGANIZATION_ROOT_DIR_ID);
            // organization.setType(OMConstant.ORGANIZATION_IDENTIFICATION);
            // organization.setStatus(OMConstant.STATUS_FAULT);
            // organization.setName(params.get("organizationName").toString());
            // organization.setPassword(OMConstant.ORGANIZATION_PASSWORD_DEFAULT);
            // organizationDao.omAddOrganization(organization);
            /**************** 新增用户 ****************/
            OMUserData user = addUser(params);
            // OMUserData user = new OMUserData();
            // user.setType(OMConstant.USER_IDENTIFICATION);
            // user.setStatus(OMConstant.STATUS_FAULT);
            // user.setName(params.get("userName").toString());
            // user.setPassword(StringUtils.encryptString(params.get("password").toString())); // 密码加密
            // user.setEmail(params.get("email").toString());
            // userDao.omUserRegister(user);
            /**************************************/
            organization.setParentId(organization.getId());
            organization.setId(user.getId());
            userDao.omAddUserRelationWithOrganization(organization);
            returnData = super.getSuccessReturnData(user.getName());
        }
        return returnData;
    }

    /** 新增组织 */
    private OMOrganizationData addOrganization(Map<String, Object> params) throws Exception {
        OMOrganizationData organization = new OMOrganizationData();
        organization.setParentId(OMConstant.ORGANIZATION_ROOT_DIR_ID);
        organization.setType(OMConstant.ORGANIZATION_IDENTIFICATION);
        organization.setStatus(OMConstant.STATUS_FAULT);
        organization.setName(params.get("organizationName").toString());
        organization.setPassword(OMConstant.ORGANIZATION_PASSWORD_DEFAULT);
        organizationDao.omAddOrganization(organization);
        return organization;
    }

    /** 新增用户 */
    private OMUserData addUser(Map<String, Object> params) throws Exception {
        OMUserData user = new OMUserData();
        user.setType(OMConstant.USER_IDENTIFICATION);
        user.setStatus(OMConstant.STATUS_FAULT);
        user.setName(params.get("userName").toString());
        user.setPassword(StringUtils.encryptString(params.get("password").toString())); // 密码加密
        user.setEmail(params.get("email").toString());
        userDao.omUserRegister(user);
        return user;
    }

    /** 个人用户注册 ,将该用户新建在根节点之下 */
    private String omPersonRegister(Map<String, Object> params) throws Exception {
        /**************** 新增用户 ****************/
        OMUserData user = addUser(params);
        // OMUserData user = new OMUserData();
        // user.setType(OMConstant.USER_IDENTIFICATION);
        // user.setStatus(OMConstant.STATUS_FAULT);
        // user.setName(params.get("userName").toString());
        // user.setPassword(StringUtils.encryptString(params.get("password").toString())); // 密码加密
        // user.setEmail(params.get("email").toString());
        // userDao.omUserRegister(user);
        /**************************************/
        OMOrganizationData organization = new OMOrganizationData();
        organization.setParentId(OMConstant.ORGANIZATION_ROOT_DIR_ID);
        organization.setId(user.getId());
        userDao.omAddUserRelationWithOrganization(organization);
        returnData = super.getSuccessReturnData(user.getName());
        return returnData;
    }

    /**
     * @see com.zjcds.om.service.user.OMUserService#omUpdatePassword(java.lang.String)
     */
    @SuppressWarnings("unchecked")
    @Override
    public String omUpdatePassword(String data) throws Exception {
        if (checkDataIsNull(data)) {
            returnData = super.getFailReturnData("参数data不能为空!");
        }
        else {
            Map<String, Object> map = (Map<String, Object>) JsonUtil.getMapFromJson(data);
            String password = getUserPassword((Integer) map.get("id"));
            String newPassword = StringUtils.encryptString((String) map.get("new")).toString();
            if (!checkOldPasswordIsEqualPassword(newPassword, password)) {
                setPassword(map);
                userDao.omUpdateUserPassword(map);
                returnData = super.getSuccessReturnData(map.get("id"));
            }
            else {
                returnData = super.getFailReturnData("与原密码一致!");
            }
        }
        return returnData;
    }
    /**zTree 新增 start**/
    @Override
    public String omGetZTreeAllUser() throws Exception {
    	List<OMUserData> userList = userDao.omGetAllUser();
        setUserIcons(userList);
        returnData = JSONArray.toJSONString(userList);
    	return returnData;
    }
    /**zTree 新增 end**/
    
    @Override
    public String omGetUserInfo(String data) throws Exception {
    	 if (checkDataIsNull(data)) {
             returnData = super.getFailReturnData("参数data不能为空!");
         }
         else {
        	 String email = JSON.parseObject(data).getString("userAcct");
        	 if(checkDataIsNull(email)){
        		 returnData = super.getFailReturnData("账号userAcct不能为空!");
        	 }
        	 else{
        		 OMUserData omUserData = userDao.omGetUserInfo(email);
        		 returnData = super.getSuccessReturnData(omUserData);
        	 }
         }
    	return returnData;
    }

    /** 检查参数data为空 */
    private boolean checkDataIsNull(String data) throws Exception {
        return data == null || "".equals(data);
    }

    /** 取得用户密码 */
    private String getUserPassword(Integer id) throws Exception {
        return userDao.omGetUserPassword(id);
    }

    /** 检查输入的原密码是否原密码相同 */
    private boolean checkOldPasswordIsEqualPassword(String newPassword, String password) throws Exception {
        return password.equals(newPassword) || newPassword.equals(password);
    }

    /** 设置密码,对新密码加密并移除旧密码 */
    private void setPassword(Map<String, Object> map) throws Exception {
        map.put("new", StringUtils.encryptString((String) map.get("new")).toString());
    }

    public OMUserDao getUserDao() {
        return userDao;
    }

    public void setUserDao(OMUserDao userDao) {
        this.userDao = userDao;
    }

    public OMOrganizationDao getOrganizationDao() {
        return organizationDao;
    }

    public void setOrganizationDao(OMOrganizationDao organizationDao) {
        this.organizationDao = organizationDao;
    }
}
