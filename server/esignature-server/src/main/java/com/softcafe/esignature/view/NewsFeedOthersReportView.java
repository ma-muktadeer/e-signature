package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "VW_NEWS_FEET_OTHERS")
public class NewsFeedOthersReportView extends ReportBase{
	
	
	@Column(name = "TX_LOGIN_NAME")
	private String loginName;
	
	@Column(name = "TX_ACTIVITY_TYPE")
	private String activityType;
	
	@Column(name = "TX_ACTION_TIME")
	private String actionTime;
	
	
	@Column(name = "DTT_ACTIVITY")
    private Date activity;
	
	

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

	public String getActionTime() {
		return actionTime;
	}

	public void setActionTime(String actionTime) {
		this.actionTime = actionTime;
	}

	public Date getActivity() {
		return activity;
	}

	public void setActivity(Date activity) {
		this.activity = activity;
	}

		

}
