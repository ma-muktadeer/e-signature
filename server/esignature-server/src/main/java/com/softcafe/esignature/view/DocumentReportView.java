package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="VW_DOC_REPORT")
public class DocumentReportView extends ReportBase{
	@Column(name = "TX_NAME")
	private String userName;
	
	@Column(name = "TX_PA")
	private String pa;

	@Column(name = "DTT_AGREEMENT_FILE")
	private Date agreementFileDate;
	
	@Column(name = "DTT_APPROVAL_FILE")
	private Date approvalFileDate;
	
	@Column(name = "DTT_CANCELATION_SIRCULAR")
	private Date cancelCircular;
	
	@Column(name="DTT_CREATE")
	private Date createDate;
	
	@Column(name="DTT_SIGNATURE_CREATE")
	private Date signatureCreateDate;
	
	@Column(name="DTT_CANCELATION_APPROVAL")
	private Date cancellationApproval;
	
	@Column(name="DTT_ACTIVE")
	private Date activeDate;
	
	@Column(name="DTT_CANCELLATION")
	private Date cancelationDate;
	
	@Column(name="DTT_INACTIVE")
	private Date inactiveDate;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPa() {
		return pa;
	}

	public void setPa(String pa) {
		this.pa = pa;
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

	public Date getCancelCircular() {
		return cancelCircular;
	}

	public void setCancelCircular(Date cancelCircular) {
		this.cancelCircular = cancelCircular;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getSignatureCreateDate() {
		return signatureCreateDate;
	}

	public void setSignatureCreateDate(Date signatureCreateDate) {
		this.signatureCreateDate = signatureCreateDate;
	}

	public Date getCancellationApproval() {
		return cancellationApproval;
	}

	public void setCancellationApproval(Date cancellationApproval) {
		this.cancellationApproval = cancellationApproval;
	}

	public Date getActiveDate() {
		return activeDate;
	}

	public void setActiveDate(Date activeDate) {
		this.activeDate = activeDate;
	}

	public Date getCancelationDate() {
		return cancelationDate;
	}

	public void setCancelationDate(Date cancelationDate) {
		this.cancelationDate = cancelationDate;
	}

	public Date getInactiveDate() {
		return inactiveDate;
	}

	public void setInactiveDate(Date inactiveDate) {
		this.inactiveDate = inactiveDate;
	}
	


}
