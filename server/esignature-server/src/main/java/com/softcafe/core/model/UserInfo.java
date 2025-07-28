package com.softcafe.core.model;



import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="vw_user_information")
public class UserInfo{
	@Id
	@Column(name = "id_user_key")
	private Long  userId;
	
	@Column(name = "tx_employee_id")
	private String  employeeId;
	
	@Column(name = "id_branch_key")
	private Integer branchId;
	
	@Column(name = "tx_full_name")
	private String fullName;
	
	@Column(name = "tx_phone_number")
	private String phoneNumber;
	
	@Column(name = "tx_email")
	private String email;
	
	@Column(name = "tx_login_name")
	private String loginName;
	
	
	@Column(name = "id_designation_key")
	private Long designationId;
	
	
	@Column(name = "value_1")
	private String value1;
	
	@Column(name = "tx_name")
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
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

	public Long getDesignationId() {
		return designationId;
	}

	public void setDesignationId(Long designationId) {
		this.designationId = designationId;
	}


	public String getValue1() {
		return value1;
	}

	public void setValue1(String value1) {
		this.value1 = value1;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Integer getBranchId() {
		return branchId;
	}

	public void setBranchId(Integer branchId) {
		this.branchId = branchId;
	}

	
	
	
	
	
	
}
