package com.zjcds.portal.action.common;

import com.zjcds.framework.action.PortalBaseAction;
import com.zjcds.framework.common.constant.Constants;
import com.zjcds.framework.view.bean.UserPermission;

/**
 * CDT的action基类
 * 
 * @author linj
 * @date 2013-05-21
 */
public class FrameworkBaseAction extends PortalBaseAction {

    /** serialVersionUID */
    private static final long serialVersionUID = 1L;

    @Override
    public String doExecute() throws Exception {
        return null;
    }

    /**
     * 取得用户ID
     * @return
     * @author linj created on 2013-5-21 
     * @since CDT 1.0
     */
    protected String getUserId() {
        UserPermission user = (UserPermission) super.getSessionUser();
        if (user != null) {
            return user.getId();
        }
        return null;
    }
    
    /**
     * 取得用户ID
     * @return
     * @author linj created on 2013-5-21 
     * @since CDT 1.0
     */
    protected String getUserIdByKind() {
        UserPermission user = (UserPermission) super.getSessionUser();
        if (user != null && !Constants.ADMIN_USER.equals(user.getKind())) {//不是管理员
            return user.getId();
        }
        return null;//管理员也返回null，这样可以查询全部
    }
}
