package com.zjcds.om.service.organization.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zjcds.framework.common.util.JsonUtil;
import com.zjcds.framework.common.util.StringUtils;
import com.zjcds.om.constant.OMConstant;
import com.zjcds.om.data.bean.OMOrganizationData;
import com.zjcds.om.data.bean.OMUserData;
import com.zjcds.om.data.dao.OMOrganizationDao;
import com.zjcds.om.data.dao.OMUserDao;
import com.zjcds.om.service.OMBaseService;
import com.zjcds.om.service.organization.OMOrganizationService;
import com.zjcds.om.util.SqlEscapeUtil;
import com.zjcds.om.view.bean.AwardInfo;

/**
 * 组织接口实现类 service层
 * 
 * @author yuzq
 * @date 2013/4/23
 * 
 */
public class OMOrganizationServiceImpl extends OMBaseService implements OMOrganizationService {

    private OMOrganizationDao organizationDao;

    private OMUserDao userDao;

    /**
     * @see com.zjcds.om.service.organization.OMOrganizationService #omGetOrganizationTree(String, String)
     */
    @Override
    public String omGetOrganizationTree(String type, String data) throws Exception {
        OMOrganizationData organization = (OMOrganizationData) JsonUtil.getDTO(data, OMOrganizationData.class);
        // 初始化返回数据
        List<Map<String, Object>> returnData = new ArrayList<Map<String, Object>>();
        switch (super.stringToInt(type)) {
            case OMConstant.ONLY_RETURN_CHILDREN_DATA:
                returnData = getChildrenNodeData(organization);
                break;
        }
        return getSuccessReturnData(returnData);
    }

    /** 根据组织取得子节点数据 */
    private List<Map<String, Object>> getChildrenNodeData(OMOrganizationData organization) throws Exception {
        List<Map<String, Object>> organizationData = getOrganization(organization);
        getAppendUser(organizationData, organization);
        return organizationData;
    }

    /** 取得组织数据,并将每个组织组装成Map格式 */
    private List<Map<String, Object>> getOrganization(OMOrganizationData organization) throws Exception {
        List<Map<String, Object>> returnData = new ArrayList<Map<String, Object>>();
        List<OMOrganizationData> organizationList = organizationDao.omGetOrganizationOne(organization);
        returnData = getCapsulationList(organizationList);
        return returnData;
    }

    /** 将每个Map数据存放到List中 如:[{"id":"","parentId":"","text":"","type":"","iconCls":"","attrubutes":""},{......},...] */
    private List<Map<String, Object>> getCapsulationList(List<OMOrganizationData> organizationList) throws Exception {
        List<Map<String, Object>> maps = new ArrayList<Map<String, Object>>();
        for (OMOrganizationData origanization : organizationList) {
            origanization = setIcon(origanization);
            Map<String, Object> map = getCapsulationMap(origanization);
            maps.add(map);
        }
        return maps;
    }

    /** 将组织组装为Map格式数据 如:{"id":"","parentId":"","text":"","type":"","iconCls":"","attrubutes":""} */
    private Map<String, Object> getCapsulationMap(OMOrganizationData organization) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("id", organization.getId());
        map.put("parentId", organization.getParentId());
        map.put("text", organization.getText());
        map.put("type", organization.getType());
        map.put("state", organization.getState());
        map.put("iconCls", organization.getIconCls());
        /**zTree新增 start**/
        map.put("name", organization.getName());
        map.put("email", organization.getEmail());
        map.put("phone", organization.getPhone());
        map.put("mobilePhone", organization.getMobilePhone());
        map.put("address", organization.getAddress());
        map.put("isParent", organization.getIsParent());        
        map.put("iconSkin", organization.getIconSkin());
        /**zTree新增 end**/
        map.put("attributes", organization);
        return map;
    }

    /** 取得用户数据,追加到组织数据中 */
    private void getAppendUser(List<Map<String, Object>> returnData, OMOrganizationData organization) throws Exception {
        List<OMUserData> userList = userDao.getUserByOrganizationId(organization);
        Map<String, Object> userMap = null;
        for (OMUserData userData : userList) {
            userMap = getUserCapsulationMap(userData,organization);
            returnData.add(userMap);
        }
    }

    /** 用户数据组装成Map格式 如:{"id":"","text","","iconCls":"","attributes":""} */
    private Map<String, Object> getUserCapsulationMap(OMUserData user,OMOrganizationData organization) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("id", user.getId());
        map.put("parentId", organization.getId());
        map.put("text", user.getName());
        map.put("iconCls", OMConstant.ICON_USER);
        /**zTree新增 start**/
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("phone", user.getPhone());
        map.put("mobilePhone", user.getMobilePhone());
        map.put("address", user.getAddress());
        map.put("type", user.getType());
        map.put("iconSkin", OMConstant.ICON_USER);
        map.put("xzqhdm", user.getXzqhdm());
        map.put("xzqhmc", user.getXzqhmc());
        /**zTree新增 end**/
        map.put("attributes", user);
        return map;
    }

    /**
     * @see com.zjcds.om.service.organization.OMOrganizationService #omOperateOrganization(String, String)
     */
    @Override
    public String omOperateOrganization(String type, String data) throws Exception {
        OMOrganizationData organization = (OMOrganizationData) JsonUtil.getDTO(data, OMOrganizationData.class);
        if (TypeIsAdd(type))
            returnData = omAddOrganizationOrUser(organization);
        if (TypeIsDelete(type))
            returnData = omDeleteOrganization(organization);
        if (TypeIsUpdate(type))
            returnData = omUpdateOrganizationOrUser(organization);
        if (TypeIsError(type))
            returnData = super.getFailReturnData("操作类型错误!");
        return returnData;
    }

    /** 新增组织或用户 */
    private String omAddOrganizationOrUser(OMOrganizationData organization) throws Exception {
        if (checkOrganizationIsNull(organization))
            returnData = super.getFailReturnData("组织或用户信息不能为空!");
        if (checkTypeIsNull(organization))
            returnData = super.getFailReturnData("类型不能为空!");
        if (checkTypeIsNotLegal(organization))
            returnData = super.getFailReturnData("无法确定组织或用户!");
        if (checkSuccess(organization)) {
            omAddAccordingType(organization);
            returnData = super.getSuccessReturnData(organization.getId());
        }
        return returnData;
    }

    /** 检查组织(用户)信息为空 */
    private boolean checkOrganizationIsNull(OMOrganizationData organization) throws Exception {
        return organization == null;
    }

    /** 检查类型为空 */
    private boolean checkTypeIsNull(OMOrganizationData organization) throws Exception {
        return organization.getType() == null;
    }

    /** 检查类型不合法 */
    private boolean checkTypeIsNotLegal(OMOrganizationData organization) throws Exception {
        return organization.getType() != OMConstant.ORGANIZATION_IDENTIFICATION
                && organization.getType() != OMConstant.USER_IDENTIFICATION;
    }

    /** 检查通过 */
    private boolean checkSuccess(OMOrganizationData organization) throws Exception {
        return !checkTypeIsNull(organization) && !checkTypeIsNull(organization) && !checkTypeIsNotLegal(organization);
    }

    /** 删除组织 或用户 */
    private String omDeleteOrganization(OMOrganizationData organization) throws Exception {
        if (checkOrganizationIsNull(organization))
            returnData = super.getFailReturnData("组织或用户信息不能为空!");
        if (checkTypeIsNull(organization))
            returnData = super.getFailReturnData("类型不能为空!");
        if (checkTypeIsNotLegal(organization))
            returnData = super.getFailReturnData("无法确定组织或用户!");
        if (checkSuccess(organization)) {
            List<OMUserData> users = new ArrayList<OMUserData>();
            omDeleteAccordingType(organization,users);
            returnData = super.getSuccessReturnData(users);
        }
        return returnData;
    }

    /** 根据类型删除组织或用户 type为0删除组织,为1删除用户 */
    private void omDeleteAccordingType(OMOrganizationData organization,List<OMUserData> users) throws Exception {
        if (organization.getType() == OMConstant.ORGANIZATION_IDENTIFICATION) {
            recursionDeleteOMOrganization(organization,users);
        }
        else if (organization.getType() == OMConstant.USER_IDENTIFICATION) {
            userDao.omDeleteUserRelationWithOrganization(organization);
            userDao.omDeleteUserRelationWithRole(organization);
            userDao.omDeleteUser(organization.getId());
        }
    }

    /** 递归删除组织 */
    private void recursionDeleteOMOrganization(OMOrganizationData organization,List<OMUserData> users) throws Exception {
    	 removeUserToRootWhenOnlyBelongToOneOrganization(organization,users);
        // 删除与用户的关系
        organizationDao.omDeleteRelationWithUser(organization.getId());
        // 删除与角色的关系
        organizationDao.omDeleteRelationWithRole(organization.getId());
        // 删除组织
        organizationDao.omDeleteOrganization(organization.getId());
        // 获取子组织
        List<OMOrganizationData> organizationList = organizationDao.getChildrenOrganization(organization.getId());
        for (OMOrganizationData o : organizationList) {
            recursionDeleteOMOrganization(o,users);
        }
    }

    
    private void removeUserToRootWhenOnlyBelongToOneOrganization(OMOrganizationData organization,List<OMUserData> users) throws Exception{
        List<OMUserData> userList = userDao.omGetUserByOrganization(organization.getId());
        for(OMUserData user : userList){
            int relationOrgCount = userDao.omGetRelationCount(user.getId());
            if(relationOrgCount <= 1){
            	OMOrganizationData org = new OMOrganizationData();
            	org.setParentId(OMConstant.ORGANIZATION_ROOT_DIR_ID);
            	org.setId(user.getId());
                userDao.omAddUserRelationWithOrganization(org);
                users.add(user);
            }
        }
    }
    /**
     * @see com.zjcds.om.service.organization.OMOrganizationService #omGetOrganization(String)
     */
    @Override
    public String omGetOrganization(String data) throws Exception {
        OMOrganizationData organization = (OMOrganizationData) JsonUtil.getDTO(data, OMOrganizationData.class);
        if (checkOrganizationIsNull(organization))
            returnData = super.getFailReturnData("组织或用户不能为空!");
        if (checkIdIsNull(organization))
            returnData = super.getFailReturnData("ID不能为空");
        if (!checkOrganizationIsNull(organization) && !checkIdIsNull(organization)) {
            OMOrganizationData result = organizationDao.omGetOrganization(organization);
            returnData = super.getSuccessReturnData(result);
        }
        return returnData;
    }

    /** 检查ID为空 */
    private boolean checkIdIsNull(OMOrganizationData organization) throws Exception {
        return organization.getId() == null;
    }

    /**
     * @see com.zjcds.om.service.organization.OMOrganizationService #omSerachOrganization(String)
     */
    @Override
    public String omSerachOrganization(String data) throws Exception {
        OMOrganizationData organization = (OMOrganizationData) JsonUtil.getDTO(data, OMOrganizationData.class);
        List<OMOrganizationData> organizationList = likeQueryOrganization(organization);
        return getSerachDataForClient(organizationList);
    }

    /** 取得搜索返回给客户端数据 */
    private String getSerachDataForClient(List<OMOrganizationData> organizationList) throws Exception {
        if (checkSerachResultIsNull(organizationList))
            returnData = super.getSuccessReturnData(organizationList);
        if (!checkSerachResultIsNull(organizationList)) {
            List<Map<String, Object>> maps = getCapsulationList(organizationList);
            Map<String, Object> root = getRootNodeBeforeRemove(maps);
            returnData = super.getSuccessReturnData(getCapsulationSerachResult(root, maps).get("children"));
        }
        return returnData;
    }

    /** 移除根节点之前取得该节点 */
    private Map<String, Object> getRootNodeBeforeRemove(List<Map<String, Object>> maps) throws Exception {
        Map<String, Object> rootNode = maps.get(0);
        maps.remove(rootNode);
        return rootNode;
    }

    /** 检查查询结果为空 */
    private boolean checkSerachResultIsNull(List<OMOrganizationData> organizationList) throws Exception {
        return organizationList.size() == 0;
    }

    /** 模糊匹配取得组织列表 */
    private List<OMOrganizationData> likeQueryOrganization(OMOrganizationData organization) throws Exception {
        if (organization == null)
            organization = new OMOrganizationData();
        String name = organization.getName();
        if(name.startsWith("%") || name.startsWith("_")){
            organization.setStatus(1);
        }
        List<OMOrganizationData> organizationList = organizationDao.omSearchOrg(organization);
        return organizationList;
    }

    /**
     * @see com.zjcds.om.service.organization.OMOrganizationService #omGetAllOrganization()
     */
    @Override
    public String omGetAllOrganization() throws Exception {
        return getAllOrganizationDataForClient();
    }

    /** 取得返回给客户端的所有组织数据 */
    private String getAllOrganizationDataForClient() throws Exception {
        List<OMOrganizationData> organizationList = queryAllOrganization();
        if (checkOrganizationIsNull(organizationList))
            returnData = super.getSuccessReturnData("不存在组织!");
        if (!checkOrganizationIsNull(organizationList)) {
            OMOrganizationData root = getRootNodeBeforeRemoveIt(organizationList);
            returnData = super.getSuccessReturnData(getCapsulationOrganization(root, organizationList).getChildren());
        }
        return returnData;
    }

    /** 取得根节点并移除它 */
    private OMOrganizationData getRootNodeBeforeRemoveIt(List<OMOrganizationData> organizationList) throws Exception {
        //OMOrganizationData rootNode = organizationList.get(0);
        //organizationList.remove(rootNode);
    	OMOrganizationData rootNode = null;
    	for (OMOrganizationData omOrganizationData : organizationList) {
			if(omOrganizationData.getId().intValue() == OMConstant.ORGANIZATION_ROOT_DIR_ID){
				rootNode = omOrganizationData;
				organizationList.remove(rootNode);
				break;
			}
		}
        return rootNode;
    }

    /** 检查查询的组织不存在 根节点除外 */
    private boolean checkOrganizationIsNull(List<OMOrganizationData> organizationList) throws Exception {
        return organizationList.size() <= 1;
    }

    /**
     * @see com.zjcds.om.service.organization.OMOrganizationService #omGetOrganizationByUser()
     */
    @Override
    public String omGetOrganizationByUser(String data) throws Exception {
        if (data != null && data != "") {
            @SuppressWarnings("unchecked")
            Map<String, Object> map = (Map<String, Object>) JsonUtil.getMapFromJson(data);
            if (checkUserIdIsNull(map))
                returnData = super.getFailReturnData("用户ID不能为空!");
            if (!checkUserIdIsNull(map)) {
                returnData = omGetOrganizationRelationWithUser(map);
            }
        }
        else {
            returnData = super.getFailReturnData("参数data不能为空!");
        }
        return returnData;
    }

    /** 检查用户ID为空 */
    private boolean checkUserIdIsNull(Map<String, Object> map) throws Exception {
        return map.get("userId") == null;
    }

    /**
     * @see com.zjcds.om.service.organization.OMOrganizationService#omAwardUser(java.lang.String)
     */
    @Override
    public String omOrganizationSelectUser(String data) throws Exception {
        if (data != null && data != "") {
            AwardInfo awardInfo = super.stringToAwardInfo(data);
            if (checkOrganizationIdIsNull(awardInfo))
                returnData = super.getFailReturnData("组织ID不能为空!");
            if (checkUserInfoNotExit(awardInfo))
                returnData = super.getFailReturnData("选中的用户信息不能为空!");
            if (!checkOrganizationIdIsNull(awardInfo) && !checkUserInfoNotExit(awardInfo)) {
                returnData = omCapsulationAwardMapBeforeSpecific(awardInfo);
            }
        }
        else {
            returnData = super.getFailReturnData("参数不能为空");
        }
        return returnData;
    }

    private boolean checkOrganizationIdIsNull(AwardInfo awardInfo) throws Exception {
        return awardInfo.getId() == null;
    }

    private boolean checkUserInfoNotExit(AwardInfo awardInfo) throws Exception {
        return awardInfo.getValue().size() == 0;
    }

    /** 持久化之前组装数据 */
    private String omCapsulationAwardMapBeforeSpecific(AwardInfo awardInfo) throws Exception {
        Map<String, Object> paramMap = null;
        List<AwardInfo> userList = awardInfo.getValue();
        List<Integer> result = new ArrayList<Integer>();
        for (AwardInfo user : userList) {
            paramMap = new HashMap<String, Object>();
            paramMap.put("organizationId", awardInfo.getId());
            paramMap.put("type", user.getType());
            paramMap.put("userId", user.getId());
            Integer resultId = omAwardSpecific(paramMap).getId();
            if (resultId != null) {
                result.add(resultId);
            }
        }
        returnData = super.getSuccessReturnData(result);
        return returnData;
    }

    /** 持久化操作 */
    private OMOrganizationData omAwardSpecific(Map<String, Object> paramMap) throws Exception {
        OMOrganizationData organization = new OMOrganizationData();
        if (paramMap.get("type").equals(1)) {
            int count = userDao.omGetRelationCount((Integer) paramMap.get("userId"));
            // 如果只属于一个组织,移动到根节点目录下
            if (count == 1) {
                organizationDao.omAwardOrganization(paramMap);
                organization.setParentId(OMConstant.ORGANIZATION_ROOT_DIR_ID);
                organization.setId((Integer) paramMap.get("userId"));
                userDao.omAddUserRelationWithOrganization(organization);
            }
            else {
                organizationDao.omAwardOrganization(paramMap);
            }
        }
        else {
            organizationDao.omAwardOrganization(paramMap);
        }
        return organization;
    }

    /** 取得与用户相关联的组织 */
    private String omGetOrganizationRelationWithUser(Map<String, Object> map) throws Exception {
        returnData = super.getSuccessReturnData(organizationDao.omGetOrganizationByUser((Integer) map.get("userId")));
        return returnData;
    }

    /** 查询所有的组织列表 */
    private List<OMOrganizationData> queryAllOrganization() throws Exception {
        return organizationDao.omGetAllOrganization();
    }

    /**
     * 组装组织数据结构 格式如:[{"id":"","name":"",..."children":[{....}]},{.....},{....},...]
     */
    private OMOrganizationData getCapsulationOrganization(OMOrganizationData root,
            List<OMOrganizationData> organizationList) throws Exception {
        List<OMOrganizationData> children = new ArrayList<OMOrganizationData>();
        for (OMOrganizationData organization : organizationList) {
            setIcon(organization);
            if (organization.getParentId().intValue() == root.getId().intValue()) {
                children.add(organization);
                getCapsulationOrganization(organization, organizationList);
            }
            root.setChildren(children);
        }
        return root;
    }

    /** 设置图标 */
    private OMOrganizationData setIcon(OMOrganizationData organization) throws Exception {
        if (organization.getType() == OMConstant.ORGANIZATION_IDENTIFICATION) {
            organization = setOrganizationIcon(organization);
        }
        else if (organization.getType() == OMConstant.USER_IDENTIFICATION) {
            organization = setUserIcon(organization);
        }
        return organization;
    }

    /** 设置组织图标 */
    private OMOrganizationData setOrganizationIcon(OMOrganizationData organization) throws Exception {
        if (organization.getState() != null) {
            organization.setIconCls(OMConstant.ICON_ORGANIZATION_DOUBLE);
            /**zTree新增 strat**/
            organization.setIconSkin(OMConstant.ICON_ORGANIZATION_DOUBLE);
            organization.setIsParent(true);
            /**zTree新增 end**/
        }
        else {
            organization.setIconCls(OMConstant.ICON_ORGANIZATION_SINGLE);            
            /**zTree新增 strat**/
            organization.setIconSkin(OMConstant.ICON_ORGANIZATION_SINGLE);
            organization.setIsParent(false);
            /**zTree新增 end**/
        }
        return organization;
    }

    /** 设置用户图标 */
    private OMOrganizationData setUserIcon(OMOrganizationData organization) throws Exception {
        organization.setIconCls(OMConstant.ICON_USER);
        /**zTree新增 strat**/
        organization.setIconSkin(OMConstant.ICON_USER);
        /**zTree新增 end**/
        return organization;
    }

    /** 组装搜索结果 */
    private Map<String, Object> getCapsulationSerachResult(Map<String, Object> root, List<Map<String, Object>> maps)
            throws Exception {
        List<Map<String, Object>> children = new ArrayList<Map<String, Object>>();
        for (Map<String, Object> map : maps) {
            if (map.get("parentId").equals(root.get("id"))) {
                children.add(map);
                if (map.get("type").equals(OMConstant.ORGANIZATION_IDENTIFICATION))
                    getCapsulationSerachResult(map, maps);
            }
        }
        root.put("children", children);
        return root;
    }

    /** 根据类型增加组织或用户 */
    private void omAddAccordingType(OMOrganizationData organization) throws Exception {
        if (organization.getType() == OMConstant.ORGANIZATION_IDENTIFICATION) {
            organizationDao.omAddOrganization(organization);
        }
        else if (organization.getType() == OMConstant.USER_IDENTIFICATION) {
            organization.setPassword(StringUtils.encryptString(organization.getPassword()));// MD5加密
            userDao.omAddUser(organization);
            userDao.omAddUserRelationWithOrganization(organization);
        }
    }

    /** 修改组织或用户 */
    private String omUpdateOrganizationOrUser(OMOrganizationData organization) throws Exception {
        if (checkOrganizationIsNull(organization))
            returnData = super.getFailReturnData("组织或用户信息不能为空!");
        if (checkTypeIsNull(organization))
            returnData = super.getFailReturnData("类型不能为空!");
        if (checkTypeIsNotLegal(organization))
            returnData = super.getFailReturnData("无法确定组织或用户!");
        if (checkSuccess(organization)) {
            omUpdateAccordingType(organization);
            returnData = super.getSuccessReturnData(organization.getId());
        }
        return returnData;
    }

    /** 根据类型修改组织或用户 type为0修改组织,为1修改用户 */
    private void omUpdateAccordingType(OMOrganizationData organization) throws Exception {
        if (organization.getType() == OMConstant.ORGANIZATION_IDENTIFICATION) {
            organizationDao.omUpdateOrganization(organization);
        }
        else if (organization.getType() == OMConstant.USER_IDENTIFICATION) {
            userDao.omUpdateUser(organization);
        }
    }

    /**
     * @see com.zjcds.om.service.organization.OMOrganizationService#omGetSubCount(int)
     */
    @SuppressWarnings("unchecked")
    @Override
    public String omGetSubCount(String data) throws Exception {
        if (data != null && data != "") {
            Map<String, Object> params = (Map<String, Object>) JsonUtil.getMapFromJson(data);
            if (params.get("id") != null) {
                int subCount = organizationDao.omGetSubCount((Integer) params.get("id"));
                returnData = super.getSuccessReturnData(subCount);
            }
            else {
                returnData = super.getFailReturnData("组织ID不能为空!");
            }
        }
        else {
            returnData = super.getFailReturnData("需传递参数data!");
        }
        return returnData;
    }

    /***zTree新增 start***/
    @Override
	public String omGetOrganizationZTree(String id) throws Exception {
    	OMOrganizationData organization = new OMOrganizationData();
    	if(id != null && !id.equals("")){
    		organization.setId(super.stringToInt(id));
    	}
    	
    	 // 初始化返回数据
        List<Map<String, Object>> returnData = new ArrayList<Map<String, Object>>();
        getChildrenNodeDataZtree(returnData,organization);
      
		return JSONObject.toJSONString(returnData);
	}
    
    /** 根据组织取得所有子节点数据，放入list中 */
    public String getChildrenNodeDataZtree(List<Map<String, Object>> returnData,OMOrganizationData organization) throws Exception{    	
    	List<OMOrganizationData> organizationList = organizationDao.omGetOrganizationOne(organization);
    	for (OMOrganizationData organizationData : organizationList) {
			if(organizationData.getState() != null){
				getChildrenNodeDataZtree(returnData, organizationData);
			}
		}
    	List<Map<String, Object>> tempList = getCapsulationList(organizationList);
    	for (Map<String, Object> temp : tempList) {
    		returnData.add(temp);
		}
    	getAppendUser(returnData, organization);
    	return null;
    }
 
    @Override 
    public String omGetZTreeAllOrganization() throws Exception{
    	List<OMOrganizationData> organizationList = queryAllOrganization();
    	if (checkOrganizationIsNull(organizationList)){
    		returnData = "[]";
    	}
    	else{
    		getRootNodeBeforeRemoveIt(organizationList);
    		for (OMOrganizationData organization : organizationList) {
    			setIcon(organization);
    		}
    		returnData = JSONArray.toJSONString(organizationList);
    	}
        return returnData;
    }
    
    @Override 
    public String omSerachOrganizationZTree(String data) throws Exception{
    	if(data != null){
    		data = SqlEscapeUtil.sqlWhereEscape2(data);
    	}
    	OMOrganizationData organization = (OMOrganizationData) JsonUtil.getDTO(data, OMOrganizationData.class);   	
    	List<OMOrganizationData> organizationList = null;
    	if(organization == null){
    		organization = new OMOrganizationData();
    	}
        organizationList = organizationDao.omSearchOrgZTree(organization);
        returnData = super.getSuccessReturnData(setReturnDataParse(organizationList));
    	return returnData;
    }
    
    /** 处理返回数据格式 {"returnFlag":"","data":[{"id":"","id":"",...}]} */
    private List<Map<String, Object>> setReturnDataParse(List<OMOrganizationData> organizationList) throws Exception {
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        Map<String, Object> map = null;
        for (OMOrganizationData omOrganization : organizationList) {
            map = new HashMap<String, Object>();
            map.put("id", omOrganization.getId());
            list.add(map);
        }
        return list;
    }
    /***zTree新增 end***/
    
    public OMOrganizationDao getOrganizationDao() {
        return organizationDao;
    }

	public void setOrganizationDao(OMOrganizationDao organizationDao) {
        this.organizationDao = organizationDao;
    }

    public OMUserDao getUserDao() {
        return userDao;
    }

    public void setUserDao(OMUserDao userDao) {
        this.userDao = userDao;
    }

}
