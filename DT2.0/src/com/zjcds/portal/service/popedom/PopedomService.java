package com.zjcds.portal.service.popedom;

/**
 * 权限接口 调用OM3.0获取
 * 
 * @author yuzq
 * 
 */
public interface PopedomService {

    /**
     * 取得用户权限
     * 
     * @param data
     * @return
     */
    String cdtGetUserPopedom(String data) throws Exception;
}
