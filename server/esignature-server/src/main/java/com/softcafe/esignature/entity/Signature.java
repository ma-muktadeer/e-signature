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

import com.softcafe.core.model.BaseEntity;
import com.softcafe.core.model.DocumentFiles;
import com.softcafe.esignature.model.FileUploadErrMsg;


@Entity
@Table(name = "T_SIGNATURE")
public class Signature extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SIGNATURE_SQL") //for oracle
    @SequenceGenerator(sequenceName = "SIGNATURE_SQL", allocationSize = 1, name = "SIGNATURE_SQL") //for oracle
    @Column(name = "ID_SIGNATURE_KEY")
    private Long signatureId;
    
    @Column(name = "ID_SIGNATORY_KEY")
    private Long signatoryId;

    @Column(name = "DTT_EFFECTIVE_DATE")
    @Temporal(TemporalType.DATE)
    private Date effictiveDate;
    
    @Column(name = "TX_SIGNATURE_PATH", length = 124)
    private String signaturePath;
    
    @Column(name = "TX_SIGNATURE_STATUS", length = 24)
    private String signatureStatus;
    
    @Column(name = "TX_SIGNATURE_OLD_STATUS", length = 24)
    private String signatureOldStatus;
    
   
    @Column(name = "TX_STATUS", length = 24)
    private String status;
    
    @Column(name = "TX_REJECTION_CAUSE", length = 555)
    private String rejectionCause;
    
    @Column(name = "TX_CANCEL_CAUSE", length = 555)
    private String calcelCause;

    @Column(name = "DT_CANCEL_TIME")
    private Date cancelTime;
    
    @Column(name = "DT_INACTIVE_TIME")
    private Date inactiveTime;
    
    @Column(name = "TX_REMARKS")
    private String remarks;
    
    @Column(name = "DT_CANCEL_EFFECTIVE_DATE")
    private Date cancelEffectiveDate;
    
    @Column(name = "ID_DELETE_BY")
    private Long deleteBy;
    
    @Column(name = "ID_CANCEL_BY")
    private Long cancleBy;
    
    @Column(name = "ID_AUTH_BY")
    private Long authorizeBy;
    
    @Column(name = "DT_AUTH_DATE")
    private Date authorizeDate;
    
    @Column(name = "DT_DELETE_DATE")
    private Date deleteDate;
    
    @Column(name = "TX_SIGNATURE_TYPE")
    private String signatureType;
    

    @Column(name= "IS_MAIN_SIGNATURE")
    private int isMainSignature;
    
    @Transient
    private String pa;

    @Transient
    private String name;

    @Transient
    private String designation;
    
    @Transient
    private String email;
    
    
    @Transient
    private String employeeId;
    @Transient
    private String baranchName;
    @Transient
    private String departmentName;
    @Transient
    @Temporal(TemporalType.DATE)
    private Date birthday;
    @Transient
    @Temporal(TemporalType.DATE)
    private Date issueDate;
    @Transient
    private String contactNumber;
    @Transient
    private String paStatus;
    @Transient
    private Long institutionId;
    
    
    @Transient
    private String coreSignaturePath;
    
    
    
    @Transient
    private List<FileUploadErrMsg> fileUploadMsg;
    
    @Transient
    private int uploadFileCount;
    

    @Transient
    private List<String> base64Image;
    
    @Transient
    private String effictiveDateString;
    

    @Transient
    private String mainSignature;
    
	@Transient
	private List<DocumentFiles> fileList ;
    
//
//    @Transient
//    private List<Signature> allSignature;
//
//    @Transient
//    private List<Signature> updateSignature;
//


    public void setSignatureId(Long signatureId) {
        this.signatureId = signatureId;
    }

    public Long getSignatureId() {
        return signatureId;
    }

	
	public Long getSignatoryId() {
		return signatoryId;
	}

	public void setSignatoryId(Long signatoryId) {
		this.signatoryId = signatoryId;
	}

	public  String getPa() {
		return pa;
	}

	public  void setPa(String pa) {
		this.pa = pa;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public  String getDesignation() {
		return designation;
	}

	public  void setDesignation(String designation) {
		this.designation = designation;
	}

	public  Date getEffictiveDate() {
		return effictiveDate;
	}

	public  void setEffictiveDate(Date effictiveDate) {
		this.effictiveDate = effictiveDate;
	}

	
	public  String getSignaturePath() {
		return signaturePath;
	}

	public  void setSignaturePath(String signaturePath) {
		this.signaturePath = signaturePath;
	}

	public  String getSignatureStatus() {
		return signatureStatus;
	}

	public  void setSignatureStatus(String signatureStatus) {
		this.signatureStatus = signatureStatus;
	}

	public  String getCoreSignaturePath() {
		return coreSignaturePath;
	}

	public  void setCoreSignaturePath(String coreSignaturePath) {
		this.coreSignaturePath = coreSignaturePath;
	}

	
	public  String getEmail() {
		return email;
	}

	public  void setEmail(String email) {
		this.email = email;
	}

	public Date getInactiveTime() {
		return inactiveTime;
	}

	public void setInactiveTime(Date inactiveTime) {
		this.inactiveTime = inactiveTime;
	}

	public Date getCancelEffectiveDate() {
		return cancelEffectiveDate;
	}

	public void setCancelEffectiveDate(Date cancelEffectiveDate) {
		this.cancelEffectiveDate = cancelEffectiveDate;
	}

	public  String getStatus() {
		return status;
	}

	public  void setStatus(String status) {
		this.status = status;
	}
	
	
	public  String getRejectionCause() {
		return rejectionCause;
	}

	public  void setRejectionCause(String rejectionCause) {
		this.rejectionCause = rejectionCause;
	}

	public  List<FileUploadErrMsg> getFileUploadMsg() {
		return fileUploadMsg;
	}

	public  void setFileUploadMsg(List<FileUploadErrMsg> fileUploadMsg) {
		this.fileUploadMsg = fileUploadMsg;
	}

	
	public  int getUploadFileCount() {
		return uploadFileCount;
	}

	public  void setUploadFileCount(int uploadFileCount) {
		this.uploadFileCount = uploadFileCount;
	}

	

	public List<String> getBase64Image() {
		return base64Image;
	}

	public void setBase64Image(List<String> base64Image) {
		this.base64Image = base64Image;
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

	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
	}

	public String getEffictiveDateString() {
		return effictiveDateString;
	}

	public void setEffictiveDateString(String effictiveDateString) {
		this.effictiveDateString = effictiveDateString;
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

	public String getMainSignature() {
		return mainSignature;
	}

	public void setMainSignature(String mainSignature) {
		this.mainSignature = mainSignature;
	}

	public Long getDeleteBy() {
		return deleteBy;
	}

	public void setDeleteBy(Long deleteBy) {
		this.deleteBy = deleteBy;
	}

	public Date getDeleteDate() {
		return deleteDate;
	}

	public void setDeleteDate(Date deleteDate) {
		this.deleteDate = deleteDate;
	}

	public List<DocumentFiles> getFileList() {
		return fileList;
	}

	public void setFileList(List<DocumentFiles> fileList) {
		this.fileList = fileList;
	}

	public Long getCancleBy() {
		return cancleBy;
	}

	public void setCancleBy(Long cancleBy) {
		this.cancleBy = cancleBy;
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

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

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

	public Long getInstitutionId() {
		return institutionId;
	}

	public void setInstitutionId(Long institutionId) {
		this.institutionId = institutionId;
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

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getSignatureOldStatus() {
		return signatureOldStatus;
	}

	public void setSignatureOldStatus(String signatureOldStatus) {
		this.signatureOldStatus = signatureOldStatus;
	}

    
}
