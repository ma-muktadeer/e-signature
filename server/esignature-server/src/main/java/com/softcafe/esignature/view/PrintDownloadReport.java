package com.softcafe.esignature.view;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "VW_RPT_SINGATURE_DOWNLOAD")
public class PrintDownloadReport extends ReportBase{

	@Column(name = "TX_LOGIN_NAME")
	private String loginName;
	
	@Column(name = "TX_ACTIVITY_TYPE")
	private String activityType;
	
	@Column(name = "TX_ACTIVITY_TIME")
	private String activityTime;
	
	@Column(name = "TX_SEARCH_BY")
	private String searchBy;
	
	@Column(name = "tx_pa")
	private String pa;
	
	@Column(name = "TX_SOURCE_IP")
	private String sourceIP;

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getActivityType() {
		return activityType;
	}

	public void setActivityType(String activityType) {
		this.activityType = activityType;
	}

	public String getActivityTime() {
		return activityTime;
	}

	public void setActivityTime(String activityTime) {
		this.activityTime = activityTime;
	}

	public String getSearchBy() {
		return searchBy;
	}

	public void setSearchBy(String searchBy) {
		this.searchBy = searchBy;
	}

	public String getPa() {
		return pa;
	}

	public void setPa(String pa) {
		this.pa = pa;
	}

	public String getSourceIP() {
		return sourceIP;
	}

	public void setSourceIP(String sourceIP) {
		this.sourceIP = sourceIP;
	}
	
}
