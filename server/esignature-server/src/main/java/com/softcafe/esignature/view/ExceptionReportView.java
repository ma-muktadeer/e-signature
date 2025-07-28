package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="VW_EXCEPTION_REPORT")
public class ExceptionReportView extends ReportBase{
	@Column(name = "USER_NAME")
	private String userName;

	@Column(name = "BRUNCH_NAME")
	private String branchName;

	
	@Column(name = "INSTITUATION_NAME")
	private String institutionName;
	
	@Column(name = "EMPLOYEE_NAME")
	private String employeeName;

	@Column(name = "TX_EMAIL")
	private String email;

	@Column(name = "TX_PHONE_NUMBER")
	private String phoneNumber;


	@Column(name = "TX_NID")
	private String nid;
	
	@Column(name = "DTT_DOB")
	private Date dob;
	
	@Column(name = "INT_ALLOW_LOGIN")
	private Long allowLogin;

	@Column(name = "USER_STATUS")
	private String userStatus;
	
	@Column(name = "IP_ADDRESS")
	private String ipAddress;
	
	@Column(name = "TX_ATTEMPT_LOGIN")
	private String attemptLogin;
	
	@Column(name = "INT_ATTEMPT_STATUS")
	private Long attemptStatus;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getBranchName() {
		return branchName;
	}

	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}

	public String getInstitutionName() {
		return institutionName;
	}

	public void setInstitutionName(String institutionName) {
		this.institutionName = institutionName;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getNid() {
		return nid;
	}

	public void setNid(String nid) {
		this.nid = nid;
	}

	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}

	public Long getAllowLogin() {
		return allowLogin;
	}

	public void setAllowLogin(Long allowLogin) {
		this.allowLogin = allowLogin;
	}

	public String getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(String userStatus) {
		this.userStatus = userStatus;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getAttemptLogin() {
		return attemptLogin;
	}

	public void setAttemptLogin(String attemptLogin) {
		this.attemptLogin = attemptLogin;
	}

	public Long getAttemptStatus() {
		return attemptStatus;
	}

	public void setAttemptStatus(Long attemptStatus) {
		this.attemptStatus = attemptStatus;
	}
	
	
	
	

	
	
	

}
