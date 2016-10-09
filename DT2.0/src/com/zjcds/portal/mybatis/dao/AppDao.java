package com.zjcds.portal.mybatis.dao;

import java.util.List;
import java.util.Map;

import com.cds.framework.dao.paging.PageInfo;
import com.zjcds.portal.mybatis.bean.App;
import com.zjcds.portal.mybatis.bean.AppHot;

/**
 * 构件接口 Dao层
 * 
 * @author yuzq 2013-2-26
 * 
 */
public interface AppDao {

    /**
     * 根据构件目录ID取得该目录下的构件
     * 
     * @param dirId
     * @return
     */
    List<App> getSubAppFile(int appId);

    /**
     * 新增构件
     * 
     * @param app
     */
    void addAppFile(App app);

    /**
     * 删除构件
     * 
     * @param fileId 构件ID
     */
    void deleteAppFile(int appId);

    /**
     * 修改构件
     * 
     * @param app 构建信息字符串 格式:json
     */
    void updateAppFile(App app);

    /**
     * 获取构件目录下的构件数量
     * 
     * @param dirId
     * @return
     */
    int getSubAppFileCount(String dirId);

    /**
     * 根据构件目录ID取得该目录下的下一级构件目录
     * 
     * @return
     */
    List<App> getSubAppDir(int appId);

    /**
     * 根据构件目录ID取得下一级目录和构件
     * 
     * @param appId
     * @return
     */
    List<App> getSubAppInfo(int appId);

    /**
     * 根据目录ID取得下一级目录和构件总数目
     * 
     * @param appId
     * @return
     */
    int getSubAppInfoCount(int appId);

    /**
     * 取得构件树结构数据
     * 
     * @param appId
     * @return
     */
    List<Map<String, Object>> getAppTree(int appId);

    /**
     * 取得构件信息
     * 
     * @param appId
     * @return
     */
    App getAppInfo(int appId);
    
    /**
     * 新增构件使用次数
     * 
     * @param appHot
     */
    void addAppHot(AppHot appHot);

    /**
     * 根据APPID删除APP的使用记录
     * @param appHot
     * @author linj created on 2014-2-11 
     * @since CDS Framework 1.0
     */
    void deleteAppHot(int appId);
    
    /**
     * 更新构件使用次数
     * 
     * @param appHot
     */
    void updateAppHot(AppHot appHot);
    
    /**
     * 累加更新构件使用次数
     * 
     * @param appHot
     */
    void addUpAppHot(AppHot appHot);

    /**
     * 根据appId查找AppHot
     * @param appHot
     * @return
     * @author linj created on 2014-2-11 
     * @since CDS Framework 1.0
     */
    AppHot getAppHotByAppId(AppHot appHot);
    
    /**
     * 构件使用情况列表
     * @return
     * @author linj created on 2014-2-11 
     * @since CDS Framework 1.0
     */
    List<AppHot> getAppHotList();
    
    /**
     * 分页获取构件使用情况列表
     * @return
     * @author linj created on 2014-2-11 
     * @since CDS Framework 1.0
     */
    List<AppHot> getAppHotList(PageInfo pageInfo);
}
