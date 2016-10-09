package com.zjcds.portal.action.platform;

import java.util.List;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

import com.cds.framework.dao.paging.PageInfo;
import com.zjcds.framework.common.constant.Constants;
import com.zjcds.framework.view.bean.Permission;
import com.zjcds.framework.view.bean.UserPermission;
import com.zjcds.portal.action.common.FrameworkBaseAction;
import com.zjcds.portal.common.constant.Constant;
import com.zjcds.portal.config.ConfigManager;
import com.zjcds.portal.service.platform.PlatformService;

/**
 * 平台action
 * 
 * @author yuzq
 * @date 2013-2-28
 * 
 */
public class PlatformAction extends FrameworkBaseAction {

    /**
	 * 
	 */
    private static final long serialVersionUID = 1L;

    /** 日志 */
    private static Logger logger = Logger.getLogger(PlatformAction.class);

    private String file; // 从前端传递过来的平台信息字符串 格式json

    private Integer pfId; // 平台ID

    private PlatformService platformService;

    private String describe; // 描述信息,该解决方案下存放哪些构件

    private String otherUserId;// 其他用户的标识，当系统管理员登录的时候，按照每个用户来排列解决方案

    private String returnData;
    
    private String needSession;//是否需要验证权限和session的超时
    
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
     * 平台点击统计
     * 
     * @author liux 2013-8-7
     * 
     */
    public String setPFClickCount() throws Exception{
    	returnData = platformService.setPFClickCount(pfId);
    	super.writeJson(returnData);
    	return null;
    }

    /**
     * 增加平台
     * 
     * @author yuzq 2013-2-5
     */
    public String addPlatFormFile() throws Exception {
        returnData = platformService.addPlatFormFile(file, describe, super.getUserId());
        super.writeJson(returnData);
        return null;
    }

    /**
     * 删除平台
     * 
     * @author yuzq 2013-2-25
     */
    public String deletePlatFormFile() throws Exception {
        returnData = platformService.deletePlatForm(pfId);
        super.writeJson(returnData);
        return null;
    }

    /** 根据ID修改describe */
    public String updateDescribeById() throws Exception {
        JSONObject json = new JSONObject();
        if (pfId != null) {
            UserPermission user = (UserPermission) super.getSessionUser();
            boolean hasSavePer = platformService.checkPFFile(pfId, user, "save");
            if (!hasSavePer) {// 没有保存权限
                json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_FAIL);
                json.put(Constants.RETURN_DATA, "您没有权限保存!");
            }
            else {
                platformService.updateDescribeById(pfId, describe, super.getUserId());
                json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_SUCCESS);
                json.put(Constants.RETURN_DATA, "ID为:" + pfId + "的解决方案修改成功");
            }
        }
        else {
            json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_FAIL);
            json.put(Constants.RETURN_DATA, "请选择需要修改的解决方案");
        }
        super.writeJson(json.toString());
        return null;
    }

    /**
     * 修改平台
     * 
     * @author yuzq 2013-2-25
     */
    public String updatePlatFormFile() throws Exception {
        returnData = platformService.updatePlatFormFile(file, describe);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 删除平台目录
     * 
     * @author yuzq 2013-2-25
     */
    public String deletePlatFormDir() throws Exception {
        JSONObject json = new JSONObject();
        // 判断目录ID是否为空,为空则返回错误信息;不为空则删除平台目录
        if (pfId != null) {
            platformService.deletePlatFormDir(pfId);
            json.put(Constants.RETURN_FLAG, 0);
            json.put(Constants.RETURN_DATA, "删除成功!");
            logger.info("删除平台目录" + pfId + "成功!");
        }
        else {
            json.put(Constants.RETURN_FLAG, -1);
            json.put(Constants.RETURN_DATA, "请选择需要删除的目录");
        }
        super.writeJson(json.toString());
        return null;
    }

    /**
     * 根据目录ID取得该目录下的登录用户下所有平台和子目录
     * 
     * @author yuzq date 2013-2-27
     * @return
     * @throws Exception
     */
    public String getSubPFInfo() throws Exception {
        if (pfId == null)
            pfId = Constant.TOP_DIR;
        String platformAsResource = ConfigManager.getInstance().getSysConfig().getPlatformAsResource();
        if ("true".equals(platformAsResource)) {
            if ("true".equals(needSession)) {//如果需要验证session
                if (session == null || super.getSessionUser() == null) {
                    super.writeJson(super.getReturnFalse("您未登录或离开系统过久,请重新登录!"));
                    return null;
                }
            }
        	String kind = getKind();
        	List<Permission> permissions = getPermissions();
            returnData = platformService.getPFAccordPermission(kind,permissions, pfId);
        }
        else {
            returnData = platformService.getSubPFInfo(pfId, super.getUserIdByKind(), otherUserId);
        }
        super.writeJson(returnData);
        return null;
    }

    private String getKind() throws Exception{
    	String kind = null;
    	if(session.size() == 0){
    		kind = "1";
    	}else{
    		UserPermission user = (UserPermission) session.get(Constants.SESSION_USER);
    		kind = user.getKind();
    	}
    	return kind;
    }
    
    private List<Permission> getPermissions() throws Exception{
    	if(session.size() == 0){
    		return null;
    	}else{
    		UserPermission user = (UserPermission) session.get(Constants.SESSION_USER);
    		return user.getPermission();
    	}
    }
    /**
     * 根据目录ID取得该目录下的所有平台和子目录
     * 
     * @author linj date 2013-5-20
     * @return
     * @throws Exception
     */
    public String getAllPFInfo() throws Exception {
        // 如果为空,则查询第一级解决方案和解决方案目录
        if (pfId == null)
            pfId = Constant.TOP_DIR;
        returnData = platformService.getSubPFInfo(pfId);
        super.writeJson(returnData);
        return null;
    }

    /**
     * 根据目录ID取得该目录下的所有平台和子目录
     * 
     * @author linj date 2013-5-20
     * @return
     * @throws Exception
     */
    public String operateSharedPF() throws Exception {
        String sharedData = request.getParameter("sharedData");
        JSONObject json = new JSONObject();
        // 判断目录ID是否为空,为空则返回错误信息;不为空则删除平台目录
        if (sharedData != null) {
            platformService.operateSharedPF(sharedData);
            json.put(Constants.RETURN_FLAG, 0);
            json.put(Constants.RETURN_DATA, "分享成功!");
            logger.info("分享解决方案成功!");
        }
        else {
            json.put(Constants.RETURN_FLAG, -1);
            json.put(Constants.RETURN_DATA, "分享解决方案失败：请传递分享的平台信息!");
            logger.error("分享解决方案失败!");
        }
        super.writeJson(json.toString());
        return null;
    }

    /**
     * 根据目录ID取得该目录下的所有平台和子目录
     * 
     * @author linj date 2013-5-20
     * @return
     * @throws Exception
     */
    public String getSharedUsersByPF() throws Exception {
        // 判断目录ID是否为空,为空则返回错误信息;不为空则删除平台目录
        if (pfId != null) {
            String json = platformService.getSharedUsersByPF(pfId);
            super.writeJson(json);
        }
        else {
            JSONObject json = new JSONObject();
            json.put(Constants.RETURN_FLAG, -1);
            json.put(Constants.RETURN_DATA, "请传递解决方案ID!");
            super.writeJson(json.toString());
        }
        return null;
    }

    /**
     * 拖动解决方案排序
     * 
     * @return
     * @throws Exception
     */
    public String cdtPlatFormSort() throws Exception {
        String json = platformService.cdtPlatFormSort(file);
        super.writeJson(json);
        return null;
    }

    /**
     * 取得解决方案组树
     * 
     * @return
     * @throws Exception
     */
    public String getPFDirTree() throws Exception {
        String json = platformService.getPFDirTree();
        super.writeJson(json);
        return null;
    }
    
    /**
     * 取得解决方案组树
     * 
     * @return
     * @throws Exception
     */
    public String getPFTree() throws Exception {
        String json = platformService.getPFTree(getKind(), getPermissions());
        super.writeJson(json);
        return null;
    }

    /**
     * 取得喜好的解决方案
     * 
     * @return
     * @throws Exception
     */
    public String getFavoritePlatForm() throws Exception {
        String json = platformService.getFavoritePlatForm(file);
        super.writeJson(json);
        return null;
    }
    
    /**
     * 递归取得其喜好的解决方案及其所有的父解决方案,为了导航栏的展现
     * 
     * @return
     * @throws Exception
     */
    public String getFavPlatFormList() throws Exception {
        String json = platformService.getFavPlatFormList(file);
        super.writeJson(json);
        return null;
    }
    
    /**
     * 保存喜好的解决方案
     * 
     * @return
     * @throws Exception
     */
    public String saveFavoritePlatForm() throws Exception {
        String json = platformService.saveFavoritePlatForm(file);
        super.writeJson(json);
        return null;
    }
    
    /**
     * 保存解决方案访问日子记录
     * 
     * @return
     * @throws Exception
     */
    public String savePlatFormLog() throws Exception {
        String json = platformService.savePlatFormLog(file);
        super.writeJson(json);
        return null;
    }
    
    /**
     * 获取解决方案访问日志(组装成easyui)
     * 
     * @return
     * @throws Exception
     */
    public String getPlatFormLog() throws Exception {
        PageInfo pageInfo = new PageInfo();
        if (page != null) {
            pageInfo.setPageNo(page);
        }
        if (rows != null) {
            pageInfo.setPageSize(rows);
        }
        String json = platformService.getPlatFormLog(file, pageInfo);
        super.writeJson(json);
        return null;
    }
    
    /**
     * 获取解决方案访问日志次数统计(组装成饼图)
     * 
     * @return
     * @throws Exception
     */
    public String getPlatFormLogNum() throws Exception {
        String json = platformService.getPlatFormLogNum(file, describe);
        super.writeJson(json);
        return null;
    }
    
    /**
     * 获取解决方案全部子目录
     * 
     * @return
     * @throws Exception
     */
    public String getPlatMenus() throws Exception {
        String kind = getKind();
        List<Permission> permissions = getPermissions();
        String json = platformService.getPlatMenus(kind, permissions);
        super.writeJson(json);
        return null;
    }
    
    /**
     * 获取第一层解决方案组和解决方案
     * 
     * @return
     * @throws Exception
     */
    public String getPlatMenu() throws Exception {
        String kind = getKind();
        List<Permission> permissions = getPermissions();
        String json = platformService.getPlatMenu(kind, permissions);
        super.writeJson(json);
        return null;
    }
    
    /**
     * 获取第一层解决方案组和解决方案
     * 
     * @return
     * @throws Exception
     */
    public String getPlatFormParentIdByName() throws Exception {
    	String json = platformService.getPlatFormParentIdByName(file);
        super.writeJson(json);
        return null;
    }
    
    /**
     * setter getter方法
     * 
     * @author yuzq 2013-2-25
     * @return
     */
    public PlatformService getPlatformService() {
        return platformService;
    }

    public void setPlatformService(PlatformService platformService) {
        this.platformService = platformService;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public Integer getPfId() {
        return pfId;
    }

    public void setPfId(Integer pfId) {
        this.pfId = pfId;
    }

    public String getDescribe() {
        return describe;
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

    public void setDescribe(String describe) {
        this.describe = describe;
    }

    public String getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(String otherUserId) {
        this.otherUserId = otherUserId;
    }

    
    public String getNeedSession() {
        return needSession;
    }

    
    public void setNeedSession(String needSession) {
        this.needSession = needSession;
    }
}
