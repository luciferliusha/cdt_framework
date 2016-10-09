package com.zjcds.portal.mybatis.dao;

import java.util.List;
import java.util.Map;

import com.cds.framework.dao.paging.PageInfo;
import com.zjcds.portal.mybatis.bean.Platform;
import com.zjcds.portal.mybatis.bean.PlatformFav;
import com.zjcds.portal.mybatis.bean.PlatformHot;
import com.zjcds.portal.mybatis.bean.PlatformLog;
import com.zjcds.portal.mybatis.bean.TreeBean;

/**
 * 操作平台的接口,被service层调用
 * 
 * @author yuzq date 2013-01-31
 * 
 */
public interface PlatformDao {

    /**
     * 增加平台
     * 
     * @param platform 平台对象
     * @return 状态
     */
    int addPlatFormFile(Platform platform);

    /**
     * 新增平台时，根据该平台下所在位置的最大排序
     * @param platform
     * @return
     * @author linj created on 2014-2-13 
     * @since CDS Framework 1.0
     */
    int getMaxOrderBy(Platform platform);

    /**
     * 修改平台
     * 
     * @param platform修改平台
     * @return
     */
    int updatePlatFormFile(Platform platform);

    /**
     * 删除平台
     * 
     * @param platform平台
     * @return
     */
    int deletePlatFormFile(int pfId);

    /**
     * 删除分享的平台记录
     * @param pfId
     * @return
     * @author linj created on 2013-5-21 
     * @since CDT Framework 1.0
     */
    int deleteSharedPlatForm(int pfId);

    /**
     * 根据解决方案目录ID取得该目录下的解决方案
     * 
     * @param pfId 目录ID
     * @return
     */
    List<Platform> getSubPFFile(int pfId);

    /**
     * 取得该平台目录下的平台文件的个数
     * 
     * @param dirId 目录ID
     * @return 平台文件的个数
     */
    int getPFFileCount(String dirId);

    /**
     * 根据解决方案目录ID取得下一级目录
     * 
     * @date 2013-4-9
     * @param pfId
     * @return
     */
    //List<Platform> getSubPFDir(int pfId);

    /**
     * 取得解决方案目录下的目录和解决方案
     * 
     * @param pfId
     * @return
     */
    List<Platform> getSubPFInfo(int pfId);
    
    /**
     * 根据目录ID取得下一级目录和解决方案的总数目
     * 
     * @param pfId
     * @return
     */
    int getSubPFInfoCount(int pfId);
    
    /**
     * 取得解决方案目录下的属于当前用户的目录和解决方案
     * 
     * @param pfId
     * @return
     */
    List<Platform> getUserSubPFInfo(Map<String, Object> map);
    
    /**
     * 取得解决方案目录下的属于系统管理员的目录和解决方案
     * 
     * @param pfId
     * @return
     */
    List<Platform> getAdminSubPFInfo(Map<String, Object> map);
    
    /**
     * 根据目录ID取得该用户下的下一级目录和解决方案的总数目
     * 
     * @param pfId
     * @return
     */
    int getUserSubPFInfoCount(Map<String, Object> map);

    /**
     * 查询分享给该用户的解决方案
     * @param userId
     * @return
     * @author linj created on 2013-5-21 
     * @since CDT 1.0
     */
    List<Platform> getSharedPFInfo(String userId);
    
    /**
     * 查询分享给该用户的解决方案的个数
     * @param userId 用户ID
     * @return
     * @author linj created on 2013-5-21 
     * @since CDT 1.0
     */
    int getSharedPFCount(String userId);

    /**
     * 分享解决方案的操作（新增、删除）
     * @param list
     * @author linj created on 2013-5-21 
     * @since CDT Framework 1.0
     */
    void operateSharedPF(Map<String, Object> map);

    /**
     * 根据解决方案取得该解决方案所分享的用户列表
     * @param pfId 解决方案ID
     * @return
     * @author linj created on 2013-5-24 
     * @since CDT 1.0
     */
    List<Map<String, String>> getSharedUsersByPF(int pfId);
    
    /**
     * 获取系统管理员以外的其他用户的解决方案的所属用户列表
     * @return
     * @author linj created on 2013-5-24 
     * @since CDT 1.0
     */
    List<String> getAllOtherUserPF();

    /**
     * 根据ID修改describe
     * 
     * @param pfId
     * @param describe
     */
    void updateDescribeById(Platform platform);

    /**
     * 根据平台ID,用户id判断是否为用户自己的平台
     * @param map
     * @return
     * @author Administrator created on 2013-5-22 
     * @since CDS Framework 1.0
     */
    int checkPFFile(Map<String, Object> map);

    /**
     * 取得所有解决方案
     * @return
     */
    List<Platform> getAllPF();
    
    /**
     * 获取解决方案热度信息
     * @param pfId
     * @return PlatformHot
     */
	PlatformHot findPlatformHot(int pfId);
	
	/**
	 * 更新解决方案热度信息
	 * @param platformHot
	 */
	void updatePlatformHot(PlatformHot platformHot);
	
	/**
	 * 增加解决方案热度信息
	 * @param platformHot
	 */
	void insertPlatformHot(PlatformHot platformHot);
	
	/**
	 * 增加解决方案热度信息
	 * @param pfId
	 */
	void deletePlatformHot(int pfId);

	/**
	 * 取得解决方案组树
	 * @param bean
	 * @return
	 * @author linj created on 2014-2-12 
	 * @since CDS Framework 1.0
	 */
	List<TreeBean> getPFDirTree(TreeBean bean);

	/**
	 * 取得解决方案整个树
	 * @param bean
	 * @return
	 * @author linj created on 2014-2-25 
	 * @since CDS Framework 1.0
	 */
	List<TreeBean> getPFTree(TreeBean bean);

	/**
	 * 获取用户喜好的解决方案
	 * @param pfFav 用户标识userKey
	 * @return
	 * @author Administrator created on 2014-2-24 
	 * @since CDS Framework 1.0
	 */
	List<PlatformFav> getFavoritePlatForm(PlatformFav pfFav);
	
	/**
     * 递归取得其所有的父解决方案,为了导航栏的展现
     * @param pfFav 用户标识userKey
     * @return
     * @author Administrator created on 2014-2-24 
     * @since CDS Framework 1.0
     */
    List<PlatformFav> getFavPlatFormList(PlatformFav pfFav);

	/**
	 * 保存用户喜好的解决方案
	 * @param pfFav 用户标识userKey,解决方案pfId
	 * @author Administrator created on 2014-2-24 
	 * @since CDS Framework 1.0
	 */
	void saveFavoritePlatForm(PlatformFav pfFav);

	/**
	 * 删除用户喜好的解决方案
	 * @param pfFav
	 * @author Administrator created on 2014-2-24 
	 * @since CDS Framework 1.0
	 */
	void deleteFavoritePlatForm(PlatformFav pfFav);
	
	/**
     * 根据解决方案ID删除用户喜好的解决方案
     * @param pfFav
     * @author Administrator created on 2014-2-24 
     * @since CDS Framework 1.0
     */
    void deleteFavoriteByPfId(int pfId);

    /**
     * 新增解决方案日志记录
     * @param platformLog
     * @author linj created on 2014-2-26 
     * @since CDS Framework 1.0
     */
    void savePlatFormLog(PlatformLog platformLog);

    /**
     * 根据解决方案ID删除解决方案日志（删除解决方案级联删除）
     * @param pfId
     * @author linj created on 2014-2-26 
     * @since CDS Framework 1.0
     */
    void deletePFLogByPfId(int pfId);

    /**
     * 获取解决方案访问日志
     * @param platformLog
     * @return
     * @author linj created on 2014-2-26 
     * @since CDS Framework 1.0
     */
    List<PlatformLog> getPlatFormLog(PlatformLog platformLog, PageInfo pageInfo);

    /**
     * 获取解决方案访问日志的统计
     * @param platformLog
     * @return
     * @author Administrator created on 2014-2-26 
     * @since CDS Framework 1.0
     */
    List<PlatformLog> getPlatFormLogNum(PlatformLog platformLog);
    
    /**
     * 获取解决方案全部子目录
     * @return
     * @author majj created on 2014-4-14 
     * @since CDS Framework 1.0
     */
    List<Map<String, Object>> getPlatFormMenus();
    
    /**
     * 获取第一层解决方案组和解决方案
     * @return
     * @author majj created on 2014-4-14 
     * @since CDS Framework 1.0
     */
    List<Map<String, Object>> getPlatFormMenu();
    
    /**
     * 获取解决方案父目录
     * @return
     * @author majj created on 2014-4-14 
     * @since CDS Framework 1.0
     */
    List<Map<String, Object>> getPlatFormMenusParentId(Map<String, Object> map);
    
    /**
     * 根据解决方案名称获取解决方案父目录
     * @return
     * @author linj created on 2014-12-15 
     * @since CDS Framework 1.0
     */
    List<Map<String, Object>> getPlatFormParentIdByName(Map<String, Object> map);

    // /**
    // * 根据关键字搜索平台
    // *
    // * @param key 关键字
    // * @return
    // */
    // List<Platform> searchPlatForm(String key);


}
