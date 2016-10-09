package com.zjcds.portal.action.login;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

import com.zjcds.framework.common.constant.Constants;
import com.zjcds.framework.common.util.LicenceUtil;
import com.zjcds.framework.common.util.StringUtils;
import com.zjcds.framework.view.bean.Permission;
import com.zjcds.framework.view.bean.UserPermission;
import com.zjcds.portal.action.common.FrameworkBaseAction;
import com.zjcds.portal.common.constant.Constant;
import com.zjcds.portal.config.ConfigManager;
import com.zjcds.portal.service.login.LoginService;
import com.zjcds.portal.service.user.UserRoleService;

/**
 * @author Administrator
 * 
 */
public class LoginAction extends FrameworkBaseAction {

	private static final long serialVersionUID = 1L;
	
	/** 日志 */
    private static Logger logger = Logger.getLogger(LoginAction.class);

	private String loginName;

	private String pwd;
	//wangwenliang add 2015-09-15 start
	private UserRoleService userRoleService;
	
	private String rolename;
    //wangwenliang add 2015-09-15 end
	private String isClient;//是否客户端，客户端则不跳转页面，返回成功/是否的json数据

	private String errorInfo;
	
	private String selectedId;//登录后选中的平台解决方案ID
	
	private String userName;//登录后显示的用户

	private LoginService loginService;
	
	//注册信息
	private String signinName;//用户名
	private String mailbox;//邮箱
	private String signinpwd;//密码

	/**
	 * 登录
	 * @return
	 * @throws Exception
	 */
	public String login() throws Exception {
		String returnInfos;
		HashMap<String, String> map = new HashMap<String, String>();
		//wangwenliang add 2015-09-15 start
		Map userMap=userRoleService.getUserInfoByRoleNmae(rolename);
		if(rolename!=null&&!"".equals(rolename)){
			loginName=(String) userMap.get("EMAIL");
			pwd="sys123456";//此处将密码设定成固定的
		}
		
		//wangwenliang add 2015-09-15 end
		map.put("loginName", StringUtils.replaceSpecialCharacter(loginName));
		map.put("pwd", StringUtils.replaceSpecialCharacter(pwd));
		
		if(!LicenceUtil.compareLicence(ConfigManager.getInstance().getSysConfig().getCdsLicence())){
		    if (Constant.IS_CLIENT.equals(isClient)) {//1：如果是客户端,则不跳转页面，返回成功/是否的json数据
		        super.writeJson(super.getReturnFalse("您的licence已过期，请联系管理员!"));
	            return null;
		    }
		    else {
		        return ERROR;
		    }
		}
		
		returnInfos = loginService.login(map, session);
		
		if (Constant.IS_CLIENT.equals(isClient)) {//1：如果是客户端,则不跳转页面，返回成功/是否的json数据
		    JSONObject json = new JSONObject();
		    if (Constants.RETURN_FLAG_SUCCESS.equals(returnInfos)) {//登录成功
		        json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_SUCCESS);
		        //User user = (User)session.get(Constant.SESSION_USER);
		        UserPermission user = (UserPermission)session.get(Constants.SESSION_USER);
		        if (user != null) {
		            user.setLoginName(loginName);
		            Map<String,Object> data = new HashMap<String,Object>();
		            data.put("id", user.getId());
		            json.put(Constants.RETURN_DATA, data);
		        }
		        logger.info(loginName + "登录!");
            }
            else {
                json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_FAIL);
                json.put(Constants.RETURN_DATA, returnInfos);
            }
		    super.writeJson(json.toString());
		    return null;
		}
		else {//默认空，其他则为非客户端,页面进行跳转
		    if (Constants.RETURN_FLAG_SUCCESS.equals(returnInfos)) {//登录成功
	            return SUCCESS;
	        }
	        else {
	            errorInfo = returnInfos;
	            return ERROR;
	        }
		}
	}
	
	/**
	 * 登录
	 * @return
	 * @throws Exception
	 */
	public String loginSSO() throws Exception {
		String returnInfos;
		//需要添加：把错误信息反馈到登录页面
		if (!LicenceUtil.compareLicence(ConfigManager.getInstance().getSysConfig().getCdsLicence())) {//licence过期
			 logger.error("您的licence已过期，请联系管理员!");
			return ERROR;
		}
		
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("loginName", StringUtils.replaceSpecialCharacter(loginName));
		map.put("pwd", StringUtils.replaceSpecialCharacter(pwd));
		
		returnInfos = loginService.login(map, session);
		
		if (Constant.IS_CLIENT.equals(isClient)) {//1：如果是客户端,则不跳转页面，返回成功/是否的json数据
		    if (Constants.RETURN_FLAG_SUCCESS.equals(returnInfos)) {//登录成功
		        //User user = (User)session.get(Constant.SESSION_USER);
		        UserPermission user = (UserPermission)session.get(Constants.SESSION_USER);
		        if (user != null) {
		            user.setLoginName(loginName);
		        }
		        logger.info(loginName + "登录!");
            }
            else {
            	 logger.error("登录失败!");
            	 return ERROR;
            }
		    return SUCCESS;
		}
		else {//默认空，其他则为非客户端,页面进行跳转
		    if (Constants.RETURN_FLAG_SUCCESS.equals(returnInfos)) {//登录成功
	            return SUCCESS;
	        }
	        else {
	            errorInfo = returnInfos;
	            return ERROR;
	        }
		}
	}

	/**
	 * 注销
	 * @return
	 * @throws Exception
	 */
	public String logout() throws Exception {
	    UserPermission user = (UserPermission) super.getSessionUser();
		if (user != null) {
		    logger.info(user.getLoginName() + "注销!");
			super.clearSessionUser();
		}

		return SUCCESS;
	}

	/**
     * 注册用户
     * @return
     * @throws Exception
     */
    public String register() throws Exception {
        JSONObject json = new JSONObject();
        if (signinName == null || signinName.isEmpty()) {//未设置用户名
            json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_FAIL);
            json.put(Constants.RETURN_DATA, "用户名不能为空!");
        }
        else if (signinpwd == null || signinpwd.isEmpty()) {//未设置用户名
            json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_FAIL);
            json.put(Constants.RETURN_DATA, "密码不能为空!");
        }
        else {
            HashMap<String, String> map = new HashMap<String, String>();
            String returnInfos = loginService.register(map);
            if (Constants.RETURN_FLAG_SUCCESS.equals(returnInfos)) {//注册成功
                json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_SUCCESS);
                logger.info(signinName + "注册成功!");
            }
            else {
                json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_FAIL);
                json.put(Constants.RETURN_DATA, returnInfos);
            }
        }
        super.writeJson(json.toString());
        return null;
    }

	/**
     * 主页跳转
     * @return SUCCESS
     */
    public String main() {
        if (super.validateSession()) {//已经登录
            //userName = getSessionUser().getLoginName();
            return SUCCESS;
        }
        else {//未登录
            return ERROR;
        }
    }
    
    /**
     * 判断权限
     * @return
     * @throws Exception
     */
    public String checkPriv() throws Exception {
        JSONObject json = new JSONObject();
        String res = request.getParameter("resource");
        if (res == null || res.isEmpty()) {
            json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_FAIL);
            json.put(Constants.RETURN_DATA, "请传递resource参数!");
            super.writeJson(json.toString());
            return null;
        }
        UserPermission user = (UserPermission) super.getSessionUser();
        if (user != null) {//通过OM3.0登录
            List<Permission> pers = user.getPermission();
            Map<String, String> resources = ConfigManager.getInstance().getSysConfig().getResources();
            String resource = resources.get(res);
            boolean hasSavePer = false;
            for (Permission per : pers) {
                if (resource.equals(per.getName()) && (per.getRole() == null || per.getRole().compareTo(-1) != 0)) {//有保存权限
                    hasSavePer = true;
                    break;
                }
            }
            if (!hasSavePer) {//没有权限
                json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_FAIL);
                json.put(Constants.RETURN_DATA, "您没有权限" + resource + "!");
                super.writeJson(json.toString());
                return null;
            }
        }
        json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_SUCCESS);
        json.put(Constants.RETURN_DATA, "您可以操作!");
        super.writeJson(json.toString());
        return null;
    }

    /**
     * 获取分享用户列表
     * @return
     * @throws Exception
     * @author linj created on 2013-5-23 
     * @since CDT 1.0
     */
    public String getShareUserList() throws Exception {
        String returnInfo = loginService.getShareUserList(super.getUserId());
        super.writeJson(returnInfo);
        return null;
    }
    
    
    /**
     * 检查licence是否过期
     * 
     * @param userId
     * @return
     * @throws Exception
     * @author majj created on 2014-5-20 
     * @since CDS Framework 1.0
     */
    public String checkLicence() throws Exception{
        String returnInfo = loginService.checkLicence();
        super.writeJson(returnInfo);
        return null;
    }

	@Override
	public String doExecute() throws Exception {
		return null;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	/**
	 * @return the loginService
	 */
	public LoginService getLoginService() {
		return loginService;
	}

	/**
	 * @param loginService the loginService to set
	 */
	public void setLoginService(LoginService loginService) {
		this.loginService = loginService;
	}


    
    public String getErrorInfo() {
        return errorInfo;
    }


    
    public void setErrorInfo(String errorInfo) {
        this.errorInfo = errorInfo;
    }


    
    public String getIsClient() {
        return isClient;
    }


    
    public void setIsClient(String isClient) {
        this.isClient = isClient;
    }

    
    public String getSigninName() {
        return signinName;
    }

    
    public void setSigninName(String signinName) {
        this.signinName = signinName;
    }

    
    public String getMailbox() {
        return mailbox;
    }

    
    public void setMailbox(String mailbox) {
        this.mailbox = mailbox;
    }

    
    public String getSigninpwd() {
        return signinpwd;
    }

    
    public void setSigninpwd(String signinpwd) {
        this.signinpwd = signinpwd;
    }

    
    public String getSelectedId() {
        return selectedId;
    }

    
    public void setSelectedId(String selectedId) {
        this.selectedId = selectedId;
    }

    
    public String getUserName() {
        return userName;
    }

    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    //wangwenliang add 2015-09-15 start
	public String getRolename() {
		return rolename;
	}

	public void setRolename(String rolename) {
		this.rolename = rolename;
	}
	
	public UserRoleService getUserRoleService() {
		return userRoleService;
	}

	public void setUserRoleService(UserRoleService userRoleService) {
		this.userRoleService = userRoleService;
	}
	//wangwenliang add 2015-09-15 end

}
