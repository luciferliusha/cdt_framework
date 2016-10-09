package com.zjcds.om.data.bean;

import java.util.Date;
import java.util.List;

import com.zjcds.om.constant.OMConstant;

/**
 * 组织实体类
 * 
 * @author yuzq
 * @date 2013/4/23
 * 
 */
public class OMOrganizationData {

    private Integer id; // ID

    private Integer parentId; // 父ID

    private Integer type; // 类型

    private Integer status; // 状态

    private String name; // 名称

    private String password; // 密码

    private String phone; // 电话

    private String mobilePhone; // 移动电话

    private String email; // 邮件

    private String address; // 地址

    private Date createTime; // 创建时间

    private Date updateTime; // 修改时间

    private String state; // 是否展开

    private String iconCls;// 前端显示的图标样式

    private List<OMOrganizationData> children; // 子节点元素

    private String text;

    private String iconSkin;//zTree显示的图标样式

    private boolean isParent;//zTree是否是父节点 
    
    private String xzqhdm;//行政区划代码
    
    private String xzqhmc;//行政区划名称

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

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        this.text = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getMobilePhone() {
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
        if (this.state != null && !this.state.isEmpty()) {
            
            this.iconCls = OMConstant.ICON_ROLE_DOUBLE;
        }
        else {
            this.iconCls = OMConstant.ICON_ROLE_SINGLE;
        }
    }

    public List<OMOrganizationData> getChildren() {
        return children;
    }

    public void setChildren(List<OMOrganizationData> children) {
        this.children = children;
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getIconSkin() {
		return iconSkin;
	}

	public void setIconSkin(String iconSkin) {
		this.iconSkin = iconSkin;
	}

	public boolean getIsParent() {
		return isParent;
	}

	public void setIsParent(boolean isParent) {
		this.isParent = isParent;
	}

	public String getXzqhdm() {
		return xzqhdm;
	}

	public void setXzqhdm(String xzqhdm) {
		this.xzqhdm = xzqhdm;
	}

	public String getXzqhmc() {
		return xzqhmc;
	}

	public void setXzqhmc(String xzqhmc) {
		this.xzqhmc = xzqhmc;
	}
}
