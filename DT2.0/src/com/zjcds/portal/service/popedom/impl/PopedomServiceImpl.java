package com.zjcds.portal.service.popedom.impl;

import java.util.HashMap;
import java.util.Map;

import com.zjcds.framework.common.httpconnect.ConnectInfo;
import com.zjcds.framework.common.httpconnect.HttpTools;
import com.zjcds.portal.config.ConfigManager;
import com.zjcds.portal.service.popedom.PopedomService;

public class PopedomServiceImpl implements PopedomService {

    /**
     * @see com.zjcds.portal.service.popedom.PopedomService#cdtGetUserPopedom(java.lang.String)
     */
    @Override
    public String cdtGetUserPopedom(String data) throws Exception {
        Map<String, String> paras = new HashMap<String, String>();
        paras.put("data", data);
        ConnectInfo con = new ConnectInfo(ConfigManager.getInstance().getSysConfig().getOmServer());
        Map<String, String> mapper = ConfigManager.getInstance().getSysConfig().getOmInterface();
        String json = HttpTools.doGet(con, mapper.get("userPopedom"), paras);
        return json;
    }

}
