package com.softcafe.esignature.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "VW_SIGNATURE_INFO")
public class SignatureInfo {

	@Id
	@Column(name = "ID_SIGNATURE_INFO_KEY")
	private Long signatureInfoId;
	

	@Column(name = "ID_INSTITUTION_KEY")
	private Long institutionId;

	@Column(name = "TX_PA")
	private String pa;

	@Column(name = "TX_EMPLOYEE_ID")
	private String employeeId;

	@Column(name = "TX_NAME")
	private String name;

	@Column(name = "TX_EMAIL")
	private String email;
	@Column(name = "INSTITUTION_NAME")
	private String institutionName;

	@Column(name = "TX_DEPARTMENT")
	private String department;

	@Column(name = "TX_DESIGNATION")
	private String designation;

	@Column(name = "TX_ADDRESS")
	private String address;

	@Column(name = "TX_BRANCH_NAME")
	private String baranchName;

	@Column(name = "TX_APPROVAL")
	private String approval;

	@Column(name = "IS_SIGNATORY_ACTIVE")
	protected Integer isSignatoryActive;

	@Column(name = "IS_SIGNATURE_ACTIVE")
	protected Integer isSignatureActive;

	@Column(name = "ID_SIGNATORY_KEY")
	private Long signatoryId;

	@Column(name = "ID_SIGNATURE_KEY")
	private Long signatureId;

	@Column(name = "DTT_EFFECTIVE_DATE")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date effictiveDate;

	@Column(name = "DT_PA_AUTH_DATE")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date paAuthDate;
	

	@Column(name = "DTT_SIGNATURE_CREATE")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date signatureCreateDate;

	@Column(name = "TX_SIGNATURE_PATH")
	private String signaturePath;

	@Column(name = "TX_SIGNATURE_STATUS")
	private String signatureStatus;

	@Column(name = "TX_STATUS")
	private String status;

	@Column(name = "TX_REJECTION_CAUSE")
	private String rejectionCause;

	@Column(name = "TX_CANCEL_CAUSE")
	private String calcelCause;

	@Column(name = "DT_CANCEL_TIME")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date cancelTime;

	@Column(name = "DT_BIRTHDAY")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date birthday;

	@Column(name = "IS_ACTIVE")
	private Integer active;

	@Column(name = "DT_CANCEL_EFFECTIVE_DATE")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date cancelEffectiveDate;

	@Column(name = "DT_INACTIVE_TIME")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date inactiveTime;

	@Column(name = "DTT_MOD")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date modDate;

	@Column(name = "TX_SIGNATURE_TYPE")
	private String signatureType;

	@Column(name = "IS_MAIN_SIGNATURE")
	private int isMainSignature;

	@Column(name = "INT_OWN_INSTITUTION")
	private int ownInstitution;

	@Column(name = "TX_DELIGATION")
	private String deligation;

	@Column(name = "TX_CONTACT_NUMBER")
	private String contactNumber;

	@Column(name = "TX_GROUP")
	private String group;

	@Column(name = "ID_APPROVE_BY")
	private Long approveBy;

	@Column(name = "DT_APPROVE_DATE")
	private Date approveDate;

	@Column(name = "ID_AUTH_BY")
	private Long authorizeBy;

	@Column(name = "DT_AUTH_DATE")
	private Date authorizeDate;
	
	@Column(name = "TX_REMARKS")
    private String remarks;
	
	@Column(name = "DTT_AGREEMENT_FILE")
	private Date agreementFileDate;
	
	@Column(name = "DTT_APPROVAL_FILE")
	private Date approvalFileDate;
	
//	@Column(name = "DT_DELETE_DATE")
//	private Date deleteDate;
	
//	@Column(name = "DTT_UPDATE")
//	private Date updateDate;
	
	@Column(name = "TX_NID")
    private String nid;
	@Column(name = "ID_PA_APPROVE_BY")
	private Long idPaApproveBy;
	
	@Column(name = "DT_PA_APPROVE_DATE")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date paApproveDate;
	
	@Column(name = "ID_PA_AUTH_BY")
	private Long idPaAuthBy;
	
	@Column(name = "DTT_DELETE")
	private Date deleteDate;


	@Transient
	private List<SignatureInfo> allSignature;

	@Transient
	private String sendingEmail;

	@Transient
	private List<SignatureInfo> updateSignature;

	@Transient
	private String base64Image;

	@Transient
	private MultipartFile cancelationApproval;

	@Transient
	private MultipartFile cancelation;

	@Transient
	private int pageNumber;

	@Transient
	private int pageSize;

	@Transient
	private long total;


	public List<SignatureInfo> getAllSignature() {
		return allSignature;
	}

	public void setAllSignature(List<SignatureInfo> allSignature) {
		this.allSignature = allSignature;
	}

	public String getBase64Image() {
		return base64Image;
	}

	public void setBase64Image(String base64Image) {
		this.base64Image = base64Image;
	}

	public Long getSignatureInfoId() {
		return signatureInfoId;
	}

	public void setSignatureInfoId(Long signatureInfoId) {
		this.signatureInfoId = signatureInfoId;
	}

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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
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

	public Integer getIsSignatoryActive() {
		return isSignatoryActive;
	}

	public void setIsSignatoryActive(Integer isSignatoryActive) {
		this.isSignatoryActive = isSignatoryActive;
	}

	public Integer getIsSignatureActive() {
		return isSignatureActive;
	}

	public void setIsSignatureActive(Integer isSignatureActive) {
		this.isSignatureActive = isSignatureActive;
	}

	public Long getSignatoryId() {
		return signatoryId;
	}

	public void setSignatoryId(Long signatoryId) {
		this.signatoryId = signatoryId;
	}

	public Long getSignatureId() {
		return signatureId;
	}

	public void setSignatureKey(Long signatureId) {
		this.signatureId = signatureId;
	}

	public Date getEffictiveDate() {
		return effictiveDate;
	}

	public void setEffictiveDate(Date effictiveDate) {
		this.effictiveDate = effictiveDate;
	}

	public String getSignaturePath() {
		return signaturePath;
	}

	public void setSignaturePath(String signaturePath) {
		this.signaturePath = signaturePath;
	}

	public String getSignatureStatus() {
		return signatureStatus;
	}

	public void setSignatureStatus(String signatureStatus) {
		this.signatureStatus = signatureStatus;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getRejectionCause() {
		return rejectionCause;
	}

	public void setRejectionCause(String rejectionCause) {
		this.rejectionCause = rejectionCause;
	}

	public String getCalcelCause() {
		return calcelCause;
	}

	public void setCalcelCause(String calcelCause) {
		this.calcelCause = calcelCause;
	}

	public Date getCancelTime() {
		return cancelTime;
	}

	public Integer getActive() {
		return active;
	}

	public void setActive(Integer active) {
		this.active = active;
	}

	public void setSignatureId(Long signatureId) {
		this.signatureId = signatureId;
	}

	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
	}

	public Date getCancelEffectiveDate() {
		return cancelEffectiveDate;
	}

	public void setCancelEffectiveDate(Date cancelEffectiveDate) {
		this.cancelEffectiveDate = cancelEffectiveDate;
	}

	public List<SignatureInfo> getUpdateSignature() {
		return updateSignature;
	}

	public void setUpdateSignature(List<SignatureInfo> updateSignature) {
		this.updateSignature = updateSignature;
	}

	public Date getInactiveTime() {
		return inactiveTime;
	}

	public void setInactiveTime(Date inactiveTime) {
		this.inactiveTime = inactiveTime;
	}

	public String getSignatureType() {
		return signatureType;
	}

	public void setSignatureType(String signatureType) {
		this.signatureType = signatureType;
	}

	public int getIsMainSignature() {
		return isMainSignature;
	}

	public void setIsMainSignature(int isMainSignature) {
		this.isMainSignature = isMainSignature;
	}

	public MultipartFile getCancelationApproval() {
		return cancelationApproval;
	}

	public void setCancelationApproval(MultipartFile cancelationApproval) {
		this.cancelationApproval = cancelationApproval;
	}

	public MultipartFile getCancelation() {
		return cancelation;
	}

	public void setCancelation(MultipartFile cancelation) {
		this.cancelation = cancelation;
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

	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	public String getSendingEmail() {
		return sendingEmail;
	}

	public void setSendingEmail(String sendingEmail) {
		this.sendingEmail = sendingEmail;
	}

	public Date getModDate() {
		return modDate;
	}

	public void setModDate(Date modDate) {
		this.modDate = modDate;
	}

	public String getInstitutionName() {
		return institutionName;
	}

	public void setInstitutionName(String institutionName) {
		this.institutionName = institutionName;
	}

	public int getOwnInstitution() {
		return ownInstitution;
	}

	public void setOwnInstitution(int ownInstitution) {
		this.ownInstitution = ownInstitution;
	}

	public Date getSignatureCreateDate() {
		return signatureCreateDate;
	}

	public void setSignatureCreateDate(Date signatureCreateDate) {
		this.signatureCreateDate = signatureCreateDate;
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

	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public Long getAuthorizeBy() {
		return authorizeBy;
	}

	public void setAuthorizeBy(Long authorizeBy) {
		this.authorizeBy = authorizeBy;
	}

	public Date getAuthorizeDate() {
		return authorizeDate;
	}

	public void setAuthorizeDate(Date authorizeDate) {
		this.authorizeDate = authorizeDate;
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

	public Long getInstitutionId() {
		return institutionId;
	}

	public void setInstitutionId(Long institutionId) {
		this.institutionId = institutionId;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public Date getPaAuthDate() {
		return paAuthDate;
	}

	public void setPaAuthDate(Date paAuthDate) {
		this.paAuthDate = paAuthDate;
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

//	public Date getDeleteDate() {
//		return deleteDate;
//	}
//
//	public void setDeleteDate(Date deleteDate) {
//		this.deleteDate = deleteDate;
//	}

//	public Date getUpdateDate() {
//		return updateDate;
//	}
//
//	public void setUpdateDate(Date updateDate) {
//		this.updateDate = updateDate;
//	}

	public String getNid() {
		return nid;
	}

	public void setNid(String nid) {
		this.nid = nid;
	}

	public Long getIdPaApproveBy() {
		return idPaApproveBy;
	}

	public void setIdPaApproveBy(Long idPaApproveBy) {
		this.idPaApproveBy = idPaApproveBy;
	}

	public Date getPaApproveDate() {
		return paApproveDate;
	}

	public void setPaApproveDate(Date paApproveDate) {
		this.paApproveDate = paApproveDate;
	}

	public Long getIdPaAuthBy() {
		return idPaAuthBy;
	}

	public void setIdPaAuthBy(Long idPaAuthBy) {
		this.idPaAuthBy = idPaAuthBy;
	}

	public Date getDeleteDate() {
		return deleteDate;
	}

	public void setDeleteDate(Date deleteDate) {
		this.deleteDate = deleteDate;
	}

	
	
}
