package com.zjcds.om.data.bean;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

/**
 * 用户权限实体类
 * 
 * @author linj
 * @date 2013/5/7
 * 
 */
public class OMUserPermissionData {

    private String name;// 资源名称

    private String no; // 资源编号

    private Integer role;// 资源对应的权限

    private Integer id;

    private Integer parentId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    /**
     * 合并相同资源
     * 
     * @param userPerList
     * @return
     * @throws Exception
     */
    public static List<OMUserPermissionData> combineSameResource(List<OMUserPermissionData> userPerList)
            throws Exception {
        Map<String, List<OMUserPermissionData>> sameResourceGroup = sameResourceGroup(userPerList);
        List<OMUserPermissionData> returnList = conbinePermission(sameResourceGroup);
        return returnList;
    }

    /**
     * 将相同资源分为同一组
     * 
     * @param userPerList
     * @return
     * @throws Exception
     */
    private static Map<String, List<OMUserPermissionData>> sameResourceGroup(List<OMUserPermissionData> userPerList)
            throws Exception {
        Map<String, List<OMUserPermissionData>> noMap = new HashMap<String, List<OMUserPermissionData>>();
        for (int i = 0; i < userPerList.size(); i++) {
            String no = userPerList.get(i).getNo();
            noMap.put(no, null);
        }
        for (Entry<String, List<OMUserPermissionData>> mapEntry : noMap.entrySet()) {
            String no = mapEntry.getKey();
            List<OMUserPermissionData> sameResource = new ArrayList<OMUserPermissionData>();
            for (int i = 0; i < userPerList.size(); i++) {
                if (no.equals(userPerList.get(i).getNo()) || userPerList.get(i).getNo().equals(no)) {
                    sameResource.add(userPerList.get(i));
                }
            }
            noMap.put(no, sameResource);
        }
        return noMap;
    }

    /**
     * 二进制与十进制的对应关系
     * 
     * @return
     * @throws Exception
     */
    private static Map<String, Object> twoRelationWithTen() throws Exception {
        String[] str = new String[] { "0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001",
                "1010", "1011", "1100", "1101", "1110", "1111" };
        Map<String, Object> m = new HashMap<String, Object>();
        for (int i = 0; i < str.length; i++) {
            String key = str[i];
            int value = Integer.parseInt(key, 2);
            m.put(key, value);
        }
        return m;
    }

    /**
     * 合并权限
     * 
     * @param sameResourceGroup
     * @return
     * @throws Exception
     */
    private static List<OMUserPermissionData> conbinePermission(
            Map<String, List<OMUserPermissionData>> sameResourceGroup) throws Exception {
        List<OMUserPermissionData> returnList = new ArrayList<OMUserPermissionData>();
        for (Entry<String, List<OMUserPermissionData>> en : sameResourceGroup.entrySet()) {
            String key = en.getKey();
            List<OMUserPermissionData> sameResource = sameResourceGroup.get(key);
            if (sameResource != null && sameResource.size() != 0) {
                if (sameResource.size() == 1) {
                    returnList.add(sameResource.get(0));
                }
                else {
                    returnList.add(PermissionOrOperate(sameResource));
                }
            }
        }
        return returnList;
    }

    /**
     * 对权限进行或运算
     * 
     * @param sameResource
     * @return
     * @throws Exception
     */
    private static OMUserPermissionData PermissionOrOperate(List<OMUserPermissionData> sameResource) throws Exception {
        int result = 0;
        Map<String, Object> twoToTen = twoRelationWithTen();
        for (int i = 0; i < sameResource.size(); i++) {
            Integer permission = sameResource.get(i).getRole();
            String key = String.valueOf(permission);
            if (key.equals("null"))
                key = "0000";
            if (key.length() != 4) {
                int keyLen = key.length();
                String str = "0";
                for (int j = 0; j < 3 - keyLen; j++) {
                    str += "0";
                }
                key = str.trim() + key;
            }
            Integer value = (Integer) twoToTen.get(key);
            result = result | (value.intValue());
        }
        Integer role = getMatchKey(result, twoToTen);
        sameResource.get(0).setRole(role);
        return sameResource.get(0);
    }

    /**
     * 取得匹配的key值,即将十进制转化为二进制
     * 
     * @param value
     * @param twoToTen
     * @return
     * @throws Exception
     */
    private static Integer getMatchKey(Integer value, Map<String, Object> twoToTen) throws Exception {
        Integer permissionValue = 0;
        for (Entry<String, Object> entry : twoToTen.entrySet()) {
            String entryKey = entry.getKey();
            Integer entryValue = (Integer) twoToTen.get(entryKey);
            if (entryValue.intValue() == value.intValue()) {
                permissionValue = Integer.parseInt(entryKey);
                break;
            }
        }
        return permissionValue;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        result = prime * result + ((no == null) ? 0 : no.hashCode());
        result = prime * result + ((parentId == null) ? 0 : parentId.hashCode());
        result = prime * result + ((role == null) ? 0 : role.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        OMUserPermissionData other = (OMUserPermissionData) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        }
        else if (!id.equals(other.id))
            return false;
        if (name == null) {
            if (other.name != null)
                return false;
        }
        else if (!name.equals(other.name))
            return false;
        if (no == null) {
            if (other.no != null)
                return false;
        }
        else if (!no.equals(other.no))
            return false;
        if (parentId == null) {
            if (other.parentId != null)
                return false;
        }
        else if (!parentId.equals(other.parentId))
            return false;
        if (role == null) {
            if (other.role != null)
                return false;
        }
        else if (!role.equals(other.role))
            return false;
        return true;
    }

}
