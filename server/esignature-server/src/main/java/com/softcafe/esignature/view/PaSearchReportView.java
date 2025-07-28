package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "VW_PA_REPORT_VIEWER")
public class PaSearchReportView {
	@Id
	@Column(name = "ID_PA_REPORT_KEY")
	private Long paReportKey;

	@Column(name = "TX_PA")
	private String pa;

	@Column(name = "TX_NAME")
	private String name;

	@Column(name = "TX_STATUS")
	private String status;

	@Column(name = "DT_CANCEL_TIME")
	private Date cancelTime;

	@Column(name = "DT_INACTIVE_TIME")
	private Date inactiveTime;

	@Column(name = "TX_INACTIVE_CAUSE")
	private String inactiveCause;

	@Column(name = "DTT_EFFECTIVE_DATE")
	private String effectiveDate;

	@Column(name = "TX_EMAIL")
	private String email;

	@Column(name = "TX_CONTACT_NUMBER")
	private String contactNumber;

	@Column(name = "DTT_CREATE")
	private Date createDate;

	@Column(name = "TX_DESIGNATION")
	private String designation;

	@Column(name = "TX_BRANCH_NAME")
	private String branchName;

	@Column(name = "TX_INSTITUTION_NAME")
	private String institutionName;

	@Column(name = "TX_DELIGATION")
	private String deligation;

	@Column(name = "TX_GROUP")
	private String group;

	@Column(name = "TX_NID")
	private String nid;

	@Column(name = "DT_BIRTHDAY")
	private Date birthday;

	@Column(name = "TX_CANCEL_CAUSE")
	private String cancelCause;

	@Column(name = "TX_EMPLOYEE_ID")
	private String employeeId;

	@Column(name = "DT_MAKER")
	private Date maker;

	@Column(name = "TX_MAKER_NAME")
	private String makerName;

	@Column(name = "TX_CHECKER_NAME")
	private String checkerName;

	@Column(name = "DT_AUTHORIZE_TIME")
	private Date authorizeTime;

	@Column(name = "INT_OWN_INSTITUTION")
	private Long ownIstitution;
	
	@Column(name = "DTT_AGREEMENT_FILE")
	private Date agreementFileDate;
	
	@Column(name = "DTT_APPROVAL_FILE")
	private Date approvalFileDate;
	
	@Column(name = "DTT_DELETE")
	private Date deleteDate;
	
	@Column(name = "DTT_UPDATE")
	private Date updateDate;

	public String getPa() {
		return pa;
	}

	public void setPa(String pa) {
		this.pa = pa;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getEffectiveDate() {
		return effectiveDate;
	}

	public void setEffectiveDate(String effectiveDate) {
		this.effectiveDate = effectiveDate;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
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

	public String getDeligation() {
		return deligation;
	}

	public void setDeligation(String deligation) {
		this.deligation = deligation;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getNid() {
		return nid;
	}

	public void setNid(String nid) {
		this.nid = nid;
	}

	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public String getCancelCause() {
		return cancelCause;
	}

	public void setCancelCause(String cancelCause) {
		this.cancelCause = cancelCause;
	}

	public String getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}

	public Date getMaker() {
		return maker;
	}

	public void setMaker(Date maker) {
		this.maker = maker;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getCancelTime() {
		return cancelTime;
	}

	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
	}

	public Date getInactiveTime() {
		return inactiveTime;
	}

	public void setInactiveTime(Date inactiveTime) {
		this.inactiveTime = inactiveTime;
	}

	public String getInactiveCause() {
		return inactiveCause;
	}

	public void setInactiveCause(String inactiveCause) {
		this.inactiveCause = inactiveCause;
	}

	public Long getPaReportKey() {
		return paReportKey;
	}

	public void setPaReportKey(Long paReportKey) {
		this.paReportKey = paReportKey;
	}

	public String getMakerName() {
		return makerName;
	}

	public void setMakerName(String makerName) {
		this.makerName = makerName;
	}

	public String getCheckerName() {
		return checkerName;
	}

	public void setCheckerName(String checkerName) {
		this.checkerName = checkerName;
	}

	public Date getAuthorizeTime() {
		return authorizeTime;
	}

	public void setAuthorizeTime(Date authorizeTime) {
		this.authorizeTime = authorizeTime;
	}

	public Long getOwnIstitution() {
		return ownIstitution;
	}

	public void setOwnIstitution(Long ownIstitution) {
		this.ownIstitution = ownIstitution;
	}

	public Date getAgreementFileDate() {
		return agreementFileDate;
	}

	public void setAgreementFileDate(Date agreementFileDate) {
		this.agreementFileDate = agreementFileDate;
	}

	public Date getApprovalFileDate() {
		return approvalFileDate;
	}

	public void setApprovalFileDate(Date approvalFileDate) {
		this.approvalFileDate = approvalFileDate;
	}

	public Date getDeleteDate() {
		return deleteDate;
	}

	public void setDeleteDate(Date deleteDate) {
		this.deleteDate = deleteDate;
	}

	
	
}
