package com.zjcds.portal.service.login;

import java.util.Map;

/**
 * 登录Service接口
 * 
 * @author linj
 * 
 */
public interface LoginService {

    /**
     * 同传递的URL服务调用登录
     * 
     * @param url 调用登录URL地址
     * @param paras 参数
     * @param session httpSession
     * @return 返回登录成功失败的标识
     */
    public String login(Map<?, ?> paras, Map<?, ?> session);

    /**
     * 注销操作
     * 
     * @param paras 参数
     */
    public void logout(Map<?, ?> paras);
    
    /**
     * 注册用户
     * 
     * @param paras 参数
     */
    public String register(Map<?, ?> paras);

    /**
     * 取得分享用户列表
     * @param userId 当前登录的用户ID
     * @return
     * @author linj created on 2013-5-23 
     * @since CDT 1.0
     */
    public String getShareUserList(String userId) throws Exception;
    
    /**
     * 检查licence是否过期
     * 
     * @param userId
     * @return
     * @throws Exception
     * @author majj created on 2014-5-20 
     * @since CDS Framework 1.0
     */
    public String checkLicence() throws Exception;
}