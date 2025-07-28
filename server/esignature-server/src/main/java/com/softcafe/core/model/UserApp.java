package com.softcafe.core.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name="T_USER_APP")
public class UserApp{

	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USER_APP_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "USER_APP_SEQ", allocationSize = 1, name = "USER_APP_SEQ") //for oracle
	@Column(name ="id_user_app_key")
	private Long userAppId;
	
	
	@Column(name ="tx_app_name")
	String appName;
	
	@Column(name ="tx_constant_app_name")
	String constantAppName;
	
	@Column(name ="tx_app_url")
	String appUrl;
	
	@Column(name ="int_order")
	int order;
	
	public Long getUserAppId() {
		return userAppId;
	}
	public void setUserAppId(Long userAppId) {
		this.userAppId = userAppId;
	}
	public String getAppName() {
		return appName;
	}
	public void setAppName(String appName) {
		this.appName = appName;
	}
	public String getConstantAppName() {
		return constantAppName;
	}
	public void setConstantAppName(String constantAppName) {
		this.constantAppName = constantAppName;
	}
	public String getAppUrl() {
		return appUrl;
	}
	public void setAppUrl(String appUrl) {
		this.appUrl = appUrl;
	}
	public int getOrder() {
		return order;
	}
	public void setOrder(int order) {
		this.order = order;
	}

	
	
	
	
	
}
