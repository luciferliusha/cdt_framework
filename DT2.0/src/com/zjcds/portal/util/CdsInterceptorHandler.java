/*
 * 文件名称: CdsInterceptorHandler.java
 * 版权信息: Copyright 2001-2014 ZheJiang Collaboration Data System Co., LTD. All right reserved.
 * ----------------------------------------------------------------------------------------------
 * 修改历史:
 * ----------------------------------------------------------------------------------------------
 * 修改原因: 新增
 * 修改人员: linj
 * 修改日期: 2014-1-9
 * 修改内容: 
 */
package com.zjcds.portal.util;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.StrutsStatics;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

/**
 * action异常捕获拦截器
 * @author linj created on 2014-1-9
 * @since CDS Framework 1.0
 */
public class CdsInterceptorHandler extends AbstractInterceptor {

    /**  */
    private static final long serialVersionUID = 1L;

    /**
     * (non-Javadoc)
     * 
     * @see com.opensymphony.xwork2.interceptor.AbstractInterceptor#intercept(com.opensymphony.xwork2.ActionInvocation)
     */
    @Override
    public String intercept(ActionInvocation arg0) throws Exception {
        try {
            arg0.invoke();
        }
        catch (Exception e) {
            String actionName = arg0.getAction().getClass().getName();
            HttpServletResponse response = (HttpServletResponse) arg0.getInvocationContext().get(StrutsStatics.HTTP_RESPONSE);
            response.setContentType("text/html;charset=utf-8");
            if ("com.zjcds.portal.action.icons.IconsAction".equals(actionName)) {//图标库上传
                response.getWriter().print("<script>parent.iconManageView.uploadFileErrorCallBack('上传失败：图片大小超出1M!');</script>");
                response.getWriter().close();
            }
            else if ("com.zjcds.portal.action.pics.PicsAction".equals(actionName)) {//图片库
            	response.getWriter().print("<script>parent.picManageView.uploadFileErrorCallBack('上传失败：图片大小超出2M!');</script>");
                response.getWriter().close();
            }
            else if ("com.zjcds.portal.action.setting.SettingAction".equals(actionName)) {//
            	response.getWriter().print("<script>parent.settingView.uploadFileErrorCallBack('上传失败：仅支持小于2M的JPG、JPEG、GIF、PNG格式文件!');</script>");
                response.getWriter().close();
            }
        }
        return null;
    }

}
