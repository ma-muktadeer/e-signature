package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "VW_PASSWORD_REPORT")
public class PasswordReportView{
	@Id
	@Column(name = "ID_PASSWORD_REPORT_KEY")
	private Long passwordReportKey;

	@Column(name = "TX_USER_NAME")
	private String userName;

	@Column(name = "TX_EMAIL")
	private String email;

	@Column(name = "TX_INSTITUTION_NAME")
	private String institutionName;

	@Column(name = "DT_DATE_TIME")
	private Date dateTime;
	
	@Column(name = "TX_STATUS")
	private String status;
	
	@Column(name = "TX_TYPE")
	private String type;

	@Column(name = "ID_USER_KEY")
	private Long userId;

	public Long getPasswordReportKey() {
		return passwordReportKey;
	}

	public void setPasswordReportKey(Long passwordReportKey) {
		this.passwordReportKey = passwordReportKey;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getInstitutionName() {
		return institutionName;
	}

	public void setInstitutionName(String institutionName) {
		this.institutionName = institutionName;
	}

	public Date getDateTime() {
		return dateTime;
	}

	public void setDateTime(Date dateTime) {
		this.dateTime = dateTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}





	
	
	
	
	
	
	
	
	

}
