package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "VE_USER_REPORT")
public class UserReportView{
	@Id
	@Column(name = "ID_USER_KEY")
	private Long idUserKey;
	
	@Column(name = "TX_LOGIN_NAME")
	private String loginName;
	
	@Column(name = "tx_full_name")
	private String fullName;
	
	@Column(name = "TX_PHONE_NUMBER")
	private String mobileNumber;
	
	@Column(name = "TX_INSTITUTE_NAME")
	private String instituteName;
	
	@Column(name = "TX_DESIGNATION")
	private String designation;
	
	@Column(name = "TX_BRUNCH")
	private String branch;
	
	@Column(name = "tx_employee_id")
	private String empId;
	
	@Column(name = "LAST_LOGIN_DATE")
	private String lastLoginDate;

	
	@Column(name = "DTT_CREATE")
	private Date createDate;
	
	@Column(name = "TX_USER_TYPE")
	private String userType;
	
	@Column(name = "TX_USER_CREATE_DATE")
	private String userCreateDate;
	
	@Column(name = "TX_ACTIVE_DATE")
	private String activeDate;
	
	
	@Column(name = "TX_INACTIVE_DATE")
	private String inactiveDate;
	
	@Column(name = "TX_USER_STATUS")
	private String userStatus;
	
	@Column(name = "TX_BD_USER_STATUS")
	private String dbUserStatus;
	
//	@Column(name = "TX_AMEND_DATE")
//	private String amendDate;
	
	@Column(name = "TX_AMEND_DATE")
	private Date amendDate;
	
	@Column(name = "TX_MAKER")
	private String maker;
	
	@Column(name = "TX_AMEND_DATE_ST")
	private String amendDateSt;
	
	@Column(name = "TX_AUTHORIZER")
	private String authorizer;
	
	@Column(name = "PASS_RESET_DATE_TIME")
	private String passWordResetDateTime;
	
	@Column(name = "ADMIN_RESET_DATE_TIME")
	private String adminResetDateTime;
	
	@Column(name = "TX_USER_BLOCK_CAUSE")
	private String userBlockCause;
	
	@Column(name = "TX_ADMIN_USER")
	private String adminUser;
	
	

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getUserCreateDate() {
		return userCreateDate;
	}

	public void setUserCreateDate(String userCreateDate) {
		this.userCreateDate = userCreateDate;
	}

	public String getActiveDate() {
		return activeDate;
	}

	public void setActiveDate(String activeDate) {
		this.activeDate = activeDate;
	}

	public String getInactiveDate() {
		return inactiveDate;
	}

	public void setInactiveDate(String inactiveDate) {
		this.inactiveDate = inactiveDate;
	}

	public String getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(String userStatus) {
		this.userStatus = userStatus;
	}

	
	public Date getAmendDate() {
		return amendDate;
	}

	public void setAmendDate(Date amendDate) {
		this.amendDate = amendDate;
	}

	public String getMaker() {
		return maker;
	}

	public void setMaker(String maker) {
		this.maker = maker;
	}

	public String getAuthorizer() {
		return authorizer;
	}

	public void setAuthorizer(String authorizer) {
		this.authorizer = authorizer;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Long getIdUserKey() {
		return idUserKey;
	}

	public void setIdUserKey(Long idUserKey) {
		this.idUserKey = idUserKey;
	}

	public String getPassWordResetDateTime() {
		return passWordResetDateTime;
	}

	public void setPassWordResetDateTime(String passWordResetDateTime) {
		this.passWordResetDateTime = passWordResetDateTime;
	}

	public String getAdminResetDateTime() {
		return adminResetDateTime;
	}

	public void setAdminResetDateTime(String adminResetDateTime) {
		this.adminResetDateTime = adminResetDateTime;
	}

	public String getUserBlockCause() {
		return userBlockCause;
	}

	public void setUserBlockCause(String userBlockCause) {
		this.userBlockCause = userBlockCause;
	}

	public String getAdminUser() {
		return adminUser;
	}

	public void setAdminUser(String adminUser) {
		this.adminUser = adminUser;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getInstituteName() {
		return instituteName;
	}

	public void setInstituteName(String instituteName) {
		this.instituteName = instituteName;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	public String getBranch() {
		return branch;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	public String getEmpId() {
		return empId;
	}

	public void setEmpId(String empId) {
		this.empId = empId;
	}

	public String getLastLoginDate() {
		return lastLoginDate;
	}

	public void setLastLoginDate(String lastLoginDate) {
		this.lastLoginDate = lastLoginDate;
	}

	public String getAmendDateSt() {
		return amendDateSt;
	}

	public void setAmendDateSt(String amendDateSt) {
		this.amendDateSt = amendDateSt;
	}

	public String getDbUserStatus() {
		return dbUserStatus;
	}

	public void setDbUserStatus(String dbUserStatus) {
		this.dbUserStatus = dbUserStatus;
	}

	

}
