package com.zjcds.om.service.authentication.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.zjcds.framework.common.util.JsonUtil;
import com.zjcds.framework.common.util.StringUtils;
import com.zjcds.om.constant.OMConstant;
import com.zjcds.om.data.bean.OMResourceData;
import com.zjcds.om.data.bean.OMUserData;
import com.zjcds.om.data.bean.OMUserPermissionData;
import com.zjcds.om.data.dao.OMResourceDao;
import com.zjcds.om.data.dao.OMUserDao;
import com.zjcds.om.service.OMBaseService;
import com.zjcds.om.service.authentication.OMAuthtService;

/**
 * 认证接口实现类 service层
 * 
 * @author linj
 * @date 2013/5/7
 * 
 */
public class OMAuthtServiceImpl extends OMBaseService implements OMAuthtService {

    private OMResourceDao resourceDao;

    private OMUserDao userDao;

    @Override
    public String omGetUserPopedom(String data) throws Exception {
        if (data == null || data.isEmpty()) {
            returnData = super.getFailReturnData("用户信息不能为空!");
        }
        else {
            List<OMUserPermissionData> userPerList = getUserRols(data);
            List<OMUserPermissionData> combinedPerList = OMUserPermissionData.combineSameResource(userPerList);
            Set<OMUserPermissionData> parentList = getParentResourceRole(combinedPerList);
            combinedPerList.addAll(parentList);
            returnData = super.getSuccessReturnData(combinedPerList);
        }
        return returnData;
    }

    /*** 取得父资源 */
    private Set<OMUserPermissionData> getParentResourceRole(List<OMUserPermissionData> list) throws Exception {
        Set<OMUserPermissionData> parentList = new HashSet<OMUserPermissionData>();
        for (OMUserPermissionData userPer : list) {
        	getAllParentResourceRole(userPer.getParentId(), parentList);
        }
        return parentList;
    }

    /**
     * 递归获取父资源
     * @param parentId
     * @param parentList
     */
    private void getAllParentResourceRole(Integer parentId, Set<OMUserPermissionData> parentList) {
    	OMResourceData parentResource = resourceDao.getParentResource(parentId);
        OMUserPermissionData parentPer = null;
        if (parentResource != null
                && parentResource.getParentId().intValue() != OMConstant.ORGANIZATION_ROOT_DIR_ID) {
            parentPer = new OMUserPermissionData();
            parentPer.setId(parentResource.getId());
            parentPer.setName(parentResource.getName());
            parentPer.setNo(parentResource.getNo());
            parentPer.setParentId(parentResource.getParentId());
            parentPer.setRole(1); // 至少保证拥有查看权限
            if (!parentList.contains(parentPer)) {//parentPer重写了equals方法
                parentList.add(parentPer);
            }
            getAllParentResourceRole(parentResource.getParentId(), parentList);
        }
    }

    /**
     * @see com.zjcds.om.service.authentication.OMAuthtService #omLogin(String)
     */
    @Override
    public String omLogin(String data) throws Exception {
        if (data == null || data.isEmpty()) {
            returnData = super.getFailReturnData("用户信息不能为空!");
        }
        else {
            OMUserData user = (OMUserData) JsonUtil.getDTO(data, OMUserData.class);
            user.setPassword(StringUtils.encryptString(user.getPassword()));// MD5加密
            Map<String, Object> userInfo = userDao.omLogin(user);
            if (userInfo != null && userInfo.get("id") != null) {
                List<OMUserPermissionData> permissionList = getUserRols("{" + "'userId':" + userInfo.get("id") + "}");
                List<OMUserPermissionData> combinedPerList = OMUserPermissionData.combineSameResource(permissionList);
                Set<OMUserPermissionData> parentList = getParentResourceRole(combinedPerList);
                combinedPerList.addAll(parentList);
                userInfo.put("permission", combinedPerList);
                returnData = super.getSuccessReturnData(userInfo);
            }
            else {
                returnData = super.getFailReturnData("用户名或密码错误!");
            }
        }
        return returnData;
    }

    /**
     * 取得用户权限
     * 
     * @param data
     * @return
     * @author linj created on 2013-5-7
     * @since OM 1.0
     */
    @SuppressWarnings("unchecked")
    private List<OMUserPermissionData> getUserRols(String data) {
        Map<String, Object> jsonObject = (Map<String, Object>) JsonUtil.getMapFromJson(data);
        return resourceDao.omGetUserAllResource(jsonObject);
    }

    /**
     * 取得用户资源
     * 
     * @param data
     * @return
     * @author linj created on 2013-5-7
     * @since OM 1.0
     */
    // @SuppressWarnings("unchecked")
    // private List<OMResourceData> getUserResources(String data) {
    // Map<String, Object> jsonObject = (Map<String, Object>) JsonUtil.getMapFromJson(data);
    // return resourceDao.omGetUserAllResourceInfo(jsonObject);
    // }

    /**
     * 转换父子关系取得的用户资源
     * 
     * @param data
     * @return
     * @author linj created on 2013-5-8
     * @since OM 1.0
     */
    // private List<OMUserPermissionData> getUserRolsParentChild(List<OMResourceData> data) {
    // List<OMUserPermissionData> perList = new ArrayList<OMUserPermissionData>();
    // for (OMResourceData per : data) {//已经根据parentId和id排序的
    // OMUserPermissionData perData = new OMUserPermissionData();
    // perData.setName(per.getName());
    // perData.setRole(per.getPermission());
    // for (OMResourceData tmpPer : data) {
    // if (per.getParentId().compareTo(tmpPer.getId()) == 0) {//存在父亲的数据
    // perData.setName(new
    // StringBuilder().append(tmpPer.getName()).append(OMConstant.SEPARATOR_DASH).append(per.getName()).toString());
    // break;
    // }
    // }
    // perList.add(perData);
    // }
    // return perList;
    // }

    public OMResourceDao getResourceDao() {
        return resourceDao;
    }

    public void setResourceDao(OMResourceDao resourceDao) {
        this.resourceDao = resourceDao;
    }

    public OMUserDao getUserDao() {
        return userDao;
    }

    public void setUserDao(OMUserDao userDao) {
        this.userDao = userDao;
    }

}
