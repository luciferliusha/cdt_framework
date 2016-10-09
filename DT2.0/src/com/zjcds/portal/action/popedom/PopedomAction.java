package com.zjcds.portal.action.popedom;

import java.util.HashMap;
import java.util.Map;

import com.zjcds.framework.common.constant.Constants;
import com.zjcds.framework.common.util.JsonUtil;
import com.zjcds.framework.common.util.ReturnInfoUtil;
import com.zjcds.framework.view.bean.UserPermission;
import com.zjcds.portal.action.common.FrameworkBaseAction;
import com.zjcds.portal.common.constant.Constant;
import com.zjcds.portal.service.popedom.PopedomService;

/**
 * 权限动作类
 * 
 * @author yuzq
 * 
 */
public class PopedomAction extends FrameworkBaseAction {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private String data;// 前端参数

    private PopedomService popedomService;

    @Override
    public String doExecute() throws Exception {
        return null;
    }

    /**
     * 取得用户权限
     * 
     * @param data
     * @return
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
	public String getUserPopedom() throws Exception {
        String returnData = popedomService.cdtGetUserPopedom(data);
        Map<String,Object> map = (Map<String, Object>) JsonUtil.getMapFromJson(returnData);
        UserPermission user = (UserPermission)session.get(Constants.SESSION_USER);
        if(user == null){
        	user = new UserPermission();
        	user.setKind("1");
        }
        map.put("kind", user.getKind());
        returnData = JsonUtil.getJSONString(map);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 获取用户权限，从session来
     * @return
     * @throws Exception
     * @author Administrator created on 2014-2-25 
     * @since CDS Framework 1.0
     */
    public String getUserRight() throws Exception {
        Map<String,Object> map = new HashMap<String, Object>();
        UserPermission user = (UserPermission)session.get(Constants.SESSION_USER);
        if(user == null){
            map.put("kind", Constants.ADMIN_USER);
            map.put("userId", Constant.ADMIN_USER_ID);
        }
        else {
            map.put("kind", user.getKind());
            map.put("xzqhdm", user.getXzqhdm());
            map.put("userId", user.getId());
            map.put("userAcct", user.getLoginName());
            map.put("right", user.getPermission());
        }
        super.writeJson(ReturnInfoUtil.getSuccessReturnData(JsonUtil.getJSONString(map)));
        return null;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public PopedomService getPopedomService() {
        return popedomService;
    }

    public void setPopedomService(PopedomService popedomService) {
        this.popedomService = popedomService;
    }

}
