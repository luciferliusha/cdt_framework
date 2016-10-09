package com.zjcds.portal.action.app;

import org.apache.log4j.Logger;

import com.cds.framework.dao.paging.PageInfo;
import com.zjcds.portal.action.common.FrameworkBaseAction;
import com.zjcds.portal.common.constant.Constant;
import com.zjcds.portal.service.app.AppService;

/**
 * 构件action
 * 
 * @author yuzq
 *@date 2013-2-28
 */
public class AppAction extends FrameworkBaseAction {

    /**
	 * 
	 */
    private static final long serialVersionUID = 1L;

    /** 日志 */
    @SuppressWarnings("unused")
    private static Logger logger = Logger.getLogger(AppAction.class);

    private AppService appService; // service层接口

    private String file; // 构件信息字符串 格式:json

    private Integer appId; // 构件ID

    private String returnData;

    /**
     * 分页用参数
     */
    private Integer page; // 当前页

    private Integer rows; // 每页的行数


    @Override
    public String doExecute() throws Exception {
        return null;
    }

    /**
     * 新增构件
     * 
     * @return
     * @throws Exception
     */
    public String addAppFile() throws Exception {
        returnData = appService.addAppFile(file);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 删除构件
     * 
     * @return
     * @throws Exception
     */
    public String deleteAppFile() throws Exception {
        returnData = appService.deleteAppFile(appId);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 根据ID删除构件目录
     * 
     * @return
     * @throws Exception
     */
    public String deleteAppDir() throws Exception {
        returnData = appService.deleteAppDir(appId);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 修改构件
     * 
     * @return
     * @throws Exception
     */
    public String updateAppFile() throws Exception {
        String returnData = appService.updateAppFile(file);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 根据构件目录ID取得该目录下的构件和子目录
     * 
     * @return
     * @throws Exception
     */
    public String getSubAppInfo() throws Exception {
        if (appId == null)
            appId = Constant.TOP_DIR;
        String json = appService.getSubAppInfo(appId);
        super.writeJson(json);
        return null;
    }

    /**
     * 取得构件树
     * 
     * @return
     * @throws Exception
     */
    public String getAppTree() throws Exception {
        returnData = appService.getAppTree(appId);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 取得构件信息
     * 
     * @return
     * @throws Exception
     */
    public String getAppInfo() throws Exception {
        returnData = appService.getAppInfo(appId);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 构件使用记录
     * @return
     * @throws Exception
     * @author linj created on 2014-2-11 
     * @since CDS Framework 1.0
     */
    public String addAppUsedLog() throws Exception {
        super.writeJson(appService.addAppUsedLog(file));
        return null;
    }
    
    /**
     * 获取构件使用情况列表，组装成easyui表格
     * @return
     * @throws Exception
     * @author linj created on 2014-2-11 
     * @since CDS Framework 1.0
     */
    public String getAppUsedGrid() throws Exception {
        PageInfo pageInfo = new PageInfo();
        if (page != null) {
            pageInfo.setPageNo(page);
        }
        if (rows != null) {
            pageInfo.setPageSize(rows);
        }
        super.writeJson(appService.getAppUsedLogList(pageInfo));
        return null;
    }
    
    /**
     * 获取构件使用情况列表，组装成easyui表格
     * @return
     * @throws Exception
     * @author linj created on 2014-2-11 
     * @since CDS Framework 1.0
     */
    public String getAppUsedPie() throws Exception {
        super.writeJson(appService.getAppUsedLogPie(file));
        return null;
    }

    public AppService getAppService() {
        return appService;
    }

    public void setAppService(AppService appService) {
        this.appService = appService;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public Integer getAppId() {
        return appId;
    }

    public void setAppId(Integer appId) {
        this.appId = appId;
    }

    
    public Integer getPage() {
        return page;
    }

    
    public Integer getRows() {
        return rows;
    }

    
    public void setPage(Integer page) {
        this.page = page;
    }

    
    public void setRows(Integer rows) {
        this.rows = rows;
    }
}
