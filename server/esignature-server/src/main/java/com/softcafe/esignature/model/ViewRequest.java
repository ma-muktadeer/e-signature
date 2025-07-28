package com.softcafe.esignature.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "VW_REQUEST")
public class ViewRequest {

	@Id
	@Column(name = "ID_EXTERNAL_USER_REQUEST_KEY")
	private Long externalUserRequestId;
	
	@Column(name = "ID_USER_CREATE_KEY")
	private Long userCreateId;

	@Column(name = "ID_INSTITUTION_KEY")
	private Long institutionId;

	@Column(name = "TX_REQUEST_STATUS")
	private String requestStatus;

	@Column(name = "TX_REQUEST_TIME")
	private String requestTime;
	
	@Column(name = "DTT_MOD")
	private Date modTime;

	@Column(name = "TX_REQUEST_TYPE")
	private String requestType;

	@Column(name = "TX_EMAIL")
	private String email;

	@Column(name = "TX_NAME")
	private String name;

	@Column(name = "TX_PA")
	private String pa;

	@Column(name = "TX_DEPARTMENT")
	private String department;

	@Column(name = "TX_DESIGNATION")
	private String designation;

	@Column(name = "TX_REQUESTER_EMAIL")
	private String requesterEmail;

	@Column(name = "TX_REQUESTER_NAME")
	private String requesterName;

	@Column(name = "TX_INSTITUTION_NAME")
	private String institutionName;
	
	@Column(name = "DT_COMPLETE")
	private Date completeDate;
	
	@Column(name = "TX_DESCRIPTION")
	private String description;
	
	@Column(name = "TX_USER_REQ_TYPE")
	private String userRequestType;
	
	@Column(name = "TX_USER_REQ_FORM")
	private String userRequestForm;	

	@Column(name = "TX_PUBLIC_LINK_TYPE")
	private String publicLinkType;

	@Column(name = "TX_PUBLIC_LINK_SEND")
	private String publicLinkSend;
	
	@Column(name = "TX_IMAGE")
	private String userImage;

	@Column(name = "INT_VIEW_PUBLIK_LINK")
	private Integer isViewLink;
	

	@Column(name = "TX_REQ_USR_INS_NAME")
	private String reqUserInsName;
	
	@Column(name = "TX_LINK")
	private String link;
	
	@Column(name = "TX_REJECTED_BY")
	private String rejectedBy;
	
	@Column(name = "TX_REJECT_CAUSE")
	private String rejectedCause;
	
	@Column(name = "DT_FROM_DATE")
	private Date fromDate;

	@Column(name = "DT_TO_DATE")
	private Date toDate;
	
	@Column(name = "TX_CHECKED_BY")
	private String checkedBy;
	
	@Column(name = "TX_COMPLETED_BY")
	private String completedBy;
	
	@Column(name = "CHECKER_DATE")
	private Date checkerDate;
	
	@Column(name = "COMPLETE_DATE")
	private Date completeDateRequest;
	
	@Transient
	private int pageNumber;
	
	@Transient
	private int pageSize;
	
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Column(name = "INT_SIGNATORY_KEY")
	private long signatoryId;
	
	@Column(name = "TX_COMPLETE_BY")
	private String completeBy;

	public Long getExternalUserRequestId() {
		return externalUserRequestId;
	}

	public void setExternalUserRequestId(Long externalUserRequestId) {
		this.externalUserRequestId = externalUserRequestId;
	}

	public Long getUserCreateId() {
		return userCreateId;
	}

	public void setUserCreateId(Long userCreateId) {
		this.userCreateId = userCreateId;
	}

	public String getRequestStatus() {
		return requestStatus;
	}

	public void setRequestStatus(String requestStatus) {
		this.requestStatus = requestStatus;
	}

	public String getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(String requestTime) {
		this.requestTime = requestTime;
	}

	public String getRequestType() {
		return requestType;
	}

	public void setRequestType(String requestType) {
		this.requestType = requestType;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPa() {
		return pa;
	}

	public void setPa(String pa) {
		this.pa = pa;
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

	public String getRequesterEmail() {
		return requesterEmail;
	}

	public void setRequesterEmail(String requesterEmail) {
		this.requesterEmail = requesterEmail;
	}

	public String getRequesterName() {
		return requesterName;
	}

	public void setRequesterName(String requesterName) {
		this.requesterName = requesterName;
	}

	public String getInstitutionName() {
		return institutionName;
	}

	public void setInstitutionName(String institutionName) {
		this.institutionName = institutionName;
	}

	public Date getCompleteDate() {
		return completeDate;
	}

	public void setCompleteDate(Date completeDate) {
		this.completeDate = completeDate;
	}

	public String getCompleteBy() {
		return completeBy;
	}

	public void setCompleteBy(String completeBy) {
		this.completeBy = completeBy;
	}

	public long getSignatoryId() {
		return signatoryId;
	}

	public void setSignatoryId(long signatoryId) {
		this.signatoryId = signatoryId;
	}

	public Long getInstitutionId() {
		return institutionId;
	}

	public void setInstitutionId(Long institutionId) {
		this.institutionId = institutionId;
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

	public String getUserRequestType() {
		return userRequestType;
	}

	public void setUserRequestType(String userRequestType) {
		this.userRequestType = userRequestType;
	}

	public String getUserRequestForm() {
		return userRequestForm;
	}

	public void setUserRequestForm(String userRequestForm) {
		this.userRequestForm = userRequestForm;
	}

	public String getPublicLinkType() {
		return publicLinkType;
	}

	public void setPublicLinkType(String publicLinkType) {
		this.publicLinkType = publicLinkType;
	}

	public String getPublicLinkSend() {
		return publicLinkSend;
	}

	public void setPublicLinkSend(String publicLinkSend) {
		this.publicLinkSend = publicLinkSend;
	}

	public Integer getIsViewLink() {
		return isViewLink;
	}

	public void setIsViewLink(Integer isViewLink) {
		this.isViewLink = isViewLink;
	}

	public String getReqUserInsName() {
		return reqUserInsName;
	}

	public void setReqUserInsName(String reqUserInsName) {
		this.reqUserInsName = reqUserInsName;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}
	
	

	public String getRejectedBy() {
		return rejectedBy;
	}

	public void setRejectedBy(String rejectedBy) {
		this.rejectedBy = rejectedBy;
	}

	public String getRejectedCause() {
		return rejectedCause;
	}

	public void setRejectedCause(String rejectedCause) {
		this.rejectedCause = rejectedCause;
	}

	public Date getFromDate() {
		return fromDate;
	}

	public void setFromDate(Date fromDate) {
		this.fromDate = fromDate;
	}

	public Date getToDate() {
		return toDate;
	}

	public void setToDate(Date toDate) {
		this.toDate = toDate;
	}

	public String getUserImage() {
		return userImage;
	}

	public void setUserImage(String userImage) {
		this.userImage = userImage;
	}

	public Date getModTime() {
		return modTime;
	}

	public void setModTime(Date modTime) {
		this.modTime = modTime;
	}

	public String getCheckedBy() {
		return checkedBy;
	}

	public void setCheckedBy(String checkedBy) {
		this.checkedBy = checkedBy;
	}

	public String getCompletedBy() {
		return completedBy;
	}

	public void setCompletedBy(String completedBy) {
		this.completedBy = completedBy;
	}

	public Date getCheckerDate() {
		return checkerDate;
	}

	public void setCheckerDate(Date checkerDate) {
		this.checkerDate = checkerDate;
	}

	public Date getCompleteDateRequest() {
		return completeDateRequest;
	}

	public void setCompleteDateRequest(Date completeDateRequest) {
		this.completeDateRequest = completeDateRequest;
	}
	
	

}
