package com.softcafe.core.model;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.DynamicUpdate;

import com.softcafe.esignature.entity.Regex;
import com.softcafe.esignature.entity.SecurityQuestion;
import com.softcafe.esignature.entity.SecurityQuestionAnswer;

@SuppressWarnings("serial")
@Entity
@Table(name="T_USER_AUDIT")
@DynamicUpdate
public class UserAudit extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USER_AUDIT_SEQ_GEN") //for oracle
    @SequenceGenerator(sequenceName = "USER_AUDIT_SEQ_GEN", allocationSize = 1, name = "USER_AUDIT_SEQ_GEN") //for oracle
	@Column(name = "id_user_audit_key")
	private Long auditUserId;
	
	@Column(name = "id_user_key")
	private Long userId;
    @Column(name = "tx_employee_id")
	private String empId;
	@Column(name = "id_user_ver")
	private Integer userVer;
	@Column(name = "tx_app_name")
	private String appName;
	@Column(name = "tx_first_name")
	private String firstName;
	@Column(name = "tx_middle_name")
	private String middleName;
	@Column(name = "tx_last_name")
	private String lastName;
	@Column(name = "tx_full_name")
	private String fullName;
	@Column(name = "dtt_dob")
	private Date dob;
	@Column(name = "dtt_inactive")
	private Date inactiveDate;
	@Column(name = "tx_nid")
	private String nid;
	
	@Column(name = "tx_country")
	private String country;
	@Column(name = "tx_phone_number")
	private String phoneNumber;
	@Column(name = "tx_email")
	private String email;
	@Column(name = "tx_login_name")
	private String loginName;
	@Column(name = "tx_password")
	private String password;
	@Column(name = "tx_gender")
	private String gender;
	@Column(name = "tx_religion")
	private String religion;
	@Column(name = "int_allow_login")
	private Integer allowLogin;
	@Column(name = "int_pass_expired")
	private Integer passExpired;
	@Column(name = "int_two_factor_auth")
	private Integer twoFactorAuth;// two factor authentication
	@Column(name = "tx_profile")
	private String profileImage;
	
	
	@Column(name = "tx_verify_code")
	private String verificationCode;

	
	
	@Column(name = "tx_new_pass")
	private String newPass; // use when change password
	@Column(name = "tx_tmp_pass")
	private String tmpPass;// use when forgot password
	
	@Column(name = "id_legal_entity_key")
	private Integer branchId;
	
	@Column(name = "tx_ext_branchName")
	private String extBranchName;
	
	@Column(name = "tx_login_method")
	private String logingMethod;
	
	@Column(name = "TX_DESIGNATION")
	private String designation;
	
	@Column(name = "TX_REMARKS")
	private String remarks;
	
	@Column(name = "TX_USER_TYPE")
	private String userType;
	
	@Column(name = "INT_FIRST_LOGIN")
	private int firstLogin;

	@Column(name = "TX_USER_STATUS", length =36)
	private String userStatus;
	
	@Column(name = "TX_USER_BLOCK_CAUSE", length =56)
	private String userBlockCause;
	
	@Column(name = "ID_INSTITUTION_KEY")
	private Long institutionId;
	
	@Column(name = "id_department")
	private Long departmentId;
	
	@Column(name = "IS_MASTER_USER")
	private int isMasterUser;
	
	
	@Transient
	private String defaultAdPass;
	
	@Transient
	private String userStringId;
	
	
	@Transient
	private String branchName;
	@Transient
	private String status;
	
	@Transient
	private String commonActivity;
	
	@Transient
	private List<Long> departmentIdList;
	
	@Transient
    private List<Long> roleIdList;
	
	@Transient
	private List<SecurityQuestion> securityQuestionList;
	
	@Transient
	private String link;
	
	@Transient
	private String institutionName;
	
	@Transient
	private Long loginId;
	@Transient
	private String otp;
	@Transient
	private String msg;
	
	
	
	//-------------------- END TABLE COLUMN-------------------------------------------------------------
	
	
	// this variable for interal use
	
	
	
	@Transient
	private List<User> userList;
	@Transient
	private List<Role> roleList;// role assign for this user
	@Transient
	private List<Role> unassignRoleList;// role than are not assign for this user
	
	@Transient
	private List<AppPermission> appPermissionList;// AppPermission assign for this user
	
	@Transient
	private List<RoleGroup> roleGroupList;// role assign for this user
	
	@Transient
	private List<RoleGroup> unassignRoleGroupList;// role than are not assign for this user


	@Transient
	private List<SecurityQuestionAnswer> questionAnswer;
	
	@Transient
	private int pageNumber;
	
	@Transient
	private int pageSize;
	
	@Transient
	private List<Regex> regexList;
	
	public List<RoleGroup> getRoleGroupList() {
		return roleGroupList;
	}
	public void setRoleGroupList(List<RoleGroup> roleGroupList) {
		this.roleGroupList = roleGroupList;
	}
	public List<RoleGroup> getUnassignRoleGroupList() {
		return unassignRoleGroupList;
	}
	public void setUnassignRoleGroupList(List<RoleGroup> unassignRoleGroupList) {
		this.unassignRoleGroupList = unassignRoleGroupList;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public Integer getUserVer() {
		return userVer;
	}
	public void setUserVer(Integer userVer) {
		this.userVer = userVer;
	}
	public String getAppName() {
		return appName;
	}
	public void setAppName(String appName) {
		this.appName = appName;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getMiddleName() {
		return middleName;
	}
	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public Date getDob() {
		return dob;
	}
	public void setDob(Date dob) {
		this.dob = dob;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getReligion() {
		return religion;
	}
	public void setReligion(String religion) {
		this.religion = religion;
	}
	public Integer getAllowLogin() {
		return allowLogin;
	}
	public void setAllowLogin(Integer allowLogin) {
		this.allowLogin = allowLogin;
	}
	public Integer getPassExpired() {
		return passExpired;
	}
	public void setPassExpired(Integer passExpired) {
		this.passExpired = passExpired;
	}
	public Integer getTwoFactorAuth() {
		return twoFactorAuth;
	}
	public void setTwoFactorAuth(Integer twoFactorAuth) {
		this.twoFactorAuth = twoFactorAuth;
	}
	public String getVerificationCode() {
		return verificationCode;
	}
	public void setVerificationCode(String verificationCode) {
		this.verificationCode = verificationCode;
	}
	public String getNewPass() {
		return newPass;
	}
	public void setNewPass(String newPass) {
		this.newPass = newPass;
	}
	public String getTmpPass() {
		return tmpPass;
	}
	public void setTmpPass(String tmpPass) {
		this.tmpPass = tmpPass;
	}
	public List<User> getUserList() {
		return userList;
	}
	public void setUserList(List<User> userList) {
		this.userList = userList;
	}
	public List<Role> getRoleList() {
		return roleList;
	}
	public void setRoleList(List<Role> roleList) {
		this.roleList = roleList;
	}
	public List<Role> getUnassignRoleList() {
		return unassignRoleList;
	}
	public void setUnassignRoleList(List<Role> unassignRoleList) {
		this.unassignRoleList = unassignRoleList;
	}
	
	public Integer getBranchId() {
		return branchId;
	}
	public void setBranchId(Integer branchId) {
		this.branchId = branchId;
	}
	public String getLogingMethod() {
		return logingMethod;
	}
	public void setLogingMethod(String logingMethod) {
		this.logingMethod = logingMethod;
	}
	public String getDefaultAdPass() {
		return defaultAdPass;
	}
	public void setDefaultAdPass(String defaultAdPass) {
		this.defaultAdPass = defaultAdPass;
	}
	public String getBranchName() {
		return branchName;
	}
	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}
	public List<Long> getDepartmentIdList() {
		return departmentIdList;
	}
	public void setDepartmentIdList(List<Long> departmentIdList) {
		this.departmentIdList = departmentIdList;
	}
	public List<AppPermission> getAppPermissionList() {
		return appPermissionList;
	}
	public void setAppPermissionList(List<AppPermission> appPermissionList) {
		this.appPermissionList = appPermissionList;
	}
	public String getCommonActivity() {
		return commonActivity;
	}
	public void setCommonActivity(String commonActivity) {
		this.commonActivity = commonActivity;
	}
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	public List<SecurityQuestion> getSecurityQuestionList() {
		return securityQuestionList;
	}
	public void setSecurityQuestionList(List<SecurityQuestion> securityQuestionList) {
		this.securityQuestionList = securityQuestionList;
	}
	public synchronized String getDesignation() {
		return designation;
	}
	public synchronized void setDesignation(String designation) {
		this.designation = designation;
	}
	public String getLink() {
		return link;
	}
	public void setLink(String link) {
		this.link = link;
	}
	public int getFirstLogin() {
		return firstLogin;
	}
	public void setFirstLogin(int firstLogin) {
		this.firstLogin = firstLogin;
	}
	public String getUserStatus() {
		return userStatus;
	}
	public void setUserStatus(String userStatus) {
		this.userStatus = userStatus;
	}
	public Long getInstitutionId() {
		return institutionId;
	}
	public void setInstitutionId(Long institutionId) {
		this.institutionId = institutionId;
	}
	public String getInstitutionName() {
		return institutionName;
	}
	public void setInstitutionName(String institutionName) {
		this.institutionName = institutionName;
	}
	public int getIsMasterUser() {
		return isMasterUser;
	}
	public void setIsMasterUser(int isMasterUser) {
		this.isMasterUser = isMasterUser;
	}
	public int getPageNumber() {
		return pageNumber;
	}
	public void setPageNumber(int pageNumber) {
		this.pageNumber = pageNumber;
	}
	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
	public List<SecurityQuestionAnswer> getQuestionAnswer() {
		return questionAnswer;
	}
	public void setQuestionAnswer(List<SecurityQuestionAnswer> questionAnswer) {
		this.questionAnswer = questionAnswer;
	}
	public String getUserBlockCause() {
		return userBlockCause;
	}
	public void setUserBlockCause(String userBlockCause) {
		this.userBlockCause = userBlockCause;
	}
	public Long getLoginId() {
		return loginId;
	}
	public void setLoginId(Long loginId) {
		this.loginId = loginId;
	}
	public String getOtp() {
		return otp;
	}
	public void setOtp(String otp) {
		this.otp = otp;
	}
	public List<Regex> getRegexList() {
		return regexList;
	}
	public void setRegexList(List<Regex> regexList) {
		this.regexList = regexList;
	}
	public String getNid() {
		return nid;
	}
	public void setNid(String nid) {
		this.nid = nid;
	}
	public Date getInactiveDate() {
		return inactiveDate;
	}
	public void setInactiveDate(Date inactiveDate) {
		this.inactiveDate = inactiveDate;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getExtBranchName() {
		return extBranchName;
	}
	public void setExtBranchName(String extBranchName) {
		this.extBranchName = extBranchName;
	}
	public String getProfileImage() {
		return profileImage;
	}
	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}
	public String getEmpId() {
		return empId;
	}
	public void setEmpId(String empId) {
		this.empId = empId;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public Long getDepartmentId() {
		return departmentId;
	}
	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getUserStringId() {
		return userStringId;
	}
	public void setUserStringId(String userStringId) {
		this.userStringId = userStringId;
	}
	public List<Long> getRoleIdList() {
		return roleIdList;
	}
	public void setRoleIdList(List<Long> roleIdList) {
		this.roleIdList = roleIdList;
	}
	
	
	

}
