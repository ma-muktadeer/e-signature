package com.softcafe.esignature.entity;

import java.util.Date;

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

@Entity
@Table(name = "T_REQUEST")
public class Request extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "REQ_GEN")
	@SequenceGenerator(name = "REQ_GEN", sequenceName = "REQ_SEQ", allocationSize = 1)
	@Column(name="ID_REQUEST_KEY")
	private Long requestId;

	@Column(name = "ID_INSTITUTION_KEY")
	private Long institutionId;

	@Column(name = "TX_TYPE", length = 56)
	private String type;
	
	@Column(name = "TX_STATUS", length = 56)
	private String status;
	
	@Column(name = "DT_COMPLETE")
	private Date completeDate;
	
	@Column(name = "DT_COMPLETE_REQUEST")
	private Date completeRequestDate;
	
	@Column(name = "TX_DESCRIPTION", length = 372)
	private String description;
	
	@Column(name = "TX_USER_REQ_TYPE", length = 124)
	private String userRequestType;
	
	@Column(name = "TX_USER_REQ_FORM", length = 556)
	private String userRequestForm;
	
	
	@Column(name = "ID_COMPLETE_BY")
	private Long completeBy;
	
	@Column(name = "ID_CHECKER_BY")
	private Long checkerBy;
	
	@Column(name = "DT_CHECKER")
	private Date checkerDate;
	
	
	@Column(name = "INT_SIGNATORY_KEY")
	private long signatoryId;
	
	@Column(name = "TX_REJECT_CAUSE", length = 386)
	private String rejectCause;

	@Column(name = "ID_REJECT_BY")
	private Long rejectBy;

	@Transient
	private String pa;
	
	@Transient
	@Temporal(TemporalType.DATE)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date startDate;
	
	@Transient
	@Temporal(TemporalType.DATE)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date endDate;
	
	@Transient
	private MultipartFile document;
	
	@Transient
	private String requesterEmail;
	
	@Transient
	private int pageNumber;
	
	@Transient
	private int pageSize;

	@Transient
	private String lnkSendingEmail;
	
	@Transient
	private String linkType;
	
	@Transient
	private String publicLink;


	public Long getRequestId() {
		return requestId;
	}

	public void setRequestId(Long requestId) {
		this.requestId = requestId;
	}

	public Long getInstitutionId() {
		return institutionId;
	}

	public void setInstitutionId(Long institutionId) {
		this.institutionId = institutionId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPa() {
		return pa;
	}

	public void setPa(String pa) {
		this.pa = pa;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public long getSignatoryId() {
		return signatoryId;
	}

	public void setSignatoryId(long signatoryId) {
		this.signatoryId = signatoryId;
	}

	public MultipartFile getDocument() {
		return document;
	}

	public void setDocument(MultipartFile document) {
		this.document = document;
	}

	public Date getCompleteDate() {
		return completeDate;
	}

	public void setCompleteDate(Date completeDate) {
		this.completeDate = completeDate;
	}

	public Long getCompleteBy() {
		return completeBy;
	}

	public void setCompleteBy(Long completeBy) {
		this.completeBy = completeBy;
	}

	public Date getCompleteRequestDate() {
		return completeRequestDate;
	}

	public void setCompleteRequestDate(Date completeRequestDate) {
		this.completeRequestDate = completeRequestDate;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getRequesterEmail() {
		return requesterEmail;
	}

	public void setRequesterEmail(String requesterEmail) {
		this.requesterEmail = requesterEmail;
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

	public Long getCheckerBy() {
		return checkerBy;
	}

	public void setCheckerBy(Long checkerBy) {
		this.checkerBy = checkerBy;
	}

	public Date getCheckerDate() {
		return checkerDate;
	}

	public void setCheckerDate(Date checkerDate) {
		this.checkerDate = checkerDate;
	}

	public String getLnkSendingEmail() {
		return lnkSendingEmail;
	}

	public void setLnkSendingEmail(String lnkSendingEmail) {
		this.lnkSendingEmail = lnkSendingEmail;
	}

	public String getLinkType() {
		return linkType;
	}

	public void setLinkType(String linkType) {
		this.linkType = linkType;
	}

	public String getPublicLink() {
		return publicLink;
	}

	public void setPublicLink(String publicLink) {
		this.publicLink = publicLink;
	}

	public String getRejectCause() {
		return rejectCause;
	}

	public void setRejectCause(String rejectCause) {
		this.rejectCause = rejectCause;
	}

	public Long getRejectBy() {
		return rejectBy;
	}

	public void setRejectBy(Long rejectBy) {
		this.rejectBy = rejectBy;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}


}
