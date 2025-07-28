package com.softcafe.esignature.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import com.softcafe.core.model.BaseEntity;

@SuppressWarnings("serial")
@Entity
@Table(name = "T_SIGNATORY")
public class Signatory extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "SIGNATORY_GEN")
	@SequenceGenerator(name = "SIGNATORY_GEN", sequenceName = "SIGNATORY_SEQ", allocationSize = 1)
	@Column(name = "ID_SIGNATORY_KEY")
	private Long signatoryId;

	@Column(name = "TX_NAME", length = 56)
	private String name;

	@Column(name = "TX_DESIGNATION", length = 56)
	private String designation;

	@Column(name = "TX_ADDRESS", length = 256)
	private String address;

	@Column(name = "TX_CANCLE_CAUSE", length = 256)
	private String cancelCause;

	@Column(name = "TX_APPROVAL", length = 32)
	private String approval;

	@Column(name = "TX_DEPARTMENT", length = 56)
	private String department;

	@Column(name = "TX_PA", length = 56)
	private String pa;
	
	@Column(name = "TX_NID", length = 56)
	private String nid;

	@Column(name = "TX_EMAIL", length = 56)
	private String email;

	@Column(name = "TX_TYPE", length = 56)
	private String type;

	@Column(name = "TX_STATUS", length = 56)
	private String status;
	@Column(name = "TX_GROUP", length = 16)
	private String group;
	@Column(name = "TX_DELIGATION", length = 156)
	private String deligation;

	@Column(name = "ID_INSTITUTION_KEY")
	private Long institutionId;

	@Column(name = "ID_APPROVE_BY")
	private Long approveBy;

	@Column(name = "DT_APPROVE_TIME")
	private Date approveDate;

	@Column(name = "ID_AUTHORIZE_BY")
	private Long autorizeBy;

	@Column(name = "DT_AUTHORIZE_TIME")
	private Date autorizeDate;

	@Column(name = "TX_EMPLOYEE_ID", length = 36)
	private String employeeId;
	@Column(name = "TX_BRANCH_NAME", length = 56)
	private String baranchName;
//    @Column(name = "TX_DEPARTMENT_NAME", length = 56)
//    private String departmentName;
	@Column(name = "DT_BIRTHDAY")
	@Temporal(TemporalType.DATE)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date birthday;
	@Column(name = "DT_ISSUE", length = 56)
	@Temporal(TemporalType.DATE)
	private Date issueDate;
	@Column(name = "TX_CONTACT_NUMBER", length = 24)
	private String contactNumber;

	@Column(name = "TX_PA_STATUS", length = 24)
	private String paStatus;
	
	@Column(name = "tx_identify", length = 24)
	private String identify;
	
	@Column(name = "tx_reject_cause", length = 120)
	private String rejectCause;

	@Transient
	List<Signatory> allSignatory;

	@Transient
	List<Signatory> requestSignatory;

	@Transient
	private MultipartFile approvalFile;

	@Transient
	private MultipartFile agreementFile;

	@Transient
	private String userType;

	@Transient
	private String insType;

	@Transient
	private Integer pageSize;

	@Transient
	private Integer pageNumber;

	@Transient
	private long total;

	
	public Signatory() {
	}

	public Signatory(SignatureInfo dbSg) {
		// TODO Auto-generated constructor stub
		if(dbSg != null) {
			employeeId = dbSg.getEmployeeId();
			name = dbSg.getName();
			designation = dbSg.getDesignation();
			baranchName = dbSg.getBaranchName();
			contactNumber = dbSg.getContactNumber();
			email = dbSg.getEmail();
			paStatus = dbSg.getSignatureStatus();
			pa = dbSg.getPa();
			paStatus = dbSg.getStatus();
			rejectCause = dbSg.getRejectionCause();
			deligation = dbSg.getDeligation();
		}
	}
	
	public void setSignatoryId(Long signatoryId) {
		this.signatoryId = signatoryId;
	}

	public Long getSignatoryId() {
		return signatoryId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getApproval() {
		return approval;
	}

	public void setApproval(String approval) {
		this.approval = approval;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getPa() {
		return pa;
	}

	public void setPa(String pa) {
		this.pa = pa;
	}

	public List<Signatory> getAllSignatory() {
		return allSignatory;
	}

	public void setAllSignatory(List<Signatory> allSignatory) {
		this.allSignatory = allSignatory;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<Signatory> getRequestSignatory() {
		return requestSignatory;
	}

	public void setRequestSignatory(List<Signatory> requestSignatory) {
		this.requestSignatory = requestSignatory;
	}

	public MultipartFile getApprovalFile() {
		return approvalFile;
	}

	public void setApprovalFile(MultipartFile approvalFile) {
		this.approvalFile = approvalFile;
	}

	public MultipartFile getAgreementFile() {
		return agreementFile;
	}

	public void setAgreementFile(MultipartFile agreementFile) {
		this.agreementFile = agreementFile;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Long getInstitutionId() {
		return institutionId;
	}

	public void setInstitutionId(Long institutionId) {
		this.institutionId = institutionId;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getInsType() {
		return insType;
	}

	public void setInsType(String insType) {
		this.insType = insType;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public Integer getPageNumber() {
		return pageNumber;
	}

	public void setPageNumber(Integer pageNumber) {
		this.pageNumber = pageNumber;
	}

	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	public Long getApproveBy() {
		return approveBy;
	}

	public void setApproveBy(Long approveBy) {
		this.approveBy = approveBy;
	}

	public Date getApproveDate() {
		return approveDate;
	}

	public void setApproveDate(Date approveDate) {
		this.approveDate = approveDate;
	}

	public Long getAutorizeBy() {
		return autorizeBy;
	}

	public void setAutorizeBy(Long autorizeBy) {
		this.autorizeBy = autorizeBy;
	}

	public Date getAutorizeDate() {
		return autorizeDate;
	}

	public void setAutorizeDate(Date autorizeDate) {
		this.autorizeDate = autorizeDate;
	}

	public String getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}

	public String getBaranchName() {
		return baranchName;
	}

	public void setBaranchName(String baranchName) {
		this.baranchName = baranchName;
	}

//	public String getDepartmentName() {
//		return departmentName;
//	}
//
//	public void setDepartmentName(String departmentName) {
//		this.departmentName = departmentName;
//	}

	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public Date getIssueDate() {
		return issueDate;
	}

	public void setIssueDate(Date issueDate) {
		this.issueDate = issueDate;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public String getPaStatus() {
		return paStatus;
	}

	public void setPaStatus(String paStatus) {
		this.paStatus = paStatus;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getDeligation() {
		return deligation;
	}

	public void setDeligation(String deligation) {
		this.deligation = deligation;
	}

	public String getCancelCause() {
		return cancelCause;
	}

	public void setCancelCause(String cancelCause) {
		this.cancelCause = cancelCause;
	}

	public String getNid() {
		return nid;
	}

	public void setNid(String nid) {
		this.nid = nid;
	}

	public String getIdentify() {
		return identify;
	}

	public void setIdentify(String identify) {
		this.identify = identify;
	}

	public String getRejectCause() {
		return rejectCause;
	}

	public void setRejectCause(String rejectCause) {
		this.rejectCause = rejectCause;
	}
	

}
