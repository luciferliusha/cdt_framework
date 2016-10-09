package com.zjcds.portal.service.platform;

import java.util.List;

import com.cds.framework.dao.paging.PageInfo;
import com.zjcds.framework.view.bean.Permission;
import com.zjcds.framework.view.bean.UserPermission;

/**
 * 操作平台接口,被Action层调用
 * 
 * @author yuzq date 2013-01-31
 * 
 */
public interface PlatformService {

    /**
     * 增加平台
     * 
     * @param platform 平台对象
     * @return 状态
     */
    String addPlatFormFile(String file, String describe, String userId) throws Exception;

    /**
     * 修改平台
     * 
     * @param platform平台
     * @return
     */
    String updatePlatFormFile(String file, String describe) throws Exception;

    /**
     * 删除平台
     * 
     * @param platform删除平台
     * @return
     */
    String deletePlatForm(Integer pfId) throws Exception;

    /**
     * 根据解决方案目录取得登录用户下的该目录下的解决方案
     * 
     * @param pfId 平台目录ID
     * @param userId 用户ID
     * @param otherUserId 其他用户ID
     * @return
     * @throws Exception
     * @author linj created on 2013-5-20
     * @since OM 1.0
     */
    String getSubPFInfo(int pfId, String userId, String otherUserId) throws Exception;

    /**
     * 根据目录ID取得该目录下的所有平台和子目录
     * 
     * @param dirId
     * @return
     */
    String getSubPFInfo(int pfId) throws Exception;

    /**
     * 根据权限取得解决方案
     * 
     * @return
     * @throws Exception
     */
    String getPFAccordPermission(String kind, List<Permission> permissions,int pfId) throws Exception;

    /**
     * 根据平台ID,用户id判断是否为用户自己的平台,然后再判断是否有权限进行操作
     * 
     * @param pfId
     * @param user
     * @return
     * @author Administrator created on 2013-5-22
     * @since CDS Framework 1.0
     */
    public boolean checkPFFile(int pfId, UserPermission user, String resourceName) throws Exception;

    /**
     * 根据ID修改describe
     * 
     * @param pfId
     * @param describe
     * @throws Exception
     */
    void updateDescribeById(int pfId, String describe, String userId) throws Exception;

    /**
     * 分享的解决方案的操作
     * 
     * @param sharedData
     * @author linj created on 2013-5-21
     * @since CDS Framework 1.0
     */
    public void operateSharedPF(String sharedData) throws Exception;

    /**
     * 根据解决方案取得该解决方案所分享的用户列表
     * 
     * @param pfId 解决方案ID
     * @return
     * @author linj created on 2013-5-24
     * @since CDT 1.0
     */
    String getSharedUsersByPF(int pfId) throws Exception;

    /**
     * 删除平台目录
     * 
     * @param dirId 目录ID
     * @return 状态
     */
    int deletePlatFormDir(int pfId) throws Exception;

    /**
     * 拖动解决方案排序
     * 
     * @param data
     * @return
     * @throws Exception
     */
    String cdtPlatFormSort(String file) throws Exception;

    /**
     * 平台点击统计
     * 
     * @param pfId
     * @return
     * @throws Exception
     */
	String setPFClickCount(int pfId) throws Exception;

	/**
	 * 取得解决方案组树
	 * @return
	 * @throws Exception
	 * @author linj created on 2014-2-12 
	 * @since CDS Framework 1.0
	 */
	String getPFDirTree() throws Exception;

	/**
	 * 取得解决方案整个树
	 * @return
	 * @throws Exception
	 * @author linj created on 2014-2-25 
	 * @since CDS Framework 1.0
	 */
	public String getPFTree(String kind, List<Permission> permissions) throws Exception ;
	
	/**
     * 取得解决方案喜好
     * @return
     * @throws Exception
     * @author linj created on 2014-2-12 
     * @since CDS Framework 1.0
     */
    String getFavoritePlatForm(String data) throws Exception;

    /**
     * 递归取得其所有的父解决方案,为了导航栏的展现
     * @param data
     * @return
     * @throws Exception
     * @author linj created on 2014-2-26 
     * @since CDS Framework 1.0
     */
    String getFavPlatFormList(String data) throws Exception;
    
    /**
     * 保存解决方案喜好
     * @return
     * @throws Exception
     * @author linj created on 2014-2-12 
     * @since CDS Framework 1.0
     */
    String saveFavoritePlatForm(String data) throws Exception;

    /**
     * 保存解决方案访问日志
     * @param data
     * @return
     * @throws Exception
     * @author linj created on 2014-2-26 
     * @since CDS Framework 1.0
     */
    String savePlatFormLog(String data) throws Exception;

    /**
     * 获取解决方案访问日志(组装成easyui)
     * @param data
     * @return
     * @throws Exception
     * @author Administrator created on 2014-2-26 
     * @since CDS Framework 1.0
     */
    String getPlatFormLog(String data, PageInfo pageInfo) throws Exception;

    /**
     * 获取解决方案访问日志次数统计(组装成饼图)
     * @param data
     * @param pieData
     * @return
     * @throws Exception
     * @author linj created on 2014-2-26 
     * @since CDS Framework 1.0
     */
    public String getPlatFormLogNum(String data, String pieData) throws Exception;
    
    /**
     * 获取全部解决方案名称和父级ID
     * @return
     * @throws Exception
     * @author majj created on 2014-4-14 
     * @since CDS Framework 1.0
     */
    public String getPlatMenus(String kind, List<Permission> permissions) throws Exception;
    
    /**
     * 获取第一层解决方案组和解决方案的名称和父级ID
     * @return
     * @throws Exception
     * @author majj created on 2014-4-14 
     * @since CDS Framework 1.0
     */
    public String getPlatMenu(String kind, List<Permission> permissions) throws Exception;
    
    /**
     * 根据解决方案名称获取父级ID
     * @return
     * @throws Exception
     * @author majj created on 2014-4-14 
     * @since CDS Framework 1.0
     */
    public String getPlatFormParentIdByName(String data) throws Exception;

}
