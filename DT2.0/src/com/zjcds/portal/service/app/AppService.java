package com.zjcds.portal.service.app;

import com.cds.framework.dao.paging.PageInfo;

/**
 * 构件接口
 * 
 * @author yuzq 2013-2-26
 * 
 */
public interface AppService {

    /**
     * 新增构件
     * 
     * @param file 构件信息字符串 格式:json
     * @return 状态信息
     */
    String addAppFile(String file) throws Exception;

    /**
     * 删除构件
     * 
     * @param fileId 构件ID
     * @return
     */
    String deleteAppFile(Integer appId) throws Exception;

    /**
     * 修改构件
     * 
     * @param file 构件信息字符串 格式:json
     * @return
     */
    String updateAppFile(String file) throws Exception;

    /**
     * 根据ID删除构件目录
     * 
     * @param dirId
     * @return
     */
    String deleteAppDir(Integer appId) throws Exception;

    /**
     * 根据构件目录取得该目录下的构件和子目录
     * 
     * @param dirId
     * @return
     */
    String getSubAppInfo(Integer appId) throws Exception;

    /**
     * 取得构件树
     * 
     * @return
     * @throws Exception
     */
    String getAppTree(Integer appId) throws Exception;

    /**
     * 取得构件信息
     * 
     * @param appId
     * @return
     * @throws Exception
     */
    String getAppInfo(Integer appId) throws Exception;

    /**
     * 添加构件使用记录
     * @param data 构件ID
     * @return
     * @throws Exception
     * @author linj created on 2014-2-11 
     * @since CDS Framework 1.0
     */
    String addAppUsedLog(String data) throws Exception;

    /**
     * 获取构件使用情况列表，组装成easyui表格
     * @param pageInfo 分页信息
     * @return
     * @throws Exception
     * @author linj created on 2014-2-11 
     * @since CDS Framework 1.0
     */
    String getAppUsedLogList(PageInfo pageInfo) throws Exception;
    
    /**
     * 获取构件使用情况饼图数据
     * @return
     * @throws Exception
     * @author linj created on 2014-2-11 
     * @since CDS Framework 1.0
     */
    String getAppUsedLogPie(String pieData) throws Exception;
   
}
