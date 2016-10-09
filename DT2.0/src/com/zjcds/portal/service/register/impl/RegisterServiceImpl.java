package com.zjcds.portal.service.register.impl;

import java.util.HashMap;
import java.util.Map;

import com.zjcds.framework.common.httpconnect.ConnectInfo;
import com.zjcds.framework.common.httpconnect.HttpTools;
import com.zjcds.framework.common.util.StringUtils;
import com.zjcds.portal.config.ConfigManager;
import com.zjcds.portal.service.register.RegisterService;


/**
 * 注册接口实现
 * @author yuzq
 *
 */
public class RegisterServiceImpl implements RegisterService {

    /**
     * @see com.zjcds.portal.service.register.RegisterService#cdtUserRegister(java.lang.String)
     */
    @Override
    public String cdtUserRegister(String data) throws Exception {
            Map<String, String> paras = new HashMap<String, String>();
            paras.put("data", data);
            for (String p : paras.keySet()) {
                paras.put(p, StringUtils.replaceSpecialCharacter(paras.get(p)));
            }
            ConnectInfo con = new ConnectInfo(ConfigManager.getInstance().getSysConfig().getOmServer());
            Map<String, String> mapper = ConfigManager.getInstance().getSysConfig().getOmInterface();
            String json = HttpTools.doGet(con, mapper.get("userRegister"), paras);
            return json;
        }
}
