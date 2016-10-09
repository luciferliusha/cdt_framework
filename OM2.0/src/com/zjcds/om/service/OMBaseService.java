package com.zjcds.om.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import com.zjcds.framework.common.constant.Constants;
import com.zjcds.framework.common.util.JsonUtil;
import com.zjcds.om.view.bean.AwardInfo;

/**
 * 服务基类
 * 
 * @author yuzq
 * 
 */
public abstract class OMBaseService {

    private JSONObject json = new JSONObject();

    /** 返回数据 */
    protected String returnData = null;

    /** 操作成功是返回的数据 */
    protected final String getSuccessReturnData(Object data) {
        json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_SUCCESS);
        json.put(Constants.RETURN_DATA, data);
        return json.toString();
    }

    /** 操作失败时返回的数据 */
    protected final String getFailReturnData(String errorMsg) {
        json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_FAIL);
        json.put(Constants.RETURN_DATA, errorMsg);
        return json.toString();
    }

    /** 将字符串转换为整形 */
    protected final int stringToInt(String str) {
        int result = Integer.parseInt(str);
        return result;
    }

    /** 将字符串转化为AwardInfo对象 */
    protected final AwardInfo stringToAwardInfo(String data) throws Exception {
        Map<String, Class<AwardInfo>> classMap = new HashMap<String, Class<AwardInfo>>();
        classMap.put("value", AwardInfo.class);
        AwardInfo resourceInfo = (AwardInfo) JsonUtil.getDTO(data, AwardInfo.class, classMap);
        return resourceInfo;
    }
    /** 增加操作 */
    protected final boolean TypeIsAdd(String type) throws Exception {
        return type.equals("add") || "add".equals(type);
    }

    /** 删除操作 */
    protected final boolean TypeIsDelete(String type) throws Exception {
        return type.equals("delete") || "delete".equals(type);
    }

    /** 修改操作 */
    protected final boolean TypeIsUpdate(String type) throws Exception {
        return type.equals("update") || "update".equals(type);
    }

    /**错误类型*/
    @SuppressWarnings("unchecked")
    protected final boolean TypeIsError(String type) throws Exception {
        List typeList = Arrays.asList(new String[] { "add", "update", "delete" });
        return !typeList.contains(type);
    }
}
