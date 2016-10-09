package com.zjcds.portal.service;

import java.util.List;

import net.sf.json.JSONObject;

import com.alibaba.fastjson.JSON;
import com.zjcds.framework.common.constant.Constants;

public abstract class CDTBaseService {

    protected String returnData = null;

    /** 操作成功时返回的数据 */
    protected final String getSuccessReturnData(Object data) throws Exception {
        JSONObject json = new JSONObject();
        json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_SUCCESS);
        json.put(Constants.RETURN_DATA, data);
        return json.toString();
    }

    /** 操作失败是返回的数据 */
    protected final String getFailReturnData(String errorMsg) throws Exception {
        JSONObject json = new JSONObject();
        json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_FAIL);
        json.put(Constants.RETURN_DATA, errorMsg);
        return json.toString();
    }
    
    /**
     * 组装成easyui格式
     * @param tableDataList 结果集
     * @param totalSize 总条数 
     * @param dateFormat 结果集是否要根据日期格式化的日期格式化
     * @return 组装成easyui格式的数据
     * @throws Exception
     * @author linj created on 2014-1-10 
     * @since CDS Framework 1.0
     */
    public String makeEasyUiData(List<?> tableDataList, int totalSize, String dateFormat) throws Exception {
        JSONObject json = new JSONObject();
        json.put("total", totalSize);
        if (dateFormat != null && !dateFormat.isEmpty()) {
            json.put("rows", JSON.toJSONStringWithDateFormat(tableDataList, dateFormat));
        }
        else {
            json.put("rows", tableDataList);
        }
        return json.toString();
    }
}
