package com.zjcds.portal.service.login.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.zjcds.framework.common.constant.Constants;
import com.zjcds.framework.common.httpconnect.ConnectInfo;
import com.zjcds.framework.common.httpconnect.HttpTools;
import com.zjcds.framework.common.util.LicenceUtil;
import com.zjcds.framework.common.util.ReturnInfoUtil;
import com.zjcds.framework.view.bean.CdsLicence;
import com.zjcds.framework.view.bean.UserPermission;
import com.zjcds.portal.config.ConfigManager;
import com.zjcds.portal.service.login.LoginService;

public class LoginServiceImpl implements LoginService {

    /** 日志 */
    private static Logger logger = Logger.getLogger(LoginServiceImpl.class);
    
    @Override
    public String login(Map<?, ?> paras, Map<?, ?> session) {
        String result = null;
        try {
            //result = loginFromOM(paras, session);
            result = loginFromOauth(paras, session);
        }
        catch (Exception e) {//可能连接不上
            result = "服务器连接失败,请检查连接!";
            logger.error(result + e.getMessage());
        }
        return result;
    }

    @Override
    public void logout(Map<?, ?> paras) {
        ConnectInfo con = new ConnectInfo(ConfigManager.getInstance().getSysConfig().getOmServer());
        try {
            HttpTools.doGet(con, "", paras);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public String register(Map<?, ?> paras) {
        return null;
    }
    
    @Override
    public String getShareUserList(String userId) throws Exception {
        Map<String, String> paras = new HashMap<String, String>();
        paras.put("data", "{id:" + userId + "}");
        ConnectInfo con = new ConnectInfo(ConfigManager.getInstance().getSysConfig().getOmServer());
        Map<String, String> mapper = ConfigManager.getInstance().getSysConfig().getOmInterface();
        String json = HttpTools.doGet(con, mapper.get("userList"), paras);
        return json;
    }
    
    /**
     * 通过OM3.0接口登录
     * @param paras
     * @param session
     * @return
     * @throws Exception
     * @author linj created on 2013-1-25 
     * @since CDT Framework 1.0
     */
    private String loginFromOauth(Map paras, Map<?, ?> session) throws Exception{
        paras.put("type", "login");
        paras.put("data", "{email:'" + paras.get("loginName") + "', password:'" + paras.get("pwd") + "'}");
        ConnectInfo con = new ConnectInfo(ConfigManager.getInstance().getSysConfig().getOmServer());
        Map<String, String> mapper = ConfigManager.getInstance().getSysConfig().getOmInterface();
        String json = HttpTools.doGet(con, mapper.get("login"), paras);
        return parseJson(json, session);
    }
    
    private String parseJson(String json, Map session) {
        //Map resultMap = JsonUtil.getMapFromJson(json);
        //String o2 = resultMap2.get("data").toString();
        Map<?, ?> resultMap = JSON.parseObject(json, Map.class);
        String returnFlag = (String) resultMap.get("returnFlag");
        String data = null;
        if (resultMap.get("data") instanceof com.alibaba.fastjson.JSONObject) {
            com.alibaba.fastjson.JSONObject o = (com.alibaba.fastjson.JSONObject) resultMap.get("data");
            data = o.toString();
        }
        else {
            data = (String) resultMap.get("data");
        }
        if (Constants.RETURN_FLAG_SUCCESS.equals(returnFlag)) {
            logger.info("登录验证成功!");
            //Map<String, Class<?>> classMap = new HashMap<String, Class<?>>();
            //classMap.put("permission", Permission.class);
            UserPermission userPerInfo = JSON.parseObject(data, UserPermission.class);//(UserPermission) JsonUtil.getDTO(data, UserPermission.class, classMap);
            boolean hasLoginPer = false;
            String kind = userPerInfo.getKind();
            if (Constants.ADMIN_USER.equals(kind)) {//管理员用户登录，不需要判断权限
                hasLoginPer = true;
            }
//            else {
//                List<Permission> pers = userPerInfo.getPermission();
//                Map<String, String> resources = ConfigManager.getInstance().getSysConfig().getResources();
////                String loginResource = resources != null ? resources.get("login") : Constant.RESOURCE_LOGIN;
//                String loginResource = resources != null ? resources.get("login") : Constant.RESOURCE_NO;
///*                for (Permission per : pers) {
//                    if (loginResource.equals(per.getNo()) && (per.getRole() == null || per.getRole().compareTo(-1) != 0)) {//有登录权限
//                        hasLoginPer = true;
//                        break;
//                    }
//                }*/
//            }
            hasLoginPer = true;
            if (hasLoginPer) {
                logger.info("登录权限验证成功!");
                session.put(Constants.SESSION_USER, userPerInfo);
                return Constants.RETURN_FLAG_SUCCESS;
            }
            else {
                logger.info("登录权限验证失败!");
                return "您没有权限登录,请联系管理员!";
            }
        }
        else {
            logger.info("登录失败：" + data);
            return data;
        }
    }
    
    @Override
    public String checkLicence() throws Exception {
    	logger.info("判断licence!");
    	CdsLicence cdsLrc = ConfigManager.getInstance().getSysConfig().getCdsLicence();
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        Date date = new Date();
        Date d1=sdf.parse(sdf.format(date));
    	Date d2=sdf.parse(cdsLrc.getEndTime());
    	long daysBetween=(d2.getTime()-d1.getTime()+1000000)/(3600*24*1000);
    	int returnTimeleft = Integer.parseInt(String.valueOf(daysBetween));
        if (!LicenceUtil.compareLicence(cdsLrc)) {
            logger.info("licence过期!");
            return ReturnInfoUtil.getFailReturnData("您的licence已过期，请联系管理员!");
        }else if(returnTimeleft<=60){
        	logger.info("licence即将过期!");
        	JSONObject json = new JSONObject();
        	json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_FAIL);
        	json.put(Constants.RETURN_DATA, "您的licence已剩余"+returnTimeleft+"天，请及时联系管理员,以免造成不便!");
        	String jsondata = ReturnInfoUtil.getSuccessReturnData(json);
        	return jsondata.toString();
        }else{
        	JSONObject json = new JSONObject();
        	json.put(Constants.RETURN_FLAG, Constants.RETURN_FLAG_SUCCESS);
        	json.put(Constants.RETURN_DATA, "licence可用!");
        	String jsondata = ReturnInfoUtil.getSuccessReturnData(json);
        	return jsondata.toString();
        }
    }
  
//
//    /**
//     * 通过OM2.0接口登录
//     * @param paras
//     * @param session
//     * @return
//     * @throws Exception
//     * @author linj created on 2013-1-25 
//     * @since CDT Framework 1.0
//     */
//    private String loginFromOM(Map paras, Map<?, ?> session) throws Exception {
//        paras.put("kind", "login");
//        paras.put("reuse", "true");
//        String xml = null;
//        ConnectInfo con = new ConnectInfo(ConfigManager.getInstance().getSysConfig().getOmServer());
//        xml = HttpTools.doGet(con, "", paras);
//        return parseXML(xml, session);
//    }
//    
//    /**
//     * 解析返回的XML
//     * @throws ParserConfigurationException 
//     * @throws IOException 
//     * @throws SAXException 
//     * @throws UnsupportedEncodingException 
//     * @throws DocumentException 
//     */
//    public static String parseXML(String str, Map session) throws DocumentException {
//        Document m_dom = DocumentHelper.parseText(str);
//        Element m_root = m_dom.getRootElement();
//        Element m_result = (Element)m_root.selectSingleNode("Result");
//        Element m_retPrivsEle = (Element)m_result.selectSingleNode("privs");//权限
//        String m_retCode = m_result.selectSingleNode("ReturnFlag").getText();
//        String m_returnInfo = m_result.selectSingleNode("ReturnInfo").getText();
//        User user = new User();
//        //是否正确返回
//        if (Constants.RETURN_FLAG_SUCCESS.equals(m_retCode)) {
//            logger.info("登录成功!");
//            List<String> privs = null;
//            if (m_retPrivsEle != null) {
//                List<?> privsEls = m_retPrivsEle.content();//权限
//                // 管理员的情况时privs只包含一个<priv sourceid="" />节点
//                if (privsEls.size() > 0 && ((Element) privsEls.get(0)).attributeValue("sourceid") != "") {
//                    privs = new ArrayList<String>();
//                    for (int i = 0; i < privsEls.size(); i++) {
//                        // 添加不重复的目录ID
//                        privs.add(((Element) privsEls.get(i)).attributeValue("sourceid"));
//                    }
//                }
//            }
//            user.setClientsession(m_returnInfo);
//            user.setPrivs(privs);
//            session.put(Constants.SESSION_USER, user);
//            return Constants.RETURN_FLAG_SUCCESS;
//        }
//        else {
//            logger.info("登录失败：" + m_returnInfo);
//            return m_returnInfo;
//        }
//    }
}
