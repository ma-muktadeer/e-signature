package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "VW_LOGGED_REPORT")
public class LoggedReportView{
	@Id
	@Column(name = "ID_LOGGED_KEY")
	private Long idLoggedKey;

	@Column(name = "TX_LOGIN_NAME")
	private String loginName;

	@Column(name = "TX_ATTEMPT_STATUS")
	private String attemptStatus;

	@Column(name = "TX_ACTION")
	private String action;

	@Column(name = "TX_IP_ADDR")
	private String ip;
	@Column(name = "TX_EMAIL")
	private String email;


	@Column(name = "tx_gen_notice_time")
	private String genNoticeTime;
	
	@Column(name = "tx_md_notice_time")
	private String mdNoticeTime;

	@Column(name = "TX_MOD_TIME")
	private String modifyTime;
	@Column(name = "TX_LOGIN_TIME")
	private String loginTime;
	@Column(name = "TX_LOGOUT_TIME")
	private String logoutTime;

	@Column(name = "TX_FULL_NAME")
	private String fullName;
	
	@Column(name = "TX_INSTITUTION_NAME")
	private String institutionName;
	
	@Column(name = "TX_BRANCH_NAME")
	private String branchName;
	
	@Column(name = "ID_INSTITUTION_KEY")
	private Long institutionId;
	@Column(name = "ID_USER_KEY")
	private Long userId;

	@Column(name = "dtt_entry")
	private Date entryTime;

	@Column(name = "DTT_MOD_TIME")
	private Date modDate;

	@Column(name = "DTT_LOGIN_TIME")
	private Date loginDate;

	@Column(name = "DTT_LOGOUT_TIME")
	private Date logoutDate;

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getAttemptStatus() {
		return attemptStatus;
	}

	public void setAttemptStatus(String attemptStatus) {
		this.attemptStatus = attemptStatus;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	
	

//	public Date getGenNoticeTime() {
//		return genNoticeTime;
//	}
//
//	public void setGenNoticeTime(Date genNoticeTime) {
//		this.genNoticeTime = genNoticeTime;
//	}
//
//	public Date getMdNoticeTime() {
//		return mdNoticeTime;
//	}
//
//	public void setMdNoticeTime(Date mdNoticeTime) {
//		this.mdNoticeTime = mdNoticeTime;
//	}

	public String getGenNoticeTime() {
		return genNoticeTime;
	}

	public void setGenNoticeTime(String genNoticeTime) {
		this.genNoticeTime = genNoticeTime;
	}

	public String getMdNoticeTime() {
		return mdNoticeTime;
	}

	public void setMdNoticeTime(String mdNoticeTime) {
		this.mdNoticeTime = mdNoticeTime;
	}

	public String getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(String modifyTime) {
		this.modifyTime = modifyTime;
	}

	public String getLoginTime() {
		return loginTime;
	}

	public void setLoginTime(String loginTime) {
		this.loginTime = loginTime;
	}

	public String getLogoutTime() {
		return logoutTime;
	}

	public void setLogoutTime(String logoutTime) {
		this.logoutTime = logoutTime;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public Long getInstitutionId() {
		return institutionId;
	}

	public void setInstitutionId(Long institutionId) {
		this.institutionId = institutionId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getInstitutionName() {
		return institutionName;
	}

	public void setInstitutionName(String institutionName) {
		this.institutionName = institutionName;
	}

	public Date getEntryTime() {
		return entryTime;
	}

	public void setEntryTime(Date entryTime) {
		this.entryTime = entryTime;
	}

	public Date getModDate() {
		return modDate;
	}

	public void setModDate(Date modDate) {
		this.modDate = modDate;
	}
	public Date getLoginDate() {
		return loginDate;
	}

	public void setLoginDate(Date loginDate) {
		this.loginDate = loginDate;
	}

	public Date getLogoutDate() {
		return logoutDate;
	}

	public void setLogoutDate(Date logoutDate) {
		this.logoutDate = logoutDate;
	}

	public Long getIdLoggedKey() {
		return idLoggedKey;
	}

	public void setIdLoggedKey(Long idLoggedKey) {
		this.idLoggedKey = idLoggedKey;
	}

	public String getBranchName() {
		return branchName;
	}

	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}
	
	

}
